---
title: 'How To Failover Azure AD Connect Servers | Microsoft Docs'
description: Steps on how to perform a failover from a current active Azure AD Connect Server to a staging Azure AD Connect Server
author: FrankBoylan92
ms.author: billmath
ms.service: active-directory
ms.topic: how-to
ms.date: 07/11/2022
ms.custom: template-how-to
---

# How To Failover Azure AD Connect Servers

Azure AD Connect can be set up in an Active-Passive High Availability setup, where one server will actively push changes to the synced AD objects to Azure AD and the passive server will stage these changes in the event it takes over.

You cannot set up Azure AD Connect in an Active-Active setup. It must be Active-Passive
Ensure that only 1 Azure AD Connect server is actively syncing changes at all times

For more information on setting up an Azure AD Connect sync server in Staging Mode, see [staging mode](how-to-connect-sync-staging-server.md)

In the event that you receive an alert that the currently active sync server is not able to connect, follow the below steps to attempt a failover of the sync services.
Currently there is no built-in automatic method to trigger this failover.

## Prerequisites

- One currently active Azure AD Connect Sync Server
- One or more currently staging Azure AD Connect Sync Server

## Changing Currently Active Sync Server to Staging Mode

To ensure we do not have more than one Sync Servers actively syncing changes, the first thing we must do is move the currently Active Sync Server to Staging Mode.

1. For the currently Active Azure AD Connect server, open the Azure AD Connect Console and click "Configure staging mode" then Next:
[Insert Image: "active_server_menu.png"]

2. You will need to sign into Azure AD with Global Admin credentials:
[Insert Image: "active_server_sign_in.png"]

3. Tick the box for Staging Mode and click Next:
[Insert Image: "active_server_staging_mode.png"]

4. The Azure AD Connect server will check for installed components for 10-15 seconds and then prompt you whether you want to start the sync process or not after this:
[Insert Image: "active_server_config.png"]
Since the server will be in staging mode, it will not write changes to Azure AD, but retain any changes to the AD in its Connector Space, ready to write them.
It is recommended to leave the sync process on for the server in Staging Mode, so if it becomes active, it will quickly take over and won't have to do a large sync to catch up to the current state of the AD/Azure AD sync.

5. After selecting whether to start or stop the sync process and clicking Configure, it should take 1-2 minutes for the Azure AD Connect server to configure itself into Staging Mode.
When this is completed, you will be prompted with a screen that confirms Staging Mode is enabled.
You can click Exit to finish this.

6. You can confirm that the server is successfully in Staging Mode by opening the Synchronization Service console.
From here, there should be no more Export jobs since the change and Full & Delta Imports will be suffixed with "(Stage Only)" like below:
[Insert Image "active_server_sync_server_mgmr.png"]

## Changing Currently Staging Sync Server to Active Mode

At this point, all of our Azure AD Connect Sync Servers should be in Staging Mode and not exporting changes.
We can now move our Staging Sync Server to Active mode and actively sync changes.

1. Now move to the Azure AD Connect server that was originally in Staging Mode and open the Azure AD Connect console.
Click on "Configure staging mode" and click Next:
[Insert Image: "staging_server_menu.png"]
Note the message at the bottom of the Console that indicates this server is in Staging Mode.

2. Sign into Azure AD with Global Admin credentials then go to the Staging Mode screen.
Untick the box for Staging Mode and click Next
[Insert Image: "staging_server_staging_mode.png"]
As per the warning on this page, it is important to ensure no other Azure AD Connect server is actively syncing.
There should only be one active Azure AD Connect sync server at any time.

3. After 20-30 seconds you should again be prompted to start or stop the sync process.
Tick this box and click Configure:
[Insert Image: "staging_server_config.png"]
You can proceed without enabling the sync process, but since this will be the active sync server, you should enable it.

4. The completion process should take 1-2 minutes, like before.
Once it is finished you should get the below confirmation screen where you can click Exit to finish:
[Insert Image: "staging_server_confirmation.png"]

5. You can again confirm that this is working by opening the Sync Service Console and checking if Export jobs are running:
[Insert Image: "staging_server_sync_server_mgmr.png"]

## Next steps

- Read more about Staging Servers and Disaster Recovery in [Staging server and disaster recovery](how-to-connect-sync-staging-server.md)
