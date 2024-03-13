---
title: Improve reliability of your business-critical applications using Azure Advisor recommendations and the reliability workbook.
description: Use Azure Advisor to evaluate the reliability posture of your business-critical applications, assess risks and plan improvements.
ms.topic: article
ms.date: 05/19/2023

---

# Improve the reliability of your business-critical applications using Azure Advisor

Azure Advisor helps you assess and improve the reliability of your business-critical applications. 

## Reliability recommendations

You can get reliability recommendations on the **Reliability** tab on the Advisor dashboard.

1. Sign in to the [**Azure portal**](https://portal.azure.com).

1. Search for and select [**Advisor**](https://aka.ms/azureadvisordashboard) from any page.

1. On the **Advisor** dashboard, select the **Reliability** tab.

## Reliability workbook

You can evaluate the reliability of posture of your applications, assess risks and plan improvements using the new Reliability workbook template, which is available in Azure Advisor.

1. Sign in to the [**Azure portal**](https://portal.azure.com).

1. Search for and select [**Advisor**](https://aka.ms/azureadvisordashboard) from any page.

1. Select **Workbooks** item in the left menu. 

1. Open **Reliability** workbook template. 

:::image type="content" source="media/advisor-reliability-workbook.png" alt-text="Screenshot of the Azure Advisor reliability workbook template." lightbox="media/advisor-reliability-workbook.png":::

Reliability considerations for individual Azure services are provided in the [resiliency checklist for Azure services](/azure/architecture/checklist/resiliency-per-service).

> [!NOTE]
> The workbook is to be used as a guidance only and does not represent a guarantee for service level.

### Navigating the workbook

Workbook offers a set of filters that you can use to scope recommendation for a specific application.

*	Subscription
*	Resource Group
*	Environment 
*	Tags 

The workbook uses tags with names Environment, environment, Env, env and common keywords (prod, dev, qa, uat, sit, test) as part of resource name to show environment for a specific resource. If there are no tags or naming conventions detected, the environment filter is displayed as 'undefined'. The 'undefined' value is shown only within the workbook and is not used anywhere else.

Use **SLA** and **Help** controls to show additional information:

*	Show SLA - Displays the service SLA. 
*	Show Help - Displays best practice configurations to increase the reliability of the resource deployment.

The workbook offers best practices for Azure services including:
*	**Compute**: Virtual Machines, Virtual Machine Scale Sets
*	**Containers**: Azure Kubernetes service
*	**Databases**: SQL Database, Synapse SQL Pool, Cosmos DB, Azure Database for MySQL, PostgreSQL, Azure Cache for Redis
*	**Integration**: Azure API Management
*	**Networking**: Azure Firewall, Azure Front Door & CDN, Application Gateway, Load Balancer, Public IP, VPN & Express Route Gateway
*	**Storage**: Storage Account
*	**Web**: App Service Plan, App Service, Function App
*	**Azure Site Recovery**
*	**Service Alerts**

To share the findings with your team, you can export data for each of the services or share the workbook link with them.
To customize the workbook, save the template into your subscription and click Edit button in top menu.

> [!NOTE]
> To assess your workload using the tenets found in the Microsoft Azure Well-Architected Framework, see the [Microsoft Azure Well-Architected Review](/assessments/?id=azure-architecture-review&mode=pre-assessment).

## Next steps

For more information about Advisor recommendations, see:
* [Reliability recommendations](advisor-reference-reliability-recommendations.md)
* [Introduction to Advisor](advisor-overview.md)
* [Get started with Advisor](advisor-get-started.md)


