---
ms.service: azure-functions
ms.topic: include
ms.date: 01/30/2025
ms.author: jiayma
ms.reviewer: azfuncdf
author: lilyjma
---

1. Set the scope. Granting access on the scheduler scope gives access to *all* task hubs in that scheduler.

   **Task Hub**

   ```bash
     scope="/subscriptions/${subscription}/resourceGroups/${rg}/providers/Microsoft.DurableTask/schedulers/${scheduler}/taskHubs/${taskhub}"
   ```
   
   **Scheduler**
   ```bash
     scope="/subscriptions/${subscription}/resourceGroups/${rg}/providers/Microsoft.DurableTask/schedulers/${scheduler}"
   ```

1. Grant access. Run the following command to create the role assignment and grant access.

   ```bash
     az role assignment create \
       --assignee "$assignee" \
       --role "Durable Task Data Contributor" \
       --scope "$scope"
   ```
   
   *Expected output*
   
   The following output example shows a developer identity assigned with the Durable Task Data Contributor role on the *scheduler* level:
   
   ```json
   {
     "condition": null,
     "conditionVersion": null,
     "createdBy": "YOUR_DEVELOPER_CREDENTIAL_ID",
     "createdOn": "2024-12-20T01:36:45.022356+00:00",
     "delegatedManagedIdentityResourceId": null,
     "description": null,
     "id": "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_DTS_NAME/providers/Microsoft.Authorization/roleAssignments/ROLE_ASSIGNMENT_ID",
     "name": "ROLE_ASSIGNMENT_ID",
     "principalId": "YOUR_DEVELOPER_CREDENTIAL_ID",
     "principalName": "YOUR_EMAIL",
     "principalType": "User",
     "resourceGroup": "YOUR_RESOURCE_GROUP",
     "roleDefinitionId": "/subscriptions/YOUR_SUBSCRIPTION/providers/Microsoft.Authorization/roleDefinitions/ROLE_DEFINITION_ID",
     "roleDefinitionName": "Durable Task Data Contributor",
     "scope": "/subscriptions/YOUR_SUBSCRIPTION/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_DTS_NAME",
     "type": "Microsoft.Authorization/roleAssignments",
     "updatedBy": "YOUR_DEVELOPER_CREDENTIAL_ID",
     "updatedOn": "2024-12-20T01:36:45.022356+00:00"
   }
   ```
