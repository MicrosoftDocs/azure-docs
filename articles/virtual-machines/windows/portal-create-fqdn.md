---
title: Create FQDN for a Windows VM in the Azure portal 
description: Learn how to create a Fully Qualified Domain Name, or FQDN, for a Resource Manager based virtual machine in the Azure portal.
author: cynthn
ms.service: virtual-machines-windows
ms.subservice: networking
ms.topic: article
ms.workload: infrastructure-services
ms.date: 08/15/2018
ms.author: cynthn
ms.custom: H1Hack27Feb2017

---
# Create a fully qualified domain name in the Azure portal for a Windows VM

When you create a virtual machine (VM) in the [Azure portal](https://portal.azure.com), a public IP resource for the virtual machine is automatically created. You use this IP address to remotely access the VM. Although the portal does not create a [fully qualified domain name](https://en.wikipedia.org/wiki/Fully_qualified_domain_name), or FQDN, you can create one once the VM is created. This article demonstrates the steps to create a DNS name or FQDN.

## Create a FQDN
This article assumes that you have already created a VM. If needed, you can [create a VM in the portal](quick-create-portal.md) or [with Azure PowerShell](quick-create-powershell.md). Follow these steps once your VM is up and running:

[!INCLUDE [virtual-machines-common-portal-create-fqdn](../../../includes/virtual-machines-common-portal-create-fqdn.md)]

You can now connect remotely to the VM using this DNS name such as for Remote Desktop Protocol (RDP).

## Next steps
Now that your VM has a public IP and DNS name, you can deploy common application frameworks or services such as IIS, SQL, or SharePoint.

You can also read more about [using Resource Manager](../../azure-resource-manager/management/overview.md) for tips on building your Azure deployments.

