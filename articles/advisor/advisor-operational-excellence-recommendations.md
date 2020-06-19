---
title: Improve operational excellency for your Azure subscriptions with Azure Advisor
description: Use Advisor to optimize and get mature in operational excellence for your Azure subscriptions
ms.topic: article
ms.date: 10/24/2019
---

# Achieve operational excellence with Azure Advisor

Azure Advisor operational excellence recommendations help customer with process and workflow efficiency, resource manageability and deployment best practices. You can get these recommendations from Advisor on the **Operational Excellence** tab of the Advisor dashboard.

## Create Azure Service Health alerts to be notified when Azure issues affect you

We recommend setting up Azure Service Health alerts to be notified when Azure service issues affect you. [Azure Service Health](https://azure.microsoft.com/features/service-health/) is a free service that provides personalized guidance and support when you are impacted by an Azure service issue. Advisor identifies subscriptions that do not have alerts configured and recommends creating one.


## Design your storage accounts to prevent hitting the maximum subscription limit

An Azure region can support a maximum of 250 storage accounts per subscription. Once the limit is reached, you will be unable to create any more storage accounts in that region/subscription combination. Advisor will check your subscriptions and surface recommendations for you to design for fewer storage accounts for any that are close to reaching the maximum limit.

## Ensure you have access to Azure cloud experts when you need it

When running a business-critical workload, it's important to have access to technical support when needed. Advisor identifies potential business-critical subscriptions that do not have technical support included in their support plan and recommends upgrading to an option that includes technical support.

## Delete and recreate your pool to remove a deprecated internal component

Your pool is using a deprecated internal component. Please delete and recreate your pool for improved stability and performance.

## Repair invalid log alert rules

Azure Advisor will detect alert rules that have invalid queries specified in their condition section. 
Log alert rules are created in Azure Monitor and are used to run analytics queries at specified intervals. The results of the query determine if an alert needs to be triggered. Analytics queries may become invalid overtime due to changes in referenced resources, tables, or commands. Advisor will recommend that you correct the query in the alert rule to prevent it from getting auto-disabled and ensure monitoring coverage of your resources in Azure. [Learn more about troubleshooting alert rules](https://aka.ms/aa_logalerts_queryrepair)

## Follow best practices using Azure Policy

Azure Policy is a service in Azure that you use to create, assign, and manage policies. These policies enforce different rules and effects over your resources. Below are the Azure Policy recommendations to help you achieve operational excellency: 
1. Manage Tags using Azure Policy: This policy adds or replaces the specified tag and value when any resource is created or updated. Existing resources can be remediated by triggering a remediation task. Also, this doesn't modify tags on resource groups.
2. Enforce geo-compliance requirements using Azure Policy: The policy enables you to restrict the locations your organization can specify when deploying resources. 
3. Specify allowed virtual machine SKUs for deployments: This policy enables you to specify a set of virtual machine SKUs that your organization can deploy.
4. Enforce 'Audit VMs that do not use managed disks' using Azure Policy
5. Use 'Inherit a tag from resource groups' using Azure Policy: The policy adds or replaces the specified tag and value from the parent resource group when any resource is created or updated. Existing resources can be remediated by triggering a remediation task.

## Next steps

To learn more about Advisor recommendations, see:
* [Introduction to Advisor](advisor-overview.md)
* [Get Started](advisor-get-started.md)
* [Advisor Cost recommendations](advisor-cost-recommendations.md)
* [Advisor Performance recommendations](advisor-performance-recommendations.md)
* [Advisor High Availability recommendations](advisor-high-availability-recommendations.md)
* [Advisor Security recommendations](advisor-security-recommendations.md)
