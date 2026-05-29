---
title: Authenticate Connections with Managed Identities
description: Secure workflow connections to protected Azure resources by using a managed identity in Azure Logic Apps. Avoid managing credentials, secrets, or tokens.
services: azure-logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.date: 03/18/2026
ms.date-cycle: 365 days
ms.custom:
  - subject-rbac-steps
  - devx-track-arm-template
  - sfi-image-nochange
# Customer intent: As an integration developer who works with Azure Logic Apps, I want to authenticate connections in my workflows by using a managed identity so I can avoid managing credentials or secrets.
---

# Authenticate workflow connections to protected Azure resources by using managed identities in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

Set up a *managed identity* when you want to authenticate connections from logic app workflows to Microsoft Entra-protected Azure resources. This identity accesses protected resources on your logic app's behalf and removes the need to store and manage credentials, secrets, or access tokens. Due to this behavior, a managed identity is recommended for authentication. Azure manages this identity to help keep your authentication details secure.

In Azure Logic Apps, many connectors support both managed identity types:

- *System-assigned* identity
- *User-assigned* identity

This guide shows how to complete the following tasks:

- Set up the system-assigned identity on your logic app resource.
- Create and set up a user-assigned identity on your logic app resource.

This guide provides steps for the Azure portal and Azure Resource Manager template (ARM template). For Azure PowerShell, Azure CLI, and Azure REST API, see:

| Tool | Documentation |
|------|---------------|
| Azure PowerShell | - [System-assigned](/powershell/azure/authenticate-noninteractive#system-assigned-managed-identity) <br>- [User-assigned](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-powershell) |
| Azure CLI | - [System-assigned](/cli/azure/identity) <br>- [User-assigned](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azcli) |
| Azure REST API | - [System-assigned](/rest/api/managedidentity/system-assigned-identities) <br>- [User-assigned](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-rest) |

For more information, see:

- [What are managed identities](/entra/identity/managed-identities-azure-resources/overview)
- [Managed identity types](/entra/identity/managed-identities-azure-resources/overview#managed-identity-types)
- [Connectors that support managed identities](#triggers-actions-managed-identity)
- [Azure resources that support managed identities](/entra/identity/managed-identities-azure-resources/managed-identities-status)

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

  You must use the same Azure subscription for your logic app resource, managed identity, and target Azure resource that you want to access.

- The logic app resource and workflow where you want to use the managed identity.

  For more information, see:

  - [Create a Consumption logic app workflow](quickstart-create-example-consumption-workflow.md)
  - [Create a Standard logic app workflow](create-single-tenant-workflows-azure-portal.md)

- The target Azure resource that you want to access.

- [Microsoft Entra administrator permissions](/entra/identity/role-based-access-control/permissions-reference).

  Later in this guide, you must assign an Azure role to the managed identity with the required access on the target resource. For this task, you need permissions that let you assign Azure roles to identities in a Microsoft Entra tenant.

## Considerations for using managed identities

Before you set up and use a managed identity with a logic app, review the following considerations:

- Your logic app resource has only one unique system-assigned identity.

    By default, Standard logic apps automatically enable the system-assigned identity.

- Your logic app resource can have the system-assigned identity and one or more user-assigned identities enabled at the same time.

  - Your logic app can use *either* the system-assigned or a user-assigned identity, but not both at the same time.

  - Your logic app can use only one user-assigned identity at a time.

- Your logic app resource can share the same user-assigned identity across other logic app resources.

- You can use a managed identity at the logic app resource level and connection level.

- For Standard logic apps, the hybrid deployment option doesn't support managed identity authentication. Instead, you need to [create and use an app registration instead](create-standard-workflows-hybrid-deployment.md).

For more information, see:

- [Limits on managed identities for logic apps](logic-apps-limits-and-config.md#managed-identity)
- [Resource environment differences](logic-apps-overview.md#resource-environment-differences)

<a name="triggers-actions-managed-identity"></a>
<a name="managed-connectors-managed-identity"></a>

## Connectors that support managed identities

For built-in and managed connector operations in Azure Logic Apps to support managed identity authentication, they must support OAuth with Microsoft Entra.

The following tables show sample connectors that support managed identity authentication, based on the logic app type.

### [Consumption](#tab/consumption)

| Connector type | Supported connectors |
|----------------|----------------------|
| Built-in | - Azure API Management <br>- Azure App Services <br>- Azure Functions <br>- HTTP <br>- HTTP + Webhook <br><br>**Note**: HTTP operations can authenticate connections to Azure Storage accounts behind Azure firewalls by using the system-assigned identity. However, HTTP operations don't support the user-assigned identity for authenticating the same connections. |
| Managed | - Azure App Service <br>- Azure Automation <br>- Azure Blob Storage <br>- Azure Container Instance <br>- Azure Cosmos DB <br>- Azure Data Explorer <br>- Azure Data Factory <br>- Azure Data Lake <br>- Azure Digital Twins <br>- Azure Event Grid <br>- Azure Event Hubs <br>- Azure IoT Central V2 <br>- Azure Key Vault <br>-Azure Monitor Logs <br>- Azure Queues <br>- Azure Resource Manager <br>- Azure Service Bus <br>- Microsoft Sentinel <br>- Azure Table Storage <br>- Azure VM <br>- SQL Server |

### [Standard](#tab/standard)

| Connector type | Supported connectors |
|----------------|----------------------|
| Built-in | - Azure Automation <br>- Azure Blob Storage <br>- Azure Event Hubs <br>- Azure Service Bus <br>- Azure Queues <br>- Azure Tables <br>- HTTP <br>- HTTP + Webhook <br>- SQL Server <br><br>**Note**: Except for the SQL Server and HTTP connectors, most [built-in, service provider-based connectors](/azure/logic-apps/connectors/built-in/reference/) currently don't support selecting user-assigned identities for authentication. Instead, you must use the system-assigned identity. HTTP operations can authenticate connections to Azure Storage accounts behind Azure firewalls by using the system-assigned identity. |
| Managed | - Azure App Service <br>- Azure Automation <br>- Azure Blob Storage <br>- Azure Container Instance <br>- Azure Cosmos DB <br>- Azure Data Explorer <br>- Azure Data Factory <br>- Azure Data Lake <br>- Azure Digital Twins <br>- Azure Event Grid <br>- Azure Event Hubs <br>- Azure IoT Central V2 <br>- Azure Key Vault <br>- Azure Monitor Logs <br>- Azure Queues <br>- Azure Resource Manager <br>- Azure Service Bus <br>- Azure Table Storage <br>- Azure VM <br>- Microsoft Sentinel <br>- SQL Server |

---

 For a more complete list, see:

- [Authentication types for triggers and actions that support authentication](logic-apps-securing-a-logic-app.md#authentication-types-supported-triggers-actions)
- [Azure services that support managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/managed-identities-status)

<a name="system-assigned-azure-portal"></a>
<a name="azure-portal-system-logic-app"></a>

## Enable system-assigned identity (portal)

Based on your logic app type, follow the corresponding steps for the Azure portal:

### [Consumption](#tab/consumption)

On a Consumption logic app resource, manually enable the system-assigned identity.

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource.

1. On the logic app sidebar, under **Settings**, select **Identity**.

1. On the **Identity** page, under **System assigned**, select **On**, and then select **Save**. To confirm, select **Yes**.

   :::image type="content" source="media/authenticate-with-managed-identity/enable-system-assigned-identity-consumption.png" alt-text="Screenshot that shows the Azure portal, Consumption logic app, Identity page, and System assigned tab with selected options, On and Save." lightbox="media/authenticate-with-managed-identity/enable-system-assigned-identity-consumption.png":::

   Your logic app resource can now use the system-assigned identity. This identity is registered with Microsoft Entra ID and is represented by an object ID.

   :::image type="content" source="media/authenticate-with-managed-identity/object-id-system-assigned-identity.png" alt-text="Screenshot shows that shows the Consumption logic app Identity page and object ID for the system-assigned identity." lightbox="media/authenticate-with-managed-identity/object-id-system-assigned-identity.png":::

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Object (principal) ID** | <*identity-resource-ID*> | A Globally Unique Identifier (GUID) that represents the system-assigned identity for your logic app in a Microsoft Entra tenant. |

1. [Give the identity access to the protected resource](#access-other-resources).

### [Standard](#tab/standard)

On a Standard logic app resource, the system-assigned identity is automatically enabled. If you need to enable the identity, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app sidebar, under **Settings**, select **Identity**.

1. On the **Identity** page, under **System assigned**, select **On**, and then select **Save**. To confirm, select **Yes**.

   :::image type="content" source="media/authenticate-with-managed-identity/enable-system-assigned-identity-standard.png" alt-text="Screenshot that shows the Azure portal, Standard logic app, Identity page, and System assigned tab with selected options for On and Save." lightbox="media/authenticate-with-managed-identity/enable-system-assigned-identity-standard.png":::

   Your logic app resource can now use the system-assigned identity. This identity is registered with Microsoft Entra ID and is represented by an object ID.

   :::image type="content" source="media/authenticate-with-managed-identity/object-id-system-assigned-identity.png" alt-text="Screenshot shows that shows the Standard logic app Identity page and object ID for the system-assigned identity." lightbox="media/authenticate-with-managed-identity/object-id-system-assigned-identity.png":::

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Object (principal) ID** | <*identity-resource-ID*> | A Globally Unique Identifier (GUID) that represents the system-assigned identity for your logic app in a Microsoft Entra tenant. |

1. [Give the identity access to the protected resource](#access-other-resources).

---

<a name="system-assigned-template"></a>
<a name="template-system-logic-app"></a>

## Enable system-assigned identity (ARM template)

To automate creating and deploying logic app resources, use an [ARM template](logic-apps-azure-resource-manager-templates-overview.md).

In your template, at the root level, your logic app resource definition requires an `identity` object with the `type` property set to `SystemAssigned`, for example:

### [Consumption](#tab/consumption)

```json
{
   "apiVersion": "2016-06-01",
   "type": "Microsoft.logic/workflows",
   "name": "[variables('logicappName')]",
   "location": "[resourceGroup().location]",
   "identity": {
      "type": "SystemAssigned"
   },
   "properties": {},
   <...>
}
```

### [Standard](#tab/standard)

```json
{
   "apiVersion": "2021-01-15",
   "type": "Microsoft.Web/sites",
   "name": "[variables('sites_<logic-app-resource-name>_name')]",
   "location": "[resourceGroup().location]",
   "kind": "functionapp,workflowapp",
   "identity": {
      "type": "SystemAssigned"
   },
   "properties": {},
   <...>
}
```

---

When Azure creates your logic app resource definition, the `identity` object gets the following `principalId` and `tenantId` properties:

```json
"identity": {
   "type": "SystemAssigned",
   "principalId": "<principal-ID>",
   "tenantId": "<Entra-tenant-ID>"
}
```

| Property (JSON) | Value | Description |
|-----------------|-------|-------------|
| `principalId` | <*principal-ID*> | The Globally Unique Identifier (GUID) that Microsoft Entra uses to manage the service principal object for your managed identity in the Microsoft Entra tenant. This GUID sometimes appears as an "object ID" or `objectID`. |
| `tenantId` | <*Microsoft-Entra-tenant-ID*> | The Globally Unique Identifier (GUID) that represents the Microsoft Entra tenant where the logic app is now a member. Inside the Microsoft Entra tenant, the service principal has the same name as the logic app instance. |

<a name="azure-portal-user-identity"></a>
<a name="user-assigned-azure-portal"></a>

## Create user-assigned identity (portal)

You need to create the identity as a separate Azure resource before you can enable the user-assigned identity on a Consumption or Standard logic app resource.

1. In the [Azure portal](https://portal.azure.com) search box, enter `managed identities`. From the results list, select **Managed Identities**.

   :::image type="content" source="media/authenticate-with-managed-identity/find-select-managed-identities.png" alt-text="Screenshot shows Azure portal with selected option named Managed Identities." lightbox="media/authenticate-with-managed-identity/find-select-managed-identities.png":::

1. On the **Managed Identities** page toolbar, select **Create**.

1. Enter the managed identity information, for example:

   :::image type="content" source="media/authenticate-with-managed-identity/create-user-assigned-identity.png" alt-text="Screenshot shows page named Create User Assigned Managed Identity, with managed identity details." lightbox="media/authenticate-with-managed-identity/create-user-assigned-identity.png":::

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | The Azure subscription name. |
   | **Resource group** | Yes | <*Azure-resource-group-name*> | The Azure resource group name. Create a new group, or select an existing group. This example creates a new group named `fabrikam-managed-identities-RG`. |
   | **Region** | Yes | <*Azure-region*> | The Azure region where to store information about your resource. This example uses `West US`. |
   | **Name** | Yes | <*user-assigned-identity-name*> | The name to give your user-assigned identity. This example uses `Fabrikam-user-assigned-identity`. |
   | **Isolation Scope** | No | - **None** (default) <br>- **Region** | The effective scope for the managed identity. |

1. When you finish, select **Review + create**.

   After Azure validates the information, Azure creates your managed identity. Now you can add the user-assigned identity to your logic app resource.

<a id="add-user-identity-portal"></a>

## Add user-assigned identity to logic app (portal)

After you create the user-assigned identity, add the identity to your Consumption or Standard logic app resource.

### [Consumption](#tab/consumption)

1. In the Azure portal, open your Consumption logic app resource.

1. On the logic app sidebar, under **Settings**, select **Identity**.

1. On the **Identity** page, select **User assigned**, and then select **Add**.

   :::image type="content" source="media/authenticate-with-managed-identity/add-user-assigned-identity-logic-app-consumption.png" alt-text="Screenshot that shows a Consumption logic app and Identity page with selected option for Add." lightbox="media/authenticate-with-managed-identity/add-user-assigned-identity-logic-app-consumption.png":::

1. On the **Add user assigned managed identity** pane, follow these steps:

   1. From the **Select a subscription** list, select your Azure subscription.

   1. From the managed identities list, select the user-assigned identity you want.
      
      To filter the list, in the **User assigned managed identities** search box, enter the name for the identity or resource group, for example:

      :::image type="content" source="media/authenticate-with-managed-identity/select-user-assigned-identity.png" alt-text="Screenshot that shows a Consumption logic app and selected user-assigned identity." lightbox="media/authenticate-with-managed-identity/select-user-assigned-identity.png":::

   1. When you finish, select **Add**.

   Your logic app is now associated with the user-assigned identity.

   :::image type="content" source="media/authenticate-with-managed-identity/added-user-assigned-identity-consumption.png" alt-text="Screenshot shows a Consumption logic app with associated user-assigned identity." lightbox="media/authenticate-with-managed-identity/added-user-assigned-identity-consumption.png":::

1. [Give the identity access to the protected resource](#access-other-resources).

### [Standard](#tab/standard)

1. In the Azure portal, open your Standard logic app resource.

1. On the logic app sidebar, under **Settings**, select **Identity**.

1. On the **Identity** page, select **User assigned**, and then select **Add**.

   :::image type="content" source="media/authenticate-with-managed-identity/add-user-assigned-identity-logic-app-standard.png" alt-text="Screenshot shows a Standard logic app and Identity page with selected option for Add." lightbox="media/authenticate-with-managed-identity/add-user-assigned-identity-logic-app-standard.png":::

1. On the **Add user assigned managed identity** pane, follow these steps:

   1. From the **Select a subscription** list, select your Azure subscription.

   1. From the managed identity list, select the user-assigned identity you want.
   
      To filter the list, in the **User assigned managed identities** search box, enter the name for the identity or resource group, for example:

      :::image type="content" source="media/authenticate-with-managed-identity/select-user-assigned-identity.png" alt-text="Screenshot shows Standard logic app and selected user-assigned identity." lightbox="media/authenticate-with-managed-identity/select-user-assigned-identity.png":::

   1. When you finish, select **Add**.

      Your logic app is now associated with the user-assigned identity.

      :::image type="content" source="media/authenticate-with-managed-identity/added-user-assigned-identity-standard.png" alt-text="Screenshot shows Standard logic app and associated user-assigned identity." lightbox="media/authenticate-with-managed-identity/added-user-assigned-identity-standard.png":::

   1. To add another user-assigned identity, repeat these steps.

1. [Give the identity access to the protected resource](#access-other-resources).

---

<a name="template-user-identity"></a>

## Create user-assigned identity (ARM template)

To automate creating and deploying logic app resources, use an [ARM template](logic-apps-azure-resource-manager-templates-overview.md). These templates support [user-assigned identities for authentication](/azure/templates/microsoft.managedidentity/userassignedidentities?pivots=deployment-language-arm-template).

In your template's `resources` section, your logic app resource definition requires the following items:

- An `identity` object with the `type` property set to `UserAssigned`.
- A child `userAssignedIdentities` object that specifies the user-assigned resource and name.

### [Consumption](#tab/consumption)

The following example shows a Consumption logic app resource and workflow definition for an HTTP `PUT` request with a nonparameterized `identity` object. The response to the `PUT` request and subsequent `GET` operation also includes this `identity` object.

A Consumption logic app resource can enable and have both the system-assigned identity and multiple user-assigned identities defined.

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {<template-parameters>},
   "resources": [
      {
         "apiVersion": "2016-06-01",
         "type": "Microsoft.logic/workflows",
         "name": "[variables('logicappName')]",
         "location": "[resourceGroup().location]",
         "identity": {
            "type": "UserAssigned",
            "userAssignedIdentities": {
               "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group-name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<user-assigned-identity-name>": {}
            }
         },
         "properties": {
            "definition": {<logic-app-workflow-definition>}
         },
         "parameters": {},
         "dependsOn": []
      },
   ],
   "outputs": {}
}
```

If your template includes the managed identity's resource definition, you can parameterize the `identity` object. The following example shows how the `userAssignedIdentities` child object references a `userAssignedIdentityName` variable that you define in your template's `variables` section. This variable references the resource ID for your user-assigned identity.

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {
      "Template_LogicAppName": {
         "type": "string"
      },
      "Template_UserAssignedIdentityName": {
         "type": "securestring"
      }
   },
   "variables": {
      "logicAppName": "[parameters('Template_LogicAppName')]",
      "userAssignedIdentityName": "[parameters('Template_UserAssignedIdentityName')]"
   },
   "resources": [
      {
         "apiVersion": "2016-06-01",
         "type": "Microsoft.logic/workflows",
         "name": "[variables('logicAppName')]",
         "location": "[resourceGroup().location]",
         "identity": {
            "type": "UserAssigned",
            "userAssignedIdentities": {
               "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities/', variables('userAssignedIdentityName'))]": {}
            }
         },
         "properties": {
            "definition": {<logic-app-workflow-definition>}
         },
         "parameters": {},
         "dependsOn": [
            "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities/', variables('userAssignedIdentityName'))]"
         ]
      },
      {
         "apiVersion": "2018-11-30",
         "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
         "name": "[parameters('Template_UserAssignedIdentityName')]",
         "location": "[resourceGroup().location]",
         "properties": {}
      }
  ]
}
```

### [Standard](#tab/standard)

The following example shows a Standard logic app resource and workflow definition for an HTTP `PUT` request with a nonparameterized `identity` object. The response to the `PUT` request and subsequent `GET` operation also includes this `identity` object.

A Standard logic app resource can enable and have both the system-assigned identity and multiple user-assigned identities defined. The Standard logic app resource definition is based on the Azure Functions function app resource definition.

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2019-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {<template-parameters>},
   "resources": [
      {
         "apiVersion": "2021-02-01",
         "type": "Microsoft.Web/sites/functions",
         "name": "[variables('logicappName')]",
         "location": "[resourceGroup().location]",
         "identity": {
            "type": "UserAssigned",
            "userAssignedIdentities": {
               "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group-name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<user-assigned-identity-name>": {}
            },
         },
         "properties": {
            "name": "[variables('appName')]",
            "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
            "hostingEnvironment": "",
            "clientAffinityEnabled": false,
            "alwaysOn": true
         },
         "parameters": {},
         "dependsOn": []
      }
   ],
   "outputs": {}
}
```

If your template includes the managed identity's resource definition, you can parameterize the `identity` object. The following example shows how the `userAssignedIdentities` child object references a `userAssignedIdentityName` variable that you define in your template's `variables` section. This variable references the resource ID for your user-assigned identity.

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2019-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {<template-parameters>},
   "resources": [
      {
         "apiVersion": "2021-02-01",
         "type": "Microsoft.Web/sites/functions",
         "name": "[variables('logicappName')]",
         "location": "[resourceGroup().location]",
         "identity": {
            "type": "UserAssigned",
            "userAssignedIdentities": {
               "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', variables('userAssignedIdentityName'))]": {}
            }
         },
         "properties": {
            "name": "[variables('appName')]",
            "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
            "hostingEnvironment": "",
            "clientAffinityEnabled": false,
            "alwaysOn": true
         },
         "parameters": {},
         "dependsOn": [
            "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
            "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities/', variables('userAssignedIdentityName'))]"
         ]
      },
      {
         "apiVersion": "2018-11-30",
         "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
         "name": "[parameters('Template_UserAssignedIdentityName')]",
         "location": "[resourceGroup().location]",
         "properties": {}
      },
   ],
   "outputs": {}
}
```

---

When the template creates your logic app resource definition, the `identity` object includes the following `principalId` and `clientId` properties:

```json
"identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
        "<resource-ID>": {
            "principalId": "<principal-ID>",
            "clientId": "<client-ID>"
        }
    }
}
```

| Property (JSON) | Value | Description |
|-----------------|-------|-------------|
| `principalId` | <*principal-ID*> | The Globally Unique Identifier (GUID) that Microsoft Entra uses to administrate the service principal object for your managed identity in the Microsoft Entra tenant. This GUID sometimes appears as an "object ID" or `objectID`. In the Microsoft Entra tenant, the service principal has the same name as the logic app instance. |
| `clientId` | <*client-ID*> | The Globally Unique Identifier (GUID) that represents the logic app's identity and specifies the identity to use during runtime calls. |

For more information about Azure Resource Manager templates and managed identities for Azure Functions, see  [ARM template - Azure Functions](../azure-functions/functions-create-first-function-resource-manager.md#review-the-template).

<a name="access-other-resources"></a>

## Give resource access to an identity

Before you can use the managed identity for authentication, you need to grant the identity access to the target protected Azure resource. The way that you set up access might differ based on the target resource, for example:

- Azure role-based access control (RBAC)

  Some Azure resources, such as storage accounts, require that you use RBAC to assign a role on the target resource with the necessary permissions for your identity.

  For example, to give a managed identity access to a Blob storage account in Azure, you need to assign the necessary Azure role on the storage account resource to your identity.

  This section shows how to assign a role by using the [Azure portal](#azure-portal-assign-role) and [Azure Resource Manager template (ARM template)](../role-based-access-control/role-assignments-template.md).
  
  For Azure PowerShell, Azure CLI, and Azure REST API, see:

  | Tool | Documentation |
  |------|---------------|
  | Azure PowerShell | [Add role assignment](/entra/identity/managed-identities-azure-resources/how-to-assign-app-role-managed-identity-powershell) |
  | Azure CLI | [Add role assignment](/entra/identity/managed-identities-azure-resources/how-to-assign-app-role-managed-identity-cli) |
  | Azure REST API | [Add role assignment](../role-based-access-control/role-assignments-rest.md) |

- Access policy

  Other Azure resources, such as key vaults, also let you create an access policy on the target resource with the necessary permissions for your identity.

  For example, you can create an access policy on the key vault resource to assign the necessary permissions for your managed identity.
  
  This section shows how to create an access policy by using the [Azure portal](#azure-portal-access-policy). 
  
  For Resource Manager templates, Azure PowerShell, and Azure CLI, see:

  | Tool | Documentation |
  |------|---------------|
  | Azure Resource Manager template (ARM template) | [Key Vault access policy resource definition](/azure/templates/microsoft.keyvault/vaults) |
  | Azure PowerShell | [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy?tabs=azure-powershell) |
  | Azure CLI | [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy?tabs=azure-cli) |

#### Managed identity access to higher-level resources

If a managed identity has access to a resource in the same subscription, the identity can access only that resource, not other resources in that resource's parent hierarchy. In the workflow designer, some triggers and actions require you to first select a subscription or resource group before you can select the target resource. If the identity lacks access to these higher-level resources, the designer doesn't show the target resource.

To fix this problem, give the identity access to each higher-level resource that you must first select.

In other cases, the identity also needs access to the resource where you enabled the identity. For example, suppose you have a workflow action that updates the application settings on the workflow's parent logic app. If the action uses a managed identity to access these settings, give the identity access to that parent logic app.

<a name="azure-portal-assign-role"></a>

### Assign role-based access to a managed identity (portal)

For Azure resources that require you to assign a role for your managed identity, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open the resource where the identity needs access.

   This example uses a storage account as the target Azure resource.

1. On the resource sidebar, select **Access control (IAM)**.

1. On the **Access control (IAM)** page toolbar, select **Add** > **Add role assignment**.

   > [!NOTE]
   >
   > If you can't select **Add role assignment**, you don't have the permissions to assign roles. You need [Microsoft Entra administrator permissions](/entra/identity/role-based-access-control/permissions-reference) so you can assign roles to managed identities.

1. To assign the required role to your managed identity, follow these steps:

   1. On the **Role** tab, find and select the [Microsoft Entra built-in role](/entra/identity/role-based-access-control/permissions-reference) that gives your identity the required access to the current resource, and then select **Next**.

      This example selects the role named **Storage Blob Data Contributor**. This role gives write access to blob content in an Azure storage container.
      
      For more information, see [Roles that access blob content in an Azure storage container](../storage/blobs/authorize-access-azure-active-directory.md#assign-azure-roles-for-access-rights).

   1. On the **Members** tab, follow these steps to select the managed identity:
   
      1. For **Assign access to**, select **Managed identity**.

      1. For **Add members**, select **+ Select members**.
      
      1. On the **Select managed identities** pane, select your Azure subscription.
      
      1. Based on your managed identity, select the **Managed identity** type, and then select your managed identity.

         | Managed identity type | Description |
         |-----------------------|-------------|
         | **User-assigned managed identity** | View and select an enabled user-assigned managed identity on any Azure resource. |
         | **All system-assigned managed identities** | View and select an enabled system-assigned managed identity on any Azure resource. |
         | **Logic app** | View and select an enabled managed identity on logic app resources only. |

      1. When you finish, select **Select**.

   For more information, see:

   - [Assign Azure roles to managed identities](/azure/role-based-access-control/role-assignments-portal-managed-identity)
   - [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)
   - [Assign a managed identity access to an Azure resource or another resource](/entra/identity/managed-identities-azure-resources/how-to-assign-access-azure-resource)

1. [Authenticate your trigger or action by using the managed identity](#authenticate-access-with-identity).

<a name="azure-portal-access-policy"></a>

### Create an access policy in the Azure portal

For Azure resources where you want to create an access policy for your managed identity, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open the resource where the identity needs access.

   This example uses a key vault as the target Azure resource.

1. On the resource sidebar, select **Access policies**.

   > [!NOTE]
   >
   > If the resource doesn't have the **Access policies** option, [assign a role instead](#azure-portal-assign-role).

1. On the page toolbar, select **Create** to open the **Create an access policy** pane.

   :::image type="content" source="media/authenticate-with-managed-identity/create-access-policy.png" alt-text="Screenshot shows the Azure portal and a key vault example with opened pane named Create an access policy." lightbox="media/authenticate-with-managed-identity/create-access-policy.png":::

1. On the **Permissions** tab, select the permissions that the identity needs for access to the target resource.

   For example, to use the identity with the Azure Key Vault managed connector's **List secrets** action, the identity needs **List** permissions. So, in this scenario, in the **Secret permissions** column, select **List**.

   :::image type="content" source="media/authenticate-with-managed-identity/select-access-policy-permissions.png" alt-text="Screenshot shows the Permissions tab with selected List permissions." lightbox="media/authenticate-with-managed-identity/select-access-policy-permissions.png":::

1. When you finish, select **Next**.

1. On the **Principal** tab, select the managed identity.

   This example selects a user-assigned identity.

1. Skip the optional **Application** step, select **Next**, and finish creating the access policy.

1. [Authenticate your trigger or action by using the managed identity](#authenticate-access-with-identity).

<a name="authenticate-access-with-identity"></a>

## Authenticate access by using the managed identity

This section shows how to use a managed identity to authenticate access for a workflow [trigger or action that supports managed identity authentication](#triggers-actions-managed-identity). The example continues from where you set up access for a managed identity by using RBAC and an Azure storage account. Though your target Azure resource might differ, the general steps are mostly similar.

> [!IMPORTANT]
>
> If you have an Azure function where you want to use the system-assigned identity, 
> first [enable authentication for Azure Functions](call-azure-functions-from-workflows.md#enable-authentication-functions).

The following steps show how to use the managed identity by using the Azure portal. To use the managed identity in the underlying JSON definition by using the code editor, see [Managed identity authentication](logic-apps-securing-a-logic-app.md#managed-identity-authentication).

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource.

1. Add the [trigger or action that supports managed identities](#triggers-actions-managed-identity), if you haven't already.

1. On the trigger or action, follow these steps:

   - **Built-in operations**

     These steps use the **HTTP** action as an example.

     1. From the **Advanced parameters** list, select the **Authentication** parameter.

        :::image type="content" source="media/authenticate-with-managed-identity/built-in-authentication.png" alt-text="Screenshot shows a Consumption workflow with built-in HTTP action and opened list named Advanced parameters, with selected option for Authentication." lightbox="media/authenticate-with-managed-identity/built-in-authentication.png":::

        Both the **Authentication** parameter and the **Authentication type** list appear, for example:

        :::image type="content" source="media/authenticate-with-managed-identity/authentication-parameter.png" alt-text="Screenshot shows the Advanced parameters section with Authentication property and Authentication type list." lightbox="media/authenticate-with-managed-identity/authentication-parameter.png":::

     1. From the **Authentication type** list, select **Managed identity**.

        :::image type="content" source="media/authenticate-with-managed-identity/built-in-managed-identity.png" alt-text="Screenshot shows a workflow with a built-in action, opened Authentication type list, and selected option for Managed identity." lightbox="media/authenticate-with-managed-identity/built-in-managed-identity.png":::

        The **Authentication** section now shows the following options:

        | Parameter | Description |
        |-----------|-------------|
        | **Managed identity** | The managed identity to use. |
        | **Audience** | Appears on specific triggers and actions so you can set the resource ID for the Azure target resource or service. <br><br>By default, the **Audience** parameter uses the `https://management.azure.com/` resource ID, which is the resource ID for Azure Resource Manager. |

     1. From the **Managed identity** list, select the identity you want, for example:

        :::image type="content" source="media/authenticate-with-managed-identity/select-specific-managed-identity.png" alt-text="Screenshot shows Authentication section with Authentication Type list and Audience property." lightbox="media/authenticate-with-managed-identity/select-specific-managed-identity.png":::

        > [!NOTE]
        >
        > By default, **System-assigned managed identity** is the selected option, even when you don't enable any managed identities. However, to successfully use the managed identity, you must first enable that identity on your logic app. Consumption logic apps don't automatically enable the system identity unlike Standard logic apps.

     For more information, see [Example: Authenticate built-in trigger or action with a managed identity](#authenticate-built-in-managed-identity).

   - **Managed connector operations**

     1. On the **Create connection** pane, from the **Authentication** list, select **Managed identity**, for example:

        :::image type="content" source="media/authenticate-with-managed-identity/select-managed-identity-resource-manager.png" alt-text="Screenshot shows Consumption workflow with Azure Resource Manager action and selected option for Managed Identity." lightbox="media/authenticate-with-managed-identity/select-managed-identity-resource-manager.png":::

     1. On the next pane, for **Connection Name**, enter a name to use for the connection.

     1. Based on your connector, choose one of the following options:

        - **Single-authentication**: These connectors support only one authentication type, which is the managed identity in this case.

          The following steps use an **Azure Resource** action as an example:

          1. From the **Managed Identity** list, select the currently enabled managed identity.

          1. Select **Create new**.

        - **Multi-authentication**: These connectors support multiple authentication types, but you can select and use only one type at a time.

          The following steps use an **Azure Blob Storage** action as an example:

          1. From the **Authentication Type** list, select **Logic Apps Managed Identity**.

             :::image type="content" source="media/authenticate-with-managed-identity/multi-identity.png" alt-text="Screenshot shows Consumption workflow, connection creation box, and selected option for Logic Apps Managed Identity." lightbox="media/authenticate-with-managed-identity/multi-identity.png":::

          1. Select **Create new**.

          For more information, see [Example: Authenticate managed connector trigger or action with a managed identity](#authenticate-managed-connector-managed-identity).

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. Add the [trigger or action that supports managed identities](#triggers-actions-managed-identity), if you haven't already.

1. On the trigger or action, follow these steps:

   - **Built-in operations**

     These steps use the **HTTP** action as an example.

     1. From the **Advanced parameters** list, select the **Authentication** parameter.

        :::image type="content" source="media/authenticate-with-managed-identity/built-in-authentication.png" alt-text="Screenshot shows Standard workflow, example built-in action, opened list named Advanced parameters, and selected option for Authentication." lightbox="media/authenticate-with-managed-identity/built-in-authentication.png":::

        Both the **Authentication** parameter and the **Authentication type** list appear on the action, for example:

        :::image type="content" source="media/authenticate-with-managed-identity/authentication-parameter.png" alt-text="Screenshot shows the Advanced parameters section with added Authentication property and Authentication Type list." lightbox="media/authenticate-with-managed-identity/authentication-parameter.png":::

     1. From the **Authentication type** list, select **Managed identity**.

        :::image type="content" source="media/authenticate-with-managed-identity/built-in-managed-identity.png" alt-text="Screenshot shows Standard workflow, example built-in action, opened Authentication type list, and selected option for Managed identity." lightbox="media/authenticate-with-managed-identity/built-in-managed-identity.png":::

        The **Authentication** section now shows the following options:

        | Parameter | Description |
        |-----------|-------------|
        | **Managed identity** | The managed identity to use. |
        | **Audience** | Appears on specific triggers and actions so you can set the resource ID for the Azure target resource or service. <br><br>By default, the **Audience** parameter uses the `https://management.azure.com/` resource ID, which is the resource ID for Azure Resource Manager. |
       
        :::image type="content" source="media/authenticate-with-managed-identity/select-specific-managed-identity.png" alt-text="Screenshot shows Authentication section with Authentication type list and Audience property." lightbox="media/authenticate-with-managed-identity/select-specific-managed-identity.png":::

     1. From the **Managed identity** list, select the identity you want, for example:

        :::image type="content" source="media/authenticate-with-managed-identity/built-in-select-identity-standard.png" alt-text="Screenshot shows Standard workflow, example built-in action, and selected managed identity selected to use." lightbox="media/authenticate-with-managed-identity/built-in-select-identity-standard.png":::

        > [!NOTE]
        >
        > By default, **System-assigned managed identity** is the selected option, even when you don't enable any managed identities. By default, Standard logic apps automatically enable the system identity. Although these logic apps can have multiple identities enabled, they can use only one identity at a time.
        >
        > For example, a workflow that accesses different Azure Service Bus messaging entities should use only one managed identity. For more information, see [Connect to Azure Service Bus from workflows](../connectors/connectors-create-api-servicebus.md#prerequisites).

     For more information, see [Example: Authenticate built-in trigger or action with a managed identity](#authenticate-built-in-managed-identity).

   - **Managed connector operations**

     1. On the **Create connection** pane, from the **Authentication** list, select **Managed identity**, for example:

        :::image type="content" source="media/authenticate-with-managed-identity/select-managed-identity-resource-manager.png" alt-text="Screenshot shows Standard workflow, Azure Resource Manager action, and selected option for Managed Identity." lightbox="media/authenticate-with-managed-identity/select-managed-identity-resource-manager.png":::

     1. On the next pane, for **Connection Name**, enter a name to use for the connection.

     1. Based on your connector, choose one of the following options:

        - **Single-authentication**: These connectors support only one authentication type, which is the managed identity in this case.

          The following steps continue by using an **Azure Resource** action as an example.

          1. From the **Managed Identity** list, select the currently enabled managed identity.

          1. Select **Create new**.

        - **Multi-authentication**: These connectors support multiple authentication types, but you can select and use only one type at a time.

          The following steps use an **Azure Blob Storage** action as an example.

          1. From the **Authentication Type** list, select **Logic Apps Managed Identity**.

             :::image type="content" source="media/authenticate-with-managed-identity/multi-identity.png" alt-text="Screenshot shows Standard workflow, connection name pane, and selected option for Logic Apps Managed Identity." lightbox="media/authenticate-with-managed-identity/multi-identity.png":::

          1. From the **Managed identity** list, select the identity.

             :::image type="content" source="media/authenticate-with-managed-identity/select-multi-identity-standard.png" alt-text="Screenshot shows Standard workflow, the action's Parameters pane, and list named Managed identity." lightbox="media/authenticate-with-managed-identity/select-multi-identity-standard.png":::

          1. Select **Create new**.

        For more information, see [Example: Authenticate managed connector trigger or action with a managed identity](#authenticate-managed-connector-managed-identity).

---

<a name="authenticate-built-in-managed-identity"></a>

## Example: Authenticate built-in trigger or action with a managed identity

The built-in **HTTP** trigger or action can use the system-assigned identity that you enable on your logic app resource. In general, the **HTTP** trigger or action uses the following properties to specify the resource or entity that you want to access:

| Property | Required | Description |
|----------|----------|-------------|
| **Method** | Yes | The HTTP method for the operation that you want to run |
| **URI** | Yes | The endpoint URL for accessing the target Azure resource or entity. The URI syntax usually includes the resource ID for the target Azure resource or service. |
| **Headers** | No | Any header values that you need or want to include in the outgoing request, such as the content type |
| **Queries** | No | Any query parameters that you need or want to include in the request. For example, query parameters for a specific operation or for the API version of the operation that you want to run. |
| **Authentication** | Yes | The authentication type to use for authenticating access to the Azure target resource or service |

As a specific example, suppose that you want to run the [Snapshot Blob operation](/rest/api/storageservices/snapshot-blob) on a blob in the Azure Storage account where you previously set up access for your identity. However, the [Azure Blob Storage connector](/connectors/azureblob/) doesn't currently offer this operation. Instead, you can run this operation by using the [HTTP action](logic-apps-workflow-actions-triggers.md#http-action) or another [Blob Service REST API operation](/rest/api/storageservices/operations-on-blobs).

> [!IMPORTANT]
>
> To access Azure storage accounts behind firewalls by using the Azure Blob Storage connector and managed identities, make sure that you also set up your storage account with the [exception that allows access by trusted Microsoft services](../connectors/connectors-create-api-azureblobstorage.md#access-blob-storage-in-same-region-with-system-managed-identities).

To run the [Snapshot Blob operation](/rest/api/storageservices/snapshot-blob), the **HTTP** action specifies the following properties:

| Property | Required | Example value | Description |
|----------|----------|---------------|-------------|
| **URI** | Yes | `https://<storage-account-name>/<folder-name>/{name}` | The resource ID for an Azure Blob Storage file in the Azure Global (public) environment, which uses this syntax. |
| **Method** | Yes | `PUT`| The HTTP method that the Snapshot Blob operation uses. |
| **Headers** | For Azure Storage | `x-ms-blob-type` = `BlockBlob` <br><br>`x-ms-version` = `2024-05-05` <br><br>`x-ms-date` = `formatDateTime(utcNow(),'r')` | The `x-ms-blob-type`, `x-ms-version`, and `x-ms-date` header values are required for Azure Storage operations. <br><br>**Important**: In outgoing **HTTP** trigger and action requests for Azure Storage, the header requires the `x-ms-version` property and the API version for the operation that you want to run. The `x-ms-date` value must be the current date. Otherwise, your workflow fails with a `403 FORBIDDEN` error. To get the current date in the required format, you can use the expression in the example value. <br><br>For more information, see: <br><br>- [Request headers - Snapshot Blob](/rest/api/storageservices/snapshot-blob#request) <br>- [Versioning for Azure Storage services](/rest/api/storageservices/versioning-for-the-azure-storage-services#specifying-service-versions-in-requests) |
| **Queries** | Only for the Snapshot Blob operation | `comp` = `snapshot` | The query parameter name and value for the operation. |

### [Consumption](#tab/consumption)

1. On the workflow designer, add any trigger you want, and then add the **HTTP** action.

   The following example shows a sample **HTTP** action with all the previously described property values to use for the Snapshot Blob operation:

   :::image type="content" source="media/authenticate-with-managed-identity/http-action-example-consumption.png" alt-text="Screenshot shows Azure portal, Consumption workflow, and HTTP action set up to access resources." lightbox="media/authenticate-with-managed-identity/http-action-example-consumption.png":::

1. In the **HTTP** action, from the **Advanced parameters** list, select **Authentication**.

   :::image type="content" source="media/authenticate-with-managed-identity/add-authentication-property.png" alt-text="Screenshot shows Consumption workflow with HTTP action and opened Advanced parameters list with selected property named Authentication." lightbox="media/authenticate-with-managed-identity/add-authentication-property.png":::

   The **Authentication** section appears in your **HTTP** action.

1. From the **Authentication type** list, select **Managed identity**.

   :::image type="content" source="media/authenticate-with-managed-identity/select-managed-identity.png" alt-text="Screenshot shows Consumption workflow, HTTP action, and Authentication Type property with selected option for Managed Identity." lightbox="media/authenticate-with-managed-identity/select-managed-identity.png":::

1. From the **Managed identity** list, select from the available options based on your scenario.

   - If you set up the system-assigned identity, select **System-assigned managed identity**.

     :::image type="content" source="media/authenticate-with-managed-identity/select-system-assigned-identity-example.png" alt-text="Screenshot shows Consumption workflow, HTTP action, and Managed identity property with selected option for System-assigned managed identity." lightbox="media/authenticate-with-managed-identity/select-system-assigned-identity-example.png":::

   - If you set up the user-assigned identity, select that identity.

     :::image type="content" source="media/authenticate-with-managed-identity/select-user-assigned-identity-example.png" alt-text="Screenshot shows Consumption workflow, HTTP action, and Managed identity property with selected user-assigned identity." lightbox="media/authenticate-with-managed-identity/select-user-assigned-identity-example.png":::

   This example continues with the **System-assigned managed identity**.

1. Some triggers and actions show the **Audience** parameter so you can enter the resource ID for the target Azure resource or service.

   For example, to authenticate access to a [Key Vault resource in the global Azure cloud](/azure/key-vault/general/authentication), set the **Audience** parameter to *exactly* the following resource ID: `https://vault.azure.net`

   Otherwise, by default, the **Audience** parameter uses the `https://management.azure.com/` resource ID, which is the resource ID for Azure Resource Manager.

   > [!IMPORTANT]
   >
   > The target resource ID must *exactly match* the value that Microsoft Entra ID expects. Otherwise, you might get either a **400 Bad Request** error or a **401 Unauthorized** error. If the resource ID includes any trailing slashes, include them. If not, don't include them.
   >
   > For example, the resource ID for all Azure Blob Storage accounts requires a trailing slash. However, the resource ID for a specific storage account doesn't require a trailing slash. Check the resource IDs for the [Azure services that support Microsoft Entra ID](/entra/identity/managed-identities-azure-resources/services-id-authentication-support).

   The following example sets the **Audience** parameter to `https://storage.azure.com/`. This value means that the access tokens for authentication are valid for all storage accounts. For a specific storage account, specify the root service URL, `https://<your-storage-account>.blob.core.windows.net`.

   :::image type="content" source="media/authenticate-with-managed-identity/set-audience-url-target-resource.png" alt-text="Screenshot shows Consumption workflow and HTTP action with Audience property set to target resource ID." lightbox="media/authenticate-with-managed-identity/set-audience-url-target-resource.png":::

   For more information, see:

   - [Authorize access to Azure blobs and queues by using Microsoft Entra ID](../storage/blobs/authorize-access-azure-active-directory.md)
   - [Authorize access to Azure Storage with OAuth](/rest/api/storageservices/authorize-with-azure-active-directory#use-oauth-access-tokens-for-authentication)

1. Continue building the workflow based on your scenario.

### [Standard](#tab/standard)

1. On the workflow designer, add any trigger you want, and then add the **HTTP** action.

   The following example shows a sample **HTTP** action with all the previously described property values to use for the Snapshot Blob operation:

   :::image type="content" source="media/authenticate-with-managed-identity/http-action-example-standard.png" alt-text="Screenshot shows Azure portal, Standard workflow, and HTTP action set up to access resources." lightbox="media/authenticate-with-managed-identity/http-action-example-standard.png":::

1. In the **HTTP** action, from the **Advanced parameters** list, select **Authentication**.

   :::image type="content" source="media/authenticate-with-managed-identity/add-authentication-property.png" alt-text="Screenshot shows Standard workflow and HTTP action with opened Advanced parameters list and selected property named Authentication." lightbox="media/authenticate-with-managed-identity/add-authentication-property.png":::

   The **Authentication** section appears in your **HTTP** action.

1. From the **Authentication type** list, select **Managed identity**.

   :::image type="content" source="media/authenticate-with-managed-identity/select-managed-identity.png" alt-text="Screenshot shows Standard workflow, HTTP action, and Authentication property with selected option for Managed Identity." lightbox="media/authenticate-with-managed-identity/select-managed-identity.png":::

1. From the **Managed identity** list, select from the available options based on your scenario.

   - If you set up the system-assigned identity, select **System-assigned managed identity**.

     :::image type="content" source="media/authenticate-with-managed-identity/select-system-assigned-identity-example.png" alt-text="Screenshot shows Standard workflow, HTTP action, and Managed Identity property with selected option for System-assigned managed identity." lightbox="media/authenticate-with-managed-identity/select-system-assigned-identity-example.png":::

   - If you set up a user-assigned identity, select that identity.

     :::image type="content" source="media/authenticate-with-managed-identity/select-user-assigned-identity-example.png" alt-text="Screenshot shows Standard workflow, HTTP action, and Managed Identity property with selected user-assigned identity." lightbox="media/authenticate-with-managed-identity/select-user-assigned-identity-example.png":::

   This example continues with the **System-assigned managed identity**.

1. Some triggers and actions show the **Audience** parameter so you can enter the resource ID for the target Azure resource or service.

   For example, to authenticate access to a [Key Vault resource in the global Azure cloud](/azure/key-vault/general/authentication), set the **Audience** parameter to *exactly* the following resource ID: `https://vault.azure.net`

   Otherwise, by default, the **Audience** parameter uses the `https://management.azure.com/` resource ID, which is the resource ID for Azure Resource Manager.

   > [!IMPORTANT]
   >
   > The target resource ID must *exactly match* the value that Microsoft Entra ID expects. Otherwise, you might get either a **400 Bad Request** error or a **401 Unauthorized** error. If the resource ID includes any trailing slashes, include them. If not, don't include them.
   >
   > For example, the resource ID for all Azure Blob Storage accounts requires a trailing slash. However, the resource ID for a specific storage account doesn't require a trailing slash. Check the resource IDs for the [Azure services that support Microsoft Entra ID](/entra/identity/managed-identities-azure-resources/services-id-authentication-support).

   The following example sets the **Audience** parameter to `https://storage.azure.com/`. This value means that the access tokens for authentication are valid for all storage accounts. For a specific storage account, specify the root service URL, `https://<your-storage-account>.blob.core.windows.net`.

   :::image type="content" source="media/authenticate-with-managed-identity/set-audience-url-target-resource.png" alt-text="Screenshot shows Standard workflow and HTTP action with Audience property set to target resource ID." lightbox="media/authenticate-with-managed-identity/set-audience-url-target-resource.png":::

   For more information, see:

   - [Authorize access to Azure blobs and queues by using Microsoft Entra ID](../storage/blobs/authorize-access-azure-active-directory.md)
   - [Authorize access to Azure Storage with OAuth](/rest/api/storageservices/authorize-with-azure-active-directory#use-oauth-access-tokens-for-authentication)

1. Continue building the workflow based on your scenario.

---

<a name="authenticate-managed-connector-managed-identity"></a>

## Example: Authenticate managed connector trigger or action by using a managed identity

The **Azure Resource Manager** managed connector has an action named **Read a resource** that can use the managed identity you enable on your logic app resource. This example shows how to use the system-assigned managed identity with a managed connector.

### [Consumption](#tab/consumption)

1. On the workflow designer, add the **Azure Resource Manager** action named **Read a resource**. 

1. On the **Create connection** pane, from the **Authentication** list, select **Managed identity**, and then select **Sign in**.

   > [!NOTE]
   > 
   > In some connectors, the **Authentication Type** list shows  **Logic Apps Managed Identity** instead. If your scenario shows this option, select this option.

   :::image type="content" source="media/authenticate-with-managed-identity/select-managed-identity-resource-manager.png" alt-text="Screenshot shows Consumption workflow, Azure Resource Manager action, opened Authentication list, and selected option for Managed Identity." lightbox="media/authenticate-with-managed-identity/select-managed-identity-resource-manager.png":::

1. Enter a name for the connection, and select the managed identity you want.

   If you enabled the system-assigned identity, the **Managed identity** list automatically selects **System-assigned managed identity**. If you enabled a user-assigned identity instead, the list automatically selects the user-assigned identity.

   In this example, **System-assigned managed identity** is the only selection available.

   :::image type="content" source="media/authenticate-with-managed-identity/connection-azure-resource-manager-consumption.png" alt-text="Screenshot shows Consumption workflow and Azure Resource Manager action with connection name entered and selected option for System-assigned managed identity." lightbox="media/authenticate-with-managed-identity/connection-azure-resource-manager-consumption.png":::

   > [!NOTE]
   >
   > If you don't enable the managed identity when you try to create or change the connection, or if you remove the managed identity while a managed identity-enabled connection still exists, you get an error that says you must enable the identity and grant access to the target resource.

1. When you finish, select **Create new**.

   After you create the connection, the designer can fetch any dynamic values, content, or schema by using managed identity authentication.

1. Continue building the workflow based on your scenario.

### [Standard](#tab/standard)

1. On the workflow designer, add the **Azure Resource Manager** action named **Read a resource**. 

1. On the **Create connection** pane, from the **Authentication** list, select **Managed Identity**, and then select **Sign in**.

   > [!NOTE]
   > 
   > In some connectors, the **Authentication Type** list shows  **Logic Apps Managed Identity** instead. If your scenario shows this option, select this option.

   :::image type="content" source="media/authenticate-with-managed-identity/select-managed-identity-resource-manager.png" alt-text="Screenshot shows Standard workflow, Azure Resource Manager action, opened Authentication list, and selected option for Managed Identity." lightbox="media/authenticate-with-managed-identity/select-managed-identity-resource-manager.png":::

1. Enter a name for the connection, and select the managed identity you want.

   By default, Standard logic app resources automatically enable the system-assigned identity. So, in the **Managed identity** list, the **System-assigned managed identity** appears selected. If you enabled one or more user-assigned identities, the list shows all the currently enabled managed identities, for example:

   :::image type="content" source="media/authenticate-with-managed-identity/connection-azure-resource-manager-standard.png" alt-text="Screenshot shows Standard workflow and Azure Resource Manager action with connection name and all enabled managed identities." lightbox="media/authenticate-with-managed-identity/connection-azure-resource-manager-standard.png":::

   > [!NOTE]
   >
   > If you don't enable the managed identity when you try to create or change the connection, or if you remove the managed identity while a managed identity-enabled connection still exists, you get an error that says you must enable the identity and grant access to the target resource.

1. When you finish, select **Create new**.

   After you create the connection, the designer can fetch any dynamic values, content, or schema by using managed identity authentication.

1. Continue building the workflow based on your scenario.

---

<a name="logic-app-resource-definition-connection-managed-identity"></a>

## Connections with managed identities in logic app resource definitions

A managed identity authenticated connection type is a special connection type that works only with a managed identity. At workflow runtime, the connection uses the managed identity enabled on the logic app resource. Azure Logic Apps checks whether any managed connector operations in the workflow use the managed identity and whether all the required permissions exist to use the managed identity for accessing the corresponding target resources. If this check passes successfully, Azure Logic Apps gets the Microsoft Entra token associated with the managed identity, uses that identity to authenticate access to the target Azure resources, and performs the corresponding operations in the workflow.

### [Consumption](#tab/consumption)

In a Consumption logic app resource, you save the connection configuration in the resource definition's `parameters` object. This object contains the `$connections` object that includes pointers to the connection's resource ID along with the managed identity's resource ID when you enable the user-assigned identity.

The following example shows the `parameters` object when the *system-assigned* identity is enabled on a logic app:

```json
"parameters": {
   "$connections": {
      "value": {
         "<action-name>": {
            "connectionId": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/connections/<connector-name>",
            "connectionName": "<connector-name>",
            "connectionProperties": {
               "authentication": {
                  "type": "ManagedServiceIdentity"
               }
            },
            "id": "/subscriptions/<Azure-subscription-ID>/providers/Microsoft.Web/locations/<Azure-region>/managedApis/<managed-connector-type>"
         }
      }
   }
}
```

The following example shows the `parameters` object when the *user-assigned* managed identity is enabled on a logic app:

```json
"parameters": {
   "$connections": {
      "value": {
         "<action-name>": {
            "connectionId": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/connections/<connector-name>",
            "connectionName": "<connector-name>",
            "connectionProperties": {
               "authentication": {
                  "type": "ManagedServiceIdentity",
                  "identity": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<resource-group-name>/providers/microsoft.managedidentity/userassignedidentities/<managed-identity-name>"
               }
            },
            "id": "/subscriptions/<Azure-subscription-ID>/providers/Microsoft.Web/locations/<Azure-region>/managedApis/<managed-connector-type>"
         }
      }
   }
}
```

### [Standard](#tab/standard)

In a Standard logic app resource, you save the connection configuration in the logic app resource or project's *connections.json* file. This file contains a `managedApiConnections` object that contains connection configuration information for each managed connector used in a workflow. This connection information has pointers to the connection's resource ID along with the managed identity properties, such as the resource ID when the logic app enables the user-assigned identity.

This example shows the `managedApiConnections` object configuration when the logic app enables the *system-assigned* identity:

```json
{
    "managedApiConnections": {
        "<connector-name>": {
            "api": {
                "id": "/subscriptions/<Azure-subscription-ID>/providers/Microsoft.Web/locations/<Azure-region>/managedApis/<connector-name>"
            },
            "authentication": { // Authentication for the internal token store
                "type": "ManagedServiceIdentity"
            },
            "connection": {
                "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/connections/<connector-name>"
            },
            "connectionProperties": {
                "authentication": { // Authentication for the target resource
                    "audience": "<resource-URL>",
                    "type": "ManagedServiceIdentity"
                }
            },
            "connectionRuntimeUrl": "<connection-runtime-URL>"
        }
    }
}
```

This example shows the `managedApiConnections` object configuration when the logic app enables the *user-assigned* identity:

```json
{
    "managedApiConnections": {
        "<connector-name>": {
            "api": {
                "id": "/subscriptions/<Azure-subscription-ID>/providers/Microsoft.Web/locations/<Azure-region>/managedApis/<connector-name>"
            },
            "authentication": { // Authentication for the internal token store
                "type": "ManagedServiceIdentity"
            },
            "connection": {
                "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/connections/<connector-name>"
            },
            "connectionProperties": {
                "authentication": { // Authentication for the target resource
                    "audience": "<resource-URL>",
                    "type": "ManagedServiceIdentity",
                    "identity": "<user-assigned-identity>" // Optional
                }
            },
            "connectionRuntimeUrl": "<connection-runtime-URL>"
        }
    }
}
```

---

<a name="arm-templates-connection-resource-managed-identity"></a>

## ARM template for API connections and managed identities

If you use an ARM template to automate deployment, and your workflow includes an API connection created by a [managed connector](../connectors/managed.md) and uses a managed identity, you need to take an extra step.

In an ARM template, the underlying connector resource definition differs based on whether you use a Consumption or Standard logic app resource and whether the [connector shows single-authentication or multi-authentication options](#managed-connectors-managed-identity).

### [Consumption](#tab/consumption)

The following examples apply to Consumption logic app resources. They show how the underlying connector resource definition differs between a single-authentication connector and a multiauthentication connector.

#### Single-authentication

This example shows the underlying connection resource definition for a connector action that supports only one authentication type and uses a managed identity in a Consumption logic app workflow. The definition includes the following attributes:

- The `kind` property is set to `V1` for a Consumption workflow.

- The `parameterValueType` property is set to `Alternative`.

```json
{
    "type": "Microsoft.Web/connections",
    "apiVersion": "[providers('Microsoft.Web','connections').apiVersions[0]]",
    "name": "[variables('connections_<connector-name>_name')]",
    "location": "[parameters('location')]",
    "kind": "V1",
    "properties": {
        "alternativeParameterValues": {},
        "api": {
            "id": "[subscriptionResourceId('Microsoft.Web/locations/managedApis', parameters('location'), '<connector-name>')]"
        },
        "authenticatedUser": {},
        "connectionState": "Enabled",
        "customParameterValues": {},
        "displayName": "[variables('connections_<connector-name>_name')]",
        "parameterValueSet": {},
        "parameterValueType": "Alternative"
    }
},
```

#### Multiple authentication methods

This example shows the underlying connection resource definition for a connector action that supports multiple authentication types and uses a managed identity in a Consumption logic app workflow. The definition includes the following attributes:

- The `kind` property is set to `V1` for a Consumption workflow.

- The `parameterValueSet` object includes a `name` property that's set to `managedIdentityAuth` and a `values` property that's set to an empty object.

```json
{
    "type": "Microsoft.Web/connections",
    "apiVersion": "[providers('Microsoft.Web','connections').apiVersions[0]]",
    "name": "[variables('connections_<connector-name>_name')]",
    "location": "[parameters('location')]",
    "kind": "V1",
    "properties": {
        "alternativeParameterValues": {},
        "api": {
            "id": "[subscriptionResourceId('Microsoft.Web/locations/managedApis', parameters('location'), '<connector-name>')]"
        },
        "authenticatedUser": {},
        "connectionState": "Enabled",
        "customParameterValues": {},
        "displayName": "[variables('connections_<connector-name>_name')]",
        "parameterValueSet": {
            "name": "managedIdentityAuth",
            "values": {}
        }
    }
}
```

### [Standard](#tab/standard)

The following examples apply to Standard logic app resources and show how the underlying connector resource definition differs between a single-authentication connector and a multi-authentication connector.

#### Single-authentication

This example shows the underlying connection resource definition for a connector action that supports only one authentication type and uses a managed identity in a Standard logic app workflow. The definition includes the following attributes:

- The `kind` property is set to `V2` for a Standard workflow.

- The `parameterValueType` property is set to `Alternative`.

```json
{
    "type": "Microsoft.Web/connections",
    "apiVersion": "[providers('Microsoft.Web','connections').apiVersions[0]]",
    "name": "[variables('connections_<connector-name>_name')]",
    "location": "[parameters('location')]",
    "kind": "V2",
    "properties": {
        "alternativeParameterValues": {},
        "api": {
            "id": "[subscriptionResourceId('Microsoft.Web/locations/managedApis', parameters('location'), '<connector-name>')]"
        },
        "authenticatedUser": {},
        "connectionState": "Enabled",
        "customParameterValues": {},
        "displayName": "[variables('connections_<connector-name>_name')]",
        "parameterValueSet": {},
        "parameterValueType": "Alternative"
    }
},
```

#### Multiple authentication methods

This example shows the underlying connection resource definition for a connector action that supports multiple authentication types and uses a managed identity in a Standard logic app workflow. The definition includes the following attributes:

- The `kind` property is set to `V2` for a Standard logic app.

- The `parameterValueSet` object includes a `name` property that's set to `managedIdentityAuth` and a `values` property that's set to an empty object.

```json
{
    "type": "Microsoft.Web/connections",
    "apiVersion": "[providers('Microsoft.Web','connections').apiVersions[0]]",
    "name": "[variables('connections_<connector-name>_name')]",
    "location": "[parameters('location')]",
    "kind": "V2",
    "properties": {
        "alternativeParameterValues": {},
        "api": {
            "id": "[subscriptionResourceId('Microsoft.Web/locations/managedApis', parameters('location'), '<connector-name>')]"
        },
        "authenticatedUser": {},
        "connectionState": "Enabled",
        "customParameterValues": {},
        "displayName": "[variables('connections_<connector-name>_name')]",
        "parameterValueSet": {
            "name": "managedIdentityAuth",
            "values": {}
        }
    }
}
```

In the subsequent `Microsoft.Web/connections` resource definition, you need to add an access policy that specifies a resource definition for each API connection and provide the following information:

| Parameter | Description |
|-----------|-------------|
| <*connection-name*> | The name for your API connection, such as `azureblob`. |
| <*object-ID*> | The object ID for your Microsoft Entra identity, previously saved from your app registration. |
| <*tenant-ID*> | The tenant ID for your Microsoft Entra identity, previously saved from your app registration. |

```json
{
   "type": "Microsoft.Web/connections/accessPolicies",
   "apiVersion": "[providers('Microsoft.Web','connections').apiVersions[0]]",
   "name": "[concat('<connector-name>','/','<object-ID>')]",
   "location": "<location>",
   "dependsOn": [
      "[resourceId('Microsoft.Web/connections', parameters('<connector-name>'))]"
   ],
   "properties": {
      "principal": {
         "type": "ActiveDirectory",
         "identity": {
            "objectId": "<object-ID>",
            "tenantId": "<tenant-ID>"
         }
      }
   }
}
```

For more information, see [Microsoft.Web/connections/accesspolicies (ARM template)](/azure/templates/microsoft.web/connections).

---

<a name="setup-identity-apihub-authentication"></a>

## Set up advanced control for API connection authentication

When your Standard logic app workflow uses an API connection that a [managed connector](../connectors/managed.md) creates, Azure Logic Apps uses two connections to communicate with the target resource, such as your email account or key vault:

:::image type="content" source="media/authenticate-with-managed-identity/api-connection-authentication-flow.png" alt-text="Conceptual diagram shows first connection with authentication between logic app and token store plus second connection between token store and target resource." lightbox="media/authenticate-with-managed-identity/api-connection-authentication-flow.png":::

- Connection #1 is set up with authentication for the internal token store.

- Connection #2 is set up with authentication for the target resource.

However, when a Consumption logic app workflow uses an API connection, you can't view or set up connection #1. If you use a Standard logic app resource, you gain more control over your logic app and workflows. By default, connection #1 uses the system-assigned identity.

If your scenario requires finer control over authenticating API connections, change the authentication for connection #1 from the default system-assigned identity to any user-assigned identity that you add to your logic app. This authentication applies to each API connection, so you can mix system-assigned and user-assigned identities across different connections to the same target resource.

In your Standard logic app's *connections.json* file, which stores information about each API connection, each connection definition has two `authentication` objects, for example:

```json
"keyvault": {
   "api": {
      "id": "/subscriptions/<Azure-subscription-ID>/providers/Microsoft.Web/locations/<Azure-region>/managedApis/keyvault"
   },
   "authentication": {
      "type": "ManagedServiceIdentity",
   },
   "connection": {
      "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/connections/<connector-name>"
   },
   "connectionProperties": {
      "authentication": {
         "audience": "https://vault.azure.net",
         "type": "ManagedServiceIdentity"
      }
   },
   "connectionRuntimeUrl": "<connection-runtime-URL>"
}
```

- The first `authentication` object maps to connection #1.

  This object describes the authentication used for communicating with the internal token store. In the past, the `type` property was always set to `ManagedServiceIdentity` for an app that deploys to Azure and had no configurable options.

- The second `authentication` object maps to connection #2.

  This object describes the authentication used for communicating with the target resource and can vary, based on the authentication type that you select for that connection.

### Why change the authentication for the token store?

In some scenarios, you might want to share and use the same API connection across multiple logic app resources, but you don't want to add the system-assigned identity for each logic app resource to the target resource's access policy.

In other scenarios, you might not want to set up the system-assigned identity on your logic app. To use a user-assigned identity instead, you can change the authentication to a user-assigned identity and disable the system-assigned identity completely.

### Change the authentication for the token store

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar, under **Workflows**, select **Connections**.

1. On the **Connections** pane, select **JSON View**.

   :::image type="content" source="media/authenticate-with-managed-identity/connections-json-view.png" alt-text="Screenshot showing the Azure portal, Standard logic app resource, Connections pane with JSON View selected." lightbox="media/authenticate-with-managed-identity/connections-json-view.png":::

1. In the JSON editor, find the `managedApiConnections` object. This object contains the API connections across all workflows in your logic app resource.

1. Find the connection where you want to add a user-assigned managed identity.

   For example, suppose your workflow has an Azure Key Vault connection:

   ```json
   "keyvault": {
      "api": {
         "id": "/subscriptions/<Azure-subscription-ID>/providers/Microsoft.Web/locations/<Azure-region>/managedApis/keyvault"
      },
      "authentication": {
         "type": "ManagedServiceIdentity"
      },
      "connection": {
         "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/connections/<connector-name>"
      },
      "connectionProperties": {
         "authentication": {
            "audience": "https://vault.azure.net",
            "type": "ManagedServiceIdentity"
         }
      },
      "connectionRuntimeUrl": "<connection-runtime-URL>"
   }
   ```

1. In the connection definition, follow these steps:

   1. Find the first `authentication` object. If no `identity` property exists in this `authentication` object, the logic app implicitly uses the system-assigned identity.

   1. Add an `identity` property by using the example in this step.

   1. Set the property value to the resource ID for the user-assigned identity.

   ```json
   "keyvault": {
      "api": {
         "id": "/subscriptions/<Azure-subscription-ID>/providers/Microsoft.Web/locations/<Azure-region>/managedApis/keyvault"
      },
      "authentication": {
         "type": "ManagedServiceIdentity",
         // Add "identity" property here
         "identity": "/subscriptions/<Azure-subscription-ID>/resourcegroups/<resource-group-name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-resource-ID>"
      },
      "connection": {
         "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/connections/<connector-name>"
      },
      "connectionProperties": {
         "authentication": {
            "audience": "https://vault.azure.net",
            "type": "ManagedServiceIdentity"
         }
      },
      "connectionRuntimeUrl": "<connection-runtime-URL>"
   }
   ```

1. In the Azure portal, go to the target resource, and [give access to the user-assigned managed identity](#access-other-resources), based on the target resource's needs.

   For example, for Azure Key Vault, add the identity to the key vault's access policies. For Azure Blob Storage, assign the necessary role for the identity to the storage account.

<a name="remove-identity"></a>

## Disable managed identity

To stop using the managed identity for authentication, follow these steps:

1. [Remove the identity's access to the target resource](#disable-identity-target-resource).

1. On your logic app resource, [disable the system-assigned identity or remove the user-assigned identity](#disable-identity-logic-app).

When you turn off the managed identity on your logic app resource, you remove the capability for that identity to request access to Azure resources where the identity had access.

> [!NOTE]
>
> If you disable the system-assigned identity, all the connections that use the identity in the logic app's workflows stop working at runtime, even if you immediately enable the identity again.  
>
> This behavior happens because disabling the identity deletes its object ID. Each time that you enable the identity, Azure generates the identity with a different and unique object ID. To fix this problem, recreate the connections so they use the current object ID for the current system-assigned identity.
>
> Avoid disabling the system-assigned identity as much as possible. To remove the identity's access to Azure resources, remove the identity's role assignment from the target resource. If you delete your logic app resource, Azure automatically removes the managed identity from Microsoft Entra ID.

The following sections show how to disable the managed identity by using the [Azure portal](#azure-portal-disable) and [Azure Resource Manager template (ARM template)](#template-disable). For Azure PowerShell, Azure CLI, and Azure REST API, see:

| Tool | Documentation |
|------|---------------|
| Azure PowerShell | 1. [Remove role assignment](/azure/role-based-access-control/role-assignments-remove#azure-powershell). <br>2. [Delete user-assigned identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-powershell). |
| Azure CLI | 1. [Remove role assignment](/azure/role-based-access-control/role-assignments-remove#azure-cli). <br>2. [Delete user-assigned identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azcli). |
| Azure REST API | 1. [Remove role assignment](/azure/role-based-access-control/role-assignments-remove#rest-api). <br>2. [Delete user-assigned identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-rest). |

For more information, see [Remove Azure role assignments](/azure/role-based-access-control/role-assignments-remove).

<a name="azure-portal-disable"></a>

### Disable managed identity in the Azure portal

To remove access for the managed identity, remove the identity's role assignment from the target resource, and then disable the managed identity.

<a name="disable-identity-target-resource"></a>

#### Remove role assignment

The following steps remove access to the target resource from the managed identity:

1. In the [Azure portal](https://portal.azure.com), go to the target Azure resource where you want to remove access for the managed identity.

1. From the target resource sidebar, select **Access control (IAM)**. Under the toolbar, select **Role assignments**.

1. In the roles list, select the managed identities that you want to remove. On the toolbar, select **Remove**.

   > [!NOTE]
   >
   > If the **Remove** option is disabled, you most likely don't have permissions. For more information about the permissions that let you manage roles for resources, see [Administrator role permissions in Microsoft Entra ID](/entra/identity/role-based-access-control/permissions-reference).

<a name="disable-identity-logic-app"></a>

#### Disable managed identity on logic app resource

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. On the logic app resource sidebar, under **Settings**, select **Identity**, and then follow the steps for your identity:

   - Select **System assigned** > **Off** > **Save**. When Azure prompts you to confirm, select **Yes**.

   - Select **User assigned** and the managed identity, and then select **Remove**. When Azure prompts you to confirm, select **Yes**.

<a name="template-disable"></a>

### Disable managed identity in an ARM template

If you created the logic app's managed identity by using an ARM template, set the `identity` object's `type` child property to `None`.

```json
"identity": {
   "type": "None"
}
```

## Related content

- [Secure access and data in Azure Logic Apps](logic-apps-securing-a-logic-app.md)
