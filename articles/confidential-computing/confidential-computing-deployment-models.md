---
title: Choose Between Deployment Models
description: Choose Between Deployment Models
author: JBCook
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 10/7/2021
ms.author: JenCook
---

# Confidential computing deployment models

Azure confidential computing (ACC) supports multiple deployment models to meet the variety of security requirements the customers' demand in modern cloud computing.

## Infrastructure as a Service (IaaS)

Our IaaS offering for ACC includes:

- [Confidential virtual machines](confidential-computing-vm-overview.md). This offering includes virtual machines based on Intel SGX or AMD SEV-SNP technology.

## Platform as a Service (PaaS)

Our PaaS offering for ACC includes:

- [Confidential containers](confidential-containers.md). This offering includes enclave-aware containers in Azure Kubernetes Service.

Choosing the right deployment model depends on many factors. These factors may include: existence of legacy applications, operating system capabilities, and migration from on-premises networks.

While there are still many reasons to use VMs, containers provide extra flexibility and portability. Containers are great in today's world, where apps run on multiple clouds, connect to microservices, and are developed in various programming languages and frameworks. In these conditions, containerizing applications provides teams the flexibility they need to handle the many software environments of modern IT.

Containers are also ideal for automation and Azure Pipelines, including continuous integration and continuous deployment (CI/CD) implementation.

Containers further increase portability of applications, and improve resource utilization, applying the elasticity of the Azure cloud and its best.

You would normally choose to deploy your solution on confidential VMs if:

- You have legacy applications that cannot be modified or containerized, but you need to introduce protection of data in memory, when being processed.
- You are running multiple applications requiring different OSs on a single piece of infrastructure.
- You need to emulate an entire computing environment, including all OS resources.
- You are migrating your existing VMs from on-premises to Azure.

You&#39;d opt for a confidential container-based approach when:

- Cost and resource allocation is a concern, and you need a more agile platform for deployment of your proprietary apps and datasets.
- You are building a modern cloud-native solution and have full control on source code and the deployment process.
- Multicloud support is a need.

From a security perspective, both deployment models based on confidential VMs and containers offer the upmost level of confidentiality that you&#39;d expect from services running in Microsoft Azure. It is also important to identify a few key differences in the security postures of confidential VMs based on AMD SEV-SNP technology, and enclave-aware confidential containers based on Intel SGX technology.

- **Confidential VMs on AMD SEV-SNP** offer hardware-encrypted protection of the entire virtual machine from unauthorized access by the host administrator. This level typically includes the hypervisor, which is managed by the cloud service provider (CSP). Hence, it is reasonable to state that this type of confidential VMs prevents access by the CSP to data and code executed within the VM.

However, VM admins or any other app or service running inside the VM itself, will operate beyond the protected boundaries of the VM, resulting in unconditional access to data and code executed within the VM.

AMD SEV-SNP technology introduces VM isolation from the hypervisor and hardware-based memory integrity protection to help prevent malicious hypervisor-based attacks. Under the SEV-SNP model, the AMD Secure Processor and the VM itself are treated as trusted resources, whereas any other hardware and software components are considered untrusted. The untrusted components include the BIOS and the hypervisor on the host system.

![Screenshot of AMD SEV-SNP virtual machine architecture.](media/confidential-computing-deployment-models/amd-sev-snp-vm.jpg)

- **Secure enclaves on Intel SGX** protect memory spaces inside a virtual machine with hardware-based encryption. The security boundary of application enclaves are more restricted than confidential VMs on AMD SEV-SNP. For Intel SGX, the security boundary applies to portions of memory within a VM itself. As a result, users, apps, and services running inside the Intel SGX-powered VM will not be able to access any data and code in execution inside the enclave.

Intel SGX helps protect data in use via application isolation. By protecting selected code and data from modification, developers can partition their application into hardened enclaves or trusted execution modules to help increase application security. The enclave memory cannot be read or written from outside the enclave, regardless of the permissions levels of the entity requesting access. Such access cannot be obtained by the hypervisor or the operating system via normal OS-level calls. The only way to call an enclave function is via a new set of instructions in the Intel SGX CPUs, which perform several protection checks.

![Screenshot of Intel SGX enclaves architecture.](media/confidential-computing-deployment-models/intel-sgx-enclave.jpg)