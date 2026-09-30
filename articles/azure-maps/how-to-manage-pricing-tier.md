---
title: Azure Maps account pricing
titleSuffix: Microsoft Azure Maps
description: Learn about Azure Maps account pricing and the Gen2 account configuration.
author: pbrasil
ms.author: peterbr
ms.date: 08/28/2026
ms.topic: how-to
ms.service: azure-maps
ms.subservice: manage-account
---

# Azure Maps account pricing

Azure Maps uses the Gen2 pricing tier. Gen2 provides access to all Azure Maps features with usage-based pricing and volume discounts. For cost information, see [Azure Maps pricing] and [Understanding Azure Maps Transactions].

> [!NOTE]
>
> **Azure Maps Gen1 pricing tier retirement**
>
> The Gen1 pricing tier retired on September 15, 2026. All accounts that used Gen1 S0 or S1 were automatically converted to Gen2. The conversion didn't require regenerating subscription keys, Microsoft Entra client IDs, or shared access signature (SAS) tokens.

## Configure an account with an ARM template

When you create an Azure Maps account with an Azure Resource Manager (ARM) template, set the SKU name to `G2` and the account kind to `Gen2`. For more information, see [Create account with ARM template].

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
[Create account with ARM template]: how-to-create-template.md
[View usage metrics]: how-to-view-api-usage.md
[Understanding Azure Maps Transactions]: understanding-azure-maps-transactions.md