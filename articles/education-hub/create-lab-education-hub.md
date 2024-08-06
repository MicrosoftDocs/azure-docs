---
title: Create a lab in the Azure Education Hub
description: Learn how to set up a lab in the Azure Education Hub by using REST APIs.
author: vinnieangel
ms.author: vangellotti
ms.service: azure-education
ms.topic: how-to 
ms.date: 03/11/2023
ms.custom: template-how-to
---

# Create a lab in the Azure Education Hub

This article walks you through how to create a lab and verify its creation by using REST APIs.

## Prerequisites

- Know your billing account ID, billing profile ID, and invoice section ID.
- Have an education-approved Azure account.

## Create a lab

```json
PUT https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID>/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default?api-version=2021-12-01-preview
```

Call the `create lab` API with a body similar to the following example. Include your details for the display name and how much budget you're allocating for this lab.

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

The API response returns details of the newly created lab. This response verifies that you created the lab successfully.

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

After you create a lab, you can get the details for it anytime to check metadata like when the lab was created and how much budget it has.

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID>/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default?includeBudget=true&api-version=2021-12-01-preview
```

The API response shows the details:

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

## Related content

- [Add students to a lab](add-student-api.md)
- [Manage your academic grant by using the Overview page](hub-overview-page.md)
- [Learn about support options](educator-service-desk.md)
