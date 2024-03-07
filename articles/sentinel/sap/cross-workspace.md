---
title: Microsoft Sentinel solution for SAP apps across multiple workspaces
description: Learn how to work with the Microsoft Sentinel solution for SAP applications in multiple workspaces for different deployment scenarios.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 03/22/2023

# customer intent: As a security admin or SAP admin, I want to know how to use the Microsoft Sentinel solution for SAP applications in multiple workspaces so that I can plan a deployment.
---

# Work with the Microsoft Sentinel solution for SAP applications in multiple workspaces

When you set up your Microsoft Sentinel workspace, you have [multiple architecture options](../design-your-workspace-architecture.md#decision-tree) and factors to consider. Taking into account geography, regulation, access control, and other factors, you might choose to have multiple Microsoft Sentinel workspaces in your organization.

This article discusses how to work with the Microsoft Sentinel solution for SAP applications in multiple workspaces for different deployment scenarios.

The Microsoft Sentinel solution for SAP applications natively supports a cross-workspace architecture to support improved flexibility for:

- Managed security service providers (MSSPs) or a global or federated security operations center (SOC).
- Data residency requirements.
- Organizational hierarchy and IT design.
- Insufficient role-based access control (RBAC) in a single workspace.

> [!IMPORTANT]
> Working with multiple workspaces is currently in preview. This feature is provided without a service-level agreement. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can define multiple workspaces when you [deploy SAP security content](deploy-sap-security-content.md#deploy-the-security-content-from-the-content-hub).  

## Collaboration between the SOC and SAP teams in your organization

A common use case is one in which collaboration between the SOC and SAP teams in your organization requires a multi-workspace setup.

Your organization's SAP team has technical knowledge that's critical to successfully and effectively implement the Microsoft Sentinel solution for SAP applications. Therefore, it's important for the SAP team see the relevant data and to collaborate with the SOC about the required configuration and incident response procedures.

There are two possible scenarios for SOC and SAP team collaboration, depending on your organization's needs:

- Scenario 1: **SAP data and SOC data maintained in separate workspaces**. Both teams can see the SAP data by using [cross-workspace queries](#scenario-1-sap-data-and-soc-data-maintained-in-separate-workspaces).

- Scenario 2: **SAP data kept only in the SOC workspace**. The SAP team can query the data by using [resource context queries](#scenario-2-sap-data-kept-only-in-the-soc-workspace).

## Scenario 1: SAP data and SOC data maintained in separate workspaces

In this scenario, the SAP team and the SOC team have separate Microsoft Sentinel workspaces where team data is kept.

:::image type="content" source="media/cross-workspace/sap-cross-workspace-separate.png" alt-text="Diagram that shows working with the Microsoft Sentinel solution for SAP applications in separate workspaces for SAP and SOC data." border="false":::

When your organization [deploys the Microsoft Sentinel solution for SAP applications](deploy-sap-security-content.md#deploy-the-microsoft-sentinel-solution-for-sap-applications-from-the-content-hub), each team specifies its SAP workspace.

A common practice is to provide some or all SOC team members with the Sentinel Reader role for the SAP workspace.

Creating separate workspaces for the SAP and SOC data has these benefits:

- Microsoft Sentinel can trigger alerts that include both SOC and SAP data, and it can run those alerts on the SOC workspace.

   > [!NOTE]
   > For larger SAP landscapes, running queries that are made by the SOC on data from the SAP workspace can affect performance. The SAP data must travel to the SOC workspace when it's being queried. For improved performance and cost optimizations, consider having both the SOC and SAP workspaces on the same [dedicated cluster](../../azure-monitor/logs/logs-dedicated-clusters.md?tabs=cli#cluster-pricing-model).

- The SAP team has its own Microsoft Sentinel workspace that includes all features except detections that include both SOC and SAP data.
- Flexibility. The SAP team can focus on the control of internal threats in its landscape, and the SOC can focus on external threats.
- There's no additional charge for ingestion fees, because data is ingested only once into Microsoft Sentinel. However, each workspace has its own [pricing tier](../design-your-workspace-architecture.md#step-5-collecting-any-non-soc-data).
- The SOC can see and investigate SAP incidents. If the SAP team faces an event that it can't explain by using existing data, the team can assign the incident to the SOC.

The following table maps the access of data and features for the SAP and SOC teams in this scenario:

|Function  |SOC team  |SAP team  |
|---------|---------|---------|
|SOC workspace access     | &#x2705;         | &#10060;     |
|SAP workspace data, analytics rules, functions, watchlists, and workbooks access     | &#x2705;         | &#x2705;<sup>1</sup>         |
|SAP incident access and collaboration     | &#x2705;          | &#x2705;<sup>1</sup>          |

<sup>1</sup> The SOC team can see these functions in both workspaces. The SAP team can see these functions only in the SAP workspace.

## Scenario 2: SAP data kept only in the SOC workspace

In this scenario, you want to keep all the data in one workspace and to apply access controls. You can do this by using Log Analytics in Azure Monitor to [manage access to data by resource](../resource-context-rbac.md). You can also associate SAP resources with an Azure resource ID by specifying the required `azure_resource_id` field in the [connector configuration section](reference-systemconfig.md#connector-configuration-section) on the data collector that you use to ingest data from the SAP system into Microsoft Sentinel.

:::image type="content" source="media/cross-workspace/sap-cross-workspace-combined.png" alt-text="Diagram that shows how to work with the Microsoft Sentinel solution for SAP applications by using the same workspace for SAP and SOC data." border="false":::

After the data collector agent is configured with the correct resource ID, the SAP team can access the specific SAP data in the SOC workspace by using a resource-scoped query. The SAP team can't read any of the other, non-SAP data types.

There are no costs associated with this approach because the data is ingested only once into Microsoft Sentinel. When you use this mode of access, the SAP team sees only raw and unformatted data. The SAP team can't use any Microsoft Sentinel features. In addition to accessing the raw data via Log Analytics, the SAP team can access the same data [via Power BI](../resource-context-rbac.md).

## Next step

In this article, you learned about working with Microsoft Sentinel solution for SAP applications in multiple workspaces for different deployment scenarios. Next, learn how to deploy the solution:

> [!div class="nextstepaction"]
> [Deploy the Microsoft Sentinel solution for SAP applications](deployment-overview.md)
