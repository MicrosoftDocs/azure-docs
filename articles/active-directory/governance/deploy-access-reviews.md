---
title: Plan a Microsoft Entra access reviews deployment
description: Planning guide for a successful access reviews deployment.
services: active-directory
documentationCenter: ''
author: owinfreyATL
manager: amycolannino
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 06/28/2023
ms.author: owinfrey
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management


#Customer intent: As an IT admin, I want to ensure access to resources is appropriate and governed.

---

# Plan a Microsoft Entra access reviews deployment

[Microsoft Entra access reviews](access-reviews-overview.md) help your organization keep the network more secure by managing its [resource access lifecycle](identity-governance-overview.md). With access reviews, you can:

* Schedule regular reviews or do ad-hoc reviews to see who has access to specific resources, such as applications and groups.
* Track reviews for insights, compliance, or policy reasons.
* Delegate reviews to specific admins, business owners, or users who can self-attest to the need for continued access.
* Use the insights to efficiently determine if users should continue to have access.
* Automate review outcomes, such as removing users' access to resources.

  ![Diagram that shows the access reviews flow.](./media/deploy-access-review/1-planning-review.png)

Access reviews are an [Microsoft Entra Identity Governance](identity-governance-overview.md) capability. The other capabilities are [entitlement management](entitlement-management-overview.md), [Privileged Identity Management (PIM)](../privileged-identity-management/pim-configure.md), and [terms of use](../conditional-access/terms-of-use.md). Together, they help you address these four questions:

* Which users should have access to which resources?
* What are those users doing with that access?
* Is there effective organizational control for managing access?
* Can auditors verify that the controls are working?

Planning your access reviews deployment is essential to make sure you achieve your desired governance strategy for users in your organization.

### Key benefits

The key benefits of enabling access reviews are:

* **Control collaboration**: Access reviews allow you to manage access to all the resources your users need. When users share and collaborate, you can be assured that the information is among authorized users only.
* **Manage risk**: Access reviews provide you with a way to review access to data and applications, which lowers the risk of data leakage and data spill. You gain the capability to regularly review external partners' access to corporate resources.
* **Address compliance and governance**: With access reviews, you can govern and recertify the access lifecycle to groups, apps, and sites. You can control and track reviews for compliance or risk-sensitive applications specific to your organization.
* **Reduce cost**: Access reviews are built in the cloud and natively work with cloud resources such as groups, applications, and access packages. Using access reviews is less costly than building your own tools or otherwise upgrading your on-premises tool set.

### Training resources

The following videos help you learn about access reviews:

* [What are access reviews in Azure AD?](https://youtu.be/kDRjQQ22Wkk)
* [How to create access reviews in Azure AD](https://youtu.be/6KB3TZ8Wi40)
* [How to create automatic access reviews for all guest users with access to Microsoft 365 groups in Azure AD](https://www.youtube.com/watch?v=3D2_YW2DwQ8)
* [How to enable access reviews in Azure AD](https://youtu.be/X1SL2uubx9M)
* [How to review access by using My Access](https://youtu.be/tIKdQhdHLXU)

### Licenses

[!INCLUDE [active-directory-p2-governance-license.md](../../../includes/active-directory-p2-governance-license.md)]

>[!NOTE]
>Creating a review on inactive users and with [user-to-group affiliation](review-recommendations-access-reviews.md#user-to-group-affiliation) recommendations requires a Microsoft Entra ID Governance license.

## Plan the access reviews deployment project

Consider your organizational needs to determine the strategy for deploying access reviews in your environment.

### Engage the right stakeholders

When technology projects fail, they typically do so because of mismatched expectations on impact, outcomes, and responsibilities. To avoid these pitfalls, [ensure that you're engaging the right stakeholders](../fundamentals/deployment-plans.md) and that project roles are clear.

For access reviews, you'll likely include representatives from the following teams within your organization:

* **IT administration** manages your IT infrastructure and administers your cloud investments and software as a service (SaaS) apps. This team:

   * Reviews privileged access to infrastructure and apps, including Microsoft 365 and Azure AD.
   * Schedules and runs access reviews on groups that are used to maintain exception lists or IT pilot projects to maintain up-to-date access lists.
   * Ensures that programmatic (scripted) access to resources through service principals is governed and reviewed.

* **Development teams** build and maintain applications for your organization. This team:

   * Controls who can access and manage components in SaaS, platform as a service (PaaS), and infrastructure as a service (IaaS) resources that comprise the developed solutions.
   * Manages groups that can access applications and tools for internal application development.
   * Requires privileged identities that have access to production software or solutions that are hosted for your customers.

* **Business units** manage projects and own applications. This team:

   * Reviews and approves or denies access to groups and applications for internal and external users.
   * Schedules and does reviews to attest continued access for employees and external identities such as business partners.

* **Corporate governance** ensures that the organization follows internal policy and complies with regulations. This team:

   * Requests or schedules new access reviews.
   * Assesses processes and procedures for reviewing access, which includes documentation and record keeping for compliance.
   * Reviews results of past reviews for most critical resources.

> [!NOTE]
> For reviews that require manual evaluations, plan for adequate reviewers and review cycles that meet your policy and compliance needs. If review cycles are too frequent, or there are too few reviewers, quality might be lost and too many or too few people might have access.

### Plan communications

Communication is critical to the success of any new business process. Proactively communicate to users how and when their experience will change. Tell them how to gain support if they experience issues.

#### Communicate changes in accountability

Access reviews support shifting responsibility of reviewing and acting on continued access to business owners. Decoupling access decisions from the IT department drives more accurate access decisions. This shift is a cultural change in the resource owner's accountability and responsibility. Proactively communicate this change and ensure resource owners are trained and able to use the insights to make good decisions.

The IT department wants to stay in control for all infrastructure-related access decisions and privileged role assignments.

#### Customize email communication

When you schedule a review, you nominate users who do this review. These reviewers then receive an email notification of new reviews assigned to them and reminders before a review assigned to them expires.

The email sent to reviewers can be customized to include a short message that encourages them to act on the review. Use the extra text to:

* Include a personal message to reviewers so they understand it's sent by your compliance or IT department.
* Include a reference to internal information on what the expectations of the review are and extra reference or training material.

  ![Screenshot that shows a reviewer email.](./media/deploy-access-review/2-plan-reviewer-email.png)

After you select **Start review**, reviewers will be directed to the [My Access portal](https://myapplications.microsoft.com/) for group and application access reviews. The portal gives them an overview of all users who have access to the resource they're reviewing and system recommendations based on last sign-in and access information.

### Plan a pilot

We encourage customers to initially pilot access reviews with a small group and target noncritical resources. Piloting can help you adjust processes and communications as needed. It can help you increase users' and reviewers' ability to meet security and compliance requirements.

In your pilot, we recommend that you:

* Start with reviews where the results aren't automatically applied, and you can control the implications.
* Ensure all users have valid email addresses listed in Azure AD. Confirm that they receive email communication to take the appropriate action.
* Document any access removed as a part of the pilot in case you need to quickly restore it.
* Monitor audit logs to ensure all events are properly audited.

For more information, see [Best practices for a pilot](../fundamentals/deployment-plans.md).

## Introduction to access reviews

This section introduces access review concepts you should know before you plan your reviews.

### What resource types can be reviewed?

After you integrate your organization's resources with Azure AD, such as users, applications, and groups, they can be managed and reviewed.

Typical targets for review include:

* [Applications integrated with Azure AD for single sign-on](../manage-apps/what-is-application-management.md), such as SaaS and line of business.
* Group [membership](../fundamentals/active-directory-manage-groups.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context) synchronized to Azure AD, or created in Azure AD or Microsoft 365, including Microsoft Teams.
* [Access package](./entitlement-management-overview.md) that groups resources such as groups, apps, and sites into a single package to manage access.
* [Azure AD roles​ and Azure resource roles](../privileged-identity-management/pim-resource-roles-assign-roles.md) as defined in PIM.

### Who will create and manage access reviews?

The administrative role required to create, manage, or read an access review depends on the type of resource being reviewed. The following table denotes the roles required for each resource type. Custom roles with permission Microsoft.Authorization/* can create and manage reviews of any resource type, and custom roles with at least permissions Microsoft.Authorization/*/read can read reviews of any resource type.

| Resource type| Create and manage access reviews (creators)| Read access review results |
| - | - | -|
| Group or application| Global administrator <p>User administrator<p>Identity Governance administrator<p>Privileged Role administrator (only does reviews for Azure AD role-assignable groups)<p>Group owner ([if enabled by an admin]( create-access-review.md#allow-group-owners-to-create-and-manage-access-reviews-of-their-groups))| Global administrator<p>Global reader<p>User administrator<p>Identity Governance administrator<p>Privileged Role administrator<p>Security reader<p>Group owner ([if enabled by an admin]( create-access-review.md#allow-group-owners-to-create-and-manage-access-reviews-of-their-groups)) |
|Azure AD roles| Global administrator <p>Privileged Role administrator|  Global administrator<p>Global reader<p>User administrator<p>Privileged Role administrator<p> <p>Security reader |
| Azure resource roles| User Access Administrator (for the resource)<p>Resource owner| User Access Administrator (for the resource)<p>Resource owner<p>Reader (for the resource) |
| Access package| Global administrator<p>User administrator<p>Identity Governance administrator<p>Catalog owner (for the access package)<p>Access package manager (for the access package)| Global administrator<p>Global reader<p>User administrator<p>Identity Governance administrator<p>Catalog owner (for the access package)<p>Access package manager (for the access package)<p>Security reader  |

For more information, see [Administrator role permissions in Azure AD](../roles/permissions-reference.md).

### Who will review the access to the resource?

The creator of the access review decides at the time of creation who will do the review. This setting can't be changed after the review is started. Reviewers are represented by:

* Resource owners who are the business owners of the resource.
* Individually selected delegates as chosen by the access reviews administrator.
* Users who self-attest to their need for continued access.
* Managers review their direct reports' access to the resource.

When you create an access review, administrators can choose one or more reviewers. All reviewers can start and carry out a review by choosing users for continued access to a resource or removing them.

### Components of an access review

Before you implement your access reviews, plan the types of reviews relevant to your organization. To do so, you need to make business decisions about what you want to review and the actions to take based on those reviews.

To create an access review policy, you must have the following information:

* What are the resources to review?
* Whose access is being reviewed?
* How often should the review occur?
* Who will do the review?

   * How will they be notified to review?
   * What are the timelines to be enforced for review?

* What automatic actions should be enforced based on the review?
   * What happens if the reviewer doesn't respond in time?

* What manual actions are taken as a result based on the review?
* What communications should be sent based on the actions taken?

#### Example access review plan

| Component| Value |
| - | - |
| Resources to review| Access to Microsoft Dynamics. |
| Review frequency| Monthly. |
| Who does the review| Dynamics business group Program Managers. |
| Notification| Email is sent at the start of a review to the alias Dynamics-Pms.<p>Include an encouraging custom message to reviewers to secure their buy-in. |
| Timeline| 48 hours from notification. |
|Automatic actions| Remove access from any account that has no interactive sign-in within 90 days by removing the user from the Security group dynamics-access. <p>*Perform actions if not reviewed within timeline.* |
| Manual actions| Reviewers can do removals approval prior to automated action if desired. |

### Automate actions based on access reviews

You can choose to have access removal automated by setting the **Auto apply results to resource** option to **Enable**.

  ![Screenshot that shows planning access reviews.](./media/deploy-access-review/3-automate-actions-settings.png)

After the review is finished and has ended, users who weren't approved by the reviewer will be automatically removed from the resource or kept with continued access. Options could mean removing their group membership or their application assignment or revoking their right to elevate to a privileged role.

### Take recommendations

Recommendations are displayed to reviewers as part of the reviewer experience and indicate a person's last sign-in to the tenant or last access to an application. This information helps reviewers make the right access decision. Selecting **Take recommendations** follows the access review's recommendations. At the end of an access review, the system applies these recommendations automatically to users for whom reviewers haven't responded.

Recommendations are based on the criteria in the access review. For example, if you configure the review to remove access with no interactive sign-in for 90 days, the recommendation is that all users who fit that criteria should be removed. Microsoft is continually working on enhancing recommendations.

### Review guest user access

Use access reviews to review and clean up collaboration partners' identities from external organizations. Configuration of a per-partner review might satisfy compliance requirements.

External identities can be granted access to company resources. They can be:

* Added to a group.
* Invited to Teams.
* Assigned to an enterprise application or access package.
* Assigned a privileged role in Azure AD or in an Azure subscription.

For more information, see [sample script](https://github.com/microsoft/access-reviews-samples/tree/master/ExternalIdentityUse). The script shows where external identities invited into the tenant are used. You can see an external user's group membership, role assignments, and application assignments in Azure AD. The script won't show any assignments outside of Azure AD, for example, direct rights assignment to SharePoint resources, without the use of groups.

When you create an access review for groups or applications, you can choose to let the reviewer focus on **Everyone with access** or **Guest users only**. By selecting **Guest users only**, reviewers are given a focused list of external identities from Azure AD business to business (B2B) that have access to the resource.

 ![Screenshot that shows reviewing guest users.](./media/deploy-access-review/4-review-guest-users-admin-ui.png)

> [!IMPORTANT]
> This list *won't* include external members who have a **userType** of **member**. This list also *won't* include users invited outside of Azure AD B2B collaboration. An example is those users who have access to shared content directly through SharePoint.

## Plan access reviews for access packages

[Access packages](entitlement-management-overview.md) can vastly simplify your governance and access review strategy. An access package is a bundle of all the resources with the access a user needs to work on a project or do their task. For example, you might want to create an access package that includes all the applications that developers in your organization need, or all applications to which external users should have access. An administrator or delegated access package manager then groups the resources (groups or apps) and the roles the users need for those resources.

When you [create an access package](entitlement-management-access-package-create.md), you can create one or more access package policies that set conditions for which users can request an access package, what the approval process looks like, and how often a person would have to re-request access or have their access reviewed. Access reviews are configured while you create or edit those access package policies.

Select the **Lifecycle** tab and scroll down to access reviews.

 ![Screenshot that shows the Lifecycle tab.](./media/deploy-access-review/5-plan-access-packages-admin-ui.png)

## Plan access reviews for groups

Besides access packages, reviewing group membership is the most effective way of governing access. Assign access to resources via [Security groups or Microsoft 365 groups](../fundamentals/active-directory-manage-groups.md). Add users to those groups to gain access.

A single group can be granted access to all appropriate resources. You can assign the group access to individual resources or to an access package that groups applications and other resources. With this method, you can review access to the group rather than an individual's access to each application.

Group membership can be reviewed by:

* Administrators.
* Group owners.
* Selected users who are delegated review capability when the review is created.
* Members of the group who attest for themselves.
* Managers who review their direct reports' access.

### Group ownership

Group owners review membership because they're best qualified to know who needs access. Ownership of groups differs with the type of group:

* Groups that are created in Microsoft 365 and Azure AD have one or more well-defined owners. In most cases, these owners make perfect reviewers for their own groups as they know who should have access.

   For example, Microsoft Teams uses Microsoft 365 Groups as the underlying authorization model to grant users access to resources that are in SharePoint, Exchange, OneNote, or other Microsoft 365 services. The creator of the team automatically becomes an owner and should be responsible for attesting to the membership of that group.

* Groups created manually in the Azure portal or via scripting through Microsoft Graph might not necessarily have owners defined. Define them either through the Azure portal in the group's **Owners** section or via Microsoft Graph.

* Groups that are synchronized from on-premises Active Directory can't have an owner in Azure AD. When you create an access review for them, select individuals who are best suited to decide on membership in them.

> [!NOTE]
> Define business policies that define how groups are created to ensure clear group ownership and accountability for regular review of membership.

### Review membership of exclusion groups in Conditional Access policies

To learn how to review membership of exclusion groups, see [Use Microsoft Entra access reviews to manage users excluded from Conditional Access policies](conditional-access-exclusion.md).

### Review guest users' group memberships

To learn how to review guest users' access to group memberships, see [Manage guest access with Microsoft Entra access reviews](./manage-guest-access-with-access-reviews.md).

### Review access to on-premises groups

Access reviews can't change the group membership of groups that you synchronize from on-premises with [Azure AD Connect](../hybrid/whatis-azure-ad-connect.md). This restriction is because the source of authority is on-premises.

You can still use access reviews to schedule and maintain regular reviews of on-premises groups. Reviewers will then take action in the on-premises group. This strategy keeps access reviews as the tool for all reviews.

You can use the results from an access review on on-premises groups and process them further, either by:

* Downloading the CSV report from the access review and manually taking action.
* Using Microsoft Graph to programmatically access results and decisions in completed access reviews.

For example, to access results for a Windows AD-managed group, use this [PowerShell sample script](https://github.com/microsoft/access-reviews-samples/tree/master/AzureADAccessReviewsOnPremises). The script outlines the required Microsoft Graph calls and exports the Windows AD-PowerShell commands to carry out the changes.

## Plan access reviews for applications

When you review access to an application, you're reviewing the access for employees and external identities to the information and data within the application. Choose to review an application when you need to know who has access to a specific application, instead of an access package or a group.

Plan reviews for applications in the following scenarios when:

* Users are granted direct access to the application (outside of a group or access package).
* The application exposes critical or sensitive information.
* The application has specific compliance requirements to which you must attest.
* You suspect inappropriate access.

To create access reviews for an application, set the **User assignment required?** option to **Yes**. If it's set to **No**, all users in your directory, including external identities, can access the application and you can't review access to the application.

 ![Screenshot that shows planning app assignments.](./media/deploy-access-review/6-plan-applications-assignment-required.png)

Then [assign the users and groups](../manage-apps/assign-user-or-group-access-portal.md) whose access you want to have reviewed.

Read more about how to [prepare for an access review of users' access to an application](access-reviews-application-preparation.md).

### Reviewers for an application

Access reviews can be for the members of a group or for users who were assigned to an application. Applications in Azure AD don't necessarily have an owner, which is why the option for selecting the application owner as a reviewer isn't possible. You can further scope a review to review only guest users assigned to the application, rather than reviewing all access.

## Plan review of Azure AD and Azure resource roles

[Privileged Identity Management](../privileged-identity-management/pim-configure.md) simplifies how enterprises manage privileged access to resources in Azure AD. Using PIM keeps the list of privileged roles in [Azure AD](../roles/permissions-reference.md) and [Azure resources](../../role-based-access-control/built-in-roles.md) smaller. It also increases the overall security of the directory.

Access reviews allow reviewers to attest whether users still need to be in a role. Just like access reviews for access packages, reviews for Azure AD roles and Azure resources are integrated into the PIM admin user experience.

Review the following role assignments regularly:

* Global administrator
* User administrator
* Privileged Authentication administrator
* Conditional Access administrator
* Security administrator
* All Microsoft 365 and Dynamics Service administration roles

Roles that are reviewed include permanent and eligible assignments.

In the **Reviewers** section, select one or more people to review all the users. Or you can select **Members (self)** to have the members review their own access.

 ![Screenshot that shows selecting reviewers.](./media/deploy-access-review/7-plan-azure-resources-reviewers-selection.png)

## Deploy access reviews

After you've prepared a strategy and a plan to review access for resources integrated with Azure AD, deploy and manage reviews by using the following resources.

### Review access packages

To reduce the risk of stale access, administrators can enable periodic reviews of users who have active assignments to an access package. Follow the instructions in the articles listed in the table.

| How-to articles| Description |
| - | - |
| [Create access reviews](entitlement-management-access-reviews-create.md)| Enable reviews of an access package. |
| [Do access reviews](entitlement-management-access-reviews-review-access.md)| Do access reviews for other users who are assigned to an access package. |
| [Self-review assigned access package(s)](entitlement-management-access-reviews-self-review.md)| Do a self-review of assigned access packages. |

> [!NOTE]
> Users who self-review and say they no longer need access aren't removed from the access package immediately. They're removed from the access package when the review ends or if an administrator stops the review.

### Review groups and apps

Access needs to groups and applications for employees and guests likely change over time. To reduce the risk associated with stale access assignments, administrators can create access reviews for group members or application access. Follow the instructions in the articles listed in the table.

| How-to articles| Description |
| - | - |
| [Create access reviews](create-access-review.md)| Create one or more access reviews for group members or application access. |
| [Do access reviews](perform-access-review.md)| Do an access review for members of a group or users with access to an application. |
| [Self-review your access](review-your-access.md)| Allow members to review their own access to a group or an application. |
| [Complete access review](complete-access-review.md)| View an access review and apply the results. |
| [Take action for on-premises groups](https://github.com/microsoft/access-reviews-samples/tree/master/AzureADAccessReviewsOnPremises)| Use a sample PowerShell script to act on access reviews for on-premises groups. |

### Review Azure AD roles

To reduce the risk associated with stale role assignments, regularly review access of privileged Azure AD roles.

![Screenshot that shows the Review membership list of Azure A D roles.](./media/deploy-access-review/8-review-azure-ad-roles-picker.png)

Follow the instructions in the articles listed in the table.

| How-to articles | Description |
| - | - |
 [Create access reviews](../privileged-identity-management/pim-create-azure-ad-roles-and-resource-roles-review.md?toc=%2fazure%2factive-directory%2fgovernance%2ftoc.json)| Create access reviews for privileged Azure AD roles in PIM. |
| [Self-review your access](../privileged-identity-management/pim-perform-azure-ad-roles-and-resource-roles-review.md?toc=%2fazure%2factive-directory%2fgovernance%2ftoc.json)| If you're assigned to an administrative role, approve or deny access to your role. |
| [Complete an access review](../privileged-identity-management/pim-complete-azure-ad-roles-and-resource-roles-review.md?toc=%2fazure%2factive-directory%2fgovernance%2ftoc.json)| View an access review and apply the results. |

### Review Azure resource roles

To reduce the risk associated with stale role assignments, regularly review access of privileged Azure resource roles.

![Screenshot that shows reviewing Azure A D roles.](./media/deploy-access-review/9-review-azure-roles-picker.png)

Follow the instructions in the articles listed in the table.

| How-to articles| Description |
| - | -|
| [Create access reviews](../privileged-identity-management/pim-create-azure-ad-roles-and-resource-roles-review.md?toc=%2fazure%2factive-directory%2fgovernance%2ftoc.json)| Create access reviews for privileged Azure resource roles in PIM. |
| [Self-review your access](../privileged-identity-management/pim-perform-azure-ad-roles-and-resource-roles-review.md?toc=%2fazure%2factive-directory%2fgovernance%2ftoc.json)| If you're assigned to an administrative role, approve or deny access to your role. |
| [Complete an access review](../privileged-identity-management/pim-complete-azure-ad-roles-and-resource-roles-review.md?toc=%2fazure%2factive-directory%2fgovernance%2ftoc.json)| View an access review and apply the results. |

## Use the Access Reviews API

To interact with and manage reviewable resources, see [Microsoft Graph API methods](/graph/api/resources/accessreviewsv2-overview) and [role and application permission authorization checks](/graph/api/resources/accessreviewsv2-overview). The access reviews methods in the Microsoft Graph API are available for both application and user contexts. When you run scripts in the application context, the account used to run the API (the service principle) must be granted the AccessReview.Read.All permission to query access reviews information.

Popular access reviews tasks to automate by using the Microsoft Graph API for access reviews are:

* Create and start an access review.
* Manually end an access review before its scheduled end.
* List all running access reviews and their status.
* See the history of a review series and the decisions and actions taken in each review.
* Collect decisions from an access review.
* Collect decisions from completed reviews where the reviewer made a different decision than what the system recommended.

When you create new Microsoft Graph API queries for automation, use [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer) to build and explore your Microsoft Graph queries before you put them into scripts and code. This step can help you to quickly iterate your query so that you get exactly the results you're looking for, without changing the code of your script.

## Monitor access reviews

Access reviews activities are recorded and available from the [Azure AD's audit logs](../reports-monitoring/concept-audit-logs.md). You can filter the audit data on the category, activity type, and date range. Here's a sample query.

| Category| Policy |
| - | - |
| Activity type| Create access review |
| | Update access review |
| | Access review ended |
| | Delete access review |
| | Approve decision |
| | Deny decision |
| | Reset decision |
| | Apply decision |
| Date range| Seven days |

For more advanced queries and analysis of access reviews, and to track changes and completion of reviews, export your Azure AD audit logs to [Azure Log Analytics](../reports-monitoring/quickstart-azure-monitor-route-logs-to-storage-account.md) or Azure Event Hubs. When audit logs are stored in Log Analytics, you can use the [powerful analytics language](../reports-monitoring/howto-analyze-activity-logs-log-analytics.md) and build your own dashboards.

## Next steps

Learn about the following related technologies:

* [What is Microsoft entitlement management?](entitlement-management-overview.md)
* [What is Microsoft Privileged Identity Management?](../privileged-identity-management/pim-configure.md)
