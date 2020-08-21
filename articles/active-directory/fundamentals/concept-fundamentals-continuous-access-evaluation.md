---
title: Continuous access evaluation in Azure AD
description: Responding to changes in user state faster with continuous access evaluation in Azure AD

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 04/21/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: jlu

ms.collection: M365-identity-device-management
---
# Continuous access evaluation

Microsoft services, like Azure Active Directory (Azure AD) and Office 365, use open standards and protocols to maximize interoperability. One of the most critical ones is Open ID Connect (OIDC). When a client application like Outlook connects to a service like Exchange Online, the API requests are authorized using OAuth 2.0 access tokens. By default, those access tokens are valid for one hour. When they expire, the client is redirected back to Azure AD to refresh them. That also provides an opportunity to reevaluate policies for user access – we might choose not to refresh the token because of a Conditional Access policy, or because the user has been disabled in the directory. 

Token expiration and refresh is a standard mechanism in the industry. That said, customers have expressed concerns about the lag between when risk conditions change for the user (for example: moving from the corporate office to the local coffee shop, or user credentials discovered on the black market) and when policies can be enforced related to that change. We have experimented with the “blunt object” approach of reduced token lifetimes but found they can degrade user experiences and reliability without eliminating risks.

Timely response to policy violations or security issues really requires a “conversation” between the token issuer, like Azure AD, and the relying party, like Exchange Online. This two-way conversation gives us two important capabilities. The relying party can notice when things have changed, like a client coming from a new location, and tell the token issuer. It also gives the token issuer a way to tell the relying party to stop respecting tokens for a given user due to account compromise, disablement, or other concerns. The mechanism for this conversation is Continuous Access Evaluation (CAE).

Microsoft has been an early participant in the Continuous Access Evaluation Protocol (CAEP) initiative as part of the [Shared Signals and Events](https://openid.net/wg/sse/) working group at the OpenID Foundation. Identity providers and relying parties will be able to leverage the security events and signals defined by the working group to reauthorize or terminate access. It is exciting work and will improve security across many platforms and applications.

Because the security benefits are so great, we are rolling out a Microsoft-specific initial implementation in parallel to our continued work within the standards bodies. As we work to deploy these continuous access evaluation (CAE) capabilities across Microsoft services, we have learned a lot and are sharing this information with the standards community. We hope our experience in deployment can help inform an even better industry standard and are committed to implementing that standard once ratified, allowing all participating services to benefit.

## How does CAE work in Microsoft services?

We are focusing our initial implementation of continuous access evaluation to Exchange and Teams. We hope to expand support to other Microsoft services in the future. We will start to enable continuous access evaluation only for tenants with no Conditional Access policies. We will use our learnings from this phase of CAE to inform our ongoing rollout of CAE.

## Service side requirements

Continuous access evaluation is implemented by enabling services (resource providers) to subscribe to critical events in Azure AD so that those events can be evaluated and enforced near real time. The following events will be enforced in this initial CAE rollout:

- User Account is deleted or disabled
- Password for a user is changed or reset
- MFA is enabled for the user
- Admin explicitly revokes all refresh tokens for a user
- Elevated user risk detected by Azure AD Identity Protection

In the future we hope to add more events, including events like location and device state changes. **While our goal is for enforcement to be instant, in some cases latency of up to 15 minutes may be observed due to event propagation time**. 

## Client-side claim challenge

Before continuous access evaluation, clients would always try to replay the access token from its cache as long as it was not expired. With CAE, we are introducing a new case that a resource provider can reject a token even when it is not expired. In order to inform clients to bypass their cache even though the cached tokens have not expired, we introduce a mechanism called **claim challenge**. CAE requires a client update to understand claim challenge. The latest version of the following applications below support claim challenge:

- Outlook for Windows 
- Outlook for iOS 
- Outlook for Android 
- Outlook for Mac 
- Teams for Windows
- Teams for iOS 
- Teams for Android 
- Teams for Mac 

## Token Lifetime

Because risk and policy are evaluated in real time, clients that negotiate continuous access evaluation aware sessions will rely on CAE instead of existing static access token lifetime policies, which means that configurable token lifetime policy will not be honored anymore for CAE-capable clients that negotiate CAE-aware sessions.

We will increase access token lifetime to 24 hours in CAE sessions. Revocation is driven by critical events and policy evaluation, not an arbitrary time period. This change increases the stability of your applications without affecting your security posture. 

## Example flows

### User revocation event flow:

![User revocation event flow](./media/concept-fundamentals-continuous-access-evaluation/user-revocation-event-flow.png)

1. A CAE-capable client presents credentials or a refresh token to AAD asking for an access token for some resource.
1. An access token is returned along with other artifacts to the client.
1. An Administrator explicitly [revokes all refresh tokens for the user](https://docs.microsoft.com/powershell/module/azuread/revoke-azureaduserallrefreshtoken?view=azureadps-2.0). A revocation event will be sent to the resource provider from Azure AD.
1. An access token is presented to the resource provider. The resource provider evaluates the validity of the token and checks whether there is any revocation event for the user. The resource provider uses this information to decide to grant access to the resource or not.
1. In this case, the resource provider denies access, and sends a 401+ claim challenge back to the client
1. The CAE-capable client understands the 401+ claim challenge. It bypasses the caches and goes back to step 1, sending its refresh token along with the claim challenge back to Azure AD. Azure AD will then reevaluate all the conditions and prompt the user to reauthenticate in this case.

## FAQs

### What is the lifetime of my Access Token?

If you are not using CAE-capable clients, your default Access Token lifetime will still be 1 hour unless you have configured your Access Token lifetime with the [Configurable Token Lifetime (CTL)](../develop/active-directory-configurable-token-lifetimes.md) preview feature.

If you are using CAE-capable clients that negotiate CAE-aware sessions, your CTL settings for Access Token lifetime will be overwritten and Access Token lifetime will be 24 hours.

### How quick is enforcement?

While our goal is for enforcement to be instant, in some cases latency of up to 15 minutes may be observed due to event propagation time.

### How will CAE work with Sign-in Frequency?

Sign-in Frequency will be honored with or without CAE.

## Next steps

[Announcing continuous access evaluation](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/moving-towards-real-time-policy-and-security-enforcement/ba-p/1276933)
