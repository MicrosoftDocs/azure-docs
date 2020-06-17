---
title: Azure resource providers operations
description: Lists the operations for Azure resource providers.
services: active-directory
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
ms.author: rolyon
ms.date: 05/04/2020
---

# Azure resource providers operations

This section lists the operations for Azure resource providers, which are used in built-in roles. You can use these operations in your own [Azure custom roles](custom-roles.md) to provide granular access control to resources in Azure. The resource provider operations are always evolving. To get the latest operations, use [Get-AzProviderOperation](/powershell/module/az.resources/get-azprovideroperation) or [az provider operation list](/cli/azure/provider/operation#az-provider-operation-list).

Click the resource provider name in the following table to see the list of operations.

## All

|  |
| --- |
| **General** |
| [Microsoft.Addons](#microsoftaddons) |
| [Microsoft.Marketplace](#microsoftmarketplace) |
| [Microsoft.MarketplaceApps](#microsoftmarketplaceapps) |
| [Microsoft.MarketplaceOrdering](#microsoftmarketplaceordering) |
| [Microsoft.ResourceHealth](#microsoftresourcehealth) |
| [Microsoft.Support](#microsoftsupport) |
| **Compute** |
| [Microsoft.ClassicCompute](#microsoftclassiccompute) |
| [Microsoft.Compute](#microsoftcompute) |
| [Microsoft.ServiceFabric](#microsoftservicefabric) |
| **Networking** |
| [Microsoft.Cdn](#microsoftcdn) |
| [Microsoft.ClassicNetwork](#microsoftclassicnetwork) |
| [Microsoft.Network](#microsoftnetwork) |
| **Storage** |
| [Microsoft.ClassicStorage](#microsoftclassicstorage) |
| [Microsoft.DataBox](#microsoftdatabox) |
| [Microsoft.ImportExport](#microsoftimportexport) |
| [Microsoft.NetApp](#microsoftnetapp) |
| [Microsoft.Storage](#microsoftstorage) |
| [microsoft.storagesync](#microsoftstoragesync) |
| [Microsoft.StorSimple](#microsoftstorsimple) |
| **Web** |
| [Microsoft.CertificateRegistration](#microsoftcertificateregistration) |
| [Microsoft.DomainRegistration](#microsoftdomainregistration) |
| [Microsoft.Maps](#microsoftmaps) |
| [Microsoft.Media](#microsoftmedia) |
| [Microsoft.Search](#microsoftsearch) |
| [Microsoft.SignalRService](#microsoftsignalrservice) |
| [microsoft.web](#microsoftweb) |
| **Containers** |
| [Microsoft.ContainerInstance](#microsoftcontainerinstance) |
| [Microsoft.ContainerRegistry](#microsoftcontainerregistry) |
| [Microsoft.ContainerService](#microsoftcontainerservice) |
| [Microsoft.DevSpaces](#microsoftdevspaces) |
| **Databases** |
| [Microsoft.Cache](#microsoftcache) |
| [Microsoft.DataFactory](#microsoftdatafactory) |
| [Microsoft.DataMigration](#microsoftdatamigration) |
| [Microsoft.DBforMariaDB](#microsoftdbformariadb) |
| [Microsoft.DBforMySQL](#microsoftdbformysql) |
| [Microsoft.DBforPostgreSQL](#microsoftdbforpostgresql) |
| [Microsoft.DocumentDB](#microsoftdocumentdb) |
| [Microsoft.Sql](#microsoftsql) |
| [Microsoft.SqlVirtualMachine](#microsoftsqlvirtualmachine) |
| **Analytics** |
| [Microsoft.AnalysisServices](#microsoftanalysisservices) |
| [Microsoft.Databricks](#microsoftdatabricks) |
| [Microsoft.DataLakeAnalytics](#microsoftdatalakeanalytics) |
| [Microsoft.DataLakeStore](#microsoftdatalakestore) |
| [Microsoft.EventHub](#microsofteventhub) |
| [Microsoft.HDInsight](#microsofthdinsight) |
| [Microsoft.Kusto](#microsoftkusto) |
| [Microsoft.PowerBIDedicated](#microsoftpowerbidedicated) |
| [Microsoft.StreamAnalytics](#microsoftstreamanalytics) |
| **Blockchain** |
| [Microsoft.Blockchain](#microsoftblockchain) |
| **AI + machine learning** |
| [Microsoft.BotService](#microsoftbotservice) |
| [Microsoft.CognitiveServices](#microsoftcognitiveservices) |
| [Microsoft.MachineLearning](#microsoftmachinelearning) |
| [Microsoft.MachineLearningServices](#microsoftmachinelearningservices) |
| **Internet of things** |
| [Microsoft.Devices](#microsoftdevices) |
| [Microsoft.IoTCentral](#microsoftiotcentral) |
| [Microsoft.NotificationHubs](#microsoftnotificationhubs) |
| [Microsoft.TimeSeriesInsights](#microsofttimeseriesinsights) |
| **Mixed reality** |
| [Microsoft.IoTSpaces](#microsoftiotspaces) |
| [Microsoft.MixedReality](#microsoftmixedreality) |
| **Integration** |
| [Microsoft.ApiManagement](#microsoftapimanagement) |
| [Microsoft.AppConfiguration](#microsoftappconfiguration) |
| [Microsoft.AzureStack](#microsoftazurestack) |
| [Microsoft.DataBoxEdge](#microsoftdataboxedge) |
| [Microsoft.DataCatalog](#microsoftdatacatalog) |
| [Microsoft.EventGrid](#microsofteventgrid) |
| [Microsoft.Logic](#microsoftlogic) |
| [Microsoft.Relay](#microsoftrelay) |
| [Microsoft.ServiceBus](#microsoftservicebus) |
| **Identity** |
| [Microsoft.AAD](#microsoftaad) |
| [microsoft.aadiam](#microsoftaadiam) |
| [Microsoft.ADHybridHealthService](#microsoftadhybridhealthservice) |
| [Microsoft.AzureActiveDirectory](#microsoftazureactivedirectory) |
| [Microsoft.ManagedIdentity](#microsoftmanagedidentity) |
| **Security** |
| [Microsoft.KeyVault](#microsoftkeyvault) |
| [Microsoft.Security](#microsoftsecurity) |
| [Microsoft.SecurityGraph](#microsoftsecuritygraph) |
| [Microsoft.SecurityInsights](#microsoftsecurityinsights) |
| **DevOps** |
| [Microsoft.DevTestLab](#microsoftdevtestlab) |
| [Microsoft.LabServices](#microsoftlabservices) |
| [Microsoft.VisualStudio](#microsoftvisualstudio) |
| **Migrate** |
| [Microsoft.Migrate](#microsoftmigrate) |
| [Microsoft.OffAzure](#microsoftoffazure) |
| **Monitor** |
| [Microsoft.AlertsManagement](#microsoftalertsmanagement) |
| [Microsoft.Insights](#microsoftinsights) |
| [Microsoft.OperationalInsights](#microsoftoperationalinsights) |
| [Microsoft.OperationsManagement](#microsoftoperationsmanagement) |
| [Microsoft.WorkloadMonitor](#microsoftworkloadmonitor) |
| **Management + governance** |
| [Microsoft.Advisor](#microsoftadvisor) |
| [Microsoft.Authorization](#microsoftauthorization) |
| [Microsoft.Automation](#microsoftautomation) |
| [Microsoft.Batch](#microsoftbatch) |
| [Microsoft.Billing](#microsoftbilling) |
| [Microsoft.Blueprint](#microsoftblueprint) |
| [Microsoft.Capacity](#microsoftcapacity) |
| [Microsoft.Commerce](#microsoftcommerce) |
| [Microsoft.Consumption](#microsoftconsumption) |
| [Microsoft.CostManagement](#microsoftcostmanagement) |
| [Microsoft.Features](#microsoftfeatures) |
| [Microsoft.GuestConfiguration](#microsoftguestconfiguration) |
| [Microsoft.HybridCompute](#microsofthybridcompute) |
| [Microsoft.ManagedServices](#microsoftmanagedservices) |
| [Microsoft.Management](#microsoftmanagement) |
| [Microsoft.PolicyInsights](#microsoftpolicyinsights) |
| [Microsoft.Portal](#microsoftportal) |
| [Microsoft.RecoveryServices](#microsoftrecoveryservices) |
| [Microsoft.Resources](#microsoftresources) |
| [Microsoft.Scheduler](#microsoftscheduler) |
| [Microsoft.Solutions](#microsoftsolutions) |
| [Microsoft.Subscription](#microsoftsubscription) |
| **Intune** |
| [Microsoft.Intune](#microsoftintune) |
| **Other** |
| [Microsoft.BingMaps](#microsoftbingmaps) |


## General

### Microsoft.Addons

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Addons/register/action | Register the specified subscription with Microsoft.Addons |
> | Microsoft.Addons/operations/read | Gets supported RP operations. |
> | Microsoft.Addons/supportProviders/listsupportplaninfo/action | Lists current support plan information for the specified subscription. |
> | Microsoft.Addons/supportProviders/supportPlanTypes/read | Get the specified Canonical support plan state. |
> | Microsoft.Addons/supportProviders/supportPlanTypes/write | Adds the Canonical support plan type specified. |
> | Microsoft.Addons/supportProviders/supportPlanTypes/delete | Removes the specified Canonical support plan |

### Microsoft.Marketplace

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Marketplace/register/action | Registers Microsoft.Marketplace resource provider in the subscription. |
> | Microsoft.Marketplace/privateStores/action | Updates PrivateStore. |
> | Microsoft.Marketplace/offerTypes/publishers/offers/plans/agreements/read | Returns an Agreement. |
> | Microsoft.Marketplace/offerTypes/publishers/offers/plans/agreements/write | Accepts a signed agreement. |
> | Microsoft.Marketplace/offerTypes/publishers/offers/plans/configs/read | Returns a config. |
> | Microsoft.Marketplace/offerTypes/publishers/offers/plans/configs/write | Saves a config. |
> | Microsoft.Marketplace/offerTypes/publishers/offers/plans/configs/importImage/action | Imports an image to the end user's ACR. |
> | Microsoft.Marketplace/privateStores/write | Creates PrivateStore. |
> | Microsoft.Marketplace/privateStores/delete | Deletes PrivateStore. |
> | Microsoft.Marketplace/privateStores/offers/action | Updates offer in  PrivateStore. |
> | Microsoft.Marketplace/privateStores/read | Reads PrivateStores. |
> | Microsoft.Marketplace/privateStores/offers/write | Creates offer in  PrivateStore. |
> | Microsoft.Marketplace/privateStores/offers/delete | Deletes offer from  PrivateStore. |

### Microsoft.MarketplaceApps

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.MarketplaceApps/ClassicDevServices/read | Does a GET operation on a classic dev service. |
> | Microsoft.MarketplaceApps/ClassicDevServices/delete | Does a DELETE operation on a classic dev service resource. |
> | Microsoft.MarketplaceApps/ClassicDevServices/listSingleSignOnToken/action | Gets the Single Sign On URL for a classic dev service. |
> | Microsoft.MarketplaceApps/ClassicDevServices/listSecrets/action | Gets a classic dev service resource management keys. |
> | Microsoft.MarketplaceApps/ClassicDevServices/regenerateKey/action | Generates a classic dev service resource management keys. |
> | Microsoft.MarketplaceApps/Operations/read | Read the operations for all resource types. |

### Microsoft.MarketplaceOrdering

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.MarketplaceOrdering/agreements/read | Return all agreements under given subscription |
> | Microsoft.MarketplaceOrdering/agreements/offers/plans/read | Return an agreement for a given marketplace item |
> | Microsoft.MarketplaceOrdering/agreements/offers/plans/sign/action | Sign an agreement for a given marketplace item |
> | Microsoft.MarketplaceOrdering/agreements/offers/plans/cancel/action | Cancel an agreement for a given marketplace item |
> | Microsoft.MarketplaceOrdering/offertypes/publishers/offers/plans/agreements/read | Get an agreement for a given marketplace virtual machine item |
> | Microsoft.MarketplaceOrdering/offertypes/publishers/offers/plans/agreements/write | Sign or Cancel an agreement for a given marketplace virtual machine item |
> | Microsoft.MarketplaceOrdering/operations/read | List all possible operations in the API |

### Microsoft.ResourceHealth

Azure service: [Azure Service Health](../service-health/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ResourceHealth/register/action | Registers the subscription for the Microsoft ResourceHealth |
> | Microsoft.ResourceHealth/unregister/action | Unregisters the subscription for the Microsoft ResourceHealth |
> | Microsoft.Resourcehealth/healthevent/action | Denotes the change in health state for the specified resource |
> | Microsoft.ResourceHealth/AvailabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.ResourceHealth/AvailabilityStatuses/current/read | Gets the availability status for the specified resource |
> | Microsoft.ResourceHealth/emergingissues/read | Get Azure services' emerging issues |
> | Microsoft.ResourceHealth/events/read | Get Service Health Events for given subscription |
> | Microsoft.Resourcehealth/healthevent/Activated/action | Denotes the change in health state for the specified resource |
> | Microsoft.Resourcehealth/healthevent/Updated/action | Denotes the change in health state for the specified resource |
> | Microsoft.Resourcehealth/healthevent/Resolved/action | Denotes the change in health state for the specified resource |
> | Microsoft.Resourcehealth/healthevent/InProgress/action | Denotes the change in health state for the specified resource |
> | Microsoft.Resourcehealth/healthevent/Pending/action | Denotes the change in health state for the specified resource |
> | Microsoft.ResourceHealth/impactedResources/read | Get Impacted Resources for given subscription |
> | Microsoft.ResourceHealth/metadata/read | Gets Metadata |
> | Microsoft.ResourceHealth/Notifications/read | Receives Azure Resource Manager notifications |
> | Microsoft.ResourceHealth/Operations/read | Get the operations available for the Microsoft ResourceHealth |

### Microsoft.Support

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Support/register/action | Registers Support Resource Provider |
> | Microsoft.Support/checkNameAvailability/action | Checks that name is valid and not in use for resource type |
> | Microsoft.Support/operationresults/read | Gets the result of the asynchronous operation |
> | Microsoft.Support/operations/read | Lists all operations available on Microsoft.Support resource provider |
> | Microsoft.Support/operationsstatus/read | Gets the status of the asynchronous operation |
> | Microsoft.Support/services/read | Lists one or all Azure services available for support |
> | Microsoft.Support/services/problemClassifications/read | Lists one or all problem classifications for an Azure service |
> | Microsoft.Support/supportTickets/read | Lists one or all support tickets |
> | Microsoft.Support/supportTickets/write | Allows creating and updating a support ticket |
> | Microsoft.Support/supportTickets/communications/read | Lists one or all support ticket communications |
> | Microsoft.Support/supportTickets/communications/write | Adds a new communication to a support ticket |

## Compute

### Microsoft.ClassicCompute

Azure service: Classic deployment model virtual machine

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ClassicCompute/register/action | Register to Classic Compute |
> | Microsoft.ClassicCompute/checkDomainNameAvailability/action | Checks the availability of a given domain name. |
> | Microsoft.ClassicCompute/moveSubscriptionResources/action | Move all classic resources to a different subscription. |
> | Microsoft.ClassicCompute/validateSubscriptionMoveAvailability/action | Validate the subscription's availability for classic move operation. |
> | Microsoft.ClassicCompute/capabilities/read | Shows the capabilities |
> | Microsoft.ClassicCompute/checkDomainNameAvailability/read | Gets the availability of a given domain name. |
> | Microsoft.ClassicCompute/domainNames/read | Return the domain names for resources. |
> | Microsoft.ClassicCompute/domainNames/write | Add or modify the domain names for resources. |
> | Microsoft.ClassicCompute/domainNames/delete | Remove the domain names for resources. |
> | Microsoft.ClassicCompute/domainNames/swap/action | Swaps the staging slot to the production slot. |
> | Microsoft.ClassicCompute/domainNames/active/write | Sets the active domain name. |
> | Microsoft.ClassicCompute/domainNames/availabilitySets/read | Show the availability set for the resource. |
> | Microsoft.ClassicCompute/domainNames/capabilities/read | Shows the domain name capabilities |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/read | Shows the deployment slots. |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/write | Creates or update the deployment. |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/roles/read | Get role on deployment slot of domain name |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/roles/roleinstances/read | Get role instance for role on deployment slot of domain name |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/state/read | Get the deployment slot state. |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/state/write | Add the deployment slot state. |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/upgradedomain/read | Get upgrade domain for deployment slot on domain name |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/upgradedomain/write | Update upgrade domain for deployment slot on domain name |
> | Microsoft.ClassicCompute/domainNames/extensions/read | Returns the domain name extensions. |
> | Microsoft.ClassicCompute/domainNames/extensions/write | Add the domain name extensions. |
> | Microsoft.ClassicCompute/domainNames/extensions/delete | Remove the domain name extensions. |
> | Microsoft.ClassicCompute/domainNames/extensions/operationStatuses/read | Reads the operation status for the domain names extensions. |
> | Microsoft.ClassicCompute/domainNames/internalLoadBalancers/read | Gets the internal load balancers. |
> | Microsoft.ClassicCompute/domainNames/internalLoadBalancers/write | Creates a new internal load balance. |
> | Microsoft.ClassicCompute/domainNames/internalLoadBalancers/delete | Remove a new internal load balance. |
> | Microsoft.ClassicCompute/domainNames/internalLoadBalancers/operationStatuses/read | Reads the operation status for the domain names internal load balancers. |
> | Microsoft.ClassicCompute/domainNames/loadBalancedEndpointSets/read | Get the load balanced endpoint sets. |
> | Microsoft.ClassicCompute/domainNames/loadBalancedEndpointSets/write | Add the load balanced endpoint set. |
> | Microsoft.ClassicCompute/domainNames/loadBalancedEndpointSets/operationStatuses/read | Reads the operation status for the domain names load balanced endpoint sets. |
> | Microsoft.ClassicCompute/domainNames/operationstatuses/read | Get operation status of the domain name. |
> | Microsoft.ClassicCompute/domainNames/operationStatuses/read | Reads the operation status for the domain names extensions. |
> | Microsoft.ClassicCompute/domainNames/serviceCertificates/read | Returns the service certificates used. |
> | Microsoft.ClassicCompute/domainNames/serviceCertificates/write | Add or modify the service certificates used. |
> | Microsoft.ClassicCompute/domainNames/serviceCertificates/delete | Delete the service certificates used. |
> | Microsoft.ClassicCompute/domainNames/serviceCertificates/operationStatuses/read | Reads the operation status for the domain names service certificates. |
> | Microsoft.ClassicCompute/domainNames/slots/read | Shows the deployment slots. |
> | Microsoft.ClassicCompute/domainNames/slots/write | Creates or update the deployment. |
> | Microsoft.ClassicCompute/domainNames/slots/delete | Deletes a given deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/start/action | Starts a deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/stop/action | Suspends the deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/validateMigration/action | Validates migration of a deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/prepareMigration/action | Prepares migration of a deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/commitMigration/action | Commits migration of a deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/abortMigration/action | Aborts migration of a deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/operationStatuses/read | Reads the operation status for the domain names slots. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/read | Get the role for the deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/write | Add role for the deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/read | Returns the extension reference for the deployment slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/write | Add or modify the extension reference for the deployment slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/delete | Remove the extension reference for the deployment slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/operationStatuses/read | Reads the operation status for the domain names slots roles extension references. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/metricdefinitions/read | Get the role metric definition for the domain name. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/metrics/read | Get role metric for the domain name. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/operationstatuses/read | Get the operation status for the domain names slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/downloadremotedesktopconnectionfile/action | Downloads remote desktop connection file for the role instance on the domain name slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/read | Get the role instance. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/restart/action | Restarts role instances. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/reimage/action | Reimages the role instance. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/rebuild/action | Rebuilds the role instance. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/operationStatuses/read | Gets the operation status for the role instance on domain names slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/skus/read | Get role sku for the deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/state/start/write | Changes the deployment slot state to stopped. |
> | Microsoft.ClassicCompute/domainNames/slots/state/stop/write | Changes the deployment slot state to started. |
> | Microsoft.ClassicCompute/domainNames/slots/upgradeDomain/write | Walk upgrade the domain. |
> | Microsoft.ClassicCompute/operatingSystemFamilies/read | Lists the guest operating system families available in Microsoft Azure, and also lists the operating system versions available for each family. |
> | Microsoft.ClassicCompute/operatingSystems/read | Lists the versions of the guest operating system that are currently available in Microsoft Azure. |
> | Microsoft.ClassicCompute/operations/read | Gets the list of operations. |
> | Microsoft.ClassicCompute/operationStatuses/read | Reads the operation status for the resource. |
> | Microsoft.ClassicCompute/quotas/read | Get the quota for the subscription. |
> | Microsoft.ClassicCompute/resourceTypes/skus/read | Gets the Sku list for supported resource types. |
> | Microsoft.ClassicCompute/virtualMachines/read | Retrieves list of virtual machines. |
> | Microsoft.ClassicCompute/virtualMachines/write | Add or modify virtual machines. |
> | Microsoft.ClassicCompute/virtualMachines/delete | Removes virtual machines. |
> | Microsoft.ClassicCompute/virtualMachines/capture/action | Capture a virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/start/action | Start the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/redeploy/action | Redeploys the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/performMaintenance/action | Performs maintenance on the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/restart/action | Restarts virtual machines. |
> | Microsoft.ClassicCompute/virtualMachines/stop/action | Stops the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/shutdown/action | Shutdown the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/attachDisk/action | Attaches a data disk to a virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/detachDisk/action | Detaches a data disk from virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/downloadRemoteDesktopConnectionFile/action | Downloads the RDP file for virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/read | Gets the network security group associated with the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/write | Adds a network security group associated with the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/delete | Deletes the network security group associated with the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/operationStatuses/read | Reads the operation status for the virtual machines associated network security groups. |
> | Microsoft.ClassicCompute/virtualMachines/asyncOperations/read | Gets the possible async operations |
> | Microsoft.ClassicCompute/virtualMachines/diagnosticsettings/read | Get virtual machine diagnostics settings. |
> | Microsoft.ClassicCompute/virtualMachines/disks/read | Retrieves list of data disks |
> | Microsoft.ClassicCompute/virtualMachines/extensions/read | Gets the virtual machine extension. |
> | Microsoft.ClassicCompute/virtualMachines/extensions/write | Puts the virtual machine extension. |
> | Microsoft.ClassicCompute/virtualMachines/extensions/operationStatuses/read | Reads the operation status for the virtual machines extensions. |
> | Microsoft.ClassicCompute/virtualMachines/metricdefinitions/read | Get the virtual machine metric definition. |
> | Microsoft.ClassicCompute/virtualMachines/metrics/read | Gets the metrics. |
> | Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/read | Gets the network security group associated with the network interface. |
> | Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/write | Adds a network security group associated with the network interface. |
> | Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/delete | Deletes the network security group associated with the network interface. |
> | Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/operationStatuses/read | Reads the operation status for the virtual machines associated network security groups. |
> | Microsoft.ClassicCompute/virtualMachines/operationStatuses/read | Reads the operation status for the virtual machines. |
> | Microsoft.ClassicCompute/virtualMachines/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicCompute/virtualMachines/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicCompute/virtualMachines/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |

### Microsoft.Compute

Azure service: [Virtual Machines](../virtual-machines/index.yml), [Virtual Machine Scale Sets](../virtual-machine-scale-sets/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Compute/register/action | Registers Subscription with Microsoft.Compute resource provider |
> | Microsoft.Compute/unregister/action | Unregisters Subscription with Microsoft.Compute resource provider |
> | Microsoft.Compute/availabilitySets/read | Get the properties of an availability set |
> | Microsoft.Compute/availabilitySets/write | Creates a new availability set or updates an existing one |
> | Microsoft.Compute/availabilitySets/delete | Deletes the availability set |
> | Microsoft.Compute/availabilitySets/vmSizes/read | List available sizes for creating or updating a virtual machine in the availability set |
> | Microsoft.Compute/diskAccesses/read | Get the properties of DiskAccess resource |
> | Microsoft.Compute/diskAccesses/write | Create a new DiskAccess resource or update an existing one |
> | Microsoft.Compute/diskAccesses/delete | Delete a DiskAccess resource |
> | Microsoft.Compute/diskAccesses/privateEndpointConnectionsApproval/action | Approve a Private Endpoint Connection |
> | Microsoft.Compute/diskAccesses/privateEndpointConnectionProxies/read | Get the properties of a private endpoint connection proxy |
> | Microsoft.Compute/diskAccesses/privateEndpointConnectionProxies/write | Create a new Private Endpoint Connection Proxy |
> | Microsoft.Compute/diskAccesses/privateEndpointConnectionProxies/delete | Delete a Private Endpoint Connection Proxy |
> | Microsoft.Compute/diskAccesses/privateEndpointConnectionProxies/validate/action | Validate a Private Endpoint Connection Proxy object |
> | Microsoft.Compute/diskAccesses/privateEndpointConnections/delete | Delete a Private Endpoint Connection |
> | Microsoft.Compute/diskEncryptionSets/read | Get the properties of a disk encryption set |
> | Microsoft.Compute/diskEncryptionSets/write | Create a new disk encryption set or update an existing one |
> | Microsoft.Compute/diskEncryptionSets/delete | Delete a disk encryption set |
> | Microsoft.Compute/disks/read | Get the properties of a Disk |
> | Microsoft.Compute/disks/write | Creates a new Disk or updates an existing one |
> | Microsoft.Compute/disks/delete | Deletes the Disk |
> | Microsoft.Compute/disks/beginGetAccess/action | Get the SAS URI of the Disk for blob access |
> | Microsoft.Compute/disks/endGetAccess/action | Revoke the SAS URI of the Disk |
> | Microsoft.Compute/galleries/read | Gets the properties of Gallery |
> | Microsoft.Compute/galleries/write | Creates a new Gallery or updates an existing one |
> | Microsoft.Compute/galleries/delete | Deletes the Gallery |
> | Microsoft.Compute/galleries/applications/read | Gets the properties of Gallery Application |
> | Microsoft.Compute/galleries/applications/write | Creates a new Gallery Application or updates an existing one |
> | Microsoft.Compute/galleries/applications/delete | Deletes the Gallery Application |
> | Microsoft.Compute/galleries/applications/versions/read | Gets the properties of Gallery Application Version |
> | Microsoft.Compute/galleries/applications/versions/write | Creates a new Gallery Application Version or updates an existing one |
> | Microsoft.Compute/galleries/applications/versions/delete | Deletes the Gallery Application Version |
> | Microsoft.Compute/galleries/images/read | Gets the properties of Gallery Image |
> | Microsoft.Compute/galleries/images/write | Creates a new Gallery Image or updates an existing one |
> | Microsoft.Compute/galleries/images/delete | Deletes the Gallery Image |
> | Microsoft.Compute/galleries/images/versions/read | Gets the properties of Gallery Image Version |
> | Microsoft.Compute/galleries/images/versions/write | Creates a new Gallery Image Version or updates an existing one |
> | Microsoft.Compute/galleries/images/versions/delete | Deletes the Gallery Image Version |
> | Microsoft.Compute/hostGroups/read | Get the properties of a host group |
> | Microsoft.Compute/hostGroups/write | Creates a new host group or updates an existing host group |
> | Microsoft.Compute/hostGroups/delete | Deletes the host group |
> | Microsoft.Compute/hostGroups/hosts/read | Get the properties of a host |
> | Microsoft.Compute/hostGroups/hosts/write | Creates a new host or updates an existing host |
> | Microsoft.Compute/hostGroups/hosts/delete | Deletes the host |
> | Microsoft.Compute/images/read | Get the properties of the Image |
> | Microsoft.Compute/images/write | Creates a new Image or updates an existing one |
> | Microsoft.Compute/images/delete | Deletes the image |
> | Microsoft.Compute/locations/capsOperations/read | Gets the status of an asynchronous Caps operation |
> | Microsoft.Compute/locations/diskOperations/read | Gets the status of an asynchronous Disk operation |
> | Microsoft.Compute/locations/logAnalytics/getRequestRateByInterval/action | Create logs to show total requests by time interval to aid throttling diagnostics. |
> | Microsoft.Compute/locations/logAnalytics/getThrottledRequests/action | Create logs to show aggregates of throttled requests grouped by ResourceName, OperationName, or the applied Throttle Policy. |
> | Microsoft.Compute/locations/operations/read | Gets the status of an asynchronous operation |
> | Microsoft.Compute/locations/privateEndpointConnectionProxyAzureAsyncOperation/read | Get the status of asynchronous Private Endpoint Connection Proxy operation |
> | Microsoft.Compute/locations/privateEndpointConnectionProxyOperationResults/read | Get the results of Private Endpoint Connection Proxy operation |
> | Microsoft.Compute/locations/publishers/read | Get the properties of a Publisher |
> | Microsoft.Compute/locations/publishers/artifacttypes/offers/read | Get the properties of a Platform Image Offer |
> | Microsoft.Compute/locations/publishers/artifacttypes/offers/skus/read | Get the properties of a Platform Image Sku |
> | Microsoft.Compute/locations/publishers/artifacttypes/offers/skus/versions/read | Get the properties of a Platform Image Version |
> | Microsoft.Compute/locations/publishers/artifacttypes/types/read | Get the properties of a VMExtension Type |
> | Microsoft.Compute/locations/publishers/artifacttypes/types/versions/read | Get the properties of a VMExtension Version |
> | Microsoft.Compute/locations/runCommands/read | Lists available run commands in location |
> | Microsoft.Compute/locations/usages/read | Gets service limits and current usage quantities for the subscription's compute resources in a location |
> | Microsoft.Compute/locations/vmSizes/read | Lists available virtual machine sizes in a location |
> | Microsoft.Compute/locations/vsmOperations/read | Gets the status of an asynchronous operation for Virtual Machine Scale Set with the Virtual Machine Runtime Service Extension |
> | Microsoft.Compute/operations/read | Lists operations available on Microsoft.Compute resource provider |
> | Microsoft.Compute/proximityPlacementGroups/read | Get the Properties of a Proximity Placement Group |
> | Microsoft.Compute/proximityPlacementGroups/write | Creates a new Proximity Placement Group or updates an existing one |
> | Microsoft.Compute/proximityPlacementGroups/delete | Deletes the Proximity Placement Group |
> | Microsoft.Compute/restorePointCollections/read | Get the properties of a restore point collection |
> | Microsoft.Compute/restorePointCollections/write | Creates a new restore point collection or updates an existing one |
> | Microsoft.Compute/restorePointCollections/delete | Deletes the restore point collection and contained restore points |
> | Microsoft.Compute/restorePointCollections/restorePoints/read | Get the properties of a restore point |
> | Microsoft.Compute/restorePointCollections/restorePoints/write | Creates a new restore point |
> | Microsoft.Compute/restorePointCollections/restorePoints/delete | Deletes the restore point |
> | Microsoft.Compute/restorePointCollections/restorePoints/retrieveSasUris/action | Get the properties of a restore point along with blob SAS URIs |
> | Microsoft.Compute/sharedVMExtensions/read | Gets the properties of Shared VM Extension |
> | Microsoft.Compute/sharedVMExtensions/write | Creates a new Shared VM Extension or updates an existing one |
> | Microsoft.Compute/sharedVMExtensions/delete | Deletes the Shared VM Extension |
> | Microsoft.Compute/sharedVMExtensions/versions/read | Gets the properties of Shared VM Extension Version |
> | Microsoft.Compute/sharedVMExtensions/versions/write | Creates a new Shared VM Extension Version or updates an existing one |
> | Microsoft.Compute/sharedVMExtensions/versions/delete | Deletes the Shared VM Extension Version |
> | Microsoft.Compute/sharedVMImages/read | Get the properties of a SharedVMImage |
> | Microsoft.Compute/sharedVMImages/write | Creates a new SharedVMImage or updates an existing one |
> | Microsoft.Compute/sharedVMImages/delete | Deletes the SharedVMImage |
> | Microsoft.Compute/sharedVMImages/versions/read | Get the properties of a SharedVMImageVersion |
> | Microsoft.Compute/sharedVMImages/versions/write | Create a new SharedVMImageVersion or update an existing one |
> | Microsoft.Compute/sharedVMImages/versions/delete | Delete a SharedVMImageVersion |
> | Microsoft.Compute/sharedVMImages/versions/replicate/action | Replicate a SharedVMImageVersion to target regions |
> | Microsoft.Compute/skus/read | Gets the list of Microsoft.Compute SKUs available for your Subscription |
> | Microsoft.Compute/snapshots/read | Get the properties of a Snapshot |
> | Microsoft.Compute/snapshots/write | Create a new Snapshot or update an existing one |
> | Microsoft.Compute/snapshots/delete | Delete a Snapshot |
> | Microsoft.Compute/snapshots/beginGetAccess/action | Get the SAS URI of the Snapshot for blob access |
> | Microsoft.Compute/snapshots/endGetAccess/action | Revoke the SAS URI of the Snapshot |
> | Microsoft.Compute/sshPublicKeys/read | Get the properties of an SSH public key |
> | Microsoft.Compute/sshPublicKeys/write | Creates a new SSH public key or updates an existing SSH public key |
> | Microsoft.Compute/sshPublicKeys/delete | Deletes the SSH public key |
> | Microsoft.Compute/virtualMachines/read | Get the properties of a virtual machine |
> | Microsoft.Compute/virtualMachines/write | Creates a new virtual machine or updates an existing virtual machine |
> | Microsoft.Compute/virtualMachines/delete | Deletes the virtual machine |
> | Microsoft.Compute/virtualMachines/start/action | Starts the virtual machine |
> | Microsoft.Compute/virtualMachines/powerOff/action | Powers off the virtual machine. Note that the virtual machine will continue to be billed. |
> | Microsoft.Compute/virtualMachines/redeploy/action | Redeploys virtual machine |
> | Microsoft.Compute/virtualMachines/restart/action | Restarts the virtual machine |
> | Microsoft.Compute/virtualMachines/deallocate/action | Powers off the virtual machine and releases the compute resources |
> | Microsoft.Compute/virtualMachines/generalize/action | Sets the virtual machine state to Generalized and prepares the virtual machine for capture |
> | Microsoft.Compute/virtualMachines/capture/action | Captures the virtual machine by copying virtual hard disks and generates a template that can be used to create similar virtual machines |
> | Microsoft.Compute/virtualMachines/runCommand/action | Executes a predefined script on the virtual machine |
> | Microsoft.Compute/virtualMachines/convertToManagedDisks/action | Converts the blob based disks of the virtual machine to managed disks |
> | Microsoft.Compute/virtualMachines/performMaintenance/action | Performs Maintenance Operation on the VM. |
> | Microsoft.Compute/virtualMachines/reimage/action | Reimages virtual machine which is using differencing disk. |
> | Microsoft.Compute/virtualMachines/installPatches/action | Installs available OS update patches on the virtual machine based on parameters provided by user. Assessment results containing list of available patches will also get refreshed as part of this. |
> | Microsoft.Compute/virtualMachines/assessPatches/action | Assesses the virtual machine and finds list of available OS update patches for it. |
> | Microsoft.Compute/virtualMachines/cancelPatchInstallation/action | Cancels the ongoing install OS update patch operation on the virtual machine. |
> | Microsoft.Compute/virtualMachines/extensions/read | Get the properties of a virtual machine extension |
> | Microsoft.Compute/virtualMachines/extensions/write | Creates a new virtual machine extension or updates an existing one |
> | Microsoft.Compute/virtualMachines/extensions/delete | Deletes the virtual machine extension |
> | Microsoft.Compute/virtualMachines/instanceView/read | Gets the detailed runtime status of the virtual machine and its resources |
> | Microsoft.Compute/virtualMachines/vmSizes/read | Lists available sizes the virtual machine can be updated to |
> | Microsoft.Compute/virtualMachineScaleSets/read | Get the properties of a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/write | Creates a new Virtual Machine Scale Set or updates an existing one |
> | Microsoft.Compute/virtualMachineScaleSets/delete | Deletes the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/delete/action | Deletes the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/start/action | Starts the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/powerOff/action | Powers off the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/restart/action | Restarts the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/deallocate/action | Powers off and releases the compute resources for the instances of the Virtual Machine Scale Set  |
> | Microsoft.Compute/virtualMachineScaleSets/manualUpgrade/action | Manually updates instances to latest model of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/reimage/action | Reimages the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/reimageAll/action | Reimages all disks (OS Disk and Data Disks) for the instances of a Virtual Machine Scale Set  |
> | Microsoft.Compute/virtualMachineScaleSets/redeploy/action | Redeploy the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/performMaintenance/action | Performs planned maintenance on the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/scale/action | Verify if an existing Virtual Machine Scale Set can Scale In/Scale Out to specified instance count |
> | Microsoft.Compute/virtualMachineScaleSets/forceRecoveryServiceFabricPlatformUpdateDomainWalk/action | Manually walk the platform update domains of a service fabric Virtual Machine Scale Set to finish a pending update that is stuck |
> | Microsoft.Compute/virtualMachineScaleSets/osRollingUpgrade/action | Starts a rolling upgrade to move all Virtual Machine Scale Set instances to the latest available Platform Image OS version. |
> | Microsoft.Compute/virtualMachineScaleSets/rollingUpgrades/action | Cancels the rolling upgrade of a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/extensions/read | Gets the properties of a Virtual Machine Scale Set Extension |
> | Microsoft.Compute/virtualMachineScaleSets/extensions/write | Creates a new Virtual Machine Scale Set Extension or updates an existing one |
> | Microsoft.Compute/virtualMachineScaleSets/extensions/delete | Deletes the Virtual Machine Scale Set Extension |
> | Microsoft.Compute/virtualMachineScaleSets/extensions/roles/read | Gets the properties of a Role in a Virtual Machine Scale Set with the Virtual Machine Runtime Service Extension |
> | Microsoft.Compute/virtualMachineScaleSets/extensions/roles/write | Updates the properties of an existing Role in a Virtual Machine Scale Set with the Virtual Machine Runtime Service Extension |
> | Microsoft.Compute/virtualMachineScaleSets/instanceView/read | Gets the instance view of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/networkInterfaces/read | Get properties of all network interfaces of a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/osUpgradeHistory/read | Gets the history of OS upgrades for a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/publicIPAddresses/read | Get properties of all public IP addresses of a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/rollingUpgrades/read | Get latest Rolling Upgrade status for a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/skus/read | Lists the valid SKUs for an existing Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/read | Retrieves the properties of a Virtual Machine in a VM Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/write | Updates the properties of a Virtual Machine in a VM Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/delete | Delete a specific Virtual Machine in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/start/action | Starts a Virtual Machine instance in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/powerOff/action | Powers Off a Virtual Machine instance in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/restart/action | Restarts a Virtual Machine instance in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/deallocate/action | Powers off and releases the compute resources for a Virtual Machine in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/reimage/action | Reimages a Virtual Machine instance in a Virtual Machine Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/reimageAll/action | Reimages all disks (OS Disk and Data Disks) for Virtual Machine instance in a Virtual Machine Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/redeploy/action | Redeploys a Virtual Machine instance in a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/performMaintenance/action | Performs planned maintenance on a Virtual Machine instance in a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/runCommand/action | Executes a predefined script on a Virtual Machine instance in a Virtual Machine Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/extensions/read | Get the properties of an extension for Virtual Machine in Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/extensions/write | Creates a new extension for Virtual Machine in Virtual Machine Scale Set or updates an existing one |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/extensions/delete | Deletes the extension for Virtual Machine in Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/instanceView/read | Retrieves the instance view of a Virtual Machine in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/read | Get properties of one or all network interfaces of a virtual machine created using Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/ipConfigurations/read | Get properties of one or all IP configurations of a network interface created using Virtual Machine Scale Set. IP configurations represent private IPs |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/ipConfigurations/publicIPAddresses/read | Get properties of public IP address created using Virtual Machine Scale Set. Virtual Machine Scale Set can create at most one public IP per ipconfiguration (private IP) |
> | Microsoft.Compute/virtualMachineScaleSets/vmSizes/read | List available sizes for creating or updating a virtual machine in the Virtual Machine Scale Set |
> | **DataAction** | **Description** |
> | Microsoft.Compute/virtualMachines/login/action | Log in to a virtual machine as a regular user |
> | Microsoft.Compute/virtualMachines/loginAsAdmin/action | Log in to a virtual machine with Windows administrator or Linux root user privileges |

### Microsoft.ServiceFabric

Azure service: [Service Fabric](../service-fabric/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ServiceFabric/register/action | Register any Action |
> | Microsoft.ServiceFabric/clusters/read | Read any Cluster |
> | Microsoft.ServiceFabric/clusters/write | Create or Update any Cluster |
> | Microsoft.ServiceFabric/clusters/delete | Delete any Cluster |
> | Microsoft.ServiceFabric/clusters/applications/read | Read any Application |
> | Microsoft.ServiceFabric/clusters/applications/write | Create or Update any Application |
> | Microsoft.ServiceFabric/clusters/applications/delete | Delete any Application |
> | Microsoft.ServiceFabric/clusters/applications/services/read | Read any Service |
> | Microsoft.ServiceFabric/clusters/applications/services/write | Create or Update any Service |
> | Microsoft.ServiceFabric/clusters/applications/services/delete | Delete any Service |
> | Microsoft.ServiceFabric/clusters/applications/services/partitions/read | Read any Partition |
> | Microsoft.ServiceFabric/clusters/applications/services/partitions/replicas/read | Read any Replica |
> | Microsoft.ServiceFabric/clusters/applications/services/statuses/read | Read any Service Status |
> | Microsoft.ServiceFabric/clusters/applicationTypes/read | Read any Application Type |
> | Microsoft.ServiceFabric/clusters/applicationTypes/write | Create or Update any Application Type |
> | Microsoft.ServiceFabric/clusters/applicationTypes/delete | Delete any Application Type |
> | Microsoft.ServiceFabric/clusters/applicationTypes/versions/read | Read any Application Type Version |
> | Microsoft.ServiceFabric/clusters/applicationTypes/versions/write | Create or Update any Application Type Version |
> | Microsoft.ServiceFabric/clusters/applicationTypes/versions/delete | Delete any Application Type Version |
> | Microsoft.ServiceFabric/clusters/nodes/read | Read any Node |
> | Microsoft.ServiceFabric/clusters/statuses/read | Read any Cluster Status |
> | Microsoft.ServiceFabric/locations/clusterVersions/read | Read any Cluster Version |
> | Microsoft.ServiceFabric/locations/environments/clusterVersions/read | Read any Cluster Version for a specific environment |
> | Microsoft.ServiceFabric/locations/operationresults/read | Read any Operation Results |
> | Microsoft.ServiceFabric/locations/operations/read | Read any Operations by location |
> | Microsoft.ServiceFabric/operations/read | Read any Available Operations |

## Networking

### Microsoft.Cdn

Azure service: [Content Delivery Network](../cdn/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Cdn/register/action | Registers the subscription for the CDN resource provider and enables the creation of CDN profiles. |
> | Microsoft.Cdn/CheckNameAvailability/action |  |
> | Microsoft.Cdn/ValidateProbe/action |  |
> | Microsoft.Cdn/CheckResourceUsage/action |  |
> | Microsoft.Cdn/edgenodes/read |  |
> | Microsoft.Cdn/edgenodes/write |  |
> | Microsoft.Cdn/edgenodes/delete |  |
> | Microsoft.Cdn/operationresults/read |  |
> | Microsoft.Cdn/operationresults/write |  |
> | Microsoft.Cdn/operationresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/CheckResourceUsage/action |  |
> | Microsoft.Cdn/operationresults/profileresults/GenerateSsoUri/action |  |
> | Microsoft.Cdn/operationresults/profileresults/GetSupportedOptimizationTypes/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/CheckResourceUsage/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/Start/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/Stop/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/Purge/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/Load/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/ValidateCustomDomain/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/customdomainresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/customdomainresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/customdomainresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/customdomainresults/DisableCustomHttps/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/customdomainresults/EnableCustomHttps/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/origingroupresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/origingroupresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/origingroupresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/originresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/originresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/originresults/delete |  |
> | Microsoft.Cdn/operations/read |  |
> | Microsoft.Cdn/profiles/read |  |
> | Microsoft.Cdn/profiles/write |  |
> | Microsoft.Cdn/profiles/delete |  |
> | Microsoft.Cdn/profiles/CheckResourceUsage/action |  |
> | Microsoft.Cdn/profiles/GenerateSsoUri/action |  |
> | Microsoft.Cdn/profiles/GetSupportedOptimizationTypes/action |  |
> | Microsoft.Cdn/profiles/endpoints/read |  |
> | Microsoft.Cdn/profiles/endpoints/write |  |
> | Microsoft.Cdn/profiles/endpoints/delete |  |
> | Microsoft.Cdn/profiles/endpoints/CheckResourceUsage/action |  |
> | Microsoft.Cdn/profiles/endpoints/Start/action |  |
> | Microsoft.Cdn/profiles/endpoints/Stop/action |  |
> | Microsoft.Cdn/profiles/endpoints/Purge/action |  |
> | Microsoft.Cdn/profiles/endpoints/Load/action |  |
> | Microsoft.Cdn/profiles/endpoints/ValidateCustomDomain/action |  |
> | Microsoft.Cdn/profiles/endpoints/customdomains/read |  |
> | Microsoft.Cdn/profiles/endpoints/customdomains/write |  |
> | Microsoft.Cdn/profiles/endpoints/customdomains/delete |  |
> | Microsoft.Cdn/profiles/endpoints/customdomains/DisableCustomHttps/action |  |
> | Microsoft.Cdn/profiles/endpoints/customdomains/EnableCustomHttps/action |  |
> | Microsoft.Cdn/profiles/endpoints/origingroups/read |  |
> | Microsoft.Cdn/profiles/endpoints/origingroups/write |  |
> | Microsoft.Cdn/profiles/endpoints/origingroups/delete |  |
> | Microsoft.Cdn/profiles/endpoints/origins/read |  |
> | Microsoft.Cdn/profiles/endpoints/origins/write |  |
> | Microsoft.Cdn/profiles/endpoints/origins/delete |  |

### Microsoft.ClassicNetwork

Azure service: Classic deployment model virtual network

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ClassicNetwork/register/action | Register to Classic Network |
> | Microsoft.ClassicNetwork/expressroutecrossconnections/read | Get express route cross connections. |
> | Microsoft.ClassicNetwork/expressroutecrossconnections/write | Add express route cross connections. |
> | Microsoft.ClassicNetwork/expressroutecrossconnections/operationstatuses/read | Get an express route cross connection operation status. |
> | Microsoft.ClassicNetwork/expressroutecrossconnections/peerings/read | Get express route cross connection peering. |
> | Microsoft.ClassicNetwork/expressroutecrossconnections/peerings/write | Add express route cross connection peering. |
> | Microsoft.ClassicNetwork/expressroutecrossconnections/peerings/delete | Delete express route cross connection peering. |
> | Microsoft.ClassicNetwork/expressroutecrossconnections/peerings/operationstatuses/read | Get an express route cross connection peering operation status. |
> | Microsoft.ClassicNetwork/gatewaySupportedDevices/read | Retrieves the list of supported devices. |
> | Microsoft.ClassicNetwork/networkSecurityGroups/read | Gets the network security group. |
> | Microsoft.ClassicNetwork/networkSecurityGroups/write | Adds a new network security group. |
> | Microsoft.ClassicNetwork/networkSecurityGroups/delete | Deletes the network security group. |
> | Microsoft.ClassicNetwork/networkSecurityGroups/operationStatuses/read | Reads the operation status for the network security group. |
> | Microsoft.ClassicNetwork/networksecuritygroups/providers/Microsoft.Insights/diagnosticSettings/read | Gets the Network Security Groups Diagnostic Settings |
> | Microsoft.ClassicNetwork/networksecuritygroups/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the Network Security Groups diagnostic settings, this operation is supplemented by insights resource provider. |
> | Microsoft.ClassicNetwork/networksecuritygroups/providers/Microsoft.Insights/logDefinitions/read | Gets the events for network security group |
> | Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/read | Gets the security rule. |
> | Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/write | Adds or update a security rule. |
> | Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/delete | Deletes the security rule. |
> | Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/operationStatuses/read | Reads the operation status for the network security group security rules. |
> | Microsoft.ClassicNetwork/operations/read | Get classic network operations. |
> | Microsoft.ClassicNetwork/quotas/read | Get the quota for the subscription. |
> | Microsoft.ClassicNetwork/reservedIps/read | Gets the reserved Ips |
> | Microsoft.ClassicNetwork/reservedIps/write | Add a new reserved Ip |
> | Microsoft.ClassicNetwork/reservedIps/delete | Delete a reserved Ip. |
> | Microsoft.ClassicNetwork/reservedIps/link/action | Link a reserved Ip |
> | Microsoft.ClassicNetwork/reservedIps/join/action | Join a reserved Ip |
> | Microsoft.ClassicNetwork/reservedIps/operationStatuses/read | Reads the operation status for the reserved ips. |
> | Microsoft.ClassicNetwork/virtualNetworks/read | Get the virtual network. |
> | Microsoft.ClassicNetwork/virtualNetworks/write | Add a new virtual network. |
> | Microsoft.ClassicNetwork/virtualNetworks/delete | Deletes the virtual network. |
> | Microsoft.ClassicNetwork/virtualNetworks/peer/action | Peers a virtual network with another virtual network. |
> | Microsoft.ClassicNetwork/virtualNetworks/join/action | Joins the virtual network. |
> | Microsoft.ClassicNetwork/virtualNetworks/checkIPAddressAvailability/action | Checks the availability of a given IP address in a virtual network. |
> | Microsoft.ClassicNetwork/virtualNetworks/validateMigration/action | Validates the migration of a Virtual Network |
> | Microsoft.ClassicNetwork/virtualNetworks/prepareMigration/action | Prepares the migration of a Virtual Network |
> | Microsoft.ClassicNetwork/virtualNetworks/commitMigration/action | Commits the migration of a Virtual Network |
> | Microsoft.ClassicNetwork/virtualNetworks/abortMigration/action | Aborts the migration of a Virtual Network |
> | Microsoft.ClassicNetwork/virtualNetworks/capabilities/read | Shows the capabilities |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/read | Gets the virtual network gateways. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/write | Adds a virtual network gateway. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/delete | Deletes the virtual network gateway. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/startDiagnostics/action | Starts diagnostic for the virtual network gateway. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/stopDiagnostics/action | Stops the diagnostic for the virtual network gateway. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/downloadDiagnostics/action | Downloads the gateway diagnostics. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/listCircuitServiceKey/action | Retrieves the circuit service key. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/downloadDeviceConfigurationScript/action | Downloads the device configuration script. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/listPackage/action | Lists the virtual network gateway package. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRevokedCertificates/read | Read the revoked client certificates. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRevokedCertificates/write | Revokes a client certificate. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRevokedCertificates/delete | Unrevokes a client certificate. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/read | Find the client root certificates. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/write | Uploads a new client root certificate. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/delete | Deletes the virtual network gateway client certificate. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/download/action | Downloads certificate by thumbprint. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/listPackage/action | Lists the virtual network gateway certificate package. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/connections/read | Retrieves the list of connections. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/connections/connect/action | Connects a site to site gateway connection. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/connections/disconnect/action | Disconnects a site to site gateway connection. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/connections/test/action | Tests a site to site gateway connection. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/operationStatuses/read | Reads the operation status for the virtual networks gateways. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/packages/read | Gets the virtual network gateway package. |
> | Microsoft.ClassicNetwork/virtualNetworks/operationStatuses/read | Reads the operation status for the virtual networks. |
> | Microsoft.ClassicNetwork/virtualNetworks/remoteVirtualNetworkPeeringProxies/read | Gets the remote virtual network peering proxy. |
> | Microsoft.ClassicNetwork/virtualNetworks/remoteVirtualNetworkPeeringProxies/write | Adds or updates the remote virtual network peering proxy. |
> | Microsoft.ClassicNetwork/virtualNetworks/remoteVirtualNetworkPeeringProxies/delete | Deletes the remote virtual network peering proxy. |
> | Microsoft.ClassicNetwork/virtualNetworks/subnets/associatedNetworkSecurityGroups/read | Gets the network security group associated with the subnet. |
> | Microsoft.ClassicNetwork/virtualNetworks/subnets/associatedNetworkSecurityGroups/write | Adds a network security group associated with the subnet. |
> | Microsoft.ClassicNetwork/virtualNetworks/subnets/associatedNetworkSecurityGroups/delete | Deletes the network security group associated with the subnet. |
> | Microsoft.ClassicNetwork/virtualNetworks/subnets/associatedNetworkSecurityGroups/operationStatuses/read | Reads the operation status for the virtual network subnet associated network security group. |
> | Microsoft.ClassicNetwork/virtualNetworks/virtualNetworkPeerings/read | Gets the virtual network peering. |

### Microsoft.Network

Azure service: [Application Gateway](../application-gateway/index.yml), [Azure Bastion](../bastion/index.yml), [Azure DDoS Protection](../virtual-network/ddos-protection-overview.md), [Azure DNS](../dns/index.yml), [Azure ExpressRoute](../expressroute/index.yml), [Azure Firewall](../firewall/index.yml), [Azure Front Door Service](../frontdoor/index.yml), [Azure Private Link](../private-link/index.yml), [Load Balancer](../load-balancer/index.yml), [Network Watcher](../network-watcher/index.yml), [Traffic Manager](../traffic-manager/index.yml), [Virtual Network](../virtual-network/index.yml), [Virtual WAN](../virtual-wan/index.yml), [VPN Gateway](../vpn-gateway/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Network/register/action | Registers the subscription |
> | Microsoft.Network/unregister/action | Unregisters the subscription |
> | Microsoft.Network/checkTrafficManagerNameAvailability/action | Checks the availability of a Traffic Manager Relative DNS name. |
> | Microsoft.Network/checkFrontDoorNameAvailability/action | Checks whether a Front Door name is available |
> | Microsoft.Network/applicationGatewayAvailableRequestHeaders/read | Get Application Gateway available Request Headers |
> | Microsoft.Network/applicationGatewayAvailableResponseHeaders/read | Get Application Gateway available Response Header |
> | Microsoft.Network/applicationGatewayAvailableServerVariables/read | Get Application Gateway available Server Variables |
> | Microsoft.Network/applicationGatewayAvailableSslOptions/read | Application Gateway available Ssl Options |
> | Microsoft.Network/applicationGatewayAvailableSslOptions/predefinedPolicies/read | Application Gateway Ssl Predefined Policy |
> | Microsoft.Network/applicationGatewayAvailableWafRuleSets/read | Gets Application Gateway Available Waf Rule Sets |
> | Microsoft.Network/applicationGateways/read | Gets an application gateway |
> | Microsoft.Network/applicationGateways/write | Creates an application gateway or updates an application gateway |
> | Microsoft.Network/applicationGateways/delete | Deletes an application gateway |
> | Microsoft.Network/applicationGateways/backendhealth/action | Gets an application gateway backend health |
> | Microsoft.Network/applicationGateways/getBackendHealthOnDemand/action | Gets an application gateway backend health on demand for given http setting and backend pool |
> | Microsoft.Network/applicationGateways/start/action | Starts an application gateway |
> | Microsoft.Network/applicationGateways/stop/action | Stops an application gateway |
> | Microsoft.Network/applicationGateways/backendAddressPools/join/action | Joins an application gateway backend address pool. Not Alertable. |
> | Microsoft.Network/applicationGateways/privateEndpointConnections/read | Gets Application Gateway PrivateEndpoint Connections |
> | Microsoft.Network/applicationGateways/privateEndpointConnections/write | Updates Application Gateway PrivateEndpoint Connection |
> | Microsoft.Network/applicationGateways/privateEndpointConnections/delete | Deletes Application Gateway PrivateEndpoint Connection |
> | Microsoft.Network/applicationGateways/privateLinkResources/read | Gets ApplicationGateway PrivateLink Resources |
> | Microsoft.Network/applicationGateways/privateLinkResources/resolvePrivateLinkServiceId/action | Gets private link identifier for application gateway private link resource |
> | Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/read | Gets an Application Gateway WAF policy |
> | Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/write | Creates an Application Gateway WAF policy or updates an Application Gateway WAF policy |
> | Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/delete | Deletes an Application Gateway WAF policy |
> | Microsoft.Network/applicationRuleCollections/read | Gets Azure Firewall ApplicationRuleCollection |
> | Microsoft.Network/applicationRuleCollections/write | CreatesOrUpdates Azure Firewall ApplicationRuleCollection |
> | Microsoft.Network/applicationRuleCollections/delete | Deletes Azure Firewall ApplicationRuleCollection |
> | Microsoft.Network/applicationSecurityGroups/joinIpConfiguration/action | Joins an IP Configuration to Application Security Groups. Not alertable. |
> | Microsoft.Network/applicationSecurityGroups/joinNetworkSecurityRule/action | Joins a Security Rule to Application Security Groups. Not alertable. |
> | Microsoft.Network/applicationSecurityGroups/read | Gets an Application Security Group ID. |
> | Microsoft.Network/applicationSecurityGroups/write | Creates an Application Security Group, or updates an existing Application Security Group. |
> | Microsoft.Network/applicationSecurityGroups/delete | Deletes an Application Security Group |
> | Microsoft.Network/applicationSecurityGroups/listIpConfigurations/action | Lists IP Configurations in the ApplicationSecurityGroup |
> | Microsoft.Network/azureFirewallFqdnTags/read | Gets Azure Firewall FQDN Tags |
> | Microsoft.Network/azurefirewalls/read | Get Azure Firewall |
> | Microsoft.Network/azurefirewalls/write | Creates or updates an Azure Firewall |
> | Microsoft.Network/azurefirewalls/delete | Delete Azure Firewall |
> | Microsoft.Network/bastionHosts/read | Gets a Bastion Host |
> | Microsoft.Network/bastionHosts/write | Create or Update a Bastion Host |
> | Microsoft.Network/bastionHosts/delete | Deletes a Bastion Host |
> | Microsoft.Network/bastionHosts/getactivesessions/action | Get Active Sessions in the Bastion Host |
> | Microsoft.Network/bastionHosts/disconnectactivesessions/action | Disconnect given Active Sessions in the Bastion Host |
> | Microsoft.Network/bastionHosts/getShareableLinks/action | Returns the shareable urls for the specified VMs in a Bastion subnet provided their urls are created |
> | Microsoft.Network/bastionHosts/createShareableLinks/action | Creates shareable urls for the VMs under a bastion and returns the urls |
> | Microsoft.Network/bastionHosts/deleteShareableLinks/action | Deletes shareable urls for the provided VMs under a bastion |
> | Microsoft.Network/bastionHosts/deleteShareableLinksByToken/action | Deletes shareable urls for the provided tokens under a bastion |
> | Microsoft.Network/bgpServiceCommunities/read | Get Bgp Service Communities |
> | Microsoft.Network/connections/read | Gets VirtualNetworkGatewayConnection |
> | Microsoft.Network/connections/write | Creates or updates an existing VirtualNetworkGatewayConnection |
> | Microsoft.Network/connections/delete | Deletes VirtualNetworkGatewayConnection |
> | Microsoft.Network/connections/sharedkey/action | Get VirtualNetworkGatewayConnection SharedKey |
> | Microsoft.Network/connections/vpndeviceconfigurationscript/action | Gets Vpn Device Configuration of VirtualNetworkGatewayConnection |
> | Microsoft.Network/connections/revoke/action | Marks an Express Route Connection status as Revoked |
> | Microsoft.Network/connections/startpacketcapture/action | Starts a Virtual Network Gateway Connection Packet Capture. |
> | Microsoft.Network/connections/stoppacketcapture/action | Stops a Virtual Network Gateway Connection Packet Capture. |
> | Microsoft.Network/connections/sharedKey/read | Gets VirtualNetworkGatewayConnection SharedKey |
> | Microsoft.Network/connections/sharedKey/write | Creates or updates an existing VirtualNetworkGatewayConnection SharedKey |
> | Microsoft.Network/ddosCustomPolicies/read | Gets a DDoS customized policy definition Definition |
> | Microsoft.Network/ddosCustomPolicies/write | Creates a DDoS customized policy or updates an existing DDoS customized policy |
> | Microsoft.Network/ddosCustomPolicies/delete | Deletes a DDoS customized policy |
> | Microsoft.Network/ddosProtectionPlans/read | Gets a DDoS Protection Plan |
> | Microsoft.Network/ddosProtectionPlans/write | Creates a DDoS Protection Plan or updates a DDoS Protection Plan  |
> | Microsoft.Network/ddosProtectionPlans/delete | Deletes a DDoS Protection Plan |
> | Microsoft.Network/ddosProtectionPlans/join/action | Joins a DDoS Protection Plan. Not alertable. |
> | Microsoft.Network/dnsoperationresults/read | Gets results of a DNS operation |
> | Microsoft.Network/dnsoperationstatuses/read | Gets status of a DNS operation  |
> | Microsoft.Network/dnszones/read | Get the DNS zone, in JSON format. The zone properties include tags, etag, numberOfRecordSets, and maxNumberOfRecordSets. Note that this command does not retrieve the record sets contained within the zone. |
> | Microsoft.Network/dnszones/write | Create or update a DNS zone within a resource group.  Used to update the tags on a DNS zone resource. Note that this command can not be used to create or update record sets within the zone. |
> | Microsoft.Network/dnszones/delete | Delete the DNS zone, in JSON format. The zone properties include tags, etag, numberOfRecordSets, and maxNumberOfRecordSets. |
> | Microsoft.Network/dnszones/A/read | Get the record set of type 'A', in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/dnszones/A/write | Create or update a record set of type 'A' within a DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/dnszones/A/delete | Remove the record set of a given name and type 'A' from a DNS zone. |
> | Microsoft.Network/dnszones/AAAA/read | Get the record set of type 'AAAA', in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/dnszones/AAAA/write | Create or update a record set of type 'AAAA' within a DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/dnszones/AAAA/delete | Remove the record set of a given name and type 'AAAA' from a DNS zone. |
> | Microsoft.Network/dnszones/all/read | Gets DNS record sets across types |
> | Microsoft.Network/dnszones/CAA/read | Get the record set of type 'CAA', in JSON format. The record set contains the TTL, tags, and etag. |
> | Microsoft.Network/dnszones/CAA/write | Create or update a record set of type 'CAA' within a DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/dnszones/CAA/delete | Remove the record set of a given name and type 'CAA' from a DNS zone. |
> | Microsoft.Network/dnszones/CNAME/read | Get the record set of type 'CNAME', in JSON format. The record set contains the TTL, tags, and etag. |
> | Microsoft.Network/dnszones/CNAME/write | Create or update a record set of type 'CNAME' within a DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/dnszones/CNAME/delete | Remove the record set of a given name and type 'CNAME' from a DNS zone. |
> | Microsoft.Network/dnszones/MX/read | Get the record set of type 'MX', in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/dnszones/MX/write | Create or update a record set of type 'MX' within a DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/dnszones/MX/delete | Remove the record set of a given name and type 'MX' from a DNS zone. |
> | Microsoft.Network/dnszones/NS/read | Gets DNS record set of type NS |
> | Microsoft.Network/dnszones/NS/write | Creates or updates DNS record set of type NS |
> | Microsoft.Network/dnszones/NS/delete | Deletes the DNS record set of type NS |
> | Microsoft.Network/dnszones/PTR/read | Get the record set of type 'PTR', in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/dnszones/PTR/write | Create or update a record set of type 'PTR' within a DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/dnszones/PTR/delete | Remove the record set of a given name and type 'PTR' from a DNS zone. |
> | Microsoft.Network/dnszones/recordsets/read | Gets DNS record sets across types |
> | Microsoft.Network/dnszones/SOA/read | Gets DNS record set of type SOA |
> | Microsoft.Network/dnszones/SOA/write | Creates or updates DNS record set of type SOA |
> | Microsoft.Network/dnszones/SRV/read | Get the record set of type 'SRV', in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/dnszones/SRV/write | Create or update record set of type SRV |
> | Microsoft.Network/dnszones/SRV/delete | Remove the record set of a given name and type 'SRV' from a DNS zone. |
> | Microsoft.Network/dnszones/TXT/read | Get the record set of type 'TXT', in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/dnszones/TXT/write | Create or update a record set of type 'TXT' within a DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/dnszones/TXT/delete | Remove the record set of a given name and type 'TXT' from a DNS zone. |
> | Microsoft.Network/expressRouteCircuits/read | Get an ExpressRouteCircuit |
> | Microsoft.Network/expressRouteCircuits/write | Creates or updates an existing ExpressRouteCircuit |
> | Microsoft.Network/expressRouteCircuits/join/action | Joins an Express Route Circuit. Not alertable. |
> | Microsoft.Network/expressRouteCircuits/delete | Deletes an ExpressRouteCircuit |
> | Microsoft.Network/expressRouteCircuits/authorizations/read | Gets an ExpressRouteCircuit Authorization |
> | Microsoft.Network/expressRouteCircuits/authorizations/write | Creates or updates an existing ExpressRouteCircuit Authorization |
> | Microsoft.Network/expressRouteCircuits/authorizations/delete | Deletes an ExpressRouteCircuit Authorization |
> | Microsoft.Network/expressRouteCircuits/peerings/read | Gets an ExpressRouteCircuit Peering |
> | Microsoft.Network/expressRouteCircuits/peerings/write | Creates or updates an existing ExpressRouteCircuit Peering |
> | Microsoft.Network/expressRouteCircuits/peerings/delete | Deletes an ExpressRouteCircuit Peering |
> | Microsoft.Network/expressRouteCircuits/peerings/arpTables/read | Gets an ExpressRouteCircuit Peering ArpTable |
> | Microsoft.Network/expressRouteCircuits/peerings/connections/read | Gets an ExpressRouteCircuit Connection |
> | Microsoft.Network/expressRouteCircuits/peerings/connections/write | Creates or updates an existing ExpressRouteCircuit Connection Resource |
> | Microsoft.Network/expressRouteCircuits/peerings/connections/delete | Deletes an ExpressRouteCircuit Connection |
> | Microsoft.Network/expressRouteCircuits/peerings/peerConnections/read | Gets Peer Express Route Circuit Connection |
> | Microsoft.Network/expressRouteCircuits/peerings/routeTables/read | Gets an ExpressRouteCircuit Peering RouteTable |
> | Microsoft.Network/expressRouteCircuits/peerings/routeTablesSummary/read | Gets an ExpressRouteCircuit Peering RouteTable Summary |
> | Microsoft.Network/expressRouteCircuits/peerings/stats/read | Gets an ExpressRouteCircuit Peering Stat |
> | Microsoft.Network/expressRouteCircuits/stats/read | Gets an ExpressRouteCircuit Stat |
> | Microsoft.Network/expressRouteCrossConnections/read | Get Express Route Cross Connection |
> | Microsoft.Network/expressRouteCrossConnections/join/action | Joins an Express Route Cross Connection. Not alertable. |
> | Microsoft.Network/expressRouteCrossConnections/peerings/read | Gets an Express Route Cross Connection Peering |
> | Microsoft.Network/expressRouteCrossConnections/peerings/write | Creates an Express Route Cross Connection Peering or Updates an existing Express Route Cross Connection Peering |
> | Microsoft.Network/expressRouteCrossConnections/peerings/delete | Deletes an Express Route Cross Connection Peering |
> | Microsoft.Network/expressRouteCrossConnections/peerings/arpTables/read | Gets an Express Route Cross Connection Peering Arp Table |
> | Microsoft.Network/expressRouteCrossConnections/peerings/routeTables/read | Gets an Express Route Cross Connection Peering Route Table |
> | Microsoft.Network/expressRouteCrossConnections/peerings/routeTableSummary/read | Gets an Express Route Cross Connection Peering Route Table Summary |
> | Microsoft.Network/expressRouteGateways/read | Get Express Route Gateway |
> | Microsoft.Network/expressRouteGateways/join/action | Joins an Express Route Gateway. Not alertable. |
> | Microsoft.Network/expressRouteGateways/expressRouteConnections/read | Gets an Express Route Connection |
> | Microsoft.Network/expressRouteGateways/expressRouteConnections/write | Creates an Express Route Connection or Updates an existing Express Route Connection |
> | Microsoft.Network/expressRouteGateways/expressRouteConnections/delete | Deletes an Express Route Connection |
> | Microsoft.Network/expressRoutePorts/read | Gets ExpressRoutePorts |
> | Microsoft.Network/expressRoutePorts/write | Creates or updates ExpressRoutePorts |
> | Microsoft.Network/expressRoutePorts/join/action | Joins Express Route ports. Not alertable. |
> | Microsoft.Network/expressRoutePorts/delete | Deletes ExpressRoutePorts |
> | Microsoft.Network/expressRoutePorts/links/read | Gets ExpressRouteLink |
> | Microsoft.Network/expressRoutePortsLocations/read | Get Express Route Ports Locations |
> | Microsoft.Network/expressRouteServiceProviders/read | Gets Express Route Service Providers |
> | Microsoft.Network/firewallPolicies/read | Gets a Firewall Policy |
> | Microsoft.Network/firewallPolicies/write | Creates a Firewall Policy or Updates an existing Firewall Policy |
> | Microsoft.Network/firewallPolicies/join/action | Joins a Firewall Policy. Not alertable. |
> | Microsoft.Network/firewallPolicies/delete | Deletes a Firewall Policy |
> | Microsoft.Network/firewallPolicies/ruleGroups/read | Gets a Firewall Policy Rule Group |
> | Microsoft.Network/firewallPolicies/ruleGroups/write | Creates a Firewall Policy Rule Group or Updates an existing Firewall Policy Rule Group |
> | Microsoft.Network/firewallPolicies/ruleGroups/delete | Deletes a Firewall Policy Rule Group |
> | Microsoft.Network/frontDoors/read | Gets a Front Door |
> | Microsoft.Network/frontDoors/write | Creates or updates a Front Door |
> | Microsoft.Network/frontDoors/delete | Deletes a Front Door |
> | Microsoft.Network/frontDoors/purge/action | Purge cached content from a Front Door |
> | Microsoft.Network/frontDoors/validateCustomDomain/action | Validates a frontend endpoint for a Front Door |
> | Microsoft.Network/frontDoors/backendPools/read | Gets a backend pool |
> | Microsoft.Network/frontDoors/backendPools/write | Creates or updates a backend pool |
> | Microsoft.Network/frontDoors/backendPools/delete | Deletes a backend pool |
> | Microsoft.Network/frontDoors/frontendEndpoints/read | Gets a frontend endpoint |
> | Microsoft.Network/frontDoors/frontendEndpoints/write | Creates or updates a frontend endpoint |
> | Microsoft.Network/frontDoors/frontendEndpoints/delete | Deletes a frontend endpoint |
> | Microsoft.Network/frontDoors/frontendEndpoints/enableHttps/action | Enables HTTPS on a Frontend Endpoint |
> | Microsoft.Network/frontDoors/frontendEndpoints/disableHttps/action | Disables HTTPS on a Frontend Endpoint |
> | Microsoft.Network/frontDoors/healthProbeSettings/read | Gets health probe settings |
> | Microsoft.Network/frontDoors/healthProbeSettings/write | Creates or updates health probe settings |
> | Microsoft.Network/frontDoors/healthProbeSettings/delete | Deletes health probe settings |
> | Microsoft.Network/frontDoors/loadBalancingSettings/read | Gets load balancing settings |
> | Microsoft.Network/frontDoors/loadBalancingSettings/write | Creates or updates load balancing settings |
> | Microsoft.Network/frontDoors/loadBalancingSettings/delete | Creates or updates load balancing settings |
> | Microsoft.Network/frontDoors/routingRules/read | Gets a routing rule |
> | Microsoft.Network/frontDoors/routingRules/write | Creates or updates a routing rule |
> | Microsoft.Network/frontDoors/routingRules/delete | Deletes a routing rule |
> | Microsoft.Network/frontDoors/rulesEngines/read | Gets a Rules Engine |
> | Microsoft.Network/frontDoors/rulesEngines/write | Creates or updates a Rules Engine |
> | Microsoft.Network/frontDoors/rulesEngines/delete | Deletes a Rules Engine |
> | Microsoft.Network/frontDoorWebApplicationFirewallManagedRuleSets/read | Gets Web Application Firewall Managed Rule Sets |
> | Microsoft.Network/frontDoorWebApplicationFirewallPolicies/read | Gets a Web Application Firewall Policy |
> | Microsoft.Network/frontDoorWebApplicationFirewallPolicies/write | Creates or updates a Web Application Firewall Policy |
> | Microsoft.Network/frontDoorWebApplicationFirewallPolicies/delete | Deletes a Web Application Firewall Policy |
> | Microsoft.Network/frontDoorWebApplicationFirewallPolicies/join/action | Joins a Web Application Firewall Policy. Not Alertable. |
> | Microsoft.Network/ipAllocations/read | Get The IpAllocation |
> | Microsoft.Network/ipAllocations/write | Creates A IpAllocation Or Updates An Existing IpAllocation |
> | Microsoft.Network/ipAllocations/delete | Deletes A IpAllocation |
> | Microsoft.Network/ipGroups/read | Gets an IpGroup |
> | Microsoft.Network/ipGroups/write | Creates an IpGroup or Updates An Existing IpGroups |
> | Microsoft.Network/ipGroups/validate/action | Validates an IpGroup |
> | Microsoft.Network/ipGroups/updateReferences/action | Update references in an IpGroup |
> | Microsoft.Network/ipGroups/join/action | Joins an IpGroup. Not alertable. |
> | Microsoft.Network/ipGroups/delete | Deletes an IpGroup |
> | Microsoft.Network/loadBalancers/read | Gets a load balancer definition |
> | Microsoft.Network/loadBalancers/write | Creates a load balancer or updates an existing load balancer |
> | Microsoft.Network/loadBalancers/delete | Deletes a load balancer |
> | Microsoft.Network/loadBalancers/backendAddressPools/read | Gets a load balancer backend address pool definition |
> | Microsoft.Network/loadBalancers/backendAddressPools/write | Creates a load balancer backend address pool or updates an existing load balancer backend address pool |
> | Microsoft.Network/loadBalancers/backendAddressPools/delete | Deletes a load balancer backend address pool |
> | Microsoft.Network/loadBalancers/backendAddressPools/join/action | Joins a load balancer backend address pool. Not Alertable. |
> | Microsoft.Network/loadBalancers/frontendIPConfigurations/read | Gets a load balancer frontend IP configuration definition |
> | Microsoft.Network/loadBalancers/frontendIPConfigurations/join/action | Joins a Load Balancer Frontend IP Configuration. Not alertable. |
> | Microsoft.Network/loadBalancers/inboundNatPools/read | Gets a load balancer inbound nat pool definition |
> | Microsoft.Network/loadBalancers/inboundNatPools/join/action | Joins a load balancer inbound NAT pool. Not alertable. |
> | Microsoft.Network/loadBalancers/inboundNatRules/read | Gets a load balancer inbound nat rule definition |
> | Microsoft.Network/loadBalancers/inboundNatRules/write | Creates a load balancer inbound nat rule or updates an existing load balancer inbound nat rule |
> | Microsoft.Network/loadBalancers/inboundNatRules/delete | Deletes a load balancer inbound nat rule |
> | Microsoft.Network/loadBalancers/inboundNatRules/join/action | Joins a load balancer inbound nat rule. Not Alertable. |
> | Microsoft.Network/loadBalancers/loadBalancingRules/read | Gets a load balancer load balancing rule definition |
> | Microsoft.Network/loadBalancers/networkInterfaces/read | Gets references to all the network interfaces under a load balancer |
> | Microsoft.Network/loadBalancers/outboundRules/read | Gets a load balancer outbound rule definition |
> | Microsoft.Network/loadBalancers/probes/read | Gets a load balancer probe |
> | Microsoft.Network/loadBalancers/probes/join/action | Allows using probes of a load balancer. For example, with this permission healthProbe property of VM scale set can reference the probe. Not alertable. |
> | Microsoft.Network/loadBalancers/virtualMachines/read | Gets references to all the virtual machines under a load balancer |
> | Microsoft.Network/localnetworkgateways/read | Gets LocalNetworkGateway |
> | Microsoft.Network/localnetworkgateways/write | Creates or updates an existing LocalNetworkGateway |
> | Microsoft.Network/localnetworkgateways/delete | Deletes LocalNetworkGateway |
> | Microsoft.Network/locations/checkAcceleratedNetworkingSupport/action | Checks Accelerated Networking support |
> | Microsoft.Network/locations/checkPrivateLinkServiceVisibility/action | Checks Private Link Service Visibility |
> | Microsoft.Network/locations/bareMetalTenants/action | Allocates or validates a Bare Metal Tenant |
> | Microsoft.Network/locations/autoApprovedPrivateLinkServices/read | Gets Auto Approved Private Link Services |
> | Microsoft.Network/locations/availableDelegations/read | Gets Available Delegations |
> | Microsoft.Network/locations/availablePrivateEndpointTypes/read | Gets available Private Endpoint resources |
> | Microsoft.Network/locations/availableServiceAliases/read | Gets Available Service Aliases |
> | Microsoft.Network/locations/checkDnsNameAvailability/read | Checks if dns label is available at the specified location |
> | Microsoft.Network/locations/operationResults/read | Gets operation result of an async POST or DELETE operation |
> | Microsoft.Network/locations/operations/read | Gets operation resource that represents status of an asynchronous operation |
> | Microsoft.Network/locations/serviceTags/read | Get Service Tags |
> | Microsoft.Network/locations/supportedVirtualMachineSizes/read | Gets supported virtual machines sizes |
> | Microsoft.Network/locations/usages/read | Gets the resources usage metrics |
> | Microsoft.Network/locations/virtualNetworkAvailableEndpointServices/read | Gets a list of available Virtual Network Endpoint Services |
> | Microsoft.Network/natGateways/join/action | Joins a NAT Gateway |
> | Microsoft.Network/natRuleCollections/read | Gets Azure Firewall NatRuleCollection |
> | Microsoft.Network/natRuleCollections/write | CreatesOrUpdates Azure Firewall NatRuleCollection |
> | Microsoft.Network/natRuleCollections/delete | Deletes Azure Firewall NatRuleCollection |
> | Microsoft.Network/networkExperimentProfiles/read | Get an Internet Analyzer profile |
> | Microsoft.Network/networkExperimentProfiles/write | Create or update an Internet Analyzer profile |
> | Microsoft.Network/networkExperimentProfiles/delete | Delete an Internet Analyzer profile |
> | Microsoft.Network/networkExperimentProfiles/experiments/read | Get an Internet Analyzer test |
> | Microsoft.Network/networkExperimentProfiles/experiments/write | Create or update an Internet Analyzer test |
> | Microsoft.Network/networkExperimentProfiles/experiments/delete | Delete an Internet Analyzer test |
> | Microsoft.Network/networkExperimentProfiles/experiments/timeseries/action | Get an Internet Analyzer test's time series |
> | Microsoft.Network/networkExperimentProfiles/experiments/latencyScorecard/action | Get an Internet Analyzer test's latency scorecard |
> | Microsoft.Network/networkExperimentProfiles/preconfiguredEndpoints/read | Get an Internet Analyzer profile's pre-configured endpoints |
> | Microsoft.Network/networkIntentPolicies/read | Gets an Network Intent Policy Description |
> | Microsoft.Network/networkIntentPolicies/write | Creates an Network Intent Policy or updates an existing Network Intent Policy |
> | Microsoft.Network/networkIntentPolicies/delete | Deletes an Network Intent Policy |
> | Microsoft.Network/networkInterfaces/read | Gets a network interface definition.  |
> | Microsoft.Network/networkInterfaces/write | Creates a network interface or updates an existing network interface.  |
> | Microsoft.Network/networkInterfaces/join/action | Joins a Virtual Machine to a network interface. Not Alertable. |
> | Microsoft.Network/networkInterfaces/delete | Deletes a network interface |
> | Microsoft.Network/networkInterfaces/effectiveRouteTable/action | Get Route Table configured On Network Interface Of The Vm |
> | Microsoft.Network/networkInterfaces/effectiveNetworkSecurityGroups/action | Get Network Security Groups configured On Network Interface Of The Vm |
> | Microsoft.Network/networkInterfaces/UpdateParentNicAttachmentOnElasticNic/action | Updates the parent NIC associated to the elastic NIC |
> | Microsoft.Network/networkInterfaces/ipconfigurations/read | Gets a network interface ip configuration definition.  |
> | Microsoft.Network/networkInterfaces/ipconfigurations/join/action | Joins a Network Interface IP Configuration. Not alertable. |
> | Microsoft.Network/networkInterfaces/loadBalancers/read | Gets all the load balancers that the network interface is part of |
> | Microsoft.Network/networkInterfaces/tapConfigurations/read | Gets a Network Interface Tap Configuration. |
> | Microsoft.Network/networkInterfaces/tapConfigurations/write | Creates a Network Interface Tap Configuration or updates an existing Network Interface Tap Configuration. |
> | Microsoft.Network/networkInterfaces/tapConfigurations/delete | Deletes a Network Interface Tap Configuration. |
> | Microsoft.Network/networkProfiles/read | Gets a Network Profile |
> | Microsoft.Network/networkProfiles/write | Creates or updates a Network Profile |
> | Microsoft.Network/networkProfiles/delete | Deletes a Network Profile |
> | Microsoft.Network/networkProfiles/setContainers/action | Sets Containers |
> | Microsoft.Network/networkProfiles/removeContainers/action | Removes Containers |
> | Microsoft.Network/networkProfiles/setNetworkInterfaces/action | Sets Container Network Interfaces |
> | Microsoft.Network/networkRuleCollections/read | Gets Azure Firewall NetworkRuleCollection |
> | Microsoft.Network/networkRuleCollections/write | CreatesOrUpdates Azure Firewall NetworkRuleCollection |
> | Microsoft.Network/networkRuleCollections/delete | Deletes Azure Firewall NetworkRuleCollection |
> | Microsoft.Network/networkSecurityGroups/read | Gets a network security group definition |
> | Microsoft.Network/networkSecurityGroups/write | Creates a network security group or updates an existing network security group |
> | Microsoft.Network/networkSecurityGroups/delete | Deletes a network security group |
> | Microsoft.Network/networkSecurityGroups/join/action | Joins a network security group. Not Alertable. |
> | Microsoft.Network/networkSecurityGroups/defaultSecurityRules/read | Gets a default security rule definition |
> | Microsoft.Network/networkSecurityGroups/securityRules/read | Gets a security rule definition |
> | Microsoft.Network/networkSecurityGroups/securityRules/write | Creates a security rule or updates an existing security rule |
> | Microsoft.Network/networkSecurityGroups/securityRules/delete | Deletes a security rule |
> | Microsoft.Network/networkWatchers/read | Get the network watcher definition |
> | Microsoft.Network/networkWatchers/write | Creates a network watcher or updates an existing network watcher |
> | Microsoft.Network/networkWatchers/delete | Deletes a network watcher |
> | Microsoft.Network/networkWatchers/configureFlowLog/action | Configures flow logging for a target resource. |
> | Microsoft.Network/networkWatchers/ipFlowVerify/action | Returns whether the packet is allowed or denied to or from a particular destination. |
> | Microsoft.Network/networkWatchers/nextHop/action | For a specified target and destination IP address, return the next hop type and next hope IP address. |
> | Microsoft.Network/networkWatchers/queryFlowLogStatus/action | Gets the status of flow logging on a resource. |
> | Microsoft.Network/networkWatchers/queryTroubleshootResult/action | Gets the troubleshooting result from the previously run or currently running troubleshooting operation. |
> | Microsoft.Network/networkWatchers/securityGroupView/action | View the configured and effective network security group rules applied on a VM. |
> | Microsoft.Network/networkWatchers/networkConfigurationDiagnostic/action | Diagnostic of network configuration. |
> | Microsoft.Network/networkWatchers/queryConnectionMonitors/action | Batch query monitoring connectivity between specified endpoints |
> | Microsoft.Network/networkWatchers/topology/action | Gets a network level view of resources and their relationships in a resource group. |
> | Microsoft.Network/networkWatchers/troubleshoot/action | Starts troubleshooting on a Networking resource in Azure. |
> | Microsoft.Network/networkWatchers/connectivityCheck/action | Verifies the possibility of establishing a direct TCP connection from a virtual machine to a given endpoint including another VM or an arbitrary remote server. |
> | Microsoft.Network/networkWatchers/azureReachabilityReport/action | Returns the relative latency score for internet service providers from a specified location to Azure regions. |
> | Microsoft.Network/networkWatchers/availableProvidersList/action | Returns all available internet service providers for a specified Azure region. |
> | Microsoft.Network/networkWatchers/connectionMonitors/start/action | Start monitoring connectivity between specified endpoints |
> | Microsoft.Network/networkWatchers/connectionMonitors/stop/action | Stop/pause monitoring connectivity between specified endpoints |
> | Microsoft.Network/networkWatchers/connectionMonitors/query/action | Query monitoring connectivity between specified endpoints |
> | Microsoft.Network/networkWatchers/connectionMonitors/read | Get Connection Monitor details |
> | Microsoft.Network/networkWatchers/connectionMonitors/write | Creates a Connection Monitor |
> | Microsoft.Network/networkWatchers/connectionMonitors/delete | Deletes a Connection Monitor |
> | Microsoft.Network/networkWatchers/flowLogs/read | Get Flow Log details |
> | Microsoft.Network/networkWatchers/flowLogs/write | Creates a Flow Log |
> | Microsoft.Network/networkWatchers/flowLogs/delete | Deletes a Flow Log |
> | Microsoft.Network/networkWatchers/lenses/start/action | Start monitoring network traffic on a specified endpoint |
> | Microsoft.Network/networkWatchers/lenses/stop/action | Stop/pause monitoring network traffic on a specified endpoint |
> | Microsoft.Network/networkWatchers/lenses/query/action | Query monitoring network traffic on a specified endpoint |
> | Microsoft.Network/networkWatchers/lenses/read | Get Lens details |
> | Microsoft.Network/networkWatchers/lenses/write | Creates a Lens |
> | Microsoft.Network/networkWatchers/lenses/delete | Deletes a Lens |
> | Microsoft.Network/networkWatchers/packetCaptures/queryStatus/action | Gets information about properties and status of a packet capture resource. |
> | Microsoft.Network/networkWatchers/packetCaptures/stop/action | Stop the running packet capture session. |
> | Microsoft.Network/networkWatchers/packetCaptures/read | Get the packet capture definition |
> | Microsoft.Network/networkWatchers/packetCaptures/write | Creates a packet capture |
> | Microsoft.Network/networkWatchers/packetCaptures/delete | Deletes a packet capture |
> | Microsoft.Network/networkWatchers/pingMeshes/start/action | Start PingMesh between specified VMs |
> | Microsoft.Network/networkWatchers/pingMeshes/stop/action | Stop PingMesh between specified VMs |
> | Microsoft.Network/networkWatchers/pingMeshes/read | Get PingMesh details |
> | Microsoft.Network/networkWatchers/pingMeshes/write | Creates a PingMesh |
> | Microsoft.Network/networkWatchers/pingMeshes/delete | Deletes a PingMesh |
> | Microsoft.Network/operations/read | Get Available Operations |
> | Microsoft.Network/p2sVpnGateways/read | Gets a P2SVpnGateway. |
> | Microsoft.Network/p2sVpnGateways/write | Puts a P2SVpnGateway. |
> | Microsoft.Network/p2sVpnGateways/delete | Deletes a P2SVpnGateway. |
> | Microsoft.Network/p2sVpnGateways/generatevpnprofile/action | Generate Vpn Profile for P2SVpnGateway |
> | Microsoft.Network/p2sVpnGateways/getp2svpnconnectionhealth/action | Gets a P2S Vpn Connection health for P2SVpnGateway |
> | Microsoft.Network/p2sVpnGateways/getp2svpnconnectionhealthdetailed/action | Gets a P2S Vpn Connection health detailed for P2SVpnGateway |
> | Microsoft.Network/p2sVpnGateways/disconnectp2svpnconnections/action | Disconnect p2s vpn connections |
> | Microsoft.Network/privateDnsOperationResults/read | Gets results of a Private DNS operation |
> | Microsoft.Network/privateDnsOperationStatuses/read | Gets status of a Private DNS operation |
> | Microsoft.Network/privateDnsZones/read | Get the Private DNS zone properties, in JSON format. Note that this command does not retrieve the virtual networks to which the Private DNS zone is linked or the record sets contained within the zone. |
> | Microsoft.Network/privateDnsZones/write | Create or update a Private DNS zone within a resource group. Note that this command cannot be used to create or update virtual network links or record sets within the zone. |
> | Microsoft.Network/privateDnsZones/delete | Delete a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/join/action | Joins a Private DNS Zone |
> | Microsoft.Network/privateDnsZones/A/read | Get the record set of type 'A' within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/privateDnsZones/A/write | Create or update a record set of type 'A' within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/privateDnsZones/A/delete | Remove the record set of a given name and type 'A' from a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/AAAA/read | Get the record set of type 'AAAA' within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/privateDnsZones/AAAA/write | Create or update a record set of type 'AAAA' within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/privateDnsZones/AAAA/delete | Remove the record set of a given name and type 'AAAA' from a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/ALL/read | Gets Private DNS record sets across types |
> | Microsoft.Network/privateDnsZones/CNAME/read | Get the record set of type 'CNAME' within a Private DNS zone, in JSON format. |
> | Microsoft.Network/privateDnsZones/CNAME/write | Create or update a record set of type 'CNAME' within a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/CNAME/delete | Remove the record set of a given name and type 'CNAME' from a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/MX/read | Get the record set of type 'MX' within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/privateDnsZones/MX/write | Create or update a record set of type 'MX' within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/privateDnsZones/MX/delete | Remove the record set of a given name and type 'MX' from a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/PTR/read | Get the record set of type 'PTR' within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/privateDnsZones/PTR/write | Create or update a record set of type 'PTR' within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/privateDnsZones/PTR/delete | Remove the record set of a given name and type 'PTR' from a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/recordsets/read | Gets Private DNS record sets across types |
> | Microsoft.Network/privateDnsZones/SOA/read | Get the record set of type 'SOA' within a Private DNS zone, in JSON format. |
> | Microsoft.Network/privateDnsZones/SOA/write | Update a record set of type 'SOA' within a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/SRV/read | Get the record set of type 'SRV' within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/privateDnsZones/SRV/write | Create or update a record set of type 'SRV' within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/privateDnsZones/SRV/delete | Remove the record set of a given name and type 'SRV' from a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/TXT/read | Get the record set of type 'TXT' within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/privateDnsZones/TXT/write | Create or update a record set of type 'TXT' within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/privateDnsZones/TXT/delete | Remove the record set of a given name and type 'TXT' from a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/virtualNetworkLinks/read | Get the Private DNS zone link to virtual network properties, in JSON format. |
> | Microsoft.Network/privateDnsZones/virtualNetworkLinks/write | Create or update a Private DNS zone link to virtual network. |
> | Microsoft.Network/privateDnsZones/virtualNetworkLinks/delete | Delete a Private DNS zone link to virtual network. |
> | Microsoft.Network/privateEndpointRedirectMaps/read | Gets a Private Endpoint RedirectMap |
> | Microsoft.Network/privateEndpointRedirectMaps/write | Creates Private Endpoint RedirectMap Or Updates An Existing Private Endpoint RedirectMap |
> | Microsoft.Network/privateEndpoints/read | Gets an private endpoint resource. |
> | Microsoft.Network/privateEndpoints/write | Creates a new private endpoint, or updates an existing private endpoint. |
> | Microsoft.Network/privateEndpoints/delete | Deletes an private endpoint resource. |
> | Microsoft.Network/privateEndpoints/privateDnsZoneGroups/read | Gets a Private DNS Zone Group |
> | Microsoft.Network/privateEndpoints/privateDnsZoneGroups/write | Puts a Private DNS Zone Group |
> | Microsoft.Network/privateLinkServices/read | Gets an private link service resource. |
> | Microsoft.Network/privateLinkServices/write | Creates a new private link service, or updates an existing private link service. |
> | Microsoft.Network/privateLinkServices/delete | Deletes an private link service resource. |
> | Microsoft.Network/privateLinkServices/privateEndpointConnections/read | Gets an private endpoint connection definition. |
> | Microsoft.Network/privateLinkServices/privateEndpointConnections/write | Creates a new private endpoint connection, or updates an existing private endpoint connection. |
> | Microsoft.Network/privateLinkServices/privateEndpointConnections/delete | Deletes an private endpoint connection. |
> | Microsoft.Network/publicIPAddresses/read | Gets a public ip address definition. |
> | Microsoft.Network/publicIPAddresses/write | Creates a public Ip address or updates an existing public Ip address.  |
> | Microsoft.Network/publicIPAddresses/delete | Deletes a public Ip address. |
> | Microsoft.Network/publicIPAddresses/join/action | Joins a public ip address. Not Alertable. |
> | Microsoft.Network/publicIPPrefixes/read | Gets a Public Ip Prefix Definition |
> | Microsoft.Network/publicIPPrefixes/write | Creates A Public Ip Prefix Or Updates An Existing Public Ip Prefix |
> | Microsoft.Network/publicIPPrefixes/delete | Deletes A Public Ip Prefix |
> | Microsoft.Network/publicIPPrefixes/join/action | Joins a PublicIPPrefix. Not alertable. |
> | Microsoft.Network/routeFilters/read | Gets a route filter definition |
> | Microsoft.Network/routeFilters/join/action | Joins a route filter. Not Alertable. |
> | Microsoft.Network/routeFilters/delete | Deletes a route filter definition |
> | Microsoft.Network/routeFilters/write | Creates a route filter or Updates an existing route filter |
> | Microsoft.Network/routeFilters/routeFilterRules/read | Gets a route filter rule definition |
> | Microsoft.Network/routeFilters/routeFilterRules/write | Creates a route filter rule or Updates an existing route filter rule |
> | Microsoft.Network/routeFilters/routeFilterRules/delete | Deletes a route filter rule definition |
> | Microsoft.Network/routeTables/read | Gets a route table definition |
> | Microsoft.Network/routeTables/write | Creates a route table or Updates an existing route table |
> | Microsoft.Network/routeTables/delete | Deletes a route table definition |
> | Microsoft.Network/routeTables/join/action | Joins a route table. Not Alertable. |
> | Microsoft.Network/routeTables/routes/read | Gets a route definition |
> | Microsoft.Network/routeTables/routes/write | Creates a route or Updates an existing route |
> | Microsoft.Network/routeTables/routes/delete | Deletes a route definition |
> | Microsoft.Network/securityPartnerProviders/read | Gets a SecurityPartnerProvider |
> | Microsoft.Network/securityPartnerProviders/write | Creates a SecurityPartnerProvider or Updates An Existing SecurityPartnerProvider |
> | Microsoft.Network/securityPartnerProviders/validate/action | Validates a SecurityPartnerProvider |
> | Microsoft.Network/securityPartnerProviders/updateReferences/action | Update references in a SecurityPartnerProvider |
> | Microsoft.Network/securityPartnerProviders/join/action | Joins a SecurityPartnerProvider. Not alertable. |
> | Microsoft.Network/securityPartnerProviders/delete | Deletes a SecurityPartnerProvider |
> | Microsoft.Network/serviceEndpointPolicies/read | Gets a Service Endpoint Policy Description |
> | Microsoft.Network/serviceEndpointPolicies/write | Creates a Service Endpoint Policy or updates an existing Service Endpoint Policy |
> | Microsoft.Network/serviceEndpointPolicies/delete | Deletes a Service Endpoint Policy |
> | Microsoft.Network/serviceEndpointPolicies/join/action | Joins a Service Endpoint Policy. Not alertable. |
> | Microsoft.Network/serviceEndpointPolicies/joinSubnet/action | Joins a Subnet To Service Endpoint Policies. Not alertable. |
> | Microsoft.Network/serviceEndpointPolicies/serviceEndpointPolicyDefinitions/read | Gets a Service Endpoint Policy Definition Description |
> | Microsoft.Network/serviceEndpointPolicies/serviceEndpointPolicyDefinitions/write | Creates a Service Endpoint Policy Definition or updates an existing Service Endpoint Policy Definition |
> | Microsoft.Network/serviceEndpointPolicies/serviceEndpointPolicyDefinitions/delete | Deletes a Service Endpoint Policy Definition |
> | Microsoft.Network/trafficManagerGeographicHierarchies/read | Gets the Traffic Manager Geographic Hierarchy containing regions which can be used with the Geographic traffic routing method |
> | Microsoft.Network/trafficManagerProfiles/read | Get the Traffic Manager profile configuration. This includes DNS settings, traffic routing settings, endpoint monitoring settings, and the list of endpoints routed by this Traffic Manager profile. |
> | Microsoft.Network/trafficManagerProfiles/write | Create a Traffic Manager profile, or modify the configuration of an existing Traffic Manager profile.<br>This includes enabling or disabling a profile and modifying DNS settings, traffic routing settings, or endpoint monitoring settings.<br>Endpoints routed by the Traffic Manager profile can be added, removed, enabled or disabled. |
> | Microsoft.Network/trafficManagerProfiles/delete | Delete the Traffic Manager profile. All settings associated with the Traffic Manager profile will be lost, and the profile can no longer be used to route traffic. |
> | Microsoft.Network/trafficManagerProfiles/azureEndpoints/read | Gets an Azure Endpoint which belongs to a Traffic Manager Profile, including all the properties of that Azure Endpoint. |
> | Microsoft.Network/trafficManagerProfiles/azureEndpoints/write | Add a new Azure Endpoint in an existing Traffic Manager Profile or update the properties of an existing Azure Endpoint in that Traffic Manager Profile. |
> | Microsoft.Network/trafficManagerProfiles/azureEndpoints/delete | Deletes an Azure Endpoint from an existing Traffic Manager Profile. Traffic Manager will stop routing traffic to the deleted Azure Endpoint. |
> | Microsoft.Network/trafficManagerProfiles/externalEndpoints/read | Gets an External Endpoint which belongs to a Traffic Manager Profile, including all the properties of that External Endpoint. |
> | Microsoft.Network/trafficManagerProfiles/externalEndpoints/write | Add a new External Endpoint in an existing Traffic Manager Profile or update the properties of an existing External Endpoint in that Traffic Manager Profile. |
> | Microsoft.Network/trafficManagerProfiles/externalEndpoints/delete | Deletes an External Endpoint from an existing Traffic Manager Profile. Traffic Manager will stop routing traffic to the deleted External Endpoint. |
> | Microsoft.Network/trafficManagerProfiles/heatMaps/read | Gets the Traffic Manager Heat Map for the given Traffic Manager profile which contains query counts and latency data by location and source IP. |
> | Microsoft.Network/trafficManagerProfiles/nestedEndpoints/read | Gets an Nested Endpoint which belongs to a Traffic Manager Profile, including all the properties of that Nested Endpoint. |
> | Microsoft.Network/trafficManagerProfiles/nestedEndpoints/write | Add a new Nested Endpoint in an existing Traffic Manager Profile or update the properties of an existing Nested Endpoint in that Traffic Manager Profile. |
> | Microsoft.Network/trafficManagerProfiles/nestedEndpoints/delete | Deletes an Nested Endpoint from an existing Traffic Manager Profile. Traffic Manager will stop routing traffic to the deleted Nested Endpoint. |
> | Microsoft.Network/trafficManagerUserMetricsKeys/read | Gets the subscription-level key used for Realtime User Metrics collection. |
> | Microsoft.Network/trafficManagerUserMetricsKeys/write | Creates a new subscription-level key to be used for Realtime User Metrics collection. |
> | Microsoft.Network/trafficManagerUserMetricsKeys/delete | Deletes the subscription-level key used for Realtime User Metrics collection. |
> | Microsoft.Network/virtualHubs/delete | Deletes a Virtual Hub |
> | Microsoft.Network/virtualHubs/read | Get a Virtual Hub |
> | Microsoft.Network/virtualHubs/write | Create or update a Virtual Hub |
> | Microsoft.Network/virtualHubs/effectiveRoutes/action | Gets effective route configured on Virtual Hub |
> | Microsoft.Network/virtualHubs/hubVirtualNetworkConnections/read | Get a HubVirtualNetworkConnection |
> | Microsoft.Network/virtualHubs/hubVirtualNetworkConnections/write | Create or update a HubVirtualNetworkConnection |
> | Microsoft.Network/virtualHubs/hubVirtualNetworkConnections/delete | Deletes a HubVirtualNetworkConnection |
> | Microsoft.Network/virtualHubs/routeTables/read | Get a VirtualHubRouteTableV2 |
> | Microsoft.Network/virtualHubs/routeTables/write | Create or Update a VirtualHubRouteTableV2 |
> | Microsoft.Network/virtualHubs/routeTables/delete | Delete a VirtualHubRouteTableV2 |
> | Microsoft.Network/virtualnetworkgateways/supportedvpndevices/action | Lists Supported Vpn Devices |
> | Microsoft.Network/virtualNetworkGateways/read | Gets a VirtualNetworkGateway |
> | Microsoft.Network/virtualNetworkGateways/write | Creates or updates a VirtualNetworkGateway |
> | Microsoft.Network/virtualNetworkGateways/delete | Deletes a virtualNetworkGateway |
> | microsoft.network/virtualnetworkgateways/generatevpnclientpackage/action | Generate VpnClient package for virtualNetworkGateway |
> | microsoft.network/virtualnetworkgateways/generatevpnprofile/action | Generate VpnProfile package for VirtualNetworkGateway |
> | microsoft.network/virtualnetworkgateways/getvpnclientconnectionhealth/action | Get Per Vpn Client Connection Health for VirtualNetworkGateway |
> | microsoft.network/virtualnetworkgateways/disconnectvirtualnetworkgatewayvpnconnections/action | Disconnect virtual network gateway vpn connections |
> | microsoft.network/virtualnetworkgateways/getvpnprofilepackageurl/action | Gets the URL of a pre-generated vpn client profile package |
> | microsoft.network/virtualnetworkgateways/setvpnclientipsecparameters/action | Set Vpnclient Ipsec parameters for VirtualNetworkGateway P2S client. |
> | microsoft.network/virtualnetworkgateways/getvpnclientipsecparameters/action | Get Vpnclient Ipsec parameters for VirtualNetworkGateway P2S client. |
> | microsoft.network/virtualnetworkgateways/resetvpnclientsharedkey/action | Reset Vpnclient shared key for VirtualNetworkGateway P2S client. |
> | microsoft.network/virtualnetworkgateways/reset/action | Resets a virtualNetworkGateway |
> | microsoft.network/virtualnetworkgateways/getadvertisedroutes/action | Gets virtualNetworkGateway advertised routes |
> | microsoft.network/virtualnetworkgateways/getbgppeerstatus/action | Gets virtualNetworkGateway bgp peer status |
> | microsoft.network/virtualnetworkgateways/getlearnedroutes/action | Gets virtualnetworkgateway learned routes |
> | microsoft.network/virtualnetworkgateways/startpacketcapture/action | Starts a Virtual Network Gateway Packet Capture. |
> | microsoft.network/virtualnetworkgateways/stoppacketcapture/action | Stops a Virtual Network Gateway Packet Capture. |
> | microsoft.network/virtualnetworkgateways/connections/read | Get VirtualNetworkGatewayConnection |
> | Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
> | Microsoft.Network/virtualNetworks/write | Creates a virtual network or updates an existing virtual network |
> | Microsoft.Network/virtualNetworks/delete | Deletes a virtual network |
> | Microsoft.Network/virtualNetworks/joinLoadBalancer/action | Joins a load balancer to virtual networks |
> | Microsoft.Network/virtualNetworks/peer/action | Peers a virtual network with another virtual network |
> | Microsoft.Network/virtualNetworks/join/action | Joins a virtual network. Not Alertable. |
> | Microsoft.Network/virtualNetworks/BastionHosts/action | Gets Bastion Host references in a Virtual Network. |
> | Microsoft.Network/virtualNetworks/bastionHosts/default/action | Gets Bastion Host references in a Virtual Network. |
> | Microsoft.Network/virtualNetworks/checkIpAddressAvailability/read | Check if Ip Address is available at the specified virtual network |
> | Microsoft.Network/virtualNetworks/subnets/read | Gets a virtual network subnet definition |
> | Microsoft.Network/virtualNetworks/subnets/write | Creates a virtual network subnet or updates an existing virtual network subnet |
> | Microsoft.Network/virtualNetworks/subnets/delete | Deletes a virtual network subnet |
> | Microsoft.Network/virtualNetworks/subnets/join/action | Joins a virtual network. Not Alertable. |
> | Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action | Joins resource such as storage account or SQL database to a subnet. Not alertable. |
> | Microsoft.Network/virtualNetworks/subnets/prepareNetworkPolicies/action | Prepares a subnet by applying necessary Network Policies |
> | Microsoft.Network/virtualNetworks/subnets/unprepareNetworkPolicies/action | Unprepare a subnet by removing the applied Network Policies |
> | Microsoft.Network/virtualNetworks/subnets/contextualServiceEndpointPolicies/read | Gets Contextual Service Endpoint Policies |
> | Microsoft.Network/virtualNetworks/subnets/contextualServiceEndpointPolicies/write | Creates a Contextual Service Endpoint Policy or updates an existing Contextual Service Endpoint Policy |
> | Microsoft.Network/virtualNetworks/subnets/contextualServiceEndpointPolicies/delete | Deletes A Contextual Service Endpoint Policy |
> | Microsoft.Network/virtualNetworks/subnets/virtualMachines/read | Gets references to all the virtual machines in a virtual network subnet |
> | Microsoft.Network/virtualNetworks/usages/read | Get the IP usages for each subnet of the virtual network |
> | Microsoft.Network/virtualNetworks/virtualMachines/read | Gets references to all the virtual machines in a virtual network |
> | Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read | Gets a virtual network peering definition |
> | Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write | Creates a virtual network peering or updates an existing virtual network peering |
> | Microsoft.Network/virtualNetworks/virtualNetworkPeerings/delete | Deletes a virtual network peering |
> | Microsoft.Network/virtualNetworkTaps/read | Get Virtual Network Tap |
> | Microsoft.Network/virtualNetworkTaps/join/action | Joins a virtual network tap. Not Alertable. |
> | Microsoft.Network/virtualNetworkTaps/delete | Delete Virtual Network Tap |
> | Microsoft.Network/virtualNetworkTaps/write | Create or Update Virtual Network Tap |
> | Microsoft.Network/virtualRouters/read | Gets A VirtualRouter |
> | Microsoft.Network/virtualRouters/write | Creates A VirtualRouter or Updates An Existing VirtualRouter |
> | Microsoft.Network/virtualRouters/delete | Deletes A VirtualRouter |
> | Microsoft.Network/virtualRouters/join/action | Joins A VirtualRouter. Not alertable. |
> | Microsoft.Network/virtualRouters/peerings/read | Gets A VirtualRouterPeering |
> | Microsoft.Network/virtualRouters/peerings/write | Creates A VirtualRouterPeering or Updates An Existing VirtualRouterPeering |
> | Microsoft.Network/virtualRouters/peerings/delete | Deletes A VirtualRouterPeering |
> | Microsoft.Network/virtualWans/delete | Deletes a Virtual Wan |
> | Microsoft.Network/virtualWans/read | Get a Virtual Wan |
> | Microsoft.Network/virtualWans/write | Create or update a Virtual Wan |
> | Microsoft.Network/virtualwans/vpnconfiguration/action | Gets a Vpn Configuration |
> | Microsoft.Network/virtualwans/vpnServerConfigurations/action | Get VirtualWanVpnServerConfigurations |
> | Microsoft.Network/virtualwans/generateVpnProfile/action | Generate VirtualWanVpnServerConfiguration VpnProfile |
> | Microsoft.Network/virtualWans/p2sVpnServerConfigurations/read | Gets a virtual Wan P2SVpnServerConfiguration |
> | Microsoft.network/virtualWans/p2sVpnServerConfigurations/write | Creates a virtual Wan P2SVpnServerConfiguration or updates an existing virtual Wan P2SVpnServerConfiguration |
> | Microsoft.network/virtualWans/p2sVpnServerConfigurations/delete | Deletes a virtual Wan P2SVpnServerConfiguration |
> | Microsoft.Network/virtualwans/supportedSecurityProviders/read | Gets supported VirtualWan Security Providers. |
> | Microsoft.Network/virtualWans/virtualHubs/read | Gets all Virtual Hubs that reference a Virtual Wan. |
> | Microsoft.Network/virtualWans/vpnSites/read | Gets all VPN Sites that reference a Virtual Wan. |
> | Microsoft.Network/vpnGateways/read | Gets a VpnGateway. |
> | Microsoft.Network/vpnGateways/write | Puts a VpnGateway. |
> | Microsoft.Network/vpnGateways/delete | Deletes a VpnGateway. |
> | microsoft.network/vpngateways/reset/action | Resets a VpnGateway |
> | microsoft.network/vpngateways/listvpnconnectionshealth/action | Gets connection health for all or a subset of connections on a VpnGateway |
> | microsoft.network/vpnGateways/vpnConnections/read | Gets a VpnConnection. |
> | microsoft.network/vpnGateways/vpnConnections/write | Puts a VpnConnection. |
> | microsoft.network/vpnGateways/vpnConnections/delete | Deletes a VpnConnection. |
> | microsoft.network/vpnGateways/vpnConnections/vpnLinkConnections/read | Gets a Vpn Link Connection |
> | Microsoft.Network/vpnServerConfigurations/read | Get VpnServerConfiguration |
> | Microsoft.Network/vpnServerConfigurations/write | Create or Update VpnServerConfiguration |
> | Microsoft.Network/vpnServerConfigurations/delete | Delete VpnServerConfiguration |
> | Microsoft.Network/vpnsites/read | Gets a Vpn Site resource. |
> | Microsoft.Network/vpnsites/write | Creates or updates a Vpn Site resource. |
> | Microsoft.Network/vpnsites/delete | Deletes a Vpn Site resource. |
> | microsoft.network/vpnSites/vpnSiteLinks/read | Gets a Vpn Site Link |

## Storage

### Microsoft.ClassicStorage

Azure service: Classic deployment model storage

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ClassicStorage/register/action | Register to Classic Storage |
> | Microsoft.ClassicStorage/checkStorageAccountAvailability/action | Checks for the availability of a storage account. |
> | Microsoft.ClassicStorage/capabilities/read | Shows the capabilities |
> | Microsoft.ClassicStorage/checkStorageAccountAvailability/read | Get the availability of a storage account. |
> | Microsoft.ClassicStorage/disks/read | Returns the storage account disk. |
> | Microsoft.ClassicStorage/images/read | Returns the image. |
> | Microsoft.ClassicStorage/images/operationstatuses/read | Gets Image Operation Status. |
> | Microsoft.ClassicStorage/operations/read | Gets classic storage operations |
> | Microsoft.ClassicStorage/osImages/read | Returns the operating system image. |
> | Microsoft.ClassicStorage/osPlatformImages/read | Gets the operating system platform image. |
> | Microsoft.ClassicStorage/publicImages/read | Gets the public virtual machine image. |
> | Microsoft.ClassicStorage/quotas/read | Get the quota for the subscription. |
> | Microsoft.ClassicStorage/storageAccounts/read | Return the storage account with the given account. |
> | Microsoft.ClassicStorage/storageAccounts/write | Adds a new storage account. |
> | Microsoft.ClassicStorage/storageAccounts/delete | Delete the storage account. |
> | Microsoft.ClassicStorage/storageAccounts/listKeys/action | Lists the access keys for the storage accounts. |
> | Microsoft.ClassicStorage/storageAccounts/regenerateKey/action | Regenerates the existing access keys for the storage account. |
> | Microsoft.ClassicStorage/storageAccounts/validateMigration/action | Validates migration of a storage account. |
> | Microsoft.ClassicStorage/storageAccounts/prepareMigration/action | Prepares migration of a storage account. |
> | Microsoft.ClassicStorage/storageAccounts/commitMigration/action | Commits migration of a storage account. |
> | Microsoft.ClassicStorage/storageAccounts/abortMigration/action | Aborts migration of a storage account. |
> | Microsoft.ClassicStorage/storageAccounts/blobServices/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/blobServices/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/blobServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Microsoft.ClassicStorage/storageAccounts/disks/read | Returns the storage account disk. |
> | Microsoft.ClassicStorage/storageAccounts/disks/write | Adds a storage account disk. |
> | Microsoft.ClassicStorage/storageAccounts/disks/delete | Deletes a given storage account  disk. |
> | Microsoft.ClassicStorage/storageAccounts/disks/operationStatuses/read | Reads the operation status for the resource. |
> | Microsoft.ClassicStorage/storageAccounts/fileServices/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/fileServices/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/fileServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Microsoft.ClassicStorage/storageAccounts/images/read | Returns the storage account image. (Deprecated. Use 'Microsoft.ClassicStorage/storageAccounts/vmImages') |
> | Microsoft.ClassicStorage/storageAccounts/images/delete | Deletes a given storage account image. (Deprecated. Use 'Microsoft.ClassicStorage/storageAccounts/vmImages') |
> | Microsoft.ClassicStorage/storageAccounts/images/operationstatuses/read | Returns the storage account image operation status. |
> | Microsoft.ClassicStorage/storageAccounts/operationStatuses/read | Reads the operation status for the resource. |
> | Microsoft.ClassicStorage/storageAccounts/osImages/read | Returns the storage account operating system image. |
> | Microsoft.ClassicStorage/storageAccounts/osImages/write | Adds a given storage account operating system image. |
> | Microsoft.ClassicStorage/storageAccounts/osImages/delete | Deletes a given storage account operating system image. |
> | Microsoft.ClassicStorage/storageAccounts/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Microsoft.ClassicStorage/storageAccounts/queueServices/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/queueServices/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/queueServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Microsoft.ClassicStorage/storageAccounts/services/read | Get the available services. |
> | Microsoft.ClassicStorage/storageAccounts/services/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/services/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/services/metricDefinitions/read | Gets the metrics definitions. |
> | Microsoft.ClassicStorage/storageAccounts/services/metrics/read | Gets the metrics. |
> | Microsoft.ClassicStorage/storageAccounts/tableServices/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/tableServices/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicStorage/storageAccounts/tableServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Microsoft.ClassicStorage/storageAccounts/vmImages/read | Returns the virtual machine image. |
> | Microsoft.ClassicStorage/storageAccounts/vmImages/write | Adds a given virtual machine image. |
> | Microsoft.ClassicStorage/storageAccounts/vmImages/delete | Deletes a given virtual machine image. |
> | Microsoft.ClassicStorage/storageAccounts/vmImages/operationstatuses/read | Gets a given virtual machine image operation status. |
> | Microsoft.ClassicStorage/vmImages/read | Lists virtual machine images. |

### Microsoft.DataBox

Azure service: [Azure Data Box](../databox-family/index.md)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DataBox/register/action | Register Provider Microsoft.Databox |
> | Microsoft.DataBox/unregister/action | Un-Register Provider Microsoft.Databox |
> | Microsoft.DataBox/jobs/cancel/action | Cancels an order in progress. |
> | Microsoft.DataBox/jobs/bookShipmentPickUp/action | Allows to book a pick up for return shipments. |
> | Microsoft.DataBox/jobs/read | List or get the Orders |
> | Microsoft.DataBox/jobs/delete | Delete the Orders |
> | Microsoft.DataBox/jobs/write | Create or update the Orders |
> | Microsoft.DataBox/jobs/listCredentials/action | Lists the unencrypted credentials related to the order. |
> | Microsoft.DataBox/locations/validateInputs/action | This method does all type of validations. |
> | Microsoft.DataBox/locations/validateAddress/action | Validates the shipping address and provides alternate addresses if any. |
> | Microsoft.DataBox/locations/availableSkus/action | This method returns the list of available skus. |
> | Microsoft.DataBox/locations/regionConfiguration/action | This method returns the configurations for the region. |
> | Microsoft.DataBox/locations/availableSkus/read | List or get the Available Skus |
> | Microsoft.DataBox/locations/operationResults/read | List or get the Operation Results |
> | Microsoft.DataBox/operations/read | List or get the Operations |
> | Microsoft.DataBox/subscriptions/resourceGroups/moveResources/action | This method performs the resource move. |
> | Microsoft.DataBox/subscriptions/resourceGroups/validateMoveResources/action | This method validates whether resource move is allowed or not. |

### Microsoft.ImportExport

Azure service: [Azure Import/Export](../storage/common/storage-import-export-service.md)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ImportExport/register/action | Registers the subscription for the import/export resource provider and enables the creation of import/export jobs. |
> | Microsoft.ImportExport/jobs/write | Creates a job with the specified parameters or update the properties or tags for the specified job. |
> | Microsoft.ImportExport/jobs/read | Gets the properties for the specified job or returns the list of jobs. |
> | Microsoft.ImportExport/jobs/listBitLockerKeys/action | Gets the BitLocker keys for the specified job. |
> | Microsoft.ImportExport/jobs/delete | Deletes an existing job. |
> | Microsoft.ImportExport/locations/read | Gets the properties for the specified location or returns the list of locations. |
> | Microsoft.ImportExport/operations/read | Gets the operations supported by the Resource Provider. |

### Microsoft.NetApp

Azure service: [Azure NetApp Files](../azure-netapp-files/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.NetApp/register/action | Subscription Registration Action |
> | Microsoft.NetApp/unregister/action | Unregisters Subscription with Microsoft.NetApp resource provider |
> | Microsoft.NetApp/locations/read | Reads an availability check resource. |
> | Microsoft.NetApp/locations/checknameavailability/action | Check if resource name is available |
> | Microsoft.NetApp/locations/checkfilepathavailability/action | Check if file path is available |
> | Microsoft.NetApp/locations/operationresults/read | Reads an operation result resource. |
> | Microsoft.NetApp/netAppAccounts/read | Reads an account resource. |
> | Microsoft.NetApp/netAppAccounts/write | Writes an account resource. |
> | Microsoft.NetApp/netAppAccounts/delete | Deletes an account resource. |
> | Microsoft.NetApp/netAppAccounts/accountBackups/read | Reads an account backup resource. |
> | Microsoft.NetApp/netAppAccounts/accountBackups/write | Writes an account backup resource. |
> | Microsoft.NetApp/netAppAccounts/accountBackups/delete | Deletes an account backup resource. |
> | Microsoft.NetApp/netAppAccounts/backupPolicies/read | Reads a backup policy resource. |
> | Microsoft.NetApp/netAppAccounts/backupPolicies/write | Writes a backup policy resource. |
> | Microsoft.NetApp/netAppAccounts/backupPolicies/delete | Deletes a backup policy resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/read | Reads a pool resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/write | Writes a pool resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/delete | Deletes a pool resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/read | Reads a volume resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/write | Writes a volume resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/delete | Deletes a volume resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/Revert/action | Revert volume to specific snapshot |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/BreakReplication/action | Break volume replication relations |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/ReplicationStatus/action | Reads the statuses of the Volume Replication. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/ReInitializeReplication/action |  |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/AuthorizeReplication/action | Authorize the source volume replication |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/ResyncReplication/action | Resync the replication on the destination volume |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/DeleteReplication/action | Delete the replication on the destination volume |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/backups/read | Reads a backup resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/backups/write | Writes a backup resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/backups/delete | Deletes a backup resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/MountTargets/read | Reads a mount target resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/ReplicationStatus/read | Reads the statuses of the Volume Replication. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots/read | Reads a snapshot resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots/write | Writes a snapshot resource. |
> | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots/delete | Deletes a snapshot resource. |
> | Microsoft.NetApp/netAppAccounts/snapshotPolicies/read | Reads a snapshot policy resource. |
> | Microsoft.NetApp/netAppAccounts/snapshotPolicies/write | Writes a snapshot policy resource. |
> | Microsoft.NetApp/netAppAccounts/snapshotPolicies/delete | Deletes a snapshot policy resource. |
> | Microsoft.NetApp/netAppAccounts/snapshotPolicies/ListVolumes/action | List volumes connected to snapshot policy |
> | Microsoft.NetApp/netAppAccounts/vaults/read | Reads a vault resource. |
> | Microsoft.NetApp/Operations/read | Reads an operation resources. |

### Microsoft.Storage

Azure service: [Storage](../storage/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Storage/register/action | Registers the subscription for the storage resource provider and enables the creation of storage accounts. |
> | Microsoft.Storage/checknameavailability/read | Checks that account name is valid and is not in use. |
> | Microsoft.Storage/locations/deleteVirtualNetworkOrSubnets/action | Notifies Microsoft.Storage that virtual network or subnet is being deleted |
> | Microsoft.Storage/locations/checknameavailability/read | Checks that account name is valid and is not in use. |
> | Microsoft.Storage/locations/usages/read | Returns the limit and the current usage count for resources in the specified subscription |
> | Microsoft.Storage/operations/read | Polls the status of an asynchronous operation. |
> | Microsoft.Storage/skus/read | Lists the Skus supported by Microsoft.Storage. |
> | Microsoft.Storage/storageAccounts/restoreBlobRanges/action | Restore blob ranges to the state of the specified time |
> | Microsoft.Storage/storageAccounts/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | Microsoft.Storage/storageAccounts/failover/action | Customer is able to control the failover in case of availability issues |
> | Microsoft.Storage/storageAccounts/listkeys/action | Returns the access keys for the specified storage account. |
> | Microsoft.Storage/storageAccounts/regeneratekey/action | Regenerates the access keys for the specified storage account. |
> | Microsoft.Storage/storageAccounts/revokeUserDelegationKeys/action | Revokes all the user delegation keys for the specified storage account. |
> | Microsoft.Storage/storageAccounts/delete | Deletes an existing storage account. |
> | Microsoft.Storage/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | Microsoft.Storage/storageAccounts/listAccountSas/action | Returns the Account SAS token for the specified storage account. |
> | Microsoft.Storage/storageAccounts/listServiceSas/action | Returns the Service SAS token for the specified storage account. |
> | Microsoft.Storage/storageAccounts/write | Creates a storage account with the specified parameters or update the properties or tags or adds custom domain for the specified storage account. |
> | Microsoft.Storage/storageAccounts/blobServices/read |  |
> | Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action | Returns a user delegation key for the blob service |
> | Microsoft.Storage/storageAccounts/blobServices/write | Returns the result of put blob service properties |
> | Microsoft.Storage/storageAccounts/blobServices/read | Returns blob service properties or statistics |
> | Microsoft.Storage/storageAccounts/blobServices/containers/write | Returns the result of patch blob container |
> | Microsoft.Storage/storageAccounts/blobServices/containers/delete | Returns the result of deleting a container |
> | Microsoft.Storage/storageAccounts/blobServices/containers/read | Returns a container |
> | Microsoft.Storage/storageAccounts/blobServices/containers/read | Returns list of containers |
> | Microsoft.Storage/storageAccounts/blobServices/containers/lease/action | Returns the result of leasing blob container |
> | Microsoft.Storage/storageAccounts/blobServices/containers/write | Returns the result of put blob container |
> | Microsoft.Storage/storageAccounts/blobServices/containers/clearLegalHold/action | Clear blob container legal hold |
> | Microsoft.Storage/storageAccounts/blobServices/containers/setLegalHold/action | Set blob container legal hold |
> | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/extend/action | Extend blob container immutability policy |
> | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/delete | Delete blob container immutability policy |
> | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/write | Put blob container immutability policy |
> | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/lock/action | Lock blob container immutability policy |
> | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/read | Get blob container immutability policy |
> | Microsoft.Storage/storageAccounts/dataSharePolicies/delete |  |
> | Microsoft.Storage/storageAccounts/dataSharePolicies/read |  |
> | Microsoft.Storage/storageAccounts/dataSharePolicies/read |  |
> | Microsoft.Storage/storageAccounts/dataSharePolicies/write |  |
> | Microsoft.Storage/storageAccounts/encryptionScopes/read |  |
> | Microsoft.Storage/storageAccounts/encryptionScopes/read |  |
> | Microsoft.Storage/storageAccounts/encryptionScopes/write |  |
> | Microsoft.Storage/storageAccounts/encryptionScopes/write |  |
> | Microsoft.Storage/storageAccounts/fileServices/shares/action |  |
> | Microsoft.Storage/storageAccounts/fileServices/read |  |
> | Microsoft.Storage/storageAccounts/fileServices/write |  |
> | Microsoft.Storage/storageAccounts/fileServices/read | Get file service properties |
> | Microsoft.Storage/storageAccounts/fileServices/shares/delete |  |
> | Microsoft.Storage/storageAccounts/fileServices/shares/read |  |
> | Microsoft.Storage/storageAccounts/fileServices/shares/read |  |
> | Microsoft.Storage/storageAccounts/fileServices/shares/write |  |
> | Microsoft.Storage/storageAccounts/localUsers/delete |  |
> | Microsoft.Storage/storageAccounts/localusers/listKeys/action |  |
> | Microsoft.Storage/storageAccounts/localusers/read |  |
> | Microsoft.Storage/storageAccounts/localusers/read |  |
> | Microsoft.Storage/storageAccounts/localusers/write |  |
> | Microsoft.Storage/storageAccounts/managementPolicies/delete | Delete storage account management policies |
> | Microsoft.Storage/storageAccounts/managementPolicies/read | Get storage management account policies |
> | Microsoft.Storage/storageAccounts/managementPolicies/write | Put storage account management policies |
> | Microsoft.Storage/storageAccounts/objectReplicationPolicies/delete |  |
> | Microsoft.Storage/storageAccounts/objectReplicationPolicies/read |  |
> | Microsoft.Storage/storageAccounts/objectReplicationPolicies/read |  |
> | Microsoft.Storage/storageAccounts/objectReplicationPolicies/write |  |
> | Microsoft.Storage/storageAccounts/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.Storage/storageAccounts/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxies |
> | Microsoft.Storage/storageAccounts/privateEndpointConnectionProxies/write | Put Private Endpoint Connection Proxies |
> | Microsoft.Storage/storageAccounts/privateEndpointConnections/read | List Private Endpoint Connections |
> | Microsoft.Storage/storageAccounts/privateEndpointConnections/delete | Delete Private Endpoint Connection |
> | Microsoft.Storage/storageAccounts/privateEndpointConnections/read | Get Private Endpoint Connection |
> | Microsoft.Storage/storageAccounts/privateEndpointConnections/write | Put Private Endpoint Connection |
> | Microsoft.Storage/storageAccounts/privateLinkResources/read | Get StorageAccount groupids |
> | Microsoft.Storage/storageAccounts/queueServices/read | Get Queue service properties |
> | Microsoft.Storage/storageAccounts/queueServices/read | Returns queue service properties or statistics. |
> | Microsoft.Storage/storageAccounts/queueServices/write | Returns the result of setting queue service properties |
> | Microsoft.Storage/storageAccounts/queueServices/queues/read | Returns a queue or a list of queues. |
> | Microsoft.Storage/storageAccounts/queueServices/queues/write | Returns the result of writing a queue |
> | Microsoft.Storage/storageAccounts/queueServices/queues/delete | Returns the result of deleting a queue |
> | Microsoft.Storage/storageAccounts/services/diagnosticSettings/write | Create/Update storage account diagnostic settings. |
> | Microsoft.Storage/storageAccounts/tableServices/read | Get Table service properties |
> | Microsoft.Storage/usages/read | Returns the limit and the current usage count for resources in the specified subscription |
> | **DataAction** | **Description** |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read | Returns a blob or a list of blobs |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write | Returns the result of writing a blob |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete | Returns the result of deleting a blob |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/deleteBlobVersion/action | Returns the result of deleting a blob version |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action | Returns the result of adding blob content |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/filter/action | Returns the list of blobs under an account with matching tags filter |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action | Moves the blob from one path to another |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/manageOwnership/action | Changes ownership of the blob |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/modifyPermissions/action | Modifies permissions of the blob |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action | Returns the result of the blob command |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read | Returns the result of reading blob tags |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write | Returns the result of writing blob tags |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/read | Returns a file/folder or a list of files/folders |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/write | Returns the result of writing a file or creating a folder |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/delete | Returns the result of deleting a file/folder |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/modifypermissions/action | Returns the result of modifying permission on a file/folder |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/actassuperuser/action | Get File Admin Privileges |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/read | Returns a message |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/write | Returns the result of writing a message |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/delete | Returns the result of deleting a message |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/add/action | Returns the result of adding a message |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/process/action | Returns the result of processing a message |

### microsoft.storagesync

Azure service: [Storage](../storage/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | microsoft.storagesync/register/action | Registers the subscription for the Storage Sync Provider |
> | microsoft.storagesync/unregister/action | Unregisters the subscription for the Storage Sync Provider |
> | microsoft.storagesync/locations/checkNameAvailability/action | Checks that storage sync service name is valid and is not in use. |
> | microsoft.storagesync/locations/workflows/operations/read | Gets the status of an asynchronous operation |
> | microsoft.storagesync/operations/read | Gets a list of the Supported Operations |
> | microsoft.storagesync/storageSyncServices/read | Read any Storage Sync Services |
> | microsoft.storagesync/storageSyncServices/write | Create or Update any Storage Sync Services |
> | microsoft.storagesync/storageSyncServices/delete | Delete any Storage Sync Services |
> | microsoft.storagesync/storageSyncServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Storage Sync Services |
> | microsoft.storagesync/storageSyncServices/registeredServers/read | Read any Registered Server |
> | microsoft.storagesync/storageSyncServices/registeredServers/write | Create or Update any Registered Server |
> | microsoft.storagesync/storageSyncServices/registeredServers/delete | Delete any Registered Server |
> | microsoft.storagesync/storageSyncServices/registeredServers/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Registered Server |
> | microsoft.storagesync/storageSyncServices/syncGroups/read | Read any Sync Groups |
> | microsoft.storagesync/storageSyncServices/syncGroups/write | Create or Update any Sync Groups |
> | microsoft.storagesync/storageSyncServices/syncGroups/delete | Delete any Sync Groups |
> | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/read | Read any Cloud Endpoints |
> | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/write | Create or Update any Cloud Endpoints |
> | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/delete | Delete any Cloud Endpoints |
> | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/prebackup/action | Call this action before backup |
> | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/postbackup/action | Call this action after backup |
> | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/prerestore/action | Call this action before restore |
> | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/postrestore/action | Call this action after restore |
> | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/restoreheartbeat/action | Restore heartbeat |
> | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/triggerChangeDetection/action | Call this action to trigger detection of changes on a cloud endpoint's file share |
> | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/operationresults/read | Gets the status of an asynchronous backup/restore operation |
> | microsoft.storagesync/storageSyncServices/syncGroups/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Sync Groups |
> | microsoft.storagesync/storageSyncServices/syncGroups/serverEndpoints/read | Read any Server Endpoints |
> | microsoft.storagesync/storageSyncServices/syncGroups/serverEndpoints/write | Create or Update any Server Endpoints |
> | microsoft.storagesync/storageSyncServices/syncGroups/serverEndpoints/delete | Delete any Server Endpoints |
> | microsoft.storagesync/storageSyncServices/syncGroups/serverEndpoints/recallAction/action | Call this action to recall files to a server |
> | microsoft.storagesync/storageSyncServices/syncGroups/serverEndpoints/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Server Endpoints |
> | microsoft.storagesync/storageSyncServices/workflows/read | Read Workflows |
> | microsoft.storagesync/storageSyncServices/workflows/operationresults/read | Gets the status of an asynchronous operation |
> | microsoft.storagesync/storageSyncServices/workflows/operations/read | Gets the status of an asynchronous operation |

### Microsoft.StorSimple

Azure service: [StorSimple](../storsimple/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.StorSimple/register/action | Register Provider Microsoft.StorSimple |
> | Microsoft.StorSimple/managers/clearAlerts/action | Clear all the alerts associated with the device manager. |
> | Microsoft.StorSimple/managers/getEncryptionKey/action | Get encryption key for the device manager. |
> | Microsoft.StorSimple/managers/read | Lists or gets the Device Managers |
> | Microsoft.StorSimple/managers/delete | Deletes the Device Managers |
> | Microsoft.StorSimple/managers/write | Create or update the Device Managers |
> | Microsoft.StorSimple/managers/configureDevice/action | Configures a device |
> | Microsoft.StorSimple/managers/migrateClassicToResourceManager/action | Migrate from Classic to Resource Manager |
> | Microsoft.StorSimple/managers/listActivationKey/action | Gets the activation key of the StorSimple Device Manager. |
> | Microsoft.StorSimple/managers/regenerateActivationKey/action | Regenerate the Activation key for an existing StorSimple Device Manager. |
> | Microsoft.StorSimple/managers/listPublicEncryptionKey/action | List public encryption keys of a StorSimple Device Manager. |
> | Microsoft.StorSimple/managers/provisionCloudAppliance/action | Create a new cloud appliance. |
> | Microsoft.StorSimple/Managers/write | Create Vault operation creates an Azure resource of type 'vault' |
> | Microsoft.StorSimple/Managers/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | Microsoft.StorSimple/Managers/delete | The Delete Vault operation deletes the specified Azure resource of type 'vault' |
> | Microsoft.StorSimple/managers/accessControlRecords/read | Lists or gets the Access Control Records |
> | Microsoft.StorSimple/managers/accessControlRecords/write | Create or update the Access Control Records |
> | Microsoft.StorSimple/managers/accessControlRecords/delete | Deletes the Access Control Records |
> | Microsoft.StorSimple/managers/accessControlRecords/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/managers/alerts/read | Lists or gets the Alerts |
> | Microsoft.StorSimple/managers/backups/read | Lists or gets the Backup Set |
> | Microsoft.StorSimple/managers/bandwidthSettings/read | List the Bandwidth Settings (8000 Series Only) |
> | Microsoft.StorSimple/managers/bandwidthSettings/write | Creates a new or updates Bandwidth Settings (8000 Series Only) |
> | Microsoft.StorSimple/managers/bandwidthSettings/delete | Deletes an existing Bandwidth Settings (8000 Series Only) |
> | Microsoft.StorSimple/managers/bandwidthSettings/operationResults/read | List the Operation Results |
> | Microsoft.StorSimple/managers/certificates/write | Create or update the Certificates |
> | Microsoft.StorSimple/Managers/certificates/write | The Update Resource Certificate operation updates the resource/vault credential certificate. |
> | Microsoft.StorSimple/managers/cloudApplianceConfigurations/read | List the Cloud Appliance Supported Configurations |
> | Microsoft.StorSimple/managers/devices/sendTestAlertEmail/action | Send test alert email to configured email recipients. |
> | Microsoft.StorSimple/managers/devices/scanForUpdates/action | Scan for updates in a device. |
> | Microsoft.StorSimple/managers/devices/download/action | Download updates for a device. |
> | Microsoft.StorSimple/managers/devices/install/action | Install updates on a device. |
> | Microsoft.StorSimple/managers/devices/read | Lists or gets the Devices |
> | Microsoft.StorSimple/managers/devices/write | Create or update the Devices |
> | Microsoft.StorSimple/managers/devices/delete | Deletes the Devices |
> | Microsoft.StorSimple/managers/devices/deactivate/action | Deactivates a device. |
> | Microsoft.StorSimple/managers/devices/failover/action | Failover of the device. |
> | Microsoft.StorSimple/managers/devices/publishSupportPackage/action | Publish the support package for an existing device. A StorSimple support package is an easy-to-use mechanism that collects all relevant logs to assist Microsoft Support with troubleshooting any StorSimple device issues. |
> | Microsoft.StorSimple/managers/devices/authorizeForServiceEncryptionKeyRollover/action | Authorize for Service Encryption Key Rollover of Devices |
> | Microsoft.StorSimple/managers/devices/installUpdates/action | Installs updates on the devices (8000 Series Only). |
> | Microsoft.StorSimple/managers/devices/listFailoverSets/action | List the failover sets for an existing device (8000 Series Only). |
> | Microsoft.StorSimple/managers/devices/listFailoverTargets/action | List failover targets of the devices (8000 Series Only). |
> | Microsoft.StorSimple/managers/devices/publicEncryptionKey/action | List public encryption key of the device manager |
> | Microsoft.StorSimple/managers/devices/alertSettings/read | Lists or gets the Alert Settings |
> | Microsoft.StorSimple/managers/devices/alertSettings/write | Create or update the Alert Settings |
> | Microsoft.StorSimple/managers/devices/alertSettings/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/managers/devices/backupPolicies/write | Creates a new or updates Backup Polices (8000 Series Only) |
> | Microsoft.StorSimple/managers/devices/backupPolicies/read | List the Backup Polices (8000 Series Only) |
> | Microsoft.StorSimple/managers/devices/backupPolicies/delete | Deletes an existing Backup Polices (8000 Series Only) |
> | Microsoft.StorSimple/managers/devices/backupPolicies/backup/action | Take a manual backup to create an on-demand backup of all the volumes protected by the policy. |
> | Microsoft.StorSimple/managers/devices/backupPolicies/operationResults/read | List the Operation Results |
> | Microsoft.StorSimple/managers/devices/backupPolicies/schedules/write | Creates a new or updates Schedules |
> | Microsoft.StorSimple/managers/devices/backupPolicies/schedules/read | List the Schedules |
> | Microsoft.StorSimple/managers/devices/backupPolicies/schedules/delete | Deletes an existing Schedules |
> | Microsoft.StorSimple/managers/devices/backupPolicies/schedules/operationResults/read | List the Operation Results |
> | Microsoft.StorSimple/managers/devices/backups/read | Lists or gets the Backup Set |
> | Microsoft.StorSimple/managers/devices/backups/delete | Deletes the Backup Set |
> | Microsoft.StorSimple/managers/devices/backups/restore/action | Restore all the volumes from a backup set. |
> | Microsoft.StorSimple/managers/devices/backups/elements/clone/action | Clone a share or volume using a backup element. |
> | Microsoft.StorSimple/managers/devices/backups/elements/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/managers/devices/backups/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/managers/devices/backupScheduleGroups/read | Lists or gets the Backup Schedule Groups |
> | Microsoft.StorSimple/managers/devices/backupScheduleGroups/write | Create or update the Backup Schedule Groups |
> | Microsoft.StorSimple/managers/devices/backupScheduleGroups/delete | Deletes the Backup Schedule Groups |
> | Microsoft.StorSimple/managers/devices/backupScheduleGroups/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/managers/devices/chapSettings/write | Create or update the Chap Settings |
> | Microsoft.StorSimple/managers/devices/chapSettings/read | Lists or gets the Chap Settings |
> | Microsoft.StorSimple/managers/devices/chapSettings/delete | Deletes the Chap Settings |
> | Microsoft.StorSimple/managers/devices/chapSettings/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/managers/devices/disks/read | Lists or gets the Disks |
> | Microsoft.StorSimple/managers/devices/failover/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/managers/devices/failoverTargets/read | Lists or gets the Failover targets of the devices |
> | Microsoft.StorSimple/managers/devices/fileservers/read | Lists or gets the File Servers |
> | Microsoft.StorSimple/managers/devices/fileservers/write | Create or update the File Servers |
> | Microsoft.StorSimple/managers/devices/fileservers/delete | Deletes the File Servers |
> | Microsoft.StorSimple/managers/devices/fileservers/backup/action | Take backup of an File Server. |
> | Microsoft.StorSimple/managers/devices/fileservers/metrics/read | Lists or gets the Metrics |
> | Microsoft.StorSimple/managers/devices/fileservers/metricsDefinitions/read | Lists or gets the Metrics Definitions |
> | Microsoft.StorSimple/managers/devices/fileservers/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/managers/devices/fileservers/shares/write | Create or update the Shares |
> | Microsoft.StorSimple/managers/devices/fileservers/shares/read | Lists or gets the Shares |
> | Microsoft.StorSimple/managers/devices/fileservers/shares/delete | Deletes the Shares |
> | Microsoft.StorSimple/managers/devices/fileservers/shares/metrics/read | Lists or gets the Metrics |
> | Microsoft.StorSimple/managers/devices/fileservers/shares/metricsDefinitions/read | Lists or gets the Metrics Definitions |
> | Microsoft.StorSimple/managers/devices/fileservers/shares/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/managers/devices/hardwareComponentGroups/read | List the Hardware Component Groups |
> | Microsoft.StorSimple/managers/devices/hardwareComponentGroups/changeControllerPowerState/action | Change controller power state of hardware component groups |
> | Microsoft.StorSimple/managers/devices/hardwareComponentGroups/operationResults/read | List the Operation Results |
> | Microsoft.StorSimple/managers/devices/iscsiservers/read | Lists or gets the iSCSI Servers |
> | Microsoft.StorSimple/managers/devices/iscsiservers/write | Create or update the iSCSI Servers |
> | Microsoft.StorSimple/managers/devices/iscsiservers/delete | Deletes the iSCSI Servers |
> | Microsoft.StorSimple/managers/devices/iscsiservers/backup/action | Take backup of an iSCSI server. |
> | Microsoft.StorSimple/managers/devices/iscsiservers/disks/read | Lists or gets the Disks |
> | Microsoft.StorSimple/managers/devices/iscsiservers/disks/write | Create or update the Disks |
> | Microsoft.StorSimple/managers/devices/iscsiservers/disks/delete | Deletes the Disks |
> | Microsoft.StorSimple/managers/devices/iscsiservers/disks/metrics/read | Lists or gets the Metrics |
> | Microsoft.StorSimple/managers/devices/iscsiservers/disks/metricsDefinitions/read | Lists or gets the Metrics Definitions |
> | Microsoft.StorSimple/managers/devices/iscsiservers/disks/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/managers/devices/iscsiservers/metrics/read | Lists or gets the Metrics |
> | Microsoft.StorSimple/managers/devices/iscsiservers/metricsDefinitions/read | Lists or gets the Metrics Definitions |
> | Microsoft.StorSimple/managers/devices/iscsiservers/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/managers/devices/jobs/read | Lists or gets the Jobs |
> | Microsoft.StorSimple/managers/devices/jobs/cancel/action | Cancel a running job |
> | Microsoft.StorSimple/managers/devices/jobs/operationResults/read | List the Operation Results |
> | Microsoft.StorSimple/managers/devices/metrics/read | Lists or gets the Metrics |
> | Microsoft.StorSimple/managers/devices/metricsDefinitions/read | Lists or gets the Metrics Definitions |
> | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/import/action | Import source configurations for migration |
> | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/startMigrationEstimate/action | Start a job to estimate the duration of the migration process. |
> | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/startMigration/action | Start migration using source configurations |
> | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/confirmMigration/action | Confirms a successful migration and commit it. |
> | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/fetchMigrationEstimate/action | Fetch the status for the migration estimation job. |
> | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/fetchMigrationStatus/action | Fetch the status for the migration. |
> | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/fetchConfirmMigrationStatus/action | Fetch the confirm status of migration. |
> | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/confirmMigrationStatus/read | List the Confirm Migration Status |
> | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/migrationEstimate/read | List the Migration Estimate |
> | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/migrationStatus/read | List the Migration Status |
> | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/operationResults/read | List the Operation Results |
> | Microsoft.StorSimple/managers/devices/networkSettings/read | Lists or gets the Network Settings |
> | Microsoft.StorSimple/managers/devices/networkSettings/write | Creates a new or updates Network Settings |
> | Microsoft.StorSimple/managers/devices/networkSettings/operationResults/read | List the Operation Results |
> | Microsoft.StorSimple/managers/devices/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/managers/devices/securitySettings/update/action | Update the security settings. |
> | Microsoft.StorSimple/managers/devices/securitySettings/read | List the Security Settings |
> | Microsoft.StorSimple/managers/devices/securitySettings/syncRemoteManagementCertificate/action | Synchronize the remote management certificate for a device. |
> | Microsoft.StorSimple/managers/devices/securitySettings/write | Creates a new or updates Security Settings |
> | Microsoft.StorSimple/managers/devices/securitySettings/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/managers/devices/shares/read | Lists or gets the Shares |
> | Microsoft.StorSimple/managers/devices/timeSettings/read | Lists or gets the Time Settings |
> | Microsoft.StorSimple/managers/devices/timeSettings/write | Creates a new or updates Time Settings |
> | Microsoft.StorSimple/managers/devices/timeSettings/operationResults/read | List the Operation Results |
> | Microsoft.StorSimple/managers/devices/updates/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/managers/devices/updateSummary/read | Lists or gets the Update Summary |
> | Microsoft.StorSimple/managers/devices/volumeContainers/write | Creates a new or updates Volume Containers (8000 Series Only) |
> | Microsoft.StorSimple/managers/devices/volumeContainers/read | List the Volume Containers (8000 Series Only) |
> | Microsoft.StorSimple/managers/devices/volumeContainers/delete | Deletes an existing Volume Containers (8000 Series Only) |
> | Microsoft.StorSimple/managers/devices/volumeContainers/metrics/read | List the Metrics |
> | Microsoft.StorSimple/managers/devices/volumeContainers/metricsDefinitions/read | List the Metrics Definitions |
> | Microsoft.StorSimple/managers/devices/volumeContainers/operationResults/read | List the Operation Results |
> | Microsoft.StorSimple/managers/devices/volumeContainers/volumes/read | List the Volumes |
> | Microsoft.StorSimple/managers/devices/volumeContainers/volumes/write | Creates a new or updates Volumes |
> | Microsoft.StorSimple/managers/devices/volumeContainers/volumes/delete | Deletes an existing Volumes |
> | Microsoft.StorSimple/managers/devices/volumeContainers/volumes/metrics/read | List the Metrics |
> | Microsoft.StorSimple/managers/devices/volumeContainers/volumes/metricsDefinitions/read | List the Metrics Definitions |
> | Microsoft.StorSimple/managers/devices/volumeContainers/volumes/operationResults/read | List the Operation Results |
> | Microsoft.StorSimple/managers/devices/volumes/read | List the Volumes |
> | Microsoft.StorSimple/managers/encryptionSettings/read | Lists or gets the Encryption Settings |
> | Microsoft.StorSimple/managers/extendedInformation/read | Lists or gets the Extended Vault Information |
> | Microsoft.StorSimple/managers/extendedInformation/write | Create or update the Extended Vault Information |
> | Microsoft.StorSimple/managers/extendedInformation/delete | Deletes the Extended Vault Information |
> | Microsoft.StorSimple/Managers/extendedInformation/read | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.StorSimple/Managers/extendedInformation/write | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.StorSimple/Managers/extendedInformation/delete | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.StorSimple/managers/features/read | List the Features |
> | Microsoft.StorSimple/managers/fileservers/read | Lists or gets the File Servers |
> | Microsoft.StorSimple/managers/iscsiservers/read | Lists or gets the iSCSI Servers |
> | Microsoft.StorSimple/managers/jobs/read | Lists or gets the Jobs |
> | Microsoft.StorSimple/managers/metrics/read | Lists or gets the Metrics |
> | Microsoft.StorSimple/managers/metricsDefinitions/read | Lists or gets the Metrics Definitions |
> | Microsoft.StorSimple/managers/migrationSourceConfigurations/read | List the Migration Source Configurations (8000 Series Only) |
> | Microsoft.StorSimple/managers/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/managers/storageAccountCredentials/write | Create or update the Storage Account Credentials |
> | Microsoft.StorSimple/managers/storageAccountCredentials/read | Lists or gets the Storage Account Credentials |
> | Microsoft.StorSimple/managers/storageAccountCredentials/delete | Deletes the Storage Account Credentials |
> | Microsoft.StorSimple/managers/storageAccountCredentials/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/managers/storageDomains/read | Lists or gets the Storage Domains |
> | Microsoft.StorSimple/managers/storageDomains/write | Create or update the Storage Domains |
> | Microsoft.StorSimple/managers/storageDomains/delete | Deletes the Storage Domains |
> | Microsoft.StorSimple/managers/storageDomains/operationResults/read | Lists or gets the Operation Results |
> | Microsoft.StorSimple/operations/read | Lists or gets the Operations |

## Web

### Microsoft.CertificateRegistration

Azure service: [App Service Certificates](../app-service/configure-ssl-certificate.md#import-an-app-service-certificate)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.CertificateRegistration/provisionGlobalAppServicePrincipalInUserTenant/Action | Provision service principal for service app principal |
> | Microsoft.CertificateRegistration/validateCertificateRegistrationInformation/Action | Validate certificate purchase object without submitting it |
> | Microsoft.CertificateRegistration/register/action | Register the Microsoft Certificates resource provider for the subscription |
> | Microsoft.CertificateRegistration/certificateOrders/Write | Add a new certificateOrder or update an existing one |
> | Microsoft.CertificateRegistration/certificateOrders/Delete | Delete an existing AppServiceCertificate |
> | Microsoft.CertificateRegistration/certificateOrders/Read | Get the list of CertificateOrders |
> | Microsoft.CertificateRegistration/certificateOrders/reissue/Action | Reissue an existing certificateorder |
> | Microsoft.CertificateRegistration/certificateOrders/renew/Action | Renew an existing certificateorder |
> | Microsoft.CertificateRegistration/certificateOrders/retrieveCertificateActions/Action | Retrieve the list of certificate actions |
> | Microsoft.CertificateRegistration/certificateOrders/retrieveEmailHistory/Action | Retrieve certificate email history |
> | Microsoft.CertificateRegistration/certificateOrders/resendEmail/Action | Resend certificate email |
> | Microsoft.CertificateRegistration/certificateOrders/verifyDomainOwnership/Action | Verify domain ownership |
> | Microsoft.CertificateRegistration/certificateOrders/resendRequestEmails/Action | Resend request emails to another email address |
> | Microsoft.CertificateRegistration/certificateOrders/resendRequestEmails/Action | Retrieve site seal for an issued App Service Certificate |
> | Microsoft.CertificateRegistration/certificateOrders/certificates/Write | Add a new certificate or update an existing one |
> | Microsoft.CertificateRegistration/certificateOrders/certificates/Delete | Delete an existing certificate |
> | Microsoft.CertificateRegistration/certificateOrders/certificates/Read | Get the list of certificates |
> | Microsoft.CertificateRegistration/operations/Read | List all operations from app service certificate registration |

### Microsoft.DomainRegistration

Azure service: [App Service](../app-service/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DomainRegistration/generateSsoRequest/Action | Generate a request for signing into domain control center. |
> | Microsoft.DomainRegistration/validateDomainRegistrationInformation/Action | Validate domain purchase object without submitting it |
> | Microsoft.DomainRegistration/checkDomainAvailability/Action | Check if a domain is available for purchase |
> | Microsoft.DomainRegistration/listDomainRecommendations/Action | Retrieve the list domain recommendations based on keywords |
> | Microsoft.DomainRegistration/register/action | Register the Microsoft Domains resource provider for the subscription |
> | Microsoft.DomainRegistration/domains/Read | Get the list of domains |
> | Microsoft.DomainRegistration/domains/Read | Get domain |
> | Microsoft.DomainRegistration/domains/Write | Add a new Domain or update an existing one |
> | Microsoft.DomainRegistration/domains/Delete | Delete an existing domain. |
> | Microsoft.DomainRegistration/domains/renew/Action | Renew an existing domain. |
> | Microsoft.DomainRegistration/domains/domainownershipidentifiers/Read | List ownership identifiers |
> | Microsoft.DomainRegistration/domains/domainownershipidentifiers/Read | Get ownership identifier |
> | Microsoft.DomainRegistration/domains/domainownershipidentifiers/Write | Create or update identifier |
> | Microsoft.DomainRegistration/domains/domainownershipidentifiers/Delete | Delete ownership identifier |
> | Microsoft.DomainRegistration/domains/operationresults/Read | Get a domain operation |
> | Microsoft.DomainRegistration/operations/Read | List all operations from app service domain registration |
> | Microsoft.DomainRegistration/topLevelDomains/Read | Get toplevel domains |
> | Microsoft.DomainRegistration/topLevelDomains/Read | Get toplevel domain |
> | Microsoft.DomainRegistration/topLevelDomains/listAgreements/Action | List Agreement action |

### Microsoft.Maps

Azure service: [Azure Maps](../azure-maps/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Maps/register/action | Register the provider |
> | Microsoft.Maps/accounts/write | Create or update a Maps Account. |
> | Microsoft.Maps/accounts/read | Get a Maps Account. |
> | Microsoft.Maps/accounts/delete | Delete a Maps Account. |
> | Microsoft.Maps/accounts/listKeys/action | List Maps Account keys |
> | Microsoft.Maps/accounts/regenerateKey/action | Generate new Maps Account primary or secondary key |
> | Microsoft.Maps/accounts/eventGridFilters/delete | Delete an Event Grid filter |
> | Microsoft.Maps/accounts/eventGridFilters/read | Get an Event Grid filter |
> | Microsoft.Maps/accounts/eventGridFilters/write | Create or update an Event Grid filter |
> | Microsoft.Maps/accounts/privateAtlases/delete | Delete a Private Atlas |
> | Microsoft.Maps/accounts/privateAtlases/read | Get a Private Atlas |
> | Microsoft.Maps/accounts/privateAtlases/write | Create or update a Private Atlas |
> | Microsoft.Maps/operations/read | Read the provider operations |
> | **DataAction** | **Description** |
> | Microsoft.Maps/accounts/data/read | Grants data read access to a maps account. |

### Microsoft.Media

Azure service: [Media Services](../media-services/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Media/register/action | Registers the subscription for the Media Services resource provider and enables the creation of Media Services accounts |
> | Microsoft.Media/unregister/action | Unregisters the subscription for the Media Services resource provider |
> | Microsoft.Media/checknameavailability/action | Checks if a Media Services account name is available |
> | Microsoft.Media/locations/checkNameAvailability/action | Checks if a Media Services account name is available |
> | Microsoft.Media/mediaservices/read | Read any Media Services Account |
> | Microsoft.Media/mediaservices/write | Create or Update any Media Services Account |
> | Microsoft.Media/mediaservices/delete | Delete any Media Services Account |
> | Microsoft.Media/mediaservices/regenerateKey/action | Regenerate a Media Services ACS key |
> | Microsoft.Media/mediaservices/listKeys/action | List the ACS keys for the Media Services account |
> | Microsoft.Media/mediaservices/syncStorageKeys/action | Synchronize the Storage Keys for an attached Azure Storage account |
> | Microsoft.Media/mediaservices/listEdgePolicies/action | List policies for an edge device. |
> | Microsoft.Media/mediaservices/accountfilters/read | Read any Account Filter |
> | Microsoft.Media/mediaservices/accountfilters/write | Create or Update any Account Filter |
> | Microsoft.Media/mediaservices/accountfilters/delete | Delete any Account Filter |
> | Microsoft.Media/mediaservices/assets/read | Read any Asset |
> | Microsoft.Media/mediaservices/assets/write | Create or Update any Asset |
> | Microsoft.Media/mediaservices/assets/delete | Delete any Asset |
> | Microsoft.Media/mediaservices/assets/listContainerSas/action | List Asset Container SAS URLs |
> | Microsoft.Media/mediaservices/assets/getEncryptionKey/action | Get Asset Encryption Key |
> | Microsoft.Media/mediaservices/assets/listStreamingLocators/action | List Streaming Locators for Asset |
> | Microsoft.Media/mediaservices/assets/assetfilters/read | Read any Asset Filter |
> | Microsoft.Media/mediaservices/assets/assetfilters/write | Create or Update any Asset Filter |
> | Microsoft.Media/mediaservices/assets/assetfilters/delete | Delete any Asset Filter |
> | Microsoft.Media/mediaservices/contentKeyPolicies/read | Read any Content Key Policy |
> | Microsoft.Media/mediaservices/contentKeyPolicies/write | Create or Update any Content Key Policy |
> | Microsoft.Media/mediaservices/contentKeyPolicies/delete | Delete any Content Key Policy |
> | Microsoft.Media/mediaservices/contentKeyPolicies/getPolicyPropertiesWithSecrets/action | Get Policy Properties With Secrets |
> | Microsoft.Media/mediaservices/eventGridFilters/read | Read any Event Grid Filter |
> | Microsoft.Media/mediaservices/eventGridFilters/write | Create or Update any Event Grid Filter |
> | Microsoft.Media/mediaservices/eventGridFilters/delete | Delete any Event Grid Filter |
> | Microsoft.Media/mediaservices/liveEventOperations/read | Read any Live Event Operation |
> | Microsoft.Media/mediaservices/liveEventPrivateEndpointConnectionProxies/read | Read any Live Event Private Endpoint Connection Proxy |
> | Microsoft.Media/mediaservices/liveEventPrivateEndpointConnectionProxies/write | Create Live Event Private Endpoint Connection Proxy |
> | Microsoft.Media/mediaservices/liveEventPrivateEndpointConnectionProxies/delete | Delete Live Event Private Endpoint Connection Proxy |
> | Microsoft.Media/mediaservices/liveEventPrivateEndpointConnectionProxies/validate/action | Validate Live Event Private Endpoint Connection Proxy |
> | Microsoft.Media/mediaservices/liveEventPrivateEndpointConnections/read | Read any Live Event Private Endpoint Connection |
> | Microsoft.Media/mediaservices/liveEventPrivateEndpointConnections/write | Create Live Event Private Endpoint Connection |
> | Microsoft.Media/mediaservices/liveEventPrivateEndpointConnections/delete | Delete Live Event Private Endpoint Connection |
> | Microsoft.Media/mediaservices/liveEventPrivateLinkResources/read | Read any Live Event Private Link Resource |
> | Microsoft.Media/mediaservices/liveEvents/read | Read any Live Event |
> | Microsoft.Media/mediaservices/liveEvents/write | Create or Update any Live Event |
> | Microsoft.Media/mediaservices/liveEvents/delete | Delete any Live Event |
> | Microsoft.Media/mediaservices/liveEvents/start/action | Start any Live Event Operation |
> | Microsoft.Media/mediaservices/liveEvents/stop/action | Stop any Live Event Operation |
> | Microsoft.Media/mediaservices/liveEvents/reset/action | Reset any Live Event Operation |
> | Microsoft.Media/mediaservices/liveEvents/liveOutputs/read | Read any Live Output |
> | Microsoft.Media/mediaservices/liveEvents/liveOutputs/write | Create or Update any Live Output |
> | Microsoft.Media/mediaservices/liveEvents/liveOutputs/delete | Delete any Live Output |
> | Microsoft.Media/mediaservices/liveOutputOperations/read | Read any Live Output Operation |
> | Microsoft.Media/mediaservices/mediaGraphs/read | Read any Media Graph |
> | Microsoft.Media/mediaservices/mediaGraphs/write | Create or Update any Media Graph |
> | Microsoft.Media/mediaservices/mediaGraphs/delete | Delete any Media Graph |
> | Microsoft.Media/mediaservices/mediaGraphs/start/action | Start any Media Graph Operation |
> | Microsoft.Media/mediaservices/mediaGraphs/stop/action | Stop any Media Graph Operation |
> | Microsoft.Media/mediaservices/privateEndpointConnectionProxies/read | Read any Private Endpoint Connection Proxy |
> | Microsoft.Media/mediaservices/privateEndpointConnectionProxies/write | Create Private Endpoint Connection Proxy |
> | Microsoft.Media/mediaservices/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxy |
> | Microsoft.Media/mediaservices/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxy |
> | Microsoft.Media/mediaservices/privateEndpointConnections/read | Read any Private Endpoint Connection |
> | Microsoft.Media/mediaservices/privateEndpointConnections/write | Create Private Endpoint Connection |
> | Microsoft.Media/mediaservices/privateEndpointConnections/delete | Delete Private Endpoint Connection |
> | Microsoft.Media/mediaservices/privateLinkResources/read | Read any Private Link Resource |
> | Microsoft.Media/mediaservices/streamingEndpointOperations/read | Read any Streaming Endpoint Operation |
> | Microsoft.Media/mediaservices/streamingEndpoints/read | Read any Streaming Endpoint |
> | Microsoft.Media/mediaservices/streamingEndpoints/write | Create or Update any Streaming Endpoint |
> | Microsoft.Media/mediaservices/streamingEndpoints/delete | Delete any Streaming Endpoint |
> | Microsoft.Media/mediaservices/streamingEndpoints/start/action | Start any Streaming Endpoint Operation |
> | Microsoft.Media/mediaservices/streamingEndpoints/stop/action | Stop any Streaming Endpoint Operation |
> | Microsoft.Media/mediaservices/streamingEndpoints/scale/action | Scale any Streaming Endpoint Operation |
> | Microsoft.Media/mediaservices/streamingEndpoints/streamingEndpointPrivateEndpointConnectionProxies/read | Read any Streaming Endpoint Private Endpoint Connection Proxy |
> | Microsoft.Media/mediaservices/streamingEndpoints/streamingEndpointPrivateEndpointConnectionProxies/write | Create Streaming Endpoint Private Endpoint Connection Proxy |
> | Microsoft.Media/mediaservices/streamingEndpoints/streamingEndpointPrivateEndpointConnectionProxies/delete | Delete Streaming Endpoint Private Endpoint Connection Proxy |
> | Microsoft.Media/mediaservices/streamingEndpoints/streamingEndpointPrivateEndpointConnectionProxies/validate/action | Validate Streaming Endpoint Private Endpoint Connection Proxy |
> | Microsoft.Media/mediaservices/streamingEndpoints/streamingEndpointPrivateEndpointConnections/read | Read any Streaming Endpoint Private Endpoint Connection |
> | Microsoft.Media/mediaservices/streamingEndpoints/streamingEndpointPrivateEndpointConnections/write | Create Streaming Endpoint Private Endpoint Connection |
> | Microsoft.Media/mediaservices/streamingEndpoints/streamingEndpointPrivateEndpointConnections/delete | Delete Streaming Endpoint Private Endpoint Connection |
> | Microsoft.Media/mediaservices/streamingEndpoints/streamngEndpointPrivateLinkResources/read | Read any Streaming Endpoint Private Link Resource |
> | Microsoft.Media/mediaservices/streamingLocators/read | Read any Streaming Locator |
> | Microsoft.Media/mediaservices/streamingLocators/write | Create or Update any Streaming Locator |
> | Microsoft.Media/mediaservices/streamingLocators/delete | Delete any Streaming Locator |
> | Microsoft.Media/mediaservices/streamingLocators/listContentKeys/action | List Content Keys |
> | Microsoft.Media/mediaservices/streamingLocators/listPaths/action | List Paths |
> | Microsoft.Media/mediaservices/streamingPolicies/read | Read any Streaming Policy |
> | Microsoft.Media/mediaservices/streamingPolicies/write | Create or Update any Streaming Policy |
> | Microsoft.Media/mediaservices/streamingPolicies/delete | Delete any Streaming Policy |
> | Microsoft.Media/mediaservices/streamingPrivateEndpointConnectionOperations/read | Read any Streaming Private Endpoint Connection Operation |
> | Microsoft.Media/mediaservices/streamingPrivateEndpointConnectionProxyOperations/read | Read any Streaming Private Endpoint Connection Proxy Operation |
> | Microsoft.Media/mediaservices/transforms/read | Read any Transform |
> | Microsoft.Media/mediaservices/transforms/write | Create or Update any Transform |
> | Microsoft.Media/mediaservices/transforms/delete | Delete any Transform |
> | Microsoft.Media/mediaservices/transforms/jobs/read | Read any Job |
> | Microsoft.Media/mediaservices/transforms/jobs/write | Create or Update any Job |
> | Microsoft.Media/mediaservices/transforms/jobs/delete | Delete any Job |
> | Microsoft.Media/mediaservices/transforms/jobs/cancelJob/action | Cancel Job |
> | Microsoft.Media/operations/read | Get Available Operations |

### Microsoft.Search

Azure service: [Azure Search](../search/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Search/register/action | Registers the subscription for the search resource provider and enables the creation of search services. |
> | Microsoft.Search/checkNameAvailability/action | Checks availability of the service name. |
> | Microsoft.Search/operations/read | Lists all of the available operations of the Microsoft.Search provider. |
> | Microsoft.Search/searchServices/write | Creates or updates the search service. |
> | Microsoft.Search/searchServices/read | Reads the search service. |
> | Microsoft.Search/searchServices/delete | Deletes the search service. |
> | Microsoft.Search/searchServices/start/action | Starts the search service. |
> | Microsoft.Search/searchServices/stop/action | Stops the search service. |
> | Microsoft.Search/searchServices/listAdminKeys/action | Reads the admin keys. |
> | Microsoft.Search/searchServices/regenerateAdminKey/action | Regenerates the admin key. |
> | Microsoft.Search/searchServices/listQueryKeys/action | Returns the list of query API keys for the given Azure Search service. |
> | Microsoft.Search/searchServices/createQueryKey/action | Creates the query key. |
> | Microsoft.Search/searchServices/deleteQueryKey/delete | Deletes the query key. |
> | Microsoft.Search/searchServices/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Microsoft.Search/searchServices/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy |
> | Microsoft.Search/searchServices/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy |
> | Microsoft.Search/searchServices/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |

### Microsoft.SignalRService

Azure service: [Azure SignalR Service](../azure-signalr/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.SignalRService/register/action | Registers the 'Microsoft.SignalRService' resource provider with a subscription |
> | Microsoft.SignalRService/unregister/action | Unregisters the 'Microsoft.SignalRService' resource provider with a subscription |
> | Microsoft.SignalRService/locations/checknameavailability/action | Checks if a name is available for use with a new SignalR service |
> | Microsoft.SignalRService/locations/operationresults/signalr/read | Query the result of a location-based asynchronous operation |
> | Microsoft.SignalRService/locations/operationStatuses/operationId/read | Query the status of a location-based asynchronous operation |
> | Microsoft.SignalRService/locations/usages/read | Get the quota usages for Azure SignalR service |
> | Microsoft.SignalRService/operationresults/read | Query the result of a provider-level asynchronous operation |
> | Microsoft.SignalRService/operations/read | List the operations for Azure SignalR service. |
> | Microsoft.SignalRService/operationstatus/read | Query the status of a provider-level asynchronous operation |
> | Microsoft.SignalRService/SignalR/read | View the SignalR's settings and configurations in the management portal or through API |
> | Microsoft.SignalRService/SignalR/write | Modify the SignalR's settings and configurations in the management portal or through API |
> | Microsoft.SignalRService/SignalR/delete | Delete the entire SignalR service |
> | Microsoft.SignalRService/SignalR/listkeys/action | View the value of SignalR access keys in the management portal or through API |
> | Microsoft.SignalRService/SignalR/regeneratekey/action | Change the value of SignalR access keys in the management portal or through API |
> | Microsoft.SignalRService/SignalR/restart/action | To restart an Azure SignalR service in the management portal or through API. There will be certain downtime. |
> | Microsoft.SignalRService/SignalR/eventGridFilters/read | Get the properties of the specified event grid filter or lists all the event grid filters for the specified SignalR. |
> | Microsoft.SignalRService/SignalR/eventGridFilters/write | Create or update an event grid filter for a SignalR with the specified parameters. |
> | Microsoft.SignalRService/SignalR/eventGridFilters/delete | Delete an event grid filter from a SignalR. |
> | Microsoft.SignalRService/SignalR/privateEndpointConnectionProxies/validate/action | Validate a Private Endpoint Connection Proxy |
> | Microsoft.SignalRService/SignalR/privateEndpointConnectionProxies/write | Create a Private Endpoint Connection Proxy |
> | Microsoft.SignalRService/SignalR/privateEndpointConnectionProxies/read | Read a Private Endpoint Connetion Proxy |
> | Microsoft.SignalRService/SignalR/privateEndpointConnectionProxies/delete | Delete a Private Endpoint Connection Proxy |
> | Microsoft.SignalRService/SignalR/privateEndpointConnections/write | Approve or reject a Private Endpoint Connection |
> | Microsoft.SignalRService/SignalR/privateEndpointConnections/read | Read a Private Endpoint Connection |
> | Microsoft.SignalRService/SignalR/privateLinkResources/read | List all SignalR Private Link Resources |
> | **DataAction** | **Description** |
> | Microsoft.SignalRService/SignalR/serverConnection/write | Start a server connection. |
> | Microsoft.SignalRService/SignalR/service/accessKey/action | Get a temporary AccessKey for signing ClientTokens. |
> | Microsoft.SignalRService/SignalR/service/clientToken/action | Get a ClientToken for starting a client connection. |

### microsoft.web

Azure service: [App Service](../app-service/index.yml), [Azure Functions](../azure-functions/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | microsoft.web/unregister/action | Unregister Microsoft.Web resource provider for the subscription. |
> | microsoft.web/validate/action | Validate . |
> | microsoft.web/register/action | Register Microsoft.Web resource provider for the subscription. |
> | microsoft.web/verifyhostingenvironmentvnet/action | Verify Hosting Environment Vnet. |
> | microsoft.web/apimanagementaccounts/apiacls/read | Get Api Management Accounts Apiacls. |
> | microsoft.web/apimanagementaccounts/apis/read | Get Api Management Accounts APIs. |
> | microsoft.web/apimanagementaccounts/apis/delete | Delete Api Management Accounts APIs. |
> | microsoft.web/apimanagementaccounts/apis/write | Update Api Management Accounts APIs. |
> | microsoft.web/apimanagementaccounts/apis/apiacls/delete | Delete Api Management Accounts APIs Apiacls. |
> | microsoft.web/apimanagementaccounts/apis/apiacls/read | Get Api Management Accounts APIs Apiacls. |
> | microsoft.web/apimanagementaccounts/apis/apiacls/write | Update Api Management Accounts APIs Apiacls. |
> | microsoft.web/apimanagementaccounts/apis/connectionacls/read | Get Api Management Accounts APIs Connectionacls. |
> | microsoft.web/apimanagementaccounts/apis/connections/read | Get Api Management Accounts APIs Connections. |
> | microsoft.web/apimanagementaccounts/apis/connections/confirmconsentcode/action | Confirm Consent Code Api Management Accounts APIs Connections. |
> | microsoft.web/apimanagementaccounts/apis/connections/delete | Delete Api Management Accounts APIs Connections. |
> | microsoft.web/apimanagementaccounts/apis/connections/getconsentlinks/action | Get Consent Links for Api Management Accounts APIs Connections. |
> | microsoft.web/apimanagementaccounts/apis/connections/write | Update Api Management Accounts APIs Connections. |
> | microsoft.web/apimanagementaccounts/apis/connections/listconnectionkeys/action | List Connection Keys Api Management Accounts APIs Connections. |
> | microsoft.web/apimanagementaccounts/apis/connections/listsecrets/action | List Secrets Api Management Accounts APIs Connections. |
> | microsoft.web/apimanagementaccounts/apis/connections/connectionacls/delete | Delete Api Management Accounts APIs Connections Connectionacls. |
> | microsoft.web/apimanagementaccounts/apis/connections/connectionacls/read | Get Api Management Accounts APIs Connections Connectionacls. |
> | microsoft.web/apimanagementaccounts/apis/connections/connectionacls/write | Update Api Management Accounts APIs Connections Connectionacls. |
> | microsoft.web/apimanagementaccounts/apis/localizeddefinitions/delete | Delete Api Management Accounts APIs Localized Definitions. |
> | microsoft.web/apimanagementaccounts/apis/localizeddefinitions/read | Get Api Management Accounts APIs Localized Definitions. |
> | microsoft.web/apimanagementaccounts/apis/localizeddefinitions/write | Update Api Management Accounts APIs Localized Definitions. |
> | microsoft.web/apimanagementaccounts/connectionacls/read | Get Api Management Accounts Connectionacls. |
> | microsoft.web/availablestacks/read | Get Available Stacks. |
> | Microsoft.Web/certificates/Read | Get the list of certificates. |
> | Microsoft.Web/certificates/Write | Add a new certificate or update an existing one. |
> | Microsoft.Web/certificates/Delete | Delete an existing certificate. |
> | microsoft.web/checknameavailability/read | Check if resource name is available. |
> | microsoft.web/classicmobileservices/read | Get Classic Mobile Services. |
> | Microsoft.Web/connectionGateways/Read | Get the list of Connection Gateways. |
> | Microsoft.Web/connectionGateways/Write | Creates or updates a Connection Gateway. |
> | Microsoft.Web/connectionGateways/Delete | Deletes a Connection Gateway. |
> | Microsoft.Web/connectionGateways/Move/Action | Moves a Connection Gateway. |
> | Microsoft.Web/connectionGateways/Join/Action | Joins a Connection Gateway. |
> | Microsoft.Web/connectionGateways/ListStatus/Action | Lists status of a Connection Gateway. |
> | Microsoft.Web/connections/Read | Get the list of Connections. |
> | Microsoft.Web/connections/Write | Creates or updates a Connection. |
> | Microsoft.Web/connections/Delete | Deletes a Connection. |
> | Microsoft.Web/connections/Move/Action | Moves a Connection. |
> | Microsoft.Web/connections/Join/Action | Joins a Connection. |
> | microsoft.web/connections/confirmconsentcode/action | Confirm Connections Consent Code. |
> | microsoft.web/connections/listconsentlinks/action | List Consent Links for Connections. |
> | Microsoft.Web/customApis/Read | Get the list of Custom API. |
> | Microsoft.Web/customApis/Write | Creates or updates a Custom API. |
> | Microsoft.Web/customApis/Delete | Deletes a Custom API. |
> | Microsoft.Web/customApis/Move/Action | Moves a Custom API. |
> | Microsoft.Web/customApis/Join/Action | Joins a Custom API. |
> | Microsoft.Web/customApis/extractApiDefinitionFromWsdl/Action | Extracts API definition from a WSDL. |
> | Microsoft.Web/customApis/listWsdlInterfaces/Action | Lists WSDL interfaces for a Custom API. |
> | Microsoft.Web/deletedSites/Read | Get the properties of a Deleted Web App |
> | microsoft.web/deploymentlocations/read | Get Deployment Locations. |
> | Microsoft.Web/geoRegions/Read | Get the list of Geo regions. |
> | Microsoft.Web/hostingEnvironments/Read | Get the properties of an App Service Environment |
> | Microsoft.Web/hostingEnvironments/Write | Create a new App Service Environment or update existing one |
> | Microsoft.Web/hostingEnvironments/Delete | Delete an App Service Environment |
> | Microsoft.Web/hostingEnvironments/Join/Action | Joins an App Service Environment |
> | Microsoft.Web/hostingEnvironments/reboot/Action | Reboot all machines in an App Service Environment |
> | Microsoft.Web/hostingEnvironments/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | microsoft.web/hostingenvironments/resume/action | Resume Hosting Environments. |
> | microsoft.web/hostingenvironments/suspend/action | Suspend Hosting Environments. |
> | microsoft.web/hostingenvironments/capacities/read | Get Hosting Environments Capacities. |
> | microsoft.web/hostingenvironments/detectors/read | Get Hosting Environments Detectors. |
> | microsoft.web/hostingenvironments/diagnostics/read | Get Hosting Environments Diagnostics. |
> | Microsoft.Web/hostingEnvironments/eventGridFilters/delete | Delete Event Grid Filter on hosting environment. |
> | Microsoft.Web/hostingEnvironments/eventGridFilters/read | Get Event Grid Filter on hosting environment. |
> | Microsoft.Web/hostingEnvironments/eventGridFilters/write | Put Event Grid Filter on hosting environment. |
> | microsoft.web/hostingenvironments/inboundnetworkdependenciesendpoints/read | Get the network endpoints of all inbound dependencies. |
> | microsoft.web/hostingenvironments/metricdefinitions/read | Get Hosting Environments Metric Definitions. |
> | Microsoft.Web/hostingEnvironments/multiRolePools/Read | Get the properties of a FrontEnd Pool in an App Service Environment |
> | Microsoft.Web/hostingEnvironments/multiRolePools/Write | Create a new FrontEnd Pool in an App Service Environment or update an existing one |
> | microsoft.web/hostingenvironments/multirolepools/metricdefinitions/read | Get Hosting Environments MultiRole Pools Metric Definitions. |
> | microsoft.web/hostingenvironments/multirolepools/metrics/read | Get Hosting Environments MultiRole Pools Metrics. |
> | microsoft.web/hostingenvironments/multirolepools/skus/read | Get Hosting Environments MultiRole Pools SKUs. |
> | microsoft.web/hostingenvironments/multirolepools/usages/read | Get Hosting Environments MultiRole Pools Usages. |
> | microsoft.web/hostingenvironments/operations/read | Get Hosting Environments Operations. |
> | microsoft.web/hostingenvironments/outboundnetworkdependenciesendpoints/read | Get the network endpoints of all outbound dependencies. |
> | microsoft.web/hostingenvironments/serverfarms/read | Get Hosting Environments App Service Plans. |
> | microsoft.web/hostingenvironments/sites/read | Get Hosting Environments Web Apps. |
> | microsoft.web/hostingenvironments/usages/read | Get Hosting Environments Usages. |
> | Microsoft.Web/hostingEnvironments/workerPools/Read | Get the properties of a Worker Pool in an App Service Environment |
> | Microsoft.Web/hostingEnvironments/workerPools/Write | Create a new Worker Pool in an App Service Environment or update an existing one |
> | microsoft.web/hostingenvironments/workerpools/metricdefinitions/read | Get Hosting Environments Workerpools Metric Definitions. |
> | microsoft.web/hostingenvironments/workerpools/metrics/read | Get Hosting Environments Workerpools Metrics. |
> | microsoft.web/hostingenvironments/workerpools/skus/read | Get Hosting Environments Workerpools SKUs. |
> | microsoft.web/hostingenvironments/workerpools/usages/read | Get Hosting Environments Workerpools Usages. |
> | microsoft.web/ishostingenvironmentnameavailable/read | Get if Hosting Environment Name is available. |
> | microsoft.web/ishostnameavailable/read | Check if Hostname is Available. |
> | microsoft.web/isusernameavailable/read | Check if Username is available. |
> | Microsoft.Web/listSitesAssignedToHostName/Read | Get names of sites assigned to hostname. |
> | microsoft.web/locations/extractapidefinitionfromwsdl/action | Extract Api Definition from WSDL for Locations. |
> | microsoft.web/locations/listwsdlinterfaces/action | List WSDL Interfaces for Locations. |
> | microsoft.web/locations/deleteVirtualNetworkOrSubnets/action | Vnet or subnet deletion notification for Locations. |
> | microsoft.web/locations/apioperations/read | Get Locations API Operations. |
> | microsoft.web/locations/connectiongatewayinstallations/read | Get Locations Connection Gateway Installations. |
> | microsoft.web/locations/managedapis/read | Get Locations Managed APIs. |
> | Microsoft.Web/locations/managedapis/Join/Action | Joins a Managed API. |
> | microsoft.web/locations/managedapis/apioperations/read | Get Locations Managed API Operations. |
> | microsoft.web/locations/operationResults/read | Get Operations. |
> | microsoft.web/locations/operations/read | Get Operations. |
> | microsoft.web/operations/read | Get Operations. |
> | microsoft.web/publishingusers/read | Get Publishing Users. |
> | microsoft.web/publishingusers/write | Update Publishing Users. |
> | Microsoft.Web/recommendations/Read | Get the list of recommendations for subscriptions. |
> | microsoft.web/resourcehealthmetadata/read | Get Resource Health Metadata. |
> | Microsoft.Web/serverfarms/Read | Get the properties on an App Service Plan |
> | Microsoft.Web/serverfarms/Write | Create a new App Service Plan or update an existing one |
> | Microsoft.Web/serverfarms/Delete | Delete an existing App Service Plan |
> | Microsoft.Web/serverfarms/restartSites/Action | Restart all Web Apps in an App Service Plan |
> | microsoft.web/serverfarms/capabilities/read | Get App Service Plans Capabilities. |
> | Microsoft.Web/serverfarms/eventGridFilters/delete | Delete Event Grid Filter on server farm. |
> | Microsoft.Web/serverfarms/eventGridFilters/read | Get Event Grid Filter on server farm. |
> | Microsoft.Web/serverfarms/eventGridFilters/write | Put Event Grid Filter on server farm. |
> | microsoft.web/serverfarms/firstpartyapps/settings/delete | Delete App Service Plans First Party Apps Settings. |
> | microsoft.web/serverfarms/firstpartyapps/settings/read | Get App Service Plans First Party Apps Settings. |
> | microsoft.web/serverfarms/firstpartyapps/settings/write | Update App Service Plans First Party Apps Settings. |
> | microsoft.web/serverfarms/hybridconnectionnamespaces/relays/read | Get App Service Plans Hybrid Connection Namespaces Relays. |
> | microsoft.web/serverfarms/hybridconnectionnamespaces/relays/delete | Delete App Service Plans Hybrid Connection Namespaces Relays. |
> | microsoft.web/serverfarms/hybridconnectionnamespaces/relays/sites/read | Get App Service Plans Hybrid Connection Namespaces Relays Web Apps. |
> | microsoft.web/serverfarms/hybridconnectionplanlimits/read | Get App Service Plans Hybrid Connection Plan Limits. |
> | microsoft.web/serverfarms/hybridconnectionrelays/read | Get App Service Plans Hybrid Connection Relays. |
> | microsoft.web/serverfarms/metricdefinitions/read | Get App Service Plans Metric Definitions. |
> | microsoft.web/serverfarms/metrics/read | Get App Service Plans Metrics. |
> | microsoft.web/serverfarms/operationresults/read | Get App Service Plans Operation Results. |
> | microsoft.web/serverfarms/sites/read | Get App Service Plans Web Apps. |
> | microsoft.web/serverfarms/skus/read | Get App Service Plans SKUs. |
> | microsoft.web/serverfarms/usages/read | Get App Service Plans Usages. |
> | microsoft.web/serverfarms/virtualnetworkconnections/read | Get App Service Plans Virtual Network Connections. |
> | microsoft.web/serverfarms/virtualnetworkconnections/gateways/write | Update App Service Plans Virtual Network Connections Gateways. |
> | microsoft.web/serverfarms/virtualnetworkconnections/routes/delete | Delete App Service Plans Virtual Network Connections Routes. |
> | microsoft.web/serverfarms/virtualnetworkconnections/routes/read | Get App Service Plans Virtual Network Connections Routes. |
> | microsoft.web/serverfarms/virtualnetworkconnections/routes/write | Update App Service Plans Virtual Network Connections Routes. |
> | microsoft.web/serverfarms/workers/reboot/action | Reboot App Service Plans Workers. |
> | Microsoft.Web/sites/Read | Get the properties of a Web App |
> | Microsoft.Web/sites/Write | Create a new Web App or update an existing one |
> | Microsoft.Web/sites/Delete | Delete an existing Web App |
> | Microsoft.Web/sites/backup/Action | Create a new web app backup |
> | Microsoft.Web/sites/publishxml/Action | Get publishing profile xml for a Web App |
> | Microsoft.Web/sites/publish/Action | Publish a Web App |
> | Microsoft.Web/sites/restart/Action | Restart a Web App |
> | Microsoft.Web/sites/start/Action | Start a Web App |
> | Microsoft.Web/sites/stop/Action | Stop a Web App |
> | Microsoft.Web/sites/slotsswap/Action | Swap Web App deployment slots |
> | Microsoft.Web/sites/slotsdiffs/Action | Get differences in configuration between web app and slots |
> | Microsoft.Web/sites/applySlotConfig/Action | Apply web app slot configuration from target slot to the current web app |
> | Microsoft.Web/sites/resetSlotConfig/Action | Reset web app configuration |
> | Microsoft.Web/sites/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | microsoft.web/sites/functions/action | Functions Web Apps. |
> | microsoft.web/sites/listsyncfunctiontriggerstatus/action | List Sync Function Trigger Status. |
> | microsoft.web/sites/networktrace/action | Network Trace Web Apps. |
> | microsoft.web/sites/newpassword/action | Newpassword Web Apps. |
> | microsoft.web/sites/sync/action | Sync Web Apps. |
> | microsoft.web/sites/migratemysql/action | Migrate MySql Web Apps. |
> | microsoft.web/sites/recover/action | Recover Web Apps. |
> | microsoft.web/sites/restoresnapshot/action | Restore Web Apps Snapshots. |
> | microsoft.web/sites/restorefromdeletedapp/action | Restore Web Apps From Deleted App. |
> | microsoft.web/sites/syncfunctiontriggers/action | Sync Function Triggers. |
> | microsoft.web/sites/backups/action | Discovers an existing app backup that can be restored from a blob in Azure storage. |
> | microsoft.web/sites/containerlogs/action | Get Zipped Container Logs for Web App. |
> | microsoft.web/sites/restorefrombackupblob/action | Restore Web App From Backup Blob. |
> | microsoft.web/sites/analyzecustomhostname/read | Analyze Custom Hostname. |
> | microsoft.web/sites/backup/read | Get Web Apps Backup. |
> | microsoft.web/sites/backup/write | Update Web Apps Backup. |
> | Microsoft.Web/sites/backups/Read | Get the properties of a web app's backup |
> | microsoft.web/sites/backups/list/action | List Web Apps Backups. |
> | microsoft.web/sites/backups/restore/action | Restore Web Apps Backups. |
> | microsoft.web/sites/backups/delete | Delete Web Apps Backups. |
> | microsoft.web/sites/backups/write | Update Web Apps Backups. |
> | Microsoft.Web/sites/config/Read | Get Web App configuration settings |
> | Microsoft.Web/sites/config/list/Action | List Web App's security sensitive settings, such as publishing credentials, app settings and connection strings |
> | Microsoft.Web/sites/config/Write | Update Web App's configuration settings |
> | microsoft.web/sites/config/delete | Delete Web Apps Config. |
> | microsoft.web/sites/config/snapshots/read | Get Web Apps Config Snapshots. |
> | microsoft.web/sites/containerlogs/download/action | Download Web Apps Container Logs. |
> | microsoft.web/sites/continuouswebjobs/delete | Delete Web Apps Continuous Web Jobs. |
> | microsoft.web/sites/continuouswebjobs/read | Get Web Apps Continuous Web Jobs. |
> | microsoft.web/sites/continuouswebjobs/start/action | Start Web Apps Continuous Web Jobs. |
> | microsoft.web/sites/continuouswebjobs/stop/action | Stop Web Apps Continuous Web Jobs. |
> | microsoft.web/sites/deployments/delete | Delete Web Apps Deployments. |
> | microsoft.web/sites/deployments/read | Get Web Apps Deployments. |
> | microsoft.web/sites/deployments/write | Update Web Apps Deployments. |
> | microsoft.web/sites/deployments/log/read | Get Web Apps Deployments Log. |
> | microsoft.web/sites/detectors/read | Get Web Apps Detectors. |
> | microsoft.web/sites/diagnostics/read | Get Web Apps Diagnostics Categories. |
> | microsoft.web/sites/diagnostics/analyses/read | Get Web Apps Diagnostics Analysis. |
> | microsoft.web/sites/diagnostics/analyses/execute/Action | Run Web Apps Diagnostics Analysis. |
> | microsoft.web/sites/diagnostics/aspnetcore/read | Get Web Apps Diagnostics for ASP.NET Core app. |
> | microsoft.web/sites/diagnostics/autoheal/read | Get Web Apps Diagnostics Autoheal. |
> | microsoft.web/sites/diagnostics/deployment/read | Get Web Apps Diagnostics Deployment. |
> | microsoft.web/sites/diagnostics/deployments/read | Get Web Apps Diagnostics Deployments. |
> | microsoft.web/sites/diagnostics/detectors/read | Get Web Apps Diagnostics Detector. |
> | microsoft.web/sites/diagnostics/detectors/execute/Action | Run Web Apps Diagnostics Detector. |
> | microsoft.web/sites/diagnostics/failedrequestsperuri/read | Get Web Apps Diagnostics Failed Requests Per Uri. |
> | microsoft.web/sites/diagnostics/frebanalysis/read | Get Web Apps Diagnostics FREB Analysis. |
> | microsoft.web/sites/diagnostics/loganalyzer/read | Get Web Apps Diagnostics Log Analyzer. |
> | microsoft.web/sites/diagnostics/runtimeavailability/read | Get Web Apps Diagnostics Runtime Availability. |
> | microsoft.web/sites/diagnostics/servicehealth/read | Get Web Apps Diagnostics Service Health. |
> | microsoft.web/sites/diagnostics/sitecpuanalysis/read | Get Web Apps Diagnostics Site CPU Analysis. |
> | microsoft.web/sites/diagnostics/sitecrashes/read | Get Web Apps Diagnostics Site Crashes. |
> | microsoft.web/sites/diagnostics/sitelatency/read | Get Web Apps Diagnostics Site Latency. |
> | microsoft.web/sites/diagnostics/sitememoryanalysis/read | Get Web Apps Diagnostics Site Memory Analysis. |
> | microsoft.web/sites/diagnostics/siterestartsettingupdate/read | Get Web Apps Diagnostics Site Restart Setting Update. |
> | microsoft.web/sites/diagnostics/siterestartuserinitiated/read | Get Web Apps Diagnostics Site Restart User Initiated. |
> | microsoft.web/sites/diagnostics/siteswap/read | Get Web Apps Diagnostics Site Swap. |
> | microsoft.web/sites/diagnostics/threadcount/read | Get Web Apps Diagnostics Thread Count. |
> | microsoft.web/sites/diagnostics/workeravailability/read | Get Web Apps Diagnostics Workeravailability. |
> | microsoft.web/sites/diagnostics/workerprocessrecycle/read | Get Web Apps Diagnostics Worker Process Recycle. |
> | microsoft.web/sites/domainownershipidentifiers/read | Get Web Apps Domain Ownership Identifiers. |
> | microsoft.web/sites/domainownershipidentifiers/write | Update Web Apps Domain Ownership Identifiers. |
> | Microsoft.Web/sites/eventGridFilters/delete | Delete Event Grid Filter on web app. |
> | Microsoft.Web/sites/eventGridFilters/read | Get Event Grid Filter on web app. |
> | Microsoft.Web/sites/eventGridFilters/write | Put Event Grid Filter on web app. |
> | microsoft.web/sites/extensions/delete | Delete Web Apps Site Extensions. |
> | microsoft.web/sites/extensions/read | Get Web Apps Site Extensions. |
> | microsoft.web/sites/extensions/write | Update Web Apps Site Extensions. |
> | microsoft.web/sites/functions/delete | Delete Web Apps Functions. |
> | microsoft.web/sites/functions/listsecrets/action | List Function secrets. |
> | microsoft.web/sites/functions/listkeys/action | List Function keys. |
> | microsoft.web/sites/functions/read | Get Web Apps Functions. |
> | microsoft.web/sites/functions/write | Update Web Apps Functions. |
> | microsoft.web/sites/functions/keys/write | Update Function keys. |
> | microsoft.web/sites/functions/keys/delete | Delete Function keys. |
> | microsoft.web/sites/functions/masterkey/read | Get Web Apps Functions Masterkey. |
> | microsoft.web/sites/functions/properties/read | Read Web Apps Functions Properties. |
> | microsoft.web/sites/functions/properties/write | Update Web Apps Functions Properties. |
> | microsoft.web/sites/functions/token/read | Get Web Apps Functions Token. |
> | microsoft.web/sites/host/listkeys/action | List Functions Host keys. |
> | microsoft.web/sites/host/sync/action | Sync Function Triggers. |
> | microsoft.web/sites/host/listsyncstatus/action | List Sync Function Triggers Status. |
> | microsoft.web/sites/host/functionkeys/write | Update Functions Host Function keys. |
> | microsoft.web/sites/host/functionkeys/delete | Delete Functions Host Function keys. |
> | microsoft.web/sites/host/properties/read | Read Web Apps Functions Host Properties. |
> | microsoft.web/sites/host/systemkeys/write | Update Functions Host System keys. |
> | microsoft.web/sites/host/systemkeys/delete | Delete Functions Host System keys. |
> | microsoft.web/sites/hostnamebindings/delete | Delete Web Apps Hostname Bindings. |
> | microsoft.web/sites/hostnamebindings/read | Get Web Apps Hostname Bindings. |
> | microsoft.web/sites/hostnamebindings/write | Update Web Apps Hostname Bindings. |
> | Microsoft.Web/sites/hostruntime/host/action | Perform Function App runtime action like sync triggers, add functions, invoke functions, delete functions etc. |
> | microsoft.web/sites/hostruntime/functions/keys/read | Get Web Apps Hostruntime Functions Keys. |
> | microsoft.web/sites/hostruntime/host/read | Get Web Apps Hostruntime Host. |
> | Microsoft.Web/sites/hostruntime/host/_master/read | Get Function App's master key for admin operations |
> | microsoft.web/sites/hybridconnection/delete | Delete Web Apps Hybrid Connection. |
> | microsoft.web/sites/hybridconnection/read | Get Web Apps Hybrid Connection. |
> | microsoft.web/sites/hybridconnection/write | Update Web Apps Hybrid Connection. |
> | microsoft.web/sites/hybridconnectionnamespaces/relays/delete | Delete Web Apps Hybrid Connection Namespaces Relays. |
> | microsoft.web/sites/hybridconnectionnamespaces/relays/listkeys/action | List Keys Web Apps Hybrid Connection Namespaces Relays. |
> | microsoft.web/sites/hybridconnectionnamespaces/relays/write | Update Web Apps Hybrid Connection Namespaces Relays. |
> | microsoft.web/sites/hybridconnectionnamespaces/relays/read | Get Web Apps Hybrid Connection Namespaces Relays. |
> | microsoft.web/sites/hybridconnectionrelays/read | Get Web Apps Hybrid Connection Relays. |
> | microsoft.web/sites/instances/read | Get Web Apps Instances. |
> | microsoft.web/sites/instances/deployments/read | Get Web Apps Instances Deployments. |
> | microsoft.web/sites/instances/deployments/delete | Delete Web Apps Instances Deployments. |
> | microsoft.web/sites/instances/extensions/read | Get Web Apps Instances Extensions. |
> | microsoft.web/sites/instances/extensions/log/read | Get Web Apps Instances Extensions Log. |
> | microsoft.web/sites/instances/extensions/processes/read | Get Web Apps Instances Extensions Processes. |
> | microsoft.web/sites/instances/processes/delete | Delete Web Apps Instances Processes. |
> | microsoft.web/sites/instances/processes/read | Get Web Apps Instances Processes. |
> | microsoft.web/sites/instances/processes/modules/read | Get Web Apps Instances Processes Modules. |
> | microsoft.web/sites/instances/processes/threads/read | Get Web Apps Instances Processes Threads. |
> | microsoft.web/sites/metricdefinitions/read | Get Web Apps Metric Definitions. |
> | microsoft.web/sites/metrics/read | Get Web Apps Metrics. |
> | microsoft.web/sites/metricsdefinitions/read | Get Web Apps Metrics Definitions. |
> | microsoft.web/sites/migratemysql/read | Get Web Apps Migrate MySql. |
> | microsoft.web/sites/networktraces/operationresults/read | Get Web Apps Network Trace Operation Results. |
> | microsoft.web/sites/operationresults/read | Get Web Apps Operation Results. |
> | microsoft.web/sites/operations/read | Get Web Apps Operations. |
> | microsoft.web/sites/perfcounters/read | Get Web Apps Performance Counters. |
> | microsoft.web/sites/premieraddons/delete | Delete Web Apps Premier Addons. |
> | microsoft.web/sites/premieraddons/read | Get Web Apps Premier Addons. |
> | microsoft.web/sites/premieraddons/write | Update Web Apps Premier Addons. |
> | microsoft.web/sites/privateaccess/read | Get data around private site access enablement and authorized Virtual Networks that can access the site. |
> | microsoft.web/sites/processes/read | Get Web Apps Processes. |
> | microsoft.web/sites/processes/modules/read | Get Web Apps Processes Modules. |
> | microsoft.web/sites/processes/threads/read | Get Web Apps Processes Threads. |
> | microsoft.web/sites/publiccertificates/delete | Delete Web Apps Public Certificates. |
> | microsoft.web/sites/publiccertificates/read | Get Web Apps Public Certificates. |
> | microsoft.web/sites/publiccertificates/write | Update Web Apps Public Certificates. |
> | microsoft.web/sites/publishxml/read | Get Web Apps Publishing XML. |
> | microsoft.web/sites/recommendationhistory/read | Get Web Apps Recommendation History. |
> | Microsoft.Web/sites/recommendations/Read | Get the list of recommendations for web app. |
> | microsoft.web/sites/recommendations/disable/action | Disable Web Apps Recommendations. |
> | microsoft.web/sites/resourcehealthmetadata/read | Get Web Apps Resource Health Metadata. |
> | microsoft.web/sites/restore/read | Get Web Apps Restore. |
> | microsoft.web/sites/restore/write | Restore Web Apps. |
> | microsoft.web/sites/siteextensions/delete | Delete Web Apps Site Extensions. |
> | microsoft.web/sites/siteextensions/read | Get Web Apps Site Extensions. |
> | microsoft.web/sites/siteextensions/write | Update Web Apps Site Extensions. |
> | Microsoft.Web/sites/slots/Write | Create a new Web App Slot or update an existing one |
> | Microsoft.Web/sites/slots/Delete | Delete an existing Web App Slot |
> | Microsoft.Web/sites/slots/backup/Action | Create new Web App Slot backup. |
> | Microsoft.Web/sites/slots/publishxml/Action | Get publishing profile xml for Web App Slot |
> | Microsoft.Web/sites/slots/publish/Action | Publish a Web App Slot |
> | Microsoft.Web/sites/slots/restart/Action | Restart a Web App Slot |
> | Microsoft.Web/sites/slots/start/Action | Start a Web App Slot |
> | Microsoft.Web/sites/slots/stop/Action | Stop a Web App Slot |
> | Microsoft.Web/sites/slots/slotsswap/Action | Swap Web App deployment slots |
> | Microsoft.Web/sites/slots/slotsdiffs/Action | Get differences in configuration between web app and slots |
> | Microsoft.Web/sites/slots/applySlotConfig/Action | Apply web app slot configuration from target slot to the current slot. |
> | Microsoft.Web/sites/slots/resetSlotConfig/Action | Reset web app slot configuration |
> | Microsoft.Web/sites/slots/Read | Get the properties of a Web App deployment slot |
> | microsoft.web/sites/slots/newpassword/action | Newpassword Web Apps Slots. |
> | microsoft.web/sites/slots/sync/action | Sync Web Apps Slots. |
> | microsoft.web/sites/slots/networktrace/action | Network Trace Web Apps Slots. |
> | microsoft.web/sites/slots/recover/action | Recover Web Apps Slots. |
> | microsoft.web/sites/slots/restoresnapshot/action | Restore Web Apps Slots Snapshots. |
> | microsoft.web/sites/slots/restorefromdeletedapp/action | Restore Web App Slots From Deleted App. |
> | microsoft.web/sites/slots/backups/action | Discover Web Apps Slots Backups. |
> | microsoft.web/sites/slots/containerlogs/action | Get Zipped Container Logs for Web App Slot. |
> | microsoft.web/sites/slots/restorefrombackupblob/action | Restore Web Apps Slot From Backup Blob. |
> | microsoft.web/sites/slots/analyzecustomhostname/read | Get Web Apps Slots Analyze Custom Hostname. |
> | microsoft.web/sites/slots/backup/write | Update Web Apps Slots Backup. |
> | microsoft.web/sites/slots/backup/read | Get Web Apps Slots Backup. |
> | Microsoft.Web/sites/slots/backups/Read | Get the properties of a web app slots' backup |
> | microsoft.web/sites/slots/backups/list/action | List Web Apps Slots Backups. |
> | microsoft.web/sites/slots/backups/restore/action | Restore Web Apps Slots Backups. |
> | microsoft.web/sites/slots/backups/delete | Delete Web Apps Slots Backups. |
> | Microsoft.Web/sites/slots/config/Read | Get Web App Slot's configuration settings |
> | Microsoft.Web/sites/slots/config/list/Action | List Web App Slot's security sensitive settings, such as publishing credentials, app settings and connection strings |
> | Microsoft.Web/sites/slots/config/Write | Update Web App Slot's configuration settings |
> | microsoft.web/sites/slots/config/delete | Delete Web Apps Slots Config. |
> | microsoft.web/sites/slots/containerlogs/download/action | Download Web Apps Slots Container Logs. |
> | microsoft.web/sites/slots/continuouswebjobs/delete | Delete Web Apps Slots Continuous Web Jobs. |
> | microsoft.web/sites/slots/continuouswebjobs/read | Get Web Apps Slots Continuous Web Jobs. |
> | microsoft.web/sites/slots/continuouswebjobs/start/action | Start Web Apps Slots Continuous Web Jobs. |
> | microsoft.web/sites/slots/continuouswebjobs/stop/action | Stop Web Apps Slots Continuous Web Jobs. |
> | microsoft.web/sites/slots/deployments/delete | Delete Web Apps Slots Deployments. |
> | microsoft.web/sites/slots/deployments/read | Get Web Apps Slots Deployments. |
> | microsoft.web/sites/slots/deployments/write | Update Web Apps Slots Deployments. |
> | microsoft.web/sites/slots/deployments/log/read | Get Web Apps Slots Deployments Log. |
> | microsoft.web/sites/slots/detectors/read | Get Web Apps Slots Detectors. |
> | microsoft.web/sites/slots/diagnostics/read | Get Web Apps Slots Diagnostics. |
> | microsoft.web/sites/slots/diagnostics/analyses/read | Get Web Apps Slots Diagnostics Analysis. |
> | microsoft.web/sites/slots/diagnostics/analyses/execute/Action | Run Web Apps Slots Diagnostics Analysis. |
> | microsoft.web/sites/slots/diagnostics/aspnetcore/read | Get Web Apps Slots Diagnostics for ASP.NET Core app. |
> | microsoft.web/sites/slots/diagnostics/autoheal/read | Get Web Apps Slots Diagnostics Autoheal. |
> | microsoft.web/sites/slots/diagnostics/deployment/read | Get Web Apps Slots Diagnostics Deployment. |
> | microsoft.web/sites/slots/diagnostics/deployments/read | Get Web Apps Slots Diagnostics Deployments. |
> | microsoft.web/sites/slots/diagnostics/detectors/read | Get Web Apps Slots Diagnostics Detector. |
> | microsoft.web/sites/slots/diagnostics/detectors/execute/Action | Run Web Apps Slots Diagnostics Detector. |
> | microsoft.web/sites/slots/diagnostics/frebanalysis/read | Get Web Apps Slots Diagnostics FREB Analysis. |
> | microsoft.web/sites/slots/diagnostics/loganalyzer/read | Get Web Apps Slots Diagnostics Log Analyzer. |
> | microsoft.web/sites/slots/diagnostics/runtimeavailability/read | Get Web Apps Slots Diagnostics Runtime Availability. |
> | microsoft.web/sites/slots/diagnostics/servicehealth/read | Get Web Apps Slots Diagnostics Service Health. |
> | microsoft.web/sites/slots/diagnostics/sitecpuanalysis/read | Get Web Apps Slots Diagnostics Site CPU Analysis. |
> | microsoft.web/sites/slots/diagnostics/sitecrashes/read | Get Web Apps Slots Diagnostics Site Crashes. |
> | microsoft.web/sites/slots/diagnostics/sitelatency/read | Get Web Apps Slots Diagnostics Site Latency. |
> | microsoft.web/sites/slots/diagnostics/sitememoryanalysis/read | Get Web Apps Slots Diagnostics Site Memory Analysis. |
> | microsoft.web/sites/slots/diagnostics/siterestartsettingupdate/read | Get Web Apps Slots Diagnostics Site Restart Setting Update. |
> | microsoft.web/sites/slots/diagnostics/siterestartuserinitiated/read | Get Web Apps Slots Diagnostics Site Restart User Initiated. |
> | microsoft.web/sites/slots/diagnostics/siteswap/read | Get Web Apps Slots Diagnostics Site Swap. |
> | microsoft.web/sites/slots/diagnostics/threadcount/read | Get Web Apps Slots Diagnostics Thread Count. |
> | microsoft.web/sites/slots/diagnostics/workeravailability/read | Get Web Apps Slots Diagnostics Workeravailability. |
> | microsoft.web/sites/slots/diagnostics/workerprocessrecycle/read | Get Web Apps Slots Diagnostics Worker Process Recycle. |
> | microsoft.web/sites/slots/domainownershipidentifiers/read | Get Web Apps Slots Domain Ownership Identifiers. |
> | microsoft.web/sites/slots/extensions/read | Get Web Apps Slots Extensions. |
> | microsoft.web/sites/slots/extensions/write | Update Web Apps Slots Extensions. |
> | microsoft.web/sites/slots/functions/read | Get Web Apps Slots Functions. |
> | microsoft.web/sites/slots/functions/listsecrets/action | List Secrets Web Apps Slots Functions. |
> | microsoft.web/sites/slots/hostnamebindings/delete | Delete Web Apps Slots Hostname Bindings. |
> | microsoft.web/sites/slots/hostnamebindings/read | Get Web Apps Slots Hostname Bindings. |
> | microsoft.web/sites/slots/hostnamebindings/write | Update Web Apps Slots Hostname Bindings. |
> | microsoft.web/sites/slots/hybridconnection/delete | Delete Web Apps Slots Hybrid Connection. |
> | microsoft.web/sites/slots/hybridconnection/read | Get Web Apps Slots Hybrid Connection. |
> | microsoft.web/sites/slots/hybridconnection/write | Update Web Apps Slots Hybrid Connection. |
> | microsoft.web/sites/slots/hybridconnectionnamespaces/relays/delete | Delete Web Apps Slots Hybrid Connection Namespaces Relays. |
> | microsoft.web/sites/slots/hybridconnectionnamespaces/relays/write | Update Web Apps Slots Hybrid Connection Namespaces Relays. |
> | microsoft.web/sites/slots/hybridconnectionrelays/read | Get Web Apps Slots Hybrid Connection Relays. |
> | microsoft.web/sites/slots/instances/read | Get Web Apps Slots Instances. |
> | microsoft.web/sites/slots/instances/deployments/read | Get Web Apps Slots Instances Deployments. |
> | microsoft.web/sites/slots/instances/processes/read | Get Web Apps Slots Instances Processes. |
> | microsoft.web/sites/slots/instances/processes/delete | Delete Web Apps Slots Instances Processes. |
> | microsoft.web/sites/slots/metricdefinitions/read | Get Web Apps Slots Metric Definitions. |
> | microsoft.web/sites/slots/metrics/read | Get Web Apps Slots Metrics. |
> | microsoft.web/sites/slots/migratemysql/read | Get Web Apps Slots Migrate MySql. |
> | microsoft.web/sites/slots/networktraces/operationresults/read | Get Web Apps Slots Network Trace Operation Results. |
> | microsoft.web/sites/slots/operationresults/read | Get Web Apps Slots Operation Results. |
> | microsoft.web/sites/slots/operations/read | Get Web Apps Slots Operations. |
> | microsoft.web/sites/slots/perfcounters/read | Get Web Apps Slots Performance Counters. |
> | microsoft.web/sites/slots/phplogging/read | Get Web Apps Slots Phplogging. |
> | microsoft.web/sites/slots/premieraddons/delete | Delete Web Apps Slots Premier Addons. |
> | microsoft.web/sites/slots/premieraddons/read | Get Web Apps Slots Premier Addons. |
> | microsoft.web/sites/slots/premieraddons/write | Update Web Apps Slots Premier Addons. |
> | microsoft.web/sites/slots/processes/read | Get Web Apps Slots Processes. |
> | microsoft.web/sites/slots/publiccertificates/read | Get Web Apps Slots Public Certificates. |
> | microsoft.web/sites/slots/publiccertificates/write | Create or Update Web Apps Slots Public Certificates. |
> | microsoft.web/sites/slots/publiccertificates/delete | Delete Web Apps Slots Public Certificates. |
> | microsoft.web/sites/slots/resourcehealthmetadata/read | Get Web Apps Slots Resource Health Metadata. |
> | microsoft.web/sites/slots/restore/read | Get Web Apps Slots Restore. |
> | microsoft.web/sites/slots/restore/write | Restore Web Apps Slots. |
> | microsoft.web/sites/slots/siteextensions/delete | Delete Web Apps Slots Site Extensions. |
> | microsoft.web/sites/slots/siteextensions/read | Get Web Apps Slots Site Extensions. |
> | microsoft.web/sites/slots/siteextensions/write | Update Web Apps Slots Site Extensions. |
> | microsoft.web/sites/slots/snapshots/read | Get Web Apps Slots Snapshots. |
> | Microsoft.Web/sites/slots/sourcecontrols/Read | Get Web App Slot's source control configuration settings |
> | Microsoft.Web/sites/slots/sourcecontrols/Write | Update Web App Slot's source control configuration settings |
> | Microsoft.Web/sites/slots/sourcecontrols/Delete | Delete Web App Slot's source control configuration settings |
> | microsoft.web/sites/slots/triggeredwebjobs/delete | Delete Web Apps Slots Triggered WebJobs. |
> | microsoft.web/sites/slots/triggeredwebjobs/read | Get Web Apps Slots Triggered WebJobs. |
> | microsoft.web/sites/slots/triggeredwebjobs/run/action | Run Web Apps Slots Triggered WebJobs. |
> | microsoft.web/sites/slots/usages/read | Get Web Apps Slots Usages. |
> | microsoft.web/sites/slots/virtualnetworkconnections/delete | Delete Web Apps Slots Virtual Network Connections. |
> | microsoft.web/sites/slots/virtualnetworkconnections/read | Get Web Apps Slots Virtual Network Connections. |
> | microsoft.web/sites/slots/virtualnetworkconnections/write | Update Web Apps Slots Virtual Network Connections. |
> | microsoft.web/sites/slots/virtualnetworkconnections/gateways/write | Update Web Apps Slots Virtual Network Connections Gateways. |
> | microsoft.web/sites/slots/webjobs/read | Get Web Apps Slots WebJobs. |
> | microsoft.web/sites/snapshots/read | Get Web Apps Snapshots. |
> | Microsoft.Web/sites/sourcecontrols/Read | Get Web App's source control configuration settings |
> | Microsoft.Web/sites/sourcecontrols/Write | Update Web App's source control configuration settings |
> | Microsoft.Web/sites/sourcecontrols/Delete | Delete Web App's source control configuration settings |
> | microsoft.web/sites/triggeredwebjobs/delete | Delete Web Apps Triggered WebJobs. |
> | microsoft.web/sites/triggeredwebjobs/read | Get Web Apps Triggered WebJobs. |
> | microsoft.web/sites/triggeredwebjobs/run/action | Run Web Apps Triggered WebJobs. |
> | microsoft.web/sites/triggeredwebjobs/history/read | Get Web Apps Triggered WebJobs History. |
> | microsoft.web/sites/usages/read | Get Web Apps Usages. |
> | microsoft.web/sites/virtualnetworkconnections/delete | Delete Web Apps Virtual Network Connections. |
> | microsoft.web/sites/virtualnetworkconnections/read | Get Web Apps Virtual Network Connections. |
> | microsoft.web/sites/virtualnetworkconnections/write | Update Web Apps Virtual Network Connections. |
> | microsoft.web/sites/virtualnetworkconnections/gateways/read | Get Web Apps Virtual Network Connections Gateways. |
> | microsoft.web/sites/virtualnetworkconnections/gateways/write | Update Web Apps Virtual Network Connections Gateways. |
> | microsoft.web/sites/webjobs/read | Get Web Apps WebJobs. |
> | microsoft.web/skus/read | Get SKUs. |
> | microsoft.web/sourcecontrols/read | Get Source Controls. |
> | microsoft.web/sourcecontrols/write | Update Source Controls. |

## Containers

### Microsoft.ContainerInstance

Azure service: [Container Instances](../container-instances/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ContainerInstance/register/action | Registers the subscription for the container instance resource provider and enables the creation of container groups. |
> | Microsoft.ContainerInstance/containerGroups/read | Get all container groups. |
> | Microsoft.ContainerInstance/containerGroups/write | Create or update a specific container group. |
> | Microsoft.ContainerInstance/containerGroups/delete | Delete the specific container group. |
> | Microsoft.ContainerInstance/containerGroups/restart/action | Restarts a specific container group. |
> | Microsoft.ContainerInstance/containerGroups/stop/action | Stops a specific container group. Compute resources will be deallocated and billing will stop. |
> | Microsoft.ContainerInstance/containerGroups/start/action | Starts a specific container group. |
> | Microsoft.ContainerInstance/containerGroups/containers/exec/action | Exec into a specific container. |
> | Microsoft.ContainerInstance/containerGroups/containers/buildlogs/read | Get build logs for a specific container. |
> | Microsoft.ContainerInstance/containerGroups/containers/logs/read | Get logs for a specific container. |
> | Microsoft.ContainerInstance/containerGroups/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the container group. |
> | Microsoft.ContainerInstance/containerGroups/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the container group. |
> | Microsoft.ContainerInstance/containerGroups/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for container group. |
> | Microsoft.ContainerInstance/locations/deleteVirtualNetworkOrSubnets/action | Notifies Microsoft.ContainerInstance that virtual network or subnet is being deleted. |
> | Microsoft.ContainerInstance/locations/cachedImages/read | Gets the cached images for the subscription in a region. |
> | Microsoft.ContainerInstance/locations/capabilities/read | Get the capabilities for a region. |
> | Microsoft.ContainerInstance/locations/operationResults/read | Get async operation result |
> | Microsoft.ContainerInstance/locations/operations/read | List the operations for Azure Container Instance service. |
> | Microsoft.ContainerInstance/locations/usages/read | Get the usage for a specific region. |
> | Microsoft.ContainerInstance/operations/read | List the operations for Azure Container Instance service. |
> | Microsoft.ContainerInstance/serviceassociationlinks/delete | Delete the service association link created by azure container instance resource provider on a subnet. |

### Microsoft.ContainerRegistry

Azure service: [Container Registry](../container-registry/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ContainerRegistry/register/action | Registers the subscription for the container registry resource provider and enables the creation of container registries. |
> | Microsoft.ContainerRegistry/checkNameAvailability/read | Checks whether the container registry name is available for use. |
> | Microsoft.ContainerRegistry/locations/deleteVirtualNetworkOrSubnets/action | Notifies Microsoft.ContainerRegistry that virtual network or subnet is being deleted |
> | Microsoft.ContainerRegistry/locations/operationResults/read | Gets an async operation result |
> | Microsoft.ContainerRegistry/operations/read | Lists all of the available Azure Container Registry REST API operations |
> | Microsoft.ContainerRegistry/registries/read | Gets the properties of the specified container registry or lists all the container registries under the specified resource group or subscription. |
> | Microsoft.ContainerRegistry/registries/write | Creates or updates a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/delete | Deletes a container registry. |
> | Microsoft.ContainerRegistry/registries/listCredentials/action | Lists the login credentials for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/regenerateCredential/action | Regenerates one of the login credentials for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/generateCredentials/action | Generate keys for a token of a specified container registry. |
> | Microsoft.ContainerRegistry/registries/importImage/action | Import Image to container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/getBuildSourceUploadUrl/action | Gets the upload location for the user to be able to upload the source. |
> | Microsoft.ContainerRegistry/registries/queueBuild/action | Creates a new build based on the request parameters and add it to the build queue. |
> | Microsoft.ContainerRegistry/registries/listBuildSourceUploadUrl/action | Get source upload url location for a container registry. |
> | Microsoft.ContainerRegistry/registries/scheduleRun/action | Schedule a run against a container registry. |
> | Microsoft.ContainerRegistry/registries/agentpools/listQueueStatus/action | List all queue status of an agentpool for a container registry. |
> | Microsoft.ContainerRegistry/registries/artifacts/delete | Delete artifact in a container registry. |
> | Microsoft.ContainerRegistry/registries/builds/read | Gets the properties of the specified build or lists all the builds for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/builds/write | Updates a build for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/builds/getLogLink/action | Gets a link to download the build logs. |
> | Microsoft.ContainerRegistry/registries/builds/cancel/action | Cancels an existing build. |
> | Microsoft.ContainerRegistry/registries/buildTasks/read | Gets the properties of the specified build task or lists all the build tasks for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/buildTasks/write | Creates or updates a build task for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/buildTasks/delete | Deletes a build task from a container registry. |
> | Microsoft.ContainerRegistry/registries/buildTasks/listSourceRepositoryProperties/action | Lists the source control properties for a build task. |
> | Microsoft.ContainerRegistry/registries/buildTasks/steps/read | Gets the properties of the specified build step or lists all the build steps for the specified build task. |
> | Microsoft.ContainerRegistry/registries/buildTasks/steps/write | Creates or updates a build step for a build task with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/buildTasks/steps/delete | Deletes a build step from a build task. |
> | Microsoft.ContainerRegistry/registries/buildTasks/steps/listBuildArguments/action | Lists the build arguments for a build step including the secret arguments. |
> | Microsoft.ContainerRegistry/registries/eventGridFilters/read | Gets the properties of the specified event grid filter or lists all the event grid filters for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/eventGridFilters/write | Creates or updates an event grid filter for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/eventGridFilters/delete | Deletes an event grid filter from a container registry. |
> | Microsoft.ContainerRegistry/registries/listPolicies/read | Lists the policies for the specified container registry |
> | Microsoft.ContainerRegistry/registries/listUsages/read | Lists the quota usages for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/metadata/read | Gets the metadata of a specific repository for a container registry |
> | Microsoft.ContainerRegistry/registries/metadata/write | Updates the metadata of a repository for a container registry |
> | Microsoft.ContainerRegistry/registries/operationStatuses/read | Gets a registry async operation status |
> | Microsoft.ContainerRegistry/registries/privateEndpointConnectionProxies/validate/action | Validate the Private Endpoint Connection Proxy (NRP only) |
> | Microsoft.ContainerRegistry/registries/privateEndpointConnectionProxies/read | Get the Private Endpoint Connection Proxy (NRP only) |
> | Microsoft.ContainerRegistry/registries/privateEndpointConnectionProxies/write | Create the Private Endpoint Connection Proxy (NRP only) |
> | Microsoft.ContainerRegistry/registries/privateEndpointConnectionProxies/delete | Delete the Private Endpoint Connection Proxy (NRP only) |
> | Microsoft.ContainerRegistry/registries/privateEndpointConnectionProxies/operationStatuses/read | Get Private Endpoint Connection Proxy Async Operation Status |
> | Microsoft.ContainerRegistry/registries/pull/read | Pull or Get images from a container registry. |
> | Microsoft.ContainerRegistry/registries/push/write | Push or Write images to a container registry. |
> | Microsoft.ContainerRegistry/registries/quarantine/read | Pull or Get quarantined images from container registry |
> | Microsoft.ContainerRegistry/registries/quarantine/write | Write/Modify quarantine state of quarantined images |
> | Microsoft.ContainerRegistry/registries/replications/read | Gets the properties of the specified replication or lists all the replications for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/replications/write | Creates or updates a replication for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/replications/delete | Deletes a replication from a container registry. |
> | Microsoft.ContainerRegistry/registries/replications/operationStatuses/read | Gets a replication async operation status |
> | Microsoft.ContainerRegistry/registries/runs/read | Gets the properties of a run against a container registry or list runs. |
> | Microsoft.ContainerRegistry/registries/runs/write | Updates a run. |
> | Microsoft.ContainerRegistry/registries/runs/listLogSasUrl/action | Gets the log SAS URL for a run. |
> | Microsoft.ContainerRegistry/registries/runs/cancel/action | Cancel an existing run. |
> | Microsoft.ContainerRegistry/registries/scopeMaps/read | Gets the properties of the specified scope map or lists all the scope maps for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/scopeMaps/write | Creates or updates a scope map for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/scopeMaps/delete | Deletes a scope map from a container registry. |
> | Microsoft.ContainerRegistry/registries/scopeMaps/operationStatuses/read | Gets a scope map async operation status. |
> | Microsoft.ContainerRegistry/registries/sign/write | Push/Pull content trust metadata for a container registry. |
> | Microsoft.ContainerRegistry/registries/taskruns/listDetails/action | List all details of a taskrun for a container registry. |
> | Microsoft.ContainerRegistry/registries/tasks/read | Gets a task for a container registry or list all tasks. |
> | Microsoft.ContainerRegistry/registries/tasks/write | Creates or Updates a task for a container registry. |
> | Microsoft.ContainerRegistry/registries/tasks/delete | Deletes a task for a container registry. |
> | Microsoft.ContainerRegistry/registries/tasks/listDetails/action | List all details of a task for a container registry. |
> | Microsoft.ContainerRegistry/registries/tokens/read | Gets the properties of the specified token or lists all the tokens for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/tokens/write | Creates or updates a token for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/tokens/delete | Deletes a token from a container registry. |
> | Microsoft.ContainerRegistry/registries/tokens/operationStatuses/read | Gets a token async operation status. |
> | Microsoft.ContainerRegistry/registries/updatePolicies/write | Updates the policies for the specified container registry |
> | Microsoft.ContainerRegistry/registries/webhooks/read | Gets the properties of the specified webhook or lists all the webhooks for the specified container registry. |
> | Microsoft.ContainerRegistry/registries/webhooks/write | Creates or updates a webhook for a container registry with the specified parameters. |
> | Microsoft.ContainerRegistry/registries/webhooks/delete | Deletes a webhook from a container registry. |
> | Microsoft.ContainerRegistry/registries/webhooks/getCallbackConfig/action | Gets the configuration of service URI and custom headers for the webhook. |
> | Microsoft.ContainerRegistry/registries/webhooks/ping/action | Triggers a ping event to be sent to the webhook. |
> | Microsoft.ContainerRegistry/registries/webhooks/listEvents/action | Lists recent events for the specified webhook. |
> | Microsoft.ContainerRegistry/registries/webhooks/operationStatuses/read | Gets a webhook async operation status |

### Microsoft.ContainerService

Azure service: [Azure Kubernetes Service (AKS)](../aks/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ContainerService/register/action | Registers Subscription with Microsoft.ContainerService resource provider |
> | Microsoft.ContainerService/unregister/action | Unregisters Subscription with Microsoft.ContainerService resource provider |
> | Microsoft.ContainerService/containerServices/read | Get a container service |
> | Microsoft.ContainerService/containerServices/write | Creates a new container service or updates an existing one |
> | Microsoft.ContainerService/containerServices/delete | Deletes a container service |
> | Microsoft.ContainerService/locations/operationresults/read | Gets the status of an asynchronous operation result |
> | Microsoft.ContainerService/locations/operations/read | Gets the status of an asynchronous operation |
> | Microsoft.ContainerService/locations/orchestrators/read | Lists the supported orchestrators |
> | Microsoft.ContainerService/managedClusters/read | Get a managed cluster |
> | Microsoft.ContainerService/managedClusters/write | Creates a new managed cluster or updates an existing one |
> | Microsoft.ContainerService/managedClusters/delete | Deletes a managed cluster |
> | Microsoft.ContainerService/managedClusters/listClusterAdminCredential/action | List the clusterAdmin credential of a managed cluster |
> | Microsoft.ContainerService/managedClusters/listClusterUserCredential/action | List the clusterUser credential of a managed cluster |
> | Microsoft.ContainerService/managedClusters/listClusterMonitoringUserCredential/action | List the clusterMonitoringUser credential of a managed cluster |
> | Microsoft.ContainerService/managedClusters/resetServicePrincipalProfile/action | Reset the service principal profile of a managed cluster |
> | Microsoft.ContainerService/managedClusters/resetAADProfile/action | Reset the AAD profile of a managed cluster |
> | Microsoft.ContainerService/managedClusters/rotateClusterCertificates/action | Rotate certificates of a managed cluster |
> | Microsoft.ContainerService/managedClusters/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | Microsoft.ContainerService/managedClusters/accessProfiles/read | Get a managed cluster access profile by role name |
> | Microsoft.ContainerService/managedClusters/accessProfiles/listCredential/action | Get a managed cluster access profile by role name using list credential |
> | Microsoft.ContainerService/managedClusters/agentPools/read | Gets an agent pool |
> | Microsoft.ContainerService/managedClusters/agentPools/write | Creates a new agent pool or updates an existing one |
> | Microsoft.ContainerService/managedClusters/agentPools/delete | Deletes an agent pool |
> | Microsoft.ContainerService/managedClusters/agentPools/upgradeProfiles/read | Gets the upgrade profile of the Agent Pool |
> | Microsoft.ContainerService/managedClusters/availableAgentPoolVersions/read | Gets the available agent pool versions of the cluster |
> | Microsoft.ContainerService/managedClusters/detectors/read | Get Managed Cluster Detector |
> | Microsoft.ContainerService/managedClusters/diagnosticsState/read | Gets the diagnostics state of the cluster |
> | Microsoft.ContainerService/managedClusters/upgradeProfiles/read | Gets the upgrade profile of the cluster |
> | Microsoft.ContainerService/openShiftClusters/read | Get an Open Shift Cluster |
> | Microsoft.ContainerService/openShiftClusters/write | Creates a new Open Shift Cluster or updates an existing one |
> | Microsoft.ContainerService/openShiftClusters/delete | Delete an Open Shift Cluster |
> | Microsoft.ContainerService/openShiftManagedClusters/read | Get an Open Shift Managed Cluster |
> | Microsoft.ContainerService/openShiftManagedClusters/write | Creates a new Open Shift Managed Cluster or updates an existing one |
> | Microsoft.ContainerService/openShiftManagedClusters/delete | Delete an Open Shift Managed Cluster |
> | Microsoft.ContainerService/operations/read | Lists operations available on Microsoft.ContainerService resource provider |

### Microsoft.DevSpaces

Azure service: [Azure Dev Spaces](../dev-spaces/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DevSpaces/register/action | Register Microsoft Dev Spaces resource provider with a subscription |
> | Microsoft.DevSpaces/controllers/read | Read Azure Dev Spaces Controller properties |
> | Microsoft.DevSpaces/controllers/write | Create or Update Azure Dev Spaces Controller properties |
> | Microsoft.DevSpaces/controllers/delete | Delete Azure Dev Spaces Controller and dataplane services |
> | Microsoft.DevSpaces/controllers/listConnectionDetails/action | List connection details for the Azure Dev Spaces Controller's infrastructure |
> | Microsoft.DevSpaces/locations/checkContainerHostMapping/action | Check existing controller mapping for a container host |
> | Microsoft.DevSpaces/locations/checkContainerHostMapping/read | Check existing controller mapping for a container host |
> | Microsoft.DevSpaces/locations/operationresults/read | Read status for an asynchronous operation |

## Databases

### Microsoft.Cache

Azure service: [Azure Cache for Redis](../azure-cache-for-redis/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Cache/checknameavailability/action | Checks if a name is available for use with a new Redis Cache |
> | Microsoft.Cache/register/action | Registers the 'Microsoft.Cache' resource provider with a subscription |
> | Microsoft.Cache/unregister/action | Unregisters the 'Microsoft.Cache' resource provider with a subscription |
> | Microsoft.Cache/locations/operationresults/read | Gets the result of a long running operation for which the 'Location' header was previously returned to the client |
> | Microsoft.Cache/operations/read | Lists the operations that 'Microsoft.Cache' provider supports. |
> | Microsoft.Cache/redis/write | Modify the Redis Cache's settings and configuration in the management portal |
> | Microsoft.Cache/redis/read | View the Redis Cache's settings and configuration in the management portal |
> | Microsoft.Cache/redis/delete | Delete the entire Redis Cache |
> | Microsoft.Cache/redis/listKeys/action | View the value of Redis Cache access keys in the management portal |
> | Microsoft.Cache/redis/regenerateKey/action | Change the value of Redis Cache access keys in the management portal |
> | Microsoft.Cache/redis/import/action | Import data of a specified format from multiple blobs into Redis |
> | Microsoft.Cache/redis/export/action | Export Redis data to prefixed storage blobs in specified format |
> | Microsoft.Cache/redis/forceReboot/action | Force reboot a cache instance, potentially with data loss. |
> | Microsoft.Cache/redis/stop/action | Stop a cache instance. |
> | Microsoft.Cache/redis/start/action | Start a cache instance. |
> | Microsoft.Cache/redis/firewallRules/read | Get the IP firewall rules of a Redis Cache |
> | Microsoft.Cache/redis/firewallRules/write | Edit the IP firewall rules of a Redis Cache |
> | Microsoft.Cache/redis/firewallRules/delete | Delete IP firewall rules of a Redis Cache |
> | Microsoft.Cache/redis/linkedservers/read | Get Linked Servers associated with a redis cache. |
> | Microsoft.Cache/redis/linkedservers/write | Add Linked Server to a Redis Cache |
> | Microsoft.Cache/redis/linkedservers/delete | Delete Linked Server from a Redis Cache |
> | Microsoft.Cache/redis/metricDefinitions/read | Gets the available metrics for a Redis Cache |
> | Microsoft.Cache/redis/patchSchedules/read | Gets the patching schedule of a Redis Cache |
> | Microsoft.Cache/redis/patchSchedules/write | Modify the patching schedule of a Redis Cache |
> | Microsoft.Cache/redis/patchSchedules/delete | Delete the patch schedule of a Redis Cache |

### Microsoft.DataFactory

Azure service: [Data Factory](../data-factory/index.yml)

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
> | Microsoft.DataFactory/factories/getDataPlaneAccess/action | Gets access to ADF DataPlane service. |
> | Microsoft.DataFactory/factories/getGitHubAccessToken/action | Gets GitHub access token. |
> | Microsoft.DataFactory/factories/querytriggerruns/action | Queries the Trigger Runs. |
> | Microsoft.DataFactory/factories/querypipelineruns/action | Queries the Pipeline Runs. |
> | Microsoft.DataFactory/factories/querydebugpipelineruns/action | Queries the Debug Pipeline Runs. |
> | Microsoft.DataFactory/factories/dataflows/read | Reads Data Flow. |
> | Microsoft.DataFactory/factories/dataflows/delete | Deletes Data Flow. |
> | Microsoft.DataFactory/factories/dataflows/write | Create or update Data Flow |
> | Microsoft.DataFactory/factories/datasets/read | Reads any Dataset. |
> | Microsoft.DataFactory/factories/datasets/delete | Deletes any Dataset. |
> | Microsoft.DataFactory/factories/datasets/write | Creates or Updates any Dataset. |
> | Microsoft.DataFactory/factories/debugpipelineruns/cancel/action | Cancels a debug run for the Pipeline. |
> | Microsoft.DataFactory/factories/getDataPlaneAccess/read | Reads access to ADF DataPlane service. |
> | Microsoft.DataFactory/factories/getFeatureValue/read | Reads exposure control feature value for the specific location. |
> | Microsoft.DataFactory/factories/integrationruntimes/read | Reads any Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/write | Creates or Updates any Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/delete | Deletes any Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/start/action | Starts any Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/stop/action | Stops any Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/synccredentials/action | Syncs the Credentials for the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/upgrade/action | Upgrades the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/regenerateauthkey/action | Regenerates the Authentication Keys for the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/removelinks/action | Removes Linked Integration Runtime References from the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/linkedIntegrationRuntime/action | Create Linked Integration Runtime Reference on the Specified Shared Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/getObjectMetadata/action | Get SSIS Integration Runtime metadata for the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/refreshObjectMetadata/action | Refresh SSIS Integration Runtime metadata for the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/getconnectioninfo/read | Reads Integration Runtime Connection Info. |
> | Microsoft.DataFactory/factories/integrationruntimes/getstatus/read | Reads Integration Runtime Status. |
> | Microsoft.DataFactory/factories/integrationruntimes/listauthkeys/read | Lists the Authentication Keys for any Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/monitoringdata/read | Gets the Monitoring Data for any Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/nodes/read | Reads the Node for the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/nodes/delete | Deletes the Node for the specified Integration Runtime. |
> | Microsoft.DataFactory/factories/integrationruntimes/nodes/write | Updates a self-hosted Integration Runtime Node. |
> | Microsoft.DataFactory/factories/integrationruntimes/nodes/ipAddress/action | Returns the IP Address for the specified node of the Integration Runtime. |
> | Microsoft.DataFactory/factories/linkedServices/read | Reads Linked Service. |
> | Microsoft.DataFactory/factories/linkedServices/delete | Deletes Linked Service. |
> | Microsoft.DataFactory/factories/linkedServices/write | Create or Update Linked Service |
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
> | Microsoft.DataFactory/factories/querypipelineruns/read | Reads the Result of Query Pipeline Runs. |
> | Microsoft.DataFactory/factories/querytriggerruns/read | Reads the Result of Trigger Runs. |
> | Microsoft.DataFactory/factories/sandboxpipelineruns/read | Gets the debug run info for the Pipeline. |
> | Microsoft.DataFactory/factories/sandboxpipelineruns/sandboxActivityRuns/read | Gets the debug run info for the Activity. |
> | Microsoft.DataFactory/factories/triggerruns/read | Reads the Trigger Runs. |
> | Microsoft.DataFactory/factories/triggers/read | Reads any Trigger. |
> | Microsoft.DataFactory/factories/triggers/write | Creates or Updates any Trigger. |
> | Microsoft.DataFactory/factories/triggers/delete | Deletes any Trigger. |
> | Microsoft.DataFactory/factories/triggers/subscribetoevents/action | Subscribe to Events. |
> | Microsoft.DataFactory/factories/triggers/geteventsubscriptionstatus/action | Event Subscription Status. |
> | Microsoft.DataFactory/factories/triggers/unsubscribefromevents/action | Unsubscribe from Events. |
> | Microsoft.DataFactory/factories/triggers/start/action | Starts any Trigger. |
> | Microsoft.DataFactory/factories/triggers/stop/action | Stops any Trigger. |
> | Microsoft.DataFactory/factories/triggers/triggerruns/read | Reads the Trigger Runs. |
> | Microsoft.DataFactory/locations/configureFactoryRepo/action | Configures the repository for the factory. |
> | Microsoft.DataFactory/locations/getFeatureValue/action | Get exposure control feature value for the specific location. |
> | Microsoft.DataFactory/locations/getFeatureValue/read | Reads exposure control feature value for the specific location. |
> | Microsoft.DataFactory/operations/read | Reads all Operations in Microsoft Data Factory Provider. |

### Microsoft.DataMigration

Azure service: [Azure Database Migration Service](../dms/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DataMigration/register/action | Registers the subscription with the Azure Database Migration Service provider |
> | Microsoft.DataMigration/locations/operationResults/read | Get the status of a long-running operation related to a 202 Accepted response |
> | Microsoft.DataMigration/locations/operationStatuses/read | Get the status of a long-running operation related to a 202 Accepted response |
> | Microsoft.DataMigration/services/read | Read information about resources |
> | Microsoft.DataMigration/services/write | Create or update resources and their properties |
> | Microsoft.DataMigration/services/delete | Deletes a resource and all of its children |
> | Microsoft.DataMigration/services/stop/action | Stop the DMS service to minimize its cost |
> | Microsoft.DataMigration/services/start/action | Start the DMS service to allow it to process migrations again |
> | Microsoft.DataMigration/services/checkStatus/action | Check whether the service is deployed and running |
> | Microsoft.DataMigration/services/configureWorker/action | Configures a DMS worker to the Service's availiable workers |
> | Microsoft.DataMigration/services/addWorker/action | Adds a DMS worker to the Service's availiable workers |
> | Microsoft.DataMigration/services/removeWorker/action | Removes a DMS worker to the Service's availiable workers |
> | Microsoft.DataMigration/services/updateAgentConfig/action | Updates DMS agent configuration with provided values. |
> | Microsoft.DataMigration/services/getHybridDownloadLink/action | Gets a DMS worker package download link from RP Blob Storage. |
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
> | Microsoft.DataMigration/skus/read | Get a list of SKUs supported by DMS resources. |

### Microsoft.DBforMariaDB

Azure service: [Azure Database for MariaDB](../mariadb/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DBforMariaDB/register/action | Register MariaDB Resource Provider |
> | Microsoft.DBforMariaDB/checkNameAvailability/action | Verify whether given server name is available for provisioning worldwide for a given subscription. |
> | Microsoft.DBforMariaDB/locations/azureAsyncOperation/read | Return MariaDB Server Operation Results |
> | Microsoft.DBforMariaDB/locations/operationResults/read | Return ResourceGroup based MariaDB Server Operation Results |
> | Microsoft.DBforMariaDB/locations/operationResults/read | Return MariaDB Server Operation Results |
> | Microsoft.DBforMariaDB/locations/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Microsoft.DBforMariaDB/locations/privateEndpointConnectionAzureAsyncOperation/read | Gets the result for a private endpoint connection operation |
> | Microsoft.DBforMariaDB/locations/privateEndpointConnectionOperationResults/read | Gets the result for a private endpoint connection operation |
> | Microsoft.DBforMariaDB/locations/privateEndpointConnectionProxyAzureAsyncOperation/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.DBforMariaDB/locations/privateEndpointConnectionProxyOperationResults/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.DBforMariaDB/locations/securityAlertPoliciesAzureAsyncOperation/read | Return the list of Server threat detection operation result. |
> | Microsoft.DBforMariaDB/locations/securityAlertPoliciesOperationResults/read | Return the list of Server threat detection operation result. |
> | Microsoft.DBforMariaDB/locations/serverKeyAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption server keys |
> | Microsoft.DBforMariaDB/locations/serverKeyOperationResults/read | Gets in-progress operations on transparent data encryption server keys |
> | Microsoft.DBforMariaDB/operations/read | Return the list of MariaDB Operations. |
> | Microsoft.DBforMariaDB/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Microsoft.DBforMariaDB/servers/queryTexts/action | Return the texts for a list of queries |
> | Microsoft.DBforMariaDB/servers/queryTexts/action | Return the text of a query |
> | Microsoft.DBforMariaDB/servers/read | Return the list of servers or gets the properties for the specified server. |
> | Microsoft.DBforMariaDB/servers/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |
> | Microsoft.DBforMariaDB/servers/delete | Deletes an existing server. |
> | Microsoft.DBforMariaDB/servers/restart/action | Restarts a specific server. |
> | Microsoft.DBforMariaDB/servers/updateConfigurations/action | Update configurations for the specified server |
> | Microsoft.DBforMariaDB/servers/administrators/read | Gets a list of MariaDB server administrators. |
> | Microsoft.DBforMariaDB/servers/administrators/write | Creates or updates MariaDB server administrator with the specified parameters. |
> | Microsoft.DBforMariaDB/servers/administrators/delete | Deletes an existing administrator of MariaDB server. |
> | Microsoft.DBforMariaDB/servers/advisors/read | Return the list of advisors |
> | Microsoft.DBforMariaDB/servers/advisors/read | Return an advisor |
> | Microsoft.DBforMariaDB/servers/advisors/createRecommendedActionSession/action | Create a new recommendation action session |
> | Microsoft.DBforMariaDB/servers/advisors/recommendedActions/read | Return the list of recommended actions |
> | Microsoft.DBforMariaDB/servers/advisors/recommendedActions/read | Return the list of recommended actions |
> | Microsoft.DBforMariaDB/servers/advisors/recommendedActions/read | Return a recommended action |
> | Microsoft.DBforMariaDB/servers/configurations/read | Return the list of configurations for a server or gets the properties for the specified configuration. |
> | Microsoft.DBforMariaDB/servers/configurations/write | Update the value for the specified configuration |
> | Microsoft.DBforMariaDB/servers/databases/read | Return the list of MariaDB Databases or gets the properties for the specified Database. |
> | Microsoft.DBforMariaDB/servers/databases/write | Creates a MariaDB Database with the specified parameters or update the properties for the specified Database. |
> | Microsoft.DBforMariaDB/servers/databases/delete | Deletes an existing MariaDB Database. |
> | Microsoft.DBforMariaDB/servers/firewallRules/read | Return the list of firewall rules for a server or gets the properties for the specified firewall rule. |
> | Microsoft.DBforMariaDB/servers/firewallRules/write | Creates a firewall rule with the specified parameters or update an existing rule. |
> | Microsoft.DBforMariaDB/servers/firewallRules/delete | Deletes an existing firewall rule. |
> | Microsoft.DBforMariaDB/servers/keys/read | Return the list of server keys or gets the properties for the specified server key. |
> | Microsoft.DBforMariaDB/servers/keys/write | Creates a key with the specified parameters or update the properties or tags for the specified server key. |
> | Microsoft.DBforMariaDB/servers/keys/delete | Deletes an existing server key. |
> | Microsoft.DBforMariaDB/servers/logFiles/read | Return the list of MariaDB LogFiles. |
> | Microsoft.DBforMariaDB/servers/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Microsoft.DBforMariaDB/servers/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy. |
> | Microsoft.DBforMariaDB/servers/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy. |
> | Microsoft.DBforMariaDB/servers/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Microsoft.DBforMariaDB/servers/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | Microsoft.DBforMariaDB/servers/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Microsoft.DBforMariaDB/servers/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Microsoft.DBforMariaDB/servers/privateLinkResources/read | Get the private link resources for the corresponding MariaDB Server |
> | Microsoft.DBforMariaDB/servers/providers/Microsoft.Insights/diagnosticSettings/read | Gets the disagnostic setting for the resource |
> | Microsoft.DBforMariaDB/servers/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.DBforMariaDB/servers/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for MariaDB servers |
> | Microsoft.DBforMariaDB/servers/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |
> | Microsoft.DBforMariaDB/servers/recoverableServers/read | Return the recoverable MariaDB Server info |
> | Microsoft.DBforMariaDB/servers/replicas/read | Get read replicas of a MariaDB server |
> | Microsoft.DBforMariaDB/servers/securityAlertPolicies/read | Retrieve details of the server threat detection policy configured on a given server |
> | Microsoft.DBforMariaDB/servers/securityAlertPolicies/write | Change the server threat detection policy for a given server |
> | Microsoft.DBforMariaDB/servers/topQueryStatistics/read | Return the list of Query Statistics for the top queries. |
> | Microsoft.DBforMariaDB/servers/topQueryStatistics/read | Return a Query Statistic |
> | Microsoft.DBforMariaDB/servers/virtualNetworkRules/read | Return the list of virtual network rules or gets the properties for the specified virtual network rule. |
> | Microsoft.DBforMariaDB/servers/virtualNetworkRules/write | Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule. |
> | Microsoft.DBforMariaDB/servers/virtualNetworkRules/delete | Deletes an existing Virtual Network Rule |
> | Microsoft.DBforMariaDB/servers/waitStatistics/read | Return wait statistics for an instance |
> | Microsoft.DBforMariaDB/servers/waitStatistics/read | Return a wait statistic |

### Microsoft.DBforMySQL

Azure service: [Azure Database for MySQL](../mysql/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DBforMySQL/register/action | Register MySQL Resource Provider |
> | Microsoft.DBforMySQL/checkNameAvailability/action | Verify whether given server name is available for provisioning worldwide for a given subscription. |
> | Microsoft.DBforMySQL/locations/azureAsyncOperation/read | Return MySQL Server Operation Results |
> | Microsoft.DBforMySQL/locations/operationResults/read | Return ResourceGroup based MySQL Server Operation Results |
> | Microsoft.DBforMySQL/locations/operationResults/read | Return MySQL Server Operation Results |
> | Microsoft.DBforMySQL/locations/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Microsoft.DBforMySQL/locations/privateEndpointConnectionAzureAsyncOperation/read | Gets the result for a private endpoint connection operation |
> | Microsoft.DBforMySQL/locations/privateEndpointConnectionOperationResults/read | Gets the result for a private endpoint connection operation |
> | Microsoft.DBforMySQL/locations/privateEndpointConnectionProxyAzureAsyncOperation/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.DBforMySQL/locations/privateEndpointConnectionProxyOperationResults/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.DBforMySQL/locations/securityAlertPoliciesAzureAsyncOperation/read | Return the list of Server threat detection operation result. |
> | Microsoft.DBforMySQL/locations/securityAlertPoliciesOperationResults/read | Return the list of Server threat detection operation result. |
> | Microsoft.DBforMySQL/locations/serverKeyAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption server keys |
> | Microsoft.DBforMySQL/locations/serverKeyOperationResults/read | Gets in-progress operations on transparent data encryption server keys |
> | Microsoft.DBforMySQL/operations/read | Return the list of MySQL Operations. |
> | Microsoft.DBforMySQL/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Microsoft.DBforMySQL/servers/queryTexts/action | Return the texts for a list of queries |
> | Microsoft.DBforMySQL/servers/queryTexts/action | Return the text of a query |
> | Microsoft.DBforMySQL/servers/read | Return the list of servers or gets the properties for the specified server. |
> | Microsoft.DBforMySQL/servers/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |
> | Microsoft.DBforMySQL/servers/delete | Deletes an existing server. |
> | Microsoft.DBforMySQL/servers/restart/action | Restarts a specific server. |
> | Microsoft.DBforMySQL/servers/updateConfigurations/action | Update configurations for the specified server |
> | Microsoft.DBforMySQL/servers/administrators/read | Gets a list of MySQL server administrators. |
> | Microsoft.DBforMySQL/servers/administrators/write | Creates or updates MySQL server administrator with the specified parameters. |
> | Microsoft.DBforMySQL/servers/administrators/delete | Deletes an existing administrator of MySQL server. |
> | Microsoft.DBforMySQL/servers/advisors/read | Return the list of advisors |
> | Microsoft.DBforMySQL/servers/advisors/read | Return an advisor |
> | Microsoft.DBforMySQL/servers/advisors/createRecommendedActionSession/action | Create a new recommendation action session |
> | Microsoft.DBforMySQL/servers/advisors/recommendedActions/read | Return the list of recommended actions |
> | Microsoft.DBforMySQL/servers/advisors/recommendedActions/read | Return the list of recommended actions |
> | Microsoft.DBforMySQL/servers/advisors/recommendedActions/read | Return a recommended action |
> | Microsoft.DBforMySQL/servers/configurations/read | Return the list of configurations for a server or gets the properties for the specified configuration. |
> | Microsoft.DBforMySQL/servers/configurations/write | Update the value for the specified configuration |
> | Microsoft.DBforMySQL/servers/databases/read | Return the list of MySQL Databases or gets the properties for the specified Database. |
> | Microsoft.DBforMySQL/servers/databases/write | Creates a MySQL Database with the specified parameters or update the properties for the specified Database. |
> | Microsoft.DBforMySQL/servers/databases/delete | Deletes an existing MySQL Database. |
> | Microsoft.DBforMySQL/servers/firewallRules/read | Return the list of firewall rules for a server or gets the properties for the specified firewall rule. |
> | Microsoft.DBforMySQL/servers/firewallRules/write | Creates a firewall rule with the specified parameters or update an existing rule. |
> | Microsoft.DBforMySQL/servers/firewallRules/delete | Deletes an existing firewall rule. |
> | Microsoft.DBforMySQL/servers/keys/read | Return the list of server keys or gets the properties for the specified server key. |
> | Microsoft.DBforMySQL/servers/keys/write | Creates a key with the specified parameters or update the properties or tags for the specified server key. |
> | Microsoft.DBforMySQL/servers/keys/delete | Deletes an existing server key. |
> | Microsoft.DBforMySQL/servers/logFiles/read | Return the list of MySQL LogFiles. |
> | Microsoft.DBforMySQL/servers/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Microsoft.DBforMySQL/servers/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy. |
> | Microsoft.DBforMySQL/servers/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy. |
> | Microsoft.DBforMySQL/servers/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Microsoft.DBforMySQL/servers/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | Microsoft.DBforMySQL/servers/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Microsoft.DBforMySQL/servers/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Microsoft.DBforMySQL/servers/privateLinkResources/read | Get the private link resources for the corresponding MySQL Server |
> | Microsoft.DBforMySQL/servers/providers/Microsoft.Insights/diagnosticSettings/read | Gets the disagnostic setting for the resource |
> | Microsoft.DBforMySQL/servers/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.DBforMySQL/servers/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for MySQL servers |
> | Microsoft.DBforMySQL/servers/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |
> | Microsoft.DBforMySQL/servers/recoverableServers/read | Return the recoverable MySQL Server info |
> | Microsoft.DBforMySQL/servers/replicas/read | Get read replicas of a MySQL server |
> | Microsoft.DBforMySQL/servers/securityAlertPolicies/read | Retrieve details of the server threat detection policy configured on a given server |
> | Microsoft.DBforMySQL/servers/securityAlertPolicies/write | Change the server threat detection policy for a given server |
> | Microsoft.DBforMySQL/servers/topQueryStatistics/read | Return the list of Query Statistics for the top queries. |
> | Microsoft.DBforMySQL/servers/topQueryStatistics/read | Return a Query Statistic |
> | Microsoft.DBforMySQL/servers/virtualNetworkRules/read | Return the list of virtual network rules or gets the properties for the specified virtual network rule. |
> | Microsoft.DBforMySQL/servers/virtualNetworkRules/write | Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule. |
> | Microsoft.DBforMySQL/servers/virtualNetworkRules/delete | Deletes an existing Virtual Network Rule |
> | Microsoft.DBforMySQL/servers/waitStatistics/read | Return wait statistics for an instance |
> | Microsoft.DBforMySQL/servers/waitStatistics/read | Return a wait statistic |

### Microsoft.DBforPostgreSQL

Azure service: [Azure Database for PostgreSQL](../postgresql/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DBforPostgreSQL/register/action | Register PostgreSQL Resource Provider |
> | Microsoft.DBforPostgreSQL/checkNameAvailability/action | Verify whether given server name is available for provisioning worldwide for a given subscription. |
> | Microsoft.DBforPostgreSQL/locations/azureAsyncOperation/read | Return PostgreSQL Server Operation Results |
> | Microsoft.DBforPostgreSQL/locations/operationResults/read | Return ResourceGroup based PostgreSQL Server Operation Results |
> | Microsoft.DBforPostgreSQL/locations/operationResults/read | Return PostgreSQL Server Operation Results |
> | Microsoft.DBforPostgreSQL/locations/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Microsoft.DBforPostgreSQL/locations/privateEndpointConnectionAzureAsyncOperation/read | Gets the result for a private endpoint connection operation |
> | Microsoft.DBforPostgreSQL/locations/privateEndpointConnectionOperationResults/read | Gets the result for a private endpoint connection operation |
> | Microsoft.DBforPostgreSQL/locations/privateEndpointConnectionProxyAzureAsyncOperation/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.DBforPostgreSQL/locations/privateEndpointConnectionProxyOperationResults/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.DBforPostgreSQL/locations/securityAlertPoliciesAzureAsyncOperation/read | Return the list of Server threat detection operation result. |
> | Microsoft.DBforPostgreSQL/locations/securityAlertPoliciesOperationResults/read | Return the list of Server threat detection operation result. |
> | Microsoft.DBforPostgreSQL/locations/serverKeyAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption server keys |
> | Microsoft.DBforPostgreSQL/locations/serverKeyOperationResults/read | Gets in-progress operations on transparent data encryption server keys |
> | Microsoft.DBforPostgreSQL/operations/read | Return the list of PostgreSQL Operations. |
> | Microsoft.DBforPostgreSQL/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Microsoft.DBforPostgreSQL/servers/queryTexts/action | Return the text of a query |
> | Microsoft.DBforPostgreSQL/servers/read | Return the list of servers or gets the properties for the specified server. |
> | Microsoft.DBforPostgreSQL/servers/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |
> | Microsoft.DBforPostgreSQL/servers/delete | Deletes an existing server. |
> | Microsoft.DBforPostgreSQL/servers/restart/action | Restarts a specific server. |
> | Microsoft.DBforPostgreSQL/servers/updateConfigurations/action | Update configurations for the specified server |
> | Microsoft.DBforPostgreSQL/servers/administrators/read | Gets a list of PostgreSQL server administrators. |
> | Microsoft.DBforPostgreSQL/servers/administrators/write | Creates or updates PostgreSQL server administrator with the specified parameters. |
> | Microsoft.DBforPostgreSQL/servers/administrators/delete | Deletes an existing administrator of PostgreSQL server. |
> | Microsoft.DBforPostgreSQL/servers/advisors/read | Return the list of advisors |
> | Microsoft.DBforPostgreSQL/servers/advisors/recommendedActionSessions/action | Make recommendations |
> | Microsoft.DBforPostgreSQL/servers/advisors/recommendedActions/read | Return the list of recommended actions |
> | Microsoft.DBforPostgreSQL/servers/configurations/read | Return the list of configurations for a server or gets the properties for the specified configuration. |
> | Microsoft.DBforPostgreSQL/servers/configurations/write | Update the value for the specified configuration |
> | Microsoft.DBforPostgreSQL/servers/databases/read | Return the list of PostgreSQL Databases or gets the properties for the specified Database. |
> | Microsoft.DBforPostgreSQL/servers/databases/write | Creates a PostgreSQL Database with the specified parameters or update the properties for the specified Database. |
> | Microsoft.DBforPostgreSQL/servers/databases/delete | Deletes an existing PostgreSQL Database. |
> | Microsoft.DBforPostgreSQL/servers/firewallRules/read | Return the list of firewall rules for a server or gets the properties for the specified firewall rule. |
> | Microsoft.DBforPostgreSQL/servers/firewallRules/write | Creates a firewall rule with the specified parameters or update an existing rule. |
> | Microsoft.DBforPostgreSQL/servers/firewallRules/delete | Deletes an existing firewall rule. |
> | Microsoft.DBforPostgreSQL/servers/keys/read | Return the list of server keys or gets the properties for the specified server key. |
> | Microsoft.DBforPostgreSQL/servers/keys/write | Creates a key with the specified parameters or update the properties or tags for the specified server key. |
> | Microsoft.DBforPostgreSQL/servers/keys/delete | Deletes an existing server key. |
> | Microsoft.DBforPostgreSQL/servers/logFiles/read | Return the list of PostgreSQL LogFiles. |
> | Microsoft.DBforPostgreSQL/servers/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Microsoft.DBforPostgreSQL/servers/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy. |
> | Microsoft.DBforPostgreSQL/servers/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy. |
> | Microsoft.DBforPostgreSQL/servers/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Microsoft.DBforPostgreSQL/servers/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | Microsoft.DBforPostgreSQL/servers/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Microsoft.DBforPostgreSQL/servers/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Microsoft.DBforPostgreSQL/servers/privateLinkResources/read | Get the private link resources for the corresponding PostgreSQL Server |
> | Microsoft.DBforPostgreSQL/servers/providers/Microsoft.Insights/diagnosticSettings/read | Gets the disagnostic setting for the resource |
> | Microsoft.DBforPostgreSQL/servers/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.DBforPostgreSQL/servers/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for PostgreSQL servers |
> | Microsoft.DBforPostgreSQL/servers/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |
> | Microsoft.DBforPostgreSQL/servers/queryTexts/read | Return the texts for a list of queries |
> | Microsoft.DBforPostgreSQL/servers/recoverableServers/read | Return the recoverable PostgreSQL Server info |
> | Microsoft.DBforPostgreSQL/servers/replicas/read | Get read replicas of a PostgreSQL server |
> | Microsoft.DBforPostgreSQL/servers/securityAlertPolicies/read | Retrieve details of the server threat detection policy configured on a given server |
> | Microsoft.DBforPostgreSQL/servers/securityAlertPolicies/write | Change the server threat detection policy for a given server |
> | Microsoft.DBforPostgreSQL/servers/topQueryStatistics/read | Return the list of Query Statistics for the top queries. |
> | Microsoft.DBforPostgreSQL/servers/virtualNetworkRules/read | Return the list of virtual network rules or gets the properties for the specified virtual network rule. |
> | Microsoft.DBforPostgreSQL/servers/virtualNetworkRules/write | Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule. |
> | Microsoft.DBforPostgreSQL/servers/virtualNetworkRules/delete | Deletes an existing Virtual Network Rule |
> | Microsoft.DBforPostgreSQL/servers/waitStatistics/read | Return wait statistics for an instance |
> | Microsoft.DBforPostgreSQL/serversv2/read | Return the list of servers or gets the properties for the specified server. |
> | Microsoft.DBforPostgreSQL/serversv2/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |
> | Microsoft.DBforPostgreSQL/serversv2/delete | Deletes an existing server. |
> | Microsoft.DBforPostgreSQL/serversv2/updateConfigurations/action | Update configurations for the specified server |
> | Microsoft.DBforPostgreSQL/serversv2/configurations/read | Return the list of configurations for a server or gets the properties for the specified configuration. |
> | Microsoft.DBforPostgreSQL/serversv2/configurations/write | Update the value for the specified configuration |
> | Microsoft.DBforPostgreSQL/serversv2/firewallRules/read | Return the list of firewall rules for a server or gets the properties for the specified firewall rule. |
> | Microsoft.DBforPostgreSQL/serversv2/firewallRules/write | Creates a firewall rule with the specified parameters or update an existing rule. |
> | Microsoft.DBforPostgreSQL/serversv2/firewallRules/delete | Deletes an existing firewall rule. |
> | Microsoft.DBforPostgreSQL/serversv2/providers/Microsoft.Insights/diagnosticSettings/read | Gets the disagnostic setting for the resource |
> | Microsoft.DBforPostgreSQL/serversv2/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.DBforPostgreSQL/serversv2/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for PostgreSQL servers |
> | Microsoft.DBforPostgreSQL/serversv2/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |
> | Microsoft.DBforPostgreSQL/singleservers/read | Return the list of servers or gets the properties for the specified server. |
> | Microsoft.DBforPostgreSQL/singleservers/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |
> | Microsoft.DBforPostgreSQL/singleservers/delete | Deletes an existing server. |
> | Microsoft.DBforPostgreSQL/singleservers/providers/Microsoft.Insights/diagnosticSettings/read | Gets the disagnostic setting for the resource |
> | Microsoft.DBforPostgreSQL/singleservers/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.DBforPostgreSQL/singleservers/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for PostgreSQL servers |
> | Microsoft.DBforPostgreSQL/singleservers/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |

### Microsoft.DocumentDB

Azure service: [Azure Cosmos DB](../cosmos-db/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DocumentDB/register/action |  Register the Microsoft DocumentDB resource provider for the subscription |
> | Microsoft.DocumentDB/databaseAccountNames/read | Checks for name availability. |
> | Microsoft.DocumentDB/databaseAccounts/read | Reads a database account. |
> | Microsoft.DocumentDB/databaseAccounts/write | Update a database accounts. |
> | Microsoft.DocumentDB/databaseAccounts/listKeys/action | List keys of a database account |
> | Microsoft.DocumentDB/databaseAccounts/readonlykeys/action | Reads the database account readonly keys. |
> | Microsoft.DocumentDB/databaseAccounts/regenerateKey/action | Rotate keys of a database account |
> | Microsoft.DocumentDB/databaseAccounts/listConnectionStrings/action | Get the connection strings for a database account |
> | Microsoft.DocumentDB/databaseAccounts/changeResourceGroup/action | Change resource group of a database account |
> | Microsoft.DocumentDB/databaseAccounts/failoverPriorityChange/action | Change failover priorities of regions of a database account. This is used to perform manual failover operation |
> | Microsoft.DocumentDB/databaseAccounts/offlineRegion/action | Offline a region of a database account.  |
> | Microsoft.DocumentDB/databaseAccounts/onlineRegion/action | Online a region of a database account. |
> | Microsoft.DocumentDB/databaseAccounts/delete | Deletes the database accounts. |
> | Microsoft.DocumentDB/databaseAccounts/getBackupPolicy/action | Get the backup policy of database account |
> | Microsoft.DocumentDB/databaseAccounts/PrivateEndpointConnectionsApproval/action | Manage a private endpoint connection of Database Account |
> | Microsoft.DocumentDB/databaseAccounts/restore/action | Submit a restore request |
> | Microsoft.DocumentDB/databaseAccounts/backup/action | Submit a request to configure backup |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/write | (Deprecated. Please use resource paths without '/apis/' segment) Create a database. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a database or list all the databases. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/delete | (Deprecated. Please use resource paths without '/apis/' segment) Delete a database. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/write | (Deprecated. Please use resource paths without '/apis/' segment) Create or update a collection. Only applicable to API types: 'mongodb'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a collection or list all the collections. Only applicable to API types: 'mongodb'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/delete | (Deprecated. Please use resource paths without '/apis/' segment) Delete a collection. Only applicable to API types: 'mongodb'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'mongodb'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/settings/write | (Deprecated. Please use resource paths without '/apis/' segment) Update a collection throughput. Only applicable to API types: 'mongodb'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/settings/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a collection throughput. Only applicable to API types: 'mongodb'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/settings/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'mongodb'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/write | (Deprecated. Please use resource paths without '/apis/' segment) Create or update a container. Only applicable to API types: 'sql'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a container or list all the containers. Only applicable to API types: 'sql'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/delete | (Deprecated. Please use resource paths without '/apis/' segment) Delete a container. Only applicable to API types: 'sql'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'sql'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/settings/write | (Deprecated. Please use resource paths without '/apis/' segment) Update a container throughput. Only applicable to API types: 'sql'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/settings/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a container throughput. Only applicable to API types: 'sql'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/settings/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'sql'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/write | (Deprecated. Please use resource paths without '/apis/' segment) Create or update a graph. Only applicable to API types: 'gremlin'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a graph or list all the graphs. Only applicable to API types: 'gremlin'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/delete | (Deprecated. Please use resource paths without '/apis/' segment) Delete a graph. Only applicable to API types: 'gremlin'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'gremlin'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/settings/write | (Deprecated. Please use resource paths without '/apis/' segment) Update a graph throughput. Only applicable to API types: 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/settings/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a graph throughput. Only applicable to API types: 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/settings/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/settings/write | (Deprecated. Please use resource paths without '/apis/' segment) Update a database throughput. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/settings/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a database throughput. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/databases/settings/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/write | (Deprecated. Please use resource paths without '/apis/' segment) Create a keyspace. Only applicable to API types: 'cassandra'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a keyspace or list all the keyspaces. Only applicable to API types: 'cassandra'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/delete | (Deprecated. Please use resource paths without '/apis/' segment) Delete a keyspace. Only applicable to API types: 'cassandra'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'cassandra'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/settings/write | (Deprecated. Please use resource paths without '/apis/' segment) Update a keyspace throughput. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/settings/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a keyspace throughput. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/settings/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/write | (Deprecated. Please use resource paths without '/apis/' segment) Create or update a table. Only applicable to API types: 'cassandra'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a table or list all the tables. Only applicable to API types: 'cassandra'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/delete | (Deprecated. Please use resource paths without '/apis/' segment) Delete a table. Only applicable to API types: 'cassandra'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'cassandra'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/settings/write | (Deprecated. Please use resource paths without '/apis/' segment) Update a table throughput. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/settings/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a table throughput. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/settings/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/tables/write | (Deprecated. Please use resource paths without '/apis/' segment) Create or update a table. Only applicable to API types: 'table'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/tables/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a table or list all the tables. Only applicable to API types: 'table'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/tables/delete | (Deprecated. Please use resource paths without '/apis/' segment) Delete a table. Only applicable to API types: 'table'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/tables/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'table'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/tables/settings/write | (Deprecated. Please use resource paths without '/apis/' segment) Update a table throughput. Only applicable to API types: 'table'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/tables/settings/read | (Deprecated. Please use resource paths without '/apis/' segment) Read a table throughput. Only applicable to API types: 'table'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/apis/tables/settings/operationResults/read | (Deprecated. Please use resource paths without '/apis/' segment) Read status of the asynchronous operation. Only applicable to API types: 'table'. Only applicable for setting types: 'throughput'. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/write | Create a Cassandra keyspace. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/read | Read a Cassandra keyspace or list all the Cassandra keyspaces. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/delete | Delete a Cassandra keyspace. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/write | Create or update a Cassandra table. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/read | Read a Cassandra table or list all the Cassandra tables. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/delete | Delete a Cassandra table. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/throughputSettings/write | Update a Cassandra table throughput. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/throughputSettings/read | Read a Cassandra table throughput. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/tables/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/throughputSettings/write | Update a Cassandra keyspace throughput. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/throughputSettings/read | Read a Cassandra keyspace throughput. |
> | Microsoft.DocumentDB/databaseAccounts/cassandraKeyspaces/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/databases/collections/metricDefinitions/read | Reads the collection metric definitions. |
> | Microsoft.DocumentDB/databaseAccounts/databases/collections/metrics/read | Reads the collection metrics. |
> | Microsoft.DocumentDB/databaseAccounts/databases/collections/partitionKeyRangeId/metrics/read | Read database account partition key level metrics |
> | Microsoft.DocumentDB/databaseAccounts/databases/collections/partitions/read | Read database account partitions in a collection |
> | Microsoft.DocumentDB/databaseAccounts/databases/collections/partitions/metrics/read | Read database account partition level metrics |
> | Microsoft.DocumentDB/databaseAccounts/databases/collections/partitions/usages/read | Read database account partition level usages |
> | Microsoft.DocumentDB/databaseAccounts/databases/collections/usages/read | Reads the collection usages. |
> | Microsoft.DocumentDB/databaseAccounts/databases/metricDefinitions/read | Reads the database metric definitions |
> | Microsoft.DocumentDB/databaseAccounts/databases/metrics/read | Reads the database metrics. |
> | Microsoft.DocumentDB/databaseAccounts/databases/usages/read | Reads the database usages. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/write | Create a Gremlin database. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/read | Read a Gremlin database or list all the Gremlin databases. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/delete | Delete a Gremlin database. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/write | Create or update a Gremlin graph. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/read | Read a Gremlin graph or list all the Gremlin graphs. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/delete | Delete a Gremlin graph. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/throughputSettings/write | Update a Gremlin graph throughput. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/throughputSettings/read | Read a Gremlin graph throughput. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/graphs/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/throughputSettings/write | Update a Gremlin database throughput. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/throughputSettings/read | Read a Gremlin database throughput. |
> | Microsoft.DocumentDB/databaseAccounts/gremlinDatabases/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/metricDefinitions/read | Reads the database account metrics definitions. |
> | Microsoft.DocumentDB/databaseAccounts/metrics/read | Reads the database account metrics. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/write | Create a MongoDB database. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/read | Read a MongoDB database or list all the MongoDB databases. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/delete | Delete a MongoDB database. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/write | Create or update a MongoDB collection. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/read | Read a MongoDB collection or list all the MongoDB collections. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/delete | Delete a MongoDB collection. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/throughputSettings/write | Update a MongoDB collection throughput. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/throughputSettings/read | Read a MongoDB collection throughput. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/throughputSettings/write | Update a MongoDB database throughput. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/throughputSettings/read | Read a MongoDB database throughput. |
> | Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/notebookWorkspaces/write | Create or update a notebook workspace |
> | Microsoft.DocumentDB/databaseAccounts/notebookWorkspaces/read | Read a notebook workspace |
> | Microsoft.DocumentDB/databaseAccounts/notebookWorkspaces/delete | Delete a notebook workspace |
> | Microsoft.DocumentDB/databaseAccounts/notebookWorkspaces/listConnectionInfo/action | List the connection info for a notebook workspace |
> | Microsoft.DocumentDB/databaseAccounts/notebookWorkspaces/operationResults/read | Read the status of an asynchronous operation on notebook workspaces |
> | Microsoft.DocumentDB/databaseAccounts/operationResults/read | Read status of the asynchronous operation |
> | Microsoft.DocumentDB/databaseAccounts/percentile/read | Read percentiles of replication latencies |
> | Microsoft.DocumentDB/databaseAccounts/percentile/metrics/read | Read latency metrics |
> | Microsoft.DocumentDB/databaseAccounts/percentile/sourceRegion/targetRegion/metrics/read | Read latency metrics for a specific source and target region |
> | Microsoft.DocumentDB/databaseAccounts/percentile/targetRegion/metrics/read | Read latency metrics for a specific target region |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnectionProxies/read | Read a private endpoint connection proxy of Database Account |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnectionProxies/write | Create or update a private endpoint connection proxy of Database Account |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnectionProxies/delete | Delete a private endpoint connection proxy of Database Account |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnectionProxies/validate/action | Validate a private endpoint connection proxy of Database Account |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnectionProxies/operationResults/read | Read Status of private endpoint connection proxy asynchronous operation |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnections/read | Read a private endpoint connection or list all the private endpoint connections of a Database Account |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnections/write | Create or update a private endpoint connection of a Database Account |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnections/delete | Delete a private endpoint connection of a Database Account |
> | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnections/operationResults/read | Read Status of privateEndpointConnenctions asynchronous operation |
> | Microsoft.DocumentDB/databaseAccounts/privateLinkResources/read | Read a private link resource or list all the private link resources of a Database Account |
> | Microsoft.DocumentDB/databaseAccounts/readonlykeys/read | Reads the database account readonly keys. |
> | Microsoft.DocumentDB/databaseAccounts/region/databases/collections/metrics/read | Reads the regional collection metrics. |
> | Microsoft.DocumentDB/databaseAccounts/region/databases/collections/partitionKeyRangeId/metrics/read | Read regional database account partition key level metrics |
> | Microsoft.DocumentDB/databaseAccounts/region/databases/collections/partitions/read | Read regional database account partitions in a collection |
> | Microsoft.DocumentDB/databaseAccounts/region/databases/collections/partitions/metrics/read | Read regional database account partition level metrics |
> | Microsoft.DocumentDB/databaseAccounts/region/metrics/read | Reads the region and database account metrics. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/write | Create a SQL database. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/read | Read a SQL database or list all the SQL databases. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/delete | Delete a SQL database. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/write | Create or update a SQL container. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/read | Read a SQL container or list all the SQL containers. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/delete | Delete a SQL container. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/storedProcedures/write | Create or update a SQL stored procedure. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/storedProcedures/read | Read a SQL stored procedure or list all the SQL stored procedures. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/storedProcedures/delete | Delete a SQL stored procedure. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/storedProcedures/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/throughputSettings/write | Update a SQL container throughput. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/throughputSettings/read | Read a SQL container throughput. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/triggers/write | Create or update a SQL trigger. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/triggers/read | Read a SQL trigger or list all the SQL triggers. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/triggers/delete | Delete a SQL trigger. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/triggers/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/userDefinedFunctions/write | Create or update a SQL user defined function. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/userDefinedFunctions/read | Read a SQL user defined function or list all the SQL user defined functions. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/userDefinedFunctions/delete | Delete a SQL user defined function. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/userDefinedFunctions/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/throughputSettings/write | Update a SQL database throughput. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/throughputSettings/read | Read a SQL database throughput. |
> | Microsoft.DocumentDB/databaseAccounts/sqlDatabases/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/tables/write | Create or update a table. |
> | Microsoft.DocumentDB/databaseAccounts/tables/read | Read a table or list all the tables. |
> | Microsoft.DocumentDB/databaseAccounts/tables/delete | Delete a table. |
> | Microsoft.DocumentDB/databaseAccounts/tables/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/tables/throughputSettings/write | Update a table throughput. |
> | Microsoft.DocumentDB/databaseAccounts/tables/throughputSettings/read | Read a table throughput. |
> | Microsoft.DocumentDB/databaseAccounts/tables/throughputSettings/operationResults/read | Read status of the asynchronous operation. |
> | Microsoft.DocumentDB/databaseAccounts/usages/read | Reads the database account usages. |
> | Microsoft.DocumentDB/locations/deleteVirtualNetworkOrSubnets/action | Notifies Microsoft.DocumentDB that VirtualNetwork or Subnet is being deleted |
> | Microsoft.DocumentDB/locations/deleteVirtualNetworkOrSubnets/operationResults/read | Read Status of deleteVirtualNetworkOrSubnets asynchronous operation |
> | Microsoft.DocumentDB/locations/operationsStatus/read | Reads Status of Asynchronous Operations |
> | Microsoft.DocumentDB/operationResults/read | Read status of the asynchronous operation |
> | Microsoft.DocumentDB/operations/read | Read operations available for the Microsoft DocumentDB  |

### Microsoft.Sql

Azure service: [Azure SQL Database](../azure-sql/database/index.yml), [Azure SQL Managed Instance](../azure-sql/managed-instance/index.yml), [SQL Data Warehouse](../sql-data-warehouse/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Sql/checkNameAvailability/action | Verify whether given server name is available for provisioning worldwide for a given subscription. |
> | Microsoft.Sql/register/action | Registers the subscription for the Microsoft SQL Database resource provider and enables the creation of Microsoft SQL Databases. |
> | Microsoft.Sql/unregister/action | UnRegisters the subscription for the Microsoft SQL Database resource provider and enables the creation of Microsoft SQL Databases. |
> | Microsoft.Sql/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | Microsoft.Sql/instancePools/read | Gets an instance pool |
> | Microsoft.Sql/instancePools/write | Creates or updates an instance pool |
> | Microsoft.Sql/instancePools/delete | Deletes an instance pool |
> | Microsoft.Sql/instancePools/usages/read | Gets an instance pool's usage info |
> | Microsoft.Sql/locations/read | Gets the available locations for a given subscription |
> | Microsoft.Sql/locations/auditingSettingsAzureAsyncOperation/read | Retrieve result of the extended server blob auditing policy Set operation |
> | Microsoft.Sql/locations/auditingSettingsOperationResults/read | Retrieve result of the server blob auditing policy Set operation |
> | Microsoft.Sql/locations/capabilities/read | Gets the capabilities for this subscription in a given location |
> | Microsoft.Sql/locations/databaseAzureAsyncOperation/read | Gets the status of a database operation. |
> | Microsoft.Sql/locations/databaseOperationResults/read | Gets the status of a database operation. |
> | Microsoft.Sql/locations/deletedServerAsyncOperation/read | Gets in-progress operations on deleted server |
> | Microsoft.Sql/locations/deletedServerOperationResults/read | Gets in-progress operations on deleted server |
> | Microsoft.Sql/locations/deletedServers/read | Return the list of deleted servers or gets the properties for the specified deleted server. |
> | Microsoft.Sql/locations/deletedServers/recover/action | Recover a deleted server |
> | Microsoft.Sql/locations/elasticPoolAzureAsyncOperation/read | Gets the azure async operation for an elastic pool async operation |
> | Microsoft.Sql/locations/elasticPoolOperationResults/read | Gets the result of an elastic pool operation. |
> | Microsoft.Sql/locations/encryptionProtectorAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption encryption protector |
> | Microsoft.Sql/locations/encryptionProtectorOperationResults/read | Gets in-progress operations on transparent data encryption encryption protector |
> | Microsoft.Sql/locations/extendedAuditingSettingsAzureAsyncOperation/read | Retrieve result of the extended server blob auditing policy Set operation |
> | Microsoft.Sql/locations/extendedAuditingSettingsOperationResults/read | Retrieve result of the extended server blob auditing policy Set operation |
> | Microsoft.Sql/locations/firewallRulesAzureAsyncOperation/read | Gets the status of a firewall rule operation. |
> | Microsoft.Sql/locations/firewallRulesOperationResults/read | Gets the status of a firewall rule operation. |
> | Microsoft.Sql/locations/instanceFailoverGroups/read | Returns the list of instance failover groups or gets the properties for the specified instance failover group. |
> | Microsoft.Sql/locations/instanceFailoverGroups/write | Creates an instance failover group with the specified parameters or updates the properties or tags for the specified instance failover group. |
> | Microsoft.Sql/locations/instanceFailoverGroups/delete | Deletes an existing instance failover group. |
> | Microsoft.Sql/locations/instanceFailoverGroups/failover/action | Executes planned failover in an existing instance failover group. |
> | Microsoft.Sql/locations/instanceFailoverGroups/forceFailoverAllowDataLoss/action | Executes forced failover in an existing instance failover group. |
> | Microsoft.Sql/locations/instancePoolAzureAsyncOperation/read | Gets the status of an instance pool operation |
> | Microsoft.Sql/locations/instancePoolOperationResults/read | Gets the result for an instance pool operation |
> | Microsoft.Sql/locations/interfaceEndpointProfileAzureAsyncOperation/read | Returns the details of a specific interface endpoint Azure async operation |
> | Microsoft.Sql/locations/interfaceEndpointProfileOperationResults/read | Returns the details of the specified interface endpoint profile operation |
> | Microsoft.Sql/locations/jobAgentAzureAsyncOperation/read | Gets the status of an job agent operation. |
> | Microsoft.Sql/locations/jobAgentOperationResults/read | Gets the result of an job agent operation. |
> | Microsoft.Sql/locations/longTermRetentionBackups/read | Lists the long term retention backups for every database on every server in a location |
> | Microsoft.Sql/locations/longTermRetentionManagedInstanceBackups/read | Returns a list of managed instance LTR backups for a specific location  |
> | Microsoft.Sql/locations/longTermRetentionManagedInstances/longTermRetentionDatabases/longTermRetentionManagedInstanceBackups/read | Returns a list of LTR backups for a managed instance database |
> | Microsoft.Sql/locations/longTermRetentionManagedInstances/longTermRetentionDatabases/longTermRetentionManagedInstanceBackups/delete | Deletes an LTR backup for a managed instance database |
> | Microsoft.Sql/locations/longTermRetentionManagedInstances/longTermRetentionManagedInstanceBackups/read | Returns a list of managed instance LTR backups for a specific managed instance |
> | Microsoft.Sql/locations/longTermRetentionServers/longTermRetentionBackups/read | Lists the long term retention backups for every database on a server |
> | Microsoft.Sql/locations/longTermRetentionServers/longTermRetentionDatabases/longTermRetentionBackups/read | Lists the long term retention backups for a database |
> | Microsoft.Sql/locations/longTermRetentionServers/longTermRetentionDatabases/longTermRetentionBackups/delete | Deletes a long term retention backup |
> | Microsoft.Sql/locations/managedDatabaseRestoreAzureAsyncOperation/completeRestore/action | Completes managed database restore operation |
> | Microsoft.Sql/locations/managedInstanceEncryptionProtectorAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption managed instance encryption protector |
> | Microsoft.Sql/locations/managedInstanceEncryptionProtectorOperationResults/read | Gets in-progress operations on transparent data encryption managed instance encryption protector |
> | Microsoft.Sql/locations/managedInstanceKeyAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption managed instance keys |
> | Microsoft.Sql/locations/managedInstanceKeyOperationResults/read | Gets in-progress operations on transparent data encryption managed instance keys |
> | Microsoft.Sql/locations/managedInstanceLongTermRetentionPolicyAzureAsyncOperation/read | Gets the status of a long term retention policy operation for a managed database |
> | Microsoft.Sql/locations/managedInstanceLongTermRetentionPolicyOperationResults/read | Gets the status of a long term retention policy operation for a managed database |
> | Microsoft.Sql/locations/managedInstancePrivateEndpointConnectionAzureAsyncOperation/read | Gets the result for a private endpoint connection operation |
> | Microsoft.Sql/locations/managedInstancePrivateEndpointConnectionOperationResults/read | Gets the result for a private endpoint connection operation |
> | Microsoft.Sql/locations/managedInstancePrivateEndpointConnectionProxyAzureAsyncOperation/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.Sql/locations/managedInstancePrivateEndpointConnectionProxyOperationResults/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.Sql/locations/managedShortTermRetentionPolicyOperationResults/read | Gets the status of a short term retention policy operation |
> | Microsoft.Sql/locations/managedTransparentDataEncryptionAzureAsyncOperation/read | Gets in-progress operations on managed database transparent data encryption |
> | Microsoft.Sql/locations/managedTransparentDataEncryptionOperationResults/read | Gets in-progress operations on managed database transparent data encryption |
> | Microsoft.Sql/locations/operationsHealth/read | Gets health status of the service operation in a location |
> | Microsoft.Sql/locations/privateEndpointConnectionAzureAsyncOperation/read | Gets the result for a private endpoint connection operation |
> | Microsoft.Sql/locations/privateEndpointConnectionOperationResults/read | Gets the result for a private endpoint connection operation |
> | Microsoft.Sql/locations/privateEndpointConnectionProxyAzureAsyncOperation/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.Sql/locations/privateEndpointConnectionProxyOperationResults/read | Gets the result for a private endpoint connection proxy operation |
> | Microsoft.Sql/locations/serverAdministratorAzureAsyncOperation/read | Server Azure Active Directory administrator async operation results |
> | Microsoft.Sql/locations/serverAdministratorOperationResults/read | Server Azure Active Directory administrator operation results |
> | Microsoft.Sql/locations/serverKeyAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption server keys |
> | Microsoft.Sql/locations/serverKeyOperationResults/read | Gets in-progress operations on transparent data encryption server keys |
> | Microsoft.Sql/locations/shortTermRetentionPolicyOperationResults/read | Gets the status of a short term retention policy operation |
> | Microsoft.Sql/locations/syncAgentOperationResults/read | Retrieve result of the sync agent resource operation |
> | Microsoft.Sql/locations/syncDatabaseIds/read | Retrieve the sync database ids for a particular region and subscription |
> | Microsoft.Sql/locations/syncGroupOperationResults/read | Retrieve result of the sync group resource operation |
> | Microsoft.Sql/locations/syncMemberOperationResults/read | Retrieve result of the sync member resource operation |
> | Microsoft.Sql/locations/timeZones/read | Return the list of managed instance time zones by location. |
> | Microsoft.Sql/locations/transparentDataEncryptionAzureAsyncOperation/read | Gets in-progress operations on logical database transparent data encryption |
> | Microsoft.Sql/locations/transparentDataEncryptionOperationResults/read | Gets in-progress operations on logical database transparent data encryption |
> | Microsoft.Sql/locations/usages/read | Gets a collection of usage metrics for this subscription in a location |
> | Microsoft.Sql/locations/virtualNetworkRulesAzureAsyncOperation/read | Returns the details of the specified virtual network rules azure async operation  |
> | Microsoft.Sql/locations/virtualNetworkRulesOperationResults/read | Returns the details of the specified virtual network rules operation  |
> | Microsoft.Sql/managedInstances/tdeCertificates/action | Create/Update TDE certificate |
> | Microsoft.Sql/managedInstances/read | Return the list of managed instances or gets the properties for the specified managed instance. |
> | Microsoft.Sql/managedInstances/write | Creates a managed instance with the specified parameters or update the properties or tags for the specified managed instance. |
> | Microsoft.Sql/managedInstances/delete | Deletes an existing  managed instance. |
> | Microsoft.Sql/managedInstances/administrators/read | Gets a list of managed instance administrators. |
> | Microsoft.Sql/managedInstances/administrators/write | Creates or updates managed instance administrator with the specified parameters. |
> | Microsoft.Sql/managedInstances/administrators/delete | Deletes an existing administrator of managed instance. |
> | Microsoft.Sql/managedInstances/databases/read | Gets existing managed database |
> | Microsoft.Sql/managedInstances/databases/delete | Deletes an existing managed database |
> | Microsoft.Sql/managedInstances/databases/write | Creates a new database or updates an existing database. |
> | Microsoft.Sql/managedInstances/databases/completeRestore/action | Completes managed database restore operation |
> | Microsoft.Sql/managedInstances/databases/backupLongTermRetentionPolicies/write | Updates a long term retention policy for a managed database |
> | Microsoft.Sql/managedInstances/databases/backupLongTermRetentionPolicies/read | Gets a long term retention policy for a managed database |
> | Microsoft.Sql/managedInstances/databases/backupShortTermRetentionPolicies/read | Gets a short term retention policy for a managed database |
> | Microsoft.Sql/managedInstances/databases/backupShortTermRetentionPolicies/write | Updates a short term retention policy for a managed database |
> | Microsoft.Sql/managedInstances/databases/columns/read | Return a list of columns for a managed database |
> | Microsoft.Sql/managedInstances/databases/currentSensitivityLabels/read | List sensitivity labels of a given database |
> | Microsoft.Sql/managedInstances/databases/currentSensitivityLabels/write | Batch update sensitivity labels |
> | Microsoft.Sql/managedInstances/databases/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Sql/managedInstances/databases/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Sql/managedInstances/databases/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for managed instance databases |
> | Microsoft.Sql/managedInstances/databases/queries/read | Get query text by query id |
> | Microsoft.Sql/managedInstances/databases/queries/statistics/read | Get query execution statistics by query id |
> | Microsoft.Sql/managedInstances/databases/recommendedSensitivityLabels/read | List sensitivity labels of a given database |
> | Microsoft.Sql/managedInstances/databases/recommendedSensitivityLabels/write | Batch update recommended sensitivity labels |
> | Microsoft.Sql/managedInstances/databases/restoreDetails/read | Returns managed database restore details while restore is in progress. |
> | Microsoft.Sql/managedInstances/databases/schemas/read | Get a managed database schema. |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/read | Get a managed database table |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/read | Get a managed database column |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/read | Get the sensitivity label of a given column |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/write | Create or update the sensitivity label of a given column |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/delete | Delete the sensitivity label of a given column |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/disable/action | Disable sensitivity recommendations on a given column |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/enable/action | Enable sensitivity recommendations on a given column |
> | Microsoft.Sql/managedInstances/databases/securityAlertPolicies/write | Change the database threat detection policy for a given managed database |
> | Microsoft.Sql/managedInstances/databases/securityAlertPolicies/read | Retrieve a list of managed database threat detection policies configured for a given server |
> | Microsoft.Sql/managedInstances/databases/securityEvents/read | Retrieves the managed database security events |
> | Microsoft.Sql/managedInstances/databases/sensitivityLabels/read | List sensitivity labels of a given database |
> | Microsoft.Sql/managedInstances/databases/transparentDataEncryption/read | Retrieve details of the database Transparent Data Encryption on a given managed database |
> | Microsoft.Sql/managedInstances/databases/transparentDataEncryption/write | Change the database Transparent Data Encryption for a given managed database |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/write | Change the vulnerability assessment for a given database |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/delete | Remove the vulnerability assessment for a given database |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/read | Retrieve the vulnerability assessment policies on a givendatabase |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/rules/baselines/delete | Remove the vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/rules/baselines/write | Change the vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/rules/baselines/read | Get the vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/scans/initiateScan/action | Execute vulnerability assessment database scan. |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/scans/export/action | Convert an existing scan result to a human readable format. If already exists nothing happens |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/scans/read | Return the list of database vulnerability assessment scan records or get the scan record for the specified scan ID. |
> | Microsoft.Sql/managedInstances/encryptionProtector/revalidate/action | Update the properties for the specified Server Encryption Protector. |
> | Microsoft.Sql/managedInstances/encryptionProtector/read | Returns a list of server encryption protectors or gets the properties for the specified server encryption protector. |
> | Microsoft.Sql/managedInstances/encryptionProtector/write | Update the properties for the specified Server Encryption Protector. |
> | Microsoft.Sql/managedInstances/inaccessibleManagedDatabases/read | Gets a list of inaccessible managed databases in a managed instance |
> | Microsoft.Sql/managedInstances/keys/read | Return the list of managed instance keys or gets the properties for the specified managed instance key. |
> | Microsoft.Sql/managedInstances/keys/write | Creates a key with the specified parameters or update the properties or tags for the specified managed instance key. |
> | Microsoft.Sql/managedInstances/keys/delete | Deletes an existing Azure SQL Managed Instance  key. |
> | Microsoft.Sql/managedInstances/metricDefinitions/read | Get managed instance metric definitions |
> | Microsoft.Sql/managedInstances/metrics/read | Get managed instance metrics |
> | Microsoft.Sql/managedInstances/operations/read | Get managed instance operations |
> | Microsoft.Sql/managedInstances/operations/cancel/action | Cancels Azure SQL Managed Instance pending asynchronous operation that is not finished yet. |
> | Microsoft.Sql/managedInstances/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy. |
> | Microsoft.Sql/managedInstances/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy. |
> | Microsoft.Sql/managedInstances/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Microsoft.Sql/managedInstances/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Microsoft.Sql/managedInstances/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | Microsoft.Sql/managedInstances/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Microsoft.Sql/managedInstances/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Microsoft.Sql/managedInstances/privateLinkResources/read | Get the private link resources for the corresponding sql server |
> | Microsoft.Sql/managedInstances/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Sql/managedInstances/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Sql/managedInstances/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for managed instances |
> | Microsoft.Sql/managedInstances/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for managed instances |
> | Microsoft.Sql/managedInstances/recoverableDatabases/read | Returns a list of recoverable managed databases |
> | Microsoft.Sql/managedInstances/restorableDroppedDatabases/read | Returns a list of restorable dropped managed databases. |
> | Microsoft.Sql/managedInstances/restorableDroppedDatabases/backupShortTermRetentionPolicies/read | Gets a short term retention policy for a dropped managed database |
> | Microsoft.Sql/managedInstances/restorableDroppedDatabases/backupShortTermRetentionPolicies/write | Updates a short term retention policy for a dropped managed database |
> | Microsoft.Sql/managedInstances/securityAlertPolicies/write | Change the managed server threat detection policy for a given managed server |
> | Microsoft.Sql/managedInstances/securityAlertPolicies/read | Retrieve a list of managed server threat detection policies configured for a given server |
> | Microsoft.Sql/managedInstances/topqueries/read | Get top resource consuming queries of a managed instance |
> | Microsoft.Sql/managedInstances/vulnerabilityAssessments/write | Change the vulnerability assessment for a given managed instance |
> | Microsoft.Sql/managedInstances/vulnerabilityAssessments/delete | Remove the vulnerability assessment for a given managed instance |
> | Microsoft.Sql/managedInstances/vulnerabilityAssessments/read | Retrieve the vulnerability assessment policies on a given managed instance |
> | Microsoft.Sql/operations/read | Gets available REST operations |
> | Microsoft.Sql/servers/tdeCertificates/action | Create/Update TDE certificate |
> | Microsoft.Sql/servers/disableAzureADOnlyAuthentication/action | Disable Azure Active Directory only authentication on logical Server |
> | Microsoft.Sql/servers/read | Return the list of servers or gets the properties for the specified server. |
> | Microsoft.Sql/servers/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |
> | Microsoft.Sql/servers/delete | Deletes an existing server. |
> | Microsoft.Sql/servers/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | Microsoft.Sql/servers/import/action | Create a new database on the server and deploy schema and data from a DacPac package |
> | Microsoft.Sql/servers/administratorOperationResults/read | Gets in-progress operations on server administrators |
> | Microsoft.Sql/servers/administrators/read | Gets a specific Azure Active Directory administrator object |
> | Microsoft.Sql/servers/administrators/write | Adds or updates a specific Azure Active Directory administrator object |
> | Microsoft.Sql/servers/administrators/delete | Deletes a specific Azure Active Directory administrator object |
> | Microsoft.Sql/servers/advisors/read | Returns list of advisors available for the server |
> | Microsoft.Sql/servers/advisors/write | Updates auto-execute status of an advisor on server level. |
> | Microsoft.Sql/servers/advisors/recommendedActions/read | Returns list of recommended actions of specified advisor for the server |
> | Microsoft.Sql/servers/advisors/recommendedActions/write | Apply the recommended action on the server |
> | Microsoft.Sql/servers/auditingPolicies/read | Retrieve details of the default server table auditing policy configured on a given server |
> | Microsoft.Sql/servers/auditingPolicies/write | Change the default server table auditing for a given server |
> | Microsoft.Sql/servers/auditingSettings/read | Retrieve details of the server blob auditing policy configured on a given server |
> | Microsoft.Sql/servers/auditingSettings/write | Change the server blob auditing for a given server |
> | Microsoft.Sql/servers/auditingSettings/operationResults/read | Retrieve result of the server blob auditing policy Set operation |
> | Microsoft.Sql/servers/automaticTuning/read | Returns automatic tuning settings for the server |
> | Microsoft.Sql/servers/automaticTuning/write | Updates automatic tuning settings for the server and returns updated settings |
> | Microsoft.Sql/servers/backupLongTermRetentionVaults/read | This operation is used to get a backup long term retention vault. It returns information about the vault registered to this server |
> | Microsoft.Sql/servers/backupLongTermRetentionVaults/write | This operation is used to register a backup long term retention vault to a server |
> | Microsoft.Sql/servers/backupLongTermRetentionVaults/delete | Deletes an existing backup archival vault. |
> | Microsoft.Sql/servers/communicationLinks/read | Return the list of communication links of a specified server. |
> | Microsoft.Sql/servers/communicationLinks/write | Create or update a server communication link. |
> | Microsoft.Sql/servers/communicationLinks/delete | Deletes an existing server communication link. |
> | Microsoft.Sql/servers/connectionPolicies/read | Return the list of server connection policies of a specified server. |
> | Microsoft.Sql/servers/connectionPolicies/write | Create or update a server connection policy. |
> | Microsoft.Sql/servers/databases/read | Return the list of databases or gets the properties for the specified database. |
> | Microsoft.Sql/servers/databases/write | Creates a database with the specified parameters or update the properties or tags for the specified database. |
> | Microsoft.Sql/servers/databases/delete | Deletes an existing database. |
> | Microsoft.Sql/servers/databases/pause/action | Pause Azure SQL Datawarehouse Database |
> | Microsoft.Sql/servers/databases/resume/action | Resume Azure SQL Datawarehouse Database |
> | Microsoft.Sql/servers/databases/export/action | Export Azure SQL Database |
> | Microsoft.Sql/servers/databases/upgradeDataWarehouse/action | Upgrade Azure SQL Datawarehouse Database |
> | Microsoft.Sql/servers/databases/move/action | Change the name of an existing database. |
> | Microsoft.Sql/servers/databases/restorePoints/action | Creates a new restore point |
> | Microsoft.Sql/servers/databases/failover/action | Customer initiated database failover. |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/action | Execute vulnerability assessment database scan. |
> | Microsoft.Sql/servers/databases/advisors/read | Returns list of advisors available for the database |
> | Microsoft.Sql/servers/databases/advisors/write | Update auto-execute status of an advisor on database level. |
> | Microsoft.Sql/servers/databases/advisors/recommendedActions/read | Returns list of recommended actions of specified advisor for the database |
> | Microsoft.Sql/servers/databases/advisors/recommendedActions/write | Apply the recommended action on the database |
> | Microsoft.Sql/servers/databases/auditingPolicies/read | Retrieve details of the table auditing policy configured on a given database |
> | Microsoft.Sql/servers/databases/auditingPolicies/write | Change the table auditing policy for a given database |
> | Microsoft.Sql/servers/databases/auditingSettings/read | Retrieve details of the blob auditing policy configured on a given database |
> | Microsoft.Sql/servers/databases/auditingSettings/write | Change the blob auditing policy for a given database |
> | Microsoft.Sql/servers/databases/auditRecords/read | Retrieve the database blob audit records |
> | Microsoft.Sql/servers/databases/automaticTuning/read | Returns automatic tuning settings for a database |
> | Microsoft.Sql/servers/databases/automaticTuning/write | Updates automatic tuning settings for a database and returns updated settings |
> | Microsoft.Sql/servers/databases/azureAsyncOperation/read | Gets the status of a database operation. |
> | Microsoft.Sql/servers/databases/backupLongTermRetentionPolicies/write | Create or update a database backup archival policy. |
> | Microsoft.Sql/servers/databases/backupLongTermRetentionPolicies/read | Return the list of backup archival policies of a specified database. |
> | Microsoft.Sql/servers/databases/backupShortTermRetentionPolicies/read | Gets a short term retention policy for a database |
> | Microsoft.Sql/servers/databases/backupShortTermRetentionPolicies/write | Updates a short term retention policy for a database |
> | Microsoft.Sql/servers/databases/columns/read | Return a list of columns for a database |
> | Microsoft.Sql/servers/databases/connectionPolicies/read | Retrieve details of the connection policy configured on a given database |
> | Microsoft.Sql/servers/databases/connectionPolicies/write | Change connection policy for a given database |
> | Microsoft.Sql/servers/databases/currentSensitivityLabels/read | List sensitivity labels of a given database |
> | Microsoft.Sql/servers/databases/currentSensitivityLabels/write | Batch update sensitivity labels |
> | Microsoft.Sql/servers/databases/dataMaskingPolicies/read | Return the list of database data masking policies. |
> | Microsoft.Sql/servers/databases/dataMaskingPolicies/write | Change data masking policy for a given database |
> | Microsoft.Sql/servers/databases/dataMaskingPolicies/rules/read | Retrieve details of the data masking policy rule configured on a given database |
> | Microsoft.Sql/servers/databases/dataMaskingPolicies/rules/write | Change data masking policy rule for a given database |
> | Microsoft.Sql/servers/databases/dataMaskingPolicies/rules/delete | Delete data masking policy rule for a given database |
> | Microsoft.Sql/servers/databases/dataWarehouseQueries/read | Returns the data warehouse distribution query information for selected query ID |
> | Microsoft.Sql/servers/databases/dataWarehouseQueries/dataWarehouseQuerySteps/read | Returns the distributed query step information of data warehouse query for selected step ID |
> | Microsoft.Sql/servers/databases/dataWarehouseUserActivities/read | Retrieves the user activities of a SQL Data Warehouse instance which includes running and suspended queries |
> | Microsoft.Sql/servers/databases/extendedAuditingSettings/read | Retrieve details of the extended blob auditing policy configured on a given database |
> | Microsoft.Sql/servers/databases/extendedAuditingSettings/write | Change the extended blob auditing policy for a given database |
> | Microsoft.Sql/servers/databases/extensions/read | Gets a collection of extensions for the database. |
> | Microsoft.Sql/servers/databases/extensions/write | Change the extension for a given database |
> | Microsoft.Sql/servers/databases/extensions/importExtensionOperationResults/read | Gets in-progress import operations |
> | Microsoft.Sql/servers/databases/geoBackupPolicies/read | Retrieve geo backup policies for a given database |
> | Microsoft.Sql/servers/databases/geoBackupPolicies/write | Create or update a database geobackup policy |
> | Microsoft.Sql/servers/databases/importExportOperationResults/read | Gets in-progress import/export operations |
> | Microsoft.Sql/servers/databases/maintenanceWindowOptions/read | Gets a list of available maintenance windows for a selected database. |
> | Microsoft.Sql/servers/databases/maintenanceWindows/read | Gets maintenance windows settings for a selected database. |
> | Microsoft.Sql/servers/databases/maintenanceWindows/write | Sets maintenance windows settings for a selected database. |
> | Microsoft.Sql/servers/databases/metricDefinitions/read | Return types of metrics that are available for databases |
> | Microsoft.Sql/servers/databases/metrics/read | Return metrics for databases |
> | Microsoft.Sql/servers/databases/operationResults/read | Gets the status of a database operation. |
> | Microsoft.Sql/servers/databases/operations/cancel/action | Cancels Azure SQL Database pending asynchronous operation that is not finished yet. |
> | Microsoft.Sql/servers/databases/operations/read | Return the list of operations performed on the database |
> | Microsoft.Sql/servers/databases/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Sql/servers/databases/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Sql/servers/databases/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for databases |
> | Microsoft.Sql/servers/databases/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |
> | Microsoft.Sql/servers/databases/queryStore/read | Returns current values of Query Store settings for the database. |
> | Microsoft.Sql/servers/databases/queryStore/write | Updates Query Store setting for the database |
> | Microsoft.Sql/servers/databases/queryStore/queryTexts/read | Returns the collection of query texts that correspond to the specified parameters. |
> | Microsoft.Sql/servers/databases/recommendedSensitivityLabels/read | List sensitivity labels of a given database |
> | Microsoft.Sql/servers/databases/recommendedSensitivityLabels/write | Batch update recommended sensitivity labels |
> | Microsoft.Sql/servers/databases/replicationLinks/read | Return the list of replication links or gets the properties for the specified replication links. |
> | Microsoft.Sql/servers/databases/replicationLinks/delete | Terminate the replication relationship forcefully and with potential data loss |
> | Microsoft.Sql/servers/databases/replicationLinks/failover/action | Failover after synchronizing all changes from the primary, making this database into the replication relationship\u0027s primary and making the remote primary into a secondary |
> | Microsoft.Sql/servers/databases/replicationLinks/forceFailoverAllowDataLoss/action | Failover immediately with potential data loss, making this database into the replication relationship\u0027s primary and making the remote primary into a secondary |
> | Microsoft.Sql/servers/databases/replicationLinks/updateReplicationMode/action | Update replication mode for link to synchronous or asynchronous mode |
> | Microsoft.Sql/servers/databases/replicationLinks/unlink/action | Terminate the replication relationship forcefully or after synchronizing with the partner |
> | Microsoft.Sql/servers/databases/restorePoints/read | Returns restore points for the database. |
> | Microsoft.Sql/servers/databases/restorePoints/delete | Deletes a restore point for the database. |
> | Microsoft.Sql/servers/databases/schemas/read | Get a database schema. |
> | Microsoft.Sql/servers/databases/schemas/tables/read | Get a database table. |
> | Microsoft.Sql/servers/databases/schemas/tables/columns/read | Get a database column. |
> | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/enable/action | Enable sensitivity recommendations on a given column |
> | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/disable/action | Disable sensitivity recommendations on a given column |
> | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/read | Get the sensitivity label of a given column |
> | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/write | Create or update the sensitivity label of a given column |
> | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/delete | Delete the sensitivity label of a given column |
> | Microsoft.Sql/servers/databases/schemas/tables/recommendedIndexes/read | Retrieve list of index recommendations on a database |
> | Microsoft.Sql/servers/databases/schemas/tables/recommendedIndexes/write | Apply index recommendation |
> | Microsoft.Sql/servers/databases/securityAlertPolicies/write | Change the database threat detection policy for a given database |
> | Microsoft.Sql/servers/databases/securityAlertPolicies/read | Retrieve a list of database threat detection policies configured for a given server |
> | Microsoft.Sql/servers/databases/securityMetrics/read | Gets a collection of database security metrics |
> | Microsoft.Sql/servers/databases/sensitivityLabels/read | List sensitivity labels of a given database |
> | Microsoft.Sql/servers/databases/serviceTierAdvisors/read | Return suggestion about scaling database up or down based on query execution statistics to improve performance or reduce cost |
> | Microsoft.Sql/servers/databases/skus/read | Gets a collection of skus available for a database |
> | Microsoft.Sql/servers/databases/syncGroups/refreshHubSchema/action | Refresh sync hub database schema |
> | Microsoft.Sql/servers/databases/syncGroups/cancelSync/action | Cancel sync group synchronization |
> | Microsoft.Sql/servers/databases/syncGroups/triggerSync/action | Trigger sync group synchronization |
> | Microsoft.Sql/servers/databases/syncGroups/read | Return the list of sync groups or gets the properties for the specified sync group. |
> | Microsoft.Sql/servers/databases/syncGroups/write | Creates a sync group with the specified parameters or update the properties for the specified sync group. |
> | Microsoft.Sql/servers/databases/syncGroups/delete | Deletes an existing sync group. |
> | Microsoft.Sql/servers/databases/syncGroups/hubSchemas/read | Return the list of sync hub database schemas |
> | Microsoft.Sql/servers/databases/syncGroups/logs/read | Return the list of sync group logs |
> | Microsoft.Sql/servers/databases/syncGroups/refreshHubSchemaOperationResults/read | Retrieve result of the sync hub schema refresh operation |
> | Microsoft.Sql/servers/databases/syncGroups/syncMembers/read | Return the list of sync members or gets the properties for the specified sync member. |
> | Microsoft.Sql/servers/databases/syncGroups/syncMembers/write | Creates a sync member with the specified parameters or update the properties for the specified sync member. |
> | Microsoft.Sql/servers/databases/syncGroups/syncMembers/delete | Deletes an existing sync member. |
> | Microsoft.Sql/servers/databases/syncGroups/syncMembers/refreshSchema/action | Refresh sync member schema |
> | Microsoft.Sql/servers/databases/syncGroups/syncMembers/refreshSchemaOperationResults/read | Retrieve result of the sync member schema refresh operation |
> | Microsoft.Sql/servers/databases/syncGroups/syncMembers/schemas/read | Return the list of sync member database schemas |
> | Microsoft.Sql/servers/databases/topQueries/queryText/action | Returns the Transact-SQL text for selected query ID |
> | Microsoft.Sql/servers/databases/topQueries/read | Returns aggregated runtime statistics for selected query in selected time period |
> | Microsoft.Sql/servers/databases/topQueries/statistics/read | Returns aggregated runtime statistics for selected query in selected time period |
> | Microsoft.Sql/servers/databases/transparentDataEncryption/read | Retrieve details of the logical database Transparent Data Encryption on a given managed database |
> | Microsoft.Sql/servers/databases/transparentDataEncryption/write | Change the database Transparent Data Encryption for a given logical database |
> | Microsoft.Sql/servers/databases/transparentDataEncryption/operationResults/read | Gets in-progress operations on transparent data encryption |
> | Microsoft.Sql/servers/databases/usages/read | Gets the Azure SQL Database usages information |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/write | Change the vulnerability assessment for a given database |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/delete | Remove the vulnerability assessment for a given database |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/read | Retrieve the vulnerability assessment policies on a givendatabase |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/rules/baselines/delete | Remove the vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/rules/baselines/write | Change the vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/rules/baselines/read | Get the vulnerability assessment rule baseline for a given database |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/scans/initiateScan/action | Execute vulnerability assessment database scan. |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/scans/read | Return the list of database vulnerability assessment scan records or get the scan record for the specified scan ID. |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/scans/export/action | Convert an existing scan result to a human readable format. If already exists nothing happens |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/operationResults/read | Retrieve the result of the database vulnerability assessment scan Execute operation |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/read | Retrieve details of the vulnerability assessment configured on a given database |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/write | Change the vulnerability assessment for a given database |
> | Microsoft.Sql/servers/databases/workloadGroups/read | Lists the workload groups for a selected database. |
> | Microsoft.Sql/servers/databases/workloadGroups/write | Sets the properties for a specific workload group. |
> | Microsoft.Sql/servers/databases/workloadGroups/delete | Drops a specific workload group. |
> | Microsoft.Sql/servers/databases/workloadGroups/workloadClassifiers/read | Lists the workload classifiers for a selected database. |
> | Microsoft.Sql/servers/databases/workloadGroups/workloadClassifiers/write | Sets the properties for a specific workload classifier. |
> | Microsoft.Sql/servers/databases/workloadGroups/workloadClassifiers/delete | Drops a specific workload classifier. |
> | Microsoft.Sql/servers/disasterRecoveryConfiguration/read | Gets a collection of disaster recovery configurations that include this server |
> | Microsoft.Sql/servers/disasterRecoveryConfiguration/write | Change server disaster recovery configuration |
> | Microsoft.Sql/servers/disasterRecoveryConfiguration/delete | Deletes an existing disaster recovery configurations for a given server |
> | Microsoft.Sql/servers/disasterRecoveryConfiguration/failover/action | Failover a DisasterRecoveryConfiguration |
> | Microsoft.Sql/servers/disasterRecoveryConfiguration/forceFailoverAllowDataLoss/action | Force Failover a DisasterRecoveryConfiguration |
> | Microsoft.Sql/servers/elasticPoolEstimates/read | Returns list of elastic pool estimates already created for this server |
> | Microsoft.Sql/servers/elasticPoolEstimates/write | Creates new elastic pool estimate for list of databases provided |
> | Microsoft.Sql/servers/elasticPools/read | Retrieve details of elastic pool on a given server |
> | Microsoft.Sql/servers/elasticPools/write | Create a new or change properties of existing elastic pool |
> | Microsoft.Sql/servers/elasticPools/delete | Delete existing elastic pool |
> | Microsoft.Sql/servers/elasticPools/failover/action | Customer initiated elastic pool failover. |
> | Microsoft.Sql/servers/elasticPools/advisors/read | Returns list of advisors available for the elastic pool |
> | Microsoft.Sql/servers/elasticPools/advisors/write | Update auto-execute status of an advisor on elastic pool level. |
> | Microsoft.Sql/servers/elasticPools/advisors/recommendedActions/read | Returns list of recommended actions of specified advisor for the elastic pool |
> | Microsoft.Sql/servers/elasticPools/advisors/recommendedActions/write | Apply the recommended action on the elastic pool |
> | Microsoft.Sql/servers/elasticPools/databases/read | Gets a list of databases for an elastic pool |
> | Microsoft.Sql/servers/elasticPools/elasticPoolActivity/read | Retrieve activities and details on a given elastic database pool |
> | Microsoft.Sql/servers/elasticPools/elasticPoolDatabaseActivity/read | Retrieve activities and details on a given database that is part of elastic database pool |
> | Microsoft.Sql/servers/elasticPools/metricDefinitions/read | Return types of metrics that are available for elastic database pools |
> | Microsoft.Sql/servers/elasticPools/metrics/read | Return metrics for elastic database pools |
> | Microsoft.Sql/servers/elasticPools/operations/cancel/action | Cancels Azure SQL elastic pool pending asynchronous operation that is not finished yet. |
> | Microsoft.Sql/servers/elasticPools/operations/read | Return the list of operations performed on the elastic pool |
> | Microsoft.Sql/servers/elasticPools/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Sql/servers/elasticPools/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Sql/servers/elasticPools/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for elastic database pools |
> | Microsoft.Sql/servers/elasticPools/skus/read | Gets a collection of skus available for an elastic pool |
> | Microsoft.Sql/servers/encryptionProtector/revalidate/action | Update the properties for the specified Server Encryption Protector. |
> | Microsoft.Sql/servers/encryptionProtector/read | Returns a list of server encryption protectors or gets the properties for the specified server encryption protector. |
> | Microsoft.Sql/servers/encryptionProtector/write | Update the properties for the specified Server Encryption Protector. |
> | Microsoft.Sql/servers/extendedAuditingSettings/read | Retrieve details of the extended server blob auditing policy configured on a given server |
> | Microsoft.Sql/servers/extendedAuditingSettings/write | Change the extended server blob auditing for a given server |
> | Microsoft.Sql/servers/failoverGroups/read | Returns the list of failover groups or gets the properties for the specified failover group. |
> | Microsoft.Sql/servers/failoverGroups/write | Creates a failover group with the specified parameters or updates the properties or tags for the specified failover group. |
> | Microsoft.Sql/servers/failoverGroups/delete | Deletes an existing failover group. |
> | Microsoft.Sql/servers/failoverGroups/failover/action | Executes planned failover in an existing failover group. |
> | Microsoft.Sql/servers/failoverGroups/forceFailoverAllowDataLoss/action | Executes forced failover in an existing failover group. |
> | Microsoft.Sql/servers/firewallRules/write | Creates a server firewall rule with the specified parameters, update the properties for the specified rule or overwrite all existing rules with new server firewall rule(s). |
> | Microsoft.Sql/servers/firewallRules/read | Return the list of server firewall rules or gets the properties for the specified server firewall rule. |
> | Microsoft.Sql/servers/firewallRules/delete | Deletes an existing server firewall rule. |
> | Microsoft.Sql/servers/importExportOperationResults/read | Gets in-progress import/export operations |
> | Microsoft.Sql/servers/inaccessibleDatabases/read | Return a list of inaccessible database(s) in a logical server. |
> | Microsoft.Sql/servers/interfaceEndpointProfiles/write | Creates a interface endpoint profile with the specified parameters or updates the properties or tags for the specified interface endpoint |
> | Microsoft.Sql/servers/interfaceEndpointProfiles/read | Returns the properties for the specified interface endpoint profile |
> | Microsoft.Sql/servers/interfaceEndpointProfiles/delete | Deletes the specified interface endpoint profile |
> | Microsoft.Sql/servers/jobAgents/read | Gets an Azure SQL DB job agent |
> | Microsoft.Sql/servers/jobAgents/write | Creates or updates an Azure SQL DB job agent |
> | Microsoft.Sql/servers/jobAgents/delete | Deletes an Azure SQL DB job agent |
> | Microsoft.Sql/servers/keys/read | Return the list of server keys or gets the properties for the specified server key. |
> | Microsoft.Sql/servers/keys/write | Creates a key with the specified parameters or update the properties or tags for the specified server key. |
> | Microsoft.Sql/servers/keys/delete | Deletes an existing server key. |
> | Microsoft.Sql/servers/operationResults/read | Gets in-progress server operations |
> | Microsoft.Sql/servers/operations/read | Return the list of operations performed on the server |
> | Microsoft.Sql/servers/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Microsoft.Sql/servers/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy. |
> | Microsoft.Sql/servers/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy. |
> | Microsoft.Sql/servers/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Microsoft.Sql/servers/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | Microsoft.Sql/servers/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Microsoft.Sql/servers/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Microsoft.Sql/servers/privateLinkResources/read | Get the private link resources for the corresponding sql server |
> | Microsoft.Sql/servers/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for servers |
> | Microsoft.Sql/servers/recommendedElasticPools/read | Retrieve recommendation for elastic database pools to reduce cost or improve performance based on historical resource utilization |
> | Microsoft.Sql/servers/recommendedElasticPools/databases/read | Retrieve metrics for recommended elastic database pools for a given server |
> | Microsoft.Sql/servers/recoverableDatabases/read | This operation is used for disaster recovery of live database to restore database to last-known good backup point. It returns information about the last good backup but it doesn\u0027t actually restore the database. |
> | Microsoft.Sql/servers/replicationLinks/read | Return the list of replication links or gets the properties for the specified replication links. |
> | Microsoft.Sql/servers/restorableDroppedDatabases/read | Get a list of databases that were dropped on a given server that are still within retention policy. |
> | Microsoft.Sql/servers/securityAlertPolicies/write | Change the server threat detection policy for a given server |
> | Microsoft.Sql/servers/securityAlertPolicies/read | Retrieve a list of server threat detection policies configured for a given server |
> | Microsoft.Sql/servers/securityAlertPolicies/operationResults/read | Retrieve results of the server threat detection policy write operation |
> | Microsoft.Sql/servers/serviceObjectives/read | Retrieve list of service level objectives (also known as performance tiers) available on a given server |
> | Microsoft.Sql/servers/syncAgents/read | Return the list of sync agents or gets the properties for the specified sync agent. |
> | Microsoft.Sql/servers/syncAgents/write | Creates a sync agent with the specified parameters or update the properties for the specified sync agent. |
> | Microsoft.Sql/servers/syncAgents/delete | Deletes an existing sync agent. |
> | Microsoft.Sql/servers/syncAgents/generateKey/action | Generate sync agent registration key |
> | Microsoft.Sql/servers/syncAgents/linkedDatabases/read | Return the list of sync agent linked databases |
> | Microsoft.Sql/servers/usages/read | Return server DTU quota and current DTU consumption by all databases within the server |
> | Microsoft.Sql/servers/virtualNetworkRules/read | Return the list of virtual network rules or gets the properties for the specified virtual network rule. |
> | Microsoft.Sql/servers/virtualNetworkRules/write | Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule. |
> | Microsoft.Sql/servers/virtualNetworkRules/delete | Deletes an existing Virtual Network Rule |
> | Microsoft.Sql/servers/vulnerabilityAssessments/write | Change the vulnerability assessment for a given server |
> | Microsoft.Sql/servers/vulnerabilityAssessments/delete | Remove the vulnerability assessment for a given server |
> | Microsoft.Sql/servers/vulnerabilityAssessments/read | Retrieve the vulnerability assessment policies on a given server |
> | Microsoft.Sql/virtualClusters/read | Return the list of virtual clusters or gets the properties for the specified virtual cluster. |
> | Microsoft.Sql/virtualClusters/write | Updates virtual cluster tags. |
> | Microsoft.Sql/virtualClusters/delete | Deletes an existing virtual cluster. |

### Microsoft.SqlVirtualMachine

Azure service: [SQL Server on Azure Virtual Machines](../azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.SqlVirtualMachine/register/action | Register subscription with Microsoft.SqlVirtualMachine resource provider |
> | Microsoft.SqlVirtualMachine/unregister/action | Unregister subscription with Microsoft.SqlVirtualMachine resource provider |
> | Microsoft.SqlVirtualMachine/locations/registerSqlVmCandidate/action | Register SQL Vm Candidate |
> | Microsoft.SqlVirtualMachine/locations/availabilityGroupListenerOperationResults/read | Get result of an availability group listener operation |
> | Microsoft.SqlVirtualMachine/locations/sqlVirtualMachineGroupOperationResults/read | Get result of a SQL virtual machine group operation |
> | Microsoft.SqlVirtualMachine/locations/sqlVirtualMachineOperationResults/read | Get result of SQL virtual machine operation |
> | Microsoft.SqlVirtualMachine/operations/read |  |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/read | Retrive details of SQL virtual machine group |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/write | Create a new or change properties of existing SQL virtual machine group |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/delete | Delete existing SQL virtual machine group |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/availabilityGroupListeners/read | Retrieve details of SQL availability group listener on a given SQL virtual machine group |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/availabilityGroupListeners/write | Create a new or changes properties of existing SQL availability group listener |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/availabilityGroupListeners/delete | Delete existing availability group listener |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/sqlVirtualMachines/read | List Sql virtual machines by a particular sql virtual virtual machine group |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachines/read | Retrieve details of SQL virtual machine |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachines/write | Create a new or change properties of existing SQL virtual machine |
> | Microsoft.SqlVirtualMachine/sqlVirtualMachines/delete | Delete existing SQL virtual machine |

## Analytics

### Microsoft.AnalysisServices

Azure service: [Azure Analysis Services](../analysis-services/index.yml)

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
> | Microsoft.AnalysisServices/servers/skus/read | Retrieve available SKU information for the server |
> | Microsoft.AnalysisServices/skus/read | Retrieves the information of Skus |

### Microsoft.Databricks

Azure service: [Azure Databricks](../azure-databricks/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Databricks/register/action | Register to Databricks. |
> | Microsoft.Databricks/locations/getNetworkPolicies/action | Get Network Intent Polices for a subnet based on the location used by NRP |
> | Microsoft.Databricks/locations/operationstatuses/read | Reads the operation status for the resource. |
> | Microsoft.Databricks/operations/read | Gets the list of operations. |
> | Microsoft.Databricks/workspaces/read | Retrieves a list of Databricks workspaces. |
> | Microsoft.Databricks/workspaces/write | Creates a Databricks workspace. |
> | Microsoft.Databricks/workspaces/delete | Removes a Databricks workspace. |
> | Microsoft.Databricks/workspaces/refreshPermissions/action | Refresh permissions for a workspace |
> | Microsoft.Databricks/workspaces/updateDenyAssignment/action | Update deny assignment not actions for a managed resource group of a workspace |
> | Microsoft.Databricks/workspaces/refreshWorkspaces/action | Refresh a workspace with new details like URL |
> | Microsoft.Databricks/workspaces/dbWorkspaces/write | Initializes the Databricks workspace (internal only) |
> | Microsoft.Databricks/workspaces/providers/Microsoft.Insights/diagnosticSettings/read | Sets the available diagnostic settings for the Databricks workspace |
> | Microsoft.Databricks/workspaces/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.Databricks/workspaces/providers/Microsoft.Insights/logDefinitions/read | Gets the available log definitions for the Databricks workspace |
> | Microsoft.Databricks/workspaces/storageEncryption/write | Enables the Customer managed Key encryption on the managed storage account of the Databricks workspace |
> | Microsoft.Databricks/workspaces/storageEncryption/delete | Disables the Customer Managed Key encryption on the managed storage account of the Databricks workspace |
> | Microsoft.Databricks/workspaces/virtualNetworkPeerings/read | Gets the virtual network peering. |
> | Microsoft.Databricks/workspaces/virtualNetworkPeerings/write | Add or modify virtual network peering |
> | Microsoft.Databricks/workspaces/virtualNetworkPeerings/delete | Deletes a virtual network peering |

### Microsoft.DataLakeAnalytics

Azure service: [Data Lake Analytics](../data-lake-analytics/index.yml)

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
> | Microsoft.DataLakeAnalytics/accounts/firewallRules/read | Get information about a firewall rule. |
> | Microsoft.DataLakeAnalytics/accounts/firewallRules/write | Create or update a firewall rule. |
> | Microsoft.DataLakeAnalytics/accounts/firewallRules/delete | Delete a firewall rule. |
> | Microsoft.DataLakeAnalytics/accounts/operationResults/read | Get result of a DataLakeAnalytics account operation. |
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

Azure service: [Azure Data Lake Store](../storage/blobs/data-lake-storage-introduction.md)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DataLakeStore/register/action | Register subscription to DataLakeStore. |
> | Microsoft.DataLakeStore/accounts/read | Get information about an existing DataLakeStore account. |
> | Microsoft.DataLakeStore/accounts/write | Create or update a DataLakeStore account. |
> | Microsoft.DataLakeStore/accounts/delete | Delete a DataLakeStore account. |
> | Microsoft.DataLakeStore/accounts/enableKeyVault/action | Enable KeyVault for a DataLakeStore account. |
> | Microsoft.DataLakeStore/accounts/Superuser/action | Grant Superuser on Data Lake Store when granted with Microsoft.Authorization/roleAssignments/write. |
> | Microsoft.DataLakeStore/accounts/eventGridFilters/read | Get an EventGrid Filter. |
> | Microsoft.DataLakeStore/accounts/eventGridFilters/write | Create or update an EventGrid Filter. |
> | Microsoft.DataLakeStore/accounts/eventGridFilters/delete | Delete an EventGrid Filter. |
> | Microsoft.DataLakeStore/accounts/firewallRules/read | Get information about a firewall rule. |
> | Microsoft.DataLakeStore/accounts/firewallRules/write | Create or update a firewall rule. |
> | Microsoft.DataLakeStore/accounts/firewallRules/delete | Delete a firewall rule. |
> | Microsoft.DataLakeStore/accounts/operationResults/read | Get result of a DataLakeStore account operation. |
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
> | Microsoft.DataLakeStore/locations/capability/read | Get capability information of a subscription regarding using DataLakeStore. |
> | Microsoft.DataLakeStore/locations/operationResults/read | Get result of a DataLakeStore account operation. |
> | Microsoft.DataLakeStore/locations/usages/read | Get quota usages information of a subscription regarding using DataLakeStore. |
> | Microsoft.DataLakeStore/operations/read | Get available operations of DataLakeStore. |

### Microsoft.EventHub

Azure service: [Event Hubs](../event-hubs/index.yml)

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
> | Microsoft.EventHub/namespaces/removeAcsNamepsace/action | Remove ACS namespace |
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
> | Microsoft.EventHub/namespaces/operationresults/read | Get the status of Namespace operation |
> | Microsoft.EventHub/namespaces/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxy |
> | Microsoft.EventHub/namespaces/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.EventHub/namespaces/privateEndpointConnectionProxies/write | Create Private Endpoint Connection Proxy |
> | Microsoft.EventHub/namespaces/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxy |
> | Microsoft.EventHub/namespaces/providers/Microsoft.Insights/diagnosticSettings/read | Get list of Namespace diagnostic settings Resource Descriptions |
> | Microsoft.EventHub/namespaces/providers/Microsoft.Insights/diagnosticSettings/write | Get list of Namespace diagnostic settings Resource Descriptions |
> | Microsoft.EventHub/namespaces/providers/Microsoft.Insights/logDefinitions/read | Get list of Namespace logs Resource Descriptions |
> | Microsoft.EventHub/namespaces/providers/Microsoft.Insights/metricDefinitions/read | Get list of Namespace metrics Resource Descriptions |
> | Microsoft.EventHub/namespaces/virtualNetworkRules/read | Gets VNET Rule Resource |
> | Microsoft.EventHub/namespaces/virtualNetworkRules/write | Create VNET Rule Resource |
> | Microsoft.EventHub/namespaces/virtualNetworkRules/delete | Delete VNET Rule Resource |
> | Microsoft.EventHub/operations/read | Get Operations |
> | Microsoft.EventHub/sku/read | Get list of Sku Resource Descriptions |
> | Microsoft.EventHub/sku/regions/read | Get list of SkuRegions Resource Descriptions |
> | **DataAction** | **Description** |
> | Microsoft.EventHub/namespaces/messages/send/action | Send messages |
> | Microsoft.EventHub/namespaces/messages/receive/action | Receive messages |

### Microsoft.HDInsight

Azure service: [HDInsight](../hdinsight/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.HDInsight/register/action | Register HDInsight resource provider for the subscription |
> | Microsoft.HDInsight/unregister/action | Unregister HDInsight resource provider for the subscription |
> | Microsoft.HDInsight/clusters/write | Create or Update HDInsight Cluster |
> | Microsoft.HDInsight/clusters/read | Get details about HDInsight Cluster |
> | Microsoft.HDInsight/clusters/delete | Delete a HDInsight Cluster |
> | Microsoft.HDInsight/clusters/changerdpsetting/action | Change RDP setting for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/getGatewaySettings/action | Get gateway settings for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/updateGatewaySettings/action | Update gateway settings for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/configurations/action | Get HDInsight Cluster Configurations |
> | Microsoft.HDInsight/clusters/applications/read | Get Application for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/applications/write | Create or Update Application for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/applications/delete | Delete Application for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/configurations/read | Get HDInsight Cluster Configurations |
> | Microsoft.HDInsight/clusters/extensions/write | Create Cluster Extension for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/extensions/read | Get Cluster Extension for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/extensions/delete | Delete Cluster Extension for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource HDInsight Cluster |
> | Microsoft.HDInsight/clusters/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource HDInsight Cluster |
> | Microsoft.HDInsight/clusters/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/roles/resize/action | Resize a HDInsight Cluster |
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
> | Microsoft.Kusto/Clusters/DiagnoseVirtualNetwork/action | Diagnoses network connectivity status for external resources on which the service is dependent on. |
> | Microsoft.Kusto/Clusters/ListLanguageExtensions/action | Lists language extensions. |
> | Microsoft.Kusto/Clusters/AddLanguageExtensions/action | Add language extensions. |
> | Microsoft.Kusto/Clusters/RemoveLanguageExtensions/action | Remove language extensions. |
> | Microsoft.Kusto/Clusters/AttachedDatabaseConfigurations/read | Reads an attached database configuration resource. |
> | Microsoft.Kusto/Clusters/AttachedDatabaseConfigurations/write | Writes an attached database configuration resource. |
> | Microsoft.Kusto/Clusters/AttachedDatabaseConfigurations/delete | Deletes an attached database configuration resource. |
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
> | Microsoft.Kusto/Clusters/DataConnections/read | Reads a cluster's data connections resource. |
> | Microsoft.Kusto/Clusters/DataConnections/write | Writes a cluster's data connections resource. |
> | Microsoft.Kusto/Clusters/DataConnections/delete | Deletes a cluster's data connections resource. |
> | Microsoft.Kusto/Clusters/PrincipalAssignments/read | Reads a Cluster principal assignments resource. |
> | Microsoft.Kusto/Clusters/PrincipalAssignments/write | Writes a Cluster principal assignments resource. |
> | Microsoft.Kusto/Clusters/PrincipalAssignments/delete | Deletes a Cluster principal assignments resource. |
> | Microsoft.Kusto/Clusters/SKUs/read | Reads a cluster SKU resource. |
> | Microsoft.Kusto/Locations/CheckNameAvailability/action | Checks resource name availability. |
> | Microsoft.Kusto/Locations/GetNetworkPolicies/action | Gets Network Intent Policies |
> | Microsoft.Kusto/locations/operationresults/read | Reads operations resources |
> | Microsoft.Kusto/Operations/read | Reads operations resources |
> | Microsoft.Kusto/SKUs/read | Reads a SKU resource. |

### Microsoft.PowerBIDedicated

Azure service: [Power BI Embedded](https://docs.microsoft.com/azure/power-bi-embedded/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.PowerBIDedicated/register/action | Registers Power BI Dedicated resource provider. |
> | Microsoft.PowerBIDedicated/capacities/read | Retrieves the information of the specified Power BI Dedicated Capacity. |
> | Microsoft.PowerBIDedicated/capacities/write | Creates or updates the specified Power BI Dedicated Capacity. |
> | Microsoft.PowerBIDedicated/capacities/delete | Deletes the Power BI Dedicated Capacity. |
> | Microsoft.PowerBIDedicated/capacities/suspend/action | Suspends the Capacity. |
> | Microsoft.PowerBIDedicated/capacities/resume/action | Resumes the Capacity. |
> | Microsoft.PowerBIDedicated/capacities/skus/read | Retrieve available SKU information for the capacity |
> | Microsoft.PowerBIDedicated/locations/checkNameAvailability/action | Checks that given Power BI Dedicated Capacity name is valid and not in use. |
> | Microsoft.PowerBIDedicated/locations/operationresults/read | Retrieves the information of the specified operation result. |
> | Microsoft.PowerBIDedicated/locations/operationstatuses/read | Retrieves the information of the specified operation status. |
> | Microsoft.PowerBIDedicated/operations/read | Retrieves the information of operations |
> | Microsoft.PowerBIDedicated/skus/read | Retrieves the information of Skus |

### Microsoft.StreamAnalytics

Azure service: [Stream Analytics](../stream-analytics/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.StreamAnalytics/Register/action | Register subscription with Stream Analytics Resource Provider |
> | Microsoft.StreamAnalytics/locations/quotas/Read | Read Stream Analytics Subscription Quota |
> | Microsoft.StreamAnalytics/operations/Read | Read Stream Analytics Operations |
> | Microsoft.StreamAnalytics/streamingjobs/Delete | Delete Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/PublishEdgePackage/action | Publish edge package for Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/Read | Read Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/Scale/action | Scale Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/Start/action | Start Stream Analytics Job |
> | Microsoft.StreamAnalytics/streamingjobs/Stop/action | Stop Stream Analytics Job |
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

## Blockchain

### Microsoft.Blockchain

Azure service: [Azure Blockchain Service](../blockchain/workbench/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Blockchain/register/action | Registers the subscription for the Blockchain Resource Provider. |
> | Microsoft.Blockchain/blockchainMembers/read | Gets or Lists existing Blockchain Member(s). |
> | Microsoft.Blockchain/blockchainMembers/write | Creates or Updates a Blockchain Member. |
> | Microsoft.Blockchain/blockchainMembers/delete | Deletes an existing Blockchain Member. |
> | Microsoft.Blockchain/blockchainMembers/listApiKeys/action | Gets or Lists existing Blockchain Member API keys. |
> | Microsoft.Blockchain/blockchainMembers/transactionNodes/read | Gets or Lists existing Blockchain Member Transaction Node(s). |
> | Microsoft.Blockchain/blockchainMembers/transactionNodes/write | Creates or Updates a Blockchain Member Transaction Node. |
> | Microsoft.Blockchain/blockchainMembers/transactionNodes/delete | Deletes an existing Blockchain Member Transaction Node. |
> | Microsoft.Blockchain/blockchainMembers/transactionNodes/listApiKeys/action | Gets or Lists existing Blockchain Member Transaction Node API keys. |
> | Microsoft.Blockchain/cordaMembers/read | Gets or Lists existing Blockchain Corda Member(s). |
> | Microsoft.Blockchain/cordaMembers/write | Creates or Updates a Blockchain Corda Member. |
> | Microsoft.Blockchain/cordaMembers/delete | Deletes an existing Blockchain Corda Member. |
> | Microsoft.Blockchain/locations/checkNameAvailability/action | Checks that resource name is valid and is not in use. |
> | Microsoft.Blockchain/locations/blockchainMemberOperationResults/read | Gets the Operation Results of Blockchain Members. |
> | Microsoft.Blockchain/operations/read | List all Operations in Microsoft Blockchain Resource Provider. |
> | **DataAction** | **Description** |
> | Microsoft.Blockchain/blockchainMembers/transactionNodes/connect/action | Connects to a Blockchain Member Transaction Node. |

## AI + machine learning

### Microsoft.BotService

Azure service: [Azure Bot Service](https://docs.microsoft.com/azure/bot-service/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.BotService/checknameavailability/action | Check Name Availability of a Bot |
> | Microsoft.BotService/listauthserviceproviders/action | List Auth Service Providers |
> | Microsoft.BotService/botServices/read | Read a Bot Service |
> | Microsoft.BotService/botServices/write | Write a Bot Service |
> | Microsoft.BotService/botServices/delete | Delete a Bot Service |
> | Microsoft.BotService/botServices/channels/read | Read a Bot Service Channel |
> | Microsoft.BotService/botServices/channels/write | Write a Bot Service Channel |
> | Microsoft.BotService/botServices/channels/delete | Delete a Bot Service Channel |
> | Microsoft.BotService/botServices/channels/listchannelwithkeys/action | List Botservice channels with secrets |
> | Microsoft.BotService/botServices/connections/read | Read a Bot Service Connection |
> | Microsoft.BotService/botServices/connections/write | Write a Bot Service Connection |
> | Microsoft.BotService/botServices/connections/delete | Delete a Bot Service Connection |
> | Microsoft.BotService/botServices/connections/listwithsecrets/write | Write a Bot Service Connection List  |
> | Microsoft.BotService/locations/operationresults/read | Read the status of an asynchronous operation |
> | Microsoft.BotService/Operations/read | Read the operations for all resource types |

### Microsoft.CognitiveServices

Azure service: [Cognitive Services](../cognitive-services/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.CognitiveServices/register/action | Subscription Registration Action |
> | Microsoft.CognitiveServices/register/action | Registers Subscription for Cognitive Services |
> | Microsoft.CognitiveServices/checkDomainAvailability/action | Reads available SKUs for a subscription. |
> | Microsoft.CognitiveServices/register/action | Registers Subscription for Cognitive Services |
> | Microsoft.CognitiveServices/accounts/read | Reads API accounts. |
> | Microsoft.CognitiveServices/accounts/write | Writes API Accounts. |
> | Microsoft.CognitiveServices/accounts/delete | Deletes API accounts |
> | Microsoft.CognitiveServices/accounts/listKeys/action | List Keys |
> | Microsoft.CognitiveServices/accounts/regenerateKey/action | Regenerate Key |
> | Microsoft.CognitiveServices/accounts/privateEndpointConnectionProxies/read | Reads private endpoint connections. |
> | Microsoft.CognitiveServices/accounts/privateEndpointConnectionProxies/write | Writes a private endpoint connections. |
> | Microsoft.CognitiveServices/accounts/privateEndpointConnectionProxies/delete | Deletes a private endpoint connections. |
> | Microsoft.CognitiveServices/accounts/privateEndpointConnectionProxies/validate/action | Validate a private endpoint connections. |
> | Microsoft.CognitiveServices/accounts/privateEndpointConnections/read | Reads private endpoint connections. |
> | Microsoft.CognitiveServices/accounts/privateEndpointConnections/write | Writes a private endpoint connections. |
> | Microsoft.CognitiveServices/accounts/privateEndpointConnections/delete | Deletes a private endpoint connections. |
> | Microsoft.CognitiveServices/accounts/privateLinkResources/read | Reads private link resources for an account. |
> | Microsoft.CognitiveServices/accounts/skus/read | Reads available SKUs for an existing resource. |
> | Microsoft.CognitiveServices/accounts/usages/read | Get the quota usage for an existing resource. |
> | Microsoft.CognitiveServices/locations/checkSkuAvailability/action | Reads available SKUs for a subscription. |
> | Microsoft.CognitiveServices/locations/deleteVirtualNetworkOrSubnets/action | Notification from Microsoft.Network of deleting VirtualNetworks or Subnets. |
> | Microsoft.CognitiveServices/locations/checkSkuAvailability/action | Reads available SKUs for a subscription. |
> | Microsoft.CognitiveServices/locations/operationresults/read | Read the status of an asynchronous operation. |
> | Microsoft.CognitiveServices/Operations/read | List all available operations |
> | **DataAction** | **Description** |
> | Microsoft.CognitiveServices/accounts/AnomalyDetector/timeseries/entire/detect/action | This operation generates a model using an entire series, each point is detected with the same model.<br>With this method, points before and after a certain point are used to determine whether it is an anomaly.<br>The entire detection can give the user an overall status of the time series. |
> | Microsoft.CognitiveServices/accounts/AnomalyDetector/timeseries/last/detect/action | This operation generates a model using points before the latest one. With this method, only historical points are used to determine whether the target point is an anomaly. The latest point detecting matches the scenario of real-time monitoring of business metrics. |
> | Microsoft.CognitiveServices/accounts/Autosuggest/search/action | This operation provides suggestions for a given query or partial query. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/analyze/action | This operation extracts a rich set of visual features based on the image content.  |
> | Microsoft.CognitiveServices/accounts/ComputerVision/describe/action | This operation generates a description of an image in human readable language with complete sentences.<br> The description is based on a collection of content tags, which are also returned by the operation.<br>More than one description can be generated for each image.<br> Descriptions are ordered by their confidence score.<br>All descriptions are in English. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/generatethumbnail/action | This operation generates a thumbnail image with the user-specified width and height.<br> By default, the service analyzes the image, identifies the region of interest (ROI), and generates smart cropping coordinates based on the ROI.<br> Smart cropping helps when you specify an aspect ratio that differs from that of the input image |
> | Microsoft.CognitiveServices/accounts/ComputerVision/ocr/action | Optical Character Recognition (OCR) detects text in an image and extracts the recognized characters into a machine-usable character stream.    |
> | Microsoft.CognitiveServices/accounts/ComputerVision/recognizetext/action | Use this interface to get the result of a Recognize Text operation. When you use the Recognize Text interface, the response contains a field called "Operation-Location". The "Operation-Location" field contains the URL that you must use for your Get Recognize Text Operation Result operation. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/tag/action | This operation generates a list of words, or tags, that are relevant to the content of the supplied image.<br>The Computer Vision API can return tags based on objects, living beings, scenery or actions found in images.<br>Unlike categories, tags are not organized according to a hierarchical classification system, but correspond to image content.<br>Tags may contain hints to avoid ambiguity or provide context, for example the tag "cello" may be accompanied by the hint "musical instrument".<br>All tags are in English. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/areaofinterest/action | This operation returns a bounding box around the most important area of the image. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/detect/action | This operation Performs object detection on the specified image.  |
> | Microsoft.CognitiveServices/accounts/ComputerVision/models/read | This operation returns the list of domain-specific models that are supported by the Computer Vision API.  Currently, the API supports following domain-specific models: celebrity recognizer, landmark recognizer. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/models/analyze/action | This operation recognizes content within an image by applying a domain-specific model.<br> The list of domain-specific models that are supported by the Computer Vision API can be retrieved using the /models GET request.<br> Currently, the API provides following domain-specific models: celebrities, landmarks. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/read/analyze/action | Use this interface to perform a Read operation, employing the state-of-the-art Optical Character Recognition (OCR) algorithms optimized for text-heavy documents.<br>It can handle hand-written, printed or mixed documents.<br>When you use the Read interface, the response contains a header called 'Operation-Location'.<br>The 'Operation-Location' header contains the URL that you must use for your Get Read Result operation to access OCR results. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/read/analyzeresults/read | Use this interface to retrieve the status and OCR result of a Read operation.  The URL containing the 'operationId' is returned in the Read operation 'Operation-Location' response header. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/read/core/asyncbatchanalyze/action | Use this interface to get the result of a Batch Read File operation, employing the state-of-the-art Optical Character |
> | Microsoft.CognitiveServices/accounts/ComputerVision/read/operations/read | This interface is used for getting OCR results of Read operation. The URL to this interface should be retrieved from <b>"Operation-Location"</b> field returned from Batch Read File interface. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/textoperations/read | This interface is used for getting recognize text operation result. The URL to this interface should be retrieved from <b>"Operation-Location"</b> field returned from Recognize Text interface. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/action | Create image list. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/action | Create term list. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/read | Image Lists -  Get Details - Image Lists - Get All |
> | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/delete | Image Lists - Delete |
> | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/refreshindex/action | Image Lists - Refresh Search Index |
> | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/write | Image Lists - Update Details |
> | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/images/write | Add an Image to your image list. The image list can be used to do fuzzy matching against other images when using Image/Match API. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/images/delete | Delete an Image from your image list. The image list can be used to do fuzzy matching against other images when using Image/Match API. Delete all images from your list. The image list can be used to do fuzzy matching against other images when using Image/Match API.* |
> | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/images/read | Image - Get all Image Ids |
> | Microsoft.CognitiveServices/accounts/ContentModerator/processimage/evaluate/action | Returns probabilities of the image containing racy or adult content. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/processimage/findfaces/action | Find faces in images. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/processimage/match/action | Fuzzily match an image against one of your custom Image Lists. You can create and manage your custom image lists using this API.  |
> | Microsoft.CognitiveServices/accounts/ContentModerator/processimage/ocr/action | Returns any text found in the image for the language specified. If no language is specified in input then the detection defaults to English. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/processtext/detectlanguage/action | This operation will detect the language of given input content. Returns the ISO 639-3 code for the predominant language comprising the submitted text. Over 110 languages supported. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/processtext/screen/action | The operation detects profanity in more than 100 languages and match against custom and shared blacklists. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/jobs/action | A job Id will be returned for the Image content posted on this endpoint.  |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/action | The reviews created would show up for Reviewers on your team. As Reviewers complete reviewing, results of the Review would be POSTED (i.e. HTTP POST) on the specified CallBackEndpoint. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/jobs/read | Get the Job Details for a Job Id. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/read | Returns review details for the review Id passed. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/publish/action | Video reviews are initially created in an unpublished state - which means it is not available for reviewers on your team to review yet. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/transcript/action | This API adds a transcript file (text version of all the words spoken in a video) to a video review. The file should be a valid WebVTT format. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/transcriptmoderationresult/action | This API adds a transcript screen text result file for a video review. Transcript screen text result file is a result of Screen Text API . In order to generate transcript screen text result file , a transcript file has to be screened for profanity using Screen Text API. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/accesskey/read | Get the review content access key for your team. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/frames/write | Use this method to add frames for a video review. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/frames/read | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/settings/templates/write | Creates or updates the specified template |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/settings/templates/delete | Delete a template in your team |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/settings/templates/read | Returns an array of review templates provisioned on this team. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/workflows/write | Create a new workflow or update an existing one. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/workflows/read | Get the details of a specific Workflow on your Team Get all the Workflows available for you Team* |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/bulkupdate/action | Term Lists - Bulk Update |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/delete | Term Lists - Delete |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/read | Term Lists - Get All - Term Lists - Get Details |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/refreshindex/action | Term Lists - Refresh Search Index |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/write | Term Lists - Update Details |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/terms/write | Term - Add Term |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/terms/delete | Term - Delete - Term - Delete All Terms |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/terms/read | Term - Get All Terms |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/action | Create a project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/user/action | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/quota/action | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/classify/iterations/image/action | Classify an image and saves the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/classify/iterations/url/action | Classify an image url and saves the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/classify/iterations/image/nostore/action | Classify an image without saving the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/classify/iterations/url/nostore/action | Classify an image url without saving the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/detect/iterations/image/action | Detect objects in an image and saves the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/detect/iterations/url/action | Detect objects in an image url and saves the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/detect/iterations/image/nostore/action | Detect objects in an image without saving the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/detect/iterations/url/nostore/action | Detect objects in an image url without saving the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/domains/read | Get information about a specific domain. Get a list of the available domains.* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/labelproposals/setting/action | Set pool size of Label Proposal. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/labelproposals/setting/read | Get pool size of Label Proposal for this project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/project/migrate/action | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/action | This API accepts body content as multipart/form-data and application/octet-stream. When using multipart |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/tags/action | Create a tag for the project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/delete | Delete a specific project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/read | Get a specific project. Get your projects.* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/train/action | Queues project for training. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/write | Update a specific project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/import/action | Imports a project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/export/read | Exports a project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/regions/action | This API accepts a batch of image regions, and optionally tags, to update existing images with region information. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/files/action | This API accepts a batch of files, and optionally tags, to create images. There is a limit of 64 images and 20 tags. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/predictions/action | This API creates a batch of images from predicted images specified. There is a limit of 64 images and 20 tags. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/urls/action | This API accepts a batch of urls, and optionally tags, to create images. There is a limit of 64 images and 20 tags. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/tags/action | Associate a set of images with a set of tags. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/delete | Delete images from the set of training images. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/regionproposals/action | This API will get region proposals for an image along with confidences for the region. It returns an empty array if no proposals are found. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/suggested/action | This API will fetch untagged images filtered by suggested tags Ids. It returns an empty array if no images are found. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/id/read | This API will return a set of Images for the specified tags and optionally iteration. If no iteration is specified the |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/regions/delete | Delete a set of image regions. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/suggested/count/action | This API takes in tagIds to get count of untagged images per suggested tags for a given threshold. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/tagged/read | This API supports batching and range selection. By default it will only return first 50 images matching images. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/tagged/count/read | The filtering is on an and/or relationship. For example, if the provided tag ids are for the "Dog" and |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/tags/delete | Remove a set of tags from a set of images. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/untagged/read | This API supports batching and range selection. By default it will only return first 50 images matching images. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/untagged/count/read | This API returns the images which have no tags for a given project and optionally an iteration. If no iteration is specified the |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/delete | Delete a specific iteration of a project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/export/action | Export a trained iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/read | Get a specific iteration. Get iterations for the project.* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/publish/action | Publish a specific iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/write | Update a specific iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/export/read | Get the list of exports for a specific iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/performance/read | Get detailed performance information about an iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/performance/images/read | This API supports batching and range selection. By default it will only return first 50 images matching images. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/performance/images/count/read | The filtering is on an and/or relationship. For example, if the provided tag ids are for the "Dog" and |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/publish/delete | Unpublish a specific iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/predictions/delete | Delete a set of predicted images and their associated prediction results. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/predictions/query/action | Get images that were sent to your prediction endpoint. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/quicktest/image/action | Quick test an image. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/quicktest/url/action | Quick test an image url. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/tags/delete | Delete a tag from the project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/tags/read | Get information about a specific tag. Get the tags for a given project and iteration.* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/tags/write | Update a tag. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/tagsandregions/suggestions/action | This API will get suggested tags and regions for an array/batch of untagged images along with confidences for the tags. It returns an empty array if no tags are found. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/train/advanced/action | Queues project for training with PipelineConfiguration and training type. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/quota/delete | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/quota/refresh/write | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/usage/prediction/user/read | Get usage for prediction resource for Oxford user |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/usage/training/resource/tier/read | Get usage for training resource for Azure user |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/usage/training/user/read | Get usage for training resource for Oxford user |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/user/delete | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/user/state/write | Update user state |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/user/tier/write | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/users/read | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/whitelist/delete | Deletes a whitelisted user with specific capability |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/whitelist/read | Gets a list of whitelisted users with specific capability |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/whitelist/write | Updates or creates a user in the whitelist with specific capability |
> | Microsoft.CognitiveServices/accounts/EntitySearch/search/action | Get entities and places results for a given query. |
> | Microsoft.CognitiveServices/accounts/Face/detect/action | Detect human faces in an image, return face rectangles, and optionally with faceIds, landmarks, and attributes. |
> | Microsoft.CognitiveServices/accounts/Face/findsimilars/action | Given query face's faceId, to search the similar-looking faces from a faceId array, a face list or a large face list. faceId |
> | Microsoft.CognitiveServices/accounts/Face/group/action | Divide candidate faces into groups based on face similarity. |
> | Microsoft.CognitiveServices/accounts/Face/identify/action | 1-to-many identification to find the closest matches of the specific query person face from a person group or large person group. |
> | Microsoft.CognitiveServices/accounts/Face/verify/action | Verify whether two faces belong to a same person or whether one face belongs to a person. |
> | Microsoft.CognitiveServices/accounts/Face/facelists/write | Create an empty face list with user-specified faceListId, name and an optional userData. Up to 64 face lists are allowed Update information of a face list, including name and userData. |
> | Microsoft.CognitiveServices/accounts/Face/facelists/delete | Delete a specified face list. The related face images in the face list will be deleted, too. |
> | Microsoft.CognitiveServices/accounts/Face/facelists/read | Retrieve a face list's faceListId, name, userData and faces in the face list. List face lists' faceListId, name and userData. |
> | Microsoft.CognitiveServices/accounts/Face/facelists/persistedfaces/write | Add a face to a specified face list, up to 1,000 faces. |
> | Microsoft.CognitiveServices/accounts/Face/facelists/persistedfaces/delete | Delete a face from a face list by specified faceListId and persisitedFaceId. The related face image will be deleted, too. |
> | Microsoft.CognitiveServices/accounts/Face/largefacelists/write | Create an empty large face list with user-specified largeFaceListId, name and an optional userData. Update information of a large face list, including name and userData. |
> | Microsoft.CognitiveServices/accounts/Face/largefacelists/delete | Delete a specified large face list. The related face images in the large face list will be deleted, too. |
> | Microsoft.CognitiveServices/accounts/Face/largefacelists/read | Retrieve a large face list's largeFaceListId, name, userData. List large face lists' information of largeFaceListId, name and userData. |
> | Microsoft.CognitiveServices/accounts/Face/largefacelists/train/action | Submit a large face list training task. Training is a crucial step that only a trained large face list can use. |
> | Microsoft.CognitiveServices/accounts/Face/largefacelists/persistedfaces/write | Add a face to a specified large face list, up to 1,000,000 faces. Update a specified face's userData field in a large face list by its persistedFaceId. |
> | Microsoft.CognitiveServices/accounts/Face/largefacelists/persistedfaces/delete | Delete a face from a large face list by specified largeFaceListId and persisitedFaceId. The related face image will be deleted, too. |
> | Microsoft.CognitiveServices/accounts/Face/largefacelists/persistedfaces/read | Retrieve persisted face in large face list by largeFaceListId and persistedFaceId. List faces' persistedFaceId and userData in a specified large face list. |
> | Microsoft.CognitiveServices/accounts/Face/largefacelists/training/read | To check the large face list training status completed or still ongoing. LargeFaceList Training is an asynchronous operation |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/write | Create a new large person group with user-specified largePersonGroupId, name, and optional userData. Update an existing large person group's name and userData. The properties keep unchanged if they are not in request body. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/delete | Delete an existing large person group with specified personGroupId. Persisted data in this large person group will be deleted. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/read | Retrieve the information of a large person group, including its name and userData. This API returns large person group information List all existing large person groups's largePesonGroupId, name, and userData. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/train/action | Submit a large person group training task. Training is a crucial step that only a trained large person group can use. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/action | Create a new person in a specified large person group. To add face to this person, please call |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/delete | Delete an existing person from a large person group. All stored person data, and face images in the person entry will be deleted. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/read | Retrieve a person's name and userData, and the persisted faceIds representing the registered person face image. List all persons' information in the specified large person group, including personId, name, userData and persistedFaceIds. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/write | Update name or userData of a person. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/persistedfaces/write | Add a face image to a person into a large person group for face identification or verification. To deal with the image of Update a person persisted face's userData field. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/persistedfaces/delete | Delete a face from a person in a large person group. Face data and image related to this face entry will be also deleted. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/persistedfaces/read | Retrieve person face information. The persisted person face is specified by its largePersonGroupId, personId and persistedFaceId. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/training/read | To check large person group training status completed or still ongoing. LargePersonGroup Training is an asynchronous operation |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/write | Create a new person group with specified personGroupId, name, and user-provided userData. Update an existing person group's name and userData. The properties keep unchanged if they are not in request body. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/delete | Delete an existing person group with specified personGroupId. Persisted data in this person group will be deleted. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/read | Retrieve person group name and userData. To get person information under this personGroup, use List person groups's pesonGroupId, name, and userData. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/train/action | Submit a person group training task. Training is a crucial step that only a trained person group can use. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/action | Create a new person in a specified person group. To add face to this person, please call |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/delete | Delete an existing person from a person group. All stored person data, and face images in the person entry will be deleted. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/read | Retrieve a person's name and userData, and the persisted faceIds representing the registered person face image. List all persons' information in the specified person group, including personId, name, userData and persistedFaceIds of registered. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/write | Update name or userData of a person. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/persistedfaces/write | Add a face image to a person into a person group for face identification or verification. To deal with the image of multiple Update a person persisted face's userData field. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/persistedfaces/delete | Delete a face from a person in a person group. Face data and image related to this face entry will be also deleted. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/persistedfaces/read | Retrieve person face information. The persisted person face is specified by its personGroupId, personId and persistedFaceId. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/training/read | To check person group training status completed or still ongoing. PersonGroup Training is an asynchronous operation triggered |
> | Microsoft.CognitiveServices/accounts/Face/snapshot/take/action | Take a snapshot for an object. |
> | Microsoft.CognitiveServices/accounts/Face/snapshot/read | Get status of a snapshot operation. |
> | Microsoft.CognitiveServices/accounts/Face/snapshot/apply/action | Apply a snapshot, providing a user-specified object id. |
> | Microsoft.CognitiveServices/accounts/Face/snapshot/delete | Delete a snapshot. |
> | Microsoft.CognitiveServices/accounts/Face/snapshot/write | Update properties of a snapshot. |
> | Microsoft.CognitiveServices/accounts/Face/snapshots/read | List all of the user's accessible snapshots with information.* |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/train/action | Create and train a custom model.<br>The train request must include a source parameter that is either an externally accessible Azure Storage blob container Uri (preferably a Shared Access Signature Uri) or valid path to a data folder in a locally mounted drive.<br>When local paths are specified, they must follow the Linux/Unix path format and be an absolute path rooted to the input mount configuration |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/analyze/action | Extract key-value pairs from a given document. The input document must be of one of the supported content types - 'application/pdf', 'image/jpeg' or 'image/png'. A success response is returned in JSON. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/delete | Delete model artifacts. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/read | Get information about a model. Get information about all trained custom models* |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/keys/read | Retrieve the keys for the model. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/prebuilt/receipt/asyncbatchanalyze/action | Extract field text and semantic values from a given receipt document. The input image document must be one of the supported content types - JPEG, PNG, BMP, PDF, or TIFF. A success response is a JSON containing a field called 'Operation-Location', which contains the URL for the Get Receipt Result operation to asynchronously retrieve the results. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/prebuilt/receipt/operations/action | Query the status and retrieve the result of an Analyze Receipt operation. The URL to this interface can be obtained from the 'Operation-Location' header in the Analyze Receipt response. |
> | Microsoft.CognitiveServices/accounts/ImageSearch/details/action | Returns insights about an image, such as webpages that include the image. |
> | Microsoft.CognitiveServices/accounts/ImageSearch/search/action | Get relevant images for a given query. |
> | Microsoft.CognitiveServices/accounts/ImageSearch/trending/action | Get currently trending images. |
> | Microsoft.CognitiveServices/accounts/ImmersiveReader/getcontentmodelforreader/action | Creates an Immersive Reader session |
> | Microsoft.CognitiveServices/accounts/InkRecognizer/recognize/action | Given a set of stroke data analyzes the content and generates a list of recognized entities including recognized text. |
> | Microsoft.CognitiveServices/accounts/LUIS/predict/action | Gets the published endpoint prediction for the given query. |
> | Microsoft.CognitiveServices/accounts/NewsSearch/categorysearch/action | Returns news for a provided category. |
> | Microsoft.CognitiveServices/accounts/NewsSearch/search/action | Get news articles relevant for a given query. |
> | Microsoft.CognitiveServices/accounts/NewsSearch/trendingtopics/action | Get trending topics identified by Bing. These are the same topics shown in the banner at the bottom of the Bing home page. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/root/action | QnA Maker |
> | Microsoft.CognitiveServices/accounts/QnAMaker/alterations/read | Download alterations from runtime. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/alterations/write | Replace alterations data. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/endpointkeys/read | Gets endpoint keys for an endpoint |
> | Microsoft.CognitiveServices/accounts/QnAMaker/endpointkeys/refreshkeys/action | Re-generates an endpoint key. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/endpointsettings/read | Gets endpoint settings for an endpoint |
> | Microsoft.CognitiveServices/accounts/QnAMaker/endpointsettings/write | Update endpoint seettings for an endpoint. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/publish/action | Publishes all changes in test index of a knowledgebase to its prod index. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/delete | Deletes the knowledgebase and all its data. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/read | Gets List of Knowledgebases or details of a specific knowledgebaser. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/write | Asynchronous operation to modify a knowledgebase or Replace knowledgebase contents. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/generateanswer/action | GenerateAnswer call to query the knowledgebase. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/train/action | Train call to add suggestions to the knowledgebase. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/create/write | Asynchronous operation to create a new knowledgebase. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/download/read | Download the knowledgebase. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/operations/read | Gets details of a specific long running operation. |
> | Microsoft.CognitiveServices/accounts/SpellCheck/spellcheck/action | Get result of a spell check query through GET or POST. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/languages/action | The API returns the detected language and a numeric score between 0 and 1. Scores close to 1 indicate 100% certainty that the identified language is true. A total of 120 languages are supported. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/entities/action | The API returns a list of known entities and general named entities (\"Person\", \"Location\", \"Organization\" etc) in a given document. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/keyphrases/action | The API returns a list of strings denoting the key talking points in the input text. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/sentiment/action | The API returns a numeric score between 0 and 1.<br>Scores close to 1 indicate positive sentiment, while scores close to 0 indicate negative sentiment.<br>A score of 0.5 indicates the lack of sentiment (e.g.<br>a factoid statement). |
> | Microsoft.CognitiveServices/accounts/VideoSearch/trending/action | Get currently trending videos. |
> | Microsoft.CognitiveServices/accounts/VideoSearch/details/action | Get insights about a video, such as related videos. |
> | Microsoft.CognitiveServices/accounts/VideoSearch/search/action | Get videos relevant for a given query. |
> | Microsoft.CognitiveServices/accounts/VisualSearch/search/action | Returns a list of tags relevant to the provided image |
> | Microsoft.CognitiveServices/accounts/WebSearch/search/action | Get web, image, news, & videos results for a given query. |

### Microsoft.MachineLearning

Azure service: [Machine Learning Studio](../machine-learning/studio/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.MachineLearning/register/action | Registers the subscription for the machine learning web service resource provider and enables the creation of web services. |
> | Microsoft.MachineLearning/webServices/action | Create regional Web Service Properties for supported regions |
> | Microsoft.MachineLearning/commitmentPlans/read | Read any Machine Learning Commitment Plan |
> | Microsoft.MachineLearning/commitmentPlans/write | Create or Update any Machine Learning Commitment Plan |
> | Microsoft.MachineLearning/commitmentPlans/delete | Delete any Machine Learning Commitment Plan |
> | Microsoft.MachineLearning/commitmentPlans/join/action | Join any Machine Learning Commitment Plan |
> | Microsoft.MachineLearning/commitmentPlans/commitmentAssociations/read | Read any Machine Learning Commitment Plan Association |
> | Microsoft.MachineLearning/commitmentPlans/commitmentAssociations/move/action | Move any Machine Learning Commitment Plan Association |
> | Microsoft.MachineLearning/locations/operationresults/read | Get result of a Machine Learning Operation |
> | Microsoft.MachineLearning/locations/operationsstatus/read | Get status of an ongoing Machine Learning Operation |
> | Microsoft.MachineLearning/operations/read | Get Machine Learning Operations |
> | Microsoft.MachineLearning/skus/read | Get Machine Learning Commitment Plan SKUs |
> | Microsoft.MachineLearning/webServices/read | Read any Machine Learning Web Service |
> | Microsoft.MachineLearning/webServices/write | Create or Update any Machine Learning Web Service |
> | Microsoft.MachineLearning/webServices/delete | Delete any Machine Learning Web Service |
> | Microsoft.MachineLearning/webServices/listkeys/read | Get keys to a Machine Learning Web Service |
> | Microsoft.MachineLearning/Workspaces/read | Read any Machine Learning Workspace |
> | Microsoft.MachineLearning/Workspaces/write | Create or Update any Machine Learning Workspace |
> | Microsoft.MachineLearning/Workspaces/delete | Delete any Machine Learning Workspace |
> | Microsoft.MachineLearning/Workspaces/listworkspacekeys/action | List keys for a Machine Learning Workspace |
> | Microsoft.MachineLearning/Workspaces/resyncstoragekeys/action | Resync keys of storage account configured for a Machine Learning Workspace |

### Microsoft.MachineLearningServices

Azure service: [Machine Learning Service](../machine-learning/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.MachineLearningServices/register/action | Registers the subscription for the Machine Learning Services Resource Provider |
> | Microsoft.MachineLearningServices/locations/updateQuotas/action | Update quota for each VM family in workspace. |
> | Microsoft.MachineLearningServices/locations/computeoperationsstatus/read | Gets the status of a particular compute operation |
> | Microsoft.MachineLearningServices/locations/quotas/read | Gets the currently assigned Workspace Quotas based on VMFamily. |
> | Microsoft.MachineLearningServices/locations/usages/read | Usage report for aml compute resources in a subscription |
> | Microsoft.MachineLearningServices/locations/vmsizes/read | Get supported vm sizes |
> | Microsoft.MachineLearningServices/locations/workspaceOperationsStatus/read | Gets the status of a particular workspace operation |
> | Microsoft.MachineLearningServices/workspaces/read | Gets the Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/write | Creates or updates a Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/delete | Deletes the Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/listKeys/action | List secrets for a Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/privateEndpointConnectionsApproval/action | Approve or reject a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/workspaces/computes/read | Gets the compute resources in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/computes/write | Creates or updates the compute resources in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/computes/delete | Deletes the compute resources in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/computes/listKeys/action | List secrets for compute resources in Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/computes/listNodes/action | List nodes for compute resource in Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/computes/start/action | Start compute resource in Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/computes/stop/action | Stop compute resource in Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/computes/restart/action | Restart compute resource in Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/datadriftdetectors/read | Gets data drift detectors in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datadriftdetectors/write | Creates or updates data drift detectors in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datadriftdetectors/delete | Deletes data drift detectors in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/registered/read | Gets registered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/registered/write | Creates or updates registered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/registered/delete | Deletes registered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/registered/preview/read | Gets dataset preview for registered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/registered/profile/read | Gets dataset profiles for registered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/registered/profile/write | Creates or updates dataset profiles for registered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/registered/schema/read | Gets dataset schema for registered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/read | Gets unregistered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/write | Creates or updates unregistered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/delete | Deletes unregistered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/preview/read | Gets dataset preview for unregistered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/profile/read | Gets dataset profiles for unregistered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/profile/write | Creates or updates dataset profiles for unregistered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/schema/read | Gets dataset schema for unregistered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datastores/read | Gets datastores in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datastores/write | Creates or updates datastores in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datastores/delete | Deletes datastores in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/endpoints/pipelines/read | Gets published pipelines and pipeline endpoints  in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/endpoints/pipelines/write | Creates or updates published pipelines and pipeline endpoints in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/environments/read | Gets environments in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/environments/readSecrets/action | Gets environments with secrets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/environments/write | Creates or updates environments in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/environments/build/action | Builds environments in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/eventGridFilters/read | Get an Event Grid filter for a particular workspace |
> | Microsoft.MachineLearningServices/workspaces/experiments/read | Gets experiments in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/experiments/write | Creates or updates experiments in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/experiments/delete | Deletes experiments in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/experiments/runs/submit/action | Creates or updates script runs in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/experiments/runs/read | Gets runs in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/experiments/runs/write | Creates or updates runs in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/export/action | Export labels of labeling projects in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/labels/read | Gets labels of labeling projects in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/labels/write | Creates labels of labeling projects in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/labels/reject/action | Reject labels of labeling projects in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/projects/read | Gets labeling project in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/projects/write | Creates or updates labeling project in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/projects/delete | Deletes labeling project in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/projects/summary/read | Gets labeling project summary in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/artifacts/read | Gets artifacts in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/artifacts/write | Creates or updates artifacts in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/artifacts/delete | Deletes artifacts in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/secrets/read | Gets secrets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/secrets/write | Creates or updates secrets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/secrets/delete | Deletes secrets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/snapshots/read | Gets snapshots in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/snapshots/write | Creates or updates snapshots in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/snapshots/delete | Deletes snapshots in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/models/read | Gets models in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/models/write | Creates or updates models in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/models/delete | Deletes models in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/models/package/action | Packages models in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/modules/read | Gets modules in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/modules/write | Creates or updates module in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/notebooks/samples/read | Gets the sample notebooks |
> | Microsoft.MachineLearningServices/workspaces/notebooks/storage/read | Gets the notebook files for a workspace |
> | Microsoft.MachineLearningServices/workspaces/notebooks/storage/write | Writes files to the workspace storage |
> | Microsoft.MachineLearningServices/workspaces/notebooks/storage/delete | Deletes files from workspace storage |
> | Microsoft.MachineLearningServices/workspaces/notebooks/vm/read | Gets the Notebook VMs for a particular workspace |
> | Microsoft.MachineLearningServices/workspaces/notebooks/vm/write | Change the state of a Notebook VM |
> | Microsoft.MachineLearningServices/workspaces/notebooks/vm/delete | Deletes a Notebook VM |
> | Microsoft.MachineLearningServices/workspaces/pipelinedrafts/read | Gets pipeline drafts in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/pipelinedrafts/write | Creates or updates pipeline drafts in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/pipelinedrafts/delete | Deletes pipeline drafts in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/privateEndpointConnectionProxies/read | View the state of a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/workspaces/privateEndpointConnectionProxies/write | Change the state of a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/workspaces/privateEndpointConnectionProxies/delete | Delete a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/workspaces/privateEndpointConnectionProxies/validate/action | Validate a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/read | View the state of a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/write | Change the state of a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/delete | Delete a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/workspaces/privateLinkResources/read | Gets the available private link resources for the specified instance of the Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/services/read | Gets services in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/services/aci/write | Creates or updates ACI services in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/services/aci/listkeys/action | Lists keys for ACI services in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/services/aci/delete | Deletes ACI services in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/services/aks/write | Creates or updates AKS services in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/services/aks/listkeys/action | Lists keys for AKS services in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/services/aks/delete | Deletes AKS services in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/services/aks/score/action | Scores AKS services in Machine Learning Services Workspace(s) |

## Internet of things

### Microsoft.Devices

Azure service: [IoT Hub](../iot-hub/index.yml), [IoT Hub Device Provisioning Service](../iot-dps/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Devices/register/action | Register the subscription for the IotHub resource provider and enables the creation of IotHub resources |
> | Microsoft.Devices/checkNameAvailability/Action | Check If IotHub name is available |
> | Microsoft.Devices/checkProvisioningServiceNameAvailability/Action | Check If Provisioning service name is available |
> | Microsoft.Devices/register/action | Register the subscription for the IotHub resource provider and enables the creation of IotHub resources |
> | Microsoft.Devices/checkNameAvailability/Action | Check If IotHub name is available |
> | Microsoft.Devices/checkProvisioningServiceNameAvailability/Action | Check If Provisioning service name is available |
> | Microsoft.Devices/register/action | Register the subscription for the IotHub resource provider and enables the creation of IotHub resources |
> | Microsoft.Devices/Account/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Devices/Account/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Devices/Account/logDefinitions/read | Gets the available log definitions for the IotHub Service |
> | Microsoft.Devices/Account/metricDefinitions/read | Gets the available metrics for the IotHub service |
> | Microsoft.Devices/digitalTwins/Read | Gets a list of the Digital Twins Accounts associated to an subscription |
> | Microsoft.Devices/digitalTwins/Write | Create a new Digitial Twins Account |
> | Microsoft.Devices/digitalTwins/Delete | Delete an existing Digital Twins Account and all of its children |
> | Microsoft.Devices/digitalTwins/operationresults/Read | Get the status of an operation against a Digital Twins Account |
> | Microsoft.Devices/digitalTwins/skus/Read | Get a list of the valid SKUs for Digital Twins Accounts |
> | Microsoft.Devices/ElasticPools/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Devices/ElasticPools/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Devices/elasticPools/eventGridFilters/Write | Create new or Update existing Elastic Pool Event Grid filter |
> | Microsoft.Devices/elasticPools/eventGridFilters/Read | Gets the Elastic Pool Event Grid filter |
> | Microsoft.Devices/elasticPools/eventGridFilters/Delete | Deletes the Elastic Pool Event Grid filter |
> | Microsoft.Devices/elasticPools/iotHubTenants/Write | Create or Update the IotHub tenant resource |
> | Microsoft.Devices/elasticPools/iotHubTenants/Read | Gets the IotHub tenant resource |
> | Microsoft.Devices/elasticPools/iotHubTenants/Delete | Delete the IotHub tenant resource |
> | Microsoft.Devices/elasticPools/iotHubTenants/listKeys/Action | Gets IotHub tenant keys |
> | Microsoft.Devices/elasticPools/iotHubTenants/exportDevices/Action | Export Devices |
> | Microsoft.Devices/elasticPools/iotHubTenants/importDevices/Action | Import Devices |
> | Microsoft.Devices/elasticPools/iotHubTenants/certificates/Read | Gets the Certificate |
> | Microsoft.Devices/elasticPools/iotHubTenants/certificates/Write | Create or Update Certificate |
> | Microsoft.Devices/elasticPools/iotHubTenants/certificates/Delete | Deletes Certificate |
> | Microsoft.Devices/elasticPools/iotHubTenants/certificates/generateVerificationCode/Action | Generate Verification code |
> | Microsoft.Devices/elasticPools/iotHubTenants/certificates/verify/Action | Verify Certificate resource |
> | Microsoft.Devices/ElasticPools/IotHubTenants/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Devices/ElasticPools/IotHubTenants/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Devices/elasticPools/iotHubTenants/eventHubEndpoints/consumerGroups/Write | Create EventHub Consumer Group |
> | Microsoft.Devices/elasticPools/iotHubTenants/eventHubEndpoints/consumerGroups/Read | Get EventHub Consumer Group(s) |
> | Microsoft.Devices/elasticPools/iotHubTenants/eventHubEndpoints/consumerGroups/Delete | Delete EventHub Consumer Group |
> | Microsoft.Devices/elasticPools/iotHubTenants/getStats/Read | Gets the IotHub tenant stats resource |
> | Microsoft.Devices/elasticPools/iotHubTenants/iotHubKeys/listkeys/Action | Gets the IotHub tenant key |
> | Microsoft.Devices/elasticPools/iotHubTenants/jobs/Read | Get Job(s) details submitted on given IotHub |
> | Microsoft.Devices/ElasticPools/IotHubTenants/logDefinitions/read | Gets the available log definitions for the IotHub Service |
> | Microsoft.Devices/ElasticPools/IotHubTenants/metricDefinitions/read | Gets the available metrics for the IotHub service |
> | Microsoft.Devices/elasticPools/iotHubTenants/quotaMetrics/Read | Get Quota Metrics |
> | Microsoft.Devices/elasticPools/iotHubTenants/routing/routes/$testall/Action | Test a message against all existing Routes |
> | Microsoft.Devices/elasticPools/iotHubTenants/routing/routes/$testnew/Action | Test a message against a provided test Route |
> | Microsoft.Devices/elasticPools/iotHubTenants/routingEndpointsHealth/Read | Gets the health of all routing Endpoints for an IotHub |
> | Microsoft.Devices/elasticPools/iotHubTenants/securitySettings/Write | Update the Azure Security Center settings on Iot Tenant Hub |
> | Microsoft.Devices/elasticPools/iotHubTenants/securitySettings/Read | Get the Azure Security Center settings on Iot Tenant Hub |
> | Microsoft.Devices/elasticPools/iotHubTenants/securitySettings/operationResults/Read | Get the result of the Async Put operation for Iot Tenant Hub SecuritySettings |
> | Microsoft.Devices/ElasticPools/metricDefinitions/read | Gets the available metrics for the IotHub service |
> | Microsoft.Devices/iotHubs/Read | Gets the IotHub resource(s) |
> | Microsoft.Devices/iotHubs/Write | Create or update IotHub Resource |
> | Microsoft.Devices/iotHubs/Delete | Delete IotHub Resource |
> | Microsoft.Devices/iotHubs/listkeys/Action | Get all IotHub Keys |
> | Microsoft.Devices/iotHubs/exportDevices/Action | Export Devices |
> | Microsoft.Devices/iotHubs/importDevices/Action | Import Devices |
> | Microsoft.Devices/iotHubs/privateEndpointConnectionsApproval/Action | Approve or reject a private endpoint connection |
> | Microsoft.Devices/iotHubs/certificates/Read | Gets the Certificate |
> | Microsoft.Devices/iotHubs/certificates/Write | Create or Update Certificate |
> | Microsoft.Devices/iotHubs/certificates/Delete | Deletes Certificate |
> | Microsoft.Devices/iotHubs/certificates/generateVerificationCode/Action | Generate Verification code |
> | Microsoft.Devices/iotHubs/certificates/verify/Action | Verify Certificate resource |
> | Microsoft.Devices/iotHubs/certificates/Read | Gets the Certificate |
> | Microsoft.Devices/iotHubs/certificates/Write | Create or Update Certificate |
> | Microsoft.Devices/iotHubs/certificates/Delete | Deletes Certificate |
> | Microsoft.Devices/iotHubs/certificates/generateVerificationCode/Action | Generate Verification code |
> | Microsoft.Devices/iotHubs/certificates/verify/Action | Verify Certificate resource |
> | Microsoft.Devices/IotHubs/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Devices/IotHubs/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Devices/iotHubs/digitalTwinsLinks/Write |  |
> | Microsoft.Devices/iotHubs/digitalTwinsLinks/Read |  |
> | Microsoft.Devices/iotHubs/digitalTwinsLinks/Delete |  |
> | Microsoft.Devices/iotHubs/eventGridFilters/Write | Create new or Update existing Event Grid filter |
> | Microsoft.Devices/iotHubs/eventGridFilters/Read | Gets the Event Grid filter |
> | Microsoft.Devices/iotHubs/eventGridFilters/Delete | Deletes the Event Grid filter |
> | Microsoft.Devices/iotHubs/eventHubEndpoints/consumerGroups/Write | Create EventHub Consumer Group |
> | Microsoft.Devices/iotHubs/eventHubEndpoints/consumerGroups/Read | Get EventHub Consumer Group(s) |
> | Microsoft.Devices/iotHubs/eventHubEndpoints/consumerGroups/Delete | Delete EventHub Consumer Group |
> | Microsoft.Devices/iotHubs/iotHubKeys/listkeys/Action | Get IotHub Key for the given name |
> | Microsoft.Devices/iotHubs/iotHubStats/Read | Get IotHub Statistics |
> | Microsoft.Devices/iotHubs/jobs/Read | Get Job(s) details submitted on given IotHub |
> | Microsoft.Devices/IotHubs/logDefinitions/read | Gets the available log definitions for the IotHub Service |
> | Microsoft.Devices/IotHubs/metricDefinitions/read | Gets the available metrics for the IotHub service |
> | Microsoft.Devices/iotHubs/operationresults/Read | Get Operation Result (Obsolete API) |
> | Microsoft.Devices/iotHubs/privateEndpointConnectionProxies/validate/Action | Validates private endpoint connection proxy input during create |
> | Microsoft.Devices/iotHubs/privateEndpointConnectionProxies/Read | Gets properties for specified private endpoint connection proxy |
> | Microsoft.Devices/iotHubs/privateEndpointConnectionProxies/Write | Creates or updates a private endpoint connection proxy |
> | Microsoft.Devices/iotHubs/privateEndpointConnectionProxies/Delete | Deletes an existing private endpoint connection proxy |
> | Microsoft.Devices/iotHubs/privateEndpointConnectionProxies/operationResults/Read | Get the result of an async operation on a private endpoint connection proxy |
> | Microsoft.Devices/iotHubs/privateEndpointConnections/Read | Gets all the private endpoint connections for the specified iot hub |
> | Microsoft.Devices/iotHubs/privateEndpointConnections/Delete | Deletes an existing private endpoint connection |
> | Microsoft.Devices/iotHubs/privateEndpointConnections/Write | Creates or updates a private endpoint connection |
> | Microsoft.Devices/iotHubs/privateEndpointConnections/operationResults/Read | Get the result of an async operation on a private endpoint connection |
> | Microsoft.Devices/iotHubs/privateLinkResources/Read | Gets private link resources for IotHub |
> | Microsoft.Devices/iotHubs/quotaMetrics/Read | Get Quota Metrics |
> | Microsoft.Devices/iotHubs/routing/$testall/Action | Test a message against all existing Routes |
> | Microsoft.Devices/iotHubs/routing/$testnew/Action | Test a message against a provided test Route |
> | Microsoft.Devices/iotHubs/routingEndpointsHealth/Read | Gets the health of all routing Endpoints for an IotHub |
> | Microsoft.Devices/iotHubs/securitySettings/Write | Update the Azure Security Center settings on Iot Hub |
> | Microsoft.Devices/iotHubs/securitySettings/Read | Get the Azure Security Center settings on Iot Hub |
> | Microsoft.Devices/iotHubs/securitySettings/operationResults/Read | Get the result of the Async Put operation for Iot Hub SecuritySettings |
> | Microsoft.Devices/iotHubs/skus/Read | Get valid IotHub Skus |
> | Microsoft.Devices/locations/operationresults/Read | Get Location based Operation Result |
> | Microsoft.Devices/locations/operationresults/Read | Get Location based Operation Result |
> | Microsoft.Devices/operationresults/Read | Get Operation Result |
> | Microsoft.Devices/operationresults/Read | Get Operation Result |
> | Microsoft.Devices/operations/Read | Get All ResourceProvider Operations |
> | Microsoft.Devices/operations/Read | Get All ResourceProvider Operations |
> | Microsoft.Devices/provisioningServices/Read | Get IotDps resource |
> | Microsoft.Devices/provisioningServices/Write | Create IotDps resource |
> | Microsoft.Devices/provisioningServices/Delete | Delete IotDps resource |
> | Microsoft.Devices/provisioningServices/listkeys/Action | Get all IotDps keys |
> | Microsoft.Devices/provisioningServices/certificates/Read | Gets the Certificate |
> | Microsoft.Devices/provisioningServices/certificates/Write | Create or Update Certificate |
> | Microsoft.Devices/provisioningServices/certificates/Delete | Deletes Certificate |
> | Microsoft.Devices/provisioningServices/certificates/generateVerificationCode/Action | Generate Verification code |
> | Microsoft.Devices/provisioningServices/certificates/verify/Action | Verify Certificate resource |
> | Microsoft.Devices/provisioningServices/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Devices/provisioningServices/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Devices/provisioningServices/keys/listkeys/Action | Get IotDps Keys for key name |
> | Microsoft.Devices/provisioningServices/logDefinitions/read | Gets the available log definitions for the provisioning Service |
> | Microsoft.Devices/provisioningServices/metricDefinitions/read | Gets the available metrics for the provisioning service |
> | Microsoft.Devices/provisioningServices/operationresults/Read | Get DPS Operation Result |
> | Microsoft.Devices/provisioningServices/skus/Read | Get valid IotDps Skus |
> | Microsoft.Devices/usages/Read | Get subscription usage details for this provider. |
> | Microsoft.Devices/usages/Read | Get subscription usage details for this provider. |

### Microsoft.IoTCentral

Azure service: [IoT Central](../iot-central/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.IoTCentral/checkNameAvailability/action | Checks if an IoT Central Application name is available |
> | Microsoft.IoTCentral/checkSubdomainAvailability/action | Checks if an IoT Central Application subdomain is available |
> | Microsoft.IoTCentral/appTemplates/action | Gets all the available application templates on Azure IoT Central |
> | Microsoft.IoTCentral/register/action | Register the subscription for Azure IoT Central resource provider |
> | Microsoft.IoTCentral/IoTApps/read | Gets a single IoT Central Application |
> | Microsoft.IoTCentral/IoTApps/write | Creates or Updates an IoT Central Applications |
> | Microsoft.IoTCentral/IoTApps/delete | Deletes an IoT Central Applications |
> | Microsoft.IoTCentral/operations/read | Gets all the available operations on IoT Central Applications |

### Microsoft.NotificationHubs

Azure service: [Notification Hubs](../notification-hubs/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.NotificationHubs/register/action | Registers the subscription for the NotificationHubs resource provider and enables the creation of Namespaces and NotificationHubs |
> | Microsoft.NotificationHubs/unregister/action | Unregisters the subscription for the NotificationHubs resource provider and enables the creation of Namespaces and NotificationHubs |
> | Microsoft.NotificationHubs/CheckNamespaceAvailability/action | Checks whether or not a given Namespace resource name is available within the NotificationHub service. |
> | Microsoft.NotificationHubs/Namespaces/write | Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated. |
> | Microsoft.NotificationHubs/Namespaces/read | Get the list of Namespace Resource Description |
> | Microsoft.NotificationHubs/Namespaces/Delete | Delete Namespace Resource |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/action | Get the list of Namespaces Authorization Rules description. |
> | Microsoft.NotificationHubs/Namespaces/CheckNotificationHubAvailability/action | Checks whether or not a given NotificationHub name is available inside a Namespace. |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/write | Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/read | Get the list of Namespaces Authorization Rules description. |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/delete | Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted.  |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/listkeys/action | Get the Connection String to the Namespace |
> | Microsoft.NotificationHubs/Namespaces/authorizationRules/regenerateKeys/action | Namespace Authorization Rule Regenerate Primary/SecondaryKey, Specify the Key that needs to be regenerated |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/write | Create a Notification Hub and Update its properties. Its properties mainly include PNS Credentials. Authorization Rules and TTL |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/read | Get list of Notification Hub Resource Descriptions |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/Delete | Delete Notification Hub Resource |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/action | Get the list of Notification Hub Authorization Rules |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/pnsCredentials/action | Get All Notification Hub PNS Credentials. This includes, WNS, MPNS, APNS, GCM and Baidu credentials |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/debugSend/action | Send a test push notification. |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/write | Create Notification Hub Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/read | Get the list of Notification Hub Authorization Rules |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/delete | Delete Notification Hub Authorization Rules |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/listkeys/action | Get the Connection String to the Notification Hub |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/regenerateKeys/action | Notification Hub Authorization Rule Regenerate Primary/SecondaryKey, Specify the Key that needs to be regenerated |
> | Microsoft.NotificationHubs/Namespaces/NotificationHubs/metricDefinitions/read | Get list of Namespace metrics Resource Descriptions |
> | Microsoft.NotificationHubs/operationResults/read | Returns operation results for Notification Hubs provider |
> | Microsoft.NotificationHubs/operations/read | Returns a list of supported operations for Notification Hubs provider |

### Microsoft.TimeSeriesInsights

Azure service: [Time Series Insights](../time-series-insights/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.TimeSeriesInsights/register/action | Registers the subscription for the Time Series Insights resource provider and enables the creation of Time Series Insights environments. |
> | Microsoft.TimeSeriesInsights/environments/read | Get the properties of an environment. |
> | Microsoft.TimeSeriesInsights/environments/write | Creates a new environment, or updates an existing environment. |
> | Microsoft.TimeSeriesInsights/environments/delete | Deletes the environment. |
> | Microsoft.TimeSeriesInsights/environments/accesspolicies/read | Get the properties of an access policy. |
> | Microsoft.TimeSeriesInsights/environments/accesspolicies/write | Creates a new access policy for an environment, or updates an existing access policy. |
> | Microsoft.TimeSeriesInsights/environments/accesspolicies/delete | Deletes the access policy. |
> | Microsoft.TimeSeriesInsights/environments/eventsources/read | Get the properties of an event source. |
> | Microsoft.TimeSeriesInsights/environments/eventsources/write | Creates a new event source for an environment, or updates an existing event source. |
> | Microsoft.TimeSeriesInsights/environments/eventsources/delete | Deletes the event source. |
> | Microsoft.TimeSeriesInsights/environments/referencedatasets/read | Get the properties of a reference data set. |
> | Microsoft.TimeSeriesInsights/environments/referencedatasets/write | Creates a new reference data set for an environment, or updates an existing reference data set. |
> | Microsoft.TimeSeriesInsights/environments/referencedatasets/delete | Deletes the reference data set. |
> | Microsoft.TimeSeriesInsights/environments/status/read | Get the status of the environment, state of its associated operations like ingress. |

## Mixed reality

### Microsoft.IoTSpaces

Azure service: [Azure Digital Twins](../digital-twins/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.IoTSpaces/register/action | Register subscription for Microsoft.IoTSpaces Graph resource provider to enable creating of resources |
> | Microsoft.IoTSpaces/Graph/write | Create Microsoft.IoTSpaces Graph resource |
> | Microsoft.IoTSpaces/Graph/read | Gets the Microsoft.IoTSpaces Graph resource(s) |
> | Microsoft.IoTSpaces/Graph/delete | Deletes Microsoft.IoTSpaces Graph resource |

### Microsoft.MixedReality

Azure service: [Azure Spatial Anchors](../spatial-anchors/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.MixedReality/register/action | Registers a subscription for the Mixed Reality resource provider. |
> | Microsoft.MixedReality/remoteRenderingAccounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Microsoft.MixedReality/remoteRenderingAccounts |
> | Microsoft.MixedReality/spatialAnchorsAccounts/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for Microsoft.MixedReality/spatialAnchorsAccounts |
> | Microsoft.MixedReality/spatialAnchorsAccounts/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for Microsoft.MixedReality/spatialAnchorsAccounts |
> | Microsoft.MixedReality/spatialAnchorsAccounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Microsoft.MixedReality/spatialAnchorsAccounts |
> | **DataAction** | **Description** |
> | Microsoft.MixedReality/ObjectUnderstandingAccounts/ingest/action | Create Model Ingestion Job |
> | Microsoft.MixedReality/ObjectUnderstandingAccounts/ingest/read | Get model Ingestion Job Status |
> | Microsoft.MixedReality/RemoteRenderingAccounts/convert/action | Start asset conversion |
> | Microsoft.MixedReality/RemoteRenderingAccounts/managesessions/action | Start sessions |
> | Microsoft.MixedReality/RemoteRenderingAccounts/convert/read | Get asset conversion properties |
> | Microsoft.MixedReality/RemoteRenderingAccounts/convert/delete | Stop asset conversion |
> | Microsoft.MixedReality/RemoteRenderingAccounts/diagnostic/read | Connect to the Remote Rendering inspector |
> | Microsoft.MixedReality/RemoteRenderingAccounts/managesessions/read | Get session properties |
> | Microsoft.MixedReality/RemoteRenderingAccounts/managesessions/delete | Stop sessions |
> | Microsoft.MixedReality/RemoteRenderingAccounts/render/read | Connect to a session |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/create/action | Create spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/delete | Delete spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/write | Update spatial anchors properties |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/discovery/read | Discover nearby spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/properties/read | Get properties of spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/query/read | Locate spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/submitdiag/read | Submit diagnostics data to help improve the quality of the Azure Spatial Anchors service |

## Integration

### Microsoft.ApiManagement

Azure service: [API Management](../api-management/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ApiManagement/register/action | Register subscription for Microsoft.ApiManagement resource provider |
> | Microsoft.ApiManagement/unregister/action | Un-register subscription for Microsoft.ApiManagement resource provider |
> | Microsoft.ApiManagement/checkNameAvailability/read | Checks if provided service name is available |
> | Microsoft.ApiManagement/operations/read | Read all API operations available for Microsoft.ApiManagement resource |
> | Microsoft.ApiManagement/reports/read | Get reports aggregated by time periods, geographical region, developers, products, APIs, operations, subscription and byRequest. |
> | Microsoft.ApiManagement/service/write | Create or Update API Management Service instance |
> | Microsoft.ApiManagement/service/read | Read metadata for an API Management Service instance |
> | Microsoft.ApiManagement/service/delete | Delete API Management Service instance |
> | Microsoft.ApiManagement/service/updatehostname/action | Setup, update or remove custom domain names for an API Management Service |
> | Microsoft.ApiManagement/service/updatecertificate/action | Upload TLS/SSL certificate for an API Management Service |
> | Microsoft.ApiManagement/service/backup/action | Backup API Management Service to the specified container in a user provided storage account |
> | Microsoft.ApiManagement/service/restore/action | Restore API Management Service from the specified container in a user provided storage account |
> | Microsoft.ApiManagement/service/managedeployments/action | Change SKU/units, add/remove regional deployments of API Management Service |
> | Microsoft.ApiManagement/service/getssotoken/action | Gets SSO token that can be used to login into API Management Service Legacy portal as an administrator |
> | Microsoft.ApiManagement/service/applynetworkconfigurationupdates/action | Updates the Microsoft.ApiManagement resources running in Virtual Network to pick updated Network Settings. |
> | Microsoft.ApiManagement/service/users/action | Register a new user |
> | Microsoft.ApiManagement/service/notifications/action | Sends notification to a specified user |
> | Microsoft.ApiManagement/service/gateways/action | Retrieves gateway configuration. or Updates gateway heartbeat. |
> | Microsoft.ApiManagement/service/apis/read | Lists all APIs of the API Management service instance. or Gets the details of the API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/write | Creates new or updates existing specified API of the API Management service instance. or Updates the specified API of the API Management service instance. |
> | Microsoft.ApiManagement/service/apis/delete | Deletes the specified API of the API Management service instance. |
> | Microsoft.ApiManagement/service/apis/diagnostics/read | Lists all diagnostics of an API. or Gets the details of the Diagnostic for an API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/diagnostics/write | Creates a new Diagnostic for an API or updates an existing one. or Updates the details of the Diagnostic for an API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/diagnostics/delete | Deletes the specified Diagnostic from an API. |
> | Microsoft.ApiManagement/service/apis/issues/read | Lists all issues associated with the specified API. or Gets the details of the Issue for an API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/issues/write | Creates a new Issue for an API or updates an existing one. or Updates an existing issue for an API. |
> | Microsoft.ApiManagement/service/apis/issues/delete | Deletes the specified Issue from an API. |
> | Microsoft.ApiManagement/service/apis/issues/attachments/read | Lists all attachments for the Issue associated with the specified API. or Gets the details of the issue Attachment for an API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/issues/attachments/write | Creates a new Attachment for the Issue in an API or updates an existing one. |
> | Microsoft.ApiManagement/service/apis/issues/attachments/delete | Deletes the specified comment from an Issue. |
> | Microsoft.ApiManagement/service/apis/issues/comments/read | Lists all comments for the Issue associated with the specified API. or Gets the details of the issue Comment for an API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/issues/comments/write | Creates a new Comment for the Issue in an API or updates an existing one. |
> | Microsoft.ApiManagement/service/apis/issues/comments/delete | Deletes the specified comment from an Issue. |
> | Microsoft.ApiManagement/service/apis/operations/read | Lists a collection of the operations for the specified API. or Gets the details of the API Operation specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/operations/write | Creates a new operation in the API or updates an existing one. or Updates the details of the operation in the API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/operations/delete | Deletes the specified operation in the API. |
> | Microsoft.ApiManagement/service/apis/operations/policies/read | Get the list of policy configuration at the API Operation level. or Get the policy configuration at the API Operation level. |
> | Microsoft.ApiManagement/service/apis/operations/policies/write | Creates or updates policy configuration for the API Operation level. |
> | Microsoft.ApiManagement/service/apis/operations/policies/delete | Deletes the policy configuration at the Api Operation. |
> | Microsoft.ApiManagement/service/apis/operations/policy/read | Get the policy configuration at Operation level |
> | Microsoft.ApiManagement/service/apis/operations/policy/write | Create policy configuration at Operation level |
> | Microsoft.ApiManagement/service/apis/operations/policy/delete | Delete the policy configuration at Operation level |
> | Microsoft.ApiManagement/service/apis/operations/tags/read | Lists all Tags associated with the Operation. or Get tag associated with the Operation. |
> | Microsoft.ApiManagement/service/apis/operations/tags/write | Assign tag to the Operation. |
> | Microsoft.ApiManagement/service/apis/operations/tags/delete | Detach the tag from the Operation. |
> | Microsoft.ApiManagement/service/apis/operationsByTags/read | Lists a collection of operations associated with tags. |
> | Microsoft.ApiManagement/service/apis/policies/read | Get the policy configuration at the API level. or Get the policy configuration at the API level. |
> | Microsoft.ApiManagement/service/apis/policies/write | Creates or updates policy configuration for the API. |
> | Microsoft.ApiManagement/service/apis/policies/delete | Deletes the policy configuration at the Api. |
> | Microsoft.ApiManagement/service/apis/policy/read | Get the policy configuration at API level |
> | Microsoft.ApiManagement/service/apis/policy/write | Create policy configuration at API level |
> | Microsoft.ApiManagement/service/apis/policy/delete | Delete the policy configuration at API level |
> | Microsoft.ApiManagement/service/apis/products/read | Lists all Products, which the API is part of. |
> | Microsoft.ApiManagement/service/apis/releases/read | Lists all releases of an API.<br>An API release is created when making an API Revision current.<br>Releases are also used to rollback to previous revisions.<br>Results will be paged and can be constrained by the $top and $skip parameters.<br>or Returns the details of an API release. |
> | Microsoft.ApiManagement/service/apis/releases/delete | Removes all releases of the API or Deletes the specified release in the API. |
> | Microsoft.ApiManagement/service/apis/releases/write | Creates a new Release for the API. or Updates the details of the release of the API specified by its identifier. |
> | Microsoft.ApiManagement/service/apis/revisions/read | Lists all revisions of an API. |
> | Microsoft.ApiManagement/service/apis/revisions/delete | Removes all revisions of an API |
> | Microsoft.ApiManagement/service/apis/schemas/read | Get the schema configuration at the API level. or Get the schema configuration at the API level. |
> | Microsoft.ApiManagement/service/apis/schemas/write | Creates or updates schema configuration for the API. |
> | Microsoft.ApiManagement/service/apis/schemas/delete | Deletes the schema configuration at the Api. |
> | Microsoft.ApiManagement/service/apis/tagDescriptions/read | Lists all Tags descriptions in scope of API. Model similar to swagger - tagDescription is defined on API level but tag may be assigned to the Operations or Get Tag description in scope of API |
> | Microsoft.ApiManagement/service/apis/tagDescriptions/write | Create/Update tag description in scope of the Api. |
> | Microsoft.ApiManagement/service/apis/tagDescriptions/delete | Delete tag description for the Api. |
> | Microsoft.ApiManagement/service/apis/tags/read | Lists all Tags associated with the API. or Get tag associated with the API. |
> | Microsoft.ApiManagement/service/apis/tags/write | Assign tag to the Api. |
> | Microsoft.ApiManagement/service/apis/tags/delete | Detach the tag from the Api. |
> | Microsoft.ApiManagement/service/apisByTags/read | Lists a collection of apis associated with tags. |
> | Microsoft.ApiManagement/service/apiVersionSets/read | Lists a collection of API Version Sets in the specified service instance. or Gets the details of the Api Version Set specified by its identifier. |
> | Microsoft.ApiManagement/service/apiVersionSets/write | Creates or Updates a Api Version Set. or Updates the details of the Api VersionSet specified by its identifier. |
> | Microsoft.ApiManagement/service/apiVersionSets/delete | Deletes specific Api Version Set. |
> | Microsoft.ApiManagement/service/apiVersionSets/versions/read | Get list of version entities |
> | Microsoft.ApiManagement/service/authorizationServers/read | Lists a collection of authorization servers defined within a service instance. or Gets the details of the authorization server without secrets. |
> | Microsoft.ApiManagement/service/authorizationServers/write | Creates new authorization server or updates an existing authorization server. or Updates the details of the authorization server specified by its identifier. |
> | Microsoft.ApiManagement/service/authorizationServers/delete | Deletes specific authorization server instance. |
> | Microsoft.ApiManagement/service/authorizationServers/listSecrets/action | Gets secrets for the authorization server. |
> | Microsoft.ApiManagement/service/backends/read | Lists a collection of backends in the specified service instance. or Gets the details of the backend specified by its identifier. |
> | Microsoft.ApiManagement/service/backends/write | Creates or Updates a backend. or Updates an existing backend. |
> | Microsoft.ApiManagement/service/backends/delete | Deletes the specified backend. |
> | Microsoft.ApiManagement/service/backends/reconnect/action | Notifies the APIM proxy to create a new connection to the backend after the specified timeout. If no timeout was specified, timeout of 2 minutes is used. |
> | Microsoft.ApiManagement/service/caches/read | Lists a collection of all external Caches in the specified service instance. or Gets the details of the Cache specified by its identifier. |
> | Microsoft.ApiManagement/service/caches/write | Creates or updates an External Cache to be used in Api Management instance. or Updates the details of the cache specified by its identifier. |
> | Microsoft.ApiManagement/service/caches/delete | Deletes specific Cache. |
> | Microsoft.ApiManagement/service/certificates/read | Lists a collection of all certificates in the specified service instance. or Gets the details of the certificate specified by its identifier. |
> | Microsoft.ApiManagement/service/certificates/write | Creates or updates the certificate being used for authentication with the backend. |
> | Microsoft.ApiManagement/service/certificates/delete | Deletes specific certificate. |
> | Microsoft.ApiManagement/service/contentTypes/read | Returns list of content types |
> | Microsoft.ApiManagement/service/contentTypes/contentItems/read | Returns list of content items or Returns content item details |
> | Microsoft.ApiManagement/service/contentTypes/contentItems/write | Creates new content item or Updates specified content item |
> | Microsoft.ApiManagement/service/contentTypes/contentItems/delete | Removes specified content item. |
> | Microsoft.ApiManagement/service/diagnostics/read | Lists all diagnostics of the API Management service instance. or Gets the details of the Diagnostic specified by its identifier. |
> | Microsoft.ApiManagement/service/diagnostics/write | Creates a new Diagnostic or updates an existing one. or Updates the details of the Diagnostic specified by its identifier. |
> | Microsoft.ApiManagement/service/diagnostics/delete | Deletes the specified Diagnostic. |
> | Microsoft.ApiManagement/service/gateways/read | Lists a collection of gateways registered with service instance. or Gets the details of the Gateway specified by its identifier. |
> | Microsoft.ApiManagement/service/gateways/write | Creates or updates an Gateway to be used in Api Management instance. or Updates the details of the gateway specified by its identifier. |
> | Microsoft.ApiManagement/service/gateways/delete | Deletes specific Gateway. |
> | Microsoft.ApiManagement/service/gateways/listKeys/action | Retrieves gateway keys. |
> | Microsoft.ApiManagement/service/gateways/regenerateKey/action | Regenerates specified gateway key invalidationg any tokens created with it. |
> | Microsoft.ApiManagement/service/gateways/generateToken/action | Gets the Shared Access Authorization Token for the gateway. |
> | Microsoft.ApiManagement/service/gateways/apis/read | Lists a collection of the APIs associated with a gateway. |
> | Microsoft.ApiManagement/service/gateways/apis/write | Adds an API to the specified Gateway. |
> | Microsoft.ApiManagement/service/gateways/apis/delete | Deletes the specified API from the specified Gateway. |
> | Microsoft.ApiManagement/service/gateways/hostnameConfigurations/read | Lists the collection of hostname configurations for the specified gateway. |
> | Microsoft.ApiManagement/service/groups/read | Lists a collection of groups defined within a service instance. or Gets the details of the group specified by its identifier. |
> | Microsoft.ApiManagement/service/groups/write | Creates or Updates a group. or Updates the details of the group specified by its identifier. |
> | Microsoft.ApiManagement/service/groups/delete | Deletes specific group of the API Management service instance. |
> | Microsoft.ApiManagement/service/groups/users/read | Lists a collection of user entities associated with the group. |
> | Microsoft.ApiManagement/service/groups/users/write | Add existing user to existing group |
> | Microsoft.ApiManagement/service/groups/users/delete | Remove existing user from existing group. |
> | Microsoft.ApiManagement/service/identityProviders/read | Lists a collection of Identity Provider configured in the specified service instance. or Gets the configuration details of the identity Provider without secrets. |
> | Microsoft.ApiManagement/service/identityProviders/write | Creates or Updates the IdentityProvider configuration. or Updates an existing IdentityProvider configuration. |
> | Microsoft.ApiManagement/service/identityProviders/delete | Deletes the specified identity provider configuration. |
> | Microsoft.ApiManagement/service/identityProviders/listSecrets/action | Gets Identity Provider secrets. |
> | Microsoft.ApiManagement/service/issues/read | Lists a collection of issues in the specified service instance. or Gets API Management issue details |
> | Microsoft.ApiManagement/service/locations/networkstatus/read | Gets the network access status of resources on which the service depends on in the location. |
> | Microsoft.ApiManagement/service/loggers/read | Lists a collection of loggers in the specified service instance. or Gets the details of the logger specified by its identifier. |
> | Microsoft.ApiManagement/service/loggers/write | Creates or Updates a logger. or Updates an existing logger. |
> | Microsoft.ApiManagement/service/loggers/delete | Deletes the specified logger. |
> | Microsoft.ApiManagement/service/namedValues/read | Lists a collection of named values defined within a service instance. or Gets the details of the named value specified by its identifier. |
> | Microsoft.ApiManagement/service/namedValues/write | Creates or updates named value. or Updates the specific named value. |
> | Microsoft.ApiManagement/service/namedValues/delete | Deletes specific named value from the API Management service instance. |
> | Microsoft.ApiManagement/service/namedValues/listValue/action | Gets the secret of the named value specified by its identifier. |
> | Microsoft.ApiManagement/service/networkstatus/read | Gets the network access status of resources on which the service depends on. |
> | Microsoft.ApiManagement/service/notifications/read | Lists a collection of properties defined within a service instance. or Gets the details of the Notification specified by its identifier. |
> | Microsoft.ApiManagement/service/notifications/write | Create or Update API Management publisher notification. |
> | Microsoft.ApiManagement/service/notifications/recipientEmails/read | Gets the list of the Notification Recipient Emails subscribed to a notification. |
> | Microsoft.ApiManagement/service/notifications/recipientEmails/write | Adds the Email address to the list of Recipients for the Notification. |
> | Microsoft.ApiManagement/service/notifications/recipientEmails/delete | Removes the email from the list of Notification. |
> | Microsoft.ApiManagement/service/notifications/recipientUsers/read | Gets the list of the Notification Recipient User subscribed to the notification. |
> | Microsoft.ApiManagement/service/notifications/recipientUsers/write | Adds the API Management User to the list of Recipients for the Notification. |
> | Microsoft.ApiManagement/service/notifications/recipientUsers/delete | Removes the API Management user from the list of Notification. |
> | Microsoft.ApiManagement/service/openidConnectProviders/read | Lists of all the OpenId Connect Providers. or Gets specific OpenID Connect Provider without secrets. |
> | Microsoft.ApiManagement/service/openidConnectProviders/write | Creates or updates the OpenID Connect Provider. or Updates the specific OpenID Connect Provider. |
> | Microsoft.ApiManagement/service/openidConnectProviders/delete | Deletes specific OpenID Connect Provider of the API Management service instance. |
> | Microsoft.ApiManagement/service/openidConnectProviders/listSecrets/action | Gets specific OpenID Connect Provider secrets. |
> | Microsoft.ApiManagement/service/operationresults/read | Gets current status of long running operation |
> | Microsoft.ApiManagement/service/policies/read | Lists all the Global Policy definitions of the Api Management service. or Get the Global policy definition of the Api Management service. |
> | Microsoft.ApiManagement/service/policies/write | Creates or updates the global policy configuration of the Api Management service. |
> | Microsoft.ApiManagement/service/policies/delete | Deletes the global policy configuration of the Api Management Service. |
> | Microsoft.ApiManagement/service/policy/read | Get the policy configuration at Tenant level |
> | Microsoft.ApiManagement/service/policy/write | Create policy configuration at Tenant level |
> | Microsoft.ApiManagement/service/policy/delete | Delete the policy configuration at Tenant level |
> | Microsoft.ApiManagement/service/policyDescriptions/read | Lists all policy descriptions. |
> | Microsoft.ApiManagement/service/policySnippets/read | Lists all policy snippets. |
> | Microsoft.ApiManagement/service/portalsettings/read | Lists a collection of portal settings. or Get Sign In Settings for the Portal or Get Sign Up Settings for the Portal or Get Delegation Settings for the Portal. |
> | Microsoft.ApiManagement/service/portalsettings/write | Update Sign-In settings. or Create or Update Sign-In settings. or Update Sign Up settings or Update Sign Up settings or Update Delegation settings. or Create or Update Delegation settings. |
> | Microsoft.ApiManagement/service/portalsettings/listSecrets/action | Gets validation key of portal delegation settings. |
> | Microsoft.ApiManagement/service/products/read | Lists a collection of products in the specified service instance. or Gets the details of the product specified by its identifier. |
> | Microsoft.ApiManagement/service/products/write | Creates or Updates a product. or Update existing product details. |
> | Microsoft.ApiManagement/service/products/delete | Delete product. |
> | Microsoft.ApiManagement/service/products/apis/read | Lists a collection of the APIs associated with a product. |
> | Microsoft.ApiManagement/service/products/apis/write | Adds an API to the specified product. |
> | Microsoft.ApiManagement/service/products/apis/delete | Deletes the specified API from the specified product. |
> | Microsoft.ApiManagement/service/products/groups/read | Lists the collection of developer groups associated with the specified product. |
> | Microsoft.ApiManagement/service/products/groups/write | Adds the association between the specified developer group with the specified product. |
> | Microsoft.ApiManagement/service/products/groups/delete | Deletes the association between the specified group and product. |
> | Microsoft.ApiManagement/service/products/policies/read | Get the policy configuration at the Product level. or Get the policy configuration at the Product level. |
> | Microsoft.ApiManagement/service/products/policies/write | Creates or updates policy configuration for the Product. |
> | Microsoft.ApiManagement/service/products/policies/delete | Deletes the policy configuration at the Product. |
> | Microsoft.ApiManagement/service/products/policy/read | Get the policy configuration at Product level |
> | Microsoft.ApiManagement/service/products/policy/write | Create policy configuration at Product level |
> | Microsoft.ApiManagement/service/products/policy/delete | Delete the policy configuration at Product level |
> | Microsoft.ApiManagement/service/products/subscriptions/read | Lists the collection of subscriptions to the specified product. |
> | Microsoft.ApiManagement/service/products/tags/read | Lists all Tags associated with the Product. or Get tag associated with the Product. |
> | Microsoft.ApiManagement/service/products/tags/write | Assign tag to the Product. |
> | Microsoft.ApiManagement/service/products/tags/delete | Detach the tag from the Product. |
> | Microsoft.ApiManagement/service/productsByTags/read | Lists a collection of products associated with tags. |
> | Microsoft.ApiManagement/service/properties/read | Lists a collection of properties defined within a service instance. or Gets the details of the property specified by its identifier. |
> | Microsoft.ApiManagement/service/properties/write | Creates or updates a property. or Updates the specific property. |
> | Microsoft.ApiManagement/service/properties/delete | Deletes specific property from the API Management service instance. |
> | Microsoft.ApiManagement/service/properties/listSecrets/action | Gets the secrets of the property specified by its identifier. |
> | Microsoft.ApiManagement/service/quotas/read | Get values for quota |
> | Microsoft.ApiManagement/service/quotas/write | Set quota counter current value |
> | Microsoft.ApiManagement/service/quotas/periods/read | Get quota counter value for period |
> | Microsoft.ApiManagement/service/quotas/periods/write | Set quota counter current value |
> | Microsoft.ApiManagement/service/regions/read | Lists all azure regions in which the service exists. |
> | Microsoft.ApiManagement/service/reports/read | Get report aggregated by time periods or Get report aggregated by geographical region or Get report aggregated by developers.<br>or Get report aggregated by products.<br>or Get report aggregated by APIs or Get report aggregated by operations or Get report aggregated by subscription.<br>or Get requests reporting data |
> | Microsoft.ApiManagement/service/subscriptions/read | Lists all subscriptions of the API Management service instance. or Gets the specified Subscription entity (without keys). |
> | Microsoft.ApiManagement/service/subscriptions/write | Creates or updates the subscription of specified user to the specified product. or Updates the details of a subscription specified by its identifier. |
> | Microsoft.ApiManagement/service/subscriptions/delete | Deletes the specified subscription. |
> | Microsoft.ApiManagement/service/subscriptions/regeneratePrimaryKey/action | Regenerates primary key of existing subscription of the API Management service instance. |
> | Microsoft.ApiManagement/service/subscriptions/regenerateSecondaryKey/action | Regenerates secondary key of existing subscription of the API Management service instance. |
> | Microsoft.ApiManagement/service/subscriptions/listSecrets/action | Gets the specified Subscription keys. |
> | Microsoft.ApiManagement/service/tagResources/read | Lists a collection of resources associated with tags. |
> | Microsoft.ApiManagement/service/tags/read | Lists a collection of tags defined within a service instance. or Gets the details of the tag specified by its identifier. |
> | Microsoft.ApiManagement/service/tags/write | Creates a tag. or Updates the details of the tag specified by its identifier. |
> | Microsoft.ApiManagement/service/tags/delete | Deletes specific tag of the API Management service instance. |
> | Microsoft.ApiManagement/service/templates/read | Gets all email templates or Gets API Management email template details |
> | Microsoft.ApiManagement/service/templates/write | Create or update API Management email template or Updates API Management email template |
> | Microsoft.ApiManagement/service/templates/delete | Reset default API Management email template |
> | Microsoft.ApiManagement/service/tenant/read | Get the Global policy definition of the Api Management service. or Get tenant access information details |
> | Microsoft.ApiManagement/service/tenant/write | Set policy configuration for the tenant or Update tenant access information details |
> | Microsoft.ApiManagement/service/tenant/delete | Remove policy configuration for the tenant |
> | Microsoft.ApiManagement/service/tenant/listSecrets/action | Get tenant access information details |
> | Microsoft.ApiManagement/service/tenant/regeneratePrimaryKey/action | Regenerate primary access key |
> | Microsoft.ApiManagement/service/tenant/regenerateSecondaryKey/action | Regenerate secondary access key |
> | Microsoft.ApiManagement/service/tenant/deploy/action | Runs a deployment task to apply changes from the specified git branch to the configuration in database. |
> | Microsoft.ApiManagement/service/tenant/save/action | Creates commit with configuration snapshot to the specified branch in the repository |
> | Microsoft.ApiManagement/service/tenant/validate/action | Validates changes from the specified git branch |
> | Microsoft.ApiManagement/service/tenant/operationResults/read | Get list of operation results or Get result of a specific operation |
> | Microsoft.ApiManagement/service/tenant/syncState/read | Get status of last git synchronization |
> | Microsoft.ApiManagement/service/users/read | Lists a collection of registered users in the specified service instance. or Gets the details of the user specified by its identifier. |
> | Microsoft.ApiManagement/service/users/write | Creates or Updates a user. or Updates the details of the user specified by its identifier. |
> | Microsoft.ApiManagement/service/users/delete | Deletes specific user. |
> | Microsoft.ApiManagement/service/users/generateSsoUrl/action | Retrieves a redirection URL containing an authentication token for signing a given user into the developer portal. |
> | Microsoft.ApiManagement/service/users/token/action | Gets the Shared Access Authorization Token for the User. |
> | Microsoft.ApiManagement/service/users/confirmations/send/action | Sends confirmation |
> | Microsoft.ApiManagement/service/users/groups/read | Lists all user groups. |
> | Microsoft.ApiManagement/service/users/identities/read | List of all user identities. |
> | Microsoft.ApiManagement/service/users/keys/read | Get keys associated with user |
> | Microsoft.ApiManagement/service/users/subscriptions/read | Lists the collection of subscriptions of the specified user. |

### Microsoft.AppConfiguration

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AppConfiguration/register/action | Registers a subscription to use Microsoft App Configuration. |
> | Microsoft.AppConfiguration/checkNameAvailability/read | Check whether the resource name is available for use. |
> | Microsoft.AppConfiguration/configurationStores/read | Gets the properties of the specified configuration store or lists all the configuration stores under the specified resource group or subscription. |
> | Microsoft.AppConfiguration/configurationStores/write | Create or update a configuration store with the specified parameters. |
> | Microsoft.AppConfiguration/configurationStores/delete | Deletes a configuration store. |
> | Microsoft.AppConfiguration/configurationStores/ListKeys/action | Lists the API keys for the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/RegenerateKey/action | Regenerates of the API key's for the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/ListKeyValue/action | Lists a key-value for the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/PrivateEndpointConnectionsApproval/action | Auto-Approve a private endpoint connection under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/eventGridFilters/read | Gets the properties of the specified configuration store event grid filter or lists all the configuration store event grid filters under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/eventGridFilters/write | Create or update a configuration store event grid filter with the specified parameters. |
> | Microsoft.AppConfiguration/configurationStores/eventGridFilters/delete | Deletes a configuration store event grid filter. |
> | Microsoft.AppConfiguration/configurationStores/privateEndpointConnectionProxies/validate/action | Validate a private endpoint connection proxy under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/privateEndpointConnectionProxies/read | Get a private endpoint connection proxy under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/privateEndpointConnectionProxies/write | Create or update a private endpoint connection proxy under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/privateEndpointConnectionProxies/delete | Delete a private endpoint connection proxy under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/privateEndpointConnections/read | Get a private endpoint connection or list private endpoint connections under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/privateEndpointConnections/write | Approve or reject a private endpoint connection under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/privateEndpointConnections/delete | Delete a private endpoint connection under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/privateLinkResources/read | Lists all the private link resources under the specified configuration store. |
> | Microsoft.AppConfiguration/configurationStores/providers/Microsoft.Insights/diagnosticSettings/read | Read all Diagnostic Settings values for a Configuration Store. |
> | Microsoft.AppConfiguration/configurationStores/providers/Microsoft.Insights/diagnosticSettings/write | Write/Overwrite Diagnostic Settings for Microsoft App Configuration. |
> | Microsoft.AppConfiguration/configurationStores/providers/Microsoft.Insights/metricDefinitions/read | Retrieve all metric definitions for Microsoft App Configuration. |
> | Microsoft.AppConfiguration/locations/operationsStatus/read | Get the status of an operation. |
> | Microsoft.AppConfiguration/operations/read | Lists all of the operations supported by Microsoft App Configuration. |
> | **DataAction** | **Description** |
> | Microsoft.AppConfiguration/configurationStores/keyValues/read | Reads a key-value from the configuration store. |
> | Microsoft.AppConfiguration/configurationStores/keyValues/write | Creates or updates a key-value in the configuration store. |
> | Microsoft.AppConfiguration/configurationStores/keyValues/delete | Deletes an existing key-value from the configuration store. |

### Microsoft.AzureStack

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AzureStack/register/action | Registers Subscription with Microsoft.AzureStack resource provider |
> | Microsoft.AzureStack/cloudManifestFiles/read | Gets the Cloud Manifest File |
> | Microsoft.AzureStack/Operations/read | Gets the properties of a resource provider operation |
> | Microsoft.AzureStack/registrations/read | Gets the properties of an Azure Stack registration |
> | Microsoft.AzureStack/registrations/write | Creates or updates an Azure Stack registration |
> | Microsoft.AzureStack/registrations/delete | Deletes an Azure Stack registration |
> | Microsoft.AzureStack/registrations/getActivationKey/action | Gets the latest Azure Stack activation key |
> | Microsoft.AzureStack/registrations/customerSubscriptions/read | Gets the properties of an Azure Stack Customer Subscription |
> | Microsoft.AzureStack/registrations/customerSubscriptions/write | Creates or updates an Azure Stack Customer Subscription |
> | Microsoft.AzureStack/registrations/customerSubscriptions/delete | Deletes an Azure Stack Customer Subscription |
> | Microsoft.AzureStack/registrations/products/read | Gets the properties of an Azure Stack Marketplace product |
> | Microsoft.AzureStack/registrations/products/listDetails/action | Retrieves extended details for an Azure Stack Marketplace product |
> | Microsoft.AzureStack/registrations/products/getProducts/action | Retrieves a list of Azure Stack Marketplace products |
> | Microsoft.AzureStack/registrations/products/getProduct/action | Retrieves Azure Stack Marketplace product |
> | Microsoft.AzureStack/registrations/products/uploadProductLog/action | Record Azure Stack Marketplace product operation status and timestamp |

### Microsoft.DataBoxEdge

Azure service: [Azure Stack Edge](../databox-online/azure-stack-edge-overview.md)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/uploadCertificate/action | Upload certificate for device registration |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/write | Creates or updates the Data Box Edge devices |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/read | Lists or gets the Data Box Edge devices |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/delete | Deletes the Data Box Edge devices |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/read | Lists or gets the Data Box Edge devices |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/read | Lists or gets the Data Box Edge devices |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/write | Creates or updates the Data Box Edge devices |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/getExtendedInformation/action | Retrieves resource extended information |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/scanForUpdates/action | Scan for updates |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/downloadUpdates/action | Download Updates in device |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/installUpdates/action | Install Updates on device |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/alerts/read | Lists or gets the alerts |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/alerts/read | Lists or gets the alerts |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/bandwidthSchedules/read | Lists or gets the bandwidth schedules |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/bandwidthSchedules/read | Lists or gets the bandwidth schedules |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/bandwidthSchedules/write | Creates or updates the bandwidth schedules |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/bandwidthSchedules/delete | Deletes the bandwidth schedules |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/bandwidthSchedules/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/jobs/read | Lists or gets the jobs |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/networkSettings/read | Lists or gets the Device network settings |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/nodes/read | Lists or gets the nodes |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/operationsStatus/read | Lists or gets the operation status |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/orders/read | Lists or gets the orders |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/orders/read | Lists or gets the orders |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/orders/write | Creates or updates the orders |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/orders/delete | Deletes the orders |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/orders/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/read | Lists or gets the roles |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/read | Lists or gets the roles |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/write | Creates or updates the roles |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/delete | Deletes the roles |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/securitySettings/update/action | Update security settings |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/securitySettings/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/read | Lists or gets the shares |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/read | Lists or gets the shares |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/write | Creates or updates the shares |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/refresh/action | Refresh the share metadata with the data from the cloud |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/delete | Deletes the shares |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccountCredentials/write | Creates or updates the storage account credentials |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccountCredentials/read | Lists or gets the storage account credentials |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccountCredentials/read | Lists or gets the storage account credentials |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccountCredentials/delete | Deletes the storage account credentials |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccountCredentials/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/read | Lists or gets the Storage Accounts |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/read | Lists or gets the Storage Accounts |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/write | Creates or updates the Storage Accounts |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/delete | Deletes the Storage Accounts |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/containers/read | Lists or gets the Containers |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/containers/read | Lists or gets the Containers |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/containers/write | Creates or updates the Containers |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/containers/delete | Deletes the Containers |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/containers/refresh/action | Refresh the container metadata with the data from the cloud |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/containers/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccounts/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/triggers/read | Lists or gets the triggers |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/triggers/read | Lists or gets the triggers |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/triggers/write | Creates or updates the triggers |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/triggers/delete | Deletes the triggers |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/triggers/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/updateSummary/read | Lists or gets the update summary |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/users/read | Lists or gets the share users |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/users/read | Lists or gets the share users |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/users/write | Creates or updates the share users |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/users/delete | Deletes the share users |
> | Microsoft.DataBoxEdge/dataBoxEdgeDevices/users/operationResults/read | Lists or gets the operation result |
> | Microsoft.DataBoxEdge/skus/read | Lists or gets the SKUs |

### Microsoft.DataCatalog

Azure service: [Data Catalog](../data-catalog/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DataCatalog/register/action | Register the subscription for Data Catalog Resource Provider |
> | Microsoft.DataCatalog/unregister/action | Unregister  the subscription for Data Catalog Resource Provider |
> | Microsoft.DataCatalog/catalogs/read | Read catalogs resource for Data Catalog Resource Provider. |
> | Microsoft.DataCatalog/catalogs/write | Write catalogs resource for Data Catalog Resource Provider. |
> | Microsoft.DataCatalog/catalogs/delete | Delete catalogs resource for Data Catalog Resource Provider. |
> | Microsoft.DataCatalog/checkNameAvailability/read | Check catalog name availability for Data Catalog Resource Provider. |
> | Microsoft.DataCatalog/datacatalogs/read | Read DataCatalog resource for Data Catalog Resource Provider. |
> | Microsoft.DataCatalog/datacatalogs/write | Write DataCatalog resource for Data Catalog Resource Provider. |
> | Microsoft.DataCatalog/datacatalogs/delete | Delete DataCatalog resource for Data Catalog Resource Provider. |
> | Microsoft.DataCatalog/operations/read | Reads all available operations in Data Catalog Resource Provider. |

### Microsoft.EventGrid

Azure service: [Event Grid](../event-grid/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.EventGrid/register/action | Registers the subscription for the EventGrid resource provider. |
> | Microsoft.EventGrid/unregister/action | Unregisters the subscription for the EventGrid resource provider. |
> | Microsoft.EventGrid/domains/write | Create or update a domain |
> | Microsoft.EventGrid/domains/read | Read a domain |
> | Microsoft.EventGrid/domains/delete | Delete a domain |
> | Microsoft.EventGrid/domains/listKeys/action | List keys for a domain |
> | Microsoft.EventGrid/domains/regenerateKey/action | Regenerate key for a domain |
> | Microsoft.EventGrid/domains/privateEndpointConnectionProxies/validate/action | Validate PrivateEndpointConnectionProxies for domains |
> | Microsoft.EventGrid/domains/privateEndpointConnectionProxies/read | Read PrivateEndpointConnectionProxies for domains |
> | Microsoft.EventGrid/domains/privateEndpointConnectionProxies/write | Write PrivateEndpointConnectionProxies for domains |
> | Microsoft.EventGrid/domains/privateEndpointConnectionProxies/delete | Delete PrivateEndpointConnectionProxies for domains |
> | Microsoft.EventGrid/domains/privateEndpointConnections/read | Read PrivateEndpointConnections for domains |
> | Microsoft.EventGrid/domains/privateEndpointConnections/write | Write PrivateEndpointConnections for domains |
> | Microsoft.EventGrid/domains/privateEndpointConnections/delete | Delete PrivateEndpointConnections for domains |
> | Microsoft.EventGrid/domains/privateLinkResources/read | Get or List PrivateLinkResources for domains |
> | Microsoft.EventGrid/domains/providers/Microsoft.Insights/logDefinitions/read | Allows access to diagnostic logs |
> | Microsoft.EventGrid/domains/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for domains |
> | Microsoft.EventGrid/domains/topics/read | Read a domain topic |
> | Microsoft.EventGrid/domains/topics/write | Create or update a domain topic |
> | Microsoft.EventGrid/domains/topics/delete | Delete a domain topic |
> | Microsoft.EventGrid/eventSubscriptions/write | Create or update an eventSubscription |
> | Microsoft.EventGrid/eventSubscriptions/read | Read an eventSubscription |
> | Microsoft.EventGrid/eventSubscriptions/delete | Delete an eventSubscription |
> | Microsoft.EventGrid/eventSubscriptions/getFullUrl/action | Get full url for the event subscription |
> | Microsoft.EventGrid/eventSubscriptions/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for event subscriptions |
> | Microsoft.EventGrid/eventSubscriptions/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for event subscriptions |
> | Microsoft.EventGrid/eventSubscriptions/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for eventSubscriptions |
> | Microsoft.EventGrid/extensionTopics/read | Read an extensionTopic. |
> | Microsoft.EventGrid/extensionTopics/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for topics |
> | Microsoft.EventGrid/extensionTopics/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for topics |
> | Microsoft.EventGrid/extensionTopics/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for topics |
> | Microsoft.EventGrid/locations/eventSubscriptions/read | List regional event subscriptions |
> | Microsoft.EventGrid/locations/operationResults/read | Read the result of a regional operation |
> | Microsoft.EventGrid/locations/operationsStatus/read | Read the status of a regional operation |
> | Microsoft.EventGrid/locations/topictypes/eventSubscriptions/read | List regional event subscriptions by topictype |
> | Microsoft.EventGrid/operationResults/read | Read the result of an operation |
> | Microsoft.EventGrid/operations/read | List EventGrid operations. |
> | Microsoft.EventGrid/operationsStatus/read | Read the status of an operation |
> | Microsoft.EventGrid/partnerNamespaces/write | Create or update a partner namespace |
> | Microsoft.EventGrid/partnerNamespaces/read | Read a partner namespace |
> | Microsoft.EventGrid/partnerNamespaces/delete | Delete a partner namespace |
> | Microsoft.EventGrid/partnerNamespaces/listKeys/action | List keys for a partner namespace |
> | Microsoft.EventGrid/partnerNamespaces/regenerateKey/action | Regenerate key for a partner namespace |
> | Microsoft.EventGrid/partnerNamespaces/eventChannels/read | Read an event channel |
> | Microsoft.EventGrid/partnerNamespaces/eventChannels/write | Create or update an event channel |
> | Microsoft.EventGrid/partnerNamespaces/eventChannels/delete | Delete an event channel |
> | Microsoft.EventGrid/partnerRegistrations/write | Create or update a partner registration |
> | Microsoft.EventGrid/partnerRegistrations/read | Read a partner registration |
> | Microsoft.EventGrid/partnerRegistrations/delete | Delete a partner registration |
> | Microsoft.EventGrid/partnerTopics/read | Read a partner topic |
> | Microsoft.EventGrid/partnerTopics/write | Create or update a partner topic |
> | Microsoft.EventGrid/partnerTopics/delete | Delete a partner topic |
> | Microsoft.EventGrid/partnerTopics/activate/action | Activate partner topic |
> | Microsoft.EventGrid/partnerTopics/deactivate/action | Deactivate partner topic |
> | Microsoft.EventGrid/sku/read | Read available Sku Definitions for event grid resources |
> | Microsoft.EventGrid/systemTopics/read | Read a system topic |
> | Microsoft.EventGrid/systemTopics/write | Create or update a system topic |
> | Microsoft.EventGrid/systemTopics/delete | Delete a system topic |
> | Microsoft.EventGrid/systemTopics/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for system topics |
> | Microsoft.EventGrid/systemTopics/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for system topics |
> | Microsoft.EventGrid/systemTopics/providers/Microsoft.Insights/logDefinitions/read | Allows access to diagnostic logs |
> | Microsoft.EventGrid/systemTopics/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for system topics |
> | Microsoft.EventGrid/topics/write | Create or update a topic |
> | Microsoft.EventGrid/topics/read | Read a topic |
> | Microsoft.EventGrid/topics/delete | Delete a topic |
> | Microsoft.EventGrid/topics/listKeys/action | List keys for a topic |
> | Microsoft.EventGrid/topics/regenerateKey/action | Regenerate key for a topic |
> | Microsoft.EventGrid/topics/privateEndpointConnectionProxies/validate/action | Validate PrivateEndpointConnectionProxies for topics |
> | Microsoft.EventGrid/topics/privateEndpointConnectionProxies/read | Read PrivateEndpointConnectionProxies for topics |
> | Microsoft.EventGrid/topics/privateEndpointConnectionProxies/write | Write PrivateEndpointConnectionProxies for topics |
> | Microsoft.EventGrid/topics/privateEndpointConnectionProxies/delete | Delete PrivateEndpointConnectionProxies for topics |
> | Microsoft.EventGrid/topics/privateEndpointConnections/read | Read PrivateEndpointConnections for topics |
> | Microsoft.EventGrid/topics/privateEndpointConnections/write | Write PrivateEndpointConnections for topics |
> | Microsoft.EventGrid/topics/privateEndpointConnections/delete | Delete PrivateEndpointConnections for topics |
> | Microsoft.EventGrid/topics/privateLinkResources/read | Read PrivateLinkResources for topics |
> | Microsoft.EventGrid/topics/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for topics |
> | Microsoft.EventGrid/topics/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for topics |
> | Microsoft.EventGrid/topics/providers/Microsoft.Insights/logDefinitions/read | Allows access to diagnostic logs |
> | Microsoft.EventGrid/topics/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for topics |
> | Microsoft.EventGrid/topictypes/read | Read a topictype |
> | Microsoft.EventGrid/topictypes/eventSubscriptions/read | List global event subscriptions by topic type |
> | Microsoft.EventGrid/topictypes/eventtypes/read | Read eventtypes supported by a topictype |

### Microsoft.Logic

Azure service: [Logic Apps](../logic-apps/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Logic/register/action | Registers the Microsoft.Logic resource provider for a given subscription. |
> | Microsoft.Logic/integrationAccounts/read | Reads the integration account. |
> | Microsoft.Logic/integrationAccounts/write | Creates or updates the integration account. |
> | Microsoft.Logic/integrationAccounts/delete | Deletes the integration account. |
> | Microsoft.Logic/integrationAccounts/regenerateAccessKey/action | Regenerates the access key secrets. |
> | Microsoft.Logic/integrationAccounts/listCallbackUrl/action | Gets the callback URL for integration account. |
> | Microsoft.Logic/integrationAccounts/listKeyVaultKeys/action | Gets the keys in the key vault. |
> | Microsoft.Logic/integrationAccounts/logTrackingEvents/action | Logs the tracking events in the integration account. |
> | Microsoft.Logic/integrationAccounts/join/action | Joins the Integration Account. |
> | Microsoft.Logic/integrationAccounts/agreements/read | Reads the agreement in integration account. |
> | Microsoft.Logic/integrationAccounts/agreements/write | Creates or updates the agreement in integration account. |
> | Microsoft.Logic/integrationAccounts/agreements/delete | Deletes the agreement in integration account. |
> | Microsoft.Logic/integrationAccounts/agreements/listContentCallbackUrl/action | Gets the callback URL for agreement content in integration account. |
> | Microsoft.Logic/integrationAccounts/assemblies/read | Reads the assembly in integration account. |
> | Microsoft.Logic/integrationAccounts/assemblies/write | Creates or updates the assembly in integration account. |
> | Microsoft.Logic/integrationAccounts/assemblies/delete | Deletes the assembly in integration account. |
> | Microsoft.Logic/integrationAccounts/assemblies/listContentCallbackUrl/action | Gets the callback URL for assembly content in integration account. |
> | Microsoft.Logic/integrationAccounts/batchConfigurations/read | Reads the batch configuration in integration account. |
> | Microsoft.Logic/integrationAccounts/batchConfigurations/write | Creates or updates the batch configuration in integration account. |
> | Microsoft.Logic/integrationAccounts/batchConfigurations/delete | Deletes the batch configuration in integration account. |
> | Microsoft.Logic/integrationAccounts/certificates/read | Reads the certificate in integration account. |
> | Microsoft.Logic/integrationAccounts/certificates/write | Creates or updates the certificate in integration account. |
> | Microsoft.Logic/integrationAccounts/certificates/delete | Deletes the certificate in integration account. |
> | Microsoft.Logic/integrationAccounts/groups/read | Reads the group in integration account. |
> | Microsoft.Logic/integrationAccounts/groups/write | Creates or updates the group in integration account. |
> | Microsoft.Logic/integrationAccounts/groups/delete | Deletes the group in integration account. |
> | Microsoft.Logic/integrationAccounts/maps/read | Reads the map in integration account. |
> | Microsoft.Logic/integrationAccounts/maps/write | Creates or updates the map in integration account. |
> | Microsoft.Logic/integrationAccounts/maps/delete | Deletes the map in integration account. |
> | Microsoft.Logic/integrationAccounts/maps/listContentCallbackUrl/action | Gets the callback URL for map content in integration account. |
> | Microsoft.Logic/integrationAccounts/partners/read | Reads the partner in integration account. |
> | Microsoft.Logic/integrationAccounts/partners/write | Creates or updates the partner in integration account. |
> | Microsoft.Logic/integrationAccounts/partners/delete | Deletes the partner in integration account. |
> | Microsoft.Logic/integrationAccounts/partners/listContentCallbackUrl/action | Gets the callback URL for partner content in integration account. |
> | Microsoft.Logic/integrationAccounts/providers/Microsoft.Insights/logDefinitions/read | Reads the Integration Account log definitions. |
> | Microsoft.Logic/integrationAccounts/rosettaNetProcessConfigurations/read | Reads the RosettaNet process configuration in integration account. |
> | Microsoft.Logic/integrationAccounts/rosettaNetProcessConfigurations/write | Creates or updates the  RosettaNet process configuration in integration account. |
> | Microsoft.Logic/integrationAccounts/rosettaNetProcessConfigurations/delete | Deletes the RosettaNet process configuration in integration account. |
> | Microsoft.Logic/integrationAccounts/schedules/read | Reads the schedule in integration account. |
> | Microsoft.Logic/integrationAccounts/schedules/write | Creates or updates the schedule in integration account. |
> | Microsoft.Logic/integrationAccounts/schedules/delete | Deletes the schedule in integration account. |
> | Microsoft.Logic/integrationAccounts/schemas/read | Reads the schema in integration account. |
> | Microsoft.Logic/integrationAccounts/schemas/write | Creates or updates the schema in integration account. |
> | Microsoft.Logic/integrationAccounts/schemas/delete | Deletes the schema in integration account. |
> | Microsoft.Logic/integrationAccounts/schemas/listContentCallbackUrl/action | Gets the callback URL for schema content in integration account. |
> | Microsoft.Logic/integrationAccounts/sessions/read | Reads the session in integration account. |
> | Microsoft.Logic/integrationAccounts/sessions/write | Creates or updates the session in integration account. |
> | Microsoft.Logic/integrationAccounts/sessions/delete | Deletes the session in integration account. |
> | Microsoft.Logic/integrationServiceEnvironments/read | Reads the integration service environment. |
> | Microsoft.Logic/integrationServiceEnvironments/write | Creates or updates the integration service environment. |
> | Microsoft.Logic/integrationServiceEnvironments/delete | Deletes the integration service environment. |
> | Microsoft.Logic/integrationServiceEnvironments/join/action | Joins the Integration Service Environment. |
> | Microsoft.Logic/integrationServiceEnvironments/availableManagedApis/read | Reads the integration service environment available managed APIs. |
> | Microsoft.Logic/integrationServiceEnvironments/managedApis/read | Reads the integration service environment managed API. |
> | Microsoft.Logic/integrationServiceEnvironments/managedApis/write | Creates or updates the integration service environment managed API. |
> | Microsoft.Logic/integrationServiceEnvironments/managedApis/join/action | Joins the Integration Service Environment Managed API. |
> | Microsoft.Logic/integrationServiceEnvironments/managedApis/apiOperations/read | Reads the integration service environment managed API operation. |
> | Microsoft.Logic/integrationServiceEnvironments/managedApis/operationStatuses/read | Reads the integration service environment managed API operation statuses. |
> | Microsoft.Logic/integrationServiceEnvironments/operationStatuses/read | Reads the integration service environment operation statuses. |
> | Microsoft.Logic/integrationServiceEnvironments/providers/Microsoft.Insights/metricDefinitions/read | Reads the integration service environment metric definitions. |
> | Microsoft.Logic/locations/workflows/validate/action | Validates the workflow. |
> | Microsoft.Logic/locations/workflows/recommendOperationGroups/action | Gets the workflow recommend operation groups. |
> | Microsoft.Logic/operations/read | Gets the operation. |
> | Microsoft.Logic/workflows/read | Reads the workflow. |
> | Microsoft.Logic/workflows/write | Creates or updates the workflow. |
> | Microsoft.Logic/workflows/delete | Deletes the workflow. |
> | Microsoft.Logic/workflows/run/action | Starts a run of the workflow. |
> | Microsoft.Logic/workflows/disable/action | Disables the workflow. |
> | Microsoft.Logic/workflows/enable/action | Enables the workflow. |
> | Microsoft.Logic/workflows/suspend/action | Suspends the workflow. |
> | Microsoft.Logic/workflows/validate/action | Validates the workflow. |
> | Microsoft.Logic/workflows/move/action | Moves Workflow from its existing subscription id, resource group, and/or name to a different subscription id, resource group, and/or name. |
> | Microsoft.Logic/workflows/listSwagger/action | Gets the workflow swagger definitions. |
> | Microsoft.Logic/workflows/regenerateAccessKey/action | Regenerates the access key secrets. |
> | Microsoft.Logic/workflows/listCallbackUrl/action | Gets the callback URL for workflow. |
> | Microsoft.Logic/workflows/accessKeys/read | Reads the access key. |
> | Microsoft.Logic/workflows/accessKeys/write | Creates or updates the access key. |
> | Microsoft.Logic/workflows/accessKeys/delete | Deletes the access key. |
> | Microsoft.Logic/workflows/accessKeys/list/action | Lists the access key secrets. |
> | Microsoft.Logic/workflows/accessKeys/regenerate/action | Regenerates the access key secrets. |
> | Microsoft.Logic/workflows/detectors/read | Reads the workflow detector. |
> | Microsoft.Logic/workflows/providers/Microsoft.Insights/diagnosticSettings/read | Reads the workflow diagnostic settings. |
> | Microsoft.Logic/workflows/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the workflow diagnostic setting. |
> | Microsoft.Logic/workflows/providers/Microsoft.Insights/logDefinitions/read | Reads the workflow log definitions. |
> | Microsoft.Logic/workflows/providers/Microsoft.Insights/metricDefinitions/read | Reads the workflow metric definitions. |
> | Microsoft.Logic/workflows/runs/read | Reads the workflow run. |
> | Microsoft.Logic/workflows/runs/delete | Deletes a run of a workflow. |
> | Microsoft.Logic/workflows/runs/cancel/action | Cancels the run of a workflow. |
> | Microsoft.Logic/workflows/runs/actions/read | Reads the workflow run action. |
> | Microsoft.Logic/workflows/runs/actions/listExpressionTraces/action | Gets the workflow run action expression traces. |
> | Microsoft.Logic/workflows/runs/actions/repetitions/read | Reads the workflow run action repetition. |
> | Microsoft.Logic/workflows/runs/actions/repetitions/listExpressionTraces/action | Gets the workflow run action repetition expression traces. |
> | Microsoft.Logic/workflows/runs/actions/repetitions/requestHistories/read | Reads the workflow run repetition action request history. |
> | Microsoft.Logic/workflows/runs/actions/requestHistories/read | Reads the workflow run action request history. |
> | Microsoft.Logic/workflows/runs/actions/scoperepetitions/read | Reads the workflow run action scope repetition. |
> | Microsoft.Logic/workflows/runs/operations/read | Reads the workflow run operation status. |
> | Microsoft.Logic/workflows/triggers/read | Reads the trigger. |
> | Microsoft.Logic/workflows/triggers/run/action | Executes the trigger. |
> | Microsoft.Logic/workflows/triggers/reset/action | Resets the trigger. |
> | Microsoft.Logic/workflows/triggers/setState/action | Sets the trigger state. |
> | Microsoft.Logic/workflows/triggers/listCallbackUrl/action | Gets the callback URL for trigger. |
> | Microsoft.Logic/workflows/triggers/histories/read | Reads the trigger histories. |
> | Microsoft.Logic/workflows/triggers/histories/resubmit/action | Resubmits the workflow trigger. |
> | Microsoft.Logic/workflows/versions/read | Reads the workflow version. |
> | Microsoft.Logic/workflows/versions/triggers/listCallbackUrl/action | Gets the callback URL for trigger. |

### Microsoft.Relay

Azure service: [Azure Relay](../service-bus-relay/relay-what-is-it.md)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Relay/checkNamespaceAvailability/action | Checks availability of namespace under given subscription. This API is deprecated please use CheckNameAvailability instead. |
> | Microsoft.Relay/checkNameAvailability/action | Checks availability of namespace under given subscription. |
> | Microsoft.Relay/register/action | Registers the subscription for the Relay resource provider and enables the creation of Relay resources |
> | Microsoft.Relay/unregister/action | Registers the subscription for the Relay resource provider and enables the creation of Relay resources |
> | Microsoft.Relay/namespaces/write | Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated. |
> | Microsoft.Relay/namespaces/read | Get the list of Namespace Resource Description |
> | Microsoft.Relay/namespaces/Delete | Delete Namespace Resource |
> | Microsoft.Relay/namespaces/authorizationRules/action | Updates Namespace Authorization Rule. This API is deprecated. Please use a PUT call to update the Namespace Authorization Rule instead.. This operation is not supported on API version 2017-04-01. |
> | Microsoft.Relay/namespaces/removeAcsNamepsace/action | Remove ACS namespace |
> | Microsoft.Relay/namespaces/authorizationRules/read | Get the list of Namespaces Authorization Rules description. |
> | Microsoft.Relay/namespaces/authorizationRules/write | Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Microsoft.Relay/namespaces/authorizationRules/delete | Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted.  |
> | Microsoft.Relay/namespaces/authorizationRules/listkeys/action | Get the Connection String to the Namespace |
> | Microsoft.Relay/namespaces/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Microsoft.Relay/namespaces/disasterrecoveryconfigs/checkNameAvailability/action | Checks availability of namespace alias under given subscription. |
> | Microsoft.Relay/namespaces/disasterRecoveryConfigs/write | Creates or Updates the Disaster Recovery configuration associated with the namespace. |
> | Microsoft.Relay/namespaces/disasterRecoveryConfigs/read | Gets the Disaster Recovery configuration associated with the namespace. |
> | Microsoft.Relay/namespaces/disasterRecoveryConfigs/delete | Deletes the Disaster Recovery configuration associated with the namespace. This operation can only be invoked via the primary namespace. |
> | Microsoft.Relay/namespaces/disasterRecoveryConfigs/breakPairing/action | Disables Disaster Recovery and stops replicating changes from primary to secondary namespaces. |
> | Microsoft.Relay/namespaces/disasterRecoveryConfigs/failover/action | Invokes a GEO DR failover and reconfigures the namespace alias to point to the secondary namespace. |
> | Microsoft.Relay/namespaces/disasterRecoveryConfigs/authorizationRules/read | Get Disaster Recovery Primary Namespace's Authorization Rules |
> | Microsoft.Relay/namespaces/disasterRecoveryConfigs/authorizationRules/listkeys/action | Gets the authorization rules keys for the Disaster Recovery primary namespace |
> | Microsoft.Relay/namespaces/HybridConnections/write | Create or Update HybridConnection properties. |
> | Microsoft.Relay/namespaces/HybridConnections/read | Get list of HybridConnection Resource Descriptions |
> | Microsoft.Relay/namespaces/HybridConnections/Delete | Operation to delete HybridConnection Resource |
> | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/action | Operation to update HybridConnection. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule. |
> | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/read |  Get the list of HybridConnection Authorization Rules |
> | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/write | Create HybridConnection Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated. |
> | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/delete | Operation to delete HybridConnection Authorization Rules |
> | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/listkeys/action | Get the Connection String to HybridConnection |
> | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/regeneratekeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Microsoft.Relay/namespaces/messagingPlan/read | Gets the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Microsoft.Relay/namespaces/messagingPlan/write | Updates the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Microsoft.Relay/namespaces/networkrulesets/read | Gets NetworkRuleSet Resource |
> | Microsoft.Relay/namespaces/networkrulesets/write | Create VNET Rule Resource |
> | Microsoft.Relay/namespaces/networkrulesets/delete | Delete VNET Rule Resource |
> | Microsoft.Relay/namespaces/operationresults/read | Get the status of Namespace operation |
> | Microsoft.Relay/namespaces/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxy |
> | Microsoft.Relay/namespaces/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.Relay/namespaces/privateEndpointConnectionProxies/write | Create Private Endpoint Connection Proxy |
> | Microsoft.Relay/namespaces/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxy |
> | Microsoft.Relay/namespaces/providers/Microsoft.Insights/diagnosticSettings/read | Get list of Namespace diagnostic settings Resource Descriptions |
> | Microsoft.Relay/namespaces/providers/Microsoft.Insights/diagnosticSettings/write | Get list of Namespace diagnostic settings Resource Descriptions |
> | Microsoft.Relay/namespaces/providers/Microsoft.Insights/logDefinitions/read | Get list of Namespace logs Resource Descriptions |
> | Microsoft.Relay/namespaces/providers/Microsoft.Insights/metricDefinitions/read | Get list of Namespace metrics Resource Descriptions |
> | Microsoft.Relay/namespaces/WcfRelays/write | Create or Update WcfRelay properties. |
> | Microsoft.Relay/namespaces/WcfRelays/read | Get list of WcfRelay Resource Descriptions |
> | Microsoft.Relay/namespaces/WcfRelays/Delete | Operation to delete WcfRelay Resource |
> | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/action | Operation to update WcfRelay. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule. |
> | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/read |  Get the list of WcfRelay Authorization Rules |
> | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/write | Create WcfRelay Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated. |
> | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/delete | Operation to delete WcfRelay Authorization Rules |
> | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/listkeys/action | Get the Connection String to WcfRelay |
> | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/regeneratekeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Microsoft.Relay/operations/read | Get Operations |

### Microsoft.ServiceBus

Azure service: [Service Bus](../service-bus/index.md)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ServiceBus/checkNamespaceAvailability/action | Checks availability of namespace under given subscription. This API is deprecated please use CheckNameAvailability instead. |
> | Microsoft.ServiceBus/checkNameAvailability/action | Checks availability of namespace under given subscription. |
> | Microsoft.ServiceBus/register/action | Registers the subscription for the ServiceBus resource provider and enables the creation of ServiceBus resources |
> | Microsoft.ServiceBus/unregister/action | Registers the subscription for the ServiceBus resource provider and enables the creation of ServiceBus resources |
> | Microsoft.ServiceBus/locations/deleteVirtualNetworkOrSubnets/action | Deletes the VNet rules in ServiceBus Resource Provider for the specified VNet |
> | Microsoft.ServiceBus/namespaces/write | Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated. |
> | Microsoft.ServiceBus/namespaces/read | Get the list of Namespace Resource Description |
> | Microsoft.ServiceBus/namespaces/Delete | Delete Namespace Resource |
> | Microsoft.ServiceBus/namespaces/authorizationRules/action | Updates Namespace Authorization Rule. This API is deprecated. Please use a PUT call to update the Namespace Authorization Rule instead.. This operation is not supported on API version 2017-04-01. |
> | Microsoft.ServiceBus/namespaces/migrate/action | Migrate namespace operation |
> | Microsoft.ServiceBus/namespaces/removeAcsNamepsace/action | Remove ACS namespace |
> | Microsoft.ServiceBus/namespaces/authorizationRules/write | Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Microsoft.ServiceBus/namespaces/authorizationRules/read | Get the list of Namespaces Authorization Rules description. |
> | Microsoft.ServiceBus/namespaces/authorizationRules/delete | Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted.  |
> | Microsoft.ServiceBus/namespaces/authorizationRules/listkeys/action | Get the Connection String to the Namespace |
> | Microsoft.ServiceBus/namespaces/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Microsoft.ServiceBus/namespaces/disasterrecoveryconfigs/checkNameAvailability/action | Checks availability of namespace alias under given subscription. |
> | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/write | Creates or Updates the Disaster Recovery configuration associated with the namespace. |
> | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/read | Gets the Disaster Recovery configuration associated with the namespace. |
> | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/delete | Deletes the Disaster Recovery configuration associated with the namespace. This operation can only be invoked via the primary namespace. |
> | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/breakPairing/action | Disables Disaster Recovery and stops replicating changes from primary to secondary namespaces. |
> | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/failover/action | Invokes a GEO DR failover and reconfigures the namespace alias to point to the secondary namespace. |
> | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/authorizationRules/read | Get Disaster Recovery Primary Namespace's Authorization Rules |
> | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/authorizationRules/listkeys/action | Gets the authorization rules keys for the Disaster Recovery primary namespace |
> | Microsoft.ServiceBus/namespaces/eventGridFilters/write | Creates or Updates the Event Grid filter associated with the namespace. |
> | Microsoft.ServiceBus/namespaces/eventGridFilters/read | Gets the Event Grid filter associated with the namespace. |
> | Microsoft.ServiceBus/namespaces/eventGridFilters/delete | Deletes the Event Grid filter associated with the namespace. |
> | Microsoft.ServiceBus/namespaces/eventhubs/read | Get list of EventHub Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/ipFilterRules/read | Get IP Filter Resource |
> | Microsoft.ServiceBus/namespaces/ipFilterRules/write | Create IP Filter Resource |
> | Microsoft.ServiceBus/namespaces/ipFilterRules/delete | Delete IP Filter Resource |
> | Microsoft.ServiceBus/namespaces/messagingPlan/read | Gets the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Microsoft.ServiceBus/namespaces/messagingPlan/write | Updates the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Microsoft.ServiceBus/namespaces/migrationConfigurations/write | Creates or Updates Migration configuration. This will start synchronizing resources from the standard to the premium namespace |
> | Microsoft.ServiceBus/namespaces/migrationConfigurations/read | Gets the Migration configuration which indicates the state of the migration and pending replication operations |
> | Microsoft.ServiceBus/namespaces/migrationConfigurations/delete | Deletes the Migration configuration. |
> | Microsoft.ServiceBus/namespaces/migrationConfigurations/revert/action | Reverts the standard to premium namespace migration |
> | Microsoft.ServiceBus/namespaces/migrationConfigurations/upgrade/action | Assigns the DNS associated with the standard namespace to the premium namespace which completes the migration and stops the syncing resources from standard to premium namespace |
> | Microsoft.ServiceBus/namespaces/networkruleset/read | Gets NetworkRuleSet Resource |
> | Microsoft.ServiceBus/namespaces/networkruleset/write | Create VNET Rule Resource |
> | Microsoft.ServiceBus/namespaces/networkruleset/delete | Delete VNET Rule Resource |
> | Microsoft.ServiceBus/namespaces/networkrulesets/read | Gets NetworkRuleSet Resource |
> | Microsoft.ServiceBus/namespaces/networkrulesets/write | Create VNET Rule Resource |
> | Microsoft.ServiceBus/namespaces/networkrulesets/delete | Delete VNET Rule Resource |
> | Microsoft.ServiceBus/namespaces/operationresults/read | Get the status of Namespace operation |
> | Microsoft.ServiceBus/namespaces/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxy |
> | Microsoft.ServiceBus/namespaces/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Microsoft.ServiceBus/namespaces/privateEndpointConnectionProxies/write | Create Private Endpoint Connection Proxy |
> | Microsoft.ServiceBus/namespaces/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxy |
> | Microsoft.ServiceBus/namespaces/providers/Microsoft.Insights/diagnosticSettings/read | Get list of Namespace diagnostic settings Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/providers/Microsoft.Insights/diagnosticSettings/write | Get list of Namespace diagnostic settings Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/providers/Microsoft.Insights/logDefinitions/read | Get list of Namespace logs Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/providers/Microsoft.Insights/metricDefinitions/read | Get list of Namespace metrics Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/queues/write | Create or Update Queue properties. |
> | Microsoft.ServiceBus/namespaces/queues/read | Get list of Queue Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/queues/Delete | Operation to delete Queue Resource |
> | Microsoft.ServiceBus/namespaces/queues/authorizationRules/action | Operation to update Queue. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule. |
> | Microsoft.ServiceBus/namespaces/queues/authorizationRules/write | Create Queue Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated. |
> | Microsoft.ServiceBus/namespaces/queues/authorizationRules/read |  Get the list of Queue Authorization Rules |
> | Microsoft.ServiceBus/namespaces/queues/authorizationRules/delete | Operation to delete Queue Authorization Rules |
> | Microsoft.ServiceBus/namespaces/queues/authorizationRules/listkeys/action | Get the Connection String to Queue |
> | Microsoft.ServiceBus/namespaces/queues/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Microsoft.ServiceBus/namespaces/topics/write | Create or Update Topic properties. |
> | Microsoft.ServiceBus/namespaces/topics/read | Get list of Topic Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/topics/Delete | Operation to delete Topic Resource |
> | Microsoft.ServiceBus/namespaces/topics/authorizationRules/action | Operation to update Topic. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule. |
> | Microsoft.ServiceBus/namespaces/topics/authorizationRules/write | Create Topic Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated. |
> | Microsoft.ServiceBus/namespaces/topics/authorizationRules/read |  Get the list of Topic Authorization Rules |
> | Microsoft.ServiceBus/namespaces/topics/authorizationRules/delete | Operation to delete Topic Authorization Rules |
> | Microsoft.ServiceBus/namespaces/topics/authorizationRules/listkeys/action | Get the Connection String to Topic |
> | Microsoft.ServiceBus/namespaces/topics/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Microsoft.ServiceBus/namespaces/topics/subscriptions/write | Create or Update TopicSubscription properties. |
> | Microsoft.ServiceBus/namespaces/topics/subscriptions/read | Get list of TopicSubscription Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/topics/subscriptions/Delete | Operation to delete TopicSubscription Resource |
> | Microsoft.ServiceBus/namespaces/topics/subscriptions/rules/write | Create or Update Rule properties. |
> | Microsoft.ServiceBus/namespaces/topics/subscriptions/rules/read | Get list of Rule Resource Descriptions |
> | Microsoft.ServiceBus/namespaces/topics/subscriptions/rules/Delete | Operation to delete Rule Resource |
> | Microsoft.ServiceBus/namespaces/virtualNetworkRules/read | Gets VNET Rule Resource |
> | Microsoft.ServiceBus/namespaces/virtualNetworkRules/write | Create VNET Rule Resource |
> | Microsoft.ServiceBus/namespaces/virtualNetworkRules/delete | Delete VNET Rule Resource |
> | Microsoft.ServiceBus/operations/read | Get Operations |
> | Microsoft.ServiceBus/sku/read | Get list of Sku Resource Descriptions |
> | Microsoft.ServiceBus/sku/regions/read | Get list of SkuRegions Resource Descriptions |
> | **DataAction** | **Description** |
> | Microsoft.ServiceBus/namespaces/messages/send/action | Send messages |
> | Microsoft.ServiceBus/namespaces/messages/receive/action | Receive messages |

## Identity

### Microsoft.AAD

Azure service: [Azure Active Directory Domain Services](../active-directory-domain-services/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AAD/unregister/action | Unregister Domain Service |
> | Microsoft.AAD/register/action | Register Domain Service |
> | Microsoft.AAD/domainServices/read | Read Domain Services |
> | Microsoft.AAD/domainServices/write | Write Domain Service |
> | Microsoft.AAD/domainServices/delete | Delete Domain Service |
> | Microsoft.AAD/domainServices/oucontainer/read | Read Ou Containers |
> | Microsoft.AAD/domainServices/oucontainer/write | Write Ou Container |
> | Microsoft.AAD/domainServices/oucontainer/delete | Delete Ou Container |
> | Microsoft.AAD/locations/operationresults/read |  |
> | Microsoft.AAD/Operations/read |  |

### microsoft.aadiam

Azure service: Azure Active Directory

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | microsoft.aadiam/diagnosticsettings/write | Writing a diagnostic setting |
> | microsoft.aadiam/diagnosticsettings/read | Reading a diagnostic setting |
> | microsoft.aadiam/diagnosticsettings/delete | Deleting a diagnostic setting |
> | microsoft.aadiam/diagnosticsettingscategories/read | Reading a diagnostic setting categories |
> | microsoft.aadiam/metricDefinitions/read | Reading Tenant-Level Metric Definitions |
> | microsoft.aadiam/metrics/read | Reading Tenant-Level Metrics |
> | microsoft.aadiam/privateLinkForAzureAD/read | Read Private Link Policy Definition |
> | microsoft.aadiam/privateLinkForAzureAD/write | Create and Update Private Link Policy Definition |
> | microsoft.aadiam/privateLinkForAzureAD/delete | Delete Private Link Policy Definition |
> | microsoft.aadiam/privateLinkForAzureAD/privateEndpointConnectionProxies/read | Read Private Link Proxies |
> | microsoft.aadiam/privateLinkForAzureAD/privateEndpointConnectionProxies/write | Create and Update Private Link Proxies |
> | microsoft.aadiam/privateLinkForAzureAD/privateEndpointConnectionProxies/delete | Delete Private Link Proxies |
> | microsoft.aadiam/privateLinkForAzureAD/privateEndpointConnectionProxies/validate/action | Validate Private Link Proxies |
> | microsoft.aadiam/privateLinkForAzureAD/privateEndpointConnections/read | Read PrivateEndpointConnections |
> | microsoft.aadiam/privateLinkForAzureAD/privateEndpointConnections/write | Create and Update PrivateEndpointConnections |
> | microsoft.aadiam/privateLinkForAzureAD/privateEndpointConnections/delete | Delete PrivateEndpointConnections |
> | microsoft.aadiam/privateLinkForAzureAD/privateLinkResources/read | Read PrivateLinkResources |
> | microsoft.aadiam/privateLinkForAzureAD/privateLinkResources/write | Create and Update PrivateLinkResources |
> | microsoft.aadiam/privateLinkForAzureAD/privateLinkResources/delete | Delete PrivateLinkResources |

### Microsoft.ADHybridHealthService

Azure service: [Azure Active Directory](../active-directory/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ADHybridHealthService/configuration/action | Updates Tenant Configuration. |
> | Microsoft.ADHybridHealthService/services/action | Updates a service instance in the tenant. |
> | Microsoft.ADHybridHealthService/addsservices/action | Create a new forest for the tenant. |
> | Microsoft.ADHybridHealthService/register/action | Registers the ADHybrid Health Service Resource Provider and enables the creation of ADHybrid Health Service resource. |
> | Microsoft.ADHybridHealthService/unregister/action | Unregisters the subscription for ADHybrid Health Service Resource Provider. |
> | Microsoft.ADHybridHealthService/addsservices/write | Creates or Updates the ADDomainService instance for the tenant. |
> | Microsoft.ADHybridHealthService/addsservices/servicemembers/action | Add a server instance to the service. |
> | Microsoft.ADHybridHealthService/addsservices/read | Gets Service details for the specified service name. |
> | Microsoft.ADHybridHealthService/addsservices/delete | Deletes a Service and it's servers along with Health data. |
> | Microsoft.ADHybridHealthService/addsservices/addomainservicemembers/read | Gets all servers for the specified service name. |
> | Microsoft.ADHybridHealthService/addsservices/alerts/read | Gets alerts details for the forest like alertid, alert raised date, alert last detected, alert description, last updated, alert level, alert state, alert troubleshooting links etc. . |
> | Microsoft.ADHybridHealthService/addsservices/configuration/read | Gets Service Configuration for the forest. Example- Forest Name, Functional Level, Domain Naming master FSMO role, Schema master FSMO role etc. |
> | Microsoft.ADHybridHealthService/addsservices/dimensions/read | Gets the domains and sites details for the forest. Example- health status, active alerts, resolved alerts, properties like Domain Functional Level, Forest, Infrastructure Master, PDC, RID master etc.  |
> | Microsoft.ADHybridHealthService/addsservices/features/userpreference/read | Gets the user preference setting for the forest.<br>Example- MetricCounterName like ldapsuccessfulbinds, ntlmauthentications, kerberosauthentications, addsinsightsagentprivatebytes, ldapsearches.<br>Settings for the UI Charts etc. |
> | Microsoft.ADHybridHealthService/addsservices/forestsummary/read | Gets forest summary for the given forest like forest name, number of domains under this forest, number of sites and sites details etc. |
> | Microsoft.ADHybridHealthService/addsservices/metricmetadata/read | Gets the list of supported metrics for a given service.<br>For example Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFS service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomainService.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for ADSync service. |
> | Microsoft.ADHybridHealthService/addsservices/metrics/groups/read | Given a service, this API gets the metrics information.<br>For example, this API can be used to get information related to: Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFederation service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomain Service.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for Sync Service. |
> | Microsoft.ADHybridHealthService/addsservices/premiumcheck/read | This API gets the list of all onboarded ADDomainServices for a premium tenant. |
> | Microsoft.ADHybridHealthService/addsservices/replicationdetails/read | Gets replication details for all the servers for the specified service name. |
> | Microsoft.ADHybridHealthService/addsservices/replicationstatus/read | Gets the number of domain controllers and their replication errors if any. |
> | Microsoft.ADHybridHealthService/addsservices/replicationsummary/read | Gets complete domain controller list along with replication details for the given forest. |
> | Microsoft.ADHybridHealthService/addsservices/servicemembers/delete | Deletes a server for a given service and tenant. |
> | Microsoft.ADHybridHealthService/addsservices/servicemembers/credentials/read | During server registration of ADDomainService, this api is called to get the credentials for onboarding new servers. |
> | Microsoft.ADHybridHealthService/configuration/write | Creates a Tenant Configuration. |
> | Microsoft.ADHybridHealthService/configuration/read | Reads the Tenant Configuration. |
> | Microsoft.ADHybridHealthService/logs/read | Gets agent installation and registration logs for the tenant. |
> | Microsoft.ADHybridHealthService/logs/contents/read | Gets the content of agent installation and registration logs stored in blob. |
> | Microsoft.ADHybridHealthService/operations/read | Gets list of operations supported by system. |
> | Microsoft.ADHybridHealthService/reports/availabledeployments/read | Gets list of available regions, used by DevOps to support customer incidents. |
> | Microsoft.ADHybridHealthService/reports/badpassword/read | Gets the list of bad password attempts for all the users in Active Directory Federation Service. |
> | Microsoft.ADHybridHealthService/reports/badpassworduseridipfrequency/read | Gets Blob SAS URI containing status and eventual result of newly enqueued report job for frequency of Bad Username/Password attempts per UserId per IPAddress per Day for a given Tenant. |
> | Microsoft.ADHybridHealthService/reports/consentedtodevopstenants/read | Gets the list of DevOps consented tenants. Typically used for customer support. |
> | Microsoft.ADHybridHealthService/reports/isdevops/read | Gets a value indicating whether the tenant is DevOps Consented or not. |
> | Microsoft.ADHybridHealthService/reports/selectdevopstenant/read | Updates userid(objectid) for the selected dev ops tenant. |
> | Microsoft.ADHybridHealthService/reports/selecteddeployment/read | Gets selected deployment for the given tenant. |
> | Microsoft.ADHybridHealthService/reports/tenantassigneddeployment/read | Given a tenant id gets the tenant storage location. |
> | Microsoft.ADHybridHealthService/reports/updateselecteddeployment/read | Gets the geo location from which data will be accessed. |
> | Microsoft.ADHybridHealthService/services/write | Creates a service instance in the tenant. |
> | Microsoft.ADHybridHealthService/services/read | Reads the service instances in the tenant. |
> | Microsoft.ADHybridHealthService/services/delete | Deletes a service instance in the tenant. |
> | Microsoft.ADHybridHealthService/services/servicemembers/action | Creates a server instance in the service. |
> | Microsoft.ADHybridHealthService/services/alerts/read | Reads the alerts for a service. |
> | Microsoft.ADHybridHealthService/services/alerts/read | Reads the alerts for a service. |
> | Microsoft.ADHybridHealthService/services/checkservicefeatureavailibility/read | Given a feature name verifies if a service has everything required to use that feature. |
> | Microsoft.ADHybridHealthService/services/exporterrors/read | Gets the export errors for a given sync service. |
> | Microsoft.ADHybridHealthService/services/exportstatus/read | Gets the export status for a given service. |
> | Microsoft.ADHybridHealthService/services/feedbacktype/feedback/read | Gets alerts feedback for a given service and server. |
> | Microsoft.ADHybridHealthService/services/ipAddressAggregates/read | Reads the bad IPs which attempted to access the service. |
> | Microsoft.ADHybridHealthService/services/ipAddressAggregateSettings/read | Reads alarm thresholds for bad IPs. |
> | Microsoft.ADHybridHealthService/services/ipAddressAggregateSettings/write | Writes alarm thresholds for bad IPs. |
> | Microsoft.ADHybridHealthService/services/metricmetadata/read | Gets the list of supported metrics for a given service.<br>For example Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFS service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomainService.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for ADSync service. |
> | Microsoft.ADHybridHealthService/services/metrics/groups/read | Given a service, this API gets the metrics information.<br>For example, this API can be used to get information related to: Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFederation service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomain Service.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for Sync Service. |
> | Microsoft.ADHybridHealthService/services/metrics/groups/average/read | Given a service, this API gets the average for metrics for a given service.<br>For example, this API can be used to get information related to: Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFederation service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomain Service.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for Sync Service. |
> | Microsoft.ADHybridHealthService/services/metrics/groups/sum/read | Given a service, this API gets the aggregated view for metrics for a given service.<br>For example, this API can be used to get information related to: Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFederation service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomain Service.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for Sync Service. |
> | Microsoft.ADHybridHealthService/services/monitoringconfiguration/write | Add or updates monitoring configuration for a service. |
> | Microsoft.ADHybridHealthService/services/monitoringconfigurations/read | Gets the monitoring configurations for a given service. |
> | Microsoft.ADHybridHealthService/services/monitoringconfigurations/write | Add or updates monitoring configurations for a service. |
> | Microsoft.ADHybridHealthService/services/premiumcheck/read | This API gets the list of all onboarded services for a premium tenant. |
> | Microsoft.ADHybridHealthService/services/reports/generateBlobUri/action | Generates Risky IP report and returns a URI pointing to it. |
> | Microsoft.ADHybridHealthService/services/reports/blobUris/read | Gets all Risky IP report URIs for the last 7 days. |
> | Microsoft.ADHybridHealthService/services/reports/details/read | Gets report of top 50 users with bad password errors from last 7 days |
> | Microsoft.ADHybridHealthService/services/servicemembers/read | Reads the server instance in the service. |
> | Microsoft.ADHybridHealthService/services/servicemembers/delete | Deletes a server instance in the service. |
> | Microsoft.ADHybridHealthService/services/servicemembers/alerts/read | Reads the alerts for a server. |
> | Microsoft.ADHybridHealthService/services/servicemembers/credentials/read | During server registration, this api is called to get the credentials for onboarding new servers. |
> | Microsoft.ADHybridHealthService/services/servicemembers/datafreshness/read | For a given server, this API gets a list of  datatypes that are being uploaded by the servers and the latest time for each upload. |
> | Microsoft.ADHybridHealthService/services/servicemembers/exportstatus/read | Gets the Sync Export Error details for a given Sync Service. |
> | Microsoft.ADHybridHealthService/services/servicemembers/metrics/read | Gets the list of connectors and run profile names for the given service and service member. |
> | Microsoft.ADHybridHealthService/services/servicemembers/metrics/groups/read | Given a service, this API gets the metrics information.<br>For example, this API can be used to get information related to: Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFederation service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomain Service.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for Sync Service. |
> | Microsoft.ADHybridHealthService/services/servicemembers/serviceconfiguration/read | Gets service configuration for a given tenant. |
> | Microsoft.ADHybridHealthService/services/tenantwhitelisting/read | Gets feature whitelisting status for a given tenant. |

### Microsoft.AzureActiveDirectory

Azure service: [Azure Active Directory B2C](../active-directory-b2c/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AzureActiveDirectory/register/action | Register subscription for Microsoft.AzureActiveDirectory resource provider |
> | Microsoft.AzureActiveDirectory/b2cDirectories/write | Create or update B2C Directory resource |
> | Microsoft.AzureActiveDirectory/b2cDirectories/read | View B2C Directory resource |
> | Microsoft.AzureActiveDirectory/b2cDirectories/delete | Delete B2C Directory resource |
> | Microsoft.AzureActiveDirectory/b2ctenants/read | Lists all B2C tenants where the user is a member |
> | Microsoft.AzureActiveDirectory/operations/read | Read all API operations available for Microsoft.AzureActiveDirectory resource provider |

### Microsoft.ManagedIdentity

Azure service: [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ManagedIdentity/register/action | Registers the subscription for the managed identity resource provider |
> | Microsoft.ManagedIdentity/identities/read | Gets an existing system assigned identity |
> | Microsoft.ManagedIdentity/operations/read | Lists operations available on Microsoft.ManagedIdentity resource provider |
> | Microsoft.ManagedIdentity/userAssignedIdentities/read | Gets an existing user assigned identity |
> | Microsoft.ManagedIdentity/userAssignedIdentities/write | Creates a new user assigned identity or updates the tags associated with an existing user assigned identity |
> | Microsoft.ManagedIdentity/userAssignedIdentities/delete | Deletes an existing user assigned identity |
> | Microsoft.ManagedIdentity/userAssignedIdentities/assign/action | RBAC action for assigning an existing user assigned identity to a resource |

## Security

### Microsoft.KeyVault

Azure service: [Key Vault](../key-vault/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.KeyVault/register/action | Registers a subscription |
> | Microsoft.KeyVault/unregister/action | Unregisters a subscription |
> | Microsoft.KeyVault/checkNameAvailability/read | Checks that a key vault name is valid and is not in use |
> | Microsoft.KeyVault/deletedVaults/read | View the properties of soft deleted key vaults |
> | Microsoft.KeyVault/hsmPools/read | View the properties of an HSM pool |
> | Microsoft.KeyVault/hsmPools/write | Create a new HSM pool of update the properties of an existing HSM pool |
> | Microsoft.KeyVault/hsmPools/delete | Delete an HSM pool |
> | Microsoft.KeyVault/hsmPools/joinVault/action | Join a key vault to an HSM pool |
> | Microsoft.KeyVault/locations/deleteVirtualNetworkOrSubnets/action | Notifies Microsoft.KeyVault that a virtual network or subnet is being deleted |
> | Microsoft.KeyVault/locations/deletedVaults/read | View the properties of a soft deleted key vault |
> | Microsoft.KeyVault/locations/deletedVaults/purge/action | Purge a soft deleted key vault |
> | Microsoft.KeyVault/locations/operationResults/read | Check the result of a long run operation |
> | Microsoft.KeyVault/operations/read | Lists operations available on Microsoft.KeyVault resource provider |
> | Microsoft.KeyVault/vaults/read | View the properties of a key vault |
> | Microsoft.KeyVault/vaults/write | Create a new key vault or update the properties of an existing key vault |
> | Microsoft.KeyVault/vaults/delete | Delete a key vault |
> | Microsoft.KeyVault/vaults/deploy/action | Enables access to secrets in a key vault when deploying Azure resources |
> | Microsoft.KeyVault/vaults/accessPolicies/write | Update an existing access policy by merging or replacing, or add a new access policy to a vault. |
> | Microsoft.KeyVault/vaults/eventGridFilters/read | Notifies Microsoft.KeyVault that an EventGrid Subscription for Key Vault is being viewed |
> | Microsoft.KeyVault/vaults/eventGridFilters/write | Notifies Microsoft.KeyVault that a new EventGrid Subscription for Key Vault is being created |
> | Microsoft.KeyVault/vaults/eventGridFilters/delete | Notifies Microsoft.KeyVault that an EventGrid Subscription for Key Vault is being deleted |
> | Microsoft.KeyVault/vaults/secrets/read | View the properties of a secret, but not its value. |
> | Microsoft.KeyVault/vaults/secrets/write | Create a new secret or update the value of an existing secret. |
> | **DataAction** | **Description** |
> | Microsoft.KeyVault/vaults/certificatecas/delete | Delete Certificate Issuser |
> | Microsoft.KeyVault/vaults/certificatecas/read | Read Certificate Issuser |
> | Microsoft.KeyVault/vaults/certificatecas/write | Write Certificate Issuser |
> | Microsoft.KeyVault/vaults/certificatecontacts/write | Manage Certificate Contact |
> | Microsoft.KeyVault/vaults/certificates/delete | Delete a certificate. |
> | Microsoft.KeyVault/vaults/certificates/read | List certificates in a specified key vault, or get information about a certificate. |
> | Microsoft.KeyVault/vaults/certificates/backup/action | Create the backup file of a certificate. The file can used to restore the certificate in a Key Vault of same subscription. Restrictions may apply. |
> | Microsoft.KeyVault/vaults/certificates/purge/action | Purges a certificate, making it unrecoverable. |
> | Microsoft.KeyVault/vaults/certificates/update/action | Updates the specified attributes associated with the given certificate. |
> | Microsoft.KeyVault/vaults/certificates/create/action | Creates a new certificate. |
> | Microsoft.KeyVault/vaults/certificates/import/action | Imports an existing valid certificate, containing a private key, into Azure Key Vault. The certificate to be imported can be in either PFX or PEM format. |
> | Microsoft.KeyVault/vaults/certificates/recover/action | Recovers the deleted certificate. The operation performs the reversal of the Delete operation. The operation is applicable in vaults enabled for soft-delete, and must be issued during the retention interval. |
> | Microsoft.KeyVault/vaults/certificates/restore/action | Restores a backed up certificate, and all its versions, to a vault. |
> | Microsoft.KeyVault/vaults/keys/read | List keys in the specified vault, or read properties and public material of a key.<br>For asymmetric keys, this operation exposes public key and includes ability to perform public key algorithms such as encrypt and verify signature.<br>Private keys and symmetric keys are never exposed. |
> | Microsoft.KeyVault/vaults/keys/update/action | Updates the specified attributes associated with the given key. |
> | Microsoft.KeyVault/vaults/keys/create/action | Creates a new key. |
> | Microsoft.KeyVault/vaults/keys/import/action | Imports an externally created key, stores it, and returns key parameters and attributes to the client. |
> | Microsoft.KeyVault/vaults/keys/recover/action | Recovers the deleted key. The operation performs the reversal of the Delete operation. The operation is applicable in vaults enabled for soft-delete, and must be issued during the retention interval. |
> | Microsoft.KeyVault/vaults/keys/restore/action | Restores a backed up key, and all its versions, to a vault. |
> | Microsoft.KeyVault/vaults/keys/delete | Delete a key. |
> | Microsoft.KeyVault/vaults/keys/backup/action | Create the backup file of a key. The file can used to restore the key in a Key Vault of same subscription. Restrictions may apply. |
> | Microsoft.KeyVault/vaults/keys/purge/action | Purges a key, making it unrecoverable. |
> | Microsoft.KeyVault/vaults/keys/encrypt/action | Encrypt plaintext with a key. Note that if the key is asymmetric, this operation can be performed by principals with read access. |
> | Microsoft.KeyVault/vaults/keys/decrypt/action | Decrypt ciphertext with a key. |
> | Microsoft.KeyVault/vaults/keys/wrap/action | Wrap a symmetric key with a Key Vault key. Note that if the Key Vault key is asymmetric, this operation can be performed with read access. |
> | Microsoft.KeyVault/vaults/keys/unwrap/action | Unwrap a symmetric key with a Key Vault key. |
> | Microsoft.KeyVault/vaults/keys/sign/action | Sign a hash with a key. |
> | Microsoft.KeyVault/vaults/keys/verify/action | Verify a hash. Note that if the key is asymmetric, this operation can be performed by principals with read access. |
> | Microsoft.KeyVault/vaults/secrets/delete | Delete a secret. |
> | Microsoft.KeyVault/vaults/secrets/backup/action | Create the backup file of a secret. The file can used to restore the secret in a Key Vault of same subscription. Restrictions may apply. |
> | Microsoft.KeyVault/vaults/secrets/purge/action | Purges a secret, making it unrecoverable. |
> | Microsoft.KeyVault/vaults/secrets/update/action | Updates the specified attributes associated with the given secret. |
> | Microsoft.KeyVault/vaults/secrets/recover/action | Recovers the deleted secret. The operation performs the reversal of the Delete operation. The operation is applicable in vaults enabled for soft-delete, and must be issued during the retention interval. |
> | Microsoft.KeyVault/vaults/secrets/restore/action | Restores a backed up secret, and all its versions, to a vault. |
> | Microsoft.KeyVault/vaults/secrets/readMetadata/action | List or view the properties of a secret, but not its value. |
> | Microsoft.KeyVault/vaults/secrets/getSecret/action | Get the value of a secret. |
> | Microsoft.KeyVault/vaults/secrets/setSecret/action | Create new secret. |

### Microsoft.Security

Azure service: [Security Center](../security-center/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Security/register/action | Registers the subscription for Azure Security Center |
> | Microsoft.Security/unregister/action | Unregisters the subscription from Azure Security Center |
> | Microsoft.Security/adaptiveNetworkHardenings/read | Gets Adaptive Network Hardening recommendations of an Azure protected resource |
> | Microsoft.Security/adaptiveNetworkHardenings/enforce/action | Enforces the given traffic hardening rules by creating matching security rules on the given Network Security Group(s) |
> | Microsoft.Security/advancedThreatProtectionSettings/read | Gets the Advanced Threat Protection Settings for the resource |
> | Microsoft.Security/advancedThreatProtectionSettings/write | Updates the Advanced Threat Protection Settings for the resource |
> | Microsoft.Security/alerts/read | Gets all available security alerts |
> | Microsoft.Security/applicationWhitelistings/read | Gets the application whitelistings |
> | Microsoft.Security/applicationWhitelistings/write | Creates a new application whitelisting or updates an existing one |
> | Microsoft.Security/assessmentMetadata/read | Get available security assessment metadata on your subscription |
> | Microsoft.Security/assessmentMetadata/write | Create or update a security assessment metadata |
> | Microsoft.Security/assessments/read | Get security assessments on your subscription |
> | Microsoft.Security/assessments/write | Create or update security assessments on your subscription |
> | Microsoft.Security/automations/read | Gets the automations for the scope |
> | Microsoft.Security/automations/write | Creates or updates the automation for the scope |
> | Microsoft.Security/automations/delete | Deletes the automation for the scope |
> | Microsoft.Security/automations/validate/action | Validates the automation model for the scope |
> | Microsoft.Security/autoProvisioningSettings/read | Get security auto provisioning setting for the subscription |
> | Microsoft.Security/autoProvisioningSettings/write | Create or update security auto provisioning setting for the subscription |
> | Microsoft.Security/complianceResults/read | Gets the compliance results for the resource |
> | Microsoft.Security/deviceSecurityGroups/write | Creates or updates IoT device security groups |
> | Microsoft.Security/deviceSecurityGroups/delete | Deletes IoT device security groups |
> | Microsoft.Security/deviceSecurityGroups/read | Gets IoT device security groups |
> | Microsoft.Security/informationProtectionPolicies/read | Gets the information protection policies for the resource |
> | Microsoft.Security/informationProtectionPolicies/write | Updates the information protection policies for the resource |
> | Microsoft.Security/iotSecuritySolutions/write | Creates or updates IoT security solutions |
> | Microsoft.Security/iotSecuritySolutions/delete | Deletes IoT security solutions |
> | Microsoft.Security/iotSecuritySolutions/read | Gets IoT security solutions |
> | Microsoft.Security/iotSecuritySolutions/analyticsModels/read | Gets IoT security analytics model |
> | Microsoft.Security/iotSecuritySolutions/analyticsModels/aggregatedAlerts/read | Gets IoT aggregated alerts |
> | Microsoft.Security/iotSecuritySolutions/analyticsModels/aggregatedAlerts/dismiss/action | Dismisses IoT aggregated alerts |
> | Microsoft.Security/iotSecuritySolutions/analyticsModels/aggregatedRecommendations/read | Gets IoT aggregated recommendations |
> | Microsoft.Security/locations/read | Gets the security data location |
> | Microsoft.Security/locations/alerts/read | Gets all available security alerts |
> | Microsoft.Security/locations/alerts/dismiss/action | Dismiss a security alert |
> | Microsoft.Security/locations/alerts/activate/action | Activate a security alert |
> | Microsoft.Security/locations/jitNetworkAccessPolicies/read | Gets the just-in-time network access policies |
> | Microsoft.Security/locations/jitNetworkAccessPolicies/write | Creates a new just-in-time network access policy or updates an existing one |
> | Microsoft.Security/locations/jitNetworkAccessPolicies/delete | Deletes the just-in-time network access policy |
> | Microsoft.Security/locations/jitNetworkAccessPolicies/initiate/action | Initiates a just-in-time network access policy request |
> | Microsoft.Security/locations/tasks/read | Gets all available security recommendations |
> | Microsoft.Security/locations/tasks/start/action | Start a security recommendation |
> | Microsoft.Security/locations/tasks/resolve/action | Resolve a security recommendation |
> | Microsoft.Security/locations/tasks/activate/action | Activate a security recommendation |
> | Microsoft.Security/locations/tasks/dismiss/action | Dismiss a security recommendation |
> | Microsoft.Security/policies/read | Gets the security policy |
> | Microsoft.Security/policies/write | Updates the security policy |
> | Microsoft.Security/pricings/read | Gets the pricing settings for the scope |
> | Microsoft.Security/pricings/write | Updates the pricing settings for the scope |
> | Microsoft.Security/pricings/delete | Deletes the pricing settings for the scope |
> | Microsoft.Security/securityContacts/read | Gets the security contact |
> | Microsoft.Security/securityContacts/write | Updates the security contact |
> | Microsoft.Security/securityContacts/delete | Deletes the security contact |
> | Microsoft.Security/securitySolutions/read | Gets the security solutions |
> | Microsoft.Security/securitySolutions/write | Creates a new security solution or updates an existing one |
> | Microsoft.Security/securitySolutions/delete | Deletes a security solution |
> | Microsoft.Security/securitySolutionsReferenceData/read | Gets the security solutions reference data |
> | Microsoft.Security/securityStatuses/read | Gets the security health statuses for Azure resources |
> | Microsoft.Security/securityStatusesSummaries/read | Gets the security statuses summaries for the scope |
> | Microsoft.Security/settings/read | Gets the settings for the scope |
> | Microsoft.Security/settings/write | Updates the settings for the scope |
> | Microsoft.Security/tasks/read | Gets all available security recommendations |
> | Microsoft.Security/webApplicationFirewalls/read | Gets the web application firewalls |
> | Microsoft.Security/webApplicationFirewalls/write | Creates a new web application firewall or updates an existing one |
> | Microsoft.Security/webApplicationFirewalls/delete | Deletes a web application firewall |
> | Microsoft.Security/workspaceSettings/read | Gets the workspace settings |
> | Microsoft.Security/workspaceSettings/write | Updates the workspace settings |
> | Microsoft.Security/workspaceSettings/delete | Deletes the workspace settings |
> | Microsoft.Security/workspaceSettings/connect/action | Change workspace settings reconnection settings |

### Microsoft.SecurityGraph

Azure service: Microsoft Monitoring Insights

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.SecurityGraph/diagnosticsettings/write | Writing a diagnostic setting |
> | Microsoft.SecurityGraph/diagnosticsettings/read | Reading a diagnostic setting |
> | Microsoft.SecurityGraph/diagnosticsettings/delete | Deleting a diagnostic setting |
> | Microsoft.SecurityGraph/diagnosticsettingscategories/read | Reading a diagnostic setting categories |

### Microsoft.SecurityInsights

Azure service: [Azure Sentinel](../sentinel/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.SecurityInsights/register/action | Registers the subscription to Azure Sentinel |
> | Microsoft.SecurityInsights/unregister/action | Unregisters the subscription from Azure Sentinel |
> | Microsoft.SecurityInsights/dataConnectorsCheckRequirements/action | Check user authorization and license |
> | Microsoft.SecurityInsights/Aggregations/read | Gets aggregated information |
> | Microsoft.SecurityInsights/alertRules/read | Gets the alert rules |
> | Microsoft.SecurityInsights/alertRules/write | Updates alert rules |
> | Microsoft.SecurityInsights/alertRules/delete | Deletes alert rules |
> | Microsoft.SecurityInsights/alertRules/actions/read | Gets the response actions of an alert rule |
> | Microsoft.SecurityInsights/alertRules/actions/write | Updates the response actions of an alert rule |
> | Microsoft.SecurityInsights/alertRules/actions/delete | Deletes the response actions of an alert rule |
> | Microsoft.SecurityInsights/Bookmarks/read | Gets bookmarks |
> | Microsoft.SecurityInsights/Bookmarks/write | Updates bookmarks |
> | Microsoft.SecurityInsights/Bookmarks/delete | Deletes bookmarks |
> | Microsoft.SecurityInsights/Bookmarks/expand/action | Gets related entities of an entity by a specific expansion |
> | Microsoft.SecurityInsights/cases/read | Gets a case |
> | Microsoft.SecurityInsights/cases/write | Updates a case |
> | Microsoft.SecurityInsights/cases/delete | Deletes a case |
> | Microsoft.SecurityInsights/cases/comments/read | Gets the case comments |
> | Microsoft.SecurityInsights/cases/comments/write | Creates the case comments |
> | Microsoft.SecurityInsights/cases/investigations/read | Gets the case investigations |
> | Microsoft.SecurityInsights/cases/investigations/write | Updates the metadata of a case |
> | Microsoft.SecurityInsights/dataConnectors/read | Gets the data connectors |
> | Microsoft.SecurityInsights/dataConnectors/write | Updates a data connector |
> | Microsoft.SecurityInsights/dataConnectors/delete | Deletes a data connector |
> | Microsoft.SecurityInsights/incidents/read | Gets an incident |
> | Microsoft.SecurityInsights/incidents/write | Updates an incident |
> | Microsoft.SecurityInsights/incidents/delete | Deletes an incident |
> | Microsoft.SecurityInsights/incidents/comments/read | Gets the incident comments |
> | Microsoft.SecurityInsights/incidents/comments/write | Creates a comment on the incident |
> | Microsoft.SecurityInsights/incidents/relations/read | Gets a relation between the incident and related resources |
> | Microsoft.SecurityInsights/incidents/relations/write | Updates a relation between the incident and related resources |
> | Microsoft.SecurityInsights/incidents/relations/delete | Deletes a relation between the incident and related resources |
> | Microsoft.SecurityInsights/settings/read | Gets settings |
> | Microsoft.SecurityInsights/settings/write | Updates settings |
> | Microsoft.SecurityInsights/threatintelligence/read | Gets Threat Intelligence |
> | Microsoft.SecurityInsights/threatintelligence/write | Updates Threat Intelligence |
> | Microsoft.SecurityInsights/threatintelligence/delete | Deletes Threat Intelligence |
> | Microsoft.SecurityInsights/threatintelligence/query/action | Query Threat Intelligence |
> | Microsoft.SecurityInsights/threatintelligence/metrics/action | Collect Threat Intelligence Metrics |
> | Microsoft.SecurityInsights/threatintelligence/bulkDelete/action | Bulk Delete Threat Intelligence |
> | Microsoft.SecurityInsights/threatintelligence/bulkTag/action | Bulk Tags Threat Intelligence |

## DevOps

### Microsoft.DevTestLab

Azure service: [Azure Lab Services](../lab-services/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DevTestLab/register/action | Registers the subscription |
> | Microsoft.DevTestLab/labCenters/delete | Delete lab centers. |
> | Microsoft.DevTestLab/labCenters/read | Read lab centers. |
> | Microsoft.DevTestLab/labCenters/write | Add or modify lab centers. |
> | Microsoft.DevTestLab/labs/delete | Delete labs. |
> | Microsoft.DevTestLab/labs/read | Read labs. |
> | Microsoft.DevTestLab/labs/write | Add or modify labs. |
> | Microsoft.DevTestLab/labs/ListVhds/action | List disk images available for custom image creation. |
> | Microsoft.DevTestLab/labs/GenerateUploadUri/action | Generate a URI for uploading custom disk images to a Lab. |
> | Microsoft.DevTestLab/labs/CreateEnvironment/action | Create virtual machines in a lab. |
> | Microsoft.DevTestLab/labs/ClaimAnyVm/action | Claim a random claimable virtual machine in the lab. |
> | Microsoft.DevTestLab/labs/ExportResourceUsage/action | Exports the lab resource usage into a storage account |
> | Microsoft.DevTestLab/labs/ImportVirtualMachine/action | Import a virtual machine into a different lab. |
> | Microsoft.DevTestLab/labs/EnsureCurrentUserProfile/action | Ensure the current user has a valid profile in the lab. |
> | Microsoft.DevTestLab/labs/artifactSources/delete | Delete artifact sources. |
> | Microsoft.DevTestLab/labs/artifactSources/read | Read artifact sources. |
> | Microsoft.DevTestLab/labs/artifactSources/write | Add or modify artifact sources. |
> | Microsoft.DevTestLab/labs/artifactSources/armTemplates/read | Read azure resource manager templates. |
> | Microsoft.DevTestLab/labs/artifactSources/artifacts/read | Read artifacts. |
> | Microsoft.DevTestLab/labs/artifactSources/artifacts/GenerateArmTemplate/action | Generates an Azure Resource Manager template for the given artifact, uploads the required files to a storage account, and validates the generated artifact. |
> | Microsoft.DevTestLab/labs/costs/read | Read costs. |
> | Microsoft.DevTestLab/labs/costs/write | Add or modify costs. |
> | Microsoft.DevTestLab/labs/customImages/delete | Delete custom images. |
> | Microsoft.DevTestLab/labs/customImages/read | Read custom images. |
> | Microsoft.DevTestLab/labs/customImages/write | Add or modify custom images. |
> | Microsoft.DevTestLab/labs/formulas/delete | Delete formulas. |
> | Microsoft.DevTestLab/labs/formulas/read | Read formulas. |
> | Microsoft.DevTestLab/labs/formulas/write | Add or modify formulas. |
> | Microsoft.DevTestLab/labs/galleryImages/read | Read gallery images. |
> | Microsoft.DevTestLab/labs/notificationChannels/delete | Delete notification channels. |
> | Microsoft.DevTestLab/labs/notificationChannels/read | Read notification channels. |
> | Microsoft.DevTestLab/labs/notificationChannels/write | Add or modify notification channels. |
> | Microsoft.DevTestLab/labs/notificationChannels/Notify/action | Send notification to provided channel. |
> | Microsoft.DevTestLab/labs/policySets/read | Read policy sets. |
> | Microsoft.DevTestLab/labs/policySets/EvaluatePolicies/action | Evaluates lab policy. |
> | Microsoft.DevTestLab/labs/policySets/policies/delete | Delete policies. |
> | Microsoft.DevTestLab/labs/policySets/policies/read | Read policies. |
> | Microsoft.DevTestLab/labs/policySets/policies/write | Add or modify policies. |
> | Microsoft.DevTestLab/labs/schedules/delete | Delete schedules. |
> | Microsoft.DevTestLab/labs/schedules/read | Read schedules. |
> | Microsoft.DevTestLab/labs/schedules/write | Add or modify schedules. |
> | Microsoft.DevTestLab/labs/schedules/Execute/action | Execute a schedule. |
> | Microsoft.DevTestLab/labs/schedules/ListApplicable/action | Lists all applicable schedules |
> | Microsoft.DevTestLab/labs/serviceRunners/delete | Delete service runners. |
> | Microsoft.DevTestLab/labs/serviceRunners/read | Read service runners. |
> | Microsoft.DevTestLab/labs/serviceRunners/write | Add or modify service runners. |
> | Microsoft.DevTestLab/labs/sharedGalleries/delete | Delete shared galleries. |
> | Microsoft.DevTestLab/labs/sharedGalleries/read | Read shared galleries. |
> | Microsoft.DevTestLab/labs/sharedGalleries/write | Add or modify shared galleries. |
> | Microsoft.DevTestLab/labs/sharedGalleries/sharedImages/delete | Delete shared images. |
> | Microsoft.DevTestLab/labs/sharedGalleries/sharedImages/read | Read shared images. |
> | Microsoft.DevTestLab/labs/sharedGalleries/sharedImages/write | Add or modify shared images. |
> | Microsoft.DevTestLab/labs/users/delete | Delete user profiles. |
> | Microsoft.DevTestLab/labs/users/read | Read user profiles. |
> | Microsoft.DevTestLab/labs/users/write | Add or modify user profiles. |
> | Microsoft.DevTestLab/labs/users/disks/delete | Delete disks. |
> | Microsoft.DevTestLab/labs/users/disks/read | Read disks. |
> | Microsoft.DevTestLab/labs/users/disks/write | Add or modify disks. |
> | Microsoft.DevTestLab/labs/users/disks/Attach/action | Attach and create the lease of the disk to the virtual machine. |
> | Microsoft.DevTestLab/labs/users/disks/Detach/action | Detach and break the lease of the disk attached to the virtual machine. |
> | Microsoft.DevTestLab/labs/users/environments/delete | Delete environments. |
> | Microsoft.DevTestLab/labs/users/environments/read | Read environments. |
> | Microsoft.DevTestLab/labs/users/environments/write | Add or modify environments. |
> | Microsoft.DevTestLab/labs/users/secrets/delete | Delete secrets. |
> | Microsoft.DevTestLab/labs/users/secrets/read | Read secrets. |
> | Microsoft.DevTestLab/labs/users/secrets/write | Add or modify secrets. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/delete | Delete service fabrics. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/read | Read service fabrics. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/write | Add or modify service fabrics. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/Start/action | Start a service fabric. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/Stop/action | Stop a service fabric |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/ListApplicableSchedules/action | Lists the applicable start/stop schedules, if any. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/schedules/delete | Delete schedules. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/schedules/read | Read schedules. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/schedules/write | Add or modify schedules. |
> | Microsoft.DevTestLab/labs/users/serviceFabrics/schedules/Execute/action | Execute a schedule. |
> | Microsoft.DevTestLab/labs/virtualMachines/delete | Delete virtual machines. |
> | Microsoft.DevTestLab/labs/virtualMachines/read | Read virtual machines. |
> | Microsoft.DevTestLab/labs/virtualMachines/write | Add or modify virtual machines. |
> | Microsoft.DevTestLab/labs/virtualMachines/AddDataDisk/action | Attach a new or existing data disk to virtual machine. |
> | Microsoft.DevTestLab/labs/virtualMachines/ApplyArtifacts/action | Apply artifacts to virtual machine. |
> | Microsoft.DevTestLab/labs/virtualMachines/Claim/action | Take ownership of an existing virtual machine |
> | Microsoft.DevTestLab/labs/virtualMachines/ClearArtifactResults/action | Clears the artifact results of the virtual machine. |
> | Microsoft.DevTestLab/labs/virtualMachines/DetachDataDisk/action | Detach the specified disk from the virtual machine. |
> | Microsoft.DevTestLab/labs/virtualMachines/GetRdpFileContents/action | Gets a string that represents the contents of the RDP file for the virtual machine |
> | Microsoft.DevTestLab/labs/virtualMachines/ListApplicableSchedules/action | Lists the applicable start/stop schedules, if any. |
> | Microsoft.DevTestLab/labs/virtualMachines/Redeploy/action | Redeploy a virtual machine |
> | Microsoft.DevTestLab/labs/virtualMachines/Resize/action | Resize Virtual Machine. |
> | Microsoft.DevTestLab/labs/virtualMachines/Restart/action | Restart a virtual machine. |
> | Microsoft.DevTestLab/labs/virtualMachines/Start/action | Start a virtual machine. |
> | Microsoft.DevTestLab/labs/virtualMachines/Stop/action | Stop a virtual machine |
> | Microsoft.DevTestLab/labs/virtualMachines/TransferDisks/action | Transfers all data disks attached to the virtual machine to be owned by the current user. |
> | Microsoft.DevTestLab/labs/virtualMachines/UnClaim/action | Release ownership of an existing virtual machine |
> | Microsoft.DevTestLab/labs/virtualMachines/schedules/delete | Delete schedules. |
> | Microsoft.DevTestLab/labs/virtualMachines/schedules/read | Read schedules. |
> | Microsoft.DevTestLab/labs/virtualMachines/schedules/write | Add or modify schedules. |
> | Microsoft.DevTestLab/labs/virtualMachines/schedules/Execute/action | Execute a schedule. |
> | Microsoft.DevTestLab/labs/virtualNetworks/delete | Delete virtual networks. |
> | Microsoft.DevTestLab/labs/virtualNetworks/read | Read virtual networks. |
> | Microsoft.DevTestLab/labs/virtualNetworks/write | Add or modify virtual networks. |
> | Microsoft.DevTestLab/labs/virtualNetworks/bastionHosts/delete | Delete bastionhosts. |
> | Microsoft.DevTestLab/labs/virtualNetworks/bastionHosts/read | Read bastionhosts. |
> | Microsoft.DevTestLab/labs/virtualNetworks/bastionHosts/write | Add or modify bastionhosts. |
> | Microsoft.DevTestLab/labs/vmPools/delete | Delete virtual machine pools. |
> | Microsoft.DevTestLab/labs/vmPools/read | Read virtual machine pools. |
> | Microsoft.DevTestLab/labs/vmPools/write | Add or modify virtual machine pools. |
> | Microsoft.DevTestLab/locations/operations/read | Read operations. |
> | Microsoft.DevTestLab/schedules/delete | Delete schedules. |
> | Microsoft.DevTestLab/schedules/read | Read schedules. |
> | Microsoft.DevTestLab/schedules/write | Add or modify schedules. |
> | Microsoft.DevTestLab/schedules/Execute/action | Execute a schedule. |
> | Microsoft.DevTestLab/schedules/Retarget/action | Updates a schedule's target resource Id. |

### Microsoft.LabServices

Azure service: [Azure Lab Services](../lab-services/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.LabServices/register/action | Registers the subscription |
> | Microsoft.LabServices/labAccounts/delete | Delete lab accounts. |
> | Microsoft.LabServices/labAccounts/read | Read lab accounts. |
> | Microsoft.LabServices/labAccounts/write | Add or modify lab accounts. |
> | Microsoft.LabServices/labAccounts/CreateLab/action | Create a lab in a lab account. |
> | Microsoft.LabServices/labAccounts/GetRegionalAvailability/action | Get regional availability information for each size category configured under a lab account |
> | Microsoft.LabServices/labAccounts/GetPricingAndAvailability/action | Get the pricing and availability of combinations of sizes, geographies, and operating systems for the lab account. |
> | Microsoft.LabServices/labAccounts/GetRestrictionsAndUsage/action | Get core restrictions and usage for this subscription |
> | Microsoft.LabServices/labAccounts/galleryImages/delete | Delete gallery images. |
> | Microsoft.LabServices/labAccounts/galleryImages/read | Read gallery images. |
> | Microsoft.LabServices/labAccounts/galleryImages/write | Add or modify gallery images. |
> | Microsoft.LabServices/labAccounts/labs/delete | Delete labs. |
> | Microsoft.LabServices/labAccounts/labs/read | Read labs. |
> | Microsoft.LabServices/labAccounts/labs/write | Add or modify labs. |
> | Microsoft.LabServices/labAccounts/labs/AddUsers/action | Add users to a lab |
> | Microsoft.LabServices/labAccounts/labs/SendEmail/action | Send email with registration link to the lab |
> | Microsoft.LabServices/labAccounts/labs/GetLabPricingAndAvailability/action | Get the pricing per lab unit for this lab and the availability which indicates if this lab can scale up. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/delete | Delete environment setting. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/read | Read environment setting. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/write | Add or modify environment setting. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/Publish/action | Provisions/deprovisions required resources for an environment setting based on current state of the lab/environment setting. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/Start/action | Starts a template by starting all resources inside the template. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/Stop/action | Stops a template by stopping all resources inside the template. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/SaveImage/action | Saves current template image to the shared gallery in the lab account |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/ResetPassword/action | Resets password on the template virtual machine. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/environments/delete | Delete environments. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/environments/read | Read environments. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/environments/Start/action | Starts an environment by starting all resources inside the environment. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/environments/Stop/action | Stops an environment by stopping all resources inside the environment |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/environments/ResetPassword/action | Resets the user password on an environment |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/schedules/delete | Delete schedules. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/schedules/read | Read schedules. |
> | Microsoft.LabServices/labAccounts/labs/environmentSettings/schedules/write | Add or modify schedules. |
> | Microsoft.LabServices/labAccounts/labs/users/delete | Delete users. |
> | Microsoft.LabServices/labAccounts/labs/users/read | Read users. |
> | Microsoft.LabServices/labAccounts/labs/users/write | Add or modify users. |
> | Microsoft.LabServices/labAccounts/sharedGalleries/delete | Delete sharedgalleries. |
> | Microsoft.LabServices/labAccounts/sharedGalleries/read | Read sharedgalleries. |
> | Microsoft.LabServices/labAccounts/sharedGalleries/write | Add or modify sharedgalleries. |
> | Microsoft.LabServices/labAccounts/sharedImages/delete | Delete sharedimages. |
> | Microsoft.LabServices/labAccounts/sharedImages/read | Read sharedimages. |
> | Microsoft.LabServices/labAccounts/sharedImages/write | Add or modify sharedimages. |
> | Microsoft.LabServices/locations/operations/read | Read operations. |
> | Microsoft.LabServices/users/Register/action | Register a user to a managed lab |
> | Microsoft.LabServices/users/ListAllEnvironments/action | List all Environments for the user |
> | Microsoft.LabServices/users/StartEnvironment/action | Starts an environment by starting all resources inside the environment. |
> | Microsoft.LabServices/users/StopEnvironment/action | Stops an environment by stopping all resources inside the environment |
> | Microsoft.LabServices/users/ResetPassword/action | Resets the user password on an environment |
> | Microsoft.LabServices/users/UserSettings/action | Updates and returns personal user settings. |

### Microsoft.VisualStudio

Azure service: [Azure DevOps](https://docs.microsoft.com/azure/devops/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.VisualStudio/Register/Action | Register Azure Subscription with Microsoft.VisualStudio provider |
> | Microsoft.VisualStudio/Account/Write | Set Account |
> | Microsoft.VisualStudio/Account/Delete | Delete Account |
> | Microsoft.VisualStudio/Account/Read | Read Account |
> | Microsoft.VisualStudio/Account/Extension/Read | Read Account/Extension |
> | Microsoft.VisualStudio/Account/Project/Read | Read Account/Project |
> | Microsoft.VisualStudio/Account/Project/Write | Set Account/Project |
> | Microsoft.VisualStudio/Extension/Write | Set Extension |
> | Microsoft.VisualStudio/Extension/Delete | Delete Extension |
> | Microsoft.VisualStudio/Extension/Read | Read Extension |
> | Microsoft.VisualStudio/Project/Write | Set Project |
> | Microsoft.VisualStudio/Project/Delete | Delete Project |
> | Microsoft.VisualStudio/Project/Read | Read Project |

## Migrate

### Microsoft.Migrate

Azure service: [Azure Migrate](../migrate/migrate-services-overview.md)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Migrate/register/action | Registers Subscription with Microsoft.Migrate resource provider |
> | Microsoft.Migrate/assessmentprojects/read | Gets the properties of assessment project |
> | Microsoft.Migrate/assessmentprojects/write | Creates a new assessment project or updates an existing assessment project |
> | Microsoft.Migrate/assessmentprojects/delete | Deletes the assessment project |
> | Microsoft.Migrate/assessmentprojects/assessmentOptions/read | Gets the assessment options which are available in the given location |
> | Microsoft.Migrate/assessmentprojects/assessments/read | Lists assessments within a project |
> | Microsoft.Migrate/assessmentprojects/groups/read | Get the properties of a group |
> | Microsoft.Migrate/assessmentprojects/groups/write | Creates a new group or updates an existing group |
> | Microsoft.Migrate/assessmentprojects/groups/delete | Deletes a group |
> | Microsoft.Migrate/assessmentprojects/groups/updateMachines/action | Update group by adding or removing machines |
> | Microsoft.Migrate/assessmentprojects/groups/assessments/read | Gets the properties of an assessment |
> | Microsoft.Migrate/assessmentprojects/groups/assessments/write | Creates a new assessment or updates an existing assessment |
> | Microsoft.Migrate/assessmentprojects/groups/assessments/delete | Deletes an assessment |
> | Microsoft.Migrate/assessmentprojects/groups/assessments/downloadurl/action | Downloads an assessment report's URL |
> | Microsoft.Migrate/assessmentprojects/groups/assessments/assessedmachines/read | Get the properties of an assessed machine |
> | Microsoft.Migrate/assessmentprojects/hypervcollectors/read | Gets the properties of HyperV collector |
> | Microsoft.Migrate/assessmentprojects/hypervcollectors/write | Creates a new HyperV collector or updates an existing HyperV collector |
> | Microsoft.Migrate/assessmentprojects/hypervcollectors/delete | Deletes the HyperV collector |
> | Microsoft.Migrate/assessmentprojects/importcollectors/read | Gets the properties of Import collector |
> | Microsoft.Migrate/assessmentprojects/importcollectors/write | Creates a new Import collector or updates an existing Import collector |
> | Microsoft.Migrate/assessmentprojects/importcollectors/delete | Deletes the Import collector |
> | Microsoft.Migrate/assessmentprojects/machines/read | Gets the properties of a machine |
> | Microsoft.Migrate/assessmentprojects/servercollectors/read | Gets the properties of Server collector |
> | Microsoft.Migrate/assessmentprojects/servercollectors/write | Creates a new Server collector or updates an existing Server collector |
> | Microsoft.Migrate/assessmentprojects/vmwarecollectors/read | Gets the properties of VMware collector |
> | Microsoft.Migrate/assessmentprojects/vmwarecollectors/write | Creates a new VMware collector or updates an existing VMware collector |
> | Microsoft.Migrate/assessmentprojects/vmwarecollectors/delete | Deletes the VMware collector |
> | Microsoft.Migrate/locations/checknameavailability/action | Checks availability of the resource name for the given subscription in the given location |
> | Microsoft.Migrate/locations/assessmentOptions/read | Gets the assessment options which are available in the given location |
> | Microsoft.Migrate/migrateprojects/read | Gets the properties of migrate project |
> | Microsoft.Migrate/migrateprojects/write | Creates a new migrate project or updates an existing migrate project |
> | Microsoft.Migrate/migrateprojects/delete | Deletes a migrate project |
> | Microsoft.Migrate/migrateprojects/registerTool/action | Registers tool to a migrate project |
> | Microsoft.Migrate/migrateprojects/RefreshSummary/action | Refreshes the migrate project summary |
> | Microsoft.Migrate/migrateprojects/DatabaseInstances/read | Gets the properties of a database instance |
> | Microsoft.Migrate/migrateprojects/Databases/read | Gets the properties of a database |
> | Microsoft.Migrate/migrateprojects/machines/read | Gets the properties of a machine |
> | Microsoft.Migrate/migrateprojects/MigrateEvents/read | Gets the properties of a migrate events. |
> | Microsoft.Migrate/migrateprojects/MigrateEvents/Delete | Deletes a migrate event |
> | Microsoft.Migrate/migrateprojects/solutions/read | Gets the properties of migrate project solution |
> | Microsoft.Migrate/migrateprojects/solutions/write | Creates a new migrate project solution or updates an existing migrate project solution |
> | Microsoft.Migrate/migrateprojects/solutions/Delete | Deletes a  migrate project solution |
> | Microsoft.Migrate/migrateprojects/solutions/getconfig/action | Gets the migrate project solution configuration |
> | Microsoft.Migrate/migrateprojects/solutions/cleanupData/action | Clean up the migrate project solution data |
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

### Microsoft.OffAzure

Azure service: [Azure Migrate](../migrate/migrate-services-overview.md)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.OffAzure/register/action | Registers Subscription with Microsoft.OffAzure resource provider |
> | Microsoft.OffAzure/register/action | Registers Subscription with Microsoft.OffAzure resource provider |
> | Microsoft.OffAzure/register/action | Registers Subscription with Microsoft.OffAzure resource provider |
> | Microsoft.OffAzure/register/action | Registers Subscription with Microsoft.OffAzure resource provider |
> | Microsoft.OffAzure/HyperVSites/read | Gets the properties of a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/write | Creates or updates the Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/delete | Deletes the Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/refresh/action | Refreshes the objects within a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/read | Gets the properties of a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/write | Creates or updates the Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/delete | Deletes the Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/refresh/action | Refreshes the objects within a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/read | Gets the properties of a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/write | Creates or updates the Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/delete | Deletes the Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/refresh/action | Refreshes the objects within a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/read | Gets the properties of a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/write | Creates or updates the Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/delete | Deletes the Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/refresh/action | Refreshes the objects within a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/clusters/read | Gets the properties of a Hyper-V cluster |
> | Microsoft.OffAzure/HyperVSites/clusters/write | Creates or updates the Hyper-V cluster |
> | Microsoft.OffAzure/HyperVSites/clusters/read | Gets the properties of a Hyper-V cluster |
> | Microsoft.OffAzure/HyperVSites/clusters/write | Creates or updates the Hyper-V cluster |
> | Microsoft.OffAzure/HyperVSites/clusters/read | Gets the properties of a Hyper-V cluster |
> | Microsoft.OffAzure/HyperVSites/clusters/write | Creates or updates the Hyper-V cluster |
> | Microsoft.OffAzure/HyperVSites/clusters/read | Gets the properties of a Hyper-V cluster |
> | Microsoft.OffAzure/HyperVSites/clusters/write | Creates or updates the Hyper-V cluster |
> | Microsoft.OffAzure/HyperVSites/healthsummary/read | Gets the health summary for Hyper-V resource |
> | Microsoft.OffAzure/HyperVSites/healthsummary/read | Gets the health summary for Hyper-V resource |
> | Microsoft.OffAzure/HyperVSites/healthsummary/read | Gets the health summary for Hyper-V resource |
> | Microsoft.OffAzure/HyperVSites/healthsummary/read | Gets the health summary for Hyper-V resource |
> | Microsoft.OffAzure/HyperVSites/hosts/read | Gets the properties of a Hyper-V host |
> | Microsoft.OffAzure/HyperVSites/hosts/write | Creates or updates the Hyper-V host |
> | Microsoft.OffAzure/HyperVSites/hosts/read | Gets the properties of a Hyper-V host |
> | Microsoft.OffAzure/HyperVSites/hosts/write | Creates or updates the Hyper-V host |
> | Microsoft.OffAzure/HyperVSites/hosts/read | Gets the properties of a Hyper-V host |
> | Microsoft.OffAzure/HyperVSites/hosts/write | Creates or updates the Hyper-V host |
> | Microsoft.OffAzure/HyperVSites/hosts/read | Gets the properties of a Hyper-V host |
> | Microsoft.OffAzure/HyperVSites/hosts/write | Creates or updates the Hyper-V host |
> | Microsoft.OffAzure/HyperVSites/jobs/read | Gets the properties of a Hyper-V jobs |
> | Microsoft.OffAzure/HyperVSites/jobs/read | Gets the properties of a Hyper-V jobs |
> | Microsoft.OffAzure/HyperVSites/jobs/read | Gets the properties of a Hyper-V jobs |
> | Microsoft.OffAzure/HyperVSites/jobs/read | Gets the properties of a Hyper-V jobs |
> | Microsoft.OffAzure/HyperVSites/machines/read | Gets the properties of a Hyper-V machines |
> | Microsoft.OffAzure/HyperVSites/machines/read | Gets the properties of a Hyper-V machines |
> | Microsoft.OffAzure/HyperVSites/machines/read | Gets the properties of a Hyper-V machines |
> | Microsoft.OffAzure/HyperVSites/machines/read | Gets the properties of a Hyper-V machines |
> | Microsoft.OffAzure/HyperVSites/operationsstatus/read | Gets the properties of a Hyper-V operation status |
> | Microsoft.OffAzure/HyperVSites/operationsstatus/read | Gets the properties of a Hyper-V operation status |
> | Microsoft.OffAzure/HyperVSites/operationsstatus/read | Gets the properties of a Hyper-V operation status |
> | Microsoft.OffAzure/HyperVSites/operationsstatus/read | Gets the properties of a Hyper-V operation status |
> | Microsoft.OffAzure/HyperVSites/runasaccounts/read | Gets the properties of a Hyper-V run as accounts |
> | Microsoft.OffAzure/HyperVSites/runasaccounts/read | Gets the properties of a Hyper-V run as accounts |
> | Microsoft.OffAzure/HyperVSites/runasaccounts/read | Gets the properties of a Hyper-V run as accounts |
> | Microsoft.OffAzure/HyperVSites/runasaccounts/read | Gets the properties of a Hyper-V run as accounts |
> | Microsoft.OffAzure/HyperVSites/summary/read | Gets the summary of a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/summary/read | Gets the summary of a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/summary/read | Gets the summary of a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/summary/read | Gets the summary of a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/usage/read | Gets the usages of a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/usage/read | Gets the usages of a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/usage/read | Gets the usages of a Hyper-V site |
> | Microsoft.OffAzure/HyperVSites/usage/read | Gets the usages of a Hyper-V site |
> | Microsoft.OffAzure/ImportSites/read | Gets the properties of a Import site |
> | Microsoft.OffAzure/ImportSites/write | Creates or updates the Import site |
> | Microsoft.OffAzure/ImportSites/delete | Deletes the Import site |
> | Microsoft.OffAzure/ImportSites/importuri/action | Gets the SAS uri for importing the machines CSV file. |
> | Microsoft.OffAzure/ImportSites/exporturi/action | Gets the SAS uri for exporting the machines CSV file. |
> | Microsoft.OffAzure/ImportSites/read | Gets the properties of a Import site |
> | Microsoft.OffAzure/ImportSites/write | Creates or updates the Import site |
> | Microsoft.OffAzure/ImportSites/delete | Deletes the Import site |
> | Microsoft.OffAzure/ImportSites/importuri/action | Gets the SAS uri for importing the machines CSV file. |
> | Microsoft.OffAzure/ImportSites/exporturi/action | Gets the SAS uri for exporting the machines CSV file. |
> | Microsoft.OffAzure/ImportSites/read | Gets the properties of a Import site |
> | Microsoft.OffAzure/ImportSites/write | Creates or updates the Import site |
> | Microsoft.OffAzure/ImportSites/delete | Deletes the Import site |
> | Microsoft.OffAzure/ImportSites/importuri/action | Gets the SAS uri for importing the machines CSV file. |
> | Microsoft.OffAzure/ImportSites/exporturi/action | Gets the SAS uri for exporting the machines CSV file. |
> | Microsoft.OffAzure/ImportSites/read | Gets the properties of a Import site |
> | Microsoft.OffAzure/ImportSites/write | Creates or updates the Import site |
> | Microsoft.OffAzure/ImportSites/delete | Deletes the Import site |
> | Microsoft.OffAzure/ImportSites/importuri/action | Gets the SAS uri for importing the machines CSV file. |
> | Microsoft.OffAzure/ImportSites/exporturi/action | Gets the SAS uri for exporting the machines CSV file. |
> | Microsoft.OffAzure/ImportSites/jobs/read | Gets the properties of a Import jobs |
> | Microsoft.OffAzure/ImportSites/jobs/read | Gets the properties of a Import jobs |
> | Microsoft.OffAzure/ImportSites/jobs/read | Gets the properties of a Import jobs |
> | Microsoft.OffAzure/ImportSites/jobs/read | Gets the properties of a Import jobs |
> | Microsoft.OffAzure/ImportSites/machines/read | Gets the properties of a Import machines |
> | Microsoft.OffAzure/ImportSites/machines/delete | Deletes the Import machine |
> | Microsoft.OffAzure/ImportSites/machines/read | Gets the properties of a Import machines |
> | Microsoft.OffAzure/ImportSites/machines/delete | Deletes the Import machine |
> | Microsoft.OffAzure/ImportSites/machines/read | Gets the properties of a Import machines |
> | Microsoft.OffAzure/ImportSites/machines/delete | Deletes the Import machine |
> | Microsoft.OffAzure/ImportSites/machines/read | Gets the properties of a Import machines |
> | Microsoft.OffAzure/ImportSites/machines/delete | Deletes the Import machine |
> | Microsoft.OffAzure/Operations/read | Reads the exposed operations |
> | Microsoft.OffAzure/ServerSites/read | Gets the properties of a Server site |
> | Microsoft.OffAzure/ServerSites/write | Creates or updates the Server site |
> | Microsoft.OffAzure/ServerSites/delete | Deletes the Server site |
> | Microsoft.OffAzure/ServerSites/refresh/action | Refreshes the objects within a Server site |
> | Microsoft.OffAzure/ServerSites/read | Gets the properties of a Server site |
> | Microsoft.OffAzure/ServerSites/write | Creates or updates the Server site |
> | Microsoft.OffAzure/ServerSites/delete | Deletes the Server site |
> | Microsoft.OffAzure/ServerSites/refresh/action | Refreshes the objects within a Server site |
> | Microsoft.OffAzure/ServerSites/read | Gets the properties of a Server site |
> | Microsoft.OffAzure/ServerSites/write | Creates or updates the Server site |
> | Microsoft.OffAzure/ServerSites/delete | Deletes the Server site |
> | Microsoft.OffAzure/ServerSites/refresh/action | Refreshes the objects within a Server site |
> | Microsoft.OffAzure/ServerSites/read | Gets the properties of a Server site |
> | Microsoft.OffAzure/ServerSites/write | Creates or updates the Server site |
> | Microsoft.OffAzure/ServerSites/delete | Deletes the Server site |
> | Microsoft.OffAzure/ServerSites/refresh/action | Refreshes the objects within a Server site |
> | Microsoft.OffAzure/ServerSites/jobs/read | Gets the properties of a Server jobs |
> | Microsoft.OffAzure/ServerSites/jobs/read | Gets the properties of a Server jobs |
> | Microsoft.OffAzure/ServerSites/jobs/read | Gets the properties of a Server jobs |
> | Microsoft.OffAzure/ServerSites/jobs/read | Gets the properties of a Server jobs |
> | Microsoft.OffAzure/ServerSites/machines/read | Gets the properties of a Server machines |
> | Microsoft.OffAzure/ServerSites/machines/write | Write the properties of a Server machines |
> | Microsoft.OffAzure/ServerSites/machines/read | Gets the properties of a Server machines |
> | Microsoft.OffAzure/ServerSites/machines/write | Write the properties of a Server machines |
> | Microsoft.OffAzure/ServerSites/machines/read | Gets the properties of a Server machines |
> | Microsoft.OffAzure/ServerSites/machines/write | Write the properties of a Server machines |
> | Microsoft.OffAzure/ServerSites/machines/read | Gets the properties of a Server machines |
> | Microsoft.OffAzure/ServerSites/machines/write | Write the properties of a Server machines |
> | Microsoft.OffAzure/ServerSites/operationsstatus/read | Gets the properties of a Server operation status |
> | Microsoft.OffAzure/ServerSites/operationsstatus/read | Gets the properties of a Server operation status |
> | Microsoft.OffAzure/ServerSites/operationsstatus/read | Gets the properties of a Server operation status |
> | Microsoft.OffAzure/ServerSites/operationsstatus/read | Gets the properties of a Server operation status |
> | Microsoft.OffAzure/ServerSites/runasaccounts/read | Gets the properties of a Server run as accounts |
> | Microsoft.OffAzure/ServerSites/runasaccounts/read | Gets the properties of a Server run as accounts |
> | Microsoft.OffAzure/ServerSites/runasaccounts/read | Gets the properties of a Server run as accounts |
> | Microsoft.OffAzure/ServerSites/runasaccounts/read | Gets the properties of a Server run as accounts |
> | Microsoft.OffAzure/ServerSites/summary/read | Gets the summary of a Server site |
> | Microsoft.OffAzure/ServerSites/summary/read | Gets the summary of a Server site |
> | Microsoft.OffAzure/ServerSites/summary/read | Gets the summary of a Server site |
> | Microsoft.OffAzure/ServerSites/summary/read | Gets the summary of a Server site |
> | Microsoft.OffAzure/ServerSites/usage/read | Gets the usages of a Server site |
> | Microsoft.OffAzure/ServerSites/usage/read | Gets the usages of a Server site |
> | Microsoft.OffAzure/ServerSites/usage/read | Gets the usages of a Server site |
> | Microsoft.OffAzure/ServerSites/usage/read | Gets the usages of a Server site |
> | Microsoft.OffAzure/VMwareSites/read | Gets the properties of a VMware site |
> | Microsoft.OffAzure/VMwareSites/write | Creates or updates the VMware site |
> | Microsoft.OffAzure/VMwareSites/delete | Deletes the VMware site |
> | Microsoft.OffAzure/VMwareSites/refresh/action | Refreshes the objects within a VMware site |
> | Microsoft.OffAzure/VMwareSites/exportapplications/action | Exports the VMware applications and roles data into xls |
> | Microsoft.OffAzure/VMwareSites/updateProperties/action | Updates the properties for machines in a site |
> | Microsoft.OffAzure/VMwareSites/generateCoarseMap/action | Generates the coarse map for the list of machines |
> | Microsoft.OffAzure/VMwareSites/generateDetailedMap/action | Generates the Detailed VMware Coarse Map |
> | Microsoft.OffAzure/VMwareSites/clientGroupMembers/action | Lists the client group members for the selected client group. |
> | Microsoft.OffAzure/VMwareSites/serverGroupMembers/action | Lists the server group members for the selected server group. |
> | Microsoft.OffAzure/VMwareSites/getApplications/action | Gets the list application information for the selected machines |
> | Microsoft.OffAzure/VMwareSites/read | Gets the properties of a VMware site |
> | Microsoft.OffAzure/VMwareSites/write | Creates or updates the VMware site |
> | Microsoft.OffAzure/VMwareSites/delete | Deletes the VMware site |
> | Microsoft.OffAzure/VMwareSites/refresh/action | Refreshes the objects within a VMware site |
> | Microsoft.OffAzure/VMwareSites/exportapplications/action | Exports the VMware applications and roles data into xls |
> | Microsoft.OffAzure/VMwareSites/updateProperties/action | Updates the properties for machines in a site |
> | Microsoft.OffAzure/VMwareSites/generateCoarseMap/action | Generates the coarse map for the list of machines |
> | Microsoft.OffAzure/VMwareSites/generateDetailedMap/action | Generates the Detailed VMware Coarse Map |
> | Microsoft.OffAzure/VMwareSites/clientGroupMembers/action | Lists the client group members for the selected client group. |
> | Microsoft.OffAzure/VMwareSites/serverGroupMembers/action | Lists the server group members for the selected server group. |
> | Microsoft.OffAzure/VMwareSites/getApplications/action | Gets the list application information for the selected machines |
> | Microsoft.OffAzure/VMwareSites/read | Gets the properties of a VMware site |
> | Microsoft.OffAzure/VMwareSites/write | Creates or updates the VMware site |
> | Microsoft.OffAzure/VMwareSites/delete | Deletes the VMware site |
> | Microsoft.OffAzure/VMwareSites/refresh/action | Refreshes the objects within a VMware site |
> | Microsoft.OffAzure/VMwareSites/exportapplications/action | Exports the VMware applications and roles data into xls |
> | Microsoft.OffAzure/VMwareSites/updateProperties/action | Updates the properties for machines in a site |
> | Microsoft.OffAzure/VMwareSites/generateCoarseMap/action | Generates the coarse map for the list of machines |
> | Microsoft.OffAzure/VMwareSites/generateDetailedMap/action | Generates the Detailed VMware Coarse Map |
> | Microsoft.OffAzure/VMwareSites/clientGroupMembers/action | Lists the client group members for the selected client group. |
> | Microsoft.OffAzure/VMwareSites/serverGroupMembers/action | Lists the server group members for the selected server group. |
> | Microsoft.OffAzure/VMwareSites/getApplications/action | Gets the list application information for the selected machines |
> | Microsoft.OffAzure/VMwareSites/read | Gets the properties of a VMware site |
> | Microsoft.OffAzure/VMwareSites/write | Creates or updates the VMware site |
> | Microsoft.OffAzure/VMwareSites/delete | Deletes the VMware site |
> | Microsoft.OffAzure/VMwareSites/refresh/action | Refreshes the objects within a VMware site |
> | Microsoft.OffAzure/VMwareSites/exportapplications/action | Exports the VMware applications and roles data into xls |
> | Microsoft.OffAzure/VMwareSites/updateProperties/action | Updates the properties for machines in a site |
> | Microsoft.OffAzure/VMwareSites/generateCoarseMap/action | Generates the coarse map for the list of machines |
> | Microsoft.OffAzure/VMwareSites/generateDetailedMap/action | Generates the Detailed VMware Coarse Map |
> | Microsoft.OffAzure/VMwareSites/clientGroupMembers/action | Lists the client group members for the selected client group. |
> | Microsoft.OffAzure/VMwareSites/serverGroupMembers/action | Lists the server group members for the selected server group. |
> | Microsoft.OffAzure/VMwareSites/getApplications/action | Gets the list application information for the selected machines |
> | Microsoft.OffAzure/VMwareSites/healthsummary/read | Gets the health summary for VMware resource |
> | Microsoft.OffAzure/VMwareSites/healthsummary/read | Gets the health summary for VMware resource |
> | Microsoft.OffAzure/VMwareSites/healthsummary/read | Gets the health summary for VMware resource |
> | Microsoft.OffAzure/VMwareSites/healthsummary/read | Gets the health summary for VMware resource |
> | Microsoft.OffAzure/VMwareSites/jobs/read | Gets the properties of a VMware jobs |
> | Microsoft.OffAzure/VMwareSites/jobs/read | Gets the properties of a VMware jobs |
> | Microsoft.OffAzure/VMwareSites/jobs/read | Gets the properties of a VMware jobs |
> | Microsoft.OffAzure/VMwareSites/jobs/read | Gets the properties of a VMware jobs |
> | Microsoft.OffAzure/VMwareSites/machines/read | Gets the properties of a VMware machines |
> | Microsoft.OffAzure/VMwareSites/machines/stop/action | Stops the VMware machines |
> | Microsoft.OffAzure/VMwareSites/machines/start/action | Start VMware machines |
> | Microsoft.OffAzure/VMwareSites/machines/read | Gets the properties of a VMware machines |
> | Microsoft.OffAzure/VMwareSites/machines/stop/action | Stops the VMware machines |
> | Microsoft.OffAzure/VMwareSites/machines/start/action | Start VMware machines |
> | Microsoft.OffAzure/VMwareSites/machines/read | Gets the properties of a VMware machines |
> | Microsoft.OffAzure/VMwareSites/machines/stop/action | Stops the VMware machines |
> | Microsoft.OffAzure/VMwareSites/machines/start/action | Start VMware machines |
> | Microsoft.OffAzure/VMwareSites/machines/read | Gets the properties of a VMware machines |
> | Microsoft.OffAzure/VMwareSites/machines/stop/action | Stops the VMware machines |
> | Microsoft.OffAzure/VMwareSites/machines/start/action | Start VMware machines |
> | Microsoft.OffAzure/VMwareSites/machines/applications/read | Gets the properties of a VMware machines applications |
> | Microsoft.OffAzure/VMwareSites/machines/applications/read | Gets the properties of a VMware machines applications |
> | Microsoft.OffAzure/VMwareSites/machines/applications/read | Gets the properties of a VMware machines applications |
> | Microsoft.OffAzure/VMwareSites/machines/applications/read | Gets the properties of a VMware machines applications |
> | Microsoft.OffAzure/VMwareSites/operationsstatus/read | Gets the properties of a VMware operation status |
> | Microsoft.OffAzure/VMwareSites/operationsstatus/read | Gets the properties of a VMware operation status |
> | Microsoft.OffAzure/VMwareSites/operationsstatus/read | Gets the properties of a VMware operation status |
> | Microsoft.OffAzure/VMwareSites/operationsstatus/read | Gets the properties of a VMware operation status |
> | Microsoft.OffAzure/VMwareSites/runasaccounts/read | Gets the properties of a VMware run as accounts |
> | Microsoft.OffAzure/VMwareSites/runasaccounts/read | Gets the properties of a VMware run as accounts |
> | Microsoft.OffAzure/VMwareSites/runasaccounts/read | Gets the properties of a VMware run as accounts |
> | Microsoft.OffAzure/VMwareSites/runasaccounts/read | Gets the properties of a VMware run as accounts |
> | Microsoft.OffAzure/VMwareSites/summary/read | Gets the summary of a VMware site |
> | Microsoft.OffAzure/VMwareSites/summary/read | Gets the summary of a VMware site |
> | Microsoft.OffAzure/VMwareSites/summary/read | Gets the summary of a VMware site |
> | Microsoft.OffAzure/VMwareSites/summary/read | Gets the summary of a VMware site |
> | Microsoft.OffAzure/VMwareSites/usage/read | Gets the usages of a VMware site |
> | Microsoft.OffAzure/VMwareSites/usage/read | Gets the usages of a VMware site |
> | Microsoft.OffAzure/VMwareSites/usage/read | Gets the usages of a VMware site |
> | Microsoft.OffAzure/VMwareSites/usage/read | Gets the usages of a VMware site |
> | Microsoft.OffAzure/VMwareSites/vcenters/read | Gets the properties of a VMware vCenter |
> | Microsoft.OffAzure/VMwareSites/vcenters/write | Creates or updates the VMware vCenter |
> | Microsoft.OffAzure/VMwareSites/vcenters/read | Gets the properties of a VMware vCenter |
> | Microsoft.OffAzure/VMwareSites/vcenters/write | Creates or updates the VMware vCenter |
> | Microsoft.OffAzure/VMwareSites/vcenters/read | Gets the properties of a VMware vCenter |
> | Microsoft.OffAzure/VMwareSites/vcenters/write | Creates or updates the VMware vCenter |
> | Microsoft.OffAzure/VMwareSites/vcenters/read | Gets the properties of a VMware vCenter |
> | Microsoft.OffAzure/VMwareSites/vcenters/write | Creates or updates the VMware vCenter |

## Monitor

### Microsoft.AlertsManagement

Azure service: [Azure Monitor](../azure-monitor/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AlertsManagement/register/action | Registers the subscription for the Microsoft Alerts Management |
> | Microsoft.AlertsManagement/actionRules/read | Get all the action rules for the input filters. |
> | Microsoft.AlertsManagement/actionRules/write | Create or update action rule in a given subscription |
> | Microsoft.AlertsManagement/actionRules/delete | Delete action rule in a given subscription. |
> | Microsoft.AlertsManagement/alerts/read | Get all the alerts for the input filters. |
> | Microsoft.AlertsManagement/alerts/changestate/action | Change the state of the alert. |
> | Microsoft.AlertsManagement/alerts/diagnostics/read | Get all diagnostics for the alert |
> | Microsoft.AlertsManagement/alerts/history/read | Get history of the alert |
> | Microsoft.AlertsManagement/alertsList/read | Get all the alerts for the input filters across subscriptions |
> | Microsoft.AlertsManagement/alertsMetaData/read | Get alerts meta data for the input parameter. |
> | Microsoft.AlertsManagement/alertsSummary/read | Get the summary of alerts |
> | Microsoft.AlertsManagement/alertsSummaryList/read | Get the summary of alerts across subscriptions |
> | Microsoft.AlertsManagement/Operations/read | Reads the operations provided |
> | Microsoft.AlertsManagement/smartDetectorAlertRules/write | Create or update Smart Detector alert rule in a given subscription |
> | Microsoft.AlertsManagement/smartDetectorAlertRules/read | Get all the Smart Detector alert rules for the input filters |
> | Microsoft.AlertsManagement/smartDetectorAlertRules/delete | Delete Smart Detector alert rule in a given subscription |
> | Microsoft.AlertsManagement/smartGroups/read | Get all the smart groups for the input filters |
> | Microsoft.AlertsManagement/smartGroups/changestate/action | Change the state of the smart group |
> | Microsoft.AlertsManagement/smartGroups/history/read | Get history of the smart group |

### Microsoft.Insights

Azure service: [Azure Monitor](../azure-monitor/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Insights/Metrics/Action | Metric Action |
> | Microsoft.Insights/Register/Action | Register the Microsoft Insights provider |
> | Microsoft.Insights/Unregister/Action | Register the Microsoft Insights provider |
> | Microsoft.Insights/ListMigrationDate/Action | Get back Subscription migration date |
> | Microsoft.Insights/MigrateToNewpricingModel/Action | Migrate subscription to new pricing model |
> | Microsoft.Insights/RollbackToLegacyPricingModel/Action | Rollback subscription to legacy pricing model |
> | Microsoft.Insights/ActionGroups/Write | Create or update an action group |
> | Microsoft.Insights/ActionGroups/Delete | Delete an action group |
> | Microsoft.Insights/ActionGroups/Read | Read an action group |
> | Microsoft.Insights/ActivityLogAlerts/Write | Create or update an activity log alert |
> | Microsoft.Insights/ActivityLogAlerts/Delete | Delete an activity log alert |
> | Microsoft.Insights/ActivityLogAlerts/Read | Read an activity log alert |
> | Microsoft.Insights/ActivityLogAlerts/Activated/Action | Activity Log Alert activated |
> | Microsoft.Insights/AlertRules/Write | Create or update a classic metric alert |
> | Microsoft.Insights/AlertRules/Delete | Delete a classic metric alert |
> | Microsoft.Insights/AlertRules/Read | Read a classic metric alert |
> | Microsoft.Insights/AlertRules/Activated/Action | Classic metric alert activated |
> | Microsoft.Insights/AlertRules/Resolved/Action | Classic metric alert resolved |
> | Microsoft.Insights/AlertRules/Throttled/Action | Classic metric alert rule throttled |
> | Microsoft.Insights/AlertRules/Incidents/Read | Read a classic metric alert incident |
> | Microsoft.Insights/AutoscaleSettings/Write | Create or update an autoscale setting |
> | Microsoft.Insights/AutoscaleSettings/Delete | Delete an autoscale setting |
> | Microsoft.Insights/AutoscaleSettings/Read | Read an autoscale setting |
> | Microsoft.Insights/AutoscaleSettings/Scaleup/Action | Autoscale scale up initiated |
> | Microsoft.Insights/AutoscaleSettings/Scaledown/Action | Autoscale scale down initiated |
> | Microsoft.Insights/AutoscaleSettings/ScaleupResult/Action | Autoscale scale up completed |
> | Microsoft.Insights/AutoscaleSettings/ScaledownResult/Action | Autoscale scale down completed |
> | Microsoft.Insights/AutoscaleSettings/providers/Microsoft.Insights/diagnosticSettings/Read | Read a resource diagnostic setting |
> | Microsoft.Insights/AutoscaleSettings/providers/Microsoft.Insights/diagnosticSettings/Write | Create or update a resource diagnostic setting |
> | Microsoft.Insights/AutoscaleSettings/providers/Microsoft.Insights/logDefinitions/Read | Read log definitions |
> | Microsoft.Insights/AutoscaleSettings/providers/Microsoft.Insights/MetricDefinitions/Read | Read metric definitions |
> | Microsoft.Insights/Baseline/Read | Read a metric baseline (preview) |
> | Microsoft.Insights/CalculateBaseline/Read | Calculate baseline for metric values (preview) |
> | Microsoft.Insights/Components/AnalyticsTables/Action | Application Insights analytics table action |
> | Microsoft.Insights/Components/ApiKeys/Action | Generating an Application Insights API key |
> | Microsoft.Insights/Components/Purge/Action | Purging data from Application Insights |
> | Microsoft.Insights/Components/DailyCapReached/Action | Reached the daily cap for Application Insights component |
> | Microsoft.Insights/Components/DailyCapWarningThresholdReached/Action | Reached the daily cap warning threshold for Application Insights component |
> | Microsoft.Insights/Components/Write | Writing to an application insights component configuration |
> | Microsoft.Insights/Components/Delete | Deleting an application insights component configuration |
> | Microsoft.Insights/Components/Read | Reading an application insights component configuration |
> | Microsoft.Insights/Components/ExportConfiguration/Action | Application Insights export settings action |
> | Microsoft.Insights/Components/Move/Action | Move an Application Insights Component to another resource group or subscription |
> | Microsoft.Insights/Components/AnalyticsItems/Delete | Deleting an Application Insights analytics item |
> | Microsoft.Insights/Components/AnalyticsItems/Read | Reading an Application Insights analytics item |
> | Microsoft.Insights/Components/AnalyticsItems/Write | Writing an Application Insights analytics item |
> | Microsoft.Insights/Components/AnalyticsTables/Delete | Deleting an Application Insights analytics table schema |
> | Microsoft.Insights/Components/AnalyticsTables/Read | Reading an Application Insights analytics table schema |
> | Microsoft.Insights/Components/AnalyticsTables/Write | Writing an Application Insights analytics table schema |
> | Microsoft.Insights/Components/Annotations/Delete | Deleting an Application Insights annotation |
> | Microsoft.Insights/Components/Annotations/Read | Reading an Application Insights annotation |
> | Microsoft.Insights/Components/Annotations/Write | Writing an Application Insights annotation |
> | Microsoft.Insights/Components/Api/Read | Reading Application Insights component data API |
> | Microsoft.Insights/Components/ApiKeys/Delete | Deleting an Application Insights API key |
> | Microsoft.Insights/Components/ApiKeys/Read | Reading an Application Insights API key |
> | Microsoft.Insights/Components/BillingPlanForComponent/Read | Reading a billing plan for Application Insights component |
> | Microsoft.Insights/Components/CurrentBillingFeatures/Read | Reading current billing features for Application Insights component |
> | Microsoft.Insights/Components/CurrentBillingFeatures/Write | Writing current billing features for Application Insights component |
> | Microsoft.Insights/Components/DefaultWorkItemConfig/Read | Reading an Application Insights default ALM integration configuration |
> | Microsoft.Insights/Components/Events/Read | Get logs from Application Insights using OData query format |
> | Microsoft.Insights/Components/ExportConfiguration/Delete | Deleting Application Insights export settings |
> | Microsoft.Insights/Components/ExportConfiguration/Read | Reading Application Insights export settings |
> | Microsoft.Insights/Components/ExportConfiguration/Write | Writing Application Insights export settings |
> | Microsoft.Insights/Components/ExtendQueries/Read | Reading Application Insights component extended query results |
> | Microsoft.Insights/Components/Favorites/Delete | Deleting an Application Insights favorite |
> | Microsoft.Insights/Components/Favorites/Read | Reading an Application Insights favorite |
> | Microsoft.Insights/Components/Favorites/Write | Writing an Application Insights favorite |
> | Microsoft.Insights/Components/FeatureCapabilities/Read | Reading Application Insights component feature capabilities |
> | Microsoft.Insights/Components/GetAvailableBillingFeatures/Read | Reading Application Insights component available billing features |
> | Microsoft.Insights/Components/GetToken/Read | Reading an Application Insights component token |
> | Microsoft.Insights/Components/MetricDefinitions/Read | Reading Application Insights component metric definitions |
> | Microsoft.Insights/Components/Metrics/Read | Reading Application Insights component metrics |
> | Microsoft.Insights/Components/MyAnalyticsItems/Delete | Deleting an Application Insights personal analytics item |
> | Microsoft.Insights/Components/MyAnalyticsItems/Write | Writing an Application Insights personal analytics item |
> | Microsoft.Insights/Components/MyAnalyticsItems/Read | Reading an Application Insights personal analytics item |
> | Microsoft.Insights/Components/MyFavorites/Read | Reading an Application Insights personal favorite |
> | Microsoft.Insights/Components/Operations/Read | Get status of long-running operations in Application Insights |
> | Microsoft.Insights/Components/PricingPlans/Read | Reading an Application Insights component pricing plan |
> | Microsoft.Insights/Components/PricingPlans/Write | Writing an Application Insights component pricing plan |
> | Microsoft.Insights/Components/ProactiveDetectionConfigs/Read | Reading Application Insights proactive detection configuration |
> | Microsoft.Insights/Components/ProactiveDetectionConfigs/Write | Writing Application Insights proactive detection configuration |
> | Microsoft.Insights/Components/providers/Microsoft.Insights/diagnosticSettings/Read | Read a resource diagnostic setting |
> | Microsoft.Insights/Components/providers/Microsoft.Insights/diagnosticSettings/Write | Create or update a resource diagnostic setting |
> | Microsoft.Insights/Components/providers/Microsoft.Insights/logDefinitions/Read | Read log definitions |
> | Microsoft.Insights/Components/providers/Microsoft.Insights/MetricDefinitions/Read | Read metric definitions |
> | Microsoft.Insights/Components/Query/Read | Run queries against Application Insights logs |
> | Microsoft.Insights/Components/QuotaStatus/Read | Reading Application Insights component quota status |
> | Microsoft.Insights/Components/SyntheticMonitorLocations/Read | Reading Application Insights webtest locations |
> | Microsoft.Insights/Components/Webtests/Read | Reading a webtest configuration |
> | Microsoft.Insights/Components/WorkItemConfigs/Delete | Deleting an Application Insights ALM integration configuration |
> | Microsoft.Insights/Components/WorkItemConfigs/Read | Reading an Application Insights ALM integration configuration |
> | Microsoft.Insights/Components/WorkItemConfigs/Write | Writing an Application Insights ALM integration configuration |
> | Microsoft.Insights/DataCollectionRuleAssociations/Read | Read a resource's association with a data collection rule |
> | Microsoft.Insights/DataCollectionRuleAssociations/Write | Create or update a resource's association with a data collection rule |
> | Microsoft.Insights/DataCollectionRuleAssociations/Delete | Delete a resource's association with a data collection rule |
> | Microsoft.Insights/DataCollectionRules/Read | Read a data collection rule |
> | Microsoft.Insights/DataCollectionRules/Write | Create or update a data collection rule |
> | Microsoft.Insights/DataCollectionRules/Delete | Delete a data collection rule |
> | Microsoft.Insights/DiagnosticSettings/Write | Create or update a resource diagnostic setting |
> | Microsoft.Insights/DiagnosticSettings/Delete | Delete a resource diagnostic setting |
> | Microsoft.Insights/DiagnosticSettings/Read | Read a resource diagnostic setting |
> | Microsoft.Insights/EventCategories/Read | Read available Activity Log event categories |
> | Microsoft.Insights/eventtypes/digestevents/Read | Read management event type digest |
> | Microsoft.Insights/eventtypes/values/Read | Read Activity Log events |
> | Microsoft.Insights/ExtendedDiagnosticSettings/Write | Create or update a network flow log diagnostic setting |
> | Microsoft.Insights/ExtendedDiagnosticSettings/Delete | Delete a network flow log diagnostic setting |
> | Microsoft.Insights/ExtendedDiagnosticSettings/Read | Read a network flow log diagnostic setting |
> | Microsoft.Insights/ListMigrationDate/Read | Get back subscription migration date |
> | Microsoft.Insights/LogDefinitions/Read | Read log definitions |
> | Microsoft.Insights/LogProfiles/Write | Create or update an Activity Log log profile |
> | Microsoft.Insights/LogProfiles/Delete | Delete an Activity Log log profile |
> | Microsoft.Insights/LogProfiles/Read | Read an Activity Log log profile |
> | Microsoft.Insights/Logs/Read | Reading data from all your logs |
> | Microsoft.Insights/Logs/ADAssessmentRecommendation/Read | Read data from the ADAssessmentRecommendation table |
> | Microsoft.Insights/Logs/ADReplicationResult/Read | Read data from the ADReplicationResult table |
> | Microsoft.Insights/Logs/ADSecurityAssessmentRecommendation/Read | Read data from the ADSecurityAssessmentRecommendation table |
> | Microsoft.Insights/Logs/Alert/Read | Read data from the Alert table |
> | Microsoft.Insights/Logs/AlertHistory/Read | Read data from the AlertHistory table |
> | Microsoft.Insights/Logs/ApplicationInsights/Read | Read data from the ApplicationInsights table |
> | Microsoft.Insights/Logs/AzureActivity/Read | Read data from the AzureActivity table |
> | Microsoft.Insights/Logs/AzureMetrics/Read | Read data from the AzureMetrics table |
> | Microsoft.Insights/Logs/BoundPort/Read | Read data from the BoundPort table |
> | Microsoft.Insights/Logs/CommonSecurityLog/Read | Read data from the CommonSecurityLog table |
> | Microsoft.Insights/Logs/ComputerGroup/Read | Read data from the ComputerGroup table |
> | Microsoft.Insights/Logs/ConfigurationChange/Read | Read data from the ConfigurationChange table |
> | Microsoft.Insights/Logs/ConfigurationData/Read | Read data from the ConfigurationData table |
> | Microsoft.Insights/Logs/ContainerImageInventory/Read | Read data from the ContainerImageInventory table |
> | Microsoft.Insights/Logs/ContainerInventory/Read | Read data from the ContainerInventory table |
> | Microsoft.Insights/Logs/ContainerLog/Read | Read data from the ContainerLog table |
> | Microsoft.Insights/Logs/ContainerServiceLog/Read | Read data from the ContainerServiceLog table |
> | Microsoft.Insights/Logs/DeviceAppCrash/Read | Read data from the DeviceAppCrash table |
> | Microsoft.Insights/Logs/DeviceAppLaunch/Read | Read data from the DeviceAppLaunch table |
> | Microsoft.Insights/Logs/DeviceCalendar/Read | Read data from the DeviceCalendar table |
> | Microsoft.Insights/Logs/DeviceCleanup/Read | Read data from the DeviceCleanup table |
> | Microsoft.Insights/Logs/DeviceConnectSession/Read | Read data from the DeviceConnectSession table |
> | Microsoft.Insights/Logs/DeviceEtw/Read | Read data from the DeviceEtw table |
> | Microsoft.Insights/Logs/DeviceHardwareHealth/Read | Read data from the DeviceHardwareHealth table |
> | Microsoft.Insights/Logs/DeviceHealth/Read | Read data from the DeviceHealth table |
> | Microsoft.Insights/Logs/DeviceHeartbeat/Read | Read data from the DeviceHeartbeat table |
> | Microsoft.Insights/Logs/DeviceSkypeHeartbeat/Read | Read data from the DeviceSkypeHeartbeat table |
> | Microsoft.Insights/Logs/DeviceSkypeSignIn/Read | Read data from the DeviceSkypeSignIn table |
> | Microsoft.Insights/Logs/DeviceSleepState/Read | Read data from the DeviceSleepState table |
> | Microsoft.Insights/Logs/DHAppFailure/Read | Read data from the DHAppFailure table |
> | Microsoft.Insights/Logs/DHAppReliability/Read | Read data from the DHAppReliability table |
> | Microsoft.Insights/Logs/DHDriverReliability/Read | Read data from the DHDriverReliability table |
> | Microsoft.Insights/Logs/DHLogonFailures/Read | Read data from the DHLogonFailures table |
> | Microsoft.Insights/Logs/DHLogonMetrics/Read | Read data from the DHLogonMetrics table |
> | Microsoft.Insights/Logs/DHOSCrashData/Read | Read data from the DHOSCrashData table |
> | Microsoft.Insights/Logs/DHOSReliability/Read | Read data from the DHOSReliability table |
> | Microsoft.Insights/Logs/DHWipAppLearning/Read | Read data from the DHWipAppLearning table |
> | Microsoft.Insights/Logs/DnsEvents/Read | Read data from the DnsEvents table |
> | Microsoft.Insights/Logs/DnsInventory/Read | Read data from the DnsInventory table |
> | Microsoft.Insights/Logs/ETWEvent/Read | Read data from the ETWEvent table |
> | Microsoft.Insights/Logs/Event/Read | Read data from the Event table |
> | Microsoft.Insights/Logs/ExchangeAssessmentRecommendation/Read | Read data from the ExchangeAssessmentRecommendation table |
> | Microsoft.Insights/Logs/ExchangeOnlineAssessmentRecommendation/Read | Read data from the ExchangeOnlineAssessmentRecommendation table |
> | Microsoft.Insights/Logs/Heartbeat/Read | Read data from the Heartbeat table |
> | Microsoft.Insights/Logs/IISAssessmentRecommendation/Read | Read data from the IISAssessmentRecommendation table |
> | Microsoft.Insights/Logs/InboundConnection/Read | Read data from the InboundConnection table |
> | Microsoft.Insights/Logs/KubeNodeInventory/Read | Read data from the KubeNodeInventory table |
> | Microsoft.Insights/Logs/KubePodInventory/Read | Read data from the KubePodInventory table |
> | Microsoft.Insights/Logs/LinuxAuditLog/Read | Read data from the LinuxAuditLog table |
> | Microsoft.Insights/Logs/MAApplication/Read | Read data from the MAApplication table |
> | Microsoft.Insights/Logs/MAApplicationHealth/Read | Read data from the MAApplicationHealth table |
> | Microsoft.Insights/Logs/MAApplicationHealthAlternativeVersions/Read | Read data from the MAApplicationHealthAlternativeVersions table |
> | Microsoft.Insights/Logs/MAApplicationHealthIssues/Read | Read data from the MAApplicationHealthIssues table |
> | Microsoft.Insights/Logs/MAApplicationInstance/Read | Read data from the MAApplicationInstance table |
> | Microsoft.Insights/Logs/MAApplicationInstanceReadiness/Read | Read data from the MAApplicationInstanceReadiness table |
> | Microsoft.Insights/Logs/MAApplicationReadiness/Read | Read data from the MAApplicationReadiness table |
> | Microsoft.Insights/Logs/MADeploymentPlan/Read | Read data from the MADeploymentPlan table |
> | Microsoft.Insights/Logs/MADevice/Read | Read data from the MADevice table |
> | Microsoft.Insights/Logs/MADevicePnPHealth/Read | Read data from the MADevicePnPHealth table |
> | Microsoft.Insights/Logs/MADevicePnPHealthAlternativeVersions/Read | Read data from the MADevicePnPHealthAlternativeVersions table |
> | Microsoft.Insights/Logs/MADevicePnPHealthIssues/Read | Read data from the MADevicePnPHealthIssues table |
> | Microsoft.Insights/Logs/MADeviceReadiness/Read | Read data from the MADeviceReadiness table |
> | Microsoft.Insights/Logs/MADriverInstanceReadiness/Read | Read data from the MADriverInstanceReadiness table |
> | Microsoft.Insights/Logs/MADriverReadiness/Read | Read data from the MADriverReadiness table |
> | Microsoft.Insights/Logs/MAOfficeAddin/Read | Read data from the MAOfficeAddin table |
> | Microsoft.Insights/Logs/MAOfficeAddinHealth/Read | Read data from the MAOfficeAddinHealth table |
> | Microsoft.Insights/Logs/MAOfficeAddinHealthIssues/Read | Read data from the MAOfficeAddinHealthIssues table |
> | Microsoft.Insights/Logs/MAOfficeAddinInstance/Read | Read data from the MAOfficeAddinInstance table |
> | Microsoft.Insights/Logs/MAOfficeAddinInstanceReadiness/Read | Read data from the MAOfficeAddinInstanceReadiness table |
> | Microsoft.Insights/Logs/MAOfficeAddinReadiness/Read | Read data from the MAOfficeAddinReadiness table |
> | Microsoft.Insights/Logs/MAOfficeApp/Read | Read data from the MAOfficeApp table |
> | Microsoft.Insights/Logs/MAOfficeAppHealth/Read | Read data from the MAOfficeAppHealth table |
> | Microsoft.Insights/Logs/MAOfficeAppInstance/Read | Read data from the MAOfficeAppInstance table |
> | Microsoft.Insights/Logs/MAOfficeAppReadiness/Read | Read data from the MAOfficeAppReadiness table |
> | Microsoft.Insights/Logs/MAOfficeBuildInfo/Read | Read data from the MAOfficeBuildInfo table |
> | Microsoft.Insights/Logs/MAOfficeCurrencyAssessment/Read | Read data from the MAOfficeCurrencyAssessment table |
> | Microsoft.Insights/Logs/MAOfficeCurrencyAssessmentDailyCounts/Read | Read data from the MAOfficeCurrencyAssessmentDailyCounts table |
> | Microsoft.Insights/Logs/MAOfficeDeploymentStatus/Read | Read data from the MAOfficeDeploymentStatus table |
> | Microsoft.Insights/Logs/MAOfficeMacroHealth/Read | Read data from the MAOfficeMacroHealth table |
> | Microsoft.Insights/Logs/MAOfficeMacroHealthIssues/Read | Read data from the MAOfficeMacroHealthIssues table |
> | Microsoft.Insights/Logs/MAOfficeMacroIssueInstanceReadiness/Read | Read data from the MAOfficeMacroIssueInstanceReadiness table |
> | Microsoft.Insights/Logs/MAOfficeMacroIssueReadiness/Read | Read data from the MAOfficeMacroIssueReadiness table |
> | Microsoft.Insights/Logs/MAOfficeMacroSummary/Read | Read data from the MAOfficeMacroSummary table |
> | Microsoft.Insights/Logs/MAOfficeSuite/Read | Read data from the MAOfficeSuite table |
> | Microsoft.Insights/Logs/MAOfficeSuiteInstance/Read | Read data from the MAOfficeSuiteInstance table |
> | Microsoft.Insights/Logs/MAProposedPilotDevices/Read | Read data from the MAProposedPilotDevices table |
> | Microsoft.Insights/Logs/MAWindowsBuildInfo/Read | Read data from the MAWindowsBuildInfo table |
> | Microsoft.Insights/Logs/MAWindowsCurrencyAssessment/Read | Read data from the MAWindowsCurrencyAssessment table |
> | Microsoft.Insights/Logs/MAWindowsCurrencyAssessmentDailyCounts/Read | Read data from the MAWindowsCurrencyAssessmentDailyCounts table |
> | Microsoft.Insights/Logs/MAWindowsDeploymentStatus/Read | Read data from the MAWindowsDeploymentStatus table |
> | Microsoft.Insights/Logs/MAWindowsSysReqInstanceReadiness/Read | Read data from the MAWindowsSysReqInstanceReadiness table |
> | Microsoft.Insights/Logs/NetworkMonitoring/Read | Read data from the NetworkMonitoring table |
> | Microsoft.Insights/Logs/OfficeActivity/Read | Read data from the OfficeActivity table |
> | Microsoft.Insights/Logs/Operation/Read | Read data from the Operation table |
> | Microsoft.Insights/Logs/OutboundConnection/Read | Read data from the OutboundConnection table |
> | Microsoft.Insights/Logs/Perf/Read | Read data from the Perf table |
> | Microsoft.Insights/Logs/ProtectionStatus/Read | Read data from the ProtectionStatus table |
> | Microsoft.Insights/Logs/ReservedAzureCommonFields/Read | Read data from the ReservedAzureCommonFields table |
> | Microsoft.Insights/Logs/ReservedCommonFields/Read | Read data from the ReservedCommonFields table |
> | Microsoft.Insights/Logs/SCCMAssessmentRecommendation/Read | Read data from the SCCMAssessmentRecommendation table |
> | Microsoft.Insights/Logs/SCOMAssessmentRecommendation/Read | Read data from the SCOMAssessmentRecommendation table |
> | Microsoft.Insights/Logs/SecurityAlert/Read | Read data from the SecurityAlert table |
> | Microsoft.Insights/Logs/SecurityBaseline/Read | Read data from the SecurityBaseline table |
> | Microsoft.Insights/Logs/SecurityBaselineSummary/Read | Read data from the SecurityBaselineSummary table |
> | Microsoft.Insights/Logs/SecurityDetection/Read | Read data from the SecurityDetection table |
> | Microsoft.Insights/Logs/SecurityEvent/Read | Read data from the SecurityEvent table |
> | Microsoft.Insights/Logs/ServiceFabricOperationalEvent/Read | Read data from the ServiceFabricOperationalEvent table |
> | Microsoft.Insights/Logs/ServiceFabricReliableActorEvent/Read | Read data from the ServiceFabricReliableActorEvent table |
> | Microsoft.Insights/Logs/ServiceFabricReliableServiceEvent/Read | Read data from the ServiceFabricReliableServiceEvent table |
> | Microsoft.Insights/Logs/SfBAssessmentRecommendation/Read | Read data from the SfBAssessmentRecommendation table |
> | Microsoft.Insights/Logs/SfBOnlineAssessmentRecommendation/Read | Read data from the SfBOnlineAssessmentRecommendation table |
> | Microsoft.Insights/Logs/SharePointOnlineAssessmentRecommendation/Read | Read data from the SharePointOnlineAssessmentRecommendation table |
> | Microsoft.Insights/Logs/SPAssessmentRecommendation/Read | Read data from the SPAssessmentRecommendation table |
> | Microsoft.Insights/Logs/SQLAssessmentRecommendation/Read | Read data from the SQLAssessmentRecommendation table |
> | Microsoft.Insights/Logs/SQLQueryPerformance/Read | Read data from the SQLQueryPerformance table |
> | Microsoft.Insights/Logs/Syslog/Read | Read data from the Syslog table |
> | Microsoft.Insights/Logs/SysmonEvent/Read | Read data from the SysmonEvent table |
> | Microsoft.Insights/Logs/Tables.Custom/Read | Reading data from any custom log |
> | Microsoft.Insights/Logs/UAApp/Read | Read data from the UAApp table |
> | Microsoft.Insights/Logs/UAComputer/Read | Read data from the UAComputer table |
> | Microsoft.Insights/Logs/UAComputerRank/Read | Read data from the UAComputerRank table |
> | Microsoft.Insights/Logs/UADriver/Read | Read data from the UADriver table |
> | Microsoft.Insights/Logs/UADriverProblemCodes/Read | Read data from the UADriverProblemCodes table |
> | Microsoft.Insights/Logs/UAFeedback/Read | Read data from the UAFeedback table |
> | Microsoft.Insights/Logs/UAHardwareSecurity/Read | Read data from the UAHardwareSecurity table |
> | Microsoft.Insights/Logs/UAIESiteDiscovery/Read | Read data from the UAIESiteDiscovery table |
> | Microsoft.Insights/Logs/UAOfficeAddIn/Read | Read data from the UAOfficeAddIn table |
> | Microsoft.Insights/Logs/UAProposedActionPlan/Read | Read data from the UAProposedActionPlan table |
> | Microsoft.Insights/Logs/UASysReqIssue/Read | Read data from the UASysReqIssue table |
> | Microsoft.Insights/Logs/UAUpgradedComputer/Read | Read data from the UAUpgradedComputer table |
> | Microsoft.Insights/Logs/Update/Read | Read data from the Update table |
> | Microsoft.Insights/Logs/UpdateRunProgress/Read | Read data from the UpdateRunProgress table |
> | Microsoft.Insights/Logs/UpdateSummary/Read | Read data from the UpdateSummary table |
> | Microsoft.Insights/Logs/Usage/Read | Read data from the Usage table |
> | Microsoft.Insights/Logs/W3CIISLog/Read | Read data from the W3CIISLog table |
> | Microsoft.Insights/Logs/WaaSDeploymentStatus/Read | Read data from the WaaSDeploymentStatus table |
> | Microsoft.Insights/Logs/WaaSInsiderStatus/Read | Read data from the WaaSInsiderStatus table |
> | Microsoft.Insights/Logs/WaaSUpdateStatus/Read | Read data from the WaaSUpdateStatus table |
> | Microsoft.Insights/Logs/WDAVStatus/Read | Read data from the WDAVStatus table |
> | Microsoft.Insights/Logs/WDAVThreat/Read | Read data from the WDAVThreat table |
> | Microsoft.Insights/Logs/WindowsClientAssessmentRecommendation/Read | Read data from the WindowsClientAssessmentRecommendation table |
> | Microsoft.Insights/Logs/WindowsFirewall/Read | Read data from the WindowsFirewall table |
> | Microsoft.Insights/Logs/WindowsServerAssessmentRecommendation/Read | Read data from the WindowsServerAssessmentRecommendation table |
> | Microsoft.Insights/Logs/WireData/Read | Read data from the WireData table |
> | Microsoft.Insights/Logs/WUDOAggregatedStatus/Read | Read data from the WUDOAggregatedStatus table |
> | Microsoft.Insights/Logs/WUDOStatus/Read | Read data from the WUDOStatus table |
> | Microsoft.Insights/MetricAlerts/Write | Create or update a metric alert |
> | Microsoft.Insights/MetricAlerts/Delete | Delete a metric alert |
> | Microsoft.Insights/MetricAlerts/Read | Read a metric alert |
> | Microsoft.Insights/MetricAlerts/Status/Read | Read metric alert status |
> | Microsoft.Insights/MetricBaselines/Read | Read metric baselines |
> | Microsoft.Insights/MetricDefinitions/Read | Read metric definitions |
> | Microsoft.Insights/MetricDefinitions/Microsoft.Insights/Read | Read metric definitions |
> | Microsoft.Insights/MetricDefinitions/providers/Microsoft.Insights/Read | Read metric definitions |
> | Microsoft.Insights/Metricnamespaces/Read | Read metric namespaces |
> | Microsoft.Insights/Metrics/Read | Read metrics |
> | Microsoft.Insights/Metrics/Microsoft.Insights/Read | Read metrics |
> | Microsoft.Insights/Metrics/providers/Metrics/Read | Read metrics |
> | Microsoft.Insights/myWorkbooks/Write | Create or update a private Workbook |
> | Microsoft.Insights/myWorkbooks/Read | Read a private Workbook |
> | Microsoft.Insights/Operations/Read | Read operations |
> | Microsoft.Insights/PrivateLinkScopeOperationStatuses/Read | Read a private link scoped operation status |
> | Microsoft.Insights/PrivateLinkScopes/Read | Read a private link scope |
> | Microsoft.Insights/PrivateLinkScopes/Write | Create or update a private link scope |
> | Microsoft.Insights/PrivateLinkScopes/Delete | Delete a private link scope |
> | Microsoft.Insights/PrivateLinkScopes/PrivateEndpointConnectionProxies/Read | Read a private endpoint connection proxy |
> | Microsoft.Insights/PrivateLinkScopes/PrivateEndpointConnectionProxies/Write | Create or update a private endpoint connection proxy |
> | Microsoft.Insights/PrivateLinkScopes/PrivateEndpointConnectionProxies/Delete | Delete a private endpoint connection proxy |
> | Microsoft.Insights/PrivateLinkScopes/PrivateEndpointConnectionProxies/Validate/Action | Validate a private endpoint connection proxy |
> | Microsoft.Insights/PrivateLinkScopes/PrivateEndpointConnections/Read | Read a private endpoint connection |
> | Microsoft.Insights/PrivateLinkScopes/PrivateEndpointConnections/Write | Create or update a private endpoint connection |
> | Microsoft.Insights/PrivateLinkScopes/PrivateEndpointConnections/Delete | Delete a private endpoint connection |
> | Microsoft.Insights/PrivateLinkScopes/PrivateLinkResources/Read | Read a private link resource |
> | Microsoft.Insights/PrivateLinkScopes/ScopedResources/Read | Read a private link scoped resource |
> | Microsoft.Insights/PrivateLinkScopes/ScopedResources/Write | Create or update a private link scoped resource |
> | Microsoft.Insights/PrivateLinkScopes/ScopedResources/Delete | Delete a private link scoped resource |
> | Microsoft.Insights/ScheduledQueryRules/Write | Writing a scheduled query rule |
> | Microsoft.Insights/ScheduledQueryRules/Read | Reading a scheduled query rule |
> | Microsoft.Insights/ScheduledQueryRules/Delete | Deleting a scheduled query rule |
> | Microsoft.Insights/Tenants/Register/Action | Initializes the Microsoft Insights provider |
> | Microsoft.Insights/Webtests/Write | Writing to a webtest configuration |
> | Microsoft.Insights/Webtests/Delete | Deleting a webtest configuration |
> | Microsoft.Insights/Webtests/Read | Reading a webtest configuration |
> | Microsoft.Insights/Webtests/GetToken/Read | Reading a webtest token |
> | Microsoft.Insights/Webtests/MetricDefinitions/Read | Reading a webtest metric definitions |
> | Microsoft.Insights/Webtests/Metrics/Read | Reading a webtest metrics |
> | Microsoft.Insights/Workbooks/Write | Create or update a workbook |
> | Microsoft.Insights/Workbooks/Delete | Delete a workbook |
> | Microsoft.Insights/Workbooks/Read | Read a workbook |
> | **DataAction** | **Description** |
> | Microsoft.Insights/DataCollectionRules/Data/Write | Send data to a data collection rule |
> | Microsoft.Insights/Metrics/Write | Write metrics |

### Microsoft.OperationalInsights

Azure service: [Azure Monitor](../azure-monitor/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.OperationalInsights/register/action | Register a subscription to a resource provider. |
> | microsoft.operationalinsights/register/action | Rergisters the subscription. |
> | microsoft.operationalinsights/unregister/action | Unregisters the subscription. |
> | microsoft.operationalinsights/availableservicetiers/read | Get the available service tiers. |
> | Microsoft.OperationalInsights/clusters/read | Get Cluster |
> | Microsoft.OperationalInsights/clusters/write | Create or updates a Cluster |
> | Microsoft.OperationalInsights/clusters/delete | Delete Cluster |
> | Microsoft.OperationalInsights/linkTargets/read | Lists existing accounts that are not associated with an Azure subscription. To link this Azure subscription to a workspace, use a customer id returned by this operation in the customer id property of the Create Workspace operation. |
> | microsoft.operationalinsights/locations/operationStatuses/read | Get Log Analytics Azure Async Operation Status. |
> | microsoft.operationalinsights/operations/read | Lists all of the available OperationalInsights Rest API operations. |
> | Microsoft.OperationalInsights/workspaces/write | Creates a new workspace or links to an existing workspace by providing the customer id from the existing workspace. |
> | Microsoft.OperationalInsights/workspaces/read | Gets an existing workspace |
> | Microsoft.OperationalInsights/workspaces/delete | Deletes a workspace. If the workspace was linked to an existing workspace at creation time then the workspace it was linked to is not deleted. |
> | Microsoft.OperationalInsights/workspaces/generateregistrationcertificate/action | Generates Registration Certificate for the workspace. This Certificate is used to connect Microsoft System Center Operation Manager to the workspace. |
> | Microsoft.OperationalInsights/workspaces/sharedKeys/action | Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
> | Microsoft.OperationalInsights/workspaces/listKeys/action | Retrieves the list keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
> | Microsoft.OperationalInsights/workspaces/search/action | Executes a search query |
> | Microsoft.OperationalInsights/workspaces/purge/action | Delete specified data from workspace |
> | Microsoft.OperationalInsights/workspaces/regeneratesharedkey/action | Regenerates the specified workspace shared key |
> | Microsoft.OperationalInsights/workspaces/analytics/query/action | Search using new engine. |
> | Microsoft.OperationalInsights/workspaces/analytics/query/schema/read | Get search schema V2. |
> | Microsoft.OperationalInsights/workspaces/api/query/action | Search using new engine. |
> | Microsoft.OperationalInsights/workspaces/api/query/schema/read | Get search schema V2. |
> | Microsoft.OperationalInsights/workspaces/configurationScopes/read | Get Configuration Scope |
> | Microsoft.OperationalInsights/workspaces/configurationScopes/write | Set Configuration Scope |
> | Microsoft.OperationalInsights/workspaces/configurationScopes/delete | Delete Configuration Scope |
> | microsoft.operationalinsights/workspaces/dataexport/read | Get specific data export. |
> | microsoft.operationalinsights/workspaces/dataexport/write | Create or update data export. |
> | microsoft.operationalinsights/workspaces/dataexport/delete | Delete specific data export. |
> | Microsoft.OperationalInsights/workspaces/datasources/read | Get datasources under a workspace. |
> | Microsoft.OperationalInsights/workspaces/datasources/write | Create/Update datasources under a workspace. |
> | Microsoft.OperationalInsights/workspaces/datasources/delete | Delete datasources under a workspace. |
> | Microsoft.OperationalInsights/workspaces/gateways/delete | Removes a gateway configured for the workspace. |
> | Microsoft.OperationalInsights/workspaces/intelligencepacks/read | Lists all intelligence packs that are visible for a given workspace and also lists whether the pack is enabled or disabled for that workspace. |
> | Microsoft.OperationalInsights/workspaces/intelligencepacks/enable/action | Enables an intelligence pack for a given workspace. |
> | Microsoft.OperationalInsights/workspaces/intelligencepacks/disable/action | Disables an intelligence pack for a given workspace. |
> | Microsoft.OperationalInsights/workspaces/linkedServices/read | Get linked services under given workspace. |
> | Microsoft.OperationalInsights/workspaces/linkedServices/write | Create/Update linked services under given workspace. |
> | Microsoft.OperationalInsights/workspaces/linkedServices/delete | Delete linked services under given workspace. |
> | Microsoft.OperationalInsights/workspaces/listKeys/read | Retrieves the list keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
> | Microsoft.OperationalInsights/workspaces/managementGroups/read | Gets the names and metadata for System Center Operations Manager management groups connected to this workspace. |
> | Microsoft.OperationalInsights/workspaces/metricDefinitions/read | Get Metric Definitions under workspace |
> | Microsoft.OperationalInsights/workspaces/notificationSettings/read | Get the user's notification settings for the workspace. |
> | Microsoft.OperationalInsights/workspaces/notificationSettings/write | Set the user's notification settings for the workspace. |
> | Microsoft.OperationalInsights/workspaces/notificationSettings/delete | Delete the user's notification settings for the workspace. |
> | microsoft.operationalinsights/workspaces/operations/read | Gets the status of an OperationalInsights workspace operation. |
> | Microsoft.OperationalInsights/workspaces/query/read | Run queries over the data in the workspace |
> | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesAccountLogon/read | Read data from the AADDomainServicesAccountLogon table |
> | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesAccountManagement/read | Read data from the AADDomainServicesAccountManagement table |
> | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesDirectoryServiceAccess/read | Read data from the AADDomainServicesDirectoryServiceAccess table |
> | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesLogonLogoff/read | Read data from the AADDomainServicesLogonLogoff table |
> | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesPolicyChange/read | Read data from the AADDomainServicesPolicyChange table |
> | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesPrivilegeUse/read | Read data from the AADDomainServicesPrivilegeUse table |
> | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesSystemSecurity/read | Read data from the AADDomainServicesSystemSecurity table |
> | Microsoft.OperationalInsights/workspaces/query/ADAssessmentRecommendation/read | Read data from the ADAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/AddonAzureBackupAlerts/read | Read data from the AddonAzureBackupAlerts table |
> | Microsoft.OperationalInsights/workspaces/query/AddonAzureBackupJobs/read | Read data from the AddonAzureBackupJobs table |
> | Microsoft.OperationalInsights/workspaces/query/AddonAzureBackupPolicy/read | Read data from the AddonAzureBackupPolicy table |
> | Microsoft.OperationalInsights/workspaces/query/AddonAzureBackupProtectedInstance/read | Read data from the AddonAzureBackupProtectedInstance table |
> | Microsoft.OperationalInsights/workspaces/query/AddonAzureBackupStorage/read | Read data from the AddonAzureBackupStorage table |
> | Microsoft.OperationalInsights/workspaces/query/ADFActivityRun/read | Read data from the ADFActivityRun table |
> | Microsoft.OperationalInsights/workspaces/query/ADFPipelineRun/read | Read data from the ADFPipelineRun table |
> | Microsoft.OperationalInsights/workspaces/query/ADFSSISIntegrationRuntimeLogs/read | Read data from the ADFSSISIntegrationRuntimeLogs table |
> | Microsoft.OperationalInsights/workspaces/query/ADFSSISPackageEventMessageContext/read | Read data from the ADFSSISPackageEventMessageContext table |
> | Microsoft.OperationalInsights/workspaces/query/ADFSSISPackageEventMessages/read | Read data from the ADFSSISPackageEventMessages table |
> | Microsoft.OperationalInsights/workspaces/query/ADFSSISPackageExecutableStatistics/read | Read data from the ADFSSISPackageExecutableStatistics table |
> | Microsoft.OperationalInsights/workspaces/query/ADFSSISPackageExecutionComponentPhases/read | Read data from the ADFSSISPackageExecutionComponentPhases table |
> | Microsoft.OperationalInsights/workspaces/query/ADFSSISPackageExecutionDataStatistics/read | Read data from the ADFSSISPackageExecutionDataStatistics table |
> | Microsoft.OperationalInsights/workspaces/query/ADFTriggerRun/read | Read data from the ADFTriggerRun table |
> | Microsoft.OperationalInsights/workspaces/query/ADReplicationResult/read | Read data from the ADReplicationResult table |
> | Microsoft.OperationalInsights/workspaces/query/ADSecurityAssessmentRecommendation/read | Read data from the ADSecurityAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/AegDeliveryFailureLogs/read | Read data from the AegDeliveryFailureLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AegPublishFailureLogs/read | Read data from the AegPublishFailureLogs table |
> | Microsoft.OperationalInsights/workspaces/query/Alert/read | Read data from the Alert table |
> | Microsoft.OperationalInsights/workspaces/query/AlertHistory/read | Read data from the AlertHistory table |
> | Microsoft.OperationalInsights/workspaces/query/AmlComputeClusterEvent/read | Read data from the AmlComputeClusterEvent table |
> | Microsoft.OperationalInsights/workspaces/query/AmlComputeClusterNodeEvent/read | Read data from the AmlComputeClusterNodeEvent table |
> | Microsoft.OperationalInsights/workspaces/query/AmlComputeJobEvent/read | Read data from the AmlComputeJobEvent table |
> | Microsoft.OperationalInsights/workspaces/query/ApiManagementGatewayLogs/read | Read data from the ApiManagementGatewayLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppAvailabilityResults/read | Read data from the AppAvailabilityResults table |
> | Microsoft.OperationalInsights/workspaces/query/AppBrowserTimings/read | Read data from the AppBrowserTimings table |
> | Microsoft.OperationalInsights/workspaces/query/AppCenterError/read | Read data from the AppCenterError table |
> | Microsoft.OperationalInsights/workspaces/query/AppDependencies/read | Read data from the AppDependencies table |
> | Microsoft.OperationalInsights/workspaces/query/AppEvents/read | Read data from the AppEvents table |
> | Microsoft.OperationalInsights/workspaces/query/AppExceptions/read | Read data from the AppExceptions table |
> | Microsoft.OperationalInsights/workspaces/query/ApplicationInsights/read | Read data from the ApplicationInsights table |
> | Microsoft.OperationalInsights/workspaces/query/AppMetrics/read | Read data from the AppMetrics table |
> | Microsoft.OperationalInsights/workspaces/query/AppPageViews/read | Read data from the AppPageViews table |
> | Microsoft.OperationalInsights/workspaces/query/AppPerformanceCounters/read | Read data from the AppPerformanceCounters table |
> | Microsoft.OperationalInsights/workspaces/query/AppPlatformLogsforSpring/read | Read data from the AppPlatformLogsforSpring table |
> | Microsoft.OperationalInsights/workspaces/query/AppPlatformSystemLogs/read | Read data from the AppPlatformSystemLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppRequests/read | Read data from the AppRequests table |
> | Microsoft.OperationalInsights/workspaces/query/AppServiceAppLogs/read | Read data from the AppServiceAppLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppServiceAuditLogs/read | Read data from the AppServiceAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppServiceConsoleLogs/read | Read data from the AppServiceConsoleLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppServiceEnvironmentPlatformLogs/read | Read data from the AppServiceEnvironmentPlatformLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppServiceFileAuditLogs/read | Read data from the AppServiceFileAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppServiceHTTPLogs/read | Read data from the AppServiceHTTPLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppSystemEvents/read | Read data from the AppSystemEvents table |
> | Microsoft.OperationalInsights/workspaces/query/AppTraces/read | Read data from the AppTraces table |
> | Microsoft.OperationalInsights/workspaces/query/AuditLogs/read | Read data from the AuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AutoscaleEvaluationsLog/read | Read data from the AutoscaleEvaluationsLog table |
> | Microsoft.OperationalInsights/workspaces/query/AutoscaleScaleActionsLog/read | Read data from the AutoscaleScaleActionsLog table |
> | Microsoft.OperationalInsights/workspaces/query/AWSCloudTrail/read | Read data from the AWSCloudTrail table |
> | Microsoft.OperationalInsights/workspaces/query/AzureActivity/read | Read data from the AzureActivity table |
> | Microsoft.OperationalInsights/workspaces/query/AzureAssessmentRecommendation/read | Read data from the AzureAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/AzureDevOpsAuditing/read | Read data from the AzureDevOpsAuditing table |
> | Microsoft.OperationalInsights/workspaces/query/AzureDiagnostics/read | Read data from the AzureDiagnostics table |
> | Microsoft.OperationalInsights/workspaces/query/AzureDiagnostics/read | Read data from the AzureDiagnostics table |
> | Microsoft.OperationalInsights/workspaces/query/AzureMetrics/read | Read data from the AzureMetrics table |
> | Microsoft.OperationalInsights/workspaces/query/BaiClusterEvent/read | Read data from the BaiClusterEvent table |
> | Microsoft.OperationalInsights/workspaces/query/BaiClusterNodeEvent/read | Read data from the BaiClusterNodeEvent table |
> | Microsoft.OperationalInsights/workspaces/query/BaiJobEvent/read | Read data from the BaiJobEvent table |
> | Microsoft.OperationalInsights/workspaces/query/BlockchainApplicationLog/read | Read data from the BlockchainApplicationLog table |
> | Microsoft.OperationalInsights/workspaces/query/BlockchainProxyLog/read | Read data from the BlockchainProxyLog table |
> | Microsoft.OperationalInsights/workspaces/query/BoundPort/read | Read data from the BoundPort table |
> | Microsoft.OperationalInsights/workspaces/query/CommonSecurityLog/read | Read data from the CommonSecurityLog table |
> | Microsoft.OperationalInsights/workspaces/query/ComputerGroup/read | Read data from the ComputerGroup table |
> | Microsoft.OperationalInsights/workspaces/query/ConfigurationChange/read | Read data from the ConfigurationChange table |
> | Microsoft.OperationalInsights/workspaces/query/ConfigurationData/read | Read data from the ConfigurationData table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerImageInventory/read | Read data from the ContainerImageInventory table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerInventory/read | Read data from the ContainerInventory table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerLog/read | Read data from the ContainerLog table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerNodeInventory/read | Read data from the ContainerNodeInventory table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerRegistryLoginEvents/read | Read data from the ContainerRegistryLoginEvents table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerRegistryRepositoryEvents/read | Read data from the ContainerRegistryRepositoryEvents table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerServiceLog/read | Read data from the ContainerServiceLog table |
> | Microsoft.OperationalInsights/workspaces/query/CoreAzureBackup/read | Read data from the CoreAzureBackup table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksAccounts/read | Read data from the DatabricksAccounts table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksClusters/read | Read data from the DatabricksClusters table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksDBFS/read | Read data from the DatabricksDBFS table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksInstancePools/read | Read data from the DatabricksInstancePools table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksJobs/read | Read data from the DatabricksJobs table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksNotebook/read | Read data from the DatabricksNotebook table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksSecrets/read | Read data from the DatabricksSecrets table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksSQLPermissions/read | Read data from the DatabricksSQLPermissions table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksSSH/read | Read data from the DatabricksSSH table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksTables/read | Read data from the DatabricksTables table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksWorkspace/read | Read data from the DatabricksWorkspace table |
> | Microsoft.OperationalInsights/workspaces/query/dependencies/read | Read data from the dependencies table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceAppCrash/read | Read data from the DeviceAppCrash table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceAppLaunch/read | Read data from the DeviceAppLaunch table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceCalendar/read | Read data from the DeviceCalendar table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceCleanup/read | Read data from the DeviceCleanup table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceConnectSession/read | Read data from the DeviceConnectSession table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceEtw/read | Read data from the DeviceEtw table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceHardwareHealth/read | Read data from the DeviceHardwareHealth table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceHealth/read | Read data from the DeviceHealth table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceHeartbeat/read | Read data from the DeviceHeartbeat table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceSkypeHeartbeat/read | Read data from the DeviceSkypeHeartbeat table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceSkypeSignIn/read | Read data from the DeviceSkypeSignIn table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceSleepState/read | Read data from the DeviceSleepState table |
> | Microsoft.OperationalInsights/workspaces/query/DHAppFailure/read | Read data from the DHAppFailure table |
> | Microsoft.OperationalInsights/workspaces/query/DHAppReliability/read | Read data from the DHAppReliability table |
> | Microsoft.OperationalInsights/workspaces/query/DHCPActivity/read | Read data from the DHCPActivity table |
> | Microsoft.OperationalInsights/workspaces/query/DHDriverReliability/read | Read data from the DHDriverReliability table |
> | Microsoft.OperationalInsights/workspaces/query/DHLogonFailures/read | Read data from the DHLogonFailures table |
> | Microsoft.OperationalInsights/workspaces/query/DHLogonMetrics/read | Read data from the DHLogonMetrics table |
> | Microsoft.OperationalInsights/workspaces/query/DHOSCrashData/read | Read data from the DHOSCrashData table |
> | Microsoft.OperationalInsights/workspaces/query/DHOSReliability/read | Read data from the DHOSReliability table |
> | Microsoft.OperationalInsights/workspaces/query/DHWipAppLearning/read | Read data from the DHWipAppLearning table |
> | Microsoft.OperationalInsights/workspaces/query/DnsEvents/read | Read data from the DnsEvents table |
> | Microsoft.OperationalInsights/workspaces/query/DnsInventory/read | Read data from the DnsInventory table |
> | Microsoft.OperationalInsights/workspaces/query/ETWEvent/read | Read data from the ETWEvent table |
> | Microsoft.OperationalInsights/workspaces/query/Event/read | Read data from the Event table |
> | Microsoft.OperationalInsights/workspaces/query/ExchangeAssessmentRecommendation/read | Read data from the ExchangeAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/ExchangeOnlineAssessmentRecommendation/read | Read data from the ExchangeOnlineAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/FailedIngestion/read | Read data from the FailedIngestion table |
> | Microsoft.OperationalInsights/workspaces/query/FunctionAppLogs/read | Read data from the FunctionAppLogs table |
> | Microsoft.OperationalInsights/workspaces/query/Heartbeat/read | Read data from the Heartbeat table |
> | Microsoft.OperationalInsights/workspaces/query/HuntingBookmark/read | Read data from the HuntingBookmark table |
> | Microsoft.OperationalInsights/workspaces/query/IISAssessmentRecommendation/read | Read data from the IISAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/InboundConnection/read | Read data from the InboundConnection table |
> | Microsoft.OperationalInsights/workspaces/query/InsightsMetrics/read | Read data from the InsightsMetrics table |
> | Microsoft.OperationalInsights/workspaces/query/IntuneAuditLogs/read | Read data from the IntuneAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/IntuneDeviceComplianceOrg/read | Read data from the IntuneDeviceComplianceOrg table |
> | Microsoft.OperationalInsights/workspaces/query/IntuneOperationalLogs/read | Read data from the IntuneOperationalLogs table |
> | Microsoft.OperationalInsights/workspaces/query/IoTHubDistributedTracing/read | Read data from the IoTHubDistributedTracing table |
> | Microsoft.OperationalInsights/workspaces/query/KubeEvents/read | Read data from the KubeEvents table |
> | Microsoft.OperationalInsights/workspaces/query/KubeHealth/read | Read data from the KubeHealth table |
> | Microsoft.OperationalInsights/workspaces/query/KubeMonAgentEvents/read | Read data from the KubeMonAgentEvents table |
> | Microsoft.OperationalInsights/workspaces/query/KubeNodeInventory/read | Read data from the KubeNodeInventory table |
> | Microsoft.OperationalInsights/workspaces/query/KubePodInventory/read | Read data from the KubePodInventory table |
> | Microsoft.OperationalInsights/workspaces/query/KubeServices/read | Read data from the KubeServices table |
> | Microsoft.OperationalInsights/workspaces/query/LinuxAuditLog/read | Read data from the LinuxAuditLog table |
> | Microsoft.OperationalInsights/workspaces/query/MAApplication/read | Read data from the MAApplication table |
> | Microsoft.OperationalInsights/workspaces/query/MAApplicationHealth/read | Read data from the MAApplicationHealth table |
> | Microsoft.OperationalInsights/workspaces/query/MAApplicationHealthAlternativeVersions/read | Read data from the MAApplicationHealthAlternativeVersions table |
> | Microsoft.OperationalInsights/workspaces/query/MAApplicationHealthIssues/read | Read data from the MAApplicationHealthIssues table |
> | Microsoft.OperationalInsights/workspaces/query/MAApplicationInstance/read | Read data from the MAApplicationInstance table |
> | Microsoft.OperationalInsights/workspaces/query/MAApplicationInstanceReadiness/read | Read data from the MAApplicationInstanceReadiness table |
> | Microsoft.OperationalInsights/workspaces/query/MAApplicationReadiness/read | Read data from the MAApplicationReadiness table |
> | Microsoft.OperationalInsights/workspaces/query/MADeploymentPlan/read | Read data from the MADeploymentPlan table |
> | Microsoft.OperationalInsights/workspaces/query/MADevice/read | Read data from the MADevice table |
> | Microsoft.OperationalInsights/workspaces/query/MADeviceNotEnrolled/read | Read data from the MADeviceNotEnrolled table |
> | Microsoft.OperationalInsights/workspaces/query/MADeviceNRT/read | Read data from the MADeviceNRT table |
> | Microsoft.OperationalInsights/workspaces/query/MADevicePnPHealth/read | Read data from the MADevicePnPHealth table |
> | Microsoft.OperationalInsights/workspaces/query/MADevicePnPHealthAlternativeVersions/read | Read data from the MADevicePnPHealthAlternativeVersions table |
> | Microsoft.OperationalInsights/workspaces/query/MADevicePnPHealthIssues/read | Read data from the MADevicePnPHealthIssues table |
> | Microsoft.OperationalInsights/workspaces/query/MADeviceReadiness/read | Read data from the MADeviceReadiness table |
> | Microsoft.OperationalInsights/workspaces/query/MADriverInstanceReadiness/read | Read data from the MADriverInstanceReadiness table |
> | Microsoft.OperationalInsights/workspaces/query/MADriverReadiness/read | Read data from the MADriverReadiness table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddin/read | Read data from the MAOfficeAddin table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddinEntityHealth/read | Read data from the MAOfficeAddinEntityHealth table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddinHealth/read | Read data from the MAOfficeAddinHealth table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddinHealthEventNRT/read | Read data from the MAOfficeAddinHealthEventNRT table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddinHealthIssues/read | Read data from the MAOfficeAddinHealthIssues table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddinInstance/read | Read data from the MAOfficeAddinInstance table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddinInstanceReadiness/read | Read data from the MAOfficeAddinInstanceReadiness table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddinReadiness/read | Read data from the MAOfficeAddinReadiness table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeApp/read | Read data from the MAOfficeApp table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAppCrashesNRT/read | Read data from the MAOfficeAppCrashesNRT table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAppHealth/read | Read data from the MAOfficeAppHealth table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAppInstance/read | Read data from the MAOfficeAppInstance table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAppInstanceHealth/read | Read data from the MAOfficeAppInstanceHealth table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAppReadiness/read | Read data from the MAOfficeAppReadiness table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAppSessionsNRT/read | Read data from the MAOfficeAppSessionsNRT table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeBuildInfo/read | Read data from the MAOfficeBuildInfo table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeCurrencyAssessment/read | Read data from the MAOfficeCurrencyAssessment table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeCurrencyAssessmentDailyCounts/read | Read data from the MAOfficeCurrencyAssessmentDailyCounts table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeDeploymentStatus/read | Read data from the MAOfficeDeploymentStatus table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeDeploymentStatusNRT/read | Read data from the MAOfficeDeploymentStatusNRT table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeMacroErrorNRT/read | Read data from the MAOfficeMacroErrorNRT table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeMacroGlobalHealth/read | Read data from the MAOfficeMacroGlobalHealth table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeMacroHealth/read | Read data from the MAOfficeMacroHealth table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeMacroHealthIssues/read | Read data from the MAOfficeMacroHealthIssues table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeMacroIssueInstanceReadiness/read | Read data from the MAOfficeMacroIssueInstanceReadiness table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeMacroIssueReadiness/read | Read data from the MAOfficeMacroIssueReadiness table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeMacroSummary/read | Read data from the MAOfficeMacroSummary table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeSuite/read | Read data from the MAOfficeSuite table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeSuiteInstance/read | Read data from the MAOfficeSuiteInstance table |
> | Microsoft.OperationalInsights/workspaces/query/MAProposedPilotDevices/read | Read data from the MAProposedPilotDevices table |
> | Microsoft.OperationalInsights/workspaces/query/MAWindowsBuildInfo/read | Read data from the MAWindowsBuildInfo table |
> | Microsoft.OperationalInsights/workspaces/query/MAWindowsCurrencyAssessment/read | Read data from the MAWindowsCurrencyAssessment table |
> | Microsoft.OperationalInsights/workspaces/query/MAWindowsCurrencyAssessmentDailyCounts/read | Read data from the MAWindowsCurrencyAssessmentDailyCounts table |
> | Microsoft.OperationalInsights/workspaces/query/MAWindowsDeploymentStatus/read | Read data from the MAWindowsDeploymentStatus table |
> | Microsoft.OperationalInsights/workspaces/query/MAWindowsDeploymentStatusNRT/read | Read data from the MAWindowsDeploymentStatusNRT table |
> | Microsoft.OperationalInsights/workspaces/query/MAWindowsSysReqInstanceReadiness/read | Read data from the MAWindowsSysReqInstanceReadiness table |
> | Microsoft.OperationalInsights/workspaces/query/McasShadowItReporting/read | Read data from the McasShadowItReporting table |
> | Microsoft.OperationalInsights/workspaces/query/MicrosoftAzureBastionAuditLogs/read | Read data from the MicrosoftAzureBastionAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/MicrosoftDataShareReceivedSnapshotLog/read | Read data from the MicrosoftDataShareReceivedSnapshotLog table |
> | Microsoft.OperationalInsights/workspaces/query/MicrosoftDataShareSentSnapshotLog/read | Read data from the MicrosoftDataShareSentSnapshotLog table |
> | Microsoft.OperationalInsights/workspaces/query/MicrosoftDataShareShareLog/read | Read data from the MicrosoftDataShareShareLog table |
> | Microsoft.OperationalInsights/workspaces/query/MicrosoftDynamicsTelemetryPerformanceLogs/read | Read data from the MicrosoftDynamicsTelemetryPerformanceLogs table |
> | Microsoft.OperationalInsights/workspaces/query/MicrosoftDynamicsTelemetrySystemMetricsLogs/read | Read data from the MicrosoftDynamicsTelemetrySystemMetricsLogs table |
> | Microsoft.OperationalInsights/workspaces/query/MicrosoftHealthcareApisAuditLogs/read | Read data from the MicrosoftHealthcareApisAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/NetworkMonitoring/read | Read data from the NetworkMonitoring table |
> | Microsoft.OperationalInsights/workspaces/query/OfficeActivity/read | Read data from the OfficeActivity table |
> | Microsoft.OperationalInsights/workspaces/query/Operation/read | Read data from the Operation table |
> | Microsoft.OperationalInsights/workspaces/query/OutboundConnection/read | Read data from the OutboundConnection table |
> | Microsoft.OperationalInsights/workspaces/query/Perf/read | Read data from the Perf table |
> | Microsoft.OperationalInsights/workspaces/query/ProtectionStatus/read | Read data from the ProtectionStatus table |
> | Microsoft.OperationalInsights/workspaces/query/requests/read | Read data from the requests table |
> | Microsoft.OperationalInsights/workspaces/query/ReservedCommonFields/read | Read data from the ReservedCommonFields table |
> | Microsoft.OperationalInsights/workspaces/query/SCCMAssessmentRecommendation/read | Read data from the SCCMAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/SCOMAssessmentRecommendation/read | Read data from the SCOMAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityAlert/read | Read data from the SecurityAlert table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityBaseline/read | Read data from the SecurityBaseline table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityBaselineSummary/read | Read data from the SecurityBaselineSummary table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityDetection/read | Read data from the SecurityDetection table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityEvent/read | Read data from the SecurityEvent table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityIoTRawEvent/read | Read data from the SecurityIoTRawEvent table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityRecommendation/read | Read data from the SecurityRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/ServiceFabricOperationalEvent/read | Read data from the ServiceFabricOperationalEvent table |
> | Microsoft.OperationalInsights/workspaces/query/ServiceFabricReliableActorEvent/read | Read data from the ServiceFabricReliableActorEvent table |
> | Microsoft.OperationalInsights/workspaces/query/ServiceFabricReliableServiceEvent/read | Read data from the ServiceFabricReliableServiceEvent table |
> | Microsoft.OperationalInsights/workspaces/query/SfBAssessmentRecommendation/read | Read data from the SfBAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/SfBOnlineAssessmentRecommendation/read | Read data from the SfBOnlineAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/SharePointOnlineAssessmentRecommendation/read | Read data from the SharePointOnlineAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/SignalRServiceDiagnosticLogs/read | Read data from the SignalRServiceDiagnosticLogs table |
> | Microsoft.OperationalInsights/workspaces/query/SigninLogs/read | Read data from the SigninLogs table |
> | Microsoft.OperationalInsights/workspaces/query/SPAssessmentRecommendation/read | Read data from the SPAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/SQLAssessmentRecommendation/read | Read data from the SQLAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/SqlDataClassification/read | Read data from the SqlDataClassification table |
> | Microsoft.OperationalInsights/workspaces/query/SQLQueryPerformance/read | Read data from the SQLQueryPerformance table |
> | Microsoft.OperationalInsights/workspaces/query/SqlThreatProtectionLoginAudits/read | Read data from the SqlThreatProtectionLoginAudits table |
> | Microsoft.OperationalInsights/workspaces/query/SqlVulnerabilityAssessmentResult/read | Read data from the SqlVulnerabilityAssessmentResult table |
> | Microsoft.OperationalInsights/workspaces/query/StorageBlobLogs/read | Read data from the StorageBlobLogs table |
> | Microsoft.OperationalInsights/workspaces/query/StorageFileLogs/read | Read data from the StorageFileLogs table |
> | Microsoft.OperationalInsights/workspaces/query/StorageQueueLogs/read | Read data from the StorageQueueLogs table |
> | Microsoft.OperationalInsights/workspaces/query/StorageTableLogs/read | Read data from the StorageTableLogs table |
> | Microsoft.OperationalInsights/workspaces/query/SucceededIngestion/read | Read data from the SucceededIngestion table |
> | Microsoft.OperationalInsights/workspaces/query/Syslog/read | Read data from the Syslog table |
> | Microsoft.OperationalInsights/workspaces/query/SysmonEvent/read | Read data from the SysmonEvent table |
> | Microsoft.OperationalInsights/workspaces/query/Tables.Custom/read | Reading data from any custom log |
> | Microsoft.OperationalInsights/workspaces/query/ThreatIntelligenceIndicator/read | Read data from the ThreatIntelligenceIndicator table |
> | Microsoft.OperationalInsights/workspaces/query/UAApp/read | Read data from the UAApp table |
> | Microsoft.OperationalInsights/workspaces/query/UAComputer/read | Read data from the UAComputer table |
> | Microsoft.OperationalInsights/workspaces/query/UAComputerRank/read | Read data from the UAComputerRank table |
> | Microsoft.OperationalInsights/workspaces/query/UADriver/read | Read data from the UADriver table |
> | Microsoft.OperationalInsights/workspaces/query/UADriverProblemCodes/read | Read data from the UADriverProblemCodes table |
> | Microsoft.OperationalInsights/workspaces/query/UAFeedback/read | Read data from the UAFeedback table |
> | Microsoft.OperationalInsights/workspaces/query/UAHardwareSecurity/read | Read data from the UAHardwareSecurity table |
> | Microsoft.OperationalInsights/workspaces/query/UAIESiteDiscovery/read | Read data from the UAIESiteDiscovery table |
> | Microsoft.OperationalInsights/workspaces/query/UAOfficeAddIn/read | Read data from the UAOfficeAddIn table |
> | Microsoft.OperationalInsights/workspaces/query/UAProposedActionPlan/read | Read data from the UAProposedActionPlan table |
> | Microsoft.OperationalInsights/workspaces/query/UASysReqIssue/read | Read data from the UASysReqIssue table |
> | Microsoft.OperationalInsights/workspaces/query/UAUpgradedComputer/read | Read data from the UAUpgradedComputer table |
> | Microsoft.OperationalInsights/workspaces/query/Update/read | Read data from the Update table |
> | Microsoft.OperationalInsights/workspaces/query/UpdateRunProgress/read | Read data from the UpdateRunProgress table |
> | Microsoft.OperationalInsights/workspaces/query/UpdateSummary/read | Read data from the UpdateSummary table |
> | Microsoft.OperationalInsights/workspaces/query/Usage/read | Read data from the Usage table |
> | Microsoft.OperationalInsights/workspaces/query/VMBoundPort/read | Read data from the VMBoundPort table |
> | Microsoft.OperationalInsights/workspaces/query/VMComputer/read | Read data from the VMComputer table |
> | Microsoft.OperationalInsights/workspaces/query/VMConnection/read | Read data from the VMConnection table |
> | Microsoft.OperationalInsights/workspaces/query/VMProcess/read | Read data from the VMProcess table |
> | Microsoft.OperationalInsights/workspaces/query/W3CIISLog/read | Read data from the W3CIISLog table |
> | Microsoft.OperationalInsights/workspaces/query/WaaSDeploymentStatus/read | Read data from the WaaSDeploymentStatus table |
> | Microsoft.OperationalInsights/workspaces/query/WaaSInsiderStatus/read | Read data from the WaaSInsiderStatus table |
> | Microsoft.OperationalInsights/workspaces/query/WaaSUpdateStatus/read | Read data from the WaaSUpdateStatus table |
> | Microsoft.OperationalInsights/workspaces/query/WDAVStatus/read | Read data from the WDAVStatus table |
> | Microsoft.OperationalInsights/workspaces/query/WDAVThreat/read | Read data from the WDAVThreat table |
> | Microsoft.OperationalInsights/workspaces/query/WindowsClientAssessmentRecommendation/read | Read data from the WindowsClientAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/WindowsEvent/read | Read data from the WindowsEvent table |
> | Microsoft.OperationalInsights/workspaces/query/WindowsFirewall/read | Read data from the WindowsFirewall table |
> | Microsoft.OperationalInsights/workspaces/query/WindowsServerAssessmentRecommendation/read | Read data from the WindowsServerAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/WireData/read | Read data from the WireData table |
> | Microsoft.OperationalInsights/workspaces/query/WorkloadMonitoringPerf/read | Read data from the WorkloadMonitoringPerf table |
> | Microsoft.OperationalInsights/workspaces/query/WUDOAggregatedStatus/read | Read data from the WUDOAggregatedStatus table |
> | Microsoft.OperationalInsights/workspaces/query/WUDOStatus/read | Read data from the WUDOStatus table |
> | Microsoft.OperationalInsights/workspaces/query/WVDCheckpoints/read | Read data from the WVDCheckpoints table |
> | Microsoft.OperationalInsights/workspaces/query/WVDConnections/read | Read data from the WVDConnections table |
> | Microsoft.OperationalInsights/workspaces/query/WVDErrors/read | Read data from the WVDErrors table |
> | Microsoft.OperationalInsights/workspaces/query/WVDFeeds/read | Read data from the WVDFeeds table |
> | Microsoft.OperationalInsights/workspaces/query/WVDHostRegistrations/read | Read data from the WVDHostRegistrations table |
> | Microsoft.OperationalInsights/workspaces/query/WVDManagement/read | Read data from the WVDManagement table |
> | microsoft.operationalinsights/workspaces/rules/read | Get all alert rules. |
> | Microsoft.OperationalInsights/workspaces/savedSearches/read | Gets a saved search query |
> | Microsoft.OperationalInsights/workspaces/savedSearches/write | Creates a saved search query |
> | Microsoft.OperationalInsights/workspaces/savedSearches/delete | Deletes a saved search query |
> | microsoft.operationalinsights/workspaces/savedsearches/results/read | Get saved searches results. Deprecated |
> | microsoft.operationalinsights/workspaces/savedsearches/schedules/read | Get scheduled searches. |
> | microsoft.operationalinsights/workspaces/savedsearches/schedules/delete | Delete scheduled searches. |
> | microsoft.operationalinsights/workspaces/savedsearches/schedules/write | Create or update scheduled searches. |
> | microsoft.operationalinsights/workspaces/savedsearches/schedules/actions/read | Get scheduled search actions. |
> | microsoft.operationalinsights/workspaces/savedsearches/schedules/actions/delete | Delete scheduled search actions. |
> | microsoft.operationalinsights/workspaces/savedsearches/schedules/actions/write | Create or update scheduled search actions. |
> | Microsoft.OperationalInsights/workspaces/schema/read | Gets the search schema for the workspace.  Search schema includes the exposed fields and their types. |
> | microsoft.operationalinsights/workspaces/scopedPrivateLinkProxies/read | Get Scoped Private Link Proxy. |
> | microsoft.operationalinsights/workspaces/scopedPrivateLinkProxies/write | Put Scoped Private Link Proxy. |
> | microsoft.operationalinsights/workspaces/scopedPrivateLinkProxies/delete | Delete Scoped Private Link Proxy. |
> | microsoft.operationalinsights/workspaces/search/read | Get search results. Deprecated. |
> | Microsoft.OperationalInsights/workspaces/sharedKeys/read | Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
> | Microsoft.OperationalInsights/workspaces/storageinsightconfigs/write | Creates a new storage configuration. These configurations are used to pull data from a location in an existing storage account. |
> | Microsoft.OperationalInsights/workspaces/storageinsightconfigs/read | Gets a storage configuration. |
> | Microsoft.OperationalInsights/workspaces/storageinsightconfigs/delete | Deletes a storage configuration. This will stop Microsoft Operational Insights from reading data from the storage account. |
> | Microsoft.OperationalInsights/workspaces/upgradetranslationfailures/read | Get Search Upgrade Translation Failure log for the workspace |
> | Microsoft.OperationalInsights/workspaces/usages/read | Gets usage data for a workspace including the amount of data read by the workspace. |

### Microsoft.OperationsManagement

Azure service: [Azure Monitor](../azure-monitor/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.OperationsManagement/register/action | Register a subscription to a resource provider. |
> | Microsoft.OperationsManagement/managementAssociations/write | Create a new Management Association |
> | Microsoft.OperationsManagement/managementAssociations/read | Get Existing Management Association |
> | Microsoft.OperationsManagement/managementAssociations/delete | Delete existing Management Association |
> | Microsoft.OperationsManagement/managementConfigurations/write | Create a new Management Configuration |
> | Microsoft.OperationsManagement/managementConfigurations/read | Get Existing Management Configuration |
> | Microsoft.OperationsManagement/managementConfigurations/delete | Delete existing Management Configuration |
> | Microsoft.OperationsManagement/solutions/write | Create new OMS solution |
> | Microsoft.OperationsManagement/solutions/read | Get exiting OMS solution |
> | Microsoft.OperationsManagement/solutions/delete | Delete existing OMS solution |

### Microsoft.WorkloadMonitor

Azure service: [Azure Monitor](../azure-monitor/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.WorkloadMonitor/components/read | Gets components for the resource |
> | Microsoft.WorkloadMonitor/componentsSummary/read | Gets summary of components |
> | Microsoft.WorkloadMonitor/monitorInstances/read | Gets instances of monitors for the resource |
> | Microsoft.WorkloadMonitor/monitorInstancesSummary/read | Gets summary of monitor instances |
> | Microsoft.WorkloadMonitor/monitors/read | Gets monitors for the resource |
> | Microsoft.WorkloadMonitor/monitors/write | Configure monitor for the resource |
> | Microsoft.WorkloadMonitor/notificationSettings/read | Gets notification settings for the resource |
> | Microsoft.WorkloadMonitor/notificationSettings/write | Configure notification settings for the resource |
> | Microsoft.WorkloadMonitor/operations/read | Gets the supported operations |

## Management + governance

### Microsoft.Advisor

Azure service: [Azure Advisor](../advisor/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Advisor/generateRecommendations/action | Gets generate recommendations status |
> | Microsoft.Advisor/register/action | Registers the subscription for the Microsoft Advisor |
> | Microsoft.Advisor/unregister/action | Unregisters the subscription for the Microsoft Advisor |
> | Microsoft.Advisor/configurations/read | Get configurations |
> | Microsoft.Advisor/configurations/write | Creates/updates configuration |
> | Microsoft.Advisor/generateRecommendations/read | Gets generate recommendations status |
> | Microsoft.Advisor/metadata/read | Get Metadata |
> | Microsoft.Advisor/operations/read | Gets the operations for the Microsoft Advisor |
> | Microsoft.Advisor/recommendations/read | Reads recommendations |
> | Microsoft.Advisor/recommendations/available/action | New recommendation is available in Microsoft Advisor |
> | Microsoft.Advisor/recommendations/suppressions/read | Gets suppressions |
> | Microsoft.Advisor/recommendations/suppressions/write | Creates/updates suppressions |
> | Microsoft.Advisor/recommendations/suppressions/delete | Deletes suppression |
> | Microsoft.Advisor/suppressions/read | Gets suppressions |
> | Microsoft.Advisor/suppressions/write | Creates/updates suppressions |
> | Microsoft.Advisor/suppressions/delete | Deletes suppression |

### Microsoft.Authorization

Azure service: [Azure Policy](../governance/policy/overview.md), [Azure RBAC](overview.md), [Azure Resource Manager](../azure-resource-manager/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Authorization/elevateAccess/action | Grants the caller User Access Administrator access at the tenant scope |
> | Microsoft.Authorization/classicAdministrators/read | Reads the administrators for the subscription. |
> | Microsoft.Authorization/classicAdministrators/write | Add or modify administrator to a subscription. |
> | Microsoft.Authorization/classicAdministrators/delete | Removes the administrator from the subscription. |
> | Microsoft.Authorization/classicAdministrators/operationstatuses/read | Gets the administrator operation statuses of the subscription. |
> | Microsoft.Authorization/denyAssignments/read | Get information about a deny assignment. |
> | Microsoft.Authorization/denyAssignments/write | Create a deny assignment at the specified scope. |
> | Microsoft.Authorization/denyAssignments/delete | Delete a deny assignment at the specified scope. |
> | Microsoft.Authorization/locks/read | Gets locks at the specified scope. |
> | Microsoft.Authorization/locks/write | Add locks at the specified scope. |
> | Microsoft.Authorization/locks/delete | Delete locks at the specified scope. |
> | Microsoft.Authorization/operations/read | Gets the list of operations |
> | Microsoft.Authorization/permissions/read | Lists all the permissions the caller has at a given scope. |
> | Microsoft.Authorization/policies/audit/action | Action taken as a result of evaluation of Azure Policy with 'audit' effect |
> | Microsoft.Authorization/policies/auditIfNotExists/action | Action taken as a result of evaluation of Azure Policy with 'auditIfNotExists' effect |
> | Microsoft.Authorization/policies/deny/action | Action taken as a result of evaluation of Azure Policy with 'deny' effect |
> | Microsoft.Authorization/policies/deployIfNotExists/action | Action taken as a result of evaluation of Azure Policy with 'deployIfNotExists' effect |
> | Microsoft.Authorization/policyAssignments/read | Get information about a policy assignment. |
> | Microsoft.Authorization/policyAssignments/write | Create a policy assignment at the specified scope. |
> | Microsoft.Authorization/policyAssignments/delete | Delete a policy assignment at the specified scope. |
> | Microsoft.Authorization/policyDefinitions/read | Get information about a policy definition. |
> | Microsoft.Authorization/policyDefinitions/write | Create a custom policy definition. |
> | Microsoft.Authorization/policyDefinitions/delete | Delete a policy definition. |
> | Microsoft.Authorization/policySetDefinitions/read | Get information about a policy set definition. |
> | Microsoft.Authorization/policySetDefinitions/write | Create a custom policy set definition. |
> | Microsoft.Authorization/policySetDefinitions/delete | Delete a policy set definition. |
> | Microsoft.Authorization/providerOperations/read | Get operations for all resource providers which can be used in role definitions. |
> | Microsoft.Authorization/roleAssignments/read | Get information about a role assignment. |
> | Microsoft.Authorization/roleAssignments/write | Create a role assignment at the specified scope. |
> | Microsoft.Authorization/roleAssignments/delete | Delete a role assignment at the specified scope. |
> | Microsoft.Authorization/roleDefinitions/read | Get information about a role definition. |
> | Microsoft.Authorization/roleDefinitions/write | Create or update a custom role definition with specified permissions and assignable scopes. |
> | Microsoft.Authorization/roleDefinitions/delete | Delete the specified custom role definition. |

### Microsoft.Automation

Azure service: [Automation](../automation/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Automation/register/action | Registers the subscription to Azure Automation |
> | Microsoft.Automation/automationAccounts/webhooks/action | Generates a URI for an Azure Automation webhook |
> | Microsoft.Automation/automationAccounts/read | Gets an Azure Automation account |
> | Microsoft.Automation/automationAccounts/write | Creates or updates an Azure Automation account |
> | Microsoft.Automation/automationAccounts/listKeys/action | Reads the Keys for the automation account |
> | Microsoft.Automation/automationAccounts/delete | Deletes an Azure Automation account |
> | Microsoft.Automation/automationAccounts/agentRegistrationInformation/read | Read an Azure Automation DSC's registration information |
> | Microsoft.Automation/automationAccounts/agentRegistrationInformation/regenerateKey/action | Writes a request to regenerate Azure Automation DSC keys |
> | Microsoft.Automation/automationAccounts/certificates/getCount/action | Reads the count of certificates |
> | Microsoft.Automation/automationAccounts/certificates/read | Gets an Azure Automation certificate asset |
> | Microsoft.Automation/automationAccounts/certificates/write | Creates or updates an Azure Automation certificate asset |
> | Microsoft.Automation/automationAccounts/certificates/delete | Deletes an Azure Automation certificate asset |
> | Microsoft.Automation/automationAccounts/compilationjobs/write | Writes an Azure Automation DSC's Compilation |
> | Microsoft.Automation/automationAccounts/compilationjobs/read | Reads an Azure Automation DSC's Compilation |
> | Microsoft.Automation/automationAccounts/compilationjobs/write | Writes an Azure Automation DSC's Compilation |
> | Microsoft.Automation/automationAccounts/compilationjobs/read | Reads an Azure Automation DSC's Compilation |
> | Microsoft.Automation/automationAccounts/configurations/read | Gets an Azure Automation DSC's content |
> | Microsoft.Automation/automationAccounts/configurations/getCount/action | Reads the count of an Azure Automation DSC's content |
> | Microsoft.Automation/automationAccounts/configurations/write | Writes an Azure Automation DSC's content |
> | Microsoft.Automation/automationAccounts/configurations/delete | Deletes an Azure Automation DSC's content |
> | Microsoft.Automation/automationAccounts/configurations/content/read | Reads the configuration media content |
> | Microsoft.Automation/automationAccounts/connections/read | Gets an Azure Automation connection asset |
> | Microsoft.Automation/automationAccounts/connections/getCount/action | Reads the count of connections |
> | Microsoft.Automation/automationAccounts/connections/write | Creates or updates an Azure Automation connection asset |
> | Microsoft.Automation/automationAccounts/connections/delete | Deletes an Azure Automation connection asset |
> | Microsoft.Automation/automationAccounts/connectionTypes/read | Gets an Azure Automation connection type asset |
> | Microsoft.Automation/automationAccounts/connectionTypes/write | Creates an Azure Automation connection type asset |
> | Microsoft.Automation/automationAccounts/connectionTypes/delete | Deletes an Azure Automation connection type asset |
> | Microsoft.Automation/automationAccounts/credentials/read | Gets an Azure Automation credential asset |
> | Microsoft.Automation/automationAccounts/credentials/getCount/action | Reads the count of credentials |
> | Microsoft.Automation/automationAccounts/credentials/write | Creates or updates an Azure Automation credential asset |
> | Microsoft.Automation/automationAccounts/credentials/delete | Deletes an Azure Automation credential asset |
> | Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/read | Reads Hybrid Runbook Worker Resources |
> | Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/delete | Deletes Hybrid Runbook Worker Resources |
> | Microsoft.Automation/automationAccounts/jobs/runbookContent/action | Gets the content of the Azure Automation runbook at the time of the job execution |
> | Microsoft.Automation/automationAccounts/jobs/read | Gets an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/write | Creates an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/stop/action | Stops an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/suspend/action | Suspends an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/resume/action | Resumes an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/output/read | Gets the output of a job |
> | Microsoft.Automation/automationAccounts/jobs/streams/read | Gets an Azure Automation job stream |
> | Microsoft.Automation/automationAccounts/jobs/streams/read | Gets an Azure Automation job stream |
> | Microsoft.Automation/automationAccounts/jobSchedules/read | Gets an Azure Automation job schedule |
> | Microsoft.Automation/automationAccounts/jobSchedules/write | Creates an Azure Automation job schedule |
> | Microsoft.Automation/automationAccounts/jobSchedules/delete | Deletes an Azure Automation job schedule |
> | Microsoft.Automation/automationAccounts/linkedWorkspace/read | Gets the workspace linked to the automation account |
> | Microsoft.Automation/automationAccounts/modules/read | Gets an Azure Automation Powershell module |
> | Microsoft.Automation/automationAccounts/modules/getCount/action | Gets the count of Powershell modules within the Automation Account |
> | Microsoft.Automation/automationAccounts/modules/write | Creates or updates an Azure Automation Powershell module |
> | Microsoft.Automation/automationAccounts/modules/delete | Deletes an Azure Automation Powershell module |
> | Microsoft.Automation/automationAccounts/modules/activities/read | Gets Azure Automation Activities |
> | Microsoft.Automation/automationAccounts/nodeConfigurations/rawContent/action | Reads an Azure Automation DSC's node configuration content |
> | Microsoft.Automation/automationAccounts/nodeConfigurations/read | Reads an Azure Automation DSC's node configuration |
> | Microsoft.Automation/automationAccounts/nodeConfigurations/write | Writes an Azure Automation DSC's node configuration |
> | Microsoft.Automation/automationAccounts/nodeConfigurations/delete | Deletes an Azure Automation DSC's node configuration |
> | Microsoft.Automation/automationAccounts/nodecounts/read | Reads node count summary for the specified type |
> | Microsoft.Automation/automationAccounts/nodes/read | Reads Azure Automation DSC nodes |
> | Microsoft.Automation/automationAccounts/nodes/write | Creates or updates Azure Automation DSC nodes |
> | Microsoft.Automation/automationAccounts/nodes/delete | Deletes Azure Automation DSC nodes |
> | Microsoft.Automation/automationAccounts/nodes/reports/read | Reads Azure Automation DSC reports |
> | Microsoft.Automation/automationAccounts/nodes/reports/content/read | Reads Azure Automation DSC report contents |
> | Microsoft.Automation/automationAccounts/objectDataTypes/fields/read | Gets Azure Automation TypeFields |
> | Microsoft.Automation/automationAccounts/privateEndpointConnectionProxies/read | Reads Azure Automation Private Endpoint Connection Proxy |
> | Microsoft.Automation/automationAccounts/privateEndpointConnectionProxies/write | Creates an Azure Automation Private Endpoint Connection Proxy |
> | Microsoft.Automation/automationAccounts/privateEndpointConnectionProxies/validate/action | Validate a Private endpoint connection request (groupId Validation) |
> | Microsoft.Automation/automationAccounts/privateEndpointConnectionProxies/delete | Delete an Azure Automation Private Endpoint Connection Proxy |
> | Microsoft.Automation/automationAccounts/privateEndpointConnectionProxies/operationResults/read | Get Azure Automation private endpoint proxy operation results. |
> | Microsoft.Automation/automationAccounts/privateEndpointConnections/read | Get Azure Automation Private Endpoint Connection status |
> | Microsoft.Automation/automationAccounts/privateEndpointConnections/write | Approve or reject an Azure Automation Private Endpoint Connection |
> | Microsoft.Automation/automationAccounts/privateLinkResources/read | Reads Group Information for private endpoints |
> | Microsoft.Automation/automationAccounts/python2Packages/read | Gets an Azure Automation Python 2 package |
> | Microsoft.Automation/automationAccounts/python2Packages/write | Creates or updates an Azure Automation Python 2 package |
> | Microsoft.Automation/automationAccounts/python2Packages/delete | Deletes an Azure Automation Python 2 package |
> | Microsoft.Automation/automationAccounts/python3Packages/read | Gets an Azure Automation Python 3 package |
> | Microsoft.Automation/automationAccounts/python3Packages/write | Creates or updates an Azure Automation Python 3 package |
> | Microsoft.Automation/automationAccounts/python3Packages/delete | Deletes an Azure Automation Python 3 package |
> | Microsoft.Automation/automationAccounts/runbooks/read | Gets an Azure Automation runbook |
> | Microsoft.Automation/automationAccounts/runbooks/getCount/action | Gets the count of Azure Automation runbooks |
> | Microsoft.Automation/automationAccounts/runbooks/write | Creates or updates an Azure Automation runbook |
> | Microsoft.Automation/automationAccounts/runbooks/delete | Deletes an Azure Automation runbook |
> | Microsoft.Automation/automationAccounts/runbooks/publish/action | Publishes an Azure Automation runbook draft |
> | Microsoft.Automation/automationAccounts/runbooks/content/read | Gets the content of an Azure Automation runbook |
> | Microsoft.Automation/automationAccounts/runbooks/draft/read | Gets an Azure Automation runbook draft |
> | Microsoft.Automation/automationAccounts/runbooks/draft/undoEdit/action | Undo edits to an Azure Automation runbook draft |
> | Microsoft.Automation/automationAccounts/runbooks/draft/content/write | Creates the content of an Azure Automation runbook draft |
> | Microsoft.Automation/automationAccounts/runbooks/draft/operationResults/read | Gets Azure Automation runbook draft operation results |
> | Microsoft.Automation/automationAccounts/runbooks/draft/testJob/read | Gets an Azure Automation runbook draft test job |
> | Microsoft.Automation/automationAccounts/runbooks/draft/testJob/write | Creates an Azure Automation runbook draft test job |
> | Microsoft.Automation/automationAccounts/runbooks/draft/testJob/stop/action | Stops an Azure Automation runbook draft test job |
> | Microsoft.Automation/automationAccounts/runbooks/draft/testJob/suspend/action | Suspends an Azure Automation runbook draft test job |
> | Microsoft.Automation/automationAccounts/runbooks/draft/testJob/resume/action | Resumes an Azure Automation runbook draft test job |
> | Microsoft.Automation/automationAccounts/schedules/read | Gets an Azure Automation schedule asset |
> | Microsoft.Automation/automationAccounts/schedules/getCount/action | Gets the count of Azure Automation schedules |
> | Microsoft.Automation/automationAccounts/schedules/write | Creates or updates an Azure Automation schedule asset |
> | Microsoft.Automation/automationAccounts/schedules/delete | Deletes an Azure Automation schedule asset |
> | Microsoft.Automation/automationAccounts/softwareUpdateConfigurationMachineRuns/read | Gets an Azure Automation Software Update Configuration Machine Run |
> | Microsoft.Automation/automationAccounts/softwareUpdateConfigurationRuns/read | Gets an Azure Automation Software Update Configuration Run |
> | Microsoft.Automation/automationAccounts/softwareUpdateConfigurations/write | Creates or updates Azure Automation Software Update Configuration |
> | Microsoft.Automation/automationAccounts/softwareUpdateConfigurations/read | Gets an Azure Automation Software Update Configuration |
> | Microsoft.Automation/automationAccounts/softwareUpdateConfigurations/delete | Deletes an Azure Automation Software Update Configuration |
> | Microsoft.Automation/automationAccounts/softwareUpdateConfigurations/write | Creates or updates Azure Automation Software Update Configuration |
> | Microsoft.Automation/automationAccounts/softwareUpdateConfigurations/read | Gets an Azure Automation Software Update Configuration |
> | Microsoft.Automation/automationAccounts/softwareUpdateConfigurations/delete | Deletes an Azure Automation Software Update Configuration |
> | Microsoft.Automation/automationAccounts/statistics/read | Gets Azure Automation Statistics |
> | Microsoft.Automation/automationAccounts/updateDeploymentMachineRuns/read | Get an Azure Automation update deployment machine |
> | Microsoft.Automation/automationAccounts/updateManagementPatchJob/read | Gets an Azure Automation update management patch job |
> | Microsoft.Automation/automationAccounts/usages/read | Gets Azure Automation Usage |
> | Microsoft.Automation/automationAccounts/variables/read | Reads an Azure Automation variable asset |
> | Microsoft.Automation/automationAccounts/variables/write | Creates or updates an Azure Automation variable asset |
> | Microsoft.Automation/automationAccounts/variables/delete | Deletes an Azure Automation variable asset |
> | Microsoft.Automation/automationAccounts/watchers/write | Creates an Azure Automation watcher job |
> | Microsoft.Automation/automationAccounts/watchers/read | Gets an Azure Automation watcher job |
> | Microsoft.Automation/automationAccounts/watchers/delete | Delete an Azure Automation watcher job |
> | Microsoft.Automation/automationAccounts/watchers/start/action | Start an Azure Automation watcher job |
> | Microsoft.Automation/automationAccounts/watchers/stop/action | Stop an Azure Automation watcher job |
> | Microsoft.Automation/automationAccounts/watchers/streams/read | Gets an Azure Automation watcher job stream |
> | Microsoft.Automation/automationAccounts/watchers/watcherActions/write | Create an Azure Automation watcher job actions |
> | Microsoft.Automation/automationAccounts/watchers/watcherActions/read | Gets an Azure Automation watcher job actions |
> | Microsoft.Automation/automationAccounts/watchers/watcherActions/delete | Delete an Azure Automation watcher job actions |
> | Microsoft.Automation/automationAccounts/webhooks/read | Reads an Azure Automation webhook |
> | Microsoft.Automation/automationAccounts/webhooks/write | Creates or updates an Azure Automation webhook |
> | Microsoft.Automation/automationAccounts/webhooks/delete | Deletes an Azure Automation webhook  |
> | Microsoft.Automation/operations/read | Gets Available Operations for Azure Automation resources |

### Microsoft.Batch

Azure service: [Batch](../batch/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Batch/register/action | Registers the subscription for the Batch Resource Provider and enables the creation of Batch accounts |
> | Microsoft.Batch/unregister/action | Unregisters the subscription for the Batch Resource Provider preventing the creation of Batch accounts |
> | Microsoft.Batch/batchAccounts/read | Lists Batch accounts or gets the properties of a Batch account |
> | Microsoft.Batch/batchAccounts/write | Creates a new Batch account or updates an existing Batch account |
> | Microsoft.Batch/batchAccounts/delete | Deletes a Batch account |
> | Microsoft.Batch/batchAccounts/listkeys/action | Lists access keys for a Batch account |
> | Microsoft.Batch/batchAccounts/regeneratekeys/action | Regenerates access keys for a Batch account |
> | Microsoft.Batch/batchAccounts/syncAutoStorageKeys/action | Synchronizes access keys for the auto storage account configured for a Batch account |
> | Microsoft.Batch/batchAccounts/applications/read | Lists applications or gets the properties of an application |
> | Microsoft.Batch/batchAccounts/applications/write | Creates a new application or updates an existing application |
> | Microsoft.Batch/batchAccounts/applications/delete | Deletes an application |
> | Microsoft.Batch/batchAccounts/applications/versions/read | Gets the properties of an application package |
> | Microsoft.Batch/batchAccounts/applications/versions/write | Creates a new application package or updates an existing application package |
> | Microsoft.Batch/batchAccounts/applications/versions/delete | Deletes an application package |
> | Microsoft.Batch/batchAccounts/applications/versions/activate/action | Activates an application package |
> | Microsoft.Batch/batchAccounts/certificateOperationResults/read | Gets the results of a long running certificate operation on a Batch account |
> | Microsoft.Batch/batchAccounts/certificates/read | Lists certificates on a Batch account or gets the properties of a certificate |
> | Microsoft.Batch/batchAccounts/certificates/write | Creates a new certificate on a Batch account or updates an existing certificate |
> | Microsoft.Batch/batchAccounts/certificates/delete | Deletes a certificate from a Batch account |
> | Microsoft.Batch/batchAccounts/certificates/cancelDelete/action | Cancels the failed deletion of a certificate on a Batch account |
> | Microsoft.Batch/batchAccounts/operationResults/read | Gets the results of a long running Batch account operation |
> | Microsoft.Batch/batchAccounts/poolOperationResults/read | Gets the results of a long running pool operation on a Batch account |
> | Microsoft.Batch/batchAccounts/pools/read | Lists pools on a Batch account or gets the properties of a pool |
> | Microsoft.Batch/batchAccounts/pools/write | Creates a new pool on a Batch account or updates an existing pool |
> | Microsoft.Batch/batchAccounts/pools/delete | Deletes a pool from a Batch account |
> | Microsoft.Batch/batchAccounts/pools/stopResize/action | Stops an ongoing resize operation on a Batch account pool |
> | Microsoft.Batch/batchAccounts/pools/disableAutoscale/action | Disables automatic scaling for a Batch account pool |
> | Microsoft.Batch/batchAccounts/privateEndpointConnectionResults/read | Gets the results of a long running Batch account private endpoint connection operation |
> | Microsoft.Batch/batchAccounts/privateEndpointConnections/write | Update an existing Private endpoint connection on a Batch account |
> | Microsoft.Batch/batchAccounts/privateEndpointConnections/read | Gets Private endpoint connection or Lists Private endpoint connections on a Batch account |
> | Microsoft.Batch/batchAccounts/privateLinkResources/read | Gets the properties of a Private link resource or Lists Private link resources on a Batch account |
> | Microsoft.Batch/locations/checkNameAvailability/action | Checks that the account name is valid and not in use. |
> | Microsoft.Batch/locations/accountOperationResults/read | Gets the results of a long running Batch account operation |
> | Microsoft.Batch/locations/quotas/read | Gets Batch quotas of the specified subscription at the specified Azure region |
> | Microsoft.Batch/operations/read | Lists operations available on Microsoft.Batch resource provider |
> | **DataAction** | **Description** |
> | Microsoft.Batch/batchAccounts/jobs/read | Lists jobs on a Batch account or gets the properties of a job |
> | Microsoft.Batch/batchAccounts/jobs/write | Creates a new job on a Batch account or updates an existing job |
> | Microsoft.Batch/batchAccounts/jobs/delete | Deletes a job from a Batch account |
> | Microsoft.Batch/batchAccounts/jobSchedules/read | Lists job schedules on a Batch account or gets the properties of a job schedule |
> | Microsoft.Batch/batchAccounts/jobSchedules/write | Creates a new job schedule on a Batch account or updates an existing job schedule |
> | Microsoft.Batch/batchAccounts/jobSchedules/delete | Deletes a job schedule from a Batch account |

### Microsoft.Billing

Azure service: [Cost Management + Billing](../cost-management-billing/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Billing/validateAddress/action |  |
> | Microsoft.Billing/register/action |  |
> | Microsoft.Billing/billingAccounts/read |  |
> | Microsoft.Billing/billingAccounts/listInvoiceSectionsWithCreateSubscriptionPermission/action |  |
> | Microsoft.Billing/billingAccounts/write |  |
> | Microsoft.Billing/billingAccounts/agreements/read |  |
> | Microsoft.Billing/billingAccounts/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/customers/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoices/pricesheet/download/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/write |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingSubscriptions/transfer/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingSubscriptions/move/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingSubscriptions/validateMoveEligibility/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/products/transfer/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/products/move/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/products/validateMoveEligibility/action |  |
> | Microsoft.Billing/billingAccounts/billingProfiles/pricesheet/download/action |  |
> | Microsoft.Billing/billingAccounts/billingSubscriptions/read |  |
> | Microsoft.Billing/billingAccounts/customers/read |  |
> | Microsoft.Billing/billingAccounts/customers/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/departments/read |  |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/read |  |
> | Microsoft.Billing/billingAccounts/enrollmentAccounts/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/enrollmentDepartments/billingPermissions/read |  |
> | Microsoft.Billing/billingAccounts/products/read |  |
> | Microsoft.Billing/departments/read |  |
> | Microsoft.Billing/invoices/download/action | Download invoice using download link from list |
> | Microsoft.Billing/invoices/download/action | Download invoice using download link from list |
> | Microsoft.Billing/invoices/read |  |
> | Microsoft.Billing/operations/read |  |

### Microsoft.Blueprint

Azure service: [Azure Blueprints](../governance/blueprints/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Blueprint/register/action | Registers the Azure Blueprints Resource Provider |
> | Microsoft.Blueprint/blueprintAssignments/read | Read any blueprint artifacts |
> | Microsoft.Blueprint/blueprintAssignments/write | Create or update any blueprint artifacts |
> | Microsoft.Blueprint/blueprintAssignments/delete | Delete any blueprint artifacts |
> | Microsoft.Blueprint/blueprintAssignments/whoisblueprint/action | Get Azure Blueprints service principal object Id. |
> | Microsoft.Blueprint/blueprintAssignments/assignmentOperations/read | Read any blueprint artifacts |
> | Microsoft.Blueprint/blueprints/read | Read any blueprints |
> | Microsoft.Blueprint/blueprints/write | Create or update any blueprints |
> | Microsoft.Blueprint/blueprints/delete | Delete any blueprints |
> | Microsoft.Blueprint/blueprints/artifacts/read | Read any blueprint artifacts |
> | Microsoft.Blueprint/blueprints/artifacts/write | Create or update any blueprint artifacts |
> | Microsoft.Blueprint/blueprints/artifacts/delete | Delete any blueprint artifacts |
> | Microsoft.Blueprint/blueprints/versions/read | Read any blueprints |
> | Microsoft.Blueprint/blueprints/versions/write | Create or update any blueprints |
> | Microsoft.Blueprint/blueprints/versions/delete | Delete any blueprints |
> | Microsoft.Blueprint/blueprints/versions/artifacts/read | Read any blueprint artifacts |

### Microsoft.Capacity

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Capacity/calculateprice/action | Calculate any Reservation Price |
> | Microsoft.Capacity/checkoffers/action | Check any Subscription Offers |
> | Microsoft.Capacity/checkscopes/action | Check any Subscription |
> | Microsoft.Capacity/validatereservationorder/action | Validate any Reservation |
> | Microsoft.Capacity/reservationorders/action | Update any Reservation |
> | Microsoft.Capacity/register/action | Registers the Capacity resource provider and enables the creation of Capacity resources. |
> | Microsoft.Capacity/unregister/action | Unregister any Tenant |
> | Microsoft.Capacity/calculateexchange/action | Computes the exchange amount and price of new purchase and returns policy Errors. |
> | Microsoft.Capacity/exchange/action | Exchange any Reservation |
> | Microsoft.Capacity/appliedreservations/read | Read All Reservations |
> | Microsoft.Capacity/catalogs/read | Read catalog of Reservation |
> | Microsoft.Capacity/commercialreservationorders/read | Get Reservation Orders created in any Tenant |
> | Microsoft.Capacity/operations/read | Read any Operation |
> | Microsoft.Capacity/reservationorders/availablescopes/action | Find any Available Scope |
> | Microsoft.Capacity/reservationorders/read | Read All Reservations |
> | Microsoft.Capacity/reservationorders/write | Create any Reservation |
> | Microsoft.Capacity/reservationorders/delete | Delete any Reservation |
> | Microsoft.Capacity/reservationorders/reservations/action | Update any Reservation |
> | Microsoft.Capacity/reservationorders/return/action | Return any Reservation |
> | Microsoft.Capacity/reservationorders/swap/action | Swap any Reservation |
> | Microsoft.Capacity/reservationorders/split/action | Split any Reservation |
> | Microsoft.Capacity/reservationorders/merge/action | Merge any Reservation |
> | Microsoft.Capacity/reservationorders/calculaterefund/action | Computes the refund amount and price of new purchase and returns policy Errors. |
> | Microsoft.Capacity/reservationorders/mergeoperationresults/read | Poll any merge operation |
> | Microsoft.Capacity/reservationorders/reservations/availablescopes/action | Find any Available Scope |
> | Microsoft.Capacity/reservationorders/reservations/read | Read All Reservations |
> | Microsoft.Capacity/reservationorders/reservations/write | Create any Reservation |
> | Microsoft.Capacity/reservationorders/reservations/delete | Delete any Reservation |
> | Microsoft.Capacity/reservationorders/reservations/revisions/read | Read All Reservations |
> | Microsoft.Capacity/reservationorders/splitoperationresults/read | Poll any split operation |
> | Microsoft.Capacity/tenants/register/action | Register any Tenant |

### Microsoft.Commerce

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Commerce/register/action | Register Subscription for Microsoft Commerce UsageAggregate |
> | Microsoft.Commerce/unregister/action | Unregister Subscription for Microsoft Commerce UsageAggregate |
> | Microsoft.Commerce/RateCard/read | Returns offer data, resource/meter metadata and rates for the given subscription. |
> | Microsoft.Commerce/UsageAggregates/read | Retrieves Microsoft Azure's consumption  by a subscription. The result contains aggregates usage data, subscription and resource related information, on a particular time range. |

### Microsoft.Consumption

Azure service: [Cost Management](../cost-management-billing/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Consumption/register/action | Register to Consumption RP |
> | Microsoft.Consumption/aggregatedcost/read | List AggregatedCost for management group. |
> | Microsoft.Consumption/balances/read | List the utilization summary for a billing period for a management group. |
> | Microsoft.Consumption/budgets/read | List the budgets by a subscription or a management group. |
> | Microsoft.Consumption/budgets/write | Creates and update the budgets by a subscription or a management group. |
> | Microsoft.Consumption/budgets/delete | Delete the budgets by a subscription or a management group. |
> | Microsoft.Consumption/charges/read | List charges |
> | Microsoft.Consumption/credits/read | List credits |
> | Microsoft.Consumption/events/read | List events |
> | Microsoft.Consumption/externalBillingAccounts/tags/read | List tags for EA and subscriptions. |
> | Microsoft.Consumption/externalSubscriptions/tags/read | List tags for EA and subscriptions. |
> | Microsoft.Consumption/forecasts/read | List forecasts |
> | Microsoft.Consumption/lots/read | List lots |
> | Microsoft.Consumption/marketplaces/read | List the marketplace resource usage details for a scope for EA and WebDirect subscriptions. |
> | Microsoft.Consumption/operationresults/read | List operationresults |
> | Microsoft.Consumption/operations/read | List all supported operations by Microsoft.Consumption resource provider. |
> | Microsoft.Consumption/operationstatus/read | List operationstatus |
> | Microsoft.Consumption/pricesheets/read | List the Pricesheets data for a subscription or a management group. |
> | Microsoft.Consumption/reservationDetails/read | List the utilization details for reserved instances by reservation order or management groups. The details data is per instance per day level. |
> | Microsoft.Consumption/reservationRecommendations/read | List single or shared recommendations for Reserved instances for a subscription. |
> | Microsoft.Consumption/reservationSummaries/read | List the utilization summary for reserved instances by reservation order or management groups. The summary data is either at monthly or daily level. |
> | Microsoft.Consumption/reservationTransactions/read | List the transaction history for reserved instances by management groups. |
> | Microsoft.Consumption/tags/read | List tags for EA and subscriptions. |
> | Microsoft.Consumption/tenants/register/action | Register action for scope of Microsoft.Consumption by a tenant. |
> | Microsoft.Consumption/tenants/read | List tenants |
> | Microsoft.Consumption/terms/read | List the terms for a subscription or a management group. |
> | Microsoft.Consumption/usageDetails/read | List the usage details for a scope for EA and WebDirect subscriptions. |

### Microsoft.CostManagement

Azure service: [Cost Management](../cost-management-billing/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.CostManagement/query/action | Query usage data by a scope. |
> | Microsoft.CostManagement/reports/action | Schedule reports on usage data by a scope. |
> | Microsoft.CostManagement/exports/action | Run the specified export. |
> | Microsoft.CostManagement/register/action | Register action for scope of Microsoft.CostManagement by a subscription. |
> | Microsoft.CostManagement/views/action | Create view. |
> | Microsoft.CostManagement/forecast/action | Forecast usage data by a scope. |
> | Microsoft.CostManagement/alerts/write | Update alerts. |
> | Microsoft.CostManagement/cloudConnectors/read | List the cloudConnectors for the authenticated user. |
> | Microsoft.CostManagement/cloudConnectors/write | Create or update the specified cloudConnector. |
> | Microsoft.CostManagement/cloudConnectors/delete | Delete the specified cloudConnector. |
> | Microsoft.CostManagement/dimensions/read | List all supported dimensions by a scope. |
> | Microsoft.CostManagement/exports/read | List the exports by scope. |
> | Microsoft.CostManagement/exports/write | Create or update the specified export. |
> | Microsoft.CostManagement/exports/delete | Delete the specified export. |
> | Microsoft.CostManagement/exports/run/action | Run exports. |
> | Microsoft.CostManagement/externalBillingAccounts/read | List the externalBillingAccounts for the authenticated user. |
> | Microsoft.CostManagement/externalBillingAccounts/query/action | Query usage data for external BillingAccounts. |
> | Microsoft.CostManagement/externalBillingAccounts/forecast/action | Forecast usage data for external BillingAccounts. |
> | Microsoft.CostManagement/externalBillingAccounts/dimensions/read | List all supported dimensions for external BillingAccounts. |
> | Microsoft.CostManagement/externalBillingAccounts/externalSubscriptions/read | List the externalSubscriptions within an externalBillingAccount for the authenticated user. |
> | Microsoft.CostManagement/externalBillingAccounts/forecast/read | Forecast usage data for external BillingAccounts. |
> | Microsoft.CostManagement/externalBillingAccounts/query/read | Query usage data for external BillingAccounts. |
> | Microsoft.CostManagement/externalSubscriptions/read | List the externalSubscriptions for the authenticated user. |
> | Microsoft.CostManagement/externalSubscriptions/write | Update associated management group of externalSubscription |
> | Microsoft.CostManagement/externalSubscriptions/query/action | Query usage data for external subscription. |
> | Microsoft.CostManagement/externalSubscriptions/forecast/action | Forecast usage data for external BillingAccounts. |
> | Microsoft.CostManagement/externalSubscriptions/dimensions/read | List all supported dimensions for external subscription. |
> | Microsoft.CostManagement/externalSubscriptions/forecast/read | Forecast usage data for external BillingAccounts. |
> | Microsoft.CostManagement/externalSubscriptions/query/read | Query usage data for external subscription. |
> | Microsoft.CostManagement/forecast/read | Forecast usage data by a scope. |
> | Microsoft.CostManagement/operations/read | List all supported operations by Microsoft.CostManagement resource provider. |
> | Microsoft.CostManagement/query/read | Query usage data by a scope. |
> | Microsoft.CostManagement/reports/read | Schedule reports on usage data by a scope. |
> | Microsoft.CostManagement/tenants/register/action | Register action for scope of Microsoft.CostManagement by a tenant. |
> | Microsoft.CostManagement/views/read | List all saved views. |
> | Microsoft.CostManagement/views/delete | Delete saved views. |
> | Microsoft.CostManagement/views/write | Update view. |

### Microsoft.Features

Azure service: [Azure Resource Manager](../azure-resource-manager/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Features/register/action | Registers the feature of a subscription. |
> | Microsoft.Features/features/read | Gets the features of a subscription. |
> | Microsoft.Features/operations/read | Gets the list of operations. |
> | Microsoft.Features/providers/features/read | Gets the feature of a subscription in a given resource provider. |
> | Microsoft.Features/providers/features/register/action | Registers the feature for a subscription in a given resource provider. |
> | Microsoft.Features/providers/features/unregister/action | Unregisters the feature for a subscription in a given resource provider. |

### Microsoft.GuestConfiguration

Azure service: [Azure Policy](../governance/policy/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.GuestConfiguration/register/action | Registers the subscription for the Microsoft.GuestConfiguration resource provider. |
> | Microsoft.GuestConfiguration/guestConfigurationAssignments/write | Create new guest configuration assignment. |
> | Microsoft.GuestConfiguration/guestConfigurationAssignments/read | Get guest configuration assignment. |
> | Microsoft.GuestConfiguration/guestConfigurationAssignments/delete | Delete guest configuration assignment. |
> | Microsoft.GuestConfiguration/guestConfigurationAssignments/reports/read | Get guest configuration assignment report. |
> | Microsoft.GuestConfiguration/operations/read | Gets the operations for the Microsoft.GuestConfiguration resource provider |

### Microsoft.HybridCompute

Azure service: [Azure Arc](../azure-arc/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.HybridCompute/register/action | Registers the subscription for the Microsoft.HybridCompute Resource Provider |
> | Microsoft.HybridCompute/unregister/action | Unregisters the subscription for Microsoft.HybridCompute Resource Provider |
> | Microsoft.HybridCompute/locations/operationresults/read | Reads the status of an operation on Microsoft.HybridCompute Resource Provider |
> | Microsoft.HybridCompute/machines/read | Read any Azure Arc machines |
> | Microsoft.HybridCompute/machines/write | Writes an Azure Arc machines |
> | Microsoft.HybridCompute/machines/delete | Deletes an Azure Arc machines |
> | Microsoft.HybridCompute/machines/reconnect/action | Reconnects an Azure Arc machines |
> | Microsoft.HybridCompute/machines/extensions/read | Reads any Azure Arc extensions |
> | Microsoft.HybridCompute/machines/extensions/write | Installs or Updates an Azure Arc extensions |
> | Microsoft.HybridCompute/machines/extensions/delete | Deletes an Azure Arc extensions |
> | Microsoft.HybridCompute/operations/read | Read all Operations for Azure Arc for Servers |

### Microsoft.ManagedServices

Azure service: [Azure Lighthouse](../lighthouse/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ManagedServices/register/action | Register to Managed Services. |
> | Microsoft.ManagedServices/unregister/action | Unregister from Managed Services. |
> | Microsoft.ManagedServices/marketplaceRegistrationDefinitions/read | Retrieves a list of Managed Services registration definitions. |
> | Microsoft.ManagedServices/operations/read | Retrieves a list of Managed Services operations. |
> | Microsoft.ManagedServices/operationStatuses/read | Reads the operation status for the resource. |
> | Microsoft.ManagedServices/registrationAssignments/read | Retrieves a list of Managed Services registration assignments. |
> | Microsoft.ManagedServices/registrationAssignments/write | Add or modify Managed Services registration assignment. |
> | Microsoft.ManagedServices/registrationAssignments/delete | Removes Managed Services registration assignment. |
> | Microsoft.ManagedServices/registrationDefinitions/read | Retrieves a list of Managed Services registration definitions. |
> | Microsoft.ManagedServices/registrationDefinitions/write | Add or modify Managed Services registration definition. |
> | Microsoft.ManagedServices/registrationDefinitions/delete | Removes Managed Services registration definition. |

### Microsoft.Management

Azure service: [Management Groups](../governance/management-groups/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Management/checkNameAvailability/action | Checks if the specified management group name is valid and unique. |
> | Microsoft.Management/getEntities/action | List all entities (Management Groups, Subscriptions, etc.) for the authenticated user. |
> | Microsoft.Management/register/action | Register the specified subscription with Microsoft.Management |
> | Microsoft.Management/managementGroups/read | List management groups for the authenticated user. |
> | Microsoft.Management/managementGroups/write | Create or update a management group. |
> | Microsoft.Management/managementGroups/delete | Delete management group. |
> | Microsoft.Management/managementGroups/descendants/read | Gets all the descendants (Management Groups, Subscriptions) of a Management Group. |
> | Microsoft.Management/managementGroups/settings/read | Lists existing management group hierarchy settings. |
> | Microsoft.Management/managementGroups/settings/write | Creates or updates management group hierarchy settings. |
> | Microsoft.Management/managementGroups/settings/delete | Deletes management group hierarchy settings. |
> | Microsoft.Management/managementGroups/subscriptions/write | Associates existing subscription with the management group. |
> | Microsoft.Management/managementGroups/subscriptions/delete | De-associates subscription from the management group. |

### Microsoft.PolicyInsights

Azure service: [Azure Policy](../governance/policy/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.PolicyInsights/register/action | Registers the Microsoft Policy Insights resource provider and enables actions on it. |
> | Microsoft.PolicyInsights/unregister/action | Unregisters the Microsoft Policy Insights resource provider. |
> | Microsoft.PolicyInsights/asyncOperationResults/read | Gets the async operation result. |
> | Microsoft.PolicyInsights/operations/read | Gets supported operations on Microsoft.PolicyInsights namespace |
> | Microsoft.PolicyInsights/policyEvents/queryResults/action | Query information about policy events. |
> | Microsoft.PolicyInsights/policyEvents/queryResults/read | Query information about policy events. |
> | Microsoft.PolicyInsights/policyMetadata/read | Get Policy Metadata resources. |
> | Microsoft.PolicyInsights/policyStates/queryResults/action | Query information about policy states. |
> | Microsoft.PolicyInsights/policyStates/summarize/action | Query summary information about policy latest states. |
> | Microsoft.PolicyInsights/policyStates/triggerEvaluation/action | Triggers a new compliance evaluation for the selected scope. |
> | Microsoft.PolicyInsights/policyStates/queryResults/read | Query information about policy states. |
> | Microsoft.PolicyInsights/policyStates/summarize/read | Query summary information about policy latest states. |
> | Microsoft.PolicyInsights/policyTrackedResources/queryResults/read | Query information about resources required by DeployIfNotExists policies. |
> | Microsoft.PolicyInsights/remediations/read | Get policy remediations. |
> | Microsoft.PolicyInsights/remediations/write | Create or update Microsoft Policy remediations. |
> | Microsoft.PolicyInsights/remediations/delete | Delete policy remediations. |
> | Microsoft.PolicyInsights/remediations/cancel/action | Cancel in-progress Microsoft Policy remediations. |
> | Microsoft.PolicyInsights/remediations/listDeployments/read | Lists the deployments required by a policy remediation. |
> | **DataAction** | **Description** |
> | Microsoft.PolicyInsights/checkDataPolicyCompliance/action | Check the compliance status of a given component against data policies. |
> | Microsoft.PolicyInsights/policyEvents/logDataEvents/action | Log the resource component policy events. |

### Microsoft.Portal

Azure service: [Azure portal](../azure-portal/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Portal/register/action | Register to Portal |
> | Microsoft.Portal/consoles/delete | Removes the Cloud Shell instance. |
> | Microsoft.Portal/consoles/write | Create or update a Cloud Shell instance. |
> | Microsoft.Portal/consoles/read | Reads the Cloud Shell instance. |
> | Microsoft.Portal/dashboards/read | Reads the dashboards for the subscription. |
> | Microsoft.Portal/dashboards/write | Add or modify dashboard to a subscription. |
> | Microsoft.Portal/dashboards/delete | Removes the dashboard from the subscription. |
> | Microsoft.Portal/usersettings/delete | Removes the Cloud Shell user settings. |
> | Microsoft.Portal/usersettings/write | Create or update Cloud Shell user setting. |
> | Microsoft.Portal/usersettings/read | Reads the Cloud Shell user settings. |

### Microsoft.RecoveryServices

Azure service: [Site Recovery](../site-recovery/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.RecoveryServices/register/action | Registers subscription for given Resource Provider |
> | Microsoft.RecoveryServices/Locations/backupPreValidateProtection/action |  |
> | Microsoft.RecoveryServices/Locations/backupStatus/action | Check Backup Status for Recovery Services Vaults |
> | Microsoft.RecoveryServices/Locations/backupValidateFeatures/action | Validate Features |
> | Microsoft.RecoveryServices/locations/allocateStamp/action | AllocateStamp is internal operation used by service |
> | Microsoft.RecoveryServices/locations/checkNameAvailability/action | Check Resource Name Availability is an API to check if resource name is available |
> | Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
> | Microsoft.RecoveryServices/Locations/backupProtectedItem/write | Create a backup Protected Item |
> | Microsoft.RecoveryServices/Locations/backupProtectedItems/read | Returns the list of all Protected Items. |
> | Microsoft.RecoveryServices/locations/operationStatus/read | Gets Operation Status for a given Operation |
> | Microsoft.RecoveryServices/operations/read | Operation returns the list of Operations for a Resource Provider |
> | Microsoft.RecoveryServices/Vaults/backupJobsExport/action | Export Jobs |
> | Microsoft.RecoveryServices/Vaults/backupSecurityPIN/action | Returns Security PIN Information for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupValidateOperation/action | Validate Operation on Protected Item |
> | Microsoft.RecoveryServices/Vaults/write | Create Vault operation creates an Azure resource of type 'vault' |
> | Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | Microsoft.RecoveryServices/Vaults/delete | The Delete Vault operation deletes the specified Azure resource of type 'vault' |
> | Microsoft.RecoveryServices/Vaults/backupconfig/read | Returns Configuration for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupconfig/write | Updates Configuration for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupEncryptionConfigs/read | Gets Backup Resource Encryption Configuration. |
> | Microsoft.RecoveryServices/Vaults/backupEncryptionConfigs/write | Updates Backup Resource Encryption Configuration |
> | Microsoft.RecoveryServices/Vaults/backupEngines/read | Returns all the backup management servers registered with vault. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/refreshContainers/action | Refreshes the container list |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/delete | Delete a backup Protection Intent |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/read | Get a backup Protection Intent |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/write | Create a backup Protection Intent |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/read | Returns status of the operation |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/operationsStatus/read | Returns status of the operation |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectableContainers/read | Get all protectable containers |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/delete | Deletes the registered Container |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/inquire/action | Do inquiry for workloads within a container |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/read | Returns all registered containers |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/write | Creates a registered container |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/items/read | Get all items in a container |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/operationResults/read | Gets result of Operation performed on Protection Container. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/operationsStatus/read | Gets status of Operation performed on Protection Container. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/backup/action | Performs Backup for Protected Item. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/delete | Deletes Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/read | Returns object details of the Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/write | Create a backup Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationResults/read | Gets Result of Operation Performed on Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationsStatus/read | Returns the status of Operation performed on Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/provisionInstantItemRecovery/action | Provision Instant Item Recovery for Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/read | Get Recovery Points for Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/restore/action | Restore Recovery Points for Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/revokeInstantItemRecovery/action | Revoke Instant Item Recovery for Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupJobs/cancel/action | Cancel the Job |
> | Microsoft.RecoveryServices/Vaults/backupJobs/read | Returns all Job Objects |
> | Microsoft.RecoveryServices/Vaults/backupJobs/operationResults/read | Returns the Result of Job Operation. |
> | Microsoft.RecoveryServices/Vaults/backupJobs/operationsStatus/read | Returns the status of Job Operation. |
> | Microsoft.RecoveryServices/Vaults/backupOperationResults/read | Returns Backup Operation Result for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupOperations/read | Returns Backup Operation Status for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/delete | Delete a Protection Policy |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/read | Returns all Protection Policies |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/write | Creates Protection Policy |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/operationResults/read | Get Results of Policy Operation. |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/operations/read | Get Status of Policy Operation. |
> | Microsoft.RecoveryServices/Vaults/backupProtectableItems/read | Returns list of all Protectable Items. |
> | Microsoft.RecoveryServices/Vaults/backupProtectedItems/read | Returns the list of all Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupProtectionContainers/read | Returns all containers belonging to the subscription |
> | Microsoft.RecoveryServices/Vaults/backupProtectionIntents/read | List all backup Protection Intents |
> | Microsoft.RecoveryServices/Vaults/backupstorageconfig/read | Returns Storage Configuration for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupstorageconfig/write | Updates Storage Configuration for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read | Returns summaries for Protected Items and Protected Servers for a Recovery Services . |
> | Microsoft.RecoveryServices/Vaults/certificates/write | The Update Resource Certificate operation updates the resource/vault credential certificate. |
> | Microsoft.RecoveryServices/Vaults/extendedInformation/read | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.RecoveryServices/Vaults/extendedInformation/write | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.RecoveryServices/Vaults/extendedInformation/delete | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.RecoveryServices/Vaults/monitoringAlerts/read | Gets the alerts for the Recovery services vault. |
> | Microsoft.RecoveryServices/Vaults/monitoringAlerts/write | Resolves the alert. |
> | Microsoft.RecoveryServices/Vaults/monitoringConfigurations/read | Gets the Recovery services vault notification configuration. |
> | Microsoft.RecoveryServices/Vaults/monitoringConfigurations/write | Configures e-mail notifications to Recovery services vault. |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnectionProxies/delete | Wait for a few minutes and then try the operation again. If the issue persists, please contact Microsoft support. |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnectionProxies/read | Get all protectable containers |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnectionProxies/validate/action | Get all protectable containers |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnectionProxies/write | Get all protectable containers |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnectionProxies/operationsStatus/read | Get all protectable containers |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnections/delete | Delete Private Endpoint requests. This call is made by Backup Admin. |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnections/write | Approve or Reject Private Endpoint requests. This call is made by Backup Admin. |
> | Microsoft.RecoveryServices/Vaults/privateEndpointConnections/operationsStatus/read | Returns the operation status for a private endpoint connection. |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/write | The Register Service Container operation can be used to register a container with Recovery Service. |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/read | The Get Containers operation can be used get the containers registered for a resource. |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/delete | The UnRegister Container operation can be used to unregister a container. |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read | The Get Operation Results operation can be used get the operation status and result for the asynchronously submitted operation |
> | Microsoft.RecoveryServices/vaults/replicationAlertSettings/read | Read any Alerts Settings |
> | Microsoft.RecoveryServices/vaults/replicationAlertSettings/write | Create or Update any Alerts Settings |
> | Microsoft.RecoveryServices/vaults/replicationEvents/read | Read any Events |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/read | Read any Fabrics |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/write | Create or Update any Fabrics |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/remove/action | Remove Fabric |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/checkConsistency/action | Checks Consistency of the Fabric |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/delete | Delete any Fabrics |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/renewcertificate/action | Renew Certificate for Fabric |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/deployProcessServerImage/action | Deploy Process Server Image |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/reassociateGateway/action | Reassociate Gateway |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/migratetoaad/action | Migrate Fabric To AAD |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/operationresults/read | Track the results of an asynchronous operation on the resource Fabrics |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationLogicalNetworks/read | Read any Logical Networks |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/read | Read any Networks |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/read | Read any Network Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/write | Create or Update any Network Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/delete | Delete any Network Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/read | Read any Protection Containers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/discoverProtectableItem/action | Discover Protectable Item |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/write | Create or Update any Protection Containers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/remove/action | Remove Protection Container |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/switchprotection/action | Switch Protection Container |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/operationresults/read | Track the results of an asynchronous operation on the resource Protection Containers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/read | Read any Migration Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/write | Create or Update any Migration Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/delete | Delete any Migration Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/resync/action | Resynchronize |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/migrate/action | Migrate Item |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/testMigrate/action | Test Migrate |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/testMigrateCleanup/action | Test Migrate Cleanup |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/migrationRecoveryPoints/read | Read any Migration Recovery Points |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/operationresults/read | Track the results of an asynchronous operation on the resource Migration Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read | Read any Protectable Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read | Read any Protected Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/write | Create or Update any Protected Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/delete | Delete any Protected Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/remove/action | Remove Protected Item |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/plannedFailover/action | Planned Failover |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/unplannedFailover/action | Failover |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailover/action | Test Failover |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailoverCleanup/action | Test Failover Cleanup |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/failoverCommit/action | Failover Commit |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/reProtect/action | ReProtect Protected Item |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/updateMobilityService/action | Update Mobility Service |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/repairReplication/action | Repair replication |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/applyRecoveryPoint/action | Apply Recovery Point |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/submitFeedback/action | Submit Feedback |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/addDisks/action | Add disks |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/removeDisks/action | Remove disks |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/ResolveHealthErrors/action |  |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/operationresults/read | Track the results of an asynchronous operation on the resource Protected Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read | Read any Replication Recovery Points |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/targetComputeSizes/read | Read any Target Compute Sizes |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/read | Read any Protection Container Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/write | Create or Update any Protection Container Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/remove/action | Remove Protection Container Mapping |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/delete | Delete any Protection Container Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/operationresults/read | Track the results of an asynchronous operation on the resource Protection Container Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/read | Read any Recovery Services Providers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/write | Create or Update any Recovery Services Providers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/remove/action | Remove Recovery Services Provider |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/delete | Delete any Recovery Services Providers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/refreshProvider/action | Refresh Provider |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/operationresults/read | Track the results of an asynchronous operation on the resource Recovery Services Providers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/read | Read any Storage Classifications |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/read | Read any Storage Classification Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/write | Create or Update any Storage Classification Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/delete | Delete any Storage Classification Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/operationresults/read | Track the results of an asynchronous operation on the resource Storage Classification Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/read | Read any vCenters |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/write | Create or Update any vCenters |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/delete | Delete any vCenters |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/operationresults/read | Track the results of an asynchronous operation on the resource vCenters |
> | Microsoft.RecoveryServices/vaults/replicationJobs/read | Read any Jobs |
> | Microsoft.RecoveryServices/vaults/replicationJobs/cancel/action | Cancel Job |
> | Microsoft.RecoveryServices/vaults/replicationJobs/restart/action | Restart job |
> | Microsoft.RecoveryServices/vaults/replicationJobs/resume/action | Resume Job |
> | Microsoft.RecoveryServices/vaults/replicationJobs/operationresults/read | Track the results of an asynchronous operation on the resource Jobs |
> | Microsoft.RecoveryServices/vaults/replicationMigrationItems/read | Read any Migration Items |
> | Microsoft.RecoveryServices/vaults/replicationNetworkMappings/read | Read any Network Mappings |
> | Microsoft.RecoveryServices/vaults/replicationNetworks/read | Read any Networks |
> | Microsoft.RecoveryServices/vaults/replicationOperationStatus/read | Read any Vault Replication Operation Status |
> | Microsoft.RecoveryServices/vaults/replicationPolicies/read | Read any Policies |
> | Microsoft.RecoveryServices/vaults/replicationPolicies/write | Create or Update any Policies |
> | Microsoft.RecoveryServices/vaults/replicationPolicies/delete | Delete any Policies |
> | Microsoft.RecoveryServices/vaults/replicationPolicies/operationresults/read | Track the results of an asynchronous operation on the resource Policies |
> | Microsoft.RecoveryServices/vaults/replicationProtectedItems/read | Read any Protected Items |
> | Microsoft.RecoveryServices/vaults/replicationProtectionContainerMappings/read | Read any Protection Container Mappings |
> | Microsoft.RecoveryServices/vaults/replicationProtectionContainers/read | Read any Protection Containers |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/read | Read any Recovery Plans |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/write | Create or Update any Recovery Plans |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/delete | Delete any Recovery Plans |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/plannedFailover/action | Planned Failover Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/unplannedFailover/action | Failover Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailover/action | Test Failover Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailoverCleanup/action | Test Failover Cleanup Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/failoverCommit/action | Failover Commit Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/reProtect/action | ReProtect Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/operationresults/read | Track the results of an asynchronous operation on the resource Recovery Plans |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryServicesProviders/read | Read any Recovery Services Providers |
> | Microsoft.RecoveryServices/vaults/replicationStorageClassificationMappings/read | Read any Storage Classification Mappings |
> | Microsoft.RecoveryServices/vaults/replicationStorageClassifications/read | Read any Storage Classifications |
> | Microsoft.RecoveryServices/vaults/replicationSupportedOperatingSystems/read | Read any  |
> | Microsoft.RecoveryServices/vaults/replicationUsages/read | Read any Vault Replication Usages |
> | Microsoft.RecoveryServices/vaults/replicationVaultHealth/read | Read any Vault Replication Health |
> | Microsoft.RecoveryServices/vaults/replicationVaultHealth/refresh/action | Refresh Vault Health |
> | Microsoft.RecoveryServices/vaults/replicationVaultHealth/operationresults/read | Track the results of an asynchronous operation on the resource Vault Replication Health |
> | Microsoft.RecoveryServices/vaults/replicationVaultSettings/read | Read any  |
> | Microsoft.RecoveryServices/vaults/replicationVaultSettings/write | Create or Update any  |
> | Microsoft.RecoveryServices/vaults/replicationvCenters/read | Read any vCenters |
> | Microsoft.RecoveryServices/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
> | Microsoft.RecoveryServices/vaults/usages/read | Read any Vault Usages |
> | Microsoft.RecoveryServices/Vaults/vaultTokens/read | The Vault Token operation can be used to get Vault Token for vault level backend operations. |

### Microsoft.Resources

Azure service: [Azure Resource Manager](../azure-resource-manager/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Resources/checkResourceName/action | Check the resource name for validity. |
> | Microsoft.Resources/calculateTemplateHash/action | Calculate the hash of provided template. |
> | Microsoft.Resources/checkPolicyCompliance/read | Check the compliance status of a given resource against resource policies. |
> | Microsoft.Resources/deployments/read | Gets or lists deployments. |
> | Microsoft.Resources/deployments/write | Creates or updates an deployment. |
> | Microsoft.Resources/deployments/delete | Deletes a deployment. |
> | Microsoft.Resources/deployments/cancel/action | Cancels a deployment. |
> | Microsoft.Resources/deployments/validate/action | Validates an deployment. |
> | Microsoft.Resources/deployments/whatIf/action | Predicts template deployment changes. |
> | Microsoft.Resources/deployments/exportTemplate/action | Export template for a deployment |
> | Microsoft.Resources/deployments/operations/read | Gets or lists deployment operations. |
> | Microsoft.Resources/deployments/operationstatuses/read | Gets or lists deployment operation statuses. |
> | Microsoft.Resources/deploymentScripts/read | Gets or lists deployment scripts |
> | Microsoft.Resources/deploymentScripts/write | Creates or updates a deployment script |
> | Microsoft.Resources/deploymentScripts/delete | Deletes a deployment script |
> | Microsoft.Resources/deploymentScripts/logs/read | Gets or lists deployment script logs |
> | Microsoft.Resources/links/read | Gets or lists resource links. |
> | Microsoft.Resources/links/write | Creates or updates a resource link. |
> | Microsoft.Resources/links/delete | Deletes a resource link. |
> | Microsoft.Resources/marketplace/purchase/action | Purchases a resource from the marketplace. |
> | Microsoft.Resources/providers/read | Get the list of providers. |
> | Microsoft.Resources/resources/read | Get the list of resources based upon filters. |
> | Microsoft.Resources/subscriptions/read | Gets the list of subscriptions. |
> | Microsoft.Resources/subscriptions/locations/read | Gets the list of locations supported. |
> | Microsoft.Resources/subscriptions/operationresults/read | Get the subscription operation results. |
> | Microsoft.Resources/subscriptions/providers/read | Gets or lists resource providers. |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Resources/subscriptions/resourceGroups/write | Creates or updates a resource group. |
> | Microsoft.Resources/subscriptions/resourceGroups/delete | Deletes a resource group and all its resources. |
> | Microsoft.Resources/subscriptions/resourceGroups/moveResources/action | Moves resources from one resource group to another. |
> | Microsoft.Resources/subscriptions/resourceGroups/validateMoveResources/action | Validate move of resources from one resource group to another. |
> | Microsoft.Resources/subscriptions/resourcegroups/deployments/read | Gets or lists deployments. |
> | Microsoft.Resources/subscriptions/resourcegroups/deployments/write | Creates or updates an deployment. |
> | Microsoft.Resources/subscriptions/resourcegroups/deployments/operations/read | Gets or lists deployment operations. |
> | Microsoft.Resources/subscriptions/resourcegroups/deployments/operationstatuses/read | Gets or lists deployment operation statuses. |
> | Microsoft.Resources/subscriptions/resourcegroups/resources/read | Gets the resources for the resource group. |
> | Microsoft.Resources/subscriptions/resources/read | Gets resources of a subscription. |
> | Microsoft.Resources/subscriptions/tagNames/read | Gets or lists subscription tags. |
> | Microsoft.Resources/subscriptions/tagNames/write | Adds a subscription tag. |
> | Microsoft.Resources/subscriptions/tagNames/delete | Deletes a subscription tag. |
> | Microsoft.Resources/subscriptions/tagNames/tagValues/read | Gets or lists subscription tag values. |
> | Microsoft.Resources/subscriptions/tagNames/tagValues/write | Adds a subscription tag value. |
> | Microsoft.Resources/subscriptions/tagNames/tagValues/delete | Deletes a subscription tag value. |
> | Microsoft.Resources/tags/read | Gets all the tags on a resource. |
> | Microsoft.Resources/tags/write | Updates the tags on a resource by replacing or merging existing tags with a new set of tags, or removing existing tags. |
> | Microsoft.Resources/tags/delete | Removes all the tags on a resource. |
> | Microsoft.Resources/tenants/read | Gets the list of tenants. |

### Microsoft.Scheduler

Azure service: [Scheduler](../scheduler/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Scheduler/jobcollections/read | Get Job Collection |
> | Microsoft.Scheduler/jobcollections/write | Creates or updates job collection. |
> | Microsoft.Scheduler/jobcollections/delete | Deletes job collection. |
> | Microsoft.Scheduler/jobcollections/enable/action | Enables job collection. |
> | Microsoft.Scheduler/jobcollections/disable/action | Disables job collection. |
> | Microsoft.Scheduler/jobcollections/jobs/read | Gets job. |
> | Microsoft.Scheduler/jobcollections/jobs/write | Creates or updates job. |
> | Microsoft.Scheduler/jobcollections/jobs/delete | Deletes job. |
> | Microsoft.Scheduler/jobcollections/jobs/run/action | Runs job. |
> | Microsoft.Scheduler/jobcollections/jobs/generateLogicAppDefinition/action | Generates Logic App definition based on a Scheduler Job. |
> | Microsoft.Scheduler/jobcollections/jobs/jobhistories/read | Gets job history. |

### Microsoft.Solutions

Azure service: [Azure Managed Applications](../azure-resource-manager/managed-applications/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Solutions/register/action | Register to Solutions. |
> | Microsoft.Solutions/unregister/action | Unregisters from Solutions. |
> | Microsoft.Solutions/applicationDefinitions/read | Retrieves a list of application definitions. |
> | Microsoft.Solutions/applicationDefinitions/write | Add or modify an application definition. |
> | Microsoft.Solutions/applicationDefinitions/delete | Removes an application definition. |
> | Microsoft.Solutions/applicationDefinitions/applicationArtifacts/read | Lists application artifacts of application definition. |
> | Microsoft.Solutions/applications/read | Retrieves a list of applications. |
> | Microsoft.Solutions/applications/write | Creates an application. |
> | Microsoft.Solutions/applications/delete | Removes an application. |
> | Microsoft.Solutions/applications/refreshPermissions/action | Refreshes application permission(s). |
> | Microsoft.Solutions/applications/updateAccess/action | Updates application access. |
> | Microsoft.Solutions/applications/applicationArtifacts/read | Lists application artifacts. |
> | Microsoft.Solutions/jitRequests/read | Retrieves a list of JitRequests |
> | Microsoft.Solutions/jitRequests/write | Creates a JitRequest |
> | Microsoft.Solutions/jitRequests/delete | Remove a JitRequest |
> | Microsoft.Solutions/locations/operationStatuses/read | Reads the operation status for the resource. |
> | Microsoft.Solutions/operations/read | Gets the list of operations. |

### Microsoft.Subscription

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Subscription/CreateSubscription/action | Create an Azure subscription |
> | Microsoft.Subscription/register/action | Registers Subscription with Microsoft.Subscription resource provider |
> | Microsoft.Subscription/cancel/action | Cancels the Subscription |
> | Microsoft.Subscription/rename/action | Renames the subscription |
> | Microsoft.Subscription/SubscriptionDefinitions/read | Get an Azure subscription definition within a management group. |
> | Microsoft.Subscription/SubscriptionDefinitions/write | Create an Azure subscription definition |

## Intune

### Microsoft.Intune

Azure service: Microsoft Monitoring Insights

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Intune/diagnosticsettings/write | Writing a diagnostic setting |
> | Microsoft.Intune/diagnosticsettings/read | Reading a diagnostic setting |
> | Microsoft.Intune/diagnosticsettings/delete | Deleting a diagnostic setting |
> | Microsoft.Intune/diagnosticsettingscategories/read | Reading a diagnostic setting categories |

## Other

### Microsoft.BingMaps

Azure service: [Bing Maps](https://docs.microsoft.com/BingMaps/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.BingMaps/updateCommunicationPreference/action | Updates the communication preferences for the owner of Microsoft.BingMaps |
> | Microsoft.BingMaps/listCommunicationPreference/action | Gets the communication preferences for the owner of Microsoft.BingMaps |
> | Microsoft.BingMaps/mapApis/Read | Gets the resource for Microsoft.BingMaps/mapApis |
> | Microsoft.BingMaps/mapApis/Write | Updates the resource for Microsoft.BingMaps/mapApis |
> | Microsoft.BingMaps/mapApis/Delete | Deletes the resource for Microsoft.BingMaps/mapApis |
> | Microsoft.BingMaps/mapApis/regenerateKey/action | Regenerate key(s) for Microsoft.BingMaps/mapApis |
> | Microsoft.BingMaps/mapApis/listSecrets/action | List the secrets for Microsoft.BingMaps/mapApis |
> | Microsoft.BingMaps/mapApis/listUsageMetrics/action | List the metrics for Microsoft.BingMaps/mapApis |
> | Microsoft.BingMaps/Operations/read | List the operations for Microsoft.BingMaps |

## Next steps

- [Match resource provider to service](../azure-resource-manager/management/azure-services-resource-providers.md)
- [Azure built-in roles](built-in-roles.md)
- [Cloud Adoption Framework: Resource access management in Azure](/azure/cloud-adoption-framework/govern/resource-consistency/resource-access-management)
