---
title: Get started with Azure Log Integration | Microsoft Docs
description: Learn how to install the Azure Log Integration service and integrate logs from Azure Storage, Azure audit logs, and Azure Security Center alerts.
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
ms.date: 02/20/2018
ms.author: TomSh
ms.custom: azlog

---
# Azure Log Integration with Azure Diagnostics logging and Windows event forwarding

Azure Log Integration provides customers with an alternative in the event that an [Azure Monitor](../monitoring-and-diagnostics/monitoring-get-started.md) connector is not available from their Security Incident and Event Management (SIEM) vendor. Azure Log integration makes Azure logs available to your SIEM and enables you to create a unified security dashboard for all your assets.

> [!NOTE]
> For more information on Azure Monitor, you can review [Get started with Azure Monitor](../monitoring-and-diagnostics/monitoring-get-started.md) For more information on the status of an Azure monitor connector contact your SIEM vendor.

> [!IMPORTANT]
> If your primary interest is in collecting virtual machine logs, most SIEM vendors include this in their solution. Using the SIEM vendor's connector should always be the preferred alternative.

This article helps you get started with Azure Log Integration by focusing on the installation of the Azure Log Integration service and integrating the service with Azure Diagnostics. The Azure Log Integration service will then be able to collect Windows Event Log information from the Windows Security Event Channel from virtual machines deployed in Azure infrastructure as a service. This is similar to *event forwarding* that you might have used on-premises.

> [!NOTE]
> The ability to bring the output of Azure Log Integration to the SIEM is provided by the SIEM itself. For  more information, see [Integrating Azure Log Integration with your on-premises SIEM](https://blogs.msdn.microsoft.com/azuresecurity/2016/08/23/azure-log-siem-configuration-steps/).

The Azure Log Integration service runs on a physical or virtual computer running Windows Server 2008 R2 or later (Windows Server 2016 or Windows Server 2012 R2 are preferred).

The physical computer can run on-premises or on a hosting site. If you choose to run the Azure Log Integration service on a virtual machine, the virtual machine can be located on-premises or in a public cloud, such as Microsoft Azure.

The physical or virtual machine running the Azure Log Integration service requires network connectivity to the Azure public cloud. The steps described in this article provide details about the required configuration.

## Prerequisites

At a minimum, the installation of Azure Log Integration requires the following items:

* An **Azure subscription**. If you don't have one, you can sign up for a [free account](https://azure.microsoft.com/free/).
* A **storage account** that can be used for Windows Azure Diagnostics (WAD) logging. (You can use a preconfigured storage account, or create a new one. Later in this article, we describe how to configure the storage account.)

  > [!NOTE]
  > Depending on your scenario, a storage account might not be required. For the Azure Diagnostics scenario covered in this article, a storage account is required.

* **Two systems**: A machine that will run the Azure Log Integration service, and a machine that will be monitored and have its logging information sent to the Azure Log Integration service machine.
  * A machine you want to monitor. This is a VM running as an [Azure virtual machine](../virtual-machines/virtual-machines-windows-overview.md).
  * A machine that runs the Azure Log Integration service. This machine collects all the log information that later will be imported into your SIEM. This system:
    * Can be on-premises or hosted in Microsoft Azure.  
    * Must be running an x64 version of Windows server 2008 R2 SP1 or later, and have Microsoft .NET 4.5.1 installed. To determine the .NET version installed, see [Determine which .NET Framework versions are installed](https://msdn.microsoft.com/library/hh925568).  
    * Must have connectivity to the Azure storage account that's used for Azure Diagnostics logging. Later in this article, we describe how to confirm this connectivity.
* A **storage account**: The storage account is used for Windows Azure Diagnostics logging. You can use a preconfigured storage account or create a new storage account. Later in this article, we describe how to configure this storage account.
  > [!NOTE]
  > Depending on your scenario, a storage account might not be required. For the Azure Diagnostics scenario covered in this article, a storage account is required.

For a quick demonstration of the process of a creating a virtual machine by using the Azure portal, take a look at the following video:

> [!VIDEO https://channel9.msdn.com/Blogs/Azure-Security-Videos/Azure-Log-Integration-Videos-Create-a-Virtual-Machine/player]

## Deployment considerations

During testing, you can use any system that meets the minimum operating system requirements. For a production environment, the load might require you to plan for scaling up or out.

You can run multiple instances of the Azure Log Integration service. However, you can run only one instance of the service per physical or virtual machine. In addition, you can load-balance Azure Diagnostics storage accounts for WAD. The number of subscriptions to provide to the instances is based on your capacity.

> [!NOTE]
> Currently, we don't have specific recommendations about when to scale out instances of Azure Log Integration machines (that is, machines running the Azure Log Integration service), or for storage accounts or subscriptions. Make scaling decisions based on your performance observations in each of these areas.

You also have the option to scale up the Azure Log Integration service to help improve performance. The following performance metrics can help you size the machines that you choose to run the Azure Log Integration service:

* On an 8-processor (core) machine, a single instance of Azure Log Integration integrator can process about 24 million events per day (~1M/hour).
* On a 4-processor (core) machine, a single instance of Azure Log Integration integrator can process about 1.5 million events per day (~62.5K/hour).

## Install Azure Log Integration

To install Azure Log Integration, download the [Azure Log Integration](https://www.microsoft.com/download/details.aspx?id=53324) installation file. Run through the setup routine. Choose whether to provide telemetry information to Microsoft.  

![Screenshot of the installation pane, with the telemetry check box selected](./media/security-azure-log-integration-get-started/telemetry.png)

> [!NOTE]
> We recommend that you allow Microsoft to collect telemetry data. You can turn off the collection of telemetry data by clearing this check box.
>

The Azure Log Integration service collects telemetry data from the machine on which it is installed.  

Telemetry data collected includes the following:

* Exceptions that occur during execution of Azure Log Integration.
* Metrics about the number of queries and events processed.
* Statistics about which Azlog.exe command-line options are used.

The installation process is covered in the following video:

> [!VIDEO https://channel9.msdn.com/Blogs/Azure-Security-Videos/Azure-Log-Integration-Videos-Install-Azure-Log-Integration/player]

## Post-installation and validation steps

After you complete the basic setup routine, you're ready to perform post-installation and validation steps:

1. In an elevated PowerShell window, go to C:\Program Files\Microsoft Azure Log Integration.
2. The first step is to import the Azure Log Integration cmdlets. To import the cmdlets, run the script **LoadAzlogModule.ps1**. Enter **.\LoadAzlogModule.ps1**, and then press Enter (note the use of **.\\** in this command). You should see something like what appears in the following figure:
  ![Screenshot of the installation window, with the telemetry check box selected](./media/security-azure-log-integration-get-started/loaded-modules.png)
3. Now you need to configure Azure Log Integration to use a specific Azure environment. An *Azure environment* is the “type” of Azure cloud data center that you want to work with. Although there are several Azure environments at this time, currently, the relevant options are either **AzureCloud** or **AzureUSGovernment**. In your elevated PowerShell environment, make sure that you are in C:\Program Files\Microsoft Azure Log Integration\. Then, run this command: </br>
  `Set-AzlogAzureEnvironment -Name AzureCloud` (for Azure commercial)

    > [!NOTE]
    > You don't receive feedback when the command succeeds. If you want to use the US Government Azure cloud, you would use **AzureUSGovernment** (for the **-Name** variable). Currently, other Azure clouds aren't supported.  
4. Before you can monitor a system, you need the name of the storage account that's used for Azure Diagnostics. In the Azure portal, go to **Virtual machines**. Look for the virtual machine that you monitor. In the **Properties** section, select **Diagnostic Settings**.  Then, select **Agent**. Make note of the storage account name that's specified. You need this account name for a later step.

  ![Azure Diagnostics settings](./media/security-azure-log-integration-get-started/storage-account-large.png) 

  ![Azure Diagnostics settings](./media/security-azure-log-integration-get-started/azure-monitoring-not-enabled-large.png)

    > [!NOTE]
    > If monitoring wasn't enabled when the virtual machine was created, you can enable it as shown in the preceding image.

5. Switch your attention back to the Azure Log Integration machine. Verify that you have connectivity to the storage account from the system where you installed Azure Log Integration. The computer running the Azure Log Integration service needs access to the storage account to retrieve information logged by Azure Diagnostics on each of the monitored systems.  
  1. [Download Azure Storage Explorer](http://storageexplorer.com/).
  2. Complete setup.
  3. When installation is finished, select **Next**. Leave the **Launch Microsoft Azure Storage Explorer** check box selected.  
  4. Sign in to Azure.
  5. Verify that you can see the storage account that you configured for Azure Diagnostics. 

    ![Screenshot of storage accounts](./media/security-azure-log-integration-get-started/storage-account.jpg)
6. There are a few options under storage accounts. One of them is **Tables**. Under **Tables** you should see a table called **WADWindowsEventLogsTable**.

    If monitoring was not enabled when the virtual machine was created, you can enable it as discussed earlier.
7. Switch your attention back to the Azure Log Integration machine. Verify that you have connectivity to the storage account from the system where you installed Azure Log Integration. The physical computer or virtual machine running the Azure Log Integration service needs access to the storage account to retrieve information that's logged by Azure Diagnostics on each of the monitored systems.  
  1. [Download Azure Storage Explorer](http://storageexplorer.com/).
  2. Complete setup.
  3. When installation is finished, select **Next**. Leave the **Launch Microsoft Azure Storage Explorer** check box selected.  
  4. Sign in to Azure.
  5. Verify that you can see the storage account that you configured for Azure Diagnostics.  
  6. There are a few options under storage accounts. One of them is **Tables**. Under **Tables**, you should see a table called **WADWindowsEventLogsTable**.

   ![Screenshot of storage accounts in Storage Explorer](./media/security-azure-log-integration-get-started/storage-explorer.png) 

## Integrate Azure Diagnostics logging

In this step, you configure the machine running the Azure Log Integration service to connect to the storage account that contains the log files.

To complete this step, you need a few things up front:  
* **FriendlyNameForSource**: This is a friendly name that you can apply to the storage account that you've configured the virtual machine to store information from Azure Diagnostics.
* **StorageAccountName**: This is the name of the storage account that you specified when you configured Azure Diagnostics.  
* **StorageKey**: This is the storage key for the storage account where the Azure Diagnostics information is stored for this virtual machine.  

To obtain the storage key, complete the following steps:
1. Go to the [Azure portal](http://portal.azure.com).
2. In the navigation pane, select **All services.**
3. In the **Filter** text box, enter **Storage**. Select **Storage accounts**.

  ![Screenshot that shows storage accounts in All services](./media/security-azure-log-integration-get-started/filter.png)
4. A list of storage accounts appears. Double-click on the account that you assigned to log storage.

  ![Screenshot that shows a list of storage accounts](./media/security-azure-log-integration-get-started/storage-accounts.png)
5. Under **Settings**, select **Access keys**.

  ![Screenshot that shows the Access keys option in the menu](./media/security-azure-log-integration-get-started/storage-account-access-keys.png)
6. Copy **key1**, and then save it in a secure location that you can access for the following step.
7. On the server where you installed Azure Log Integration, open an elevated Command Prompt window. (Note that we’re using an elevated Command Prompt window here, not an elevated PowerShell console).
 8. Go to C:\Program Files\Microsoft Azure Log Integration.
 9. Run `Azlog source add <FriendlyNameForTheSource> WAD <StorageAccountName> <StorageKey>`.
 
  For example:
  
   `Azlog source add Azlogtest WAD Azlog9414 fxxxFxxxxxxxxywoEJK2xxxxxxxxxixxxJ+xVJx6m/X5SQDYc4Wpjpli9S9Mm+vXS2RVYtp1mes0t9H5cuqXEw==`

  If you want the subscription ID to show up in the event XML, append the subscription ID to the friendly name:

  `Azlog source add <FriendlyNameForTheSource>.<SubscriptionID> WAD <StorageAccountName> <StorageKey>`
  
  Or, for example: 
  
  `Azlog source add Azlogtest.YourSubscriptionID WAD Azlog9414 fxxxFxxxxxxxxywoEJK2xxxxxxxxxixxxJ+xVJx6m/X5SQDYc4Wpjpli9S9Mm+vXS2RVYtp1mes0t9H5cuqXEw==`

> [!NOTE]
> Wait up to 60 minutes, then view the events that are pulled from the storage account. To view the events, on the Azure Log Integration Integrator, select **Event Viewer** > **Windows Logs** > **Forwarded Events**.

The following video goes over the preceding steps:

> [!VIDEO https://channel9.msdn.com/Blogs/Azure-Security-Videos/Azure-Log-Integration-Videos-Enable-Diagnostics-and-Storage/player]


## What if data isn't showing up in the Forwarded Events folder?
If data is not showing up in the **Forwarded Events** folder after an hour, complete these steps:

1. Check the machine that's running the Azure Log Integration service. Confirm that it can access Azure. To test connectivity, in the browser, try to go to the [Azure portal](http://portal.azure.com).
2. Make sure that the user account Azlog has write permission for the folder users\Azlog.
  1. Open **Windows Explorer**.
  2. Go to C:\users.
  3. Right-click C:\users\Azlog.
  4. Select **Security**.
  5. Select **NT Service\Azlog**. Then, check the permissions for the account. If the account is missing from this tab, or if the appropriate permissions are not currently showing, you can grant the account permissions on this tab.
3. Make sure that the storage account added in the command **Azlog source add** is listed when you run the command **Azlog source list**.
4. Go to **Event Viewer > Windows Logs > Application** to see if there are any errors reported from the Azure Log Integration service.

If you run into any issues during installation and configuration, please create a [support request](../azure-supportability/how-to-create-azure-support-request.md). For the service, select **Log Integration**.

Another support option is the [Azure Log Integration MSDN forum](https://social.msdn.microsoft.com/Forums/home?forum=AzureLogIntegration). In the MSDN forum, the community can support other members with questions, answers, tips, and tricks about how to get the most out of Azure Log Integration. The Azure Log Integration team also monitors this forum, and helps whenever they can.

## Next steps
To learn more about Azure Log Integration, see the following articles:

* [Microsoft Azure Log Integration for Azure logs](https://www.microsoft.com/download/details.aspx?id=53324). The Download Center includes details, system requirements, and installation instructions for Azure Log Integration.
* [Introduction to Azure Log Integration](security-azure-log-integration-overview.md). This article introduces you to Azure Log Integration, its key capabilities, and how it works.
* [Partner configuration steps](https://blogs.msdn.microsoft.com/azuresecurity/2016/08/23/azure-log-siem-configuration-steps/). This blog post shows you how to configure Azure Log Integration to work with partner solutions Splunk, HP ArcSight, and IBM QRadar. This is our current guidance about how to configure the SIEM components. First, check with your SIEM vendor for additional details.
* [Azure Log Integration frequently asked questions (FAQ)](security-azure-log-integration-faq.md). This FAQ answers questions about Azure Log Integration.
* [Integrating Security Center alerts with Azure Log Integration](../security-center/security-center-integrating-alerts-with-log-integration.md). This article shows you how to sync Security Center alerts and virtual machine security events that are collected by Azure Diagnostics and Azure activity logs by using your Log Analytics or SIEM solution.
* [New features for Azure Diagnostics and Azure audit logs](https://azure.microsoft.com/blog/new-features-for-azure-diagnostics-and-azure-audit-logs/). This blog post introduces you to Azure audit logs and other features that help you gain insights into the operations of your Azure resources.
