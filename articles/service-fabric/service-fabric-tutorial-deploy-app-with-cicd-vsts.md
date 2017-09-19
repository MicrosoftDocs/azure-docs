---
title: Deploy an Azure Service Fabric application with continuous integration (Team Services) | Microsoft Docs
description: Learn how to set up continuous integration and deployment for a Service Fabric application using Visual Studio Team Services.  Deploy an application to a Service Fabric cluster in Azure.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/09/2017
ms.author: ryanwi
ms.custom: mvc

---

# Deploy an application with CI/CD to a Service Fabric cluster
This tutorial is part three of a series and describes how to set up continuous integration and deployment for an Azure Service Fabric application using Visual Studio Team Services.  An existing Service Fabric application is needed, the application created in [Build a .NET application](service-fabric-tutorial-create-dotnet-app.md) is used as an example.

In part three of the series, you learn how to:

> [!div class="checklist"]
> * Add source control to your project
> * Create a build definition in Team Services
> * Create a release definition in Team Services
> * Automatically deploy and upgrade an application

In this tutorial series you learn how to:
> [!div class="checklist"]
> * [Build a .NET Service Fabric application](service-fabric-tutorial-create-dotnet-app.md)
> * [Deploy the application to a remote cluster](service-fabric-tutorial-deploy-app-to-party-cluster.md)
> * Configure CI/CD using Visual Studio Team Services
> * [Set up monitoring and diagnostics for the application](service-fabric-tutorial-monitoring-aspnet.md)

## Prerequisites
Before you begin this tutorial:
- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- [Install Visual Studio 2017](https://www.visualstudio.com/) and install the **Azure development** and **ASP.NET and web development** workloads.
- [Install the Service Fabric SDK](service-fabric-get-started.md)
- Create a Service Fabric application, for example by [following this tutorial](service-fabric-tutorial-create-dotnet-app.md). 
- Create a Windows Service Fabric cluster on Azure, for example by [following this tutorial](service-fabric-tutorial-create-cluster-azure-ps.md)
- Create a [Team Services account](https://www.visualstudio.com/docs/setup-admin/team-services/sign-up-for-visual-studio-team-services).

## Download the Voting sample application
If you did not build the Voting sample application in [part one of this tutorial series](service-fabric-tutorial-create-dotnet-app.md), you can download it. In a command window, run the following command to clone the sample app repository to your local machine.

```
git clone https://github.com/Azure-Samples/service-fabric-dotnet-quickstart
```

## Prepare a publish profile
Now that you've [created an application](service-fabric-tutorial-create-dotnet-app.md) and have [deployed the application to Azure](service-fabric-tutorial-deploy-app-to-party-cluster.md), you're ready to set up continuous integration.  First, prepare a publish profile within your application for use by the deployment process that executes within Team Services.  The publish profile should be configured to target the cluster that you've previously created.  Start Visual Studio and open an existing Service Fabric application project.  In **Solution Explorer**, right-click the application and select **Publish...**.

Choose a target profile within your application project to use for your continuous integration workflow, for example Cloud.  Specify the cluster connection endpoint.  Check the **Upgrade the Application** checkbox so that your application upgrades for each deployment in Team Services.  Click the **Save** hyperlink to save the settings to the publish profile and then click **Cancel** to close the dialog box.  

![Push profile][publish-app-profile]

## Share your Visual Studio solution to a new Team Services Git repo
Share your application source files to a team project in Team Services so you can generate builds.  

Create a new local Git repo for your project by selecting **Add to Source Control** -> **Git** on the status bar in the lower right-hand corner of Visual Studio. 

In the **Push** view in **Team Explorer**, select the **Publish Git Repo** button under **Push to Visual Studio Team Services**.

![Push Git repo][push-git-repo]

Verify your email and select your account in the **Team Services Domain** drop-down. Enter your repository name and select **Publish repository**.

![Push Git repo][publish-code]

Publishing the repo creates a new team project in your account with the same name as the local repo. To create the repo in an existing team project, click **Advanced** next to **Repository** name and select a team project. You can view your code on the web by selecting **See it on the web**.

## Configure Continuous Delivery with VSTS
A Team Services build definition describes a workflow that is composed of a set of build steps that are executed sequentially. Create a build definition that that produces a Service Fabric application package, and other artifacts, to deploy to a Service Fabric cluster. Learn more about [Team Services build definitions](https://www.visualstudio.com/docs/build/define/create). 

A Team Services release definition describes a workflow that deploys an application package to a cluster. When used together, the build definition and release definition execute the entire workflow starting with source files to ending with a running application in your cluster. Learn more about Team Services [release definitions](https://www.visualstudio.com/docs/release/author-release-definition/more-release-definition).

### Create a build definition
Open a web browser and navigate to your new team project at: https://myaccount.visualstudio.com/Voting/Voting%20Team/_git/Voting . 

Select the **Build & Release** tab, then **Builds**, then **+ New definition**.  In **Select a template**, select the **Azure Service Fabric Application** template and click **Apply**. 

![Choose build template][select-build-template] 

The voting application contains a .NET Core project, so add a task that restores the dependencies. In the **Tasks** view, select **+ Add Task** in the bottom left. Search on "Command Line" to find the command-line task, then click **Add**. 

![Add task][add-task] 

In the new task, enter "Run dotnet.exe" in **Display name**, "dotnet.exe" in **Tool**, and "restore" in **Arguments**. 

![New task][new-task] 

In the **Triggers** view, click the **Enable this trigger** switch under **Continuous Integration**. 

Select **Save & queue** and enter "Hosted VS2017" as the **Agent queue**. Select **Queue** to manually start a build.  Builds also triggers upon push or check-in.

To check your build progress, switch to the **Builds** tab.  Once you verify that the build executes successfully, define a release definition that deploys your application to a cluster. 

### Create a release definition  

Select the **Build & Release** tab, then **Releases**, then **+ New definition**.  In **Create release definition**, select the **Azure Service Fabric Deployment** template from the list and click **Next**.  Select the **Build** source, check the **Continuous deployment** box, and click **Create**. 

In the **Environments** view, click **Add** to the right of **Cluster Connection**.  Specify a connection name of "mysftestcluster", a cluster endpoint of "tcp://mysftestcluster.westus.cloudapp.azure.com:19000", and the Azure Active Directory or certificate credentials for the cluster. For Azure Active Directory credentials, define the credentials you want to use to connect to the cluster in the **Username** and **Password** fields. For certificate-based authentication, define the Base64 encoding of the client certificate file in the **Client Certificate** field.  See the help pop-up on that field for info on how to get that value.  If your certificate is password-protected, define the password in the **Password** field.  Click **Save** to save the release definition.

![Add cluster connection][add-cluster-connection] 

Click **Run on agent**, then select **Hosted VS2017** for **Deployment queue**. Click **Save** to save the release definition.

![Run on agent][run-on-agent]

Select **+Release** -> **Create Release** -> **Create** to manually create a release.  Verify that the deployment succeeded and the application is running in the cluster.  Open a web browser and navigate to [http://mysftestcluster.westus.cloudapp.azure.com:19080/Explorer/](http://mysftestcluster.westus.cloudapp.azure.com:19080/Explorer/).  Note the application version, in this example it is "1.0.0.20170616.3". 

## Commit and push changes, trigger a release
To verify that the continuous integration pipeline is functioning by checking in some code changes to Team Services.    

As you write your code, your changes are automatically tracked by Visual Studio. Commit changes to your local Git repository by selecting the pending changes icon (![Pending][pending]) from the status bar in the bottom right.

On the **Changes** view in Team Explorer, add a message describing your update and commit your changes.

![Commit all][changes]

Select the unpublished changes status bar icon (![Unpublished changes][unpublished-changes]) or the Sync view in Team Explorer. Select **Push** to update your code in Team Services/TFS.

![Push changes][push]

Pushing the changes to Team Services automatically triggers a build.  When the build definition successfully completes, a release is automatically created and starts upgrading the application on the cluster.

To check your build progress, switch to the **Builds** tab in **Team Explorer** in Visual Studio.  Once you verify that the build executes successfully, define a release definition that deploys your application to a cluster.

Verify that the deployment succeeded and the application is running in the cluster.  Open a web browser and navigate to [http://mysftestcluster.westus.cloudapp.azure.com:19080/Explorer/](http://mysftestcluster.westus.cloudapp.azure.com:19080/Explorer/).  Note the application version, in this example it is "1.0.0.20170815.3".

![Service Fabric Explorer][sfx1]

## Update the application
Make code changes in the application.  Save and commit the changes, following the previous steps.

Once the upgrade of the application begins, you can watch the upgrade progress in Service Fabric Explorer:

![Service Fabric Explorer][sfx2]

The application upgrade may take several minutes. When the upgrade is complete, the application will be running the next version.  In this example "1.0.0.20170815.4".

![Service Fabric Explorer][sfx3]

## Next steps
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Add source control to your project
> * Create a build definition
> * Create a release definition
> * Automatically deploy and upgrade an application

Now that you have deployed an application and configured continuous integration, try the following:
- [Monitor and diagnose the Voting app](service-fabric-tutorial-monitoring-aspnet.md)
- [Upgrade an app](service-fabric-application-upgrade.md)
- [Test an app](service-fabric-testability-overview.md) 


<!-- Image References -->
[publish-app-profile]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/PublishAppProfile.png
[push-git-repo]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/PublishGitRepo.png
[publish-code]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/PublishCode.png
[select-build-template]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/SelectBuildTemplate.png
[add-task]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/AddTask.png
[new-task]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/NewTask.png
[set-continuous-integration]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/SetContinuousIntegration.png
[add-cluster-connection]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/AddClusterConnection.png
[sfx1]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/SFX1.png
[sfx2]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/SFX2.png
[sfx3]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/SFX3.png
[pending]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/Pending.png
[changes]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/Changes.png
[unpublished-changes]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/UnpublishedChanges.png
[push]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/Push.png
[continuous-delivery-with-VSTS]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/VSTS-Dialog.png
[new-service-endpoint]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/NewServiceEndpoint.png
[new-service-endpoint-dialog]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/NewServiceEndpointDialog.png
[run-on-agent]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/RunOnAgent.png