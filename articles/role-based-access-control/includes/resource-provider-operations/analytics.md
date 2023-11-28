---
title: Analytics resource provider operations include file
description: Analytics resource provider operations include file
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.workload: identity
ms.topic: include
ms.date: 06/01/2023
ms.author: rolyon
ms.custom: generated
---

### Microsoft.AnalysisServices

Azure service: [Azure Analysis Services](../../../analysis-services/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AnalysisServices/register/action | Registers Analysis Services resource provider. |
> | Microsoft.AnalysisServices/locations/checkNameAvailability/action | Checks that given Analysis Server name is valid and not in use. |
> | Microsoft.AnalysisServices/locations/operationresults/read | Retrieves the information of the specified operation result. |
> | Microsoft.AnalysisServices/locations/operationstatuses/read | Retrieves the information of the specified operation status. |
> | Microsoft.AnalysisServices/operations/read | Retrieves the information of operations |
> | Microsoft.AnalysisServices/servers/read | Retrieves the information of the specified Analysis Server. |
> | Microsoft.AnalysisServices/servers/write | Creates or updates the specified Analysis Server. |
> | Microsoft.AnalysisServices/servers/delete | Deletes the Analysis Server. |
> | Microsoft.AnalysisServices/servers/suspend/action | Suspends the Analysis Server. |
> | Microsoft.AnalysisServices/servers/resume/action | Resumes the Analysis Server. |
> | Microsoft.AnalysisServices/servers/listGatewayStatus/action | List the status of the gateway associated with the server. |
> | Microsoft.AnalysisServices/servers/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for Analysis Server |
> | Microsoft.AnalysisServices/servers/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for Analysis Server |
> | Microsoft.AnalysisServices/servers/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for servers |
> | Microsoft.AnalysisServices/servers/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Analysis Server |
> | Microsoft.AnalysisServices/servers/skus/read | Retrieve available SKU information for the server |
> | Microsoft.AnalysisServices/skus/read | Retrieves the information of Skus |

### Microsoft.Databricks

Azure service: [Azure Databricks](/azure/databricks/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Databricks/register/action | Register to Databricks. |
> | Microsoft.Databricks/accessConnectors/read | Retrieves a list of Azure Databricks Access Connectors |
> | Microsoft.Databricks/accessConnectors/write | Creates an Azure Databricks Access Connector |
> | Microsoft.Databricks/accessConnectors/delete | Removes Azure Databricks Access Connector |
> | Microsoft.Databricks/locations/getNetworkPolicies/action | Get Network Intent Polices for a subnet based on the location used by NRP |
> | Microsoft.Databricks/locations/operationstatuses/read | Reads the operation status for the resource. |
> | Microsoft.Databricks/operations/read | Gets the list of operations. |
> | Microsoft.Databricks/workspaces/read | Retrieves a list of Databricks workspaces. |
> | Microsoft.Databricks/workspaces/write | Creates a Databricks workspace. |
> | Microsoft.Databricks/workspaces/delete | Removes a Databricks workspace. |
> | Microsoft.Databricks/workspaces/refreshPermissions/action | Refresh permissions for a workspace |
> | Microsoft.Databricks/workspaces/migratePrivateLinkWorkspaces/action | Applies new NIP templates based on 'requiredNsgRules' and 'enablePublicAccess' |
> | Microsoft.Databricks/workspaces/updateDenyAssignment/action | Update deny assignment not actions for a managed resource group of a workspace |
> | Microsoft.Databricks/workspaces/refreshWorkspaces/action | Refresh a workspace with new details like URL |
> | Microsoft.Databricks/workspaces/privateEndpointConnectionsApproval/action | Approve or reject a connection to a Private Endpoint resource. |
> | Microsoft.Databricks/workspaces/dbWorkspaces/write | Initializes the Databricks workspace (internal only) |
> | Microsoft.Databricks/workspaces/outboundNetworkDependenciesEndpoints/read | Gets a list of egress endpoints (network endpoints of all outbound dependencies) for an Azure Databricks Workspace. The operation returns properties of each egress endpoint |
> | Microsoft.Databricks/workspaces/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.Databricks/workspaces/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxies |
> | Microsoft.Databricks/workspaces/privateEndpointConnectionProxies/write | Put Private Endpoint Connection Proxies |
> | Microsoft.Databricks/workspaces/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxies |
> | Microsoft.Databricks/workspaces/privateEndpointConnections/read | List Private Endpoint Connections |
> | Microsoft.Databricks/workspaces/privateEndpointConnections/write | Approve Private Endpoint Connections |
> | Microsoft.Databricks/workspaces/privateEndpointConnections/delete | Remove Private Endpoint Connection |
> | Microsoft.Databricks/workspaces/privateLinkResources/read | List Private Link Resources |
> | Microsoft.Databricks/workspaces/providers/Microsoft.Insights/diagnosticSettings/read | Sets the available diagnostic settings for the Databricks workspace |
> | Microsoft.Databricks/workspaces/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.Databricks/workspaces/providers/Microsoft.Insights/logDefinitions/read | Gets the available log definitions for the Databricks workspace |
> | Microsoft.Databricks/workspaces/virtualNetworkPeerings/read | Gets the virtual network peering. |
> | Microsoft.Databricks/workspaces/virtualNetworkPeerings/write | Add or modify virtual network peering |
> | Microsoft.Databricks/workspaces/virtualNetworkPeerings/delete | Deletes a virtual network peering |

### Microsoft.DataLakeAnalytics

Azure service: [Data Lake Analytics](../../../data-lake-analytics/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DataLakeAnalytics/register/action | Register subscription to DataLakeAnalytics. |
> | Microsoft.DataLakeAnalytics/accounts/read | Get information about an existing DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/write | Create or update a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/delete | Delete a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/transferAnalyticsUnits/action | Transfer SystemMaxAnalyticsUnits among DataLakeAnalytics accounts. |
> | Microsoft.DataLakeAnalytics/accounts/TakeOwnership/action | Grant permissions to cancel jobs submitted by other users. |
> | Microsoft.DataLakeAnalytics/accounts/computePolicies/read | Get information about a compute policy. |
> | Microsoft.DataLakeAnalytics/accounts/computePolicies/write | Create or update a compute policy. |
> | Microsoft.DataLakeAnalytics/accounts/computePolicies/delete | Delete a compute policy. |
> | Microsoft.DataLakeAnalytics/accounts/dataLakeStoreAccounts/read | Get information about a linked DataLakeStore account of a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/dataLakeStoreAccounts/write | Create or update a linked DataLakeStore account of a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/dataLakeStoreAccounts/delete | Unlink a DataLakeStore account from a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/dataLakeStoreGen2Accounts/read | Get information about a linked DataLakeStoreGen2 account of a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/dataLakeStoreGen2Accounts/write | Create or update a linked DataLakeStoreGen2 account of a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/dataLakeStoreGen2Accounts/delete | Unlink a DataLakeStoreGen2 account from a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/firewallRules/read | Get information about a firewall rule. |
> | Microsoft.DataLakeAnalytics/accounts/firewallRules/write | Create or update a firewall rule. |
> | Microsoft.DataLakeAnalytics/accounts/firewallRules/delete | Delete a firewall rule. |
> | Microsoft.DataLakeAnalytics/accounts/operationResults/read | Get result of a DataLakeAnalytics account operation. |
> | Microsoft.DataLakeAnalytics/accounts/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostic settings for the DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/providers/Microsoft.Insights/diagnosticSettings/write | Create or update the diagnostic settings for the DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/providers/Microsoft.Insights/logDefinitions/read | Get the available logs for the DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/providers/Microsoft.Insights/metricDefinitions/read | Get the available metrics for the DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/storageAccounts/read | Get information about a linked Storage account of a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/storageAccounts/write | Create or update a linked Storage account of a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/storageAccounts/delete | Unlink a Storage account from a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/storageAccounts/Containers/read | Get containers of a linked Storage account of a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/storageAccounts/Containers/listSasTokens/action | List SAS tokens for storage containers of a linked Storage account of a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/virtualNetworkRules/read | Get information about a virtual network rule. |
> | Microsoft.DataLakeAnalytics/accounts/virtualNetworkRules/write | Create or update a virtual network rule. |
> | Microsoft.DataLakeAnalytics/accounts/virtualNetworkRules/delete | Delete a virtual network rule. |
> | Microsoft.DataLakeAnalytics/locations/checkNameAvailability/action | Check availability of a DataLakeAnalytics account name. |
> | Microsoft.DataLakeAnalytics/locations/capability/read | Get capability information of a subscription regarding using DataLakeAnalytics. |
> | Microsoft.DataLakeAnalytics/locations/operationResults/read | Get result of a DataLakeAnalytics account operation. |
> | Microsoft.DataLakeAnalytics/locations/usages/read | Get quota usages information of a subscription regarding using DataLakeAnalytics. |
> | Microsoft.DataLakeAnalytics/operations/read | Get available operations of DataLakeAnalytics. |

### Microsoft.DataLakeStore

Azure service: [Azure Data Lake Store](../../../storage/blobs/data-lake-storage-introduction.md)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DataLakeStore/register/action | Register subscription to DataLakeStore. |
> | Microsoft.DataLakeStore/accounts/read | Get information about an existing DataLakeStore account. |
> | Microsoft.DataLakeStore/accounts/write | Create or update a DataLakeStore account. |
> | Microsoft.DataLakeStore/accounts/delete | Delete a DataLakeStore account. |
> | Microsoft.DataLakeStore/accounts/enableKeyVault/action | Enable KeyVault for a DataLakeStore account. |
> | Microsoft.DataLakeStore/accounts/Superuser/action | Grant Superuser on Data Lake Store when granted with Microsoft.Authorization/roleAssignments/write. |
> | Microsoft.DataLakeStore/accounts/cosmosCertMappings/read | Get information about a Cosmos Cert Mapping. |
> | Microsoft.DataLakeStore/accounts/cosmosCertMappings/write | Create or update a Cosmos Cert Mapping. |
> | Microsoft.DataLakeStore/accounts/cosmosCertMappings/delete | Delete a Cosmos Cert Mapping. |
> | Microsoft.DataLakeStore/accounts/eventGridFilters/read | Get an EventGrid Filter. |
> | Microsoft.DataLakeStore/accounts/eventGridFilters/write | Create or update an EventGrid Filter. |
> | Microsoft.DataLakeStore/accounts/eventGridFilters/delete | Delete an EventGrid Filter. |
> | Microsoft.DataLakeStore/accounts/firewallRules/read | Get information about a firewall rule. |
> | Microsoft.DataLakeStore/accounts/firewallRules/write | Create or update a firewall rule. |
> | Microsoft.DataLakeStore/accounts/firewallRules/delete | Delete a firewall rule. |
> | Microsoft.DataLakeStore/accounts/mountpoints/read | Get information about a mount point. |
> | Microsoft.DataLakeStore/accounts/operationResults/read | Get result of a DataLakeStore account operation. |
> | Microsoft.DataLakeStore/accounts/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostic settings for the DataLakeStore account. |
> | Microsoft.DataLakeStore/accounts/providers/Microsoft.Insights/diagnosticSettings/write | Create or update the diagnostic settings for the DataLakeStore account. |
> | Microsoft.DataLakeStore/accounts/providers/Microsoft.Insights/logDefinitions/read | Get the available logs for the DataLakeStore account. |
> | Microsoft.DataLakeStore/accounts/providers/Microsoft.Insights/metricDefinitions/read | Get the available metrics for the DataLakeStore account. |
> | Microsoft.DataLakeStore/accounts/shares/read | Get information about a share. |
> | Microsoft.DataLakeStore/accounts/shares/write | Create or update a share. |
> | Microsoft.DataLakeStore/accounts/shares/delete | Delete a share. |
> | Microsoft.DataLakeStore/accounts/trustedIdProviders/read | Get information about a trusted identity provider. |
> | Microsoft.DataLakeStore/accounts/trustedIdProviders/write | Create or update a trusted identity provider. |
> | Microsoft.DataLakeStore/accounts/trustedIdProviders/delete | Delete a trusted identity provider. |
> | Microsoft.DataLakeStore/accounts/virtualNetworkRules/read | Get information about a virtual network rule. |
> | Microsoft.DataLakeStore/accounts/virtualNetworkRules/write | Create or update a virtual network rule. |
> | Microsoft.DataLakeStore/accounts/virtualNetworkRules/delete | Delete a virtual network rule. |
> | Microsoft.DataLakeStore/locations/checkNameAvailability/action | Check availability of a DataLakeStore account name. |
> | Microsoft.DataLakeStore/locations/deleteVirtualNetworkOrSubnets/action | Delete Virtual Network or Subnets across DataLakeStore Accounts. |
> | Microsoft.DataLakeStore/locations/capability/read | Get capability information of a subscription regarding using DataLakeStore. |
> | Microsoft.DataLakeStore/locations/operationResults/read | Get result of a DataLakeStore account operation. |
> | Microsoft.DataLakeStore/locations/usages/read | Get quota usages information of a subscription regarding using DataLakeStore. |
> | Microsoft.DataLakeStore/operations/read | Get available operations of DataLakeStore. |

### Microsoft.EventHub

Azure service: [Event Hubs](../../../event-hubs/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.EventHub/checkNamespaceAvailability/action | Checks availability of namespace under given subscription. This API is deprecated please use CheckNameAvailability instead. |
> | Microsoft.EventHub/checkNameAvailability/action | Checks availability of namespace under given subscription. |
> | Microsoft.EventHub/register/action | Registers the subscription for the EventHub resource provider and enables the creation of EventHub resources |
> | Microsoft.EventHub/unregister/action | Registers the EventHub Resource Provider |
> | Microsoft.EventHub/availableClusterRegions/read | Read operation to list available pre-provisioned clusters by Azure region. |
> | Microsoft.EventHub/clusters/read | Gets the Cluster Resource Description |
> | Microsoft.EventHub/clusters/write | Creates or modifies an existing Cluster resource. |
> | Microsoft.EventHub/clusters/delete | Deletes an existing Cluster resource. |
> | Microsoft.EventHub/clusters/namespaces/read | List namespace Azure Resource Manager IDs for namespaces within a cluster. |
> | Microsoft.EventHub/clusters/operationresults/read | Get the status of an asynchronous cluster operation. |
> | Microsoft.EventHub/clusters/providers/Microsoft.Insights/metricDefinitions/read | Get list of Cluster metrics Resource Descriptions |
> | Microsoft.EventHub/locations/deleteVirtualNetworkOrSubnets/action | Deletes the VNet rules in EventHub Resource Provider for the specified VNet |
> | Microsoft.EventHub/namespaces/write | Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated. |
> | Microsoft.EventHub/namespaces/read | Get the list of Namespace Resource Description |
> | Microsoft.EventHub/namespaces/Delete | Delete Namespace Resource |
> | Microsoft.EventHub/namespaces/authorizationRules/action | Updates Namespace Authorization Rule. This API is deprecated. Please use a PUT call to update the Namespace Authorization Rule instead.. This operation is not supported on API version 2017-04-01. |
> | Microsoft.EventHub/namespaces/removeAcsNamespace/action | Remove Access Control Service namespace |
> | Microsoft.EventHub/namespaces/privateEndpointConnectionsApproval/action | Approve Private Endpoint Connection |
> | Microsoft.EventHub/namespaces/joinPerimeter/action | Action to Join the Network Security Perimeter. This action is used to perform linked access by NSP RP. |
> | Microsoft.EventHub/namespaces/authorizationRules/read | Get the list of Namespaces Authorization Rules description. |
> | Microsoft.EventHub/namespaces/authorizationRules/write | Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Microsoft.EventHub/namespaces/authorizationRules/delete | Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted.  |
> | Microsoft.EventHub/namespaces/authorizationRules/listkeys/action | Get the Connection String to the Namespace |
> | Microsoft.EventHub/namespaces/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Microsoft.EventHub/namespaces/disasterrecoveryconfigs/checkNameAvailability/action | Checks availability of namespace alias under given subscription. |
> | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/write | Creates or Updates the Disaster Recovery configuration associated with the namespace. |
> | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/read | Gets the Disaster Recovery configuration associated with the namespace. |
> | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/delete | Deletes the Disaster Recovery configuration associated with the namespace. This operation can only be invoked via the primary namespace. |
> | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/breakPairing/action | Disables Disaster Recovery and stops replicating changes from primary to secondary namespaces. |
> | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/failover/action | Invokes a GEO DR failover and reconfigures the namespace alias to point to the secondary namespace. |
> | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/authorizationRules/read | Get Disaster Recovery Primary Namespace's Authorization Rules |
> | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/authorizationRules/listkeys/action | Gets the authorization rules keys for the Disaster Recovery primary namespace |
> | Microsoft.EventHub/namespaces/eventhubs/write | Create or Update EventHub properties. |
> | Microsoft.EventHub/namespaces/eventhubs/read | Get list of EventHub Resource Descriptions |
> | Microsoft.EventHub/namespaces/eventhubs/Delete | Operation to delete EventHub Resource |
> | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/action | Operation to update EventHub. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule. |
> | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/read |  Get the list of EventHub Authorization Rules |
> | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/write | Create EventHub Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated. |
> | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/delete | Operation to delete EventHub Authorization Rules |
> | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/listkeys/action | Get the Connection String to EventHub |
> | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Microsoft.EventHub/namespaces/eventHubs/consumergroups/write | Create or Update ConsumerGroup properties. |
> | Microsoft.EventHub/namespaces/eventHubs/consumergroups/read | Get list of ConsumerGroup Resource Descriptions |
> | Microsoft.EventHub/namespaces/eventHubs/consumergroups/Delete | Operation to delete ConsumerGroup Resource |
> | Microsoft.EventHub/namespaces/ipFilterRules/read | Get IP Filter Resource |
> | Microsoft.EventHub/namespaces/ipFilterRules/write | Create IP Filter Resource |
> | Microsoft.EventHub/namespaces/ipFilterRules/delete | Delete IP Filter Resource |
> | Microsoft.EventHub/namespaces/messagingPlan/read | Gets the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Microsoft.EventHub/namespaces/messagingPlan/write | Updates the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Microsoft.EventHub/namespaces/networkruleset/read | Gets NetworkRuleSet Resource |
> | Microsoft.EventHub/namespaces/networkruleset/write | Create VNET Rule Resource |
> | Microsoft.EventHub/namespaces/networkruleset/delete | Delete VNET Rule Resource |
> | Microsoft.EventHub/namespaces/networkrulesets/read | Gets NetworkRuleSet Resource |
> | Microsoft.EventHub/namespaces/networkrulesets/write | Create VNET Rule Resource |
> | Microsoft.EventHub/namespaces/networkrulesets/delete | Delete VNET Rule Resource |
> | Microsoft.EventHub/namespaces/networkSecurityPerimeterAssociationProxies/write | Create NetworkSecurityPerimeterAssociationProxies |
> | Microsoft.EventHub/namespaces/networkSecurityPerimeterAssociationProxies/read | Get NetworkSecurityPerimeterAssociationProxies |
> | Microsoft.EventHub/namespaces/networkSecurityPerimeterAssociationProxies/delete | Delete NetworkSecurityPerimeterAssociationProxies |
> | Microsoft.EventHub/namespaces/networkSecurityPerimeterAssociationProxies/reconcile/action | Reconcile NetworkSecurityPerimeterAssociationProxies |
> | Microsoft.EventHub/namespaces/networkSecurityPerimeterConfigurations/read | Get Network Security Perimeter Configurations |
> | Microsoft.EventHub/namespaces/networkSecurityPerimeterConfigurations/reconcile/action | Reconcile Network Security Perimeter Configurations |
> | Microsoft.EventHub/namespaces/operationresults/read | Get the status of Namespace operation |
> | Microsoft.EventHub/namespaces/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxy |
> | Microsoft.EventHub/namespaces/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.EventHub/namespaces/privateEndpointConnectionProxies/write | Create Private Endpoint Connection Proxy |
> | Microsoft.EventHub/namespaces/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxy |
> | Microsoft.EventHub/namespaces/privateEndpointConnectionProxies/operationstatus/read | Get the status of an asynchronous private endpoint operation |
> | Microsoft.EventHub/namespaces/privateEndpointConnections/read | Get Private Endpoint Connection |
> | Microsoft.EventHub/namespaces/privateEndpointConnections/write | Create or Update Private Endpoint Connection |
> | Microsoft.EventHub/namespaces/privateEndpointConnections/delete | Removes Private Endpoint Connection |
> | Microsoft.EventHub/namespaces/privateEndpointConnections/operationstatus/read | Get the status of an asynchronous private endpoint operation |
> | Microsoft.EventHub/namespaces/privateLinkResources/read | Gets the resource types that support private endpoint connections |
> | Microsoft.EventHub/namespaces/providers/Microsoft.Insights/diagnosticSettings/read | Get list of Namespace diagnostic settings Resource Descriptions |
> | Microsoft.EventHub/namespaces/providers/Microsoft.Insights/diagnosticSettings/write | Get list of Namespace diagnostic settings Resource Descriptions |
> | Microsoft.EventHub/namespaces/providers/Microsoft.Insights/logDefinitions/read | Get list of Namespace logs Resource Descriptions |
> | Microsoft.EventHub/namespaces/providers/Microsoft.Insights/metricDefinitions/read | Get list of Namespace metrics Resource Descriptions |
> | Microsoft.EventHub/namespaces/schemagroups/write | Create or Update SchemaGroup properties. |
> | Microsoft.EventHub/namespaces/schemagroups/read | Get list of SchemaGroup Resource Descriptions |
> | Microsoft.EventHub/namespaces/schemagroups/delete | Operation to delete SchemaGroup Resource |
> | Microsoft.EventHub/namespaces/virtualNetworkRules/read | Gets VNET Rule Resource |
> | Microsoft.EventHub/namespaces/virtualNetworkRules/write | Create VNET Rule Resource |
> | Microsoft.EventHub/namespaces/virtualNetworkRules/delete | Delete VNET Rule Resource |
> | Microsoft.EventHub/operations/read | Get Operations |
> | Microsoft.EventHub/sku/read | Get list of Sku Resource Descriptions |
> | Microsoft.EventHub/sku/regions/read | Get list of SkuRegions Resource Descriptions |
> | **DataAction** | **Description** |
> | Microsoft.EventHub/namespaces/messages/send/action | Send messages |
> | Microsoft.EventHub/namespaces/messages/receive/action | Receive messages |
> | Microsoft.EventHub/namespaces/schemas/read | Retrieve schemas |
> | Microsoft.EventHub/namespaces/schemas/write | Write schemas |
> | Microsoft.EventHub/namespaces/schemas/delete | Delete schemas |

### Microsoft.HDInsight

Azure service: [HDInsight](../../../hdinsight/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.HDInsight/register/action | Register HDInsight resource provider for the subscription |
> | Microsoft.HDInsight/unregister/action | Unregister HDInsight resource provider for the subscription |
> | Microsoft.HDInsight/clusters/write | Create or Update HDInsight Cluster |
> | Microsoft.HDInsight/clusters/read | Get details about HDInsight Cluster |
> | Microsoft.HDInsight/clusters/delete | Delete a HDInsight Cluster |
> | Microsoft.HDInsight/clusters/getGatewaySettings/action | Get gateway settings for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/updateGatewaySettings/action | Update gateway settings for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/configurations/action | Get HDInsight Cluster Configurations |
> | Microsoft.HDInsight/clusters/executeScriptActions/action | Execute Script Actions for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/resolvePrivateLinkServiceId/action | Resolve Private Link Service ID for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/privateEndpointConnectionsApproval/action | Auto Approve Private Endpoint Connections for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/applications/read | Get Application for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/applications/write | Create or Update Application for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/applications/delete | Delete Application for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/configurations/read | Get HDInsight Cluster Configurations |
> | Microsoft.HDInsight/clusters/executeScriptActions/azureasyncoperations/read | Get Script Action status for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/executeScriptActions/operationresults/read | Get Script Action status for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/extensions/write | Create Cluster Extension for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/extensions/read | Get Cluster Extension for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/extensions/delete | Delete Cluster Extension for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/outboundNetworkDependenciesEndpoints/read | List Outbound Network Dependencies Endpoints for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/privateEndpointConnections/read | Get Private Endpoint Connections for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/privateEndpointConnections/write | Update Private Endpoint Connections for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/privateEndpointConnections/delete | Delete Private Endpoint Connections for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/privateLinkResources/read | Get Private Link Resources for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource HDInsight Cluster |
> | Microsoft.HDInsight/clusters/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource HDInsight Cluster |
> | Microsoft.HDInsight/clusters/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/roles/resize/action | Resize a HDInsight Cluster |
> | Microsoft.HDInsight/clusters/scriptActions/read | Get persisted Script Actions for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/scriptActions/delete | Delete persisted Script Actions for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/scriptExecutionHistory/read | Get Script Actions history for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/scriptExecutionHistory/promote/action | Promote Script Action for HDInsight Cluster |
> | Microsoft.HDInsight/locations/capabilities/read | Get Subscription Capabilities |
> | Microsoft.HDInsight/locations/checkNameAvailability/read | Check Name Availability |

### Microsoft.Kusto

Azure service: [Azure Data Explorer](/azure/data-explorer/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Kusto/register/action | Subscription Registration Action |
> | Microsoft.Kusto/Register/action | Registers the subscription to the Kusto Resource Provider. |
> | Microsoft.Kusto/Unregister/action | Unregisters the subscription to the Kusto Resource Provider. |
> | Microsoft.Kusto/Clusters/read | Reads a cluster resource. |
> | Microsoft.Kusto/Clusters/write | Writes a cluster resource. |
> | Microsoft.Kusto/Clusters/delete | Deletes a cluster resource. |
> | Microsoft.Kusto/Clusters/Start/action | Starts the cluster. |
> | Microsoft.Kusto/Clusters/Stop/action | Stops the cluster. |
> | Microsoft.Kusto/Clusters/Activate/action | Starts the cluster. |
> | Microsoft.Kusto/Clusters/Deactivate/action | Stops the cluster. |
> | Microsoft.Kusto/Clusters/CheckNameAvailability/action | Checks the cluster name availability. |
> | Microsoft.Kusto/Clusters/DetachFollowerDatabases/action | Detaches follower's databases. |
> | Microsoft.Kusto/Clusters/ListFollowerDatabases/action | Lists the follower's databases. |
> | Microsoft.Kusto/Clusters/DiagnoseVirtualNetwork/action | Diagnoses network connectivity status for external resources on which the service is dependent. |
> | Microsoft.Kusto/Clusters/ListLanguageExtensions/action | Lists language extensions. |
> | Microsoft.Kusto/Clusters/AddLanguageExtensions/action | Add language extensions. |
> | Microsoft.Kusto/Clusters/RemoveLanguageExtensions/action | Remove language extensions. |
> | Microsoft.Kusto/Clusters/AttachedDatabaseConfigurations/read | Reads an attached database configuration resource. |
> | Microsoft.Kusto/Clusters/AttachedDatabaseConfigurations/write | Writes an attached database configuration resource. |
> | Microsoft.Kusto/Clusters/AttachedDatabaseConfigurations/delete | Deletes an attached database configuration resource. |
> | Microsoft.Kusto/Clusters/AttachedDatabaseConfigurations/write | Write a script resource. |
> | Microsoft.Kusto/Clusters/AttachedDatabaseConfigurations/delete | Delete a script resource. |
> | Microsoft.Kusto/Clusters/Databases/read | Reads a database resource. |
> | Microsoft.Kusto/Clusters/Databases/write | Writes a database resource. |
> | Microsoft.Kusto/Clusters/Databases/delete | Deletes a database resource. |
> | Microsoft.Kusto/Clusters/Databases/ListPrincipals/action | Lists database principals. |
> | Microsoft.Kusto/Clusters/Databases/AddPrincipals/action | Adds database principals. |
> | Microsoft.Kusto/Clusters/Databases/RemovePrincipals/action | Removes database principals. |
> | Microsoft.Kusto/Clusters/Databases/DataConnectionValidation/action | Validates database data connection. |
> | Microsoft.Kusto/Clusters/Databases/CheckNameAvailability/action | Checks name availability for a given type. |
> | Microsoft.Kusto/Clusters/Databases/EventHubConnectionValidation/action | Validates database Event Hub connection. |
> | Microsoft.Kusto/Clusters/Databases/DataConnections/read | Reads a data connections resource. |
> | Microsoft.Kusto/Clusters/Databases/DataConnections/write | Writes a data connections resource. |
> | Microsoft.Kusto/Clusters/Databases/DataConnections/delete | Deletes a data connections resource. |
> | Microsoft.Kusto/Clusters/Databases/EventHubConnections/read | Reads an Event Hub connections resource. |
> | Microsoft.Kusto/Clusters/Databases/EventHubConnections/write | Writes an Event Hub connections resource. |
> | Microsoft.Kusto/Clusters/Databases/EventHubConnections/delete | Deletes an Event Hub connections resource. |
> | Microsoft.Kusto/Clusters/Databases/PrincipalAssignments/read | Reads a database principal assignments resource. |
> | Microsoft.Kusto/Clusters/Databases/PrincipalAssignments/write | Writes a database principal assignments resource. |
> | Microsoft.Kusto/Clusters/Databases/PrincipalAssignments/delete | Deletes a database principal assignments resource. |
> | Microsoft.Kusto/Clusters/Databases/Scripts/read | Reads a script resource. |
> | Microsoft.Kusto/Clusters/DataConnections/read | Reads a cluster's data connections resource. |
> | Microsoft.Kusto/Clusters/DataConnections/write | Writes a cluster's data connections resource. |
> | Microsoft.Kusto/Clusters/DataConnections/delete | Deletes a cluster's data connections resource. |
> | Microsoft.Kusto/Clusters/ManagedPrivateEndpoints/read | Reads a managed private endpoint |
> | Microsoft.Kusto/Clusters/ManagedPrivateEndpoints/write | Writes a managed private endpoint |
> | Microsoft.Kusto/Clusters/ManagedPrivateEndpoints/delete | Deletes a managed private endpoint |
> | Microsoft.Kusto/Clusters/OutboundNetworkDependenciesEndpoints/read | Reads outbound network dependencies endpoints for a resource |
> | Microsoft.Kusto/Clusters/PrincipalAssignments/read | Reads a Cluster principal assignments resource. |
> | Microsoft.Kusto/Clusters/PrincipalAssignments/write | Writes a Cluster principal assignments resource. |
> | Microsoft.Kusto/Clusters/PrincipalAssignments/delete | Deletes a Cluster principal assignments resource. |
> | Microsoft.Kusto/Clusters/PrivateEndpointConnectionProxies/read | Reads a private endpoint connection proxy |
> | Microsoft.Kusto/Clusters/PrivateEndpointConnectionProxies/write | Writes a private endpoint connection proxy |
> | Microsoft.Kusto/Clusters/PrivateEndpointConnectionProxies/delete | Deletes a private endpoint connection proxy |
> | Microsoft.Kusto/Clusters/PrivateEndpointConnections/read | Reads a private endpoint connection |
> | Microsoft.Kusto/Clusters/PrivateEndpointConnections/write | Writes a private endpoint connection |
> | Microsoft.Kusto/Clusters/PrivateEndpointConnections/delete | Deletes a private endpoint connection |
> | Microsoft.Kusto/Clusters/PrivateLinkResources/read | Reads private link resources |
> | Microsoft.Kusto/Clusters/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic settings for the resource |
> | Microsoft.Kusto/Clusters/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Kusto/Clusters/providers/Microsoft.Insights/logDefinitions/read | Gets the diagnostic logs settings for the resource |
> | Microsoft.Kusto/Clusters/providers/Microsoft.Insights/metricDefinitions/read | Gets the metric definitions of the resource |
> | Microsoft.Kusto/Clusters/SKUs/read | Reads a cluster SKU resource. |
> | Microsoft.Kusto/Clusters/SKUs/PrivateEndpointConnectionProxyValidation/action | Validates a private endpoint connection proxy |
> | Microsoft.Kusto/Locations/CheckNameAvailability/action | Checks resource name availability. |
> | Microsoft.Kusto/Locations/Skus/action |  |
> | Microsoft.Kusto/locations/operationresults/read | Reads operations resources |
> | Microsoft.Kusto/Operations/read | Reads operations resources |
> | Microsoft.Kusto/SKUs/read | Reads a SKU resource. |

### Microsoft.PowerBIDedicated

Azure service: [Power BI Embedded](/azure/power-bi-embedded/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.PowerBIDedicated/register/action | Registers Power BI Dedicated resource provider. |
> | Microsoft.PowerBIDedicated/register/action | Registers Power BI Dedicated resource provider. |
> | Microsoft.PowerBIDedicated/autoScaleVCores/read | Retrieves the information of the specificed Power BI Auto Scale V-Core. |
> | Microsoft.PowerBIDedicated/autoScaleVCores/write | Creates or updates the specified Power BI Auto Scale V-Core. |
> | Microsoft.PowerBIDedicated/autoScaleVCores/delete | Deletes the Power BI Auto Scale V-Core. |
> | Microsoft.PowerBIDedicated/capacities/read | Retrieves the information of the specified Power BI capacity. |
> | Microsoft.PowerBIDedicated/capacities/write | Creates or updates the specified Power BI capacity. |
> | Microsoft.PowerBIDedicated/capacities/delete | Deletes the Power BI capacity. |
> | Microsoft.PowerBIDedicated/capacities/suspend/action | Suspends the Capacity. |
> | Microsoft.PowerBIDedicated/capacities/resume/action | Resumes the Capacity. |
> | Microsoft.PowerBIDedicated/capacities/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.PowerBIDedicated/capacities/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.PowerBIDedicated/capacities/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Power BI Dedicated Capacities |
> | Microsoft.PowerBIDedicated/capacities/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Power BI capacity. |
> | Microsoft.PowerBIDedicated/capacities/skus/read | Retrieve available SKU information for the capacity |
> | Microsoft.PowerBIDedicated/locations/checkNameAvailability/action | Checks that given Power BI Dedicated resource name is valid and not in use. |
> | Microsoft.PowerBIDedicated/locations/checkNameAvailability/action | Checks that given Power BI Dedicated resource name is valid and not in use. |
> | Microsoft.PowerBIDedicated/locations/operationresults/read | Retrieves the information of the specified operation result. |
> | Microsoft.PowerBIDedicated/locations/operationresults/read | Retrieves the information of the specified operation result. |
> | Microsoft.PowerBIDedicated/locations/operationstatuses/read | Retrieves the information of the specified operation status. |
> | Microsoft.PowerBIDedicated/locations/operationstatuses/read | Retrieves the information of the specified operation status. |
> | Microsoft.PowerBIDedicated/operations/read | Retrieves the information of operations |
> | Microsoft.PowerBIDedicated/operations/read | Retrieves the information of operations |
> | Microsoft.PowerBIDedicated/servers/read | Retrieves the information of the specified Power BI Dedicated Server. |
> | Microsoft.PowerBIDedicated/servers/write | Creates or updates the specified Power BI Dedicated Server |
> | Microsoft.PowerBIDedicated/servers/delete | Deletes the Power BI Dedicated Server |
> | Microsoft.PowerBIDedicated/servers/suspend/action | Suspends the Server. |
> | Microsoft.PowerBIDedicated/servers/resume/action | Resumes the Server. |
> | Microsoft.PowerBIDedicated/servers/skus/read | Retrieve available SKU information for the Server. |
> | Microsoft.PowerBIDedicated/skus/read | Retrieves the information of Skus |
> | Microsoft.PowerBIDedicated/skus/read | Retrieves the information of Skus |

### Microsoft.StreamAnalytics

Azure service: [Stream Analytics](../../../stream-analytics/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.StreamAnalytics/Register/action | Register subscription with Stream Analytics Resource Provider |
> | Microsoft.StreamAnalytics/clusters/Delete | Delete Stream Analytics Cluster |
> | Microsoft.StreamAnalytics/clusters/ListStreamingJobs/action | List streaming jobs for Stream Analytics Cluster |
> | Microsoft.StreamAnalytics/clusters/Read | Read Stream Analytics Cluster |
> | Microsoft.StreamAnalytics/clusters/Write | Write Stream Analytics Cluster |
> | Microsoft.StreamAnalytics/clusters/operationresults/Read | Read operation results for Stream Analytics Cluster |
> | Microsoft.StreamAnalytics/clusters/privateEndpoints/Delete | Delete Stream Analytics Cluster Private Endpoint |
> | Microsoft.StreamAnalytics/clusters/privateEndpoints/Read | Read Stream Analytics Cluster Private Endpoint |
> | Microsoft.StreamAnalytics/clusters/privateEndpoints/Write | Write Stream Analytics Cluster Private Endpoint |
> | Microsoft.StreamAnalytics/clusters/privateEndpoints/operationresults/Read | Read operation results for Stream Analytics Cluster Private Endpoint |
> | Microsoft.StreamAnalytics/locations/CompileQuery/action | Compile Query for Stream Analytics Resource Provider |
> | Microsoft.StreamAnalytics/locations/SampleInput/action | Sample Input for Stream Analytics Resource Provider |
> | Microsoft.StreamAnalytics/locations/TestInput/action | Test Input for Stream Analytics Resource Provider |
> | Microsoft.StreamAnalytics/locations/TestOutput/action | Test Output for Stream Analytics Resource Provider |
> | Microsoft.StreamAnalytics/locations/TestQuery/action | Test Query for Stream Analytics Resource Provider |
> | Microsoft.StreamAnalytics/locations/operationresults/Read | Read Stream Analytics Operation Result |
> | Microsoft.StreamAnalytics/locations/quotas/Read | Read Stream Analytics Subscription Quota |
> | Microsoft.StreamAnalytics/operations/Read | Read Stream Analytics Operations |
> | Microsoft.StreamAnalytics/streamingjobs/CompileQuery/action | Compile Query for Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/Delete | Delete Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/PublishEdgePackage/action | Publish edge package for Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/Read | Read Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/Scale/action | Scale Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/Start/action | Start Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/Stop/action | Stop Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/TestQuery/action | Test Query for Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/Write | Write Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/functions/Delete | Delete Stream Analytics Job Function |
> | Microsoft.StreamAnalytics/streamingjobs/functions/Read | Read Stream Analytics Job Function |
> | Microsoft.StreamAnalytics/streamingjobs/functions/RetrieveDefaultDefinition/action | Retrieve Default Definition of a Stream Analytics Job Function |
> | Microsoft.StreamAnalytics/streamingjobs/functions/Test/action | Test Stream Analytics Job Function |
> | Microsoft.StreamAnalytics/streamingjobs/functions/Write | Write Stream Analytics Job Function |
> | Microsoft.StreamAnalytics/streamingjobs/functions/operationresults/Read | Read operation results for Stream Analytics Job Function |
> | Microsoft.StreamAnalytics/streamingjobs/inputs/Delete | Delete Stream Analytics Job Input |
> | Microsoft.StreamAnalytics/streamingjobs/inputs/Read | Read Stream Analytics Job Input |
> | Microsoft.StreamAnalytics/streamingjobs/inputs/Sample/action | Sample Stream Analytics Job Input |
> | Microsoft.StreamAnalytics/streamingjobs/inputs/Test/action | Test Stream Analytics Job Input |
> | Microsoft.StreamAnalytics/streamingjobs/inputs/Write | Write Stream Analytics Job Input |
> | Microsoft.StreamAnalytics/streamingjobs/inputs/operationresults/Read | Read operation results for Stream Analytics Job Input |
> | Microsoft.StreamAnalytics/streamingjobs/metricdefinitions/Read | Read Metric Definitions |
> | Microsoft.StreamAnalytics/streamingjobs/operationresults/Read | Read operation results for Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/outputs/Delete | Delete Stream Analytics Job Output |
> | Microsoft.StreamAnalytics/streamingjobs/outputs/Read | Read Stream Analytics Job Output |
> | Microsoft.StreamAnalytics/streamingjobs/outputs/Test/action | Test Stream Analytics Job Output |
> | Microsoft.StreamAnalytics/streamingjobs/outputs/Write | Write Stream Analytics Job Output |
> | Microsoft.StreamAnalytics/streamingjobs/outputs/operationresults/Read | Read operation results for Stream Analytics Job Output |
> | Microsoft.StreamAnalytics/streamingjobs/providers/Microsoft.Insights/diagnosticSettings/read | Read diagnostic setting. |
> | Microsoft.StreamAnalytics/streamingjobs/providers/Microsoft.Insights/diagnosticSettings/write | Write diagnostic setting. |
> | Microsoft.StreamAnalytics/streamingjobs/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for streamingjobs |
> | Microsoft.StreamAnalytics/streamingjobs/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for streamingjobs |
> | Microsoft.StreamAnalytics/streamingjobs/transformations/Delete | Delete Stream Analytics Job Transformation |
> | Microsoft.StreamAnalytics/streamingjobs/transformations/Read | Read Stream Analytics Job Transformation |
> | Microsoft.StreamAnalytics/streamingjobs/transformations/Write | Write Stream Analytics Job Transformation |

### Microsoft.Synapse

Azure service: [Azure Synapse Analytics](../../../synapse-analytics/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Synapse/checkNameAvailability/action | Checks Workspace name availability. |
> | Microsoft.Synapse/register/action | Registers the Azure Synapse Analytics (workspaces) Resource Provider and enables the creation of Workspaces. |
> | Microsoft.Synapse/unregister/action | Unregisters the Azure Synapse Analytics (workspaces) Resource Provider and disables the creation of Workspaces. |
> | Microsoft.Synapse/Locations/KustoPoolCheckNameAvailability/action | Checks resource name availability. |
> | Microsoft.Synapse/locations/kustoPoolOperationResults/read | Reads operations resources |
> | Microsoft.Synapse/locations/operationResults/read | Read any Async Operation Result. |
> | Microsoft.Synapse/locations/operationStatuses/read | Read any Async Operation Status. |
> | Microsoft.Synapse/operations/read | Read Available Operations from the Azure Synapse Analytics Resource Provider. |
> | Microsoft.Synapse/privateEndpoints/notify/action | Notify Private Endpoint movement |
> | Microsoft.Synapse/privateLinkHubs/write | Create any PrivateLinkHubs. |
> | Microsoft.Synapse/privateLinkHubs/read | Read any PrivateLinkHubs. |
> | Microsoft.Synapse/privateLinkHubs/delete | Delete PrivateLinkHubs. |
> | Microsoft.Synapse/privateLinkHubs/privateEndpointConnectionsApproval/action | Determines if user is allowed to auto approve a private endpoint connection to a privateLinkHub |
> | Microsoft.Synapse/privateLinkHubs/privateEndpointConnectionProxies/validate/action | Validates Private Endpoint Connection for PrivateLinkHub Proxy |
> | Microsoft.Synapse/privateLinkHubs/privateEndpointConnectionProxies/write | Create or Update Private Endpoint Connection for PrivateLinkHub Proxy |
> | Microsoft.Synapse/privateLinkHubs/privateEndpointConnectionProxies/read | Read any Private Endpoint Connection Proxy |
> | Microsoft.Synapse/privateLinkHubs/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection for PrivateLinkHub Proxy |
> | Microsoft.Synapse/privateLinkHubs/privateEndpointConnectionProxies/updatePrivateEndpointProperties/action | Updates the Private Endpoint Connection Proxy properties for Private Link Hub |
> | Microsoft.Synapse/privateLinkHubs/privateEndpointConnections/write | Create or Update Private Endpoint Connection for PrivateLinkHub |
> | Microsoft.Synapse/privateLinkHubs/privateEndpointConnections/read | Read any Private Endpoint Connection for PrivateLinkHub |
> | Microsoft.Synapse/privateLinkHubs/privateEndpointConnections/delete | Delete Private Endpoint Connection for PrivateLinkHub |
> | Microsoft.Synapse/privateLinkHubs/privateLinkResources/read | Get a list of Private Link Resources |
> | Microsoft.Synapse/resourceGroups/operationStatuses/read | Read any Async Operation Status. |
> | Microsoft.Synapse/SKUs/read | Reads a SKU resource. |
> | Microsoft.Synapse/userAssignedIdentities/notify/action | Notify user assigned identity deletion |
> | Microsoft.Synapse/workspaces/replaceAllIpFirewallRules/action | Replaces all Ip Firewall Rules for the Workspace. |
> | Microsoft.Synapse/workspaces/write | Create or Update any Workspaces. |
> | Microsoft.Synapse/workspaces/read | Read any Workspaces. |
> | Microsoft.Synapse/workspaces/delete | Delete any Workspaces. |
> | Microsoft.Synapse/workspaces/checkDefaultStorageAccountStatus/action | Checks Default Storage Account Status. |
> | Microsoft.Synapse/workspaces/privateEndpointConnectionsApproval/action | Determines if user is allowed to auto approve a private endpoint connection to a workspace |
> | Microsoft.Synapse/workspaces/administrators/write | Set Active Directory Administrator on the Workspace |
> | Microsoft.Synapse/workspaces/administrators/read | Get Workspace Active Directory Administrator |
> | Microsoft.Synapse/workspaces/administrators/delete | Delete Workspace Active Directory Administrator |
> | Microsoft.Synapse/workspaces/auditingSettings/write | Create or Update SQL server auditing settings. |
> | Microsoft.Synapse/workspaces/auditingSettings/read | Read default SQL server auditing settings. |
> | Microsoft.Synapse/workspaces/azureADOnlyAuthentications/write | Create Or Update Azure AD only authentication for workspace and its sub resources. |
> | Microsoft.Synapse/workspaces/azureADOnlyAuthentications/read | Status of Azure AD only authentication for workspace and its sub resources. |
> | Microsoft.Synapse/workspaces/bigDataPools/write | Create or Update any Spark pools. |
> | Microsoft.Synapse/workspaces/bigDataPools/read | Read any Spark pools. |
> | Microsoft.Synapse/workspaces/bigDataPools/delete | Delete any Spark pools. |
> | Microsoft.Synapse/workspaces/bigDataPools/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic settings for a Big Data Pool |
> | Microsoft.Synapse/workspaces/bigDataPools/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic settings for a Big Data Pool |
> | Microsoft.Synapse/workspaces/bigDataPools/providers/Microsoft.Insights/logdefinitions/read | Gets the log definitions for a Big Data Pool |
> | Microsoft.Synapse/workspaces/bigDataPools/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Big Data Pools |
> | Microsoft.Synapse/workspaces/dedicatedSQLminimalTlsSettings/write | Updates workspace SQL server TLS Version setting |
> | Microsoft.Synapse/workspaces/dedicatedSQLminimalTlsSettings/read | Reads workspace SQL server TLS Version setting |
> | Microsoft.Synapse/workspaces/extendedAuditingSettings/write | Create or Update SQL server extended auditing settings. |
> | Microsoft.Synapse/workspaces/extendedAuditingSettings/read | Read default SQL server extended auditing settings. |
> | Microsoft.Synapse/workspaces/firewallRules/write | Create or update any IP Firewall Rule. |
> | Microsoft.Synapse/workspaces/firewallRules/read | Read IP Firewall Rule |
> | Microsoft.Synapse/workspaces/firewallRules/delete | Delete any IP Firewall Rule. |
> | Microsoft.Synapse/workspaces/integrationRuntimes/read | Get any Integration Runtime. |
> | Microsoft.Synapse/workspaces/integrationruntimes/write | Create or Update any Integration Runtimes. |
> | Microsoft.Synapse/workspaces/integrationRuntimes/delete | Delete any Integration Runtime |
> | Microsoft.Synapse/workspaces/integrationRuntimes/getStatus/action | Get any Integration Runtime's Status |
> | Microsoft.Synapse/workspaces/integrationRuntimes/createExpressSHIRInstallLink/action | Create an Integration Runtime Install Link |
> | Microsoft.Synapse/workspaces/integrationRuntimes/start/action | Start any Integration Runtime |
> | Microsoft.Synapse/workspaces/integrationRuntimes/stop/action | Stop any Integration Runtime |
> | Microsoft.Synapse/workspaces/integrationRuntimes/getConnectionInfo/action | Get Connection Info of any Integration Runtime |
> | Microsoft.Synapse/workspaces/integrationRuntimes/regenerateAuthKey/action | Regenerate auth key of any Integration Runtime |
> | Microsoft.Synapse/workspaces/integrationRuntimes/listAuthKeys/action | List Auth Keys of any Integration Runtime |
> | Microsoft.Synapse/workspaces/integrationRuntimes/removeNode/action | Remove any Integration Runtime node |
> | Microsoft.Synapse/workspaces/integrationRuntimes/monitoringData/action | Get any Integration Runtime's monitoring data |
> | Microsoft.Synapse/workspaces/integrationRuntimes/syncCredentials/action | Sync credential on any Integration Runtime |
> | Microsoft.Synapse/workspaces/integrationRuntimes/upgrade/action | Upgrade any Integration Runtime |
> | Microsoft.Synapse/workspaces/integrationRuntimes/removeLinks/action | Remove any Integration Runtime link |
> | Microsoft.Synapse/workspaces/integrationRuntimes/enableInteractiveQuery/action | Enable Interactive query on any Integration Runtime |
> | Microsoft.Synapse/workspaces/integrationRuntimes/disableInteractiveQuery/action | Disable Interactive query on any Integration Runtime |
> | Microsoft.Synapse/workspaces/integrationRuntimes/refreshObjectMetadata/action | Refresh Object metadata on any Intergration Runtime |
> | Microsoft.Synapse/workspaces/integrationRuntimes/getObjectMetadata/action | Get Object metadata on any Intergration Runtime |
> | Microsoft.Synapse/workspaces/integrationRuntimes/nodes/read | Get any Integration Runtime Node. |
> | Microsoft.Synapse/workspaces/integrationRuntimes/nodes/delete | Delete any Integration Runtime Node. |
> | Microsoft.Synapse/workspaces/integrationRuntimes/nodes/write | Patch any Integration Runtime Node. |
> | Microsoft.Synapse/workspaces/integrationRuntimes/nodes/ipAddress/action | Get Integration Runtime Ip Address |
> | Microsoft.Synapse/workspaces/keys/write | Create or Update Workspace Keys |
> | Microsoft.Synapse/workspaces/keys/read | Read any Workspace Key Definition. |
> | Microsoft.Synapse/workspaces/keys/delete | Delete any Workspace Key. |
> | Microsoft.Synapse/workspaces/kustoPools/read | Reads a cluster resource. |
> | Microsoft.Synapse/workspaces/kustoPools/write | Writes a cluster resource. |
> | Microsoft.Synapse/workspaces/kustoPools/delete | Deletes a cluster resource. |
> | Microsoft.Synapse/workspaces/kustoPools/Start/action | Starts the cluster. |
> | Microsoft.Synapse/workspaces/kustoPools/Stop/action | Stops the cluster. |
> | Microsoft.Synapse/workspaces/kustoPools/CheckNameAvailability/action | Checks the cluster name availability. |
> | Microsoft.Synapse/workspaces/kustoPools/ListLanguageExtensions/action | Lists language extensions. |
> | Microsoft.Synapse/workspaces/kustoPools/AddLanguageExtensions/action | Add language extensions. |
> | Microsoft.Synapse/workspaces/kustoPools/RemoveLanguageExtensions/action | Remove language extensions. |
> | Microsoft.Synapse/workspaces/kustoPools/DetachFollowerDatabases/action | Detaches follower's databases. |
> | Microsoft.Synapse/workspaces/kustoPools/ListFollowerDatabases/action | Lists the follower's databases. |
> | Microsoft.Synapse/workspaces/kustoPools/AttachedDatabaseConfigurations/read | Reads an attached database configuration resource. |
> | Microsoft.Synapse/workspaces/kustoPools/AttachedDatabaseConfigurations/write | Writes an attached database configuration resource. |
> | Microsoft.Synapse/workspaces/kustoPools/AttachedDatabaseConfigurations/delete | Deletes an attached database configuration resource. |
> | Microsoft.Synapse/workspaces/kustoPools/Databases/read | Reads a database resource. |
> | Microsoft.Synapse/workspaces/kustoPools/Databases/write | Writes a database resource. |
> | Microsoft.Synapse/workspaces/kustoPools/Databases/delete | Deletes a database resource. |
> | Microsoft.Synapse/workspaces/kustoPools/Databases/DataConnectionValidation/action | Validates database data connection. |
> | Microsoft.Synapse/workspaces/kustoPools/Databases/CheckNameAvailability/action | Checks name availability for a given type. |
> | Microsoft.Synapse/workspaces/kustoPools/Databases/DataConnections/read | Reads a data connections resource. |
> | Microsoft.Synapse/workspaces/kustoPools/Databases/DataConnections/write | Writes a data connections resource. |
> | Microsoft.Synapse/workspaces/kustoPools/Databases/DataConnections/delete | Deletes a data connections resource. |
> | Microsoft.Synapse/workspaces/kustoPools/Databases/PrincipalAssignments/read | Reads a database principal assignments resource. |
> | Microsoft.Synapse/workspaces/kustoPools/Databases/PrincipalAssignments/write | Writes a database principal assignments resource. |
> | Microsoft.Synapse/workspaces/kustoPools/Databases/PrincipalAssignments/delete | Deletes a database principal assignments resource. |
> | Microsoft.Synapse/workspaces/kustoPools/PrincipalAssignments/read | Reads a Cluster principal assignments resource. |
> | Microsoft.Synapse/workspaces/kustoPools/PrincipalAssignments/write | Writes a Cluster principal assignments resource. |
> | Microsoft.Synapse/workspaces/kustoPools/PrincipalAssignments/delete | Deletes a Cluster principal assignments resource. |
> | Microsoft.Synapse/workspaces/kustoPools/PrivateEndpointConnectionProxies/read | Reads a private endpoint connection proxy |
> | Microsoft.Synapse/workspaces/kustoPools/PrivateEndpointConnectionProxies/write | Writes a private endpoint connection proxy |
> | Microsoft.Synapse/workspaces/kustoPools/PrivateEndpointConnectionProxies/delete | Deletes a private endpoint connection proxy |
> | Microsoft.Synapse/workspaces/kustoPools/PrivateEndpointConnectionProxies/Validate/action | Validates a private endpoint connection proxy |
> | Microsoft.Synapse/workspaces/kustoPools/PrivateEndpointConnections/read | Reads a private endpoint connection |
> | Microsoft.Synapse/workspaces/kustoPools/PrivateEndpointConnections/write | Writes a private endpoint connection |
> | Microsoft.Synapse/workspaces/kustoPools/PrivateEndpointConnections/delete | Deletes a private endpoint connection |
> | Microsoft.Synapse/workspaces/kustoPools/PrivateLinkResources/read | Reads private link resources |
> | Microsoft.Synapse/workspaces/kustoPools/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic settings for the resource |
> | Microsoft.Synapse/workspaces/kustoPools/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Synapse/workspaces/kustoPools/providers/Microsoft.Insights/logDefinitions/read | Gets the diagnostic logs settings for the resource |
> | Microsoft.Synapse/workspaces/kustoPools/providers/Microsoft.Insights/metricDefinitions/read | Gets the metric definitions of the resource |
> | Microsoft.Synapse/workspaces/kustoPools/SKUs/read | Reads a cluster SKU resource. |
> | Microsoft.Synapse/workspaces/libraries/read | Read Library Artifacts |
> | Microsoft.Synapse/workspaces/managedIdentitySqlControlSettings/write | Update Managed Identity SQL Control Settings on the workspace |
> | Microsoft.Synapse/workspaces/managedIdentitySqlControlSettings/read | Get Managed Identity SQL Control Settings |
> | Microsoft.Synapse/workspaces/operationResults/read | Read any Async Operation Result. |
> | Microsoft.Synapse/workspaces/operationStatuses/read | Read any Async Operation Status. |
> | Microsoft.Synapse/workspaces/privateEndpointConnectionProxies/validate/action | Validates Private Endpoint Connection Proxy |
> | Microsoft.Synapse/workspaces/privateEndpointConnectionProxies/write | Create or Update Private Endpoint Connection Proxy |
> | Microsoft.Synapse/workspaces/privateEndpointConnectionProxies/read | Read any Private Endpoint Connection Proxy |
> | Microsoft.Synapse/workspaces/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxy |
> | Microsoft.Synapse/workspaces/privateEndpointConnectionProxies/updatePrivateEndpointProperties/action | Updates the Private Endpoint Connection Proxy properties. |
> | Microsoft.Synapse/workspaces/privateEndpointConnections/write | Create or Update Private Endpoint Connection |
> | Microsoft.Synapse/workspaces/privateEndpointConnections/read | Read any Private Endpoint Connection |
> | Microsoft.Synapse/workspaces/privateEndpointConnections/delete | Delete Private Endpoint Connection |
> | Microsoft.Synapse/workspaces/privateLinkResources/read | Get a list of Private Link Resources |
> | Microsoft.Synapse/workspaces/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic settings for a Workspace |
> | Microsoft.Synapse/workspaces/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic settings for a Workspace |
> | Microsoft.Synapse/workspaces/providers/Microsoft.Insights/logDefinitions/read | Gets the log definitions for Synapse Workspaces |
> | Microsoft.Synapse/workspaces/providers/Microsoft.Insights/metricDefinitions/read | Gets the metric definitions for Workspaces |
> | Microsoft.Synapse/workspaces/recoverableSqlpools/read | Gets recoverable SQL Analytics Pools, which are the resources representing geo backups of SQL Analytics Pools |
> | Microsoft.Synapse/workspaces/restorableDroppedSqlPools/read | Gets a deleted Sql pool that can be restored |
> | Microsoft.Synapse/workspaces/scopePools/write | Create or Update any Scope pools. |
> | Microsoft.Synapse/workspaces/scopePools/read | Read any Scope pools. |
> | Microsoft.Synapse/workspaces/scopePools/delete | Delete any Scope pools. |
> | Microsoft.Synapse/workspaces/securityAlertPolicies/write | Create or Update SQL server security alert policies. |
> | Microsoft.Synapse/workspaces/securityAlertPolicies/read | Read default SQL server security alert policies. |
> | Microsoft.Synapse/workspaces/sparkConfigurations/read | Read SparkConfiguration Artifacts |
> | Microsoft.Synapse/workspaces/sqlAdministrators/write | Set Active Directory Administrator on the Workspace |
> | Microsoft.Synapse/workspaces/sqlAdministrators/read | Get Workspace Active Directory Administrator |
> | Microsoft.Synapse/workspaces/sqlAdministrators/delete | Delete Workspace Active Directory Administrator |
> | Microsoft.Synapse/workspaces/sqlDatabases/write | Create or Update any SQL Analytics Databases. |
> | Microsoft.Synapse/workspaces/sqlDatabases/read | Read any SQL Analytics Databases. |
> | Microsoft.Synapse/workspaces/sqlPools/write | Create or Update any SQL Analytics pools. |
> | Microsoft.Synapse/workspaces/sqlPools/read | Read any SQL Analytics pools. |
> | Microsoft.Synapse/workspaces/sqlPools/delete | Delete any SQL Analytics pools. |
> | Microsoft.Synapse/workspaces/sqlPools/pause/action | Pause any SQL Analytics pools. |
> | Microsoft.Synapse/workspaces/sqlPools/resume/action | Resume any SQL Analytics pools. |
> | Microsoft.Synapse/workspaces/sqlPools/restorePoints/action | Create a SQL Analytics pool Restore Point. |
> | Microsoft.Synapse/workspaces/sqlPools/move/action | Rename any SQL Analytics pools. |
> | Microsoft.Synapse/workspaces/sqlPools/auditingSettings/read | Read any SQL Analytics pool Auditing Settings. |
> | Microsoft.Synapse/workspaces/sqlPools/auditingSettings/write | Create or Update any SQL Analytics pool Auditing Settings. |
> | Microsoft.Synapse/workspaces/sqlPools/auditRecords/read | Get Sql pool blob audit records |
> | Microsoft.Synapse/workspaces/sqlPools/columns/read | Return a list of columns for a SQL Analytics pool |
> | Microsoft.Synapse/workspaces/sqlPools/connectionPolicies/read | Read any SQL Analytics pool Connection Policies. |
> | Microsoft.Synapse/workspaces/sqlPools/currentSensitivityLabels/read | Read any SQL Analytics pool Current Sensitivity Labels. |
> | Microsoft.Synapse/workspaces/sqlPools/currentSensitivityLabels/write | Batch update current sensitivity labels |
> | Microsoft.Synapse/workspaces/sqlPools/dataMaskingPolicies/read | Return the list of SQL Analytics pool data masking policies. |
> | Microsoft.Synapse/workspaces/sqlPools/dataMaskingPolicies/write | Creates or updates a SQL Analytics pool data masking policy |
> | Microsoft.Synapse/workspaces/sqlPools/dataMaskingPolicies/rules/read | Gets a list of SQL Analytics pool data masking rules. |
> | Microsoft.Synapse/workspaces/sqlPools/dataMaskingPolicies/rules/write | Creates or updates a SQL Analytics pool data masking rule. |
> | Microsoft.Synapse/workspaces/sqlPools/dataWarehouseQueries/read | Read any SQL Analytics pool Queries. |
> | Microsoft.Synapse/workspaces/sqlPools/dataWarehouseQueries/dataWarehouseQuerySteps/read | Read any SQL Analytics pool Query Steps. |
> | Microsoft.Synapse/workspaces/sqlPools/dataWarehouseQueries/Steps/read | Read any SQL Analytics pool Query Steps. |
> | Microsoft.Synapse/workspaces/sqlPools/dataWarehouseUserActivities/read | Read any SQL Analytics pool User Activities. |
> | Microsoft.Synapse/workspaces/sqlPools/extendedAuditingSettings/read | Read any SQL Analytics pool Extended Auditing Settings. |
> | Microsoft.Synapse/workspaces/sqlPools/extendedAuditingSettings/write | Create or Update any SQL Analytics pool Extended Auditing Settings. |
> | Microsoft.Synapse/workspaces/sqlPools/extensions/read | Get SQL Analytics Pool extension |
> | Microsoft.Synapse/workspaces/sqlPools/extensions/write | Change the extension for a given SQL Analytics Pool |
> | Microsoft.Synapse/workspaces/sqlPools/geoBackupPolicies/read | Read any SQL Analytics pool Geo Backup Policies. |
> | Microsoft.Synapse/workspaces/sqlPools/maintenanceWindowOptions/read | Read any SQL Analytics pool Maintenance Window Options. |
> | Microsoft.Synapse/workspaces/sqlPools/maintenanceWindows/read | Read any SQL Analytics pool Maintenance Windows. |
> | Microsoft.Synapse/workspaces/sqlPools/maintenanceWindows/write | Read any SQL Analytics pool Maintenance Windows. |
> | Microsoft.Synapse/workspaces/sqlPools/metadataSync/write | Create or Update SQL Analytics pool Metadata Sync Config |
> | Microsoft.Synapse/workspaces/sqlPools/metadataSync/read | Read SQL Analytics pool Metadata Sync Config |
> | Microsoft.Synapse/workspaces/sqlPools/operationResults/read | Read any Async Operation Result. |
> | Microsoft.Synapse/workspaces/sqlPools/operations/read | Read any SQL Analytics pool Operations. |
> | Microsoft.Synapse/workspaces/sqlPools/operationStatuses/read | Read any Async Operation Result. |
> | Microsoft.Synapse/workspaces/sqlPools/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic settings for a SQL Pool |
> | Microsoft.Synapse/workspaces/sqlPools/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic settings for a SQL Pool |
> | Microsoft.Synapse/workspaces/sqlPools/providers/Microsoft.Insights/logdefinitions/read | Gets the log definitions for a SQL Pool |
> | Microsoft.Synapse/workspaces/sqlPools/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for SQL Pools |
> | Microsoft.Synapse/workspaces/sqlPools/recommendedSensitivityLabels/read | Read any SQL Analytics pool Recommended Sensitivity Labels. |
> | Microsoft.Synapse/workspaces/sqlPools/recommendedSensitivityLabels/write | Batch update recommended sensitivity labels |
> | Microsoft.Synapse/workspaces/sqlPools/replicationLinks/read | Read any SQL Analytics pool Replication Links. |
> | Microsoft.Synapse/workspaces/sqlPools/restorePoints/read | Read any SQL Analytics pool Restore Points. |
> | Microsoft.Synapse/workspaces/sqlPools/restorePoints/delete | Deletes a restore point. |
> | Microsoft.Synapse/workspaces/sqlPools/schemas/read | Read any SQL Analytics pool Schemas. |
> | Microsoft.Synapse/workspaces/sqlPools/schemas/tables/read | Read any SQL Analytics pool Schema Tables. |
> | Microsoft.Synapse/workspaces/sqlPools/schemas/tables/columns/read | Read any SQL Analytics pool Schema Table Columns. |
> | Microsoft.Synapse/workspaces/sqlPools/schemas/tables/columns/sensitivityLabels/read | Gets the sensitivity label of a given column. |
> | Microsoft.Synapse/workspaces/sqlPools/schemas/tables/columns/sensitivityLabels/enable/action | Enable any SQL Analytics pool Sensitivity Labels. |
> | Microsoft.Synapse/workspaces/sqlPools/schemas/tables/columns/sensitivityLabels/disable/action | Disable any SQL Analytics pool Sensitivity Labels. |
> | Microsoft.Synapse/workspaces/sqlPools/schemas/tables/columns/sensitivityLabels/write | Create or Update any SQL Analytics pool Sensitivity Labels. |
> | Microsoft.Synapse/workspaces/sqlPools/schemas/tables/columns/sensitivityLabels/delete | Delete any SQL Analytics pool Sensitivity Labels. |
> | Microsoft.Synapse/workspaces/sqlPools/securityAlertPolicies/read | Read any Sql Analytics pool Threat Detection Policies. |
> | Microsoft.Synapse/workspaces/sqlPools/securityAlertPolicies/write | Create or Update any SQL Analytics pool Threat Detection Policies. |
> | Microsoft.Synapse/workspaces/sqlPools/sensitivityLabels/read | Gets the sensitivity label of a given column. |
> | Microsoft.Synapse/workspaces/sqlPools/transparentDataEncryption/read | Read any SQL Analytics pool Transparent Data Encryption Configuration. |
> | Microsoft.Synapse/workspaces/sqlPools/transparentDataEncryption/write | Create or Update any SQL Analytics pool Transparent Data Encryption Configuration. |
> | Microsoft.Synapse/workspaces/sqlPools/transparentDataEncryption/operationResults/read | Read any SQL Analytics pool Transparent Data Encryption Configuration Operation Results. |
> | Microsoft.Synapse/workspaces/sqlPools/usages/read | Read any SQL Analytics pool Usages. |
> | Microsoft.Synapse/workspaces/sqlPools/vulnerabilityAssessments/read | Read any SQL Analytics pool Vulnerability Assessment. |
> | Microsoft.Synapse/workspaces/sqlPools/vulnerabilityAssessments/write | Creates or updates the Sql pool vulnerability assessment |
> | Microsoft.Synapse/workspaces/sqlPools/vulnerabilityAssessments/delete | Delete any SQL Analytics pool Vulnerability Assessment. |
> | Microsoft.Synapse/workspaces/sqlPools/vulnerabilityAssessments/rules/baselines/read | Get a SQL Analytics pool Vulnerability Assessment Rule Baseline. |
> | Microsoft.Synapse/workspaces/sqlPools/vulnerabilityAssessments/rules/baselines/write | Create or Update any SQL Analytics pool Vulnerability Assessment Rule Baseline. |
> | Microsoft.Synapse/workspaces/sqlPools/vulnerabilityAssessments/rules/baselines/delete | Delete any SQL Analytics pool Vulnerability Assessment Rule Baseline. |
> | Microsoft.Synapse/workspaces/sqlPools/vulnerabilityAssessments/scans/read | Read any SQL Analytics pool Vulnerability Assessment Scan Records. |
> | Microsoft.Synapse/workspaces/sqlPools/vulnerabilityAssessments/scans/initiateScan/action | Initiate any SQL Analytics pool Vulnerability Assessment Scan Records. |
> | Microsoft.Synapse/workspaces/sqlPools/vulnerabilityAssessments/scans/export/action | Export any SQL Analytics pool Vulnerability Assessment Scan Records. |
> | Microsoft.Synapse/workspaces/sqlPools/workloadGroups/read | Lists the workload groups for a selected SQL pool. |
> | Microsoft.Synapse/workspaces/sqlPools/workloadGroups/write | Sets the properties for a specific workload group. |
> | Microsoft.Synapse/workspaces/sqlPools/workloadGroups/delete | Drops a specific workload group. |
> | Microsoft.Synapse/workspaces/sqlPools/workloadGroups/operationStatuses/read | SQL Analytics Pool workload group operation status |
> | Microsoft.Synapse/workspaces/sqlPools/workloadGroups/workloadClassifiers/read | Lists the workload classifiers for a selected SQL Analytics Pool. |
> | Microsoft.Synapse/workspaces/sqlPools/workloadGroups/workloadClassifiers/write | Sets the properties for a specific workload classifier. |
> | Microsoft.Synapse/workspaces/sqlPools/workloadGroups/workloadClassifiers/delete | Drops a specific workload classifier. |
> | Microsoft.Synapse/workspaces/sqlPools/workloadGroups/workloadClassifiers/operationResults/read | SQL Analytics Pool workload classifier operation result |
> | Microsoft.Synapse/workspaces/sqlPools/workloadGroups/workloadClassifiers/operationStatuses/read | SQL Analytics Pool workload classifier operation status |
> | Microsoft.Synapse/workspaces/sqlUsages/read | Gets usage limits available for SQL Analytics Pools |
> | Microsoft.Synapse/workspaces/trustedServiceBypassConfiguration/write | Update Trusted Service Bypass configuration for workspace. |
> | Microsoft.Synapse/workspaces/vulnerabilityAssessments/write | Create or Update SQL server vulnerability assement report. |
> | Microsoft.Synapse/workspaces/vulnerabilityAssessments/read | Read default SQL server vulnerability assement report. |
> | Microsoft.Synapse/workspaces/vulnerabilityAssessments/delete | Delete SQL server vulnerability assement report. |
