---
title: Manage the lifecycle of group-based licenses in Microsoft Entra ID
description: This step-by-step tutorial shows how to create an access package for managing group-based licenses in entitlement management.
services: active-directory
documentationCenter: ''
author: owinfreyATL
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.subservice: compliance
ms.date: 05/25/2023
ms.author: owinfrey
ms.collection: M365-identity-device-management


#Customer intent: As an IT admin, I want step-by-step instructions for creating an access package for managing the lifecycle of group-based licenses.

---
# Tutorial: Manage the lifecycle of your group-based licenses in Microsoft Entra ID

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]
 
With Microsoft Entra ID, you can use groups to manage the [licenses for your applications](../enterprise-users/licensing-groups-assign.md). You can make the management of these groups even easier by using entitlement management: 

* Configure periodic access reviews to ensure only employees that need the licenses are in the group. 
* Allow other employees to request membership to the group.

In this tutorial, you play the role of an IT administrator for Woodgrove Bank. You're asked to create an access package so employees in your organization can easily gain access to Office licenses. (You should already have a group that manages your [Office licenses](../enterprise-users/licensing-groups-assign.md).) You want to be able to review these group members every year. You also want to allow new employees to request Office licenses, pending manager approval.
 
To use entitlement management, you must have one of these licenses:

- Microsoft Entra ID P2 or Microsoft Entra ID Governance
- Enterprise Mobility + Security (EMS) E5

For more information, see [License requirements](entitlement-management-overview.md#license-requirements).
## Step 1: Configure basics for your access package

**Prerequisite role:** Global Administrator, Identity Governance Administrator, User Administrator, Catalog Owner, or Access Package Manager

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Identity Governance Administrator](../roles/permissions-reference.md#identity-governance-administrator).

1. Browse to **Identity governance** > **Entitlement management** > **Access package**.

1. On the **Access packages** page Select **New access package**.

1. On the **Basics** tab, in the **Name** box, enter **Office Licenses**. In the **Description** box, enter **Access to licenses for Office applications**.

1. You can leave **General** in the **Catalog** list.

## Step 2: Configure the resources for your access package

1. Select **Next: Resource roles** to go to the **Resource roles** tab.

1. On this tab, you select the resources and the resource role to include in the access package. In this scenario, select **Groups and Teams** and search for your group that has assigned [Office licenses](../enterprise-users/licensing-groups-assign.md).

1. In the **Role** list, select **Member**.

## Step 3: Configure requests for your access package

1. Select **Next: Requests** to go to the **Requests** tab.

   On this tab, you create a request policy. A *policy* defines the rules for access to an access package. You create a policy that allows employees in the resource directory to request the access package.

1. In the **Users who can request access** section, select **For users in your directory** and then select **All members (excluding guests)**. These settings make it so that only members of your directory can request Office licenses.

1. Ensure that **Require approval** is set to **Yes**.

1. Leave **Require requestor justification** set to **Yes**.

1. Leave **How many stages** set to **1**.

1. Under **Approver**, select **Manager as approver**. This option allows the requestor's manager to approve the request. You can select a different person to be the fallback approver if the system can't find the manager.

1. Leave **Decision must be made in how many days?** set to **14**.

1. Leave **Require approver justification** set to **Yes**.

1. Under **Enable new requests and assignments**, select **Yes** to enable employees to request the access package as soon as it's created.

## Step 4: Configure requestor information for your access package

1. Select **Next** to go to the **Requestor information** tab.

1. On this tab, you can ask questions to collect more information from the requestor. The questions are shown on the request form and can be either required or optional. In this scenario, you haven't been asked to include requestor information for the access package, so you can leave these boxes empty.

## Step 5: Configure the lifecycle for your access package

1. Select **Next: Lifecycle** to go to the **Lifecycle** tab.

1. In the **Expiration** section, for **Access package assignments expire**, select **Number of days**.
	
1. In **Assignments expire after**, enter **365**. This box specifies when members who have access to the access package needs to renew their access. 

1. You can also configure access reviews, which allow periodic checks of whether the employee still needs access to the access package. A review can be a self-review performed by the employee. Or you can set the employee's manager or another person as the reviewer. For more information, see [Access reviews](entitlement-management-access-reviews-create.md). 
 
    In this scenario, you want all employees to review whether they still need a license for Office each year.

    1. Under **Require access reviews**, select **Yes**.
    1. You can leave **Starting on** set to the current date. This date is when the access review starts. After you create an access review, you can't update its start date.
    1. Under **Review frequency**, select **Annually**, because the review occurs once per year. The **Review frequency** box is where you determine how often the access review runs.
    1. Specify a **Duration (in days)**.  The duration box is where you indicate how many days each occurrence of the access review series runs.
    1. Under **Reviewers**, select **Manager**.

## Step 6: Review and create your access package

1. Select **Next: Review + Create** to go to the **Review + Create** tab.

   On this tab, you can review the configuration for your access package before you create it. If there are any problems, you can use the tabs to go to a specific point in the process to make edits.

1. When you're happy with your configuration, select **Create**. After a moment, you should see a notification stating that the access package is created.

1. After the access package is created, you'll see the **Overview** page for the package. You'll find the **My Access portal link** here. Copy the link and share it with your team so your team members can request the access package to be assigned licenses for Office.

## Step 7: Clean up resources

In this step, you can delete the Office Licenses access package. 

**Prerequisite role:** Global Administrator, Identity Governance Administrator, or Access Package Manager

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Identity Governance Administrator](../roles/permissions-reference.md#identity-governance-administrator).

1. Browse to **Identity governance** > **Entitlement management** > **Access package**.

1. Open the **Office Licenses** access package. 

1. Select **Resource Roles**.

1. Select the group you added to the access package. On the details pane, select **Remove resource role**. In the message box that appears, select **Yes**.

1. Open the list of access packages.

1. For **Office Licenses**, select the ellipsis button (...) and then select **Delete**. In the message box that appears, select **Yes**.

## Next steps

Learn how to create access packages to manage access to other types of resources, like applications and sites: 

[Manage access to resources in entitlement management](./entitlement-management-access-package-first.md)
