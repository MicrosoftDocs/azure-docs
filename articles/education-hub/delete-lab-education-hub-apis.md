---
title: Delete a lab in Azure Education Hub through REST APIs
description: Learn how to delete a lab in Azure Education Hub using REST APIs
author: vinnieangel
ms.author: vangellotti
ms.service: azure-education
ms.topic: how-to 
ms.date: 1/24/2022
ms.custom: template-how-to
---

# Delete a lab in Education Hub through REST APIs

This article will walk you through how to delete a lab with REST APIs that has been created in Education Hub. Note, all students must be deleted from the lab in order for the lab to be able to be deleted.

## Prerequisites

- Know billing account ID, Billing profile ID, and Invoice Section ID
- Have an Edu approved Azure account
- Have a lab already created in Education Hub

## Delete students from a lab

As mentioned previously, before you delete a lab, you must delete every student in the lab first.

To find all of the students that are in a lab, we can call the below API. Replace the text surrounded in the <>.

```json
GET https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID>/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default/students?includeDeleted=false&api-version=2021-12-01-preview
```

This will return the information about every student in the specified lab. Be sure to note down the ID of every student in the lab because that is what we will be using to delete the students.

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

After we have the student IDs, we can begin deleting students from the lab. Replace the StudentID surrounded by <> in the below API call with the student ID obtained from the last step.

```json
DELETE https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID>/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default/students/<StudentID>?api-version=2021-12-01-preview
```

The API will respond that the student has been deleted:

```json
student deleted
```

## Delete the lab

After all of the students have been deleted from a lab, we can delete the actual lab.

Call the endpoint below and make sure to replace the sections that are surrounded by <>.

```json
DELETE https://management.azure.com/providers/Microsoft.Billing/billingAccounts/<BillingAccountID>/billingProfiles/<BillingProfileID>/invoiceSections/<InvoiceSectionID>/providers/Microsoft.Education/labs/default?api-version=2021-12-01-preview
```

The API will respond that the Lab has been deleted:

```json
Lab deleted
```

## Next steps
In this article, you learned how to delete students from a lab and then delete the lab itself. Follow the tutorials below if you wish to create a new lab and read up on more documentation.

- [Create a lab using REST APIs](create-lab-education-hub.md)

- [Support options](educator-service-desk.md)