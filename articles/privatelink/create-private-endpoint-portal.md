---
title: 'Create an Azure Private Endpoint using the Azure Portal| Microsoft Docs'
description: Learn about Azure Private Endpoint
services: virtual-network
author: KumudD
# Customer intent: As someone with a basic network background, but is new to Azure, I want to create an Azure Private Endpoint
ms.service: virtual-network
ms.topic: article
ms.date: 08/26/2019
ms.author: kumud

---
# Create Azure Private Endpoint using Azure Portal
This quickstart shows you how to create an Azure Private Endpoint using the Azure Portal.


## Create a resource group


## Create a virtual network
In this section, you create a virtual network and a subnet. Next, you associate the subnet your virtual network.


## Create a virtual machine


## Create a storage account



## Create a Private Endpoint


## Configure the private DNS zone 

## Connect to a VM from the internet




## Access storage account privately from the VM

1. In the Remote Desktop of myPEVM, open PowerShell.
2. Enter `nslookup mystorageaccount.blob.core.windows.net`
    You'll receive a message similar to this:
    ```azurepowershell
    Server:  UnKnown
    Address:  168.63.129.16
    Non-authoritative answer:
    Name:    mystorageaccount123123.privatelink.blob.core.windows.net
    Address:  10.0.0.5
    Aliases:  mystorageaccount.blob.core.windows.net
3. Install [Microsoft Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&tabs=windows).
4. Select **Storage accounts** with the right-click.
5. Select **Connect to an azure storage**.
6. Select **Use a connection string**.
7. Select **Next**.
8. Enter the connection string by pasting the information previously copied.
9. Select **Next**.
10. Select **Connect**.
11. Browse the Blob containers from mystorageaccount 
12. (Optionally) Create folders and/or upload files to *mystorageaccount*. 
13. Close the remote desktop connection to *myPEVM*. 


Additional options to access the Storage account:
- Microsoft Azure Storage Explorer is a standalone free app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux. You can install the application to browse privately the storage account content. 
 
- The AzCopy utility is another option for high-performance scriptable data transfer for Azure Storage. Use AzCopy to transfer data to and from Blob, File, and Table storage. 


## Clean up resources 


## Next steps
- Learn more about [Azure Private Link](privatelink-overview.md)