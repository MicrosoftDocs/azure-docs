---

title: Multi-party Data Analytics

description: Data cleanroom and multi-party data confidential computing solutions

services: virtual-machines

author: grbury

ms.service: virtual-machines

ms.subservice: confidential-computing

ms.workload: infrastructure

ms.topic: conceptual

ms.date: 04/20/2023

ms.author: grbury

---

# Cleanroom and Multi-party Data Analytics

Azure confidential computing (ACC) provides a foundation for solutions that enable multiple parties to collaborate on data. There are various approaches to solutions, as well as a growing ecosystem of partners to help enable Azure customers, researchers, data scientists and data providers to collaborate on data while preserving privacy. This article will overview some of the approaches and existing solutions that can be leveraged, all running on ACC.

## What are the data and model protections?

Data cleanroom solutions typically offer a means for one or more data providers to combine data for processing on agreed upon code, queries, or models which are created by one of the providers or another participant, such as a researcher or solution provider. In many cases, the data can be considered sensitive and undesired to directly share to other participants – whether another data provider, a researcher, or solution vendor. To help ensure security and privacy on both the data and models used within data cleanrooms, confidential computing can be used to cryptographically verify that participants don't have access to the data or models, including during processing. With leveraging ACC, the solutions can bring protections on the data and model IP from the cloud operator, solution provider, and data collaboration participants.

## What are examples of industry use cases?

With ACC, customers and partners build privacy preserving multi-party data analytics solutions, sometimes referred to as "confidential cleanrooms" – both net new solutions uniquely confidential, and existing cleanroom solutions made confidential with ACC.

1. **Royal Bank of Canada** - [Virtual clean room](https://aka.ms/RBCstory) solution combining merchant data with bank data in order to provide personalized offers, leveraging Azure confidential computing VMs and Azure SQL AE in secure enclaves.
2. **Scotiabank** – Proved the use of AI on cross-bank money flows to identify money laundering to flag human trafficking instances, leveraging Azure confidential computing and a solution partner, Opaque.
3. **Novartis Biome** – leveraged a partner solution from [BeeKeeperAI](https://aka.ms/ACC-BeeKeeperAI) running on ACC in order to find candidates for clinical trials for rare diseases.
4. **Leading payment providers** connecting data across banks for fraud and anomaly detection
5. **Data analytic services** and clean room solutions leveraging ACC to increase data protection and meet EU customer compliance needs and privacy regulation.


## Why confidential computing?

Data cleanrooms are not a brand-new concept, however with advances in confidential computing, there are more opportunities for leveraging cloud scale with broader datasets, securing IP of AI models, as well as ability to better meet data privacy regulations. In previous cases, certain data might be inaccessible for reasons such as

- Competitive disadvantages or regulation preventing of sharing data across industry companies.
- Anonymization reducing the quality of insights on data, or being too costly and time consuming.
- Data being bound to certain locations and refrained from processing in the cloud due to security concerns.
- Costly or lengthy legal processes cover liability if data is exposed or abused

These realities could lead to incomplete or ineffective datasets that result in weaker insights, or additional time needed in training and leveraging AI models.

## What are considerations when build a cleanroom solution?

_Batch analytics vs. real-time data pipelines:_ The size of the datasets and speed of insights should be considered when designing or leveraging a cleanroom solution. When data is available "offline", it can be loaded into a verified and secured compute environment for data analytic processing on large portions of data, if not the entire dataset. This allows for large datasets to be evaluated with models and algorithms that are not expected to provide an immediate result, for example running inference across millions of health records to find best candidates for a clinical trial. Other solutions require real-time insights on data, such as when algorithms and models aim to identify fraud on near real-time transactions between multiple entities.

_Zero-trust participation:_ A major differentiator in confidential cleanrooms is the ability to have no party involved trusted – from all data providers, code and model developers, solution providers and infrastructure operator admins. Solutions can be provided where both the data and model IP can be protected from all parties. In onboarding or building a solution, participants should consider both what is desired to protect, and from whom to protect each of the code, models, and data.

_Federated learning:_ Federated learning involves creating or leveraging a solution whereas models are provided to process in the data owners tenant, and insights are aggregated in a central tenant. In some cases, the models can even be run on data outside of Azure, with model aggregation still occurring in Azure. Many times, federated learning involves iterating on data many times as the parameters of the model improves based on the aggregated insights, so the iteration costs and quality of the model should be factored into the operation and expected outcomes.

_Data residency and sources:_ Customer have data stored in multiple clouds and on-premises.  Collaboration can include data and models from different sources.  Cleanroom solutions can facilitate data and models coming to Azure from these other locations. When data can't be moved to Azure from an on-premise data store, some cleanroom solutions can be provided on site where the data resides, with management and policies powered by a common solution provider, where available.

_Code integrity and confidential ledgers:_ With distributed ledger technology (DLT) running on Azure confidential computing, solutions can be built that run on a network across organizations, whereas the code logic and analytic rules can be added only when there is concensus across the various participants. All updates to the code are recorded for auditing via tamper-proof logging enabled with Azure confidential computing.

## What are options to get started?

### ACC platform offerings that help enable confidential cleanrooms
Roll-up your sleeves and build a data clean room solution directly on these confidenital computing service offerings.

[Confidential containers](https://learn.microsoft.com/en-us/azure/confidential-computing/confidential-containers) on Azure Container Instances (ACI) and Intel SGX VMs with application enclaves provide a container solution for building confidential cleanroom solutions.

[Confidential Virtual Machines (VMs)](https://learn.microsoft.com/en-us/azure/confidential-computing/confidential-vm-overview) provide a VM platform for confidential cleanroom solutions.

[Azure SQL AE in secure enclaves](https://learn.microsoft.com/en-us/sql/relational-databases/security/encryption/always-encrypted-enclaves) provides a platform service for encrypting data and queries in SQL that can be used in multi-party data analytics and confidenital cleanrooms.

[Confidential Consortium Framework](https://ccf.microsoft.com/) is an open-source framework for building highly available stateful services that leverage centralized compute for ease of use and performance, while providing decentralized trust. It enables multiple parties to execute auditable compute over confidential data without trusting each other or a privileged operator.

### ACC partner solutions that enable confidential cleanrooms
Leverage a partner that has built a multi-party data analytics solution on top of the Azure confidential computing platform.

- [**Anjuna**](https://www.anjuna.io/use-case-solutions) provides a confidential computing platform to enable various use caes, including secure clean rooms, for organizations to share data for joint analysis, such as calculating credit risk scores or developing machine learning models, without exposing sensitive information.- - [**BeeKeeperAI**](https://www.beekeeperai.com/) enables healthcare AI through a secure collaboration platform for algorithm owners and data stewards. BeeKeeperAI™ uses privacy-preserving analytics on multi-institutional sources of protected data in a confidential computing environment including end-to-end encryption, secure computing enclaves, and Intel's latest SGX enabled processors to comprehensively protect the data and the algorithm IP.
- [**Decentriq**](https://www.decentriq.com/) provides Software as a Service (SaaS) data clean rooms to enable companies to collaborate with other organizations on their most sensitive datasets and create value for their clients. The technologies help prevent anyone to see the sensitive data, including Decentriq.
- [**Fortanix**](https://www.fortanix.com/platform/confidential-ai) provides a confidential computing platform that can enable confidential AI, including multiple organizations collaborating together for multi-party analytics.
- [**Mithril Security**](https://www.mithrilsecurity.io/) provides tooling to help SaaS vendors serve AI models inside secure enclaves, and providing an on-premise level of security and control to data owners. Data owners can use their SaaS AI solutions while remaining compliant and in control of their data.
- [**Opaque**](https://opaque.co/) provides a confidential computing platform for collaborative analytics and AI, giving the ability to perform collaborative scalable analytics while protecting data end-to-end and enabling organizations to comply with legal and regulatory mandates.
- [**SafeLiShare**](https://safelishare.com/solution/encrypted-data-clean-room/) provides policy-driven encrypted data clean rooms where access to data is auditable, trackable, and visible, while keeping data protected during multi-party data sharing.
