---
title: Supported Azure Resource Manager resource types
description: Provide a list of the Azure Resource Manager resource types supported by Azure Resource Graph and Change History.
ms.date: 06/27/2023
ms.topic: reference
ms.custom: generated
ms.author: davidsmatlak
author: davidsmatlak
---

# Azure Resource Graph table and resource type reference

Azure Resource Graph supports the following **resource types** of [Azure Resource Manager](../../../azure-resource-manager/management/overview.md). Each **resource type** is part of a **table** in Resource Graph.

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

## appserviceresources
- microsoft.web/sites/config/web
- microsoft.web/sites/slots/config/web
- microsoft.web/sites/workflows

## authorizationresources

- microsoft.authorization/roleassignments
- microsoft.authorization/roledefinitions
- microsoft.authorization/classicadministrators

## chaosresources

- microsoft.chaos/experiments/statuses
- microsoft.chaos/targets
- microsoft.chaos/targets/capabilities

## communitygalleryresources

- microsoft.compute/locations/communitygalleries
- microsoft.compute/locations/communitygalleries/images
- microsoft.compute/locations/communitygalleries/images/versions

## desktopvirtualizationresources

- microsoft.desktopvirtualization/hostpools/sessionhosts

## edgeorderresources

- microsoft.edgeorder/orders

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
  - Sample query: [List all ConnectedClusters and ManagedClusters that contain a Flux Configuration](../samples/samples-by-category.md#list-all-connectedclusters-and-managedclusters-that-contain-a-flux-configuration)
  - Sample query: [List All Flux Configurations that Are in a Non-Compliant State](../samples/samples-by-category.md#list-all-flux-configurations-that-are-in-a-non-compliant-state)
- microsoft.kubernetesconfiguration/namespaces
- microsoft.kubernetesconfiguration/sourcecontrolconfigurations

## maintenanceresources

- microsoft.maintenance/applyupdates
- microsoft.maintenance/configurationassignments
- microsoft.maintenance/maintenanceconfigurations/applyupdates
- microsoft.maintenance/updates

## managedservicesresources

- microsoft.managedservices/registrationassignments
- microsoft.managedservices/registrationdefinitions

## networkresources

- microsoft.network/networkgroupmemberships
- microsoft.network/networkmanagerconnections
- microsoft.network/networkmanagers/connectivityconfigurations
- microsoft.network/networkmanagers/networkgroups
- microsoft.network/networkmanagers/networkgroups/staticmembers
- microsoft.network/securityadminconfigurations
- microsoft.network/securityadminconfigurations/rulecollections
- microsoft.network/securityadminconfigurations/rulecollections/rules

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
- microsoft.recoveryservices/vaults/backupFabrics/protectionContainers/protectedItems (Backup Items)
- microsoft.recoveryservices/vaults/backupjobs
- microsoft.recoveryservices/vaults/backuppolicies

## resourcechanges

- microsoft.resources/changes

## resourcecontainerchanges

- microsoft.resources/changes

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
- microsoft.resources/subscriptions/resourceGroups (Resource groups)
  - Sample query: [Combine results from two queries into a single result](../samples/samples-by-category.md)
  - Sample query: [Find storage accounts with a specific case-insensitive tag on the resource group](../samples/samples-by-category.md#find-storage-accounts-with-a-specific-case-insensitive-tag-on-the-resource-group)
  - Sample query: [Find storage accounts with a specific case-sensitive tag on the resource group](../samples/samples-by-category.md#find-storage-accounts-with-a-specific-case-sensitive-tag-on-the-resource-group)

## resources

For sample queries for this table, see [Resource Graph sample queries for resources](../samples/samples-by-table.md#resources).

- /datascanners/{scannername}
- 84codes.cloudamqp/servers
- Citrix.Services/XenAppEssentials (Citrix Virtual Apps Essentials)
- Citrix.Services/XenDesktopEssentials (Citrix Virtual Desktops Essentials)
- crypteron.datasecurity/apps
- Dynatrace.Observability/monitors (Dynatrace)
- GitHub.Enterprise/accounts (GitHub AE)
- gridpro.evops/accounts
- gridpro.evops/accounts/eventrules
- gridpro.evops/accounts/requesttemplates
- gridpro.evops/accounts/views
- incapsula.waf/accounts
- livearena.broadcast/services
- mailjet.email/services
- micorosft.web/kubeenvironments
- microsoft.AAD/domainServices (Azure AD Domain Services)
- microsoft.aadiam/azureadmetrics
- microsoft.aadiam/privateLinkForAzureAD (Private Link for Azure AD)
- microsoft.aadiam/tenants
- microsoft.AgFoodPlatform/farmBeats (Azure FarmBeats)
- microsoft.aisupercomputer/accounts
- microsoft.aisupercomputer/accounts/jobgroups
- microsoft.aisupercomputer/accounts/jobgroups/jobs
- microsoft.alertsmanagement/actionrules
- microsoft.alertsmanagement/prometheusrulegroups
- microsoft.alertsmanagement/resourcehealthalertrules
- microsoft.alertsmanagement/smartdetectoralertrules
- microsoft.AnalysisServices/servers (Analysis Services)
- microsoft.AnyBuild/clusters (AnyBuild clusters)
- microsoft.ApiManagement/service (API Management services)
- microsoft.app/containerapps
- microsoft.app/managedenvironments
- microsoft.app/managedenvironments/certificates
- microsoft.appassessment/migrateprojects
- microsoft.AppConfiguration/configurationStores (App Configuration)
- microsoft.AppPlatform/Spring (Azure Spring Cloud)
- microsoft.archive/collections
- microsoft.Attestation/attestationProviders (Attestation providers)
- microsoft.automanage/accounts
- microsoft.automanage/configurationprofilepreferences
- microsoft.automanage/configurationprofiles
- microsoft.Automation/AutomationAccounts (Automation Accounts)
- microsoft.automation/automationaccounts/configurations
- microsoft.Automation/automationAccounts/runbooks (Runbook)
- microsoft.autonomousdevelopmentplatform/accounts
- microsoft.AutonomousSystems/workspaces (Bonsai)
- microsoft.AVS/privateClouds (AVS Private clouds)
- microsoft.azconfig/configurationstores
- microsoft.AzureActiveDirectory/b2cDirectories (B2C Tenants)
- microsoft.AzureActiveDirectory/guestUsages (Guest Usages)
- microsoft.AzureArcData/dataControllers (Azure Arc data controllers)
- microsoft.AzureArcData/postgresInstances (Azure Arc-enabled PostgreSQL Hyperscale server groups)
- microsoft.AzureArcData/sqlManagedInstances (SQL managed instances - Azure Arc)
- microsoft.AzureArcData/sqlServerInstances (SQL Server - Azure Arc)
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
- microsoft.AzureData/sqlServerRegistrations (SQL Server registries)
- microsoft.AzurePercept/accounts (Azure Percept accounts)
- microsoft.azuresphere/catalogs
- microsoft.azuresphere/catalogs/products
- microsoft.azuresphere/catalogs/products/devicegroups
- microsoft.azurestack/edgesubscriptions
- microsoft.azurestack/linkedsubscriptions
- microsoft.azurestack/registrations
- microsoft.AzureStackHCI/clusters (Azure Stack HCI)
- microsoft.azurestackhci/galleryimages
- microsoft.azurestackhci/networkinterfaces
- microsoft.azurestackhci/virtualharddisks
- microsoft.AzureStackHci/virtualMachines (Azure Stack HCI virtual machine - Azure Arc)
- microsoft.azurestackhci/virtualmachines/extensions
- microsoft.azurestackhci/virtualnetworks
- microsoft.backupsolutions/vmwareapplications
- microsoft.baremetal/consoleconnections
- microsoft.BareMetal/crayServers (Cray Servers)
- microsoft.BareMetal/monitoringServers (Monitoring Servers)
- microsoft.BareMetalInfrastructure/bareMetalInstances (BareMetal Instances)
- microsoft.Batch/batchAccounts (Batch accounts)
- microsoft.batchai/clusters
- microsoft.batchai/fileservers
- microsoft.batchai/jobs
- microsoft.batchai/workspaces
- microsoft.Bing/accounts (Bing Resources)
- microsoft.bingmaps/mapapis
- microsoft.biztalkservices/biztalk
- microsoft.blockchain/blockchainmembers
- microsoft.blockchain/cordamembers
- microsoft.blockchain/watchers
- microsoft.BotService/botServices (Bot Services)
- microsoft.Cache/Redis (Azure Cache for Redis)
- microsoft.Cache/RedisEnterprise (Redis Enterprise)
- microsoft.cascade/sites
- microsoft.Cdn/CdnWebApplicationFirewallPolicies (Content Delivery Network WAF policies)
- microsoft.cdn/profiles (Front Doors Standard/Premium (Preview))
- microsoft.Cdn/Profiles/AfdEndpoints (Endpoints)
- microsoft.cdn/profiles/endpoints (Endpoints)
- microsoft.CertificateRegistration/certificateOrders (App Service Certificates)
- microsoft.chaos/chaosexperiments (Chaos Experiments (Classic))
- microsoft.chaos/experiments (Chaos Experiments)
- microsoft.classicCompute/domainNames (Cloud services (classic))
- microsoft.ClassicCompute/VirtualMachines (Virtual machines (classic))
- microsoft.ClassicNetwork/networkSecurityGroups (Network security groups (classic))
- microsoft.ClassicNetwork/reservedIps (Reserved IP addresses (classic))
- microsoft.ClassicNetwork/virtualNetworks (Virtual networks (classic))
- microsoft.ClassicStorage/StorageAccounts (Storage accounts (classic))
- microsoft.cloudes/accounts
- microsoft.cloudsearch/indexes
- microsoft.CloudTest/accounts (CloudTest Accounts)
- microsoft.CloudTest/hostedpools (1ES Hosted Pools)
- microsoft.CloudTest/images (CloudTest Images)
- microsoft.CloudTest/pools (CloudTest Pools)
- microsoft.ClusterStor/nodes (ClusterStors)
- microsoft.codesigning/codesigningaccounts
- microsoft.codespaces/plans
- microsoft.cognition/syntheticsaccounts
- microsoft.CognitiveServices/accounts (Cognitive Services)
- microsoft.Compute/availabilitySets (Availability sets)
- microsoft.Compute/capacityReservationGroups (Capacity Reservation Groups)
- microsoft.compute/capacityreservationgroups/capacityreservations
- microsoft.compute/capacityreservations
- microsoft.Compute/cloudServices (Cloud services (extended support))
- microsoft.Compute/diskAccesses (Disk Accesses)
- microsoft.Compute/diskEncryptionSets (Disk Encryption Sets)
- microsoft.Compute/disks (Disks)
- microsoft.Compute/galleries (Azure compute galleries)
- microsoft.Compute/galleries/applications (VM application definitions)
- microsoft.Compute/galleries/applications/versions (VM application versions)
- microsoft.Compute/galleries/images (VM image definitions)
- microsoft.Compute/galleries/images/versions (VM image versions)
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
- microsoft.Compute/virtualMachineScaleSets (Virtual machine scale sets)
  - Sample query: [Get virtual machine scale set capacity and size](../samples/samples-by-category.md#get-virtual-machine-scale-set-capacity-and-size)
- microsoft.compute/virtualmachinescalesets/virtualmachines/networkinterfaces/ipconfigurations/publicipaddresses
- microsoft.ConfidentialLedger/ledgers (Confidential Ledgers)
- microsoft.Confluent/organizations (Confluent organizations)
- microsoft.ConnectedCache/cacheNodes (Connected Cache Resources)
- microsoft.ConnectedCache/enterpriseCustomers (Connected Cache Resources)
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
- microsoft.ContainerInstance/containerGroups (Container instances)
- microsoft.ContainerRegistry/registries (Container registries)
- microsoft.containerregistry/registries/agentpools
- microsoft.containerregistry/registries/buildtasks
- microsoft.ContainerRegistry/registries/replications (Container registry replications)
- microsoft.containerregistry/registries/taskruns
- microsoft.containerregistry/registries/tasks
- microsoft.ContainerRegistry/registries/webhooks (Container registry webhooks)
- microsoft.containerservice/containerservices
- microsoft.ContainerService/managedClusters (Kubernetes services)
  - Sample query: [List all ConnectedClusters and ManagedClusters that contain a Flux Configuration](../samples/samples-by-category.md#list-all-connectedclusters-and-managedclusters-that-contain-a-flux-configuration)
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
- microsoft.Dashboard/grafana (Grafana Workspaces)
- microsoft.DataBox/jobs (Azure Data Box)
- microsoft.DataBoxEdge/dataBoxEdgeDevices (Azure Stack Edge / Data Box Gateway)
- microsoft.Databricks/workspaces (Azure Databricks Services)
- microsoft.DataCatalog/catalogs (Data Catalog)
- microsoft.datacatalog/datacatalogs
- microsoft.DataCollaboration/workspaces (Project CI)
- microsoft.Datadog/monitors (Datadog)
- microsoft.DataFactory/dataFactories (Data factories)
- microsoft.DataFactory/factories (Data factories (V2))
- microsoft.DataLakeAnalytics/accounts (Data Lake Analytics)
- microsoft.DataLakeStore/accounts (Data Lake Storage Gen1)
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- microsoft.datamigration/controllers
- microsoft.DataMigration/services (Azure Database Migration Services)
- microsoft.DataMigration/services/projects (Azure Database Migration Projects)
- microsoft.datamigration/slots
- microsoft.datamigration/sqlmigrationservices (Azure Database Migration Services)
- microsoft.DataProtection/BackupVaults (Backup vaults)
- microsoft.DataProtection/resourceGuards (Resource Guards (Preview))
- microsoft.dataprotection/resourceoperationgatekeepers
- microsoft.datareplication/replicationfabrics
- microsoft.DataReplication/replicationVaults (Site Recovery Vaults)
- microsoft.DataShare/accounts (Data Shares)
- microsoft.DBforMariaDB/servers (Azure Database for MariaDB servers)
- microsoft.DBforMySQL/flexibleServers (Azure Database for MySQL flexible servers)
- microsoft.DBforMySQL/servers (Azure Database for MySQL servers)
- microsoft.DBforPostgreSQL/flexibleServers (Azure Database for PostgreSQL flexible servers)
- microsoft.DBforPostgreSQL/serverGroups (Azure Database for PostgreSQL server groups)
- microsoft.DBforPostgreSQL/serverGroupsv2 (Azure Database for PostgreSQL server groups)
- microsoft.DBforPostgreSQL/servers (Azure Database for PostgreSQL servers)
- microsoft.DBforPostgreSQL/serversv2 (Azure Database for PostgreSQL servers v2)
- microsoft.dbforpostgresql/singleservers
- microsoft.delegatednetwork/controller
- microsoft.delegatednetwork/delegatedsubnets
- microsoft.delegatednetwork/orchestratorinstances
- microsoft.delegatednetwork/orchestrators
- microsoft.deploymentmanager/artifactsources
- microsoft.DeploymentManager/Rollouts (Rollouts)
- microsoft.deploymentmanager/servicetopologies
- microsoft.deploymentmanager/servicetopologies/services
- microsoft.deploymentmanager/servicetopologies/services/serviceunits
- microsoft.deploymentmanager/steps
- microsoft.DesktopVirtualization/ApplicationGroups (Application groups)
- microsoft.DesktopVirtualization/HostPools (Host pools)
- microsoft.DesktopVirtualization/ScalingPlans (Scaling plans)
- microsoft.DesktopVirtualization/Workspaces (Workspaces)
- microsoft.devai/instances
- microsoft.devai/instances/experiments
- microsoft.devai/instances/sandboxes
- microsoft.devai/instances/sandboxes/experiments
- microsoft.devices/elasticpools
- microsoft.devices/elasticpools/iothubtenants
- microsoft.Devices/IotHubs (IoT Hub)
- microsoft.Devices/ProvisioningServices (Device Provisioning Services)
- microsoft.DeviceUpdate/Accounts (Device Update for IoT Hubs)
- microsoft.deviceupdate/accounts/instances
- microsoft.devops/pipelines (DevOps Starter)
- microsoft.devspaces/controllers
- microsoft.devtestlab/labcenters
- microsoft.DevTestLab/labs (DevTest Labs)
- microsoft.devtestlab/labs/servicerunners
- microsoft.DevTestLab/labs/virtualMachines (Virtual machines)
- microsoft.devtestlab/schedules
- microsoft.DigitalTwins/digitalTwinsInstances (Azure Digital Twins)
- microsoft.DocumentDB/cassandraClusters (Azure Managed Instance for Apache Cassandra)
- microsoft.DocumentDb/databaseAccounts (Azure Cosmos DB accounts)
  - Sample query: [List Azure Cosmos DB with specific write locations](../samples/samples-by-category.md#list-azure-cosmos-db-with-specific-write-locations)
- microsoft.DomainRegistration/domains (App Service Domains)
- microsoft.dynamics365fraudprotection/instances
- microsoft.EdgeOrder/addresses (Azure Edge Hardware Center Address)
- microsoft.edgeorder/ordercollections
- microsoft.EdgeOrder/orderItems (Azure Edge Hardware Center)
- microsoft.edgeorder/orders
- microsoft.Elastic/monitors (Elasticsearch (Elastic Cloud))
- microsoft.enterpriseknowledgegraph/services
- microsoft.EventGrid/domains (Event Grid Domains)
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
- microsoft.falcon/namespaces
- microsoft.Fidalgo/devcenters (Fidalgo DevCenters)
- microsoft.fidalgo/machinedefinitions
- microsoft.fidalgo/networksettings (Network Configurations)
- microsoft.Fidalgo/projects (Fidalgo Projects)
- microsoft.Fidalgo/projects/environments (Fidalgo Environments)
- microsoft.fidalgo/projects/pools
- microsoft.FluidRelay/fluidRelayServers (Fluid Relay)
- microsoft.footprintmonitoring/profiles
- microsoft.gaming/titles
- microsoft.Genomics/accounts (Genomics accounts)
- microsoft.guestconfiguration/automanagedaccounts
- microsoft.HanaOnAzure/hanaInstances (SAP HANA on Azure)
- microsoft.HanaOnAzure/sapMonitors (Azure Monitors for SAP Solutions)
- microsoft.hardwaresecuritymodules/dedicatedhsms
- microsoft.HDInsight/clusterpools (HDInsight cluster pools)
- microsoft.HDInsight/clusterpools/clusters (HDInsight gen2 clusters)
- microsoft.HDInsight/clusterpools/clusters/sessionclusters (HDInsight session clusters)
- microsoft.HDInsight/clusters (HDInsight clusters)
- microsoft.HealthBot/healthBots (Azure Health Bot)
- microsoft.HealthcareApis/services (Azure API for FHIR)
- microsoft.healthcareapis/services/privateendpointconnections
- microsoft.HealthcareApis/workspaces (Healthcare APIs Workspaces)
- microsoft.HealthcareApis/workspaces/dicomservices (DICOM services)
- microsoft.HealthcareApis/workspaces/fhirservices (FHIR services)
- microsoft.HealthcareApis/workspaces/iotconnectors (IoT connectors)
- microsoft.HpcWorkbench/instances (HPC Workbenches (preview))
- microsoft.HpcWorkbench/instances/chambers (Chambers (preview))
- microsoft.HpcWorkbench/instances/chambers/accessProfiles (Chamber Profiles (preview))
- microsoft.HpcWorkbench/instances/chambers/workloads (Chamber VMs (preview))
- microsoft.HpcWorkbench/instances/consortiums (Consortiums (preview))
- microsoft.HybridCompute/machines (Servers - Azure Arc)
  - Sample query: [Get count and percentage of Arc-enabled servers by domain](../samples/samples-by-category.md#get-count-and-percentage-of-arc-enabled-servers-by-domain)
  - Sample query: [List all extensions installed on an Azure Arc-enabled server](../samples/samples-by-category.md#list-all-extensions-installed-on-an-azure-arc-enabled-server)
  - Sample query: [List Arc-enabled servers not running latest released agent version](../samples/samples-by-category.md#list-arc-enabled-servers-not-running-latest-released-agent-version)
- microsoft.hybridcompute/machines/extensions
  - Sample query: [List all extensions installed on an Azure Arc-enabled server](../samples/samples-by-category.md#list-all-extensions-installed-on-an-azure-arc-enabled-server)
- microsoft.HybridCompute/privateLinkScopes (Azure Arc Private Link Scopes)
- microsoft.hybridcontainerservice/provisionedclusters
- microsoft.hybridcontainerservice/provisionedclusters/agentpools
- microsoft.HybridData/dataManagers (StorSimple Data Managers)
- microsoft.HybridNetwork/devices (Azure Network Function Manager – Devices)
- microsoft.HybridNetwork/networkFunctions (Azure Network Function Manager – Network Functions)
- microsoft.hybridnetwork/virtualnetworkfunctions
- microsoft.ImportExport/jobs (Import/export jobs)
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
- microsoft.Insights/privateLinkScopes (Azure Monitor Private Link Scopes)
- microsoft.insights/querypacks
- microsoft.insights/scheduledqueryrules
- microsoft.insights/webtests (Availability tests)
- microsoft.insights/workbooks (Azure Workbooks)
- microsoft.insights/workbooktemplates (Azure Workbook Templates)
- microsoft.intelligentitdigitaltwin/digitaltwins
- microsoft.intelligentitdigitaltwin/digitaltwins/assets
- microsoft.intelligentitdigitaltwin/digitaltwins/executionplans
- microsoft.intelligentitdigitaltwin/digitaltwins/testplans
- microsoft.intelligentitdigitaltwin/digitaltwins/tests
- microsoft.IoTCentral/IoTApps (IoT Central Applications)
- microsoft.iotspaces/graph
- microsoft.keyvault/hsmpools
- microsoft.keyvault/managedhsms
- microsoft.KeyVault/vaults (Key vaults)
  - Sample query: [Count key vault resources](../samples/samples-by-category.md#count-key-vault-resources)
  - Sample query: [Key vaults with subscription name](../samples/samples-by-category.md#key-vaults-with-subscription-name)
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- microsoft.Kubernetes/connectedClusters (Kubernetes - Azure Arc)
  - Sample query: [List all Azure Arc-enabled Kubernetes clusters without Azure Monitor extension](../samples/samples-by-category.md#list-all-azure-arc-enabled-kubernetes-clusters-without-azure-monitor-extension)
  - Sample query: [List all Azure Arc-enabled Kubernetes resources](../samples/samples-by-category.md#list-all-azure-arc-enabled-kubernetes-resources)
  - Sample query: [List all ConnectedClusters and ManagedClusters that contain a Flux Configuration](../samples/samples-by-category.md#list-all-connectedclusters-and-managedclusters-that-contain-a-flux-configuration)
- microsoft.Kusto/clusters (Azure Data Explorer Clusters)
- microsoft.Kusto/clusters/databases (Azure Data Explorer databases)
- microsoft.LabServices/labAccounts (Lab accounts)
- microsoft.LabServices/labPlans (Lab plans)
- microsoft.LabServices/labs (Labs)
- microsoft.LoadTestService/LoadTests (Azure Load Testing)
- microsoft.Logic/integrationAccounts (Integration accounts)
- microsoft.Logic/integrationServiceEnvironments (Integration Service Environments)
- microsoft.Logic/integrationServiceEnvironments/managedApis (Managed Connector)
- microsoft.Logic/workflows (Logic apps)
- microsoft.Logz/monitors (Logz main account)
- microsoft.Logz/monitors/accounts (Logz sub account)
- microsoft.Logz/monitors/metricsSource (Logz metrics data source)
- microsoft.MachineLearning/commitmentPlans (Machine Learning Studio (classic) web service plans)
- microsoft.MachineLearning/webServices (Machine Learning Studio (classic) web services)
- microsoft.MachineLearning/workspaces (Machine Learning Studio (classic) workspaces)
- microsoft.machinelearningcompute/operationalizationclusters
- microsoft.machinelearningexperimentation/accounts/workspaces
- microsoft.machinelearningservices/aisysteminventories
- microsoft.machinelearningservices/modelinventories
- microsoft.machinelearningservices/modelinventory
- microsoft.machinelearningservices/virtualclusters
- microsoft.MachineLearningServices/workspaces (Machine learning)
- microsoft.machinelearningservices/workspaces/batchendpoints
- microsoft.machinelearningservices/workspaces/batchendpoints/deployments
- microsoft.machinelearningservices/workspaces/inferenceendpoints
- microsoft.machinelearningservices/workspaces/inferenceendpoints/deployments
- microsoft.MachineLearningServices/workspaces/onlineEndpoints (Machine learning online endpoints)
- microsoft.MachineLearningServices/workspaces/onlineEndpoints/deployments (Machine learning online deployments)
- microsoft.Maintenance/maintenanceConfigurations (Maintenance Configurations)
- microsoft.maintenance/maintenancepolicies
- microsoft.managedidentity/groups
- microsoft.ManagedIdentity/userAssignedIdentities (Managed Identities)
  - Sample query: [List impacted resources when transferring an Azure subscription](../samples/samples-by-category.md#list-impacted-resources-when-transferring-an-azure-subscription)
- microsoft.managednetwork/managednetworkgroups
- microsoft.managednetwork/managednetworkpeeringpolicies
- microsoft.managednetwork/managednetworks
- microsoft.managednetwork/managednetworks/managednetworkgroups
- microsoft.managednetwork/managednetworks/managednetworkpeeringpolicies
- microsoft.Maps/accounts (Azure Maps Accounts)
- microsoft.Maps/accounts/creators (Azure Maps Creator Resources)
- microsoft.maps/accounts/privateatlases
- microsoft.marketplaceapps/classicdevservices
- microsoft.media/mediaservices (Media Services)
- microsoft.media/mediaservices/liveevents (Live events)
- microsoft.media/mediaservices/streamingendpoints (Streaming Endpoints)
- microsoft.media/mediaservices/transforms
- microsoft.media/videoanalyzers (Video Analyzers)
- microsoft.microservices4spring/appclusters
- microsoft.migrate/assessmentprojects
- microsoft.migrate/migrateprojects
- microsoft.migrate/movecollections
- microsoft.Migrate/projects (Migration projects)
- microsoft.MixedReality/objectAnchorsAccounts (Object Anchors Accounts)
- microsoft.MixedReality/objectUnderstandingAccounts (Object Understanding Accounts)
- microsoft.MixedReality/remoteRenderingAccounts (Remote Rendering Accounts)
- microsoft.MixedReality/spatialAnchorsAccounts (Spatial Anchors Accounts)
- microsoft.mixedreality/surfacereconstructionaccounts
- microsoft.MobileNetwork/mobileNetworks (Mobile networks)
- microsoft.MobileNetwork/mobileNetworks/dataNetworks (Data Networks)
- microsoft.MobileNetwork/mobileNetworks/services (Services)
- microsoft.MobileNetwork/mobileNetworks/simPolicies (SIM policies)
- microsoft.MobileNetwork/mobileNetworks/sites (Mobile network sites)
- microsoft.MobileNetwork/mobileNetworks/slices (Slices)
- microsoft.mobilenetwork/networks
- microsoft.mobilenetwork/networks/sites
- microsoft.MobileNetwork/packetCoreControlPlanes (Packet Core Control Planes)
- microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes (Packet Core Data Planes)
- microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes/attachedDataNetworks (Attached Data Networks)
- microsoft.MobileNetwork/sims (Sims)
- microsoft.mobilenetwork/sims/simprofiles
- microsoft.monitor/accounts
- microsoft.NetApp/netAppAccounts (NetApp accounts)
- microsoft.netapp/netappaccounts/backuppolicies
- microsoft.NetApp/netAppAccounts/capacityPools (Capacity pools)
- microsoft.NetApp/netAppAccounts/capacityPools/Volumes (Volumes)
- microsoft.netapp/netappaccounts/capacitypools/volumes/mounttargets
- microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots (Snapshots)
- microsoft.netapp/netappaccounts/capacitypools/volumes/subvolumes
- microsoft.NetApp/netAppAccounts/snapshotPolicies (Snapshot policies)
- microsoft.Network/applicationGateways (Application gateways)
- microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies (Application Gateway WAF policies)
- microsoft.Network/applicationSecurityGroups (Application security groups)
- microsoft.Network/azureFirewalls (Firewalls)
- microsoft.Network/bastionHosts (Bastions)
- microsoft.Network/connections (Connections)
- microsoft.Network/customIpPrefixes (Custom IP prefixes)
- microsoft.network/ddoscustompolicies
- microsoft.Network/ddosProtectionPlans (DDoS protection plans)
- microsoft.Network/dnsForwardingRulesets (DNS forwarding rulesets)
- microsoft.Network/dnsResolvers (DNS Private Resolvers)
- microsoft.network/dnsresolvers/inboundendpoints
- microsoft.network/dnsresolvers/outboundendpoints
- microsoft.Network/dnsZones (DNS zones)
- microsoft.network/dscpconfigurations
- microsoft.Network/expressRouteCircuits (ExpressRoute circuits)
- microsoft.network/expressroutecrossconnections
- microsoft.network/expressroutegateways
- microsoft.Network/expressRoutePorts (ExpressRoute Direct)
- microsoft.Network/firewallPolicies (Firewall policies)
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
- microsoft.NotificationHubs/namespaces (Notification Hub namespaces)
- microsoft.NotificationHubs/namespaces/notificationHubs (Notification Hubs)
- microsoft.nutanix/interfaces
- microsoft.nutanix/nodes
- microsoft.objectstore/osnamespaces
- microsoft.offazure/hypervsites
- microsoft.offazure/importsites
- microsoft.offazure/mastersites
- microsoft.offazure/serversites
- microsoft.offazure/vmwaresites
- microsoft.OpenEnergyPlatform/energyServices (Project Oak Forest)
- microsoft.openlogisticsplatform/applicationmanagers
- microsoft.openlogisticsplatform/applicationworkspaces
- microsoft.OpenLogisticsPlatform/workspaces (Open Supply Chain Platform)
- microsoft.operationalinsights/clusters
- microsoft.OperationalInsights/querypacks (Log Analytics query packs)
- microsoft.OperationalInsights/workspaces (Log Analytics workspaces)
- microsoft.OperationsManagement/solutions (Solutions)
- microsoft.operationsmanagement/views
- microsoft.Orbital/contactProfiles (Contact profiles)
- microsoft.Orbital/EdgeSites (Edge Sites)
- microsoft.Orbital/GroundStations (Ground stations)
- microsoft.Orbital/l2Connections (L2 connections)
- microsoft.orbital/orbitalendpoints
- microsoft.orbital/orbitalgateways
- microsoft.orbital/orbitalgateways/orbitall2connections
- microsoft.orbital/orbitalgateways/orbitall3connections
- microsoft.Orbital/spacecrafts (Spacecrafts)
- microsoft.Peering/peerings (Peerings)
- microsoft.Peering/peeringServices (Peering services)
- microsoft.PlayFab/playerAccountPools (PlayFab player account pools)
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
- microsoft.Purview/Accounts (microsoft Purview accounts)
- microsoft.Quantum/Workspaces (Quantum Workspaces)
- microsoft.RecommendationsService/accounts (Intelligent Recommendations Accounts)
- microsoft.RecommendationsService/accounts/modeling (Modeling)
- microsoft.RecommendationsService/accounts/serviceEndpoints (Service Endpoints)
- microsoft.RecoveryServices/vaults (Recovery Services vaults)
- microsoft.recoveryservices/vaults/backupstorageconfig
- microsoft.recoveryservices/vaults/replicationfabrics
- microsoft.recoveryservices/vaults/replicationfabrics/replicationprotectioncontainers
- microsoft.recoveryservices/vaults/replicationfabrics/replicationprotectioncontainers/replicationprotecteditems
- microsoft.recoveryservices/vaults/replicationfabrics/replicationprotectioncontainers/replicationprotectioncontainermappings
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
- microsoft.scheduler/jobcollections
- microsoft.Scom/managedInstances (Aquila Instances)
- microsoft.scvmm/availabilitysets
- microsoft.scvmm/clouds
- microsoft.scvmm/virtualMachines (SCVMM virtual machine - Azure Arc)
- microsoft.scvmm/virtualmachinetemplates
- microsoft.scvmm/virtualnetworks
- microsoft.ScVmm/vmmServers (SCVMM management servers)
- microsoft.Search/searchServices (Search services)
- microsoft.security/apicollections
- microsoft.security/apicollections/apiendpoints
- microsoft.security/assignments
- microsoft.security/automations
- microsoft.security/customassessmentautomations
- microsoft.security/customentitystoreassignments
- microsoft.security/datascanners
- microsoft.security/iotsecuritysolutions
- microsoft.security/securityconnectors
- microsoft.security/standards
- microsoft.SecurityDetonation/chambers (Security Detonation Chambers)
- microsoft.securitydevops/githubconnectors
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
- microsoft.TestBase/testbaseAccounts (Test Base Accounts)
- microsoft.TestBase/testBaseAccounts/packages (Test Base Packages)
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
- microsoft.Workloads/monitors (Azure Monitors for SAP Solutions (v2))
- microsoft.Workloads/phpworkloads (Scalable WordPress on Linux)
- microsoft.Workloads/sapVirtualInstances (SAP Virtual Instances)
- microsoft.Workloads/sapVirtualInstances/applicationInstances (SAP app server instances)
- microsoft.Workloads/sapVirtualInstances/centralInstances (SAP central server instances)
- microsoft.Workloads/sapVirtualInstances/databaseInstances (SAP database server instances)
- myget.packagemanagement/services
- NGINX.NGINXPLUS/nginxDeployments (NGINX Deployment)
- paraleap.cloudmonix/services
- pokitdok.platform/services
- private.arsenv1/resourcetype1
- private.autonomousdevelopmentplatform/accounts
- private.connectedvehicle/platformaccounts
- private.contoso/employees
- private.flows/flows
- Providers.Test/statefulIbizaEngines (VLCentral Help)
- ravenhq.db/databases
- raygun.crashreporting/apps
- sendgrid.email/accounts
- sparkpost.basic/services
- stackify.retrace/services
- test.shoebox/testresources
- test.shoebox/testresources2
- trendmicro.deepsecurity/accounts
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
  - Sample query: [List Container Registry vulnerability assessment results](../samples/samples-by-category.md#list-container-registry-vulnerability-assessment-results)
  - Sample query: [List microsoft Defender recommendations](../samples/samples-by-category.md)
  - Sample query: [List Qualys vulnerability assessment results](../samples/samples-by-category.md#list-qualys-vulnerability-assessment-results)
- microsoft.security/assessments/governanceassignments
- microsoft.security/assessments/subassessments
  - Sample query: [List Container Registry vulnerability assessment results](../samples/samples-by-category.md#list-container-registry-vulnerability-assessment-results)
  - Sample query: [List Qualys vulnerability assessment results](../samples/samples-by-category.md#list-qualys-vulnerability-assessment-results)
- microsoft.security/governancerules
- microsoft.security/insights/classification (Data Sensitivity Security Insights (Preview))
  - Sample query: [Get sensitivity insight of a specific resource](../samples/samples-by-category.md#get-sensitivity-insight-of-a-specific-resource)
- microsoft.security/iotalerts
  - Sample query: [Get all IoT alerts on hub, filtered by type](../samples/samples-by-category.md#get-all-iot-alerts-on-hub-filtered-by-type)
  - Sample query: [Get specific IoT alert](../samples/samples-by-category.md#get-specific-iot-alert)
- microsoft.security/locations/alerts (Security Alerts)
- microsoft.security/pricings
  - Sample query: [Show Defender for Cloud plan pricing tier per subscription](../samples/samples-by-category.md)
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

## spotresources

- microsoft.compute/skuspotevictionrate/location
- microsoft.compute/skuspotpricehistory/ostype/location

## workloadmonitorresources

- microsoft.workloadmonitor/monitors

## Next steps

- Learn more about the [query language](../concepts/query-language.md).
- Learn more about how to [explore resources](../concepts/explore-resources.md).
- See samples of [Starter queries](../samples/starter.md).
