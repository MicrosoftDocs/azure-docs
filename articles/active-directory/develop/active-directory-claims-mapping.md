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
ms.topic: how-to
ms.date: 08/25/2020
ms.author: ryanwi
ms.reviewer: paulgarn, hirsin, jeedes, luleon
---

# How to: Customize claims emitted in tokens for a specific app in a tenant (Preview)

> [!NOTE]
> This feature replaces and supersedes the [claims customization](active-directory-saml-claims-customization.md) offered through the portal today. On the same application, if you customize claims using the portal in addition to the Graph/PowerShell method detailed in this document, tokens issued for that application will ignore the configuration in the portal. Configurations made through the methods detailed in this document will not be reflected in the portal.

> [!NOTE]
> This capability currently is in public preview. Be prepared to revert or remove any changes. The feature is available in any Azure Active Directory (Azure AD) subscription during public preview. However, when the feature becomes generally available, some aspects of the feature might require an Azure AD premium subscription. This feature supports configuring claim mapping policies for WS-Fed, SAML, OAuth, and OpenID Connect protocols.

This feature is used by tenant admins to customize the claims emitted in tokens for a specific application in their tenant. You can use claims-mapping policies to:

- Select which claims are included in tokens.
- Create claim types that do not already exist.
- Choose or change the source of data emitted in specific claims.

In this article, we walk through a few common scenarios that can help you grasp how to use the [claims mapping policy type](reference-claims-mapping-policy-type.md).

When creating a claims mapping policy, you can also emit a claim from a directory schema extension attribute in tokens. Use *ExtensionID* for the extension attribute instead of *ID* in the `ClaimsSchema` element.  For more info on extension attributes, see [Using directory schema extension attributes](active-directory-schema-extensions.md).

## Prerequisites

In the following examples, you create, update, link, and delete policies for service principals. Claims mapping policies can only be assigned to service principal objects. If you are new to Azure AD, we recommend that you [learn about how to get an Azure AD tenant](quickstart-create-new-tenant.md) before you proceed with these examples.

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

## Omit the basic claims from tokens

In this example, you create a policy that removes the [basic claim set](reference-claims-mapping-policy-type.md#claim-sets) from tokens issued to linked service principals.

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

## Include the EmployeeID and TenantCountry as claims in tokens

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

## Use a claims transformation in tokens

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

## Security considerations

Applications that receive tokens rely on the fact that the claim values are authoritatively issued by Azure AD and cannot be tampered with. However, when you modify the token contents via claims mapping policies, these assumptions may no longer be correct. Applications must explicitly acknowledge that tokens have been modified by the creator of the claims mapping policy to protect themselves from claims mapping policies created by malicious actors. This can be done in the following ways:

- Configure a custom signing key
- Update the application manifest to accept mapped claims.
 
Without this, Azure AD will return an [`AADSTS50146` error code](reference-aadsts-error-codes.md#aadsts-error-codes).

### Custom signing key

In order to add a custom signing key to the service principal object, you can use the Azure PowerShell cmdlet [`New-AzureADApplicationKeyCredential`](/powerShell/module/Azuread/New-AzureADApplicationKeyCredential) to create a certificate key credential for your Application object.

Apps that have claims mapping enabled must validate their token signing keys by appending `appid={client_id}` to their [OpenID Connect metadata requests](v2-protocols-oidc.md#fetch-the-openid-connect-metadata-document). Below is the format of the OpenID Connect metadata document you should use:

```
https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration?appid={client-id}
```

### Update the application manifest

Alternatively, you can set the `acceptMappedClaims` property to `true` in the [application manifest](reference-app-manifest.md). As documented on the [apiApplication resource type](/graph/api/resources/apiapplication#properties), this allows an application to use claims mapping without specifying a custom signing key.

This does require the requested token audience to use a verified domain name of your Azure AD tenant, which means you should ensure to set the `Application ID URI` (represented by the `identifierUris` in the application manifest) for example to `https://contoso.com/my-api` or (simply using the default tenant name) `https://contoso.onmicrosoft.com/my-api`.

If you're not using a verified domain, Azure AD will return an `AADSTS501461` error code with message *"AcceptMappedClaims is only supported for a token audience matching the application GUID or an audience within the tenant's verified domains. Either change the resource identifier, or use an application-specific signing key."*

## Next steps

- Read the [claims mapping policy type](reference-claims-mapping-policy-type.md) reference article to learn more.
- To learn how to customize claims issued in the SAML token through the Azure portal, see [How to: Customize claims issued in the SAML token for enterprise applications](active-directory-saml-claims-customization.md)
- To learn more about extension attributes, see [Using directory schema extension attributes in claims](active-directory-schema-extensions.md).
