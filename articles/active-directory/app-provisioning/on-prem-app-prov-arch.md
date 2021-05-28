---
title: 'On-premises application provisioning architecture | Microsoft Docs'
description: Describes overview of on-premises application provisioning architecture.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 08/31/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# On-premises application provisioning architecture

## Overview

The following diagram shows an over view of how on-premises application provisioning works.

![Architecture](.\media\on-prem-app-prov-arch\arch1.png)

There are three primary components to provisioning users into an on-premises application.

1. The Provisioning agent provides connectivity between Azure AD and your on-premises environment.
2. The ECMA host converts provisioning requests from Azure AD to requests made to your target application. It serves as a gateway between Azure AD and your application. It allows you to import existing ECMA2 connectors used with Microsoft Identity Manager. Note, the ECMA host is not required if you have built a SCIM application or SCIM gateway.
3.  The Azure AD provisioning service serves as the synchronization engine.

>[!NOTE]
> MIM Sync is not required. However, you can use MIM sync to build and test your ECMA connector before importing it into the ECMA host. For more information see, [Export a Microsoft Identity Manager connector for use with Azure AD ECMA Connector Host](on-prem-migrate-mim.md)


### Firewall requirements

You do not need to open inbound connections to the corporate network. The provisioning agents only use outbound connections to the provisioning service, which means that there is no need to open firewall ports for incoming connections. You also do not need a perimeter (DMZ) network because all connections are outbound and take place over a secure channel. 

## Agent best practices
- Ensure the auto Azure AD Connect Provisioning Agent Auto Update service is running. It is enabled by default when installing the agent. Auto update is required for Microsoft to support your deployment.
- Avoid all forms of inline inspection on outbound TLS communications between agents and Azure. This type of inline inspection causes degradation to the communication flow.
- The agent has to communicate with both Azure and your application, so the placement of the agent affects the latency of those two connections. You can minimize the latency of the end-to-end traffic by optimizing each network connection. Each connection can be optimized by:-
- Reducing the distance between the two ends of the hop.
- Choosing the right network to traverse. For example, traversing a private network rather than the public Internet may be faster, due to dedicated links.


## Next Steps

- [App provisioning](user-provisioning.md)
- [Azure AD ECMA Connector Host prerequisites](on-prem-ecma-prerequisties.md)
- [Azure AD ECMA Connector Host installation](on-prem-ecma-install.md)
- [Azure AD ECMA Connector Host configuration](on-prem-ecma-configure.md)
- [Generic SQL Connector](on-prem-sql-connector-configure.md)
