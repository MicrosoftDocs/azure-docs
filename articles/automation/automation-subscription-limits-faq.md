---
title: Azure Automation subscription limits and quotas
description: This article provides automation subscription and service limits and includes answers to frequently asked questions.
services: automation
ms.topic: faq
ms.date: 01/28/2025
ms.custom: references_regions
#Customer intent: As an implementer, I want answers to various questions.
---

# Azure Automation limits and quotas

This article provides an overview of the default quotas or limits offered to different resources in Azure Automation.

## Overview

Azure Automation offers Limits and Quotas to resources assigned for your Azure subscription. These limits and quotas often vary for different types of subscriptions. A default value is assigned for each resource in an Automation account for each subscription. There are some resources for which you can request increase in quota, and for other resources the default value is fixed and can't be changed. You can request for quota increases only for resources for which *request for quota increase* is mentioned. For all other resources, the default value is a hard limit (unchangeable) and request for increase wouldn't be considered.  

> [!NOTE]
> Quota increases are subject to availability of resources in the selected region. 

## Service and subscription limits

**Resource** | **Limit** | **Notes** |
|---|--- | --- |
| Maximum number of active Automation accounts in a subscription in a region | 10 | Enterprise and CSP subscriptions would be able to create Automation accounts in any of the public [regions supported](https://azure.microsoft.com/pricing/details/automation/) by the service.  Create a [Support request](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade/callerWorkflowId/01133068-af18-43c8-baa4-a54f5fa7c684/callerName/Microsoft_Azure_Support%2FHelpPane.ReactView/productId/06bfd9d3-516b-d5c6-5802-169c800dec89/issueType/quota) to request for Quota increase. [Learn more](automation-limits-quotas.md).
| | 2 | Pay-as-you-go, Sponsored, MSDN, MPN, Azure Pass subscriptions can create Automation accounts in any of the [regions supported](https://azure.microsoft.com/pricing/details/automation/) by the service. Create a [Support request](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade/callerWorkflowId/01133068-af18-43c8-baa4-a54f5fa7c684/callerName/Microsoft_Azure_Support%2FHelpPane.ReactView/productId/06bfd9d3-516b-d5c6-5802-169c800dec89/issueType/quota) to request for Quota increase. [Learn more](automation-limits-quotas.md). |
| | 1 | Free trial, Azure for Student, Azure in Open subscriptions can create only one Automation account per region per subscription. Allowed list of regions: EastUS, EastUS2, WestUS, NorthEurope, SoutheastAsia, and JapanWest2 <sup>2</sup> |
|Maximum number of concurrent running jobs at the same instance of time per Automation account per region | 50 | When this limit is reached, the subsequent requests to create a job fail. The client receives an error response. Enterprise and CSP subscriptions in public regions. Create a [Support request](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade/callerWorkflowId/01133068-af18-43c8-baa4-a54f5fa7c684/callerName/Microsoft_Azure_Support%2FHelpPane.ReactView/productId/06bfd9d3-516b-d5c6-5802-169c800dec89/issueType/quota) to request for Quota increase. [Learn more](automation-limits-quotas.md).|
| | 10 | Pay-as-you-go, Sponsored, MSDN, MPN, Azure Pass subscriptions in public regions. Create a [Support request](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade/callerWorkflowId/01133068-af18-43c8-baa4-a54f5fa7c684/callerName/Microsoft_Azure_Support%2FHelpPane.ReactView/productId/06bfd9d3-516b-d5c6-5802-169c800dec89/issueType/quota) to request for a Quota.  [Learn more](automation-limits-quotas.md). |
| | 5  | Free trial, Azure for Student, Azure in Open subscriptions in public regions <sup>2</sup>.|  
|Maximum number of new jobs that can be submitted every 30 seconds per Azure Automation account | 100 | When this limit is reached, the subsequent requests to create a job fail. The client receives an error response. |
|Maximum storage size of job metadata for a 30-day rolling period | 10 GB (approximately 4 million jobs) | When this limit is reached, the subsequent requests to create a job fail. |
|Maximum job stream limit | 1 MiB | A single stream can't be larger than 1 MiB. |
|Maximum job stream limit on Azure Automation portal | 200 KB | Portal limit to show the job logs. |
|Maximum number of modules that can be imported every 30 seconds per Automation account | 5 ||
|Maximum size of a module | 100 MB | |
|Maximum size of a node configuration file | 1 MB | Applies to state configuration |
|Job run time, Free tier | 500 minutes per subscription per calendar month | |
|Maximum amount of disk space allowed per sandbox <sup>1</sup>| 1 GB  | Applies to Azure sandboxes only. |
|Maximum amount of memory given to a sandbox <sup>1</sup> | 400 MB | Applies to Azure sandboxes only. |
|Maximum number of network sockets allowed per sandbox <sup>1</sup> | 1,000 | Applies to Azure Sandboxes only|
|Maximum runtime allowed per runbook <sup>1<sup> | Three hours | Applies to Azure Sandboxes only |
|Maximum number of system hybrid runbook workers per Automation Account | 4,000 | |
|Maximum number of user hybrid runbook workers per Automation account | 4,000| |
|Maximum number of concurrent jobs that can be run on a single Hybrid Runbook Worker | 50 | |
|Maximum runbook job parameter size | 512 kilobytes ||
|Maximum runbook parameters | 50 | If you reach the 50-parameter limit, you can pass a JSON or XML string to a parameter and parse it with the runbook. |
|Maximum webhook payload size | 512 kilobytes ||
|Maximum days that job data is retained | 30 days| |
|Maximum PowerShell workflow state size | 5 MB | Applies to PowerShell workflow runbooks when checkpointing workflow.|
|Maximum number of tags supported by an Automation account | 15 ||
|Maximum number of characters in the value field of a variable| 1048576 ||

<sup>1</sup>A sandbox is a shared environment that can be used by multiple jobs. Jobs that use the same sandbox are bound by the resource limitations of the sandbox.</br>
<sup>2</sup>Free subscriptions including [Azure Free Account](https://azure.microsoft.com/offers/ms-azr-0044p/) and [Azure for Students](https://azure.microsoft.com/offers/ms-azr-0170p/) aren't eligible for limit or quota changes. If you have a free subscription, you can [upgrade](../cost-management-billing/manage/upgrade-azure-subscription.md) to pay-as-you-go subscription.</br>
<sup>3</sup>Limits for Government clouds: 200 concurrent running jobs at the same instance of time per Automation account, no limit on number of Automation accounts per subscription. 


## Frequently asked questions

### Which resource limits are being revised?

The following limits are being revised starting January 07, 2025 across all public regions supported by the service: 
  - Maximum number of active Automation accounts in a subscription in a region. 
  - Maximum number of concurrent running jobs at the same instance of time per Automation account. 

Deployments are in progress and your patience during the transition period is appreciated.

### How do I check my current usage and limits?

You can check the current usage and limits for Automation accounts and concurrently running jobs while creating a support request under the category *Service and Subscription limits (Quotas) -> Azure Automation*. [Learn more](automation-limits-quotas.md)

### My current usage is more than the revised limits.  What should I do?

Rest assured that your current usage of both resources - Automation accounts and concurrently running jobs - is honored and remains unaffected due to change in limits. For example, If you're an Enterprise customer and your new limit is 10 Automation accounts and current usage is 12 accounts. Even though your usage is higher than the new limit, your usage of 12 accounts would be honored and then considered as your new limit. When you exceed the new limit of 12 accounts, you would get an error. 

### I need more resources than my current limits. What should I do?

You can request for quota increase and decrease based on your changing requirements. We recommend that you plan for increase in resources well in advance, and request for quota increase by creating a support request under the category *Service and Subscription limits (Quotas) -> Azure Automation*. [Learn more](automation-limits-quotas.md)

### How do quota requests impact my subscription's billing?

Support requests for quota changes don't have any additional impact on your subscription billing. You can use your existing support plan to request for quota changes. 

### I'm unable to request for quota changes. What should I do?

Ensure you have an active Automation account and Contributor access to request for Quota changes.  

## Next steps

If your question isn't answered here, refer to the following sources for more questions and answers.

- [Feedback forum](https://feedback.azure.com/d365community/forum/721a322e-bd25-ec11-b6e6-000d3a4f0f1c)
- Learn more on [how to view the current limits and request for quota increase or decrease](automation-limits-quotas.md)
