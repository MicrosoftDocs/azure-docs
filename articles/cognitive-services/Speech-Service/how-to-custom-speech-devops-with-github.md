---
title: Custom Speech DevOps with GitHub Actions - Speech service
titleSuffix: Azure Cognitive Services
description: Apply DevOps with Custom Speech and CI/CD workflows running on GitHub Actions.
services: cognitive-services
author: KatieProchilo
manager: cmayomsft
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 06/09/2020
ms.author: kaprochi
---

# Apply DevOps to Custom Speech model development using GitHub Actions

Go to the [Speech DevOps template repo](https://github.com/Azure-Samples/Speech-Service-DevOps-Template) to create a copy of the template and begin development of Custom Speech models with a robust DevOps system, including testing, training, and versioning using GitHub Actions. The repository provides sample testing and training data to aid in setup and explain the workflow. After initial setup, replace the sample data with your project data.

The [Speech DevOps template repo](https://github.com/Azure-Samples/Speech-Service-DevOps-Template) provides the infrastructure and detailed guidance to:

- Copy the template repository to your GitHub account, then create Azure resources and a [service principal](../../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) for the GitHub Actions [continuous integration (CI) and continuous delivery (CD)](how-to-custom-speech-continuous-integration-continuous-deployment.md) workflows.
- Walk through the "[dev inner loop](https://mitchdenny.com/the-inner-loop/)." Update training and testing data from a feature branch, test the changes with a temporary development model, and raise a pull request to propose and review the changes.
- When training data is updated in a pull request to *master*, train models with the GitHub Actions CI workflow.
- Perform automated accuracy testing to establish a model's [Word Error Rate](how-to-custom-speech-evaluate-data.md#what-is-word-error-rate-wer) (WER). Store the test results in Azure Blob.
- Execute the CD workflow to create an endpoint when the WER improves.

## Next steps

Learn more about DevOps with Speech:

- Use the [Speech DevOps template repo](https://github.com/Azure-Samples/Speech-Service-DevOps-Template) to apply DevOps to your own project.
- Important concepts for [continuous integration and continuous deployment](how-to-custom-speech-continuous-integration-continuous-deployment.md) workflows with Custom Speech.
