---
title: Azure Stack Windows Server related FAQs | Microsoft Docs
description: List of Azure Stack Marketplace FAQs for Windows Server
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/12/2018
ms.author: sethm
ms.reviewer: avishwan

---

# Windows Server in Azure Stack Marketplace FAQ

This article answers some frequently asked questions about Windows Server images in the [Azure Stack Marketplace](azure-stack-marketplace.md).

## Marketplace items

### How do I update to a newer Windows image?

First, determine if any Azure Resource Manager templates refer to specific versions. If so, update those templates, or keep older image versions. It is best to use **version: latest**.

Next, if any Virtual Machine Scale Sets refer to a specific version, you should think about whether these will be scaled later, and decide whether to keep older versions. If neither of these conditions apply, delete older images in the Marketplace before downloading newer ones. Use Marketplace Management to do this if that is how the original was downloaded. Then download the newer version.

### What are the licensing options for Windows Server Marketplace images on Azure Stack?

Microsoft offers two versions of Windows Server images through the Azure Stack Marketplace:

- **Pay as you use**: These images run the full price Windows meters. 
   Who should use: Enterprise Agreement (EA) customers who use the *Consumption billing model*; CSPs who do not want to use SPLA licensing.
- **Bring Your Own License (BYOL)**: These images run basic meters.
   Who should use: EA customers with a Windows Server license; CSPs who use SPLA licensing.

Azure Hybrid Use Benefit (AHUB) is not supported on Azure Stack. Customers who license through the "Capacity" model must use the BYOL image. If you are testing with the Azure Stack Development Kit (ASDK), you can use either of these options.

### What if I downloaded the wrong version to offer my tenants/users?

Delete the incorrect version first through Marketplace Management. Wait for it to complete fully (look at the notifications for completion, not the Marketplace Management blade). Then download the correct version.

### What if my user incorrectly checked the "I have a license" box in previous Windows builds, and they don't have a license?

See [Convert Windows Server VMs with benefit back to pay-as-you-go](../virtual-machines/windows/hybrid-use-benefit-licensing.md#powershell-1).

### What if I have an older image and my user forgot to check the "I have a license" box, or we use our own images and we do have Enterprise Agreement entitlement?

See [Convert an existing VM using Azure Hybrid Benefit for Windows Server](../virtual-machines/windows/hybrid-use-benefit-licensing.md#convert-an-existing-vm-using-azure-hybrid-benefit-for-windows-server). Note that the Azure Hybrid Benefit does not apply to Azure Stack, but the effect of this setting does apply.

### What about other VMs that use Windows Server, such as SQL or Machine Learning Server?

These images do apply the **licenseType** parameter, so they are pay as you use. You can set this parameter (see the previous FAQ answer). This only applies to the Windows Server software, not to layered products such as SQL, which require you to bring your own license. Pay as you use licensing does not apply to layered software products.

### I have an Enterprise Agreement (EA) and will be using my EA Windows Server license; how do I make sure images are billed correctly?

You can add **licenseType: Windows_Server** in an Azure Resource Manager template. This setting must be added to each virtual machine resource block.

## Activation

To activate a Windows Server virtual machine on Azure Stack, the following conditions must be true:

- The OEM has set the appropriate BIOS marker on every host system in Azure Stack.
- Windows Server 2012 R2 and Windows Server 2016 must use [Automatic Virtual Machine Activation](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn303421(v=ws.11)). Key Management Service (KMS) and other activation services are not supported on Azure Stack.

### How can I verify that my virtual machine is activated?

Run the following command from an elevated command prompt: 

```shell
slmgr /dlv
``` 

If it is correctly activated, you will see this clearly indicated and the host name displayed in the `slmgr` output. Do not depend on watermarks on the display as they might not be up-to-date, or are showing from a different virtual machine behind yours.

### My VM is not set up to use AVMA, how can I fix it?

Run the following command from an elevated command prompt: 

```shell
slmgr /ipk <AVMA key> 
```

See the article [Automatic Virtual Machine Activation](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn303421(v=ws.11)) for the keys to use for your image.

### I create my own Windows Server images, how can I make sure they use AVMA?

It is recommended that you execute the `slmgr /ipk` command line with the appropriate key before you run the `sysprep` command. Or, include the AVMA key in any Unattend.exe setup file.

### I am trying to use my Windows Server 2016 image created on Azure and it is not activating or using KMS activation.

Run the `slmgr /ipk` command. Azure images may not correctly fall back to AVMA, but if they can reach the Azure KMS system, they will activate. It is recommended that you ensure these VMs are set to use AVMA.

### I have performed all of these steps but my virtual machines are still not activating.

Contact your hardware supplier to verify that the correct BIOS markers were installed.

### What about earlier versions of Windows Server?

[Automatic Virtual Machine Activation](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn303421(v=ws.11)) is not supported in earlier versions of Windows Server. You will have to activate the VMs manually.

## Next steps

For more information, see the following articles:

- [The Azure Stack Marketplace overview](azure-stack-marketplace.md)
- [Download marketplace items from Azure to Azure Stack](azure-stack-download-azure-marketplace-item.md)
