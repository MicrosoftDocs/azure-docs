<properties
	pageTitle="Deploy your app to Azure App Service"
	description="Learn how to deploy your app to Azure App Service."
	services="app-service"
	documentationCenter=""
	authors="cephalin"
	manager="wpickett"
	editor="mollybos"/>

<tags
	ms.service="app-service"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/07/2016"
	ms.author="cephalin;tdykstra"/>
    
# Deploy your app to Azure App Service

This article helps you determine the best option to deploy the files for your web app, mobile app backend, or API app to 
[Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714), and then direct you to appropriate articles and 
blogs with how-to instructions specific to your preferred option.

## <a name="overview"></a>Overview of deployment processes

As soon as you create or provision an app in Azure App Service, before you deploy any code to it, Azure App Service maintains the
application framework for you (ASP.NET, PHP, Node.js, etc). Some frameworks are enabled by default
while others, like Java and Python, may need a simple checkmark configuration to enable it. In addition, you can customize your
application framework, such as the PHP version or the bitness of your runtime. For more information, see 
[Configure your app in Azure App Service](web-sites-configure.md).

Since you don't have to worry about the web server or application framework, deploying your app to App Service is 
a matter of deploying your code, binaries, content files, and their respective directory structure, to the 
[**/site/wwwroot** directory in Azure](https://github.com/projectkudu/kudu/wiki/File-structure-on-azure) (or the **/Data/Jobs** directory 
for WebJobs). App Service supports the following three deployment processes. 

- [FTP or FTPS](https://en.wikipedia.org/wiki/File_Transfer_Protocol): Use your favorite FTP or FTPS enabled tool to move your 
files to Azure, from [FileZilla](https://filezilla-project.org) to full-featured IDEs like [NetBeans](https://netbeans.org). This is strictly
a file upload process. No additional services are provided by App Service, such as version control, file structure management, etc. 
- [Kudu (Git/Mercurial)](https://github.com/projectkudu/kudu/wiki/Deployment): The [deployment engine](https://github.com/projectkudu/kudu/wiki) 
in App Service. Push your code to Kudu directly from any repository. Kudu also provides added services whenever code is 
pushed to it, including version control, package restore, MSBuild, and [web hooks](https://github.com/projectkudu/kudu/wiki/Web-hooks) 
for continuous deployment and other automation tasks. All these services are customizable and triggered 
    - every time **git push** is executed from a configured Git repository,
	- every time **hg push** is executed from a configured Mercurial repository, or 
    - every time a linked cloud storage like Dropbox or OneDrive is synced with App Service. 
- [Web Deploy](http://www.iis.net/learn/publish/using-web-deploy/introduction-to-web-deploy): The same tooling that automates deployment 
to IIS servers. Deploy code to App Service directly from your favorite Microsoft tools, 
such as Visual Studio, WebMatrix, and Visual Studio Team Services. This tool supports diff-only deployment, database creation, transforms of 
connection strings, etc. Web Deploy differs from Kudu in that application binaries are built before they are deployed to Azure. 
Similar to FTP, no additional services are provided by App Service.

Popular web development tools support one or more of these deployment processes. While the tool you choose determines the deployment 
processes you can leverage, the actual DevOps functionality at your disposal depends on the combination of the deployment process and the 
specific tools you choose. For example, if you perform Web Deploy from [Visual Studio with Azure SDK](#vspros), even though you don't get automation 
from Kudu, you do get package restore and MSBuild automation in Visual Studio. Azure SDK also provides an easy-to-use wizard to 
help you create the Azure resources you need directly within the Visual Studio interface.

>[AZURE.NOTE] These deployment processes don't actually [provision the Azure resources](resource-group-portal) that your app may need, such as 
App Service plan, App Service app, and SQL database. However, most of the linked how-to articles show you how to provision the app AND deploy 
your code to it end-to-end. You can also find additional options for provisioning Azure resources in the 
[Automate deployment by using command-line tools](#automate) section.

## <a name="ftp"></a>Deploy by copying files to Azure manually
If you are used to manually copying your web content to web hosters, a common workflow for PHP developers, you can use 
an [FTP](http://en.wikipedia.org/wiki/File_Transfer_Protocol) utility to copy files, such as Windows Explorer or 
[FileZilla](https://filezilla-project.org/).

Copying files manually utilizes the FTP protocol for deployment (see [Overview of deployment processes](#overview)).

The pros of copying files manually are:

- Familiarity of FTP tooling. 
- You know exactly where your files are going.
- Added security with FTPS.
- Good deployment solution if you like minimal tool for web development (e.g. develop web apps using NotePad).

The cons of copying files manually are:

- You are responsible for deploying files to the correct directories in App Service.
- No version control for rollback when failures occur.
- Many FTP tools don't provide diff-only copying and simply copy all the files. For large apps, this leads to long deployment times even for 
minor updates.

### <a name="howtoftp"></a>How to deploy by copying files to Azure manually
Copying files to Azure involves a few simple steps:

1. Create deployment credentials for your app in the [Azure Portal](https://portal.azure.com). To do this, in your app's blade, 
click **Settings** > **Deployment Credentials**.
2. After you have configured deployment credentials, obtain the FTP connection information by going to **Settings** > **Properties**, and then
copying the values for **FTP/Development User**, **FTP Host Name**, and **FTPS Host Name**.
3. From your FTP client, use the connection information you gathered to connect to your app.
4. Copy your files and their respective directory structure to the 
[**/site/wwwroot** directory in Azure](https://github.com/projectkudu/kudu/wiki/File-structure-on-azure) (or the **/Data/Jobs** directory 
for WebJobs).
5. Browse to your app's URL to verify the app is running properly. 

For more information, see the following resources:

* [Create a PHP-MySQL web app and deploy using FTP](web-sites-php-mysql-deploy-use-ftp.md).
* [Using FTP Batch Scripts](http://support.microsoft.com/kb/96269).

## <a name="dropbox"></a>Deploy by syncing with a cloud folder
A good alternative to [copying files manually](#ftp) is syncing files and folders to App Service from a cloud storage service
like OneDrive and Dropbox. In the [Azure Portal](https://portal.azure.com), you can configure a special folder in your cloud storage, 
work with your app code and content in that folder, and sync to App Service with the click of a button.

Syncing with a cloud folder utilizes the Kudu process for deployment (see [Overview of deployment processes](#overview)).

The pros of syncing with a cloud folder are:

- Simplicity of deployment. Services like OneDrive and Dropbox provide desktop sync clients, so your local working
directory is also your deployment directory.
- One-click deployment.
- All functionality in Kudu is available (e.g. deployment versioning, rollback, package restore, automation).
- Good deployment solution if you like minimal tool for web development.

The cons of syncing with a cloud folder are:

- Not a good solution for a team project.

### <a name="howtodropbox"></a>How to deploy by syncing with a cloud folder
 
* [Deploy To Web Apps from Dropbox](http://blogs.msdn.com/b/windowsazure/archive/2013/03/19/new-deploy-to-windows-azure-web-sites-from-dropbox.aspx). 
How to use the [Azure Portal](https://portal.azure.com) to set up Dropbox deployment.
* [Dropbox Deployment to Web Apps](http://channel9.msdn.com/Series/Windows-Azure-Web-Sites-Tutorials/Dropbox-Deployment-to-Windows-Azure-Web-Sites). 
This video walks through the process of connecting a Dropbox folder to a web app and shows how quickly you can get a web app up and running or 
maintain it using simple drag-and-drop deployment.
* [Azure Forum for Git, Mercurial, and Dropbox](http://social.msdn.microsoft.com/Forums/windowsazure/home?forum=azuregit).

## Deploy using an IDE
If you are already using [Visual Studio](https://www.visualstudio.com/products/visual-studio-community-vs.aspx) 
with an [Azure SDK](https://azure.microsoft.com/downloads/) or WebMatrix, or other IDE suites like [Xcode](https://developer.apple.com/xcode/) 
and [Eclipse](https://www.eclipse.org), you can deploy to Azure directly from within your IDE. This option is ideal for an individual developer.

Visual Studio supports all three deployment processes (FTP, Git, and Web Deploy), depending on your preference, while other IDEs can 
deploy to App Service if they have FTP or Git integration (see [Overview of deployment processes](#overview)).

The pros of deploying using an IDE are:

- Potentially minimize the tooling for your end-to-end application life-cycle. Develop, debug, track, and deploy your app to Azure all 
without moving outside of your IDE. 

The cons of deploying using an IDE are:

- Added complexity in tooling.
- Still requires a source control system for a team project.

<a name="vspros"></a>
Additional pros of deploying using Visual Studio with Azure SDK are:

- Azure SDK makes Azure resources first-class citizens in Visual Studio. Create, delete, edit, start, and stop apps, 
query the backend SQL database, live-debug the Azure app, and much more. 
- Live editing of code files on Azure.
- Live debugging of apps on Azure.
- Integrated Azure explorer.
- Diff-only deployment. 

###<a name="vs"></a>How to deploy from Visual Studio directly

* [Get started with Azure and ASP.NET](web-sites-dotnet-get-started.md). How to create and deploy a simple ASP.NET MVC web project by 
using Visual Studio and Web Deploy.
* [How to Deploy Azure WebJobs using Visual Studio](websites-dotnet-deploy-webjobs.md). How to configure Console Application projects 
so that they deploy as WebJobs.  
* [Deploy a Secure ASP.NET MVC 5 app with Membership, OAuth, and SQL Database to Web Apps](web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database.md). 
How to create and deploy an ASP.NET MVC web project with a SQL database, by using Visual Studio, Web Deploy, and Entity Framework Code 
First Migrations.
* [Web Deployment Overview for Visual Studio and ASP.NET](http://msdn.microsoft.com/library/dd394698.aspx). A basic introduction to web 
deployment using Visual Studio. Dated but includes information that is still relevant, including an overview of options for deploying 
a database along with the web application and a list of additional deployment tasks you might have to do or manually configure Visual 
Studio to do for you. This topic is about deployment in general, not just about deployment to Web Apps.
* [ASP.NET Web Deployment using Visual Studio](http://www.asp.net/mvc/tutorials/deployment/visual-studio-web-deployment/introduction). 
A 12-part tutorial series that covers a more complete range of deployment tasks than the others in this list. Some Azure deployment 
features have been added since the tutorial was written, but notes added later explain what's missing.
* [Deploying an ASP.NET Website to Azure in Visual Studio 2012 from a Git Repository directly](http://www.dotnetcurry.com/ShowArticle.aspx?ID=881). 
Explains how to deploy an ASP.NET web project in Visual Studio, using the Git plug-in to commit the code to Git and connecting Azure to 
the Git repository. Starting in Visual Studio 2013, Git support is built-in and doesn't require installation of a plug-in.

###<a name="webmatrix"></a>How to deploy from WebMatrix directly

* [Build and deploy a Node.js web site to Azure using WebMatrix](web-sites-nodejs-use-webmatrix.md).
* [WebMatrix 3: Integrated Git and Deployment to Azure](http://www.codeproject.com/Articles/577581/Webmatrixplus3-3aplusIntegratedplusGitplusandplusD). 
How to use WebMatrix to deploy from a Git source control repository.

## <a name="onprem"></a>Deploy from an on-premises source control system

If you work on a development team of any size and uses an on-premises source code management (SCM) system like 
[Team Foundation Server](https://www.visualstudio.com/products/tfs-overview-vs.aspx) (TFS), 
[Git](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/source-control#gittfs), 
or [Mercurial](http://mercurial.selenic.com/), you can configure App Service to integrate with your repository and deploy
directly to App Service in your source control workflow. If you use TFS, you can also configure it to deploy continuously 
to App Service.   

TFS uses Web Deploy to deploy to App Service, while deployment from Git/Mercurial repositories uses Kudu (see [Overview of deployment processes](#overview)).

Pros of deploying from an on-premises source control system are:

- Support for deployment from any language framework or Git or Mercurial client, including [Xcode](https://developer.apple.com/xcode/) 
and [Eclipse](https://www.eclipse.org).
- Branch-specific deployment, can deploy different versions to separate [slots](web-sites-staged-publishing).
- Good for development teams of any size.

Cons of deploying from an on-premises source control system are:

- Need knowledge of SCM system of choice.
- May provide more functionality and features than you need.
- Lack of turn-key solutions for continuous deployment and branch-specific deployment from Git and Mercurial client tools. 

Additional pros of deploying using TFS are:

- Continuous integration (CI) for builds, tests, and deployment.
- Built-in collaboration tools that work with your existing IDE or editor.
- Support for Git for distributed version control or Team Foundation version control (TFVC) for centralized version control. 
- Rich tools for agile deployment.
- Ready-made integrations for [Jenkins](https://jenkins-ci.org), [Slack](https://slack.com), [ZenDesk](https://www.zendesk.com), 
[Trello](https://trello.com), [Azure Service Bus](/services/service-bus/), and much more. 
- [Team Foundation Server Express](https://www.microsoft.com/download/details.aspx?id=48259) is free for a team of up to 5 developers.

###<a name="tfs"></a>How to deploy continuously with TFS

* [Continuous Delivery for Cloud Services in Azure](../cloud-services/cloud-services-dotnet-continuous-delivery.md). This document is for an Azure Cloud 
Service, but some of its content is relevant to Web Apps.

###<a name="gitmercurial"></a>How to deploy from an on-premises Git or Mercurial repository

* [Publishing from Source Control to Web Apps with Git](web-sites-publish-source-control.md). How to use Git to publish directly from your 
local computer to a web app (in Azure, this method of publishing is called Local Git). Also shows how to enable continuous deployment of 
Git repositories from GitHub, CodePlex, or BitBucket.
* [Publishing to Web Apps from any git/hg repo](http://blog.davidebbo.com/2013/04/publishing-to-azure-web-sites-from-any.html). Blog that 
explains the "External Repository" feature in Web Apps.
* [Azure Forum for Git, Mercurial, and Dropbox](http://social.msdn.microsoft.com/Forums/windowsazure/home?forum=azuregit).
* [Deploying TWO websites to Azure from one Git Repository](http://www.hanselman.com/blog/DeployingTWOWebsitesToWindowsAzureFromOneGitRepository.aspx). 
Blog post by Scott Hanselman.

## Deploy from a cloud-based source control service
If you work on a development team of any size and uses a cloud-based source code management (SCM) service like 
[Visual Studio Team Services](http://www.visualstudio.com/) (formerly Visual Studio Online), 
[GitHub](https://www.github.com), [GitLab](https://gitlab.com), [BitBucket](https://bitbucket.org/), 
[CodePlex](https://www.codeplex.com/), [Codebase](https://www.codebasehq.com), and [Kiln](https://www.fogcreek.com/kiln/),
you can configure App Service to integrate with your repository and deploy continuously. 

Visual Studio Team Services uses Web Deploy to deploy to App Service, while deployment from online repositories uses
Kudu (see [Overview of deployment processes](#overview)).

Pros of deploying from a cloud-based source control service are:

- Support for any language framework.
- Configuration-less continuous deployment for Git and Mercurial repositories. 
- Branch-specific deployment, can deploy different branches to different [slots](web-sites-staged-publishing).
- Good for development teams of any size.

Cons of deploying from a cloud-based source control service are:

- Need knowledge of SCM service of choice.
- May provide more functionality and features than you need.

Additional pros of deploying using Visual Studio Team Services are:

- Free for a team of up to 5 developers
- Continuous integration (CI) for builds, tests, and deployment.
- Built-in collaboration tools that work with your existing IDE or editor.
- Support for Git for distributed version control or Team Foundation version control (TFVC) for centralized version control. 
- Rich tools for agile deployment.
- Ready-made integrations for [Jenkins](https://jenkins-ci.org), [Slack](https://slack.com), [ZenDesk](https://www.zendesk.com), 
[Trello](https://trello.com), [Azure Service Bus](/services/service-bus/), and much more. 
- Rich dashboards for easy reporting with [connection to Power BI](https://www.visualstudio.com/get-started/report/report-on-vso-with-power-bi-vs).

###<a name="vsts"></a>How to deploy continuously with Visual Studio Team Services

- [Continuous delivery to Azure using Visual Studio Team Services and TFVC](../cloud-services/cloud-services-continuous-delivery-use-vso.md). Step-by-step 
tutorial that shows how to set up continuous delivery from Visual Studio Team Services to a web app, using TFVC. 
- [Continuous delivery to Azure using Visual Studio Team Services and Git](../cloud-services/cloud-services-continuous-delivery-use-vso-git.md). Similar to 
the previous tutorial but uses Git instead of TFVC.

###<a name="cloudgitmercurial"></a>How to deploy from a cloud-based Git or Mercurial repository

- [Publishing from Source Control to Web Apps with Git](web-sites-publish-source-control.md). How to enable continuous 
deployment of repositories from GitHub, CodePlex, or BitBucket. Although this tutorial shows how to publish a Git repository, 
the process for Mercurial repositories hosted in CodePlex or BitBucket is similar.
- [Deploying to Web Apps with GitHub using Kudu](https://azure.microsoft.com/documentation/videos/deploying-to-azure-from-github/). Video by Scott 
Hanselman and David Ebbo that shows how to deploy a web app directly from GitHub to App Service.
- [Deploy to Azure Button for Web Apps](https://azure.microsoft.com/blog/2014/11/13/deploy-to-azure-button-for-azure-websites-2/). Blog about a 
method for triggering deployment from a Git repository.
- [Azure Forum for Git, Mercurial, and Dropbox](http://social.msdn.microsoft.com/Forums/windowsazure/home?forum=azuregit).

For more information, see the following resources:

- [Publishing from Source Control to Web Apps with Git](web-sites-publish-source-control.md). How to use Git to publish directly from your local 
computer to Web Apps (in Azure, this method of publishing is called Local Git). 

## <a name="automate"></a>Automate deployment by using command-line tools

* [Automate deployment with MSBuild](#msbuild)
* [Copy files with FTP tools and scripts](#ftp)
* [Automate deployment with Windows PowerShell](#powershell)
* [Automate deployment with .NET management API](#api)
* [Deploy from Azure Command-Line Interface (Azure CLI)](#cli)
* [Deploy from Web Deploy command line](#webdeploy)
* [Using FTP Batch Scripts](http://support.microsoft.com/kb/96269).
 
Another deployment option is to use a cloud-based service such as [Octopus Deploy](http://en.wikipedia.org/wiki/Octopus_Deploy). For more information, see [Deploy ASP.NET applications to Azure Web Sites](https://octopusdeploy.com/blog/deploy-aspnet-applications-to-azure-websites).

###<a name="msbuild"></a>Automate deployment with MSBuild

If you use the [Visual Studio IDE](#vs) for development, you can use [MSBuild](http://msbuildbook.com/) to automate anything you can do in your IDE. You can configure MSBuild to use either [Web Deploy](#webdeploy) or [FTP/FTPS](#ftp) to copy files. Web Deploy can also automate many other deployment-related tasks, such as deploying databases.

For more information about command-line deployment using MSBuild, see the following resources:

* [ASP.NET Web Deployment using Visual Studio: Command Line Deployment](http://www.asp.net/mvc/tutorials/deployment/visual-studio-web-deployment/command-line-deployment). Tenth in a series of tutorials about deployment to Azure using Visual Studio. Shows how to use the command line to deploy after setting up publish profiles in Visual Studio.
* [Inside the Microsoft Build Engine: Using MSBuild and Team Foundation Build](http://msbuildbook.com/). Hard-copy book that includes chapters on how to use MSBuild for deployment.

###<a name="powershell"></a>Automate deployment with Windows PowerShell

You can perform MSBuild or FTP deployment functions from [Windows PowerShell](http://msdn.microsoft.com/library/dd835506.aspx). If you do that, you can also use a collection of Windows PowerShell cmdlets that make the Azure REST management API easy to call.

For more information, see the following resources:

* [Deploy a web app linked to a GitHub repository](app-service-web-arm-from-github-provision.md)
* [Provision a web app with a SQL Database](app-service-web-arm-with-sql-database-provision.md)
* [Provision and deploy microservices predictably in Azure](app-service-deploy-complex-application-predictably.md)
* [Building Real-World Cloud Apps with Azure - Automate Everything](http://asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/automate-everything). E-book chapter that explains how the sample application shown in the e-book uses Windows PowerShell scripts to create an Azure test environment and deploy to it. See the [Resources](http://asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/automate-everything#resources) section for links to additional Azure PowerShell documentation.
* [Using Windows PowerShell Scripts to Publish to Dev and Test Environments](http://msdn.microsoft.com/library/dn642480.aspx). How to use Windows PowerShell deployment scripts that Visual Studio generates.

###<a name="api"></a>Automate deployment with .NET management API

You can write C# code to perform MSBuild or FTP functions for deployment. If you do that, you can access the Azure management REST API to perform site management functions.

For more information, see the following resource:

* [Automating everything with the Azure Management Libraries and .NET](http://www.hanselman.com/blog/PennyPinchingInTheCloudAutomatingEverythingWithTheWindowsAzureManagementLibrariesAndNET.aspx). Introduction to the .NET management API and links to more documentation.

###<a name="cli"></a>Deploy from Azure Command-Line Interface (Azure CLI)

You can use the command line in Windows, Mac or Linux machines to deploy by using FTP. If you do that, you can also access the Azure REST management API using the Azure CLI.

For more information, see the following resource:

* [Azure Command line tools](/downloads/#cmd-line-tools). Portal page in Azure.com for command line tool information.

###<a name="webdeploy"></a>Deploy from Web Deploy command line

[Web Deploy](http://www.iis.net/downloads/microsoft/web-deploy) is Microsoft software for deployment to IIS that not only provides intelligent file sync features but also can perform or coordinate many other deployment-related tasks that can't be automated when you use FTP. For example, Web Deploy can deploy a new database or database updates along with your web app. Web Deploy can also minimize the time required to update an existing site since it can intelligently copy only changed files. Microsoft WebMatrix, Visual Studio, Visual Studio Team Services, and Team Foundation Server have support for Web Deploy built-in, but you can also use Web Deploy directly from the command line to automate deployment. Web Deploy commands are very powerful but the learning curve can be steep.

For more information, see the following resource:

* [Simple Web Apps: Deployment](https://azure.microsoft.com/blog/2014/07/28/simple-azure-websites-deployment/). Blog by David Ebbo about a tool he wrote to make it easier to use Web Deploy.
* [Web Deployment Tool](http://technet.microsoft.com/library/dd568996). Official documentation on the Microsoft TechNet site. Dated but still a good place to start.
* [Using Web Deploy](http://www.iis.net/learn/publish/using-web-deploy). Official documentation on the Microsoft IIS.NET site. Also dated but a good place to start.
* [StackOverflow](http://www.stackoverflow.com). The best place to go for more current information about how to use Web Deploy from the command line.
* [ASP.NET Web Deployment using Visual Studio: Command Line Deployment](http://www.asp.net/mvc/tutorials/deployment/visual-studio-web-deployment/command-line-deployment). MSBuild is the build engine used by Visual Studio, and it can also be used from the command line to deploy web applications to Web Apps. This tutorial is part of a series that is mainly about Visual Studio deployment.

##<a name="nextsteps"></a>Next Steps

In some scenarios you might want to be able to easily switch back and forth between a staging and a production version of your web app. For more information, see [Staged Deployment on Web Apps](web-sites-staged-publishing.md).

Having a backup and restore plan in place is an important part of any deployment workflow. For information about the Web Apps backup and restore feature, see [Web Apps Backups](web-sites-backup.md).  

For information about how to use Azure's Role-Based Access Control to manage access to Web Apps deployment, see [RBAC and Web App Publishing](https://azure.microsoft.com/blog/2015/01/05/rbac-and-azure-websites-publishing/).

For information about other deployment topics, see the Deploy section in [Web Apps Documentation](/documentation/services/web-sites/).

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
 
