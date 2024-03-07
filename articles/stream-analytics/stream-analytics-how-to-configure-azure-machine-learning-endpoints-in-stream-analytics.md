---
title: Use Machine Learning Studio (classic) endpoints in Azure Stream Analytics
description: This article describes how to use Machine Learning user-defined functions in Azure Stream Analytics.
ms.service: stream-analytics
ms.topic: how-to
ms.date: 06/11/2019
---
# Machine Learning Studio (classic) integration in Stream Analytics

[!INCLUDE [ML Studio (classic) retirement](../../includes/machine-learning-studio-classic-deprecation.md)]

Azure Stream Analytics supports user-defined functions (UDFs) that call out to Azure Machine Learning Studio (classic) endpoints. The [Stream Analytics REST API library](/rest/api/streamanalytics/) describes REST API support for this feature.

This article provides supplemental information that you need for successful implementation of this capability in Stream Analytics. A [tutorial](stream-analytics-machine-learning-integration-tutorial.md) is also available.

## Overview: Machine Learning Studio (classic) terminology

Machine Learning Studio (classic) provides a collaborative, drag-and-drop tool that you can use to build, test, and deploy predictive analytics solutions on your data. You can use Machine Learning Studio (classic) to interact with these machine learning resources:

* **Workspace**: A container that holds all other machine learning resources together for management and control.
* **Experiment**: A test that data scientists create to utilize datasets and train a machine learning model.
* **Endpoint**: An object that you use to take features as input, apply a specified machine learning model, and return scored output.
* **Scoring web service**: A collection of endpoints.

Each endpoint has APIs for batch execution and synchronous execution. Stream Analytics uses synchronous execution. The specific service is called a [request/response service](../machine-learning/classic/consume-web-services.md) in Machine Learning Studio (classic).

## Machine Learning Studio (classic) resources needed for Stream Analytics jobs

For the purposes of Stream Analytics job processing, a request/response endpoint, an [API key](../machine-learning/classic/consume-web-services.md), and a Swagger definition are all necessary for successful execution. Stream Analytics has an additional endpoint that constructs the URL for a Swagger endpoint, looks up the interface, and returns a default UDF definition to the user.

## Configure a Stream Analytics and Machine Learning Studio (classic) UDF via REST API

By using REST APIs, you can configure your job to call Machine Learning Studio (classic) functions:

1. Create a Stream Analytics job.
2. Define an input.
3. Define an output.
4. Create a UDF.
5. Write a Stream Analytics transformation that calls the UDF.
6. Start the job.

## Create a UDF with basic properties

As an example, the following sample code creates a scalar UDF named *newudf* that binds to a Machine Learning Studio (classic) endpoint. You can find the `endpoint` value (service URI) on the API help page for the chosen service. You can find the `apiKey` value on the service's main page.

```
PUT : /subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.StreamAnalytics/streamingjobs/<streamingjobName>/functions/<udfName>?api-version=<apiVersion>
```

Example request body:

```json
    {
        "name": "newudf",
        "properties": {
            "type": "Scalar",
            "properties": {
                "binding": {
                    "type": "Microsoft.MachineLearning/WebService",
                    "properties": {
                        "endpoint": "https://ussouthcentral.services.azureml.net/workspaces/f80d5d7a77fb4b46bf2a30c63c078dca/services/b7be5e40fd194258796fb402c1958eaf/execute ",
                        "apiKey": "replacekeyhere"
                    }
                }
            }
        }
    }
```

## Call the RetrieveDefaultDefinition endpoint for the default UDF

After you create the skeleton UDF, you need the complete definition of the UDF. The `RetrieveDefaultDefinition` endpoint helps you get the default definition for a scalar function that's bound to a Machine Learning Studio (classic) endpoint.

The following payload requires you to get the default UDF definition for a scalar function that's bound to a Studio (classic) endpoint. It doesn't specify the actual endpoint, because the `PUT` request already provided it.

Stream Analytics calls the endpoint from the request, if the request explicitly provided an endpoint. Otherwise, Stream Analytics uses the endpoint that was originally referenced. Here, the UDF takes a single string parameter (a sentence) and returns a single output of type `string` that indicates the `Sentiment` label for that sentence.

```
POST : /subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.StreamAnalytics/streamingjobs/<streamingjobName>/functions/<udfName>/RetrieveDefaultDefinition?api-version=<apiVersion>
```

Example request body:

```json
    {
        "bindingType": "Microsoft.MachineLearning/WebService",
        "bindingRetrievalProperties": {
            "executeEndpoint": null,
            "udfType": "Scalar"
        }
    }
```

The output of this request looks something like the following example:

```json
    {
        "name": "newudf",
        "properties": {
            "type": "Scalar",
            "properties": {
                "inputs": [{
                    "dataType": "nvarchar(max)",
                    "isConfigurationParameter": null
                }],
                "output": {
                    "dataType": "nvarchar(max)"
                },
                "binding": {
                    "type": "Microsoft.MachineLearning/WebService",
                    "properties": {
                        "endpoint": "https://ussouthcentral.services.azureml.net/workspaces/f80d5d7a77ga4a4bbf2a30c63c078dca/services/b7be5e40fd194258896fb602c1858eaf/execute",
                        "apiKey": null,
                        "inputs": {
                            "name": "input1",
                            "columnNames": [{
                                "name": "tweet",
                                "dataType": "string",
                                "mapTo": 0
                            }]
                        },
                        "outputs": [{
                            "name": "Sentiment",
                            "dataType": "string"
                        }],
                        "batchSize": 10
                    }
                }
            }
        }
    }
```

## Patch the UDF with the response

Now, you must patch the UDF with the previous response.

```
PATCH : /subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.StreamAnalytics/streamingjobs/<streamingjobName>/functions/<udfName>?api-version=<apiVersion>
```

Request body (output from `RetrieveDefaultDefinition`):

```json
    {
        "name": "newudf",
        "properties": {
            "type": "Scalar",
            "properties": {
                "inputs": [{
                    "dataType": "nvarchar(max)",
                    "isConfigurationParameter": null
                }],
                "output": {
                    "dataType": "nvarchar(max)"
                },
                "binding": {
                    "type": "Microsoft.MachineLearning/WebService",
                    "properties": {
                        "endpoint": "https://ussouthcentral.services.azureml.net/workspaces/f80d5d7a77ga4a4bbf2a30c63c078dca/services/b7be5e40fd194258896fb602c1858eaf/execute",
                        "apiKey": null,
                        "inputs": {
                            "name": "input1",
                            "columnNames": [{
                                "name": "tweet",
                                "dataType": "string",
                                "mapTo": 0
                            }]
                        },
                        "outputs": [{
                            "name": "Sentiment",
                            "dataType": "string"
                        }],
                        "batchSize": 10
                    }
                }
            }
        }
    }
```

## Implement a Stream Analytics transformation to call the UDF

Query the UDF (here named `scoreTweet`) for every input event, and write a response for that event to an output:

```json
    {
        "name": "transformation",
        "properties": {
            "streamingUnits": null,
            "query": "select *,scoreTweet(Tweet) TweetSentiment into blobOutput from blobInput"
        }
    }
```

## Get help

For further assistance, try the [Microsoft Q&A page for Azure Stream Analytics](/answers/tags/179/azure-stream-analytics).

## Next steps

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Analyze fraudulent call data with Stream Analytics and visualize results in a Power BI dashboard](stream-analytics-real-time-fraud-detection.md)
* [Scale an Azure Stream Analytics job to increase throughput](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language reference](/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics Management REST API](/rest/api/streamanalytics/)
