---
title: Migration resource provider operations include file
description: Migration resource provider operations include file
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.workload: identity
ms.topic: include
ms.date: 06/01/2023
ms.author: rolyon
ms.custom: generated
---

### Microsoft.Migrate

Azure service: [Azure Migrate](../../../migrate/migrate-services-overview.md)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Migrate/register/action | Subscription Registration Action |
> | Microsoft.Migrate/register/action | Registers Subscription with Microsoft.Migrate resource provider |
> | Microsoft.Migrate/unregister/action | Unregisters Subscription with Microsoft.Migrate resource provider |
> | Microsoft.Migrate/assessmentprojects/read | Gets the properties of assessment project |
> | Microsoft.Migrate/assessmentprojects/write | Creates a new assessment project or updates an existing assessment project |
> | Microsoft.Migrate/assessmentprojects/delete | Deletes the assessment project |
> | Microsoft.Migrate/assessmentprojects/startreplicationplanner/action | Initiates replication planner for the set of resources included in the request body |
> | Microsoft.Migrate/assessmentprojects/assessmentOptions/read | Gets the assessment options which are available in the given location |
> | Microsoft.Migrate/assessmentprojects/assessments/read | Lists assessments within a project |
> | Microsoft.Migrate/assessmentprojects/assessmentsSummary/read | Gets the assessments summary which are available in the given location |
> | Microsoft.Migrate/assessmentprojects/avsAssessmentOptions/read | Gets the AVS assessment options which are available in the given location |
> | Microsoft.Migrate/assessmentprojects/businesscases/comparesummary/action | Gets the compare summary of the business case |
> | Microsoft.Migrate/assessmentprojects/businesscases/read | Gets the properties of a business case |
> | Microsoft.Migrate/assessmentprojects/businesscases/report/action | Downloads a Business Case report's URL |
> | Microsoft.Migrate/assessmentprojects/businesscases/write | Creates a new business case or updates an existing business case |
> | Microsoft.Migrate/assessmentprojects/businesscases/evaluatedmachines/read | Get the properties of an evaluated machine |
> | Microsoft.Migrate/assessmentprojects/businesscases/evaluatedsqlentities/read | Get the properties of an evaluated SQL entities |
> | Microsoft.Migrate/assessmentprojects/businesscases/evaluatedwebapps/read | Get the properties of an Evaluated Webapp  |
> | Microsoft.Migrate/assessmentprojects/businesscases/iaassummaries/read | Gets the IaaS summary of the business case |
> | Microsoft.Migrate/assessmentprojects/businesscases/overviewsummaries/read | Gets the overview summary of the business case |
> | Microsoft.Migrate/assessmentprojects/businesscases/paassummaries/read | Gets the PaaS summary of the business case |
> | Microsoft.Migrate/assessmentprojects/groups/read | Get the properties of a group |
> | Microsoft.Migrate/assessmentprojects/groups/write | Creates a new group or updates an existing group |
> | Microsoft.Migrate/assessmentprojects/groups/delete | Deletes a group |
> | Microsoft.Migrate/assessmentprojects/groups/updateMachines/action | Update group by adding or removing machines |
> | Microsoft.Migrate/assessmentprojects/groups/assessments/read | Gets the properties of an assessment |
> | Microsoft.Migrate/assessmentprojects/groups/assessments/write | Creates a new assessment or updates an existing assessment |
> | Microsoft.Migrate/assessmentprojects/groups/assessments/delete | Deletes an assessment |
> | Microsoft.Migrate/assessmentprojects/groups/assessments/downloadurl/action | Downloads an assessment report's URL |
> | Microsoft.Migrate/assessmentprojects/groups/assessments/assessedmachines/read | Get the properties of an assessed machine |
> | Microsoft.Migrate/assessmentprojects/groups/assessmentsSummary/read | Gets the Assessment summary of a group |
> | Microsoft.Migrate/assessmentprojects/groups/avsAssessments/read | Gets the properties of an AVS assessment |
> | Microsoft.Migrate/assessmentprojects/groups/avsAssessments/write | Creates a new AVS assessment or updates an existing AVS assessment |
> | Microsoft.Migrate/assessmentprojects/groups/avsAssessments/delete | Deletes an AVS assessment |
> | Microsoft.Migrate/assessmentprojects/groups/avsAssessments/downloadurl/action | Downloads an AVS assessment report's URL |
> | Microsoft.Migrate/assessmentprojects/groups/avsAssessments/avsassessedmachines/read | Get the properties of an AVS assessed machine |
> | Microsoft.Migrate/assessmentprojects/groups/sqlAssessments/read | Gets the properties of a SQL assessment |
> | Microsoft.Migrate/assessmentprojects/groups/sqlAssessments/write | Creates a new SQL assessment or updates an existing SQL assessment |
> | Microsoft.Migrate/assessmentprojects/groups/sqlAssessments/delete | Deletes a SQL assessment |
> | Microsoft.Migrate/assessmentprojects/groups/sqlAssessments/downloadurl/action | Downloads a SQL assessment report's URL |
> | Microsoft.Migrate/assessmentprojects/groups/sqlAssessments/assessedSqlDatabases/read | Get the properties of assessed SQL databses |
> | Microsoft.Migrate/assessmentprojects/groups/sqlAssessments/assessedSqlInstances/read | Get the properties of assessed SQL instances |
> | Microsoft.Migrate/assessmentprojects/groups/sqlAssessments/assessedSqlMachines/read | Get the properties of assessed SQL machines |
> | Microsoft.Migrate/assessmentprojects/groups/sqlAssessments/recommendedAssessedEntities/read | Get the properties of recommended assessed entity |
> | Microsoft.Migrate/assessmentprojects/groups/sqlAssessments/summaries/read | Gets Sql Assessment summary of group |
> | Microsoft.Migrate/assessmentprojects/groups/webappAssessments/downloadurl/action | Downloads WebApp assessment report's URL |
> | Microsoft.Migrate/assessmentprojects/groups/webappAssessments/read | Gets the properties of a WebApp assessment |
> | Microsoft.Migrate/assessmentprojects/groups/webappAssessments/write | Creates a new WebApp assessment or updates an existing WebApp assessment |
> | Microsoft.Migrate/assessmentprojects/groups/webappAssessments/delete | Deletes a WebApp assessment |
> | Microsoft.Migrate/assessmentprojects/groups/webappAssessments/assessedwebApps/read | Get the properties of assessed WebApps |
> | Microsoft.Migrate/assessmentprojects/groups/webappAssessments/webappServicePlans/read | Get the properties of WebApp service plan |
> | Microsoft.Migrate/assessmentprojects/hypervcollectors/read | Gets the properties of HyperV collector |
> | Microsoft.Migrate/assessmentprojects/hypervcollectors/write | Creates a new HyperV collector or updates an existing HyperV collector |
> | Microsoft.Migrate/assessmentprojects/hypervcollectors/delete | Deletes the HyperV collector |
> | Microsoft.Migrate/assessmentprojects/importcollectors/read | Gets the properties of Import collector |
> | Microsoft.Migrate/assessmentprojects/importcollectors/write | Creates a new Import collector or updates an existing Import collector |
> | Microsoft.Migrate/assessmentprojects/importcollectors/delete | Deletes the Import collector |
> | Microsoft.Migrate/assessmentprojects/machines/read | Gets the properties of a machine |
> | Microsoft.Migrate/assessmentprojects/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.Migrate/assessmentprojects/privateEndpointConnectionProxies/validate/action | Validate a Private Endpoint Connection Proxy |
> | Microsoft.Migrate/assessmentprojects/privateEndpointConnectionProxies/write | Create or Update a Private Endpoint Connection Proxy |
> | Microsoft.Migrate/assessmentprojects/privateEndpointConnectionProxies/delete | Delete a Private Endpoint Connection Proxy |
> | Microsoft.Migrate/assessmentprojects/privateEndpointConnections/read | Get Private Endpoint Connection |
> | Microsoft.Migrate/assessmentprojects/privateEndpointConnections/write | Update a Private Endpoint Connection |
> | Microsoft.Migrate/assessmentprojects/privateEndpointConnections/delete | Delete a Private Endpoint Connection |
> | Microsoft.Migrate/assessmentprojects/privateLinkResources/read | Get Private Link Resource |
> | Microsoft.Migrate/assessmentprojects/projectsummary/read | Gets the properties of project summary |
> | Microsoft.Migrate/assessmentprojects/replicationplannerjobs/read | Gets the properties of an replication planner jobs |
> | Microsoft.Migrate/assessmentprojects/servercollectors/read | Gets the properties of Server collector |
> | Microsoft.Migrate/assessmentprojects/servercollectors/write | Creates a new Server collector or updates an existing Server collector |
> | Microsoft.Migrate/assessmentprojects/sqlAssessmentOptions/read | Gets the SQL assessment options which are available in the given location |
> | Microsoft.Migrate/assessmentprojects/sqlcollectors/read | Gets the properties of SQL collector |
> | Microsoft.Migrate/assessmentprojects/sqlcollectors/write | Creates a new SQL collector or updates an existing SQL collector |
> | Microsoft.Migrate/assessmentprojects/sqlcollectors/delete | Deletes the SQL collector |
> | Microsoft.Migrate/assessmentprojects/vmwarecollectors/read | Gets the properties of VMware collector |
> | Microsoft.Migrate/assessmentprojects/vmwarecollectors/write | Creates a new VMware collector or updates an existing VMware collector |
> | Microsoft.Migrate/assessmentprojects/vmwarecollectors/delete | Deletes the VMware collector |
> | Microsoft.Migrate/assessmentprojects/webAppAssessmentOptions/read | Gets the WebApp assessment options which are available in the given location |
> | Microsoft.Migrate/assessmentprojects/webappcollectors/read | Gets the properties of Webapp collector |
> | Microsoft.Migrate/assessmentprojects/webappcollectors/write | Creates a new Webapp collector or updates an existing Webapp collector |
> | Microsoft.Migrate/assessmentprojects/webappcollectors/delete | Deletes the Webapp collector |
> | Microsoft.Migrate/locations/checknameavailability/action | Checks availability of the resource name for the given subscription in the given location |
> | Microsoft.Migrate/locations/assessmentOptions/read | Gets the assessment options which are available in the given location |
> | Microsoft.Migrate/locations/rmsOperationResults/read | Gets the status of the subscription wide location based operation |
> | Microsoft.Migrate/migrateprojects/read | Gets the properties of migrate project |
> | Microsoft.Migrate/migrateprojects/write | Creates a new migrate project or updates an existing migrate project |
> | Microsoft.Migrate/migrateprojects/delete | Deletes a migrate project |
> | Microsoft.Migrate/migrateprojects/registerTool/action | Registers tool to a migrate project |
> | Microsoft.Migrate/migrateprojects/RefreshSummary/action | Refreshes the migrate project summary |
> | Microsoft.Migrate/migrateprojects/registrationDetails/action | Provides the tool registration details |
> | Microsoft.Migrate/migrateprojects/DatabaseInstances/read | Gets the properties of a database instance |
> | Microsoft.Migrate/migrateprojects/Databases/read | Gets the properties of a database |
> | Microsoft.Migrate/migrateprojects/machines/read | Gets the properties of a machine |
> | Microsoft.Migrate/migrateprojects/MigrateEvents/read | Gets the properties of a migrate events. |
> | Microsoft.Migrate/migrateprojects/MigrateEvents/Delete | Deletes a migrate event |
> | Microsoft.Migrate/migrateprojects/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.Migrate/migrateprojects/privateEndpointConnectionProxies/validate/action | Validate a Private Endpoint Connection Proxy |
> | Microsoft.Migrate/migrateprojects/privateEndpointConnectionProxies/write | Create or Update a Private Endpoint Connection Proxy |
> | Microsoft.Migrate/migrateprojects/privateEndpointConnectionProxies/delete | Delete a Private Endpoint Connection Proxy |
> | Microsoft.Migrate/migrateprojects/privateEndpointConnections/read | Get Private Endpoint Connection |
> | Microsoft.Migrate/migrateprojects/privateEndpointConnections/write | Update a Private Endpoint Connection |
> | Microsoft.Migrate/migrateprojects/privateEndpointConnections/delete | Delete a Private Endpoint Connection |
> | Microsoft.Migrate/migrateprojects/privateLinkResources/read | Get Private Link Resource |
> | Microsoft.Migrate/migrateprojects/solutions/read | Gets the properties of migrate project solution |
> | Microsoft.Migrate/migrateprojects/solutions/write | Creates a new migrate project solution or updates an existing migrate project solution |
> | Microsoft.Migrate/migrateprojects/solutions/Delete | Deletes a  migrate project solution |
> | Microsoft.Migrate/migrateprojects/solutions/getconfig/action | Gets the migrate project solution configuration |
> | Microsoft.Migrate/migrateprojects/solutions/cleanupData/action | Clean up the migrate project solution data |
> | Microsoft.Migrate/migrateprojects/VirtualDesktopUsers/read | Gets the properties of a virtual desktop user |
> | Microsoft.Migrate/migrateprojects/WebServers/read | Gets the properties of a web server |
> | Microsoft.Migrate/migrateprojects/WebSites/read | Gets the properties of a web site |
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
> | Microsoft.Migrate/Operations/read | Lists operations available on Microsoft.Migrate resource provider |
> | Microsoft.Migrate/projects/read | Gets the properties of a project |
> | Microsoft.Migrate/projects/write | Creates a new project or updates an existing project |
> | Microsoft.Migrate/projects/delete | Deletes the project |
> | Microsoft.Migrate/projects/keys/action | Gets shared keys for the project |
> | Microsoft.Migrate/projects/assessments/read | Lists assessments within a project |
> | Microsoft.Migrate/projects/groups/read | Get the properties of a group |
> | Microsoft.Migrate/projects/groups/write | Creates a new group or updates an existing group |
> | Microsoft.Migrate/projects/groups/delete | Deletes a group |
> | Microsoft.Migrate/projects/groups/assessments/read | Gets the properties of an assessment |
> | Microsoft.Migrate/projects/groups/assessments/write | Creates a new assessment or updates an existing assessment |
> | Microsoft.Migrate/projects/groups/assessments/delete | Deletes an assessment |
> | Microsoft.Migrate/projects/groups/assessments/downloadurl/action | Downloads an assessment report's URL |
> | Microsoft.Migrate/projects/groups/assessments/assessedmachines/read | Get the properties of an assessed machine |
> | Microsoft.Migrate/projects/machines/read | Gets the properties of a machine |
> | Microsoft.Migrate/resourcetypes/read | Gets the resource types |

### Microsoft.OffAzure

Azure service: [Azure Migrate](../../../migrate/migrate-services-overview.md)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.OffAzure/register/action | Subscription Registration Action |
> | Microsoft.OffAzure/unregister/action | Unregisters Subscription with Microsoft.Migrate resource provider |
> | Microsoft.OffAzure/register/action | Registers Subscription with Microsoft.OffAzure resource provider |
> | Microsoft.OffAzure/HyperVSites/read | Gets the properties of a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/write | Creates or updates the Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/delete | Deletes the Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/refresh/action | Refreshes the objects within a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/updateProperties/action | Updates the properties for machines in a site |
> | Microsoft.OffAzure/HyperVSites/clientGroupMembers/action | Generates client group members view with dependency map data |
> | Microsoft.OffAzure/HyperVSites/exportApplications/action | Export the Applications, roles and features of HyperV site machine inventory |
> | Microsoft.OffAzure/HyperVSites/exportDependencies/action | Export the machine Dependency map information of entire HyperV site machine inventory |
> | Microsoft.OffAzure/HyperVSites/exportMachineErrors/action | Export machine errors for the entire HyperV site machine inventory |
> | Microsoft.OffAzure/HyperVSites/generateCoarseMap/action | Generates coarse map for the list of machines |
> | Microsoft.OffAzure/HyperVSites/generateDetailedMap/action | Generate details HyperV coarse map |
> | Microsoft.OffAzure/HyperVSites/serverGroupMembers/action | Lists the server group members for the selected server group. |
> | Microsoft.OffAzure/HyperVSites/updateDependencyMapStatus/action | Toggle dependency map switch of a list of machines |
> | Microsoft.OffAzure/HyperVSites/clusters/read | Gets the properties of a Hyper-V cluster |
> | Microsoft.OffAzure/HyperVSites/clusters/write | Creates or updates the Hyper-V cluster |
> | Microsoft.OffAzure/HyperVSites/errorSummary/read | Gets the error summaries of all the HyperV Site resource inventory |
> | Microsoft.OffAzure/HyperVSites/healthsummary/read | Gets the health summary for Hyper-V resource |
> | Microsoft.OffAzure/HyperVSites/hosts/read | Gets the properties of a Hyper-V host |
> | Microsoft.OffAzure/HyperVSites/hosts/write | Creates or updates the Hyper-V host |
> | Microsoft.OffAzure/HyperVSites/jobs/read | Gets the properties of a Hyper-V jobs |
> | Microsoft.OffAzure/HyperVSites/machines/read | Gets the properties of a Hyper-V machines |
> | Microsoft.OffAzure/HyperVSites/machines/applications/read | Get properties of HyperV machine application |
> | Microsoft.OffAzure/HyperVSites/machines/softwareinventory/read | Gets HyperV machine software inventory data |
> | Microsoft.OffAzure/HyperVSites/operationsstatus/read | Gets the properties of a Hyper-V operation status |
> | Microsoft.OffAzure/HyperVSites/runasaccounts/read | Gets the properties of a Hyper-V run as accounts |
> | Microsoft.OffAzure/HyperVSites/summary/read | Gets the summary of a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/usage/read | Gets the usages of a Hyper-V site |
> | Microsoft.OffAzure/ImportSites/read | Gets the properties of a Import site |
> | Microsoft.OffAzure/ImportSites/write | Creates or updates the Import site |
> | Microsoft.OffAzure/ImportSites/delete | Deletes the Import site |
> | Microsoft.OffAzure/ImportSites/importuri/action | Gets the SAS uri for importing the machines CSV file. |
> | Microsoft.OffAzure/ImportSites/exporturi/action | Gets the SAS uri for exporting the machines CSV file. |
> | Microsoft.OffAzure/ImportSites/jobs/read | Gets the properties of a Import jobs |
> | Microsoft.OffAzure/ImportSites/machines/read | Gets the properties of a Import machines |
> | Microsoft.OffAzure/ImportSites/machines/delete | Deletes the Import machine |
> | Microsoft.OffAzure/locations/operationResults/read | Locations Operation Results |
> | Microsoft.OffAzure/MasterSites/read | Gets the properties of a Master site |
> | Microsoft.OffAzure/MasterSites/write | Creates or updates the Master site |
> | Microsoft.OffAzure/MasterSites/delete | Deletes the Master site |
> | Microsoft.OffAzure/MasterSites/applianceRegistrationInfo/action | Register an Appliances Under A Master Site |
> | Microsoft.OffAzure/MasterSites/errorSummary/action | Retrieves Error Summary For Resources Under A Given Master Site |
> | Microsoft.OffAzure/MasterSites/operationsstatus/read | Gets the properties of a Master site operation status |
> | Microsoft.OffAzure/MasterSites/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.OffAzure/MasterSites/privateEndpointConnectionProxies/validate/action | Validate a Private Endpoint Connection Proxy |
> | Microsoft.OffAzure/MasterSites/privateEndpointConnectionProxies/write | Create or Update a Private Endpoint Connection Proxy |
> | Microsoft.OffAzure/MasterSites/privateEndpointConnectionProxies/delete | Delete a Private Endpoint Connection Proxy |
> | Microsoft.OffAzure/MasterSites/privateEndpointConnectionProxies/operationsstatus/read | Get status of a long running operation on a Private Endpoint Connection Proxy |
> | Microsoft.OffAzure/MasterSites/privateEndpointConnections/read | Get Private Endpoint Connection |
> | Microsoft.OffAzure/MasterSites/privateEndpointConnections/write | Update a Private Endpoint Connection |
> | Microsoft.OffAzure/MasterSites/privateEndpointConnections/delete | Delete a Private Endpoint Connection |
> | Microsoft.OffAzure/MasterSites/privateLinkResources/read | Get Private Link Resource |
> | Microsoft.OffAzure/MasterSites/sqlSites/read | Gets the Sql Site |
> | Microsoft.OffAzure/MasterSites/sqlSites/write | Creates or Updates a Sql Site |
> | Microsoft.OffAzure/MasterSites/sqlSites/delete | Deleta a Sql Site |
> | Microsoft.OffAzure/MasterSites/sqlSites/refresh/action | Refreshes data for Sql Site |
> | Microsoft.OffAzure/MasterSites/sqlSites/discoverySiteDataSources/read | Gets the Sql Discovery Site Data Source |
> | Microsoft.OffAzure/MasterSites/sqlSites/discoverySiteDataSources/write | Creates or Updates the Sql Discovery Site Data Source |
> | Microsoft.OffAzure/MasterSites/sqlSites/operationsStatus/read | Gets Sql Operation Status |
> | Microsoft.OffAzure/MasterSites/sqlSites/runAsAccounts/read | Gets Sql Run as Accounts for a given site |
> | Microsoft.OffAzure/MasterSites/sqlSites/sqlAvailabilityGroups/read | Gets Sql Availability Groups for a given site |
> | Microsoft.OffAzure/MasterSites/sqlSites/sqlDatabases/read | Gets Sql Database for a given site |
> | Microsoft.OffAzure/MasterSites/sqlSites/sqlServers/read | Gets the Sql Servers for a given site |
> | Microsoft.OffAzure/MasterSites/webAppSites/read | Gets the properties of a WebApp site |
> | Microsoft.OffAzure/MasterSites/webAppSites/write | Creates or updates the WebApp site |
> | Microsoft.OffAzure/MasterSites/webAppSites/delete | Deletes the WebApp site |
> | Microsoft.OffAzure/MasterSites/webAppSites/Refresh/action | Refresh Web App For A Given Site |
> | Microsoft.OffAzure/MasterSites/webAppSites/UpdateProperties/action | Create or Update Web App Properties for a given site |
> | Microsoft.OffAzure/MasterSites/webAppSites/DiscoverySiteDataSources/read | Gets Web App Discovery Site Data Source For A Given Site |
> | Microsoft.OffAzure/MasterSites/webAppSites/DiscoverySiteDataSources/write | Create or Update Web App Discovery Site Data Source For A Given Site |
> | Microsoft.OffAzure/MasterSites/webAppSites/ExtendedMachines/read | Get Web App Extended Machines For A Given Site |
> | Microsoft.OffAzure/MasterSites/webAppSites/IISWebApplications/read | Gets the properties of IIS Web applications. |
> | Microsoft.OffAzure/MasterSites/webAppSites/IISWebServers/read | Gets the properties of IIS Web servers. |
> | Microsoft.OffAzure/MasterSites/webAppSites/RunAsAccounts/read | Get Web App Run As Accounts For A Given Site |
> | Microsoft.OffAzure/MasterSites/webAppSites/TomcatWebApplications/read | Get TomCat Web Applications |
> | Microsoft.OffAzure/MasterSites/webAppSites/TomcatWebServers/read | Get TomCat Web Servers for a given site |
> | Microsoft.OffAzure/MasterSites/webAppSites/WebApplications/read | Gets Web App Applications for a given site |
> | Microsoft.OffAzure/MasterSites/webAppSites/WebServers/read | Gets Web App Web Servers |
> | Microsoft.OffAzure/Operations/read | Reads the exposed operations |
> | Microsoft.OffAzure/ServerSites/read | Gets the properties of a Server site |
> | Microsoft.OffAzure/ServerSites/write | Creates or updates the Server site |
> | Microsoft.OffAzure/ServerSites/delete | Deletes the Server site |
> | Microsoft.OffAzure/ServerSites/refresh/action | Refreshes the objects within a Server site |
> | Microsoft.OffAzure/ServerSites/updateProperties/action | Updates the properties for machines in a site |
> | Microsoft.OffAzure/ServerSites/updateTags/action | Updates the tags for machines in a site |
> | Microsoft.OffAzure/ServerSites/clientGroupMembers/action | Generate client group members view with dependency map data |
> | Microsoft.OffAzure/ServerSites/exportApplications/action | Export Applications, Roles and Features of Server Site Inventory |
> | Microsoft.OffAzure/ServerSites/exportDependencies/action | Export the machine Dependency map information of entire Server site machine inventory |
> | Microsoft.OffAzure/ServerSites/exportMachineErrors/action | Export machine errors for the entire Server site machine inventory |
> | Microsoft.OffAzure/ServerSites/generateCoarseMap/action | Generate Coarse map for the list of machines |
> | Microsoft.OffAzure/ServerSites/generateDetailedMap/action | Generate detailed coarse map for the list of machines |
> | Microsoft.OffAzure/ServerSites/serverGroupMembers/action | Generate server group members view with dependency map data |
> | Microsoft.OffAzure/ServerSites/updateDependencyMapStatus/action | Toggle dependency map data of a list of machines |
> | Microsoft.OffAzure/ServerSites/errorSummary/read | Get Error Summary for Server site inventory |
> | Microsoft.OffAzure/ServerSites/jobs/read | Gets the properties of a Server jobs |
> | Microsoft.OffAzure/ServerSites/machines/read | Gets the properties of a Server machines |
> | Microsoft.OffAzure/ServerSites/machines/write | Write the properties of a Server machines |
> | Microsoft.OffAzure/ServerSites/machines/delete | Delete the properties of a Server machines |
> | Microsoft.OffAzure/ServerSites/machines/applications/read | Get server machine installed applications, roles and features |
> | Microsoft.OffAzure/ServerSites/machines/softwareinventory/read | Gets Server machine software inventory data |
> | Microsoft.OffAzure/ServerSites/operationsstatus/read | Gets the properties of a Server operation status |
> | Microsoft.OffAzure/ServerSites/runasaccounts/read | Gets the properties of a Server run as accounts |
> | Microsoft.OffAzure/ServerSites/summary/read | Gets the summary of a Server site |
> | Microsoft.OffAzure/ServerSites/usage/read | Gets the usages of a Server site |
> | Microsoft.OffAzure/VMwareSites/read | Gets the properties of a VMware site |
> | Microsoft.OffAzure/VMwareSites/write | Creates or updates the VMware site |
> | Microsoft.OffAzure/VMwareSites/delete | Deletes the VMware site |
> | Microsoft.OffAzure/VMwareSites/refresh/action | Refreshes the objects within a VMware site |
> | Microsoft.OffAzure/VMwareSites/exportapplications/action | Exports the VMware applications and roles data into xls |
> | Microsoft.OffAzure/VMwareSites/updateProperties/action | Updates the properties for machines in a site |
> | Microsoft.OffAzure/VMwareSites/updateTags/action | Updates the tags for machines in a site |
> | Microsoft.OffAzure/VMwareSites/generateCoarseMap/action | Generates the coarse map for the list of machines |
> | Microsoft.OffAzure/VMwareSites/generateDetailedMap/action | Generates the Detailed VMware Coarse Map |
> | Microsoft.OffAzure/VMwareSites/clientGroupMembers/action | Lists the client group members for the selected client group. |
> | Microsoft.OffAzure/VMwareSites/serverGroupMembers/action | Lists the server group members for the selected server group. |
> | Microsoft.OffAzure/VMwareSites/getApplications/action | Gets the list application information for the selected machines |
> | Microsoft.OffAzure/VMwareSites/exportDependencies/action | Exports the dependencies information for the selected machines |
> | Microsoft.OffAzure/VMwareSites/exportMachineerrors/action | Export machine errors for the entire VMware site machine inventory |
> | Microsoft.OffAzure/VMwareSites/updateDependencyMapStatus/action | Toggle dependency map data of a list of machines |
> | Microsoft.OffAzure/VMwareSites/errorSummary/read | Get Error Summary for VMware site inventory |
> | Microsoft.OffAzure/VMwareSites/healthsummary/read | Gets the health summary for VMware resource |
> | Microsoft.OffAzure/VMwareSites/hosts/read | Gets the properties of a VMware hosts |
> | Microsoft.OffAzure/VMwareSites/jobs/read | Gets the properties of a VMware jobs |
> | Microsoft.OffAzure/VMwareSites/machines/read | Gets the properties of a VMware machines |
> | Microsoft.OffAzure/VMwareSites/machines/stop/action | Stops the VMware machines |
> | Microsoft.OffAzure/VMwareSites/machines/start/action | Start VMware machines |
> | Microsoft.OffAzure/VMwareSites/machines/applications/read | Gets the properties of a VMware machines applications |
> | Microsoft.OffAzure/VMwareSites/machines/softwareinventory/read | Gets VMware machine software inventory data |
> | Microsoft.OffAzure/VMwareSites/operationsstatus/read | Gets the properties of a VMware operation status |
> | Microsoft.OffAzure/VMwareSites/runasaccounts/read | Gets the properties of a VMware run as accounts |
> | Microsoft.OffAzure/VMwareSites/summary/read | Gets the summary of a VMware site |
> | Microsoft.OffAzure/VMwareSites/usage/read | Gets the usages of a VMware site |
> | Microsoft.OffAzure/VMwareSites/vcenters/read | Gets the properties of a VMware vCenter |
> | Microsoft.OffAzure/VMwareSites/vcenters/write | Creates or updates the VMware vCenter |
> | Microsoft.OffAzure/VMwareSites/vcenters/delete | Delete previously added Vcenter |
