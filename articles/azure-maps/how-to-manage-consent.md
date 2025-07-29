---
title: Configure global data processing
description: This article describes how to configure the global data processing settings in Azure Maps to comply with data residency laws.
author: pbrasil
ms.author: peterbr
ms.date: 11/19/2024
ms.topic: how-to
ms.service: azure-maps
ms.subservice: manage-account
---

# Configure global data processing

In some cases, it may be necessary to process requests in a region different from your Azure Maps Account's region due to local data residency laws. When this happens, you can grant Azure Maps consent to process your data in other specified regions. For more information, see [Consent management].

This article guides you on configuring global data processing settings to comply with data residency laws using multiple approaches including the [Azure Portal](#configure-global-data-processing-in-the-azure-portal), [REST APIs](#configure-global-data-processing-using-rest-api) or an [ARM deployment template](#configure-global-data-processing-using-an-arm-deployment-template). This allows Azure Maps to process address requests within the specified country's region, regardless of your Azure Maps Account's region.

> [!IMPORTANT]
> If your scenarios don't involve South Korea data, there is no need to enable cross-region processing. This requirement is specific to South Korea due to its data residency laws.

## Configure global data processing in the Azure portal

The Azure Maps Resource location is enabled by default and can be configured in the **Process Data Globally** page of the Azure portal.

To give consent to one or more regions:

1. Sign in to your Azure Maps Account in the [Azure portal].
1. In **Settings**, select **Process data globally**.

   A map of the world appears with a plus sign for each region that can be selected.

   :::image type="content" source="./media/consent-management/process-data-globally.png" lightbox="./media/consent-management/process-data-globally.png" alt-text="Screenshot showing the process data globally screen in the Azure portal.":::

1. Additionally you can select **Add region**, then select the region you wish to add or remove.

   :::image type="content" source="./media/consent-management/select-korea-central.png" lightbox="./media/consent-management/select-korea-central.png" alt-text="Screenshot showing the process data globally screen in the Azure portal with the Korea Central region selected.":::

1. Once you all desired regions are chosen, select **Save**.

   :::image type="content" source="./media/consent-management/save-selection.png" lightbox="./media/consent-management/save-selection.png" alt-text="Screenshot showing the save button highlighted in process data globally screen in the Azure portal.":::

Once your updates are saved, one or more new selections appear in the list of regions.

:::image type="content" source="./media/consent-management/new-region-added.png" lightbox="./media/consent-management/new-region-added.png" alt-text="Screenshot showing the process data globally screen in the Azure portal with the Korea Central region added to the list of supported regions.":::

## Configure global data processing using REST API

Consent can be managed using [Azure Maps Account Management REST APIs]. To Configure global data processing, send an [Accounts - Update]  `PATCH` request and pass in the `properties.locations` parameter in the body of the request.

Be sure to include the appropriate [subscription key], resource group and Azure Maps account name.

```html
https://management.azure.com/subscriptions/<subscription-key>/resourceGroups/<resource-group-name>/providers/Microsoft.Maps/accounts/<account-name>?api-version=2024-07-01-preview
```

**Header**

Be sure to include a correct [access-token].

```html
Content-Type: application/json
Authorization: Bearer <access-token> 
```

**Body**

```json
{
  "properties": {
    "locations": [
      {
        "locationName": "Korea Central"
      }
    ]
  },
}
```

## Configure global data processing using an ARM deployment template

The following template will add _West Europe_ to the list of valid global data processing regions.

Be sure to include the appropriate Azure Maps account name and location.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Maps/accounts",
      "apiVersion": "2024-07-01-preview",
      "name": "<account-name>",
      "location": "<account-location>",
      "sku": {
        "name": "G2"
      },
      "properties":
      {
        "locations": [
          {
            "locationName": "West Europe"
          }
        ]
      }
    }
  ]
}
```

> [!NOTE]
> Your data is always stored in the region you created your Azure Maps Account, regardless of your global data processing settings.

## Next steps

Azure Maps is a global service that allows specifying a geographic scope, which enables limiting data residency to specific regions.

> [!div class="nextstepaction"]
> [Azure Maps service geographic scope]

[access-token]: azure-maps-authentication.md#microsoft-entra-authentication
[Accounts - Update]: /rest/api/maps-management/accounts/update
[Azure Maps Account Management REST APIs]: /rest/api/maps-management/accounts
[Azure portal]: https://ms.portal.azure.com
[Azure Maps service geographic scope]: geographic-scope.md
[Consent management]: consent-management.md
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account