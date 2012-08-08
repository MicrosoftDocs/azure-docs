<properties umbracoNaviHide="0" pageTitle="How to Manage Websites" metaKeywords="Windows Azure Websites, deployment, configuration changes, deployment update, Windows Azure .NET deployment, .NET deployment" metaDescription="Learn how to configure Websites in Windows Azure to use a SQL or MySQL database, and learn how to configure diagnostics and download logs." linkid="itpro-windows-howto-configure-websites" urlDisplayName="How to Configure Websites" headerExpose="" footerExpose="" disqusComments="1" />


#<a name="howtomanage"></a>How to Manage Websites

<div chunk="../../Shared/Chunks/disclaimer.md" />

You manage your websites with a set of Management pages.

**Windows Azure Portal Website Management Pages** – Each Website management page is described below.

#### QuickStart ####
The **QuickStart** management page includes the following sections:

- **get the tools** – Provides links to [Install WebMatrix][mswebmatrix] and the [Windows Azure SDK][azuresdk].
- **publish from local environment** – Provides links to download the website’s publishing profile and reset deployment credentials for the website.
- **publish from source control** – Includes links for setting up TFS publishing and GIT publishing.


#### Dashboard ####
The **Dashboard** management page includes the following:

 - A chart which summarizes website usage as measurements of certain metrics.

> - **CPU Time** – a measure of the website’s CPU usage.
> - **Requests** – a count of all client requests to the website.
> - **Data Out** – a measure of data sent by the website to clients.
> -  **Data In** – a measure of data received by the website from clients.
> - **Http Client Errors** – number of Http “4xx Client Error” messages sent.
> - **Http Server Errors** – number of Http “5xx Server Error” messages sent.

 > **Note**<br/>
To see a chart with additional performance metrics, configure the chart displayed on the **Monitor** management page as described in [How to Monitor Websites](/en-us/manage/services/web-sites/how-to-monitor-websites/).


 - A list of all linked resources associated with this website or if no resources are associated, a hyperlink to the **Linked Resources** management page.
 - A **quick glance** section which includes the following summary information and links:

> - **Download Publish Profile** – Link to the publish profile, a file which contains credentials and URLs required to publish to the website using any enabled publishing methods.
> - **Reset Deployment Credentials** – Displays a dialog box where you provide unique credentials for use when publishing with GIT or FTP. If you wish to use GIT or FTP deployment then you must reset deployment credentials because authentication to an FTP host or GIT repository with Live ID credentials is not supported. Once you reset deployment credentials you can use these credentials for GIT or FTP publishing to any website in your subscription.
> - **Set up TFS publishing** – Displays a dialog box where you can set up publishing from Team Foundation Service.
> - **Set up Git publishing** – Creates a GIT repository for the website so that you can publish to the website using GIT.
> - **Status** – Indicates whether the website is running or not.
> - **Site Url** – Specifies the publicly accessibly address of the website on the internet.
> - **Location** – Specifies the physical region of the datacenter that hosts the website.
> - **Compute Mode** – Specifies whether the website is running in Reserved or Shared mode. For more information about website modes see [How to Scale a Website](../how-to-scale-websites/).
> - **Subscription ID** – Specifies the actual unique subscription ID of the subscription that the website is associated with.
> - **FTP Hostname** – Specifies the URL to use when publishing to the website over FTP.
> - **Deployment User** – Indicates the account used when deploying the website to Windows Azure over FTP or GIT.
> - **Diagnostic Logs** – Specifies the location of the website’s diagnostic logs if diagnostic logging is enabled on the **Configure** management page.
> - **GIT Clone URL** – URL of the GIT repository for the website. For information about making a copy of a remote GIT repository see the **git clone** section of the [GIT Reference for Getting and Creating Projects][gitref].<br/>
 > 	**Note**<br/>
**GIT Clone URL** is not available until you click the link to **Set up GIT publishing** and create a GIT repository.

####Deployments####
 The **Deployments** management page provides a summary of all deployments made to the website using either GIT or TFS. If no GIT or TFS deployments have been made and GIT publishing has been configured for the website the **Deployments** management page provides information describing how to use GIT to deploy your web application to the website.

####Monitor####
The **Monitor** management page provides a chart that displays usage information for the website. By default this chart displays the same metrics as the chart on the **Dashboard** page as described above in the Dashboard section. The chart can also be configured to display the metrics Http Successes, Http Redirects, Http 401 errors, Http 403 errors, Http 404 errors and Http 406 errors. For more information about these metrics see [How to Monitor Websites](../how-to-monitor-websites/).

####Configure####
The **Configure** management page is used to set application specific settings including:

- **Framework** – Set the version of .NET framework or PHP required by your web application.
- **Diagnostics** – Set logging options for gathering diagnostic information for your website in this section. 
- **App Settings** – Specify name/value pairs that will be loaded by your web application on start up. For .NET sites, these settings will be injected into the website’s .NET configuration AppSettings at runtime, overriding existing settings. For PHP and Node websites, these settings will be available as environment variables at runtime.
- **Connections Strings** – View connection strings to linked resources. For .NET sites, these connection strings will be injected into the website’s .NET configuration connectionStrings settings at runtime, overriding any existing entries where the key equals the linked database name. For PHP and Node websites, these settings will be available as environment variables at runtime.
- **Default Documents** – Add your website’s default document to this list if it is not already in the list. If your website contains more than one of the files in the list then make sure your website’s default document appears at the top of the list by changing the order of the files in the list.

For more information about how to configure a Website see [How to Configure Websites](../how-to-configure-websites/).


####Scale####
The **Scale** management page is used to specify the website mode (either **Shared** or **Reserved**), the size of the website if it is configured as **Reserved** (**Small**, **Medium** or **Large**) and the value for **Reserved Instance Count** (from 1 to 3). A website that is configured as **Reserved** will provide more consistent performance than a website that is configured as **Shared**. A website that is configured with a larger **Reserved Instance Size** will perform better under load. Increasing the value for **Reserved Instance Count** will provide fault tolerance and improved performance through scale out. For more information about configuring scale options for a website see [How to Scale a Website](../how-to-scale-websites/).

####Linked Resources####
The **Linked Resources** management page provides a summary of all Windows Azure resources that your website is using. At the time of this writing, the only type of Windows Azure resource that can be linked to a website is a SQL database. 

####Management Page Icons####
Icons are displayed at the bottom of each of the website's Management pages, several of these icons appear on multiple pages and a couple of Management icons are only displayed on specific pages.  The following icons are displayed at the bottom of the **Dashboard** management page:

- **Browse** - Opens the default page for the website.
- **Stop** - Stops the website.
- **Upload** - Allows you to publish a web application to the website using  a web deploy package.
- **Delete** - Deletes the website.
- **WebMatrix** - Opens supported websites in WebMatrix, allowing you to make changes to the website and publish those changes back to the website on Windows Azure.

The following icons are not displayed at the bottom of the **Dashboard** management page but are on the bottom of other management pages to accomplish particular tasks:

- **Add Metrics** - At the bottom of the **Monitor** management page, allows you to add metrics to the chart displayed on the Monitor management page.
- **Link** - At the bottom of the **Linked Resources** management page, allows you to link the website to other Windows Azure resources, for example if your website needs access to a relational database you can link the website to a SQL Database resource by clicking the Link icon.



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