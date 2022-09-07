---
title: Prevent sign-in auto-acceleration using Home Realm Discovery policy
description: Learn how to prevent domain_hint auto-acceleration to federated IDPs.
services: active-directory
author: nickludwig
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 02/09/2022
ms.author: ludwignick
zone_pivot_groups: home-realm-discovery

#customer intent: As an admin, I want to disable auto-acceleration to federated IDP during sign in using Home Realm Discovery policy
---
# Disable auto-acceleration sign-in

Home Realm Discovery Policy (HRD) offers administrators multiple ways to control how and where their users authenticate. The `domainHintPolicy` section of the HRD policy is used to help migrate federated users to cloud managed credentials like [FIDO](../authentication/howto-authentication-passwordless-security-key.md), by ensuring that they always visit the Azure AD sign-in page and aren't auto-accelerated to a federated IDP because of domain hints. To learn more about HRD policy, see [Home Realm Discovery](home-realm-discovery-policy.md).


This policy is needed in situations where and admins can't control or update domain hints during sign-in.  For example, `outlook.com/contoso.com` sends the user to a login page with the `&domain_hint=contoso.com` parameter appended, to auto-accelerate the user directly to the federated IDP for the `contoso.com` domain. Users with managed credentials sent to a federated IDP can't sign in using their managed credentials, reducing security, and frustrating users with randomized sign-in experiences. Admins rolling out managed credentials [should also set up this policy](#suggested-use-within-a-tenant) to ensure that users can always use their managed credentials.


## DomainHintPolicy details

The DomainHintPolicy section of the HRD policy is a JSON object, that allows an admin to opt out certain domains and applications from domain hint usage.  Functionally, this tells the Azure AD sign-in page to behave as if a `domain_hint` parameter on the login request wasn't present.

### The Respect and Ignore policy sections

|Section | Meaning | Values |
|--------|---------|--------|
|`IgnoreDomainHintForDomains` |If this domain hint is sent in the request, ignore it. |Array of domain addresses (for example `contoso.com`). Also supports `all_domains`|
|`RespectDomainHintForDomains`| If this domain hint is sent in the request, respect it even if `IgnoreDomainHintForApps` indicates that the app in the request shouldn't auto-accelerate. This is used to slow the rollout of deprecating domain hints within your network – you can indicate that some domains should still be accelerated. | Array of domain addresses (for example `contoso.com`). Also supports `all_domains`|
|`IgnoreDomainHintForApps`| If a request from this application comes with a domain hint, ignore it. | Array of application IDs (GUIDs). Also supports `all_apps`|
|`RespectDomainHintForApps` |If a request from this application comes with a domain hint, respect it even if `IgnoreDomainHintForDomains` includes that domain. Used to ensure some apps keep working if you discover they break without domain hints. | Array of application IDs (GUIDs). Also supports `all_apps`|

### Policy evaluation

The DomainHintPolicy logic runs on each incoming request that contains a domain hint and accelerates based on two pieces of data in the request – the domain in the domain hint, and the client ID (the app). In short - "Respect" for a domain or app takes precedence over an instruction to "Ignore" a domain hint for a given domain or application.

- In the absence of any domain hint policy, or if none of the 4 sections reference the app or domain hint mentioned, [the rest of the HRD policy will be evaluated](home-realm-discovery-policy.md#priority-and-evaluation-of-hrd-policies).
- If either one (or both) of `RespectDomainHintForApps` or `RespectDomainHintForDomains` section includes the app or domain hint in the request, then the user will be auto-accelerated to the federated IDP as requested.
- If either one (or both) of `IgnoreDomainHintsForApps` or `IgnoreDomainHintsForDomains` references the app or the domain hint in the request, and they’re not referenced by the “Respect” sections, then the request won't be auto-accelerated, and the user will remain at the Azure AD login page to provide a username.

Once a user has entered a username at the login page, they can use their managed credentials.  If they choose not to use a managed credential, or they have none registered, they'll be taken to their federated IDP for credential entry as usual.

## Prerequisites

To disable auto-acceleration sign-in for an application in Azure AD, you need:

- An Azure account with an active subscription. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
::: zone pivot="powershell-hrd"
- The latest Azure AD PowerShell cmdlet preview.
::: zone-end

## Suggested use within a tenant

Admins of federated domains should set up this section of the HRD policy in a four-phase plan. The goal of this plan is to eventually get all users in a tenant to use their managed credentials regardless of domain or application, save those apps that have hard dependencies on `domain_hint` usage.  This plan helps admins find those apps, exempt them from the new policy, and continue rolling out the change to the rest of the tenant.

1. Pick a domain to initially roll this change out to.  This will be your test domain, so pick one that may be more receptive to changes in UX (For example, seeing a different login page).  This will ignore all domain hints from all applications that use this domain name. Set this policy in your tenant-default HRD policy:

::: zone pivot="graph-hrd"

```json
"DomainHintPolicy": { 
    "IgnoreDomainHintForDomains": [ "testDomain.com" ], 
    "RespectDomainHintForDomains": [], 
    "IgnoreDomainHintForApps": [], 
    "RespectDomainHintForApps": [] 
} 
```
::: zone-end

::: zone pivot="powershell-hrd"

```powershell 
New-AzureADPolicy -Definition @("{`"DomainHintPolicy`": { `"IgnoreDomainHintForDomains`": [ `"testDomain.com`" ], `"RespectDomainHintForDomains`": [], `"IgnoreDomainHintForApps`": [], `"RespectDomainHintForApps`": [] } }") -DisplayName BasicBlockAccelerationPolicy -Type HomeRealmDiscoveryPolicy
```
::: zone-end

2. Gather feedback from the test domain users. Collect details for applications that broke as a result of this change - they have a dependency on domain hint usage, and should be updated. For now, add them to the `RespectDomainHintForApps` section:

::: zone pivot="graph-hrd"

```json
"DomainHintPolicy": { 
    "IgnoreDomainHintForDomains": [ "testDomain.com" ], 
    "RespectDomainHintForDomains": [], 
    "IgnoreDomainHintForApps": [], 
    "RespectDomainHintForApps": ["app1-clientID-Guid", "app2-clientID-Guid] 
} 
```
::: zone-end

::: zone pivot="powershell-hrd"

```powershell
New-AzureADPolicy -Definition @("{`"DomainHintPolicy`": { `"IgnoreDomainHintForDomains`": [ `"testDomain.com`" ], `"RespectDomainHintForDomains`": [], `"IgnoreDomainHintForApps`": [], `"RespectDomainHintForApps`": ["app1-clientID-Guid", "app2-clientID-Guid] } }") -DisplayName BasicBlockAccelerationPolicy -Type HomeRealmDiscoveryPolicy
```
::: zone-end

3. Continue expanding rollout of the policy to new domains, collecting more feedback.

::: zone pivot="graph-hrd"

```json
"DomainHintPolicy": { 
    "IgnoreDomainHintForDomains": [ "testDomain.com", "otherDomain.com", "anotherDomain.com"], 
    "RespectDomainHintForDomains": [], 
    "IgnoreDomainHintForApps": [], 
    "RespectDomainHintForApps": ["app1-clientID-Guid", "app2-clientID-Guid] 
} 
```
::: zone-end

::: zone pivot="powershell-hrd"

```powershell
New-AzureADPolicy -Definition @("{`"DomainHintPolicy`": { `"IgnoreDomainHintForDomains`": [ `"testDomain.com`", "otherDomain.com", "anotherDomain.com"], `"RespectDomainHintForDomains`": [], `"IgnoreDomainHintForApps`": [], `"RespectDomainHintForApps`": ["app1-clientID-Guid", "app2-clientID-Guid] } }") -DisplayName BasicBlockAccelerationPolicy -Type HomeRealmDiscoveryPolicy
```

::: zone-end

4. Complete your rollout - target all domains, exempting those that should continue to be accelerated:

::: zone pivot="graph-hrd"

```json
"DomainHintPolicy": { 
    "IgnoreDomainHintForDomains": [ "*" ], 
    "RespectDomainHintForDomains": ["guestHandlingDomain.com"], 
    "IgnoreDomainHintForApps": [], 
    "RespectDomainHintForApps": ["app1-clientID-Guid", "app2-clientID-Guid] 
} 
```
::: zone-end


::: zone pivot="powershell-hrd"

```powershell
New-AzureADPolicy -Definition @("{`"DomainHintPolicy`": { `"IgnoreDomainHintForDomains`": [ `"*`" ], `"RespectDomainHintForDomains`": [guestHandlingDomain.com], `"IgnoreDomainHintForApps`": [], `"RespectDomainHintForApps`": ["app1-clientID-Guid", "app2-clientID-Guid] } }") -DisplayName BasicBlockAccelerationPolicy -Type HomeRealmDiscoveryPolicy
```

::: zone-end

After step 4 is complete all users, except those in `guestHandlingDomain.com`, can sign-in at the Azure AD sign-in page even when domain hints would otherwise cause an auto-acceleration to a federated IDP.  The exception to this is if the app requesting sign-in is one of the exempted ones - for those apps, all domain hints will still be accepted.

::: zone pivot="graph-hrd"

## Configuring policy through Graph Explorer

Set the [Home Realm Discovery policy](/graph/api/resources/homeRealmDiscoveryPolicy) as usual, using Microsoft Graph.  

1. Grant the Policy.ReadWrite.ApplicationConfiguration permission in [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).  
1. Use the URL `https://graph.microsoft.com/v1.0/policies/homeRealmDiscoveryPolicies`
1. POST the new policy to this URL, or PATCH to `/policies/homerealmdiscoveryPolicies/{policyID}` if overwriting an existing one.

POST or PATCH contents:

```json
{
    "displayName":"Home Realm Discovery Domain Hint Exclusion Policy",
    "definition":[
        "{\"HomeRealmDiscoveryPolicy\" : {\"DomainHintPolicy\": { \"IgnoreDomainHintForDomains\": [ \"Contoso.com\" ], \"RespectDomainHintForDomains\": [], \"IgnoreDomainHintForApps\": [\"sample-guid-483c-9dea-7de4b5d0a54a\"], \"RespectDomainHintForApps\": [] } } }"
    ],
    "isOrganizationDefault":true
}
```

Be sure to use slashes to escape the `Definition` JSON section when using Graph.  

`isOrganizationDefault` must be true, but the displayName and definition can change.

::: zone-end

## Next steps

* [Enable passwordless security key sign-in](../authentication/howto-authentication-passwordless-security-key.md)
* [Enable passwordless sign-in with the Microsoft Authenticator app](../authentication/howto-authentication-passwordless-phone.md)
