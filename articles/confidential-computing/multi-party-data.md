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

Azure confidential computing (ACC) provides a foundation for solutions that enable multiple parties to collaborate on data. There are various approaches to solutions, and a growing ecosystem of partners to help enable Azure customers, researchers, data scientists and data providers to collaborate on data while preserving privacy. This overview covers some of the approaches and existing solutions that can be used, all running on ACC.

## What are the data and model protections?

Data cleanroom solutions typically offer a means for one or more data providers to combine data for processing.  There's typically agreed upon code, queries, or models that are created by one of the providers or another participant, such as a researcher or solution provider. In many cases, the data can be considered sensitive and undesired to directly share to other participants – whether another data provider, a researcher, or solution vendor. To help ensure security and privacy on both the data and models used within data cleanrooms, confidential computing can be used to cryptographically verify that participants don't have access to the data or models, including during processing. By using ACC, the solutions can bring protections on the data and model IP from the cloud operator, solution provider, and data collaboration participants.

## What are examples of industry use cases?

With ACC, customers and partners build privacy preserving multi-party data analytics solutions, sometimes referred to as "confidential cleanrooms" – both net new solutions uniquely confidential, and existing cleanroom solutions made confidential with ACC.

1. **Royal Bank of Canada** - [Virtual clean room](https://aka.ms/RBCstory) solution combining merchant data with bank data in order to provide personalized offers, using Azure confidential computing VMs and Azure SQL AE in secure enclaves.
2. **Scotiabank** – Proved the use of AI on cross-bank money flows to identify money laundering to flag human trafficking instances, using Azure confidential computing and a solution partner, Opaque.
3. **Novartis Biome** – used a partner solution from [BeeKeeperAI](https://aka.ms/ACC-BeeKeeperAI) running on ACC in order to find candidates for clinical trials for rare diseases.
4. **Leading payment providers** connecting data across banks for fraud and anomaly detection.
5. **Data analytic services** and clean room solutions using ACC to increase data protection and meet EU customer compliance needs and privacy regulation.


## Why confidential computing?

Data cleanrooms aren't a brand-new concept, however with advances in confidential computing, there are more opportunities to take advantage of cloud scale with broader datasets, securing IP of AI models, and ability to better meet data privacy regulations. In previous cases, certain data might be inaccessible for reasons such as

- Competitive disadvantages or regulation preventing of sharing data across industry companies.
- Anonymization reducing the quality of insights on data, or being too costly and time consuming.
- Data being bound to certain locations and refrained from processing in the cloud due to security concerns.
- Costly or lengthy legal processes cover liability if data is exposed or abused

These realities could lead to incomplete or ineffective datasets that result in weaker insights, or more time needed in training and using AI models.

## What are considerations when building a cleanroom solution?

_Batch analytics vs. real-time data pipelines:_ The size of the datasets and speed of insights should be considered when designing or using a cleanroom solution. When data is available "offline", it can be loaded into a verified and secured compute environment for data analytic processing on large portions of data, if not the entire dataset. This batch analytics allow for large datasets to be evaluated with models and algorithms that aren't expected to provide an immediate result.  For example, batch analytics work well when doing ML inferencing across millions of health records to find best candidates for a clinical trial. Other solutions require real-time insights on data, such as when algorithms and models aim to identify fraud on near real-time transactions between multiple entities.

_Zero-trust participation:_ A major differentiator in confidential cleanrooms is the ability to have no party involved trusted – from all data providers, code and model developers, solution providers and infrastructure operator admins. Solutions can be provided where both the data and model IP can be protected from all parties. When onboarding or building a solution, participants should consider both what is desired to protect, and from whom to protect each of the code, models, and data.

_Federated learning:_ Federated learning involves creating or using a solution whereas models process in the data owner's tenant, and insights are aggregated in a central tenant. In some cases, the models can even be run on data outside of Azure, with model aggregation still occurring in Azure. Many times, federated learning iterates on data many times as the parameters of the model improve after insights are aggregated. The iteration costs and quality of the model should be factored into the solution and expected outcomes.

_Data residency and sources:_ Customers have data stored in multiple clouds and on-premises.  Collaboration can include data and models from different sources.  Cleanroom solutions can facilitate data and models coming to Azure from these other locations. When data can't move to Azure from an on-premises data store, some cleanroom solutions can run on site where the data resides.  Management and policies can be powered by a common solution provider, where available.

_Code integrity and confidential ledgers:_ With distributed ledger technology (DLT) running on Azure confidential computing, solutions can be built that run on a network across organizations. The code logic and analytic rules can be added only when there's consensus across the various participants. All updates to the code are recorded for auditing via tamper-proof logging enabled with Azure confidential computing.

## What are options to get started?

### ACC platform offerings that help enable confidential cleanrooms
Roll up your sleeves and build a data clean room solution directly on these confidential computing service offerings.

[Confidential containers](./confidential-containers.md) on Azure Container Instances (ACI) and Intel SGX VMs with application enclaves provide a container solution for building confidential cleanroom solutions.

[Confidential Virtual Machines (VMs)](./confidential-vm-overview.md) provide a VM platform for confidential cleanroom solutions.

[Azure SQL AE in secure enclaves](/sql/relational-databases/security/encryption/always-encrypted-enclaves) provides a platform service for encrypting data and queries in SQL that can be used in multi-party data analytics and confidential cleanrooms.

[Confidential Consortium Framework](https://ccf.microsoft.com/) is an open-source framework for building highly available stateful services that use centralized compute for ease of use and performance, while providing decentralized trust. It enables multiple parties to execute auditable compute over confidential data without trusting each other or a privileged operator.

### ACC partner solutions that enable confidential cleanrooms
Use a partner that has built a multi-party data analytics solution on top of the Azure confidential computing platform.

- [**Anjuna**](https://www.anjuna.io/use-case-solutions) provides a confidential computing platform to enable various use cases, including secure clean rooms, for organizations to share data for joint analysis, such as calculating credit risk scores or developing machine learning models, without exposing sensitive information.
- [**BeeKeeperAI**](https://www.beekeeperai.com/) enables healthcare AI through a secure collaboration platform for algorithm owners and data stewards. BeeKeeperAI™ uses privacy-preserving analytics on multi-institutional sources of protected data in a confidential computing environment. The solution supports end-to-end encryption, secure computing enclaves, and Intel's latest SGX enabled processors to protect the data and the algorithm IP.
- [**Decentriq**](https://www.decentriq.com/) provides SaaS data cleanrooms built on confidential computing that enable secure data collaboration without sharing data. Data science cleanrooms allow flexible multi-party analysis, and no-code cleanrooms for media and advertising enable compliant audience activation and analytics based on first-party user data. Confidential cleanrooms are described in more detail in [this article on the Microsoft blog](https://techcommunity.microsoft.com/t5/azure-confidential-computing/confidential-data-clean-rooms-the-evolution-of-sensitive-data/ba-p/3273844).
- [**Fortanix**](https://www.fortanix.com/platform/confidential-ai) provides a confidential computing platform that can enable confidential AI, including multiple organizations collaborating together for multi-party analytics.
- [**Habu**](https://habu.com) delivers an interoperable data clean room platform that enables businesses to unlock collaborative intelligence in a smart, secure, scalable, and simple way. Habu connects decentralized data across departments, partners, customers, and providers for better collaboration, decision-making, and results.
- [**Mithril Security**](https://www.mithrilsecurity.io/) provides tooling to help SaaS vendors serve AI models inside secure enclaves, and providing an on-premises level of security and control to data owners. Data owners can use their SaaS AI solutions while remaining compliant and in control of their data.
- [**Opaque**](https://opaque.co/) provides a confidential computing platform for collaborative analytics and AI, giving the ability to perform collaborative scalable analytics while protecting data end-to-end and enabling organizations to comply with legal and regulatory mandates.
- [**SafeLiShare**](https://safelishare.com/solution/encrypted-data-clean-room/) provides policy-driven encrypted data clean rooms where access to data is auditable, trackable, and visible, while keeping data protected during multi-party data sharing.
