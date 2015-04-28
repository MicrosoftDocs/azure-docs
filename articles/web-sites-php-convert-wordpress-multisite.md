<properties 
	pageTitle="Convert WordPress to Multisite in Azure App Service" 
	description="Learn how to take an existing WordPress web app created through the gallery in Azure and convert it to WordPress Multisite" 
	services="app-service\web" 
	documentationCenter="php" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="PHP" 
	ms.topic="article" 
	ms.date="03/24/2015" 
	ms.author="tomfitz"/>



# Convert WordPress to Multisite in Azure App Service

## Overview

*By [Ben Lobaugh][ben-lobaugh], [Microsoft Open Technologies Inc.][ms-open-tech]*

In this tutorial you will learn how to take an existing WordPress web app created through the gallery in Azure and convert it into a WordPress Multisite install. Additionally, you will learn how to assign a custom domain to each of the subsites within your install.

It is assumed that you have an existing installation of WordPress. If you do not, please follow the guidance provided in [Create a WordPress web site from the gallery in Azure][website-from-gallery].

Converting an existing WordPress single site install to Multisite is generally fairly simple, and many of the initial steps here come straight from the [Create A Network][wordpress-codex-create-a-network] page on the [WordPress Codex](http://codex.wordpress.org).

Lets get started.

## Allow Multisite

You first need to enable Multisite through the `wp-config.php` file with the **WP\_ALLOW\_MULTISITE** constant. There are two methods to edit your web app files: the first is through FTP, and the second through Git. If you are unfamiliar with how to setup either of these methods, please refer to the following tutorials:

* [PHP web site with MySQL and FTP][website-w-mysql-and-ftp-ftp-setup]

* [PHP web site with MySQL and Git][website-w-mysql-and-git-git-setup]

Open the `wp-config.php` file with the editor of your choosing and add the following above the `/* That's all, stop editing! Happy blogging. */` line.

	/* Multisite */

	define( 'WP_ALLOW_MULTISITE', true );

Be sure to save the file and upload it back to the server!

## Network Setup

Log in to the *wp-admin* area of your web app and you should see a new item under the **Tools** menu called **Network Setup**. Click **Network Setup** and fill in the details of your network.

![Network Setup Screen][wordpress-network-setup]

This tutorial uses the *Sub-directories* site schema because it should always work, and we will be setting up custom domains for each subsite later in the tutorial. However, it should be possible to setup a subdomain install if you map a domain through the [Azure Portal](http://go.microsoft.com/fwlink/?LinkId=529715) and setup wildcard DNS properly.

For more information on sub-domain vs sub-directory setups see the [Types of multisite network][wordpress-codex-types-of-networks] article on the WordPress Codex.

## Enable the Network

The network is now configured in the database, but there is one remaining step to enable the network functionality. Finalize the `wp-config.php` settings and ensure `web.config` properly routes each site.


After clicking the **Install** button on the *Network Setup* page, WordPress will attempt to update the `wp-config.php` and `web.config` files. However, you should always check the files to ensure the updates were successful. If not, this screen will present you with the necessary updates. Edit and save the files.


After making these updates you will need to log out and log back in to the wp-admin dashboard.

There should now be an additional menu on the admin bar labeled **My Sites**. This menu allows you to control your new network through the **Network Admin** dashboard.

# Adding custom domains

The [WordPress MU Domain Mapping][wordpress-plugin-wordpress-mu-domain-mapping] plugin makes it a breeze to add custom domains to any site in your network. In order for the plugin to operate properly, you need to do some additional setup on the Portal, and also at your domain registrar.

## Enable domain mapping to the web app

The **Free** [App Service](http://go.microsoft.com/fwlink/?LinkId=529714) plan mode does not support adding custom domains to Web Apps. You will need to switch to **Shared** or **Standard** mode. To do this:

* Log in to the Azure Portal and locate your web app. 
* Click on the **Scale** tab in the main content area
* Under **General**, select either *SHARED* or *STANDARD*
* Click **Save**

You may receive a message asking you to verify the change and acknowledge your web app may now incur cost, depending upon usage and the other configuration you set.

It takes a few seconds to process the new settings, so now is a good time to start setting up your domain.

## Verify your domain

Before Azure Web Apps will allow you to map a domain to the site, you first need to verify that you have the authorization to map the domain. To do so, you must add a new CNAME record to your DNS entry.

* Log in to your domain's DNS manager
* Create a new CNAME *awverify*
* Point *awverify* to *awverify.YOUR_DOMAIN.azurewebsites.net*

It may take some time for the DNS changes to go into full effect, so if the following steps do not work immediately, go make a cup of coffee, then come back and try again.

## Add the domain to the web app

Return to your web app through the Azure Portal, click **Settings**, and then click **Custom domains and SSL**.

When the *SSL settings* are displayed, you will see the fields where you will input all the domains which you wish to assign to your web app. If a domain is not listed here, it will not be available for mapping inside WordPress, regardless of how the domain DNS is setup.

![Manage custom domains dialog][wordpress-manage-domains]

After typing your domain into the text box, Azure will verify the CNAME record you created previously. If the DNS has not fully propigated, a red indicator will show. If it was successful, you will see a green checkmark. 

Take note of the IP Address listed at the bottom of the dialog. You will need this to setup the A record for your domain.

## Setup the domain A record

If the other steps were successful, you may now assign the domain to your Azure web app through a DNS A record. 

It is important to note here that Azure web apps accept both CNAME and A records, however you *must* use an A record to enable proper domain mapping. A CNAME cannot be forwarded to another CNAME, which is what Azure created for you with YOUR_DOMAIN.azurewebsites.net.

Using the IP address from the previous step, return to your DNS manager and setup the A record to point to that IP.


## Install and setup the plugin

WordPress Multisite currently does not have a built in method to map custom domains. However, there is a plugin called [WordPress MU Domain Mapping][wordpress-plugin-wordpress-mu-domain-mapping] that adds the functionality for you. Log in to the Network Admin portion of your site and install the **WordPress MU Domain Mapping** plugin.

After installing and activating the plugin, visit **Settings** > **Domain Mapping** to configure the plugin. In the first textbox, *Server IP Address*, input the IP Address you used to setup the A record for the domain. Set any *Domain Options* you desire (the defaults are often fine) and click **Save**.

## Map the domain

Visit the **Dashboard** for the site you wish to map the domain to. Click on **Tools** > **Domain Mapping** and type the new domain into the textbox and click **Add**.

By default, the new domain will be rewritten to the autogenerated site domain. If you want to have all traffic sent to the new domain, check the *Primary domain for this blog* box before saving. You can add an unlimited number of domains to a site, but  only one can be primary.

## Do it again

Azure Web Apps allow you to add an unlimited number of domains to a web app. To add another domain you will need to execute the **Verify your domain** and **Setup the domain A record** sections for each domain.	

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)

[ben-lobaugh]: http://ben.lobaugh.net
[ms-open-tech]: http://msopentech.com
[website-from-gallery]: https://www.windowsazure.com/develop/php/tutorials/website-from-gallery/
[wordpress-codex-create-a-network]: http://codex.wordpress.org/Create_A_Network
[website-w-mysql-and-ftp-ftp-setup]: https://www.windowsazure.com/develop/php/tutorials/website-w-mysql-and-ftp/#header-0
[website-w-mysql-and-git-git-setup]: https://www.windowsazure.com/develop/php/tutorials/website-w-mysql-and-git/#header-1
[wordpress-network-setup]: ./media/web-sites-php-convert-wordpress-multisite/wordpress-network-setup.png
[wordpress-codex-types-of-networks]: http://codex.wordpress.org/Before_You_Create_A_Network#Types_of_multisite_network
[wordpress-plugin-wordpress-mu-domain-mapping]: http://wordpress.org/extend/plugins/wordpress-mu-domain-mapping/

[wordpress-manage-domains]: ./media/web-sites-php-convert-wordpress-multisite/wordpress-manage-domains.png

