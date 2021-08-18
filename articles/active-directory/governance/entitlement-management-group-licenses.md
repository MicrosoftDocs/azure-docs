---
title: Tutorial - Manage the lifecycle of your group-based licenses 
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
# Tutorial: Manage the lifecycle of your group-based licenses
 
With Azure Active Directory, you can use groups to manage the [licenses for your applications](/active-directory/enterprise-users/licensing-groups-assign.md). You can make the management of this group even easier using entitlement management. 

*	Configure periodic access reviews to ensure only users that need the licenses are in the group. 
*	Allow other users to request membership of the group

In this tutorial, you work for WoodGrove Bank as an IT administrator. You've been asked to create an access package to your organization to easily gain access to Office licenses. You should already have a group that manages your [Office licenses](/active-directory/enterprise-users/licensing-groups-assign.md). These users require yearly review and allow new users to request Office licenses pending manager approval. 

## Step 1: Configure Basics for your Access Package

**Prerequisite role:** Global administrator, Identity Governance administrator, User administrator, Catalog owner, or Access package manager

1. In the **Azure portal**, in the left navigation, click **Azure Active Directory**

2. In the left menu, click **Identity Governance**

3. In the left menu, click **Access Packages**. If you see Access denied, ensure that an Azure AD Premium P2 license is present in your directory

4. Click **New access package**

5. On the **Basics** tab, enter the name and description for your access package

6. You can leave the **Catalog** drop-down list set to **General**

## Step 2: Configure the Resources for your Access Package

1. Click **Next** to open the **Resource roles** tab

2. On this tab, you select the resources and the resource role to include in the access package. In this example scenario, you would click **Groups and Teams** and search for your group that has assigned Office licenses

## Step 3: Configure Requests for your Access Package

1. Click **Next** to open the **Requests** tab

2. On this tab, you create a request policy. A *policy* defines the rules or guardrails to access an access package. You create a policy that allows a specific user in the resource directory to request this access package

3. In the **Users who can request access** section, click **For users in your directory** and select **All members (excluding guests)**. 

4.	Ensure that **Require approval** is set to **Yes**

5.	The following settings allow you to configure how your approvals work for the users you selected in the step above:

    * **Require requestor justification** - sets the Justification field on the requestor form to be required
    * **How many stages** - Allows you to configure multiple stages of approval for the selected users and groups
    * **Approver** - this field has two options:
      * **Manager as approver** - This option allows the requestor's manager to approve the request. You can select some to be the Fallback approver if the system can't find the manager
      * **Choose specific approvers** - This option allows you to set specific people to be the approver(s)
    * **Decision must be made in how many days?** - Time limit for approvers
    * **Require approver justification** - Approvers must fill in the justification field for their approvals in case you want to review later

6.	Set **Enable new requests and assignments** to **Yes** to enable this access package to be requested as soon as it's created

## Step 4: Configure Requestor information for your access package

1.	Click **Next** to open the **Requestor information** tab

2.	On this screen, you can ask more questions to collect more information from your requestor. These questions are shown on their request form and can be set to required or optional

3.	Fill in any questions that are necessary and configure the type of answer you would expect.

## Step 5: Configure the Lifecycle for your access package

1. Click **Next** to open the **Lifecycle** tab

2.	In the **Expiration** section, set **Access package assignments expire** to **Number of days**
	
3.	Set **Assignments expire after** to **365** days. This field determines when members who have access to this access package will need to renew their access.

4.	You can also configure **Access Reviews** which allows periodic checks of whether the guest still needs access to the access package. A review can be a self-review or you can set their manager, specific reviews for this task. For more information, see [Access Reviews](entitlement-management-access-reviews-create.md).

    1.	Set **Require access reviews** to **Yes**
    2.	You can leave the **Starting on** to the current date - This date is when the access review campaign will start. Once an access review has been created, you can't update its start date
    3.	Set **Review frequency** to be **Annually** - This field determines how often the access review campaign runs
    4.	Specify a **Duration (in days)** - This field is how many days each occurrence of the access review series will run
    5.	For the **Reviewers**, select **Manager**

## Step 6: Review and create your access package

1.	Click **Next** to open the **Review + Create** tab

2.	On this screen, you can review the configuration for your access package before creating it. If there are any issues, you can use the tabs to navigate to a specific point in the create experience to make edits

3.	Once you're happy with your selection, click **Create**. After a few moments, you should see a notification that the access package was successfully created.

4.	When the access package has been created, you'll be taken to the **Overview** page for your access package. You can find the **My Access portal link** here. Copy the link and share it with your team so that they can request the access package to access its resources.

