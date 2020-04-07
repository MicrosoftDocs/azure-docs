---
title: Azure AD Connect cloud provisioning supported topologies and scenarios
description: This topic describes the pre-requisites and the hardware requirements cloud provisioning.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 02/26/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# Azure AD Connect cloud provisioning supported topologies and scenarios
This article describes various on-premises and Azure Active Directory (Azure AD) topologies that use Azure AD Connect cloud provisioning. This article includes only supported configurations and scenarios.

> [!IMPORTANT]
> Microsoft doesn't support modifying or operating Azure AD Connect cloud provisioning outside of the configurations or actions that are formally documented. Any of these configurations or actions might result in an inconsistent or unsupported state of Azure AD Connect cloud provisioning. As a result, Microsoft can't provide technical support for such deployments.

## Things to remember about all scenarios and topologies
The following is a list of information to keep in mind when selecting a solution.

- Users and groups must be uniquely identified across all forests
- Matching across forests does not occur with cloud provisioning
- A user or group must be represented only once across all forests
- The source anchor for objects is chosen automatically.  It uses ms-DS-ConsistencyGuid if present, otherwise ObjectGUID is used.
- You cannot change the attribute that is used for source anchor.

## Single forest, single Azure AD tenant
![Topology for a single forest and a single tenant](media/plan-cloud-provisioning-topologies/single-forest.png)

The simplest topology is a single on-premises forest, with one or multiple domains, and a single Azure AD tenant.  For an example of this scenario see [Tutorial: A single forest with a single Azure AD tenant](tutorial-single-forest.md)


## Multi-forest, single Azure AD tenant
![Topology for a multi-forest and a single tenant](media/plan-cloud-provisioning-topologies/multi-forest.png)

A common topology is a multiple AD forests, with one or multiple domains, and a single Azure AD tenant.  

## Existing forest with Azure AD Connect, new forest with cloud Provisioning
![Topology for a single forest and a single tenant](media/plan-cloud-provisioning-topologies/existing-forest-new-forest.png)

This scenario is topology is similar to the multi-forest scenario, however this one involves an existing Azure AD Connect environment and then bringing on a new forest using Azure AD Connect cloud provisioning.  For an example of this scenario see [Tutorial: An existing forest with a single Azure AD tenant](tutorial-existing-forest.md)

## Piloting Azure AD Connect cloud provisioning in an existing hybrid AD forest
![Topology for a single forest and a single tenant](media/plan-cloud-provisioning-topologies/migrate.png)
The piloting scenario involves the existence of both Azure AD Connect and Azure AD Connect cloud provisioning in the same forest and scoping the users and groups accordingly. NOTE: An object should be in scope in only one of the tools. 

For an example of this scenario see [Tutorial: Pilot Azure AD Connect cloud provisioning in an existing synced AD forest](tutorial-pilot-aadc-aadccp.md)



## Next steps 

- [What is provisioning?](what-is-provisioning.md)
- [What is Azure AD Connect cloud provisioning?](what-is-cloud-provisioning.md)

