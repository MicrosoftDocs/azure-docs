---
title: Frequently asked questions for confidential nodes support on Azure Kubernetes Service (AKS)
description: Find answers to some of the common questions about Azure Kubernetes Service (AKS) & Azure Confidential Computing (ACC) nodes support.
author: agowdamsft
ms.service: container-service
ms.topic: conceptual
ms.date: 09/22/2020
ms.author: amgowda
---

# Frequently asked questions about Confidential Computing Nodes on Azure Kubernetes Service (AKS)

This article addresses frequent questions about Intel SGX based confidential computing nodes on Azure Kubernetes Service (AKS). If you have any further questions, email acconaks@microsoft.com.

## What Service Level Agreement (SLA) and Azure Support is provided during the preview? 

SLA is not provided during the product preview as defined [here](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). However, product support is provided through Azure support.

## What is attestation and how can we do attestation of apps running in enclaves? 

Attestation is the process of demonstrating and validating that a piece of software has been properly instantiated on the specific hardware platform. It also ensures its evidence is verifiable to provide assurances that it is running in a secure platform and has not been tampered with. [Read more](attestation.md) on how attestation is done for enclave apps.

## Can I bring my existing containerized applications and run it on AKS with Azure Confidential Computing? 

Yes, review the [confidential containers page](confidential-containers.md) for more details on platform enablers.

## What Intel SGX Driver version is installed in the AKS Image? 

Currently, Azure confidential computing DCSv2 VMs are installed with Intel SGX DCAP 1.33. 

## Can I open an Azure Support ticket if I run into issues? 

Yes. Azure support is provided during the preview. There is no SLA attached because the product is in preview stage.

## Can I inject post install scripts/customize drivers to the Nodes provisioned by AKS? 

No. [AKS-Engine based confidential computing nodes](https://github.com/Azure/aks-engine/blob/master/docs/topics/sgx.md) support confidential computing nodes that allow custom installations.

## Should I be using a Docker base image to get started on enclave applications? 

Various enablers (ISVs and OSS projects) provide ways to enable confidential containers. Review the [confidential containers page](confidential-containers.md) for more details and individual references to implementations.

## Can I run ACC Nodes with other standard AKS SKUs (build a heterogenous node pool cluster)? 

Yes, you can run different node pools within the same AKS cluster including ACC nodes. To target your enclave applications on a specific node pool, consider adding node selectors or applying EPC limits. Refer to more details on the quick start on confidential nodes [here](confidential-nodes-aks-get-started.md).

## Can I run Windows Nodes and windows containers with ACC? 

Not at this time. Contact us if you have Windows nodes or container needs. 

## What if my container size is more than available EPC memory? 

The EPC memory applies to the part of your application that is programmed to execute in the enclave. The total size of your container is not the right way to compare it with the max available EPC memory. In fact, DCSv2 machines with SGX, allow maximum VM memory of 32 GB where your untrusted part of the application would utilize. However, if your container consumes more than available EPC memory, then the performance of the portion of the  program running in the enclave might be impacted.

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

Currently,  Azure confidential computing DCsv2 SKU VMs support a single address space for the program executing in an enclave. Single process is a current limitation designed around high security. However, confidential container enablers may have alternate implementations to overcome this limitation.

## Do you automatically install any additional daemonsets to expose the SGX drivers? 

Yes. The name of the daemonset is sgx-device-plugin and sgx-quote-helper. Read more on their respective purposes [here](confidential-nodes-aks-overview.md).  

## What is the VM SKU I should be choosing for confidential computing nodes? 

DCSv2 SKUs. The [DCSv2 SKUs](../virtual-machines/dcv2-series.md) are available in the [supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines&regions=all).

## Can I still schedule and run non-enclave containers on confidential computing nodes? 

Yes. The VMs also have a regular memory that can run standard container workloads. Consider the security and threat model of your applications before you decide on the deployment models.

## Can I provision AKS with DCSv2 Node Pools through Azure portal? 

Yes. Azure CLI could also be used as an alternative as documented [here](confidential-nodes-aks-get-started.md).

## What Ubuntu version and VM generation is supported? 

18.04 on Gen 2. 

## Can we change the current Intel SGX DCAP diver version on AKS? 

No. To perform any custom installations, we recommend you choose [AKS-Engine Confidential Computing Worker Nodes](https://github.com/Azure/aks-engine/blob/master/docs/topics/sgx.md) deployments. 

## What version of Kubernetes do you support and recommend? 

We support and recommend Kubernetes version 1.16 and above 

## What are the known current limitation or technical limitations of the product in preview? 

- Supports Ubuntu 18.04 Gen 2 VM Nodes only 
- No Windows Nodes Support or Windows Containers Support
- EPC Memory based Horizontal Pod Autoscaling is not supported. CPU and regular memory-based scaling is supported.
- Dev Spaces on AKS for confidential apps is not currently supported

## Next Steps
Review the [confidential containers page](confidential-containers.md) for more details around confidential containers.