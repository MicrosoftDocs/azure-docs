<properties linkid="manage-services-how-to-deploy-websites" urlDisplayName="How to deploy" pageTitle="How to deploy web sites - Windows Azure service management" metaKeywords="Azure deploying web site" description="Learn how to deploy a web site." metaCanonical="" services="web-sites" documentationCenter="" title="How to Deploy a Web Site" authors="tdykstra,timamm"  solutions="" writer="tdykstra,timamm" manager="wpickett" editor="mollybos"  />

#How to Deploy a Web Site

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

For information about how to deploy a web site by using Visual Studio, see the following resources:

* [Get started with Windows Azure and ASP.NET](/en-us/develop/net/tutorials/get-started/). How to create and deploy a simple ASP.NET MVC web project by using Visual Studio and Web Deploy.
* [Deploy a Secure ASP.NET MVC 5 app with Membership, OAuth, and SQL Database to a Windows Azure Web Site](/en-us/develop/net/tutorials/web-site-with-sql-database/). How to create and deploy an ASP.NET MVC web project with a SQL database, by using Visual Studio, Web Deploy, and Entity Framework Code First Migrations.
* [Web Deployment Overview for Visual Studio and ASP.NET](http://msdn.microsoft.com/en-us/library/dd394698.aspx). A basic introduction to web deployment using Visual Studio. Inludes an overview of options for deploying a database along with the web application and a list of additional deployment tasks you might have to do or manually configure Visual Studio to do for you.
* [Dirt Simple Web and Database Deployment in Visual Studio 2012](http://channel9.msdn.com/Shows/Web+Camps+TV/Dirt-Simple-Web-and-Database-Deployment-in-Visual-Studio-11). This video  introduces the Visual Studio 2012 web deployment functionality (which can also be installed in Visual Studio 2010). Additional features have been added since the video was recorded, especially for deploying to Windows Azure, but the UI has remained basically the same.
* [ASP.NET Web Deployment using Visual Studio](http://www.asp.net/mvc/tutorials/deployment/visual-studio-web-deployment/introduction). A 12-part tutorial series that covers a more complete range of deployment tasks than the others in this list. 
* [Deploying an ASP.NET Website to Azure in Visual Studio 2012 from a Git Repository directly ](http://www.dotnetcurry.com/ShowArticle.aspx?ID=881). Explains how to deploy an ASP.NET web project in Visual Studio, using the Git plug-in to commit the code to Git and connecting Windows Azure to the Git repository.

##<a name="vso"></a>Visual Studio Online (VSO)

For information about how to deploy a web site by using Visual Studio Online, see the following resources:

* [Continuous delivery to Windows Azure using Visual Studio Online](/en-us/develop/net/common-tasks/publishing-with-tfs/). How to sign up for VSO, check in a project to source control, and set it up for continuous delivery (automatic deployment) to Windows Azure. 

##<a name="tfs"></a>Team Foundation Server (TFS)

For information about how to deploy a web site by using Team Foundation Server (TFS), see the following resources:

* [Continuous Delivery for Cloud Services in Windows Azure](/en-us/develop/net/common-tasks/continuous-delivery/). There is no tutorial specifically for continuous deployment from TFS to a Windows Azure Web Site; this document is for a Windows Azure Cloud Service. Some of its content is relevant to Web Sites.

##<a name="powershell"></a>Windows Powershell

For information about how to deploy a web site by using PowerShell and the Windows Azure management REST API, see the following resources:

* [Building Real-World Cloud Apps with Windows Azure - Automate Everything](http://asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/automate-everything). Chapter of Building Real-World Cloud Apps e-book that explains how the sample application uses Windows PowerShell scripts to create a Windows Azure test environment and deploy to it.

##<a name="cli"></a>Cross-platform command line (xpat-cli)

You can use command line tools in Mac or Linux to access the Windows Azure management REST API. There aren't tutorials specifically for deployment using the xpat-cli yet, but the functions available are similar to what is available using [Windows PowerShell](#powershell).  For information about the xpat-cli, see the following resources:

* [Command line tools](/en-us/downloads/#cmd-line-tools). Portal page in WindowsAzure.com for command line tool information.

##<a name="api"></a>.NET management API

You can write C# code to access the Windows Azure management REST API. There aren't tutorials specifically for deployment using the .NET management API yet, but the functions available are similar to what is available using [Windows PowerShell](#powershell).  For information about the .NET management APi, see the following resources:

* [Automating everything with the Windows Azure Management Libraries and .NET.](http://www.hanselman.com/blog/PennyPinchingInTheCloudAutomatingEverythingWithTheWindowsAzureManagementLibrariesAndNET.aspx). Introduction to the .NET management API and links to more documentation.

##<a name="ftp"></a>FTP

FTP is the most ubiquitous publishing protocol, predating the web itself. When you create a web site, you can create FTP credentials and use any standard FTP application, including Internet Explorer itself, to push or pull content. There are quite a few tools and techniques that allow you to [script](http://support.microsoft.com/kb/96269) or [automate](http://support.microsoft.com/kb/96269) using FTP. 

* Pros: Huge selection of tools, requires little configuration, very easy and straightforward to use.
* Cons: Limited ability for intelligent sync.

##<a name="webdeploy"></a>Web Deploy

For information about how to deploy by using Web Deploy in Visual Studio, see [Visual Studio](#vs) earlier in this document.

##<a name="webmatrix"></a>WebMatrix

For information about how to deploy a web site by using WebMatrix, see the following resources:


* [Develop and deploy a web site with Microsoft WebMatrix](/en-us/develop/net/tutorials/website-with-webmatrix/). How to create a simple web site by using a WebMatrix template and deploy it to a Windows Azure Web Site by using WebMatrix and Web Deploy.

##<a name="git"></a>Git

For information about how to deploy a web site by using Git, see the following resources:

[Publishing from Source Control to Windows Azure Web Sites](/en-us/develop/net/common-tasks/publishing-with-git/). How to use Git to publish directly from your local computer to a Windows Azure Web Site (in Windows Azure, this method of publishing is called Local Git). Also shows how to enable continuous deployment of Git repositories from GitHub, CodePlex, BitBucket, DropBox, or Mercurial.

For information about how to deploy a Git repository from Visual Studio, see [Visual Studio](#vs) earlier in this document.

##<a name="dropbox"></a>DropBox

For information about how to deploy a Git repository from DropBox, see [Git](#git) earlier in this document.

##<a name="mercurial"></a>Mercurial

For information about how to deploy a Git repository from Mercurial, see [Git](#git) earlier in this document.


##<a name="nextsteps"></a>Next Steps
For more information, see [Windows Aure Web Sites](/en-us/documentation/services/web-sites/).
