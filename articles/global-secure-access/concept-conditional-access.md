---
title: Global Secure Access and Conditional Access
description: Understand network based controls avaialbe for Conditional Access policy

ms.service: network-access
ms.subservice: 
ms.topic: 
ms.date: 05/08/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Global Secure Access

1. Route traffic through Global Secure Access
    1. Choose between the available profiles Microsoft 365, Internet, and Private traffic profiles
1. Install the [Global Secure Access client](how-to-install-windows-client.md).
1. Branches
1. Quick Acces ranges
1. Restrict access to Global Secure Access using Conditional Access policies.
    1. Some may require MFA or compliant device
1. Source IP restoration 
1. Conditional Acces to resources like compliant network to SharePoint
1. Monitor

Global Secure Access enlightens services in multiple ways to help organizations improve their security posture and adopt Zero Trust principles. The underlying Conditional Access feature does not change with the following additions, the policies are processed in the same way. Functionalitiy like continuous access evaluation and more benefit from these additional enhancements to visibility in traffic coming from Global Secure Access clients or configured branch offices.



## Conditional Access on network traffic profiles

Integrations with the new Global Secure Access client and configured branch offices allow profiling of network traffic from endpoints as a way to consistently enforce policy. This functionality surfaces in Conditional Access as a new assignment that policies can target called traffic profiles. 

In the preview, we support the Microsoft 365 traffic profile wich contains... NEED A GOOD DESCRIPTION TO GO HERE OF WHAT THAT IS AND DOES

## Conditional Access on compliant network

Network traffic coming from Global Secure Access clients or configured branch offices to resources can be identified in Conditional Access policies. This ability is surfaced as a location condition called **All Compliant Network locations**. This location is used in the same way IP ranges or countries would, without the overhead of updating and redefining individual ranges. This location can be included or excluded in Conditional Access policies to meet organizational requirements. [Branch office networks](NEED-LINK-TO-DOC) and endpoints running the [Global Secure Access client]((how-to-install-windows-client.md)) appear in this location.

For example, you may only want users to access certain sensitive applications that don't support modern authentication when they are on this compliant network.

These compliant network locations are specific to each tenant. Branch locations or clients for one organization do not appear in another's.

## Next steps

[Enable compliant network check with Conditional Access](how-to-compliant-network.md)
