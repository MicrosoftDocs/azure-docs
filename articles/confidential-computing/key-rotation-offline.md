---
title: Rotate customer-managed keys for Azure confidential virtual machines
description: Learn how to rotate customer-managed keys for confidential virtual machines (confidential VMs) in Azure.
author: prasadmsft
ms.author: reprasa
ms.service: virtual-machines
ms.topic: how-to
ms.date: 07/06/2022
ms.custom: template-how-to
---

# Rotate customer-managed keys for confidential VMs

Confidential virtual machines (confidential VMs) in Azure supports customer-managed keys. Customer-managed keys help confidential VMs and associated artifacts work properly. You can manage these keys in Azure Key Vault or through a managed Hardware Security Module (managed HSM). This article focuses on managing the keys through a managed HSM, unless stated otherwise.

If you want to use a customer-managed key, you must supply a Disk Encryption Set resource when you create your confidential VM. The Disk Encryption Set must reference the customer-managed key. Typically, you might associate a single Disk Encryption Set with multiple confidential VMs.
It's recommended that you periodically rotate a customer-managed key as a security best practice. The frequency of rotation is an organizational policy decision. Rotation is also necessary if a customer-managed key is compromised. 

## Change customer-managed key

You can change the key that you're using for confidential VMs at any time. To rotate a customer-managed key:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the **Virtual Machines** service.
1. Stop all confidential VMs with the same Disk Encryption Set. If one or more VMs isn't in the stopped state, then none of the VMs can receive the new key.
1. Go to the **Disk Encryption Sets** service.
1. Select the Disk Encryption Set resource that's associated with your confidential VM.
1. On the resource's menu, under **Settings**, select **Key**.
1. Select **Change key**.
1. Select the appropriate key vault, key and version.
1. Save your changes. The save operation updates the key for all confidential VM artifacts.

## Retry key rotation

In rare cases, the customer-managed key might not be rotated for all confidential VMs, even when all the VMs were stopped. If the customer-managed key isn't rotated, the Disk Encryption Set resource still contains a reference to the old key. In this state, some confidential VMs can have the new key and some can have the old key.

To resolve this issue, repeat the steps to [update the Disk Encryption Set](#change-customer-managed-key).

## Limitations

- Automatic key rotation isn't currently supported for confidential VMs.
- Key rotation isn't supported for ephemeral disks. It's recommended to have a separate Disk Encryption Set for confidential VMs with an ephemeral disk. If confidential VMs with ephemeral and non-ephemeral disks share the same Disk Encryption Set, you must delete the confidential VMs with ephemeral disks before you rotate the keys for the confidential VMs with non-ephemeral disks.
