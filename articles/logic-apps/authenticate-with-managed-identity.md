---
title: Authenticate access and connections with managed identities
description: Set up a managed identity to authenticate workflow access to Microsoft Entra protected resources without using credentials, secrets, or tokens in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 01/27/2025
ms.custom: subject-rbac-steps, devx-track-arm-template

##customerIntent: As a logic app developer, I want to authenticate connections for my logic app workflow using a managed identity so I don't have to use credentials or secrets.
---

# Authenticate access and connections to Azure resources with managed identities in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

If you want to avoid providing, storing, and managing credentials, secrets, or Microsoft Entra tokens, you can use a managed identity to authenticate access or connections from your logic app workflow to Microsoft Entra protected resources. In Azure Logic Apps, some connector operations support using a managed identity when you must authenticate access to resources protected by Microsoft Entra ID. Azure manages this identity and helps keep authentication information secure so that you don't have to manage this sensitive information. For more information, see [What are managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview)?

Azure Logic Apps supports the following managed identity types:

- [System-assigned managed identity](/entra/identity/managed-identities-azure-resources/overview#managed-identity-types)

- [User-assigned managed identity](/entra/identity/managed-identities-azure-resources/overview#managed-identity-types)

The following list describes some differences between these managed identity types:

- A logic app resource can enable and use only one unique system-assigned identity.

- A logic app resource can share the same user-assigned identity across a group of other logic app resources.

This guide shows how to complete the following tasks:

- Enable and set up the system-assigned identity for your logic app resource. This guide provides an example that shows how to use the identity for authentication.

- Create and set up a user-assigned identity. This guide shows how to create this identity using the Azure portal or an Azure Resource Manager template (ARM template) and how to use the identity for authentication. For Azure PowerShell, Azure CLI, and Azure REST API, see the following documentation:

  | Tool | Documentation |
  |------|---------------|
  | Azure PowerShell | [Create user-assigned identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-powershell) |
  | Azure CLI | [Create user-assigned identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azcli) |
  | Azure REST API | [Create user-assigned identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-rest) |

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Both the managed identity and the target Azure resource where you need access must use the same Azure subscription.

- The target Azure resource that you want to access. On this resource, you must add the necessary role for the managed identity to access that resource on your logic app's or connection's behalf. To add a role to a managed identity, you need [Microsoft Entra administrator permissions](/entra/identity/role-based-access-control/permissions-reference) that can assign roles to the identities in the corresponding Microsoft Entra tenant.

- The logic app resource and workflow where you want to use the [trigger or actions that support managed identities](logic-apps-securing-a-logic-app.md#authentication-types-supported-triggers-actions).

## Managed identity differences between Consumption and Standard logic apps

Based on your logic app resource type, you can enable either the system-assigned identity, user-assigned identity, or both at the same time:

| Logic app | Environment | Managed identity support |
|-----------|-------------|--------------------------|
| Consumption | - Multitenant Azure Logic Apps | - You can enable *either* the system-assigned identity or the user-assigned identity, but not both on your logic app. <br><br>- You can use the managed identity at the logic app resource level and at the connection level. <br><br>- If you create and enable the user-assigned identity, your logic app can have *only one* user-assigned identity at a time. |
| Standard | - Single-tenant Azure Logic Apps <br><br>- App Service Environment v3 (ASEv3) <br><br>- Azure Arc enabled Logic Apps | - You can enable *both* the system-assigned identity, which is enabled by default, and the user-assigned identity at the same time. You can also add multiple user-assigned identities to your logic app. However, your logic app can use only one managed identity at a time. <br><br>- You can use the managed identity at the logic app resource level and at the connection level. |

For information about managed identity limits in Azure Logic Apps, see [Limits on managed identities for logic apps](logic-apps-limits-and-config.md#managed-identity). For more information about the Consumption and Standard logic app resource types and environments, see the following documentation:

- [Resource environment differences](logic-apps-overview.md#resource-environment-differences)

- [Azure Arc enabled Logic Apps](azure-arc-enabled-logic-apps-overview.md)

<a name="triggers-actions-managed-identity"></a>
<a name="managed-connectors-managed-identity"></a>

## Where you can use a managed identity

In Azure Logic Apps, only specific built-in and managed connector operations that support OAuth with Microsoft Entra ID can use a managed identity for authentication. The following tables provide only a sample selection. For a more complete list, see the following documentation:

- [Authentication types for triggers and actions that support authentication](logic-apps-securing-a-logic-app.md#authentication-types-supported-triggers-actions)

- [Azure services that support managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/managed-identities-status)

- [Azure services that support Microsoft Entra authentication](/entra/identity/managed-identities-azure-resources/services-id-authentication-support)

### [Consumption](#tab/consumption)

For a Consumption logic app workflow, the following table lists example connectors that support managed identity authentication:

| Connector type | Supported connectors |
|----------------|----------------------|
| Built-in | - Azure API Management <br>- Azure App Services <br>- Azure Functions <br>- HTTP <br>- HTTP + Webhook <br><br>**Note**: HTTP operations can authenticate connections to Azure Storage accounts behind Azure firewalls with the system-assigned identity. However, HTTP operations don't support the user-assigned identity for authenticating the same connections. |
| Managed | - Azure App Service <br>- Azure Automation <br>- Azure Blob Storage <br>- Azure Container Instance <br>- Azure Cosmos DB <br>- Azure Data Explorer <br>- Azure Data Factory <br>- Azure Data Lake <br>- Azure Digital Twins <br>- Azure Event Grid <br>- Azure Event Hubs <br>- Azure IoT Central V2 <br>- Azure Key Vault <br>-Azure Monitor Logs <br>- Azure Queues <br>- Azure Resource Manager <br>- Azure Service Bus <br>- Azure Sentinel <br>- Azure Table Storage <br>- Azure VM <br>- SQL Server |

### [Standard](#tab/standard)

For a Standard logic app workflow, the following table lists example connectors that support managed identity authentication:

| Connector type | Supported connectors |
|----------------|----------------------|
| Built-in | - Azure Automation <br>- Azure Blob Storage <br>- Azure Event Hubs <br>- Azure Service Bus <br>- Azure Queues <br>- Azure Tables <br>- HTTP <br>- HTTP + Webhook <br>- SQL Server <br><br>**Note**: Except for the SQL Server and HTTP connectors, most [built-in, service provider-based connectors](/azure/logic-apps/connectors/built-in/reference/) currently don't support selecting user-assigned identities for authentication. Instead, you must use the system-assigned identity. HTTP operations can authenticate connections to Azure Storage accounts behind Azure firewalls with the system-assigned identity. |
| Managed | - Azure App Service <br>- Azure Automation <br>- Azure Blob Storage <br>- Azure Container Instance <br>- Azure Cosmos DB <br>- Azure Data Explorer <br>- Azure Data Factory <br>- Azure Data Lake <br>- Azure Digital Twins <br>- Azure Event Grid <br>- Azure Event Hubs <br>- Azure IoT Central V2 <br>- Azure Key Vault <br>-Azure Monitor Logs <br>- Azure Queues <br>- Azure Resource Manager <br>- Azure Service Bus <br>- Azure Sentinel <br>- Azure Table Storage <br>- Azure VM <br>- SQL Server |

---

<a name="system-assigned-azure-portal"></a>
<a name="azure-portal-system-logic-app"></a>

## Enable system-assigned identity in the Azure portal

### [Consumption](#tab/consumption)

On a Consumption logic app resource, you must manually enable the system-assigned identity.

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource.

1. On the logic app menu, under **Settings**, select **Identity**.

1. On the **Identity** page, under **System assigned**, select **On** > **Save**. When Azure prompts you to confirm, select **Yes**.

   :::image type="content" source="media/authenticate-with-managed-identity/enable-system-assigned-identity-consumption.png" alt-text="Screenshot shows Azure portal, Consumption logic app, Identity page, and System assigned tab with selected options, On and Save." lightbox="media/authenticate-with-managed-identity/enable-system-assigned-identity-consumption.png":::

   > [!NOTE]
   >
   > If you get an error that you can have only a single managed identity, your logic app resource is 
   > already associated with the user-assigned identity. Before you can add the system-assigned identity, 
   > you must first remove the user-assigned identity from your logic app resource.

   Your logic app resource can now use the system-assigned identity. This identity is registered with Microsoft Entra ID and is represented by an object ID.

   :::image type="content" source="media/authenticate-with-managed-identity/object-id-system-assigned-identity.png" alt-text="Screenshot shows Consumption logic app, Identity page, and object ID for system-assigned identity." lightbox="media/authenticate-with-managed-identity/object-id-system-assigned-identity.png":::

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Object (principal) ID** | <*identity-resource-ID*> | A Globally Unique Identifier (GUID) that represents the system-assigned identity for your logic app in a Microsoft Entra tenant. |

1. Now follow the [steps that give the system-assigned identity access to the resource](#access-other-resources) later in this guide.

### [Standard](#tab/standard)

On a Standard logic app resource, the system-assigned identity is automatically enabled. If you need to enable the identity, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app menu, under **Settings**, select **Identity**.

1. On the **Identity** page, under **System assigned**, select **On** > **Save**. When Azure prompts you to confirm, select **Yes**.

   :::image type="content" source="media/authenticate-with-managed-identity/enable-system-assigned-identity-standard.png" alt-text="Screenshot shows Azure portal, Standard logic app, Identity page, and System assigned tab with selected options for On and Save." lightbox="media/authenticate-with-managed-identity/enable-system-assigned-identity-standard.png":::

   Your logic app resource can now use the system-assigned identity, which is registered with Microsoft Entra ID and is represented by an object ID.

   :::image type="content" source="media/authenticate-with-managed-identity/object-id-system-assigned-identity.png" alt-text="Screenshot shows Standard logic app, Identity page, and object ID for system-assigned identity." lightbox="media/authenticate-with-managed-identity/object-id-system-assigned-identity.png":::

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Object (principal) ID** | <*identity-resource-ID*> | A Globally Unique Identifier (GUID) that represents the system-assigned identity for your logic app in a Microsoft Entra tenant. |

1. Now follow the [steps that give that identity access to the resource](#access-other-resources) later in this guide.

---

<a name="system-assigned-template"></a>
<a name="template-system-logic-app"></a>

## Enable system-assigned identity in an ARM template

To automate creating and deploying logic app resources, you can use an [ARM template](logic-apps-azure-resource-manager-templates-overview.md). To enable the system-assigned identity for your logic app resource in the template, add the **identity** object and the **type** child property to the logic app's resource definition in the template, for example:

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

When Azure creates your logic app resource definition, the **identity** object gets the following other properties:

```json
"identity": {
   "type": "SystemAssigned",
   "principalId": "<principal-ID>",
   "tenantId": "<Entra-tenant-ID>"
}
```

| Property (JSON) | Value | Description |
|-----------------|-------|-------------|
| **principalId** | <*principal-ID*> | The Globally Unique Identifier (GUID) of the service principal object for the managed identity that represents your logic app in the Microsoft Entra tenant. This GUID sometimes appears as an "object ID" or **objectID**. |
| **tenantId** | <*Microsoft-Entra-ID-tenant-ID*> | The Globally Unique Identifier (GUID) that represents the Microsoft Entra tenant where the logic app is now a member. Inside the Microsoft Entra tenant, the service principal has the same name as the logic app instance. |

<a name="azure-portal-user-identity"></a>
<a name="user-assigned-azure-portal"></a>

## Create user-assigned identity in the Azure portal

Before you can enable the user-assigned identity on a Consumption logic app resource or Standard logic app resource, you must create that identity as a separate Azure resource.

1. In the [Azure portal](https://portal.azure.com) search box, enter **managed identities**. From the results list, select **Managed Identities**.

   :::image type="content" source="media/authenticate-with-managed-identity/find-select-managed-identities.png" alt-text="Screenshot shows Azure portal with selected option named Managed Identities." lightbox="media/authenticate-with-managed-identity/find-select-managed-identities.png":::

1. On the **Managed Identities** page toolbar, select **Create**.

1. Provide information about your managed identity, and select **Review + Create**, for example:

   :::image type="content" source="media/authenticate-with-managed-identity/create-user-assigned-identity.png" alt-text="Screenshot shows page named Create User Assigned Managed Identity, with managed identity details." lightbox="media/authenticate-with-managed-identity/create-user-assigned-identity.png":::

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | The Azure subscription name |
   | **Resource group** | Yes | <*Azure-resource-group-name*> | The Azure resource group name. Create a new group, or select an existing group. This example creates a new group named **fabrikam-managed-identities-RG**. |
   | **Region** | Yes | <*Azure-region*> | The Azure region where to store information about your resource. This example uses **West US**. |
   | **Name** | Yes | <*user-assigned-identity-name*> | The name to give your user-assigned identity. This example uses **Fabrikam-user-assigned-identity**. |

   After Azure validates the information, Azure creates your managed identity. Now you can add the user-assigned identity to your logic app resource.

## Add user-assigned identity to logic app in the Azure portal

### [Consumption](#tab/consumption)

1. In the Azure portal, open your Consumption logic app resource.

1. On the logic app menu, under **Settings**, select **Identity**.

1. On the **Identity** page, select **User assigned**, and then select **Add**.

   :::image type="content" source="media/authenticate-with-managed-identity/add-user-assigned-identity-logic-app-consumption.png" alt-text="Screenshot shows Consumption logic app and Identity page with selected option for Add." lightbox="media/authenticate-with-managed-identity/add-user-assigned-identity-logic-app-consumption.png":::

1. On the **Add user assigned managed identity** pane, follow these steps:

   1. From the **Select a subscription** list, select your Azure subscription.

   1. From the list that has *all* the managed identities in your subscription, select the user-assigned identity that you want. To filter the list, in the **User assigned managed identities** search box, enter the name for the identity or resource group.

      :::image type="content" source="media/authenticate-with-managed-identity/select-user-assigned-identity.png" alt-text="Screenshot shows Consumption logic app and selected user-assigned identity." lightbox="media/authenticate-with-managed-identity/select-user-assigned-identity.png":::

   1. When you're done, select **Add**.

      > [!NOTE]
      >
      > If you get an error that you can have only a single managed identity, your logic app 
      > is already associated with the system-assigned identity. Before you can add the 
      > user-assigned identity, you have to first disable the system-assigned identity.

   Your logic app is now associated with the user-assigned identity.

   :::image type="content" source="media/authenticate-with-managed-identity/added-user-assigned-identity-consumption.png" alt-text="Screenshot shows Consumption logic app with associated user-assigned identity." lightbox="media/authenticate-with-managed-identity/added-user-assigned-identity-consumption.png":::

1. Now follow the [steps that give the identity access to the resource](#access-other-resources) later in this guide.

### [Standard](#tab/standard)

1. In the Azure portal, open your Standard logic app resource.

1. On the logic app menu, under **Settings**, select **Identity**.

1. On the **Identity** page, select **User assigned**, and then select **Add**.

   :::image type="content" source="media/authenticate-with-managed-identity/add-user-assigned-identity-logic-app-standard.png" alt-text="Screenshot shows Standard logic app and Identity page with selected option for Add." lightbox="media/authenticate-with-managed-identity/add-user-assigned-identity-logic-app-standard.png":::

1. On the **Add user assigned managed identity** pane, follow these steps:

   1. From the **Select a subscription** list, select your Azure subscription.

   1. From the list with *all* the managed identities in your subscription, select the user-assigned identity that you want. To filter the list, in the **User assigned managed identities** search box, enter the name for the identity or resource group.

      :::image type="content" source="media/authenticate-with-managed-identity/select-user-assigned-identity.png" alt-text="Screenshot shows Standard logic app and selected user-assigned identity." lightbox="media/authenticate-with-managed-identity/select-user-assigned-identity.png":::

   1. When you're done, select **Add**.

      Your logic app is now associated with the user-assigned identity.

      :::image type="content" source="media/authenticate-with-managed-identity/added-user-assigned-identity-standard.png" alt-text="Screenshot shows Standard logic app and associated user-assigned identity." lightbox="media/authenticate-with-managed-identity/added-user-assigned-identity-standard.png":::

   1. To have multiple user-assigned identities, repeat the same steps to add those identities.

1. Now follow the [steps that give the identity access to the resource](#access-other-resources) later in this guide.

---

<a name="template-user-identity"></a>

## Create user-assigned identity in an ARM template

To automate creating and deploying logic app resources, you can use an [ARM template](logic-apps-azure-resource-manager-templates-overview.md). These templates support [user-assigned identities for authentication](/azure/templates/microsoft.managedidentity/userassignedidentities?pivots=deployment-language-arm-template).

In your template's **resources** section, your logic app's resource definition requires the following items:

- An **identity** object with the **type** property set to **UserAssigned**

- A child **userAssignedIdentities** object that specifies the user-assigned resource and name

### [Consumption](#tab/consumption)

This example shows a Consumption logic app resource and workflow definition for an HTTP PUT request with a nonparameterized **identity** object. The response to the PUT request and subsequent GET operation also includes this **identity** object:

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

If your template also includes the managed identity's resource definition, you can parameterize the **identity** object. The following example shows how the child **userAssignedIdentities** object references a **userAssignedIdentityName** variable that you define in your template's **variables** section. This variable references the resource ID for your user-assigned identity.

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

A Standard logic app resource can enable and have both the system-assigned identity and multiple user-assigned identities defined. The Standard logic app resource definition is based on the Azure Functions function app resource definition.

This example shows a Standard logic app resource and workflow definition that includes a nonparameterized **identity** object:

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

If your template also includes the managed identity's resource definition, you can parameterize the **identity** object. The following example shows how the child **userAssignedIdentities** object references a **userAssignedIdentityName** variable that you define in your template's **variables** section. This variable references the resource ID for your user-assigned identity.

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

When the template creates a logic app resource, the **identity** object includes the following properties:

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

The **principalId** property value is a unique identifier for the identity that's used for Microsoft Entra administration. The **clientId** property value is a unique identifier for the logic app's new identity that's used for specifying which identity to use during runtime calls. For more information about Azure Resource Manager templates and managed identities for Azure Functions, see the following documentation:

- [ARM template - Azure Functions](../azure-functions/functions-create-first-function-resource-manager.md#review-the-template)

- [Add a user-assigned identity using an ARM template for Azure Functions](../app-service/overview-managed-identity.md?tabs=arm%2Chttp#add-a-user-assigned-identity).

---

<a name="access-other-resources"></a>

## Give identity access to resources

Before you can use your logic app's managed identity for authentication, you have to set up access for the identity on the target Azure resource where you want to use the identity. The way that you set up access varies based on the target resource.

> [!NOTE]
>
> When a managed identity has access to an Azure resource in the same subscription, the identity can 
> access only that resource. However, in some triggers and actions that support managed identities, 
> you have to first select the Azure resource group that contains the target resource. If the identity 
> doesn't have access at the resource group level, no resources in that group are listed, despite having 
> access to the target resource.
>
> To handle this behavior, you must also give the identity access to the resource group, not just 
> the resource. Likewise, if you have to select your subscription before you can select the 
> target resource, you must give the identity access to the subscription.
>
> In some cases, you might need the identity to get access to the associated resource. For example, 
> suppose you have a managed identity for a logic app that needs access to update the application 
> settings for that same logic app from a workflow. You must give that identity access to the associated logic app.

For example, to access an Azure Blob storage account or an Azure key vault with your managed identity, you need to set up Azure role-based access control (Azure RBAC) and assign the appropriate role for that identity to the storage account or key vault, respectively.

The steps in this section describe how to assign role-based access using the [Azure portal](#azure-portal-assign-role) and [Azure Resource Manager template (ARM template)](../role-based-access-control/role-assignments-template.md). For Azure PowerShell, Azure CLI, and Azure REST API, see the following documentation:

| Tool | Documentation |
|------|---------------|
| Azure PowerShell | [Add role assignment](/entra/identity/managed-identities-azure-resources/how-to-assign-app-role-managed-identity-powershell) |
| Azure CLI | [Add role assignment](/entra/identity/managed-identities-azure-resources/how-to-assign-app-role-managed-identity-cli) |
| Azure REST API | [Add role assignment](../role-based-access-control/role-assignments-rest.md) |

For an Azure key vault, you also have the option to create an access policy for your managed identity on your key vault and assign the appropriate permissions for that identity on that key vault. The later steps in this section describe how to complete this task by using the [Azure portal](#azure-portal-access-policy). For Resource Manager templates, PowerShell, and Azure CLI, see the following documentation:

| Tool | Documentation |
|------|---------------|
| Azure Resource Manager template (ARM template) | [Key Vault access policy resource definition](/azure/templates/microsoft.keyvault/vaults) |
| Azure PowerShell | [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy?tabs=azure-powershell) |
| Azure CLI | [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy?tabs=azure-cli) |

<a name="azure-portal-assign-role"></a>

### Assign role-based access to a managed identity using the Azure portal

To use a managed identity for authentication, some Azure resources, such as Azure storage accounts, require that you assign that identity to a role that has the appropriate permissions on the target resource. Other Azure resources, such as Azure key vaults, support multiple options, so you can choose either role-based access or an [access policy that has the appropriate permissions on the target resource for that identity](#azure-portal-access-policy).

1. In the [Azure portal](https://portal.azure.com), open the resource where you want to use the identity.

1. On the resource menu, select **Access control (IAM)** > **Add** > **Add role assignment**.

   > [!NOTE]
   >
   > If the **Add role assignment** option is disabled, you don't have permissions to assign roles. 
   > For more information, see [Microsoft Entra built-in roles](/entra/identity/role-based-access-control/permissions-reference).

1. Assign the necessary role to your managed identity. On the **Role** tab, assign a role that gives your identity the required access to the current resource.

   For this example, assign the role that's named **Storage Blob Data Contributor**, which includes write access for blobs in an Azure Storage container. For more information about specific storage container roles, see [Roles that can access blobs in an Azure Storage container](../storage/blobs/authorize-access-azure-active-directory.md#assign-azure-roles-for-access-rights).

1. Next, choose the managed identity where you want to assign the role. Under **Assign access to**, select **Managed identity** > **Add members**.

1. Based on your managed identity's type, select or provide the following values:

   | Type | Azure service instance | Subscription | Member |
   |------|------------------------|--------------|--------|
   | **System-assigned** | **Logic App** | <*Azure-subscription-name*> | <*your-logic-app-name*> |
   | **User-assigned** | Not applicable | <*Azure-subscription-name*> | <*your-user-assigned-identity-name*> |

   For more information about assigning roles, see [Assign roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

After you're done, you can use the identity to [authenticate access for triggers and actions that support managed identities](#authenticate-access-with-identity).

For more general information about this task, see [Assign a managed identity access to an Azure resource or another resource](/entra/identity/managed-identities-azure-resources/how-to-assign-access-azure-resource).

<a name="azure-portal-access-policy"></a>

### Create an access policy using the Azure portal

To use a managed identity for authentication, other Azure resources also support or require that you create an access policy that has the appropriate permissions on the target resource for that identity. Other Azure resources, such as Azure storage accounts, instead require that you [assign that identity to a role that has the appropriate permissions on the target resource](#azure-portal-assign-role).

1. In the [Azure portal](https://portal.azure.com), open the target resource where you want to use the identity. This example uses an Azure key vault as the target resource.

1. On the resource menu, select **Access policies** > **Create**, which opens the **Create an access policy** pane.

   > [!NOTE]
   >
   > If the resource doesn't have the **Access policies** option, [try assigning a role assignment instead](#azure-portal-assign-role).

   :::image type="content" source="media/authenticate-with-managed-identity/create-access-policy.png" alt-text="Screenshot shows Azure portal and key vault example with open pane named Access policies." lightbox="media/authenticate-with-managed-identity/create-access-policy.png":::

1. On the **Permissions** tab, select the required permissions that the identity needs to access the target resource.

   For example, to use the identity with the Azure Key Vault managed connector's **List secrets** operation, the identity needs **List** permissions. So, in the **Secret permissions** column, select **List**.

   :::image type="content" source="media/authenticate-with-managed-identity/select-access-policy-permissions.png" alt-text="Screenshot shows Permissions tab with selected List permissions." lightbox="media/authenticate-with-managed-identity/select-access-policy-permissions.png":::

1. When you're ready, select **Next**. On the **Principal** tab, find and select the managed identity, which is a user-assigned identity in this example.

1. Skip the optional **Application** step, select **Next**, and finish creating the access policy.

The next section shows how to use a managed identity with a trigger or action to authenticate access. The example continues with the steps from an earlier section where you set up access for a managed identity using RBAC and an Azure storage account as the example. However, the general steps to use a managed identity for authentication are the same.

<a name="authenticate-access-with-identity"></a>

## Authenticate access with managed identity

After you [enable the managed identity for your logic app resource](#azure-portal-system-logic-app) and [give that identity access to the Azure target resource or service](#access-other-resources), you can use that identity in [triggers and actions that support managed identities](logic-apps-securing-a-logic-app.md#authentication-types-supported-triggers-actions).

> [!IMPORTANT]
>
> If you have an Azure function where you want to use the system-assigned identity, 
> first [enable authentication for Azure Functions](call-azure-functions-from-workflows.md#enable-authentication-functions).

The following steps show how to use the managed identity with a trigger or action using the Azure portal. To specify the managed identity in a trigger or action's underlying JSON definition, see [Managed identity authentication](logic-apps-securing-a-logic-app.md#managed-identity-authentication).

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource.

1. If you haven't done so yet, add the [trigger or action that supports managed identities](logic-apps-securing-a-logic-app.md#authentication-types-supported-triggers-actions).

   > [!NOTE]
   >
   > Not all connector operations support letting you add an authentication type. For more information, see 
   > [Authentication types for triggers and actions that support authentication](logic-apps-securing-a-logic-app.md#authentication-types-supported-triggers-actions).

1. On the trigger or action that you added, follow these steps:

   - **Built-in connector operations that support managed identity authentication**

     These steps continue by using the **HTTP** action as an example.

     1. From the **Advanced parameters** list, add the **Authentication** property, if the property doesn't already appear.

        :::image type="content" source="media/authenticate-with-managed-identity/built-in-authentication-consumption.png" alt-text="Screenshot shows Consumption workflow with built-in action and opened list named Advanced parameters, with selected option for Authentication." lightbox="media/authenticate-with-managed-identity/built-in-authentication-consumption.png":::

        Now, both the **Authentication** property and the **Authentication Type** list appear on the action.

        :::image type="content" source="media/authenticate-with-managed-identity/authentication-parameter.png" alt-text="Screenshot shows advanced parameters section with added Authentication property and Authentication Type list." lightbox="media/authenticate-with-managed-identity/authentication-parameter.png":::

     1. From the **Authentication Type** list, select **Managed Identity**.

        :::image type="content" source="media/authenticate-with-managed-identity/built-in-managed-identity-consumption.png" alt-text="Screenshot shows Consumption workflow with built-in action, opened Authentication Type list, and selected option for Managed Identity." lightbox="media/authenticate-with-managed-identity/built-in-managed-identity-consumption.png":::

        The **Authentication** section now shows the following options:

        - A **Managed Identity** list from where you can select a specific managed identity

        - The **Audience** property appears on specific triggers and actions so that you can set the resource ID for the Azure target resource or service. Otherwise, by default, the **Audience** property uses the **`https://management.azure.com/`** resource ID, which is the resource ID for Azure Resource Manager.

     1. From the **Managed Identity** list, select the identity that you want to use, for example:

        :::image type="content" source="media/authenticate-with-managed-identity/select-specific-managed-identity-consumption.png" alt-text="Screenshot shows Authentication section with Authentication Type list and Audience property." lightbox="media/authenticate-with-managed-identity/select-specific-managed-identity-consumption.png":::

        > [!NOTE]
        >
        > The default selected option is the **System-assigned managed identity**, 
        > even when you don't have any managed identities enabled.
        > 
        > To successfully use a managed identity, you must first enable that identity on your 
        > logic app. On a Consumption logic app, you can have either the system-assigned or 
        > user-assigned managed identity, but not both. 

     For more information, see [Example: Authenticate built-in trigger or action with a managed identity](#authenticate-built-in-managed-identity).

   - **Managed connector operations that support managed identity authentication**

     1. On the **Create Connection** pane, from the **Authentication** list, select **Managed Identity**, for example:

        :::image type="content" source="media/authenticate-with-managed-identity/select-managed-identity-consumption.png" alt-text="Screenshot shows Consumption workflow with Azure Resource Manager action and selected option for Managed Identity." lightbox="media/authenticate-with-managed-identity/select-managed-identity-consumption.png":::

     1. On the next pane, for **Connection Name**, provide a name to use for the connection.

     1. For the authentication type, choose one of the following options based on your managed connector:

        - **Single-authentication**: These connectors support only one authentication type, which is the managed identity in this case.

          1. From the **Managed Identity** list, select the currently enabled managed identity.

          1. When you're ready, select **Create New**.

        - **Multi-authentication**: These connectors support multiple authentication types, but you can select and use only one type at a time.

          These steps continue by using an **Azure Blob Storage** action as an example.

           1. From the **Authentication Type** list, select **Logic Apps Managed Identity**.

              :::image type="content" source="media/authenticate-with-managed-identity/multi-system-identity-consumption.png" alt-text="Screenshot shows Consumption workflow, connection creation box, and selected option for Logic Apps Managed Identity." lightbox="media/authenticate-with-managed-identity/multi-system-identity-consumption.png":::

           1. When you're ready, select **Create New**.

        For more information, see [Example: Authenticate managed connector trigger or action with a managed identity](#authenticate-managed-connector-managed-identity).

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. If you haven't done so yet, add the [trigger or action that supports managed identities](logic-apps-securing-a-logic-app.md#authentication-types-supported-triggers-actions).

   > [!NOTE]
   >
   > Not all triggers and actions support letting you add an authentication type. For more information, see 
   > [Authentication types for triggers and actions that support authentication](logic-apps-securing-a-logic-app.md#authentication-types-supported-triggers-actions).

1. On the trigger or action that you added, follow these steps:

   - **Built-in operations that support managed identity authentication**

     These steps continue by using the **HTTP** action as an example.

     1. From the **Advanced parameters** list, add the **Authentication** property, if the property doesn't already appear.

        :::image type="content" source="media/authenticate-with-managed-identity/built-in-authentication-standard.png" alt-text="Screenshot shows Standard workflow, example built-in action, opened list named Add new parameter, and selected option for Authentication." lightbox="media/authenticate-with-managed-identity/built-in-authentication-standard.png":::

        Now, both the **Authentication** property and the **Authentication Type** list appear on the action.

        :::image type="content" source="media/authenticate-with-managed-identity/authentication-parameter.png" alt-text="Screenshot shows advanced parameters section with added Authentication property and Authentication Type list." lightbox="media/authenticate-with-managed-identity/authentication-parameter.png":::

     1. From the **Authentication Type** list, select **Managed Identity**.

        :::image type="content" source="media/authenticate-with-managed-identity/built-in-managed-identity-standard.png" alt-text="Screenshot shows Standard workflow, example built-in action, opened Authentication Type list, and selected option for Managed Identity." lightbox="media/authenticate-with-managed-identity/built-in-managed-identity-standard.png":::

        The **Authentication** section now shows the following options:

        - A **Managed Identity** list from where you can select a specific managed identity

        - The **Audience** property appears on specific triggers and actions so that you can set the resource ID for the Azure target resource or service. Otherwise, by default, the **Audience** property uses the **`https://management.azure.com/`** resource ID, which is the resource ID for Azure Resource Manager.
        
        :::image type="content" source="media/authenticate-with-managed-identity/select-specific-managed-identity-standard.png" alt-text="Screenshot shows Authentication section with Authentication Type list and Audience property." lightbox="media/authenticate-with-managed-identity/select-specific-managed-identity-standard.png":::

     1. From the **Managed Identity** list, select the identity that you want to use, for example:

        :::image type="content" source="media/authenticate-with-managed-identity/built-in-select-identity-standard.png" alt-text="Screenshot shows Standard workflow, example built-in action, and selected managed identity selected to use." lightbox="media/authenticate-with-managed-identity/built-in-select-identity-standard.png":::

        > [!NOTE]
        >
        > The default selected option is the **System-assigned managed identity**, 
        > even when you don't have any managed identities enabled.
        > 
        > To successfully use a managed identity, you must first enable that identity on your 
        > logic app. On a Standard logic app, you can have both the system-assigned and 
        > user-assigned managed identity defined and enabled. However, your logic app should 
        > use only one managed identity at a time. 
        >
        > For example, a workflow that accesses different Azure Service Bus messaging entities 
        > should use only one managed identity. See [Connect to Azure Service Bus from workflows](../connectors/connectors-create-api-servicebus.md#prerequisites).

     For more information, see [Example: Authenticate built-in trigger or action with a managed identity](#authenticate-built-in-managed-identity).

   - **Managed connector operations that support managed identity authentication**

     1. On the **Create Connection** pane, from the **Authentication** list, select **Managed Identity**, for example:

        :::image type="content" source="media/authenticate-with-managed-identity/select-managed-identity-option-standard.png" alt-text="Screenshot shows Standard workflow, Azure Resource Manager action, and selected option for Managed Identity." lightbox="media/authenticate-with-managed-identity/select-managed-identity-option-standard.png":::

     1. On the next pane, for **Connection Name**, provide a name to use for the connection.

     1. For the authentication type, choose one of the following options based on your managed connector:

        - **Single-authentication**: These connectors support only one authentication type, which is the managed identity in this case.

          1. From the **Managed Identity** list, select the currently enabled managed identity.

          1. When you're ready, select **Create New**.

        - **Multi-authentication**: These connectors support multiple authentication types, but you can select and use only one type at a time.

          These steps continue by using an **Azure Blob Storage** action as an example.

          1. From the **Authentication Type** list, select **Logic Apps Managed Identity**.

             :::image type="content" source="media/authenticate-with-managed-identity/multi-identity-standard.png" alt-text="Screenshot shows Standard workflow, connection name pane, and selected option for Logic Apps Managed Identity." lightbox="media/authenticate-with-managed-identity/multi-identity-standard.png":::

          1. From the **Managed identity** list, select the identity that you want to use.

             :::image type="content" source="media/authenticate-with-managed-identity/select-multi-identity-standard.png" alt-text="Screenshot shows Standard workflow, the action's Parameters pane, and list named Managed identity." lightbox="media/authenticate-with-managed-identity/select-multi-identity-standard.png":::

          1. When you're ready, select **Create New**.

        For more information, see [Example: Authenticate managed connector trigger or action with a managed identity](#authenticate-managed-connector-managed-identity).

---

<a name="authenticate-built-in-managed-identity"></a>

## Example: Authenticate built-in trigger or action with a managed identity

The built-in HTTP trigger or action can use the system-assigned identity that you enable on your logic app resource. In general, the HTTP trigger or action uses the following properties to specify the resource or entity that you want to access:

| Property | Required | Description |
|----------|----------|-------------|
| **Method** | Yes | The HTTP method that's used by the operation that you want to run |
| **URI** | Yes | The endpoint URL for accessing the target Azure resource or entity. The URI syntax usually includes the resource ID for the target Azure resource or service. |
| **Headers** | No | Any header values that you need or want to include in the outgoing request, such as the content type |
| **Queries** | No | Any query parameters that you need or want to include in the request. For example, query parameters for a specific operation or for the API version of the operation that you want to run. |
| **Authentication** | Yes | The authentication type to use for authenticating access to the Azure target resource or service |

As a specific example, suppose that you want to run the [Snapshot Blob operation](/rest/api/storageservices/snapshot-blob) on a blob in the Azure Storage account where you previously set up access for your identity. However, the [Azure Blob Storage connector](/connectors/azureblob/) doesn't currently offer this operation. Instead, you can run this operation by using the [HTTP action](logic-apps-workflow-actions-triggers.md#http-action) or another [Blob Service REST API operation](/rest/api/storageservices/operations-on-blobs).

> [!IMPORTANT]
>
> To access Azure storage accounts behind firewalls by using the Azure Blob Storage connector 
> and managed identities, make sure that you also set up your storage account with the 
> [exception that allows access by trusted Microsoft services](../connectors/connectors-create-api-azureblobstorage.md#access-blob-storage-in-same-region-with-system-managed-identities).

To run the [Snapshot Blob operation](/rest/api/storageservices/snapshot-blob), the HTTP action specifies the following properties:

| Property | Required | Example value | Description |
|----------|----------|---------------|-------------|
| **URI** | Yes | `https://<storage-account-name>/<folder-name>/{name}` | The resource ID for an Azure Blob Storage file in the Azure Global (public) environment, which uses this syntax |
| **Method** | Yes | `PUT`| The HTTP method that the Snapshot Blob operation uses |
| **Headers** | For Azure Storage | `x-ms-blob-type` = `BlockBlob` <br><br>`x-ms-version` = `2024-05-05` <br><br>`x-ms-date` = `formatDateTime(utcNow(),'r')` | The `x-ms-blob-type`, `x-ms-version`, and `x-ms-date` header values are required for Azure Storage operations. <br><br>**Important**: In outgoing HTTP trigger and action requests for Azure Storage, the header requires the `x-ms-version` property and the API version for the operation that you want to run. The `x-ms-date` must be the current date. Otherwise, your workflow fails with a `403 FORBIDDEN` error. To get the current date in the required format, you can use the expression in the example value. <br><br>For more information, see the following documentation: <br><br>- [Request headers - Snapshot Blob](/rest/api/storageservices/snapshot-blob#request) <br>- [Versioning for Azure Storage services](/rest/api/storageservices/versioning-for-the-azure-storage-services#specifying-service-versions-in-requests) |
| **Queries** | Only for the Snapshot Blob operation | `comp` = `snapshot` | The query parameter name and value for the operation. |

### [Consumption](#tab/consumption)

1. On the workflow designer, add any trigger you want, and then add the **HTTP** action.

   The following example shows a sample HTTP action with all the previously described property values to use for the Snapshot Blob operation:

   :::image type="content" source="media/authenticate-with-managed-identity/http-action-example-consumption.png" alt-text="Screenshot shows Azure portal, Consumption workflow, and HTTP action set up to access resources." lightbox="media/authenticate-with-managed-identity/http-action-example-consumption.png":::

1. In the **HTTP** action, add the **Authentication** property. From the **Advanced parameters** list, select **Authentication**.

   :::image type="content" source="media/authenticate-with-managed-identity/add-authentication-property.png" alt-text="Screenshot shows Consumption workflow with HTTP action and opened Advanced parameters list with selected property named Authentication." lightbox="media/authenticate-with-managed-identity/add-authentication-property.png":::

   The **Authentication** section now appears in your **HTTP** action.

   > [!NOTE]
   >
   > Not all triggers and actions support letting you add an authentication type. For more information, 
   > see [Authentication types for triggers and actions that support authentication](logic-apps-securing-a-logic-app.md#authentication-types-supported-triggers-actions).

1. From the **Authentication Type** list, select **Managed Identity**.

   :::image type="content" source="media/authenticate-with-managed-identity/select-managed-identity.png" alt-text="Screenshot shows Consumption workflow, HTTP action, and Authentication Type property with selected option for Managed Identity." lightbox="media/authenticate-with-managed-identity/select-managed-identity.png":::

1. From the **Managed Identity** list, select from the available options based on your scenario.

   - If you set up the system-assigned identity, select **System-assigned managed identity**.

     :::image type="content" source="media/authenticate-with-managed-identity/select-system-assigned-identity-example.png" alt-text="Screenshot shows Consumption workflow, HTTP action, and Managed Identity property with selected option for System-assigned managed identity." lightbox="media/authenticate-with-managed-identity/select-system-assigned-identity-example.png":::

   - If you set up the user-assigned identity, select that identity.

     :::image type="content" source="media/authenticate-with-managed-identity/select-user-assigned-identity-example.png" alt-text="Screenshot shows Consumption workflow, HTTP action, and Managed Identity property with selected user-assigned identity." lightbox="media/authenticate-with-managed-identity/select-user-assigned-identity-example.png":::

   This example continues with the **System-assigned managed identity**.

1. On some triggers and actions, the **Audience** property appears so that you can set the resource ID for the target Azure resource or service.

   For example, to authenticate access to a [Key Vault resource in the global Azure cloud](/azure/key-vault/general/authentication), you must set the **Audience** property to *exactly* the following resource ID: **`https://vault.azure.net`**

   If you don't set the **Audience** property, by default, the **Audience** property uses the **`https://management.azure.com/`** resource ID, which is the resource ID for Azure Resource Manager.

   > [!IMPORTANT]
   >
   > Make sure that the target resource ID *exactly matches* the value that Microsoft Entra ID expects. 
   > Otherwise, you might get either a **`400 Bad Request`** error or a **`401 Unauthorized`** error. So, if 
   > the resource ID includes any trailing slashes, make sure to include them. Otherwise, don't include 
   > them.
   >
   > For example, the resource ID for all Azure Blob Storage accounts requires a trailing slash. However, 
   > the resource ID for a specific storage account doesn't require a trailing slash. Check the 
   > resource IDs for the [Azure services that support Microsoft Entra ID](/entra/identity/managed-identities-azure-resources/services-id-authentication-support).

   This example sets the **Audience** property to **`https://storage.azure.com/`** so that the access tokens used for authentication are valid for all storage accounts. However, you can also specify the root service URL, **`https://<your-storage-account>.blob.core.windows.net`**, for a specific storage account.

   :::image type="content" source="media/authenticate-with-managed-identity/set-audience-url-target-resource.png" alt-text="Screenshot shows Consumption workflow and HTTP action with Audience property set to target resource ID." lightbox="media/authenticate-with-managed-identity/set-audience-url-target-resource.png":::

   For more information about authorizing access with Microsoft Entra ID for Azure Storage, see the following documentation:

   - [Authorize access to Azure blobs and queues by using Microsoft Entra ID](../storage/blobs/authorize-access-azure-active-directory.md)

   - [Authorize access to Azure Storage with OAuth](/rest/api/storageservices/authorize-with-azure-active-directory#use-oauth-access-tokens-for-authentication)

1. Continue building the workflow the way that you want.

### [Standard](#tab/standard)

1. On the workflow designer, add any trigger you want, and then add the **HTTP** action.

   The following example shows a sample HTTP action with all the previously described property values to use for the Snapshot Blob operation:

   :::image type="content" source="media/authenticate-with-managed-identity/http-action-example-standard.png" alt-text="Screenshot shows Azure portal, Standard workflow, and HTTP action set up to access resources." lightbox="media/authenticate-with-managed-identity/http-action-example-standard.png":::

1. In the **HTTP** action, add the **Authentication** property. From the **Advanced parameters** list, select **Authentication**.

   :::image type="content" source="media/authenticate-with-managed-identity/add-authentication-property.png" alt-text="Screenshot shows Standard workflow and HTTP action with opened Advanced parameters list and selected property named Authentication." lightbox="media/authenticate-with-managed-identity/add-authentication-property.png":::

   The **Authentication** section now appears in your **HTTP** action.

   > [!NOTE]
   >
   > Not all triggers and actions support letting you add an authentication type. For more information, see 
   > [Authentication types for triggers and actions that support authentication](logic-apps-securing-a-logic-app.md#authentication-types-supported-triggers-actions).

1. From the **Authentication type** list, select **Managed Identity**.

   :::image type="content" source="media/authenticate-with-managed-identity/select-managed-identity.png" alt-text="Screenshot shows Standard workflow, HTTP action, and Authentication property with selected option for Managed Identity." lightbox="media/authenticate-with-managed-identity/select-managed-identity.png":::

1. From the **Managed Identity** list, select from the available options based on your scenario.

   - If you set up the system-assigned identity, select **System-assigned managed identity**.

     :::image type="content" source="media/authenticate-with-managed-identity/select-system-assigned-identity-example.png" alt-text="Screenshot shows Standard workflow, HTTP action, and Managed Identity property with selected option for System-assigned managed identity." lightbox="media/authenticate-with-managed-identity/select-system-assigned-identity-example.png":::

   - If you set up a user-assigned identity, select that identity.

     :::image type="content" source="media/authenticate-with-managed-identity/select-user-assigned-identity-example.png" alt-text="Screenshot shows Standard workflow, HTTP action, and Managed Identity property with selected user-assigned identity." lightbox="media/authenticate-with-managed-identity/select-user-assigned-identity-example.png":::

   This example continues with the **System-assigned managed identity**.

1. On some triggers and actions, the **Audience** property appears so that you can set the resource ID for the target Azure resource or service.

   For example, to [authenticate access to a Key Vault resource in the global Azure cloud](/azure/key-vault/general/authentication), you must set the **Audience** property to *exactly* the following resource ID: **`https://vault.azure.net`**

   If you don't set the **Audience** property, by default, the **Audience** property uses the **`https://management.azure.com/`** resource ID, which is the resource ID for Azure Resource Manager.

   > [!IMPORTANT]
   >
   > Make sure that the target resource ID *exactly matches* the value that Microsoft Entra ID expects. 
   > Otherwise, you might get either a **`400 Bad Request`** error or a **`401 Unauthorized`** error. So, if 
   > the resource ID includes any trailing slashes, make sure to include them. Otherwise, don't include 
   > them.
   >
   > For example, the resource ID for all Azure Blob Storage accounts requires a trailing slash. However, 
   > the resource ID for a specific storage account doesn't require a trailing slash. Check the 
   > resource IDs for the [Azure services that support Microsoft Entra ID](/entra/identity/managed-identities-azure-resources/services-id-authentication-support).

   This example sets the **Audience** property to **`https://storage.azure.com/`** so that the access tokens used for authentication are valid for all storage accounts. However, you can also specify the root service URL, **`https://<your-storage-account>.blob.core.windows.net`**, for a specific storage account.

   :::image type="content" source="media/authenticate-with-managed-identity/set-audience-url-target-resource.png" alt-text="Screenshot shows Standard workflow and HTTP action with Audience property set to target resource ID." lightbox="media/authenticate-with-managed-identity/set-audience-url-target-resource.png":::

   For more information about authorizing access with Microsoft Entra ID for Azure Storage, see the following documentation:

   - [Authorize access to Azure blobs and queues by using Microsoft Entra ID](../storage/blobs/authorize-access-azure-active-directory.md)

   - [Authorize access to Azure Storage with OAuth](/rest/api/storageservices/authorize-with-azure-active-directory#use-oauth-access-tokens-for-authentication)

1. Continue building the workflow the way that you want.

---

<a name="authenticate-managed-connector-managed-identity"></a>

## Example: Authenticate managed connector trigger or action with a managed identity

The **Azure Resource Manager** managed connector has an action named **Read a resource**, which can use the managed identity that you enable on your logic app resource. This example shows how to use the system-assigned managed identity with a managed connector.

### [Consumption](#tab/consumption)

1. On the workflow designer, add the **Azure Resource Manager** action named **Read a resource**. 

1. On the **Create Connection** pane, from the **Authentication** list, select **Managed Identity**, and then select **Sign in**.

   > [!NOTE]
   > 
   > In other connectors, the **Authentication Type** list shows 
   > **Logic Apps Managed Identity** instead, so select this option.

   :::image type="content" source="media/authenticate-with-managed-identity/select-managed-identity-consumption.png" alt-text="Screenshot shows Consumption workflow, Azure Resource Manager action, opened Authentication list, and selected option for Managed Identity." lightbox="media/authenticate-with-managed-identity/select-managed-identity-consumption.png":::

1. Provide a name for the connection, and select the managed identity that you want to use.

   If you enabled the system-assigned identity, the **Managed identity** list automatically selects **System-assigned managed identity**. If you enabled a user-assigned identity instead, the list automatically selects the user-assigned identity.

   In this example, **System-assigned managed identity** is the only selection available.

   :::image type="content" source="media/authenticate-with-managed-identity/connection-azure-resource-manager-consumption.png" alt-text="Screenshot shows Consumption workflow and Azure Resource Manager action with connection name entered and selected option for System-assigned managed identity." lightbox="media/authenticate-with-managed-identity/connection-azure-resource-manager-consumption.png":::

   > [!NOTE]
   >
   > If the managed identity isn't enabled when you try to create or change the connection, or if 
   > the managed identity was removed while a managed identity-enabled connection still exists, 
   > you get an error that says you must enable the identity and grant access to the target resource.

1. When you're ready, select **Create New**.

1. After the designer successfully creates the connection, the designer can fetch any dynamic values, content, or schema by using managed identity authentication.

1. Continue building the workflow the way that you want.

### [Standard](#tab/standard)

1. On the workflow designer, add the **Azure Resource Manager** action named **Read a resource**. 

1. On the **Create Connection** pane, from the **Authentication** list, select **Managed Identity**, and then select **Sign in**.

   > [!NOTE]
   > 
   > In other connectors, the **Authentication Type** list shows 
   > **Logic Apps Managed Identity** instead, so select this option.

   :::image type="content" source="media/authenticate-with-managed-identity/select-managed-identity-standard.png" alt-text="Screenshot shows Standard workflow, Azure Resource Manager action, opened Authentication list, and selected option for Managed Identity." lightbox="media/authenticate-with-managed-identity/select-managed-identity-standard.png":::

1. Provide a name for the connection, and select the managed identity that you want to use.

   By default, Standard logic app resources automatically have the system-assigned identity enabled. So, the **Managed identity** list automatically selects **System-assigned managed identity**. If you also enabled one or more user-assigned identities, the **Managed identity** list shows all the currently enabled managed identities, for example:

   :::image type="content" source="media/authenticate-with-managed-identity/connection-azure-resource-manager-standard.png" alt-text="Screenshot shows Standard workflow and Azure Resource Manager action with connection name and all enabled managed identities." lightbox="media/authenticate-with-managed-identity/connection-azure-resource-manager-standard.png":::

   > [!NOTE]
   >
   > If the managed identity isn't enabled when you try to create or change the connection, or if 
   > the managed identity was removed while a managed identity-enabled connection still exists, 
   > you get an error that says you must enable the identity and grant access to the target resource.

1. When you're ready, select **Create New**.

1. After the designer successfully creates the connection, the designer can fetch any dynamic values, content, or schema by using managed identity authentication.

1. Continue building the workflow the way that you want.

---

<a name="logic-app-resource-definition-connection-managed-identity"></a>

## Logic app resource definition and connections that use a managed identity

A connection that enables and uses a managed identity is a special connection type that works only with a managed identity. At runtime, the connection uses the managed identity that's enabled on the logic app resource. Azure Logic Apps checks whether any managed connector operations in the workflow are set up to use the managed identity and that all the required permissions exist to use the managed identity for accessing the target resources specified by the connector operations. If this check is successful, Azure Logic Apps retrieves the Microsoft Entra token that's associated with the managed identity, uses that identity to authenticate access to the target Azure resource, and performs the configured operations in the workflow.

### [Consumption](#tab/consumption)

In a Consumption logic app resource, the connection configuration is saved in the resource definition's **`parameters`** object, which contains the **`$connections`** object that includes pointers to the connection's resource ID along with the managed identity's resource ID when the user-assigned identity is enabled.

This example shows the **`parameters`** object configuration when the logic app enables the *system-assigned* identity:

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

This example shows the **`parameters`** object configuration when the logic app enables the *user-assigned* managed identity:

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

In a Standard logic app resource, the connection configuration is saved in the logic app resource or project's **`connections.json`** file, which contains a **`managedApiConnections`** object that includes connection configuration information for each managed connector used in a workflow. This connection information includes pointers to the connection's resource ID along with the managed identity properties, such as the resource ID when the user-assigned identity is enabled.

This example shows the **`managedApiConnections`** object configuration when the logic app enables the *system-assigned* identity:

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

This example shows the **`managedApiConnections`** object configuration when the logic app enables the *user-assigned* identity:

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

If you use an ARM template to automate deployment, and your workflow includes an API connection, which is created by a [managed connector](../connectors/managed.md) that uses a managed identity, you have an extra step to take.

In an ARM template, the underlying connector resource definition differs based on whether you have a Consumption or Standard logic app resource and whether the [connector shows single-authentication or multi-authentication options](#managed-connectors-managed-identity).

### [Consumption](#tab/consumption)

The following examples apply to Consumption logic app resources and show how the underlying connector resource definition differs between a single-authentication connector and a multi-authentication connector.

#### Single-authentication

This example shows the underlying connection resource definition for a connector action that supports only one authentication type and uses a managed identity in a Consumption logic app workflow where the definition includes the following attributes:

- The **`kind`** property is set to **`V1`** for a Consumption logic app.

- The **`parameterValueType`** property is set to **`Alternative`**.

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
            "id": "[subscriptionResourceId('Microsoft.Web/locations/managedApis', parameters('location'), 'azureautomation')]"
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

#### Multi-authentication

This example shows the underlying connection resource definition for a connector action that supports multiple authentication types and uses a managed identity in a Consumption logic app workflow where the definition includes the following attributes:

- The **`kind`** property is set to **`V1`** for a Consumption logic app.

- The **`parameterValueSet`** object includes a **`name`** property that's set to **`managedIdentityAuth`** and a **`values`** property that's set to an empty object.

```json
{
    "type": "Microsoft.Web/connections",
    "apiVersion": "[providers('Microsoft.Web','connections').apiVersions[0]]",
    "name": "[variables('connections_<connector-name>_name')]",
    "location": "[parameters('location')]",
    "kind": "V1",
    "properties": {
        "alternativeParameterValues":{},
        "api": {
            "id": "[subscriptionResourceId('Microsoft.Web/locations/managedApis', parameters('location'), 'azureblob')]"
        },
        "authenticatedUser": {},
        "connectionState": "Enabled",
        "customParameterValues": {},
        "displayName": "[variables('connections_<connector-name>_name')]",
        "parameterValueSet":{
            "name": "managedIdentityAuth",
            "values": {}
        },
        "parameterValueType": "Alternative"
    }
}
```

### [Standard](#tab/standard)

The following examples apply to Standard logic app resources and show how the underlying connector resource definition differs between a single-authentication connector and a multi-authentication connector.

#### Single-authentication

This example shows the underlying connection resource definition for a connector action that supports only one authentication type and uses a managed identity in a Standard logic app workflow where the definition includes the following attributes:

- The **`kind`** property is set to **`V2`** for a Standard logic app.

- The **`parameterValueType`** property is set to **`Alternative`**.

```json
{
    "type": "Microsoft.Web/connections",
    "name": "[variables('connections_<connector-name>_name')]",
    "apiVersion": "[providers('Microsoft.Web','connections').apiVersions[0]]",
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

#### Multi-authentication

This example shows the underlying connection resource definition for a connector action that supports multiple authentication types and uses a managed identity in a Standard logic app workflow where the definition includes the following attributes:

- The **`kind`** property is set to **`V2`** for a Standard logic app.

- The **`parameterValueSet`** object includes a **`name`** property that's set to **`managedIdentityAuth`** and a **`values`** property that's set to an empty object.

```json
{
    "type": "Microsoft.Web/connections",
    "apiVersion": "[providers('Microsoft.Web','connections').apiVersions[0]]",
    "name": "[variables('connections_<connector-name>_name')]",
    "location": "[parameters('location')]",
    "kind": "V2",
    "properties": {
        "alternativeParameterValues":{},
        "api": {
            "id": "[subscriptionResourceId('Microsoft.Web/locations/managedApis', parameters('location'), '<connector-name>')]"
        },
        "authenticatedUser": {},
        "connectionState": "Enabled",
        "customParameterValues": {},
        "displayName": "[variables('connections_<connector-name>_name')]",
        "parameterValueSet":{
            "name": "managedIdentityAuth",
            "values": {}
        },
        "parameterValueType": "Alternative"
    }
}
```

In the subsequent **Microsoft.Web/connections** resource definition, make sure that you add an access policy that specifies a resource definition for each API connection and provide the following information:

| Parameter | Description |
|-----------|-------------|
| <*connection-name*> | The name for your API connection, for example, **azureblob** |
| <*object-ID*> | The object ID for your Microsoft Entra identity, previously saved from your app registration |
| <*tenant-ID*> | The tenant ID for your Microsoft Entra identity, previously saved from your app registration |

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

## Set up advanced control over API connection authentication

When your Standard logic app workflow uses an API connection, which is created by a [managed connector](../connectors/managed.md), Azure Logic Apps communicates with the target resource, such as your email account, key vault, and so on, using two connections:

:::image type="content" source="media/authenticate-with-managed-identity/api-connection-authentication-flow.png" alt-text="Conceptual diagram shows first connection with authentication between logic app and token store plus second connection between token store and target resource." lightbox="media/authenticate-with-managed-identity/api-connection-authentication-flow.png":::

- Connection #1 is set up with authentication for the internal token store.

- Connection #2 is set up with authentication for the target resource.

However, when a Consumption logic app workflow uses an API connection, connection #1 is abstracted from you without any configuration options. With the Standard logic app resource, you have more control over your logic app and workflows. By default, connection #1 is automatically set up to use the system-assigned identity.

If your scenario requires finer control over authenticating API connections, you can optionally change the authentication for connection #1 from the default system-assigned identity to any user-assigned identity that you added to your logic app. This authentication applies to each API connection, so you can mix system-assigned and user-assigned identities across different connections to the same target resource.

In your Standard logic app's **connections.json** file, which stores information about each API connection, each connection definition has two **`authentication`** sections, for example:

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

- The first **`authentication`** section maps to connection #1.

  This section describes the authentication used for communicating with the internal token store. In the past, this section was always set to **`ManagedServiceIdentity`** for an app that deploys to Azure and had no configurable options.

- The second **`authentication`** section maps to connection #2.

  This section describes the authentication used for communicating with the target resource can vary, based on the authentication type that you select for that connection.

### Why change the authentication for the token store?

In some scenarios, you might want to share and use the same API connection across multiple logic app resources, but not add the system-assigned identity for each logic app resource to the target resource's access policy.

In other scenarios, you might not want to have the system-assigned identity set up on your logic app entirely, so you can change the authentication to a user-assigned identity and disable the system-assigned identity completely.

### Change the authentication for the token store

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource menu, under **Workflows**, select **Connections**.

1. On the **Connections** pane, select **JSON View**.

   :::image type="content" source="media/authenticate-with-managed-identity/connections-json-view.png" alt-text="Screenshot showing the Azure portal, Standard logic app resource, Connections pane with JSON View selected." lightbox="media/authenticate-with-managed-identity/connections-json-view.png":::

1. In the JSON editor, find the **`managedApiConnections`** section, which contains the API connections across all workflows in your logic app resource.

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

1. In the connection definition, complete the following steps:

   1. Find the first **`authentication`** section. If no **`identity`** property exists in this **`authentication`** section, the logic app implicitly uses the system-assigned identity.

   1. Add an **`identity`** property by using the example in this step.

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

To stop using the managed identity for authentication, first [remove the identity's access to the target resource](#disable-identity-target-resource). Next, on your logic app resource, [turn off the system-assigned identity or remove the user-assigned identity](#disable-identity-logic-app).

When you disable the managed identity on your logic app resource, you remove the capability for that identity to request access for Azure resources where the identity had access.

> [!NOTE]
>
> If you disable the system-assigned identity, any and all connections used by workflows in that 
> logic app's workflow won't work at runtime, even if you immediately enable the identity again. 
> This behavior happens because disabling the identity deletes its object ID. Each time that you 
> enable the identity, Azure generates the identity with a different and unique object ID. To resolve 
> this problem, you need to recreate the connections so that they use the current object ID for the 
> current system-assigned identity.
>
> Try to avoid disabling the system-assigned identity as much as possible. If you want to remove 
> the identity's access to Azure resources, remove the identity's role assignment from the target 
> resource. If you delete your logic app resource, Azure automatically removes the managed identity 
> from Microsoft Entra ID.

The steps in this section cover using the [Azure portal](#azure-portal-disable) and [Azure Resource Manager template (ARM template)](#template-disable). For Azure PowerShell, Azure CLI, and Azure REST API, see the following documentation:

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

1. From the target resource's menu, select **Access control (IAM)**. Under the toolbar, select **Role assignments**.

1. In the roles list, select the managed identities that you want to remove. On the toolbar, select **Remove**.

   > [!TIP]
   >
   > If the **Remove** option is disabled, you most likely don't have permissions. 
   > For more information about the permissions that let you manage roles for resources, see 
   > [Administrator role permissions in Microsoft Entra ID](/entra/identity/role-based-access-control/permissions-reference).

<a name="disable-identity-logic-app"></a>

#### Disable managed identity on logic app resource

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. On the logic app resource menu, under **Settings**, select **Identity**, and then follow the steps for your identity:

   - Select **System assigned** > **Off** > **Save**. When Azure prompts you to confirm, select **Yes**.

   - Select **User assigned** and the managed identity, and then select **Remove**. When Azure prompts you to confirm, select **Yes**.

<a name="template-disable"></a>

### Disable managed identity in an ARM template

If you created the logic app's managed identity by using an ARM template, set the **`identity`** object's **`type`** child property to **`None`**.

```json
"identity": {
   "type": "None"
}
```

## Related content

- [Secure access and data in Azure Logic Apps](logic-apps-securing-a-logic-app.md)
