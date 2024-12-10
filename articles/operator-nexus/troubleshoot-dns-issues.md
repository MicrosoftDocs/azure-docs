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

Nexus Network Fabric (NNF) provides a bridge between some new name for Nexus Far Edge resources and Azure but a DNS (Domain Name System) error in NNF can mean that Azure resources can't be contacted which impacts deployment or management of some new name for Nexus Far Edge resources.

## Diagnosis

* Deployment or management of remote Nexus resources fails with "DeploymentFailed", often because of a failure to access an ACR (Azure Container Registry) or similar Azure resource.  Errors observed include but are not limited to:
  * "...could not login to OCI registry..."
  * "GatewayTimeout".
* Azure portal shows no errors being generated for the Azure resources that can't be reached; this is because the failing operations are not actually accessing the resources at all.

## Mitigation steps

Follow these steps for mitigation.

### Trigger a DNS cache refresh for the NNF Workload Proxy
   
    ```bash
    az login
    az account set --subscription <SUBSCRIPTION>
    az resource tag --tags exampleTag=exampleValue --name <CLUSTER> --resource-group <CLUSTER_RG> --resource-type "Microsoft.ContainerService/managedClusters"
    ```

## Verification

After the DNS cache has been refreshed, create or manage operations are successful.

## Related content

- If you still have questions, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- For more information about support plans, see [Azure support plans](https://azure.microsoft.com/support/plans/response/).
