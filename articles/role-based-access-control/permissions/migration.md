---
title: Azure permissions for Migration - Azure RBAC
description: Lists the permissions for the Azure resource providers in the Migration category.
ms.service: role-based-access-control
ms.topic: reference
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure permissions for Migration

This article lists the permissions for the Azure resource providers in the Migration category. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. Permission strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`


## Microsoft.DataBox

Move stored or in-flight data to Azure quickly and cost-effectively.

Azure service: [Azure Data Box](/azure/databox/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DataBox/register/action | Register Provider Microsoft.Databox |
> | Microsoft.DataBox/unregister/action | Un-Register Provider Microsoft.Databox |
> | Microsoft.DataBox/jobs/cancel/action | Cancels an order in progress. |
> | Microsoft.DataBox/jobs/bookShipmentPickUp/action | Allows to book a pick up for return shipments. |
> | Microsoft.DataBox/jobs/mitigate/action | This method helps in performing mitigation action on a job with a resolution code |
> | Microsoft.DataBox/jobs/markDevicesShipped/action |  |
> | Microsoft.DataBox/jobs/read | List or get the Orders |
> | Microsoft.DataBox/jobs/delete | Delete the Orders |
> | Microsoft.DataBox/jobs/write | Create or update the Orders |
> | Microsoft.DataBox/jobs/listCredentials/action | Lists the unencrypted credentials related to the order. |
> | Microsoft.DataBox/jobs/eventGridFilters/write | Create or update the Event Grid Subscription Filter |
> | Microsoft.DataBox/jobs/eventGridFilters/read | List or get the Event Grid Subscription Filter |
> | Microsoft.DataBox/jobs/eventGridFilters/delete | Delete the Event Grid Subscription Filter |
> | Microsoft.DataBox/locations/validateInputs/action | This method does all type of validations. |
> | Microsoft.DataBox/locations/validateAddress/action | Validates the shipping address and provides alternate addresses if any. |
> | Microsoft.DataBox/locations/availableSkus/action | This method returns the list of available skus. |
> | Microsoft.DataBox/locations/regionConfiguration/action | This method returns the configurations for the region. |
> | Microsoft.DataBox/locations/availableSkus/read | List or get the Available Skus |
> | Microsoft.DataBox/locations/operationResults/read | List or get the Operation Results |
> | Microsoft.DataBox/operations/read | List or get the Operations |
> | Microsoft.DataBox/subscriptions/resourceGroups/moveResources/action | This method performs the resource move. |
> | Microsoft.DataBox/subscriptions/resourceGroups/validateMoveResources/action | This method validates whether resource move is allowed or not. |

## Microsoft.DataBoxEdge

Appliances and solutions for data transfer to Azure and edge compute.

Azure service: [Azure Stack Edge](/azure/databox-online/azure-stack-edge-overview)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DataBoxEdge/availableSkus/read | Lists or gets the available skus |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/deviceCapacityCheck/action | Performs Device Capacity Check and Returns Feasibility |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/write | Creates or updates the Data Box Edge devices |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/read | Lists or gets the Data Box Edge devices |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/delete | Deletes the Data Box Edge devices |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/getExtendedInformation/action | Retrieves resource extended information |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/updateExtendedInformation/action | Updates resource extended information |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/scanForUpdates/action | Scan for updates |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/downloadUpdates/action | Download Updates in device |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/installUpdates/action | Install Updates on device |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/uploadCertificate/action | Upload certificate for device registration |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/generateCertificate/action | Generate certificate |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/triggerSupportPackage/action | Trigger Support Package |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/alerts/read | Lists or gets the alerts |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/bandwidthSchedules/read | Lists or gets the bandwidth schedules |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/bandwidthSchedules/write | Creates or updates the bandwidth schedules |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/bandwidthSchedules/delete | Deletes the bandwidth schedules |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/bandwidthSchedules/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/deviceCapacityCheck/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/deviceCapacityInfo/read | Lists or gets the device capacity information |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/diagnosticProactiveLogCollectionSettings/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/diagnosticRemoteSupportSettings/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/jobs/read | Lists or gets the jobs |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/networkSettings/read | Lists or gets the Device network settings |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/nodes/read | Lists or gets the nodes |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/operationsStatus/read | Lists or gets the operation status |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/orders/read | Lists or gets the orders |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/orders/write | Creates or updates the orders |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/orders/delete | Deletes the orders |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/orders/listDCAccessCode/action | Lists or gets the data center access code |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/orders/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostics setting for the resource |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/providers/Microsoft.Insights/metricDefinitions/read | Gets the available Data Box Edge device level metrics |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/publishers/offers/skus/versions/generatesastoken/action | Gets the SAS Token for a specific image |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/publishers/offers/skus/versions/generatesastoken/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/read | Lists or gets the roles |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/migrate/action | Migrates the IoT role to ASE Kubernetes role |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/write | Creates or updates the roles |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/delete | Deletes the roles |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/addons/read | Lists or gets the addons |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/addons/write | Creates or updates the addons |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/addons/delete | Deletes the addons |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/addons/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/migrate/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/monitoringConfig/write | Creates or updates the monitoring configuration |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/monitoringConfig/delete | Deletes the monitoring configuration |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/monitoringConfig/read | Lists or gets the monitoring configuration |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/monitoringConfig/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/securitySettings/update/action | Update security settings |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/securitySettings/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/read | Lists or gets the shares |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/write | Creates or updates the shares |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/refresh/action | Refresh the share metadata with the data from the cloud |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/delete | Deletes the shares |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccountCredentials/write | Creates or updates the storage account credentials |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccountCredentials/read | Lists or gets the storage account credentials |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccountCredentials/delete | Deletes the storage account credentials |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccountCredentials/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/read | Lists or gets the Storage Accounts |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/write | Creates or updates the Storage Accounts |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/delete | Deletes the Storage Accounts |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/containers/read | Lists or gets the Containers |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/containers/write | Creates or updates the Containers |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/containers/delete | Deletes the Containers |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/containers/refresh/action | Refresh the container metadata with the data from the cloud |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/containers/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/triggers/read | Lists or gets the triggers |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/triggers/write | Creates or updates the triggers |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/triggers/delete | Deletes the triggers |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/triggers/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/triggerSupportPackage/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/updateSummary/read | Lists or gets the update summary |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/users/read | Lists or gets the share users |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/users/write | Creates or updates the share users |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/users/delete | Deletes the share users |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/users/operationResults/read | Lists or gets the operation result |

## Microsoft.DataMigration

Simplify on-premises database migration to the cloud.

Azure service: [Azure Database Migration Service](/azure/dms/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DataMigration/register/action | Registers the subscription with the Azure Database Migration Service provider |
> | Microsoft.DataMigration/databaseMigrations/write | Create or Update Database Migration resource |
> | Microsoft.DataMigration/databaseMigrations/delete | Delete Database Migration resource |
> | Microsoft.DataMigration/databaseMigrations/read | Retrieve the Database Migration resource |
> | Microsoft.DataMigration/databaseMigrations/cancel/action | Stop ongoing migration for the database |
> | Microsoft.DataMigration/databaseMigrations/cutover/action | Cutover online migration operation for the database |
> | Microsoft.DataMigration/locations/migrationServiceOperationResults/read | Retrieve Service Operation Results |
> | Microsoft.DataMigration/locations/operationResults/read | Get the status of a long-running operation related to a 202 Accepted response |
> | Microsoft.DataMigration/locations/operationStatuses/read | Get the status of a long-running operation related to a 202 Accepted response |
> | Microsoft.DataMigration/locations/sqlMigrationServiceOperationResults/read | Retrieve Service Operation Results |
> | Microsoft.DataMigration/migrationServices/write | Create a new or change properties of existing Service |
> | Microsoft.DataMigration/migrationServices/delete | Delete existing Service |
> | Microsoft.DataMigration/migrationServices/read | Retrieve details of Migration Service |
> | Microsoft.DataMigration/migrationServices/read | Retrieve details of Migration Services in a Resource Group |
> | Microsoft.DataMigration/migrationServices/read | Retrieve all services in the Subscription |
> | Microsoft.DataMigration/migrationServices/listMigrations/read |  |
> | Microsoft.DataMigration/operations/read | Get all REST Operations |
> | Microsoft.DataMigration/services/read | Read information about resources |
> | Microsoft.DataMigration/services/write | Create or update resources and their properties |
> | Microsoft.DataMigration/services/delete | Deletes a resource and all of its children |
> | Microsoft.DataMigration/services/stop/action | Stop the Azure Database Migration Service to minimize its cost |
> | Microsoft.DataMigration/services/start/action | Start the Azure Database Migration Service to allow it to process migrations again |
> | Microsoft.DataMigration/services/checkStatus/action | Check whether the service is deployed and running |
> | Microsoft.DataMigration/services/configureWorker/action | Configures an Azure Database Migration Service worker to the Service's availiable workers |
> | Microsoft.DataMigration/services/addWorker/action | Adds an Azure Database Migration Service worker to the Service's availiable workers |
> | Microsoft.DataMigration/services/removeWorker/action | Removes an Azure Database Migration Service worker to the Service's availiable workers |
> | Microsoft.DataMigration/services/updateAgentConfig/action | Updates Azure Database Migration Service agent configuration with provided values. |
> | Microsoft.DataMigration/services/getHybridDownloadLink/action | Gets an Azure Database Migration Service worker package download link from RP Blob Storage. |
> | Microsoft.DataMigration/services/projects/read | Read information about resources |
> | Microsoft.DataMigration/services/projects/write | Run tasks Azure Database Migration Service tasks |
> | Microsoft.DataMigration/services/projects/delete | Deletes a resource and all of its children |
> | Microsoft.DataMigration/services/projects/accessArtifacts/action | Generate a URL that can be used to GET or PUT project artifacts |
> | Microsoft.DataMigration/services/projects/tasks/read | Read information about resources |
> | Microsoft.DataMigration/services/projects/tasks/write | Run tasks Azure Database Migration Service tasks |
> | Microsoft.DataMigration/services/projects/tasks/delete | Deletes a resource and all of its children |
> | Microsoft.DataMigration/services/projects/tasks/cancel/action | Cancel the task if it's currently running |
> | Microsoft.DataMigration/services/serviceTasks/read | Read information about resources |
> | Microsoft.DataMigration/services/serviceTasks/write | Run tasks Azure Database Migration Service tasks |
> | Microsoft.DataMigration/services/serviceTasks/delete | Deletes a resource and all of its children |
> | Microsoft.DataMigration/services/serviceTasks/cancel/action | Cancel the task if it's currently running |
> | Microsoft.DataMigration/services/slots/read | Read information about resources |
> | Microsoft.DataMigration/services/slots/write | Create or update resources and their properties |
> | Microsoft.DataMigration/services/slots/delete | Deletes a resource and all of its children |
> | Microsoft.DataMigration/skus/read | Get a list of SKUs supported by Azure Database Migration Service resources. |
> | Microsoft.DataMigration/sqlMigrationServices/write | Create a new or change properties of existing Service |
> | Microsoft.DataMigration/sqlMigrationServices/delete | Delete existing Service |
> | Microsoft.DataMigration/sqlMigrationServices/read | Retrieve details of Migration Service |
> | Microsoft.DataMigration/sqlMigrationServices/read | Retrieve details of Migration Services in a Resource Group |
> | Microsoft.DataMigration/sqlMigrationServices/listAuthKeys/action | Retrieve the List of Authentication Keys |
> | Microsoft.DataMigration/sqlMigrationServices/regenerateAuthKeys/action | Regenerate the Authentication Keys |
> | Microsoft.DataMigration/sqlMigrationServices/deleteNode/action |  |
> | Microsoft.DataMigration/sqlMigrationServices/listMonitoringData/action | Retrieve the Monitoring Data |
> | Microsoft.DataMigration/sqlMigrationServices/validateIR/action |  |
> | Microsoft.DataMigration/sqlMigrationServices/read | Retrieve all services in the Subscription |
> | Microsoft.DataMigration/sqlMigrationServices/listMigrations/read |  |
> | Microsoft.DataMigration/sqlMigrationServices/MonitoringData/read | Retrieve the Monitoring Data |
> | Microsoft.DataMigration/sqlMigrationServices/tasks/write | Create or Update Migration Service task |
> | Microsoft.DataMigration/sqlMigrationServices/tasks/delete |  |
> | Microsoft.DataMigration/sqlMigrationServices/tasks/read | Get Migration Service task details |

## Microsoft.Migrate

Easily discover, assess, right-size, and migrate your on-premises VMs to Azure.

Azure service: [Azure Migrate](/azure/migrate/migrate-services-overview)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Migrate/register/action | Subscription Registration Action |
> | Microsoft.Migrate/unregister/action | Unregisters Subscription with Microsoft.Migrate resource provider |
> | Microsoft.Migrate/register/action | Registers Subscription with Microsoft.Migrate resource provider |
> | Microsoft.Migrate/register/action | Registers Subscription with Microsoft.Migrate resource provider |
> | Microsoft.Migrate/unregister/action | Unregisters Subscription with Microsoft.Migrate resource provider |
> | Microsoft.Migrate/assessmentProjects/read | Gets the properties of assessment project |
> | Microsoft.Migrate/assessmentProjects/write | Creates a new assessment project or updates an existing assessment project |
> | Microsoft.Migrate/assessmentProjects/delete | Deletes the assessment project |
> | Microsoft.Migrate/assessmentProjects/startreplicationplanner/action | Initiates replication planner for the set of resources included in the request body |
> | Microsoft.Migrate/assessmentProjects/aksAssessmentOptions/read | Gets the properties of the aks AssessmentOptions |
> | Microsoft.Migrate/assessmentProjects/aksAssessments/read | Gets the properties of the aks Assessment |
> | Microsoft.Migrate/assessmentProjects/aksAssessments/write | Creates a aks Assessment or updates an existing aks Assessment |
> | Microsoft.Migrate/assessmentProjects/aksAssessments/delete | Deletes the aks Assessment which are available in the given location |
> | Microsoft.Migrate/assessmentProjects/aksAssessments/downloadurl/action | Get Blob SAS URI for the aks AssessmentReport |
> | Microsoft.Migrate/assessmentProjects/aksAssessments/assessedwebapps/read | Gets the properties of the assessedwebapps  |
> | Microsoft.Migrate/assessmentProjects/aksAssessments/clusters/read | Gets the properties of the clusters  |
> | Microsoft.Migrate/assessmentProjects/aksAssessments/costdetails/read | Gets the properties of the costdetails  |
> | Microsoft.Migrate/assessmentProjects/aksAssessments/summaries/read | Gets the properties of the aks AssessmentSummary |
> | Microsoft.Migrate/assessmentProjects/assessmentOptions/read | Gets the assessment options which are available in the given location |
> | Microsoft.Migrate/assessmentProjects/assessments/read | Lists assessments within a project |
> | Microsoft.Migrate/assessmentProjects/assessmentsSummary/read | Gets the assessments summary which are available in the given location |
> | Microsoft.Migrate/assessmentProjects/avsAssessmentOptions/read | Gets the AVS assessment options which are available in the given location |
> | Microsoft.Migrate/assessmentProjects/businesscases/comparesummary/action | Gets the compare summary of the business case |
> | Microsoft.Migrate/assessmentProjects/businesscases/read | Gets the properties of a business case |
> | Microsoft.Migrate/assessmentProjects/businesscases/report/action | Downloads a Business Case report's URL |
> | Microsoft.Migrate/assessmentProjects/businesscases/write | Creates a new business case or updates an existing business case |
> | Microsoft.Migrate/assessmentProjects/businesscases/delete | Delete a Business Case |
> | Microsoft.Migrate/assessmentProjects/businesscases/avssummaries/read | Gets the AVS summary of the business case |
> | Microsoft.Migrate/assessmentProjects/businesscases/evaluatedavsmachines/read | Get the properties of an evaluated Avs machine |
> | Microsoft.Migrate/assessmentProjects/businesscases/evaluatedmachines/read | Get the properties of an evaluated machine |
> | Microsoft.Migrate/assessmentProjects/businesscases/evaluatedsqlentities/read | Get the properties of an evaluated SQL entities |
> | Microsoft.Migrate/assessmentProjects/businesscases/evaluatedwebapps/read | Get the properties of an Evaluated Webapp  |
> | Microsoft.Migrate/assessmentProjects/businesscases/iaassummaries/read | Gets the IAAS summary of the business case |
> | Microsoft.Migrate/assessmentProjects/businesscases/overviewsummaries/read | Gets the overview summary of the business case |
> | Microsoft.Migrate/assessmentProjects/businesscases/paassummaries/read | Gets the PAAS summary of the business case |
> | Microsoft.Migrate/assessmentProjects/groups/read | Get the properties of a group |
> | Microsoft.Migrate/assessmentProjects/groups/write | Creates a new group or updates an existing group |
> | Microsoft.Migrate/assessmentProjects/groups/delete | Deletes a group |
> | Microsoft.Migrate/assessmentProjects/groups/updateMachines/action | Update group by adding or removing machines |
> | Microsoft.Migrate/assessmentProjects/groups/assessments/read | Gets the properties of an assessment |
> | Microsoft.Migrate/assessmentProjects/groups/assessments/write | Creates a new assessment or updates an existing assessment |
> | Microsoft.Migrate/assessmentProjects/groups/assessments/delete | Deletes an assessment |
> | Microsoft.Migrate/assessmentProjects/groups/assessments/downloadurl/action | Downloads an assessment report's URL |
> | Microsoft.Migrate/assessmentProjects/groups/assessments/assessedmachines/read | Get the properties of an assessed machine |
> | Microsoft.Migrate/assessmentProjects/groups/assessmentsSummary/read | Assessment summary of group |
> | Microsoft.Migrate/assessmentProjects/groups/avsAssessments/read | Gets the properties of an AVS assessment |
> | Microsoft.Migrate/assessmentProjects/groups/avsAssessments/write | Creates a new AVS assessment or updates an existing AVS assessment |
> | Microsoft.Migrate/assessmentProjects/groups/avsAssessments/delete | Deletes an AVS assessment |
> | Microsoft.Migrate/assessmentProjects/groups/avsAssessments/downloadurl/action | Downloads an AVS assessment report's URL |
> | Microsoft.Migrate/assessmentProjects/groups/avsAssessments/avsassessedmachines/read | Get the properties of an AVS assessed machine |
> | Microsoft.Migrate/assessmentProjects/groups/sqlAssessments/read | Gets the properties of an SQL assessment |
> | Microsoft.Migrate/assessmentProjects/groups/sqlAssessments/write | Creates a new SQL assessment or updates an existing SQL assessment |
> | Microsoft.Migrate/assessmentProjects/groups/sqlAssessments/delete | Deletes an SQL assessment |
> | Microsoft.Migrate/assessmentProjects/groups/sqlAssessments/downloadurl/action | Downloads an SQL assessment report's URL |
> | Microsoft.Migrate/assessmentProjects/groups/sqlAssessments/assessedSqlDatabases/read | Get the properties of assessed SQL databses |
> | Microsoft.Migrate/assessmentProjects/groups/sqlAssessments/assessedSqlInstances/read | Get the properties of assessed SQL instances |
> | Microsoft.Migrate/assessmentProjects/groups/sqlAssessments/assessedSqlMachines/read | Get the properties of assessed SQL machines |
> | Microsoft.Migrate/assessmentProjects/groups/sqlAssessments/recommendedAssessedEntities/read | Get the properties of recommended assessed entity |
> | Microsoft.Migrate/assessmentProjects/groups/sqlAssessments/summaries/read | Gets Sql Assessment summary of group |
> | Microsoft.Migrate/assessmentProjects/groups/webappAssessments/downloadurl/action | Downloads WebApp assessment report's URL |
> | Microsoft.Migrate/assessmentProjects/groups/webappAssessments/read | Gets the properties of an WebApp assessment |
> | Microsoft.Migrate/assessmentProjects/groups/webappAssessments/write | Creates a new WebApp assessment or updates an existing WebApp assessment |
> | Microsoft.Migrate/assessmentProjects/groups/webappAssessments/delete | Deletes an WebApp assessment |
> | Microsoft.Migrate/assessmentProjects/groups/webappAssessments/assessedwebApps/read | Get the properties of assessed WebApps |
> | Microsoft.Migrate/assessmentProjects/groups/webappAssessments/summaries/read | Gets web app assessment summary |
> | Microsoft.Migrate/assessmentProjects/groups/webappAssessments/webappServicePlans/read | Get the properties of WebApp service plan |
> | Microsoft.Migrate/assessmentProjects/hypervcollectors/read | Gets the properties of HyperV collector |
> | Microsoft.Migrate/assessmentProjects/hypervcollectors/write | Creates a new HyperV collector or updates an existing HyperV collector |
> | Microsoft.Migrate/assessmentProjects/hypervcollectors/delete | Deletes the HyperV collector |
> | Microsoft.Migrate/assessmentProjects/importcollectors/read | Gets the properties of Import collector |
> | Microsoft.Migrate/assessmentProjects/importcollectors/write | Creates a new Import collector or updates an existing Import collector |
> | Microsoft.Migrate/assessmentProjects/importcollectors/delete | Deletes the Import collector |
> | Microsoft.Migrate/assessmentProjects/machines/read | Gets the properties of a machine |
> | Microsoft.Migrate/assessmentProjects/oracleAssessmentOptions/read | Gets the properties of the oracle AssessmentOptions |
> | Microsoft.Migrate/assessmentProjects/oracleAssessments/read | Gets the properties of the oracle Assessment |
> | Microsoft.Migrate/assessmentProjects/oracleAssessments/write | Creates a oracle Assessment or updates an existing oracle Assessment |
> | Microsoft.Migrate/assessmentProjects/oracleAssessments/delete | Deletes the oracle Assessment which are available in the given location |
> | Microsoft.Migrate/assessmentProjects/oracleAssessments/downloadurl/action | Get Blob SAS URI for the oracle AssessmentReport |
> | Microsoft.Migrate/assessmentProjects/oracleAssessments/assessedDatabases/read | Gets the properties of the assessedDatabases  |
> | Microsoft.Migrate/assessmentProjects/oracleAssessments/assessedInstances/read | Gets the properties of the assessedInstances  |
> | Microsoft.Migrate/assessmentProjects/oracleAssessments/summaries/read | Gets the properties of the oracle AssessmentSummary |
> | Microsoft.Migrate/assessmentProjects/oraclecollectors/read | Gets the properties of the oracle Collector |
> | Microsoft.Migrate/assessmentProjects/oraclecollectors/write | Creates a oracle Collector or updates an existing oracle Collector |
> | Microsoft.Migrate/assessmentProjects/oraclecollectors/delete | Deletes the oracle Collector which are available in the given location |
> | Microsoft.Migrate/assessmentProjects/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.Migrate/assessmentProjects/privateEndpointConnectionProxies/validate/action | Validate a Private Endpoint Connection Proxy |
> | Microsoft.Migrate/assessmentProjects/privateEndpointConnectionProxies/write | Create or Update a Private Endpoint Connection Proxy |
> | Microsoft.Migrate/assessmentProjects/privateEndpointConnectionProxies/delete | Delete a Private Endpoint Connection Proxy |
> | Microsoft.Migrate/assessmentProjects/privateEndpointConnections/read | Get Private Endpoint Connection |
> | Microsoft.Migrate/assessmentProjects/privateEndpointConnections/write | Update a Private Endpoint Connection |
> | Microsoft.Migrate/assessmentProjects/privateEndpointConnections/delete | Delete a Private Endpoint Connection |
> | Microsoft.Migrate/assessmentProjects/privateLinkResources/read | Get Private Link Resource |
> | Microsoft.Migrate/assessmentProjects/projectsummary/read | Gets the properties of project summary |
> | Microsoft.Migrate/assessmentProjects/replicationplannerjobs/read | Gets the properties of an replication planner jobs |
> | Microsoft.Migrate/assessmentProjects/sapAssessmentOptions/read | Gets the properties of the sap AssessmentOptions |
> | Microsoft.Migrate/assessmentProjects/sapAssessments/read | Gets the properties of the sap Assessment |
> | Microsoft.Migrate/assessmentProjects/sapAssessments/write | Creates a sap Assessment or updates an existing sap Assessment |
> | Microsoft.Migrate/assessmentProjects/sapAssessments/delete | Deletes the sap Assessment which are available in the given location |
> | Microsoft.Migrate/assessmentProjects/sapAssessments/downloadurl/action | Get Blob SAS URI for the sap AssessmentReport |
> | Microsoft.Migrate/assessmentProjects/sapAssessments/assessedApplications/read | Gets the properties of the assessedApplications  |
> | Microsoft.Migrate/assessmentProjects/sapAssessments/summaries/read | Gets the properties of the sap AssessmentSummary |
> | Microsoft.Migrate/assessmentProjects/sapcollectors/read | Gets the properties of the sap Collector |
> | Microsoft.Migrate/assessmentProjects/sapcollectors/write | Creates a sap Collector or updates an existing sap Collector |
> | Microsoft.Migrate/assessmentProjects/sapcollectors/delete | Deletes the sap Collector which are available in the given location |
> | Microsoft.Migrate/assessmentProjects/servercollectors/read | Gets the properties of Server collector |
> | Microsoft.Migrate/assessmentProjects/servercollectors/write | Creates a new Server collector or updates an existing Server collector |
> | Microsoft.Migrate/assessmentProjects/springBootAssessmentOptions/read | Gets the properties of the springBoot AssessmentOptions |
> | Microsoft.Migrate/assessmentProjects/springBootAssessments/read | Gets the properties of the springBoot Assessment |
> | Microsoft.Migrate/assessmentProjects/springBootAssessments/write | Creates a springBoot Assessment or updates an existing springBoot Assessment |
> | Microsoft.Migrate/assessmentProjects/springBootAssessments/delete | Deletes the springBoot Assessment which are available in the given location |
> | Microsoft.Migrate/assessmentProjects/springBootAssessments/downloadurl/action | Get Blob SAS URI for the springBoot AssessmentReport |
> | Microsoft.Migrate/assessmentProjects/springBootAssessments/assessedApplications/read | Gets the properties of the assessedApplications  |
> | Microsoft.Migrate/assessmentProjects/springBootAssessments/summaries/read | Gets the properties of the springBoot AssessmentSummary |
> | Microsoft.Migrate/assessmentProjects/springBootcollectors/read | Gets the properties of the springBoot Collector |
> | Microsoft.Migrate/assessmentProjects/springBootcollectors/write | Creates a springBoot Collector or updates an existing springBoot Collector |
> | Microsoft.Migrate/assessmentProjects/springBootcollectors/delete | Deletes the springBoot Collector which are available in the given location |
> | Microsoft.Migrate/assessmentProjects/sqlAssessmentOptions/read | Gets the SQL assessment options which are available in the given location |
> | Microsoft.Migrate/assessmentProjects/sqlcollectors/read | Gets the properties of SQL collector |
> | Microsoft.Migrate/assessmentProjects/sqlcollectors/write | Creates a new SQL collector or updates an existing SQL collector |
> | Microsoft.Migrate/assessmentProjects/sqlcollectors/delete | Deletes the SQL collector |
> | Microsoft.Migrate/assessmentProjects/vmwarecollectors/read | Gets the properties of VMware collector |
> | Microsoft.Migrate/assessmentProjects/vmwarecollectors/write | Creates a new VMware collector or updates an existing VMware collector |
> | Microsoft.Migrate/assessmentProjects/vmwarecollectors/delete | Deletes the VMware collector |
> | Microsoft.Migrate/assessmentProjects/webAppAssessmentOptions/read | Gets the WebApp assessment options which are available in the given location |
> | Microsoft.Migrate/assessmentProjects/webAppAssessments/read | Lists web app assessments within a project |
> | Microsoft.Migrate/assessmentProjects/webappcollectors/read | Gets the properties of Webapp collector |
> | Microsoft.Migrate/assessmentProjects/webappcollectors/write | Creates a new Webapp collector or updates an existing Webapp collector |
> | Microsoft.Migrate/assessmentProjects/webappcollectors/delete | Deletes the Webapp collector |
> | Microsoft.Migrate/locations/operationResults/read | Locations Operation Results |
> | Microsoft.Migrate/locations/rmsOperationResults/read | Gets the status of the subscription wide location based operation |
> | Microsoft.Migrate/migrateProjects/read | Gets the properties of migrate project |
> | Microsoft.Migrate/migrateProjects/write | Creates a new migrate project or updates an existing migrate project |
> | Microsoft.Migrate/migrateProjects/delete | Deletes a migrate project |
> | Microsoft.Migrate/migrateProjects/registerTool/action | Registers tool to a migrate project |
> | Microsoft.Migrate/migrateProjects/RefreshSummary/action | Refreshes the migrate project summary |
> | Microsoft.Migrate/migrateProjects/registrationDetails/action | Provides the tool registration details |
> | Microsoft.Migrate/migrateProjects/DatabaseInstances/read | Gets the properties of a database instance |
> | Microsoft.Migrate/migrateProjects/Databases/read | Gets the properties of a database |
> | Microsoft.Migrate/migrateProjects/machines/read | Gets the properties of a machine |
> | Microsoft.Migrate/migrateProjects/MigrateEvents/read | Gets the properties of a migrate events. |
> | Microsoft.Migrate/migrateProjects/MigrateEvents/Delete | Deletes a migrate event |
> | Microsoft.Migrate/migrateProjects/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.Migrate/migrateProjects/privateEndpointConnectionProxies/validate/action | Validate a Private Endpoint Connection Proxy |
> | Microsoft.Migrate/migrateProjects/privateEndpointConnectionProxies/write | Create or Update a Private Endpoint Connection Proxy |
> | Microsoft.Migrate/migrateProjects/privateEndpointConnectionProxies/delete | Delete a Private Endpoint Connection Proxy |
> | Microsoft.Migrate/migrateProjects/privateEndpointConnections/read | Get Private Endpoint Connection |
> | Microsoft.Migrate/migrateProjects/privateEndpointConnections/write | Update a Private Endpoint Connection |
> | Microsoft.Migrate/migrateProjects/privateEndpointConnections/delete | Delete a Private Endpoint Connection |
> | Microsoft.Migrate/migrateProjects/privateLinkResources/read | Get Private Link Resource |
> | Microsoft.Migrate/migrateProjects/solutions/read | Gets the properties of migrate project solution |
> | Microsoft.Migrate/migrateProjects/solutions/write | Creates a new migrate project solution or updates an existing migrate project solution |
> | Microsoft.Migrate/migrateProjects/solutions/Delete | Deletes a  migrate project solution |
> | Microsoft.Migrate/migrateProjects/solutions/getconfig/action | Gets the migrate project solution configuration |
> | Microsoft.Migrate/migrateProjects/solutions/cleanupData/action | Clean up the migrate project solution data |
> | Microsoft.Migrate/migrateProjects/VirtualDesktopUsers/read | Gets the properties of a virtual desktop user |
> | Microsoft.Migrate/migrateProjects/WebServers/read | Gets the properties of a web server |
> | Microsoft.Migrate/migrateProjects/WebSites/read | Gets the properties of a web site |
> | Microsoft.Migrate/modernizeProjects/read | Gets the details of the modernize project |
> | Microsoft.Migrate/modernizeProjects/write | Creates the modernizeProject |
> | Microsoft.Migrate/modernizeProjects/delete | Removes the modernizeProject |
> | Microsoft.Migrate/modernizeProjects/deployedResources/read | Gets the details of the deployed resource |
> | Microsoft.Migrate/modernizeProjects/jobs/read | Gets the details of the job |
> | Microsoft.Migrate/modernizeProjects/jobs/operations/read | Tracks the results of an asynchronous operation on the job |
> | Microsoft.Migrate/modernizeProjects/migrateAgents/read | Gets the details of the modernizeProject agent |
> | Microsoft.Migrate/modernizeProjects/migrateAgents/write | Creates the modernizeProject agent |
> | Microsoft.Migrate/modernizeProjects/migrateAgents/delete | Deletes the modernizeProject agent |
> | Microsoft.Migrate/modernizeProjects/migrateAgents/refresh/action | Refreshes the modernizeProject agent |
> | Microsoft.Migrate/modernizeProjects/migrateAgents/operations/read | Tracks the results of an asynchronous operation on the modernizeProject agent |
> | Microsoft.Migrate/modernizeProjects/operations/read | Tracks the results of an asynchronous operation on the modernizeProject |
> | Microsoft.Migrate/modernizeProjects/statistics/read | Gets the statistics for the modernizeProject |
> | Microsoft.Migrate/modernizeProjects/workloadDeployments/read | Gets the details of the workload deployment |
> | Microsoft.Migrate/modernizeProjects/workloadDeployments/write | Creates the workload deployment |
> | Microsoft.Migrate/modernizeProjects/workloadDeployments/delete | Removes the workload deployment |
> | Microsoft.Migrate/modernizeProjects/workloadDeployments/getSecrets/action | Gets the secrets of the workload deployment |
> | Microsoft.Migrate/modernizeProjects/workloadDeployments/buildContainerImage/action | Performs the build container image action on the workload deployment |
> | Microsoft.Migrate/modernizeProjects/workloadDeployments/testMigrate/action | Performs the test migrate on the workload deployment |
> | Microsoft.Migrate/modernizeProjects/workloadDeployments/testMigrateCleanup/action | Performs the test migrate cleanup on the workload deployment |
> | Microsoft.Migrate/modernizeProjects/workloadDeployments/migrate/action | Performs migrate on the workload deployment |
> | Microsoft.Migrate/modernizeProjects/workloadDeployments/operations/read | Tracks the results of an asynchronous operation on the workload deployment |
> | Microsoft.Migrate/modernizeProjects/workloadInstances/read | Gets the details of the workload instance |
> | Microsoft.Migrate/modernizeProjects/workloadInstances/write | Creates the workload instance in the given modernizeProject |
> | Microsoft.Migrate/modernizeProjects/workloadInstances/delete | Deletes the workload instance in the given modernizeProject |
> | Microsoft.Migrate/modernizeProjects/workloadInstances/completeMigration/action | Performs complete migrate on the workload instance |
> | Microsoft.Migrate/modernizeProjects/workloadInstances/disableReplication/action | Performs disable replicate on the workload instance |
> | Microsoft.Migrate/modernizeProjects/workloadInstances/operations/read | Tracks the results of an asynchronous operation on the workload instance |
> | Microsoft.Migrate/moveCollections/read | Gets the move collection |
> | Microsoft.Migrate/moveCollections/write | Creates or updates a move collection |
> | Microsoft.Migrate/moveCollections/delete | Deletes a move collection |
> | Microsoft.Migrate/moveCollections/resolveDependencies/action | Computes, resolves and validate the dependencies of the move resources in the move collection |
> | Microsoft.Migrate/moveCollections/prepare/action | Initiates prepare for the set of resources included in the request body |
> | Microsoft.Migrate/moveCollections/initiateMove/action | Moves the set of resources included in the request body |
> | Microsoft.Migrate/moveCollections/discard/action | Discards the set of resources included in the request body |
> | Microsoft.Migrate/moveCollections/commit/action | Commits the set of resources included in the request body |
> | Microsoft.Migrate/moveCollections/bulkRemove/action | Removes the set of move resources included in the request body from move collection |
> | Microsoft.Migrate/moveCollections/moveResources/read | Gets all the move resources or a move resource from the move collection |
> | Microsoft.Migrate/moveCollections/moveResources/write | Creates or updates a move resource |
> | Microsoft.Migrate/moveCollections/moveResources/delete | Deletes a move resource from the move collection |
> | Microsoft.Migrate/moveCollections/operations/read | Gets the status of the operation |
> | Microsoft.Migrate/moveCollections/requiredFor/read | Gets the resources which will use the resource passed in query parameter |
> | Microsoft.Migrate/moveCollections/unresolvedDependencies/read | Gets a list of unresolved dependencies in the move collection |
> | Microsoft.Migrate/Operations/read | Reads the exposed operations |
> | Microsoft.Migrate/resourcetypes/read | Gets the resource types |

## Microsoft.OffAzure

Azure service: [Azure Migrate](/azure/migrate/migrate-services-overview)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.OffAzure/register/action | Subscription Registration Action |
> | Microsoft.OffAzure/unregister/action | Unregisters Subscription with Microsoft.OffAzure resource provider |
> | Microsoft.OffAzure/register/action | Registers Subscription with Microsoft.OffAzure resource provider |
> | Microsoft.OffAzure/hypervSites/read | Gets the properties of a Hyper-V site |
> | Microsoft.OffAzure/hypervSites/write | Creates or updates the Hyper-V site |
> | Microsoft.OffAzure/hypervSites/delete | Deletes the Hyper-V site |
> | Microsoft.OffAzure/hypervSites/refresh/action | Refreshes the objects within a Hyper-V site |
> | Microsoft.OffAzure/hypervSites/updateProperties/action | Updates the properties for machines in a site |
> | Microsoft.OffAzure/hypervSites/clientGroupMembers/action | Generates client group members view with dependency map data |
> | Microsoft.OffAzure/hypervSites/exportApplications/action | Export the Applications, roles and features of HyperV site machine inventory |
> | Microsoft.OffAzure/hypervSites/exportDependencies/action | Export the machine Dependency map information of entire HyperV site machine inventory |
> | Microsoft.OffAzure/hypervSites/exportMachineErrors/action | Export machine errors for the entire HyperV site machine inventory |
> | Microsoft.OffAzure/hypervSites/generateCoarseMap/action | Generates coarse map for the list of machines |
> | Microsoft.OffAzure/hypervSites/generateDetailedMap/action | Generate details HyperV coarse map |
> | Microsoft.OffAzure/hypervSites/serverGroupMembers/action | Lists the server group members for the selected server group. |
> | Microsoft.OffAzure/hypervSites/updateDependencyMapStatus/action | Toggle dependency map switch of a list of machines |
> | Microsoft.OffAzure/hypervSites/clusters/read | Gets the properties of a Hyper-V cluster |
> | Microsoft.OffAzure/hypervSites/clusters/write | Creates or updates the Hyper-V cluster |
> | Microsoft.OffAzure/hypervSites/errorSummary/read | Gets the error summaries of all the HyperV Site resource inventory |
> | Microsoft.OffAzure/hypervSites/healthsummary/read | Gets the health summary for Hyper-V resource |
> | Microsoft.OffAzure/hypervSites/hosts/read | Gets the properties of a Hyper-V host |
> | Microsoft.OffAzure/hypervSites/hosts/write | Creates or updates the Hyper-V host |
> | Microsoft.OffAzure/hypervSites/jobs/read | Gets the properties of a Hyper-V jobs |
> | Microsoft.OffAzure/hypervSites/machines/read | Gets the properties of a Hyper-V machines |
> | Microsoft.OffAzure/hypervSites/machines/applications/read | Get properties of HyperV machine application |
> | Microsoft.OffAzure/hypervSites/machines/softwareinventory/read | Gets HyperV machine software inventory data |
> | Microsoft.OffAzure/hypervSites/operationsstatus/read | Gets the properties of a Hyper-V operation status |
> | Microsoft.OffAzure/hypervSites/runasaccounts/read | Gets the properties of a Hyper-V run as accounts |
> | Microsoft.OffAzure/hypervSites/summary/read | Gets the summary of a Hyper-V site |
> | Microsoft.OffAzure/hypervSites/usage/read | Gets the usages of a Hyper-V site |
> | Microsoft.OffAzure/importSites/read | Gets the properties of a Import site |
> | Microsoft.OffAzure/importSites/write | Creates or updates the Import site |
> | Microsoft.OffAzure/importSites/delete | Deletes the Import site |
> | Microsoft.OffAzure/importSites/importuri/action | Gets the SAS uri for importing the machines CSV file. |
> | Microsoft.OffAzure/importSites/exporturi/action | Gets the SAS uri for exporting the machines CSV file. |
> | Microsoft.OffAzure/importSites/jobs/read | Gets the properties of a Import jobs |
> | Microsoft.OffAzure/importSites/machines/read | Gets the properties of a Import machines |
> | Microsoft.OffAzure/importSites/machines/delete | Deletes the Import machine |
> | Microsoft.OffAzure/locations/operationResults/read | Locations Operation Results |
> | Microsoft.OffAzure/masterSites/read | Gets the properties of a Master site |
> | Microsoft.OffAzure/masterSites/write | Creates or updates the Master site |
> | Microsoft.OffAzure/masterSites/delete | Deletes the Master site |
> | Microsoft.OffAzure/masterSites/applianceRegistrationInfo/action | Register an Appliances Under A Master Site |
> | Microsoft.OffAzure/masterSites/errorSummary/action | Retrieves Error Summary For Resources Under A Given Master Site |
> | Microsoft.OffAzure/masterSites/operationsstatus/read | Gets the properties of a Master site operation status |
> | Microsoft.OffAzure/masterSites/OracleErrorSummaries/read | Gets the error summaries of all the Partner Site resource inventory |
> | Microsoft.OffAzure/masterSites/OracleExtendedMachines/read | Gets the extended machines relative to all the Partner Site resource inventory |
> | Microsoft.OffAzure/masterSites/OracleResourceLinks/read | Gets the resource Linkages of  the Partner Site |
> | Microsoft.OffAzure/masterSites/OracleResourceLinks/write | Creates or updates the resource Linkages of the Partner Site |
> | Microsoft.OffAzure/masterSites/OracleResourceLinks/delete | Deletes the resource Linkages of the Partner Site |
> | Microsoft.OffAzure/masterSites/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.OffAzure/masterSites/privateEndpointConnectionProxies/validate/action | Validate a Private Endpoint Connection Proxy |
> | Microsoft.OffAzure/masterSites/privateEndpointConnectionProxies/write | Create or Update a Private Endpoint Connection Proxy |
> | Microsoft.OffAzure/masterSites/privateEndpointConnectionProxies/delete | Delete a Private Endpoint Connection Proxy |
> | Microsoft.OffAzure/masterSites/privateEndpointConnectionProxies/operationsstatus/read | Get status of a long running operation on a Private Endpoint Connection Proxy |
> | Microsoft.OffAzure/masterSites/privateEndpointConnections/read | Get Private Endpoint Connection |
> | Microsoft.OffAzure/masterSites/privateEndpointConnections/write | Update a Private Endpoint Connection |
> | Microsoft.OffAzure/masterSites/privateEndpointConnections/delete | Delete a Private Endpoint Connection |
> | Microsoft.OffAzure/masterSites/privateLinkResources/read | Get Private Link Resource |
> | Microsoft.OffAzure/masterSites/SpringbootErrorSummaries/read | Gets the error summaries of all the Partner Site resource inventory |
> | Microsoft.OffAzure/masterSites/SpringbootExtendedMachines/read | Gets the extended machines relative to all the Partner Site resource inventory |
> | Microsoft.OffAzure/masterSites/SpringbootResourceLinks/read | Gets the resource Linkages of  the Partner Site |
> | Microsoft.OffAzure/masterSites/SpringbootResourceLinks/write | Creates or updates the resource Linkages of the Partner Site |
> | Microsoft.OffAzure/masterSites/SpringbootResourceLinks/delete | Deletes the resource Linkages of the Partner Site |
> | Microsoft.OffAzure/masterSites/sqlSites/read | Gets the Sql Site |
> | Microsoft.OffAzure/masterSites/sqlSites/write | Creates or Updates a Sql Site |
> | Microsoft.OffAzure/masterSites/sqlSites/delete | Delete a Sql Site |
> | Microsoft.OffAzure/masterSites/sqlSites/refresh/action | Refreshes data for Sql Site |
> | Microsoft.OffAzure/masterSites/sqlSites/exportSqlServers/action | Export Sql servers for the entire Sql site inventory |
> | Microsoft.OffAzure/masterSites/sqlSites/exportSqlServerErrors/action | Export Sql server errors for the entire Sql site inventory |
> | Microsoft.OffAzure/masterSites/sqlSites/errorDetailedSummary/action | Retrieves Sql Error detailed summary for a resource under a given Sql Site |
> | Microsoft.OffAzure/masterSites/sqlSites/discoverySiteDataSources/read | Gets the Sql Discovery Site Data Source |
> | Microsoft.OffAzure/masterSites/sqlSites/discoverySiteDataSources/write | Creates or Updates the Sql Discovery Site Data Source |
> | Microsoft.OffAzure/masterSites/sqlSites/operationsStatus/read | Gets Sql Operation Status |
> | Microsoft.OffAzure/masterSites/sqlSites/runAsAccounts/read | Gets Sql Run as Accounts for a given site |
> | Microsoft.OffAzure/masterSites/sqlSites/sqlAvailabilityGroups/read | Gets Sql Availability Groups for a given site |
> | Microsoft.OffAzure/masterSites/sqlSites/sqlDatabases/read | Gets Sql Database for a given site |
> | Microsoft.OffAzure/masterSites/sqlSites/sqlServers/read | Gets the Sql Servers for a given site |
> | Microsoft.OffAzure/masterSites/webAppSites/read | Gets the properties of a WebApp site |
> | Microsoft.OffAzure/masterSites/webAppSites/write | Creates or updates the WebApp site |
> | Microsoft.OffAzure/masterSites/webAppSites/delete | Deletes the WebApp site |
> | Microsoft.OffAzure/masterSites/webAppSites/Refresh/action | Refresh Web App For A Given Site |
> | Microsoft.OffAzure/masterSites/webAppSites/UpdateProperties/action | Create or Update Web App Properties for a given site |
> | Microsoft.OffAzure/masterSites/webAppSites/DiscoverySiteDataSources/read | Gets Web App Discovery Site Data Source For A Given Site |
> | Microsoft.OffAzure/masterSites/webAppSites/DiscoverySiteDataSources/write | Create or Update Web App Discovery Site Data Source For A Given Site |
> | Microsoft.OffAzure/masterSites/webAppSites/ExtendedMachines/read | Get Web App Extended Machines For A Given Site |
> | Microsoft.OffAzure/masterSites/webAppSites/IISWebApplications/read | Gets the properties of IIS Web applications. |
> | Microsoft.OffAzure/masterSites/webAppSites/IISWebServers/read | Gets the properties of IIS Web servers. |
> | Microsoft.OffAzure/masterSites/webAppSites/RunAsAccounts/read | Get Web App Run As Accounts For A Given Site |
> | Microsoft.OffAzure/masterSites/webAppSites/TomcatWebApplications/read | Get TomCat Web Applications |
> | Microsoft.OffAzure/masterSites/webAppSites/TomcatWebServers/read | Get TomCat Web Servers for a given site |
> | Microsoft.OffAzure/masterSites/webAppSites/WebApplications/read | Gets Web App Applications for a given site |
> | Microsoft.OffAzure/masterSites/webAppSites/WebServers/read | Gets Web App Web Servers |
> | Microsoft.OffAzure/Operations/read | Reads the exposed operations |
> | Microsoft.OffAzure/serverSites/read | Gets the properties of a Server site |
> | Microsoft.OffAzure/serverSites/write | Creates or updates the Server site |
> | Microsoft.OffAzure/serverSites/delete | Deletes the Server site |
> | Microsoft.OffAzure/serverSites/refresh/action | Refreshes the objects within a Server site |
> | Microsoft.OffAzure/serverSites/updateProperties/action | Updates the properties for machines in a site |
> | Microsoft.OffAzure/serverSites/updateTags/action | Updates the tags for machines in a site |
> | Microsoft.OffAzure/serverSites/clientGroupMembers/action | Generate client group members view with dependency map data |
> | Microsoft.OffAzure/serverSites/exportApplications/action | Export Applications, Roles and Features of Server Site Inventory |
> | Microsoft.OffAzure/serverSites/exportDependencies/action | Export the machine Dependency map information of entire Server site machine inventory |
> | Microsoft.OffAzure/serverSites/exportMachineErrors/action | Export machine errors for the entire Server site machine inventory |
> | Microsoft.OffAzure/serverSites/generateCoarseMap/action | Generate Coarse map for the list of machines |
> | Microsoft.OffAzure/serverSites/generateDetailedMap/action | Generate detailed coarse map for the list of machines |
> | Microsoft.OffAzure/serverSites/serverGroupMembers/action | Generate server group members view with dependency map data |
> | Microsoft.OffAzure/serverSites/updateDependencyMapStatus/action | Toggle dependency map data of a list of machines |
> | Microsoft.OffAzure/serverSites/errorSummary/read | Get Error Summary for Server site inventory |
> | Microsoft.OffAzure/serverSites/jobs/read | Gets the properties of a Server jobs |
> | Microsoft.OffAzure/serverSites/machines/read | Gets the properties of a Server machines |
> | Microsoft.OffAzure/serverSites/machines/write | Write the properties of a Server machines |
> | Microsoft.OffAzure/serverSites/machines/delete | Delete the properties of a Server machines |
> | Microsoft.OffAzure/serverSites/machines/applications/read | Get server machine installed applications, roles and features |
> | Microsoft.OffAzure/serverSites/machines/softwareinventory/read | Gets Server machine software inventory data |
> | Microsoft.OffAzure/serverSites/operationsstatus/read | Gets the properties of a Server operation status |
> | Microsoft.OffAzure/serverSites/runasaccounts/read | Gets the properties of a Server run as accounts |
> | Microsoft.OffAzure/serverSites/summary/read | Gets the summary of a Server site |
> | Microsoft.OffAzure/serverSites/usage/read | Gets the usages of a Server site |
> | Microsoft.OffAzure/vmwareSites/read | Gets the properties of a VMware site |
> | Microsoft.OffAzure/vmwareSites/write | Creates or updates the VMware site |
> | Microsoft.OffAzure/vmwareSites/delete | Deletes the VMware site |
> | Microsoft.OffAzure/vmwareSites/refresh/action | Refreshes the objects within a VMware site |
> | Microsoft.OffAzure/vmwareSites/exportapplications/action | Exports the VMware applications and roles data into xls |
> | Microsoft.OffAzure/vmwareSites/updateProperties/action | Updates the properties for machines in a site |
> | Microsoft.OffAzure/vmwareSites/updateTags/action | Updates the tags for machines in a site |
> | Microsoft.OffAzure/vmwareSites/generateCoarseMap/action | Generates the coarse map for the list of machines |
> | Microsoft.OffAzure/vmwareSites/generateDetailedMap/action | Generates the Detailed VMware Coarse Map |
> | Microsoft.OffAzure/vmwareSites/clientGroupMembers/action | Lists the client group members for the selected client group. |
> | Microsoft.OffAzure/vmwareSites/serverGroupMembers/action | Lists the server group members for the selected server group. |
> | Microsoft.OffAzure/vmwareSites/getApplications/action | Gets the list application information for the selected machines |
> | Microsoft.OffAzure/vmwareSites/exportDependencies/action | Exports the dependencies information for the selected machines |
> | Microsoft.OffAzure/vmwareSites/exportMachineerrors/action | Export machine errors for the entire VMware site machine inventory |
> | Microsoft.OffAzure/vmwareSites/updateDependencyMapStatus/action | Toggle dependency map data of a list of machines |
> | Microsoft.OffAzure/vmwareSites/errorSummary/read | Get Error Summary for VMware site inventory |
> | Microsoft.OffAzure/vmwareSites/healthsummary/read | Gets the health summary for VMware resource |
> | Microsoft.OffAzure/vmwareSites/hosts/read | Gets the properties of a VMware hosts |
> | Microsoft.OffAzure/vmwareSites/jobs/read | Gets the properties of a VMware jobs |
> | Microsoft.OffAzure/vmwareSites/machines/read | Gets the properties of a VMware machines |
> | Microsoft.OffAzure/vmwareSites/machines/stop/action | Stops the VMware machines |
> | Microsoft.OffAzure/vmwareSites/machines/start/action | Start VMware machines |
> | Microsoft.OffAzure/vmwareSites/machines/applications/read | Gets the properties of a VMware machines applications |
> | Microsoft.OffAzure/vmwareSites/machines/softwareinventory/read | Gets VMware machine software inventory data |
> | Microsoft.OffAzure/vmwareSites/operationsstatus/read | Gets the properties of a VMware operation status |
> | Microsoft.OffAzure/vmwareSites/runasaccounts/read | Gets the properties of a VMware run as accounts |
> | Microsoft.OffAzure/vmwareSites/summary/read | Gets the summary of a VMware site |
> | Microsoft.OffAzure/vmwareSites/usage/read | Gets the usages of a VMware site |
> | Microsoft.OffAzure/vmwareSites/vcenters/read | Gets the properties of a VMware vCenter |
> | Microsoft.OffAzure/vmwareSites/vcenters/write | Creates or updates the VMware vCenter |
> | Microsoft.OffAzure/vmwareSites/vcenters/delete | Delete previously added Vcenter |

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)