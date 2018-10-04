---
title: 'Azure AD Connect sync: Understand and customize synchronization | Microsoft Docs'
description: Explains how Azure AD Connect sync works and how to customize.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: ''

ms.assetid: ee4bf802-045b-4da0-986e-90aba2de58d6
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/08/2017
ms.component: hybrid
ms.author: billmath

---
# Azure AD Connect sync: Understand and customize synchronization
The Azure Active Directory Connect synchronization services (Azure AD Connect sync) is a main component of Azure AD Connect. It takes care of all the operations that are related to synchronize identity data between your on-premises environment and Azure AD. Azure AD Connect sync is the successor of DirSync, Azure AD Sync, and Forefront Identity Manager with the Azure Active Directory Connector configured.

This topic is the home for **Azure AD Connect sync** (also called **sync engine**) and lists links to all other topics related to it. For links to Azure AD Connect, see [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).

The sync service consists of two components, the on-premises **Azure AD Connect sync** component and the service side in Azure AD called **Azure AD Connect sync service**.

## Azure AD Connect sync topics
| Topic | What it covers and when to read |
| --- | --- |
| **Azure AD Connect sync fundamentals** | |
| [Understanding the architecture](concept-azure-ad-connect-sync-architecture.md) |For those of you who are new to the sync engine and want to learn about the architecture and the terms used. |
| [Technical concepts](how-to-connect-sync-technical-concepts.md) |A short version of the architecture topic and briefly explains the terms used. |
| [Topologies for Azure AD Connect](plan-connect-topologies.md) |Describes the different topologies and scenarios the sync engine supports. |
| **Custom configuration** | |
| [Running the installation wizard again](how-to-connect-installation-wizard.md) |Explains what options you have available when you run the Azure AD Connect installation wizard again. |
| [Understanding Declarative Provisioning](concept-azure-ad-connect-sync-declarative-provisioning.md) |Describes the configuration model called declarative provisioning. |
| [Understanding Declarative Provisioning Expressions](concept-azure-ad-connect-sync-declarative-provisioning-expressions.md) |Describes the syntax for the expression language used in declarative provisioning. |
| [Understanding the default configuration](concept-azure-ad-connect-sync-default-configuration.md) |Describes the out-of-box rules and the default configuration. Also describes how the rules work together for the out-of-box scenarios to work. |
| [Understanding Users and Contacts](concept-azure-ad-connect-sync-user-and-contacts.md) |Continues on the previous topic and describes how the configuration for users and contacts works together, in particular in a multi-forest environment. |
| [How to make a change to the default configuration](how-to-connect-sync-change-the-configuration.md) |Walks you through how to make a common configuration change to attribute flows. |
| [Best practices for changing the default configuration](how-to-connect-sync-best-practices-changing-default-configuration.md) |Support limitations and for making changes to the out-of-box configuration. |
| [Configure Filtering](how-to-connect-sync-configure-filtering.md) |Describes the different options for how to limit which objects are being synchronized to Azure AD and step-by-step how to configure these options. |
| **Features and scenarios** | |
| [Prevent accidental deletes](how-to-connect-sync-feature-prevent-accidental-deletes.md) |Describes the *prevent accidental deletes* feature and how to configure it. |
| [Scheduler](how-to-connect-sync-feature-scheduler.md) |Describes the built-in scheduler, which is importing, synchronizing, and exporting data. |
| [Implement password hash synchronization](how-to-connect-password-hash-synchronization.md) |Describes how password synchronization works, how to implement, and how to operate and troubleshoot. |
| [Device writeback](how-to-connect-device-writeback.md) |Describes how device writeback works in Azure AD Connect. |
| [Directory extensions](how-to-connect-sync-feature-directory-extensions.md) |Describes how to extend the Azure AD schema with your own custom attributes. |
| [Office 365 PreferredDataLocation](how-to-connect-sync-feature-preferreddatalocation.md) |Describes how to put the user's Office 365 resources in the same region as the user. |
| **Sync Service** | |
| [Azure AD Connect sync service features](how-to-connect-syncservice-features.md) |Describes the sync service side and how to change sync settings in Azure AD. |
| [Duplicate attribute resiliency](how-to-connect-syncservice-duplicate-attribute-resiliency.md) |Describes how to enable and use **userPrincipalName** and **proxyAddresses** duplicate attribute values resiliency. |
| **Operations and UI** | |
| [Synchronization Service Manager](how-to-connect-sync-service-manager-ui.md) |Describes the Synchronization Service Manager UI, including [Operations](how-to-connect-sync-service-manager-ui-operations.md), [Connectors](how-to-connect-sync-service-manager-ui-connectors.md), [Metaverse Designer](how-to-connect-sync-service-manager-ui-mvdesigner.md), and [Metaverse Search](how-to-connect-sync-service-manager-ui-mvsearch.md) tabs. |
| [Operational tasks and considerations](how-to-connect-sync-operations.md) |Describes operational concerns, such as disaster recovery. |
| **How To...** | |
| [Reset the Azure AD account](how-to-connect-azureadaccount.md) |How to reset the credentials of the service account used to connect from Azure AD Connect sync to Azure AD. |
| **More information and references** | |
| [Ports](reference-connect-ports.md) |Lists which ports you need to open between the sync engine and your on-premises directories and Azure AD. |
| [Attributes synchronized to Azure Active Directory](reference-connect-sync-attributes-synchronized.md) |Lists all attributes being synchronized between on-premises AD and Azure AD. |
| [Functions Reference](reference-connect-sync-functions-reference.md) |Lists all functions available in declarative provisioning. |

## Additional Resources
* [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md)
