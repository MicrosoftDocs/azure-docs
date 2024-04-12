---
title: Overview of Azure Managed Confidential Consortium Framework
description: An overview of Azure Managed Confidential Consortium Framework, a highly secure service for deploying confidential application.
services: managed-confidential-consortium-framework
author: msftsettiy
ms.service: confidential-ledger
ms.topic: overview
ms.date: 09/07/2023
ms.author: settiy

---

# Overview of Azure Managed Confidential Consortium Framework

Azure Managed Confidential Consortium Framework (Managed CCF) is a new and highly secure service for deploying confidential applications. It enables developers to build confidential applications that require programmable confidentiality on data and information that might be needed between multiple parties. Typically, members agree on the constitution (rules that the members set up) of the network, set governance and business transaction rules, and the business transactions take place based on what was defined. If there are changes to the governance that impact the business rules, the consortium needs to approve those changes.

In fact, the framework runs exclusively on hardware-backed secure enclaves, a heavily monitored and isolated runtime environment, which keeps potential attacks at bay. It also runs on a minimalistic Trusted Computing Base (TCB) and limits the operator's role.

As the name suggests, Azure Managed CCF utilizes the [Azure Confidential Computing platform](../confidential-computing/index.yml) and the open-sourced [Confidential Consortium Framework](https://ccf.dev) as the underlying technology to provide a high integrity platform that is tamper-protected and evident. A Managed CCF instance spans across three or more identical machines, each of which run in a dedicated, fully attested hardware-backed enclave. The data integrity is maintained through a consensus-based blockchain.

The following diagram shows a high-level overview of the different layers of the Managed CCF platform and where the application code fits into it.

:::image type="content" source="media/managed-confidential-consortium-framework-overview.png" alt-text="A diagram showing where the application code fits in the Managed CCF platform.":::

## Key features

A few key features of Managed CCF are confidentiality, customizable governance, high availability, auditability and transparency.

:::image type="content" source="media/managed-confidential-consortium-framework-key-features.png" alt-text="A diagram showing the key features.":::

### Confidentiality

The nodes run inside a hardware-based Trusted Execution Environment (TEE) which ensures that the data in use is protected and encrypted, while in RAM, and during computation. The following diagram shows how the code and data is protected while in use.

:::image type="content" source="media/tee-enclave-example.png" alt-text="A diagram showing a TEE enclave example.":::

### Customizable governance

The participants, called members, share the responsibility for the network operationability established by a constitution. The shared governance model establishes trust and transparency among the members through a voting process that is public and auditable. The constitution is implemented as a set of JavaScript scripts, which can be customized during the network creation and later. The following diagram shows how the members participate in a governance operation to either accept or reject a proposed action enforced by the constitution.

:::image type="content" source="media/governance.png" alt-text="A diagram illustrating proposal governance.":::

### High Availability and resiliency

A Managed CCF resource is built on top of a network of distributed nodes that maintains an identical replica of the transactions. The platform is designed and built from the ground-up to be tolerant and resilient to network and infrastructure disruptions. The platform guarantees high availability and quick service healing by spreading the nodes across [Azure Availability Zones](../reliability/availability-zones-overview.md). When an unexpected disaster happens, quick recoverability and business continuity are enabled by automatic backup and restore of the ledger files.

### Auditability and transparency

The state of the network is auditable via receipts. A receipt is a signed proof that is associated with a transaction. The receipts are verifiable offline and by third parties, equivalent to "this transaction produced this outcome at this position in the network". Together with a copy of the ledger, or other receipts, they can be used to audit the service and hold the consortium accountable.

The governance operations and the associated public key value maps are stored in plain text in the ledger. Customers are encouraged to download the ledger and verify its integrity using open-sourced scripts that are shipped with CCF.

### Developer friendly

Developers can use familiar development tools like Visual Studio Code and programming languages like TypeScript, JavaScript and C++ combined with Node.js to develop confidential applications targeting the Managed CCF platform. Open sourced sample applications are published for reference and continuously updated based on feed back.

## Open-source CCF (IaaS) vs. Azure Managed CCF (PaaS)

Customers can build applications that target the Confidential Consortium Framework (CCF) and host it themselves. But, like any other self-hosted applications, it requires regular maintenance and patching (both hardware and software) which consumes time and resource. Azure Managed CCF abstracts away the day-to-day operations, allowing teams to focus on the core business priorities. The following diagram compares and contrasts the differences between a self-hosted CCF network to Azure Managed CCF.

:::image type="content" source="media/paas-vs-iaas.png" alt-text="A diagram showing Azure Managed CCF vs open-source CCF.":::

## Next steps

- [Quickstart: Azure portal](quickstart-portal.md)
- [Quickstart: Azure CLI](quickstart-python.md)
- [FAQ](faq.yml)
