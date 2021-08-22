---
title: Connect to Azure, Windows, and Microsoft services
description: Learn how to connect Azure Sentinel to Azure and Microsoft 365 cloud services and to Windows Server event logs.
author: yelevin
manager: rkarlin
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.date: 08/18/2021
ms.author: yelevin
---
# Connect to Azure, Windows, Microsoft, and Amazon services

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

Azure Sentinel uses the Azure foundation to provide built-in, service-to-service support for data ingestion from many Azure and Microsoft 365 services, Amazon Web Services, and various Windows Server services. There are a few different methods through which these connections are made, and this article will outline the procedures for making these connections.

This article will present information that is common to groups of connectors. See the accompanying [data connector reference](data-connectors-reference.md) page for information that is unique to each connector - for example, licensing prerequisites and Log Analytics tables for data storage.

The following integrations are both more unique and more popular, and so are treated individually in their own articles:
- [Microsoft 365 Defender](connect-microsoft-365-defender.md)
- [Azure Defender](connect-azure-security-center.md)
- [Azure Active Directory](connect-azure-active-directory.md)
- [Windows Security Events](connect-windows-security-events.md)
- [Amazon Web Services (AWS) CloudTrail](connect-aws.md)

There are three main groups of connectors of this type that will be treated in this article:
- **"One-click"** connections, including **Subscription-based** connections
- **Diagnostic settings** connections, an increasing number of which are managed by Azure Policy
- **Log Analytics agent**-based connections

## One-click connections

This section's following instructions apply to the following connectors:

- [Azure Active Directory](data-connectors-reference.md#azure-active-directory)
- [Azure Active Directory Identity Protection](data-connectors-reference.md#azure-active-directory-identity-protection)
- [Azure Defender](data-connectors-reference.md#azure-defender)
- [Azure Defender for IoT](data-connectors-reference.md#azure-defender-for-iot)
- [Dynamics 365](data-connectors-reference.md#dynamics-365)
- [Microsoft Cloud App Security](data-connectors-reference.md#microsoft-cloud-app-security-mcas)
- [Microsoft Defender for Endpoint](data-connectors-reference.md#microsoft-defender-for-endpoint)
- [Microsoft Defender for Identity](data-connectors-reference.md#microsoft-defender-for-identity)
- [Microsoft Defender for Office 365](data-connectors-reference.md#microsoft-defender-for-office-365)
- [Office 365 Activity](data-connectors-reference.md#microsoft-office-365)

### Prerequisites

### Instructions

## Diagnostic settings-based connections

This section's following instructions apply to the following connectors:

- [Azure Activity](data-connectors-reference.md#azure-activity)
- [Azure DDoS Protection](data-connectors-reference.md#azure-ddos-protection)
- [Azure Firewall](data-connectors-reference.md#azure-firewall)
- [Azure Key Vault](data-connectors-reference.md#azure-key-vault)
- [Azure Kubernetes Service (AKS)](data-connectors-reference.md#azure-kubernetes-service-aks)
- [Azure SQL Databases](data-connectors-reference.md#azure-sql-databases)
- [Azure Storage Account](data-connectors-reference.md#azure-storage-account)
- [Azure Web Application Firewall](data-connectors-reference.md#azure-web-application-firewall-waf)

### Prerequisites

### Instructions

## Log Analytics agent-based connections

This section's following instructions apply to the following connectors:

- [Domain Name Server](data-connectors-reference.md#domain-name-server)
- [Security Events](connect-windows-security-events.md)
- [Windows Firewall](data-connectors-reference.md#windows-firewall)

### Prerequisites

### Instructions

To ingest data into Azure Sentinel:

- You must have read and write permissions on the Azure Sentinel workspace.

- To use Azure Policy to apply a log streaming policy to Azure Key Vault resources, you must have the Owner role for the policy assignment scope.

## Connect to Azure Key Vault

This connector uses Azure Policy to apply a single Azure Key Vault log streaming configuration to a collection of instances, defined as a scope. You can see the log types ingested from Azure Key Vault on the left side of connector page, under **Data types**.

1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. Select **Azure Key Vault** from the data connectors gallery, and then select **Open Connector Page** on the preview pane.

1. In the **Configuration** section of the connector page, expand **Stream diagnostics logs from your Azure Key Vault at scale**.

1. Select the **Launch Azure Policy Assignment wizard** button.

    The policy assignment wizard opens, ready to create a new policy called **Deploy - Configure diagnostic settings for Azure Key Vault to Log Analytics workspace**.

    1. In the **Basics** tab, click the button with the three dots under **Scope** to select your subscription (and, optionally, a resource group). You can also add a description.

    1. In the **Parameters** tab, leave the **Effect** and **Setting name** fields as is. Choose your Azure Sentinel workspace from the **Log Analytics workspace** drop-down list. The remaining drop-down fields represent the available diagnostic log types. Leave marked as “True” all the log types you want to ingest.

    1. The policy will be applied to resources added in the future. To apply the policy on your existing resources as well, select the **Remediation** tab and mark the **Create a remediation task** check box.

    1. In the **Review + create** tab, click **Create**. Your policy is now assigned to the scope you chose.

> [!NOTE]
>
> With this particular data connector, the connectivity status indicators (a color stripe in the data connectors gallery and connection icons next to the data type names) will show as *connected* (green) only if data has been ingested at some point in the past 14 days. Once 14 days have passed with no data ingestion, the connector will show as being disconnected. The moment more data comes through, the *connected* status will return.

## Next steps

In this document, you learned how to use Azure Policy to connect Azure Key Vault to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
