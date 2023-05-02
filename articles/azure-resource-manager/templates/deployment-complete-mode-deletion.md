---
title: Complete mode deletion
description: Shows how resource types handle complete mode deletion in Azure Resource Manager templates.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 10/20/2022
---

# Deletion of Azure resources for complete mode deployments

This article describes how resource types handle deletion when not in a template that is deployed in complete mode.

The resource types marked with **Yes** are deleted when the type isn't in the template deployed with complete mode.

The resource types marked with **No** aren't automatically deleted when not in the template; however, they're deleted if the parent resource is deleted. For a full description of the behavior, see [Azure Resource Manager deployment modes](deployment-modes.md).

If you deploy to [more than one resource group in a template](./deploy-to-resource-group.md), resources in the resource group specified in the deployment operation are eligible to be deleted. Resources in the secondary resource groups aren't deleted.

The resources are listed by resource provider namespace. To match a resource provider namespace with its Azure service name, see [Resource providers for Azure services](../management/azure-services-resource-providers.md).

> [!NOTE]
> Always use the [what-if operation](deploy-what-if.md) before deploying a template in complete mode. What-if shows you which resources will be created, deleted, or modified. Use what-if to avoid unintentionally deleting resources.


## Microsoft.AAD

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | DomainServices | Yes |
> | DomainServices / oucontainer | No |

## microsoft.aadiam

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | azureADMetrics | Yes |
> | diagnosticSettings | No |
> | diagnosticSettingsCategories | No |
> | privateLinkForAzureAD | Yes |
> | tenants | Yes |

## Microsoft.ADHybridHealthService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | aadsupportcases | No |
> | addsservices | No |
> | agents | No |
> | anonymousapiusers | No |
> | configuration | No |
> | logs | No |
> | reports | No |
> | servicehealthmetrics | No |
> | services | No |

## Microsoft.Advisor

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | advisorScore | No |
> | configurations | No |
> | generateRecommendations | No |
> | metadata | No |
> | predict | No |
> | recommendations | No |
> | suppressions | No |

## Microsoft.AgFoodPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | farmBeats | Yes |
> | farmBeats / eventGridFilters | No |
> | farmBeats / extensions | No |
> | farmBeats / solutions | No |
> | farmBeatsExtensionDefinitions | No |
> | farmBeatsSolutionDefinitions | No |

## Microsoft.AlertsManagement

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | actionRules | Yes |
> | alerts | No |
> | alertsMetaData | No |
> | migrateFromSmartDetection | No |
> | smartDetectorAlertRules | Yes |
> | smartGroups | No |

## Microsoft.AnalysisServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | servers | Yes |

## Microsoft.AnyBuild

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |

## Microsoft.ApiManagement

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | deletedServices | No |
> | getDomainOwnershipIdentifier | No |
> | reportFeedback | No |
> | service | Yes |
> | service / eventGridFilters | No |
> | validateServiceName | No |

## Microsoft.App

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | connectedEnvironments | Yes |
> | connectedEnvironments / certificates | Yes |
> | containerApps | Yes |
> | managedEnvironments | Yes |
> | managedEnvironments / certificates | Yes |

## Microsoft.AppAssessment

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | migrateProjects | Yes |
> | migrateProjects / assessments | No |
> | migrateProjects / assessments / assessedApplications | No |
> | migrateProjects / assessments / assessedApplications / machines | No |
> | migrateProjects / assessments / assessedMachines | No |
> | migrateProjects / assessments / assessedMachines / applications | No |
> | migrateProjects / assessments / machinesToAssess | No |
> | migrateProjects / sites | No |
> | migrateProjects / sites / applianceConfigurations | No |
> | migrateProjects / sites / machines | No |

## Microsoft.AppConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | configurationStores | Yes |
> | configurationStores / eventGridFilters | No |
> | configurationStores / keyValues | No |
> | configurationStores / replicas | No |
> | deletedConfigurationStores | No |

## Microsoft.AppPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | runtimeVersions | No |
> | Spring | Yes |
> | Spring / apps | No |
> | Spring / apps / deployments | No |

## Microsoft.Attestation

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | attestationProviders | Yes |
> | defaultProviders | No |

## Microsoft.Authorization

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accessReviewHistoryDefinitions | No |
> | classicAdministrators | No |
> | dataAliases | No |
> | dataPolicyManifests | No |
> | denyAssignments | No |
> | diagnosticSettings | No |
> | diagnosticSettingsCategories | No |
> | elevateAccess | No |
> | eligibleChildResources | No |
> | locks | No |
> | policyAssignments | No |
> | policyDefinitions | No |
> | policyExemptions | No |
> | policySetDefinitions | No |
> | privateLinkAssociations | No |
> | resourceManagementPrivateLinks | Yes |
> | roleAssignmentApprovals | No |
> | roleAssignments | No |
> | roleAssignmentScheduleInstances | No |
> | roleAssignmentScheduleRequests | No |
> | roleAssignmentSchedules | No |
> | roleDefinitions | No |
> | roleEligibilityScheduleInstances | No |
> | roleEligibilityScheduleRequests | No |
> | roleEligibilitySchedules | No |
> | roleManagementPolicies | No |
> | roleManagementPolicyAssignments | No |

## Microsoft.Automanage

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | bestPractices | No |
> | bestPractices / versions | No |
> | configurationProfileAssignmentIntents | No |
> | configurationProfileAssignments | No |
> | configurationProfilePreferences | Yes |
> | configurationProfiles | Yes |
> | configurationProfiles / versions | Yes |
> | patchJobConfigurations | Yes |
> | patchJobConfigurations / patchJobs | No |
> | patchSchedules | Yes |
> | patchSchedules / associations | Yes |
> | patchTiers | Yes |
> | servicePrincipals | No |

## Microsoft.Automation

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | automationAccounts | Yes |
> | automationAccounts / agentRegistrationInformation | No |
> | automationAccounts / configurations | Yes |
> | automationAccounts / hybridRunbookWorkerGroups | No |
> | automationAccounts / hybridRunbookWorkerGroups / hybridRunbookWorkers | No |
> | automationAccounts / jobs | No |
> | automationAccounts / privateEndpointConnectionProxies | No |
> | automationAccounts / privateEndpointConnections | No |
> | automationAccounts / privateLinkResources | No |
> | automationAccounts / runbooks | Yes |
> | automationAccounts / runtimes | Yes |
> | automationAccounts / softwareUpdateConfigurationMachineRuns | No |
> | automationAccounts / softwareUpdateConfigurationRuns | No |
> | automationAccounts / softwareUpdateConfigurations | No |
> | automationAccounts / webhooks | No |
> | deletedAutomationAccounts | No |

## Microsoft.AutonomousDevelopmentPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts / datapools | No |
> | workspaces | Yes |
> | workspaces / eventgridfilters | No |

## Microsoft.AutonomousSystems

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | workspaces | Yes |
> | workspaces / validateCreateRequest | No |

## Microsoft.AVS

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | privateClouds | Yes |
> | privateClouds / addons | No |
> | privateClouds / authorizations | No |
> | privateClouds / cloudLinks | No |
> | privateClouds / clusters | No |
> | privateClouds / clusters / datastores | No |
> | privateClouds / clusters / placementPolicies | No |
> | privateClouds / clusters / virtualMachines | No |
> | privateClouds / globalReachConnections | No |
> | privateClouds / hcxEnterpriseSites | No |
> | privateClouds / scriptExecutions | No |
> | privateClouds / scriptPackages | No |
> | privateClouds / scriptPackages / scriptCmdlets | No |
> | privateClouds / workloadNetworks | No |
> | privateClouds / workloadNetworks / dhcpConfigurations | No |
> | privateClouds / workloadNetworks / dnsServices | No |
> | privateClouds / workloadNetworks / dnsZones | No |
> | privateClouds / workloadNetworks / gateways | No |
> | privateClouds / workloadNetworks / portMirroringProfiles | No |
> | privateClouds / workloadNetworks / publicIPs | No |
> | privateClouds / workloadNetworks / segments | No |
> | privateClouds / workloadNetworks / virtualMachines | No |
> | privateClouds / workloadNetworks / vmGroups | No |

## Microsoft.AzureActiveDirectory

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | b2cDirectories | Yes |
> | b2ctenants | No |
> | ciamDirectories | Yes |
> | guestUsages | Yes |

## Microsoft.AzureArcData

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | DataControllers | Yes |
> | DataControllers / ActiveDirectoryConnectors | No |
> | PostgresInstances | Yes |
> | SqlManagedInstances | Yes |
> | SqlServerInstances | Yes |
> | SqlServerInstances / Databases | Yes |

## Microsoft.AzureCIS

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | autopilotEnvironments | Yes |
> | dstsServiceAccounts | Yes |
> | dstsServiceClientIdentities | Yes |

## Microsoft.AzureData

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | sqlServerRegistrations | Yes |
> | sqlServerRegistrations / sqlServers | No |

## Microsoft.AzureScan

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | scanningAccounts | Yes |

## Microsoft.AzureSphere

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | catalogs | Yes |
> | catalogs / certificates | No |
> | catalogs / deployments | No |
> | catalogs / devices | No |
> | catalogs / images | No |
> | catalogs / products | No |
> | catalogs / products / devicegroups | No |

## Microsoft.AzureStack

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | cloudManifestFiles | No |
> | generateDeploymentLicense | No |
> | linkedSubscriptions | Yes |
> | registrations | Yes |
> | registrations / customerSubscriptions | No |
> | registrations / products | No |

## Microsoft.AzureStackHCI

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |
> | clusters / arcSettings | No |
> | clusters / arcSettings / extensions | No |
> | clusters / offers | No |
> | clusters / publishers | No |
> | clusters / publishers / offers | No |
> | clusters / updates | No |
> | clusters / updates / updateRuns | No |
> | clusters / updateSummaries | No |
> | galleryImages | Yes |
> | marketplaceGalleryImages | Yes |
> | networkinterfaces | Yes |
> | registeredSubscriptions | No |
> | storageContainers | Yes |
> | virtualharddisks | Yes |
> | virtualmachines | Yes |
> | virtualMachines / extensions | Yes |
> | virtualmachines / hybrididentitymetadata | No |
> | virtualnetworks | Yes |

## Microsoft.BackupSolutions

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | VMwareApplications | Yes |

## Microsoft.BareMetalInfrastructure

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | bareMetalInstances | Yes |

## Microsoft.Batch

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | batchAccounts | Yes |
> | batchAccounts / certificates | No |
> | batchAccounts / detectors | No |
> | batchAccounts / pools | No |

## Microsoft.Billing

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | billingAccounts | No |
> | billingAccounts / agreements | No |
> | billingAccounts / appliedReservationOrders | No |
> | billingAccounts / associatedTenants | No |
> | billingAccounts / billingPermissions | No |
> | billingAccounts / billingProfiles | No |
> | billingAccounts / billingProfiles / billingPermissions | No |
> | billingAccounts / billingProfiles / billingRoleAssignments | No |
> | billingAccounts / billingProfiles / billingRoleDefinitions | No |
> | billingAccounts / billingProfiles / billingSubscriptions | No |
> | billingAccounts / billingProfiles / createBillingRoleAssignment | No |
> | billingAccounts / billingProfiles / customers | No |
> | billingAccounts / billingProfiles / instructions | No |
> | billingAccounts / billingProfiles / invoices | No |
> | billingAccounts / billingProfiles / invoices / pricesheet | No |
> | billingAccounts / billingProfiles / invoices / transactions | No |
> | billingAccounts / billingProfiles / invoiceSections | No |
> | billingAccounts / billingProfiles / invoiceSections / billingPermissions | No |
> | billingAccounts / billingProfiles / invoiceSections / billingRoleAssignments | No |
> | billingAccounts / billingProfiles / invoiceSections / billingRoleDefinitions | No |
> | billingAccounts / billingProfiles / invoiceSections / billingSubscriptions | No |
> | billingAccounts / billingProfiles / invoiceSections / createBillingRoleAssignment | No |
> | billingAccounts / billingProfiles / invoiceSections / initiateTransfer | No |
> | billingAccounts / billingProfiles / invoiceSections / products | No |
> | billingAccounts / billingProfiles / invoiceSections / products / transfer | No |
> | billingAccounts / billingProfiles / invoiceSections / products / updateAutoRenew | No |
> | billingAccounts / billingProfiles / invoiceSections / transactions | No |
> | billingAccounts / billingProfiles / invoiceSections / transfers | No |
> | billingAccounts / billingProfiles / invoiceSections / validateDeleteInvoiceSectionEligibility | No |
> | billingAccounts / billingProfiles / paymentMethodLinks | No |
> | billingAccounts / billingProfiles / paymentMethods | No |
> | billingAccounts / billingProfiles / policies | No |
> | billingAccounts / billingProfiles / pricesheet | No |
> | billingAccounts / billingProfiles / products | No |
> | billingAccounts / billingProfiles / reservations | No |
> | billingAccounts / billingProfiles / transactions | No |
> | billingAccounts / billingProfiles / validateDeleteBillingProfileEligibility | No |
> | billingAccounts / billingProfiles / validateDetachPaymentMethodEligibility | No |
> | billingAccounts / billingRoleAssignments | No |
> | billingAccounts / billingRoleDefinitions | No |
> | billingAccounts / billingSubscriptionAliases | No |
> | billingAccounts / billingSubscriptions | No |
> | billingAccounts / billingSubscriptions / elevateRole | No |
> | billingAccounts / billingSubscriptions / invoices | No |
> | billingAccounts / createBillingRoleAssignment | No |
> | billingAccounts / customers | No |
> | billingAccounts / customers / billingPermissions | No |
> | billingAccounts / customers / billingRoleAssignments | No |
> | billingAccounts / customers / billingRoleDefinitions | No |
> | billingAccounts / customers / billingSubscriptions | No |
> | billingAccounts / customers / createBillingRoleAssignment | No |
> | billingAccounts / customers / initiateTransfer | No |
> | billingAccounts / customers / policies | No |
> | billingAccounts / customers / products | No |
> | billingAccounts / customers / transactions | No |
> | billingAccounts / customers / transfers | No |
> | billingAccounts / customers / transferSupportedAccounts | No |
> | billingAccounts / departments | No |
> | billingAccounts / departments / billingPermissions | No |
> | billingAccounts / departments / billingRoleAssignments | No |
> | billingAccounts / departments / billingRoleDefinitions | No |
> | billingAccounts / departments / billingSubscriptions | No |
> | billingAccounts / departments / enrollmentAccounts | No |
> | billingAccounts / enrollmentAccounts | No |
> | billingAccounts / enrollmentAccounts / billingPermissions | No |
> | billingAccounts / enrollmentAccounts / billingRoleAssignments | No |
> | billingAccounts / enrollmentAccounts / billingRoleDefinitions | No |
> | billingAccounts / enrollmentAccounts / billingSubscriptions | No |
> | billingAccounts / invoices | No |
> | billingAccounts / invoices / summary | No |
> | billingAccounts / invoices / transactions | No |
> | billingAccounts / invoices / transactionSummary | No |
> | billingAccounts / invoiceSections | No |
> | billingAccounts / invoiceSections / billingSubscriptions | No |
> | billingAccounts / invoiceSections / billingSubscriptions / transfer | No |
> | billingAccounts / invoiceSections / elevate | No |
> | billingAccounts / invoiceSections / initiateTransfer | No |
> | billingAccounts / invoiceSections / products | No |
> | billingAccounts / invoiceSections / products / transfer | No |
> | billingAccounts / invoiceSections / products / updateAutoRenew | No |
> | billingAccounts / invoiceSections / transactions | No |
> | billingAccounts / invoiceSections / transfers | No |
> | billingAccounts / lineOfCredit | No |
> | billingAccounts / notificationContacts | No |
> | billingAccounts / payableOverage | No |
> | billingAccounts / paymentMethods | No |
> | billingAccounts / payNow | No |
> | billingAccounts / permissionRequests | No |
> | billingAccounts / policies | No |
> | billingAccounts / products | No |
> | billingAccounts / promotionalCredits | No |
> | billingAccounts / reservationOrders | No |
> | billingAccounts / reservationOrders / reservations | No |
> | billingAccounts / reservations | No |
> | billingAccounts / savingsPlanOrders | No |
> | billingAccounts / savingsPlanOrders / savingsPlans | No |
> | billingAccounts / savingsPlans | No |
> | billingAccounts / transactions | No |
> | billingPeriods | No |
> | billingPermissions | No |
> | billingProperty | No |
> | billingRoleAssignments | No |
> | billingRoleDefinitions | No |
> | createBillingRoleAssignment | No |
> | departments | No |
> | enrollmentAccounts | No |
> | invoices | No |
> | paymentMethods | No |
> | permissionRequests | No |
> | promotionalCredits | No |
> | promotions | No |
> | transfers | No |
> | transfers / acceptTransfer | No |
> | transfers / declineTransfer | No |
> | transfers / validateTransfer | No |
> | validateAddress | No |

## Microsoft.BillingBenefits

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | calculateMigrationCost | No |
> | savingsPlanOrderAliases | No |
> | savingsPlanOrders | No |
> | savingsPlanOrders / savingsPlans | No |
> | savingsPlans | No |
> | validate | No |

## Microsoft.Bing

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts / usages | No |
> | registeredSubscriptions | No |

## Microsoft.BlockchainTokens

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | TokenServices | Yes |
> | TokenServices / BlockchainNetworks | No |
> | TokenServices / Groups | No |
> | TokenServices / Groups / Accounts | No |
> | TokenServices / TokenTemplates | No |

## Microsoft.Blueprint

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | blueprintAssignments | No |
> | blueprints | No |
> | blueprints / artifacts | No |
> | blueprints / versions | No |
> | blueprints / versions / artifacts | No |

## Microsoft.BotService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | botServices | Yes |
> | botServices / channels | No |
> | botServices / connections | No |
> | botServices / privateEndpointConnectionProxies | No |
> | botServices / privateEndpointConnections | No |
> | botServices / privateLinkResources | No |
> | hostSettings | No |
> | languages | No |
> | templates | No |

## Microsoft.Cache

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | Redis | Yes |
> | Redis / EventGridFilters | No |
> | Redis / privateEndpointConnectionProxies | No |
> | Redis / privateEndpointConnectionProxies / validate | No |
> | Redis / privateEndpointConnections | No |
> | Redis / privateLinkResources | No |
> | redisEnterprise | Yes |
> | redisEnterprise / databases | No |
> | RedisEnterprise / privateEndpointConnectionProxies | No |
> | RedisEnterprise / privateEndpointConnectionProxies / validate | No |
> | RedisEnterprise / privateEndpointConnections | No |
> | RedisEnterprise / privateLinkResources | No |

## Microsoft.Capacity

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | appliedReservations | No |
> | autoQuotaIncrease | No |
> | calculateExchange | No |
> | calculatePrice | No |
> | calculatePurchasePrice | No |
> | catalogs | No |
> | commercialReservationOrders | No |
> | exchange | No |
> | ownReservations | No |
> | placePurchaseOrder | No |
> | reservationOrders | No |
> | reservationOrders / calculateRefund | No |
> | reservationOrders / merge | No |
> | reservationOrders / reservations | No |
> | reservationOrders / reservations / revisions | No |
> | reservationOrders / return | No |
> | reservationOrders / split | No |
> | reservationOrders / swap | No |
> | reservations | No |
> | resourceProviders | No |
> | resources | No |
> | validateReservationOrder | No |

## Microsoft.Cascade

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | sites | Yes |

## Microsoft.Cdn

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | canMigrate | No |
> | CdnWebApplicationFirewallManagedRuleSets | No |
> | CdnWebApplicationFirewallPolicies | Yes |
> | edgenodes | No |
> | migrate | No |
> | profiles | Yes |
> | profiles / afdendpoints | Yes |
> | profiles / afdendpoints / routes | No |
> | profiles / customdomains | No |
> | profiles / endpoints | Yes |
> | profiles / endpoints / customdomains | No |
> | profiles / endpoints / origingroups | No |
> | profiles / endpoints / origins | No |
> | profiles / origingroups | No |
> | profiles / origingroups / origins | No |
> | profiles / policies | No |
> | profiles / rulesets | No |
> | profiles / rulesets / rules | No |
> | profiles / secrets | No |
> | profiles / securitypolicies | No |
> | validateProbe | No |
> | validateSecret | No |

## Microsoft.CertificateRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | certificateOrders | Yes |
> | certificateOrders / certificates | No |
> | validateCertificateRegistrationInformation | No |

## Microsoft.ChangeAnalysis

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | changes | No |
> | changeSnapshots | No |
> | computeChanges | No |
> | profile | No |

## Microsoft.Chaos

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | artifactSetDefinitions | No |
> | artifactSetSnapshots | No |
> | experiments | Yes |
> | targets | No |

## Microsoft.ClassicCompute

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | capabilities | No |
> | domainNames | Yes |
> | domainNames / capabilities | No |
> | domainNames / internalLoadBalancers | No |
> | domainNames / serviceCertificates | No |
> | domainNames / slots | No |
> | domainNames / slots / roles | No |
> | domainNames / slots / roles / metricDefinitions | No |
> | domainNames / slots / roles / metrics | No |
> | moveSubscriptionResources | No |
> | operatingSystemFamilies | No |
> | operatingSystems | No |
> | quotas | No |
> | resourceTypes | No |
> | validateSubscriptionMoveAvailability | No |
> | virtualMachines | Yes |
> | virtualMachines / diagnosticSettings | No |
> | virtualMachines / metricDefinitions | No |
> | virtualMachines / metrics | No |

## Microsoft.ClassicInfrastructureMigrate

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | classicInfrastructureResources | No |

## Microsoft.ClassicNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | capabilities | No |
> | expressRouteCrossConnections | No |
> | expressRouteCrossConnections / peerings | No |
> | gatewaySupportedDevices | No |
> | networkSecurityGroups | Yes |
> | quotas | No |
> | reservedIps | Yes |
> | virtualNetworks | Yes |
> | virtualNetworks / remoteVirtualNetworkPeeringProxies | No |
> | virtualNetworks / virtualNetworkPeerings | No |

## Microsoft.ClassicStorage

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | capabilities | No |
> | disks | No |
> | images | No |
> | osImages | No |
> | osPlatformImages | No |
> | publicImages | No |
> | quotas | No |
> | storageAccounts | Yes |
> | storageAccounts / blobServices | No |
> | storageAccounts / fileServices | No |
> | storageAccounts / metricDefinitions | No |
> | storageAccounts / metrics | No |
> | storageAccounts / queueServices | No |
> | storageAccounts / services | No |
> | storageAccounts / services / diagnosticSettings | No |
> | storageAccounts / services / metricDefinitions | No |
> | storageAccounts / services / metrics | No |
> | storageAccounts / tableServices | No |
> | storageAccounts / vmImages | No |
> | vmImages | No |

## Microsoft.CloudTest

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | hostedpools | Yes |
> | images | Yes |
> | pools | Yes |

## Microsoft.CodeSigning

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | codeSigningAccounts | Yes |
> | codeSigningAccounts / certificateProfiles | No |

## Microsoft.Codespaces

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | plans | Yes |
> | registeredSubscriptions | No |

## Microsoft.CognitiveServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts / networkSecurityPerimeterAssociationProxies | No |
> | accounts / privateEndpointConnectionProxies | No |
> | accounts / privateEndpointConnections | No |
> | accounts / privateLinkResources | No |
> | deletedAccounts | No |

## Microsoft.Commerce

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | RateCard | No |
> | UsageAggregates | No |

## Microsoft.Communication

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | CommunicationServices | Yes |
> | CommunicationServices / eventGridFilters | No |
> | EmailServices | Yes |
> | EmailServices / Domains | Yes |
> | registeredSubscriptions | No |

## Microsoft.Compute

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | availabilitySets | Yes |
> | capacityReservationGroups | Yes |
> | capacityReservationGroups / capacityReservations | Yes |
> | cloudServices | Yes |
> | cloudServices / networkInterfaces | No |
> | cloudServices / publicIPAddresses | No |
> | cloudServices / roleInstances | No |
> | cloudServices / roleInstances / networkInterfaces | No |
> | cloudServices / roles | No |
> | diskAccesses | Yes |
> | diskEncryptionSets | Yes |
> | disks | Yes |
> | galleries | Yes |
> | galleries / applications | Yes |
> | galleries / applications / versions | Yes |
> | galleries / images | Yes |
> | galleries / images / versions | Yes |
> | galleries / serviceArtifacts | Yes |
> | hostGroups | Yes |
> | hostGroups / hosts | Yes |
> | images | Yes |
> | proximityPlacementGroups | Yes |
> | restorePointCollections | Yes |
> | restorePointCollections / restorePoints | No |
> | restorePointCollections / restorePoints / diskRestorePoints | No |
> | sharedVMExtensions | Yes |
> | sharedVMExtensions / versions | Yes |
> | sharedVMImages | Yes |
> | sharedVMImages / versions | Yes |
> | snapshots | Yes |
> | sshPublicKeys | Yes |
> | virtualMachines | Yes |
> | virtualMachines / applications | Yes |
> | virtualMachines / extensions | Yes |
> | virtualMachines / metricDefinitions | No |
> | virtualMachines / runCommands | Yes |
> | virtualMachineScaleSets | Yes |
> | virtualMachineScaleSets / applications | No |
> | virtualMachineScaleSets / extensions | No |
> | virtualMachineScaleSets / networkInterfaces | No |
> | virtualMachineScaleSets / publicIPAddresses | No |
> | virtualMachineScaleSets / virtualMachines | No |
> | virtualMachineScaleSets / virtualMachines / extensions | No |
> | virtualMachineScaleSets / virtualMachines / networkInterfaces | No |

## Microsoft.ConfidentialLedger

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | Ledgers | Yes |
> | ManagedCCF | Yes |

## Microsoft.Confluent

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | agreements | No |
> | organizations | Yes |
> | validations | No |

## Microsoft.ConnectedCache

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | CacheNodes | Yes |
> | enterpriseCustomers | Yes |
> | ispCustomers | Yes |
> | ispCustomers / ispCacheNodes | Yes |

## microsoft.connectedopenstack

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | flavors | Yes |
> | heatStacks | Yes |
> | heatStackTemplates | Yes |
> | images | Yes |
> | keypairs | Yes |
> | networkPorts | Yes |
> | networks | Yes |
> | openStackIdentities | Yes |
> | securityGroupRules | Yes |
> | securityGroups | Yes |
> | subnets | Yes |
> | virtualMachines | Yes |
> | volumes | Yes |
> | volumeSnapshots | Yes |
> | volumeTypes | Yes |

## Microsoft.ConnectedVehicle

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | platformAccounts | Yes |
> | registeredSubscriptions | No |

## Microsoft.ConnectedVMwarevSphere

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |
> | datastores | Yes |
> | hosts | Yes |
> | resourcepools | Yes |
> | VCenters | Yes |
> | vcenters / inventoryitems | No |
> | virtualmachines | Yes |
> | VirtualMachines / AssessPatches | No |
> | virtualmachines / extensions | Yes |
> | virtualmachines / guestagents | No |
> | virtualmachines / hybrididentitymetadata | No |
> | VirtualMachines / InstallPatches | No |
> | VirtualMachines / UpgradeExtensions | No |
> | virtualmachinetemplates | Yes |
> | virtualnetworks | Yes |

## Microsoft.Consumption

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | AggregatedCost | No |
> | Balances | No |
> | Budgets | No |
> | Charges | No |
> | CostTags | No |
> | credits | No |
> | events | No |
> | Forecasts | No |
> | lots | No |
> | Marketplaces | No |
> | Pricesheets | No |
> | products | No |
> | ReservationDetails | No |
> | ReservationRecommendationDetails | No |
> | ReservationRecommendations | No |
> | ReservationSummaries | No |
> | ReservationTransactions | No |

## Microsoft.ContainerInstance

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | containerGroupProfiles | Yes |
> | containerGroups | Yes |
> | containerScaleSets | Yes |
> | serviceAssociationLinks | No |

## Microsoft.ContainerRegistry

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | registries | Yes |
> | registries / agentPools | Yes |
> | registries / builds | No |
> | registries / builds / cancel | No |
> | registries / builds / getLogLink | No |
> | registries / buildTasks | Yes |
> | registries / buildTasks / steps | No |
> | registries / connectedRegistries | No |
> | registries / connectedRegistries / deactivate | No |
> | registries / eventGridFilters | No |
> | registries / exportPipelines | No |
> | registries / generateCredentials | No |
> | registries / getBuildSourceUploadUrl | No |
> | registries / GetCredentials | No |
> | registries / importImage | No |
> | registries / importPipelines | No |
> | registries / pipelineRuns | No |
> | registries / privateEndpointConnectionProxies | No |
> | registries / privateEndpointConnectionProxies / validate | No |
> | registries / privateEndpointConnections | No |
> | registries / privateLinkResources | No |
> | registries / queueBuild | No |
> | registries / regenerateCredential | No |
> | registries / regenerateCredentials | No |
> | registries / replications | Yes |
> | registries / runs | No |
> | registries / runs / cancel | No |
> | registries / scheduleRun | No |
> | registries / scopeMaps | No |
> | registries / taskRuns | No |
> | registries / tasks | Yes |
> | registries / tokens | No |
> | registries / updatePolicies | No |
> | registries / webhooks | Yes |
> | registries / webhooks / getCallbackConfig | No |
> | registries / webhooks / ping | No |

## Microsoft.ContainerService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | containerServices | Yes |
> | fleetMemberships | No |
> | fleets | Yes |
> | fleets / members | No |
> | managedClusters | Yes |
> | ManagedClusters / eventGridFilters | No |
> | managedclustersnapshots | Yes |
> | snapshots | Yes |

## Microsoft.CostManagement

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | Alerts | No |
> | BenefitRecommendations | No |
> | BenefitUtilizationSummaries | No |
> | BillingAccounts | No |
> | Budgets | No |
> | CloudConnectors | No |
> | Connectors | Yes |
> | Departments | No |
> | Dimensions | No |
> | EnrollmentAccounts | No |
> | Exports | No |
> | ExternalBillingAccounts | No |
> | ExternalBillingAccounts / Alerts | No |
> | ExternalBillingAccounts / Dimensions | No |
> | ExternalBillingAccounts / Forecast | No |
> | ExternalBillingAccounts / Query | No |
> | ExternalSubscriptions | No |
> | ExternalSubscriptions / Alerts | No |
> | ExternalSubscriptions / Dimensions | No |
> | ExternalSubscriptions / Forecast | No |
> | ExternalSubscriptions / Query | No |
> | fetchMarketplacePrices | No |
> | fetchPrices | No |
> | Forecast | No |
> | GenerateCostDetailsReport | No |
> | GenerateDetailedCostReport | No |
> | Insights | No |
> | Pricesheets | No |
> | Publish | No |
> | Query | No |
> | register | No |
> | Reportconfigs | No |
> | Reports | No |
> | ScheduledActions | No |
> | Settings | No |
> | Views | No |

## Microsoft.CustomerLockbox

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | DisableLockbox | No |
> | EnableLockbox | No |
> | requests | No |
> | TenantOptedIn | No |

## Microsoft.CustomProviders

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | associations | No |
> | resourceProviders | Yes |

## Microsoft.D365CustomerInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | instances | Yes |

## Microsoft.Dashboard

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | grafana | Yes |
> | grafana / privateEndpointConnections | No |
> | grafana / privateLinkResources | No |

## Microsoft.DataBox

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | jobs | Yes |
> | jobs / eventGridFilters | No |

## Microsoft.DataBoxEdge

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | DataBoxEdgeDevices | Yes |

## Microsoft.Databricks

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accessConnectors | Yes |
> | workspaces | Yes |
> | workspaces / dbWorkspaces | No |
> | workspaces / virtualNetworkPeerings | No |

## Microsoft.DataCatalog

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | catalogs | Yes |
> | datacatalogs | Yes |

## Microsoft.DataCollaboration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | workspaces | Yes |
> | workspaces / constrainedResources | No |
> | workspaces / contracts | No |
> | workspaces / contracts / entitlements | No |
> | workspaces / dataAssets | No |
> | workspaces / dataAssets / dataSets | No |
> | workspaces / pipelineRuns | No |
> | workspaces / pipelineRuns / pipelineStepRuns | No |
> | workspaces / pipelines | No |
> | workspaces / pipelines / pipelineSteps | No |
> | workspaces / pipelines / runs | No |
> | workspaces / proposals | No |
> | workspaces / proposals / dataAssetReferences | No |
> | workspaces / proposals / entitlements | No |
> | workspaces / proposals / entitlements / constraints | No |
> | workspaces / proposals / entitlements / policies | No |
> | workspaces / proposals / invitations | No |
> | workspaces / proposals / scriptReferences | No |
> | workspaces / proposals / virtualOutputReferences | No |
> | workspaces / resourceReferences | No |
> | workspaces / scripts | No |
> | workspaces / scripts / scriptrevisions | No |

## Microsoft.Datadog

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | agreements | No |
> | monitors | Yes |
> | monitors / getDefaultKey | No |
> | monitors / refreshSetPasswordLink | No |
> | monitors / setDefaultKey | No |
> | monitors / singleSignOnConfigurations | No |
> | monitors / tagRules | No |
> | registeredSubscriptions | No |

## Microsoft.DataFactory

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | dataFactories | Yes |
> | dataFactories / diagnosticSettings | No |
> | dataFactories / metricDefinitions | No |
> | dataFactorySchema | No |
> | factories | Yes |
> | factories / integrationRuntimes | No |
> | factories / pipelines | No |

## Microsoft.DataLakeAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts / dataLakeStoreAccounts | No |
> | accounts / storageAccounts | No |
> | accounts / storageAccounts / containers | No |
> | accounts / transferAnalyticsUnits | No |

## Microsoft.DataLakeStore

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts / eventGridFilters | No |
> | accounts / firewallRules | No |

## Microsoft.DataMigration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | DatabaseMigrations | No |
> | services | Yes |
> | services / projects | Yes |
> | slots | Yes |
> | SqlMigrationServices | Yes |

## Microsoft.DataProtection

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | backupInstances | No |
> | BackupVaults | Yes |
> | ResourceGuards | Yes |

## Microsoft.DataReplication

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | replicationFabrics | Yes |
> | replicationVaults | Yes |

## Microsoft.DataShare

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts / shares | No |
> | accounts / shares / datasets | No |
> | accounts / shares / invitations | No |
> | accounts / shares / providersharesubscriptions | No |
> | accounts / shares / synchronizationSettings | No |
> | accounts / sharesubscriptions | No |
> | accounts / sharesubscriptions / consumerSourceDataSets | No |
> | accounts / sharesubscriptions / datasetmappings | No |
> | accounts / sharesubscriptions / triggers | No |

## Microsoft.DBforMariaDB

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | servers | Yes |
> | servers / advisors | No |
> | servers / keys | No |
> | servers / privateEndpointConnectionProxies | No |
> | servers / privateEndpointConnections | No |
> | servers / privateLinkResources | No |
> | servers / queryTexts | No |
> | servers / recoverableServers | No |
> | servers / resetQueryPerformanceInsightData | No |
> | servers / topQueryStatistics | No |
> | servers / virtualNetworkRules | No |
> | servers / waitStatistics | No |

## Microsoft.DBforMySQL

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | assessForMigration | No |
> | flexibleServers | Yes |
> | getPrivateDnsZoneSuffix | No |
> | servers | Yes |
> | servers / advisors | No |
> | servers / keys | No |
> | servers / privateEndpointConnectionProxies | No |
> | servers / privateEndpointConnections | No |
> | servers / privateLinkResources | No |
> | servers / queryTexts | No |
> | servers / recoverableServers | No |
> | servers / resetQueryPerformanceInsightData | No |
> | servers / topQueryStatistics | No |
> | servers / virtualNetworkRules | No |
> | servers / waitStatistics | No |

## Microsoft.DBforPostgreSQL

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | flexibleServers | Yes |
> | getPrivateDnsZoneSuffix | No |
> | serverGroups | Yes |
> | serverGroupsv2 | Yes |
> | servers | Yes |
> | servers / advisors | No |
> | servers / keys | No |
> | servers / privateEndpointConnectionProxies | No |
> | servers / privateEndpointConnections | No |
> | servers / privateLinkResources | No |
> | servers / queryTexts | No |
> | servers / recoverableServers | No |
> | servers / resetQueryPerformanceInsightData | No |
> | servers / topQueryStatistics | No |
> | servers / virtualNetworkRules | No |
> | servers / waitStatistics | No |
> | serversv2 | Yes |

## Microsoft.DelegatedNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | controller | Yes |
> | delegatedSubnets | Yes |
> | orchestrators | Yes |

## Microsoft.DeploymentManager

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | artifactSources | Yes |
> | rollouts | Yes |
> | serviceTopologies | Yes |
> | serviceTopologies / services | Yes |
> | serviceTopologies / services / serviceUnits | Yes |
> | steps | Yes |

## Microsoft.DesktopVirtualization

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applicationgroups | Yes |
> | applicationgroups / applications | No |
> | applicationgroups / desktops | No |
> | applicationgroups / startmenuitems | No |
> | hostpools | Yes |
> | hostpools / msixpackages | No |
> | hostpools / sessionhosts | No |
> | hostpools / sessionhosts / usersessions | No |
> | hostpools / usersessions | No |
> | scalingplans | Yes |
> | workspaces | Yes |

## Microsoft.DevAI

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | instances | Yes |
> | instances / experiments | Yes |
> | instances / sandboxes | Yes |
> | instances / sandboxes / experiments | Yes |

## Microsoft.DevCenter

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | devcenters | Yes |
> | devcenters / attachednetworks | No |
> | devcenters / catalogs | No |
> | devcenters / devboxdefinitions | Yes |
> | devcenters / environmentTypes | No |
> | devcenters / galleries | No |
> | devcenters / galleries / images | No |
> | devcenters / galleries / images / versions | No |
> | devcenters / images | No |
> | networkconnections | Yes |
> | projects | Yes |
> | projects / allowedEnvironmentTypes | No |
> | projects / attachednetworks | No |
> | projects / devboxdefinitions | No |
> | projects / environmentTypes | No |
> | projects / pools | Yes |
> | projects / pools / schedules | No |
> | registeredSubscriptions | No |

## Microsoft.DevHub

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | workflows | Yes |

## Microsoft.Devices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | IotHubs | Yes |
> | IotHubs / eventGridFilters | No |
> | IotHubs / failover | No |
> | IotHubs / securitySettings | No |
> | ProvisioningServices | Yes |
> | usages | No |

## Microsoft.DeviceUpdate

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts / instances | Yes |
> | accounts / privateEndpointConnectionProxies | No |
> | accounts / privateEndpointConnections | No |
> | accounts / privateLinkResources | No |
> | registeredSubscriptions | No |

## Microsoft.DevOps

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | pipelines | Yes |

## Microsoft.DevTestLab

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | labcenters | Yes |
> | labs | Yes |
> | labs / environments | Yes |
> | labs / serviceRunners | Yes |
> | labs / virtualMachines | Yes |
> | schedules | Yes |

## Microsoft.DigitalTwins

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | digitalTwinsInstances | Yes |
> | digitalTwinsInstances / endpoints | No |
> | digitalTwinsInstances / timeSeriesDatabaseConnections | No |

## Microsoft.DocumentDB

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | cassandraClusters | Yes |
> | databaseAccountNames | No |
> | databaseAccounts | Yes |
> | databaseAccounts / encryptionScopes | No |
> | restorableDatabaseAccounts | No |

## Microsoft.DomainRegistration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | domains | Yes |
> | domains / domainOwnershipIdentifiers | No |
> | generateSsoRequest | No |
> | topLevelDomains | No |
> | validateDomainRegistrationInformation | No |

## Microsoft.EdgeOrder

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | addresses | Yes |
> | orderItems | Yes |
> | orders | No |
> | productFamiliesMetadata | No |

## Microsoft.Elastic

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | monitors | Yes |
> | monitors / tagRules | No |

## Microsoft.EventGrid

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | domains | Yes |
> | domains / topics | No |
> | eventSubscriptions | No |
> | extensionTopics | No |
> | namespaces | Yes |
> | partnerConfigurations | Yes |
> | partnerDestinations | Yes |
> | partnerNamespaces | Yes |
> | partnerNamespaces / channels | No |
> | partnerNamespaces / eventChannels | No |
> | partnerRegistrations | Yes |
> | partnerTopics | Yes |
> | partnerTopics / eventSubscriptions | No |
> | systemTopics | Yes |
> | systemTopics / eventSubscriptions | No |
> | topics | Yes |
> | topicTypes | No |
> | verifiedPartners | No |

## Microsoft.EventHub

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |
> | namespaces | Yes |
> | namespaces / applicationGroups | No |
> | namespaces / authorizationrules | No |
> | namespaces / disasterrecoveryconfigs | No |
> | namespaces / eventhubs | No |
> | namespaces / eventhubs / authorizationrules | No |
> | namespaces / eventhubs / consumergroups | No |
> | namespaces / networkrulesets | No |
> | namespaces / privateEndpointConnections | No |

## Microsoft.Falcon

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | namespaces | Yes |

## Microsoft.Features

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | featureConfigurations | No |
> | featureProviderNamespaces | No |
> | featureProviders | No |
> | features | No |
> | providers | No |
> | subscriptionFeatureRegistrations | No |

## Microsoft.Fidalgo

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | devcenters | Yes |
> | devcenters / attachednetworks | No |
> | devcenters / catalogs | No |
> | devcenters / catalogs / items | No |
> | devcenters / devboxdefinitions | Yes |
> | devcenters / environmentTypes | No |
> | devcenters / galleries | No |
> | devcenters / galleries / images | No |
> | devcenters / galleries / images / versions | No |
> | devcenters / images | No |
> | devcenters / mappings | No |
> | machinedefinitions | Yes |
> | networksettings | Yes |
> | projects | Yes |
> | projects / attachednetworks | No |
> | projects / catalogItems | No |
> | projects / devboxdefinitions | No |
> | projects / environments | Yes |
> | projects / environments / deployments | No |
> | projects / environmentTypes | No |
> | projects / pools | Yes |
> | registeredSubscriptions | No |

## Microsoft.FluidRelay

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | fluidRelayServers | Yes |
> | fluidRelayServers / fluidRelayContainers | No |

## Microsoft.Graph

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | AzureADApplication | Yes |
> | AzureADApplicationPrototype | Yes |
> | registeredSubscriptions | No |

## Microsoft.GuestConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | guestConfigurationAssignments | No |

## Microsoft.HanaOnAzure

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | hanaInstances | Yes |
> | sapMonitors | Yes |

## Microsoft.HardwareSecurityModules

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | dedicatedHSMs | Yes |

## Microsoft.HDInsight

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusterPools | Yes |
> | clusterPools / clusters | Yes |
> | clusterPools / clusters / instanceViews | No |
> | clusterPools / clusters / serviceConfigs | No |
> | clusterPools / clusters / sessionClusters | Yes |
> | clusterPools / clusters / sessionClusters / instanceViews | No |
> | clusterPools / clusters / sessionClusters / serviceConfigs | No |
> | clusters | Yes |
> | clusters / applications | No |

## Microsoft.HealthBot

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | healthBots | Yes |

## Microsoft.HealthcareApis

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | services | Yes |
> | services / iomtconnectors | No |
> | services / iomtconnectors / connections | No |
> | services / iomtconnectors / mappings | No |
> | services / privateEndpointConnectionProxies | No |
> | services / privateEndpointConnections | No |
> | services / privateLinkResources | No |
> | validateMedtechMappings | No |
> | workspaces | Yes |
> | workspaces / analyticsconnectors | Yes |
> | workspaces / dicomservices | Yes |
> | workspaces / eventGridFilters | No |
> | workspaces / fhirservices | Yes |
> | workspaces / iotconnectors | Yes |
> | workspaces / iotconnectors / destinations | No |
> | workspaces / iotconnectors / fhirdestinations | No |
> | workspaces / privateEndpointConnectionProxies | No |
> | workspaces / privateEndpointConnections | No |
> | workspaces / privateLinkResources | No |

## Microsoft.HpcWorkbench

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | instances | Yes |
> | instances / chambers | Yes |
> | instances / chambers / accessProfiles | Yes |
> | instances / chambers / fileRequests | No |
> | instances / chambers / files | No |
> | instances / chambers / workloads | Yes |
> | instances / consortiums | Yes |

## Microsoft.HybridCompute

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | machines | Yes |
> | machines / assessPatches | No |
> | machines / extensions | Yes |
> | machines / installPatches | No |
> | machines / privateLinkScopes | No |
> | privateLinkScopes | Yes |
> | privateLinkScopes / privateEndpointConnectionProxies | No |
> | privateLinkScopes / privateEndpointConnections | No |

## Microsoft.HybridConnectivity

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | endpoints | No |

## Microsoft.HybridContainerService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | provisionedClusters | Yes |
> | provisionedClusters / agentPools | Yes |
> | provisionedClusters / hybridIdentityMetadata | No |
> | provisionedClusters / upgradeProfiles | No |
> | storageSpaces | Yes |
> | virtualNetworks | Yes |

## Microsoft.HybridData

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | dataManagers | Yes |

## Microsoft.HybridNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | configurationGroupValues | Yes |
> | devices | Yes |
> | networkFunctionPublishers | No |
> | networkFunctionPublishers / networkFunctionDefinitionGroups | No |
> | networkFunctionPublishers / networkFunctionDefinitionGroups / publisherNetworkFunctionDefinitionVersions | No |
> | networkfunctions | Yes |
> | networkFunctions / components | No |
> | networkFunctionVendors | No |
> | publishers | Yes |
> | publishers / artifactStores | Yes |
> | publishers / artifactStores / artifactManifests | Yes |
> | publishers / configurationGroupSchemas | Yes |
> | publishers / networkFunctionDefinitionGroups | Yes |
> | publishers / networkFunctionDefinitionGroups / networkFunctionDefinitionVersions | Yes |
> | publishers / networkFunctionDefinitionGroups / previewSubscriptions | Yes |
> | publishers / networkServiceDesignGroups | Yes |
> | publishers / networkServiceDesignGroups / networkServiceDesignVersions | Yes |
> | registeredSubscriptions | No |
> | siteNetworkServices | Yes |
> | sites | Yes |
> | vendors | No |

## Microsoft.ImportExport

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | jobs | Yes |

## microsoft.insights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | actiongroups | Yes |
> | actiongroups / networkSecurityPerimeterAssociationProxies | No |
> | actiongroups / networkSecurityPerimeterConfigurations | No |
> | activityLogAlerts | Yes |
> | alertrules | Yes |
> | autoscalesettings | Yes |
> | components | Yes |
> | components / aggregate | No |
> | components / analyticsItems | No |
> | components / annotations | No |
> | components / api | No |
> | components / apiKeys | No |
> | components / currentBillingFeatures | No |
> | components / defaultWorkItemConfig | No |
> | components / events | No |
> | components / exportConfiguration | No |
> | components / extendQueries | No |
> | components / favorites | No |
> | components / featureCapabilities | No |
> | components / generateDiagnosticServiceReadOnlyToken | No |
> | components / generateDiagnosticServiceReadWriteToken | No |
> | components / linkedstorageaccounts | No |
> | components / metadata | No |
> | components / metricDefinitions | No |
> | components / metrics | No |
> | components / move | No |
> | components / myAnalyticsItems | No |
> | components / myFavorites | No |
> | components / pricingPlans | No |
> | components / proactiveDetectionConfigs | No |
> | components / purge | No |
> | components / query | No |
> | components / quotaStatus | No |
> | components / webtests | No |
> | components / workItemConfigs | No |
> | createnotifications | No |
> | dataCollectionEndpoints | Yes |
> | dataCollectionEndpoints / networkSecurityPerimeterAssociationProxies | No |
> | dataCollectionEndpoints / networkSecurityPerimeterConfigurations | No |
> | dataCollectionEndpoints / scopedPrivateLinkProxies | No |
> | dataCollectionRuleAssociations | No |
> | dataCollectionRules | Yes |
> | diagnosticSettings | No |
> | diagnosticSettingsCategories | No |
> | eventCategories | No |
> | eventtypes | No |
> | extendedDiagnosticSettings | No |
> | generateDiagnosticServiceReadOnlyToken | No |
> | generateDiagnosticServiceReadWriteToken | No |
> | guestDiagnosticSettings | Yes |
> | guestDiagnosticSettingsAssociation | No |
> | logDefinitions | No |
> | logprofiles | No |
> | logs | No |
> | metricalerts | Yes |
> | metricbaselines | No |
> | metricbatch | No |
> | metricDefinitions | No |
> | metricNamespaces | No |
> | metrics | No |
> | migratealertrules | No |
> | migrateToNewPricingModel | No |
> | monitoredObjects | No |
> | myWorkbooks | No |
> | notificationgroups | Yes |
> | notificationstatus | No |
> | privateLinkScopes | Yes |
> | privateLinkScopes / privateEndpointConnectionProxies | No |
> | privateLinkScopes / privateEndpointConnections | No |
> | privateLinkScopes / scopedResources | No |
> | rollbackToLegacyPricingModel | No |
> | scheduledqueryrules | Yes |
> | scheduledqueryrules / networkSecurityPerimeterAssociationProxies | No |
> | scheduledqueryrules / networkSecurityPerimeterConfigurations | No |
> | topology | No |
> | transactions | No |
> | webtests | Yes |
> | webtests / getTestResultFile | No |
> | workbooks | Yes |
> | workbooktemplates | Yes |

## Microsoft.IntelligentITDigitalTwin

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | digitalTwins | Yes |
> | digitalTwins / assets | Yes |
> | digitalTwins / executionPlans | Yes |
> | digitalTwins / testPlans | Yes |
> | digitalTwins / tests | Yes |

## Microsoft.IoTCentral

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | appTemplates | No |
> | IoTApps | Yes |

## Microsoft.IoTFirmwareDefense

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | firmwareGroups | No |
> | firmwareGroups / firmwares | No |

## Microsoft.IoTSecurity

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | alertTypes | No |
> | defenderSettings | No |
> | onPremiseSensors | No |
> | recommendationTypes | No |
> | sensors | No |
> | sites | No |

## Microsoft.KeyVault

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | deletedManagedHSMs | No |
> | deletedVaults | No |
> | hsmPools | Yes |
> | managedHSMs | Yes |
> | vaults | Yes |
> | vaults / accessPolicies | No |
> | vaults / eventGridFilters | No |
> | vaults / keys | No |
> | vaults / keys / versions | No |
> | vaults / secrets | No |

## Microsoft.Kubernetes

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | connectedClusters | Yes |
> | registeredSubscriptions | No |

## Microsoft.KubernetesConfiguration

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | extensions | No |
> | extensionTypes | No |
> | fluxConfigurations | No |
> | namespaces | No |
> | privateLinkScopes | Yes |
> | privateLinkScopes / privateEndpointConnectionProxies | No |
> | privateLinkScopes / privateEndpointConnections | No |
> | sourceControlConfigurations | No |

## Microsoft.Kusto

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |
> | clusters / attacheddatabaseconfigurations | No |
> | clusters / databases | No |
> | clusters / databases / dataconnections | No |
> | clusters / databases / eventhubconnections | No |
> | clusters / databases / principalassignments | No |
> | clusters / databases / scripts | No |
> | clusters / dataconnections | No |
> | clusters / principalassignments | No |
> | clusters / sharedidentities | No |

## Microsoft.LabServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | labaccounts | Yes |
> | labplans | Yes |
> | labs | Yes |
> | users | No |

## Microsoft.LoadTestService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | loadtests | Yes |
> | loadtests / outboundNetworkDependenciesEndpoints | No |
> | registeredSubscriptions | No |

## Microsoft.Logic

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | hostingEnvironments | Yes |
> | integrationAccounts | Yes |
> | integrationServiceEnvironments | Yes |
> | integrationServiceEnvironments / managedApis | Yes |
> | isolatedEnvironments | Yes |
> | workflows | Yes |

## Microsoft.Logz

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | monitors | Yes |
> | monitors / accounts | Yes |
> | monitors / accounts / tagRules | No |
> | monitors / metricsSource | Yes |
> | monitors / metricsSource / tagRules | No |
> | monitors / singleSignOnConfigurations | No |
> | monitors / tagRules | No |
> | registeredSubscriptions | No |

## Microsoft.MachineLearning

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | commitmentPlans | Yes |
> | webServices | Yes |
> | Workspaces | Yes |

## Microsoft.MachineLearningServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | aisysteminventories | Yes |
> | registries | Yes |
> | registries / codes | No |
> | registries / codes / versions | No |
> | registries / components | No |
> | registries / components / versions | No |
> | registries / environments | No |
> | registries / environments / versions | No |
> | registries / models | No |
> | registries / models / versions | No |
> | virtualclusters | Yes |
> | workspaces | Yes |
> | workspaces / batchEndpoints | Yes |
> | workspaces / batchEndpoints / deployments | Yes |
> | workspaces / batchEndpoints / deployments / jobs | No |
> | workspaces / batchEndpoints / jobs | No |
> | workspaces / codes | No |
> | workspaces / codes / versions | No |
> | workspaces / components | No |
> | workspaces / components / versions | No |
> | workspaces / computes | No |
> | workspaces / data | No |
> | workspaces / data / versions | No |
> | workspaces / datasets | No |
> | workspaces / datastores | No |
> | workspaces / environments | No |
> | workspaces / environments / versions | No |
> | workspaces / eventGridFilters | No |
> | workspaces / jobs | No |
> | workspaces / labelingJobs | No |
> | workspaces / linkedServices | No |
> | workspaces / models | No |
> | workspaces / models / versions | No |
> | workspaces / onlineEndpoints | Yes |
> | workspaces / onlineEndpoints / deployments | Yes |
> | workspaces / schedules | No |
> | workspaces / services | No |

## Microsoft.Maintenance

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applyUpdates | No |
> | configurationAssignments | No |
> | maintenanceConfigurations | Yes |
> | publicMaintenanceConfigurations | No |
> | updates | No |

## Microsoft.ManagedIdentity

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | Identities | No |
> | userAssignedIdentities | Yes |
> | userAssignedIdentities / federatedIdentityCredentials | No |

## Microsoft.ManagedServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | marketplaceRegistrationDefinitions | No |
> | registrationAssignments | No |
> | registrationDefinitions | No |

## Microsoft.Management

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | getEntities | No |
> | managementGroups | No |
> | managementGroups / settings | No |
> | resources | No |
> | startTenantBackfill | No |
> | tenantBackfillStatus | No |

## Microsoft.Maps

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts / creators | Yes |
> | accounts / eventGridFilters | No |

## Microsoft.Marketplace

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | macc | No |
> | offers | No |
> | offerTypes | No |
> | offerTypes / publishers | No |
> | offerTypes / publishers / offers | No |
> | offerTypes / publishers / offers / plans | No |
> | offerTypes / publishers / offers / plans / agreements | No |
> | offerTypes / publishers / offers / plans / configs | No |
> | offerTypes / publishers / offers / plans / configs / importImage | No |
> | privategalleryitems | No |
> | privateStoreClient | No |
> | privateStores | No |
> | privateStores / AdminRequestApprovals | No |
> | privateStores / anyExistingOffersInTheCollections | No |
> | privateStores / billingAccounts | No |
> | privateStores / bulkCollectionsAction | No |
> | privateStores / collections | No |
> | privateStores / collections / approveAllItems | No |
> | privateStores / collections / disableApproveAllItems | No |
> | privateStores / collections / offers | No |
> | privateStores / collections / offers / upsertOfferWithMultiContext | No |
> | privateStores / collections / transferOffers | No |
> | privateStores / collectionsToSubscriptionsMapping | No |
> | privateStores / fetchAllSubscriptionsInTenant | No |
> | privateStores / offers | No |
> | privateStores / offers / acknowledgeNotification | No |
> | privateStores / queryApprovedPlans | No |
> | privateStores / queryNotificationsState | No |
> | privateStores / queryOffers | No |
> | privateStores / queryUserOffers | No |
> | privateStores / RequestApprovals | No |
> | privateStores / requestApprovals / query | No |
> | privateStores / requestApprovals / withdrawPlan | No |
> | products | No |
> | publishers | No |
> | publishers / offers | No |
> | publishers / offers / amendments | No |
> | register | No |
> | search | No |

## Microsoft.MarketplaceNotifications

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | reviewsnotifications | No |

## Microsoft.MarketplaceOrdering

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | agreements | No |
> | offertypes | No |

## Microsoft.Media

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | mediaservices | Yes |
> | mediaservices / accountFilters | No |
> | mediaservices / assets | No |
> | mediaservices / assets / assetFilters | No |
> | mediaservices / assets / tracks | No |
> | mediaservices / contentKeyPolicies | No |
> | mediaservices / eventGridFilters | No |
> | mediaservices / graphInstances | No |
> | mediaservices / graphTopologies | No |
> | mediaservices / liveEvents | Yes |
> | mediaservices / liveEvents / liveOutputs | No |
> | mediaservices / mediaGraphs | No |
> | mediaservices / privateEndpointConnectionProxies | No |
> | mediaservices / privateEndpointConnections | No |
> | mediaservices / streamingEndpoints | Yes |
> | mediaservices / streamingLocators | No |
> | mediaservices / streamingPolicies | No |
> | mediaservices / transforms | No |
> | mediaservices / transforms / jobs | No |
> | videoAnalyzers | Yes |
> | videoAnalyzers / accessPolicies | No |
> | videoAnalyzers / edgeModules | No |
> | videoAnalyzers / livePipelines | No |
> | videoAnalyzers / pipelineJobs | No |
> | videoAnalyzers / pipelineTopologies | No |
> | videoAnalyzers / videos | No |

## Microsoft.Migrate

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | assessmentProjects | Yes |
> | migrateprojects | Yes |
> | modernizeProjects | Yes |
> | moveCollections | Yes |
> | projects | Yes |

## Microsoft.MixedReality

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | objectAnchorsAccounts | Yes |
> | objectUnderstandingAccounts | Yes |
> | remoteRenderingAccounts | Yes |
> | spatialAnchorsAccounts | Yes |

## Microsoft.MobileNetwork

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | mobileNetworks | Yes |
> | mobileNetworks / dataNetworks | Yes |
> | mobileNetworks / services | Yes |
> | mobileNetworks / simPolicies | Yes |
> | mobileNetworks / sites | Yes |
> | mobileNetworks / slices | Yes |
> | packetCoreControlPlanes | Yes |
> | packetCoreControlPlanes / packetCoreDataPlanes | Yes |
> | packetCoreControlPlanes / packetCoreDataPlanes / attachedDataNetworks | Yes |
> | packetCoreControlPlaneVersions | No |
> | simGroups | Yes |
> | simGroups / sims | No |
> | sims | Yes |

## Microsoft.Monitor

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |

## Microsoft.NetApp

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | netAppAccounts | Yes |
> | netAppAccounts / accountBackups | No |
> | netAppAccounts / backupPolicies | Yes |
> | netAppAccounts / capacityPools | Yes |
> | netAppAccounts / capacityPools / volumes | Yes |
> | netAppAccounts / capacityPools / volumes / backups | No |
> | netAppAccounts / capacityPools / volumes / mountTargets | No |
> | netAppAccounts / capacityPools / volumes / snapshots | No |
> | netAppAccounts / capacityPools / volumes / subvolumes | No |
> | netAppAccounts / capacityPools / volumes / volumeQuotaRules | No |
> | netAppAccounts / snapshotPolicies | Yes |
> | netAppAccounts / vaults | No |
> | netAppAccounts / volumeGroups | No |

## Microsoft.Network

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applicationGateways | Yes |
> | applicationGatewayWebApplicationFirewallPolicies | Yes |
> | applicationSecurityGroups | Yes |
> | azureFirewallFqdnTags | No |
> | azureFirewalls | Yes |
> | azureWebCategories | No |
> | bastionHosts | Yes |
> | bgpServiceCommunities | No |
> | cloudServiceSlots | No |
> | connections | Yes |
> | customIpPrefixes | Yes |
> | ddosCustomPolicies | Yes |
> | ddosProtectionPlans | Yes |
> | dnsForwardingRulesets | Yes |
> | dnsForwardingRulesets / forwardingRules | No |
> | dnsForwardingRulesets / virtualNetworkLinks | No |
> | dnsResolvers | Yes |
> | dnsResolvers / inboundEndpoints | Yes |
> | dnsResolvers / outboundEndpoints | Yes |
> | dnszones | Yes |
> | dnszones / A | No |
> | dnszones / AAAA | No |
> | dnszones / all | No |
> | dnszones / CAA | No |
> | dnszones / CNAME | No |
> | dnszones / MX | No |
> | dnszones / NS | No |
> | dnszones / PTR | No |
> | dnszones / recordsets | No |
> | dnszones / SOA | No |
> | dnszones / SRV | No |
> | dnszones / TXT | No |
> | dscpConfigurations | Yes |
> | expressRouteCircuits | Yes |
> | expressRouteCrossConnections | Yes |
> | expressRouteGateways | Yes |
> | expressRoutePorts | Yes |
> | expressRouteProviderPorts | No |
> | expressRouteServiceProviders | No |
> | firewallPolicies | Yes |
> | frontdoors | Yes |
> | frontdoors / frontendEndpoints | No |
> | frontdoors / frontendEndpoints / customHttpsConfiguration | No |
> | frontdoorWebApplicationFirewallManagedRuleSets | No |
> | frontdoorWebApplicationFirewallPolicies | Yes |
> | getDnsResourceReference | No |
> | internalNotify | No |
> | internalPublicIpAddresses | No |
> | ipGroups | Yes |
> | loadBalancers | Yes |
> | localNetworkGateways | Yes |
> | natGateways | Yes |
> | networkExperimentProfiles | Yes |
> | networkIntentPolicies | Yes |
> | networkInterfaces | Yes |
> | networkManagerConnections | No |
> | networkManagers | Yes |
> | networkProfiles | Yes |
> | networkSecurityGroups | Yes |
> | networkSecurityPerimeters | Yes |
> | networkVirtualAppliances | Yes |
> | networkWatchers | Yes |
> | networkWatchers / connectionMonitors | Yes |
> | networkWatchers / flowLogs | Yes |
> | networkWatchers / lenses | Yes |
> | networkWatchers / pingMeshes | Yes |
> | p2sVpnGateways | Yes |
> | privateDnsZones | Yes |
> | privateDnsZones / A | No |
> | privateDnsZones / AAAA | No |
> | privateDnsZones / all | No |
> | privateDnsZones / CNAME | No |
> | privateDnsZones / MX | No |
> | privateDnsZones / PTR | No |
> | privateDnsZones / SOA | No |
> | privateDnsZones / SRV | No |
> | privateDnsZones / TXT | No |
> | privateDnsZones / virtualNetworkLinks | Yes |
> | privateDnsZonesInternal | No |
> | privateEndpointRedirectMaps | Yes |
> | privateEndpoints | Yes |
> | privateEndpoints / privateLinkServiceProxies | No |
> | privateLinkServices | Yes |
> | publicIPAddresses | Yes |
> | publicIPPrefixes | Yes |
> | routeFilters | Yes |
> | routeTables | Yes |
> | securityPartnerProviders | Yes |
> | serviceEndpointPolicies | Yes |
> | trafficManagerGeographicHierarchies | No |
> | trafficmanagerprofiles | Yes |
> | trafficmanagerprofiles / azureendpoints | No |
> | trafficmanagerprofiles / externalendpoints | No |
> | trafficmanagerprofiles / heatMaps | No |
> | trafficmanagerprofiles / nestedendpoints | No |
> | trafficManagerUserMetricsKeys | No |
> | virtualHubs | Yes |
> | virtualNetworkGateways | Yes |
> | virtualNetworks | Yes |
> | virtualNetworks / privateDnsZoneLinks | No |
> | virtualNetworks / taggedTrafficConsumers | No |
> | virtualNetworkTaps | Yes |
> | virtualRouters | Yes |
> | virtualWans | Yes |
> | vpnGateways | Yes |
> | vpnServerConfigurations | Yes |
> | vpnSites | Yes |

## Microsoft.NetworkCloud

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | bareMetalMachines | Yes |
> | cloudServicesNetworks | Yes |
> | clusterManagers | Yes |
> | clusters | Yes |
> | clusters / admissions | No |
> | defaultCniNetworks | Yes |
> | disks | Yes |
> | hybridAksClusters | Yes |
> | hybridAksManagementDomains | Yes |
> | hybridAksVirtualMachines | Yes |
> | l2Networks | Yes |
> | l3Networks | Yes |
> | rackManifests | Yes |
> | racks | Yes |
> | storageAppliances | Yes |
> | trunkedNetworks | Yes |
> | virtualMachines | Yes |
> | workloadNetworks | Yes |

## Microsoft.NetworkFunction

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | azureTrafficCollectors | Yes |
> | azureTrafficCollectors / collectorPolicies | Yes |
> | meshVpns | Yes |
> | meshVpns / connectionPolicies | Yes |
> | meshVpns / privateEndpointConnectionProxies | No |
> | meshVpns / privateEndpointConnections | No |

## Microsoft.NotificationHubs

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | namespaces | Yes |
> | namespaces / notificationHubs | Yes |

## Microsoft.ObjectStore

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | osNamespaces | Yes |

## Microsoft.OffAzure

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | HyperVSites | Yes |
> | ImportSites | Yes |
> | MasterSites | Yes |
> | ServerSites | Yes |
> | VMwareSites | Yes |

## Microsoft.OpenEnergyPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | energyServices | Yes |
> | energyServices / privateEndpointConnectionProxies | No |
> | energyServices / privateEndpointConnections | No |
> | energyServices / privateLinkResources | No |

## Microsoft.OpenLogisticsPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applicationManagers | Yes |
> | applicationManagers / applicationRegistrations | No |
> | applicationManagers / eventGridFilters | No |
> | applicationRegistrationInvites | No |
> | applicationWorkspaces | Yes |
> | applicationWorkspaces / applications | No |
> | applicationWorkspaces / applications / applicationRegistrationInvites | No |
> | shareInvites | No |
> | workspaces | Yes |
> | workspaces / applicationRegistrations | No |
> | workspaces / applications | No |
> | workspaces / eventGridFilters | No |
> | workspaces / shares | No |
> | workspaces / shareSubscriptions | No |

## Microsoft.OperationalInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |
> | deletedWorkspaces | No |
> | linkTargets | No |
> | querypacks | Yes |
> | storageInsightConfigs | No |
> | workspaces | Yes |
> | workspaces / dataExports | No |
> | workspaces / dataSources | No |
> | workspaces / linkedServices | No |
> | workspaces / linkedStorageAccounts | No |
> | workspaces / metadata | No |
> | workspaces / networkSecurityPerimeterAssociationProxies | No |
> | workspaces / networkSecurityPerimeterConfigurations | No |
> | workspaces / query | No |
> | workspaces / scopedPrivateLinkProxies | No |
> | workspaces / storageInsightConfigs | No |
> | workspaces / tables | No |

## Microsoft.Orbital

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | contactProfiles | Yes |
> | edgeSites | Yes |
> | globalCommunicationsSites | No |
> | groundStations | Yes |
> | l2Connections | Yes |
> | l3Connections | Yes |
> | orbitalGateways | Yes |
> | spacecrafts | Yes |
> | spacecrafts / contacts | No |

## Microsoft.Peering

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | cdnPeeringPrefixes | No |
> | legacyPeerings | No |
> | lookingGlass | No |
> | peerAsns | No |
> | peerings | Yes |
> | peeringServiceCountries | No |
> | peeringServiceProviders | No |
> | peeringServices | Yes |

## Microsoft.Pki

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | pkis | Yes |
> | pkis / certificateAuthorities | No |
> | pkis / enrollmentPolicies | Yes |

## Microsoft.PlayFab

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | playerAccountPools | Yes |
> | titles | Yes |
> | titles / automationRules | No |
> | titles / segments | No |
> | titles / titleDataSets | No |
> | titles / titleInternalDataKeyValues | No |
> | titles / titleInternalDataSets | No |

## Microsoft.PolicyInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | attestations | No |
> | componentPolicyStates | No |
> | eventGridFilters | No |
> | policyEvents | No |
> | policyMetadata | No |
> | policyStates | No |
> | policyTrackedResources | No |
> | remediations | No |

## Microsoft.Portal

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | consoles | No |
> | dashboards | Yes |
> | tenantconfigurations | No |
> | userSettings | No |

## Microsoft.PowerBI

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | privateLinkServicesForPowerBI | Yes |
> | tenants | Yes |
> | tenants / workspaces | No |
> | workspaceCollections | Yes |

## Microsoft.PowerBIDedicated

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | autoScaleVCores | Yes |
> | capacities | Yes |
> | servers | Yes |

## Microsoft.PowerPlatform

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | enterprisePolicies | Yes |

## Microsoft.ProviderHub

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | providerRegistrations | No |
> | providerRegistrations / customRollouts | No |
> | providerRegistrations / defaultRollouts | No |
> | providerRegistrations / resourceActions | No |
> | providerRegistrations / resourceTypeRegistrations | No |

## Microsoft.Purview

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts / kafkaConfigurations | No |
> | getDefaultAccount | No |
> | removeDefaultAccount | No |
> | setDefaultAccount | No |

## Microsoft.Quantum

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | Workspaces | Yes |

## Microsoft.Quota

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | quotaRequests | No |
> | quotas | No |
> | usages | No |

## Microsoft.RecommendationsService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts / modeling | Yes |
> | accounts / serviceEndpoints | Yes |

## Microsoft.RecoveryServices

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | backupProtectedItems | No |
> | vaults | Yes |

## Microsoft.RedHatOpenShift

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | OpenShiftClusters | Yes |

## Microsoft.Relay

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | namespaces | Yes |
> | namespaces / authorizationrules | No |
> | namespaces / hybridconnections | No |
> | namespaces / hybridconnections / authorizationrules | No |
> | namespaces / privateEndpointConnections | No |
> | namespaces / wcfrelays | No |
> | namespaces / wcfrelays / authorizationrules | No |

## Microsoft.ResourceConnector

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | appliances | Yes |
> | telemetryconfig | No |

## Microsoft.ResourceGraph

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | queries | Yes |
> | resourceChangeDetails | No |
> | resourceChanges | No |
> | resources | No |
> | resourcesHistory | No |
> | subscriptionsStatus | No |

## Microsoft.ResourceHealth

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | childResources | No |
> | emergingissues | No |
> | events | No |
> | impactedResources | No |
> | metadata | No |

## Microsoft.Resources

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | deployments | No |
> | deploymentScripts | Yes |
> | deploymentScripts / logs | No |
> | deploymentStacks / snapshots | No |
> | links | No |
> | resourceGroups | No |
> | snapshots | No |
> | subscriptions | No |
> | tags | No |
> | templateSpecs | Yes |
> | templateSpecs / versions | Yes |
> | tenants | No |
> | validateResources | No |

## Microsoft.SaaS

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applications | Yes |
> | resources | Yes |
> | saasresources | No |

## Microsoft.Scom

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | managedInstances | Yes |

## Microsoft.ScVmm

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | AvailabilitySets | Yes |
> | Clouds | Yes |
> | VirtualMachines | Yes |
> | VirtualMachines / HybridIdentityMetadata | No |
> | VirtualMachineTemplates | Yes |
> | VirtualNetworks | Yes |
> | VMMServers | Yes |
> | VMMServers / InventoryItems | No |

## Microsoft.Search

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | resourceHealthMetadata | No |
> | searchServices | Yes |

## Microsoft.Security

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | adaptiveNetworkHardenings | No |
> | advancedThreatProtectionSettings | No |
> | alerts | No |
> | alertsSuppressionRules | No |
> | allowedConnections | No |
> | antiMalwareSettings | No |
> | applications | No |
> | assessmentMetadata | No |
> | assessments | No |
> | assessments / governanceAssignments | No |
> | assignments | Yes |
> | attackPaths | No |
> | autoDismissAlertsRules | No |
> | automations | Yes |
> | AutoProvisioningSettings | No |
> | Compliances | No |
> | connectedContainerRegistries | No |
> | connectors | No |
> | customAssessmentAutomations | Yes |
> | customEntityStoreAssignments | Yes |
> | dataCollectionAgents | No |
> | dataScanners | Yes |
> | dataSensitivitySettings | No |
> | deviceSecurityGroups | No |
> | discoveredSecuritySolutions | No |
> | externalSecuritySolutions | No |
> | governanceRules | No |
> | InformationProtectionPolicies | No |
> | ingestionSettings | No |
> | insights | No |
> | iotSecuritySolutions | Yes |
> | iotSecuritySolutions / analyticsModels | No |
> | iotSecuritySolutions / analyticsModels / aggregatedAlerts | No |
> | iotSecuritySolutions / analyticsModels / aggregatedRecommendations | No |
> | iotSecuritySolutions / iotAlerts | No |
> | iotSecuritySolutions / iotAlertTypes | No |
> | iotSecuritySolutions / iotRecommendations | No |
> | iotSecuritySolutions / iotRecommendationTypes | No |
> | jitNetworkAccessPolicies | No |
> | jitPolicies | No |
> | MdeOnboardings | No |
> | policies | No |
> | pricings | No |
> | query | No |
> | regulatoryComplianceStandards | No |
> | regulatoryComplianceStandards / regulatoryComplianceControls | No |
> | regulatoryComplianceStandards / regulatoryComplianceControls / regulatoryComplianceAssessments | No |
> | secureScoreControlDefinitions | No |
> | secureScoreControls | No |
> | secureScores | No |
> | secureScores / secureScoreControls | No |
> | securityConnectors | Yes |
> | securityContacts | No |
> | securitySolutions | No |
> | securitySolutionsReferenceData | No |
> | securityStatuses | No |
> | securityStatusesSummaries | No |
> | serverVulnerabilityAssessments | No |
> | serverVulnerabilityAssessmentsSettings | No |
> | settings | No |
> | sqlVulnerabilityAssessments | No |
> | standards | Yes |
> | subAssessments | No |
> | tasks | No |
> | topologies | No |
> | vmScanners | No |
> | workspaceSettings | No |

## Microsoft.SecurityDetonation

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | chambers | Yes |

## Microsoft.SecurityDevOps

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | azureDevOpsConnectors | Yes |
> | azureDevOpsConnectors / orgs | No |
> | azureDevOpsConnectors / orgs / projects | No |
> | azureDevOpsConnectors / orgs / projects / repos | No |
> | azureDevOpsConnectors / repos | No |
> | azureDevOpsConnectors / stats | No |
> | gitHubConnectors | Yes |
> | gitHubConnectors / gitHubRepos | No |
> | gitHubConnectors / owners | No |
> | gitHubConnectors / owners / repos | No |
> | gitHubConnectors / repos | No |
> | gitHubConnectors / stats | No |

## Microsoft.SecurityInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | aggregations | No |
> | alertRules | No |
> | alertRuleTemplates | No |
> | automationRules | No |
> | bookmarks | No |
> | cases | No |
> | contentPackages | No |
> | contentTemplates | No |
> | dataConnectorDefinitions | No |
> | dataConnectors | No |
> | enrichment | No |
> | entities | No |
> | entityQueryTemplates | No |
> | fileImports | No |
> | huntsessions | No |
> | incidents | No |
> | metadata | No |
> | MitreCoverageRecords | No |
> | onboardingStates | No |
> | overview | No |
> | recommendations | No |
> | securityMLAnalyticsSettings | No |
> | settings | No |
> | sourceControls | No |
> | threatIntelligence | No |

## Microsoft.SerialConsole

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | consoleServices | No |
> | serialPorts | No |

## Microsoft.ServiceBus

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | namespaces | Yes |
> | namespaces / authorizationrules | No |
> | namespaces / disasterrecoveryconfigs | No |
> | namespaces / eventgridfilters | No |
> | namespaces / networkrulesets | No |
> | namespaces / privateEndpointConnections | No |
> | namespaces / queues | No |
> | namespaces / queues / authorizationrules | No |
> | namespaces / topics | No |
> | namespaces / topics / authorizationrules | No |
> | namespaces / topics / subscriptions | No |
> | namespaces / topics / subscriptions / rules | No |
> | premiumMessagingRegions | No |

## Microsoft.ServiceFabric

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |
> | clusters / applications | No |
> | clusters / applications / services | No |
> | clusters / applicationTypes | No |
> | clusters / applicationTypes / versions | No |
> | edgeclusters | Yes |
> | edgeclusters / applications | No |
> | managedclusters | Yes |
> | managedclusters / applications | No |
> | managedclusters / applications / services | No |
> | managedclusters / applicationTypes | No |
> | managedclusters / applicationTypes / versions | No |
> | managedclusters / nodetypes | No |

## Microsoft.ServiceLinker

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | dryruns | No |
> | linkers | No |

## Microsoft.ServicesHub

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | connectors | Yes |
> | supportOfferingEntitlement | No |
> | workspaces | No |

## Microsoft.SignalRService

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | SignalR | Yes |
> | SignalR / eventGridFilters | No |
> | WebPubSub | Yes |

## Microsoft.Singularity

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | accounts / accountQuotaPolicies | No |
> | accounts / groupPolicies | No |
> | accounts / jobs | No |
> | accounts / models | No |
> | accounts / networks | No |
> | accounts / storageContainers | No |
> | images | No |
> | quotas | No |

## Microsoft.SoftwarePlan

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | hybridUseBenefits | No |

## Microsoft.Solutions

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | applicationDefinitions | Yes |
> | applications | Yes |
> | jitRequests | Yes |

## Microsoft.Sql

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | instancePools | Yes |
> | managedInstances | Yes |
> | managedInstances / administrators | No |
> | managedInstances / advancedThreatProtectionSettings | No |
> | managedInstances / databases | Yes |
> | managedInstances / databases / advancedThreatProtectionSettings | No |
> | managedInstances / databases / backupLongTermRetentionPolicies | No |
> | managedInstances / databases / vulnerabilityAssessments | No |
> | managedInstances / dnsAliases | No |
> | managedInstances / metricDefinitions | No |
> | managedInstances / metrics | No |
> | managedInstances / recoverableDatabases | No |
> | managedInstances / sqlAgent | No |
> | managedInstances / startStopSchedules | No |
> | managedInstances / tdeCertificates | No |
> | managedInstances / vulnerabilityAssessments | No |
> | servers | Yes |
> | servers / administrators | No |
> | servers / advancedThreatProtectionSettings | No |
> | servers / advisors | No |
> | servers / aggregatedDatabaseMetrics | No |
> | servers / auditingSettings | No |
> | servers / automaticTuning | No |
> | servers / communicationLinks | No |
> | servers / connectionPolicies | No |
> | servers / databases | Yes |
> | servers / databases / activate | No |
> | servers / databases / activatedatabase | No |
> | servers / databases / advancedThreatProtectionSettings | No |
> | servers / databases / advisors | No |
> | servers / databases / auditingSettings | No |
> | servers / databases / auditRecords | No |
> | servers / databases / automaticTuning | No |
> | servers / databases / backupLongTermRetentionPolicies | No |
> | servers / databases / backupShortTermRetentionPolicies | No |
> | servers / databases / databaseState | No |
> | servers / databases / dataMaskingPolicies | No |
> | servers / databases / dataMaskingPolicies / rules | No |
> | servers / databases / deactivate | No |
> | servers / databases / deactivatedatabase | No |
> | servers / databases / extensions | No |
> | servers / databases / geoBackupPolicies | No |
> | servers / databases / ledgerDigestUploads | No |
> | servers / databases / metricDefinitions | No |
> | servers / databases / metrics | No |
> | servers / databases / recommendedSensitivityLabels | No |
> | servers / databases / securityAlertPolicies | No |
> | servers / databases / sqlvulnerabilityassessments | No |
> | servers / databases / syncGroups | No |
> | servers / databases / syncGroups / syncMembers | No |
> | servers / databases / topQueries | No |
> | servers / databases / topQueries / queryText | No |
> | servers / databases / transparentDataEncryption | No |
> | servers / databases / VulnerabilityAssessment | No |
> | servers / databases / vulnerabilityAssessments | No |
> | servers / databases / VulnerabilityAssessmentScans | No |
> | servers / databases / VulnerabilityAssessmentSettings | No |
> | servers / databases / workloadGroups | No |
> | servers / databaseSecurityPolicies | No |
> | servers / devOpsAuditingSettings | No |
> | servers / disasterRecoveryConfiguration | No |
> | servers / dnsAliases | No |
> | servers / elasticPoolEstimates | No |
> | servers / elasticpools | Yes |
> | servers / elasticPools / advisors | No |
> | servers / elasticpools / metricdefinitions | No |
> | servers / elasticpools / metrics | No |
> | servers / encryptionProtector | No |
> | servers / extendedAuditingSettings | No |
> | servers / failoverGroups | No |
> | servers / import | No |
> | servers / jobAccounts | Yes |
> | servers / jobAgents | Yes |
> | servers / jobAgents / jobs | No |
> | servers / jobAgents / jobs / executions | No |
> | servers / jobAgents / jobs / steps | No |
> | servers / keys | No |
> | servers / recommendedElasticPools | No |
> | servers / recoverableDatabases | No |
> | servers / restorableDroppedDatabases | No |
> | servers / securityAlertPolicies | No |
> | servers / serviceObjectives | No |
> | servers / sqlvulnerabilityassessments | No |
> | servers / syncAgents | No |
> | servers / tdeCertificates | No |
> | servers / usages | No |
> | servers / virtualNetworkRules | No |
> | servers / vulnerabilityAssessments | No |
> | virtualClusters | Yes |

## Microsoft.SqlVirtualMachine

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | SqlVirtualMachineGroups | Yes |
> | SqlVirtualMachines | Yes |

## Microsoft.Storage

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | dataMovers | Yes |
> | dataMovers / agents | No |
> | dataMovers / endpoints | No |
> | dataMovers / projects | No |
> | dataMovers / projects / jobDefinitions | No |
> | dataMovers / projects / jobDefinitions / jobRuns | No |
> | deletedAccounts | No |
> | storageAccounts | Yes |
> | storageAccounts / blobServices | No |
> | storageAccounts / encryptionScopes | No |
> | storageAccounts / fileServices | No |
> | storageAccounts / queueServices | No |
> | storageAccounts / services | No |
> | storageAccounts / services / metricDefinitions | No |
> | storageAccounts / storageTaskAssignments | No |
> | storageAccounts / tableServices | No |
> | storageTasks | Yes |
> | usages | No |

## Microsoft.StorageCache

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | amlFilesystems | Yes |
> | caches | Yes |
> | caches / storageTargets | No |
> | usageModels | No |

## Microsoft.StorageMover

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | storageMovers | Yes |
> | storageMovers / agents | No |
> | storageMovers / endpoints | No |
> | storageMovers / projects | No |
> | storageMovers / projects / jobDefinitions | No |
> | storageMovers / projects / jobDefinitions / jobRuns | No |

## Microsoft.StoragePool

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | diskPools | Yes |
> | diskPools / iscsiTargets | No |

## Microsoft.StorageSync

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | storageSyncServices | Yes |
> | storageSyncServices / registeredServers | No |
> | storageSyncServices / syncGroups | No |
> | storageSyncServices / syncGroups / cloudEndpoints | No |
> | storageSyncServices / syncGroups / serverEndpoints | No |
> | storageSyncServices / workflows | No |

## Microsoft.StorSimple

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | managers | Yes |

## Microsoft.StreamAnalytics

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | clusters | Yes |
> | clusters / privateEndpoints | No |
> | streamingjobs | Yes |

## Microsoft.Subscription

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | acceptChangeTenant | No |
> | acceptOwnership | No |
> | acceptOwnershipStatus | No |
> | aliases | No |
> | cancel | No |
> | changeTenantRequest | No |
> | changeTenantStatus | No |
> | enable | No |
> | policies | No |
> | rename | No |
> | SubscriptionDefinitions | No |
> | subscriptions | No |

## microsoft.support

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | lookUpResourceId | No |
> | services | No |
> | services / problemclassifications | No |
> | supporttickets | No |

## Microsoft.Synapse

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | privateLinkHubs | Yes |
> | workspaces | Yes |
> | workspaces / bigDataPools | Yes |
> | workspaces / kustoPools | Yes |
> | workspaces / kustoPools / attacheddatabaseconfigurations | No |
> | workspaces / kustoPools / databases | No |
> | workspaces / kustoPools / databases / dataconnections | No |
> | workspaces / sqlDatabases | Yes |
> | workspaces / sqlPools | Yes |

## Microsoft.TestBase

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | testBaseAccounts | Yes |
> | testBaseAccounts / customerEvents | No |
> | testBaseAccounts / emailEvents | No |
> | testBaseAccounts / externalTestTools | No |
> | testBaseAccounts / externalTestTools / testCases | No |
> | testBaseAccounts / featureUpdateSupportedOses | No |
> | testBaseAccounts / firstPartyApps | No |
> | testBaseAccounts / flightingRings | No |
> | testBaseAccounts / packages | Yes |
> | testBaseAccounts / packages / favoriteProcesses | No |
> | testBaseAccounts / packages / osUpdates | No |
> | testBaseAccounts / testSummaries | No |
> | testBaseAccounts / testTypes | No |
> | testBaseAccounts / usages | No |

## Microsoft.TimeSeriesInsights

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | environments | Yes |
> | environments / accessPolicies | No |
> | environments / eventsources | Yes |
> | environments / privateEndpointConnectionProxies | No |
> | environments / privateEndpointConnections | No |
> | environments / privateLinkResources | No |
> | environments / referenceDataSets | Yes |

## Microsoft.UsageBilling

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |

## Microsoft.VideoIndexer

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |

## Microsoft.VirtualMachineImages

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | imageTemplates | Yes |
> | imageTemplates / runOutputs | No |
> | imageTemplates / triggers | No |

## microsoft.visualstudio

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | account | Yes |
> | account / extension | Yes |
> | account / project | Yes |

## Microsoft.VMware

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | arczones | Yes |
> | resourcepools | Yes |
> | vcenters | Yes |
> | VCenters / InventoryItems | No |
> | virtualmachines | Yes |
> | virtualmachinetemplates | Yes |
> | virtualnetworks | Yes |

## Microsoft.VMwareCloudSimple

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | dedicatedCloudNodes | Yes |
> | dedicatedCloudServices | Yes |
> | virtualMachines | Yes |

## Microsoft.VSOnline

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | accounts | Yes |
> | plans | Yes |
> | registeredSubscriptions | No |

## Microsoft.Web

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | apiManagementAccounts | No |
> | apiManagementAccounts / apiAcls | No |
> | apiManagementAccounts / apis | No |
> | apiManagementAccounts / apis / apiAcls | No |
> | apiManagementAccounts / apis / connectionAcls | No |
> | apiManagementAccounts / apis / connections | No |
> | apiManagementAccounts / apis / connections / connectionAcls | No |
> | apiManagementAccounts / apis / localizedDefinitions | No |
> | apiManagementAccounts / connectionAcls | No |
> | apiManagementAccounts / connections | No |
> | billingMeters | No |
> | certificates | Yes |
> | connectionGateways | Yes |
> | connections | Yes |
> | containerApps | Yes |
> | customApis | Yes |
> | customhostnameSites | No |
> | deletedSites | No |
> | functionAppStacks | No |
> | generateGithubAccessTokenForAppserviceCLI | No |
> | hostingEnvironments | Yes |
> | hostingEnvironments / eventGridFilters | No |
> | hostingEnvironments / multiRolePools | No |
> | hostingEnvironments / workerPools | No |
> | kubeEnvironments | Yes |
> | publishingUsers | No |
> | recommendations | No |
> | resourceHealthMetadata | No |
> | runtimes | No |
> | serverFarms | Yes |
> | serverFarms / eventGridFilters | No |
> | serverFarms / firstPartyApps | No |
> | serverFarms / firstPartyApps / keyVaultSettings | No |
> | sites | Yes |
> | sites / eventGridFilters | No |
> | sites / hostNameBindings | No |
> | sites / networkConfig | No |
> | sites / premieraddons | Yes |
> | sites / slots | Yes |
> | sites / slots / eventGridFilters | No |
> | sites / slots / hostNameBindings | No |
> | sites / slots / networkConfig | No |
> | sourceControls | No |
> | staticSites | Yes |
> | staticSites / builds | No |
> | staticSites / builds / linkedBackends | No |
> | staticSites / builds / userProvidedFunctionApps | No |
> | staticSites / linkedBackends | No |
> | staticSites / userProvidedFunctionApps | No |
> | validate | No |
> | verifyHostingEnvironmentVnet | No |
> | webAppStacks | No |
> | workerApps | Yes |

## Microsoft.WindowsESU

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | multipleActivationKeys | Yes |

## Microsoft.WindowsIoT

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | DeviceServices | Yes |

## Microsoft.WorkloadBuilder

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | migrationAgents | Yes |
> | workloads | Yes |
> | workloads / instances | No |
> | workloads / versions | No |
> | workloads / versions / artifacts | No |

## Microsoft.WorkloadMonitor

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | monitors | No |

## Microsoft.Workloads

> [!div class="mx-tableFixed"]
> | Resource type | Complete mode deletion |
> | ------------- | ----------- |
> | monitors | Yes |
> | monitors / providerInstances | No |
> | phpWorkloads | Yes |
> | phpWorkloads / wordpressInstances | No |
> | sapVirtualInstances | Yes |
> | sapVirtualInstances / applicationInstances | Yes |
> | sapVirtualInstances / centralInstances | Yes |
> | sapVirtualInstances / databaseInstances | Yes |

## Next steps

To get the same data as a file of comma-separated values, download [complete-mode-deletion.csv](https://github.com/tfitzmac/resource-capabilities/blob/master/complete-mode-deletion.csv).
