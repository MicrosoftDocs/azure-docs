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
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 07/12/2017
ms.author: ryanwi

---

# Deploy an application with CI/CD to a Service Fabric cluster
This tutorial describes how to set up continuous integration and deployment for an Azure Service Fabric application using Visual Studio Team Services.  An existing Service Fabric application is needed, the application created in [Build a .NET application](service-fabric-tutorial-create-dotnet-app.md) is used as an example.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add source control to your project
> * Create a build definition in Team Services
> * Create a release definition in Team Services
> * Automatically deploy and upgrade an application

The tutorial is split across three articles, this article is the third in the series.

## Prerequisites
Before you begin this tutorial:
- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- [Install Visual Studio 2017](https://www.visualstudio.com/) and install the **Azure development** and **ASP.NET and web development** workloads.
- [Install the Service Fabric SDK](service-fabric-get-started.md)
- Create a Service Fabric application, for example by [following this tutorial](service-fabric-tutorial-create-dotnet-app.md). 
- Create a Windows Service Fabric cluster on Azure, for example by [following this tutorial](service-fabric-tutorial-create-cluster-azure-ps.md)
- Create a [Team Services account](https://www.visualstudio.com/docs/setup-admin/team-services/sign-up-for-visual-studio-team-services).

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
Use the built in wizard in Visual Studio to configure continuous delivery with VSTS.

1. Right-click the **MyApplication** application project in **Solution Explorer**, then select **Add** -> **Continuous Delivery with VSTS**. A dialog box pops up for you to input the required configuration.

    ![Continuous Delivery with VSTS][continuous-delivery-with-VSTS]

    **Account**, **Project**, and **Git Repository** values are automatically entered.

2. Choose **Hosted VS2017** as the agent queue.

3. Choose **Create Connection** in the **Cluster Connection** drop-down, which opens a web site to configure a Service Endpoint in VSTS. 

4. Set focus on the browser window and choose **New Service Endpoint** -> **Service Fabric**.

    ![New Service Endpoint][new-service-endpoint]

    A dialog pops up to add a new Service Fabric connection.
    
5. Select **Certificate Based** and complete the dialog:

    ![New Service Endpoint Dialog][new-service-endpoint-dialog]

    1. Enter a **Connection Name**.
    2. Enter the cluster's management endpoint in the **Cluster Endpoint** field (for example, "tcp://mycluster.eastus.cloudapp.azure.com:19000"). Specify "tcp://" as the protocol.  The default anagement endpoint port is 19000.
    3. Input the **Server Certificate Thumbprint**.  The thumbprint can be obtained by opening Service Fabric Explorer for your cluster (https://mycluster.eastus.cloudapp.azure.com:19080).
        - Choose the **Cluster** node in the tree view and the **Manifest** tab in the right hand pane.
        - Look for the **<ServerCertificate>** element in the XML file and copy the content of the **X509FindValue** attribute.
    4. In the **Client Certificate** field, input the client certificate as a Base64 encoded string, required to get the certificate installed on the build agent:
        - Make sure you have the certificate as a PFX file available.
        - Run the following PowerShell command to output the PFX file as a Base64Encoded string to the clipboard: `[System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes(C:\path\to\certificate.pfx)) | clip`
        - Paste (ctrl+v) the value form the clipboard in to the field in the dialog.
    5. Type the **Certificate Password** in the **Password** field and click **OK**.

6. In Visual Studio, choose **<Refresh>** in the **Cluster Connection** field of the **Continuous Delivery with VSTS** dialog. The cluster endpoint you just created should now show up in the drop-down.

7. Either choose the default build and release definition name, or change the proposed names in the dialog. Click **OK** once you're done.

After a while a dialog pops-up in Visual Studio, asking if you want to open the build and release definition in you browser. You can choose to do so to inspect how they are configured, but this is not required in order to complete this tutorial.

- A Team Services build definition describes a workflow that is composed of a set of build steps that are executed sequentially. Create a build definition that that produces a Service Fabric application package, and other artifacts, to deploy to a Service Fabric cluster. Learn more about [Team Services build definitions](https://www.visualstudio.com/docs/build/define/create).
- A Team Services release definition describes a workflow that deploys an application package to a cluster. When used together, the build definition and release definition execute the entire workflow starting with source files to ending with a running application in your cluster. Learn more about Team Services [release definitions](https://www.visualstudio.com/docs/release/author-release-definition/more-release-definition).

## Commit and push changes, trigger a release
To verify that the continuous integration pipeline is functioning by checking in some code changes to Team Services.    

As you write your code, your changes are automatically tracked by Visual Studio. Commit changes to your local Git repository by selecting the pending changes icon (![Pending][pending]) from the status bar in the bottom right.

On the **Changes** view in Team Explorer, add a message describing your update and commit your changes.

![Commit all][changes]

Select the unpublished changes status bar icon (![Unpublished changes][unpublished-changes]) or the Sync view in Team Explorer. Select **Push** to update your code in Team Services/TFS.

![Push changes][push]

Pushing the changes to Team Services automatically triggers a build.  When the build definition successfully completes, a release is automatically created and starts upgrading the application on the cluster.

To check your build progress, switch to the **Builds** tab in **Team Explorer** in Visual Studio.  Once you verify that the build executes successfully, define a release definition that deploys your application to a cluster.

Verify that the deployment succeeded and the application is running in the cluster.  Open a web browser and navigate to [http://mysftestcluster.westus.cloudapp.azure.com:19080/Explorer/](http://mysftestcluster.westus.cloudapp.azure.com:19080/Explorer/).  Note the application version, in this example it is "1.0.0.20170616.3".

![Service Fabric Explorer][sfx1]

## Update the application
Make code changes in the application.  Save and commit the changes, following the previous steps.

Once the upgrade of the application begins, you can watch the upgrade progress in Service Fabric Explorer:

![Service Fabric Explorer][sfx2]

The application upgrade may take several minutes. When the upgrade is complete, the application will be running the next version.  In this example "1.0.0.20170616.4".

![Service Fabric Explorer][sfx3]

## Next steps
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Add source control to your project
> * Create a build definition
> * Create a release definition
> * Automatically deploy and upgrade an application

Now that you have deployed an application and configured continuous integration, try the following:
- [Upgrade an app](service-fabric-application-upgrade.md)
- [Test an app](service-fabric-testability-overview.md) 
- [Monitor and diagnose](service-fabric-diagnostics-overview.md)


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