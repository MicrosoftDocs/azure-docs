---
title: Create a lab in Azure Education Hub through REST APIs
description: Learn how to set up a lab in education hub
author: vinnieangel
ms.author: vangellotti
ms.service: azure-education
ms.topic: how-to 
ms.date: 12/21/2021
ms.custom: template-how-to
---

<!-- 1. H1
Required. Start your H1 with a verb. Pick an H1 that clearly conveys the task the 
user will complete.
-->

# Create a lab in Azure Education Hub through REST APIs.

This article will walk you through how to create a lab, add students to that lab and verify that the lab has been created.

## Prerequisites

- Know billing account ID, Billing profile ID, and Invoice Section ID
- Have an Edu approved Azure account

## Create a lab

```json
PUT https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID>/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default?api-version=2021-12-01-preview
```

Call the above API with the body similar to the one below. Include your details for what the display name will be and how much budget you will allocate for this lab.

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

## Add students to the lab

Now that the lab has been successfully created, you can begin to add students to the lab.

Call the endpoint below and make sure to replace the sections that are surrounded by <>.

```json
PUT https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID>/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default/students/<StudentID>?api-version=2021-12-01-preview
```

Call the above API with a body similar to the one below. Change the body to include details of the student you want to add to the lab.

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

## Check the details of a lab

Now that the lab has been created and a student has been added to the lab, let's get the details for the lab. Getting the lab details will provide you with meta data like when the lab was created and how much budget it has. It will not include information about students in the lab.

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID>/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default?includeBudget=true&api-version=2021-12-01-preview
```

The API response will include information about the lab and budget information (if the include budget flag is set to true)

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

## Check the details of the students in a lab

Calling this API will allow us to see all of the students that are in the specified lab.

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default/students?includeDeleted=true&api-version=2021-12-01-preview
```

The API response will include information about the students in the lab and will even show student that have been deleted from the lab (if the includeDeleted flag is set to true)

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
