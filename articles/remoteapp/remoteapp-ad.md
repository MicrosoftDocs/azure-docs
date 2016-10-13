
<properties 
    pageTitle="Azure AD + Active Directory requirements for Azure RemoteApp | Microsoft Azure" 
    description="Learn how to set up Active Directory to work with Azure RemoteApp." 
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



# Azure AD + Active Directory requirements for Azure RemoteApp

> [AZURE.IMPORTANT]
> Azure RemoteApp is being discontinued. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.


For your Azure RemoteApp hybrid collection or for a cloud collection that you want to federate using AD Connect, you need to do the following.

### Connect Azure AD and Active Directory

If you want to connect your Azure AD tenant and your on-premises Active Directory environments, use AD Connect. It will take you only [4 clicks](https://blogs.technet.microsoft.com/enterprisemobility/2014/08/04/connecting-ad-and-azure-ad-only-4-clicks-with-azure-ad-connect/) to connect the two directories.

Note - Directory synchronization is required for hybrid collections.

### Make sure your "@domain.com" match
Before you get started, make sure that the UPN for your on-premises forest matches the suffix of your Azure AD domain. 

After you set up the UPN domain suffix in Azure AD, all users logging into Azure RemoteApp will log in as “user@<the suffix you set up>”. Make sure that users can also log in with the same user@suffix into the on-premises domain. In certain cases you can set up one domain name in Azure AD while specifying a different domain suffix for the user on-prem. In this case, your users won't be able to connect to any domain-joined computers or resources through Azure RemoteApp.

For example, if you set up your UPN domain suffix in AAD as contoso.com, but some users on premises/AD are configured to log in with @contoso.uk, then those users will not be able to correctly log into the ARA collection. Users UPN in AAD and AD must be the same for the login to be possible”

### Create objects for Azure RemoteApp
You also need to create the following on-premises Active Directory objects:

- A service account to provide access to domain resources for RemoteApp programs by joining RDSH end points to the on-premises domain.
- An Organizational Unit (OU) to contain RemoteApp machine objects. Use of the OU is recommended (but not required) to isolate the accounts and policies you will use with RemoteApp.

You need both of these objects when you create your RemoteApp collection, so be sure to do these steps first.