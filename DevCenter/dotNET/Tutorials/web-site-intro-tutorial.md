#  Deploying an ASP.NET Web Site to a Windows Azure Web Site

This tutorial shows how to deploy an ASP.NET web application to a Windows Azure Web Site by using the Publish Web wizard in Visual Studio 2012 RC or Visual Studio 2012 for Web Express RC. If you prefer, you can follow the tutorial steps by using Visual Studio 2010 or Visual Web Developer Express 2010.

You can open a Windows Azure account for free, and if you don't already have Visual Studio 2012, the SDK automatically installs Visual Studio 2012 for Web Express. So you can start developing for Windows Azure entirely for free.

This tutorial assumes that you have no prior experience using Windows Azure. On completing this tutorial, you'll have a web application up and running in the cloud.
 
You'll learn:

* How to enable your machine for Windows Azure development by installing the Windows Azure SDK.
* How to create a Visual Studio ASP.NET MVC 4 project and publish it to a Windows Azure Web Site.
* How to publish application updates to Windows Azure.

You'll build a simple web application that is built on ASP.NET MVC 4. The following illustration shows the completed application:

![screenshot of web site][nodb-image17]

<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />
 
## Tutorial segments

1. [Set Up the development environment][]
2. [Create a web site in Windows Azure][]
3. [Create an ASP.NET MVC 4 application][]
4. [Deploy the application to Windows Azure][]
7. [Important information about ASP.NET in Windows Azure Web Sites][]
8. [Next steps][]

<h2><a name="setupdevenv"></a>Set up the development environment</h2>

To start, set up your development environment by installing the Windows Azure SDK for the .NET Framework. (If you already have Visual Studio or Visual Web Developer, the SDK isn't required for this tutorial. It will be required later if you follow the suggestions for further learning at the end of the tutorial.) 

1. To install the Windows Azure SDK for .NET, click the link that corresponds to the version of Visual Studio you are using. If you don't have Visual Studio installed yet, use the Visual Studio 2012 link.<br/>
[Windows Azure SDK for Visual Studio 2010][]<br/>
[Windows Azure SDK for Visual Studio 2012 RC][]
2. When you are prompted to run or save VWDOrVs11AzurePack_RC.3f.3f.3fnew.exe, click **Run**.<br/>
3. In the Web Platform Installer window, click **Install** and proceed with the installation.<br/>
![Web Platform Installer - Windows Azure SDK for .NET][Image003]<br/>
4. If you are using Visual Studio 2010 or Visual Web Developer 2010 Express, install [MVC 4][MVC4Install].

When the installation is complete, you have everything necessary to start developing.

<h2><a name="setupwindowsazure"></a>Create a web site in Windows Azure</h2>

The next step is to create the Windows Azure web site and the SQL database that your application will use.

1. In the [Windows Azure Management Portal][NewPortal], click **New**.<br/>
![New button in Management Portal][Image011]
2. Click **Web Site**, and then click **Quick Create**.<br/>
3. Enter a string in the **URL** box to use as the unique URL for your application.<br/>The complete URL will consist of what you enter here plus the suffix that you see below the text box. The illustration shows "windowsazurewebsite", but if someone has already taken that URL you have to choose a different one.
6. In the **Region** drop-down list, choose the region that is closest to you.<br/>
This setting specifies which data center your VM will run in.
9. Click the check mark at the bottom of the box to indicate you're finished.<br/>
![Quick Create link in Management Portal][nodb-image01]<br/>
The Management Portal returns to the Web Sites page, and the **Status** column shows that the site is being created. After a while (typically less than a minute), the **Status** column shows that the site was successfully created. In the navigation bar at the left, the number of sites you have in your account appears next to the **Web Sites** icon.<br/>
![Web Sites page of Management Portal, web site created][nodb-image02]<br/>

<h2><a name="createmvc4app"></a>Create an ASP.NET MVC 4 application</h2>

You have created a Windows Azure Web Site, but there is no content in it yet. Your next step is to create the Visual Studio web application project that you'll publish to Windows Azure.

### Create the project

1. Start Visual Studio 2012 or Visual Studio 2012 for Web Express.
2. From the **File** menu select **New Project**.<br/>
![New Project in File menu][Image020]
3. In the **New Project** dialog box, expand **C#** and select **Web** under **Installed Templates** and then select **ASP.NET MVC 4 Web Application**. 
3. Change the **.NET Framework** drop-down list from **.NET Framework 4.5** to **.NET Framework 4**. (As this tutorial is being written, Windows Azure Web Sites do not support ASP.NET 4.5.)
4. Name the application **WindowsAzureWebSite** and click **OK**.<br/>
![New Project dialog box][nodb-image03]
5. In the **New ASP.NET MVC 4 Project** dialog box, select the **Internet Application** template.
6. In the **View Engine** drop-down list make sure that **Razor** is selected, and then click **OK**.<br/>
![New ASP.NET MVC 4 Project dialog box][nodb-image04]

### Set the page header and footer

1. In **Solution Explorer**, expand the Views\Shared folder and open the &#95;Layout.cshtml file.<br/>
![_Layout.cshtml in Solution Explorer][Image023]
2. In the **&lt;title&gt;** element, change "My ASP.NET MVC Application" to "My Windows Azure Web Site".
3. In the **&lt;header&gt;** element, change "your logo here." to "My Windows Azure Web Site".<br/>
![title and header in _Layout.cshtml][nodb-image05]
4. In the **&lt;footer&gt;** element, change "My ASP.NET MVC Application" to "My Windows Azure Web Site".<br/>
![footer in _Layout.cshtml][nodb-image06]

### Run the application locally

1. Press CTRL+F5 to run the application.
The application home page appears in the default browser.<br/>
![To Do List home page][nodb-image07]

This is all you need to do for now to create the application that you'll deploy to Windows Azure.

<h2><a name="deploytowindowsazure"></a>Deploy the application to Windows Azure</h2>

1. In your browser, open the [Windows Azure Management Portal][NewPortal].
2. In the **Web Sites** tab, click the name of the site you created earlier.<br/>
![todolistapp in Management Portal Web Sites tab][nodb-image02]
1. Under **Quick glance** in the **Dashboard** tab, click **Download publishing profile**.<br/>
![Download Publishing Profile link][nodb-image08]<br/>
This step downloads a file that contains all of the settings that you need in order to deploy an application to your web site. You'll import this file into Visual Studio so you don't have to enter this information manually.
1. Save the .publishsettings file in a folder that you can access from Visual Studio.<br/>
![saving the .publishsettings file][nodb-image09]
1. In Visual Studio, right-click the project in **Solution Explorer** and select **Publish** from the context menu.<br/>
![Publish in project context menu][nodb-image10]<br/>
The **Publish Web** wizard opens.
1. In the **Profile** tab of the **Publish Web** wizard, click **Import**.<br/>
![Import button in Publish Web wizard][Image034]
1. Select the .publishsettings file you downloaded earlier, and then click **Open**.<br/>
![Import Publish Settings dialog box][nodb-image11]
1. In the **Connection** tab, click **Validate Connection** to make sure that the settings are correct. When the connection has been validated, a green check mark is shown next to the **Validate Connection** button.<br/>
![Connection tab of Publish Web wizard][nodb-image12]<br/>
1. Click **Next**.<br/>
1. In the **Settings** tab, click **Next**.<br/>
You can accept all of the default settings on this page.  You are deploying a Release build configuration and you don't need to delete files at the destination server. The **DefaultConnection** entry under **Databases** is for the ASP.NET membership (log on) functionality built into the default MVC 4 project template. You aren't using that membership functionality for this tutorial, so you don't need to enter any settings for **DefaultConnection**.<br/>  
![Settings tab of the Publish Web wizard][nodb-image13]
1. In the **Preview** tab, click **Start Preview**.<br/>
The tab displays a list of the files that will be copied to the server. Displaying the preview isn't required to publish the application but is a useful function to be aware of. In this case, you don't need to do anything with the list of files that is displayed.<br/> 
![StartPreview button in the Preview tab][nodb-image14]<br/>
1. Click **Publish**.<br/>
Visual Studio begins the process of copying the files to the Windows Azure server.<br/>
![Publish button in the Preview tab][nodb-image15]
1. The **Output** window shows what deployment actions were taken and reports successful completion of the deployment.<br/>
![Output window reporting successful deployment][nodb-image16]
1. The default browser automatically opens to the URL of the deployed site.<br/>
The application you created is now running in the cloud.<br/>
![Windows Azure Web Site home page running in Windows Azure][nodb-image17]<br/>

<h2><a name="aspnetwindowsazureinfo"></a>Important information about ASP.NET in Windows Azure Web Sites</h2>

Here are some things to be aware of when you plan and develop an ASP.NET application for Windows Azure Web Sites:

* The application must target ASP.NET 4.0 or earlier (not ASP.NET 4.5).
* The application runs in Integrated mode (not Classic mode).
* The application should not use Windows Authentication. Windows Authentication is usually not used as an authentication mechanism for Internet-based applications.
* In order to use provider-based features such as membership, profile, role manager, and session state, the application must use the ASP.NET Universal Providers (the [System.Web.Providers][UniversalProviders] NuGet package).
* If the applications writes to files, the files should be located in the application's content folder or one of its subfolders.

<h2><a name="nextsteps"></a>Next Steps</h2>

You've seen how to deploy a web application to a Windows Azure Web Site. To learn more about how to configure, manage, and scale Windows Azure Web Sites, see the how-to topics on the [Common Tasks][CommonTasks] page.

Windows Azure provides several options for data storage that can be tightly integrated with your web site. For examples of using Windows Azure services to store data, see the following articles:

* [Deploying an ASP.NET Web Application to a Windows Azure Web Site and SQL Database](/en-us/develop/net/tutorials/web-site-with-sql-database/) -- Create an ASP.NET MVC 4 web site that uses Code First and the Entity Framework to connect to a SQL Database instance.
* [How to Use the Blob Storage Services](/en-us/develop/net/how-to-guides/blob-storage/) -- Use blog storage to store unstructured data.
* [How to Use the Table Storage Service](/en-us/develop/net/how-to-guides/table-services/) -- Use table storage to store large amounts of structured, non-relational data.

To learn how to deploy an application to a Windows Azure Cloud Service, see [The Cloud Service version of this tutorial][NetAppWithSqlAzure] and [Developing Web Applications with Windows Azure][DevelopingWebAppsWithWindowsAzure]. Some reasons for choosing to run an ASP.NET web application in a Windows Azure Cloud Service rather than a Windows Azure Web Site include the following:

* You want administrator permissions on the web server that the application runs on.
* You want to use Remote Desktop Connection to access the web server that the application runs on. 
* Your application is multi-tier and you want to distribute work across multiple virtual servers (web and workers).

You might want to use the ASP.NET membership system in Windows Azure. For information about how to use either Windows Azure Storage or SQL Database for the membership database, see [Real World: ASP.NET Forms-Based Authentication Models for Windows Azure][ASP.NETFormsAuth].

[Set Up the development environment]: #setupdevenv
[Create a web site in Windows Azure]: #setupwindowsazure
[Create an ASP.NET MVC 4 application]: #createmvc4app
[Deploy the application to Windows Azure]: #deploytowindowsazure
[Add a database to the application]: #addadatabase
[Deploy the application update to Windows Azure and SQL Database]: #deploydatabaseupdate
[Important information about ASP.NET in Windows Azure Web Sites]: #aspnetwindowsazureinfo
[Next steps]: #nextsteps
[Windows Azure SDK for Visual Studio 2010]: http://go.microsoft.com/fwlink/?LinkID=254364
[Windows Azure SDK for Visual Studio 2012 RC]:  http://go.microsoft.com/fwlink/?LinkId=254269
[NewPortal]: http://manage.windowsazure.com
[MVC4Install]: http://www.asp.net/mvc/mvc4
[VS2012ExpressForWebInstall]: http://www.microsoft.com/web/gallery/install.aspx?appid=VWD11_BETA&prerelease=true
[windowsazure.com]: http://www.windowsazure.com
[WindowsAzureDataStorageOfferings]: http://social.technet.microsoft.com/wiki/contents/articles/data-storage-offerings-on-the-windows-azure-platform.aspx
[GoodFitForAzure]: http://msdn.microsoft.com/en-us/library/windowsazure/hh694036(v=vs.103).aspx
[NetAppWithSQLAzure]: http://www.windowsazure.com/en-us/develop/net/tutorials/cloud-service-with-sql-database/
[MultiTierApp]: http://www.windowsazure.com/en-us/develop/net/tutorials/multi-tier-application/
[HybridApp]: http://www.windowsazure.com/en-us/develop/net/tutorials/hybrid-solution/
[SQLAzureHowTo]: https://www.windowsazure.com/en-us/develop/net/how-to-guides/sql-azure/
[SQLAzureDataMigration]: http://msdn.microsoft.com/en-us/library/windowsazure/hh694043(v=vs.103).aspx
[ASP.NETFormsAuth]: http://msdn.microsoft.com/en-us/library/windowsazure/hh508993.aspx
[CommonTasks]: http://www.windowsazure.com/en-us/develop/net/common-tasks/
[TSQLReference]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336281.aspx
[SQLAzureGuidelines]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336245.aspx
[MigratingDataCentricApps]: http://msdn.microsoft.com/en-us/library/jj156154.aspx
[SQLAzureDataMigrationBlog]: http://blogs.msdn.com/b/ssdt/archive/2012/04/19/migrating-a-database-to-sql-azure-using-ssdt.aspx
[SQLAzureConnPoolErrors]: http://blogs.msdn.com/b/adonet/archive/2011/11/05/minimizing-connection-pool-errors-in-sql-azure.aspx
[UniversalProviders]: http://nuget.org/packages/System.Web.Providers
[EFCodeFirstMVCTutorial]: http://www.asp.net/mvc/tutorials/getting-started-with-ef-using-mvc/creating-an-entity-framework-data-model-for-an-asp-net-mvc-application
[EFCFMigrations]: http://msdn.microsoft.com/en-us/library/hh770484
[DevelopingWebAppsWithWindowsAzure]: http://msdn.microsoft.com/en-us/library/Hh674484

[0]: ../../Shared/media/antares-iaas-preview-01.png
[1]: ../../Shared/media/antares-iaas-preview-05.png
[2]: ../../Shared/media/antares-iaas-preview-06.png
[Image001]: ../Media/Dev-net-getting-started-001.png
[Image002]: ../Media/Dev-net-getting-started-002.png
[Image003]: ../Media/Dev-net-getting-started-003.png
[Image004]: ../Media/Dev-net-getting-started-004.png
[Image010]: ../../Shared/Media/FreeTrialOnWindowsAzureHomePage.png
[Image011]: ../Media/Dev-net-getting-started-011.png
[Image012]: ../Media/Dev-net-getting-started-012.png
[Image013]: ../Media/Dev-net-getting-started-013.png
[Image014]: ../Media/Dev-net-getting-started-014.png
[Image015]: ../Media/Dev-net-getting-started-015.png
[Image016]: ../Media/Dev-net-getting-started-016.png
[Image017]: ../Media/Dev-net-getting-started-017.png
[Image018]: ../Media/Dev-net-getting-started-018.png
[Image020]: ../Media/Dev-net-getting-started-020.png
[Image021]: ../Media/Dev-net-getting-started-021.png
[Image022]: ../Media/Dev-net-getting-started-022.png
[Image023]: ../Media/Dev-net-getting-started-023.png
[Image024]: ../Media/Dev-net-getting-started-024.png
[Image025]: ../Media/Dev-net-getting-started-025.png
[Image026]: ../Media/Dev-net-getting-started-026.png
[Image030]: ../Media/Dev-net-getting-started-030.png
[Image031]: ../Media/Dev-net-getting-started-031.png
[Image032]: ../Media/Dev-net-getting-started-032.png
[Image033]: ../Media/Dev-net-getting-started-033.png
[Image034]: ../Media/Dev-net-getting-started-034.png
[Image035]: ../Media/Dev-net-getting-started-035.png
[Image036]: ../Media/Dev-net-getting-started-036.png
[Image037]: ../Media/Dev-net-getting-started-037.png
[Image038]: ../Media/Dev-net-getting-started-038.png
[Image039]: ../Media/Dev-net-getting-started-039.png
[Image040]: ../Media/Dev-net-getting-started-040.png
[Image041]: ../Media/Dev-net-getting-started-041.png
[Image042]: ../Media/Dev-net-getting-started-042.png
[Image043]: ../Media/Dev-net-getting-started-043.png
[Image045]: ../Media/Dev-net-getting-started-045.png
[Image046]: ../Media/Dev-net-getting-started-046.png
[Image047]: ../Media/Dev-net-getting-started-047.png
[Image048]: ../Media/Dev-net-getting-started-048.png
[Image049]: ../Media/Dev-net-getting-started-049.png
[Image050]: ../Media/Dev-net-getting-started-050.png
[Image051]: ../Media/Dev-net-getting-started-051.png
[Image051a]: ../Media/Dev-net-getting-started-051a.png
[Image051b]: ../Media/Dev-net-getting-started-051b.png
[Image052]: ../Media/Dev-net-getting-started-052.png
[Image053]: ../Media/Dev-net-getting-started-053.png
[Image054]: ../Media/Dev-net-getting-started-054.png
[Image055]: ../Media/Dev-net-getting-started-055.png
[Image056]: ../Media/Dev-net-getting-started-056.png
[Image057]: ../Media/Dev-net-getting-started-057.png
[Image058]: ../Media/Dev-net-getting-started-058.png
[Image059]: ../Media/Dev-net-getting-started-059.png
[Image060]: ../Media/Dev-net-getting-started-060.png
[Image061]: ../Media/Dev-net-getting-started-061.png
[Image062]: ../Media/Dev-net-getting-started-062.png
[Image063]: ../Media/Dev-net-getting-started-063.png
[nodb-image01]: ../Media/dev-net-getting-started-nodb-01.png
[nodb-image02]: ../Media/dev-net-getting-started-nodb-02.png
[nodb-image03]: ../Media/dev-net-getting-started-nodb-03.png
[nodb-image04]: ../Media/dev-net-getting-started-nodb-04.png
[nodb-image05]: ../Media/dev-net-getting-started-nodb-05.png
[nodb-image06]: ../Media/dev-net-getting-started-nodb-06.png
[nodb-image07]: ../Media/dev-net-getting-started-nodb-07.png
[nodb-image08]: ../Media/dev-net-getting-started-nodb-08.png
[nodb-image09]: ../Media/dev-net-getting-started-nodb-09.png
[nodb-image10]: ../Media/dev-net-getting-started-nodb-10.png
[nodb-image11]: ../Media/dev-net-getting-started-nodb-11.png
[nodb-image12]: ../Media/dev-net-getting-started-nodb-12.png
[nodb-image13]: ../Media/dev-net-getting-started-nodb-13.png
[nodb-image14]: ../Media/dev-net-getting-started-nodb-14.png
[nodb-image15]: ../Media/dev-net-getting-started-nodb-15.png
[nodb-image16]: ../Media/dev-net-getting-started-nodb-16.png
[nodb-image17]: ../Media/dev-net-getting-started-nodb-17.png
