---
title: Frequently asked questions for confidential nodes support on Azure Kubernetes Service (AKS)
description: Find answers to some of the common questions about Azure Kubernetes Service (AKS) & Azure Confidential Computing (ACC) nodes support.
author: agowdamsft
ms.service: container-service
ms.subservice: confidential-computing
ms.topic: conceptual
ms.date: 02/09/2020
ms.author: amgowda
---

# Frequently asked questions about Confidential Computing Nodes on Azure Kubernetes Service (AKS)

This article addresses frequent questions about Intel SGX based confidential computing nodes on Azure Kubernetes Service (AKS). If you have any further questions, email **acconaks@microsoft.com**.

<a name="1"></a>
### Are the confidential computing nodes on AKS in GA? ###
Yes

<a name="2"></a>
### What is attestation and how can we do attestation of apps running in enclaves? ###
Attestation is the process of demonstrating and validating that a piece of software has been properly instantiated on the specific hardware platform. It also ensures its evidence is verifiable to provide assurances that it is running in a secure platform and has not been tampered with. [Read more](attestation.md) on how attestation is done for enclave apps.

<a name="3"></a>
### Can I enable Accelerated Networking with Azure confidential computing AKS Clusters? ###
No. Accelerated Networking is not supported on DCSv2 Virtual machines that makeup confidential computing nodes on AKS. 

<a name="4"></a>
### Can I bring my existing containerized applications and run it on AKS with Azure Confidential Computing? ###
Yes, review the [confidential containers page](confidential-containers.md) for more details on platform enablers.

<a name="5"></a>
### What version of Intel SGX Driver version is on the AKS Image for confidential nodes? ### 
Currently, Azure confidential computing DCSv2 VMs are installed with Intel SGX DCAP 1.33. 

<a name="6"></a>
### Can I inject post install scripts/customize drivers to the Nodes provisioned by AKS? ###
No. [AKS-Engine based confidential computing nodes](https://github.com/Azure/aks-engine/blob/master/docs/topics/sgx.md) support confidential computing nodes that allow custom installations and have full control over your Kubernetes control plane.
<a name="7"></a>

### Should I be using a Docker base image to get started on enclave applications? ###
Various enablers (ISVs and OSS projects) provide ways to enable confidential containers. Review the [confidential containers page](confidential-containers.md) for more details and individual references to implementations.

<a name="8"></a>
### Can I run ACC Nodes with other standard AKS SKUs (build a heterogenous node pool cluster)? ###

Yes, you can run different node pools within the same AKS cluster including ACC nodes. To target your enclave applications on a specific node pool, consider adding node selectors or applying EPC limits. Refer to more details on the quick start on confidential nodes [here](confidential-nodes-aks-get-started.md).

<a name="9"></a>
### Can I run Windows Nodes and windows containers with ACC? ###
Not at this time. Contact the product team at *acconaks@microsoft.com* if you have Windows nodes or container needs. 

<a name="10"></a>
### What if my container size is more than available EPC memory? ###
The EPC memory applies to the part of your application that is programmed to execute in the enclave. The total size of your container is not the right way to compare it with the max available EPC memory. In fact, DCSv2 machines with SGX, allow maximum VM memory of 32 GB where your untrusted part of the application would utilize. However, if your container consumes more than available EPC memory, then the performance of the portion of the program running in the enclave might be impacted.

To better manage the EPC memory in the worker nodes, consider the EPC memory-based limits management through Kubernetes. Follow the example below as reference.

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
            kubernetes.azure.com/sgx_epc_mem_in_MiB: 10 # This limit will automatically place the job into confidential computing node. Alternatively, you can target deployment to nodepools
      restartPolicy: Never
  backoffLimit: 0
```
<a name="11"></a>
### What happens if my enclave consumes more than maximum available EPC memory? ###

Total available EPC memory is shared between the enclave applications in the same VMs or worker nodes. If your application uses EPC memory more than available, then the application performance might be impacted. For this reason, we recommend you setting toleration per application in your deployment yaml file to better manage the available EPC memory per worker nodes as shown in the examples above. Alternatively, you can always choose to move up on the worker node pool VM sizes or add more nodes. 

<a name="12"></a>
### Why can't I do forks () and exec to run multiple processes in my enclave application? ###

Currently, Azure confidential computing DCsv2 SKU VMs support a single address space for the program executing in an enclave. Single process is a current limitation designed around high security. However, confidential container enablers may have alternate implementations to overcome this limitation.
<a name="13"></a>
### Do you automatically install any additional daemonset to expose the SGX drivers? ###

Yes. The name of the daemonset is sgx-device-plugin. Read more on their respective purposes [here](confidential-nodes-aks-overview.md).  

<a name="14"></a>
### What is the VM SKU I should be choosing for confidential computing nodes? ###

DCSv2 SKUs. The [DCSv2 SKUs](../virtual-machines/dcv2-series.md) are available in the [supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines&regions=all).

<a name="15"></a>
### Can I still schedule and run non-enclave containers on confidential computing nodes? ###

Yes. The VMs also have a regular memory that can run standard container workloads. Consider the security and threat model of your applications before you decide on the deployment models.
<a name="16"></a>

### Can I provision AKS with DCSv2 Node Pools through Azure portal? ###

Yes. Azure CLI could also be used as an alternative as documented [here](confidential-nodes-aks-get-started.md).

<a name="17"></a>
### What Ubuntu version and VM generation is supported? ###
18.04 on Gen 2. 

<a name="18"></a>
### Can we change the current Intel SGX DCAP diver version on AKS? ###

No. To perform any custom installations, we recommend you choose [AKS-Engine Confidential Computing Worker Nodes](https://github.com/Azure/aks-engine/blob/master/docs/topics/sgx.md) deployments. 

<a name="19"></a>

### What version of Kubernetes do you support and recommend? ###

We support and recommend Kubernetes version 1.16 and above. 

<a name="20"></a>
### What are the known current limitations of the product? ###

- Supports Ubuntu 18.04 Gen 2 VM Nodes only 
- No Windows Nodes Support or Windows Containers Support
- EPC Memory based Horizontal Pod Autoscaling is not supported. CPU and regular memory-based scaling is supported.
- Dev Spaces on AKS for confidential apps are not currently supported

<a name="21"></a>
### Will only signed and trusted images be loaded in the enclave for confidential computing? ###
Not natively during enclave initialization but yes through attestation process signature can be validated. Ref [here](../attestation/basic-concepts.md#benefits-of-policy-signing). 

### Next Steps
Review the [confidential containers page](confidential-containers.md) for more details around confidential containers.
