---
title: Create FQDN for a VM in the Azure portal 
description: Learn how to create a Fully Qualified Domain Name (FQDN) for a virtual machine in the Azure portal.
author: cynthn
ms.service: virtual-machines
ms.subservice: networking
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 1/12/2020
ms.author: cynthn
ms.custom: H1Hack27Feb2017

---
# Create a fully qualified domain name in the Azure portal for a Linux VM

When you create a virtual machine (VM) in the [Azure portal](https://portal.azure.com), a public IP resource for the virtual machine is automatically created. You use this IP address to remotely access the VM. Although the portal does not create a [fully qualified domain name](https://en.wikipedia.org/wiki/Fully_qualified_domain_name), or FQDN, you can add one once the VM is created. This article demonstrates the steps to create a DNS name or FQDN. 

## Create a FQDN
This article assumes that you have already created a VM. If needed, you can create a [Linux](./linux/quick-create-portal.md) or [Windows](./windows/quick-create-portal.md) VM in the portal. Follow these steps once your VM is up and running:


1. Select your VM in the portal. 
1. In the left menu, select **Configuration**
1. Under **DNS name label**, enter the prefix you want to use.
1. Select **Save** at the top of the page.
1. Return to the VM overview blade by selecting **Overview** in the left menu. 
1. Verify that the *DNS name* appears correctly. 

## Next steps

You can also manage DNS using [Azure DNS zones](../dns/dns-getstarted-portal.md).

