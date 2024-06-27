---
title: Delete a lab in the Azure Education Hub
description: Learn how to delete a lab in the Azure Education Hub by using REST APIs.
author: vinnieangel
ms.author: vangellotti
ms.service: azure-education
ms.topic: how-to 
ms.date: 1/24/2022
ms.custom: template-how-to
---

# Delete a lab in the Azure Education Hub

This article walks you through how to delete a lab in the Azure Education Hub by using REST APIs. Before you delete a lab, you must delete all students from it.

## Prerequisites

- Know your billing account ID, billing profile ID, and invoice section ID.
- Have an education-approved Azure account.
- Have a lab already created in the Education Hub.

## Delete students from a lab

To find all of the students in a lab, call the following API. Replace the text surrounded in angle brackets (`<>`) with your ID values.

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID>/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default/students?includeDeleted=false&api-version=2021-12-01-preview
```

The returned results show information about every student in the specified lab. Be sure to note down the ID of every student in the lab, because that's what you'll use to delete the students.

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
        "createdAt": "2021-12-22T17:17:07.542Z",
        "lastModifiedBy": "string",
        "lastModifiedByType": "User",
        "lastModifiedAt": "2021-12-22T17:17:07.542Z"
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
        "expirationDate": "2021-12-22T17:17:07.542Z",
        "status": "Active",
        "effectiveDate": "2021-12-22T17:17:07.542Z",
        "subscriptionAlias": "string",
        "subscriptionInviteLastSentDate": "string"
      }
    }
  ],
  "nextLink": "string"
}
```

For each student that you want to delete, call the following API. Replace `<StudentID>` with the student ID that you obtained from the last step.

```json
DELETE https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID>/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default/students/<StudentID>?api-version=2021-12-01-preview
```

The API responds that the student was deleted:

```json
student deleted
```

## Delete the lab

Now that you've deleted all of the students from a lab, you can delete the lab.

Call the following endpoint. Replace the text surrounded in angle brackets (`<>`) with your ID values.

```json
DELETE https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID>/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default?api-version=2021-12-01-preview
```

The API responds that the lab was deleted:

```json
Lab deleted
```

## Related content

- [Create a lab by using REST APIs](create-lab-education-hub.md)
- [Learn about support options](educator-service-desk.md)
