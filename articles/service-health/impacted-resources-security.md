---
title: Resource impact from Azure security incidents
description: This article details where to find information from Azure Service Health about how Azure security incidents might affect your resources.
ms.topic: conceptual
ms.date: 3/3/2023
---

# Resource impact from Azure security incidents

In support of the experience of viewing affected resources, Service Health has enabled a new feature to:

- Display resources that are confirmed to be impacted by a security incident.
- Resource Health status of both confirmed and potentially impacted resources showing the availability of the resource.
- Enabling role-based access control (RBAC) for viewing security incident impacted resource information.

This article details what is communicated to users and where they can view information about their impacted resources.

>[!Note]
>This feature will be rolled out in phases. Initially, only selected subscription-level customers will get the experience. The rollout will gradually expand to 100 percent of subscription customers. It will go live for tenant-level customers in the future.

## Role Based Access (RBAC) For Security Incident Resource Impact

[Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) helps you manage who has access to Azure resources, what they can do with those resources, and what areas they have access to. Given the sensitive nature of security incidents, role-based access is leveraged to limit the audience of their impacted resource information. Users authorized with the following roles can view security impacted resource information:

**Subscription level**
- Subscription Owner
- Subscription Admin
- Service Health Security Reader (New custom role)

**Tenant level**
- Security Admin/Security Reader
- Global Admin/Tenant Admin
- Azure Service Health Privacy reader (New custom role)

## Viewing Impacted Resources for Security Incidents on the Service Health Portal

In the Azure portal, the Impacted Resources tab under Service Health > Security Advisories displays resources that are affected by a security incident. The following example of the Impacted Resources tab shows a security incident with impacted resources.

:::image type="content" source="./media/impacted-resource-sec/impact-security.PNG" alt-text="Screenshot of information about affected resources in Azure Service Health.":::

Service Health provides the below information to users whose resources are impacted by a security incident:

|Column  |Description |
|---------|---------|
|**Subscription ID**|Unique ID for the subscription that contains the affected resource|
|**Subscription Name**|Subscription name for the subscription that contains the affected resource|
|**Resource Name**|This will be the resource name of the resource.  It will be text only for security impacted resources|
|**Tenant Name**|Unique ID for the tenant that contains the impacted resource|
|**Tenant ID**|Unique ID for the tenant that contains the affected resource|
|**App ID**| description

## Accessing Impacted Resources programmatically via an API

Impacted resource information for security incidents can be retrieved programmatically using the Events API. To access the list of resources impacted by a Security incident, the following endpoints can be used by users authorized with the above-mentioned roles.

**Subscription**

```HTTP
https://management.azure.com/subscriptions/(“subscriptionID”)/providers/microsoft.resourcehealth/events/3N8Z-DD8/listSecurityAdvisoryImpactedResources?api-version=2022-10-01
```

**Tenant**

```HTTP
https://management.azure.com/providers/microsoft.resourcehealth/events/3N8Z-DD8/listSecurityAdvisoryImpactedResources?api-version=2022-10-01
```

## Next steps
- [Introduction to the Azure Service Health dashboard](service-health-overview.md)
- [Introduction to Azure Resource Health](resource-health-overview.md)
- [Frequently asked questions about Azure Resource Health](resource-health-faq.yml)