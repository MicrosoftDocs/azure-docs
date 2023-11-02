---
title: Query your Azure Virtual Network Manager using Azure Resource Graph (ARG)
description: This article covers the usage of Azure Resource Graph with Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.topic: conceptual
ms.service: virtual-network-manager
ms.date: 11/02/2023
---

# Query your Azure Virtual Network Manager using Azure Resource Graph (ARG)

## Overview

This article covers the usage of [Azure Resource Graph](../governance/resource-graph/overview.md) with Azure Virtual Network Manager. Azure Resource Graph (ARG) extends Azure Resource Management allowing you to query a given set of subscriptions for better governance of your environment. With ARG integration, you can query ARG to get insights into their Azure Virtual Network Manager (AVNM) configurations. Insights are provided through customized [Kusto queries](/azure/data-explorer/kusto/query/) offering resource level or at the regional level status data.

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]

## Using ARG with virtual network manager

The following are some of the scenarios where Azure Resource Graph can be used for insight into Azure Virtual Network Manager:

- Retrieve regional goal state data to understand the configurations that are deployed in each region and their status.
- Discover all the resources that have a particular configuration applied.
- Retrieve effective configurations that are applied to a virtual network and its provisioning state.
- Identify the number of virtual networks that succeeded, failed, or are in progress during a deployment process.

## Available Resources

The following resources are available for querying [security admin configurations](concept-security-admins.md) in ARG:

- microsoft.network/effectivesecurityadminrules
- microsoft.network/networkmanagers/securityadminconfigurations/rulecollections/snapshots
- microsoft.network/networkmanagers/securityadminconfigurations/rulecollections/rules/snapshots
- microsoft.network/networkmanagers/securityadminconfigurations/snapshots
- microsoft.network/networkmanagers/securityadminregionalgoalstates

## Get Started

To get started with querying your virtual network manager data in ARG, follow these steps:

1. Search for *Resource Graph Explorer* in the Azure portal and select the same to get redirected to the ARG query editor.

:::image type="content" source="media/query-azure-resource-graph/azure-resource-graph-editor.png" alt-text="Screenshot of Azure Resource Graph editor with virtual network manager query in kusto.":::

The left pane displays all tables (and their associated schemas) that are available for query.

1. Enter your Kusto queries in the query editor and select **Run Query**.

You can download the output of these queries as CSV from the **Resource Graph Explorer**. You can also use these queries in custom automation using any automation clients supported by ARG, such as [PowerShell](../governance/resource-graph/first-query-powershell.md), [CLI](../governance/resource-graph/first-query-azurecli.md), or [SDK](../governance/resource-graph/first-query-python.md). You can also create [custom workbooks](../azure-monitor/visualize/workbooks-overview.md) in the Azure portal using ARG as a data source.

> [!NOTE]
> ARG allows you to query the resources for which you have the appropriate RBAC rights.

## Sample Queries

The following are sample queries you can run on your virtual network manager data.  You can use in them in custom dashboards and automations. Listed with each query is the input involved and the output returned.

#### List all virtual network managers impacting a given virtual network

Input: `{VnetId}`.
Output: List of network manager IDs.

```kusto

networkresources
| where type == "microsoft.network/effectivesecurityadminrules"
| extend vnetId = "{*VnetId*}"
| where id == strcat(vnetId, "/providers/Microsoft.Network/effectiveSecurityAdminRules/default")
| mv-expand properties.EffectiveSecurityAdminConfigurations
| mv-expand properties.effectiveSecurityAdminConfigurations
| extend configId = tolower(iff(properties_EffectiveSecurityAdminConfigurations.Id == "", properties_effectiveSecurityAdminConfigurations.id, properties_EffectiveSecurityAdminConfigurations.Id))
| extend networkManagerId =  substring(configId, 0, indexof(configId, "/securityadminconfigurations/"))
| distinct networkManagerId

```

#### List commit details of latest security admin commit for a given network manager

Input: `{NetworkManagerId}`
Output: `{CommitId, CommitTimestamp, location, SecurityAdminConfigurationId, SecurityAdminRuleIds, SecurityAdminRuleCollectionIds, status, errorMessage}`

```kusto
networkresources
| where type == "microsoft.network/networkmanagers/securityadminregionalgoalstates"
| where id contains tolower("{*NetworkManagerId*}")
| extend adminConfigurationId = tolower(iff(properties.securityAdminConfigurations[0].id == "", properties.SecurityAdminConfigurations[0].Id, properties.securityAdminConfigurations[0].id))
| extend adminRuleCollectionIds = todynamic(iff(properties.securityAdminRuleCollections == "", properties.SecurityAdminRuleCollections, properties.securityAdminRuleCollections))
| extend adminRuleIds = todynamic(iff(properties.securityAdminRules == "", properties.SecurityAdminRules, properties.securityAdminRules))
| extend commitId = iff(properties.commitId == "", properties.CommitId, properties.commitId)
| extend timeStamp =  todatetime(iff(properties.commitTimestamp == "", properties.CommitTimestamp, properties.commitTimestamp))
| extend status = iff(properties.status == "", properties.Status, properties.status)
| extend errorMessage = iff(properties.errorMessage == "" and properties.ErrorMessage == "", "", iff(properties.errorMessage == "", properties.ErrorMessage, properties.errorMessage))
| order by timeStamp desc 
| project commitId, timeStamp, location, adminConfigurationId, adminRuleCollectionIds, adminRuleIds, status, errorMessage
```


#### Count of virtual networks impacted by a given security admin configuration

Input: `{SecurityAdminConfigurationSnapshotId}`
Example `{SecurityAdminConfigurationSnapshotId}`ID: `"/subscriptions/2c505610-a5dd-473e-aa33-b31aac398e29/resourceGroups/CnAISecurityAzureNetworkManager/providers/Microsoft.Network/networkManagers/NRMS-ZeroTrust-CorpProdNonprod/securityAdminConfigurations/config_2023-05-15-15-07-27/snapshots/0"`
Output: {Region, successCount, failedcount}

> [!NOTE]
> The `{SecurityAdminConfigurationSnapshotId}` is the id of the security admin configuration snapshot. You can get this id from the output of [List commit details](#list-commit-details-of-latest-security-admin-commit-for-a-given-network-manager) query.

```kusto

networkresources
| where type == "microsoft.network/effectivesecurityadminrules"
| extend snapshotConfigIdToCheck =  tolower("*{SecurityAdminConfigurationSnapshotId}*")
| mv-expand properties.effectiveSecurityAdminConfigurations
| mv-expand properties.EffectiveSecurityAdminConfigurations
| extend configurationId = tolower(iff(properties_effectiveSecurityAdminConfigurations.id == "", properties_EffectiveSecurityAdminConfigurations.Id, properties_effectiveSecurityAdminConfigurations.id))
| extend provisioningState = tolower(iff(properties.ProvisioningState == "", properties.provisioningState, properties.ProvisioningState))
| where configurationId == snapshotConfigIdToCheck
| summarize count() by location, provisioningState

```

#### List status of virtual networks impacted by a given security admin configuration

Input: `{SecurityAdminConfigurationSnapshotId}`
Example `{SecurityAdminConfigurationSnapshotId}`: `"/subscriptions/2c505610-a5dd-473e-aa33-b31aac398e29/resourceGroups/CnAISecurityAzureNetworkManager/providers/Microsoft.Network/networkManagers/NRMS-ZeroTrust-CorpProdNonprod/securityAdminConfigurations/config_2023-05-15-15-07-27/snapshots/0"`
Output: `{Region, Status, Count}`

> [!NOTE]
> The `{SecurityAdminConfigurationSnapshotId}` is the id of the security admin configuration snapshot. You can get this id from the output of [List commit details](#list-commit-details-of-latest-security-admin-commit-for-a-given-network-manager) query.

```kusto


networkresources
| where type == "microsoft.network/effectivesecurityadminrules"
| extend resourceId = tolower(iff(properties.ResourceId == "", properties.resourceId, properties.ResourceId))
| extend provisioningState = iff(properties.ProvisioningState == "", properties.provisioningState, properties.ProvisioningState)
| extend errorMessage = iff(properties.ErrorMessage == "", properties.errorMessage, properties.ErrorMessage) 
| extend configIds = tolower(iff(properties.effectiveSecurityAdminConfigurations == "", properties.EffectiveSecurityAdminConfigurations, properties.effectiveSecurityAdminConfigurations))
| project resourceId, provisioningState, errorMessage, configIds, location
| join kind=inner (networkresources
| where type == "microsoft.network/networkmanagers/networkgroups/members"
| extend id_lower = tolower(id)
| extend networkGroupId = strcat(substring(id_lower, 0, indexof(id_lower, "/members/")), location)
| extend resourceId = tolower(iff(properties.memberId == "", properties.MemberId, properties.memberId))
| project networkGroupId, resourceId
| join kind=inner (networkresources
| where type == "microsoft.network/networkmanagers/securityadminconfigurations/rulecollections/snapshots"
| extend id = tolower(id)
| join kind=inner (networkresources
| where type == "microsoft.network/networkmanagers/securityadminregionalgoalstates"
| extend inputAdminConfigId1 = tolower("{SecurityAdminConfigurationSnapshotId}")
| extend configId = tolower(properties.securityAdminConfigurations[0].id)
| where configId == inputAdminConfigId1
| extend ruleCollections = todynamic(properties.securityAdminRuleCollections)
| mv-expand ruleCollections
| extend id = tolower(ruleCollections.id)
| extend region = tostring(location)
| distinct id, region) on id
| mv-expand properties.appliesToGroups
| extend networkGroupId = strcat(tolower(properties_appliesToGroups.networkGroupId), region)
| distinct networkGroupId) on networkGroupId
| distinct resourceId) on resourceId
| extend inputAdminConfigId = tolower("{SecurityAdminConfigurationSnapshotId}")
| extend status = iff(configIds contains inputAdminConfigId and provisioningState == "Succeeded", "Succeeded", iff(configIds !contains inputAdminConfigId, "InProgress", "Failed"))
| project resourceId, errorMessage, configIds, location, status
| summarize count() by location, status
| order by location

```
> [!NOTE]
>  Remove the `order by location` statement in the query to get the failure message for each failed virtual network.

## Next steps

Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance using the Azure portal.