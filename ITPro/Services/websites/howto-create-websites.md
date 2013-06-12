<properties linkid="manage-services-how-to-create-websites" urlDisplayName="How to create" pageTitle="How to create web sites - Windows Azure service management" metaKeywords="Azure creating web site, Azure deleting web site" metaDescription="Learn how to create a web site using the Windows Azure Management Portal." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="tysonn" />

<div chunk="../chunks/web-sites-left-nav.md" />

#How to Create and Deploy a Web Site

<div chunk="../../Shared/Chunks/disclaimer.md" />

Just as you can quickly create and deploy a web application created from the gallery, you can also deploy a web site created on a workstation with traditional developer tools from Microsoft or other companies. 


## Table of Contents ##

- [Deployment Options](#deployoptions)
- [How to: Create a Web Site Using the Management Portal](#createawebsiteportal)
- [How to: Create a Web Site from the Gallery](#howtocreatefromgallery)
- [How to: Delete a Web Site](#deleteawebsite)
- [Next Steps](#nextsteps)


##<a name="deployoptions"></a>Deployment Options

Windows Azure supports deploying web sites from remote computers using WebDeploy, FTP, GIT or TFS. Many development tools provide integrated support for publication using one or more of these methods and may only require that you provide the necessary credentials, site URL and hostname or URL for your chosen deployment method. 

Credentials and deployment URLs for all enabled deployment methods are stored in the web site's publish profile, a file which can be downloaded in the Windows Azure Management Portal from the **Quick Start** page or the **quick glance** section of the **Dashboard** page. 

If you prefer to deploy your web site with a separate client application, high quality open source GIT and FTP clients are available for download on the Internet for this purpose.

##<a name="createawebsiteportal"></a>How to: Create a Web Site Using the Management Portal

Follow these steps to create a web site in Windows Azure.
	
1. Login to the [Windows Azure Management Portal](http://manage.windowsazure.com/).

2. Click the **Create New** icon on the bottom left of the Management Portal.

3. Click the **Web Site** icon, click the **Quick Create** icon, enter a value for URL and then click the check mark next to create web site on the bottom right corner of the page.

4. When the web site has been created you will see the text **Creation of Web Site '[SITENAME]'  Completed**.

5. Click the name of the web site displayed in the list of web sites to open the web site's **Quick Start** management page.

6. On the **Quick Start** page you are provided with options to set up TFS or GIT publishing if you would like to deploy your finished web site to Windows Azure using these methods. FTP publishing is set up by default for web sites and the FTP Host name is displayed under **FTP Hostname** on the **Quick Start** and **Dashboard** pages. Before publishing with FTP or GIT choose the option to **Reset deployment credentials** on the **Dashboard** page. Then specify the new credentials (username and password) to authenticate against the FTP Host or the Git Repository when deploying content to the web site.

7. The **Configure** management page exposes several configurable application settings in the following sections:

 - **Framework**: Set the version of .NET framework or PHP required by your web application.

 - **Diagnostics**: Set logging options for gathering diagnostic information for your web site in this section.

 - **App Settings**: Specify name/value pairs that will be loaded by your web application on start up. For .NET sites, these settings will be injected into your .NET configuration **AppSettings** at runtime, overriding existing settings. For PHP and Node sites these settings will be available as environment variables at runtime.

 - **Connection Strings**: View connection strings for linked resources. For .NET sites, these connection strings will be injected into your .NET configuration **connectionStrings** settings at runtime, overriding existing entries where the key equals the linked database name. For PHP and Node sites these settings will be available as environment variables at runtime.

 - **Default Documents**: Add your web application's default document to this list if it is not already in the list. If your web application contains more than one of the files in the list then make sure your web site's default document appears at the top of the list.



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