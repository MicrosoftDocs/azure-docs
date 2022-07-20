---
title: Continuous access evaluation in Azure AD
description: Responding to changes in user state faster with continuous access evaluation in Azure AD

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 07/18/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: karenhoran
ms.reviewer: vmahtani

ms.collection: M365-identity-device-management
---
# Continuous access evaluation for service principals (preview)

Continuous Access Evaluation (CAE) for service principals allows [What are workload identities?](../develop/workload-identities-overview.md) service accounts to gain significant security benefits by providing real-time enforcement of Conditional Access location and risk policies along with instant enforcement of token revocation events.

## Scenarios

CAE for Service Principals public preview scope includes the following: 

- Instant enforcement of key revocation events – service principal disable,  service principal delete and High service principal risk detected by Azure AD Identity Protection
- Enforcement of location based Conditional Access policies 

The only resource provider enabled as part of this preview is Microsoft Graph only for third party (3P) clients 

Opt-in for CAE+SP

[Claims challenges, claims requests, and client capabilities](../develop/claims-challenge.md)
The opt-in for CAE+SP is when API implementer requests xms_cc as an optional claim. The xms_cc claim with a value of "cp1" in the access token is the authoritative way to identify a client application is capable of handling a claims challenge. Your Microsoft-sourced authentication SDK may include this opt-in parameter. (for example, Azure SDK)

Opt-out for CAE+SP

In order to opt out, don't send xms_cc claim with a value of "cp1"; if you're a premium tenant, you could also create Conditional Access policy to disable CAE for SP as an immediate stop-gap measure 
Register an application with Azure AD, create a service principal and create a Conditional Access policy
Refer this link to register an application with Azure AD and create a service principal. 
Refer this link to create a Conditional Access policy.
To create a policy that corresponds to service principals, under Assignments select Workload Identities. Configure the remainder of the policy controls per your organizational requirements.  Location ranges can be configured within the Conditions tab. Select Create once configured to create your Conditional Access policy.
a.	CAE is enabled in Conditional Access policies by default. 
b.	If you want to disable CAE, navigate to your policy and disable CAE as found in the Session tab.

Sign In Logs Verification 

When a client’s access to a resource is blocked due to CAE being triggered, the client’s session will be revoked and the client will need to reauthenticate. This behavior can be verified in the sign-in logs. 

The following steps detail how an admin can verify sign in activity in the sign-in logs: 

1.	Sign into the Azure portal as a Conditional Access Administrator, Security Administrator, or Global Administrator.
1.	Browse to Azure Active Directory > Sign in logs > Service Principal Sign-ins Admins can use filters to ease the debugging process. 
1.	Double select on an entry to see activity details. The field Continuous access evaluation will indicate whether a CAE token was issued in a particular sign-in attempt. 

Related Links

Developers Guide for CAE for Service Principals 
CAE documentation 
Service Principal Portal Operational Guide
[How to use Continuous Access Evaluation enabled APIs in your applications](../develop/app-resilience-continuous-access-evaluation.md)