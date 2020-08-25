---
title: Enable NFS
description: How to enable nfs
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 08/20/2020
ms.author: rogarana
ms.subservice: files
---

# How to create an NFS share

## Prerequisites

You must have already created a virtual machine and a virtual network. You will need the VM's public IP address for this process.

- Create a [FileStorage account](storage-how-to-create-premium-fileshare.md).

> [!IMPORTANT]
> Since encryption-in-transit is not currently available with NFS shares, we recommend disabling your storage account's public endpoint and configuring private endpoints, to ensure your data is secure and only accessible via your network.

- Either [create a private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint) (recommended) or [restrict access to your public endpoint](storage-files-networking-endpoints.md#restrict-public-endpoint-access).

## Create an NFS share

Now that you have created a FileStorage account and configured the networking, you can create an NFS file share. The process is similar to creating an SMB share, you select **NFS** instead of **SMB** when creating the share.

1. Create a file share, when creating a file share select the **NFS** protocol
1. Once the file share is created, select the share to get the connection details
1. Remote into your VM and use the provided mounting script

You have now mounted your NFS share
