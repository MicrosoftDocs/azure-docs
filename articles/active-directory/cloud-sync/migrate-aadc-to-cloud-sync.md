---
title: 'Migrate Azure AD Connect to Azure AD Connect cloud sync| Microsoft Docs'
description: Describes stpes to migrate Azure AD Connect to Azure AD Connect cloud sync.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 01/17/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# Migrating from Azure AD Connect to Azure AD Connect cloud sync

Azure AD Connect cloud sync is future for accomplishing your hybrid identity goals for synchronization of users, groups, and contacts to Azure AD.  It accomplishes this by using the Azure AD cloud provisioning agent instead of the Azure AD Connect application.  If you are currently using Azure AD Connect and wish to move to cloud sync, the following document will provide guidance on how to accomplish this.

## Steps for migrating from Azure AD Connect to cloud sync



|Step|Description|
|-----|-----|
|Choose the best sync tool|Before moving to cloud sync, you should verify that cloud sync is currently the best synchronization tool for you.  You can do this by going through the wizard here:  https://aka.ms/M365Wizard|
|Verify the pre-requisites for migrating|The following guidance is only for users who have installed Azure AD Connect using the Express settings and are not synchronizing devices.  Also you should verify the cloud sync [pre-requisites](how-to-prerequisites.md).|
|Back-up your Azure AD Connect configuration|Before making any changes, you should back-up your Azure AD Connect configuration.  This way, you can role-back should you need to.  See [Import and export Azure AD Connect configuration settings](../hybrid/how-to-connect-import-export-config.md) for more information.|
|Review the migration tutorial|To famililarize yourself with the migration process review the [Migrate to Azure AD Connect cloud sync for an existing synced AD forest](tutorial-pilot-aadc-aadccp.md) tutorial.  This tutorial will guide you through the migration process in a sandbox environment.|
|Create or identify an OU for the migration|Create a new OU or identify an existing OU that will contain the users you will test migration on.  
|Stop the scheduler|Before creating new sync rules, you need to stop the Azure AD Connect scheduler.  See [how to stop the scheduler](../hybrid/how-to-connect-sync-feature-scheduler.md#stop-the-scheduler) for more information.
|Create the custom sync rules|In the Azure AD Connect Synchronization Rules editor, you need to create an inbound sync rule that filters out users in the OU you created or identified previously.  The inbound sync rule will be a join rule with a target attribute of cloudNoFlow.  You will also need an outbound sync rule with a link type of JoinNoFlow and the scoping filter that has the cloudNoFlow attribute set to True.  See [Migrate to Azure AD Connect cloud sync for an existing synced AD forest](tutorial-pilot-aadc-aadccp.md#create-custom-user-inbound-rule) tutorial for how to create these rules.
|Install the provisioning agent|If you have not done so, install the provisioning agent.  See [how to install the agent](how-to-install.md) for more information.|
|Configure cloud sync|Once the agent is installed, you need to configure cloud sync.  In the configuration, you need to create a scope to the OU that was created or identified previously.  See [Configuring cloud sync](how-to-configure.md) for more information.|
|Verify pilot users are being provisioned|Verify that the users are now being synchronized in the portal. 
|Start the scheduler|Now that you have veriifed users are provisioning and synchronizing, you can go ahead and start the Azure AD Connect scheduler.   See [how to start the scheduler](../hybrid/how-to-connect-sync-feature-scheduler.md#start-the-scheduler) for more information.
|Schedule you remaining users|Now you should come up with a plan on migrating more users.  You should use a phased approach so that you can verify that the migrations are successful.|
|Verify all users are provisioned|As you migrate users, verify that they are provisioning and synchronizing correctly.|
|Stop Azure AD Connect|Once you have verified that all of your users are migrated, you can turn of the Azure AD Connect synchronization service.  It is recommended that you leave the server is a disabled state for a period of time, so you can verify the migration was successful
|Verify everything is good|After a period of time, verify that everything is good.|
|Decommission the Azure AD Connect server|Once you have verified everything is good and working you can take the Azure AD Connect server offline.{


## More information 

- [What is provisioning?](what-is-provisioning.md)
- [What is Azure AD Connect cloud sync?](what-is-cloud-sync.md)
- [Create a new configuration for Azure AD Connect cloud sync](how-to-configure.md).
- [Migrate to Azure AD Connect cloud sync for an existing synced AD forest](tutorial-pilot-aadc-aadccp.md) 
