<properties 
	pageTitle="Operational Insights - Troubleshoot Agents or Operations Manager Data Flow" 
	description="Learn how to troubleshoot issues with directly-connected agents and Operations Manager data flow to Azure Operational Insights" 
	services="operational-insights" 
	documentationCenter="" 
	authors="dani3l3" 
	manager="jwhit" 
	editor=""/>

<tags 
	ms.service="operational-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/30/2015" 
	ms.author="dmuscett"/>

#Troubleshoot agents or Operations Manager data flow to Operational Insights

[AZURE.INCLUDE [operational-insights-note-moms](../includes/operational-insights-note-moms.md)]

The following set of procedures is meant as a guide to help you troubleshoot your directly-connected agents or Operations Manager deployments configured to report data to Azure Operational Insights.

##Procedure 1: Validate if the right Management Packs get downloaded to your Operations Manager Environment
*Note: If you only use Direct Agent, you can skip to the next procedure.*

Depending on which Intelligence Packs you have enabled from the OpInsights Portal will you see more or less of these MPs. Search for keyword ‘Advisor’ or ‘Intelligence’ in their name. 
You can check for these MPs using OpsMgr PowerShell:

      Get-SCOMManagementPack | where {$_.DisplayName -match 'Advisor'} | Select Name,Sealed,Version
      Get-SCOMManagementPack | where {$_.Name -match 'IntelligencePacks'} | Select Name,Sealed,Version
    
Note: if you are troubleshooting Capacity Intelligence Pack, check HOW MANY management packs with the name containing ‘capacity’ you have: there are two management packs that have the same display name (but different internal ID’s) that come in the same MP bundle; if one of the two does not get imported (often due to missing VMM dependency) the other MP does not get imported and the operation does not retry.

You should see the following three MPs related to ‘capacity’
1. Microsoft System Center Advisor Capacity Intelligence Pack 
1. Microsoft System Center Advisor Capacity Intelligence Pack 
1. Microsoft System Center Advisor Capacity Storage Data 

If you only see one or two of them but not all three, remove it and wait 5/10 minutes for Operations Manager to download and import it again – check the event logs for errors during this period.

##Procedure 2: Validate if the right Intelligence Packs get downloaded to your Direct Agent
*Note: If you only use Operations Manager, you can ignore this procedure.*

In Direct Agent you should see the Intelligence Packs collection policy being cached under **C:\Program Files\Microsoft Monitoring Agent\Agent\Health Service State\Management Packs**


##Procedure 3: Validate if data is being sent up to the Advisor service (or at last attempted)
Depending if you are using Directly-connected agents or Operations Manager, you can perform the following procedure on the direct agent machine or on the Operations Manager management server:

1. - Open ‘Performance Monitor’ 
1. - Select ‘Health Service Management Groups’
1. - Add all the counters that start with ‘HTTP’

If things are configured right you should see activity for these counters, as events and other data items (based on the intelligence packs onboarded in the portal, and the configured log collection policy) are uploaded. Those counters don’t necessarily have to be continuously ‘busy’ - if you see little to no activity it might be that you are not onboarded on many intelligence packs or have a very lightweight collection policy. 

##Procedure 4: Check for Errors on the Management Server or Direct Agent Event Logs 
As a final step if all of the above fails but you still see no data received by the service, check if you are seeing any errors in **Event Viewer**.

Open **Event Viewer** –> **Application and Services** –> **Operations Manager** and filter by Event Sources: **Advisor**, **Health Service Modules**, **HealthService** and **Service Connector** (this last one applies to Direct Agent only). 

Most of these events would be similar in either Operations Manager and on Direct Agent and the steps for troubleshooting would be similar for either. 
The only part that differs between Operations Manager and Direct Agent is the registration process (GUI in Operations Manager; workspace Id/Key combination in Direct agent) but, after initial registration, certificates are exchanges and used and everything else about the communication with the service is the same.

Hence, many of these events apply to both types of reporting infrastructure. Here's a list of the common ones you might see.

###Events from source 'Health Service Modules'
#####EventID 2138
This means your proxy requires authentication. Please follow the steps to [configure proxy servers](https://msdn.microsoft.com/library/azure/dn884643.aspx)

#####EventID 2137
Operations Manager cannot read the authentication certificate. Re-running the Advisor registration wizard will fix certificates/runas accounts

#####EventID 2132
Means **Not Authorized**. Could be an issue with the certificate and/or registration to the service; try re-running the registration wizard that will fix certificates and RunAs accounts. Additionally, verify the proxy has been set to allow exclusions. For more information see [configure proxy servers](https://msdn.microsoft.com/library/azure/dn884643.aspx)

#####EventID 2129
This is a failed connection due to failed SSL negotiation. Verify that your systems are configured to use TLS and not SSL. There could be some strange SSL settings on this server with regards to chipers, either in the Internet Explorer **Advanced** options, or in the Windows registry under the key 

    HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL

#####EventID 2127
Failure sending data received error code. If this only happens once in a while, it could be just a glitch. Keep an eye on it, to understand how often it happens. If the same appears very often (every 10 minutes or so for an extended period of time), then it could be a real issue – check your network configuration, proxy settings described above, and re-run registration wizard. But if it only happens sporadically (i.e. a couple of times per day) then everything should be fine, as data will be queued and retransmitted. It's probably just a network timeout if that's the frequency at which it occurs.
 
Some of the HTTP error codes have some special meanings, i.e.: 

- the FIRST time that a MMA direct agent or management server tries to send data to our service, it will get a 500 error with an inner 404 error code – 404 means not found; this indicates that the storage area we’ll use for this new workspace of yours isn’t quite ready yet – it is being provisioned. On next retry, this will however be ready and flow will start working (under normal conditions).
- 403 might indicate a permission/credential issue, and so forth. 

#####EventID 2128
DNS name resolution failed. You server can’t resolve our internet address it is supposed to send data to. This might be DNS resolver settings on your machine, incorrect proxy settings, or a (temporary) issue with DNS at your provider. Like the previous event, depending if it happens constantly or ‘once in a while’ it could indicate a real issue – or not.

#####EventID 2130
Timeout. Like the previous event, depending if it happens constantly or ‘once in a while’ it could be an issue – or not.

### Events from source 'HealthService'
#####EventID 4511
Cannot load module "System.PublishDataToEndPoint" – file not found. Initialization of a module of type "System.PublishDataToEndPoint" (CLSID "{D407D659-65E4-4476-BF40-924E56841465}") failed with error code The system cannot find the file specified.  
This error indicates you have old DLLs on your machine, that don’t contain the required modules. The fix is to update your Management Servers to the latest Update Rollup.

#####EventID 4502
Module crashed. If you see this for workflows with names such as **CollectInstanceSpace** or **CollectTypeSpace** it might mean the server is having issues to send some configuration data. Depending on how often it happens - constantly or ‘once in a while’ - it could be an issue or not. If it happens more that every hour it is definitely an issue. If only fails this operation once or twice per day, it will be fine an able to recover. Depending on how the module actually fails (description will have more details) this could be an on-premises issue – i.e. to collect to DB – or an issue sending to the cloud. Verify your network and proxy settings, and worst case try restarting the HealthService.

#####EventID 4501
Module "System.PublishDataToEndPoint" crashed. A module of type "System.PublishDataToEndPoint" reported an error 87L which was running as part of rule "Microsoft.SystemCenter.CollectAlertChangeDataToCloud" running for instance "Operations Manager Management Group" with id:"{6B1D1BE8-EBB4-B425-08DC-2385C5930B04}" in management group "SCOMTEST". 
You should NOT see this with this exact workflow, module and error anymore, it used to be [a bug *now fixed*](http://feedback.azure.com/forums/267889-azure-operational-insights/suggestions/6714689-alert-management-intelligence-pack-not-sending-ale). If you see this again please report it thru your preferred Microsoft support channel.


### Events from source 'Service Connector'
#####EventID 4002
The service returned HTTP status code 403 in response to a query.  Please check with the service administrator for the health of the service. The query will be retried later. You can get a 403 during the agent’s initial registration phase, you’ll see a URL like https://<YourWorkspaceID>.oms.opinsights.azure.com/ AgentService.svc/AgentTopologyRequest
Error code 403 means ‘fordbidden’ – this is typically a wrongly-copied WorkspaceId or key, or the clock is not synced on the machine. Try synchronising with a reliable time source and use the connectivity check in the Control Panel applet for Microsoft Monitoring Agent to verify you have the right workspace Id and Key. 





##Procedure 5: Look for your agents to send their data and have it indexed in the Portal
Check in the OpInsights Portal, from Overview page navigate to the small tile **Servers and Usage** – this will show if management groups (and their agents) and direct agents are reporting data into search. The number of agents on the tile is derived from data – if machines don’t report for 2 weeks they’ll drop off the radar.

The drill downs take you to search and show the last indexed data’s timestamp for each machine. From there you can explore what data it is. Depending on the amount of data collection configured and which intelligence packs, data upload schedule and speed can vary.

This page also features metering information (this does not use the search index but the billing system, it’s refreshed every couple of hours) about the amounts of data sent to the service broken down by Intelligence Pack.
