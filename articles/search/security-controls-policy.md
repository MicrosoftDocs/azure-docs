---
title: Azure Policy Regulatory Compliance controls for Azure Cognitive Search
description: Lists Azure Policy Regulatory Compliance controls available for Azure Cognitive Search. These built-in policy definitions provide common approaches to managing the compliance of your Azure resources.
ms.date: 08/03/2023
ms.topic: sample
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom: subject-policy-compliancecontrols
---
# Azure Policy Regulatory Compliance controls for Azure Cognitive Search

If you are using [Azure Policy](../governance/policy/overview.md) to enforce the recommendations in
[Microsoft cloud security benchmark](/azure/security/benchmarks/introduction), then you probably already know
that you can create policies for identifying and fixing non-compliant services. These policies might
be custom, or they might be based on built-in definitions that provide compliance criteria and
appropriate solutions for well-understood best practices.

For Azure Cognitive Search, there is currently one built-definition, listed below, that you can use
in a policy assignment. The built-in is for logging and monitoring. By using this built-in
definition in a [policy that you create](../governance/policy/assign-policy-portal.md), the system
will scan for search services that do not have [resource logging](monitor-azure-cognitive-search.md), and
then enable it accordingly.

[Regulatory Compliance in Azure Policy](../governance/policy/concepts/regulatory-compliance.md)
provides Microsoft-created and managed initiative definitions, known as _built-ins_, for the
**compliance domains** and **security controls** related to different compliance standards. This
page lists the **compliance domains** and **security controls** for Azure Cognitive Search. You can
assign the built-ins for a **security control** individually to help make your Azure resources
compliant with the specific standard.

[!INCLUDE [azure-policy-compliancecontrols-introwarning](../../includes/policy/standards/intro-warning.md)]

[!INCLUDE [azure-policy-compliancecontrols-search](../../includes/policy/standards/byrp/microsoft.search.md)]

## Next steps

- Learn more about [Azure Policy Regulatory Compliance](../governance/policy/concepts/regulatory-compliance.md).
- See the built-ins on the [Azure Policy GitHub repo](https://github.com/Azure/azure-policy).
