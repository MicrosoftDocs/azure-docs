<properties linkid="mobile-services-recover-disaster" urlDisplayName="Recover your mobile service in the event of a disaster" pageTitle="Recover your mobile service in the event of a disaster - Windows Azure Mobile Services" metaKeywords=""  writer="yavorg" metaDescription="Learn how to recover your mobile service in the event of a disaster." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14798" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

# Recover your mobile service in the event of a disaster

When you use Windows Azure Mobile Services to deploy an app, you can use its built-in features to ensure business continuity in the event of availability problems, such as server failures, network disruptions, data loss, and widespread facilities loss. By deploying your app using Windows Azure Mobile Services you are taking advantage of many fault tolerance and infrastructure capabilities that you would have to design, implement, and manage if you were to deploy a traditional on-premise solution. Windows Azure mitigates a large fraction of potential failures at a fraction of the cost.

<h2><a name="prepare"></a><span class="short-header">Prepare</span>Prepare for possible disasters</h2>

To make recovery easier in case of an availability problem, you can prepare for it in advance: 

+ **Back up your data in the Windows Azure mobile service SQL Database**
	<br/>Your mobile service application data is stored in a Windows Azure SQL Database. We recommend that you back it up as prescribed in the [SQL Database business continuity guidance].
+ **Back up your mobile service scripts**
	<br/>We recommend that you store your mobile service scripts in a source-control system such as [Team Foundation Service] or [GitHub] and not rely only on the copies in the mobile service itself. You can download the scripts via the Windows Azure portal, using the Mobile Services [source control feature], or [using the Windows Azure command-line tool]. Pay close attention to features labeled as “preview” in the portal, as recovery for those scripts is not guaranteed and you might need to recover them from your own source control original.
+ **Reserve a secondary mobile service**
	<br/>In the event of an availability problem with your mobile service, you may have to redeploy it to an alternate Windows Azure region. But at the moment you need it, that region may not have enough capacity. To guarantee capacity, we recommend that you create a secondary mobile service in your alternate region and set its mode the same as or higher than the mode of your primary service. (If your primary service is in shared mode, you can make the secondary service either shared or reserved. But if the primary is reserved, then the secondary must also be reserved.)


<h2><a name="watch"></a><span class="short-header">Watch</span>Watch for signs of a problem</h2>

These circumstances indicate a problem that might require a recovery operation:

+ Apps that are connected to your mobile service can't communicate with it for an extended period of time.
+ Mobile service status is displayed as **“Unhealthy”** in the [Windows Azure portal].
+ An **“Unhealthy”** banner appears at the top of every tab for your mobile service in the Windows Azure portal, and management operations produce error messages.
+ The [Windows Azure Service Dashboard] indicates an availability problem.

<h2><a name="recover"></a><span class="short-header">Recover</span>Recover from a disaster</h2>

When a problem occurs, use the Service Dashboard to get guidance and updates.
 
If you're prompted by the Service Dashboard, execute the following steps to restore your mobile service to a running state in an alternate Windows Azure region. If you created a secondary service in advance, its capacity will be used to restore the primary service. Because the URL and application key of the primary service is unchanged after recovery, you don't have to update any apps that refer to it. 

To recover your mobile service after an outage:

1. In the Windows Azure portal, ensure that the status of your service is reported as **“Unhealthy”**.

2. If you already reserved a secondary mobile service, you can skip this step.

   If you haven't already reserved a secondary mobile service, create one now in another Windows Azure region. Set its mode the same as or higher than the mode of your primary service. (If your primary service is in shared mode, you can make the secondary service either shared or reserved. But if the primary is reserved, then the secondary must also be reserved.)

3. Configure the Windows Azure command-line tools to work with your subscription, as described in [Automate mobile services with command-line tools].

4. Now you can use your secondary service to recover your primary one.

    <div class="dev-callout"><b>Important</b>
	<p>When you execute the command in this step, the secondary service is deleted so that its capacity can be used to recover the primary service. We recommend that you back up your scripts and settings before you run the command, if you would like to keep them.</p>
    </div>

   When you're ready, execute this command:

		azure mobile recover PrimaryService SecondaryService
		info:    Executing command mobile recover
		Warning: this action will use the capacity from the mobile service 'SecondaryService' and delete it. Do you want to recover the mobile service 'PrimaryService'? (y/n): y
		+ Performing recovery
		+ Cleaning up
		info:    Recovery complete
		info:    mobile recover command OK

    <div class="dev-callout"><b>Note</b>
	<p>It may take a few minutes after the command completes until you can see the changes in the portal.</p>
    </div>

5. Verify that all scripts have been recovered correctly by comparing them to your originals in source control. In most cases, scripts are automatically recovered without data loss, but if you find a discrepancy, you can recover that script manually.

6. Make sure that your recovered service is communicating with your Windows Azure SQL Database. The recover command recovers the mobile service, but retains the connection to the original database. If the problem in the primary Windows Azure region also affects the database, the recovered service may still not be running correctly. You can use the Windows Azure Service Dashboard to examine the database status for a given region. If the original database is not working, you can recover it:
	+ Recover your Windows Azure SQL Database to the Windows Azure region where you just recovered your mobile service, as described in [SQL Database business continuity guidance].
	+ In the Windows Azure portal, on the **“Configure”** tab of your mobile service, choose “Change database” and then select the newly recovered database.

Now you should be in a state where your mobile service has been recovered to a new Azure region and is now accepting traffic from your store apps using its original URL.

<!-- Anchors. -->

<!-- Images. -->

<!-- URLs. -->
[SQL Database business continuity guidance] http://msdn.microsoft.com/en-us/library/windowsazure/hh852669.aspx
[Team Foundation Service] http://tfs.visualstudio.com/
[GitHub] https://github.com/
[source control feature] http://www.windowsazure.com/en-us/develop/mobile/tutorials/store-scripts-in-source-control/
[using the Windows Azure command-line tool] http://www.windowsazure.com/en-us/develop/mobile/tutorials/command-line-administration/
[Windows Azure portal] http://manage.windowsazure.com/
[Windows Azure Service Dashboard] http://www.windowsazure.com/en-us/support/service-dashboard/
[Automate mobile services with command-line tools] http://www.windowsazure.com/en-us/develop/mobile/tutorials/command-line-administration/