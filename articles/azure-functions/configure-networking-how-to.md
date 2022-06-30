---
title: How to configure Azure Functions with a virtual network
description: Article that shows you how to perform certain virtual networking tasks for Azure Functions.
ms.topic: conceptual
ms.date: 03/04/2022
ms.custom: template-how-to
---

# How to configure Azure Functions with a virtual network

This article shows you how to perform tasks related to configuring your function app to connect to and run on a virtual network. For an in-depth tutorial on how to secure your storage account, please refer to the [Connect to a Virtual Network tutorial](functions-create-vnet.md). To learn more about Azure Functions and networking, see [Azure Functions networking options](functions-networking-options.md).

## Restrict your storage account to a virtual network 

When you create a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. You can replace this storage account with one that is secured with service endpoints or private endpoints. When configuring your storage account with private endpoints, public access to your storage account is not automatically disabled. In order to disable public access to your storage account, configure your storage firewall to allow access from only selected networks.



> [!NOTE]  
> This feature currently works for all Windows and Linux virtual network-supported SKUs in the Dedicated (App Service) plan and for Windows Elastic Premium plans. Consumption tier isn't supported. 

To set up a function with a storage account restricted to a private network:

1. Create a function with a storage account that does not have service endpoints enabled.

1. Configure the function to connect to your virtual network.

1. Create or configure a different storage account.  This will be the storage account we secure with service endpoints and connect our function.

1. [Create a file share](../storage/files/storage-how-to-create-file-share.md#create-a-file-share) in the secured storage account.

1. Enable service endpoints or private endpoint for the storage account.  
    * If using private endpoint connections, the storage account will need a private endpoint for the `file` and `blob` sub-resources.  If using certain capabilities like Durable Functions, you will also need `queue` and `table` accessible through a private endpoint connection.
    * If using service endpoints, enable the subnet dedicated to your function apps for storage accounts.

1. Copy the file and blob content from the function app storage account to the secured storage account and file share.

1. Copy the connection string for this storage account.

1. Update the **Application Settings** under **Configuration** for the function app to the following:

    | Setting name | Value | Comment |
    |----|----|----|
    | `AzureWebJobsStorage`| Storage connection string | This is the connection string for a secured storage account. |
    | `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` |  Storage connection string | This is the connection string for a secured storage account. |
    | `WEBSITE_CONTENTSHARE` | File share | The name of the file share created in the secured storage account where the project deployment files reside. |
    | `WEBSITE_CONTENTOVERVNET` | 1 | A value of 1 enables your function app to scale when you have your storage account restricted to a virtual network. You should enable this setting when restricting your storage account to a virtual network. |

1. Select **Save** to save the application settings. Changing app settings causes the app to restart.  

After the function app restarts, it's now connected to a secured storage account.

## Next steps

> [!div class="nextstepaction"]
> [Azure Functions networking options](functions-networking-options.md)
