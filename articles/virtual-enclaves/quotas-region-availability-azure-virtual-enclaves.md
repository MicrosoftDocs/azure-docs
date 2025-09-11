---
title: Quota and region availability in Azure Virtual Enclaves
description: Quota and region availability in Azure Virtual Enclaves
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 04/08/2025
---
# Quota and region availability in Azure Virtual Enclaves

All Azure services set default limits and quotas for resources and features, such as usage restrictions for certain virtual machine (VM) SKUs.
Example: [DS_v5 series](/azure/virtual-machines/dv5-dsv5-series#dsv5-series) VMs (see the table showing resource limitations)

This article details the default resource limits for Azure Virtual Enclaves (AVE) resources and the availability of AVE in Azure regions.

## Product Limitation Summary

|Product Feature | Limit |
|--|--|
| Enclaves in a community | 200[^2] |
| Workloads in an enclave | 800[^3] |
| Workloads in a community| 160,000[^1] |
| Endpoints (either type)| 800[^3] |

[^1]: Theoretically the number of workloads in a community can reach 200 * 800 = **160,000** if the `resourceGroupCollection` property is an empty list. Otherwise, the number is limited by the number of resource groups per subscription which is 980.

[^2]: The number of enclaves that can be deployed into a subscription is limited by the number of Private DNS zones, which is 1,000 per subscription. Each enclave deploys five Private DNS zones, which means up to 200 can be deployed before reaching the Private DNS zone limit. Each Private DNS Zone you add for your workloads will count for the 1,000 per subscription limit. You can use more than one subscription and spread the enclaves between each subscription.

[^3]: This is a child resource, so it must be deployed in the same resource group as the parent resource. Therefore, the number of child resources is limited by the Azure limit of 800 resources per resource group, per resource type.

## Service quotas and limits

### Core Resources

|Resource | Limit |
|--|--|
| Community | 978[^4] |
| Enclave | 200[^2] |
| Workloads per enclave | 800[^3] |

[^4]: The maximum is limited by the number of resource groups allowed in a subscription given that a community deploys an MRG. Among these resource groups, two of these must be reserved for deploying communities since each resource group can only have a maximum of 800 resource, per resource type.

### Networking Resources

|Resource | Limit |
|--|--|
| Community endpoint per community | 800[^3] |
| Community endpoint Rule | Unlimited[^5] |
| Enclave endpoint per Enclave | 800[^3] |
| Enclave endpoint rule | 993[^6] |
| Transit hub | 499[^7] |
| Enclave connection| 993[^8] |

[^5]: Each community endpoint rule deploys only internal metadata.

[^6]: The number of rules per enclave endpoint is limited by the number of NSG rules that can be created per NSG, which is 1,000. An enclave comes built in with three inbound and four outbound rules. Each endpoint rule creates another inbound NSG rule.

[^7]: The maximum is limited by the number of virtual network connections per hub that a Virtual WAN can support, which is 500 minus the number of hubs. At least one virtual network connection is reserved for enclave deployment which would imply a maximum of 499 remaining connections that can be allocated for transit hubs.

[^8]: The maximum is limited by the number of NSG rules per NSG. Assuming the source enclave doesn't come with any enclave endpoints, there's a maximum of 993 remaining NSG rules. Each enclave connection creates another outbound NSG rule on the source enclave.

## Infrastructure
All other network, compute, and storage limitations apply to the created infrastructure. For the relevant limits, see [Azure subscription and service limits](/azure/azure-resource-manager/management/azure-subscription-service-limits).

## Next steps
You can increase certain default limits and quotas. If your resource supports an increase, request the increase through an [Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) (for **Issue type**, select **Quota**).