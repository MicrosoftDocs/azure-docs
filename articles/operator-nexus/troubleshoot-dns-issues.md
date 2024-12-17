---
title: "Azure Operator Nexus: DNS Issues"
description: Learn how to troubleshoot cluster DNS issues.
author: papadeltasierra
ms.author: pauldsmith
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus
ms.topic: troubleshooting
ms.date: 12/10/2024
# ms.custom: template-include
---

# Troubleshoot Nexus DNS Issues

NNF (Nexus Network Fabric) NNF provides a bridge between Nexus resources hosted by a Kubernetes
cluster running on Azure VMs (Virtual Machines) and Azure, accessing Azure resources via their
domain names. However a DNS (Domain Name System) error in NNF can mean that Azure resources
can't be contacted which impacts deployment or management of Nexus resources.

## Diagnosis

* Deployment or management of remote Nexus resources fails with "DeploymentFailed."
* Azure portal shows no errors being generated for the Azure resources that are unreachable; there are no errors because the failing operations aren't reaching the Azure resources at all.

## Mitigation steps

Follow these steps for mitigation.

### Trigger a DNS cache refresh for the NNF Workload Proxy
  
  ```bash
  # TBD awaiting feedback from folks who worked on the original IcMs as to
  # what commands should appear here.
  ```

## Verification

After the DNS cache is refreshed, create or manage operations are successful.

## Related content

- If you still have questions, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- For more information about support plans, see [Azure support plans](https://azure.microsoft.com/support/plans/response/).
