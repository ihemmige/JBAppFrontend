import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { useForm } from "react-hook-form";
import { format } from "react-string-format";
// import "bootstrap/dist/css/bootstrap.min.css";

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
    
    // var temp = [];
    // if (jobs.result) {
    //   temp = jobs.result;
    // }
    // else {
    //   temp = [];
    // }
    // temp.push({"company": data.company, "title": data.title, "location": data.location, "salary": data.salary});
    // setJobs({"result": temp});
    
    reset();
    // getRouteWeather(data.origin, data.destination);
  };

  const postNewJob = async (data) => {
    let url = format(
      "https://jbappbackend.azurewebsites.net/jobs?company={0}&title={1}&location={2}&salary={3}", data["company"], data["title"], data["location"], data["salary"]
      );
    // let url = format(
    //   "http://127.0.0.1:5000/jobs?company={0}&title={1}&location={2}&salary={3}", data["company"], data["title"], data["location"], data["salary"]
    // );
    axios.post(url, {
      company: data["company"],
      title: data["title"],
      location: data["location"],
      salary: data["salary"]
    })
    .then(function (response) {
      getStoredJobs();
    }).catch(function (error) {
      console.log(error)
    });
  };


  const getStoredJobs = async () => {
    let url = format(
      "https://jbappbackend.azurewebsites.net/jobs",
    );
    // let url = "http://127.0.0.1:5000/jobs";
    
    axios
      .get(url)
      .then(function (response) {
        setJobs(response.data);
        setDisplaying(true);
      }
      )
      .catch(function (error) {
        // console.log(error)
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
              class="first-box"
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
          <input class="text-box" type="submit" />
        </form>
      }

      {displaying && jobs.result.map((job, i) => (
          <div class="container">
            <p key={i}>
              {job["title"]}, {job["location"]}, {job["company"]}, {job["salary"]}
            </p>
          </div>
        ))}
      
    </div>
  );
}

export default App;