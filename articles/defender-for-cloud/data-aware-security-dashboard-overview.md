---
title: The data security posture management dashboard
description: Learn about the capabilities and functions of the data security posture management view in Microsoft Defender for Cloud.
ms.topic: conceptual
ms.date: 02/11/2024
---

# Data security dashboard (Preview)

Microsoft Defender for Cloud's data security dashboard provides an interactive view of significant risks to sensitive data. It prioritizes alerts and potential attack paths across multicloud data resources, making data protection management more effective.

With the data security dashboard you can:

- Easily locate and summarize sensitive data resources in your cloud data estate.
- Identify and prioritize data resources at risk to prevent and respond to sensitive data breaches.
- Investigate active high severity threats that lead to sensitive data.
- Explore potential threats data by highlighting [attack paths](concept-attack-path.md) that lead to sensitive data.
- Explore useful data insights by highlighting useful data queries in the [security explorer](how-to-manage-cloud-security-explorer.md).

To access the data security dashboard in Defender for Cloud, select **Data Security**.

:::image type="content" source="media/data-aware-security-dashboard/data-security.png" alt-text="Screenshot that shows you how to navigate to the data security dashboard." lightbox="media/data-aware-security-dashboard/data-security.png":::

## Prerequisites

**To view the dashboard**:

- You must [enable Defender CSPM](tutorial-enable-cspm-plan.md).
- [Enable sensitive data discovery](tutorial-enable-cspm-plan.md#enable-the-components-of-the-defender-cspm-plan) within the Defender CSPM plan.  

**To receive the alerts for data sensitivity**:

- You must [enable Defender for Storage](tutorial-enable-storage-plan.md).

## Required permissions and roles

**Permissions**:

- Microsoft.Security/assessments/read
- Microsoft.Security/assessments/subassessments/read
- Microsoft.Security/alerts/read

**Role** - the minimum required privileged role-based access control role of **Security explorer**.

- Register each relevant Azure subscription to the [Microsoft.Security resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

> [!NOTE]
> The data security dashboard feature is turned on at the subscription level.

## Data security overview section

The data security overview section provides a general overview of your cloud data estate, per cloud, including all data resources, divided into storage assets, managed databases, and hosted databases (IaaS).

:::image type="content" source="media/data-aware-security-dashboard/data-security-overview.png" alt-text="Screenshot that shows the overview section of the data security view." lightbox="media/data-aware-security-dashboard/data-security-overview.png":::

- **Coverage status** - displays the limited data coverage for resources without Defender CSPM workload protection:

  - **Covered** – resources that have the necessary Defender CSPM, or Defender for Storage, or Defender for Databases enabled.
  - **Partially covered** – missing either the Defender CSPM, Defender for Storage, or Defender for Storage plan. Select the tooltip to present a detailed view of what is missing.
  - **Not covered** - resources that aren't covered by Defender CSPM, or Defender for Storage, or Defender for Databases.

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

You can select the **Manage data sensitivity settings** to get to the **Data sensitivity** page. The **Data sensitivity** page allows you to manage the data sensitivity settings of cloud resources at the tenant level, based on selective info types and labels originating from the Purview compliance portal, and [customize sensitivity settings](data-sensitivity-settings.md) such as creating your own customized info types and labels, and setting sensitivity label thresholds.

:::image type="content" source="media/data-aware-security-dashboard/manage-security-sensitivity-settings.png" alt-text="Screenshot that shows where to access managing data sensitivity settings." lightbox="media/data-aware-security-dashboard/manage-security-sensitivity-settings.png":::

## Next steps

- Learn more about [data security posture management](concept-data-security-posture.md).
- Learn how to [enable Defender CSPM](tutorial-enable-cspm-plan.md).
