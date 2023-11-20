---
title: The data-aware security dashboard
description: Learn about the capabilities and functions of the data-aware security view in Microsoft Defender for Cloud
ms.topic: conceptual
ms.date: 11/15/2023
---

# Data security dashboard

The data security dashboard addresses the need for an interactive, data-centric security dashboard that illuminates significant risks to customers' sensitive data.  This tool effectively prioritizes alerts and potential attack paths for data across multicloud data resources, making data protection management less overwhelming and more effective.

## Capabilities

- You can view a centralized summary of your cloud data estate that identifies the location of sensitive data, so that you can discover the most critical data resources affected.
- You can identify the data resources that are at risk and that require attention, so that you can prioritize actions that explore, prevent and respond to sensitive data breaches.
- Investigate active high severity threats that lead to sensitive data
- Explore potential threats data by highlighting [attack paths](concept-attack-path.md) that lead to sensitive data.
- Explore useful data insights by highlighting useful data queries in the [security explorer](how-to-manage-cloud-security-explorer.md).

You can select any element on the page to get more detailed information.

## Before you start

- You must [enable Defender CSPM](tutorial-enable-cspm-plan.md) and the [sensitive data discovery extension](tutorial-enable-cspm-plan.md#enable-the-components-of-the-defender-cspm-plan) within Defender CSPM.  
- To receive the alerts for data sensitivity 
    - for storage related alerts, you must [enable the Defender for Storage plan](tutorial-enable-storage-plan.md).
    - for database related alerts, you must [enable the Defender for Databases plan](tutorial-enable-databases-plan.md).

> [!NOTE]
> The feature is turned on at the subscription level.

### Required roles and permissions: 

No other roles needed aside from what is required for the security explorer.

To access the dashboard with more than 1000 subscriptions, you must have tenant-level permissions, which include one of the following roles: **Global Reader**, **Global Administrator**, **Security Administrator**, or **Security Reader**.

## Data security overview section

The data security overview section provides a general overview of your cloud data estate, per cloud, including all data resources, divided into storage assets, managed databases, and hosted databases (IaaS).

:::image type="content" source="media/data-aware-security-dashboard/data-security-overview.png" alt-text="Screenshot that shows the overview section of the data security view." lightbox="media/data-aware-security-dashboard/data-security-overview.png":::

**By coverage status** - displays the limited data coverage for resources without Defender CSPM workload protection:

- **Covered** – resources that have the necessary Defender CSPM, or Defender for Storage, or Defender for Databases enabled.
- **Partially covered** – missing either the Defender CSPM, Defender for Storage, or Defender for Storage plan. Select the tooltip to present a detailed view of what is missing.
- **Sensitive resources** – displays how many resources are sensitive.
- **Sensitive resources requiring attention** - displays the number of sensitive resources that have either high severity security alerts or attack paths.

## Top issues

The **Top issues** section provides a highlighted view of top active and potential risks to sensitive data.

- **Sensitive data resources with high severity alerts** - summarizes the active threats to sensitive data resources and which data types are at risk.
- **Sensitive data resources in attack paths** - summarizes the potential threats to sensitive data resources  by presenting attack paths leading to sensitive data resources and which data types are at potential risk.
- **Data queries in security explorer** - presents the top data-related queries in security explorer that helps focus on multicloud risks to sensitive data.

    :::image type="content" source="media/data-aware-security-dashboard/top-issues.png" alt-text="Screenshot that shows the top issues section of the data security view." lightbox="media/data-aware-security-dashboard/top-issues.png":::

## Closer look

The **Closer look** section provides a more detailed view into the sensitive data within the organization.

- **Sensitive data discovery** - summarizes the results of the sensitive resources discovered, allowing customers to explore a specific sensitive information type and label.
- **Internet-exposed data resources** - summarizes the discovery of sensitive data resources that are internet-exposed for storage and managed databases.
  
    :::image type="content" source="media/data-aware-security-dashboard/closer-look.png" alt-text="Screenshot that shows the closer look section of the data security dashboard." lightbox="media/data-aware-security-dashboard/closer-look.png":::

You can select the **Manage data sensitivity settings** to get to the **Data sensitivity** page.  The **Data sensitivity** page allows you to manage the data sensitivity settings of cloud resources at the tenant level, based on selective info types and labels originating from the Purview compliance portal, and [customize sensitivity settings](data-sensitivity-settings.md) such as creating your own customized info types and labels, and setting sensitivity label thresholds.

:::image type="content" source="media/data-aware-security-dashboard/manage-security-sensitivity-settings.png" alt-text="Screenshot that shows where to access managing data sensitivity settings." lightbox="media/data-aware-security-dashboard/manage-security-sensitivity-settings.png":::

## Next steps

- Learn more about [data-aware security posture](concept-data-security-posture.md).
- Learn how to [enable Defender CSPM](tutorial-enable-cspm-plan.md).
