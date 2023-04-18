---
title: How to Create a Lab with a Shared Resource | Azure Lab Services
description: Learn how to create a lab that requires a resource shared among the students.  
ms.topic: how-to
ms.date: 07/04/2022
ms.custom: devdivchpfy22
ms.service: lab-services
---

# How to create a lab with a shared resource in Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

> [!NOTE]
> If using a version of Azure Lab Services prior to the [August 2022 Update](lab-services-whats-new.md), see [How to create a lab with a shared resource in Azure Lab Services when using lab accounts](how-to-create-a-lab-with-shared-resource-1.md).

When you're creating a lab, there might be some resources that need to be shared among all the students in a lab. For example, you have a licensing server or SQL Server for a database class. This article will discuss the steps to enable the shared resource for a lab. We'll also talk about how to limit access to the shared resource.

## Architecture

As shown in the diagram below we'll have a lab plan with a lab. The lab plan will have advanced networking enabled.  In our example, the virtual network for the lab is the same network of the shared resource.  Optionally, routing maybe used to connect lab VMs to shared resources in other subnets.  The lab VMs can connect using the private IP of the shared server. Also, the virtual network is in the same region as the lab plan and lab.

:::image type="content" source="./media/how-to-create-a-lab-with-shared-resource/shared-resource-architecture.png" alt-text="Diagram showing Lab Services with shared resource architecture.":::

## Set up shared resource

The virtual network for the shared resource must be created before the lab plan or lab is created. For more information on how to create a virtual network and subnets, see [create a virtual network](../virtual-network/quick-create-portal.md) and [create a subnet](../virtual-network/virtual-network-manage-subnet.md#add-a-subnet). Planning out virtual network ranges is an important step when designing your network. For more information about planning your network, see the [plan virtual networks](../virtual-network/virtual-network-vnet-plan-design-arm.md) article.

The shared resource can be software running on a virtual machine or an Azure provided service. The shared resource should be available through private IP address. By making the shared resource available through private IP only, you limit access to that shared resource.

The diagram also shows a network security group (NSG) which can be used to restrict traffic coming from the student VM. For example, you can write a security rule that states traffic from the student VM's IP addresses can only access one shared resource and nothing else. For more information on how to set security rules, see [manage network security group](../virtual-network/manage-network-security-group.md#work-with-security-rules).

If your shared resource is an Azure virtual machine running necessary software, you might have to modify the default firewall rules for the virtual machine.

## Lab plan

To use a shared resource, the lab plan must be set up to use advanced networking. For more information, see [Connect to your virtual network in Azure Lab Services](how-to-connect-vnet-injection.md). In this case, Lab Services will inject lab VM networking resources into the virtual network that holds the shared resource.  

> [!WARNING]
> Advanced networking must be enabled during lab plan creation. It can't be added later.

When your lab plan is set to use advanced networking, the template VM and student VMs should now have access to the shared resource.  You might have to update the virtual network's [network security group](../virtual-network/network-security-groups-overview.md), virtual network's [user-defined routes](../virtual-network/virtual-networks-udr-overview.md#user-defined) or server's firewall rules.

## Tips

One of the most common shared resources is a license server.  The following list has a few tips to successfully configure a server.

- Advanced networking must be enabled when the lab plan is created.
- The license server needs to be located in the same region as the lab plan and virtual network.
- By default virtual machines have a dynamic private ip. [Before you setup any software, set the private ip to static](../virtual-network/ip-services/virtual-networks-static-private-ip-arm-pportal.md).
- Controlling access to the license server is key. When the VM is set up, access will still be needed for maintenance, troubleshooting, and updating. Following are a few ways for controlling access:

    - [Setting up Just in Time (JIT) access within Microsoft Defender for Cloud.](../security-center/security-center-just-in-time.md?tabs=jit-config-asc%252cjit-request-asc)
    - [Setting up a Network Security Group to restrict access.](../virtual-network/network-security-groups-overview.md)
    - [Setup Bastion to allow secure access to the server.](https://azure.microsoft.com/services/azure-bastion/)

## Next steps

As an administrator, [create a lab plan with advanced networking](how-to-connect-vnet-injection.md).