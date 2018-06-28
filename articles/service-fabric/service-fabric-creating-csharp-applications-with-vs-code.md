---
title: Develop .NET Core Service Fabric applications with Visual Studio Code | Microsoft Docs
description: This article shows how to build, deploy, and debug .NET Core Service Fabric applications using Visual Studio Code. 
services: service-fabric
documentationcenter: .net
author: JimacoMS2
manager: timlt
editor: ''

ms.assetid: 96176149-69bb-4b06-a72e-ebbfea84454b
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/29/2018
ms.author: v-jamebr

---

# Develop C# Service Fabric applications with Visual Studio Code

The [Service Fabric Reliable Services extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-service-fabric-reliable-services) makes it easy to build .NET Core Service Fabric applications on Windows, Linux, and  macOS operating systems.

This article shows you how to build, deploy, and debug a .NET Core Service Fabric application using Visual Studio Code.

## Prerequisites

This article assumes that you have already installed VS Code, the Service Fabric Reliable Services extension for VS Code, and any dependencies required for your development environment. To learm more, see [Getting Started](./service-fabric-with-vs-code-getting-started.md#prerequisites).

## Download the sample
This article uses the CounterService application in the [Service Fabric .NET Core getting started samples GitHub repository](https://github.com/Azure-Samples/service-fabric-dotnet-core-getting-started). 

To clone the repository to your development machine, run the following command from a terminal window (command window on Windows):

```
git clone https://github.com/Azure-Samples/service-fabric-dotnet-core-getting-started.git
```

## Open the application in Visual Studio Code

### Windows
Right-click the Visual Studio Code icon in the Start Menu and choose **Run as administrator**. To attach the debugger to your services, you need to run Visual Studio Code as administrator.

### Linux
Using the terminal, navigate to the path /service-fabric-dotnet-core-getting-started/Services/CounterService from the directory that the application was cloned into locally.

Run the following command to open Visual Studio Code as a root user so that the debugger can attach to your services.
```
sudo code . --user-data-dir='.'
```

The application should now appear in your Visual Studio Code workspace.

![Counter Service Application in Workspace][counter-service-workspace]

## Deploy the Counter Service application to a local cluster
1. Press (Ctrl + Shift + p) to open the **Command Palette** in VS Code.
2. Search for and select the **Service Fabric: Build Application** command. The build output is sent to the integrated terminal.

   ![Build Application Command in Visual Studio Code][build-application]

## Deploy the application to the local cluster
After you have built the application, you can deploy it to the local cluster. 

1. From the **Command Palette**, select the **Service Fabric: Deploy Application (Localhost) command**. The output of the install process is sent to the integrated terminal.

   ![Deploy Application Command in Visual Studio Code][deploy-application]

4. When the deployment is complete, launch a browser and open this page: http://localhost:31001. This is the web front-end of the application.

   ![Counter Service Application in Browser][counter-service-application]

## Debug in Visual Studio Code
When debugging applications in Visual Studio Code, the application must be running on a local cluster. Breakpoints can be added to the code to see what is happening in the code.

To look at what happens in the code, complete the following steps:
1. Open the **CounterService.cs** file that is located in the /src/CounterServiceApplication/CounterService and set a breakpoint in the **RunAsync** method  (line 62).
2. Click the debug icon in the workspace to open the debugging view in Visual Studio Code. Select .NET Core Attach from the configuration menu located next to the run button.

   ![Debug Icon in Visual Studio Code Workspace][debug-icon]

3. View the Service Fabric Explorer by opening this page in a browser: `http://localhost:19080/Explorer` to determine the primary node that the CounterService is running on. In the image below the primary node for the CounterService is Node 4.

   ![Primary Node for CounterService][primary-node-counter]

4. In Visual Studio Code, click the run icon beside the .NET Core Attach debug configuration. In the process selection dialog, select the CounterService process that is running on the primary node that you identified in step 3.

   ![Primary Process][primary-process]

5. The breakpoint in the **CounterService.cs** will be hit very quickly. It is then possible to explore the values of the local variables at this point.

   ![Debug Values][debug-values]

6. To continue execution of the program, click the run icon on the top toolbar of Visual Studio Code.

7. To end the debugging session, click the plug icon on the top toolbar of Visual Studio Code.


<!-- Images -->
[debug-values]: ./media/service-fabric-vs-code-extension/debug-values.png
[primary-process]: ./media/service-fabric-vs-code-extension/primary-process.png
[primary-node-counter]: ./media/service-fabric-vs-code-extension/primary-node-counter-service.png
[debug-icon]: ./media/service-fabric-vs-code-extension/debug-icon-workspace.png
[counter-service-application]: ./media/service-fabric-vs-code-extension/counter-service-running.png
[deploy-application]: ./media/service-fabric-vs-code-extension/sf-deploy-application.png
[build-application]: ./media/service-fabric-vs-code-extension/sf-build-application.png
[counter-service-workspace]: ./media/service-fabric-vs-code-extension/counter-service-application-in-workspace.png