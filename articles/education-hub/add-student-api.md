---
title: Add a student to a lab in Azure Education Hub through REST APIs
description: Learn how to add students to labs in Azure Education Hub through REST APIs
author: vinnieangel
ms.author: vangellotti
ms.service: azure-education
ms.topic: how-to 
ms.date: 03/11/2023
ms.custom: template-how-to
---

# Add students to a lab in Education Hub using REST APIs

This article walks through how to add students to a lab.

## Prerequisites

- Know billing account ID, Billing profile ID, and Invoice Section ID
- Have an Edu approved Azure account
- Have already created a lab in Education Hub

## Add students to the lab

After a lab has been created, call the add students endpoint and make sure to replace the sections that are surrounded by <>.
The invoice section ID must be the same invoice section ID of the lab you want to add this student to.


```json
PUT https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID>/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default/students/<StudentID>?api-version=2021-12-01-preview
```

Call the API with a body similar to the following. Change the body to include details of the student you want to add to the lab.

```json
{
  "properties": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "Student",
    "budget": {
      "currency": "string",
      "value": 0
    },
    "expirationDate": "2021-12-21T23:01:41.943Z",
    "subscriptionAlias": "string",
    "subscriptionInviteLastSentDate": "string"
  }
}
```

The API response returns details of the newly added student.

```json
{
  "id": "string",
  "name": "string",
  "type": "string",
  "systemData": {
    "createdBy": "string",
    "createdByType": "User",
    "createdAt": "2021-12-21T23:02:20.163Z",
    "lastModifiedBy": "string",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2021-12-21T23:02:20.163Z"
  },
  "properties": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "Student",
    "budget": {
      "currency": "string",
      "value": 0
    },
    "subscriptionId": "string",
    "expirationDate": "2021-12-21T23:02:20.163Z",
    "status": "Active",
    "effectiveDate": "2021-12-21T23:02:20.163Z",
    "subscriptionAlias": "string",
    "subscriptionInviteLastSentDate": "string"
  }
}
```

## Check the details of the students in a lab

Calling this API allows you to see all of the students that are in the specified lab.

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default/students?includeDeleted=true&api-version=2021-12-01-preview
```

The API response includes information about the students in the lab.

```json
{
  "value": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "systemData": {
        "createdBy": "string",
        "createdByType": "User",
        "createdAt": "2021-12-21T23:15:45.430Z",
        "lastModifiedBy": "string",
        "lastModifiedByType": "User",
        "lastModifiedAt": "2021-12-21T23:15:45.430Z"
      },
      "properties": {
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "role": "Student",
        "budget": {
          "currency": "string",
          "value": 0
        },
        "subscriptionId": "string",
        "expirationDate": "2021-12-21T23:15:45.430Z",
        "status": "Active",
        "effectiveDate": "2021-12-21T23:15:45.430Z",
        "subscriptionAlias": "string",
        "subscriptionInviteLastSentDate": "string"
      }
    }
  ],
  "nextLink": "string"
}
```

## Next steps
- [Manage your Academic Grant using the Overview page](hub-overview-page.md)

- [Support options](educator-service-desk.md)
