<properties pageTitle="What is the Azure .NET SDK" metaKeywords="azure .net sdk" description="Learn what is included in the Azure .NET SDK." documentationCenter=".NET" title="What is the Azure .NET SDK" authors="tdykstra" solutions="" manager="wpickett" editor="mollybos" />

# What is the Azure .NET SDK?

The Azure .NET SDK is a collection of Visual Studio tools, command-line tools, and runtime binaries that facilitate developing, testing, and deploying apps that run in Azure. This article details what you get in the SDK.

You can download the SDK from the [Azure Downloads page](/en-us/downloads/). 

## Table of contents

- [What is included in the Azure .NET SDK](#included)
- [What isn't included in the SDK](#notincluded)
- [FAQ](#faq)
- [Resources](#resources)

##<a id="included"></a>What is included in the Azure .NET SDK

The Azure .NET SDK installs the following products:

- [Visual Studio Express for Web](#vwd)
- [Microsoft ASP.NET and Web Tools for Visual Studio](#wte)
- [Microsoft Azure Tools for Microsoft Visual Studio](#tools)
- [Microsoft Azure Authoring Tools](#auth)
- [Microsoft Azure Emulator](#emulator)
- [Microsoft Azure Storage Emulator](#stgemulator)
- [Microsoft Azure Storage Tools](#stgtools)
- [Microsoft Azure Libraries for .NET](#libraries)
- [LightSwitch Azure Publishing add-on for Visual Studio](#ls)

###<a id="vwd"></a>Visual Studio Express for Web

If you don't have Visual Studio on your computer, the SDK will install [Visual Studio Express for Web](http://www.visualstudio.com/en-us/products/visual-studio-express-vs.aspx). 
 
###<a id="wte"></a>Microsoft ASP.NET and Web Tools for Visual Studio

This mainly enables you to work with Azure Websites:

* [Publish web projects to Azure Websites](../web-sites-dotnet-get-started/).
* [Publish console application projects to Azure WebJobs](../websites-dotnet-deploy-webjobs/).
* [Create Azure Website and SQL Database resources while creating a new web project or while publishing a web project](../web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database/).
* [Create PowerShell deployment scripts while creating new Websites](http://msdn.microsoft.com/en-us/library/dn642480.aspx).
* [Manage Azure Websites in Server Explorer](../web-sites-dotnet-troubleshoot-visual-studio/#sitemanagement).
* [Run in debug mode remotely for Websites and WebJobs](../web-sites-dotnet-troubleshoot-visual-studio/#remotedebug). 

You don't have to install the Azure .NET SDK to use these features; they are also included in Visual Studio Updates. 

###<a id="tools"></a>Microsoft Azure Tools for Microsoft Visual Studio

This mainly enables you to work with Azure Cloud Services and Virtual Machines:

* [Create, open, and publish cloud service projects](../cloud-services-dotnet-get-started/).
* [Create deployment packages for cloud service projects](http://msdn.microsoft.com/en-us/library/ff683672.aspx).
* [Create Azure Virtual Machines while creating new web projects](../virtual-machines-dotnet-create-visual-studio-powershell/).
* [Create PowerShell scripts while creating new virtual machines](http://msdn.microsoft.com/en-us/library/dn642480.aspx).
* [View and manage cloud service project settings in Visual Studio Project Properties windows](http://msdn.microsoft.com/en-us/library/ee405486.aspx).
* View and manage [cloud services](http://msdn.microsoft.com/en-us/library/ff683675.aspx), [virtual machines](http://msdn.microsoft.com/en-us/library/jj131259.aspx), and [Service Bus](http://msdn.microsoft.com/en-us/library/jj149828.aspx) in Server Explorer. 
* [Run in debug mode remotely for cloud services and virtual machines](http://msdn.microsoft.com/en-us/library/ff683670.aspx).

###<a id="auth"></a>Microsoft Azure Authoring Tools

This includes the following:

* The [CSPack command-line tool](http://msdn.microsoft.com/en-us/library/gg432988.aspx) for creating deployment packages.
* the [CSEncrypt command-line tool](http://msdn.microsoft.com/en-us/library/hh404001.aspx) for encrypting passwords that are used to access cloud service role instances through a remote desktop connection.
* Runtime binaries that cloud service projects require for communicating with their runtime environment and for diagnostics. These binaries are not available in NuGet packages.

###<a id="emulator"></a>Microsoft Azure Emulator

The [Azure Emulator](http://msdn.microsoft.com/en-us/library/dn339018.aspx) simulates the cloud service environment so that you can test cloud service projects locally.

###<a id="stgemulator"></a>Microsoft Azure Storage Emulator

The [Azure Storage Emulator](http://msdn.microsoft.com/en-us/library/hh403989.aspx) uses a LocalDB database to simulate Azure Storage (queues, tables, blobs), so that you can test locally. 

###<a id="stgtools"></a>Microsoft Azure Storage Tools

This installs [AzCopy](http://aka.ms/AzCopy), a command line tool for transferring data into and out of an Azure Storage account.

###<a id="libraries"></a>Microsoft Azure Libraries for .NET

This includes the following:

* NuGet packages for Azure Storage, Service Bus, and Caching that are stored on your computer so that Visual Studio can create new cloud service projects while offline.
* A Visual Studio plug-in that enables [In-Role Cache](http://msdn.microsoft.com/en-us/library/dn386103.aspx) projects to run locally in Visual Studio. 

###<a id="ls"></a>LightSwitch Azure Publishing add-on for Visual Studio

This enables you to [publish LightSwitch projects to Azure Websites](http://msdn.microsoft.com/en-us/library/jj131261.aspx). The LightSwitch add-on is included in Visual Studio Updates as well as the Azure SDK. Installing the Azure SDK ensures that you have the latest version of the add-on. 

##<a id="notincluded"></a>What isn't included in the SDK

There are a few things that you might want for Azure development that aren't included in the .NET SDK. The most important of these are the following:

* [Azure PowerShell](../install-configure-powershell/). 

	Azure PowerShell enables you to [automate Azure environment creation and deployment](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/automate-everything).

* [Updated client libraries](http://www.nuget.org/packages?q=windowsazureofficial). 

	The Azure .NET SDK copies to your computer the NuGet packages for some Azure client libraries, such as Storage, Service Bus, and Caching. These client libraries are automatically included in new cloud service projects, so the local NuGet packages enable Visual Studio to create cloud service projects while you're not connected to the Internet.

	Client libraries are generally updated more frequently than new Azure SDK versions are released, so the client libraries at NuGet.org are generally more current than what you get with the SDK. After creating a project that includes client libraries by default, it's a good practice to update the NuGet packages.

	Only [Azure Cloud Service](../cloud-services-dotnet-get-started/) and [Azure Mobile Service](../mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/) project templates automatically include some client libraries. If you need a client library in another project type, such as [ASP.NET Web Application](../web-sites-dotnet-get-started/) or [Microsoft Azure WebJob](../websites-dotnet-deploy-webjobs/), install the NuGet packages you need from [NuGet.org](http://www.nuget.org/packages?q=windowsazureofficial). You can also find the source code for many client libraries at [GitHub.com/Azure](https://github.com/azure/) and links to reference documentation at [Azure .NET Reference](/en-us/develop/net/reference/).

##<a id="faq"></a>Frequently Asked Questions

- [Many Azure features are already in Visual Studio. Do I need to install the Azure SDK?](#azinvs)
- [I want a client library. Do I need to install the Azure SDK to get it?](#clientlib)

###<a id="azinvs"></a>Many Azure features are already in Visual Studio. Do I need to install the Azure SDK?

In general it's a good practice to install the SDK if you want to develop for Azure using the latest tools. If you want to avoid installing the SDK, you can do so if the following conditions are true:

* You have installed the latest [Visual Studio Update](http://go.microsoft.com/fwlink/?LinkId=272487).
* You are developing only for Azure Websites or Mobile Services, not for Cloud services or Virtual Machines.
* Your application doesn't use Storage, or it uses Storage but you don't need the Storage Emulator or the AzCopy tool.

###<a id="clientlib1"></a>I want a client library. Do I need to install the Azure SDK to get it?

The SDK installs client libraries only to facilitate offline cloud service project creation. Current client libraries are available in NuGet packages at [NuGet.org](http://www.nuget.org/packages?q=windowsazureofficial). For more information, see [What isn't included in the SDK](#notincluded) earlier in this document.

##<a id="resources"></a>Resources

To download the Azure SDK or a client library, see the [Azure Downloads page](/en-us/downloads/).

For Azure SDK and client library source code, see [GitHub.com/Azure](https://github.com/azure/).

For Azure client library reference documentation, see [Azure .NET Reference](/en-us/develop/net/reference/). 

