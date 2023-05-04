---
title: 
description: 

ms.service: network-access
ms.subservice: 
ms.topic: 
ms.date: 05/04/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Global Secure Access and Conditional Access

Global Secure Access enlightens Conditional Access in multiple ways to help organizations improve their security posture and adopt Zero Trust prinicples.

## Source IP restoration

With a cloud based network proxy between users and their resources, the source IP address that the resources see doesn't always match the actual source IP. In place of the end-users’ source IP, the resource endpoints typically see the cloud proxy as the source IP. Customers that use IP-based location information as a control in Conditional Access typically have issues with traditional SASE solutions breaking this capability. Source IP restoration provides the ability to restore the source IP and allow Conditional Access and other downstream applications to continue to use this in decision making. These IP location-based checks are relied on in places like: [continuous access evaluation](/azure/active-directory/conditional-access/concept-continuous-access-evaluation), [Identity Protection risk detections](/azure/active-directory/identity-protection/concept-identity-protection-risks), [audit logs](/azure/active-directory/reports-monitoring/concept-sign-ins), and [endpoint detection & response (EDR)](/microsoft-365/security/defender-endpoint/overview-endpoint-detection-response).

## Conditional Access on network traffic profiles from client

Integrations with the new Global Secure Access client allows profiling of network traffic from endpoints as a way to consitently enforce policy. This functionality surfaces in Conditional Access as a new assignment policies can target called traffic profiles. 

In the preview we support the Microsoft 365 traffic profile.

## Conditional Access on compliant network

Network traffic coming from Global Secure Access to resources can be identified in Conditional Access policies. This ability is surfaced as a location condition in the same way IP ranges or countries would. This location can be included or excluded in Conditional Access policies to meet organizational requirements. Branch office networks and endpoints running the Global Secure Access client will appear in this location.

For example: You may only want users to access certain sensitive applications when coming from a compliant network.

## Continuous access evaluation strict location enforcement

Continuous access evaluation (CAE) introduced real time enformcent of events like accounts being disabled or risk elevation. Strict location enforcement when paired with a compliant network allows CAE to detect location based events and take action to block access. Integration of of CAE with Global Secure Access features extends the functionality to any endpoint.

For example: Your organization may block access to Outlook or SharePoint from off the compliant network. If a user moves from their office to another location like a coffee shop and is no longer on a compliant network the change in IP address is seen and access can be blocked.

## Next steps
