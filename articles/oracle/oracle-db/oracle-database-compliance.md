---
title: Compliance information for Oracle Database@Azure
description: Learn about compliance and service management in Oracle Database@Azure.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---

# Compliance information for Oracle Database@Azure

In this article, learn about compliance certifications and service management responsibilities in Oracle Database@Azure.

## Shared responsibility between Oracle and Microsoft

Oracle Database@Azure is a database service that runs Oracle database workloads in a customer's Azure environment. Oracle Cloud Infrastructure (OCI) offers several Oracle Cloud Database services through a customer's Azure environment. You can monitor database metrics, audit logs, events, logging data, and telemetry natively in Azure. The service runs on infrastructure that's managed by the Cloud Infrastructure operations team at Oracle. The Oracle operations team manages software patching, infrastructure updates, and other operations through a connection to OCI. Although the service requires that customers have an OCI tenancy, most service activities take place in the Azure environment.

All infrastructure for Oracle Database@Azure is colocated in Azure physical datacenters, uses Azure Virtual Network for networking, and is managed in the Azure environment. Federated identity and access management are provided by Microsoft Entra ID.

## Related content

- [Microsoft Service Trust Portal](https://servicetrust.microsoft.com/)
- [Oracle Cloud compliance](https://www.oracle.com/corporate/cloud-compliance/)
- [Oracle and Microsoft support for Oracle Database@Azure](oracle-database-support.md)
