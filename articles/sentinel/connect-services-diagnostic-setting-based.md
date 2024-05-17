---
title: Connect Microsoft Sentinel to other Microsoft services by using diagnostic settings-based connections
description: Learn how to connect Microsoft Sentinel to Microsoft services with diagnostic settings-based connections.
author: yelevin
ms.topic: how-to
ms.date: 02/24/2023
ms.author: yelevin
---

# Connect Microsoft Sentinel to other Microsoft services by using diagnostic settings-based connections

This article describes how to connect to Microsoft Sentinel by using diagnostic settings connections. Microsoft Sentinel uses the Azure foundation to provide built-in, service-to-service support for data ingestion from many Azure and Microsoft 365 services, Amazon Web Services, and various Windows Server services. There are a few different methods through which these connections are made.

This article presents information that is common to the group of data connectors that use diagnostic settings-based connections. Some of these types of connectors are managed by using Azure Policy. For the other connectors of this type, use the standalone instructions.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Standalone diagnostic settings-based connectors

This section covers prerequisites and general installation instructions for the group of data connectors that use standalone diagnostic settings-based connections.

### Prerequisites

To ingest data into Microsoft Sentinel:

- You must have read and write permissions on the Microsoft Sentinel workspace.

### Instructions

1. From the Microsoft Sentinel navigation menu, select **Data connectors**.

1. Select your resource type from the data connectors gallery, and then select **Open Connector Page** on the preview pane.

1. In the **Configuration** section of the connector page, select the link to open the resource configuration page.

    If presented with a list of resources of the desired type, select the link for a resource whose logs you want to ingest.

1. From the resource navigation menu, select **Diagnostic settings**.

1. Select **+ Add diagnostic setting** at the bottom of the list.

1. In the **Diagnostics settings** screen, enter a name in the **Diagnostic settings name** field.

    Mark the **Send to Log Analytics** check box. Two new fields will be displayed below it. Choose the relevant **Subscription** and **Log Analytics Workspace** (where Microsoft Sentinel resides).

1. Mark the check boxes of the types of logs and metrics you want to collect. See our recommended choices for each resource type in the section for the resource's connector in the [Data connectors reference](data-connectors-reference.md) page.

1. Select **Save** at the top of the screen.

For more information, see also [Create diagnostic settings to send Azure Monitor platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md) in the Azure Monitor documentation.

## Azure Policy managed diagnostic settings-based connectors

This section covers prerequisites and general installation instructions for the group of data connectors that use Azure Policy managed  diagnostic settings-based connections.

### Prerequisites

To ingest data into Microsoft Sentinel:

- You must have read and write permissions on the Microsoft Sentinel workspace.

- To use Azure Policy to apply a log streaming policy to your resources, you must have the Owner role for the policy assignment scope.

- Data connector specific requirements:
  
  |Data connector  |Licensing, costs, and other information  |
  |---------|---------|
  |Azure Activity| This connector now uses the diagnostic settings pipeline. If you're using the legacy method, you must disconnect the existing subscriptions from the legacy method before setting up the new Azure Activity log connector.<br><br>1. From the Microsoft Sentinel navigation menu, select **Data connectors**. From the list of connectors, select **Azure Activity**, and then select the **Open connector page** button on the lower right.<br>2. Under the **Instructions** tab, in the **Configuration** section, in step 1, review the list of your existing subscriptions that are connected to the legacy method, and disconnect them all at once by clicking the **Disconnect All** button below.<br>3. Continue setting up the new connector with the instructions in this section. |
  |Azure DDoS Protection|- Configured [Azure DDoS Standard protection plan](../ddos-protection/manage-ddos-protection.md#create-a-ddos-protection-plan).<br>- Configured [virtual network with Azure DDoS Standard enabled](../ddos-protection/manage-ddos-protection.md#enable-for-a-new-virtual-network)<br>- Other charges may apply<br>- The **Status** for Azure DDoS Protection Data Connector changes to **Connected** only when the protected resources are under a DDoS attack.|
  |Azure Storage Account|The storage account (parent) resource has within it other (child) resources for each type of storage: files, tables, queues, and blobs.</br>When configuring diagnostics for a storage account, you must select and configure: <br><br>- The parent account resource, exporting the **Transaction** metric.<br>- Each of the child storage-type resources, exporting all the logs and metrics.<br><br>You will only see the storage types that you actually have defined resources for.|

### Instructions

Connectors of this type use Azure Policy to apply a single diagnostic settings configuration to a collection of resources of a single type, defined as a scope. You can see the log types ingested from a given resource type on the left side of the connector page for that resource, under **Data types**.

1. From the Microsoft Sentinel navigation menu, select **Data connectors**.

1. Select your resource type from the data connectors gallery, and then select **Open Connector Page** on the preview pane.

1. In the **Configuration** section of the connector page, expand any expanders you see there and select the **Launch Azure Policy Assignment wizard** button.

    The policy assignment wizard opens, ready to create a new policy, with a policy name pre-populated.

    1. In the **Basics** tab, select the button with the three dots under **Scope** to choose your subscription (and, optionally, a resource group). You can also add a description.

    1. In the **Parameters** tab:
       - Clear the **Only show parameters that require input** check box.
       - If you see **Effect** and **Setting name** fields, leave them as is.
       - Choose your Microsoft Sentinel workspace from the **Log Analytics workspace** drop-down list.
       - The remaining drop-down fields represent the available diagnostic log types. Leave marked as “True” all the log types you want to ingest.

    1. The policy will be applied to resources added in the future. To apply the policy on your existing resources as well, select the **Remediation** tab and mark the **Create a remediation task** check box.

    1. In the **Review + create** tab, click **Create**. Your policy is now assigned to the scope you chose.

With this type of data connector, the connectivity status indicators (a color stripe in the data connectors gallery and connection icons next to the data type names) will show as *connected* (green) only if data has been ingested at some point in the past 14 days. Once 14 days have passed with no data ingestion, the connector will show as being disconnected. The moment more data comes through, the *connected* status will return.

You can find and query the data for each resource type using the table name that appears in the section for the resource's connector in the [Data connectors reference](data-connectors-reference.md) page. For more information, see [Create diagnostic settings to send Azure Monitor platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md?tabs=CMD) in the Azure Monitor documentation.

## Next steps

For more information, see:

- [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md)
- [Threat intelligence integration in Microsoft Sentinel](threat-intelligence-integration.md)