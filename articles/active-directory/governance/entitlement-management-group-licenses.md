---
title: Tutorial - Manage the lifecycle of your group-based licenses in Azure AD
description: Step-by-step tutorial for how to create an access package for managing group-based licenses in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: sama
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.subservice: compliance
ms.date: 08/18/2021
ms.author: sama
ms.collection: M365-identity-device-management


#Customer intent: As a IT admin, I want step-by-step instructions for creating an access package for Managing the lifecycle of your group-based licenses.

---
# Tutorial: Manage the lifecycle of your group-based licenses in Azure AD
 
With Azure Active Directory, you can use groups to manage the [licenses for your applications](/active-directory/enterprise-users/licensing-groups-assign.md). You can make the management of this group even easier using entitlement management. 

*	Configure periodic access reviews to ensure only users that need the licenses are in the group. 
*	Allow other users to request membership of the group

In this tutorial, you work for WoodGrove Bank as an IT administrator. You've been asked to create an access package to your organization to easily gain access to Office licenses. You should already have a group that manages your [Office licenses](/active-directory/enterprise-users/licensing-groups-assign.md). These users require yearly review and allow new users to request Office licenses pending manager approval. 
To use Azure AD entitlement management, you must have one of the following licenses:

- Azure AD Premium P2
- Enterprise Mobility + Security (EMS) E5 license
For more information, see [License requirements](entitlement-management-overview.md#license-requirements).
## Step 1: Configure Basics for your Access Package

**Prerequisite role:** Global administrator, Identity Governance administrator, User administrator, Catalog owner, or Access package manager

1. In the **Azure portal**, in the left navigation, click **Azure Active Directory**.

2. In the left menu, click **Identity Governance**.

3. In the left menu, click **Access Packages**. 

4. Click **New access package**.

5. On the **Basics** tab, enter the name **Office Licenses** and description **Access to licenses for Office applications**.

6. You can leave the **Catalog** drop-down list set to **General**.

## Step 2: Configure the Resources for your Access Package

1. Click **Next** to open the **Resource roles** tab.

2. On this tab, you select the resources and the resource role to include in the access package. In this example scenario, you would click **Groups and Teams** and search for your group that has assigned [Office licenses](/active-directory/enterprise-users/licensing-groups-assign.md).

3. In the **Role** drop-down list, select **Member**.

## Step 3: Configure Requests for your Access Package

1. Click **Next** to open the **Requests** tab.

2. On this tab, you create a request policy. A *policy* defines the rules or guardrails to access an access package. You create a policy that allows a specific user in the resource directory to request this access package.

3. In the **Users who can request access** section, click **For users in your directory** and select **All members (excluding guests)**. This makes it so that only members of your directory will be able to request Office licenses.

4. Ensure that **Require approval** is set to **Yes**.

5. For **Require requestor justification**, leave this as **Yes**.

6. For **How many stages** leave this as **1**.

7. For **Approver**, select **Manager as approver**. This option allows the requestor's manager to approve the request. You can select a different person to be the Fallback approver if the system can't find the manager.

8. **Decision must be made in how many days?** leave this as **14**.

9. **Require approver justification** leave this as **Yes**.

10. Set **Enable new requests and assignments** to **Yes** to enable this access package to be requested as soon as it's created.

## Step 4: Configure Requestor information for your access package

1. Click **Next** to open the **Requestor information** tab.

2. On this screen, you can ask more questions to collect more information from your requestor. These questions are shown on their request form and can be set to required or optional. In this scenario, you haven't been asked to include requestor information for this access package, so you can leave those fields empty.

## Step 5: Configure the Lifecycle for your access package

1. Click **Next** to open the **Lifecycle** tab.

2. In the **Expiration** section, set **Access package assignments expire** to **Number of days**.
	
3. Set **Assignments expire after** to **365** days. This field determines when members who have access to this access package will need to renew their access. 

4. You can also configure **Access Reviews** which allows periodic checks of whether the user still needs access to the access package. A review can be a self-review performed by the user or you can set their manager, or another specific reviewer for this task. For more information, see [Access Reviews](entitlement-management-access-reviews-create.md). For this scenario, you will want each user to review whether they still need a license for Office each year.

    1.	Set **Require access reviews** to **Yes**.
    2.	You can leave the **Starting on** to the current date. The starting on date is when the access review campaign will start. Once an access review has been created, you can't update its start date.
    3.	Set **Review frequency** to be **Annually**, since the review will occur once per year. The review frequency field is where you determine how often the access review campaign runs.
    4.	Specify a **Duration (in days)**.  The duration field is where you indicate how many days each occurrence of the access review series will run.
    5.	For the **Reviewers**, select **Manager**.

## Step 6: Review and create your access package

1. Click **Next** to open the **Review + Create** tab.

2. On this screen, you can review the configuration for your access package before creating it. If there are any issues, you can use the tabs to navigate to a specific point in the create experience to make edits.

3. Once you're happy with your selection, click **Create**. After a few moments, you should see a notification that the access package was successfully created.

4. When the access package has been created, you'll be taken to the **Overview** page for your access package. You can find the **My Access portal link** here. Copy the link and share it with your team so that they can request the access package to be assigned licenses for Office.

## Step 7: Clean up resources

In this step, you can delete the **Office Licenses** access package. 

**Prerequisite role:** Global administrator, Identity Governance administrator or Access package manager

1. In the **Azure portal**, in the left navigation, click **Azure Active Directory**.

2. In the left menu, click **Identity Governance**.

3. In the left menu, click **Access Packages**. 

4. Open the **Office Licenses** access package. 

5. Click **Resource Roles**.

6. Select the group you added to this access package and in the details pane click **Remove resource role**. In the message that appears, click **Yes**.

7. Open the list of access packages.

8. For **Office Licenses**, click the ellipsis (...) and then click **Delete**. In the message that appears, click **Yes**.

## Next steps

Learn about creating access packages to manage access to other types of resources such as applications, and sites. [Tutorial: Manage access to resources in Azure AD entitlement management](/active-directory/governance/entitlement-management-access-package-first.md)
