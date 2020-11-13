---
title: How to apply DevOps with GitHub - LUIS
titleSuffix: Azure Cognitive Services
description: Apply DevOps with Language Understanding (LUIS) and GitHub.
services: cognitive-services
author: andycw
manager: cmayo
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 06/5/2020
ms.author: anwigley
---

# Apply DevOps to LUIS app development using GitHub Actions

Go to the [LUIS DevOps template repo](https://github.com/Azure-Samples/LUIS-DevOps-Template) for a complete solution that implements DevOps and software engineering best practices for LUIS. You can use this template repo to create your own repository with built-in support for CI/CD workflows and practices that enable [source control](luis-concept-devops-sourcecontrol.md), [automated builds](luis-concept-devops-automation.md), [testing](luis-concept-devops-testing.md), and [release management](luis-concept-devops-automation.md#release-management) with LUIS for your own project.

## The LUIS DevOps template repo

The [LUIS DevOps template repo](https://github.com/Azure-Samples/LUIS-DevOps-Template) walks through how to:

* **Clone the template repo** - Copy the template to your own GitHub repository.
* **Configure LUIS resources** - Create the [LUIS authoring and prediction resources in Azure](https://docs.microsoft.com/azure/cognitive-services/luis/luis-how-to-azure-subscription#create-resources-in-azure-cli) that will be used by the continuous integration workflows.
* **Configure the CI/CD workflows** - Configure parameters for the CI/CD workflows and store them in [GitHub Secrets](https://help.github.com/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets).
* **Walks through the ["dev inner loop"](https://mitchdenny.com/the-inner-loop/)** - The developer makes updates to a sample LUIS app while working in a development branch, tests the updates and then raises a pull request to propose changes and to seek review approval.
* **Execute CI/CD workflows** - Execute [continuous integration workflows to build and test a LUIS app](luis-concept-devops-automation.md) using GitHub Actions.
* **Perform automated testing** - Perform [automated batch testing for a LUIS app](luis-concept-devops-testing.md) to evaluate the quality of the app.
* **Deploy the LUIS app** - Execute a [continuous delivery (CD) job](luis-concept-devops-automation.md#continuous-delivery-cd) to publish the LUIS app.
* **Use the repo with your own project** - Explains how to use the repo with your own LUIS application.

## Next steps

* Use the [LUIS DevOps template repo](https://github.com/Azure-Samples/LUIS-DevOps-Template) to apply DevOps with your own project.
* [Source control and branch strategies for LUIS](luis-concept-devops-sourcecontrol.md)
* [Testing for LUIS DevOps](luis-concept-devops-testing.md)
* [Automation workflows for LUIS DevOps](luis-concept-devops-automation.md)
