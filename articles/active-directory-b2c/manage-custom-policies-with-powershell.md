---
title: Manage Azure AD B2C custom policies with PowerShell
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

Whether you're doing one-off custom policy management in your Azure AD B2C tenant or adding it your CI/CD pipeline, PowerShell is a powerful tool you can use performing or automating management tasks.

In this article, you learn how to:

* List the custom policies in an Azure AD B2C tenant
* Download a policy from a tenant
* Update an existing policy by overwriting its content
* Upload a new policy to your Azure AD B2C tenant
* Delete a custom policy from Azure AD B2C

## Prerequisites

* [Azure AD B2C tenant](tutorial-create-tenant.md), and credentials for a user in the directory with the *Global Admin* role
* [AzureADPreview](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2?view=azureadps-2.0) PowerShell module

## Getting Started

### Downloading the AzureADPreview module
The Azure Ad Power Shell Preview module provides the functionality to interact with custom policies. This module provides other access to other Azure AD entities as well such as users. The module can be imported as shown below in your PowerShell console. Visit the [Azure Active Directory PowerShell for Graph](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2?view=azureadps-2.0) for additional guidance.

Not sure if you have the right version downloaded? It is easy to check. Start by running:

```PowerShell
PS C:\Users> Get-Module

ModuleType Version    Name                                ExportedCommands
---------- -------    ----                                ----------------
Binary     2.0.2.4    AzureAD                             {Add-AzureADApplicationOwner, Add-AzureADDeviceRegisteredO...
Manifest   3.1.0.0    Microsoft.PowerShell.Management     {Add-Computer, Add-Content, Checkpoint-Computer, Clear-Con...
Manifest   3.1.0.0    Microsoft.PowerShell.Utility        {Add-Member, Add-Type, Clear-Variable, Compare-Object...}
Script     2.0.0      PSReadline                          {Get-PSReadLineKeyHandler, Get-PSReadLineOption, Remove-PS...
```

If you do not have the required module, open a new PowerShell window as administrator to give you the correct permissions to update your PowerShell client.

If your computer has all the prerequisites for the installation, to install the General Availability version of the module on your computer you can run

```PowerShell
Install-module AzureADPreview
```

You cannot install both the preview version and the GA version on the same computer.

### Connect to Azure AD B2C tenant

Before you can run any of the cmdlets discussed in this article, you must first connect to your online service. To do so, run the cmdlet Connect-AzureAD at the Windows PowerShell command prompt. You will then be prompted for your credentials. If you want, you can supply your credentials in advance, for example:

```PowerShell
$AzureAdCred = Get-Credential
Connect-AzureAD -Credential $AzureAdCred
```

The first command prompts for credentials and stores them as $AzureAdCred. The next command uses those credentials as $azureadcred to connect to the service.

To connect to a specific environment of Azure Active Directory, use the AzureEnvironment parameter, as follows:

```PowerShell
Connect-AzureAD -AzureEnvironment "AzureGermanyCloud"
```


## List all custom policies in the tenant
Programatically discovering custom policies allows an Azure AD B2C admin to review, manage and add business logic for your operations. Using the below PS commands will return a list custom policies policyId's configured in Azure AD B2C.


```PowerShell
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


## Download a specific policy in Azure AD B2C
After reviewing the list of PolicyId's, you can target a specific policy and download the content. In this example, we will target policyId **B2C_1A_signup_signin**.

`Get-AzureADMSTrustFrameworkPolicy [-Id <policyId>]  `

```PowerShell
PS C:\> Get-AzureADMSTrustFrameworkPolicy -Id B2C_1A_signup_signin

<TrustFrameworkPolicy xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06" PolicySchemaVersion="0.3.0.0" TenantId="contoso.onmicrosoft.com" PolicyId="B2C_1A_signup_signin" DeploymentMode="Development" UserJourneyRecorderEndpoint="urn:journeyrecorder:applicationinsights" PublicPolicyUri="http://contoso.onmicrosoft.com/B2C_1A_signup_signin" TenantObjectId="00000000-ec1f-43f5-abcd-12345d7b5ced">
  <BasePolicy>
    <TenantId>contoso.onmicrosoft.com</TenantId>
    <PolicyId>B2C_1A_TrustFrameworkExtensions</PolicyId>
  </BasePolicy>
  <RelyingParty>
    <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
    <UserJourneyBehaviors>
      <JourneyInsights TelemetryEngine="ApplicationInsights" InstrumentationKey="abc1232-5a7c-4775-928a-12343457" DeveloperMode="true" ClientEnabled="false" ServerEnabled="true" TelemetryVersion="1.0.0" />
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
In order to edit it locally, you can pipe the output value to a specific file:

```PowerShell
PS C:\> Get-AzureADMSTrustFrameworkPolicy -Id B2C_1A_signup_signin -OutputFilePath C:\RPPolicy.xml
```

## Update an existing policy by overwriting its content
After completing your changes to the policy, you may require to publish these changes back to Azure AD B2C. Follow this command structure:

`Set-AzureADMSTrustFrameworkPolicy [-Id <policyId>] -InputFilePath <inputpolicyfilePath> [-OutputFilePath <outputFilePath>] `
```PowerShell
PS C:\> Set-AzureADMSTrustFrameworkPolicy -Id B2C_1A_signup_signin -InputFilePath C:\B2C_1A_signup_signin.xml
```
> Note: Additonal examples can be viewed in our [reference documentation](https://docs.microsoft.com/powershell/module/azuread/Set-AzureADMSTrustFrameworkPolicy?view=azureadps-2.0-preview#examples).
## Upload a new policy to your Azure AD B2C tenant
Many times when making a change to production it is common to publish multiple versions for fallback instead of overwritting the value in a specific policy. This allows you to perform A/B testing. Alteratively, you can easily copy an existing policy and make small changes to be uploaded to be used for separate applications.

`New-AzureADMSTrustFrameworkPolicy -InputFilePath <inputpolicyfilePath> [-OutputFilePath <outputFilePath>]`
```PowerShell
PS C:\> New-AzureADMSTrustFrameworkPolicy -InputFilePath C:\SignUpOrSignInv2.xml
```

## Deleting a custom policy from Azure AD B2C
To maintain a clean operations lifecycle, it is recommended to remove unused custom policies. It's common to remove older policies as part of custom policy migration. Additionally, if you attempt to publish a series of custom policies and receive an error, it may make sense to remove the policies that were created as part of this release.

`Remove-AzureADMSTrustFrameworkPolicy -Id <policyId>`

```PowerShell
PS C:\> Remove-AzureADMSTrustFrameworkPolicy -Id B2C_1A_signup_signin
```

## Troubleshooting PowerShell commands
When attempting to publish a custom policy to the Azure AD B2C tenant, there are several valid scenarios that can occur errors:
* Improper XML format - this can be resolved with an online XML validator site or extension tools from your preferred XML editor.
* Policy validation errors - this includes the chain of files the upload file refers to (the relying party policy file, the extensions file, and the base file).

> For more information please refer to our walkthrough  [Troubleshoot Azure AD B2C custom policies and Identity Experience Framework](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-guide-troubleshooting-custom) documentation.


## Next steps

