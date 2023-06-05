---
title: What is Global Secure Access?
description: Learn how Global Secure Access provides control and visibility to users and devices both inside and outside of a traditional office.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: overview
ms.date: 05/25/2023
ms.service: network-access
ms.custom: 
---

# What is Global Secure Access?

The way people work has changed. Instead of working in traditional offices, people now work from nearly anywhere. The network perimeter for the modern workforce has created a need for a new category of networking that provides control and visibility to users and devices both inside and outside of a traditional office. This new category of networking is called Security Service Edge (SSE). Microsoft's SSE solution is called Global Secure Access and it includes two services: Microsoft Entra Private Access and Microsoft Entra Internet Access.

## What is Global Secure Access?

Microsoft Entra provides two products that encompass the Security Service Edge (SSE) solution: Microsoft Entra Private Access and Microsoft Entra Internet Access. Global Secure Access is the centralized location in Microsoft Entra to manage both. It provides modern network access control for users and devices.

Microsoft Entra Private Access and Microsoft Entra Internet Access create a new path for employees to access corporate resources. Through these services, employees can access resources from corporate headquarters, a remote network such as a branch location, or from their home office. Global Secure Access is built upon the core principles of Zero Trust to use least privilege, verify explicitly, and assume breach.

### Microsoft Entra Private Access

Microsoft Entra Private Access provides your users - whether in an office or working remotely - secured access to your private, corporate resources. Microsoft Entra Private Access uses a least-privilege access model instead of providing implicit trust and open access to all private apps and resources.

Microsoft Entra Private Access builds on the capabilities of Microsoft Entra ID App Proxy and extends access to any private resource, port, and protocol. After you configure [Quick access](how-to-configure-quick-access.md), your private resources can be accessed without requiring VPN. The [private traffic forwarding profile](how-to-enable-private-access-profile.md) then acquires and routes traffic to the apps and websites included in the Quick access range. With the Global Secure Access client, remote users can connect to private apps across hybrid and multicloud environments, private networks, and data centers from any device and network.

The service offers per-app adaptive access based on Conditional Access policies, for more granular security than a VPN. You can enable more security layers by requiring multi-factor authentication using Conditional Access. Microsoft Entra Private Access reduces operational complexity and cost by replacing traditional VPNs and building on the capabilities of App Proxy. 

### Microsoft Entra Internet Access

With Microsoft Entra Internet Access, you can protect users whether they're accessing Microsoft 365 services or exploring the web. For Microsoft 365 environments, Microsoft Entra Internet Access enables best-in-class security and visibility, along with fast and seamless access to Microsoft 365 apps. With a devoted traffic forwarding policy for Microsoft 365, your users are more secure wherever they work.

Microsoft Entra Internet Access also secures access to all Internet and SaaS apps while protecting your organization against Internet threads, malicious network traffic, and noncompliant content. Conditional Access policies can be used to enforce your traffic policies, based on the user identity, device, and the user's network.

The following diagram illustrates the new network traffic flow with Global Secure Access.

![Diagram of the new network traffic flow with Global Secure Access.](media/overview-what-is-global-secure-access/global-secure-access-traffic.png)

The features of Global Secure Access are all accessed from the Microsoft Entra admin center. With this centralized experience you can set up your remote network and client connectivity, manage your traffic profiles, and view network and usage logs. Extra security measures can be enforced using Conditional Access policies.

> [!IMPORTANT]
> Global Secure Access is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Next steps

- [Get started with Global Secure Access](how-to-get-started-with-global-secure-access.md)
