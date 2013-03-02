<properties linkid="develop-php-tutorials-convert-wordpress-to-multisite" urlDisplayName="Convert a WordPress Site to a Multisite" pageTitle="Convert a WordPress Site to a Multisite" metaKeywords="WordPress, Multisite" metaDescription="Learn how to take an existing WordPress web site created through the Windows Azure Gallery and convert it to WordPress Multisite" metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu.md" />

# Convert a WordPress Site to a Multisite

*By [Ben Lobaugh][ben-lobaugh], [Microsoft Open Technologies Inc.][ms-open-tech]*

In this tutorial you will learn how to take an existing WordPress web site created through the Windows Azure Gallery and convert it into a WordPress Multisite install. Additionally you will learn how to assign a custom domain to each of the subsites within your install.It is assumed that you have an existing installation of WordPress. If you do not please follow the guidance provided in [Create a WordPress web site from the gallery in Windows Azure][website-from-gallery].
Converting an existing WordPress single site install to Multisite is generally fairly simple, and many of the initial steps here come straight from the [Create A Network][wordpress-codex-create-a-network] page on the [WordPress Codex](http://codex.wordpress.org).
Lets get started.
## Allow Multisite
You first need to enable Multisite through the `wp-config.php` file with the **WP_ALLOW_MULTISITE** constant. There are two methods to edit your web site files, the first is through FTP and the second through Git. If you are unfamiliar with how to setup either of these methods please refer to the following tutorials:
* [PHP web site with MySQL and FTP][website-w-mysql-and-ftp-ftp-setup]
* [PHP web site with MySQL and Git][website-w-mysql-and-git-git-setup]
Open the `wp-config.php` file with the editor of your choosing and add the following above the `/* That's all, stop editing! Happy blogging. */` line.
	/* Multisite */
	define( 'WP_ALLOW_MULTISITE', true );

Be sure to save the file and upload it back to the server!## Network Setup
Log in to the *wp-admin* area of your website and you should see a new item under the **Tools** menu called **Network Setup**. Click **Network Setup** and fill in the details of your network.
![Network Setup Screen][wordpress-network-setup]
This tutorial uses the *Sub-directories* site schema because it should always work, and we will be setting up custom domains for each subsite later in the tutorial. It should be possible to setup a subdomain install however, if you map a domain through the Portal and setup wildcard DNS properly.
For more information on sub-domain vs sub-directory setups see the [Types of multisite network][wordpress-codex-types-of-networks] article on the WordPress Codex.
## Enable the Network
The network is now configured in the database, there is one remaining step to enable the network functionality. Finalize the `wp-config.php` settings and ensure `web.config` properly routes each site.
After clicking the **Install** button on the *Network Setup* page WordPress will attempt to update the `wp-config.php` and `web.config` files, however you should always check the files to ensure the updates were successful. If not this screen will present you with the necessary updates. Edit and save the files.

After making these updates you will need to logout and re-login to the wp-admin dashboard.
There should now be an additional menu on the admin bar labeled **My Sites**. This menu allows you to control your new network through the **Network Admin** dashboard.
# Adding custom domains
The [WordPress MU Domain Mapping][wordpress-plugin-wordpress-mu-domain-mapping] plugin makes is a breeze to add custom domains to any site in your network. In order for the plugin to operate properly you need to do some additional setup on the Portal, then also at your domain registrar.
## Enable domain mapping to the web site
The default free website mode does not support adding custom domains to Windows Azure web sites. You will need to switch to Shared or Reserved mode. You can accomplish this by:

* Login to the Windows Azure Portal and locate your web site. 
* Click on the **SCALE** tab in the main content area
* Under **general** select either *SHARED* or *RESERVED*
* Click **SAVE**

![Enabling domain mapping in the Windows Azure Web Sites Portal][wordpress-portal-shared]

You may receive a message asking you to verify the change and acknowledge your web site may now incurr cost, depending upon usage and the other configuration you set.

It takes a few seconds to process the new settings so now is a good time to start setting up your domain.

## Verify your domain

Before Windows Azure Web Sites will allow you to map a domain to the site you first need to verify that you have the authorization to map the domain. To do so you must add a new CNAME record to your DNS entry.

* Login to your domain's DNS manager
* Create a new CNAME *awverify*
* Point *awverify* to *awverify.YOUR_DOMAIN.azurewebsites.net*

It may take some time for the DNS changes to go into full effect, so if the following steps do not work immediately go make a cup of coffee, then come back and try again.

## Add the domain to the web site

Return to your web site through the Windows Azure Portal, and this time click the **CONFIGURE** tab. The **MANAGE DOMAINS** button should be available, click it.

The *Manage custom domains* dialog show pop up. This is where you will input all the domains which you wish to assign to your web site. If a domain is not listed here it will not be available for mapping inside WordPress, regardless of how the domain DNS is setup.

![Manage custom domains dialog][wordpress-manage-domains]

After typing your domain into the text box Windows Azure will verify the *awverify* CNAME record you created previously. If the DNS has not fully propigated yet a red indicator will show. If it was successful you will see a green checkmark. 

Take note of the IP Address listed at the bottom of the dialog. You will need this to setup the A record for your domain.

## Setup the domain A record

If the other steps were successful you may now assign the domain to your Windows Azure web site through a DNS A record. 

It is important to note here that Windows Azure web sites accepts both CNAME and A records, however you *must* use an A record to enable proper domain mapping. A CNAME cannot be forwarded to another CNAME, which is what Windows Azure created for you with YOUR_DOMAIN.azurewebsites.net.

Using the IP address from the previous step, return to your DNS manager and setup the A record to point to that IP.


## Install and setup the plugin

WordPress Multisite currently does not have a built in method to map custom domains, however there is a plugin called [WordPress MU Domain Mapping][wordpress-plugin-wordpress-mu-domain-mapping] that adds the functionality for you. Login to the Network Admin portion of your site and install the **WordPress MU Domain Mapping** plugin.

After installing and activating the plugin, visit **Settings** > **Domain Mapping** to configure the plugin. In the first textbox, *Server IP Address*, input the IP Address you used to setup the A record for the domain. Set any *Domain Options* you desire ( Defaults are often fine ) and click save.

## Map the domain

Visit the **Dashboard** for the site you wish to map the domain to. Click on **Tools** > **Domain Mapping** and type the new domain into the textbox and click **Add**.

By default the new domain will be rewritten to the autogenerated site domain. If you want to have all traffic sent to the new domain check the *Primary domain for this blog* box before saving. You can add an unlimited number of domains to a site, however only one can be primary.

## Do it again

Windows Azure Web Sites allows you to add an unlimited number of domains to a web site. To add another domain you will need to execute the **Verify your domain** and **Setup the domain A record** sections for each domain.	[ben-lobaugh]: http://ben.lobaugh.net[ms-open-tech]: http://msopentech.com[website-from-gallery]: https://www.windowsazure.com/en-us/develop/php/tutorials/website-from-gallery/
[wordpress-codex-create-a-network]: http://codex.wordpress.org/Create_A_Network
[website-w-mysql-and-ftp-ftp-setup]: https://www.windowsazure.com/en-us/develop/php/tutorials/website-w-mysql-and-ftp/#header-0
[website-w-mysql-and-git-git-setup]: https://www.windowsazure.com/en-us/develop/php/tutorials/website-w-mysql-and-git/#header-1
[wordpress-network-setup]: ../Media/wordpress-network-setup.png
[wordpress-codex-types-of-networks]: http://codex.wordpress.org/Before_You_Create_A_Network#Types_of_multisite_network
[wordpress-plugin-wordpress-mu-domain-mapping]: http://wordpress.org/extend/plugins/wordpress-mu-domain-mapping/
[wordpress-portal-shared]: ../Media/wordpress-portal-shared.png
[wordpress-manage-domains]: ../Media/wordpress-manage-domains.png
[wordpress-codex]: http://codex.wordpress.org
