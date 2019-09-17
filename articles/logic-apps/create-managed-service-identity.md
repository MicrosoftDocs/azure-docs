---
title: Authenticate with managed identities - Azure Logic Apps
description: To authenticate without signing in, set up a managed identity (formerly Managed Service Identity or MSI) so that your logic app can access resources in other Azure Active Directory (Azure AD) tenants without credentials or secrets
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
services: logic-apps
ms.service: logic-apps
ms.suite: integration
ms.topic: article
ms.date: 09/19/2019
---

# Authenticate access to resources with managed identities in Azure Logic Apps

To access resources in other Azure Active Directory (Azure AD) tenants and authenticate your identity without signing in, your logic app can use a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) (formerly Managed Service Identity or MSI), rather than credentials or secrets. Azure manages this identity for you and helps secure your credentials because you don't have to provide or rotate secrets.

Azure Logic Apps supports both [*system-assigned*](../active-directory/managed-identities-azure-resources/overview.md#how-does-it-work) and [*user-assigned*](../active-directory/managed-identities-azure-resources/overview.md#how-does-it-work) managed identities. Your logic app can use either the system-assigned identity or a user-assigned identity, which you can share across a group of logic apps, but not both. You can use a managed identity for authentication in these built-in triggers and actions:

* HTTP
* Azure Functions
* Azure API Management

This article shows how to set up either managed identity on your logic app. For limits on managed identities for logic apps, see [Managed identity limits](../logic-apps/logic-apps-limits-and-config.md#managed-identity).

## Prerequisites

* An Azure subscription, or if you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/). The managed identity and the target Azure resource must use the same Azure subscription.

* To give a managed identity access to an Azure resource, you need to add a role to the target resource for that identity. To add roles, you need [Azure AD administrator permissions](../active-directory/users-groups-roles/directory-assign-admin-roles.md) that can assign roles to identities in the corresponding Azure AD tenant.

* The logic app where you want to enable the managed identity, either system-assigned or user-assigned. If you don't have a logic app, see [Create your first logic app workflow](../logic-apps/quickstart-create-first-logic-app-workflow.md).

* The target resource where you want to add a role for the managed identity, which helps the logic app authenticate access to the target resource

<a name="enable-identity"></a>

## Enable managed identity

Follow the link for the managed identity that you want:

* [System-assigned identity](#system-assigned)
* [User-assigned identity](#user-assigned)

<a name="system-assigned"></a>

### Enable system-assigned identity

To set up the system-assigned identity, enable the identity directly on your logic app. Here are the options that you can use:

* [Azure portal](#azure-portal-system)
* [Azure Resource Manager templates](#template-system)

<a name="azure-portal-system"></a>

#### Enable system-assigned identity in the Azure portal

1. In the [Azure portal](https://portal.azure.com), open your logic app in Logic App Designer.

1. On the logic app menu, under **Settings**, select **Identity**. Under **System assigned** > **Status**, select **On** > **Save** > **Yes**.

   ![Enable system-assigned identity](./media/create-managed-service-identity/turn-on-system-assigned-identity.png)

   > [!NOTE]
   > If you can't select **Save**, your logic app is already associated with a user-assigned identity.

   Your logic app now uses the system-assigned managed identity, which is registered with Azure Active Directory.

   ![GUIDs for object ID](./media/create-managed-service-identity/object-id.png)

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Object ID** | <*identity-resource-ID*> | A Globally Unique Identifier (GUID) that represents the system-assigned managed identity for your logic app in an Azure AD tenant |
   ||||

1. To set up this managed identity for authenticating access to other resources, see [Set up access to other resources](#access-other-resources) later in this topic.

<a name="template-system"></a>

#### Enable system-assigned identity in an Azure Resource Manager template

To automate creating and deploying Azure resources such as logic apps, you can use [Azure Resource Manager templates](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md). To set up the system-assigned managed identity for your logic app by using a template, add the `"identity"` object and the `"type"` child property to your logic app's resource definition in the template, for example:

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

When Azure creates your logic app, the `"identity"` object includes these additional properties:

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

<a name="user-assigned"></a>

### Enable user-assigned identity

To set up a user-assigned managed identity for your logic app, you must first create that identity as a separate standalone Azure resource. Here are the options that you can use:

* [Azure portal](#azure-portal-user)
* [Azure Resource Manager templates](#template-user)

<a name="azure-portal-user"></a>

#### Create user-assigned identity in the Azure portal

1. In the [Azure portal](https://portal.azure.com), on the main Azure menu, select **Create a resource**. In the search box, enter "user assigned managed identity", and select **User Assigned Managed Identity**. On the next page, select **Create**.

   ![Find user-assigned managed identity](./media/create-managed-service-identity/find-user-assigned-identity.png)

1. Provide information about your user-assigned managed identity, and then select **Create**, for example:

   ![Create user-assigned managed identity](./media/create-managed-service-identity/create-user-assigned-identity.png)

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Resource Name** | Yes | <*user-assigned-identity-name*> | The name to give your user-assigned identity. This example uses "Fabrikam-user-assigned-identity". |
   | **Subscription** | Yes | <*Azure-subscription-name*> | The name for the Azure subscription to use |
   | **Resource group** | Yes | <*Azure-resource-group-name*> | The name for the resource group to use. Create a new group, or select an existing group. This example creates a new group named "fabrikam-managed-identities-RG". |
   | **Location** | Yes | <*Azure-region*> | The Azure region where to store information about your resource. This example uses "West US". |
   |||||

   Now you can add the user-assigned identity to your logic app.

1. In the Azure portal, find and open your logic app in Logic App Designer.

1. On the logic app menu, under **Settings**, select **Identity**. Then, select **User assigned** > **Add**.

   ![Add user-assigned identity](./media/create-managed-service-identity/turn-on-user-assigned-identity.png)

   > [!NOTE]
   > If you can't select **Add**, your logic app is already associated with the system-assigned identity.

1. Under **Add user assigned managed identity**, in the **Subscription** list, if the Azure subscription that you want isn't selected, select that subscription. From the list that shows *all* the managed identities in that subscription, select the user-assigned identity that you want, and then select **Add**.

   > [!TIP]
   > In the **User assigned managed identities** search box, you can filter 
   > by the name for the identity or the resource group.

   ![Select the user-assigned identity to use](./media/create-managed-service-identity/select-user-assigned-identity.png)

   Your logic app is now associated with a user-assigned managed identity:

   ![Added user-assigned identity](./media/create-managed-service-identity/added-user-assigned-identity.png)

1. To set up this managed identity for access to other resources, see [Set up access to other resources](#access-other-resources) later in this topic.

<a name="template-user"></a>

#### Create user-assigned identity in an Azure Resource Manager template

To automate creating and deploying Azure resources such as logic apps, you can use [Azure Resource Manager templates](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md). To set up a user-assigned managed identity for your logic app by using a template, add these items to your logic app's resource definition in the template:

* An `"identity"` object that has a `"type"` child property that's set to `"UserAssigned"`

* A child `"userAssignedIdentities"` object in the `"identity"` object. The child object references a variable named `userAssignedIdentity` that you define in your template's `variables` section. The variable references the name for your user-assigned identity.

For example:

```json
{
   "apiVersion": "2016-06-01",
   "type": "Microsoft.logic/workflows",
   "name": "[variables('logicappName')]",
   "location": "[resourceGroup().location]",
   "identity": {
      "type": "UserAssigned",
      "userAssignedIdentities": {
         "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities/', variables('userAssignedIdentity'))]": {}
      }
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
   "dependsOn": [
      "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities/', variables('userAssignedIdentity'))]"
   ]
}
```

When Azure creates your logic app, the child `"userAssignedIdentities"` object includes additional properties:

```json
"identity": {
   "type": "UserAssigned",
   "userAssignedIdentities": {
      "<user-assigned-managed-identity-resource-ID>": {
         "principalId": "<principal-ID>",
         "clientId": "<client-ID>"
      }
   }
}
```

| Property | Value | Description |
|----------|-------|-------------|
| **principalId** | <*principal-ID*> | The Globally Unique Identifier (GUID) for the managed identity in the Azure AD tenant |
| **clientId** | <*cilent-ID*> | A Globally Unique Identifier (GUID) for your logic app's new identity that's used for calls during runtime |
||||

<a name="access-other-resources"></a>

## Set up access to other resources

After you set up either the system-assigned or user-assigned identity for your logic app, you can give that identity access to other Azure resources so that you can use that identity for authentication.

1. In the Azure portal, go to the Azure resource where you want your managed identity to have access.

1. From the resource's menu, select **Access control (IAM)** > **Role assignments** where you can view the current role assignments for that resource. On the toolbar, select **Add** > **Add role assignment**.

   ![Add role assignment](./media/create-managed-service-identity/add-role-to-resource.png)

   > [!TIP]
   > If the **Add role assignment** option is disabled, you most likely don't have permissions. 
   > For more information about the permissions that let you manage roles for resources, see [Administrator role permissions in Azure Active Directory](../active-directory/users-groups-roles/directory-assign-admin-roles.md).

1. Under **Add role assignment**, select the **Role** for the identity. Learn more about [role-based access control (RBAC) roles](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-rbac-roles).

   ![Assign role](./media/create-managed-service-identity/assign-role.png)

1. Follow these steps for your managed identity:

   **System-assigned**

   1. In the **Assign access to** box, select **Azure AD user, group, or service principal**.

      ![Select access for system-assigned identity](./media/create-managed-service-identity/assign-access-system.png)

   1. In the **Select** box, find and select your logic app.

      ![Select logic app for system-assigned identity](./media/create-managed-service-identity/add-permissions-select-logic-app.png)

   **User-assigned**

   1. In the **Assign access to** box, select **User assigned managed identity**. When the **Subscription** property appears, select the Azure subscription that's associated with your identity.

      ![Select access for user-assigned identity](./media/create-managed-service-identity/assign-access-user.png)

   1. In the **Select** box, find and select your identity.

      ![Select user-assigned identity](./media/create-managed-service-identity/add-permissions-select-user-assigned-identity.png)

1. When you're done, select **Save**.

The target resource's role assignments list now shows the selected managed identity and role. This example shows how you can use the system-assigned identity for one logic app and a user-assigned identity for a group of other logic apps.

![Added managed identities and roles to target resource](./media/create-managed-service-identity/added-roles-for-identities.png)

For more information, see [Assign a managed identity access to a resource](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md).

## Authenticate with managed identity

Now that your logic app has a managed identity and that identity can access the target resource, you can use that identity for authentication. For example, suppose you want to use Azure Active Directory (Azure AD) authentication with an [Azure service that supports Azure AD](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication). This example shows how you use the managed identity to authenticate access in an HTTP action that sends an HTTP call to the target service.

1. In your logic app, add the **HTTP** action.

1. Provide the necessary details for that action, such as the request **Method** and **URI** location for the resource you want to call.

   In the **URI** box, enter the endpoint URL for the Azure service that you want to access. So, if you're using Azure Resource Manager, enter this value in the **URI** property:

   `https://management.azure.com/subscriptions/<Azure-subscription-ID>?api-version=2016-06-01`

1. Open the **Authentication** list, and select **Managed Identity**.

1. Select either **System assigned** or **User assigned**. If you select **User assigned**, select the identity that you want to use.

1. Open the **Add new parameter** list, and select **Audience**.

   The **Audience** property now appears as a row in the HTTP action and shows the default resource ID value:

   ![Select "Managed Identity"](./media/create-managed-service-identity/select-managed-service-identity.png)

   > [!IMPORTANT]
   >
   > In the **Audience** property, the resource ID value must exactly match the value that Azure AD expects, 
   > including any required trailing slashes. You can find these resource ID values in this 
   > [table that describes the Azure services that support Azure AD](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication). 
   > For example, if you're using the Azure Resource Manager resource ID, make sure that the URI has a trailing slash.

1. Continue building the logic app the way that you want.

<a name="remove-identity"></a>

## Remove managed identity

To stop using a managed identity for your logic app, you have these options:

* [Azure portal](#azure-portal-disable)
* [Azure Resource Manager templates](#template-disable)

If you delete your logic app, Azure automatically removes the managed identity from Azure AD.

<a name="azure-portal-disable"></a>

### Remove managed identity in the Azure portal

In the Azure portal, remove the identity from [your logic app](#disable-identity-logic-app) and from [your target resource](#disable-identity-target-resource).

<a name="disable-identity-logic-app"></a>

#### Remove managed identity from logic app

1. In the [Azure portal](https://portal.azure.com), open your logic app in Logic App Designer.

1. On the logic app menu, under **Settings**, select **Identity**, and follow the steps for your identity:

   **System-assigned**

   Select **System assigned** > **Status** > **Off** > **Save** > **Yes**.

   ![Stop using system-assigned identity](./media/create-managed-service-identity/turn-off-system-assigned-identity.png)

   **User-assigned**

   Select **User assigned** and the managed identity that you want to remove. Select **Remove**.

   ![Stop using user-assigned identity](./media/create-managed-service-identity/turn-off-user-assigned-identity.png)

The managed identity is now removed from your logic app.

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

If you created the logic app's managed identity by using an Azure Resource Manager template, set the `"identity"` object's `"type"` child property to `"None"`. For the system-managed identity, this action also deletes the principal ID from Azure AD.

```json
"identity": {
   "type": "None"
}
```

## Next steps

* [Secure access and data in Azure Logic Apps](../logic-apps/logic-apps-securing-a-logic-app.md)
