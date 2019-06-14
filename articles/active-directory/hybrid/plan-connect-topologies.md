---
title: 'Azure AD Connect: Supported topologies | Microsoft Docs'
description: This topic details supported and unsupported topologies for Azure AD Connect
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
editor: ''
ms.assetid: 1034c000-59f2-4fc8-8137-2416fa5e4bfe
ms.service: active-directory
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: identity
ms.topic: conceptual
ms.date: 11/27/2018
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---
# Topologies for Azure AD Connect
This article describes various on-premises and Azure Active Directory (Azure AD) topologies that use Azure AD Connect sync as the key integration solution. This article includes both supported and unsupported configurations.


Here's the legend for pictures in the article:

| Description | Symbol |
| --- | --- |
| On-premises Active Directory forest |![On-premises Active Directory forest](./media/plan-connect-topologies/LegendAD1.png) |
| On-premises Active Directory with filtered import |![Active Directory with filtered import](./media/plan-connect-topologies/LegendAD2.png) |
| Azure AD Connect sync server |![Azure AD Connect sync server](./media/plan-connect-topologies/LegendSync1.png) |
| Azure AD Connect sync server “staging mode” |![Azure AD Connect sync server “staging mode”](./media/plan-connect-topologies/LegendSync2.png) |
| GALSync with Forefront Identity Manager (FIM) 2010 or Microsoft Identity Manager (MIM) 2016 |![GALSync with FIM 2010 or MIM 2016](./media/plan-connect-topologies/LegendSync3.png) |
| Azure AD Connect sync server, detailed |![Azure AD Connect sync server, detailed](./media/plan-connect-topologies/LegendSync4.png) |
| Azure AD |![Azure Active Directory](./media/plan-connect-topologies/LegendAAD.png) |
| Unsupported scenario |![Unsupported scenario](./media/plan-connect-topologies/LegendUnsupported.png) |


> [!IMPORTANT]
> Microsoft doesn't support modifying or operating Azure AD Connect sync outside of the configurations or actions that are formally documented. Any of these configurations or actions might result in an inconsistent or unsupported state of Azure AD Connect sync. As a result, Microsoft can't provide technical support for such deployments.


## Single forest, single Azure AD tenant
![Topology for a single forest and a single tenant](./media/plan-connect-topologies/SingleForestSingleDirectory.png)

The most common topology is a single on-premises forest, with one or multiple domains, and a single Azure AD tenant. For Azure AD authentication, password hash synchronization is used. The express installation of Azure AD Connect supports only this topology.

### Single forest, multiple sync servers to one Azure AD tenant
![Unsupported, filtered topology for a single forest](./media/plan-connect-topologies/SingleForestFilteredUnsupported.png)

Having multiple Azure AD Connect sync servers connected to the same Azure AD tenant is not supported, except for a [staging server](#staging-server). It's unsupported even if these servers are configured to synchronize with a mutually exclusive set of objects. You might have considered this topology if you can't reach all domains in the forest from a single server, or if you want to distribute load across several servers.

## Multiple forests, single Azure AD tenant
![Topology for multiple forests and a single tenant](./media/plan-connect-topologies/MultiForestSingleDirectory.png)

Many organizations have environments with multiple on-premises Active Directory forests. There are various reasons for having more than one on-premises Active Directory forest. Typical examples are designs with account-resource forests and the result of a merger or acquisition.

When you have multiple forests, all forests must be reachable by a single Azure AD Connect sync server. You don't have to join the server to a domain. If necessary to reach all forests, you can place the server in a perimeter network (also known as DMZ, demilitarized zone, and screened subnet).

The Azure AD Connect installation wizard offers several options to consolidate users who are represented in multiple forests. The goal is that a user is represented only once in Azure AD. There are some common topologies that you can configure in the custom installation path in the installation wizard. On the **Uniquely identifying your users** page, select the corresponding option that represents your topology. The consolidation is configured only for users. Duplicated groups are not consolidated with the default configuration.

Common topologies are discussed in the sections about separate topologies, [full mesh](#multiple-forests-full-mesh-with-optional-galsync), and [the account-resource topology](#multiple-forests-account-resource-forest).

The default configuration in Azure AD Connect sync assumes:

* Each user has only one enabled account, and the forest where this account is located is used to authenticate the user. This assumption is for password hash sync, pass-through authentication and federation. UserPrincipalName and sourceAnchor/immutableID come from this forest.
* Each user has only one mailbox.
* The forest that hosts the mailbox for a user has the best data quality for attributes visible in the Exchange Global Address List (GAL). If there's no mailbox for the user, any forest can be used to contribute these attribute values.
* If you have a linked mailbox, there's also an account in a different forest used for sign-in.

If your environment does not match these assumptions, the following things happen:

* If you have more than one active account or more than one mailbox, the sync engine picks one and ignores the other.
* A linked mailbox with no other active account is not exported to Azure AD. The user account is not represented as a member in any group. A linked mailbox in DirSync is always represented as a normal mailbox. This change is intentionally a different behavior to better support multiple-forest scenarios.

You can find more details in [Understanding the default configuration](concept-azure-ad-connect-sync-default-configuration.md).

### Multiple forests, multiple sync servers to one Azure AD tenant
![Unsupported topology for multiple forests and multiple sync servers](./media/plan-connect-topologies/MultiForestMultiSyncUnsupported.png)

Having more than one Azure AD Connect sync server connected to a single Azure AD tenant is not supported. The exception is the use of a [staging server](#staging-server).

This topology differs from the one below in that **multiple sync servers** connected to a single Azure AD tenant is not supported.

### Multiple forests, single sync server, users are represented in only one directory
![Option for representing users only once across all directories](./media/plan-connect-topologies/MultiForestUsersOnce.png)

![Depiction of multiple forests and separate topologies](./media/plan-connect-topologies/MultiForestSeparateTopologies.png)

In this environment, all on-premises forests are treated as separate entities. No user is present in any other forest. Each forest has its own Exchange organization, and there's no GALSync between the forests. This topology might be the situation after a merger/acquisition or in an organization where each business unit operates independently. These forests are in the same organization in Azure AD and appear with a unified GAL. In the preceding picture, each object in every forest is represented once in the metaverse and aggregated in the target Azure AD tenant.

### Multiple forests: match users
Common to all these scenarios is that distribution and security groups can contain a mix of users, contacts, and Foreign Security Principals (FSPs). FSPs are used in Active Directory Domain Services (AD DS) to represent members from other forests in a security group. All FSPs are resolved to the real object in Azure AD.

### Multiple forests: full mesh with optional GALSync
![Option for using the mail attribute for matching when user identities exist across multiple directories](./media/plan-connect-topologies/MultiForestUsersMail.png)

![Full mesh topology for multiple forests](./media/plan-connect-topologies/MultiForestFullMesh.png)

A full mesh topology allows users and resources to be located in any forest. Commonly, there are two-way trusts between the forests.

If Exchange is present in more than one forest, there might be (optionally) an on-premises GALSync solution. Every user is then represented as a contact in all other forests. GALSync is commonly implemented through FIM 2010 or MIM 2016. Azure AD Connect cannot be used for on-premises GALSync.

In this scenario, identity objects are joined via the mail attribute. A user who has a mailbox in one forest is joined with the contacts in the other forests.

### Multiple forests: account-resource forest
![Option for using the ObjectSID and msExchMasterAccountSID attributes for matching when identities exist across multiple directories](./media/plan-connect-topologies/MultiForestUsersObjectSID.png)

![Account-resource forest topology for multiple forests](./media/plan-connect-topologies/MultiForestAccountResource.png)

In an account-resource forest topology, you have one or more *account* forests with active user accounts. You also have one or more *resource* forests with disabled accounts.

In this scenario, one (or more) resource forest trusts all account forests. The resource forest typically has an extended Active Directory schema with Exchange and Lync. All Exchange and Lync services, along with other shared services, are located in this forest. Users have a disabled user account in this forest, and the mailbox is linked to the account forest.

## Office 365 and topology considerations
Some Office 365 workloads have certain restrictions on supported topologies:

| Workload | Restrictions |
| --------- | --------- |
| Exchange Online | For more information about hybrid topologies supported by Exchange Online, see [Hybrid deployments with multiple Active Directory forests](https://technet.microsoft.com/library/jj873754.aspx). |
| Skype for Business | When you're using multiple on-premises forests, only the account-resource forest topology is supported. For more information, see [Environmental requirements for Skype for Business Server 2015](https://technet.microsoft.com/library/dn933910.aspx). |

If you are a larger organization, then you should consider to use the [Office 365 PreferredDataLocation](how-to-connect-sync-feature-preferreddatalocation.md) feature. It allows you to define in which datacenter region the user's resources are located.

## Staging server
![Staging server in a topology](./media/plan-connect-topologies/MultiForestStaging.png)

Azure AD Connect supports installing a second server in *staging mode*. A server in this mode reads data from all connected directories but does not write anything to connected directories. It uses the normal synchronization cycle and therefore has an updated copy of the identity data.

In a disaster where the primary server fails, you can fail over to the staging server. You do this in the Azure AD Connect wizard. This second server can be located in a different datacenter because no infrastructure is shared with the primary server. You must manually copy any configuration change made on the primary server to the second server.

You can use a staging server to test a new custom configuration and the effect that it has on your data. You can preview the changes and adjust the configuration. When you're happy with the new configuration, you can make the staging server the active server and set the old active server to staging mode.

You can also use this method to replace the active sync server. Prepare the new server and set it to staging mode. Make sure it's in a good state, disable staging mode (making it active), and shut down the currently active server.

It's possible to have more than one staging server when you want to have multiple backups in different datacenters.

## Multiple Azure AD tenants
We recommend having a single tenant in Azure AD for an organization.
Before you plan to use multiple Azure AD tenants, see the article [Administrative units management in Azure AD](../users-groups-roles/directory-administrative-units.md). It covers common scenarios where you can use a single tenant.

![Topology for multiple forests and multiple tenants](./media/plan-connect-topologies/MultiForestMultiDirectory.png)

There's a 1:1 relationship between an Azure AD Connect sync server and an Azure AD tenant. For each Azure AD tenant, you need one Azure AD Connect sync server installation. The Azure AD tenant instances are isolated by design. That is, users in one tenant can't see users in the other tenant. If you want this separation, this is a supported configuration. Otherwise, you should use the single Azure AD tenant model.

### Each object only once in an Azure AD tenant
![Filtered topology for a single forest](./media/plan-connect-topologies/SingleForestFiltered.png)

In this topology, one Azure AD Connect sync server is connected to each Azure AD tenant. The Azure AD Connect sync servers must be configured for filtering so that each has a mutually exclusive set of objects to operate on. You can, for example, scope each server to a particular domain or organizational unit.

A DNS domain can be registered in only a single Azure AD tenant. The UPNs of the users in the on-premises Active Directory instance must also use separate namespaces. For example, in the preceding picture, three separate UPN suffixes are registered in the on-premises Active Directory instance: contoso.com, fabrikam.com, and wingtiptoys.com. The users in each on-premises Active Directory domain use a different namespace.

>[!NOTE]
>Global Address List Synchronization (GalSync) is not done automatically in this topology and requires an additional custom MIM implementation to ensure each tenant has a complete Global Address List (GAL) in Exchange Online and Skype for Business Online.


This topology has the following restrictions on otherwise supported scenarios:

* Only one of the Azure AD tenants can enable an Exchange hybrid with the on-premises Active Directory instance.
* Windows 10 devices can be associated with only one Azure AD tenant.
* The single sign-on (SSO) option for password hash synchronization and pass-through authentication can be used with only one Azure AD tenant.

The requirement for a mutually exclusive set of objects also applies to writeback. Some writeback features are not supported with this topology because they assume a single on-premises configuration. These features include:

* Group writeback with default configuration.
* Device writeback.

### Each object multiple times in an Azure AD tenant
![Unsupported topology for a single forest and multiple tenants](./media/plan-connect-topologies/SingleForestMultiDirectoryUnsupported.png) ![Unsupported topology for a single forest and multiple connectors](./media/plan-connect-topologies/SingleForestMultiConnectorsUnsupported.png)

These tasks are unsupported:

* Sync the same user to multiple Azure AD tenants.
* Make a configuration change so that users in one Azure AD tenant appear as contacts in another Azure AD tenant.
* Modify Azure AD Connect sync to connect to multiple Azure AD tenants.

### GALSync by using writeback
![Unsupported topology for multiple forests and multiple directories, with GALSync focusing on Azure AD](./media/plan-connect-topologies/MultiForestMultiDirectoryGALSync1Unsupported.png) ![Unsupported topology for multiple forests and multiple directories, with GALSync focusing on on-premises Active Directory](./media/plan-connect-topologies/MultiForestMultiDirectoryGALSync2Unsupported.png)

Azure AD tenants are isolated by design. These tasks are unsupported:

* Change the configuration of Azure AD Connect sync to read data from another Azure AD tenant.
* Export users as contacts to another on-premises Active Directory instance by using Azure AD Connect sync.

### GALSync with on-premises sync server
![GALSync in a topology for multiple forests and multiple directories](./media/plan-connect-topologies/MultiForestMultiDirectoryGALSync.png)

You can use FIM 2010 or MIM 2016 on-premises to sync users (via GALSync) between two Exchange organizations. The users in one organization appear as foreign users/contacts in the other organization. These different on-premises Active Directory instances can then be synchronized with their own Azure AD tenants.

## Next steps
To learn how to install Azure AD Connect for these scenarios, see [Custom installation of Azure AD Connect](how-to-connect-install-custom.md).

Learn more about the [Azure AD Connect sync](how-to-connect-sync-whatis.md) configuration.

Learn more about [integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
