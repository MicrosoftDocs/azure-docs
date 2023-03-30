---
title: How to deploy on premises connectors
description: Learn how to deploy on premises connectors for Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 03/16/2023
ms.service: network-access
ms.custom: 
---

# Learn how to deploy on premises connectors for Global Secure Access
Application Proxy is used for on premises access for web applications. To learn more about Application Proxy, see [Using Azure AD Application Proxy to publish on-premises apps for remote users](../active-directory/app-proxy/what-is-application-proxy.md).

Global Secure Access includes Microsoft Entra Private Access and Microsoft Entra Internet Access. The table outlines which product is required for each feature in this article. To learn more about Microsoft Entra Private Access, see [What is Microsoft Entra Private Access?](overview-what-is-private-access.md). To learn more about Microsoft Entra Internet Access, see [What is Microsoft Entra Internet Access?](overview-what-is-internet-access.md).

| Feature   | Microsoft Entra Private Access | Microsoft Entra Internet Access |
|----------|-----------|------------|
| Feature A | X |   |
| Feature B |   | X |
| Feature C | X | X |
| Feature D | X |   |


## Understand Application Proxy connectors
Connectors are what make Application Proxy possible. They're simple, easy to deploy and maintain, and super powerful. This article discusses what connectors are, how they work, and some suggestions for how to optimize your deployment. To learn more about connectors, see [Understand Azure AD Application Proxy connectors](../active-directory/app-proxy/application-proxy-connectors.md).

## Publish applications on separate networks and locations using connector groups
You can create Application Proxy connector groups so that you can assign specific connectors to serve specific applications. This capability gives you more control and ways to optimize your Application Proxy deployment. To learn more about connector groups, see [Publish applications on separate networks and locations using connector groups](../active-directory/app-proxy/application-proxy-connector-groups.md).

<!-- 4. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links -->
- [Application Proxy documentation](../active-directory/app-proxy/)
