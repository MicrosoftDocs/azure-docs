---
title: Built-in policy definitions for Azure Security Center
description: Lists Azure Policy built-in policy definitions for Azure Security Center. These built-in policy definitions provide common approaches to managing your Azure resources.
ms.date: 04/21/2021
ms.topic: reference
author: memildin
ms.author: memildin
ms.service: security-center
ms.custom: subject-policy-reference
---
# Azure Policy built-in definitions for Azure Security Center

This page is an index of [Azure Policy](../governance/policy/overview.md) built-in policy
definitions related to Azure Security Center. The following groupings of policy definitions are
available:

- The [initiatives](#azure-security-center-initiatives) group lists the Azure Policy initiative
  definitions in the "Security Center" category.
- The [default initiative](#azure-security-center-initiatives) group lists all the Azure Policy
  definitions that are part of Security Center's default initiative,
  [Azure Security Benchmark](https://docs.microsoft.com/security/benchmark/azure/introduction). This Microsoft-authored,
  widely respected benchmark builds on controls from the
  [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/azure/) and the
  [National Institute of Standards and Technology (NIST)](https://www.nist.gov/) with a focus on
  cloud-centric security.
- The [category](#azure-security-center-category) group lists all the Azure Policy definitions in
  the "Security Center" category.

For more information about security policies, see
[Working with security policies](./tutorial-security-policy.md). For additional Azure Policy
built-ins for other services, see
[Azure Policy built-in definitions](../governance/policy/samples/built-in-policies.md).

The name of each built-in policy definition links to the policy definition in the Azure portal. Use
the link in the **Version** column to view the source on the
[Azure Policy GitHub repo](https://github.com/Azure/azure-policy).

## Azure Security Center initiatives

To learn about the built-in initiatives that are monitored by Security Center, see the following table:

[!INCLUDE [azure-policy-reference-policyset-security-center](../../includes/policy/reference/bycat/policysets-security-center.md)]

## Security Center's default initiative (Azure Security Benchmark)

To learn about the built-in policies that are monitored by Security Center, see the following table:

[!INCLUDE [azure-policy-reference-init-asc](../../includes/policy/reference/custom/init-asc.md)]

## Azure Security Center category

[!INCLUDE [azure-policy-reference-category-securitycenter](../../includes/policy/reference/bycat/policies-security-center.md)]

## Next steps

In this article, you learned about Azure Policy security policy definitions in Security Center. To
learn more about initiatives, policies, and how they relate to Security Center's recommendations, see [What are security policies, initiatives, and recommendations?](security-policy-concept.md).
