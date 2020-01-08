---
title: Getting started with Azure Remote Rendering
description: Getting started with Azure Remote Rendering
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: tutorial
ms.service: azure-remote-rendering
---

# Getting started with Azure remote rendering

The best way to get started with Azure Remote Rendering is to jump in and complete the [Rendering your first Model Tutorial](../quickstarts/rendering-your-first-model.md).

## Further documentation:
- [Create an account](../how-tos/create-an-account.md) to use the REST API.
- [Ingesting a model](../how-tos/ingest-models.md) into the remote rendering internal format using the ingestion REST API.
You will need an Azure Storage account and configure it with input and output containers.
To get started we provide a built-in model, so if you do not want to use one of your own models you can skip this step
- [Starting a remote rendering session](../quickstarts/launching-virtual-machines.md) using the remote rendering session REST API 
- Use a client application to display the remotely rendered content
    - See: [Unity Sample Project Documentation](../how-tos/run-unity-sample-project.md) for how to build and run the sample project.

We provide the following Azure DevOps repository and nuget feed.

* The repository is [arrClient](https://dev.azure.com/arrClient/arrClient/_git/arrClient) - it provides sample code and documentation.
* The nuget feed is [ArrPackages](https://dev.azure.com/arrClient/arrClient/_packaging?_a=feed&feed=ArrPackages) - it provides the required Unity packages.
