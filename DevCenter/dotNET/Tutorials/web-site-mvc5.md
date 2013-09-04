<properties linkid="develop-net-tutorials-get-started" urlDisplayName="Get started with Windows Azure" pageTitle="Get started with Windows Azure for .NET" metaKeywords="" metaDescription="This tutorial shows you how to deploy an ASP.NET web site to Windows Azure. In less than 15 minutes you'll have an app up-and-running in the cloud." metaCanonical="" disqusComments="1" umbracoNaviHide="1" writer="tdykstra" editor="mollybos" manager="wpickett" />



<div chunk="../chunks/article-left-menu.md" />

# Deploying an ASP.NET Web Application to a Windows Azure Web Site

This tutorial shows how to deploy an ASP.NET web application to a Windows Azure Web Site by using the Publish Web wizard in Visual Studio 2013 or Visual Studio 2013 for Web Express. (If you prefer to use Visual Studio 2012, see [the previous version of this tutorial](/en-us/develop/net/tutorials/get-started-vs2012/).)

You can open a Windows Azure account for free, and if you don't already have Visual Studio 2013, the SDK automatically installs Visual Studio 2013 for Web Express. So you can start developing for Windows Azure entirely for free.

This tutorial assumes that you have no prior experience using Windows Azure. On completing this tutorial, you'll have a simple web application up and running in the cloud.
 
You'll learn:

* How to enable your machine for Windows Azure development by installing the Windows Azure SDK.
* How to create a Visual Studio ASP.NET MVC 5 project and publish it to a Windows Azure Web Site.

The following illustration shows the completed application:

![Web site home page](../Media/GS13homepage.png)

<div class="dev-callout"><p><strong>Note</strong> To complete this tutorial, you need a Windows Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A261C142F" target="_blank">Windows Azure Free Trial</a>.</p></div>
 
### Tutorial segments

1. [Set up the development environment](#setupdevenv)
2. [Create a web site in Windows Azure](#setupwindowsazure)
3. [Create an ASP.NET MVC 5 application](#createapp)
4. [Deploy the application to Windows Azure](#deploytowindowsazure)
5. [Next steps](#nextsteps)

<h2><a name="setupdevenv"></a><span class="short-header">Set up environment</span>Set up the development environment</h2>

To start, set up your development environment by installing the Windows Azure SDK for the .NET Framework.

1. To install the Windows Azure SDK for .NET, click the following link and choose the Visual Studio 2013 SDK.<br/>
[Windows Azure SDK](http://go.microsoft.com/fwlink/?LinkId=287054)

   ![.NET SDK download page](../Media/GS13SDK.png)

2. When you're prompted to run or save the installation executable, click **Run**.

   ![Download prompt](../Media/GS13downloadsdk.png)

3. In the Web Platform Installer window, click **Install** and proceed with the installation.<br/>

   ![Web Platform Installer - Windows Azure SDK for .NET](../Media/GS13webpi.png)

When the installation is complete, you have everything necessary to start developing.

<h2><a name="setupwindowsazure"></a><span class="short-header">Create site</span>Create a web site</h2>

The next step is to create the Windows Azure web site in Windows Azure. You'll enable **Server Explorer** in Visual Studio to do that, by importing your Windows Azure subscription.

1. Start Visual Studio 2013 or Visual Studio 2013 for Web Express.

1. Click **Server Explorer** in the **View** menu. 

2. In **Server Explorer**, right-click **Windows Azure**, and then click **Import subscriptions**.

  ![Click Import subscriptions](../Media/GS13ImportSubscriptions.png)

2. Sign in to Windows Azure.

   ![Sign in](../Media/GS13SignIn.png)

3. In **Server Explorer**, expand the **Windows Azure** node, right-click **Web Sites**, and click **Add New Site**.

   ![Add New Site](../Media/GS13AddNewSite.png)

3. In the **Create a site on Windows Azure** dialog box, enter a string in the **Site name** box to use as the unique URL for your application.

   The complete URL will consist of what you enter here plus the suffix that you see next to the text box. The illustration shows **example1**, but if someone has already taken that string for a URL, you need to enter a different value.

4. In the **Location** drop-down list, choose the location that is closest to you.

   This setting specifies which data center your web site will run in. 

5. Leave the database fields unchanged.

   For this tutorial you aren't using a database. The [Next Steps](#nextsteps) section at the end of the tutorial links to a tutorial that shows you how to use a database.

6. Click the **Create Web Site** arrow.<br/>

   ![Create a new web site](../Media/GS13createsite.png)

   In a few seconds the web site is created and appears under the Web Sites node in Server Explorer.

   ![Web site created](../Media/GS13sitecreated.png)

<h2><a name="createapp"></a><span class="short-header">Create the app</span>Create an ASP.NET MVC 5 application</h2>

You have created a Windows Azure Web Site, but there is no content in it yet. Your next step is to create the Visual Studio web application project that you'll publish to Windows Azure.

### Create the project

2. From the **File** menu, click **New Project**.

   ![New Project in File menu](../Media/gs13newproj.png)

3. In the **New Project** dialog box, expand **C#** and select **Web** under **Installed Templates**, and then select **ASP.NET Web Application**.

3. Ensure that **.NET Framework 4.5** is selected as the target framework.

4. Name the application **MyExample** and click **OK**.

   ![New Project dialog box](../Media/GS13newprojdb.png)

5. In the **New ASP.NET Project** dialog box, select the **MVC** template and click **Create Project**.

   ![New ASP.NET Project dialog box](../Media/GS13newaspnetprojdb.png)

### Run the application locally

1. Press CTRL+F5 to run the application.
The application home page appears in the default browser.<br/>
![Web site running locally](../Media/GS13homepage.png)

This is all you need to do to create a simple application that you'll deploy to Windows Azure.

<h2><a name="deploytowindowsazure"></a><span class="short-header">Deploy the app</span>Deploy the application to Windows Azure</h2>

5. In Visual Studio, right-click the project in **Solution Explorer** and select **Publish** from the context menu.

   ![Publish in project context menu](../Media/GS13publish.png)

   The **Publish Web** wizard opens.

6. In the **Profile** tab of the **Publish Web** wizard, click **Import**.

   ![Import publish settings](../Media/ImportPublishSettings.png)

   The **Import Publish Profile** dialog box appears.

7. In the **Import Publish Profile** dialog box, select **Import from a Windows Azure web site**, select your web site from the drop-down list, and then click **OK**.

   ![Import Publish Profile](../Media/ImportPublishProfile.png)

8. In the **Connection** tab, click **Validate Connection** to make sure that the settings are correct.

   ![Validate connection](../Media/ValidateConnection.png)

   When the connection has been validated, a green check mark is shown next to the **Validate Connection** button. 

9. Click **Next**.

   ![Successfully validated connection](../Media/ValidateConnectionSuccess.png)

10. In the **Settings** tab, uncheck the **Use this connection string at runtime** option, since this application is not using a database.

   You can accept the default settings for the remaining items on this page.  You are deploying a Release build configuration and you don't need to delete files at the destination server, precompile the application, or exclude files in the App_Data folder.

10. Click **Next**.

   ![Settings tab](../Media/PublishWebSettingsTab.png)

11. In the **Preview** tab, click **Start Preview**.

   ![StartPreview button in the Preview tab](../Media/PublishWebStartPreview.png)

   The tab displays a list of the files that will be copied to the server. 

   ![StartPreview file output](../Media/GS13previewoutput.png)

   Displaying the preview isn't required to publish the application but is a useful function to be aware of. In this case, you don't need to do anything with the list of files that is displayed.

12. Click **Publish**.

   Visual Studio begins the process of copying the files to the Windows Azure server.

13. The **Output** window shows what deployment actions were taken and reports successful completion of the deployment.

   ![Output window reporting successful deployment](../Media/PublishOutput.png)

14. Upon successful deployment, the default browser automatically opens to the URL of the deployed web site.

   The application you created is now running in the cloud.

   ![Web site running in Windows Azure](../Media/GS13deployedsite.png)

<h2><a name="nextsteps"></a><span class="short-header">Next steps</span>Next steps</h2>

In this tutorial, you've seen how to deploy a simple web application to a Windows Azure Web Site. Other resources are available to show you how to manage, scale, and troubleshoot the site, how to add database, authentication, and authorization functionality, and  how to decide if your application should run in a Windows Azure Cloud Service instead of a Windows Azure Web Site.

<h3>How to manage a web site</h3>
When you're done with the site, you can delete it, and at times you might want to take it offline temporarily or change site settings. You can do some of these functions right from **Server Explorer** in Visual Studio. For information about what you can do in **Server Explorer**, see [Troubleshooting Windows Azure Web Sites in Visual Studio](/en-us/develop/net/tutorials/troubleshoot-web-sites-in-visual-studio/).

To delete your web site when you're done with it, you can use the [Windows Azure Management Portal][Portal]. The following screen shot shows **Stop**, **Restart**, and **Delete** buttons in the **Dashboard** tab of the management portal.

![Management Portal Dashboard Tab](../Media/MPStopStartDelete.png)

You can change site settings on the **Configure** tab. For more information, see [How to Manage Web Sites](/en-us/manage/services/web-sites/how-to-manage-websites/).

<h3>How to scale a web site</h3>
When your site is public and it starts to get more traffic, response times might slow down. To remedy that, you can easily add server resources in the **Scale** tab of the management portal. For more information, see [How to Scale a Web Site](/en-us/manage/services/web-sites/how-to-scale-websites/). (Adding server resources to scale a web site is not free.)

<h3>How to troubleshoot a web site</h3>
You might want to look at trace or log output for help with troubleshooting. Visual Studio provides built-in tooling to make it easy to view Windows Azure logs as they are generated in real time. For more information, see [Troubleshooting Windows Azure Web Sites in Visual Studio](/en-us/develop/net/tutorials/troubleshoot-web-sites-in-visual-studio/).

<h3>How to add database and authorization functionality</h3>
Most production web sites use a database and restrict some site functions to certain authorized users. For a tutorial that shows how to get started with database access, authentication, and authorization, see [Deploy a Secure ASP.NET MVC app with Membership, OAuth, and SQL Database to a Windows Azure Web Site](/en-us/develop/net/tutorials/web-site-with-sql-database/).

<h3>How to decide if your application should run in a Cloud Service</h3>
In some scenarios you might want to run your application in a Windows Azure Cloud Service instead of a Windows Azure Web Site. For more information, see [Windows Azure Execution Models](/en-us/develop/net/fundamentals/compute/) and [Windows Azure Web Sites, Cloud Services, and VMs: When to use which?](http://msdn.microsoft.com/en-us/library/windowsazure/jj218759.aspx). For a tutorial series that shows how to create a multi-tier ASP.NET web application and deploy it to a Cloud Service, see [.NET Multi-Tier Application Using Storage Tables, Queues, and Blobs](/en-us/develop/net/tutorials/multi-tier-web-site/1-overview/).

[Portal]: http://manage.windowsazure.com
