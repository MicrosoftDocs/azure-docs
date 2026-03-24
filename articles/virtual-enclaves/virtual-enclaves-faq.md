---
title: Azure Virtual Enclaves FAQ
description: See answers to frequently asked questions (FAQ) about Azure Virtual Enclaves.
author: aserfass-msft
ms.author: aserfass
ms.topic: concept-article
ms.date: 9/30/2025
---

# Azure Virtual Enclaves frequently asked questions (FAQ)
Frequently asked questions (FAQ) about Azure Virtual Enclaves.

## General
General questions about Azure Virtual Enclaves.

### What is Azure Virtual Enclaves?
Azure Virtual Enclaves is a hub-and-spoke network architecture with network isolation and policy enforcement out of the box. [Learn more](./what-azure-virtual-enclaves.md)

### Why should I use Azure Virtual Enclaves?
Azure Virtual Enclaves creates a secure foundation in a known configuration so you can get compliance approval faster and deploy your workloads. [Learn more](./why-azure-virtual-enclaves.md)

## Customer planning
Questions to help customers plan for Azure Virtual Enclaves deployments.

### Is Azure Virtual Enclaves in Public Preview?
Yes, Azure Virtual Enclaves is in Preview.

### Where can I find a quickstart for Azure Virtual Enclaves?
You can easily deploy customized individual components from the portal, but we also offer quickstart reference architectures. [Learn more](./virtual-enclaves-templates.md)

### Can Azure Virtual Enclaves resources scale across multiple subscriptions?
Yes, communities and enclaves can exist in one subscription or in separate subscriptions within the same tenant. Separate subscriptions allow different organizations to pay for the resources associated with each enclave if that fits your use case. [Learn more](./virtual-enclaves-resource-groups.md#multi-subscription-deployment-architecture)

### Which regions are Azure Virtual Enclaves available in today?
The current regions Azure Virtual Enclaves is available in can be viewed [here](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table).

You can also query the current regions allowed for communities with the Azure CLI.

```
az provider show -n Microsoft.Mission --query "resourceTypes[?resourceType=='communities'].locations"
```

### What roles are used to manage permissions for Azure Virtual Enclaves resources?
Azure Virtual Enclaves includes new roles to help you manage your environments with least privileges. These roles include: owner, contributor, reader, and approver scoped at the community or enclave (for example `community owner`). [Learn more](https://aka.ms/ave/concept/rbac)

## Using Azure Virtual Enclaves
Guides for using Azure Virtual Enclaves.

### How do I create a resource not in the Azure service allow list?
When you're deploying an Azure service into a workload resource group and you see the error `Do not allow creation of resource types outside of the allowlist`, the error means the service isn't in the policy allow list. You can create an exemption from the policy by
1. Navigating to the workload resource
2. Select `Governance` and `Policy Compliance` on the left side
3. Search for "Allow" and select the policy for your workload resource group
4. Select `Create exemption`
5. Select `Review + Create` and then `Create`
 
Once the update action finishes, you can redeploy the service that was denied previously. 

### How do I prevent the creation of new Azure Virtual Enclaves resource types?

If you're a cloud engineer and want to restrict the creation of new Communities in your subscription, you can use Azure Policy to prevent deployment of specific resource types.

Currently, Azure Virtual Enclaves recommends following the [Tutorial: Disallow resource types in your cloud environment](/azure/governance/policy/tutorials/disallowed-resources) and defining the business logic your organization desires. The `Not allowed resource types` and `Allowed resource types` policies are linked in the tutorial.

As an example, to prevent deploying Communities to a Subscription, you would assign the `Not allowed resource type` [policy definition](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f6c112d4e-5bc7-47ae-a041-ea2d9dccd749) while including `Microsoft.Mission/communities` in the parameter list of not allowed resource types.

### Can I `move` my enclave?
Moving the enclave resource itself isn't supported. Additionally, moves aren't supported for some of the resources deployed in the enclave managed resource group (for example Azure Bastion, IP Groups, and user-assigned managed identity). [Learn more](/azure/azure-resource-manager/management/move-support-resources).

Workload resources that allow moving can be moved according to the move options supported for that resource type. For example, you could make a virtual machine image and move the image to recreate or replicate a virtual machine in a new enclave.

### How can I quickly stop resource access to a URL or IP?
For example, if you need to quickly block or remove access from a resource like a virtual machine to a problematic website, you can:
- delete the enclave connection (for example from your enclave to a community endpoint allowing access to a problematic website or IP address)
- remove the virtual machine's subnet from the enclave connection
- if you have access to the community or enclave endpoint, you can also remove the problematic website or IP address from the endpoint rules

## Billing
Questions related to Azure Virtual Enclaves billing.

### How does billing work for Azure Virtual Enclaves?
You pay for:
1.	Each enclave on an hourly basis
2.	The usage for any resources managed by Azure Virtual Enclaves to create the community or enclave boundaries and 
3.	Any workloads the customer deploys within their enclaves.

Managed resources for Azure Virtual Enclaves include:
  - [Virtual WAN](/azure/virtual-wan/virtual-wan-about) required for the community
  - [Azure Firewall](/azure/firewall/overview) required for the community
  - [Virtual Network](/azure/virtual-network/virtual-networks-overview) required for the enclave
  - [Azure DNS](/azure/dns/private-dns-overview) required for the enclave
  - [Log Analytics](/azure/azure-monitor/logs/log-analytics-overview) user selectable for community, enclave, or both.

Visit the Azure Virtual Enclaves community and enclave documentation for a complete list of managed resources and visit the Azure Virtual Enclaves pricing page for current costs.

The cost of the Enclave includes the community, community endpoints, enclave endpoints, enclave connections, and transit hub.

### Are partial hours pro-rated?
Enclaves deployed during part of an hour are charged for the full hour.

## Enclave configuration

### Can I add a firewall to my enclave virtual network, in addition to the community firewall?

Adding a virtual network firewall isn't a recommended pattern and it isn't supported at this time. The Virtual Network traffic is forced through the community firewall by default.

## Connections

### What access is allowed by default?

A default firewall rule is created to allow access to the Key Management Service (KMS) which is used for volume activation of Microsoft products. The community firewall policy includes a network rule that allows outbound access to KMS resources.

### How can I make deployments faster?

When you create templates to create Azure Virtual Enclaves, you can make use of the enclaves connection batching by sending connections at the same time. Batching allows a larger batch of enclave connections to be created at the same time, which is faster than creating the connections one at a time. In your templates, you can configure a batch of enclave connections to deploy only once all enclave endpoints and community endpoints are created. Enclave connections to a transit hub can be batched separately once the transit hub is created.

In Bicep, you can batch enclave connections intentionally by adding a `dependsOn` section to each enclave connection resource. The `dependsOn` array should include all community and enclave endpoints for which you want to create connections in the same batch.

`dependsOn: [
  myCommunityEndpoint1
  myEnclaveEndpoint1
  myEnclaveEndpoint2
]`

> [!NOTE]
>
> Bicep linter might show a warning like "Warning no-unnecessary-dependson: Remove unnecessary dependsOn entry" for one or more of the resources in the dependsOn. This warning can be suppressed by putting adding `#disable-next-line no-unnecessary-dependson` to the line before.