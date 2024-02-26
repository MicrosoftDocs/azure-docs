---
title: Create a lab in Azure Education Hub through REST APIs
description: Learn how to set up a lab in education hub
author: vinnieangel
ms.author: vangellotti
ms.service: azure-education
ms.topic: how-to 
ms.date: 03/11/2023
ms.custom: template-how-to
---

# Create a lab in Azure Education Hub through REST APIs.

This article walks you through how to create a lab and verify that the lab has been created.

## Prerequisites

- Know billing account ID, Billing profile ID, and Invoice Section ID
- Have an Edu approved Azure account

## Create a lab

```json
PUT https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID>/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default?api-version=2021-12-01-preview
```

Call the create lab API with the body similar to the following. Include your details for the display name and how much budget you allocate for this lab.

```json
{
  "properties": {
    "displayName": "string",
    "budgetPerStudent": {
      "currency": "string",
      "value": 0
    },
    "description": "string",
    "expirationDate": "2021-12-21T22:56:17.314Z",
    "totalBudget": {
      "currency": "string",
      "value": 0
    },
    "totalAllocatedBudget": {
      "currency": "string",
      "value": 0
    }
  }
}
```

The API response returns details of the newly created lab. Congratulations, you have created a lab in education hub.

```json
{
  "id": "string",
  "name": "string",
  "type": "string",
  "systemData": {
    "createdBy": "string",
    "createdByType": "User",
    "createdAt": "2021-12-21T22:56:17.338Z",
    "lastModifiedBy": "string",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2021-12-21T22:56:17.338Z"
  },
  "properties": {
    "displayName": "string",
    "budgetPerStudent": {
      "currency": "string",
      "value": 0
    },
    "description": "string",
    "expirationDate": "2021-12-21T22:56:17.339Z",
    "effectiveDate": "2021-12-21T22:56:17.339Z",
    "status": "Active",
    "maxStudentCount": 0,
    "invitationCode": "string",
    "totalBudget": {
      "currency": "string",
      "value": 0
    },
    "totalAllocatedBudget": {
      "currency": "string",
      "value": 0
    }
  }
}
```

## Check the details of a lab

Now that the lab has been created and a student has been added to the lab, let's get the details for the lab. Getting the lab details will provide you with meta data like when the lab was created and how much budget it has.

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID>/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default?includeBudget=true&api-version=2021-12-01-preview
```

The API response includes information about the lab and budget information.

```json
{
  "id": "string",
  "name": "string",
  "type": "string",
  "systemData": {
    "createdBy": "string",
    "createdByType": "User",
    "createdAt": "2021-12-21T23:10:10.867Z",
    "lastModifiedBy": "string",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2021-12-21T23:10:10.867Z"
  },
  "properties": {
    "displayName": "string",
    "budgetPerStudent": {
      "currency": "string",
      "value": 0
    },
    "description": "string",
    "expirationDate": "2021-12-21T23:10:10.867Z",
    "effectiveDate": "2021-12-21T23:10:10.867Z",
    "status": "Active",
    "maxStudentCount": 0,
    "invitationCode": "string",
    "totalBudget": {
      "currency": "string",
      "value": 0
    },
    "totalAllocatedBudget": {
      "currency": "string",
      "value": 0
    }
  }
}
```

## Next steps
- [Manage your Academic Grant using the Overview page](hub-overview-page.md)

- [Support options](educator-service-desk.md)
