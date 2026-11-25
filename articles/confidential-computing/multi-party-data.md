---

title: Multi-party Data Analytics

description: Data cleanroom and multi-party data confidential computing solutions

services: virtual-machines

author: kapilv

ms.service: azure-confidential-computing

ms.topic: concept-article

ms.date: 04/20/2023

ms.author: mattmcinnes
# Customer intent: As a data scientist, I want to leverage confidential computing solutions for multi-party data analytics, so that I can securely collaborate with other organizations while preserving the privacy of sensitive data and intellectual property.
---

# Cleanroom and multiparty data analytics

Azure confidential computing (ACC) provides a foundation for solutions that enable multiple parties to collaborate on data. Various approaches exist, and a growing ecosystem of partners helps enable Azure customers, researchers, data scientists, and data providers to collaborate on data while preserving privacy. This overview covers some of the approaches and existing solutions that can be used, all running on ACC.

## What are the data and model protections?

Data cleanroom solutions typically offer a way for one or more data providers to combine data for processing. Typically, the providers agree on code, queries, or models created by one of the participants, such as a researcher or solution provider. In many cases, the data is sensitive and shouldn't be directly shared with other participants, whether another data provider, a researcher, or a solution vendor. To help ensure security and privacy for both the data and models used within data cleanrooms, confidential computing can cryptographically verify that participants don't have access to the data or models, including during processing. By using ACC, solutions can protect the data and model IP from the cloud operator, solution provider, and data collaboration participants.

## What are examples of industry use cases?

By using ACC, customers and partners build privacy-preserving multiparty data analytics solutions, sometimes referred to as "confidential cleanrooms". These solutions can be net-new solutions built to be confidential or existing cleanroom solutions made confidential by using ACC.

- **Scotiabank** - Proved the use of AI on cross-bank money flows to identify money laundering and flag human trafficking instances, using Azure confidential computing and a solution partner, Opaque.
- **Novartis Biome** – used a partner solution from [BeeKeeperAI](https://www.microsoft.com/customers/story/26750-beekeeperai-azure-confidential-ledger) running on ACC in order to find candidates for clinical trials for rare diseases.
- **Leading payment providers** connect data across banks for fraud and anomaly detection.
- **Data analytic services** and cleanroom solutions use ACC to increase data protection and meet EU customer compliance needs and privacy regulations.


## Why confidential computing?

Data cleanrooms aren't a brand-new concept. However, advances in confidential computing provide more opportunities to take advantage of cloud scale with broader datasets, secure the IP of AI models, and better meet data privacy regulations. In previous cases, certain data might be inaccessible for reasons such as

- Competitive disadvantages or regulation preventing sharing data across industry companies.
- Anonymization reducing the quality of insights on data, or being too costly and time consuming.
- Data being bound to certain locations and refrained from processing in the cloud due to security concerns.
- Costly or lengthy legal processes cover liability if data is exposed or abused.

These realities could lead to incomplete or ineffective datasets that result in weaker insights, or more time needed in training and using AI models.

## What are considerations when building a cleanroom solution?

_Batch analytics vs. real-time data pipelines:_ Consider the size of the datasets and the speed of insights when designing or using a cleanroom solution. When data is available "offline", you can load it into a verified and secured compute environment for data analytical processing on large portions of data, if not the entire dataset. This batch analytics approach allows large datasets to be evaluated with models and algorithms that aren't expected to provide an immediate result. For example, batch analytics work well when doing ML inferencing across millions of health records to find the best candidates for a clinical trial. Other solutions require real-time insights on data, such as when algorithms and models aim to identify fraud in near real-time transactions between multiple entities.

_Zero-trust participation:_ A major differentiator in confidential cleanrooms is the ability to trust no party involved, from data providers to code and model developers, solution providers, and infrastructure operator admins. Solutions can be provided where both the data and model IP are protected from all parties. When onboarding or building a solution, participants should consider both what they want to protect and from whom to protect each of the code, models, and data.

_Federated learning:_ Federated learning involves creating or using a solution where models process in the data owner's tenant, and insights are aggregated in a central tenant. In some cases, the models can even run on data outside of Azure, with model aggregation still occurring in Azure. Many times, federated learning iterates on data as the parameters of the model improve after insights are aggregated. The iteration costs and quality of the model should be factored into the solution and expected outcomes.

_Data residency and sources:_ Customers have data stored in multiple clouds and on-premises. Collaboration can include data and models from different sources. Cleanroom solutions can facilitate data and models coming to Azure from these other locations. When data can't move to Azure from an on-premises data store, some cleanroom solutions can run on site where the data resides. Management and policies can be powered by a common solution provider, where available.

_Code integrity and confidential ledgers:_ By using distributed ledger technology (DLT) running on Azure confidential computing, you can build solutions that run on a network across organizations. The code logic and analytic rules are added only when there's consensus across the various participants. All updates to the code are recorded for auditing via tamper-proof logging enabled by Azure confidential computing.

## What are options to get started?

### Azure Confidential Clean Rooms (Preview)
[Azure Confidential Clean Rooms (ACCR)](./confidential-clean-rooms.md) is designed for organizations that need to share privacy-sensitive data such as personally identifiable information (PII) or protected health information (PHI) securely with other organizations to derive business-critical insights, fine-tune ML models with sensitive data from other organizations for improved accuracy, or perform secure analytics on joint data with partner organizations. ACCR uses confidential containers on Azure Container Instances to ensure that your data stays protected from other collaborators and from Azure operators. It has applications spanning multiple industries such as healthcare, advertising, banking and financial services, and retail.

You can enroll yourself in the ACCR preview by submitting this [form](https://aka.ms/ACCR-Preview-Onboarding).

### ACC platform offerings that help enable confidential cleanrooms
Roll up your sleeves and build a data clean room solution directly on these confidential computing service offerings.

[Confidential containers](./confidential-containers.md) on Azure Container Instances (ACI) and confidential VM node pools provide a container solution for building confidential cleanroom solutions. Intel SGX enclave options remain available for specialized scenarios.

[Confidential Virtual Machines (VMs)](./confidential-vm-overview.md) provide a VM platform for confidential cleanroom solutions.

[Azure SQL AE in secure enclaves](/sql/relational-databases/security/encryption/always-encrypted-enclaves) provides a platform service for encrypting data and queries in SQL that can be used in multi-party data analytics and confidential cleanrooms.

[Confidential Consortium Framework](https://ccf.microsoft.com/) is an open-source framework for building highly available stateful services that use centralized compute for ease of use and performance, while providing decentralized trust. It enables multiple parties to execute auditable compute over confidential data without trusting each other or a privileged operator.

### ACC partner solutions that enable confidential cleanrooms
Use a partner that builds a multiparty data analytics solution on top of the Azure confidential computing platform.

- [**Anjuna**](https://www.anjuna.io/use-case-solutions) provides a confidential computing platform to enable various use cases, including secure clean rooms, for organizations to share data for joint analysis, such as calculating credit risk scores or developing machine learning models, without exposing sensitive information.
- [**BeeKeeperAI**](https://www.beekeeperai.com/) enables healthcare AI through a secure collaboration platform for algorithm owners and data stewards. BeeKeeperAI uses privacy-preserving analytics on multi-institutional protected data in a confidential computing environment.
- [**Decentriq**](https://www.decentriq.com/) provides SaaS data cleanrooms built on confidential computing that enable secure data collaboration without sharing data. Data science cleanrooms allow flexible multi-party analysis, and no-code cleanrooms for media and advertising enable compliant audience activation and analytics based on first-party user data. Confidential cleanrooms are described in more detail in [this article on the Microsoft blog](https://techcommunity.microsoft.com/t5/azure-confidential-computing/confidential-data-clean-rooms-the-evolution-of-sensitive-data/ba-p/3273844).
- [**Duality Technologies**](https://dualitytech.com/) enables multiparty analytics and AI on data that participants can't centralize.
  It combines confidential computing and trusted execution environments, fully homomorphic encryption, federated learning, and differential privacy as each workload requires, while each dataset stays under its owner's control across departments or organizations.
  Use cases include cross-institution clinical and real-world evidence research, fraud detection, and anti-money laundering analysis.
- [Fortanix](https://www.fortanix.com/platform/confidential-ai) provides a confidential computing platform that can enable confidential AI, including multiple organizations collaborating together for multiparty analytics.
- [**Opaque**](https://opaque.co/) provides a confidential computing platform for collaborative analytics and AI, giving the ability to perform collaborative scalable analytics while protecting data end-to-end and enabling organizations to comply with legal and regulatory mandates.
