---
title: Tag support for resources
description: Shows which Azure resource types support tags. Provides details for all Azure services.
ms.topic: conceptual
ms.date: 07/22/2025
---

# Tag support for Azure resources

This article describes whether a resource type supports [tags](tag-resources.md). The column labeled **Supports tags** indicates whether the resource type has a property for the tag. The column labeled **Tag in cost report** indicates whether that resource type passes the tag to the cost report. You can view costs by tags in the [Cost Management cost analysis](../../cost-management-billing/costs/group-filter.md) and the [Azure billing invoice and daily usage data](../../cost-management-billing/manage/download-azure-invoice-daily-usage-date.md). To ensure that all the usage/cost records are tagged irrespective of whether the resource supports or emits tags, use [tag inheritance in Cost Management](../../cost-management-billing/costs/enable-tag-inheritance.md).


To get the same data as a file of comma-separated values, download [tag-support.csv](https://github.com/tfitzmac/resource-capabilities/blob/master/tag-support.csv).

## Microsoft.AAD

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | DomainServices | Yes | Yes |
> | DomainServices / oucontainer | No | No |
> | domainServices / unsuspend | No | No |

## Microsoft.AadCustomSecurityAttributesDiagnosticSettings

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | diagnosticSettings | No | No |
> | diagnosticSettingsCategories | No | No |

## microsoft.aadiam

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | diagnosticSettings | No | No |
> | diagnosticSettingsCategories | No | No |
> | tenants | Yes | Yes |

## Microsoft.Addons

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | supportProviders | No | No |

## Microsoft.ADHybridHealthService

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | aadsupportcases | No | No |
> | addsservices | No | No |
> | agents | No | No |
> | anonymousapiusers | No | No |
> | configuration | No | No |
> | logs | No | No |
> | reports | No | No |
> | servicehealthmetrics | No | No |
> | services | No | No |

## Microsoft.Advisor

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | advisorScore | No | No |
> | configurations | No | No |
> | generateRecommendations | No | No |
> | metadata | No | No |
> | predict | No | No |
> | recommendations | No | No |
> | suppressions | No | No |

> [!NOTE]
> All Microsoft.Advisor resources are free and therefore not included in the cost report.

## Microsoft.AgFoodPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | farmBeats | Yes | Yes |
> | farmBeats / dataConnectors | No | No |
> | farmBeats / eventGridFilters | No | No |
> | farmBeats / extensions | No | No |
> | farmBeats / solutions | No | No |
> | farmBeatsExtensionDefinitions | No | No |
> | farmBeatsSolutionDefinitions | No | No |

## Microsoft.AgriculturePlatform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | agriservices | Yes | Yes |

## Microsoft.AlertsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | actionRules | Yes | Yes |
> | alertRuleRecommendations | No | No |
> | alerts | No | No |
> | alerts / enrichments | No | No |
> | alertsMetaData | No | No |
> | issues | No | No |
> | migrateFromSmartDetection | No | No |
> | smartDetectorAlertRules | Yes | Yes |
> | smartGroups | No | No |
> | tenantActivityLogAlerts | No | No |

## Microsoft.AnalysisServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | servers | Yes | Yes |

## Microsoft.ApiCenter

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | deletedServices | No | No |
> | services | Yes | Yes |
> | services / eventGridFilters | No | No |

## Microsoft.ApiManagement

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | deletedServices | No | No |
> | gateways | Yes | Yes |
> | getDomainOwnershipIdentifier | No | No |
> | reportFeedback | No | No |
> | service | Yes | Yes |
> | service / eventGridFilters | No | No |
> | validateServiceName | No | No |

> [!NOTE]
> Azure API Management only supports creating a maximum of 15 tag name/value pairs for each service.

## Microsoft.App

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | agents | Yes | Yes |
> | appGroups | Yes | Yes |
> | builders | Yes | Yes |
> | builders / builds | No | No |
> | builders / patches | No | No |
> | connectedEnvironments | Yes | Yes |
> | connectedEnvironments / certificates | Yes | Yes |
> | containerApps | Yes | Yes |
> | containerApps / privateEndpointConnectionProxies | No | No |
> | containerApps / resiliencyPolicies | No | No |
> | functions | No | No |
> | getCustomDomainVerificationId | No | No |
> | jobs | Yes | Yes |
> | logicApps | No | No |
> | managedEnvironments | Yes | Yes |
> | managedEnvironments / certificates | Yes | Yes |
> | managedEnvironments / daprComponents | No | No |
> | managedEnvironments / daprComponents / resiliencyPolicies | No | No |
> | managedEnvironments / dotNetComponents | No | No |
> | managedEnvironments / javaComponents | No | No |
> | managedEnvironments / managedCertificates | Yes | Yes |
> | managedEnvironments / privateEndpointConnectionProxies | No | No |
> | sessionPools | Yes | Yes |
> | spaces | Yes | Yes |

## Microsoft.AppAssessment

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | migrateProjects | Yes | Yes |
> | migrateProjects / assessments | No | No |
> | migrateProjects / assessments / assessedApplications | No | No |
> | migrateProjects / assessments / assessedApplications / machines | No | No |
> | migrateProjects / assessments / assessedMachines | No | No |
> | migrateProjects / assessments / assessedMachines / applications | No | No |
> | migrateProjects / assessments / machinesToAssess | No | No |
> | migrateProjects / sites | No | No |
> | migrateProjects / sites / applianceConfigurations | No | No |
> | migrateProjects / sites / machines | No | No |

## Microsoft.AppConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | configurationStores | Yes | No |
> | configurationStores / eventGridFilters | No | No |
> | configurationStores / experimentation | No | No |
> | configurationStores / generateSasToken | No | No |
> | configurationStores / keyValues | No | No |
> | configurationStores / replicas | No | No |
> | configurationStores / resetSasKind | No | No |
> | configurationStores / snapshots | No | No |
> | deletedConfigurationStores | No | No |

## Microsoft.ApplicationMigration

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | discoveryHubs | Yes | Yes |
> | discoveryHubs / applications | No | No |
> | discoveryHubs / applications / members | No | No |
> | PGSQLSites | Yes | Yes |
> | PGSQLSites / agents | No | No |
> | PGSQLSites / PGSQLDatabases | No | No |
> | PGSQLSites / PGSQLInstances | No | No |

## Microsoft.AppPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | runtimeVersions | No | No |
> | Spring | Yes | Yes |
> | Spring / apps | No | No |
> | Spring / apps / deployments | No | No |
> | Spring / apps / domains | No | No |
> | Spring / configServers | No | No |
> | Spring / eurekaServers | No | No |

## Microsoft.Attestation

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | attestationProviders | Yes | Yes |
> | defaultProviders | No | No |

## Microsoft.Authorization

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accessReviewHistoryDefinitions | No | No |
> | acquirePolicyToken | No | No |
> | classicAdministrators | No | No |
> | dataAliases | No | No |
> | dataPolicyManifests | No | No |
> | denyAssignments | No | No |
> | diagnosticSettings | No | No |
> | diagnosticSettingsCategories | No | No |
> | elevateAccess | No | No |
> | eligibleChildResources | No | No |
> | EnablePrivateLinkNetworkAccess | No | No |
> | locks | No | No |
> | MigrateRbac | No | No |
> | policyAssignments | No | No |
> | policyDefinitions | No | No |
> | policyDefinitions / versions | No | No |
> | policyEnrollments | No | No |
> | policyExemptions | No | No |
> | policySetDefinitions | No | No |
> | policySetDefinitions / versions | No | No |
> | privateLinkAssociations | No | No |
> | resourceManagementPrivateLinks | Yes | Yes |
> | roleAssignmentApprovals | No | No |
> | roleAssignments | No | No |
> | roleAssignmentScheduleInstances | No | No |
> | roleAssignmentScheduleRequests | No | No |
> | roleAssignmentSchedules | No | No |
> | roleDefinitions | No | No |
> | roleEligibilityScheduleInstances | No | No |
> | roleEligibilityScheduleRequests | No | No |
> | roleEligibilitySchedules | No | No |
> | roleManagementAlertConfigurations | No | No |
> | roleManagementAlertDefinitions | No | No |
> | roleManagementAlerts | No | No |
> | roleManagementPolicies | No | No |
> | roleManagementPolicyAssignments | No | No |

## Microsoft.Automanage

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | bestPractices | No | No |
> | bestPractices / versions | No | No |
> | configurationProfileAssignments | No | No |
> | configurationProfiles | Yes | Yes |
> | configurationProfiles / versions | Yes | Yes |
> | patchJobConfigurations | Yes | Yes |
> | patchJobConfigurations / patchJobs | No | No |
> | patchSchedules | Yes | Yes |
> | patchSchedules / associations | Yes | Yes |
> | patchTiers | Yes | Yes |
> | servicePrincipals | No | No |

## Microsoft.Automation

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | automationAccounts | Yes | Yes |
> | automationAccounts / agentRegistrationInformation | No | No |
> | automationAccounts / configurations | Yes | Yes |
> | automationAccounts / hybridRunbookWorkerGroups | No | No |
> | automationAccounts / hybridRunbookWorkerGroups / hybridRunbookWorkers | No | No |
> | automationAccounts / jobs | No | No |
> | automationAccounts / privateEndpointConnectionProxies | No | No |
> | automationAccounts / privateEndpointConnections | No | No |
> | automationAccounts / privateLinkResources | No | No |
> | automationAccounts / runbooks | Yes | Yes |
> | automationAccounts / runtimes | Yes | Yes |
> | automationAccounts / softwareUpdateConfigurationMachineRuns | No | No |
> | automationAccounts / softwareUpdateConfigurationRuns | No | No |
> | automationAccounts / softwareUpdateConfigurations | No | No |
> | automationAccounts / webhooks | No | No |
> | deletedAutomationAccounts | No | No |

> [!NOTE]
> Azure Automation only supports creating a maximum of 15 tag name/value pairs for each Automation resource.

## Microsoft.AVS

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | privateClouds | Yes | Yes |
> | privateClouds / addons | No | No |
> | privateClouds / authorizations | No | No |
> | privateClouds / cloudLinks | No | No |
> | privateClouds / clusters | No | No |
> | privateClouds / clusters / datastores | No | No |
> | privateClouds / clusters / placementPolicies | No | No |
> | privateClouds / clusters / virtualMachines | No | No |
> | privateClouds / eventGridFilters | No | No |
> | privateClouds / globalReachConnections | No | No |
> | privateClouds / hcxEnterpriseSites | No | No |
> | privateClouds / iscsiPaths | No | No |
> | privateClouds / maintenances | No | No |
> | privateClouds / scriptExecutions | No | No |
> | privateClouds / scriptPackages | No | No |
> | privateClouds / scriptPackages / scriptCmdlets | No | No |
> | privateClouds / workloadNetworks | No | No |
> | privateClouds / workloadNetworks / dhcpConfigurations | No | No |
> | privateClouds / workloadNetworks / dnsServices | No | No |
> | privateClouds / workloadNetworks / dnsZones | No | No |
> | privateClouds / workloadNetworks / gateways | No | No |
> | privateClouds / workloadNetworks / portMirroringProfiles | No | No |
> | privateClouds / workloadNetworks / publicIPs | No | No |
> | privateClouds / workloadNetworks / segments | No | No |
> | privateClouds / workloadNetworks / virtualMachines | No | No |
> | privateClouds / workloadNetworks / vmGroups | No | No |

## Microsoft.AwsConnector

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accessAnalyzerAnalyzers | Yes | Yes |
> | acmCertificateSummaries | Yes | Yes |
> | apiGatewayRestApis | Yes | Yes |
> | apiGatewayStages | Yes | Yes |
> | applicationAutoScalingScalableTargets | Yes | Yes |
> | appSyncGraphQLApis | Yes | Yes |
> | autoScalingAutoScalingGroups | Yes | Yes |
> | cloudFormationStacks | Yes | Yes |
> | cloudFormationStackSets | Yes | Yes |
> | cloudFrontDistributions | Yes | Yes |
> | cloudTrailTrails | Yes | Yes |
> | cloudWatchAlarms | Yes | Yes |
> | codeBuildProjects | Yes | Yes |
> | codeBuildSourceCredentialsInfos | Yes | Yes |
> | configServiceConfigurationRecorders | Yes | Yes |
> | configServiceConfigurationRecorderStatuses | Yes | Yes |
> | configServiceDeliveryChannels | Yes | Yes |
> | databaseMigrationServiceReplicationInstances | Yes | Yes |
> | daxClusters | Yes | Yes |
> | dynamoDBContinuousBackupsDescriptions | Yes | Yes |
> | dynamoDBTables | Yes | Yes |
> | ec2AccountAttributes | Yes | Yes |
> | ec2Addresses | Yes | Yes |
> | ec2FlowLogs | Yes | Yes |
> | ec2Images | Yes | Yes |
> | ec2Instances | No | No |
> | ec2InstanceStatuses | Yes | Yes |
> | ec2Ipams | Yes | Yes |
> | ec2KeyPairs | Yes | Yes |
> | ec2NetworkAcls | Yes | Yes |
> | ec2NetworkInterfaces | Yes | Yes |
> | ec2RouteTables | Yes | Yes |
> | ec2SecurityGroups | Yes | Yes |
> | ec2Snapshots | Yes | Yes |
> | ec2Subnets | Yes | Yes |
> | ec2Volumes | Yes | Yes |
> | ec2VPCEndpoints | Yes | Yes |
> | ec2VPCPeeringConnections | Yes | Yes |
> | ec2VPCs | Yes | Yes |
> | ecrImageDetails | Yes | Yes |
> | ecrRepositories | Yes | Yes |
> | ecsClusters | Yes | Yes |
> | ecsServices | Yes | Yes |
> | ecsTaskDefinitions | Yes | Yes |
> | efsFileSystems | Yes | Yes |
> | efsMountTargets | Yes | Yes |
> | eksClusters | No | No |
> | eksNodegroups | Yes | Yes |
> | elasticBeanstalkApplications | Yes | Yes |
> | elasticBeanstalkConfigurationTemplates | Yes | Yes |
> | elasticBeanstalkEnvironments | Yes | Yes |
> | elasticLoadBalancingV2LoadBalancers | Yes | Yes |
> | elasticLoadBalancingV2TargetGroups | Yes | Yes |
> | elasticLoadBalancingV2TargetHealthDescriptions | Yes | Yes |
> | elasticsearchDomains | Yes | Yes |
> | emrClusters | Yes | Yes |
> | functionConfigurations | Yes | Yes |
> | guardDutyDetectors | Yes | Yes |
> | iamAccessKeyLastUseds | Yes | Yes |
> | iamAccessKeyMetaData | Yes | Yes |
> | iamGroups | Yes | Yes |
> | iamInstanceProfiles | Yes | Yes |
> | iamManagedPolicies | Yes | Yes |
> | iamMFADevices | Yes | Yes |
> | iamPasswordPolicies | Yes | Yes |
> | iamPolicyVersions | Yes | Yes |
> | iamRoles | Yes | Yes |
> | iamServerCertificates | Yes | Yes |
> | iamUserPolicies | Yes | Yes |
> | iamVirtualMFADevices | Yes | Yes |
> | kmsAliases | Yes | Yes |
> | kmsKeys | Yes | Yes |
> | lambdaEventInvokeConfigs | Yes | Yes |
> | lambdaFunctionConfigurations | Yes | Yes |
> | lambdaFunctions | Yes | Yes |
> | lambdaPermissions | Yes | Yes |
> | licenseManagerLicenses | Yes | Yes |
> | lightsailBuckets | Yes | Yes |
> | lightsailInstances | Yes | Yes |
> | logsLogGroups | Yes | Yes |
> | logsLogStreams | Yes | Yes |
> | logsMetricFilters | Yes | Yes |
> | logsSubscriptionFilters | Yes | Yes |
> | macie2JobSummaries | Yes | Yes |
> | networkFirewallFirewallPolicies | Yes | Yes |
> | networkFirewallFirewalls | Yes | Yes |
> | networkFirewallRuleGroups | Yes | Yes |
> | openSearchDomainStatuses | Yes | Yes |
> | openSearchServiceDomains | Yes | Yes |
> | organizationsAccounts | Yes | Yes |
> | organizationsOrganizations | Yes | Yes |
> | rdsDBClusters | Yes | Yes |
> | rdsDBInstances | Yes | Yes |
> | rdsDBSnapshots | Yes | Yes |
> | rdsEventSubscriptions | Yes | Yes |
> | rdsExportTasks | Yes | Yes |
> | redshiftClusterParameterGroups | Yes | Yes |
> | redshiftClusters | Yes | Yes |
> | route53DomainsDomainSummaries | Yes | Yes |
> | route53HostedZones | Yes | Yes |
> | route53ResourceRecordSets | Yes | Yes |
> | s3AccessControlPolicies | Yes | Yes |
> | s3AccessPoints | Yes | Yes |
> | s3BucketPolicies | Yes | Yes |
> | s3Buckets | Yes | Yes |
> | s3ControlMultiRegionAccessPointPolicyDocuments | Yes | Yes |
> | sageMakerApps | Yes | Yes |
> | sageMakerDevices | Yes | Yes |
> | sageMakerImages | Yes | Yes |
> | sageMakerNotebookInstanceSummaries | Yes | Yes |
> | secretsManagerResourcePolicies | Yes | Yes |
> | secretsManagerSecrets | Yes | Yes |
> | snsSubscriptions | Yes | Yes |
> | snsTopics | Yes | Yes |
> | sqsQueues | Yes | Yes |
> | ssmInstanceInformations | Yes | Yes |
> | ssmParameters | Yes | Yes |
> | ssmResourceComplianceSummaryItems | Yes | Yes |
> | wafv2IPSets | Yes | Yes |
> | wafv2LoggingConfigurations | Yes | Yes |
> | wafv2WebACLAssociations | Yes | Yes |
> | wafWebACLSummaries | Yes | Yes |

## Microsoft.AzureActiveDirectory

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | b2cDirectories | Yes | No |
> | b2ctenants | No | No |
> | ciamDirectories | Yes | Yes |
> | directories | No | No |
> | guestUsages | Yes | Yes |

## Microsoft.AzureArcData

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | DataControllers | Yes | Yes |
> | DataControllers / ActiveDirectoryConnectors | No | No |
> | PostgresInstances | Yes | Yes |
> | SqlManagedInstances | Yes | Yes |
> | SqlManagedInstances / FailoverGroups | No | No |
> | SqlServerEsuLicenses | Yes | Yes |
> | SqlServerInstances | Yes | Yes |
> | SqlServerInstances / AvailabilityGroups | Yes | Yes |
> | SqlServerInstances / Databases | Yes | Yes |
> | SqlServerLicenses | Yes | Yes |

## Microsoft.AzureDataTransfer

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | connections | Yes | Yes |
> | connections / flows | Yes | Yes |
> | pipelines | Yes | Yes |
> | validateSchema | No | No |

## Microsoft.AzureFleet

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | fleets | Yes | Yes |

## Microsoft.AzureImageTestingForLinux

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | jobs | Yes | Yes |
> | jobTemplates | Yes | Yes |

## Microsoft.AzureLargeInstance

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | azureLargeInstances | Yes | Yes |
> | azureLargeStorageInstances | Yes | Yes |

## Microsoft.AzurePlaywrightService

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / quotas | No | No |
> | registeredSubscriptions | No | No |

## Microsoft.AzureResilienceManagement

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | drills | No | No |
> | drills / drillResources | No | No |
> | GoalAssignments | No | No |
> | GoalAssignments / GoalResources | No | No |
> | GoalTemplates | No | No |
> | recoveryPlans | No | No |
> | recoveryPlans / recoveryResources | No | No |
> | UnifiedResiliencyItem | No | No |

## Microsoft.AzureScan

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | scanningAccounts | Yes | Yes |

## Microsoft.AzureSphere

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | catalogs | Yes | Yes |
> | catalogs / certificates | No | No |
> | catalogs / images | No | No |
> | catalogs / products | No | No |
> | catalogs / products / devicegroups | No | No |
> | catalogs / products / devicegroups / deployments | No | No |
> | catalogs / products / devicegroups / devices | No | No |

## Microsoft.AzureStack

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | cloudManifestFiles | No | No |
> | generateDeploymentLicense | No | No |
> | linkedSubscriptions | Yes | Yes |
> | registrations | Yes | Yes |
> | registrations / customerSubscriptions | No | No |
> | registrations / products | No | No |

## Microsoft.AzureStackHCI

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusters | Yes | Yes |
> | clusters / arcSettings | No | No |
> | clusters / arcSettings / extensions | No | No |
> | clusters / deploymentSettings | No | No |
> | clusters / jobs | No | No |
> | clusters / networkProfiles | No | No |
> | clusters / offers | No | No |
> | clusters / publishers | No | No |
> | clusters / publishers / offers | No | No |
> | clusters / securitySettings | No | No |
> | clusters / updates | No | No |
> | clusters / updates / updateRuns | No | No |
> | clusters / updateSummaries | No | No |
> | devicePools | Yes | Yes |
> | edgeDeviceMetaData | No | No |
> | edgeDevices | No | No |
> | edgeMachines | Yes | Yes |
> | edgeMachines / jobs | No | No |
> | edgeNodePools | Yes | Yes |
> | galleryImages | Yes | Yes |
> | logicalNetworks | Yes | Yes |
> | marketplaceGalleryImages | Yes | Yes |
> | networkInterfaces | Yes | Yes |
> | networkSecurityGroups | Yes | Yes |
> | networkSecurityGroups / securityRules | No | No |
> | registeredSubscriptions | No | No |
> | storageContainers | Yes | Yes |
> | virtualHardDisks | Yes | Yes |
> | virtualMachineInstances | No | No |
> | virtualmachines | Yes | Yes |
> | virtualmachines / extensions | Yes | Yes |
> | virtualmachines / hybrididentitymetadata | No | No |
> | virtualnetworks | Yes | Yes |

## Microsoft.AzureTerraform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | exportTerraform | No | No |

## Microsoft.BackupSolutions

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | VMwareApplications | Yes | Yes |

## Microsoft.BareMetal

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | bareMetalConnections | Yes | Yes |
> | bareMetalInventoryBase | No | No |
> | consoleConnections | Yes | Yes |
> | crayServers | Yes | Yes |
> | monitoringServers | Yes | Yes |
> | peeringSettings | Yes | Yes |
> | sdnApplianceInventory | No | No |
> | utilization | No | No |
> | vmWs | Yes | Yes |

## Microsoft.BareMetalInfrastructure

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | bareMetalInstances | Yes | Yes |
> | bareMetalStorageInstances | Yes | Yes |

## Microsoft.Batch

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | batchAccounts | Yes | Yes |
> | batchAccounts / certificates | No | No |
> | batchAccounts / detectors | No | No |
> | batchAccounts / pools | No | No |

## Microsoft.Billing

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | billingAccounts | No | No |
> | billingAccounts / addresses | No | No |
> | billingAccounts / agreements | No | No |
> | billingAccounts / alertPreferences | No | No |
> | billingAccounts / alerts | No | No |
> | billingAccounts / appliedReservationOrders | No | No |
> | billingAccounts / associatedTenants | No | No |
> | billingAccounts / billingPeriods | No | No |
> | billingAccounts / billingPermissions | No | No |
> | billingAccounts / billingProfiles | No | No |
> | billingAccounts / billingProfiles / alertPreferences | No | No |
> | billingAccounts / billingProfiles / alerts | No | No |
> | billingAccounts / billingProfiles / billingPeriods | No | No |
> | billingAccounts / billingProfiles / billingPermissions | No | No |
> | billingAccounts / billingProfiles / billingRequests | No | No |
> | billingAccounts / billingProfiles / billingRoleAssignments | No | No |
> | billingAccounts / billingProfiles / billingRoleDefinitions | No | No |
> | billingAccounts / billingProfiles / billingSubscriptions | No | No |
> | billingAccounts / billingProfiles / createBillingRoleAssignment | No | No |
> | billingAccounts / billingProfiles / customers | No | No |
> | billingAccounts / billingProfiles / customers / billingPermissions | No | No |
> | billingAccounts / billingProfiles / customers / billingRequests | No | No |
> | billingAccounts / billingProfiles / customers / billingRoleAssignments | No | No |
> | billingAccounts / billingProfiles / customers / billingRoleDefinitions | No | No |
> | billingAccounts / billingProfiles / customers / billingSubscriptions | No | No |
> | billingAccounts / billingProfiles / customers / policies | No | No |
> | billingAccounts / billingProfiles / customers / transactions | No | No |
> | billingAccounts / billingProfiles / departments | No | No |
> | billingAccounts / billingProfiles / departments / billingPeriods | No | No |
> | billingAccounts / billingProfiles / departments / billingPermissions | No | No |
> | billingAccounts / billingProfiles / departments / billingRoleAssignments | No | No |
> | billingAccounts / billingProfiles / departments / billingRoleDefinitions | No | No |
> | billingAccounts / billingProfiles / departments / billingSubscriptions | No | No |
> | billingAccounts / billingProfiles / departments / enrollmentAccounts | No | No |
> | billingAccounts / billingProfiles / departments / enrollmentAccounts / billingPeriods | No | No |
> | billingAccounts / billingProfiles / enrollmentAccounts | No | No |
> | billingAccounts / billingProfiles / enrollmentAccounts / billingPeriods | No | No |
> | billingAccounts / billingProfiles / enrollmentAccounts / billingPermissions | No | No |
> | billingAccounts / billingProfiles / enrollmentAccounts / billingSubscriptions | No | No |
> | billingAccounts / billingProfiles / instructions | No | No |
> | billingAccounts / billingProfiles / invoices | No | No |
> | billingAccounts / billingProfiles / invoices / pricesheet | No | No |
> | billingAccounts / billingProfiles / invoices / transactions | No | No |
> | billingAccounts / billingProfiles / invoiceSections | No | No |
> | billingAccounts / billingProfiles / invoiceSections / billingPermissions | No | No |
> | billingAccounts / billingProfiles / invoiceSections / billingRequests | No | No |
> | billingAccounts / billingProfiles / invoiceSections / billingRoleAssignments | No | No |
> | billingAccounts / billingProfiles / invoiceSections / billingRoleDefinitions | No | No |
> | billingAccounts / billingProfiles / invoiceSections / billingSubscriptions | No | No |
> | billingAccounts / billingProfiles / invoiceSections / createBillingRoleAssignment | No | No |
> | billingAccounts / billingProfiles / invoiceSections / initiateTransfer | No | No |
> | billingAccounts / billingProfiles / invoiceSections / products | No | No |
> | billingAccounts / billingProfiles / invoiceSections / products / transfer | No | No |
> | billingAccounts / billingProfiles / invoiceSections / products / updateAutoRenew | No | No |
> | billingAccounts / billingProfiles / invoiceSections / transactions | No | No |
> | billingAccounts / billingProfiles / invoiceSections / transfers | No | No |
> | billingAccounts / billingProfiles / invoiceSections / validateDeleteInvoiceSectionEligibility | No | No |
> | billingAccounts / billingProfiles / notificationContacts | No | No |
> | billingAccounts / billingProfiles / paymentMethodLinks | No | No |
> | billingAccounts / billingProfiles / paymentMethods | No | No |
> | billingAccounts / billingProfiles / policies | No | No |
> | billingAccounts / billingProfiles / pricesheet | No | No |
> | billingAccounts / billingProfiles / products | No | No |
> | billingAccounts / billingProfiles / reservations | No | No |
> | billingAccounts / billingProfiles / transactions | No | No |
> | billingAccounts / billingProfiles / validateDeleteBillingProfileEligibility | No | No |
> | billingAccounts / billingProfiles / validateDetachPaymentMethodEligibility | No | No |
> | billingAccounts / billingProfilesSummaries | No | No |
> | billingAccounts / billingRequests | No | No |
> | billingAccounts / billingRoleAssignments | No | No |
> | billingAccounts / billingRoleDefinitions | No | No |
> | billingAccounts / billingSubscriptionAliases | No | No |
> | billingAccounts / billingSubscriptions | No | No |
> | billingAccounts / billingSubscriptions / elevateRole | No | No |
> | billingAccounts / billingSubscriptions / invoices | No | No |
> | billingAccounts / billingSubscriptions / policies | No | No |
> | billingAccounts / createBillingRoleAssignment | No | No |
> | billingAccounts / customers | No | No |
> | billingAccounts / customers / billingPermissions | No | No |
> | billingAccounts / customers / billingRoleAssignments | No | No |
> | billingAccounts / customers / billingRoleDefinitions | No | No |
> | billingAccounts / customers / billingSubscriptions | No | No |
> | billingAccounts / customers / createBillingRoleAssignment | No | No |
> | billingAccounts / customers / initiateTransfer | No | No |
> | billingAccounts / customers / policies | No | No |
> | billingAccounts / customers / products | No | No |
> | billingAccounts / customers / transactions | No | No |
> | billingAccounts / customers / transfers | No | No |
> | billingAccounts / customers / transferSupportedAccounts | No | No |
> | billingAccounts / departments | No | No |
> | billingAccounts / departments / billingPeriods | No | No |
> | billingAccounts / departments / billingPermissions | No | No |
> | billingAccounts / departments / billingRoleAssignments | No | No |
> | billingAccounts / departments / billingRoleDefinitions | No | No |
> | billingAccounts / departments / billingSubscriptions | No | No |
> | billingAccounts / departments / enrollmentAccounts | No | No |
> | billingAccounts / departments / enrollmentAccounts / billingPeriods | No | No |
> | billingAccounts / enrollmentAccounts | No | No |
> | billingAccounts / enrollmentAccounts / activationStatus | No | No |
> | billingAccounts / enrollmentAccounts / billingPeriods | No | No |
> | billingAccounts / enrollmentAccounts / billingPermissions | No | No |
> | billingAccounts / enrollmentAccounts / billingRoleAssignments | No | No |
> | billingAccounts / enrollmentAccounts / billingRoleDefinitions | No | No |
> | billingAccounts / enrollmentAccounts / billingSubscriptions | No | No |
> | billingAccounts / incentiveSchedules | No | No |
> | billingAccounts / incentiveSchedules / milestones | No | No |
> | billingAccounts / invoices | No | No |
> | billingAccounts / invoices / summary | No | No |
> | billingAccounts / invoices / transactions | No | No |
> | billingAccounts / invoices / transactionSummary | No | No |
> | billingAccounts / invoiceSections | No | No |
> | billingAccounts / invoiceSections / billingSubscriptions | No | No |
> | billingAccounts / invoiceSections / billingSubscriptions / transfer | No | No |
> | billingAccounts / invoiceSections / elevate | No | No |
> | billingAccounts / invoiceSections / initiateTransfer | No | No |
> | billingAccounts / invoiceSections / products | No | No |
> | billingAccounts / invoiceSections / products / transfer | No | No |
> | billingAccounts / invoiceSections / products / updateAutoRenew | No | No |
> | billingAccounts / invoiceSections / transactions | No | No |
> | billingAccounts / invoiceSections / transfers | No | No |
> | billingAccounts / licenseReservations | No | No |
> | billingAccounts / lineOfCredit | No | No |
> | billingAccounts / migrations | No | No |
> | billingAccounts / notificationContacts | No | No |
> | billingAccounts / partnerOrganizations | No | No |
> | billingAccounts / payableOverage | No | No |
> | billingAccounts / paymentMethodLinks | No | No |
> | billingAccounts / paymentMethods | No | No |
> | billingAccounts / payNow | No | No |
> | billingAccounts / permissionRequests | No | No |
> | billingAccounts / policies | No | No |
> | billingAccounts / previewAgreements | No | No |
> | billingAccounts / products | No | No |
> | billingAccounts / promotionalCredits | No | No |
> | billingAccounts / reservationOrders | No | No |
> | billingAccounts / reservationOrders / reservations | No | No |
> | billingAccounts / reservations | No | No |
> | billingAccounts / savingsPlanOrders | No | No |
> | billingAccounts / savingsPlanOrders / savingsPlans | No | No |
> | billingAccounts / savingsPlans | No | No |
> | billingAccounts / signAgreement | No | No |
> | billingAccounts / transactions | No | No |
> | billingPeriods | No | No |
> | billingPermissions | No | No |
> | billingProperty | No | No |
> | billingRequests | No | No |
> | billingRoleAssignments | No | No |
> | billingRoleDefinitions | No | No |
> | createBillingRoleAssignment | No | No |
> | departments | No | No |
> | enrollmentAccounts | No | No |
> | invoices | No | No |
> | paymentMethods | No | No |
> | permissionRequests | No | No |
> | policies | No | No |
> | promotionalCredits | No | No |
> | promotions | No | No |
> | transfers | No | No |
> | transfers / acceptTransfer | No | No |
> | transfers / declineTransfer | No | No |
> | transfers / validateTransfer | No | No |
> | validateAddress | No | No |

## Microsoft.BillingBenefits

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applicableCredits | No | No |
> | applicableDiscounts | No | No |
> | calculateMigrationCost | No | No |
> | credits | Yes | Yes |
> | credits / sources | Yes | Yes |
> | discounts | Yes | Yes |
> | incentiveSchedules | Yes | Yes |
> | incentiveSchedules / milestones | No | No |
> | maccs | Yes | Yes |
> | maccs / contributors | No | No |
> | reservationOrderAliases | No | No |
> | savingsPlanOrderAliases | No | No |
> | savingsPlanOrders | No | No |
> | savingsPlanOrders / return | No | No |
> | savingsPlanOrders / savingsPlans | No | No |
> | savingsPlans | No | No |
> | validate | No | No |

## Microsoft.Bing

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / customSearchConfigurations | No | No |
> | accounts / usages | No | No |
> | registeredSubscriptions | No | No |

## Microsoft.BlockchainTokens

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | TokenServices | Yes | Yes |
> | TokenServices / BlockchainNetworks | No | No |
> | TokenServices / Groups | No | No |
> | TokenServices / Groups / Accounts | No | No |
> | TokenServices / TokenTemplates | No | No |

## Microsoft.Blueprint

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | blueprintAssignments | No | No |
> | blueprints | No | No |
> | blueprints / artifacts | No | No |
> | blueprints / versions | No | No |
> | blueprints / versions / artifacts | No | No |

## Microsoft.BotService

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | botServices | Yes | Yes |
> | botServices / channels | No | No |
> | botServices / connections | No | No |
> | botServices / privateEndpointConnectionProxies | No | No |
> | botServices / privateEndpointConnections | No | No |
> | botServices / privateLinkResources | No | No |
> | hostSettings | No | No |
> | languages | No | No |
> | templates | No | No |

## Microsoft.Capacity

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | appliedReservations | No | No |
> | autoQuotaIncrease | No | No |
> | calculateExchange | No | No |
> | calculatePrice | No | No |
> | calculatePurchasePrice | No | No |
> | catalogs | No | No |
> | commercialReservationOrders | No | No |
> | exchange | No | No |
> | getVMFamiliesEnrollmentStateForAQM | No | No |
> | ownReservations | No | No |
> | placePurchaseOrder | No | No |
> | reservationOrders | No | No |
> | reservationOrders / calculateRefund | No | No |
> | reservationOrders / changeDirectory | No | No |
> | reservationOrders / merge | No | No |
> | reservationOrders / reservations | No | No |
> | reservationOrders / reservations / revisions | No | No |
> | reservationOrders / return | No | No |
> | reservationOrders / split | No | No |
> | reservationOrders / swap | No | No |
> | reservations | No | No |
> | resourceProviders | No | No |
> | resources | No | No |
> | updateVMFamiliesEnrollmentStateForAQM | No | No |
> | validateReservationOrder | No | No |

## Microsoft.Carbon

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | carbonEmissionReports | No | No |

## Microsoft.Cdn

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | canMigrate | No | No |
> | CdnWebApplicationFirewallManagedRuleSets | No | No |
> | CdnWebApplicationFirewallPolicies | Yes | Yes |
> | edgenodes | No | No |
> | migrate | No | No |
> | profiles | Yes | Yes |
> | profiles / afdendpoints | Yes | Yes |
> | profiles / afdendpoints / routes | No | No |
> | profiles / authpolicies | No | No |
> | profiles / customdomains | No | No |
> | profiles / deploymentversions | No | No |
> | profiles / edgeextensiongroups | No | No |
> | profiles / endpoints | Yes | Yes |
> | profiles / endpoints / customdomains | No | No |
> | profiles / endpoints / origingroups | No | No |
> | profiles / endpoints / origins | No | No |
> | profiles / keygroups | No | No |
> | profiles / networkpolicies | No | No |
> | profiles / origingroups | No | No |
> | profiles / origingroups / origins | No | No |
> | profiles / policies | No | No |
> | profiles / rulesets | No | No |
> | profiles / rulesets / rules | No | No |
> | profiles / secrets | No | No |
> | profiles / securitypolicies | No | No |
> | profiles / targetgroups | No | No |
> | profiles / tunnelpolicies | No | No |
> | validateProbe | No | No |
> | validateSecret | No | No |

## Microsoft.CertificateRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | certificateOrders | Yes | Yes |
> | certificateOrders / certificates | No | No |
> | validateCertificateRegistrationInformation | No | No |

## Microsoft.ChangeAnalysis

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | changes | No | No |
> | changeSnapshots | No | No |
> | computeChanges | No | No |
> | profile | No | No |

## Microsoft.ChangeSafety

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | changestates | No | No |
> | changestates / stageprogressions | No | No |
> | saferollouts | No | No |
> | saferollouts / stages | No | No |
> | stagemaps | No | No |
> | validations | No | No |
> | validators | No | No |
> | validators / versions | No | No |

## Microsoft.Chaos

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applications | Yes | Yes |
> | experiments | Yes | Yes |
> | privateAccesses | Yes | Yes |
> | resilienceProfiles | Yes | Yes |
> | targets | No | No |
> | validationCoordinators | Yes | Yes |

## Microsoft.ClassicCompute

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | capabilities | No | No |
> | domainNames | No | No |
> | domainNames / capabilities | No | No |
> | domainNames / internalLoadBalancers | No | No |
> | domainNames / serviceCertificates | No | No |
> | domainNames / slots | No | No |
> | domainNames / slots / roles | No | No |
> | domainNames / slots / roles / metricDefinitions | No | No |
> | domainNames / slots / roles / metrics | No | No |
> | moveSubscriptionResources | No | No |
> | operatingSystemFamilies | No | No |
> | operatingSystems | No | No |
> | quotas | No | No |
> | resourceTypes | No | No |
> | validateSubscriptionMoveAvailability | No | No |
> | virtualMachines | No | No |
> | virtualMachines / diagnosticSettings | No | No |
> | virtualMachines / metricDefinitions | No | No |
> | virtualMachines / metrics | No | No |

## Microsoft.ClassicInfrastructureMigrate

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | classicInfrastructureResources | No | No |

## Microsoft.ClassicNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | capabilities | No | No |
> | expressRouteCrossConnections | No | No |
> | expressRouteCrossConnections / peerings | No | No |
> | gatewaySupportedDevices | No | No |
> | networkSecurityGroups | No | No |
> | quotas | No | No |
> | reservedIps | No | No |
> | virtualNetworks | No | No |
> | virtualNetworks / remoteVirtualNetworkPeeringProxies | No | No |
> | virtualNetworks / virtualNetworkPeerings | No | No |

## Microsoft.ClassicStorage

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | capabilities | No | No |
> | disks | No | No |
> | images | No | No |
> | osImages | No | No |
> | osPlatformImages | No | No |
> | publicImages | No | No |
> | quotas | No | No |
> | storageAccounts | No | No |
> | storageAccounts / blobServices | No | No |
> | storageAccounts / fileServices | No | No |
> | storageAccounts / metricDefinitions | No | No |
> | storageAccounts / metrics | No | No |
> | storageAccounts / queueServices | No | No |
> | storageAccounts / services | No | No |
> | storageAccounts / services / diagnosticSettings | No | No |
> | storageAccounts / services / metricDefinitions | No | No |
> | storageAccounts / services / metrics | No | No |
> | storageAccounts / tableServices | No | No |
> | storageAccounts / vmImages | No | No |
> | vmImages | No | No |

## Microsoft.CleanRoom

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | CleanRooms | Yes | Yes |
> | Collaborations | Yes | Yes |
> | Collaborations / Contracts | No | No |
> | Consortiums | Yes | Yes |
> | MicroServices | Yes | Yes |

## Microsoft.CloudDevicePlatform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | delegatedIdentities | Yes | Yes |
> | delegatedidentity | Yes | Yes |

## Microsoft.CloudHealth

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | healthmodels | Yes | Yes |
> | healthmodels / authenticationsettings | No | No |
> | healthmodels / discoveryrules | No | No |
> | healthmodels / entities | No | No |
> | healthmodels / relationships | No | No |
> | healthmodels / signaldefinitions | No | No |

## Microsoft.CloudTest

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | buildcaches | Yes | Yes |
> | hostedpools | Yes | Yes |
> | images | Yes | Yes |
> | pools | Yes | Yes |

## Microsoft.CodeSigning

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | codeSigningAccounts | Yes | Yes |
> | codeSigningAccounts / certificateProfiles | No | No |

## Microsoft.CognitiveServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / capabilityhosts | No | No |
> | accounts / connections | No | No |
> | accounts / encryptionScopes | No | No |
> | accounts / networkSecurityPerimeterAssociationProxies | No | No |
> | accounts / privateEndpointConnectionProxies | No | No |
> | accounts / privateEndpointConnections | No | No |
> | accounts / privateLinkResources | No | No |
> | accounts / projects | Yes | Yes |
> | accounts / projects / capabilityhosts | No | No |
> | accounts / projects / connections | No | No |
> | attestationDefinitions | No | No |
> | attestations | No | No |
> | calculateModelCapacity | No | No |
> | commitmentPlans | Yes | Yes |
> | deletedAccounts | No | No |
> | modelCapacities | No | No |

## Microsoft.Commerce

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | RateCard | No | No |
> | UsageAggregates | No | No |

## Microsoft.Communication

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | CommunicationServices | Yes | Yes |
> | CommunicationServices / eventGridFilters | No | No |
> | CommunicationServices / networkSecurityPerimeterConfigurations | No | No |
> | CommunicationServices / SmtpUsernames | No | No |
> | EmailServices | Yes | Yes |
> | EmailServices / Domains | Yes | Yes |
> | EmailServices / Domains / SenderUsernames | No | No |
> | registeredSubscriptions | No | No |

## Microsoft.Community

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | communityTrainings | Yes | Yes |

## Microsoft.Compute

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | availabilitySets | Yes | Yes |
> | capacityBlocks | No | No |
> | capacityReservationGroups | Yes | Yes |
> | capacityReservationGroups / capacityReservations | Yes | Yes |
> | cloudServices | Yes | Yes |
> | cloudServices / networkInterfaces | No | No |
> | cloudServices / publicIPAddresses | No | No |
> | cloudServices / roleInstances | No | No |
> | cloudServices / roleInstances / networkInterfaces | No | No |
> | cloudServices / roles | No | No |
> | diskAccesses | Yes | Yes |
> | diskEncryptionSets | Yes | Yes |
> | disks | Yes | Yes |
> | galleries | Yes | Yes |
> | galleries / applications | Yes | No |
> | galleries / applications / versions | Yes | No |
> | galleries / images | Yes | No |
> | galleries / images / versions | Yes | No |
> | galleries / inVMAccessControlProfiles | Yes | Yes |
> | galleries / inVMAccessControlProfiles / versions | Yes | Yes |
> | galleries / remoteContainerImages | Yes | Yes |
> | galleries / serviceArtifacts | Yes | Yes |
> | hostGroups | Yes | Yes |
> | hostGroups / hosts | Yes | Yes |
> | images | Yes | Yes |
> | payloadGroups | No | No |
> | proximityPlacementGroups | Yes | Yes |
> | restorePointCollections | Yes | No |
> | restorePointCollections / restorePoints | No | No |
> | restorePointCollections / restorePoints / diskRestorePoints | No | No |
> | sharedVMExtensions | Yes | Yes |
> | sharedVMExtensions / versions | Yes | Yes |
> | sharedVMImages | Yes | Yes |
> | sharedVMImages / versions | Yes | Yes |
> | snapshots | Yes | Yes |
> | sshPublicKeys | Yes | Yes |
> | virtualMachines | Yes | Yes |
> | virtualMachines / extensions | Yes | Yes |
> | virtualMachines / metricDefinitions | No | No |
> | virtualMachines / runCommands | Yes | Yes |
> | virtualMachines / VMApplications | Yes | Yes |
> | virtualMachineScaleSets | Yes | Yes |
> | virtualMachineScaleSets / applications | No | No |
> | virtualMachineScaleSets / disks | No | No |
> | virtualMachineScaleSets / extensions | No | No |
> | virtualMachineScaleSets / networkInterfaces | No | No |
> | virtualMachineScaleSets / publicIPAddresses | No | No |
> | virtualMachineScaleSets / virtualMachines | No | No |
> | virtualMachineScaleSets / virtualMachines / extensions | No | No |
> | virtualMachineScaleSets / virtualMachines / networkInterfaces | No | No |

> [!NOTE]
> You can't add a tag to a virtual machine that has been marked as generalized. You mark a virtual machine as generalized with [Set-AzVm -Generalized](/powershell/module/Az.Compute/Set-AzVM) or [az vm generalize](/cli/azure/vm#az-vm-generalize).


## Microsoft.ComputeSchedule

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | associatedOccurrences | No | No |
> | associatedScheduledActions | No | No |
> | autoaction | Yes | Yes |
> | autoaction / occurrence | No | No |
> | autoActionResources | No | No |
> | autoActions | Yes | Yes |
> | autoActions / occurrences | No | No |
> | location | No | No |
> | scheduledActionResources | No | No |
> | scheduledActions | Yes | Yes |
> | scheduledActions / occurrences | No | No |
> | scheduledActions / occurrences / resources | No | No |
> | scheduledActions / resources | No | No |

## Microsoft.ConfidentialLedger

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | Ledgers | Yes | Yes |
> | ManagedCCFs | Yes | Yes |

## Microsoft.Confluent

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | agreements | No | No |
> | organizations | Yes | Yes |
> | organizations / access | No | No |
> | organizations / access / deleteRoleBinding | No | No |
> | organizations / apiKeys | No | No |
> | organizations / environments | No | No |
> | organizations / environments / clusters | No | No |
> | organizations / environments / clusters / connectors | No | No |
> | organizations / environments / clusters / createAPIKey | No | No |
> | organizations / environments / clusters / topics | No | No |
> | organizations / environments / schemaRegistryClusters | No | No |
> | validations | No | No |

## Microsoft.ConnectedCache

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | cacheNodes | Yes | Yes |
> | enterpriseCustomers | Yes | Yes |
> | enterpriseMccCustomers | Yes | Yes |
> | enterpriseMccCustomers / enterpriseMccCacheNodes | Yes | Yes |
> | ispCustomers | Yes | Yes |
> | ispCustomers / ispCacheNodes | Yes | Yes |
> | registeredSubscriptions | No | No |

## Microsoft.ConnectedCredentials

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | credentials | Yes | Yes |

## microsoft.connectedopenstack

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | flavors | Yes | Yes |
> | heatStacks | Yes | Yes |
> | heatStackTemplates | Yes | Yes |
> | images | Yes | Yes |
> | keypairs | Yes | Yes |
> | networkPorts | Yes | Yes |
> | networks | Yes | Yes |
> | openStackIdentities | Yes | Yes |
> | securityGroupRules | Yes | Yes |
> | securityGroups | Yes | Yes |
> | subnets | Yes | Yes |
> | virtualMachines | Yes | Yes |
> | volumes | Yes | Yes |
> | volumeSnapshots | Yes | Yes |
> | volumeTypes | Yes | Yes |

## Microsoft.ConnectedVehicle

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | platformAccounts | Yes | Yes |
> | registeredSubscriptions | No | No |

## Microsoft.ConnectedVMwarevSphere

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusters | Yes | Yes |
> | datastores | Yes | Yes |
> | hosts | Yes | Yes |
> | resourcepools | Yes | Yes |
> | VCenters | Yes | Yes |
> | vcenters / inventoryitems | No | No |
> | virtualmachineinstances | No | No |
> | virtualmachines | Yes | Yes |
> | VirtualMachines / AssessPatches | No | No |
> | virtualmachines / extensions | Yes | Yes |
> | virtualmachines / guestagents | No | No |
> | virtualmachines / hybrididentitymetadata | No | No |
> | VirtualMachines / InstallPatches | No | No |
> | virtualmachines / upgradeextensions | No | No |
> | virtualmachinetemplates | Yes | Yes |
> | virtualnetworks | Yes | Yes |

## Microsoft.Consumption

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | AggregatedCost | No | No |
> | Balances | No | No |
> | Budgets | No | No |
> | Charges | No | No |
> | CostTags | No | No |
> | credits | No | No |
> | events | No | No |
> | Forecasts | No | No |
> | lots | No | No |
> | Marketplaces | No | No |
> | Pricesheets | No | No |
> | products | No | No |
> | ReservationDetails | No | No |
> | ReservationRecommendationDetails | No | No |
> | ReservationRecommendations | No | No |
> | ReservationSummaries | No | No |
> | ReservationTransactions | No | No |

## Microsoft.ContainerInstance

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | containerGroupProfiles | Yes | Yes |
> | containerGroups | Yes | Yes |
> | containerScaleSets | Yes | Yes |
> | nGroups | Yes | Yes |
> | serviceAssociationLinks | No | No |

## Microsoft.ContainerRegistry

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | registries | Yes | Yes |
> | registries / agentPools | Yes | Yes |
> | registries / cacheRules | No | No |
> | registries / connectedRegistries | No | No |
> | registries / connectedRegistries / deactivate | No | No |
> | registries / credentialSets | No | No |
> | registries / eventGridFilters | No | No |
> | registries / exportPipelines | No | No |
> | registries / generateCredentials | No | No |
> | registries / GetCredentials | No | No |
> | registries / importImage | No | No |
> | registries / importPipelines | No | No |
> | registries / packages | No | No |
> | registries / packages / archives | No | No |
> | registries / pipelineRuns | No | No |
> | registries / privateEndpointConnectionProxies | No | No |
> | registries / privateEndpointConnectionProxies / validate | No | No |
> | registries / privateEndpointConnections | No | No |
> | registries / privateLinkResources | No | No |
> | registries / regenerateCredential | No | No |
> | registries / regenerateCredentials | No | No |
> | registries / replications | Yes | Yes |
> | registries / runs | No | No |
> | registries / runs / cancel | No | No |
> | registries / scheduleRun | No | No |
> | registries / scopeMaps | No | No |
> | registries / taskRuns | No | No |
> | registries / tasks | Yes | Yes |
> | registries / tokens | No | No |
> | registries / updatePolicies | No | No |
> | registries / webhooks | Yes | Yes |
> | registries / webhooks / getCallbackConfig | No | No |
> | registries / webhooks / ping | No | No |

## Microsoft.ContainerService

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | deploymentSafeguards | No | No |
> | fleetMemberships | No | No |
> | fleets | Yes | Yes |
> | fleets / autoUpgradeProfiles | No | No |
> | fleets / gates | No | No |
> | fleets / members | No | No |
> | fleets / updateRuns | No | No |
> | fleets / updateStrategies | No | No |
> | managedClusters | Yes | Yes |
> | ManagedClusters / eventGridFilters | No | No |
> | managedClusters / identityBindings | No | No |
> | managedClusters / managedNamespaces | Yes | Yes |
> | managedclustersnapshots | Yes | Yes |
> | snapshots | Yes | Yes |

## Microsoft.CostManagement

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | Alerts | No | No |
> | BenefitRecommendations | No | No |
> | BenefitUtilizationSummaries | No | No |
> | BillingAccounts | No | No |
> | Budgets | No | No |
> | CalculateCost | No | No |
> | Departments | No | No |
> | Dimensions | No | No |
> | EnrollmentAccounts | No | No |
> | Exports | No | No |
> | fetchMarketplacePrices | No | No |
> | fetchPrices | No | No |
> | Forecast | No | No |
> | GenerateBenefitUtilizationSummariesReport | No | No |
> | GenerateCostDetailsReport | No | No |
> | GenerateDetailedCostReport | No | No |
> | Insights | No | No |
> | MarkupRules | No | No |
> | Pricesheets | No | No |
> | Publish | No | No |
> | Query | No | No |
> | Reportconfigs | No | No |
> | Reports | No | No |
> | ScheduledActions | No | No |
> | SendMessage | No | No |
> | Settings | No | No |
> | StartConversation | No | No |
> | Views | No | No |

## Microsoft.CustomerLockbox

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | DisableLockbox | No | No |
> | EnableLockbox | No | No |
> | requests | No | No |
> | TenantOptedIn | No | No |

## Microsoft.CustomProviders

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | associations | No | No |
> | resourceProviders | Yes | Yes |

## Microsoft.D365CustomerInsights

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | instances | Yes | Yes |

## Microsoft.Dashboard

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | dashboards | Yes | Yes |
> | grafana | Yes | Yes |
> | grafana / integrationFabrics | Yes | Yes |
> | grafana / managedPrivateEndpoints | Yes | Yes |
> | grafana / privateEndpointConnections | No | No |
> | grafana / privateLinkResources | No | No |

## Microsoft.DatabaseFleetManager

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | fleets | Yes | Yes |
> | fleets / authorizedPrincipals | No | No |
> | fleets / firewallRules | No | No |
> | fleets / fleetspaces | No | No |
> | fleets / fleetspaces / authorizedPrincipals | No | No |
> | fleets / fleetspaces / databases | No | No |
> | fleets / fleetspaces / firewallRules | No | No |
> | fleets / tiers | No | No |

## Microsoft.DatabaseWatcher

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | watchers | Yes | Yes |
> | watchers / alertRuleResources | No | No |
> | watchers / healthValidations | No | No |
> | watchers / sharedPrivateLinkResources | No | No |
> | watchers / targets | No | No |

## Microsoft.DataBox

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | jobs | Yes | Yes |
> | jobs / eventGridFilters | No | No |

## Microsoft.DataBoxEdge

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | DataBoxEdgeDevices | Yes | Yes |

## Microsoft.Databricks

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accessConnectors | Yes | Yes |
> | workspaces | Yes | Yes |
> | workspaces / dbWorkspaces | No | No |
> | workspaces / virtualNetworkPeerings | No | No |

## Microsoft.Datadog

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | agreements | No | No |
> | monitoredSubscriptions | No | No |
> | monitors | Yes | Yes |
> | monitors / getDefaultKey | No | No |
> | monitors / monitoredSubscriptions | No | No |
> | monitors / refreshSetPasswordLink | No | No |
> | monitors / setDefaultKey | No | No |
> | monitors / singleSignOnConfigurations | No | No |
> | monitors / tagRules | No | No |
> | registeredSubscriptions | No | No |
> | subscriptionStatuses | No | No |

## Microsoft.DataFactory

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | factories | Yes | Yes |
> | factories / integrationRuntimes | No | No |
> | factories / pipelines | No | No |
> | factories / privateEndpointConnectionProxies | No | No |

> [!NOTE]
> If you have Azure-SSIS integration runtimes in your data factory, their running cost will be tagged with data factory tags. Running Azure-SSIS integration runtimes must be stopped and restarted for new data factory tags to be applied to their running cost.

## Microsoft.DataLakeAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / dataLakeStoreAccounts | No | No |
> | accounts / storageAccounts | No | No |
> | accounts / storageAccounts / containers | No | No |
> | accounts / transferAnalyticsUnits | No | No |
> | accounts / transferEcoAnalyticsUnits | No | No |

## Microsoft.DataLakeStore

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / eventGridFilters | No | No |
> | accounts / firewallRules | No | No |

## Microsoft.DataMigration

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | DatabaseMigrations | No | No |
> | migrationServices | Yes | Yes |
> | services | Yes | Yes |
> | services / projects | Yes | Yes |
> | slots | Yes | Yes |
> | SqlMigrationServices | Yes | Yes |

## Microsoft.DataProtection

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | backupInstances | No | No |
> | BackupVaults | Yes | Yes |
> | ResourceGuards | Yes | Yes |

## Microsoft.DataReplication

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | replicationFabrics | Yes | Yes |
> | replicationVaults | Yes | Yes |

## Microsoft.DataShare

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / shares | No | No |
> | accounts / shares / datasets | No | No |
> | accounts / shares / invitations | No | No |
> | accounts / shares / providersharesubscriptions | No | No |
> | accounts / shares / synchronizationSettings | No | No |
> | accounts / sharesubscriptions | No | No |
> | accounts / sharesubscriptions / consumerSourceDataSets | No | No |
> | accounts / sharesubscriptions / datasetmappings | No | No |
> | accounts / sharesubscriptions / triggers | No | No |

## Microsoft.DBforMariaDB

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | servers | Yes | Yes |
> | servers / advisors | No | No |
> | servers / keys | No | No |
> | servers / privateEndpointConnectionProxies | No | No |
> | servers / privateEndpointConnections | No | No |
> | servers / privateLinkResources | No | No |
> | servers / queryTexts | No | No |
> | servers / recoverableServers | No | No |
> | servers / resetQueryPerformanceInsightData | No | No |
> | servers / topQueryStatistics | No | No |
> | servers / virtualNetworkRules | No | No |
> | servers / waitStatistics | No | No |

## Microsoft.DBforMySQL

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | assessForMigration | No | No |
> | flexibleServers | Yes | Yes |
> | getPrivateDnsZoneSuffix | No | No |
> | servers | Yes | Yes |
> | servers / advisors | No | No |
> | servers / keys | No | No |
> | servers / privateEndpointConnectionProxies | No | No |
> | servers / privateEndpointConnections | No | No |
> | servers / privateLinkResources | No | No |
> | servers / queryTexts | No | No |
> | servers / recoverableServers | No | No |
> | servers / resetQueryPerformanceInsightData | No | No |
> | servers / topQueryStatistics | No | No |
> | servers / virtualNetworkRules | No | No |
> | servers / waitStatistics | No | No |

## Microsoft.DBforPostgreSQL

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | flexibleServers | Yes | Yes |
> | flexibleServers / migrations | No | No |
> | getPrivateDnsZoneSuffix | No | No |
> | serverGroupsv2 | Yes | Yes |
> | servers | Yes | Yes |
> | servers / advisors | No | No |
> | servers / keys | No | No |
> | servers / privateEndpointConnectionProxies | No | No |
> | servers / privateEndpointConnections | No | No |
> | servers / privateLinkResources | No | No |
> | servers / queryTexts | No | No |
> | servers / recoverableServers | No | No |
> | servers / resetQueryPerformanceInsightData | No | No |
> | servers / topQueryStatistics | No | No |
> | servers / virtualNetworkRules | No | No |
> | servers / waitStatistics | No | No |

## Microsoft.DependencyMap

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | maps | Yes | Yes |
> | maps / discoverySources | Yes | Yes |

## Microsoft.DesktopVirtualization

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | appattachpackages | Yes | Yes |
> | applicationgroups | Yes | Yes |
> | applicationgroups / applications | No | No |
> | applicationgroups / desktops | No | No |
> | applicationgroups / startmenuitems | No | No |
> | connectionpolicies | Yes | Yes |
> | hostpools | Yes | Yes |
> | hostpools / msixpackages | No | No |
> | hostpools / sessionhosts | No | No |
> | hostpools / sessionhosts / usersessions | No | No |
> | hostpools / usersessions | No | No |
> | repositoryFolders | Yes | Yes |
> | repositoryFolders / repositoryIntegrations | No | No |
> | scalingplans | Yes | Yes |
> | workspaces | Yes | Yes |

## Microsoft.DevCenter

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | devcenters | Yes | Yes |
> | devcenters / attachednetworks | No | No |
> | devcenters / catalogs | No | No |
> | devcenters / catalogs / devboxdefinitions | No | No |
> | devcenters / catalogs / environmentDefinitions | No | No |
> | devcenters / catalogs / tasks | No | No |
> | devcenters / curationprofiles | No | No |
> | devcenters / devboxdefinitions | Yes | Yes |
> | devcenters / encryptionsets | Yes | Yes |
> | devcenters / environmentTypes | No | No |
> | devcenters / galleries | No | No |
> | devcenters / galleries / images | No | No |
> | devcenters / galleries / images / versions | No | No |
> | devcenters / images | No | No |
> | devcenters / projectpolicies | No | No |
> | networkconnections | Yes | Yes |
> | networkconnections / outboundNetworkDependenciesEndpoints | No | No |
> | plans | Yes | Yes |
> | plans / members | No | No |
> | projects | Yes | Yes |
> | projects / allowedEnvironmentTypes | No | No |
> | projects / attachednetworks | No | No |
> | projects / catalogs | No | No |
> | projects / catalogs / environmentDefinitions | No | No |
> | projects / catalogs / imagedefinitions | No | No |
> | projects / catalogs / imagedefinitions / builds | No | No |
> | projects / devboxdefinitions | No | No |
> | projects / environmentTypes | No | No |
> | projects / images | No | No |
> | projects / images / versions | No | No |
> | projects / pools | Yes | Yes |
> | projects / pools / schedules | No | No |
> | registeredSubscriptions | No | No |

## Microsoft.DevelopmentWindows365

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | DevelopmentCloudPcDelegatedMsis | Yes | Yes |

## Microsoft.DevHub

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | iacProfiles | Yes | Yes |
> | templates | No | No |
> | templates / versions | No | No |
> | templates / versions / generate | No | No |
> | workflows | Yes | Yes |

## Microsoft.DeviceOnboarding

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | deviceStates | No | No |
> | discoveryServices | Yes | Yes |
> | discoveryServices / ownershipVoucherPublicKeys | Yes | Yes |
> | onboardingServices | Yes | Yes |
> | onboardingServices / policies | Yes | Yes |

## Microsoft.DeviceRegistry

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | assetEndpointProfiles | Yes | Yes |
> | assets | Yes | Yes |
> | billingContainers | No | No |
> | devices | Yes | Yes |
> | discoveredAssetEndpointProfiles | Yes | Yes |
> | discoveredAssets | Yes | Yes |
> | namespaces | Yes | Yes |
> | namespaces / assetEndpointProfiles | Yes | Yes |
> | namespaces / assets | Yes | Yes |
> | namespaces / devices | Yes | Yes |
> | namespaces / discoveredAssetEndpointProfiles | Yes | Yes |
> | namespaces / discoveredAssets | Yes | Yes |
> | namespaces / discoveredDevices | Yes | Yes |
> | schemaRegistries | Yes | Yes |
> | schemaRegistries / schemas | No | No |
> | schemaRegistries / schemas / schemaVersions | No | No |

## Microsoft.Devices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | IotHubs | Yes | Yes |
> | IotHubs / eventGridFilters | No | No |
> | IotHubs / failover | No | No |
> | IotHubs / securitySettings | No | No |
> | ProvisioningServices | Yes | Yes |
> | usages | No | No |

## Microsoft.DeviceUpdate

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / agents | Yes | Yes |
> | accounts / instances | Yes | Yes |
> | accounts / privateEndpointConnectionProxies | No | No |
> | accounts / privateEndpointConnections | No | No |
> | accounts / privateLinkResources | No | No |
> | registeredSubscriptions | No | No |
> | updateAccounts | Yes | Yes |
> | updateAccounts / activeDeployments | Yes | Yes |
> | updateAccounts / agents | Yes | Yes |
> | updateAccounts / deployments | Yes | Yes |
> | updateAccounts / deviceClasses | Yes | Yes |
> | updateAccounts / updates | Yes | Yes |

## Microsoft.DevOpsInfrastructure

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | images | No | No |
> | images / versions | No | No |
> | pools | Yes | Yes |
> | pools / Resources | No | No |
> | Resources | No | No |

## Microsoft.DevTestLab

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | labs | Yes | Yes |
> | labs / environments | Yes | Yes |
> | labs / serviceRunners | Yes | Yes |
> | labs / virtualMachines | Yes | Yes |
> | schedules | Yes | Yes |

## Microsoft.DigitalTwins

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | digitalTwinsInstances | Yes | Yes |
> | digitalTwinsInstances / endpoints | No | No |
> | digitalTwinsInstances / ingressEndpoints | No | No |
> | digitalTwinsInstances / timeSeriesDatabaseConnections | No | No |

## Microsoft.DocumentDB

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | cassandraClusters | Yes | Yes |
> | databaseAccountNames | No | No |
> | databaseAccounts | Yes | Yes |
> | databaseAccounts / encryptionScopes | No | No |
> | fleets | Yes | Yes |
> | garnetClusters | Yes | Yes |
> | managedResources | Yes | Yes |
> | mongoClusters | Yes | Yes |
> | restorableDatabaseAccounts | No | No |
> | throughputPools | Yes | Yes |
> | throughputPools / throughputPoolAccounts | No | No |

## Microsoft.DomainRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | domains | Yes | Yes |
> | domains / domainOwnershipIdentifiers | No | No |
> | generateSsoRequest | No | No |
> | topLevelDomains | No | No |
> | validateDomainRegistrationInformation | No | No |

## Microsoft.DurableTask

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | namespaces | Yes | Yes |
> | namespaces / taskhubs | No | No |
> | schedulers | Yes | Yes |
> | schedulers / retentionpolicies | No | No |
> | schedulers / taskhubs | No | No |

## Microsoft.Edge

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | configTemplates | Yes | Yes |
> | configTemplates / versions | No | No |
> | configurationReferences | No | No |
> | configurations | Yes | Yes |
> | configurations / arcGatewayConfigurations | No | No |
> | configurations / connectivityConfigurations | No | No |
> | configurations / dynamicConfigurations | No | No |
> | configurations / dynamicConfigurations / versions | No | No |
> | configurations / networkConfigurations | No | No |
> | configurations / provisioningConfigurations | No | No |
> | configurations / securityConfigurations | No | No |
> | configurations / timeServerConfigurations | No | No |
> | configurationTemplates | Yes | Yes |
> | configurationTemplates / versions | No | No |
> | connectivityStatuses | No | No |
> | contexts | Yes | Yes |
> | contexts / eventGridFilters | No | No |
> | contexts / siteReferences | No | No |
> | contexts / workflows | No | No |
> | contexts / workflows / versions | No | No |
> | contexts / workflows / versions / executions | No | No |
> | deploymentTargets | Yes | Yes |
> | diagnostics | Yes | Yes |
> | jobs | No | No |
> | registeredSubscriptions | No | No |
> | resourceInsights | No | No |
> | schemaReferences | No | No |
> | schemas | Yes | Yes |
> | schemas / dynamicSchemas | No | No |
> | schemas / dynamicSchemas / versions | No | No |
> | schemas / versions | No | No |
> | SiteAwareResourceTypes | No | No |
> | Sites | No | No |
> | solutionBindings | Yes | Yes |
> | solutionBindings / solutionBindingConfigurations | No | No |
> | solutionBindings / solutionInstances | No | No |
> | solutions | Yes | Yes |
> | solutions / versions | No | No |
> | solutionTemplates | Yes | Yes |
> | solutionTemplates / versions | No | No |
> | targets | Yes | Yes |
> | targets / instances | No | No |
> | targets / instances / histories | No | No |
> | targets / solutions | No | No |
> | targets / solutions / instances | No | No |
> | targets / solutions / instances / histories | No | No |
> | targets / solutions / versions | No | No |
> | targetTemplates | Yes | Yes |
> | updates | No | No |
> | Winfields | Yes | Yes |
> | Winfields / images | No | No |
> | workflowTemplates | Yes | Yes |
> | workflowTemplates / versions | No | No |

## Microsoft.EdgeManagement

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | troubleshoot | No | No |

## Microsoft.EdgeMarketplace

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | offers | No | No |
> | publishers | No | No |

## Microsoft.EdgeOrder

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | addresses | Yes | Yes |
> | bootstrapConfigurations | Yes | Yes |
> | orderItems | Yes | Yes |
> | orders | No | No |
> | productFamiliesMetadata | No | No |

## Microsoft.EdgeOrderPartner

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | searchInventories | No | No |

## Microsoft.Elastic

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | elasticVersions | No | No |
> | getElasticOrganizationToAzureSubscriptionMapping | No | No |
> | getOrganizationApiKey | No | No |
> | monitors | Yes | Yes |
> | monitors / monitoredSubscriptions | No | No |
> | monitors / openAIIntegrations | No | No |
> | monitors / tagRules | No | No |

## Microsoft.EnterpriseSupport

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | enterpriseSupports | Yes | Yes |
> | validate | No | No |

## Microsoft.EntraIDGovernance

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | guestgovernanceusage | Yes | Yes |

## Microsoft.EventGrid

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | domains | Yes | Yes |
> | domains / topics | No | No |
> | eventSubscriptions | No | No |
> | extensionTopics | No | No |
> | namespaces | Yes | Yes |
> | partnerConfigurations | Yes | Yes |
> | partnerDestinations | Yes | Yes |
> | partnerNamespaces | Yes | Yes |
> | partnerNamespaces / channels | No | No |
> | partnerNamespaces / eventChannels | No | No |
> | partnerRegistrations | Yes | Yes |
> | partnerTopics | Yes | Yes |
> | partnerTopics / eventSubscriptions | No | No |
> | systemTopics | Yes | Yes |
> | systemTopics / eventSubscriptions | No | No |
> | topics | Yes | Yes |
> | topicTypes | No | No |
> | verifiedPartners | No | No |

## Microsoft.EventHub

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusters | Yes | Yes |
> | namespaces | Yes | Yes |
> | namespaces / applicationGroups | No | No |
> | namespaces / authorizationrules | No | No |
> | namespaces / disasterrecoveryconfigs | No | No |
> | namespaces / eventhubs | No | No |
> | namespaces / eventhubs / authorizationrules | No | No |
> | namespaces / eventhubs / consumergroups | No | No |
> | namespaces / hoboConfigurations | No | No |
> | namespaces / networkrulesets | No | No |
> | namespaces / networkSecurityPerimeterAssociationProxies | No | No |
> | namespaces / networkSecurityPerimeterConfigurations | No | No |
> | namespaces / privateEndpointConnectionProxies | No | No |
> | namespaces / privateEndpointConnections | No | No |

## Microsoft.Experimentation

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | experimentWorkspaces | Yes | Yes |

## Microsoft.Fabric

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | capacities | Yes | Yes |

## Microsoft.FairfieldGardens

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | DeviceProvisioningStates | No | No |
> | ProvisioningResources | Yes | Yes |
> | ProvisioningResources / ProvisioningPolicies | Yes | Yes |

## Microsoft.Features

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | featureConfigurations | No | No |
> | featureProviderNamespaces | No | No |
> | featureProviders | No | No |
> | features | No | No |
> | providers | No | No |
> | subscriptionFeatureRegistrations | No | No |

## Microsoft.FluidRelay

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | fluidRelayServers | Yes | Yes |
> | fluidRelayServers / fluidRelayContainers | No | No |
> | fluidRelayServers / privateEndpointConnectionProxies | No | No |
> | fluidRelayServers / privateEndpointConnections | No | No |
> | fluidRelayServers / privateLinkResources | No | No |

## Microsoft.GraphServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | RegisteredSubscriptions | No | No |

## Microsoft.GuestConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | guestConfigurationAssignments | No | No |

## Microsoft.HanaOnAzure

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | hanaInstances | Yes | Yes |

## Microsoft.HDInsight

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusters | Yes | Yes |
> | clusters / applications | No | No |

## Microsoft.HealthBot

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | healthBots | Yes | Yes |

## Microsoft.HealthcareApis

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | services | Yes | Yes |
> | services / privateEndpointConnectionProxies | No | No |
> | services / privateEndpointConnections | No | No |
> | services / privateLinkResources | No | No |
> | validateMedtechMappings | No | No |
> | workspaces | Yes | Yes |
> | workspaces / analyticsconnectors | Yes | Yes |
> | workspaces / dicomservices | Yes | Yes |
> | workspaces / eventGridFilters | No | No |
> | workspaces / fhirservices | Yes | Yes |
> | workspaces / privateEndpointConnectionProxies | No | No |
> | workspaces / privateEndpointConnections | No | No |
> | workspaces / privateLinkResources | No | No |

## Microsoft.HealthDataAIServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | deidServices | Yes | Yes |
> | deidServices / privateEndpointConnections | No | No |
> | deidServices / privateLinkResources | No | No |

## Microsoft.HealthModel

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | healthmodels | Yes | Yes |
> | healthmodels / snapshots | No | No |
> | healthmodels / versions | No | No |

## Microsoft.HealthPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |

## Microsoft.Help

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | diagnostics | No | No |
> | discoverSolutions | No | No |
> | discoverySolutions | No | No |
> | monitorInsights | No | No |
> | plugins | No | No |
> | SelfHelp | No | No |
> | simplifiedSolutions | No | No |
> | smartDiagnostics | No | No |
> | solutions | No | No |
> | troubleshooters | No | No |

## Microsoft.HybridCloud

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | cloudConnections | Yes | Yes |
> | cloudConnectors | Yes | Yes |

## Microsoft.HybridCompute

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | gateways | Yes | Yes |
> | licenses | Yes | Yes |
> | machines | Yes | Yes |
> | machines / assessPatches | No | No |
> | machines / extensions | Yes | Yes |
> | machines / hybridIdentityMetadata | No | No |
> | machines / installPatches | No | No |
> | machines / licenseProfiles | Yes | Yes |
> | machines / privateLinkScopes | No | No |
> | machines / runcommands | Yes | Yes |
> | networkConfigurations | No | No |
> | osType | No | No |
> | osType / agentVersions | No | No |
> | osType / agentVersions / latest | No | No |
> | privateLinkScopes | Yes | Yes |
> | privateLinkScopes / networkSecurityPerimeterAssociationProxies | No | No |
> | privateLinkScopes / networkSecurityPerimeterConfigurations | No | No |
> | privateLinkScopes / privateEndpointConnectionProxies | No | No |
> | privateLinkScopes / privateEndpointConnections | No | No |
> | settings | No | No |
> | validateLicense | No | No |

## Microsoft.HybridConnectivity

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | endpoints | No | No |
> | generateAwsTemplate | No | No |
> | publicCloudConnectors | Yes | Yes |
> | solutionConfigurations | No | No |
> | solutionTypes | No | No |

## Microsoft.HybridContainerService

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | kubernetesVersions | No | No |
> | provisionedClusterInstances | No | No |
> | provisionedClusters | Yes | Yes |
> | provisionedClusters / agentPools | Yes | Yes |
> | provisionedClusters / hybridIdentityMetadata | No | No |
> | provisionedClusters / upgradeProfiles | No | No |
> | storageSpaces | Yes | Yes |
> | virtualNetworks | Yes | Yes |

## Microsoft.HybridNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | configurationGroupValues | Yes | Yes |
> | devices | Yes | Yes |
> | networkfunctions | Yes | Yes |
> | networkFunctions / components | No | No |
> | networkFunctionVendors | No | No |
> | proxyPublishers | No | No |
> | proxyPublishers / configurationGroupSchemas | No | No |
> | proxyPublishers / networkFunctionDefinitionGroups | No | No |
> | proxyPublishers / networkFunctionDefinitionGroups / networkFunctionDefinitionVersions | No | No |
> | proxyPublishers / networkServiceDesignGroups | No | No |
> | proxyPublishers / networkServiceDesignGroups / networkServiceDesignVersions | No | No |
> | publishers | Yes | Yes |
> | publishers / artifactStores | Yes | Yes |
> | publishers / artifactStores / artifactManifests | Yes | Yes |
> | publishers / artifactstores / artifacts | No | No |
> | publishers / artifactstores / artifactversions | No | No |
> | publishers / configurationGroupSchemas | Yes | Yes |
> | publishers / networkFunctionDefinitionGroups | Yes | Yes |
> | publishers / networkFunctionDefinitionGroups / networkFunctionDefinitionVersions | Yes | Yes |
> | publishers / networkFunctionDefinitionGroups / previewSubscriptions | Yes | Yes |
> | publishers / networkServiceDesignGroups | Yes | Yes |
> | publishers / networkServiceDesignGroups / networkServiceDesignVersions | Yes | Yes |
> | registeredSubscriptions | No | No |
> | siteNetworkServices | Yes | Yes |
> | sites | Yes | Yes |
> | vendors | No | No |

## Microsoft.Identity

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applications | No | No |
> | applications / owners | No | No |
> | applications / preauthorizedApplications | No | No |
> | applications / trustedCertificateSubjects | No | No |
> | oAuth2PermissionGrants | No | No |
> | organizations | No | No |
> | organizations / applications | No | No |
> | organizations / applications / preauthorizedApplications | No | No |
> | organizations / applications / trustedCertificateSubjects | No | No |
> | orgIdApplications | No | No |
> | servicePrincipals | No | No |
> | servicePrincipals / appRoleAssignedTo | No | No |
> | servicePrincipals / appRoleAssignments | No | No |
> | servicePrincipals / owners | No | No |

## Microsoft.Impact

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | connectors | No | No |
> | getUploadToken | No | No |
> | impactCategories | No | No |
> | topologyImpacts | No | No |
> | workloadImpacts | No | No |
> | workloadImpacts / insights | No | No |

## microsoft.insights

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | actiongroups | Yes | Yes |
> | actiongroups / networkSecurityPerimeterAssociationProxies | No | No |
> | actiongroups / networkSecurityPerimeterConfigurations | No | No |
> | autoscalesettings | Yes | Yes |
> | components | Yes | Yes |
> | components / aggregate | No | No |
> | components / analyticsItems | No | No |
> | components / annotations | No | No |
> | components / api | No | No |
> | components / apiKeys | No | No |
> | components / currentBillingFeatures | No | No |
> | components / defaultWorkItemConfig | No | No |
> | components / events | No | No |
> | components / exportConfiguration | No | No |
> | components / extendQueries | No | No |
> | components / favorites | No | No |
> | components / featureCapabilities | No | No |
> | components / generateDiagnosticServiceReadOnlyToken | No | No |
> | components / generateDiagnosticServiceReadWriteToken | No | No |
> | components / linkedstorageaccounts | No | No |
> | components / metadata | No | No |
> | components / metricDefinitions | No | No |
> | components / metrics | No | No |
> | components / move | No | No |
> | components / myAnalyticsItems | No | No |
> | components / myFavorites | No | No |
> | components / pricingPlans | No | No |
> | components / proactiveDetectionConfigs | No | No |
> | components / purge | No | No |
> | components / query | No | No |
> | components / quotaStatus | No | No |
> | components / webtests | No | No |
> | components / workItemConfigs | No | No |
> | createnotifications | No | No |
> | deletedWorkbooks | No | No |
> | diagnosticSettings | No | No |
> | diagnosticSettingsCategories | No | No |
> | eventCategories | No | No |
> | eventtypes | No | No |
> | extendedDiagnosticSettings | No | No |
> | generateDiagnosticServiceReadOnlyToken | No | No |
> | generateDiagnosticServiceReadWriteToken | No | No |
> | guestDiagnosticSettings | Yes | Yes |
> | guestDiagnosticSettingsAssociation | No | No |
> | logDefinitions | No | No |
> | logprofiles | No | No |
> | logs | No | No |
> | metricbatch | No | No |
> | metricDefinitions | No | No |
> | metricNamespaces | No | No |
> | metrics | No | No |
> | migratealertrules | No | No |
> | migrateToNewPricingModel | No | No |
> | notificationgroups | Yes | Yes |
> | notificationstatus | No | No |
> | privateLinkScopes | Yes | Yes |
> | privateLinkScopes / privateEndpointConnectionProxies | No | No |
> | privateLinkScopes / privateEndpointConnections | No | No |
> | privateLinkScopes / scopedResources | No | No |
> | rollbackToLegacyPricingModel | No | No |
> | scheduledqueryrules / networkSecurityPerimeterAssociationProxies | No | No |
> | scheduledqueryrules / networkSecurityPerimeterConfigurations | No | No |
> | tenantactiongroups | No | No |
> | topology | No | No |
> | transactions | No | No |
> | webtests | Yes | Yes |
> | webtests / getTestResultFile | No | No |
> | workbooks | Yes | Yes |
> | workbooktemplates | Yes | Yes |

## Microsoft.IntegrationSpaces

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | spaces | Yes | Yes |
> | spaces / Applications | Yes | Yes |
> | spaces / applications / businessprocesses | No | No |
> | spaces / applications / businessprocesses / versions | No | No |
> | spaces / applications / resources | No | No |
> | Spaces / InfrastructureResources | No | No |

## Microsoft.IoTCentral

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | appTemplates | No | No |
> | IoTApps | Yes | Yes |

## Microsoft.IoTFirmwareDefense

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | firmwareGroups | No | No |
> | firmwareGroups / firmwares | No | No |
> | workspaces | Yes | Yes |
> | workspaces / firmwares | No | No |
> | workspaces / firmwares / commonVulnerabilitiesAndExposures | No | No |
> | workspaces / firmwares / cryptoCertificates | No | No |
> | workspaces / firmwares / cryptoKeys | No | No |
> | workspaces / firmwares / cves | No | No |
> | workspaces / firmwares / passwordHashes | No | No |
> | workspaces / firmwares / sbomComponents | No | No |
> | workspaces / firmwares / summaries | No | No |
> | workspaces / usageMetrics | No | No |

## Microsoft.IoTSecurity

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | alertTypes | No | No |
> | defenderSettings | No | No |
> | onPremiseSensors | No | No |
> | recommendationTypes | No | No |
> | sensors | No | No |
> | sites | No | No |

## Microsoft.KeyVault

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | deletedManagedHSMs | No | No |
> | deletedVaults | No | No |
> | hsmPools | Yes | Yes |
> | managedHSMs | Yes | Yes |
> | managedHSMs / keys | No | No |
> | managedHSMs / keys / versions | No | No |
> | vaults | Yes | Yes |
> | vaults / accessPolicies | No | No |
> | vaults / eventGridFilters | No | No |
> | vaults / keys | No | No |
> | vaults / keys / versions | No | No |
> | vaults / secrets | Yes | No |

## Microsoft.Kubernetes

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | connectedClusters | Yes | Yes |
> | registeredSubscriptions | No | No |

## Microsoft.KubernetesConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | extensions | No | No |
> | extensionTypes | No | No |
> | fluxConfigurations | No | No |
> | namespaces | No | No |
> | privateLinkScopes | Yes | Yes |
> | privateLinkScopes / privateEndpointConnectionProxies | No | No |
> | privateLinkScopes / privateEndpointConnections | No | No |
> | sourceControlConfigurations | No | No |

## Microsoft.KubernetesRuntime

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | bfdProfiles | No | No |
> | bgpPeers | No | No |
> | loadBalancers | No | No |
> | services | No | No |
> | storageClasses | No | No |

## Microsoft.Kusto

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusters | Yes | Yes |
> | clusters / attacheddatabaseconfigurations | No | No |
> | clusters / databases | No | No |
> | clusters / databases / dataconnections | No | No |
> | clusters / databases / eventhubconnections | No | No |
> | clusters / databases / principalassignments | No | No |
> | clusters / databases / scripts | No | No |
> | clusters / dataconnections | No | No |
> | clusters / managedPrivateEndpoints | No | No |
> | clusters / principalassignments | No | No |
> | clusters / sandboxCustomImages | No | No |
> | clusters / sharedidentities | No | No |

## Microsoft.LabServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | labaccounts | Yes | No |
> | labplans | Yes | Yes |
> | labs | Yes | Yes |
> | users | No | No |

## Microsoft.LoadTestService

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | loadTestMappings | No | No |
> | loadTestProfileMappings | No | No |
> | loadtests | Yes | Yes |
> | loadtests / Limits | No | No |
> | loadtests / outboundNetworkDependenciesEndpoints | No | No |
> | playwrightWorkspaces | Yes | Yes |
> | PlaywrightWorkspaces / quotas | No | No |
> | registeredSubscriptions | No | No |

## Microsoft.Logic

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | businessProcesses | Yes | Yes |
> | hostingEnvironments | Yes | Yes |
> | integrationAccounts | Yes | Yes |
> | integrationServiceEnvironments | Yes | Yes |
> | integrationServiceEnvironments / managedApis | Yes | Yes |
> | isolatedEnvironments | Yes | Yes |
> | templates | Yes | Yes |
> | workflows | Yes | Yes |

## Microsoft.MachineLearningServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | capacityReservationGroups | Yes | Yes |
> | inferenceModels | Yes | Yes |
> | registries | Yes | Yes |
> | registries / codes | No | No |
> | registries / codes / versions | No | No |
> | registries / components | No | No |
> | registries / components / versions | No | No |
> | registries / data | No | No |
> | registries / data / versions | No | No |
> | registries / datareferences | No | No |
> | registries / datareferences / versions | No | No |
> | registries / environments | No | No |
> | registries / environments / versions | No | No |
> | registries / models | No | No |
> | registries / models / versions | No | No |
> | virtualclusters | Yes | Yes |
> | workspaces | Yes | Yes |
> | workspaces / batchEndpoints | Yes | Yes |
> | workspaces / batchEndpoints / deployments | Yes | Yes |
> | workspaces / capabilityhosts | No | No |
> | workspaces / codes | No | No |
> | workspaces / codes / versions | No | No |
> | workspaces / components | No | No |
> | workspaces / components / versions | No | No |
> | workspaces / computes | No | No |
> | workspaces / data | No | No |
> | workspaces / data / versions | No | No |
> | workspaces / datasets | No | No |
> | workspaces / datastores | No | No |
> | workspaces / endpoints | No | No |
> | workspaces / environments | No | No |
> | workspaces / environments / versions | No | No |
> | workspaces / eventGridFilters | No | No |
> | workspaces / featuresets | No | No |
> | workspaces / featuresets / versions | No | No |
> | workspaces / featurestoreEntities | No | No |
> | workspaces / featurestoreEntities / versions | No | No |
> | workspaces / inferencePools | Yes | Yes |
> | workspaces / inferencePools / endpoints | Yes | Yes |
> | workspaces / inferencePools / groups | Yes | Yes |
> | workspaces / jobs | No | No |
> | workspaces / labelingJobs | No | No |
> | workspaces / linkedServices | No | No |
> | workspaces / managednetworks | No | No |
> | workspaces / marketplaceSubscriptions | No | No |
> | workspaces / models | No | No |
> | workspaces / models / versions | No | No |
> | workspaces / onlineEndpoints | Yes | Yes |
> | workspaces / onlineEndpoints / deployments | Yes | Yes |
> | workspaces / schedules | No | No |
> | workspaces / serverlessEndpoints | Yes | Yes |
> | workspaces / services | No | No |

> [!NOTE]
> Workspace tags don't propagate to compute clusters and compute instances.

## Microsoft.Maintenance

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applyUpdates | No | No |
> | configurationAssignments | No | No |
> | maintenanceConfigurations | Yes | Yes |
> | maintenanceConfigurations / eventGridFilters | No | No |
> | publicMaintenanceConfigurations | No | No |
> | scheduledevents | No | No |
> | scheduledevents / acknowledge | No | No |
> | updates | No | No |

## Microsoft.ManagedIdentity

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | Identities | No | No |
> | migrateIdentities | No | No |
> | userAssignedIdentities | Yes | Yes |
> | userAssignedIdentities / federatedIdentityCredentials | No | No |

## Microsoft.ManagedServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | marketplaceRegistrationDefinitions | No | No |
> | registrationAssignments | No | No |
> | registrationDefinitions | No | No |

## Microsoft.Management

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | getEntities | No | No |
> | managementGroups | No | No |
> | managementGroups / settings | No | No |
> | resources | No | No |
> | serviceGroups | No | No |
> | startTenantBackfill | No | No |
> | tenantBackfillStatus | No | No |

## Microsoft.ManufacturingPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | manufacturingDataServices | Yes | Yes |

## Microsoft.Maps

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / creators | Yes | Yes |
> | accounts / eventGridFilters | No | No |
> | accounts / privateEndpointConnectionProxies | No | No |
> | accounts / privateEndpointConnections | No | No |

## Microsoft.Marketplace

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | keys | No | No |
> | keys / create | No | No |
> | keys / revoke | No | No |
> | mysolutions | No | No |
> | offers | No | No |
> | privateStores | No | No |
> | privateStores / AdminRequestApprovals | No | No |
> | privateStores / anyExistingOffersInTheCollections | No | No |
> | privateStores / billingAccounts | No | No |
> | privateStores / bulkCollectionsAction | No | No |
> | privateStores / collections | No | No |
> | privateStores / collections / approveAllItems | No | No |
> | privateStores / collections / disableApproveAllItems | No | No |
> | privateStores / collections / mapOffersToContexts | No | No |
> | privateStores / collections / offers | No | No |
> | privateStores / collections / offers / upsertOfferWithMultiContext | No | No |
> | privateStores / collections / queryRules | No | No |
> | privateStores / collections / setRules | No | No |
> | privateStores / collections / transferOffers | No | No |
> | privateStores / collectionsToSubscriptionsMapping | No | No |
> | privateStores / fetchAllSubscriptionsInTenant | No | No |
> | privateStores / offers | No | No |
> | privateStores / offers / acknowledgeNotification | No | No |
> | privateStores / queryApprovedPlans | No | No |
> | privateStores / queryNotificationsState | No | No |
> | privateStores / queryOffers | No | No |
> | privateStores / queryUserOffers | No | No |
> | privateStores / queryUserRules | No | No |
> | privateStores / RequestApprovals | No | No |
> | privateStores / requestApprovals / query | No | No |
> | privateStores / requestApprovals / withdrawPlan | No | No |
> | products | No | No |
> | products / reviews | No | No |
> | products / reviews / comments | No | No |
> | products / reviews / helpful | No | No |
> | products / usermetadata | No | No |
> | publishers | No | No |
> | publishers / offers | No | No |
> | publishers / offers / amendments | No | No |
> | register | No | No |
> | search | No | No |

## Microsoft.MarketplaceOrdering

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | agreements | No | No |
> | offertypes | No | No |

## Microsoft.MessagingCatalog

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | catalogs | Yes | Yes |

## Microsoft.MessagingConnectors

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | connectors | Yes | Yes |

## Microsoft.Migrate

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | assessmentProjects | Yes | Yes |
> | assessmentProjects / assessments | No | No |
> | castScanReports | No | No |
> | migrateprojects | Yes | Yes |
> | migrateprojects / migrationentities | No | No |
> | migrateprojects / migrationentitygroups | No | No |
> | migrateprojects / tasks | No | No |
> | migrateprojects / waves | No | No |
> | modernizeProjects | Yes | Yes |
> | moveCollections | Yes | Yes |
> | onPremTcoDetails | No | No |

## Microsoft.MixedReality

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | remoteRenderingAccounts | Yes | Yes |
> | spatialMapsAccounts | Yes | Yes |

## Microsoft.MobileNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | mobileNetworks | Yes | Yes |
> | mobileNetworks / dataNetworks | Yes | Yes |
> | mobileNetworks / edgeNetworkSecurityGroups | Yes | Yes |
> | mobileNetworks / services | Yes | Yes |
> | mobileNetworks / simPolicies | Yes | Yes |
> | mobileNetworks / sites | Yes | Yes |
> | mobileNetworks / slices | Yes | Yes |
> | mobileNetworks / wifiSsids | Yes | Yes |
> | packetCoreControlPlanes | Yes | Yes |
> | packetCoreControlPlanes / packetCaptures | No | No |
> | packetCoreControlPlanes / packetCoreDataPlanes | Yes | Yes |
> | packetCoreControlPlanes / packetCoreDataPlanes / attachedDataNetworks | Yes | Yes |
> | packetCoreControlPlanes / packetCoreDataPlanes / attachedDataNetworks / routingInfo | No | No |
> | packetCoreControlPlanes / packetCoreDataPlanes / attachedWifiSsids | Yes | Yes |
> | packetCoreControlPlanes / packetCoreDataPlanes / edgeVirtualNetworks | Yes | Yes |
> | packetCoreControlPlanes / packetCoreDataPlanes / routingInfo | No | No |
> | packetCoreControlPlanes / routingInfo | No | No |
> | packetCoreControlPlanes / ues | No | No |
> | packetCoreControlPlanes / ues / extendedInformation | No | No |
> | packetCoreControlPlaneVersions | No | No |
> | radioAccessNetworks | Yes | Yes |
> | simGroups | Yes | Yes |
> | simGroups / sims | No | No |
> | sims | Yes | Yes |

## Microsoft.Monitor

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | investigations | No | No |
> | pipelineGroups | Yes | Yes |

## Microsoft.MySQLDiscovery

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | MySQLSites | Yes | Yes |
> | MySQLSites / agents | No | No |
> | MySQLSites / ErrorSummaries | No | No |
> | MySQLSites / MySQLServers | No | No |
> | MySQLSites / Refresh | No | No |
> | MySQLSites / Summaries | No | No |

## Microsoft.NetApp

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | netAppAccounts | Yes | No |
> | netAppAccounts / accountBackups | No | No |
> | netAppAccounts / backupPolicies | Yes | Yes |
> | netAppAccounts / backupVaults | Yes | Yes |
> | netAppAccounts / backupVaults / backups | No | No |
> | netAppAccounts / capacityPools | Yes | Yes |
> | netAppAccounts / capacityPools / caches | Yes | Yes |
> | netAppAccounts / capacityPools / volumes | Yes | No |
> | netAppAccounts / capacityPools / volumes / backups | No | No |
> | netAppAccounts / capacityPools / volumes / buckets | No | No |
> | netAppAccounts / capacityPools / volumes / mountTargets | No | No |
> | netAppAccounts / capacityPools / volumes / ransomwareReports | No | No |
> | netAppAccounts / capacityPools / volumes / snapshots | No | No |
> | netAppAccounts / capacityPools / volumes / subvolumes | No | No |
> | netAppAccounts / capacityPools / volumes / volumeQuotaRules | No | No |
> | netAppAccounts / quotaLimits | No | No |
> | netAppAccounts / snapshotPolicies | Yes | Yes |
> | netAppAccounts / vaults | No | No |
> | netAppAccounts / volumeGroups | No | No |
> | scaleAccounts | Yes | Yes |
> | scaleAccounts / scaleCapacityPools | Yes | Yes |
> | scaleAccounts / scaleCapacityPools / scaleVolumes | Yes | Yes |
> | scaleAccounts / scaleCapacityPools / scaleVolumes / scaleSnapshots | No | No |
> | scaleAccounts / scaleSnapshotPolicies | Yes | Yes |

## Microsoft.Network

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applicationSecurityGroups | Yes | Yes |
> | cloudServiceNetworkInterfaces | No | No |
> | cloudServicePublicIPAddresses | No | No |
> | cloudServiceSlots | No | No |
> | customIpPrefixes | Yes | Yes |
> | ddosCustomPolicies | Yes | Yes |
> | ddosProtectionPlans | Yes | Yes |
> | dscpConfigurations | Yes | Yes |
> | gatewayLoadBalancerAliases | Yes | Yes |
> | internalPublicIpAddresses | No | No |
> | loadBalancers | Yes | Yes |
> | natGateways | Yes | Yes |
> | networkIntentPolicies | Yes | Yes |
> | networkInterfaces | Yes | Yes |
> | networkManagers | Yes | No |
> | networkProfiles | Yes | Yes |
> | networkSecurityGroups | Yes | Yes |
> | networkWatchers | Yes | Yes |
> | networkWatchers / connectionMonitors | Yes | No |
> | networkWatchers / flowLogs | Yes | Yes |
> | networkWatchers / lenses | Yes | No |
> | networkWatchers / pingMeshes | Yes | No |
> | privateEndpointRedirectMaps | Yes | Yes |
> | privateEndpoints | Yes | Yes |
> | privateEndpoints / privateLinkServiceProxies | No | No |
> | privateLinkServices | Yes | Yes |
> | publicIPAddresses | Yes | Yes |
> | publicIPPrefixes | Yes | Yes |
> | routeTables | Yes | Yes |
> | serviceEndpointPolicies | Yes | Yes |
> | serviceGateways | Yes | Yes |
> | virtualNetworks | Yes | Yes |
> | virtualNetworks / taggedTrafficConsumers | No | No |
> | virtualNetworkTaps | Yes | Yes |

<a id="network-limitations"></a>

> [!NOTE]
> For Azure Front Door Service, you can apply tags when creating the resource, but updating or adding tags is not currently supported. Front Door doesn't support the use of # or : in the tag name.
> 
> Azure DNS zones and Traffic Manager doesn't support the use of spaces in the tag or a tag that starts with a number. Azure DNS tag names do not support special and unicode characters. The value can contain all characters.
> 
> Azure IP Groups and Azure Firewall Policies don't support PATCH operations, which means they don't support updating tags through the portal. Instead, use the update commands for those resources. For example, you can update tags for an IP group with the [az network ip-group update](/cli/azure/network/ip-group#az-network-ip-group-update) command.


## Microsoft.NetworkCloud

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | bareMetalMachines | Yes | Yes |
> | cloudServicesNetworks | Yes | Yes |
> | clusterManagers | Yes | Yes |
> | clusters | Yes | Yes |
> | clusters / bareMetalMachineKeySets | Yes | Yes |
> | clusters / bmcKeySets | Yes | Yes |
> | clusters / metricsConfigurations | Yes | Yes |
> | kubernetesClusters | Yes | Yes |
> | kubernetesClusters / agentPools | Yes | Yes |
> | kubernetesClusters / features | Yes | Yes |
> | l2Networks | Yes | Yes |
> | l3Networks | Yes | Yes |
> | racks | Yes | Yes |
> | registeredSubscriptions | No | No |
> | storageAppliances | Yes | Yes |
> | trunkedNetworks | Yes | Yes |
> | virtualMachines | Yes | Yes |
> | virtualMachines / consoles | Yes | Yes |
> | volumes | Yes | Yes |

## Microsoft.NetworkFunction

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | azureTrafficCollectors | Yes | Yes |
> | azureTrafficCollectors / collectorPolicies | Yes | Yes |
> | copilot | No | No |
> | meshVpns | Yes | Yes |
> | meshVpns / connectionPolicies | Yes | Yes |
> | meshVpns / privateEndpointConnectionProxies | No | No |
> | meshVpns / privateEndpointConnections | No | No |
> | vpnBranches | Yes | Yes |

## Microsoft.NexusIdentity

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | IdentityControllers | Yes | Yes |
> | IdentitySets | Yes | Yes |

## Microsoft.NotificationHubs

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | namespaces | Yes | No |
> | namespaces / notificationHubs | Yes | No |

## Microsoft.Nutanix

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | interfaces | Yes | Yes |
> | nodes | Yes | Yes |

## Microsoft.ObjectStore

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | osNamespaces | Yes | Yes |

## Microsoft.OffAzure

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | Appliances | Yes | Yes |
> | HyperVSites | Yes | Yes |
> | ImportSites | Yes | Yes |
> | MasterSites | Yes | Yes |
> | MasterSites / SqlSites | No | No |
> | ServerSites | Yes | Yes |
> | VMwareSites | Yes | Yes |

## Microsoft.OffAzureSpringBoot

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | springbootsites | Yes | Yes |
> | springbootsites / errorsummaries | No | No |
> | springbootsites / springbootapps | No | No |
> | springbootsites / springbootservers | No | No |
> | springbootsites / summaries | No | No |

## Microsoft.OnlineExperimentation

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | workspaces | Yes | Yes |
> | workspaces / privateEndpointConnections | No | No |
> | workspaces / privateLinkResources | No | No |

## Microsoft.OpenEnergyPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | energyServices | Yes | Yes |
> | energyServices / privateEndpointConnectionProxies | No | No |
> | energyServices / privateEndpointConnections | No | No |
> | energyServices / privateLinkResources | No | No |

## Microsoft.OperationalInsights

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusters | Yes | Yes |
> | deletedWorkspaces | No | No |
> | linkTargets | No | No |
> | querypacks | Yes | Yes |
> | storageInsightConfigs | No | No |
> | workspaces | Yes | Yes |
> | workspaces / api | No | No |
> | workspaces / dataExports | No | No |
> | workspaces / dataSources | No | No |
> | workspaces / linkedServices | No | No |
> | workspaces / linkedStorageAccounts | No | No |
> | workspaces / metadata | No | No |
> | workspaces / networkSecurityPerimeterAssociationProxies | No | No |
> | workspaces / networkSecurityPerimeterConfigurations | No | No |
> | workspaces / purge | No | No |
> | workspaces / query | No | No |
> | workspaces / scopedPrivateLinkProxies | No | No |
> | workspaces / storageInsightConfigs | No | No |
> | workspaces / summaryLogs | No | No |
> | workspaces / tables | No | No |

## Microsoft.OperatorVoicemail

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | OperatorVoicemailInstances | Yes | Yes |

## Microsoft.OracleDiscovery

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | oraclesites | Yes | Yes |
> | oraclesites / errorSummaries | No | No |
> | oraclesites / oracledatabases | No | No |
> | oraclesites / oracleservers | No | No |
> | oraclesites / summaries | No | No |

## Microsoft.PartnerManagedConsumerRecurrence

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | recurrences | No | No |

## Microsoft.Peering

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | cdnPeeringPrefixes | No | No |
> | legacyPeerings | No | No |
> | lookingGlass | No | No |
> | peerAsns | No | No |
> | peerings | Yes | Yes |
> | peeringServiceCountries | No | No |
> | peeringServiceProviders | No | No |
> | peeringServices | Yes | Yes |

## Microsoft.Pki

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | pkis | Yes | Yes |
> | pkis / certificateAuthorities | No | No |
> | pkis / enrollmentPolicies | No | No |

## Microsoft.PolicyInsights

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | attestations | No | No |
> | componentPolicyStates | No | No |
> | derivePolicyProperties | No | No |
> | eventGridFilters | No | No |
> | generatePolicyRuleIf | No | No |
> | handlePolicyCopilotRequest | No | No |
> | policyEvents | No | No |
> | policyMetadata | No | No |
> | policyStates | No | No |
> | policyTrackedResources | No | No |
> | remediations | No | No |

## Microsoft.Portal

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | consoles | No | No |
> | dashboards | Yes | Yes |
> | tenantconfigurations | No | No |
> | userSettings | No | No |

## Microsoft.PowerBI

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | privateLinkServicesForPowerBI | Yes | Yes |
> | tenants | Yes | Yes |
> | tenants / workspaces | No | No |
> | workspaceCollections | Yes | Yes |

## Microsoft.PowerBIDedicated

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | autoScaleVCores | Yes | Yes |
> | capacities | Yes | Yes |
> | servers | Yes | Yes |

## Microsoft.PowerPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | enterprisePolicies | Yes | Yes |

## Microsoft.Premonition

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | libraries | Yes | Yes |
> | libraries / analyses | Yes | Yes |
> | libraries / samples | Yes | Yes |

## Microsoft.ProfessionalService

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | resources | Yes | Yes |

## Microsoft.ProgrammableConnectivity

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | gateways | Yes | Yes |
> | operatorApiConnections | Yes | Yes |
> | operatorApiPlans | No | No |

## Microsoft.ProviderHub

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | providerMonitorSettings | Yes | Yes |
> | providerRegistrations | No | No |
> | providerRegistrations / authorizedApplications | No | No |
> | providerRegistrations / customRollouts | No | No |
> | providerRegistrations / defaultRollouts | No | No |
> | providerRegistrations / manifests | No | No |
> | providerRegistrations / newRegionFrontloadRelease | No | No |
> | providerRegistrations / resourceActions | No | No |
> | providerRegistrations / resourceTypeRegistrations | No | No |

## Microsoft.Purview

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / kafkaConfigurations | No | No |
> | consents | No | No |
> | getDefaultAccount | No | No |
> | policies | No | No |
> | removeDefaultAccount | No | No |
> | setDefaultAccount | No | No |

## Microsoft.Quantum

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | providerAccounts | Yes | Yes |
> | Workspaces | Yes | Yes |

## Microsoft.Quota

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | groupQuotas | No | No |
> | groupQuotas / groupQuotaLimits | No | No |
> | groupQuotas / groupQuotaRequests | No | No |
> | groupQuotas / locationUsages | No | No |
> | groupQuotas / quotaAllocationRequests | No | No |
> | groupQuotas / subscriptionRequests | No | No |
> | groupQuotas / subscriptions | No | No |
> | quotaRequests | No | No |
> | quotas | No | No |
> | usages | No | No |

## Microsoft.RecommendationsService

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / modeling | Yes | Yes |
> | accounts / serviceEndpoints | Yes | Yes |

## Microsoft.RecoveryServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | backupProtectedItems | No | No |
> | vaults | Yes | Yes |

## Microsoft.Relationships

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | dependencyOf | No | No |
> | serviceGroupMember | No | No |

## Microsoft.Relay

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | namespaces | Yes | Yes |
> | namespaces / authorizationrules | No | No |
> | namespaces / hybridconnections | No | No |
> | namespaces / hybridconnections / authorizationrules | No | No |
> | namespaces / privateEndpointConnectionProxies | No | No |
> | namespaces / privateEndpointConnections | No | No |
> | namespaces / wcfrelays | No | No |
> | namespaces / wcfrelays / authorizationrules | No | No |

## Microsoft.ResourceConnector

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | appliances | Yes | Yes |
> | telemetryconfig | No | No |

## Microsoft.ResourceGraph

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | generateQuery | No | No |
> | queries | Yes | Yes |
> | resourceChangeDetails | No | No |
> | resourceChanges | No | No |
> | resources | No | No |
> | resourcesHistory | No | No |
> | subscriptionsStatus | No | No |

## Microsoft.ResourceHealth

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | childResources | No | No |
> | emergingissues | No | No |
> | events | No | No |
> | impactedResources | No | No |
> | metadata | No | No |

## Microsoft.ResourceNotifications

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | eventGridFilters | No | No |

## Microsoft.Resources

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | batch | No | No |
> | dataBoundaries | No | No |
> | decompileBicep | No | No |
> | deletedResources | No | No |
> | deleteOptions | No | No |
> | deploymentScripts | Yes | Yes |
> | deploymentScripts / logs | No | No |
> | links | No | No |
> | resourceGroups | Yes | No |
> | subscriptions | Yes | No |
> | tags | No | No |
> | templateSpecs | Yes | Yes |
> | templateSpecs / versions | Yes | Yes |
> | tenants | No | No |
> | validateResources | No | No |

## Microsoft.SaaS

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applications | Yes | Yes |
> | resources | Yes | No |
> | saasresources | No | No |

## Microsoft.SaaSHub

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | canCreate | No | No |
> | cloudServices | Yes | Yes |
> | registeredSubscriptions | No | No |
> | saasResources | No | No |
> | tenantLevelCanCreate | No | No |

## Microsoft.Scom

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | managedInstances | Yes | Yes |
> | managedInstances / managedGateways | No | No |
> | managedInstances / monitoredResources | No | No |

## Microsoft.SCVMM

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | AvailabilitySets | Yes | Yes |
> | Clouds | Yes | Yes |
> | VirtualMachineInstances | No | No |
> | VirtualMachines | Yes | Yes |
> | VirtualMachines / Extensions | Yes | Yes |
> | VirtualMachines / GuestAgents | No | No |
> | VirtualMachines / HybridIdentityMetadata | No | No |
> | VirtualMachineTemplates | Yes | Yes |
> | VirtualNetworks | Yes | Yes |
> | VMMServers | Yes | Yes |
> | VMMServers / InventoryItems | No | No |

## Microsoft.Search

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | offerings | No | No |
> | resourceHealthMetadata | No | No |
> | searchServices | Yes | Yes |

## Microsoft.SecretSyncController

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | azureKeyVaultSecretProviderClasses | Yes | Yes |
> | secretSyncs | Yes | Yes |

## Microsoft.Security

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | advancedThreatProtectionSettings | No | No |
> | aggregations | No | No |
> | alerts | No | No |
> | alertsSuppressionRules | No | No |
> | allowedConnections | No | No |
> | apiCollections | No | No |
> | applications | No | No |
> | assessmentMetadata | No | No |
> | assessments | No | No |
> | assessments / governanceAssignments | No | No |
> | assignments | Yes | Yes |
> | autoDismissAlertsRules | No | No |
> | automations | Yes | Yes |
> | AutoProvisioningSettings | No | No |
> | Compliances | No | No |
> | connectedContainerRegistries | No | No |
> | connectors | No | No |
> | customAssessmentAutomations | Yes | Yes |
> | customRecommendations | No | No |
> | dataCollectionAgents | No | No |
> | dataScanners | No | No |
> | defenderForStorageSettings | No | No |
> | deviceSecurityGroups | No | No |
> | discoveredSecuritySolutions | No | No |
> | externalSecuritySolutions | No | No |
> | governanceRules | No | No |
> | healthReports | No | No |
> | InformationProtectionPolicies | No | No |
> | integrations | No | No |
> | iotSecuritySolutions | Yes | Yes |
> | iotSecuritySolutions / analyticsModels | No | No |
> | iotSecuritySolutions / analyticsModels / aggregatedAlerts | No | No |
> | iotSecuritySolutions / analyticsModels / aggregatedRecommendations | No | No |
> | iotSecuritySolutions / iotAlerts | No | No |
> | iotSecuritySolutions / iotAlertTypes | No | No |
> | iotSecuritySolutions / iotRecommendations | No | No |
> | iotSecuritySolutions / iotRecommendationTypes | No | No |
> | jitNetworkAccessPolicies | No | No |
> | jitPolicies | No | No |
> | MdeOnboardings | No | No |
> | policies | No | No |
> | pricings | No | No |
> | pricings / securityOperators | No | No |
> | query | No | No |
> | regulatoryComplianceStandards | No | No |
> | regulatoryComplianceStandards / regulatoryComplianceControls | No | No |
> | regulatoryComplianceStandards / regulatoryComplianceControls / regulatoryComplianceAssessments | No | No |
> | secureScoreControlDefinitions | No | No |
> | secureScoreControls | No | No |
> | secureScores | No | No |
> | secureScores / secureScoreControls | No | No |
> | securityConnectors | Yes | Yes |
> | securityConnectors / devops | No | No |
> | securityContacts | No | No |
> | securitySolutions | No | No |
> | securitySolutionsReferenceData | No | No |
> | securityStandards | No | No |
> | securityStatuses | No | No |
> | securityStatusesSummaries | No | No |
> | sensitivitySettings | No | No |
> | serverVulnerabilityAssessments | No | No |
> | serverVulnerabilityAssessmentsSettings | No | No |
> | settings | No | No |
> | sqlVulnerabilityAssessments | No | No |
> | standardAssignments | No | No |
> | standards | Yes | Yes |
> | subAssessments | No | No |
> | tasks | No | No |
> | topologies | No | No |
> | trustedIps | No | No |
> | vmScanners | No | No |
> | workspaceSettings | No | No |

## Microsoft.SecurityCopilot

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | capacities | Yes | Yes |

## Microsoft.SecurityDetonation

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | chambers | Yes | Yes |

## Microsoft.SecurityInsights

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | aggregations | No | No |
> | alertRules | No | No |
> | alertRuleTemplates | No | No |
> | automationRules | No | No |
> | billingStatistics | No | No |
> | bookmarks | No | No |
> | businessApplicationAgents | No | No |
> | cases | No | No |
> | collaborations | No | No |
> | contentPackages | No | No |
> | contentProductPackages | No | No |
> | contentProductTemplates | No | No |
> | contentTemplates | No | No |
> | contenttranslators | No | No |
> | dataConnectorDefinitions | No | No |
> | dataConnectors | No | No |
> | enrichment | No | No |
> | enrichmentWidgets | No | No |
> | entities | No | No |
> | entityQueryTemplates | No | No |
> | exportConnections | No | No |
> | fileImports | No | No |
> | hunts | No | No |
> | huntsessions | No | No |
> | incidents | No | No |
> | metadata | No | No |
> | MitreCoverageRecords | No | No |
> | onboardingStates | No | No |
> | overview | No | No |
> | partnerships | No | No |
> | recommendations | No | No |
> | securityMLAnalyticsSettings | No | No |
> | settings | No | No |
> | sourceControls | No | No |
> | threatIntelligence | No | No |
> | triggeredAnalyticsRuleRuns | No | No |
> | workspaceManagerAssignments | No | No |
> | workspaceManagerConfigurations | No | No |
> | workspaceManagerGroups | No | No |
> | workspaceManagerMembers | No | No |

## Microsoft.SecurityPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accountLinks | Yes | Yes |

## Microsoft.SentinelPlatformServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | sentinelPlatformServices | Yes | Yes |

## Microsoft.SerialConsole

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | consoleServices | No | No |
> | serialPorts | No | No |

## Microsoft.ServiceBus

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | namespaces | Yes | Yes |
> | namespaces / authorizationrules | No | No |
> | namespaces / disasterrecoveryconfigs | No | No |
> | namespaces / eventgridfilters | No | No |
> | namespaces / migrationConfigurations | No | No |
> | namespaces / networkrulesets | No | No |
> | namespaces / privateEndpointConnectionProxies | No | No |
> | namespaces / privateEndpointConnections | No | No |
> | namespaces / queues | No | No |
> | namespaces / queues / authorizationrules | No | No |
> | namespaces / topics | No | No |
> | namespaces / topics / authorizationrules | No | No |
> | namespaces / topics / subscriptions | No | No |
> | namespaces / topics / subscriptions / rules | No | No |
> | premiumMessagingRegions | No | No |

## Microsoft.ServiceFabric

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusters | Yes | Yes |
> | clusters / applications | No | No |
> | clusters / applications / services | No | No |
> | clusters / applicationTypes | No | No |
> | clusters / applicationTypes / versions | No | No |
> | managedclusters | Yes | Yes |
> | managedclusters / applications | No | No |
> | managedclusters / applications / services | No | No |
> | managedclusters / applicationTypes | No | No |
> | managedclusters / applicationTypes / versions | No | No |
> | managedclusters / nodetypes | No | No |

## Microsoft.ServiceLinker

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | configurationNames | No | No |
> | daprConfigurations | No | No |
> | dryruns | No | No |
> | linkers | No | No |

## Microsoft.ServicesHub

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | connectors | Yes | Yes |
> | connectors / connectorSpaces | No | No |
> | getRecommendationsContent | No | No |
> | supportOfferingEntitlement | No | No |
> | workspaces | No | No |

## Microsoft.SignalRService

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | SignalR | Yes | Yes |
> | SignalR / customDomains | No | No |
> | SignalR / eventGridFilters | No | No |
> | SignalR / replicas | Yes | Yes |
> | WebPubSub | Yes | Yes |
> | WebPubSub / customDomains | No | No |
> | WebPubSub / replicas | Yes | Yes |

## Microsoft.Singularity

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / accountQuotaPolicies | No | No |
> | accounts / groupPolicies | No | No |
> | accounts / jobs | No | No |
> | accounts / models | No | No |
> | accounts / networks | No | No |
> | accounts / secrets | No | No |
> | accounts / storageContainers | No | No |
> | accounts / templatedModels | No | No |
> | images | No | No |
> | quotas | No | No |

## Microsoft.SoftwarePlan

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | hybridUseBenefits | No | No |
> | softwareSubscriptions | Yes | Yes |

## Microsoft.Solutions

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applicationDefinitions | Yes | Yes |
> | applications | Yes | Yes |
> | jitRequests | Yes | Yes |

## Microsoft.Sovereign

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | landingZoneAccounts | Yes | Yes |
> | landingZoneAccounts / landingZoneConfigurations | No | No |
> | landingZoneAccounts / landingZoneRegistrations | No | No |
> | landingZoneConfigurations | No | No |
> | landingZoneRegistrations | No | No |
> | transparencyLogs | No | No |

## Microsoft.Sql

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | instancePools | Yes | Yes |
> | managedInstances | Yes | Yes |
> | managedInstances / administrators | No | No |
> | managedInstances / advancedThreatProtectionSettings | No | No |
> | managedInstances / databases | Yes | No |
> | managedInstances / databases / advancedThreatProtectionSettings | No | No |
> | managedInstances / databases / backupLongTermRetentionPolicies | No | No |
> | managedInstances / databases / ledgerDigestUploads | No | No |
> | managedInstances / databases / vulnerabilityAssessments | No | No |
> | managedInstances / dnsAliases | No | No |
> | managedInstances / metricDefinitions | No | No |
> | managedInstances / metrics | No | No |
> | managedInstances / recoverableDatabases | No | No |
> | managedInstances / sqlAgent | No | No |
> | managedInstances / startStopSchedules | No | No |
> | managedInstances / tdeCertificates | No | No |
> | managedInstances / vulnerabilityAssessments | No | No |
> | servers | Yes | Yes |
> | servers / administrators | No | No |
> | servers / advancedThreatProtectionSettings | No | No |
> | servers / advisors | No | No |
> | servers / aggregatedDatabaseMetrics | No | No |
> | servers / auditingSettings | No | No |
> | servers / automaticTuning | No | No |
> | servers / communicationLinks | No | No |
> | servers / connectionPolicies | No | No |
> | servers / databases | Yes | Yes |
> | servers / databases / activate | No | No |
> | servers / databases / activatedatabase | No | No |
> | servers / databases / advancedThreatProtectionSettings | No | No |
> | servers / databases / advisors | No | No |
> | servers / databases / auditingSettings | No | No |
> | servers / databases / auditRecords | No | No |
> | servers / databases / automaticTuning | No | No |
> | servers / databases / backupLongTermRetentionPolicies | No | No |
> | servers / databases / backupShortTermRetentionPolicies | No | No |
> | servers / databases / databaseState | No | No |
> | servers / databases / dataMaskingPolicies | No | No |
> | servers / databases / dataMaskingPolicies / rules | No | No |
> | servers / databases / deactivate | No | No |
> | servers / databases / deactivatedatabase | No | No |
> | servers / databases / extensions | No | No |
> | servers / databases / geoBackupPolicies | No | No |
> | servers / databases / ledgerDigestUploads | No | No |
> | servers / databases / metricDefinitions | No | No |
> | servers / databases / metrics | No | No |
> | servers / databases / recommendedSensitivityLabels | No | No |
> | servers / databases / replicationLinks | No | No |
> | servers / databases / securityAlertPolicies | No | No |
> | servers / databases / sqlvulnerabilityassessments | No | No |
> | servers / databases / syncGroups | No | No |
> | servers / databases / syncGroups / syncMembers | No | No |
> | servers / databases / topQueries | No | No |
> | servers / databases / topQueries / queryText | No | No |
> | servers / databases / transparentDataEncryption | No | No |
> | servers / databases / VulnerabilityAssessment | No | No |
> | servers / databases / vulnerabilityAssessments | No | No |
> | servers / databases / VulnerabilityAssessmentScans | No | No |
> | servers / databases / VulnerabilityAssessmentSettings | No | No |
> | servers / databases / workloadGroups | No | No |
> | servers / databaseSecurityPolicies | No | No |
> | servers / devOpsAuditingSettings | No | No |
> | servers / disasterRecoveryConfiguration | No | No |
> | servers / dnsAliases | No | No |
> | servers / elasticPoolEstimates | No | No |
> | servers / elasticpools | Yes | Yes |
> | servers / elasticPools / advisors | No | No |
> | servers / elasticpools / metricdefinitions | No | No |
> | servers / elasticpools / metrics | No | No |
> | servers / encryptionProtector | No | No |
> | servers / extendedAuditingSettings | No | No |
> | servers / failoverGroups | No | No |
> | servers / failoverGroups / tryPlannedBeforeForcedFailover | No | No |
> | servers / import | No | No |
> | servers / jobAccounts | Yes | Yes |
> | servers / jobAgents | Yes | Yes |
> | servers / jobAgents / jobs | No | No |
> | servers / jobAgents / jobs / executions | No | No |
> | servers / jobAgents / jobs / steps | No | No |
> | servers / jobAgents / privateEndpoints | No | No |
> | servers / keys | No | No |
> | servers / recommendedElasticPools | No | No |
> | servers / recoverableDatabases | No | No |
> | servers / restorableDroppedDatabases | No | No |
> | servers / securityAlertPolicies | No | No |
> | servers / serviceObjectives | No | No |
> | servers / sqlvulnerabilityassessments | No | No |
> | servers / syncAgents | No | No |
> | servers / tdeCertificates | No | No |
> | servers / usages | No | No |
> | servers / virtualNetworkRules | No | No |
> | servers / vulnerabilityAssessments | No | No |
> | virtualClusters | No | No |

<a id="sqlnote"></a>

> [!NOTE]
> The Master database doesn't support tags, but other databases, including Azure Synapse Analytics databases, support tags. Azure Synapse Analytics databases must be in Active (not Paused) state.


## Microsoft.SqlVirtualMachine

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | SqlVirtualMachineGroups | Yes | Yes |
> | SqlVirtualMachines | Yes | Yes |

## Microsoft.StandbyPool

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | standbyContainerGroupPools | Yes | Yes |
> | standbyContainerGroupPools / runtimeViews | No | No |
> | standbyVirtualMachinePools | Yes | Yes |
> | standbyVirtualMachinePools / runtimeViews | No | No |
> | standbyVirtualMachinePools / standbyVirtualMachines | No | No |
> | standbyVirtualMachinePools / virtualMachines | No | No |

## Microsoft.Storage

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | deletedAccounts | No | No |
> | storageAccounts | Yes | Yes |
> | storageAccounts / blobServices | No | No |
> | storageAccounts / encryptionScopes | No | No |
> | storageAccounts / fileServices | No | No |
> | storageAccounts / queueServices | No | No |
> | storageAccounts / services | No | No |
> | storageAccounts / services / metricDefinitions | No | No |
> | storageAccounts / tableServices | No | No |
> | storageTasks | Yes | Yes |
> | usages | No | No |

## Microsoft.StorageActions

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | storageTasks | Yes | Yes |
> | storageTasks / reports | No | No |
> | storageTasks / storageTaskAssignments | No | No |

## Microsoft.StorageCache

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | amlFilesystems | Yes | Yes |
> | amlFilesystems / autoExportJobs | No | No |
> | amlFilesystems / autoImportJobs | No | No |
> | amlFilesystems / importJobs | No | No |
> | caches | Yes | Yes |
> | caches / storageTargets | No | No |
> | getRequiredAmlFSSubnetsSize | No | No |
> | usageModels | No | No |

## Microsoft.StorageMover

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | storageMovers | Yes | Yes |
> | storageMovers / agents | No | No |
> | storageMovers / endpoints | No | No |
> | storageMovers / projects | No | No |
> | storageMovers / projects / jobDefinitions | No | No |
> | storageMovers / projects / jobDefinitions / jobRuns | No | No |

## Microsoft.StorageSync

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | storageSyncServices | Yes | Yes |
> | storageSyncServices / registeredServers | No | No |
> | storageSyncServices / syncGroups | No | No |
> | storageSyncServices / syncGroups / cloudEndpoints | No | No |
> | storageSyncServices / syncGroups / serverEndpoints | No | No |
> | storageSyncServices / workflows | No | No |

## Microsoft.StorageTasks

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | storageTasks | Yes | Yes |

## Microsoft.StreamAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusters | Yes | Yes |
> | clusters / privateEndpoints | No | No |
> | streamingjobs | Yes | Yes |

> [!NOTE]
> You can't add a tag when streamingjobs is running. Stop the resource to add a tag.

## Microsoft.Subscription

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | acceptChangeTenant | No | No |
> | acceptOwnership | No | No |
> | acceptOwnershipStatus | No | No |
> | aliases | No | No |
> | cancel | No | No |
> | changeTenantRequest | No | No |
> | changeTenantStatus | No | No |
> | directories | No | No |
> | enable | No | No |
> | policies | No | No |
> | rename | No | No |
> | SubscriptionDefinitions | No | No |
> | subscriptions | No | No |
> | supportPlans | No | No |
> | validateCancel | No | No |

## microsoft.support

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | classifyServices | No | No |
> | fileWorkspaces | No | No |
> | fileWorkspaces / files | No | No |
> | lookUpResourceId | No | No |
> | services | No | No |
> | services / problemclassifications | No | No |
> | supporttickets | No | No |
> | supporttickets / communications | No | No |

## Microsoft.SustainabilityServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | calculations | Yes | Yes |

## Microsoft.Synapse

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | privateLinkHubs | Yes | Yes |
> | workspaces | Yes | Yes |
> | workspaces / bigDataPools | Yes | Yes |
> | workspaces / kustoPools | Yes | Yes |
> | workspaces / kustoPools / attacheddatabaseconfigurations | No | No |
> | workspaces / kustoPools / databases | No | No |
> | workspaces / kustoPools / databases / dataconnections | No | No |
> | workspaces / sqlDatabases | Yes | Yes |
> | workspaces / sqlPools | Yes | Yes |
> | workspaces / usages | Yes | Yes |

> [!NOTE]
> The Master database doesn't support tags, but other databases, including Azure Synapse Analytics databases, support tags. Azure Synapse Analytics databases must be in Active (not Paused) state.


## Microsoft.ToolchainOrchestrator

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | activations | Yes | Yes |
> | campaigns | Yes | Yes |
> | campaigns / versions | Yes | Yes |
> | catalogs | Yes | Yes |
> | catalogs / versions | Yes | Yes |
> | diagnostics | Yes | Yes |
> | instances | Yes | Yes |
> | instances / versions | Yes | Yes |
> | solutions | Yes | Yes |
> | solutions / versions | Yes | Yes |
> | targets | Yes | Yes |
> | targets / versions | Yes | Yes |

## Microsoft.UpdateManager

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | updaterules | Yes | Yes |

## Microsoft.UsageBilling

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |

## Microsoft.VerifiedId

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | Authorities | Yes | Yes |

## Microsoft.VideoIndexer

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / privateEndpointConnections | No | No |
> | accounts / privateLinkResources | No | No |

## Microsoft.VirtualMachineImages

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | imageTemplates | Yes | Yes |
> | imageTemplates / runOutputs | No | No |
> | imageTemplates / triggers | No | No |

## microsoft.visualstudio

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | account | Yes | Yes |
> | account / extension | Yes | Yes |
> | account / project | Yes | Yes |

## Microsoft.VMware

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | arczones | Yes | Yes |
> | resourcepools | Yes | Yes |
> | vcenters | Yes | Yes |
> | VCenters / InventoryItems | No | No |
> | virtualmachines | Yes | Yes |
> | virtualmachinetemplates | Yes | Yes |
> | virtualnetworks | Yes | Yes |

## Microsoft.VoiceServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | CommunicationsGateways | Yes | Yes |
> | CommunicationsGateways / Contacts | Yes | Yes |
> | CommunicationsGateways / TestLines | Yes | Yes |
> | OperatorVoicemailInstances | Yes | Yes |
> | registeredSubscriptions | No | No |

## Microsoft.Web

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | apiManagementAccounts | No | No |
> | apiManagementAccounts / apiAcls | No | No |
> | apiManagementAccounts / apis | No | No |
> | apiManagementAccounts / apis / apiAcls | No | No |
> | apiManagementAccounts / apis / connectionAcls | No | No |
> | apiManagementAccounts / apis / connections | No | No |
> | apiManagementAccounts / apis / connections / connectionAcls | No | No |
> | apiManagementAccounts / apis / localizedDefinitions | No | No |
> | apiManagementAccounts / connectionAcls | No | No |
> | apiManagementAccounts / connections | No | No |
> | aseregions | No | No |
> | billingMeters | No | No |
> | certificates | Yes | Yes |
> | connectionGateways | Yes | Yes |
> | connections | Yes | Yes |
> | containerApps | Yes | Yes |
> | customApis | Yes | Yes |
> | customhostnameSites | No | No |
> | deletedSites | No | No |
> | freeTrialStaticWebApps | No | No |
> | functionAppStacks | No | No |
> | generateGithubAccessTokenForAppserviceCLI | No | No |
> | hostingEnvironments | Yes | Yes |
> | hostingEnvironments / eventGridFilters | No | No |
> | hostingEnvironments / multiRolePools | No | No |
> | hostingEnvironments / workerPools | No | No |
> | kubeEnvironments | Yes | Yes |
> | publishingUsers | No | No |
> | recommendations | No | No |
> | resourceHealthMetadata | No | No |
> | runtimes | No | No |
> | serverFarms | Yes | Yes |
> | serverFarms / eventGridFilters | No | No |
> | serverFarms / firstPartyApps | No | No |
> | serverFarms / firstPartyApps / keyVaultSettings | No | No |
> | sites | Yes | Yes |
> | sites / certificates | No | No |
> | sites / eventGridFilters | No | No |
> | sites / hostNameBindings | No | No |
> | sites / networkConfig | No | No |
> | sites / premieraddons | Yes | Yes |
> | sites / slots | Yes | Yes |
> | sites / slots / certificates | No | No |
> | sites / slots / eventGridFilters | No | No |
> | sites / slots / hostNameBindings | No | No |
> | sites / slots / networkConfig | No | No |
> | sourceControls | No | No |
> | staticSiteRegions | No | No |
> | staticSites | Yes | Yes |
> | staticSites / builds | No | No |
> | staticSites / builds / databaseConnections | No | No |
> | staticSites / builds / linkedBackends | No | No |
> | staticSites / builds / userProvidedFunctionApps | No | No |
> | staticSites / databaseConnections | No | No |
> | staticSites / linkedBackends | No | No |
> | staticSites / userProvidedFunctionApps | No | No |
> | validate | No | No |
> | verifyHostingEnvironmentVnet | No | No |
> | webAppStacks | No | No |
> | workerApps | Yes | Yes |

## Microsoft.WeightsAndBiases

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | instances | Yes | Yes |
> | registeredSubscriptions | No | No |

## Microsoft.Windows365

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | CloudPcDelegatedMsis | Yes | Yes |

## Microsoft.WindowsPushNotificationServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | registrations | Yes | Yes |

## Microsoft.WorkloadBuilder

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | migrationAgents | Yes | Yes |
> | workloads | Yes | Yes |
> | workloads / instances | No | No |
> | workloads / versions | No | No |
> | workloads / versions / artifacts | No | No |

## Microsoft.Workloads

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | connectors | Yes | Yes |
> | connectors / acssBackups | Yes | Yes |
> | connectors / amsInsights | Yes | Yes |
> | connectors / sapVirtualInstanceMonitors | Yes | Yes |
> | epicVirtualInstances | Yes | Yes |
> | epicVirtualInstances / databaseInstances | Yes | Yes |
> | epicVirtualInstances / hyperspaceWebInstances | Yes | Yes |
> | epicVirtualInstances / presentationInstances | Yes | Yes |
> | epicVirtualInstances / sharedInstances | Yes | Yes |
> | epicVirtualInstances / wssInstances | Yes | Yes |
> | insights | Yes | Yes |
> | instanceGroupMonitors | Yes | Yes |
> | instanceHealthDefinitions | Yes | Yes |
> | instanceHealthDefinitions / signalDefinitions | No | No |
> | instanceMonitors | Yes | Yes |
> | monitors | Yes | Yes |
> | monitors / alerts | No | No |
> | monitors / alertTemplates | No | No |
> | monitors / db2JobConfigurations | No | No |
> | monitors / providerInstances | No | No |
> | monitors / sapLandscapeMonitor | No | No |
> | oracleVirtualInstances | Yes | Yes |
> | oracleVirtualInstances / databaseInstances | Yes | Yes |
> | phpWorkloads | Yes | Yes |
> | phpWorkloads / wordpressInstances | No | No |
> | sapDiscoverySites | Yes | Yes |
> | sapDiscoverySites / sapInstances | Yes | Yes |
> | sapDiscoverySites / sapInstances / serverInstances | No | No |
> | sapVirtualInstances | Yes | Yes |
> | sapVirtualInstances / applicationInstances | Yes | Yes |
> | sapVirtualInstances / centralInstances | Yes | Yes |
> | sapVirtualInstances / databaseInstances | Yes | Yes |
> | virtualInstances | Yes | Yes |
> | virtualInstances / components | Yes | Yes |

## Next steps

To learn how to apply tags to resources, see [Use tags to organize your Azure resources](tag-resources.md).
