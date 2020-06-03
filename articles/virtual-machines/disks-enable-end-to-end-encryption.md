---
title: Identify unattached Azure disks - Azure portal
description: How to find unattached Azure managed and unmanaged (VHDs/page blobs) disks by using the Azure portal.
author: roygara
ms.service: virtual-machines
ms.topic: how-to
ms.date: 06/01/2020
ms.author: rogarana
ms.subservice: disks
---

## Prerequisites

You must enable the feature for your subscription before you use the EncryptionAtHost property for your VM/VMSS. Please follow the steps below to enable the feature for your subscription:

1.	Execute the following command to register the feature for your subscription
 `Register-AzProviderFeature -FeatureName "EncryptionAtHost" -ProviderNamespace "Microsoft.Compute"` 
1.	Please check that the registration state is Registered (takes a few minutes) using the command below before trying out the feature.
 `Get-AzProviderFeature -FeatureName "EncryptionAtHost" -ProviderNamespace "Microsoft.Compute"  `

## Restrictions

1.	The feature is available only in the USCentralEUAP region.
2.	You cannot enable the feature if you have enabled Azure Disks Encryption (guest-VM encryption using bitlocker/VM-Decrypt) for your VMs/VMSSes and vice versa.
3.	You have to deallocate your existing VMs to enable the encryption.
4.	You can enable the encryption for existing VMSS. However, only new VMs created after enabling the encryption is encrypted.
5.	Legacy VM Sizes are not supported. You can find the list of supported VM sizes by:
