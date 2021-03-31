---
title: Synchronize attributes to Azure AD for mapping
description: When configuring user provisioning to SaaS apps, use the directory extension feature to add source attributes that aren't synchronized by default.
services: active-directory
author: kenwith
manager: daveba
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: troubleshooting
ms.date: 03/17/2021
ms.author: kenwith
---

# Syncing extension attributes attributes

When customizing attribute mappings for user provisioning, you might find that the attribute you want to map doesn't appear in the **Source attribute** list. This article shows you how to add the missing attribute by synchronizing it from your on-premises Active Directory (AD) to Azure Active Directory (Azure AD) or by creating the extension attributes in Azure AD for a cloud only user. 

Azure AD must contain all the data required to create a user profile when provisioning user accounts from Azure AD to a SaaS app. In some cases, to make the data available you might need synchronize attributes from your on-premises AD to Azure AD. Azure AD Connect automatically synchronizes certain attributes to Azure AD, but not all attributes. Furthermore, some attributes (such as SAMAccountName) that are synchronized by default might not be exposed using the Azure AD Graph API. In these cases, you can use the Azure AD Connect directory extension feature to synchronize the attribute to Azure AD. That way, the attribute will be visible to the Azure AD Graph API and the Azure AD provisioning service. If the data you need for provisioning is in Active Directory but isn't available for provisioning because of the reasons described above, you can use Azure AD Connect to create extension attributes. 

While most users are likely hybrid users that are synchronized from Active Directory, you can also create extensions on cloud-only users without using Azure AD Connect. Using PowerShell or Microsoft Graph you can extend the schema of a cloud only user. 

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
> The ability to provision reference attributes from on-premises AD, such as **managedby** or **DN/DistinguishedName**, is not supported today. You can request this feature on [User Voice](https://feedback.azure.com/forums/169401-azure-active-directory). 

## Create an extension attribute on a cloud only user
Customers can use Microsoft Graph and PowerShell to extend the user schema. These extension attributes are automatically discovered in most cases, but customers with more than 1000 service principals may find extensions missing in the source attribute list. If an attribute that you create using the steps below does not automatically appear in the source attribute list please verify using graph that the extension attribute was successfully created and then add it to your schema [manually](https://docs.microsoft.com/azure/active-directory/app-provisioning/customize-application-attributes#editing-the-list-of-supported-attributes). When making the graph requests below, please click learn more to verify the permissions required to make the requests. You can use [graph explorer](https://docs.microsoft.com/graph/graph-explorer/graph-explorer-overview) to make the requests. 

### Create an extension attribute on a cloud only user using Microsoft Graph
You will need to use an application to extend the schema of your users. List the apps in your tenant to identify the id of the application that you would like to use to extend the user schema. [Learn more.](https://docs.microsoft.com/graph/api/application-list?view=graph-rest-1.0&tabs=http)

```json
GET https://graph.microsoft.com/v1.0/applications
```

Create the extension attribute. Replace the **id** property below with the **id** retrieved in the previous step. You will need to use the **"id"** attribute and not the "appId". [Learn more.](https://docs.microsoft.com/graph/api/application-post-extensionproperty?view=graph-rest-1.0&tabs=http)
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

The previous request created an extension attribute with the format "extension_appID_extensionName". Update a user with the extension attribute. [Learn more.](https://docs.microsoft.com/graph/api/user-update?view=graph-rest-1.0&tabs=http)
```json
PATCH https://graph.microsoft.com/v1.0/users/{id}
Content-type: application/json

{
  "extension_inputAppId_extensionName": "extensionValue"
}
```
Check the user to ensure the attribute was successfully updated. [Learn more.](https://docs.microsoft.com/graph/api/user-get?view=graph-rest-1.0&tabs=http#example-3-users-request-using-select)

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

#Set a value for the extension property on the user. Replace the objectid with the id of the user and the extension name with the value from the previous step
Set-AzureADUserExtension -objectid 0ccf8df6-62f1-4175-9e55-73da9e742690 -ExtensionName “extension_6552753978624005a48638a778921fan3_TestAttributeName”

#Verify that the attribute was added correctly.
Get-AzureADUser -ObjectId 0ccf8df6-62f1-4175-9e55-73da9e742690 | Select -ExpandProperty ExtensionProperty

```

## Next steps

* [Define who is in scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md)
