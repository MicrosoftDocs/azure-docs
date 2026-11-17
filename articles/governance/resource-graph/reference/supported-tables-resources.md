---
title: Supported Azure Resource Manager resource types
description: Provide a list of the Azure Resource Manager resource types supported by Azure Resource Graph and Change History.
ms.date: 11/10/2026
ms.topic: reference
ms.custom: generated
---
# Azure Resource Graph table and resource type reference

Azure Resource Graph supports the following **resource types** of
[Azure Resource Manager](../../../azure-resource-manager/management/overview.md). Each **resource type** is
part of a **table** in Resource Graph.

> [!NOTE]
> Azure Resource Graph scrubs PII information from our tables so you may see not see the same result as if you made a GET request on your resource directly. The difference is due to security practices preventing the exposure of any identifiable information. 

## advisorresources

For sample queries for this table, see [Resource Graph sample queries for advisorresources](../samples/samples-by-table.md#advisorresources).

- microsoft.advisor/assessments
- microsoft.advisor/configurations
- microsoft.advisor/recommendations
  - Sample query: [Get cost savings summary from Azure Advisor](../samples/samples-by-category.md#get-cost-savings-summary-from-azure-advisor)
  - Sample query: [List Arc-enabled servers not running latest released agent version](../samples/samples-by-category.md#list-arc-enabled-servers-not-running-latest-released-agent-version)
- microsoft.advisor/recommendations/suppressions
- microsoft.advisor/resiliencyreviews
- microsoft.advisor/suppressions
- microsoft.advisor/triagerecommendations
- microsoft.advisor/triageresources
- microsoft.advisor/advisorscore
- microsoft.advisor/advisorscore/category
- microsoft.advisor/advisorscore/category/subcategoryweightage
- microsoft.advisor/advisorscore/subcategoryweightage
- microsoft.advisor/criticalresources
- microsoft.advisor/discoverableworkloads
- microsoft.advisor/insights
- microsoft.advisor/metadata
- microsoft.advisor/risks
- microsoft.advisor/risktypes
- microsoft.advisor/servicegroupintelligence
- microsoft.advisor/subcategoryweightage
- microsoft.advisor/workloadresourcemappings

## aksresources

- microsoft.containerservice/fleets/autoupgradeprofiles
- microsoft.containerservice/fleets/members
- microsoft.containerservice/fleets/updateruns
- microsoft.containerservice/fleets/updatestrategies
- microsoft.containerservice/fleetmemberships
- microsoft.containerservice/fleets/clustermeshprofiles
- microsoft.containerservice/fleets/gates

## alertsmanagementresources

- microsoft.alertsmanagement/alerts

## apicenterresources

- microsoft.apicenter/services/workspaces/apis
- microsoft.apicenter/services/workspaces/apis/versions
- microsoft.apicenter/services/workspaces/apis/versions/definitions

## appserviceresources

- microsoft.web/sites/config
- microsoft.web/sites/slots/config
- microsoft.web/sites/workflows

## authorizationresources

- microsoft.authorization/classicadministrators
- microsoft.authorization/roleassignments
- microsoft.authorization/roledefinitions

## awsresources

- microsoft.awsconnector/ec2instances
- microsoft.awsconnector/eksclusters

## azurebusinesscontinuityresources

- microsoft.azurebusinesscontinuity/deletedunifiedprotecteditems
- microsoft.azurebusinesscontinuity/unifiedprotecteditems

## azuredevopsplatformresources

- microsoft.azuredevopsplatform/organizations

## batchresources

- microsoft.batch/batchaccounts/pools

## capabilityresources

- microsoft.resources/capabilities

## changesafetyresources

- microsoft.changesafety/changeactivityevents
- microsoft.changesafety/changerecords
- microsoft.changesafety/changerecords/stageprogressions
- microsoft.changesafety/changestates
- microsoft.changesafety/changestates/stageprogressions
- microsoft.changesafety/saferollouts
- microsoft.changesafety/saferollouts/stages
- microsoft.changesafety/stagemaps
- microsoft.changesafety/validations

## chaosresources

- microsoft.chaos/experiments/executions
- microsoft.chaos/experiments/statuses
- microsoft.chaos/targets
- microsoft.chaos/targets/capabilities

## cognitiveservicesresources

- microsoft.cognitiveservices/accounts/connections
- microsoft.cognitiveservices/accounts/projects/connections

## communitygalleryresources

- microsoft.compute/locations/communitygalleries
- microsoft.compute/locations/communitygalleries/applications
- microsoft.compute/locations/communitygalleries/applications/versions
- microsoft.compute/locations/communitygalleries/images
- microsoft.compute/locations/communitygalleries/images/versions
- microsoft.compute/galleries/softdeletedartifacttypes/artifacts/versions

## computeartifactresources

- microsoft.compute/galleries/softdeletedartifacttypes/artifacts/versions

## computeresources

- microsoft.compute/virtualmachinescalesets/virtualmachines
- microsoft.compute/virtualmachinescalesets/virtualmachines/networkinterfaces
- microsoft.compute/virtualmachinescalesets/virtualmachines/networkinterfaces/ipconfigurations/publicipaddresses

## containerserviceeventresources

- microsoft.containerservice/managedclusters/scheduledevents

## deploymentresourcechanges

- microsoft.resources/changes

## deploymentresources

- microsoft.resources/deploymentstacks

## desktopvirtualizationresources

- microsoft.desktopvirtualization/hostpools/sessionhosts
- microsoft.decisionworkflows/requests

## dnsresources

- microsoft.network/dnszones/a
- microsoft.network/dnszones/aaaa
- microsoft.network/dnszones/cname
- microsoft.network/dnszones/mx
- microsoft.network/dnszones/ptr
- microsoft.network/dnszones/soa
- microsoft.network/dnszones/srv
- microsoft.network/dnszones/txt
- microsoft.network/privatednszones/a
- microsoft.network/privatednszones/aaaa
- microsoft.network/privatednszones/cname
- microsoft.network/privatednszones/mx
- microsoft.network/privatednszones/ptr
- microsoft.network/privatednszones/soa
- microsoft.network/privatednszones/srv
- microsoft.network/privatednszones/txt
- microsoft.network/dnsforwardingrulesets/forwardingrules
- microsoft.network/dnsforwardingrulesets/virtualnetworklinks
- microsoft.network/dnszones/caa
- microsoft.network/dnszones/ds
- microsoft.network/dnszones/https
- microsoft.network/dnszones/naptr
- microsoft.network/dnszones/ns
- microsoft.network/dnszones/svcb
- microsoft.network/dnszones/tlsa

## edgeorderresources

- microsoft.edgeorder/orders

## elasticsanresources

- microsoft.elasticsan/elasticsans
- microsoft.elasticsan/elasticsans/volumegroups
- microsoft.elasticsan/elasticsans/volumegroups/volumes

## extendedlocationresources

For sample queries for this table, see [Resource Graph sample queries for extendedlocationresources](../samples/samples-by-table.md#extendedlocationresources).

- microsoft.extendedlocation/customlocations/enabledresourcetypes
  - Sample query: [Get enabled resource types for Azure Arc-enabled custom locations](../samples/samples-by-category.md#get-enabled-resource-types-for-azure-arc-enabled-custom-locations)
  - Sample query: [List Azure Arc-enabled custom locations with VMware or SCVMM enabled](../samples/samples-by-category.md#list-azure-arc-enabled-custom-locations-with-vmware-or-scvmm-enabled)

## extensibilityresourcechanges

- microsoft.resources/changes

## featureresources

- microsoft.features/featureprovidernamespaces/featureconfigurations
- microsoft.features/featureproviders/subscriptionfeatureregistrations

## gcpresources

- microsoft.gcpconnector/computeinstances
- microsoft.gcpconnector/containerclusters

## guestconfigurationresources

For sample queries for this table, see [Resource Graph sample queries for guestconfigurationresources](../samples/samples-by-table.md#guestconfigurationresources).

- microsoft.guestconfiguration/guestconfigurationassignments
  - Sample query: [Count machines in scope of guest configuration policies](../samples/samples-by-category.md#count-machines-in-scope-of-guest-configuration-policies)
  - Sample query: [Count of non-compliant guest configuration assignments](../samples/samples-by-category.md#count-of-non-compliant-guest-configuration-assignments)
  - Sample query: [Find all reasons a machine is non-compliant for guest configuration assignments](../samples/samples-by-category.md#find-all-reasons-a-machine-is-non-compliant-for-guest-configuration-assignments)
- microsoft.guestconfiguration/guestconfigurationassignments/reports
- microsoft.guestconfiguration/applications
- microsoft.guestconfiguration/certificates
- microsoft.guestconfiguration/daemons
- microsoft.guestconfiguration/devicecollections
- microsoft.guestconfiguration/groups
- microsoft.guestconfiguration/services
- microsoft.guestconfiguration/softwares
- microsoft.guestconfiguration/users
- microsoft.guestconfiguration/windowsroles

## healthresourcechanges

- microsoft.resources/changes

## healthresources

For sample queries for this table, see [Resource Graph sample queries for healthresources](../samples/samples-by-table.md#healthresources).

- microsoft.resourcehealth/availabilitystatuses
  - Sample query: [Count of virtual machines by availability state and Subscription ID](../samples/samples-by-category.md#count-of-virtual-machines-by-availability-state-and-subscription-id)
  - Sample query: [List of virtual machines and associated availability states by Resource IDs](../samples/samples-by-category.md#list-of-virtual-machines-and-associated-availability-states-by-resource-ids)
  - Sample query: [List of virtual machines by availability state and power state with Resource IDs and resource Groups](../samples/samples-by-category.md#list-of-virtual-machines-by-availability-state-and-power-state-with-resource-ids-and-resource-groups)
  - Sample query: [List of virtual machines that are not Available by Resource IDs](../samples/samples-by-category.md#list-of-virtual-machines-that-are-not-available-by-resource-ids)
- microsoft.resourcehealth/resourceannotations

## impactreportresources

- microsoft.impact/connectors
- microsoft.impact/workloadimpacts
- microsoft.impact/workloadimpacts/insights

## insightsresources

- microsoft.insights/datacollectionruleassociations
- microsoft.insights/platformlogsconfigurations
- microsoft.insights/tenantactiongroups

## iotsecurityresources

For sample queries for this table, see [Resource Graph sample queries for iotsecurityresources](../samples/samples-by-table.md#iotsecurityresources).

- microsoft.iotfirmwaredefense/firmwaregroups/firmwares
- microsoft.iotsecurity/locations/devicegroups/alerts
  - Sample query: [Get all New alerts from the past 30 days](../samples/samples-by-category.md#get-all-new-alerts-from-the-past-30-days)
- microsoft.iotsecurity/locations/devicegroups/devices
  - Sample query: [Count how many IoT Devices there are in your network, by operation system](../samples/samples-by-category.md#count-how-many-iot-devices-there-are-in-your-network-by-operation-system)
- microsoft.iotsecurity/locations/devicegroups/recommendations
  - Sample query: [Get all High severity recommendations](../samples/samples-by-category.md#get-all-high-severity-recommendations)
- microsoft.iotsecurity/locations/sites
- microsoft.iotsecurity/locations/sites/sensors
- microsoft.iotsecurity/onpremisesensors
- microsoft.iotsecurity/sensors
  - Sample query: [Count all sensors by type](../samples/samples-by-category.md#count-all-sensors-by-type)
- microsoft.iotsecurity/sites
  - Sample query: [List sites with a specific tag value](../samples/samples-by-category.md#list-sites-with-a-specific-tag-value)
- microsoft.iotfirmwaredefense/workspaces/firmwares
- microsoft.iotsecurity/locations/devicegroups/vulnerabilities

## kubernetesconfigurationresources

For sample queries for this table, see [Resource Graph sample queries for kubernetesconfigurationresources](../samples/samples-by-table.md#kubernetesconfigurationresources).

- microsoft.kubernetesconfiguration/extensions
  - Sample query: [List all Azure Arc-enabled Kubernetes clusters with Azure Monitor extension](../samples/samples-by-category.md#list-all-azure-arc-enabled-kubernetes-clusters-with-azure-monitor-extension)
  - Sample query: [List all Azure Arc-enabled Kubernetes clusters without Azure Monitor extension](../samples/samples-by-category.md#list-all-azure-arc-enabled-kubernetes-clusters-without-azure-monitor-extension)
- microsoft.kubernetesconfiguration/fluxconfigurations
- microsoft.kubernetesconfiguration/namespaces
- microsoft.kubernetesconfiguration/sourcecontrolconfigurations
- microsoft.kubernetesconfiguration/kubernetesresources
- microsoft.kubernetesconfiguration/upgradeassessments

## kustoresources

- microsoft.kusto/clusters/databases/dataconnections
- microsoft.kusto/clusters/databases
- microsoft.kusto/clusters/databases/principalassignments
- microsoft.kusto/clusters/databases/scripts
- microsoft.kusto/clusters/dataconnections
- microsoft.kusto/clusters/principalassignments

## machinesinventoryinsightsresources

- microsoft.offazure/hypervsites/machines/inventoryinsights
- microsoft.offazure/hypervsites/machines/inventoryinsights/pendingupdates
- microsoft.offazure/hypervsites/machines/inventoryinsights/software
- microsoft.offazure/hypervsites/machines/inventoryinsights/vulnerabilities
- microsoft.offazure/serversites/machines/inventoryinsights
- microsoft.offazure/serversites/machines/inventoryinsights/pendingupdates
- microsoft.offazure/serversites/machines/inventoryinsights/software
- microsoft.offazure/serversites/machines/inventoryinsights/vulnerabilities
- microsoft.offazure/serversites/machines/pendingupdates
- microsoft.offazure/serversites/machines/software
- microsoft.offazure/vmwaresites/machines/inventoryinsights
- microsoft.offazure/vmwaresites/machines/inventoryinsights/pendingupdates
- microsoft.offazure/vmwaresites/machines/inventoryinsights/software
- microsoft.offazure/vmwaresites/machines/inventoryinsights/vulnerabilities

## maintenanceresourcechanges

- microsoft.resources/changes

## maintenanceresources

- microsoft.containerservice/managedclusters/scheduledevents
- microsoft.maintenance/applyupdates
- microsoft.maintenance/configurationassignments
- microsoft.maintenance/maintenanceconfigurations/applyupdates
- microsoft.maintenance/updates
- microsoft.maintenance/computemrpresponse/applyupdates

## managedservicesresources

- microsoft.managedservices/registrationassignments
- microsoft.managedservices/registrationdefinitions

## metricresources

- microsoft.resourcenotifications/assets
- microsoft.resourcenotifications/devices/optics/ports
- microsoft.resourcenotifications/devices/optics/ports/statuses
- microsoft.resourcenotifications/dummy
- microsoft.resourcenotifications/metricnamespaces/metrics/samples
- microsoft.resourcenotifications/nodes
- microsoft.resourcenotifications/nodes/statuses
- microsoft.resourcenotifications/racks

## migrateresources

- microsoft.applicationmigration/codescanmappings
- microsoft.applicationmigration/codescansites/codescanreports
- microsoft.applicationmigration/codescansites/codescanreports/codescanissues
- microsoft.applicationmigration/connectionhubs/githubconnections
- microsoft.applicationmigration/connectionhubs/githubconnections/githubissues
- microsoft.applicationmigration/discoveryhubs/applications
- microsoft.applicationmigration/discoveryhubs/applications/members
- microsoft.applicationmigration/mongosites/agents
- microsoft.applicationmigration/mongosites/mongocollections
- microsoft.applicationmigration/mongosites/mongodatabases
- microsoft.applicationmigration/mongosites/mongoinstances
- microsoft.applicationmigration/oraclesites/oracleinstances
- microsoft.applicationmigration/pgsqlsites/agents
- microsoft.applicationmigration/pgsqlsites/pgsqldatabases
- microsoft.applicationmigration/pgsqlsites/pgsqlinstances
- microsoft.applicationmigration/storagesites/agents
- microsoft.applicationmigration/storagesites/fileshares
- microsoft.migrate/assessmentprojects/aksassessments
- microsoft.migrate/assessmentprojects/aksassessments/assessedwebapps
- microsoft.migrate/assessmentprojects/aksassessments/clusters
- microsoft.migrate/assessmentprojects/aksassessments/costdetails
- microsoft.migrate/assessmentprojects/aksassessments/summaries
- microsoft.migrate/assessmentprojects/applicationassessments
- microsoft.migrate/assessmentprojects/applicationassessments/assessedapplications
- microsoft.migrate/assessmentprojects/assessments
- microsoft.migrate/assessmentprojects/assessments/assessedmachines
- microsoft.migrate/assessmentprojects/assessments/summaries
- microsoft.migrate/assessmentprojects/avsassessments
- microsoft.migrate/assessmentprojects/avsassessments/avsassessedmachines
- microsoft.migrate/assessmentprojects/avsassessments/summaries
- microsoft.migrate/assessmentprojects/businesscases
- microsoft.migrate/assessmentprojects/castconnections
- microsoft.migrate/assessmentprojects/fileshareassessments
- microsoft.migrate/assessmentprojects/fileshareassessments/assessedfileshares
- microsoft.migrate/assessmentprojects/fileshareassessments/summaries
- microsoft.migrate/assessmentprojects/groups
- microsoft.migrate/assessmentprojects/groups/assessments
- microsoft.migrate/assessmentprojects/groups/assessments/assessedmachines
- microsoft.migrate/assessmentprojects/groups/avsassessments
- microsoft.migrate/assessmentprojects/groups/avsassessments/avsassessedmachines
- microsoft.migrate/assessmentprojects/groups/sqlassessments
- microsoft.migrate/assessmentprojects/groups/sqlassessments/assessedsqldatabases
- microsoft.migrate/assessmentprojects/groups/sqlassessments/assessedsqlinstances
- microsoft.migrate/assessmentprojects/groups/sqlassessments/assessedsqlmachines
- microsoft.migrate/assessmentprojects/groups/sqlassessments/recommendedassessedentities
- microsoft.migrate/assessmentprojects/groups/sqlassessments/summaries
- microsoft.migrate/assessmentprojects/groups/webappassessments
- microsoft.migrate/assessmentprojects/groups/webappassessments/assessedwebapps
- microsoft.migrate/assessmentprojects/groups/webappassessments/summaries
- microsoft.migrate/assessmentprojects/groups/webappassessments/webappserviceplans
- microsoft.migrate/assessmentprojects/heterogeneousassessments
- microsoft.migrate/assessmentprojects/heterogeneousassessments/summaries
- microsoft.migrate/assessmentprojects/machineassessments/assessedmachines
- microsoft.migrate/assessmentprojects/mongoassessments
- microsoft.migrate/assessmentprojects/mongoassessments/assessedinstances
- microsoft.migrate/assessmentprojects/mongoassessments/summaries
- microsoft.migrate/assessmentprojects/mysqlassessments
- microsoft.migrate/assessmentprojects/mysqlassessments/assessedinstances
- microsoft.migrate/assessmentprojects/mysqlassessments/summaries
- microsoft.migrate/assessmentprojects/pgsqlassessments
- microsoft.migrate/assessmentprojects/pgsqlassessments/assessedinstances
- microsoft.migrate/assessmentprojects/pgsqlassessments/summaries
- microsoft.migrate/assessmentprojects/sqlassessments
- microsoft.migrate/assessmentprojects/sqlassessments/assessedsqldatabases
- microsoft.migrate/assessmentprojects/sqlassessments/assessedsqlinstances
- microsoft.migrate/assessmentprojects/sqlassessments/assessedsqlmachines
- microsoft.migrate/assessmentprojects/sqlassessments/summaries
- microsoft.migrate/assessmentprojects/webappassessments
- microsoft.migrate/assessmentprojects/webappassessments/assessedwebapps
- microsoft.migrate/assessmentprojects/webappassessments/summaries
- microsoft.migrate/assessmentprojects/webappassessments/webappserviceplans
- microsoft.migrate/assessmentprojects/webappcompoundassessments
- microsoft.migrate/assessmentprojects/webappcompoundassessments/assessedwebapps
- microsoft.migrate/assessmentprojects/webappcompoundassessments/summaries
- microsoft.migrate/castscanreports
- microsoft.migrate/castscanreports/codescanissues
- microsoft.migrate/migrateprojects/migrationentities
- microsoft.migrate/migrateprojects/migrationentitygroups
- microsoft.migrate/migrateprojects/tasks
- microsoft.migrate/migrateprojects/waves
- microsoft.migrate/migrateprojects/waves/workloads
- microsoft.mysqldiscovery/mysqlsites/mysqlservers
- microsoft.offazure/hypervsites/clusters
- microsoft.offazure/hypervsites/hosts
- microsoft.offazure/hypervsites/machines
- microsoft.offazure/hypervsites/machines/softwareinventories
- microsoft.offazure/importsites/machines
- microsoft.offazure/mastersites/sqlsites/sqldatabases
- microsoft.offazure/mastersites/sqlsites/sqlservers
- microsoft.offazure/mastersites/webappsites/extendedmachines
- microsoft.offazure/mastersites/webappsites/iiswebapplications
- microsoft.offazure/mastersites/webappsites/iiswebservers
- microsoft.offazure/mastersites/webappsites/tomcatwebapplications
- microsoft.offazure/mastersites/webappsites/tomcatwebservers
- microsoft.offazure/serversites/machines
- microsoft.offazure/serversites/machines/softwareinventories
- microsoft.offazure/vmwaresites/hosts
- microsoft.offazure/vmwaresites/machines
- microsoft.offazure/vmwaresites/machines/softwareinventories
- microsoft.offazure/vmwaresites/vcenters
- microsoft.offazurespringboot/springbootsites/springbootapps
- microsoft.offazurespringboot/springbootsites/springbootservers

## monitorresources

- microsoft.monitor/accounts/issues
- microsoft.monitor/accounts/issues/relations
- microsoft.monitor/slis

## networkresourcechanges

- microsoft.resources/changes

## networkresources

- microsoft.network/effectiveconnectivityconfigurations
- microsoft.network/effectivesecurityadminrules
- microsoft.network/firewallpolicies/rulecollectiongroups
- microsoft.network/networkgroupmemberships
- microsoft.network/networkmanagerconnections
- microsoft.network/networkmanagers/connectivityconfigurations
- microsoft.network/networkmanagers/connectivityconfigurations/snapshots
- microsoft.network/networkmanagers/connectivityregionalgoalstates
- microsoft.network/networkmanagers/networkgroups
- microsoft.network/networkmanagers/networkgroups/members
- microsoft.network/networkmanagers/networkgroups/staticmembers
- microsoft.network/networkmanagers/regionalgoalstates
- microsoft.network/networkmanagers/routingconfigurations
- microsoft.network/networkmanagers/routingconfigurations/rulecollections
- microsoft.network/networkmanagers/routingconfigurations/rulecollections/rules
- microsoft.network/networkmanagers/routingconfigurations/rulecollections/rules/snapshots
- microsoft.network/networkmanagers/routingconfigurations/rulecollections/snapshots
- microsoft.network/networkmanagers/routingconfigurations/snapshots
- microsoft.network/networkmanagers/routingregionalgoalstates
- microsoft.network/networkmanagers/securityadminconfigurations
- microsoft.network/networkmanagers/securityadminconfigurations/rulecollections
- microsoft.network/networkmanagers/securityadminconfigurations/rulecollections/rules
- microsoft.network/networkmanagers/securityadminconfigurations/rulecollections/rules/snapshots
- microsoft.network/networkmanagers/securityadminconfigurations/rulecollections/snapshots
- microsoft.network/networkmanagers/securityadminconfigurations/snapshots
- microsoft.network/networkmanagers/securityadminregionalgoalstates
- microsoft.network/networkmanagers/securityuserconfigurations
- microsoft.network/networkmanagers/securityuserconfigurations/rulecollections
- microsoft.network/networkmanagers/securityuserconfigurations/rulecollections/rules
- microsoft.network/networkmanagers/securityuserconfigurations/rulecollections/rules/snapshots
- microsoft.network/networkmanagers/securityuserconfigurations/rulecollections/snapshots
- microsoft.network/networkmanagers/securityuserconfigurations/snapshots
- microsoft.network/networkmanagers/securityuserregionalgoalstates
- microsoft.network/networkmanagers/verifierworkspaces/reachabilityanalysisintents
- microsoft.network/networksecurityperimeters/linkreferences
- microsoft.network/networksecurityperimeters/links
- microsoft.network/networksecurityperimeters/profiles
- microsoft.network/networksecurityperimeters/profiles/accessrules
- microsoft.network/networksecurityperimeters/resourceassociations
- microsoft.network/rulecollectiongroups
- microsoft.network/virtualnetworks/subnets/effectiveroutingrules
- microsoft.network/virtualnetworks/subnets/effectivesecurityuserrules
- microsoft.network/dnsforwardingrulesets/forwardingrules
- microsoft.network/dnsforwardingrulesets/virtualnetworklinks
- microsoft.network/dnszones/https
- microsoft.network/dnszones/svcb
- microsoft.network/networkmanagers/networkgroups/aggregatedipaddressspaces
- microsoft.network/networksecurityperimeters/loggingconfigurations
- microsoft.network/networkwatchers/packetcaptures
- microsoft.networkresourceprovider/publicipaddress

## orbitalresources

- microsoft.orbital/spacecrafts/contacts

## patchassessmentresources

For sample queries for this table, see [Resource Graph sample queries for patchassessmentresources](../samples/samples-by-table.md#patchassessmentresources).

- microsoft.compute/virtualmachines/patchassessmentresults
- microsoft.compute/virtualmachines/patchassessmentresults/softwarepatches
- microsoft.connectedvmwarevsphere/virtualmachines/patchassessmentresults
- microsoft.connectedvmwarevsphere/virtualmachines/patchassessmentresults/softwarepatches
- microsoft.hybridcompute/machines/patchassessmentresults
- microsoft.hybridcompute/machines/patchassessmentresults/softwarepatches
- microsoft.compute/virtualmachinescalesets/virtualmachines/patchassessmentresults
- microsoft.compute/virtualmachinescalesets/virtualmachines/patchassessmentresults/softwarepatches

## patchinstallationresources

- microsoft.compute/virtualmachines/patchinstallationresults
- microsoft.compute/virtualmachines/patchinstallationresults/softwarepatches
- microsoft.connectedvmwarevsphere/virtualmachines/patchinstallationresults
- microsoft.connectedvmwarevsphere/virtualmachines/patchinstallationresults/softwarepatches
- microsoft.hybridcompute/machines/patchinstallationresults
- microsoft.hybridcompute/machines/patchinstallationresults/softwarepatches

## policyresources

For sample queries for this table, see [Resource Graph sample queries for policyresources](../samples/samples-by-table.md#policyresources).

- microsoft.authorization/policyassignments
- microsoft.authorization/policydefinitions
- microsoft.authorization/policydefinitions/versions
- microsoft.authorization/policyenrollments
- microsoft.authorization/policyexemptions
- microsoft.authorization/policysetdefinitions
- microsoft.authorization/policysetdefinitions/versions
- microsoft.policyinsights/componentpolicystates
- microsoft.policyinsights/policymetadata
- microsoft.policyinsights/policystates
  - Sample query: [Compliance by policy assignment](../samples/samples-by-category.md#compliance-by-policy-assignment)
  - Sample query: [Compliance by resource type](../samples/samples-by-category.md#compliance-by-resource-type)
  - Sample query: [List all non-compliant resources](../samples/samples-by-category.md#list-all-non-compliant-resources)
  - Sample query: [Summarize resource compliance by state](../samples/samples-by-category.md#summarize-resource-compliance-by-state)
  - Sample query: [Summarize resource compliance by state per location](../samples/samples-by-category.md#summarize-resource-compliance-by-state-per-location)

## quotaresourcechanges

- microsoft.resources/changes

## recoveryservicesresources

- microsoft.azurebusinesscontinuity/deletedunifiedprotecteditems
- microsoft.dataprotection/backupvaults/backupinstances
- microsoft.dataprotection/backupvaults/backupjobs
- microsoft.dataprotection/backupvaults/backuppolicies
- microsoft.dataprotection/backupvaults/deletedbackupinstances
- microsoft.recoveryservices/locations/deletedvaults
- microsoft.recoveryservices/locations/deletedvaults/backupfabrics/protectioncontainers/protecteditems
- microsoft.recoveryservices/vaults
- microsoft.recoveryservices/vaults/alerts
- microsoft.recoveryservices/vaults/backupfabrics/protectioncontainers/protectableitems
- microsoft.recoveryservices/vaults/backupfabrics/protectioncontainers/protecteditems
- microsoft.recoveryservices/vaults/backupjobs
- microsoft.recoveryservices/vaults/backuppolicies
- microsoft.recoveryservices/vaults/replicationfabrics/replicationprotectioncontainers/replicationprotecteditems
- microsoft.recoveryservices/vaults/replicationjobs
- microsoft.recoveryservices/vaults/replicationpolicies
- microsoft.recoveryservices/vaults/replicationrecoveryplans
- microsoft.azurebusinesscontinuity/unifiedprotecteditems
- microsoft.dataprotection/locations/deletedvaults
- microsoft.dataprotection/locations/deletedvaults/deletedbackupinstances
- microsoft.recoveryservices/vaults/backupfabrics/protectioncontainers
- microsoft.recoveryservices/vaults/replicationfabrics/replicationprotectioncontainers/replicationmigrationitems
- microsoft.recoveryservices/vaults/replicationfabrics/replicationprotectioncontainers/replicationprotectableitems

## resourcechanges

- microsoft.resources/changes

## resourcecontainerchanges

- microsoft.resources/changes

## resourcecontainers

For sample queries for this table, see [Resource Graph sample queries for resourcecontainers](../samples/samples-by-table.md#resourcecontainers).

- microsoft.management/managementgroups
  - Sample query: [Count of subscriptions per management group](../samples/samples-by-category.md#count-of-subscriptions-per-management-group)
  - Sample query: [List all management group ancestors for a specified management group](../samples/samples-by-category.md#list-all-management-group-ancestors-for-a-specified-management-group)
- microsoft.management/servicegroups
- microsoft.resources/subscriptions
  - Sample query: [Count of subscriptions per management group](../samples/samples-by-category.md#count-of-subscriptions-per-management-group)
  - Sample query: [Key vaults with subscription name](../samples/samples-by-category.md#key-vaults-with-subscription-name)
  - Sample query: [List all management group ancestors for a specified subscription](../samples/samples-by-category.md#list-all-management-group-ancestors-for-a-specified-subscription)
  - Sample query: [List all subscriptions under a specified management group](../samples/samples-by-category.md#list-all-subscriptions-under-a-specified-management-group)
  - Sample query: [Remove columns from results](../samples/samples-by-category.md#remove-columns-from-results)
  - Sample query: [Secure score per management group](../samples/samples-by-category.md#secure-score-per-management-group)
- microsoft.resources/subscriptions/resourcegroups
  - Sample query: [Combine results from two queries into a single result](../samples/samples-by-category.md)
  - Sample query: [Find storage accounts with a specific case-insensitive tag on the resource group](../samples/samples-by-category.md#find-storage-accounts-with-a-specific-case-insensitive-tag-on-the-resource-group)
  - Sample query: [Find storage accounts with a specific case-sensitive tag on the resource group](../samples/samples-by-category.md#find-storage-accounts-with-a-specific-case-sensitive-tag-on-the-resource-group)

## resources

For sample queries for this table, see [Resource Graph sample queries for resources](../samples/samples-by-table.md#resources).

- arizeai.observabilityeval/organizations
- citrix.services/xenappessentials
- citrix.services/xendesktopessentials
- commvault.contentstore/cloudaccounts
- dell.storage/filesystems
- dynatrace.observability/monitors
- github.enterprise/accounts
- github.network/networksettings
- informatica.datamanagement/organizations
- lambdatest.hyperexecute/organizations
- liftrbasic.samplerp/organizations
- microsoft.app/connectedenvironments/certificates
- microsoft.aad/domainservices
- microsoft.aadiam/azureadmetrics
- microsoft.web/kubeenvironments
- microsoft.aadiam/privatelinkforazuread
- microsoft.aadiam/tenants
- microsoft.agfoodplatform/farmbeats
- microsoft.alertsmanagement/actionrules
- microsoft.alertsmanagement/prometheusrulegroups
- microsoft.alertsmanagement/smartdetectoralertrules
- microsoft.alicespringsdataplane/e4k
- microsoft.alicespringsdataplane/e4k/broker
- microsoft.alicespringsdataplane/e4k/broker/authentication
- microsoft.alicespringsdataplane/e4k/broker/listener
- microsoft.alicespringsdataplane/e4k/mqttbridgeconnector
- microsoft.alicespringsdataplane/e4k/mqttbridgeconnector/topicmap
- microsoft.analysisservices/servers
- microsoft.anybuild/clusters
- microsoft.apicenter/catalogs
- microsoft.apicenter/services
- microsoft.apimanagement/gateways
- microsoft.apimanagement/service
- microsoft.app/agents
- microsoft.app/builders
- microsoft.app/connectedenvironments
- microsoft.app/containerapps
- microsoft.app/jobs
- microsoft.app/managedenvironments
- microsoft.app/managedenvironments/certificates
- microsoft.app/managedenvironments/managedcertificates
- microsoft.app/sessionpools
- microsoft.app/spaces
- microsoft.appassessment/migrateprojects
- microsoft.appconfiguration/configurationstores
- microsoft.appplatform/spring
- microsoft.appsecurity/policies
- microsoft.attestation/attestationproviders
- microsoft.authorization/elevateaccessroleassignment
- microsoft.authorization/resourcemanagementprivatelinks
- microsoft.automanage/accounts
- microsoft.automanage/configurationprofilepreferences
- microsoft.automanage/configurationprofiles
- microsoft.automanage/configurationprofiles/versions
- microsoft.automanage/patchjobconfigurations
- microsoft.automanage/patchtiers
- microsoft.automation/automationaccounts
- microsoft.automation/automationaccounts/configurations
- microsoft.automation/automationaccounts/runbooks
- microsoft.autonomousdevelopmentplatform/accounts
- microsoft.autonomousdevelopmentplatform/workspaces
- microsoft.autonomoussystems/workspaces
- microsoft.avs/privateclouds
- microsoft.awsconnector/accessanalyzeranalyzers
- microsoft.awsconnector/acmcertificatesummaries
- microsoft.awsconnector/apigatewayrestapis
- microsoft.awsconnector/apigatewaystages
- microsoft.awsconnector/appsyncgraphqlapis
- microsoft.awsconnector/autoscalingautoscalinggroups
- microsoft.awsconnector/cloudformationstacks
- microsoft.awsconnector/cloudformationstacksets
- microsoft.awsconnector/cloudfrontdistributions
- microsoft.awsconnector/cloudtrailtrails
- microsoft.awsconnector/cloudwatchalarms
- microsoft.awsconnector/codebuildprojects
- microsoft.awsconnector/codebuildsourcecredentialsinfos
- microsoft.awsconnector/configserviceconfigurationrecorders
- microsoft.awsconnector/configserviceconfigurationrecorderstatuses
- microsoft.awsconnector/configservicedeliverychannels
- microsoft.awsconnector/databasemigrationservicereplicationinstances
- microsoft.awsconnector/daxclusters
- microsoft.awsconnector/dynamodbcontinuousbackupsdescriptions
- microsoft.awsconnector/dynamodbtables
- microsoft.awsconnector/ec2accountattributes
- microsoft.awsconnector/ec2addresses
- microsoft.awsconnector/ec2flowlogs
- microsoft.awsconnector/ec2images
- microsoft.awsconnector/ec2instancestatuses
- microsoft.awsconnector/ec2ipams
- microsoft.awsconnector/ec2keypairs
- microsoft.awsconnector/ec2networkacls
- microsoft.awsconnector/ec2networkinterfaces
- microsoft.awsconnector/ec2routetables
- microsoft.awsconnector/ec2securitygroups
- microsoft.awsconnector/ec2snapshots
- microsoft.awsconnector/ec2subnets
- microsoft.awsconnector/ec2volumes
- microsoft.awsconnector/ec2vpcendpoints
- microsoft.awsconnector/ec2vpcpeeringconnections
- microsoft.awsconnector/ec2vpcs
- microsoft.awsconnector/ecrimagedetails
- microsoft.awsconnector/ecrrepositories
- microsoft.awsconnector/ecsclusters
- microsoft.awsconnector/ecsservices
- microsoft.awsconnector/ecstaskdefinitions
- microsoft.awsconnector/efsfilesystems
- microsoft.awsconnector/efsmounttargets
- microsoft.awsconnector/eksnodegroups
- microsoft.awsconnector/elasticbeanstalkapplications
- microsoft.awsconnector/elasticbeanstalkconfigurationtemplates
- microsoft.awsconnector/elasticbeanstalkenvironments
- microsoft.awsconnector/elasticloadbalancingv2listeners
- microsoft.awsconnector/elasticloadbalancingv2loadbalancers
- microsoft.awsconnector/elasticloadbalancingv2targetgroups
- microsoft.awsconnector/elasticloadbalancingv2targethealthdescriptions
- microsoft.awsconnector/emrclusters
- microsoft.awsconnector/guarddutydetectors
- microsoft.awsconnector/iamaccesskeymetadata
- microsoft.awsconnector/iamgroups
- microsoft.awsconnector/iaminstanceprofiles
- microsoft.awsconnector/iammfadevices
- microsoft.awsconnector/iampasswordpolicies
- microsoft.awsconnector/iampolicyversions
- microsoft.awsconnector/iamroles
- microsoft.awsconnector/iamservercertificates
- microsoft.awsconnector/iamvirtualmfadevices
- microsoft.awsconnector/kmsaliases
- microsoft.awsconnector/kmskeys
- microsoft.awsconnector/lambdafunctioncodelocations
- microsoft.awsconnector/lambdafunctionconfigurations
- microsoft.awsconnector/lambdafunctions
- microsoft.awsconnector/lightsailbuckets
- microsoft.awsconnector/lightsailinstances
- microsoft.awsconnector/logsloggroups
- microsoft.awsconnector/logslogstreams
- microsoft.awsconnector/logsmetricfilters
- microsoft.awsconnector/logssubscriptionfilters
- microsoft.awsconnector/macie2jobsummaries
- microsoft.awsconnector/macieallowlists
- microsoft.awsconnector/networkfirewallfirewallpolicies
- microsoft.awsconnector/networkfirewallfirewalls
- microsoft.awsconnector/networkfirewallrulegroups
- microsoft.awsconnector/opensearchdomainstatuses
- microsoft.awsconnector/organizationsaccounts
- microsoft.awsconnector/organizationsorganizations
- microsoft.awsconnector/rdsdbclusters
- microsoft.awsconnector/rdsdbinstances
- microsoft.awsconnector/rdsdbsnapshotattributesresults
- microsoft.awsconnector/rdsdbsnapshots
- microsoft.awsconnector/rdseventsubscriptions
- microsoft.awsconnector/rdsexporttasks
- microsoft.awsconnector/redshiftclusterparametergroups
- microsoft.awsconnector/redshiftclusters
- microsoft.awsconnector/route53domainsdomainsummaries
- microsoft.awsconnector/route53hostedzones
- microsoft.awsconnector/route53resourcerecordsets
- microsoft.awsconnector/s3accesscontrolpolicies
- microsoft.awsconnector/s3accesspoints
- microsoft.awsconnector/s3bucketpolicies
- microsoft.awsconnector/s3buckets
- microsoft.awsconnector/sagemakerapps
- microsoft.awsconnector/sagemakernotebookinstancesummaries
- microsoft.awsconnector/secretsmanagerresourcepolicies
- microsoft.awsconnector/secretsmanagersecrets
- microsoft.awsconnector/snssubscriptions
- microsoft.awsconnector/snstopics
- microsoft.awsconnector/sqsqueues
- microsoft.awsconnector/ssminstanceinformations
- microsoft.awsconnector/ssmparameters
- microsoft.awsconnector/ssmresourcecompliancesummaryitems
- microsoft.awsconnector/wafv2loggingconfigurations
- microsoft.awsconnector/wafwebaclsummaries
- microsoft.azureactivedirectory/b2cdirectories
- microsoft.azureactivedirectory/ciamdirectories
- microsoft.azureactivedirectory/guestusages
- microsoft.azurearcdata/datacontrollers
- microsoft.azurearcdata/postgresinstances
- microsoft.azurearcdata/sqlmanagedinstances
- microsoft.azurearcdata/sqlserveresulicenses
- microsoft.azurearcdata/sqlserverinstances
- microsoft.azurearcdata/sqlserverinstances/availabilitygroups
- microsoft.azurearcdata/sqlserverinstances/databases
- microsoft.azurearcdata/sqlserverlicenses
- microsoft.azuredata/sqlbigdataclusters
- microsoft.azuredata/sqlserverregistrations
- microsoft.azuredatatransfer/connections
- microsoft.azuredatatransfer/connections/flows
- microsoft.azuredatatransfer/pipelines
- microsoft.azurefleet/fleets
- microsoft.azureimagetestingforlinux/jobs
- microsoft.azureimagetestingforlinux/jobtemplates
- microsoft.azurelargeinstance/azurelargeinstances
- microsoft.azurelargeinstance/azurelargestorageinstances
- microsoft.azurepercept/accounts
- microsoft.azureplaywrightservice/accounts
- microsoft.azurescan/scanningaccounts
- microsoft.azuresphere/catalogs
- microsoft.azuresphere/catalogs/products
- microsoft.azurestack/linkedsubscriptions
- microsoft.azurestack/registrations
- microsoft.azurestackhci/clusters
- microsoft.azurestackhci/devicepools
- microsoft.azurestackhci/edgemachines
- microsoft.azurestackhci/edgenodepools
- microsoft.azurestackhci/galleryimages
- microsoft.azurestackhci/logicalnetworks
- microsoft.azurestackhci/marketplacegalleryimages
- microsoft.azurestackhci/networkinterfaces
- microsoft.azurestackhci/networksecuritygroups
- microsoft.azurestackhci/storagecontainers
- microsoft.azurestackhci/virtualharddisks
- microsoft.azurestackhci/virtualmachines
- microsoft.azurestackhci/virtualmachines/extensions
- microsoft.azurestackhci/virtualnetworks
- microsoft.backupsolutions/vmwareapplications
- microsoft.baremetal/baremetalconnections
- microsoft.baremetal/consoleconnections
- microsoft.baremetal/crayservers
- microsoft.baremetal/monitoringservers
- microsoft.baremetal/peeringsettings
- microsoft.baremetalinfrastructure/baremetalinstances
- microsoft.baremetalinfrastructure/baremetalstorageinstances
- microsoft.batch/batchaccounts
- microsoft.billingbenefits/credits
- microsoft.billingbenefits/discounts
- microsoft.billingbenefits/incentiveschedules
- microsoft.billingbenefits/maccs
- microsoft.bing/accounts
- microsoft.biztalkservices/biztalk
- microsoft.bluefin/instances
- microsoft.bluefin/instances/datasets
- microsoft.bluefin/instances/pipelines
- microsoft.botservice/botservices
- microsoft.cache/redis
- microsoft.cache/redisenterprise
- microsoft.cdn/cdnwebapplicationfirewallpolicies
- microsoft.cdn/edgeactions
- microsoft.cdn/edgeactions/attachments
- microsoft.cdn/edgeactions/executionfilters
- microsoft.cdn/edgeactions/versions
- microsoft.cdn/profiles
- microsoft.cdn/profiles/afdendpoints
- microsoft.cdn/profiles/endpoints
- microsoft.certificateregistration/certificateorders
- microsoft.chaos/applications
- microsoft.chaos/experiments
- microsoft.chaos/privateaccesses
- microsoft.chaos/resilienceprofiles
- microsoft.classiccompute/domainnames
- microsoft.classiccompute/virtualmachines
- microsoft.classicnetwork/networksecuritygroups
- microsoft.classicnetwork/reservedips
- microsoft.classicnetwork/virtualnetworks
- microsoft.classicstorage/storageaccounts
- microsoft.cleanroom/cleanrooms
- microsoft.cleanroom/microservices
- microsoft.clouddeviceplatform/delegatedidentities
- microsoft.cloudes/accounts
- microsoft.cloudhealth/healthmodels
- microsoft.clusterstor/nodes
- microsoft.codesigning/codesigningaccounts
- microsoft.codespaces/plans
- microsoft.cognition/syntheticsaccounts
- microsoft.cognitivesearch/indexes
- microsoft.cognitiveservices/accounts
- microsoft.cognitiveservices/commitmentplans
- microsoft.community/communitytrainings
- microsoft.compositesolutions/compositesolutiondefinitions
- microsoft.compositesolutions/compositesolutions
- microsoft.compute/availabilitysets
- microsoft.compute/capacityreservationgroups
- microsoft.compute/capacityreservationgroups/capacityreservations
- microsoft.compute/cloudservices
- microsoft.compute/cloudservices/roleinstances/networkinterfaces
- microsoft.compute/cloudservices/roleinstances/networkinterfaces/ipconfigurations/publicipaddresses
- microsoft.compute/diskaccesses
- microsoft.compute/diskencryptionsets
- microsoft.compute/disks
- microsoft.compute/galleries
- microsoft.compute/galleries/applications
- microsoft.compute/galleries/applications/versions
- microsoft.compute/galleries/images
- microsoft.compute/galleries/images/versions
- microsoft.compute/galleries/invmaccesscontrolprofiles
- microsoft.compute/galleries/invmaccesscontrolprofiles/versions
- microsoft.compute/galleries/remotecontainerimages
- microsoft.compute/galleries/serviceartifacts
- microsoft.compute/hostgroups
- microsoft.compute/hostgroups/hosts
- microsoft.compute/images
- microsoft.compute/proximityplacementgroups
- microsoft.compute/restorepointcollections
- microsoft.compute/sharedvmextensions
- microsoft.compute/sharedvmextensions/versions
- microsoft.compute/sharedvmimages
- microsoft.compute/sharedvmimages/versions
- microsoft.compute/snapshots
- microsoft.compute/sshpublickeys
- microsoft.compute/swiftlets
- microsoft.compute/virtualmachines
  - Sample query: [Count of virtual machines by power state](../samples/samples-by-category.md#count-of-virtual-machines-by-power-state)
  - Sample query: [Count virtual machines by OS type](../samples/samples-by-category.md#count-virtual-machines-by-os-type)
  - Sample query: [Count virtual machines by OS type with extend](../samples/samples-by-category.md#count-virtual-machines-by-os-type-with-extend)
  - Sample query: [List all extensions installed on a virtual machine](../samples/samples-by-category.md#list-all-extensions-installed-on-a-virtual-machine)
  - Sample query: [List machines that are not running and the last compliance status](../samples/samples-by-category.md#list-machines-that-are-not-running-and-the-last-compliance-status)
  - Sample query: [List of virtual machines by availability state and power state with Resource IDs and resource Groups](../samples/samples-by-category.md#list-of-virtual-machines-by-availability-state-and-power-state-with-resource-ids-and-resource-groups)
  - Sample query: [List virtual machines with their network interface and public IP](../samples/samples-by-category.md#list-virtual-machines-with-their-network-interface-and-public-ip)
  - Sample query: [Show all virtual machines ordered by name in descending order](../samples/samples-by-category.md#show-all-virtual-machines-ordered-by-name-in-descending-order)
  - Sample query: [Show first five virtual machines by name and their OS type](../samples/samples-by-category.md#show-first-five-virtual-machines-by-name-and-their-os-type)
  - Sample query: [Summarize virtual machine by the power states extended property](../samples/samples-by-category.md#summarize-virtual-machine-by-the-power-states-extended-property)
  - Sample query: [Virtual machines matched by regex](../samples/samples-by-category.md#virtual-machines-matched-by-regex)
- microsoft.compute/virtualmachines/extensions
  - Sample query: [List all extensions installed on a virtual machine](../samples/samples-by-category.md#list-all-extensions-installed-on-a-virtual-machine)
- microsoft.compute/virtualmachines/runcommands
- microsoft.compute/virtualmachines/vmapplications
- microsoft.compute/virtualmachinescalesets
  - Sample query: [Get virtual machine scale set capacity and size](../samples/samples-by-category.md#get-virtual-machine-scale-set-capacity-and-size)
- microsoft.compute/virtualmachinescalesets/virtualmachines/networkinterfaces/ipconfigurations/publicipaddresses
- microsoft.computeschedule/autoactions
- microsoft.confidentialledger/ledgers
- microsoft.confidentialledger/managedccfs
- microsoft.confluent/organizations
- microsoft.connectedcache/cachenodes
- microsoft.connectedcache/enterprisecustomers
- microsoft.connectedcache/enterprisemcccustomers
- microsoft.connectedcache/enterprisemcccustomers/enterprisemcccachenodes
- microsoft.connectedcache/ispcustomers
- microsoft.connectedcache/ispcustomers/ispcachenodes
- microsoft.connectedcredentials/credentials
- microsoft.connectedopenstack/heatstacks
- microsoft.connectedopenstack/openstackidentities
- microsoft.connectedvehicle/platformaccounts
- microsoft.connectedvmwarevsphere/clusters
- microsoft.connectedvmwarevsphere/datastores
- microsoft.connectedvmwarevsphere/hosts
- microsoft.connectedvmwarevsphere/resourcepools
- microsoft.connectedvmwarevsphere/vcenters
- microsoft.connectedvmwarevsphere/virtualmachines
- microsoft.connectedvmwarevsphere/virtualmachines/extensions
- microsoft.connectedvmwarevsphere/virtualmachinetemplates
- microsoft.connectedvmwarevsphere/virtualnetworks
- microsoft.containerinstance/containergroups
- microsoft.containerinstance/containerscalesets
- microsoft.containerinstance/ngroups
- microsoft.containerregistry/registries
- microsoft.containerregistry/registries/agentpools
- microsoft.containerregistry/registries/buildtasks
- microsoft.containerregistry/registries/replications
- microsoft.containerregistry/registries/taskruns
- microsoft.containerregistry/registries/tasks
- microsoft.containerregistry/registries/webhooks
- microsoft.containerservice/containerservices
- microsoft.containerservice/fleets
- microsoft.containerservice/managedclusters
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- microsoft.containerservice/managedclustersnapshots
- microsoft.containerservice/snapshots
- microsoft.containerstorage/pools
- microsoft.contoso/employees
- microsoft.contoso/employees/desks
- microsoft.costmanagement/connectors
- microsoft.customproviders/resourceproviders
- microsoft.d365customerinsights/instances
- microsoft.dashboard/dashboards
- microsoft.dashboard/grafana
- microsoft.dashboard/grafana/integrationfabrics
- microsoft.dashboard/grafana/managedprivateendpoints
- microsoft.dataaccelerator/indexclusters
- microsoft.databasefleetmanager/fleets
- microsoft.databasewatcher/watchers
- microsoft.databox/jobs
- microsoft.databoxedge/databoxedgedevices
- microsoft.databricks/accessconnectors
- microsoft.databricks/workspaces
- microsoft.datacollaboration/workspaces
- microsoft.datadog/monitors
- microsoft.datafactory/factories
- microsoft.datalakeanalytics/accounts
- microsoft.datalakestore/accounts
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- microsoft.datamigration/controllers
- microsoft.datamigration/services
- microsoft.datamigration/services/projects
- microsoft.datamigration/slots
- microsoft.datamigration/sqlmigrationservices
- microsoft.dataplatform/capacities
- microsoft.dataprotection/backupvaults
- microsoft.dataprotection/resourceguards
- microsoft.datareplication/replicationfabrics
- microsoft.datareplication/replicationvaults
- microsoft.datashare/accounts
- microsoft.dbformariadb/servers
- microsoft.dbformysql/flexibleservers
- microsoft.dbformysql/servers
- microsoft.dbforpostgresql/flexibleservers
- microsoft.dbforpostgresql/servergroupsv2
- microsoft.delegatednetwork/controller
- microsoft.delegatednetwork/delegatedsubnets
- microsoft.delegatednetwork/orchestratorinstances
- microsoft.delegatednetwork/orchestrators
- microsoft.dependencymap/maps
- microsoft.dependencymap/maps/discoverysources
- microsoft.desktopvirtualization/appattachpackages
- microsoft.desktopvirtualization/applicationgroups
- microsoft.desktopvirtualization/connectionpolicies
- microsoft.desktopvirtualization/hostpools
- microsoft.desktopvirtualization/scalingplans
- microsoft.desktopvirtualization/workspaces
- microsoft.devai/instances
- microsoft.devai/instances/experiments
- microsoft.devai/instances/sandboxes
- microsoft.devai/instances/sandboxes/experiments
- microsoft.devcenter/devcenters
- microsoft.devcenter/devcenters/devboxdefinitions
- microsoft.devcenter/networkconnections
- microsoft.devcenter/plans
- microsoft.devcenter/projects
- microsoft.devcenter/projects/pools
- microsoft.developmentwindows365/developmentcloudpcdelegatedmsis
- microsoft.devhub/iacprofiles
- microsoft.devhub/workflow
- microsoft.devhub/workflows
- microsoft.deviceonboarding/discoveryservices
- microsoft.deviceonboarding/discoveryservices/ownershipvoucherpublickeys
- microsoft.deviceonboarding/onboardingservices
- microsoft.deviceonboarding/onboardingservices/policies
- microsoft.deviceregistry/assetendpointprofiles
- microsoft.deviceregistry/assets
- microsoft.deviceregistry/devices
- microsoft.deviceregistry/discoveredassetendpointprofiles
- microsoft.deviceregistry/discoveredassets
- microsoft.deviceregistry/namespaces
- microsoft.deviceregistry/namespaces/devices
- microsoft.deviceregistry/schemaregistries
- microsoft.devices/iothubs
- microsoft.devices/provisioningservices
- microsoft.deviceupdate/accounts
- microsoft.deviceupdate/accounts/agents
- microsoft.deviceupdate/accounts/instances
- microsoft.deviceupdate/updateaccounts
- microsoft.deviceupdate/updateaccounts/activedeployments
- microsoft.deviceupdate/updateaccounts/agents
- microsoft.deviceupdate/updateaccounts/deployments
- microsoft.deviceupdate/updateaccounts/deviceclasses
- microsoft.deviceupdate/updateaccounts/updates
- microsoft.devops/pipelines
- microsoft.devopsinfrastructure/pools
- microsoft.devtestlab/labcenters
- microsoft.devtestlab/labs
- microsoft.devtestlab/labs/servicerunners
- microsoft.devtestlab/labs/virtualmachines
- microsoft.devtestlab/schedules
- microsoft.devtunnels/tunnelplans
- microsoft.digitaltwins/digitaltwinsinstances
- microsoft.dns/dnszones/cname
- microsoft.documentdb/cassandraclusters
- microsoft.documentdb/databaseaccounts
  - Sample query: [List Azure Cosmos DB with specific write locations](../samples/samples-by-category.md#list-azure-cosmos-db-with-specific-write-locations)
- microsoft.documentdb/fleets
- microsoft.documentdb/garnetclusters
- microsoft.documentdb/managedresources
- microsoft.documentdb/mongoclusters
- microsoft.documentdb/throughputpools
- microsoft.domainregistration/domains
- microsoft.durabletask/namespaces
- microsoft.durabletask/schedulers
- microsoft.dynamics365fraudprotection/instances
- microsoft.easm/workspaces
- microsoft.edge/capabilitylists
- microsoft.edge/configtemplates
- microsoft.edge/configurations
- microsoft.edge/contexts
- microsoft.edge/deploymenttargets
- microsoft.edge/diagnostics
- microsoft.edge/disconnectedoperations
- microsoft.edge/hierarchylists
- microsoft.edge/schemas
- microsoft.edge/solutionbindings
- microsoft.edge/solutions
- microsoft.edge/solutiontemplates
- microsoft.edge/targets
- microsoft.edge/winfields
- microsoft.edgeorder/addresses
- microsoft.edgeorder/bootstrapconfigurations
- microsoft.edgeorder/orderitems
- microsoft.edgezones/edgezones
- microsoft.elastic/monitors
- microsoft.elasticsan/elasticsans
- microsoft.elasticsan/elasticsans/volumegroups
- microsoft.energydataplatform/energyservices
- microsoft.enterprisesupport/enterprisesupports
- microsoft.eventgrid/domains
- microsoft.eventgrid/namespaces
- microsoft.eventgrid/partnerconfigurations
- microsoft.eventgrid/partnerdestinations
- microsoft.eventgrid/partnernamespaces
- microsoft.eventgrid/partnerregistrations
- microsoft.eventgrid/partnertopics
- microsoft.eventgrid/systemtopics
- microsoft.eventgrid/topics
- microsoft.eventhub/clusters
- microsoft.eventhub/namespaces
- microsoft.experimentation/experimentworkspaces
- microsoft.extendedlocation/customlocations
  - Sample query: [List Azure Arc-enabled custom locations with VMware or SCVMM enabled](../samples/samples-by-category.md#list-azure-arc-enabled-custom-locations-with-vmware-or-scvmm-enabled)
- microsoft.extendedlocation/customlocations/resourcesyncrules
- microsoft.fabric/capacities
- microsoft.fabric/privatelinkservicesforfabric
- microsoft.falcon/namespaces
- microsoft.fileshares/fileshares
- microsoft.fluidrelay/fluidrelayservers
- microsoft.footprintmonitoring/profiles
- microsoft.gaming/titles
- microsoft.graph/azureadapplication
- microsoft.graphservices/accounts
- microsoft.hardware/orders
- microsoft.hardwaresecuritymodules/cloudhsmclusters
- microsoft.hardwaresecuritymodules/dedicatedhsms
- microsoft.hdinsight/clusterpools
- microsoft.hdinsight/clusterpools/clusters
- microsoft.hdinsight/clusters
- microsoft.healthbot/healthbots
- microsoft.healthcareapis/services
- microsoft.healthcareapis/workspaces
- microsoft.healthcareapis/workspaces/analyticsconnectors
- microsoft.healthcareapis/workspaces/dicomservices
- microsoft.healthcareapis/workspaces/fhirservices
- microsoft.healthcareapis/workspaces/iotconnectors
- microsoft.healthdataaiservices/deidservices
- microsoft.hpcworkbench/instances
- microsoft.hpcworkbench/instances/chambers
- microsoft.hpcworkbench/instances/chambers/accessprofiles
- microsoft.hpcworkbench/instances/chambers/workloads
- microsoft.hpcworkbench/instances/consortiums
- microsoft.hybridcloud/cloudconnections
- microsoft.hybridcloud/cloudconnectors
- microsoft.hybridcompute/gateways
- microsoft.hybridcompute/licenses
- microsoft.hybridcompute/machines
  - Sample query: [Get count and percentage of Arc-enabled servers by domain](../samples/samples-by-category.md#get-count-and-percentage-of-arc-enabled-servers-by-domain)
  - Sample query: [List all extensions installed on an Azure Arc-enabled server](../samples/samples-by-category.md#list-all-extensions-installed-on-an-azure-arc-enabled-server)
  - Sample query: [List Arc-enabled servers not running latest released agent version](../samples/samples-by-category.md#list-arc-enabled-servers-not-running-latest-released-agent-version)
- microsoft.hybridcompute/machines/extensions
  - Sample query: [List all extensions installed on an Azure Arc-enabled server](../samples/samples-by-category.md#list-all-extensions-installed-on-an-azure-arc-enabled-server)
- microsoft.hybridcompute/machines/licenseprofiles
- microsoft.hybridcompute/machines/runcommands
- microsoft.hybridcompute/privatelinkscopes
- microsoft.hybridconnectivity/publiccloudconnectors
- microsoft.hybridcontainerservice/provisionedclusters
- microsoft.hybridcontainerservice/provisionedclusters/agentpools
- microsoft.hybridcontainerservice/storagespaces
- microsoft.hybridcontainerservice/virtualnetworks
- microsoft.hybriddata/datamanagers
- microsoft.hybridnetwork/configurationgroupvalues
- microsoft.hybridnetwork/devices
- microsoft.hybridnetwork/networkfunctions
- microsoft.hybridnetwork/publishers
- microsoft.hybridnetwork/publishers/artifactstores
- microsoft.hybridnetwork/publishers/artifactstores/artifactmanifests
- microsoft.hybridnetwork/publishers/configurationgroupschemas
- microsoft.hybridnetwork/publishers/networkfunctiondefinitiongroups
- microsoft.hybridnetwork/publishers/networkfunctiondefinitiongroups/networkfunctiondefinitionversions
- microsoft.hybridnetwork/publishers/networkfunctiondefinitiongroups/previewsubscriptions
- microsoft.hybridnetwork/publishers/networkservicedesigngroups
- microsoft.hybridnetwork/publishers/networkservicedesigngroups/networkservicedesignversions
- microsoft.hybridnetwork/servicemanagementcontainers
- microsoft.hybridnetwork/servicemanagementcontainers/rolloutsequences
- microsoft.hybridnetwork/servicemanagementcontainers/rollouttiers
- microsoft.hybridnetwork/servicemanagementcontainers/updatespecifications
- microsoft.hybridnetwork/servicemanagementcontainers/updatespecifications/rollouts
- microsoft.hybridnetwork/sitenetworkservices
- microsoft.hybridnetwork/sites
- microsoft.ibmpower/powervirtualmachines
- microsoft.ibmpower/powervirtualmachines/interfaces
- microsoft.importexport/jobs
- microsoft.insights/actiongroups
- microsoft.insights/activitylogalerts
- microsoft.insights/autoscalesettings
- microsoft.insights/components
- microsoft.insights/datacollectionendpoints
- microsoft.insights/datacollectionrules
- microsoft.insights/firstparty
- microsoft.insights/guestdiagnosticsettings
- microsoft.insights/metricalerts
- microsoft.insights/notificationrules
- microsoft.insights/privatelinkscopes
- microsoft.insights/scheduledqueryrules
- microsoft.insights/webtests
- microsoft.insights/workbooks
- microsoft.insights/workbooktemplates
- microsoft.integrationspaces/spaces
- microsoft.iotcentral/iotapps
- microsoft.iotfirmwaredefense/workspaces
- microsoft.iotoperations/instances
- microsoft.iotoperationsdataprocessor/instances
- microsoft.iotoperationsdataprocessor/instances/datasets
- microsoft.iotoperationsdataprocessor/instances/pipelines
- microsoft.iotoperationsmq/mq
- microsoft.iotoperationsmq/mq/broker
- microsoft.iotoperationsmq/mq/broker/authentication
- microsoft.iotoperationsmq/mq/broker/authorization
- microsoft.iotoperationsmq/mq/broker/listener
- microsoft.iotoperationsmq/mq/datalakeconnector
- microsoft.iotoperationsmq/mq/datalakeconnector/topicmap
- microsoft.iotoperationsmq/mq/diagnosticservice
- microsoft.iotoperationsmq/mq/kafkaconnector
- microsoft.iotoperationsmq/mq/kafkaconnector/topicmap
- microsoft.iotoperationsmq/mq/mqttbridgeconnector
- microsoft.iotoperationsmq/mq/mqttbridgeconnector/topicmap
- microsoft.iotoperationsorchestrator/instances
- microsoft.iotoperationsorchestrator/solutions
- microsoft.iotoperationsorchestrator/targets
- microsoft.keyvault/hsmpools
- microsoft.keyvault/managedhsms
- microsoft.keyvault/vaults
  - Sample query: [Count key vault resources](../samples/samples-by-category.md#count-key-vault-resources)
  - Sample query: [Key vaults with subscription name](../samples/samples-by-category.md#key-vaults-with-subscription-name)
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- microsoft.kubernetes/connectedclusters
  - Sample query: [List all Azure Arc-enabled Kubernetes clusters without Azure Monitor extension](../samples/samples-by-category.md#list-all-azure-arc-enabled-kubernetes-clusters-without-azure-monitor-extension)
  - Sample query: [List all Azure Arc-enabled Kubernetes resources](../samples/samples-by-category.md#list-all-azure-arc-enabled-kubernetes-resources)
- microsoft.kubernetesconfiguration/privatelinkscopes
- microsoft.kusto/clusters
- microsoft.kx/kdbinsightsenterprise
- microsoft.labservices/labaccounts
- microsoft.labservices/labplans
- microsoft.labservices/labs
- microsoft.liftrpilot/organizations
- microsoft.loadtestservice/loadtests
- microsoft.logic/businessprocesses
- microsoft.logic/integrationaccounts
- microsoft.logic/integrationserviceenvironments
- microsoft.logic/integrationserviceenvironments/managedapis
- microsoft.logic/workflows
- microsoft.machinelearning/webservices
- microsoft.machinelearningservices/registries
- microsoft.machinelearningservices/virtualclusters
- microsoft.machinelearningservices/workspaces
- microsoft.machinelearningservices/workspaces/batchendpoints
- microsoft.machinelearningservices/workspaces/batchendpoints/deployments
- microsoft.machinelearningservices/workspaces/inferencepools
- microsoft.machinelearningservices/workspaces/inferencepools/endpoints
- microsoft.machinelearningservices/workspaces/inferencepools/groups
- microsoft.machinelearningservices/workspaces/onlineendpoints
- microsoft.machinelearningservices/workspaces/onlineendpoints/deployments
- microsoft.machinelearningservices/workspaces/registries
- microsoft.machinelearningservices/workspaces/serverlessendpoints
- microsoft.maintenance/maintenanceconfigurations
- microsoft.maintenance/maintenancepolicies
- microsoft.maintenance/orchestrationpreferences
- microsoft.managedidentity/userassignedidentities
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- microsoft.managednetworkfabric/accesscontrollists
- microsoft.managednetworkfabric/internetgatewayrules
- microsoft.managednetworkfabric/internetgateways
- microsoft.managednetworkfabric/ipcommunities
- microsoft.managednetworkfabric/ipcommunitylists
- microsoft.managednetworkfabric/ipextendedcommunities
- microsoft.managednetworkfabric/ipprefixes
- microsoft.managednetworkfabric/ipprefixlists
- microsoft.managednetworkfabric/l2isolationdomains
- microsoft.managednetworkfabric/l3isolationdomains
- microsoft.managednetworkfabric/neighborgroups
- microsoft.managednetworkfabric/networkdevices
- microsoft.managednetworkfabric/networkfabriccontrollers
- microsoft.managednetworkfabric/networkfabrics
- microsoft.managednetworkfabric/networkmonitors
- microsoft.managednetworkfabric/networkpacketbrokers
- microsoft.managednetworkfabric/networkracks
- microsoft.managednetworkfabric/networktaprules
- microsoft.managednetworkfabric/networktaps
- microsoft.managednetworkfabric/routepolicies
- microsoft.managedstorageclass/managedstorageclass
- microsoft.maps/accounts
- microsoft.messagingcatalog/catalogs
- microsoft.messagingconnectors/connectors
- microsoft.metaverse/metaverses
- microsoft.migrate/assessmentprojects
- microsoft.migrate/migrateprojects
- microsoft.migrate/modernizeprojects
- microsoft.migrate/movecollections
- microsoft.migrate/projects
- microsoft.mission/catalogs
- microsoft.mission/communities
- microsoft.mission/communities/communityendpoints
- microsoft.mission/communities/transithubs
- microsoft.mission/enclaveconnections
- microsoft.mission/externalconnections
- microsoft.mission/internalconnections
- microsoft.mission/virtualenclaves
- microsoft.mission/virtualenclaves/enclaveendpoints
- microsoft.mission/virtualenclaves/endpoints
- microsoft.mission/virtualenclaves/workloads
- microsoft.mobilepacketcore/amfdeployments
- microsoft.mobilepacketcore/clusterservices
- microsoft.mobilepacketcore/mobilepacketcores
- microsoft.mobilepacketcore/networkfunctions
- microsoft.mobilepacketcore/nrfdeployments
- microsoft.mobilepacketcore/nssfdeployments
- microsoft.mobilepacketcore/observabilityservices
- microsoft.mobilepacketcore/smfdeployments
- microsoft.mobilepacketcore/upfdeployments
- microsoft.modsimworkbench/instances
- microsoft.modsimworkbench/instances/chambers
- microsoft.modsimworkbench/instances/chambers/connectors
- microsoft.modsimworkbench/instances/chambers/workloads
- microsoft.modsimworkbench/workbenches
- microsoft.modsimworkbench/workbenches/chambers
- microsoft.modsimworkbench/workbenches/chambers/connectors
- microsoft.modsimworkbench/workbenches/chambers/storages
- microsoft.modsimworkbench/workbenches/chambers/workloads
- microsoft.modsimworkbench/workbenches/sharedstorages
- microsoft.monitor/accounts
- microsoft.monitor/pipelinegroups
- microsoft.mysqldiscovery/mysqlsites
- microsoft.netapp/netappaccounts
- microsoft.netapp/netappaccounts/backuppolicies
- microsoft.netapp/netappaccounts/backupvaults
- microsoft.netapp/netappaccounts/capacitypools
- microsoft.netapp/netappaccounts/capacitypools/volumes
- microsoft.netapp/netappaccounts/snapshotpolicies
- microsoft.network/applicationgateways
- microsoft.network/applicationgatewaywebapplicationfirewallpolicies
- microsoft.network/applicationsecuritygroups
- microsoft.network/azurefirewalls
- microsoft.network/bastionhosts
- microsoft.network/connections
- microsoft.network/customipprefixes
- microsoft.network/ddoscustompolicies
- microsoft.network/ddosprotectionplans
- microsoft.network/dnsforwardingrulesets
- microsoft.network/dnsresolverdomainlists
- microsoft.network/dnsresolverpolicies
- microsoft.network/dnsresolverpolicies/dnssecurityrules
- microsoft.network/dnsresolverpolicies/virtualnetworklinks
- microsoft.network/dnsresolvers
- microsoft.network/dnsresolvers/inboundendpoints
- microsoft.network/dnsresolvers/outboundendpoints
- microsoft.network/dnssecuritypolicies
- microsoft.network/dnssecuritypolicies/virtualnetworklinks
- microsoft.network/dnssecuritypolicydomainlists
- microsoft.network/dnszones
- microsoft.network/dscpconfigurations
- microsoft.network/expressroutecircuits
- microsoft.network/expressroutecrossconnections
- microsoft.network/expressroutegateways
- microsoft.network/expressrouteports
- microsoft.network/firewallpolicies
- microsoft.network/firewallpolicies/rulegroups
- microsoft.network/frontdoors
- microsoft.network/frontdoorwebapplicationfirewallpolicies
- microsoft.network/gatewayloadbalanceraliases
- microsoft.network/ipallocations
- microsoft.network/ipgroups
- microsoft.network/loadbalancers
- microsoft.network/localnetworkgateways
- microsoft.network/natgateways
- microsoft.network/networkexperimentprofiles
- microsoft.network/networkintentpolicies
- microsoft.network/networkinterfaces
- microsoft.network/networkmanagers
- microsoft.network/networkmanagers/ipampools
- microsoft.network/networkmanagers/verifierworkspaces
- microsoft.network/networkprofiles
- microsoft.network/networksecuritygroups
- microsoft.network/networksecurityperimeters
- microsoft.network/networkverifiers
- microsoft.network/networkvirtualappliances
- microsoft.network/networkwatchers
- microsoft.network/networkwatchers/connectionanalyzers
- microsoft.network/networkwatchers/connectionmonitors
- microsoft.network/networkwatchers/flowlogs
- microsoft.network/networkwatchers/lenses
- microsoft.network/networkwatchers/networkwatcheragents
- microsoft.network/networkwatchers/pingmeshes
- microsoft.network/p2svpngateways
- microsoft.network/privatednszones
- microsoft.network/privatednszones/virtualnetworklinks
- microsoft.network/privateendpointredirectmaps
- microsoft.network/privateendpoints
- microsoft.network/privatelinkservices
- microsoft.network/publicipaddresses
- microsoft.network/publicipprefixes
- microsoft.network/routefilters
- microsoft.network/routetables
- microsoft.network/sampleresources
- microsoft.network/securitypartnerproviders
- microsoft.network/serviceendpointpolicies
- microsoft.network/servicegateways
- microsoft.network/trafficmanagerprofiles
- microsoft.network/virtualhubs
- microsoft.network/virtualhubs/bgpconnections
- microsoft.network/virtualhubs/ipconfigurations
- microsoft.network/virtualnetworkgateways
- microsoft.network/virtualnetworks
- microsoft.network/virtualnetworktaps
- microsoft.network/virtualrouters
- microsoft.network/virtualwans
- microsoft.network/vpngateways
- microsoft.network/vpnserverconfigurations
- microsoft.network/vpnsites
- microsoft.networkanalytics/dataconnectors
- microsoft.networkanalytics/datalakehouses
- microsoft.networkanalytics/dataproducts
- microsoft.networkanalytics/metricsingestionendpoints
- microsoft.networkcloud/baremetalmachines
- microsoft.networkcloud/cloudservicesnetworks
- microsoft.networkcloud/clustermanagers
- microsoft.networkcloud/clusters
- microsoft.networkcloud/clusters/baremetalmachinekeysets
- microsoft.networkcloud/clusters/bmckeysets
- microsoft.networkcloud/clusters/metricsconfigurations
- microsoft.networkcloud/defaultcninetworks
- microsoft.networkcloud/edgeclusters
- microsoft.networkcloud/edgeclusters/nodes
- microsoft.networkcloud/hybridaksclusters
- microsoft.networkcloud/kubernetesclusters
- microsoft.networkcloud/kubernetesclusters/agentpools
- microsoft.networkcloud/kubernetesclusters/features
- microsoft.networkcloud/l2networks
- microsoft.networkcloud/l3networks
- microsoft.networkcloud/racks
- microsoft.networkcloud/registrationhubs
- microsoft.networkcloud/registrationhubs/images
- microsoft.networkcloud/registrationhubs/machines
- microsoft.networkcloud/storageappliances
- microsoft.networkcloud/trunkednetworks
- microsoft.networkcloud/virtualmachines
- microsoft.networkcloud/virtualmachines/consoles
- microsoft.networkcloud/volumes
- microsoft.networkfunction/azuretrafficcollectors
- microsoft.networkfunction/azuretrafficcollectors/collectorpolicies
- microsoft.networkfunction/meshvpns
- microsoft.networkfunction/vpnbranches
- microsoft.nexusidentity/identitycontrollers
- microsoft.nexusidentity/identitysets
- microsoft.notificationhubs/namespaces
- microsoft.notificationhubs/namespaces/notificationhubs
- microsoft.nutanix/interfaces
- microsoft.nutanix/nodes
- microsoft.objectstore/osnamespaces
- microsoft.offazure/appliances
- microsoft.offazure/hypervsites
- microsoft.offazure/importsites
- microsoft.offazure/mastersites
- microsoft.offazure/serversites
- microsoft.offazure/vmwaresites
- microsoft.offazurespringboot/springbootsites
- microsoft.onlineexperimentation/workspaces
- microsoft.openenergyplatform/energyservices
- microsoft.openlogisticsplatform/applicationmanagers
- microsoft.openlogisticsplatform/applicationworkspaces
- microsoft.openlogisticsplatform/workspaces
- microsoft.operationalinsights/clusters
- microsoft.operationalinsights/querypacks
- microsoft.operationalinsights/workspaces
- microsoft.operationsmanagement/solutions
- microsoft.operationsmanagement/views
- microsoft.orbital/cloudaccessrouters
- microsoft.orbital/contactprofiles
- microsoft.orbital/edgesites
- microsoft.orbital/geocatalogs
- microsoft.orbital/groundstations
- microsoft.orbital/l2connections
- microsoft.orbital/sdwancontrollers
- microsoft.orbital/spacecrafts
- microsoft.orbital/terminals
- microsoft.peering/peerings
- microsoft.peering/peeringservices
- microsoft.pki/pkis
- microsoft.playfab/playeraccountpools
- microsoft.playfab/titles
- microsoft.portal/dashboards
- microsoft.portalsdk/rootresources
- microsoft.portalservices/dashboards
- microsoft.portalservices/extensions
- microsoft.portalservices/extensions/deployments
- microsoft.portalservices/extensions/slots
- microsoft.portalservices/extensions/versions
- microsoft.powerbi/privatelinkservicesforpowerbi
- microsoft.powerbi/tenants
- microsoft.powerbi/workspacecollections
- microsoft.powerbidedicated/autoscalevcores
- microsoft.powerbidedicated/capacities
- microsoft.powerplatform/accounts
- microsoft.powerplatform/enterprisepolicies
- microsoft.professionalservice/resources
- microsoft.programmableconnectivity/gateways
- microsoft.programmableconnectivity/operatorapiconnections
- microsoft.programmableconnectivity/operatorconnections
- microsoft.proposal/proposals
- microsoft.providerhub/providermonitorsettings
- microsoft.purview/accounts
- microsoft.quantum/workspaces
- microsoft.recommendationsservice/accounts
- microsoft.recommendationsservice/accounts/modeling
- microsoft.recommendationsservice/accounts/serviceendpoints
- microsoft.recoveryservices/vaults
- microsoft.redhatopenshift/openshiftclusters
- microsoft.relay/namespaces
- microsoft.remoteapp/collections
- microsoft.resiliency/chaosexperiments
- microsoft.resourceconnector/appliances
- microsoft.resourcegraph/queries
- microsoft.resources/deploymentscripts
- microsoft.resources/mobobrokers
- microsoft.resources/templatespecs
- microsoft.resources/templatespecs/versions
- microsoft.saas/applications
- microsoft.saas/resources
- microsoft.saashub/cloudservices
- microsoft.scom/managedinstances
- microsoft.scvmm/availabilitysets
- microsoft.scvmm/clouds
- microsoft.scvmm/virtualmachines
- microsoft.scvmm/virtualmachines/extensions
- microsoft.scvmm/virtualmachinetemplates
- microsoft.scvmm/virtualnetworks
- microsoft.scvmm/vmmservers
- microsoft.search/searchservices
- microsoft.secretsynccontroller/azurekeyvaultsecretproviderclasses
- microsoft.secretsynccontroller/secretsyncs
- microsoft.security/assignments
- microsoft.security/automations
- microsoft.security/customassessmentautomations
- microsoft.security/customentitystoreassignments
- microsoft.security/datascanners
- microsoft.security/iotsecuritysolutions
- microsoft.security/securityconnectors
- microsoft.security/standards
- microsoft.securitycopilot/capacities
- microsoft.securitydetonation/chambers
- microsoft.securitydevops/azuredevopsconnectors
- microsoft.securitydevops/githubconnectors
- microsoft.securitydevops/gitlabconnectors
- microsoft.securityplatform/accountlinks
- microsoft.servicebus/namespaces
- microsoft.servicefabric/clusters
- microsoft.servicefabric/containergroupsets
- microsoft.servicefabric/managedclusters
- microsoft.servicefabricmesh/applications
- microsoft.servicefabricmesh/gateways
- microsoft.servicefabricmesh/networks
- microsoft.servicefabricmesh/secrets
- microsoft.servicefabricmesh/volumes
- microsoft.servicenetworking/trafficcontrollers
- microsoft.servicenetworking/trafficcontrollers/associations
- microsoft.servicenetworking/trafficcontrollers/frontends
- microsoft.servicenetworking/trafficcontrollers/securitypolicies
- microsoft.serviceshub/connectors
- microsoft.signalrservice/signalr
- microsoft.signalrservice/signalr/replicas
- microsoft.signalrservice/webpubsub
- microsoft.signalrservice/webpubsub/replicas
- microsoft.singularity/accounts
- microsoft.skytap/nodes
- microsoft.softwareplan/softwaresubscriptions
- microsoft.solutions/appliancedefinitions
- microsoft.solutions/appliances
- microsoft.solutions/applicationdefinitions
- microsoft.solutions/applications
- microsoft.solutions/jitrequests
- microsoft.sovereign/landingzoneaccounts
- microsoft.spoolservice/spools
- microsoft.sql/instancepools
- microsoft.sql/managedinstances
- microsoft.sql/managedinstances/databases
- microsoft.sql/servers
- microsoft.sql/servers/databases
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
  - Sample query: [List SQL Databases and their elastic pools](../samples/samples-by-category.md#list-sql-databases-and-their-elastic-pools)
- microsoft.sql/servers/elasticpools
  - Sample query: [List SQL Databases and their elastic pools](../samples/samples-by-category.md#list-sql-databases-and-their-elastic-pools)
- microsoft.sql/servers/jobaccounts
- microsoft.sql/servers/jobagents
- microsoft.sql/virtualclusters
- microsoft.sqlvirtualmachine/sqlvirtualmachinegroups
- microsoft.sqlvirtualmachine/sqlvirtualmachines
- microsoft.standbypool/standbycontainergrouppools
- microsoft.standbypool/standbyvirtualmachinepools
- microsoft.storage/datamovers
- microsoft.storage/storageaccounts
  - Sample query: [Find storage accounts with a specific case-insensitive tag on the resource group](../samples/samples-by-category.md#find-storage-accounts-with-a-specific-case-insensitive-tag-on-the-resource-group)
  - Sample query: [Find storage accounts with a specific case-sensitive tag on the resource group](../samples/samples-by-category.md#find-storage-accounts-with-a-specific-case-sensitive-tag-on-the-resource-group)
  - Sample query: [List all storage accounts with specific tag value](../samples/samples-by-category.md#list-all-storage-accounts-with-specific-tag-value)
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- microsoft.storage/storageaccounts/connectors
- microsoft.storage/storagetasks
- microsoft.storageactions/storagetasks
- microsoft.storagecache/amlfilesystems
- microsoft.storagecache/caches
- microsoft.storagediscovery/storagediscoveryworkspaces
- microsoft.storageinsights/storagecollectionrules
- microsoft.storagemover/storagemovers
- microsoft.storagepool/diskpools
- microsoft.storagesync/storagesyncservices
- microsoft.storagetasks/storagetasks
- microsoft.storsimple/managers
- microsoft.streamanalytics/clusters
- microsoft.streamanalytics/streamingjobs
- microsoft.sustainabilityservices/calculations
- microsoft.swiftlet/virtualmachines
- microsoft.swiftlet/virtualmachinesnapshots
- microsoft.symphony/instances
- microsoft.symphony/solutions
- microsoft.symphony/targets
- microsoft.synapse/privatelinkhubs
- microsoft.synapse/workspaces
- microsoft.synapse/workspaces/bigdatapools
- microsoft.synapse/workspaces/kustopools
- microsoft.synapse/workspaces/sqlpools
- microsoft.syntex/accounts
- microsoft.syntex/documentprocessors
- microsoft.systemintegritymonitoring/simhubs
- microsoft.systemintegritymonitoring/simhubs/deviceprofiles
- microsoft.testbase/testbaseaccounts
- microsoft.testbase/testbaseaccounts/packages
- microsoft.timeseriesinsights/environments
- microsoft.timeseriesinsights/environments/eventsources
- microsoft.timeseriesinsights/environments/referencedatasets
- microsoft.toolchainorchestrator/activations
- microsoft.toolchainorchestrator/campaigns
- microsoft.toolchainorchestrator/campaigns/versions
- microsoft.toolchainorchestrator/catalogs
- microsoft.toolchainorchestrator/catalogs/versions
- microsoft.toolchainorchestrator/diagnostics
- microsoft.toolchainorchestrator/instances
- microsoft.toolchainorchestrator/instances/versions
- microsoft.toolchainorchestrator/solutions
- microsoft.toolchainorchestrator/solutions/versions
- microsoft.toolchainorchestrator/targets
- microsoft.toolchainorchestrator/targets/versions
- microsoft.updatemanager/updaterules
- microsoft.usagebilling/accounts
- microsoft.verifiedid/authorities
- microsoft.videoindexer/accounts
- microsoft.virtualmachineimages/imagetemplates
- microsoft.visualstudio/account
- microsoft.visualstudio/account/extension
- microsoft.visualstudio/account/project
- microsoft.vmware/arczones
- microsoft.vmware/resourcepools
- microsoft.vmware/vcenters
- microsoft.vmware/virtualmachines
- microsoft.vmware/virtualmachinetemplates
- microsoft.vmware/virtualnetworks
- microsoft.vsonline/accounts
- microsoft.vsonline/plans
- microsoft.web/apimanagementaccounts
- microsoft.web/apimanagementaccounts/apis
- microsoft.web/certificates
- microsoft.web/connectiongateways
- microsoft.web/connections
- microsoft.web/containerapps
- microsoft.web/customapis
- microsoft.web/hostingenvironments
- microsoft.web/serverfarms
- microsoft.web/sites
- microsoft.web/sites/certificates
- microsoft.web/sites/slots
- microsoft.web/sites/workflows
- microsoft.web/staticsites
- microsoft.web/workerapps
- microsoft.weightsandbiases/instances
- microsoft.windows365/cloudpcdelegatedmsis
- microsoft.windowsesu/multipleactivationkeys
- microsoft.windowsiot/deviceservices
- microsoft.windowspushnotificationservices/registrations
- microsoft.workloadbuilder/migrationagents
- microsoft.workloadbuilder/workloads
- microsoft.workloads/connectors
- microsoft.workloads/connectors/acssbackups
- microsoft.workloads/connectors/amsinsights
- microsoft.workloads/connectors/sapvirtualinstancemonitors
- microsoft.workloads/epicvirtualinstances
- microsoft.workloads/epicvirtualinstances/databaseinstances
- microsoft.workloads/epicvirtualinstances/hyperspacewebinstances
- microsoft.workloads/epicvirtualinstances/presentationinstances
- microsoft.workloads/epicvirtualinstances/sharedinstances
- microsoft.workloads/epicvirtualinstances/wssinstances
- microsoft.workloads/insights
- microsoft.workloads/instancegroupmonitors
- microsoft.workloads/instancehealthdefinitions
- microsoft.workloads/instancemonitors
- microsoft.workloads/monitors
- microsoft.workloads/oraclevirtualinstances
- microsoft.workloads/oraclevirtualinstances/databaseinstances
- microsoft.workloads/phpworkloads
- microsoft.workloads/sapdiscoverysites
- microsoft.workloads/sapvirtualinstances
- microsoft.workloads/sapvirtualinstances/applicationinstances
- microsoft.workloads/sapvirtualinstances/centralinstances
- microsoft.workloads/sapvirtualinstances/databaseinstances
- microsoft.workloads/virtualinstances
- microsoft.workloads/virtualinstances/components
- microsoft.zerotrustsegmentation/segmentationmanagers
- mongodb.atlas/organizations
- newrelic.observability/monitors
- nginx.nginxplus/nginxdeployments
- oracle.database/autonomousdatabases
- oracle.database/cloudexadatainfrastructures
- oracle.database/cloudvmclusters
- oracle.database/exadbvmclusters
- oracle.database/exascaledbstoragevaults
- paloaltonetworks.cloudngfw/firewalls
- paloaltonetworks.cloudngfw/localrulestacks
- pinecone.vectordb/organizations
- purestorage.block/reservations
- purestorage.block/storagepools
- purestorage.block/volumepools
- qumulo.qaas/storages
- qumulo.storage/filesystems
- sendgrid.email/accounts
- splitio.experimentation/experimentationworkspaces
- wandisco.fusion/fusiongroups
- wandisco.fusion/fusiongroups/azurezones
- wandisco.fusion/fusiongroups/azurezones/plugins
- wandisco.fusion/fusiongroups/managedonpremzones
- wandisco.fusion/fusiongroups/replicationrules
- wandisco.fusion/migrators
- wandisco.fusion/migrators/datatransferagents
- wandisco.fusion/migrators/exclusiontemplates
- wandisco.fusion/migrators/livedatamigrations
- wandisco.fusion/migrators/metadatamigrations
- wandisco.fusion/migrators/metadatatargets
- wandisco.fusion/migrators/pathmappings
- wandisco.fusion/migrators/targets
- wandisco.fusion/migrators/verifications
- anyscale.platform/clouds
- anyscale.platform/clouds/cloudresources
- automationprojects/applications
- kore.agentplatform/organizations
- microsoft.aad/resilienceservices
- microsoft.aad/resilienceservices/hosts
- microsoft.apimanagement/aigateways
- microsoft.app/agentsessions
- microsoft.app/agentspaces
- microsoft.app/appgroups
- microsoft.app/artifactapps
- microsoft.app/artifacts
- microsoft.app/sandboxgroups
- microsoft.applicationmigration/codescansites
- microsoft.applicationmigration/connectionhubs
- microsoft.applicationmigration/containersites
- microsoft.applicationmigration/discoveryhubs
- microsoft.applicationmigration/mongosites
- microsoft.applicationmigration/networksites
- microsoft.applicationmigration/oraclesites
- microsoft.applicationmigration/pgsqlsites
- microsoft.applicationmigration/storagesites
- microsoft.applink/applinks
- microsoft.applink/applinks/applinkmembers
- microsoft.arcnetworking/arcnwloadbalancers
- microsoft.asterra/accounts
- microsoft.asterra/accounts/stamps
- microsoft.awsconnector/bedrockagentaliases
- microsoft.awsconnector/bedrockagents
- microsoft.awsconnector/bedrockdatasources
- microsoft.awsconnector/bedrockguardrails
- microsoft.awsconnector/bedrockknowledgebases
- microsoft.awsconnector/bedrockprompts
- microsoft.awsconnector/iamaccesskeylastuseds
- microsoft.azureactivedirectory/entratenants
- microsoft.azurecontextcache/accounts
- microsoft.azuredatatransfer/pipelines/flowprofiles
- microsoft.azurefleet/regionmixsets
- microsoft.azurefleet/virtualmachinescalesets
- microsoft.azureresiliencemanagement/usageplans
- microsoft.azurestackhci/loadbalancers
- microsoft.azurestackhci/natgateways
- microsoft.azurestackhci/publicipaddresses
- microsoft.azurestackhci/snapshots
- microsoft.azurestackhci/storagearrays
- microsoft.bami/applicationentitlements
- microsoft.bami/applicationentitlements/requests
- microsoft.baremetal/capacityleases
- microsoft.baremetal/hostleases
- microsoft.baremetal/managedconsoleconnections
- microsoft.baremetal/networkinterfaceattachments
- microsoft.baremetal/overlaynetworkingservices
- microsoft.baremetalstorageinfrastructure/baremetalstorageinstances
- microsoft.billingbenefits/conditionalcredits
- microsoft.billingbenefits/flexplans
- microsoft.billingbenefits/freeservices
- microsoft.billingbenefits/spendplans
- microsoft.cdn/profiles/agents
- microsoft.cdn/webagents
- microsoft.cdn/webagents/knowledgesources
- microsoft.chaos/workspaces
- microsoft.chaos/workspaces/connections
- microsoft.cleanroom/collaborations
- microsoft.cleanroom/consortiums
- microsoft.clouddeviceplatform/partnerbusinesses
- microsoft.clouddeviceplatform/sandboxpartners
- microsoft.cognitiveservices/accounts/projects
- microsoft.compute/galleries/instanceprofiles
- microsoft.compute/galleries/instanceprofiles/versions
- microsoft.compute/galleries/scripts
- microsoft.compute/galleries/scripts/versions
- microsoft.compute/interconnectblocks
- microsoft.compute/scheduledactions
- microsoft.compute/workloadspaces
- microsoft.computeschedule/scheduledactions
- microsoft.confluent/organizations/monitors
- microsoft.containerinstance/aiagentsgroups
- microsoft.containerinstance/containergroupprofiles
- microsoft.containerinstance/managedvirtualnodepools
- microsoft.containerinstance/sandboxgroups
- microsoft.containerservice/aimanagers
- microsoft.containerservice/fleets/managednamespaces
- microsoft.containerservice/maintenancewindows
- microsoft.containerservice/managedclusters/managednamespaces
- microsoft.containerservice/nodecustomizations
- microsoft.containerservice/preparedimagespecifications
- microsoft.copilot/chatagents
- microsoft.copilot/spaces
- microsoft.cosmic/namespaces
- microsoft.cosmic/namespaces/components
- microsoft.cosmic/namespaces/components/revisions
- microsoft.cosmic/namespaces/environments
- microsoft.cosmic/namespaces/environments/deployments
- microsoft.cosmic/namespaces/healthmetadatas
- microsoft.datamigration/databasemigrationservices
- microsoft.datamigration/migrationservices
- microsoft.dbforpostgresql/servers
- microsoft.desktopvirtualization/repositoryfolders
- microsoft.deviceregistry/namespaces/assets
- microsoft.deviceregistry/namespaces/certificateauthorities
- microsoft.deviceregistry/namespaces/certificateauthorities/certificatepolicies
- microsoft.deviceregistry/namespaces/credentials
- microsoft.deviceregistry/namespaces/discoveredassets
- microsoft.deviceregistry/namespaces/discovereddevices
- microsoft.deviceregistry/namespaces/groups
- microsoft.deviceregistry/namespaces/jobs
- microsoft.deviceregistry/namespaces/registrydevices
- microsoft.deviceupdate/linkedaccounts
- microsoft.deviceupdate/updateinstances
- microsoft.digitalassets/zkprollups
- microsoft.digitalassets/zkprollups/partitions
- microsoft.discovery/agents
- microsoft.discovery/bookshelves
- microsoft.discovery/datacontainers
- microsoft.discovery/datacontainers/dataassets
- microsoft.discovery/discoveryvaults
- microsoft.discovery/models
- microsoft.discovery/storagecontainers
- microsoft.discovery/storagecontainers/storageassets
- microsoft.discovery/storages
- microsoft.discovery/supercomputers
- microsoft.discovery/supercomputers/nodepools
- microsoft.discovery/tools
- microsoft.discovery/workflows
- microsoft.discovery/workspaces
- microsoft.discovery/workspaces/chatmodeldeployments
- microsoft.discovery/workspaces/projects
- microsoft.edge/solutiondeployments
- microsoft.edge/workflows
- microsoft.enterprisesupport/supportplans
- microsoft.entraidgovernance/guestgovernanceusage
- microsoft.entraidgovernance/scimapiconsumptions
- microsoft.foundrylocal/modeldeployments
- microsoft.gcpconnector/bigquerydatasets
- microsoft.gcpconnector/cloudfunctions
- microsoft.gcpconnector/sqladmininstances
- microsoft.gcpconnector/storagebuckets
- microsoft.genome/accounts
- microsoft.graduationtest/hats
- microsoft.graduationtest/papers
- microsoft.hanaonazure/hanainstances
- microsoft.hanaonazure/sapmonitors
- microsoft.hardware/returns
- microsoft.hardwaresecuritymodules/paymenthsmclusters
- microsoft.healthcareapis/services/privateendpointconnections
- microsoft.healthcareinterop/ddmsconnectors
- microsoft.healthcareinterop/ddmsfhireventbatchchannels
- microsoft.healthcareinterop/ddmsfhirflatfilebatchchannels
- microsoft.healthcareinterop/dicomconnectors
- microsoft.healthcareinterop/dicomdirectchannels
- microsoft.healthcareinterop/dicomedgeconnectors
- microsoft.healthcareinterop/fhirqueryeventbatchchannels
- microsoft.healthcareinterop/fhirqueryflatfilebatchchannels
- microsoft.healthcareinterop/hl7connectors
- microsoft.healthcareinterop/hl7edgeconnectors
- microsoft.healthcareinterop/hubs
- microsoft.healthcareinterop/onelakeconnectors
- microsoft.healthcareinterop/storageaccountconnectors
- microsoft.healthmodel/healthmodels
- microsoft.healthplatform/accounts
- microsoft.horizondb/clusters
- microsoft.horizondb/parametergroups
- microsoft.hybridcompute/machines/applications
- microsoft.inferenceservice/inferenceaccounts
- microsoft.infinitydb/accounts
- microsoft.insights/notificationgroups
- microsoft.integrationspaces/spaces/applications
- microsoft.liftrpilot/agents
- microsoft.liftrpilot/organizationrpib
- microsoft.liftrpilot/organizationsaasdecoupled
- microsoft.liftrpilot/testtrackedresources
- microsoft.liftrpilot/testtrackedsyncresources
- microsoft.loadtestservice/playwrightworkspaces
- microsoft.logic/automationprojects
- microsoft.logic/automationprojects/applications
- microsoft.logic/templates
- microsoft.machinelearningservices/inferencemodels
- microsoft.managednetworkfabric/edgeconnectors
- microsoft.managednetworkfabric/fabrics
- microsoft.managednetworkfabric/fabrics/vlans
- microsoft.managednetworkfabric/fabrics/vrfs
- microsoft.managednetworkfabric/fabrics/vrfs/networks
- microsoft.managednetworkfabric/networkbootstrapdevices
- microsoft.mission/communities/dedicatedhubs
- microsoft.mission/servicecatalogs
- microsoft.monitor/observabilityagents
- microsoft.monitor/slos
- microsoft.netapp/activedirectoryconfigs
- microsoft.netapp/elasticaccounts
- microsoft.netapp/elasticaccounts/elasticbackuppolicies
- microsoft.netapp/elasticaccounts/elasticbackupvaults
- microsoft.netapp/elasticaccounts/elasticcapacitypools
- microsoft.netapp/elasticaccounts/elasticcapacitypools/elasticvolumes
- microsoft.netapp/elasticaccounts/elasticsnapshotpolicies
- microsoft.netapp/externalcacheconnections
- microsoft.netapp/externalclusters
- microsoft.netapp/externalclusters/externalsvms
- microsoft.netapp/externalclusters/externalsvms/externalvolumes
- microsoft.netapp/hybridreplications
- microsoft.netapp/netappaccounts/capacitypools/caches
- microsoft.netapp/netappaccounts/consistencygroups
- microsoft.netapp/policygroups
- microsoft.netapp/policygroups/extendedsnapshotretentionpolicies
- microsoft.netapp/scaleaccounts
- microsoft.netapp/scaleaccounts/scalecapacitypools
- microsoft.netapp/scaleaccounts/scalecapacitypools/scalevolumes
- microsoft.netapp/scaleaccounts/scalesnapshotpolicies
- microsoft.network/authenticationpolicies
- microsoft.network/authorizationpolicies
- microsoft.network/azurediagnosticsgateways
- microsoft.network/azureserviceconnectioncontrollers
- microsoft.network/expressroutelags
- microsoft.network/firstpartyservicetags
- microsoft.network/interconnectgroups
- microsoft.network/networkwatchers/agents
- microsoft.network/networkwatchers/trafficanalytics
- microsoft.network/neuroshields
- microsoft.network/privatetrafficmanagerprofiles
- microsoft.network/probinggateways
- microsoft.network/topologymaps
- microsoft.network/virtualnetworkappliances
- microsoft.networkcloud/accessbridges
- microsoft.networkcloud/kubernetesversions
- microsoft.networkfunction/meshvpns/connectionpolicies
- microsoft.networkfunction/vpnbranches/vpnbranchlinks
- microsoft.networksecurity/agentfabrics
- microsoft.networksecurity/agentfabrics/clusterassociations
- microsoft.networksecurity/agentfabrics/members
- microsoft.networksecurity/neuroshields
- microsoft.networksecurity/policygroups
- microsoft.oriondb/clusters
- microsoft.platformvalidation/cloudvalidations
- microsoft.platformvalidation/cloudvalidations/validationexecutionplans
- microsoft.portalservices/copilots
- microsoft.premonition/libraries
- microsoft.premonition/libraries/analyses
- microsoft.premonition/libraries/samples
- microsoft.privacy/scanners
- microsoft.programenrollment/eduenrollments
- microsoft.proposal/quotes
- microsoft.providerhub/diagnosticagents
- microsoft.quantum/provideraccounts
- microsoft.redhatopenshift/hcpopenshiftclusters
- microsoft.redhatopenshift/hcpopenshiftclusters/nodepools
- microsoft.relay/clusters
- microsoft.resourcebuilder/datacatalogs
- microsoft.resourcebuilder/workspaces
- microsoft.resourcegraph/resourceanalyzeragents
- microsoft.resourceintelligence/agents
- microsoft.resourceintelligence/agentteams
- microsoft.resourceintelligence/appdiscoveryagents
- microsoft.resourcemover/discoveryagents
- microsoft.resourcemover/moveprojects
- microsoft.resourcenotifications/resourcesubscriptions
- microsoft.resourcenotifications/resourcesubscriptions/destinations
- microsoft.resources/regionalmovecontainers
- microsoft.security/privatelinks
- microsoft.security/serviceentitlements
- microsoft.security/serviceentitlementsettings
- microsoft.security/vmscanners
- microsoft.securitybaseplatform/clusters
- microsoft.securitybaseplatform/workspaces
- microsoft.sentinelplatformservices/sentinelplatformservices
- microsoft.servicefabric/clustermigrationagents
- microsoft.softwareplan/softwarebenefits
- microsoft.softwareplan/softwarelicenses
- microsoft.softwareplan/softwareperpetualproducts
- microsoft.sovereign/sovereignviews
- microsoft.storage/contextcaches
- microsoft.storage/quotamanagementgroups
- microsoft.storage/quotamanagementpolicies
- microsoft.storage/storageaccounts/blobaccesspointconfigurations
- microsoft.storage/storageaccounts/datashares
- microsoft.supercomputerinfrastructure/supercomputers
- microsoft.synapse/workspaces/eventstreams
- microsoft.throttling/throttlingaccounts
- microsoft.throttling/throttlingaccounts/rules
- microsoft.updatemanager/inventoryconfigurations
- microsoft.validate/cloudvalidations
- microsoft.validate/cloudvalidations/validationexecutionplans
- microsoft.web/aigateways
- microsoft.web/builderapps
- microsoft.web/connectorgateways
- microsoft.web/serverfarms/silos
- microsoft.web/sites/silos
- microsoft.webiq/accounts
- microsoft.windows365/serviceconnectors
- microsoft.workloads/sapdiscoverysites/sapinstances
- microsoft.workloads/workloadagents
- napster.companionapi/organizations
- oracle.database/dbsystems
- oracle.database/goldengateconnections
- oracle.database/goldengatedeployments
- oracle.database/networkanchors
- oracle.database/resourceanchors
- purestorage.block/storagepools/volumegroups

## saashubresources

- microsoft.saashub/saasresources

## securityresources

> [!NOTE]
> Please note that ARG scrubs PII information from our tables so you may see not see the same result as if you made a GET request on your resource directly. The difference is due to security practices preventing the exposure of any identifiable information. 

For sample queries for this table, see [Resource Graph sample queries for securityresources](../samples/samples-by-table.md#securityresources).

- microsoft.authorization/locks/providers/assessments/governanceassignments
- microsoft.authorization/roleassignments/providers/assessments/governanceassignments
- microsoft.security/apicollections
- microsoft.security/apicollections/apiendpoints
- microsoft.security/assessments
  - Sample query: [Count healthy, unhealthy, and not applicable resources per recommendation](../samples/samples-by-category.md#count-healthy-unhealthy-and-not-applicable-resources-per-recommendation)
  - Sample query: [List Azure Security Center recommendations](../samples/samples-by-category.md)
  - Sample query: [List Container Registry vulnerability assessment results](../samples/samples-by-category.md#list-container-registry-vulnerability-assessment-results)
  - Sample query: [List Qualys vulnerability assessment results](../samples/samples-by-category.md#list-qualys-vulnerability-assessment-results)
- microsoft.security/assessments/governanceassignments
- microsoft.security/assessments/subassessments
  - Sample query: [List Container Registry vulnerability assessment results](../samples/samples-by-category.md#list-container-registry-vulnerability-assessment-results)
  - Sample query: [List Qualys vulnerability assessment results](../samples/samples-by-category.md#list-qualys-vulnerability-assessment-results)
- microsoft.security/attackpaths
- microsoft.security/governancerules
- microsoft.security/healthreports
- microsoft.security/insights
- microsoft.security/integrations
- microsoft.security/iotalerts
  - Sample query: [Get all IoT alerts on hub, filtered by type](../samples/samples-by-category.md#get-all-iot-alerts-on-hub-filtered-by-type)
  - Sample query: [Get specific IoT alert](../samples/samples-by-category.md#get-specific-iot-alert)
- microsoft.security/locations/alerts
- microsoft.security/locations/attackpaths
- microsoft.security/pricings
  - Sample query: [Show Azure Defender pricing tier per subscription](../samples/samples-by-category.md)
- microsoft.security/regulatorycompliancestandards
  - Sample query: [Regulatory compliance state per compliance standard](../samples/samples-by-category.md#regulatory-compliance-state-per-compliance-standard)
- microsoft.security/regulatorycompliancestandards/regulatorycompliancecontrols
- microsoft.security/regulatorycompliancestandards/regulatorycompliancecontrols/regulatorycomplianceassessments
  - Sample query: [Regulatory compliance assessments state](../samples/samples-by-category.md#regulatory-compliance-assessments-state)
- microsoft.security/securescores
  - Sample query: [Secure score per management group](../samples/samples-by-category.md#secure-score-per-management-group)
  - Sample query: [Secure score per subscription](../samples/samples-by-category.md#secure-score-per-subscription)
- microsoft.security/securescores/securescorecontrols
  - Sample query: [Controls secure score per subscription](../samples/samples-by-category.md#controls-secure-score-per-subscription)
- microsoft.security/securityconnectors/devops
- microsoft.security/securityconnectors/devops/azuredevopsorgs
- microsoft.security/securityconnectors/devops/azuredevopsorgs/projects/repos
- microsoft.security/securityconnectors/devops/githubowners
- microsoft.security/securityconnectors/devops/githubowners/repos
- microsoft.security/securityconnectors/devops/gitlabgroups
- microsoft.security/securityconnectors/devops/gitlabgroups/projects
- microsoft.security/softwareinventories
- microsoft.security/softwareinventory
- microsoft.security/standardassignments
- microsoft.security/advancedthreatprotectionsettings
- microsoft.security/cloudinventory
- microsoft.security/cvedetails
- microsoft.security/defenderforstoragesettings
- microsoft.security/risksecurescore
- microsoft.security/securityconnectors/devops/azuredevopsorgs/projects

## servicefabricresources

- microsoft.servicefabric/clusters/applications
- microsoft.servicefabric/clusters/applications/services
- microsoft.servicefabric/clusters/applicationtypes
- microsoft.servicefabric/clusters/applicationtypes/versions
- microsoft.servicefabric/managedclusters
- microsoft.servicefabric/managedclusters/applications
- microsoft.servicefabric/managedclusters/applications/services
- microsoft.servicefabric/managedclusters/applicationtypes
- microsoft.servicefabric/managedclusters/applicationtypes/versions
- microsoft.servicefabric/managedclusters/nodetypes

## servicehealthresources

For sample queries for this table, see [Resource Graph sample queries for servicehealthresources](../samples/samples-by-table.md#servicehealthresources).

- microsoft.resourcehealth/events
  - Sample query: [Active Service Health event subscription impact](../samples/samples-by-category.md#active-service-health-event-subscription-impact)
  - Sample query: [All active health advisory events](../samples/samples-by-category.md#all-active-health-advisory-events)
  - Sample query: [All active planned maintenance events](../samples/samples-by-category.md#all-active-planned-maintenance-events)
  - Sample query: [All active Service Health events](../samples/samples-by-category.md#all-active-service-health-events)
  - Sample query: [All active service issue events](../samples/samples-by-category.md#all-active-service-issue-events)
- microsoft.resourcehealth/events/impactedresources


## sharedgalleryresources

- microsoft.compute/locations/sharedgalleries
- microsoft.compute/locations/sharedgalleries/images
- microsoft.compute/locations/sharedgalleries/images/versions
- microsoft.compute/locations/sharedgallerysubscriptions/sharedgalleries
- microsoft.compute/locations/tenantlevelsharedgallerysubscriptions/sharedgalleries

## spotresources

- microsoft.compute/skualternativespotvmsize/location
- microsoft.compute/skuspotevictionrate/location
- microsoft.compute/skuspotpricehistory/ostype/location

## supercomputerinfraresources

- microsoft.compute/virtualmachinescalesets/virtualmachines
- microsoft.compute/virtualmachinescalesets/virtualmachines/networkinterfaces/ipconfigurations/publicipaddresses
- microsoft.supercomputerinfrastructure/supercomputers/clusters
- microsoft.supercomputerinfrastructure/supercomputers/devicelogicalports
- microsoft.supercomputerinfrastructure/supercomputers/links
- microsoft.supercomputerinfrastructure/supercomputers/maintenancerequests
- microsoft.supercomputerinfrastructure/supercomputers/racks
- microsoft.supercomputerinfrastructure/supercomputers/racks/nics
- microsoft.supercomputerinfrastructure/supercomputers/racks/nodes
- microsoft.supercomputerinfrastructure/supercomputers/switches

## tagsresources

- microsoft.resources/tagnamespaces
- microsoft.resources/tagnamespaces/tagnames
- microsoft.resources/tagnamespaces/tags

## Next steps

- Learn more about the [query language](../concepts/query-language.md).
- Learn more about how to [explore resources](../concepts/explore-resources.md).
- See samples of [Starter queries](../samples/starter.md).
