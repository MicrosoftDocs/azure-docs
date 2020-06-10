---
title: Custom Speech DevOps with GitHub Actions - Speech service
titleSuffix: Azure Cognitive Services
description: Apply DevOps with Custom Speech and CI/CD workflows running on GitHub Actions.
services: cognitive-services
author: kaprochi
manager: cmayo
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 06/09/2020
ms.author: kaprochi
---

# Apply DevOps to Custom Speech model development using GitHub Actions

Go to the [Speech DevOps template repo](https://github.com/Azure-Samples/Speech-Service-DevOps-Template) to create a copy of the template and begin development of Custom Speech models with a robust system of testing, training, and versioning already in place with GitHub Actions. The repository supplies you with testing and training data to get started, but the data can be replaced to use this solution for your own project.

The [Speech DevOps template repo](https://github.com/Azure-Samples/Speech-Service-DevOps-Template) provides detailed guidance to:

- Copy the template to your own GitHub repository.
- Create Speech resources in Azure that will be used by workflows running on GitHub Actions.
- Create a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) and get the token that is used by the continuous integration (CI) and continuous delivery (CD) workflows to sign into Azure.
- Configure [parameters for the CI/CD workflows](how-to-custom-speech-continuous-integration-continuous-deployment.md) and store them in [GitHub Secrets](https://help.github.com/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets).
- Walks through the ["dev inner loop."](https://mitchdenny.com/the-inner-loop/) The developer makes updates to a Custom Speech model while working in a feature branch, tests the updates and then raises a pull request to propose changes and to seek review approval.
- Execute CI/CD workflows on GitHub Actions to train and test a Speech model as those updates are made.
- Perform automated accuracy testing for a Speech model to establish the Word Error Rate.
- When the Word Error Rate improves, execute the [CD workflow](how-to-custom-speech-continuous-integration-continuous-deployment.md) to create an endpoint.

## Next steps

Learn more about DevOps with Speech:

- Use the [Speech DevOps template](https://github.com/Azure-Samples/Speech-Service-DevOps-Template) to apply DevOps to your own project.
- [Continuous integration and continuous deployment workflows](how-to-custom-speech-continuous-integration-continuous-deployment.md)
