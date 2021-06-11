---
title: 'Azure AD on-premises application provisioning architecture | Microsoft Docs'
description: Describes overview of on-premises application provisioning architecture.
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
> The on-premises provisioning preview is currently in an invitation-only preview. You can request access to the capability [here](https://aka.ms/onpremprovisioningpublicpreviewaccess). We will open the preview to more customers and connectors over the next few months as we prepare for general availability.

## Overview

The following diagram shows an over view of how on-premises application provisioning works.

![Architecture](.\media\on-premises-application-provisioning-architecture\arch-3.png)

There are three primary components to provisioning users into an on-premises application.

- The Provisioning agent provides connectivity between Azure AD and your on-premises environment.
- The ECMA host converts provisioning requests from Azure AD to requests made to your target application. It serves as a gateway between Azure AD and your application. It allows you to import existing ECMA2 connectors used with Microsoft Identity Manager. Note, the ECMA host is not required if you have built a SCIM application or SCIM gateway.
- The Azure AD provisioning service serves as the synchronization engine.

>[!NOTE]
> MIM Sync is not required. However, you can use MIM sync to build and test your ECMA connector before importing it into the ECMA host.


### Firewall requirements

You do not need to open inbound connections to the corporate network. The provisioning agents only use outbound connections to the provisioning service, which means that there is no need to open firewall ports for incoming connections. You also do not need a perimeter (DMZ) network because all connections are outbound and take place over a secure channel. 

## Agent best practices
- Ensure the auto Azure AD Connect Provisioning Agent Auto Update service is running. It is enabled by default when installing the agent. Auto update is required for Microsoft to support your deployment.
- Avoid all forms of inline inspection on outbound TLS communications between agents and Azure. This type of inline inspection causes degradation to the communication flow.
- The agent has to communicate with both Azure and your application, so the placement of the agent affects the latency of those two connections. You can minimize the latency of the end-to-end traffic by optimizing each network connection. Each connection can be optimized by:-
- Reducing the distance between the two ends of the hop.
- Choosing the right network to traverse. For example, traversing a private network rather than the public Internet may be faster, due to dedicated links.

## Provisioning Agent questions
**What is the GA version of the Provisioning Agent?**

Refer to [Azure AD Connect Provisioning Agent: Version release history](provisioning-agent-release-version-history.md) for the latest GA version of the Provisioning Agent.

**How do I know the version of my Provisioning Agent?**

 1. Sign in to the Windows server where the Provisioning Agent is installed.
 2. Go to Control Panel -> Uninstall or Change a Program menu
 3. Look for the version corresponding to the entry Microsoft Azure AD Connect Provisioning Agent

**Does Microsoft automatically push Provisioning Agent updates?**

Yes, Microsoft automatically updates the provisioning agent if the Windows service Microsoft Azure AD Connect Agent Updater is up and running. Ensuring that your agent is up to date is required for support to troubleshoot issues.

**Can I install the Provisioning Agent on the same server running Azure AD Connect or Microsoft Identity Manager (MIM)?**

Yes, you can install the Provisioning Agent on the same server that runs Azure AD Connect or MIM, but they are not required.

**How do I configure the Provisioning Agent to use a proxy server for outbound HTTP communication?**

The Provisioning Agent supports use of outbound proxy. You can configure it by editing the agent config file **C:\Program Files\Microsoft Azure AD Connect Provisioning Agent\AADConnectProvisioningAgent.exe.config**. Add the following lines into it, towards the end of the file just before the closing </configuration> tag. Replace the variables [proxy-server] and [proxy-port] with your proxy server name and port values.
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
**How do I ensure that the Provisioning Agent is able to communicate with the Azure AD tenant and no firewalls are blocking ports required by the agent?**

You can also check whether all of the required ports are open.

**How do I uninstall the Provisioning Agent?**
1. Sign in to the Windows server where the Provisioning Agent is installed.
2. Go to Control Panel -> Uninstall or Change a Program menu
3. Uninstall the following programs:
     - Microsoft Azure AD Connect Provisioning Agent
     - Microsoft Azure AD Connect Agent Updater
     - Microsoft Azure AD Connect Provisioning Agent Package


## Next Steps

- [App provisioning](user-provisioning.md)
- [Azure AD ECMA Connector Host prerequisites](on-premises-ecma-prerequisites.md)
- [Azure AD ECMA Connector Host installation](on-premises-ecma-install.md)
- [Azure AD ECMA Connector Host configuration](on-premises-ecma-configure.md)
