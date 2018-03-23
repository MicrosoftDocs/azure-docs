---
title: "How to share a development environment | Microsoft Docs"
author: "ghogen"
ms.author: "ghogen"
ms.date: "3/12/2018"
ms.topic: "article"

description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Container Service, containers"
manager: "douge"
---
# Share a Development Environment

With Connected Environment, you can share your development environment with others on your team. Each developer can work in their own space without fear of breaking others. Also, working together in one environment can enable you to test code end-to-end without having to create mocks or simulate dependencies. See the [Learn about team development](../get-started-nodejs-06.md) guide for more information.

To set up an environment for multiple developers:
1. [Create a Connected Environment in Azure](../get-started.md). You'll need to have Owner or Contributor access to the selected Azure subscription.
1. Configure the environment's **resource group** to [grant Contributor access](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-configure) for each team member. You can check an environment's resource group by running this command: `vsce env list`
1. Ask team members to **select the environment** in order to develop in it.
     * **Command line or VS Code**: To see existing Connected Environments you have access to: `vsce env list`. To select an environment: `vsce env select`.
     * **Visual Studio IDE**: Open a project in Visual Studio, select **Connected Environment for AKS** from the launch settings drop-down. In the dialog that opens, select an existing development environment.

![Visual Studio launch settings drop-down](../media/get-started-netcore-visualstudio/LaunchSettings.png)