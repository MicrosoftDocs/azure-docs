---
title: Protecting managed security service provider (MSSPs) intellectual property in Azure Sentinel | Microsoft Docs
description: Learn about how  managed security service providers (MSSPs) can protect the intellectual property they've created in Azure Sentinel.
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.assetid: 10cce91a-421b-4959-acdf-7177d261f6f2
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/11/2021
ms.author: bagol

---
# Protecting MSSP intellectual property in Azure Sentinel

This article describes several methods that managed security service providers (MSSPs) can use to protect intellectual property they've developed in Azure Sentinel, such as Azure Sentinel analytics rules, hunting queries, playbooks, and workbooks.

## Cloud Solutions Providers (CSP)

If you're reselling Azure as a Cloud Solutions Provider (CSP), you're managing the customer's Azure subscription. Thanks to [Admin-On-Behalf-Of (AOBO)](/partner-center/azure-plan-manage), users in the Admin Agents group from your MSSP tenant are granted with Owner access to the customer's Azure subscription, and the customer has no access by default.

If you need to provide customer users with access to the Azure environment, we recommend that you grant them access at the level of the *resource group* so that you can show / hide parts of the environment as needed.

For example:

- You might grant the customer with access to several resource groups where their applications are located, but still keep the Azure Sentinel environment in a separate resource group, where the customer has no access.

- Use this method to enable customers to view selected workbooks and playbooks, which are separate resources that can reside in their own resource group.

If other users from the MSSP tenant, outside of the Admin Agents group, need to access the customer environment, we recommend that you use [Azure Lighthouse](multiple-tenants-service-providers.md). This enables you to grant users or groups with access to a specific scope, such as a resource group or subscription, using one of the built-in roles.

> [!TIP]
> Alternately, if you need to provide your customers with access to the entire subscription, see [Enterprise Agreements (EA) / Pay-as-you-go (PAYG)](#enterprise-agreements-ea--pay-as-you-go-payg).
>

### Sample CSP architecture

The following image describes how permissions might work when providing access to CSP customers:

:::image type="content" source="media/mssp-protect-intellectual-property/csp-customers.png" alt-text="Protect your Azure Sentinel intellectual property with CSP customers.":::

In this image:

- The users granted with **Owner** access are the users in the Admin Agents group, in the MSSP Azure AD tenant attached to the CSP contract.
- Other groups from the MSSP get access to the customer environment via Azure Lighthouse.
- Customer access is managed by Azure RBAC.

With this setup, MSSPs can hide protect their analytics rules, hunting queries and selected workbooks and playbooks.

> [!NOTE]
> - Sometimes, the MSSP Azure AD tenant attached to the CSP contract is separate from the MSSP's main tenant.
>
> - Even with granting access at the resource group level, customers will still have access to log data for the resources they can access, such as logs from a VM, even without access to Azure Sentinel. For more information, see [Manage access to Azure Sentinel data by resource](resource-context-rbac.md).
>

For more information, also see the [Azure Lighthouse documentation](/azure/lighthouse/concepts/cloud-solution-provider).

## Enterprise Agreements (EA) / Pay-as-you-go (PAYG)

If your customer is buying directly from Microsoft, the customer already has full access to the Azure environment, and you cannot hide anything that's in the customer's Azure subscription.

Instead, protect your intellectual property that you've developed in Azure Sentinel as follows, depending on the type of resource you need to protect:

### Analytics rules and hunting queries

Analytics rules and hunting queries are both contained within Azure Sentinel, and therefore cannot be separated from the Azure Sentinel resource or workspace.

Even if a user only has Azure Sentinel Reader permissions, they'll still be able to view the query. In this case, we recommend hosting your Analytics rules and hunting queries in your own MSSP tenant, instead of the customer tenant.

To do this, you'll need a workspace in your own tenant with Azure Sentinel enabled, and you'll also need to see the customer workspace via [Azure Lighthouse](multiple-tenants-service-providers.md).

To ensure that the rule or query can be run in the customer workspace, make sure to specify the workspace where the query is run against. For example, use a workspace statement in your rule as follows:

```kql
workspace('<customer-workspace>').SecurityEvent
| where EventID == ‘4625’
```

When adding a workspace statement to your analytics rules, consider the following:

- **No alerts in the customer workspace**. Rules created in this manner, won’t create alerts or incidents. Both alerts and incidents will exist in your MSSP workspace only.

- **Create separate alerts for each customer**. This method also requires that you use separate alerts for each customer and detection, as the workspace statement will be different in each case.

    You can add the customer name to the alert rule name to easily identify the customer when the alert is triggered. Separate alerts may result in a large number of rules, which you might want to manage using scripting, or [Azure Sentinel as Code](https://techcommunity.microsoft.com/t5/azure-sentinel/deploying-and-managing-azure-sentinel-as-code/ba-p/1131928).

    For example:

    :::image type="content" source="media/mssp-protect-intellectual-property/mssp-rules-per-customer.png" alt-text="Create separate rules in your MSSP workspace for each customer.":::

- **Create separate MSSP workspaces for each customer**. Creating separate rules for each customer and detection may cause you to reach the maximum number of analytics rules for your workspace (512). If you have many customers and expect to reach this limit, you may want to create a separate MSSP workspace for each customer.

    For example:

    :::image type="content" source="media/mssp-protect-intellectual-property/mssp-rules-and-workspace-per-customer.png" alt-text="Create a workspace and rules in your MSSP tenant for each customer.":::

> [!IMPORTANT]
> The key to using this method successfully is using automation to manage a large set of rules across your workspaces.

### Workbooks

If you have developed an Azure Sentinel workbook that you don't want your customer to copy, host the workbook in your MSSP tenant. Make sure that you have access to your customer workspaces via Azure Lighthouse, and then make sure to modify the workbook to use those customer workspaces.

For example:

:::image type="content" source="media/mssp-protect-intellectual-property/cross-workspace-workbook.png" alt-text="Cross-workspace workbooks":::

For more information, see [Cross-workspace workbooks](extend-sentinel-across-workspaces-tenants.md#cross-workspace-workbooks).

If you want the customer to be able to view the workbook visualizations, while still keeping the code secret, we recommend that you export the workbook to Power BI.

Exporting your workbook to Power BI:

- **Makes the workbook visualizations easier to share**. You can send the customer a link to the Power BI dashboard, where they can view the reported data, without requiring Azure access permissions.
- **Enables scheduling**. Configure Power BI to send emails periodically that contain a snapshot of the dashboard for that time.

For more information, see [Import Azure Monitor log data into Power BI](/azure/azure-monitor/visualize/powerbi).
### Playbooks

You can protect your playbooks as follows, depending on where the playbook's analytics rules have been created:

- **Analytics rules created in the MSSP workspace**.  Make sure to create your playbooks in the MSSP workspace, and that you get all incident and alert data from the MSSP workspace. You can attach the playbooks whenever you create a new rule in your workspace.

    For example:

    :::image type="content" source="media/mssp-protect-intellectual-property/rules-in-mssp-workspace.png" alt-text="Rules created in the MSSP workspace.":::

- **Analytics rules created in the customer workspace**. Use Azure Lighthouse to attach analytics rules from the customer's workspace to a playbook hosted in your MSSP workspace. In this case, the playbook gets the alert and incident data, and any other customer information, from the customer workspace.

    For example:

    :::image type="content" source="media/mssp-protect-intellectual-property/rules-in-customer-workspace.png" alt-text="Rules created in the customer workspace.":::
## Next steps

For more information, see:

- [Azure Sentinel Technical Playbook for MSSPs](https://cloudpartners.transform.microsoft.com/download?assetname=assets/Azure-Sentinel-Technical-Playbook-for-MSSPs.pdf&download=1)
- [Manage multiple tenants in Azure Sentinel as an MSSP](multiple-tenants-service-providers.md)
- [Extend Azure Sentinel across workspaces and tenants](extend-sentinel-across-workspaces-tenants.md)
- [Tutorial: Visualize and monitor your data](tutorial-monitor-your-data.md)
- [Tutorial: Set up automated threat responses in Azure Sentinel](tutorial-respond-threats-playbook.md)
