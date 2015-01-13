<properties urlDisplayName="Website from Gallery" pageTitle="Create an Orchard CMS website from the gallery in Azure" metaKeywords="Azure build website, manage website Azure" description="A tutorial that teaches you how to create a new website in Azure. Also learn how to launch and manage your site using the Management Portal." metaCanonical="" services="web-sites" documentationCenter=".net" title="" authors="tfitzmac" solutions="" manager="wpickett" editor=""/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="10/21/2014" ms.author="tomfitz" />

# Create an Orchard CMS website from the gallery in Azure

The gallery makes available a wide range of popular web applications developed by Microsoft, third party companies, and open source software initiatives. Web applications created from the gallery do not require installation of any software other than the browser used to connect to the [Azure Management Portal](http://manage.windowsazure.com). For more information about the web applications in the gallery, see [Windows Web App Gallery](http://www.microsoft.com/web/gallery/categories.aspx).

In this tutorial, you'll learn:

- How to create a new site from the gallery

- How to launch and manage your site from the Management Portal
 
You'll build an Orchard CMS site that uses a default template. [Orchard](http://www.orchardproject.net/) is a free, open-source, .NET-based CMS application that allows you to create customized, content-driven websites. Orchard CMS includes an extensibility framework through which you can [download additional modules and themes](http://gallery.orchardproject.net/) to customize your site. The following illustration shows the Orchard CMS site that you will create.

![Orchard blog][13]

[WACOM.INCLUDE [create-account-and-websites-note](../includes/create-account-and-websites-note.md)]

<h2>Create an Orchard website from the gallery</h2>

1. Login to the [Azure Management Portal](http://manage.windowsazure.com).

2. Click the **New** icon on the bottom left of the portal.
	
	![Create New][1]

3. Click the **Website** icon, and then click **From Gallery**.
	
	![Create From Gallery][2]

4. Locate and click the **Orchard CMS** icon in the list, and then click the arrow to continue.
	
	![Orchard from list][3]

5. On the **Configure Your App** page, enter or select values for all fields:
	
- Enter a URL name of your choice.	
- Select the region closest to your users. (This will ensure best performance.)

	![configure your app][4]

6. Click the checkmark in the lower right corner of the box to start the deployment of your new Orchard CMS website.

Azure will initiate build and deploy operations. While the website is being built and deployed, the status of these operations is displayed at the bottom of the Websites Management Portal. After all operations are performed, a message will indicate that your website has been created.

<h2>Launch and manage your Orchard site</h2>

1. Click the name of your new site on the **Websites** page, and then click **Browse** at the bottom of the portal to open your website's welcome page.

	![launch dashboard][5]

	![browse button][12]

2. Enter the configuration information required by Orchard, and then click **Finish Setup** to complete the configuration and open the website's home page.

	![login to Orchard][7]

	You'll have a new Orchard site that looks similar to the screenshot below.  

	![your Orchard site][13]

3. Follow the details in the [Orchard Documentation](http://docs.orchardproject.net/) to learn more about Orchard and configure your new site.

<h2>Next step</h2>
* [Develop and deploy a web site with Microsoft WebMatrix](/en-us/develop/net/tutorials/website-with-webmatrix/) -- Learn how to edit an Azure website in WebMatrix. 
* [Deploy a Secure ASP.NET MVC app with Membership, OAuth, and SQL Database to an Azure Web Site](/en-us/develop/net/tutorials/web-site-with-sql-database/)-- Learn how to create a new website from Visual Studio.

[1]: ./media/web-sites-dotnet-orchard-cms-gallery/orchardgallery-01.png
[2]: ./media/web-sites-dotnet-orchard-cms-gallery/orchardgallery-02.png
[3]: ./media/web-sites-dotnet-orchard-cms-gallery/orchardgallery-03.png
[4]: ./media/web-sites-dotnet-orchard-cms-gallery/orchardgallery-04.png
[5]: ./media/web-sites-dotnet-orchard-cms-gallery/orchardgallery-05.png
[7]: ./media/web-sites-dotnet-orchard-cms-gallery/orchardgallery-07.png
[12]: ./media/web-sites-dotnet-orchard-cms-gallery/orchardgallery-12.png
[13]: ./media/web-sites-dotnet-orchard-cms-gallery/orchardgallery-08.png


