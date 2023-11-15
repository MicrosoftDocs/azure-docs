---
title: Create Azure NetApp files Azure Virtual Desktop - Azure
description: This article describes how to create Azure NetApp Files in Azure Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 08/19/2021
ms.author: helohr
manager: femila
---

# Upload MSIX images to Azure NetApp Files in Azure Virtual Desktop

This article describes how to upload MSIX images to Azure NetApp Files in Azure Virtual Desktop.

## Requirements

Before you can start uploading the images, you'll need to set up Azure NetApp Files if you haven't already.

To set up Azure NetApp Files, you'll need the following things:

- An Azure account with contributor or administrator access

- A virtual machine (VM) or physical machine joined to Active Directory Domain Services (AD DS), and permissions to access it

- An Azure Virtual Desktop host pool made of domain-joined session hosts. Each session host must be in the same region as the region you create your Azure NetApp files in. For more information, see [regional availability](https://azure.microsoft.com/global-infrastructure/services/?products=netapp). If your existing session hosts aren't in one of the available regions, you'll need to create new ones.

## Start using Azure NetApp Files

To start using Azure NetApp Files:

1. Set up your Azure NetApp Files account by following the instructions in [Set up your Azure NetApp Files account](create-fslogix-profile-container.md#set-up-your-azure-netapp-files-account).
2. Create a capacity pool by following the instructions in [Set up a capacity pool](../azure-netapp-files/azure-netapp-files-set-up-capacity-pool.md).
3. Join an Active Directory connection by following the instructions in [Join an Active Directory connection](create-fslogix-profile-container.md#join-an-active-directory-connection).
4. Create a new volume by following the instructions to [create an SMB volume for Azure NetApp Files](../azure-netapp-files/azure-netapp-files-create-volumes-smb.md). Ensure select **Enable Continuous Availability**.
5. Make sure your connection to the Azure NetApp Files share works by following the instructions in [Make sure users can access the Azure NetApp Files share](create-fslogix-profile-container.md#make-sure-users-can-access-the-azure-netapp-files-share).

## Upload an MSIX image to the Azure NetApp file share

Now that you've set up your Azure NetApp Files share, you can start uploading images to it.

To upload an MSIX image to your Azure NetApp Files share:

1. In each session host, install the certificate that you signed the MSIX package with. Make sure to store the certificates in the folder named **Trusted People**.
2. Copy the MSIX image you want to add to the Azure NetApp Files share.
3. Go to **File Explorer** and enter the mount path, then paste the MSIX image into the mount path folder.

Your MSIX image should now be accessible to your session hosts when they add an MSIX package using the Azure portal or PowerShell.

## Next steps

Now that you've created an Azure NetApp Files share to store MSIX images, learn how to [Create replication peering for Azure NetApp Files](../azure-netapp-files/cross-region-replication-create-peering.md)
