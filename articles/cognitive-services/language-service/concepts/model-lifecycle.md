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
ms.date: 05/09/2022
ms.author: aahi
---

# Model lifecycle

Language service features utilize AI models that are versioned. We update the language service with new model versions to improve accuracy, support, and quality. As models become older, they are retired. Use this article for information on that process, and what you can expect for your applications.

## Prebuilt features

### Expiration timeline

Our standard (not customized) language service is built upon AI models that we call pre-trained models. We update the language service with new model versions every few months to improve model accuracy, support, and quality.

Pre-built Model Capabilities: As new models and new functionality become available and older, less accurate models are retired. Unless otherwise noted, retired pre-built models will be automatically updated to the newest model version.

During the model version deprecation period, API calls to the soon-to-be retired model versions will return a warning. After model-version deprecation, API calls to deprecated model-versions will return responses using the newest model version with an additional warning message. So, your implementation will never break, but results might change.

The model-version retirement period is defined as: the period of time from a release of a newer model-version for the capability, until a specific older version is deprecated. This period is defined as six months for stable model versions, and three months for previews. For example, a stable model-version `2021-01-01` will be deprecated six months after a successor model-version `2021-07-01` is released, on January 1, 2022. Preview capabilities in preview APIs do not maintain a minimum retirement period and can be deprecated at any time.


#### Choose the model-version used on your data

By default, API requests will use the latest Generally Available model. You can use an optional parameter to select the version of the model to be used.

> [!TIP] 
> If you’re using the SDK for C#, Java, JavaScript or Python, see the reference documentation for information on the appropriate model-version parameter.
For synchronous endpoints, use the `model-version` query parameter. For example:

POST `<resource-url>/text/analytics/v3.1/sentiment?model-version=2021-10-01-preview`.

For asynchronous endpoints, use the `model-version` property in the request body under task properties. 
 
The model-version used in your API request will be included in the response object.


Use the table below to find which model versions are supported by each feature:


| Feature                                             | Supported versions                                                  | Latest Generally Available version | Latest preview version |
|-----------------------------------------------------|---------------------------------------------------------------------|------------------------------------|------------------------|
| Sentiment Analysis and opinion mining               | `2019-10-01`                                                        | `2021-10-01`                       |                        |
| Language Detection                                  | `2021-11-20`                                                        | `2021-11-20`                       |                        |
| Entity Linking                                      | `2021-06-01`                                                        | `2021-06-01`                       |                        |
| Named Entity Recognition (NER)                      | `2021-06-01`                                                        | `2021-06-01`                       |                        |
| Personally Identifiable Information (PII) detection | `2020-07-01`, `2021-01-15`                                          | `2021-01-15`                       |                        |
| Question answering                                  | `2021-10-01`                                                        | `2021-10-01`                       |                        |
| Text Analytics for health                           | `2021-05-15`, `2022-03-01`                                          | `2022-03-01`                       |                        |
| Key phrase extraction                               | `2021-06-01`                                                        | `2021-06-01`                       |                        |
| Text summarization                                  | `2021-08-01`                                                        | `2021-08-01`                       |                        |


## Custom features

### Expiration timeline

As new training configs and new functionality become available; older and less accurate configs are retired, see the following timelines for configs expiration:

New configs are being released every few months. So, training configs expiration of any publicly available config is **six months** after its release. If you have assigned a trained model to a deployment, this deployment expires after **twelve months** from the training config expiration.

After training config version expires, API calls will return an error when called or used if called with an expired config version. By default, training requests will use the latest available training config version. To change the config version, use `trainingConfigVersion` when submitting a training job and assign the version you want.

> [!Tip]
> It's recommended to use the latest supported config version

You can train and deploy a custom AI model from the date of training config version release, up until the **Training config expiration** date. After this date, you will have to use another supported training config version for submitting any training or deployment jobs.

Deployment expiration is when your deployed model will be unavailable to be used for prediction.

Use the table below to find which model versions are supported by each feature:

| Feature                                     | Supported Training config versions         | Training config expiration         | Deployment expiration  |
|---------------------------------------------|--------------------------------------------|------------------------------------|------------------------|
| Custom text classification                  | `2022-05-01`                               | `10/28/2022`                       | `10/28/2023`           |
| Conversational language understanding       | `2022-05-01`                               | `10/28/2022`                       | `10/28/2023`           |
| Custom named entity recognition                                  | `2022-05-01`                               | `10/28/2022`                       | `10/28/2023`           |
| Orchestration workflow                      | `2022-05-01`                               | `10/28/2022`                       | `10/28/2023`           |


## API versions

When you're making API calls to the following features, you need to specify the `API-VERISON` you want to use to complete your request. It's recommended to use the latest available API versions.

If you are using the [Language Studio](https://aka.ms/languageStudio) for building your project you will be using the latest API version available. If you need to use another API version this is only available directly through APIs.

Use the table below to find which API versions are supported by each feature:

| Feature                                             | Supported versions                                                  | Latest Generally Available version | Latest preview version |
|-----------------------------------------------------|---------------------------------------------------------------------|------------------------------------|------------------------|
| Custom text classification                  | `2022-03-01-preview`                               |                       | `2022-03-01-preview`             |
| Conversational language understanding       | `2022-03-01-preview`                               |                        | `2022-03-01-preview`           |
| Custom named entity recognition             | `2022-03-01-preview`                               |                        | `2022-03-01-preview`             |
| Orchestration workflow                      | `2022-03-01-preview`                               |                        | `2022-03-01-preview`              |


## Next steps

[Azure Cognitive Service for Language overview](../overview.md)
