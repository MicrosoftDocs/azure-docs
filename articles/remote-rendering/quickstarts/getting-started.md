---
title: Getting started
description: Gives suggestions where to start learning Azure Remote Rendering
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: tutorial
ms.service: azure-remote-rendering
---

# Getting started with Azure Remote Rendering

To get access to the Azure Remote Rendering service, you first need to [create an account](../azure/create-an-account.md).

Afterwards, follow [Quickstart: Render a model with Unity](quickstart-render-model.md).

## Next steps

- To get your own data into the service, read about [the model conversion REST API](../conversion/conversion-rest-api.md). However, if you want to skip this step for now, we also provide a built-in model that can be used for testing.
- To control your sessions, read about [the session management REST API](../sessions/session-rest-api.md).
- To learn how to display remotely rendered content in a client application, see the [Unity sample project documentation](../how-tos/run-unity-sample-project.md).

We provide the following Azure DevOps repository and NuGet feed.

- **Repository:** [arrClient](https://dev.azure.com/arrClient/arrClient/_git/arrClient) - contains sample code and documentation
- **NuGet feed:** [ArrPackages](https://dev.azure.com/arrClient/arrClient/_packaging?_a=feed&feed=ArrPackages) - contains the required Unity packages
