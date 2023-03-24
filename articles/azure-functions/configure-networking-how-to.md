---
title: How to configure Azure Functions with a virtual network
description: Article that shows you how to perform certain virtual networking tasks for Azure Functions.
ms.topic: conceptual
ms.date: 03/24/2023
ms.custom: template-how-to
---

# How to configure Azure Functions with a virtual network

This article shows you how to perform tasks related to configuring your function app to connect to and run on a virtual network. For an in-depth tutorial on how to secure your storage account, please refer to the [Connect to a Virtual Network tutorial](functions-create-vnet.md). To learn more about Azure Functions and networking, see [Azure Functions networking options](functions-networking-options.md).

## Restrict your storage account to a virtual network 

When you create a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. During creation, you can secure the storage account using the Azure Portal (refer Option 1 below) or ARM template (refer Option 2 below). If the storage account was not secured during creation, you can also replace this storage account with one that is secured with service endpoints or private endpoints by updating the settings manually (refer Option 3 below). Due to current design, its not possible to directly secure the same storage account thats used by an already created function app.

- **Option 1:** To create a new function app using a new storage account that's locked behind a virtual network, via the Azure portal, you can follow the tutorial [Use private endpoints to integrate Azure Functions with a virtual network](https://learn.microsoft.com/azure/azure-functions/functions-create-vnet)

- **Option 2:**To create a new function app using a new storage account that's locked behind a virtual network, via an ARM template, you can use this [Quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/function-app-storage-private-endpoints) 

- **Option 3:**To secure an already existing function app to a secure storage account that's locked behind a virtual network, follow the instructions below.

> [!NOTE]  
> This feature currently works for all Windows and Linux virtual network-supported SKUs in the Dedicated (App Service) plan and for Windows Elastic Premium plans. Consumption tier isn't supported. 

1. Create or Use a function app with a storage account that does not have service endpoints or private endpoints enabled.

1. Configure the function to connect to your virtual network.

1. Create or configure a different storage account.  This will be the storage account we secure with private endpoints or service endpoints and connect our function.

1. [Create a file share](../storage/files/storage-how-to-create-file-share.md#create-a-file-share) in the secured storage account.

1. Enable service endpoints or private endpoint for the storage account.  
    * If using private endpoint connections, the storage account will need a private endpoint for the `file` and `blob` sub-resources.  If using certain capabilities like Durable Functions, you will also need `queue` and `table` accessible through a private endpoint connection.
    * If using service endpoints, enable the subnet dedicated to your function apps for storage accounts on the firewall.

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
