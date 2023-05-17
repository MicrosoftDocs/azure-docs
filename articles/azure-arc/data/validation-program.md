---
title: "Azure Arc-enabled data services validation"
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 06/14/2022
ms.topic: conceptual
author: MikeRayMSFT
ms.author: mikeray
description: "Describes validation program for Kubernetes distributions for Azure Arc-enabled data services."
keywords: "Kubernetes, Arc, Azure, K8s, validation, data services, SQL Managed Instance"
---

# Azure Arc-enabled data services Kubernetes validation

Azure Arc-enabled data services team has worked with industry partners to validate specific distributions and solutions to host Azure Arc-enabled data services. This validation extends the [Azure Arc-enabled Kubernetes validation](../kubernetes/validation-program.md) for the data services. This article identifies partner solutions, versions, Kubernetes versions, SQL engine versions, and PostgreSQL server versions that have been verified to support the data services. 

To see how all Azure Arc-enabled components are validated, see [Validation program overview](../validation-program/overview.md)

> [!NOTE]
> At the current time, Azure Arc-enabled SQL Managed Instance is generally available in select regions.
>
> Azure Arc-enabled PostgreSQL server is available for preview in select regions.

## Partners

### DataON

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version
|-----|-----|-----|-----|-----|
|DataON AZS-6224|1.23.8|1.12.0_2022-10-11|16.0.537.5223|  12.3 (Ubuntu 12.3-1) |

### Dell

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version
|-----|-----|-----|-----|-----|
| [Unity XT](https://www.dell.com/en-us/dt/storage/unity.htm) |1.24.3|1.15.0_2023-01-10|16.0.816.19223 |Not validated|
| [PowerStore T](https://www.dell.com/en-us/dt/storage/powerstore-storage-appliance.htm) |1.24.3|1.15.0_2023-01-10|16.0.816.19223 |Not validated|
| [PowerFlex](https://www.dell.com/en-us/dt/storage/powerflex.htm) |1.21.5|1.4.1_2022-03-08|15.0.2255.119 | 12.3 (Ubuntu 12.3-1) |
| [PowerStore X](https://www.dell.com/en-us/dt/storage/powerstore-storage-appliance/powerstore-x-series.htm)|1.20.6|1.0.0_2021-07-30|15.0.2148.140 | 12.3 (Ubuntu 12.3-1) |

### Hitachi
|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version
|-----|-----|-----|-----|-----|
|[Hitachi UCP with RedHat OpenShift](https://www.hitachivantara.com/en-us/solutions/modernize-digital-core/infrastructure-modernization/hybrid-cloud-infrastructure.html) | 1.23.12 | 1.16.0_2023-02-14 | 16.0.937.6221 |  14.5 (Ubuntu 20.04)|
|[Hitachi UCP with VMware Tanzu](https://www.hitachivantara.com/en-us/solutions/modernize-digital-core/infrastructure-modernization/hybrid-cloud-infrastructure.html)  | 1.23.8 | 1.16.0_2023-02-14 | 16.0.937.6221 |  14.5 (Ubuntu 20.04)|

### HPE

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version
|-----|-----|-----|-----|-----|
|HPE Superdome Flex 280 | 1.23.5 | 1.15.0_2023-01-10 | 16.0.816.19223 |  14.5 (Ubuntu 20.04)|
|HPE Apollo 4200 Gen10 Plus | 1.22.6 | 1.11.0_2022-09-13 |16.0.312.4243|12.3 (Ubuntu 12.3-1)|

### Kublr

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version
|-----|-----|-----|-----|-----|
|Kublr 1.21.2 | 1.22.10 | 1.9.0_2022-07-12 | 16.0.312.4243 |12.3 (Ubuntu 12.3-1) |

### Lenovo

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version
|-----|-----|-----|-----|-----|
|Lenovo ThinkAgile MX1020 |1.24.6| 1.14.0_2022-12-13 |16.0.816.19223|Not validated|
|Lenovo ThinkAgile MX3520 |AKS on Azure Stack HCI 21H2| 1.10.0_2022-08-09 |16.0.312.4243| 12.3 (Ubuntu 12.3-1)|


### Nutanix

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version
|-----|-----|-----|-----|-----|
| Karbon 2.2<br/>AOS: 5.19.1.5<br/>AHV: 20201105.1021<br/>PC: Version pc.2021.3.02<br/> | 1.19.8-0 | 1.0.0_2021-07-30 | 15.0.2148.140| 12.3 (Ubuntu 12.3-1)|


### PureStorage

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version
|-----|-----|-----|-----|-----|
| Portworx Enterprise 2.7	1.22.5 | 1.20.7 | 1.1.0_2021-11-02 | 15.0.2148.140 | Not validated |
| Portworx Enterprise 2.9 | 1.22.5 | 1.1.0_2021-11-02 | 15.0.2195.191 |  12.3 (Ubuntu 12.3-1) |

### Red Hat

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version
|-----|-----|-----|-----|-----|
| OpenShift 4.10.16 | 1.23.5 | 1.11.0_2022-09-13 | 16.0.312.4243 |  12.3 (Ubuntu 12.3-1)|

### VMware

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version
|-----|-----|-----|-----|-----|
| TKG 2.1.0 | 1.24.9 | 1.15.0_2023-01-10	| 16.0.816.19223 | 	 14.5 (Ubuntu 20.04)
| TKG-1.6.0 | 1.23.8 | 1.11.0_2022-09-13	| 16.0.312.4243 | 	 12.3 (Ubuntu 12.3-1)
| TKGm v1.5.3 | 1.22.8 | 1.9.0_2022-07-12 | 16.0.312.4243 |  12.3 (Ubuntu 12.3-1)|

### Wind River

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version
|-----|-----|-----|-----|-----|
|Wind River Cloud Platform 22.12 | 1.24.4|1.14.0_2022-12-13 |16.0.816.19223| 14.5 (Ubuntu 20.04) |
|Wind River Cloud Platform 22.06 | 1.23.1|1.9.0_2022-07-12 |16.0.312.4243| 12.3 (Ubuntu 12.3-1) |

## Data services validation process

The Sonobuoy Azure Arc-enabled data services plug-in automates the provisioning and testing of Azure Arc-enabled data services on a Kubernetes cluster.

### Prerequisites
v1.22.5+vmware.1

- [Azure Data CLI (`azdata`)](/sql/azdata/install/deploy-install-azdata)
- [kubectl](https://kubernetes.io/docs/home/)
- [Azure Data Studio - Insider build](https://github.com/microsoft/azuredatastudio)

Create a Kubernetes config file configured to access the target Kubernetes cluster and set as the current context. How this file is generated and brought local to your computer is different from platform to platform. See [Kubernetes.io](https://kubernetes.io/docs/home/).

### Process

The conformance tests run as part of the Azure Arc-enabled Data services validation. A pre-requisite to running these tests is to pass on the Azure Arc-enabled Kubernetes tests for the Kubernetes distribution in use.

These tests verify that the product is compliant with the requirements of running and operating data services. This process helps assess if the product is enterprise ready for deployments.

The tests for data services cover the following in indirectly connected mode

1. Deploy data controller in indirect mode
2. Deploy [Azure Arc-enabled SQL Managed Instance](create-sql-managed-instance.md)
3. Deploy [Azure Arc-enabled PostgreSQL server](create-postgresql-server.md)

More tests will be added in future releases of Azure Arc-enabled data services.

## Additional information

- [Validation program overview](../validation-program/overview.md)
- [Azure Arc-enabled Kubernetes validation](../kubernetes/validation-program.md)
- [Azure Arc validation program - GitHub project](https://github.com/Azure/azure-arc-validation/)

## Next steps

- [Plan an Azure Arc-enabled data services deployment](plan-azure-arc-data-services.md)
- [Create a data controller - indirectly connected with the CLI](create-data-controller-indirect-cli.md)
- To create a directly connected data controller, start with [Prerequisites to deploy the data controller in direct connectivity mode](create-data-controller-direct-prerequisites.md).
