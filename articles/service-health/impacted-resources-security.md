---
title: Resource impact from Azure security incidents
description: This article details where to find information from Azure Service Health about how Azure security incidents impact your resources.
ms.topic: conceptual
ms.date: 3/3/2023
---

# Resource impact from Azure security incidents

In support of the experience of viewing impacted resources, Service Health has enabled a new feature to:

- Display resources impacted by a security incident
- Enabling role-based access control (RBAC) for viewing security incident impacted resource information

This article details what is communicated to users and where they can view information about their impacted resources.

>[!Note]
>This feature will be rolled out in phases. The rollout will gradually expand to 100 percent of subscription and tenant customers.

## Role Based Access (RBAC) For Security Incident Resource Impact

[Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) helps you manage who has access to Azure resources, what they can do with those resources, and what areas they have access to. Given the sensitive nature of security incidents, role-based access is leveraged to limit the audience of their impacted resource information. Along with resource information, Service Health provides the below information to users whose resources are impacted by a security incident:

Users authorized with the following roles can view security impacted resource information:

**Subscription level**
- Subscription Owner
- Subscription Admin
- Service Health Security Reader (New custom role)

**Tenant level**
- Security Admin/Security Reader
- Global Admin/Tenant Admin
- Azure Service Health Privacy reader (New custom role)

## Viewing Impacted Resources for Security Incidents on the Service Health Portal

In the Azure portal, the **Impacted Resources** tab under **Service Health** > **Security Advisories** displays resources that are impacted by a security incident. Along with resource information, Service Health provides the below information to users whose resources are impacted by a security incident:

|Column  |Description |
|---------|---------|
|**Subscription ID**|Unique ID for the subscription that contains the impacted resource|
|**Subscription Name**|Subscription name for the subscription that contains the impacted resource|
|**Tenant Name**|Tenant name for the tenant that contains the impacted resource|
|**Tenant ID**|Unique ID for the tenant that contains the impacted resource|

The following examples show a security incident with impacted resources from the subscription and tenant scope.

**Subscription**

:::image type="content" source="./media/impacted-resource-sec/impact-security.PNG" alt-text="Screenshot of information about impacted resources from subscription scope in Azure Service Health.":::

**Tenant**

:::image type="content" source="./media/impacted-resource-sec/security-tenant.PNG" alt-text="Screenshot of information about impacted resources from tenant scope in Azure Service Health.":::


## Accessing Impacted Resources programmatically via an API

Impacted resource information for security incidents can be retrieved programmatically using the Events API. To access the list of resources impacted by a security incident, users authorized with the above-mentioned roles can use the endpoints below. For details on how to access this data, see the [API documentation](/rest/api/resourcehealth/2022-10-01/security-advisory-impacted-resources).

**Subscription**

```HTTP
https://management.azure.com/subscriptions/(“Subscription ID”)/providers/microsoft.resourcehealth/events/("Tracking ID")/listSecurityAdvisoryImpactedResources?api-version=2022-10-01
```

**Tenant**

```HTTP
https://management.azure.com/providers/microsoft.resourcehealth/events/("Tracking ID")/listSecurityAdvisoryImpactedResources?api-version=2022-10-01
```

## Next steps
- [Introduction to the Azure Service Health dashboard](service-health-overview.md)
- [Introduction to Azure Resource Health](resource-health-overview.md)
- [Frequently asked questions about Azure Resource Health](resource-health-faq.yml)
