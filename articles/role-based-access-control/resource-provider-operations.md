---
title: Azure resource provider operations
description: Lists the operations for Azure resource providers.
services: active-directory
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 06/11/2023
ms.custom: generated
---

# Azure resource provider operations

This section lists the operations for Azure resource providers, which are used in built-in roles. You can use these operations in your own [Azure custom roles](custom-roles.md) to provide granular access control to resources in Azure. The resource provider operations are always evolving. To get the latest operations, use [Get-AzProviderOperation](/powershell/module/az.resources/get-azprovideroperation) or [az provider operation list](/cli/azure/provider/operation#az-provider-operation-list).

Click the resource provider name in the following table to see the list of operations.

## All

| General |
| --- |
| [Microsoft.Addons](#microsoftaddons) |
| [Microsoft.Marketplace](#microsoftmarketplace) |
| [Microsoft.MarketplaceOrdering](#microsoftmarketplaceordering) |
| [Microsoft.Quota](#microsoftquota) |
| [Microsoft.ResourceHealth](#microsoftresourcehealth) |
| [Microsoft.Support](#microsoftsupport) |
| **Compute** |
| [microsoft.app](#microsoftapp) |
| [Microsoft.ClassicCompute](#microsoftclassiccompute) |
| [Microsoft.Compute](#microsoftcompute) |
| [Microsoft.ServiceFabric](#microsoftservicefabric) |
| **Networking** |
| [Microsoft.Cdn](#microsoftcdn) |
| [Microsoft.ClassicNetwork](#microsoftclassicnetwork) |
| [Microsoft.HybridConnectivity](#microsofthybridconnectivity) |
| [Microsoft.MobileNetwork](#microsoftmobilenetwork) |
| [Microsoft.Network](#microsoftnetwork) |
| **Storage** |
| [Microsoft.ClassicStorage](#microsoftclassicstorage) |
| [Microsoft.DataBox](#microsoftdatabox) |
| [Microsoft.DataShare](#microsoftdatashare) |
| [Microsoft.ElasticSan](#microsoftelasticsan) |
| [Microsoft.NetApp](#microsoftnetapp) |
| [Microsoft.Storage](#microsoftstorage) |
| [Microsoft.StorageCache](#microsoftstoragecache) |
| [Microsoft.StorageSync](#microsoftstoragesync) |
| [Microsoft.StorSimple](#microsoftstorsimple) |
| **Web** |
| [Microsoft.AppPlatform](#microsoftappplatform) |
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
| [Microsoft.RedHatOpenShift](#microsoftredhatopenshift) |
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
| [Microsoft.Synapse](#microsoftsynapse) |
| **AI + machine learning** |
| [Microsoft.BotService](#microsoftbotservice) |
| [Microsoft.CognitiveServices](#microsoftcognitiveservices) |
| [Microsoft.MachineLearning](#microsoftmachinelearning) |
| [Microsoft.MachineLearningServices](#microsoftmachinelearningservices) |
| **Internet of things** |
| [Microsoft.Devices](#microsoftdevices) |
| [Microsoft.DeviceUpdate](#microsoftdeviceupdate) |
| [Microsoft.IoTCentral](#microsoftiotcentral) |
| [Microsoft.IoTSecurity](#microsoftiotsecurity) |
| [Microsoft.NotificationHubs](#microsoftnotificationhubs) |
| [Microsoft.TimeSeriesInsights](#microsofttimeseriesinsights) |
| **Mixed reality** |
| [Microsoft.MixedReality](#microsoftmixedreality) |
| **Integration** |
| [Microsoft.ApiManagement](#microsoftapimanagement) |
| [Microsoft.AppConfiguration](#microsoftappconfiguration) |
| [Microsoft.AzureStack](#microsoftazurestack) |
| [Microsoft.AzureStackHCI](#microsoftazurestackhci) |
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
| [Microsoft.AppComplianceAutomation](#microsoftappcomplianceautomation) |
| [Microsoft.KeyVault](#microsoftkeyvault) |
| [Microsoft.Security](#microsoftsecurity) |
| [Microsoft.SecurityGraph](#microsoftsecuritygraph) |
| [Microsoft.SecurityInsights](#microsoftsecurityinsights) |
| **DevOps** |
| [Microsoft.DevTestLab](#microsoftdevtestlab) |
| [Microsoft.LabServices](#microsoftlabservices) |
| [Microsoft.SecurityDevOps](#microsoftsecuritydevops) |
| [Microsoft.VisualStudio](#microsoftvisualstudio) |
| **Migration** |
| [Microsoft.Migrate](#microsoftmigrate) |
| [Microsoft.OffAzure](#microsoftoffazure) |
| **Monitor** |
| [Microsoft.AlertsManagement](#microsoftalertsmanagement) |
| [Microsoft.Insights](#microsoftinsights) |
| [Microsoft.Monitor](#microsoftmonitor) |
| [Microsoft.OperationalInsights](#microsoftoperationalinsights) |
| [Microsoft.OperationsManagement](#microsoftoperationsmanagement) |
| **Management and governance** |
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
| [Microsoft.DataProtection](#microsoftdataprotection) |
| [Microsoft.Features](#microsoftfeatures) |
| [Microsoft.GuestConfiguration](#microsoftguestconfiguration) |
| [Microsoft.HybridCompute](#microsofthybridcompute) |
| [Microsoft.Kubernetes](#microsoftkubernetes) |
| [Microsoft.KubernetesConfiguration](#microsoftkubernetesconfiguration) |
| [Microsoft.ManagedServices](#microsoftmanagedservices) |
| [Microsoft.Management](#microsoftmanagement) |
| [Microsoft.PolicyInsights](#microsoftpolicyinsights) |
| [Microsoft.Portal](#microsoftportal) |
| [Microsoft.RecoveryServices](#microsoftrecoveryservices) |
| [Microsoft.ResourceGraph](#microsoftresourcegraph) |
| [Microsoft.Resources](#microsoftresources) |
| [Microsoft.Solutions](#microsoftsolutions) |
| [Microsoft.Subscription](#microsoftsubscription) |
| **Intune** |
| [Microsoft.Intune](#microsoftintune) |
| **Virtual desktop infrastructure** |
| [Microsoft.DesktopVirtualization](#microsoftdesktopvirtualization) |
| **Other** |
| [Microsoft.Chaos](#microsoftchaos) |
| [Microsoft.Dashboard](#microsoftdashboard) |
| [Microsoft.DigitalTwins](#microsoftdigitaltwins) |
| [Microsoft.LoadTestService](#microsoftloadtestservice) |
| [Microsoft.ServicesHub](#microsoftserviceshub) |


## General

[!INCLUDE [general](./includes/resource-provider-operations/general.md)]

## Compute

[!INCLUDE [compute](./includes/resource-provider-operations/compute.md)]

## Networking

[!INCLUDE [networking](./includes/resource-provider-operations/networking.md)]

## Storage

[!INCLUDE [storage](./includes/resource-provider-operations/storage.md)]

## Web

[!INCLUDE [web](./includes/resource-provider-operations/web.md)]

## Containers

[!INCLUDE [containers](./includes/resource-provider-operations/containers.md)]

## Databases

[!INCLUDE [databases](./includes/resource-provider-operations/databases.md)]

## Analytics

[!INCLUDE [analytics](./includes/resource-provider-operations/analytics.md)]

## AI + machine learning

[!INCLUDE [ai-machine-learning](./includes/resource-provider-operations/ai-machine-learning.md)]

## Internet of things

[!INCLUDE [internet-of-things](./includes/resource-provider-operations/internet-of-things.md)]

## Mixed reality

[!INCLUDE [mixed-reality](./includes/resource-provider-operations/mixed-reality.md)]

## Integration

[!INCLUDE [integration](./includes/resource-provider-operations/integration.md)]

## Identity

[!INCLUDE [identity](./includes/resource-provider-operations/identity.md)]

## Security

[!INCLUDE [security](./includes/resource-provider-operations/security.md)]

## DevOps

[!INCLUDE [devops](./includes/resource-provider-operations/devops.md)]

## Migration

[!INCLUDE [migration](./includes/resource-provider-operations/migration.md)]

## Monitor

[!INCLUDE [monitor](./includes/resource-provider-operations/monitor.md)]

## Management and governance

[!INCLUDE [management-and-governance](./includes/resource-provider-operations/management-and-governance.md)]

## Intune

[!INCLUDE [intune](./includes/resource-provider-operations/intune.md)]

## Virtual desktop infrastructure

[!INCLUDE [virtual-desktop-infrastructure](./includes/resource-provider-operations/virtual-desktop-infrastructure.md)]

## Other

[!INCLUDE [other](./includes/resource-provider-operations/other.md)]

## Next steps

- [Match resource provider to service](../azure-resource-manager/management/azure-services-resource-providers.md)
- [Azure built-in roles](built-in-roles.md)
- [Cloud Adoption Framework: Resource access management in Azure](/azure/cloud-adoption-framework/govern/resource-consistency/resource-access-management)
