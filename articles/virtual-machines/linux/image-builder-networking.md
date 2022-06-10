---
title: Azure Image Builder networking options
description: Understand the networking options available to you when you deploy the Image Builder service of Azure Virtual Machines.
author: kof-f
ms.author: kofiforson
ms.reviewer: cynthn
ms.date: 08/10/2020
ms.topic: article
ms.service: virtual-machines
ms.subservice: image-builder

---

# Azure Image Builder networking options

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

With Azure Image Builder, you choose to deploy the service with or without an existing virtual network. The following sections provide more details about this choice.

## Deploy without specifying an existing virtual network

If you don't specify an existing virtual network, Azure Image Builder creates one, along with a subnet, in the staging resource group. The service uses a public IP resource with a network security group to restrict inbound traffic. The public IP facilitates the channel for commands during the image build. After the build completes, the virtual machine (VM), public IP, disks, and virtual network are deleted. To use this option, don't specify any virtual network properties.

## Deploy by using an existing virtual network

If you specify a virtual network and subnet, Azure Image Builder deploys the build VM to your chosen virtual network. You can access resources that are accessible on your virtual network. You can also create a siloed virtual network, unconnected to any other virtual network. If you specify a virtual network, Azure Image Builder doesn't use a public IP address. Communication from Azure Image Builder to the build virtual machine uses Azure Private Link.

For more information, see one of the following examples:

* [Use Azure Image Builder for Windows VMs allowing access to an existing Azure virtual network](../windows/image-builder-vnet.md)
* [Use Azure Image Builder for Linux VMs allowing access to an existing Azure virtual network](image-builder-vnet.md)

### What is Azure Private Link?

Azure Private Link provides private connectivity from a virtual network to Azure platform as a service (PaaS), or to customer-owned or Microsoft partner services. It simplifies the network architecture, and secures the connection between endpoints in Azure by eliminating data exposure to the public internet. For more information, see the [Private Link documentation](../../private-link/index.yml).

### Required permissions for an existing virtual network

Azure Image Builder requires specific permissions to use an existing virtual network. For more information, see [Configure Azure Image Builder permissions by using the Azure CLI](image-builder-permissions-cli.md) or [Configure Azure Image Builder permissions by using PowerShell](image-builder-permissions-powershell.md).

### What is deployed during an image build?

If you use an existing virtual network, Azure Image Builder deploys an additional VM (a *proxy* VM), and a load balancer (Azure Load Balancer). These are connected to Private Link. Traffic from the Image Builder service goes across the private link to the load balancer. The load balancer communicates to the proxy VM by using port 60001 for Linux, or port 60000 for Windows. The proxy forwards commands to the build VM by using port 22 for Linux, or port 5986 for Windows.

> [!NOTE]
> The virtual network must be in the same region as the Azure Image Builder service region.
> 

### Why deploy a proxy VM?

When a VM without a public IP is behind an internal load balancer, it doesn't have internet access. The load balancer used for the virtual network is internal. The proxy VM allows internet access for the build VM during builds. You can use the associated network security groups to restrict the build VM access.

The deployed proxy VM size is *Standard A1_v2*, in addition to the build VM. The Image Builder service uses the proxy VM to send commands between the service and the build VM. You can't change the proxy VM properties (this restriction includes the size and the operating system).

### Image template parameters to support the virtual network

```json
"VirtualNetworkConfig": {
        "name": "",
        "subnetName": "",
        "resourceGroupName": ""
        },
```

| Setting | Description |
|---------|---------|
| `name` | (Optional) The name of a pre-existing virtual network. |
| `subnetName` | The name of the subnet within the specified virtual network. You must specify this setting if, and only if, the `name` setting is specified. |
| `resourceGroupName` | The name of the resource group containing the specified virtual network. You must specify this setting if, and only if, the `name` setting is specified. |

Private Link requires an IP from the specified virtual network and subnet. Currently, Azure doesn’t support network policies on these IPs. Hence, you must disable network policies on the subnet. For more information, see the [Private Link documentation](../../private-link/index.yml).

### Checklist for using your virtual network

1. Allow Azure Load Balancer to communicate with the proxy VM in a network security group.
    * [AZ CLI example](image-builder-vnet.md#add-nsg-rule)
    * [PowerShell example](../windows/image-builder-vnet.md#add-nsg-rule)
2. Disable the private service policy on the subnet.
    * [AZ CLI example](image-builder-vnet.md#disable-private-service-policy-on-the-subnet)
    * [PowerShell example](../windows/image-builder-vnet.md#disable-private-service-policy-on-the-subnet)
3. Allow Azure Image Builder to create a load balancer, and add VMs to the virtual network.
    * [AZ CLI Example](image-builder-permissions-cli.md#existing-virtual-network-azure-role-example)
    * [PowerShell example](image-builder-permissions-powershell.md#permission-to-customize-images-on-your-virtual-networks)
4. Allow Azure Image Builder to read and write source images, and create images.
    * [AZ CLI example](image-builder-permissions-cli.md#custom-image-azure-role-example)
    * [PowerShell example](image-builder-permissions-powershell.md#custom-image-azure-role-example)
5. Ensure that you're using a virtual network in the same region as the Azure Image Builder service region.

## Next steps

[Azure Image Builder overview](../image-builder-overview.md)