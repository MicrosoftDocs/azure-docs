---
title: Integrate SAP across multiple workspaces
description: Learn how to work with the Microsoft Sentinel solution for SAP applications in multiple workspaces for different deployment scenarios.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 09/15/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security

#Customer intent: As a security manager, I want to use Microsoft Sentinel for SAP applications across multiple workspaces so that I can ensure compliance with data residency requirements and facilitate collaboration between SOC and SAP teams.

---

# Integrate SAP across multiple workspaces


When you set up your Log Analytics workspace enabled for Microsoft Sentinel, you have [multiple architecture options](/azure/azure-monitor/logs/workspace-design?toc=/azure/sentinel/TOC.json&bc=/azure/sentinel/breadcrumb/toc.json) and factors to consider. Taking into account geography, regulation, access control, and other factors, you might choose to have multiple workspaces in your organization.

When working with SAP, your SAP and SOC teams might need to work in separate workspaces to maintain security boundaries. You might not want the SAP team to have visibility into all other security logs across your organization. However, the SAP BASIS team plays a critical role in successfully implementing and maintaining the Microsoft Sentinel solution for SAP applications. Their technical knowledge is essential for effectively monitoring SAP systems, configuring security settings, and ensuring that proper incident response procedures are in place. For this reason, the SAP BASIS team must have access to the Log Analytics workspace enabled for Microsoft Sentinel, allowing them to collaborate with the SOC team while focusing specifically on SAP-related security monitoring.

This article discusses how to work with the Microsoft Sentinel solution for SAP applications in multiple workspaces, with improved flexibility for:

- Managed security service providers (MSSPs) or a global or federated security operations center (SOC).
- Data residency requirements.
- Organizational hierarchy and IT design.
- Insufficient role-based access control (RBAC) in a single workspace.

> [!IMPORTANT]
> Working with multiple workspaces is currently in preview. This feature is provided without a service-level agreement. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!NOTE]
> Multi-workspace support is available only with the data connector agent, and isn't supported with the [SAP agentless solution](deployment-overview.md#data-connector) (limited preview).

## SAP and SOC data maintained in separate workspaces

If your SAP and SOC teams have separate Log Analytics workspaces enabled for Microsoft Sentinel where team data is kept, we recommend that you provide some or all SOC team members with the **Sentinel Reader** role for the SAP BASIS team's workspace. This enables both teams to see SAP data by using cross-workspace queries.

:::image type="content" source="media/cross-workspace/sap-cross-workspace-separate.png" alt-text="Diagram of separate workspaces for your SAP and SOC teams." border="false":::

Maintaining separate workspaces for the SAP and SOC data has the following benefits:

|Benefit  |Description  |
|---------|---------|
|**Alerts**     |   Microsoft Sentinel can trigger alerts that include both SOC and SAP data, and it can run those alerts on the SOC workspace.  |
|**Data isolation**     |   The SAP BASIS team has its own workspace that includes all features except detections that include both SOC and SAP data.   <br><br>The SOC can see and investigate SAP incidents. If the SAP BASIS team faces an event that it can't explain by using existing data, the team can assign the incident to the SOC.   |
|**Flexibility**     |   The SAP BASIS team can focus on the control of internal threats in its landscape, and the SOC can focus on external threats.     |
|**Pricing**     |  There's no extra charge for ingestion fees, because data is ingested only once into Microsoft Sentinel. However, each workspace has its own [pricing tier](../design-your-workspace-architecture.md#step-5-collecting-any-non-soc-data).       |

The following table maps data and feature access for SAP and SOC teams when they each maintain their own workspace:

|Function  |SOC team  |SAP BASIS team  |
|---------|---------|---------|
|SOC workspace access     | &#x2705;         | &#10060;     |
|SAP workspace data, analytics rules, functions, watchlists, and workbooks access     | &#x2705;         | &#x2705;<sup>*</sup>         |
|SAP incident access and collaboration     | &#x2705;          | &#x2705;<sup>*</sup>          |

<sup>*</sup> The SOC team can see these functions in both workspaces. The SAP BASIS team can see these functions only in the SAP workspace.

> [!NOTE]
> Running cross-workspace queries across larger SAP landscapes can affect performance. For improved performance and cost optimizations, consider having both the SOC and SAP workspaces on the same dedicated cluster. For more information, see [Create and manage a dedicated cluster in Azure Monitor Logs](/azure/azure-monitor/logs/logs-dedicated-clusters?tabs=cli#cluster-pricing-model).

## SAP and SOC data maintained in the same workspace

You might want to keep all data in a single workspace and apply access controls to determine who on your team is able to access the data.

To do this, use the following steps:

- **Use Log Analytics in Azure Monitor to manage access to data by resource**. For more information, see [Manage access to Microsoft Sentinel data by resource](../resource-context-rbac.md).

- **Associate SAP resources with an Azure resource ID**. This option is supported only for a data connector agent deployed via CLI. Specify the required `azure_resource_id` field in the connector configuration section on the data collector that you use to ingest data from the SAP system into Microsoft Sentinel. For more information, see [Deploy an SAP data connector agent from the command line](deploy-command-line.md) and [Connector configuration](reference-systemconfig-json.md#connector-configuration).

:::image type="content" source="media/cross-workspace/sap-cross-workspace-combined.png" alt-text="Diagram that shows how to work with the Microsoft Sentinel solution for SAP applications by using the same workspace for SAP and SOC data." border="false":::

After the data collector agent is configured with the correct resource ID, the SAP BASIS team can access the specific SAP data in the SOC workspace by using a resource-scoped query. The SAP BASIS team can't read any of the other, non-SAP data types.

There are no costs associated with this approach because the data is ingested only once into Microsoft Sentinel.

When you manage access by resource, the SAP BASIS team sees only raw and unformatted data, accessible via Log Analytics or Power BI. The SAP BASIS team can't use any Microsoft Sentinel features.

## Related content

For more information, see [Deploy Microsoft Sentinel solution for SAP applications](deployment-overview.md).
