<properties linkid="manage-services-how-to-deploy-websites" urlDisplayName="How to deploy a Windows Azure Web Site" pageTitle="How to deploy a Windows Azure Web Site" metaKeywords="Azure deploy publish web site" description="Learn what methods are available for deploying content to a Windows Azure Web Site." metaCanonical="" services="web-sites" documentationCenter="" title="How to Deploy a Windows Azure Web Site" authors="tdykstra"  solutions="" writer="tdykstra" manager="wpickett" editor="mollybos"  />

#How to Deploy a Windows Azure Web Site

You have many options for deploying your own content to a Windows Azure Web site.  This topic provides an overview of the following options and links to more information about them.

* [Visual Studio](#vs)
* [Visual Studio Online (VSO)](#vso)
* [Team Foundation Server (TFS)](#tfs)
* [Windows PowerShell](#powershell)
* [Cross-platform command line (xpat-cli](#cli)
* [.NET management API](#api)
* [WebMatrix](#webmatrix)
* [FTP](#ftp)
* [Web Deploy](#webdeploy)
* [Git](#git)
* [DropBox](#dropbox)
* [Mercurial](#mercurial)

##<a name="vs"></a>Visual Studio

Visual Studio has built-in tools that make it easy to deploy a web project. You can even create and manage the web site within the IDE.

* Pros: Convenient to deploy while working on a project in Visual Studio.
* Cons: Might not be appropriate for team environments that use [source control](http://asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/source-control) and [continuous delivery](http://asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/continuous-integration-and-continuous-delivery).

For information about how to deploy a web site by using Visual Studio, see the following resources:

* [Get started with Windows Azure and ASP.NET](/en-us/develop/net/tutorials/get-started/). How to create and deploy a simple ASP.NET MVC web project by using Visual Studio and Web Deploy.
* [Deploy a Secure ASP.NET MVC 5 app with Membership, OAuth, and SQL Database to a Windows Azure Web Site](/en-us/develop/net/tutorials/web-site-with-sql-database/). How to create and deploy an ASP.NET MVC web project with a SQL database, by using Visual Studio, Web Deploy, and Entity Framework Code First Migrations.
* [Web Deployment Overview for Visual Studio and ASP.NET](http://msdn.microsoft.com/en-us/library/dd394698.aspx). A basic introduction to web deployment using Visual Studio. Inludes an overview of options for deploying a database along with the web application and a list of additional deployment tasks you might have to do or manually configure Visual Studio to do for you.
* [Dirt Simple Web and Database Deployment in Visual Studio 2012](http://channel9.msdn.com/Shows/Web+Camps+TV/Dirt-Simple-Web-and-Database-Deployment-in-Visual-Studio-11). This video  introduces the Visual Studio 2012 web deployment functionality (which can also be installed in Visual Studio 2010). Additional features have been added since the video was recorded, especially for deploying to Windows Azure, but the UI has remained basically the same.
* [ASP.NET Web Deployment using Visual Studio](http://www.asp.net/mvc/tutorials/deployment/visual-studio-web-deployment/introduction). A 12-part tutorial series that covers a more complete range of deployment tasks than the others in this list. 
* [Deploying an ASP.NET Website to Azure in Visual Studio 2012 from a Git Repository directly ](http://www.dotnetcurry.com/ShowArticle.aspx?ID=881). Explains how to deploy an ASP.NET web project in Visual Studio, using the Git plug-in to commit the code to Git and connecting Windows Azure to the Git repository.

##<a name="vso"></a>Visual Studio Online (VSO)

Visual Studio Online (formerly Team Foundation Service) is Microsoft's cloud-based solution for source control and team collaboration, and it can do [continuous delivery](http://asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/continuous-integration-and-continuous-delivery) to a Windows Azure Web Site.

For information about how to deploy a web site by using Visual Studio Online, see the following resources:

* [Continuous delivery to Windows Azure using Visual Studio Online](/en-us/documentation/articles/cloud-services-continuous-delivery-use-vso/). How to sign up for VSO, check in a project to source control, and set it up for continuous delivery (automatic deployment) to Windows Azure. Written for cloud services, but much of the process for setting up deployment in Visual Studio Online is similar for Web Sites.

##<a name="tfs"></a>Team Foundation Server (TFS)

Team Foundation Server is Microsoft's on-premises solution for source control and team collaboration, and it can do [continuous delivery](http://asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/continuous-integration-and-continuous-delivery) to a Windows Azure Web Site.

For information about how to deploy a web site by using Team Foundation Server (TFS), see the following resources:

* [Continuous Delivery for Cloud Services in Windows Azure](/en-us/develop/net/common-tasks/continuous-delivery/). There is no tutorial specifically for continuous deployment from TFS to a Windows Azure Web Site; this document is for a Windows Azure Cloud Service. Some of its content is relevant to Web Sites.

##<a name="powershell"></a>Windows Powershell

Windows Azure provides a REST management API that can be used for deployment, and a set of Windows PowerShell cmdlets that work with the REST management API.

* Pros: Saves time and ensures more consistent results by automating the deployment process in scripts.
* Cons: Requires Windows PowerShell expertise to write scripts.

For information about how to deploy a web site by using Windows PowerShell and the Windows Azure management REST API, see the following resources:

* [Building Real-World Cloud Apps with Windows Azure - Automate Everything](http://asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/automate-everything). Chapter of Building Real-World Cloud Apps e-book that explains how the sample application uses Windows PowerShell scripts to create a Windows Azure test environment and deploy to it.

##<a name="cli"></a>Cross-platform command line (xpat-cli)

You can use command line tools in Mac or Linux to access the Windows Azure management REST API. There aren't tutorials specifically for deployment using the xpat-cli yet, but the functions available are similar to what is available using [Windows PowerShell](#powershell).  For information about the xpat-cli, see the following resources:

* [Command line tools](/en-us/downloads/#cmd-line-tools). Portal page in WindowsAzure.com for command line tool information.

##<a name="api"></a>.NET management API

You can write C# code to access the Windows Azure management REST API. There aren't tutorials specifically for deployment using the .NET management API yet, but the functions available are similar to what is available using [Windows PowerShell](#powershell).  For information about the .NET management APi, see the following resources:

* [Automating everything with the Windows Azure Management Libraries and .NET.](http://www.hanselman.com/blog/PennyPinchingInTheCloudAutomatingEverythingWithTheWindowsAzureManagementLibrariesAndNET.aspx). Introduction to the .NET management API and links to more documentation.

##<a name="ftp"></a>FTP

FTP is the most commonly used publishing protocol, predating the web itself. When you create a web site, you can create FTP credentials and use any standard FTP application, including a browser such as Internet Explorer, to push or pull content. There are quite a few tools and techniques that allow you to [script](http://support.microsoft.com/kb/96269) or [automate](http://support.microsoft.com/kb/96269) using FTP. You can use FTP with Visual Studio or any of the source control frameworks mentioned earlier.

* Pros: Huge selection of tools, requires little configuration, very easy and straightforward to use.
* Cons: Limited ability for intelligent sync. Unable to coordinate completion of many other related tasks such as database deployment.  See the following section on Web Deploy for an alternative.

##<a name="webdeploy"></a>Web Deploy

Web Deploy is Microsoft software that automates many deployment-related tasks that can't be automated when you use FTP. For example, Web Deploy can deploy a database or database updates along with your web site. Web Deploy can also minimize update deployment time for large sites since it can intelligently copy only changed files. You can use Web Deploy with Visual Studio, with any of the source control frameworks mentioned earlier, or from the command line. 

* Pros: Easy to use when you're using Visual Studio or Microsoft source control; intelligent sync; automates tasks that would otherwise be difficult to do.
* Cons: If you use it from the command-line, requires learning the command-line interface.

For information about how to deploy by using Web Deploy in Visual Studio, see [Visual Studio](#vs), [Visual Studio Online](vso), and [Team Foundation Server](#tfs) earlier in this document.

##<a name="webmatrix"></a>WebMatrix

WebMatrix is a free and relatively simple and easy-to-use IDE for developing web applications. It has built-in features for deploying to Windows Azure Web Sites.

For information about how to deploy a web site by using WebMatrix, see the following resources:

* [Develop and deploy a web site with Microsoft WebMatrix](/en-us/develop/net/tutorials/website-with-webmatrix/). How to create a simple web site by using a WebMatrix template and deploy it to a Windows Azure Web Site by using WebMatrix and Web Deploy.
* [Webmatrix 3: Integrated Git and Deployment to Azure](http://www.codeproject.com/Articles/577581/Webmatrixplus3-3aplusIntegratedplusGitplusandplusD). How to use WebMatrix to deploy from a Git repository.

##<a name="git"></a>Git

If you use Git for source control, you can use features built-in to the Windows Azure environment that make it easy to deploy to a Windows Azure Web Site.

For information about how to deploy a web site by using Git, see the following resources:

* [Publishing from Source Control to Windows Azure Web Sites](/en-us/develop/net/common-tasks/publishing-with-git/). How to use Git to publish directly from your local computer to a Windows Azure Web Site (in Windows Azure, this method of publishing is called Local Git). Also shows how to enable continuous deployment of Git repositories from GitHub, CodePlex, BitBucket, DropBox, or Mercurial.
* [Windows Azure Forum for Git, Mercurial, and DropBox](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=azuregit).

See also [Visual Studio](#vs) and [WebMatrix](#webmatrix) earlier in this document.

##<a name="dropbox"></a>DropBox

If you store your web content in DropBox, you can use built-in features in Windows Azure to deploy your content to a Web Site.
 
For information about how to deploy a web site by using DropBox, see the following resources:

* [Deploy To Windows Azure Using Dropbox](http://blogs.msdn.com/b/windowsazure/archive/2013/03/19/new-deploy-to-windows-azure-web-sites-from-dropbox.aspx). How to use the Windows Azure Management Portal to set up DropBox deployment.
* [Windows Azure Forum for Git, Mercurial, and DropBox](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=azuregit).

See also [Git](#git) earlier in this document.

##<a name="mercurial"></a>Mercurial

If you store your web content in Mercurial, you can use built-in features in Windows Azure to deploy your content to a Web Site.

For information about how to deploy from Mercurial, see the following resources:

* [Windows Azure Forum for Git, Mercurial, and DropBox](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=azuregit).

See also [Git](#git) earlier in this document.

##<a name="nextsteps"></a>Next Steps
For more information, see the Deploy section in [Windows Aure Web Sites Documentation](/en-us/documentation/services/web-sites/).
