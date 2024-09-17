---
author: khdownie
ms.service: azure-container-storage
ms.topic: include
ms.date: 07/02/2024
ms.author: kendownie
---

Depending on your workload’s performance requirements, you can choose from three different performance tiers: **Basic**, **Standard**, and **Advanced**. These tiers offer a different range of IOPS, and your selection will impact the number of vCPUs that Azure Container Storage components consume in the nodes where it's installed. Standard is the default configuration if you don't update the performance tier.

| **Tier** | **Number of vCPUs** | **Read IOPS** | **Write IOPS** |
|---------------|--------------------------|-----------------|
| `Basic` | 12.5% of total VM cores | Up to 107,000 | Up to 102,000 |
| `Standard` (default) | 25% of total VM cores | Up to 186,000 | Up to 195,000 |
| `Advanced` | 50% of total VM cores | Up to 253,000 | Up to 243,000 |

> [!NOTE]
> RAM and hugepages consumption will stay consistent across all tiers: 1 GiB of RAM and 2 GiB of hugepages.

Once you've identified the performance tier that aligns best to your needs, you can run the following command to update the performance tier of your Azure Container Storage installation. Replace `<performance tier>` with basic, standard, or advanced.

```azurecli-interactive
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage <storage-pool-type> --ephemeral-disk-nvme-perf-tier <performance-tier>
```
