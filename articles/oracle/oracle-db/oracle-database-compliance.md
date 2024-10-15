---
title: Oracle Database@Azure compliance information
description: Learn about compliance for Oracle Database@Azure
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---

#  Compliance information

In this article, you learn about the compliance certifications and service management responsibilities of the Oracle Database@Azure.

## Shared responsibility between Oracle and Microsoft

 Oracle Database@Azure is a  database service that runs Oracle Database workloads in a customer's Azure environment. The Oracle Cloud Infrastructure (OCI) offers several Oracle Cloud Database services through a customer's Azure environment. The service lets customers  monitor database metrics, audit logs, events, logging data, and telemetry natively in Azure. The service runs on infrastructure managed by Oracle's Cloud Infrastructure operations team, which performs software patching, infrastructure updates, and other operations through a connection to Oracle Cloud. While the service requires that customers have a  tenancy, most service activities take place in the Azure environment.

All infrastructure for  Oracle Database@Azure is colocated in Azure's physical data centers and uses Azure Virtual Network for networking, managed within the Azure environment. Federated identity and access management are provided by Microsoft Entra ID.

## Next steps

For detailed information on the compliance certifications, see [Microsoft service trust portal](https://servicetrust.microsoft.com/) and [Oracle compliance website](https://www.oracle.com/corporate/cloud-compliance/). If you have further questions about OracleDB@Azure compliance, contact your account team and/or get information through [Oracle and Microsoft support for Oracle Database@Azure](oracle-database-support.md).






