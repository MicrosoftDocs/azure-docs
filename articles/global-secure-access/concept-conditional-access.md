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

Global Secure Access enlightens Conditional Access in multiple ways to help organizations improve their security posture and adopt Zero Trust principles.

## Source IP restoration

With a cloud based network proxy between users and their resources, the source IP address that the resources see doesn't always match the actual source IP. In place of the end-users’ source IP, the resource endpoints typically see the cloud proxy as the source IP. Customers that use IP-based location information as a control in Conditional Access typically have issues with traditional SASE solutions breaking this capability. Source IP restoration allows Conditional Access and other downstream applications to continue to use the source IP address in decision making. IP location-based checks are used in places like: [continuous access evaluation](/azure/active-directory/conditional-access/concept-continuous-access-evaluation), [Identity Protection risk detections](/azure/active-directory/identity-protection/concept-identity-protection-risks), [audit logs](/azure/active-directory/reports-monitoring/concept-sign-ins), and [endpoint detection & response (EDR)](/microsoft-365/security/defender-endpoint/overview-endpoint-detection-response).

To enable source IP restoration see the article, [Enabling source IP restoration](how-to-source-ip-restoration.md).

## Conditional Access on network traffic profiles from client

Integrations with the new Global Secure Access client allow profiling of network traffic from endpoints as a way to consistently enforce policy. This functionality surfaces in Conditional Access as a new assignment that policies can target called traffic profiles. 

In the preview, we support the Microsoft 365 traffic profile wich contains... (NEED A GOOD DESCRIPTION TO GO HERE OF WHAT THAT IS AND DOES)

## Conditional Access on compliant network

Network traffic coming from Global Secure Access clients or configured branch offices to resources can be identified in Conditional Access policies. This ability is surfaced as a location condition called **All Compliant Network locations**. This location is used in the same way IP ranges or countries would, without the overhead of updating and redefining individual ranges. This location can be included or excluded in Conditional Access policies to meet organizational requirements. [Branch office networks](NEED-LINK-TO-DOC) and endpoints running the [Global Secure Access client]((how-to-install-windows-client.md)) appear in this location.

For example, you may only want users to access certain sensitive applications that don't support modern authentication when they are on this compliant network.

## Continuous access evaluation strict location enforcement

Continuous access evaluation (CAE) introduced real time enformcent of events like accounts being disabled or risk elevation. Strict location enforcement when paired with a compliant network allows CAE to detect location based events and take action to block access. Integration of CAE with Global Secure Access features extends the functionality to any endpoint.

For example, your organization may block access to Outlook or SharePoint from off the compliant network. If a user moves from their office to another location, like a coffee shop and is no longer on a compliant network, the change in IP address is seen and access can be blocked.

## Next steps

