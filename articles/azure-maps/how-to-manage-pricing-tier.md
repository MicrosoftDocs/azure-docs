---
title: Manage your Azure Maps account's pricing tier
titleSuffix: Microsoft Azure Maps
description: You can use the Azure portal to manage your Microsoft Azure Maps account and its pricing tier.
author: eriklindeman
ms.author: eriklind
ms.date: 09/14/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Manage the pricing tier of your Azure Maps account

You can manage the pricing tier of your Azure Maps account through the [Azure portal] or an [Azure Resource Manager (ARM) template].

> [!NOTE]
>
> **Azure Maps Gen1 pricing tier retirement**
>
> Gen1 pricing tier is now deprecated and will be retired on 9/15/26. Gen2 pricing tier replaces Gen1 (both S0 and S1) pricing tier. If your Azure Maps account has Gen1 pricing tier selected, you can switch to Gen2 pricing tier before it’s retired, otherwise it will automatically be updated.
>
>After 9/14/23, Gen1 pricing tier will no longer be available when creating new Azure Maps accounts via the Azure Portal. After 10/12/23, Gen1 pricing tier will no longer be available when creating new Azure Maps accounts when using an ARM template.
>
> You don't have to generate new subscription keys, client ID (for Azure AD authentication) or shared access signature (SAS) tokens if you change the pricing tier for your Azure Maps account.
>
> For more information on Gen2 pricing tier, see [Azure Maps pricing].

## Change a pricing tier

### Azure portal

To change your pricing tier from Gen1 to Gen2 in the Azure Portal, navigate to the Pricing tier option in the settings menu of your Azure Maps account. Select Gen2 from the Pricing tier drop-down list then the Save button.

> [!NOTE]
> You don't have to generate new subscription keys, client ID (for Azure AD authentication) or shared access signature (SAS) tokens if you change the pricing tier for your Azure Maps account.

:::image type="content" source="./media/how-to-manage-pricing-tier/change-pricing-tier.png" border="true" alt-text="Change a pricing tier":::

### ARM template

To change your pricing tier from Gen1 to Gen2 in the ARM template, update `pricingTier` to **G2** and `kind` to **Gen2**. For more info on using ARM templates, see [Create account with ARM template].

<!------

:::image type="content" source="./media/how-to-manage-pricing-tier/arm-template.png" border="true" alt-text="Screenshot of an ARM template that demonstrates updating pricingTier to G2 and kind to Gen2.":::

```json
  "pricingTier": { 
      "type": "string", 
      "allowedValues":[ 
          "G2"
      ], 
      "defaultValue": "G2",
      "metadata": { 
          "description": "The pricing tier SKU for the account." 
      } 
  }, 
  "kind": { 
      "type": "string", 
      "allowedValues":[ 
          "Gen2" 
      ], 
      "defaultValue": "Gen2", 
      "metadata": { 
          "description": "The pricing tier for the account." 
      } 
  } 
```
:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.maps/maps-create/azuredeploy.json" range="27-46":::
--->

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.maps/maps-create/azuredeploy.json" highlight="27-47":::

## Next steps

Learn how to see the API usage metrics for your Azure Maps account:

> [!div class="nextstepaction"]
> [View usage metrics]

[Azure Maps pricing]: https://azure.microsoft.com/pricing/details/azure-maps/
[Azure Portal]: https://portal.azure.com/
[Azure Resource Manager (ARM) template]: how-to-create-template.md
[Create account with ARM template]: how-to-create-template.md
[View usage metrics]: how-to-view-api-usage.md
