---
title: Azure Service Fabric with VS Code Getting Started 
description: This article is an overview of creating Service Fabric applications using Visual Studio Code. 
author: peterpogorski

ms.topic: article
ms.date: 06/29/2018
ms.author: pepogors
---

# Service Fabric for Visual Studio Code

The [Service Fabric Reliable Services extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-service-fabric-reliable-services) provides the tools necessary to create, build, and debug Service Fabric applications on Windows, Linux, and macOS operating systems.

This article provides an overview of the requirements and setup of the extension as well as the usage of the various commands that are provided by the extension. 

> [!IMPORTANT]
> Service Fabric Java applications can be developed on Windows machines, but can be deployed onto Azure Linux clusters only. Debugging Java applications is not supported on Windows.

## Prerequisites

The following prerequisites must be installed on all environments.

* [Visual Studio Code](https://code.visualstudio.com/)
* [Node.js](https://nodejs.org/)
* [Git](https://git-scm.com/)
* [Service Fabric SDK](https://docs.microsoft.com/azure/service-fabric/service-fabric-get-started)
* Yeoman Generators -- install the appropriate generators for your application

   ```sh
   npm install -g yo
   npm install -g generator-azuresfjava
   npm install -g generator-azuresfcsharp
   npm install -g generator-azuresfcontainer
   npm install -g generator-azuresfguest
   ```

The following prerequisites must be installed for Java development:

* [Java SDK](https://aka.ms/azure-jdks) (version 1.8)
* [Gradle](https://gradle.org/install/)
* [Debugger for Java VS Code extension](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-debug) Needed to debug Java services. Debugging Java services is supported on Linux only. You can install either by clicking the Extensions icon in the **Activity Bar** in VS Code and searching for the extension, or from the VS Code Marketplace.

The following prerequisites must be installed for .NET Core/C# development:

* [.NET Core](https://www.microsoft.com/net/learn/get-started) (version 2.0.0 or later)
* [C# for Visual Studio Code (powered by OmniSharp) VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) Needed to debug C# services. You can install either by clicking the Extensions icon in the **Activity Bar** in VS Code and searching for the extension, or from the VS Code Marketplace.

## Setup

1. Open VS Code.
2. Click the Extensions icon in the **Activity Bar** on the left side of VS Code. Search for "Service Fabric". Click **Install** for the Service Fabric Reliable Services extension.

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

1.  Select the **Service Fabric: Create Application** command
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

1. Select the **Service Fabric: Deploy Application** command
2. View the local cluster with Service Fabric Explorer (http:\//localhost:19080/Explorer) to confirm that the application has been installed. This may take some time, so be patient.
3. You can also use **Service Fabric: Publish Application** command with no parameters set in the Cloud.json file to deploy to a local cluster.

> [!NOTE]
> Deploying Java applications to the local cluster is not supported on Windows machines.

### Service Fabric: Remove Application
The **Service Fabric: Remove Application** command removes a Service Fabric application from the cluster that it was previously deployed to using the VS Code extension. 

1.  Select the **Service Fabric: Remove Application** command.
2.  View the cluster with Service Fabric Explorer to confirm that the application has been removed. This may take some time, so be patient.

### Service Fabric: Build Application
The **Service Fabric: Build Application** command can build either Java or C# Service Fabric applications. 

1.  Make sure you are in the application root folder before executing this command. The command identifies the type of application (C# or Java) 
    and builds your application accordingly.
2.  Select the **Service Fabric: Build Application** command.
3.  The output of the build process is written to the integrated terminal.

### Service Fabric: Clean Application
The **Service Fabric: Clean Application** command deletes all jar files and native libraries that were generated by the build. Valid for Java applications only. 

1.  Make sure you are in the application root folder before executing this command. 
2.  Select the **Service Fabric: Clean Application** command.
3.  The output of the clean process is written to the integrated terminal.

## Next steps

* Learn how to [develop and debug C# Service Fabric applications with VS Code](./service-fabric-develop-csharp-applications-with-vs-code.md).
* Learn how to [develop and debug Java Service Fabric applications with VS Code](./service-fabric-develop-java-applications-with-vs-code.md).
