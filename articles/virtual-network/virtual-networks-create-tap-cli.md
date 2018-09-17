---
title: Create, change, or delete a virtual network TAP - Azure CLI | Microsoft Docs
description: Learn how to create, change, or delete a virtual network TAP using the Azure CLI.
services: virtual-network
documentationcenter: na
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/12/2018
ms.author: jdial
---

# Work with a virtual network TAP using Azure CLI

Azure virtual network TAP (Terminal Access Point) allows you to continuously stream your virtual machine network traffic to a network packet collector or analytics tool. The collector or analytics tool is provided by a [network virtual appliance](https://azure.microsoft.com/solutions/network-appliances/) partner. For a list of partner solutions that are validated to work with virtual network TAP, see [Partner solutions](#virtual-network-tap-partner-solutions).

The following picture shows how a virtual network TAP works. You are able to add a tap configuration on a [network interface](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-network-interface) that is attached to a virtual machine deployed in your virtual network. The destination is a virtual network IP address in the same virtual network as the tapped network interface or a [peered virtual](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview) network. The collector solution for virtual network TAP can be deployed behind an [Azure Internal Load balancer](../load-balancer/load-balancer-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#concepts) for high availability. To evaluate deployment options for individual solutions, see [partner solutions](#virtual-network-tap-partner-solutions).

![](./media/virtual-network-tap/architecture.png)

> [!IMPORTANT]
> Virtual network TAP is currently in developer preview in the WestCentralUS Azure region. To use virtual network TAP, you must enroll in the
preview by sending an email to [azurevirtualnetworktap@microsoft.com](azurevirtualnetworktap@microsoft.com) with your subscription ID. You will receive an email back once your subscription has been enrolled. You aren't able to use the capability until you receive a confirmation email. This developer preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

## Before you begin

Before you create a virtual network TAP, you must have received a confirmation mail that you are enrolled in the preview, and have one or more virtual machines created using [Azure Resource Manager](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview) deployment model  and a partner solution for aggregating the tapped traffic in WestCentralUS region. If you don't have a  partner solution in your virtual network, see [partner solutions](#virtual-network-tap-partner-solutions) to deploy one. You can use the same virtual network TAP resource to aggregate traffic from multiple network interfaces in the same or different subscriptions. If the tapped network interfaces are in different subscriptions, the subscriptions must be associated to the same Azure Active Directory tenant. Additionally, the tapped network interfaces and the destination endpoint for aggregating the tapped traffic can be in peered virtual networks in the same region. If you are using this deployment model ensure that the [virtual network peering](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview) is enabled before you configure virtual network TAP.

## Permissions

The accounts you use to apply TAP configuration on network interfaces must be assigned to the [Network Contributor](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#network-contributor) role or a [custom role](https://docs.microsoft.com/en-us/azure/role-based-access-control/custom-roles) that is assigned the necessary actions from the following table:

| Action | Name |
|---|---|
| Microsoft.Network/virtualNetworkTaps/* | Required to create, update, read and delete a virtual network TAP resource |
| Microsoft.Network/networkInterfaces/read | Required to read the network interface resource on which the TAP will be configured |
| Microsoft.Network/tapConfigurations/* | Required to create, update, read and delete the tap configuration on a network interface |

## Create a virtual network TAP Resource

You can run the commands that follow in the [Azure Cloud Shell](https://shell.azure.com/bash), or by running the Azure command-line interface (CLI) from your computer. The Azure Cloud Shell is a free interactive shell, that doesn't require installing the Azure CLI on your computer. You must sign in to Azure with an account that has the appropriate [permissions](#permissions). This article requires the Azure CLI version 2.0.46 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). If you are running the Azure CLI locally, you also need to run `az login` to create a connection with Azure.

1. Retrieve the ID of your subscription into a variable that is used in a later step:

   ```azurecli-interactive
   subscriptionId=$(az account show \
   --query id \
   --out tsv)
   ```

2. Set subscription id that you will use to create a virtual network TAP resource.

   ```azurecli-interactive
   az account set --subscription $subscriptionId
   ```

3. Re-register the subscription ID that you'll use to create a virtual network TAP resource. If you get a registration error when you create a TAP resource, run the following command:

   ```azurecli-interactive
   az provider register --namespace Microsoft.Network --subscription $subscriptionId
   ```

4. If the destination for the virtual network TAP is the network interface on the network virtual appliance for collector or analytics tool -  

   4a. Retrieve the IP configuration of the network virtual appliance's network interface into a variable that is used in a later step. The ID is the end point that will aggregate the tapped traffic. The following example retrieves the ID of the *ipconfig1* IP configuration for a network interface named *myNetworkInterface*, in a resource group named *myResourceGroup*:

      ```azurecli-interactive
       IpConfigId=$(az network nic ip-config show \
       --name ipconfig1 \
       --nic-name myNetworkInterface \
       --resource-group myResourceGroup \
       --query id \
       --out tsv)
      ```

   4b. Create the virtual network TAP in westcentralus azure region using the ID of the IP configuration as the destination and an optional port property. The port specifies the destination port on network interface IP configuration where the tapped traffic will be received :  

      ```azurecli-interactive
       az network vnet tap create \
       --resource-group myResourceGroup \
       --name myTap \
       --destination $IpConfigId \
       --port 4789 \
       --location westcentralus
      ```

5. If the destination for the virtual network TAP is an azure internal load balancer -

   5a. Retrieve the front end IP configuration of the Azure internal load balancer into a variable that is used in a later step. The ID is the end point that will aggregate the tapped traffic. The following example retrieves the ID of the *frontendipconfig1* front end IP configuration for a load balancer named *myInternalLoadBalancer*, in a resource group named *myResourceGroup*:

      ```azurecli-interactive
      FrondendIpConfigId=$(az network lb fronend-ip show \
      --name frontendipconfig1 \
      --lb-name myInternalLoadBalancer \
      --resource-group myResourceGroup \
      --query id \
      --out tsv)
      ```
   5b. Create the virtual network TAP using the ID of the frontend IP configuration as the destination and an optional port property. The port specifies the destination port on front end IP configuration where the tapped traffic will be received :  

      ```azurecli-interactive
      az network vnet tap create \
      --resource-group myResourceGroup \
      --name myTap \
      --destination $FrontendIpConfigId \
      --port 4789 \
     --location westcentralus
     ```

6. Confirm creation of the virtual network TAP:

   ```azurecli-interactive
   az network vnet tap show \
   --resource-group myResourceGroup
   --name myTap
   ```

## Add a TAP configuration to a Network Interface

1. Retrieve the ID of an existing virtual network TAP resource. The following example retrieves a virtual network TAP named *myTap* in a resource group named *myResourceGroup*:

   ```azurecli-interactive
   tapId=$(az network tap show show \
   --name myTap \
   --resource-group myResourceGroup \
   --query id \
   --out tsv)
   ```

2. Create a TAP configuration on the network interface of the monitored virtual machine. The following example creates a TAP configuration for a network interface named *myNetworkInterface*:

   ```azurecli-interactive
   az network nic vtap-config create \
   --resource-group myResourceGroup \
   --nic myNetworkInterface \
   --vnet-tap $tapId \
   --name mytapconfig \
   --subscription subscriptionId
   ```

3. Confirm creation of the TAP configuration:

   ```azurecli-interactive
   az network nic vtap-config show \
   --resource-group myResourceGroup \
   --nic-name myNetworkInterface \
   --name mytapconfig \
   --subscription subscriptionId
   ```

## Delete the TAP configuration on a Network Interface

   ```azure-cli-interactive
   az network nic vtap-config delete \
   --resource-group myResourceGroup \
   --nic myNetworkInterface \
   --tap-configuration-name myTapConfig \
   --subscription subscriptionId
   ```

## List virtual network TAPs in a subscription

   ```azurecli-interactive
   az network vnet tap list
   ```

## Delete a virtual network TAP in a resource group

   ```azurecli-interactive
   az network vnet tap delete \
   --resource-group myResourceGroup \
   --name myTap
   ```

## Frequently asked questions

1. Which Azure regions are available for virtual network TAP?

   During developer preview, the capability is available in the West Central US region. The tapped network interfaces , the virtual network TAP resource, and the collector or analytics solution  must be deployed in the same region.

2. Does Virtual Network TAP support any filtering capabilities on the mirrored packets ?

   Filtering capabilities are not supported with the virtual network TAP preview. When a tap configuration is added to a network interface  a deep copy of all the ingress and egress traffic on the network interface will be streamed to the TAP destination.

3. Can multiple tap configurations be added to a monitored network interface ?

   A monitored network interface can have only one tap configuration. Please check with the individual [partner solutions](#virtual-network-tap-partner-solutions) for the capability to stream multiple copies of the tapped traffic to the analytics tools of your choice.

4. Can the same virtual network TAP resource aggregate traffic from monitored network interfaces in more than one virtual networks ?

   Yes. The same virtual network TAP resource can be used to aggregate mirrored traffic from monitored network interfaces in peered virtual networks in the same subscription or a different subscription. The virtual network TAP resource and the destination load balancer or destination network interface should be in the same subscription. All subscriptions should be under the same Azure Active Directory tenant.

5. Are there any performance considerations on production traffic if I enable a virtual network TAP configuration on a network interface?

   Virtual network TAP is in developer preview. During preview, there is no service level agreement. The capability should not be used for production workloads. When a virtual machine network interface is enabled with a TAP configuration, the same resources on the azure host allocated to the virtual machine to send the production traffic is used to perform the mirroring function and send the mirrored packets. Select the correct [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine size to ensure that sufficient resources are available for the virtual machine to send the production traffic and the mirrored traffic.

6. Is accelerated networking for [Linux](create-vm-accelerated-networking-cli.md) or [Windows](create-vm-accelerated-networking-powershell.md) supported with virtual network TAP?

   You should be able to add a TAP configuration on a network interface attached to a virtual machine that is enabled with accelerated networking. The accelerated networking feature of offloading the mirroring function to the Azure Smart NIC is not supported in the developer preview.

## Virtual Network TAP Partner Solutions

### Network Packet Brokers

- [Big Switch Big Monitoring Fabric](https://www.bigswitch.com/products/big-monitoring-fabric/public-cloud/microsoft-azure)
- [Flowmon](https://www.flowmon.com/blog/azure-vtap)
- [Gigamon GigaSECURE](https://blog.gigamon.com/2018/09/13/why-microsofts-new-vtap-service-works-even-better-with-gigasecure-for-azure)
- [Ixia CloudLens](https://www.ixiacom.com/cloudlens/cloudlens-azure)

### Security analytics, Network/Application performance management 

- [ExtraHop Reveal(x)](https://www.extrahop.com/company/tech-partners/microsoft/)
- [Fidelis Cybersecurity](https://www.fidelissecurity.com/technology-partners/microsoft-azure )
- [Netscout vSTREAM]( https://www.netscout.com/technology-partners/microsoft/azure-vtap)
- [Nubeva Prisms](https://www.nubeva.com/azurevtap)
- [RSA NetWitness® Platform](www.rsa.com/azure)
- [Vectra Cognito](https://vectra.ai/microsoftazure)