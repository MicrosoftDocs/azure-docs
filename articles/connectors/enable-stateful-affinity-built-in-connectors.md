---
title: Enable stateful mode for stateless built-in connectors
description: Enable stateless built-in connectors to run in stateful mode for Standard workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, edwardhe, azla
ms.topic: how-to
ms.custom: devx-track-azurepowershell
ms.date: 06/13/2023
---

# Enable stateful mode for stateless built-in connectors in Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

In Standard logic app workflows, the following built-in, service provider-based connectors are stateless, by default:

- Azure Service Bus
- SAP

To run these connector operations in stateful mode, you must enable this capability. This how-to guide shows how to enable stateful mode for these connectors.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- The Standard logic app resource where you plan to create the workflow that uses the stateful mode-enabled connector operations. If you don't have this resource, [create your Standard logic app resource now](../logic-apps/create-single-tenant-workflows-azure-portal.md).

- An Azure virtual network with a subnet to integrate with your logic app. If you don't have these items, see the following documentation:

  - [Quickstart: Create a virtual network with the Azure portal](../virtual-network/quick-create-portal.md)
  - [Add, change, or delete a virtual network subnet](../virtual-network/virtual-network-manage-subnet.md?tabs=azure-portal)

## Enable stateful mode in the Azure portal

1. In the [Azure portal](https://portal.azure.com), open the Standard logic app resource where you want to enable stateful mode for these connector operations.

1. Enable virtual network integration for your logic app and add your logic app to the previously created subnet:

   1. On your logic app menu resource, under **Settings**, select **Networking**.

   1. In the **Outbound Traffic** section, select **VNET integration** > **Add VNet**.

   1. On the **Add VNet Integration** pane that opens, select your Azure subscription and your virtual network.

   1. Under **Subnet**, select **Select existing**. From the **Subnet** list, select the subnet where you want to add your logic app.

   1. When you're done, select **OK**.

      On the **Networking** page, the **VNet integration** option now appears set to **On**, for example:

      :::image type="content" source="media/enable-stateful-affinity-built-in-connectors/enable-virtual-network-integration.png" alt-text="Screenshot shows Azure portal, Standard logic app resource, Networking page, VNet integration set to On.":::

   For general information about enabling virtual network integration with your app, see [Enable virtual network integration in Azure App Service](../app-service/configure-vnet-integration-enable.md).

1. Next, update your logic app's underlying website configuration (**<*logic-app-name*>.azurewebsites.net**) by using either of the following tools:

## Update website configuration for logic app

After you enable virtual network integration for your logic app, you must update your logic app's underlying website configuration (**<*logic-app-name*>.azurewebsites.net**) by using one the following methods:

- [Azure Resource Management API](#azure-resource-management-api) (bearer token required)
- [Azure PowerShell](#azure-powershell) (bearer token *not* required)

### Azure Resource Management API

To complete this task with the [Azure Resource Management API - Update By Id](/rest/api/resources/resources/update-by-id), review the following requirements, syntax, and parameter values.

#### Requirements

OAuth authorization and the bearer token are required. To get the bearer token, follow these steps

1. While you're signed in to the Azure portal, open your web browser's developer tools (F12).

1. Get the token by sending any management request, for example, by saving a workflow in your Standard logic app.

#### Syntax

Updates a resource by using the specified resource ID:

`PATCH https://management.azure.com/{resourceId}?api-version=2021-04-01`

#### Parameter values

| Element | Value  | Description |
|---------|--------|-------------|
| HTTP request method | **PATCH** |
| <*resourceId*> | **subscriptions/{yourSubscriptionID}/resourcegroups/{yourResourceGroup}/providers/Microsoft.Web/sites/{websiteName}/config/web** |
| <*yourSubscriptionId*> | The ID for your Azure subscription |
| <*yourResourceGroup*> | The resource group that contains your logic app resource |
| <*websiteName*> | The name for your logic app resource, which is **mystandardlogicapp** in this example |
| HTTP request body | **{"properties": {"vnetPrivatePortsCount": "2"}}** |

#### Example

`https://management.azure.com/subscriptions/XXxXxxXX-xXXx-XxxX-xXXX-XXXXxXxXxxXX/resourcegroups/My-Standard-RG/providers/Microsoft.Web/sites/mystandardlogicapp/config/web?api-version=2021-02-01`

### Azure PowerShell

To complete this task with Azure PowerShell, review the following requirements, syntax, and values. This method doesn't require that you manually get the bearer token.

#### Syntax

```powershell
Set-AzContext -Subscription {yourSubscriptionID}
$webConfig = Get-AzResource -ResourceId {resourceId}
$webConfig.Properties.vnetPrivatePortsCount = 2
$webConfig | Set-AzResource -ResourceId {resourceId}
```

For more information, see the following documentation:

- [Set-AzContext](/powershell/module/az.accounts/set-azcontext)
- [Get-AzResource](/powershell/module/az.resources/get-azresource)
- [Set-AzResource](/powershell/module/az.resources/set-azresource)

#### Parameter values

| Element | Value  |
|---------|--------|
| <*yourSubscriptionID*> | The ID for your Azure subscription |
| <*resourceId*> | **subscriptions/{yourSubscriptionID}/resourcegroups/{yourResourceGroup}/providers/Microsoft.Web/sites/{websiteName}/config/web** |
| <*yourResourceGroup*> | The resource group that contains your logic app resource |
| <*websiteName*> | The name for your logic app resource, which is **mystandardlogicapp** in this example |

#### Example

`https://management.azure.com/subscriptions/XXxXxxXX-xXXx-XxxX-xXXX-XXXXxXxXxxXX/resourcegroups/My-Standard-RG/providers/Microsoft.Web/sites/mystandardlogicapp/config/web?api-version=2021-02-01`

#### Troubleshoot errors

##### Error: Reserved instance count is invalid

If you get an error that says **Reserved instance count is invalid**, use the following workaround:

```powershell
$webConfig.Properties.preWarmedInstanceCount = $webConfig.Properties.reservedInstanceCount
$webConfig.Properties.reservedInstanceCount = $null
$webConfig | Set-AzResource -ResourceId {resourceId}
```

Error example:

```powershell
Set-AzResource :
{
   "Code":"BadRequest",
   "Message":"siteConfig.ReservedInstanceCount is invalid.  Please use the new property siteConfig.PreWarmedInstanceCount.",
   "Target": null,
   "Details":
   [
      {
         "Message":"siteConfig.ReservedInstanceCount is invalid. Please use the new property siteConfig.PreWarmedInstanceCount."
      },
      {
         "Code":"BadRequest"
      },
      {
         "ErrorEntity":
         {
            "ExtendedCode":"51021",
            "MessageTemplate":"{0} is invalid. {1}",
            "Parameters":
            [
               "siteConfig.ReservedInstanceCount", "Please use the new property siteConfig.PreWarmedInstanceCount."
            ],
            "Code":"BadRequest",
            "Message":"siteConfig.ReservedInstanceCount is invalid. Please use the new property siteConfig.PreWarmedInstanceCount."
         }
      }
   ],
   "Innererror": null
}
```

## Prevent context loss during resource scale-in events

Resource scale-in events might cause the loss of context for built-in connectors with stateful mode enabled. To prevent this potential loss before such events can happen, fix the number of instances available for your logic app resource. This way, no scale-in events can happen to cause this potential context loss.

1. On your logic app resource menu, under **Settings**, select **Scale out**.

1. Under **App Scale Out**, set **Enforce Scale Out Limit** to **Yes**, which shows the **Maximum Scale Out Limit**.

1. On the **Scale out** page, under **App Scale out**, set the number for **Always Ready Instances** to the same number as **Maximum Scale Out Limit** and **Maximum Burst**, which appears under **Plan Scale Out**, for example:

   :::image type="content" source="media/enable-stateful-affinity-built-in-connectors/scale-in-settings.png" alt-text="Screenshot shows Azure portal, Standard logic app resource, Scale out page, and Always Ready Instances number set to match Maximum Scale Out Limit and Maximum Burst.":::

1. When you're done, on the **Scale out** toolbar, select **Save**.

## Next steps

- [Connect to Azure Service Bus](connectors-create-api-servicebus.md)
- [Connect to SAP](../logic-apps/logic-apps-using-sap-connector.md)
