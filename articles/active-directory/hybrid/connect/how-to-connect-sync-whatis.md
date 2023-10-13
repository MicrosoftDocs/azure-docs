---
title: 'Microsoft Entra Connect Sync: Understand and customize synchronization'
description: Explains how Microsoft Entra Connect Sync works and how to customize.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''

ms.assetid: ee4bf802-045b-4da0-986e-90aba2de58d6
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Microsoft Entra Connect Sync: Understand and customize synchronization
The Microsoft Entra Connect synchronization services (Microsoft Entra Connect Sync) is a main component of Microsoft Entra Connect. It takes care of all the operations that are related to synchronize identity data between your on-premises environment and Microsoft Entra ID. Microsoft Entra Connect Sync is the successor of DirSync, Azure AD Sync, and Forefront Identity Manager with the Microsoft Entra Connector configured.

This topic is the home for **Microsoft Entra Connect Sync** (also called **sync engine**) and lists links to all other topics related to it. For links to Microsoft Entra Connect, see [Integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md).

The sync service consists of two components, the on-premises **Microsoft Entra Connect Sync** component and the service side in Microsoft Entra ID called **Microsoft Entra Connect Sync service**.
>[!IMPORTANT]
>Microsoft Entra Cloud Sync is a new offering from Microsoft designed to meet and accomplish your hybrid identity goals for synchronization of users, groups, and contacts to Microsoft Entra ID. It accomplishes this by using the Microsoft Entra Cloud provisioning agent instead of the Microsoft Entra Connect application. Microsoft Entra Cloud Sync is replacing Microsoft Entra Connect Sync, which will be retired after Cloud Sync has full functional parity with Connect sync. The remainder of this article is about AADConnect sync, but we encourage customers to review the features and advantages of Cloud Sync before deploying AADConnect sync. 
>
>To find out if you are already eligible for Cloud Sync, please verify your requirements in [this wizard](https://admin.microsoft.com/adminportal/home?Q=setupguidance#/modernonboarding/identitywizard).
>
>To learn more about Cloud Sync please read [this article](../cloud-sync/what-is-cloud-sync.md), or watch this [short video](https://www.microsoft.com/videoplayer/embed/RWJ8l5).
>


<a name='azure-ad-connect-sync-topics'></a>

## Microsoft Entra Connect Sync topics
| Topic | What it covers and when to read |
| --- | --- |
| **Microsoft Entra Connect Sync fundamentals** | |
| [Understanding the architecture](concept-azure-ad-connect-sync-architecture.md) |For those of you who are new to the sync engine and want to learn about the architecture and the terms used. |
| [Technical concepts](how-to-connect-sync-technical-concepts.md) |A short version of the architecture topic and briefly explains the terms used. |
| [Topologies for Microsoft Entra Connect](plan-connect-topologies.md) |Describes the different topologies and scenarios the sync engine supports. |
| **Custom configuration** | |
| [Running the installation wizard again](how-to-connect-installation-wizard.md) |Explains what options you have available when you run the Microsoft Entra Connect installation wizard again. |
| [Understanding Declarative Provisioning](concept-azure-ad-connect-sync-declarative-provisioning.md) |Describes the configuration model called declarative provisioning. |
| [Understanding Declarative Provisioning Expressions](concept-azure-ad-connect-sync-declarative-provisioning-expressions.md) |Describes the syntax for the expression language used in declarative provisioning. |
| [Understanding the default configuration](concept-azure-ad-connect-sync-default-configuration.md) |Describes the out-of-box rules and the default configuration. Also describes how the rules work together for the out-of-box scenarios to work. |
| [Understanding Users and Contacts](concept-azure-ad-connect-sync-user-and-contacts.md) |Continues on the previous topic and describes how the configuration for users and contacts works together, in particular in a multi-forest environment. |
| [How to make a change to the default configuration](how-to-connect-sync-change-the-configuration.md) |Walks you through how to make a common configuration change to attribute flows. |
| [Best practices for changing the default configuration](how-to-connect-sync-best-practices-changing-default-configuration.md) |Support limitations and for making changes to the out-of-box configuration. |
| [Configure Filtering](how-to-connect-sync-configure-filtering.md) |Describes the different options for how to limit which objects are being synchronized to Microsoft Entra ID and step-by-step how to configure these options. |
| **Features and scenarios** | |
| [Prevent accidental deletes](how-to-connect-sync-feature-prevent-accidental-deletes.md) |Describes the *prevent accidental deletes* feature and how to configure it. |
| [Scheduler](how-to-connect-sync-feature-scheduler.md) |Describes the built-in scheduler, which is importing, synchronizing, and exporting data. |
| [Implement password hash synchronization](how-to-connect-password-hash-synchronization.md) |Describes how password synchronization works, how to implement, and how to operate and troubleshoot. |
| [Device writeback](how-to-connect-device-writeback.md) |Describes how device writeback works in Microsoft Entra Connect. |
| [Directory extensions](how-to-connect-sync-feature-directory-extensions.md) |Describes how to extend the Microsoft Entra schema with your own custom attributes. |
| [Microsoft 365 PreferredDataLocation](how-to-connect-sync-feature-preferreddatalocation.md) |Describes how to put the user's Microsoft 365 resources in the same region as the user. |
| **Sync Service** | |
| [Microsoft Entra Connect Sync service features](how-to-connect-syncservice-features.md) |Describes the sync service side and how to change sync settings in Microsoft Entra ID. |
| [Duplicate attribute resiliency](how-to-connect-syncservice-duplicate-attribute-resiliency.md) |Describes how to enable and use **userPrincipalName** and **proxyAddresses** duplicate attribute values resiliency. |
| **Operations and UI** | |
| [Synchronization Service Manager](how-to-connect-sync-service-manager-ui.md) |Describes the Synchronization Service Manager UI, including [Operations](how-to-connect-sync-service-manager-ui-operations.md), [Connectors](how-to-connect-sync-service-manager-ui-connectors.md), [Metaverse Designer](how-to-connect-sync-service-manager-ui-mvdesigner.md), and [Metaverse Search](how-to-connect-sync-service-manager-ui-mvsearch.md) tabs. |
| [Operational tasks and considerations](./how-to-connect-sync-staging-server.md) |Describes operational concerns, such as disaster recovery. |
| **How To...** | |
| [Reset the Microsoft Entra account](how-to-connect-azureadaccount.md) |How to reset the credentials of the service account used to connect from Microsoft Entra Connect Sync to Microsoft Entra ID. |
| **More information and references** | |
| [Ports](reference-connect-ports.md) |Lists which ports you need to open between the sync engine and your on-premises directories and Microsoft Entra ID. |
| [Attributes synchronized to Microsoft Entra ID](reference-connect-sync-attributes-synchronized.md) |Lists all attributes being synchronized between on-premises AD and Microsoft Entra ID. |
| [Functions Reference](reference-connect-sync-functions-reference.md) |Lists all functions available in declarative provisioning. |

## Additional Resources
* [Integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md)
