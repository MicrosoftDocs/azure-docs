---
title: Tutorial - Pilot Azure AD Connect cloud sync for an existing synced AD forest
description: Learn how to pilot cloud sync for a test Active Directory forest that is already synced using Azure Active Directory (Azure AD) Connect sync.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 03/22/2021
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# Pilot cloud sync for an existing synced AD forest

This tutorial walks you through piloting cloud sync for a test Active Directory forest that is already synced using Azure Active Directory (Azure AD) Connect sync.

![Create](media/tutorial-migrate-aadc-aadccp/diagram-2.png)

## Considerations

Before you try this tutorial, consider the following items:

1. Ensure that you're familiar with basics of cloud sync.

2. Ensure that you're running Azure AD Connect sync version 1.4.32.0 or later and have configured the sync rules as documented. When piloting, you will be removing a test OU or group from Azure AD Connect sync scope. Moving objects out of scope leads to deletion of those objects in Azure AD. In case of user objects, the objects in Azure AD are soft-deleted and can be restored. In case of group objects, the objects in Azure AD are hard-deleted and cannot be restored. A new link type has been introduced in Azure AD Connect sync which will prevent the deletion in case of a piloting scenario.

3. Ensure that the objects in the pilot scope have ms-ds-consistencyGUID populated so cloud sync hard matches the objects.

   > [!NOTE]
   > Azure AD Connect sync does not populate *ms-ds-consistencyGUID* by default for group objects.

4. This is an advanced scenario. Ensure that you follow the steps documented in this tutorial precisely.

## Prerequisites

The following are prerequisites required for completing this tutorial

- A test environment with Azure AD Connect sync version 1.4.32.0 or later
- An OU or group that is in scope of sync and can be used the pilot. We recommend starting with a small set of objects.
- A server running Windows Server 2012 R2 or later that will host the provisioning agent.
- Source anchor for Azure AD Connect sync should be either *objectGuid* or *ms-ds-consistencyGUID*

## Update Azure AD Connect

As a minimum, you should have [Azure AD connect](https://www.microsoft.com/download/details.aspx?id=47594) 1.4.32.0. To update Azure AD Connect sync, complete the steps in [Azure AD Connect: Upgrade to the latest version](../hybrid/how-to-upgrade-previous-version.md).  

## Stop the scheduler

Azure AD Connect sync synchronizes changes occurring in your on-premises directory using a scheduler. In order to modify and add custom rules, you want to disable the scheduler so that synchronizations will not run while you are working on this.  Use the following steps:

1. On the server that is running Azure AD Connect sync open PowerShell with Administrative Privileges.
2. Run `Stop-ADSyncSyncCycle`.  Hit Enter.
3. Run `Set-ADSyncScheduler -SyncCycleEnabled $false`.

>[!NOTE]
>If you are running your own custom scheduler for Azure AD Connect sync, then please disable the scheduler.

## Create custom user inbound rule

 1. Launch the synchronization editor from the application menu in desktop as shown below:</br>
 ![Synchronization Rule Editor Menu](media/tutorial-migrate-aadc-aadccp/user-8.png)</br>

 2. Select **Inbound** from the drop-down list for Direction and click on **Add new rule**.
 ![Screenshot that shows the "View and manage your synchronization rules" window with "Inbound" and the "Add new rule" button selected.](media/tutorial-migrate-aadc-aadccp/user-1.png)</br>

 3. On the **Description** page, enter the following and click **Next**:

    **Name:** Give the rule a meaningful name<br>
    **Description:** Add a meaningful description<br>
    **Connected System:** Choose the AD connector that you are writing the custom sync rule for<br>
    **Connected System Object Type:** User<br>
    **Metaverse Object Type:** Person<br>
    **Link Type:** Join<br>
    **Precedence:** Provide a value that is unique in the system<br>
    **Tag:** Leave this empty<br>
    ![Screenshot that shows the "Create inbound synchronization rule - Description" page with values entered.](media/tutorial-migrate-aadc-aadccp/user-2.png)</br>

 4. On the **Scoping filter** page, enter the OU or security group that you want the pilot based off.  To filter on OU, add the OU portion of the distinguished name. This rule will be applied to all users who are in that OU. So, if DN ends with "OU=CPUsers,DC=contoso,DC=com, you would add this filter.  Then click **Next**.

    |Rule|Attribute|Operator|Value|
    |-----|----|----|-----|
    |Scoping OU|DN|ENDSWITH|Distinguished name of the OU.|
    |Scoping group||ISMEMBEROF|Distinguished name of the security group.|

    ![Screenshot that shows the **Create inbound synchronization rule - Scoping filter** page with a scoping filter value entered.](media/tutorial-migrate-aadc-aadccp/user-3.png)</br>

 5. On the **Join** rules page, click **Next**.
 6. On the **Transformations** page, add a Constant transformation: flow True to cloudNoFlow attribute. Click **Add**.
 ![Screenshot that shows the **Create inbound synchronization rule - Transformations** page with a **Constant transformation** flow added.](media/tutorial-migrate-aadc-aadccp/user-4.png)</br>

Same steps need to be followed for all object types (user, group and contact). Repeat steps per configured AD Connector / per AD forest.

## Create custom user outbound rule

 1. Select **Outbound** from the drop-down list for Direction and click on **Add rule**.
 ![Screenshot that shows the **Outbound** Direction selected and the **Add new rule** button highlighted.](media/tutorial-migrate-aadc-aadccp/user-5.png)</br>

 2. On the **Description** page, enter the following and click **Next**:

    **Name:** Give the rule a meaningful name<br>
    **Description:** Add a meaningful description<br>
    **Connected System:** Choose the Azure AD connector that you are writing the custom sync rule for<br>
    **Connected System Object Type:** User<br>
    **Metaverse Object Type:** Person<br>
    **Link Type:** JoinNoFlow<br>
    **Precedence:** Provide a value that is unique in the system<br>
    **Tag:** Leave this empty<br>

    ![Screenshot that shows the **Description** page with properties entered.](media/tutorial-migrate-aadc-aadccp/user-6.png)</br>

 3. On the **Scoping filter** page, choose **cloudNoFlow** equal **True**. Then click **Next**.
 ![Custom rule](media/tutorial-migrate-aadc-aadccp/user-7.png)</br>

 4. On the **Join** rules page, click **Next**.
 5. On the **Transformations** page, click **Add**.

Same steps need to be followed for all object types (user, group and contact).

## Install the Azure AD Connect provisioning agent

1. Sign in to the server you will use with enterprise admin permissions.  If you are using the  [Basic AD and Azure environment](tutorial-basic-ad-azure.md) tutorial it would be CP1.

1. Download the Azure AD Connect cloud provisioning agent using the steps outlined [here](how-to-install.md#install-the-agent).

1. Run the Azure AD Connect cloud sync (AADConnectProvisioningAgent.Installer)
1
. On the splash screen, **Accept** the licensing terms and click **Install**.

    ![Screenshot that shows the **Microsoft Azure A D Connect Provisioning Agent** splash screen.](media/how-to-install/install-1.png)</br>

1. Once this operation completes, the configuration wizard will launch.  Sign in with your Azure AD global administrator account.

1. On the **Connect Active Directory** screen, click **Add directory** and then sign in with your Active Directory administrator account.  This operation will add your on-premises directory. Click **Next**.

    ![Screenshot that shows the **Connect Active Directory** screen with a directory value entered.](media/how-to-install/install-3a.png)

1. On the **Configuration complete** screen, click **Confirm**.  This operation will register and restart the agent.

    ![Screenshot that shows the **Configuration complete** screen with the **Confirm** button selected.](media/how-to-install/install-4a.png)

1. Once this operation completes you should see a notice **Your was successfully verified.**  You can select **Exit**.

    ![Welcome screen](media/how-to-install/install-5.png)</br>

1. If you still see the initial splash screen, click **Close**.

## Verify agent installation

Agent verification occurs in the Azure portal and on the local server that is running the agent.

### Azure portal agent verification

To verify the agent is being seen by Azure follow these steps:

1. Sign in to the Azure portal.
2. On the left, select **Azure Active Directory**, click **Azure AD Connect** and in the center select **Manage cloud sync**.</br>
![Azure portal](media/how-to-install/install-6.png)</br>

3. On the **Azure AD Connect cloud sync** screen click **Review all agents**.
![Azure AD Provisioning](media/how-to-install/install-7.png)</br>

4. On the **On-premises provisioning agents screen** you will see the agents you have installed.  Verify that the agent in question is there and is marked **Disabled**.  The agent is disabled by default
![Provisioning agents](media/how-to-install/verify-1.png)</br>

### On the local server

To verify that the agent is running follow these steps:

1. Log on to the server with an administrator account
2. Open **Services** by either navigating to it or by going to Start/Run/Services.msc.
3. Under **Services** make sure **Microsoft Azure AD Connect Agent Updater** and **Microsoft Azure AD Connect Provisioning Agent** are there and the status is **Running**.

    ![Services](media/how-to-install/troubleshoot-1.png)

## Configure Azure AD Connect cloud sync

Use the following steps to configure provisioning:

1. Sign-in to the Azure AD portal.
2. Click **Azure Active Directory**
3. Click **Azure AD Connect**
4. Select **Manage cloud sync**
    ![Screenshot showing "Manage cloud sync" link.](media/how-to-configure/manage-1.png)</br>
5. Click **New Configuration**
    ![Screenshot of Azure AD Connect cloud sync screen with "New configuration" link highlighted.](media/tutorial-single-forest/configure-1.png)</br>
6. On the configuration screen, enter a **Notification email**, move the selector to **Enable** and click **Save**.
    ![Screenshot of Configure screen with Notification email filled in and Enable selected.](media/tutorial-single-forest/configure-2.png)</br>
7. Under **Configure**, select **All users** to change the scope of the configuration rule.
    ![Screenshot of Configure screen with "All users" highlighted next to "Scope users".](media/how-to-configure/scope-2.png)</br>
8. On the right, change the scope to include the specific OU you just created "OU=CPUsers,DC=contoso,DC=com".
    ![Screenshot of the Scope users screen highlighting the scope changed to the OU you created.](media/tutorial-existing-forest/scope-2.png)</br>
9. Click **Done** and **Save**.
10. The scope should now be set to one organizational unit.
    ![Screenshot of Configure screen with "1 organizational unit" highlighted next to "Scope users".](media/tutorial-existing-forest/scope-3.png)</br>

## Verify users are provisioned by cloud sync

You will now verify that the users that you had in our on-premises directory have been synchronized and now exist in out Azure AD tenant.  Be aware that this may take a few hours to complete.  To verify users are provisioning by cloud sync, follow these steps:

1. Browse to the [Azure portal](https://portal.azure.com) and sign in with an account that has an Azure subscription.
2. On the left, select **Azure Active Directory**
3. Click on **Azure AD Connect**
4. Click on **Manage cloud sync**
5. Click on **Logs** button
6. Search for a username to confirm that the user is provisioned by cloud sync

Additionally, you can verify that the user and group exist in Azure AD.

## Start the scheduler

Azure AD Connect sync synchronizes changes occurring in your on-premises directory using a scheduler. Now that you have modified the rules, you can re-start the scheduler.  Use the following steps:

1. On the server that is running Azure AD Connect sync open PowerShell with Administrative Privileges
2. Run `Set-ADSyncScheduler -SyncCycleEnabled $true`.
3. Run `Start-ADSyncSyncCycle`, then press <kbd>Enter</kbd>.

> [!NOTE]
> If you are running your own custom scheduler for Azure AD Connect sync, then please enable the scheduler.

Once the scheduler is enabled, Azure AD Connect will stop exporting any changes on objects with `cloudNoFlow=true` in the metaverse, unless any reference attribute (such as `manager`) is being updated. In case there is any reference attribute update on the object, Azure AD Connect will ignore the `cloudNoFlow` signal and export all updates on the object.

## Something went wrong

In case the pilot does not work as expected, you can go back to the Azure AD Connect sync setup by following the steps below:

1. Disable provisioning configuration in the Azure portal.
2. Disable all the custom sync rules created for Cloud Provisioning using the Sync Rule Editor tool. Disabling should cause full sync on all the connectors.

## Next steps

- [What is provisioning?](what-is-provisioning.md)
- [What is Azure AD Connect cloud sync?](what-is-cloud-sync.md)
