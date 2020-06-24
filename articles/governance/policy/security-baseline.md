---
title: Azure security baseline for Azure Policy
description: Azure security baseline for Azure Policy
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 06/24/2020
ms.author: mbaldwin
ms.custom: security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Policy

This security baseline applies guidance from the [Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview) to Azure Policy. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Policy. **Controls** not applicable to Azure Policy have been excluded. To see how Azure Policy completely maps to the Azure Security Benchmark, see the [full Azure Policy security baseline mapping file](https://github.com/adjohns/SecurityBenchmarks/blob/add-policy-excel-baselines/spreadsheets/security_baselines/azure-policy-security-baseline-latest.xlsx).


## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.3: Enable audit logging for Azure resources

**Guidance**: Azure Policy uses activity logs, which are automatically enabled, to include event source, date,

user, timestamp, source addresses, destination addresses, and other useful elements.

* [How to collect platform logs and metrics with Azure Monitor](../../azure-monitor/platform/diagnostic-settings.md)

* [Understand logging and different log types in Azure](../../azure-monitor/platform/platform-logs-overview.md)


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Identity and access control

*For more information, see [Security control: Identity and access control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts. You can also enable a Just-In-Time / Just-Enough-Access solution by using [Azure AD Privileged Identity Management](../../active-directory/privileged-identity-management/pim-configure.md) Privileged Roles or [Azure Resource Manager](../../azure-resource-manager/management/overview.md).


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use PAWs (privileged access workstations) with MFA configured to log into and configure Azure resources.

* [Learn about Privileged Access Workstations](/windows-server/identity/securing-privileged-access/privileged-access-workstations)

* [How to enable MFA in Azure](../../active-directory/authentication/howto-mfa-getstarted.md)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data protection

*For more information, see [Security control: Data protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Use Azure Active Directory role-based access control (RBAC) to control access to Azure Policy.

* [RBAC Permissions in Azure Policy](./overview.md#rbac-permissions-in-azure-policy)

* [How to configure RBAC in Azure](../../role-based-access-control/role-assignments-portal.md)


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with activity logs to create alerts for when changes take place in Azure Policy.

* [How to create alerts for Azure activity log events](../../azure-monitor/platform/alerts-activity-log.md)


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy. Use the Azure Policy _modify_ effect to report on and enforce compliance and consistent tag governance.

* [Tutorial: Create and manage policies](./tutorials/create-and-manage.md)

* [Tutorial: Manage tag governance](./tutorials/govern-tags.md)


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.4: Define and Maintain an inventory of approved Azure resources

**Guidance**: Create an inventory of approved policy definitions and policy assignments as per your organizational needs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions.

* [How to configure and manage Azure Policy](./tutorials/create-and-manage.md)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure security benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
