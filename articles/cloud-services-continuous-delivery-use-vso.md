<properties 
	pageTitle="Continuous delivery with Visual Studio Online in Azure" 
	description="Learn how to configure your Visual Studio Online team projects to automatically build and deploy to Azure websites or cloud services." 
	services="app-service\web" 
	documentationCenter=".net" 
	authors="kempb" 
	manager="douge" 
	editor="tglee"/>

<tags 
	ms.service="app-service-web" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/17/2015" 
	ms.author="kempb"/>


# Continuous delivery to Azure using Visual Studio Online

  You can configure your Visual Studio Online team projects to automatically build and deploy to Azure web apps or cloud services.  (For information on how to set up a continuous build and deploy system using an *on-premises* Team Foundation Server, see [Continuous Delivery for Cloud Services in Azure](cloud-services-dotnet-continuous-delivery.md).)

This tutorial assumes you have Visual Studio 2013 and the Azure SDK installed. If you don't already have Visual Studio 2013, download it by choosing the **Get started for free** link at [www.visualstudio.com](http://www.visualstudio.com). Install the Azure SDK from [here](http://go.microsoft.com/fwlink/?LinkId=239540).

> [AZURE.NOTE] You need an Visual Studio online account to complete this tutorial:
> You can [open a Visual Studio Online account for free](http://go.microsoft.com/fwlink/p/?LinkId=512979).

To set up a cloud service to automatically build and deploy to Azure by using Visual Studio Online, follow these steps:

-   [Step 1: Create a team project.][]

-   [Step 2: Check in a project to source control.][]

-   [Step 3: Connect the project to Azure.][]

-   [Step 4: Make changes and trigger a rebuild and redeployment.][]

-   [Step 5: Redeploy an earlier build (optional)][]

-   [Step 6: Change the Production deployment (cloud services only)][]

-	[Step 7: Run unit tests (optional)][]

<h2> <a name="step1"></a>Step 1: Create a team project</h2>

Follow the instructions [here](http://go.microsoft.com/fwlink/?LinkId=512980) to create your team project and link it to Visual Studio. This walkthrough assumes you are using Team Foundation Version Control (TFVC) as your source control solution. If you want to use Git for version control, see [the Git version of this walkthrough](http://go.microsoft.com/fwlink/p/?LinkId=397358).

<h2><a name="step2"> </a>Step 2: Check in a project to source control</h2>

1. In Visual Studio, open the solution you want to deploy, or create a new one.
You can deploy a website or a cloud service (Azure Application) by following the steps in this walkthrough.
If you want to create a new solution, create a new Azure Cloud Service project,
or a new ASP.NET MVC project. Make sure that the project targets .NET Framework 4 or 4.5, and if you are creating a cloud service project, add an ASP.NET MVC web role and a worker role, and choose Internet application for the web role. When prompted, choose **Internet Application**.
If you want to create a website, choose the ASP.NET Web Application project template, and then choose MVC. See [Get started with Azure Websites and ASP.NET](web-sites-dotnet-get-started.md).

> [AZURE.NOTE] Visual Studio Online only support CI deployments of Visual Studio Web Applications at this time. Web Site projects are out of scope.


2. Open the context menu for the solution, and select **Add Solution to Source Control**.<br/>
![][5]

3. Accept or change the defaults and choose the **OK** button. Once the process completes, source control icons appear in Solution Explorer.<br/>
![][6]

4. Open the shortcut menu for the solution, and choose **Check In**.<br/>
![][7]

5. In the Pending Changes area of Team Explorer, type a comment for the check-in and choose the **Check In** button.<br/>
![][8]

<br/>
Note the options to include or exclude specific changes when you check in. If desired changes are excluded, choose the **Include All** link.<br/>
![][9]

<h2> <a name="step3"> </a>Step 3: Connect the project to Azure</h2>

1. Now that you have a VSO team project with some source code in it, you are ready to connect your team project to Azure.  In the [Azure Portal](http://manage.windowsazure.com), select your cloud service or website, or create a new one by selecting the + icon at the bottom left and choosing **Cloud Service** or **Website** and then **Quick Create**. Choose the **Set up publishing with Visual Studio Online** link.<br/>
![][10]

2. In the wizard, type the name of your Visual Studio Online account in the textbox and click the **Authorize Now** link. You might be asked to sign in.<br/>
![][11]

3. In the OAuth pop-up dialog, choose **Accept** to authorize Azure to configure your team project in VSO.<br/>
![][12]

4. When authorization succeeds, you see a dropdown containing a list of your Visual Studio Online team projects.  Select the name of team project that you created in the previous steps, and choose the wizard's checkmark button.<br/>
![][13]

5. When your project is linked, you will see some instructions for checking in changes to your Visual Studio Online team project.  On your next check-in, Visual Studio Online will build and deploy your project to Azure.  Try this now by clicking the **Check In from Visual Studio** link, and then the **Launch Visual Studio** link (or the equivalent **Visual Studio** button at the bottom of the portal screen).<br/>
![][14]

<h2><a name="step4"> </a>Step 4: Trigger a rebuild and redeploy your project</h2>

1. In Visual Studio's Team Explorer, click the **Source Control Explorer** link.<br/>
![][15]

2. Navigate to your solution file and open it.<br/>
![][16]

3. In Solution Explorer, open up a file and change it. For example, change the file _Layout.cshtml under the Views\Shared folder in an MVC web role.<br/>
![][17]

4. Edit the logo for the site and hit Ctrl+S to save the file.<br/>
![][18]

5. In Team Explorer, choose the **Pending Changes** link.<br/>
![][19]

6. Type in a comment and choose the **Check In** button.<br/>
![][20]

7. Choose the Home button to return to the Team Explorer home page.<br/>
![][21]

8. Choose the **Builds** link to view the builds in progress.<br/>
![][22]
<br/>
The Team Explorer shows that a build has been triggered for your check-in.<br/>
![][23]

9. Double-click the name of the build in progress to view a detailed log as the build progresses.<br/>
![][24]

10. While the build is in-progress, take a look at the build definition that was created when you linked TFS to Azure by using the wizard.  Open the shortcut menu for the build definition and choose **Edit Build Definition**.<br/>
![][25]
<br/>
In the **Trigger** tab, you will see that the build definition is set to build on every check-in by default.<br/>
![][26]
<br/>
In the **Process** tab, you can see the deployment environment is set to the name of your cloud service or website. If you are working with websites, the properties you see will be different from those shown here.<br/>
![][27]
<br/>
Specify values for the properties if you want different values than the defaults. The properties for Azure publishing are in the Deployment section.
The following table shows the available properties in the Deployment section:
	<table>
<tr><td><b>Property</b></td><td><b>Default Value</b></td></tr>
><tr><td>Allow Untrusted Certificates</td><td>If false, SSL certificates must be signed by a root authority.</td></tr>
<tr><td>Allow Upgrade</td><td>Allows a the deployment to update an existing deployment instead of creating a new one. Preserves the IP address.</td></tr>
><tr><td>Do Not Delete</td><td>If true, do not overwrite an existing unrelated deployment (upgrade is allowed).</td></tr>
<tr><td>Path to Deployment Settings</td><td>The path to your .pubxml file for a website, relative to the root folder of the repo. Ignored for cloud services.</td></tr>
<tr><td>Sharepoint Deployment Environment</td><td>The same as the service name</td></tr>
<tr><td>Azure Deployment Environment</td><td>The website or cloud service name</td></tr>
</table>
<br/>

If you are using multiple service configurations (.cscfg files), you can specify the desired service configuration in the **Build, Advanced, MSBuild arguments** setting. For example, to use ServiceConfiguration.Test.cscfg, set MSBuild arguments line option /p:TargetProfile=Test.<br/>
![][38]

11. By this time, your build should be completed successfully.<br/>
![][28]

12. If you double-click the build name, Visual Studio shows a **Build Summary**, including any test results from associated unit test projects.<br/>
![][29]

13. In the [Azure Portal](http://manage.windowsazure.com), you can view the associated deployment on the Deployments tab when the staging environment is selected.<br/>
![][30]

14.	Browse to your site's URL. For a website, just click the Browse button on the command bar. For a cloud service, choose the URL in the **Quick Glance** section of the **Dashboard** page that shows the Staging environment for a cloud service. Deployments from continuous integration for cloud services are published to the Staging environment by default. You can change this by setting the Alternate Cloud Service Environment property to Production. This screenshot shows where the site URL is on the cloud service's dashboard page: <br/>
![][31]
<br/>
A new browser tab will open to reveal your running site.<br/>
![][32]

15.	For cloud services, if you make other changes to your project, you trigger more builds, and you will accumulate multiple deployments. The latest one marked as Active.<br/>
![][33]

<h2> <a name="step5"> </a>Step 5: Redeploy an earlier build</h2>

This step applies to cloud services and is optional. In the management portal, select an earlier deployment and click the **Redeploy** button to rewind your site to an earlier check-in.  Note that this will trigger a new build in TFS, and create a new entry in your deployment history.<br/>
![][34]

<h2> <a name="step6"> </a>Step 6: Change the Production deployment</h2>

This step applies only to cloud services, not websites. When you are ready, you can promote the Staging environment to the production environment by choosing the Swap button in the management portal. The newly deployed Staging environment is promoted to Production, and the previous Production environment, if any, becomes a Staging environment. The Active deployment may be different for the Production and Staging environments, but the deployment history of recent builds is the same regardless of environment.<br/>
![][35]

<h2> <a name="step7"> </a>Step 7: Run unit tests</h2>

This step applies only to websites, not cloud services. To put a quality gate on your deployment, you can run unit tests and if they fail, you can stop the deployment.

1.  In Visual Studio, add a unit test project.<br/>
![][39]

2.  Add project references to the project you want to test.<br/>
![][40]

3.  Add some unit tests. To get started, try a dummy test that will always pass.

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

4.  Edit the build definition, choose the Process tab, and expand the Test node.


5.  Set the **Fail build on test failure** to True. This means that the deployment won't occur unless the tests pass.<br/>
![][41]

6.  Queue a new build.<br/>
![][42]
<br/>
![][43]

7. While the build is proceeding, check on its progress.<br/>
![][44]
<br/>
![][45]

7. When the build is done, check the test results.<br/>
![][46]
<br/>
![][47]

8.  Try creating a test that will fail. Add a new test by copying the first one, rename it, and comment out the line of code that states NotImplementedException is an expected exception. 

		[TestMethod]
		//[ExpectedException(typeof(NotImplementedException))]
		public void TestMethod2()
		{
		    throw new NotImplementedException();
		}

9. Check in the change to queue a new build.<br/>
![][48]

10. View the test results to see details about the failure.<br/>
![][49]
<br/>
![][50]

For more about unit testing in Visual Studio Online, see [Run unit tests in your build](http://go.microsoft.com/fwlink/p/?LinkId=510474).

For more information, see [Visual Studio Online](http://go.microsoft.com/fwlink/?LinkId=253861). If you're using Git, see [Share your code in Git](http://www.visualstudio.com/get-started/share-your-code-in-git-vs.aspx) and [Publish to Azure Websites with Git](web-sites-publish-source-control.md).

[Step 1: Create a team project.]: #step1
[Step 2: Check in a project to source control.]: #step2
[Step 3: Connect the project to Azure.]: #step3
[Step 4: Make changes and trigger a rebuild and redeployment.]: #step4
[Step 5: Redeploy an earlier build (optional)]: #step5
[Step 6: Change the Production deployment (cloud services only)]: #step6
[Step 7: Run unit tests (optional)]: #step7
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
