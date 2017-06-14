---
title: 'Claims Mapping in Azure Active Directory (Public Preview)| Microsoft Docs'
description: This page describe Azure Active Directory claims mapping.
services: active-directory
author: billmath
manager: femila
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/14/2017
ms.author: billmath

---

# Claims mapping in Azure Active Directory (Public preview)


This feature is used by tenant admins to customize the claims emitted in tokens for a specific application in their tenant. Claims mapping policies can be used to:

- Select which claims will be included in tokens.
- Create claim types that do not already exist.
- Choose or change the source of data emitted in specific claims.

>[!NOTE]
>This capability currently is in Public Preview. Be prepared to revert or remove any changes. The feature is available in any Azure Active Directory subscription during Public Preview. However, when the feature becomes generally available, some aspects of the feature might require an Azure Active Directory Premium subscription.

## Claims mapping policy type
In Azure AD, a Policy object represents a set of rules enforced on individual applications or all applications in an organization. Each type of policy has a unique structure with a set of properties that are then applied to objects to which they are assigned objects.

A claims mapping policy is a type of Policy object that modify the claims emitted in tokens issued for specific applications.

## Claim sets
There are certain sets of claims that define how and when they are used in tokens.

## Core claim set
Claims in the core claim set will be present in every token regardless of policy. These claims are also considered restricted and cannot be modified.

## Basic claim set
The basic claim set includes the claims that are emitted by default for tokens (in addition to the core claim set). These claims can be omitted or modified using the claims mapping policies.

## Restricted claim set
Restricted claims cannot be modified using policy. The data source cannot be changed, and no transformation will be applied when generating these claims.

### Table 1 - JWT restricted claim set
|Claim Type (Name)|
| ----- |
|_claim_names|
|_claim_sources|
|access_token|
|account_type|
|acr|
|actor|
|actortoken|
|aio|
|altsecid|
|amr|
|app_chain|
|app_displayname|
|app_res|
|appctx|
|appctxsender|
|appid|
|appidacr|
|assertion|
|at_hash|
|aud|
|auth_data|
|auth_time|
|authorization_code|
|azp|
|azpacr|
|c_hash|
|ca_enf|
|cc|
|cert_token_use|
|client_id|
|cloud_graph_host_name|
|cloud_instance_name|
|cnf|
|code|
|controls|
|credential_keys|
|csr|
|csr_type|
|deviceid|
|dns_names|
|domain_dns_name|
|domain_netbios_name|
|e_exp|
|email|
|endpoint|
|enfpolids|
|exp|
|expires_on|
|grant_type|
|graph|
|group_sids|
|groups|
|hasgroups|
|hash_alg|
|home_oid|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationinstant|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/expiration|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/expired|
|http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress|
|http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name|
|http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier|
|iat|
|identityprovider|
|idp|
|in_corp|
|instance|
|ipaddr|
|isbrowserhostedapp|
|iss|
|jwk|
|key_id|
|key_type|
|mam_compliance_url|
|mam_enrollment_url|
|mam_terms_of_use_url|
|mdm_compliance_url|
|mdm_enrollment_url|
|mdm_terms_of_use_url|
|nameid|
|nbf|
|netbios_name|
|nonce|
|oid|
|on_prem_id|
|onprem_sam_account_name|
|onprem_sid|
|openid2_id|
|password|
|platf|
|polids|
|pop_jwk|
|preferred_username|
|previous_refresh_token|
|primary_sid|
|puid|
|pwd_exp|
|pwd_url|
|redirect_uri|
|refresh_token|
|refreshtoken|
|request_nonce|
|resource|
|role|
|roles|
|scope|
|scp|
|sid|
|signature|
|signin_state|
|src1|
|src2|
|sub|
|tbid|
|tenant_display_name|
|tenant_region_scope|
|thumbnail_photo|
|tid|
|tokenAutologonEnabled|
|trustedfordelegation|
|unique_name|
|upn|
|user_setting_sync_url|
|username|
|uti|
|ver|
|verified_primary_email|
|verified_secondary_email|
|wids|
|win_ver|

### Table 2 - SAML restricted claim set
|Claim Type (URI)|
| ----- |
|http://schemas.microsoft.com/ws/2008/06/identity/claims/expiration|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/expired|
|http://schemas.microsoft.com/identity/claims/accesstoken|
|http://schemas.microsoft.com/identity/claims/openid2_id|
|http://schemas.microsoft.com/identity/claims/identityprovider|
|http://schemas.microsoft.com/identity/claims/objectidentifier|
|http://schemas.microsoft.com/identity/claims/puid|
|http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier[MR1] |
|http://schemas.microsoft.com/identity/claims/tenantid|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationinstant|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod|
|http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/groups|
|http://schemas.microsoft.com/claims/groups.link|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/role|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/wids|
|http://schemas.microsoft.com/2014/09/devicecontext/claims/iscompliant|
|http://schemas.microsoft.com/2014/02/devicecontext/claims/isknown|
|http://schemas.microsoft.com/2012/01/devicecontext/claims/ismanaged|
|http://schemas.microsoft.com/2014/03/psso|
|http://schemas.microsoft.com/claims/authnmethodsreferences|
|http://schemas.xmlsoap.org/ws/2009/09/identity/claims/actor|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/samlissuername|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/confirmationkey|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/primarygroupsid|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid|
|http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision|
|http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication|
|http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlyprimarygroupsid|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlyprimarysid|
|http://schemas.xmlsoap.org/ws/2005/05/identity/claims/denyonlysid|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlywindowsdevicegroup|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsdeviceclaim|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsdevicegroup|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsfqbnversion|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/windowssubauthority|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsuserclaim|
|http://schemas.xmlsoap.org/ws/2005/05/identity/claims/x500distinguishedname|
|http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid|
|http://schemas.xmlsoap.org/ws/2005/05/identity/claims/spn|
|http://schemas.microsoft.com/ws/2008/06/identity/claims/ispersistent|
|http://schemas.xmlsoap.org/ws/2005/05/identity/claims/privatepersonalidentifier|
|http://schemas.microsoft.com/identity/claims/scope|

## Claims mapping policy properties
The properties of a claims mapping policy are used to control which claims are emitted and where the data is sourced from. If no policy is set, the system issues tokens containing the core claim set, the basic claim set and any optional claims that the application has opted in to receive.

### Include basic claim set

Property Overview

**String:** IncludeBasicClaimSet

**Data Type:** Boolean (True or False)

**Summary:** This property determines whether the basic claim set is included in tokens affected by this policy. 

- If set to True, all claims in the basic claim set are emitted in tokens affected by the policy. 
- If set to False, claims in the basic claim set will not be in the tokens unless they are individually added in the claims schema property of the same policy.

>[!NOTE] 
>Claims in the core claim set will be present in every token regardless of what this property is set to. 

### Claims schema
Property Overview

**String:** ClaimsSchema

**Data Type:** JSON blob with one or more claim schema entries (See Sample Claims Mapping Policies section for format)

**Summary:** This property is used to define which claims will be present in the tokens affected by the policy in addition to the basic claim set (if IncludeBasicClaimSet is set to True) and the core claim set.
For each claim schema entry defined in this property, 2 pieces of information must be established – where the data is coming from (Value or Source/ID pair) and which claim the data will be emitted as (Claim Type).

### Claim schema entry elements

**Value:** The Value element defines a static value as the data to be emitted in the claim.

**Source/ID pair:** The Source and ID elements define where the data in the claim will be sourced from. 

The Source element must be set to one of the following: 


- "user": data in claim is a property on the User object 
- "application": data in claim is a property on the application (client) service principal 
- "resource": data in claim is a property on the resource service principal
- "audience": data in claim is a property on the service principal that is the audience of the token (either the client or resource service principal)
- “company”: data in claim is a property on the resource tenant’s Company object
- "transformation": data in claim is from claims transformation, see Claims Transformation section below. 

If the source is transformation, the TransformationID element must be included in this claim definition as well.

The ID element identifies which property on the source will provide the value for the claim. The table below lists the values of ID valid for each value of Source.

### Table 3 - Valid ID values per source
|Source|ID|Description|
|-----|-----|-----|
|User|surname|Family Name|
|User|givenname|Given Name|
|User|displayname|Display Name|
|User|objectid|ObjectID|
|User|mail|Email Address|
|User|userprincipalname|User Principal Name|
|User|department|Department|
|User|onpremisessamaccountname|On Premises Sam Account Name|
|User|netbiosname|NetBios Name|
|User|dnsdomainname|Dns Domain Name|
|User|onpremisesecurityidentifier|On Premise Security Identifier|
|User|companyname|Organization Name|
|User|streetaddress|Street Address|
|User|postalcode|Postal Code|
|User|preferredlanguange|Preferred Language|
|User|onpremisesuserprincipalname|On Premise UPN|
|User|mailnickname|Mail Nickname|
|User|extensionattribute1|Extension Attribute 1|
|User|extensionattribute2|Extension Attribute 2|
|User|extensionattribute3|Extension Attribute 3|
|User|extensionattribute4|Extension Attribute 4|
|User|extensionattribute5|Extension Attribute 5|
|User|extensionattribute6|Extension Attribute 6|
|User|extensionattribute7|Extension Attribute 7|
|User|extensionattribute8|Extension Attribute 8|
|User|extensionattribute9|Extension Attribute 9|
|User|extensionattribute10|Extension Attribute 10|
|User|extensionattribute11|Extension Attribute 11|
|User|extensionattribute12|Extension Attribute 12|
|User|extensionattribute13|Extension Attribute 13|
|User|extensionattribute14|Extension Attribute 14|
|User|extensionattribute15|Extension Attribute 15|
|User|othermail|Other Mail|
|User|country|Country|
|User|city|City|
|User|state|State|
|User|jobtitle|Job Title|
|User|employeeid|Employee ID|
|User|facsimiletelephonenumber|Facsimile Telephone Number|
|application, resource, audience|displayname|Display Name|
|application, resource, audience|objected|ObjectID|
|application, resource, audience|tags|Service Principal Tag|
|Company|tenantcountry|Tenant’s country|

**TransformationID:** The TransformationID element must be provided only if the Source element is set to “transformation”.

- This element must match the ID element of the transformation entry in the ClaimsTransformation property that defines how the data for this claim is generated.

**Claim Type:** The JwtClaimType and SamlClaimType elements define which claim this claim schema entry refers to.

- The JwtClaimTypeshould must contain the name of the claim to be emitted in JWTs.
- The SamlClaimType must contain the URI of the claim to be emitted in SAML tokens.

>[!NOTE]
>Names and URIs of claims in the restricted claim set cannot be used for the claim type elements. See Exceptions and Restrictions section below.

### Claims transformation
Property Overview

**String:** ClaimsTransformation

**Data Type:** JSON blob with one or more transformation entries (See Sample Claims 
Mapping Policies section for format)

**Summary:** This property is used to apply common transformations to source data to generate the output data for claims specified in the Claims Schema.
Transformation Entry Elements

**ID:** The ID element is used to reference this transformation entry in the TransformationID a Claims Schema entry. This value must be unique for each transformation entry within this policy.

**TransformationMethod:** The TransformationMethod element identifies which operation will be performed to generate the data for the claim.

Based on the method chosen, a set of inputs and outputs will be expected. These are defined using the InputClaims, InputParameters and OutputClaims elements.

### Table 4 - Transformation methods and expected inputs/outputs
|TransformationMethod|Expected Input|Expected Output|Description|
|-----|-----|-----|-----|
|Join|string1, string2, separator|outputClaim|Joins input strings using a separator in between. eg: string1:"foo@bar.com" , sring2:"sandbox" , separator:"." will result in outputClaim:"foo@bar.com.sandbox"|
|ExtractMailPrefix|mail|outputClaim|Extracts the local part of an email address. eg: mail:"foo@bar.com" will result in outputClaim:"foo" .If no '@" sign is present then the orignal input string is returned as is.|

**InputClaims:** An InputClaims element can be used to pass the data from a claim schema entry to a transformation. It has two attributes: ClaimTypeReferenceId and 
TransformationClaimType.

- ClaimTypeReferenceId is joined with ID element of the claim schema entry to find the appropriate input claim. 
- TransformationClaimType is used to give a unique name to this input. This name must match one of the expected inputs for the transformation method.

**InputParameters:** An InputParameters element is used to pass a constant value to a transformation. It has two attributes: Value and ID.
Value is the actual constant value to be passed.
ID is used to give a unique name to this input. This name must match one of the expected inputs for the transformation method.

**OutputClaims:** An OutputClaims element is used to hold the data generated by a transformation and ties it to a claim schema entry. It has two attributes: ClaimTypeReferenceId and TransformationClaimType.

ClaimTypeReferenceId is joined with ID of the claim schema entry to find the appropriate output claim. TransformationClaimType is used to give a unique name to this output. This name must match one of the expected outputs for the transformation method.

### Exceptions and restrictions

**SAML NameID and UPN:** The attributes from which we source the NameID and UPN values from, and the claims transformations permitted, are limited.

### Table 5 - Attributes allowed as data source for SAML NameID
|Source|ID|Description|
|-----|-----|-----|
|User|mail|Email Address|
|User|userprincipalname|User Principal Name|
|User|onpremisessamaccountname|On Premises Sam Account Name|
|User|employeeid|Employee ID|
|User|extensionattribute1|Extension Attribute 1|
|User|extensionattribute2|Extension Attribute 2|
|User|extensionattribute3|Extension Attribute 3|
|User|extensionattribute4|Extension Attribute 4|
|User|extensionattribute5|Extension Attribute 5|
|User|extensionattribute6|Extension Attribute 6|
|User|extensionattribute7|Extension Attribute 7|
|User|extensionattribute8|Extension Attribute 8|
|User|extensionattribute9|Extension Attribute 9|
|User|extensionattribute10|Extension Attribute 10|
|User|extensionattribute11|Extension Attribute 11|
|User|extensionattribute12|Extension Attribute 12|
|User|extensionattribute13|Extension Attribute 13|
|User|extensionattribute14|Extension Attribute 14|
|User|extensionattribute15|Extension Attribute 15|

### Table 6 - Transformation methods allowed for SAML NameID
|TransformationMethod|Restrictions|
| ----- | ----- |
|ExtractMailPrefix||None|
|Join|The suffix being joined must be a verified domain of the resource tenant.|

### Custom signing key
A custom signing key must be assigned to the service principal object for a claims mapping policy to take effect. All tokens issued that have been impacted by the policy will be signed with this key. Applications must be configured to accept tokens signed with this key. This ensures acknowledgment that tokens have been modified by the creator of the claims mapping policy. This protects applications from claims mapping policies created by malicious actors.

### Cross-tenant scenarios
Claims mapping policies do not apply to guest users. If a guest user attempts to access an application with a claims mapping policy assigned to its service principal, the default token will be issued (the policy will have no effect).

## Claims mapping policy assignment
Claims mapping policies can only be assigned to service principal objects.

### Example claims mapping policies

Many scenarios are possible in Azure AD when you can customize claims emitted in tokens for specific Service Principals. In this section, we walk through a few common scenarios that can help you grasp how to use the Claims Mapping Policy type.

#### Prerequisites
In the following examples, you create, update, link, and delete policies for service principals. If you are new to Azure AD, we recommend that you learn about how to get an Azure AD tenant before you proceed with these examples. 

To get started, do the following steps:


1. Download the latest [Azure AD PowerShell Module Public Preview release](https://www.powershellgallery.com/packages/AzureADPreview/2.0.0.127).
2.	Run the Connect command to sign in to your Azure AD admin account. Run this command each time you start a new session.
	
	 ``` powershell
	Connect-AzureAD -Confirm
	
	```
3.	To see all policies that have been created in your organization, run the following command. We recommend that you run this command after most operations in the following scenarios to check that your policies are being created as expected.
   
    ``` powershell
		Get-AzureADPolicy
    
	```
#### Example: Create and assign a policy to omit the basic claims from tokens issued to a service principal.
In this example, you create a policy that removes the Basic Claim set from tokens issued to linked Service Principals.


1. Create a Claims Mapping policy. This policy, that will be linked to specific Service Principals, removes the basic claim set from tokens.
	1. To create the policy, run this command: 
	
	 ``` powershell
	New-AzureADPolicy -Definition @('{"ClaimsMappingPolicy":{"Version":1,"IncludeBasicClaimSet":"false"}}') -DisplayName "OmitBasicClaims” -Type "ClaimsMappingPolicy"
	```
	2. To see your new policy, and to get the policy ObjectId, run the following command:
	
	 ``` powershell
	Get-AzureADPolicy
	```
2.	Assign the policy to your service principal. You also need to get the ObjectId of your service principal. 
	1.	To see all your organization's service principals, you can query Microsoft Graph. Or, in Azure AD Graph Explorer, sign in to your Azure AD account.
	2.	When you have the ObjectId of your service principal, run the following command:  
	 
	 ``` powershell
	Add-AzureADServicePrincipalPolicy -Id <ObjectId of the ServicePrincipal> -RefObjectId <ObjectId of the Policy>
	```
#### Example: Create and assign a policy to include the EmployeeID and TenantCountry as claims in tokens issued to a service principal.
In this example, you create a policy that adds the EmployeeID and TenantCountry to tokens issued to linked Service Principals. The EmployeeID will be emitted as the name claim type in both SAML tokens and JWTs. The TenantCountry will be emitted as the country claim type in both SAML tokens and JWTs. In this example, we will also choose to continue to include the Basic Claims Set in the tokens.

1. Create a Claims Mapping policy. This policy, that will be linked to specific Service Principals, adds the EmployeeID and TenantCountry claims to tokens.
	1. To create the policy, run this command:  
	 
	 ``` powershell
	New-AzureADPolicy -Definition @('{"ClaimsMappingPolicy":{"Version":1,"IncludeBasicClaimSet":"true", "ClaimsSchema": [{"Source":"user","ID":"employeeid","SamlClaimType":"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name","JwtClaimType":"name"},{"Source":"company","ID":" tenantcountry ","SamlClaimType":" http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country ","JwtClaimType":"country"}]}}') -DisplayName "ExtraClaimsExample” -Type "ClaimsMappingPolicy"
	```
	
	2. To see your new policy, and to get the policy ObjectId, run the following command:
	 
	 ``` powershell  
	Get-AzureADPolicy
	```
2.	Assign the policy to your service principal. You also need to get the ObjectId of your service principal. 
	1.	To see all your organization's service principals, you can query Microsoft Graph. Or, in Azure AD Graph Explorer, sign in to your Azure AD account.
	2.	When you have the ObjectId of your service principal, run the following command:  
	 
	 ``` powershell
	Add-AzureADServicePrincipalPolicy -Id <ObjectId of the ServicePrincipal> -RefObjectId <ObjectId of the Policy>
	```
#### Example: Create and assign a policy utilizing a claims transformation in tokens issued to a service principal.
In this example, you create a policy that emits a custom claim “JoinedData” to JWTs issued to linked Service Principals. This claim will contain a value created by joining the data stored in the extensionattribute1 attribute on the user object with “.sandbox”. In this example, we will also choose to exclude the Basic Claims Set in the tokens.


1. Create a Claims Mapping policy. This policy, that will be linked to specific Service Principals, adds the EmployeeID and TenantCountry claims to tokens.
	1. To create the policy, run this command: 
	 
	 ``` powershell
	New-AzureADPolicy -Definition @('{"ClaimsMappingPolicy":{"Version":1,"IncludeBasicClaimSet":"true", "ClaimsSchema":[{"Source":"user","ID":"extensionattribute1"},{"Source":"transformation","ID":"DataJoin","TransformationId":"JoinTheData","JwtClaimType":"JoinedData"}],"ClaimsTransformation":[{"ID":"JoinTheData","TransformationMethod":"Join","InputClaims":[{"ClaimTypeReferenceId":"extensionattribute1","TransformationClaimType":"string1"}], "InputParameters": [{"Id":"string2","Value":"sandbox"},{"Id":"separator","Value":"."}],"OutputClaims":[{"ClaimTypeReferenceId":"DataJoin","TransformationClaimType":"outputClaim"}]}]}}') -DisplayName "TransformClaimsExample” -Type "ClaimsMappingPolicy"
	```
	
	2. To see your new policy, and to get the policy ObjectId, run the following command: 
	 
	 ``` powershell
	Get-AzureADPolicy
	```
2.	Assign the policy to your service principal. You also need to get the ObjectId of your service principal. 
	1.	To see all your organization's service principals, you can query Microsoft Graph. Or, in Azure AD Graph Explorer, sign in to your Azure AD account.
	2.	When you have the ObjectId of your service principal, run the following command: 
	 
	 ``` powershell
	Add-AzureADServicePrincipalPolicy -Id <ObjectId of the ServicePrincipal> -RefObjectId <ObjectId of the Policy>
	```