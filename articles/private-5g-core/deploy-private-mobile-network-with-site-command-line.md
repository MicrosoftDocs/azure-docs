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

- 

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../includes/cli-launch-cloud-shell-sign-in.md.md)]

## Deploy a private mobile network, site and SIM

You must complete the following steps in order to successfully deploy a private mobile network, site and SIM. Each step must be fully complete before proceeding to the next.

### Create a Mobile Network resource

Use `` to create a new **Mobile Network** resource. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| MOBILENETWORK   | Enter a name for the private mobile network.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```azurecli

```

### Create a Site resource

Use `` to create a new **Site** resource. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| MOBILENETWORK   | Enter the name of the private mobile network you created.      |
| SITE   | Enter the name for the site.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```azurecli

```

```azurecli

```

### Create a Packet Core Control Plane resource

Use `` to create a new **Packet Core Control Plane** resource. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| CONTROLPLANE   | Enter the name for the packet core control plane.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```azurecli

```

### Create a Packet Core Data Plane resource

Use `` to create a new **Packet Core Data Plane** resource. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| DATAPLANE   | Enter the name for the data plane.      |
| CONTROLPLANE   | Enter the name of the packet core control plane.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```azurecli

```

### Create a Data Network

Use `` to create a new **Data Network** resource. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| MOBILENETWORK   | Enter the name of the private mobile network.      |
| DATANETWORK   | Enter the name for the data network.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```azurecli

```

### Create a SIM Group

Use `` to create a new **SIM Group**. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Variable|Placeholder|Value|
|-|-|
| SIMGROUP   | Enter the name for the sim group.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```azurecli

```

Confirm that you want to perform the action by typing <kbd>Y</kbd>.

### Create a Slice

Use `` to create a new **Slice**. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| MOBILENETWORK   | Enter the name for the private mobile network.      |
| RESOURCEGROUP   | Enter the name of the resource group. |
| SLICE   | Enter the name of the slice. |

```azurecli

```

### Create a SIM Policy

Use `` to create a new **SIM Policy**. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| RESOURCEGROUP   | Enter the name of the resource group. |
| MOBILENETWORK   | Enter the name for the private mobile network.      |
| SERVICE   | Enter the name of the service. |
| DATANETWORK   | Enter the name for the data network.      |
| SLICE   | Enter the name of the slice. |
| SIMPOLICY | Enter the name for the SIM policy. |

```azurecli

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

```

### Attach the Data Network

Use `` to attach the **Data Network** you created. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| DATANETWORK   | Enter the name for the data network.      |
| CONTROLPLANE | Enter the name of the packet core control plane.  |
| DATAPLANE   | Enter the name of the packet core data plane.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```azurecli

```

## Clean up resources

If you do not want to keep your deployment, [delete the resource group](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-portal#delete-resource-group).

## Next steps

If you have kept your deployment, you can either begin designing policy control to determine how your private mobile network handles traffic, or you can add more sites to your private mobile network.

- [Learn more about designing the policy control configuration for your private mobile network](policy-control.md).
- [Collect the required information for a site](collect-required-information-for-a-site.md).