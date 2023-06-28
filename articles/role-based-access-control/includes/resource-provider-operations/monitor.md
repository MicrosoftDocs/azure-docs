---
title: Monitor resource provider operations include file
description: Monitor resource provider operations include file
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.workload: identity
ms.topic: include
ms.date: 06/01/2023
ms.author: rolyon
ms.custom: generated
---

### Microsoft.AlertsManagement

Azure service: [Azure Monitor](../../../azure-monitor/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AlertsManagement/register/action | Subscription Registration Action |
> | Microsoft.AlertsManagement/register/action | Registers the subscription for the Microsoft Alerts Management |
> | Microsoft.AlertsManagement/migrateFromSmartDetection/action | Starts an asynchronous migration process of Smart Detection to smart alerts in an Application Insights resource |
> | Microsoft.AlertsManagement/actionRules/read | Get all the alert processing rules for the input filters. |
> | Microsoft.AlertsManagement/actionRules/write | Create or update alert processing rule in a given subscription |
> | Microsoft.AlertsManagement/actionRules/delete | Delete alert processing rule in a given subscription. |
> | Microsoft.AlertsManagement/alertRuleRecommendations/read | Read alertRuleRecommendations |
> | Microsoft.AlertsManagement/alerts/read | Get all the alerts for the input filters. |
> | Microsoft.AlertsManagement/alerts/changestate/action | Change the state of the alert. |
> | Microsoft.AlertsManagement/alerts/history/read | Get history of the alert |
> | Microsoft.AlertsManagement/alertsMetaData/read | Get alerts meta data for the input parameter. |
> | Microsoft.AlertsManagement/alertsSummary/read | Get the summary of alerts |
> | Microsoft.AlertsManagement/migrateFromSmartDetection/read | Get the status of an asynchronous Smart Detection to smart alerts migration process |
> | Microsoft.AlertsManagement/Operations/read | Reads the operations provided |
> | Microsoft.AlertsManagement/prometheusRuleGroups/write | Set prometheusRuleGroups |
> | Microsoft.AlertsManagement/prometheusRuleGroups/delete | Delete prometheusRuleGroups |
> | Microsoft.AlertsManagement/prometheusRuleGroups/read | Read prometheusRuleGroups |
> | Microsoft.AlertsManagement/resourceHealthAlertRules/write | Create or update Resource Health alert rule in a given subscription |
> | Microsoft.AlertsManagement/resourceHealthAlertRules/read | Get all the Resource Health alert rules for the input filters |
> | Microsoft.AlertsManagement/resourceHealthAlertRules/delete | Delete Resource Health alert rule in a given subscription |
> | Microsoft.AlertsManagement/smartDetectorAlertRules/write | Create or update Smart Detector alert rule in a given subscription |
> | Microsoft.AlertsManagement/smartDetectorAlertRules/read | Get all the Smart Detector alert rules for the input filters |
> | Microsoft.AlertsManagement/smartDetectorAlertRules/delete | Delete Smart Detector alert rule in a given subscription |
> | Microsoft.AlertsManagement/smartGroups/read | Get all the smart groups for the input filters |
> | Microsoft.AlertsManagement/smartGroups/changestate/action | Change the state of the smart group |
> | Microsoft.AlertsManagement/smartGroups/history/read | Get history of the smart group |

### Microsoft.Insights

Azure service: [Azure Monitor](../../../azure-monitor/index.yml)

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
> | Microsoft.Insights/actionGroups/NetworkSecurityPerimeterAssociationProxies/Read | Read a action group endpoint NSP association proxy |
> | Microsoft.Insights/actionGroups/NetworkSecurityPerimeterAssociationProxies/Write | Create or update a action group endpoint NSP association proxy |
> | Microsoft.Insights/actionGroups/NetworkSecurityPerimeterAssociationProxies/Delete | Delete a action group endpoint NSP association proxy |
> | Microsoft.Insights/actionGroups/NetworkSecurityPerimeterConfigurations/Read | Read action group endpoint effective NSP configuration |
> | Microsoft.Insights/actionGroups/NetworkSecurityPerimeterConfigurations/Reconcile/Action | Reconcile action group endpoint NSP configuration |
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
> | Microsoft.Insights/AutoscaleSettings/PredictiveScaleup/Action | Predictive Autoscale scale up initiated |
> | Microsoft.Insights/AutoscaleSettings/Scaledown/Action | Autoscale scale down initiated |
> | Microsoft.Insights/AutoscaleSettings/PredictiveScaleupResult/Action | Predictive Autoscale scale up completed |
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
> | Microsoft.Insights/CreateNotifications/Write | Send test notifications to the provided receiver list |
> | Microsoft.Insights/DataCollectionEndpoints/Read | Read a data collection endpoint |
> | Microsoft.Insights/DataCollectionEndpoints/Write | Create or update a data collection endpoint |
> | Microsoft.Insights/DataCollectionEndpoints/Delete | Delete a data collection endpoint |
> | Microsoft.Insights/DataCollectionEndpoints/TriggerFailover/Action | Trigger failover on a data collection endpoint |
> | Microsoft.Insights/DataCollectionEndpoints/NetworkSecurityPerimeterAssociationProxies/Read | Read a data collection endpoint NSP association proxy |
> | Microsoft.Insights/DataCollectionEndpoints/NetworkSecurityPerimeterAssociationProxies/Write | Create or update a data collection endpoint NSP association proxy |
> | Microsoft.Insights/DataCollectionEndpoints/NetworkSecurityPerimeterAssociationProxies/Delete | Delete a data collection endpoint NSP association proxy |
> | Microsoft.Insights/DataCollectionEndpoints/NetworkSecurityPerimeterConfigurations/Read | Read data collection endpoint effective NSP configuration |
> | Microsoft.Insights/DataCollectionEndpoints/NetworkSecurityPerimeterConfigurations/Reconcile/Action | Reconcile data collection endpoint NSP configuration |
> | Microsoft.Insights/DataCollectionEndpoints/ScopedPrivateLinkProxies/Read | Read a data collection endpoint private link proxy |
> | Microsoft.Insights/DataCollectionEndpoints/ScopedPrivateLinkProxies/Write | Create or update a data collection endpoint private link proxy |
> | Microsoft.Insights/DataCollectionEndpoints/ScopedPrivateLinkProxies/Delete | Delete a data collection endpoint private link proxy |
> | Microsoft.Insights/DataCollectionRuleAssociations/Read | Read a resource's association with a data collection rule |
> | Microsoft.Insights/DataCollectionRuleAssociations/Write | Create or update a resource's association with a data collection rule |
> | Microsoft.Insights/DataCollectionRuleAssociations/Delete | Delete a resource's association with a data collection rule |
> | Microsoft.Insights/DataCollectionRules/Read | Read a data collection rule |
> | Microsoft.Insights/DataCollectionRules/Write | Create or update a data collection rule |
> | Microsoft.Insights/DataCollectionRules/Delete | Delete a data collection rule |
> | Microsoft.Insights/DiagnosticSettings/Write | Create or update a resource diagnostic setting |
> | Microsoft.Insights/DiagnosticSettings/Delete | Delete a resource diagnostic setting |
> | Microsoft.Insights/DiagnosticSettings/Read | Read a resource diagnostic setting |
> | Microsoft.Insights/DiagnosticSettingsCategories/Read | Read diagnostic settings categories |
> | Microsoft.Insights/EventCategories/Read | Read available Activity Log event categories |
> | Microsoft.Insights/eventtypes/digestevents/Read | Read management event type digest |
> | Microsoft.Insights/eventtypes/values/Read | Read Activity Log events |
> | Microsoft.Insights/ExtendedDiagnosticSettings/Write | Create or update a network flow log diagnostic setting |
> | Microsoft.Insights/ExtendedDiagnosticSettings/Delete | Delete a network flow log diagnostic setting |
> | Microsoft.Insights/ExtendedDiagnosticSettings/Read | Read a network flow log diagnostic setting |
> | Microsoft.Insights/generateLiveToken/Read | Live Metrics get token |
> | Microsoft.Insights/ListMigrationDate/Read | Get back subscription migration date |
> | Microsoft.Insights/LogDefinitions/Read | Read log definitions |
> | Microsoft.Insights/LogProfiles/Write | Create or update an Activity Log log profile |
> | Microsoft.Insights/LogProfiles/Delete | Delete an Activity Log log profile |
> | Microsoft.Insights/LogProfiles/Read | Read an Activity Log log profile |
> | Microsoft.Insights/Logs/Read | Reading data from all your logs |
> | Microsoft.Insights/Logs/AADDomainServicesAccountLogon/Read | Read data from the AADDomainServicesAccountLogon table |
> | Microsoft.Insights/Logs/AADDomainServicesAccountManagement/Read | Read data from the AADDomainServicesAccountManagement table |
> | Microsoft.Insights/Logs/AADDomainServicesDirectoryServiceAccess/Read | Read data from the AADDomainServicesDirectoryServiceAccess table |
> | Microsoft.Insights/Logs/AADDomainServicesLogonLogoff/Read | Read data from the AADDomainServicesLogonLogoff table |
> | Microsoft.Insights/Logs/AADDomainServicesPolicyChange/Read | Read data from the AADDomainServicesPolicyChange table |
> | Microsoft.Insights/Logs/AADDomainServicesPrivilegeUse/Read | Read data from the AADDomainServicesPrivilegeUse table |
> | Microsoft.Insights/Logs/AADDomainServicesSystemSecurity/Read | Read data from the AADDomainServicesSystemSecurity table |
> | Microsoft.Insights/Logs/AADManagedIdentitySignInLogs/Read | Read data from the AADManagedIdentitySignInLogs table |
> | Microsoft.Insights/Logs/AADNonInteractiveUserSignInLogs/Read | Read data from the AADNonInteractiveUserSignInLogs table |
> | Microsoft.Insights/Logs/AADServicePrincipalSignInLogs/Read | Read data from the AADServicePrincipalSignInLogs table |
> | Microsoft.Insights/Logs/ADAssessmentRecommendation/Read | Read data from the ADAssessmentRecommendation table |
> | Microsoft.Insights/Logs/AddonAzureBackupAlerts/Read | Read data from the AddonAzureBackupAlerts table |
> | Microsoft.Insights/Logs/AddonAzureBackupJobs/Read | Read data from the AddonAzureBackupJobs table |
> | Microsoft.Insights/Logs/AddonAzureBackupPolicy/Read | Read data from the AddonAzureBackupPolicy table |
> | Microsoft.Insights/Logs/AddonAzureBackupProtectedInstance/Read | Read data from the AddonAzureBackupProtectedInstance table |
> | Microsoft.Insights/Logs/AddonAzureBackupStorage/Read | Read data from the AddonAzureBackupStorage table |
> | Microsoft.Insights/Logs/ADFActivityRun/Read | Read data from the ADFActivityRun table |
> | Microsoft.Insights/Logs/ADFPipelineRun/Read | Read data from the ADFPipelineRun table |
> | Microsoft.Insights/Logs/ADFSSISIntegrationRuntimeLogs/Read | Read data from the ADFSSISIntegrationRuntimeLogs table |
> | Microsoft.Insights/Logs/ADFSSISPackageEventMessageContext/Read | Read data from the ADFSSISPackageEventMessageContext table |
> | Microsoft.Insights/Logs/ADFSSISPackageEventMessages/Read | Read data from the ADFSSISPackageEventMessages table |
> | Microsoft.Insights/Logs/ADFSSISPackageExecutableStatistics/Read | Read data from the ADFSSISPackageExecutableStatistics table |
> | Microsoft.Insights/Logs/ADFSSISPackageExecutionComponentPhases/Read | Read data from the ADFSSISPackageExecutionComponentPhases table |
> | Microsoft.Insights/Logs/ADFSSISPackageExecutionDataStatistics/Read | Read data from the ADFSSISPackageExecutionDataStatistics table |
> | Microsoft.Insights/Logs/ADFTriggerRun/Read | Read data from the ADFTriggerRun table |
> | Microsoft.Insights/Logs/ADReplicationResult/Read | Read data from the ADReplicationResult table |
> | Microsoft.Insights/Logs/ADSecurityAssessmentRecommendation/Read | Read data from the ADSecurityAssessmentRecommendation table |
> | Microsoft.Insights/Logs/ADTDigitalTwinsOperation/Read | Read data from the ADTDigitalTwinsOperation table |
> | Microsoft.Insights/Logs/ADTEventRoutesOperation/Read | Read data from the ADTEventRoutesOperation table |
> | Microsoft.Insights/Logs/ADTModelsOperation/Read | Read data from the ADTModelsOperation table |
> | Microsoft.Insights/Logs/ADTQueryOperation/Read | Read data from the ADTQueryOperation table |
> | Microsoft.Insights/Logs/AegDeliveryFailureLogs/Read | Read data from the AegDeliveryFailureLogs table |
> | Microsoft.Insights/Logs/AegPublishFailureLogs/Read | Read data from the AegPublishFailureLogs table |
> | Microsoft.Insights/Logs/Alert/Read | Read data from the Alert table |
> | Microsoft.Insights/Logs/AlertHistory/Read | Read data from the AlertHistory table |
> | Microsoft.Insights/Logs/AmlComputeClusterEvent/Read | Read data from the AmlComputeClusterEvent table |
> | Microsoft.Insights/Logs/AmlComputeClusterNodeEvent/Read | Read data from the AmlComputeClusterNodeEvent table |
> | Microsoft.Insights/Logs/AmlComputeCpuGpuUtilization/Read | Read data from the AmlComputeCpuGpuUtilization table |
> | Microsoft.Insights/Logs/AmlComputeJobEvent/Read | Read data from the AmlComputeJobEvent table |
> | Microsoft.Insights/Logs/AmlRunStatusChangedEvent/Read | Read data from the AmlRunStatusChangedEvent table |
> | Microsoft.Insights/Logs/ApiManagementGatewayLogs/Read | Read data from the ApiManagementGatewayLogs table |
> | Microsoft.Insights/Logs/AppAvailabilityResults/Read | Read data from the AppAvailabilityResults table |
> | Microsoft.Insights/Logs/AppBrowserTimings/Read | Read data from the AppBrowserTimings table |
> | Microsoft.Insights/Logs/AppCenterError/Read | Read data from the AppCenterError table |
> | Microsoft.Insights/Logs/AppDependencies/Read | Read data from the AppDependencies table |
> | Microsoft.Insights/Logs/AppEvents/Read | Read data from the AppEvents table |
> | Microsoft.Insights/Logs/AppExceptions/Read | Read data from the AppExceptions table |
> | Microsoft.Insights/Logs/ApplicationInsights/Read | Read data from the ApplicationInsights table |
> | Microsoft.Insights/Logs/AppMetrics/Read | Read data from the AppMetrics table |
> | Microsoft.Insights/Logs/AppPageViews/Read | Read data from the AppPageViews table |
> | Microsoft.Insights/Logs/AppPerformanceCounters/Read | Read data from the AppPerformanceCounters table |
> | Microsoft.Insights/Logs/AppPlatformLogsforSpring/Read | Read data from the AppPlatformLogsforSpring table |
> | Microsoft.Insights/Logs/AppPlatformSystemLogs/Read | Read data from the AppPlatformSystemLogs table |
> | Microsoft.Insights/Logs/AppRequests/Read | Read data from the AppRequests table |
> | Microsoft.Insights/Logs/AppServiceAntivirusScanLogs/Read | Read data from the AppServiceAntivirusScanLogs table |
> | Microsoft.Insights/Logs/AppServiceAppLogs/Read | Read data from the AppServiceAppLogs table |
> | Microsoft.Insights/Logs/AppServiceAuditLogs/Read | Read data from the AppServiceAuditLogs table |
> | Microsoft.Insights/Logs/AppServiceConsoleLogs/Read | Read data from the AppServiceConsoleLogs table |
> | Microsoft.Insights/Logs/AppServiceEnvironmentPlatformLogs/Read | Read data from the AppServiceEnvironmentPlatformLogs table |
> | Microsoft.Insights/Logs/AppServiceFileAuditLogs/Read | Read data from the AppServiceFileAuditLogs table |
> | Microsoft.Insights/Logs/AppServiceHTTPLogs/Read | Read data from the AppServiceHTTPLogs table |
> | Microsoft.Insights/Logs/AppServicePlatformLogs/Read | Read data from the AppServicePlatformLogs table |
> | Microsoft.Insights/Logs/AppSystemEvents/Read | Read data from the AppSystemEvents table |
> | Microsoft.Insights/Logs/AppTraces/Read | Read data from the AppTraces table |
> | Microsoft.Insights/Logs/AuditLogs/Read | Read data from the AuditLogs table |
> | Microsoft.Insights/Logs/AutoscaleEvaluationsLog/Read | Read data from the AutoscaleEvaluationsLog table |
> | Microsoft.Insights/Logs/AutoscaleScaleActionsLog/Read | Read data from the AutoscaleScaleActionsLog table |
> | Microsoft.Insights/Logs/AWSCloudTrail/Read | Read data from the AWSCloudTrail table |
> | Microsoft.Insights/Logs/AzureActivity/Read | Read data from the AzureActivity table |
> | Microsoft.Insights/Logs/AzureAssessmentRecommendation/Read | Read data from the AzureAssessmentRecommendation table |
> | Microsoft.Insights/Logs/AzureDevOpsAuditing/Read | Read data from the AzureDevOpsAuditing table |
> | Microsoft.Insights/Logs/AzureDiagnostics/Read | Read data from the AzureDiagnostics table |
> | Microsoft.Insights/Logs/AzureMetrics/Read | Read data from the AzureMetrics table |
> | Microsoft.Insights/Logs/BaiClusterEvent/Read | Read data from the BaiClusterEvent table |
> | Microsoft.Insights/Logs/BaiClusterNodeEvent/Read | Read data from the BaiClusterNodeEvent table |
> | Microsoft.Insights/Logs/BaiJobEvent/Read | Read data from the BaiJobEvent table |
> | Microsoft.Insights/Logs/BehaviorAnalytics/Read | Read data from the BehaviorAnalytics table |
> | Microsoft.Insights/Logs/BlockchainApplicationLog/Read | Read data from the BlockchainApplicationLog table |
> | Microsoft.Insights/Logs/BlockchainProxyLog/Read | Read data from the BlockchainProxyLog table |
> | Microsoft.Insights/Logs/BoundPort/Read | Read data from the BoundPort table |
> | Microsoft.Insights/Logs/CommonSecurityLog/Read | Read data from the CommonSecurityLog table |
> | Microsoft.Insights/Logs/ComputerGroup/Read | Read data from the ComputerGroup table |
> | Microsoft.Insights/Logs/ConfigurationChange/Read | Read data from the ConfigurationChange table |
> | Microsoft.Insights/Logs/ConfigurationData/Read | Read data from the ConfigurationData table |
> | Microsoft.Insights/Logs/ContainerImageInventory/Read | Read data from the ContainerImageInventory table |
> | Microsoft.Insights/Logs/ContainerInventory/Read | Read data from the ContainerInventory table |
> | Microsoft.Insights/Logs/ContainerLog/Read | Read data from the ContainerLog table |
> | Microsoft.Insights/Logs/ContainerNodeInventory/Read | Read data from the ContainerNodeInventory table |
> | Microsoft.Insights/Logs/ContainerRegistryLoginEvents/Read | Read data from the ContainerRegistryLoginEvents table |
> | Microsoft.Insights/Logs/ContainerRegistryRepositoryEvents/Read | Read data from the ContainerRegistryRepositoryEvents table |
> | Microsoft.Insights/Logs/ContainerServiceLog/Read | Read data from the ContainerServiceLog table |
> | Microsoft.Insights/Logs/CoreAzureBackup/Read | Read data from the CoreAzureBackup table |
> | Microsoft.Insights/Logs/DatabricksAccounts/Read | Read data from the DatabricksAccounts table |
> | Microsoft.Insights/Logs/DatabricksClusters/Read | Read data from the DatabricksClusters table |
> | Microsoft.Insights/Logs/DatabricksDBFS/Read | Read data from the DatabricksDBFS table |
> | Microsoft.Insights/Logs/DatabricksInstancePools/Read | Read data from the DatabricksInstancePools table |
> | Microsoft.Insights/Logs/DatabricksJobs/Read | Read data from the DatabricksJobs table |
> | Microsoft.Insights/Logs/DatabricksNotebook/Read | Read data from the DatabricksNotebook table |
> | Microsoft.Insights/Logs/DatabricksSecrets/Read | Read data from the DatabricksSecrets table |
> | Microsoft.Insights/Logs/DatabricksSQLPermissions/Read | Read data from the DatabricksSQLPermissions table |
> | Microsoft.Insights/Logs/DatabricksSSH/Read | Read data from the DatabricksSSH table |
> | Microsoft.Insights/Logs/DatabricksTables/Read | Read data from the DatabricksTables table |
> | Microsoft.Insights/Logs/DatabricksWorkspace/Read | Read data from the DatabricksWorkspace table |
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
> | Microsoft.Insights/Logs/DHCPActivity/Read | Read data from the DHCPActivity table |
> | Microsoft.Insights/Logs/DHDriverReliability/Read | Read data from the DHDriverReliability table |
> | Microsoft.Insights/Logs/DHLogonFailures/Read | Read data from the DHLogonFailures table |
> | Microsoft.Insights/Logs/DHLogonMetrics/Read | Read data from the DHLogonMetrics table |
> | Microsoft.Insights/Logs/DHOSCrashData/Read | Read data from the DHOSCrashData table |
> | Microsoft.Insights/Logs/DHOSReliability/Read | Read data from the DHOSReliability table |
> | Microsoft.Insights/Logs/DHWipAppLearning/Read | Read data from the DHWipAppLearning table |
> | Microsoft.Insights/Logs/DnsEvents/Read | Read data from the DnsEvents table |
> | Microsoft.Insights/Logs/DnsInventory/Read | Read data from the DnsInventory table |
> | Microsoft.Insights/Logs/Dynamics365Activity/Read | Read data from the Dynamics365Activity table |
> | Microsoft.Insights/Logs/ETWEvent/Read | Read data from the ETWEvent table |
> | Microsoft.Insights/Logs/Event/Read | Read data from the Event table |
> | Microsoft.Insights/Logs/ExchangeAssessmentRecommendation/Read | Read data from the ExchangeAssessmentRecommendation table |
> | Microsoft.Insights/Logs/ExchangeOnlineAssessmentRecommendation/Read | Read data from the ExchangeOnlineAssessmentRecommendation table |
> | Microsoft.Insights/Logs/FailedIngestion/Read | Read data from the FailedIngestion table |
> | Microsoft.Insights/Logs/FunctionAppLogs/Read | Read data from the FunctionAppLogs table |
> | Microsoft.Insights/Logs/Heartbeat/Read | Read data from the Heartbeat table |
> | Microsoft.Insights/Logs/HuntingBookmark/Read | Read data from the HuntingBookmark table |
> | Microsoft.Insights/Logs/IISAssessmentRecommendation/Read | Read data from the IISAssessmentRecommendation table |
> | Microsoft.Insights/Logs/InboundConnection/Read | Read data from the InboundConnection table |
> | Microsoft.Insights/Logs/InsightsMetrics/Read | Read data from the InsightsMetrics table |
> | Microsoft.Insights/Logs/IntuneAuditLogs/Read | Read data from the IntuneAuditLogs table |
> | Microsoft.Insights/Logs/IntuneDeviceComplianceOrg/Read | Read data from the IntuneDeviceComplianceOrg table |
> | Microsoft.Insights/Logs/IntuneOperationalLogs/Read | Read data from the IntuneOperationalLogs table |
> | Microsoft.Insights/Logs/IoTHubDistributedTracing/Read | Read data from the IoTHubDistributedTracing table |
> | Microsoft.Insights/Logs/KubeEvents/Read | Read data from the KubeEvents table |
> | Microsoft.Insights/Logs/KubeHealth/Read | Read data from the KubeHealth table |
> | Microsoft.Insights/Logs/KubeMonAgentEvents/Read | Read data from the KubeMonAgentEvents table |
> | Microsoft.Insights/Logs/KubeNodeInventory/Read | Read data from the KubeNodeInventory table |
> | Microsoft.Insights/Logs/KubePodInventory/Read | Read data from the KubePodInventory table |
> | Microsoft.Insights/Logs/KubeServices/Read | Read data from the KubeServices table |
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
> | Microsoft.Insights/Logs/MADeviceNotEnrolled/Read | Read data from the MADeviceNotEnrolled table |
> | Microsoft.Insights/Logs/MADeviceNRT/Read | Read data from the MADeviceNRT table |
> | Microsoft.Insights/Logs/MADevicePnPHealth/Read | Read data from the MADevicePnPHealth table |
> | Microsoft.Insights/Logs/MADevicePnPHealthAlternativeVersions/Read | Read data from the MADevicePnPHealthAlternativeVersions table |
> | Microsoft.Insights/Logs/MADevicePnPHealthIssues/Read | Read data from the MADevicePnPHealthIssues table |
> | Microsoft.Insights/Logs/MADeviceReadiness/Read | Read data from the MADeviceReadiness table |
> | Microsoft.Insights/Logs/MADriverInstanceReadiness/Read | Read data from the MADriverInstanceReadiness table |
> | Microsoft.Insights/Logs/MADriverReadiness/Read | Read data from the MADriverReadiness table |
> | Microsoft.Insights/Logs/MAOfficeAddin/Read | Read data from the MAOfficeAddin table |
> | Microsoft.Insights/Logs/MAOfficeAddinEntityHealth/Read | Read data from the MAOfficeAddinEntityHealth table |
> | Microsoft.Insights/Logs/MAOfficeAddinHealth/Read | Read data from the MAOfficeAddinHealth table |
> | Microsoft.Insights/Logs/MAOfficeAddinHealthEventNRT/Read | Read data from the MAOfficeAddinHealthEventNRT table |
> | Microsoft.Insights/Logs/MAOfficeAddinHealthIssues/Read | Read data from the MAOfficeAddinHealthIssues table |
> | Microsoft.Insights/Logs/MAOfficeAddinInstance/Read | Read data from the MAOfficeAddinInstance table |
> | Microsoft.Insights/Logs/MAOfficeAddinInstanceReadiness/Read | Read data from the MAOfficeAddinInstanceReadiness table |
> | Microsoft.Insights/Logs/MAOfficeAddinReadiness/Read | Read data from the MAOfficeAddinReadiness table |
> | Microsoft.Insights/Logs/MAOfficeApp/Read | Read data from the MAOfficeApp table |
> | Microsoft.Insights/Logs/MAOfficeAppCrashesNRT/Read | Read data from the MAOfficeAppCrashesNRT table |
> | Microsoft.Insights/Logs/MAOfficeAppHealth/Read | Read data from the MAOfficeAppHealth table |
> | Microsoft.Insights/Logs/MAOfficeAppInstance/Read | Read data from the MAOfficeAppInstance table |
> | Microsoft.Insights/Logs/MAOfficeAppInstanceHealth/Read | Read data from the MAOfficeAppInstanceHealth table |
> | Microsoft.Insights/Logs/MAOfficeAppReadiness/Read | Read data from the MAOfficeAppReadiness table |
> | Microsoft.Insights/Logs/MAOfficeAppSessionsNRT/Read | Read data from the MAOfficeAppSessionsNRT table |
> | Microsoft.Insights/Logs/MAOfficeBuildInfo/Read | Read data from the MAOfficeBuildInfo table |
> | Microsoft.Insights/Logs/MAOfficeCurrencyAssessment/Read | Read data from the MAOfficeCurrencyAssessment table |
> | Microsoft.Insights/Logs/MAOfficeCurrencyAssessmentDailyCounts/Read | Read data from the MAOfficeCurrencyAssessmentDailyCounts table |
> | Microsoft.Insights/Logs/MAOfficeDeploymentStatus/Read | Read data from the MAOfficeDeploymentStatus table |
> | Microsoft.Insights/Logs/MAOfficeDeploymentStatusNRT/Read | Read data from the MAOfficeDeploymentStatusNRT table |
> | Microsoft.Insights/Logs/MAOfficeMacroErrorNRT/Read | Read data from the MAOfficeMacroErrorNRT table |
> | Microsoft.Insights/Logs/MAOfficeMacroGlobalHealth/Read | Read data from the MAOfficeMacroGlobalHealth table |
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
> | Microsoft.Insights/Logs/MAWindowsDeploymentStatusNRT/Read | Read data from the MAWindowsDeploymentStatusNRT table |
> | Microsoft.Insights/Logs/MAWindowsSysReqInstanceReadiness/Read | Read data from the MAWindowsSysReqInstanceReadiness table |
> | Microsoft.Insights/Logs/McasShadowItReporting/Read | Read data from the McasShadowItReporting table |
> | Microsoft.Insights/Logs/MicrosoftAzureBastionAuditLogs/Read | Read data from the MicrosoftAzureBastionAuditLogs table |
> | Microsoft.Insights/Logs/MicrosoftDataShareReceivedSnapshotLog/Read | Read data from the MicrosoftDataShareReceivedSnapshotLog table |
> | Microsoft.Insights/Logs/MicrosoftDataShareSentSnapshotLog/Read | Read data from the MicrosoftDataShareSentSnapshotLog table |
> | Microsoft.Insights/Logs/MicrosoftDataShareShareLog/Read | Read data from the MicrosoftDataShareShareLog table |
> | Microsoft.Insights/Logs/MicrosoftDynamicsTelemetryPerformanceLogs/Read | Read data from the MicrosoftDynamicsTelemetryPerformanceLogs table |
> | Microsoft.Insights/Logs/MicrosoftDynamicsTelemetrySystemMetricsLogs/Read | Read data from the MicrosoftDynamicsTelemetrySystemMetricsLogs table |
> | Microsoft.Insights/Logs/MicrosoftHealthcareApisAuditLogs/Read | Read data from the MicrosoftHealthcareApisAuditLogs table |
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
> | Microsoft.Insights/Logs/SecurityIncident/Read | Read data from the SecurityIncident table |
> | Microsoft.Insights/Logs/SecurityIoTRawEvent/Read | Read data from the SecurityIoTRawEvent table |
> | Microsoft.Insights/Logs/SecurityNestedRecommendation/Read | Read data from the SecurityNestedRecommendation table |
> | Microsoft.Insights/Logs/SecurityRecommendation/Read | Read data from the SecurityRecommendation table |
> | Microsoft.Insights/Logs/ServiceFabricOperationalEvent/Read | Read data from the ServiceFabricOperationalEvent table |
> | Microsoft.Insights/Logs/ServiceFabricReliableActorEvent/Read | Read data from the ServiceFabricReliableActorEvent table |
> | Microsoft.Insights/Logs/ServiceFabricReliableServiceEvent/Read | Read data from the ServiceFabricReliableServiceEvent table |
> | Microsoft.Insights/Logs/SfBAssessmentRecommendation/Read | Read data from the SfBAssessmentRecommendation table |
> | Microsoft.Insights/Logs/SfBOnlineAssessmentRecommendation/Read | Read data from the SfBOnlineAssessmentRecommendation table |
> | Microsoft.Insights/Logs/SharePointOnlineAssessmentRecommendation/Read | Read data from the SharePointOnlineAssessmentRecommendation table |
> | Microsoft.Insights/Logs/SignalRServiceDiagnosticLogs/Read | Read data from the SignalRServiceDiagnosticLogs table |
> | Microsoft.Insights/Logs/SigninLogs/Read | Read data from the SigninLogs table |
> | Microsoft.Insights/Logs/SPAssessmentRecommendation/Read | Read data from the SPAssessmentRecommendation table |
> | Microsoft.Insights/Logs/SQLAssessmentRecommendation/Read | Read data from the SQLAssessmentRecommendation table |
> | Microsoft.Insights/Logs/SqlDataClassification/Read | Read data from the SqlDataClassification table |
> | Microsoft.Insights/Logs/SQLQueryPerformance/Read | Read data from the SQLQueryPerformance table |
> | Microsoft.Insights/Logs/SqlVulnerabilityAssessmentResult/Read | Read data from the SqlVulnerabilityAssessmentResult table |
> | Microsoft.Insights/Logs/StorageBlobLogs/Read | Read data from the StorageBlobLogs table |
> | Microsoft.Insights/Logs/StorageFileLogs/Read | Read data from the StorageFileLogs table |
> | Microsoft.Insights/Logs/StorageQueueLogs/Read | Read data from the StorageQueueLogs table |
> | Microsoft.Insights/Logs/StorageTableLogs/Read | Read data from the StorageTableLogs table |
> | Microsoft.Insights/Logs/SucceededIngestion/Read | Read data from the SucceededIngestion table |
> | Microsoft.Insights/Logs/Syslog/Read | Read data from the Syslog table |
> | Microsoft.Insights/Logs/SysmonEvent/Read | Read data from the SysmonEvent table |
> | Microsoft.Insights/Logs/Tables.Custom/Read | Reading data from any custom log |
> | Microsoft.Insights/Logs/ThreatIntelligenceIndicator/Read | Read data from the ThreatIntelligenceIndicator table |
> | Microsoft.Insights/Logs/TSIIngress/Read | Read data from the TSIIngress table |
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
> | Microsoft.Insights/Logs/UserAccessAnalytics/Read | Read data from the UserAccessAnalytics table |
> | Microsoft.Insights/Logs/UserPeerAnalytics/Read | Read data from the UserPeerAnalytics table |
> | Microsoft.Insights/Logs/VMBoundPort/Read | Read data from the VMBoundPort table |
> | Microsoft.Insights/Logs/VMComputer/Read | Read data from the VMComputer table |
> | Microsoft.Insights/Logs/VMConnection/Read | Read data from the VMConnection table |
> | Microsoft.Insights/Logs/VMProcess/Read | Read data from the VMProcess table |
> | Microsoft.Insights/Logs/W3CIISLog/Read | Read data from the W3CIISLog table |
> | Microsoft.Insights/Logs/WaaSDeploymentStatus/Read | Read data from the WaaSDeploymentStatus table |
> | Microsoft.Insights/Logs/WaaSInsiderStatus/Read | Read data from the WaaSInsiderStatus table |
> | Microsoft.Insights/Logs/WaaSUpdateStatus/Read | Read data from the WaaSUpdateStatus table |
> | Microsoft.Insights/Logs/WDAVStatus/Read | Read data from the WDAVStatus table |
> | Microsoft.Insights/Logs/WDAVThreat/Read | Read data from the WDAVThreat table |
> | Microsoft.Insights/Logs/WindowsClientAssessmentRecommendation/Read | Read data from the WindowsClientAssessmentRecommendation table |
> | Microsoft.Insights/Logs/WindowsEvent/Read | Read data from the WindowsEvent table |
> | Microsoft.Insights/Logs/WindowsFirewall/Read | Read data from the WindowsFirewall table |
> | Microsoft.Insights/Logs/WindowsServerAssessmentRecommendation/Read | Read data from the WindowsServerAssessmentRecommendation table |
> | Microsoft.Insights/Logs/WireData/Read | Read data from the WireData table |
> | Microsoft.Insights/Logs/WorkloadMonitoringPerf/Read | Read data from the WorkloadMonitoringPerf table |
> | Microsoft.Insights/Logs/WUDOAggregatedStatus/Read | Read data from the WUDOAggregatedStatus table |
> | Microsoft.Insights/Logs/WUDOStatus/Read | Read data from the WUDOStatus table |
> | Microsoft.Insights/Logs/WVDCheckpoints/Read | Read data from the WVDCheckpoints table |
> | Microsoft.Insights/Logs/WVDConnections/Read | Read data from the WVDConnections table |
> | Microsoft.Insights/Logs/WVDErrors/Read | Read data from the WVDErrors table |
> | Microsoft.Insights/Logs/WVDFeeds/Read | Read data from the WVDFeeds table |
> | Microsoft.Insights/Logs/WVDHostRegistrations/Read | Read data from the WVDHostRegistrations table |
> | Microsoft.Insights/Logs/WVDManagement/Read | Read data from the WVDManagement table |
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
> | Microsoft.Insights/MonitoredObjects/Read | Read a monitored object |
> | Microsoft.Insights/MonitoredObjects/Write | Create or update a monitored object |
> | Microsoft.Insights/MonitoredObjects/Delete | Delete a monitored object |
> | Microsoft.Insights/MyWorkbooks/Read | Read a private Workbook |
> | Microsoft.Insights/MyWorkbooks/Write | Create or update a private workbook |
> | Microsoft.Insights/MyWorkbooks/Delete | Delete a private workbook |
> | Microsoft.Insights/NotificationStatus/Read | Get the test notification status/detail |
> | Microsoft.Insights/Operations/Read | Read operations |
> | Microsoft.Insights/PrivateLinkScopeOperationStatuses/Read | Read a private link scoped operation status |
> | Microsoft.Insights/PrivateLinkScopes/Read | Read a private link scope |
> | Microsoft.Insights/PrivateLinkScopes/Write | Create or update a private link scope |
> | Microsoft.Insights/PrivateLinkScopes/Delete | Delete a private link scope |
> | Microsoft.Insights/PrivateLinkScopes/PrivateEndpointConnectionsApproval/action | Approve or reject a connection to a Private Endpoint resource of Microsoft.Network provider |
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
> | Microsoft.Insights/ScheduledQueryRules/NetworkSecurityPerimeterAssociationProxies/Read | Reading a network security perimeter association proxy for scheduled query rules |
> | Microsoft.Insights/ScheduledQueryRules/NetworkSecurityPerimeterAssociationProxies/Write | Writing a network security perimeter association proxy for scheduled query rules |
> | Microsoft.Insights/ScheduledQueryRules/NetworkSecurityPerimeterAssociationProxies/Delete | Deleting a network security perimeter association proxy for scheduled query rules |
> | Microsoft.Insights/ScheduledQueryRules/networkSecurityPerimeterConfigurations/Read | Reading a network security perimeter configuration for scheduled query rules |
> | Microsoft.Insights/ScheduledQueryRules/networkSecurityPerimeterConfigurations/Write | Writing a network security perimeter configuration for scheduled query rules |
> | Microsoft.Insights/ScheduledQueryRules/networkSecurityPerimeterConfigurations/Delete | Deleting a network security perimeter configuration for scheduled query rules |
> | Microsoft.Insights/TenantActionGroups/Write | Create or update a tenant action group |
> | Microsoft.Insights/TenantActionGroups/Delete | Delete a tenant action group |
> | Microsoft.Insights/TenantActionGroups/Read | Read a tenant action group |
> | Microsoft.Insights/Tenants/Register/Action | Initializes the Microsoft Insights provider |
> | Microsoft.Insights/topology/Read | Read Topology |
> | Microsoft.Insights/transactions/Read | Read Transactions |
> | Microsoft.Insights/Webtests/Write | Writing to a webtest configuration |
> | Microsoft.Insights/Webtests/Delete | Deleting a webtest configuration |
> | Microsoft.Insights/Webtests/Read | Reading a webtest configuration |
> | Microsoft.Insights/Webtests/GetToken/Read | Reading a webtest token |
> | Microsoft.Insights/Webtests/MetricDefinitions/Read | Reading a webtest metric definitions |
> | Microsoft.Insights/Webtests/Metrics/Read | Reading a webtest metrics |
> | Microsoft.Insights/Workbooks/Write | Create or update a workbook |
> | Microsoft.Insights/Workbooks/Delete | Delete a workbook |
> | Microsoft.Insights/Workbooks/Read | Read a workbook |
> | Microsoft.Insights/Workbooks/Revisions/Read | Get the workbook revisions |
> | Microsoft.Insights/WorkbookTemplates/Write | Create or update a workbook template |
> | Microsoft.Insights/WorkbookTemplates/Delete | Delete a workbook template |
> | Microsoft.Insights/WorkbookTemplates/Read | Read a workbook template |
> | **DataAction** | **Description** |
> | Microsoft.Insights/DataCollectionRules/Data/Write | Send data to a data collection rule |
> | Microsoft.Insights/Metrics/Write | Write metrics |
> | Microsoft.Insights/Telemetry/Write | Write telemetry |

### Microsoft.Monitor

Azure service: [Azure Monitor](../../../azure-monitor/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | microsoft.monitor/accounts/read | Read any Monitoring Account |
> | microsoft.monitor/accounts/write | Create or Update any Monitoring Account |
> | microsoft.monitor/accounts/delete | Delete any Monitoring Account |
> | microsoft.monitor/accounts/privateEndpointConnectionsApproval/action | Give approval to any Monitoring Account Private Endpoint Connection |
> | microsoft.monitor/accounts/privateEndpointConnectionProxies/read | Read any Monitoring Account Private Endpoint Connection Proxy |
> | microsoft.monitor/accounts/privateEndpointConnectionProxies/write | Create or Update any Monitoring Account Private Endpoint Connection Proxy |
> | microsoft.monitor/accounts/privateEndpointConnectionProxies/delete | Delete any Monitoring Account Private Endpoint Connection Proxy |
> | microsoft.monitor/accounts/privateEndpointConnectionProxies/validate/action | Perform validation on any Monitoring Account Private Endpoint Connection Proxy |
> | microsoft.monitor/accounts/privateEndpointConnectionProxies/operationResults/read | Read Status of any Private Endpoint Connection Proxy Asynchronous Operation |
> | microsoft.monitor/accounts/privateEndpointConnections/read | Read any Monitoring Account Private Endpoint Connection |
> | microsoft.monitor/accounts/privateEndpointConnections/write | Create or Update any Monitoring Account Private Endpoint Connection |
> | microsoft.monitor/accounts/privateEndpointConnections/delete | Delete any Monitoring Account Private Endpoint Connection |
> | microsoft.monitor/accounts/privateEndpointConnections/operationResults/read | Read Status of any Private Endpoint Connections Asynchronous Operation |
> | microsoft.monitor/accounts/privateLinkResources/read | Read all Monitoring Account Private Link Resources |
> | **DataAction** | **Description** |
> | microsoft.monitor/accounts/data/metrics/read | Read metrics data in any Monitoring Account |
> | microsoft.monitor/accounts/data/metrics/write | Write metrics data to any Monitoring Account |

### Microsoft.OperationalInsights

Azure service: [Azure Monitor](../../../azure-monitor/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.OperationalInsights/register/action | Register a subscription to a resource provider. |
> | Microsoft.OperationalInsights/unregister/action | UnRegister a subscription to a resource provider. |
> | Microsoft.OperationalInsights/querypacks/action | Perform Query Pack Action. |
> | microsoft.operationalinsights/unregister/action | Unregisters the subscription. |
> | microsoft.operationalinsights/querypacks/action | Perform Query Packs Actions. |
> | microsoft.operationalinsights/availableservicetiers/read | Get the available service tiers. |
> | Microsoft.OperationalInsights/clusters/read | Get Cluster |
> | Microsoft.OperationalInsights/clusters/write | Create or updates a Cluster |
> | Microsoft.OperationalInsights/clusters/delete | Delete Cluster |
> | Microsoft.OperationalInsights/deletedworkspaces/read | Lists workspaces in soft deleted period. |
> | Microsoft.OperationalInsights/linktargets/read | Lists workspaces in soft deleted period. |
> | Microsoft.OperationalInsights/locations/operationstatuses/read | Get Log Analytics Azure Async Operation Status |
> | microsoft.operationalinsights/locations/operationStatuses/read | Get Log Analytics Azure Async Operation Status. |
> | Microsoft.OperationalInsights/operations/read | Lists all of the available OperationalInsights REST API operations. |
> | microsoft.operationalinsights/operations/read | Lists all of the available OperationalInsights REST API operations. |
> | Microsoft.OperationalInsights/querypacks/read | Get Query Pack. |
> | Microsoft.OperationalInsights/querypacks/write | Create or update  Query Pack. |
> | Microsoft.OperationalInsights/querypacks/delete | Delete Query Pack. |
> | microsoft.operationalinsights/querypacks/write | Create or Update Query Packs. |
> | microsoft.operationalinsights/querypacks/read | Get Query Packs. |
> | microsoft.operationalinsights/querypacks/delete | Delete Query Packs. |
> | microsoft.operationalinsights/querypacks/queries/action | Perform Actions on Queries in QueryPack. |
> | microsoft.operationalinsights/querypacks/queries/write | Create or Update Query Pack Queries. |
> | microsoft.operationalinsights/querypacks/queries/read | Get Query Pack Queries. |
> | microsoft.operationalinsights/querypacks/queries/delete | Delete Query Pack Queries. |
> | Microsoft.OperationalInsights/workspaces/write | Creates a new workspace or links to an existing workspace by providing the customer id from the existing workspace. |
> | Microsoft.OperationalInsights/workspaces/read | Gets an existing workspace |
> | Microsoft.OperationalInsights/workspaces/delete | Deletes a workspace. If the workspace was linked to an existing workspace at creation time then the workspace it was linked to is not deleted. |
> | Microsoft.OperationalInsights/workspaces/generateRegistrationCertificate/action | Generates Registration Certificate for the workspace. This Certificate is used to connect Microsoft System Center Operation Manager to the workspace. |
> | Microsoft.OperationalInsights/workspaces/sharedkeys/action | Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
> | Microsoft.OperationalInsights/workspaces/listKeys/action | Retrieves the list keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
> | Microsoft.OperationalInsights/workspaces/regenerateSharedKey/action | Regenerates the specified workspace shared key |
> | Microsoft.OperationalInsights/workspaces/search/action | Executes a search query |
> | Microsoft.OperationalInsights/workspaces/purge/action | Delete specified data by query from workspace. |
> | microsoft.operationalinsights/workspaces/customfields/action | Extract custom fields. |
> | Microsoft.OperationalInsights/workspaces/analytics/query/action | Search using new engine. |
> | Microsoft.OperationalInsights/workspaces/analytics/query/schema/read | Get search schema V2. |
> | Microsoft.OperationalInsights/workspaces/api/query/action | Search using new engine. |
> | Microsoft.OperationalInsights/workspaces/api/query/schema/read | Get search schema V2. |
> | Microsoft.OperationalInsights/workspaces/availableservicetiers/read | List of all the available service tiers for workspace. |
> | Microsoft.OperationalInsights/workspaces/configurationscopes/read | Get configuration scope in a workspace. |
> | Microsoft.OperationalInsights/workspaces/configurationscopes/write | Create configuration scope in a workspace. |
> | Microsoft.OperationalInsights/workspaces/configurationscopes/delete | Delete configuration scope in a workspace. |
> | microsoft.operationalinsights/workspaces/customfields/read | Get a custom field. |
> | microsoft.operationalinsights/workspaces/customfields/write | Create or update a custom field. |
> | microsoft.operationalinsights/workspaces/customfields/delete | Delete a custom field. |
> | Microsoft.OperationalInsights/workspaces/dataexports/read | Get data export. |
> | Microsoft.OperationalInsights/workspaces/dataexports/write | Create or update specific data export. |
> | Microsoft.OperationalInsights/workspaces/dataexports/delete | Delete specific Data Export/ |
> | microsoft.operationalinsights/workspaces/dataExports/read | Get specific data export. |
> | microsoft.operationalinsights/workspaces/dataExports/write | Create or update data export. |
> | microsoft.operationalinsights/workspaces/dataExports/delete | Delete specific data export. |
> | Microsoft.OperationalInsights/workspaces/datasources/read | Get data source under a workspace. |
> | Microsoft.OperationalInsights/workspaces/datasources/write | Upsert Data Source |
> | Microsoft.OperationalInsights/workspaces/datasources/delete | Delete data source under a workspace. |
> | Microsoft.OperationalInsights/workspaces/features/clientGroups/members/read | Get the Client Groups Members of a resource. |
> | microsoft.operationalinsights/workspaces/features/clientgroups/memebers/read | Get Client Group Members of a resource. |
> | Microsoft.OperationalInsights/workspaces/features/generateMap/read | Get the Service Map of a resource. |
> | microsoft.operationalinsights/workspaces/features/generateMap/read | Get the Service Map of a resource. |
> | Microsoft.OperationalInsights/workspaces/features/machineGroups/read | Get the Service Map Machine Groups of a resource. |
> | microsoft.operationalinsights/workspaces/features/machineGroups/read | Get the Service Map Machine Groups. |
> | Microsoft.OperationalInsights/workspaces/features/serverGroups/members/read | Get the Server Groups Members of a resource. |
> | microsoft.operationalinsights/workspaces/features/servergroups/members/read | Get Server Group Members of a resource. |
> | Microsoft.OperationalInsights/workspaces/gateways/delete | Removes a gateway configured for the workspace. |
> | Microsoft.OperationalInsights/workspaces/intelligencepacks/read | Lists all intelligence packs that are visible for a given workspace and also lists whether the pack is enabled or disabled for that workspace. |
> | Microsoft.OperationalInsights/workspaces/intelligencepacks/enable/action | Enables an intelligence pack for a given workspace. |
> | Microsoft.OperationalInsights/workspaces/intelligencepacks/disable/action | Disables an intelligence pack for a given workspace. |
> | Microsoft.OperationalInsights/workspaces/linkedservices/read | Get linked services under given workspace. |
> | Microsoft.OperationalInsights/workspaces/linkedservices/write | Create or update linked services under given workspace. |
> | Microsoft.OperationalInsights/workspaces/linkedservices/delete | Delete linked services under given workspace. |
> | Microsoft.OperationalInsights/workspaces/listKeys/read | Retrieves the list keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
> | Microsoft.OperationalInsights/workspaces/managementgroups/read | Gets the names and metadata for System Center Operations Manager management groups connected to this workspace. |
> | Microsoft.OperationalInsights/workspaces/metricDefinitions/read | Get Metric Definitions under workspace |
> | microsoft.operationalinsights/workspaces/networkSecurityPerimeterAssociationProxies/read | Read Network Security Perimeter Association Proxies |
> | microsoft.operationalinsights/workspaces/networkSecurityPerimeterAssociationProxies/write | Write Network Security Perimeter Association Proxies |
> | microsoft.operationalinsights/workspaces/networkSecurityPerimeterAssociationProxies/delete | Delete Network Security Perimeter Association Proxies |
> | microsoft.operationalinsights/workspaces/networkSecurityPerimeterConfigurations/read | Read Network Security Perimeter Configurations |
> | microsoft.operationalinsights/workspaces/networkSecurityPerimeterConfigurations/write | Write Network Security Perimeter Configurations |
> | microsoft.operationalinsights/workspaces/networkSecurityPerimeterConfigurations/delete | Delete Network Security Perimeter Configurations |
> | Microsoft.OperationalInsights/workspaces/notificationsettings/read | Get the user's notification settings for the workspace. |
> | Microsoft.OperationalInsights/workspaces/notificationsettings/write | Set the user's notification settings for the workspace. |
> | Microsoft.OperationalInsights/workspaces/notificationsettings/delete | Delete the user's notification settings for the workspace. |
> | Microsoft.OperationalInsights/workspaces/operations/read | Gets the status of an OperationalInsights workspace operation. |
> | microsoft.operationalinsights/workspaces/operations/read | Gets the status of an OperationalInsights workspace operation. |
> | Microsoft.OperationalInsights/workspaces/providers/Microsoft.Insights/diagnosticSettings/Read | Gets the diagnostic setting for the resource |
> | Microsoft.OperationalInsights/workspaces/providers/Microsoft.Insights/diagnosticSettings/Write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.OperationalInsights/workspaces/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for a Workspace |
> | Microsoft.OperationalInsights/workspaces/query/read | Run queries over the data in the workspace |
> | Microsoft.OperationalInsights/workspaces/query/AACAudit/read | Read data from the AACAudit table |
> | Microsoft.OperationalInsights/workspaces/query/AACHttpRequest/read | Read data from the AACHttpRequest table |
> | Microsoft.OperationalInsights/workspaces/query/AADB2CRequestLogs/read | Read data from the AADB2CRequestLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesAccountLogon/read | Read data from the AADDomainServicesAccountLogon table |
> | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesAccountManagement/read | Read data from the AADDomainServicesAccountManagement table |
> | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesDirectoryServiceAccess/read | Read data from the AADDomainServicesDirectoryServiceAccess table |
> | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesLogonLogoff/read | Read data from the AADDomainServicesLogonLogoff table |
> | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesPolicyChange/read | Read data from the AADDomainServicesPolicyChange table |
> | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesPrivilegeUse/read | Read data from the AADDomainServicesPrivilegeUse table |
> | Microsoft.OperationalInsights/workspaces/query/AADManagedIdentitySignInLogs/read | Read data from the AADManagedIdentitySignInLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AADNonInteractiveUserSignInLogs/read | Read data from the AADNonInteractiveUserSignInLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AADProvisioningLogs/read | Read data from the AADProvisioningLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AADRiskyServicePrincipals/read | Read data from the AADRiskyServicePrincipals table |
> | Microsoft.OperationalInsights/workspaces/query/AADRiskyUsers/read | Read data from the AADRiskyUsers table |
> | Microsoft.OperationalInsights/workspaces/query/AADServicePrincipalRiskEvents/read | Read data from the AADServicePrincipalRiskEvents table |
> | Microsoft.OperationalInsights/workspaces/query/AADServicePrincipalSignInLogs/read | Read data from the AADServicePrincipalSignInLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AADUserRiskEvents/read | Read data from the AADUserRiskEvents table |
> | Microsoft.OperationalInsights/workspaces/query/ABSBotRequests/read | Read data from the ABSBotRequests table |
> | Microsoft.OperationalInsights/workspaces/query/ABSChannelToBotRequests/read | Read data from the ABSChannelToBotRequests table |
> | Microsoft.OperationalInsights/workspaces/query/ABSDependenciesRequests/read | Read data from the ABSDependenciesRequests table |
> | Microsoft.OperationalInsights/workspaces/query/ACICollaborationAudit/read | Read data from the ACICollaborationAudit table |
> | Microsoft.OperationalInsights/workspaces/query/ACRConnectedClientList/read | Read data from the ACRConnectedClientList table |
> | Microsoft.OperationalInsights/workspaces/query/ACSAuthIncomingOperations/read | Read data from the ACSAuthIncomingOperations table |
> | Microsoft.OperationalInsights/workspaces/query/ACSBillingUsage/read | Read data from the ACSBillingUsage table |
> | Microsoft.OperationalInsights/workspaces/query/ACSCallAutomationIncomingOperations/read | Read data from the ACSCallAutomationIncomingOperations table |
> | Microsoft.OperationalInsights/workspaces/query/ACSCallDiagnostics/read | Read data from the ACSCallDiagnostics table |
> | Microsoft.OperationalInsights/workspaces/query/ACSCallRecordingSummary/read | Read data from the ACSCallRecordingSummary table |
> | Microsoft.OperationalInsights/workspaces/query/ACSCallSummary/read | Read data from the ACSCallSummary table |
> | Microsoft.OperationalInsights/workspaces/query/ACSChatIncomingOperations/read | Read data from the ACSChatIncomingOperations table |
> | Microsoft.OperationalInsights/workspaces/query/ACSEmailSendMailOperational/read | Read data from the ACSEmailSendMailOperational table |
> | Microsoft.OperationalInsights/workspaces/query/ACSEmailStatusUpdateOperational/read | Read data from the ACSEmailStatusUpdateOperational table |
> | Microsoft.OperationalInsights/workspaces/query/ACSEmailUserEngagementOperational/read | Read data from the ACSEmailUserEngagementOperational table |
> | Microsoft.OperationalInsights/workspaces/query/ACSNetworkTraversalDiagnostics/read | Read data from the ACSNetworkTraversalDiagnostics table |
> | Microsoft.OperationalInsights/workspaces/query/ACSNetworkTraversalIncomingOperations/read | Read data from the ACSNetworkTraversalIncomingOperations table |
> | Microsoft.OperationalInsights/workspaces/query/ACSRoomsIncomingOperations/read | Read data from the ACSRoomsIncomingOperations table |
> | Microsoft.OperationalInsights/workspaces/query/ACSSMSIncomingOperations/read | Read data from the ACSSMSIncomingOperations table |
> | Microsoft.OperationalInsights/workspaces/query/ADAssessmentRecommendation/read | Read data from the ADAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/AddonAzureBackupAlerts/read | Read data from the AddonAzureBackupAlerts table |
> | Microsoft.OperationalInsights/workspaces/query/AddonAzureBackupJobs/read | Read data from the AddonAzureBackupJobs table |
> | Microsoft.OperationalInsights/workspaces/query/AddonAzureBackupPolicy/read | Read data from the AddonAzureBackupPolicy table |
> | Microsoft.OperationalInsights/workspaces/query/AddonAzureBackupProtectedInstance/read | Read data from the AddonAzureBackupProtectedInstance table |
> | Microsoft.OperationalInsights/workspaces/query/AddonAzureBackupStorage/read | Read data from the AddonAzureBackupStorage table |
> | Microsoft.OperationalInsights/workspaces/query/ADFActivityRun/read | Read data from the ADFActivityRun table |
> | Microsoft.OperationalInsights/workspaces/query/ADFAirflowSchedulerLogs/read | Read data from the ADFAirflowSchedulerLogs table |
> | Microsoft.OperationalInsights/workspaces/query/ADFAirflowTaskLogs/read | Read data from the ADFAirflowTaskLogs table |
> | Microsoft.OperationalInsights/workspaces/query/ADFAirflowWebLogs/read | Read data from the ADFAirflowWebLogs table |
> | Microsoft.OperationalInsights/workspaces/query/ADFAirflowWorkerLogs/read | Read data from the ADFAirflowWorkerLogs table |
> | Microsoft.OperationalInsights/workspaces/query/ADFPipelineRun/read | Read data from the ADFPipelineRun table |
> | Microsoft.OperationalInsights/workspaces/query/ADFSandboxActivityRun/read | Read data from the ADFSandboxActivityRun table |
> | Microsoft.OperationalInsights/workspaces/query/ADFSandboxPipelineRun/read | Read data from the ADFSandboxPipelineRun table |
> | Microsoft.OperationalInsights/workspaces/query/ADFSSignInLogs/read | Read data from the ADFSSignInLogs table |
> | Microsoft.OperationalInsights/workspaces/query/ADFSSISIntegrationRuntimeLogs/read | Read data from the ADFSSISIntegrationRuntimeLogs table |
> | Microsoft.OperationalInsights/workspaces/query/ADFSSISPackageEventMessageContext/read | Read data from the ADFSSISPackageEventMessageContext table |
> | Microsoft.OperationalInsights/workspaces/query/ADFSSISPackageEventMessages/read | Read data from the ADFSSISPackageEventMessages table |
> | Microsoft.OperationalInsights/workspaces/query/ADFSSISPackageExecutableStatistics/read | Read data from the ADFSSISPackageExecutableStatistics table |
> | Microsoft.OperationalInsights/workspaces/query/ADFSSISPackageExecutionComponentPhases/read | Read data from the ADFSSISPackageExecutionComponentPhases table |
> | Microsoft.OperationalInsights/workspaces/query/ADFSSISPackageExecutionDataStatistics/read | Read data from the ADFSSISPackageExecutionDataStatistics table |
> | Microsoft.OperationalInsights/workspaces/query/ADFTriggerRun/read | Read data from the ADFTriggerRun table |
> | Microsoft.OperationalInsights/workspaces/query/ADPAudit/read | Read data from the ADPAudit table |
> | Microsoft.OperationalInsights/workspaces/query/ADPDiagnostics/read | Read data from the ADPDiagnostics table |
> | Microsoft.OperationalInsights/workspaces/query/ADPRequests/read | Read data from the ADPRequests table |
> | Microsoft.OperationalInsights/workspaces/query/ADReplicationResult/read | Read data from the ADReplicationResult table |
> | Microsoft.OperationalInsights/workspaces/query/ADSecurityAssessmentRecommendation/read | Read data from the ADSecurityAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/ADTDataHistoryOperation/read | Read data from the ADTDataHistoryOperation table |
> | Microsoft.OperationalInsights/workspaces/query/ADTDigitalTwinsOperation/read | Read data from the ADTDigitalTwinsOperation table |
> | Microsoft.OperationalInsights/workspaces/query/ADTEventRoutesOperation/read | Read data from the ADTEventRoutesOperation table |
> | Microsoft.OperationalInsights/workspaces/query/ADTModelsOperation/read | Read data from the ADTModelsOperation table |
> | Microsoft.OperationalInsights/workspaces/query/ADTQueryOperation/read | Read data from the ADTQueryOperation table |
> | Microsoft.OperationalInsights/workspaces/query/ADXCommand/read | Read data from the ADXCommand table |
> | Microsoft.OperationalInsights/workspaces/query/ADXIngestionBatching/read | Read data from the ADXIngestionBatching table |
> | Microsoft.OperationalInsights/workspaces/query/ADXJournal/read | Read data from the ADXJournal table |
> | Microsoft.OperationalInsights/workspaces/query/ADXQuery/read | Read data from the ADXQuery table |
> | Microsoft.OperationalInsights/workspaces/query/ADXTableDetails/read | Read data from the ADXTableDetails table |
> | Microsoft.OperationalInsights/workspaces/query/ADXTableUsageStatistics/read | Read data from the ADXTableUsageStatistics table |
> | Microsoft.OperationalInsights/workspaces/query/AegDataPlaneRequests/read | Read data from the AegDataPlaneRequests table |
> | Microsoft.OperationalInsights/workspaces/query/AegDeliveryFailureLogs/read | Read data from the AegDeliveryFailureLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AegPublishFailureLogs/read | Read data from the AegPublishFailureLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AEWAuditLogs/read | Read data from the AEWAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AEWComputePipelinesLogs/read | Read data from the AEWComputePipelinesLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AgriFoodApplicationAuditLogs/read | Read data from the AgriFoodApplicationAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AgriFoodFarmManagementLogs/read | Read data from the AgriFoodFarmManagementLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AgriFoodFarmOperationLogs/read | Read data from the AgriFoodFarmOperationLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AgriFoodInsightLogs/read | Read data from the AgriFoodInsightLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AgriFoodJobProcessedLogs/read | Read data from the AgriFoodJobProcessedLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AgriFoodModelInferenceLogs/read | Read data from the AgriFoodModelInferenceLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AgriFoodProviderAuthLogs/read | Read data from the AgriFoodProviderAuthLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AgriFoodSatelliteLogs/read | Read data from the AgriFoodSatelliteLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AgriFoodSensorManagementLogs/read | Read data from the AgriFoodSensorManagementLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AgriFoodWeatherLogs/read | Read data from the AgriFoodWeatherLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AGSGrafanaLoginEvents/read | Read data from the AGSGrafanaLoginEvents table |
> | Microsoft.OperationalInsights/workspaces/query/AHDSMedTechDiagnosticLogs/read | Read data from the AHDSMedTechDiagnosticLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AirflowDagProcessingLogs/read | Read data from the AirflowDagProcessingLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AKSAudit/read | Read data from the AKSAudit table |
> | Microsoft.OperationalInsights/workspaces/query/AKSAuditAdmin/read | Read data from the AKSAuditAdmin table |
> | Microsoft.OperationalInsights/workspaces/query/AKSControlPlane/read | Read data from the AKSControlPlane table |
> | Microsoft.OperationalInsights/workspaces/query/Alert/read | Read data from the Alert table |
> | Microsoft.OperationalInsights/workspaces/query/AlertEvidence/read | Read data from the AlertEvidence table |
> | Microsoft.OperationalInsights/workspaces/query/AlertHistory/read | Read data from the AlertHistory table |
> | Microsoft.OperationalInsights/workspaces/query/AlertInfo/read | Read data from the AlertInfo table |
> | Microsoft.OperationalInsights/workspaces/query/AmlComputeClusterEvent/read | Read data from the AmlComputeClusterEvent table |
> | Microsoft.OperationalInsights/workspaces/query/AmlComputeClusterNodeEvent/read | Read data from the AmlComputeClusterNodeEvent table |
> | Microsoft.OperationalInsights/workspaces/query/AmlComputeCpuGpuUtilization/read | Read data from the AmlComputeCpuGpuUtilization table |
> | Microsoft.OperationalInsights/workspaces/query/AmlComputeInstanceEvent/read | Read data from the AmlComputeInstanceEvent table |
> | Microsoft.OperationalInsights/workspaces/query/AmlComputeJobEvent/read | Read data from the AmlComputeJobEvent table |
> | Microsoft.OperationalInsights/workspaces/query/AmlDataLabelEvent/read | Read data from the AmlDataLabelEvent table |
> | Microsoft.OperationalInsights/workspaces/query/AmlDataSetEvent/read | Read data from the AmlDataSetEvent table |
> | Microsoft.OperationalInsights/workspaces/query/AmlDataStoreEvent/read | Read data from the AmlDataStoreEvent table |
> | Microsoft.OperationalInsights/workspaces/query/AmlDeploymentEvent/read | Read data from the AmlDeploymentEvent table |
> | Microsoft.OperationalInsights/workspaces/query/AmlEnvironmentEvent/read | Read data from the AmlEnvironmentEvent table |
> | Microsoft.OperationalInsights/workspaces/query/AmlInferencingEvent/read | Read data from the AmlInferencingEvent table |
> | Microsoft.OperationalInsights/workspaces/query/AmlModelsEvent/read | Read data from the AmlModelsEvent table |
> | Microsoft.OperationalInsights/workspaces/query/AmlOnlineEndpointConsoleLog/read | Read data from the AmlOnlineEndpointConsoleLog table |
> | Microsoft.OperationalInsights/workspaces/query/AmlOnlineEndpointEventLog/read | Read data from the AmlOnlineEndpointEventLog table |
> | Microsoft.OperationalInsights/workspaces/query/AmlOnlineEndpointTrafficLog/read | Read data from the AmlOnlineEndpointTrafficLog table |
> | Microsoft.OperationalInsights/workspaces/query/AmlPipelineEvent/read | Read data from the AmlPipelineEvent table |
> | Microsoft.OperationalInsights/workspaces/query/AmlRegistryReadEventsLog/read | Read data from the AmlRegistryReadEventsLog table |
> | Microsoft.OperationalInsights/workspaces/query/AmlRegistryWriteEventsLog/read | Read data from the AmlRegistryWriteEventsLog table |
> | Microsoft.OperationalInsights/workspaces/query/AmlRunEvent/read | Read data from the AmlRunEvent table |
> | Microsoft.OperationalInsights/workspaces/query/AmlRunStatusChangedEvent/read | Read data from the AmlRunStatusChangedEvent table |
> | Microsoft.OperationalInsights/workspaces/query/AMSKeyDeliveryRequests/read | Read data from the AMSKeyDeliveryRequests table |
> | Microsoft.OperationalInsights/workspaces/query/AMSLiveEventOperations/read | Read data from the AMSLiveEventOperations table |
> | Microsoft.OperationalInsights/workspaces/query/AMSMediaAccountHealth/read | Read data from the AMSMediaAccountHealth table |
> | Microsoft.OperationalInsights/workspaces/query/AMSStreamingEndpointRequests/read | Read data from the AMSStreamingEndpointRequests table |
> | Microsoft.OperationalInsights/workspaces/query/ANFFileAccess/read | Read data from the ANFFileAccess table |
> | Microsoft.OperationalInsights/workspaces/query/Anomalies/read | Read data from the Anomalies table |
> | Microsoft.OperationalInsights/workspaces/query/ApiManagementGatewayLogs/read | Read data from the ApiManagementGatewayLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppAvailabilityResults/read | Read data from the AppAvailabilityResults table |
> | Microsoft.OperationalInsights/workspaces/query/AppBrowserTimings/read | Read data from the AppBrowserTimings table |
> | Microsoft.OperationalInsights/workspaces/query/AppCenterError/read | Read data from the AppCenterError table |
> | Microsoft.OperationalInsights/workspaces/query/AppDependencies/read | Read data from the AppDependencies table |
> | Microsoft.OperationalInsights/workspaces/query/AppEnvSpringAppConsoleLogs/read | Read data from the AppEnvSpringAppConsoleLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppEvents/read | Read data from the AppEvents table |
> | Microsoft.OperationalInsights/workspaces/query/AppExceptions/read | Read data from the AppExceptions table |
> | Microsoft.OperationalInsights/workspaces/query/ApplicationInsights/read | Read data from the ApplicationInsights table |
> | Microsoft.OperationalInsights/workspaces/query/AppMetrics/read | Read data from the AppMetrics table |
> | Microsoft.OperationalInsights/workspaces/query/AppPageViews/read | Read data from the AppPageViews table |
> | Microsoft.OperationalInsights/workspaces/query/AppPerformanceCounters/read | Read data from the AppPerformanceCounters table |
> | Microsoft.OperationalInsights/workspaces/query/AppPlatformBuildLogs/read | Read data from the AppPlatformBuildLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppPlatformContainerEventLogs/read | Read data from the AppPlatformContainerEventLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppPlatformIngressLogs/read | Read data from the AppPlatformIngressLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppPlatformLogsforSpring/read | Read data from the AppPlatformLogsforSpring table |
> | Microsoft.OperationalInsights/workspaces/query/AppPlatformSystemLogs/read | Read data from the AppPlatformSystemLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppRequests/read | Read data from the AppRequests table |
> | Microsoft.OperationalInsights/workspaces/query/AppServiceAntivirusScanAuditLogs/read | Read data from the AppServiceAntivirusScanAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppServiceAppLogs/read | Read data from the AppServiceAppLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppServiceAuditLogs/read | Read data from the AppServiceAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppServiceConsoleLogs/read | Read data from the AppServiceConsoleLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppServiceEnvironmentPlatformLogs/read | Read data from the AppServiceEnvironmentPlatformLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppServiceFileAuditLogs/read | Read data from the AppServiceFileAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppServiceHTTPLogs/read | Read data from the AppServiceHTTPLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppServiceIPSecAuditLogs/read | Read data from the AppServiceIPSecAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppServicePlatformLogs/read | Read data from the AppServicePlatformLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AppServiceServerlessSecurityPluginData/read | Read data from the AppServiceServerlessSecurityPluginData table |
> | Microsoft.OperationalInsights/workspaces/query/AppSystemEvents/read | Read data from the AppSystemEvents table |
> | Microsoft.OperationalInsights/workspaces/query/AppTraces/read | Read data from the AppTraces table |
> | Microsoft.OperationalInsights/workspaces/query/ASCAuditLogs/read | Read data from the ASCAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/ASCDeviceEvents/read | Read data from the ASCDeviceEvents table |
> | Microsoft.OperationalInsights/workspaces/query/ASimAuditEventLogs/read | Read data from the ASimAuditEventLogs table |
> | Microsoft.OperationalInsights/workspaces/query/ASimDnsActivityLogs/read | Read data from the ASimDnsActivityLogs table |
> | Microsoft.OperationalInsights/workspaces/query/ASimNetworkSessionLogs/read | Read data from the ASimNetworkSessionLogs table |
> | Microsoft.OperationalInsights/workspaces/query/ASimWebSessionLogs/read | Read data from the ASimWebSessionLogs table |
> | Microsoft.OperationalInsights/workspaces/query/ATCExpressRouteCircuitIpfix/read | Read data from the ATCExpressRouteCircuitIpfix table |
> | Microsoft.OperationalInsights/workspaces/query/AuditLogs/read | Read data from the AuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/AUIEventsAudit/read | Read data from the AUIEventsAudit table |
> | Microsoft.OperationalInsights/workspaces/query/AUIEventsOperational/read | Read data from the AUIEventsOperational table |
> | Microsoft.OperationalInsights/workspaces/query/AutoscaleEvaluationsLog/read | Read data from the AutoscaleEvaluationsLog table |
> | Microsoft.OperationalInsights/workspaces/query/AutoscaleScaleActionsLog/read | Read data from the AutoscaleScaleActionsLog table |
> | Microsoft.OperationalInsights/workspaces/query/AVNMNetworkGroupMembershipChange/read | Read data from the AVNMNetworkGroupMembershipChange table |
> | Microsoft.OperationalInsights/workspaces/query/AVSSyslog/read | Read data from the AVSSyslog table |
> | Microsoft.OperationalInsights/workspaces/query/AWSCloudTrail/read | Read data from the AWSCloudTrail table |
> | Microsoft.OperationalInsights/workspaces/query/AWSCloudWatch/read | Read data from the AWSCloudWatch table |
> | Microsoft.OperationalInsights/workspaces/query/AWSGuardDuty/read | Read data from the AWSGuardDuty table |
> | Microsoft.OperationalInsights/workspaces/query/AWSVPCFlow/read | Read data from the AWSVPCFlow table |
> | Microsoft.OperationalInsights/workspaces/query/AZFWApplicationRule/read | Read data from the AZFWApplicationRule table |
> | Microsoft.OperationalInsights/workspaces/query/AZFWApplicationRuleAggregation/read | Read data from the AZFWApplicationRuleAggregation table |
> | Microsoft.OperationalInsights/workspaces/query/AZFWDnsQuery/read | Read data from the AZFWDnsQuery table |
> | Microsoft.OperationalInsights/workspaces/query/AZFWFatFlow/read | Read data from the AZFWFatFlow table |
> | Microsoft.OperationalInsights/workspaces/query/AZFWFlowTrace/read | Read data from the AZFWFlowTrace table |
> | Microsoft.OperationalInsights/workspaces/query/AZFWIdpsSignature/read | Read data from the AZFWIdpsSignature table |
> | Microsoft.OperationalInsights/workspaces/query/AZFWInternalFqdnResolutionFailure/read | Read data from the AZFWInternalFqdnResolutionFailure table |
> | Microsoft.OperationalInsights/workspaces/query/AZFWNatRule/read | Read data from the AZFWNatRule table |
> | Microsoft.OperationalInsights/workspaces/query/AZFWNatRuleAggregation/read | Read data from the AZFWNatRuleAggregation table |
> | Microsoft.OperationalInsights/workspaces/query/AZFWNetworkRule/read | Read data from the AZFWNetworkRule table |
> | Microsoft.OperationalInsights/workspaces/query/AZFWNetworkRuleAggregation/read | Read data from the AZFWNetworkRuleAggregation table |
> | Microsoft.OperationalInsights/workspaces/query/AZFWThreatIntel/read | Read data from the AZFWThreatIntel table |
> | Microsoft.OperationalInsights/workspaces/query/AzureActivity/read | Read data from the AzureActivity table |
> | Microsoft.OperationalInsights/workspaces/query/AzureActivityV2/read | Read data from the AzureActivityV2 table |
> | Microsoft.OperationalInsights/workspaces/query/AzureAssessmentRecommendation/read | Read data from the AzureAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/AzureAttestationDiagnostics/read | Read data from the AzureAttestationDiagnostics table |
> | Microsoft.OperationalInsights/workspaces/query/AzureDevOpsAuditing/read | Read data from the AzureDevOpsAuditing table |
> | Microsoft.OperationalInsights/workspaces/query/AzureDiagnostics/read | Read data from the AzureDiagnostics table |
> | Microsoft.OperationalInsights/workspaces/query/AzureLoadTestingOperation/read | Read data from the AzureLoadTestingOperation table |
> | Microsoft.OperationalInsights/workspaces/query/AzureMetrics/read | Read data from the AzureMetrics table |
> | Microsoft.OperationalInsights/workspaces/query/BaiClusterEvent/read | Read data from the BaiClusterEvent table |
> | Microsoft.OperationalInsights/workspaces/query/BaiClusterNodeEvent/read | Read data from the BaiClusterNodeEvent table |
> | Microsoft.OperationalInsights/workspaces/query/BaiJobEvent/read | Read data from the BaiJobEvent table |
> | Microsoft.OperationalInsights/workspaces/query/BehaviorAnalytics/read | Read data from the BehaviorAnalytics table |
> | Microsoft.OperationalInsights/workspaces/query/BlockchainApplicationLog/read | Read data from the BlockchainApplicationLog table |
> | Microsoft.OperationalInsights/workspaces/query/BlockchainProxyLog/read | Read data from the BlockchainProxyLog table |
> | Microsoft.OperationalInsights/workspaces/query/CassandraAudit/read | Read data from the CassandraAudit table |
> | Microsoft.OperationalInsights/workspaces/query/CassandraLogs/read | Read data from the CassandraLogs table |
> | Microsoft.OperationalInsights/workspaces/query/CCFApplicationLogs/read | Read data from the CCFApplicationLogs table |
> | Microsoft.OperationalInsights/workspaces/query/CDBCassandraRequests/read | Read data from the CDBCassandraRequests table |
> | Microsoft.OperationalInsights/workspaces/query/CDBControlPlaneRequests/read | Read data from the CDBControlPlaneRequests table |
> | Microsoft.OperationalInsights/workspaces/query/CDBDataPlaneRequests/read | Read data from the CDBDataPlaneRequests table |
> | Microsoft.OperationalInsights/workspaces/query/CDBGremlinRequests/read | Read data from the CDBGremlinRequests table |
> | Microsoft.OperationalInsights/workspaces/query/CDBMongoRequests/read | Read data from the CDBMongoRequests table |
> | Microsoft.OperationalInsights/workspaces/query/CDBPartitionKeyRUConsumption/read | Read data from the CDBPartitionKeyRUConsumption table |
> | Microsoft.OperationalInsights/workspaces/query/CDBPartitionKeyStatistics/read | Read data from the CDBPartitionKeyStatistics table |
> | Microsoft.OperationalInsights/workspaces/query/CDBQueryRuntimeStatistics/read | Read data from the CDBQueryRuntimeStatistics table |
> | Microsoft.OperationalInsights/workspaces/query/ChaosStudioExperimentEventLogs/read | Read data from the ChaosStudioExperimentEventLogs table |
> | Microsoft.OperationalInsights/workspaces/query/CIEventsAudit/read | Read data from the CIEventsAudit table |
> | Microsoft.OperationalInsights/workspaces/query/CIEventsOperational/read | Read data from the CIEventsOperational table |
> | Microsoft.OperationalInsights/workspaces/query/CloudAppEvents/read | Read data from the CloudAppEvents table |
> | Microsoft.OperationalInsights/workspaces/query/CommonSecurityLog/read | Read data from the CommonSecurityLog table |
> | Microsoft.OperationalInsights/workspaces/query/ComputerGroup/read | Read data from the ComputerGroup table |
> | Microsoft.OperationalInsights/workspaces/query/ConfidentialWatchlist/read | Read data from the ConfidentialWatchlist table |
> | Microsoft.OperationalInsights/workspaces/query/ConfigurationChange/read | Read data from the ConfigurationChange table |
> | Microsoft.OperationalInsights/workspaces/query/ConfigurationData/read | Read data from the ConfigurationData table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerAppConsoleLogs/read | Read data from the ContainerAppConsoleLogs table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerAppSystemLogs/read | Read data from the ContainerAppSystemLogs table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerImageInventory/read | Read data from the ContainerImageInventory table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerInventory/read | Read data from the ContainerInventory table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerLog/read | Read data from the ContainerLog table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerLogV2/read | Read data from the ContainerLogV2 table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerNodeInventory/read | Read data from the ContainerNodeInventory table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerRegistryLoginEvents/read | Read data from the ContainerRegistryLoginEvents table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerRegistryRepositoryEvents/read | Read data from the ContainerRegistryRepositoryEvents table |
> | Microsoft.OperationalInsights/workspaces/query/ContainerServiceLog/read | Read data from the ContainerServiceLog table |
> | Microsoft.OperationalInsights/workspaces/query/CoreAzureBackup/read | Read data from the CoreAzureBackup table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksAccounts/read | Read data from the DatabricksAccounts table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksCapsule8Dataplane/read | Read data from the DatabricksCapsule8Dataplane table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksClamAVScan/read | Read data from the DatabricksClamAVScan table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksClusterLibraries/read | Read data from the DatabricksClusterLibraries table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksClusters/read | Read data from the DatabricksClusters table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksDatabricksSQL/read | Read data from the DatabricksDatabricksSQL table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksDBFS/read | Read data from the DatabricksDBFS table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksDeltaPipelines/read | Read data from the DatabricksDeltaPipelines table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksFeatureStore/read | Read data from the DatabricksFeatureStore table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksGenie/read | Read data from the DatabricksGenie table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksGitCredentials/read | Read data from the DatabricksGitCredentials table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksGlobalInitScripts/read | Read data from the DatabricksGlobalInitScripts table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksIAMRole/read | Read data from the DatabricksIAMRole table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksInstancePools/read | Read data from the DatabricksInstancePools table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksJobs/read | Read data from the DatabricksJobs table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksMLflowAcledArtifact/read | Read data from the DatabricksMLflowAcledArtifact table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksMLflowExperiment/read | Read data from the DatabricksMLflowExperiment table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksModelRegistry/read | Read data from the DatabricksModelRegistry table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksNotebook/read | Read data from the DatabricksNotebook table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksPartnerHub/read | Read data from the DatabricksPartnerHub table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksRemoteHistoryService/read | Read data from the DatabricksRemoteHistoryService table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksRepos/read | Read data from the DatabricksRepos table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksSecrets/read | Read data from the DatabricksSecrets table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksServerlessRealTimeInference/read | Read data from the DatabricksServerlessRealTimeInference table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksSQL/read | Read data from the DatabricksSQL table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksSQLPermissions/read | Read data from the DatabricksSQLPermissions table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksSSH/read | Read data from the DatabricksSSH table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksUnityCatalog/read | Read data from the DatabricksUnityCatalog table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksWebTerminal/read | Read data from the DatabricksWebTerminal table |
> | Microsoft.OperationalInsights/workspaces/query/DatabricksWorkspace/read | Read data from the DatabricksWorkspace table |
> | Microsoft.OperationalInsights/workspaces/query/DefenderIoTRawEvent/read | Read data from the DefenderIoTRawEvent table |
> | Microsoft.OperationalInsights/workspaces/query/dependencies/read | Read data from the dependencies table |
> | Microsoft.OperationalInsights/workspaces/query/DevCenterDiagnosticLogs/read | Read data from the DevCenterDiagnosticLogs table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceAppCrash/read | Read data from the DeviceAppCrash table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceAppLaunch/read | Read data from the DeviceAppLaunch table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceCalendar/read | Read data from the DeviceCalendar table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceCleanup/read | Read data from the DeviceCleanup table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceConnectSession/read | Read data from the DeviceConnectSession table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceEtw/read | Read data from the DeviceEtw table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceEvents/read | Read data from the DeviceEvents table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceFileCertificateInfo/read | Read data from the DeviceFileCertificateInfo table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceFileEvents/read | Read data from the DeviceFileEvents table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceHardwareHealth/read | Read data from the DeviceHardwareHealth table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceHealth/read | Read data from the DeviceHealth table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceHeartbeat/read | Read data from the DeviceHeartbeat table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceImageLoadEvents/read | Read data from the DeviceImageLoadEvents table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceInfo/read | Read data from the DeviceInfo table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceLogonEvents/read | Read data from the DeviceLogonEvents table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceNetworkEvents/read | Read data from the DeviceNetworkEvents table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceNetworkInfo/read | Read data from the DeviceNetworkInfo table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceProcessEvents/read | Read data from the DeviceProcessEvents table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceRegistryEvents/read | Read data from the DeviceRegistryEvents table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceSkypeHeartbeat/read | Read data from the DeviceSkypeHeartbeat table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceSkypeSignIn/read | Read data from the DeviceSkypeSignIn table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceTvmSecureConfigurationAssessment/read | Read data from the DeviceTvmSecureConfigurationAssessment table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceTvmSecureConfigurationAssessmentKB/read | Read data from the DeviceTvmSecureConfigurationAssessmentKB table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceTvmSoftwareInventory/read | Read data from the DeviceTvmSoftwareInventory table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceTvmSoftwareVulnerabilities/read | Read data from the DeviceTvmSoftwareVulnerabilities table |
> | Microsoft.OperationalInsights/workspaces/query/DeviceTvmSoftwareVulnerabilitiesKB/read | Read data from the DeviceTvmSoftwareVulnerabilitiesKB table |
> | Microsoft.OperationalInsights/workspaces/query/DHAppReliability/read | Read data from the DHAppReliability table |
> | Microsoft.OperationalInsights/workspaces/query/DHDriverReliability/read | Read data from the DHDriverReliability table |
> | Microsoft.OperationalInsights/workspaces/query/DHLogonFailures/read | Read data from the DHLogonFailures table |
> | Microsoft.OperationalInsights/workspaces/query/DHLogonMetrics/read | Read data from the DHLogonMetrics table |
> | Microsoft.OperationalInsights/workspaces/query/DHOSCrashData/read | Read data from the DHOSCrashData table |
> | Microsoft.OperationalInsights/workspaces/query/DHOSReliability/read | Read data from the DHOSReliability table |
> | Microsoft.OperationalInsights/workspaces/query/DHWipAppLearning/read | Read data from the DHWipAppLearning table |
> | Microsoft.OperationalInsights/workspaces/query/DnsEvents/read | Read data from the DnsEvents table |
> | Microsoft.OperationalInsights/workspaces/query/DnsInventory/read | Read data from the DnsInventory table |
> | Microsoft.OperationalInsights/workspaces/query/DSMAzureBlobStorageLogs/read | Read data from the DSMAzureBlobStorageLogs table |
> | Microsoft.OperationalInsights/workspaces/query/DSMDataClassificationLogs/read | Read data from the DSMDataClassificationLogs table |
> | Microsoft.OperationalInsights/workspaces/query/DSMDataLabelingLogs/read | Read data from the DSMDataLabelingLogs table |
> | Microsoft.OperationalInsights/workspaces/query/DynamicEventCollection/read | Read data from the DynamicEventCollection table |
> | Microsoft.OperationalInsights/workspaces/query/Dynamics365Activity/read | Read data from the Dynamics365Activity table |
> | Microsoft.OperationalInsights/workspaces/query/DynamicSummary/read | Read data from the DynamicSummary table |
> | Microsoft.OperationalInsights/workspaces/query/EmailAttachmentInfo/read | Read data from the EmailAttachmentInfo table |
> | Microsoft.OperationalInsights/workspaces/query/EmailEvents/read | Read data from the EmailEvents table |
> | Microsoft.OperationalInsights/workspaces/query/EmailPostDeliveryEvents/read | Read data from the EmailPostDeliveryEvents table |
> | Microsoft.OperationalInsights/workspaces/query/EmailUrlInfo/read | Read data from the EmailUrlInfo table |
> | Microsoft.OperationalInsights/workspaces/query/ETWEvent/read | Read data from the ETWEvent table |
> | Microsoft.OperationalInsights/workspaces/query/Event/read | Read data from the Event table |
> | Microsoft.OperationalInsights/workspaces/query/ExchangeAssessmentRecommendation/read | Read data from the ExchangeAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/ExchangeOnlineAssessmentRecommendation/read | Read data from the ExchangeOnlineAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/FailedIngestion/read | Read data from the FailedIngestion table |
> | Microsoft.OperationalInsights/workspaces/query/FunctionAppLogs/read | Read data from the FunctionAppLogs table |
> | Microsoft.OperationalInsights/workspaces/query/GCPAuditLogs/read | Read data from the GCPAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightAmbariClusterAlerts/read | Read data from the HDInsightAmbariClusterAlerts table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightAmbariSystemMetrics/read | Read data from the HDInsightAmbariSystemMetrics table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightGatewayAuditLogs/read | Read data from the HDInsightGatewayAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightHadoopAndYarnLogs/read | Read data from the HDInsightHadoopAndYarnLogs table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightHadoopAndYarnMetrics/read | Read data from the HDInsightHadoopAndYarnMetrics table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightHBaseLogs/read | Read data from the HDInsightHBaseLogs table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightHBaseMetrics/read | Read data from the HDInsightHBaseMetrics table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightHiveAndLLAPLogs/read | Read data from the HDInsightHiveAndLLAPLogs table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightHiveAndLLAPMetrics/read | Read data from the HDInsightHiveAndLLAPMetrics table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightHiveQueryAppStats/read | Read data from the HDInsightHiveQueryAppStats table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightHiveTezAppStats/read | Read data from the HDInsightHiveTezAppStats table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightJupyterNotebookEvents/read | Read data from the HDInsightJupyterNotebookEvents table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightKafkaLogs/read | Read data from the HDInsightKafkaLogs table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightKafkaMetrics/read | Read data from the HDInsightKafkaMetrics table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightKafkaServerLog/read | Read data from the HDInsightKafkaServerLog table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightOozieLogs/read | Read data from the HDInsightOozieLogs table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightRangerAuditLogs/read | Read data from the HDInsightRangerAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightSecurityLogs/read | Read data from the HDInsightSecurityLogs table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightSparkApplicationEvents/read | Read data from the HDInsightSparkApplicationEvents table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightSparkBlockManagerEvents/read | Read data from the HDInsightSparkBlockManagerEvents table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightSparkEnvironmentEvents/read | Read data from the HDInsightSparkEnvironmentEvents table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightSparkExecutorEvents/read | Read data from the HDInsightSparkExecutorEvents table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightSparkExtraEvents/read | Read data from the HDInsightSparkExtraEvents table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightSparkJobEvents/read | Read data from the HDInsightSparkJobEvents table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightSparkLogs/read | Read data from the HDInsightSparkLogs table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightSparkSQLExecutionEvents/read | Read data from the HDInsightSparkSQLExecutionEvents table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightSparkStageEvents/read | Read data from the HDInsightSparkStageEvents table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightSparkStageTaskAccumulables/read | Read data from the HDInsightSparkStageTaskAccumulables table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightSparkTaskEvents/read | Read data from the HDInsightSparkTaskEvents table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightStormLogs/read | Read data from the HDInsightStormLogs table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightStormMetrics/read | Read data from the HDInsightStormMetrics table |
> | Microsoft.OperationalInsights/workspaces/query/HDInsightStormTopologyMetrics/read | Read data from the HDInsightStormTopologyMetrics table |
> | Microsoft.OperationalInsights/workspaces/query/HealthStateChangeEvent/read | Read data from the HealthStateChangeEvent table |
> | Microsoft.OperationalInsights/workspaces/query/Heartbeat/read | Read data from the Heartbeat table |
> | Microsoft.OperationalInsights/workspaces/query/HuntingBookmark/read | Read data from the HuntingBookmark table |
> | Microsoft.OperationalInsights/workspaces/query/IdentityDirectoryEvents/read | Read data from the IdentityDirectoryEvents table |
> | Microsoft.OperationalInsights/workspaces/query/IdentityInfo/read | Read data from the IdentityInfo table |
> | Microsoft.OperationalInsights/workspaces/query/IdentityLogonEvents/read | Read data from the IdentityLogonEvents table |
> | Microsoft.OperationalInsights/workspaces/query/IdentityQueryEvents/read | Read data from the IdentityQueryEvents table |
> | Microsoft.OperationalInsights/workspaces/query/IISAssessmentRecommendation/read | Read data from the IISAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/InsightsMetrics/read | Read data from the InsightsMetrics table |
> | Microsoft.OperationalInsights/workspaces/query/IntuneAuditLogs/read | Read data from the IntuneAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/IntuneDeviceComplianceOrg/read | Read data from the IntuneDeviceComplianceOrg table |
> | Microsoft.OperationalInsights/workspaces/query/IntuneDevices/read | Read data from the IntuneDevices table |
> | Microsoft.OperationalInsights/workspaces/query/IntuneOperationalLogs/read | Read data from the IntuneOperationalLogs table |
> | Microsoft.OperationalInsights/workspaces/query/IoTHubDistributedTracing/read | Read data from the IoTHubDistributedTracing table |
> | Microsoft.OperationalInsights/workspaces/query/KubeEvents/read | Read data from the KubeEvents table |
> | Microsoft.OperationalInsights/workspaces/query/KubeHealth/read | Read data from the KubeHealth table |
> | Microsoft.OperationalInsights/workspaces/query/KubeMonAgentEvents/read | Read data from the KubeMonAgentEvents table |
> | Microsoft.OperationalInsights/workspaces/query/KubeNodeInventory/read | Read data from the KubeNodeInventory table |
> | Microsoft.OperationalInsights/workspaces/query/KubePodInventory/read | Read data from the KubePodInventory table |
> | Microsoft.OperationalInsights/workspaces/query/KubePVInventory/read | Read data from the KubePVInventory table |
> | Microsoft.OperationalInsights/workspaces/query/KubeServices/read | Read data from the KubeServices table |
> | Microsoft.OperationalInsights/workspaces/query/LAQueryLogs/read | Read data from the LAQueryLogs table |
> | Microsoft.OperationalInsights/workspaces/query/LinuxAuditLog/read | Read data from the LinuxAuditLog table |
> | Microsoft.OperationalInsights/workspaces/query/LogicAppWorkflowRuntime/read | Read data from the LogicAppWorkflowRuntime table |
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
> | Microsoft.OperationalInsights/workspaces/query/MADeviceReadiness/read | Read data from the MADeviceReadiness table |
> | Microsoft.OperationalInsights/workspaces/query/MADriverInstanceReadiness/read | Read data from the MADriverInstanceReadiness table |
> | Microsoft.OperationalInsights/workspaces/query/MADriverReadiness/read | Read data from the MADriverReadiness table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddin/read | Read data from the MAOfficeAddin table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddinInstance/read | Read data from the MAOfficeAddinInstance table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddinReadiness/read | Read data from the MAOfficeAddinReadiness table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAppInstance/read | Read data from the MAOfficeAppInstance table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeAppReadiness/read | Read data from the MAOfficeAppReadiness table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeBuildInfo/read | Read data from the MAOfficeBuildInfo table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeCurrencyAssessment/read | Read data from the MAOfficeCurrencyAssessment table |
> | Microsoft.OperationalInsights/workspaces/query/MAOfficeSuiteInstance/read | Read data from the MAOfficeSuiteInstance table |
> | Microsoft.OperationalInsights/workspaces/query/MAProposedPilotDevices/read | Read data from the MAProposedPilotDevices table |
> | Microsoft.OperationalInsights/workspaces/query/MAWindowsBuildInfo/read | Read data from the MAWindowsBuildInfo table |
> | Microsoft.OperationalInsights/workspaces/query/MAWindowsCurrencyAssessment/read | Read data from the MAWindowsCurrencyAssessment table |
> | Microsoft.OperationalInsights/workspaces/query/MAWindowsCurrencyAssessmentDailyCounts/read | Read data from the MAWindowsCurrencyAssessmentDailyCounts table |
> | Microsoft.OperationalInsights/workspaces/query/MAWindowsDeploymentStatus/read | Read data from the MAWindowsDeploymentStatus table |
> | Microsoft.OperationalInsights/workspaces/query/MAWindowsDeploymentStatusNRT/read | Read data from the MAWindowsDeploymentStatusNRT table |
> | Microsoft.OperationalInsights/workspaces/query/McasShadowItReporting/read | Read data from the McasShadowItReporting table |
> | Microsoft.OperationalInsights/workspaces/query/MCCEventLogs/read | Read data from the MCCEventLogs table |
> | Microsoft.OperationalInsights/workspaces/query/MCVPAuditLogs/read | Read data from the MCVPAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/MCVPOperationLogs/read | Read data from the MCVPOperationLogs table |
> | Microsoft.OperationalInsights/workspaces/query/MicrosoftAzureBastionAuditLogs/read | Read data from the MicrosoftAzureBastionAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/MicrosoftDataShareReceivedSnapshotLog/read | Read data from the MicrosoftDataShareReceivedSnapshotLog table |
> | Microsoft.OperationalInsights/workspaces/query/MicrosoftDataShareSentSnapshotLog/read | Read data from the MicrosoftDataShareSentSnapshotLog table |
> | Microsoft.OperationalInsights/workspaces/query/MicrosoftDataShareShareLog/read | Read data from the MicrosoftDataShareShareLog table |
> | Microsoft.OperationalInsights/workspaces/query/MicrosoftDynamicsTelemetryPerformanceLogs/read | Read data from the MicrosoftDynamicsTelemetryPerformanceLogs table |
> | Microsoft.OperationalInsights/workspaces/query/MicrosoftDynamicsTelemetrySystemMetricsLogs/read | Read data from the MicrosoftDynamicsTelemetrySystemMetricsLogs table |
> | Microsoft.OperationalInsights/workspaces/query/MicrosoftGraphActivityLogs/read | Read data from the MicrosoftGraphActivityLogs table |
> | Microsoft.OperationalInsights/workspaces/query/MicrosoftHealthcareApisAuditLogs/read | Read data from the MicrosoftHealthcareApisAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/MicrosoftPurviewInformationProtection/read | Read data from the MicrosoftPurviewInformationProtection table |
> | Microsoft.OperationalInsights/workspaces/query/NetworkAccessTraffic/read | Read data from the NetworkAccessTraffic table |
> | Microsoft.OperationalInsights/workspaces/query/NetworkMonitoring/read | Read data from the NetworkMonitoring table |
> | Microsoft.OperationalInsights/workspaces/query/NetworkSessions/read | Read data from the NetworkSessions table |
> | Microsoft.OperationalInsights/workspaces/query/NSPAccessLogs/read | Read data from the NSPAccessLogs table |
> | Microsoft.OperationalInsights/workspaces/query/NTAIpDetails/read | Read data from the NTAIpDetails table |
> | Microsoft.OperationalInsights/workspaces/query/NTANetAnalytics/read | Read data from the NTANetAnalytics table |
> | Microsoft.OperationalInsights/workspaces/query/NTATopologyDetails/read | Read data from the NTATopologyDetails table |
> | Microsoft.OperationalInsights/workspaces/query/NWConnectionMonitorDestinationListenerResult/read | Read data from the NWConnectionMonitorDestinationListenerResult table |
> | Microsoft.OperationalInsights/workspaces/query/NWConnectionMonitorDNSResult/read | Read data from the NWConnectionMonitorDNSResult table |
> | Microsoft.OperationalInsights/workspaces/query/NWConnectionMonitorPathResult/read | Read data from the NWConnectionMonitorPathResult table |
> | Microsoft.OperationalInsights/workspaces/query/NWConnectionMonitorTestResult/read | Read data from the NWConnectionMonitorTestResult table |
> | Microsoft.OperationalInsights/workspaces/query/OEPAirFlowTask/read | Read data from the OEPAirFlowTask table |
> | Microsoft.OperationalInsights/workspaces/query/OEPElasticOperator/read | Read data from the OEPElasticOperator table |
> | Microsoft.OperationalInsights/workspaces/query/OEPElasticsearch/read | Read data from the OEPElasticsearch table |
> | Microsoft.OperationalInsights/workspaces/query/OfficeActivity/read | Read data from the OfficeActivity table |
> | Microsoft.OperationalInsights/workspaces/query/OLPSupplyChainEntityOperations/read | Read data from the OLPSupplyChainEntityOperations table |
> | Microsoft.OperationalInsights/workspaces/query/OLPSupplyChainEvents/read | Read data from the OLPSupplyChainEvents table |
> | Microsoft.OperationalInsights/workspaces/query/Operation/read | Read data from the Operation table |
> | Microsoft.OperationalInsights/workspaces/query/Perf/read | Read data from the Perf table |
> | Microsoft.OperationalInsights/workspaces/query/PFTitleAuditLogs/read | Read data from the PFTitleAuditLogs table |
> | Microsoft.OperationalInsights/workspaces/query/PowerBIActivity/read | Read data from the PowerBIActivity table |
> | Microsoft.OperationalInsights/workspaces/query/PowerBIAuditTenant/read | Read data from the PowerBIAuditTenant table |
> | Microsoft.OperationalInsights/workspaces/query/PowerBIDatasetsTenant/read | Read data from the PowerBIDatasetsTenant table |
> | Microsoft.OperationalInsights/workspaces/query/PowerBIDatasetsTenantPreview/read | Read data from the PowerBIDatasetsTenantPreview table |
> | Microsoft.OperationalInsights/workspaces/query/PowerBIDatasetsWorkspace/read | Read data from the PowerBIDatasetsWorkspace table |
> | Microsoft.OperationalInsights/workspaces/query/PowerBIDatasetsWorkspacePreview/read | Read data from the PowerBIDatasetsWorkspacePreview table |
> | Microsoft.OperationalInsights/workspaces/query/PowerBIReportUsageTenant/read | Read data from the PowerBIReportUsageTenant table |
> | Microsoft.OperationalInsights/workspaces/query/PowerBIReportUsageWorkspace/read | Read data from the PowerBIReportUsageWorkspace table |
> | Microsoft.OperationalInsights/workspaces/query/ProjectActivity/read | Read data from the ProjectActivity table |
> | Microsoft.OperationalInsights/workspaces/query/ProtectionStatus/read | Read data from the ProtectionStatus table |
> | Microsoft.OperationalInsights/workspaces/query/PurviewDataSensitivityLogs/read | Read data from the PurviewDataSensitivityLogs table |
> | Microsoft.OperationalInsights/workspaces/query/PurviewScanStatusLogs/read | Read data from the PurviewScanStatusLogs table |
> | Microsoft.OperationalInsights/workspaces/query/PurviewSecurityLogs/read | Read data from the PurviewSecurityLogs table |
> | Microsoft.OperationalInsights/workspaces/query/REDConnectionEvents/read | Read data from the REDConnectionEvents table |
> | Microsoft.OperationalInsights/workspaces/query/requests/read | Read data from the requests table |
> | Microsoft.OperationalInsights/workspaces/query/ResourceManagementPublicAccessLogs/read | Read data from the ResourceManagementPublicAccessLogs table |
> | Microsoft.OperationalInsights/workspaces/query/SCCMAssessmentRecommendation/read | Read data from the SCCMAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/SCOMAssessmentRecommendation/read | Read data from the SCOMAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/SecureScoreControls/read | Read data from the SecureScoreControls table |
> | Microsoft.OperationalInsights/workspaces/query/SecureScores/read | Read data from the SecureScores table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityAlert/read | Read data from the SecurityAlert table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityBaseline/read | Read data from the SecurityBaseline table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityBaselineSummary/read | Read data from the SecurityBaselineSummary table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityDetection/read | Read data from the SecurityDetection table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityEvent/read | Read data from the SecurityEvent table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityIncident/read | Read data from the SecurityIncident table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityIoTRawEvent/read | Read data from the SecurityIoTRawEvent table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityNestedRecommendation/read | Read data from the SecurityNestedRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityRecommendation/read | Read data from the SecurityRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/SecurityRegulatoryCompliance/read | Read data from the SecurityRegulatoryCompliance table |
> | Microsoft.OperationalInsights/workspaces/query/SentinelAudit/read | Read data from the SentinelAudit table |
> | Microsoft.OperationalInsights/workspaces/query/SentinelHealth/read | Read data from the SentinelHealth table |
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
> | Microsoft.OperationalInsights/workspaces/query/SqlAtpStatus/read | Read data from the SqlAtpStatus table |
> | Microsoft.OperationalInsights/workspaces/query/SqlDataClassification/read | Read data from the SqlDataClassification table |
> | Microsoft.OperationalInsights/workspaces/query/SQLSecurityAuditEvents/read | Read data from the SQLSecurityAuditEvents table |
> | Microsoft.OperationalInsights/workspaces/query/SqlVulnerabilityAssessmentResult/read | Read data from the SqlVulnerabilityAssessmentResult table |
> | Microsoft.OperationalInsights/workspaces/query/SqlVulnerabilityAssessmentScanStatus/read | Read data from the SqlVulnerabilityAssessmentScanStatus table |
> | Microsoft.OperationalInsights/workspaces/query/StorageBlobLogs/read | Read data from the StorageBlobLogs table |
> | Microsoft.OperationalInsights/workspaces/query/StorageCacheOperationEvents/read | Read data from the StorageCacheOperationEvents table |
> | Microsoft.OperationalInsights/workspaces/query/StorageCacheUpgradeEvents/read | Read data from the StorageCacheUpgradeEvents table |
> | Microsoft.OperationalInsights/workspaces/query/StorageCacheWarningEvents/read | Read data from the StorageCacheWarningEvents table |
> | Microsoft.OperationalInsights/workspaces/query/StorageFileLogs/read | Read data from the StorageFileLogs table |
> | Microsoft.OperationalInsights/workspaces/query/StorageMalwareScanningResults/read | Read data from the StorageMalwareScanningResults table |
> | Microsoft.OperationalInsights/workspaces/query/StorageMoverCopyLogsFailed/read | Read data from the StorageMoverCopyLogsFailed table |
> | Microsoft.OperationalInsights/workspaces/query/StorageMoverCopyLogsTransferred/read | Read data from the StorageMoverCopyLogsTransferred table |
> | Microsoft.OperationalInsights/workspaces/query/StorageMoverJobRunLogs/read | Read data from the StorageMoverJobRunLogs table |
> | Microsoft.OperationalInsights/workspaces/query/StorageQueueLogs/read | Read data from the StorageQueueLogs table |
> | Microsoft.OperationalInsights/workspaces/query/StorageTableLogs/read | Read data from the StorageTableLogs table |
> | Microsoft.OperationalInsights/workspaces/query/SucceededIngestion/read | Read data from the SucceededIngestion table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseBigDataPoolApplicationsEnded/read | Read data from the SynapseBigDataPoolApplicationsEnded table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseBuiltinSqlPoolRequestsEnded/read | Read data from the SynapseBuiltinSqlPoolRequestsEnded table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseDXCommand/read | Read data from the SynapseDXCommand table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseDXFailedIngestion/read | Read data from the SynapseDXFailedIngestion table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseDXIngestionBatching/read | Read data from the SynapseDXIngestionBatching table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseDXQuery/read | Read data from the SynapseDXQuery table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseDXSucceededIngestion/read | Read data from the SynapseDXSucceededIngestion table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseDXTableDetails/read | Read data from the SynapseDXTableDetails table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseDXTableUsageStatistics/read | Read data from the SynapseDXTableUsageStatistics table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseGatewayApiRequests/read | Read data from the SynapseGatewayApiRequests table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseGatewayEvents/read | Read data from the SynapseGatewayEvents table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseIntegrationActivityRuns/read | Read data from the SynapseIntegrationActivityRuns table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseIntegrationPipelineRuns/read | Read data from the SynapseIntegrationPipelineRuns table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseIntegrationTriggerRuns/read | Read data from the SynapseIntegrationTriggerRuns table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseLinkEvent/read | Read data from the SynapseLinkEvent table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseRBACEvents/read | Read data from the SynapseRBACEvents table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseRbacOperations/read | Read data from the SynapseRbacOperations table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseScopePoolScopeJobsEnded/read | Read data from the SynapseScopePoolScopeJobsEnded table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseScopePoolScopeJobsStateChange/read | Read data from the SynapseScopePoolScopeJobsStateChange table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseSqlPoolDmsWorkers/read | Read data from the SynapseSqlPoolDmsWorkers table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseSqlPoolExecRequests/read | Read data from the SynapseSqlPoolExecRequests table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseSqlPoolRequestSteps/read | Read data from the SynapseSqlPoolRequestSteps table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseSqlPoolSqlRequests/read | Read data from the SynapseSqlPoolSqlRequests table |
> | Microsoft.OperationalInsights/workspaces/query/SynapseSqlPoolWaits/read | Read data from the SynapseSqlPoolWaits table |
> | Microsoft.OperationalInsights/workspaces/query/Syslog/read | Read data from the Syslog table |
> | Microsoft.OperationalInsights/workspaces/query/Tables.Custom/read | Reading data from any custom log |
> | Microsoft.OperationalInsights/workspaces/query/ThreatIntelligenceIndicator/read | Read data from the ThreatIntelligenceIndicator table |
> | Microsoft.OperationalInsights/workspaces/query/TSIIngress/read | Read data from the TSIIngress table |
> | Microsoft.OperationalInsights/workspaces/query/UAApp/read | Read data from the UAApp table |
> | Microsoft.OperationalInsights/workspaces/query/UAComputer/read | Read data from the UAComputer table |
> | Microsoft.OperationalInsights/workspaces/query/UAComputerRank/read | Read data from the UAComputerRank table |
> | Microsoft.OperationalInsights/workspaces/query/UADriver/read | Read data from the UADriver table |
> | Microsoft.OperationalInsights/workspaces/query/UADriverProblemCodes/read | Read data from the UADriverProblemCodes table |
> | Microsoft.OperationalInsights/workspaces/query/UAFeedback/read | Read data from the UAFeedback table |
> | Microsoft.OperationalInsights/workspaces/query/UAIESiteDiscovery/read | Read data from the UAIESiteDiscovery table |
> | Microsoft.OperationalInsights/workspaces/query/UAOfficeAddIn/read | Read data from the UAOfficeAddIn table |
> | Microsoft.OperationalInsights/workspaces/query/UAProposedActionPlan/read | Read data from the UAProposedActionPlan table |
> | Microsoft.OperationalInsights/workspaces/query/UASysReqIssue/read | Read data from the UASysReqIssue table |
> | Microsoft.OperationalInsights/workspaces/query/UAUpgradedComputer/read | Read data from the UAUpgradedComputer table |
> | Microsoft.OperationalInsights/workspaces/query/UCClient/read | Read data from the UCClient table |
> | Microsoft.OperationalInsights/workspaces/query/UCClientReadinessStatus/read | Read data from the UCClientReadinessStatus table |
> | Microsoft.OperationalInsights/workspaces/query/UCClientUpdateStatus/read | Read data from the UCClientUpdateStatus table |
> | Microsoft.OperationalInsights/workspaces/query/UCDeviceAlert/read | Read data from the UCDeviceAlert table |
> | Microsoft.OperationalInsights/workspaces/query/UCDOAggregatedStatus/read | Read data from the UCDOAggregatedStatus table |
> | Microsoft.OperationalInsights/workspaces/query/UCDOStatus/read | Read data from the UCDOStatus table |
> | Microsoft.OperationalInsights/workspaces/query/UCServiceUpdateStatus/read | Read data from the UCServiceUpdateStatus table |
> | Microsoft.OperationalInsights/workspaces/query/UCUpdateAlert/read | Read data from the UCUpdateAlert table |
> | Microsoft.OperationalInsights/workspaces/query/Update/read | Read data from the Update table |
> | Microsoft.OperationalInsights/workspaces/query/UpdateRunProgress/read | Read data from the UpdateRunProgress table |
> | Microsoft.OperationalInsights/workspaces/query/UpdateSummary/read | Read data from the UpdateSummary table |
> | Microsoft.OperationalInsights/workspaces/query/UrlClickEvents/read | Read data from the UrlClickEvents table |
> | Microsoft.OperationalInsights/workspaces/query/Usage/read | Read data from the Usage table |
> | Microsoft.OperationalInsights/workspaces/query/UserAccessAnalytics/read | Read data from the UserAccessAnalytics table |
> | Microsoft.OperationalInsights/workspaces/query/UserPeerAnalytics/read | Read data from the UserPeerAnalytics table |
> | Microsoft.OperationalInsights/workspaces/query/VIAudit/read | Read data from the VIAudit table |
> | Microsoft.OperationalInsights/workspaces/query/VIIndexing/read | Read data from the VIIndexing table |
> | Microsoft.OperationalInsights/workspaces/query/VMBoundPort/read | Read data from the VMBoundPort table |
> | Microsoft.OperationalInsights/workspaces/query/VMComputer/read | Read data from the VMComputer table |
> | Microsoft.OperationalInsights/workspaces/query/VMConnection/read | Read data from the VMConnection table |
> | Microsoft.OperationalInsights/workspaces/query/VMProcess/read | Read data from the VMProcess table |
> | Microsoft.OperationalInsights/workspaces/query/W3CIISLog/read | Read data from the W3CIISLog table |
> | Microsoft.OperationalInsights/workspaces/query/WaaSDeploymentStatus/read | Read data from the WaaSDeploymentStatus table |
> | Microsoft.OperationalInsights/workspaces/query/WaaSInsiderStatus/read | Read data from the WaaSInsiderStatus table |
> | Microsoft.OperationalInsights/workspaces/query/WaaSUpdateStatus/read | Read data from the WaaSUpdateStatus table |
> | Microsoft.OperationalInsights/workspaces/query/Watchlist/read | Read data from the Watchlist table |
> | Microsoft.OperationalInsights/workspaces/query/WDAVStatus/read | Read data from the WDAVStatus table |
> | Microsoft.OperationalInsights/workspaces/query/WDAVThreat/read | Read data from the WDAVThreat table |
> | Microsoft.OperationalInsights/workspaces/query/WebPubSubConnectivity/read | Read data from the WebPubSubConnectivity table |
> | Microsoft.OperationalInsights/workspaces/query/WebPubSubHttpRequest/read | Read data from the WebPubSubHttpRequest table |
> | Microsoft.OperationalInsights/workspaces/query/WebPubSubMessaging/read | Read data from the WebPubSubMessaging table |
> | Microsoft.OperationalInsights/workspaces/query/WindowsClientAssessmentRecommendation/read | Read data from the WindowsClientAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/WindowsEvent/read | Read data from the WindowsEvent table |
> | Microsoft.OperationalInsights/workspaces/query/WindowsFirewall/read | Read data from the WindowsFirewall table |
> | Microsoft.OperationalInsights/workspaces/query/WindowsServerAssessmentRecommendation/read | Read data from the WindowsServerAssessmentRecommendation table |
> | Microsoft.OperationalInsights/workspaces/query/WireData/read | Read data from the WireData table |
> | Microsoft.OperationalInsights/workspaces/query/WorkloadDiagnosticLogs/read | Read data from the WorkloadDiagnosticLogs table |
> | Microsoft.OperationalInsights/workspaces/query/WorkloadMonitoringPerf/read | Read data from the WorkloadMonitoringPerf table |
> | Microsoft.OperationalInsights/workspaces/query/WUDOAggregatedStatus/read | Read data from the WUDOAggregatedStatus table |
> | Microsoft.OperationalInsights/workspaces/query/WUDOStatus/read | Read data from the WUDOStatus table |
> | Microsoft.OperationalInsights/workspaces/query/WVDAgentHealthStatus/read | Read data from the WVDAgentHealthStatus table |
> | Microsoft.OperationalInsights/workspaces/query/WVDAutoscaleEvaluationPooled/read | Read data from the WVDAutoscaleEvaluationPooled table |
> | Microsoft.OperationalInsights/workspaces/query/WVDCheckpoints/read | Read data from the WVDCheckpoints table |
> | Microsoft.OperationalInsights/workspaces/query/WVDConnectionGraphicsDataPreview/read | Read data from the WVDConnectionGraphicsDataPreview table |
> | Microsoft.OperationalInsights/workspaces/query/WVDConnectionNetworkData/read | Read data from the WVDConnectionNetworkData table |
> | Microsoft.OperationalInsights/workspaces/query/WVDConnections/read | Read data from the WVDConnections table |
> | Microsoft.OperationalInsights/workspaces/query/WVDErrors/read | Read data from the WVDErrors table |
> | Microsoft.OperationalInsights/workspaces/query/WVDFeeds/read | Read data from the WVDFeeds table |
> | Microsoft.OperationalInsights/workspaces/query/WVDHostRegistrations/read | Read data from the WVDHostRegistrations table |
> | Microsoft.OperationalInsights/workspaces/query/WVDManagement/read | Read data from the WVDManagement table |
> | Microsoft.OperationalInsights/workspaces/query/WVDSessionHostManagement/read | Read data from the WVDSessionHostManagement table |
> | Microsoft.OperationalInsights/workspaces/restoreLogs/write | Restore data from a table. |
> | microsoft.operationalinsights/workspaces/restoreLogs/write | Restore data from a table. |
> | Microsoft.OperationalInsights/workspaces/rules/read | Get alert rule. |
> | microsoft.operationalinsights/workspaces/rules/read | Get all alert rules. |
> | Microsoft.OperationalInsights/workspaces/savedSearches/read | Gets a saved search query. |
> | Microsoft.OperationalInsights/workspaces/savedSearches/write | Creates a saved search query |
> | Microsoft.OperationalInsights/workspaces/savedSearches/delete | Deletes a saved search query |
> | Microsoft.OperationalInsights/workspaces/savedSearches/results/read | Get saved searches results. Deprecated. |
> | microsoft.operationalinsights/workspaces/savedsearches/results/read | Get saved searches results. Deprecated |
> | microsoft.operationalinsights/workspaces/savedsearches/schedules/read | Get scheduled searches. |
> | microsoft.operationalinsights/workspaces/savedsearches/schedules/delete | Delete scheduled searches. |
> | microsoft.operationalinsights/workspaces/savedsearches/schedules/write | Create or update scheduled searches. |
> | microsoft.operationalinsights/workspaces/savedsearches/schedules/actions/read | Get scheduled search actions. |
> | microsoft.operationalinsights/workspaces/savedsearches/schedules/actions/delete | Delete scheduled search actions. |
> | microsoft.operationalinsights/workspaces/savedsearches/schedules/actions/write | Create or update scheduled search actions. |
> | Microsoft.OperationalInsights/workspaces/schedules/read | Get scheduled saved search. |
> | Microsoft.OperationalInsights/workspaces/schedules/delete | Delete scheduled saved search. |
> | Microsoft.OperationalInsights/workspaces/schedules/write | Create or update scheduled saved search. |
> | Microsoft.OperationalInsights/workspaces/schedules/actions/read | Get Management Configuration action. |
> | Microsoft.OperationalInsights/workspaces/schema/read | Gets the search schema for the workspace.  Search schema includes the exposed fields and their types. |
> | Microsoft.OperationalInsights/workspaces/scopedprivatelinkproxies/read | Get Scoped Private Link Proxy |
> | Microsoft.OperationalInsights/workspaces/scopedprivatelinkproxies/write | Put Scoped Private Link Proxy |
> | Microsoft.OperationalInsights/workspaces/scopedprivatelinkproxies/delete | Delete Scoped Private Link Proxy |
> | microsoft.operationalinsights/workspaces/scopedPrivateLinkProxies/read | Get Scoped Private Link Proxy. |
> | microsoft.operationalinsights/workspaces/scopedPrivateLinkProxies/write | Put Scoped Private Link Proxy. |
> | microsoft.operationalinsights/workspaces/scopedPrivateLinkProxies/delete | Delete Scoped Private Link Proxy. |
> | Microsoft.OperationalInsights/workspaces/search/read | Get search results. Deprecated. |
> | microsoft.operationalinsights/workspaces/search/read | Get search results. Deprecated. |
> | Microsoft.OperationalInsights/workspaces/searchJobs/write | Run a search job. |
> | microsoft.operationalinsights/workspaces/searchJobs/write | Run a search job. |
> | Microsoft.OperationalInsights/workspaces/sharedkeys/read | Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
> | Microsoft.OperationalInsights/workspaces/storageinsightconfigs/write | Creates a new storage configuration. These configurations are used to pull data from a location in an existing storage account. |
> | Microsoft.OperationalInsights/workspaces/storageinsightconfigs/read | Gets a storage configuration. |
> | Microsoft.OperationalInsights/workspaces/storageinsightconfigs/delete | Deletes a storage configuration. This will stop Microsoft Operational Insights from reading data from the storage account. |
> | Microsoft.OperationalInsights/workspaces/tables/write | Create or update a log analytics table. |
> | Microsoft.OperationalInsights/workspaces/tables/read | Get a log analytics table. |
> | Microsoft.OperationalInsights/workspaces/tables/delete | Delete a log analytics table. |
> | microsoft.operationalinsights/workspaces/tables/write | Create or update a log analytics table. |
> | microsoft.operationalinsights/workspaces/tables/read | Get a log analytics table. |
> | microsoft.operationalinsights/workspaces/tables/delete | Delete a log analytics table. |
> | Microsoft.OperationalInsights/workspaces/tables/query/read | Run queries over the data of a specific table in the workspace |
> | Microsoft.OperationalInsights/workspaces/upgradetranslationfailures/read | Get Search Upgrade Translation Failure log for the workspace |
> | Microsoft.OperationalInsights/workspaces/usages/read | Gets usage data for a workspace including the amount of data read by the workspace. |
> | Microsoft.OperationalInsights/workspaces/views/read | Get workspace view. |
> | Microsoft.OperationalInsights/workspaces/views/delete | Delete workspace view. |
> | Microsoft.OperationalInsights/workspaces/views/write | Create or update workspace view. |
> | microsoft.operationalinsights/workspaces/views/read | Get workspace views. |
> | microsoft.operationalinsights/workspaces/views/write | Create or update a workspace view. |
> | microsoft.operationalinsights/workspaces/views/delete | Delete a workspace view. |

### Microsoft.OperationsManagement

Azure service: [Azure Monitor](../../../azure-monitor/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.OperationsManagement/register/action | Register a subscription to a resource provider. |
> | Microsoft.OperationsManagement/unregister/action | UnRegister a subscription to a resource provider. |
> | Microsoft.OperationsManagement/managementassociations/write | Create or update  Management Association. |
> | Microsoft.OperationsManagement/managementassociations/read | Get Management Association. |
> | Microsoft.OperationsManagement/managementassociations/delete | Delete Management Association. |
> | Microsoft.OperationsManagement/managementconfigurations/write | Create or update  management configuration. |
> | Microsoft.OperationsManagement/managementconfigurations/read | Get management configuration. |
> | Microsoft.OperationsManagement/managementconfigurations/delete | Delete management configuration. |
> | Microsoft.OperationsManagement/solutions/write | Create new OMS solution |
> | Microsoft.OperationsManagement/solutions/read | Get exiting OMS solution |
> | Microsoft.OperationsManagement/solutions/delete | Delete existing OMS solution |
