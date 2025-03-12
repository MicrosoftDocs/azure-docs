---
title: Supported Azure Resource Manager resource types
description: Provide a list of the Azure Resource Manager resource types supported by Azure Resource Graph and Change History.
ms.date: 12/20/2021
ms.topic: reference
ms.custom: generated
---
# Azure Resource Graph table and resource type reference

Azure Resource Graph supports the following **resource types** of
[Azure Resource Manager](../../../azure-resource-manager/management/overview.md). Each **resource type** is
part of a **table** in Resource Graph.

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

## aksresources

- microsoft.containerservice/fleets/autoupgradeprofiles
- microsoft.containerservice/fleets/members
- microsoft.containerservice/fleets/updateruns
- microsoft.containerservice/fleets/updatestrategies

## alertsmanagementresources

- microsoft.alertsmanagement/alerts

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

- "microsoft.resources/capabilities

## chaosresources

- microsoft.chaos/experiments/executions
- microsoft.chaos/experiments/statuses
- microsoft.chaos/targets
- microsoft.chaos/targets/capabilities

## communitygalleryresources

- microsoft.compute/locations/communitygalleries
- microsoft.compute/locations/communitygalleries/applications
- microsoft.compute/locations/communitygalleries/applications/versions
- microsoft.compute/locations/communitygalleries/images
- microsoft.compute/locations/communitygalleries/images/versions

## computeresources

- microsoft.compute/virtualmachinescalesets/virtualmachines
- microsoft.compute/virtualmachinescalesets/virtualmachines/networkinterfaces
- microsoft.compute/virtualmachinescalesets/virtualmachines/networkinterfaces/ipconfigurations/publicipaddresses

## deploymentresources

- microsoft.resources/deploymentstacks

## desktopvirtualizationresources

- microsoft.desktopvirtualization/hostpools/sessionhosts

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

## guestconfigurationresources

For sample queries for this table, see [Resource Graph sample queries for guestconfigurationresources](../samples/samples-by-table.md#guestconfigurationresources).

- microsoft.guestconfiguration/guestconfigurationassignments
  - Sample query: [Count machines in scope of guest configuration policies](../samples/samples-by-category.md#count-machines-in-scope-of-guest-configuration-policies)
  - Sample query: [Count of non-compliant guest configuration assignments](../samples/samples-by-category.md#count-of-non-compliant-guest-configuration-assignments)
  - Sample query: [Find all reasons a machine is non-compliant for guest configuration assignments](../samples/samples-by-category.md#find-all-reasons-a-machine-is-non-compliant-for-guest-configuration-assignments)
- microsoft.guestconfiguration/guestconfigurationassignments/reports

## healthresourcechanges

- microsoft.resources/changes

## healthresources

For sample queries for this table, see [Resource Graph sample queries for healthresources](../samples/samples-by-table.md#healthresources).

- microsoft.resourcehealth/availabilitystatuses
  - Sample query: [Count of virtual machines by availability state and Subscription Id](../samples/samples-by-category.md#count-of-virtual-machines-by-availability-state-and-subscription-id)
  - Sample query: [List of virtual machines and associated availability states by Resource Ids](../samples/samples-by-category.md#list-of-virtual-machines-and-associated-availability-states-by-resource-ids)
  - Sample query: [List of virtual machines by availability state and power state with Resource Ids and resource Groups](../samples/samples-by-category.md#list-of-virtual-machines-by-availability-state-and-power-state-with-resource-ids-and-resource-groups)
  - Sample query: [List of virtual machines that are not Available by Resource Ids](../samples/samples-by-category.md#list-of-virtual-machines-that-are-not-available-by-resource-ids)
- microsoft.resourcehealth/resourceannotations

## impactreportresources

- microsoft.impact/connectors
- microsoft.impact/workloadimpacts
- microsoft.impact/workloadimpacts/insights

## insightresources

- microsoft.insights/datacollectionruleassociations
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

## kubernetesconfigurationresources

For sample queries for this table, see [Resource Graph sample queries for kubernetesconfigurationresources](../samples/samples-by-table.md#kubernetesconfigurationresources).

- microsoft.kubernetesconfiguration/extensions
  - Sample query: [List all Azure Arc-enabled Kubernetes clusters with Azure Monitor extension](../samples/samples-by-category.md#list-all-azure-arc-enabled-kubernetes-clusters-with-azure-monitor-extension)
  - Sample query: [List all Azure Arc-enabled Kubernetes clusters without Azure Monitor extension](../samples/samples-by-category.md#list-all-azure-arc-enabled-kubernetes-clusters-without-azure-monitor-extension)
- microsoft.kubernetesconfiguration/fluxconfigurations
- microsoft.kubernetesconfiguration/namespaces
- microsoft.kubernetesconfiguration/sourcecontrolconfigurations

## kustoresources

- microsoft.kusto/clusters/databases/dataconnections

## maintenanceresourcechanges

- microsoft.resources/changes

## maintenanceresources

- microsoft.containerservice/managedclusters/scheduledevents
- microsoft.maintenance/applyupdates
- microsoft.containerservice/managedclusters/scheduledevents
- microsoft.maintenance/configurationassignments
- microsoft.maintenance/maintenanceconfigurations/applyupdates
- microsoft.maintenance/updates

## managedserviceresources

- microsoft.managedservices/registrationassignments
- microsoft.managedservices/registrationdefinitions

## mirgateresources

- microsoft.migrate/assessmentprojects/aksassessments
- microsoft.migrate/assessmentprojects/aksassessments/assessedwebapps
- microsoft.migrate/assessmentprojects/aksassessments/clusters
- microsoft.migrate/assessmentprojects/aksassessments/costdetails
- microsoft.migrate/assessmentprojects/aksassessments/summaries
- microsoft.migrate/assessmentprojects/assessments
- microsoft.migrate/assessmentprojects/assessments/assessedmachines
- microsoft.migrate/assessmentprojects/assessments/summaries
- microsoft.migrate/assessmentprojects/avsassessments
- microsoft.migrate/assessmentprojects/avsassessments/avsassessedmachines
- microsoft.migrate/assessmentprojects/avsassessments/summaries
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
- microsoft.migrate/assessmentprojects/mysqlassessments
- microsoft.migrate/assessmentprojects/mysqlassessments/assessedinstances
- microsoft.migrate/assessmentprojects/mysqlassessments/summaries
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
- microsoft.migrate/assessmentprojects/webappcompoundassessments/summaries
- microsoft.migrate/migrateprojects/waves
- microsoft.migrate/migrateprojects/waves/workloads
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
- microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems (Backup Items)
- microsoft.recoveryservices/vaults/backupjobs
- microsoft.recoveryservices/vaults/backuppolicies
- microsoft.recoveryservices/vaults/replicationfabrics/replicationprotectioncontainers/replicationprotecteditems
- microsoft.recoveryservices/vaults/replicationjobs
- microsoft.recoveryservices/vaults/replicationpolicies
- microsoft.recoveryservices/vaults/replicationrecoveryplans

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
- microsoft.resources/subscriptions (Subscriptions)
  - Sample query: [Count of subscriptions per management group](../samples/samples-by-category.md#count-of-subscriptions-per-management-group)
  - Sample query: [Key vaults with subscription name](../samples/samples-by-category.md#key-vaults-with-subscription-name)
  - Sample query: [List all management group ancestors for a specified subscription](../samples/samples-by-category.md#list-all-management-group-ancestors-for-a-specified-subscription)
  - Sample query: [List all subscriptions under a specified management group](../samples/samples-by-category.md#list-all-subscriptions-under-a-specified-management-group)
  - Sample query: [Remove columns from results](../samples/samples-by-category.md#remove-columns-from-results)
  - Sample query: [Secure score per management group](../samples/samples-by-category.md#secure-score-per-management-group)
- microsoft.Resources/subscriptions/resourceGroups (Resource groups)
  - Sample query: [Combine results from two queries into a single result](../samples/samples-by-category.md)
  - Sample query: [Find storage accounts with a specific case-insensitive tag on the resource group](../samples/samples-by-category.md#find-storage-accounts-with-a-specific-case-insensitive-tag-on-the-resource-group)
  - Sample query: [Find storage accounts with a specific case-sensitive tag on the resource group](../samples/samples-by-category.md#find-storage-accounts-with-a-specific-case-sensitive-tag-on-the-resource-group)

## resources

For sample queries for this table, see [Resource Graph sample queries for resources](../samples/samples-by-table.md#resources).

- aadsshloginforlinux
- admincenter
- advancedthreatprotection.windows
- arizeai.observabilityeval/organizations
- assessmentplatform
- astronomer.astro/organizations
- azuremonitorlinuxagent
- azuremonitorwindowsagent
- azuresecuritylinuxagent
- azuresecuritywindowsagent
- changetracking-linux
- changetracking-windows
- Citrix.Services/XenAppEssentials (Citrix Virtual Apps Essentials)
- Citrix.Services/XenDesktopEssentials (Citrix Virtual Desktops Essentials)
- commvault.contentstore/cloudaccounts
- customscript
- customscriptextension
- dell.storage/filesystems
- dependencyagentlinux
- dependencyagentwindows
- Dynatrace.Observability/monitors (Dynatrace)
- firstparty
- GitHub.Enterprise/accounts (GitHub AE)
- github.network/networksettings
- hns
- hybridworkerforlinux
- hybridworkerforwindows
- iaasantimalware
- informatica.datamanagement/organizations
- keyvaultforlinux
- keyvaultforwindows
- lambdatest.hyperexecute/organizations
- liftrbasic.samplerp/organizations
- linuxagent.azuresecuritycenter
- linuxagent.sqlserver
- linuxosupdateextension
- linuxpatchextension
- mde.linux
- mde.windows
- microsoft apps/connectedenvironments/certificates
- microsoft.aad/domainservices
- microsoft.aadiam/azureadmetrics
- Mailjet.Email/services (Mailjet Email Service)
- micorosft.web/kubeenvironments
- microsoft.AAD/domainServices (Azure AD Domain Services)
- microsoft.aadiam/azureadmetrics
- microsoft.aadiam/privateLinkForAzureAD (Private Link for Azure AD)
- microsoft.aadiam/tenants
- microsoft.AgFoodPlatform/farmBeats (Azure FarmBeats)
- microsoft.agricultureplatform/agriservices
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
- microsoft.app/connectedenvironments/certificates
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
- microsoft.awsconnector/guarddutydetectors
- microsoft.awsconnector/iamaccesskeymetadata
- microsoft.awsconnector/iamgroups
- microsoft.awsconnector/iaminstanceprofiles
- microsoft.awsconnector/iammfadevices
- microsoft.awsconnector/iampasswordpolicies
- microsoft.awsconnector/iampolicyversions
- microsoft.awsconnector/iamroles
- microsoft.awsconnector/iamservercertificates"
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
- microsoft.AzureActiveDirectory/b2cDirectories (B2C Tenants)
- microsoft.azureactivedirectory/ciamdirectories
- microsoft.AzureActiveDirectory/guestUsages (Guest Usages)
- microsoft.AzureArcData/dataControllers (Azure Arc data controllers)
- microsoft.AzureArcData/postgresInstances (Azure Arc-enabled PostgreSQL Hyperscale server groups)
- microsoft.AzureArcData/sqlManagedInstances (SQL managed instances - Azure Arc)
- microsoft.azurearcdata/sqlserveresulicenses
- microsoft.AzureArcData/sqlServerInstances (SQL Server - Azure Arc)
- microsoft.azurearcdata/sqlserverinstances/availabilitygroups
- microsoft.azurearcdata/sqlserverinstances/databases
- microsoft.azurearcdata/sqlserverlicenses
- microsoft.azurecis/dstsserviceclientidentities
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
- microsoft.bakeryhybrid/pies
- microsoft.baremetal/baremetalconnections
- microsoft.baremetal/consoleconnections
- microsoft.BareMetal/crayServers (Cray Servers)
- microsoft.Baremetal/monitoringServers (Monitoring Servers)
- microsoft.baremetal/peeringsettings
- microsoft.BareMetalInfrastructure/bareMetalInstances (BareMetal Instances)
- microsoft.baremetalinfrastructure/baremetalstorageinstances
- microsoft.Batch/batchAccounts (Batch accounts)
- microsoft.billingbenefits/credits
- microsoft.billingbenefits/discounts
- microsoft.billingbenefits/incentiveschedules
- microsoft.billingbenefits/maccs
- microsoft.Bing/accounts (Bing Resources)
- microsoft.biztalkservices/biztalk
- microsoft.bluefin/instances
- microsoft.bluefin/instances/datasets
- icrosoft.bluefin/instances/pipelines
- microsoft.BotService/botServices (Bot Services)
- microsoft.Cache/Redis (Azure Cache for Redis)
- microsoft.Cache/RedisEnterprise (Redis Enterprise)
- microsoft.Cdn/CdnWebApplicationFirewallPolicies (Web application firewall policies (WAF))
- microsoft.cdn/edgeactions
- microsoft.cdn/edgeactions/attachments
- microsoft.cdn/edgeactions/executionfilters
- microsoft.cdn/edgeactions/versions
- microsoft.cdn/profiles (Front Doors Standard/Premium (Preview))
- microsoft.Cdn/Profiles/AfdEndpoints (Endpoints)
- microsoft.cdn/profiles/endpoints (Endpoints)
- microsoft.CertificateRegistration/certificateOrders (App Service Certificates)
- microsoft.chaos/applications
- microsoft.chaos/chaosexperiments (Chaos Experiments (Classic))
- microsoft.chaos/experiments (Chaos Experiments)
- microsoft.chaos/privateaccesses
- microsoft.chaos/resilienceprofiles
- microsoft.classicCompute/domainNames (Cloud services (classic))
- microsoft.ClassicCompute/VirtualMachines (Virtual machines (classic))
- microsoft.ClassicNetwork/networkSecurityGroups (Network security groups (classic))
- microsoft.ClassicNetwork/reservedIps (Reserved IP addresses (classic))
- microsoft.ClassicNetwork/virtualNetworks (Virtual networks (classic))
- microsoft.ClassicStorage/StorageAccounts (Storage accounts (classic))
- microsoft.cleanroom/cleanrooms
- microsoft.cleanroom/microservices
- microsoft.clouddeviceplatform/delegatedidentities
- microsoft.cloudes/accounts
- microsoft.cloudhealth/healthmodels
- microsoft.CloudTest/accounts (CloudTest Accounts)
- microsoft.cloudtest/buildcaches
- microsoft.CloudTest/hostedpools (1ES Hosted Pools)
- microsoft.CloudTest/images (CloudTest Images)
- microsoft.CloudTest/pools (CloudTest Pools)
- microsoft.ClusterStor/nodes (ClusterStors)
- microsoft.codesigning/codesigningaccounts
- microsoft.codespaces/plans
- microsoft.Cognition/syntheticsAccounts (Synthetics Accounts)
- microsoft.cognitivesearch/indexes
- microsoft.CognitiveServices/accounts (Cognitive Services)
- microsoft.cognitiveservices/commitmentplans
- microsoft.community/communitytrainings
- microsoft.compositesolutions/compositesolutiondefinitions
- microsoft.compositesolutions/compositesolutions
- microsoft.Compute/availabilitySets (Availability sets)
- microsoft.Compute/capacityReservationGroups (Capacity Reservation Groups)
- microsoft.compute/capacityreservationgroups/capacityreservations
- microsoft.compute/cloudservices
- microsoft.compute/capacityreservations
- microsoft.Compute/cloudServices (Cloud services (extended support))
- microsoft.compute/cloudservices/roleinstances/networkinterfaces
- microsoft.compute/cloudservices/roleinstances/networkinterfaces/ipconfigurations/publicipaddresses
- microsoft.Compute/diskAccesses (Disk Accesses)
- microsoft.Compute/diskEncryptionSets (Disk Encryption Sets)
- microsoft.Compute/disks (Disks)
- microsoft.Compute/galleries (Azure compute galleries)
- microsoft.Compute/galleries/applications (VM application definitions)
- microsoft.Compute/galleries/applications/versions (VM application versions)
- microsoft.Compute/galleries/images (VM image definitions)
- microsoft.Compute/galleries/images/versions (VM image versions)
- microsoft.compute/galleries/invmaccesscontrolprofiles
- microsoft.compute/galleries/invmaccesscontrolprofiles/versions
- microsoft.compute/galleries/remotecontainerimages
- microsoft.compute/galleries/serviceartifacts
- microsoft.Compute/hostgroups (Host groups)
- microsoft.Compute/hostgroups/hosts (Hosts)
- microsoft.Compute/images (Images)
- microsoft.Compute/ProximityPlacementGroups (Proximity placement groups)
- microsoft.Compute/restorePointCollections (Restore Point Collections)
- microsoft.compute/sharedvmextensions
- microsoft.compute/sharedvmextensions/versions
- microsoft.compute/sharedvmimages
- microsoft.compute/sharedvmimages/versions
- microsoft.Compute/snapshots (Snapshots)
- microsoft.Compute/sshPublicKeys (SSH keys)
- microsoft.compute/swiftlets
- microsoft.Compute/VirtualMachines (Virtual machines)
  - Sample query: [Count of virtual machines by power state](../samples/samples-by-category.md#count-of-virtual-machines-by-power-state)
  - Sample query: [Count virtual machines by OS type](../samples/samples-by-category.md#count-virtual-machines-by-os-type)
  - Sample query: [Count virtual machines by OS type with extend](../samples/samples-by-category.md#count-virtual-machines-by-os-type-with-extend)
  - Sample query: [List all extensions installed on a virtual machine](../samples/samples-by-category.md#list-all-extensions-installed-on-a-virtual-machine)
  - Sample query: [List machines that are not running and the last compliance status](../samples/samples-by-category.md#list-machines-that-are-not-running-and-the-last-compliance-status)
  - Sample query: [List of virtual machines by availability state and power state with Resource Ids and resource Groups](../samples/samples-by-category.md#list-of-virtual-machines-by-availability-state-and-power-state-with-resource-ids-and-resource-groups)
  - Sample query: [List virtual machines with their network interface and public IP](../samples/samples-by-category.md#list-virtual-machines-with-their-network-interface-and-public-ip)
  - Sample query: [Show all virtual machines ordered by name in descending order](../samples/samples-by-category.md#show-all-virtual-machines-ordered-by-name-in-descending-order)
  - Sample query: [Show first five virtual machines by name and their OS type](../samples/samples-by-category.md#show-first-five-virtual-machines-by-name-and-their-os-type)
  - Sample query: [Summarize virtual machine by the power states extended property](../samples/samples-by-category.md#summarize-virtual-machine-by-the-power-states-extended-property)
  - Sample query: [Virtual machines matched by regex](../samples/samples-by-category.md#virtual-machines-matched-by-regex)
- microsoft.compute/virtualmachines/extensions
  - Sample query: [List all extensions installed on a virtual machine](../samples/samples-by-category.md#list-all-extensions-installed-on-a-virtual-machine)
- microsoft.compute/virtualmachines/runcommands
- microsoft.compute/virtualmachines/vmapplications
- microsoft.Compute/virtualMachineScaleSets (Virtual machine scale sets)
  - Sample query: [Get virtual machine scale set capacity and size](../samples/samples-by-category.md#get-virtual-machine-scale-set-capacity-and-size)
- microsoft.compute/virtualmachinescalesets/virtualmachines/networkinterfaces/ipconfigurations/publicipaddresses
- microsoft.computeschedule/autoactions
- microsoft.ConfidentialLedger/ledgers (Confidential Ledgers)
- microsoft.confidentialledger/managedccfs
- microsoft.Confluent/organizations (Confluent organizations)
- microsoft.ConnectedCache/cacheNodes (Connected Cache Resources)
- microsoft.ConnectedCache/enterpriseCustomers (Connected Cache Resources)
- microsoft.connectedcache/enterprisemcccustomers
- microsoft.connectedcache/enterprisemcccustomers/enterprisemcccachenodes
- microsoft.connectedcache/ispcustomers
- microsoft.connectedcache/ispcustomers/ispcachenodes
- microsoft.connectedcredentials/credentials
- microsoft.connectedopenstack/heatstacks
- microsoft.connectedopenstack/openstackidentities
- microsoft.ConnectedVehicle/platformAccounts (Connected Vehicle Platforms)
- microsoft.connectedvmwarevsphere/clusters
- microsoft.connectedvmwarevsphere/datastores
- microsoft.connectedvmwarevsphere/hosts
- microsoft.connectedvmwarevsphere/resourcepools
- microsoft.connectedVMwareVSphere/vCenters (VMware vCenters)
- microsoft.ConnectedVMwarevSphere/VirtualMachines (VMware + AVS virtual machines)
- microsoft.connectedvmwarevsphere/virtualmachines/extensions
- microsoft.connectedvmwarevsphere/virtualmachinetemplates
- microsoft.connectedvmwarevsphere/virtualnetworks
- microsoft.containerinstance/containergroupprofile
- microsoft.ContainerInstance/containerGroups (Container instances)
- microsoft.containerinstance/containerscalesets
- microsoft.containerinstance/ngroups
- microsoft.ContainerRegistry/registries (Container registries)
- microsoft.containerregistry/registries/agentpools
- microsoft.containerregistry/registries/buildtasks
- microsoft.ContainerRegistry/registries/replications (Container registry replications)
- microsoft.containerregistry/registries/taskruns
- microsoft.containerregistry/registries/tasks
- microsoft.ContainerRegistry/registries/webhooks (Container registry webhooks)
- microsoft.containerservice/containerservices
- microsoft.containerservice/fleets
- microsoft.ContainerService/managedClusters (Kubernetes services)
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- microsoft.containerservice/managedclustersnapshots
- microsoft.containerservice/snapshots
- microsoft.containerstorage/pools
- microsoft.contoso/clusters
- microsoft.contoso/employees
- microsoft.contoso/employees/desks
- microsoft.contoso/installations
- microsoft.contoso/recipes
- microsoft.contoso/towers
- microsoft.costmanagement/connectors
- microsoft.customproviders/resourceproviders
- microsoft.d365customerinsights/instances
- microsoft.dashboard/dashboards
- microsoft.Dashboard/grafana (Grafana Workspaces)
- microsoft.dashboard/grafana/integrationfabrics
- microsoft.dashboard/grafana/managedprivateendpoints
- microsoft.dataaccelerator/indexclusters
- microsoft.databasefleetmanager/fleets
- microsoft.databasewatcher/watchers
- microsoft.DataBox/jobs (Azure Data Box)
- microsoft.DataBoxEdge/dataBoxEdgeDevices (Azure Stack Edge / Data Box Gateway)
- microsoft.databricks/accessconnectors
- microsoft.Databricks/workspaces (Azure Databricks Services)
- microsoft.datacollaboration/workspaces
- microsoft.datadog/monitors
- microsoft.DataFactory/factories (Data factories (V2))
- microsoft.DataLakeAnalytics/accounts (Data Lake Analytics)
- microsoft.DataLakeStore/accounts (Data Lake Storage Gen1)
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- microsoft.datamigration/controllers
- microsoft.datamigration/migrationservice
- microsoft.DataMigration/services (Azure Database Migration Services)
- microsoft.DataMigration/services/projects (Azure Database Migration Projects)
- microsoft.datamigration/slots
- microsoft.datamigration/sqlmigrationservices (Azure Database Migration Services)
- microsoft.dataplatform/capacities
- microsoft.DataProtection/BackupVaults (Backup vaults)
- microsoft.DataProtection/resourceGuards (Resource Guards (Preview))
- microsoft.datareplication/replicationfabrics
- microsoft.DataReplication/replicationVaults (Site Recovery Vaults)
- microsoft.DataShare/accounts (Data Shares)
- microsoft.DBforMariaDB/servers (Azure Database for MariaDB servers)
- microsoft.DBforMySQL/flexibleServers (Azure Database for MySQL flexible servers)
- microsoft.DBforMySQL/servers (Azure Database for MySQL servers)
- microsoft.DBforPostgreSQL/flexibleServers (Azure Database for PostgreSQL flexible servers)
- microsoft.DBforPostgreSQL/serverGroupsv2 (Azure Database for PostgreSQL server groups)
- microsoft.DBforPostgreSQL/serverGroups (Azure Database for PostgreSQL server groups)
- microsoft.delegatednetwork/controller
- microsoft.delegatednetwork/delegatedsubnets
- microsoft.delegatednetwork/orchestratorinstances
- microsoft.delegatednetwork/orchestrators
- microsoft.dependencymap/maps
- microsoft.dependencymap/maps/discoverysources
- microsoft.desktopvirtualization/appattachpackages
- microsoft.DesktopVirtualization/ApplicationGroups (Application groups)
- microsoft.desktopvirtualization/connectionpolicies
- microsoft.DesktopVirtualization/HostPools (Host pools)
- microsoft.DesktopVirtualization/ScalingPlans (Scaling plans)
- microsoft.DesktopVirtualization/Workspaces (Workspaces)
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
- microsoft.Devices/IotHubs (IoT Hub)
- microsoft.Devices/ProvisioningServices (Device Provisioning Services)
- microsoft.DeviceUpdate/Accounts (Device Update for IoT Hubs)
- microsoft.deviceupdate/accounts/agents
- microsoft.deviceupdate/accounts/instances
- microsoft.deviceupdate/updateaccounts
- microsoft.deviceupdate/updateaccounts/activedeployments
- microsoft.deviceupdate/updateaccounts/agents
- microsoft.deviceupdate/updateaccounts/deployments
- microsoft.deviceupdate/updateaccounts/deviceclasses
- microsoft.deviceupdate/updateaccounts/updates
- microsoft.devops/pipelines (DevOps Starter)
- microsoft.devopsinfrastructure/pools
- microsoft.devtestlab/labcenters
- microsoft.DevTestLab/labs (DevTest Labs)
- microsoft.devtestlab/labs/servicerunners
- microsoft.DevTestLab/labs/virtualMachines (Virtual machines)
- microsoft.devtestlab/schedules
- microsoft.devtunnels/tunnelplans
- microsoft.DigitalTwins/digitalTwinsInstances (Azure Digital Twins)
- microsoft.dns/dnszones/cname
- microsoft.DocumentDB/cassandraClusters (Azure Managed Instance for Apache Cassandra)
- microsoft.DocumentDb/databaseAccounts (Azure Cosmos DB accounts)
  - Sample query: [List Azure Cosmos DB with specific write locations](../samples/samples-by-category.md#list-azure-cosmos-db-with-specific-write-locations)
- microsoft.documentdb/fleets
- microsoft.documentdb/garnetclusters
- microsoft.documentdb/managedresources
- microsoft.documentdb/mongoclusters
- microsoft.documentdb/throughputpools
- microsoft.DomainRegistration/domains (App Service Domains)
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
- microsoft.EdgeOrder/addresses (Azure Edge Hardware Center Address)
- microsoft.edgeorder/bootstrapconfigurations
- microsoft.EdgeOrder/orderItems (Azure Edge Hardware Center)
- microsoft.edgezones/edgezones
- microsoft.Elastic/monitors (Elasticsearch (Elastic Cloud))
- microsoft.elasticsan/elasticsans
- microsoft.elasticsan/elasticsans/volumegroups
- microsoft.energydataplatform/energyservices
- microsoft.enterprisesupport/enterprisesupports
- microsoft.EventGrid/domains (Event Grid Domains)
- microsoft.eventgrid/namespaces
- microsoft.eventgrid/partnerconfigurations
- microsoft.eventgrid/partnerdestinations
- microsoft.EventGrid/partnerNamespaces (Event Grid Partner Namespaces)
- microsoft.EventGrid/partnerRegistrations (Event Grid Partner Registrations)
- microsoft.EventGrid/partnerTopics (Event Grid Partner Topics)
- microsoft.EventGrid/systemTopics (Event Grid System Topics)
- microsoft.EventGrid/topics (Event Grid Topics)
- microsoft.EventHub/clusters (Event Hubs Clusters)
- microsoft.EventHub/namespaces (Event Hubs Namespaces)
- microsoft.Experimentation/experimentWorkspaces (Experiment Workspaces)
- microsoft.ExtendedLocation/CustomLocations (Custom locations)
  - Sample query: [List Azure Arc-enabled custom locations with VMware or SCVMM enabled](../samples/samples-by-category.md#list-azure-arc-enabled-custom-locations-with-vmware-or-scvmm-enabled)
- microsoft.extendedlocation/customlocations/resourcesyncrules
- microsoft.fabric/capacitie
- microsoft.fabric/privatelinkservicesforfabric
- microsoft.fairfieldgardens/provisioningresources
- microsoft.fairfieldgardens/provisioningresources/provisioningpolicies
- microsoft.falcon/namespaces
- microsoft.fidalgo/projects/pool
- microsoft.fileshares/fileshares
- microsoft.FluidRelay/fluidRelayServers (Fluid Relay)
- microsoft.footprintmonitoring/profiles
- microsoft.gaming/titles
- microsoft.graph/azureadapplication
- microsoft.graphservices/accounts
v
- microsoft.hardware/orders
- microsoft.hardwaresecuritymodules/cloudhsmclusters
- microsoft.hardwaresecuritymodules/dedicatedhsms
- microsoft.HDInsight/clusterpools (HDInsight cluster pools)
- microsoft.HDInsight/clusterpools/clusters (HDInsight gen2 clusters)
- microsoft.HDInsight/clusters (HDInsight clusters)
- microsoft.HealthBot/healthBots (Azure Health Bot)
- microsoft.HealthcareApis/services (Azure API for FHIR)
- microsoft.HealthcareApis/workspaces (Healthcare APIs Workspaces)
- microsoft.healthcareapis/workspaces/analyticsconnectors
- microsoft.HealthcareApis/workspaces/dicomservices (DICOM services)
- microsoft.HealthcareApis/workspaces/fhirservices (FHIR services)
- microsoft.HealthcareApis/workspaces/iotconnectors (IoT connectors)
- microsoft.healthdataaiservices/deidservices
- microsoft.healthdataaiservices/deidservices
- microsoft.HpcWorkbench/instances (HPC Workbenches (preview))
- microsoft.hpcworkbench/instances/chambers
- microsoft.hpcworkbench/instances/chambers/accessprofiles
- microsoft.hpcworkbench/instances/chambers/workloads
- microsoft.hpcworkbench/instances/consortiums
- microsoft.hybridcloud/cloudconnections
- microsoft.hybridcloud/cloudconnectors
- microsoft.hybridcompute/gateways
- microsoft.hybridcompute/licenses
- microsoft.HybridCompute/machines (Servers - Azure Arc)
  - Sample query: [Get count and percentage of Arc-enabled servers by domain](../samples/samples-by-category.md#get-count-and-percentage-of-arc-enabled-servers-by-domain)
  - Sample query: [List all extensions installed on an Azure Arc-enabled server](../samples/samples-by-category.md#list-all-extensions-installed-on-an-azure-arc-enabled-server)
  - Sample query: [List Arc-enabled servers not running latest released agent version](../samples/samples-by-category.md#list-arc-enabled-servers-not-running-latest-released-agent-version)
- microsoft.hybridcompute/machines/extensions
  - Sample query: [List all extensions installed on an Azure Arc-enabled server](../samples/samples-by-category.md#list-all-extensions-installed-on-an-azure-arc-enabled-server)
- microsoft.hybridcompute/machines/licenseprofiles
- microsoft.hybridcompute/machines/runcommands
- microsoft.HybridCompute/privateLinkScopes (Azure Arc Private Link Scopes)
- microsoft.hybridconnectivity/publiccloudconnectors
- microsoft.hybridcontainerservice/provisionedclusters
- microsoft.hybridcontainerservice/provisionedclusters/agentpools
- microsoft.hybridcontainerservice/storagespaces
- microsoft.hybridcontainerservice/virtualnetworks
- microsoft.HybridData/dataManagers (StorSimple Data Managers)
- microsoft.hybridnetwork/configurationgroupvalues
- microsoft.HybridNetwork/devices (Azure Network Function Manager – Devices)
- microsoft.HybridNetwork/networkFunctions (Azure Network Function Manager – Network Functions)
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
- microsoft.KeyVault/vaults (Key vaults)
  - Sample query: [Count key vault resources](../samples/samples-by-category.md#count-key-vault-resources)
  - Sample query: [Key vaults with subscription name](../samples/samples-by-category.md#key-vaults-with-subscription-name)
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- microsoft.Kubernetes/connectedClusters (Kubernetes - Azure Arc)
  - Sample query: [List all Azure Arc-enabled Kubernetes clusters without Azure Monitor extension](../samples/samples-by-category.md#list-all-azure-arc-enabled-kubernetes-clusters-without-azure-monitor-extension)
  - Sample query: [List all Azure Arc-enabled Kubernetes resources](../samples/samples-by-category.md#list-all-azure-arc-enabled-kubernetes-resources)
- microsoft.kubernetes/connectedclusters
- microsoft.kubernetesconfiguration/privatelinkscopes
- microsoft.Kusto/clusters (Azure Data Explorer Clusters)
- microsoft.kx/kdbinsightsenterprise
- microsoft.LabServices/labAccounts (Lab Services)
- microsoft.labservices/labplans
- microsoft.labservices/labs
- microsoft.liftrpilot/organizations
- microsoft.LoadTestService/LoadTests (Azure Load Testing)
- microsoft.logic/businessprocesses
- microsoft.Logic/integrationAccounts (Integration accounts)
- microsoft.Logic/integrationServiceEnvironments (Integration Service Environments)
- microsoft.Logic/integrationServiceEnvironments/managedApis (Managed Connector)
- microsoft.Logic/workflows (Logic apps)
- microsoft.machinelearning/webservices
- microsoft.machinelearningservices/registries
- microsoft.machinelearningservices/virtualclusters
- microsoft.machinelearningservices/workspaces
- microsoft.machinelearningservices/workspaces/batchendpoints
- microsoft.machinelearningservices/workspaces/batchendpoints/deployments
- microsoft.machinelearningservices/workspaces/inferencepools
- microsoft.machinelearningservices/workspaces/inferencepools/endpoints
- microsoft.machinelearningservices/workspaces/inferencepools/groups
- microsoft.MachineLearningServices/workspaces/onlineEndpoints (Machine learning online endpoints)
- microsoft.MachineLearningServices/workspaces/onlineEndpoints/deployments (Machine learning online deployments)
- microsoft.machinelearningservices/workspaces/registries
- microsoft.machinelearningservices/workspaces/serverlessendpoints 
- microsoft.Maintenance/maintenanceConfigurations (Maintenance Configurations)
- microsoft.maintenance/maintenancepolicies
- microsoft.maintenance/orchestrationpreferences
- microsoft.ManagedIdentity/userAssignedIdentities (Managed Identities)
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
- microsoft.manufacturingplatform/manufacturingdataservices
- microsoft.Maps/accounts (Azure Maps Accounts)
- microsoft.Maps/accounts/creators (Azure Maps Creator Resources)
- microsoft.media/mediaservice
- microsoft.maps/accounts/privateatlases
- microsoft.media/mediaservices/liveevents (Live events)
- microsoft.media/mediaservices/streamingendpoints (Streaming Endpoints)
- microsoft.media/mediaservices/transforms
- microsoft.media/videoanalyzers (Video Analyzers)
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
- microsoft.MixedReality/objectAnchorsAccounts (Object Anchors Accounts)
- microsoft.MixedReality/objectUnderstandingAccounts (Object Understanding Accounts)
- microsoft.MixedReality/remoteRenderingAccounts (Remote Rendering Accounts)
- microsoft.MixedReality/spatialAnchorsAccounts (Spatial Anchors Accounts)
- microsoft.mixedreality/spatialmapsaccounts
- microsoft.mobilenetwork/amfdeployments
- microsoft.mobilenetwork/clusterservices
- microsoft.MobileNetwork/mobileNetworks (Mobile Networks)
- microsoft.mobilenetwork/mobilenetworks/datanetworks
- microsoft.mobilenetwork/mobilenetworks/edgenetworksecuritygroups
- microsoft.MobileNetwork/mobileNetworks/services (Services)
- microsoft.mobilenetwork/mobilenetworks/simpolicies
- microsoft.MobileNetwork/mobileNetworks/sites (Mobile Network Sites)
- microsoft.mobilenetwork/mobilenetworks/slices
- microsoft.mobilenetwork/mobilenetworks/wifissids
- microsoft.mobilenetwork/nrfdeployments
- microsoft.mobilenetwork/nssfdeployments
- microsoft.mobilenetwork/observabilityservices
- microsoft.MobileNetwork/packetCoreControlPlanes (Arc for network functions – Packet Cores)
- microsoft.mobilenetwork/packetcorecontrolplanes/packetcoredataplanes
- microsoft.mobilenetwork/packetcorecontrolplanes/packetcoredataplanes/attacheddatanetworks
- microsoft.mobilenetwork/packetcorecontrolplanes/packetcoredataplanes/attachedwifissids
- microsoft.mobilenetwork/packetcorecontrolplanes/packetcoredataplanes/edgevirtualnetworks
- microsoft.mobilenetwork/radioaccessnetworks
- microsoft.mobilenetwork/simgroups"
- microsoft.MobileNetwork/sims (Sims)
- microsoft.mobilenetwork/sims/simprofiles
- microsoft.mobilenetwork/smfdeployments
- microsoft.mobilenetwork/upfdeployments
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
- microsoft.NetApp/netAppAccounts (NetApp accounts)
- microsoft.netapp/netappaccounts/backuppolicies
- microsoft.netapp/netappaccounts/backupvaults
- 
- microsoft.NetApp/netAppAccounts/capacityPools (Capacity pools)
- microsoft.NetApp/netAppAccounts/capacityPools/Volumes (Volumes)
- microsoft.netapp/netappaccounts/capacitypools/volumes/mounttargets
- microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots (Snapshots)
- microsoft.netapp/netappaccounts/capacitypools/volumes/subvolumes
- microsoft.NetApp/netAppAccounts/snapshotPolicies (Snapshot policies)
- microsoft.Network/applicationGateways (Application gateways)
- microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies (Web application firewall policies (WAF))
- microsoft.Network/applicationSecurityGroups (Application security groups)
- microsoft.Network/azureFirewalls (Firewalls)
- microsoft.Network/bastionHosts (Bastions)
- microsoft.Network/connections (Connections)
- microsoft.Network/customIpPrefixes (Custom IP Prefixes)
- microsoft.network/ddoscustompolicies
- microsoft.Network/ddosProtectionPlans (DDoS protection plans)
- microsoft.Network/dnsForwardingRulesets (Dns Forwarding Rulesets)
- microsoft.Network/dnsResolvers (DNS Private Resolvers)
- microsoft.Network/dnsZones (DNS zones)
- microsoft.network/dscpconfigurations
- microsoft.Network/expressRouteCircuits (ExpressRoute circuits)
- microsoft.network/expressroutecrossconnections
- microsoft.network/expressroutegateways
- microsoft.Network/expressRoutePorts (ExpressRoute Direct)
- microsoft.Network/firewallPolicies (Firewall Policies)
- microsoft.network/firewallpolicies/rulegroups
- microsoft.Network/frontdoors (Front Doors)
- microsoft.Network/FrontDoorWebApplicationFirewallPolicies (Web Application Firewall policies (WAF))
- microsoft.network/ipallocations
- microsoft.Network/ipGroups (IP Groups)
- microsoft.Network/LoadBalancers (Load balancers)
- microsoft.Network/localnetworkgateways (Local network gateways)
- microsoft.network/mastercustomipprefixes
- microsoft.Network/natGateways (NAT gateways)
- microsoft.Network/NetworkExperimentProfiles (Internet Analyzer profiles)
- microsoft.network/networkintentpolicies
- microsoft.Network/networkinterfaces (Network interfaces)
  - Sample query: [Get virtual networks and subnets of network interfaces](../samples/samples-by-category.md#get-virtual-networks-and-subnets-of-network-interfaces)
  - Sample query: [List virtual machines with their network interface and public IP](../samples/samples-by-category.md#list-virtual-machines-with-their-network-interface-and-public-ip)
- microsoft.Network/networkManagers (Network Managers)
- microsoft.network/networkprofiles
- microsoft.Network/NetworkSecurityGroups (Network security groups)
  - Sample query: [Show unassociated network security groups](../samples/samples-by-category.md#show-unassociated-network-security-groups)
- microsoft.network/networksecurityperimeters
- microsoft.network/networkvirtualappliances
- microsoft.network/networkwatchers (Network Watchers)
- microsoft.network/networkwatchers/connectionmonitors
- microsoft.network/networkwatchers/flowlogs (NSG Flow Logs)
- microsoft.network/networkwatchers/lenses
- microsoft.network/networkwatchers/pingmeshes
- microsoft.network/p2svpngateways
- microsoft.Network/privateDnsZones (Private DNS zones)
- microsoft.network/privatednszones/virtualnetworklinks
- microsoft.network/privateendpointredirectmaps
- microsoft.Network/privateEndpoints (Private endpoints)
- microsoft.Network/privateLinkServices (Private link services)
- microsoft.Network/PublicIpAddresses (Public IP addresses)
  - Sample query: [List virtual machines with their network interface and public IP](../samples/samples-by-category.md#list-virtual-machines-with-their-network-interface-and-public-ip)
- microsoft.Network/publicIpPrefixes (Public IP Prefixes)
- microsoft.Network/routeFilters (Route filters)
- microsoft.Network/routeTables (Route tables)
- microsoft.network/sampleresources
- microsoft.network/securitypartnerproviders
- microsoft.Network/serviceEndpointPolicies (Service endpoint policies)
- microsoft.Network/trafficmanagerprofiles (Traffic Manager profiles)
- microsoft.network/virtualhubs
- microsoft.network/virtualhubs/bgpconnections
- microsoft.network/virtualhubs/ipconfigurations
- microsoft.Network/virtualNetworkGateways (Virtual network gateways)
- microsoft.Network/virtualNetworks (Virtual networks)
- microsoft.network/virtualnetworktaps
- microsoft.network/virtualrouters
- microsoft.Network/virtualWans (Virtual WANs)
- microsoft.network/vpngateways
- microsoft.network/vpnserverconfigurations
- microsoft.network/vpnsites
- microsoft.networkfunction/azuretrafficcollectors
- microsoft.NotificationHubs/namespaces (Notification Hub Namespaces)
- microsoft.NotificationHubs/namespaces/notificationHubs (Notification Hubs)
- microsoft.nutanix/interfaces
- microsoft.nutanix/nodes
- microsoft.objectstore/osnamespaces
- microsoft.offazure/hypervsites
- microsoft.offazure/importsites
- microsoft.offazure/mastersites
- microsoft.offazure/serversites
- microsoft.offazure/vmwaresites
- microsoft.OpenEnergyPlatform/energyServices (Azure OpenEnergy)
- microsoft.openlogisticsplatform/applicationworkspaces
- microsoft.OpenLogisticsPlatform/workspaces (Open Supply Chain Platform)
- microsoft.operationalinsights/clusters
- microsoft.OperationalInsights/querypacks (Log Analytics query packs)
- microsoft.OperationalInsights/workspaces (Log Analytics workspaces)
- microsoft.OperationsManagement/solutions (Solutions)
- microsoft.operationsmanagement/views
- microsoft.Orbital/contactProfiles (Contact Profiles)
- microsoft.Orbital/EdgeSites (Edge Sites)
- microsoft.Orbital/GroundStations (Ground Stations)
- microsoft.Orbital/l2Connections (L2 Connections)
- microsoft.orbital/orbitalendpoints
- microsoft.orbital/orbitalgateways
- microsoft.orbital/orbitalgateways/orbitall2connections
- microsoft.orbital/orbitalgateways/orbitall3connections
- microsoft.Orbital/spacecrafts (Spacecrafts)
- microsoft.Peering/peerings (Peerings)
- microsoft.Peering/peeringServices (Peering Services)
- microsoft.PlayFab/playerAccountPools (Player account pools)
- microsoft.PlayFab/titles (PlayFab titles)
- microsoft.Portal/dashboards (Shared dashboards)
- microsoft.portalsdk/rootresources
- microsoft.powerbi/privatelinkservicesforpowerbi
- microsoft.powerbi/tenants
- microsoft.powerbi/workspacecollections
- microsoft.powerbidedicated/autoscalevcores
- microsoft.PowerBIDedicated/capacities (Power BI Embedded)
- microsoft.powerplatform/accounts
- microsoft.powerplatform/enterprisepolicies
- microsoft.projectbabylon/accounts
- microsoft.providerhubdevtest/regionalstresstests
- microsoft.Purview/Accounts (Purview accounts)
- microsoft.Quantum/Workspaces (Quantum Workspaces)
- microsoft.RecommendationsService/accounts (Intelligent Recommendations Accounts)
- microsoft.RecommendationsService/accounts/modeling (Modeling)
- microsoft.RecommendationsService/accounts/serviceEndpoints (Service Endpoints)
- microsoft.RecoveryServices/vaults (Recovery Services vaults)
- microsoft.recoveryservices/vaults/replicationfabrics/replicationprotectioncontainers/replicationprotecteditems
- microsoft.recoveryservices/vaults/replicationfabrics/replicationrecoveryservicesproviders
- microsoft.RedHatOpenShift/OpenShiftClusters (Azure Red Hat OpenShift)
- microsoft.Relay/namespaces (Relays)
- microsoft.remoteapp/collections
- microsoft.resiliency/chaosexperiments
- microsoft.ResourceConnector/Appliances (Resource bridges)
- microsoft.resourcegraph/queries (Resource Graph queries)
- microsoft.Resources/deploymentScripts (Deployment Scripts)
- microsoft.Resources/templateSpecs (Template specs)
- microsoft.resources/templatespecs/versions
- microsoft.SaaS/applications (Software as a Service (classic))
- microsoft.SaaS/resources (SaaS)
- microsoft.Scheduler/jobCollections (Scheduler Job Collections)
- microsoft.Scom/managedInstances (Aquila Instances)
- microsoft.scvmm/availabilitysets
- microsoft.scvmm/clouds
- microsoft.scvmm/virtualMachines (SCVMM virtual machine - Azure Arc)
- microsoft.scvmm/virtualmachinetemplates
- microsoft.scvmm/virtualnetworks
- microsoft.scvmm/vmmservers
- microsoft.Search/searchServices (Search services)
- microsoft.security/assignments
- microsoft.security/automations
- microsoft.security/customassessmentautomations
- microsoft.security/customentitystoreassignments
- microsoft.security/iotsecuritysolutions
- microsoft.security/securityconnectors
- microsoft.security/standards
- microsoft.SecurityDetonation/chambers (Security Detonation Chambers)
- microsoft.ServiceBus/namespaces (Service Bus Namespaces)
- microsoft.ServiceFabric/clusters (Service Fabric clusters)
- microsoft.servicefabric/containergroupsets
- microsoft.ServiceFabric/managedclusters (Service Fabric managed clusters)
- microsoft.servicefabricmesh/applications
- microsoft.servicefabricmesh/gateways
- microsoft.servicefabricmesh/networks
- microsoft.servicefabricmesh/secrets
- microsoft.servicefabricmesh/volumes
- microsoft.ServicesHub/connectors (Services Hub Connectors)
- microsoft.SignalRService/SignalR (SignalR)
- microsoft.SignalRService/WebPubSub (Web PubSub Service)
- microsoft.singularity/accounts
- microsoft.skytap/nodes
- microsoft.solutions/appliancedefinitions
- microsoft.solutions/appliances
- microsoft.Solutions/applicationDefinitions (Service catalog managed application definitions)
- microsoft.Solutions/applications (Managed applications)
- microsoft.solutions/jitrequests
- microsoft.spoolservice/spools
- microsoft.Sql/instancePools (Instance pools)
- microsoft.Sql/managedInstances (SQL managed instances)
- microsoft.Sql/managedInstances/databases (Managed databases)
- microsoft.Sql/servers (SQL servers)
- microsoft.Sql/servers/databases (SQL databases)
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
  - Sample query: [List SQL Databases and their elastic pools](../samples/samples-by-category.md#list-sql-databases-and-their-elastic-pools)
- microsoft.Sql/servers/elasticpools (SQL elastic pools)
  - Sample query: [List SQL Databases and their elastic pools](../samples/samples-by-category.md#list-sql-databases-and-their-elastic-pools)
- microsoft.sql/servers/jobaccounts
- microsoft.Sql/servers/jobAgents (Elastic Job agents)
- microsoft.Sql/virtualClusters (Virtual clusters)
- microsoft.sqlvirtualmachine/sqlvirtualmachinegroups
- microsoft.SqlVirtualMachine/SqlVirtualMachines (SQL virtual machines)
- microsoft.sqlvm/dwvm
- microsoft.storage/datamovers
- microsoft.Storage/StorageAccounts (Storage accounts)
  - Sample query: [Find storage accounts with a specific case-insensitive tag on the resource group](../samples/samples-by-category.md#find-storage-accounts-with-a-specific-case-insensitive-tag-on-the-resource-group)
  - Sample query: [Find storage accounts with a specific case-sensitive tag on the resource group](../samples/samples-by-category.md#find-storage-accounts-with-a-specific-case-sensitive-tag-on-the-resource-group)
  - Sample query: [List all storage accounts with specific tag value](../samples/samples-by-category.md#list-all-storage-accounts-with-specific-tag-value)
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- microsoft.StorageCache/amlFilesystems (Lustre File Systems)
- microsoft.StorageCache/caches (HPC caches)
- microsoft.StoragePool/diskPools (Disk Pools)
- microsoft.StorageSync/storageSyncServices (Storage Sync Services)
- microsoft.StorageSyncDev/storageSyncServices (Storage Sync Services)
- microsoft.StorageSyncInt/storageSyncServices (Storage Sync Services)
- microsoft.StorSimple/Managers (StorSimple Device Managers)
- microsoft.StreamAnalytics/clusters (Stream Analytics clusters)
- microsoft.StreamAnalytics/StreamingJobs (Stream Analytics jobs)
- microsoft.swiftlet/virtualmachines
- microsoft.swiftlet/virtualmachinesnapshots
- microsoft.Synapse/privateLinkHubs (Azure Synapse Analytics (private link hubs))
- microsoft.Synapse/workspaces (Azure Synapse Analytics)
- microsoft.Synapse/workspaces/bigDataPools (Apache Spark pools)
- microsoft.synapse/workspaces/eventstreams
- microsoft.Synapse/workspaces/kustopools (Data Explorer pools (preview))
- microsoft.synapse/workspaces/sqldatabases
- microsoft.Synapse/workspaces/sqlPools (Dedicated SQL pools)
- microsoft.terraformoss/providerregistrations
- microsoft.TestBase/testBaseAccounts (Test Base Accounts)
- microsoft.testbase/testbaseaccounts/packages
- microsoft.testbase/testbases
- microsoft.TimeSeriesInsights/environments (Time Series Insights environments)
- microsoft.TimeSeriesInsights/environments/eventsources (Time Series Insights event sources)
- microsoft.TimeSeriesInsights/environments/referenceDataSets (Time Series Insights reference data sets)
- microsoft.token/stores
- microsoft.tokenvault/vaults
- microsoft.VideoIndexer/accounts (Video Analyzer for Media)
- microsoft.VirtualMachineImages/imageTemplates (Image Templates)
- microsoft.visualstudio/account (Azure DevOps organizations)
- microsoft.visualstudio/account/extension
- microsoft.visualstudio/account/project (DevOps Starter)
- microsoft.vmware/arczones
- microsoft.vmware/resourcepools
- microsoft.vmware/vcenters
- microsoft.vmware/virtualmachines
- microsoft.vmware/virtualmachinetemplates
- microsoft.vmware/virtualnetworks
- microsoft.VMwareCloudSimple/dedicatedCloudNodes (CloudSimple Nodes)
- microsoft.VMwareCloudSimple/dedicatedCloudServices (CloudSimple Services)
- microsoft.VMwareCloudSimple/virtualMachines (CloudSimple Virtual Machines)
- microsoft.vmwareonazure/privateclouds
- microsoft.vmwarevirtustream/privateclouds
- microsoft.vsonline/accounts
- microsoft.VSOnline/Plans (Visual Studio Online Plans)
- microsoft.web/apimanagementaccounts
- microsoft.web/apimanagementaccounts/apis
- microsoft.web/certificates
- microsoft.Web/connectionGateways (On-premises data gateways)
- microsoft.Web/connections (API Connections)
- microsoft.Web/containerApps (Container Apps)
- microsoft.Web/customApis (Logic Apps Custom Connector)
- microsoft.Web/HostingEnvironments (App Service Environments)
- microsoft.Web/KubeEnvironments (App Service Kubernetes Environments)
- microsoft.Web/serverFarms (App Service plans)
- microsoft.Web/sites (App Services)
- microsoft.web/sites/premieraddons
- microsoft.Web/sites/slots (App Service (Slots))
- microsoft.Web/StaticSites (Static Web Apps)
- microsoft.web/workerapps
- microsoft.WindowsESU/multipleActivationKeys (Windows Multiple Activation Keys)
- microsoft.WindowsIoT/DeviceServices (Windows 10 IoT Core Services)
- microsoft.workloadbuilder/migrationagents
- microsoft.workloadbuilder/workloads
- microsoft.workloads/monitors
- microsoft.Workloads/phpworkloads (Linux workloads (LAMP) (preview))
- microsoft.Workloads/sapVirtualInstances (SAP Virtual Instances)
- microsoft.Workloads/sapVirtualInstances/applicationInstances (SAP app server instances)
- microsoft.Workloads/sapVirtualInstances/centralInstances (SAP central server instances)
- microsoft.Workloads/sapVirtualInstances/databaseInstances (SAP database server instances)
- myget.packagemanagement/services
- NGINX.NGINXPLUS/nginxDeployments (NGINX Deployment)
- Paraleap.CloudMonix/services (CloudMonix)
- Pokitdok.Platform/services (PokitDok Platform)
- private.arsenv1/resourcetype1
- private.contoso/employees
- private.flows/flows
- Providers.Test/statefulIbizaEngines (My Resources)
- RavenHq.Db/databases (RavenHQ)
- Raygun.CrashReporting/apps (Raygun)
- Sendgrid.Email/accounts (SendGrid Accounts)
- sparkpost.basic/services
- stackify.retrace/services
- test.shoebox/testresources
- test.shoebox/testresources2
- TrendMicro.DeepSecurity/accounts (Deep Security SaaS)
- u2uconsult.theidentityhub/services
- Wandisco.Fusion/fusionGroups (LiveData Planes)
- Wandisco.Fusion/fusionGroups/azureZones (Azure Zones)
- Wandisco.Fusion/fusionGroups/azureZones/plugins (Plugins)
- Wandisco.Fusion/fusionGroups/hiveReplicationRules (Hive Replication Rules)
- Wandisco.Fusion/fusionGroups/managedOnPremZones (On-premises Zones)
- wandisco.fusion/fusiongroups/onpremzones
- Wandisco.Fusion/fusionGroups/replicationRules (Replication Rules)
- Wandisco.Fusion/migrators (LiveData Migrators)
- Wandisco.Fusion/migrators/exclusionTemplates (Exclusions)
- Wandisco.Fusion/migrators/liveDataMigrations (Migrations)
- Wandisco.Fusion/migrators/metadataMigrations (Metadata Migrations)
- Wandisco.Fusion/migrators/metadataTargets (Metadata Targets)
- Wandisco.Fusion/migrators/pathMappings (Path Mappings)
- Wandisco.Fusion/migrators/targets (Targets)

## securityresources

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
- microsoft.security/locations/alerts (Security Alerts)
- microsoft.security/locations/attackpaths
- - microsoft.security/pricings
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
- microsoft.security/securityconnectors/devops/azuredevopsorgs
- microsoft.security/securityconnectors/devops/azuredevopsorgs/projects/repos
- microsoft.security/securityconnectors/devops/githubowners
- microsoft.security/securityconnectors/devops/githubowners/repos
- microsoft.security/securityconnectors/devops/gitlabgroups
- microsoft.security/securityconnectors/devops/gitlabgroups/projects
- microsoft.security/softwareinventories
- microsoft.security/softwareinventory
- microsoft.security/standardassignments

## servicefabricresources

- applications
- applicationtypes
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
- services
- versions

## servicehealthresources

For sample queries for this table, see [Resource Graph sample queries for servicehealthresources](../samples/samples-by-table.md#servicehealthresources).

- microsoft.resourcehealth/events
  - Sample query: [Active Service Health event subscription impact](../samples/samples-by-category.md#active-service-health-event-subscription-impact)
  - Sample query: [All active health advisory events](../samples/samples-by-category.md#all-active-health-advisory-events)
  - Sample query: [All active planned maintenance events](../samples/samples-by-category.md#all-active-planned-maintenance-events)
  - Sample query: [All active Service Health events](../samples/samples-by-category.md#all-active-service-health-events)
  - Sample query: [All active service issue events](../samples/samples-by-category.md#all-active-service-issue-events)
- microsoft.resourcehealth/events/impactedresources

## sportresources

- microsoft.compute/skualternativespotvmsize/location
- microsoft.compute/skuspotevictionrate/location
- microsoft.compute/skuspotpricehistory/ostype/location

## tagresources

- microsoft.resources/tagnamespaces
- microsoft.resources/tagnamespaces/tagnames
- microsoft.resources/tagnamespaces/tags

## Next steps

- Learn more about the [query language](../concepts/query-language.md).
- Learn more about how to [explore resources](../concepts/explore-resources.md).
- See samples of [Starter queries](../samples/starter.md).
