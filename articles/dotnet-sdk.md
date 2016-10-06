<properties 
	pageTitle="What is the Azure .NET SDK" 
	description="Learn what is included in the Azure .NET SDK." 
	documentationCenter=".net" 
	authors="tdykstra" 
	manager="wpickett" 
	editor="mollybos" 
	services=""/>

<tags 
	ms.service="multiple" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="06/30/2016" 
	ms.author="rachelap"/>

# What is the Azure SDK for .NET?

## Overview

The Azure SDK for .NET is a set of Visual Studio tools, command-line tools, runtime binaries, and client libraries that help you develop, test, and deploy apps that run in Azure. This article details what you get when you install the SDK. You can download the SDK from the [Azure Downloads page](https://azure.microsoft.com/downloads/). 

The Azure SDK for .NET also comprises [client libraries for consuming Azure services](http://go.microsoft.com/fwlink/?LinkId=510472). These libraries are installed separately using NuGet.

##<a id="included"></a>What's included in the Azure SDK for .NET

The Azure SDK for .NET installs the following products:

- [Visual Studio Community Edition 2015](#vwd)
- [Microsoft Azure Storage Emulator](#stgemulator)
- [Microsoft Azure Storage Tools](#stgtools)
- [Microsoft Azure Authoring Tools](#auth)
- [Microsoft Azure Emulator](#emulator)
- [HDInsight Tools for Visual Studio and Microsoft Hive ODBC Driver](#hdinsight)
- [Microsoft Azure Libraries for .NET](#libraries)
- [Microsoft Azure Mobile App SDK](#mobile)
- [Microsoft Azure PowerShell](#ps)
- [Microsoft Azure Tools for Microsoft Visual Studio](#tools)
- [Microsoft ASP.NET and Web Tools for Visual Studio](#wte)
- [Microsoft Azure Data Lake Tools for Visual Studio](#datalake)

###<a id="vwd"></a>Visual Studio Community Edition 2015

If you don't have Visual Studio on your computer, the SDK will install [Visual Studio Community Edition 2015](https://www.visualstudio.com/products/visual-studio-community-vs). 

###<a id="stgemulator"></a>Microsoft Azure Storage Emulator

The [Azure Storage Emulator](http://msdn.microsoft.com/library/hh403989.aspx) uses a SQL Server instance and the local file system to simulate Azure Storage (queues, tables, blobs), so that you can test locally. 

###<a id="stgtools"></a>Microsoft Azure Storage Tools

This installs [AzCopy](http://aka.ms/AzCopy), a command-line tool you can use to transfer data into and out of an Azure Storage account.

###<a id="auth"></a>Microsoft Azure Authoring Tools

This includes the following:

* The [CSPack command-line tool](http://msdn.microsoft.com/library/gg432988.aspx) for creating deployment packages.
* the [CSEncrypt command-line tool](http://msdn.microsoft.com/library/hh404001.aspx) for encrypting passwords that are used to access cloud service role instances through a remote desktop connection.
* Runtime binaries that cloud service projects require for communicating with their runtime environment and for diagnostics. These binaries are not available in NuGet packages.

###<a id="emulator"></a>Microsoft Azure Emulator

The [Azure Emulator](http://msdn.microsoft.com/library/dn339018.aspx) simulates the cloud service environment so that you can test cloud service projects locally on your computer before you deploy them to Azure.

###<a id="hdinsight"></a>HDInsight Tools for Visual Studio, and Microsoft Hive ODBC Driver

HDInsight tools in Server Explorer enable you to navigate Hive databases and linked storage accounts for HDInsight clusters, create tables, and create and submit Hive queries. For more information, see [Get started using HDInsight Hadoop Tools for Visual Studio](hdinsight/hdinsight-hadoop-visual-studio-tools-get-started.md).

###<a id="libraries"></a>Microsoft Azure Libraries for .NET

This includes the following:

* NuGet packages for Azure Storage, Service Bus, and Caching that are stored on your computer so that Visual Studio can create new cloud service projects while offline.
* A Visual Studio plug-in that enables [In-Role Cache](http://msdn.microsoft.com/library/dn386103.aspx) projects to run locally in Visual Studio. 

###<a id="mobile"></a>Microsoft Azure Mobile App SDK

Tools for working with [Azure App Service Mobile Apps](app-service-mobile/app-service-mobile-value-prop.md).

###<a id="ps"></a>Microsoft Azure PowerShell

Azure PowerShell enables you to [automate Azure environment creation and deployment](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/automate-everything).

###<a id="tools"></a>Microsoft Azure Tools for Microsoft Visual Studio

This enables you to work with Azure resources, primarily Cloud Services and Virtual Machines:

* [Create, open, and publish cloud service projects](cloud-services/cloud-services-dotnet-get-started.md).
* [Create deployment packages for cloud service projects](http://msdn.microsoft.com/library/ff683672.aspx).
* [Create Azure Virtual Machines while creating new web projects](virtual-machines/virtual-machines-windows-classic-web-app-visual-studio.md).
* [Create PowerShell scripts while creating new virtual machines](http://msdn.microsoft.com/library/dn642480.aspx).
* [View and manage cloud service project settings in Visual Studio Project Properties windows](http://msdn.microsoft.com/library/ee405486.aspx).
* View and manage [cloud services](http://msdn.microsoft.com/library/ff683675.aspx), [virtual machines](http://msdn.microsoft.com/library/jj131259.aspx), and [Service Bus](http://msdn.microsoft.com/library/jj149828.aspx) in Server Explorer. 
* [Run in debug mode remotely for cloud services and virtual machines](http://msdn.microsoft.com/library/ff683670.aspx).
* [Automate resource provisioning using Azure Resource Group Deployment Projects](https://msdn.microsoft.com/library/dn872471.aspx)

###<a id="wte"></a>Microsoft App Service Tools for Visual Studio

This enables you to work with Azure Websites:

* [Publish web projects to Azure Websites](app-service-web/web-sites-dotnet-get-started.md).
* [Publish console application projects to Azure WebJobs](app-service-web/websites-dotnet-deploy-webjobs.md).
* [Create Azure Website and SQL Database resources while creating a new web project or while publishing a web project](app-service-web/web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database.md).
* [Create PowerShell deployment scripts while creating new Websites](http://msdn.microsoft.com/library/dn642480.aspx).
* [Manage and troubleshoot Azure Websites in Server Explorer](app-service-web/web-sites-dotnet-troubleshoot-visual-studio.md#sitemanagement).
* [Run in debug mode remotely for Websites and WebJobs](app-service-web/web-sites-dotnet-troubleshoot-visual-studio.md#remotedebug). 

>[AZURE.NOTE] You don't have to install the Azure SDK for .NET to use these features; they are also included in Visual Studio Updates. 

##<a id="datalake"></a>Microsoft Azure Data Lake Tools for Visual Studio

For more information, see [Tutorial: develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics/data-lake-analytics-data-lake-tools-get-started.md).

##<a id="notincluded"></a>What's not included when you install the Azure SDK for .NET

There are a few things that you might want for Azure development that aren't included when you install the SDK. The most important of these are the following:

* [Client libraries](http://go.microsoft.com/fwlink/?LinkId=510472). 

	The Azure SDK includes client libraries for consuming Azure services, but not all of them are installed when you install the SDK. If your application needs a client library that the SDK doesn't install, you can get it from [NuGet.org](http://go.microsoft.com/fwlink/?LinkId=510472). If your application uses a client library that the SDK does install, it's a good practice to update it with the current version at NuGet.org.

  	**Local copies of client libraries.** The Azure SDK for .NET copies to your computer the NuGet packages for some Azure client libraries, such as Storage, Service Bus, and Caching. These client libraries are automatically included in new cloud service projects, so the local NuGet packages enable Visual Studio to create projects even if you're not connected to the Internet. Client libraries are generally updated more frequently than new SDK versions are released, so the client libraries at NuGet.org are often more current than what you get with the SDK. 

	**Project templates that include client libraries.** Only [Azure Cloud Service](cloud-services/cloud-services-dotnet-get-started.md) and [Azure Mobile Service](mobile-services/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard.md) project templates automatically include some client libraries. For other libraries or other templates, install the [client library NuGet packages](http://go.microsoft.com/fwlink/?LinkId=510472) that you need.

* [Azure Mobile Service project templates](mobile-services/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard.md).

	Mobile Service templates are available only in Visual Studio 2013 Update 2 and later. They are not available in Visual Studio 2012 or earlier versions, and not in Visual Studio 2013 Update 1 or earlier, even if you install the Azure SDK for .NET.

##<a id="faq"></a>Frequently Asked Questions

- [Many Azure features are already in Visual Studio. Do I need to install the Azure SDK for .NET?](#azinvs)
- [I want a client library. Do I have to install the Azure SDK for .NET to get it?](#clientlib)
- [Where can I find older versions of the Azure SDK for .NET?](#olderversions)
- [What's the lifecycle policy for versions of the Azure SDK for .NET?](#lifecycle)
- [Which guest OS versions is the Azure SDK for .NET compatible with?](#guestos)
- [How do I uninstall the Azure SDK for .NET?](#uninstall)

###<a id="azinvs"></a>Many Azure features are already in Visual Studio. Do I need to install the Azure SDK for .NET?

It's a good practice to install the SDK if you want to develop for Azure using the latest tools. If you'd rather not install the SDK, you can do so if the following conditions are true:

* You've installed the latest [Visual Studio Update](http://www.visualstudio.com/downloads/download-visual-studio-vs#DownloadFamilies_5).
* You're developing only for Azure Websites or Mobile Services, not for Cloud services or Virtual Machines.
* Your application doesn't use Storage, or it uses Storage but you don't need the Storage Emulator or the AzCopy tool.

###<a id="clientlib"></a>I want a client library. Do I have to install the Azure SDK for .NET to get it?

The SDK installs client libraries only so you can create cloud service projects even if you're not connected to the Internet. Current client libraries are available in NuGet packages at [NuGet.org](http://go.microsoft.com/fwlink/?LinkId=510472). For more information, see [What's not included when you install the Azure SDK for .NET](#notincluded) earlier in this document.

###<a id="olderversions"></a>Where can I find older versions of the Azure SDK for .NET?

For older versions see the [Azure SDK for .NET](https://azure.microsoft.com/downloads/archive-net-downloads/) downloads page. 

###<a id="lifecycle"></a>What's the lifecycle policy for versions of the Azure SDK for .NET?

See [Microsoft Azure Cloud Services Support Lifecycle Policy](http://support.microsoft.com/gp/azure-cloud-lifecycle-faq).

###<a id="guestos"></a>Which guest OS versions is the Azure SDK for .NET compatible with?

See [Azure Guest OS Releases and SDK Compatibility Matrix](http://msdn.microsoft.com/library/ee924680.aspx).

###<a id="uninstall"></a>How do I uninstall the Azure SDK for .NET?

Each item shown in this article under [What's included in the Azure SDK for .NET](#included) is a separate program in the list of installed programs in Windows Control Panel **Programs and Features**.  There is no way to uninstall them as a group; you have to uninstall each program individually.

When you have the Azure SDK for .NET already installed, and you install a new version, there is generally no need to uninstall the old one. In most cases, the SDK installation updates an existing program rather than adding a new one and leaving the old one. 

However, if you want to remove no-longer-needed remnants of an earlier version, uninstall only programs that specify the older version number, and only uninstall them if the same program with a newer version is present. For example, after updating from 2.5 to 2.6 you may see both 2.5 and 2.6 versions of "Microsoft Azure Tools for Microsoft Visual Studio 2013", and you can uninstall the 2.5 version. But you may only see the 2.5 version of "Microsoft Azure Authoring Tools", and it wouldn't be safe to uninstall that.

Note that version numbers in program titles shown in **Programs and Features** can be misleading.  For example, SDK version 2.6 includes "Microsoft Azure Mobile App SDK V1.0" if you install the SDK for Visual Studio 2013, and "Microsoft Azure Mobile App SDK V2.0" for Visual Studio 2015; the version in this case isn't the SDK version but an indicator of which Visual Studio version the program applies to.

This article does not list every program that every earlier version of the Azure SDK included; there are other programs you can uninstall from earlier SDK versions, because earlier SDK versions sometimes included programs that were omitted from later versions. For example, version 2.5 installs "Azure Resource Manager Tools for Visual Studio" but that is not in this article's list because it no longer shows up as a separate program in **Programs and Features**.  This article only lists programs that are included in the Azure SDK for .NET version 2.6.  

> **Note:** Some of the programs that the SDK includes may also be installed separately in other contexts and may be needed even if you don't need the full SDK. The same may be true of programs that were installed by earlier SDK versions but were omitted from later SDK versions. When you uninstall programs, be careful to avoid removing something that is still needed on your computer.



##<a id="versions"></a>Versions

To see which version is current or to download older versions, see the [Azure SDK for .NET Version History](https://azure.microsoft.com/downloads/archive-net-downloads/) page. 

##<a id="resources"></a>Resources

To download the current Azure SDK for .NET or a client library, see the [Azure Downloads page](https://azure.microsoft.com/downloads/).

For the Azure SDK for .NET source code, including client libraries, see [GitHub.com/Azure](https://github.com/azure/).

For Azure client library reference documentation, see [Azure .NET Reference](https://azure.microsoft.com/documentation/api/). 
