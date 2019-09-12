---
title: Authenticate with managed identities - Azure Logic Apps
description: To authenticate without signing in, you can create a managed identity (formerly called Managed Service Identity or MSI) so your logic app can access resources in other Azure Active Directory (Azure AD) tenants without credentials or secrets
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
services: logic-apps
ms.service: logic-apps
ms.suite: integration
ms.topic: article
ms.date: 03/29/2019
---

# Authenticate and access resources with managed identities in Azure Logic Apps

To access resources in other Azure Active Directory (Azure AD) tenants and authenticate your identity without signing in, your logic app can use a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) (formerly known as Managed Service Identity or MSI), rather than credentials or secrets. Azure manages this identity for you and helps secure your credentials because you don't have to provide or rotate secrets. Your logic app can use managed identities only with connectors that support managed identities. Currently, these connectors are supported:

* [*System-assigned* managed identity](../active-directory/managed-identities-azure-resources/overview.md#how-does-it-work): HTTP, Azure Functions, and Azure API Management built-in connectors

  Currently, you can currently have up to 100 logic app workflows with system-assigned managed identities in each Azure subscription.

* [*User-assigned* managed identity](../active-directory/managed-identities-azure-resources/overview.md#how-does-it-work): 

This article shows how to set up and use both kinds of managed identities for your logic app. 

## Prerequisites

* An Azure subscription, or if you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* The logic app where you want to use the system-assigned or user-assigned managed identity. If you don't have a logic app, see 
[Create your first logic app workflow](../logic-apps/quickstart-create-first-logic-app-workflow.md).

<a name="enable-identity"></a>

## Enable managed identity

Choose either the steps for either [system-assigned identities](#system-assigned-identity) or [user-assigned identities](#user-assigned-identity).

<a name="system-assigned-identity"></a>

### Enable system-assigned identity

You don't have to manually create system-assigned managed identities. To set up a system-assigned managed identity for your logic app, you have these options:

* [Azure portal](#azure-portal-system)
* [Azure Resource Manager templates](#template-system)
* [Azure PowerShell](../active-directory/managed-identities-azure-resources/howto-assign-access-powershell.md)

<a name="azure-portal-system"></a>

#### Azure portal for system-assigned identities

1. In the [Azure portal](https://portal.azure.com), open your logic app in Logic App Designer.

1. On the logic app menu, under **Settings**, select **Identity**.

1. Under **System assigned** > **Status**, select **On**. Then, select **Save** > **Yes**.

   ![Turn on managed identity setting](./media/create-managed-service-identity/turn-on-managed-service-identity.png)

   Your logic app now has a system-assigned managed identity registered in Azure Active Directory:

   ![GUIDs for object ID](./media/create-managed-service-identity/object-id.png)

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Object ID** | <*identity-resource-ID*> | A Globally Unique Identifier (GUID) that represents the system-assigned managed identity for your logic app in an Azure AD tenant |
   ||||

<a name="template-system"></a>

#### Azure Resource Manager template for system-assigned identities

When you want to automate creating and deploying Azure resources such as logic apps, you can use [Azure Resource Manager templates](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md). To create a system-assigned managed identity for your logic app by using a template, add the `"identity"` element and `"type"` property to your logic app workflow definition in your deployment template: 

```json
"identity": {
   "type": "SystemAssigned"
}
```

For example:

```json
{
   "apiVersion": "2016-06-01", 
   "type": "Microsoft.logic/workflows", 
   "name": "[variables('logicappName')]", 
   "location": "[resourceGroup().location]", 
   "identity": { 
      "type": "SystemAssigned" 
   }, 
   "properties": { 
      "definition": { 
         "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#", 
         "actions": {}, 
         "parameters": {}, 
         "triggers": {}, 
         "contentVersion": "1.0.0.0", 
         "outputs": {} 
   }, 
   "parameters": {}, 
   "dependsOn": [] 
}
```

When Azure creates your logic app, that logic app's workflow definition includes these additional properties:

```json
"identity": {
   "type": "SystemAssigned",
   "principalId": "<principal-ID>",
   "tenantId": "<Azure-AD-tenant-ID>"
}
```

| Property | Value | Description |
|----------|-------|-------------|
| **principalId** | <*principal-ID*> | A Globally Unique Identifier (GUID) that represents the logic app in the Azure AD tenant and sometimes appears as an "object ID" or `objectID` |
| **tenantId** | <*Azure-AD-tenant-ID*> | A Globally Unique Identifier (GUID) that represents the Azure AD tenant where the logic app is now a member. Inside the Azure AD tenant, the service principal has the same name as the logic app instance. |
||||

<a name="user-assigned"></a>

### Enable user-assigned identities

To set up a user-assigned managed identity for your logic app, you must first create a user-assigned managed identity resource in Azure. You have these options:

* [Azure portal](#azure-portal-user)
* [Azure Resource Manager templates](#template-user)
* [Azure PowerShell](../active-directory/managed-identities-azure-resources/howto-assign-access-powershell.md)

<a name="azure-portal-user"></a>

#### Azure portal for user-assigned identities

1. In the [Azure portal](https://portal.azure.com), on the main Azure menu, select **Create a resource**. In the search box, enter "user assigned managed identity", and select **User Assigned Managed Identity**. On the next page, select **Create**.

1. Provide this information about your user-assigned managed identity, and then select **Create**.

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Resource Name** | Yes | <*user-assigned-identity-name*> | The name for the user-assigned managed identity |
   | **Subscription** | Yes | <*Azure-subscription-name*> | The name for the Azure subscription to use |
   | **Resource group** | Yes | <*Azure-resource-group-name*> | The name for the resource group to use. Create a new group, or select an existing group. |
   | **Location** | Yes | <*Azure-region*> | The Azure region where you want to store information about your resource |
   |||||

1. In the Azure portal, find and open your logic app in Logic App Designer.

1. On the logic app menu, under **Settings**, select **Identity**.

1. Under **User assigned**, select **Add**.

   ![Turn on managed identity setting](./media/create-managed-service-identity/turn-on-managed-service-identity.png)

1. 

Then, select **Save** > **Yes**.

   Your logic app now has a system-assigned managed identity registered in Azure Active Directory:

   ![GUIDs for object ID](./media/create-managed-service-identity/object-id.png)

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Object ID** | <*identity-resource-ID*> | A Globally Unique Identifier (GUID) that represents the system-assigned managed identity for your logic app in an Azure AD tenant |
   ||||


<a name="access-other-resources"></a>

## Access resources with managed identity

After you create a system-assigned managed identity for your logic app, you can [give that identity access to other Azure resources](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md). You can then use that identity for authentication, just like any other [service principal](../active-directory/develop/app-objects-and-service-principals.md). 

> [!NOTE]
> Both the system-assigned managed identity and the resource where 
> you want to assign access must have the same Azure subscription.

### Assign access to managed identity

To give access to another Azure resource for your logic app's system-assigned managed identity, follow these steps:

1. In the Azure portal, go to the Azure resource where you want to assign access for your managed identity.

1. From the resource's menu, select **Access control (IAM)**. On the toolbar, select **Add** > **Add role assignment**.

   ![Add role assignment](./media/create-managed-service-identity/add-permissions-logic-app.png)

1. Under **Add role assignment**, select the **Role** you want for the identity.

1. In the **Assign access to** property, select **Azure AD user, group, or service principal**, if not already selected.

1. In the **Select** box, starting with the first character in your logic app's name, enter your logic app's name. When your logic app appears, select the logic app.

   ![Select logic app with managed identity](./media/create-managed-service-identity/add-permissions-select-logic-app.png)

1. When you're done, select **Save**.

### Authenticate with managed identity in logic app

After you set up your logic app with a system-assigned managed identity and assigned access to the resource you want for that identity, you can now use that identity for authentication. For example, you can use an HTTP action so your logic app can send an HTTP request or call to that resource. 

1. In your logic app, add the **HTTP** action.

1. Provide the necessary details for that action, such as the request **Method** and **URI** location for the resource you want to call.

   For example, suppose you're using Azure Active Directory (Azure AD) authentication with [one of these Azure services that support Azure AD](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication). In the **URI** box, enter the endpoint URL for that Azure service. So, if you're using Azure Resource Manager, enter this value in the **URI** property:

   `https://management.azure.com/subscriptions/<Azure-subscription-ID>?api-version=2016-06-01`

1. In the HTTP action, select **Show advanced options**.

1. From the **Authentication** list, select **Managed Identity**. After you select this authentication, the **Audience** property 
appears with the default resource ID value:

   ![Select "Managed Identity"](./media/create-managed-service-identity/select-managed-service-identity.png)

   > [!IMPORTANT]
   > 
   > In the **Audience** property, the resource ID value must exactly match 
   > what Azure AD expects, including any required trailing slashes. 
   > You can find these resource ID values in this 
   > [table describing Azure services that support Azure AD](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication). 
   > For example, if you're using the Azure Resource Manager resource ID, 
   > make sure the URI has a trailing slash.

1. Continue building the logic app the way you want.

<a name="remove-identity"></a>

## Remove managed identity

To disable a system-assigned managed identity on your logic app, you can follow the steps similar to how you set up the identity through the Azure portal, Azure Resource Manager deployment templates, or Azure PowerShell.

When you delete your logic app, Azure automatically removes your logic app's system-assigned identity from Azure AD.

### Azure portal

To remove a system-assigned managed identity for your logic app through the Azure portal, turn off the **System assigned** setting in your logic app's identity settings.

1. In the [Azure portal](https://portal.azure.com), open your logic app in Logic App Designer.

1. On the logic app menu, under **Settings**, select **Identity**.

1. Under **System assigned** > **Status**, select **Off**. Then, select **Save** > **Yes**.

   ![Turn off managed identity setting](./media/create-managed-service-identity/turn-off-managed-service-identity.png)

### Deployment template

If you created the logic app's system-assigned managed identity with an Azure Resource Manager deployment template, set the `"identity"` element's `"type"` property to `"None"`. This action also deletes the principal ID from Azure AD.

```json
"identity": {
   "type": "None"
}
```

## Next steps

* [Secure access and data in Azure Logic Apps](../logic-apps/logic-apps-securing-a-logic-app.md)