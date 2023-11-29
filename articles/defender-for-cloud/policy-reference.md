---
title: Built-in policy definitions
description: Lists Azure Policy built-in policy definitions for Microsoft Defender for Cloud. These built-in policy definitions provide common approaches to managing your Azure resources.
ms.topic: reference
ms.date: 11/21/2023
ms.custom: subject-policy-reference
---

# Azure Policy built-in definitions for Microsoft Defender for Cloud

This page is an index of [Azure Policy](../governance/policy/overview.md) built-in policy
definitions related to Microsoft Defender for Cloud. The following groupings of policy definitions are
available:

- The [initiatives](#microsoft-defender-for-cloud-initiatives) group lists the Azure Policy initiative definitions in the "Defender for Cloud" category.
- The [default initiative](#defender-for-clouds-default-initiative-microsoft-cloud-security-benchmark) group lists all the Azure Policy definitions that are part of Defender for Cloud's default initiative, [Microsoft cloud security benchmark](/security/benchmark/azure/introduction). This Microsoft-authored, widely respected benchmark builds on controls from the [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/azure/) and the [National Institute of Standards and Technology (NIST)](https://www.nist.gov/) with a focus on cloud-centric security.
- The [category](#microsoft-defender-for-cloud-category) group lists all the Azure Policy definitions in the "Defender for Cloud" category.

For more information about security policies, see [Working with security policies](./tutorial-security-policy.md). For other Azure Policy built-ins for other services, see [Azure Policy built-in definitions](../governance/policy/samples/built-in-policies.md).

The name of each built-in policy definition links to the policy definition in the Azure portal. Use the link in the **Version** column to view the source on the [Azure Policy GitHub repo](https://github.com/Azure/azure-policy).

## Microsoft Defender for Cloud initiatives

To learn about the built-in initiatives that are monitored by Defender for Cloud, see the following table:

[!INCLUDE [azure-policy-reference-policyset-security-center](../../includes/policy/reference/bycat/policysets-security-center.md)]

## Defender for Cloud's default initiative (Microsoft cloud security benchmark)

To learn about the built-in policies that are monitored by Defender for Cloud, see the following table:

[!INCLUDE [azure-policy-reference-init-asc](../../includes/policy/reference/custom/init-asc.md)]

## Microsoft Defender for Cloud category

[!INCLUDE [azure-policy-reference-category-securitycenter](../../includes/policy/reference/bycat/policies-security-center.md)]

## Next steps

In this article, you learned about Azure Policy security policy definitions in Defender for Cloud. To learn more about initiatives, policies, and how they relate to Defender for Cloud's recommendations, see [What are security policies, initiatives, and recommendations?](security-policy-concept.md).
