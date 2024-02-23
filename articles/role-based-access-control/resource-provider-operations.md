---
title: Azure permissions - Azure RBAC
description: Lists the permissions for Azure resource providers.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 02/07/2024
ms.custom: generated
---

# Azure permissions

This article lists the permissions for Azure resource providers, which are used in built-in roles. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. The permissions are always evolving. To get the latest permissions, use [Get-AzProviderOperation](/powershell/module/az.resources/get-azprovideroperation) or [az provider operation list](/cli/azure/provider/operation#az-provider-operation-list).

Click the resource provider name in the following list to see the list of permissions.

<a name='microsoftresourcehealth'></a>
<a name='microsoftsupport'></a>

## General

- [Microsoft.Addons](./permissions/general.md#microsoftaddons)
- [Microsoft.Marketplace](./permissions/general.md#microsoftmarketplace)
- [Microsoft.MarketplaceOrdering](./permissions/general.md#microsoftmarketplaceordering)
- [Microsoft.Quota](./permissions/general.md#microsoftquota)
- [Microsoft.ResourceHealth](./permissions/general.md#microsoftresourcehealth)
- [Microsoft.Support](./permissions/general.md#microsoftsupport)

## Compute

- [microsoft.app](./permissions/compute.md#microsoftapp)
- [Microsoft.ClassicCompute](./permissions/compute.md#microsoftclassiccompute)
- [Microsoft.Compute](./permissions/compute.md#microsoftcompute)
- [Microsoft.DesktopVirtualization](./permissions/compute.md#microsoftdesktopvirtualization)
- [Microsoft.ServiceFabric](./permissions/compute.md#microsoftservicefabric)

<a name='microsoftnetwork'></a>

## Networking

- [Microsoft.Cdn](./permissions/networking.md#microsoftcdn)
- [Microsoft.ClassicNetwork](./permissions/networking.md#microsoftclassicnetwork)
- [Microsoft.MobileNetwork](./permissions/networking.md#microsoftmobilenetwork)
- [Microsoft.Network](./permissions/networking.md#microsoftnetwork)

<a name='microsoftdatashare'></a>
<a name='microsoftelasticsan'></a>
<a name='microsoftnetapp'></a>
<a name='microsoftstorage'></a>

## Storage

- [Microsoft.ClassicStorage](./permissions/storage.md#microsoftclassicstorage)
- [Microsoft.DataBox](./permissions/storage.md#microsoftdatabox)
- [Microsoft.DataShare](./permissions/storage.md#microsoftdatashare)
- [Microsoft.ElasticSan](./permissions/storage.md#microsoftelasticsan)
- [Microsoft.NetApp](./permissions/storage.md#microsoftnetapp)
- [Microsoft.Storage](./permissions/storage.md#microsoftstorage)
- [Microsoft.StorageCache](./permissions/storage.md#microsoftstoragecache)
- [Microsoft.StorageSync](./permissions/storage.md#microsoftstoragesync)

<a name='microsoftsearch'></a>
<a name='microsoftweb'></a>

## Web and Mobile

- [Microsoft.AppPlatform](./permissions/web-and-mobile.md#microsoftappplatform)
- [Microsoft.CertificateRegistration](./permissions/web-and-mobile.md#microsoftcertificateregistration)
- [Microsoft.Communication](./permissions/web-and-mobile.md#microsoftcommunication)
- [Microsoft.DomainRegistration](./permissions/web-and-mobile.md#microsoftdomainregistration)
- [Microsoft.Maps](./permissions/web-and-mobile.md#microsoftmaps)
- [Microsoft.Media](./permissions/web-and-mobile.md#microsoftmedia)
- [Microsoft.Search](./permissions/web-and-mobile.md#microsoftsearch)
- [Microsoft.SignalRService](./permissions/web-and-mobile.md#microsoftsignalrservice)
- [microsoft.web](./permissions/web-and-mobile.md#microsoftweb)

<a name='microsoftcontainerinstance'></a>
<a name='microsoftcontainerregistry'></a>
<a name='microsoftcontainerservice'></a>
<a name='microsoftkubernetes'></a>

## Containers

- [Microsoft.ContainerInstance](./permissions/containers.md#microsoftcontainerinstance)
- [Microsoft.ContainerRegistry](./permissions/containers.md#microsoftcontainerregistry)
- [Microsoft.ContainerService](./permissions/containers.md#microsoftcontainerservice)
- [Microsoft.Kubernetes](./permissions/containers.md#microsoftkubernetes)
- [Microsoft.KubernetesConfiguration](./permissions/containers.md#microsoftkubernetesconfiguration)
- [Microsoft.RedHatOpenShift](./permissions/containers.md#microsoftredhatopenshift)

<a name='microsoftdatafactory'></a>
<a name='microsoftdocumentdb'></a>

## Databases

- [Microsoft.Cache](./permissions/databases.md#microsoftcache)
- [Microsoft.DataFactory](./permissions/databases.md#microsoftdatafactory)
- [Microsoft.DataMigration](./permissions/databases.md#microsoftdatamigration)
- [Microsoft.DBforMariaDB](./permissions/databases.md#microsoftdbformariadb)
- [Microsoft.DBforMySQL](./permissions/databases.md#microsoftdbformysql)
- [Microsoft.DBforPostgreSQL](./permissions/databases.md#microsoftdbforpostgresql)
- [Microsoft.DocumentDB](./permissions/databases.md#microsoftdocumentdb)
- [Microsoft.Sql](./permissions/databases.md#microsoftsql)
- [Microsoft.SqlVirtualMachine](./permissions/databases.md#microsoftsqlvirtualmachine)

## Analytics

- [Microsoft.AnalysisServices](./permissions/analytics.md#microsoftanalysisservices)
- [Microsoft.Databricks](./permissions/analytics.md#microsoftdatabricks)
- [Microsoft.DataLakeAnalytics](./permissions/analytics.md#microsoftdatalakeanalytics)
- [Microsoft.DataLakeStore](./permissions/analytics.md#microsoftdatalakestore)
- [Microsoft.EventHub](./permissions/analytics.md#microsofteventhub)
- [Microsoft.HDInsight](./permissions/analytics.md#microsofthdinsight)
- [Microsoft.Kusto](./permissions/analytics.md#microsoftkusto)
- [Microsoft.PowerBIDedicated](./permissions/analytics.md#microsoftpowerbidedicated)
- [Microsoft.StreamAnalytics](./permissions/analytics.md#microsoftstreamanalytics)
- [Microsoft.Synapse](./permissions/analytics.md#microsoftsynapse)

## AI + machine learning

- [Microsoft.BotService](./permissions/ai-machine-learning.md#microsoftbotservice)
- [Microsoft.CognitiveServices](./permissions/ai-machine-learning.md#microsoftcognitiveservices)
- [Microsoft.MachineLearning](./permissions/ai-machine-learning.md#microsoftmachinelearning)
- [Microsoft.MachineLearningServices](./permissions/ai-machine-learning.md#microsoftmachinelearningservices)

## Internet of Things

- [Microsoft.DataBoxEdge](./permissions/internet-of-things.md#microsoftdataboxedge)
- [Microsoft.Devices](./permissions/internet-of-things.md#microsoftdevices)
- [Microsoft.DeviceUpdate](./permissions/internet-of-things.md#microsoftdeviceupdate)
- [Microsoft.DigitalTwins](./permissions/internet-of-things.md#microsoftdigitaltwins)
- [Microsoft.IoTCentral](./permissions/internet-of-things.md#microsoftiotcentral)
- [Microsoft.IoTSecurity](./permissions/internet-of-things.md#microsoftiotsecurity)
- [Microsoft.NotificationHubs](./permissions/internet-of-things.md#microsoftnotificationhubs)
- [Microsoft.TimeSeriesInsights](./permissions/internet-of-things.md#microsofttimeseriesinsights)

## Mixed reality

- [Microsoft.MixedReality](./permissions/mixed-reality.md#microsoftmixedreality)

<a name='microsoftapimanagement'></a>

## Integration

- [Microsoft.ApiManagement](./permissions/integration.md#microsoftapimanagement)
- [Microsoft.AppConfiguration](./permissions/integration.md#microsoftappconfiguration)
- [Microsoft.AVS](./permissions/integration.md#microsoftavs)
- [Microsoft.DataCatalog](./permissions/integration.md#microsoftdatacatalog)
- [Microsoft.EventGrid](./permissions/integration.md#microsofteventgrid)
- [Microsoft.HealthcareApis](./permissions/integration.md#microsofthealthcareapis)
- [Microsoft.Logic](./permissions/integration.md#microsoftlogic)
- [Microsoft.Relay](./permissions/integration.md#microsoftrelay)
- [Microsoft.ServiceBus](./permissions/integration.md#microsoftservicebus)
- [Microsoft.ServicesHub](./permissions/integration.md#microsoftserviceshub)

## Identity

- [Microsoft.AAD](./permissions/identity.md#microsoftaad)
- [microsoft.aadiam](./permissions/identity.md#microsoftaadiam)
- [Microsoft.ADHybridHealthService](./permissions/identity.md#microsoftadhybridhealthservice)
- [Microsoft.AzureActiveDirectory](./permissions/identity.md#microsoftazureactivedirectory)
- [Microsoft.ManagedIdentity](./permissions/identity.md#microsoftmanagedidentity)

<a name='microsoftsecurityinsights'></a>

## Security

- [Microsoft.AppComplianceAutomation](./permissions/security.md#microsoftappcomplianceautomation)
- [Microsoft.KeyVault](./permissions/security.md#microsoftkeyvault)
- [Microsoft.Security](./permissions/security.md#microsoftsecurity)
- [Microsoft.SecurityGraph](./permissions/security.md#microsoftsecuritygraph)
- [Microsoft.SecurityInsights](./permissions/security.md#microsoftsecurityinsights)

## DevOps

- [Microsoft.Chaos](./permissions/devops.md#microsoftchaos)
- [Microsoft.DevTestLab](./permissions/devops.md#microsoftdevtestlab)
- [Microsoft.LabServices](./permissions/devops.md#microsoftlabservices)
- [Microsoft.LoadTestService](./permissions/devops.md#microsoftloadtestservice)
- [Microsoft.SecurityDevOps](./permissions/devops.md#microsoftsecuritydevops)
- [Microsoft.VisualStudio](./permissions/devops.md#microsoftvisualstudio)

## Migration

- [Microsoft.Migrate](./permissions/migration.md#microsoftmigrate)
- [Microsoft.OffAzure](./permissions/migration.md#microsoftoffazure)

<a name='microsoftoperationalinsights'></a>

## Monitor

- [Microsoft.AlertsManagement](./permissions/monitor.md#microsoftalertsmanagement)
- [Microsoft.Dashboard](./permissions/monitor.md#microsoftdashboard)
- [Microsoft.Insights](./permissions/monitor.md#microsoftinsights)
- [Microsoft.Monitor](./permissions/monitor.md#microsoftmonitor)
- [Microsoft.OperationalInsights](./permissions/monitor.md#microsoftoperationalinsights)
- [Microsoft.OperationsManagement](./permissions/monitor.md#microsoftoperationsmanagement)

<a name='microsoftauthorization'></a>
<a name='microsoftautomation'></a>
<a name='microsoftcostmanagement'></a>
<a name='microsoftpolicyinsights'></a>

## Management and governance

- [Microsoft.Advisor](./permissions/management-and-governance.md#microsoftadvisor)
- [Microsoft.Authorization](./permissions/management-and-governance.md#microsoftauthorization)
- [Microsoft.Automation](./permissions/management-and-governance.md#microsoftautomation)
- [Microsoft.Batch](./permissions/management-and-governance.md#microsoftbatch)
- [Microsoft.Billing](./permissions/management-and-governance.md#microsoftbilling)
- [Microsoft.Blueprint](./permissions/management-and-governance.md#microsoftblueprint)
- [Microsoft.Capacity](./permissions/management-and-governance.md#microsoftcapacity)
- [Microsoft.Commerce](./permissions/management-and-governance.md#microsoftcommerce)
- [Microsoft.Consumption](./permissions/management-and-governance.md#microsoftconsumption)
- [Microsoft.CostManagement](./permissions/management-and-governance.md#microsoftcostmanagement)
- [Microsoft.DataProtection](./permissions/management-and-governance.md#microsoftdataprotection)
- [Microsoft.Features](./permissions/management-and-governance.md#microsoftfeatures)
- [Microsoft.GuestConfiguration](./permissions/management-and-governance.md#microsoftguestconfiguration)
- [Microsoft.Intune](./permissions/management-and-governance.md#microsoftintune)
- [Microsoft.ManagedServices](./permissions/management-and-governance.md#microsoftmanagedservices)
- [Microsoft.Management](./permissions/management-and-governance.md#microsoftmanagement)
- [Microsoft.PolicyInsights](./permissions/management-and-governance.md#microsoftpolicyinsights)
- [Microsoft.Portal](./permissions/management-and-governance.md#microsoftportal)
- [Microsoft.Purview](./permissions/management-and-governance.md#microsoftpurview)
- [Microsoft.RecoveryServices](./permissions/management-and-governance.md#microsoftrecoveryservices)
- [Microsoft.ResourceGraph](./permissions/management-and-governance.md#microsoftresourcegraph)
- [Microsoft.Resources](./permissions/management-and-governance.md#microsoftresources)
- [Microsoft.Solutions](./permissions/management-and-governance.md#microsoftsolutions)
- [Microsoft.Subscription](./permissions/management-and-governance.md#microsoftsubscription)

## Hybrid + multicloud

- [Microsoft.AzureStack](./permissions/hybrid-multicloud.md#microsoftazurestack)
- [Microsoft.AzureStackHCI](./permissions/hybrid-multicloud.md#microsoftazurestackhci)
- [Microsoft.HybridCompute](./permissions/hybrid-multicloud.md#microsofthybridcompute)
- [Microsoft.HybridConnectivity](./permissions/hybrid-multicloud.md#microsofthybridconnectivity)

## Next steps

- [Match resource provider to service](/azure/azure-resource-manager/management/azure-services-resource-providers)
- [Azure built-in roles](/azure/role-based-access-control/built-in-roles)
- [Cloud Adoption Framework: Resource access management in Azure](/azure/cloud-adoption-framework/govern/resource-consistency/resource-access-management)
