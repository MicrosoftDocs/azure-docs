---
title: Model Lifecycle of Language service models
titleSuffix: Azure Cognitive Services
description: This article describes the timelines for models and model versions used by Language service features.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 04/21/2022
ms.author: aahi
---

# Model lifecycle

Language service features utilize AI models that are versioned. We update the language service with new model versions to improve accuracy, support, and quality. As models become older, they are retired. Use this article for information on that process, and what you can expect for your applications.

### Expiration timeline

As new models and new functionality become available and older, less accurate models are retired, see the following timelines for model and endpoint expiration:

New Language AI models are being released every few months. So, an expiration of any publicly available model is six months after a deprecation notice is issued followed by new model-version release. 

Model-version retirement period is defined from a release of a newer model-version for the capability until a specific older version is deprecated. This period is defined as six months for stable model versions, and three months for previews. For example, a stable model-version `2021-01-01` will be deprecated six months after a successor model-version `2021-07-01` is released, on January 1, 2022. Preview capabilities in preview APIs do not maintain a minimum retirement period and can be deprecated at any time.

After model-version deprecation, API calls to deprecated model-versions will return an error. 

## Choose the model-version used on your data

By default, API requests will use the latest Generally Available model. You can use an optional parameter to select the version of the model to be used. To use preview versions, you must specify this parameter. 

> [!TIP] 
> If you’re using the SDK for C#, Java, JavaScript or Python, see the reference documentation for information on the appropriate model-version parameter.

For synchronous endpoints, use the `model-version` query parameter. For example:

POST `<resource-url>/text/analytics/v3.1/sentiment?model-version=2021-10-01-preview`.

For asynchronous endpoints, use the `model-version` property in the request body under task properties. 
 
The model-version used in your API request will be included in the response object.


## Available versions

Use the table below to find which model versions are supported by each feature.


| Feature                                             | Supported versions                                                  | Latest Generally Available version | Latest preview version |
|-----------------------------------------------------|---------------------------------------------------------------------|------------------------------------|------------------------|
| Custom text classification                          | `2021-11-01-preview`                                                |                                    | `2021-11-01-preview`   |
| Conversational language understanding               | `2021-11-01-preview`                                                |                                    | `2021-11-01-preview`   |
| Sentiment Analysis and opinion mining               | `2019-10-01`, `2020-04-01`, `2021-10-01`                            | `2021-10-01`                       |                        |
| Language Detection                                  | `2019-10-01`, `2020-07-01`, `2020-09-01`, `2021-01-05`              | `2021-01-05`                       |                        |
| Entity Linking                                      | `2019-10-01`, `2020-02-01`                                          | `2020-02-01`                       |                        |
| Named Entity Recognition (NER)                      | `2019-10-01`, `2020-02-01`, `2020-04-01`,`2021-01-15`,`2021-06-01`  | `2021-06-01`                       |                        |
| Custom NER                                          | `2021-11-01-preview`                                                |                                    | `2021-11-01-preview`   |
| Personally Identifiable Information (PII) detection | `2019-10-01`, `2020-02-01`, `2020-04-01`,`2020-07-01`, `2021-01-15` | `2021-01-15`                       |                        |
| Question answering                                  | `2021-10-01`                                                        | `2021-10-01`                                  |
| Text Analytics for health                           | `2021-05-15`, `2022-03-01`                                                        | `2022-03-01`                       |                        |
| Key phrase extraction                               | `2019-10-01`, `2020-07-01`, `2021-06-01`                            | `2021-06-01`                       |                        |
| Text summarization                                  | `2021-08-01`                                                        | `2021-08-01`                       |                        |

## Next steps

[Azure Cognitive Service for Language overview](../overview.md)
