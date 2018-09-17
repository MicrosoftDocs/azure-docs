---
title: Access resources and authenticate without credentials in Azure Logic Apps
description: To authenticate and access resources without your credentials, you can create a managed identity for your logic app instead. 
in other Azure Active Directory (Azure AD) tenants, Create a  managed identity for your logic app so you can sign in to resources  Azures Logic apps can easily connect to resources in other Azure Active Directory (Azure AD) directories or tenants 
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: kevinlam1
ms.author: klam 
ms.reviewer: estfan, LADocs
ms.topic: article
ms.date: 09/24/2018
---

# Access resources and authenticate as managed identities in Azure Logic Apps

To access resources in other Azure Active Directory (Azure AD) tenants 
and authenticate your identity without signing in, you can create a 
[managed identity](../active-directory/managed-identities-azure-resources/overview.md) 
that your logic app uses instead of your credentials. Azure manages this 
identity for you, and helps secure your credentials because you don't 
have to provide or rotate secrets. This article shows how to create 
and use a managed identity for your logic app. For more information, see 
[Manage identities for Azure resources](../app-service/app-service-managed-service-identity.md)

> [!NOTE]
> Managed identities for Azure resources is the 
> replacement name for the service formerly
> known as Managed Service Identity (MSI).

* To manually enable a managed identity for your logic app in the Azure portal, 
you need a previously created [user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

## Prerequisites

* An Azure subscription, or if you don't have a subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

* The logic app where you want to use the managed identity. 
If you don't have a logic app, see 
[Create your first logic app workflow](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Create managed identity - portal

To have  your logic app use a managed identity, 
turn on the **Register with Azure Active Directory** 
setting in your logic app's workflow settings.

1. In the Azure portal, open your logic app in Logic App Designer.

1. Follow these steps: 

   1. On the logic app menu, under **Settings**, 
   select **Workflow settings**. 

   1. Under **Managed service identity** > 
   **Register with Azure Active Directory**, choose **On**.

   1. When you're done, choose **Save** on the toolbar.

      ![Turn on managed identity setting](./media/create-managed-service-identity/turn-on-managed-service-identity.png)

      Azure now shows these properties and values 
      for your logic app's managed identity:

      ![GUIDS for principal ID and tenant ID](./media/create-managed-service-identity/principal-tenant-id.png)

      | Property | Value | Description | 
      |----------|-------|-------------| 
      | **Principal ID** | <*principal-ID-GUID*> | A Globally Unique Identifier (GUID) that represents the logic app in an Azure AD tenant | 
      | **Tenant ID** | <*Azure-AD-tenant--ID-GUID*> | A Globally Unique Identifier (GUID) that represents the Azure AD tenant where your logic app is now a member. Inside the Azure AD tenant, the service principal has the same name as the logic app instance. | 
      ||| 

### Create managed identity - deployment template

To automate deployment for Azure resources such as logic apps, 
you can set up Azure Resource Manager templates that create 
and deploy your logic app. For more information, see 
[Create and deploy logic apps with Azure Resource Manager templates](../logic-apps/logic-apps-create-deploy-azure-resource-manager-templates.md). 

If you want to create a managed identity for your logic app 
through a deployment template, add the **identity** element 
and **type** property to your logic app workflow definition 
in your deployment template. These settings indicate that 
Azure creates and manages this identity for your logic app:

```json
"identity": {
    "type": "SystemAssigned"
}
```

For example, your logic app might look like this version:

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

When Azure creates your logic app, that logic app's 
workflow definition includes these additional properties:

```json
"identity": {
    "type": "SystemAssigned",
    "principalId": "<principal-ID>",
    "tenantId": "<Azure-AD-tenant-ID>"
}
```

| Property | Value | Description | 
|----------|-------|-------------|
| **principalId** | <*principal-ID*> | A Globally Unique Identifier (GUID) that represents the logic app in the Azure AD tenant | 
| **tenantId** | <*Azure-AD-tenant--ID*> | A Globally Unique Identifier (GUID) that represents the Azure AD tenant where the logic app is now a member. Inside the Azure AD tenant, the service principal has the same name as the logic app instance. | 
||| 

## Remove managed identity

To disable a managed identity on your logic app, 
you can follow the steps that are similar to how 
you created the identity through the Azure portal, 
Azure PowerShell, or Azure CLI. Or, when you delete 
your logic app, Azure automatically removes your 
logic app's system-assigned identitiy from Azure AD.

### Azure portal

1. In Logic App Designer, open your logic app.

1. Follow these steps: 

   1. On the logic app menu, under **Settings**, 
   select **Workflow settings**. 
   
   1. Under **Managed service identity**, choose **Off** 
   for the **Register with Azure Active Directory** property.

      ![Turn off managed identity setting](./media/create-managed-service-identity/turn-off-managed-service-identity.png)

   1. When you're done, choose **Save** on the toolbar.

### Deployment template or REST API

If you created the logic app's managed identity with 
a Resource Manager deployment template or a REST API, 
set the `"identity"` element to `"None"`. This action 
also deletes the principal ID from Azure AD. 

```json
"identity": {
    "type": "None"
}
```

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the 
[Logic Apps user feedback site](http://aka.ms/logicapps-wish).
