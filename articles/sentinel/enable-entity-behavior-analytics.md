---
title: Enable entity behavior analytics to detect advanced threats
description: Enable User and Entity Behavior Analytics in Microsoft Sentinel, and configure data sources
author: guywi-ms
ms.author: guywild
ms.topic: how-to
ms.date: 10/16/2024
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security
ms.custom: sfi-image-nochange


#Customer intent: As a security analyst, I want to configure User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel so that I can detect and analyze anomalous activities more effectively.

---

# Enable User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel

User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel analyzes logs and alerts from connected data sources to build baseline behavioral profiles of your organization's entities—such as users, hosts, IP addresses, and applications. Using machine learning, UEBA identifies anomalous activity that may indicate a compromised asset.

You can enable User and Entity Behavior Analytics in two ways, both with the same result:

- **From the Microsoft Sentinel workspace settings**: Enable UEBA for your workspace and select which data sources to connect in the Microsoft Defender portal or Azure portal.
- **From supported data connectors**: Enable UEBA when you configure UEBA supported data connectors in the Microsoft Defender portal.

This article explains how to enable UEBA and configure data sources from your Microsoft Sentinel workspace settings and from supported data connectors. 

For more information about UEBA, see [Identify threats with entity behavior analytics](identify-threats-with-entity-behavior-analytics.md).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]
[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Prerequisites

To enable or disable this feature (these prerequisites aren't required to use the feature):

- Your user must be assigned to the Microsoft Entra ID **Security Administrator** role in your tenant or the equivalent permissions.

- Your user must be assigned at least one of the following **Azure roles** ([Learn more about Azure RBAC](roles.md)):
    - **Microsoft Sentinel Contributor** at the workspace or resource group levels.
    - **Log Analytics Contributor** at the resource group or subscription levels.

- Your workspace must not have any Azure resource locks applied to it. [Learn more about Azure resource locking](../azure-resource-manager/management/lock-resources.md).

> [!NOTE]
> - No special license is required to add UEBA functionality to Microsoft Sentinel, and there's no extra cost for using it.
> - However, since UEBA generates new data and stores it in new tables that UEBA creates in your Log Analytics workspace, **additional data storage charges** apply. 

## Enable UEBA from workspace settings

To enable UEBA from your Microsoft Sentinel workspace settings:

1. Go to the **Entity behavior configuration** page.

    # [Azure portal](#tab/azure)

    Use any one of these three ways to get to the **Entity behavior configuration** page:

    - Select **Entity behavior** from the Microsoft Sentinel navigation menu, then select **Entity behavior settings** from the top menu bar.

    - Select **Settings** from the Microsoft Sentinel navigation menu, select the **Settings** tab, then under the **Entity behavior analytics** expander, select **Set UEBA**.

    - From the Microsoft Defender XDR data connector page, select the **Go the UEBA configuration page** link.

    # [Defender portal](#tab/defender)

    To get to the **Entity behavior configuration** page:

    1. From the Microsoft Defender portal navigation menu, select **Settings** > **Microsoft Sentinel** > **SIEM workspaces**.
    1. Select the workspace you want to configure.
    1. From the workspace configuration page, select **Entity behavior analytics** > **Configure UEBA**. 

    ---

1. On the **Entity behavior configuration** page, toggle on **Turn on UEBA feature**.

    :::image type="content" source="media/enable-entity-behavior-analytics/entity-behavior-analytics-configuration.png" alt-text="Screenshot of UEBA configuration settings." lightbox="media/enable-entity-behavior-analytics/entity-behavior-analytics-configuration.png":::

1. Select the directory services from which you want to synchronize user entities with Microsoft Sentinel.

    - **Active Directory** on-premises (Preview)
    - **Microsoft Entra ID**

    To sync user entities from on-premises Active Directory, you must onboard your Azure tenant to Microsoft Defender for Identity (either standalone or as part of Microsoft Defender XDR) and you must have the MDI sensor installed on your Active Directory domain controller. For more information, see [Microsoft Defender for Identity prerequisites](/defender-for-identity/prerequisites).

1. Select **Connect all data sources** to connect all eligible data sources, or select specific data sources from the list.

    You can only enable these data sources from the Defender and the Azure portals:
    - Signin Logs
    - Audit Logs
    - Azure Activity    
    - Security Events

    You can enable these data sources from the Defender portal only (preview):
    
    - AAD Managed Identity Signin logs (Microsoft Entra ID)
    - AAD Service Principal Signin logs (Microsoft Entra ID)
    - AWS CloudTrail
    - Device Logon Events
    - Okta CL
    - GCP Audit Logs

    For more information about UEBA data sources and anomalies, see [Microsoft Sentinel UEBA reference](./ueba-reference.md) and [UEBA anomalies](./anomalies-reference.md#ueba-anomalies).

    > [!NOTE]
    > After enabling UEBA, you can enable supported data sources for UEBA directly from the data connector pane, or from the Defender portal Settings page, as described in this article.

1. Select **Connect**. 

1. Enable anomaly detection in your Microsoft Sentinel workspace:

    1. From the Microsoft Defender portal navigation menu, select **Settings** > **Microsoft Sentinel** > **SIEM workspaces**.
    1. Select the workspace you want to configure.
    1. From the workspace configuration page, select **Anomalies** and toggle on **Detect Anomalies**. 

## Enable UEBA from supported connectors

[!INCLUDE [data-connector-behavior-analytics](includes/data-connector-behavior-analytics.md)] 

For more information about configuring Microsoft Sentinel data connectors, see [Connect data sources to Microsoft Sentinel by using data connectors](./configure-data-connector.md).

## Enable the UEBA behaviors layer (Preview)

The UEBA behaviors layer generates enriched summaries of activity observed across multiple data sources. Unlike alerts or anomalies, behaviors don’t necessarily indicate risk - they create an abstraction layer that optimizes your data for investigations, hunting, and detection by enhancing

For more information about the UEBA behaviors layer and how to enable it, see [Enable the UEBA behaviors layer in Microsoft Sentinel](../sentinel/entity-behaviors-layer.md). 

## Next steps

In this article, you learned how to enable and configure User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel. For more information about UEBA:

> [!div class="nextstepaction"]
>>[Identify threats with UEBA](./identify-threats-with-entity-behavior-analytics.md)
