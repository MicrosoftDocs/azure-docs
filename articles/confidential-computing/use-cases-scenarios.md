---
title: Common Azure confidential computing scenarios and use cases
description: Understand how to use confidential computing in your scenario.
services: virtual-machines
author: mamccrea
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.topic: overview
ms.date: 11/04/2021
ms.author: mamccrea
ms.custom: ignite-fall-2021
---
# Use cases and scenarios
Confidential computing applies to various use cases for protecting data in regulated industries such as government, financial services, and healthcare institutes. For example, preventing access to sensitive data helps protect the digital identity of citizens from all parties involved, including the cloud provider that stores it. The same sensitive data may contain biometric data that is used for finding and removing known images of child exploitation, preventing human trafficking, and aiding digital forensics investigations.

:::image type="content" source="media/use-cases-scenarios/use-cases.png" alt-text="Screenshot of use cases for Azure confidential computing, including government, financial services, and health care scenarios.":::

This article provides an overview of several common scenarios for Azure confidential computing. The recommendations in this article serve as a starting point as you develop your application using confidential computing services and frameworks.

After reading this article, you'll be able to answer the following questions:

- What are some scenarios for Azure confidential computing?
- What are the benefits of using Azure confidential computing for multi-party scenarios, enhanced customer data privacy, and blockchain networks?

## Secure multi-party computation

Business transactions and project collaboration require sharing information amongst multiple parties. Often, the data being shared is confidential. The data may be personal information, financial records, medical records, private citizen data, etc. Public and private organizations require their data be protected from unauthorized access. Sometimes these organizations even want to protect data from computing infrastructure operators or engineers, security architects, business consultants, and data scientists.

For example, using machine learning for healthcare services has grown massively as we've obtained access to larger datasets and imagery of patients captured by medical devices. Disease diagnostic and drug development benefit from multiple data sources. Hospitals and health institutes can collaborate by sharing their patient medical records with a centralized trusted execution environment (TEE). Machine learning services running in the TEE aggregate and analyze data. This aggregated data analysis can provide higher prediction accuracy due to training models on consolidated datasets. With confidential computing, the hospitals can minimize risks of compromising the privacy of their patients.

Azure confidential computing lets you process data from multiple sources without exposing the input data to other parties. This type of secure computation enables scenarios such as anti-money laundering, fraud-detection, and secure analysis of healthcare data.

Multiple sources can upload their data to one enclave in a virtual machine. One party tells the enclave to perform computation or processing on the data. No parties (not even the one executing the analysis) can see another party's data that was uploaded into the enclave.

In secure multi-party computing, encrypted data goes into the enclave. The enclave decrypts the data using a key, performs analysis, gets a result, and sends back an encrypted result that a party can decrypt with the designated key.

### Anti-money laundering

In this secure multi-party computation example, multiple banks share data with each other without exposing personal data of their customers. Banks run agreed-upon analytics on the combined sensitive data set. The analytics on the aggregated data set can detect the movement of money by one user between multiple banks, without the banks accessing each other's data.

Through confidential computing, these financial institutions can increase fraud detection rates, address money laundering scenarios, reduce false positives, and continue learning from larger data sets.

:::image type="content" source="media/use-cases-scenarios/mpc-banks.png" alt-text="Graphic of multiparty data sharing for banks, showing the data movement that confidential computing enables.":::

### Drug development in healthcare

Partnered health facilities contribute private health data sets to train an ML model. Each facility can only see their own data set. No other facility or even the cloud provider, can see the data or training model. All facilities benefit from using the trained model. By creating the model with more data, the model became more accurate. Each facility that contributed to training the model can use it and receive useful results.

![Diagram of confidential healthcare scenarios, showing attestation between scenarios.](media/use-cases-scenarios/confidential_healthcare.png)

## Enhanced customer data privacy

Despite the security level provided by Microsoft Azure is quickly becoming one of the top drivers for cloud computing adoption, customers trust their provider to different extents. Customer asks for:

- Minimal hardware, software, and operational TCBs (trusted computing bases) for sensitive workloads.
- Technical enforcement, rather than just business policies and processes.
- Transparency about the guarantees, residual risks, and mitigations that they get.

Confidential computing goes in this direction by allowing customers incremental control over the TCB used to run their cloud workloads. Azure confidential computing allows customers to precisely define all the hardware and software that have access to their workloads (data and code), and it provides the technical mechanisms to verifiably enforce this guarantee. In short, customers retain full control over their secrets.

### Data sovereignty

In Government and public agencies, Azure confidential computing is a solution to raise the degree of trust towards the ability to protect data sovereignty in the public cloud. Moreover, thanks to the increasingly adoption of confidential computing capabilities into PaaS services in Azure, a higher degree of trust can be achieved with a reduced impact to the innovation ability provided by public cloud services. This combination of protecting data sovereignity with a reduced impact to the innovation ability makes Azure confidential computing a very effective response to the needs of sovereignty and digital transformation of Government services.

### Reduced chain of trust

Enormous investment and revolutionary innovation in confidential computing has enabled the removal of the cloud service provider from the trust chain to an unprecedented degree. Azure confidential computing delivers the highest level of sovereignty available in the market today. This allows customer and governments to meet their sovereignty needs today and still leverage innovation tomorrow.

Confidential computing can expand the number of workloads eligible for public cloud deployment. This can result in a rapid adoption of public services for migrations and new workloads, rapidly improving the security posture of customers, and quickly enabling innovative scenarios.

### BYOK (Bring Your Own Key) scenarios

The adoption of hardware secure modules (HSM) enables secure transfer of keys and certificates to a protected cloud storage - [Azure Key Vault Managed HSM](../key-vault/managed-hsm/overview.md) – without allowing the cloud service provider to access such sensitive information. Secrets being transferred never exist outside an HSM in plaintext form, enabling scenarios for sovereignty of keys and certificates that are client generated and managed, but still using a cloud-based secure storage.

## Secure blockchain

A blockchain network is a decentralized network of nodes. These nodes are run and maintained by operators or validators who wish to ensure integrity and reach consensus on the state of the network. The nodes themselves are replicas of ledgers and are used to track blockchain transactions. Each node has a full copy of the transaction history, ensuring integrity and availability in a distributed network.

Blockchain technologies built on top of confidential computing can use hardware-based privacy to enable data confidentiality and secure computations. In some cases, the entire ledger is encrypted to safeguard data access. Sometimes, the transaction itself can occur within a compute module inside the enclave within the node.
