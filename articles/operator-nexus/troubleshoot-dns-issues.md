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

Nexus Network Fabric (NNF) provides a bridge between Nexus Far Edge (??? new name ???) resources and Azure but a DNS error in NNF can mean that Azure resources cannot be contacted which impacts deployment or managment of ??? resources.

## Diagnosis

* Deployment or management of remote Nexus resources fails with "DeploymentFailed" as a typical error code.  Other errors include, but are not limited to, "...could not login to OCI registry..." and "GatewayTimeout"
* Azure portal shows no errors being generated for Azure resources that appear to not be responding.

## Mitigation steps

Follow these steps for mitigation.

### Trigger a DNS cache refresh for the NNF Workload Proxy

?????????

1. From the cluster resource page in the Azure portal, add a tag to the cluster resource.
1. The resource moves out of the `Accepted` state.
    
    ```bash
    az login
    az account set --subscription <SUBSCRIPTION>
    az resource tag --tags exampleTag=exampleValue --name <CLUSTER> --resource-group <CLUSTER_RG> --resource-type "Microsoft.ContainerService/managedClusters"
    ```

## Verification

After the DNS cache has been refreshed, create/manage operations are successful.

## Related content

- If you still have questions, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- For more information about support plans, see [Azure support plans](https://azure.microsoft.com/support/plans/response/).
