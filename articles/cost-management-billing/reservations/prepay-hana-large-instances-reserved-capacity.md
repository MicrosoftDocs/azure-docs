---
title: Save on SAP HANA Large Instances with an Azure reservation
description: Understand the things you need to know before you buy a HANA Large Instance reservation and how to make the purchase.
author: bandersmsft
ms.reviewer: nitinarora
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 12/06/2022
ms.author: banders
---

# Save on SAP HANA Large Instances with an Azure reservation

You can save on your SAP HANA Large Instances (HLI) costs when you pre-purchase Azure reservations for one or three years. The reservation discount is applied to the provisioned HLI SKU that matches the reserved instance purchased. This article helps you understand the things you need to know before you buy a reservation and how to make the purchase.

By purchasing a reservation, you commit to usage of the HLI for one or three years. The HLI reserved capacity purchase covers the compute and NFS storage that comes bundled with the SKU. The reservation doesn't include software licensing costs such as the operating system, SAP, or additional storage costs. The reservation discount automatically applies to the provisioned SAP HLI. When the reservation term ends, pay-as-you-go rates apply to your provisioned resource.

## Purchase considerations

An HLI SKU must be provisioned before going through the reserved capacity purchase. The reservation is paid for up front or with monthly payments. The following restrictions apply to HLI reserved capacity:

- Reservation discounts apply to Enterprise Agreement and Microsoft Customer Agreement subscriptions only. Other subscriptions aren't supported.
- Instance size flexibility isn't supported for HLI reserved capacity. A reservation applies only to the SKU and the region that you purchase it for.
- Self-service cancellation and exchange aren't supported.
- The reserved capacity scope is a single scope, so it applies to a single subscription and resource group. The purchased capacity can't be updated for use by another subscription.
- You can't have a shared reservation scope for HANA reserved capacity. You can't split, merge, or update reservation scope.
- You can purchase a single HLI at a time using the reserved capacity API calls. Make additional API calls to buy additional quantities.

You can purchase reserved capacity in the Azure portal or by using the [REST API](/rest/api/reserved-vm-instances/reservationorder/purchase).

## Buy a HANA Large Instance reservation

Use the following information to buy an HLI reservation with the [Reservation Order REST APIs](/rest/api/reserved-vm-instances/reservationorder/purchase).

### Get the reservation order and price

First, get the reservation order and price for the provisioned HANA large instance SKU by using the [Calculate Price](/rest/api/reserved-vm-instances/reservationorder/calculate) API.

The following example uses [armclient](https://github.com/projectkudu/ARMClient) to make REST API calls with PowerShell. Here's what the reservation order and Calculate Price API request and request body should resemble:

```azurepowershell-interactive
armclient post /providers/Microsoft.Capacity/calculatePrice?api-version=2019-04-01  "{
    'sku': {
        'name': 'SAP_HANA_On_Azure_S224om'
    },
    'location': 'eastus',
    'properties': {
        'reservedResourceType': 'SapHana',
        'billingScopeId': '/subscriptions/11111111-1111-1111-111111111111',
        'term': 'P1Y',
        'quantity': '1',
        'billingplan': 'Monthly',
        'displayName': 'testreservation_S224om',
        'appliedScopes': ['/subscriptions/11111111-1111-1111-111111111111'],
        'appliedScopeType': 'Single',
       'instanceFlexibility': 'NotSupported'
    }
}"
```

For more information about data fields and their descriptions, see [HLI reservation fields](#hli-reservation-fields).

The following example response resembles what you get returned. Note the value you returned for `quoteId`.

```
{
  "properties": {
    "currencyCode": "USD",
    "netTotal": 313219.0,
    "taxTotal": 0.0,
    "isTaxIncluded": false,
    "grandTotal": 313219.0,
    "purchaseRequest": {
      "sku": {
        "name": "SAP_HANA_On_Azure_S224om"
      },
      "location": "eastus",
      "properties": {
        "billingScopeId": "/subscriptions/11111111-1111-1111-111111111111",
        "term": "P1Y",
        "billingPlan": "Upfront",
        "quantity": 1,
        "displayName": "testreservation_S224om",
        "appliedScopes": [
          "/subscriptions/11111111-1111-1111-111111111111"
        ],
        "appliedScopeType": "Single",
        "reservedResourceType": "SapHana",
        "instanceFlexibility": "NotSupported"
      }
    },
    "quoteId": "d0fd3a890795",
    "isBillingPartnerManaged": true,
    "reservationOrderId": "22222222-2222-2222-2222-222222222222",
    "skuTitle": "SAP HANA on Azure Large Instances - S224om - US East",
    "skuDescription": "SAP HANA on Azure Large Instances, S224om",
    "pricingCurrencyTotal": {
      "currencyCode": "USD",
      "amount": 313219.0
    }
  }
}
```

### Make your purchase

Make your purchase using the returned `reservationOrderId` that you got from the preceding [Get the reservation order and price](#get-the-reservation-order-and-price) section.

Here's an example request:

```azurepowershell-interactive
armclient put /providers/Microsoft.Capacity/reservationOrders/22222222-2222-2222-2222-222222222222?api-version=2019-04-01  "{
    'sku': {
        'name': 'SAP_HANA_On_Azure_S224om'
    },
    'location': 'eastus',
    'properties': {
       'reservedResourceType': 'SapHana',
        'billingScopeId': '/subscriptions/11111111-1111-1111-111111111111',
        'term': 'P1Y',
        'quantity': '1',
               'billingplan': 'Monthly',

        'displayName': ' testreservation_S224om',
        'appliedScopes': ['/subscriptions/11111111-1111-1111-111111111111/resourcegroups/123'],
        'appliedScopeType': 'Single',
       'instanceFlexibility': 'NotSupported',
       'renew': true       
    }
}"
```

Here's an example response. If the order is placed successfully, the `provisioningState` should be `creating`.

```
{
  "id": "/providers/microsoft.capacity/reservationOrders/22222222-2222-2222-2222-222222222222",
  "type": "Microsoft.Capacity/reservationOrders",
  "name": "22222222-2222-2222-2222-222222222222",
  "etag": 1,
  "properties": {
    "displayName": "testreservation_S224om",
    "requestDateTime": "2020-07-14T05:42:34.3528353Z",
    "term": "P1Y",
    "provisioningState": "Creating",
    "reservations": [
      {
        "sku": {
          "name": "SAP_HANA_On_Azure_S224om"
        },
        "id": "/providers/microsoft.capacity/reservationOrders22222222-2222-2222-2222-222222222222/reservations/33333333-3333-3333-3333-3333333333333",
        "type": "Microsoft.Capacity/reservationOrders/reservations",
        "name": "22222222-2222-2222-2222-222222222222/33333333-3333-3333-3333-3333333333333",
        "etag": 1,
        "location": "eastus”
        "properties": {
          "appliedScopes": [
            "/subscriptions/11111111-1111-1111-111111111111/resourcegroups/123"
          ],
          "appliedScopeType": "Single",
          "quantity": 1,
          "provisioningState": "Creating",
          "displayName": " testreservation_S224om",
          "effectiveDateTime": "2020-07-14T05:42:34.3528353Z",
          "lastUpdatedDateTime": "2020-07-14T05:42:34.3528353Z",
          "reservedResourceType": "SapHana",
          "instanceFlexibility": "NotSupported",
          "skuDescription": "SAP HANA on Azure Large Instances – S224om - US East",
          "renew": true
        }
      }
    ],
    "originalQuantity": 1,
    "billingPlan": "Upfront"
  }
}
```

### Verify purchase status success

Run the Reservation order GET request to see the status of the purchase order. `provisioningState` should be `Succeeded`.

```azurepowershell-interactive
armclient get /providers/microsoft.capacity/reservationOrders/22222222-2222-2222-2222-222222222222?api-version=2018-06-01
```

The response should resemble the following example.

```
{
  "id": "/providers/microsoft.capacity/reservationOrders/44444444-4444-4444-4444-444444444444",
  "type": "Microsoft.Capacity/reservationOrders",
  "name": "22222222-2222-2222-2222-222222222222 ",
  "etag": 8,
  "properties": {
    "displayName": "testreservation_S224om",
    "requestDateTime": "2020-07-14T05:42:34.3528353Z",
    "createdDateTime": "2020-07-14T05:44:47.157579Z",
    "expiryDate": "2021-07-14",
    "term": "P1Y",
    "provisioningState": "Succeeded",
    "reservations": [
      {
        "id": "/providers/microsoft.capacity/reservationOrders/22222222-2222-2222-2222-222222222222/reservations/33333333-3333-3333-3333-3333333333333"
      }
    ],
    "originalQuantity": 1,
    "billingPlan": "Upfront"
  }
}
```

## HLI reservation fields

The following information explains the meaning of various reservation fields.

  **SKU**
  HLI SKU name. It looks like `SAP_HANA_On_Azure_<SKUname>`.

  **Location**
   Available HLI regions. See [SKUs for SAP HANA on Azure (Large Instances)](../../virtual-machines/workloads/sap/hana-available-skus.md) for available regions. To get location string format, use the [get locations API call](/rest/api/resources/subscriptions/listlocations#locationlistresult).

  **Reserved Resource type**
   `SapHana`

  **Subscription**
   The subscription used to pay for the reservation. The payment method on the subscription is charged the costs for the reservation. The subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or Microsoft Customer Agreement. The charges are deducted from the Azure Prepayment (previously called monetary commitment) balance, if available, or charged as overage.

  **Scope**
   The reservation's scope should be single scope.

  **Term**
   One year or three years. It looks like `P1Y` or `P3Y`.

  **Quantity**
   The number of instances being purchased for the reservation. The quantity to purchase is a single HLI at a time. For additional reservations, repeat the API call with corresponding fields.

## Troubleshoot errors

You might receive an error like the following example when you make a reservation purchase. The possible cause is that the HLI isn't provisioned for purchase. If so, contact your Microsoft account team to get an HLI provisioned before you try to make a reservation purchase.

```
{
  "error": {
    "code": "BadRequest",
    "message": "Capacity check or quota check failed. Please select a different subscription or 
location. You can also go to https://aka.ms/corequotaincrease to learn about quota increase."
  }
} 
```

## Next steps

- Learn about [How to call Azure REST APIs with Postman and cURL](/rest/api/azure/#how-to-call-azure-rest-apis-with-postman).
- See [SKUs for SAP HANA on Azure (Large Instances)](../../virtual-machines/workloads/sap/hana-available-skus.md) for the available SKU list and regions.
