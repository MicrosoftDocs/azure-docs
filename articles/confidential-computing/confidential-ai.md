---
title: Confidential AI
titleSuffix: Azure Confidential Computing
description: Learn how confidential AI protects data and model IP across training, fine-tuning, and inferencing.
services: virtual-machines
author: kapilv
ms.service: azure-confidential-computing
ms.topic: concept-article
ms.date: 06/30/2026
ms.author: mattmcinnes
# Customer intent: "As a data scientist, I want to utilize confidential AI technologies for training and deploying models, so that I can protect sensitive data and ensure compliance while enhancing the performance and accuracy of AI applications."
---

# Confidential AI
AI is transforming industries such as finance, manufacturing, advertising, and healthcare. As generative AI adoption grows, protecting data and model IP becomes critical. Microsoft [Responsible AI principles](https://www.microsoft.com/ai/responsible-ai) provide a framework for trustworthy AI, and confidential computing is a key technical control in that framework.

## What is Confidential AI?
Confidential AI is a set of hardware-backed technologies that provide cryptographically verifiable protection for data and model assets across the AI lifecycle, including during use. It uses TEEs on CPUs and GPUs, together with supporting services for data preparation, training, and deployment. It also helps improve trust, transparency, and accountability in AI systems.

## What scenarios does Confidential AI address? 

Confidential AI addresses scenarios across the full AI lifecycle.

-   **Confidential Training**. Protects training data, model architecture, and model weights from privileged attackers such as rogue administrators and insiders. This protection is especially important when model IP is sensitive or training is resource intensive.

-   **Confidential Fine-tuning**. Protects domain-specific private data and resulting model artifacts during fine-tuning.

-   **Confidential Multi-party Training**. Enables [multi-party training scenarios](./multi-party-data.md) where organizations can collaborate without exposing raw data or model assets to each other.

-   **Confidential Federated Learning**. Strengthens federated learning by protecting client updates and central aggregation in TEEs. It can also enforce trusted training pipelines on participants without exposing underlying client data.

-   **Confidential Inferencing**. Protects model IP and user prompts and responses during inference. It can provide verifiable guarantees that requests are processed only for authorized tasks and that responses are returned over secure TEE-terminated paths.

## What are the industry use cases for Confidential AI?

With Azure Confidential Computing, customers and partners are building Confidential AI solutions addressing many use cases.

1.  **Speech and face recognition**. Models for speech and face recognition operate on audio and video streams that contain sensitive data. In some scenarios, such as surveillance in public places, consent as a means for meeting privacy requirements may not be practical. Confidential AI allows data processors to train models and run inference in real-time while minimizing the risk of data leakage.

2.  **Anti-money laundering/Fraud detection**. Confidential AI allows multiple banks to combine datasets in the cloud for training more accurate AML models without exposing personal data of their customers. Models trained using combined datasets can detect the movement of money by one user between multiple banks, without the banks accessing each other's data. Through confidential AI, these financial institutions can increase fraud detection rates, and reduce false positives.

3.  **Assisted diagnostics and predictive healthcare**. Development of diagnostics and predictive healthcare models requires access to highly sensitive healthcare data. Getting access to such datasets is both expensive and time consuming. Confidential AI can unlock the value in such datasets, enabling AI models to be trained using sensitive data while protecting both the datasets and models throughout the lifecycle.

## Why confidential computing?

The effectiveness of AI models depends on both the quality and quantity of data. While training models by using publicly available datasets has led to significant progress, enabling models to perform complex advisory tasks such as medical diagnosis, financial risk assessment, or business analysis requires access to private data during both training and inferencing.

Many privacy-preserving technologies can protect data in use. For example, you can scrub and de-identify data before sharing it. However, de-identification alone can be brittle and, in some cases, reduce utility. Other approaches, such as fully homomorphic encryption (FHE) and secure multi-party computation (MPC), can limit expressiveness or introduce significant performance overheads.

Confidential computing can unlock access to sensitive datasets while meeting security and compliance concerns with low overhead. By using confidential computing, data providers can authorize the use of their datasets for specific tasks (verified by attestation), such as training or fine-tuning an agreed-upon model, while keeping the data protected. You can combine confidential training with differential privacy to further reduce leakage of training data through inferencing. Model builders can make their models more transparent by using confidential computing to generate non-repudiable data and model provenance records. Clients can use remote attestation to verify that inference services only use inference requests in accordance with declared data use policies.

## What are the options to get started? 

### Azure Confidential Computing platform offerings that help enable Confidential AI
Azure already provides state-of-the-art offerings to secure data and AI workloads. You can further enhance the security posture of your workloads by using the following Azure confidential computing platform offerings.

-   [Confidential VMs on SNP](./confidential-vm-overview.md) and [TDX](./tdx-confidential-vm-overview.md). Use confidential VMs to protect sensitive code and data in use for CPU-based AI workloads, such as data preprocessing and smaller-model training or inferencing.

-   [Confidential Containers on ACI](/azure/container-instances/container-instances-confidential-overview).
    Confidential Containers on ACI are another way to deploy containerized workloads on Azure. In addition to protection from cloud administrators, confidential containers offer protection from tenant admins and strong integrity properties by using container policies. This protection makes them a great match for low-trust, multiparty collaboration scenarios. For a sample demonstrating confidential inferencing based on an unmodified NVIDIA Triton inferencing server, see [here](https://github.com/microsoft/confidential-ai).

For AI workloads that rely on GPUs, Microsoft and NVIDIA are collaborating to bring confidential computing to NVIDIA GPUs. [Azure Confidential GPU VMs](https://azure.microsoft.com/blog/azure-confidential-computing-with-nvidia-gpus-for-trustworthy-ai/) based on AMD SEV-SNP and A100 GPUs are currently in [limited preview](https://aka.ms/accgpusignup).

### ACC partner solutions that enable Confidential AI

Use a partner that builds Confidential AI solutions on top of the Azure confidential computing platform.

-   [Anjuna](https://www.anjuna.io/use-case-solutions) provides a confidential computing platform to enable various use cases for organizations to develop machine learning models without exposing sensitive information.

-   [Beekeeper AI](https://www.beekeeperai.com/) enables healthcare AI through a secure collaboration platform for algorithm owners and data stewards. BeeKeeperAI uses privacy-preserving analytics on multi-institutional protected data in a confidential computing environment.

-   [Duality Technologies](https://dualitytech.com/) enables multiparty analytics and AI on data that participants can't centralize.
    It combines confidential computing and trusted execution environments, fully homomorphic encryption, federated learning, and differential privacy as each workload requires, while each dataset stays under its owner's control across departments or organizations.
    Use cases include cross-institution clinical and real-world evidence research, fraud detection, and anti-money laundering analysis.

-   [Fortanix](https://www.fortanix.com/platform/confidential-ai) provides a confidential computing platform that can enable confidential AI, including multiple organizations collaborating together for multi-party analytics.


-   [Opaque](https://opaque.co/) provides a confidential computing platform for collaborative analytics and AI, giving the ability to perform analytics while protecting data end-to-end and enabling organizations to comply with legal and regulatory mandates.
