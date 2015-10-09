<properties
   pageTitle="Get started with deploying and upgrading apps on your local cluster | Microsoft Azure"
   description="Set up a local Service Fabric cluster, deploy an existing application to it, and then upgrade that application."
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="coreysa"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="hero-article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="10/08/2015"
   ms.author="seanmck"/>

# Get started with deploying and upgrading apps on your local cluster

The Service Fabric SDK includes a full local development environment and enables you to quickly get started with deploying and managing appliactions on a local cluster. In this article, you will create a local cluster, deploy an existing application to it, and then upgrade that application to a new version, all from Windows PowerShell.

>[AZURE.NOTE] This article assumes that you already [set up your development environment][service-fabric-get-started.md].

## Create a local cluster

A Service Fabric cluster represents a set of hardware resources that you can deploy applications to. Typically, a cluster is made up of anywhere from 5 to many 1000s of machines, but the Service Fabric SDK includes a cluster configuration that can run on a single machine.

>[AZURE.NOTE] The Service Fabric local cluster is not an emulator or simulator. It runs the same platform code found on multi-machine clusters. The only difference is that it runs the platform processes normally spread across five machines on one.

The SDK provides two ways to setup a local cluster: a Windows PowerShell script and the Local Cluster Manager system tray app. In this tutorial, we will use the PowerShell script.

1. Launch a new PowerShell window as an administrator.
2. Navigate to the SDK folder:

	```powershell
	cd "$ENV:ProgramFiles\Microsoft SDKs\Service Fabric\ClusterSetup\"
	```

3. Run the cluster setup script:

	```powershell
	.\DevClusterSetup.ps1
	```

  Cluster setup will take a few moments, after which you should see output that looks something like this:

  ![Cluster setup output][cluster-setup-success]

  You are now ready to try deploying an application to your cluster.

## Deploy an application

The Service Fabric SDK includes a rich set of frameworks and developer tooling for creating applications. If you are interested in learning how to create applications in Visual Studio, see [Creating your first application in Visual Studio](service-fabric-create-your-first-application-in-visual-studio.md). In this tutorial, we will use an existing sample application (called WordCount) so that we can focus on the management aspects of the platform, including deployment, monitoring, and upgrade.

1. Launch a new PowerShell window as an administrator.

2. Create a directory to store the application that you will download and deploy, such as c:\Service Fabric\.

  ```powershell
  mkdir c:\Service Fabric\
  cd c:\Service Fabric\
  ```

3. Download the WordCount application from [here](http://aka.ms/servicefabric-wordcountapp) and extract it to the location you created.

4. Download the WordCount application parameters from [here](http://aka.ms/servicefabric-wordcountapp-parameters) and save it to the same location where you extracted the app package. In the end, it should look like this:

  ![Extracted WordCount application package][extracted-app-package]

  Now that you have the application, it's time to deploy it.

4. Connect to the local cluster:

  ```powershell
  Connect-ServiceFabricCluster localhost:19000
  ```

5. Invoke the SDK's deployment script, providing URIs for the pre-built application package and the configurable application parameters, along with an application name and a deployment action.

  ```powershell
  DeployCreate-FabricApplication -ApplicationPackagePath 'c:\Service Fabric\WordCount\' -ApplicationDefinitionFilePath c:\Service Fabric\WordCountParameters.Local.xml -ApplicationName "fabric:/WordCount" -Action DeployAndCreate
  ```

  If all goes well, you should see output like the following:

  ![Deploy an application to the local cluster][deploy-app-to-local-cluster]

6. To see the application in action, launch the browser and navigate to http://localhost:8081/wordcount/index. You should see something like this:

  ![Deployed application UI][deployed-app-UI]

  The WordCount application is very simple. It includes client-side JavaScript code to generate random five-character "words", which are then relayed to the application via an ASP.NET WebAPI. A stateful service keeps track of the number of words counted, partitioned based on the first character of the word. The application that we deployed contains a four partitions, so words beginning with A through G are stored in the first partition, H through N are stored in the second partition, and so on.


## View the application details and status in PowerShell

With the application deployed, let's look at some of the app details in PowerShell.

1. Query all deployed applications on the cluster:

  ```powershell
  Get-ServiceFabricApplication -ApplicationName
  ```

  Assuming that you have only deployed the WordCount app, you will see something like this:

2. Go to the next level by querying the set of services included in the WordCount application.

  ```powershell
  Get-ServiceFabricService -ApplicationName 'fabric:/WordCount'
  ```

3. Underneath WordCount, you will find the application instance that we've deployed, fabric:/WordCount.


## Upgrade an application

Service Fabric provides no-downtime upgrades by monitoring the health of the application as it rolls out across the cluster. Let's perform a simple upgrade of the WordCount application.

The new version of the application will now only count words that begin with a vowel. As the upgrade rolls out, we should notice two changes in the application's behavior. First, the rate at which the count grows should slow, since fewer words are being counted. Second, since the first partition has two vowels (A and E) and all others contain only one each, its count should eventually start to outpace the others.



## Next steps

- [Create your first application in Visual Studio](service-fabric-create-your-first-application-in-visual-studio.md)
- [Create an Azure cluster and deploy to it](service-fabric-cluster-creation-via-portal.md)
- [Learn more about application upgrades](service-fabric-application-upgrade.md)

<!-- Images -->

[cluster-setup-success]: ./media/service-fabric-get-started-with-a-local-cluster/LocalClusterSetup.png
[extracted-app-package]: ./media/service-fabric-get-started-with-a-local-cluster/ExtractedAppPackage.png
[deploy-app-to-local-cluster]: ./media/service-fabric-get-started-with-a-local-cluster/DeployAppToLocalCluster.png
[deployed-app-UI]: ./media/service-fabric-get-started-with-a-local-cluster/DeployedAppUI.png
[deployed-app-UI2]: ./media/service-fabric-get-started-with-a-local-cluster/DeployedAppUI2.png
[sfx-app-instance]: ./media/service-fabric-get-started-with-a-local-cluster/SfxAppInstance.png
[sfx-two-app-instances-different-partitions]: ./media/service-fabric-get-started-with-a-local-cluster/SfxTwoAppInstances-DifferentPartitionCount.png
