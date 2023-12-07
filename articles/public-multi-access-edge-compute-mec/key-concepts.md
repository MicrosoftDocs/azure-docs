---
title: Key concepts for Azure public MEC
description: Learn about important concepts for Azure public multi-access edge compute (MEC). 
author: reemas
ms.author: reemas
ms.service: public-multi-access-edge-compute-mec
ms.topic: conceptual
ms.date: 11/22/2022
ms.custom: template-concept, devx-track-azurecli
---

# Key concepts for Azure public MEC

This document describes important concepts for Azure public multi-access edge compute (MEC).

## ExtendedLocation field

All resource providers provide an additional field named [extendedLocation](/javascript/api/@azure/arm-compute/extendedlocation), which you use to deploy resources in the Azure public MEC.

## Azure Edge Zone ID

Every Azure public MEC site has an Azure Edge Zone ID. This ID is one of the attributes that the `extendedLocation` field uses to differentiate sites.

## Azure CLI and SDKs

To support Azure public MEC, Microsoft has updated the Azure services SDKs. For information about how to use these SDKs for deployment, see:

- [Quickstart: Deploy a virtual machine in Azure public MEC using Azure CLI](quickstart-create-vm-cli.md).
- [Tutorial: Deploy resources in Azure public MEC using the Go SDK](tutorial-create-vm-using-go-sdk.md)
- [Tutorial: Deploy a virtual machine in Azure public MEC using the Python SDK](tutorial-create-vm-using-python-sdk.md)

## ARM templates

You can use Azure Resource Manager (ARM) templates to deploy resources in the Azure public MEC. Here's an example of how to use `extendedLocation` in an ARM template to deploy a virtual machine (VM):

```json
{
  ...
  "type": "Microsoft.Compute/virtualMachines"
  "extendedLocation": {
    "type": "EdgeZone",
    "name": <edgezoneid>,
    }
  ...
}
```

## Parent Azure regions

Every Azure public MEC site is associated with a parent Azure region. This region hosts all the control plane functions associated with the services running in the Azure public MEC. The following table lists active Azure public MEC sites, along with their Edge Zone ID and associated parent region:

| Telco provider | Azure public MEC name | Edge Zone ID | Parent region |
| -------------- | --------------------- | ------------ | ------------- |
| AT&T | ATT Atlanta A | attatlanta1 | East US 2 |
| AT&T | ATT Dallas A | attdallas1 | South Central US |
| AT&T | ATT Detroit A | attdetroit1 | Central US |

## Azure services

### Azure Virtual Machines

Azure public MEC supports specific compute and GPU VM SKUs. The following table lists the supported VM sizes:

| Type | Series | VM size |
| ---- | ------ | ------- |
| VM | D-series | Standard_DS1_v2, Standard_DS2_v2, Standard_D2s_v3, Standard_D4s_v3, Standard_D8s_v3 |
| VM | E-series | Standard_E4s_v3, Standard_E8s_v3 |
| GPU | NCasT4_v3-series | Standard_NC4asT4_v3, Standard_NC8asT4_v3 |

### Public IP

Azure public MEC allows users to create Azure public IPs that you can then associate with resources such as Azure Virtual Machines, Azure Standard Load Balancer, and Azure Kubernetes Clusters. All the Azure public MEC IPs are Standard SKU public IPs.

### Azure Bastion

Azure Bastion is a service you deploy that lets you connect to a VM by using your browser and the Azure portal. To access a VM deployed in the Azure public MEC, the Bastion host must be deployed in a virtual network (VNet) in the parent Azure region of the Azure public MEC site.

### Azure Load Balancer

The Azure public MEC supports the Azure Standard Load Balancer SKU.

### Network security groups

Azure network security groups that are associated with resources created in the Azure public MEC should be created in the parent Azure region.

### Resource groups

Resource groups that are associated with resources created in the Azure public MEC should be created in the parent Azure region.

### Azure Storage services

Azure public MEC supports creating Standard SSD managed disks only. All other Azure Storage services aren't supported in the public MEC.

### Default outbound access

Because Azure public MEC doesn't support [default outbound access](../virtual-network/ip-services/default-outbound-access.md), manage your outbound connectivity by using one of the following methods:

- Use the frontend IP addresses of an Azure Load Balancer for outbound via outbound rules.
- Assign an Azure public IP to the VM.

### DNS Resolution

By default, all services running in the Azure public MEC use the DNS infrastructure in the parent Azure region.

## Next steps

To learn about considerations for deployment in the Azure public MEC, advance to the following article:

> [!div class="nextstepaction"]
> [Considerations for deployment in the Azure public MEC](considerations-for-deployment.md)
