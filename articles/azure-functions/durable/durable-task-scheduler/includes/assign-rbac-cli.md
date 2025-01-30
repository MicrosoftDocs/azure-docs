---
ms.service: azure-functions
ms.topic: include
ms.date: 01/30/2025
---

### Assign Azure Role-Based Access Control (RBAC) permission to developer identity

Before running the app, give your developer identity the **Durable Task Data Contributor** role so you have permission to access Durable Task Scheduler. 

> [!NOTE]
> Learn [how identity-based connection works](../../functions-reference.md#local-development-with-identity-based-connections) during local development. 

#### Set the assignee

Get your developer credential ID:

```bash
  assignee=$(az ad user show --id "someone@microsoft.com" --query "id" --output tsv)
```

#### Set the scope 
Setting the scope on the Task Hub or Scheduler level is sufficient. 

**Task Hub**

```bash
  scope="/subscriptions/${subscription}/resourceGroups/${rg}/providers/Microsoft.DurableTask/schedulers/${scheduler}/taskHubs/${taskhub}"
```

**Scheduler**
```bash
  scope="/subscriptions/${subscription}/resourceGroups/${rg}/providers/Microsoft.DurableTask/schedulers/${scheduler}"
```

If you need to set scope on the resource group or subscription level, you can set it like the following examples:

**Resource group**

Scopes access to all schedulers in a resource group.

```bash
  scope="/subscriptions/${subscription}/resourceGroups/${rg}"
```

**Subscription**

Scopes access to all resource groups in a subscription.

```bash
  scope="/subscriptions/${subscription}"
```

#### Grant access

Run the following command to create the role assignment and grant access.

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
