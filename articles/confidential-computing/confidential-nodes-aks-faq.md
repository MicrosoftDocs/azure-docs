---
title: Frequently asked questions for Confidential Nodes Support on Azure Kubernetes Service(AKS)
description: Find answers to some of the common questions about AKS & Azure Confidential Computing (ACC) Nodes Support.
author: agowdamsft
ms.service: container-compute
ms.topic: conceptual
ms.date: 09/22/2020
ms.author: amgowda
---

# Frequently asked questions about Confidential Computing Nodes on Azure Kubernetes Service (AKS)

This article addresses frequent questions about Intel SGX based confidential computing nodes on (AKS).

## What Service Level Agreement (SLA) and Azure Support is provided during the preview? 

SLA is not provided during the product preview as defined [here](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). However, Product support is provided through Azure Support.

## What is attestation and how can we do attestation of apps running in enclaves? 

Attestation is the process of demonstrating and validating that a piece of software has been properly instantiated on the specific hardware platform and its evidence is verifiable to provide assurances that it is running in a secure platform and has not been tampered with. Read more here on how attestation is done for enclave apps here [here](/faq.md)

## Can I bring my existing containerized applications and run it on AKS with Azure Confidential Computing? 

Yes review the [confidential containers page](confidential-containers.md) for more details on platform enablers.

## What Intel SGX Driver version is installed in the AKS Image? 

Currently Azure Confidential Computing(ACC) DCSv2 VMs are installed with Intel SGX DCAP 1.33. We also work closely with Intel to keep our patches updated. If you have a need for a support of particular version raise a product feedback here https://aka.ms/accaksfeedback or email the product team at acconaks@microsoft.com 

## Can I open an Azure Support ticket if I run into issues? 

Yes Azure support is provided during the preview. However, there is no SLA attached because the product is in preview stage as stated in the previous FAQ. 

## Can I inject post install scripts/customize drivers to the Nodes provisioned by AKS? 

No. If you have custom needs please choose [AKS-Engine based confidential computing nodes](https://github.com/Azure/aks-engine/blob/master/docs/topics/sgx.md).

## Is there is a Docker base image I should be using to get started on enclave applications? 

Various enablers both ISV's and OSS projects have different ways to enable confidential containers. Review the [confidential containers page](confidential-containers.md) for more details and individual references to implementations.

## Can I run ACC Nodes with other standard AKS SKUs (build a heterogenous node pool cluster)? 

Yes, you can run different node pools within the same AKS cluster including ACC nodes. To target your enclave applications on a specific node pool consider adding node selectors or by applying EPC limits. Refer to more details on the quick start on confidential nodes [here](confidential-nodes-aks-getstarted.md) 

## Can I run Windows Nodes with ACC? 

Not at this time but if we would like to hear from you if and by when by leaving feedback here: https://aka.ms/accaksfeedback 

## How can I send feedback/reach out about the product or get assistance on my needs? 

You can send feedback directly to product team by opening a feedback here https://aka.ms/accaksfeedback or email us at acconaks@microsoft.com 

## What if my container size is more than available EPC memory? 

The EPC memory applies to the part of your application that is programmed to be executed in the enclave. The total size of your container is not the right way to compare it with the max available EPC memory. In fact, DCSv2 machines where SGX is made available allow maximum VM memory of 32 GB where your untrusted part of the application would utilize. However, if your container consumes more than available EPC memory then the performance of the part of program running in the enclave might be impacted.

To better manage the EPC memory in the worker nodes, consider the EPC memory-based limits management through Kubernetes. Follow the example below as reference

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: sgx-test
  labels:
    app: sgx-test
spec:
  template:
    metadata:
      labels:
        app: sgx-test
    spec:
      containers:
      - name: sgxtest
        image: oeciteam/sgx-test:1.0
        resources:
          limits:
            kubernetes.azure.com/sgx_epc_mem_in_MiB: 10 # This limit will automatically place the job into confidential computing node. Alternatively you can target deployment to nodepools
      restartPolicy: Never
  backoffLimit: 0
```

## What happens if my enclave consumes more than maximum available EPC memory? 

Total available EPC memory is shared between the enclave applications in the same VMs or worker nodes. If your application uses EPC memory more than available then the application performance might be impacted. For this reason, we recommend you setting toleration per application in your deployment yaml file to better manage the available EPC memory per worker nodes as shown in the examples above. Alternatively, you can always choose to move up on the worker node pool VM sizes or add more nodes. 

## Why can't I do forks () and exec to run multiple processes in my enclave application? 

Currently Intel SGX powering the Azure Confidential Computing (ACC) DC SKU VMs supports a single address space for the program executing in an enclave. Single process is a current limitation designed around high security. However, confidential container enablers may have alternate implementations to overcome this limitation.

## Do you automatically install any additional daemonsets to expose the SGX drivers? 

Yes. The name of the daemonset is sgx-device-plugin and sgx-quote-helper. Read more on their respective purposes [here](confidential-nodes-aks-overview.md#features).  

## What is the VM SKU I should be choosing for confidential computing nodes? 

DCSv2 SKUs. Here is the list of [DCSv2 SKUs](https://docs.microsoft.com/en-us/azure/virtual-machines/dcv2-series) in the [supported regions](https://azure.microsoft.com/en-us/global-infrastructure/services/?products=virtual-machines&regions=all) (all GA regions are supported on AKS). 

## Can I still schedule and run non-enclave containers on confidential computing nodes? 

Yes. The VMs also have a regular memory that can run standard container workloads. Consider the security and threat model of your applications before you decide on the deployment models.

## Can I provision AKS with DCSv2 Node Pools through Azure portal? 

Yes. Azure CLI could also be used as an alternative as documented [here](confidential-nodes-aks-getstarted.md).

## What Ubuntu version and VM generation is supported? 

18.04 on Gen 2. Have questions let us know an https://aka.ms/accaksfeedback 

## Can we change the current Intel SGX DCAP diver version on AKS? 

No. To perform any custom installations we recommend you choose [AKS-Engine Confidential Computing Worker Nodes](https://github.com/Azure/aks-engine/blob/master/docs/topics/sgx.md) deployments. 

## What version of Kubernetes do you support and recommend? 

We support and recommend Kubernetes version 1.16 and above 

## What are the known current limitation or technical limitations of the product in preview? 

1. Supports Ubuntu 18.04 Gen 2 VM Nodes only 
2. No Windows Nodes Support or Windows Containers Support
3. EPC Memory based Horizontal Pod Autoscaling is not supported. CPU and regular memory-based scaling is supported.
4. Dev Spaces ON AKS not currently Supported for Enclave apps 

<!-- LINKS - internal -->

[aks-upgrade]: ./upgrade-cluster.md
[aks-cluster-autoscale]: ./cluster-autoscaler.md
[aks-advanced-networking]: ./configure-azure-cni.md
[aks-rbac-aad]: ./azure-ad-integration-cli.md
[node-updates-kured]: node-updates-kured.md
[aks-preview-cli]: /cli/azure/ext/aks-preview/aks
[az-aks-create]: /cli/azure/aks#az-aks-create
[aks-rm-template]: /azure/templates/microsoft.containerservice/2019-06-01/managedclusters
[aks-cluster-autoscaler]: cluster-autoscaler.md
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[aks-windows-cli]: windows-container-cli.md
[aks-windows-limitations]: windows-node-limitations.md
[reservation-discounts]:../cost-management-billing/reservations/save-compute-costs-reservations.md
[api-server-authorized-ip-ranges]: ./api-server-authorized-ip-ranges.md
[multi-node-pools]: ./use-multiple-node-pools.md
[availability-zones]: ./availability-zones.md
[private-clusters]: ./private-clusters.md
[bcdr-bestpractices]: ./operator-best-practices-multi-region.md#plan-for-multiregion-deployment
[availability-zones]: ./availability-zones.md
[az-regions]: ../availability-zones/az-region.md
[uptime-sla]: ./uptime-sla.md

<!-- LINKS - external -->
[aks-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service
[auto-scaler]: https://github.com/kubernetes/autoscaler
[cordon-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/
[admission-controllers]: https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/
[private-clusters-github-issue]: https://github.com/Azure/AKS/issues/948
[csi-driver]: https://github.com/Azure/secrets-store-csi-driver-provider-azure
[vm-sla]: https://azure.microsoft.com/support/legal/sla/virtual-machines/
