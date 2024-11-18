---
title: Extension resource types
description: Lists the Azure resource types are used to extend the capabilities of other resource types.
ms.topic: conceptual
ms.date: 07/24/2024
---

# Resource types that extend capabilities of other resources

An extension resource is a resource that adds to another resource's capabilities. For example, resource lock is an extension resource. You apply a resource lock to another resource to prevent it from being deleted or modified. It doesn't make sense to create a resource lock by itself. An extension resource is always applied to another resource.

## Microsoft.Advisor

* advisorScore
* configurations
* predict
* recommendations
* suppressions

## Microsoft.AlertsManagement

* alertRuleRecommendations
* alerts
* investigations
* tenantActivityLogAlerts

## Microsoft.App

* functions
* logicApps

## Microsoft.Authorization

* accessReviewHistoryDefinitions
* denyAssignments
* eligibleChildResources
* locks
* policyAssignments
* policyDefinitions
* policyExemptions
* policySetDefinitions
* privateLinkAssociations
* roleAssignmentApprovals
* roleAssignments
* roleAssignmentScheduleInstances
* roleAssignmentScheduleRequests
* roleAssignmentSchedules
* roleDefinitions
* roleEligibilityScheduleInstances
* roleEligibilityScheduleRequests
* roleEligibilitySchedules
* roleManagementAlertConfigurations
* roleManagementAlertDefinitions
* roleManagementAlerts
* roleManagementPolicies
* roleManagementPolicyAssignments

## Microsoft.Automanage

* configurationProfileAssignments

## Microsoft.AwsConnector

* ec2Instances

## Microsoft.AzureStackHCI

* edgeDevices
* virtualMachineInstances

## Microsoft.Billing

* billingPeriods
* billingPermissions
* billingRoleAssignments
* billingRoleDefinitions
* createBillingRoleAssignment

## Microsoft.Blueprint

* blueprintAssignments
* blueprints

## Microsoft.ChangeAnalysis

* changes
* changeSnapshots
* computeChanges

## Microsoft.Chaos

* targets

## Microsoft.ConnectedVMwarevSphere

* virtualmachineinstances

## Microsoft.Consumption

* AggregatedCost
* Balances
* Budgets
* Charges
* CostTags
* credits
* events
* Forecasts
* lots
* Marketplaces
* Pricesheets
* products
* ReservationDetails
* ReservationRecommendationDetails
* ReservationRecommendations
* ReservationSummaries
* ReservationTransactions

## Microsoft.ContainerInstance

* serviceAssociationLinks

## Microsoft.ContainerService

* fleetMemberships

## Microsoft.CostManagement

* Alerts
* BenefitRecommendations
* BenefitUtilizationSummaries
* Budgets
* CalculateCost
* Dimensions
* Exports
* ExternalSubscriptions
* Forecast
* GenerateBenefitUtilizationSummariesReport
* GenerateCostDetailsReport
* GenerateDetailedCostReport
* Insights
* MarkupRules
* Pricesheets
* Publish
* Query
* Reportconfigs
* Reports
* ScheduledActions
* SendMessage
* Settings
* StartConversation
* Views

## Microsoft.CustomProviders

* associations

## Microsoft.DataMigration

* DatabaseMigrations

## Microsoft.DataProtection

* backupInstances

## Microsoft.Edge

* connectivityStatuses
* Sites
* updates

## Microsoft.EdgeMarketplace

* offers
* publishers

## Microsoft.EventGrid

* eventSubscriptions
* extensionTopics

## Microsoft.GuestConfiguration

* guestConfigurationAssignments

## Microsoft.Help

* diagnostics
* discoverySolutions
* plugins
* simplifiedSolutions
* solutions
* troubleshooters

## Microsoft.HybridCompute

* networkConfigurations
* settings

## Microsoft.HybridConnectivity

* endpoints
* solutionConfigurations

## Microsoft.HybridContainerService

* kubernetesVersions
* provisionedClusterInstances

## microsoft.insights

* dataCollectionRuleAssociations
* diagnosticSettings
* diagnosticSettingsCategories
* eventtypes
* extendedDiagnosticSettings
* guestDiagnosticSettingsAssociation
* logDefinitions
* logs
* metricbaselines
* metricDefinitions
* metricNamespaces
* metrics
* tenantactiongroups
* topology
* transactions

## Microsoft.IoTSecurity

* sensors
* sites

## Microsoft.KubernetesConfiguration

* extensions
* extensionTypes
* fluxConfigurations
* namespaces
* sourceControlConfigurations

## Microsoft.KubernetesRuntime

* bgpPeers
* loadBalancers
* services
* storageClasses

## Microsoft.LoadTestService

* loadTestMappings
* loadTestProfileMappings

## Microsoft.Maintenance

* applyUpdates
* configurationAssignments
* scheduledevents
* updates

## Microsoft.ManagedIdentity

* Identities

## Microsoft.ManagedServices

* registrationAssignments
* registrationDefinitions

## Microsoft.Management

* managementGroups

## Microsoft.Marketplace

* products

## Microsoft.Monitor

* investigations

## Microsoft.Network

* cloudServiceNetworkInterfaces
* cloudServicePublicIPAddresses
* cloudServiceSlots

## Microsoft.OperationalInsights

* storageInsightConfigs

## Microsoft.PolicyInsights

* attestations
* componentPolicyStates
* eventGridFilters
* policyEvents
* policyStates
* policyTrackedResources
* remediations

## Microsoft.Purview

* consents
* policies

## Microsoft.Quota

* groupQuotas
* quotaRequests
* quotas
* usages

## Microsoft.RecoveryServices

* backupProtectedItems

## Microsoft.ResourceHealth

* childResources
* events
* impactedResources

## Microsoft.ResourceNotifications

* eventGridFilters

## Microsoft.Resources

* links
* tags

## Microsoft.ScVmm

* VirtualMachineInstances

## Microsoft.Security

* adaptiveNetworkHardenings
* advancedThreatProtectionSettings
* apiCollections
* applications
* assessmentMetadata
* assessments
* Compliances
* customRecommendations
* dataCollectionAgents
* defenderForStorageSettings
* deviceSecurityGroups
* governanceRules
* healthReports
* InformationProtectionPolicies
* integrations
* jitPolicies
* pricings
* secureScoreControls
* secureScores
* securityStandards
* serverVulnerabilityAssessments
* sqlVulnerabilityAssessments
* standardAssignments
* trustedIps

## Microsoft.SecurityInsights

* aggregations
* alertRules
* alertRuleTemplates
* automationRules
* billingStatistics
* bookmarks
* businessApplicationAgents
* cases
* contentPackages
* contentProductPackages
* contentProductTemplates
* contentTemplates
* contenttranslators
* dataConnectorDefinitions
* dataConnectors
* enrichment
* enrichmentWidgets
* entities
* entityQueryTemplates
* exportConnections
* fileImports
* hunts
* huntsessions
* incidents
* metadata
* MitreCoverageRecords
* onboardingStates
* overview
* recommendations
* securityMLAnalyticsSettings
* settings
* sourceControls
* threatIntelligence
* triggeredAnalyticsRuleRuns
* workspaceManagerAssignments
* workspaceManagerConfigurations
* workspaceManagerGroups
* workspaceManagerMembers

## Microsoft.SerialConsole

* serialPorts

## Microsoft.ServiceLinker

* daprConfigurations
* dryruns
* linkers

## Microsoft.SoftwarePlan

* hybridUseBenefits

## Microsoft.Subscription

* aliases
* policies

## microsoft.support

* supporttickets

## Next steps

- To get the resource ID for an extension resource in an Azure Resource Manager template, use the [extensionResourceId](../templates/template-functions-resource.md#extensionresourceid).
- For an example of creating an extension resource in a template, see [Event Grid Event Subscriptions](/azure/templates/microsoft.eventgrid/2019-06-01/eventsubscriptions).
