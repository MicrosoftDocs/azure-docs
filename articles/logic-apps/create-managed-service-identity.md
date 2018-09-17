---
title: 
description: 
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: kevinlam1
ms.author: klam 
ms.reviewer: estfan, LADocs
ms.topic: article
ms.date: 09/24/2018
---

# Create managed identities in Azure Logic Apps

To help your logic app easily access resources such as 
Azure Key Vault in other Azure Active Directory (Azure AD) 
tenants and help keep credentials more secure, you can create a 
[managed identity](../active-directory/managed-identities-azure-resources/overview.md) 
for your logic app. Azure manages this identity for you, 
so you don't have to provide or rotate secrets. 
This article shows how you can create a managed 
identity for your logic app.

> [!NOTE]
> Managed identities for Azure resources 
> replaces the name for the service formerly
> known as Managed Service Identity (MSI).

For more information about managed identities in Azure AD, 
see [Manage identities for Azure resources](../app-service/app-service-managed-service-identity.md)

## Prerequisites

* An Azure subscription, or if you don't have a subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

* The logic app where you want to create the managed identity
If you don't have a logic app, see [Create your first logic app workflow](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Create managed identity

1. In the Azure portal, open your logic app in Logic App Designer, 
if not already open.

1. On the logic app menu, under **Settings**, select 
**Workflow settings**. Under **Managed service identity**, 
choose **On** for the **Register with Azure Active Directory** property.

   ![Turn on managed identity setting](./media/create-managed-service-identity/turn-on-managed-service-identity.png)

1. When you're done, choose **Save** on the toolbar.

### Create managed identity in deployment templates

To automate deployment for Azure resources such as logic apps, 
you can create Azure Resource Manager templates that create 
and deploy your logic app. For more information, see 
[Create and deploy logic apps with Azure Resource Manager templates](../logic-apps/logic-apps-create-deploy-azure-resource-manager-templates.md). 

To have your deployment template create a managed identity for your logic app, 
add this element and property to your logic app workflow definition in the 
deplyment template. This setting indicates that Azure create and manage this 
identity for your logic app:

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

When Azure creates your logic app, the logic app's 
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

## Remove identity

To manually disable the managed service identity on your logic app, 
turn off the **Register with Azure Active Directory** property 
in on your logic app's **Workflow settings**. You can perform 
this task similar to how you created the identity through the 
Azure portal, Azure PowerShell, or Azure CLI. Otherwise, 
when you delete your logic app, Azure automatically 
removes system-assigned identities from Azure AD.

### Azure portal

1. In Logic App Designer, open your logic app.

1. On the logic app menu, under **Settings**, select 
**Workflow settings**. Under **Managed service identity**, 
choose **Off** for the **Register with Azure Active Directory** property.

   ![Turn off managed identity setting](./media/create-managed-service-identity/turn-off-managed-service-identity.png)

1. When you're done, choose **Save** on the toolbar.

### Resource Manager template

If you created the logic app's service identity 
through a Resource Manager template or a REST API, 
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




