---
title: Quota and region availability in Azure Enclave
description: Learn about Azure Enclave quotas, regional availability, and data residency boundaries.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 9/17/2026
ai-usage: ai-assisted
---
# Quota and region availability in Azure Enclave

All Azure services set default limits and quotas for resources and features, such as usage restrictions for certain virtual machine (VM) sizes.
Example: [DS_v5 series](/azure/virtual-machines/dv5-dsv5-series#dsv5-series) VMs (see the table showing resource limitations) 

This article details the default resource limits for Azure Enclave resources, regional availability, and the geography boundaries for Azure Enclave-managed service data.

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

## Data residency

Azure Enclave processes and stores its service data within the Azure geography of the customer-selected deployment region. This service data includes resource metadata and service audit and diagnostic logs.

| Deployment region | Geography where Azure Enclave service data is processed and stored |
| --- | --- |
| Any supported United States region | United States |
| Any supported Japan region | Japan |

Regional availability and data residency describe different boundaries. Regional availability determines where you can deploy Azure Enclave. Data residency determines the geography in which Azure Enclave processes and stores the service data associated with that deployment. The table doesn't imply that Azure Enclave is available in every region within either geography; use the [regional availability guidance](#regions) to check supported deployment locations.

The residency boundary is the geography, not an individual region. Service-managed replication and recovery copies of this data remain within the same geography.

### Customer-managed workloads and data movement

The service-data boundary doesn't replace the residency behavior of the Azure services that you deploy in your workloads or the destinations that you configure. Customer-selected diagnostic destinations, backups, replication, exports, and network connections can move data to another geography.

For workloads that must remain within one geography, select services and destinations that meet that requirement, including secondary regions used for disaster recovery. Review [configurable logging destinations](./observability.md#configurable-logging-destinations), [disaster recovery planning](./disaster-recovery-planning.md), and the [shared responsibility model](./shared-responsibility-model.md).

## Next steps
You can increase certain default limits and quotas. If your resource supports an increase, request the increase through an [Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) (for **Issue type**, select **Quota**).