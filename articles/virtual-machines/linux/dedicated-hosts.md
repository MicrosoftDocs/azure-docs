---
title: Overview of Azure Dedicated Hosts for virtual machines 
description: Learn more about how Azure Dedicated Hosts can be used for deploying virtual machines.
author: cynthn
ms.service: virtual-machines
ms.topic: article
ms.date: 01/09/2020
ms.author: cynthn

#Customer intent: As an IT administrator, I want to learn about more about using a dedicated host for my Azure virtual machines
---

# Azure Dedicated Hosts

Azure Dedicated Host is a service that provides physical servers - able to host one or more virtual machines - dedicated to one Azure subscription. Dedicated hosts are the same physical servers used in our data centers, provided as a resource. You can provision dedicated hosts within a region, availability zone, and fault domain. Then, you can place VMs directly into your provisioned hosts, in whatever configuration best meets your needs.



[!INCLUDE [virtual-machines-common-dedicated-hosts](../../../includes/virtual-machines-common-dedicated-hosts.md)]


## Next steps

- You can deploy a dedicated host using the [Azure CLI](dedicated-hosts-cli.md), [portal](dedicated-hosts-portal.md), and [PowerShell](../windows/dedicated-hosts-powershell.md).

- For more information, see the [Dedicated hosts](dedicated-hosts.md) overview.

- There is sample template, found [here](https://github.com/Azure/azure-quickstart-templates/blob/master/201-vm-dedicated-hosts/README.md), that uses both zones and fault domains for maximum resiliency in a region.

- You can also save on costs with a [Reserved Instance of Azure Dedicated Hosts](../prepay-dedicated-hosts-reserved-instances.md).
