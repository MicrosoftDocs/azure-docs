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
   ms.date="10/14/2015"
   ms.author="seanmck"/>

# Get started with deploying and upgrading Service Fabric applications on your local cluster

The Service Fabric SDK includes a full local development environment and enables you to quickly get started with deploying and managing appliactions on a local cluster. In this article, you will create a local cluster, deploy an existing application to it, and then upgrade that application to a new version, all from Windows PowerShell.

>[AZURE.NOTE] This article assumes that you already [set up your development environment](service-fabric-get-started.md).

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

4. Connect to the local cluster:

  ```powershell
  Connect-ServiceFabricCluster localhost:19000
  ```

5. Invoke the SDK's deployment script, providing URIs for the pre-built application package and the configurable application parameters, along with an application name and a deployment action.

  ```powershell
  & "$ENV:ProgramFiles\Microsoft SDKs\Service Fabric\Tools\Scripts\DeployCreate-FabricApplication" -ApplicationPackagePath 'c:\Service Fabric\WordCountV1\' -ApplicationName "fabric:/WordCount" -Action DeployAndCreate
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

  ![Query all deployed applications in PowerShell][ps-getsfapp]

2. Go to the next level by querying the set of services included in the WordCount application.

  ```powershell
  Get-ServiceFabricService -ApplicationName 'fabric:/WordCount'
  ```

  ![List services for the applicatin in PowerShell][ps-getsfsvc]

  Note that the application is made up of two services, the web front-end and the stateful service that manages the words.

3. Finally, take a look at the list of partitions for the WordCountService:

  ![View the service partitions in PowerShell][ps-getsfpartitions]

  The set of commands you just used, like all Service Fabric PowerShell commands, are available for any cluster that you might connect to, local or remote.

  >[AZURE.NOTE] For a more visual way to interact with the cluster, see [Visualizing your cluster with Service Fabric Explorer](service-fabric-visualizing-your-cluster.md).

## Upgrade an application

Service Fabric provides no-downtime upgrades by monitoring the health of the application as it rolls out across the cluster. Let's perform a simple upgrade of the WordCount application.

The new version of the application will now only count words that begin with a vowel. As the upgrade rolls out, we should notice two changes in the application's behavior. First, the rate at which the count grows should slow, since fewer words are being counted. Second, since the first partition has two vowels (A and E) and all others contain only one each, its count should eventually start to outpace the others.

1. Download the v2 package from [here](http://aka.ms/servicefabric-wordcountappv2) and extract it next to the v1 package.

2. Return to your PowerShell window and use the SDK's upgrade script to register the new version in the cluster and begin upgrading fabric:/WordCount.

  ```powershell
  & "$ENV:ProgramFiles\Microsoft SDKs\Service Fabric\Tools\Scripts\Upgrade-FabricApplication.ps1" -ApplicationPackagePath 'C:\Service Fabric\WordCountV2\' -Action DeployAndUpgrade -ApplicationName "fabric:/WordCount" -UpgradeParameters @{UpgradeReplicaSetCheckTimeoutSec="1"; Force=$true; UnmonitoredAuto=$true}
  ```

  You should see output in PowerShell that looks something like this, including a success message at the end:

  ![Upgrade progress in PowerShell][ps-appupgradeprogress]

3. If you rerun the earlier query for the set of services included in the fabric:/WordCount application, you will notice that while the version of the WordCountService changed, the version of the WordCountWebService did not:

  ```powershell
  Get-ServiceFabricService -ApplicationName 'fabric:/WordCount'
  ```

  ![Query application services after upgrade][ps-getsfsvc-postupgrade]

  This highlights how Service Fabric manages application upgrades, which is to only touch the set of services (or code/configuration packages within those services) that have changed, making the process of upgrading faster and more reliable.

4. Finally, return to the browser to observe the behavior of the new application version. As expected, the count progresses more slowly and the first partition ends up with slightly more of the volume.

  ![View the new version of the application in the browser][deployed-app-UI-v2]

## Next steps

- Now that you have deployed and upgraded some pre-built applications, you can [try building your own in Visual Studio](service-fabric-create-your-first-application-in-visual-studio.md).
- All of the actions performed on the local cluster in this article can be performed on [Azure cluster](service-fabric-cluster-creation-via-portal.md) as well.
- The upgrade performed in this article was very basic. See the [upgrade documentation](service-fabric-application-upgrade.md) to learn more about the power and flexibility of Service Fabric upgrades.

<!-- Images -->

[cluster-setup-success]: ./media/service-fabric-get-started-with-a-local-cluster/LocalClusterSetup.png
[extracted-app-package]: ./media/service-fabric-get-started-with-a-local-cluster/ExtractedAppPackage.png
[deploy-app-to-local-cluster]: ./media/service-fabric-get-started-with-a-local-cluster/DeployAppToLocalCluster.png
[deployed-app-UI]: ./media/service-fabric-get-started-with-a-local-cluster/DeployedAppUI.png
[deployed-app-UI2]: ./media/service-fabric-get-started-with-a-local-cluster/DeployedAppUI2.png
[sfx-app-instance]: ./media/service-fabric-get-started-with-a-local-cluster/SfxAppInstance.png
[sfx-two-app-instances-different-partitions]: ./media/service-fabric-get-started-with-a-local-cluster/SfxTwoAppInstances-DifferentPartitionCount.png
[ps-getsfapp]: ./media/service-fabric-get-started-with-a-local-cluster/PS-GetSFApp.png
[ps-getsfsvc]: ./media/service-fabric-get-started-with-a-local-cluster/PS-GetSFSvc.png
[ps-getsfpartitions]: ./media/service-fabric-get-started-with-a-local-cluster/PS-GetSFPartitions.png
[ps-appupgradeprogress]: ./media/service-fabric-get-started-with-a-local-cluster/PS-AppUpgradeProgress.png
[ps-getsfsvc-postupgrade]: ./media/service-fabric-get-started-with-a-local-cluster/PS-GetSFSvc-PostUpgrade.png
[deployed-app-UI-v2]: ./media/service-fabric-get-started-with-a-local-cluster/DeployedAppUI-PostUpgrade.png
