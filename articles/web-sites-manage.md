<properties linkid="manage-scenarios-how-to-manage-websites" urlDisplayName="How to manage" pageTitle="How to manage web sites - Microsoft Azure service management" metaKeywords="Azure portal website management" description="A reference for the Portal web site management pages in Microsoft Azure. Details are provided for each web site management page." metaCanonical="" services="web-sites" documentationCenter="" title="How to Manage Web Sites" authors="timamm"  solutions="" writer="timamm" manager="" editor=""  />

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="timamm" />






#<a name="howtomanage"></a>How to Manage Web Sites

You manage your web sites in the Azure portal with a set of pages or "tabs". Each Web Site management page is described below.

## QuickStart ##
The **QuickStart** management page includes the following sections:

- **Get the tools** - Provides links to [Install WebMatrix][mswebmatrix] and the [Microsoft Azure SDK][azuresdk].
- **Publish your app** - Provides links to download the web site's publishing profile, reset deployment credentials for the web site, add a staged publishing (deployment) slot to on a non-staged site, and learn about staged publishing.
- **Integrate source control** - Set up and manage deployment from source control tools or web sites like TFS, CodePlex, GitHub, Dropbox, Bitbucket, or Local Git.

## Dashboard ##
The **Dashboard** management page includes the following:

- A chart which summarizes web site usage as measurements of certain metrics.
 - **CPU Time** - a measure of the web site's CPU usage.
 - **Data In** - a measure of data received by the web site from clients.
 - **Data Out** - a measure of data sent by the web site to clients.
 - **HTTP Server Errors** - the number of HTTP "5xx Server Error" messages sent.
 - **Requests** - a count of all client requests to the web site.
 <br />**Note:**
You can add additional performance metrics on the the **Monitor** management page by choosing **Add Metrics** on the bottom of that page. For more information, see [How to Monitor Web Sites][Monitor].

- **Web Endpoint Status** - A list of web endpoints that have been configured for monitoring. If no endpoints have been configured, click **Configure Web Endpoint Monitoring** and go to the **Monitoring** section of the **Configure** management page. For more information, see [How to Monitor Web Sites][Monitor].

- **Autoscale Status** - In Standard mode, you can automatically scale your resources so you'll only spend as much as you need. To enable autoscaling, choose **Configure Autoscale**, which takes you to the **Scale** page. If your web site is in Free or Shared mode, you will need to change it to Standard mode (you can do this on the **Scale** page) before you can configure autoscaling. **Autoscale Operation Logs** takes you to the **Management Services** portal where you can view the autoscale history of your web site. The default query is for the last 24 hours, but you can modify the query.

- **Usage Overview** - this section shows statistics for the web site's CPU, file system, and memory usage.
- **Linked Resources** - this section that shows a list of resources such as a SQL or MySQL database, or a Microsoft Azure storage account, that are connected to your web site. Click the name of the resource to manage the resource. If you have a MySQL database, clicking its name will take you to the ClearDB management page. There you can see your performance metrics, or go to the ClearDB dashboard, where you can upgrade your MySQL database if required. If no resources are listed , click **Manage Linked Resources** to go to the **Linked Resources** page, where you can add a link to a resource for your web site.
- A **Quick Glance** section which includes the following summary information and links (depending on your settings, some of the options listed below may not appear):
 - **View Applicable Add-ons** - Opens the **Purchase from Store** dialog box where you can choose add-ons for purchase that provide additional functionality for your web site. Some add-ons may not be available in your region or environment.
 - **View connection strings** - View your web site's database connection strings.
 - **Download the publish profile** - Click this link to download your publish profile for your web site. The publish profile contains your credentials (user name and password) and the URLs  for uploading content to your web site with FTP and Git. The profile file is in XML format and can be viewed in a text editor.
 - **Set up deployment credentials** - Click this option to create a user name and password for uploading content to your web site with FTP or Git. After you have created your FTP/Git deployment credentials, you can use them to push content to any web site in your subscription by using FTP or Git.  To view the credentials after you have created them, click **Download the publish profile**. The publish profile that you download is a text file in XML format and can be viewed in a text editor. **Note**: Authentication to an FTP host or Git repository by using Microsoft Account (Live ID) credentials is not supported.
 - **Reset your publish profile credentials** - Resets the publish profile for your web site. Previously downloaded publish profiles will become invalid.
 - **Set up deployment from source control** - Displays a dialog box where you can set up continuous publishing from Team Foundation Service, CodePlex, GitHub, Dropbox, Bitbucket, or Local Git.
 - **Add a new deployment slot** - For sites in Standard mode, use this feature to create a staging slot for the site. The staging slot (staged site) lets you validate the site's content and configuration before swapping it into production. You can also use the staged version of the site to gradually add content updates, and then swap the site into production when the updates have been completed on the staging slot. (You cannot add a slot to a site that is already in staging.)
 - **Edit in Visual Studio Online** - Click this link to edit your web site directly online by using Visual Studio Online from the Microsoft Azure portal. This option will not appear unless you enable it on the **Configure** page.
 - **Disconnect from Dropbox** - If you have set up a connection to Dropbox for deployment purposes, this link allows you to disconnect it.
 - **Delete Git repository** - If you have set up a Git repository, this link allows you to delete it.
 - **Status** - Indicates whether the web site is running.
 - **Management Services** - Click the **Operation Logs** link to view operation logs for your web site from the Microsoft Azure Management Services portal.
 - **Virtual IP Address** - Shows the virtual IP address of the web site if you have configured an IP-based SSL binding for the web site in the **SSL Bindings** section of the **Configure** tab. 
 - **Site URL** - Specifies the publicly accessible address of the web site on the internet.
 - **Compute Mode** - Specifies whether the web site is running in Free, Shared, Basic, or Standard mode. For more information about web scale group modes, see [How to Scale a Web Site][Scale].
 - **FTP Hostname** - Specifies the URL to use when publishing to the web site over FTP.
 - **FTPS Hostname** - Specifies the URL to use when publishing to the web site over FTPS.
 - **Deployment User / FTP User** - Indicates the account used when deploying the web site to Microsoft Azure over FTP or Git.
 - **FTP Diagnostic Logs** - Specifies the FTP location of the web site's diagnostic logs if diagnostic logging is enabled on the **Configure** management page.
 - **FTPS Diagnostic Logs** - Specifies the FTPS location of the web site's diagnostic logs if diagnostic logging is enabled on the **Configure** management page.
 - **Location** - Specifies the region of the datacenter that hosts the web site.
 - **Subscription Name** - Specifies the subscription name that the web site is associated with.
 - **Subscription ID** - Specifies the unique subscription ID (GUID) of the subscription that the web site is associated with.


##Deployments##
 This tab appears only if you have set up deployment from source control. The **Deployments** management page provides a summary of all deployments made to the web site using your publishing method of choice. If Git publishing has been configured for the web site but no deployments have been made, the **Deployments** management page provides information describing how to use GIT to deploy your web application to the web site.

##Monitor##
The **Monitor** management page provides a chart that displays usage information for the web site. By default this chart displays the same metrics as the chart on the **Dashboard** page as described above in the Dashboard section. The chart can also be configured to display the metrics HTTP Successes, HTTP Redirects, HTTP 401 errors, HTTP 403 errors, HTTP 404 errors and HTTP 406 errors. For more information about these metrics, see [How to Monitor Web Sites][Monitor].

##WebJobs##
The WebJobs management page lets you create on demand, scheduled, or continuously running tasks for your web site. For more information, see [How to Use the WebJobs feature in Microsoft Azure Web Sites](http://www.windowsazure.com/en-us/documentation/articles/web-sites-create-web-jobs/).

##Configure##
The **Configure** management page is used to set application specific settings including:

- **General** - Set the version of the .NET framework, PHP, Python, or Java required by your web application. For sites in Standard or Basic mode, there is an option to choose a 64-bit platform. Set **Managed Pipeline Mode**  to **Classic** only if you have legacy web sites that run exclusively on older versions of IIS (**Integrated** is the default.) To enable your web site to use real time request pattern applications such as chat, you can set **Web Sockets** to **On**. To enable editing of your web site directly online, set **Edit in Visual Studio Online** to **On**.
- **Certificates** - Upload an SSL certificate for a custom domain. SSL certificates can be uploaded only in Standard or Basic mode. The certificates you upload are listed here and can be assigned to any web site in your subscription and region. Wildcard certificates (certificates with an asterisk) are supported.
- **Domain Names** - View or add additional custom domain names for a web site. Custom domain names can only be used in Shared, Basic, or Standard mode.
- **SSL Bindings** - SSL bindings to custom domains can only be used in Basic or Standard mode. Choose an SSL mode (**SNI**, **IP**, or **No SSL**) for a particular domain name. If you choose SNI or IP, you can specify a certificate for the domain from the certificates you have uploaded.  
- **Deployments** - This section appears only if you have enabled deployment from source control. Use these settings to configure deployments.
- **Application Diagnostics** - Set options for gathering diagnostic information for a web application that supports logging. You can choose to log to the file system or to a Microsoft Azure Storage account, and choose a logging level to specify the amount of information gathered.
- **Site Diagnostics** - Set logging options for gathering diagnostic information for your web site, or enable Visual Studio 2012 or Visual Studio 2013 to debug your web site remotely for a maximum of 48 hours.
- **Monitoring** - For web sites in Standard mode, test the availability of HTTP or HTTPS endpoints from geo-distributed locations.
- **Developer Analytics** - Analytics monitor the performance of your web application. Choose an analytics add-on from the Microsoft Azure store, or choose a custom analytics provider such as New Relic.
- **App Settings** - Specify name/value pairs that will be loaded by your web application on start up. For .NET sites, these settings will be injected into the web site's .NET configuration AppSettings at runtime, overriding existing settings. For PHP and Node web sites, these settings will be available as environment variables at runtime.
- **Connection Strings** - View connection strings to linked resources. For .NET sites, these connection strings will be injected into the web site's .NET configuration connectionStrings settings at runtime, overriding any existing entries where the key equals the linked database name. For PHP and Node web sites, these settings will be available as environment variables at runtime.
- **Default Documents** - Add your web site's default document to this list if it is not already in the list. If your web site contains more than one of the files in the list then make sure your web site's default document appears at the top of the list by changing the order of the files in the list.
- **Handler Mappings** - Add custom script processors that handle requests for specific file types (for example, *.php).
- **Virtual Applications and Directories**  - Configure virtual applications and directories associated with your web site. You also have the option to mark a virtual directory as an application in site configuration.

For more information about how to configure a Web Site, see [How to Configure Web Sites][Configure].


##Scale##
On the **Scale** management page, you can specify the web scale group mode (**Free**, **Shared**, **Basic**, or **Standard**). **Shared**, **Basic**, and **Standard** modes provide better throughput and performance. **Shared**, **Basic**, and **Standard** modes allow you to increase the **Instance Count**, which is the number of virtual machines used by your web site and your other web sites in the same web scale group.
 
In **Standard** mode, you can also increase the core count and memory capacity of each instance by changing the **Instance Size**.  For greater cost effectiveness, you can choose the **Autoscale** option to have Microsoft Azure allocate resources for your web site dynamically. 

For more information about configuring scale options for a web site, see [How to Scale a Web Site][Scale].

##Linked Resources##
The **Linked Resources** management page provides a list of Microsoft Azure resources that your web site is using, including SQL databases, MySQL databases, and Azure storage accounts. Click the name of the resource to manage it.

##Backups##
The **Backups** management page lets you create automated or manual backups of your web site, restore your web site to a previous state, or create a new web site based on one of your backups. For more information, see [Microsoft Azure Web Sites Backups](http://www.windowsazure.com/en-us/documentation/articles/web-sites-backup/) and [Restore a Microsoft Azure web site](http://www.windowsazure.com/en-us/documentation/articles/web-sites-restore/).

##Management Page Icons##
Icons are displayed at the bottom of each of the web site's Management pages. Several of these icons appear on multiple pages, and a few icons are displayed only on specific pages.  The following icons are displayed at the bottom of the **Dashboard** management page:

- **Browse** - Opens the default page for the web site.
- **Stop** - Stops the web site.
- **Restart** - Restarts the web site.
- **Manage Domains** - Maps a domain to this web site. Not available for sites in **Free** scaling mode.
- **Delete** - Deletes the web site.
- **WebMatrix** - Opens supported web sites in WebMatrix, allowing you to make changes to the web site and publish those changes back to the web site on Microsoft Azure.

The following icons are not displayed at the bottom of the **Dashboard** management page, but are on the bottom of other management pages to accomplish particular tasks:

- **Add Metrics** - At the bottom of the **Monitor** management page, allows you to add metrics to the chart displayed on the Monitor management page.
- **Link** - At the bottom of the **Linked Resources** management page, allows you to create management links to other Microsoft
-  Azure resources. For example, if your web site accesses a SQL database, you can create a management link to the database resource by clicking **Link**.


<!-- LINKS -->
[mswebmatrix]:http://go.microsoft.com/fwlink/?LinkID=226244

[azuresdk]:http://go.microsoft.com/fwlink/?LinkId=246928

[Configure]: http://www.windowsazure.com/en-us/manage/services/web-sites/how-to-configure-websites

[Monitor]: http://www.windowsazure.com/en-us/manage/services/web-sites/how-to-monitor-websites/

[Scale]: http://www.windowsazure.com/en-us/manage/services/web-sites/how-to-scale-websites

