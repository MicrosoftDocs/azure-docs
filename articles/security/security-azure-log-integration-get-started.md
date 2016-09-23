<properties
   pageTitle="Get started with Azure log integration | Microsoft Azure"
   description="Learn how to install the Azure log integration service and integrate logs from Azure storage, Azure Audit Logs and Azure Security Center alerts."
   services="security"
   documentationCenter="na"
   authors="TomShinder"
   manager="MBaldwin"
   editor="TerryLanfear"/>

<tags
   ms.service="security"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/24/2016"
   ms.author="TomSh"/>

# Get started with Azure log integration (Preview)

Azure log integration enables you to integrate raw logs from your Azure resources into your on-premises Security Information and Event Management (SIEM) systems. This integration provides a unified dashboard for all your assets, on-premises or in the cloud, so that you can aggregate, correlate, analyze, and alert for security events associated with your applications.

This tutorial walks you through how to install Azure log integration and integrate logs from Azure storage, Azure Audit Logs, and Azure Security Center alerts. Estimated time to complete this tutorial is one hour.

## Prerequisites

To complete this tutorial, you must have the following:

- A machine (on-premises or in the cloud) to install the Azure log integration service. This machine must be running a 64-bit Windows OS with .Net 4.5.1 installed. This machine is called the **Azlog Integrator**.
- Azure subscription. If you do not have one, you can sign up for a [free account](https://azure.microsoft.com/free/).
- Azure Diagnostics enabled for your Azure virtual machines (VMs). To enable diagnostics for Cloud Services, see [Enabling Azure Diagnostics in Azure Cloud Services](../cloud-services/cloud-services-dotnet-diagnostics.md). To enable diagnostics for an Azure VM running Windows, see [Use PowerShell to enable Azure Diagnostics in a Virtual Machine Running Windows](../virtual-machines/virtual-machines-windows-ps-extensions-diagnostics.md).
- Connectivity from the Azlog Integrator to Azure storage and to authenticate and authorize to Azure subscription.
- For Azure VM logs, the SIEM agent (for example, Splunk Universal Forwarder, HP ArcSight Windows Event Collector agent, or IBM QRadar WinCollect) must be installed on the Azlog Integrator.

## Deployment considerations

You can run multiple instances of the Azlog Integrator if event volume is high. Load balancing of Azure Diagnostics storage accounts for Windows *(WAD)* and the number of subscriptions to provide to the instances should be based on your capacity.

On an 8-processor (core) machine, a single instance of Azlog Integrator can process about 24 million events per day (~1M/hour).

On a 4-processor (core) machine, a single instance of Azlog Integrator can process about 1.5 million events per day (~62.5K/hour).

## Install Azure log integration

Download [Azure log integration](https://www.microsoft.com/download/details.aspx?id=53324).

The Azure log integration service collects telemetry data from the machine on which it is installed.  Telemetry data collected is:

- Exceptions that occur during execution of Azure log integration
- Metrics about the number of queries and events processed
- Statistics about which Azlog.exe command line options are being used

> [AZURE.NOTE] You can turn off collection of telemetry data by unchecking this option.

## Integrate Azure VM logs from your Azure Diagnostics storage accounts

1. Check the prerequisites listed above to ensure that your WAD storage account is collecting logs before continuing your Azure log integration. Do not perform the following steps if your WAD storage account is not collecting logs.

2. Open the command prompt and **cd** into **c:\Program Files\Microsoft Azure Log Integration**.

3. Run the command

        azlog source add <FriendlyNameForTheSource> WAD <StorageAccountName> <StorageKey>

      Replace StorageAccountName with the name of the Azure storage account configured to receive diagnostics events from your VM.

        azlog source add azlogtest WAD azlog9414 fxxxFxxxxxxxxywoEJK2xxxxxxxxxixxxJ+xVJx6m/X5SQDYc4Wpjpli9S9Mm+vXS2RVYtp1mes0t9H5cuqXEw==

      If you would like the subscription id to show up in the event XML, append the subscription ID to the friendly name:

        azlog source add <FriendlyNameForTheSource>.<SubscriptionID> WAD <StorageAccountName> <StorageKey>

4. Wait 30 - 60 minutes (it could take as long as an hour), then view the events that are pulled from the storage account. To view, open **Event Viewer > Windows Logs > Forwarded Events** on the Azlog Integrator.

5. Make sure that your standard SIEM connector installed on the machine is configured to pick events from the **Forwarded Events** folder and pipe them to your SIEM instance. Review the SIEM specific configuration to configure and see the logs integrating.

## What if data is not showing up in the Forwarded Events folder?

If after an hour data is not showing up in the **Forwarded Events** folder, then:

1. Check the machine and confirm that it can access Azure. To test connectivity, try to open the [Azure portal](http://portal.azure.com) from the browser.

2. Make sure the user account **azlog** has write permission on the folder **users\azlog**.

3. Make sure the storage account added in the command **azlog source add** is listed when you run the command **azlog source list**.
4. Go to **Event Viewer > Windows Logs > Application** to see if there are any errors reported from the Azure log integration.

If you still don’t see the events, then:

1. Download [Microsoft Azure Storage Explorer](http://storageexplorer.com/).

2. Connect to the storage account added in the command **azlog source add**.

3. In Microsoft Azure Storage Explorer, browse to table **WADWindowsEventLogsTable** to see if there is any data. If not, then diagnostics in the VM is not configured correctly.

## Integrate Azure audit logs and Security Center alerts

1. Open the command prompt and **cd** into **c:\Program Files\Microsoft Azure Log Integration**.

2. Run the command

        azlog createazureid

      This command prompts you for your Azure login. The command then creates an [Azure Active Directory Service Principal](../active-directory/active-directory-application-objects.md) in the Azure AD Tenants that host the Azure subscriptions in which the logged in user is an Administrator, a Co-Administrator, or an Owner. The command will fail if the logged in user is only a Guest user in the Azure AD Tenant. Authentication to Azure is done through Azure Active Directory (AD).  Creating a service principal for Azlog Integration creates the Azure AD identity that will be given access to read from Azure subscriptions.

3. Run the command

        azlog authorize <SubscriptionID>

      This assigns reader access on the subscription to the service principal created in step 2. If you don’t specify a SubscriptionID, then it attempts to assign the service principal reader role to all subscriptions to which you have any access.

        azlog authorize 0ee9d577-9bc4-4a32-a4e8-c29981025328

      > [AZURE.NOTE] You may see warnings if you run the **authorize** command immediately after the **createazureid** command. There is some latency between when the Azure AD account is created and when the account is available for use. If you wait about 10 seconds after running the **createazureid** command to run the **authorize** command, then you should not see these warnings.

4. Check the following folders to confirm that the Audit log JSON files are there:

  - **c:\Users\azlog\AzureResourceManagerJson**
  - **c:\Users\azlog\AzureResourceManagerJsonLD**

5. Check the following folders to confirm that Security Center alerts exist in them:

  - **c:\Users\azlog\ AzureSecurityCenterJson**
  - **c:\Users\azlog\AzureSecurityCenterJsonLD**

6. Point the standard SIEM file forwarder connector to the appropriate folder to pipe the data to the SIEM instance. You may need some field mappings based on the SIEM product you are using.

If you have questions about Azure Log Integration, please send an email to [AzSIEMteam@microsoft.com] (mailto:AzSIEMteam@microsoft.com)

## Next steps

In this tutorial, you learned how to install Azure log integration and integrate logs from Azure storage. To learn more, see the following:

- [Microsoft Azure Log Integration for Azure logs (Preview)](https://www.microsoft.com/download/details.aspx?id=53324) – Download Center for details, system requirements, and install instructions on Azure log integration.
- [Introduction to Azure log integration](security-azure-log-integration-overview.md) – This document introduces you to Azure log integration, its key capabilities, and how it works.
- [Partner configuration steps](https://blogs.msdn.microsoft.com/azuresecurity/2016/08/23/azure-log-siem-configuration-steps/) – This blog post shows you how to configure Azure log integration to work with partner solutions Splunk, HP ArcSight, and IBM QRadar.
- [Azure log Integration frequently asked questions (FAQ)](security-azure-log-integration-faq.md) - This FAQ answers questions about Azure log integration.
- [Integrating Security Center alerts with Azure log Integration](../security-center/security-center-integrating-alerts-with-log-integration.md) – This document shows you how to sync Security Center alerts, along with virtual machine security events collected by Azure Diagnostics and Azure Audit Logs, with your log analytics or SIEM solution.
- [New features for Azure diagnostics and Azure Audit Logs](https://azure.microsoft.com/blog/new-features-for-azure-diagnostics-and-azure-audit-logs/) – This blog post introduces you to Azure Audit Logs and other features that help you gain insights into the operations of your Azure resources.
