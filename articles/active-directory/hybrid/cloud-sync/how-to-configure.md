---
title: 'Microsoft Entra Connect cloud sync new agent configuration'
description: This article describes how to install cloud sync.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 08/14/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Create a new configuration for Microsoft Entra Connect cloud sync

The following document will guide you through configuring Microsoft Entra Connect cloud sync.  

The following documentation demonstrates the new guided user experience for Microsoft Entra Connect cloud sync.  If you are not seeing the images below, you need to select the **Preview features** at the top.  You can select this again to revert back to the old experience.

 :::image type="content" source="media/how-to-configure/new-ux-configure-19.png" alt-text="Screenshot of enable preview features." lightbox="media/how-to-configure/new-ux-configure-19.png":::

For additional information and an example of how to configure cloud sync, see the video below.


> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RWKact]


## Configure provisioning
To configure provisioning, follow these steps.

 [!INCLUDE [sign in](../../../../includes/cloud-sync-sign-in.md)]
 
 :::image type="content" source="media/how-to-on-demand-provision/new-ux-1.png" alt-text="Screenshot of new UX screen." lightbox="media/how-to-on-demand-provision/new-ux-1.png":::
 
 3. Select **New configuration**.
 :::image type="content" source="media/how-to-configure/new-ux-configure-1.png" alt-text="Screenshot of adding a configuration." lightbox="media/how-to-configure/new-ux-configure-1.png":::
 4. On the configuration screen, select your domain and whether to enable password hash sync.  Click **Create**.  
 
 :::image type="content" source="media/how-to-configure/new-ux-configure-2.png" alt-text="Screenshot of a new configuration." lightbox="media/how-to-configure/new-ux-configure-2.png":::

 5.  The **Get started** screen will open.  From here, you can continue configuring cloud sync.

  :::image type="content" source="media/how-to-configure/new-ux-configure-3.png" alt-text="Screenshot of the getting started screen." lightbox="media/how-to-configure/new-ux-configure-3.png":::

 6. The configuration is split in to the following 5 sections.

|Section|Description|
|-----|-----|
|1. Add [scoping filters](#scope-provisioning-to-specific-users-and-groups)|Use this section to define what objects appear in Microsoft Entra ID|
|2. Map [attributes](#attribute-mapping)|Use this section to map attributes between your on-premises users/groups with Microsoft Entra objects|
|3. [Test](#on-demand-provisioning)|Test your configuration before deploying it|
|4. View [default properties](#accidental-deletions-and-email-notifications)|View the default setting prior to enabling them and make changes where appropriate|
|5. Enable [your configuration](#enable-your-configuration)|Once ready, enable the configuration and users/groups will begin synchronizing|

 >[!NOTE]
 >  During the configuration process the synchronization service account will be created with the format **ADToAADSyncServiceAccount@[TenantID].onmicrosoft.com** and you may get an error if multi-factor authentication is enabled for the synchronization service account, or other interactive authentication policies are accidentally enabled for the synchronization account. Removing multi-factor authentication or any interactive authentication policies for the synchronization service account should resolve the error and you can complete the configuration smoothly.


## Scope provisioning to specific users and groups
You can scope the agent to synchronize specific users and groups by using on-premises Active Directory groups or organizational units. 

  :::image type="content" source="media/how-to-configure/new-ux-configure-4.png" alt-text="Screenshot of scoping filters icon." lightbox="media/how-to-configure/new-ux-configure-4.png":::


You can configure groups and organizational units within a configuration. 
 >[!NOTE]
 >  You cannot use nested groups with group scoping.  Nested objects beyond the first level will not be included when scoping using security groups. Only use group scope filtering for pilot scenarios as there are limitations to syncing large groups. 
 
 1.  On the **Getting started** configuration screen.  Click either **Add scoping filters** next to the **Add scoping filters** icon or on the click **Scoping filters** on the left under **Manage**.

   :::image type="content" source="media/how-to-configure/new-ux-configure-5.png" alt-text="Screenshot of scoping filters." lightbox="media/how-to-configure/new-ux-configure-5.png":::
 
 2. Select the scoping filter. The filter can be one of the following:
     - **All users**: Scopes the configuration to apply to all users that are being synchronized.
     - **Selected security groups**: Scopes the configuration to apply to specific security groups.
     - **Selected organizational units**: Scopes the configuration to apply to specific OUs. 
 3. For security groups and organizational units, supply the appropriate distinguished name and click **Add**.
 4. Once your scoping filters are configured, click **Save**.
 5. After saving, you should see a message telling you what you still need to do to configure cloud sync.  You can click the link to continue.
 :::image type="content" source="media/how-to-configure/new-ux-configure-16.png" alt-text="Screenshot of the nudge for scoping filters." lightbox="media/how-to-configure/new-ux-configure-16.png":::
 7. Once you've changed the scope, you should [restart provisioning](#restart-provisioning) to initiate an immediate synchronization of the changes.

## Attribute mapping
Microsoft Entra Connect cloud sync allows you to easily map attributes between your on-premises user/group objects and the objects in Microsoft Entra ID.  

:::image type="content" source="media/how-to-configure/new-ux-configure-6.png" alt-text="Screenshot of map attributes icon." lightbox="media/how-to-configure/new-ux-configure-6.png":::


You can customize the default attribute-mappings according to your business needs. So, you can change or delete existing attribute-mappings, or create new attribute-mappings.  

:::image type="content" source="media/how-to-configure/new-ux-configure-7.png" alt-text="Screenshot of default attribute mappings." lightbox="media/how-to-configure/new-ux-configure-7.png":::

After saving, you should see a message telling you what you still need to do to configure cloud sync.  You can click the link to continue.
 :::image type="content" source="media/how-to-configure/new-ux-configure-17.png" alt-text="Screenshot of the nudge for attribute filters." lightbox="media/how-to-configure/new-ux-configure-17.png":::


For more information, see [attribute mapping](how-to-attribute-mapping.md).

## Directory extensions and custom attribute mapping.
Microsoft Entra Connect cloud sync allows you to extend the directory with extensions and provides for custom attribute mapping.  For more information see [Directory extensions and custom attribute mapping](custom-attribute-mapping.md).

## On-demand provisioning
Microsoft Entra Connect cloud sync allows you to test configuration changes, by applying these changes to a single user or group.  

:::image type="content" source="media/how-to-configure/new-ux-configure-8.png" alt-text="Screenshot of test icon." lightbox="media/how-to-configure/new-ux-configure-8.png":::

You can use this to validate and verify that the changes made to the configuration were applied properly and are being correctly synchronized to Microsoft Entra ID.  

:::image type="content" source="media/how-to-configure/new-ux-configure-9.png" alt-text="Screenshot of on-demand provisioning." lightbox="media/how-to-configure/new-ux-configure-9.png":::

After testing, you should see a message telling you what you still need to do to configure cloud sync.  You can click the link to continue.
 :::image type="content" source="media/how-to-configure/new-ux-configure-18.png" alt-text="Screenshot of the nudge for testing." lightbox="media/how-to-configure/new-ux-configure-18.png":::


For more information, see [on-demand provisioning](how-to-on-demand-provision.md).

## Accidental deletions and email notifications
The default properties section provides information on accidental deletions and email notifications.

:::image type="content" source="media/how-to-configure/new-ux-configure-10.png" alt-text="Screenshot of default properties icon." lightbox="media/how-to-configure/new-ux-configure-10.png":::

The accidental delete feature is designed to protect you from accidental configuration changes and changes to your on-premises directory that would affect many users and groups.  

This feature allows you to:

- configure the ability to prevent accidental deletes automatically. 
- Set the # of objects (threshold) beyond which the configuration will take effect 
- set up a notification email address so they can get an email notification once the sync job in question is put in quarantine for this scenario 

For more information, see [Accidental deletes](how-to-accidental-deletes.md)

Click the **pencil** next to **Basics** to change the defaults in a configuration.

:::image type="content" source="media/how-to-configure/new-ux-configure-11.png" alt-text="Screenshot of basics." lightbox="media/how-to-configure/new-ux-configure-11.png":::

## Enable your configuration
Once you've finalized and tested your configuration, you can enable it.

:::image type="content" source="media/how-to-configure/new-ux-configure-12.png" alt-text="Screenshot of review and enable icon." lightbox="media/how-to-configure/new-ux-configure-12.png":::

Click **Enable configuration** to enable it.

:::image type="content" source="media/how-to-configure/new-ux-configure-13.png" alt-text="Screenshot of enabling a configuration." lightbox="media/how-to-configure/new-ux-configure-13.png":::

## Quarantines
Cloud sync monitors the health of your configuration and places unhealthy objects in a quarantine state. If most or all of the calls made against the target system consistently fail because of an error, for example, invalid admin credentials, the sync job is marked as in quarantine.  For more information, see the troubleshooting section on [quarantines](how-to-troubleshoot.md#provisioning-quarantined-problems).

## Restart provisioning 
If you don't want to wait for the next scheduled run, trigger the provisioning run by using the **Restart sync** button. 
 [!INCLUDE [sign in](../../../../includes/cloud-sync-sign-in.md)]
 4. Under **Configuration**, select your configuration.

 :::image type="content" source="media/how-to-configure/new-ux-configure-14.png" alt-text="Screenshot of restarting sync." lightbox="media/how-to-configure/new-ux-configure-14.png":::

 5. At the top, select **Restart sync**.

## Remove a configuration
To delete a configuration, follow these steps.

 [!INCLUDE [sign in](../../../../includes/cloud-sync-sign-in.md)]
 3. Under **Configuration**, select your configuration.

 :::image type="content" source="media/how-to-configure/new-ux-configure-15.png" alt-text="Screenshot of deletion." lightbox="media/how-to-configure/new-ux-configure-15.png":::

 4. At the top of the configuration screen, select **Delete configuration**.

>[!IMPORTANT]
>There's no confirmation prior to deleting a configuration. Make sure this is the action you want to take before you select **Delete**.


## Next steps 

- [What is provisioning?](../what-is-provisioning.md)
- [What is Microsoft Entra Connect cloud sync?](what-is-cloud-sync.md)
