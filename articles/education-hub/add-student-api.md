---
title: Add students to a lab in the Azure Education Hub
description: Learn how to add students to a lab in the Azure Education Hub by using REST APIs.
author: vinnieangel
ms.author: vangellotti
ms.service: azure-education
ms.topic: how-to 
ms.date: 03/11/2023
ms.custom: template-how-to
---

# Add students to a lab in the Azure Education Hub

This article walks through how to add students to a lab in the Azure Education Hub by using REST APIs.

## Prerequisites

- Know your billing account ID, billing profile ID, and invoice section ID.
- Have an education-approved Azure account.
- Have a lab already created in the Education Hub.

## Add each student to the lab

Call the `add students` endpoint. Be sure to replace the sections that are surrounded by angle brackets (`<>`). The invoice section ID must be the same invoice section ID of the lab where you want to add this student.

```json
PUT https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID>/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default/students/<StudentID>?api-version=2021-12-01-preview
```

Call the API with a body similar to the following example. Change the body to include details of the student that you want to add to the lab.

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

The API response returns details of the newly added student:

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

To see all of the students who are in the specified lab, call this API:

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default/students?includeDeleted=true&api-version=2021-12-01-preview
```

The API response includes information about the students in the lab:

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

## Related content

- [Manage your academic grant by using the Overview page](hub-overview-page.md)
- [Learn about support options](educator-service-desk.md)
