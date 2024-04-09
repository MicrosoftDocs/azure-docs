---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 03/18/2024
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Disks and OS image should support TrustedLaunch](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb03bb370-5249-4ea4-9fce-2552e87e45fa) |TrustedLaunch improves security of a Virtual Machine which requires OS Disk & OS Image to support it (Gen 2). To learn more about TrustedLaunch, visit [https://aka.ms/trustedlaunch](https://aka.ms/trustedlaunch) |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Trusted%20Launch/Disks_and_OS_Should_Support_TrustedLaunch.json) |
|[Virtual Machine should have TrustedLaunch enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc95b54ad-0614-4633-ab29-104b01235cbf) |Enable TrustedLaunch on Virtual Machine for enhanced security, use VM SKU (Gen 2) that supports TrustedLaunch. To learn more about TrustedLaunch, visit [https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch](../../../../articles/virtual-machines/trusted-launch.md) |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Trusted%20Launch/VirtualMachine_Should_Have_TrustedLaunch%20enabled.json) |
