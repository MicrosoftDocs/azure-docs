---
title: 'Azure AD Connect sync: Understand and customize synchronization | Microsoft Docs'
description: Explains how Azure AD Connect sync works and how to customize.
services: active-directory
documentationcenter: ''
author: andkjell
manager: femila
editor: ''

ms.assetid: ee4bf802-045b-4da0-986e-90aba2de58d6
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/01/2016
ms.author: markvi

---
# Azure AD Connect sync: Understand and customize synchronization
The Azure Active Directory Connect synchronization services (Azure AD Connect sync) is a main component of Azure AD Connect. It takes care of all the operations that are related to synchronize identity data between your on-premises environment and Azure AD. Azure AD Connect sync is the successor of DirSync, Azure AD Sync, and Forefront Identity Manager with the Azure Active Directory Connector configured.

This topic is the home for **Azure AD Connect sync** (also called **sync engine**) and lists links to all other topics related to it. For links to Azure AD Connect, see [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).

The sync service consists of two components, the on-premises **Azure AD Connect sync** component and the service side in Azure AD called **Azure AD Connect sync service**. The service is common for DirSync, Azure AD Sync, and Azure AD Connect.

## Azure AD Connect sync topics
| Topic | What it covers and when to read |
| --- | --- |
| **Azure AD Connect sync fundamentals** | |
| [Understanding the architecture](active-directory-aadconnectsync-understanding-architecture.md) |For those of you who are new to the sync engine and want to learn about the architecture and the terms used. |
| [Technical concepts](active-directory-aadconnectsync-technical-concepts.md) |A short version of the architecture topic and briefly explains the terms used. |
| [Topologies for Azure AD Connect](active-directory-aadconnect-topologies.md) |Describes the different topologies and scenarios the sync engine supports. |
| **Custom configuration** | |
| [Running the installation wizard again](active-directory-aadconnectsync-installation-wizard.md) |Explains what options you have available when you run the Azure AD Connect installation wizard again. |
| [Understanding Declarative Provisioning](active-directory-aadconnectsync-understanding-declarative-provisioning.md) |Describes the configuration model called declarative provisioning. |
| [Understanding Declarative Provisioning Expressions](active-directory-aadconnectsync-understanding-declarative-provisioning-expressions.md) |Describes the syntax for the expression language used in declarative provisioning. |
| [Understanding the default configuration](active-directory-aadconnectsync-understanding-default-configuration.md) |Describes the out-of-box rules and the default configuration. Also describes how the rules work together for the out-of-box scenarios to work. |
| [Understanding Users and Contacts](active-directory-aadconnectsync-understanding-users-and-contacts.md) |Continues on the previous topic and describes how the configuration for users and contacts works together, in particular in a multi-forest environment. |
| [How to make a change to the default configuration](active-directory-aadconnectsync-change-the-configuration.md) |Walks you through how to make a common configuration change to attribute flows. |
| [Best practices for changing the default configuration](active-directory-aadconnectsync-best-practices-changing-default-configuration.md) |Support limitations and for making changes to the out-of-box configuration. |
| [Configure Filtering](active-directory-aadconnectsync-configure-filtering.md) |Describes the different options for how to limit which objects are being synchronized to Azure AD and step-by-step how to configure these options. |
| **Features and scenarios** | |
| [Prevent accidental deletes](active-directory-aadconnectsync-feature-prevent-accidental-deletes.md) |Describes the *prevent accidental deletes* feature and how to configure it. |
| [Scheduler](active-directory-aadconnectsync-feature-scheduler.md) |Describes the built-in scheduler, which is importing, synchronizing, and exporting data. |
| [Implement password synchronization](active-directory-aadconnectsync-implement-password-synchronization.md) |Describes how password synchronization works, how to implement, and how to operate and troubleshoot. |
| [Device writeback](active-directory-aadconnect-feature-device-writeback.md) |Describes how device writeback works in Azure AD Connect. |
| [Directory extensions](active-directory-aadconnectsync-feature-directory-extensions.md) |Describes how to extend the Azure AD schema with your own custom attributes. |
| **Sync Service** | |
| [Azure AD Connect sync service features](active-directory-aadconnectsyncservice-features.md) |Describes the sync service side and how to change sync settings in Azure AD. |
| [Duplicate attribute resiliency](active-directory-aadconnectsyncservice-duplicate-attribute-resiliency.md) |Describes how to enable and use **userPrincipalName** and **proxyAddresses** duplicate attribute values resiliency. |
| **Operations and UI** | |
| [Synchronization Service Manager](active-directory-aadconnectsync-service-manager-ui.md) |Describes the Synchronization Service Manager UI, including [Operations](active-directory-aadconnectsync-service-manager-ui-operations.md), [Connectors](active-directory-aadconnectsync-service-manager-ui-connectors.md), [Metaverse Designer](active-directory-aadconnectsync-service-manager-ui-mvdesigner.md), and [Metaverse Search](active-directory-aadconnectsync-service-manager-ui-mvsearch.md) tabs. |
| [Operational tasks and considerations](active-directory-aadconnectsync-operations.md) |Describes operational concerns, such as disaster recovery. |
| **How To...** | |
| [Reset the Azure AD account](active-directory-aadconnectsync-howto-azureadaccount.md) |How to reset the credentials of the service account used to connect from Azure AD Connect sync to Azure AD. |
| **More information and references** | |
| [Ports](active-directory-aadconnect-ports.md) |Lists which ports you need to open between the sync engine and your on-premises directories and Azure AD. |
| [Attributes synchronized to Azure Active Directory](active-directory-aadconnectsync-attributes-synchronized.md) |Lists all attributes being synchronized between on-premises AD and Azure AD. |
| [Functions Reference](active-directory-aadconnectsync-functions-reference.md) |Lists all functions available in declarative provisioning. |

## Additional Resources
* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)

