---
title: "Tutorial: Manage application access and security"
description: In this tutorial, you learn how to manage access to an application in Microsoft Entra ID and make sure it's secure.
author: omondiatieno
manager: CelesteDG
ms.author: jomondi
ms.reviewer: ergreenl
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: tutorial
ms.date: 07/18/2022
ms.custom: enterprise-apps

# Customer intent: As an administrator of a Microsoft Entra tenant, I want to manage access to my applications and make sure they are secure.
---

# Tutorial: Manage application access and security

The IT administrator at Fabrikam has added and configured an application from the Microsoft Entra application gallery. They now need to understand the features that are available to manage access to the application and make sure the application is secure.
Using the information in this tutorial, an administrator learns how to:

> [!div class="checklist"]
> * Grant consent for the application on behalf of all users
> * Enable multifactor authentication to make sign-in more secure
> * Communicate a term of use to users of the application
> * Create a collection in the My Apps portal

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Privileged Role Administrator, Cloud Application Administrator, or Application Administrator.
* An enterprise application that has been configured in your Microsoft Entra tenant.
* At least one user account added and assigned to the application. For more information, see [Quickstart: Create and assign a user account](add-application-portal-assign-users.md).

## Grant tenant wide admin consent

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

For the application that the administrator added to their tenant, they want to set it up so that all users in the organization can use it and not have to individually request consent to use it. To avoid the need for user consent, they can grant consent for the application on behalf of all users in the organization. For more information, see [Consent and permissions overview](./user-admin-consent-overview.md).

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. Select the application to which you want to grant tenant-wide admin consent.
1. Under **Security**, select **Permissions**.
1. Carefully review the permissions that the application requires. If you agree with the permissions the application requires, select **Grant admin consent**.

## Create a Conditional Access policy

The administrator wants to make sure that only the people they assign to the application can securely sign in. To do this, they can configure a Conditional Access policy for a group of users that enforces multifactor authentication. For more information, see [What is Conditional Access?](../conditional-access/overview.md).

### Create a group

It's easier for an administrator to manage access to the application by assigning all users of the application to a group. The administrator can then manage access at a group level.

1. In the left menu of the tenant overview, select **Groups** > **All groups**.
1. Select **New group** at the top of the pane.
1. Enter *MFA-Test-Group* for the name of the group.
1. Select No members selected, and then choose the user account that you assigned to the application.
1. Select **Create**.

### Create a Conditional Access policy for the group

1. In the left menu of the tenant overview, select **Protection**.
1. Select **Conditional Access**, select **+ New policy**, and then select **Create new policy**.
1. Enter a name for the policy, such as *MFA Pilot*.
1. Under **Assignments**, select **Users or workload identities**.
1. On the **Include** tab, choose **Select users and groups**, and then select **Users and groups**.
1. Browse for and select the *MFA-Test-Group* that you previously created, and then choose **Select**.
1. Don't select **Create** yet, you add MFA to the policy in the next section.

<a name='configure-multi-factor-authentication'></a>

### Configure multifactor authentication

In this tutorial, the administrator can find the basic steps to configure the application, but they should consider creating a plan for MFA before starting. For more information, see [Plan a Microsoft Entra multifactor authentication deployment](../authentication/howto-mfa-getstarted.md).

1. Under **Cloud apps or actions**, select **No cloud apps, actions, or authentication contexts selected**. For this tutorial, on the **Include** tab, choose **Select apps**.
1. Search for and select your application, and then select **Select**.
1. Under **Access controls** and **Grant**, select **0 controls selected**.
1. Check the box for **Require multifactor authentication**, and then choose **Select**.
1. Set **Enable policy** to **On**.
1. To apply the Conditional Access policy, select **Create**.

<a name='test-multi-factor-authentication'></a>

### Test multifactor authentication

1. Open a new browser window in InPrivate or incognito mode and browse to the URL of the application.
1. Sign in with the user account that you assigned to the application. You're required to register for and use Microsoft Entra multifactor authentication. Follow the prompts to complete the process and verify you successfully sign in to the Microsoft Entra admin center.
1. Close the browser window.

## Create a terms of use statement

Juan wants to make sure that certain terms and conditions are known to users before they start using the application. For more information, see [Microsoft Entra terms of use](../conditional-access/terms-of-use.md).

1. In Microsoft Word, create a new document.
1. Type My terms of use, and then save the document on your computer as *mytou.pdf*.
1. Under **Manage**, in the **Conditional Access** menu, select **Terms of use**.
1. In the top menu, select **+ New terms**.
1. In the **Name** textbox, type *My TOU*.
1. In the **Display name** textbox, type *My TOU*.
1. Upload your terms of use PDF file.
1. For **Language**, select **English**.
1. For **Require users to expand the terms of use**, select **On**.
1. For **Enforce with Conditional Access policy templates**, select **Custom policy**.
1. Select **Create**.

### Add the terms of use to the policy

1. In the left menu of the tenant overview, select **Protection**.
1. Select **Conditional Access**, and then **Policies**. From the list of policies, select the *MFA Pilot* policy.
1. Under **Access controls** and **Grant**, select the controls selected link.
1. Select *My TOU*.
1. Select **Require all the selected controls**, and then choose **Select**.
1. Select **Save**.

## Create a collection in the My Apps portal

The My Apps portal enables administrators and users to manage the applications used in the organization. For more information, see [End-user experiences for applications](end-user-experiences.md).

> [!NOTE]
> Applications only appear in a user's my Apps portal after the user is assigned to the application and the application is configured to be visible to users. See [Configure application properties](add-application-portal-configure.md) to learn how to make the application visible to users.

By default, all applications are listed together on a single page. But you can use collections to group together related applications and present them on a separate tab, making them easier to find. For example, you can use collections to create logical groupings of applications for specific job roles, tasks, projects, and so on. In this section, you create a collection  and assign it to users and groups.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications** .
1. Under **Manage**, select **App launchers** > **Collections**.
1. Select **New collection**. In the New collection page, enter a **Name** for the collection (it's recommended to not use "collection" in the name). Then enter a **Description**.
1. Select the **Applications** tab. Select **+ Add application**, and then in the Add applications page, select all the applications you want to add to the collection, or use the Search box to find applications.
1. When you're finished adding applications, select **Add**. The list of selected applications appears. You can use the arrows to change the order of applications in the list.
1. Select the **Owners** tab. Select **+ Add users and groups**, and then in the Add users and groups page, select the users or groups you want to assign ownership to. When you're finished selecting users and groups, choose **Select**.
1. Select the **Users and groups** tab. Select **+ Add users and groups**, and then in the **Add users and groups** page, select the users or groups you want to assign the collection to. Or use the Search box to find users or groups. When you're finished selecting users and groups, choose **Select**.
1. Select **Review + Create**, and then select **Create**. The properties for the new collection appear.

### Check the collection in the My Apps portal

1. Open a new browser window in InPrivate or incognito mode and browse to the [My Apps](https://myapps.microsoft.com/) portal.
1. Sign in with the user account that you assigned to the application. 
1. Check that the collection you created appears in the My Apps portal.
1. Close the browser window.

## Clean up resources

You can keep the resources for future use, or if you're not going to continue to use the resources created in this tutorial, delete them with the following steps.

### Delete the application

1. In the left menu, select **Enterprise applications**. The **All applications** pane opens and displays a list of the applications in your Microsoft Entra tenant. Search for and select the application that you want to delete.
1. In the **Manage** section of the left menu, select **Properties**.
1. At the top of the **Properties** pane, select **Delete**, and then select **Yes** to confirm you want to delete the application from your Microsoft Entra tenant.

### Delete the Conditional Access policy

1. Select **Enterprise applications**.
1. Under **Protection**, select **Conditional Access**.
1. Search for and select **MFA Pilot**.
1. Select **Delete** at the top of the pane.

### Delete the group

1. Select **Identity** > **Groups**.
1. From the **All groups** page, search for and select the **MFA-Test-Group** group.
1. On the overview page, select **Delete**.

## Next steps

For information about how you can make sure that your application is healthy and being used correctly, see:
> [!div class="nextstepaction"]
> [Govern and monitor your application](tutorial-govern-monitor.md)
