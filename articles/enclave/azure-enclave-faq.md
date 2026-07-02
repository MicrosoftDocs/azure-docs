---
title: Azure Enclave FAQ
description: See answers to frequently asked questions about Azure Enclave.
author: aserfass-msft
ms.author: aserfass
ms.topic: concept-article
ms.date: 6/23/2026
ai-usage: ai-assisted
---

# Azure Enclave frequently asked questions

This article answers common questions about Azure Enclave, including planning, usage, billing, configuration, and connections.

### What is Azure Enclave?

Azure Enclave is a hub-and-spoke network architecture with built-in network isolation and policy enforcement. For more information, see [What is Azure Enclave?](./what-azure-enclave.md).

### Why should I use Azure Enclave?

Azure Enclave creates a secure foundation in a known configuration so you can pursue compliance approval faster and deploy workloads with platform-managed boundaries. For more information, see [Why use Azure Enclave?](./why-azure-enclave.md).

### How does Azure Enclave work?

Azure Enclave uses a managed community-and-enclave model. A community provides shared network controls, and each enclave provides isolated workload boundaries. You connect approved endpoints with enclave connections, and Azure Enclave applies policy and routing controls across those paths. For architecture details, see [What is Azure Enclave?](./what-azure-enclave.md).

### What is the pricing for Azure Enclave?

Azure Enclave pricing includes an hourly charge per enclave plus charges for the managed resources. The managed resources create the layers of secure enclave isolation and include Virtual WAN, Azure Firewall, virtual networks, and optional Log Analytics based on your deployment. For current rates, see [Azure Enclave pricing](./azure-enclave-pricing.md).

### What are the benefits of using Azure Enclave?

Azure Enclave helps you deploy secure-by-design network boundaries, enforce policy consistently, and separate workloads with controlled connectivity. It can reduce setup effort for regulated environments by using a known architecture and managed platform components. For more information, see [Why use Azure Enclave?](./why-azure-enclave.md).

### Where can I learn to use Azure Enclave?

Start with [What is Azure Enclave?](./what-azure-enclave.md), review the [learn Azure Enclave article](./azure-enclave-learn.md), then create resources in a [tutorial](./1-1-create-community.md) or [sample templates](./azure-enclave-templates.md) to deploy reference architectures. Review the [best practices](./best-practices.md) article when you're ready to start planning a production design. For service limits, see [quotas and region availability](./quotas-region-availability.md).

## Customer planning

### Is Azure Enclave in Preview?

Yes. Azure Enclave is currently in Preview and is provided without a service-level agreement. Azure Enclave shouldn't be used for production workloads during Preview. For more information, see [What is Azure Enclave?](./what-azure-enclave.md).

### Where can I find a quickstart for Azure Enclave?

You can deploy customized individual components from the Azure portal. Azure Enclave also provides quickstart reference architectures. For more information, see [Azure Enclave templates](./azure-enclave-templates.md).

### Can Azure Enclave resources scale across multiple subscriptions?

Yes, communities and enclaves can exist in one subscription or in separate subscriptions within the same tenant. Separate subscriptions allow different organizations to pay for the resources associated with each enclave if that fits your use case. For more information, see [Multi-subscription deployment architecture](./azure-enclave-resource-groups.md#multi-subscription-deployment-architecture).

### Which regions is Azure Enclave available in today?

For current regional availability, see [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table) and [Quotas and region availability in Azure Enclave](./quotas-region-availability.md).

You can also query the current regions allowed for communities with the Azure CLI.

```azurecli
az provider show --namespace Microsoft.Mission --query "resourceTypes[?resourceType=='communities'].locations"
```

### What roles are used to manage permissions for Azure Enclave resources?

Azure Enclave includes roles to help you manage your environments with least privilege. Verified role names include Community Owner, Community Contributor, Community Reader, Enclave Owner, Enclave Contributor, Enclave Reader, and Enclave Approver. For more information, see [Role-based access controls](./role-based-access-controls.md).

## Using Azure Enclave

### How do I create a resource that isn't in the Azure service allow list?

If you're deploying an Azure service into a workload resource group and see the error `Do not allow creation of resource types outside of the allowlist`, the service isn't allowed by the assigned Azure Policy. You can create a policy exemption for the workload resource group.

1. In the Azure portal, go to the workload resource group.
1. In the left menu, select `Governance`, and then select `Policy compliance`.
1. Search for `Allow`, and then select the policy assignment for your workload resource group.
1. Select `Create exemption`.
1. Select `Review + create`, and then select `Create`.

After the exemption update finishes, redeploy the service that was previously denied. For more information, see [Policy compliance exemptions](./policy-compliance-exemptions.md).

### How do I prevent the creation of new Azure Enclave resource types?

If you're a cloud engineer and want to restrict the creation of new Communities in your subscription, you can use Azure Policy to prevent deployment of specific resource types.

Currently, Azure Enclave recommends following the [Tutorial: Disallow resource types in your cloud environment](/azure/governance/policy/tutorials/disallowed-resources) and defining the business logic your organization desires. The `Not allowed resource types` and `Allowed resource types` policies are linked in the tutorial.

As an example, to prevent deploying communities to a subscription, assign the `Not allowed resource type` [policy definition](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f6c112d4e-5bc7-47ae-a041-ea2d9dccd749) while including `Microsoft.Mission/communities` in the parameter list of not allowed resource types.

### Can I move my enclave?

Moving the enclave resource itself isn't supported. Additionally, moves aren't supported for some of the resources deployed in the enclave managed resource group (for example Azure Bastion, IP Groups, and user-assigned managed identity). [Learn more](/azure/azure-resource-manager/management/move-support-resources).

Workload resources that allow moving can be moved according to the move options supported for that resource type. For example, you could make a virtual machine image and move the image to recreate or replicate a virtual machine in a new enclave.

### How can I quickly stop resource access to a URL or IP?

For example, if you need to quickly block or remove access from a resource like a virtual machine to a problematic website, you can:

- Delete the enclave connection, for example, from your enclave to a community endpoint that allows access to a problematic website or IP address.
- Remove the virtual machine's subnet from the enclave connection.
- If you have access to the community or enclave endpoint, remove the problematic website or IP address from the endpoint rules.

## Billing

### How does billing work for Azure Enclave?

You pay for:

1. Each enclave on an hourly basis.
1. Resources managed by Azure Enclave to create community and enclave boundaries.
1. Workloads that you deploy within your enclaves.

Managed resources for Azure Enclave include:

- [Virtual WAN](/azure/virtual-wan/virtual-wan-about) for the community.
- [Azure Firewall](/azure/firewall/overview) for the community.
- [Virtual Network](/azure/virtual-network/virtual-networks-overview) for the enclave.
- Network security groups for enclave subnets.
- [Log Analytics](/azure/azure-monitor/logs/log-analytics-overview), if selected for the community, enclave, or both.

For more information, see [Azure Enclave pricing](./azure-enclave-pricing.md).

The cost of the enclave includes the community, community endpoints, enclave endpoints, enclave connections, and transit hub.

### Are partial hours pro-rated?
Enclaves deployed during part of an hour are charged for the full hour.

## Enclave configuration

### Can I add a firewall to my enclave virtual network, in addition to the community firewall?

Adding a virtual network firewall isn't a recommended pattern. Azure Enclave manages network traffic through community and enclave networking resources.

## Connections

### What access is allowed by default?

Azure Enclave configures required platform egress for managed resources. For communities using a non-Basic firewall, a default outbound firewall policy rule is created for Key Management Service (KMS) over TCP port 1688.

### How can I make deployments faster?

When you create templates to create Azure Enclave resources, you can make use of the enclaves connection batching by sending connections at the same time. Batching allows a larger batch of enclave connections to be created at the same time, which is faster than creating the connections one at a time. In your templates, you can configure a batch of enclave connections to deploy only once all enclave endpoints and community endpoints are created. Enclave connections to a transit hub can be batched separately once the transit hub is created.

In Bicep, you can batch enclave connections intentionally by adding a `dependsOn` section to each enclave connection resource. The `dependsOn` array should include all community and enclave endpoints for which you want to create connections in the same batch.

```bicep
dependsOn: [
  myCommunityEndpoint1
  myEnclaveEndpoint1
  myEnclaveEndpoint2
]
```

> [!NOTE]
>
> Bicep linter might show a warning like `Warning no-unnecessary-dependson: Remove unnecessary dependsOn entry` for one or more resources in `dependsOn`. You can suppress this warning by adding `#disable-next-line no-unnecessary-dependson` to the line before the `dependsOn` entry.
