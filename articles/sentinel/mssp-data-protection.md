---
title: `Managed security service providers (MSSPs):` Protect your Azure Sentinel data | Microsoft Docs
description: Learn about how  managed security service providers (MSSPs) can protect their Azure Sentinel data.
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
# MSSPs: Protecting your Azure Sentinel intellectual property

This article describes several methods that managed security service providers (MSSPs) can use to protect intellectual property they've developed in Azure Sentinel, such as Azure Sentinel analytics rules, hunting queries, playbooks, and workbooks.


## Protect intellectual property: Cloud Solutions Providers (CSP)

If you're reselling Azure as a Cloud Solutions Provider (CSP), you're managing the customer's Azure subscription. Specified users from your MSSP tenant are granted with **Owner** access to the customer's Azure subscription, and the customer has *no* access by default.

If you need to provide customer users with access to the Azure environment, we recommend that you grant them access at the level of the *resource group* so that you can show / hide parts of the environment as needed. For example, you might grant the customer with access to several resource groups where their applications are located, but still keep the Azure Sentinel environment in a separate resource group, where the customer has no access. For example, you can use this method to enable customers to view *Workbooks* and *Playbooks*, which are separate resources that can reside in their own resource group.

In such cases, we recommend that you use [Azure Lighthouse](multiple-tenants-service-providers.md) to provide customer access, which enables you to grant users or groups with access to a specific scope, such as a resource group or subscription, using one of the built-in roles. If you need to provide your customers with access to the entire subscription, see [Protect intellectual property: Enterprise Agreements (EA) / Pay-as-you-go (PAYG)](#-protect-intellectual-property-enterprise-agreements-ea--pay-as-you-go-payg).

The following image describes how permissions might work when providing access to CSP customers:

:::image type="content" source="media/mssp-protect-intellectual-property/csp-customers.png" alt-text="Protect your Azure Sentinel intellectual property with CSP customers.":::

In this image, the users granted with **Owner** access are the users in the Admin Agents group, in the MSSP Azure AD tenant attached to the CP contract. Typically **Owner** access is provided to MSSP tenant users using the [Admin-On-Behalf-Of (AOBO)](/partner-center/azure-plan-manage) mechanism. 

> [!NOTE]
> - Sometimes, the MSSP Azure AD tenant attached to the CP contract is separate from the MSSP's main tenant.
> - Even with granting access at the level of the resource group, customers will still have access to log data for the resources they can access, such as logs from a VM, even without access to Azure Sentinel. For more information, see [Manage access to Azure Sentinel data by resource](resource-context-rbac.md).
>

For more information, also see the [Azure Lighthouse documentation](/azure/lighthouse/concepts/cloud-solution-provider).

## Protect intellectual property: Enterprise Agreements (EA) / Pay-as-you-go (PAYG) 


If your customer is buying directly from Microsoft, then the customer already has full access to the Azure environment, so you won’t be able to hide things that are in the customer’s Azure subscriptions. This is because RBAC permissions are inherited, so if a customer has owner permissions at the subscription level, then they will have that same permission on anything inside it, even the Sentinel environment that you manage on their behalf. So, how can you protect the Intellectual Property that you develop on top of Sentinel?
Let’s look at this by type of resource that needs to be protected.

### Analytics Rules

Analytics rules live within the Sentinel solution, so they cannot be separated from the Sentinel resource and workspace. Even if the customer user has only Sentinel Reader permissions, he/she will be able to see the query in your rule from the Analytics Rule blade within Sentinel. So how do we hide them?
The trick here is to host those Analytics Rules in your own MSSP tenant instead of the customer tenant. For that, you will need a workspace in your own tenant that has the Sentinel solution enabled and you would also need to see the customer workspace through Azure Lighthouse. But how do I make sure that the rule is executed in the customer workspace?
You need to do a little trick with KQL, which is specifying what workspace is the query executed against. For that you can use the workspace statement like this:

```kql
workspace('<customer-workspace>').SecurityEvent
| where EventID == ‘4625’
```

Take into account, that with this method, there will be no alerts in the customer workspace and therefore no incidents either. All those will reside in your Sentinel instance.
One additional consideration that comes with this approach is how you separate customers. The recommended approach as of now is to create one analytics rule per customer and detection (see image below). You can even append the name of the customer to the alert rule name, so you can easily identify the customer when the alert is triggered. The main challenge with this option is that you might end up with a very large number of rules, but you can manage those efficiently using scripting or the Sentinel as Code approach.


You should also be aware about the current limit of Analytics Rules per workspace, which is 512. If you’re planning to have a large number of rules per customer, you might reach this limit. If you expect that, the recommended approach is to create a workspace in your tenant per each customer workspace. 
Like this:
 

As explained before, in this setup becomes key to use automation to manage a large set of rules across workspaces.

### Hunting Queries

Similar to the previous case, Hunting Queries live inside the Sentinel solution. If you need to hide a specific query from your customer, you could always store the query on your own tenant (MSSP) and run it against the customer workspace as shown in the previous section using the workspace statement.

### Workbooks 

If you have developed a workbook that you don’t want your customer to copy, you should store it in your tenant. The good news is that you can modify that workbook to use whatever customer workspaces you want as long as you have access to them via Lighthouse. 
In this other blog post we provide details on how to modify your workbooks to make them multi-tenant.
 

In this previous scenario, the MSSP will have cross-customer visibility, but the customer won’t be able to access the workbook. What if the customer needs to see the workbook visualizations but we want to keep the code underneath secret?. In this case, the recommended approach is to export the workbook to PowerBI, as explained here. This provides several additional benefits, to name a few:
-	Easier to share. You can just send a link to the PowerBI dashboard and the user will be able to see the report. No need to have Azure access permissions.
-	Scheduling. You can configure a PowerBI to send an email on a given schedule, that will contain a snapshot of the dashboard.

### Playbooks 

Regarding protecting your playbooks, we have two scenarios depending on where the analytics rules have been created: in the customer tenant or in the MSSP tenant.
-	Analytics Rules in the MSSP tenant. In this case, the customer workspace won’t have any information about the alerts and incidents, so your playbooks need to get all the information from your own workspace. There’s nothing special that you need to do in this case, just create your playbooks in the MSSP tenant as you would do in the customer tenant and make sure you get all the incident/alert data from your own MSSP workspace. You will be able to attach these playbooks when you create a new rule within your tenant.
 



-	Analytics Rules in the customer tenant. Using Lighthouse, it is straight forward to create analytics rules in the customer’s Sentinel environment and attach to it a playbook hosted in your own tenant. The playbook in this case will get the alert/incident (and any other customer info) data from the customer workspace.   
 

## Next steps

- To get started with Azure Sentinel, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Azure Sentinel](quickstart-onboard.md), and [get visibility into your data, and potential threats](quickstart-get-visibility.md).