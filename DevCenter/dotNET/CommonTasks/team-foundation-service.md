<properties linkid="dev-net-common-tasks-team-foundation-service" urldisplayname="Team Foundation Service" headerexpose="" pagetitle="Continuous Delivery of a Cloud Service by Using Team Foundation Service" metakeywords="" footerexpose="" metadescription="" umbraconavihide="0" disquscomments="1"></properties>

<div chunk="../chunks/article-left-menu.md" />
# Continuous delivery to Windows Azure by using Team Foundation Service

Microsoft Team Foundation Service is a cloud-hosted service version of Microsoft’s popular Team Foundation Server (TFS) software that provides highly customizable source code and build management, agile development and team process workflow, issue and work item tracking, and more.  You can configure your Team Foundation Service team projects to automatically build and deploy to Windows Azure websites or cloud services.  For information on how to set up a continuous build and deploy system using an on-premises Team Foundation Server, see [Continuous Delivery for Cloud Applications in Windows Azure](http://www.windowsazure.com/en-us/develop/net/common-tasks/continuous-delivery/).

This tutorial assumes you have Visual Studio 2012 and the Windows Azure SDK installed. If you don’t already have Visual Studio 2012, download it [here](http://www.microsoft.com/visualstudio/eng/downloads). You can use Visual Studio 2010, but you must have SP1 installed and you must install the [Compatibility GDR](http://www.microsoft.com/en-us/download/details.aspx?Id=29082).  Install the Windows Azure SDK from [here](http://go.microsoft.com/fwlink/?LinkId=239540).

To set up a cloud service to automatically build and deploy to Windows Azure by using Team Foundation Service, follow these steps:

-   [Step 1: Sign up for TFS.][]

-   [Step 2: Check in a project to TFS.][]

-   [Step 3: Connect the project to Windows Azure.][]

-   [Step 4: Make changes and trigger a rebuild and redeployment.][]

-   [Step 5: Redeploy an earlier build (optional)][]

-   [Step 6: Change the Production deployment (cloud services only)][]

<h2> <a name="step1"></a><span class="short-header">Sign up for TFS</span>Step 1: Sign up for TFS Preview</h2>

1.	Create a TFS account by navigating to [http://tfs.visualstudio.com](http://tfs.visualstudio.com). Click the **Sign up for free** link.
  You will need to sign-in using a Microsoft account. After you log in, create a TFS account URL.
![][0]
 
2.	Create a team project by navigating to your TFS account page. Your account will have the form: https://&lt;username&gt;.visualstudio.com.<br/>
![][1]

3. Select Create a Team Project. Give a name and description to your project and click the **Create Project** button.<br/>
![][2]

4. When project creation is done, click the **Navigate to Project** button.<br/>
![][3]

<h2><a name="step2"> </a><span class="short-header">Check in a project</span>Step 2: Check in a project to TFS</h2>

1. Click the **Open new instance in Visual Studio** link to automatically launch Visual Studio connected to your team project. If you see any security dialog boxes, choose Allow. This step requires Visual Studio 2012.<br/>
![][4]

2. In Visual Studio, open the solution you want to deploy, or create a new one.
You can deploy a website or a cloud service (Windows Azure Application) by following the steps in this walkthrough.
If you want to create a new solution, you can either create a new Windows Azure Cloud Service project,
or a new ASP.NET MVC4 project. Make sure that the project targets .NET Framework 4,
and add an ASP.NET MVC 4 web role and a worker role. When prompted, choose **Internet Application**.
If you want to create a website, choose the ASP.NET MVC4 Application project template.

3. Open the shortcut menu for the solution, and select **Add Solution to Source Control**.<br/>
![][5]

4. Accept or change the defaults and choose the **OK** button. Once the process completes, source control icons appear in Solution Explorer.<br/>
![][6]

5. Open the shortcut menu for the solution, and choose **Check In**.<br/>
![][7]

6. In the Pending Changes area of Team Explorer, type a comment for the check-in and choose the **Check In** button.<br/>
![][8]
<br/>
Note the options to include or exclude specific changes when you check in. If desired changes are excluded, choose the **Include All** link.<br/>
![][9]

<h2> <a name="step3"> </a><span class="short-header">Connect the project to Windows Azure</span>Step 3: Connect the project to Windows Azure</h2>

1. Now that you have a TFS team project with some source code in it, you are ready to connect your team project to Windows Azure.  In the [Windows Azure Preview Portal](http://manage.windowsazure.com), select your cloud service or web site, or create a new one by selecting the + icon at the bottom left and choosing **Cloud Service** or **Web Site** and then **Quick Create**. Choose the **Set up TFS publishing** link.<br/>
![][10]

2. In the wizard, type the name of your TFS account in the textbox and click the **Authorize Now** link. You might be asked to sign in.<br/>
![][11]

3. In the OAuth pop-up dialog, choose **Accept** to authorize Windows Azure to configure your team project in TFS.<br/>
![][12]

4. When authorization succeeds, you see a dropdown containing a list of your TFS team projects.  Select the name of team project that you created in the previous steps, and choose the wizard’s checkmark button.<br/>
![][13]

5. When your project is linked, you will see some instructions for checking in changes to your TFS team project.  On your next check-in, TFS will build and deploy your project to Windows Azure.  Try this now by clicking the **Check In from Visual Studio 2012** link, and then the **Launch Visual Studio 2012** link. (or the equivalent **Visual Studio** button in the command-bar).<br/>
![][14]

<h2><a name="step4"> </a><span class="short-header">Trigger a rebuild</span>Step 4: Trigger a rebuild and redeploy your project</h2>

1. In Visual Studio’s Team Explorer, click the **Source Control Explorer** link.<br/>
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

13. In the [Windows Azure Preview Portal](http://manage.windowsazure.com), you can view the associated deployment on the Deployments tab when the staging environment is selected.<br/>
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

For more information, see [Team Foundation Service](http://go.microsoft.com/fwlink/?LinkId=253861).

[Step 1: Sign up for TFS Preview.]: #step1
[Step 2: Check in a project to TFS.]: #step2
[Step 3: Connect the project to Windows Azure.]: #step3
[Step 4: Make changes and trigger a rebuild and redeployment.]: #step4
[Step 5: Redeploy an earlier build (optional)]: #step5
[Step 6: Change the Production deployment (cloud services only)]: #step6
[0]: ../../../DevCenter/dotNet/Media/tfs0.PNG
[1]: ../../../DevCenter/dotNet/Media/tfs1.png
[2]: ../../../DevCenter/dotNet/Media/tfs2.png
[3]: ../../../DevCenter/dotNet/Media/tfs3.png
[4]: ../../../DevCenter/dotNet/Media/tfs4.png
[5]: ../../../DevCenter/dotNet/Media/tfs5.png
[6]: ../../../DevCenter/dotNet/Media/tfs6.png
[7]: ../../../DevCenter/dotNet/Media/tfs7.png
[8]: ../../../DevCenter/dotNet/Media/tfs8.png
[9]: ../../../DevCenter/dotNet/Media/tfs9.png
[10]: ../../../DevCenter/dotNet/Media/tfs10.png
[11]: ../../../DevCenter/dotNet/Media/tfs11.png
[12]: ../../../DevCenter/dotNet/Media/tfs12.png
[13]: ../../../DevCenter/dotNet/Media/tfs13.png
[14]: ../../../DevCenter/dotNet/Media/tfs14.png
[15]: ../../../DevCenter/dotNet/Media/tfs15.png
[16]: ../../../DevCenter/dotNet/Media/tfs16.png
[17]: ../../../DevCenter/dotNet/Media/tfs17.png
[18]: ../../../DevCenter/dotNet/Media/tfs18.png
[19]: ../../../DevCenter/dotNet/Media/tfs19.png
[20]: ../../../DevCenter/dotNet/Media/tfs20.png
[21]: ../../../DevCenter/dotNet/Media/tfs21.png
[22]: ../../../DevCenter/dotNet/Media/tfs22.png
[23]: ../../../DevCenter/dotNet/Media/tfs23.png
[24]: ../../../DevCenter/dotNet/Media/tfs24.png
[25]: ../../../DevCenter/dotNet/Media/tfs25.png
[26]: ../../../DevCenter/dotNet/Media/tfs26.png
[27]: ../../../DevCenter/dotNet/Media/tfs27.png
[28]: ../../../DevCenter/dotNet/Media/tfs28.png
[29]: ../../../DevCenter/dotNet/Media/tfs29.png
[30]: ../../../DevCenter/dotNet/Media/tfs30.png
[31]: ../../../DevCenter/dotNet/Media/tfs31.png
[32]: ../../../DevCenter/dotNet/Media/tfs32.png
[33]: ../../../DevCenter/dotNet/Media/tfs33.png
[34]: ../../../DevCenter/dotNet/Media/tfs34.png
[35]: ../../../DevCenter/dotNet/Media/tfs35.png