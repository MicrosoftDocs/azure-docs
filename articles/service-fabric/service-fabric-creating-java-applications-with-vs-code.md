---
title: Create a Java Service Fabric application with Visual Studio Code| Microsoft Docs
description: This article is an overview of creating Java Service Fabric applications using Visual Studio Code. 
services: service-fabric
documentationcenter: .net
author: t-pepogo
manager: timlt
editor: ''

ms.assetid: 96176149-69bb-4b06-a72e-ebbfea84454b
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/06/2017
ms.author: 

---

# Creating Java Service Fabric Applications with VS Code

The Service Fabric extension for Visual Studio Code makes it easy to build Java Service Fabric applications on Windows, Linux, and macOS operating systems.

<<<<<<< HEAD
This article shows you how to build, deploy, and debug a Java Service Fabric application using Visual Studio Code.
=======
This article shows you how to build, deploy, and debug a Java Service Fabric applications using Visual Studio Code.
>>>>>>> 75bfb0048ea5b4a84487d2201125eabd93c474e3

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
git clone https://github.com/Azure-Samples/service-fabric-java-quickstart.git
```

## Open the application in Visual Studio Code

Open the Visual Studio Code application. Click on File -> Open Folder and navigate to the directory where the application was cloned on your local machine. The workspace should contain the same files as seen in the screenshot below.

![Java Voting Application in Workspace][java-voting-application]

## Deploy the Voting application to a local cluster

<<<<<<< HEAD
1. Press (Ctrl + Shift + p) to open the command prompt in Visual Studio Code.
=======
1. Press (Ctrl + Shift + p) in order to open the command prompt in Visual Studio Code.
>>>>>>> 75bfb0048ea5b4a84487d2201125eabd93c474e3
2. Search for the Service Fabric: Build Application command. When prompted to select a language, select Java. The output of the build process will be output in the integrated terminal.
![Build Application Command in Visual Studio Code][build-application]

3. Search for the Service Fabric: Deploy Application (Localhost) command. The output of the install process can be seen in the integrated terminal.
![Deploy Application Command in Visual Studio Code][deploy-application]

4. When the deployment is complete, launch a browser and open this page: `http://localhost:8080` - the web front-end of the application.
![Voting Application in Browser][voting-sample]

<<<<<<< HEAD
5. To remove the application from the cluster, search for the Service Fabric: Remove Application command. The output of the uninstall process will be output in the integrated terminal.
=======
5. In order to remove the application from the cluster, search for the Service Fabric: Remove Application command. The output of the uninstall process wil be output in the integrated terminal.
>>>>>>> 75bfb0048ea5b4a84487d2201125eabd93c474e3

## Debug in Visual Studio Code
When debugging applications in Visual Studio Code, the application must be running on a local cluster. Breakpoints can be added to the code to see what is happening in the code.

Update the entryPoint.sh file which is located in Voting/VotingApplication/VotingDataServicePkg/Code
Replace the command on line 6 with the following:
```
java -Xdebug -Xrunjdwp:transport=dt_socket,address=8001,server=y,suspend=y -Djava.library.path=$LD_LIBRARY_PATH -jar VotingDataService.jar
```

Click on the debug icon in the workspace to open the debugging view in Visual Studio Code. Select Java from the environment menu.
![Debug Icon in Visual Studio Code Workspace][debug-workspace]

<<<<<<< HEAD
Open the launch.json file that is located in the explorer of Visual Studio Code. In, the configuration named **Debug (Attach)** update the port value to be **8001**.
=======
Open the launch.json file that will be located in the explorer of Visual Studio Code. In the configuration named **Debug (Attach)** update the port value to be **8001**.
>>>>>>> 75bfb0048ea5b4a84487d2201125eabd93c474e3

![Debug Configuration for the launch.json][debug-config]

Deploy the application on a local cluster by using the Service Fabric: Deploy Application (Localhost) command.

To look at what happens in the code, complete the following steps:
1. Open the **HttpCommunicationListener.java** file that is located in the /Voting/VotingWeb/src/statelessservice and set a breakpoint on  (line 227).
2. Select the Debug (Attach) configuration from the debug menu and click the run button to begin debugging.
![Debug (Attach) Configuration][debug-attach]

3. To continue execution of the program, click on the run icon on the top toolbar of Visual Studio Code.

4. To end the debugging session, click on the plug icon on the top toolbar of Visual Studio Code.

<!-- Images -->
[debug-attach]: ./media/service-fabric-vs-code-extension/debug-attach-java.png
[debug-config]: ./media/service-fabric-vs-code-extension/debug-config-java.png
[debug-workspace]: ./media/service-fabric-vs-code-extension/debug-icon-workspace.png
[voting-sample]: ./media/service-fabric-vs-code-extension/voting-sample-in-browser.png
[deploy-application]:  ./media/service-fabric-vs-code-extension/sf-deploy-application.png
[build-application]: ./media/service-fabric-vs-code-extension/sf-build-application.png
[java-voting-application]: ./media/service-fabric-vs-code-extension/java-voting-application.png