---
title: Manage custom policies with Microsoft Graph PowerShell
titleSuffix: Azure AD B2C
description: Use the Microsoft Graph PowerShell cmdlets for programmatic management of your Azure AD B2C custom policies. Create, read, update, and delete custom policies with PowerShell.
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.custom: has-azure-ad-ps-ref, azure-ad-ref-level-one-done
ms.topic: how-to
ms.date: 01/11/2024
ms.author: kengaderdus
ms.subservice: B2C
#Customer intent: As an Azure AD B2C administrator, I want to manage custom policies using Microsoft Graph PowerShell, so that I can review, update, and delete policies in my Azure AD B2C tenant.
---

# Manage Azure AD B2C custom policies with Microsoft Graph PowerShell

Microsoft Graph PowerShell provides several cmdlets for command line- and script-based custom policy management in your Azure AD B2C tenant. Learn how to use the Azure AD PowerShell module to:

* List the custom policies in an Azure AD B2C tenant
* Download a policy from a tenant
* Update an existing policy by overwriting its content
* Upload a new policy to your Azure AD B2C tenant
* Delete a custom policy from a tenant

## Prerequisites

* [Azure AD B2C tenant](tutorial-create-tenant.md), and credentials for a user in the directory with the [B2C IEF Policy Administrator](../active-directory/roles/permissions-reference.md#b2c-ief-policy-administrator) role
* [Custom policies](tutorial-create-user-flows.md?pivots=b2c-custom-policy) uploaded to your tenant
* [Microsoft Graph PowerShell SDK beta module](/powershell/microsoftgraph/installation#installation)

## Connect PowerShell session to B2C tenant

To work with custom policies in your Azure AD B2C tenant, you first need to connect your PowerShell session to the tenant by using the [Connect-MgGraph][Connect-MgGraph] command.

Execute the following command. Sign in with an account that's assigned the [B2C IEF Policy Administrator](/entra/identity/role-based-access-control/permissions-reference#b2c-ief-policy-administrator) role in the directory.

```PowerShell
Connect-MgGraph -TenantId "{b2c-tenant-name}.onmicrosoft.com" -Scopes "Policy.ReadWrite.TrustFramework"
```

Example command output showing a successful sign-in:

```output
Welcome to Microsoft Graph!

Connected via delegated access using 64636d5d-8eb5-42c9-b9eb-f53754c5571f
Readme: https://aka.ms/graph/sdk/powershell
SDK Docs: https://aka.ms/graph/sdk/powershell/docs
API Docs: https://aka.ms/graph/docs

NOTE: You can use the -NoWelcome parameter to suppress this message.
```

## List all custom policies in the tenant

Discovering custom policies allows an Azure AD B2C administrator to review, manage, and add business logic to their operations. Use the [Get-MgBetaTrustFrameworkPolicy][Get-MgBetaTrustFrameworkPolicy] command to return a list of the IDs of the custom policies in an Azure AD B2C tenant.

```PowerShell
Get-MgBetaTrustFrameworkPolicy
```

Example command output:

```output
Id
--
B2C_1A_TrustFrameworkBase
B2C_1A_TrustFrameworkExtensions
B2C_1A_signup_signin
B2C_1A_ProfileEdit
B2C_1A_PasswordReset
```

## Download a policy

After reviewing the list of policy IDs, you can target a specific policy with [Get-MgBetaTrustFrameworkPolicy][Get-MgBetaTrustFrameworkPolicy] to download its content.

```PowerShell
Get-MgBetaTrustFrameworkPolicy [-TrustFrameworkPolicyId <policyId>]
```

In this example, the policy with ID *B2C_1A_signup_signin* is downloaded:

```output
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

To edit the policy content locally, pipe the command output to a file, and then open the file in your favorite editor.

## Update an existing policy

After editing a policy file you've created or downloaded, you can publish the updated policy to Azure AD B2C by using the [Update-MgBetaTrustFrameworkPolicy][Update-MgBetaTrustFrameworkPolicy] command.

If you issue the `Update-MgBetaTrustFrameworkPolicy` command with the ID of a policy that already exists in your Azure AD B2C tenant, the content of that policy is overwritten.

```PowerShell
Update-MgBetaTrustFrameworkPolicy -TrustFrameworkPolicyId <policyId> -BodyParameter @{trustFrameworkPolicy = "<policy file path>"}
```

Example command:

```PowerShell
# Update an existing policy from file
Update-MgBetaTrustFrameworkPolicy -TrustFrameworkPolicyId B2C_1A_signup_signin -BodyParameter @{trustFrameworkPolicy = C:\B2C_1A_signup_signin.xml}
```

## Upload a new policy

When you make a change to a custom policy that's running in production, you might want to publish multiple versions of the policy for fallback or A/B testing scenarios. Or, you might want to make a copy of an existing policy, modify it with a few small changes, then upload it as a new policy for use by a different application.

Use the [New-MgBetaTrustFrameworkPolicy][New-MgBetaTrustFrameworkPolicy] command to upload a new policy:

```PowerShell
New-MgBetaTrustFrameworkPolicy -BodyParameter @{trustFrameworkPolicy = "<policy file path>"}
```

Example command:

```PowerShell
# Add new policy from file
New-MgBetaTrustFrameworkPolicy -BodyParameter @{trustFrameworkPolicy = C:\B2C_1A_signup_signin.xml }
```

## Delete a custom policy

To maintain a clean operations life cycle, we recommend that you periodically remove unused custom policies. For example, you might want to remove old policy versions after performing a migration to a new set of policies and verifying the new policies' functionality. Additionally, if you attempt to publish a set of custom policies and receive an error, it might make sense to remove the policies that were created as part of the failed release.

Use the [Remove-MgBetaTrustFrameworkPolicy][Remove-MgBetaTrustFrameworkPolicy] command to delete a policy from your tenant.

```PowerShell
Remove-MgBetaTrustFrameworkPolicy -TrustFrameworkPolicyId <policyId>
```

Example command:

```PowerShell
# Delete an existing policy
Remove-MgBetaTrustFrameworkPolicy -TrustFrameworkPolicyId B2C_1A_signup_signin
```

## Troubleshoot policy upload

When you try to publish a new custom policy or update an existing policy, improper XML formatting and errors in the policy file inheritance chain can cause validation failures.

For information about troubleshooting custom policies, see [Troubleshoot Azure AD B2C custom policies and Identity Experience Framework](./troubleshoot.md).

## Next steps

For information about using PowerShell to deploy custom policies as part of a continuous integration/continuous delivery (CI/CD) pipeline, see [Deploy custom policies from an Azure DevOps pipeline](deploy-custom-policies-devops.md).

<!-- LINKS - External -->
[Connect-MgGraph]: /powershell/microsoftgraph/authentication-commands#using-connect-mggraph
[Get-MgBetaTrustFrameworkPolicy]: /powershell/module/microsoft.graph.beta.identity.signins/get-mgbetatrustframeworkpolicy?view
[New-MgBetaTrustFrameworkPolicy]: /powershell/module/microsoft.graph.beta.identity.signins/new-mgbetatrustframeworkpolicy
[Remove-MgBetaTrustFrameworkPolicy]: /powershell/module/microsoft.graph.beta.identity.signins/remove-mgbetatrustframeworkpolicy
[Update-MgBetaTrustFrameworkPolicy]: /powershell/module/microsoft.graph.beta.identity.signins/update-mgbetatrustframeworkpolicy
