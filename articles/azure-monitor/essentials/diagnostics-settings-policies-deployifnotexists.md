---
title: Enable Diagnostics settings using built-in policies for Azure Monitor
description: Use Azure builtin policies to create diagnostic settings in Azure Monitor.
author: EdB-MSFT
ms.author: edbaynash
services: azure-monitor
ms.topic: conceptual
ms.date: 01/18/2023
ms.reviewer: lualderm
--- 

# Built-in policies for Azure Monitor
Policies and policy initiatives provide a simple method to enable logging at-scale via diagnostics settings for Azure Monitor. Using a policy initiative, turn on audit logging for all [supported resources](#supported-resources) in your Azure environment.  

Enable resource logs to track activities and events that take place on your resources and give you visibility and insights into any changes that occur.
Assign policies to enable resource logs and to send them to destinations according to your needs. Send logs to Event Hubs for third-party SIEM systems, enabling continuous security operations. Send logs to storage accounts for longer term storage or the fulfillment of regulatory compliance. 

A set of built-in policies and initiatives exists to direct resource logs to Log Analytics Workspaces, Event Hubs, and Storage Accounts. The policies have `effect` set to `DeployIfNotExists` which deploys the policy as a default if there are not other settings defined.

The policies enable audit logging sending the logs to an Event Hub, Log Analytics workspace or Storage Account.

> include portal how to implement with screen shots.
## Common parameters

The following table describes the common parameters for each set of policies.

|Parameter| Description| Valid Values|Default|
|---|---|---|---|
|effect| Enable or disable the execution of the policy|DeployIfNotExists,<br>AuditIfNotExists,<br>Disabled|DeployIfNotExists|
|diagnosticSettingName|Diagnostic Setting Name||setByPolicy-LogAnalytics|
|categoryGroup|Diagnostic category group|none,<br>audit,<br>allLogs|audit|

## Log Analytics policy parameters
 This policy deploys a diagnostic setting using a category group to route logs to a Log Analytics workspace.

|Parameter| Description| Valid Values|Default|
|---|---|---|---|
|resourceLocationList|Resource Location List to send logs to nearby Log Analytics. <br>"*" selects all locations|Supported locations|\*|
|logAnalytics|Log Analytics Workspace|||

## Event Hubs policy parameters

This policy deploys a diagnostic setting using a category group to route logs to an Event Hub.

|Parameter| Description| Valid Values|Default|
|---|---|---|---|
|resourceLocation|Resource Location must be the same location as the event hub Namespace|Supported locations||
|eventHubAuthorizationRuleId|Event Hub Authorization Rule ID. The authorization rule is at event hub namespace level. For example, /subscriptions/{subscription ID}/resourceGroups/{resource group}/providers/Microsoft.EventHub/namespaces/{Event Hub namespace}/authorizationrules/{authorization rule}|||
|eventHubName|Event Hub Name||Monitoring|


## Storage Accounts policy parameters
This policy deploys a diagnostic setting using a category group to route logs to a Storage Account.

|Parameter| Description| Valid Values|Default|
|---|---|---|---|
|resourceLocation|Resource Location must be in the same location as the Storage Account|Supported locations|
|storageAccount|Storage Account resourceId|||

## Supported Resources

Built-in DeployIfNotExists policies exist for Log analytics, Event Hubs and Storage Accounts for the following resources:

* microsoft.agfoodplatform/farmbeats
* microsoft.apimanagement/service
* microsoft.appconfiguration/configurationstores
* microsoft.attestation/attestationproviders
* microsoft.automation/automationaccounts
* microsoft.avs/privateclouds
* microsoft.cache/redis
* microsoft.cdn/profiles
* microsoft.cognitiveservices/accounts
* microsoft.containerregistry/registries
* microsoft.devices/iothubs
* microsoft.eventgrid/topics
* microsoft.eventgrid/domains
* microsoft.eventgrid/partnernamespaces
* microsoft.eventhub/namespaces
* microsoft.keyvault/vaults
* microsoft.keyvault/managedhsms
* microsoft.machinelearningservices/workspaces
* microsoft.media/mediaservices
* microsoft.media/videoanalyzers
* microsoft.netapp/netappaccounts/capacitypools/volumes
* microsoft.network/publicipaddresses
* microsoft.network/virtualnetworkgateways
* microsoft.network/p2svpngateways
* microsoft.network/frontdoors
* microsoft.network/bastionhosts
* microsoft.operationalinsights/workspaces
* microsoft.purview/accounts
* microsoft.servicebus/namespaces
* microsoft.signalrservice/signalr
* microsoft.signalrservice/webpubsub
* microsoft.sql/servers/databases
* microsoft.sql/managedinstances

## Next Steps

* [Create diagnostic settings at scale using Azure Policy](./diagnostic-settings-policy)
* [Azure Policy built-in definitions for Azure Monitor](../policy-reference)
* [Azure Policy Overview](../../governance/policy/overview)
* [Azure Enterprise Policy as Code](https://techcommunity.microsoft.com/t5/core-infrastructure-and-security/azure-enterprise-policy-as-code-a-new-approach/ba-p/3607843)