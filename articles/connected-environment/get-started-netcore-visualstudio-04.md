---
title: "Create a .NET Core development environment with containers using Kubernetes in the cloud with Visual Studio - Step 4 - Debug a container in Kubernetes | Microsoft Docs"
author: "ghogen"
ms.author: "ghogen"
ms.date: "03/23/2018"
ms.topic: "tutorial"

description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Container Service, containers"
manager: "douge"
---
# Get Started on Connected Environment with .NET Core and Visual Studio

Previous step: [Create a dev environment in Azure](get-started-netcore-visualstudio-03.md)

## Debug a container in Kubernetes
Once the development environment is successfully created, you can debug the application. Set a breakpoint in the code, for example on line 20 in the file `HomeController.cs` where the `Message` variable is set. Click **F5** to start debugging. 

Visual Studio will communicate with the development environment to build and deploy the application and then open a browser with the web app running. It might seem like the container is running locally, but actually it's running in the development environment in Azure. The reason for the localhost address is because Connected Environment creates a temporary SSH tunnel to the container running in Azure.

Click on the “**About**” link at the top of the page to trigger the breakpoint. You have full access to debug information just like you would if the code was executing locally, such as the call stack, local variables, exception information, and so on.

> [!div class="nextstepaction"]
> [Call another container](get-started-netcore-visualstudio-05.md)