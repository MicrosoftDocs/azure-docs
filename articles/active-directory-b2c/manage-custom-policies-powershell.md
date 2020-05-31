---
title: Manage custom policies with PowerShell
titleSuffix: Azure AD B2C
description: Use the Azure Active Directory (Azure AD) PowerShell cmdlet for programmatic management of your Azure AD B2C custom policies. Create, read, update, and delete custom policies with PowerShell.
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 02/14/2020
ms.author: mimart
ms.subservice: B2C
---

# Manage Azure AD B2C custom policies with Azure PowerShell

Azure PowerShell provides several cmdlets for command line- and script-based custom policy management in your Azure AD B2C tenant. Learn how to use the Azure AD PowerShell module to:

* List the custom policies in an Azure AD B2C tenant
* Download a policy from a tenant
* Update an existing policy by overwriting its content
* Upload a new policy to your Azure AD B2C tenant
* Delete a custom policy from a tenant

## Prerequisites

* [Azure AD B2C tenant](tutorial-create-tenant.md), and credentials for a user in the directory with the [B2C IEF Policy Administrator](../active-directory/users-groups-roles/directory-assign-admin-roles.md#b2c-ief-policy-administrator) role
* [Custom policies](custom-policy-get-started.md) uploaded to your tenant
* [Azure AD PowerShell for Graph **preview module**](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2?view=azureadps-2.0)

## Connect PowerShell session to B2C tenant

To work with custom policies in your Azure AD B2C tenant, you first need to connect your PowerShell session to the tenant by using the [Connect-AzureAD][Connect-AzureAD] command.

Execute the following command, substituting `{b2c-tenant-name}` with the name of your Azure AD B2C tenant. Sign in with an account that's assigned the [B2C IEF Policy Administrator](../active-directory/users-groups-roles/directory-assign-admin-roles.md#b2c-ief-policy-administrator) role in the directory.

```PowerShell
Connect-AzureAD -Tenant "{b2c-tenant-name}.onmicrosoft.com"
```

Example command output showing a successful sign-in:

```Console
PS C:\> Connect-AzureAD -Tenant "contosob2c.onmicrosoft.com"

Account               Environment TenantId                             TenantDomain                 AccountType
-------               ----------- --------                             ------------                 -----------
azureuser@contoso.com AzureCloud  00000000-0000-0000-0000-000000000000 contosob2c.onmicrosoft.com   User
```

## List all custom policies in the tenant

Discovering custom policies allows an Azure AD B2C administrator to review, manage, and add business logic to their operations. Use the [Get-AzureADMSTrustFrameworkPolicy][Get-AzureADMSTrustFrameworkPolicy] command to return a list of the IDs of the custom policies in an Azure AD B2C tenant.

```PowerShell
Get-AzureADMSTrustFrameworkPolicy
```

Example command output:

```Console
PS C:\> Get-AzureADMSTrustFrameworkPolicy

Id
--
B2C_1A_TrustFrameworkBase
B2C_1A_TrustFrameworkExtensions
B2C_1A_signup_signin
B2C_1A_ProfileEdit
B2C_1A_PasswordReset
```

## Download a policy

After reviewing the list of policy IDs, you can target a specific policy with [Get-AzureADMSTrustFrameworkPolicy][Get-AzureADMSTrustFrameworkPolicy] to download its content.

```PowerShell
Get-AzureADMSTrustFrameworkPolicy [-Id <policyId>]
```

In this example, the policy with ID *B2C_1A_signup_signin* is downloaded:

```Console
PS C:\> Get-AzureADMSTrustFrameworkPolicy -Id B2C_1A_signup_signin
<TrustFrameworkPolicy xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06" PolicySchemaVersion="0.3.0.0" TenantId="contosob2c.onmicrosoft.com" PolicyId="B2C_1A_signup_signin" PublicPolicyUri="http://contosob2c.onmicrosoft.com/B2C_1A_signup_signin" TenantObjectId="00000000-0000-0000-0000-000000000000">
  <BasePolicy>
    <TenantId>contosob2c.onmicrosoft.com</TenantId>
    <PolicyId>B2C_1A_TrustFrameworkExtensions</PolicyId>
  </BasePolicy>
  <RelyingParty>
    <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
    <TechnicalProfile Id="PolicyProfile">
      <DisplayName>PolicyProfile</DisplayName>
      <Protocol Name="OpenIdConnect" />
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="displayName" />
        <OutputClaim ClaimTypeReferenceId="givenName" />
        <OutputClaim ClaimTypeReferenceId="surname" />
        <OutputClaim ClaimTypeReferenceId="email" />
        <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub" />
        <OutputClaim ClaimTypeReferenceId="identityProvider" />
        <OutputClaim ClaimTypeReferenceId="tenantId" AlwaysUseDefaultValue="true" DefaultValue="{Policy:TenantObjectId}" />
      </OutputClaims>
      <SubjectNamingInfo ClaimType="sub" />
    </TechnicalProfile>
  </RelyingParty>
</TrustFrameworkPolicy>
```

To edit the policy content locally, pipe the command output to a file with the `-OutputFilePath` argument, and then open the file in your favorite editor.

Example command sending output to a file:

```PowerShell
# Download and send policy output to a file
Get-AzureADMSTrustFrameworkPolicy -Id B2C_1A_signup_signin -OutputFilePath C:\RPPolicy.xml
```

## Update an existing policy

After editing a policy file you've created or downloaded, you can publish the updated policy to Azure AD B2C by using the [Set-AzureADMSTrustFrameworkPolicy][Set-AzureADMSTrustFrameworkPolicy] command.

If you issue the `Set-AzureADMSTrustFrameworkPolicy` command with the ID of a policy that already exists in your Azure AD B2C tenant, the content of that policy is overwritten.

```PowerShell
Set-AzureADMSTrustFrameworkPolicy [-Id <policyId>] -InputFilePath <inputpolicyfilePath> [-OutputFilePath <outputFilePath>]
```

Example command:

```PowerShell
# Update an existing policy from file
Set-AzureADMSTrustFrameworkPolicy -Id B2C_1A_signup_signin -InputFilePath C:\B2C_1A_signup_signin.xml
```

For additional examples, see the [Set-AzureADMSTrustFrameworkPolicy][Set-AzureADMSTrustFrameworkPolicy] command reference.

## Upload a new policy

When you make a change to a custom policy that's running in production, you might want to publish multiple versions of the policy for fallback or A/B testing scenarios. Or, you might want to make a copy of an existing policy, modify it with a few small changes, then upload it as a new policy for use by a different application.

Use the [New-AzureADMSTrustFrameworkPolicy][New-AzureADMSTrustFrameworkPolicy] command to upload a new policy:

```PowerShell
New-AzureADMSTrustFrameworkPolicy -InputFilePath <inputpolicyfilePath> [-OutputFilePath <outputFilePath>]
```

Example command:

```PowerShell
# Add new policy from file
New-AzureADMSTrustFrameworkPolicy -InputFilePath C:\SignUpOrSignInv2.xml
```

## Delete a custom policy

To maintain a clean operations life cycle, we recommend that you periodically remove unused custom policies. For example, you might want to remove old policy versions after performing a migration to a new set of policies and verifying the new policies' functionality. Additionally, if you attempt to publish a set of custom policies and receive an error, it might make sense to remove the policies that were created as part of the failed release.

Use the [Remove-AzureADMSTrustFrameworkPolicy][Remove-AzureADMSTrustFrameworkPolicy] command to delete a policy from your tenant.

```PowerShell
Remove-AzureADMSTrustFrameworkPolicy -Id <policyId>
```

Example command:

```PowerShell
# Delete an existing policy
Remove-AzureADMSTrustFrameworkPolicy -Id B2C_1A_signup_signin
```

## Troubleshoot policy upload

When you try to publish a new custom policy or update an existing policy, improper XML formatting and errors in the policy file inheritance chain can cause validation failures.

For example, here's an attempt at updating a policy with content that contains malformed XML (output is truncated for brevity):

```Console
PS C:\> Set-AzureADMSTrustFrameworkPolicy -Id B2C_1A_signup_signin -InputFilePath C:\B2C_1A_signup_signin.xml
Set-AzureADMSTrustFrameworkPolicy : Error occurred while executing PutTrustFrameworkPolicy
Code: AADB2C
Message: Validation failed: 1 validation error(s) found in policy "B2C_1A_SIGNUP_SIGNIN" of tenant "contosob2c.onmicrosoft.com".Schema validation error found at line
14 col 55 in policy "B2C_1A_SIGNUP_SIGNIN" of tenant "contosob2c.onmicrosoft.com": The element 'OutputClaims' in namespace
'http://schemas.microsoft.com/online/cpim/schemas/2013/06' cannot contain text. List of possible elements expected: 'OutputClaim' in namespace
'http://schemas.microsoft.com/online/cpim/schemas/2013/06'.
...
```

For information about troubleshooting custom policies, see [Troubleshoot Azure AD B2C custom policies and Identity Experience Framework](active-directory-b2c-guide-troubleshooting-custom.md).

## Next steps

For information about using PowerShell to deploy custom policies as part of a continuous integration/continuous delivery (CI/CD) pipeline, see [Deploy custom policies from an Azure DevOps pipeline](deploy-custom-policies-devops.md).

<!-- LINKS - External -->
[Connect-AzureAD]: https://docs.microsoft.com/powershell/module/azuread/get-azureadmstrustframeworkpolicy
[Get-AzureADMSTrustFrameworkPolicy]: https://docs.microsoft.com/powershell/module/azuread/get-azureadmstrustframeworkpolicy
[New-AzureADMSTrustFrameworkPolicy]: https://docs.microsoft.com/powershell/module/azuread/new-azureadmstrustframeworkpolicy
[Remove-AzureADMSTrustFrameworkPolicy]: https://docs.microsoft.com/powershell/module/azuread/remove-azureadmstrustframeworkpolicy
[Set-AzureADMSTrustFrameworkPolicy]: https://docs.microsoft.com/powershell/module/azuread/set-azureadmstrustframeworkpolicy
