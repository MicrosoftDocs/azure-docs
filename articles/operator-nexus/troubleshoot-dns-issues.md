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

NNF (Nexus Network Fabric) provides a bridge between Nexus resources hosted by a Kubernetes
cluster running on Azure VMs (Virtual Machines) and Azure, accessing Azure resources via their
domain names. However a DNS (Domain Name System) error in NNF can mean that Azure resources
can't be contacted which impacts deployment or management of Nexus resources.

The DNS proxy that causes this error is an [Envoy DNS Proxy](https://www.envoyproxy.io/docs/envoy/latest/)
running via a Kubernetes deployment in either an infrastructure or tenant Kubernetes cluster.
The precise location of the DNS proxy is determined when the customer
deploys their NAKS (Nexus Azure Kubernetes Service) cluster or during some other
deployment. 

## Diagnosis

* Deployment or management of remote Nexus resources fails with "DeploymentFailed."
* Azure portal shows no errors being generated for the Azure resources that are unreachable; there are no errors because the failing operations aren't reaching the Azure resources at all.

## Mitigation steps

### Trigger a DNS cache refresh for the NNF Workload Proxy

- Identify the Infrastructure or Tenant Kubernetes Cluster on which the DNS proxy is running from the initial configuration and deployment process
- Log in to the Kubernetes cluster
  - Using the Azure portal, find your cluster
  - From the _Overview_ blade, click the _Connect_ command (between _Refresh_ and _Delete_)
  - Follow the instructions from the resulting pop-up window that explain how to connect to the Kubernetes cluster
- Identify the DNS proxy deployment using this command
  ```bash
  $ kubectl get deployments --all-namespaces=true | grep envoy
  ```
- Restart the deployment, which causes the DNS caching to be reset, using this command:
  ```bash
  kubectl rollout restart deployment <your-envoy-deployment-name> --namespace <namespace-where-envoy-pod-exists>
  ```

## Verification

After the DNS cache is refreshed, create or manage operations are successful.

## Related content

- If you still have questions, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- For more information about support plans, see [Azure support plans](https://azure.microsoft.com/support/plans/response/).
