<properties linkid="manage-scenarios-how-to-manage-websites" urlDisplayName="How to manage" pageTitle="How to manage web sites - Windows Azure service management" metaKeywords="Azure portal web site management" metaDescription="A reference for the Portal web site management pages in Windows Azure. Details are provided for each web site management page." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />




#<a name="howtomanage"></a>How to Manage Web Sites

<div chunk="../../Shared/Chunks/disclaimer.md" />

You manage your web sites with a set of Management pages. Each Web Site management page is described below.

## QuickStart ##
The **QuickStart** management page includes the following sections:

- **Get the tools** – Provides links to [Install WebMatrix][mswebmatrix] and the [Windows Azure SDK][azuresdk].
- **Publish your app** – Provides links to download the web site’s publishing profile and reset deployment credentials for the web site.
- **Integrate from source control** – Includes links for managing deployment from source control tools or web sites like TFS, CodePlex, GitHub, Dropbox, Bitbucket, or Local Git.

## Dashboard ##
The **Dashboard** management page includes the following:

- A chart which summarizes web site usage as measurements of certain metrics.
 - **CPU Time** – a measure of the web site’s CPU usage.
 - **Data In** – a measure of data received by the web site from clients.
 - **Data Out** – a measure of data sent by the web site to clients.
 - **Http Server Errors** – number of Http “5xx Server Error” messages sent.
 - **Requests** – a count of all client requests to the web site.
 <br />**Note:**
You can add additional performance metrics on the the **Monitor** management page by choosing **Add Metrics** on the bottom of that page. For more information, see [How to Monitor Web Sites](/en-us/manage/services/web-sites/how-to-monitor-websites/).
- **Web Endpoint Status** - A list of web endpoints that have been configured for monitoring. If no endpoints have been configured, click **Configure Web Endpoint Monitoring** and go to the **Monitoring** section of the **Configure** management page. Endpoints can be added only in Reserved mode. For more information, see [How to Monitor Web Sites](/en-us/manage/services/web-sites/how-to-monitor-websites/).
- A **Usage Overview** section that shows statistics for the web site's CPU, file system, and memory usage.
- A list of all **linked resources** associated with this web site. If no resources are associated, there is a hyperlink to the **Linked Resources** management page.
- A **Quick Glance** section which includes the following summary information and links:
 - **View Connection Strings** - View your web site's database connection strings.
 - **Download the Publish Profile** – Link to the publish profile, a file which contains credentials and URLs required to publish to the web site using any enabled publishing methods.
 - **Reset Your Deployment Credentials** – Displays a dialog box where you provide unique credentials for use when publishing with GIT or FTP. If you wish to use GIT or FTP deployment then you must reset deployment credentials because authentication to an FTP host or GIT repository with Live ID credentials is not supported. Once you reset deployment credentials you can use these credentials for GIT or FTP publishing to any web site in your subscription.
 - **Reset Your Publish Profile Credentials** - Resets the publish profile for your web site. Previously downloaded publish profiles will become invalid.
 - **Set up Deployment from Source Control** – Displays a dialog box where you can set up continuous publishing from Team Foundation Service, CodePlex, GitHub, Dropbox, Bitbucket, or Local Git.
 - **Disconnect from Dropbox** - If you have set up a connection to Dropbox for deployment purposes, this link allows you to disconnect it.
 - **Delete Git repository** - If you have set up a Git repository, this link allows you to delete it.
 - **Status** – Indicates whether the web site is running or not.
 - **Site URL** – Specifies the publicly accessibly address of the web site on the internet.
 - **Compute Mode** – Specifies whether the web site is running in Free, Shared, or Reserved mode. For more information about web site modes see [How to Scale a Web Site](../how-to-scale-websites/).
 - **FTP Hostname** – Specifies the URL to use when publishing to the web site over FTP.
 - **FTPS Hostname** – Specifies the URL to use when publishing to the web site over FTPS.
 - **Deployment User / FTP User** – Indicates the account used when deploying the web site to Windows Azure over FTP or GIT.
 - **FTP Diagnostic Logs** – Specifies the FTP location of the web site’s diagnostic logs if diagnostic logging is enabled on the **Configure** management page.
 - **FTPS Diagnostic Logs** – Specifies the FTPS location of the web site’s diagnostic logs if diagnostic logging is enabled on the **Configure** management page.
 - **Location** – Specifies the physical region of the datacenter that hosts the web site.
 - **Subscription Name** – Specifies the subscription name that the web site is associated with.
 - **Subscription ID** – Specifies the unique subscription ID of the subscription that the web site is associated with.


##Deployments##
 The **Deployments** management page provides a summary of all deployments made to the web site using your publishing method of choice. If no deployments have been made and GIT publishing has been configured for the web site, the **Deployments** management page provides information describing how to use GIT to deploy your web application to the web site.

##Monitor##
The **Monitor** management page provides a chart that displays usage information for the web site. By default this chart displays the same metrics as the chart on the **Dashboard** page as described above in the Dashboard section. The chart can also be configured to display the metrics Http Successes, Http Redirects, Http 401 errors, Http 403 errors, Http 404 errors and Http 406 errors. For more information about these metrics see [How to Monitor Web Sites](../how-to-monitor-websites/).

##Configure##
The **Configure** management page is used to set application specific settings including:

- **General** – Set the version of .NET framework or PHP required by your web application. For sites in Reserved mode, there is an option to choose a 64-bit platform.
- **Domain Names** - View or add additional custom domain names for a web site that is in Shared or Reserved mode.
- **Deployments** - Use these settings to configure deployments.
- **Application Diagnostics** - Set options for gathering diagnostic information for a web application that supports logging. You can choose to log to the file system or to a Windows Azure Storage account, and choose a logging level to specify the amount of information gathered.
- **Site Diagnostics** – Set logging options for gathering diagnostic information for your web site. 
- **Monitoring** - For web sites in Reserved mode, test the availability of HTTP or HTTPS endpoints from geo-distributed locations.
- **App Settings** – Specify name/value pairs that will be loaded by your web application on start up. For .NET sites, these settings will be injected into the web site’s .NET configuration AppSettings at runtime, overriding existing settings. For PHP and Node web sites, these settings will be available as environment variables at runtime.
- **Connection Strings** – View connection strings to linked resources. For .NET sites, these connection strings will be injected into the web site’s .NET configuration connectionStrings settings at runtime, overriding any existing entries where the key equals the linked database name. For PHP and Node web sites, these settings will be available as environment variables at runtime.
- **Default Documents** – Add your web site’s default document to this list if it is not already in the list. If your web site contains more than one of the files in the list then make sure your web site’s default document appears at the top of the list by changing the order of the files in the list.
- **Handler Mappings** - Add custom script processors that handle requests for specific file types (for example, *.php).


For more information about how to configure a Web Site see [How to Configure Web Sites](../how-to-configure-websites/).


##Scale##
The **Scale** management page is used to specify the web site mode (either **Free**, **Shared** or **Reserved**), the size of the web site if it is configured as **Reserved** (**Small**, **Medium** or **Large**) and the value for **Reserved Instance Count** (from 1 to 3). A web site that is configured as **Reserved** will provide more consistent performance than a web site that is configured as **Free** or **Shared**. A web site that is configured with a larger **Reserved Instance Size** will perform better under load. Increasing the value for **Reserved Instance Count** will provide fault tolerance and improved performance through scale out. For more information about configuring scale options for a web site see [How to Scale a Web Site](../how-to-scale-websites/).

##Linked Resources##
The **Linked Resources** management page provides a summary of all Windows Azure resources that your web site is using, including SQL databases, MySQL databases, and Azure storage accounts. 

##Management Page Icons##
Icons are displayed at the bottom of each of the web site's Management pages, several of these icons appear on multiple pages and a couple of Management icons are only displayed on specific pages.  The following icons are displayed at the bottom of the **Dashboard** management page:

- **Browse** - Opens the default page for the web site.
- **Stop** - Stops the web site.
- **Restart** - Restarts the web site.
- **Manage Domains** - Maps a domain to this web site. Not available for sites in **Free** scaling mode.
- **Delete** - Deletes the web site.
- **WebMatrix** - Opens supported web sites in WebMatrix, allowing you to make changes to the web site and publish those changes back to the web site on Windows Azure.

The following icons are not displayed at the bottom of the **Dashboard** management page but are on the bottom of other management pages to accomplish particular tasks:

- **Add Metrics** - At the bottom of the **Monitor** management page, allows you to add metrics to the chart displayed on the Monitor management page.
- **Link** - At the bottom of the **Linked Resources** management page, allows you to link the web site to other Windows Azure resources, for example if your web site needs access to a relational database, you can link the web site to a SQL Database resource by clicking the Link icon.



[vs2010]:http://go.microsoft.com/fwlink/?LinkId=225683
[msexpressionstudio]:http://go.microsoft.com/fwlink/?LinkID=205116
[mswebmatrix]:http://go.microsoft.com/fwlink/?LinkID=226244
[getgit]:http://go.microsoft.com/fwlink/?LinkId=252533
[azuresdk]:http://go.microsoft.com/fwlink/?LinkId=246928
[gitref]:http://go.microsoft.com/fwlink/?LinkId=246651
[howtoconfiganddownloadlogs]:http://go.microsoft.com/fwlink/?LinkId=252031
[sqldbs]:http://go.microsoft.com/fwlink/?LinkId=246930
[fzilla]:http://go.microsoft.com/fwlink/?LinkId=247914
[configvmsizes]:http://go.microsoft.com/fwlink/?LinkID=236449
[webmatrix]:http://go.microsoft.com/fwlink/?LinkId=226244