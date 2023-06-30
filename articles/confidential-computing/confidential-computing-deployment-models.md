---
title: Choose Between Deployment Models
description: Choose Between Deployment Models
author: mamccrea
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 11/04/2021
ms.author: mamccrea
ms.custom: ignite-fall-2021
---

# Confidential computing deployment models

Azure confidential computing supports multiple deployment models. These different models support the wide variety of customer security requirements for modern cloud computing.

## Infrastructure as a Service (IaaS)

Under Infrastructure as a Service (IaaS) deployment model, you can use confidential virtual machines (VMs) in confidential computing. You can use VMs based on [AMD Secure Encrypted Virtualization Secure Nested Paging (SEV-SNP)](confidential-vm-overview.md), [Intel Trust Domain Extensions (TDX)](tdx-confidential-vm-overview.md) or [Intel Software Guard Extensions (SGX) application enclaves](confidential-computing-enclaves.md).

Infrastructure as a Service (IaaS) is a cloud computing deployment model that grants access to scalable computing resources, such as servers, storage, networking, and virtualization, on demand. By adopting IaaS deployment model, organizations can forego the process of procuring, configuring, and managing their own infrastructure, instead only paying for the resources they utilize. This makes it a cost-effective solution.

In the domain of cloud computing, IaaS deployment model enables businesses to rent individual services from cloud service providers like Azure. Azure assumes responsibility for managing and maintaining the infrastructure, empowering organizations to concentrate on installing, configuring, and managing their software. Azure also offers supplementary services such as comprehensive billing management, logging, monitoring, storage resiliency, and security.

Scalability constitutes another significant advantage of IaaS deployment model in cloud computing. Enterprises can swiftly scale their resources up and down according to their requirements. This flexibility facilitates faster development life cycles, accelerating time to market for new products and ideas. Additionally, IaaS deployment model ensures reliability by eliminating single points of failure. Even in the event of a hardware component failure, the service remains accessible.

In conclusion, IaaS deployment model in combination with Azure Confidential Computing offers benefits, including cost savings, increased efficiency, innovation opportunities, reliability, high scalability, and all secured by a robust and comprehensive security solution designed specifically to protect highly sensitive data.

## Platform as a Service (PaaS)

For Platform as a Service (PaaS), you can use [confidential containers](confidential-containers.md) in confidential computing. This offering includes enclave-aware containers in Azure Kubernetes Service (AKS).

Choosing the right deployment model depends on many factors. You might need to consider the existence of legacy applications, operating system capabilities, and migration from on-premises networks.

While there are still many reasons to use VMs, containers provide extra flexibility for the many software environments of modern IT. 

Containers can support apps that:

- Run on multiple clouds.
- Connect to microservices.
- Use various programming languages and frameworks.
- Use automation and Azure Pipelines, including continuous integration and continuous deployment (CI/CD) implementation.

Containers also increase portability of applications, and improve resource usage, by applying the elasticity of the Azure cloud.

Normally, you might deploy your solution on confidential VMs if:

- You've got legacy applications that cannot be modified or containerized. However, you still need to introduce protection of data in memory, while the data is being processed.
- You're running multiple applications requiring different operating systems (OS) on a single piece of infrastructure.
- You want to emulate an entire computing environment, including all OS resources.
- You're migrating your existing VMs from on-premises to Azure.

You might opt for a confidential container-based approach when:

- You're concerned about cost and resource allocation. However, you need a more agile platform for deployment of your proprietary apps and datasets.
- You're building a modern cloud-native solution. You also have full control of source code and the deployment process.
- You need multi-cloud support.

Both options offer the highest security level for Azure services. 

There are some differences in the security postures of [confidential VMs](#confidential-vms-on-amd-sev-snp) and [confidential containers](#secure-enclaves-on-intel-sgx) as follows.

### Confidential VMs on AMD SEV-SNP

**Confidential VMs on AMD SEV-SNP** offer hardware-encrypted protection of the entire VM from unauthorized access by the host administrator. This level typically includes the hypervisor, which the cloud service provider (CSP) manages. You can use this type of confidential VM to prevent the CSP accessing data and code executed within the VM.

VM admins or any other app or service running inside the VM, operate beyond the protected boundaries. These users and services can access data and code within the VM.

AMD SEV-SNP technology provides VM isolation from the hypervisor. The hardware-based memory integrity protection helps prevent malicious hypervisor-based attacks. The SEV-SNP model trusts the AMD Secure Processor and the VM. The model doesn't trust any other hardware and software components. Untrusted components include the BIOS, and the hypervisor on the host system.

:::image type="content" source="media/confidential-computing-deployment-models/amd-sev-snp-vm.png" alt-text="Diagram of AMD SEV-SNP VM architecture, defining trusted and untrusted components.":::

### Secure enclaves on Intel SGX

**Secure enclaves on Intel SGX** protect memory spaces inside a VM with hardware-based encryption. The security boundary of application enclaves is more restricted than confidential VMs on AMD SEV-SNP. For Intel SGX, the security boundary applies to portions of memory within a VM. Users, apps, and services running inside the Intel SGX-powered VM can't access any data and code in execution inside the enclave.

Intel SGX helps protect data in use by application isolation. By protecting selected code and data from modification, developers can partition their application into hardened enclaves or trusted execution modules to help increase application security. Entities outside the enclave can't read or write the enclave memory, whatever their permissions levels. The hypervisor or the operating system also can't obtain this access through normal OS-level calls. To call an enclave function, you have to use a new set of instructions in the Intel SGX CPUs. This process includes several protection checks.

:::image type="content" source="media/confidential-computing-deployment-models/intel-sgx-enclave.png" alt-text="Diagram of Intel SGX enclaves architecture, showing secure information inside app enclave.":::

## Next steps

- [Learn about confidential containers](confidential-containers.md)
- [Learn about confidential computing enclaves](confidential-computing-enclaves.md)
