---
title: Deploy a private mobile network and site - Azure Command-Line Interface
titleSuffix: Azure Private 5G Core
description: Learn how to deploy a private mobile network and site using Azure Command-Line Interface (Azure CLI).
author: James-Green-Microsoft
ms.author: jamesgreen
ms.service: private-5g-core
ms.topic: quickstart
ms.custom: devx-track-azurecli
ms.date: 03/15/2023
---

# Quickstart: Deploy a private mobile network and site - Azure CLI

Azure Private 5G Core is an Azure cloud service for deploying and managing 5G core network functions on an Azure Stack Edge device, as part of an on-premises private mobile network for enterprises. This quickstart describes how to use an Azure CLI to deploy the following.

- A private mobile network.
- A site.
- The default service and SIM policy (as described in [Default service and SIM policy](default-service-sim-policy.md)).
- Optionally, one or more SIMs, and a SIM group.

[!INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-cli-prerequisites-include.md)]

## Prerequisite: Prepare to deploy a private mobile network and site

- [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md) and [Commission the AKS cluster](commission-cluster.md).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor or Owner role at the subscription scope.
- [Collect the required information to deploy a private mobile network](collect-required-information-for-private-mobile-network.md). If you want to provision SIMs, you'll need to prepare a JSON file containing your SIM information, as described in [JSON file format for provisioning SIMs](collect-required-information-for-private-mobile-network.md#json-file-format-for-provisioning-sims).
- Identify the names of the interfaces corresponding to ports 5 and 6 on the Azure Stack Edge Pro device in the site.
- [Collect the required information for a site](collect-required-information-for-a-site.md).
- Refer to the release notes for the current version of packet core, and whether it's supported by the version your Azure Stack Edge (ASE) is currently running. If your ASE version is incompatible with the latest packet core, [update your Azure Stack Edge Pro GPU](../databox-online/azure-stack-edge-gpu-install-update.md).

## Azure CLI commands used in this article

- [az mobile-network create](/cli/azure/mobile-network#az-mobile-network-create)
- [az mobile-network site](/cli/azure/mobile-network/site)
- [az mobile-network pccp create](/cli/azure/mobile-network/pccp?view=azure-cli-latest#az-mobile-network-pccp-create)
- [az mobile-network pcdp create](/cli/azure/mobile-network/pcdp?view=azure-cli-latest#az-mobile-network-pcdp-create)
- [az mobile-network data-network create](/cli/azure/mobile-network/data-network?view=azure-cli-latest#az-mobile-network-data-network-create)
- [az mobile-network sim group create](/cli/azure/mobile-network/sim/group?view=azure-cli-latest#az-mobile-network-sim-group-create)
- [az mobile-network  slice create](/cli/azure/mobile-network/slice?view=azure-cli-latest#az-mobile-network-slice-create)
- [az mobile-network service create](/cli/azure/mobile-network/service?view=azure-cli-latest#az-mobile-network-service-create)
- [az mobile-network sim policy create](/cli/azure/mobile-network/sim/policy?view=azure-cli-latest#az-mobile-network-sim-policy-create)
- [az mobile network sim create](/cli/azure/mobile-network/sim#az-mobile-network-sim-create)
- [az mobile-network attached-data-network create](/cli/azure/mobile-network/attached-data-network?view=azure-cli-latest#az-mobile-network-attached-data-network-create)

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../includes/cli-launch-cloud-shell-sign-in.md.md)]

## Deploy a private mobile network, site and SIM

You must complete the following steps in order to successfully deploy a private mobile network, site and SIM. Each step must be fully complete before proceeding to the next.

### Create a Mobile Network resource

Use `az mobile-network create` to create a new **Mobile Network** resource. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| MOBILENETWORK   | Enter a name for the private mobile network.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```azurecli
az mobile-network create --location eastus -n MOBILENETWORK -g RESOURCEGROUP --identifier mcc=001 mnc=01
```

### Create a Site resource

Use `az mobile-network site` to create a new **Site** resource. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| MOBILENETWORK   | Enter the name of the private mobile network you created.      |
| SITE   | Enter the name for the site.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```azurecli
az mobile-network create --mobile-network-name MOBILENETWORK -n SITE -g RESOURCEGROUP --identifier "{mcc:001,mnc:01}"
```

```azurecli

```

### Create a Packet Core Control Plane resource

Use `az mobile-network pccp create` to create a new **Packet Core Control Plane** resource. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| CONTROLPLANE   | Enter the name for the packet core control plane.      |
| RESOURCEGROUP   | Enter the name of the resource group. |
| SITE   | Enter the name for the site.      |

```azurecli
az mobile-network pccp create -n CONTROLPLANE -g RESOURCEGROUP --access-interface "{name:N2,ipv4Address:10.28.128.2,ipv4Subnet:10.28.128.0/24,ipv4Gateway:10.28.128.1}" --local-diagnostics "{authentication-type:AAD}" --platform "{type:AKS-HCI}" --sites SITE --sku G0
```

### Create a Packet Core Data Plane resource

Use `az mobile-network pcdp create` to create a new **Packet Core Data Plane** resource. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| DATAPLANE   | Enter the name for the data plane.      |
| RESOURCEGROUP   | Enter the name of the resource group. |
| CONTROLPLANE   | Enter the name of the packet core control plane.      |

```azurecli
az mobile-network pcdp create -n DATAPLANE -g RESOURCEGROUP --pccp-name CONTROLPLANE --access-interface "{name:N2,ipv4Address:10.28.128.2,ipv4Subnet:10.28.128.0/24,ipv4Gateway:10.28.128.1}"
```

### Create a Data Network

Use `az mobile-network data-network create` to create a new **Data Network** resource. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| DATANETWORK   | Enter the name for the data network.      |
| RESOURCEGROUP   | Enter the name of the resource group. |
| MOBILENETWORK   | Enter the name of the private mobile network.      |

```azurecli
az mobile-network data-network create -n DATANETWORK -g RESOURCEGROUP --mobile-network-name MOBILENETWORK
```

### Create a SIM Group

Use `az mobile-network sim group create` to create a new **Packet Core Data Plane** resource. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).
Use `` to create a new **SIM Group**. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Variable|Placeholder|Value|
|-|-|
| SIMGROUP   | Enter the name for the sim group.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```azurecli
az mobile-network sim group create -n SIMGROUP -g RESOURCEGROUP --mobile-network "{id:mobile-network-id}"
```

Confirm that you want to perform the action by typing <kbd>Y</kbd>.

### Create a Slice

Use `az mobile-network  slice create` to create a new **Slice**. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| MOBILENETWORK   | Enter the name for the private mobile network.      |
| RESOURCEGROUP   | Enter the name of the resource group. |
| SLICE   | Enter the name of the slice. |

```azurecli
az mobile-network slice create --mobile-network-name MOBILENETWORK -n SLICE -g RESOURCEGROUP --snssai "{sst:1,sd:123abc}"
```

### Create a SIM Policy

Use `az mobile-network sim policy create` to create a new **SIM Policy**. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| RESOURCEGROUP   | Enter the name of the resource group. |
| MOBILENETWORK   | Enter the name for the private mobile network.      |
| SERVICE   | Enter the name of the service. |
| DATANETWORK   | Enter the name for the data network.      |
| SLICE   | Enter the name of the slice. |
| SIMPOLICY | Enter the name for the SIM policy. |

```azurecli
az mobile-network sim policy create -g RESOURCEGROUP -n SIMPOLICY --mobile-network-name MOBILENETWORK --default-slice SLICE --slice-config "[{slice:SLICE,defaultDataNetwork:DATANETWORK,dataNetworkConfigurations:[{dataNetwork:DATANETWORK,allowedServices:[SERVICE],sessionAmbr:{uplink:'500 Mbps',downlink:'1 Gbps'}}]}]" --ue-ambr "{uplink:'500 Mbps',downlink:'1 Gbps'}"
```

### Create a SIM

Use `` to create a new **SIM**. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| SIMGROUP   | Enter the name of the SIM group. |
| SIM   | Enter the name for the SIM.      |
| RESOURCEGROUP   | Enter the name of the resource group. |
| MOBILENETWORK   | Enter the name for the private mobile network.      |
| SERVICE   | Enter the name of the service. |
| DATANETWORK   | Enter the name for the data network.      |
| SLICE   | Enter the name of the slice. |
| SIMPOLICY | Enter the name of the SIM policy. |

```azurecli
az mobile-network sim create -g RESOURCEGROUP --sim-group-name SIMGROUP -n SIM --international-msi 0000000000 --operator-key-code 00000000000000000000000000000000 --authentication-key 00000000000000000000000000000000
```

### Attach the Data Network

Use `az mobile-network attached-data-network create` to attach the **Data Network** you created. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| DATANETWORK   | Enter the name for the data network.      |
| CONTROLPLANE | Enter the name of the packet core control plane.  |
| DATAPLANE   | Enter the name of the packet core data plane.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```azurecli
az mobile-network attached-data-network create -n DATANETWORK -g RESOURCEGROUP --pccp-name CONTROLPLANE --pcdp-name DATAPLANE --dns-addresses "[1.1.1.1]" --data-interface " {name:N2,ipv4Address:10.28.128.2,ipv4Subnet:10.28.128.0/24,ipv4Gateway:10.28.128.1}"
```


## Clean up resources

If you do not want to keep your deployment, [delete the resource group](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-portal#delete-resource-group).

## Next steps

If you have kept your deployment, you can either begin designing policy control to determine how your private mobile network handles traffic, or you can add more sites to your private mobile network.

- [Learn more about designing the policy control configuration for your private mobile network](policy-control.md).
- [Collect the required information for a site](collect-required-information-for-a-site.md).