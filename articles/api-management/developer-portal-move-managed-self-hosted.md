---
title: Move from managed to self-hosted developer portal
titleSuffix: Azure API Management
description: Learn how to move from a managed version of the API Management developer portal to a self-hosted version.
author: dlepow
ms.author: apimpm
ms.date: 03/25/2021
ms.service: api-management
ms.topic: how-to
---

# Move from managed to self-hosted developer portal

Over time, your business requirements may change. You can end up in a situation where the managed version of the API Management developer portal no longer satisfies your needs. For example, a new requirement may force you to build a custom widget that integrates with a third-party data provider. Unlike the manged version, the self-hosted version of the portal offers you full flexibility and extensibility.

## Transition process

You can transition from the managed version to a self-hosted version within the same API Management service instance. The process preserves the modifications that you've carried out in the managed version of the portal. Make sure you back up the portal's content beforehand. You can find the backup script in the `scripts` folder of the API Management developer portal [GitHub repo](https://github.com/Azure/api-management-developer-portal).

The conversion process is almost identical to [setting up a generic self-hosted portal](developer-portal-self-host.md). There is one exception in the configuration step. The storage account in the `config.design.json` file needs to be the same as the storage account of the managed version of the portal. See [Tutorial: Use a Linux VM system-assigned identity to access Azure Storage via a SAS credential](../active-directory/managed-identities-azure-resources/tutorial-linux-vm-access-storage-sas.md#get-a-sas-credential-from-azure-resource-manager-to-make-storage-calls) for instructions on how to retrieve the SAS URL.

> [!TIP]
> We recommend using a separate storage account in the `config.publish.json` file. This approach gives you more control and simplifies the management of the hosting service of your portal.

## Next steps

Learn more about the developer portal:

- [Azure API Management developer portal overview](api-management-howto-developer-portal.md)
- [Self-host the developer portal](developer-portal-self-host.md)
