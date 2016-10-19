<properties
	pageTitle="Recover your mobile service in the event of a disaster | Microsoft Azure"
	description="Learn how to recover your mobile service in the event of a disaster."
	services="mobile-services"
	documentationCenter=""
	authors="christopheranderson"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="christopheranderson"/>

# Recover your mobile service in the event of a disaster

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]

&nbsp;

When you use Azure Mobile Services to deploy an app, you can use its built-in features to ensure business continuity in the event of availability problems, such as server failures, network disruptions, data loss, and widespread facilities loss. By deploying your app using Azure Mobile Services you are taking advantage of many fault tolerance and infrastructure capabilities that you would have to design, implement, and manage if you were to deploy a traditional on-premise solution. Azure mitigates a large fraction of potential failures at a fraction of the cost.

## <a name="prepare"></a> Prepare for possible disasters

To make recovery easier in case of an availability problem, you can prepare for it in advance:

+ **Back up your data in the Azure mobile service SQL Database**
	Your mobile service application data is stored in an Azure SQL Database. We recommend that you back it up as prescribed in the [SQL Database business continuity guidance].
+ **Back up your mobile service scripts**
	We recommend that you store your mobile service scripts in a source-control system such as [Team Foundation Service] or [GitHub] and not rely only on the copies in the mobile service itself. You can download the scripts via the Azure classic portal, using the Mobile Services [source control feature], or [using the Azure CLI]. Pay close attention to features labeled as "preview" in the Azure classic portal, as recovery for those scripts is not guaranteed and you might need to recover them from your own source control original.
+ **Reserve a secondary mobile service**
	In the event of an availability problem with your mobile service, you may have to redeploy it to an alternate Azure region. To ensure capacity is available (for example under rare circumstances such as the loss of an entire region), we recommend that you create a secondary mobile service in your alternate region and set its mode the same as or higher than the mode of your primary service. (If your primary service is in Basic mode, you can make the secondary service either Basic or Standard. But if the primary is Standard, then the secondary must also be Standard.)

## <a name="watch"></a>Watch for signs of a problem

These circumstances indicate a problem that might require a recovery operation:

+ Apps that are connected to your mobile service can't communicate with it for an extended period of time.
+ Mobile service status is displayed as **Unhealthy** in the [Azure classic portal].
+ An **Unhealthy** banner appears at the top of every tab for your mobile service in the Azure classic portal, and management operations produce error messages.
+ The [Azure Service Dashboard] indicates an availability problem.

## <a name="recover"></a>Recover from a disaster

When a problem occurs, use the Service Dashboard to get guidance and updates.

If you're prompted by the Service Dashboard, execute the following steps to restore your mobile service to a running state in an alternate Azure region. If you created a secondary service in advance, its capacity will be used to restore the primary service. Because the URL and application key of the primary service is unchanged after recovery, you don't have to update any apps that refer to it.

To recover your mobile service after an outage:

1. In the Azure classic portal, ensure that the status of your service is reported as **Unhealthy**.

2. If you already reserved a secondary mobile service, you can skip this step.

   If you haven't already reserved a secondary mobile service, create one now in another Azure region. Set its scale mode the same as the mode of your primary service.

3. Configure the Azure Command-Line Interface (Azure CLI) to work with your subscription, as described in [Automate mobile services with the Azure CLI].

4. Now you can use your secondary service to recover your primary one.

	> [AZURE.IMPORTANT] In addition to migrating your files, the migrate command also updates the host name of your primary service to point to your secondary service so that client applications do not need to be updated. However, it will take up to 30 minutes for the host name to resolve to the new service. For this reason, it is recommended that the migrate command only be used in disaster recovery scenarios.

	> [AZURE.IMPORTANT] When you execute the command in this step, the secondary service is deleted so that its capacity can be used to recover the primary service. We recommend that you back up your scripts and settings before you run the command, if you would like to keep them.

	When you're ready, execute this command:

		azure mobile migrate PrimaryService SecondaryService
		info:    Executing command mobile migrate
		Warning: this action will use the capacity from the mobile service 'SecondaryService' and delete it and the host name for 'PrimaryService' may not resolve for up to 30 minutes. Do you want to migrate the mobile service 'PrimaryService'? [y/n]: y
		+ Performing migration
		+ Migration with id '0123456789abcdef0123456789abcdef' started. The migration may take several minutes to complete.
		+ Cleaning up
		info:    Migration complete. It may take 30 minutes for DNS to resolve to the migrated site.
		info:    mobile migrate command OK

    > [AZURE.NOTE] It may take a few minutes after the command completes until you can see the changes in the Azure classic portal.

5. Verify that all scripts have been recovered correctly by comparing them to your originals in source control. In most cases, scripts are automatically recovered without data loss, but if you find a discrepancy, you can recover that script manually.

6. Make sure that your recovered service is communicating with your Azure SQL Database. The recover command recovers the mobile service, but retains the connection to the original database. If the problem in the primary Azure region also affects the database, the recovered service may still not be running correctly. You can use the Azure Service Dashboard to examine the database status for a given region. If the original database is not working, you can recover it:
	+ Recover your Azure SQL Database to the Azure region where you just recovered your mobile service, as described in [SQL Database business continuity guidance].
	+ In the Azure classic portal, on the **"Configure"** tab of your mobile service, choose "Change database" and then select the newly recovered database.

7. Your mobile service is now hosted in a different physical location. You'll need to update your publishing and/or git credentials to allow for updating your running site.

	+ If you are using a **.NET backend**, set up your publishing profile again, as described in [Publish your mobile service](mobile-services-dotnet-backend-windows-store-dotnet-get-started.md#publish-your-mobile-service). This will update your publishing details to point to the new service location.
	+ If you are using a **Javascript backend** and managing your service with the Portal, you don't need to take any extra action.

	+ If you are using a **Javascript backend** and managing your service with node, update your git remote to point to the new repository. To do this, you remove the .git file path from your git remote:

		1. Find your current origin remote:

				git remote -v
				 origin  https://myservice.scm.azure-mobile.net/myservice.git (fetch)
				 origin  https://myservice.scm.azure-mobile.net/myservice.git (push)

		3. Update the remote using the same url, but without the final .git file path:
				git remote set-url origin https://myservice.scm.azure-mobile.net
		4. Pull from origin to verify that it is working correctly.

Now you should be in a state where your mobile service has been recovered to a new Azure region and is now accepting traffic from your store apps using its original URL.

<!-- Anchors. -->

<!-- Images. -->

<!-- URLs. -->
[SQL Database business continuity guidance]: http://msdn.microsoft.com/library/windowsazure/hh852669.aspx
[Team Foundation Service]: http://tfs.visualstudio.com/
[Github]: https://github.com/
[source control feature]: http://www.windowsazure.com/develop/mobile/tutorials/store-scripts-in-source-control/
[using the Azure CLI]: http://www.windowsazure.com/develop/mobile/tutorials/command-line-administration/
[Azure classic portal]: http://manage.windowsazure.com/
[Azure Service Dashboard]: http://www.windowsazure.com/support/service-dashboard/
[Automate mobile services with the Azure CLI]: http://www.windowsazure.com/develop/mobile/tutorials/command-line-administration/
