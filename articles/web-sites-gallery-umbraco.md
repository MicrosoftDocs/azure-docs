<properties title="Create an Umbraco website from the gallery in Microsoft Azure" pageTitle="Create an Umbraco website from the gallery in Microsoft Azure" description="required" metaKeywords="Azure, gallery, Umbraco, web site, website" services="web-sites" solutions="web" documentationCenter="" authors="tomfitz" manager="wpickett" editor="mollybos" videoId="" scriptId="" />

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="ibiza" ms.devlang="na" ms.topic="article" ms.date="10/21/2014" ms.author="tomfitz" />

#Create an Umbraco website from the gallery in Microsoft Azure#

Umbraco CMS is a fully-featured open source content management system that can be used to create a variety of applications from small to complex. The Azure Websites Application gallery provides a wide range of popular web applications developed by Microsoft, third party companies, and open source software initiatives. The gallery allows you to create an Umbraco CMS site in just a few minutes by either applying the starter kits or by integrating your own design. 

This article showcases the new Azure Preview Portal, which greatly simplifies resource management. The new Azure portal is designed to speed your software delivery process by placing cross-platform tools, technologies, and services from Microsoft and its partners in a single workspace. Instead of using standalone resources like Azure Websites, Visual Studio Projects, or databases, you can create, manage, and analyze your entire application as a single resource group. 

In this tutorial, you'll learn:

- How to create a new site through the gallery using the new Azure Preview Portal
- How to build a blog website by using Umbraco CMS 

##Create a website from the Gallery in the Azure portal

1. Login to the [Microsoft Azure Management portal](https://portal.azure.com/).

2. Choose the **Azure Gallery** icon.
	
	![Choose Web Gallery][01Startboard]
	
3. In the **Gallery** , select the **Web** tab, and then select **Umbraco CMS**.
	
	![Select Umbraco in the Web Gallery][02WebGallery]
	
4. To create a new Umbraco CMS website, click **Create**.
	
	![Click Create][03UmbracoCMS]
	
5. The next step is to configure all the resources associated with Umbraco CMS. In this case, the resources are a website and a SQL Server database. First, select **Website** to configure the website settings such as the site **URL**, **Web Hosting Plan**, **Web App Settings**, and **Location**. 
	
	![Configure resources][04AppSettings]
	
6. Now configure the database. Select **Database**, and then choose **Create a new database**. This example creates a SQL Server for the database on Azure.
	
	![Create a SQL Server on Azure][05NewServer]
	
7. Now that the website and the database are configured, you can start deploying the application by clicking **Create** on the bottom of the first **Umbraco CMS** blade seen in the previous image.
	
	![Click Create][06UmbracoCMSGroup]
	
After the deployment is completed, the start board in the portal shows that your Resource Group for Umbraco CMS, in this case **UmbracoCMSgroup**, has been created. In the **Summary** section, click the website name (in this case **umbracocmsgroup**) to see the properties of your website. Also in the **Summary** section, you can select the database resource to see the properties of the associated database.
	
![][07UmbracoCMSGroupBlade]

## Launch and configure your Umbraco CMS website ##

1. On the details blade for your website, click **Browse** to browse your site (in this case,  umbracocmsgroup.azurewebsites.net.)
	
	![Browse to your site][08UmbracoCMSGroupRunning]
	
2. When you browse the website , Umbraco CMS initiates its installer wizard. Enter the information requested, and then click **Customize**.
	
	![Install Umbraco wizard][09InstallUmbraco7]
	
3. Enter your connection and authentication details for the database that Umbraco will use. Select **Microsoft SQL Azure** for the database type.  You can obtain the connection string for your database from the **Site Settings** section of your website.
	
	![Configure your database][10ConfigureYourDatabase] 
	
4. If you are new to Umbraco CMS, you can select a starter website kit. Otherwise, click **No thanks, I do not want to install a starter website**.
	
	![Install a starter website][11InstallAStarterWebsite]
	
5. The Umbraco installer will complete the setup for your application. After your application has been configured, you will be redirected to the Umbraco CMS administrative dashboard.
	
	![Umbraco CMS dashboard][14FriendlyCMS]
	
6. You will now create a sample text page that you will publish. Select **Content**, select **Overflow**, and then select **TextPage**.
	
	![Create a text page][15CreateItemUnderOverflow]
	
7. Enter a title and some content for your text page, as shown below. When you finish, click **Save and publish**.
	
	![Enter a title and some content][16EnterAName]
	
8. Wait while your page is published. When publishing completes, you will receive a small alert on the bottom right of your screen. You can now browse the new content on your website. 
	
	![Published web site page][17MyPage]
	

That’s it! You've successfully created a blog website using Umbraco CMS, in just a few minutes. 

##Additional Resources

[Umbraco Documentation](http://our.umbraco.org/documentation)

[Umbraco Video Tutorials](https://umbraco.com/help-and-support/video-tutorials.aspx)

[Microsoft Azure Preview Portal Overview](http://azure.microsoft.com/en-us/overview/preview-portal/)

[Microsoft Azure Preview Portal Documentation](http://azure.microsoft.com/en-us/documentation/preview-portal/)

[Azure Preview Portal (Channel 9)](http://channel9.msdn.com/Blogs/Windows-Azure/Azure-Preview-portal) 

[Microsoft Azure Web Sites documentation](http://azure.microsoft.com/en-us/documentation/services/web-sites/)


<!-- IMAGES -->
[01Startboard]: ./media/web-sites-gallery-umbraco/01Startboard.PNG
[02WebGallery]: ./media/web-sites-gallery-umbraco/02WebGallery.PNG
[03UmbracoCMS]: ./media/web-sites-gallery-umbraco/03UmbracoCMS.PNG
[04AppSettings]: ./media/web-sites-gallery-umbraco/04AppSettings.PNG
[05NewServer]: ./media/web-sites-gallery-umbraco/05NewServer.PNG
[06UmbracoCMSGroup]: ./media/web-sites-gallery-umbraco/06UmbracoCMSGroup.PNG
[07UmbracoCMSGroupBlade]: ./media/web-sites-gallery-umbraco/07UmbracoCMSGroupBlade.PNG
[08UmbracoCMSGroupRunning]: ./media/web-sites-gallery-umbraco/08UmbracoCMSGroupRunning.PNG
[09InstallUmbraco7]: ./media/web-sites-gallery-umbraco/09InstallUmbraco7.png
[10ConfigureYourDatabase]: ./media/web-sites-gallery-umbraco/10ConfigureYourDatabase.png
[11InstallAStarterWebsite]: ./media/web-sites-gallery-umbraco/11InstallAStarterWebsite.png
[12ConfigureYourDatabase]: ./media/web-sites-gallery-umbraco/12ConfigureYourDatabase.png
[14FriendlyCMS]: ./media/web-sites-gallery-umbraco/14FriendlyCMS.PNG
[15CreateItemUnderOverflow]: ./media/web-sites-gallery-umbraco/15CreateItemUnderOverflow.PNG
[16EnterAName]: ./media/web-sites-gallery-umbraco/16EnterAName.PNG
[17MyPage]: ./media/web-sites-gallery-umbraco/17MyPage.PNG
