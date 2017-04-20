---
title: Overview of PIM Resource RBAC| Microsoft Docs
description: Get an overview of the RBAC feature in PIM including Terminology and notifications
services: active-directory
documentationcenter: ''
author: barclayn
manager: mbaldwin
editor: ''

ms.assetid:
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/20/2017
ms.author: barclayn

---


# Azure PIM for Resource RBAC – Private Preview 2


Greetings, and thank you for electing to participate in an exclusive first look
at PIM for RBAC! We are thankful to have customers like you, eager to test early
versions of products we hope will bring immense value to all our customers soon.

>[!Important]
Please keep in mind the product is in early stages of development, and you may
encounter bugs. The functionality, including text and naming conventions are
subject to change, and should not be considered final. Additionally,
participation in this program is covered under your NDA, and the experiences are
not to be shared with other customers without prior approval.


In the event you have an urgent issue, or have feedback to share, please [email](pimrbacjit@service.microsoft.com)

## Terminology


**Role –** A grouping of permissions.

*Role Assignment (v.)* – The act of assigning a user or group to a role.

*Role Assignment (n.)* – The role(s) assigned to a specific user or group.

*Eligible* – A type of role assignment that indicates a user or group member may
activate a role assignment.

*Active* – The state of role assignment as it pertains to a user or group
member. A permanent role assignment is equivalent to “Always Active”, while
eligible role assignment may be inactive, active, or expired.

*Resource Owner* – A user or group assigned to the Owner or User Access
Administrator role of a specific resource in the Azure Resource Management
portal.

*Resource User* – A user or group with operational role assignment(s) to a
resource. Not expected to manage role assignment or privileged access.

*Just-In-Time (JIT)* – Activating an eligible role assignment to perform tasks
upon that resource. Also known as “Role Activation” or “Role Elevation”.

*Activation Window* – The duration of time an eligible role assignment is
active.

## Scenarios


The current build covers the following scenarios:

1.  As a **Resource User**, I can:

    1.  [Access the PIM for RBAC
        environment](#accessing-the-pim-for-azure-rbac-portal)

    2.  [View my eligible role assignments](#activation)

    3.  [Activate an eligible role](#activation)

        1.  [Specify an activation window (less than or equal to the
            maximum)](#specify-activation-duration)

        2.  [Enter a justification](#specify-justification)

        3.  [Succeed Multi-Factor Authentication (if
            required)](#activation-with-mfa)

    4.  use the [PIMAzureRbac_v1.0.ps1 PowerShell script](#powershell-script)
        to: - **NEW!**

        1.  [List my eligible role assignments](#powershell-documentation)

        2.  [Activate an eligible role assignment](#powershell-documentation)

        3.  [Deactivate an active role assignment](#powershell-documentation)

2.  As a **Resource Owner**, I can do all the above scenarios, as well as:

    1.  [View resource roles and role assignments](#user-table)

    2.  [Manage resource role assignments including](#user-table)

        1.  [Assign (add) a user or group to a role as
            eligible](#add-assign-a-user)

        2.  [Specify a role assignment expiration date](#add-assign-a-user)

        3.  [Remove role assignments](#user-settings)

    3.  [Manage default role settings including](#role-settings)

        1.  [Require MFA to activate](#role-settings)

        2.  [Maximum activation duration](#role-settings)

    4.  [Review subscription owner role assignment access](#access-reviews) –
        **NEW!**

    5.  [View eligible user activation history
        including](#activation-history-audit) – **NEW!**

        1.  [Resource specific events (activities) within activation
            windows](#activation-history-audit) – **NEW!**

    6.  [View and manage role assignment notifications](#notifications-alerts) –
        **NEW!**

        1.  [Fix notifications](#fix-a-notification) – **NEW!**

## Items of note & Known issues


-   Members of the Subscription Admins in the classic Azure portal cannot be
    explicitly added to the Owner role of a resource. These users are already
    considered “Owner” of the resource.

-   Subscription Admins and Co-administrators are represented as a group in the
    PIM for Azure RBAC environment. This group cannot be expanded to see current
    membership.

-   Co-administrators must be removed from the classic portal interface before
    adding them to the Owner role.

-   Users or group members with an Owner role assignment subordinate to a
    Subscription resource must modify the Resource Filter to access the
    resource.

-   Filters are not persistent and must be set each time you return to the All
    Resources view.

## Environment/Walkthrough


### Primary Left Navigation (Nav)

For the scenarios covered in this preview, you will have access to the “Azure
Resources” tab under Manage, and the “Activate” tab under My Actions. The
“Directory Roles” tab will open a blade with a link-out to Azure AD PIM in the
event you need access to that environment.

![](media/azure-pim-resource-rbac/image001.png)

### Subscription Filter

If you have access to multiple subscriptions, you may multi-select only the
subscriptions relative to your needs.

![](media/azure-pim-resource-rbac/image003.png)

### Resource Filter

Allows you to modify what resources are visible for management. Subscription is
set as the default filter.

![](media/azure-pim-resource-rbac/image005.png)

### Search bar

Allows you to search for resources. The search bar is constrained by the filters
applied above it.

![](media/azure-pim-resource-rbac/image007.png)

### Resource Table

This table displays the resource by Resource Name, the type of resource, number
of roles, and members in all roles of the resource.

![](media/azure-pim-resource-rbac/image009.png)

### Resource selection & Access

In the image below, the user has selected the Subscription resource. This
particular user only has read permissions to the subscription, and is unable to
see role information at this level.

![](media/azure-pim-resource-rbac/image011.png)

When the user modifies the resource filter for Resource Group, they can see the
will then see the Resource Groups associated with the Subscription.

![](media/azure-pim-resource-rbac/image013.png)

Upon selecting the Resource Group, note that the user can see details about the
resource.

![](media/azure-pim-resource-rbac/image015.png)

### User Table

Selecting the “Users” tab in the Secondary Left Nav will display the user table.
Column header and other details to note in this view are as follows:

**MSPIM User Account** – This account is used by the PIM service to perform
just-in-time (JIT) activation on-behalf of a user. Please do not remove this
account.

**Subscription Admins** – This account is a representation of the Subscription
Admins group from the classic portal (this includes Co-Administrators). This
group cannot be managed.

-   **Role** – Indicates the specific role for that user

-   **Email** – Email address of the User or Group

-   **JIT Required** – Indication a User or Group Member must activate their
    role to perform any operations that role permits

-   **Activated** – Indicates a user has activated their role. Users with
    permanent access (JIT Required = No), will always show Yes in this column.

-   **Assignment Type** – Indicates if membership in the role is directly
    assigned, or inherited by a parent resource role. For more information on
    role inheritance, [please see this
    article](../active-directory/role-based-access-control-configure#view-access.md).

-   **Active Through** – Shows the date/time role activation (JIT) will expire.
    Permanent users will always show as Permanent.

-   **Eligible Through** – Shows the date/time the user or group will be removed
    from the role. Users or groups showing “Direct” as their “Assignment Type”
    may be modified by users or group members in the Owner role of this
    resource, or a parent resource. Once updated, the user or group will show a
    date/time in this column.

![](media/azure-pim-resource-rbac/image017.png)

### Role Settings

Selecting role settings at the top of the User Table opens the role selector to
the right of the User Table. Selecting a role from the list allows you to modify
the settings for that role.

>[!NOTE]
Settings only apply to users, or members of groups, with JIT Required =
Yes, and Assignment Type = Direct in the Role you are modifying.*

The settings for Private Preview 2 are as follows:

**Maximum Allowed Role Activation Duration** – Specify the number of days,
hours, minutes and seconds a user can activate their role.

**Require MFA for Activation** – Enable this setting to require MFA during role
activation. This does not apply to Permanent users.

![](media/azure-pim-resource-rbac/image019.png)

### User Settings

To view specific details about a user, remove the user, or to modify settings;
select the role of the user in the table. To remove the user, click “Remove” in
the User Details blade.

![](media/azure-pim-resource-rbac/image021.png)

Select “Change Settings” to make changes for this user.

>[!NOTE]
You are only able to modify settings of users with Assignment Type =
Direct in the resource role for which you are Owner.*

-   Select “Yes” for “Does the selected user require activation for access?” to
    require JIT.

-   Select “No” for “Do you want to grant permanent access to the selected
    user?” to specify a date the user or group will be removed from the role.
    Specify a date/time, and click “Update” at the bottom of the window.

![](media/azure-pim-resource-rbac/image023.png)

### Add (Assign) a user

To add (assign) a user to a role, select the “+Add User” button at the top of
the user table window. This will open the add user window to the right.

![](media/azure-pim-resource-rbac/image025.png)

Select a role from the list:

![](media/azure-pim-resource-rbac/image027.png)

Next, select a user or group:

![](media/azure-pim-resource-rbac/image029.png)

Add User to role - Settings

-   JIT Required = **Yes (default)**/No

-   Grant Permanent Access = Yes/**No (default)**

-   Eligible Through = Today (Current date/time) + 1 year

>[!NOTE]
If you do not modify these settings, you can simply close the Membership
settings window by clicking the x at the top*.

![](media/azure-pim-resource-rbac/image031.png)

Click Add at the bottom of the window:

![](media/azure-pim-resource-rbac/image033.png)

A “Success” notification will appear when the user is added to the role:

![](media/azure-pim-resource-rbac/image035.png)

### Role View

In the Role View, each role appears with a list of memberships. You’ll notice
the user we added in the above scenario shows in the Contributor role, with JIT
Required = Yes, and an Eligible Through of one year from today’s date and time.

![](media/azure-pim-resource-rbac/image037.png)

>[!Note]
 All user and role configuration options available in the User Table view
are also available in the Role View.*

## Activation

To activate a role, an eligible user navigates to the Azure PIM for RBAC
environment. Depending on their existing role memberships within various
subscriptions, they may or may not see any information upon accessing the
portal. In the example below, Dave Thomas is eligible to activate roles in a
single subscription. Since his roles are not active, he sees no resources in the
list.

![](media/azure-pim-resource-rbac/image039.png)

Selecting the “Activate” tab from the primary left nav will display his eligible
roles for activation:

![](media/azure-pim-resource-rbac/image041.png)

Selecting the role for activation opens the activation window below:

![](media/azure-pim-resource-rbac/image043.png)

### Activation with MFA

If the role requires MFA for activation, an orange banner will appear at the top
of the window. Selecting this banner informs the user they must succeed MFA
before proceeding, and allows them to do so.

![](media/azure-pim-resource-rbac/image045.png)

If required, click “Verify my identity”:

![](media/azure-pim-resource-rbac/image047.png)

You will then be taken through the MFA experience

![](media/azure-pim-resource-rbac/image049.png)

After succeeding MFA, you’ll be returned to the list of roles for activation.
Click Activate.

![](media/azure-pim-resource-rbac/image051.png)

### Specify Activation Duration

In the “Activations” window, the default (maximum) duration is already
displayed. Enter a justification.

![](media/azure-pim-resource-rbac/image053.png)

>[!Note]
You can activate a role for any duration between 1 second and the maximum
specified in the role settings.*

### Specify Justification

![](media/azure-pim-resource-rbac/image055.png)

Once activation is complete, you may navigate to the resource from the left most
Azure navigation (the vertical black icon bar) in the image below.

![](media/azure-pim-resource-rbac/image057.png)

### Deactivate a role

If a user completes their work before the activation expires, they may
deactivate their role by returning to the PIM for Azure RBAC environment,
selecting “Activate” under “My Actions” to view the list of active roles.

![](media/azure-pim-resource-rbac/image059.png)

Selecting the role opens the Activations window. Click Deactivate.

![](media/azure-pim-resource-rbac/image061.png)

A confirmation notification will appear at the top of the screen.

![](media/azure-pim-resource-rbac/image063.png)

At this point the user no longer has access to the resources in the portal.

![](media/azure-pim-resource-rbac/image065.png)

## Accessing the PIM for Azure RBAC portal

To access the portal, enter the below short-link in your web browser.

Aka.ms/PIMazureRBAC

>[!Note]
There are known issues with IE. Please use Edge, Chrome, or Firefox.*

**As a reminder, please submit feedback, suggestions, comments, or ideas to:**
<PIMRBACJIT@service.microsoft.com>

## Activation History (Audit)

After logging into the environment (and activating your role, if required),
navigate to a specific resource (i.e. Subscription).

![](media/azure-pim-resource-rbac/image067.png)

Selecting the resource will open the “Overview” blade. Select “Users” and find a
user with activity.

![](media/azure-pim-resource-rbac/image069.png)

Selecting the user will open the “User Details” blade. This blade has two
important sections. The bar chart called “Resource Activity Summary”, which
shows the number of activities the user performed in the Azure Resource
management portal on a given date. The date range is configurable after the page
loads. Below the bar chart is the Role Activations section, which shows the
activation (and deactivation) history for the specific user. Each row within
this table represents an activation window, and is selectable.

![](media/azure-pim-resource-rbac/image071.png)

Selecting an activation window will open a new blade to the right, that displays
the user’s role activity at the top, and the associated Azure resource activity
below. Role activity may include such activities as assigning another user to a
role, modifying role settings, requesting activation of another role, or
deactivating their role.

![](media/azure-pim-resource-rbac/image073.png)

## Access Reviews

In Private Preview 2, the service supports reviewing access of Subscription
resource, owners. To begin a review, as an owner of a subscription, select the
“Review Access Assignments” navigation option.

![](media/azure-pim-resource-rbac/image075.png)

Input the required information such as title, start/end date, and reviewers.

![](media/azure-pim-resource-rbac/image077.png)

When selecting “Review role membership” option (required), be sure to select
Owner. Other roles are not yet supported.

>[!NOTE]
The required “Review role membership” section will take approximately
20 seconds to load.

![](media/azure-pim-resource-rbac/image079.png)

If an existing review is in-progress, a notification will appear but does not
prevent the creation of a new access review.

![](media/azure-pim-resource-rbac/image081.png)

When selecting reviewers, there are three options. Me, meaning you (the person
initiating the review) will review the memberships. Members review themselves;
each member of the owner role will receive an email asking to review their own
access. Select reviewer, opens a user picker, to search for and select specific
reviewers.

![](media/azure-pim-resource-rbac/image083.png)

Once all the required information is complete, select “Start” at the bottom of
the blade.

Once the review is underway, a list of active reviews is displayed in the main
blade.

![](media/azure-pim-resource-rbac/image084.png)

Selecting one of the reviews opens the access review. If you’ve been designated
as a reviewer, you may select one, multiple, or all the users listed. Enter a
justification (if required) and click approve, or deny. The reset button clears
the selections. After responding, the status is displayed in the list of active
reviews.

![](media/azure-pim-resource-rbac/image087.png)

Reviews are active until the designated end date. If all reviewers have
completed the review, it may be ended early, and results may be applied.

To end a review, send a reminder to reviewers, modify settings, and more, select
the “Current access reviews for Azure RBAC roles” from the overview blade:

![](media/azure-pim-resource-rbac/image088.png)

This will open the list of all active, and completed reviews.

![](media/azure-pim-resource-rbac/image090.png)

From this view, selecting an active review allows you to view status, reset the
current responses, or delete the review.

![](media/azure-pim-resource-rbac/image092.png)

When a completed review has ended, you may apply the results provided by the
reviewers.

![](media/azure-pim-resource-rbac/image094.png)

Selecting “Apply” will display a prompt communicating the memberships that will
be removed.

![](media/azure-pim-resource-rbac/image096.png)

Selecting yes will trigger the membership removal. To view the details, select
“Approvals” from the left navigation.

![](media/azure-pim-resource-rbac/image098.png)

Selecting a user from this list will display the user’s activity details.

In the access reviews list, default review options such as duration,
notifications, reminders, and require reason on approval are accessible here.

![](media/azure-pim-resource-rbac/image100.png)

## Notifications (Alerts)

Notifications may be accessed from the left navigation of a subscription
resource

![](media/azure-pim-resource-rbac/image102.png)

To adjust notification thresholds, select the “Settings” option at the top of
the blade.

![](media/azure-pim-resource-rbac/image104.png)

Select a notification to configure

![](media/azure-pim-resource-rbac/image106.png)

In the settings blade, two options appear for configuration. The first, “Minimum
number of resource Owners to trigger computation of percentage (see next setting
below)”. This value determines when the service will calculate the threshold
value “Minimum percentage of resource Owners out of total Owners to trigger an
alert”.

### Too many owners assigned to a resource

This notification is useful to determine the number of users assigned to the
resource as owner, in comparison to all users with any role assignment.

**Consider the following example:** There are 50 users with various role
assignments in your subscription. There are currently 10 users assigned to the
owner role. You set the minimum threshold to 10, and the percentage of owners to
21%. The effect of this configuration is, adding a user to the resource as owner
will trigger the notification.

### Too many permanent owners assigned to a resource

This notification is useful to identify permanent owner role assignment.

**Consider the following example:** There are 10 users assigned to owner role of
a subscription resource. Three of the assigned users are eligible (require
activation), the remaining seven are permanent. I’ve conferred with my security
team, and identified no more than 10% of owners should be permitted to have
permanent access at all times. This notification will continue to trigger until
nine of the ten users are made eligible (required to activate).

![](media/azure-pim-resource-rbac/image108.png)

### Duplicate role created – Coming Soon!

This alert will display a notification when a custom role (created in PowerShell
or Azure CLI) is created with similar permissions and/or role assignments as an
existing custom role, or built-in role.

### Fix a notification

To fix a notification, select it from the list of notifications and review the
information.

![](media/azure-pim-resource-rbac/image110.png)

Select a group or user that should be removed from the role members, and click
submit.

![](media/azure-pim-resource-rbac/image112.png)

When the status updates, the user or group is no longer a member of the role.

![](media/azure-pim-resource-rbac/image114.png)

You may have to remove additional assignments to resolve the notification.

## Next steps

???
