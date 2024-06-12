---
title: Azure permissions for General - Azure RBAC
description: Lists the permissions for the Azure resource providers in the General category.
ms.service: role-based-access-control
ms.topic: reference
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure permissions for General

This article lists the permissions for the Azure resource providers in the General category. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. Permission strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`


## Microsoft.Addons

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

## Microsoft.Capacity

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
> | Microsoft.Capacity/listSkus/action | Lists SKUs with filters and without any restrictions |
> | Microsoft.Capacity/appliedreservations/read | Read All Reservations |
> | Microsoft.Capacity/catalogs/read | Read catalog of Reservation |
> | Microsoft.Capacity/commercialreservationorders/read | Get Reservation Orders created in any Tenant |
> | Microsoft.Capacity/operations/read | Read any Operation |
> | Microsoft.Capacity/reservationorders/changedirectory/action | Change directory of any reservation |
> | Microsoft.Capacity/reservationorders/availablescopes/action | Find any Available Scope |
> | Microsoft.Capacity/reservationorders/read | Read All Reservations |
> | Microsoft.Capacity/reservationorders/write | Create any Reservation |
> | Microsoft.Capacity/reservationorders/delete | Delete any Reservation |
> | Microsoft.Capacity/reservationorders/reservations/action | Update any Reservation |
> | Microsoft.Capacity/reservationorders/return/action | Return any Reservation |
> | Microsoft.Capacity/reservationorders/swap/action | Swap any Reservation |
> | Microsoft.Capacity/reservationorders/split/action | Split any Reservation |
> | Microsoft.Capacity/reservationorders/changeBilling/action | Reservation billing change |
> | Microsoft.Capacity/reservationorders/merge/action | Merge any Reservation |
> | Microsoft.Capacity/reservationorders/calculaterefund/action | Computes the refund amount and price of new purchase and returns policy Errors. |
> | Microsoft.Capacity/reservationorders/changebillingoperationresults/read | Poll any Reservation billing change operation |
> | Microsoft.Capacity/reservationorders/mergeoperationresults/read | Poll any merge operation |
> | Microsoft.Capacity/reservationorders/reservations/availablescopes/action | Find any Available Scope |
> | Microsoft.Capacity/reservationorders/reservations/read | Read All Reservations |
> | Microsoft.Capacity/reservationorders/reservations/write | Create any Reservation |
> | Microsoft.Capacity/reservationorders/reservations/delete | Delete any Reservation |
> | Microsoft.Capacity/reservationorders/reservations/archive/action | Archive a reservation which is in a terminal state like Expired, Split etc. |
> | Microsoft.Capacity/reservationorders/reservations/unarchive/action | Unarchive a Reservation which was previously archived |
> | Microsoft.Capacity/reservationorders/reservations/revisions/read | Read All Reservations |
> | Microsoft.Capacity/reservationorders/splitoperationresults/read | Poll any split operation |
> | Microsoft.Capacity/resourceProviders/locations/serviceLimits/read | Get the current service limit or quota of the specified resource and location |
> | Microsoft.Capacity/resourceProviders/locations/serviceLimits/write | Create service limit or quota for the specified resource and location |
> | Microsoft.Capacity/resourceProviders/locations/serviceLimitsRequests/read | Get any service limit request for the specified resource and location |
> | Microsoft.Capacity/tenants/register/action | Register any Tenant |

## Microsoft.Commerce

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Commerce/register/action | Register Subscription for Microsoft Commerce UsageAggregate |
> | Microsoft.Commerce/unregister/action | Unregister Subscription for Microsoft Commerce UsageAggregate |
> | Microsoft.Commerce/RateCard/read | Returns offer data, resource/meter metadata and rates for the given subscription. |
> | Microsoft.Commerce/UsageAggregates/read | Retrieves Microsoft Azure's consumption  by a subscription. The result contains aggregates usage data, subscription and resource related information, on a particular time range. |

## Microsoft.Marketplace

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Marketplace/register/action | Registers Microsoft.Marketplace resource provider in the subscription. |
> | Microsoft.Marketplace/privateStores/action | Updates PrivateStore. |
> | Microsoft.Marketplace/search/action | Returns a list of azure private store marketplace catalog offers and total count and facets |
> | Microsoft.Marketplace/mysolutions/read | Get user solutions |
> | Microsoft.Marketplace/mysolutions/write | Create or update user solutions |
> | Microsoft.Marketplace/mysolutions/delete | Remove user solutions |
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

## Microsoft.MarketplaceOrdering

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

## Microsoft.Quota

Azure service: [Azure Quotas](/azure/quotas/quotas-overview)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Quota/register/action | Register the subscription with Microsoft.Quota Resource Provider |
> | Microsoft.Quota/groupQuotas/read | Get the GroupQuota |
> | Microsoft.Quota/groupQuotas/write | Creates the GroupQuota resource |
> | Microsoft.Quota/groupQuotas/groupQuotaLimits/read | Get the current GroupQuota of the specified resource |
> | Microsoft.Quota/groupQuotas/groupQuotaLimits/write | Creates the GroupQuota request for the specified resource |
> | Microsoft.Quota/groupQuotas/groupQuotaRequests/read | Get the GroupQuota request status for the specific request |
> | Microsoft.Quota/groupQuotas/quotaAllocationRequests/read | Get the GroupQuota to Subscription Quota allocation request status for the specific request |
> | Microsoft.Quota/groupQuotas/quotaAllocations/read | Get the current GroupQuota to Subscription Quota allocation |
> | Microsoft.Quota/groupQuotas/quotaAllocations/write | Creates the GroupQuota to subscription Quota limit request for the specified resource |
> | Microsoft.Quota/groupQuotas/subscriptions/read | Get the GroupQuota subscriptions |
> | Microsoft.Quota/groupQuotas/subscriptions/write | Add Subscriptions to GroupQuota resource |
> | Microsoft.Quota/operations/read | Get the Operations supported by Microsoft.Quota |
> | Microsoft.Quota/quotaRequests/read | Get any service limit request for the specified resource |
> | Microsoft.Quota/quotas/read | Get the current Service limit or quota of the specified resource |
> | Microsoft.Quota/quotas/write | Creates the service limit or quota request for the specified resource |
> | Microsoft.Quota/usages/read | Get the usages for resource providers |

## Microsoft.Subscription

Azure service: core

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Subscription/cancel/action | Cancels the Subscription |
> | Microsoft.Subscription/rename/action | Renames the Subscription |
> | Microsoft.Subscription/enable/action | Reactivates the Subscription |
> | Microsoft.Subscription/aliases/write | Create subscription alias |
> | Microsoft.Subscription/aliases/read | Get subscription alias |
> | Microsoft.Subscription/aliases/delete | Delete subscription alias |
> | Microsoft.Subscription/Policies/write | Create tenant policy |
> | Microsoft.Subscription/Policies/default/read | Get tenant policy |
> | Microsoft.Subscription/subscriptions/acceptOwnership/action | Accept ownership of Subscription |
> | Microsoft.Subscription/subscriptions/acceptOwnershipStatus/read | Get the status of accepting ownership of Subscription |

## Microsoft.Support

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

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)