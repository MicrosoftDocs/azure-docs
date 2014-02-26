<properties linkid="manage-services-how-to-deploy-websites" urlDisplayName="How to deploy a Windows Azure Web Site" pageTitle="How to deploy a Windows Azure Web Site" metaKeywords="Azure deploy publish web site" description="Learn what methods are available for deploying content to a Windows Azure Web Site." metaCanonical="" services="web-sites" documentationCenter="" title="How to Deploy a Windows Azure Web Site" authors="tdykstra"  solutions="" writer="tdykstra" manager="wpickett" editor="mollybos"  />

#How to Deploy a Windows Azure Web Site

You have many options for deploying your own content to a Windows Azure Web site. This topic provides a brief overview of each option and links to more information.

* [Deploying from a cloud-hosted source control system](#cloud)
	* Visual Studio Online (VSO)
	* Repository web sites using Git
	* Repository web sites using Mercurial
    * Dropbox
* [Deploying from an IDE](#ide)
	* Visual Studio
	* WebMatrix
* [Deploying by using an FTP utility](#ftp)
* [Deploying from an on-premises source control system](#onpremises)
	* Team Foundation Server (TFS)
	* On-premises Git or Mercurial repositories
* [Using command-line tools and the Windows Azure REST management API](#commandline)
	* MSBuild
	* FTP scripts
	* Windows PowerShell
	* .NET management API
	* Cross-platform command line (xpat-cli)
	* Web Deploy command line


##<a name="cloud"></a>Deploying from a cloud-hosted source control system

The best way to deploy a web site is to set up a [continuous delivery workflow](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/continuous-integration-and-continuous-delivery) integrated with your [source control system](http://asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/source-control). Automation not only makes the development process more efficient but also can make your backup and restore processes more manageable and reliable. 

If you don't have source control set up yet, the easiest way to get started is to use a cloud-hosted source control system.

###<a name="vso"></a>Visual Studio Online (VSO)

[Visual Studio Online](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/source-control#gittfs) (formerly Team Foundation Service) is Microsoft's cloud-based solution for source control and team collaboration. The service is free for a team of up to 5 developers. You can set up VSO to do continuous delivery to a Windows Azure Web Site, and your repository can use either [Git or TFVC](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/source-control#gittfs).

For more information, see the following resources:

* [Deliver to Azure Continuously](http://www.visualstudio.com/en-us/learn/continuous-delivery-in-vs). Step by step tutorial that shows how to set up continuous delivery from VSO to a Windows Azure Web Site, using TFVC. TFVC is the centralized source control option in VSO, as opposed to Git, which is the distributed source control option.
* [Continuous delivery to Windows Azure using Visual Studio Online](/en-us/documentation/articles/cloud-services-continuous-delivery-use-vso/). How to sign up for VSO, check in a project to source control, and set it up for continuous delivery (automatic deployment) to Windows Azure. Written for cloud services, but much of the process for setting up deployment in Visual Studio Online is similar for Web Sites.

###<a name="git"></a>Repository web sites using Git

[Git](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/source-control#gittfs) is a popular distributed source control system. Windows Azure has built-in features that make it easy to automate deployment to a Windows Azure Web Site from popular web-based repository sites that store Git repositories, including [GitHub](http://www.github.com), [CodePlex](http://www.codeplex.com/), and [BitBucket](https://bitbucket.org/). An advantage of using Git to deploy is that it's relatively easy to roll back to an earlier deployment if that ever becomes necessary. 

For more information, see the following resources:

* [Publishing from Source Control to Windows Azure Web Sites](/en-us/documentation/articles/web-sites-publish-source-control/). How to use Git to publish directly from your local computer to a Windows Azure Web Site (in Windows Azure, this method of publishing is called Local Git). Also shows how to enable continuous deployment of Git repositories from GitHub, CodePlex, or BitBucket.
* [Windows Azure Forum for Git, Mercurial, and DropBox](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=azuregit).

###<a name="mercurial"></a>Repository web sites using Mercurial

If you use [Mercurial](http://mercurial.selenic.com/) as your source control system and store your repository in [CodePlex](http://www.codeplex.com/) or [BitBucket](https://bitbucket.org/), you can use built-in features in Windows Azure Web Sites to automatically deploy your content.

For information about how to deploy using Mercurial, see the following resources:

* [Publishing from Source Control to Windows Azure Web Sites](/en-us/documentation/articles/web-sites-publish-source-control/). Although this tutorial shows how to publish a Git repository, the process for Mercurial repositories hosted in CodePlex or BitBucket is similar.
* [Windows Azure Forum for Git, Mercurial, and DropBox](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=azuregit).

###<a name="dropbox"></a>DropBox

[DropBox](https://www.dropbox.com/) is not a source control system, but if you store your source code in DropBox you can automate deployment from your DropBox account.

* [Deploy To Windows Azure Using Dropbox](http://blogs.msdn.com/b/windowsazure/archive/2013/03/19/new-deploy-to-windows-azure-web-sites-from-dropbox.aspx). How to use the Windows Azure Management Portal to set up DropBox deployment.
* [DropBox and Windows Azure Web Sites](http://channel9.msdn.com/Series/Windows-Azure-Web-Sites-Tutorials/Dropbox-Deployment-to-Windows-Azure-Web-Sites). This video walks through the process of connecting a DropBox folder to a Windows Azure Web Site, and shows how quickly you can get a web site up and running or maintain it using simple drag-and-drop deployment.
* [Windows Azure Forum for Git, Mercurial, and DropBox](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=azuregit).







##<a name="ide"></a>Deploying from an IDE

[Visual Studio](http://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx) and [WebMatrix](http://www.microsoft.com/web/webmatrix/) are Microsoft IDEs (integrated development environments) that you can use for web development. Both provide built-in features that make it easy to deploy to Windows Azure Web Sites.  Both can use [Web Deploy](http://www.iis.net/downloads/microsoft/web-deploy) to automate additional deployment-related tasks such as database deployment and connection string changes. Both can also deploy by using [FTP or FTPS]([FTP](http://en.wikipedia.org/wiki/File_Transfer_Protocol)). 

WebMatrix is quick to install and easy to learn, but Visual Studio offers many more features for working with Windows Azure Web Sites. From within the Visual Studio IDE you can create, stop, start, and delete Windows Azure Web Sites, you can view logs as they are created in real-time, you can debug remotely, and much more. Visual Studio also integrates with source control systems such as [Visual Studio Online](#vso), [Team Foundation Server](#tfs), and [Git repositories](#git).

###<a name="vs"></a>Visual Studio

For information about how to deploy to Windows Azure Web Sites from Visual Studio, see the following resources:

* [Get started with Windows Azure and ASP.NET](/en-us/develop/net/tutorials/get-started/). How to create and deploy a simple ASP.NET MVC web project by using Visual Studio and Web Deploy.
* [Deploy a Secure ASP.NET MVC 5 app with Membership, OAuth, and SQL Database to a Windows Azure Web Site](/en-us/develop/net/tutorials/web-site-with-sql-database/). How to create and deploy an ASP.NET MVC web project with a SQL database, by using Visual Studio, Web Deploy, and Entity Framework Code First Migrations.
* [Web Deployment Overview for Visual Studio and ASP.NET](http://msdn.microsoft.com/en-us/library/dd394698.aspx). A basic introduction to web deployment using Visual Studio. Dated but includes information that is still relevant, including an overview of options for deploying a database along with the web application and a list of additional deployment tasks you might have to do or manually configure Visual Studio to do for you. This topic is about deployment in general, not just about deployment to Windows Azure Web Sites.
* [ASP.NET Web Deployment using Visual Studio](http://www.asp.net/mvc/tutorials/deployment/visual-studio-web-deployment/introduction). A 12-part tutorial series that covers a more complete range of deployment tasks than the others in this list. 
* [Deploying an ASP.NET Website to Azure in Visual Studio 2012 from a Git Repository directly](http://www.dotnetcurry.com/ShowArticle.aspx?ID=881). Explains how to deploy an ASP.NET web project in Visual Studio, using the Git plug-in to commit the code to Git and connecting Windows Azure to the Git repository.

###<a name="webmatrix"></a>WebMatrix

For information about how to deploy to Windows Azure Web Sites from WebMatrix, see the following resources:

* [Develop and deploy a web site with Microsoft WebMatrix](http://www.windowsazure.com/en-us/documentation/articles/web-sites-dotnet-using-webmatrix/). How to create a simple ASP.NET web site by using a WebMatrix template and deploy it to a Windows Azure Web Site by using WebMatrix and Web Deploy.
* [Build and deploy a Node.js web site to Windows Azure using WebMatrix](http://www.windowsazure.com/en-us/documentation/articles/web-sites-nodejs-use-webmatrix/).
* [Create and deploy a PHP-MySQL Windows Azure Web Site using WebMatrix](http://www.windowsazure.com/en-us/documentation/articles/web-sites-php-mysql-use-webmatrix/).
* [WebMatrix 3: Integrated Git and Deployment to Azure](http://www.codeproject.com/Articles/577581/Webmatrixplus3-3aplusIntegratedplusGitplusandplusD). How to use WebMatrix to deploy from a Git source control repository.








##<a name="ftp"></a>Deploying by using an FTP utility

Regardless of what IDE you use, you can also deploy content to your site by using [FTP](http://en.wikipedia.org/wiki/File_Transfer_Protocol) to copy files. It's easy to create FTP credentials for a Windows Azure Web Site, and you can use them in any application that works with FTP, including browsers such as Internet Explorer and full-featured free utilities such as [FileZilla](https://filezilla-project.org/).  Windows Azure Web Sites also support the more secure FTPS protocol. 

Although it's easy to copy your web site's files to Windows Azure using FTP utilities, they don't automatically take care of or coordinate related deployment tasks such as deploying a database or changing connection strings. Also, many FTP tools don't compare source and destination files in order to skip copying files that haven't changed. For large sites, always copying all files can result in long deployment times even for minor updates since all files are always copied.

For more information, see the following resource:

* [Create a PHP-MySQL Windows Azure Web Site and Deploy Using FTP](/en-us/documentation/articles/web-sites-php-mysql-deploy-use-ftp/). 
* [How to Manage Web Sites](http://www.windowsazure.com/en-us/documentation/articles/web-sites-manage/). Includes additional information no included in the PHP tutorial about how to set FTP credentials. See the comments at the bottom of the page for information missing in the document itself about how to get the credentials.








##<a name="onpremises"></a>Deploying from an on-premises source control system

If you are using TFS, Git, or Mercurial in an on-premises (not cloud-hosted) repository, you can deploy directly from your repository to Windows Azure Web Sites.

###<a name="tfs"></a>Team Foundation Server (TFS)

Team Foundation Server is Microsoft's on-premises solution for source control and team collaboration. You can set up TFS to do continuous delivery to a Windows Azure Web Site.

For more information, see the following resource:

* [Continuous Delivery for Cloud Services in Windows Azure](/en-us/develop/net/common-tasks/continuous-delivery/). This document is for a Windows Azure Cloud Service, but some of its content is relevant to Web Sites.

###<a name="gitmercurial"></a>On-premises Git or Mercurial repositories

In Windows Azure you can enter the URL of any repository that uses Git or Mercurial in order to deploy from that location. You can also directly push from a local Git repository to a Windows Azure Web Site. 

For more information, see the following resource:

* [Publishing from Source Control to Windows Azure Web Sites](/en-us/documentation/articles/web-sites-publish-source-control/). How to use Git to publish directly from your local computer to a Windows Azure Web Site (in Windows Azure, this method of publishing is called Local Git). Also shows how to enable continuous deployment of Git repositories from GitHub, CodePlex, or BitBucket.
* [Publishing to Azure Web Sites from any git/hg repo](http://blog.davidebbo.com/2013/04/publishing-to-azure-web-sites-from-any.html). Blog by David Ebbo that explains the "External Repository" feature in Windows Azure Web Sites.
* [Windows Azure Forum for Git, Mercurial, and DropBox](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/home?forum=azuregit).











##<a name="commandline"></a> Using command-line tools and the Windows Azure REST management API

It's always best to automate your development workflow, but if you can't do that directly in your source control system, you can set it up manually by using command-line tools. This generally involves the use of more than one tool or framework, as deployment often involves performing site management functions as well as copying content.

Windows Azure simplifies site management tasks that you might have to do for deployment by providing a REST management API and several frameworks that make it easier to work with the API.

###<a name=msbuild></a>MSBuild

If you use the [Visual Studio IDE](#vs) for development, you can use [MSBuild](http://msbuildbook.com/) to automate anything you can do in your IDE. You can configure MSBuild to use either [Web Deploy](#webdeploy) or [FTP/FTPS](#ftp) to copy files. Web Deploy can also automate many other deployment-related tasks, such as deploying databases.

For more information about command-line deployment using MSBuild, see the following resources:

* [ASP.NET Web Deployment using Visual Studio: Command Line Deployment](http://www.asp.net/mvc/tutorials/deployment/visual-studio-web-deployment/command-line-deployment). Tenth in a series of tutorials about deployment to Windows Azure using Visual Studio. Shows how to use the command line to deploy after setting up publish profiles in Visual Studio.
* [Inside the Microsoft Build Engine: Using MSBuild and Team Foundation Build](http://msbuildbook.com/). Hard-copy book that includes chapters on how to use MSBuild for deployment.

###<a name="ftp2"></a>FTP scripts

It's easy to create [FTP/FTPS](http://en.wikipedia.org/wiki/File_Transfer_Protocol) credentials for a Windows Azure Web Site, and you can then use those credentials with FTP batch scripts.

For more information, see the following resource:

* [Using FTP Batch Scripts](http://support.microsoft.com/kb/96269).

###<a name="powershell"></a>Windows PowerShell

You can perform MSBuild or FTP functions from [Windows PowerShell](http://msdn.microsoft.com/en-us/library/dd835506.aspx). If you do that, you can also use a collection of Windows PowerShell cmdlets that make the Windows Azure REST management API easy to call.

For more information, see the following resource:

* [Building Real-World Cloud Apps with Windows Azure - Automate Everything](http://asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/automate-everything). E-book chapter that explains how the sample application shown in the e-book uses Windows PowerShell scripts to create a Windows Azure test environment and deploy to it. See the [Resources](http://asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/automate-everything#resources) section for links to additional Windows Azure PowerShell documentation.

###<a name="api"></a>.NET management API

You can write C# code to perform MSBuild or FTP functions for deployment. If you do that, you can access the Windows Azure management REST API to perform site management functions.

For more information, see the following resource:

* [Automating everything with the Windows Azure Management Libraries and .NET](http://www.hanselman.com/blog/PennyPinchingInTheCloudAutomatingEverythingWithTheWindowsAzureManagementLibrariesAndNET.aspx). Introduction to the .NET management API and links to more documentation.

###<a name="cli"></a>Cross-platform command line (xpat-cli)

You can use the command line in Mac or Linux machines to deploy by using FTP. If you do that, you can also access the Windows Azure REST management API using the Windows Azure cross-platform command-line interface (xpat-cli). The xpat-cli can also be used on Windows machines.

For more information, see the following resource:

* [Command line tools](/en-us/downloads/#cmd-line-tools). Portal page in WindowsAzure.com for command line tool information.

###<a name="webdeploy"></a>Web Deploy command line

[Web Deploy](http://www.iis.net/downloads/microsoft/web-deploy) is Microsoft software for deployment to IIS that not only provides intelligent file sync features but also can perform or coordinate many other deployment-related tasks that can't be automated when you use FTP. For example, Web Deploy can deploy a new database or database updates along with your web site. Web Deploy can also minimize the time required to update an existing site since it can intelligently copy only changed files. Microsoft WebMatrix, Visual Studio, Visual Studio Online, and Team Foundation Server have support for Web Deploy built-in, but you can also use Web Deploy directly from the command line to automate deployment. Web Deploy commands are very powerful but the learning curve can be steep.

For more information, see the following resource:

* [Web Deployment Tool](http://technet.microsoft.com/en-us/library/dd568996(v=ws.10).aspx). Official documentation on the Microsoft TechNet site. Dated but still a good place to start.
* [Using Web Deploy](http://www.iis.net/learn/publish/using-web-deploy). Official documentation on the Microsoft IIS.NET site. Also dated but a good place to start.
* [StackOverflow](www.stackoverflow.com). The best place to go for more current information about how to use Web Deploy from the command line.
* [ASP.NET Web Deployment using Visual Studio: Command Line Deployment](http://www.asp.net/mvc/tutorials/deployment/visual-studio-web-deployment/command-line-deployment). MSBuild is the build engine used by Visual Studio, and it can also be used from the command line to deploy web applications to Windows Azure Web Sites. This tutorial is part of a series that is mainly about Visual Studio deployment.








##<a name="nextsteps"></a>Next Steps
For more information, see the Deploy section in [Windows Azure Web Sites Documentation](/en-us/documentation/services/web-sites/).
