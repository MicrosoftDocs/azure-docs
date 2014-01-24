<properties linkid="dev-net-common-tasks-publishing-with-vso" urlDisplayName="Publishing with TFS" pageTitle="Continuous delivery with Visual Studio Online in Windows Azure" metaKeywords="" description="Learn how to configure your Visual Studio Online team projects to automatically build and deploy to Windows Azure web sites or cloud services." metaCanonical="" services="web-sites" documentationCenter=".NET" title="Continuous delivery to Windows Azure using Visual Studio Online" authors=""  solutions="" writer="ghogen" manager="" editor=""  />




# Continuous delivery to Windows Azure using Visual Studio Online

Visual Studio Online (previously Team Foundation Service) is a cloud-hosted service version of Microsoft's popular Team Foundation Server (TFS) software that provides highly customizable source code and build management, agile development and team process workflow, issue and work item tracking, and more.  You can configure your Visual Studio Online team projects to automatically build and deploy to Windows Azure web sites or cloud services.  For information on how to set up a continuous build and deploy system using an on-premises Team Foundation Server, see [Continuous Delivery for Cloud Applications in Windows Azure](http://www.windowsazure.com/en-us/develop/net/common-tasks/continuous-delivery/).

This tutorial assumes you have Visual Studio 2013 and the Windows Azure SDK installed. If you don't already have Visual Studio 2013, download it [here](http://www.microsoft.com/visualstudio/eng/downloads). Install the Windows Azure SDK from [here](http://go.microsoft.com/fwlink/?LinkId=239540).

To set up a cloud service to automatically build and deploy to Windows Azure by using Visual Studio Online, follow these steps:

-   [Step 1: Sign up for Visual Studio Online.][]

-   [Step 2: Check in a project to source control.][]

-   [Step 3: Connect the project to Windows Azure.][]

-   [Step 4: Make changes and trigger a rebuild and redeployment.][]

-   [Step 5: Redeploy an earlier build (optional)][]

-   [Step 6: Change the Production deployment (cloud services only)][]

<h2> <a name="step1"></a><span class="short-header">Sign up for Visual Studio Online</span>Step 1: Sign up for Visual Studio Online</h2>

1. Create a Visual Studio Online account by navigating to [http://www.visualstudio.com](http://www.visualstudio.com). Click the **Sign up for free** link.
  You will need to sign-in using a Microsoft account. After you log in, provide the requested information and create a TFS account URL. Your account will have the form: https://&lt;accountname&gt;.visualstudio.com.<br/>
![][0]
 
2. Now you can create your first project. Enter the project name and description. Choose the version control system you want to use. Team Foundation Version Control (TFVC) or Git are both supported. Then choose the process template your organization uses, and choose the **Create Project** button.<br/>
![][1]

3. When project creation is done, click the **Open with Visual Studio to connect** button link to automatically launch Visual Studio connected to your team project. If you see any security dialog boxes, choose Allow.<br/>
![][2]

<h2><a name="step2"> </a><span class="short-header">Check in a project to source control.</span>Step 2: Check in a project to source control</h2>

1. In Visual Studio, open the solution you want to deploy, or create a new one.
You can deploy a web site or a cloud service (Windows Azure Application) by following the steps in this walkthrough.
If you want to create a new solution, you can either create a new Windows Azure Cloud Service project,
or a new ASP.NET MVC project. Make sure that the project targets .NET Framework 4,
and add an ASP.NET MVC web role and a worker role. When prompted, choose **Internet Application**.
If you want to create a web site, choose the ASP.NET MVC Application project template.

2. Open the shortcut menu for the solution, and select **Add Solution to Source Control**.<br/>
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

<h2> <a name="step3"> </a><span class="short-header">Connect the project to Windows Azure</span>Step 3: Connect the project to Windows Azure</h2>

1. Now that you have a TFS team project with some source code in it, you are ready to connect your team project to Windows Azure.  In the [Windows Azure Portal](http://manage.windowsazure.com), select your cloud service or web site, or create a new one by selecting the + icon at the bottom left and choosing **Cloud Service** or **Web Site** and then **Quick Create**. Choose the **Set up Visual Studio Online publishing** link.<br/>
![][10]

2. In the wizard, type the name of your Visual Studio Online account in the textbox and click the **Authorize Now** link. You might be asked to sign in.<br/>
![][11]

3. In the OAuth pop-up dialog, choose **Accept** to authorize Windows Azure to configure your team project in TFS.<br/>
![][12]

4. When authorization succeeds, you see a dropdown containing a list of your Visual Studio Online team projects.  Select the name of team project that you created in the previous steps, and choose the wizard's checkmark button.<br/>
![][13]

5. When your project is linked, you will see some instructions for checking in changes to your Visual Studio Online team project.  On your next check-in, Visual Studio Online will build and deploy your project to Windows Azure.  Try this now by clicking the **Check In from Visual Studio** link, and then the **Launch Visual Studio** link. (or the equivalent **Visual Studio** button in the command-bar).<br/>
![][14]

<h2><a name="step4"> </a><span class="short-header">Trigger a rebuild</span>Step 4: Trigger a rebuild and redeploy your project</h2>

1. In Visual Studio's Team Explorer, click the **Source Control Explorer** link.<br/>
![][15]

2. Navigate to your solution file and open it.<br/>
![][16]

3. In Solution Explorer, open up a file and change it. For example, change the file _Layout.cshtml under the Views\Shared folder in an MVC4 web role.<br/>
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

9. Double-click the name of the build in-progress to view a detailed log as the build progresses.<br/>
![][24]

10. While the build is in-progress, take a look at the build definition that was created when you linked TFS to Windows Azure by using the wizard.  Open the shortcut menu for the build definition and choose **Edit Build Definition**.<br/>
![][25]
<br/>
In the **Trigger** tab, you will see that the build definition is set to build on every check-in by default.<br/>
![][26]
<br/>
In the **Process** tab, you can see the deployment environment is set to the name of your cloud service or web site.<br/>
![][27]
<br/>
Specify values for the properties if the values differ from the defaults.
The following table shows default values of the properties:
	<table>
<tr><td><b>Property</b></td><td><b>Default Value</b></td></tr>
<tr><td>Allow Upgrade</td><td>true</td></tr>
<tr><td>Cloud Service Environment</td><td>Staging</td></tr>
<tr><td>Cloud Service Name</td><td>The name of the service you are connected to</td></tr>
<tr><td>Deployment Label</td><td>The same as the service name</td></tr>
<tr><td>Service Configuration</td><td>ServiceConfiguration.Cloud.cscfg</td></tr>
<tr><td>Storage Account Name</td><td>Blank, which means try to find a storage account.</td></tr>
<tr><td>Publish Profile</td><td>The .azurePubxml file. If you check in one, you can choose it here.</td></tr>
</table>
<br/>
If the storage account property is left blank, Windows Azure searches for one. If there is a storage
account with the same name as the cloud service, it is used. Otherwise, it uses another storage account,
or if there is no storage account, it creates one.

11. By this time, your build should be completed successfully.<br/>
![][28]

12. If you double-click the build name, Visual Studio shows a **Build Summary**, including any test results from associated unit test projects.<br/>
![][29]

13. In the [Windows Azure Portal](http://manage.windowsazure.com), you can view the associated deployment on the Deployments tab when the staging environment is selected.<br/>
![][30]

14.	Choose the URL in the **Quick Glance** section of the **Dashboard** page that shows the Staging environment for a cloud service. For a web site, just click the Browse button on the command bar. Deployments from continuous integration for cloud services are published to the Staging environment by default. You can change this by setting the Alternate Cloud Service Environment property to Production. Web sites have no Staging or Production environments. <br/>
![][31]
<br/>
A new browser tab will open to reveal your running site.<br/>
![][32]

15.	If you make other changes to your project, you trigger more builds, and you will accumulate multiple deployments. The latest one marked as Active.<br/>
![][33]

<h2> <a name="step5"> </a><span class="short-header">Redeploy an earlier build</span>Step 5: Redeploy an earlier build</h2>

This step is optional. Select an earlier deployment and click the **Redeploy** button to rewind your site to an earlier check-in.  Note that this will trigger a new build in TFS, and create a new entry in your deployment history.<br/>
![][34]

<h2> <a name="step6"> </a><span class="short-header">Change the Production deployment</span>Step 6: Change the Production deployment</h2>

This step applies only to cloud services, not web sites. When you are ready, you can promote the Staging environment to the production environment by choosing the Swap button. The newly deployed Staging environment is promoted to Production, and the previous Production enviroment, if any, becomes a Staging environment. The Active deployment may be different for the Production and Staging environments, but the deployment history of recent builds is the same regardless of environment.<br/>
![][35]

For more information, see [Visual Studio Online](http://go.microsoft.com/fwlink/?LinkId=253861).

[Step 1: Sign up for Visual Studio Online.]: #step1
[Step 2: Check in a project to source control.]: #step2
[Step 3: Connect the project to Windows Azure.]: #step3
[Step 4: Make changes and trigger a rebuild and redeployment.]: #step4
[Step 5: Redeploy an earlier build (optional)]: #step5
[Step 6: Change the Production deployment (cloud services only)]: #step6
[0]: ./media/cloud-services-continous-delivery-use-tfs/tfs0.PNG
[1]: ./media/cloud-services-continous-delivery-use-tfs/tfs1.png
[2]: ./media/cloud-services-continous-delivery-use-tfs/tfs2.png


[5]: ./media/cloud-services-continous-delivery-use-tfs/tfs5.png
[6]: ./media/cloud-services-continous-delivery-use-tfs/tfs6.png
[7]: ./media/cloud-services-continous-delivery-use-tfs/tfs7.png
[8]: ./media/cloud-services-continous-delivery-use-tfs/tfs8.png
[9]: ./media/cloud-services-continous-delivery-use-tfs/tfs9.png
[10]: ./media/cloud-services-continous-delivery-use-tfs/tfs10.png
[11]: ./media/cloud-services-continous-delivery-use-tfs/tfs11.png
[12]: ./media/cloud-services-continous-delivery-use-tfs/tfs12.png
[13]: ./media/cloud-services-continous-delivery-use-tfs/tfs13.png
[14]: ./media/cloud-services-continous-delivery-use-tfs/tfs14.png
[15]: ./media/cloud-services-continous-delivery-use-tfs/tfs15.png
[16]: ./media/cloud-services-continous-delivery-use-tfs/tfs16.png
[17]: ./media/cloud-services-continous-delivery-use-tfs/tfs17.png
[18]: ./media/cloud-services-continous-delivery-use-tfs/tfs18.png
[19]: ./media/cloud-services-continous-delivery-use-tfs/tfs19.png
[20]: ./media/cloud-services-continous-delivery-use-tfs/tfs20.png
[21]: ./media/cloud-services-continous-delivery-use-tfs/tfs21.png
[22]: ./media/cloud-services-continous-delivery-use-tfs/tfs22.png
[23]: ./media/cloud-services-continous-delivery-use-tfs/tfs23.png
[24]: ./media/cloud-services-continous-delivery-use-tfs/tfs24.png
[25]: ./media/cloud-services-continous-delivery-use-tfs/tfs25.png
[26]: ./media/cloud-services-continous-delivery-use-tfs/tfs26.png
[27]: ./media/cloud-services-continous-delivery-use-tfs/tfs27.png
[28]: ./media/cloud-services-continous-delivery-use-tfs/tfs28.png
[29]: ./media/cloud-services-continous-delivery-use-tfs/tfs29.png
[30]: ./media/cloud-services-continous-delivery-use-tfs/tfs30.png
[31]: ./media/cloud-services-continous-delivery-use-tfs/tfs31.png
[32]: ./media/cloud-services-continous-delivery-use-tfs/tfs32.png
[33]: ./media/cloud-services-continous-delivery-use-tfs/tfs33.png
[34]: ./media/cloud-services-continous-delivery-use-tfs/tfs34.png
[35]: ./media/cloud-services-continous-delivery-use-tfs/tfs35.png
