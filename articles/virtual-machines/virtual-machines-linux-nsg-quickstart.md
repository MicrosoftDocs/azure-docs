<properties
   pageTitle="Open ports or endpoints to a Linux VM | Microsoft Azure"
   description="Learn how to open a port / create an endpoint that allows external access to your Linux VM using the resource manager deployment model and the Azure CLI"
   services="virtual-machines-linux"
   documentationCenter=""
   authors="iainfoulds"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="05/24/2016"
   ms.author="iainfou"/>

# Opening ports and endpoints
You open a port, or create an endpoint, in Azure by creating a network filter that allows traffic to your chosen port on a subnet or virtual machine (VM) network interface. These filters, which control both inbound and outbound traffic, are placed in a Network Security Group and attached to the resource that will receive the traffic. Let's use a common example of web traffic on port 80.

## Quick commands
To create a Network Security Group and rules you will need [the Azure CLI](../xplat-cli-install.md) in resource manager mode (`azure config mode arm`).

Create your Network Security Group, entering your own names and location appropriately:

```
azure network nsg create --resource-group TestRG --name TestNSG --location westus
```

Add a rule to allow HTTP traffic to your webserver (this can be adjusted for your own scenario, such as SSH access or database connectivity):

```
azure network nsg rule create --protocol tcp --direction inbound --priority 1000 \
    --destination-port-range 80 --access allow --resource-group TestRG --nsg-name TestNSG --name AllowHTTP
```

Associate the Network Security Group with your VM's network interface:

```
azure network nic set --resource-group TestRG --name TestNIC --network-security-group-name TestNSG
```

Alternatively, you can associate your Network Security Group with a virtual network subnet rather than just to the network interface on a single VM:

```
azure network vnet subnet set --resource-group TestRG --name TestSubnet --network-security-group-name TestNSG
```

## More information on Network Security Groups
The quick commands here allow you to get up and running with traffic flowing to your VM. Network Security Groups provide a lot of great features and granularity for controlling access to the your resources. You can read more about [creating a Network Security Group and ACL rules here](../virtual-network/virtual-networks-create-nsg-arm-cli.md).

Network Security Groups and ACL rules can also be defined as part of Azure Resource Manager templates. Read more about [creating Network Security Groups with templates](../virtual-network/virtual-networks-create-nsg-arm-template.md).

If you need to use port-forwarding to map a unique external port to an internal port on your VM, you need to use a load balancer and Network Address Translation (NAT) rules. For example, you may want to expose TCP port 8080 externally and have traffic directed to TCP port 80 on a VM. You can learn about [creating an Internet-facing load balancer](../load-balancer/load-balancer-get-started-internet-arm-cli.md).

## Next steps
In this example, you created a simple rule to allow HTTP traffic. You can find information on creating more detailed environments in the following articles:

- [Azure Resource Manager overview](../resource-group-overview.md)
- [What is a Network Security Group (NSG)?](../virtual-network/virtual-networks-nsg.md)
- [Azure Resource Manager Overview for Load Balancers](../load-balancer2    /load-balancer-arm.md)