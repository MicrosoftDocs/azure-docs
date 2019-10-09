---
title: Authenticate with managed identities - Azure Logic Apps
description: Access resources in other Azure Active Directory tenants without signing in with credentials or secrets by using a managed identity
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
services: logic-apps
ms.service: logic-apps
ms.suite: integration
ms.topic: article
ms.date: 10/11/2019
---

# Authenticate access to Azure resources by using managed identities in Azure Logic Apps

To access resources in other Azure Active Directory (Azure AD) tenants and authenticate your identity without signing in, your logic app can use a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) (formerly known as Managed Service Identity or MSI), rather than credentials or secrets. Azure manages this identity for you and helps secure your credentials because you don't have to provide or rotate secrets.

Your logic app can use managed identities only with connectors that support managed identities. Currently, you can use the system-assigned identity with these triggers and actions:

* HTTP
* Azure Functions
* Azure API Management

This article shows how to set up and use the system-assigned managed identity for your logic app. For limits on managed identities for logic apps, see [Managed identity limits](../logic-apps/logic-apps-limits-and-config.md#managed-identity).

## Prerequisites

* An Azure subscription, or if you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/). The managed identity and the target Azure resource that you want to access have to exist in the same Azure subscription.

* To give a managed identity access to an Azure resource, you need to add a role to the target resource for that identity. To add roles, you need [Azure AD administrator permissions](../active-directory/users-groups-roles/directory-assign-admin-roles.md) that can assign roles to identities in the corresponding Azure AD tenant.

* The target Azure resource that you want to access by using the managed identity that represents your logic app

* The logic app where you want to use the managed identity

<a name="system-assigned"></a>

## Enable system-assigned identity

Unlike user-assigned identities, you don't have to manually create the system-assigned identity. To set up your logic app's system-assigned identity, here are the options that you can use:

* [Azure portal](#azure-portal) 
* [Azure Resource Manager templates](#template)
* [Azure PowerShell](../active-directory/managed-identities-azure-resources/howto-assign-access-powershell.md)

<a name="azure-portal"></a>

### Enable system-assigned identity in Azure portal

1. In the [Azure portal](https://portal.azure.com), open your logic app in Logic App Designer.

1. On the logic app menu, under **Settings**, select **Identity**.

1. Under **System assigned** > **Status**, select **On** > **Save** > **Yes**.

   ![Enable the system-assigned identity](./media/create-managed-service-identity/turn-on-system-assigned-identity.png)

   Your logic app can now use the system-assigned identity, which is registered with Azure Active Directory and is represented by an object ID.

   ![Object ID for system-assigned identity](./media/create-managed-service-identity/object-id.png)

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Object ID** | <*identity-resource-ID*> | A Globally Unique Identifier (GUID) that represents the system-assigned identity for your logic app in your Azure AD tenant |
   ||||

<a name="template"></a>

### Enable system-assigned identity in Azure Resource Manager template

To automate creating and deploying Azure resources such as logic apps, you can use [Azure Resource Manager templates](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md). To set up the system-assigned managed identity for your logic app in the template, add the `identity` object and the `type` child property to the corresponding resource definition in the template. Here is an example for a logic app resource definition:

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

When Azure creates your logic app, the `identity` object gets these additional properties:

```json
"identity": {
   "type": "SystemAssigned",
   "principalId": "<principal-ID>",
   "tenantId": "<Azure-AD-tenant-ID>"
}
```

| Property | Value | Description |
|----------|-------|-------------|
| **principalId** | <*principal-ID*> | The Globally Unique Identifier (GUID) of the service principal object for the managed identity that represents your logic app in the Azure AD tenant. This GUID sometimes appears as an "object ID" or `objectID`. |
| **tenantId** | <*Azure-AD-tenant-ID*> | The Globally Unique Identifier (GUID) that represents the Azure AD tenant where the logic app is now a member. Inside the Azure AD tenant, the service principal has the same name as the logic app instance. |
||||

<a name="access-other-resources"></a>

## Give identity access to resources

After you set up a managed identity for your logic app, you can [give that identity access to other Azure resources](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md). You can then use that identity for authentication.

1. In the Azure portal, go to the Azure resource where you want your managed identity to have access.

1. From the resource's menu, select **Access control (IAM)** > **Role assignments**, which lists the current role assignments for that resource. On the toolbar, select **Add** > **Add role assignment**.

   ![Add role assignment](./media/create-managed-service-identity/add-role-to-resource.png)

   > [!TIP]
   > If the **Add role assignment** option is disabled, you most likely don't have permissions. 
   > For more information about the permissions that let you manage roles for resources, see 
   > [Administrator role permissions in Azure Active Directory](../active-directory/users-groups-roles/directory-assign-admin-roles.md).

1. Under **Add role assignment**, select the **Role** for the identity. Learn more about [role-based access control (RBAC) roles](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-rbac-roles).

   ![Assign role](./media/create-managed-service-identity/assign-role.png)

1. In the **Assign access to** box, select **Azure AD user, group, or service principal**.

   ![Select access for system-assigned identity](./media/create-managed-service-identity/assign-access-system.png)

1. In the **Select** box, find and select your logic app.

   ![Select logic app for system-assigned identity](./media/create-managed-service-identity/add-permissions-select-logic-app.png)

1. When you're done, select **Save**.

   The target resource's role assignments list now shows the selected managed identity and role.

For more information, see [Assign a managed identity access to a resource](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md).

## Authenticate with managed identity

Now that your logic app has a managed identity and that identity can access the target resource, you can use that identity for authentication. Each built-in action type has slightly different steps:

* HTTP
* Azure Functions
* Azure API Management

For example, suppose you want to use Azure Active Directory (Azure AD) authentication with an [Azure service that supports Azure AD](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication). This example shows how you use the managed identity to authenticate access in an HTTP action that sends an HTTP call to the target service.

1. In your logic app, add the **HTTP** action.

1. Provide the necessary details for that action, such as the request **Method** and **URI** location for the resource that you want to call. In the **URI** box, enter the endpoint URL for that Azure service. So, if you're using Azure Resource Manager, enter this value in the **URI** property:

   `https://management.azure.com/subscriptions/<Azure-subscription-ID>?api-version=2016-06-01`

1. From the **Authentication** list, select **Managed Identity**. After you make your selection, the **Audience** property appears. By default, the property is set to the target resource ID.

   ![Select "Managed Identity"](./media/create-managed-service-identity/select-managed-identity.png)

   > [!IMPORTANT]
   >
   > In the **Audience** property, the resource ID value must exactly match the value that Azure AD expects, 
   > including any required trailing slashes. You can find these resource ID values in this 
   > [table that describes the Azure services that support Azure AD](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication). 
   > For example, if you're using the Azure Resource Manager resource ID, make sure that the URI has a trailing slash.

1. Continue building the logic app the way you want.

<a name="remove-identity"></a>

## Remove system-assigned identity

To stop using the system-assigned identity for your logic app, you have these options:

* [Azure portal](#azure-portal-disable)
* [Azure Resource Manager templates](#template-disable)

If you delete your logic app, Azure automatically removes the managed identity from Azure AD.

<a name="azure-portal-disable"></a>

### Remove system-assigned identity in the Azure portal

In the Azure portal, follow these steps:

* Remove the system-assigned identity from [your logic app](#disable-identity-logic-app).

* Remove the system-assigned identity's access from [your target resource](#disable-identity-target-resource).

<a name="disable-identity-logic-app"></a>

#### Remove system-assigned identity from logic app

1. In the [Azure portal](https://portal.azure.com), open your logic app in Logic App Designer.

1. On the logic app menu, under **Settings**, select **Identity** > **System assigned**. Under **Status**, select **Off** > **Save** > **Yes**.

   ![Stop using system-assigned identity](./media/create-managed-service-identity/turn-off-system-assigned-identity.png)

<a name="disable-identity-target-resource"></a>

#### Remove managed identity from target resource

1. From the target resource's menu, select **Access control (IAM)**. Under the toolbar, select **Role assignments**.

1. In the roles list, select the managed identities that you want to remove. On the toolbar, select **Remove**.

   > [!TIP]
   > If the **Remove** option is disabled, you most likely don't have permissions. 
   > For more information about the permissions that let you manage roles for resources, see [Administrator role permissions in Azure Active Directory](../active-directory/users-groups-roles/directory-assign-admin-roles.md).

The managed identity is now removed and no longer has access to the target resource.

<a name="template-disable"></a>

### Disable managed identity in Azure Resource Manager template

If you enabled the logic app's system-managed identity by using an Azure Resource Manager template, set the `identity` object's `type` child property to `None`. This action also deletes the principal ID for the system-managed identity from Azure AD.

```json
"identity": {
   "type": "None"
}
```

## Next steps

* [Secure access and data in Azure Logic Apps](../logic-apps/logic-apps-securing-a-logic-app.md)
