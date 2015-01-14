<properties urlDisplayName="How to manage" pageTitle="How to manage websites - Microsoft Azure service management" metaKeywords="Azure portal website management" description="A reference for the Portal website management pages in Microsoft Azure. Details are provided for each website management page." metaCanonical="" services="web-sites" documentationCenter="" title="" authors="MikeWasson" solutions="" writer="mwasson" manager="wpickett" editor=""/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/18/2014" ms.author="mwasson" />

#<a name="howtomanage"></a>Manage websites through the Azure Management Portal

You manage your websites in the Azure portal with a set of pages or "tabs". Each Website management page is described below.

## QuickStart ##
The **QuickStart** management page includes the following sections:

- **Get the tools** - Provides links to [Install WebMatrix][mswebmatrix] and the [Microsoft Azure SDK][azuresdk].
- **Publish your app** - Provides links to download the website's publishing profile, reset deployment credentials for the website, add a staged publishing (deployment) slot to on a non-staged site, and learn about staged publishing.
- **Integrate source control** - Set up and manage deployment from source control tools or websites like TFS, CodePlex, GitHub, Dropbox, Bitbucket, or Local Git.

## Dashboard ##
The **Dashboard** management page includes the following:

A chart which summarizes website usage as measurements of certain metrics.

 - **CPU Time** - a measure of the website's CPU usage.
 - **Data In** - a measure of data received by the website from clients.
 - **Data Out** - a measure of data sent by the website to clients.
 - **HTTP Server Errors** - the number of HTTP "5xx Server Error" messages sent.
 - **Requests** - a count of all client requests to the website.

**Note:** You can add additional performance metrics on the the **Monitor** management page by choosing **Add Metrics** on the bottom of that page. For more information, see [How to Monitor Web Sites][Monitor].

**Web Endpoint Status** - A list of web endpoints that have been configured for monitoring. If no endpoints have been configured, click **Configure Web Endpoint Monitoring** and go to the **Monitoring** section of the **Configure** management page. For more information, see [How to Monitor Web Sites][Monitor].

**Autoscale Status** - In Standard mode, you can automatically scale your resources so you'll only spend as much as you need. To enable autoscaling, choose **Configure Autoscale**, which takes you to the **Scale** page. If your website is in Free or Shared mode, you will need to change it to Standard mode (you can do this on the **Scale** page) before you can configure autoscaling. **Autoscale Operation Logs** takes you to the **Management Services** portal where you can view the autoscale history of your website. The default query is for the last 24 hours, but you can modify the query.

**Usage Overview** - this section shows statistics for the website's CPU, file system, and memory usage.

**Linked Resources** - this section that shows a list of resources such as a SQL or MySQL database, or a Microsoft Azure storage account, that are connected to your website. Click the name of the resource to manage the resource. If you have a MySQL database, clicking its name will take you to the ClearDB management page. There you can see your performance metrics, or go to the ClearDB dashboard, where you can upgrade your MySQL database if required. If no resources are listed , click **Manage Linked Resources** to go to the **Linked Resources** page, where you can add a link to a resource for your website.

A **Quick Glance** section which includes the following summary information and links (depending on your settings, some of the options listed below may not appear):

 - **View Applicable Add-ons** - Opens the **Purchase from Store** dialog box where you can choose add-ons for purchase that provide additional functionality for your website. Some add-ons may not be available in your region or environment.
 - **View connection strings** - View your website's database connection strings.
 - **Download the publish profile** - Click this link to download your publish profile for your website. The publish profile contains your credentials (user name and password) and the URLs  for uploading content to your website with FTP and Git. The profile file is in XML format and can be viewed in a text editor.
 - **Set up deployment credentials** - Click to create a user name and password for uploading content to your website with FTP or Git. You can use these credentials to push content to any website in your subscription. (See [FTP Credentials].) **Note**: Authentication to an FTP host or Git repository by using Microsoft Account (Live ID) credentials is not supported.
 - **Reset your publish profile credentials** - Resets the publish profile for your website. Previously downloaded publish profiles will become invalid.
 - **Set up deployment from source control** - Displays a dialog box where you can set up continuous publishing from Team Foundation Service, CodePlex, GitHub, Dropbox, Bitbucket, or Local Git.
 - **Add a new deployment slot** - For sites in Standard mode, use this feature to create a staging slot for the site. The staging slot (staged site) lets you validate the site's content and configuration before swapping it into production. You can also use the staged version of the site to gradually add content updates, and then swap the site into production when the updates have been completed on the staging slot. (You cannot add a slot to a site that is already in staging.)
 - **Edit in Visual Studio Online** - Click this link to edit your website directly online by using Visual Studio Online from the Microsoft Azure portal. This option will not appear unless you enable it on the **Configure** page.
 - **Disconnect from Dropbox** - If you have set up a connection to Dropbox for deployment purposes, this link allows you to disconnect it.
 - **Delete Git repository** - If you have set up a Git repository, this link allows you to delete it.
 - **Status** - Indicates whether the website is running.
 - **Management Services** - Click the **Operation Logs** link to view operation logs for your website from the Microsoft Azure Management Services portal.
 - **Virtual IP Address** - Shows the virtual IP address of the website if you have configured an IP-based SSL binding for the website in the **SSL Bindings** section of the **Configure** tab. 
 - **Site URL** - Specifies the publicly accessible address of the website on the internet.
 - **Compute Mode** - Specifies whether the website is running in Free, Shared, Basic, or Standard mode. For more information about web scale group modes, see [How to Scale a Web Site][Scale].
 - **FTP Hostname** - Specifies the URL to use when publishing to the website over FTP (see [FTP Credentials]).
 - **FTPS Hostname** - Specifies the URL to use when publishing to the website over FTPS (see [FTP Credentials]). 
 - **Deployment User / FTP User** - Indicates the account used when deploying the website to Microsoft Azure over FTP or Git (see [FTP Credentials]).
 - **FTP Diagnostic Logs** - Specifies the FTP location of the website's diagnostic logs if diagnostic logging is enabled on the **Configure** management page.
 - **FTPS Diagnostic Logs** - Specifies the FTPS location of the website's diagnostic logs if diagnostic logging is enabled on the **Configure** management page.
 - **Location** - Specifies the region of the datacenter that hosts the website.
 - **Subscription Name** - Specifies the subscription name that the website is associated with.
 - **Subscription ID** - Specifies the unique subscription ID (GUID) of the subscription that the website is associated with.


##Deployments##
 This tab appears only if you have set up deployment from source control. The **Deployments** management page provides a summary of all deployments made to the website using your publishing method of choice. If Git publishing has been configured for the website but no deployments have been made, the **Deployments** management page provides information describing how to use GIT to deploy your web application to the website.

##Monitor##
The **Monitor** management page provides a chart that displays usage information for the website. By default this chart displays the same metrics as the chart on the **Dashboard** page as described above in the Dashboard section. The chart can also be configured to display the metrics HTTP Successes, HTTP Redirects, HTTP 401 errors, HTTP 403 errors, HTTP 404 errors and HTTP 406 errors. For more information about these metrics, see [How to Monitor Web Sites][Monitor].

##WebJobs##
The WebJobs management page lets you create on demand, scheduled, or continuously running tasks for your website. For more information, see [How to Use the WebJobs feature in Microsoft Azure Web Sites](http://www.windowsazure.com/en-us/documentation/articles/web-sites-create-web-jobs/).

##Configure##
The **Configure** management page is used to set application specific settings.

For details, see [How to Configure Web Sites][Configure].


##Scale##
On the **Scale** management page, you can specify the web scale group mode (**Free**, **Shared**, **Basic**, or **Standard**). **Shared**, **Basic**, and **Standard** modes provide better throughput and performance. **Shared**, **Basic**, and **Standard** modes allow you to increase the **Instance Count**, which is the number of virtual machines used by your website and your other websites in the same web scale group.
 
In **Standard** mode, you can also increase the core count and memory capacity of each instance by changing the **Instance Size**.  For greater cost effectiveness, you can choose the **Autoscale** option to have Microsoft Azure allocate resources for your website dynamically. 

For more information about configuring scale options for a website, see [How to Scale a Web Site][Scale].

##Linked Resources##
The **Linked Resources** management page provides a list of Microsoft Azure resources that your website is using, including SQL databases, MySQL databases, and Azure storage accounts. Click the name of the resource to manage it.

##Backups##
The **Backups** management page lets you create automated or manual backups of your website, restore your website to a previous state, or create a new website based on one of your backups. For more information, see [Microsoft Azure Web Sites Backups](http://www.windowsazure.com/en-us/documentation/articles/web-sites-backup/) and [Restore a Microsoft Azure web site](http://www.windowsazure.com/en-us/documentation/articles/web-sites-restore/).

##Management Page Icons##
Icons are displayed at the bottom of each of the website's Management pages. Several of these icons appear on multiple pages, and a few icons are displayed only on specific pages.  The following icons are displayed at the bottom of the **Dashboard** management page:

- **Browse** - Opens the default page for the website.
- **Stop** - Stops the website.
- **Restart** - Restarts the website.
- **Manage Domains** - Maps a domain to this website. Not available for sites in **Free** scaling mode.
- **Delete** - Deletes the website.
- **WebMatrix** - Opens supported websites in WebMatrix, allowing you to make changes to the website and publish those changes back to the website on Microsoft Azure.

The following icons are not displayed at the bottom of the **Dashboard** management page, but are on the bottom of other management pages to accomplish particular tasks:

- **Add Metrics** - At the bottom of the **Monitor** management page, allows you to add metrics to the chart displayed on the Monitor management page.
- **Link** - At the bottom of the **Linked Resources** management page, allows you to create management links to other Microsoft
-  Azure resources. For example, if your website accesses a SQL database, you can create a management link to the database resource by clicking **Link**.


## FTP Credentials

There are two sets of FTP credentials that you can use, *deployment* credentials and *publishing profile* credentials.  Here are the main differences:

**Deployment credentials**

- Associated with a Microsoft account. 
- Can be used to deploy to any web site, in all subscriptions associated with the account. 
- You pick the username/password
- Typically used for git or FTP deployment

	 
**Publishing profile credentials**

- Associated with a single website. 
- You don’t pick the username or password.
- Typically used for Web Deploy, but can also be used for FTP.


You can use either set of credentials. The FTP and FTPS host names are listed on the dashboard, under **Quick glance**.


### Using Deployment Credentials

To set up deployment credentials: 

1.	In the Management portal, go to the **Dashboard** page for your website.
2.	Click **Set up deployment credentials**.
3.	In the dialog, enter a user name and password.

Note: In step 2, if you already have deployment credentials, the portal will say **Reset deployment credentials**. Click this to set a new password or change the user name.

Deployment credentials are associated with a Microsoft account. If you change the username or password, the change applies to all websites associated with the account. If an Azure subscription has multiple administrators, each person has their own credentials. 
The full FTP user name is “website\username”.  This is listed in the portal under **Quick Glance**, as **Deployment / FTP user**.


### Using Publishing Profile Credentials

Each website has its own publishing profile credentials. To view these credentials:

1.	In the Management portal, go to the **Dashboard** page for your website.
2.	Click **Download the publish profile**.

The publish profile file is an XML file. It contains two profiles, one for Web Deploy, and the other for FTP.

<pre>
&lt;publishData&gt;
  &lt;publishProfile
    profileName="contoso - Web Deploy"
    publishMethod="MSDeploy"
    publishUrl="contoso.scm.azurewebsites.net:443"
    msdeploySite="contoso"
    userName="$contoso"
    userPWD="abc1234..."
    destinationAppUrl="http://contoso.azurewebsites.net"
    SQLServerDBConnectionString=""
    mySQLDBConnectionString=""
    hostingProviderForumLink="" 
    controlPanelLink="http://windows.azure.com"&gt;
    &lt;databases/&gt;
  &lt;/publishProfile&gt;
  &lt;publishProfile 
    profileName="contoso - FTP" 
    <mark>publishMethod="FTP"</mark> 
    publishUrl="ftp://waws-prod-bay-003.ftp.azurewebsites.windows.net/site/wwwroot" 
    ftpPassiveMode="True" 
    <mark>userName="contoso\$contoso"</mark> 
    <mark>userPWD=" abc1234..."</mark>  
    destinationAppUrl="http://contoso.azurewebsites.net" 
    SQLServerDBConnectionString="" 
    mySQLDBConnectionString="" 
    hostingProviderForumLink="" 
    controlPanelLink="http://windows.azure.com"&gt;
    &lt;databases/&gt;
  &lt;/publishProfile&gt;
&lt;/publishData&gt;
</pre>

Look for the profile with <code>publishMethod="FTP"</code>.  The user name is listed under <code>userName</code>, and the password is listed under <code>userPWD</code>.

To reset the password, click **Reset your publish profile credentials**. To get the new credentials, download the publish profile again. Publish profile credentials are associated with the website. Each website has its own publish profile.



<!-- LINKS -->
[mswebmatrix]:http://go.microsoft.com/fwlink/?LinkID=226244

[azuresdk]:http://go.microsoft.com/fwlink/?LinkId=246928

[Configure]: http://www.windowsazure.com/en-us/manage/services/web-sites/how-to-configure-websites

[Monitor]: http://www.windowsazure.com/en-us/manage/services/web-sites/how-to-monitor-websites/

[Scale]: http://www.windowsazure.com/en-us/manage/services/web-sites/how-to-scale-websites


<!-- Anchors. -->
[FTP Credentials]: #ftp-credentials

