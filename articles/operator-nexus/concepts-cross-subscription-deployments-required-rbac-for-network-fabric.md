---
title: Azure Operator Nexus - Cross-subscription deployments and required permissions for Network Fabric
description: Operator Nexus platform and tenant resource types
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 09/17/2024
ms.custom: template-concept
---

# Overview

This document provides a detailed analysis of cross-subscription deployments involving Network Fabric and Isolation Domains, with a focus on role-based access control (RBAC) and the permissions required for successful operations. It examines how resources within different subscriptions—referred to as Subscription A and Subscription B—interact, highlighting the key configurations and limitations encountered during testing.

The tests were conducted across multiple environments to evaluate scenarios where Network Fabric and Isolation Domains were deployed in distinct subscriptions. The aim was to assess whether specific user roles (e.g., Contributor, Reader, and custom roles) could perform actions such as creating Route Policies, IP Prefixes, and ACLs, while following least-privilege access principles.

This document also provides a comprehensive guide to the required permissions for cross-subscription resource management and explains the scenarios where deployments succeeded or failed based on RBAC permissions. Additionally, a table is provided summarizing the necessary roles and permissions for deploying Nexus resources in different subscriptions.

## Test bed for Cross-subscription deployments and RBAC permissions

The test bed used for evaluating cross-subscription deployments of Network Fabric (NF) and Isolation Domains (ID) was designed to simulate real-world scenarios, focusing on permissions and role-based access control (RBAC). Below are the details of the environment setup and configurations used during testing:

### Subscriptions

- **Subscription A (Primary subscription):** Hosts core resources, including Network Fabric. It includes Isolation Domains, Route Policies, IP Prefixes, and IP Communities.  

- **Subscription B (Secondary subscription):** Contains connected resources like Route Policies, IP Prefixes, and External Networks. It is used for testing cross-subscription resource sharing and policy implementation.

### Resources

- **Network Fabric (NF):** Connects Isolation Domains and External Networks, defining route policies.  

- **Isolation Domains (L2 & L3):** Virtual network segments isolating traffic between networks.  

- **Route Policies:** Govern traffic routing within and across subscriptions.  

- **Access Control Lists (ACLs):** Define allowed and denied traffic.  

- **IP Prefixes and Communities:** Used for address space definition and resource grouping for network control.

### User Roles and RBAC

- **Contributor:** Full resource management access, without role assignment.  

- **Reader:** Read-only access to resources.  

- **Custom Roles:** Grant specific permissions, such as "Join" resources or limited management abilities.

### Test cases and results

| Test Case | Subscription A | User RBAC (Target Resource) | Subscription B | User RBAC (Connected Resource) | Expected Result | Result | Remarks |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | NF + IP Prefix, IP Community | Contributor | Route Policy | Contributor | Failure | Failure | Route Policy creation failed (LinkedAuthorizationFailed) |
| 2 | NF + IP Prefix, IP Community | Contributor | Route Policy | Custom: Reader/Join | Success | Success | Successfully created Route Policy |
| 3 | NF + IP Prefix, IP Community | Contributor | Route Policy | Custom: Reader/Join | Failure | Failure | AuthorizationFailed error |
| 4 | NF + IP Prefix, IP Community | Contributor | Route Policy | Custom: Writer/Join | Success | Success | Successfully created Route Policy |
| 5 | NF + IP Prefix, IP Community | Contributor | Route Policy | Custom: Reader/Writer | Success | Success | Successfully created Route Policy |
| 6 | NF + IP Prefix, IP Community | Contributor | Route Policy | Contributor | Success | Success | Successfully created Route Policy |
| 7 | NF + IP Prefix, IP Community | Contributor | Route Policy | Custom: Reader/Join | Failure | Failure | AuthorizationFailed error |
| 8 | NF + IP Prefix, IP Community | Contributor | Route Policy | Custom: Writer/Join | Success | Success | Successfully created Route Policy |
| 9 | NF + IP Prefix, IP Community | Contributor | Route Policy | Custom: Reader/Writer | Failure | Failure | LinkedAuthorizationFailed error |
| 10 | NF + IP Prefix, IP Community | Contributor | Route Policy | Custom: Reader/Writer | Failure | Failure | LinkedAuthorizationFailed error |
| 11 | NF + L3 + Route Policy | Contributor | IP Prefix, IP Community | Contributor | Failure | Failure | Reader tried to enable L3 but failed (AuthorizationFailed) |
| 12 | NF + L3 + Route Policy | Contributor | IP Prefix, IP Community | Custom: Reader/Join | Failure | Failure | Reader+Join tried enabling L3 but failed |
| 13 | NF + L3 + Route Policy | Contributor | IP Prefix, IP Community | Custom: Reader/Join | Failure | Failure | Failed to create IP Prefix (AuthorizationFailed) |
| 14 | NF + L3 + Route Policy | Contributor | IP Prefix, IP Community | Custom: Reader/Writer | Success | Success | Successfully created Route Policy |
| 15 | NF + L3 + Route Policy | Contributor | IP Prefix, IP Community | Custom: Writer/Join | Success | Success | Successfully created Route Policy |
| 16 | NF + L3 + Route Policy | Contributor | IP Prefix, IP Community | Custom: Reader/Writer | Failure | Failure | LinkedAuthorizationFailed error |
| 17 | NFC & NF | Contributor | NF | Contributor | None of the above | None of the above | Test completed |
| 18 | NF + Isolation Domain | Contributor | Isolation Domain (L2 & L3) | Contributor | Success | Success | Test completed |
| 19 | NF + Isolation Domain + Route Policy | Contributor | Route Policy | Contributor | Success | Success | Test completed |
| 20 | NF + NNI + Route Policy | Contributor | Route Policy | Contributor | Success | Success | Test completed |
| 21 | NFC & NF | Reader | NF | Contributor | Failure | Failure | Test completed |
| 22 | NF + Isolation Domain | Reader | Isolation Domain (L2 & L3) | Contributor | Failure | Failure | Test completed |
| 23 | NF + Isolation Domain + Route Policy | Reader | L3 Isolation Domain + Route Policy | Contributor | Failure | Failure | Test completed |
| 24 | NF + Isolation Domain + Route Policy | Reader | Route Policy | Contributor | Failure | Failure | Test completed |
| 25 | NF + NNI + Route Policy | Reader | Route Policy | Contributor | Failure | Failure | Test completed |
| 26 | NF + Isolation Domain + External Networks + ACL | Contributor | Isolation Domain + External Networks + ACL | Contributor | Success | Success | Test completed |
| 27 | NF + Isolation Domain | Reader | Isolation Domain (L2 & L3) | Contributor / Only POST Action | Success | Success | Test completed |
| 28 | NF + Isolation Domain | Reader | Isolation Domain (L2 & L3) | Reader / Only POST Action | Failure | Failure | Test completed |
| 29 | NF + Isolation Domain + External Networks + ACL | Contributor | Isolation Domain + External Networks + ACL | Contributor | Success | Success | Test completed |
| 30 | NF + Isolation Domain + External Networks + ACL | Reader | Isolation Domain (RBAC-Read) + External Networks (RBAC-Write) + ACL (Write) | Reader | Failure | Failure | Test completed |
