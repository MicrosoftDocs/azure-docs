<properties 
	pageTitle="How Azure subscriptions are associated with Azure AD" 
	description="A topic about signing in to Microsoft Azure and related issues, such as the relationship between an Azure subscription and Azure AD." 
	services="active-directory" 
	documentationCenter="" 
	authors="Justinha" 
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

# How Azure subscriptions are associated with Azure AD

This topic covers information about signing in to Microsoft Azure and related issues, such as the relationship between an Azure subscription and Azure Active Directory (AD). 

## Accounts that you can use to sign in
Let’s start with the accounts that you can use to sign in. There are two types: a Microsoft account (formerly known as Microsoft Live ID) and a work or school account, which is an account stored in Azure AD. 

 Microsoft account  | Azure AD account
	------------- | -------------
The consumer identity system run by Microsoft | The business identity system run by Microsoft
Authentication to services that are consumer-oriented, such as Hotmail and MSN | Authentication to services that are business-oriented, such as Office 365
Consumers create their own Microsoft accounts, such when they sign up for email | Companies and organizations create and manage their own work or school accounts
Identities are created and stored in the Microsoft account system | Identities are created by using Azure or another service such as Office 365, and they are stored in an Azure AD instance assigned to the organization

Although Azure originally allowed access only by Microsoft account users, it now allows access by users from *both* systems. This was done by having all the Azure properties trust Azure AD for authentication, having Azure AD authenticate organizational users, and by creating a federation relationship where Azure AD trusts the Microsoft account consumer identity system to authenticate consumer users. As a result, Azure AD is able to authenticate “guest” Microsoft accounts as well as “native” Azure AD accounts.

For example, here a user with a Microsoft account signs in to the Azure Management Portal.

> [AZURE.NOTE]
> To sign in to the Azure Management Portal, msmith@hotmail.com must have a subscription to Azure. The account must be either a Service administrator or a co-administrator of the subscription.

![][1]

Because this Hotmail address is a consumer account, the sign in is authenticated by the Microsoft account consumer identity system. The Azure AD identity system trusts the authentication done by the Microsoft account system and will issue a token to access Azure services.

## How an Azure subscription is related to Azure AD

Every Azure subscription has a trust relationship with an Azure AD instance. This means that it trusts that directory to authenticate users, services, and devices. Multiple subscriptions can trust the same directory, but a subscription trusts only one directory. You can see which directory is trusted by your subscription under the Settings tab. You can [edit the subscription settings](https://msdn.microsoft.com/library/azure/dn584083.aspx) to change which directory it trusts. 

This trust relationship that a subscription has with a directory is unlike the relationship that a subscription has with all other resources in Azure (websites, databases, and so on), which are more like child resources of a subscription. If a subscription expires, then access to those other resources associated with the subscription also stops. But the directory remains in Azure, and you can associate another subscription with that directory and continue to manage the directory users. 

Similarly, the Azure AD extension you see in your subscription doesn’t work like the other extensions in the Azure Management Portal. Other extensions in the Management Portal are scoped to the Azure subscription. What you see in the AD extension does not vary based on subscription – it shows only directories based on the signed-in user. 

All users have a single home directory which authenticates them, but they can also be guests in other directories. In the AD extension, you will see every directory your user account is a member of. Any directory that your account is not a member of will not appear. A directory can issue tokens for work or school accounts in Azure AD or for Microsoft account users (because Azure AD is federated with the Microsoft account system).

This diagram shows a subscription for Michael Smith after he signed up by using a work account for Contoso.

![][2]

## How to manage a subscription and a directory
The administrative roles for an Azure subscription manage resources tied to the Azure subscription. These roles and the best practices for managing your subscription are covered at [Manage Accounts, Subscriptions, and Administrative Roles](https://msdn.microsoft.com/library/azure/hh531793.aspx). 

By default, you are assigned the Service Administrator role when you sign up. If others need to sign in and access services using the same subscription, you can add them as co-administrators. The Service Administrator and co-administrators can be either Microsoft accounts or work or school accounts from the directory that the Azure subscription is associated with.

Azure AD has a different set of administrative roles to manage the directory and identity-related features. For example, the global administrator of a directory can add users and groups to the directory, or require multifactor authentication for users. A user who creates a directory is assigned to the global administrator role and they can assign administrator roles to other users. 

As with subscription administrators, the Azure AD administrative roles can be either Microsoft accounts or work or school accounts. Azure AD administrative roles are also used by other services such as Office 365 and Microsoft Intune. For more information, see [Assigning administrator roles](https://msdn.microsoft.com/library/azure/dn468213.aspx). 

But the important point here is that Azure subscription admins and Azure AD directory admins are two separate concepts. Azure subscription admins can manage resources in Azure and can view the Active Directory extension in the Management Portal (because the Management Portal is an Azure resource). Directory admins can manage properties in the directory. 

A person can be in both roles but this isn’t required. A user can be assigned to the directory global administrator role but not be assigned as Service administrator or co-administrator of an Azure subscription. Without being an administrator of the subscription, this user cannot sign in to the Management Portal. But the user could perform directory administration tasks using other tools such as Azure AD PowerShell or Office 365 Admin Center.

### Why can't I manage the directory with my current user account?

Sometimes a user may try to sign in to the Management Portal using a work or school account prior to signing up for an Azure subscription. In this case, the user will receive a message that there is no subscription for that account. The message will include a link to start a free trial subscription. 

After signing up for the free trial, the user will see the directory for the organization in the Management Portal but be unable to manage it (that is, be unable to add users, or edit any existing user properties) because the user is not a directory global administrator. The subscription allows the user to use the Management Portal and see the Active Directory extension, but the additional permissions of a global administrator are needed to manage the directory.

## Using your work or school account to manage an Azure subscription that was created by using a Microsoft account

As a best practice, you should [sign up for Azure as an organization](sign-up-organization.md) and use a work or school account to manage resources in Azure. Work or school accounts are preferred because they can be centrally managed by the organization that issued them, they have more features than Microsoft accounts, and they are directly authenticated by Azure AD. The same account provides access to other Microsoft online services that are offered to businesses and organizations, such as Office 365 or Microsoft Intune. If you already have an account that you use with those other properties, you likely want to use that same account with Azure. You will also already have an Active Directory instance backing those properties that you will want your Azure subscription to trust. 

Work or school accounts can also be managed in more ways than a Microsoft account. For example, an administrator can reset the password of an a work or school account, or require multifactor authentication for it.

In some cases, you may want a user from your organization to be able to manage resources that are associated with an Azure subscription for a consumer Microsoft account. For more information about how to transition to have different accounts manage subscriptions or directories, see [Manage the directory for your Office 365 subscription in Azure](#manage-the-directory-for-your-office-365-subscription-in-azure).


## Signing in when you used your work email for your Microsoft account

If at some point of time in the past you created a consumer Microsoft account using your work email as a user identifier, you may see a page asking you to select from either the Microsoft Azure Account system or the Microsoft Account system.

![][3]

You have user accounts with the same name, one in Azure AD and the other in the consumer Microsoft account system. You should pick the account that is associated with the Azure subscription you want to use. If you get an error saying a subscription does not exist for this user, you likely just chose the wrong option. Sign out and try again. For more information about errors that can prevent sign in, see [Troubleshooting "We were unable to find any subscriptions associated with your account" errors](https://social.msdn.microsoft.com/Forums/en-US/f952f398-f700-41a1-8729-be49599dd7e2/troubleshooting-we-were-unable-to-find-any-subscriptions-associated-with-your-account-errors-in?forum=windowsazuremanagement).

## Manage the directory for your Office 365 subscription in Azure

Let's say you signed up for Office 365 before you sign up for Azure. Now you want to manage the directory for the Office 365 subscription in the Management Portal. There's two ways to do this, depending on whether you have signed up for Azure or you have not.

### I do not have a subscription for Azure

In this case, just [sign up for Azure](sign-up-organization.md) using the same work or school account that you use to sign in to Office 365. Relevant information from the Office 365 account will be prepopulated in the Azure sign-up form. Your account will be assigned to the Service Administrator role of the subscription.  

### I do have a subscription for Azure using my Microsoft account

If you signed up for Office 365 using a work or school account and then signed up for Azure using a Microsoft account, then you have two directories: one for your work or school and a Default directory that was created when you signed for Azure. 

To manage both of the directories in the Management Portal, complete these steps.

> [AZURE.NOTE]
> These steps can only be completed while a user is signed in with a Microsoft account. If the user is signed in with a work or school account, the option **Use existing directory** is not available because a work or school account can be authenticated only by its home directory (that is, the directory where the work or school account is stored, and which is owned by the work or school). 

1. Sign in to the Management Portal using you Microsoft account.
2. Click **New** > **App services** > **Active Directory** > **Directory** > **Custom Create**.
3. Click **Use existing directory** and check **I am ready to be signed out now** and click the check mark to complete the action.
4. Sign in to the Management Portal by using and account that is global admin the work or school directory.
5. When prompted to **Use the Contoso directory with Azure?**, and click **continue**.
6. Click **Sign out now**.
7. Sign back in to the Management Portal using your Microsoft account. Both directories will appear in the Active Directory extension.


## What's next
[Sign up for Azure as an organization](sign-up-organization.md)


<!--Image references-->
[1]: ./media/active-directory-how-subscriptions-associated-directory/WAAD_PassThruAuth.png
[2]: ./media/active-directory-how-subscriptions-associated-directory/WAAD_OrgAccountSubscription.png
[3]: ./media/active-directory-how-subscriptions-associated-directory/WAAD_SignInDisambiguation.PNG

