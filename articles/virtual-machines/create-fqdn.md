---
title: Create FQDN for a VM in the Azure portal 
description: Learn how to create a Fully Qualified Domain Name (FQDN) for a virtual machine in the Azure portal.
author: cynthn
ms.service: virtual-machines
ms.subservice: networking
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 11/03/2020
ms.author: cynthn
ms.custom: H1Hack27Feb2017

---
# Create a fully qualified domain name in the Azure portal for a Linux VM

When you create a virtual machine (VM) in the [Azure portal](https://portal.azure.com), a public IP resource for the virtual machine is automatically created. You use this IP address to remotely access the VM. Although the portal does not create a [fully qualified domain name](https://en.wikipedia.org/wiki/Fully_qualified_domain_name), or FQDN, you can add one once the VM is created. This article demonstrates the steps to create a DNS name or FQDN. 

## Create a FQDN
This article assumes that you have already created a VM. If needed, you can create a [Linux](./linux/quick-create-portal.md) or [Windows](./windows/quick-create-portal.md) VM in the portal. Follow these steps once your VM is up and running:


1. Select your VM in the portal. Under **DNS name**, select **Configure**.
2. Enter the DNS name and then select **Save** at the top of the page.
3. To return to the VM overview blade, close the **Configuration** blade by selecting the **X** in the upper right corner. 
4. Verify that the *DNS name* is now shown correctly.
   



## Next steps
Now that your VM has a public IP and DNS name, you can deploy common application frameworks or services such as nginx, MongoDB, and Docker.

You can also read more about [using Resource Manager](../../azure-resource-manager/management/overview.md) for tips on building your Azure deployments.

