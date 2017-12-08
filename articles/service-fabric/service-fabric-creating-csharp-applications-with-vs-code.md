---
title: Create a .NET Core Service Fabric application with Visual Studio Code| Microsoft Docs
description: This article is an overview of creating Service Fabric applications using Visual Studio Code. 
services: service-fabric
documentationcenter: .net
author: peterpogorski
manager: timlt
editor: ''

ms.assetid: 96176149-69bb-4b06-a72e-ebbfea84454b
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/06/2017
ms.author: t-pepogo

---

# Creating C# Service Fabric Applications with VS Code

The Service Fabric extension for Visual Studio Code makes it easy to build .Net Core Service Fabric applications on Windows, Linux, and macOS operating systems.

This article shows you how to build, deploy, and debug a .Net Core Service Fabric applications using Visual Studio Code.

## Prerequisites
As VS Code is a lightweight editor, a number of dependencies must be first installed before Service Fabric applications can be created using VS Code.

* [Install Visual Studio Code](https://code.visualstudio.com/)
* [Install Node.js](https://nodejs.org/en/)
* [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
* [Install git](https://git-scm.com/)
* Install Yeoman Generators
```sh
npm install -g yo
npm install -g generator-azuresfjava
npm install -g generator-azuresfcsharp
```

#### Windows Only

If you are using VS Code on Windows, a bash shell must be installed. Bash on Ubuntu (On Windows) can be installed by following these [instructions](https://msdn.microsoft.com/en-us/commandline/wsl/install_guide).

## Download the sample
In a command window, run the following command to clone the sample app repository to your local machine.
```
git clone https://github.com/Azure-Samples/service-fabric-dotnet-core-getting-started.git
```

## Open the application in Visual Studio Code

#### Windows
Right-click the Visual Studio icon in the Start Menu and choose **Run as administrator**. In order to attach the debugger to your services, you need to run Visual Studio as administrator.

#### Linux
Navigate using the terminal to the path /service-fabric-dotnet-core-getting-started/Services/CounterService from the directory that the application was cloned into locally.

Run the following command in order to open Visual Studio Code as a root user so that the debugger can attach to your services.
```
sudo code . --user-data-dir='.'
```

The application should now appear in your Visual Studio Code workspace.

![Counter Service Application in Workspace][counter-service-workspace]

## Deploy the Counter Service application to a local cluster
1. Press (Ctrl + Shift + p) in order to open the command prompt in Visual Studio Code.
2. Search for the Service Fabric: Build Application command. When prompted to select a language, select C#. The output of the build process will be output in the integrated terminal.
![Build Application Command in Visual Studio Code][build-application]

3. Search for the Service Fabric: Deploy Application (Localhost) command. The output of the install process can be seen in the integrated terminal.
![Deploy Application Command in Visual Studio Code][deploy-application]

4. When the deployment is complete, launch a browser and open this page: `http://localhost:31001` - the web front-end of the application.
![Counter Service Application in Browser][counter-service-application]

## Debug in Visual Studio Code
When debugging applications in Visual Studio Code, the application must be running on a local cluster. Breakpoints can be added to the code to see what is happening in the code.

To look at what happens in the code, complete the following steps:
1. Open the **CounterService.cs** file that is located in the /src/CounterServiceApplication/CounterService and set a breakpoint in the **RunAsync** method  (line 62).
2. Click on the debug icon in the workspace to open the debugging view in Visual Studio Code. Select .NET Core Attach from the configuration menu located next to the run button.
![Debug Icon in Visual Studio Code Workspace][debug-icon]

3. View the Service Fabric Explorer by opening this page: `http://localhost:19080/Explorer` to determine the primary node that the CounterService is running. In the image below the primary node for the CounterService is Node 4.
![Primary Node for CounterService][primary-node-counter]

4. In Visual Studio Code click on the run icon beside the .Net Core Attach debug configuration. In the process selection dialog select the CounterService process that is running on the primary node that you identified in step 3.
![Primary Process][primary-process]

5. The breakpoint in the **CounterService.cs** will be hit very quickly. It is then possible to explore the values of the local variables at this point.
![Debug Values][debug-values]

6. To continue execution of the program, click on the run icon on the top toolbar of Visual Studio Code.

7. To end the debugging session, click on the plug icon on the top toolbar of Visual Studio Code.


<!-- Images -->
[debug-values]: ./media/service-fabric-vs-code-extension/debug-values.png
[primary-process]: ./media/service-fabric-vs-code-extension/primary-process.png
[primary-node-counter]: ./media/service-fabric-vs-code-extension/primary-node-counter-service.png
[debug-icon]: ./media/service-fabric-vs-code-extension/debug-icon-workspace.png
[counter-service-application]: ./media/service-fabric-vs-code-extension/counter-service-running.png
[deploy-application]: ./media/service-fabric-vs-code-extension/sf-deploy-application.png
[build-application]: ./media/service-fabric-vs-code-extension/sf-build-application.png
[counter-service-workspace]: ./media/service-fabric-vs-code-extension/counter-service-application-in-workspace.png