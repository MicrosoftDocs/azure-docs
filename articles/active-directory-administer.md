<properties 
	pageTitle="Administer your Azure AD directory" 
	description="A topic that explains what an Azure AD tenant is, and how to manage an Azure AD directory." 
	services="active-directory" 
	documentationCenter="" 
	authors="Justinha" 
	writer="Justinha" 
	manager="TerryLan" 
	editor="LisaToft"/>

<tags 
	ms.service="active-directory" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/05/2015" 
	ms.author="Justinha"/>

# Administer your Azure AD directory

## What is an Azure AD tenant?

In the physical workplace, the word tenant can be defined as a group or company that occupies a building. For instance, your organization may own office space in a building. This building may be on a street with several other organizations. Your organization would be considered a tenant of that building. This building is an asset of your organization and provides security and ensures that you can conduct business safely. It also is separated from the other businesses on your street. This ensures that your organization and the assets therein are isolated from other organizations. 

In the cloud-enabled workplace, a tenant can be defined as a client or organization that owns and manages a specific instance of that cloud service. With the identity platform provided by Microsoft Azure, a tenant is simply a dedicated instance of Azure Active Directory (Azure AD) that your organization receives and owns when it signs up for a Microsoft cloud service such as Azure or Office 365.

Each Azure AD directory is distinct and separate from other Azure AD directories. Just like a corporate office building is a secure asset specific to only your organization, an Azure AD directory was also designed to be a secure asset for use by only your organization. The Azure AD architecture isolates customer data and identity information from co-mingling. This means that users and administrators of one Azure AD directory cannot accidentally or maliciously access data in another directory.

![][1]

## How can I get an Azure AD directory?

Azure AD provides the core directory and identity management capabilities behind most of Microsoft’s cloud services, including:

- Azure
- Microsoft Office 365
- Microsoft Dynamics CRM Online
- Microsoft Intune

You will get an Azure AD directory when you sign up for any of these Microsoft cloud services. You can create additional directories as needed. For example, you might maintain your first directory as a production directory and then create another directory for testing or staging. 

> [AZURE.NOTE]
> After you sign up for your first service, we recommend that you use the same administrator account associated with your organization when you sign up for other Microsoft cloud services.

The first time you sign up for a Microsoft cloud service, you are prompted to provide details about your organization and your organization’s Internet domain name registration. This information is then used to create a new Azure AD directory instance for your organization. That same directory is used to authenticate sign in attempts when you subscribe to multiple Microsoft cloud services.

The additional services fully leverage any existing user accounts, policies, settings or on-premises directory integration you configure to help improve efficiency between your organization’s identity infrastructure on-premises and Azure AD.

For example, if you originally signed up for a Microsoft Intune subscription and completed the steps necessary to further integrate your on-premises Active Directory with your Azure AD directory by deploying directory synchronization and/or single sign-on servers, you can sign up for another Microsoft cloud service such as Office 365 which can also leverage the same directory integration benefits you now use with Microsoft Intune.

For more information about integrating your on-premises directory with Azure AD, see [Directory integration](active-directory-aadconnect.md).

### Associate an Azure AD directory with a new Azure subscription

You can associate a new Azure subscription with the same directory that authenticates sign in for an existing Office 365 or Microsoft Intune subscription. Sign in to the Azure Management Portal using your work or school account. The Management Portal returns a message that it was unable to find any subscriptions for that account. Select **Sign Up For Azure**, and your directory will be available for administration within the portal. For more information, see [Manage the directory for your Office 365 subscription in Azure](active-directory-how-subscriptions-associated-directory.md#manage-the-directory-for-your-office-365-subscription-in-azure).

For a video about common usage questions for Azure AD, see [Azure Active Directory - Common Sign-up, sign-in and usage questions](http://channel9.msdn.com/Series/Windows-Azure-Active-Directory/WAADCommonSignupsigninquestions).

### Create an Azure AD directory by signing up for a Microsoft cloud service as an organization

If you don’t yet have a subscription to a Microsoft cloud service, use one of the links below to sign up. The act of signing up for your first service will create an Azure AD directory automatically.

- [Microsoft Azure](https://account.windowsazure.com/organization)
- [Office 365](http://products.office.com/business/compare-office-365-for-business-plans/)
- [Microsoft Intune](https://account.manage.microsoft.com/Signup/MainSignUp.aspx?OfferId=40BE278A-DFD1-470a-9EF7-9F2596EA7FF9&ali=1)

### Manage an Azure-provisioned Default directory

Today, a directory is automatically created when you sign up for Azure and your subscription is associated with that directory. But if you originally signed up for Azure before October 2013, a directory was not automatically created. In that case, Azure may have “backfilled” for your account by provisioning a Default directory for it. Your subscription was then associated with that Default directory.

Backfilling of directories was done in October 2013 as part of an overall improvement to the security model for Azure. It helps offer organizational identity features to all Azure customers and ensures that all Azure resources are accessed in the context of a user in directory. You cannot use Azure without a directory. To achieve that, any user who was signed up prior to July 7, 2013 but did not have a directory had to have one created. If you had already created a directory, then your subscription was associated with that directory. 

There are no costs for using Azure AD. The directory is a free resource. There is an additional Azure Active Directory Premium tier that is licensed separately and provides additional features such as company branding and self-service password reset. 

To change the display name of your directory, click the directory in the portal and click **Configure**. As explained later in this topic, you can add a new directory or delete a directory that you no longer need. To associate your subscription with a different directory, click the **Settings** extension in the left navigation, and at the bottom of the **Subscriptions** page, click **Edit Directory**. You can also create a custom domain using a DNS name that you have registered instead of the default *.onmicrosoft.com domain, which may be preferable with a service such as SharePoint Online. 

## How can I manage directory data

As an administrator of one or more Microsoft cloud service subscriptions, you can either use the Azure Management Portal, the Microsoft Intune account portal, or the Office 365 Admin Center to manage your organizations directory data. You can also download and run [Microsoft Azure Active Directory Module for Windows PowerShell](https://msdn.microsoft.com/library/azure/jj151815.aspx) cmdlets to help you manage data stored in Azure AD. 

From either of these portals (or cmdlets), you can:

- Create and manage user and group accounts
- Manage related cloud service(s) your organization subscribes to
- Set up on-premises integration with your directory service

The Azure Management Portal, Office 365 Admin Center, Microsoft Intune account portal and the Azure AD cmdlets all read from and write to a single shared instance of Azure AD that is associated with your organization’s directory, as shown in the following illustration. In this way, portals (or cmdlets) act as a front-end interface that pull in and/or modify your directory data. 

![][2]

These account portals and the associated Azure AD PowerShell cmdlets used to manage users and groups are built on top of the Azure AD platform.

When you make a change to your organizations data using any of the portals (or cmdlets) while signed in under the context of one of these services, the change will also be shown in the other portals the next time you sign-in under the context of that service because this data is shared across the Microsoft cloud services you are subscribed to. 
For example, if you used the Office 365 Admin Center to block a user from signing in, that action will block the user from signing in to any other service that your organization is currently subscribed to. If you were to pull up that same user’s account under the context of the Microsoft Intune account portal you will see that the user is blocked.

## How can I add and manage multiple directories?

You can add an Azure AD directory in the Azure Management Portal. Select the **Active Directory** extension on the left and click **Add**.

You can manage each directory as a fully independent resource: each directory is a peer, fully-featured, and logically independent of other directories that you manage; there is no parent-child relationship between directories. This independence between directories includes resource independence, administrative independence, and synchronization independence. 

- **Resource independence**. If you create or delete a resource in one directory, it has no impact on any resource in another directory, with the partial exception of external users, described below. If you use a custom domain 'contoso.com' with one directory, it cannot be used with any other directory. 
- **Administrative independence**.  If a non-administrative user of directory 'Contoso', creates a test directory 'Test' then: 
    - ◦The directory sync tool, to synchronize data with a single AD forest. 
    - ◦The administrators of directory 'Contoso' have no direct administrative privileges to directory 'Test' unless an administrator of 'Test' specifically grants them these privileges. Administrators of 'Contoso' can control access to directory 'Test' by virtue of their control of the user account which created 'Test.' 

    And if you change (add or remove) an administrator role for a user in one directory, the change does not affect any administrator role that user may have in another directory. 


- **Synchronization independence**. You can configure each Azure AD independently to get data synchronized from a single instance of either: 
    - The directory sync tool, to synchronize data with a single AD forest
    - The Azure Active Directory Connector for Forefront Identity Manager, to synchronize data with one or more on-premises forests, and/or non-AD data sources. 

Also note that unlike other Azure resources, your directories are not child resources of an Azure subscription. So if you cancel or allow your Azure subscription to expire, you can still access your directory data using Azure AD PowerShell, the Azure Graph API, or other interfaces such as the Office 365 Admin Center. You can also associate another subscription with the directory.

## How can I delete an Azure AD directory?
A global administrator can delete an Azure AD directory from the portal. When a directory is deleted, all resources contained in the directory are also deleted; so you should be sure you don’t need the directory before you delete it. 

> [AZURE.NOTE]
> If the user is signed in with a work or school account, the user must not be attempting to delete his or her home directory. For example, if the user is signed in as joe@contoso.onmicrosoft.com, that user cannot delete the directory that has contoso.onmicrosoft.com as its default domain.

### Conditions that must be met to delete an Azure AD directory

Azure AD requires that certain conditions are met to delete a directory. This reduces risk that deletion of a directory would negatively impact users or applications, such as the ability of users to sign in to Office 365 or access resources in Azure. For example, if a directory for a subscription became unintentionally deleted, then users could not access the Azure resources for that subscription. 

The following conditions are checked:

- The only user in the directory is the global administrator who will delete the directory. Any other users must be deleted before the directory can be deleted. If users are synchronized from on-premises, then sync will need to be turned off, and the users must be deleted in the cloud directory by using the Management Portal or the Azure module for Windows PowerShell. There is no requirement to delete groups or contacts, such as contacts added from the Office 365 Admin Center.
- There can be no applications in the directory. Any applications must be deleted before the directory can be deleted. 
- There can be no subscriptions for any Microsoft Online Services such as Microsoft Azure, Office 365, or Azure AD Premium associated with the directory. For example, if a default directory was created for you in Azure, you cannot delete this directory if your Azure subscription still relies on this directory for authentication. Similarly, you cannot delete a directory if another user has associated a subscription with it. To associate your subscription with a different directory, sign in to the Azure Management Portal and click **Settings** in the left navigation. Then on the bottom of the **Subscriptions** page, click **Edit Directory**. For more information about Azure subscriptions, see [How Azure subscriptions are associated with Azure AD](active-directory-how-subscriptions-associated-directory.md). 

    > [AZURE.NOTE]
    > If the user is signed in with a work or school account, the user must not be attempting to delete his or her home directory. For example, if the user is signed in as joe@contoso.onmicrosoft.com, that user cannot delete the directory that has contoso.onmicrosoft.com as its default domain.

- No Multi-Factor Authentication providers can be linked to the directory.


## Additional Resources

- [Azure AD Forum](https://social.msdn.microsoft.com/Forums/home?forum=WindowsAzureAD)
- [Azure Multi-Factor Authentication Forum](https://social.msdn.microsoft.com/Forums/home?forum=windowsazureactiveauthentication)
- [Stackoverflow](http://stackoverflow.com/questions/tagged/azure)
- [Sign up for Azure as an organization](sign-up-organization.md)
- [Manage Azure AD using Windows PowerShell](https://msdn.microsoft.com/library/azure/jj151815.aspx)
- [Assigning administrator roles in Azure AD](active-directory-assign-admin-roles.md)

<!--Image references-->
[1]: ./media/active-directory-administer/aad_portals.png
[2]: ./media/active-directory-administer/azure_tenants.png


