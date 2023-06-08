---
title: How to configure connectors for Microsoft Entra Private Access
description: Learn how to App Proxy connectors for Microsoft Entra Private Access.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 06/08/2023
ms.service: network-access
ms.custom: 

---
# How to configure App Proxy connectors for Microsoft Entra Private Access

Microsoft Entra ID Application Proxy is used for on-premises access for web applications. To learn more about App Proxy, see [Using Azure AD Application Proxy to publish on-premises apps for remote users](../active-directory/app-proxy/what-is-application-proxy.md).

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Understand App Proxy connectors

Connectors are what make App Proxy possible. They're simple, easy to deploy and maintain, and super powerful. To learn more about connectors, see [Understand Azure AD Application Proxy connectors](../active-directory/app-proxy/application-proxy-connectors.md).

> [!NOTE]
> Setting up App Proxy connectors and connector groups require planning and testing to ensure you have the right configuration for your organization. If you don't already have connector groups set up, pause this process and return when you have a connector group ready.

## Publish apps on separate networks and locations using connector groups

You can create App Proxy connector groups so that you can assign specific connectors to serve specific applications. This capability gives you more control and ways to optimize your Application Proxy deployment. To learn more about connector groups, see [Publish applications on separate networks and locations using connector groups](../active-directory/app-proxy/application-proxy-connector-groups.md).

Steps:
<!--- need link --->
1. Download and install the connector
    - Download the AADApplicationProxyConnectorInstaller.
    - Connectors use outbound ports 443 and 8398 over the internet to connect to Global Secure Access.
    - For information on how to allow access to specific FQDNs, see [Add an on-premises app with App Proxy](../active-directory/app-proxy/application-proxy-add-on-premises-application.md#allow-access-to-urls).
1. Register the connector.
1. Create a connector group to use for private access configurations.

## Next steps

- [Configure per-app access for Microsoft Entra Private Access](how-to-configure-per-app-access.md)
