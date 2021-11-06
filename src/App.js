import React, { useState, useEffect } from "react";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import Table from "./components/Table";
import Chart from "./components/Chart";
import { getData } from "./request/api.js";
import "./App.css";

function App() {
  const [loanData, setLoanData] = useState([]);
  const [dataAggregation, setDataAggregation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  // State to record the selected dropdown options
  const [selectedValues, setSelectedValues] = useState({
    homeOwnership: [],
    quarter: [],
    term: [],
    year: [],
  });
  // Function to reset to the initial state
  const resetState = () => {
    setSelectedValues({
      homeOwnership: [],
      quarter: [],
      term: [],
      year: [],
    });
    let buttons = document.querySelectorAll('.msl-clear-btn'); 
    for (let i = 0; i < buttons.length; ++i) {
      buttons[i].click();
    };
  };

  // Function to handle the dropdown selection changes
  const handleSelectOnchange = (val) => {
    if (val.length !== 0) {
      let group = val[0].group;
      setSelectedValues({
        ...selectedValues,
        [group]: val.map((element) => {
          return element.value;
        }),
      });
    } else {
      setSelectedValues({
        homeOwnership: [],
        quarter: [],
        term: [],
        year: [],
      });
    }
  };

  // Function that initializes the app and data
  const initialSetup = () => {
    const fetchData = () => {
      getData()
        .then((data) => {
          setLoanData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setIsError(true);
          console.log(error);
        });
    };
    fetchData();
  };

  // Data fetch effect hook
  useEffect(() => {
    initialSetup();
  }, []);
  // Data aggregation effect hook
  useEffect(() => {
    aggregator();
  }, [isLoading]);
  // Selector effect hook
  useEffect(() => {
    aggregator();
  }, [selectedValues]);

  // Filter aggregation algorithm
  const aggregator = () => {
    const aggregationFilter = () => {
      let aggregatedData = loanData;

      const individualFilter = (arr1, arr2, group) => {
        let res = [];
        res = arr1.filter((el) => {
          return !arr2.find((element) => {
            return element === el[group];
          });
        });
        return res;
      };

      for (const group in selectedValues) {
        aggregatedData = individualFilter(
          aggregatedData,
          selectedValues[group],
          group
        );
      }
      return aggregatedData;
    };
    const aggregatedData = aggregationFilter();

    // Main data aggregation algorithm
    var aggregation = [];
    aggregatedData.reduce((res, value) => {
      if (!res[value.grade]) {
        res[value.grade] = { grade: value.grade, currentBalance: 0 };
        aggregation.push(res[value.grade]);
      }
      res[value.grade].currentBalance += parseFloat(value.currentBalance);
      return res;
    }, {});
    setDataAggregation(aggregation);
  };

  // Set of functions to get the drop down options from the data
  const homeOwnershipOptions = () => {
    return [...new Set(loanData.map((obj) => obj.homeOwnership))]
      .map((obj) => {
        return {
          label: obj,
          value: obj,
          group: "homeOwnership",
        };
      })
      .sort((a, b) => {
        if (a.value > b.value) {
          return 1;
        } else if (a.value < b.value) {
          return -1;
        }
        return 0;
      });
  };
  const quarterOptions = () => {
    return [...new Set(loanData.map((obj) => obj.quarter))]
      .map((obj) => {
        return {
          label: obj,
          value: obj,
          group: "quarter",
        };
      })
      .sort((a, b) => a.value - b.value);
  };
  const termOptions = () => {
    return [...new Set(loanData.map((obj) => obj.term))]
      .map((obj) => {
        return {
          label: obj,
          value: obj,
          group: "term",
        };
      })
      .sort((a, b) => a.value - b.value);
  };
  const yearOptions = () => {
    return [...new Set(loanData.map((obj) => obj.year))]
      .map((obj) => {
        return {
          label: obj,
          value: obj,
          group: "year",
        };
      })
      .sort((a, b) => a.value - b.value);
  };

  // Prepare the columns object
  const columns = React.useMemo(() =>
    dataAggregation
      .map((item, idx) => {
        return {
          Header: "Grade " + item.grade,
          accessor: item.grade,
        };
      })
      .sort((a, b) => (a.Header > b.Header ? 1 : -1))
  );

  // Rendering
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="App">
      <p>DV01 Code Challenge</p>
      {loanData && dataAggregation && (
        <div className="container">
          <Table columns={columns} data={dataAggregation} />
          <div className="dropdownContainer">
            <MultiSelect
              placeholder="Home Ownership"
              onChange={handleSelectOnchange}
              options={homeOwnershipOptions}
              defaultValue={"all"}
              disableChip={true}
              jsonValue={true}
            />
            <MultiSelect
              placeholder="Quarter"
              onChange={handleSelectOnchange}
              options={quarterOptions}
              defaultValue={"all"}
              disableChip={true}
              jsonValue={true}
            />
            <MultiSelect
              placeholder="Term"
              onChange={handleSelectOnchange}
              options={termOptions}
              defaultValue={"all"}
              disableChip={true}
              jsonValue={true}
            />
            <MultiSelect
              placeholder="Year"
              onChange={handleSelectOnchange}
              options={yearOptions}
              defaultValue={"all"}
              disableChip={true}
              jsonValue={true}
            />
          </div>
          <div className="chart">
            <Chart resultSet={dataAggregation} />
          </div>
          <div className="buttonContainer">
            <button onClick={() => resetState()}>Reset</button>
          </div>
        </div>
      )}
      {isError && <div>Error fetching data.</div>}
    </div>
  );
}

export default App;