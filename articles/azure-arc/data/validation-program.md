---
title: "Azure Arc-enabled data services validation program"
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 07/30/2021
ms.topic: conceptual
author: MikeRayMSFT
ms.author: mikeray
description: "Describes validation program for Kubernetes distributions for Azure Arc-enabled data services."
keywords: "Kubernetes, Arc, Azure, K8s, validation, data services, SQL Managed Instance"
---

# Azure Arc-enabled data services Kubernetes validation program

Azure Arc-enabled data services team has worked with industry partners to validate specific distributions and solutions to host Azure Arc-enabled data services. This validation extends the [Azure Arc-enabled Kubernetes validation](../kubernetes/validation-program.md) for the data services. This article identifies partner solutions, versions, Kubernetes versions, SQL Server versions, and PostgreSQL Hyperscale versions that have been verified to support the data services. 

To see how all Azure Arc-enabled components are validated, see [Validation program overview](../validation-program/overview.md)

> [!NOTE]
> At the current time, Azure Arc-enabled SQL Managed Instance is generally available in select regions.
>
> Azure Arc-enabled PostgreSQL Hyperscale is available for preview in select regions.

## Partners

### Dell

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL Server version | PostgreSQL Hyperscale version
|-----|-----|-----|-----|-----|
| Dell EMC PowerFlex |1.19.7|20.3.3|SQL Server 2019 (15.0.4123) | |
| PowerFlex version 3.6 |1.19.7|20.3.3|SQL Server 2019 (15.0.4123) | |
| PowerFlex CSI version 1.4 |1.19.7|20.3.3|SQL Server 2019 (15.0.4123) | |
| PowerStore X|1.20.6|20.3.3|SQL Server 2019 (15.0.4123) |postgres 12.3 (Ubuntu 12.3-1) |
| Powerstore T|1.20.6|20.3.3|SQL Server 2019 (15.0.4123) |postgres 12.3 (Ubuntu 12.3-1)|

### Nutanix

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL Server version | PostgreSQL Hyperscale version
|-----|-----|-----|-----|-----|
| Karbon 2.2<br/>AOS: 5.19.1.5<br/>AHV:20201105.1021<br/>PC: Version pc.2021.3.02<br/> | 1.19.8-0 | 20.3.4 | SQL Server 2019 (15.0.4123)|postgres 12.3 (Ubuntu 12.3-1)|

### PureStorage

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL Server version | PostgreSQL Hyperscale version
|-----|-----|-----|-----|-----|
| Portworx Enterprise 2.7 | 1.20.7 | 20.3.5 | SQL Server 2019 (15.0.4138)||

### Red Hat

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL Server version | PostgreSQL Hyperscale version
|-----|-----|-----|-----|-----|
| OpenShift 7.13 | 1.20.0 | 20.3.5 | SQL Server 2019 (15.0.4138)|postgres 12.3 (Ubuntu 12.3-1)|

### VMware

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL Server version | PostgreSQL Hyperscale version
|-----|-----|-----|-----|-----|
| TKGm v1.3.1 | 1.20.5 | 20.3.3 | SQL Server 2019 (15.0.4123)|postgres 12.3 (Ubuntu 12.3-1)|

## Data services validation process

The Sonobuoy Arc-enabled data services plug-in automates the provisioning and testing of Azure Arc enabled data services on a Kubernetes cluster.

### Prerequisites

- Azure Data CLI ("azdata") installed (install instructions)
- kubectl installed (install instructions)
- A Kubernetes config file configured to access the target Kubernetes cluster and set as the current context. How this is generated and brought local to your computer is different from platform to platform. (general info about Kubernetes config files)
- Azure Data Studio - Insiders installed (install instructions)
- Git installed (install instructions)

The conformance tests run as part of the Azure Arc-enabled Data services validation. A pre-requisite to running these tests is to pass on the Azure Arc-enabled Kubernetes tests for the Kubernetes distribution in use.
These tests verify that the product is compliant with the requirements of running and operating data services. This will help assess if the product is Enterprise ready for deployments.

The tests for data services cover the following in indirectly connected mode

1. Deploy data controller in indirect mode
2. Deploy sql-mi
3. Deploy postgresql-hs
4. Scale out postgres-hs

More tests will be added in future releases of Azure Arc-enabled data services.

## Additional information

- [Validation program overview](../validation-program/overview.md)
- [Azure Arc-enabled Kubernetes validation](../kubernetes/validation-program.md)
- [Azure Arc validation program - GitHub project](https://github.com/Azure/azure-arc-validation/)

## Next steps

[Create a data controller](create-data-controller.md)
