---
title: Synchronize attributes to Azure AD for mapping
description: Learn how to synchronize attributes from your on-premises Active Directory to Azure AD. When configuring user provisioning to SaaS apps, use the directory extension feature to add source attributes that aren't synchronized by default.
services: active-directory
author: kenwith
manager: daveba
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: troubleshooting
ms.date: 03/12/2021
ms.author: kenwith
---

# Sync an attribute from your on-premises Active Directory to Azure AD for provisioning to an application

When customizing attribute mappings for user provisioning, you might find that the attribute you want to map doesn't appear in the **Source attribute** list. This article shows you how to add the missing attribute by synchronizing it from your on-premises Active Directory (AD) to Azure Active Directory (Azure AD).

Azure AD must contain all the data required to create a user profile when provisioning user accounts from Azure AD to a SaaS app. In some cases, to make the data available you might need synchronize attributes from your on-premises AD to Azure AD. Azure AD Connect automatically synchronizes certain attributes to Azure AD, but not all attributes. Furthermore, some attributes (such as SAMAccountName) that are synchronized by default might not be exposed using the Microsoft Graph API. In these cases, you can use the Azure AD Connect directory extension feature to synchronize the attribute to Azure AD. That way, the attribute will be visible to the Microsoft Graph API and the Azure AD provisioning service.

If the data you need for provisioning is in Active Directory but isn't available for provisioning because of the reasons described above, you can use Azure AD Connect or PowerShell to create extension attributes. 
 
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

## Create an extension attribute using PowerShell
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
