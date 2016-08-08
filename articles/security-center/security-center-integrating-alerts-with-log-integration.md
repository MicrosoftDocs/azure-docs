<properties
   pageTitle="Integrating Azure Security Center alerts with Azure log integration (Preview) | Microsoft Azure"
   description="This article helps you get started with integrating Security Center alerts with Azure log integration."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="MBaldwin"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/08/2016"
   ms.author="terrylan"/>

# Integrating Security Center alerts with Azure log integration (Preview)

Many security operations and incident response teams rely on a Security Information and Event Management (SIEM) solution as the starting point for triaging and investigating security alerts. With Azure log integration, customers can sync Azure Security Center alerts, along with virtual machine security events collected by Azure Diagnostics and Azure Audit Logs, with their log analytics or SIEM solution in near real-time.

Azure log integration works with HP ArcSight, Splunk, IBM Qradar, and others.

## What logs can I integrate?

Azure produces extensive logging for every service. These logs are categorized as:

- **Control/Management logs** which give visibility into the Azure Resource Manager CREATE, UPDATE, and DELETE operations.
- **Data Plane logs** which give visibility into the events raised when using an Azure resource. An example is the Windows Event log - security and application logs in a virtual machine.

Azure log integration currently supports the integration of:

- Azure VM logs
- Azure Audit Logs
- Azure Security Center alerts

## Install Azure log integration

Download [Azure log integration](https://www.microsoft.com/download/details.aspx?id=53324).

The Azure log integration service collects telemetry data from the machine on which it is installed.  Telemetry data collected is:

- Exceptions that occur during execution of Azure log integration
- Metrics about the number of queries and events processed
- Statistics about which Azlog.exe command line options are being used

> [AZURE.NOTE] You can turn off collection of telemetry data by unchecking this option.

## Integrate Azure Audit Logs and Security Center alerts

1. Open the command prompt and **cd** into **c:\Program Files\Microsoft Azure Log Integration**.

2. Run the **azlog createazureid** command to create an [Azure Active Directory Service Principal](../active-directory/active-directory-application-objects.md) in the Azure Active Directory (AD) tenants that host the Azure subscriptions.

    You will be prompted for your Azure login.

    > [AZURE.NOTE] You must be the subscription Owner or a Co-Administrator of the subscription.

    Authentication to Azure is done through Azure AD.  Creating a service principal for Azure log integration will create the Azure AD identity that will be given access to read from Azure subscriptions.

3. Run the **azlog authorize <SubscriptionID>** command to assign Reader access on the subscription to the service principal created in step 2. If you don’t specify a **SubscriptionID**, then the service principal will be assigned the Reader role to all subscriptions to which you have access.

    > [AZURE.NOTE] You may see warnings if you run the **authorize** command immediately after the **createazureid** command because there is some latency between when the Azure AD account is created and when the account is available for use. If you wait about 10 seconds after running the **createazureid** command to run the **authorize** command, then you should not see these warnings.

4. Check the following folders to confirm that the Audit log JSON files are there:

  - **c:\Users\azlog\AzureResourceManagerJson**
  - **c:\Users\azlog\AzureResourceManagerJsonLD**

5. Check the following folders to confirm that Security Center alerts exist in them:

  - **c:\Users\azlog\ AzureSecurityCenterJson**
  - **c:\Users\azlog\AzureSecurityCenterJsonLD**

6. Point the standard SIEM file forwarder connector to the appropriate folder to pipe the data to the SIEM instance. Please refer to [SIEM configurations](https://azsiempublicdrops.blob.core.windows.net/drops/ALL.htm) on your SIEM configuration.

## Next steps

To learn more about Azure Audit Logs and property definitions, see:

- [Audit operations with Resource Manager](../resource-group-audit.md)
- [List the management events in a subscription](https://msdn.microsoft.com/library/azure/dn931934.aspx) - To retrieve audit log events.

To learn more about security alerts in Security Center, see [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md).

To learn more about Security Center, see the following:

- [Azure Security Center FAQ](security-center-faq.md) - Find frequently asked questions about using the service.
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) - Get the latest Azure security news and information.
