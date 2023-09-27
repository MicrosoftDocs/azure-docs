---
title: The data-aware security dashboard
description: Learn about the capabilities and functions of the data-aware security view in Microsoft Defender for Cloud
author: AlizaBernstein
ms.author: v-bernsteina
ms.topic: conceptual
ms.date: 09/27/2023
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

| Aspect | Details |
|---------|---------|
|Release state: | Public Preview |
| Prerequisites: | Defender for CSPM fully enabled, including sensitive data discovery <br/> Workload protection for database and storage to explore active risks |
| Required roles and permissions: | No other roles needed on top of what is required for the security explorer. |
| Clouds: | :::image type="icon" source="./media/icons/yes-icon.png":::  Commercial clouds <br/> :::image type="icon" source="./media/icons/no-icon.png"::: Azure Government <br/> :::image type="icon" source="./media/icons/no-icon.png"::: Azure China 21Vianet |

## Support and prerequisites

Sensitive data discovery is available in the Defender CSPM and Defender for storage plans.

When you enable one of the plans, the sensitive data discovery extension is turned on as part of the plan.

The feature is turned on at the subscription level.

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

### Data resources security status

**Sensitive resources status over time** - displays how data security evolves over time with a graph that shows the number of sensitive resources affected by alerts, attack paths, and recommendations within a defined period (last 30, 14, or 7 days). 

:::image type="content" source="media/data-aware-security-dashboard/data-resources-security-status.png" alt-text="Screenshot that shows the data resources security status section of the data security view." lightbox="media/data-aware-security-dashboard/data-resources-security-status.png":::

## Next steps

- Learn more about [data-aware security posture](concept-data-security-posture.md).
- Learn how to [enable Defender CSPM](tutorial-enable-cspm-plan.md).
