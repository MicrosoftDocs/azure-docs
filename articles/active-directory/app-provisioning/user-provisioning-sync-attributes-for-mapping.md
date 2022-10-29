---
title: Synchronize attributes to Azure Active Directory for mapping
description: When configuring user provisioning with Azure Active Directory and SaaS apps, use the directory extension feature to add source attributes that aren't synchronized by default.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: troubleshooting
ms.date: 10/20/2022
ms.author: kenwith
ms.reviewer: arvinh
---

# Syncing extension attributes for Azure Active Directory Application Provisioning

Azure Active Directory (Azure AD) must contain all the data (attributes) required to create a user profile when provisioning user accounts from Azure AD to a [SaaS app](../saas-apps/tutorial-list.md). When customizing attribute mappings for user provisioning, you might find the attribute you want to map doesn't appear in the **Source attribute** list. This article shows you how to add the missing attribute.

For users only in Azure AD, you can [create schema extensions using PowerShell or Microsoft Graph](#create-an-extension-attribute-on-a-cloud-only-user).

For users in on-premises Active Directory, you must sync the users to Azure AD. You can sync users and attributes using [Azure AD Connect](../hybrid/whatis-azure-ad-connect.md). Azure AD Connect automatically synchronizes certain attributes to Azure AD, but not all attributes. Furthermore, some attributes (such as SAMAccountName) that are synchronized by default might not be exposed using the Graph API. In these cases, you can [use the Azure AD Connect directory extension feature to synchronize the attribute to Azure AD](#create-an-extension-attribute-using-azure-ad-connect). That way, the attribute will be visible to the Graph API and the Azure AD provisioning service.

## Create an extension attribute on a cloud only user
You can use Microsoft Graph and PowerShell to extend the user schema for users in Azure AD. These extension attributes are automatically discovered in most cases.

When you've more than 1000 service principals, you may find extensions missing in the source attribute list. If an attribute you've created doesn't automatically appear, then verify the attribute was created and add it manually to your schema. To verify it was created, use Microsoft Graph and [Graph Explorer](/graph/graph-explorer/graph-explorer-overview). To add it manually to your schema, see [Editing the list of supported attributes](customize-application-attributes.md#editing-the-list-of-supported-attributes).

### Create an extension attribute on a cloud only user using Microsoft Graph
You can extend the schema of Azure AD users using [Microsoft Graph](/graph/overview). 

First, list the apps in your tenant to get the ID of the app you're working on. To learn more, see [List extensionProperties](/graph/api/application-list-extensionproperty).

```json
GET https://graph.microsoft.com/v1.0/applications
```

Next, create the extension attribute. Replace the **ID** property below with the **ID** retrieved in the previous step. You'll need to use the **"ID"** attribute and not the "appId". To learn more, see [Create extensionProperty]/graph/api/application-post-extensionproperty).

```json
POST https://graph.microsoft.com/v1.0/applications/{id}/extensionProperties
Content-type: application/json

{
    "name": "extensionName",
    "dataType": "string",
    "targetObjects": [
    	"User"
    ]
}
```

The previous request created an extension attribute with the format `extension_appID_extensionName`. You can now update a user with this extension attribute. To learn more, see [Update user](/graph/api/user-update).
```json
PATCH https://graph.microsoft.com/v1.0/users/{id}
Content-type: application/json

{
  "extension_inputAppId_extensionName": "extensionValue"
}
```
Finally, verify the attribute for the user. To learn more, see [Get a user](/graph/api/user-get).

```json
GET https://graph.microsoft.com/v1.0/users/{id}?$select=displayName,extension_inputAppId_extensionName
```


### Create an extension attribute on a cloud only user using PowerShell
Create a custom extension using PowerShell and assign a value to a user. 

```
#Connect to your Azure AD tenant   
Connect-AzureAD

#Create an application (you can instead use an existing application if you would like)
$App = New-AzureADApplication -DisplayName “test app name” -IdentifierUris https://testapp

#Create a service principal
New-AzureADServicePrincipal -AppId $App.AppId

#Create an extension property
New-AzureADApplicationExtensionProperty -ObjectId $App.ObjectId -Name “TestAttributeName” -DataType “String” -TargetObjects “User”

#List users in your tenant to determine the objectid for your user
Get-AzureADUser

#Set a value for the extension property on the user. Replace the objectid with the ID of the user and the extension name with the value from the previous step
Set-AzureADUserExtension -objectid 0ccf8df6-62f1-4175-9e55-73da9e742690 -ExtensionName “extension_6552753978624005a48638a778921fan3_TestAttributeName”

#Verify that the attribute was added correctly.
Get-AzureADUser -ObjectId 0ccf8df6-62f1-4175-9e55-73da9e742690 | Select -ExpandProperty ExtensionProperty

```

## Create an extension attribute using Azure AD Connect

1. Open the Azure AD Connect wizard, choose Tasks, and then choose **Customize synchronization options**.

   ![Azure Active Directory Connect wizard Additional tasks page](./media/user-provisioning-sync-attributes-for-mapping/active-directory-connect-customize.png)
 
2. Sign in as an Azure AD Global Administrator. 

3. On the **Optional Features** page, select **Directory extension attribute sync**.
 
   ![Azure Active Directory Connect wizard Optional features page](./media/user-provisioning-sync-attributes-for-mapping/active-directory-connect-directory-extension-attribute-sync.png)

4. Select the attribute(s) you want to extend to Azure AD.
   > [!NOTE]
   > The search under **Available Attributes** is case sensitive.

   ![Screenshot that shows the "Directory extensions" selection page](./media/user-provisioning-sync-attributes-for-mapping/active-directory-connect-directory-extensions.png)

5. Finish the Azure AD Connect wizard and allow a full synchronization cycle to run. When the cycle is complete, the schema is extended and the new values are synchronized between your on-premises AD and Azure AD.
 
6. In the Azure portal, while you’re [editing user attribute mappings](customize-application-attributes.md), the **Source attribute** list will now contain the added attribute in the format `<attributename> (extension_<appID>_<attributename>)`. Select the attribute and map it to the target application for provisioning.

   ![Azure Active Directory Connect wizard Directory extensions selection page](./media/user-provisioning-sync-attributes-for-mapping/attribute-mapping-extensions.png)

> [!NOTE]
> The ability to provision reference attributes from on-premises AD, such as **managedby** or **DN/DistinguishedName**, is not supported today. You can request this feature on [User Voice](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789). 


## Next steps

* [Define who is in scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md)
