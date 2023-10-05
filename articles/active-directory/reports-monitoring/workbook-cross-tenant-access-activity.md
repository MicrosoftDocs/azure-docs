---

title: Cross-tenant access activity workbook in Microsoft Entra ID
description: Learn how to use the cross-tenant access activity workbook.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 10/03/2023
ms.author: sarahlipsey
---

# Cross-tenant access activity workbook

As an IT administrator, you want insights into how your users are collaborating with other organizations. The cross-tenant access activity workbook helps you understand which external users are accessing resources in your organization, and which organizations’ resources your users are accessing. This workbook combines all your organization’s inbound and outbound collaboration into a single view.

This article provides you with an overview of the **Cross-tenant access activity** workbook.


## Description

![Image showing this workbook is found under the Usage category](./media/workbook-cross-tenant-access-activity/workbook-category.png)

Tenant administrators who are making changes to policies governing cross-tenant access can use this workbook to visualize and review existing access activity patterns before making policy changes. For example, you can identify the apps your users are accessing in external organizations so that you don't inadvertently block critical business processes. Understanding how external users access resources in your tenant (inbound access) and how users in your tenant access resources in external tenants (outbound access) helps ensure you have the right cross-tenant policies in place.

For more information, see the [Microsoft Entra External ID documentation](../external-identities/index.yml).

## How to access the workbook

[!INCLUDE [how to access workbooks](~/articles/active-directory/includes/how-to-access-workbooks.md)]
3. Select the **Cross-tenant access activity** workbook from the **Usage** section.

## Sections

This workbook has four sections:

- All inbound and outbound activity by tenant ID

- Sign-in status summary by tenant ID for inbound and outbound collaboration

- Applications accessed for inbound and outbound collaboration by tenant ID

- Individual users for inbound and outbound collaboration by tenant ID

The total number of external tenants that have had cross-tenant access activity with your tenant is shown at the top of the workbook. 

![Screenshot of the first section of the workbook.](./media/workbook-cross-tenant-access-activity/cross-tenant-activity-top.png)

The **External Tenant** list shows all the tenants that have had inbound or outbound activity with your tenant. When you select an external tenant in the table, the sections after the table display information about outbound and inbound activity for that tenant.

![Screenshot of the external tenant list.](./media/workbook-cross-tenant-access-activity/cross-tenant-activity-external-tenant-list.png)

When you select an external tenant from the list with outbound activity, associated details appear in the **Outbound activity** table. The same applies when you select an external tenant with inbound activity. Select the **Inbound activity** tab to view the details of an external tenant with inbound activity.

![Screenshot of the outbound and inbound activity, with the outbound and inbound options highlighted.](./media/workbook-cross-tenant-access-activity/cross-tenant-activity-outbound-inbound-activity.png)

When you're viewing external tenants with outbound activity, the subsequent two tables display details for the application and user activity appear. When you're viewing external tenants with inbound activity, the same tables show inbound application and user activity. These tables are dynamic and based on what was previously selected, so make sure you're viewing the correct tenant and activity.

## Filters

This workbook supports multiple filters:

- Time range (up to 90 days)

- External tenant ID

- User principal name

- Application

- Status of the sign-in (success or failure)

![Screenshot showing workbook filters](./media/workbook-cross-tenant-access-activity/workbook-filters.png)

## Best practices

Use this workbook to:

- Get the information you need to manage your cross-tenant access settings effectively, without breaking legitimate collaborations

- Identify all inbound sign-ins from external Microsoft Entra organizations

- Identify all outbound sign-ins by your users to external Microsoft Entra organizations
