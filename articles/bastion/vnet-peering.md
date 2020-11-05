---
title: 'Connect to a Windows VM using Azure Bastion'
description: In this article, learn how to connect to an Azure Virtual Machine running Windows by using Azure Bastion.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: conceptual
ms.date: 10/21/2020
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to connect to an Azure virtual machine running Windows that doesn't have a public IP address by using Azure Bastion.

---

# Connect to a Windows virtual machine using Azure Bastion

VNET peering is now supported with Azure Bastion. With VNET peering support single Azure Bastion can now be leveraged to connect to VM’s deployed in a peered Virtual Network ( VNet ) , removing the requirement of deploying Azure Bastion with in each VNET. 
Azure Bastion supports the following types of peering:

• Virtual network peering: Connect virtual networks within the same Azure region.
• Global virtual network peering: Connecting virtual networks across Azure regions.

## Architecture

With VNET peering support Azure bastion can be deployed in Hub and Spoke topology or full messed topologies.  Azure Bastion deployment is per virtual network, not per subscription/account or virtual machine. Once you provision an Azure Bastion service in your virtual network, the RDP/SSH experience is available to all your VMs in the same and peered virtual network. With VNET peering support now you can consolidate bastion deployment to single VNET with reachability to VM deployed in a peered VNET, centralizing the overall deployment. 

:::image type="content" source="./media/vnet-peering/design.png" alt-text="Design and Architecture diagram":::

This figure shows the architecture of an Azure Bastion deployment in hub and spoke model.  In this diagram:

• The Bastion host is deployed in the centralized Hub virtual network.
• Centralized Network Security Group (NSG) deployment.
• The user connects to the Azure portal using any HTML5 browser.
• The user selects the virtual machine to connect to.
• Azure bastion is seamlessly detected across peered VNET.
• With a single click, the RDP/SSH session opens in the browser.
• No public IP is required on the Azure VM.

## FAQ

### Can I still deploy multiple bastions across peered virtual networks?

Yes you can.  User will see multiple bastions detected across peered network in the connect menu. User can select the bastion they prefer to connect to the Virtual machine deployed in a virtual network.  User will see Bastion deployed in virtual network same as where virtual machine resides as default option.

### Will connectivity via bastion work when my peered VNET’s are deployed in two different subscription.

Yes, connectivity via bastion will continue to work for peered VNET across different subscription for a Tenant. Subscription across two different Tenant is not supported. User must make sure that under subscription > global subscription they have selected the subs they have access too for user to see bastion in connect drop down menu.

:::image type="content" source="./media/vnet-peering/global-subscriptions.png" alt-text="Design and Architecture diagram":::

### I have access to peered VNET but I am not able to see VM deployed in a VNET?

Make sure user has Read access to VM and peered VNET. Check under IAM that user has read access to following resources.

• Reader role on the virtual machine
• Reader role on the NIC with private IP of the virtual machine
• Reader role on the Azure Bastion resource
• Reader Role on the Virtual Network ( This is not needed if there is no peered virtual network )


## Next steps

Read the [Bastion FAQ](bastion-faq.md).