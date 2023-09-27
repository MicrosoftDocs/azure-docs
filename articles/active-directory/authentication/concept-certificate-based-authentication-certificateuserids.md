---
title: Certificate user IDs for Microsoft Entra certificate-based authentication 
description: Learn about certificate user IDs for Microsoft Entra certificate-based authentication without federation

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 01/29/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref, has-azure-ad-ps-ref
---

# Certificate user IDs 

Users in Microsoft Entra ID can have a multivalued attribute named **certificateUserIds**. The attribute allows up to four values, and each value can be of 120-character length. It can store any value and doesn't require email ID format. It can store non-routable User Principal Names (UPNs) like _bob@woodgrove_ or _bob@local_.
 
## Supported patterns for certificate user IDs
 
The values stored in **certificateUserIds** should be in the format described in the following table.
 
|Certificate mapping Field | Examples of values in CertificateUserIds |
|--------------------------|--------------------------------------|
|PrincipalName | “X509:\<PN>bob@woodgrove.com” |
|PrincipalName | “X509:\<PN>bob@woodgrove”     | 
|RFC822Name	| “X509:\<RFC822>user@woodgrove.com” |
|X509SKI | “X509:\<SKI>123456789abcdef”|
|X509SHA1PublicKey |“X509:\<SHA1-PUKEY>123456789abcdef” |

## Roles to update certificateUserIds

For cloud-only users, only users with roles **Global Administrators**, **Privileged Authentication Administrator** can write into certificateUserIds. Cloud-only users can use both UX and MSGraph to write into certificateUserIds. For synched users, AD users with role **Hybrid Identity Administrator** can write into the attribute. Only Azure ADConnect can be used to update CertificateUserIds by syncing the value from on-prem for synched users. 

>[!NOTE]
>Active Directory Administrators (including accounts with delegated administrative privilege over synched user accounts as well as administrative rights over the Azure >AD Connect Servers) can make changes that impact the certificateUserIds value in Microsoft Entra ID for any synched accounts.
 
## Update certificate user IDs
 
Tenant admins can use the following steps to update certificate user IDs for a user account:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator). Search for and select **All users**. 

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/user.png" alt-text="Screenshot of test user account.":::

1. Click a user, and click **Edit Properties**. 

1. Next to **Authorization info**, click **View**.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/view.png" alt-text="Screenshot of View authorization info.":::

1. Click **Edit certificate user IDs**.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/edit-cert.png" alt-text="Screenshot of Edit certificate user IDs.":::

1. Click **Add**.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/add.png" alt-text="Screenshot of how to add a CertificateUserID.":::

1. Enter the value and click **Save**. You can add up to four values, each of 120 characters.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/save.png" alt-text="Screenshot of a value to enter for CertificateUserId.":::

## Update certificateUserIds using Microsoft Graph queries

**Look up certificateUserIds**

Authorized callers can run Microsoft Graph queries to find all the users with a given certificateUserId value. On the Microsoft Graph [user](/graph/api/resources/user) object, the collection of certificateUserIds is stored in the **authorizationInfo** property.

To retrieve all user objects that have the value 'bob@contoso.com' in certificateUserIds:

```msgraph-interactive
GET https://graph.microsoft.com/v1.0/users?$filter=authorizationInfo/certificateUserIds/any(x:x eq 'bob@contoso.com')&$count=true
ConsistencyLevel: eventual
```

You can also use the `not` and `startsWith` operators to match the filter condition. To filter against the certificateUserIds object, the request must include the `$count=true` query string and the **ConsistencyLevel** header set to `eventual`.

**Update certificateUserIds**

Run a PATCH request to update the certificateUserIds for a given user.

#### Request body:

```http
PATCH https://graph.microsoft.com/v1.0/users/{id}
Content-Type: application/json
{
    "authorizationInfo": {
        "certificateUserIds": [
            "X509:<PN>123456789098765@mil"
        ]
    }
}
```
## Update certificateUserIds using PowerShell commands

For the configuration, you can use the [Azure Active Directory PowerShell Version 2](/powershell/microsoftgraph/installation):

1. Start PowerShell with administrator privileges.
1. Install and Import the Microsoft Graph PowerShell SDK

   ```powershell
       Install-Module Microsoft.Graph -Scope AllUsers
       Import-Module Microsoft.Graph.Authentication
       Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
1. Connect to the tenant and accept all

   ```powershell
      Connect-MGGraph -Scopes "Directory.ReadWrite.All", "User.ReadWrite.All" -TenantId <tenantId>
   ```
1. List CertificateUserIds attribute of a given user

   ```powershell
     $results = Invoke-MGGraphRequest -Method get -Uri 'https://graph.microsoft.com/v1.0/users/<userId>?$select=authorizationinfo' -OutputType PSObject -Headers @{'ConsistencyLevel' = 'eventual' }
     #list certificateUserIds
     $results.authorizationInfo
   ```
1. Create a variable with CertificateUserIds values
   
   ```powershell
     #Create a new variable to prepare the change. Ensure that you list any existing values you want to keep as this operation will overwrite the existing value
     $params = @{
           authorizationInfo = @{
                 certificateUserIds = @(
                 "X509:<SKI>eec6b88788d2770a01e01775ce71f1125cd6ad0f", 
                 "X509:<PN>user@contoso.com"
                 )
           }
     }
   ```
1. Update CertificateUserIds attribute

   ```powershell
      $results = Invoke-MGGraphRequest -Method patch -Uri 'https://graph.microsoft.com/v1.0/users/<UserId>/?$select=authorizationinfo' -OutputType PSObject -Headers @{'ConsistencyLevel' = 'eventual' } -Body $params
   ```

**Update CertificateUserIds using user object**

1. Get the user object

   ```powershell
     $userObjectId = "6b2d3bd3-b078-4f46-ac53-f862f35e10b6"
     $user = get-mguser -UserId $userObjectId -Property AuthorizationInfo
   ```

1. Update the CertificateUserIds attribute of the user object

   ```powershell
      $user.AuthorizationInfo.certificateUserIds = @("X509:<SKI>eec6b88788d2770a01e01775ce71f1125cd6ad0f", "X509:<PN>user1@contoso.com") 
      Update-MgUser -UserId $userObjectId -AuthorizationInfo $user.AuthorizationInfo
   ```
   
<a name='update-certificate-user-ids-using-azure-ad-connect'></a>

## Update certificate user IDs using Microsoft Entra Connect

To update certificate user IDs for federated users, configure Microsoft Entra Connect to sync userPrincipalName to certificateUserIds. 

1. On the Microsoft Entra Connect server, find and start the **Synchronization Rules Editor**.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/sync-rules-editor.png" alt-text="Screenshot of Synchronization Rules Editor.":::

1. Click **Direction**, and click **Outbound**. 

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/outbound.png" alt-text="Screenshot of outbound synchronization rule.":::

1. Find the rule **Out to Microsoft Entra ID – User Identity**, click **Edit**, and click **Yes** to confirm. 

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/user-identity.png" alt-text="Screenshot of user identity.":::

1. Enter a high number in the **Precedence** field, and then click **Next**. 

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/precedence.png" alt-text="Screenshot of a precedence value.":::

1. Click **Transformations** > **Add transformation**. You may need to scroll down the list of transformations before you can create a new one. 

### Synchronize X509:\<PN>PrincipalNameValue
 
To synchronize X509:\<PN>PrincipalNameValue, create an outbound synchronization rule, and choose **Expression** in the flow type. Choose the target attribute as **certificateUserIds**, and in the source field, add the following expression. If your source attribute isn't userPrincipalName, you can change the expression accordingly.

```
"X509:\<PN>"&[userPrincipalName]
```
 
:::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/pnexpression.png" alt-text="Screenshot of how to sync x509.":::
 
### Synchronize X509:\<RFC822>RFC822Name

To synchronize X509:\<RFC822>RFC822Name, create an outbound synchronization rule and choose **Expression** in the flow type. Choose the target attribute as **certificateUserIds**, and in the source field, add the following expression. If your source attribute isn't userPrincipalName, you can change the expression accordingly.  

```
"X509:\<RFC822>"&[userPrincipalName]
```

:::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/rfc822expression.png" alt-text="Screenshot of how to sync RFC822Name.":::

1. Click **Target Attribute**, select **CertificateUserIds**, click **Source**, select **UserPrincipalName**, and then click **Save**. 

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/edit-rule.png" alt-text="Screenshot of how to save a rule.":::

1. Click **OK** to confirm. 

> [!NOTE]
> Make sure you use the latest version of [Microsoft Entra Connect](https://www.microsoft.com/download/details.aspx?id=47594). 

For more information about declarative provisioning expressions, see [Microsoft Entra Connect: Declarative Provisioning Expressions](../hybrid/connect/concept-azure-ad-connect-sync-declarative-provisioning-expressions.md).

<a name='synchronize-alternativesecurityid-attribute-from-ad-to-azure-ad-cba-certificateuserids'></a>

## Synchronize alternativeSecurityId attribute from AD to Microsoft Entra CBA CertificateUserIds

AlternativeSecurityId isn't part of the default attributes. An administrator needs to add the attribute to the person object, and then create the appropriate synchronization rules.

1. Open Metaverse Designer, and select alternativeSecurityId to add it to the person object.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/alt-security-identity-add.png" alt-text="Screenshot of how to add alternativeSecurityId to the person object":::

1. Create an inbound synchronization rule to transform from altSecurityIdentities to alternateSecurityId attribute.

   In the inbound rule, use the following options.
  
   |Option | Value |
   |-------|-------|
   |Name | Descriptive name of the rule, such as: In from AD - altSecurityIdentities |
   |Connected System | Your on-premises AD domain |
   |Connected System Object Type | user |
   |Metaverse Object Type | person |
   |Precedence | Choose a random high number not currently used |
  
   Then proceed to the Transformations tab and do a direct mapping of the target attribute of **alternativeSecurityId** to **altSecurityIdentities** as shown below.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/alt-security-identity-inbound.png" alt-text="Screenshot of how to transform from altSecurityIdentities to alternateSecurityId attribute":::

1. Create an outbound synchronization rule to transform from alternateSecurityId attribute to certificateUserIds
alt-security-identity-add.

   |Option | Value |
   |-------|-------|
   |Name | Descriptive name of the rule, such as: Out to Microsoft Entra ID - certificateUserIds |
   |Connected System | Your Microsoft Entra domain |
   |Connected System Object Type | user |
   |Metaverse Object Type | person |
   |Precedence | Choose a random high number not currently used |
    
   Then proceed to the Transformations tab and change your FlowType option to *Expression*, the target attribute to **certificateUserIds** and then input the below expression in to the Source field.

   :::image type="content" border="true" source="./media/concept-certificate-based-authentication-certificateuserids/alt-security-identity-outbound.png" alt-text="Screenshot of outbound synchronization rule to transform from alternateSecurityId attribute to certificateUserIds":::

To map the pattern supported by certificateUserIds, administrators must use expressions to set the correct value.

You can use the following expression for mapping to SKI and SHA1-PUKEY:

```
IIF(IsPresent([alternativeSecurityId]),
                Where($item,[alternativeSecurityId],BitOr(InStr($item, "x509:<SKI>"),InStr($item, "x509:<SHA1-PUKEY>"))>0),[alternativeSecurityId]
)
```

## Next steps

- [Overview of Microsoft Entra CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Microsoft Entra CBA](concept-certificate-based-authentication-technical-deep-dive.md)
- [How to configure Microsoft Entra CBA](how-to-certificate-based-authentication.md)
- [Microsoft Entra CBA on iOS devices](concept-certificate-based-authentication-mobile-ios.md)
- [Microsoft Entra CBA on Android devices](concept-certificate-based-authentication-mobile-android.md)
- [Windows smart card logon using Microsoft Entra CBA](concept-certificate-based-authentication-smartcard.md)
- [How to migrate federated users](concept-certificate-based-authentication-migration.md)
- [FAQ](certificate-based-authentication-faq.yml)
