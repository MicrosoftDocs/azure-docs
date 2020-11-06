---
 title: include file
 description: include file
 services: bastion
 author: cherylmc
 ms.service: bastion
 ms.topic: include
 ms.date: 11/05/2020
 ms.author: cherylmc
 ms.custom: include file
---

### Can I still deploy multiple Bastion hosts across peered virtual networks?

Yes. By default, a user sees the Bastion host that is deployed in the same virtual network in which VM resides. However, in the **Connect** menu, a user can see multiple Bastion hosts detected across peered networks. They can select the Bastion host that they prefer to use to connect to the VM deployed in the virtual network.

### If my peered VNets are deployed in different subscriptions, will connectivity via Bastion work?

Yes, connectivity via Bastion will continue to work for peered VNets across different subscription for a single Tenant. Subscriptions across two different Tenants are not supported. To see Bastion in the **Connect** drop down menu, the user must select the subs they have access to in **Subscription > global subscription**.

:::image type="content" source="./media/bastion-faq-peering-include/global-subscriptions.png" alt-text="Global subscriptions filter" lightbox="./media/bastion-faq-peering-include/global-subscriptions.png":::

### I have access to the peered VNet, but I can't see the VM deployed there.

Make sure the user has **read** access to both the VM, and the peered VNet. Additionally, check under IAM that the user has **read** access to following resources:

* Reader role on the virtual machine.
* Reader role on the NIC with private IP of the virtual machine.
* Reader role on the Azure Bastion resource.
* Reader Role on the Virtual Network (Not needed if there is no peered virtual network).

|Permissions|Description|Permission type|
|---|---| ---|
|Microsoft.Network/bastionHosts/read |Gets a Bastion Host|Action|
|Microsoft.Network/virtualNetworks/BastionHosts/action |Gets Bastion Host references in a Virtual Network.|Action|
|Microsoft.Network/virtualNetworks/bastionHosts/default/action|Gets Bastion Host references in a Virtual Network.|Action|
|Microsoft.Network/networkInterfaces/read|Gets a network interface definition.|Action|
|Microsoft.Network/networkInterfaces/ipconfigurations/read|Gets a network interface IP configuration definition.|Action|
|Microsoft.Network/virtualNetworks/read|Get the virtual network definition|Action|
|Microsoft.Network/virtualNetworks/subnets/virtualMachines/read|Gets references to all the virtual machines in a virtual network subnet|Action|
|Microsoft.Network/virtualNetworks/virtualMachines/read|Gets references to all the virtual machines in a virtual network|Action|