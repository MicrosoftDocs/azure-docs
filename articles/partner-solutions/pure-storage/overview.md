---
title: What is Azure Native Pure Storage Cloud (preview)?
description: Discover Azure Native Pure Storage Cloud (preview), offering scalable and flexible enterprise-class cloud block storage with built-in capabilities via the Azure portal.
author: ProfessorKendrick
ms.author: kkendrick
ms.topic: overview
ms.date: 03/24/2025
---
# What is Azure Native Pure Storage Cloud (preview)?

[!INCLUDE [what-is](../includes/what-is.md)]

Microsoft and Pure Storage Cloud developed this service and manage it together.

Access Azure Native Pure Storage Cloud from the [Azure portal](https://portal.azure.com).

This offering provides enterprise-class cloud block storage with built-in cloud capabilities powered by a common Purity operating environment. Pure Storage decouples storage and compute resources, which allows customers with large data footprints to optimize their cloud spend and avoid paying for unnecessary compute power.

## Capabilities

Here are the key capabilities provided by the Pure Storage Cloud integration:

- **Elastic capacity** - Pay for the capacity you use.
- **Flexible performance** - Scale independently from capacity.
- **Thin provisioning** - Allocate space dynamically.
- **Instant resizing** - Adjust storage volumes without downtime or disruption.
- **Flexible volumes** - Multiple hosts can simultaneously access the same storage volume.
- **Snapshots** - Quickly recover from data loss or corruption.

## Subscribe to Azure Native Pure Storage Cloud (preview)

You can [subscribe to Azure Native Pure Storage Cloud](https://azuremarketplace.microsoft.com/marketplace/apps/purestoragemarketplaceadmin.psc_contact_me?tab=Overview) in Azure Marketplace.

1. Select the **Contact Me** button.

    Pure Storage emails you once they enable your tenant.

    Once your tenant is enabled, you can [access the service via this link](https://portal.azure.com/?Azure_Marketplace_PureStorage_assettypeoptions=%7B%22purestorage_block_reservations%22%3A%7B%22options%22%3A%22%22%7D%7D&Azure_Marketplace_PureStorage=true&feature.canmodifystamps=true#home).

    > [!IMPORTANT]
    > - You can't access the service until your tenant is enabled.

1. Go to **Subscriptions** and select the subscription where you wish to deploy the AVS cluster.

1. Go to the **Settings** tab and select **Resource providers**.

1. Choose `PureStorage.Block` from the options.

    
    You can also choose Pure Storage as a resource provider with Azure CLI <br />

    ```
    az provider register --namespace 'PureStorage.Block'
    ```

1. Select the **Register** button.

    The status updates to *Registered* once the process is complete.

## Azure Native Pure Storage Cloud links

For more information, see [Pure Storage Cloud documentation](https://support.purestorage.com/csh?context=azure_native_pure_storage_cloud).

## Next step

> [!div class="nextstepaction"]
> [Quickstart: Create an Azure Native Pure Storage Cloud (preview) resource](create.md)