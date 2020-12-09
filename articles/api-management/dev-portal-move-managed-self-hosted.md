---
title: Move from managed to self hosted
description: placeholder description text Move from managed to self hosted
author: erikadoyle
ms.author: apimpm
ms.date: 11/30/2020
ms.service: api-management
ms.topic: how-to
---

# Move from managed to self hosted

As your business requirements change, you can end up in a situation, when the managed version of the portal no longer satisfies your needs. For example, a new requirement may force you to build a custom widget, which integrates with a third-party data provider. The self-hosted version of the portal offers you full flexibility and extensibility, as opposed to the managed version.

You can transition from the managed version to a self-hosted version within the same API Management service instance, while preserving all the modifications that have been carried out through the managed version (for example, changes to pages and configuration, uploaded media files). Make sure you backup the portal's content beforehand. You can find the backup script in the `/scripts` folder of the repository.

The process is almost identical to [setting up a generic self-hosted portal](dev-portal-self-host-the-portal.md) with one exception in the configuration step: the Storage Account in the `config.design.json` file needs to be the same as the Storage Account of the managed version of the portal. Refer to [this article](../active-directory/managed-identities-azure-resources/tutorial-linux-vm-access-storage-sas.md#get-a-sas-credential-from-azure-resource-manager-to-make-storage-calls) for instructions on how to retrieve this SAS URL.

We recommend using a separate Storage Account in the `config.publish.json` file. This approach gives you more control and simplifies the management of the hosting service of your portal.
