
<properties 
   pageTitle="Azure SDK for .NET 2.8 Release Notes" 
   description="Azure SDK for .NET 2.8 Release Notes" 
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
 
# Azure SDK for .NET 2.8, 2.8.1 and 2.8.2

##Overview
 
This article contains the release notes (that includes known issues and breaking changes) for the Azure SDK for .NET 2.8, 2.8.1 and 2.8.2 releases. 

For complete list of new features and updates made in this release, see the [Azure SDK 2.8 for Visual Studio 2013 and Visual Studio 2015](https://azure.microsoft.com/blog/announcing-the-azure-sdk-2-8-for-net/) announcement. 

##  Azure SDK for .NET 2.8

### Download Azure SDK for .NET 2.8

[Azure SDK for .NET 2.8 for Visual Studio 2015](http://go.microsoft.com/fwlink/?LinkId=699285) 

[Azure SDK for .NET 2.8 for Visual Studio 2013](http://go.microsoft.com/fwlink/?LinkId=699287)
 
### .NET 4.5.2 support 

####Known issues

Azure .NET SDK 2.8 allows you to create .NET 4.5.2 Cloud Service packages. However .NET 4.5.2 framework will not be installed on the default Guest OS images until January 2016 Guest OS release. Before that, .NET 4.5.2 framework will be available through a separate Guest OS release version – November 2015-02. See the [Azure Guest OS Releases and SDK Compatibility Matrix](../cloud-services/cloud-services-guestos-update-matrix.md) page to track when the image will be released.  Once the November 2015-02 image is released you can choose to use that image by updating your Cloud Service configuration file (.cscfg) file. In the service configuration file set the osVersion attribute of the ServiceConfiguration element to the string "WA-GUEST-OS-4.26_201511-02". If you choose to opt in to use this image then you will no longer get automatic updates to the Guest OS. To get the automatic updates the osVersion must be set to “*” and .NET 4.5.2 will only be available through automatic updates in January 2016.

###Azure Data Factory

####Known issues 

During a **Data Factory Template** project creation involving sample data, azure power shell script may fail if azure power shell version installed on the machine is after 0.9.8.

In order to successfully create this type of project, you must install [azure power shell version  0.9.8](https://github.com/Azure/azure-powershell/releases/download/v0.9.8-September2015/azure-powershell.0.9.8.msi).


### Azure Resource Manager Tools 

####Breaking changes

The PowerShell script provided by the Azure Resource Group project has been updated in this release to work with the new Azure PowerShell cmdlets version 1.0.  This new script will not work from with Visual Studio when using a version of the SDK prior to 2.8.  

Scripts from projects created in earlier versions of the SDK will not run from within Visual Studio when using the 2.8 SDK.  All scripts will continue to work outside of Visual Studio with the appropriate version of the Azure PowerShell cmdlets.  

The 2.8 SDK requires version 1.0 of the Azure PowerShell cmdlets.  All other versions of the SDK require version 0.9.8 of the Azure PowerShell cmdlets.  For more information see [this](http://go.microsoft.com/fwlink/?LinkID=623011) blog.

###Web Tools Extensions

####Known issues

The following known issues will be addressed in the following release.

- App Service related Cloud and Server Explorer gesture for non-production environments (like Azure China or Azure Stack customers) do not work. For customers in these impacted areas, downloading the publish profile from the Azure portal will enable publishing ability. A future release will repair gestures such as “Attach Debugger” and “View Streaming Logs” for Azure China and Stack customers. 
- Customers may see errors during App Service creation when the App Insights instance to which they are deploying is in a region other than East US. In these scenarios, creating an App Service in the portal and downloading the publish profile will enable publishing scenarios. 

###Azure HDInsight Tools

####New updates

- You can execute your Hive query in the cluster via HiveServer2 with almost no overhead and see the job logs in real-time.
- Using the new Hive Task Execution View you can dig into your job deeper, find more details, and identify potential issues.

For information, see [Azure SDK 2.8 for Visual Studio 2013 and Visual Studio 2015](https://azure.microsoft.com/blog/announcing-the-azure-sdk-2-8-for-net/). 

## Azure SDK for .NET 2.8.1

### Known Issues for Visual Studio 2013 and Visual Studio 2015
 
1. Triggered WebJob publishes to slots will show and error and won’t set a schedule, but it will push the WebJob to Azure. Customers who are in need of a Scheduled job can then use the Azure Portal to set up the schedule for the WebJob. 
2. Python customers may experience debugger issues. Service team is rolling out a fix for this but if customers are affected, please let Microsoft know in the forums or on the announcement blog or release notes comments section. 
3. Customers in certain regions (such as South India) will experience App Service provisioning errors. This is consistent with the portal, and customers who experience this issue can use the Azure portal to request access to publish to these geo-regions. Once they request access to these regions using the Azure portal provisioning should work. 

##Azure SDK for .NET 2.8.2

Following the installation of the 2.8.2 tools, customers may experience the following issue.         

- If you are using Windows 10 and have not installed Internet Explorer, you may get an "Internet Explorer could not be found" error.
To resolve the issue, install Internet Explorer using the Add/Remove Windows Components dialog.

If you observe this issue, use the Send-a-smile feature to report it.

For more information, see [this](https://azure.microsoft.com/blog/announcing-azure-sdk-2-8-2-for-net/) post.
##Other updates

For other updates, see [Azure SDK 2.8 announcement post](https://azure.microsoft.com/blog/announcing-the-azure-sdk-2-8-for-net/).

##Also see

[Azure SDK 2.8 announcement post](https://azure.microsoft.com/blog/announcing-the-azure-sdk-2-8-for-net/)

[Support and Retirement Information for the Azure SDK for .NET and APIs](https://msdn.microsoft.com/library/azure/dn479282.aspx)

