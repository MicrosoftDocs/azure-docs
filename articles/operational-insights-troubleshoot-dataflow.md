<properties 
	pageTitle="Operational Insights - Search" 
	description="Operational Insights is an analysis service that enables IT administrators to gain deep insight across on-premises and cloud environments. It enables you to interact with real-time and historical machine data to rapidly develop custom insights, and provides Microsoft and community-developed patterns for analyzing data." 
	services="operational-insights" 
	documentationCenter="" 
	authors="bandersmsft" 
	manager="jwhit" 
	editor=""/>

<tags 
	ms.service="operational-insights" 
	ms.workload="appservices" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="2/20/2015" 
	ms.author="dmuscett"/>


#Verifying if on-premises components are working after registration

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

Hence, many of these events apply to both types of reporting infrastructure.


##Procedure 5: Look for your agents to send their data and have it indexed in the Portal
Check in the OpInsights Portal, from Overview page navigate to the small tile **Servers and Usage** – this will show if management groups (and their agents) and direct agents are reporting data into search. The number of agents on the tile is derived from data – if machines don’t report for 2 weeks they’ll drop off the radar.

The drill downs take you to search and show the last indexed data’s timestamp for each machine. From there you can explore what data it is. Depending on the amount of data collection configured and which intelligence packs, data upload schedule and speed can vary.

This page also features metering information (this does not use the search index but the billing system, it’s refreshed every couple of hours) about the amounts of data sent to the service broken down by Intelligence Pack.
