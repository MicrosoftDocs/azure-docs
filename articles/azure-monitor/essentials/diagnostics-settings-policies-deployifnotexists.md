---
title: Enable Diagnostics settings by category group using built-in policies.
description: Use Azure builtin policies to create diagnostic settings in Azure Monitor.
author: EdB-MSFT
ms.author: edbaynash
services: azure-monitor
ms.topic: conceptual
ms.date: 02/25/2023
ms.reviewer: lualderm
--- 

# Built-in policies for Azure Monitor
Policies and policy initiatives provide a simple method to enable logging at-scale via diagnostics settings for Azure Monitor. Using a policy initiative, you can turn on audit logging for all [supported resources](#supported-resources) in your Azure environment.  

Enable resource logs to track activities and events that take place on your resources and give you visibility and insights into any changes that occur.
Assign policies to enable resource logs and to send them to destinations according to your needs. Send logs to Event Hubs for third-party SIEM systems, enabling continuous security operations. Send logs to storage accounts for longer term storage or the fulfillment of regulatory compliance. 

A set of built-in policies and initiatives exists to direct resource logs to Log Analytics Workspaces, Event Hubs, and Storage Accounts.

The policies enable audit logging, sending logs belonging to the **audit** log category group to an Event Hub, Log Analytics workspace or Storage Account.

The policies' `effect` is set to `DeployIfNotExists` which deploys the policy as a default if there are not other settings defined.


## Deploy policies.
Deploy the policies and initiatives using the Portal, CLI, PowerShell, or Azure Resource Management templates
### [Azure portal](#tab/portal)

The following steps show how to apply the policy to send audit logs to for key vaults to a log analytics workspace.

1. From the Policy page, select **Definitions**.

1. Select your scope. You can apply a policy to the entire subscription, a resource group, or an individual resource.
1. From the **Definition type** dropdown, select **Policy**.
1. Select **Monitoring** from the Category dropdown
1. Enter *keyvault* in the **Search** field.
1. Select the **Enable logging by category group for Key vaults (microsoft.keyvault/vaults) to Log Analytics** policy,
    :::image type="content" source="./media/diagnostics-settings-policies-deployifnotexists/policy-definitions.png" alt-text="A screenshot of the policy definitions page":::
1. From the policy definition page, select **Assign**
1. Select the **Parameters** tab.
1. Select the Log Analytics Workspace that you want to send the audit logs to.
1. Select the **Remediation** tab.
 :::image type="content" source="./media/diagnostics-settings-policies-deployifnotexists/assign-policy-parameters.png" alt-text="A screenshot of the assign policy page, parameters tab.":::
1. On the remediation tab, select the the keyvault policy from the **Policy to remediate** dropdown.
1. Select the **Create a Managed Identity** checkbox.
1. Under **Type of Managed Identity**, select **System assigned Managed Identity**.
1. Select **Review + create**, then select **Create** .
  :::image type="content" source="./media/diagnostics-settings-policies-deployifnotexists/assign-policy-remediation.png" alt-text="A screenshot of the assign policy page, remediation tab.":::

The policy will be applied to resources after approximately 30 minutes.

### [CLI](#tab/cli)
To apply a policy using the CLI, use the following commands:

1. Create a policy assignment using 
```azurecli

  az policy assignment create --name <policy assignment name>  --policy "6b359d8f-f88d-4052-aa7c-32015963ecc1"  --scope </subsciption/12345687-abcf-....> --params "{\"logAnalytics\": {\"value\": \"<log analytics workspace resource ID"}}" --mi-system-assigned --location <location>
```
For example, to apply the policy to send audit logs to a log analytics workspace

```azurecli
  az policy assignment create --name "policy-assignment-1"  --policy "6b359d8f-f88d-4052-aa7c-32015963ecc1"  --scope /subscriptions/12345678-aaaa-bbbb-cccc-1234567890ab/resourceGroups/rg-001 --params "{\"logAnalytics\": {\"value\": \"/subscriptions/12345678-aaaa-bbbb-cccc-1234567890ab/resourcegroups/rg-001/providers/microsoft.operationalinsights/workspaces/workspace001\"}}" --mi-system-assigned --location eastus
```

2. Assign the Contributor role to the identity created for the policy assignment

```azurecli
az policy assignment identity assign --system-assigned -g <resource group name> --role Contributor --identity-scope </scope> -n <policy assignment name>
```
For example. 
```azurecli
az policy assignment identity assign --system-assigned -g rg-001  --role Owner --identity-scope /subscriptions/12345678-aaaa-bbbb-cccc-1234567890ab/resourceGroups/rg001 -n policy-assignment-1
```

3. Create a remediation task to apply the policy to existing resources.

```azurecli
az policy remediation create -g <resource group name> --policy-assignment <policy assignment name> --name <remediation name> 
```
For example,
```azurecli
az policy remediation create -g rg-001 -n remediation-001 --policy-assignment  policy-assignment-1
```

For more information on policy assignment using CLI see [Azure CLI reference - az policy assignment](https://learn.microsoft.com/cli/azure/policy/assignment?view=azure-cli-latest#az-policy-assignment-create)
### [PowerShell](#tab/Powershell)

Get form dev

---
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

* [Create diagnostic settings at scale using Azure Policy](./diagnostic-settings-policy.md)
* [Azure Policy built-in definitions for Azure Monitor](../policy-reference.md)
* [Azure Policy Overview](../../governance/policy/overview.md)
* [Azure Enterprise Policy as Code](https://techcommunity.microsoft.com/t5/core-infrastructure-and-security/azure-enterprise-policy-as-code-a-new-approach/ba-p/3607843)