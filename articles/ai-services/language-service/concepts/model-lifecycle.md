---
title: Model Lifecycle of Language service models
titleSuffix: Azure AI services
description: This article describes the timelines for models and model versions used by Language service features.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.date: 11/29/2022
ms.author: aahi
---

# Model lifecycle

Language service features utilize AI models. We update the language service with new model versions to improve accuracy, support, and quality. As models become older, they are retired. Use this article for information on that process, and what you can expect for your applications.

## Prebuilt features


Our standard (not customized) language service features are built on AI models that we call pre-trained models.

We regularly update the language service with new model versions to improve model accuracy, support, and quality.

By default, all API requests will use the latest Generally Available (GA) model.

#### Choose the model-version used on your data

We strongly recommend using the `latest` model version to utilize the latest and highest quality models. As our models improve, it’s possible that some of your model results may change. Model versions may be deprecated, so don't recommend including specified versions in your implementation. 

Preview models used for preview features do not maintain a minimum retirement period and may be deprecated at any time.

By default, API and SDK requests will use the latest Generally Available model. You can use an optional parameter to select the version of the model to be used (not recommended).

> [!NOTE]
> * If you are using an model version that is not listed in the table, then it was subjected to the expiration policy.
> * Abstractive document and conversation summarization do not provide model versions other than the latest available.

Use the table below to find which model versions are supported by each feature:

| Feature                                             | Supported versions         |
|-----------------------------------------------------|-----------------------------|
| Sentiment Analysis and opinion mining               | `2021-10-01`, `2022-06-01`,`2022-10-01`,`2022-11-01*` |
| Language Detection                                  | `2021-11-20`, `2022-10-01*` |
| Entity Linking                                      | `2021-06-01*`               |
| Named Entity Recognition (NER)                      | `2021-06-01*`, `2022-10-01-preview`, `2023-02-01-preview**`               |
| Personally Identifiable Information (PII) detection | `2021-01-15*`, `2023-01-01-preview**`  | 
| PII detection for conversations (Preview)           | `2022-05-15-preview**`      |  
| Question answering                                  | `2021-10-01*`               |
| Text Analytics for health                           | `2021-05-15`, `2022-03-01*`, `2022-08-15-preview`, `2023-01-01-preview**` |
| Key phrase extraction                               | `2021-06-01`, `2022-07-01`,`2022-10-01*` | 
| Document summarization - extractive only (preview)     | `2022-08-31-preview**`               |

\* Latest Generally Available (GA) model version

\*\* Latest preview version


## Custom features

### Expiration timeline

As new training configs and new functionality become available; older and less accurate configs are retired, see the following timelines for configs expiration:

New configs are being released every few months. So, training configs expiration of any publicly available config is **six months** after its release. If you've assigned a trained model to a deployment, this deployment expires after **twelve months** from the training config expiration. If your models are about to expire, you can retrain and redeploy your models with the latest training configuration version.

After training config version expires, API calls will return an error when called or used if called with an expired config version. By default, training requests use the latest available training config version. To change the config version, use `trainingConfigVersion` when submitting a training job and assign the version you want. 

> [!Tip]
> It's recommended to use the latest supported config version

You can train and deploy a custom AI model from the date of training config version release, up until the **Training config expiration** date. After this date, you'll have to use another supported training config version for submitting any training or deployment jobs.

Deployment expiration is when your deployed model will be unavailable to be used for prediction.

Use the table below to find which model versions are supported by each feature:

| Feature                                     | Supported Training config versions         | Training config expiration         | Deployment expiration  |
|---------------------------------------------|--------------------------------------------|------------------------------------|------------------------|
| Custom text classification                  | `2022-05-01`                               | `2023-05-01`                       | `2024-04-30`           |
| Conversational language understanding       | `2022-05-01`                               | `2022-10-28`                       | `2023-10-28`           |
| Conversational language understanding       | `2022-09-01`                               | `2023-02-28`                       | `2024-02-28`           |
| Custom named entity recognition             | `2022-05-01`                               | `2023-05-01`                       | `2024-04-30`           |
| Orchestration workflow                      | `2022-05-01`                               | `2023-05-01`                       | `2024-04-30`           |


## API versions

When you're making API calls to the following features, you need to specify the `API-VERISON` you want to use to complete your request. It's recommended to use the latest available API versions.

If you're using [Language Studio](https://aka.ms/languageStudio) for your projects, you'll use the latest API version available. Other API versions are only available through the REST APIs and client libraries.

Use the following table to find which API versions are supported by each feature:

| Feature                                             | Supported versions                                                  | Latest Generally Available version | Latest preview version |
|-----------------------------------------------------|---------------------------------------------------------------------|------------------------------------|------------------------|
| Custom text classification                  | `2022-05-01`, `2022-10-01-preview`, `2023-04-01`                                        |      `2022-05-01`            | `2022-10-01-preview`           |
| Conversational language understanding       | `2022-05-01`, `2022-10-01-preview`, `2023-04-01`                                        |      `2023-04-01`            | `2022-10-01-preview`           |
| Custom named entity recognition             | `2022-05-01`, `2022-10-01-preview`, `2023-04-01`                                        |      `2023-04-01`            |  `2022-10-01-preview`          |
| Orchestration workflow                      | `2022-05-01`, `2022-10-01-preview`, `2023-04-01`                                        |      `2023-04-01`            |   `2022-10-01-preview`         |

## Next steps

[Azure AI Language overview](../overview.md)
