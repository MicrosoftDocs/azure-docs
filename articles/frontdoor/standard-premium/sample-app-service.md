---
title: Azure Resource Manager Template Sample - App Service
description: Creates an App Service app with a public endpoint, and a Front Door profile.
services: frontdoor
author: johndowns
ms.author: jodowns
ms.service: frontdoor
ms.topic: sample
ms.date: 02/23/2021
---

# Create an Azure App Service app and Front Door

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

This sample template creates an App Service app as well as a Front Door profile, and uses the App Service's public IP address with [access restrictions](../../app-service/app-service-ip-restrictions.md) to enforce that incoming connections must come through Front Door.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Overview

This sample deploys:

- An App Service plan and application without private endpoints enabled.
- A Front Door profile, endpoint, etc. This can be configured to use the standard or premium Front Door SKU types.
- [App Service access restrictions](../../app-service/app-service-ip-restrictions.md) to block access to the application unless they have come through Front Door. The traffic is checked to ensure it has come from the `AzureFrontDoor.Backend` service tag, and also that the `X-Azure-FDID` header is configured with your specific Front Door instance's ID.

The following diagram illustrates the components of this sample.

![Architecture diagram showing traffic inspected by App Service access restrictions.](../media/sample-app-service/diagram.png)

## Sample template

TODO

## Next steps

For more information on Azure Resource Manager templates, see [Azure Resource Manager templates documentation](../../azure-resource-manager/templates/).

Additional Front Door samples can be found in the [Azure Front Door resource manager template samples](resource-manager-template-samples.md)
