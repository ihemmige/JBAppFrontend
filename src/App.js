import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { useForm } from "react-hook-form";
import { format } from "react-string-format";

function App() {
  const [jobs, setJobs] = useState([{}]);
  const [displaying, setDisplaying] = useState(false);

  useEffect(() => {
    setJobs({});
    setDisplaying(false);
    getStoredJobs();
  }, []);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    postNewJob(data);
    reset();
  };

  const postNewJob = async (data) => {
    let url = format(
      "https://jbappbackend.azurewebsites.net/jobs?company={0}&title={1}&location={2}&salary={3}", data["company"], data["title"], data["location"], data["salary"]
      );
    axios.post(url, {
      company: data["company"],
      title: data["title"],
      location: data["location"],
      salary: data["salary"]
    })
    .then(function (response) {
      getStoredJobs();
    }).catch(function (error) {

    });
  };

  const deleteJobs = async () => {
    let url = format(
      "https://jbappbackend.azurewebsites.net/jobs",
    );
    axios
      .delete(url)
      .then(function (response) {
        getStoredJobs();
      })
      .catch(function (error) {

      });
  };

  const getStoredJobs = async () => {
    let url = format(
      "https://jbappbackend.azurewebsites.net/jobs",
    );
    axios
      .get(url)
      .then(function (response) {
        setJobs(response.data);
        setDisplaying(true);
      }
      )
      .catch(function (error) {
        
      });
  };

  return (
    <div className="App">
      {
        <form class="form" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="text"
              placeholder="Job Title"
              name="job-title"
              class="text-box"
              {...register("title", { required: true })}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Company"
              name="company"
              class="text-box"
              {...register("company", { required: true })}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Location"
              name="location"
              class="text-box"
              {...register("location", { required: true })}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Annual Salary"
              name="salary"
              class="text-box"
              {...register("salary", { required: true })}
            />
          </div>
          <input class="text-box submit" type="submit" />
        </form>
      }
      <button onClick={getStoredJobs} class="text-box">
        Refresh Jobs
      </button>
      <div class="jobs_list">
        {displaying && jobs.result.map((job, i) => (
          <div  class="container">
            <div key={i}>
              <p class="title">
                {job["title"]}
              </p>
              <p class="company">
                {job["company"]}
              </p>
            </div>
            <div>
              <p class="location">
                {job["location"]}
              </p>
              <p class="salary">
                ${job["salary"].toLocaleString()}/year
              </p>
            </div>
          </div>
          ))}
      </div>

      <button onClick={deleteJobs} class="text-box delete">
        Delete All Jobs
      </button>
      
    </div>
  );
}

export default App;