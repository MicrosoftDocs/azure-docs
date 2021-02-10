---
title: Move from managed to self-hosted
titleSuffix: Azure API Management
description: Learn how to move from a managed version of the developer portal to a self-hosted version.
author: erikadoyle
ms.author: apimpm
ms.date: 02/09/2021
ms.service: api-management
ms.topic: how-to
---

# Move from managed to self-hosted

Over time, your business requirements may change. You can end up in a situation where the managed version of the developer portal no longer satisfies your needs. For example, a new requirement may force you to build a custom widget that integrates with a third-party data provider. Unlike the manged version, the self-hosted version of the portal offers you full flexibility and extensibility.

## Transition process

You can transition from the managed version to a self-hosted version within the same API Management service instance. The process preserves all the modifications that you've carried out in the managed version of the portal. Make sure you back up the portal's content beforehand. You can find the backup script in the `scripts` folder of the repository.

The conversion process is almost identical to [setting up a generic self-hosted portal](dev-portal-self-host-portal.md). There is one exception in the configuration step. The Storage Account in the `config.design.json` file needs to be the same as the Storage Account of the managed version of the portal. See [Tutorial: Use a Linux VM system-assigned identity to access Azure Storage via a SAS credential](../active-directory/managed-identities-azure-resources/tutorial-linux-vm-access-storage-sas.md#get-a-sas-credential-from-azure-resource-manager-to-make-storage-calls) for instructions on how to retrieve the SAS URL.

> [!TIP]
> We recommend using a separate Storage Account in the `config.publish.json` file. This approach gives you more control and simplifies the management of the hosting service of your portal.

## Next steps

- [Alternative processes for self-hosted portal](dev-portal-alternative-processes-self-hosted-portal.md)
