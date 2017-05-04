---
title: Create FQDN for a Windows VM in the Azure portal | Microsoft Docs
description: Learn how to create a Fully Qualified Domain Name, or FQDN, for a Resource Manager based virtual machine in the Azure portal.
services: virtual-machines-windows
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: a2ae5887-76df-485e-ae19-0efd96df8600
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 03/14/2017
ms.author: iainfou
ms.custom: H1Hack27Feb2017

---
# Create a Fully Qualified Domain Name in the Azure portal for a Windows VM

When you create a virtual machine (VM) in the [Azure portal](https://portal.azure.com) using the Resource Manager deployment model, a public IP resource for the virtual machine is automatically created. You use this IP address to remotely access the VM. Although the portal does not create a [fully qualified domain name](https://en.wikipedia.org/wiki/Fully_qualified_domain_name), or FQDN, by default, you can create one once the VM is created. This article demonstrates the steps to create a DNS name or FQDN.

[!INCLUDE [virtual-machines-common-portal-create-fqdn](../../../includes/virtual-machines-common-portal-create-fqdn.md)]

You can now connect remotely to the VM using this DNS name such as for Remote Desktop Protocol (RDP).

## Next steps
Now that your VM has a public IP and DNS name, you can deploy common application frameworks or services such as IIS, SQL, or SharePoint.

You can also read more about [using Resource Manager](../../azure-resource-manager/resource-group-overview.md) for tips on building your Azure deployments.

