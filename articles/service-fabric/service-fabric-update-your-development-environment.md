<properties
   pageTitle="Update your Service Fabric development environment"
   description="Update your Service Fabric development environment to use the latest runtime, SDK, and tools."
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="samgeo"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="hero-article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="07/21/2015"
   ms.author="seanmck"/>

 # Update your Service Fabric development environment

 Service Fabric periodically provides new releases of the runtime, SDK, and tools for use in local development. Keeping your local development environment updated with these releases ensures that you always have access to the latest features, bug fixes, and performance improvements when building and testing your applications locally.

 ## Clean up your local cluster

 Service Fabric does not currently support upgrading the Service Fabric runtime while a local cluster is running. In order to ensure a clean upgrade, it is important to clean up your local cluster first.

 > [AZURE.NOTE] Cleaning your local cluster will remove all deployed applications and their data.

 You can clean your local cluster as follows:


 1. Close all other PowerShell windows and launch a new one as an administrator.

 2. Navigate to the cluster setup directory with `cd "$env:ProgramW6432\Microsoft SDKs\Service Fabric\ClusterSetup"`

 3. Run `.\CleanCluster.ps1`


 ## Update the runtime, SDK, and tools

 Once you have successfully cleaned up your existing cluster, you can proceed with the upgrade as follows:


 1. Launch the Web Platform Installer to [update to the new release](1).

 2. Upon completion, launch a new PowerShell window as an administrator and navigate to the cluster setup directory with `cd "$ENV:ProgramFiles\Microsoft SDKs\ServiceFabric\ClusterSetup"`.

 3. Run `.\DevClusterSetup.ps1` to setup your local cluster.


## Migrate existing projects

The Service Fabric project structure has changed since the initial release. If you would like to continue working on existing projects, you will need migrate them to the new structure in order to successfully build and debug with this release.

>[AZURE.TIP] If your existing project is small, it may be faster to create a brand new project in Visual Studio and copy over your code than to attempt to migrate the original project.

To migrate an existing project, do the following:

### Add the PublishProfiles folder

1. Open the project you would like to migrate in Visual Studio 2015.

2. Open a second Visual Studio window and create a new Service Fabric application project. You will use this project to acquire the artifacts provided in the new project templates. You can choose any of the service types since the content you need is from the application project, which is independent of your service types.

3. In your existing project, create a new folder in the application project called PublishProfiles. The application project is the one that includes ApplicationManifest.xml.

4. Right-click on PublishProfiles and choose "Add existing item".

5. Browse to the second project you created and add the Local.xml file from the PublishProfiles folder.


### Update the app management scripts

1. In the application project, delete all of the files under the Scripts folder.

2. Right-click the Scripts folder and choose "Add existing item".

3. Browse to the second project you created and add all of the files from the Scripts folder.


>[AZURE.NOTE] In the event that you made modifications to any of the scripts included in the project template, you will need to ensure that those changes carry over.

 [1]:  http://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=MicrosoftAzure-ServiceFabric "WebPI link"
