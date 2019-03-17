---
title: Tutorial - Get started with Azure AD entitlement management (Preview)
description: Step-by-step tutorial for how to get started with Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: rolyon
manager: mtillman
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.subservice: compliance
ms.date: 03/17/2019
ms.author: rolyon
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management


#Customer intent: As a IT admin, I want step-by-step instructions of the entire workflow for how to use entitlement management so that I can start to use in my organization.

---
# Tutorial: Get started with Azure AD entitlement management (Preview)

> [!IMPORTANT]
> Azure Active Directory (Azure AD) entitlement management is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Intro para

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create an access package of your organization's resources
> * Demonstrate how a user from your organization can request the access package
> * Approve the access request
> * Demonstrate how a user from another organization can request the access package  

## Prerequisites

- User administrator
    - Directories that are deployed in Azure Government, China, or other specialized clouds are not currently available for use in this preview.
- Azure AD Premium P2
    - The directory where the preview is being configured must have a license for Azure AD Premium P2, or a license that contains Azure AD Premium P2 such as EMS E5. If you don't have an Azure subscription, sign up for an [EMS E5 trial](https://www.microsoft.com/en-us/cloud-platform/enterprise-mobility-security-trial) before you begin. (Note that a directory can only activate an EMS E5 trial once per directory).
- Email addresses
    - The users interacting with Azure AD entitlement management must have email addresses, either in Exchange or Exchange Online.

## Step 1: Prepare resource directory

The resource directory has one or more groups or applications and will evaluate the entitlement management preview for managing access to those resources.
In this step, you set up two additional users, the approver and internal requestor, in the resource directory. You also create two groups – one to collect users in the directory who can request access packages, and another group that will be the target resource for an access package assignment. The next step shows you how to set up a home directory, which is optional.

![Create users and groups](./media/entitlement-management-get-started/elm-users-groups.png)

1. Sign in to the [Azure portal](https://portal.azure.com) as User administrator.  

1. In the upper right of the Azure portal, make sure you signed in to the resource directory. If not, switch to the resource directory.

1. In the left navigation, click **Azure Active Directory** and then click **Properties**.

1. Record the value of the **Directory ID**.

1. In the left menu, click **Custom domain names**.

1. Record the value of the domain name that ends with **onmicrosoft.com**.

1. In the resource directory, create or configure three users. Ensure each user has a mailbox.

    | Name | Directory role | Notes |
    | --- | --- | --- |
    | **Administrator** | User administrator | This user might be the user you are already signed in as |
    | **Approver** | User |
    | **Internal requestor** | User |

1. In the resource directory, create an Azure AD security group named **Entitlement test group** with assigned membership.

    This group will be the target resource for entitlement management. The group should be empty of members to start.

1. In the resource directory, create another Azure AD security group named **Internal requestor** with assigned membership.

1. Add the **Internal requestor** user as a member of the **Internal requestor** group.

    This group represents users who are able to request the access package and are already in the resource directory.

## Step 2: Prepare users from another directory (optional)

Azure AD entitlement management uses B2B to allow a user from another organization to request access.

This step is optional. If you want to only use entitlement management for users already in your directory, you can skip to the next step.

![Create guest user](./media/entitlement-management-get-started/elm-guest-user.png)

1. In a separate directory, called the *home directory*, sign in to the Azure portal as User administrator.

1. Record the domain name of the home directory, such as **microsoft.onmicrosoft.com**.

1. Create or configure one user.

1. Ensure that user can sign in and has a mailbox.

## Step 3: Create an access package

In this step, you create a catalog, an access package, and one policy for that access package. This policy allows users who are already in the resource directory to request access.

![Create an access package](./media/entitlement-management-get-started/elm-access-package.png)

1. If you have not already signed in to the resource directory, sign in to the [Azure portal](https://portal.azure.com) as User administrator of the resource directory.

1. Navigate to the entitlement management preview administrative landing page, [https://aka.ms/elm](https://aka.ms/elm). Ensure that the directory name in the upper right of the Azure portal corresponds to the directory from Step 1.

1. Click **Catalogs** and then click **New catalog** to create your first catalog. A pane will appear on the right.

1. Type a name and a description for the catalog.

1. Change the **Visible to users outside your directory** to **Yes** and change the **Publish** setting to **Yes**.

1. Click **Create** to create the catalog.

1. Once the catalog appears in the list, click its name to open it.

1. In the left menu, click **Resources**.

1. Click **Add resources**.

1. Click the **Group** tile.

1. In the Select groups pane, select the **Entitlement test group** group you created earlier and click **Select**.

1. Click **Add** to add the group.

1. Click **Refresh** to ensure the group is visible in the list of resources in the catalog.

1. In the left menu, click **Access packages**.

1. Click **New access package**.

1. On the **Details** tab, type a name and description.

1. Leave the **Discoverable** option set to **Yes**.

1. Click **Next** to open the **Permissions** tab.

    On this tab, you select the resource roles to be include in the access package.

1. For the **Resource Type** list, select **Group**.

1. For the **Resource** list, select the **Entitlement test group** group.

1. For the **Role** list, select **Member**.

1. Click **Review + create**.

1. Check that all of the access package's settings are correct and click **Create** to create the access package.

## Step 4: Request access

In this step, you perform the steps as the internal requestor user and request access to the access package.

1. Sign out of the Azure portal.

1. Sign in to [My Access portal](https://myaccess.microsoft.com) as the **Internal requestor** user.

1. Find the X access package in the list of all access packages.

1. Click the chevron to view more details on the access package.

1. Click **Request access**.

1. In the **Business justification** box, type a justification.

1. Set the **Request for a specific period** to **Yes**.

1. Set the **Starts on** date to today and **Expires on** date to tomorrow.

1. Click **Submit**.

1. In the left menu, click **Request history** to view the status of your request. For example, whether it is pending approval or has been delivered.

## Step 5: Approve an access request

In this step, you sign in as the approver user and approve the access request for an internal requestor user.

1. Sign out of the My Access portal.

1. Sign in to [My Access portal](https://myaccess.microsoft.com) as the **Approver** user.

1. In the left menu, click **Approvals**.

1. Find the **Internal requestor** user.

1. Click **Details** to display details about the request.

1. In the **Reason** box, type a reason.

1. Click **Approve**

## Step 6: Validate that access has been assigned

1. Sign out of the My Access portal.

1. Sign in to [My Access portal](https://myaccess.microsoft.com) as the **Internal requestor** user.

1. In the left menu, click **Access package**.

1. Find the X access package. If you do no see the package, wait 5 minutes and refresh the page.

1. Click the X access package.

1. Click the **Resources** tab. You should see the **Entitlement test group**.

## Step 7: Add a policy for external users to request access (optional)

In this step, you add an additional policy for users who are not yet in the resource directory to request access.

![Create guest policy](./media/entitlement-management-get-started/elm-guest-policy.png)

**Hana**

## Step 8: Request access as an external user (optional)

**JoeC**

## Step 9: Approve an access request for an external user (optional)

**JoeC**

## Step 10: Validate that access has been assigned for an external user (optional)

**JoeC**

## Step 11: View changes in the audit log

**Hana/Mark**

## Step 12: Clean up resources


## Next steps

You can learn more about other Azure AD identity governance features, such as access reviews and privileged identity management, in the [identity governance overview](identity-governance-overview.md).
