---
title: Deploy a private mobile network and site - command line
titleSuffix: Azure Private 5G Core
description: Learn how to deploy a private mobile network and site using Azure Command Line Interface (AzCLI) or PowerShell.
author: James-Green-Microsoft
ms.author: jamesgreen
ms.service: private-5g-core
ms.topic: quickstart
ms.custom: devx-track-azurecli
ms.date: 03/15/2023
---

# Quickstart: Deploy a private mobile network and site - command line

Azure Private 5G Core is an Azure cloud service for deploying and managing 5G core network functions on an Azure Stack Edge device, as part of an on-premises private mobile network for enterprises. This quickstart describes how to use a Azure COmmand Line Interface or PowerShell to deploy the following.

- A private mobile network.
- A site.
- The default service and SIM policy (as described in [Default service and SIM policy](default-service-sim-policy.md)).
- Optionally, one or more SIMs, and a SIM group.

## Prerequisites

[!INCLUDE [azure-ps-prerequisites-include.md](../../../includes/azure-ps-prerequisites-include.md)]

- [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md) and [Commission the AKS cluster](commission-cluster.md).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor or Owner role at the subscription scope.
- [Collect the required information to deploy a private mobile network](collect-required-information-for-private-mobile-network.md). If you want to provision SIMs, you'll need to prepare a JSON file containing your SIM information, as described in [JSON file format for provisioning SIMs](collect-required-information-for-private-mobile-network.md#json-file-format-for-provisioning-sims).
- Identify the names of the interfaces corresponding to ports 5 and 6 on the Azure Stack Edge Pro device in the site.
- [Collect the required information for a site](collect-required-information-for-a-site.md).
- Refer to the release notes for the current version of packet core, and whether it's supported by the version your Azure Stack Edge (ASE) is currently running. If your ASE version is incompatible with the latest packet core, [update your Azure Stack Edge Pro GPU](../databox-online/azure-stack-edge-gpu-install-update.md).

## Azure Powershell commands used in this article

- [New-AzMobileNetwork](/powershell/module/az.mobilenetwork/new-azmobilenetwork?view=azps-9.5.0)
- [New-AzMobileNetworkSite](/powershell/module/az.mobilenetwork/new-azmobilenetworksite?view=azps-9.5.0)
- [New-AzMobileNetworkPacketCoreControlPlane](/powershell/module/az.mobilenetwork/new-azmobilenetworkpacketcorecontrolplane?view=azps-9.5.0)
- [New-AzMobileNetworkPacketCoreDataPlane](/powershell/module/az.mobilenetwork/new-azmobilenetworkpacketcoredataplane?view=azps-9.5.0)
- [New-AzMobileNetworkDataNetwork](/powershell/module/az.mobilenetwork/new-azmobilenetworkdatanetwork?view=azps-9.5.0)
- [New-AzMobileNetworkAttachedDataNetwork](/powershell/module/az.mobilenetwork/new-azmobilenetworkattacheddatanetwork?view=azps-9.5.0)
- [New-AzMobileNetworkSimGroup](/powershell/module/az.mobilenetwork/new-azmobilenetworksimgroup?view=azps-9.5.0)
- [New-AzMobileNetworkSlice](/powershell/module/az.mobilenetwork/new-azmobilenetworkslice?view=azps-9.5.0)
- [New-AzMobileNetworkServiceResourceIdObject](/powershell/module/az.mobilenetwork/new-azmobilenetworkserviceresourceidobject?view=azps-9.5.0)
- [New-AzMobileNetworkSimStaticIPPropertiesObject](/powershell/module/az.mobilenetwork/new-azmobilenetworksimstaticippropertiesobject?view=azps-9.5.0)

## Deploy a private mobile network, site and SIM

You must complete the following steps in order to successfully deploy a private mobile network, site and SIM. Each step must be fully complete before proceeding to the next.

### Open Azure Cloud Shell

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Create a Mobile Network resource

Use `New-AzMobileNetwork` to create a new **Mobile Network** resource. The example below uses the following placeholder values, replace them with the information gathered in [Prerequisites](#prerequisites).

|Placeholder|Value|
|-|-|
| MOBILENETWORK   | Enter a name for the private mobile network.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```powershell
New-AzMobileNetwork -Name MOBILENETWORK -ResourceGroupName RESOURCEGROUP -Location eastus -PublicLandMobileNetworkIdentifierMcc 001 -PublicLandMobileNetworkIdentifierMnc 01
```

### Create a Site resource

Use `New-AzMobileNetworkSite` to create a new **Site** resource. The example below uses the following placeholder values, replace them with the information gathered in [Prerequisites](#prerequisites).

|Placeholder|Value|
|-|-|
| MOBILENETWORK   | Enter the name of the private mobile network you created.      |
| SITE   | Enter the name for the site.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```powershell
New-AzMobileNetworkSite -MobileNetworkName MOBILENETWORK -Name SITE -ResourceGroupName RESOURCEGROUP -Location eastus
```

```powershell
$siteResourceId = New-AzMobileNetworkSiteResourceIdObject -Id /subscriptions/2c5961fe-118a-40e2-856b-382f8e0c71d0/resourceGroups/RESOURCEGROUP/providers/Microsoft.MobileNetwork/mobileNetworks/MOBILENETWORK/sites/SITE
```

### Create a Packet Core Control Plane resource

Use `New-AzMobileNetworkPacketCoreControlPlane` to create a new **Packet Core Control Plane** resource. The example below uses the following placeholder values, replace them with the information gathered in [Prerequisites](#prerequisites).

|Placeholder|Value|
|-|-|
| CONTROLPLANE   | Enter the name for the packet core control plane.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```powershell
New-AzMobileNetworkPacketCoreControlPlane -Name CONTROLPLANE -ResourceGroupName RESOURCEGROUP -LocalDiagnosticAccessAuthenticationType Password -Location eastus -PlatformType AKS-HCI -Site $siteResourceId -Sku G0 -ControlPlaneAccessInterfaceIpv4Address 192.168.1.10 -ControlPlaneAccessInterfaceIpv4Gateway 192.168.1.1 -ControlPlaneAccessInterfaceIpv4Subnet 192.168.1.0/24 -ControlPlaneAccessInterfaceName N2 -CoreNetworkTechnology 5GC
```

### Create a Packet Core Data Plane resource

Use `New-AzMobileNetworkPacketCoreDataPlane` to create a new **Packet Core Data Plane** resource. The example below uses the following placeholder values, replace them with the information gathered in [Prerequisites](#prerequisites).

|Placeholder|Value|
|-|-|
| DATAPLANE   | Enter the name for the data plane.      |
| CONTROLPLANE   | Enter the name of the packet core control plane.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```powershell
New-AzMobileNetworkPacketCoreDataPlane -Name DATAPLANE -PacketCoreControlPlaneName CONTROLPLANE -ResourceGroupName RESOURCEGROUP -Location eastus -UserPlaneAccessInterfaceIpv4Address 10.0.1.10 -UserPlaneAccessInterfaceIpv4Gateway 10.0.1.1 -UserPlaneAccessInterfaceIpv4Subnet 10.0.1.0/24 -UserPlaneAccessInterfaceName N3
```

### Create a Data Network

Use `New-AzMobileNetworkDataNetwork` to create a new **Data Network** resource. The example below uses the following placeholder values, replace them with the information gathered in [Prerequisites](#prerequisites).

|Placeholder|Value|
|-|-|
| MOBILENETWORK   | Enter the name of the private mobile network.      |
| DATANETWORK   | Enter the name for the data network.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```powershell
New-AzMobileNetworkDataNetwork -MobileNetworkName MOBILENETWORK -Name
 DATANETWORK -ResourceGroupName RESOURCEGROUP -Location eastus
```

### Attach the Data Network

Use `New-AzMobileNetworkAttachedDataNetwork` to attach the **Data Network** you just created. The example below uses the following placeholder values, replace them with the information gathered in [Prerequisites](#prerequisites).

|Placeholder|Value|
|-|-|
| DATANETWORK   | Enter the name for the data network.      |
| CONTROLPLANE | Enter the name of the packet core control plane.  |
| DATAPLANE   | Enter the name of the packet core data plane.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```powershell
New-AzMobileNetworkAttachedDataNetwork -Name DATANETWORK -PacketCoreControlPlaneName CONTROLPLANE -PacketCoreDataPlaneName DATAPLANE -ResourceGroupName RESOURCEGROUP -DnsAddress $dns -Location eastus -UserPlaneDataInterfaceIpv4Address 10.0.0.10 -UserPlaneDataInterfaceIpv4Gateway 10.0.0.1 -UserPlaneDataInterfaceIpv4Subnet 10.0.0.0/24 -UserPlaneDataInterfaceName N6
```

### Create a SIM Group

Use `New-AzMobileNetworkSimGroup` to create a new **SIM Group**. The example below uses the following placeholder values, replace them with the information gathered in [Prerequisites](#prerequisites).

|Variable|Placeholder|Value|
|-|-|
| SIMGROUP   | Enter the name for the sim group.      |
| RESOURCEGROUP   | Enter the name of the resource group. |

```powershell
New-AzMobileNetworkSimGroup -Name SIMGROUP -ResourceGroupName RESOURCEGROUP -Location eastus -MobileNetworkId "/subscriptions/2e6a1160-c68f-4298-b9fe-c510912f8b3a/resourceGroups/rf4-https-dev-msi/providers/Microsoft.MobileNetwork/mobileNetworks/MOBILENETWORK8"
```

Confirm that you want to perform the action by typing <kbd>Y</kbd>.

### Create a Slice

Use `New-AzMobileNetworkSlice` to create a new **Slice**. The example below uses the following placeholder values, replace them with the information gathered in [Prerequisites](#prerequisites).

|Placeholder|Value|
|-|-|
| MOBILENETWORK   | Enter the name for the private mobile network.      |
| RESOURCEGROUP   | Enter the name of the resource group. |
| SLICE   | Enter the name of the slice. |

```powershell
New-AzMobileNetworkSlice -MobileNetworkName MOBILENETWORK -ResourceGroupName RESOURCEGROUP -SliceName SLICE -Location eastus -SnssaiSst 1
```

### Create a SIM Policy

Use `New-AzMobileNetworkSimPolicy` to create a new **SIM Policy**. The example below uses the following placeholder values, replace them with the information gathered in [Prerequisites](#prerequisites).

|Placeholder|Value|
|-|-|
| RESOURCEGROUP   | Enter the name of the resource group. |
| MOBILENETWORK   | Enter the name for the private mobile network.      |
| SERVICE   | Enter the name of the service. |
| DATANETWORK   | Enter the name for the data network.      |
| SLICE   | Enter the name of the slice. |
| SIMPOLICY | Enter the name for the SIM policy. |

```powershell
$serviceResourceId = New-AzMobileNetworkServiceResourceIdObject -Id "/subscriptions/2c5961fe-118a-40e2-856b-382f8e0c71d0/resourceGroups/RESOURCEGROUP/providers/Microsoft.MobileNetwork/mobileNetworks/MOBILENETWORK/services/SERVICE"

$dataNetworkConfiguration =  New-AzMobileNetworkDataNetworkConfigurationObject -AllowedService $ServiceResourceId -DataNetworkId "/subscriptions/2c5961fe-118a-40e2-856b-382f8e0c71d0/resourceGroups/RESOURCEGROUP/providers/Microsoft.MobileNetwork/mobileNetworks/MOBILENETWORK/dataNetworks/DATANETWORK" -SessionAmbrDownlink "1 Gbps" -SessionAmbrUplink "500 Mbps" -FiveQi 9 -AllocationAndRetentionPriorityLevel 9 -DefaultSessionType 'IPv4' -MaximumNumberOfBufferedPacket 200 -PreemptionCapability 'NotPreempt' -PreemptionVulnerability 'Preemptable'

$sliceConfiguration = New-AzMobileNetworkSliceConfigurationObject -DataNetworkConfiguration $dataNetworkConfiguration -DefaultDataNetworkId "/subscriptions/2c5961fe-118a-40e2-856b-382f8e0c71d0/resourceGroups/RESOURCEGROUP/providers/Microsoft.MobileNetwork/mobileNetworks/MOBILENETWORK/dataNetworks/DATANETWORK" -SliceId "/subscriptions/2c5961fe-118a-40e2-856b-382f8e0c71d0/resourceGroups/RESOURCEGROUP/providers/Microsoft.MobileNetwork/mobileNetworks/MOBILENETWORK/slices/SLICE"

New-AzMobileNetworkSimPolicy -MobileNetworkName MOBILENETWORK -Name SIMPOLICY -ResourceGroupName RESOURCEGROUP -DefaultSlouseId "/subscriptions/2c5961fe-118a-40e2-856b-382f8e0c71d0/resourceGroups/RESOURCEGROUP/providers/Microsoft.MobileNetwork/mobileNetworks/MOBILENETWORK/slices/SLICE" -Location eastus -SliceConfiguration $sliceConfiguration -UeAmbrDownlink "2 Gbps" -UeAmbrUplink "2 Gbps"
```

### Create a SIM

Use `New-AzMobileNetworkSim` to create a new **SIM**. The example below uses the following placeholder values, replace them with the information gathered in [Prerequisites](#prerequisites).

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

```powershell
$staticIp = New-AzMobileNetworkSimStaticIPPropertiesObject -StaticIPIpv4Address 10.0.0.20

New-AzMobileNetworkSim -GroupName SIMGROUP -Name SIM -ResourceGroupName RESOURCEGROUP  -InternationalMobileSubscriberIdentity 000000000000001 -AuthenticationKey 00112233445566778899AABBCCDDEEFF -DeviceType Mobile -IntegratedCircuitCardIdentifier 8900000000000000001 -OperatorKeyCode 00000000000000000000000000000001 -SimPolicyId "/subscriptions/2c5961fe-118a-40e2-856b-382f8e0c71d0/resourceGroups/RESOURCEGROUP/providers/Microsoft.MobileNetwork/mobileNetworks/MOBILENETWORK/simPolicies/SIMPOLICY" -StaticIPConfiguration $staticIp
```

## Clean up resources

If you do not want to keep your deployment, [delete the resource group](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-portal#delete-resource-group).

## Next steps

If you have kept your deployment, you can either begin designing policy control to determine how your private mobile network will handle traffic, or you can add more sites to your private mobile network.

- [Learn more about designing the policy control configuration for your private mobile network](policy-control.md)
- [Collect the required information for a site](collect-required-information-for-a-site.md)