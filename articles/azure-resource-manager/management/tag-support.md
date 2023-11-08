---
title: Tag support for resources
description: Shows which Azure resource types support tags. Provides details for all Azure services.
ms.topic: conceptual
ms.date: 10/20/2022
---

# Tag support for Azure resources

This article describes whether a resource type supports [tags](tag-resources.md). The column labeled **Supports tags** indicates whether the resource type has a property for the tag. The column labeled **Tag in cost report** indicates whether that resource type passes the tag to the cost report. You can view costs by tags in the [Cost Management cost analysis](../../cost-management-billing/costs/group-filter.md) and the [Azure billing invoice and daily usage data](../../cost-management-billing/manage/download-azure-invoice-daily-usage-date.md).

To get the same data as a file of comma-separated values, download [tag-support.csv](https://github.com/tfitzmac/resource-capabilities/blob/master/tag-support.csv).

## Microsoft.AAD

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | DomainServices | Yes | Yes |
> | DomainServices / oucontainer | No | No |

## microsoft.aadiam

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | azureADMetrics | Yes | Yes |
> | diagnosticSettings | No | No |
> | diagnosticSettingsCategories | No | No |
> | privateLinkForAzureAD | Yes | Yes |
> | tenants | Yes | Yes |

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
> | farmBeats / eventGridFilters | No | No |
> | farmBeats / extensions | No | No |
> | farmBeats / solutions | No | No |
> | farmBeatsExtensionDefinitions | No | No |
> | farmBeatsSolutionDefinitions | No | No |

## Microsoft.AlertsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | actionRules | Yes | Yes |
> | alerts | No | No |
> | alertsMetaData | No | No |
> | migrateFromSmartDetection | No | No |
> | smartDetectorAlertRules | Yes | Yes |
> | smartGroups | No | No |

## Microsoft.AnalysisServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | servers | Yes | Yes |

## Microsoft.AnyBuild

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusters | Yes | Yes |

## Microsoft.ApiManagement

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | deletedServices | No | No |
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
> | connectedEnvironments | Yes | Yes |
> | connectedEnvironments / certificates | Yes | Yes |
> | containerApps | Yes | Yes |
> | managedEnvironments | Yes | Yes |
> | managedEnvironments / certificates | Yes | Yes |

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
> | configurationStores / keyValues | No | No |
> | configurationStores / replicas | No | No |
> | deletedConfigurationStores | No | No |

## Microsoft.AppPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | runtimeVersions | No | No |
> | Spring | Yes | Yes |
> | Spring / apps | No | No |
> | Spring / apps / deployments | No | No |

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
> | classicAdministrators | No | No |
> | dataAliases | No | No |
> | dataPolicyManifests | No | No |
> | denyAssignments | No | No |
> | diagnosticSettings | No | No |
> | diagnosticSettingsCategories | No | No |
> | elevateAccess | No | No |
> | eligibleChildResources | No | No |
> | locks | No | No |
> | policyAssignments | No | No |
> | policyDefinitions | No | No |
> | policyExemptions | No | No |
> | policySetDefinitions | No | No |
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
> | roleManagementPolicies | No | No |
> | roleManagementPolicyAssignments | No | No |

## Microsoft.Automanage

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | bestPractices | No | No |
> | bestPractices / versions | No | No |
> | configurationProfileAssignmentIntents | No | No |
> | configurationProfileAssignments | No | No |
> | configurationProfilePreferences | Yes | Yes |
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

## Microsoft.AutonomousDevelopmentPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / datapools | No | No |
> | workspaces | Yes | Yes |
> | workspaces / eventgridfilters | No | No |

## Microsoft.AutonomousSystems

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | workspaces | Yes | Yes |
> | workspaces / validateCreateRequest | No | No |

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
> | privateClouds / globalReachConnections | No | No |
> | privateClouds / hcxEnterpriseSites | No | No |
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

## Microsoft.AzureActiveDirectory

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | b2cDirectories | Yes | No |
> | b2ctenants | No | No |
> | ciamDirectories | Yes | Yes |
> | guestUsages | Yes | Yes |

## Microsoft.AzureArcData

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | DataControllers | Yes | No |
> | DataControllers / ActiveDirectoryConnectors | No | No |
> | PostgresInstances | Yes | No |
> | SqlManagedInstances | Yes | No |
> | SqlServerInstances | Yes | No |
> | SqlServerInstances / Databases | Yes | No |
> | SqlServerInstances / AvailabilityGroups | Yes | No |

## Microsoft.AzureCIS

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | autopilotEnvironments | Yes | Yes |
> | dstsServiceAccounts | Yes | Yes |
> | dstsServiceClientIdentities | Yes | Yes |

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
> | catalogs / deployments | No | No |
> | catalogs / devices | No | No |
> | catalogs / images | No | No |
> | catalogs / products | No | No |
> | catalogs / products / devicegroups | No | No |

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
> | clusters / offers | No | No |
> | clusters / publishers | No | No |
> | clusters / publishers / offers | No | No |
> | clusters / updates | No | No |
> | clusters / updates / updateRuns | No | No |
> | clusters / updateSummaries | No | No |
> | galleryImages | Yes | Yes |
> | marketplaceGalleryImages | Yes | Yes |
> | networkinterfaces | Yes | Yes |
> | registeredSubscriptions | No | No |
> | storageContainers | Yes | Yes |
> | virtualharddisks | Yes | Yes |
> | virtualmachines | Yes | Yes |
> | virtualMachines / extensions | Yes | Yes |
> | virtualmachines / hybrididentitymetadata | No | No |
> | virtualnetworks | Yes | Yes |

## Microsoft.BackupSolutions

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | VMwareApplications | Yes | Yes |

## Microsoft.BareMetalInfrastructure

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | bareMetalInstances | Yes | Yes |

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
> | billingAccounts / agreements | No | No |
> | billingAccounts / appliedReservationOrders | No | No |
> | billingAccounts / associatedTenants | No | No |
> | billingAccounts / billingPermissions | No | No |
> | billingAccounts / billingProfiles | No | No |
> | billingAccounts / billingProfiles / billingPermissions | No | No |
> | billingAccounts / billingProfiles / billingRoleAssignments | No | No |
> | billingAccounts / billingProfiles / billingRoleDefinitions | No | No |
> | billingAccounts / billingProfiles / billingSubscriptions | No | No |
> | billingAccounts / billingProfiles / createBillingRoleAssignment | No | No |
> | billingAccounts / billingProfiles / customers | No | No |
> | billingAccounts / billingProfiles / instructions | No | No |
> | billingAccounts / billingProfiles / invoices | No | No |
> | billingAccounts / billingProfiles / invoices / pricesheet | No | No |
> | billingAccounts / billingProfiles / invoices / transactions | No | No |
> | billingAccounts / billingProfiles / invoiceSections | No | No |
> | billingAccounts / billingProfiles / invoiceSections / billingPermissions | No | No |
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
> | billingAccounts / billingProfiles / paymentMethodLinks | No | No |
> | billingAccounts / billingProfiles / paymentMethods | No | No |
> | billingAccounts / billingProfiles / policies | No | No |
> | billingAccounts / billingProfiles / pricesheet | No | No |
> | billingAccounts / billingProfiles / products | No | No |
> | billingAccounts / billingProfiles / reservations | No | No |
> | billingAccounts / billingProfiles / transactions | No | No |
> | billingAccounts / billingProfiles / validateDeleteBillingProfileEligibility | No | No |
> | billingAccounts / billingProfiles / validateDetachPaymentMethodEligibility | No | No |
> | billingAccounts / billingRoleAssignments | No | No |
> | billingAccounts / billingRoleDefinitions | No | No |
> | billingAccounts / billingSubscriptionAliases | No | No |
> | billingAccounts / billingSubscriptions | No | No |
> | billingAccounts / billingSubscriptions / elevateRole | No | No |
> | billingAccounts / billingSubscriptions / invoices | No | No |
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
> | billingAccounts / departments / billingPermissions | No | No |
> | billingAccounts / departments / billingRoleAssignments | No | No |
> | billingAccounts / departments / billingRoleDefinitions | No | No |
> | billingAccounts / departments / billingSubscriptions | No | No |
> | billingAccounts / departments / enrollmentAccounts | No | No |
> | billingAccounts / enrollmentAccounts | No | No |
> | billingAccounts / enrollmentAccounts / billingPermissions | No | No |
> | billingAccounts / enrollmentAccounts / billingRoleAssignments | No | No |
> | billingAccounts / enrollmentAccounts / billingRoleDefinitions | No | No |
> | billingAccounts / enrollmentAccounts / billingSubscriptions | No | No |
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
> | billingAccounts / lineOfCredit | No | No |
> | billingAccounts / notificationContacts | No | No |
> | billingAccounts / payableOverage | No | No |
> | billingAccounts / paymentMethods | No | No |
> | billingAccounts / payNow | No | No |
> | billingAccounts / permissionRequests | No | No |
> | billingAccounts / policies | No | No |
> | billingAccounts / products | No | No |
> | billingAccounts / promotionalCredits | No | No |
> | billingAccounts / reservationOrders | No | No |
> | billingAccounts / reservationOrders / reservations | No | No |
> | billingAccounts / reservations | No | No |
> | billingAccounts / savingsPlanOrders | No | No |
> | billingAccounts / savingsPlanOrders / savingsPlans | No | No |
> | billingAccounts / savingsPlans | No | No |
> | billingAccounts / transactions | No | No |
> | billingPeriods | No | No |
> | billingPermissions | No | No |
> | billingProperty | No | No |
> | billingRoleAssignments | No | No |
> | billingRoleDefinitions | No | No |
> | createBillingRoleAssignment | No | No |
> | departments | No | No |
> | enrollmentAccounts | No | No |
> | invoices | No | No |
> | paymentMethods | No | No |
> | permissionRequests | No | No |
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
> | calculateMigrationCost | No | No |
> | savingsPlanOrderAliases | No | No |
> | savingsPlanOrders | No | No |
> | savingsPlanOrders / savingsPlans | No | No |
> | savingsPlans | No | No |
> | validate | No | No |

## Microsoft.Bing

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
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

## Microsoft.Cache

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | Redis | Yes | Yes |
> | Redis / EventGridFilters | No | No |
> | Redis / privateEndpointConnectionProxies | No | No |
> | Redis / privateEndpointConnectionProxies / validate | No | No |
> | Redis / privateEndpointConnections | No | No |
> | Redis / privateLinkResources | No | No |
> | redisEnterprise | Yes | Yes |
> | redisEnterprise / databases | No | No |
> | RedisEnterprise / privateEndpointConnectionProxies | No | No |
> | RedisEnterprise / privateEndpointConnectionProxies / validate | No | No |
> | RedisEnterprise / privateEndpointConnections | No | No |
> | RedisEnterprise / privateLinkResources | No | No |

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
> | ownReservations | No | No |
> | placePurchaseOrder | No | No |
> | reservationOrders | No | No |
> | reservationOrders / calculateRefund | No | No |
> | reservationOrders / merge | No | No |
> | reservationOrders / reservations | No | No |
> | reservationOrders / reservations / revisions | No | No |
> | reservationOrders / return | No | No |
> | reservationOrders / split | No | No |
> | reservationOrders / swap | No | No |
> | reservations | No | No |
> | resourceProviders | No | No |
> | resources | No | No |
> | validateReservationOrder | No | No |

## Microsoft.Cascade

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | sites | Yes | Yes |

## Microsoft.Cdn

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | canMigrate | No | No |
> | CdnWebApplicationFirewallManagedRuleSets | No | No |
> | CdnWebApplicationFirewallPolicies | Yes | Yes |
> | edgenodes | No | No |
> | migrate | No | No |
> | profiles | Yes | No |
> | profiles / afdendpoints | Yes | Yes |
> | profiles / afdendpoints / routes | No | No |
> | profiles / customdomains | No | No |
> | profiles / endpoints | Yes | Yes |
> | profiles / endpoints / customdomains | No | No |
> | profiles / endpoints / origingroups | No | No |
> | profiles / endpoints / origins | No | No |
> | profiles / origingroups | No | No |
> | profiles / origingroups / origins | No | No |
> | profiles / policies | No | No |
> | profiles / rulesets | No | No |
> | profiles / rulesets / rules | No | No |
> | profiles / secrets | No | No |
> | profiles / securitypolicies | No | No |
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

## Microsoft.Chaos

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | artifactSetDefinitions | No | No |
> | artifactSetSnapshots | No | No |
> | experiments | Yes | Yes |
> | targets | No | No |

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

## Microsoft.CloudTest

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | hostedpools | Yes | Yes |
> | images | Yes | Yes |
> | pools | Yes | Yes |

## Microsoft.CodeSigning

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | codeSigningAccounts | Yes | Yes |
> | codeSigningAccounts / certificateProfiles | No | No |

## Microsoft.Codespaces

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | plans | Yes | No |
> | registeredSubscriptions | No | No |

## Microsoft.CognitiveServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / networkSecurityPerimeterAssociationProxies | No | No |
> | accounts / privateEndpointConnectionProxies | No | No |
> | accounts / privateEndpointConnections | No | No |
> | accounts / privateLinkResources | No | No |
> | deletedAccounts | No | No |

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
> | EmailServices | Yes | Yes |
> | EmailServices / Domains | Yes | Yes |
> | registeredSubscriptions | No | No |

## Microsoft.Compute

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | availabilitySets | Yes | Yes |
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
> | galleries / serviceArtifacts | Yes | Yes |
> | hostGroups | Yes | Yes |
> | hostGroups / hosts | Yes | Yes |
> | images | Yes | Yes |
> | proximityPlacementGroups | Yes | Yes |
> | restorePointCollections | Yes | Yes |
> | restorePointCollections / restorePoints | No | No |
> | restorePointCollections / restorePoints / diskRestorePoints | No | No |
> | sharedVMExtensions | Yes | Yes |
> | sharedVMExtensions / versions | Yes | Yes |
> | sharedVMImages | Yes | Yes |
> | sharedVMImages / versions | Yes | Yes |
> | snapshots | Yes | Yes |
> | sshPublicKeys | Yes | Yes |
> | virtualMachines | Yes | Yes |
> | virtualMachines / applications | Yes | Yes |
> | virtualMachines / extensions | Yes | Yes |
> | virtualMachines / metricDefinitions | No | No |
> | virtualMachines / runCommands | Yes | Yes |
> | virtualMachineScaleSets | Yes | Yes |
> | virtualMachineScaleSets / applications | No | No |
> | virtualMachineScaleSets / extensions | No | No |
> | virtualMachineScaleSets / networkInterfaces | No | No |
> | virtualMachineScaleSets / publicIPAddresses | No | No |
> | virtualMachineScaleSets / virtualMachines | No | No |
> | virtualMachineScaleSets / virtualMachines / extensions | No | No |
> | virtualMachineScaleSets / virtualMachines / networkInterfaces | No | No |

> [!NOTE]
> You can't add a tag to a virtual machine that has been marked as generalized. You mark a virtual machine as generalized with [Set-AzVm -Generalized](/powershell/module/Az.Compute/Set-AzVM) or [az vm generalize](/cli/azure/vm#az-vm-generalize).


## Microsoft.ConfidentialLedger

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | Ledgers | Yes | Yes |
> | ManagedCCF | Yes | Yes |

## Microsoft.Confluent

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | agreements | No | No |
> | organizations | Yes | Yes |
> | validations | No | No |

## Microsoft.ConnectedCache

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | CacheNodes | Yes | Yes |
> | enterpriseCustomers | Yes | Yes |
> | ispCustomers | Yes | Yes |
> | ispCustomers / ispCacheNodes | Yes | Yes |

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
> | virtualmachines | Yes | Yes |
> | VirtualMachines / AssessPatches | No | No |
> | virtualmachines / extensions | Yes | Yes |
> | virtualmachines / guestagents | No | No |
> | virtualmachines / hybrididentitymetadata | No | No |
> | VirtualMachines / InstallPatches | No | No |
> | VirtualMachines / UpgradeExtensions | No | No |
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
> | serviceAssociationLinks | No | No |

## Microsoft.ContainerRegistry

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | registries | Yes | Yes |
> | registries / agentPools | Yes | Yes |
> | registries / builds | No | No |
> | registries / builds / cancel | No | No |
> | registries / builds / getLogLink | No | No |
> | registries / buildTasks | Yes | Yes |
> | registries / buildTasks / steps | No | No |
> | registries / connectedRegistries | No | No |
> | registries / connectedRegistries / deactivate | No | No |
> | registries / eventGridFilters | No | No |
> | registries / exportPipelines | No | No |
> | registries / generateCredentials | No | No |
> | registries / getBuildSourceUploadUrl | No | No |
> | registries / GetCredentials | No | No |
> | registries / importImage | No | No |
> | registries / importPipelines | No | No |
> | registries / pipelineRuns | No | No |
> | registries / privateEndpointConnectionProxies | No | No |
> | registries / privateEndpointConnectionProxies / validate | No | No |
> | registries / privateEndpointConnections | No | No |
> | registries / privateLinkResources | No | No |
> | registries / queueBuild | No | No |
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
> | containerServices | Yes | Yes |
> | fleetMemberships | No | No |
> | fleets | Yes | Yes |
> | fleets / members | No | No |
> | managedClusters | Yes | Yes |
> | ManagedClusters / eventGridFilters | No | No |
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
> | CloudConnectors | No | No |
> | Connectors | Yes | Yes |
> | Departments | No | No |
> | Dimensions | No | No |
> | EnrollmentAccounts | No | No |
> | Exports | No | No |
> | ExternalBillingAccounts | No | No |
> | ExternalBillingAccounts / Alerts | No | No |
> | ExternalBillingAccounts / Dimensions | No | No |
> | ExternalBillingAccounts / Forecast | No | No |
> | ExternalBillingAccounts / Query | No | No |
> | ExternalSubscriptions | No | No |
> | ExternalSubscriptions / Alerts | No | No |
> | ExternalSubscriptions / Dimensions | No | No |
> | ExternalSubscriptions / Forecast | No | No |
> | ExternalSubscriptions / Query | No | No |
> | fetchMarketplacePrices | No | No |
> | fetchPrices | No | No |
> | Forecast | No | No |
> | GenerateCostDetailsReport | No | No |
> | GenerateDetailedCostReport | No | No |
> | Insights | No | No |
> | Pricesheets | No | No |
> | Publish | No | No |
> | Query | No | No |
> | register | No | No |
> | Reportconfigs | No | No |
> | Reports | No | No |
> | ScheduledActions | No | No |
> | Settings | No | No |
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
> | grafana | Yes | Yes |
> | grafana / privateEndpointConnections | No | No |
> | grafana / privateLinkResources | No | No |

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

## Microsoft.DataCatalog

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | catalogs | Yes | Yes |
> | datacatalogs | Yes | Yes |

## Microsoft.DataCollaboration

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | workspaces | Yes | Yes |
> | workspaces / constrainedResources | No | No |
> | workspaces / contracts | No | No |
> | workspaces / contracts / entitlements | No | No |
> | workspaces / dataAssets | No | No |
> | workspaces / dataAssets / dataSets | No | No |
> | workspaces / pipelineRuns | No | No |
> | workspaces / pipelineRuns / pipelineStepRuns | No | No |
> | workspaces / pipelines | No | No |
> | workspaces / pipelines / pipelineSteps | No | No |
> | workspaces / pipelines / runs | No | No |
> | workspaces / proposals | No | No |
> | workspaces / proposals / dataAssetReferences | No | No |
> | workspaces / proposals / entitlements | No | No |
> | workspaces / proposals / entitlements / constraints | No | No |
> | workspaces / proposals / entitlements / policies | No | No |
> | workspaces / proposals / invitations | No | No |
> | workspaces / proposals / scriptReferences | No | No |
> | workspaces / proposals / virtualOutputReferences | No | No |
> | workspaces / resourceReferences | No | No |
> | workspaces / scripts | No | No |
> | workspaces / scripts / scriptrevisions | No | No |

## Microsoft.Datadog

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | agreements | No | No |
> | monitors | Yes | Yes |
> | monitors / getDefaultKey | No | No |
> | monitors / refreshSetPasswordLink | No | No |
> | monitors / setDefaultKey | No | No |
> | monitors / singleSignOnConfigurations | No | No |
> | monitors / tagRules | No | No |
> | registeredSubscriptions | No | No |

## Microsoft.DataFactory

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | dataFactories | Yes | Yes |
> | dataFactories / diagnosticSettings | No | No |
> | dataFactories / metricDefinitions | No | No |
> | dataFactorySchema | No | No |
> | factories | Yes | Yes |
> | factories / integrationRuntimes | No | No |
> | factories / pipelines | No | No |

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
> | getPrivateDnsZoneSuffix | No | No |
> | serverGroups | Yes | Yes |
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
> | serversv2 | Yes | Yes |

## Microsoft.DelegatedNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | controller | Yes | Yes |
> | delegatedSubnets | Yes | Yes |
> | orchestrators | Yes | Yes |

## Microsoft.DeploymentManager

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | artifactSources | Yes | Yes |
> | rollouts | Yes | Yes |
> | serviceTopologies | Yes | Yes |
> | serviceTopologies / services | Yes | Yes |
> | serviceTopologies / services / serviceUnits | Yes | Yes |
> | steps | Yes | Yes |

## Microsoft.DesktopVirtualization

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applicationgroups | Yes | Yes |
> | applicationgroups / applications | No | No |
> | applicationgroups / desktops | No | No |
> | applicationgroups / startmenuitems | No | No |
> | hostpools | Yes | Yes |
> | hostpools / msixpackages | No | No |
> | hostpools / sessionhosts | No | No |
> | hostpools / sessionhosts / usersessions | No | No |
> | hostpools / usersessions | No | No |
> | scalingplans | Yes | Yes |
> | workspaces | Yes | Yes |

## Microsoft.DevAI

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | instances | Yes | Yes |
> | instances / experiments | Yes | Yes |
> | instances / sandboxes | Yes | Yes |
> | instances / sandboxes / experiments | Yes | Yes |

## Microsoft.DevCenter

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | devcenters | Yes | Yes |
> | devcenters / attachednetworks | No | No |
> | devcenters / catalogs | No | No |
> | devcenters / devboxdefinitions | Yes | Yes |
> | devcenters / environmentTypes | No | No |
> | devcenters / galleries | No | No |
> | devcenters / galleries / images | No | No |
> | devcenters / galleries / images / versions | No | No |
> | devcenters / images | No | No |
> | networkconnections | Yes | Yes |
> | projects | Yes | Yes |
> | projects / allowedEnvironmentTypes | No | No |
> | projects / attachednetworks | No | No |
> | projects / devboxdefinitions | No | No |
> | projects / environmentTypes | No | No |
> | projects / pools | Yes | Yes |
> | projects / pools / schedules | No | No |
> | registeredSubscriptions | No | No |

## Microsoft.DevHub

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | workflows | Yes | Yes |

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
> | accounts / instances | Yes | Yes |
> | accounts / privateEndpointConnectionProxies | No | No |
> | accounts / privateEndpointConnections | No | No |
> | accounts / privateLinkResources | No | No |
> | registeredSubscriptions | No | No |

## Microsoft.DevOps

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | pipelines | Yes | Yes |

## Microsoft.DevTestLab

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | labcenters | Yes | Yes |
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
> | digitalTwinsInstances / timeSeriesDatabaseConnections | No | No |

## Microsoft.DocumentDB

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | cassandraClusters | Yes | Yes |
> | databaseAccountNames | No | No |
> | databaseAccounts | Yes | Yes |
> | databaseAccounts / encryptionScopes | No | No |
> | restorableDatabaseAccounts | No | No |

## Microsoft.DomainRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | domains | Yes | Yes |
> | domains / domainOwnershipIdentifiers | No | No |
> | generateSsoRequest | No | No |
> | topLevelDomains | No | No |
> | validateDomainRegistrationInformation | No | No |

## Microsoft.EdgeOrder

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | addresses | Yes | Yes |
> | orderItems | Yes | Yes |
> | orders | No | No |
> | productFamiliesMetadata | No | No |

## Microsoft.Elastic

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | monitors | Yes | Yes |
> | monitors / tagRules | No | No |

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
> | namespaces / networkrulesets | No | No |
> | namespaces / privateEndpointConnections | No | No |

## Microsoft.Falcon

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | namespaces | Yes | Yes |

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

## Microsoft.Fidalgo

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | devcenters | Yes | Yes |
> | devcenters / attachednetworks | No | No |
> | devcenters / catalogs | No | No |
> | devcenters / catalogs / items | No | No |
> | devcenters / devboxdefinitions | Yes | Yes |
> | devcenters / environmentTypes | No | No |
> | devcenters / galleries | No | No |
> | devcenters / galleries / images | No | No |
> | devcenters / galleries / images / versions | No | No |
> | devcenters / images | No | No |
> | devcenters / mappings | No | No |
> | machinedefinitions | Yes | Yes |
> | networksettings | Yes | Yes |
> | projects | Yes | Yes |
> | projects / attachednetworks | No | No |
> | projects / catalogItems | No | No |
> | projects / devboxdefinitions | No | No |
> | projects / environments | Yes | Yes |
> | projects / environments / deployments | No | No |
> | projects / environmentTypes | No | No |
> | projects / pools | Yes | Yes |
> | registeredSubscriptions | No | No |

## Microsoft.FluidRelay

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | fluidRelayServers | Yes | Yes |
> | fluidRelayServers / fluidRelayContainers | No | No |

## Microsoft.Graph

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | AzureADApplication | Yes | Yes |
> | AzureADApplicationPrototype | Yes | Yes |
> | registeredSubscriptions | No | No |

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
> | sapMonitors | Yes | Yes |

## Microsoft.HardwareSecurityModules

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | dedicatedHSMs | Yes | Yes |

## Microsoft.HDInsight

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | clusterPools | Yes | Yes |
> | clusterPools / clusters | Yes | Yes |
> | clusterPools / clusters / instanceViews | No | No |
> | clusterPools / clusters / serviceConfigs | No | No |
> | clusterPools / clusters / sessionClusters | Yes | Yes |
> | clusterPools / clusters / sessionClusters / instanceViews | No | No |
> | clusterPools / clusters / sessionClusters / serviceConfigs | No | No |
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
> | services / iomtconnectors | No | No |
> | services / iomtconnectors / connections | No | No |
> | services / iomtconnectors / mappings | No | No |
> | services / privateEndpointConnectionProxies | No | No |
> | services / privateEndpointConnections | No | No |
> | services / privateLinkResources | No | No |
> | validateMedtechMappings | No | No |
> | workspaces | Yes | Yes |
> | workspaces / analyticsconnectors | Yes | Yes |
> | workspaces / dicomservices | Yes | Yes |
> | workspaces / eventGridFilters | No | No |
> | workspaces / fhirservices | Yes | Yes |
> | workspaces / iotconnectors | Yes | Yes |
> | workspaces / iotconnectors / destinations | No | No |
> | workspaces / iotconnectors / fhirdestinations | No | No |
> | workspaces / privateEndpointConnectionProxies | No | No |
> | workspaces / privateEndpointConnections | No | No |
> | workspaces / privateLinkResources | No | No |

## Microsoft.HpcWorkbench

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | instances | Yes | Yes |
> | instances / chambers | Yes | Yes |
> | instances / chambers / accessProfiles | Yes | Yes |
> | instances / chambers / fileRequests | No | No |
> | instances / chambers / files | No | No |
> | instances / chambers / workloads | Yes | Yes |
> | instances / consortiums | Yes | Yes |

## Microsoft.HybridCompute

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | machines | Yes | Yes |
> | machines / assessPatches | No | No |
> | machines / extensions | Yes | Yes |
> | machines / installPatches | No | No |
> | machines / privateLinkScopes | No | No |
> | privateLinkScopes | Yes | Yes |
> | privateLinkScopes / privateEndpointConnectionProxies | No | No |
> | privateLinkScopes / privateEndpointConnections | No | No |

## Microsoft.HybridConnectivity

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | endpoints | No | No |

## Microsoft.HybridContainerService

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | provisionedClusters | Yes | Yes |
> | provisionedClusters / agentPools | Yes | Yes |
> | provisionedClusters / hybridIdentityMetadata | No | No |
> | provisionedClusters / upgradeProfiles | No | No |
> | storageSpaces | Yes | Yes |
> | virtualNetworks | Yes | Yes |

## Microsoft.HybridData

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | dataManagers | Yes | Yes |

## Microsoft.HybridNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | configurationGroupValues | Yes | Yes |
> | devices | Yes | Yes |
> | networkFunctionPublishers | No | No |
> | networkFunctionPublishers / networkFunctionDefinitionGroups | No | No |
> | networkFunctionPublishers / networkFunctionDefinitionGroups / publisherNetworkFunctionDefinitionVersions | No | No |
> | networkfunctions | Yes | Yes |
> | networkFunctions / components | No | No |
> | networkFunctionVendors | No | No |
> | publishers | Yes | Yes |
> | publishers / artifactStores | Yes | Yes |
> | publishers / artifactStores / artifactManifests | Yes | Yes |
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

## Microsoft.ImportExport

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | jobs | Yes | Yes |

## microsoft.insights

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | actiongroups | Yes | Yes |
> | actiongroups / networkSecurityPerimeterAssociationProxies | No | No |
> | actiongroups / networkSecurityPerimeterConfigurations | No | No |
> | activityLogAlerts | Yes | Yes |
> | alertrules | Yes | Yes |
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
> | dataCollectionEndpoints | Yes | Yes |
> | dataCollectionEndpoints / networkSecurityPerimeterAssociationProxies | No | No |
> | dataCollectionEndpoints / networkSecurityPerimeterConfigurations | No | No |
> | dataCollectionEndpoints / scopedPrivateLinkProxies | No | No |
> | dataCollectionRuleAssociations | No | No |
> | dataCollectionRules | Yes | Yes |
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
> | metricalerts | Yes | Yes |
> | metricbaselines | No | No |
> | metricbatch | No | No |
> | metricDefinitions | No | No |
> | metricNamespaces | No | No |
> | metrics | No | No |
> | migratealertrules | No | No |
> | migrateToNewPricingModel | No | No |
> | monitoredObjects | No | No |
> | myWorkbooks | No | No |
> | notificationgroups | Yes | Yes |
> | notificationstatus | No | No |
> | privateLinkScopes | Yes | Yes |
> | privateLinkScopes / privateEndpointConnectionProxies | No | No |
> | privateLinkScopes / privateEndpointConnections | No | No |
> | privateLinkScopes / scopedResources | No | No |
> | rollbackToLegacyPricingModel | No | No |
> | scheduledqueryrules | Yes | Yes |
> | scheduledqueryrules / networkSecurityPerimeterAssociationProxies | No | No |
> | scheduledqueryrules / networkSecurityPerimeterConfigurations | No | No |
> | topology | No | No |
> | transactions | No | No |
> | webtests | Yes | Yes |
> | webtests / getTestResultFile | No | No |
> | workbooks | Yes | Yes |
> | workbooktemplates | Yes | Yes |

## Microsoft.IntelligentITDigitalTwin

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | digitalTwins | Yes | Yes |
> | digitalTwins / assets | Yes | Yes |
> | digitalTwins / executionPlans | Yes | Yes |
> | digitalTwins / testPlans | Yes | Yes |
> | digitalTwins / tests | Yes | Yes |

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
> | clusters / principalassignments | No | No |
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
> | loadtests | Yes | Yes |
> | loadtests / outboundNetworkDependenciesEndpoints | No | No |
> | registeredSubscriptions | No | No |

## Microsoft.Logic

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | hostingEnvironments | Yes | Yes |
> | integrationAccounts | Yes | Yes |
> | integrationServiceEnvironments | Yes | Yes |
> | integrationServiceEnvironments / managedApis | Yes | Yes |
> | isolatedEnvironments | Yes | Yes |
> | workflows | Yes | Yes |

## Microsoft.Logz

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | monitors | Yes | Yes |
> | monitors / accounts | Yes | Yes |
> | monitors / accounts / tagRules | No | No |
> | monitors / metricsSource | Yes | Yes |
> | monitors / metricsSource / tagRules | No | No |
> | monitors / singleSignOnConfigurations | No | No |
> | monitors / tagRules | No | No |
> | registeredSubscriptions | No | No |

## Microsoft.MachineLearning

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | commitmentPlans | Yes | Yes |
> | webServices | Yes | Yes |
> | Workspaces | Yes | Yes |

## Microsoft.MachineLearningServices

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | aisysteminventories | Yes | Yes |
> | registries | Yes | Yes |
> | registries / codes | No | No |
> | registries / codes / versions | No | No |
> | registries / components | No | No |
> | registries / components / versions | No | No |
> | registries / environments | No | No |
> | registries / environments / versions | No | No |
> | registries / models | No | No |
> | registries / models / versions | No | No |
> | virtualclusters | Yes | Yes |
> | workspaces | Yes | Yes |
> | workspaces / batchEndpoints | Yes | Yes |
> | workspaces / batchEndpoints / deployments | Yes | Yes |
> | workspaces / batchEndpoints / deployments / jobs | No | No |
> | workspaces / batchEndpoints / jobs | No | No |
> | workspaces / codes | No | No |
> | workspaces / codes / versions | No | No |
> | workspaces / components | No | No |
> | workspaces / components / versions | No | No |
> | workspaces / computes | No | No |
> | workspaces / data | No | No |
> | workspaces / data / versions | No | No |
> | workspaces / datasets | No | No |
> | workspaces / datastores | No | No |
> | workspaces / environments | No | No |
> | workspaces / environments / versions | No | No |
> | workspaces / eventGridFilters | No | No |
> | workspaces / jobs | No | No |
> | workspaces / labelingJobs | No | No |
> | workspaces / linkedServices | No | No |
> | workspaces / models | No | No |
> | workspaces / models / versions | No | No |
> | workspaces / onlineEndpoints | Yes | Yes |
> | workspaces / onlineEndpoints / deployments | Yes | Yes |
> | workspaces / schedules | No | No |
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
> | publicMaintenanceConfigurations | No | No |
> | updates | No | No |

## Microsoft.ManagedIdentity

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | Identities | No | No |
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
> | startTenantBackfill | No | No |
> | tenantBackfillStatus | No | No |

## Microsoft.Maps

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / creators | Yes | Yes |
> | accounts / eventGridFilters | No | No |

## Microsoft.Marketplace

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | macc | No | No |
> | offers | No | No |
> | offerTypes | No | No |
> | offerTypes / publishers | No | No |
> | offerTypes / publishers / offers | No | No |
> | offerTypes / publishers / offers / plans | No | No |
> | offerTypes / publishers / offers / plans / agreements | No | No |
> | offerTypes / publishers / offers / plans / configs | No | No |
> | offerTypes / publishers / offers / plans / configs / importImage | No | No |
> | privategalleryitems | No | No |
> | privateStoreClient | No | No |
> | privateStores | No | No |
> | privateStores / AdminRequestApprovals | No | No |
> | privateStores / anyExistingOffersInTheCollections | No | No |
> | privateStores / billingAccounts | No | No |
> | privateStores / bulkCollectionsAction | No | No |
> | privateStores / collections | No | No |
> | privateStores / collections / approveAllItems | No | No |
> | privateStores / collections / disableApproveAllItems | No | No |
> | privateStores / collections / offers | No | No |
> | privateStores / collections / offers / upsertOfferWithMultiContext | No | No |
> | privateStores / collections / transferOffers | No | No |
> | privateStores / collectionsToSubscriptionsMapping | No | No |
> | privateStores / fetchAllSubscriptionsInTenant | No | No |
> | privateStores / offers | No | No |
> | privateStores / offers / acknowledgeNotification | No | No |
> | privateStores / queryApprovedPlans | No | No |
> | privateStores / queryNotificationsState | No | No |
> | privateStores / queryOffers | No | No |
> | privateStores / queryUserOffers | No | No |
> | privateStores / RequestApprovals | No | No |
> | privateStores / requestApprovals / query | No | No |
> | privateStores / requestApprovals / withdrawPlan | No | No |
> | products | No | No |
> | publishers | No | No |
> | publishers / offers | No | No |
> | publishers / offers / amendments | No | No |
> | register | No | No |
> | search | No | No |

## Microsoft.MarketplaceNotifications

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | reviewsnotifications | No | No |

## Microsoft.MarketplaceOrdering

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | agreements | No | No |
> | offertypes | No | No |

## Microsoft.Media

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | mediaservices | Yes | Yes |
> | mediaservices / accountFilters | No | No |
> | mediaservices / assets | No | No |
> | mediaservices / assets / assetFilters | No | No |
> | mediaservices / assets / tracks | No | No |
> | mediaservices / contentKeyPolicies | No | No |
> | mediaservices / eventGridFilters | No | No |
> | mediaservices / graphInstances | No | No |
> | mediaservices / graphTopologies | No | No |
> | mediaservices / liveEvents | Yes | Yes |
> | mediaservices / liveEvents / liveOutputs | No | No |
> | mediaservices / mediaGraphs | No | No |
> | mediaservices / privateEndpointConnectionProxies | No | No |
> | mediaservices / privateEndpointConnections | No | No |
> | mediaservices / streamingEndpoints | Yes | Yes |
> | mediaservices / streamingLocators | No | No |
> | mediaservices / streamingPolicies | No | No |
> | mediaservices / transforms | No | No |
> | mediaservices / transforms / jobs | No | No |
> | videoAnalyzers | Yes | Yes |
> | videoAnalyzers / accessPolicies | No | No |
> | videoAnalyzers / edgeModules | No | No |
> | videoAnalyzers / livePipelines | No | No |
> | videoAnalyzers / pipelineJobs | No | No |
> | videoAnalyzers / pipelineTopologies | No | No |
> | videoAnalyzers / videos | No | No |

## Microsoft.Migrate

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | assessmentProjects | Yes | Yes |
> | migrateprojects | Yes | Yes |
> | modernizeProjects | Yes | Yes |
> | moveCollections | Yes | Yes |
> | projects | Yes | Yes |

## Microsoft.MixedReality

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | objectAnchorsAccounts | Yes | Yes |
> | objectUnderstandingAccounts | Yes | Yes |
> | remoteRenderingAccounts | Yes | Yes |
> | spatialAnchorsAccounts | Yes | Yes |

## Microsoft.MobileNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | mobileNetworks | Yes | Yes |
> | mobileNetworks / dataNetworks | Yes | Yes |
> | mobileNetworks / services | Yes | Yes |
> | mobileNetworks / simPolicies | Yes | Yes |
> | mobileNetworks / sites | Yes | Yes |
> | mobileNetworks / slices | Yes | Yes |
> | packetCoreControlPlanes | Yes | Yes |
> | packetCoreControlPlanes / packetCoreDataPlanes | Yes | Yes |
> | packetCoreControlPlanes / packetCoreDataPlanes / attachedDataNetworks | Yes | Yes |
> | packetCoreControlPlaneVersions | No | No |
> | simGroups | Yes | Yes |
> | simGroups / sims | No | No |
> | sims | Yes | Yes |

## Microsoft.Monitor

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |

## Microsoft.NetApp

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | netAppAccounts | Yes | No |
> | netAppAccounts / accountBackups | No | No |
> | netAppAccounts / backupPolicies | Yes | Yes |
> | netAppAccounts / capacityPools | Yes | Yes |
> | netAppAccounts / capacityPools / volumes | Yes | No |
> | netAppAccounts / capacityPools / volumes / backups | No | No |
> | netAppAccounts / capacityPools / volumes / mountTargets | No | No |
> | netAppAccounts / capacityPools / volumes / snapshots | No | No |
> | netAppAccounts / capacityPools / volumes / subvolumes | No | No |
> | netAppAccounts / capacityPools / volumes / volumeQuotaRules | No | No |
> | netAppAccounts / snapshotPolicies | Yes | Yes |
> | netAppAccounts / vaults | No | No |
> | netAppAccounts / volumeGroups | No | No |

## Microsoft.Network

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applicationGateways | Yes | Yes |
> | applicationGatewayWebApplicationFirewallPolicies | Yes | Yes |
> | applicationSecurityGroups | Yes | Yes |
> | azureFirewallFqdnTags | No | No |
> | azureFirewalls | Yes | No |
> | azureWebCategories | No | No |
> | bastionHosts | Yes | Yes |
> | bgpServiceCommunities | No | No |
> | cloudServiceSlots | No | No |
> | connections | Yes | Yes |
> | customIpPrefixes | Yes | Yes |
> | ddosCustomPolicies | Yes | Yes |
> | ddosProtectionPlans | Yes | Yes |
> | dnsForwardingRulesets | Yes | Yes |
> | dnsForwardingRulesets / forwardingRules | No | No |
> | dnsForwardingRulesets / virtualNetworkLinks | No | No |
> | dnsResolvers | Yes | Yes |
> | dnsResolvers / inboundEndpoints | Yes | Yes |
> | dnsResolvers / outboundEndpoints | Yes | Yes |
> | dnszones | Yes | Yes |
> | dnszones / A | No | No |
> | dnszones / AAAA | No | No |
> | dnszones / all | No | No |
> | dnszones / CAA | No | No |
> | dnszones / CNAME | No | No |
> | dnszones / MX | No | No |
> | dnszones / NS | No | No |
> | dnszones / PTR | No | No |
> | dnszones / recordsets | No | No |
> | dnszones / SOA | No | No |
> | dnszones / SRV | No | No |
> | dnszones / TXT | No | No |
> | dscpConfigurations | Yes | Yes |
> | expressRouteCircuits | Yes | Yes |
> | expressRouteCrossConnections | Yes | Yes |
> | expressRouteGateways | Yes | Yes |
> | expressRoutePorts | Yes | Yes |
> | expressRouteProviderPorts | No | No |
> | expressRouteServiceProviders | No | No |
> | firewallPolicies | Yes, see [note below](#network-limitations) | Yes |
> | firewallPolicies / ruleCollectionGroups | No | No |
> | frontdoors | Yes, but limited (see [note below](#network-limitations)) | Yes |
> | frontdoors / frontendEndpoints | Yes, but limited (see [note below](#network-limitations)) | No |
> | frontdoors / frontendEndpoints / customHttpsConfiguration | Yes, but limited (see [note below](#network-limitations)) | No |
> | frontdoorWebApplicationFirewallManagedRuleSets | Yes, but limited (see [note below](#network-limitations)) | No |
> | frontdoorWebApplicationFirewallPolicies | Yes, but limited (see [note below](#network-limitations)) | Yes |
> | getDnsResourceReference | No | No |
> | internalNotify | No | No |
> | internalPublicIpAddresses | No | No |
> | ipGroups | Yes | Yes |
> | loadBalancers | Yes | Yes |
> | loadBalancers / backendAddressPools | No | No |
> | localNetworkGateways | Yes | Yes |
> | natGateways | Yes | Yes |
> | networkExperimentProfiles | Yes | Yes |
> | networkIntentPolicies | Yes | Yes |
> | networkInterfaces | Yes | Yes |
> | networkManagerConnections | No | No |
> | networkManagers | Yes | Yes |
> | networkProfiles | Yes | Yes |
> | networkSecurityGroups | Yes | Yes |
> | networkSecurityGroups / securityRules | No | No |
> | networkSecurityPerimeters | Yes | Yes |
> | networkVirtualAppliances | Yes | Yes |
> | networkWatchers | Yes | Yes |
> | networkWatchers / connectionMonitors | Yes | No |
> | networkWatchers / flowLogs | Yes | Yes |
> | networkWatchers / lenses | Yes | No |
> | networkWatchers / pingMeshes | Yes | No |
> | p2sVpnGateways | Yes | Yes |
> | privateDnsZones | Yes | Yes |
> | privateDnsZones / A | No | No |
> | privateDnsZones / AAAA | No | No |
> | privateDnsZones / all | No | No |
> | privateDnsZones / CNAME | No | No |
> | privateDnsZones / MX | No | No |
> | privateDnsZones / PTR | No | No |
> | privateDnsZones / SOA | No | No |
> | privateDnsZones / SRV | No | No |
> | privateDnsZones / TXT | No | No |
> | privateDnsZones / virtualNetworkLinks | Yes | Yes |
> | privateDnsZonesInternal | No | No |
> | privateEndpointRedirectMaps | Yes | Yes |
> | privateEndpoints | Yes | Yes |
> | privateEndpoints / privateLinkServiceProxies | No | No |
> | privateLinkServices | Yes | Yes |
> | publicIPAddresses | Yes | Yes |
> | publicIPPrefixes | Yes | Yes |
> | routeFilters | Yes | Yes |
> | routeTables | Yes | Yes |
> | routeTables / routes | No | No |
> | securityPartnerProviders | Yes | Yes |
> | serviceEndpointPolicies | Yes | Yes |
> | trafficManagerGeographicHierarchies | No | No |
> | trafficmanagerprofiles | Yes, see [note below](#network-limitations) | Yes |
> | trafficmanagerprofiles / azureendpoints | No | No |
> | trafficmanagerprofiles / externalendpoints | No | No |
> | trafficmanagerprofiles / heatMaps | No | No |
> | trafficmanagerprofiles / nestedendpoints | No | No |
> | trafficManagerUserMetricsKeys | No | No |
> | virtualHubs | Yes | Yes |
> | virtualNetworkGateways | Yes | Yes |
> | virtualNetworks | Yes | Yes |
> | virtualNetworks / privateDnsZoneLinks | No | No |
> | virtualNetworks / subnets | No | No |
> | virtualNetworks / taggedTrafficConsumers | No | No |
> | virtualNetworkTaps | Yes | Yes |
> | virtualRouters | Yes | Yes |
> | virtualWans | Yes | Yes |
> | vpnGateways | Yes | Yes |
> | vpnServerConfigurations | Yes | Yes |
> | vpnSites | Yes | Yes |

<a id="network-limitations"></a>

> [!NOTE]
> For Azure Front Door Service, you can apply tags when creating the resource, but updating or adding tags is not currently supported. Front Door doesn't support the use of # or : in the tag name.
> 
> Azure DNS zones and Traffic Manager doesn't support the use of spaces in the tag or a tag that starts with a number. Azure DNS and Traffic Manager tag names do not support special and unicode characters. The value can contain all characters.
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
> | clusters / admissions | No | No |
> | defaultCniNetworks | Yes | Yes |
> | disks | Yes | Yes |
> | hybridAksClusters | Yes | Yes |
> | hybridAksManagementDomains | Yes | Yes |
> | hybridAksVirtualMachines | Yes | Yes |
> | l2Networks | Yes | Yes |
> | l3Networks | Yes | Yes |
> | rackManifests | Yes | Yes |
> | racks | Yes | Yes |
> | storageAppliances | Yes | Yes |
> | trunkedNetworks | Yes | Yes |
> | virtualMachines | Yes | Yes |
> | workloadNetworks | Yes | Yes |

## Microsoft.NetworkFunction

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | azureTrafficCollectors | Yes | Yes |
> | azureTrafficCollectors / collectorPolicies | Yes | Yes |
> | meshVpns | Yes | Yes |
> | meshVpns / connectionPolicies | Yes | Yes |
> | meshVpns / privateEndpointConnectionProxies | No | No |
> | meshVpns / privateEndpointConnections | No | No |

## Microsoft.NotificationHubs

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | namespaces | Yes | No |
> | namespaces / notificationHubs | Yes | No |

## Microsoft.ObjectStore

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | osNamespaces | Yes | Yes |

## Microsoft.OffAzure

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | HyperVSites | Yes | Yes |
> | ImportSites | Yes | Yes |
> | MasterSites | Yes | Yes |
> | ServerSites | Yes | Yes |
> | VMwareSites | Yes | Yes |

## Microsoft.OpenEnergyPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | energyServices | Yes | Yes |
> | energyServices / privateEndpointConnectionProxies | No | No |
> | energyServices / privateEndpointConnections | No | No |
> | energyServices / privateLinkResources | No | No |

## Microsoft.OpenLogisticsPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applicationManagers | Yes | Yes |
> | applicationManagers / applicationRegistrations | No | No |
> | applicationManagers / eventGridFilters | No | No |
> | applicationRegistrationInvites | No | No |
> | applicationWorkspaces | Yes | Yes |
> | applicationWorkspaces / applications | No | No |
> | applicationWorkspaces / applications / applicationRegistrationInvites | No | No |
> | shareInvites | No | No |
> | workspaces | Yes | Yes |
> | workspaces / applicationRegistrations | No | No |
> | workspaces / applications | No | No |
> | workspaces / eventGridFilters | No | No |
> | workspaces / shares | No | No |
> | workspaces / shareSubscriptions | No | No |

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
> | workspaces / dataExports | No | No |
> | workspaces / dataSources | No | No |
> | workspaces / linkedServices | No | No |
> | workspaces / linkedStorageAccounts | No | No |
> | workspaces / metadata | No | No |
> | workspaces / networkSecurityPerimeterAssociationProxies | No | No |
> | workspaces / networkSecurityPerimeterConfigurations | No | No |
> | workspaces / query | No | No |
> | workspaces / scopedPrivateLinkProxies | No | No |
> | workspaces / storageInsightConfigs | No | No |
> | workspaces / tables | No | No |

## Microsoft.Orbital

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | contactProfiles | Yes | Yes |
> | edgeSites | Yes | Yes |
> | globalCommunicationsSites | No | No |
> | groundStations | Yes | Yes |
> | l2Connections | Yes | Yes |
> | l3Connections | Yes | Yes |
> | orbitalGateways | Yes | Yes |
> | spacecrafts | Yes | Yes |
> | spacecrafts / contacts | No | No |

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
> | pkis / enrollmentPolicies | Yes | Yes |

## Microsoft.PlayFab

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | playerAccountPools | Yes | Yes |
> | titles | Yes | Yes |
> | titles / automationRules | No | No |
> | titles / segments | No | No |
> | titles / titleDataSets | No | No |
> | titles / titleInternalDataKeyValues | No | No |
> | titles / titleInternalDataSets | No | No |

## Microsoft.PolicyInsights

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | attestations | No | No |
> | componentPolicyStates | No | No |
> | eventGridFilters | No | No |
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

## Microsoft.ProviderHub

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | providerRegistrations | No | No |
> | providerRegistrations / customRollouts | No | No |
> | providerRegistrations / defaultRollouts | No | No |
> | providerRegistrations / resourceActions | No | No |
> | providerRegistrations / resourceTypeRegistrations | No | No |

## Microsoft.Purview

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |
> | accounts / kafkaConfigurations | No | No |
> | getDefaultAccount | No | No |
> | removeDefaultAccount | No | No |
> | setDefaultAccount | No | No |

## Microsoft.Quantum

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | Workspaces | Yes | Yes |

## Microsoft.Quota

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
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

## Microsoft.RedHatOpenShift

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | OpenShiftClusters | Yes | Yes |

## Microsoft.Relay

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | namespaces | Yes | Yes |
> | namespaces / authorizationrules | No | No |
> | namespaces / hybridconnections | No | No |
> | namespaces / hybridconnections / authorizationrules | No | No |
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

## Microsoft.Resources

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | deployments | Yes | No |
> | deploymentScripts | Yes | Yes |
> | deploymentScripts / logs | No | No |
> | deploymentStacks / snapshots | No | No |
> | links | No | No |
> | resourceGroups | Yes | No |
> | snapshots | No | No |
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

## Microsoft.Scom

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | managedInstances | Yes | Yes |

## Microsoft.ScVmm

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | AvailabilitySets | Yes | Yes |
> | Clouds | Yes | Yes |
> | VirtualMachines | Yes | Yes |
> | VirtualMachines / HybridIdentityMetadata | No | No |
> | VirtualMachineTemplates | Yes | Yes |
> | VirtualNetworks | Yes | Yes |
> | VMMServers | Yes | Yes |
> | VMMServers / InventoryItems | No | No |

## Microsoft.Search

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | resourceHealthMetadata | No | No |
> | searchServices | Yes | Yes |

## Microsoft.Security

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | adaptiveNetworkHardenings | No | No |
> | advancedThreatProtectionSettings | No | No |
> | alerts | No | No |
> | alertsSuppressionRules | No | No |
> | allowedConnections | No | No |
> | antiMalwareSettings | No | No |
> | applications | No | No |
> | assessmentMetadata | No | No |
> | assessments | No | No |
> | assessments / governanceAssignments | No | No |
> | assignments | Yes | Yes |
> | attackPaths | No | No |
> | autoDismissAlertsRules | No | No |
> | automations | Yes | Yes |
> | AutoProvisioningSettings | No | No |
> | Compliances | No | No |
> | connectedContainerRegistries | No | No |
> | connectors | No | No |
> | customAssessmentAutomations | Yes | Yes |
> | customEntityStoreAssignments | Yes | Yes |
> | dataCollectionAgents | No | No |
> | dataScanners | Yes | Yes |
> | dataSensitivitySettings | No | No |
> | deviceSecurityGroups | No | No |
> | discoveredSecuritySolutions | No | No |
> | externalSecuritySolutions | No | No |
> | governanceRules | No | No |
> | InformationProtectionPolicies | No | No |
> | ingestionSettings | No | No |
> | insights | No | No |
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
> | query | No | No |
> | regulatoryComplianceStandards | No | No |
> | regulatoryComplianceStandards / regulatoryComplianceControls | No | No |
> | regulatoryComplianceStandards / regulatoryComplianceControls / regulatoryComplianceAssessments | No | No |
> | secureScoreControlDefinitions | No | No |
> | secureScoreControls | No | No |
> | secureScores | No | No |
> | secureScores / secureScoreControls | No | No |
> | securityConnectors | Yes | Yes |
> | securityContacts | No | No |
> | securitySolutions | No | No |
> | securitySolutionsReferenceData | No | No |
> | securityStatuses | No | No |
> | securityStatusesSummaries | No | No |
> | serverVulnerabilityAssessments | No | No |
> | serverVulnerabilityAssessmentsSettings | No | No |
> | settings | No | No |
> | sqlVulnerabilityAssessments | No | No |
> | standards | Yes | Yes |
> | subAssessments | No | No |
> | tasks | No | No |
> | topologies | No | No |
> | vmScanners | No | No |
> | workspaceSettings | No | No |

## Microsoft.SecurityDetonation

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | chambers | Yes | Yes |

## Microsoft.SecurityDevOps

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | azureDevOpsConnectors | Yes | Yes |
> | azureDevOpsConnectors / orgs | No | No |
> | azureDevOpsConnectors / orgs / projects | No | No |
> | azureDevOpsConnectors / orgs / projects / repos | No | No |
> | azureDevOpsConnectors / repos | No | No |
> | azureDevOpsConnectors / stats | No | No |
> | gitHubConnectors | Yes | Yes |
> | gitHubConnectors / gitHubRepos | No | No |
> | gitHubConnectors / owners | No | No |
> | gitHubConnectors / owners / repos | No | No |
> | gitHubConnectors / repos | No | No |
> | gitHubConnectors / stats | No | No |

## Microsoft.SecurityInsights

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | aggregations | No | No |
> | alertRules | No | No |
> | alertRuleTemplates | No | No |
> | automationRules | No | No |
> | bookmarks | No | No |
> | cases | No | No |
> | contentPackages | No | No |
> | contentTemplates | No | No |
> | dataConnectorDefinitions | No | No |
> | dataConnectors | No | No |
> | enrichment | No | No |
> | entities | No | No |
> | entityQueryTemplates | No | No |
> | fileImports | No | No |
> | huntsessions | No | No |
> | incidents | No | No |
> | metadata | No | No |
> | MitreCoverageRecords | No | No |
> | onboardingStates | No | No |
> | overview | No | No |
> | recommendations | No | No |
> | securityMLAnalyticsSettings | No | No |
> | settings | No | No |
> | sourceControls | No | No |
> | threatIntelligence | No | No |

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
> | namespaces / networkrulesets | No | No |
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
> | edgeclusters | Yes | Yes |
> | edgeclusters / applications | No | No |
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
> | dryruns | No | No |
> | linkers | No | No |

## Microsoft.ServicesHub

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | connectors | Yes | Yes |
> | supportOfferingEntitlement | No | No |
> | workspaces | No | No |

## Microsoft.SignalRService

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | SignalR | Yes | Yes |
> | SignalR / eventGridFilters | No | No |
> | WebPubSub | Yes | Yes |

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
> | accounts / storageContainers | No | No |
> | images | No | No |
> | quotas | No | No |

## Microsoft.SoftwarePlan

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | hybridUseBenefits | No | No |

## Microsoft.Solutions

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | applicationDefinitions | Yes | Yes |
> | applications | Yes | Yes |
> | jitRequests | Yes | Yes |

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
> | managedInstances / databases / LongTermRetentionBackups | No | No |
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
> | servers / databases / LongTermRetentionBackups | No | No |
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
> | servers / import | No | No |
> | servers / jobAccounts | Yes | Yes |
> | servers / jobAgents | Yes | Yes |
> | servers / jobAgents / jobs | No | No |
> | servers / jobAgents / jobs / executions | No | No |
> | servers / jobAgents / jobs / steps | No | No |
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

## Microsoft.Storage

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | dataMovers | Yes | Yes |
> | dataMovers / agents | No | No |
> | dataMovers / endpoints | No | No |
> | dataMovers / projects | No | No |
> | dataMovers / projects / jobDefinitions | No | No |
> | dataMovers / projects / jobDefinitions / jobRuns | No | No |
> | deletedAccounts | No | No |
> | storageAccounts | Yes | Yes |
> | storageAccounts / blobServices | No | No |
> | storageAccounts / encryptionScopes | No | No |
> | storageAccounts / fileServices | No | No |
> | storageAccounts / queueServices | No | No |
> | storageAccounts / services | No | No |
> | storageAccounts / services / metricDefinitions | No | No |
> | storageAccounts / storageTaskAssignments | No | No |
> | storageAccounts / tableServices | No | No |
> | storageTasks | Yes | Yes |
> | usages | No | No |

## Microsoft.StorageCache

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | amlFilesystems | Yes | Yes |
> | caches | Yes | Yes |
> | caches / storageTargets | No | No |
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

## Microsoft.StoragePool

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | diskPools | Yes | Yes |
> | diskPools / iscsiTargets | No | No |

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

## Microsoft.StorSimple

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | managers | Yes | Yes |

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
> | enable | No | No |
> | policies | No | No |
> | rename | No | No |
> | SubscriptionDefinitions | No | No |
> | subscriptions | No | No |

## microsoft.support

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | lookUpResourceId | No | No |
> | services | No | No |
> | services / problemclassifications | No | No |
> | supporttickets | No | No |

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

> [!NOTE]
> The Master database doesn't support tags, but other databases, including Azure Synapse Analytics databases, support tags. Azure Synapse Analytics databases must be in Active (not Paused) state.


## Microsoft.TestBase

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | testBaseAccounts | Yes | Yes |
> | testBaseAccounts / customerEvents | No | No |
> | testBaseAccounts / emailEvents | No | No |
> | testBaseAccounts / externalTestTools | No | No |
> | testBaseAccounts / externalTestTools / testCases | No | No |
> | testBaseAccounts / featureUpdateSupportedOses | No | No |
> | testBaseAccounts / firstPartyApps | No | No |
> | testBaseAccounts / flightingRings | No | No |
> | testBaseAccounts / packages | Yes | Yes |
> | testBaseAccounts / packages / favoriteProcesses | No | No |
> | testBaseAccounts / packages / osUpdates | No | No |
> | testBaseAccounts / testSummaries | No | No |
> | testBaseAccounts / testTypes | No | No |
> | testBaseAccounts / usages | No | No |

## Microsoft.TimeSeriesInsights

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | environments | Yes | No |
> | environments / accessPolicies | No | No |
> | environments / eventsources | Yes | No |
> | environments / privateEndpointConnectionProxies | No | No |
> | environments / privateEndpointConnections | No | No |
> | environments / privateLinkResources | No | No |
> | environments / referenceDataSets | Yes | No |

## Microsoft.UsageBilling

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |

## Microsoft.VideoIndexer

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | Yes |

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

## Microsoft.VMwareCloudSimple

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | dedicatedCloudNodes | Yes | Yes |
> | dedicatedCloudServices | Yes | Yes |
> | virtualMachines | Yes | Yes |

## Microsoft.VSOnline

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | accounts | Yes | No |
> | plans | Yes | No |
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
> | billingMeters | No | No |
> | certificates | Yes | Yes |
> | connectionGateways | Yes | Yes |
> | connections | Yes | Yes |
> | containerApps | Yes | Yes |
> | customApis | Yes | Yes |
> | customhostnameSites | No | No |
> | deletedSites | No | No |
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
> | sites / eventGridFilters | No | No |
> | sites / hostNameBindings | No | No |
> | sites / networkConfig | No | No |
> | sites / premieraddons | Yes | Yes |
> | sites / slots | Yes | Yes |
> | sites / slots / eventGridFilters | No | No |
> | sites / slots / hostNameBindings | No | No |
> | sites / slots / networkConfig | No | No |
> | sourceControls | No | No |
> | staticSites | Yes | Yes |
> | staticSites / builds | No | No |
> | staticSites / builds / linkedBackends | No | No |
> | staticSites / builds / userProvidedFunctionApps | No | No |
> | staticSites / linkedBackends | No | No |
> | staticSites / userProvidedFunctionApps | No | No |
> | validate | No | No |
> | verifyHostingEnvironmentVnet | No | No |
> | webAppStacks | No | No |
> | workerApps | Yes | Yes |

## Microsoft.WindowsESU

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | multipleActivationKeys | Yes | Yes |

## Microsoft.WindowsIoT

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | DeviceServices | Yes | Yes |

## Microsoft.WorkloadBuilder

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | migrationAgents | Yes | Yes |
> | workloads | Yes | Yes |
> | workloads / instances | No | No |
> | workloads / versions | No | No |
> | workloads / versions / artifacts | No | No |

## Microsoft.WorkloadMonitor

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | monitors | No | No |

## Microsoft.Workloads

> [!div class="mx-tableFixed"]
> | Resource type | Supports tags | Tag in cost report |
> | ------------- | ----------- | ----------- |
> | monitors | Yes | Yes |
> | monitors / providerInstances | No | No |
> | phpWorkloads | Yes | Yes |
> | phpWorkloads / wordpressInstances | No | No |
> | sapVirtualInstances | Yes | Yes |
> | sapVirtualInstances / applicationInstances | Yes | Yes |
> | sapVirtualInstances / centralInstances | Yes | Yes |
> | sapVirtualInstances / databaseInstances | Yes | Yes |

## Next steps

To learn how to apply tags to resources, see [Use tags to organize your Azure resources](tag-resources.md).

