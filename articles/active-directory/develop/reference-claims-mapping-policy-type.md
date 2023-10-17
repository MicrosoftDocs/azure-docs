---
title: Claims mapping policy type
description: Learn about the claims mapping policy type, which is used to modify the claims emitted in tokens in the Microsoft identity platform.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.custom: aaddev, curation-claims
ms.workload: identity
ms.topic: reference
ms.date: 06/02/2023
ms.author: davidmu
ms.reviewer: ludwignick, jeedes
---

# Claims mapping policy type

A policy object represents a set of rules enforced on individual applications or on all applications in an organization. Each type of policy has a unique structure, with a set of properties that are then applied to objects to which they're assigned.

A claims mapping policy is a type of policy object that modifies the claims included in tokens. For more information, see [Customize claims issued in the SAML token for enterprise applications](saml-claims-customization.md).

## Claim sets

The following table lists the sets of claims that define how and when they're used in tokens.

| Claim set | Description |
|-----------|-------------|
| Core claim set | Present in every token regardless of the policy. These claims are also considered restricted, and can't be modified. |
| Basic claim set | Includes the claims that are included by default for tokens in addition to the core claim set. You can omit or modify basic claims by using the claims mapping policies. |
| Restricted claim set | Can't be modified using a policy. The data source can't be changed, and no transformation is applied when generating these claims. |

### JSON Web Token (JWT) restricted claim set

The following claims are in the restricted claim set for a JWT.

- `.`
- `_claim_names`
- `_claim_sources`
- `aai`
- `access_token`
- `account_type`
- `acct`
- `acr`
- `acrs`
- `actor`
- `actortoken`
- `ageGroup`
- `aio`
- `altsecid`
- `amr`
- `app_chain`
- `app_displayname`
- `app_res`
- `appctx`
- `appctxsender`
- `appid`
- `appidacr`
- `assertion`
- `at_hash`
- `aud`
- `auth_data`
- `auth_time`
- `authorization_code`
- `azp`
- `azpacr`
- `bk_claim`
- `bk_enclave`
- `bk_pub`
- `brk_client_id`
- `brk_redirect_uri`
- `c_hash`
- `ca_enf`
- `ca_policy_result`
- `capolids`
- `capolids_latebind`
- `cc`
- `cert_token_use`
- `child_client_id`
- `child_redirect_uri`
- `client_id`
- `client_ip`
- `cloud_graph_host_name`
- `cloud_instance_host_name`
- `cloud_instance_name`
- `CloudAssignedMdmId`
- `cnf`
- `code`
- `controls`
- `controls_auds`
- `credential_keys`
- `csr`
- `csr_type`
- `ctry`
- `deviceid`
- `dns_names`
- `domain_dns_name`
- `domain_netbios_name`
- `e_exp`
- `email`
- `endpoint`
- `enfpolids`
- `exp`
- `expires_on`
- `extn. as prefix`
- `fido_auth_data`
- `fido_ver`
- `fwd`
- `fwd_appidacr`
- `grant_type`
- `graph`
- `group_sids`
- `groups`
- `hasgroups`
- `hash_alg`
- `haswids`
- `home_oid`
- `home_puid`
- `home_tid`
- `iat`
- `identityprovider`
- `idp`
- `idtyp`
- `in_corp`
- `instance`
- `inviteTicket`
- `ipaddr`
- `isbrowserhostedapp`
- `iss`
- `isViral`
- `jwk`
- `key_id`
- `key_type`
- `login_hint`
- `mam_compliance_url`
- `mam_enrollment_url`
- `mam_terms_of_use_url`
- `mdm_compliance_url`
- `mdm_enrollment_url`
- `mdm_terms_of_use_url`
- `msgraph_host`
- `msproxy`
- `nameid`
- `nbf`
- `netbios_name`
- `nickname`
- `nonce`
- `oid`
- `on_prem_id`
- `onprem_sam_account_name`
- `onprem_sid`
- `openid2_id`
- `origin_header`
- `password`
- `platf`
- `polids`
- `pop_jwk`
- `preferred_username`
- `previous_refresh_token`
- `primary_sid`
- `prov_data`
- `puid`
- `pwd_exp`
- `pwd_url`
- `rdp_bt`
- `redirect_uri`
- `refresh_token`
- `refresh_token_issued_on`
- `refreshtoken`
- `request_nonce`
- `resource`
- `rh`
- `role`
- `roles`
- `rp_id`
- `rt_type`
- `scope`
- `scp`
- `secaud`
- `sid`
- `sid`
- `signature`
- `signin_state`
- `source_anchor`
- `src1`
- `src2`
- `sub`
- `target_deviceid`
- `tbid`
- `tbidv2`
- `tenant_ctry`
- `tenant_display_name`
- `tenant_id`
- `tenant_region_scope`
- `tenant_region_sub_scope`
- `thumbnail_photo`
- `tid`
- `tokenAutologonEnabled`
- `trustedfordelegation`
- `ttr`
- `unique_name`
- `upn`
- `user_agent`
- `user_setting_sync_url`
- `username`
- `uti`
- `ver`
- `verified_primary_email`
- `verified_secondary_email`
- `vnet`
- `vsm_binding_key`
- `wamcompat_client_info`
- `wamcompat_id_token`
- `wamcompat_scopes`
- `wids`
- `win_ver`
- `x5c_ca`
- `xcb2b_rclient`
- `xcb2b_rcloud`
- `xcb2b_rtenant`
- `ztdid`


> [!NOTE]
> Any claim starting with `xms_` is restricted.

### SAML restricted claim set

The following table lists the SAML claims that are in the restricted claim set.

Restricted Claim type (URI):
- `http://schemas.microsoft.com/2012/01/devicecontext/claims/ismanaged`
- `http://schemas.microsoft.com/2014/02/devicecontext/claims/isknown`
- `http://schemas.microsoft.com/2014/03/psso`
- `http://schemas.microsoft.com/2014/09/devicecontext/claims/iscompliant`
- `http://schemas.microsoft.com/claims/authnmethodsreferences`
- `http://schemas.microsoft.com/claims/groups.link`
- `http://schemas.microsoft.com/identity/claims/accesstoken`
- `http://schemas.microsoft.com/identity/claims/acct`
- `http://schemas.microsoft.com/identity/claims/agegroup`
- `http://schemas.microsoft.com/identity/claims/aio`
- `http://schemas.microsoft.com/identity/claims/identityprovider`
- `http://schemas.microsoft.com/identity/claims/objectidentifier`
- `http://schemas.microsoft.com/identity/claims/openid2_id`
- `http://schemas.microsoft.com/identity/claims/puid`
- `http://schemas.microsoft.com/identity/claims/scope`
- `http://schemas.microsoft.com/identity/claims/tenantid`
- `http://schemas.microsoft.com/identity/claims/xms_et`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationinstant`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/confirmationkey`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlyprimarygroupsid`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlyprimarysid`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlywindowsdevicegroup`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/expiration`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/expired`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/groups`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/ispersistent`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/samlissuername`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/wids`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsdeviceclaim`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsdevicegroup`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsfqbnversion`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/windowssubauthority`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsuserclaim`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/denyonlysid`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/privatepersonalidentifier`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/spn`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn`
- `http://schemas.xmlsoap.org/ws/2009/09/identity/claims/actor`


These claims are restricted by default, but aren't restricted if you [set the AcceptMappedClaims property](saml-claims-customization.md) to `true` in your app manifest *or* have a [custom signing key](saml-claims-customization.md):

- `http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/primarygroupsid`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/x500distinguishedname`

These claims are restricted by default, but aren't restricted if you have a [custom signing key](saml-claims-customization.md):

 - `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn`
 - `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`
 
## Claims mapping policy properties

To control the claims that are included and where the data comes from, use the properties of a claims mapping policy. Without a policy, the system issues tokens with the following claims:
- The core claim set.
- The basic claim set.
- Any [optional claims](./optional-claims.md) that the application has chosen to receive.

> [!NOTE]
> Claims in the core claim set are present in every token, regardless of what this property is set to.

| String | Data type | Summary |
| ------ | --------- | ------- |
| **IncludeBasicClaimSet** | Boolean (True or False) | Determines whether the basic claim set is included in tokens affected by this policy. If set to True, all claims in the basic claim set are emitted in tokens affected by the policy. If set to False, claims in the basic claim set aren't in the tokens, unless they're individually added in the claims schema property of the same policy. |
| **ClaimsSchema** | JSON blob with one or more claim schema entries | Defines which claims are present in the tokens affected by the policy, in addition to the basic claim set and the core claim set. For each claim schema entry defined in this property, certain information is required. Specify where the data is coming from (**Value**, **Source/ID pair**, or **Source/ExtensionID pair**), and **Claim Type**, which is emitted as (**JWTClaimType** or **SamlClaimType**).

### Claim schema entry elements

- **Value** - Defines a static value as the data to be emitted in the claim.
- **SAMLNameForm** - Defines the value for the NameFormat attribute for this claim. If present, the allowed values are: 
  - `urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified` 
  - `urn:oasis:names:tc:SAML:2.0:attrname-format:uri`
  - `urn:oasis:names:tc:SAML:2.0:attrname-format:basic` 
- **Source/ID pair** - Defines where the data in the claim is sourced from.
- **Source/ExtensionID pair** - Defines the directory extension attribute where the data in the claim is sourced from. For more information, see [Using directory extension attributes in claims](schema-extensions.md).
- **Claim Type** - The **JwtClaimType** and **SamlClaimType** elements define which claim this claim schema entry refers to.
  - The **JwtClaimType** must contain the name of the claim to be emitted in JWTs.
  - The **SamlClaimType** must contain the URI of the claim to be emitted in SAML tokens.

Set the **Source** element to one of the values in the following table.

| Source value | Data in claim |
| ------------ | ------------- |
| `user` | Property on the User object. |
| `application` | Property on the application (client) service principal. |
| `resource` | Property on the resource service principal. |
| `audience` | Property on the service principal that is the audience of the token (either the client or resource service principal). |
| `company` | Property on the resource tenant's Company object. |
| `transformation` | Claims transformation. When you use this claim, the **TransformationID** element must be included in the claim definition. The **TransformationID** element must match the ID element of the transformation entry in the **ClaimsTransformation** property that defines how the data for the claim is generated. |

The ID element identifies the property on the source that provides the value for the claim. The following table lists the values of the ID element for each value of Source.

| Source | ID | Description |
|--------|----|-------------|
| `user` | `surname` | The family name of the user. |
| `user` | `givenname` | The given name of the user. |
| `user` | `displayname` | The display name of the user. |
| `user` | `objectid` | The object ID of the user. |
| `user` | `mail` | The email address of the user. |
| `user` | `userprincipalname` | The user principal name of the user. |
| `user` | `department` | The department of the user. |
| `user` | `onpremisessamaccountname` | The on-premises SAM account name of the user. |
| `user` | `netbiosname` | The NetBios name of the user. |
| `user` | `dnsdomainname` | The DNS domain name of the user. |
| `user` | `onpremisesecurityidentifier` | The on-premises security identifier of the user. |
| `user` | `companyname` | The organization name of the user. |
| `user` | `streetaddress` | The street address of the user. |
| `user` | `postalcode` | The postal code of the user.|
| `user` | `preferredlanguage` | The preferred language of the user. |
| `user` | `onpremisesuserprincipalname` | The on-premises UPN of the user. When you use an alternate ID, the on-premises attribute `userPrincipalName` is synchronized with the `onPremisesUserPrincipalName` attribute. This attribute is only available when Alternate ID is configured.|
| `user` | `mailnickname` | The mail nickname of the user. |
| `user` | `extensionattribute1` | Extension attribute 1. |
| `user` | `extensionattribute2` | Extension attribute 2. |
| `user` | `extensionattribute3` | Extension attribute 3. |
| `user` | `extensionattribute4` | Extension attribute 4. |
| `user` | `extensionattribute5` | Extension attribute 5. |
| `user` | `extensionattribute6` | Extension attribute 6. |
| `user` | `extensionattribute7` | Extension attribute 7. |
| `user` | `extensionattribute8` | Extension attribute 8. |
| `user` | `extensionattribute9` | Extension attribute 9. |
| `user` | `extensionattribute10` | Extension attribute 10. |
| `user` | `extensionattribute11` | Extension attribute 11. |
| `user` | `extensionattribute12` | Extension attribute 12. |
| `user` | `extensionattribute13` | Extension attribute 13. |
| `user` | `extensionattribute14` | Extension attribute 14. |
| `user` | `extensionattribute15` | Extension attribute 15. |
| `user` | `othermail` | The other mail of the user.|
| `user` | `country` | The country/region of the user. |
| `user` | `city` | The city of the user. |
| `user` | `state` | The state of the user. |
| `user` | `jobtitle` | The job title of the user. |
| `user` | `employeeid` | The employee ID of the user. |
| `user` | `facsimiletelephonenumber` | The facsimile telephone number of the user. |
| `user` | `assignedroles` | The list of app roles assigned to the user. |
| `user` | `accountEnabled` | Indicates whether the user account is enabled. |
| `user` | `consentprovidedforminor` | Indicates whether consent was provided for a minor. |
| `user` | `createddatetime` | The date and time that the user account was created. | 
| `user` | `creationtype` | Indicates how the user account was creation. |
| `user` | `lastpasswordchangedatetime` | The last date and time that the password was changed. |
| `user` | `mobilephone` | The mobile phone of the user. |
| `user` | `officelocation` | The office location of the user. |
| `user` | `onpremisesdomainname` | The on-premises domain name of the user. |
| `user` | `onpremisesimmutableid` | The on-premises immutable ID of the user. |
| `user` | `onpremisessyncenabled` | Indicates whether on-premises sync is enabled. |
| `user` | `preferreddatalocation` | Defines the preferred data location of the user. |
| `user` | `proxyaddresses` | The proxy addresses of the user. |
| `user` | `usertype` | The type of user account. |
| `user` | `telephonenumber` | The business or office phones of the user. |
| `application`, `resource`, `audience` | `displayname` | The display name of the object. |
| `application`, `resource`, `audience` | `objectid` | The ID of the object. |
| `application`, `resource`, `audience` | `tags` | The service principal tag of the object. |
| `company` | `tenantcountry` | The country/region of the tenant. |

The only available multi-valued claim sources on a user object are multi-valued extension attributes that have been synced from Active Directory Connect. Other properties, such as `othermails` and `tags`, are multi-valued but only one value is emitted when selected as a source.

Names and URIs of claims in the restricted claim set can't be used for the claim type elements.

### Group Filter

- **String** - GroupFilter
- **Data type:** - JSON blob
- **Summary** - Use this property to apply a filter on the user’s groups to be included in the group claim. This property can be a useful means of reducing the token size.
- **MatchOn:** - Identifies the group attribute on which to apply the filter. Set the **MatchOn** property to one of the following values:
  - `displayname` - The group display name.
  - `samaccountname` - The on-premises SAM account name.
- **Type** - Defines the type of filter applied to the attribute selected by the **MatchOn** property. Set the **Type** property to one of the following values:
  - `prefix` - Include groups where the **MatchOn** property starts with the provided **Value** property.
  - `suffix` Include groups where the **MatchOn** property ends with the provided **Value** property.
  - `contains` - Include groups where the **MatchOn** property contains with the provided **Value** property.

### Claims transformation

- **String** - ClaimsTransformation
- **Data type** - JSON blob, with one or more transformation entries
- **Summary** - Use this property to apply common transformations to source data to generate the output data for claims specified in the Claims Schema.
- **ID** - References the transformation entry in the TransformationID Claims Schema entry. This value must be unique for each transformation entry within this policy.
- **TransformationMethod** - Identifies the operation that's performed to generate the data for the claim.

Based on the method chosen, a set of inputs and outputs is expected. Define the inputs and outputs by using the **InputClaims**, **InputParameters** and **OutputClaims** elements.

| TransformationMethod | Expected input | Expected output | Description |
|----------------------|----------------|-----------------|-------------|
| **Join** | string1, string2, separator | output claim | Joins input strings by using a separator in between. For example, string1:`foo@bar.com` , string2:`sandbox` , separator:`.` results in output claim:`foo@bar.com.sandbox`. |
| **ExtractMailPrefix** | Email or UPN | extracted string | Extension attributes 1-15 or any other directory extensions, which store a UPN or email address value for the user. For example, `johndoe@contoso.com`. Extracts the local part of an email address. For example, mail:`foo@bar.com` results in output claim:`foo`. If no \@ sign is present, then the original input string is returned. |

- **InputClaims** - Used to pass the data from a claim schema entry to a transformation. It has three attributes: **ClaimTypeReferenceId**, **TransformationClaimType** and **TreatAsMultiValue**.
  - **ClaimTypeReferenceId** - Joined with the ID element of the claim schema entry to find the appropriate input claim.
  - **TransformationClaimType** Gives a unique name to this input. This name must match one of the expected inputs for the transformation method.
  - **TreatAsMultiValue** is a Boolean flag that indicates whether the transform should be applied to all values or just the first. By default, transformations are only applied to the first element in a multi-value claim. Setting this value to true ensures it's applied to all. ProxyAddresses and groups are two examples for input claims that you would likely want to treat as a multi-value claim. 
- **InputParameters** - Passes a constant value to a transformation. It has two attributes: **Value** and **ID**.
  - **Value** is the actual constant value to be passed.
  - **ID** is used to give a unique name to the input. The name must match one of the expected inputs for the transformation method.
- **OutputClaims** - Holds the data generated by a transformation, and ties it to a claim schema entry. It has two attributes: **ClaimTypeReferenceId** and **TransformationClaimType**.
  - **ClaimTypeReferenceId** is joined with the ID of the claim schema entry to find the appropriate output claim.
  - **TransformationClaimType** is used to give a unique name to the output. The name must match one of the expected outputs for the transformation method.

### Exceptions and restrictions

**SAML NameID and UPN** - The attributes from which you source the NameID and UPN values, and the claims transformations that are permitted, are limited.

| Source | ID | Description |
|--------|----|-------------|
| `user` | `mail` | The email address of the user. |
| `user` | `userprincipalname` | The user principal name of the user. |
| `user` | `onpremisessamaccountname` | On-premises Sam Account Name|
| `user` | `employeeid` | The employee ID of the user. |
| `user` | `telephonenumber` | The business or office phones of the user. |
| `user` | `extensionattribute1` | Extension attribute 1. |
| `user` | `extensionattribute2` | Extension attribute 2. |
| `user` | `extensionattribute3` | Extension attribute 3. |
| `user` | `extensionattribute4` | Extension attribute 4. |
| `user` | `extensionattribute5` | Extension attribute 5. |
| `user` | `extensionattribute6` | Extension attribute 6. |
| `user` | `extensionattribute7` | Extension attribute 7. |
| `user` | `extensionattribute8` | Extension attribute 8. |
| `user` | `extensionattribute9` | Extension Attribute 9. |
| `user` | `extensionattribute10` | Extension attribute 10. |
| `user` | `extensionattribute11` | Extension attribute 11. |
| `user` | `extensionattribute12` | Extension attribute 12. |
| `user` | `extensionattribute13` | Extension attribute 13. |
| `user` | `extensionattribute14` | Extension attribute 14. |
| `User` | `extensionattribute15` | Extension attribute 15. |

The transformation methods listed in the following table are allowed for SAML NameID.

| TransformationMethod | Restrictions |
| -------------------- | ------------ |
| ExtractMailPrefix | None |
| Join | The suffix being joined must be a verified domain of the resource tenant. |

### Issuer With Application ID 

- **String** - issuerWithApplicationId  
- **Data type** - Boolean (True or False) 
  - If set to `True`, the application ID is added to the issuer claim in tokens affected by the policy.
  - If set to `False`, the application ID isn't added to the issuer claim in tokens affected by the policy. (default) 
- **Summary** - Enables the application ID to be included in the issuer claim. Ensures that multiple instances of the same application have a unique claim value for each instance. This setting is ignored if a custom signing key isn't configured for the application.

### Audience Override 

- **String** - audienceOverride  
- **Data type** - String  
- **Summary** - Enables you to override the audience claim sent to the application. The value provided must be a valid absolute URI. This setting is ignored if no custom signing key is configured for the application.

## Next steps

- To learn more about extension attributes, see [Directory extension attributes in claims](schema-extensions.md).
