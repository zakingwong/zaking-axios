import NProgress from "nprogress";
import "nprogress/nprogress.css";
import qs from "qs";
import axios from "../../lib/axios";
// withCredentials
document.cookie = "a=b";

axios.get("/c8/get").then((res) => {
  console.log(res);
});

axios
  .post(
    "http://127.0.0.1:8088/c8/server2",
    {},
    {
      withCredentials: true,
    }
  )
  .then((res) => {
    console.log(res);
  });

// XSRF
const instance = axios.create({
  xsrfCookieName: "XSRF-TOKEN-D",
  xsrfHeaderName: "X-XSRF-TOKEN-D",
});

instance.get("/c8/get").then((res) => {
  console.log(res);
});

// onDownloadProgress、onUploadProgress
const instanceProgress = axios.create();

function calculatePercentage(loaded, total) {
  return Math.floor(loaded * 1.0) / total;
}

function loadProgressBar() {
  const setupStartProgress = () => {
    instanceProgress.interceptors.request.use((config) => {
      NProgress.start();
      return config;
    });
  };

  const setupUpdateProgress = () => {
    const update = (e) => {
      console.log(e);
      NProgress.set(calculatePercentage(e.loaded, e.total));
    };
    instanceProgress.defaults.onDownloadProgress = update;
    instanceProgress.defaults.onUploadProgress = update;
  };

  const setupStopProgress = () => {
    instanceProgress.interceptors.response.use(
      (response) => {
        NProgress.done();
        return response;
      },
      (error) => {
        NProgress.done();
        return Promise.reject(error);
      }
    );
  };

  setupStartProgress();
  setupUpdateProgress();
  setupStopProgress();
}

loadProgressBar();

const downloadEl = document.getElementById("download");

downloadEl.addEventListener("click", (e) => {
  instanceProgress.get("https://httpbin.org/image/jpeg");
});

const uploadEl = document.getElementById("upload");

uploadEl.addEventListener("click", (e) => {
  const data = new FormData();
  const fileEl = document.getElementById("file");
  if (fileEl.files) {
    data.append("file", fileEl.files[0]);

    instanceProgress.post("/c8/upload", data);
  }
});

// Authorization
const authInstance = axios.create();
authInstance
  .post(
    "/c8/post",
    {
      a: 1,
    },
    {
      auth: {
        username: "Yee",
        password: "123456",
      },
    }
  )
  .then((res) => {
    console.log(res);
  });

// validateStatus
axios
  .get("/c8/304")
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e.message);
  });

axios
  .get("/c8/304", {
    validateStatus(status) {
      return status >= 200 && status < 400;
    },
  })
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e.message);
  });

// paramsSerializer
axios
  .get("/c8/get", {
    params: new URLSearchParams("a=b&c=d"),
  })
  .then((res) => {
    console.log(res);
  });

axios
  .get("/c8/get", {
    params: {
      a: 1,
      b: 2,
      c: ["a", "b", "c"],
    },
  })
  .then((res) => {
    console.log(res);
  });

const instanceX = axios.create({
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: "brackets" });
  },
});

instanceX
  .get("/c8/get", {
    params: {
      a: 1,
      b: 2,
      c: ["a", "b", "c"],
    },
  })
  .then((res) => {
    console.log(res);
  });

// baseURL
const instanceB = axios.create({
  baseURL: "https://httpbin.org/",
});

instanceB.get("image/jpeg");

function getA() {
  return axios.get("/c8/A");
}

function getB() {
  return axios.get("/c8/B");
}

axios.all([getA(), getB()]).then(
  axios.spread(function (resA, resB) {
    console.log(resA.data);
    console.log(resB.data);
  })
);

axios.all([getA(), getB()]).then(([resA, resB]) => {
  console.log(resA.data);
  console.log(resB.data);
});

const fakeConfig = {
  baseURL: "https://www.baidu.com/",
  url: "/user/12345",
  params: {
    idClient: 1,
    idTest: 2,
    testString: "thisIsATest",
  },
};
console.log(axios.getUri(fakeConfig));
