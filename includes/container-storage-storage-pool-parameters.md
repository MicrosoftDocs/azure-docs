---
author: khdownie
ms.service: azure-container-storage
ms.topic: include
ms.date: 03/18/2024
ms.author: kendownie
---

## Storage pool parameters for Azure Container Storage

When Azure Container Storage is installed via the `az aks create` command, a storage pool is automatically created. The following table shows the parameters you can specify for this storage pool.

| **Parameter** | **Backing storage type** | **Description** | **Available values** | **Mandatory (Y/N)** | **Default value** |
|---------------|--------------------------|-----------------|----------------------|---------------------|-------------------|
| `--enable-azure-container-storage` | All | Storage pool type to enable during installation | `azureDisk`, `ephemeralDisk`, `elasticSan` | Y | N/A |
| `--storage-pool-option` | Ephemeral Disk only | Ephemeral Disk SKU to enable | NVMe, Temp | Y (only when using Ephemeral Disk) | If this parameter isn't specified, the Ephemeral Disk SKU is local NVMe |
| `--azure-container-storage-nodepools` | All | Names of the node pools on which to install Azure Container Storage | Comma separated list of node pool names (if specifying multiple node pools) | N | nodepool1\* |
| `--storage-pool-name` | All | Storage pool name | N/A | N | `azuredisk`, `ephemeraldisk`, `elasticsan` |
| `--storage-pool-size` | All | Storage pool capacity | Storage capacity in Gi or Ti | N | Azure Disks: `512 Gi`<br/><br/>Local NVMe: Full disk<br/></br>Temp SSD: 95% of disk capacity<br/><br/>Elastic SAN: `1 Ti` |
| `--storage-pool-sku` | Azure Disks, Elastic SAN only | Storage pool SKU (performance/redundancy) | Azure Disks: `Premium_LRS`, `Standard_LRS`, `StandardSSD_LRS`, `UltraSSD_LRS`, `Premium_ZRS`, `PremiumV2_LRS`, `StandardSSD_ZRS`<br/><br />Elastic SAN: `Premium_LRS`, `Premium_ZRS` | N | `Premium_LRS` |

\*If there are any existing node pools with the `acstor.azure.com/io-engine:acstor` label then Azure Container Storage will be installed there by default. Otherwise, it's installed in the system node pool, which by default is named `nodepool1`.
