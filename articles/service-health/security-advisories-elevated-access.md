---
title: Elevated access for viewing Security Advisories
description: This article details an upcoming change which will require users to obtain elevated access roles in order to view Security Advisory details
ms.topic: conceptual
ms.date: 10/10/2023
---

# Security Advisory Elevated Access

Security Advisories are displayed to users at Subscription or Tenant level. Today any users who have subscription reader or above can access the Security Advisories (Summary and Issue updates) details at Subscription scope. Users with following tenant roles can also access the tenant level security advisories(Summary and Issue updates) notifications. 

## What are Impacted Resources within Security Advisories?
In 2023, Impacted resources tab (when data is available) is introduced for Security Advisories events. Since the data displayed in this tab is sensitive, elevated access is required for customers accessing the data via UI or API. Below is the list of roles that can access the Impacted resources tab. 

**Subscription level**
- Subscription Owner
- Subscription Admin
- Custom Roles with Microsoft.ResourceHealth/events/listSecurityAdvisoryImpactedResources/action permissions or Microsoft.ResourceHealth/events/action permissions

**Tenant level**
- Security Admin/Security Reader
- Global Admin/Tenant Admin
- Custom Roles with Microsoft.ResourceHealth/events/listSecurityAdvisoryImpactedResources/action permissions or Microsoft.ResourceHealth/events/action permissions

If users without the access mentioned above try to access the Impacted Resources tab, they get an error. Below is the screenshot of this experience. More details around this experience on the UI is detailed out here.

## Next steps
- [Introduction to the Azure Service Health dashboard](service-health-overview.md)
- [Introduction to Azure Resource Health](resource-health-overview.md)
- [Frequently asked questions about Azure Resource Health](resource-health-faq.yml)
