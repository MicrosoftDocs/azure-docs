---
title: Enable NFS
description: How to enable nfs
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 07/31/2020
ms.author: rogarana
ms.subservice: files
---

# How to create an NFS share

## Prerequisites

You must have already created a virtual machine and a virtual network. You will need the VM's public IP address for this process.

Create a [FileStorage account](storage-how-to-create-premium-fileshare.md).

## Getting started

1. Navigate to your newly created FileStorage account, select **Firewalls and virtual networks**
1. Select Allow access from **Selected networks**.
1. Select **+ Add existing virtual network**. 

:::image type="content" source="media/how-to-enable-nfs/adding-existing-vm-network-nfs.png" alt-text="example text":::

1. Select your virtual network and subnet, then select add.

:::image type="content" source="media/how-to-enable-nfs/add-nfs-vm-network.png" alt-text="example text":::

1. Select **Add your client IP address**
1. Enter your VM's IP in the address range.
1. Select **Save**.

:::image type="content" source="media/how-to-enable-nfs/add-vm-ip-to-account-nfs.png" alt-text="example text":::

1. Create a file share, when creating a file share select the nfs protocol
1. Once the file share is created, select the share to get the connection details
1. Remote into your VM and use the provided mounting script

You have now mounted your NFS share
