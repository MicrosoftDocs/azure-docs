
<properties 
   pageTitle="Azure SDK for .NET 2.7 and .NET 2.7.1 Release Notes" 
   description="Azure SDK for .NET 2.7 and .NET 2.7.1 Release Notes" 
   services="app-service\web" 
   documentationCenter=".net" 
   authors="Juliako" 
   manager="erikre" 
   editor=""/>

<tags
   ms.service="app-service"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="07/18/2016"
   ms.author="juliako"/>

# Azure SDK for .NET 2.7 and .NET 2.7.1 Release Notes

##Overview

This document contains the release notes for the Azure SDK for .NET 2.7 release. 

The document also contain the release notes for the Azure SDK for .NET 2.7.1 release.

Azure SDK 2.7 is only supported in Visual Studio 2015 and Visual Studio 2013. [Azure SDK 2.6](https://azure.microsoft.com/downloads/) is the last supported SDK for Visual Studio 2012.

For detailed information about this release, see [Azure SDK 2.7 announcement post](https://azure.microsoft.com/blog/2015/07/20/announcing-the-azure-sdk-2-7-for-net/) and [Azure SDK 2.7.1 announcement post](http://go.microsoft.com/fwlink/?LinkId=623850).

##Azure SDK for .NET 2.7

###Sign in improvements for Visual Studio 2015

Azure SDK 2.7 for Visual Studio 2015 supports the new identity management features in Visual Studio 2015.  This includes support for accounts accessing Azure via Role Based Access Control, Cloud Solution Providers, DreamSpark and other account and subscription types.

The sign-in improvements included with Azure SDK 2.7 are only available in Visual Studio 2015. Support for Visual Studio 2013 is included in Azure SDK 2.7.1.


###Mobile SDK

Updated **Mobile Apps** templates to reflect newest [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server/) and setup process.

###Service Bus 

General bug fixes and improvements. For detail on updates and features, please refer to the release notes of the latest [Service Bus NuGet](http://www.nuget.org/packages/WindowsAzure.ServiceBus/).

###HDInsight Tools 

In this release the following updates were made. These updates are in preview. For more information, see [this blog](http://go.microsoft.com/fwlink/?LinkId=619108).

- Hive graphs for Hive on Tez jobs
- Full Hive DML IntelliSense support
- Pig template support
- Storm templates for Azure services

####Breaking changes

- Old **Storm** project must be upgraded when using this version of the tools. For more information, see [this blog](http://go.microsoft.com/fwlink/?LinkId=619108).
- Visual Studio Web Express is no longer supported. For more information, see [this blog](http://go.microsoft.com/fwlink/?LinkId=619108).

###Azure App Service Tools

In this release the following updates were made to Web Tools Extensions. For more information see [this](https://azure.microsoft.com/blog/2015/07/20/announcing-the-azure-sdk-2-7-for-net/)  blog. 

- Support for DreamSpark accounts added
- Full change to Azure Tools made to support the new Azure Resource Management APIs
- Support for Azure App Service added to [Cloud Explorer](azure-sdk-dot-net-release-notes-2_7.md#cloud_explorer)

####Known issues

Web App deployment slot nodes don’t appear under the Slots node in Server Explorer, and Web App deployment slot child nodes don’t load under Cloud Explorer. This issue has been resolved and prepared for the next SDK release. 


###<a id="cloud_explorer"></a>Cloud Explorer for Visual Studio 2015

Azure SDK 2.7 includes Cloud Explorer for Visual Studio 2015 which enables you to view your Azure resources, inspect their properties, and perform key developer actions from within Visual Studio. 

Cloud explorer supports the following:

- Resource Group and Resource Type views of your Azure resources 
- Search for resources by name (available in Resource Type view)
- Support for subscriptions and resources that have Role Based Access Control (RBAC) applied 
- Integrated Action panel which shows developer-focused actions specific to selected resources. For example: Attach remote debugger for Virtual Machines created using the Resource Manager Stack, View diagnostics data for Virtual Machines etc.
- Integrated Properties panel which shows developer-focused properties commonly needed during dev/test 
- Quick switching of the account to use when enumerating resources (use Settings command on toolbar) 
- Filtering of subscriptions to use when enumerating resources (use Settings command on toolbar) 
- Deep links to the Azure Portal for management of resources and resource groups 
 
 
###Azure Resource Manager Tools 

The Azure Resource Manager Tools have been updated to work with Role Based Access Control (RBAC) and new subscription types.  Included with these changes is the ability to use new storage accounts, in addition to classic storage, to store artifacts during deployment.  

If you’re using an Azure Resource Group project from a previous version of the SDK with the SDK 2.7, a new deployment script is needed to deploy using a new storage account instead of classic storage.  You will be prompted before changes are made to your project to add the new script.  The old script will be renamed and you will need to manually make any modifications to the new script.
 
 
###Storage Explorer Tools 

- Support for viewing Append Blobs. More info in [this blog post](http://blogs.msdn.com/b/windowsazurestorage/archive/2015/04/13/introducing-azure-storage-append-blob.aspx). 
- Support for viewing Premium Storage accounts through Server Explorer. Server Explorer will only display page blobs for premium storage accounts as they are the only supported type for premium storage accounts.

###Azure Data Factory Tools for Visual Studio 

Introducing **Azure Data Factory Tools** for Visual Studio. Below are the enabled features. See [this blog](http://go.microsoft.com/fwlink/?LinkId=617530) for more information.

- **Template based authoring**: Select use-cased based templates, data movement templates or data processing templates to deploy an end-to-end data integration solution and get started hands-on quickly with Data Factory. 
- **Integration with Solution Explorer for authoring and deploying Data Factory entities**: Create & deploy pipelines and related entities as Visual Studio projects. 
- **Integration with Diagram view for visual interaction while authoring**: Visually author pipelines and datasets with aid from the Diagram view. 
- **Integration with Server explorer for browsing and interaction with already deployed entities**: Leverage the Server Explorer to browse already deployed data factories and corresponding entities. Import a deployed data factory or any entity (Pipeline, Linked Service, Datasets) into your project. 
- **JSON editing with schema validation and rich intellisense**: Efficiently configure and edit JSON documents of Data Factory entities with rich intellisense and schema validation 
- **Multi-Environment publishing**: Publish authored pipelines to dev, test or Prod environment by creating separate config files for each environment.
- **Pig, Hive and .Net based Data Processing Support**: Support for Pig and Hive Scripts in Data Factory project. Support for referencing C# Project for managing .Net Activity.

##Azure SDK for .NET 2.7.1

The following section contains updates that were introduced with the Azure SDK for .NET 2.7.1 release.
###HDInsight Tools 

For more detailed explanation about HDInsight tools updates, see [this blog](http://go.microsoft.com/fwlink/?LinkId=623831).

- Hive Job Operator View (a new feature)

	To help you understand your Hive query better, the Hive Operator View feature was added. To see all the operators inside a vertex, double click on the vertices of the job graph. To view more details of a particular operator, hover over that operator.
- Hive Error Marker (a new feature)

	To enable you to view the grammar errors instantly, the Hive Error Marker feature was added. Also, error messages were enhanced and you can now see detailed grammar errors instantly (until this release, you had to submit a Hive script to the cluster and wait for some time before getting details about your error message).  
- Storm Topology Graph (a new feature)

	Visualizing is very important when you want to see if your topology is working as expected. In this release we added visualization for Storm graphs. You can visualize the important metrics for your topology (for example, a color indicates weather a certain Bolt is “busy” or not). You can also double click the Bolt/Spout to view more details.

- Support for HDInsight clusters that were created in the Azure Portal (a bug fix)

	You can now use Visual Studio to view and submit jobs to all your HDInsight clusters no matter where the cluster were created.

- More IntelliSense Support& Faster Hive Metadata Loading (an improvement)

	We have improved the IntelliSense by adding more user friendly suggestions. For example, table alias can now also be suggested in IntelliSense so you can write your query more easily. Also, we have improved the Hive metadata loading so it will just take several seconds to list all the databases, tables and columns of your Hive metastore.

For more detailed explanation about HDInsight tools updates, see [this blog](http://go.microsoft.com/fwlink/?LinkId=623831).

###Improvements in Visual Studio 2013

- Azure SDK 2.7.1 enables Visual Studio 2013 to access Azure accounts and subscriptions via Role Based Access Control, Cloud Solution Providers, and Dreamspark.
- With Azure SDK 2.7.1, the new Cloud Explorer tool window is now also available in Visual Studio 2013.

###Known issues

Installing the Azure SDK 2.6 or 2.7.1 for Visual Studio Community 2013 on a non-English OS will display a warning that the English and non-English resources of Visual Studio may be mismatched. This warning may be safely dismissed. It will only occur if the machine did not contain a prior installation of Visual Studio Community 2013 and you are installing the SDK on a non-English OS. The warning is shown after the language pack applies the RTM resources to Visual Studio, but before it applies Update 4. Dismissing the warning will allow the language pack to continue and complete applying the Update 4 version of the language pack content.

LightSwitch projects are not compatibile with this release. This issue will be resolved with the next SDK release.

##Also see
[Azure SDK 2.7.1 announcement post](http://go.microsoft.com/fwlink/?LinkId=623850)

[Azure SDK 2.7 announcement post](https://azure.microsoft.com/blog/2015/07/20/announcing-the-azure-sdk-2-7-for-net/)

[Support and Retirement Information for the Azure SDK for .NET and APIs](https://msdn.microsoft.com/library/azure/dn479282.aspx/)
