---
title: Azure Managed Confidential Consortium Framework application scenarios
description: An overview of the application scenarios enabled by Azure Managed CCF.
services: managed-confidential-consortium-framework
author: msftsettiy
ms.service: confidential-ledger
ms.topic: overview
ms.date: 09/28/2023
ms.author: settiy

---
# Azure Managed Confidential Consortium Framework application scenarios

The Confidential Consortium Framework (CCF) is an open-source framework for building secure, highly available, and performant applications that focus on multi-party compute and data. CFF uses the power of trusted execution environments (TEE, or enclave), decentralized systems concepts, and cryptography, to enable enterprise-ready multiparty systems. CCF is based on industry standard web technologies that allows clients to interact with CCF aware applications over HTTPS.

The framework runs exclusively on hardware-backed secure enclaves, a heavily monitored and isolated runtime environment that keeps potential attacks at bay. It also runs on a minimalistic Trusted Computing Base (TCB) and limits the operator's role.

Following are a few example application scenarios that CCF enables.

## Decentralized Role Based Access Control(RBAC)

A CCF application enables its members to run a confidential system with attested components to propose and approve changes without a single party holding all the power. Organizations have invested time and resources to build and operate Line of Business (LOB) applications that are critical to the smooth operation of their business. Many organizations want to implement confidentiality and decentralized governance in the LOB applications but are at a gridlock when deciding between day-to-day operation vs. funding new research and development.

A recommended approach is to deploy the LOB application on an Azure Confidential Compute offering like an [Azure Confidential VM](../confidential-computing/confidential-vm-overview.md) or [Azure Confidential Containers](../confidential-computing/confidential-containers.md), which requires minimal to no changes. Specific parts of the application requiring multi-party governance can be offload to Managed CCF.

Due to several recent breaches in the supply chain industry, organizations are exploring ways to increase visibility and auditability into their manufacturing process. On the other hand, consumer awareness on unfair manufacturing processes and mistreatment of workforce has increased.  In this example, we describe a scenario that tracks the life of coffee beans from the farm to the cup. Fabrikam is a coffee bean roaster and retailer. It hosts an existing LOB web application that is used by different personas like farmers, distributors, Fabrikam's procurement team and the end consumers. To improve security and auditability, Fabrikam deploys the web application to an Azure Confidential VM and uses decentralized RBAC managed in Managed CCF by a consortium of members.

A sample [decentralized RBAC application](https://github.com/microsoft/ccf-app-samples/tree/main/decentralize-rbac-app) is published in GitHub for reference.

## Data for Purpose

A CCF application enables multiple participants to share data confidentially for specific purposes by trusting only the hardware (TEEs). It can selectively reveal aggregated information or selectively reveal raw data to authorized parties (for example, regulator).​​

A use case that requires aggregation tied with confidentiality is data reconciliation. It is a common and frequent action in the financial services, healthcare and insurance domains. In this example, we target the healthcare industry. Patient data is generated, consumed and saved across multiple providers like the physician's offices, hospitals and insurance providers. It would be prudent to reconcile the patient data from the different sources to derive useful insights that could throw light into the effectiveness of the prescribed drugs and alter course if needed. However, due to industry and governmental regulations and privacy concerns, it is hard to share data in the clear.

A CCF application is a good fit for this scenario as it guarantees confidentiality and auditability of the transactions. A sample [data reconciliation application](https://github.com/microsoft/ccf-app-samples/tree/main/data-reconciliation-app) is published in GitHub. It ingests data from three sources, performs aggregation inside a TEE and produces a report that summarizes the similarities and the differences in the data.

## Transparent System Operation

CCF enables organizations to operate a system where users can independently confirm that it is run correctly.​​ Organizations can share the CCF source code for users to audit both the system’s governance and application code and verify that their transactions are handled according to expectations.​

Auditability is one of the core tenants of the financial services industry. The various government and industry standards emphasize periodic audits of the processes, practices and services to ensure that customer data is handled securely and confidentially at all times. When it comes to implementation, confidentiality and auditability are at odds. CCF applications can play a significant role in breaking this barrier. By using receipts, auditors can independently verify the integrity of transactions without accessing the online service. Refer to the [Audit](https://microsoft.github.io/CCF/main/audit/index.html) section in the CCF documentation to learn more about offline verification.

A sample [banking application](https://github.com/microsoft/ccf-app-samples/tree/main/banking-app) is published in GitHub to demonstrate auditability in CCF applications.

## Next steps

- [Quickstart: Deploy an Azure Managed CCF application](quickstart-deploy-application.md)
- [Quickstart: Azure CLI](quickstart-python.md)
- [FAQ](faq.yml)
