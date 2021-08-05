---
title: 'Azure AD on-premises application provisioning architecture | Microsoft Docs'
description: Presents an overview of on-premises application provisioning architecture.
services: active-directory
author: billmath
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 05/28/2021
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Azure AD on-premises application provisioning architecture

>[!IMPORTANT]
> The on-premises provisioning preview is currently in an invitation-only preview. To request access to the capability, use the [access request form](https://aka.ms/onpremprovisioningpublicpreviewaccess). We'll open the preview to more customers and connectors over the next few months as we prepare for general availability (GA).

## Overview

The following diagram shows an overview of how on-premises application provisioning works.

![Diagram that shows the architecture for on-premises application provisioning.](.\media\on-premises-application-provisioning-architecture\arch-3.png)

There are three primary components to provisioning users into an on-premises application:

- The provisioning agent provides connectivity between Azure Active Directory (Azure AD) and your on-premises environment.
- The ECMA host converts provisioning requests from Azure AD to requests made to your target application. It serves as a gateway between Azure AD and your application. You can use it to import existing ECMA2 connectors used with Microsoft Identity Manager. The ECMA host isn't required if you've built a SCIM application or SCIM gateway.
- The Azure AD provisioning service serves as the synchronization engine.

>[!NOTE]
> Microsoft Identity Manager Synchronization isn't required. But you can use it to build and test your ECMA connector before you import it into the ECMA host.


### Firewall requirements

You don't need to open inbound connections to the corporate network. The provisioning agents only use outbound connections to the provisioning service, which means there's no need to open firewall ports for incoming connections. You also don't need a perimeter (DMZ) network because all connections are outbound and take place over a secure channel.

## Agent best practices
- Ensure the auto Azure AD Connect Provisioning Agent Auto Update service is running. It's enabled by default when you install the agent. Auto-update is required for Microsoft to support your deployment.
- Avoid all forms of inline inspection on outbound TLS communications between agents and Azure. This type of inline inspection causes degradation to the communication flow.
- The agent must communicate with both Azure and your application, so the placement of the agent affects the latency of those two connections. You can minimize the latency of the end-to-end traffic by optimizing each network connection. Each connection can be optimized by:
  - Reducing the distance between the two ends of the hop.
  - Choosing the right network to traverse. For example, traversing a private network rather than the public internet might be faster because of dedicated links.

## Provisioning agent questions
Some common questions are answered here.

### What is the GA version of the provisioning agent?

For the latest GA version of the provisioning agent, see [Azure AD connect provisioning agent: Version release history](provisioning-agent-release-version-history.md).

### How do I know the version of my provisioning agent?

 1. Sign in to the Windows server where the provisioning agent is installed.
 1. Go to **Control Panel** > **Uninstall or Change a Program**.
 1. Look for the version that corresponds to the entry for **Microsoft Azure AD Connect Provisioning Agent**.

### Does Microsoft automatically push provisioning agent updates?

Yes. Microsoft automatically updates the provisioning agent if the Windows service Microsoft Azure AD Connect Agent Updater is up and running. Ensuring that your agent is up to date is required for support to troubleshoot issues.

### Can I install the provisioning agent on the same server running Azure AD Connect or Microsoft Identity Manager?

Yes. You can install the provisioning agent on the same server that runs Azure AD Connect or Microsoft Identity Manager, but they aren't required.

### How do I configure the provisioning agent to use a proxy server for outbound HTTP communication?

The provisioning agent supports use of outbound proxy. You can configure it by editing the agent config file **C:\Program Files\Microsoft Azure AD Connect Provisioning Agent\AADConnectProvisioningAgent.exe.config**. Add the following lines into it toward the end of the file just before the closing `</configuration>` tag. Replace the variables `[proxy-server]` and `[proxy-port]` with your proxy server name and port values.

```
    <system.net>
        <defaultProxy enabled="true" useDefaultCredentials="true">
            <proxy
                usesystemdefault="true"
                proxyaddress="http://[proxy-server]:[proxy-port]"
                bypassonlocal="true"
            />
        </defaultProxy>
    </system.net>
```
### How do I ensure the provisioning agent can communicate with the Azure AD tenant and no firewalls are blocking ports required by the agent?

You can also check whether all the required ports are open.

### How do I uninstall the provisioning agent?
1. Sign in to the Windows server where the provisioning agent is installed.
1. Go to **Control Panel** > **Uninstall or Change a Program**.
1. Uninstall the following programs:
     - Microsoft Azure AD Connect Provisioning Agent
     - Microsoft Azure AD Connect Agent Updater
     - Microsoft Azure AD Connect Provisioning Agent Package


## Next steps

- [App provisioning](user-provisioning.md)
- [Azure AD ECMA Connector Host prerequisites](on-premises-ecma-prerequisites.md)
- [Azure AD ECMA Connector Host installation](on-premises-ecma-install.md)
- [Azure AD ECMA Connector Host configuration](on-premises-ecma-configure.md)
