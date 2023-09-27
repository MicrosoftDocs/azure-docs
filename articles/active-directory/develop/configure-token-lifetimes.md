---
title: Set lifetimes for tokens
description: Learn how to set lifetimes for access tokens issued by Microsoft identity platform. 
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: how-to
ms.date: 06/27/2023
ms.author: ryanwi
ms.custom: identityplatformtop40, contperf-fy21q2, engagement-fy23
ms.reviewer: joroja
---
# Configure token lifetime policies (preview)

In the following steps, you'll implement a common policy scenario that imposes new rules for token lifetime. It's possible to specify the lifetime of an access, SAML, or ID token issued by the Microsoft identity platform. This can be set for all apps in your organization or for a specific app. They can also be set for multi-organizations (multi-tenant application).

For more information, see [configurable token lifetimes](configurable-token-lifetimes.md).

## Get started

To get started, download the latest [Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/installation).

## Create a policy and assign it to an app

In the following steps, you'll create a policy that requires users to authenticate less frequently in your web app. Assign the policy to an app, which sets the lifetime of the access/ID tokens for your web app.

```powershell
Install-Module Microsoft.Graph

Connect-MgGraph -Scopes  "Policy.ReadWrite.ApplicationConfiguration","Policy.Read.All","Application.ReadWrite.All"

# Create a token lifetime policy
$params = @{
	Definition = @('{"TokenLifetimePolicy":{"Version":1,"AccessTokenLifetime":"4:00:00"}}') 
    DisplayName = "WebPolicyScenario"
	IsOrganizationDefault = $false
}
$tokenLifetimePolicyId=(New-MgPolicyTokenLifetimePolicy -BodyParameter $params).Id

# Display the policy
Get-MgPolicyTokenLifetimePolicy -TokenLifetimePolicyId $tokenLifetimePolicyId

# Assign the token lifetime policy to an app
$params = @{
	"@odata.id" = "https://graph.microsoft.com/v1.0/policies/tokenLifetimePolicies/$tokenLifetimePolicyId"
}

$applicationObjectId="11111111-1111-1111-1111-111111111111"

New-MgApplicationTokenLifetimePolicyByRef -ApplicationId $applicationObjectId -BodyParameter $params

# List the token lifetime policy on the app
Get-MgApplicationTokenLifetimePolicy -ApplicationId $applicationObjectId

# Remove the policy from the app
Remove-MgApplicationTokenLifetimePolicyByRef -ApplicationId $applicationObjectId -TokenLifetimePolicyId $tokenLifetimePolicyId

# Delete the policy
Remove-MgPolicyTokenLifetimePolicy -TokenLifetimePolicyId $tokenLifetimePolicyId
```

## View existing policies in a tenant

To see all policies that have been created in your organization, run the [Get-MgPolicyTokenLifetimePolicy](/powershell/module/microsoft.graph.identity.signins/get-mgpolicytokenlifetimepolicy) cmdlet.  Any results with defined property values that differ from the defaults listed above are in scope of the retirement.

```powershell
Get-MgPolicyTokenLifetimePolicy
```

To see which apps are linked to a specific policy that you identified, run [List appliesTo](/graph/api/tokenlifetimepolicy-list-appliesto) with any of your policy IDs. 

```powershell
GET https://graph.microsoft.com/v1.0/policies/tokenLifetimePolicies/4d2f137b-e8a9-46da-a5c3-cc85b2b840a4/appliesTo
```

## Next steps
Learn about [authentication session management capabilities](../conditional-access/howto-conditional-access-session-lifetime.md) in Microsoft Entra Conditional Access.
