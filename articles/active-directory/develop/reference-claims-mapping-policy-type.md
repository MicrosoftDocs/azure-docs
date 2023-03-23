---
title: Claims mapping policy
description: Learn about the claims mapping policy type, which is used to modify the claims emitted in tokens issued for specific applications.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.custom: aaddev
ms.workload: identity
ms.topic: reference
ms.date: 01/06/2023
ms.author: davidmu
ms.reviewer: ludwignick, jeedes
---

# Claims mapping policy type

In Azure AD, a **Policy** object represents a set of rules enforced on individual applications or on all applications in an organization. Each type of policy has a unique structure, with a set of properties that are then applied to objects to which they're assigned.

A claims mapping policy is a type of **Policy** object that [modifies the claims emitted in tokens](active-directory-claims-mapping.md) issued for specific applications.

## Claim sets

There are certain sets of claims that define how and when they're used in tokens.

| Claim set | Description |
|---|---|
| Core claim set | Are present in every token regardless of the policy. These claims are also considered restricted, and can't be modified. |
| Basic claim set | Includes the claims that are emitted by default for tokens (in addition to the core claim set). You can [omit or modify basic claims](active-directory-claims-mapping.md#omit-the-basic-claims-from-tokens) by using the claims mapping policies. |
| Restricted claim set | Can't be modified using policy. The data source can't be changed, and no transformation is applied when generating these claims. |

This section lists:
- [Table 1: JSON Web Token (JWT) restricted claim set](#table-1-json-web-token-jwt-restricted-claim-set)
- [Table 2: SAML restricted claim set](#table-2-saml-restricted-claim-set)

### Table 1: JSON Web Token (JWT) restricted claim set

> [!NOTE]
> Any claim starting with "xms_" is restricted.

| Claim type (name) |
| ----- |
|.|
|_claim_names|
|_claim_sources|
|aai|
|access_token|
|account_type|
|acct|
|acr|
|acrs|
|actor|
|ageGroup|
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
|at_hash|
|auth_time|
|azp|
|azpacr|
|c_hash|
|ca_enf|
|ca_policy_result|
|capolids_latebind|
|capolids|
|cc|
|cnf|
|code|
|controls_auds|
|controls|
|credential_keys|
|ctry|
|deviceid|
|domain_dns_name|
|domain_netbios_name|
|e_exp|
|email|
|endpoint|
|enfpolids|
|expires_on|
|fido_auth_data|
|fwd_appidacr|
|fwd|
|graph|
|group_sids|
|groups|
|hasgroups|
|haswids|
|home_oid|
|home_puid|
|home_tid|
|identityprovider|
|idp|
|idtyp|
|in_corp|
|instance|
|inviteTicket|
|ipaddr|
|isbrowserhostedapp|
|isViral|
|login_hint|
|mam_compliance_url|
|mam_enrollment_url|
|mam_terms_of_use_url|
|mdm_compliance_url|
|mdm_enrollment_url|
|mdm_terms_of_use_url|
|msproxy|
|nameid|
|nickname|
|nonce|
|oid|
|on_prem_id|
|onprem_sam_account_name|
|onprem_sid|
|openid2_id|
|origin_header|
|platf|
|polids|
|pop_jwk|
|preferred_username|
|primary_sid|
|prov_data|
|puid|
|pwd_exp|
|pwd_url|
|rdp_bt|
|refresh_token_issued_on|
|refreshtoken|
|rh|
|roles|
|rt_type|
|scp|
|secaud|
|sid|
|sid|
|signin_state|
|source_anchor|
|src1|
|src2|
|sub|
|target_deviceid|
|tbid|
|tbidv2|
|tenant_ctry|
|tenant_display_name|
|tenant_region_scope|
|tenant_region_sub_scope|
|thumbnail_photo|
|tid|
|tokenAutologonEnabled|
|trustedfordelegation|
|ttr|
|unique_name|
|upn|
|user_setting_sync_url|
|uti|
|ver|
|verified_primary_email|
|verified_secondary_email|
|vnet|
|wamcompat_client_info|
|wamcompat_id_token|
|wamcompat_scopes|
|wids|
|xcb2b_rclient|
|xcb2b_rcloud|
|xcb2b_rtenant|
|ztdid|

### Table 2: SAML restricted claim set

The following table lists the SAML claims that are by default in the restricted claim set.

| Claim type (URI) |
| ----- |
|`http://schemas.microsoft.com/2012/01/devicecontext/claims/ismanaged`|
|`http://schemas.microsoft.com/2014/02/devicecontext/claims/isknown`|
|`http://schemas.microsoft.com/2014/03/psso`|
|`http://schemas.microsoft.com/2014/09/devicecontext/claims/iscompliant`|
|`http://schemas.microsoft.com/claims/authnmethodsreferences`|
|`http://schemas.microsoft.com/claims/groups.link`|
|`http://schemas.microsoft.com/identity/claims/accesstoken`|
|`http://schemas.microsoft.com/identity/claims/acct`|
|`http://schemas.microsoft.com/identity/claims/agegroup`|
|`http://schemas.microsoft.com/identity/claims/aio`|
|`http://schemas.microsoft.com/identity/claims/identityprovider`|
|`http://schemas.microsoft.com/identity/claims/objectidentifier`|
|`http://schemas.microsoft.com/identity/claims/openid2_id`|
|`http://schemas.microsoft.com/identity/claims/puid`|
|`http://schemas.microsoft.com/identity/claims/tenantid`|
|`http://schemas.microsoft.com/identity/claims/xms_et`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationinstant`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/expiration`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/groups`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/role`|
|`http://schemas.microsoft.com/ws/2008/06/identity/claims/wids`|
|`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier`|
| `http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname` |
| `http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid` |
| `http://schemas.microsoft.com/ws/2008/06/identity/claims/primarygroupsid` |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid` |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/x500distinguishedname` |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn`  |
| `http://schemas.microsoft.com/ws/2008/06/identity/claims/role` |

These claims are restricted by default, but aren't restricted if you [set the AcceptMappedClaims property](active-directory-claims-mapping.md#update-the-application-manifest) to `true` in your app manifest *or* have a [custom signing key](active-directory-claims-mapping.md#configure-a-custom-signing-key):

- `http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/primarygroupsid`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/x500distinguishedname`

These claims are restricted by default, but aren't restricted if you have a [custom signing key](active-directory-claims-mapping.md#configure-a-custom-signing-key):

 - `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn`
 - `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`
 
## Claims mapping policy properties

To control what claims are emitted and where the data comes from, use the properties of a claims mapping policy. If a policy isn't set, the system issues tokens that include the core claim set, the basic claim set, and any [optional claims](active-directory-optional-claims.md) that the application has chosen to receive.

> [!NOTE]
> Claims in the core claim set are present in every token, regardless of what this property is set to.

### Include basic claim set

**String:** IncludeBasicClaimSet

**Data type:** Boolean (True or False)

**Summary:** This property determines whether the basic claim set is included in tokens affected by this policy.

- If set to True, all claims in the basic claim set are emitted in tokens affected by the policy.
- If set to False, claims in the basic claim set aren't in the tokens, unless they're individually added in the claims schema property of the same policy.



### Claims schema

**String:** ClaimsSchema

**Data type:** JSON blob with one or more claim schema entries

**Summary:** This property defines which claims are present in the tokens affected by the policy, in addition to the basic claim set and the core claim set.
For each claim schema entry defined in this property, certain information is required. Specify where the data is coming from (**Value**, **Source/ID pair**, or **Source/ExtensionID pair**), and which claim the data is emitted as (**Claim Type**).

### Claim schema entry elements

**Value:** The Value element defines a static value as the data to be emitted in the claim.

**SAMLNameFormat:** The SAML Name Format property specifies the value for the “NameFormat” attribute for this claim. If present, the allowed values are: 
- urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified 
- urn:oasis:names:tc:SAML:2.0:attrname-format:uri 
- urn:oasis:names:tc:SAML:2.0:attrname-format:basic 

**Source/ID pair:** The Source and ID elements define where the data in the claim is sourced from.

**Source/ExtensionID pair:** The Source and ExtensionID elements define the directory extension attribute where the data in the claim is sourced from. For more information, see [Using directory extension attributes in claims](active-directory-schema-extensions.md).

Set the Source element to one of the following values:

- "user": The data in the claim is a property on the User object.
- "application": The data in the claim is a property on the application (client) service principal.
- "resource": The data in the claim is a property on the resource service principal.
- "audience": The data in the claim is a property on the service principal that is the audience of the token (either the client or resource service principal).
- "company": The data in the claim is a property on the resource tenant's Company object.
- "transformation": The data in the claim is from claims transformation (see the "Claims transformation" section later in this article).

If the source is transformation, the **TransformationID** element must be included in this claim definition as well.

The ID element identifies which property on the source provides the value for the claim. The following table lists the values of ID valid for each value of Source.


> [!WARNING]
> Currently, the only available multi-valued claim sources on a user object are multi-valued extension attributes which have been synced from AADConnect.  Other properties, such as OtherMails and tags, are multi-valued but only one value is emitted when selected as a source.

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
| User | preferredlanguage | Preferred Language |
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
| User | accountEnabled | Account Enabled |
| User | consentprovidedforminor | Consent Provided For Minor |
| User | createddatetime | Created Date/Time| 
| User | creationtype | Creation Type |
| User | lastpasswordchangedatetime | Last Password Change Date/Time |
| User | mobilephone | Mobile Phone |
| User | officelocation | Office Location |
| User | onpremisesdomainname | On-premises Domain Name |
| User | onpremisesimmutableid | On-premises Immutable ID |
| User | onpremisessyncenabled | On-premises Sync Enabled |
| User | preferreddatalocation | Preferred Data Location |
| User | proxyaddresses | Proxy Addresses |
| User | usertype | User Type |
| User | telephonenumber| Business Phones / Office Phones |
| application, resource, audience | displayname | Display Name |
| application, resource, audience | objectid | ObjectID |
| application, resource, audience | tags | Service Principal Tag |
| Company | tenantcountry | Tenant's country/region |

**TransformationID:** The TransformationID element must be provided only if the Source element is set to "transformation".

- This element must match the ID element of the transformation entry in the **ClaimsTransformation** property that defines how the data for this claim is generated.

**Claim Type:** The **JwtClaimType** and **SamlClaimType** elements define which claim this claim schema entry refers to.

- The JwtClaimType must contain the name of the claim to be emitted in JWTs.
- The SamlClaimType must contain the URI of the claim to be emitted in SAML tokens.

* **onPremisesUserPrincipalName attribute:** When using an Alternate ID, the on-premises attribute userPrincipalName is synchronized with the Azure AD attribute onPremisesUserPrincipalName. This attribute is only available when Alternate ID is configured.

> [!NOTE]
> Names and URIs of claims in the restricted claim set cannot be used for the claim type elements. For more information, see the "Exceptions and restrictions" section later in this article.

### Group Filter

**String:** GroupFilter

**Data type:** JSON blob

**Summary:** Use this property to apply a filter on the user’s groups to be included in the group claim. This can be a useful means of reducing the token size.

**MatchOn:** The **MatchOn** property identifies the group attribute on which to apply the filter. 

Set the **MatchOn** property to one of the following values:

- "displayname": The group display name.
- "samaccountname": The On-premises SAM Account Name

**Type:** The **Type** property selects the type of filter you wish to apply to the attribute selected by the **MatchOn** property. 

Set the **Type** property to one of the following values:

- "prefix": Include groups where the **MatchOn** property starts with the provided **Value** property.
- "suffix": Include groups where the **MatchOn** property ends with the provided **Value** property.
- "contains": Include groups where the **MatchOn** property contains with the provided **Value** property.

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
|ExtractMailPrefix|Email or UPN|extracted string|ExtensionAttributes 1-15 or any other directory extensions, which are storing a UPN or email address value for the user, for example, johndoe@contoso.com. Extracts the local part of an email address. For example: mail:"foo@bar.com" results in outputClaim:"foo". If no \@ sign is present, then the original input string is returned as is.|

**InputClaims:** Use an InputClaims element to pass the data from a claim schema entry to a transformation. It has three attributes: **ClaimTypeReferenceId**, **TransformationClaimType** and **TreatAsMultiValue**

- **ClaimTypeReferenceId** is joined with ID element of the claim schema entry to find the appropriate input claim.
- **TransformationClaimType** is used to give a unique name to this input. This name must match one of the expected inputs for the transformation method.
- **TreatAsMultiValue** is a Boolean flag indicating if the transform should be applied to all values or just the first. By default, transformations will only be applied to the first element in a multi value claim, by setting this value to true it ensures it's applied to all. ProxyAddresses and groups are two examples for input claims that you would likely want to treat as a multi value. 

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
| User | telephonenumber| Business Phones / Office Phones |
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

### Issuer With Application ID 
**String:** issuerWithApplicationId  
**Data type:** Boolean (True or False)   
**Summary:** This property enables the addition of the application ID to the issuer claim. Ensures that multiple instances of the same application have a unique claim value for each instance. This setting is ignored if a custom signing key isn't configured for the application.
- If set to `True`, the application ID is added to the issuer claim in tokens affected by the policy.
- If set to `False`, the application ID isn't added to the issuer claim in tokens affected by the policy. (default) 
 
### Audience Override 
**String:** audienceOverride  
**Data type:** String  
**Summary:** This property enables the overriding of the audience claim sent to the application. The value provided must be a valid absolute URI. This setting is ignored if no custom signing key is configured for the application. 


## Next steps

- To learn how to customize the claims emitted in tokens for a specific application in their tenant using PowerShell, see [How to: Customize claims emitted in tokens for a specific app in a tenant](active-directory-claims-mapping.md)
- To learn how to customize claims issued in the SAML token through the Azure portal, see [How to: Customize claims issued in the SAML token for enterprise applications](active-directory-saml-claims-customization.md)
- To learn more about extension attributes, see [Using directory extension attributes in claims](active-directory-schema-extensions.md).
