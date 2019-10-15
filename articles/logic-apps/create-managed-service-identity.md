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

To access resources in other Azure Active Directory (Azure AD) tenants and authenticate your identity without signing in, your logic app can use a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) (formerly known as Managed Service Identity or MSI), rather than credentials or secrets. Azure manages this identity for you and helps secure your credentials because you don't have to provide or rotate secrets. Learn more about [Azure services that support managed identities for Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication), such as Azure Resource Manager.

Your logic app can use managed identities only in [triggers and actions that support managed identities](logic-apps-securing-a-logic-app.md#managed-identity-authentication). This article shows how to set up and use the system-assigned managed identity for your logic app. For limits on managed identities in logic apps, see [Managed identity limits](../logic-apps/logic-apps-limits-and-config.md#managed-identity). For more information about the authentication types where available in triggers and actions, see [Add authentication to outbound calls](logic-apps-securing-a-logic-app.md#add-authentication-outbound).

## Prerequisites

* An Azure subscription, or if you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/). The managed identity and the target Azure resource that you want to access have to exist in the same Azure subscription.

* To give a managed identity access to an Azure resource, you need to add a role to the target resource for that identity. To add roles, you need [Azure AD administrator permissions](../active-directory/users-groups-roles/directory-assign-admin-roles.md) that can assign roles to identities in the corresponding Azure AD tenant.

* The target Azure resource that you want to access by using the managed identity that represents your logic app

* The logic app where you want to use the managed identity

<a name="system-assigned"></a>

## Enable system-assigned identity

Unlike user-assigned identities, you don't have to manually create the system-assigned identity. To set up your logic app's system-assigned identity, here are the options that you can use:

* [Azure portal](#azure-portal-system-logic-app)
* [Azure Resource Manager templates](#template-system-logic-app)
* [Azure PowerShell](../active-directory/managed-identities-azure-resources/howto-assign-access-powershell.md)
* [Azure CLI](../active-directory/managed-identities-azure-resources/howto-assign-access-cli.md)

<a name="azure-portal-system-logic-app"></a>

### Enable system-assigned identity in Azure portal

1. In the [Azure portal](https://portal.azure.com), open your logic app in Logic App Designer.

1. On the logic app menu, under **Settings**, select **Identity** > **System assigned**. Under **Status**, select **On** > **Save** > **Yes**.

   ![Enable the system-assigned identity](./media/create-managed-service-identity/turn-on-system-assigned-identity.png)

   Your logic app can now use the system-assigned identity, which is registered with Azure Active Directory and is represented by an object ID.

   ![Object ID for system-assigned identity](./media/create-managed-service-identity/object-id.png)

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Object ID** | <*identity-resource-ID*> | A Globally Unique Identifier (GUID) that represents the system-assigned identity for your logic app in your Azure AD tenant |
   ||||

1. Now follow the [steps that give the identity access to the resource](#access-other-resources).

<a name="template-system-logic-app"></a>

### Enable system-assigned identity in Azure Resource Manager template

To automate creating and deploying Azure resources such as logic apps, you can use [Azure Resource Manager templates](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md). To enable the system-assigned managed identity for your logic app in the template, add the `identity` object and the `type` child property to the logic app's resource definition in the template, for example:

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

When Azure creates your logic app resource definition, the `identity` object gets these additional properties:

```json
"identity": {
   "type": "SystemAssigned",
   "principalId": "<principal-ID>",
   "tenantId": "<Azure-AD-tenant-ID>"
}
```

| Property (JSON) | Value | Description |
|-----------------|-------|-------------|
| `principalId` | <*principal-ID*> | The Globally Unique Identifier (GUID) of the service principal object for the managed identity that represents your logic app in the Azure AD tenant. This GUID sometimes appears as an "object ID" or `objectID`. |
| `tenantId` | <*Azure-AD-tenant-ID*> | The Globally Unique Identifier (GUID) that represents the Azure AD tenant where the logic app is now a member. Inside the Azure AD tenant, the service principal has the same name as the logic app instance. |
||||

<a name="access-other-resources"></a>

## Give identity access to resources

After you set up a managed identity for your logic app, you can [give that identity access to other Azure resources](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md). You can then use that identity for authentication.

1. In the [Azure portal](https://portal.azure.com), go to the Azure resource where you want your managed identity to have access.

1. From the resource's menu, select **Access control (IAM)** > **Role assignments** where you can review the current role assignments for that resource. On the toolbar, select **Add** > **Add role assignment**.

   ![Add role assignment](./media/create-managed-service-identity/add-role-to-resource.png)

   > [!TIP]
   > If the **Add role assignment** option is disabled, you most likely don't have permissions. 
   > For more information about the permissions that let you manage roles for resources, see 
   > [Administrator role permissions in Azure Active Directory](../active-directory/users-groups-roles/directory-assign-admin-roles.md).

1. Under **Add role assignment**, select your identity's **Role** based on your logic app's needs.

   The role that you select is based on the permissions required by the trigger or action that uses that identity. Learn more about [role-based access control (RBAC) roles](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-rbac-roles).

   ![Assign role](./media/create-managed-service-identity/assign-role.png)

1. In the **Assign access to** box, select **Azure AD user, group, or service principal**.

   ![Select access for system-assigned identity](./media/create-managed-service-identity/assign-access-system.png)

1. In the **Select** box, find and select your logic app.

   ![Select logic app for system-assigned identity](./media/create-managed-service-identity/add-permissions-select-logic-app.png)

1. When you're done, select **Save**.

   The target resource's role assignments list now shows the selected managed identity and role.

   ![Added managed identities and roles to target resource](./media/create-managed-service-identity/added-roles-for-identities.png)

1. Now follow the [steps to authenticate access with the identity](#authenticate-access-with-identity) in a trigger or action that supports managed identities.

<a name="authenticate-access-with-identity"></a>

## Authenticate access with managed identity

After you [enable the managed identity for your logic app](#azure-portal-system-logic-app) and [give that identity access to the target resource](#access-other-resources), you can use that identity in [triggers and actions that support managed identities](logic-apps-securing-a-logic-app.md#managed-identity-authentication).

> [!IMPORTANT]
> If you have an Azure function where you want to use the system-assigned identity, 
> first [enable authentication for Azure functions](../logic-apps/logic-apps-azure-functions.md#enable-authentication-for-azure-functions).

These steps show how to use the managed identity with a trigger or action through the Azure portal. To specify the managed identity in a trigger or action's underlying JSON definition, see [Managed identity authentication](../logic-apps/logic-apps-securing-a-logic-app.md#managed-identity-authentication).

1. In the [Azure portal](https://portal.azure.com), open your logic app in the Logic App Designer.

1. If you haven't done so yet, add the trigger or action [that supports managed identities](logic-apps-securing-a-logic-app.md#managed-identity-authentication).

   For example, suppose that you want to run the [Snapshot Blob operation](https://docs.microsoft.com/rest/api/storageservices/snapshot-blob) on a blob in the Azure Storage account where you previously set up access for your identity, but the [Azure Blob Storage connector](/connectors/azureblob/) doesn't currently offer this operation. Instead, you can use the [HTTP action](../logic-apps/logic-apps-workflow-actions-triggers.md#http-action) to run the operation or any other [Blob Service REST API operations](https://docs.microsoft.com/rest/api/storageservices/operations-on-blobs). For authentication, the HTTP action can use the system-assigned identity that you enabled for your logic app. The HTTP action also uses these properties to specify the resource that you want to access:

   * The **URI** property specifies the endpoint URL for accessing the target Azure resource. This URI syntax usually includes at least the [resource ID](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication) for the Azure resource or service. If the resource is in a different subscription, the URI property includes those values too.

   * The **Queries** property specifies any query parameters that you need to include in the request, such as a specific API version when required or a parameter that identifies a specific operation.

   So, to run the [Snapshot Blob operation](https://docs.microsoft.com/rest/api/storageservices/snapshot-blob), the HTTP action specifies these properties:

   * **Method**: Specifies the `PUT` operation.

   * **URI**: Specifies the resource ID for Azure Storage blobs under a different subscription in the Azure Global (public) environment and uses this syntax: `https://{storage-account-name}.blob.net/subscriptions/{resource-subscription-ID}/resourcegroups/{resource-group}/providers/Microsoft.Storage/storageAccounts/{storage-container-name}/blobServices/{blob-name}`

   * **Queries**: Specifies `comp` as the query parameter name and `snapshot` as the parameter value.

   ![Add HTTP action to call an Azure service](./media/create-managed-service-identity/http-action-example.png)

   Here is the request that the HTTP action creates and sends:

   `PUT https://storageaccount.blob.net/subscriptons/XXXXXXXXXXXXXXXXXXXXXXXXXX/resourceGroups/fabrikam-storage-rg/providers/Microsoft.Storage/storageAccounts/fabrikamstorageaccount/blobServices/email-content?comp=snapshot`

   For more information about the available Azure REST API operations, see the [Azure REST API Reference](https://docs.microsoft.com/rest/api/azure/).

1. From the **Authentication** list, select **Managed Identity**. If the [**Authentication** property is supported](logic-apps-securing-a-logic-app.md#add-authentication-outbound) but hidden, open the **Add new parameter** list, and select **Authentication**.

   > [!NOTE]
   > Not all triggers and actions let you select an authentication type. For more information, see [Add authentication to outbound calls](logic-apps-securing-a-logic-app.md#add-authentication-outbound).

   ![In "Authentication" property, select "Managed Identity"](./media/create-managed-service-identity/select-managed-identity.png)

1. After you select **Managed Identity**, the **Audience** property appears for some triggers and actions. If the **Audience** property is supported but hidden, open the **Add new parameter** list, and select **Audience**.

1. Make sure that you set the **Audience** value to the resource ID for the target resource or service. Otherwise, by default, the **Audience** property uses the `https://management.azure.com/` resource ID, which is the resource ID for Azure Resource Manager.

   > [!IMPORTANT]
   > Make sure that the target resource ID *exactly matches* the value that Azure Active Directory expects, 
   > including any required trailing slashes. For example, the Azure Resource Manager resource ID usually requires 
   > a trailing slash. Check the [resource IDs for the Azure services that support Azure AD](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication).

   This example sets the **Audience** property to `https://storageaccount.blob.core.windows.net`:

   ![Specify target resource ID in "Audience" property](./media/create-managed-service-identity/specify-audience-url-target-resource.png)

<a name="remove-identity"></a>

## Remove system-assigned identity

To stop using the system-assigned identity for your logic app, you have these options:

* [Azure portal](#azure-portal-disable)
* [Azure Resource Manager templates](#template-disable)
* [Azure PowerShell](https://docs.microsoft.com/powershell/module/az.resources/remove-azroleassignment)
* [Azure CLI](https://docs.microsoft.com/cli/azure/role/assignment?view=azure-cli-latest#az-role-assignment-delete)

If you delete your logic app, Azure automatically removes the managed identity from Azure AD.

<a name="azure-portal-disable"></a>

### Remove system-assigned identity in the Azure portal

In the Azure portal, remove the system-assigned identity [from your logic app](#disable-identity-logic-app) and that identity's access [from your target resource](#disable-identity-target-resource).

<a name="disable-identity-logic-app"></a>

#### Remove system-assigned identity from logic app

1. In the [Azure portal](https://portal.azure.com), open your logic app in Logic App Designer.

1. On the logic app menu, under **Settings**, select **Identity** > **System assigned**. Under **Status**, select **Off** > **Save** > **Yes**.

   ![Stop using system-assigned identity](./media/create-managed-service-identity/turn-off-system-assigned-identity.png)

<a name="disable-identity-target-resource"></a>

#### Remove identity access from resources

1. In the [Azure portal](https://portal.azure.com), go to the target Azure resource where you want to remove access for a managed identity.

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
