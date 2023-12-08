const express = require("express");
const apiMocker = require("connect-api-mocker");

const app = express();

app.use("/", apiMocker("mocks"));

app.listen(8080);
