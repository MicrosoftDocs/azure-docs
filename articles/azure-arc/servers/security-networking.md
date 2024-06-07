---
title: Network security
description: Network security for Azure Arc-enabled servers.
ms.topic: conceptual
ms.date: 06/06/2024
---

# Network security

This article describes the networking requirements and options for Azure Arc-enabled servers. It details the necessary network endpoints and IP addresses. It also covers how extensions may require additional endpoints and the impact of TLS inspection.

## General networking

Azure Arc-enabled servers is a software-as-a-service offering with a combination of global and regional endpoints shared by all customers. All network communication from the Azure Connected Machine agent is outbound to Azure. Azure will never reach “into” your network to manage your machines. These connections are always encrypted using TLS certificates. The list of endpoints and IP addresses accessed by the agent are documented in our [network requirements](network-requirements.md).

Any extensions you install may require extra endpoints not included in the Azure Arc network requirements. Consult the extension documentation for further information on network requirements for that solution.

If your organization uses TLS inspection, the Azure Connected Machine agent does not use certificate pinning and will continue to work, so long as your machine trusts the certificate presented by the TLS inspection service. Some Azure Arc extensions use certificate pinning and will need to be excluded from TLS inspection. Consult the documentation for any extensions you deploy to determine if they support TLS inspection.

### Private endpoints

Private endpoints are an optional Azure networking technology that allow you to send network traffic over Express Route or a site-to-site VPN and more granularly control which machines can use Azure Arc. With private endpoints, you are able to use private IP addresses in your organization’s network address space to access the Azure Arc cloud services. Additionally, only servers you authorize are able to send data through these endpoints, which protects against unauthorized use of the Azure Connected Machine agent in your network.

It’s important to note that not all endpoints and not all scenarios are supported with private endpoints. You will still need to make firewall exceptions for some endpoints like Microsoft Entra ID, which does not offer a private endpoint solution. Any extensions you install may require additional private endpoints (if supported) or access to the public endpoints for their services. Additionally, you can’t use SSH or Windows Admin Center to access your server over a private endpoint.

Regardless of whether you use private or public endpoints, data transferred between the Azure Connected Machine agent and Azure is always encrypted. You can always start with public endpoints and later switch to private endpoints (or vice versa) as your business needs evolve.

