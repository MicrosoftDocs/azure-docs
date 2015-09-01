<properties
	pageTitle="Azure AD Connect Sync: Multi-forest Scenario Overview"
    description="The objective of this topic is to cover some common scenarios and how they are represented in the sync service of Azure AD Connect Sync."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="swadhwa"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/27/2015"
	ms.author="markusvi"/>


# Azure AD Connect Sync: Multi-forest Scenario Overview

Many organizations have environments that include multiple on-premises Active Directory forests. There are various reasons for having more than one on-premises Active Directory forest deployed. Typical examples are designs with account-resource forests, merger and acquisitions related forests or forests used to outsource data.

Microsoft provides you with DirSync a solution for single-forest scenarios and with FIM a solution for multi-forest scenarios. 
However, configuring FIM can be challenging and it can consume a considerable amount of time.

With Azure AD Connect Sync, you can significantly simplify the configuration and makes it more predictive.

In the default configuration delivered by Azure AD Connect Sync, the following assumptions are made:

1. Users have only one enabled account and the forest where this account is located is used to federate the user.
2. Users have only one mailbox.
3. The forest that hosts a user’s mailbox has the best data quality for attributes visible in the Exchange Global Address List (GAL). If there is no mailbox on the user, then any forest can be used to contribute these attribute values.


The objective of this topic is to cover some common scenarios and how they are represented in the sync service of Azure AD Connect Sync:

1. Separate Technologies 
2. Full mesh with optional GALSync 
3. Account-Resource Forest 


## Separate Technologies

In this environment, all forests on-premises are treated as separate entities and no user would be present in any other forest.<br>
Each forest has its own Exchange organization and there is no GALSync between the forests.This could be the situation after a merger/acquisition or in an organization where each business unit is operating isolated from each other.

![Separate Technologies][1]

In this picture, each object in each forest will be represented once in the metaverse and aggregated in the target Azure AD directory. 
This would be the same end-result as having one DirSync server connected to each source AD forest.
 




## Full mesh with optional GALSync

A fully mesh topology allows users and resources to be located in any forest and commonly there would be two-way trusts between the forests.

If Exchange is present in more than one forest, there could optionally be a GALSync solution representing a user in one forest as a contact in each other forest.

In this scenario, identity objects are typically joined using the mail attribute. As a consequence of this, a user with a mailbox in one forest is joined with the contacts in the other forests. Distribution and security groups can be found in each forest and can contain a mix of users, contacts, and FSPs (Foreign Security Principals). 

The following picture outlines this scenario.

![Full mesh with optional GALSync][2]


## Account-Resource Forest
In an account-resource forest topology, you have one or more account forests with active user accounts.<br>
This scenario includes one forest that trusts all account forests. This forest has typically an extended AD schema with Exchange and Lync. All Exchange and Lync services as well as other shared services are located in this forest.Users have a disabled user account in this forest and the mailbox is linked to the account forest.

The picture below outlines this scenario with just one account.

![Account-Resource Forest][3]


## Additional Resources

* [Azure AD Connect Sync: Customizing Synchronization options](active-directory-aadconnectsync-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)

 
<!--Image references-->
[1]: ./media/active-directory-aadsync-scenario-overview/ic750599.png
[2]: ./media/active-directory-aadsync-scenario-overview/ic750600.png
[3]: ./media/active-directory-aadsync-scenario-overview/ic750601.png