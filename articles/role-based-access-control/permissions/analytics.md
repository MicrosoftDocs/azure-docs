---
title: Azure permissions for Analytics - Azure RBAC
description: Lists the permissions for the Azure resource providers in the Analytics category.
ms.service: role-based-access-control
ms.topic: reference
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure permissions for Analytics

This article lists the permissions for the Azure resource providers in the Analytics category. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. Permission strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`


## Microsoft.AnalysisServices

Enterprise-grade analytics engine as a service.

Azure service: [Azure Analysis Services](/azure/analysis-services/index)

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

## Microsoft.Databricks

Fast, easy, and collaborative Apache Spark-based analytics platform.

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
> | Microsoft.Databricks/workspaces/migratePrivateLinkWorkspaces/action | Applies new Network Intent Policy templates based on 'requiredNsgRules' and 'enablePublicAccess' |
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

## Microsoft.DataCatalog

Get more value from your enterprise data assets.

Azure service: [Data Catalog](/azure/data-catalog/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DataCatalog/checkNameAvailability/action | Checks catalog name availability for tenant. |
> | Microsoft.DataCatalog/register/action | Registers subscription with Microsoft.DataCatalog resource provider. |
> | Microsoft.DataCatalog/unregister/action | Unregisters subscription from Microsoft.DataCatalog resource provider. |
> | Microsoft.DataCatalog/catalogs/read | Get properties for catalog or catalogs under subscription or resource group. |
> | Microsoft.DataCatalog/catalogs/write | Creates catalog or updates the tags and properties for the catalog. |
> | Microsoft.DataCatalog/catalogs/delete | Deletes the catalog. |
> | Microsoft.DataCatalog/operations/read | Lists operations available on Microsoft.DataCatalog resource provider. |

## Microsoft.DataFactory

Hybrid data integration at enterprise scale, made easy.

Azure service: [Data Factory](/azure/data-factory/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DataFactory/register/action | Registers the subscription for the Data Factory Resource Provider. |
> | Microsoft.DataFactory/unregister/action | Unregisters the subscription for the Data Factory Resource Provider. |
> | Microsoft.DataFactory/checkazuredatafactorynameavailability/read | Checks if the Data Factory Name is available to use. |
> | Microsoft.DataFactory/datafactories/read | Reads the Data Factory. |
> | Microsoft.DataFactory/datafactories/write | Creates or Updates the Data Factory. |
> | Microsoft.DataFactory/datafactories/delete | Deletes the Data Factory. |
> | Microsoft.DataFactory/datafactories/activitywindows/read | Reads Activity Windows in the Data Factory with specified parameters. |
> | Microsoft.DataFactory/datafactories/datapipelines/read | Reads any Pipeline. |
> | Microsoft.DataFactory/datafactories/datapipelines/delete | Deletes any Pipeline. |
> | Microsoft.DataFactory/datafactories/datapipelines/pause/action | Pauses any Pipeline. |
> | Microsoft.DataFactory/datafactories/datapipelines/resume/action | Resumes any Pipeline. |
> | Microsoft.DataFactory/datafactories/datapipelines/update/action | Updates any Pipeline. |
> | Microsoft.DataFactory/datafactories/datapipelines/write | Creates or Updates any Pipeline. |
> | Microsoft.DataFactory/datafactories/datapipelines/activities/activitywindows/read | Reads Activity Windows for the Pipeline Activity with specified parameters. |
> | Microsoft.DataFactory/datafactories/datapipelines/activitywindows/read | Reads Activity Windows for the Pipeline with specified parameters. |
> | Microsoft.DataFactory/datafactories/datasets/read | Reads any Dataset. |
> | Microsoft.DataFactory/datafactories/datasets/delete | Deletes any Dataset. |
> | Microsoft.DataFactory/datafactories/datasets/write | Creates or Updates any Dataset. |
> | Microsoft.DataFactory/datafactories/datasets/activitywindows/read | Reads Activity Windows for the Dataset with specified parameters. |
> | Microsoft.DataFactory/datafactories/datasets/sliceruns/read | Reads the Data Slice Run for the given dataset with the given start time. |
> | Microsoft.DataFactory/datafactories/datasets/slices/read | Gets the Data Slices in the given period. |
> | Microsoft.DataFactory/datafactories/datasets/slices/write | Update the Status of the Data Slice. |
> | Microsoft.DataFactory/datafactories/gateways/read | Reads any Gateway. |
> | Microsoft.DataFactory/datafactories/gateways/write | Creates or Updates any Gateway. |
> | Microsoft.DataFactory/datafactories/gateways/delete | Deletes any Gateway. |
> | Microsoft.DataFactory/datafactories/gateways/connectioninfo/action | Reads the Connection Info for any Gateway. |
> | Microsoft.DataFactory/datafactories/gateways/listauthkeys/action | Lists the Authentication Keys for any Gateway. |
> | Microsoft.DataFactory/datafactories/gateways/regenerateauthkey/action | Regenerates the Authentication Keys for any Gateway. |
> | Microsoft.DataFactory/datafactories/linkedServices/read | Reads any Linked Service. |
> | Microsoft.DataFactory/datafactories/linkedServices/delete | Deletes any Linked Service. |
> | Microsoft.DataFactory/datafactories/linkedServices/write | Creates or Updates any Linked Service. |
> | Microsoft.DataFactory/datafactories/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.DataFactory/datafactories/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.DataFactory/datafactories/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for datafactories |
> | Microsoft.DataFactory/datafactories/runs/loginfo/read | Reads a SAS URI to a blob container containing the logs. |
> | Microsoft.DataFactory/datafactories/tables/read | Reads any Dataset. |
> | Microsoft.DataFactory/datafactories/tables/delete | Deletes any Dataset. |
> | Microsoft.DataFactory/datafactories/tables/write | Creates or Updates any Dataset. |
> | Microsoft.DataFactory/factories/read | Reads Data Factory. |
> | Microsoft.DataFactory/factories/write | Create or Update Data Factory |
> | Microsoft.DataFactory/factories/delete | Deletes Data Factory. |
> | Microsoft.DataFactory/factories/createdataflowdebugsession/action | Creates a Data Flow debug session. |
> | Microsoft.DataFactory/factories/startdataflowdebugsession/action | Starts a Data Flow debug session. |
> | Microsoft.DataFactory/factories/addDataFlowToDebugSession/action | Add Data Flow to debug session for preview. |
> | Microsoft.DataFactory/factories/executeDataFlowDebugCommand/action | Execute Data Flow debug command. |
> | Microsoft.DataFactory/factories/deletedataflowdebugsession/action | Deletes a Data Flow debug session. |
> | Microsoft.DataFactory/factories/querydataflowdebugsessions/action | Queries a Data Flow debug session. |
> | Microsoft.DataFactory/factories/cancelpipelinerun/action | Cancels the pipeline run specified by the run ID. |
> | Microsoft.DataFactory/factories/cancelSandboxPipelineRun/action | Cancels a debug run for the Pipeline. |
> | Microsoft.DataFactory/factories/sandboxpipelineruns/action | Queries the Debug Pipeline Runs. |
> | Microsoft.DataFactory/factories/querytriggers/action | Queries the Triggers. |
> | Microsoft.DataFactory/factories/getFeatureValue/action | Get exposure control feature value for the specific location. |
> | Microsoft.DataFactory/factories/queryFeaturesValue/action | Get exposure control feature values for a list of features |
> | Microsoft.DataFactory/factories/getDataPlaneAccess/action | Gets access to ADF DataPlane service. |
> | Microsoft.DataFactory/factories/getGitHubAccessToken/action | Gets GitHub access token. |
> | Microsoft.DataFactory/factories/querytriggerruns/action | Queries the Trigger Runs. |
> | Microsoft.DataFactory/factories/querypipelineruns/action | Queries the Pipeline Runs. |
> | Microsoft.DataFactory/factories/querydebugpipelineruns/action | Queries the Debug Pipeline Runs. |
> | Microsoft.DataFactory/factories/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connection. |
> | Microsoft.DataFactory/factories/adfcdcs/read | Reads ADF Change data capture. |
> | Microsoft.DataFactory/factories/adfcdcs/delete | Deletes ADF Change data capture. |
> | Microsoft.DataFactory/factories/adfcdcs/write | Create or update ADF Change data capture. |
> | Microsoft.DataFactory/factories/adflinkconnections/read | Reads ADF Link Connection. |
> | Microsoft.DataFactory/factories/adflinkconnections/delete | Deletes ADF Link Connection. |
> | Microsoft.DataFactory/factories/adflinkconnections/write | Create or update ADF Link Connection |
> | Microsoft.DataFactory/factories/credentials/read | Reads any Credential. |
> | Microsoft.DataFactory/factories/credentials/write | Writes any Credential. |
> | Microsoft.DataFactory/factories/credentials/delete | Deletes any Credential. |
> | Microsoft.DataFactory/factories/dataflows/read | Reads Data Flow. |
> | Microsoft.DataFactory/factories/dataflows/delete | Deletes Data Flow. |
> | Microsoft.DataFactory/factories/dataflows/write | Create or update Data Flow |
> | Microsoft.DataFactory/factories/dataMappers/read | Reads Data Mapping. |
> | Microsoft.DataFactory/factories/dataMappers/delete | Deletes Data Mapping. |
> | Microsoft.DataFactory/factories/dataMappers/write | Create or update Data Mapping |
> | Microsoft.DataFactory/factories/datasets/read | Reads any Dataset. |
> | Microsoft.DataFactory/factories/datasets/delete | Deletes any Dataset. |
> | Microsoft.DataFactory/factories/datasets/write | Creates or Updates any Dataset. |
> | Microsoft.DataFactory/factories/debugpipelineruns/cancel/action | Cancels a debug run for the Pipeline. |
> | Microsoft.DataFactory/factories/getDataPlaneAccess/read | Reads access to ADF DataPlane service. |
> | Microsoft.DataFactory/factories/getFeatureValue/read | Reads exposure control feature value for the specific location. |
> | Microsoft.DataFactory/factories/globalParameters/read | Reads GlobalParameter. |
> | Microsoft.DataFactory/factories/globalParameters/delete | Deletes GlobalParameter. |
> | Microsoft.DataFactory/factories/globalParameters/write | Create or Update GlobalParameter. |
> | Microsoft.DataFactory/factories/integrationruntimes/read | Reads any Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/write | Creates or Updates any Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/delete | Deletes any Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/start/action | Starts any Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/stop/action | Stops any Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/getconnectioninfo/action | Reads Integration Runtime Connection Info. |
> | Microsoft.DataFactory/factories/integrationruntimes/listauthkeys/action | Lists the Authentication Keys for any Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/synccredentials/action | Syncs the Credentials for the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/upgrade/action | Upgrades the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/createexpressshirinstalllink/action | Create express install link for self hosted Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/regenerateauthkey/action | Regenerates the Authentication Keys for the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/removelinks/action | Removes Linked Integration Runtime References from the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/linkedIntegrationRuntime/action | Create Linked Integration Runtime Reference on the Specified Shared Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/getObjectMetadata/action | Get SSIS Integration Runtime metadata for the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/refreshObjectMetadata/action | Refresh SSIS Integration Runtime metadata for the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/enableInteractiveQuery/action | Enable interactive authoring session. |
> | Microsoft.DataFactory/factories/integrationruntimes/disableInteractiveQuery/action | Disable interactive authoring session. |
> | Microsoft.DataFactory/factories/integrationruntimes/getstatus/read | Reads Integration Runtime Status. |
> | Microsoft.DataFactory/factories/integrationruntimes/monitoringdata/read | Gets the Monitoring Data for any Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/nodes/read | Reads the Node for the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/nodes/delete | Deletes the Node for the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/nodes/write | Updates a self-hosted Integration Runtime Node. |
> | Microsoft.DataFactory/factories/integrationruntimes/nodes/ipAddress/action | Returns the IP Address for the specified node of the Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/outboundNetworkDependenciesEndpoints/read | Get Azure-SSIS Integration Runtime outbound network dependency endpoints for the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/linkedServices/read | Reads Linked Service. |
> | Microsoft.DataFactory/factories/linkedServices/delete | Deletes Linked Service. |
> | Microsoft.DataFactory/factories/linkedServices/write | Create or Update Linked Service |
> | Microsoft.DataFactory/factories/managedVirtualNetworks/read | Read Managed Virtual Network. |
> | Microsoft.DataFactory/factories/managedVirtualNetworks/write | Create or Update Managed Virtual Network. |
> | Microsoft.DataFactory/factories/managedVirtualNetworks/managedPrivateEndpoints/read | Read Managed Private Endpoint. |
> | Microsoft.DataFactory/factories/managedVirtualNetworks/managedPrivateEndpoints/write | Create or Update Managed Private Endpoint. |
> | Microsoft.DataFactory/factories/managedVirtualNetworks/managedPrivateEndpoints/delete | Delete Managed Private Endpoint. |
> | Microsoft.DataFactory/factories/operationResults/read | Gets operation results. |
> | Microsoft.DataFactory/factories/pipelineruns/read | Reads the Pipeline Runs. |
> | Microsoft.DataFactory/factories/pipelineruns/cancel/action | Cancels the pipeline run specified by the run ID. |
> | Microsoft.DataFactory/factories/pipelineruns/queryactivityruns/action | Queries the activity runs for the specified pipeline run ID. |
> | Microsoft.DataFactory/factories/pipelineruns/activityruns/read | Reads the activity runs for the specified pipeline run ID. |
> | Microsoft.DataFactory/factories/pipelineruns/queryactivityruns/read | Reads the result of query activity runs for the specified pipeline run ID. |
> | Microsoft.DataFactory/factories/pipelines/read | Reads Pipeline. |
> | Microsoft.DataFactory/factories/pipelines/delete | Deletes Pipeline. |
> | Microsoft.DataFactory/factories/pipelines/write | Create or Update Pipeline |
> | Microsoft.DataFactory/factories/pipelines/createrun/action | Creates a run for the Pipeline. |
> | Microsoft.DataFactory/factories/pipelines/sandbox/action | Creates a debug run environment for the Pipeline. |
> | Microsoft.DataFactory/factories/pipelines/pipelineruns/read | Reads the Pipeline Run. |
> | Microsoft.DataFactory/factories/pipelines/pipelineruns/activityruns/progress/read | Gets the Progress of Activity Runs. |
> | Microsoft.DataFactory/factories/pipelines/sandbox/create/action | Creates a debug run environment for the Pipeline. |
> | Microsoft.DataFactory/factories/pipelines/sandbox/run/action | Creates a debug run for the Pipeline. |
> | Microsoft.DataFactory/factories/privateEndpointConnectionProxies/read | Read Private Endpoint Connection Proxy. |
> | Microsoft.DataFactory/factories/privateEndpointConnectionProxies/write | Create or Update private Endpoint Connection Proxy. |
> | Microsoft.DataFactory/factories/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxy. |
> | Microsoft.DataFactory/factories/privateEndpointConnectionProxies/validate/action | Validate a Private Endpoint Connection Proxy. |
> | Microsoft.DataFactory/factories/privateEndpointConnectionProxies/operationresults/read | Read the results of creating a Private Endpoint Connection Proxy. |
> | Microsoft.DataFactory/factories/privateEndpointConnectionProxies/operationstatuses/read | Read the status of creating a Private Endpoint Connection Proxy. |
> | Microsoft.DataFactory/factories/privateEndpointConnections/read | Read Private Endpoint Connection. |
> | Microsoft.DataFactory/factories/privateEndpointConnections/write | Create or Update Private Endpoint Connection. |
> | Microsoft.DataFactory/factories/privateEndpointConnections/delete | Delete Private Endpoint Connection. |
> | Microsoft.DataFactory/factories/privateLinkResources/read | Read Private Link Resource. |
> | Microsoft.DataFactory/factories/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.DataFactory/factories/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.DataFactory/factories/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for factories |
> | Microsoft.DataFactory/factories/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for factories |
> | Microsoft.DataFactory/factories/queryFeaturesValue/read | Reads exposure control feature values for a list of features. |
> | Microsoft.DataFactory/factories/querypipelineruns/read | Reads the Result of Query Pipeline Runs. |
> | Microsoft.DataFactory/factories/querytriggerruns/read | Reads the Result of Trigger Runs. |
> | Microsoft.DataFactory/factories/sandboxpipelineruns/read | Gets the debug run info for the Pipeline. |
> | Microsoft.DataFactory/factories/sandboxpipelineruns/sandboxActivityRuns/read | Gets the debug run info for the Activity. |
> | Microsoft.DataFactory/factories/sessions/write | Writes any Session. |
> | Microsoft.DataFactory/factories/triggerruns/read | Reads the Trigger Runs. |
> | Microsoft.DataFactory/factories/triggers/read | Reads any Trigger. |
> | Microsoft.DataFactory/factories/triggers/write | Creates or Updates any Trigger. |
> | Microsoft.DataFactory/factories/triggers/delete | Deletes any Trigger. |
> | Microsoft.DataFactory/factories/triggers/subscribetoevents/action | Subscribe to Events. |
> | Microsoft.DataFactory/factories/triggers/geteventsubscriptionstatus/action | Event Subscription Status. |
> | Microsoft.DataFactory/factories/triggers/unsubscribefromevents/action | Unsubscribe from Events. |
> | Microsoft.DataFactory/factories/triggers/querysubscriptionevents/action | Query subscription events. |
> | Microsoft.DataFactory/factories/triggers/deletequeuedsubscriptionevents/action | Delete queued subscription events. |
> | Microsoft.DataFactory/factories/triggers/start/action | Starts any Trigger. |
> | Microsoft.DataFactory/factories/triggers/stop/action | Stops any Trigger. |
> | Microsoft.DataFactory/factories/triggers/triggerruns/read | Reads the Trigger Runs. |
> | Microsoft.DataFactory/factories/triggers/triggerruns/cancel/action | Cancel the Trigger Run with the given trigger run id. |
> | Microsoft.DataFactory/factories/triggers/triggerruns/rerun/action | Rerun the Trigger Run with the given trigger run id. |
> | Microsoft.DataFactory/locations/configureFactoryRepo/action | Configures the repository for the factory. |
> | Microsoft.DataFactory/locations/getFeatureValue/action | Get exposure control feature value for the specific location. |
> | Microsoft.DataFactory/locations/getFeatureValue/read | Reads exposure control feature value for the specific location. |
> | Microsoft.DataFactory/operations/read | Reads all Operations in Microsoft Data Factory Provider. |
> | **DataAction** | **Description** |
> | Microsoft.DataFactory/factories/credentials/useSecrets/action | Uses any Credential Secret. |

## Microsoft.DataLakeAnalytics

Distributed analytics service that makes big data easy.

Azure service: [Data Lake Analytics](/azure/data-lake-analytics/)

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

## Microsoft.DataLakeStore

Highly scalable and cost-effective data lake solution for big data analytics.

Azure service: [Azure Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction)

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

## Microsoft.HDInsight

Provision cloud Hadoop, Spark, R Server, HBase, and Storm clusters.

Azure service: [HDInsight](/azure/hdinsight/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.HDInsight/register/action | Register HDInsight resource provider for the subscription |
> | Microsoft.HDInsight/unregister/action | Unregister HDInsight resource provider for the subscription |
> | Microsoft.HDInsight/clusterPools/read | Get details about HDInsight on AKS Cluster Pool |
> | Microsoft.HDInsight/clusterPools/write | Create or Update HDInsight on AKS Cluster Pool |
> | Microsoft.HDInsight/clusterPools/delete | Delete a HDInsight on AKS Cluster Pool |
> | Microsoft.HDInsight/clusterPools/upgrade/action | Upgrade HDInsight on AKS Cluster Pool |
> | Microsoft.HDInsight/clusterPools/availableupgrades/read | Get Avaliable Upgrades for HDInsight on AKS Cluster Pool |
> | Microsoft.HDInsight/clusterPools/clusters/read | Get details about HDInsight on AKS Cluster |
> | Microsoft.HDInsight/clusterPools/clusters/write | Create or Update HDInsight on AKS Cluster |
> | Microsoft.HDInsight/clusterPools/clusters/delete | Delete a HDInsight on AKS cluster |
> | Microsoft.HDInsight/clusterPools/clusters/resize/action | Resize a HDInsight on AKS Cluster |
> | Microsoft.HDInsight/clusterPools/clusters/runjob/action | Run HDInsight on AKS Cluster Job |
> | Microsoft.HDInsight/clusterPools/clusters/upgrade/action | Upgrade HDInsight on AKS Cluster |
> | Microsoft.HDInsight/clusterPools/clusters/availableupgrades/read | Get Avaliable Upgrades for HDInsight on AKS Cluster |
> | Microsoft.HDInsight/clusterPools/clusters/instanceviews/read | Get details about HDInsight on AKS Cluster Instance View |
> | Microsoft.HDInsight/clusterPools/clusters/jobs/read | List HDInsight on AKS Cluster Jobs |
> | Microsoft.HDInsight/clusterPools/clusters/serviceconfigs/read | Get details about HDInsight on AKS Cluster Service Configurations |
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

## Microsoft.Kusto

Service for storing and running interactive analytics over Big Data.

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
> | Microsoft.Kusto/Clusters/Migrate/action | Migrates the cluster data to another cluster. |
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
> | Microsoft.Kusto/Clusters/Databases/InviteFollower/action |  |
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
> | Microsoft.Kusto/Clusters/SandboxCustomImages/read | Reads a sandbox custom image |
> | Microsoft.Kusto/Clusters/SandboxCustomImages/write | Writes a sandbox custom image |
> | Microsoft.Kusto/Clusters/SandboxCustomImages/delete | Deletes a sandbox custom image |
> | Microsoft.Kusto/Clusters/SKUs/read | Reads a cluster SKU resource. |
> | Microsoft.Kusto/Clusters/SKUs/PrivateEndpointConnectionProxyValidation/action | Validates a private endpoint connection proxy |
> | Microsoft.Kusto/Locations/CheckNameAvailability/action | Checks resource name availability. |
> | Microsoft.Kusto/Locations/Skus/action |  |
> | Microsoft.Kusto/locations/operationresults/read | Reads operations resources |
> | Microsoft.Kusto/Operations/read | Reads operations resources |
> | Microsoft.Kusto/SKUs/read | Reads a SKU resource. |

## Microsoft.PowerBIDedicated

Manage Power BI Premium dedicated capacities for exclusive use by an organization.

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

## Microsoft.Purview

Azure service: [Microsoft Purview](/purview/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Purview/register/action | Register the subscription for Microsoft Purview provider. |
> | Microsoft.Purview/unregister/action | Unregister the subscription for Microsoft Purview provider. |
> | Microsoft.Purview/setDefaultAccount/action | Sets the default account for the scope. |
> | Microsoft.Purview/removeDefaultAccount/action | Removes the default account for the scope. |
> | Microsoft.Purview/accounts/read | Read account resource for Microsoft Purview provider. |
> | Microsoft.Purview/accounts/write | Write account resource for Microsoft Purview provider. |
> | Microsoft.Purview/accounts/delete | Delete account resource for Microsoft Purview provider. |
> | Microsoft.Purview/accounts/listkeys/action | List keys on the account resource for Microsoft Purview provider. |
> | Microsoft.Purview/accounts/addrootcollectionadmin/action | Add root collection admin to account resource for Microsoft Purview provider. |
> | Microsoft.Purview/accounts/move/action | Move account resource for Microsoft Purview provider. |
> | Microsoft.Purview/accounts/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connection. |
> | Microsoft.Purview/accounts/kafkaConfigurations/read | Read Kafka Configurations. |
> | Microsoft.Purview/accounts/kafkaConfigurations/write | Create or update Kafka Configurations. |
> | Microsoft.Purview/accounts/kafkaConfigurations/delete | Delete Kafka Configurations. |
> | Microsoft.Purview/accounts/privateEndpointConnectionProxies/read | Read Account Private Endpoint Connection Proxy. |
> | Microsoft.Purview/accounts/privateEndpointConnectionProxies/write | Write Account Private Endpoint Connection Proxy. |
> | Microsoft.Purview/accounts/privateEndpointConnectionProxies/delete | Delete Account Private Endpoint Connection Proxy. |
> | Microsoft.Purview/accounts/privateEndpointConnectionProxies/validate/action | Validate Account Private Endpoint Connection Proxy. |
> | Microsoft.Purview/accounts/privateEndpointConnectionProxies/operationResults/read | Monitor Private Endpoint Connection Proxy async operations. |
> | Microsoft.Purview/accounts/privateEndpointConnections/read | Read Private Endpoint Connection. |
> | Microsoft.Purview/accounts/privateEndpointConnections/write | Create or update Private Endpoint Connection. |
> | Microsoft.Purview/accounts/privateEndpointConnections/delete | Delete Private Endpoint Connection. |
> | Microsoft.Purview/accounts/privatelinkresources/read | Read Account Link Resources. |
> | Microsoft.Purview/accounts/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource. |
> | Microsoft.Purview/accounts/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource. |
> | Microsoft.Purview/accounts/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for the catalog. |
> | Microsoft.Purview/accounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for the catalog. |
> | Microsoft.Purview/checkConsent/read | Resolve the scope the Consent is granted. |
> | Microsoft.Purview/checknameavailability/read | Check if name of purview account resource is available for Microsoft Purview provider. |
> | Microsoft.Purview/consents/read | Read Consent Resource. |
> | Microsoft.Purview/consents/write | Create or Update a Consent Resource. |
> | Microsoft.Purview/consents/delete | Delete the Consent Resource. |
> | Microsoft.Purview/getDefaultAccount/read | Gets the default account for the scope. |
> | Microsoft.Purview/locations/operationResults/read | Monitor async operations. |
> | Microsoft.Purview/operations/read | Reads all available operations for Microsoft Purview provider. |
> | Microsoft.Purview/policies/read | Read Policy Resource. |
> | **DataAction** | **Description** |
> | Microsoft.Purview/accounts/data/read | Permission is deprecated. |
> | Microsoft.Purview/accounts/data/write | Permission is deprecated. |
> | Microsoft.Purview/accounts/scan/read | Permission is deprecated. |
> | Microsoft.Purview/accounts/scan/write | Permission is deprecated. |
> | Microsoft.Purview/attributeBlobs/read | Read Attribute Blob. |
> | Microsoft.Purview/attributeBlobs/write | Write Attribute Blob. |
> | Microsoft.Purview/policyElements/read | Read Policy Element. |
> | Microsoft.Purview/policyElements/write | Create or update Policy Element. |
> | Microsoft.Purview/policyElements/delete | Delete Policy Element. |
> | Microsoft.Purview/purviewAccountBindings/read | Read Account Binding. |
> | Microsoft.Purview/purviewAccountBindings/write | Create or update Account Binding. |
> | Microsoft.Purview/purviewAccountBindings/delete | Delete Account Binding. |

## Microsoft.Synapse

Azure service: [Azure Synapse Analytics](/azure/synapse-analytics/)

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
> | Microsoft.Synapse/locations/usages/read | Get all uasage and quota information |
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
> | Microsoft.Synapse/workspaces/kustoPools/Migrate/action | Migrates the cluster data to another cluster. |
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
> | Microsoft.Synapse/workspaces/kustoPools/Databases/InviteFollower/action |  |
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
> | Microsoft.Synapse/workspaces/usages/read | Get all uasage and quota information |
> | Microsoft.Synapse/workspaces/vulnerabilityAssessments/write | Create or Update SQL server vulnerability assement report. |
> | Microsoft.Synapse/workspaces/vulnerabilityAssessments/read | Read default SQL server vulnerability assement report. |
> | Microsoft.Synapse/workspaces/vulnerabilityAssessments/delete | Delete SQL server vulnerability assement report. |

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)