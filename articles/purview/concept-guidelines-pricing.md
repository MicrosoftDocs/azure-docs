---
title: Pricing guidelines for Microsoft Purview (formerly Azure Purview)
description: This article provides a guideline to understand and strategize pricing for the components of Microsoft Purview (formerly Azure Purview).
author: athenads
ms.author: athenadsouza
ms.service: purview
ms.topic: conceptual
ms.date: 12/09/2022
ms.custom: ignite-fall-2021
---

# Overview of pricing for Microsoft Purview (formerly Azure Purview)  

Microsoft Purview, formally known as Azure Purview, provides a single pane of glass for managing data governance by enabling automated scanning and classifying data at scale through the Microsoft Purview governance portal.

For specific price details, see the [Microsoft Purview (formerly Azure Purview) pricing page](https://azure.microsoft.com/pricing/details/purview/). This article will guide you through the features and factors that will affect pricing.

## Why do you need to understand the components of pricing? 

- While the pricing for Microsoft Purview (formerly Azure Purview) is on a subscription-based **Pay-As-You-Go** model, there are various dimensions that you can consider while budgeting
- This guideline is intended to help you plan the budgeting for Microsoft Purview in the governance portal by providing a view on the control factors that impact the budget

## Factors impacting Azure Pricing 

There are **direct** and **indirect** costs that need to be considered while planning budgeting and cost management.

Direct costs impacting Microsoft Purview pricing are based on these applications:
- [The Microsoft Purview Data Map](concept-guidelines-pricing-data-map.md)
- [Data Estate Insights](concept-guidelines-pricing-data-estate-insights.md)

## Indirect costs  

Indirect costs impacting Microsoft Purview (formerly Azure Purview) pricing to be considered are:

- [Managed resources](https://azure.microsoft.com/pricing/details/azure-purview/)
    - When an account is provisioned, a storage account is created in the subscription in order to cater to secured scanning, which may be charged separately.
    - An Event Hubs namespace can be [configured at creation](create-catalog-portal.md#create-an-account) or enabled in the [Azure portal](https://portal.azure.com) on the Kafka configuration page of the account to enable monitoring with [*Atlas Kafka* topics events](manage-kafka-dotnet.md). The Event Hubs will be charged separately.


- [Azure private endpoint](./catalog-private-link.md)
    - Azure private end points are used for Microsoft Purview (formerly Azure Purview), where it's required for users on a virtual network (VNet) to securely access the catalog over a private link
    - The prerequisites for setting up private endpoints could result in extra costs

- [Self-hosted integration runtime related costs](./manage-integration-runtimes.md) 
    - Self-hosted integration runtime requires infrastructure, which results in extra costs
    - It's required to deploy and register Self-hosted integration runtime (SHIR) inside the same virtual network where Microsoft Purview ingestion private endpoints are deployed
    - [Other memory requirements for scanning](./register-scan-sapecc-source.md#create-and-run-scan)
        - Certain data sources such as SAP require more memory on the SHIR machine for scanning


- [Virtual Machine Sizing](../virtual-machines/sizes.md)
    - Plan virtual machine sizing in order to distribute the scanning workload across VMs to optimize the v-cores utilized while running scans

- [Microsoft 365 license](./create-sensitivity-label.md) 
    - Microsoft Purview Information Protection sensitivity labels can be automatically applied to your Azure assets in the Microsoft Purview Data Map.
    - Microsoft Purview Information Protection sensitivity labels are created and managed in the Microsoft Purview compliance portal.
    - To create sensitivity labels for use in Microsoft Purview, you must have an active Microsoft 365 license, which offers the benefit of automatic labeling. For the full list of licenses, see the Sensitivity labels in Microsoft Purview FAQ. 

- [Azure Alerts](../azure-monitor/alerts/alerts-overview.md)
    - Azure Alerts can notify customers of issues found with infrastructure or applications using the monitoring data in Azure Monitor
    - The pricing for Azure Alerts is available [here](https://azure.microsoft.com/pricing/details/monitor/)

- [Cost Management Budgets & Alerts](../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md)
    - Automatically generated cost alerts are used in Azure to monitor Azure usage and spending based on when Azure resources are consumed
    - Azure allows you to create and manage Azure budgets. Refer [tutorial](../cost-management-billing/costs/tutorial-acm-create-budgets.md)

- Multi-cloud egress charges
    - Consider the egress charges (minimal charges added as a part of the multi-cloud subscription) associated with scanning multi-cloud (for example AWS, Google) data sources running native services excepting the S3 and RDS sources

## Next steps

- [Microsoft Purview, formerly Azure Purview, pricing page](https://azure.microsoft.com/pricing/details/azure-purview/)
- [Pricing guideline Data Estate Insights](concept-guidelines-pricing-data-estate-insights.md)
- [Pricing guideline Data Map](concept-guidelines-pricing-data-map.md)
