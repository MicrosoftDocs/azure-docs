---
title: What is Pure Storage Cloud (preview)?
description: Learn about Pure Storage Cloud (preview).
author: ProfessorKendrick
ms.author: kkendrick
ms.topic: overview
ms.date: 03/24/2025

---
# What is Pure Storage Cloud (preview)?

[!INCLUDE [what-is](../includes/what-is.md)]

Microsoft and Pure Storage Cloud developed this service and manage it together.

Access Pure Storage Cloud from the [Azure portal](https://portal.azure.com).

This offering provides enterprise-class cloud block storage with built-in cloud capabilities powered by a common Purity operating environment. Pure Storage decouples storage and compute resources, which allows customers with large data footprints to optimize their cloud spend and avoid paying for unnecessary compute power.

## Capabilities

Here are the key capabilities provided by the Pure Storage Cloud integration:

- **Elastic capacity** - Pay for the capacity you use.
- **Flexible performance** - Scale independently from capacity.
- **Thin provisioning** - Allocate space dynamically.
- **Instant resizing** - Adjust storage volumes without downtime or disruption.
- **Flexible volumes** - Multiple hosts can simultaneously access the same storage volume.
- **Snapshots** - Quickly recover from data loss or corruption.

## Subscribe to Pure Storage Cloud (preview)

You can [subscribe to Pure Storage Cloud](https://azuremarketplace.microsoft.com/marketplace/apps/purestoragemarketplaceadmin.psc_contact_me?tab=Overview) in Azure Marketplace.

1. Select the **Contact Me** button.

    Pure Storage will email you once they have enabled your tenant.

    Once your tenant is enabled, you will [access the service via this link](https://portal.azure.com/?Azure_Marketplace_PureStorage_assettypeoptions=%7B%22purestorage_block_reservations%22%3A%7B%22options%22%3A%22%22%7D%7D&Azure_Marketplace_PureStorage=true&feature.canmodifystamps=true#home).

    > [!IMPORTANT]
    > - You cannot access the service until your tenant is enabled.
    > You must use this link until Pure Storage is generally available in order to access the service in Azure portal. 

1. Go to **Subscriptions** and select the subscription where the AVS cluster and the service will be deployed.

1. Go to the **Settings** tab and select **Resource providers**.

1. Choose `PureStorage.Block` from the options.

    > [!NOTE]
    > You can also choose Pure Storage as a resource provider with Azure CLI
    > ```az provider register --namespace 'PureStorage.Block'```

1. Select the **Register** button.

    The status will update to *Registered* once the process is complete.

## Pure Storage Cloud links

For more information, see [Pure Storage Cloud documentation](https://www.purestorage.com/solutions/cloud.html).

## Next step

> [!div class="nextstepaction"]
> [Quickstart: Create a Pure Storage Cloud (preview) resource](create.md)