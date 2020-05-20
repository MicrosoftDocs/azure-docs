---
title: Azure Image Builder Service networking options
description: Understand the networking options when deploying Azure VM Image Builder Service
author: cynthn
ms.author: patricka
ms.date: 05/14/2020
ms.topic: article
ms.service: virtual-machines
ms.subservice: imaging
---

# Azure Image Builder Service networking options

You need to choose to deploy Azure Image Builder with or without an existing VNET.

## Deploy without specifying an existing VNET

If you do not specify an existing VNET, Azure Image Builder creates a VNET and subnet in the staging resource group. A public IP resource is used with a network security group to restrict inbound traffic to the Azure Image Builder service. The public IP facilitates the channel for Azure Image Builder commands during the image build. Once the build completes, the VM, public IP, disks, and VNET are deleted. To use this option, do not specify any VNET properties.

## Deploy using an existing VNET

If you specify a VNET and subnet, Azure Image Builder deploys the build VM to your chosen VNET. You can access resources that are accessible on your VNET. You can also create a siloed VNET that is not connected to any other VNET. If you specify a VNET, Azure Image Builder does not use a public IP address. Communication from Azure Image Builder Service to the build VM uses Azure Private Link technology.

For more information, see one of the following examples:

* [Create a Windows Image allowing access to an existing Azure VNET](https://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts/1a_Creating_a_Custom_Win_Image_on_Existing_VNET#create-a-windows-linux-image-allowing-access-to-an-existing-azure-vnet)
* [Create a Custom Linux Image allowing access to an existing Azure VNET](https://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts/1a_Creating_a_Custom_Linux_Image_on_Existing_VNET#create-a-custom-linux-image-allowing-access-to-an-existing-azure-vnet)

### What is Azure Private Link?

Azure Private Link provides private connectivity from a virtual network to Azure platform as a service (PaaS), customer-owned, or Microsoft partner services. It simplifies the network architecture and secures the connection between endpoints in Azure by eliminating data exposure to the public internet. For more information, see the [Private Link documentation](https://docs.microsoft.com/azure/private-link).

### Required permissions for an existing VNET

The Azure Image Builder requires specific permissions to use an existing VNET. For more information, see [Configure Azure Image Builder Service permissions using Azure CLI](image-builder-permissions-cli.md) or [Configure Azure Image Builder Service permissions using PowerShell](image-builder-permissions-powershell.md).

### What is deployed during an image build?

Using an existing VNET means Azure Image Builder deploys an additional VM (proxy VM) and an Azure Load Balancer (ALB) that is connected to the Private Link. Traffic from the AIB service goes across the private link to the ALB. The ALB communicates to the proxy VM using port 60001 for Linux OS or 60000 for Windows OS. The proxy forwards commands to the build VM using port 22 for Linux OS or 5986 for Windows OS.

> [!NOTE]
> The VNET must be in the same region as the Azure Image Builder Service region.
> 

### Why deploy a Proxy VM?

When a VM without public IP is behind an Internal Load Balancer, it doesn't have Internet access. The Azure Load Balancer used for VNET is internal. The proxy VM allows Internet access for the build VM during builds. The network security groups associated can be used to restrict the build VM access.

The deployed proxy VM size is Standard A1_v2 in addition to the build VM. The proxy VM is used to send commands between the Azure Image Builder Service and the build VM. The proxy VM properties cannot be changed including size or the OS. You cannot change proxy VM properties for both Windows and Linux image builds.

### Image Template parameters to support VNET
```json
"VirtualNetworkConfig": {
        "name": "",
        "subnetName": "",
        "resourceGroupName": ""
        },
```

| Setting | Description |
|---------|---------|
| name | (Optional) Name of a pre-existing virtual network. |
| subnetName | Name of the subnet within the specified virtual network. Must be specified if and only if *name* is specified. |
| resourceGroupName | Name of the resource group containing the specified virtual network. Must be specified if and only if *name* is specified. |

Private Link service requires an IP from the given VNET and subnet. Currently, Azure doesn’t support Network Policies on these IPs. Hence, network policies need to be disabled on the subnet. For more information, see the [Private Link documentation](https://docs.microsoft.com/azure/private-link).

### Checklist for using your VNET

1. Allow Azure Load Balancer (ALB) to communicate with the proxy VM in an NSG
    * [AZ CLI Example](https://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts/1a_Creating_a_Custom_Linux_Image_on_Existing_VNET#add-nsg-rule-to-allow-the-aib-deployed-azure-load-balancer-to-communicate-with-the-proxy-vm)
    * [PowerShell Example](https://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts/1a_Creating_a_Custom_Win_Image_on_Existing_VNET#add-nsg-rule-to-allow-the-aib-deployed-azure-load-balancer-to-communicate-with-the-proxy-vm)
2. Disable Private Service Policy on subnet
    * [AZ CLI Example](https://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts/1a_Creating_a_Custom_Linux_Image_on_Existing_VNET#disable-private-service-policy-on-subnet)
    * [PowerShell Example](https://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts/1a_Creating_a_Custom_Win_Image_on_Existing_VNET#disable-private-service-policy-on-subnet)
3. Allow Azure Image Builder to create an ALB and add VMs to the VNET
    * [AZ CLI Example](https://github.com/danielsollondon/azvmimagebuilder/blob/master/aibPermissions.md#setting-aib-spn-permissions-to-allow-it-to-use-an-existing-vnet)
    * [PowerShell Example](https://github.com/danielsollondon/azvmimagebuilder/blob/master/aibPermissions.md#setting-aib-spn-permissions-to-allow-it-to-use-an-existing-vnet-1)
4. Allow Azure Image Builder to read/write source images and create images
    * [AZ CLI Example](https://github.com/danielsollondon/azvmimagebuilder/blob/master/aibPermissions.md#setting-aib-spn-permissions-to-use-source-custom-image-and-distribute-a-custom-image)
    * [PowerShell Example](https://github.com/danielsollondon/azvmimagebuilder/blob/master/aibPermissions.md#setting-aib-spn-permissions-to-use-source-custom-image-and-distribute-a-custom-image-1)
5. Ensure you are using VNET in the same region as the Azure Image Builder Service region.