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

- microsoft.advisor/configurations
- microsoft.advisor/recommendations
  - Sample query: [Get cost savings summary from Azure Advisor](../samples/samples-by-category.md#get-cost-savings-summary-from-azure-advisor)
  - Sample query: [List Arc-enabled servers not running latest released agent version](../samples/samples-by-category.md#list-arc-enabled-servers-not-running-latest-released-agent-version)
- microsoft.advisor/recommendations/suppressions
- microsoft.advisor/suppressions

## alertsmanagementresources

- microsoft.alertsmanagement/alerts

## chaosresources

- microsoft.chaos/experiments/statuses
- microsoft.chaos/targets
- microsoft.chaos/targets/capabilities

## computeresources

- microsoft.compute/virtualmachinescalesets/virtualmachines
- microsoft.compute/virtualmachinescalesets/virtualmachines/networkinterfaces
- microsoft.compute/virtualmachinescalesets/virtualmachines/networkinterfaces/ipconfigurations/publicipaddresses

## desktopvirtualizationresources

- microsoft.desktopvirtualization/hostpools/sessionhosts

## extendedlocationresources

For sample queries for this table, see [Resource Graph sample queries for extendedlocationresources](../samples/samples-by-table.md#extendedlocationresources).

- microsoft.extendedlocation/customlocations/enabledresourcetypes
  - Sample query: [Get enabled resource types for Azure Arc-enabled custom locations](../samples/samples-by-category.md#get-enabled-resource-types-for-azure-arc-enabled-custom-locations)
  - Sample query: [List Azure Arc-enabled custom locations with VMware or SCVMM enabled](../samples/samples-by-category.md#list-azure-arc-enabled-custom-locations-with-vmware-or-scvmm-enabled)

## guestconfigurationresources

For sample queries for this table, see [Resource Graph sample queries for guestconfigurationresources](../samples/samples-by-table.md#guestconfigurationresources).

- microsoft.guestconfiguration/guestconfigurationassignments
  - Sample query: [Count machines in scope of guest configuration policies](../samples/samples-by-category.md#count-machines-in-scope-of-guest-configuration-policies)
  - Sample query: [Count of non-compliant guest configuration assignments](../samples/samples-by-category.md#count-of-non-compliant-guest-configuration-assignments)
  - Sample query: [Find all reasons a machine is non-compliant for guest configuration assignments](../samples/samples-by-category.md#find-all-reasons-a-machine-is-non-compliant-for-guest-configuration-assignments)

## healthresources

For sample queries for this table, see [Resource Graph sample queries for healthresources](../samples/samples-by-table.md#healthresources).

- microsoft.resourcehealth/availabilitystatuses
  - Sample query: [Count of virtual machines by availability state and Subscription Id](../samples/samples-by-category.md#count-of-virtual-machines-by-availability-state-and-subscription-id)
  - Sample query: [List of virtual machines and associated availability states by Resource Ids](../samples/samples-by-category.md#list-of-virtual-machines-and-associated-availability-states-by-resource-ids)
  - Sample query: [List of virtual machines by availability state and power state with Resource Ids and resource Groups](../samples/samples-by-category.md#list-of-virtual-machines-by-availability-state-and-power-state-with-resource-ids-and-resource-groups)
  - Sample query: [List of virtual machines that are not Available by Resource Ids](../samples/samples-by-category.md#list-of-virtual-machines-that-are-not-available-by-resource-ids)

## iotsecurityresources

For sample queries for this table, see [Resource Graph sample queries for iotsecurityresources](../samples/samples-by-table.md#iotsecurityresources).

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
- microsoft.kubernetesconfiguration/sourcecontrolconfigurations

## maintenanceresources

- microsoft.maintenance/applyupdates
- microsoft.maintenance/configurationassignments
- microsoft.maintenance/updates
- microsoft.resources/subscriptions (Subscriptions)
  - Sample query: [Count of subscriptions per management group](../samples/samples-by-category.md#count-of-subscriptions-per-management-group)
  - Sample query: [Key vaults with subscription name](../samples/samples-by-category.md#key-vaults-with-subscription-name)
  - Sample query: [List all management group ancestors for a specified subscription](../samples/samples-by-category.md#list-all-management-group-ancestors-for-a-specified-subscription)
  - Sample query: [List all subscriptions under a specified management group](../samples/samples-by-category.md#list-all-subscriptions-under-a-specified-management-group)
  - Sample query: [Remove columns from results](../samples/samples-by-category.md#remove-columns-from-results)
  - Sample query: [Secure score per management group](../samples/samples-by-category.md#secure-score-per-management-group)

## patchassessmentresources

For sample queries for this table, see [Resource Graph sample queries for patchassessmentresources](../samples/samples-by-table.md#patchassessmentresources).

- microsoft.compute/virtualmachines/patchassessmentresults
- microsoft.compute/virtualmachines/patchassessmentresults/softwarepatches
- microsoft.hybridcompute/machines/patchassessmentresults
- microsoft.hybridcompute/machines/patchassessmentresults/softwarepatches

## patchinstallationresources

- microsoft.compute/virtualmachines/patchinstallationresults
- microsoft.compute/virtualmachines/patchinstallationresults/softwarepatches
- microsoft.hybridcompute/machines/patchinstallationresults
- microsoft.hybridcompute/machines/patchinstallationresults/softwarepatches

## policyresources

For sample queries for this table, see [Resource Graph sample queries for policyresources](../samples/samples-by-table.md#policyresources).

- microsoft.authorization/policyassignments
- microsoft.authorization/policydefinitions
- microsoft.authorization/policysetdefinitions
- microsoft.policyinsights/policystates
  - Sample query: [Compliance by policy assignment](../samples/samples-by-category.md#compliance-by-policy-assignment)
  - Sample query: [Compliance by resource type](../samples/samples-by-category.md#compliance-by-resource-type)
  - Sample query: [List all non-compliant resources](../samples/samples-by-category.md#list-all-non-compliant-resources)
  - Sample query: [Summarize resource compliance by state](../samples/samples-by-category.md#summarize-resource-compliance-by-state)
  - Sample query: [Summarize resource compliance by state per location](../samples/samples-by-category.md#summarize-resource-compliance-by-state-per-location)

## recoveryservicesresources

- microsoft.dataprotection/backupvaults/backupinstances
- microsoft.dataprotection/backupvaults/backupjobs
- microsoft.dataprotection/backupvaults/backuppolicies
- microsoft.recoveryservices/vaults/alerts
- Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems (Backup Items)
- microsoft.recoveryservices/vaults/backupjobs
- microsoft.recoveryservices/vaults/backuppolicies

## resourcecontainers

For sample queries for this table, see [Resource Graph sample queries for resourcecontainers](../samples/samples-by-table.md#resourcecontainers).

- microsoft.management/managementgroups
  - Sample query: [Count of subscriptions per management group](../samples/samples-by-category.md#count-of-subscriptions-per-management-group)
  - Sample query: [List all management group ancestors for a specified management group](../samples/samples-by-category.md#list-all-management-group-ancestors-for-a-specified-management-group)
- microsoft.resources/subscriptions (Subscriptions)
  - Sample query: [Count of subscriptions per management group](../samples/samples-by-category.md#count-of-subscriptions-per-management-group)
  - Sample query: [Key vaults with subscription name](../samples/samples-by-category.md#key-vaults-with-subscription-name)
  - Sample query: [List all management group ancestors for a specified subscription](../samples/samples-by-category.md#list-all-management-group-ancestors-for-a-specified-subscription)
  - Sample query: [List all subscriptions under a specified management group](../samples/samples-by-category.md#list-all-subscriptions-under-a-specified-management-group)
  - Sample query: [Remove columns from results](../samples/samples-by-category.md#remove-columns-from-results)
  - Sample query: [Secure score per management group](../samples/samples-by-category.md#secure-score-per-management-group)
- Microsoft.Resources/subscriptions/resourceGroups (Resource groups)
  - Sample query: [Combine results from two queries into a single result](../samples/samples-by-category.md)
  - Sample query: [Find storage accounts with a specific case-insensitive tag on the resource group](../samples/samples-by-category.md#find-storage-accounts-with-a-specific-case-insensitive-tag-on-the-resource-group)
  - Sample query: [Find storage accounts with a specific case-sensitive tag on the resource group](../samples/samples-by-category.md#find-storage-accounts-with-a-specific-case-sensitive-tag-on-the-resource-group)

## resources

For sample queries for this table, see [Resource Graph sample queries for resources](../samples/samples-by-table.md#resources).

- 84codes.CloudAMQP/servers (CloudAMQP)
- Citrix.Services/XenAppEssentials (Citrix Virtual Apps Essentials)
- Citrix.Services/XenDesktopEssentials (Citrix Virtual Desktops Essentials)
- conexlink.mycloudit/accounts
- crypteron.datasecurity/apps
- Dynatrace.Observability/monitors (Dynatrace)
- GitHub.Enterprise/accounts (GitHub AE)
- gridpro.evops/accounts
- gridpro.evops/accounts/eventrules
- gridpro.evops/accounts/requesttemplates
- gridpro.evops/accounts/views
- hive.streaming/services
- incapsula.waf/accounts
- LiveArena.Broadcast/services (LiveArena Broadcast)
- Mailjet.Email/services (Mailjet Email Service)
- micorosft.web/kubeenvironments
- Microsoft.AAD/domainServices (Azure AD Domain Services)
- microsoft.aadiam/azureadmetrics
- microsoft.aadiam/privateLinkForAzureAD (Private Link for Azure AD)
- microsoft.aadiam/tenants
- Microsoft.AgFoodPlatform/farmBeats (Azure FarmBeats)
- microsoft.aisupercomputer/accounts
- microsoft.aisupercomputer/accounts/jobgroups
- microsoft.aisupercomputer/accounts/jobgroups/jobs
- microsoft.alertsmanagement/actionrules
- microsoft.alertsmanagement/resourcehealthalertrules
- microsoft.alertsmanagement/smartdetectoralertrules
- Microsoft.AnalysisServices/servers (Analysis Services)
- Microsoft.AnyBuild/clusters (AnyBuild clusters)
- Microsoft.ApiManagement/service (API Management services)
- microsoft.appassessment/migrateprojects
- Microsoft.AppConfiguration/configurationStores (App Configuration)
- Microsoft.AppPlatform/Spring (Azure Spring Cloud)
- microsoft.archive/collections
- Microsoft.Attestation/attestationProviders (Attestation providers)
- microsoft.authorization/elevateaccessroleassignment
- Microsoft.Authorization/resourceManagementPrivateLinks (Resource management private links)
- microsoft.automanage/accounts
- microsoft.automanage/configurationprofilepreferences
- microsoft.automanage/configurationprofiles
- Microsoft.Automation/AutomationAccounts (Automation Accounts)
- microsoft.automation/automationaccounts/configurations
- Microsoft.Automation/automationAccounts/runbooks (Runbook)
- microsoft.autonomousdevelopmentplatform/accounts
- Microsoft.AutonomousSystems/workspaces (Bonsai)
- Microsoft.AVS/privateClouds (AVS Private clouds)
- microsoft.azconfig/configurationstores
- Microsoft.AzureActiveDirectory/b2cDirectories (B2C Tenants)
- Microsoft.AzureActiveDirectory/guestUsages (Guest Usages)
- Microsoft.AzureArcData/dataControllers (Azure Arc data controllers)
- Microsoft.AzureArcData/postgresInstances (Azure Arc-enabled PostgreSQL Hyperscale server groups)
- Microsoft.AzureArcData/sqlManagedInstances (SQL managed instances - Azure Arc)
- Microsoft.AzureArcData/sqlServerInstances (SQL Server - Azure Arc)
- microsoft.azurecis/autopilotenvironments
- microsoft.azurecis/dstsserviceaccounts
- microsoft.azurecis/dstsserviceclientidentities
- microsoft.azuredata/datacontrollers
- microsoft.azuredata/hybriddatamanagers
- microsoft.azuredata/postgresinstances
- microsoft.azuredata/sqlbigdataclusters
- microsoft.azuredata/sqlinstances
- microsoft.azuredata/sqlmanagedinstances
- microsoft.azuredata/sqlserverinstances
- Microsoft.AzureData/sqlServerRegistrations (SQL Server registries)
- Microsoft.AzurePercept/accounts (Azure Percept accounts)
- microsoft.azuresphere/catalogs
- microsoft.azuresphere/catalogs/products
- microsoft.azuresphere/catalogs/products/devicegroups
- microsoft.azurestack/edgesubscriptions
- microsoft.azurestack/linkedsubscriptions
- Microsoft.Azurestack/registrations (Azure Stack Hubs)
- Microsoft.AzureStackHCI/clusters (Azure Stack HCI)
- microsoft.azurestackhci/galleryimages
- microsoft.azurestackhci/networkinterfaces
- microsoft.azurestackhci/virtualharddisks
- Microsoft.AzureStackHci/virtualMachines (Azure Stack HCI virtual machine - Azure Arc)
- microsoft.azurestackhci/virtualmachines/extensions
- microsoft.azurestackhci/virtualnetworks
- microsoft.backupsolutions/vmwareapplications
- microsoft.baremetal/consoleconnections
- Microsoft.BareMetal/crayServers (Cray Servers)
- Microsoft.BareMetal/monitoringServers (Monitoring Servers)
- Microsoft.BareMetalInfrastructure/bareMetalInstances (BareMetal Instances)
- Microsoft.Batch/batchAccounts (Batch accounts)
- microsoft.batchai/clusters
- microsoft.batchai/fileservers
- microsoft.batchai/jobs
- microsoft.batchai/workspaces
- Microsoft.Bing/accounts (Bing Resources)
- microsoft.bingmaps/mapapis
- microsoft.biztalkservices/biztalk
- Microsoft.Blockchain/blockchainMembers (Azure Blockchain Service)
- Microsoft.Blockchain/cordaMembers (Corda)
- microsoft.blockchain/watchers
- Microsoft.BotService/botServices (Bot Services)
- Microsoft.Cache/Redis (Azure Cache for Redis)
- Microsoft.Cache/RedisEnterprise (Redis Enterprise)
- microsoft.cascade/sites
- Microsoft.Cdn/CdnWebApplicationFirewallPolicies (Web application firewall policies (WAF))
- microsoft.cdn/profiles (Front Doors Standard/Premium (Preview))
- Microsoft.Cdn/Profiles/AfdEndpoints (Endpoints)
- microsoft.cdn/profiles/endpoints (Endpoints)
- Microsoft.CertificateRegistration/certificateOrders (App Service Certificates)
- microsoft.chaos/chaosexperiments (Chaos Experiments (Classic))
- microsoft.chaos/experiments (Chaos Experiments)
- microsoft.classicCompute/domainNames (Cloud services (classic))
- Microsoft.ClassicCompute/VirtualMachines (Virtual machines (classic))
- Microsoft.ClassicNetwork/networkSecurityGroups (Network security groups (classic))
- Microsoft.ClassicNetwork/reservedIps (Reserved IP addresses (classic))
- Microsoft.ClassicNetwork/virtualNetworks (Virtual networks (classic))
- Microsoft.ClassicStorage/StorageAccounts (Storage accounts (classic))
- microsoft.cloudes/accounts
- microsoft.cloudsearch/indexes
- Microsoft.CloudTest/accounts (CloudTest Accounts)
- Microsoft.CloudTest/hostedpools (1ES Hosted Pools)
- Microsoft.CloudTest/images (CloudTest Images)
- Microsoft.CloudTest/pools (CloudTest Pools)
- Microsoft.ClusterStor/nodes (ClusterStors)
- microsoft.codesigning/codesigningaccounts
- microsoft.codespaces/plans
- Microsoft.Cognition/syntheticsAccounts (Synthetics Accounts)
- Microsoft.CognitiveServices/accounts (Cognitive Services)
- Microsoft.Compute/availabilitySets (Availability sets)
- Microsoft.Compute/capacityReservationGroups (Capacity Reservation Groups)
- microsoft.compute/capacityreservationgroups/capacityreservations
- microsoft.compute/capacityreservations
- Microsoft.Compute/cloudServices (Cloud services (extended support))
- Microsoft.Compute/diskAccesses (Disk Accesses)
- Microsoft.Compute/diskEncryptionSets (Disk Encryption Sets)
- Microsoft.Compute/disks (Disks)
- Microsoft.Compute/galleries (Azure compute galleries)
- Microsoft.Compute/galleries/applications (VM application definitions)
- Microsoft.Compute/galleries/applications/versions (VM application versions)
- Microsoft.Compute/galleries/images (VM image definitions)
- Microsoft.Compute/galleries/images/versions (VM image versions)
- Microsoft.Compute/hostgroups (Host groups)
- Microsoft.Compute/hostgroups/hosts (Hosts)
- Microsoft.Compute/images (Images)
- Microsoft.Compute/ProximityPlacementGroups (Proximity placement groups)
- Microsoft.Compute/restorePointCollections (Restore Point Collections)
- microsoft.compute/sharedvmextensions
- microsoft.compute/sharedvmextensions/versions
- microsoft.compute/sharedvmimages
- microsoft.compute/sharedvmimages/versions
- Microsoft.Compute/snapshots (Snapshots)
- Microsoft.Compute/sshPublicKeys (SSH keys)
- microsoft.compute/swiftlets
- Microsoft.Compute/VirtualMachines (Virtual machines)
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
- Microsoft.Compute/virtualMachineScaleSets (Virtual machine scale sets)
  - Sample query: [Get virtual machine scale set capacity and size](../samples/samples-by-category.md#get-virtual-machine-scale-set-capacity-and-size)
- microsoft.compute/virtualmachinescalesets/virtualmachines/networkinterfaces/ipconfigurations/publicipaddresses
- Microsoft.ConfidentialLedger/ledgers (Confidential Ledgers)
- Microsoft.Confluent/organizations (Confluent organizations)
- Microsoft.ConnectedCache/cacheNodes (Connected Cache Resources)
- Microsoft.ConnectedCache/enterpriseCustomers (Connected Cache Resources)
- Microsoft.ConnectedVehicle/platformAccounts (Connected Vehicle Platforms)
- microsoft.connectedvmwarevsphere/clusters
- microsoft.connectedvmwarevsphere/datastores
- microsoft.connectedvmwarevsphere/hosts
- microsoft.connectedvmwarevsphere/resourcepools
- Microsoft.connectedVMwareVSphere/vCenters (VMware vCenters)
- Microsoft.ConnectedVMwarevSphere/VirtualMachines (VMware + AVS virtual machines)
- microsoft.connectedvmwarevsphere/virtualmachines/extensions
- microsoft.connectedvmwarevsphere/virtualmachinetemplates
- microsoft.connectedvmwarevsphere/virtualnetworks
- Microsoft.ContainerInstance/containerGroups (Container instances)
- Microsoft.ContainerRegistry/registries (Container registries)
- microsoft.containerregistry/registries/agentpools
- microsoft.containerregistry/registries/buildtasks
- Microsoft.ContainerRegistry/registries/replications (Container registry replications)
- microsoft.containerregistry/registries/taskruns
- microsoft.containerregistry/registries/tasks
- Microsoft.ContainerRegistry/registries/webhooks (Container registry webhooks)
- microsoft.containerservice/containerservices
- Microsoft.ContainerService/managedClusters (Kubernetes services)
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- microsoft.containerservice/openshiftmanagedclusters
- microsoft.containerservice/snapshots
- microsoft.contoso/clusters
- microsoft.contoso/employees
- microsoft.contoso/installations
- microsoft.contoso/towers
- microsoft.costmanagement/connectors
- microsoft.customproviders/resourceproviders
- microsoft.d365customerinsights/instances
- Microsoft.Dashboard/grafana (Grafana Workspaces)
- Microsoft.DataBox/jobs (Azure Data Box)
- Microsoft.DataBoxEdge/dataBoxEdgeDevices (Azure Stack Edge / Data Box Gateway)
- Microsoft.Databricks/workspaces (Azure Databricks Services)
- Microsoft.DataCatalog/catalogs (Data Catalog)
- microsoft.datacatalog/datacatalogs
- Microsoft.DataCollaboration/workspaces (Project CI)
- Microsoft.Datadog/monitors (Datadog)
- Microsoft.DataFactory/dataFactories (Data factories)
- Microsoft.DataFactory/factories (Data factories (V2))
- Microsoft.DataLakeAnalytics/accounts (Data Lake Analytics)
- Microsoft.DataLakeStore/accounts (Data Lake Storage Gen1)
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- microsoft.datamigration/controllers
- Microsoft.DataMigration/services (Azure Database Migration Services)
- Microsoft.DataMigration/services/projects (Azure Database Migration Projects)
- microsoft.datamigration/slots
- microsoft.datamigration/sqlmigrationservices (Azure Database Migration Services)
- Microsoft.DataProtection/BackupVaults (Backup vaults)
- Microsoft.DataProtection/resourceGuards (Resource Guards (Preview))
- microsoft.dataprotection/resourceoperationgatekeepers
- microsoft.datareplication/replicationfabrics
- Microsoft.DataReplication/replicationVaults (Site Recovery Vaults)
- Microsoft.DataShare/accounts (Data Shares)
- Microsoft.DBforMariaDB/servers (Azure Database for MariaDB servers)
- Microsoft.DBforMySQL/flexibleServers (Azure Database for MySQL flexible servers)
- Microsoft.DBforMySQL/servers (Azure Database for MySQL servers)
- Microsoft.DBforPostgreSQL/flexibleServers (Azure Database for PostgreSQL flexible servers)
- Microsoft.DBforPostgreSQL/serverGroups (Azure Database for PostgreSQL server groups)
- Microsoft.DBforPostgreSQL/serverGroupsv2 (Azure Database for PostgreSQL server groups)
- Microsoft.DBforPostgreSQL/servers (Azure Database for PostgreSQL servers)
- Microsoft.DBforPostgreSQL/serversv2 (Azure Database for PostgreSQL servers v2)
- microsoft.dbforpostgresql/singleservers
- microsoft.delegatednetwork/controller
- microsoft.delegatednetwork/delegatedsubnets
- microsoft.delegatednetwork/orchestratorinstances
- microsoft.delegatednetwork/orchestrators
- microsoft.deploymentmanager/artifactsources
- Microsoft.DeploymentManager/Rollouts (Rollouts)
- microsoft.deploymentmanager/servicetopologies
- microsoft.deploymentmanager/servicetopologies/services
- microsoft.deploymentmanager/servicetopologies/services/serviceunits
- microsoft.deploymentmanager/steps
- Microsoft.DesktopVirtualization/ApplicationGroups (Application groups)
- Microsoft.DesktopVirtualization/HostPools (Host pools)
- Microsoft.DesktopVirtualization/ScalingPlans (Scaling plans)
- Microsoft.DesktopVirtualization/Workspaces (Workspaces)
- microsoft.devai/instances
- microsoft.devai/instances/experiments
- microsoft.devai/instances/sandboxes
- microsoft.devai/instances/sandboxes/experiments
- microsoft.devices/elasticpools
- microsoft.devices/elasticpools/iothubtenants
- Microsoft.Devices/IotHubs (IoT Hub)
- Microsoft.Devices/ProvisioningServices (Device Provisioning Services)
- Microsoft.DeviceUpdate/Accounts (Device Update for IoT Hubs)
- microsoft.deviceupdate/accounts/instances
- microsoft.devops/pipelines (DevOps Starter)
- microsoft.devspaces/controllers
- microsoft.devtestlab/labcenters
- Microsoft.DevTestLab/labs (DevTest Labs)
- microsoft.devtestlab/labs/servicerunners
- Microsoft.DevTestLab/labs/virtualMachines (Virtual machines)
- microsoft.devtestlab/schedules
- Microsoft.DigitalTwins/digitalTwinsInstances (Azure Digital Twins)
- Microsoft.DocumentDB/cassandraClusters (Azure Managed Instance for Apache Cassandra)
- Microsoft.DocumentDb/databaseAccounts (Azure Cosmos DB accounts)
  - Sample query: [List Azure Cosmos DB with specific write locations](../samples/samples-by-category.md#list-azure-cosmos-db-with-specific-write-locations)
- Microsoft.DomainRegistration/domains (App Service Domains)
- microsoft.dynamics365fraudprotection/instances
- Microsoft.EdgeOrder/addresses (Azure Edge Hardware Center Address)
- microsoft.edgeorder/ordercollections
- Microsoft.EdgeOrder/orderItems (Azure Edge Hardware Center)
- microsoft.edgeorder/orders
- Microsoft.Elastic/monitors (Elasticsearch (Elastic Cloud))
- microsoft.enterpriseknowledgegraph/services
- Microsoft.EventGrid/domains (Event Grid Domains)
- microsoft.eventgrid/partnerdestinations
- Microsoft.EventGrid/partnerNamespaces (Event Grid Partner Namespaces)
- Microsoft.EventGrid/partnerRegistrations (Event Grid Partner Registrations)
- Microsoft.EventGrid/partnerTopics (Event Grid Partner Topics)
- Microsoft.EventGrid/systemTopics (Event Grid System Topics)
- Microsoft.EventGrid/topics (Event Grid Topics)
- Microsoft.EventHub/clusters (Event Hubs Clusters)
- Microsoft.EventHub/namespaces (Event Hubs Namespaces)
- Microsoft.Experimentation/experimentWorkspaces (Experiment Workspaces)
- Microsoft.ExtendedLocation/CustomLocations (Custom locations)
  - Sample query: [List Azure Arc-enabled custom locations with VMware or SCVMM enabled](../samples/samples-by-category.md#list-azure-arc-enabled-custom-locations-with-vmware-or-scvmm-enabled)
- microsoft.falcon/namespaces
- Microsoft.Fidalgo/devcenters (Fidalgo DevCenters)
- microsoft.fidalgo/machinedefinitions
- microsoft.fidalgo/networksettings
- Microsoft.Fidalgo/projects (Fidalgo Projects)
- Microsoft.Fidalgo/projects/environments (Fidalgo Environments)
- microsoft.fidalgo/projects/pools
- Microsoft.FluidRelay/fluidRelayServers (Fluid Relay)
- microsoft.footprintmonitoring/profiles
- microsoft.gaming/titles
- Microsoft.Genomics/accounts (Genomics accounts)
- microsoft.guestconfiguration/automanagedaccounts
- Microsoft.HanaOnAzure/hanaInstances (SAP HANA on Azure)
- Microsoft.HanaOnAzure/sapMonitors (Azure Monitors for SAP Solutions)
- microsoft.hardwaresecuritymodules/dedicatedhsms
- Microsoft.HDInsight/clusterpools (HDInsight cluster pools)
- Microsoft.HDInsight/clusterpools/clusters (HDInsight gen2 clusters)
- Microsoft.HDInsight/clusterpools/clusters/sessionclusters (HDInsight session clusters)
- Microsoft.HDInsight/clusters (HDInsight clusters)
- Microsoft.HealthBot/healthBots (Azure Health Bot)
- Microsoft.HealthcareApis/services (Azure API for FHIR)
- microsoft.healthcareapis/services/privateendpointconnections
- Microsoft.HealthcareApis/workspaces (Healthcare APIs Workspaces)
- Microsoft.HealthcareApis/workspaces/dicomservices (DICOM services)
- Microsoft.HealthcareApis/workspaces/fhirservices (FHIR services)
- Microsoft.HealthcareApis/workspaces/iotconnectors (IoT connectors)
- Microsoft.HpcWorkbench/instances (HPC Workbenches (preview))
- Microsoft.HybridCompute/machines (Servers - Azure Arc)
  - Sample query: [Get count and percentage of Arc-enabled servers by domain](../samples/samples-by-category.md#get-count-and-percentage-of-arc-enabled-servers-by-domain)
  - Sample query: [List all extensions installed on an Azure Arc-enabled server](../samples/samples-by-category.md#list-all-extensions-installed-on-an-azure-arc-enabled-server)
  - Sample query: [List Arc-enabled servers not running latest released agent version](../samples/samples-by-category.md#list-arc-enabled-servers-not-running-latest-released-agent-version)
- microsoft.hybridcompute/machines/extensions
  - Sample query: [List all extensions installed on an Azure Arc-enabled server](../samples/samples-by-category.md#list-all-extensions-installed-on-an-azure-arc-enabled-server)
- Microsoft.HybridCompute/privateLinkScopes (Azure Arc Private Link Scopes)
- microsoft.hybridcontainerservice/provisionedclusters
- Microsoft.HybridData/dataManagers (StorSimple Data Managers)
- Microsoft.HybridNetwork/devices (Azure Network Function Manager – Devices)
- Microsoft.HybridNetwork/networkFunctions (Azure Network Function Manager – Network Functions)
- microsoft.hybridnetwork/virtualnetworkfunctions
- Microsoft.ImportExport/jobs (Import/export jobs)
- microsoft.industrydatalifecycle/basemodels
- microsoft.industrydatalifecycle/custodiancollaboratives
- microsoft.industrydatalifecycle/dataconsumercollaboratives
- microsoft.industrydatalifecycle/derivedmodels
- microsoft.industrydatalifecycle/membercollaboratives
- microsoft.industrydatalifecycle/modelmappings
- microsoft.industrydatalifecycle/pipelinesets
- microsoft.insights/actiongroups
- microsoft.insights/activitylogalerts
- microsoft.insights/alertrules
- microsoft.insights/autoscalesettings
- microsoft.insights/components (Application Insights)
- microsoft.insights/datacollectionendpoints (Data collection endpoints)
- microsoft.insights/datacollectionrules (Data collection rules)
- microsoft.insights/guestdiagnosticsettings
- microsoft.insights/metricalerts
- microsoft.insights/notificationgroups
- microsoft.insights/notificationrules
- Microsoft.Insights/privateLinkScopes (Azure Monitor Private Link Scopes)
- microsoft.insights/querypacks
- microsoft.insights/scheduledqueryrules
- microsoft.insights/webtests (Availability tests)
- microsoft.insights/workbooks (Azure Workbooks)
- microsoft.insights/workbooktemplates (Azure Workbook Templates)
- Microsoft.IntelligentITDigitalTwin/digitalTwins (Minervas)
- Microsoft.IntelligentITDigitalTwin/digitalTwins/assets (Assets)
- Microsoft.IntelligentITDigitalTwin/digitalTwins/executionPlans (Deployments)
- Microsoft.IntelligentITDigitalTwin/digitalTwins/testPlans (Suites)
- Microsoft.IntelligentITDigitalTwin/digitalTwins/tests (Scripts)
- Microsoft.IoTCentral/IoTApps (IoT Central Applications)
- microsoft.iotspaces/graph
- microsoft.keyvault/hsmpools
- microsoft.keyvault/managedhsms
- Microsoft.KeyVault/vaults (Key vaults)
  - Sample query: [Count key vault resources](../samples/samples-by-category.md#count-key-vault-resources)
  - Sample query: [Key vaults with subscription name](../samples/samples-by-category.md#key-vaults-with-subscription-name)
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- Microsoft.Kubernetes/connectedClusters (Kubernetes - Azure Arc)
  - Sample query: [List all Azure Arc-enabled Kubernetes clusters without Azure Monitor extension](../samples/samples-by-category.md#list-all-azure-arc-enabled-kubernetes-clusters-without-azure-monitor-extension)
  - Sample query: [List all Azure Arc-enabled Kubernetes resources](../samples/samples-by-category.md#list-all-azure-arc-enabled-kubernetes-resources)
- Microsoft.Kusto/clusters (Azure Data Explorer Clusters)
- Microsoft.Kusto/clusters/databases (Azure Data Explorer Databases)
- Microsoft.LabServices/labAccounts (Lab Services)
- microsoft.labservices/labplans
- microsoft.labservices/labs
- Microsoft.LoadTestService/LoadTests (Azure Load Testing)
- Microsoft.Logic/integrationAccounts (Integration accounts)
- Microsoft.Logic/integrationServiceEnvironments (Integration Service Environments)
- Microsoft.Logic/integrationServiceEnvironments/managedApis (Managed Connector)
- Microsoft.Logic/workflows (Logic apps)
- Microsoft.Logz/monitors (Logz main account)
- Microsoft.Logz/monitors/accounts (Logz sub account)
- Microsoft.MachineLearning/commitmentPlans (Machine Learning Studio (classic) web service plans)
- Microsoft.MachineLearning/webServices (Machine Learning Studio (classic) web services)
- Microsoft.MachineLearning/workspaces (Machine Learning Studio (classic) workspaces)
- microsoft.machinelearningcompute/operationalizationclusters
- microsoft.machinelearningexperimentation/accounts/workspaces
- microsoft.machinelearningservices/aisysteminventories
- microsoft.machinelearningservices/modelinventories
- microsoft.machinelearningservices/modelinventory
- microsoft.machinelearningservices/virtualclusters
- Microsoft.MachineLearningServices/workspaces (Machine learning)
- microsoft.machinelearningservices/workspaces/batchendpoints
- microsoft.machinelearningservices/workspaces/batchendpoints/deployments
- microsoft.machinelearningservices/workspaces/inferenceendpoints
- microsoft.machinelearningservices/workspaces/inferenceendpoints/deployments
- Microsoft.MachineLearningServices/workspaces/onlineEndpoints (Machine learning online endpoints)
- Microsoft.MachineLearningServices/workspaces/onlineEndpoints/deployments (Machine learning online deployments)
- Microsoft.Maintenance/maintenanceConfigurations (Maintenance Configurations)
- microsoft.maintenance/maintenancepolicies
- microsoft.managedidentity/groups
- Microsoft.ManagedIdentity/userAssignedIdentities (Managed Identities)
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- microsoft.managednetwork/managednetworkgroups
- microsoft.managednetwork/managednetworkpeeringpolicies
- microsoft.managednetwork/managednetworks
- microsoft.managednetwork/managednetworks/managednetworkgroups
- microsoft.managednetwork/managednetworks/managednetworkpeeringpolicies
- Microsoft.Maps/accounts (Azure Maps Accounts)
- Microsoft.Maps/accounts/creators (Azure Maps Creator Resources)
- microsoft.maps/accounts/privateatlases
- Microsoft.MarketplaceApps/classicDevServices (Classic Dev Services)
- microsoft.media/mediaservices (Media Services)
- microsoft.media/mediaservices/liveevents (Live events)
- microsoft.media/mediaservices/streamingendpoints (Streaming Endpoints)
- microsoft.media/mediaservices/transforms
- microsoft.media/videoanalyzers (Video Analyzers)
- microsoft.microservices4spring/appclusters
- microsoft.migrate/assessmentprojects
- microsoft.migrate/migrateprojects
- microsoft.migrate/movecollections
- Microsoft.Migrate/projects (Migration projects)
- Microsoft.MixedReality/holographicsBroadcastAccounts (Holographics Broadcast Accounts)
- Microsoft.MixedReality/remoteRenderingAccounts (Remote Rendering Accounts)
- microsoft.mixedreality/surfacereconstructionaccounts
- Microsoft.MobileNetwork/mobileNetworks (Mobile Networks)
- microsoft.mobilenetwork/mobilenetworks/datanetworks
- Microsoft.MobileNetwork/mobileNetworks/services (Services)
- microsoft.mobilenetwork/mobilenetworks/simpolicies
- Microsoft.MobileNetwork/mobileNetworks/sites (Mobile Network Sites)
- microsoft.mobilenetwork/mobilenetworks/slices
- microsoft.mobilenetwork/networks
- microsoft.mobilenetwork/networks/sites
- Microsoft.MobileNetwork/packetCoreControlPlanes (Arc for network functions – Packet Cores)
- microsoft.mobilenetwork/packetcorecontrolplanes/packetcoredataplanes
- microsoft.mobilenetwork/packetcorecontrolplanes/packetcoredataplanes/attacheddatanetworks
- Microsoft.MobileNetwork/sims (Sims)
- microsoft.mobilenetwork/sims/simprofiles
- microsoft.monitor/accounts
- Microsoft.NetApp/netAppAccounts (NetApp accounts)
- microsoft.netapp/netappaccounts/backuppolicies
- Microsoft.NetApp/netAppAccounts/capacityPools (Capacity pools)
- Microsoft.NetApp/netAppAccounts/capacityPools/Volumes (Volumes)
- microsoft.netapp/netappaccounts/capacitypools/volumes/mounttargets
- Microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots (Snapshots)
- microsoft.netapp/netappaccounts/capacitypools/volumes/subvolumes
- Microsoft.NetApp/netAppAccounts/snapshotPolicies (Snapshot policies)
- Microsoft.Network/applicationGateways (Application gateways)
- Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies (Web application firewall policies (WAF))
- Microsoft.Network/applicationSecurityGroups (Application security groups)
- Microsoft.Network/azureFirewalls (Firewalls)
- Microsoft.Network/bastionHosts (Bastions)
- Microsoft.Network/connections (Connections)
- Microsoft.Network/customIpPrefixes (Custom IP Prefixes)
- microsoft.network/ddoscustompolicies
- Microsoft.Network/ddosProtectionPlans (DDoS protection plans)
- Microsoft.Network/dnsForwardingRulesets (Dns Forwarding Rulesets)
- Microsoft.Network/dnsResolvers (DNS Private Resolvers)
- Microsoft.Network/dnsZones (DNS zones)
- microsoft.network/dscpconfigurations
- Microsoft.Network/expressRouteCircuits (ExpressRoute circuits)
- microsoft.network/expressroutecrossconnections
- microsoft.network/expressroutegateways
- Microsoft.Network/expressRoutePorts (ExpressRoute Direct)
- Microsoft.Network/firewallPolicies (Firewall Policies)
- microsoft.network/firewallpolicies/rulegroups
- Microsoft.Network/frontdoors (Front Doors)
- Microsoft.Network/FrontDoorWebApplicationFirewallPolicies (Web Application Firewall policies (WAF))
- microsoft.network/ipallocations
- Microsoft.Network/ipGroups (IP Groups)
- Microsoft.Network/LoadBalancers (Load balancers)
- Microsoft.Network/localnetworkgateways (Local network gateways)
- microsoft.network/mastercustomipprefixes
- Microsoft.Network/natGateways (NAT gateways)
- Microsoft.Network/NetworkExperimentProfiles (Internet Analyzer profiles)
- microsoft.network/networkintentpolicies
- Microsoft.Network/networkinterfaces (Network interfaces)
  - Sample query: [Get virtual networks and subnets of network interfaces](../samples/samples-by-category.md#get-virtual-networks-and-subnets-of-network-interfaces)
  - Sample query: [List virtual machines with their network interface and public IP](../samples/samples-by-category.md#list-virtual-machines-with-their-network-interface-and-public-ip)
- Microsoft.Network/networkManagers (Network Managers)
- microsoft.network/networkprofiles
- Microsoft.Network/NetworkSecurityGroups (Network security groups)
  - Sample query: [Show unassociated network security groups](../samples/samples-by-category.md#show-unassociated-network-security-groups)
- microsoft.network/networksecurityperimeters
- microsoft.network/networkvirtualappliances
- microsoft.network/networkwatchers (Network Watchers)
- microsoft.network/networkwatchers/connectionmonitors
- microsoft.network/networkwatchers/flowlogs (NSG Flow Logs)
- microsoft.network/networkwatchers/lenses
- microsoft.network/networkwatchers/pingmeshes
- microsoft.network/p2svpngateways
- Microsoft.Network/privateDnsZones (Private DNS zones)
- microsoft.network/privatednszones/virtualnetworklinks
- microsoft.network/privateendpointredirectmaps
- Microsoft.Network/privateEndpoints (Private endpoints)
- Microsoft.Network/privateLinkServices (Private link services)
- Microsoft.Network/PublicIpAddresses (Public IP addresses)
  - Sample query: [List virtual machines with their network interface and public IP](../samples/samples-by-category.md#list-virtual-machines-with-their-network-interface-and-public-ip)
- Microsoft.Network/publicIpPrefixes (Public IP Prefixes)
- Microsoft.Network/routeFilters (Route filters)
- Microsoft.Network/routeTables (Route tables)
- microsoft.network/sampleresources
- microsoft.network/securitypartnerproviders
- Microsoft.Network/serviceEndpointPolicies (Service endpoint policies)
- Microsoft.Network/trafficmanagerprofiles (Traffic Manager profiles)
- microsoft.network/virtualhubs
- microsoft.network/virtualhubs/bgpconnections
- microsoft.network/virtualhubs/ipconfigurations
- Microsoft.Network/virtualNetworkGateways (Virtual network gateways)
- Microsoft.Network/virtualNetworks (Virtual networks)
- microsoft.network/virtualnetworktaps
- microsoft.network/virtualrouters
- Microsoft.Network/virtualWans (Virtual WANs)
- microsoft.network/vpngateways
- microsoft.network/vpnserverconfigurations
- microsoft.network/vpnsites
- microsoft.networkfunction/azuretrafficcollectors
- Microsoft.NotificationHubs/namespaces (Notification Hub Namespaces)
- Microsoft.NotificationHubs/namespaces/notificationHubs (Notification Hubs)
- microsoft.nutanix/interfaces
- microsoft.nutanix/nodes
- microsoft.objectstore/osnamespaces
- microsoft.offazure/hypervsites
- microsoft.offazure/importsites
- microsoft.offazure/mastersites
- microsoft.offazure/serversites
- microsoft.offazure/vmwaresites
- Microsoft.OpenEnergyPlatform/energyServices (Azure OpenEnergy)
- microsoft.openlogisticsplatform/applicationworkspaces
- Microsoft.OpenLogisticsPlatform/workspaces (Open Supply Chain Platform)
- microsoft.operationalinsights/clusters
- Microsoft.OperationalInsights/querypacks (Log Analytics query packs)
- Microsoft.OperationalInsights/workspaces (Log Analytics workspaces)
- Microsoft.OperationsManagement/solutions (Solutions)
- microsoft.operationsmanagement/views
- Microsoft.Peering/peerings (Peerings)
- Microsoft.Peering/peeringServices (Peering Services)
- Microsoft.PlayFab/playerAccountPools (Player account pools)
- Microsoft.PlayFab/titles (PlayFab titles)
- Microsoft.Portal/dashboards (Shared dashboards)
- microsoft.portalsdk/rootresources
- microsoft.powerbi/privatelinkservicesforpowerbi
- microsoft.powerbi/tenants
- microsoft.powerbi/workspacecollections
- microsoft.powerbidedicated/autoscalevcores
- Microsoft.PowerBIDedicated/capacities (Power BI Embedded)
- microsoft.powerplatform/accounts
- microsoft.powerplatform/enterprisepolicies
- microsoft.projectbabylon/accounts
- microsoft.providerhubdevtest/regionalstresstests
- Microsoft.Purview/Accounts (Purview accounts)
- Microsoft.Quantum/Workspaces (Quantum Workspaces)
- Microsoft.RecommendationsService/accounts (Intelligent Recommendations Accounts)
- Microsoft.RecommendationsService/accounts/modeling (Modeling)
- Microsoft.RecommendationsService/accounts/serviceEndpoints (Service Endpoints)
- Microsoft.RecoveryServices/vaults (Recovery Services vaults)
- microsoft.recoveryservices/vaults/replicationfabrics/replicationprotectioncontainers/replicationprotecteditems
- microsoft.recoveryservices/vaults/replicationfabrics/replicationrecoveryservicesproviders
- Microsoft.RedHatOpenShift/OpenShiftClusters (Azure Red Hat OpenShift)
- Microsoft.Relay/namespaces (Relays)
- microsoft.remoteapp/collections
- microsoft.resiliency/chaosexperiments
- Microsoft.ResourceConnector/Appliances (Resource bridges)
- Microsoft.resourcegraph/queries (Resource Graph queries)
- Microsoft.Resources/deploymentScripts (Deployment Scripts)
- Microsoft.Resources/templateSpecs (Template specs)
- microsoft.resources/templatespecs/versions
- Microsoft.SaaS/applications (Software as a Service (classic))
- Microsoft.SaaS/resources (SaaS)
- Microsoft.Scheduler/jobCollections (Scheduler Job Collections)
- Microsoft.Scom/managedInstances (Aquila Instances)
- microsoft.scvmm/availabilitysets
- microsoft.scvmm/clouds
- Microsoft.scvmm/virtualMachines (SCVMM virtual machine - Azure Arc)
- microsoft.scvmm/virtualmachinetemplates
- microsoft.scvmm/virtualnetworks
- microsoft.scvmm/vmmservers
- Microsoft.Search/searchServices (Search services)
- microsoft.security/apicollections
- microsoft.security/apicollections/apiendpoints
- microsoft.security/assignments
- microsoft.security/automations
- microsoft.security/customassessmentautomations
- microsoft.security/customentitystoreassignments
- microsoft.security/iotsecuritysolutions
- microsoft.security/securityconnectors
- microsoft.security/standards
- Microsoft.SecurityDetonation/chambers (Security Detonation Chambers)
- Microsoft.ServiceBus/namespaces (Service Bus Namespaces)
- Microsoft.ServiceFabric/clusters (Service Fabric clusters)
- microsoft.servicefabric/containergroupsets
- Microsoft.ServiceFabric/managedclusters (Service Fabric managed clusters)
- microsoft.servicefabricmesh/applications
- microsoft.servicefabricmesh/gateways
- microsoft.servicefabricmesh/networks
- microsoft.servicefabricmesh/secrets
- microsoft.servicefabricmesh/volumes
- Microsoft.ServicesHub/connectors (Services Hub Connectors)
- Microsoft.SignalRService/SignalR (SignalR)
- Microsoft.SignalRService/WebPubSub (Web PubSub Service)
- microsoft.singularity/accounts
- microsoft.skytap/nodes
- microsoft.solutions/appliancedefinitions
- microsoft.solutions/appliances
- Microsoft.Solutions/applicationDefinitions (Service catalog managed application definitions)
- Microsoft.Solutions/applications (Managed applications)
- microsoft.solutions/jitrequests
- microsoft.spoolservice/spools
- Microsoft.Sql/instancePools (Instance pools)
- Microsoft.Sql/managedInstances (SQL managed instances)
- Microsoft.Sql/managedInstances/databases (Managed databases)
- Microsoft.Sql/servers (SQL servers)
- Microsoft.Sql/servers/databases (SQL databases)
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
  - Sample query: [List SQL Databases and their elastic pools](../samples/samples-by-category.md#list-sql-databases-and-their-elastic-pools)
- Microsoft.Sql/servers/elasticpools (SQL elastic pools)
  - Sample query: [List SQL Databases and their elastic pools](../samples/samples-by-category.md#list-sql-databases-and-their-elastic-pools)
- microsoft.sql/servers/jobaccounts
- Microsoft.Sql/servers/jobAgents (Elastic Job agents)
- Microsoft.Sql/virtualClusters (Virtual clusters)
- microsoft.sqlvirtualmachine/sqlvirtualmachinegroups
- Microsoft.SqlVirtualMachine/SqlVirtualMachines (SQL virtual machines)
- microsoft.sqlvm/dwvm
- microsoft.storage/datamovers
- Microsoft.Storage/StorageAccounts (Storage accounts)
  - Sample query: [Find storage accounts with a specific case-insensitive tag on the resource group](../samples/samples-by-category.md#find-storage-accounts-with-a-specific-case-insensitive-tag-on-the-resource-group)
  - Sample query: [Find storage accounts with a specific case-sensitive tag on the resource group](../samples/samples-by-category.md#find-storage-accounts-with-a-specific-case-sensitive-tag-on-the-resource-group)
  - Sample query: [List all storage accounts with specific tag value](../samples/samples-by-category.md#list-all-storage-accounts-with-specific-tag-value)
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- Microsoft.StorageCache/amlFilesystems (Lustre File Systems)
- Microsoft.StorageCache/caches (HPC caches)
- Microsoft.StoragePool/diskPools (Disk Pools)
- Microsoft.StorageSync/storageSyncServices (Storage Sync Services)
- Microsoft.StorageSyncDev/storageSyncServices (Storage Sync Services)
- Microsoft.StorageSyncInt/storageSyncServices (Storage Sync Services)
- Microsoft.StorSimple/Managers (StorSimple Device Managers)
- Microsoft.StreamAnalytics/clusters (Stream Analytics clusters)
- Microsoft.StreamAnalytics/StreamingJobs (Stream Analytics jobs)
- microsoft.swiftlet/virtualmachines
- microsoft.swiftlet/virtualmachinesnapshots
- Microsoft.Synapse/privateLinkHubs (Azure Synapse Analytics (private link hubs))
- Microsoft.Synapse/workspaces (Azure Synapse Analytics)
- Microsoft.Synapse/workspaces/bigDataPools (Apache Spark pools)
- microsoft.synapse/workspaces/eventstreams
- Microsoft.Synapse/workspaces/kustopools (Data Explorer pools (preview))
- microsoft.synapse/workspaces/sqldatabases
- Microsoft.Synapse/workspaces/sqlPools (Dedicated SQL pools)
- microsoft.terraformoss/providerregistrations
- Microsoft.TestBase/testBaseAccounts (Test Base Accounts)
- microsoft.testbase/testbaseaccounts/packages
- microsoft.testbase/testbases
- Microsoft.TimeSeriesInsights/environments (Time Series Insights environments)
- Microsoft.TimeSeriesInsights/environments/eventsources (Time Series Insights event sources)
- Microsoft.TimeSeriesInsights/environments/referenceDataSets (Time Series Insights reference data sets)
- microsoft.token/stores
- microsoft.tokenvault/vaults
- Microsoft.VideoIndexer/accounts (Video Analyzer for Media)
- Microsoft.VirtualMachineImages/imageTemplates (Image Templates)
- microsoft.visualstudio/account (Azure DevOps organizations)
- microsoft.visualstudio/account/extension
- microsoft.visualstudio/account/project (DevOps Starter)
- microsoft.vmware/arczones
- microsoft.vmware/resourcepools
- microsoft.vmware/vcenters
- microsoft.vmware/virtualmachines
- microsoft.vmware/virtualmachinetemplates
- microsoft.vmware/virtualnetworks
- Microsoft.VMwareCloudSimple/dedicatedCloudNodes (CloudSimple Nodes)
- Microsoft.VMwareCloudSimple/dedicatedCloudServices (CloudSimple Services)
- Microsoft.VMwareCloudSimple/virtualMachines (CloudSimple Virtual Machines)
- microsoft.vmwareonazure/privateclouds
- microsoft.vmwarevirtustream/privateclouds
- microsoft.vsonline/accounts
- Microsoft.VSOnline/Plans (Visual Studio Online Plans)
- microsoft.web/apimanagementaccounts
- microsoft.web/apimanagementaccounts/apis
- microsoft.web/certificates
- Microsoft.Web/connectionGateways (On-premises data gateways)
- Microsoft.Web/connections (API Connections)
- Microsoft.Web/containerApps (Container Apps)
- Microsoft.Web/customApis (Logic Apps Custom Connector)
- Microsoft.Web/HostingEnvironments (App Service Environments)
- Microsoft.Web/KubeEnvironments (App Service Kubernetes Environments)
- Microsoft.Web/serverFarms (App Service plans)
- Microsoft.Web/sites (App Services)
- microsoft.web/sites/premieraddons
- Microsoft.Web/sites/slots (App Service (Slots))
- Microsoft.Web/StaticSites (Static Web Apps)
- microsoft.web/workerapps
- Microsoft.WindowsESU/multipleActivationKeys (Windows Multiple Activation Keys)
- Microsoft.WindowsIoT/DeviceServices (Windows 10 IoT Core Services)
- microsoft.workloadbuilder/migrationagents
- microsoft.workloadbuilder/workloads
- microsoft.workloads/monitors
- Microsoft.Workloads/phpworkloads (Linux workloads (LAMP) (preview))
- Microsoft.Workloads/sapVirtualInstances (SAP Virtual Instances)
- Microsoft.Workloads/sapVirtualInstances/applicationInstances (SAP app server instances)
- Microsoft.Workloads/sapVirtualInstances/centralInstances (SAP central server instances)
- Microsoft.Workloads/sapVirtualInstances/databaseInstances (SAP database server instances)
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

- microsoft.security/assessments
  - Sample query: [Count healthy, unhealthy, and not applicable resources per recommendation](../samples/samples-by-category.md#count-healthy-unhealthy-and-not-applicable-resources-per-recommendation)
  - Sample query: [List Azure Security Center recommendations](../samples/samples-by-category.md)
  - Sample query: [List Container Registry vulnerability assessment results](../samples/samples-by-category.md#list-container-registry-vulnerability-assessment-results)
  - Sample query: [List Qualys vulnerability assessment results](../samples/samples-by-category.md#list-qualys-vulnerability-assessment-results)
- microsoft.security/assessments/subassessments
  - Sample query: [List Container Registry vulnerability assessment results](../samples/samples-by-category.md#list-container-registry-vulnerability-assessment-results)
  - Sample query: [List Qualys vulnerability assessment results](../samples/samples-by-category.md#list-qualys-vulnerability-assessment-results)
- microsoft.security/insights/classification (Data Sensitivity Security Insights (Preview))
  - Sample query: [Get sensitivity insight of a specific resource](../samples/samples-by-category.md)
- microsoft.security/iotalerts
  - Sample query: [Get all IoT alerts on hub, filtered by type](../samples/samples-by-category.md#get-all-iot-alerts-on-hub-filtered-by-type)
  - Sample query: [Get specific IoT alert](../samples/samples-by-category.md#get-specific-iot-alert)
- microsoft.security/locations/alerts (Security Alerts)
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
- microsoft.security/softwareinventories
- microsoft.security/softwareinventory

## servicehealthresources

For sample queries for this table, see [Resource Graph sample queries for servicehealthresources](../samples/samples-by-table.md#servicehealthresources).

- microsoft.resourcehealth/events
  - Sample query: [Active Service Health event subscription impact](../samples/samples-by-category.md#active-service-health-event-subscription-impact)
  - Sample query: [All active health advisory events](../samples/samples-by-category.md#all-active-health-advisory-events)
  - Sample query: [All active planned maintenance events](../samples/samples-by-category.md#all-active-planned-maintenance-events)
  - Sample query: [All active Service Health events](../samples/samples-by-category.md#all-active-service-health-events)
  - Sample query: [All active service issue events](../samples/samples-by-category.md#all-active-service-issue-events)

## workloadmonitorresources

- microsoft.workloadmonitor/monitors

## Next steps

- Learn more about the [query language](../concepts/query-language.md).
- Learn more about how to [explore resources](../concepts/explore-resources.md).
- See samples of [Starter queries](../samples/starter.md).
