---
title: Key concepts for Azure public MEC Preview
description: Learn about important concepts for Azure public multi-access edge compute (MEC). 
author: moushumig
ms.author: moghosal
ms.service: public-multi-access-edge-compute-mec
ms.topic: conceptual
ms.date: 02/24/2022
ms.custom: template-concept
---

# Key concepts for Azure public MEC Preview

This document describes important concepts for Azure public multi-access edge compute (MEC) Preview.

## ExtendedLocation field

All resource providers provide an additional field called [extendedLocation](/javascript/api/@azure/arm-compute/extendedlocation), which you use to deploy resources in the Azure public MEC.

## Azure Edge Zone ID

Every Azure public MEC site has an Azure Edge Zone ID. This ID is one of the attributes that the `extendedLocation` field uses to differentiate sites.

## Azure CLI and SDKs

SDKs for services supported in Azure public MEC have been updated. For information about how to use these SDKs for deployment, see [Tutorial: Deploy resources in Azure public MEC using the Go SDK](tutorial-create-vm-using-go-sdk.md), [Tutorial: Deploy a virtual machine in Azure public MEC using Python SDK](tutorial-create-vm-using-python-sdk.md), and [Quickstart: Deploy a virtual machine in Azure public MEC using Azure CLI](quickstart-create-vm-cli.md).

## ARM templates

You can use ARM Templates to deploy resources in the Azure public MEC. Here's an example of how `extendedLocation` is used in an Azure Resource Manager (ARM) template to deploy a virtual machine (VM):

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

## Parent regions

Every Azure public MEC site is associated with a parent Azure region. This region hosts all the control plane functions associated with the services running in the Azure public MEC. The following table lists active Azure public MEC sites, along with their Edge Zone ID and associated parent region.

| Telco provider | Azure public MEC name | Edge Zone ID | Parent region |
| -------------- | --------------------- | ------------ | ------------- |
| AT&T | ATT Atlanta A | attatlanta1 | East US 2 |
| AT&T | ATT Dallas A | attdallas1 | South Central US |

## Azure services

### Azure virtual machines

Azure public MEC supports specific compute and GPU VM SKUs. The following table lists the supported VM sizes:

| Type | Series | VM size |
| ---- | ------ | ------- |
| VM | D-series | D2s_v3, D4s_v3, D8s_v3 |
| VM | E-series | E4s_v3, E8s_v3 |
| GPU | NCasT4_v3-series | Standard_NC4asT4_v3, Standard_NC8asT4_v3 |

### Public IP

Azure public MEC allows users to create public IPs that can be then associated with resources such as Azure Virtual Machines, Azure Standard Load Balancer, and Azure Kubernetes Clusters. All the Azure public MEC IPs are the Standard public IP SKU.

### Azure Bastion

Azure Bastion is a service you deploy that lets you connect to a virtual machine by using your browser and the Azure portal. To access a VM deployed in the Azure public MEC, the Bastion host must be deployed in a VNet in the parent region of the Azure public MEC site.

### Azure Load Balancer

The Azure public MEC supports the Standard Load Balancer SKU.

### Network Security Groups

Network Security Groups should be created in the parent region, and then can be associated to resources created in the Azure public MEC.

### Resource Groups

Resource Groups should  be created in the parent Azure region, and then can be associated to resources created in the Azure public MEC.

### Storage Services

Azure public MEC only supports creating Standard SSD Managed Disks. All other storage services are currently not supported in the public MEC.

### Default outbound access

Because [default outbound access](/azure/virtual-network/ip-services/default-outbound-access) isn't supported on the public MEC, manage your outbound connectivity by using one of the following methods:

- Use the frontend IP addresses of a Load Balancer for outbound via outbound rules.
- Assign a public IP to the VM.

### DNS Resolution

By default, all services running in the Azure public MEC use the DNS infrastructure in the Azure parent region.

## Next steps

To learn about considerations for deployment in the Azure public MEC, advance to the following article:

> [!div class="nextstepaction"]
> [Considerations for deployment in the Azure public MEC](considerations-for-deployment.md)
