---
title: Preparing for an access review of users' access to an application
description: Planning for a successful access reviews campaign for a particular application starts with understanding how to model access for that application in Azure AD.
services: active-directory
documentationCenter: ''
author: markwahl-msft
manager: karenhoran
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 04/25/2022
ms.author: mwahl
ms.reviewer: mwahl
ms.collection: M365-identity-device-management


#Customer intent: As an IT admin, I want to ensure access to specific applications is governed, by setting up access reviews for those applications.

---

# Prepare for an access review of users' access to an application

[Azure Active Directory (Azure AD) Identity Governance](identity-governance-overview.md) allows you to balance your organization's need for security and employee productivity with the right processes and visibility. It provides you with capabilities to ensure that the right people have the right access to the right resources.

Organizations with compliance requirements or risk management plans will have sensitive or business-critical applications. The application sensitivity may be based on its purpose or the data it contains, such as financial information or personal information of the organization's customers. For those applications, only a subset of all the users in the organization will typically be authorized to have access, and access should only be permitted based on documented business requirements.  Azure AD can be integrated with many popular SaaS applications, as well as on-premises applications, and applications that your organization has developed, using [standards](../fundamentals/auth-sync-overview.md) and APIs, so that Azure AD can be the authoritative source to control who has access to those applications.  As you integrate your applications with Azure AD, you can then use Azure AD access reviews to review the users who have access to those applications.

## Prerequisites for reviewing access

1. To use Azure AD to review access to an application, you must have one of the following licenses in your tenant:

   * Azure AD Premium P2
   * Enterprise Mobility + Security (EMS) E5 license

   While using the access reviews feature does not require users to have those licenses assigned to them to use the feature, you'll need to have at least as many licenses in your tenant as the number of member (non-guest) users who will be configured as reviewers.

Also, while not required for reviewing access to a particular application, we recommend also regularly reviewing the membership of privileged directory roles that have the ability to control other users' access to all applications. Administrators in the `Global Administrator`, `Identity Governance Administrator`, `User Administrator`, `Application Administrator`, `Cloud Application Administrator` and `Privileged Role Administrator` can make changes to users and their application role assignments, so ensure that [access review of these directory roles](../privileged-identity-management/pim-create-azure-ad-roles-and-resource-roles-review.md) have been scheduled.

## Identify the pattern for how the application is integrated with Azure AD

In order for Azure AD access reviews to be able to be used to review access for an application, then the application must first be integrated with Azure AD. An application being integrated with Azure AD means

* the application relies upon Azure AD for federated SSO, and Azure AD controls authentication token issuance, so that only users assigned to the application in Azure AD are able to sign into the application and those uses that are denied by a review can no longer get a new token to sign in, or
* the application relies upon user or group lists that are provided to it by Azure AD, such as through a provisioning protocol or Microsoft Graph, so that changes to remove a denied user's access are made available to the application through an interface.

If these criteria aren't met for an application, then access reviews can still be used, however some users might not be in scope, or the changes won't be able to be automatically sent to the application. The organization must have a process to send the results of a completed review to the application if the application doesn't rely upon Azure AD.

In order to permit a wide variety of applications and IT requirements to be addressed with Azure AD, there are many patterns for how an application can be integrated with Azure AD.  The following flowchart illustrates how to select from three integration patterns, A-C, that are appropriate for applications in scope of identity governance.  Knowing what pattern is being used for a particular application helps you to configure the appropriate resources in Azure AD to be ready the access review.

   ![Flowchart for application integration patterns](./media/access-reviews-application-preparation/app-integration-patterns-flowchart.png)

|Pattern|Application integration pattern|Steps to prepare for an access review|
|:---|---|--|
|A| The application supports federated SSO, Azure AD is the only identity provider, and the application doesn't rely upon group or role claims. | In this pattern, you'll configure that the application requires individual application role assignments, and that users are assigned to the application.  Then to perform the review, you'll create a single access review for the application, of the users assigned to this application role. When the review completes, if a user was denied, then they will be removed from the application role, and Azure AD will no longer issue federation tokens for that user to be able to sign into that application.|
|B|If the application uses group claims in addition to application role assignments.| An application may use Azure AD group membership, distinct from application roles to express finer-grained access.  Here, you can choose based on your business requirements either to review the users who have application role assignments, or to review the users who have group memberships.  If the groups do not provide comprehensive access coverage, in particular if users may have access to the application even if they aren't a member of those groups, then we recommend reviewing the application role assignments, as in pattern A above.|
|C| If the application doesn't rely solely on Azure AD for federated SSO, but does support provisioning, via SCIM, or via updates to a SQL table of users or an LDAP directory. |  In this pattern, you'll configure Azure AD to provision the users with application role assignments to the application's database or directory, update the app role assignments in Azure AD with a list of the users who currently have access, and then create a single access review of the application role assignments.|


   > [!NOTE]
   > These integration patterns are applicable to third party SaaS applications, or applications that have been developed by or for your organization. Some Microsoft Online Services, such as Exchange Online, use licenses.  While licenses can't be reviewed, if you're using group-based license assignments, with groups with assigned users, you can review the memberships of those groups instead.  Similarly, some applications may used delegated user consent to control access to Microsoft Graph or other resources.  As consents by each user aren't controlled by a approval process, consents aren't reviewable in Azure AD; instead you can review who is able to connect to the application through Conditional Access policies, that could be based on application role assignments or group memberships.

If the application doesn't support federation or provisioning protocols, then you'll need an out-of-band process for review. If the application only supports password SSO integration, and an application assignment is removed as part of a review, then the application won't show up on the *myapps* page for the user, but it won't prevent a user who already knows the password from being able to continue to sign into the application. Please [ask the SaaS vendor to onboard to the app gallery](../manage-apps/v2-howto-app-gallery-listing.md) for federation or provisioning by updating their application to support a standard protocol.

## Check the application and groups are ready for the review

Now that you have identified the integration pattern for the application, check the application as represented in Azure AD is ready for review.

1. In the Azure portal, click **Azure Active Directory**, click **Enterprise Applications**, and check whether your application is on the [list of enterprise applications](../manage-apps/view-applications-portal.md) in your Azure AD tenant.
1. If the application is not already listed, then check if the app is available the [application gallery](../manage-apps/overview-application-gallery.md) for applications that can be integrated for federated SSO or provisioning. If it is in the gallery, then use the [tutorials](../saas-apps/tutorial-list.md) to configure the application for federation, and if it supports provisioning, also [configure the application](/app-provisioning/configure-automatic-user-provisioning-portal.md) for provisioning.
1. One the application is in the list of enterprise applications in your tenant, select the application from the list.
1. Change to the **Properties** tab.  Verify that the **User assignment required?** option is set to **Yes**. If it's set to **No**, all users in your directory, including external identities, can access the application, and you can't review access to the application.
   ![Screenshot that shows planning app assignments.](./media/deploy-access-review/6-plan-applications-assignment-required.png)

1. Change to the **Roles and administrators** tab. What is displayed are the administrative roles, that give rights to control the representation of the application in Azure AD, not the access rights in the application.  For each administrative role that has permissions to allow changing the application integration or assignments, and has an assignment to that administrative role, ensure that only authorized users are in that role.

1. Change to the **Users and groups** tab.  This list contains all the users who are assigned to the application in Azure AD.  If the list is empty, then a review of the application will complete immediately, since there isn't any task for the reviewer to perform.
1. If your application is integrated with pattern C, then you'll need to confirm that the users in this list are the same as those in the applications' internal data store, prior to starting the review. You can [assign users to an application role via PowerShell](../manage-apps/assign-user-or-group-access-portal.md). <!-- TODO -->
1. Check whether all users are assigned to the same application role, such as **User**.  If users are assigned to multiple roles, then if you create an access review of the application, then all assignments to all of the application's roles will be reviewed together.

1. Check the list of directory objects assigned to the roles to confirm that there are no groups assigned to the application roles. It is possible to review this application if there is a group assigned to a role; however, a user who is a member of the group assigned to the role, and whose access was denied, won't be automatically removed from the group.  We recommend first converting the application to have direct user assignments, rather than members of groups, so that a user whose access is denied during the access review can have their application role assignment removed automatically.

1. Change to the **Provisioning** tab.  If automatic provisioning isn't configured, then Azure AD will not notify the application when a user's access is removed.   If your application is integrated with pattern C, and doesn't support federated SSO with Azure AD as its only identity provider, then you will need to configure provisioning so that Azure AD can automatically remove the reviewed users from the application when it completes.
1. If provisioning is configured, then click on **Edit Attribute Mappings**, expand the Mapping section and click on **Provision Azure Active Directory Users**. Check that in the list of attribute mappings, there is a mapping for `isSoftDeleted` to the attribute in the application's data store that you would like to set to false when a user loses access. If this mapping isn't present, then Azure AD will not notify the application when a user has gone out of scope, as described in [how provisioning works](../app-provisioning/how-provisioning-works.md).
1. If the application supports federated SSO, then change to the **Conditional Access** tab. Inspect the enabled policies for this application. If there are policies that are enabled, block access, have users assigned to the policies, but no other conditions, then those users may be already blocked from being able to get federated SSO to the application.

Next, if the application also requires one or more groups, as described in pattern B, then check each group is ready for review.

1. In the Azure portal experience for Azure AD, click **Groups**, and then select the group from the list.
1. On the **Overview** tab, verify that the **Membership type** is **Assigned**, and the **Source** is **Cloud**.  If the application uses a dynamic group, or a group synchronized from on-premises, then those group memberships cannot be changed in Azure AD.  We recommend converting the application to groups created in Azure AD with assigned memberships, then copy the member users to that new group.
1. Change to the **Roles and administrators** tab. What are displayed are the administrative roles, that give rights to control the representation of the group in Azure AD, not the access rights in the application.  For each administrative role which allows changing group membership and has users in that administrative role, ensure that only authorized users are in that role.
1. Change to the **Members** tab.  Verify that the members of the group are users, and that there are no non-user members or nested groups.  Note that if there are no members when the review starts, the review will complete immediately.
1. Change to the **Owners** tab. Make sure that no authorized users are shown as owners. If you'll be asking the group owners to review, then confirm that the group has one or more owners.

## Select appropriate reviewers

When you create each access review, administrators can choose one or more reviewers. The reviewers can carry out a review by choosing users for continued access to a resource or removing them.

Typically a resource owner is responsible for performing a review. If you're creating a review of a group, as part of pattern B, then you can select the group owner, however as applications in Azure AD don't necessarily have an owner, the option for selecting the application owner as a reviewer isn't possible.  Instead, when creating the review, you can supply the names of the application owners to be the reviewers.

It is also possible, when creating a review of a group or application, to have a [multi-stage review](create-access-review.md#create-a-multi-stage-access-review-preview). For example, you could select to have the manager of each assigned user perform the first stage of the review, and the resource owner the second stage.  That way the resource owner can focus on the users who have already been approved by their manager.

Before creating the reviews, check that you have at least as many Azure AD Premium P2 licenses in your tenant as there are member users who are assigned as reviewers.

## Create the reviews

Once you've identified the resources to review based on the integration pattern, and who the reviewers should be, then you can configure Azure AD to start the reviews, using the access reviews UI. In patterns A and C, you'll create one access review, selecting the application.  If your application is integrated with pattern B, you'll create additional access reviews for each of the groups.

1. For this step, you'll need to be in the `Global administrator` or `Identity Governance administrator` role.
1. Follow the instructions in the guide for [creating an access review of groups or applications](create-access-review.md), to create each of the reviews.

   > [!NOTE]
   > If you create an access review and enable review decision helpers, then the decision helper will vary depending upon the resource being reviewed. If the resource is an application, recommendations are based on the 30-day interval period depending on when the user last signed in to the application. If the resource is a group, then the recommendations are based on the interval when the user last signed into to any application in the tenant, not just the application using those groups.

## View the assignments that are updated when the reviews complete

Once the reviews have started, you can monitor their progress, and update the approvers if needed, until the review completes.  You can then confirm that the users whose access was denied by the reviewers are being removed from the application.

1. Monitor the access reviews, ensuring the reviewers are making selections to approve or deny user's need for continued access, until the [access review completes](complete-access-review.md).

1. If auto-apply wasn't selected when the review was created, then you'll need to apply the review results when it completes.
1. Wait for the status of the review to change to **Result applied**.  You should expect to see denied users, if any, being removed from the group membership or application assignment in a few minutes.

1. If you had previously configured provisioning of users to the application, then when the results are applied, Azure AD will begin deprovisioning users from the application. You can [monitor the process of deprovisioning users](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md). If provisioning indicates an error, you can [download the provisioning log](../reports-monitoring/concept-provisioning-logs.md) to investigate if there was a problem with the application.

1. If you wish, you can also download a [review history report](access-reviews-downloadable-review-history.md) of completed reviews.

## Next steps

* [Plan an Azure Active Directory access reviews deployment](deploy-access-reviews.md)
* [Create an access review of a group or application](create-access-review.md)
