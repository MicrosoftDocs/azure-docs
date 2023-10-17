---
title: Elevated access for viewing Security Advisories
description: This article details an upcoming change which will require users to obtain elevated access roles in order to view Security Advisory details
ms.topic: conceptual
ms.date: 10/10/2023
---
# Elevated access for viewing Security Advisories

This article details an upcoming change which will require users to obtain elevated access roles in order to view Security Advisory details on Azure Service Health.

## What are Security Advisories?

Customers are informed of any security issues or privacy breaches that are impacting on their critical and non-critical business applications. The Service Health security advisories blade lists these security notifications. When a user clicks on a security event displayed in the list, the details of the security event are displayed in different tabs in the issue pop up window. You should see 3 tabs: Summary, Issue Updates, and Impacted Resources (introduced recently).

## Who can view Security Advisories?
Security Advisories are displayed to users at Subscription or Tenant level. Today any users who have subscription reader or above can access the Security Advisories (Summary and Issue updates) details at Subscription scope. Users with [these tenant](../admin-access-reference.md) can also access the tenant level security advisories(Summary and Issue updates) notifications.

## What are Impacted Resources within Security Advisories?

In 2023, the Impacted resources tab was introduced for Security Advisory events. Since the data displayed in this tab is sensitive, elevated access is required for customers accessing the data via UI or API. [Review this article](impacted-resources-security.md) for more information on the current RBAC requirements for accessing Security impacted resources.

:::image type="content" source="./media/impacted-resource-sec/impact-security.PNG" alt-text="Screenshot of information about impacted resources from subscription scope in Azure Service Health.":::



>[!Note]
> The above screenshots reflect the RBAC experience for the Security Advisories as of today. 

## What is changing in Security Advisories?

In the future, accessing Security Advisories will need elevated access across the Summary, Impacted Resources, and Issue Updates tabs. This means users who have subscription reader access (Subscription scope), or tenant roles at tenant scope, will no longer be able to view the details until they get the required roles.

### 1. On the Service Health portal
A banner will be displayed to the users until April 2024 on the Summary and Issue Updates tabs prompting customers to get the right roles to view these tabs in future. 

After April 2024, customers will see an error message on the Summary and Issue Updates tabs for users who do not have the required roles listed below:

**Subscription level**
- Subscription Owner
- Subscription Admin
- Custom Roles with Microsoft.ResourceHealth/events/fetchEventDetails/action permissions or Microsoft.ResourceHealth/events/action permissions

**Tenant level**
- Security Admin/Security Reader
- Global Admin/Tenant Admin
- Custom Roles with Microsoft.ResourceHealth/events/fetchEventDetails/action permissions or Microsoft.ResourceHealth/events/action permissions

### 2. Service Health API Changes

Events API users will also need to update their code to use the new **ARM endpoint (/fetchEventDetails)** to receive Security Advisories notification details. If the users have roles listed above, the new endpoint will display event details for a specific event. The existing endpoint **(/events)** that returns all Service Health event types impacting a subscription or tenant, will be updated to not return sensitive security event details. This update will be made to API version 2023-10-01-preview and future versions. 

The old and new endpoints listed below will return the security notification details for a specific event.



#### New API Endpoint Details

- To access the new endpoint below, users need to be authorized with the above-mentioned roles. 
- This endpoint will return the event object with all available properties for a specific event. 
- This is like the impacted resources endpoint below.
- Available since API version 2022-10-01

**Example**

```HTTP
https://management.azure.com/subscriptions/227b734f-e14f-4de6-b7fc-3190c21e69f6/providers/microsoft.ResourceHealth/events/{trackingId}/fetchEventDetails?api-version=2023-10-01-preview 
```
Operation: POST

#### Impacted Resources for Security Advisories
- To access the list of resources impacted by a Security Incident, the following endpoints can be used by users authorized with the above-mentioned roles. 
- Available since API version 2022-05-01
 
**Subscription**
```HTTP
https://management.azure.com/subscriptions/4970d23e-ed41-4670-9c19-02a1d2808ff9/providers/microsoft.resourcehealth/events/{trackingId}/listSecurityAdvisoryImpactedResources?api-version=2023-10-01-preview 
```
Operation: POST

**Tenant**
```HTTP
https://management.azure.com/providers/microsoft.resourcehealth/events/{trackingId}/listSecurityAdvisoryImpactedResources?api-version=2023-10-01-preview
```
Operation: POST


#### Existing Events API Endpoint

**Security Advisories Subscription List Events** 

With API version 2023-10-01-preview (and future API versions) Existing Events API endpoint which returns the list of events(including security events with eventType: “Security”) will be restricted to pass only non-sensitive properties listed below for security events. 

```HTTP
https://management.azure.com/subscriptions/227b734f-e14f-4de6-b7fc-3190c21e69f6/providers/microsoft.ResourceHealth/events?api-version=2023-10-01-preview&$filter= "eventType eq SecurityAdvisory"
```
Operation: GET

The following in the events object in the response will be populated for security Advisories events using this endpoint: 
- Id
- name
- type
- nextLink
- properties

Only the following will be populated in the properties object:
- eventType
- eventSource
- status
- title
- platformInitiated
- level
- eventLevel
- isHIR
- priority
- subscriptionId
- lastUpdateTime
- impact

The impactedService property will be populated for the impact object, but only the following properties in the impactedServiceRegion object in the impact object will be populated:
- impactedService
- impactedSubscriptions
- impactedTenants
- impactedRegion
- status





## Next steps
- [Introduction to the Azure Service Health dashboard](service-health-overview.md)
- [Introduction to Azure Resource Health](resource-health-overview.md)
- [Frequently asked questions about Azure Resource Health](resource-health-faq.yml)
