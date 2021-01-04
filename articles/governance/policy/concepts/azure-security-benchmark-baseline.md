---
title: Azure Policy security baseline for Azure Security Benchmark
description: The Azure Policy security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: azure-policy
ms.topic: conceptual
ms.date: 07/02/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure Policy security baseline for Azure Security Benchmark

This security baseline applies guidance from the [Azure Security Benchmark](../../../security/benchmarks/overview.md) to Azure Policy. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **compliance domains** and **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Policy. **Controls** not applicable to Azure Policy have been excluded. To see how Azure Policy completely maps to the Azure Security Benchmark, see the [full Azure Policy security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

For a mapping of the Azure Security Benchmark controls to built-in policy definitions via the built-in initiative, see [Regulatory Compliance: Azure Security Benchmark](../samples/azure-security-benchmark.md).

Azure Policy uses the term _Ownership_ in place of _Responsibility_. For details on _Ownership_, see [Azure Policy policy definitions](./definition-structure.md#type) and [Shared responsibility in the cloud](../../../security/fundamentals/shared-responsibility.md).


## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](../../../security/benchmarks/security-control-logging-monitoring.md).*

### 2.3: Enable audit logging for Azure resources

**Guidance**: Azure Policy uses activity logs, which are automatically enabled, to include event source, date, user, timestamp, source addresses, destination addresses, and other useful elements.

* [How to collect platform logs and metrics with Azure Monitor](../../../azure-monitor/platform/diagnostic-settings.md)

* [Understand logging and different log types in Azure](../../../azure-monitor/platform/platform-logs-overview.md)


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Identity and access control

*For more information, see [Security control: Identity and access control](../../../security/benchmarks/security-control-identity-access-control.md).*

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts. 

You can also enable a Just-In-Time / Just-Enough-Access solution by using [Azure AD Privileged Identity Management](../../../active-directory/privileged-identity-management/pim-configure.md) Privileged Roles or [Azure Resource Manager](../../../azure-resource-manager/management/overview.md).


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use PAWs (privileged access workstations) with MFA configured to log into and configure Azure resources.

* [Learn about Privileged Access Workstations](/windows-server/identity/securing-privileged-access/privileged-access-workstations)

* [How to enable MFA in Azure](../../../active-directory/authentication/howto-mfa-getstarted.md)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data protection

*For more information, see [Security control: Data protection](../../../security/benchmarks/security-control-data-protection.md).*

### 4.6: Use Azure RBAC to control access to resources

**Guidance**: Use Azure role-based access control (Azure RBAC) to control access to Azure Policy.

* [Azure RBAC permissions in Azure Policy](../overview.md#azure-rbac-permissions-in-azure-policy)

* [How to configure Azure RBAC](../../../role-based-access-control/role-assignments-portal.md)


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with activity logs to create alerts for when changes take place in Azure Policy.

* [How to create alerts for Azure activity log events](../../../azure-monitor/platform/alerts-activity-log.md)


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](../../../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy. Use the Azure Policy _modify_ effect to report on and enforce compliance and consistent tag governance.

* [Tutorial: Create and manage policies](../tutorials/create-and-manage.md)

* [Tutorial: Manage tag governance](../tutorials/govern-tags.md)


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.4: Define and Maintain an inventory of approved Azure resources

**Guidance**: Create an inventory of approved policy definitions and policy assignments as per your organizational needs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions.

* [How to configure and manage Azure Policy](../tutorials/create-and-manage.md)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure security benchmark](../../../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../../../security/benchmarks/security-baselines-overview.md)
