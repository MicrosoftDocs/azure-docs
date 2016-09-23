<properties 
    pageTitle="What kind of collection do you need for Azure RemoteApp? | Microsoft Azure" 
    description="Learn about the types of collections available with Azure RemoteApp." 
    services="remoteapp" 
	documentationCenter="" 
    authors="lizap" 
    manager="mbaldwin" />

<tags 
    ms.service="remoteapp" 
    ms.workload="compute" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="08/15/2016" 
    ms.author="elizapo" />



# What kind of collection do you need for Azure RemoteApp?

> [AZURE.IMPORTANT]
> Azure RemoteApp is being discontinued. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.

Azure RemoteApp lets you share apps and resources with users on any device. We do this by creating collections to hold the apps and resources, and then you share those collections with users. There are 2 different collection options, with different network and authentication options - which is right for you?

Let's walk through the different considerations and choices you need to make to get the most out of your Azure RemoteApp collection. 


## Quick differences between the collection types

|           | Cloud | Hybrid |
|-----------|-------|--------|
|Use an existing VNET| Yes| Yes|
|Requires AD-connected accounts (DirSync)| No| Yes|
|Requires domain join| No| Yes|
|Requires domain controller accessible to VNET| No| Yes|

## Cloud collections
- Quick to create - the collection is quickly provisioned, meaning your apps get to users quicker.
- Bring your own apps or share ours. You can use a custom image (built from an Azure VM) or one of the images included with your subscription.
- You don't need to configure a connection between your collection and your on-premises domain.
- But you can optionally use your own Azure VNET to provide access into your on-premises environment for data sharing or to use non-Windows authentication into resources like SQL Server (using database authentication).


Ok, how do I create one?

- Cloud only? Create with the **Quick Create** option in the portal.
- Cloud + VNET? Create using the **Create with VNET** option but do NOT choose to join a domain.

## Hybrid collections
- Provide full access to on-premises network + Azure VNET.
- Includes domain join access for apps and data. Remote applications can authentication against your on-premises Active Directory - they can then access resources in your domain.
- Enable advanced monitoring and management with existing System Center solutions and Windows Group Policies (through a custom image built on Windows Server 2012 R2)
- Support [ExpressRoute](https://azure.microsoft.com/services/expressroute/) to connect your Azure VNET to your local VNET.

Create using the **Create with VNET** option and DO choose to join a domain.

## Authentication options
Azure RemoteApp supports both Microsoft accounts and Azure Active Directory accounts, but not all collections support all methods. 

| Account type                      |                                                             | Cloud | Cloud + VNET | Hybrid |
|-----------------------------------|-------------------------------------------------------------|-------|--------------|--------|
| Microsoft Account                 |                                                             | Yes   | Yes          | No     |
| Azure Active Directory (Azure AD) |                                                             |       |              |        |
|                                   | Azure AD only                                               | Yes   | Yes          | No     |
|                                   | AD Connect with password sync                               | Yes   | Yes          | Yes    |
|                                   | AD Connect without password sync                            | Yes   | Yes          | No     |
|                                   | AD Connect with AD FS                                       | Yes   | Yes          | Yes    |
|                                   | 3rd-party Azure-supported identity providers (such as Ping) | Yes   | Yes          | Yes    |
| Multi-Factor Authentication       |                                                             | Yes   | Yes          | Yes    |



### Cloud and Cloud + VNET 
With cloud collections, you can use Microsoft accounts, Azure AD accounts, or a mix of the two. Use the accounts that work best for your users.

There are no specific requirements for using Microsoft accounts. 

If you want to use Azure AD accounts, you need to make sure that your Azure AD tenant matches the one associated with your subscription. When you created your Azure RemoteApp subscription, the Azure AD tenant you were using was automatically associated with your subscription. Any Azure AD user you give permission to needs to be that same tenant. If needed, you can [change the Azure AD tenant](remoteapp-changetenant.md) associated with your subscription.
 
### Hybrid (or cloud + Azure AD + AD)

Using Azure AD + on-premises Active Directory is a prerequisite for a hybrid collection. You need to use AD Connect to integrate the two directories. But you do have some choice when it comes to how you configure AD Connect. 

There are 2 AD Connect scenarios - using password synchronization or using AD federation. Check out the [AD Connect information](../active-directory/active-directory-aadconnect.md) to figure out which of these works best for you.

You can also use Azure AD + AD with a cloud collection. Make sure you follow the same set up steps.

Check out [Azure AD + Active Directory requirements for Azure RemoteApp](remoteapp-ad.md) for the steps required to configure Azure AD and Active Directory.

## Go create your collection!
Ok, I think we've figured it out now, so there's just one thing left to do - create your first Azure RemoteApp collection.

[Create a cloud collection](remoteapp-create-cloud-deployment.md) or [create a hybrid collection](remoteapp-create-hybrid-deployment.md) - just get creating.
