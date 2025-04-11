---
title: Why Azure Virtual Enclaves?
description: Why Azure Virtual Enclaves?
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Why Azure Virtual Enclaves?
"Azure Virtual Enclaves (AVE) provides secure Azure computing environments for the most sensitive mission workloads."

AVE is a platform service that enables users to quickly deploy and manage a dynamic self-governing security boundary with built-in protections to ensure your environments meets the highest levels of security standards and best practices that exist and are followed by highly regulated industries with the most sensitive data requirements.

- Quick and simple deployment of secure, isolated Azure environments
- Secure & isolated boundary protection: Provides boundary isolation, enclave management, and governance
- Workload & connection management: Manages workload and enclave connectivity and access such as VDI, COTS/GOTS, and PaaS
- Observability, security, & compliance: Enables visibility into enclave and workload configuration and security posture

## The Value of AVE

- Ability to quickly deploy secure & compliant Azure environments
- Zero-trust networking isolation by default with built-in connection management  
- Simplified governance with automatic policy compliance security posture
- Accelerated workload deployment and configuration via service catalog
- Support for highly regulated industries and customers that need high degree of security, isolation, and governance

## Azure Cloud Availability

Azure Commercial, Gov, Secret, and Top Secret

## Comparison to other Microsoft Products
- Azure Landing Zones (ALZ)
- Mission Landing Zones (MLZ)
- Sovereign Landing Zones (SLZ)
- MS-ISR
- MSWB

* Templates combine existing Azure products together in a best-practice fashion. RPs provide new functionality that can also be added to templates.

|  | AVE | MLZ | ALZ | SLZ | MSISR | MSWB     |
|-------------------------|-------|-------|-------|-------|-------|-------|
| **Deploy Method**                   | RP       | Template | Template | Template |          | RP       |
| **Approvals**                       | X        |          |          |          |          |          |
| **Service Catalog**                 | X        |          |          |          |          |          |
| **Connection Manager**              | X        |          |          |          |          |          |
| **Maturity**                        |          |          |          |          |          |          |
| **Flexibility**                     |          |          |          |          |          |          |
| **Highly Opinionated Architecture** | X  | X        | X        |          |          |          |
| **SCCA**                            |          |          |          |          |          |          |

SCCA = [Secure Cloud Computing Architecture](../azure-government/compliance/secure-azure-computing-architecture.md)
