---
title: Deploy a private mobile network and site - Azure PowerShell
titleSuffix: Azure Private 5G Core
description: Learn how to deploy a private mobile network and site using Azure PowerShell.
author: James-Green-Microsoft
ms.author: jamesgreen
ms.service: private-5g-core
ms.topic: quickstart
ms.custom: devx-track-azurepowershell
ms.date: 03/15/2023
---

# Quickstart: Deploy a private mobile network and site - Azure PowerShell

Azure Private 5G Core is an Azure cloud service for deploying and managing 5G core network functions on an Azure Stack Edge device, as part of an on-premises private mobile network for enterprises. This quickstart describes how to use an Azure PowerShell to deploy the following resources in the East US Azure region. See [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=private-5g-core) for the Azure regions where Azure Private 5G Core is available.

- A private mobile network.
- A site.
- The default service and allow-all SIM policy (as described in [Default service and allow-all SIM policy](default-service-sim-policy.md)).
- Optionally, one or more SIMs, and a SIM group.

[!INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]

## Prerequisite: Prepare to deploy a private mobile network and site

- [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md) and [Commission the AKS cluster](commission-cluster.md).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor or Owner role at the subscription scope.
- [Collect the required information to deploy a private mobile network](collect-required-information-for-private-mobile-network.md). If you want to provision SIMs, you'll need to prepare a JSON file containing your SIM information, as described in [JSON file format for provisioning SIMs](collect-required-information-for-private-mobile-network.md#json-file-format-for-provisioning-sims).
- Identify the names of the interfaces corresponding to ports 5 and 6 on the Azure Stack Edge Pro device in the site.
- [Collect the required information for a site](collect-required-information-for-a-site.md).
- Refer to the release notes for the current version of packet core, and whether it's supported by the version your Azure Stack Edge (ASE) is currently running. If your ASE version is incompatible with the latest packet core, [update your Azure Stack Edge Pro GPU](../databox-online/azure-stack-edge-gpu-install-update.md).

## Azure PowerShell commands used in this article

- [New-AzMobileNetwork](/powershell/module/az.mobilenetwork/new-azmobilenetwork)
- [New-AzMobileNetworkSimGroup](/powershell/module/az.mobilenetwork/new-azmobilenetworksimgroup)
- [New-AzMobileNetworkSlice](/powershell/module/az.mobilenetwork/new-azmobilenetworkslice)
- [New-AzMobileNetworkServiceResourceIdObject](/powershell/module/az.mobilenetwork/new-azmobilenetworkserviceresourceidobject)
- [New-AzMobileNetworkSim](/powershell/module/az.mobilenetwork/new-azmobilenetworksim)
- [New-AzMobileNetworkSimStaticIPPropertiesObject](/powershell/module/az.mobilenetwork/new-azmobilenetworksimstaticippropertiesobject)
- [New-AzMobileNetworkSite](/powershell/module/az.mobilenetwork/new-azmobilenetworksite)

## Sign in to Azure

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../includes/sample-powershell-install-no-ssh-az.md)]

## Deploy a private mobile network, site and SIM

You must complete the following steps in order to successfully deploy a private mobile network, site and SIM. Each step must be fully complete before proceeding to the next.

Several commands will require the ID of the Azure subscription in which the Azure resources are to be deployed. This appears as `<SUB_ID>` in the commands below. Obtain that value before you proceed.

### Create a Mobile Network resource

Use `New-AzMobileNetwork` to create a new **Mobile Network** resource. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| `<MOBILENETWORK>`   | Enter a name for the private mobile network.      |
| `<RESOURCEGROUP>`   | Enter the name of the resource group. |

```powershell
New-AzMobileNetwork -Name <MOBILENETWORK> -ResourceGroupName <RESOURCEGROUP> -Location eastus -PublicLandMobileNetworkIdentifierMcc 001 -PublicLandMobileNetworkIdentifierMnc 01
```

### Create a SIM Group

Use `New-AzMobileNetworkSimGroup` to create a new **SIM Group**. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Variable|Placeholder|Value|
|-|-|
| `<SIMGROUP>`   | Enter the name for the sim group.      |
| `<RESOURCEGROUP>`   | Enter the name of the resource group. |
| `<SUB_ID>` | The ID of the Azure subscription in which the Azure resources are to be deployed. |

```powershell
New-AzMobileNetworkSimGroup -Name <SIMGROUP> -ResourceGroupName <RESOURCEGROUP> -Location eastus -MobileNetworkId "/subscriptions/<SUB_ID>/resourceGroups/<RESOURCEGROUP>/providers/Microsoft.MobileNetwork/mobileNetworks/<MOBILENETWORK>"
```

Confirm that you want to perform the action by typing <kbd>Y</kbd>.

### Create a Slice

Use `New-AzMobileNetworkSlice` to create a new **Slice**. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| `<MOBILENETWORK>`   | Enter the name for the private mobile network.      |
| `<RESOURCEGROUP>`   | Enter the name of the resource group. |
| `<SLICE>`   | Enter the name of the slice. |
| `<SUB_ID>` | The ID of the Azure subscription in which the Azure resources are to be deployed. |

```powershell
New-AzMobileNetworkSlice -MobileNetworkName <MOBILENETWORK> -ResourceGroupName <RESOURCEGROUP> -SliceName <SLICE> -Location eastus -SnssaiSst 1
```

Create a variable for the **Slice** resource's configuration.

```powershell
$sliceConfiguration = New-AzMobileNetworkSliceConfigurationObject -DataNetworkConfiguration $dataNetworkConfiguration -DefaultDataNetworkId "/subscriptions/<SUB_ID>/resourceGroups/<RESOURCEGROUP>/providers/Microsoft.MobileNetwork/mobileNetworks/<MOBILENETWORK>/dataNetworks/<DATANETWORK>" -SliceId "/subscriptions/<SUB_ID>/resourceGroups/<RESOURCEGROUP>/providers/Microsoft.MobileNetwork/mobileNetworks/<MOBILENETWORK>/slices/<SLICE>"
```

### Create a Service

Use `New-AzMobileNetworkService` to create a new **Service**. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| `<MOBILENETWORK>`   | Enter the name for the private mobile network.      |
| `<RESOURCEGROUP>`   | Enter the name of the resource group. |
| `<SERVICE>`   | Enter the name of the service. |
| `<SUB_ID>` | The ID of the Azure subscription in which the Azure resources are to be deployed. |

```powershell
$dataFlowTemplates = New-AzMobileNetworkServiceDataFlowTemplateObject -Direction Bidirectional -Protocol ip -RemoteIPList any -TemplateName any

$pccRule = New-AzMobileNetworkPccRuleConfigurationObject -RuleName rule_any -RulePrecedence 199 -ServiceDataFlowTemplate $dataFlowTemplates

New-AzMobileNetworkService -MobileNetworkName <MOBILENETWORK> -Name <SERVICE> -ResourceGroupName <RESOURCEGROUP> -Location eastus -PccRule $pccRule -ServicePrecedence 255
```

Create a variable for the **Service** resource's ID.

```powershell
$serviceResourceId = New-AzMobileNetworkServiceResourceIdObject -Id "/subscriptions/<SUB_ID>/resourceGroups/<RESOURCEGROUP>/providers/Microsoft.MobileNetwork/mobileNetworks/<MOBILENETWORK>/services/<SERVICE>"
```

### Create a SIM Policy

Use `New-AzMobileNetworkSimPolicy` to create a new **SIM Policy**. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| `<RESOURCEGROUP>`   | Enter the name of the resource group. |
| `<MOBILENETWORK>`   | Enter the name for the private mobile network.      |
| `<SERVICE>`   | Enter the name of the service. |
| `<DATANETWORK>`   | Enter the name for the data network.      |
| `<SLICE>`   | Enter the name of the slice. |
| `<SIMPOLICY>` | Enter the name for the SIM policy. |
| `<SUB_ID>` | The ID of the Azure subscription in which the Azure resources are to be deployed. |

```powershell
New-AzMobileNetworkSimPolicy -MobileNetworkName <MOBILENETWORK> -Name <SIMPOLICY> -ResourceGroupName <RESOURCEGROUP> -DefaultSliceId "/subscriptions/<SUB_ID>/resourceGroups/<RESOURCEGROUP>/providers/Microsoft.MobileNetwork/mobileNetworks/<MOBILENETWORK>/slices/<SLICE>" -Location eastus -SliceConfiguration $sliceConfiguration -UeAmbrDownlink "2 Gbps" -UeAmbrUplink "2 Gbps"
```

### Create a SIM

Use `New-AzMobileNetworkSim` to create a new **SIM**. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| `<SIMGROUP>`   | Enter the name of the SIM group. |
| `<SIM>`   | Enter the name for the SIM.      |
| `<RESOURCEGROUP>`   | Enter the name of the resource group. |
| `<MOBILENETWORK>`   | Enter the name for the private mobile network.      |
| `<SERVICE>`   | Enter the name of the service. |
| `<DATANETWORK>`   | Enter the name for the data network.      |
| `<SLICE>`   | Enter the name of the slice. |
| `<SIMPOLICY>` | Enter the name of the SIM policy. |
| `<SUB_ID>` | The ID of the Azure subscription in which the Azure resources are to be deployed. |

```powershell
$staticIp = New-AzMobileNetworkSimStaticIPPropertiesObject -StaticIPIpv4Address 10.0.0.20

New-AzMobileNetworkSim -GroupName <SIMGROUP> -Name <SIM> -ResourceGroupName <RESOURCEGROUP>  -InternationalMobileSubscriberIdentity 000000000000001 -AuthenticationKey 00112233445566778899AABBCCDDEEFF -DeviceType Mobile -IntegratedCircuitCardIdentifier 8900000000000000001 -OperatorKeyCode 00000000000000000000000000000001 -SimPolicyId "/subscriptions/<SUB_ID>/resourceGroups/<RESOURCEGROUP>/providers/Microsoft.MobileNetwork/mobileNetworks/<MOBILENETWORK>/simPolicies/<SIMPOLICY>" -StaticIPConfiguration $staticIp
```

### Create a Site and dependant resources

Use `New-AzMobileNetworkSite` to create the new **Site** resource and all remaining required resources (PCCP, PCDP, and ADN). Once complete the application will be fully deployed. The example command uses the following placeholder values, replace them with the information gathered in [Prerequisite: Prepare to deploy a private mobile network and site](#prerequisite-prepare-to-deploy-a-private-mobile-network-and-site).

|Placeholder|Value|
|-|-|
| `<RESOURCEGROUP>`   | Enter the name of the resource group. |
| `<SUB_ID>` | The ID of the Azure subscription in which the Azure resources are to be deployed. |
| `<ASE>` | Enter the name for the ASE device. |
| `<MOBILENETWORK>`   | Enter the name of the private mobile network you created.      |
| `<SITE>`   | Enter the name for the site.      |
| `<CUSTOMLOCATION>` | Enter the name for the custom location. |
| `<DATANETWORK>`   | Enter the name for the data network.      |

```powershell
$aseId = "/subscriptions/<SUB_ID>/resourceGroups/<RESOURCEGROUP>/providers/Microsoft.DataBoxEdge/DataBoxEdgeDevices/<ASE>"

$customLocationId = "/subscriptions/<SUB_ID>/resourceGroups/<RESOURCEGROUP>/providers/Microsoft.ExtendedLocation/customLocations/<CUSTOMLOCATION>"

New-AzMobileNetworkSite -Name <SITE> -ResourceGroup <RESOURCEGROUP> -Location eastus -PlatformType AKS-HCI -Sku G0 -MobileNetwork <MOBILENETWORK> -ControlPlaneAccessInterfaceIpv4Address 10.232.44.56 -ControlPlaneAccessInterfaceIpv4Subnet 10.232.44.0/24 -ControlPlaneAccessInterfaceIpv4Gateway 10.232.44.1 -ControlPlaneAccessInterfaceName N2 -UserPlaneAccessInterfaceName N3 -UserPlaneAccessInterfaceIpv4Address 192.168.0.101 -UserPlaneAccessInterfaceIpv4Gateway 192.168.0.1 -UserPlaneAccessInterfaceIpv4Subnet 192.168.0.0/24 -UserPlaneDataInterfaceIpv4Address 10.0.0.101 -UserPlaneDataInterfaceIpv4Subnet 10.0.0.0/8 -UserPlaneDataInterfaceIpv4Gateway 10.0.0.1 -DataNetworkName <DATANETWORK> -LocalDiagnosticAccessAuthenticationType Password -UserEquipmentAddressPoolPrefix 192.168.1.0/24 -CoreNetworkTechnology 5GC -AzureStackEdgeDeviceId $aseId -UserPlaneDataInterfaceName N6 -DnsAddress 1.1.1.1 -CustomLocation $customLocationId
```

## Clean up resources

If you do not want to keep your deployment, [delete the resource group](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-portal#delete-resource-group).

## Next steps

If you have kept your deployment, you can either begin designing policy control to determine how your private mobile network handles traffic, or you can add more sites to your private mobile network.

- [Learn more about designing the policy control configuration for your private mobile network](policy-control.md).
- [Collect the required information for a site](collect-required-information-for-a-site.md).
