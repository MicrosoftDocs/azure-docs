---
title: Connect Azure Sentinel to Azure, Windows, and Microsoft services
description: Learn how to connect Azure Sentinel to Azure and Microsoft 365 cloud services and to Windows Server event logs.
author: yelevin
manager: rkarlin
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.date: 08/18/2021
ms.author: yelevin
---
# Connect Azure Sentinel to Azure, Windows, Microsoft, and Amazon services

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

Azure Sentinel uses the Azure foundation to provide built-in, service-to-service support for data ingestion from many Azure and Microsoft 365 services, Amazon Web Services, and various Windows Server services. There are a few different methods through which these connections are made, and this article describes how to make these connections.

This article discusses the following types of connectors:

- **API-based** connections
- **Diagnostic settings** connections, some of which are managed by Azure Policy
- **Log Analytics agent**-based connections

This article presents information that is common to groups of connectors. See the accompanying [data connector reference](data-connectors-reference.md) page for information that is unique to each connector, such as licensing prerequisites and Log Analytics tables for data storage.

The following integrations are both more unique and more popular, and are treated individually, with their own articles:

- [Microsoft 365 Defender](connect-microsoft-365-defender.md)
- [Azure Defender](connect-azure-security-center.md)
- [Azure Active Directory](connect-azure-active-directory.md)
- [Windows Security Events](connect-windows-security-events.md)
- [Amazon Web Services (AWS) CloudTrail](connect-aws.md)


## API-based connections

### Prerequisites

- You must have read and write permissions on the Log Analytics workspace.
- You must have the Global administrator or Security administrator role on your Azure Sentinel workspace's tenant.

### Instructions

1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. Select your service from the data connectors gallery, and then select **Open Connector Page** on the preview pane.

1. Select **Connect** to start streaming events and/or alerts from your service into Azure Sentinel.

1. If on the connector page there is a section titled **Create incidents - recommended!**, select **Enable** if you want to automatically create incidents from alerts.

You can find and query the data for each service using the table names that appear in the section for the service's connector in the [Data connectors reference](data-connectors-reference.md) page.

## Diagnostic settings-based connections

The configuration of some connectors of this type is managed by Azure Policy. Select the **Azure Policy** tab below for instructions. For the other connectors of this type, select the **Standalone** tab.

# [Standalone](#tab/SA)

### Prerequisites

To ingest data into Azure Sentinel:

- You must have read and write permissions on the Azure Sentinel workspace.

### Instructions

1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. Select your resource type from the data connectors gallery, and then select **Open Connector Page** on the preview pane.

1. In the **Configuration** section of the connector page, select the link to open the resource configuration page.

    If presented with a list of resources of the desired type, select the link for a resource whose logs you want to ingest.

1. From the resource navigation menu, select **Diagnostic settings**.

1. Select **+ Add diagnostic setting** at the bottom of the list.

1. In the **Diagnostics settings** screen, enter a name in the **Diagnostic settings name** field.

    Mark the **Send to Log Analytics** check box. Two new fields will be displayed below it. Choose the relevant **Subscription** and **Log Analytics Workspace** (where Azure Sentinel resides).

1. Mark the check boxes of the types of logs and metrics you want to collect. See our recommended choices for each resource type in the section for the resource's connector in the [Data connectors reference](data-connectors-reference.md) page.

1. Select **Save** at the top of the screen.

# [Azure Policy](#tab/AP)

### Prerequisites

To ingest data into Azure Sentinel:

- You must have read and write permissions on the Azure Sentinel workspace.

- To use Azure Policy to apply a log streaming policy to your resources, you must have the Owner role for the policy assignment scope.

### Instructions

Connectors of this type use Azure Policy to apply a single diagnostic settings configuration to a collection of resources of a single type, defined as a scope. You can see the log types ingested from a given resource type on the left side of the connector page for that resource, under **Data types**.

1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. Select your resource type from the data connectors gallery, and then select **Open Connector Page** on the preview pane.

1. In the **Configuration** section of the connector page, expand any expanders you see there and select the **Launch Azure Policy Assignment wizard** button.

    The policy assignment wizard opens, ready to create a new policy, with a policy name pre-populated.

    1. In the **Basics** tab, select the button with the three dots under **Scope** to choose your subscription (and, optionally, a resource group). You can also add a description.

    1. In the **Parameters** tab:
       - Clear the **Only show parameters that require input** check box.
       - If you see **Effect** and **Setting name** fields, leave them as is.
       - Choose your Azure Sentinel workspace from the **Log Analytics workspace** drop-down list.
       - The remaining drop-down fields represent the available diagnostic log types. Leave marked as “True” all the log types you want to ingest.

    1. The policy will be applied to resources added in the future. To apply the policy on your existing resources as well, select the **Remediation** tab and mark the **Create a remediation task** check box.

    1. In the **Review + create** tab, click **Create**. Your policy is now assigned to the scope you chose.

---

> [!NOTE]
>
> With this type of data connector, the connectivity status indicators (a color stripe in the data connectors gallery and connection icons next to the data type names) will show as *connected* (green) only if data has been ingested at some point in the past 14 days. Once 14 days have passed with no data ingestion, the connector will show as being disconnected. The moment more data comes through, the *connected* status will return.

You can find and query the data for each resource type using the table name that appears in the section for the resource's connector in the [Data connectors reference](data-connectors-reference.md) page.

## Log Analytics agent-based connections

### Prerequisites

- You must have read and write permissions on the Log Analytics workspace, and any workspace that contains machines you want to collect logs from.
- You must have the **Log Analytics Contributor** role on the SecurityInsights (Azure Sentinel) solution on those workspaces, in addition to any Azure Sentinel roles.

### Instructions

1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. Select your service (**DNS** or **Windows Firewall**) and then select **Open connector page**.

1. Install and onboard the agent on the device that generates the logs.

    | Machine type  | Instructions  |
    | --------- | --------- |
    | **For an Azure Windows VM** | 1. Under **Choose where to install the agent**, expand **Install agent on Azure Windows virtual machine**. <br><br>2. Select the **Download & install agent for Azure Windows Virtual machines >** link. <br><br>3. In the **Virtual machines** blade, select a virtual machine to install the agent on, and then select **Connect**. Repeat this step for each VM you wish to connect. |
    | **For any other Windows machine** | 1. Under **Choose where to install the agent**, expand **Install agent on non-Azure Windows Machine** <br><br>2. Select the **Download & install agent for non-Azure Windows machines >** link.  <br><br>3. In the **Agents management** blade, on the **Windows servers** tab, select the **Download Windows Agent** link for either 32-bit or 64-bit systems, as appropriate.      |

1. Select the **Install solution** button for either DNS or Windows Firewall.

You can find and query the data for DNS and Windows Firewall using the **DnsEvents**, **DnsInventory**, and **WindowsFirewall** table names, respectively. You can see this and other information about these two service connectors in their sections in the [Data connectors reference](data-connectors-reference.md) page.


## Next steps

In this document, you learned how to connect Azure, Microsoft, and Windows services, as well as Amazon Web Services, to Azure Sentinel. 
- Learn about [Azure Sentinel data connectors](connect-data-sources.md) in general.
- [Find your Azure Sentinel data connector](data-connectors-reference.md).
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).