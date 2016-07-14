<properties
	pageTitle="Continuous delivery with Visual Studio Team Services in Azure | Microsoft Azure"
	description="Learn how to configure your Visual Studio Team Services team projects to automatically build and deploy to the Web App feature in Azure App Service or cloud services."
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

# Continuous delivery to Azure using Visual Studio Team Services

You can configure your Visual Studio Team Services team projects to automatically build and deploy to Azure web apps or cloud services.  (For information on how to set up a continuous build and deploy system using an *on-premises* Team Foundation Server, see [Continuous Delivery for Cloud Services in Azure](cloud-services-dotnet-continuous-delivery.md).)

This tutorial assumes you have Visual Studio 2013 and the Azure SDK installed. If you don't already have Visual Studio 2013, download it by choosing the **Get started for free** link at [www.visualstudio.com](http://www.visualstudio.com). Install the Azure SDK from [here](http://go.microsoft.com/fwlink/?LinkId=239540).

> [AZURE.NOTE] You need an Visual Studio Team Services account to complete this tutorial:
> You can [open a Visual Studio Team Services account for free](http://go.microsoft.com/fwlink/p/?LinkId=512979).

To set up a cloud service to automatically build and deploy to Azure by using Visual Studio Team Services, follow these steps.

## 1: Create a team project

Follow the instructions [here](http://go.microsoft.com/fwlink/?LinkId=512980) to create your team project and link it to Visual Studio. This walkthrough assumes you are using Team Foundation Version Control (TFVC) as your source control solution. If you want to use Git for version control, see [the Git version of this walkthrough](http://go.microsoft.com/fwlink/p/?LinkId=397358).

## 2: Check in a project to source control

1. In Visual Studio, open the solution you want to deploy, or create a new one.
You can deploy a web app or a cloud service (Azure Application) by following the steps in this walkthrough.
If you want to create a new solution, create a new Azure Cloud Service project,
or a new ASP.NET MVC project. Make sure that the project targets .NET Framework 4 or 4.5, and if you are creating a cloud service project, add an ASP.NET MVC web role and a worker role, and choose Internet application for the web role. When prompted, choose **Internet Application**.
If you want to create a web app, choose the ASP.NET Web Application project template, and then choose MVC. See [Create an ASP.NET web app in Azure App Service](../app-service-web/web-sites-dotnet-get-started.md).

	> [AZURE.NOTE] Visual Studio Team Services only support CI deployments of Visual Studio Web Applications at this time. Web Site projects are out of scope.

1. Open the context menu for the solution, and choose **Add Solution to Source Control**.

	![][5]

1. Accept or change the defaults and choose the **OK** button. Once the process completes, source control icons appear in **Solution Explorer**.

	![][6]

1. Open the shortcut menu for the solution, and choose **Check In**.

	![][7]

1. In the **Pending Changes** area of **Team Explorer**, type a comment for the check-in and choose the **Check In** button.

	![][8]

	Note the options to include or exclude specific changes when you check in. If desired changes are excluded, choose the **Include All** link.

	![][9]

## 3: Connect the project to Azure

1. Now that you have a VS Team Services team project with some source code in it, you are ready to connect your team project to Azure.  In the [Azure classic portal](http://go.microsoft.com/fwlink/?LinkID=213885), select your cloud service or web app, or create a new one by choosing the **+** icon at the bottom left and choosing **Cloud Service** or **Web App** and then **Quick Create**. Choose the **Set up publishing with Visual Studio Team Services** link.

	![][10]

1. In the wizard, type the name of your Visual Studio Team Services account in the textbox and click the **Authorize Now** link. You might be asked to sign in.

	![][11]

1. In the **Connection Request** pop-up dialog, choose the **Accept** button to authorize Azure to configure your team project in VS Team Services.

	![][12]

1. When authorization succeeds, you see a dropdown containing a list of your Visual Studio Team Services team projects. Choose  the name of team project that you created in the previous steps, and then choose the wizard's checkmark button.

	![][13]

1. After your project is linked, you will see some instructions for checking in changes to your Visual Studio Team Services team project.  On your next check-in, Visual Studio Team Services will build and deploy your project to Azure.  Try this now by clicking the **Check In from Visual Studio** link, and then the **Launch Visual Studio** link (or the equivalent **Visual Studio** button at the bottom of the portal screen).

	![][14]

## 4: Trigger a rebuild and redeploy your project

1. In Visual Studio's **Team Explorer**, choose the **Source Control Explorer** link.

	![][15]

1. Navigate to your solution file and open it.

	![][16]

1. In **Solution Explorer**, open up a file and change it. For example, change the file `_Layout.cshtml` under the Views\\Shared folder in an MVC web role.

	![][17]

1. Edit the logo for the site and choose **Ctrl+S** to save the file.

	![][18]

1. In **Team Explorer**, choose the **Pending Changes** link.

	![][19]

1. Enter a comment and then choose the **Check In** button.

	![][20]

1. Choose the **Home** button to return to the **Team Explorer** home page.

	![][21]

1. Choose the **Builds** link to view the builds in progress.

	![][22]

	**Team Explorer** shows that a build has been triggered for your check-in.

	![][23]

1. Double-click the name of the build in progress to view a detailed log as the build progresses.

	![][24]

1. While the build is in-progress, take a look at the build definition that was created when you linked TFS to Azure by using the wizard.  Open the shortcut menu for the build definition and choose **Edit Build Definition**.

	![][25]

	In the **Trigger** tab, you will see that the build definition is set to build on every check-in by default.

	![][26]

	In the **Process** tab, you can see the deployment environment is set to the name of your cloud service or web app. If you are working with web apps, the properties you see will be different from those shown here.

	![][27]

1. Specify values for the properties if you want different values than the defaults. The properties for Azure publishing are in the **Deployment** section.

	The following table shows the available properties in the **Deployment** section:

	|Property|Default Value|
	|---|---|
	|Allow Untrusted Certificates|If false, SSL certificates must be signed by a root authority.|
	|Allow Upgrade|Allows the deployment to update an existing deployment instead of creating a new one. Preserves the IP address.|
	|Do Not Delete|If true, do not overwrite an existing unrelated deployment (upgrade is allowed).|
	|Path to Deployment Settings|The path to your .pubxml file for a web app, relative to the root folder of the repo. Ignored for cloud services.|
	|Sharepoint Deployment Environment|The same as the service name.|
	|Azure Deployment Environment|The web app or cloud service name.|

1. If you are using multiple service configurations (.cscfg files), you can specify the desired service configuration in the **Build, Advanced, MSBuild arguments** setting. For example, to use ServiceConfiguration.Test.cscfg, set MSBuild arguments line option `/p:TargetProfile=Test`.

	![][38]

	By this time, your build should be completed successfully.

	![][28]

1. If you double-click the build name, Visual Studio shows a **Build Summary**, including any test results from associated unit test projects.

	![][29]

1. In the [Azure classic portal](http://go.microsoft.com/fwlink/?LinkID=213885), you can view the associated deployment on the **Deployments** tab when the staging environment is selected.

	![][30]

1.	Browse to your site's URL. For a web app, just click the **Browse** button on the command bar. For a cloud service, choose the URL in the **Quick Glance** section of the **Dashboard** page that shows the Staging environment for a cloud service. Deployments from continuous integration for cloud services are published to the Staging environment by default. You can change this by setting the **Alternate Cloud Service Environment** property to **Production**. This screenshot shows where the site URL is on the cloud service's dashboard page.

	![][31]

	A new browser tab will open to reveal your running site.

	![][32]

	For cloud services, if you make other changes to your project, you trigger more builds, and you will accumulate multiple deployments. The latest one marked as Active.

	![][33]

## 5: Redeploy an earlier build

This step applies to cloud services and is optional. In the Azure classic portal, choose an earlier deployment and then choose the **Redeploy** button to rewind your site to an earlier check-in.  Note that this will trigger a new build in TFS and create a new entry in your deployment history.

![][34]

## 6: Change the Production deployment

This step applies only to cloud services, not web apps. When you are ready, you can promote the Staging environment to the production environment by choosing the **Swap** button in the Azure classic portal. The newly deployed Staging environment is promoted to Production, and the previous Production environment, if any, becomes a Staging environment. The Active deployment may be different for the Production and Staging environments, but the deployment history of recent builds is the same regardless of environment.

![][35]

## 7: Run unit tests

This step applies only to web apps, not cloud services. To put a quality gate on your deployment, you can run unit tests and if they fail, you can stop the deployment.

1.  In Visual Studio, add a unit test project.

	![][39]

1.  Add project references to the project you want to test.

	![][40]

1.  Add some unit tests. To get started, try a dummy test that will always pass.

		```
		using System;
		using Microsoft.VisualStudio.TestTools.UnitTesting;

		namespace UnitTestProject1
		{
		    [TestClass]
		    public class UnitTest1
		    {
		        [TestMethod]
		        [ExpectedException(typeof(NotImplementedException))]
		        public void TestMethod1()
		        {
		            throw new NotImplementedException();
		        }
		    }
		}
		```

1.  Edit the build definition, choose the **Process** tab, and expand the **Test** node.

1.  Set the **Fail build on test failure** to True. This means that the deployment won't occur unless the tests pass.

	![][41]

1.  Queue a new build.

	![][42]

	![][43]

1. While the build is proceeding, check on its progress.

	![][44]

	![][45]

1. When the build is done, check the test results.

	![][46]

	![][47]

1.  Try creating a test that will fail. Add a new test by copying the first one, rename it, and comment out the line of code that states NotImplementedException is an expected exception.

		```
		[TestMethod]
		//[ExpectedException(typeof(NotImplementedException))]
		public void TestMethod2()
		{
		    throw new NotImplementedException();
		}
		```

1. Check in the change to queue a new build.

	![][48]

1. View the test results to see details about the failure.

	![][49]

	![][50]

## Next steps
For more about unit testing in Visual Studio Team Services, see [Run unit tests in your build](http://go.microsoft.com/fwlink/p/?LinkId=510474). If you're using Git, see [Share your code in Git](http://www.visualstudio.com/get-started/share-your-code-in-git-vs.aspx) and [Continuous deployment using GIT in Azure App Service](../app-service-web/web-sites-publish-source-control.md).  For more information about Visual Studio Team Services, see [Visual Studio Team Services](http://go.microsoft.com/fwlink/?LinkId=253861).

[0]: ./media/cloud-services-continuous-delivery-use-vso/tfs0.PNG
[1]: ./media/cloud-services-continuous-delivery-use-vso/tfs1.png
[2]: ./media/cloud-services-continuous-delivery-use-vso/tfs2.png

[5]: ./media/cloud-services-continuous-delivery-use-vso/tfs5.png
[6]: ./media/cloud-services-continuous-delivery-use-vso/tfs6.png
[7]: ./media/cloud-services-continuous-delivery-use-vso/tfs7.png
[8]: ./media/cloud-services-continuous-delivery-use-vso/tfs8.png
[9]: ./media/cloud-services-continuous-delivery-use-vso/tfs9.png
[10]: ./media/cloud-services-continuous-delivery-use-vso/tfs10.png
[11]: ./media/cloud-services-continuous-delivery-use-vso/tfs11.png
[12]: ./media/cloud-services-continuous-delivery-use-vso/tfs12.png
[13]: ./media/cloud-services-continuous-delivery-use-vso/tfs13.png
[14]: ./media/cloud-services-continuous-delivery-use-vso/tfs14.png
[15]: ./media/cloud-services-continuous-delivery-use-vso/tfs15.png
[16]: ./media/cloud-services-continuous-delivery-use-vso/tfs16.png
[17]: ./media/cloud-services-continuous-delivery-use-vso/tfs17.png
[18]: ./media/cloud-services-continuous-delivery-use-vso/tfs18.png
[19]: ./media/cloud-services-continuous-delivery-use-vso/tfs19.png
[20]: ./media/cloud-services-continuous-delivery-use-vso/tfs20.png
[21]: ./media/cloud-services-continuous-delivery-use-vso/tfs21.png
[22]: ./media/cloud-services-continuous-delivery-use-vso/tfs22.png
[23]: ./media/cloud-services-continuous-delivery-use-vso/tfs23.png
[24]: ./media/cloud-services-continuous-delivery-use-vso/tfs24.png
[25]: ./media/cloud-services-continuous-delivery-use-vso/tfs25.png
[26]: ./media/cloud-services-continuous-delivery-use-vso/tfs26.png
[27]: ./media/cloud-services-continuous-delivery-use-vso/tfs27.png
[28]: ./media/cloud-services-continuous-delivery-use-vso/tfs28.png
[29]: ./media/cloud-services-continuous-delivery-use-vso/tfs29.png
[30]: ./media/cloud-services-continuous-delivery-use-vso/tfs30.png
[31]: ./media/cloud-services-continuous-delivery-use-vso/tfs31.png
[32]: ./media/cloud-services-continuous-delivery-use-vso/tfs32.png
[33]: ./media/cloud-services-continuous-delivery-use-vso/tfs33.png
[34]: ./media/cloud-services-continuous-delivery-use-vso/tfs34.png
[35]: ./media/cloud-services-continuous-delivery-use-vso/tfs35.png
[36]: ./media/cloud-services-continuous-delivery-use-vso/tfs36.PNG
[37]: ./media/cloud-services-continuous-delivery-use-vso/tfs37.PNG
[38]: ./media/cloud-services-continuous-delivery-use-vso/AdvancedMSBuildSettings.PNG
[39]: ./media/cloud-services-continuous-delivery-use-vso/AddUnitTestProject.PNG
[40]: ./media/cloud-services-continuous-delivery-use-vso/AddProjectReferences.PNG
[41]: ./media/cloud-services-continuous-delivery-use-vso/EditBuildDefinitionForTest.PNG
[42]: ./media/cloud-services-continuous-delivery-use-vso/QueueNewBuild.PNG
[43]: ./media/cloud-services-continuous-delivery-use-vso/QueueBuildDialog.PNG
[44]: ./media/cloud-services-continuous-delivery-use-vso/BuildInTeamExplorer.PNG
[45]: ./media/cloud-services-continuous-delivery-use-vso/BuildRequestInfo.PNG
[46]: ./media/cloud-services-continuous-delivery-use-vso/BuildSucceeded.PNG
[47]: ./media/cloud-services-continuous-delivery-use-vso/TestResultsPassed.PNG
[48]: ./media/cloud-services-continuous-delivery-use-vso/CheckInChangeToMakeTestsFail.PNG
[49]: ./media/cloud-services-continuous-delivery-use-vso/TestsFailed.PNG
[50]: ./media/cloud-services-continuous-delivery-use-vso/TestsResultsFailed.PNG
