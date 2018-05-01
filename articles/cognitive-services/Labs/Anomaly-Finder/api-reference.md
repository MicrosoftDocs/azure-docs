``` json
{
  "swagger": "2.0",
  "info": {
    "description": "The Anomaly Finder API enables you to monitor data over time and detect anomalies with machine learning that adapts to your unique data by automatically applying the right statistical model. This enables organizations to maintain data quality, provide reliable services, identify business incidents and refine their business approach without tackling the tough problems of identifying abnormal data manually.",
    "version": "1.0.0",
    "title": "Anomaly Finder API",
    "contact": {
      "email": "kenshoteam@microsoft.com"
    }
  },
  "host": "westcentralus.api.cognitive.microsoft.com",
  "basePath": "/api/1.0",
  "tags": [
    {
      "name": "anomalydetection",
      "description": "The API enables you to monitor data over time and detect anomalies with machine learning that adapts to your unique data by automatically applying the right statistical model."
    }
  ],
  "schemes": [
    "https"
  ],
  "paths": {
    "/anomalydetection": {
      "post": {
        "tags": [
          "anomalydetection"
        ],
        "summary": "Detect anomaly points for the time series data points requested.",
        "description": "",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "The time series data points and period if needed.",
            "required": true,
            "schema": {
              "$ref": "#/definitions/request"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation.",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/response"
              }
            }
          },
          "400": {
            "description": "Can not parse JSON request."
          },
          "403": {
            "description": "The certificate you provided is not accepted by server."
          },
          "405": {
            "description": "Method Not Allowed."
          },
          "500": {
            "description": "Internal Server Error."
          }
        }
      }
    }
  },
  "definitions": {
    "point": {
      "type": "object",
      "properties": {
        "Timestamp": {
          "type": "string",
          "format": "date-time",
          "description": "The timestamp for the data point. Please make sure it aligns with the midnight, and use a UTC date time string, e.g., 2017-08-01T00:00:00Z."
        },
        "Value": {
          "type": "number",
          "format": "double",
          "description": "A data measure value."
        }
      }
    },
    "request": {
      "type": "object",
      "properties": {
        "Period": {
          "type": "number",
          "format": "double",
          "description": "The period of the data points. If the value is null or does not present, the API will determine the period automatically."
        },
        "Points": {
          "description": "The time series data points. The data should be sorted by timestamp ascending to match the anomaly result. If the data is not sorted correctly or there is duplicated timestamp, the API will detect the anomaly points correctly, but you could not well match the points returned with the input. In such case, a warning message will be added in the response.",
          "type": "array",
          "items": {
            "$ref": "#/definitions/point"
          }
        }
      }
    },
    "response": {
      "type": "object",
      "properties": {
        "Period": {
          "description": "The period that the API used to detect the anomaly points.",
          "type": "number",
          "format": "float"
        },
        "ExpectedValues": {
          "description": "This is a array which contains the expected value for each point input. If the input data points are sorted by timestamp ascending, the index of the array can be used to map the expected value and original value.",
          "type": "array",
          "items": {
            "type": "number",
            "format": "double"
          }
        },
        "UpperMargin": {
          "description": "This is a array which contains the upper magin for each point input. If the input data points are sorted by timestamp ascending, the index of the array can be used to map the expected value and original value.",
          "type": "array",
          "items": {
            "type": "number",
            "format": "double"
          }
        },
        "LowerMargin": {
          "description": "This is a array which contains the lower magin for each point input. If the input data points are sorted by timestamp ascending, the index of the array can be used to map the expected value and original value.",
          "type": "array",
          "items": {
            "type": "number",
            "format": "double"
          }
        },
        "IsAnomaly": {
          "description": "This is a array which contains one of the anomaly properties for each point input. true means the point is anomaly, false means the point is non-anomaly. If the input data points are sorted by timestamp ascending, the index of the array can be used to map the expected value and original value.",
          "type": "array",
          "items": {
            "type": "boolean"
          }
        },
        "IsAnomaly_Neg": {
          "description": "This is a array which contains one of the anomaly properties for each point input. true means the direction of the anomaly is negitive. If the input data points are sorted by timestamp ascending, the index of the array can be used to map the expected value and original value.",
          "type": "array",
          "items": {
            "type": "boolean"
          }
        },
        "IsAnomaly_Pos": {
          "description": "This is a array which contains one of the anomaly properties for each point input. true means the direction of the anomaly is positive. If the input data points are sorted by timestamp ascending, the index of the array can be used to map the expected value and original value.",
          "type": "array",
          "items": {
            "type": "boolean"
          }
        },
        "WarningText": {
          "type": "string",
          "description": "If the input data points provided are not following the rule that the API requires, and the data can still be detected by the API, the API will analyze the data and append the warning information in this field."
        }
      }
    }
  }
}
```