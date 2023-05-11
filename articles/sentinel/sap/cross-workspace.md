---
title: Working with the Microsoft Sentinel solution for SAP® applications across multiple workspaces
description: This article discusses working with Microsoft Sentinel solution for SAP® applications across multiple workspaces in different scenarios.
author: limwainstein
ms.author: lwainstein
ms.topic: conceptual
ms.date: 03/22/2023
---

# Working with the Microsoft Sentinel solution for SAP® applications across multiple workspaces

When you set up your Microsoft Sentinel workspace, there are [multiple architecture options](../design-your-workspace-architecture.md#decision-tree) and considerations. Considering geography, regulation, access control, and other factors, you may choose to have multiple Sentinel workspaces in your organization. 

This article discusses working with the Microsoft Sentinel solution for SAP® applications across multiple workspaces in different scenarios.

The Microsoft Sentinel solution for SAP® applications natively supports a cross-workspace architecture to allow improved flexibility for: 

- Managed security service providers (MSSPs) or a global or federated SOC
- Data residency requirements 
- Organizational hierarchy/IT design 
- Insufficient role-based access control (RBAC) in a single workspace

> [!IMPORTANT]
> Working with multiple workspaces is currently in PREVIEW. This feature is provided without a service level agreement. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can define multiple workspaces when you [deploy the SAP security content](deploy-sap-security-content.md#deploy-sap-security-content).  

## Collaboration between the SOC and SAP teams in your organization

In this article, we focus on a specific and common use case, where collaboration between the security operations center (SOC) and SAP teams in your organization requires a multi-workspace setup.

Your organization's SAP team has technical knowledge that's critical to successfully and effectively implement the Microsoft Sentinel solution for SAP® applications. Therefore, it's important for the SAP team see the relevant data and collaborate with the SOC on the required configuration and incident response procedures. 

As part of this collaboration, there are two possible scenarios, depending on your organization's needs:

1. **The SAP data and the SOC data reside in separate workspaces**. Both teams can see the SAP data, using [cross-workspace queries](#scenario-1-sap-and-soc-data-reside-in-separate-workspaces).
1. **The SAP data is kept in the SOC workspace**, and SAP team can query the data using [resource context queries](#scenario-2-sap-data-is-kept-in-the-soc-workspace). 

## Scenario 1: SAP and SOC data reside in separate workspaces 

In this scenario, the SAP and SOC teams have separate Microsoft Sentinel workspaces. 

:::image type="content" source="media/cross-workspace/sap-cross-workspace-separate.png" alt-text="Diagram of working with the Microsoft Sentinel solution for SAP® applications in separate workspaces for the SAP and SOC data." border="false":::

When your organization [deploys the Microsoft Sentinel solution for SAP® applications](deploy-sap-security-content.md#deploy-sap-security-content), each team specifies its SAP workspace. 

A common practice is to provide some or all of the SOC team members with the **Sentinel Reader** role on the SAP workspace. 

Creating separate workspaces for the SAP and SOC data has these benefits:

- Microsoft Sentinel can trigger alerts that include both SOC and SAP data, and run those alerts on the SOC workspace. 

   > [!NOTE]
   > For larger SAP landscapes, running queries made by the SOC on data from the SAP workspace can impact performance, because the SAP data must travel to the SOC workspace when being queried. For improved performance and cost optimizations, consider having both the SOC and SAP workspaces on the same [dedicated cluster](../../azure-monitor/logs/logs-dedicated-clusters.md?tabs=cli#cluster-pricing-model).

- The SAP team has its own Microsoft Sentinel workspace, including all features, except for detections that include both SOC and SAP data. 
- Flexibility: The SAP team can focus on the control and internal threats in its landscape, while the SOC can focus on external threats. 
- There is no additional charge for ingestion fees, because data is only ingested once into Microsoft Sentinel. However, note that each workspace has its own [pricing tier](../design-your-workspace-architecture.md#step-5-collecting-any-non-soc-data). 
- The SOC can see and investigate SAP incidents: If the SAP team faces an event they can't explain with the existing data, they can assign the incident to the SOC.   

This table maps out the access of data and features for the SAP and SOC teams in this scenario.

|Function  |SOC team  |SAP team  |
|---------|---------|---------|
|SOC workspace access     | &#x2705;         | &#10060;     |
|SAP workspace data, analytics rules, functions, watchlists, and workbooks access     | &#x2705;         | &#x2705;<sup>1</sup>         |
|SAP incident access and collaboration     | &#x2705;          | &#x2705;<sup>1</sup>          |

<sup>1</sup>The SOC team can see these functions on both workspaces, while the SAP team can see these functions only on the SAP workspace.

## Scenario 2: SAP data is kept in the SOC workspace 

In this scenario, you want to keep all of the data in one workspace and to apply access controls. You can do this using Log Analytics to [manage access to data by resource](../resource-context-rbac.md). You can also associate SAP resources with an Azure resource ID by specifying the required `azure_resource_id` field in the [connector configuration section](reference-systemconfig.md#connector-configuration-section) on the data collector used to ingest data from the SAP system into Microsoft Sentinel. 

:::image type="content" source="media/cross-workspace/sap-cross-workspace-combined.png" alt-text="Diagram of working with the Microsoft Sentinel solution for SAP® applications using the same workspace for the SAP and SOC data." border="false":::

Once the data collector agent is configured with the correct resource ID, the SAP team can access the specific SAP data in the SOC workspace using a resource-scoped query. The SAP team cannot read any of the other, non-SAP data types. 

There are no costs associated with this approach, as the data is only ingested once into Microsoft Sentinel. Using this mode of access, the SAP team only sees raw and unformatted data and cannot use any Microsoft Sentinel features. In addition to accessing the raw data via log analytics, the SAP team can also access the same data [via Power BI](../resource-context-rbac.md).

## Next steps

In this article, you learned about working with Microsoft Sentinel solution for SAP® applications across multiple workspaces in different scenarios.

> [!div class="nextstepaction"]
> [Deploy the Sentinel solution for SAP® applications](deployment-overview.md)
