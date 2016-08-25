<properties
	pageTitle="Continuous delivery with Git and Visual Studio Team Services in Azure | Microsoft Azure"
	description="Learn how to configure your Visual Studio Team Services team projects to use Git to automatically build and deploy to the Web App feature in Azure App Service or cloud services."
	services="cloud-services"
	documentationCenter=".net"
	authors="mlearned"
	manager="douge"
	editor=""/>

<tags
	ms.service="cloud-services"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="07/06/2016"
	ms.author="mlearned"/>

# Continuous delivery to Azure using Visual Studio Team Services and Git

You can use Visual Studio Team Services team projects to host a Git repository for your source code, and automatically build and deploy to Azure web apps or cloud services whenever you push a commit to the repository.

You'll need Visual Studio 2013 and the Azure SDK installed. If you don't already have Visual Studio 2013, download it by choosing the **Get started for free** link at [www.visualstudio.com](http://www.visualstudio.com). Install the Azure SDK from [here](http://go.microsoft.com/fwlink/?LinkId=239540).


> [AZURE.NOTE] You need an Visual Studio Team Services account to complete this tutorial:
> You can [open a Visual Studio Team Services account for free](http://go.microsoft.com/fwlink/p/?LinkId=512979).

To set up a cloud service to automatically build and deploy to Azure by using Visual Studio Team Services, follow these steps.

## 1: Create a Git repository

1. If you don’t already have a Visual Studio Team Services account, you can get one  [here](http://go.microsoft.com/fwlink/?LinkId=397665). When you create your team project, choose Git as your source control system. Follow the instructions to connect Visual Studio to your team project.

2. In **Team Explorer**, choose the **Clone this repository** link.

	![][3]

3. Specify the location of the local copy and then choose the **Clone** button.

## 2: Create a project and commit it to the repository

1. In **Team Explorer**, in the **Solutions** section, choose the **New** link to create a new project in the local repository.

	![][4]

2. You can deploy a web app or a cloud service (Azure Application) by following the steps in this walkthrough. Create a new Azure Cloud Service project,
or a new ASP.NET MVC project. Make sure that the project targets the .NET Framework 4 or later. If you are creating a cloud service project, add an ASP.NET MVC web role and a worker role.
If you want to create a web app, choose the **ASP.NET Web Application** project template, and then choose **MVC**. See [Create an ASP.NET web app in Azure App Service](../app-service-web/web-sites-dotnet-get-started.md) for more information.

3. Open the shortcut menu for the solution, and choose **Commit**.

	![][7]

4. If this is the first time you've used Git in Visual Studio Team Services, you'll need to provide some information to identify yourself in Git. In the **Pending Changes** area of **Team Explorer**, enter your username and email address. Enter a comment for the commit and then choose the **Commit** button.

	![][8]

5. Note the options to include or exclude specific changes when you check in. If the changes you want are excluded, choose **Include All**.

6. You've now committed the changes in your local copy of the repository. Next, sync those changes with the server by choosing the **Sync** link.

## 3: Connect the project to Azure

1. Now that you have a Git repository in Visual Studio Team Services with some source code in it, you are ready to connect your git repository to Azure.  In the [Azure classic portal](http://go.microsoft.com/fwlink/?LinkID=213885), select your cloud service or web app, or create a new one by choosing the + icon at the bottom left and choosing **Cloud Service** or **Web App** and then **Quick Create**.

	![][9]

3. For cloud services, choose the **Set up publishing with Visual Studio Team Services** link. For web apps, choose the **Set up deployment from source control** link.

	![][10]

2. In the wizard, type the name of your Visual Studio Team Services account in the textbox and choose the **Authorize Now** link. You might be asked to sign in.

	![][11]

3. In the **Connection Request** pop-up dialog, choose **Accept** to authorize Azure to configure your team project in Visual Studio Team Services.

	![][12]

4. After authorization succeeds, you see a dropdown list that contains your Visual Studio Team Services team projects.  Select the name of team project that you created in the previous steps, and choose the wizard's checkmark button.

	![][13]

	The next time you push a commit to your repository, Visual Studio Team Services will build and deploy your project to Azure.

## 4: Trigger a rebuild and redeploy your project

1. In Visual Studio, open up a file and change it. For example, change the file `_Layout.cshtml` under the Views\\Shared folder in an MVC web role.

	![][17]

2. Edit the footer text for the site and save the file.

	![][18]

3. In **Solution Explorer**, open the shortcut menu for the solution node, project node, or the file you changed, and then choose **Commit**.

4. Type in a comment and choose **Commit**.

	![][20]

5. Choose the **Sync** link.

	![][38]

6. Choose the **Push** link to push your commit to the repository in Visual Studio Team Services. (You can also use the **Sync** button to copy your commits to the repository. The difference is that **Sync** also pulls the latest changes from the repository.)

	![][39]

7. Choose the **Home** button to return to the **Team Explorer** home page.

	![][21]

8. Choose **Builds** to view the builds in progress.

	![][22]

	**Team Explorer** shows that a build has been triggered for your check-in.

	![][23]

9. To view a detailed log as the build progresses, double-click the name of the build in progress.

10. While the build is in-progress, take a look at the build definition that was created when you used the wizard to link to Azure.  Open the shortcut menu for the build definition and choose **Edit Build Definition**.

	![][25]

11. In the **Trigger** tab, you will see that the build definition is set to build on every check-in, by default. (For a cloud service, Visual Studio Team Services builds and deploys the master branch to the staging environment automatically. You still have to do a manual step to deploy to the live site. For a web app that doesn't have staging environment, it deploys the master branch directly to the live site.

	![][26]

1. In the **Process** tab, you can see the deployment environment is set to the name of your cloud service or web app.

	![][27]

1. Specify values for the properties if you want different values than the defaults. The properties for Azure publishing are in the **Deployment** section, and you might also need to set MSBuild parameters. For example, in a cloud service project, to specify a service configuration other than "Cloud", set the MSbuild parameters to `/p:TargetProfile=[YourProfile]` where *[YourProfile]* matches a service configuration file with a name like ServiceConfiguration.*YourProfile*.cscfg.

	The following table shows the available properties in the **Deployment** section:

	|Property|Default Value|
	|---|---|
	|Allow Untrusted Certificates|If false, SSL certificates must be signed by a root authority.|
	|Allow Upgrade|Allows the deployment to update an existing deployment instead of creating a new one. Preserves the IP address.|
	|Do Not Delete|If true, do not overwrite an existing unrelated deployment (upgrade is allowed).|
	|Path to Deployment Settings|The path to your .pubxml file for a web app, relative to the root folder of the repo. Ignored for cloud services.|
	|Sharepoint Deployment Environment|The same as the service name.|
	|Azure Deployment Environment|The web app or cloud service name.|

1. By this time, your build should be completed successfully.

	![][28]

1. If you double-click the build name, Visual Studio shows a **Build Summary**, including any test results from associated unit test projects.

	![][29]

1. In the [Azure classic portal](http://go.microsoft.com/fwlink/?LinkID=213885), you can view the associated deployment on the **Deployments** tab when the staging environment is selected.

	![][30]

1.	Browse to your site's URL. For a web app, just choose  the **Browse** button in the portal. For a cloud service, choose the URL in the **Quick Glance** section of the **Dashboard** page that shows the Staging environment.

	Deployments from continuous integration for cloud services are published to the Staging environment by default. You can change this by setting the **Alternate Cloud Service Environment** property to **Production**. Here's where the site URL is on the cloud service's dashboard page.

	![][31]

	A new browser tab will open to reveal your running site.

	![][32]

1.	If you make other changes to your project, you trigger more builds, and you will accumulate multiple deployments. The latest one is marked as Active.

	![][33]

## 5: Redeploy an earlier build

This step is optional. In the Azure classic portal, choose an earlier deployment and choose **Redeploy** to rewind your site to an earlier check-in. Note that this will trigger a new build in TFS and create a new entry in your deployment history.

![][34]

## 6: Change the Production deployment

When you are ready, you can promote the Staging environment to the Production environment by choosing **Swap** in the Azure classic portal. The newly deployed Staging environment is promoted to Production, and the previous Production environment, if any, becomes a Staging environment. The Active deployment may be different for the Production and Staging environments, but the deployment history of recent builds is the same regardless of environment.

![][35]

## 7: Deploy from a working branch.

When you use Git, you usually make changes in a working branch and integrate into the master branch when your development reaches a finished state. During the development phase of a project, you'll want to build and deploy the working branch to Azure.

1. In **Team Explorer**, choose the **Home** button and then choose the **Branches** button.

	![][40]

2. Choose the **New Branch** link.

	![][41]

3. Enter the name of the branch, such as "working," and choose **Create Branch**. This creates a new local branch.

	![][42]

4. Publish the branch. Choose the branch name in **Unpublished branches**, and choose **Publish**.

	![][44]

6. By default, only changes to the master branch trigger a continuous build. To set up continuous build for a working branch, choose the **Builds** page in **Team Explorer**, and choose **Edit Build Definition**.

7. Open the **Source Settings** tab. Under **Monitored branches for continuous integration and build**, choose **Click here to add a new row**.

	![][47]

8. Specify the branch you created, such as refs/heads/working.

	![][48]

9. Make a change in the code, open the shortcut menu for the changed file, and then choose **Commit**.

	![][43]

10. Choose the **Unsynced Commits** link, and choose  the **Sync** button or the **Push** link to copy the changes to the copy of the working branch in Visual Studio Team Services.

	![][45]

11. Navigate to the **Builds** view and find the build that just got triggered for the working branch.

## Next steps

To learn more tips on using Git with Visual Studio Team Services, see [Develop and share your code in Git using Visual Studio](http://www.visualstudio.com/get-started/share-your-code-in-git-vs.aspx) and for information about using a Git repository that's not managed by Visual Studio Team Services to publish to Azure, see [Continuous Deployment to Azure App Service](../app-service-web/app-service-continuous-deployment.md). For more information on Visual Studio Team Services, see [Visual Studio Team Services](http://go.microsoft.com/fwlink/?LinkId=253861).

[0]: ./media/cloud-services-continuous-delivery-use-vso/tfs0.PNG
[1]: ./media/cloud-services-continuous-delivery-use-vso-git/CreateTeamProjectInGit.PNG
[2]: ./media/cloud-services-continuous-delivery-use-vso/tfs2.png
[3]: ./media/cloud-services-continuous-delivery-use-vso-git/CloneThisRepository.PNG
[4]: ./media/cloud-services-continuous-delivery-use-vso-git/CreateNewSolutionInClonedRepo.PNG
[7]: ./media/cloud-services-continuous-delivery-use-vso-git/CommitMenuItem.PNG
[8]: ./media/cloud-services-continuous-delivery-use-vso-git/CommitAChange2.PNG
[9]: ./media/cloud-services-continuous-delivery-use-vso-git/CreateCloudService.PNG
[10]: ./media/cloud-services-continuous-delivery-use-vso-git/SetUpPublishingWithVSO.PNG
[11]: ./media/cloud-services-continuous-delivery-use-vso-git/AuthorizeConnection.PNG
[12]: ./media/cloud-services-continuous-delivery-use-vso-git/ConnectionRequest.PNG
[13]: ./media/cloud-services-continuous-delivery-use-vso-git/ChooseARepo3.PNG
[14]: ./media/cloud-services-continuous-delivery-use-vso/tfs14.png
[15]: ./media/cloud-services-continuous-delivery-use-vso/tfs15.png
[16]: ./media/cloud-services-continuous-delivery-use-vso/tfs16.png
[17]: ./media/cloud-services-continuous-delivery-use-vso-git/tfs17.png
[18]: ./media/cloud-services-continuous-delivery-use-vso-git/MakeACodeChange.PNG
[20]: ./media/cloud-services-continuous-delivery-use-vso-git/CommitAChange2.PNG
[21]: ./media/cloud-services-continuous-delivery-use-vso-git/TeamExplorerHome.png
[22]: ./media/cloud-services-continuous-delivery-use-vso-git/TeamExplorerBuilds.PNG
[23]: ./media/cloud-services-continuous-delivery-use-vso-git/BuildInQueue.png
[24]: ./media/cloud-services-continuous-delivery-use-vso/tfs24.png
[25]: ./media/cloud-services-continuous-delivery-use-vso-git/tfs25.png
[26]: ./media/cloud-services-continuous-delivery-use-vso-git/tfs26.png
[27]: ./media/cloud-services-continuous-delivery-use-vso-git/ProcessTab.PNG
[28]: ./media/cloud-services-continuous-delivery-use-vso-git/tfs28.png
[29]: ./media/cloud-services-continuous-delivery-use-vso-git/tfs29.png
[30]: ./media/cloud-services-continuous-delivery-use-vso-git/tfs30.png
[31]: ./media/cloud-services-continuous-delivery-use-vso-git/tfs31.png
[32]: ./media/cloud-services-continuous-delivery-use-vso-git/tfs32.png
[33]: ./media/cloud-services-continuous-delivery-use-vso-git/tfs33.png
[34]: ./media/cloud-services-continuous-delivery-use-vso-git/tfs34.png
[35]: ./media/cloud-services-continuous-delivery-use-vso-git/tfs35.png
[36]: ./media/cloud-services-continuous-delivery-use-vso/tfs36.PNG
[37]: ./media/cloud-services-continuous-delivery-use-vso-git/CreateANewAccount.PNG
[38]: ./media/cloud-services-continuous-delivery-use-vso-git/SyncChanges2.PNG
[39]: ./media/cloud-services-continuous-delivery-use-vso-git/PushCurrentBranch.PNG
[40]: ./media/cloud-services-continuous-delivery-use-vso-git/BranchesInTeamExplorer.PNG
[41]: ./media/cloud-services-continuous-delivery-use-vso-git/NewBranch.PNG
[42]: ./media/cloud-services-continuous-delivery-use-vso-git/CreateBranch.PNG
[43]: ./media/cloud-services-continuous-delivery-use-vso-git/CommitAChange2.PNG
[44]: ./media/cloud-services-continuous-delivery-use-vso-git/PublishBranch.PNG
[45]: ./media/cloud-services-continuous-delivery-use-vso-git/SyncChanges2.PNG
[47]: ./media/cloud-services-continuous-delivery-use-vso-git/SourceSettingsPage.PNG
[48]: ./media/cloud-services-continuous-delivery-use-vso-git/IncludeWorkingBranch.PNG
