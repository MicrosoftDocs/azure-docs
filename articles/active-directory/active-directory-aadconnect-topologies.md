<properties
    pageTitle="Azure AD Connect: Supported topologies | Microsoft Azure"
    description="This topic details supported and unsupported topologies for Azure AD Connect"
    services="active-directory"
    documentationCenter=""
    authors="AndKjell"
    manager="stevenpo"
    editor=""/>
<tags
    ms.service="active-directory"
    ms.devlang="na"
    ms.tgt_pltfrm="na"
    ms.workload="identity"
	ms.topic="get-started-article"
    ms.date="02/12/2016"
    ms.author="andkjell"/>

# Topologies for Azure AD Connect

The objective of this topic is to describe different on-premises and Azure AD topologies with Azure AD Connect sync as the key integration solution. It describes both supported and unsupported configurations.

Legend for pictures in the document:

| Description | Icon |
|-----|-----|
| On-premises Active Directory forest | ![AD](./media/active-directory-aadconnect-topologies/LegendAD1.png)|
| Active Directory with filtered import | ![AD](./media/active-directory-aadconnect-topologies/LegendAD2.png)|
| Azure AD Connect sync server | ![Sync](./media/active-directory-aadconnect-topologies/LegendSync1.png)|
|  Azure AD Connect sync server “Staging mode” | ![Sync](./media/active-directory-aadconnect-topologies/LegendSync2.png)|
| GALSync with FIM2010 or MIM2016 | ![Sync](./media/active-directory-aadconnect-topologies/LegendSync3.png)|
| Azure AD Connect sync server, detailed |![Sync](./media/active-directory-aadconnect-topologies/LegendSync4.png)|
| Azure AD directory |![AAD](./media/active-directory-aadconnect-topologies/LegendAAD.png)|
| Unsupported scenario | ![Unsupported](./media/active-directory-aadconnect-topologies/LegendUnsupported.png)



## Single forest, single Azure AD directory
![SingleForestSingleDirectory](./media/active-directory-aadconnect-topologies/SingleForestSingleDirectory.png)

The most common topology is a single forest on-premises, with one or multiple domains, and a single Azure AD directory (a.k.a. tenant). Azure AD authentication is done with password synchronization. This is the topology supported by the express installation of Azure AD Connect.

### Single forest, multiple sync servers to one Azure AD directory
![SingleForestFilteredUnsupported](./media/active-directory-aadconnect-topologies/SingleForestFilteredUnsupported.png)

It is not supported to have multiple Azure AD Connect sync servers connecting to the same Azure AD directory even if they are configured to synchronize mutually exclusive set of objects (with the exception of a [staging server](#staging-server)). This could be attempted because one domain in a forest is not reachable from a common network location or in an attempt to distribute the sync load across several servers.

## Multiple forests, single Azure AD directory
![MultiForestSingleDirectory](./media/active-directory-aadconnect-topologies/MultiForestSingleDirectory.png)

Many organizations have environments that include multiple on-premises Active Directory forests. There are various reasons for having more than one on-premises Active Directory forest deployed. Typical examples are designs with account-resource forests, merger and acquisitions related forests or forests used to outsource data.

When you have multiple forests all forests must be reachable by single Azure AD Connect sync server. The server does not have to be joined to a domain and can be placed in a network DMZ if required to be able to reach all forests.

The Azure AD Connect wizard will offer several options for how to consolidate users so even if the same user is represented multiple times in different forests, the user will be represented only once in Azure AD. There are some common topologies described below. You configure which topology you have by using the custom installation path in the installation wizard and select the corresponding option on the page “Uniquely identifying your users”. The consolidation is only happening for users. If groups are duplicated, these are not consolidated with the default configuration.

Common topologies are discussed in the next section: [Separate topologies](#multiple-forests-separate-topologies), [Full mesh](#multiple-forests-full-mesh-with-optional-galsync), and [Account-Resource](#multiple-forests-account-resource-forest).

In the default configuration delivered by Azure AD Connect sync, the following assumptions are made:

1.	Users have only one enabled account and the forest where this account is located is used to authenticate the user. This is for both password sync and for federation; userPrincipalName and sourceAnchor/immutableID will come from this forest.
2.	Users have only one mailbox.
3.	The forest that hosts a user’s mailbox has the best data quality for attributes visible in the Exchange Global Address List (GAL). If there is no mailbox on the user, then any forest can be used to contribute these attribute values.
4.	If you have a linked mailbox, then there is also another account in different forest used for login.

If your environment does not match these assumptions, the following will happen:

-	If you have more than one active account or more than one mailbox, the sync engine will pick one and ignore the other.
-	If you have linked mailboxes but no other account, these accounts will not be exported to Azure AD and the user will not be a member of any groups. In DirSync a linked mailbox would be represented as a normal mailbox so this is intentionally a different behavior to better support multi forest scenarios.

### Multiple forests, multiple sync servers to one Azure AD directory
![MultiForestMultiSyncUnsupported](./media/active-directory-aadconnect-topologies/MultiForestMultiSyncUnsupported.png)

It is not supported to have more than one Azure AD Connect Sync server connected to a single Azure AD directory (with the exception of a [staging server](#staging-server)).

### Multiple forests – separate topologies
“Users are represented only once across all directories”

![MultiForestUsersOnce](./media/active-directory-aadconnect-topologies/MultiForestUsersOnce.png)

![MultiForestSeperateTopologies](./media/active-directory-aadconnect-topologies/MultiForestSeperateTopologies.png)

In this environment, all forests on-premises are treated as separate entities and no user would be present in any other forest.
Each forest has its own Exchange organization and there is no GALSync between the forests. This could be the situation after a merger/acquisition or in an organization where each business unit is operating isolated from each other. In Azure AD these forests will be in the same organization and appear with a unified GAL.
In this picture, each object in every forest will be represented once in the metaverse and aggregated in the target Azure AD directory.

### Multiple forests – match users
Common for all multi-forest scenarios where you select one of the options under “User identities exist across multiple directories” is that distribution and security groups can be found in every forest and can contain a mix of users, contacts, and FSPs (Foreign Security Principals).

FSPs are used in ADDS to represent members from other forests in a security group. The sync engine will resolve the FSP to the real user and represent the security group in Azure AD with all FSPs resolved to the real object.

### Multiple forests – full mesh with optional GALSync
“User identities exist across multiple directories. Match using: Mail attribute”

![MultiForestUsersMail](./media/active-directory-aadconnect-topologies/MultiForestUsersMail.png)

![MultiForestFullMesh](./media/active-directory-aadconnect-topologies/MultiForestFullMesh.png)

A full mesh topology allows users and resources to be located in any forest and commonly there would be two-way trusts between the forests.

If Exchange is present in more than one forest, there could optionally be an on-premises GALSync solution representing a user in one forest as a contact in every other forest. GALSync is commonly implemented using Forefront Identity Manager 2010 or Microsoft Identity Manager 2016. Azure AD Connect cannot be used for on-premises GALSync.

In this scenario, identity objects are joined using the mail attribute. As a consequence of this, a user with a mailbox in one forest is joined with the contacts in the other forests.

### Multiple Forests – Account-Resource Forest
“User identities exist across multiple directories. Match using: ObjectSID and msExchMasterAccountSID attributes”

![MultiForestUsersObjectSID](./media/active-directory-aadconnect-topologies/MultiForestUsersObjectSID.png)

![MultiForestAccountResource](./media/active-directory-aadconnect-topologies/MultiForestAccountResource.png)

In an account-resource forest topology, you have one or more account forests with active user accounts.

This scenario includes one forest that trusts all account forests. This forest has typically an extended AD schema with Exchange and Lync. All Exchange and Lync services as well as other shared services are located in this forest. Users have a disabled user account in this forest and the mailbox is linked to the account forest.

## Office 365 and topology considerations
Some Office 365 workloads have certain restrictions to supported topologies. If you plan to use any of these, please refer to each workload’s supported topologies pages.

| Workload |  |
| --------- | --------- |
| Exchange Online |	If there is more than one Exchange organization on-premises (i.e. Exchange has been deployed to more than one forest) then you must use Exchange 2013 SP1 or later. Details can be found here: [Hybrid deployments with multiple Active Directory forests](https://technet.microsoft.com/en-us/library/jj873754.aspx) |
| Skype for Business | When using multiple forests on-premises then only the account-resource forest topology is supported. Details for supported topologies can be found here: [Environmental requirements for Skype for Business Server 2015](https://technet.microsoft.com/en-us/library/dn933910.aspx) |

## Staging server
![StagingServer](./media/active-directory-aadconnect-topologies/MultiForestStaging.png)

Azure AD Connect supports installing a second server in “Staging mode”. A server in this mode will only read data from all connected directories and will therefore have an updated copy of the identity data. In case of a disaster where the primary server fails, it is easy to manually fail over to the second server using the Azure AD Connect wizard. This second server can preferably be located in a different datacenter since no infrastructure is shared with the primary server. Any configuration change made on the primary server must be copied to the second server by you.

A staging server can also be used if you want to test a new custom configuration and the effect it will have on your data. You can preview the changes and adjust the configuration. When you are happy with the new configuration you can make the staging server the active server and set the old active server in staging mode.

This method can also be used if you want to replace the sync server and want to prepare the new one before you shut down the currently active server.

It is possible to have more than one staging server if you want to have multiple backups in different data centers.

## Multiple Azure AD directories
Microsoft recommends to have a single directory in Azure AD for an organization.
Before you plan to use multiple Azure AD directories these topics cover common scenarios which will allow you to use a single directory.

| Topic |  |
| --------- | --------- |
| Delegation using administrative units | [Administrative units management in Azure AD ](active-directory-administrative-units-management.md)

![MultiForestMultiDirectory](./media/active-directory-aadconnect-topologies/MultiForestMultiDirectory.png)

There is a 1:1 relationship between an Azure AD Connect sync server and an Azure AD directory. For each Azure AD directory, you will need one Azure AD Connect sync server installation. The Azure AD directory instances are by design isolated and users in one will not be able to see users in the other directory. If this is intended, this is a supported configuration but otherwise you should use the Single Azure AD directory models described above.

### Each object only once in an Azure AD directory
![SingleForestFiltered](./media/active-directory-aadconnect-topologies/SingleForestFiltered.png)

In this topology one AAD Connect Sync server is connected to each Azure AD Directory. The Azure AD Connect sync servers must be configured for filtering so they each have a mutually exclusive set of objects to operate on, for example by scoping each server to a particular domain or OU. A DNS domain can only be registered in a single Azure AD directory so the UPNs of the users in the on-premises AD must use separate namespaces as well. For example, in the picture above three separate UPN suffixes are registered in the on-premises AD: contoso.com, fabrikam.com, and wingtiptoys.com. The users in each on-premises AD domain use a different namespace.

In this topology there is no “GALsync” between the Azure AD directory instances so the address book in Exchange Online and Skype for Business will only show users in the same directory.

With this topology only one of the Azure AD directories can enable Exchange hybrid with the on-premises Active Directory.

The requirement for mutually exclusive set of objects also applies to write-back. This makes some writeback features not supported with this topology since these assume a single configuration on-premises. This includes:

-	Group writeback with default configuration
-	Device writeback

### Each object multiple times in an Azure AD directory
![SingleForestMultiDirectoryUnsupported](./media/active-directory-aadconnect-topologies/SingleForestMultiDirectoryUnsupported.png) ![SingleForestMultiConnectorsUnsupported](./media/active-directory-aadconnect-topologies/SingleForestMultiConnectorsUnsupported.png)

It is unsupported to sync the same user to multiple Azure AD directories. It is also unsupported to make a configuration change to make users in one Azure AD to appear as contacts in another Azure AD directory. It is also unsupported to modify Azure AD Connect sync to connect to multiple Azure AD directories.

### GALsync by using writeback
![MultiForestMultiDirectoryGALSync1Unsupported](./media/active-directory-aadconnect-topologies/MultiForestMultiDirectoryGALSync1Unsupported.png) ![MultiForestMultiDirectoryGALSync2Unsupported](./media/active-directory-aadconnect-topologies/MultiForestMultiDirectoryGALSync2Unsupported.png)

Azure AD directories are by design isolated. It is unsupported to change the configuration of Azure AD Connect sync to read data from another Azure AD directory in an attempt to build a common and unified GAL between the directories. It is also unsupported to export users as contacts to another on-premises AD using Azure AD Connect sync.

### GALsync with on-premises sync server
![MultiForestMultiDirectoryGALSync](./media/active-directory-aadconnect-topologies/MultiForestMultiDirectoryGALSync.png)

It is supported to use FIM2010/MIM2016 on-premises to GALsync users between two Exchange orgs. The users in one org will show up as foreign users/contacts in the other org. These different on-premises ADs can then be synchronized to their own Azure AD directories.


## Next steps
To learn how to install Azure AD Connect for these scenarios, see [Custom installation of Azure AD Connect](active-directory-aadconnect-get-started-custom.md).

Learn more about the [Azure AD Connect sync](active-directory-aadconnectsync-whatis.md) configuration.

Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
