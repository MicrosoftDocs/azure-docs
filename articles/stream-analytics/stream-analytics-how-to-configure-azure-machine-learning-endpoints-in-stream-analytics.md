---
title: Use Machine Learning Studio (classic) endpoints in Azure Stream Analytics
description: This article describes how to use Machine Language user defined functions in Azure Stream Analytics.
ms.service: stream-analytics
ms.topic: how-to
ms.date: 06/11/2019
---
# Machine Learning Studio (classic) integration in Stream Analytics

[!INCLUDE [ML Studio (classic) retirement](../../includes/machine-learning-studio-classic-deprecation.md)]

Stream Analytics supports user-defined functions that call out to Machine Learning Studio (classic) endpoints. REST API support for this feature is detailed in the [Stream Analytics REST API library](/rest/api/streamanalytics/). This article provides supplemental information needed for successful implementation of this capability in Stream Analytics. A tutorial has also been posted and is available [here](stream-analytics-machine-learning-integration-tutorial.md).

## Overview: Machine Learning Studio (classic) terminology
Microsoft Machine Learning Studio (classic) provides a collaborative, drag-and-drop tool you can use to build, test, and deploy predictive analytics solutions on your data. This tool is called *Machine Learning Studio (classic)*. Studio (classic) is used to interact with the machine learning resources and easily build, test, and iterate on your design. These resources and their definitions are below.

* **Workspace**: The *workspace* is a container that holds all other machine learning resources together in a container for management and control.
* **Experiment**: *Experiments* are created by data scientists to utilize datasets and train a machine learning model.
* **Endpoint**: *Endpoints* are the Studio (classic) object used to take features as input, apply a specified machine learning model and return scored output.
* **Scoring Webservice**: A *scoring webservice* is a collection of endpoints as mentioned above.

Each endpoint has apis for batch execution and synchronous execution. Stream Analytics uses synchronous execution. The specific service is named a [Request/Response Service](../machine-learning/classic/consume-web-services.md) in Machine Learning Studio (classic).

## Studio (classic) resources needed for Stream Analytics jobs
For the purposes of Stream Analytics job processing, a Request/Response endpoint, an [apikey](../machine-learning/classic/consume-web-services.md), and a swagger definition are all necessary for successful execution. Stream Analytics has an additional endpoint that constructs the url for swagger endpoint, looks up the interface and returns a default UDF definition to the user.

## Configure a Stream Analytics and Studio (classic) UDF via REST API
By using REST APIs you may configure your job to call Studio (classic) functions. The steps are as follows:

1. Create a Stream Analytics job
2. Define an input
3. Define an output
4. Create a user-defined function (UDF)
5. Write a Stream Analytics transformation that calls the UDF
6. Start the job

## Creating a UDF with basic properties
As an example, the following sample code creates a scalar UDF named *newudf* that binds to an Machine Learning Studio (classic) endpoint. Note that the *endpoint* (service URI) can be found on the API help page for the chosen service and the *apiKey* can be found on the Services main page.

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

## Call RetrieveDefaultDefinition endpoint for default UDF
Once the skeleton UDF is created the complete definition of the UDF is needed. The RetrieveDefaultDefinition endpoint helps you get the default definition for a scalar function that is bound to an Machine Learning Studio (classic) endpoint. The payload below requires you to get the default UDF definition for a scalar function that is bound to a Studio (classic) endpoint. It doesn't specify the actual endpoint as it has already been provided during PUT request. Stream Analytics calls the endpoint provided in the request if it is provided explicitly. Otherwise it uses the one originally referenced. Here the UDF takes a single string parameter (a sentence) and returns a single output of type string which indicates the "sentiment" label for that sentence.

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

A sample output of this would look something like below.

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

## Patch UDF with the response
Now the UDF must be patched with the previous response, as shown below.

```
PATCH : /subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.StreamAnalytics/streamingjobs/<streamingjobName>/functions/<udfName>?api-version=<apiVersion>
```

Request Body (Output from RetrieveDefaultDefinition):

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

## Implement Stream Analytics transformation to call the UDF
Now query the UDF (here named scoreTweet) for every input event and write a response for that event to an output.

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
For further assistance, try our [Microsoft Q&A question page for Azure Stream Analytics](/answers/topics/azure-stream-analytics.html)

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics Management REST API Reference](/rest/api/streamanalytics/)
