---
title: 'Azure AD Connect cloud provisioning deep dive - how it works'
description: This topic provides deep dive information on how cloud provisioning works.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 12/05/2019
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Cloud provisioning deep dive - how it works

## Overview of components
Cloud provisioning is built on top of the Azure AD services and has 2 key components:

- **Provisioning agent**: Same agent as Workday inbound and built on the same server-side technology as app proxy and Pass Through Authentication. Requires outbound connection only and agents are auto-updated. 
- **Provisioning service**: Same provisioning service as outbound provisioning and Workday inbound provisioning which uses a scheduler-based model. In case of cloud provisioning, the changes are provisioned every 2 mins.


## Initial setup
During initial setup, the a few things are done that makes cloud provisoining happen.  These are: 

- **During agent installation**: You configure the agent for the AD domains you want to provision from.  This configuration registers the domains in the hybrid identity service and establishes an outbound connection to the service bus listening for requests.
- **When you enable provisioning**: You select the AD domain and enable provisioning which runs every 2 mins. Optionally you may deselect password hash sync and define notification email. You can also manage attribute transformation using Microsoft Graph APIs.

## What is System for Cross-domain Identity Management (SCIM)?

The [SCIM specification](https://tools.ietf.org/html/draft-scim-core-schema-01) is a standard that is used to automate the exchanging of user or group identity information between identity domains such as Azure AD. SCIM is becoming the de facto standard for provisioning and, when used in conjunction with federation standards like SAML or OpenID Connect, provides administrators an end-to-end standards-based solution for access management.

The Azure AD Connect cloud provisioning agent uses SCIM with Azure AD to provision and deprovision users and groups.

## Cloud provisioning flow
![provisioning](media/concept-how-it-works/provisioning1.png)
Once you have installed the agent and enabled provisioning, the following flow occurs.

1.  Once configured, the Azure AD Provisioning service calls the Azure AD hybrid service to add a request to the Service bus. The agent constantly maintains an outbound connection to the Service Bus listening for requests and picks up the System for Cross-domain Identity Management (SCIM) request immediately. 
2.  The agent sends a LDAP query to AD. 
3.  AD returns the result to the agent. 
4.  Agent returns the SCIM response to Azure AD. 
5.  The provisioning service writes the changes to Azure AD.

## Supported scenarios:
The following scenarios are supported for cloud provisioning.


- **Existing hybrid customer with a new forest**: Azure AD Connect sync is used for primary forests. Cloud provisioning is used for provisioning from an AD forest (including disconnected).
- **New hybrid customer**: Azure AD Connect sync is not used. Cloud provisioning is used for provisioning from an AD forest.
- **Existing hybrid customer**: Azure AD Connect sync is used for primary forests.Cloud provisioning is piloted for a small set of users in the primary forests.

>[!NOTE]
>As we GA cloud provisioning and add more features to cloud provisioning, customers can move from piloting to deploying cloud provisioning for forests that are using Azure AD Connect sync. 

## Next steps 

- [What is provisioning?](what-is-provisioning.md)
- [What is Azure AD Connect cloud provisioning?](what-is-cloud-provisioning.md)
