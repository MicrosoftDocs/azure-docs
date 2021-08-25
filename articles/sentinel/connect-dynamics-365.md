---
title: Connect Dynamics 365 logs to Azure Sentinel | Microsoft Docs
description: Learn to use the Dynamics 365 Common Data Service (CDS) activities connector to bring in information about ongoing admin, user, and support activities.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/03/2021
ms.author: yelevin

---
# Connect Dynamics 365 activity logs to Azure Sentinel

The [Dynamics 365](/office365/servicedescriptions/microsoft-dynamics-365-online-service-description) Common Data Service (CDS) activities connector provides insight into admin, user, and support activities, as well as Microsoft Social Engagement logging events. By connecting Dynamics 365 CRM logs into Azure Sentinel, you can view this data in workbooks, use it to create custom alerts, and leverage it to improve your investigation process. This new Azure Sentinel connector collects the Dynamics CDS data from the Office Management API. To learn more about the Dynamics CDS activities audited in Power Platform, visit [Enable and Use Activity Logging](/power-platform/admin/enable-use-comprehensive-auditing).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Prerequisites

- You must have read and write permissions on your Azure Sentinel workspace.

- You must have a [Microsoft Dynamics 365 production license](/office365/servicedescriptions/microsoft-dynamics-365-online-service-description). This connector is not available for sandbox environments.
    - A Microsoft 365 Enterprise [E3 or E5](/power-platform/admin/enable-use-comprehensive-auditing#requirements) subscription is required to do Activity Logging.

- To pull data from the Office Management API:
    - You must be a global administrator on your tenant.

    - [Office audit logging](/office365/servicedescriptions/office-365-platform-service-description/office-365-securitycompliance-center) must be enabled in [Office Security and Compliance Center](/microsoft-365/compliance/search-the-audit-log-in-security-and-compliance).

## Enable the Dynamics 365 activities data connector

1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select **Dynamics 365**, and then select **Open connector page** on the preview pane.

1. On the **Instructions** tab, under **Configuration**, click **Connect**. 

    Once the connector is activated, it will take around 30 minutes until you will be able to see data arriving in the graph. 

    According to the [Office audit log in the compliance center](/microsoft-365/compliance/search-the-audit-log-in-security-and-compliance#requirements-to-search-the-audit-log), it can take up to 30 minutes or up to 24 hours after an event occurs for the corresponding audit log record to be returned in the results.

1. The Microsoft Dynamics audit logs can be found in the `Dynamics365Activity` table. See the table's [schema reference](/azure/azure-monitor/reference/tables/dynamics365activity).

## Querying the data

1. From the Azure Sentinel navigation menu, select **Logs**.

1. Run the following query to verify that logs arrive:

    ```kusto
    Dynamics365Activity
    | take 10
    ```


## Next steps
In this document, you learned how to connect Dynamics 365 activities data to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started detecting threats with Azure Sentinel, using [built-in](detect-threats-built-in.md) or [custom](detect-threats-custom.md) rules.
