---
title: Assign sensitivity labels to groups - Azure AD | Microsoft Docs
description: How to create membership rules to automatically populate groups, and a rule reference.
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 11/15/2019
ms.author: curtand
ms.reviewer: krbain
ms.custom: it-pro
ms.collection: M365-identity-device-management
---


# Assign sensitivity labels to Office 365 groups in Azure Active Directory (Public Preview)

When sensitivity labels are published in the [Microsoft 365 compliance center](https://sip.protection.office.com/homepage), you can now apply them to for Office 365 groups in Azure AD. When you apply a label to an Office 365 group the label automatically applies across workloads like Outlook, Microsoft Teams, and SharePoint.

> [!IMPORTANT]
> Using Azure AD sensitivity labels for Office 365 groups requires an Azure Active Directory Premium P1 license.

## Group policies controlled by labels

There are two policies that can be associated with a label:

- Privacy: Admins can associate a privacy setting with the label to control whether a group must be public or private.
- Guest access: Admins can enforce the guest policy for all groups that have the label assigned. This specifies whether guests are allowed to be added as members or not. If the guest policy is configured for a label, the AllowToAddGuests setting for a specific group is not modifiable for any groups with that label assigned.

## Enable sensitivity label support in PowerShell

To apply published labels to groups, you must first enable the feature. These steps enable the feature in Azure AD.

1. Open a Windows PowerShell window on your computer. You can open it without elevated privileges.

   ![open a PowerShell window to assign a sensitivity label](./media/groups-assign-sensitivity-label/powershell-command.png)

1. Run the following commands to prepare to run the cmdlets.

    In the **Sign in to your account** screen that opens, enter your admin account and password to connect you to your service, and select **Sign in**.
1. Fetch the current group settings for the Azure AD organization.
    ```$Setting = Get-AzureADDirectorySetting -Id (Get-AzureADDirectorySetting | where -Property DisplayName -Value "Group.Unified" -EQ).id```
    > [!NOTE]
    > If no group settings have been created for this Azure AD organization, you must first create the settings. Follow the steps in Azure Active Directory cmdlets for configuring group settings to create group settings for this Azure AD organization.
1. Next, display the current group settings.
    ```$Setting.Values```
1. Then enable the feature:
    ```$Setting["EnableMIPLabels"] = "True"```
1. Then save the changes and apply the settings:
    ```Set-AzureADDirectorySetting -Id $Setting.I -DirectorySetting $Setting```

That's it. You've enabled the feature and you can apply published labels to groups.

## Assign a label to a new group in Azure portal

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with a Global or Group Administrator account or as group owner.
1. Select **Groups**, and then select **New group**.
1. On the **New Group** page, fill out the required information for the new group and select a sensitivity label from the list.

   ![assign a sensitivity label in the New groups page](./media/groups-assign-sensitivity-label/new-groups-page.png)

1. Save your changes and select **Create**.

Your group is created and the policies associated with the selected label are then automatically enforced.

## Assign a label to an existing group in Azure portal

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with a Global or Group Administrator account or as group owner.
1. Select **Groups**.
1. From the **All groups** page, select the group that you want to label.
1. On the selected group's page, select **Properties** and select a sensitivity label from the list.

   ![assign a sensitivity label on the overview page for a group](./media/groups-assign-sensitivity-label/assign-to-existing.png)

1. Select **Save** to save your changes.

## Remove a label to an existing group in Azure portal

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with a Global or Group Administrator account or as group owner.
1. Select **Groups**.
1. From the **All groups** page, select the group that you want to label.
1. On the **Group** page, select **Properties** and remove the sensitivity label.

## Office 365 app support for sensitivity labels

The following Office 365 apps and services support the sensitivity labels in this preview:

- Azure AD admin center
- Microsoft 365 compliance center
- SharePoint
- Outlook on the web
- Teams
- SharePoint admin center

For more information about Office 365 apps support, see [Office 365 support for sensitivity labels](https://docs.microsoft.com/microsoft-365/compliance/sensitivity-labels-teams-groups-sites#support-for-the-new-sensitivity-labels).

## Using classic Azure AD classifications

After you enable this feature, Office 365 no longer supports the “classic” classifications for new groups. Classic classifications are the old classifications you set up by defining values for the `ClassificationList` setting in Azure AD PowerShell. When this feature is enabled, those classifications will not be applied to groups.

## Troubleshooting issues

### Sensitivity labels are not available for assignment on a group

The sensitivity label option is only displayed for groups when all the following conditions are met:

1. Labels are published in the Microsoft 365 Compliance Center for this tenant.
1. The feature is enabled, EnableMIPLabels is set to True in PowerShell.
1. The group is an Office 365 group.
1. The tenant has an active Azure Active Directory Premium P1 license.
1. The current signed-in user has access to published labels.
1. The current signed-in user has sufficient privileges to assign labels. The user must be either a Global Administrator, Group Administrator or the group owner.

Please make sure all the conditions are met in order to assign labels to a group.

### The label I want to assign is not in the list

If the label you are looking for is not in the list, this could be the case for one of the following reasons:

- The label might not be published in the Microsoft 365 Compliance Center. This could also apply to labels that are no longer published. Please check with your administrator for more information.
- The label may be published, however, it is not available to the user that is signed-in. Please check with your administrator for more information on how to get access to the label.

### How can I change the label on a group?

Labels can be swapped at any time using the same steps as assigning a label to an existing group, as follows:

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with a Global or Group administrator account or as group owner.
1. Select **Groups**.
1. From the **All groups** page, select the group that you want to label.
1. On the selected group's page, select **Properties** and select a new sensitivity label from the list.
1. Select **Save**.

## Next steps

- [Use sensitivity labels with Microsoft Teams, Office 365 groups, and SharePoint sites](https://docs.microsoft.com/microsoft-365/compliance/sensitivity-labels-teams-groups-sites)
