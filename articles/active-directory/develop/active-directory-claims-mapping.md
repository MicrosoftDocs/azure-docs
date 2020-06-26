---
title: Customize Azure AD tenant app claims (PowerShell)
titleSuffix: Microsoft identity platform
description: This page describes Azure Active Directory claims mapping.
services: active-directory
author: rwike77
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.custom: aaddev 
ms.workload: identity
ms.topic: conceptual
ms.date: 10/22/2019
ms.author: ryanwi
ms.reviewer: paulgarn, hirsin, jeedes, luleon
---

# How to: Customize claims emitted in tokens for a specific app in a tenant (Preview)

> [!NOTE]
> This feature replaces and supersedes the [claims customization](active-directory-saml-claims-customization.md) offered through the portal today. On the same application, if you customize claims using the portal in addition to the Graph/PowerShell method detailed in this document, tokens issued for that application will ignore the configuration in the portal. Configurations made through the methods detailed in this document will not be reflected in the portal.

This feature is used by tenant admins to customize the claims emitted in tokens for a specific application in their tenant. You can use claims-mapping policies to:

- Select which claims are included in tokens.
- Create claim types that do not already exist.
- Choose or change the source of data emitted in specific claims.

> [!NOTE]
> This capability currently is in public preview. Be prepared to revert or remove any changes. The feature is available in any Azure Active Directory (Azure AD) subscription during public preview. However, when the feature becomes generally available, some aspects of the feature might require an Azure AD premium subscription. This feature supports configuring claim mapping policies for WS-Fed, SAML, OAuth, and OpenID Connect protocols.

## Claims mapping policy type

In Azure AD, a **Policy** object represents a set of rules enforced on individual applications or on all applications in an organization. Each type of policy has a unique structure, with a set of properties that are then applied to objects to which they are assigned.

A claims mapping policy is a type of **Policy** object that modifies the claims emitted in tokens issued for specific applications.

## Claim sets

There are certain sets of claims that define how and when they're used in tokens.

| Claim set | Description |
|---|---|
| Core claim set | Are present in every token regardless of the policy. These claims are also considered restricted, and can't be modified. |
| Basic claim set | Includes the claims that are emitted by default for tokens (in addition to the core claim set). You can omit or modify basic claims by using the claims mapping policies. |
| Restricted claim set | Can't be modified using policy. The data source cannot be changed, and no transformation is applied when generating these claims. |

### Table 1: JSON Web Token (JWT) restricted claim set

| Claim type (name) |
| ----- |
| _claim_names |
| _claim_sources |
| access_token |
| account_type |
| acr |
| actor |
| actortoken |
| aio |
| altsecid |
| amr |
| app_chain |
| app_displayname |
| app_res |
| appctx |
| appctxsender |
| appid |
| appidacr |
| assertion |
| at_hash |
| aud |
| auth_data |
| auth_time |
| authorization_code |
| azp |
| azpacr |
| c_hash |
| ca_enf |
| cc |
| cert_token_use |
| client_id |
| cloud_graph_host_name |
| cloud_instance_name |
| cnf |
| code |
| controls |
| credential_keys |
| csr |
| csr_type |
| deviceid |
| dns_names |
| domain_dns_name |
| domain_netbios_name |
| e_exp |
| email |
| endpoint |
| enfpolids |
| exp |
| expires_on |
| grant_type |
| graph |
| group_sids |
| groups |
| hasgroups |
| hash_alg |
| home_oid |
| `http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationinstant` |
| `http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod` |
| `http://schemas.microsoft.com/ws/2008/06/identity/claims/expiration` |
| `http://schemas.microsoft.com/ws/2008/06/identity/claims/expired` |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress` |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name` |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier` |
| iat |
| identityprovider |
| idp |
| in_corp |
| instance |
| ipaddr |
| isbrowserhostedapp |
| iss |
| jwk |
| key_id |
| key_type |
| mam_compliance_url |
| mam_enrollment_url |
| mam_terms_of_use_url |
| mdm_compliance_url |
| mdm_enrollment_url |
| mdm_terms_of_use_url |
| nameid |
| nbf |
| netbios_name |
| nonce |
| oid |
| on_prem_id |
| onprem_sam_account_name |
| onprem_sid |
| openid2_id |
| password |
| platf |
| polids |
| pop_jwk |
| preferred_username |
| previous_refresh_token |
| primary_sid |
| puid |
| pwd_exp |
| pwd_url |
| redirect_uri |
| refresh_token |
| refreshtoken |
| request_nonce |
| resource |
| role |
| roles |
| scope |
| scp |
| sid |
| signature |
| signin_state |
| src1 |
| src2 |
| sub |
| tbid |
| tenant_display_name |
| tenant_region_scope |
| thumbnail_photo |
| tid |
| tokenAutologonEnabled |
| trustedfordelegation |
| unique_name |
| upn |
| user_setting_sync_url |
| username |
| uti |
| ver |
| verified_primary_email |
| verified_secondary_email |
| wids |
| win_ver |

### Table 2: SAML restricted claim set

| Claim type (URI) |
| ----- |
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/expiration`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/expired`|
|`http://schemas.microsoft.com/identity/claims/accesstoken`|
|`http://schemas.microsoft.com/identity/claims/openid2_id`|
|`http://schemas.microsoft.com/identity/claims/identityprovider`|
|`http://schemas.microsoft.com/identity/claims/objectidentifier`|
|`http://schemas.microsoft.com/identity/claims/puid`|
|`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier [MR1]`|
|`http://schemas.microsoft.com/identity/claims/tenantid`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationinstant`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod`|
|`http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/groups`|
|`http://schemas.microsoft.com/claims/groups.link`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/role`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/wids`|
|`http://schemas.microsoft.com/2014/09/devicecontext/claims/iscompliant`|
|`http://schemas.microsoft.com/2014/02/devicecontext/claims/isknown`|
|`http://schemas.microsoft.com/2012/01/devicecontext/claims/ismanaged`|
|`http://schemas.microsoft.com/2014/03/psso`|
|`http://schemas.microsoft.com/claims/authnmethodsreferences`|
|`http://schemas.xmlsoap.org/ws/2009/09/identity/claims/actor`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/samlissuername`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/confirmationkey`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/primarygroupsid`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid`|
|`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision`|
|`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication`|
|`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlyprimarygroupsid`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlyprimarysid`|
|`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/denyonlysid`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlywindowsdevicegroup`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsdeviceclaim`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsdevicegroup`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsfqbnversion`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/windowssubauthority`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsuserclaim`|
|`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/x500distinguishedname`|
|`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid`|
|`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/spn`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/ispersistent`|
|`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/privatepersonalidentifier`|
|`http://schemas.microsoft.com/identity/claims/scope`|

## Claims mapping policy properties

To control what claims are emitted and where the data comes from, use the properties of a claims mapping policy. If a policy is not set, the system issues tokens that include the core claim set, the basic claim set, and any [optional claims](active-directory-optional-claims.md) that the application has chosen to receive.

### Include basic claim set

**String:** IncludeBasicClaimSet

**Data type:** Boolean (True or False)

**Summary:** This property determines whether the basic claim set is included in tokens affected by this policy.

- If set to True, all claims in the basic claim set are emitted in tokens affected by the policy. 
- If set to False, claims in the basic claim set are not in the tokens, unless they are individually added in the claims schema property of the same policy.

> [!NOTE] 
> Claims in the core claim set are present in every token, regardless of what this property is set to. 

### Claims schema

**String:** ClaimsSchema

**Data type:** JSON blob with one or more claim schema entries

**Summary:** This property defines which claims are present in the tokens affected by the policy, in addition to the basic claim set and the core claim set.
For each claim schema entry defined in this property, certain information is required. Specify where the data is coming from (**Value** or **Source/ID pair**), and which claim the data is emitted as (**Claim Type**).

### Claim schema entry elements

**Value:** The Value element defines a static value as the data to be emitted in the claim.

**Source/ID pair:** The Source and ID elements define where the data in the claim is sourced from. 

Set the Source element to one of the following values: 

- "user": The data in the claim is a property on the User object. 
- "application": The data in the claim is a property on the application (client) service principal. 
- "resource": The data in the claim is a property on the resource service principal.
- "audience": The data in the claim is a property on the service principal that is the audience of the token (either the client or resource service principal).
- "company": The data in the claim is a property on the resource tenant's Company object.
- "transformation": The data in the claim is from claims transformation (see the "Claims transformation" section later in this article).

If the source is transformation, the **TransformationID** element must be included in this claim definition as well.

The ID element identifies which property on the source provides the value for the claim. The following table lists the values of ID valid for each value of Source.

#### Table 3: Valid ID values per source

| Source | ID | Description |
|-----|-----|-----|
| User | surname | Family Name |
| User | givenname | Given Name |
| User | displayname | Display Name |
| User | objectid | ObjectID |
| User | mail | Email Address |
| User | userprincipalname | User Principal Name |
| User | department|Department|
| User | onpremisessamaccountname | On-premises SAM Account Name |
| User | netbiosname| NetBios Name |
| User | dnsdomainname | DNS Domain Name |
| User | onpremisesecurityidentifier | On-premises Security Identifier |
| User | companyname| Organization Name |
| User | streetaddress | Street Address |
| User | postalcode | Postal Code |
| User | preferredlanguange | Preferred Language |
| User | onpremisesuserprincipalname | On-premises UPN |
| User | mailnickname | Mail Nickname |
| User | extensionattribute1 | Extension Attribute 1 |
| User | extensionattribute2 | Extension Attribute 2 |
| User | extensionattribute3 | Extension Attribute 3 |
| User | extensionattribute4 | Extension Attribute 4 |
| User | extensionattribute5 | Extension Attribute 5 |
| User | extensionattribute6 | Extension Attribute 6 |
| User | extensionattribute7 | Extension Attribute 7 |
| User | extensionattribute8 | Extension Attribute 8 |
| User | extensionattribute9 | Extension Attribute 9 |
| User | extensionattribute10 | Extension Attribute 10 |
| User | extensionattribute11 | Extension Attribute 11 |
| User | extensionattribute12 | Extension Attribute 12 |
| User | extensionattribute13 | Extension Attribute 13 |
| User | extensionattribute14 | Extension Attribute 14 |
| User | extensionattribute15 | Extension Attribute 15 |
| User | othermail | Other Mail |
| User | country | Country/Region |
| User | city | City |
| User | state | State |
| User | jobtitle | Job Title |
| User | employeeid | Employee ID |
| User | facsimiletelephonenumber | Facsimile Telephone Number |
| User | assignedroles | list of App roles assigned to user|
| application, resource, audience | displayname | Display Name |
| application, resource, audience | objected | ObjectID |
| application, resource, audience | tags | Service Principal Tag |
| Company | tenantcountry | Tenant's country/region |

**TransformationID:** The TransformationID element must be provided only if the Source element is set to "transformation".

- This element must match the ID element of the transformation entry in the **ClaimsTransformation** property that defines how the data for this claim is generated.

**Claim Type:** The **JwtClaimType** and **SamlClaimType** elements define which claim this claim schema entry refers to.

- The JwtClaimType must contain the name of the claim to be emitted in JWTs.
- The SamlClaimType must contain the URI of the claim to be emitted in SAML tokens.

> [!NOTE]
> Names and URIs of claims in the restricted claim set cannot be used for the claim type elements. For more information, see the "Exceptions and restrictions" section later in this article.

### Claims transformation

**String:** ClaimsTransformation

**Data type:** JSON blob, with one or more transformation entries 

**Summary:** Use this property to apply common transformations to source data, to generate the output data for claims specified in the Claims Schema.

**ID:** Use the ID element to reference this transformation entry in the TransformationID Claims Schema entry. This value must be unique for each transformation entry within this policy.

**TransformationMethod:** The TransformationMethod element identifies which operation is performed to generate the data for the claim.

Based on the method chosen, a set of inputs and outputs is expected. Define the inputs and outputs by using the **InputClaims**, **InputParameters** and **OutputClaims** elements.

#### Table 4: Transformation methods and expected inputs and outputs

|TransformationMethod|Expected input|Expected output|Description|
|-----|-----|-----|-----|
|Join|string1, string2, separator|outputClaim|Joins input strings by using a separator in between. For example: string1:"foo@bar.com" , string2:"sandbox" , separator:"." results in outputClaim:"foo@bar.com.sandbox"|
|ExtractMailPrefix|mail|outputClaim|Extracts the local part of an email address. For example: mail:"foo@bar.com" results in outputClaim:"foo". If no \@ sign is present, then the original input string is returned as is.|

**InputClaims:** Use an InputClaims element to pass the data from a claim schema entry to a transformation. It has two attributes: **ClaimTypeReferenceId** and **TransformationClaimType**.

- **ClaimTypeReferenceId** is joined with ID element of the claim schema entry to find the appropriate input claim. 
- **TransformationClaimType** is used to give a unique name to this input. This name must match one of the expected inputs for the transformation method.

**InputParameters:** Use an InputParameters element to pass a constant value to a transformation. It has two attributes: **Value** and **ID**.

- **Value** is the actual constant value to be passed.
- **ID** is used to give a unique name to the input. The name must match one of the expected inputs for the transformation method.

**OutputClaims:** Use an OutputClaims element to hold the data generated by a transformation, and tie it to a claim schema entry. It has two attributes: **ClaimTypeReferenceId** and **TransformationClaimType**.

- **ClaimTypeReferenceId** is joined with the ID of the claim schema entry to find the appropriate output claim.
- **TransformationClaimType** is used to give a unique name to the output. The name must match one of the expected outputs for the transformation method.

### Exceptions and restrictions

**SAML NameID and UPN:** The attributes from which you source the NameID and UPN values, and the claims transformations that are permitted, are limited. See table 5 and table 6 to see the permitted values.

#### Table 5: Attributes allowed as a data source for SAML NameID

|Source|ID|Description|
|-----|-----|-----|
| User | mail|Email Address|
| User | userprincipalname|User Principal Name|
| User | onpremisessamaccountname|On Premises Sam Account Name|
| User | employeeid|Employee ID|
| User | extensionattribute1 | Extension Attribute 1 |
| User | extensionattribute2 | Extension Attribute 2 |
| User | extensionattribute3 | Extension Attribute 3 |
| User | extensionattribute4 | Extension Attribute 4 |
| User | extensionattribute5 | Extension Attribute 5 |
| User | extensionattribute6 | Extension Attribute 6 |
| User | extensionattribute7 | Extension Attribute 7 |
| User | extensionattribute8 | Extension Attribute 8 |
| User | extensionattribute9 | Extension Attribute 9 |
| User | extensionattribute10 | Extension Attribute 10 |
| User | extensionattribute11 | Extension Attribute 11 |
| User | extensionattribute12 | Extension Attribute 12 |
| User | extensionattribute13 | Extension Attribute 13 |
| User | extensionattribute14 | Extension Attribute 14 |
| User | extensionattribute15 | Extension Attribute 15 |

#### Table 6: Transformation methods allowed for SAML NameID

| TransformationMethod | Restrictions |
| ----- | ----- |
| ExtractMailPrefix | None |
| Join | The suffix being joined must be a verified domain of the resource tenant. |

### Custom signing key

A custom signing key must be assigned to the service principal object for a claims mapping policy to take effect. This ensures acknowledgment that tokens have been modified by the creator of the claims mapping policy and protects applications from claims mapping policies created by malicious actors. In order to add a custom signing key, you can use the Azure PowerShell cmdlet `new-azureadapplicationkeycredential` to create a symmetric key credential for your Application object. For more information on this Azure PowerShell cmdlet, see [New-AzureADApplicationKeyCredential](https://docs.microsoft.com/powerShell/module/Azuread/New-AzureADApplicationKeyCredential?view=azureadps-2.0).

Apps that have claims mapping enabled must validate their token signing keys by appending `appid={client_id}` to their [OpenID Connect metadata requests](v2-protocols-oidc.md#fetch-the-openid-connect-metadata-document). Below is the format of the OpenID Connect metadata document you should use: 

```
https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration?appid={client-id}
```

### Cross-tenant scenarios

Claims mapping policies do not apply to guest users. If a guest user tries to access an application with a claims mapping policy assigned to its service principal, the default token is issued (the policy has no effect).

## Claims mapping policy assignment

Claims mapping policies can only be assigned to service principal objects.

### Example claims mapping policies

In Azure AD, many scenarios are possible when you can customize claims emitted in tokens for specific service principals. In this section, we walk through a few common scenarios that can help you grasp how to use the claims mapping policy type.

#### Prerequisites

In the following examples, you create, update, link, and delete policies for service principals. If you are new to Azure AD, we recommend that you [learn about how to get an Azure AD tenant](quickstart-create-new-tenant.md) before you proceed with these examples.

To get started, do the following steps:

1. Download the latest [Azure AD PowerShell Module public preview release](https://www.powershellgallery.com/packages/AzureADPreview).
1. Run the Connect command to sign in to your Azure AD admin account. Run this command each time you start a new session.

   ``` powershell
   Connect-AzureAD -Confirm
   ```
1. To see all policies that have been created in your organization, run the following command. We recommend that you run this command after most operations in the following scenarios, to check that your policies are being created as expected.

   ``` powershell
   Get-AzureADPolicy
   ```

#### Example: Create and assign a policy to omit the basic claims from tokens issued to a service principal

In this example, you create a policy that removes the basic claim set from tokens issued to linked service principals.

1. Create a claims mapping policy. This policy, linked to specific service principals, removes the basic claim set from tokens.
   1. To create the policy, run this command: 
    
      ``` powershell
      New-AzureADPolicy -Definition @('{"ClaimsMappingPolicy":{"Version":1,"IncludeBasicClaimSet":"false"}}') -DisplayName "OmitBasicClaims" -Type "ClaimsMappingPolicy"
      ```
   2. To see your new policy, and to get the policy ObjectId, run the following command:
    
      ``` powershell
      Get-AzureADPolicy
      ```
1. Assign the policy to your service principal. You also need to get the ObjectId of your service principal.
   1. To see all your organization's service principals, you can [query the Microsoft Graph API](/graph/traverse-the-graph). Or, in [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer), sign in to your Azure AD account.
   2. When you have the ObjectId of your service principal, run the following command:  
     
      ``` powershell
      Add-AzureADServicePrincipalPolicy -Id <ObjectId of the ServicePrincipal> -RefObjectId <ObjectId of the Policy>
      ```

#### Example: Create and assign a policy to include the EmployeeID and TenantCountry as claims in tokens issued to a service principal

In this example, you create a policy that adds the EmployeeID and TenantCountry to tokens issued to linked service principals. The EmployeeID is emitted as the name claim type in both SAML tokens and JWTs. The TenantCountry is emitted as the country/region claim type in both SAML tokens and JWTs. In this example, we continue to include the basic claims set in the tokens.

1. Create a claims mapping policy. This policy, linked to specific service principals, adds the EmployeeID and TenantCountry claims to tokens.
   1. To create the policy, run the following command:  
     
      ``` powershell
      New-AzureADPolicy -Definition @('{"ClaimsMappingPolicy":{"Version":1,"IncludeBasicClaimSet":"true", "ClaimsSchema": [{"Source":"user","ID":"employeeid","SamlClaimType":"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/employeeid","JwtClaimType":"name"},{"Source":"company","ID":"tenantcountry","SamlClaimType":"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country","JwtClaimType":"country"}]}}') -DisplayName "ExtraClaimsExample" -Type "ClaimsMappingPolicy"
      ```
    
   2. To see your new policy, and to get the policy ObjectId, run the following command:
     
      ``` powershell  
      Get-AzureADPolicy
      ```
1. Assign the policy to your service principal. You also need to get the ObjectId of your service principal. 
   1. To see all your organization's service principals, you can [query the Microsoft Graph API](/graph/traverse-the-graph). Or, in [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer), sign in to your Azure AD account.
   2. When you have the ObjectId of your service principal, run the following command:  
     
      ``` powershell
      Add-AzureADServicePrincipalPolicy -Id <ObjectId of the ServicePrincipal> -RefObjectId <ObjectId of the Policy>
      ```

#### Example: Create and assign a policy that uses a claims transformation in tokens issued to a service principal

In this example, you create a policy that emits a custom claim "JoinedData" to JWTs issued to linked service principals. This claim contains a value created by joining the data stored in the extensionattribute1 attribute on the user object with ".sandbox". In this example, we exclude the basic claims set in the tokens.

1. Create a claims mapping policy. This policy, linked to specific service principals, adds the EmployeeID and TenantCountry claims to tokens.
   1. To create the policy, run the following command:
     
      ``` powershell
      New-AzureADPolicy -Definition @('{"ClaimsMappingPolicy":{"Version":1,"IncludeBasicClaimSet":"true", "ClaimsSchema":[{"Source":"user","ID":"extensionattribute1"},{"Source":"transformation","ID":"DataJoin","TransformationId":"JoinTheData","JwtClaimType":"JoinedData"}],"ClaimsTransformations":[{"ID":"JoinTheData","TransformationMethod":"Join","InputClaims":[{"ClaimTypeReferenceId":"extensionattribute1","TransformationClaimType":"string1"}], "InputParameters": [{"ID":"string2","Value":"sandbox"},{"ID":"separator","Value":"."}],"OutputClaims":[{"ClaimTypeReferenceId":"DataJoin","TransformationClaimType":"outputClaim"}]}]}}') -DisplayName "TransformClaimsExample" -Type "ClaimsMappingPolicy"
      ```
    
   2. To see your new policy, and to get the policy ObjectId, run the following command: 
     
      ``` powershell
      Get-AzureADPolicy
      ```
1. Assign the policy to your service principal. You also need to get the ObjectId of your service principal. 
   1. To see all your organization's service principals, you can [query the Microsoft Graph API](/graph/traverse-the-graph). Or, in [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer), sign in to your Azure AD account.
   2. When you have the ObjectId of your service principal, run the following command: 
     
      ``` powershell
      Add-AzureADServicePrincipalPolicy -Id <ObjectId of the ServicePrincipal> -RefObjectId <ObjectId of the Policy>
      ```

## See also

To learn how to customize claims issued in the SAML token through the Azure portal, see [How to: Customize claims issued in the SAML token for enterprise applications](active-directory-saml-claims-customization.md)
