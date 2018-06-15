---
title: Service Fabric with VS Code Getting Started | Microsoft Docs
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
ms.date: 11/27/2017
ms.author: t-pepogo

---

# Service Fabric for Visual Studio Code

The [Service Fabric Reliable Services extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-service-fabric-reliable-services) provides the tools necessary to create, build, and debug Service Fabric applications on Windows, Linux, and macOS operating systems.

This article provides an overview of the requirements and setup of the extension as well as the usage of the various commands that are provided by the extension. 

> [!NOTE]
> Service Fabric Java applications can be developed on Windows machines, but  can be deployed onto Linux Clusters only.

## Prerequisites

The following prerequisites must be installed before you can create Service Fabric applications using VS Code.

* [Visual Studio Code](https://code.visualstudio.com/)
* [Node.js](https://nodejs.org/)
* [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
* [Install Git](https://git-scm.com/)
* [Install Service Fabric SDK](https://docs.microsoft.com/azure/service-fabric/service-fabric-get-started)
* [Install .Net Core on Ubuntu](https://www.microsoft.com/net/learn/get-started/linuxredhat)
* Yeoman Generators

   ```sh
   npm install -g yo
   npm install -g generator-azuresfjava
   npm install -g generator-azuresfcsharp
   npm install -g generator-azuresfcontainer
   npm install -g generator-azuresfguest
   ```

### Windows Only

If you are using VS Code on Windows, a bash shell must be installed. Bash on Ubuntu (On Windows) can be installed by following these [instructions](https://msdn.microsoft.com/commandline/wsl/install_guide).

## Setup

1. Open VS Code.
2. **Windows Only** Click File -> Preferences -> Settings to open the settings file. Add "terminal.integrated.shell.windows": "C:\\Windows\\sysnative\\bash.exe" to the settings file to enable VS Code to use bash.
3. Click the extension icon in the Explorer. Search for Service Fabric. Click install for the Service Fabric extension.

## Commands
The Service Fabric Reliable Services extension for VS Code provides many commands to help developers create and deploy Service Fabric projects. You can call commands from the **Command Palette** by pressing `(Ctrl + Shift + p)`, typing the command name into the input bar, and selecting the desired command from the prompt list. 

* Service Fabric: Create Application 
* Service Fabric: Publish Application 
* Service Fabric: Deploy Application 
* Service Fabric: Remove Application  
* Service Fabric: Build Application 
* Service Fabric: Clean Application 

### Service Fabric: Create Application

The **Service Fabric: Create Application** command creates a new Service Fabric application in your current workspace. Depending on which yeoman generators are installed on your development machine, you can create several types of Service Fabric application, including Java, C#, Container, and Guest projects. 

1.  Select the **Service Fabric: Add Service** command
2.  Select the type for your new Service Fabric application. 
3.  Enter the name of application you want to create
3.  Select the type of service that you want to add to your Service Fabric application. 
4.  Follow the prompts to name the service. 
5.  The new Service Fabric application appears in the workspace.
6.  Open the new application folder so that it becomes the root folder in the workspace. You can continue executing commands from here.

### Service Fabric: Add Service
The **Service Fabric: Add Service** command adds a new service to an existing Service Fabric application. The application that the service will be added to must be the root directory of the workspace. 

1.  Select the **Service Fabric: Add Service** command.
2.  Select the type of your current Service Fabric application. 
3.  Select the type of service that you want to add to your Service Fabric application. 
4.  Follow the prompts to name the service. 
5.  The new service appears in your project directory. 

### Service Fabric: Publish Application
The **Service Fabric: Publish Application** command deploys your Service Fabric application on a remote cluster. The target cluster can be either a secure or an unsecure cluster. If parameters are not set in Cloud.json, the application is deployed to the local cluster.

1.  The first time that the application is built, a Cloud.json file is generated in the project directory.
2.  Input the values for the cluster that you would like to connect to in the Cloud.json file.
3.  Select the **Service Fabric: Publish Application** command.
4.  View the target cluster with Service Fabric Explorer to confirm that the application has been installed. 

### Service Fabric: Deploy Application (Localhost)
The **Service Fabric: Deploy Application** command deploys your Service Fabric application to your local cluster. Make sure your local cluster is running before using the command. 

1.  Select the **Service Fabric: Deploy Application** command
2.  View the local cluster with Service Fabric Explorer (http://localhost:19080/Explorer) to confirm that the application has been installed. This may take some time, so be patient.
3.  You can also use **Service Fabric: Publish Application** command with no parameters set in the Cloud.json file to deploy to a local cluster.

### Service Fabric: Remove Application
The **Service Fabric: Remove Application** command removes a Service Fabric application from the cluster that it was previously deployed to using the VS Code extension. 

1.  Select the **Service Fabric: Remove Application** command.
2.  View the cluster with Service Fabric Explorer to confirm that the application has been removed. This may take some time, so be patient.

### Service Fabric: Build Application
The **Service Fabric: Remove Application** command can build either Java or C# Service Fabric applications. 

1.  Make sure you are in the application root folder before executing this command. The command identifies the type of application (C# or Java) 
    and builds your application accordingly.
2.  Select the **Service Fabric: Build Application** command.
3.  The output of the build process is written to the integrated terminal.

## Debugging

Debugging is supported on the local cluster on Linux machines only. 

### Java

#### Prerequisites

* [Install Debugger for Java extension](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-debug)

#### Steps

1. Open a Java Service Fabric Project in VS Code.
2. Click the debug icon in the workspace.
3. Click the dropdown and select Add Configuration.
4. When prompted to select environment, select Java. 

6. Update entryPoint.sh for the service you want to debug so that it starts the java process with remote debug parameters. This file can be found at the following location: ApplicationName\ServiceNamePkg\Code\entrypoint.sh. In the following example, port 8001 is set for debugging: 

   ```Java
   java -Xdebug -Xrunjdwp:transport=dt_socket,address=8001,server=y,suspend=y -Djava.library.path=$LD_LIBRARY_PATH -jar myapp.jar 
   ```

7.  Enter the **Service Fabric: Deploy Application** command.  
8.  Place breakpoints to debug. 

### C# 

#### Prerequisites

* [Install C# for Visual Studio Code (powered by OmniSharp) extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp)

#### Steps

To debug applications in Visual Studio Code, the application must be running on a local cluster. Breakpoints can be set in the code to see what is happening in the code.

To look at what happens in the code, complete the following steps:
1. Set a breakpoint in the code file that you want to debug.
2. Click the debug icon in the workspace to open the debugging view in Visual Studio Code. Select .NET Core Attach from the configuration menu located next to the run button.
![Debug Icon in Visual Studio Code Workspace][debug-icon]
3. In Visual Studio Code click the run icon beside the .Net Core Attach debug configuration. In the process selection dialog select the process that corresponds to the service that you want to debug.
4. The breakpoint in the code file is hit when that line of code is executed.
5. To continue execution of the program, click the run icon on the top toolbar of Visual Studio Code.
6. To end the debugging session, click the plug icon on the top toolbar of Visual Studio Code.


  <!-- Images -->
  [debug-icon]: ./media/service-fabric-vs-code-extension/debug-icon-workspace.png
