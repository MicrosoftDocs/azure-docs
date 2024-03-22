---
title: Terraform samples - Azure Front Door
description: Learn about Terraform samples for Azure Front Door, including samples for creating a basic Front Door profile.
services: frontdoor
author: johndowns
ms.service: frontdoor
ms.topic: sample
ms.custom: devx-track-terraform
ms.date: 11/22/2022
ms.author: jodowns
zone_pivot_groups: front-door-tiers
---
# Terraform deployment model templates for Front Door

The following table includes links to Terraform deployment model templates for Azure Front Door.

::: zone pivot="front-door-standard-premium"

| Sample | Description |
|-|-|
|**App Service origins**| **Description** |
| [App Service](https://github.com/Azure/terraform/tree/master/quickstart/101-front-door-standard-premium) | Creates an App Service app and a Front Door profile.  |
|**Storage origins**| **Description** |
| [Storage blobs with Private Link](https://github.com/Azure/terraform/tree/master/quickstart/101-front-door-premium-storage-blobs-private-link) | Creates an Azure Storage account and blob container with a private endpoint, and a Front Door profile.  |
| | |

::: zone-end

::: zone pivot="front-door-classic"

| Template | Description |
| ---| ---|
| [Create a basic Front Door](https://github.com/Azure/terraform/tree/master/quickstart/101-front-door-classic)| Creates a basic Front Door configuration with a single backend. |
| | |

::: zone-end

## Next steps

::: zone pivot="front-door-standard-premium"

- Learn how to [create a Front Door profile](standard-premium/create-front-door-portal.md).

::: zone-end

::: zone pivot="front-door-classic"

- Learn how to [create a Front Door](quickstart-create-front-door.md).

::: zone-end
