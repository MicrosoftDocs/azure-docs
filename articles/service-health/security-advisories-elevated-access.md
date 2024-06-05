---
title: Elevated access for viewing Security Advisories
description: This article details an upcoming change that requires users to obtain elevated access roles in order to view Security Advisory details
ms.topic: conceptual
ms.date: 10/10/2023
---
# Elevated access for viewing Security Advisories

This article details an upcoming change that requires users to obtain elevated access roles in order to view Security Advisory details on Azure Service Health.

## What are Security Advisories?

Azure customers use [Service Health](service-health-overview.md) to stay informed about security events that are impacting their critical and noncritical business applications. Security event notifications are displayed on Azure Service Health within the Security Advisories blade. Important security advisory details are displayed in three tabs: Summary, Impacted Resources, and Issue Updates.

:::image type="content" source="./media/impacted-resource-sec/security-advisories.PNG" alt-text="Screenshot of Service Health Security Advisories Blade.":::


## Who can view Security Advisories?
Security Advisories are displayed to users at the subscription or tenant level. Users with the subscription reader role or higher; can view Security Advisory details on the Summary and Issue update tabs. Users with tenant roles [listed here](admin-access-reference.md) can also access tenant level security advisory details on the Summary and Issue update tabs.

## What are Impacted Resources within Security Advisories?

In 2023, the Impacted resources tab was introduced for Security Advisory events. Since details displayed in this tab are sensitive, role based access (RBAC) is required for customers viewing security impacted resources via UI or API. [Review this article](impacted-resources-security.md) for more information on the current RBAC requirements for accessing security impacted resources.

:::image type="content" source="./media/impacted-resource-sec/impact-security.PNG" alt-text="Screenshot of information about impacted resources from subscription scope in Azure Service Health.":::

>[!Note]
> The above screenshots reflect the RBAC experience for the Security Advisories as of today.  

## What is changing in Security Advisories?

In the future, accessing Security Advisories will require elevated access across the Summary, Impacted Resources, and Issue Updates tabs. Users who have subscription reader access, or tenant roles at tenant scope, will not be able to view security advisory details until they get the required roles.

### 1. On the Service Health portal
A banner will be displayed to the users until April 2024 on the Summary and Issue Updates tabs prompting customers to get the right roles to view these tabs in future. 

:::image type="content" source="./media/impacted-resource-sec/access-banner-1.PNG" alt-text="Screenshot displaying the new role based access banner for security advisories.":::

After April 2024, an error message on the Summary and Issue Updates tabs will be displayed to users who do not have the following required roles:

**Subscription level**
- Subscription Owner
- Subscription Admin
- Custom Roles with Microsoft.ResourceHealth/events/fetchEventDetails/action permissions or Microsoft.ResourceHealth/events/action permissions

**Tenant level**
- Security Admin/Security Reader
- Global Admin/Tenant Admin
- Custom Roles with Microsoft.ResourceHealth/events/fetchEventDetails/action permissions or Microsoft.ResourceHealth/events/action permissions

### 2. Service Health API Changes

Events API users will need to update their code to use the new **ARM endpoint (/fetchEventDetails)** to receive Security Advisories notification details. If users have the above-mentioned roles, they can view event details for a specific event with the new endpoint. The existing endpoint **(/events)** that returns all Service Health event types impacting a subscription or tenant, will no longer return sensitive security notification details. This update will be made to API version 2023-10-01-preview and future versions. 

The new and existing endpoints listed below will return the security notification details for a specific event.

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
- Customers authorized with the above-mentioned roles can use the following endpoints to access the list of resources impacted by a Security Incident
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

With API version 2023-10-01-preview (and future API versions), the existing Events API endpoint which returns the list of events(including security events with eventType: “Security”) will be restricted to pass only nonsensitive properties listed below for security events. 

```HTTP
https://management.azure.com/subscriptions/227b734f-e14f-4de6-b7fc-3190c21e69f6/providers/microsoft.ResourceHealth/events?api-version=2023-10-01-preview&$filter= "eventType eq SecurityAdvisory"
```
Operation: GET

The following in the events object response will be populated for security Advisories events using this endpoint: 
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
- [Stay informed about Azure security events](stay-informed-security.md)
- [Introduction to Azure Resource Health](resource-health-overview.md)
- [Frequently asked questions about Azure Resource Health](resource-health-faq.yml)
