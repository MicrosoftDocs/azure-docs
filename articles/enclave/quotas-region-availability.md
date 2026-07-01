---
title: Quota and region availability in Azure Enclave
description: Quota and region availability in Azure Enclave
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 3/26/2026
ai-usage: ai-assisted
---
# Quota and region availability in Azure Enclave

All Azure services set default limits and quotas for resources and features, such as usage restrictions for certain virtual machine (VM) sizes.
Example: [DS_v5 series](/azure/virtual-machines/dv5-dsv5-series#dsv5-series) VMs (see the table showing resource limitations) 

This article details the default resource limits for Azure Enclave resources and the availability of Azure Enclave in Azure regions.

## Product Limitation Summary

| Product Feature | Limit |
|--|--|
| Enclaves in a community | 200<sup>1</sup> |
| Workloads in an enclave | 800<sup>2</sup> |
| Workloads in a community | 160,000<sup>3</sup> |
| Endpoints (either type) | 800<sup>2</sup> |

[1]: The number of enclaves that can be deployed into a subscription is limited by the number of Private DNS zones, which is 1,000 per subscription. Assuming each enclave requires five Private DNS zones you could deploy up to 200 enclaves before reaching the Private DNS zone limit in one subscription. You can create more than one subscription and spread your enclaves between each subscription. Each Private DNS Zone you add for your workloads will count for the 1,000 per subscription limit.

[2]: This is a child resource, so it must be deployed in the same resource group as the parent resource. Therefore, the number of child resources is limited by the Azure limit of 800 resources per resource group, per resource type.

[3]: Theoretically the number of workloads in a community can reach 200 * 800 = **160,000** with zero workload resource groups added to the workload (the `resourceGroupCollection` property is an empty list). Practically, you're likely to add at least one workload resource group to each workload so the maximum workloads in a community are limited by the number of resource groups per subscription which is 980.

## Service quotas and limits

### Core Resources

| Resource | Limit |
|--|--|
| Community | 978<sup>4</sup> |
| Enclave | 200<sup>1</sup> |
| Workloads per enclave | 800<sup>2</sup> |

[4]: The maximum is limited by the number of resource groups allowed in a subscription given that a community deploys a community managed resource group. Among these resource groups, two of these must be reserved for deploying communities since each resource group can only have a maximum of 800 resource, per resource type.

### Networking Resources

| Resource | Limit |
|--|--|
| Community endpoint per community | 800<sup>2</sup> |
| Community endpoint Rule | Unlimited<sup>5</sup> |
| Enclave endpoint per Enclave | 800<sup>2</sup> |
| Enclave endpoint rule | 993<sup>6</sup> |
| Transit hub | 499<sup>7</sup> |
| Enclave connection | 993<sup>8</sup> |

[5]: Each community endpoint rule deploys only metadata.

[6]: The number of rules per enclave endpoint is limited by the number of network security group (NSG) rules that can be created per NSG, which is 1,000. An enclave comes built in with three inbound and four outbound rules. Each endpoint rule creates another inbound NSG rule.

[7]: The maximum is limited by the number of virtual network connections per hub that a Virtual WAN can support, which is 500 minus the number of hubs. At least one virtual network connection is reserved for enclave deployment which would imply a maximum of 499 remaining connections that can be allocated for transit hubs.

[8]: The maximum is limited by the number of NSG rules per NSG. Assuming the source enclave doesn't come with any enclave endpoints, there's a maximum of 993 remaining NSG rules. Each enclave connection creates another outbound NSG rule on the source enclave.

## Infrastructure
All other network, compute, and storage limitations apply to the created infrastructure. For the relevant limits, see [Azure subscription and service limits](/azure/azure-resource-manager/management/azure-subscription-service-limits).

## Regions
For current regional availability, see [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table).

You can also query the current regions allowed for communities with the Azure CLI.

```azurecli
az provider show --namespace Microsoft.Mission --query "resourceTypes[?resourceType=='communities'].locations"
```

## Next steps
You can increase certain default limits and quotas. If your resource supports an increase, request the increase through an [Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) (for **Issue type**, select **Quota**).