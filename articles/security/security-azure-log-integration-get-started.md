---
title: Get started with Azure log integration | Microsoft Docs
description: Learn how to install the Azure log integration service and integrate logs from Azure storage, Azure Audit Logs and Azure Security Center alerts.
services: security
documentationcenter: na
author: Barclayn
manager: MBaldwin
editor: TomShinder

ms.assetid: 53f67a7c-7e17-4c19-ac5c-a43fabff70e1
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ums.workload: na
ms.date: 03/07/2017
ms.author: TomSh

---
# Azure log integration and Windows Diagnostic logging
Azure log integration (AZLog) enables you to integrate raw logs from your Azure resources in to your on-premises Security Information and Event Management (SIEM) systems. This integration makes it possible to have a unified security dashboard for all your assets, on-premises or in the cloud, so that you can aggregate, correlate, analyze, and alert for security events associated with your applications. For more information on Azure Log Integration, you can review the [Azure Log integration overview](https://docs.microsoft.com/en-us/azure/security/security-azure-log-integration-overview).
To help you get started with Azure Log integration in this document we will focus on the installation of Azlog with Windows Azure Diagnostics (WAD)

>[!NOTE]
The ability to bring the output of Azure log integration in to the SIEM is provided by the SIEM itself. Please see the article “Integrating Azure Log Integration with your On-premises SIEM” for more information.


## Prerequisites
At a minimum the installation of AZLog requires the following items:
* An Azure subscription. If you do not have one, you can sign up for a free account.
* A storage account that can be used for Windows Azure diagnostic logging
* Two systems running either 2008 R2 SP1, 2012, 2012R2 or 2016
   * A machine you want to monitor – this can be a physical or virtual machine.  
   * A machine that will run the Azure log integration service; this machine will collect all the log information that will later be imported into your SIEM.
    * This system can be on-premises or in Microsoft Azure.  
    * It needs to be running an x64 version of Windows server 2008 R2 SP1 or higher and have .NET 4.5.1 installed. You can determine the .NET version installed by following the article titled [How to determine which version of .NET framework versions are installed](https://msdn.microsoft.com/library/hh925568(v=vs.110).aspx)  
    It must have connectivity to the Azure storage account used for Azure diagnostic logging. We will provide instructions later in this article on how you can confirm this connectivity

## Deployment considerations
While you are testing AZLog you can use any system that meets the minimum operating system requirements, but for a production environment, the load may require that you plan for scaling up or out. You can run multiple instances of the Azlog Integrator (one instance per physical or virtual machine) if event volume is high. In addition, you can load balance Azure Diagnostics storage accounts for Windows (WAD) and the number of subscriptions to provide to the instances should be based on your capacity.
>[!NOTE]
At this time we do not have specific recommendations for when to scale out instances of Azure log integration machines (i.e., machines that are running the Azure log integration service), or for storage accounts or subscriptions. Scaling decisions should be based on your performance observations in each of these areas.

You also have the option to scale up the Azure log integration service to help improve performance. The following performance metrics can help you in sizing the machines that you choose to run the Azure log integration service:
On an 8-processor (core) machine, a single instance of Azlog Integrator can process about 24 million events per day (~1M/hour).

On a 4-processor (core) machine, a single instance of Azlog Integrator can process about 1.5 million events per day (~62.5K/hour).

## Install Azure log integration
Basic installation
Download [Azure log integration](https://www.microsoft.com/download/details.aspx?id=53324).
Run through the setup routine and decide if you want to provide telemetry information to Microsoft.  

![Installation Screen with telemetry box checked](./media/security-azure-log-integration-get-started/telemetry.png)


> [!NOTE]
> You can turn off collection of telemetry data by unchecking this option.
>


The Azure log integration service collects telemetry data from the machine on which it is installed.  Telemetry data collected is:

* Exceptions that occur during execution of Azure log integration
* Metrics about the number of queries and events processed
* Statistics about which Azlog.exe command-line options are being used


## Post installation and validation steps
Once that you have completed the basic setup routine you need to perform some configuration steps:
1. Open an elevated PowerShell window and navigate to ``c:\Program Files\Microsoft Azure Log Integration``
2. Next you will import the Azlog commandlets. You can do that by running the script LoadAzLogModule.ps1 (notice the “.\” ): type ``.\LoadAzLogModule.ps1`` and press ENTER.  
You should see something like what appears in the figure below. </br></br>
![Installation Screen with telemetry box checked](./media/security-azure-log-integration-get-started/loaded-modules.png) </br></br>
3. Now you need to configure AZLog to use a specific Azure environment. An “Azure environment” is the “type” of Azure cloud data center you want to work with. While there are several Azure environments at this time, the relevant options are either Azurecloud or AzureUSGovernment.   In your elevated powershell environment make sure that you are in  ``c:\program files\Microsoft Azure Log Integration\`` Once there run the command  </br></br>
``Set-AZLogAzureEnvironment -Name AzureCloud`` (for Azure commercial)
>[!NOTE]
If you want to use the US Government Azure cloud, you would use AzureUSGovernment for the USA government cloud).  When the command succeeds, you will not receive any feedback to this effect.  
4. Azure Windows Diagnostics needs to be configured on the monitored system. Move over to the monitored machine and confirm this by looking at the properties of the virtual machine in the Azure portal and choosing Diagnostic Settings.  By default only boot diagnostics is configured. You will need to specify the storage account that you will be using for Windows Event Log storage and then choose Windows Event Security Logs and change the level of logging to All.

  >[!NOTE]
  You should make note of the storage account name. You will need it in later steps. </br></br>
![Azure Diagnostic settings](./media/security-azure-log-integration-get-started/default-diagnostic-logging.png) </br>
5. Now we’ll switch our attention back to the Azure log integration machine. Verify that you have connectivity to the Storage Account from the system where you installed Azure Log Integration. Your AZLOG system needs access to the storage account to retrieve information logged by Azure Diagnostics as configured on each of the monitored systems.  
  1. You can download Azure Storage Explorer here.
  2. Run through the setup routine
  3. Once that the installation completes click next and leave the check box **Launch Microsoft Azure Storage Explorer** checked.  
  4. Log in to Azure.
  5. Verify that you can see the storage account that you configured for Azure Diagnostics.  
![Storage accounts](./media/security-azure-log-integration-get-started/storage-account.jpg) </br></br>
   6. Notice that there are a few options under storage accounts. One of them is Tables. Under tables you should see one called WADWindowsEventLogsTable. </br></br>
   ![Storage accounts](./media/security-azure-log-integration-get-started/storage-explorer.png) </br>
## Integrate Azure Diagnostic logging

To complete this step wew will need a few things up front.  
**FriendlyNameForSource:** Anything you would like
**StorageAccountName:** The name of the storage account that you specified when you configured Azure diagnotics.  
**StorageKey:** You can get the storage key from the properties of the storage account.  

To obtain your storage account key. You can follow the steps below:
 1. Browse to the [Azure portal](http://portal.azure.com).
 2. Navigate to your storage account that you selected for Azure Diagnostic logging.
 3. click **'All settings'**.
 4. click Access keys to view.
 5. Copy one of the access keys.
 6. Then, on the server that you installed Azure Log Integration open an elevated PowerShell Window or elevated command prompt.
Navigate to ``c:\Program Files\Microsoft Azure Log Integration``
>[!NOTE]
If you are using the command prompt you can use the command as it is written below. If you are using powershell you will need to add ".\" before the executable name.
 7. Run ``azlog source add <FriendlyNameForTheSource> WAD <StorageAccountName> <StorageKey> `` </br> For example ``azlog source add azlogtest WAD azlog9414 fxxxFxxxxxxxxywoEJK2xxxxxxxxxixxxJ+xVJx6m/X5SQDYc4Wpjpli9S9Mm+vXS2RVYtp1mes0t9H5cuqXEw==``
If you would like the subscription id to show up in the event XML, append the subscription ID to the friendly name:
``azlog source add <FriendlyNameForTheSource>.<SubscriptionID> WAD <StorageAccountName> <StorageKey>`` or for example, ``azlog source add azlogtest.YourSubscriptionID WAD azlog9414 fxxxFxxxxxxxxywoEJK2xxxxxxxxxixxxJ+xVJx6m/X5SQDYc4Wpjpli9S9Mm+vXS2RVYtp1mes0t9H5cuqXEw==``

>[!NOTE]  
Wait up to minutes, then view the events that are pulled from the storage account. To view, open Event Viewer > Windows Logs > Forwarded Events on the Azlog Integrator.

## What if data is not showing up in the Forwarded Events folder?
If after an hour data is not showing up in the **Forwarded Events** folder, then:

1. Check the machine and confirm that it can access Azure. To test connectivity, try to open the [Azure portal](http://portal.azure.com) from the browser.
2. Make sure the user account **azlog** has write permission on the folder **users\azlog**.
   1. Open explorer,
   2. navigate to c:\users
   3. Right click on c:\users\azlog
   4. Click on security  
   5. Click on 'NT Service\AZLog'
   6. And check the permissions for the account. If the account is missing from this tab or if the appropriate permissions are not currently showing you can grant the account rights in this tab.

3. Make sure the storage account added in the command **azlog source add** is listed when you run the command **azlog source list**.
4. Go to **Event Viewer > Windows Logs > Application** to see if there are any errors reported from the Azure log integration.

If you still don’t see the events, then:

## Next steps
To learn more about Azure Log Integration, see the following documents:

* [Microsoft Azure Log Integration for Azure logs (Preview)](https://www.microsoft.com/download/details.aspx?id=53324) – Download Center for details, system requirements, and install instructions on Azure log integration.
* [Introduction to Azure log integration](security-azure-log-integration-overview.md) – This document introduces you to Azure log integration, its key capabilities, and how it works.
* [Partner configuration steps](https://blogs.msdn.microsoft.com/azuresecurity/2016/08/23/azure-log-siem-configuration-steps/) – This blog post shows you how to configure Azure log integration to work with partner solutions Splunk, HP ArcSight, and IBM QRadar.
* [Azure log Integration frequently asked questions (FAQ)](security-azure-log-integration-faq.md) - This FAQ answers questions about Azure log integration.
* [Integrating Security Center alerts with Azure log Integration](../security-center/security-center-integrating-alerts-with-log-integration.md) – This document shows you how to sync Security Center alerts, along with virtual machine security events collected by Azure Diagnostics and Azure Audit Logs, with your log analytics or SIEM solution.
* [New features for Azure diagnostics and Azure Audit Logs](https://azure.microsoft.com/blog/new-features-for-azure-diagnostics-and-azure-audit-logs/) – This blog post introduces you to Azure Audit Logs and other features that help you gain insights into the operations of your Azure resources.
