---
title: Azure security baseline for Azure Policy
description: The Azure Policy security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: azure-policy
ms.topic: conceptual
ms.date: 02/17/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Policy

This security baseline applies guidance from the [Azure Security Benchmark](../../../security/benchmarks/overview.md) to Azure Policy. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **compliance domains** and **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Policy. **Controls** not applicable to Azure Policy have been excluded. To see how Azure Policy completely maps to the Azure Security Benchmark, see the [full Azure Policy security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

For a mapping of the Azure Security Benchmark controls to built-in policy definitions via the built-in initiative, see [Regulatory Compliance: Azure Security Benchmark](../samples/azure-security-benchmark.md).

Azure Policy uses the term _Ownership_ in place of _Responsibility_. For details on _Ownership_, see [Azure Policy policy definitions](./definition-structure.md#type) and [Shared responsibility in the cloud](../../../security/fundamentals/shared-responsibility.md).

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../../../security/benchmarks/security-control-logging-monitoring.md).*

### 2.3: Enable audit logging for Azure resources

**Guidance**: Azure Policy uses activity logs, which are automatically enabled, to include event source, date, user, timestamp, source addresses, destination addresses, and other useful elements.

- [How to collect platform logs and metrics with Azure Monitor](/azure/azure-monitor/platform/diagnostic-settings)

- [Understand logging and different log types in Azure](/azure/azure-monitor/platform/platform-logs-overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../../../security/benchmarks/security-control-identity-access-control.md).*

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts. You can also enable a Just-In-Time / Just-Enough-Access solution by using [Azure Active Directory (Azure AD) Privileged Identity Management](../../../active-directory/privileged-identity-management/pim-configure.md) Privileged Roles or [Azure Resource Manager](../../../azure-resource-manager/management/overview.md).

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/home/mbaldwin/docs/asb/azure-docs-pr/articles/governance/policy/samples/azure-security-benchmark.md) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/security-center-recommendations.md). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/home/mbaldwin/docs/asb/azure-docs-pr/articles/security-center/azure-defender.md) plan for the related services.

**Azure Policy built-in definitions - Microsoft.GuestConfiguration**:

[!INCLUDE [Resource Policy for Microsoft.GuestConfiguration 3.3](../../../../includes/policy/standards/asb/rp-controls/microsoft.guestconfiguration-3-3.md)]

### 3.6: Use secure, Azure-managed workstations for administrative tasks

**Guidance**: Use privileged access workstations (PAWs) with multifactor authentication configured to log into and configure Azure resources.

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable multifactor authentication in Azure](../../../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../../../security/benchmarks/security-control-data-protection.md).*

### 4.6: Use Azure RBAC to control access to resources 

**Guidance**: Use Azure role-based access control (Azure RBAC) to control access to Azure Policy.

- [Azure RBAC permissions in Azure Policy](https://docs.microsoft.com/azure/governance/policy/overview#azure-rbac-permissions-in-azure-policy)

- [How to configure Azure RBAC](../../../role-based-access-control/role-assignments-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with activity logs to create alerts for when changes take place in Azure Policy.

- [How to create alerts for Azure activity log events](/azure/azure-monitor/platform/alerts-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../../../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy. Use the Azure Policy _modify_ effect to report on and enforce compliance and consistent tag governance.

- [Tutorial: Create and manage policies](../tutorials/create-and-manage.md)

- [Tutorial: Manage tag governance](../tutorials/govern-tags.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: Create an inventory of approved policy definitions and policy assignments as per your organizational needs.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your
subscriptions.

- [How to configure and manage Azure Policy](../tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
