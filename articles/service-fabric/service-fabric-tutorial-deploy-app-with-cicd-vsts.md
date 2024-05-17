---
title: Deploy an app with CI and Azure Pipelines
description: In this tutorial, you learn how to set up continuous integration and deployment for a Service Fabric application using Azure Pipelines.
ms.topic: tutorial
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 04/17/2024
---

# Tutorial: Deploy an application with CI/CD to a Service Fabric cluster

This tutorial is part four of a series and describes how to set up continuous integration and deployment for an Azure Service Fabric application using Azure Pipelines. An existing Service Fabric application is needed, the application created in [Build a .NET application](service-fabric-tutorial-create-dotnet-app.md) is used as an example.

In part three of the series, you learn how to:

> [!div class="checklist"]
>
> * Add source control to your project
> * Create a build pipeline in Azure Pipelines
> * Create a release pipeline in Azure Pipelines
> * Automatically deploy and upgrade an application

In these tutorials you learn how to:
> [!div class="checklist"]
>
> * [Build a .NET Service Fabric application](service-fabric-tutorial-create-dotnet-app.md)
> * [Deploy the application to a remote cluster](service-fabric-tutorial-deploy-app-to-party-cluster.md)
> * [Add an HTTPS endpoint to an ASP.NET Core front-end service](service-fabric-tutorial-dotnet-app-enable-https-endpoint.md)
> * Configure CI/CD using Azure Pipelines
> * [Set up monitoring and diagnostics for the application](service-fabric-tutorial-monitoring-aspnet.md)

## Prerequisites

Before you begin this tutorial:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Install Visual Studio 2019](https://www.visualstudio.com/) and install the **Azure development** and **ASP.NET and web development** workloads.
* [Install the Service Fabric SDK](service-fabric-get-started.md).
* Create a Windows Service Fabric cluster on Azure, for example by [following this tutorial](service-fabric-tutorial-create-vnet-and-windows-cluster.md).
* Create an [Azure DevOps organization](/azure/devops/organizations/accounts/create-organization-msa-or-work-student). An organization allows you to create a project in Azure DevOps and use Azure Pipelines.

## Download the Voting sample application

If you didn't build the Voting sample application in [part one of this series](service-fabric-tutorial-create-dotnet-app.md), you can download it. In a command window, run the following command to clone the sample app repository to your local machine.

```git
git clone https://github.com/Azure-Samples/service-fabric-dotnet-quickstart
```

## Prepare a publish profile

Now that you [created an application](service-fabric-tutorial-create-dotnet-app.md) and [deployed the application to Azure](service-fabric-tutorial-deploy-app-to-party-cluster.md), you're ready to set up continuous integration. First, prepare a publish profile within your application for use by the deployment process that executes within Azure Pipelines. The publish profile should be configured to target the cluster you previously created. Start Visual Studio and open an existing Service Fabric application project. In **Solution Explorer**, right-click the application and select **Publish**.

Choose a target profile in your application project to use for your continuous integration workflow, for example, **Cloud**. Specify the cluster connection endpoint. Select the **Upgrade the Application** checkbox so that your application upgrades for each deployment in Azure DevOps. Select the **Save** link to save the settings to the publish profile, and then select **Cancel** to close the dialog.

![Push profile][publish-app-profile]

## Share your Visual Studio solution to a new Azure DevOps Git repo

Share your application source files to a project in Azure DevOps so you can generate builds.

Create a [new GitHub repo and Azure DevOps repo](/visualstudio/version-control/git-create-repository#create-a-github-repo) from Visual Studio 2022 IDE by selecting **Git** >  **Create Git Repository** from the Git menu.

Select your account and enter your repository name. Select **Create and Push**.

![Screenshot of creating new Git repository.][push-git-repo]

Publishing the repo creates a new project in your Azure DevOps Services account that has the same name as the local repo.

View the newly created repository by navigating to <https://dev.azure.com/\><organizationname\>, hover mouse over the name of your project, and select the **Repos** icon.

## Configure Continuous Delivery with Azure Pipelines

An Azure Pipelines build pipeline describes a workflow that is composed of a set of build steps that are executed sequentially. Create a build pipeline that produces a Service Fabric application package, and other artifacts, to deploy to a Service Fabric cluster. Learn more about [Azure Pipelines build pipelines](https://www.visualstudio.com/docs/build/define/create).

An Azure Pipelines release pipeline describes a workflow that deploys an application package to a cluster. When used together, the build pipeline and release pipeline execute the entire workflow starting with source files to ending with a running application in your cluster. Learn more about [Azure Pipelines release pipelines](https://www.visualstudio.com/docs/release/author-release-definition/more-release-definition).

### Create a build pipeline

Open a web browser and go to your new project at: <https://dev.azure.com/\><organizationname\>/VotingSample

Select the **Pipelines** tab and select **Create Pipeline**.

![New Pipeline][new-pipeline]

Select **Use the classic editor** to create a pipeline without YAML.

![Classic Editor][classic-editor]

Select **Azure Repos Git** as source, **VotingSample** Team project, **VotingApplication** Repository, and **master** Default branch for manual and scheduled builds. Then select **Continue**.

![Select Repo][select-repo]

In **Select a template**, select the **Azure Service Fabric application** template, and then select **Apply**.

![Choose build template][select-build-template]

In **Tasks**, for **Agent pool**, enter **Azure Pipelines**. For **Agent Specification**, enter **windows-2022**.

![Select tasks][save-and-queue]

Under **Triggers**, enable continuous integration by selecting the **Enable continuous integration** checkbox. In **Branch filters**, the **Branch specification** defaults to **master**. Select **Save and queue** to manually start a build.

![Select triggers][save-and-queue-2]

Builds also trigger upon push or check-in. To check your build progress, select the **Builds** tab. After you verify that the build executes successfully, define a release pipeline that deploys your application to a cluster.

### Create a release pipeline

Select the **Pipelines** tab, and then **Releases** > **New pipeline**. In **Select a template**, select the **Azure Service Fabric Deployment** template, and then select **Apply**.

![Choose release template][select-release-template]

Select **Tasks** > **New** to add a new cluster connection.

![Add cluster connection][add-cluster-connection]

In **New Service Fabric Connection**, select **Certificate Based** or **Microsoft Entra credential** authentication. Specify a cluster endpoint of `tcp://mysftestcluster.southcentralus.cloudapp.azure.com:19000` (or the endpoint of the cluster you're deploying to).

For certificate-based authentication, add the **Server certificate thumbprint** of the server certificate used to create the cluster. In **Client certificate**, add the base-64 encoding of the client certificate file. See the help pop-up on that field for info on how to get that base-64 encoded representation of the certificate. Also add the **Password** for the certificate. You can use the cluster or server certificate if you don't have a separate client certificate.

For Microsoft Entra credentials, add the **Server certificate thumbprint** of the server certificate used to create the cluster and the credentials you want to use to connect to the cluster in the **Username** and **Password** fields.

Select **Save**.

Next, add a build artifact to the pipeline so the release pipeline can find the output from the build. Select **Pipeline** and **Artifacts** > **+Add**. In **Source (Build definition)**, select the build pipeline you created previously. Select **Add** to save the build artifact.

![Add artifact][add-artifact]

Enable a continuous deployment trigger so that a release is automatically created when the build completes. Select the lightning icon in the artifact, enable the trigger, and choose **Save** to save the release pipeline.

![Enable trigger][enable-trigger]

Select **Create Release** >  **Create** to manually create a release. To monitor the release progress, go to the **Releases** tab.

Verify that the deployment succeeded and that the application is running in the cluster. Open a web browser and go to `https://mysftestcluster.southcentralus.cloudapp.azure.com:19080/Explorer/`. Note the application version. In this example, it's `1.0.0.20170616.3`.

## Commit and push changes, then trigger a release

To verify that the continuous integration pipeline is functioning, check in some code changes to Azure DevOps.

As you write your code, Visual Studio keeps track of the file changes to your project in the **Changes** section of the **Git Changes** window.

On **Changes**, enter a message to describe your update, and then commit your changes.

![Commit all][changes]

In **Git Changes**, select **Push** (the up arrow) to update your code in Azure Pipelines.

![Push changes][push]

Pushing the changes to Azure Pipelines triggers a build. To check your build progress, select the **Pipelines** tab in `https://dev.azure.com/organizationname/VotingSample`.

When the build finishes, a release is automatically created and starts upgrading the application on the cluster.

Verify that the deployment succeeded and that the application is running in the cluster. Open a web browser and go to `https://mysftestcluster.southcentralus.cloudapp.azure.com:19080/Explorer/`. Note the application version. In this example, it's `1.0.0.20170815.3`.

![Screenshot of the Voting app in Service Fabric Explorer running in a browser window. The app version "1.0.0.20170815.3" is highlighted.][sfx1]

## Update the application

Make code changes in the application. Save and commit the changes.

When the application upgrade begins, you can track the upgrade progress in Service Fabric Explorer:

![Screenshot of the Voting app in Service Fabric Explorer. The Status message "Upgrading", and an "Upgrade in Progress" message are highlighted.][sfx2]

The application upgrade might take several minutes. When the upgrade is finished, the application is running the next version. In this example, it's running version `1.0.0.20170815.4`.

![Screenshot of the Voting app in Service Fabric Explorer running in a browser window. The updated app version "1.0.0.20170815.4" is highlighted.][sfx3]

## Next step

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Set up monitoring and diagnostics for the application](service-fabric-tutorial-monitoring-aspnet.md)

<!-- Image References -->
[publish-app-profile]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/PublishAppProfile.png
[push-git-repo]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/publish-app-profile.png
[new-pipeline]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/new-pipeline.png
[classic-editor]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/classic-editor.png
[select-repo]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/select-repo.png
[select-build-template]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/select-build-template.png
[save-and-queue]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/save-and-queue.png
[save-and-queue-2]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/save-and-queue-2.png
[select-release-template]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/select-release-template.png
[add-cluster-connection]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/add-cluster-connection.png
[add-artifact]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/add-artifact.png
[enable-trigger]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/enable-trigger.png
[sfx1]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/SFX1.png
[sfx2]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/SFX2.png
[sfx3]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/SFX3.png
[changes]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/changes-latest.png
[push]: ./media/service-fabric-tutorial-deploy-app-with-cicd-vsts/push-latest.png
