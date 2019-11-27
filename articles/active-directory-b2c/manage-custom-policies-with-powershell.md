---
title: Manage custom policies with PowerShell
titleSuffix: Azure AD B2C
description: "Use the Azure Active Directory (Azure AD) PowerShell cmdlet for programmatic management of your Azure AD B2C custom policies: create, read, update, and delete custom policies with PowerShell."
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 11/25/2019
ms.author: marsma
ms.subservice: B2C
---

# Manage Azure AD B2C custom policies with Azure PowerShell

Whether you're doing one-off custom policy management in your Azure AD B2C tenant or adding it your continuous integration/continuous delivery (CI/CD) pipeline, PowerShell is a powerful tool you can use for performing and automating management tasks.

In this article, you learn how to use the Azure AD PowerShell module to:

* List the custom policies in an Azure AD B2C tenant
* Download a policy from a tenant
* Update an existing policy by overwriting its content
* Upload a new policy to your Azure AD B2C tenant
* Delete a custom policy from Azure AD B2C

## Prerequisites

* [Azure AD B2C tenant](tutorial-create-tenant.md), and credentials for a user in the directory with the *Global Admin* role
* [Azure AD PowerShell for Graph **preview module**](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2?view=azureadps-2.0)
* [PowerShell session connected to Azure AD](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2?view=azureadps-2.0#connect-to-azure-ad)

## List all custom policies in the tenant

Discovering custom policies allows an Azure AD B2C administrator to review, manage, and add business logic to their operations. Use the [Get-AzureADMSTrustFrameworkPolicy][Get-AzureADMSTrustFrameworkPolicy] command to return a list of the IDs of the custom policies in an Azure AD B2C tenant.

```PowerShell
Get-AzureADMSTrustFrameworkPolicy
```

Example command output:

```Console
PS C:\> Get-AzureADMSTrustFrameworkPolicy
Id
 —
B2C_1A_TrustFrameworkBase
B2C_1A_TrustFrameworkExtensions
B2C_1A_TrustFrameworkBase1
B2C_1A_B2C_1_pwdreset2
B2C_1A_signup_signin1
B2C_1A_signup_signinleaf
B2C_1A_signup_signin
B2C_1A_signup_signin3
B2C_1A_ResourceOwnerv2
B2C_1A_signup_signin2
```

## Download a policy

After reviewing the list of policy IDs, you can target a specific policy with [Get-AzureADMSTrustFrameworkPolicy][Get-AzureADMSTrustFrameworkPolicy] to download its content.

```PowerShell
Get-AzureADMSTrustFrameworkPolicy [-Id <policyId>]
```

In this example, the policy with ID **B2C_1A_signup_signin** is downloaded:

```Console
PS C:\> Get-AzureADMSTrustFrameworkPolicy -Id B2C_1A_signup_signin
<TrustFrameworkPolicy xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06" PolicySchemaVersion="0.3.0.0" TenantId="contoso.onmicrosoft.com" PolicyId="B2C_1A_signup_signin" DeploymentMode="Development" UserJourneyRecorderEndpoint="urn:journeyrecorder:applicationinsights" PublicPolicyUri="http://contoso.onmicrosoft.com/B2C_1A_signup_signin" TenantObjectId="00000000-0000-0000-0000-000000000000">
  <BasePolicy>
    <TenantId>contoso.onmicrosoft.com</TenantId>
    <PolicyId>B2C_1A_TrustFrameworkExtensions</PolicyId>
  </BasePolicy>
  <RelyingParty>
    <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
    <UserJourneyBehaviors>
      <JourneyInsights TelemetryEngine="ApplicationInsights" InstrumentationKey="11111111-1111-1111-1111-111111111111" DeveloperMode="true" ClientEnabled="false" ServerEnabled="true" TelemetryVersion="1.0.0" />
    </UserJourneyBehaviors>
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
        <OutputClaim ClaimTypeReferenceId="loyaltyNumber" />
        <OutputClaim ClaimTypeReferenceId="secretattributekey">
        </OutputClaim>
      </OutputClaims>
      <SubjectNamingInfo ClaimType="sub" />
    </TechnicalProfile>
  </RelyingParty>
</TrustFrameworkPolicy>
```

To edit the policy content locally, pipe the command output to a file with the `-OutputFilePath` argument:

```Console
PS C:\> Get-AzureADMSTrustFrameworkPolicy -Id B2C_1A_signup_signin -OutputFilePath C:\RPPolicy.xml
```

## Update an existing policy

After completing your changes, you can publish the updated policy to Azure AD B2C by using the [Set-AzureADMSTrustFrameworkPolicy][Set-AzureADMSTrustFrameworkPolicy] command.

When you issue the `Set-AzureADMSTrustFrameworkPolicy` command with the ID of a policy that already exists in your Azure AD B2C tenant, the contents of that policy is overwritten.

```PowerShell
Set-AzureADMSTrustFrameworkPolicy [-Id <policyId>] -InputFilePath <inputpolicyfilePath> [-OutputFilePath <outputFilePath>]
```

Example command:

```Console
PS C:\> Set-AzureADMSTrustFrameworkPolicy -Id B2C_1A_signup_signin -InputFilePath C:\B2C_1A_signup_signin.xml
```

For additional examples, see the [Set-AzureADMSTrustFrameworkPolicy][Set-AzureADMSTrustFrameworkPolicy] command reference.

## Upload a new policy

When you make a change to a custom policy that's running in production, you might want to publish multiple versions of the policy for fallback or A/B testing scenarios. Or, you might want to make a copy of an existing policy, modify it with a few small changes, then upload it as a new policy for use by a different application.

Use the [New-AzureADMSTrustFrameworkPolicy][New-AzureADMSTrustFrameworkPolicy] command to upload a new policy:

```PowerShell
New-AzureADMSTrustFrameworkPolicy -InputFilePath <inputpolicyfilePath> [-OutputFilePath <outputFilePath>]
```

Example command:

```Console
PS C:\> New-AzureADMSTrustFrameworkPolicy -InputFilePath C:\SignUpOrSignInv2.xml
```

## Delete a custom policy

To maintain a clean operations life cycle, we recommend that you periodically remove unused custom policies. For example, you might want to remove old policy versions after performing a migration to a new set of policies and verifying the new policies' functionality. Additionally, if you attempt to publish a set of custom policies and receive an error, it might make sense to remove the policies that were created as part of the failed release.

Use the [Remove-AzureADMSTrustFrameworkPolicy][Remove-AzureADMSTrustFrameworkPolicy] command to delete a policy from your tenant:

```PowerShell
Remove-AzureADMSTrustFrameworkPolicy -Id <policyId>
```

Example command:

```Console
PS C:\> Remove-AzureADMSTrustFrameworkPolicy -Id B2C_1A_signup_signin
```

## Troubleshoot policy upload

When you try to publish a new custom policy or update an existing policy, improper XML formatting and errors in the policy file inheritance chain can cause validation failures.

For troubleshooting information, see [Troubleshoot Azure AD B2C custom policies and Identity Experience Framework](active-directory-b2c-guide-troubleshooting-custom.md).

## Next steps

PowerShell support for Azure AD B2C means that you can execute scripts in Azure DevOps pipelines. For information about managing your custom policies in a CI/CD pipeline, see [Deploy custom policies from an Azure DevOps pipeline](deploy-custom-policies-with-devops.md).

<!-- LINKS - External -->
[Get-AzureADMSTrustFrameworkPolicy]: https://docs.microsoft.com/powershell/module/azuread/get-azureadmstrustframeworkpolicy
[Set-AzureADMSTrustFrameworkPolicy]: https://docs.microsoft.com/powershell/module/azuread/set-azureadmstrustframeworkpolicy
[New-AzureADMSTrustFrameworkPolicy]: https://docs.microsoft.com/powershell/module/azuread/new-azureadmstrustframeworkpolicy
[Remove-AzureADMSTrustFrameworkPolicy]: https://docs.microsoft.com/powershell/module/azuread/remove-azureadmstrustframeworkpolicy
