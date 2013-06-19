<properties linkid="manage-services-how-to-create-websites" urlDisplayName="How to create" pageTitle="How to create web sites - Windows Azure service management" metaKeywords="Azure creating web site, Azure deleting web site" metaDescription="Learn how to create a web site using the Windows Azure Management Portal." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />



#How to Create and Deploy a Web Site

Just as you can quickly create and deploy a web application created from the gallery, you can also deploy a web site created on a workstation with traditional developer tools from Microsoft or other companies. 


## Table of Contents ##

- [Deployment Options](#deployoptions)
- [How to: Create a Web Site Using the Management Portal](#createawebsiteportal)
- [How to: Create a Web Site from the Gallery](#howtocreatefromgallery)
- [How to: Delete a Web Site](#deleteawebsite)
- [Next Steps](#nextsteps)


##<a name="deployoptions"></a>Deployment Options

Windows Azure supports deploying web sites from remote computers using WebDeploy, FTP, Git or TFS. Many development tools provide integrated support for publication using one or more of these methods and may only require that you provide the necessary credentials, site URL and hostname or URL for your chosen deployment method. 

Credentials and deployment URLs for all enabled deployment methods are stored in the web site's publish profile, a file which can be downloaded in the Windows Azure Management Portal from the **Quick Start** page or the **quick glance** section of the **Dashboard** page. 

If you prefer to deploy your web site with a separate client application, high quality open source Git and FTP clients are available for download on the Internet for this purpose.

##<a name="createawebsiteportal"></a>How to: Create a Web Site Using the Management Portal

Follow these steps to create a web site in Windows Azure.
	
1. Login to the [Windows Azure Management Portal](http://manage.windowsazure.com/).

2. Click the **Create New** icon on the bottom left of the Management Portal.

3. Click the **Web Site** icon, click the **Quick Create** icon, enter a value for URL and then click the check mark next to **Create Web Site** on the bottom right corner of the page.

4. When the web site has been created, you will see the text **Creating web site <*web site name*>  succeeded**. You can browse to the web site by clicking **Browse** at the bottom of the portal page.

5. In the portal, click the name of the web site displayed in the list of web sites to open the web site's **Quick Start** management page.

6. On the **Quick Start** page, you are provided with options to get web site development tools, set up publishing for your web site, or set up deployment from a source control provider like TFS or Git. FTP publishing is set up by default for web sites and the FTP Host name is displayed in the **Quick Glance** section of the **Dashboard** page under **FTP Host Name**. Before publishing with FTP or Git, choose the option to **Reset deployment credentials** on the **Dashboard** page so that you can authenticate against the FTP Host or the Git Repository when deploying content to your web site.

7. The **Configure** management page exposes settings for your web site in the following categories:

 - **General**: Set the version of .NET framework or PHP required by your web application. For sites in Standard mode, the **Platform** option lets you choose either a 32-bit or 64-bit environment.

- **Certificates**: In Standard mode, you can upload SSL certificates for custom domains. 

- **Domain Names**: In Shared and Standard modes, you can view and manage custom domain names for your web site.

- **SSL Bindings**: In Standard mode, you can assign SSL certificates to your custom domain names using either IP-based or SNI-based SSL.

 - **Deployments**: When you set up deployment from source control, you can configure your deployments here.

 - **Application Diagnostics**:  Set options for gathering diagnostic traces from a web application that has been instrumented with traces. 

- **Site Diagnostics**: Set logging options for gathering diagnostic information for your web site. Options include Web Server Logging, Detailed Error Messages, and Failed Request Tracing.

- **Monitoring**: For web sites in Standard mode, you can use this feature to test the availability of HTTP or HTTPS endpoints. 

- **App Settings**: Specify name/value pairs that will be loaded by your web application on start up. For .NET sites, these settings will be injected into your .NET configuration **AppSettings** at runtime, overriding existing settings. For PHP and Node sites these settings will be available as environment variables at runtime.

 - **Connection Strings**: View and edit connection strings. For .NET sites, these connection strings will be injected into your .NET configuration **connectionStrings** settings at runtime, overriding existing entries where the key equals the linked database name. For PHP and Node sites, these settings will be available as environment variables at runtime.

 - **Default Documents**: A web site’s default document is the page that is displayed by default when a user navigates to a web site. Add your web application's default document to this list if it is not already present.  Your web site's default document should be at the top of the list.

- **Handler Mappings**: Specify script processors that will handle requests for specific file extensions like *.php.

##<a name="howtocreatefromgallery"></a>How to: Create a Web Site from the Gallery

<div chunk="../../../Shared/Chunks/website-from-gallery.md" />

##<a name="deleteawebsite"></a>How to: Delete a Web Site
Web sites are deleted using the **Delete** icon in the Windows Azure Management Portal. The **Delete** icon is available in the Windows Azure Portal when you click **Web Sites** to list all of your web sites and at the bottom of each of the web site management pages.

##<a name="nextsteps"></a>Next Steps
For more information about Web Sites, see the following:

[Walkthrough: Troubleshooting a Web Site on Windows Azure](http://go.microsoft.com/fwlink/?LinkId=251824)



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