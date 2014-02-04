<properties linkid="manage-services-how-to-deploy-websites" urlDisplayName="How to deploy a Windows Azure Web Site" pageTitle="How to deploy a Windows Azure Web Site" metaKeywords="Azure deploy publish web site" description="Learn what methods are available for deploying content to a Windows Azure Web Site." metaCanonical="" services="web-sites" documentationCenter="" title="How to Deploy a Windows Azure Web Site" authors="tdykstra"  solutions="" writer="tdykstra" manager="wpickett" editor="mollybos"  />

#How to Deploy a Windows Azure Web Site

You have many options for deploying your own content to a Windows Azure Web site.  This topic provides an overview of the following options and links to more information about them.

* Tools for deploying manually 
	* [FTP utilities](#ftp)
	* [WebMatrix](#webmatrix)
	* [Visual Studio](#vs)
* Tools for automating deployment
	* [FTP utilities](#ftp2)
	* [DropBox](#dropbox)
	* [Web Deploy command line](#webdeploy)
	* [Windows PowerShell](#powershell)
	* [Cross-platform command line (xpat-cli)](#cli)
	* [.NET management API](#api)
* Source control systems that can automate deployment
	* [Git](#git)
	* [Visual Studio Online (VSO)](#vso)
	* [Team Foundation Server (TFS)](#tfs)
	* [Mercurial](#mercurial)

##<a name="ftp"></a>FTP utilities

[FTP](http://en.wikipedia.org/wiki/File_Transfer_Protocol) is the most commonly used publishing protocol, predating the web itself. When you create a Windows Azure Web Site, you can create FTP credentials and use any standard FTP application, including a browser such as Internet Explorer, to deploy content to it. There are many full-featured free tools that you can use, such as [FileZilla](https://filezilla-project.org/). 

It's easy to copy your web site's files to Windows Azure using FTP tools, but they don't automatically take care of or coordinate related deployment tasks such as database deployment. Also, many FTP tools don't compare source and destination files in order to skip copying files that haven't changed. For large sites this can result in long deployment times even for minor updates since all files are always copied.

For information about how to deploy a web site by using FTP utilities, see the following resource:

* [Create a PHP-MySQL Windows Azure Web Site and Deploy Using FTP](/en-us/documentation/articles/web-sites-php-mysql-deploy-use-ftp/). 

##<a name="webmatrix"></a>WebMatrix

[WebMatrix](http://www.microsoft.com/web/webmatrix/) is a free and relatively simple and easy-to-use IDE for developing web applications. It has built-in features for deploying to Windows Azure Web Sites. It can use Microsoft Web Deploy, which enables automation of related deployment tasks such as database deployment.

For information about how to deploy a web site by using WebMatrix, see the following resources:

* [Develop and deploy a web site with Microsoft WebMatrix](/en-us/develop/net/tutorials/website-with-webmatrix/). How to create a simple web site by using a WebMatrix template and deploy it to a Windows Azure Web Site by using WebMatrix and Web Deploy.
* [Webmatrix 3: Integrated Git and Deployment to Azure](http://www.codeproject.com/Articles/577581/Webmatrixplus3-3aplusIntegratedplusGitplusandplusD). How to use WebMatrix to deploy from a Git repository.

##<a name="vs"></a>Visual Studio

[Visual Studio](http://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx) is an advanced IDE that can be used for developing web applications. It offers many more features than WebMatrix, which also means it is a much bigger install and can be more difficult to learn how to use. Like WebMatrix, it has built-in deployment features that use Web Deploy to automate related deployment tasks such as database deployment. In addition, it has built-in management tools for Windows Azure Web Sites. From within the Visual Studio IDE you can create, stop, start, and delete Windows Azure Web Sites, you can view logs as they are created in real-time, you can debug remotely, and much more. Visual Studio also is integrated with [source control systems](http://asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/source-control) such as [Visual Studio Online](#vso), [Team Foundation Server](#tfs), and [Git repositories](#git).

For information about how to deploy a web site by using Visual Studio, see the following resources:

* [Get started with Windows Azure and ASP.NET](/en-us/develop/net/tutorials/get-started/). How to create and deploy a simple ASP.NET MVC web project by using Visual Studio and Web Deploy.
* [Deploy a Secure ASP.NET MVC 5 app with Membership, OAuth, and SQL Database to a Windows Azure Web Site](/en-us/develop/net/tutorials/web-site-with-sql-database/). How to create and deploy an ASP.NET MVC web project with a SQL database, by using Visual Studio, Web Deploy, and Entity Framework Code First Migrations.
* [Web Deployment Overview for Visual Studio and ASP.NET](http://msdn.microsoft.com/en-us/library/dd394698.aspx). A basic introduction to web deployment using Visual Studio. Inludes an overview of options for deploying a database along with the web application and a list of additional deployment tasks you might have to do or manually configure Visual Studio to do for you. This topic is about deployment in general, not just about deployment to Windows Azure Web Sites.
* [ASP.NET Web Deployment using Visual Studio](http://www.asp.net/mvc/tutorials/deployment/visual-studio-web-deployment/introduction). A 12-part tutorial series that covers a more complete range of deployment tasks than the others in this list. 
* [Deploying an ASP.NET Website to Azure in Visual Studio 2012 from a Git Repository directly ](http://www.dotnetcurry.com/ShowArticle.aspx?ID=881). Explains how to deploy an ASP.NET web project in Visual Studio, using the Git plug-in to commit the code to Git and connecting Windows Azure to the Git repository.





##<a name="ftp2"></a>FTP utilities

In addition to the FTP utilities for manual deployment that were mentioned earlier, you can use FTP from the command line in order to automate deployment.

For more information, see the following resource:

* [Using FTP Batch Scripts](http://support.microsoft.com/kb/96269).

##<a name="dropbox"></a>DropBox

[DropBox](www.dropbox.com) is a cloud-based file storage system. If you store your web site content in DropBox, you can use built-in features in Windows Azure to automate deployment to a Windows Azure Web Site.
 
For information about how to deploy a web site by using DropBox, see the following resources:

* [Deploy To Windows Azure Using Dropbox](http://blogs.msdn.com/b/windowsazure/archive/2013/03/19/new-deploy-to-windows-azure-web-sites-from-dropbox.aspx). How to use the Windows Azure Management Portal to set up DropBox deployment.
* [Windows Azure Forum for Git, Mercurial, and DropBox](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=azuregit).

See also [Git](#git) later in this document.

##<a name="webdeploy"></a>Web Deploy command line

Web Deploy is Microsoft software that automates many deployment-related tasks that can't be automated when you use FTP. For example, Web Deploy can deploy a new database or database updates along with your web site. Web Deploy can also minimize update deployment time for large sites since it can intelligently copy only changed files. Microsoft WebMatrix, Visual Studio, and Visual Studio Online, and Team Foundation Server have support for Web Deploy built-in, but you can also use Web Deploy directly from the command line to automate deployment. Web Deploy commands are very powerful but the learning curve can be steep.

For information about how to use Web Deploy from the command line to automate deployment, see the following resource:

* [Web Deployment Tool](http://technet.microsoft.com/en-us/library/dd568996(v=ws.10).aspx). Official documentation on the Microsoft TechNet site. Dated but still a good place to start.
* [Using Web Deploy](http://www.iis.net/learn/publish/using-web-deploy). Official documentation on the Microsoft IIS.NET site. Also dated but a good place to start.
* [StackOverflow](www.stackoverflow.com). The best place to go for more current information about how to use Web Deploy from the command line.

##<a name="powershell"></a>Windows Powershell

Windows Azure provides a REST management API and several APIs that make the REST API easier to use. One of these APIs consists of a collection of Windows PowerShell cmdlets.

For information about how to deploy a web site by using Windows PowerShell and the Windows Azure management REST API, see the following resource:

* [Building Real-World Cloud Apps with Windows Azure - Automate Everything](http://asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/automate-everything). E-book chapter that explains how the sample application shown in the e-book uses Windows PowerShell scripts to create a Windows Azure test environment and deploy to it.

##<a name="cli"></a>Cross-platform command line (xpat-cli)

You can use command line tools in Mac or Linux to access the Windows Azure management REST API. Tutorials specifically for deployment using the xpat-cli are not available yet, but for general documentation about these tools, see the following resource:

* [Command line tools](/en-us/downloads/#cmd-line-tools). Portal page in WindowsAzure.com for command line tool information.

##<a name="api"></a>.NET management API

You can write C# code to access the Windows Azure management REST API. Tutorials specifically for deployment using the .NET management API aren't available yet, but for general documentation about this API see the following resource:

* [Automating everything with the Windows Azure Management Libraries and .NET.](http://www.hanselman.com/blog/PennyPinchingInTheCloudAutomatingEverythingWithTheWindowsAzureManagementLibrariesAndNET.aspx). Introduction to the .NET management API and links to more documentation.



##<a name="git"></a>Git

[Git](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/source-control#gittfs) is a popular distributed source control system. Windows Azure has built-in features that make it easy to automate deployment to a Windows Azure Web Site from a Git repository.

For information about how to deploy a web site by using Git, see the following resources:

* [Publishing from Source Control to Windows Azure Web Sites](/en-us/develop/net/common-tasks/publishing-with-git/). How to use Git to publish directly from your local computer to a Windows Azure Web Site (in Windows Azure, this method of publishing is called Local Git). Also shows how to enable continuous deployment of Git repositories from GitHub, CodePlex, BitBucket, DropBox, or Mercurial.
* [Windows Azure Forum for Git, Mercurial, and DropBox](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=azuregit).

##<a name="vso"></a>Visual Studio Online (VSO)

[Visual Studio Online](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/source-control#gittfs) (formerly Team Foundation Service) is Microsoft's cloud-based solution for source control and team collaboration. The service is free for a team of up to 5 developers. You can set up VSO to do [continuous delivery](http://asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/continuous-integration-and-continuous-delivery) to a Windows Azure Web Site.

For information about how to deploy a web site by using Visual Studio Online, see the following resource:

* [Deliver to Azure Continuously](http://www.visualstudio.com/en-us/learn/continuous-delivery-in-vs). Step by step tutorial that shows how to set up continuous delivery from VSO to a Windows Azure Web Site, using TFVC. TFVC is the centralized source control option in VSO, as opposed to Git, which is the distributed source control option.
* [Continuous delivery to Windows Azure using Visual Studio Online](/en-us/documentation/articles/cloud-services-continuous-delivery-use-vso/). How to sign up for VSO, check in a project to source control, and set it up for continuous delivery (automatic deployment) to Windows Azure. Written for cloud services, but much of the process for setting up deployment in Visual Studio Online is similar for Web Sites.

##<a name="tfs"></a>Team Foundation Server (TFS)

Team Foundation Server is Microsoft's on-premises solution for source control and team collaboration. You can set up TFS to do [continuous delivery](http://asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/continuous-integration-and-continuous-delivery) to a Windows Azure Web Site.

For information about how to deploy a web site by using Team Foundation Server (TFS), see the following resource:

* [Continuous Delivery for Cloud Services in Windows Azure](/en-us/develop/net/common-tasks/continuous-delivery/). There is no tutorial specifically for continuous deployment from TFS to a Windows Azure Web Site; this document is for a Windows Azure Cloud Service. Some of its content is relevant to Web Sites.

##<a name="mercurial"></a>Mercurial

If you store your web content in Mercurial, you can use built-in features in Windows Azure to deploy your content to a Web Site.

For information about how to deploy from Mercurial, see the following resources:

* [Windows Azure Forum for Git, Mercurial, and DropBox](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=azuregit).
* If you use Git with Mercurial, see also [Git](#git) earlier in this document.

##<a name="nextsteps"></a>Next Steps
For more information, see the Deploy section in [Windows Aure Web Sites Documentation](/en-us/documentation/services/web-sites/).
