---
title: Enable end-to-end encryption using encryption at host - Azure portal - managed disks
description: Use encryption at host to enable end-to-end encryption on your Azure managed disks - Azure portal.
author: roygara
ms.service: virtual-machines
ms.topic: how-to
ms.date: 07/23/2020
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions
---

# Enable end-to-end encryption using encryption at host - Azure portal

When you enable encryption at host, data stored on the VM host is encrypted at rest and flows encrypted to the Storage service. For conceptual information on encryption at host, as well as other managed disk encryption types, see [Encryption at host - End-to-end encryption for your VM data](disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data).

[!INCLUDE [virtual-machines-disks-encryption-at-host-portal](../../../includes/virtual-machines-disks-encryption-at-host-portal.md)]

## Next steps

[Azure Resource Manager template samples](https://github.com/Azure-Samples/managed-disks-powershell-getting-started/tree/master/EncryptionAtHost)