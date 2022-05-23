---
title: Improve operational excellency with Advisor
description: Use Azure Advisor to optimize and mature your operational excellence for your Azure subscriptions.
ms.topic: article
ms.date: 10/24/2019
---

# Achieve operational excellence by using Azure Advisor

Operational excellence recommendations in Azure Advisor can help you with: 
- Process and workflow efficiency.
- Resource manageability.
- Deployment best practices. 

You can get these recommendations on the **Operational Excellence** tab of the Advisor dashboard.

## Create Azure Service Health alerts to be notified when Azure problems affect you

We recommend that you set up Azure Service Health alerts so you'll be notified when Azure service problems affect you. [Azure Service Health](https://azure.microsoft.com/features/service-health/) is a free service that provides personalized guidance and support when you're affected by an Azure service problem. Advisor identifies subscriptions that don't have alerts configured and recommends configuring them.


## Design your storage accounts to prevent reaching the maximum subscription limit

An Azure region can support a maximum of 250 storage accounts per subscription. After you reach that limit, you won't be able to create storage accounts in that region/subscription combination. Advisor checks your subscriptions and provides recommendations for you to design for fewer storage accounts for any region/subscription that's close to reaching the limit.

## Ensure you have access to Azure cloud experts when you need it

When running a business-critical workload, it's important to have access to technical support when you need it. Advisor identifies potential business-critical subscriptions that don't have technical support included in their support plan. It recommends upgrading to an option that includes technical support.

## Delete and re-create your pool to remove a deprecated internal component

If your pool is using a deprecated internal component, delete and re-create the pool for improved stability and performance.

## Repair invalid log alert rules

Azure Advisor detects alert rules that have invalid queries specified in their condition section. 
You can create log alert rules in Azure Monitor and use them to run analytics queries at specified intervals. The results of the query determine if an alert needs to be triggered. Analytics queries can become invalid over time because of changes in referenced resources, tables, or commands. Advisor recommends that you correct the query in the alert rule to prevent it from being automatically disabled and ensure monitoring coverage of your resources in Azure. [Learn more about troubleshooting alert rules.](../azure-monitor/alerts/alerts-troubleshoot-log.md)

## Use Azure Policy recommendations

Azure Policy is a service in Azure that you can use to create, assign, and manage policies. These policies enforce rules and effects on your resources. The following Azure Policy recommendations can help you achieve operational excellency: 

**Manage tags.** This policy adds or replaces the specified tag and value when any resource is created or updated. You can remediate existing resources by triggering a remediation task. This policy doesn't modify tags on resource groups.

**Enforce geo-compliance requirements.** This policy enables you to restrict the locations your organization can specify when deploying resources. 

**Specify allowed virtual machine SKUs for deployments.** This policy enables you to specify a set of virtual machine SKUs that your organization can deploy.

**Enforce *Audit VMs that do not use managed disks*.**

**Enable *Inherit a tag from resource groups*.** This policy adds or replaces the specified tag and value from the parent resource group when any resource is created or updated. You can remediate existing resources by triggering a remediation task.

Advisor recommends a few individual Azure policies that help customers achieve operational excellence by adopting best practices. If a customer decides to assign a recommended policy, then we will suppress the recommendation. If the customer decides to remove the policy later, then Advisor will continue to suppress the recommendation because we interpret its removal as a strong signal of the following:

1.	The customer removed the policy because, despite Advisor’s recommendation, it does not apply to their specific use case. 
2.	The customer is aware and familiar with the policy after assigning and removing it, and they can assign or remove it again as necessary without guidance if it later becomes relevant to their use case. 
If the customer finds it in their best interest to assign the same policy again, they can do so in Azure Policy without requiring a recommendation in Advisor. Please note that this logic applies specifically to the policy recommendation in the Operational Excellence category. These rules do not apply to security recommendations.  


## No validation environment enabled
Azure Advisor determines that you do not have a validation environment enabled in current subscription. When creating your host pools, you have selected \"No\" for \"Validation environment\" in the properties tab. Having at least one host pool with a validation environment enabled ensures the business continuity through Azure Virtual Desktop service deployments with early detection of potential issues. [Learn more](../virtual-desktop/create-validation-host-pool.md)

## Ensure production (non-validation) environment to benefit from stable functionality
Azure Advisor detects that too many of your host pools have validation environment enabled. In order for validation environments to best serve their purpose, you should have at least one, but never more than half of your host pools in validation environment. By having a healthy balance between your host pools with validation environment enabled and those with it disabled, you will best be able to utilize the benefits of the multistage deployments that Azure Virtual Desktop offers with certain updates. To fix this issue, open your host pool's properties and select \"No\" next to the \"Validation Environment\" setting.

## Enable Traffic Analytics to view insights into traffic patterns across Azure resources
Traffic Analytics is a cloud-based solution that provides visibility into user and application activity in Azure. Traffic analytics analyzes Network Watcher network security group (NSG) flow logs to provide insights into traffic flow. With traffic analytics, you can view top talkers across Azure and non Azure deployments, investigate open ports, protocols and malicious flows in your environment and optimize your network deployment for performance. You can process flow logs at 10 mins and 60 mins processing intervals, giving you faster analytics on your traffic. It's a good practice to enable Traffic Analytics for your Azure resources. 

## Increase vCPU limits for your deployments for Pay-As-You-Go Subscription (Preview)
This experience has been created to provide an easy way to increase the quota to help you with your growing needs and avoid any deployment issues due to quota limitations. We have enabled a “Quick Fix” option for limited subscriptions for providing an easy one-click option to increase the quota for the vCPUs from 10 to 20. This simplified approach calls the [Quota REST API](https://techcommunity.microsoft.com/t5/azure-governance-and-management/using-the-new-quota-rest-api/ba-p/2183670) on behalf of the user to increase the quota.

## Next steps

To learn more about Advisor recommendations, see:
* [Introduction to Advisor](advisor-overview.md)
* [Get started](advisor-get-started.md)
* [Advisor cost recommendations](advisor-cost-recommendations.md)
* [Advisor performance recommendations](advisor-performance-recommendations.md)
* [Advisor reliability recommendations](advisor-high-availability-recommendations.md)
* [Advisor security recommendations](advisor-security-recommendations.md)
* [Advisor REST API](/rest/api/advisor/)
