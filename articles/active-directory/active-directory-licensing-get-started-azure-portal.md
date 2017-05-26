---

  title: Get started with licensing in the Azure Active Directory | Microsoft Docs
  description: Description of Azure Active Directory licensing, how it works, how to get started, and best practices, including Office 365, Microsoft Intune, and Azure Active Directory Premium and Basic editions
  services: active-directory
  keywords: Azure AD licensing
  documentationcenter: ''
  author: curtand
  manager: femila
  editor: ''

  ms.assetid:
  ms.service: active-directory
  ms.devlang: na
  ms.topic: article
  ms.tgt_pltfrm: na
  ms.workload: identity
  ms.date: 05/05/2017
  ms.author: curtand

  ms.custom: H1Hack27Feb2017

---

# License yourself and your users in Azure Active Directory

> [!div class="op_single_selector"]
> * [Azure portal](active-directory-licensing-get-started-azure-portal.md)
> * [Azure classic portal](active-directory-licensing-what-is.md)
>
>

Azure Active Directory (Azure AD) is Microsoft's Identity as a Service (IDaaS) solution and platform. Azure AD is offered in a number of functional and technical versions ranging from Azure AD Free, which is available with any Microsoft service such as Office 365, Dynamics, Microsoft Intune and Azure (Azure AD does not generate any consumption charges in this mode), to Azure AD paid versions such as Enterprise Mobility Suite (EMS), Azure AD Premium (P1 and P2) and Azure AD Basic, as well as Azure Multi-Factor Authentication (MFA). Like many of Microsoft online services, most Azure AD paid versions are delivered through per-user entitlements as they are in Office 365, Microsoft Intune, and Azure AD. In these cases, the service purchase is represented with one or more subscriptions, and each subscription includes a pre-purchase number of licenses in your tenant. Per-user entitlements are achieved through license assignment, creating a link between the user and the product, enabling the service components for the user, and consuming one of the prepaid licenses.

[Try Azure AD premium now.](https://portal.office.com/Signup/Signup.aspx?OfferId=01824d11-5ad8-447f-8523-666b0848b381&ali=1#0)

For a broad overview of Azure AD service capabilities, see [What is
Azure AD](https://azure.microsoft.com/en-us/documentation/articles/active-directory-whatis/). For more information, see our Service Level Agreements page.

> [!NOTE]
> Azure pay as you go subscriptions are different: while also represented in your directory, these subscriptions enable creation of Azure
resources and map them to your payment method. In this case, there are NO license counts associated with the subscription. Users' association
with the subscription, the users' access to managing subscription resources, is achieved by granting them permissions to operate on Azure
resources mapped to the subscription.

## How does Azure AD licensing work?

License-based Azure AD services work by activating a subscription in your Azure AD directory/service tenant. Once the subscription is active, the service capabilities can be managed by directory/service administrators and used by licensed users.

When you purchase or activate Enterprise Mobility Suite, Azure AD Premium, or Azure AD Basic, your directory is updated with the subscription, including its validity period and prepaid licenses. Your subscription information, including the number of assigned or available licenses is available through the Azure portal under Azure Active Directory &gt; **Licenses** tile for the specific directory. This is also the best place to manage your license assignments.

Each subscription consists of one or more service plans, each mapping the included functional level of the service type; for example, Azure AD, Azure MFA, Microsoft Intune, Exchange Online, or SharePoint Online.  Azure AD license management does NOT require service-plan-level management. This is different from Office 365 which relies on this advanced configuration mode to manage access to included services. Azure AD relies on in service configuration, to enable features and manage individual permissions.

> [!IMPORTANT]
> Azure AD Premium and Basic, as well as Enterprise Mobility Suite subscriptions, are confined to their provisioned directory/tenant. Subscriptions cannot be split between directories or used to entitle users in other directories. Moving a subscription between directories is possible but requires submitting a support ticket or cancellation and re-purchase in the case of direct purchases.
>
> When purchasing Azure AD or Enterprise Mobility Suite through Volume Licensing subscription activation will happen automatically when the agreement includes other Microsoft Online services; for example, Office 365.

### Assigning licenses

While obtaining a subscription is all you need to configure paid capabilities, using your Azure AD paid features requires distributing licenses to the right individuals. In general, any user who should have access to or who is managed through an Azure AD paid feature must be
assigned a license. A license assignment is a mapping between a user and a purchased service, such as Azure AD Premium, Basic, or Enterprise
Mobility Suite.

Managing which users in your directory should have a license is simple. It can be accomplished by assigning licenses to groups in Azure portal (this feature is in public preview) or by assigning licenses directly to the right individuals through the portal, PowerShell, or APIs. When assigning licenses to a group, all group members will be assigned a license. If users are added or removed from the group they will be assigned or removed the appropriate license. Group assignment can utilize any group management available to you and is consistent with group-based assignment to applications. Using this approach, you can set up rules such that all users in your directory are automatically assigned, ensure that everyone with the appropriate job title has a license or even delegate the decision to other managers in the organization. 

For a detailed discussion of license assignment to groups, including advanced scenarios and Office 365 licensing scenarios, please see [this article](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-licensing-group-assignment-azure-portal).

## Getting started with Azure AD licensing

Getting started with Azure AD is easy; you can always create your directory as a part of signing up for a free Azure trial. [Learn more about signing up as an organization](https://azure.microsoft.com/en-us/documentation/articles/sign-up-organization/). The following can help you make sure that your directory is best aligned with other Microsoft services you may be consuming or are planning to consume, and your goals in obtaining the service.

Here are a couple of best practices:

- If you are already using any of Microsoft's organizational services, you already have an Azure AD directory. In this case, you should continue to use the same directory for other services, so that core identity management, including provisioning and hybrid single sign-on (SSO), can be utilized across the services. Your users will have a single sign-in experience and will benefit from richer capabilities across the services. Thus, if you decide to buy an Azure AD paid service for your workforce, we recommend that you use the same directory to do this.

- If you are planning to use Azure AD for a different set of users (partners, customers, and so on), or if you would like to evaluate Azure AD services and would like to do that in isolation of your production service, or if you are looking to setup a sandbox environment for your services, we recommend that you first create a new directory through the Azure classic portal. Learn more about creating a new Azure AD directory in the Azure classic portal. The new directory will be created with your account as an external user with global administrator permissions. When you sign in to the Azure portal with this account, you will be able to see this directory and access all directory administration tasks.

> [!NOTE]
> Azure AD supports “external users,” which are user accounts in an instance of Azure AD that were created using either a Microsoft Account (MSA) or an Azure AD identity from another directory. While we are busy extending this capability into all of Microsoft's organizational services, right now these accounts are not supported in some of the services' experiences; for example, the Office 365 administration portal does not currently support these users. Thus, external users with Microsoft accounts will not be able to access the Office 365 administration portal at all, while external users from other Azure AD directories will be ignored. In the latter case, only the user’s local account, the Azure AD or Office 365 directory where the user was originally created, is accessible through these experiences.

As indicated, Azure AD has different paid versions. These versions have some minor differences in their purchase availability:

|  Product       |              EA/VL  | Open  | CSP |  MPN use rights  | Direct purchase |  Trial |
|  -------------- | ------------- | ------- | ------ | ----- | ---------------- | ----------------- | ------- |
|  Enterprise Mobility Suite  | X   |    X  |    X  |     X | &nbsp;  | X |
|  Azure AD Premium P2     |    X    |   X   |   X   | &nbsp;  |  X  |   X  
|  Azure AD Premium P1     |    X   |    X    |  X   |  &nbsp; |  X  |  &nbsp; |             
|  Azure AD Basic          |    X   |    X   |  X  |  X  | &nbsp; | &nbsp;  |

### Select one or more license trials

You can activate an Azure AD Premium or Enterprise Mobility Suite trial subscription under Azure Active Directory &gt; **Quick start**.

![select a license trial](media/active-directory-licensing-get-started-azure-portal/select-a-license-trial.png)

The trial licenses will now be available on the **Licenses** blade.

### Assign licenses to users and groups

Once the subscription is active, you should assign a license to yourself and refresh the browser to ensure you are seeing all your features. The next step is to assign licenses to the users that will need to access or be included in paid Azure AD features. As we mentioned above in [Assigning licenses](#assigning-licenses), the best way to do this is to identify the group representing the desired audience and assign the license to it; in this way, users who are added or removed from the group over its lifecycle will be assigned or removed the license, respectively.

> [!NOTE]
> Some Microsoft services are not available in all locations; before a license can be assigned to a user, the administrator must specify the “Usage location” property on the user. This can be done under User &gt; Profile &gt; Settings section in the Azure portal. When using group license assignment, any users without a usage location specified will inherit the location of the directory.

To assign a license to a group or individual users, under Azure Active Directory &gt; Licenses &gt; All Products select one or more products and click the **Assign** button on the command bar.

![select a license to assign](media/active-directory-licensing-get-started-azure-portal/select-license-to-assign.png)

This will bring up a new blade where you can choose multiple users or group, and optionally disable service plans in the product. The search bar on top can be used to search for user and group names.

![select a user or group for license assignment](media/active-directory-licensing-get-started-azure-portal/select-user-for-license-assignment.png)

When assigning a license to the group, it may take some time, depending on the number of users in the group, before all users inherit the license. The processing status can be checked on the group blade, under the **Licenses** tile.

![license assignment status](media/active-directory-licensing-get-started-azure-portal/license-assignment-status.png)

Assignment errors can occur during Azure AD license assignment, but are relatively rare when managing Azure AD and EMS products. Potential assignment errors are limited to:
- Assignment conflict: When a user was previously assigned a license that is incompatible with the current license. In this case, assigning the new license will require removing the current one.
- Exceeded available licenses: when the number of users in assigned groups exceed available licenses, the users' assignment statuses will reflect a failure to assign due to missing licenses.

Detailed information about group license assignment is available in this article.

### View assigned licenses

A summary view of assigned and available licenses is displayed under Azure Active Directory &gt; **Licenses** &gt; **All products**.

![view license summary](media/active-directory-licensing-get-started-azure-portal/view-license-summary.png)

A detailed list of assigned users and groups is available when clicking on a specific product. **Licensed users** shows all users currently consuming a license, including whether the license was assigned directly to the user or if it is inherited from a group.

![view license details](media/active-directory-licensing-get-started-azure-portal/view-license-detail.png)

Similarly, **Licensed groups** shows all groups to which licenses have been assigned. Click on the user or group in those views will open the **Licenses** blade showing all licenses assigned to that object.

### Removing a license

To remove a license, go to the user or group and open the **Licenses** tile. Select the license and click **Remove**.

![remove a license](media/active-directory-licensing-get-started-azure-portal/remove-license.png)

Please note that licenses inherited by the user from a group cannot be removed directly. Instead, remove the user from the group from which they are inheriting the license.

### Extending trials

Trial extensions for customers are available as self-service through the Office 365 portal. A customer admin can navigate to the Office portal (access depends on permissions for the Office portal) and select the Azure AD Premium trial. Clicking the **Extend trial** link starts the extension process. A credit card is required, but it will not be charged.

![extend a trial in the Azure portal](media/active-directory-licensing-get-started-azure-portal/extend-trial-beginning.png)

## Next steps

To learn more about advanced scenarios for license management through
groups read this article

Now you might be ready to configure and use some Azure AD Premium features.

* [Self-service password reset](active-directory-manage-passwords.md)
* [Self-service group management](active-directory-accessmanagement-self-service-group-management.md)
* [Azure AD Connect heath](active-directory-aadconnect-health.md)
* [Group assignment to applications](active-directory-manage-groups.md)
* [Assinging licenses to a group](active-directory-licensing-group-assignment-azure-portal.md)
* [Azure Multi-Factor Authentication](../multi-factor-authentication/multi-factor-authentication.md)
* [Direct purchase of Azure AD Premium licenses](http://aka.ms/buyaadp)
