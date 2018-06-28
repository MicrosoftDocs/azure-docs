---
title: Develop Java Service Fabric applications with Visual Studio Code| Microsoft Docs
description: This article shows how to build, deploy, and debug Java Service Fabric applications using Visual Studio Code. 
services: service-fabric
documentationcenter: .net
author: JimacoMS
manager: timlt
editor: ''

ms.assetid: 96176149-69bb-4b06-a72e-ebbfea84454b
ms.service: service-fabric
ms.devlang: java
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/28/2018
ms.author: v-jamebr

---

# Develop Java Service Fabric applications with Visual Studio Code

The [Service Fabric Reliable Services extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-service-fabric-reliable-services) makes it easy to build Java Service Fabric applications on Windows, Linux, and macOS operating systems.

This article shows you how to build, deploy, and debug a Java Service Fabric application using Visual Studio Code.

> [!IMPORTANT]
> Service Fabric Java applications can be developed on Windows machines, but can be deployed onto Azure Linux clusters only. Debugging Java applications is not supported on Windows.

## Prerequisites

This article assumes that you have already installed VS Code, the Service Fabric Reliable Services extension for VS Code, and any dependencies required by your development environment. To learm more, see [Getting Started](./service-fabric-with-vs-code-getting-started.md#prerequisites).

## Download the sample
This article uses the Voting application in the [Service Fabric Java application quickstart sample GitHub repository](https://github.com/Azure-Samples/service-fabric-java-quickstart). 

To clone the repository to your development machine, run the following command from a terminal window (command window on Windows):

```sh
git clone https://github.com/Azure-Samples/service-fabric-java-quickstart.git
```

## Open the application in VS Code

Open VS Code. Click **File -> Open Folder** and navigate to the *Voting* directory (*./service-fabric-java-quickstart/Voting*). The workspace should contain the same files shown in the screenshot below.

![Java Voting Application in Workspace][java-voting-application]

## Build and deploy the Voting application to a local cluster

1. Press (Ctrl + Shift + p) to open the **Command Palette** in VS Code.
2. Search for the **Service Fabric: Build Application** command. When prompted to select a language, select Java. The output of the build process will be output in the integrated terminal.

   ![Build Application Command in VS Code][build-application]

3. Search for the Service Fabric: Deploy Application (Localhost) command. The output of the install process can be seen in the integrated terminal.

   ![Deploy Application Command in VS Code][deploy-application]

4. When the deployment is complete, launch a browser and open this page: `http://localhost:8080` - the web front-end of the application.

   ![Voting Application in Browser][voting-sample]

5. To remove the application from the cluster, search for the Service Fabric: Remove Application command. The output of the uninstall process will be output in the integrated terminal.

## Debug in VS Code
When debugging applications in VS Code, the application must be running on a local cluster. Breakpoints can be added to the code to see what is happening in the code.

1. Update the entryPoint.sh file, which is located in Voting/VotingApplication/VotingDataServicePkg/Code.
Replace the command on line 6 with the following:

   ```
   java -Xdebug -Xrunjdwp:transport=dt_socket,address=8001,server=y,suspend=n -Djava.library.path=$LD_LIBRARY_PATH -jar VotingDataService.jar
   ```

2. Update the ApplicationManifest.xml file, which is located in Voting/VotingApplication. Set the **MinReplicaSetSize** and the **TargetReplicaSetSize** to 1 in the **StatefulService** element:
   
   ```xml
         <StatefulService MinReplicaSetSize="1" ServiceTypeName="VotingDataServiceType" TargetReplicaSetSize="1">
   ```

3. Click the debug icon in the workspace to open the debugging view in VS Code. Select Java from the environment menu.

   ![Debug Icon in VS Code Workspace][debug-workspace]

3. Open the launch.json file that is located in the explorer of VS Code. In, the configuration named **Debug (Attach)** update the port value to be **8001**.

   ![Debug Configuration for the launch.json][debug-config]

4. Deploy the application on a local cluster by using the **Service Fabric: Deploy Application (Localhost)** command. Your application is now ready to be debugged.

To set a breakpoint in the code, complete the following steps:

1. Open the **VotingDataService.java** file, which is located in the /Voting/VotingDataService/src/statefulservice. Set a breakpoint on first line of code in the `try` block in the `addItem` method (line 80).
   > [!IMPORTANT]
   > Make sure you set breakpoints on executable lines of code. For example breakpoints set on method declarations, `try` statements, and `catch` statements will be missed by the debugger.
2. Select the Debug (Attach) configuration from the debug menu and click the run button to begin debugging.

   ![Debug (Attach) Configuration][debug-attach]

3. In a web browser, go to http://localhost:8080. Type a new item in the text box and click **+ Add**. Your breakpoint should be hit. 
1. To continue execution of the program, click the run icon on the Debug toolbar at the top of VS Code.

4. To end the debugging session, click the plug icon on the Debug toolbar at the top of VS Code.
5. After you have finished debugging, you can use the **Service Fabric:Remove Application** command to remove the Voting application from your local cluster. 

<!-- Images -->
[debug-attach]: ./media/service-fabric-vs-code-extension/debug-attach-java.png
[debug-config]: ./media/service-fabric-vs-code-extension/debug-config-java.png
[debug-workspace]: ./media/service-fabric-vs-code-extension/debug-icon-workspace.png
[voting-sample]: ./media/service-fabric-vs-code-extension/voting-sample-in-browser.png
[deploy-application]:  ./media/service-fabric-vs-code-extension/sf-deploy-application.png
[build-application]: ./media/service-fabric-vs-code-extension/sf-build-application.png
[java-voting-application]: ./media/service-fabric-vs-code-extension/java-voting-application.png