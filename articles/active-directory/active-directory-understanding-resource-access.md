<properties
    pageTitle="Understanding resource access in Azure | Microsoft Azure" 
    description="This topic explains concepts about using subscription administrators to control resource access in the full Azure portal."
    services="active-directory"
    documentationCenter=""
    authors="markusvi"
    manager="femila"
    editor=""/>

<tags
    ms.service="active-directory"
    ms.workload="identity"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="07/20/2016"
    ms.author="markusvi"/>


# Understanding resource access in Azure


> [AZURE.NOTE] This topic explains concepts about using subscription administrators to control resource access in the full Azure portal. As an alternative, the Azure Preview portal provides [role-based access control](role-based-access-control-configure.md) so Azure resources can be managed more precisely.

In October 2013, the Azure classic portal and Service Management APIs were integrated with Azure Active Directory in order to lay the groundwork for improving the user experience for managing access to Azure resources. Azure Active Directory already provides great capabilities such as user management, on-premises directory sync, multi-factor authentication, and application access control. Naturally, these should also be made available for managing Azure resources across-the-board.

Access control in Azure starts from a billing perspective. The owner of an Azure account, accessed by visiting the  [Azure Accounts Center](https://account.windowsazure.com/subscriptions), is the Account Administrator (AA). Subscriptions are a container for billing, but they also act as a security boundary: each subscription has a Service Administrator (SA) who can add, remove, and modify Azure resources in that subscription by using the [Azure classic portal](https://manage.windowsazure.com/). The default SA of a new subscription is the AA, but the AA can change the SA in the Azure Accounts Center.

<br><br>![Azure Accounts][1]

Subscriptions also have an association with a directory. The directory defines a set of users. These can be users from the work or school that created the directory or they can be external users (that is, Microsoft Accounts). Subscriptions are accessible by a subset of those directory users who have been assigned as either Service Administrator (SA) or Co-Administrator (CA); the only exception is that, for legacy reasons, Microsoft Accounts (formerly Windows Live ID) can be assigned as SA or CA without being present in the directory.

<br><br>![Access Control in Azure][2]


Functionality within the Azure classic portal enables SAs that are signed in using a Microsoft Account to change the directory that a subscription is associated with by using the **Edit Directory** command on the **Subscriptions** page in **Settings**. Note that this operation has implications on the access control of that subscription.



> [AZURE.NOTE] The **Edit Directory** command in the Azure classic portal is not available to users who are signed in using a work or school account because those accounts can sign in only to the directory to which they belong.

<br><br>![Simple User Login Flow][3]

In the simple case, an organization (such as Contoso) will enforce billing and access control across the same set of subscriptions. That is, the directory is associated to subscriptions that are owned by a single Azure Account. Upon successful login to the Azure classic portal, users see two collections of resources (depicted in orange in the previous illustration):


- Directories where their user account exists (sourced or added as a foreign principal). Note that the directory used for login isn’t relevant to this computation, so your directories will always be shown regardless of where you logged in.

- Resources that are part of subscriptions that are associated with the directory used for login AND which the user can access (where they are an SA or CA).


<br><br>![User with Multiple Subscriptions and Directories][4]


Users with subscriptions across multiple directories have the ability to switch the current context of the Azure classic portal by using the subscription filter. Under the covers, this results in a separate login to a different directory, but this is accomplished seamlessly using single sign-on (SSO).

Operations such as moving resources between subscriptions can be more difficult as a result of this single directory view of subscriptions. To perform the resource transfer, it may be necessary to first use the **Edit Directory** command on the Subscriptions page in **Settings** to associate the subscriptions to the same directory.

## Next Steps

- To learn more about how to change administrators for an Azure subscription, see [How to add or change Azure administrator roles](../billing-add-change-azure-subscription-administrator.md)

- For more information on how Azure Active Directory relates to your Azure subscription, see [How Azure subscriptions are associated with Azure Active Directory](active-directory-how-subscriptions-associated-directory.md)

- For more information on how to assign roles in Azure AD, see [Assigning administrator roles in Azure Active Directory](active-directory-assign-admin-roles.md)



<!--Image references-->
[1]: ./media/active-directory-understanding-resource-access/IC707931.png
[2]: ./media/active-directory-understanding-resource-access/IC707932.png
[3]: ./media/active-directory-understanding-resource-access/IC707933.png
[4]: ./media/active-directory-understanding-resource-access/IC707934.png
