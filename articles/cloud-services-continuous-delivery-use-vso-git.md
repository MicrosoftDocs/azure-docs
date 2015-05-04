<properties 
	pageTitle="Continuous delivery with Visual Studio Online in Azure" 
	description="Learn how to configure your Visual Studio Online team projects to automatically build and deploy to Azure websites or cloud services." 
	services="web-sites" 
	documentationCenter=".net" 
	authors="kempb" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="web-sites" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/02/2015" 
	ms.author="kempb"/>




# Continuous delivery to Azure using Visual Studio Online and Git

You can use Visual Studio Online team projects to host a Git repository for your source code, and automatically build and deploy to Azure websites or cloud services whenever you push a commit to the repository.

You'll need Visual Studio 2013 and the Azure SDK installed. If you don't already have Visual Studio 2013, download it by choosing the **Get started for free** link at [www.visualstudio.com](http://www.visualstudio.com). Install the Azure SDK from [here](http://go.microsoft.com/fwlink/?LinkId=239540).


> [AZURE.NOTE] You need an Visual Studio online account to complete this tutorial:
> You can [open a Visual Studio Online account for free](http://go.microsoft.com/fwlink/p/?LinkId=512979).

To set up a cloud service to automatically build and deploy to Azure by using Visual Studio Online, follow these steps:

-   [Step 1: Create a Git repository.][]

-   [Step 2: Create a project and push it to your Git repository.][]

-   [Step 3: Connect the project to Azure.][]

-   [Step 4: Make changes and trigger a rebuild and redeployment.][]

-   [Step 5: Redeploy an earlier build (optional)][]

-   [Step 6: Change the Production deployment][]

-	[Step 7: Deploy from a working branch][]

<h2> <a name="step1"></a>Step 1: Create a Git repository</h2>


1. If you don’t yet have a Visual Studio Online account, follow the instructions [here](http://go.microsoft.com/fwlink/?LinkId=397665). When you create your team project, choose Git as your source control system. Follow the instructions to connect Visual Studio to your team project.

2. In Team Explorer, choose the **Clone this repository** link. 
![][3]

3. Specify the location of the local copy, and choose the **Clone** button.
 
<h2><a name="step2"> </a>Step 2: Create a project and commit it to the repository</h2>

1. In Team Explorer, in the Solutions section, choose the New link to create a new project in the local repository.<br/>
![][4]

2. You can deploy a website or a cloud service (Azure Application) by following the steps in this walkthrough.
Create a new Azure Cloud Service project,
or a new ASP.NET MVC project. Make sure that the project targets the .NET Framework 4 or 4.5, and if you are creating a cloud service project, add an ASP.NET MVC web role and a worker role.
If you want to create a website, choose the ASP.NET Web Application project template, and then choose MVC. See [Get started with Azure Websites and ASP.NET](web-sites-dotnet-get-started.md).

3. Open the shortcut menu for the solution, and choose **Commit**.<br/>
![][7]

4. If this is the first time you've used Git in Visual Studio Online, you'll need to provide some information to identify yourself in Git. In the **Pending Changes** area of Team Explorer, enter your username and email address. Type a comment for the commit and choose **Commit**.<br/>
![][8]

5. Note the options to include or exclude specific changes when you check in. If the changes you want are excluded, choose **Include All**.<br/>

6. You've now committed the changes in your local copy of the repository. Next, sync those changes with the server. Choose the **Sync** link.

<h2> <a name="step3"> </a>Step 3: Connect the project to Azure</h2>

1. Now that you have a Git repository in Visual Studio Online with some source code in it, you are ready to connect your git repository to Azure.  In the [Azure Portal](http://manage.windowsazure.com), select your cloud service or website, or create a new one by selecting the + icon at the bottom left and choosing **Cloud Service** or **Website** and then **Quick Create**.<br.>
![][9]

3. For cloud services, choose the **Set up publishing with Visual Studio Online** link. For websites, choose the **Set up deployment from source control** link.<br/>
![][10]

2. In the wizard, type the name of your Visual Studio Online account in the textbox and choose the **Authorize Now** link. You might be asked to sign in.<br/>
![][11]

3. In the OAuth pop-up dialog, choose **Accept** to authorize Azure to configure your team project in Visual Studio Online.<br/>
![][12]

4. When authorization succeeds, you see a dropdown  list that contains your Visual Studio Online team projects.  Select the name of team project that you created in the previous steps, and choose the wizard's checkmark button.<br/>
![][13]

The next time you push a commit to your repository, Visual Studio Online will build and deploy your project to Azure.<br/>


<h2><a name="step4"> </a>Step 4: Trigger a rebuild and redeploy your project</h2>

1. In Visual Studio, open up a file and change it. For example, change the file _Layout.cshtml under the Views\Shared folder in an MVC web role.<br/>
![][17]

2. Edit the footer text for the site and save the file.<br/>
![][18]

3. In Solution Explorer, open the shortcut menu for the solution node, project node, or the file you changed, and choose **Commit**.<br/>

4. Type in a comment and choose **Commit**.<br/>
![][20]

5. Choose the **Sync** link.<br/>
![][38]

6. Choose the **Push** link to push your commit to the repository in Visual Studio Online. (You can also use the **Sync** button to copy your commits to the repository. The difference is that **Sync** also pulls the latest changes from the repository.)<br/>
![][39]

7. Choose the Home button to return to the Team Explorer home page.<br/>
![][21]

8. Choose **Builds** to view the builds in progress.<br/>
![][22]
<br/>
Team Explorer shows that a build has been triggered for your check-in.<br/>
![][23]

9. To view a detailed log as the build progresses, double-click the name of the build in progress.<br/>

10. While the build is in-progress, take a look at the build definition that was created when you used the wizard to link to Azure.  Open the shortcut menu for the build definition and choose **Edit Build Definition**.<br/>
![][25]
<br/>
In the **Trigger** tab, you will see that the build definition is set to build on every check-in, by default. (For a cloud service, Visual Studio Online builds and deploys the master branch to the staging environment automatically. You still have to do a manual step to deploy to the live site. For a website that doesn't have staging environment, it deploys the master branch directly to the live site.<br/>
![][26]
<br/>
In the **Process** tab, you can see the deployment environment is set to the name of your cloud service or website.<br/>
![][27]
<br/>
Specify values for the properties if you want different values than the defaults. The properties for Azure publishing are in the Deployment section, and you might also need to set MSBuild parameters. For example, in a cloud service project, to specify a service configuration other than "Cloud", set the MSbuild parameters to /p:TargetProfile=*YourProfile* where *YourProfile* matches a service configuration file with a name like ServiceConfiguration.*YourProfile*.cscfg.
The following table shows the available properties in the Deployment section:
	<table>
<tr><td><b>Property</b></td><td><b>Default Value</b></td></tr>
><tr><td>Allow Untrusted Certificates</td><td>If false, SSL certificates must be signed by a root authority.</td></tr>
<tr><td>Allow Upgrade</td><td>Allows the deployment to update an existing deployment instead of creating a new one. Preserves the IP address.</td></tr>
><tr><td>Do Not Delete</td><td>If true, do not overwrite an existing unrelated deployment (upgrade is allowed).</td></tr>
<tr><td>Path to Deployment Settings</td><td>The path to your .pubxml file for a website, relative to the root folder of the repo. Ignored for cloud services.</td></tr>
<tr><td>Sharepoint Deployment Environment</td><td>The same as the service name</td></tr>
<tr><td>Azure Deployment Environment</td><td>The website or cloud service name</td></tr>
</table>
<br/>

11. By this time, your build should be completed successfully.<br/>
![][28]

12. If you double-click the build name, Visual Studio shows a **Build Summary**, including any test results from associated unit test projects.<br/>
![][29]

13. In the [Azure Portal](http://manage.windowsazure.com), you can view the associated deployment on the Deployments tab when the staging environment is selected.<br/>
![][30]

14.	Browse to your site's URL. For a website, just choose  the **Browse** button in the portal. For a cloud service, choose the URL in the **Quick Glance** section of the **Dashboard** page that shows the Staging environment. Deployments from continuous integration for cloud services are published to the Staging environment by default. You can change this by setting the Alternate Cloud Service Environment property to Production. Here's where the site URL is on the cloud service's dashboard page: <br/>
![][31]
<br/>
A new browser tab will open to reveal your running site.<br/>
![][32]

15.	If you make other changes to your project, you trigger more builds, and you will accumulate multiple deployments. The latest one is marked as Active.<br/>
![][33]

<h2> <a name="step5"> </a>Step 5: Redeploy an earlier build</h2>

This step is optional. In the management portal, select an earlier deployment and click **Redeploy** to rewind your site to an earlier check-in.  Note that this will trigger a new build in TFS, and create a new entry in your deployment history.<br/>
![][34]

<h2> <a name="step6"> </a>Step 6: Change the Production deployment</h2>

 When you are ready, you can promote the Staging environment to the production environment by choosing **Swap** in the management portal. The newly deployed Staging environment is promoted to Production, and the previous Production environment, if any, becomes a Staging environment. The Active deployment may be different for the Production and Staging environments, but the deployment history of recent builds is the same regardless of environment.<br/>
![][35]

<h2> <a name="step7"> </a>Step 6: Deploy from a working branch.</h2>

When you use Git, you usually make changes in a working branch and integrate into the master branch when your development reaches a finished state. During the development phase of a project, you'll want to build and deploy the working branch to Azure.

1. In Team Explorer, choose the **Home** button and then choose the **Branches** button.<br/>
![][40]

2. Choose the **New Branch** link.<br/>
![][41]

3. Enter the name of the branch, such as "working," and choose **Create Branch**. This creates a new local branch.<br/>
![][42]

4. Publish the branch. Choose the branch name in **Unpublished branches**, and choose **Publish**.<br/>
![][44]

6. By default, only changes to the master branch trigger a continuous build. To set up continuous build for a working branch, choose the Builds page in Team Explorer, and choose **Edit Build Definition**.

7. Open the **Source Settings** tab. Under **Monitored branches for continuous integration and build**, choose **Click here to add a new row**.<br/>
![][47]

8. Specify the branch you created, such as refs/heads/working.
![][48]

9. Make a change in the code, open the shortcut menu for the changed file, and choose **Commit**.<br/>
![][43]

10. Choose the **Unsynced Commits** link, and choose  the **Sync** button or the **Push** link to copy the changes to the copy of the working branch in Visual Studio Online.
![][45]

11. Navigate to the **Builds** view and find the build that just got triggered for the working branch.

For more information, see [Visual Studio Online](http://go.microsoft.com/fwlink/?LinkId=253861). For additional tips on using Git with Visual Studio Online, see [Share your code in Git](http://www.visualstudio.com/get-started/share-your-code-in-git-vs.aspx) and for information about using a Git repository that's not managed by Visual Studio Online to publish to Azure, see [Publish to Azure Websites with Git](web-sites-publish-source-control.md).

[Step 1: Create a Git repository.]: #step1
[Step 2: Create a project and push it to your Git repository.]: #step2
[Step 3: Connect the project to Azure.]: #step3
[Step 4: Make changes and trigger a rebuild and redeployment.]: #step4
[Step 5: Redeploy an earlier build (optional)]: #step5
[Step 6: Change the Production deployment]: #step6
[Step 7: Deploy from a working branch]: #step7
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
[17]: ./media/cloud-services-continuous-delivery-use-vso/tfs17.png
[18]: ./media/cloud-services-continuous-delivery-use-vso-git/MakeACodeChange.PNG
[20]: ./media/cloud-services-continuous-delivery-use-vso-git/CommitAChange2.PNG
[21]: ./media/cloud-services-continuous-delivery-use-vso-git/TeamExplorerHome.png
[22]: ./media/cloud-services-continuous-delivery-use-vso-git/TeamExplorerBuilds.PNG
[23]: ./media/cloud-services-continuous-delivery-use-vso-git/BuildInQueue.png
[24]: ./media/cloud-services-continuous-delivery-use-vso/tfs24.png
[25]: ./media/cloud-services-continuous-delivery-use-vso/tfs25.png
[26]: ./media/cloud-services-continuous-delivery-use-vso/tfs26.png
[27]: ./media/cloud-services-continuous-delivery-use-vso-git/ProcessTab.PNG
[28]: ./media/cloud-services-continuous-delivery-use-vso/tfs28.png
[29]: ./media/cloud-services-continuous-delivery-use-vso/tfs29.png
[30]: ./media/cloud-services-continuous-delivery-use-vso/tfs30.png
[31]: ./media/cloud-services-continuous-delivery-use-vso/tfs31.png
[32]: ./media/cloud-services-continuous-delivery-use-vso/tfs32.png
[33]: ./media/cloud-services-continuous-delivery-use-vso/tfs33.png
[34]: ./media/cloud-services-continuous-delivery-use-vso/tfs34.png
[35]: ./media/cloud-services-continuous-delivery-use-vso/tfs35.png
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
