---
title: General resource provider operations include file
description: General resource provider operations include file
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.workload: identity
ms.topic: include
ms.date: 06/01/2023
ms.author: rolyon
ms.custom: generated
---

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
> | Microsoft.Marketplace/search/action | Returns a list of azure private store marketplace catalog offers and total count and facets |
> | Microsoft.Marketplace/offerTypes/publishers/offers/plans/agreements/read | Returns an Agreement. |
> | Microsoft.Marketplace/offerTypes/publishers/offers/plans/agreements/write | Accepts a signed agreement. |
> | Microsoft.Marketplace/offerTypes/publishers/offers/plans/configs/read | Returns a config. |
> | Microsoft.Marketplace/offerTypes/publishers/offers/plans/configs/write | Saves a config. |
> | Microsoft.Marketplace/offerTypes/publishers/offers/plans/configs/importImage/action | Imports an image to the end user's ACR. |
> | Microsoft.Marketplace/privateStores/write | Creates PrivateStore. |
> | Microsoft.Marketplace/privateStores/delete | Deletes PrivateStore. |
> | Microsoft.Marketplace/privateStores/offers/action | Updates offer in  PrivateStore. |
> | Microsoft.Marketplace/privateStores/read | Reads PrivateStores. |
> | Microsoft.Marketplace/privateStores/requestApprovals/action | Update request approvals |
> | Microsoft.Marketplace/privateStores/fetchAllSubscriptionsInTenant/action | Admin fetches all subscriptions in tenant |
> | Microsoft.Marketplace/privateStores/listStopSellOffersPlansNotifications/action | List stop sell offers plans notifications |
> | Microsoft.Marketplace/privateStores/listSubscriptionsContext/action | List the subscription in private store context |
> | Microsoft.Marketplace/privateStores/listNewPlansNotifications/action | List new plans notifications |
> | Microsoft.Marketplace/privateStores/queryUserOffers/action | Fetch the approved offers from the offers ids and the user subscriptions in the payload |
> | Microsoft.Marketplace/privateStores/queryUserRules/action | Fetch the approved rules for the user under the user subscriptions |
> | Microsoft.Marketplace/privateStores/anyExistingOffersInTheStore/action | Return true if there is an existing offer for at least one enabled collection |
> | Microsoft.Marketplace/privateStores/queryInternalOfferIds/action | List of all internal offers under given azure application and plans |
> | Microsoft.Marketplace/privateStores/adminRequestApprovals/read | Read all request approvals details, only admins |
> | Microsoft.Marketplace/privateStores/adminRequestApprovals/write | Admin update the request with decision on the request |
> | Microsoft.Marketplace/privateStores/collections/approveAllItems/action | Delete all specific approved items and set collection to allItemsApproved |
> | Microsoft.Marketplace/privateStores/collections/disableApproveAllItems/action | Set approve all items property to false for the collection |
> | Microsoft.Marketplace/privateStores/collections/setRules/action | Set Rules on a given collection |
> | Microsoft.Marketplace/privateStores/collections/queryRules/action | Get Rules on a given collection |
> | Microsoft.Marketplace/privateStores/collections/upsertOfferWithMultiContext/action | Upsert an offer with different contexts |
> | Microsoft.Marketplace/privateStores/collections/offers/action | Get Collection Offers By Public and Subscriptions Context |
> | Microsoft.Marketplace/privateStores/offers/write | Creates offer in  PrivateStore. |
> | Microsoft.Marketplace/privateStores/offers/delete | Deletes offer from  PrivateStore. |
> | Microsoft.Marketplace/privateStores/offers/read | Reads PrivateStore offers. |
> | Microsoft.Marketplace/privateStores/queryNotificationsState/read | Read notifications state details, only admins |
> | Microsoft.Marketplace/privateStores/requestApprovals/read | Read request approvals |
> | Microsoft.Marketplace/privateStores/requestApprovals/write | Create request approval |
> | Microsoft.Marketplace/privateStores/RequestApprovals/offer/acknowledgeNotification/write | Acknowledge a notification, Admins only |
> | Microsoft.Marketplace/privateStores/RequestApprovals/withdrawPlan/write | Withdraw a plan from offer's notifications |

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

### Microsoft.Quota

Azure service: [Azure Quotas](../../../quotas/quotas-overview.md)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Quota/register/action | Register the subscription with Microsoft.Quota Resource Provider |
> | Microsoft.Quota/operations/read | Get the Operations supported by Microsoft.Quota |
> | Microsoft.Quota/quotaRequests/read | Get any service limit request for the specified resource |
> | Microsoft.Quota/quotas/read | Get the current Service limit or quota of the specified resource |
> | Microsoft.Quota/quotas/write | Creates the service limit or quota request for the specified resource |
> | Microsoft.Quota/usages/read | Get the usages for resource providers |

### Microsoft.ResourceHealth

Azure service: [Azure Service Health](../../../service-health/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ResourceHealth/events/action | Endpoint to fetch details for event |
> | Microsoft.ResourceHealth/register/action | Registers the subscription for the Microsoft ResourceHealth |
> | Microsoft.ResourceHealth/unregister/action | Unregisters the subscription for the Microsoft ResourceHealth |
> | Microsoft.Resourcehealth/healthevent/action | Denotes the change in health state for the specified resource |
> | Microsoft.ResourceHealth/AvailabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.ResourceHealth/AvailabilityStatuses/current/read | Gets the availability status for the specified resource |
> | Microsoft.ResourceHealth/emergingissues/read | Get Azure services' emerging issues |
> | Microsoft.ResourceHealth/events/read | Get Service Health Events for given subscription |
> | Microsoft.ResourceHealth/events/fetchEventDetails/action | Endpoint to fetch details for event |
> | Microsoft.ResourceHealth/events/listSecurityAdvisoryImpactedResources/action | Get Impacted Resources for a given event of type SecurityAdvisory |
> | Microsoft.ResourceHealth/events/impactedResources/read | Get Impacted Resources for a given event |
> | Microsoft.Resourcehealth/healthevent/Activated/action | Denotes the change in health state for the specified resource |
> | Microsoft.Resourcehealth/healthevent/Updated/action | Denotes the change in health state for the specified resource |
> | Microsoft.Resourcehealth/healthevent/Resolved/action | Denotes the change in health state for the specified resource |
> | Microsoft.Resourcehealth/healthevent/InProgress/action | Denotes the change in health state for the specified resource |
> | Microsoft.Resourcehealth/healthevent/Pending/action | Denotes the change in health state for the specified resource |
> | Microsoft.ResourceHealth/impactedResources/read | Get Impacted Resources for given subscription |
> | Microsoft.ResourceHealth/metadata/read | Gets Metadata |
> | Microsoft.ResourceHealth/Notifications/read | Receives Azure Resource Manager notifications |
> | Microsoft.ResourceHealth/Operations/read | Get the operations available for the Microsoft ResourceHealth |
> | Microsoft.ResourceHealth/potentialoutages/read | Get Potential Outages for given subscription |

### Microsoft.Support

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Support/register/action | Registers Support Resource Provider |
> | Microsoft.Support/lookUpResourceId/action | Looks up resource Id for resource type |
> | Microsoft.Support/checkNameAvailability/action | Checks that name is valid and not in use for resource type |
> | Microsoft.Support/operationresults/read | Gets the result of the asynchronous operation |
> | Microsoft.Support/operations/read | Lists all operations available on Microsoft.Support resource provider |
> | Microsoft.Support/operationsstatus/read | Gets the status of the asynchronous operation |
> | Microsoft.Support/services/read | Lists one or all Azure services available for support |
> | Microsoft.Support/services/problemClassifications/read | Lists one or all problem classifications for an Azure service |
> | Microsoft.Support/supportTickets/read | Lists one or all support tickets |
> | Microsoft.Support/supportTickets/write | Allows creating and updating a support ticket |
