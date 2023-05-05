---
title: 
description: 

ms.service: network-access
ms.subservice: 
ms.topic: 
ms.date: 04/25/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Universal Tenant Restrictions

Background  

Tenant Restriction v1 (TRv1) was an important capability but had some key limitations as listed below: 

Limited authentication type coverage: TRv1 implementation is restricted to the Azure AD Evolved Security Token Service (ESTS) authentication plane. This results in key gaps with respect to security coverage that this feature provides for other authentication types including – Microsoft Account (MSA) logins, basic authentication, WOPI etc. 

Lack of granularity: TRv1 is a broad-brush feature and does not allow administrators to select users and applications that are allowed to access a particular foreign tenant. Allow access control lists for TRv1 work at the ‘all or nothing’ grain and does not support principles of least privilege. 

No protection against token injection or anonymous access: Being an Azure AD control plane feature (only), it doesn’t protect against malicious users connecting to clients leveraging anonymous access or by copying tokens from other devices and replaying them directly in the data path during resource access. 

Tenant Restriction v2 (TRv2) resolves token injection issue, anonymous access, and off-net connectivity issues by adding two key capabilities in the ecosystem – 

Deploy device policies on managed/corporate devices, which will trigger an OS based TRv2 Header injection into outbound HTTP traffic (Authentication control as well as data sessions) to Microsoft 365 (M365) endpoints via native M365 clients as well as the Edge browser. The header will identify the following attributes – Cloud ID of the device tenant, Tenant ID of the device tenant (TID), TRv2 Policy ID (PID) of the device tenant. One of the key design points that drives the injection of the TRv2 header policy at the client level (as opposed to the network layer) is to safeguard M365 data connections from being directed to non-Windows network stacks to perform that function via Man in the Middle SSL Break and Inspect method (which is not supported by M365). 

Enable Azure AD/MSA to interpret this special HTTP header to look up the TRv2 policy associated with incoming authentication request and enforce the same. Similarly, all M365 SaaS applications will be able to retrieve the TRv2 PID from incoming data session requests and enforce the right set of tenant restriction rules for the device which is issuing the traffic. 

Further, the new protocol of device and Azure AD/M365 directly communicating the tenant-policy between each other removes the need for corpnet proxy to enforce tenant restrictions ensuring coverage for off-net scenarios.  

To summarize, by removing the reliance on corpnet proxy and by enabling TR policy enforcement directly at Microsoft SaaS service level (i.e., M365 workloads), TRv2 provides some important advantages vis-à-vis TRv1: 

Direct enforcement in M365 workloads prevents data exfiltration risk through token injection. 

Removes reliance on proxies and provides coverage for off-net managed devices. 

Coverage for anonymous access 

Coverage for MSA access scenarios 

As noted in the sections above, TRv2 remediates some of the key gaps in TRv1 as reported by customers. However, in the typical TRv2 architecture there is a strong dependency on the client-side stack supporting HTTP header tagging and identifying the “home tenant” of the device where traffic is originating from. It’s not always possible to consistently adhere to HTTP header tagging across all device types, OS flavors and browsers. Some notable gaps/challenges with TRv2 client-side implementation are listed below: 

No coverage for browsers like Chrome 

No coverage for M365 clients bypassing WinHTTP/WinInet stack 

No coverage for unmanaged devices (such as Unix workstations) behind corpnet 

No coverage for Mac OS, Linux, Android, iOS devices 

No coverage for non-HTTP data 

Universal Tenant Restrictions: With the help of Network as a Service (NaaS)/Zero Trust Network Access (ZTNA) interception at Microsoft cloud edge and offloading HTTP header filtering using Edge tagging, it’s possible to mitigate the adoption blockers in the path of this critical security feature. 

Key advantages of ZTNA based TRv2 tagging (Universal Tenant Restrictions) are summarized below: 

Coverage for tagging all traffic agnostic of browser or OS stack used on the device. 

Support for branch connectivity as well as direct from device connectivity. 

No need to manage local corpnet proxies, native integration with M365 frontdoor. 

Best-in-class performance across both Azure AD and M365 datapath – no cliffs experience. 

What’s in the preview? 

NaaS Client and Branch availability of tenant restrictions policy enforcement in SharePoint Online (SPO). 

NaaS Client and Branch availability of tenant restrictions policy enforcement in Exchange Online (EXO). 

Goals of this private preview 

Test that the Universal Tenant Restrictions functionality works as expected, with EXO traffic, in addition to the SPO traffic.  

Summary 

Universal Tenant Restrictions is the enforcement of Tenant Restriction v2 (TRv2) for all OS and Browser platform leveraging NaaS based policy signaling for both authentication and data plane endpoints. The TR feature enables enterprises to prevent data exfiltration by malicious users leveraging foreign tenant identities for Azure AD integrated applications like SPO and EXO. TRv2 and NaaS work hand in hand to prevent data exfiltration universally across all devices and networks.  

Where can we see Universal Tenant Restrictions? 

In the ZTNA portal, for tenant-level configuration of Universal Tenant Restrictions. 

Tenant restrictions (Preview) - Tenant restriction settings - Microsoft Azure 

Full feature flag URL: 

(https://portal.azure.com/?Microsoft_Azure_Network_Access_assettypeoptions=%7B%22NetworkAccess%22%3A%7B%22options%22%3A%22ShowAssetType%22%7D%7D&microsoft_azure_compute=true&Microsoft_Azure_Network_Access_adaptiveAccess=true&feature.caNetworkAccess=true%20#view/Microsoft_AAD_IAM/TenantRestrictions.ReactView/isDefault~/true)  

For more granular options, such as allow-listing, and blocking specific tenants. 

External Identities - Microsoft Azure 

Full feature flag URL: 

(https://portal.azure.com/?Microsoft_Azure_Network_Access_assettypeoptions=%7B%22NetworkAccess%22%3A%7B%22options%22%3A%22ShowAssetType%22%7D%7D&microsoft_azure_compute=true&Microsoft_Azure_Network_Access_adaptiveAccess=true&feature.caNetworkAccess=true%20#view/Microsoft_AAD_IAM/CompanyRelationshipsMenuBlade/~/CrossTenantAccessSettings) 

Pre-requisites 

As an end-user, setup NaaS client. 

Make sure the NaaS client is running on your machine.  

Configure cross-tenant access settings/ TRv2 policy in your tenant. There is only one cross tenant access settings/ TRv2 policy per tenant so all users in this tenant will be impacted by any modifications that you make.  

Once configured, a foreign tenant by default, i.e., if it’s not allow-listed, is blocked.  

External Identities - Microsoft Azure;  

Full feature flag URL: 

(https://portal.azure.com/?Microsoft_AAD_IAM_isXTAPTenantRestrictionEnabled=true#view/Microsoft_AAD_IAM/CompanyRelationshipsMenuBlade/~/CrossTenantAccessSettings) 