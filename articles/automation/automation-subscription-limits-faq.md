---
title: Azure Automation subscription limits and quotas
description: This article provides automation subscription and service limits and includes answers to frequently asked questions.
services: automation
ms.topic: faq
ms.date: 12/04/2024
#Customer intent: As an implementer, I want answers to various questions.
---

# Azure Automation limits and quotas

Azure Automation will soon revise its Service and Subscription limits to ensure fair distribution of cloud resources across all customers. This change is another step to improve the reliability and performance of the service while optimizing resource utilization. Since the resource requirements vary across organizations and evolve over time, we aim to empower customers to configure their quotas based on actual usage. [Learn more](https://techcommunity.microsoft.com/blog/AzureGovernanceandManagementBlog/azure-automation-is-revising-service-and-subscription-limits/4351067).

## Revised limits

For more information on the current service and subscription limits, see [Automation limits](https://learn.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#process-automation).

The following limits would be changed:
- Maximum number of Automation accounts in a subscription in a region. 
- Maximum number of concurrent running jobs at the same instance of time per Automation account. 

You get an error message when you exceed the limits mentioned below. 

**Resource** | **Limit** | **Notes** |
|---|--- | --- |
|Maximum number of active Automation accounts in a subscription in a region. | 10 </br></br> 2 </br></br></br> 1 | Enterprise and CSP subscriptions would be able to create accounts in any of the [regions supported](https://azure.microsoft.com/pricing/details/automation/) by the service. </br> Pay-as-you-go, Sponsored, MSDN, MPN, Azure Pass subscriptions can create Automation accounts in any of the [regions supported](https://azure.microsoft.com/pricing/details/automation/) by the service. </br>  Free trial, Azure for Student, Azure in Open subscriptions can create only one Automation account per region per subscription. Allowed list of regions: EastUS, EastUS2, WestUS, NorthEurope, SoutheastAsia, and JapanWest2 |
|Maximum number of concurrent running jobs at the same instance of time per Automation account per region. | 50 </br> 10 </br> 5 | Enterprise and CSP subscriptions.</br> Pay-as-you-go, Sponsored, MSDN, MPN, Azure Pass subscriptions. </br> Free trial, Azure for Student, Azure in Open subscriptions.|  


## Frequently asked questions

**When will the new limits come into effect?**

New limits would be effective starting January 7, 2025 across all commercial regions. Your patience during the transition period is appreciated. 

**How do I check my current resource usage?**

You can monitor your usage of Automation accounts and concurrently running jobs through the Quotas service on the Azure portal. Alternatively, you can create a support request under the category *Service and Subscription limits (Quotas)*. The portal is enabled once deployment begins in January 2025.

**My current usage is more than the revised limits.  What should I do?**

Rest assured that your current usage of both resources - Automation accounts and concurrently running jobs - is honored and remains unaffected.

**I need more resources than my current limits. What should I do?** 

You are able to request for quota increase and decrease based on your changing business requirements. Once the changes are deployed, you can check your current usage and limit, and request quota changes by creating a support request under the category *Service and Subscription limits (Quotas)* for Azure Automation. Detailed steps for requesting quota changes will be shared once deployment begins in January 2025.

**How do quota requests impact my subscription's billing?**

Support requests for quota changes don't have any additional impact on your subscription billing. You can use your existing support plan to request for quota changes. 

## Next steps

If your question isn't answered here, you can refer to the following sources for more questions and answers.

- [Feedback forum](https://feedback.azure.com/d365community/forum/721a322e-bd25-ec11-b6e6-000d3a4f0f1c)
