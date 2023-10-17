---
title: 'Migrate Microsoft Entra Connect to Microsoft Entra Cloud Sync| Microsoft Docs'
description: Describes steps to migrate Microsoft Entra Connect to Microsoft Entra Cloud Sync.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.custom: has-azure-ad-ps-ref
ms.topic: overview
ms.date: 01/17/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# Migrating from Microsoft Entra Connect to Microsoft Entra Cloud Sync

Microsoft Entra Cloud Sync is the future for accomplishing your hybrid identity goals for synchronization of users, groups, and contacts to Microsoft Entra ID.  It uses the Microsoft Entra cloud provisioning agent instead of the Microsoft Entra Connect application.  If you're currently using Microsoft Entra Connect and wish to move to cloud sync, the following document provides guidance.

<a name='steps-for-migrating-from-azure-ad-connect-to-cloud-sync'></a>

## Steps for migrating from Microsoft Entra Connect to cloud sync



|Step|Description|
|-----|-----|
|Choose the best sync tool|Before moving to cloud sync, you should verify that cloud sync is currently the best synchronization tool for you.  You can do this task by going through the wizard [here](https://aka.ms/EvaluateSyncOptions).|
|Verify the pre-requisites for migrating|The following guidance is only for users who have installed Microsoft Entra Connect using the Express settings and aren't synchronizing devices.  Also you should verify the cloud sync [pre-requisites](how-to-prerequisites.md).|
|Back up your Microsoft Entra Connect configuration|Before making any changes, you should back up your Microsoft Entra Connect configuration.  This way, you can role-back.  For more information, see [Import and export Microsoft Entra Connect configuration settings](../connect/how-to-connect-import-export-config.md).|
|Review the migration tutorial|To become familiar with the migration process, review the [Migrate to Microsoft Entra Cloud Sync for an existing synced AD forest](tutorial-pilot-aadc-aadccp.md) tutorial.  This tutorial guides you through the migration process in a sandbox environment.|
|Create or identify an OU for the migration|Create a new OU or identify an existing OU that contains the users you'll test migration on.|
|Move users into new OU (optional)|If you're using a new OU, move the users that are in scope for this pilot into that OU now.  Before continuing, let Microsoft Entra Connect pick up the changes so that it's synchronizing them in the new OU.| 
|Run PowerShell on OU|You can run the following PowerShell cmdlet to get the counts of the users that are in the pilot OU.  </br>`Get-ADUser -Filter * -SearchBase "<DN path of OU>"`</br> Example: `Get-ADUser -Filter * -SearchBase "OU=Finance,OU=UserAccounts,DC=FABRIKAM,DC=COM"`|
|Stop the scheduler|Before creating new sync rules, you need to stop the Microsoft Entra Connect scheduler.  For more information, see [how to stop the scheduler](../connect/how-to-connect-sync-feature-scheduler.md#stop-the-scheduler).
|Create the custom sync rules|In the Microsoft Entra Connect Synchronization Rules editor, you need to create an inbound sync rule that filters out users in the OU you created or identified previously.  The inbound sync rule is a join rule with a target attribute of cloudNoFlow.  You'll also need an outbound sync rule with a link type of JoinNoFlow and the scoping filter that has the cloudNoFlow attribute set to True.  For more information, see [Migrate to Microsoft Entra Cloud Sync for an existing synced AD forest](tutorial-pilot-aadc-aadccp.md#create-custom-user-inbound-rule) tutorial for how to create these rules.|
|Install the provisioning agent|If you haven't done so, install the provisioning agent.  For more information, see [how to install the agent](how-to-install.md).|
|Configure cloud sync|Once the agent is installed, you need to configure cloud sync.  In the configuration, you need to create a scope to the OU that was created or identified previously.  For more information, see [Configuring cloud sync](how-to-configure.md).|
|Verify pilot users are synchronizing and being provisioned|Verify that the users are now being synchronized in the portal.  You can use the PowerShell script below to get a count of the number of users that have the on-premises pilot OU in their distinguished name.  This number should match the count of users in the previous step.  If you create a new user in this OU, verify that it's being provisioned.|
|Start the scheduler|Now that you've verified users are provisioning and synchronizing, you can go ahead and start the Microsoft Entra Connect scheduler.   For more information, see [how to start the scheduler](../connect/how-to-connect-sync-feature-scheduler.md#start-the-scheduler).
|Schedule you remaining users|Now you should come up with a plan on migrating more users.  You should use a phased approach so that you can verify that the migrations are successful.|
|Verify all users are provisioned|As you migrate users, verify that they're provisioning and synchronizing correctly.|
|Stop Microsoft Entra Connect|Once you've verified that all of your users are migrated, you can turn off the Microsoft Entra Connect synchronization service.  Microsoft recommends that you leave the server is a disabled state for a period of time, so you can verify the migration was successful
|Verify everything is good|After a period of time, verify that everything is good.|
|Decommission the Microsoft Entra Connect server|Once you've verified everything is good you can use the steps below to take the Microsoft Entra Connect server offline.|






## Verify Users script
```PowerShell
# Filename:    VerifyAzureUsers.ps1
# Description: Counts the number of users in Azure that have a specific on-premises distinguished name.
#
# DISCLAIMER:
# Copyright (c) Microsoft Corporation. All rights reserved. This 
# script is made available to you without any express, implied or 
# statutory warranty, not even the implied warranty of 
# merchantability or fitness for a particular purpose, or the 
# warranty of title or non-infringement. The entire risk of the 
# use or the results from the use of this script remains with you.
#
#
#
#


Connect-AzureAD -Confirm

#Declare variables

$Users = Get-AzureADUser -All:$true -Filter "DirSyncEnabled eq true"
$OU = "OU=Sales,DC=contoso,DC=com"
$counter = 0

#Search users

foreach ($user in $Users) {
    $test = $User.ExtensionProperty
    $DN = $test["onPremisesDistinguishedName"]
    if ($DN -match $OU)
	{
	$counter++
	}
}

Write-Host "Total Users found:" + $counter

```
## More information 

- [What is provisioning?](../what-is-provisioning.md)
- [What is Microsoft Entra Cloud Sync?](what-is-cloud-sync.md)
- [Create a new configuration for Microsoft Entra Cloud Sync](how-to-configure.md).
- [Migrate to Microsoft Entra Cloud Sync for an existing synced AD forest](tutorial-pilot-aadc-aadccp.md) 
``
