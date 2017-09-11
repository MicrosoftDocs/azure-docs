---
title: How to configure MSI on an Azure VM using the Azure portal
description: Step by step instructions for configuring a Managed Service Identity (MSI) on an Azure VM, using the Azure portal.
services: active-directory
documentationcenter: ''
author: bryanla
manager: mbaldwin
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/14/2017
ms.author: bryanla
---

# Configure an Azure VM Managed Service Identity (MSI) using the Azure portal

## Prerequisites

[!INCLUDE [active-directory-msi-qs-configure-prereqs](../../includes/active-directory-msi-qs-configure-prereqs.md)]

## Enable MSI during creation of an Azure VM

As of the time of this writing, enabling MSI during creation of a VM in the Azure portal is not supported. Instead, please refer to the [Create a Windows virtual machine with the Azure portal](../virtual-machines/windows/quick-create-portal.md#create-virtual-machine) QuickStart for details on creating a VM. Then proceed to the next section for details on enabling MSI.

## Enable MSI on an existing Azure VM

If you have a VM that was originally provisioned without an MSI:

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription under which you would like to deploy the VM.

2. Navigate to the desired Virtual Machine.

2. Click the "Configuration" page, enable MSI on the VM by selecting "Yes" under "Managed service identity", then click **Save**. This operation can take 60 seconds or more to complete:

   ![Configuration page screenshot](./media/active-directory-msi-qs-configure-portal-windows-vm/create-windows-vm-portal-configuration-blade.png)  

## Remove MSI from an Azure VM

If you have a Virtual Machine that no longer needs an MSI:

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription under which you would like to deploy the VM.

2. Navigate to the desired Virtual Machine.

3. Click the "Configuration" page, remove MSI from the VM by selecting "No" under "Managed service identity", then click **Save**. This operation can take 60 seconds or more to complete:

   ![Configuration page screenshot](./media/active-directory-msi-qs-configure-portal-windows-vm/create-windows-vm-portal-configuration-blade-disable.png)  

## Related content

- For an overview of MSI, see [Managed Service Identity overview](active-directory-msi-overview.md).
- This article is adapted from the [Create a Windows virtual machine with the Azure portal](../virtual-machines/windows/quick-create-portal.md) QuickStart, modified to include MSI-specific instructions. 

Use the following comments section to provide feedback and help us refine and shape our content.
