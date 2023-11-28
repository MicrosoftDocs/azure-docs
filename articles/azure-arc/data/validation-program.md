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
> At the current time, SQL Managed Instance enabled by Azure Arc is generally available in select regions.
>
> Azure Arc-enabled PostgreSQL server is available for preview in select regions.

## Partners

### DataON

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version
|-----|-----|-----|-----|-----|
|[DataON AZS-6224](https://www.dataonstorage.com/products-solutions/integrated-systems-for-azure-stack-hci/dataon-integrated-system-azs-6224-for-azure-stack-hci/)|1.24.11|	1.20.0_2023-06-13|16.0.5100.7242|14.5 (Ubuntu 20.04)|

### Dell

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version
|-----|-----|-----|-----|-----|
| [Unity XT](https://www.dell.com/en-us/dt/storage/unity.htm) |1.24.3|1.15.0_2023-01-10|16.0.816.19223 |Not validated|
| [PowerStore T](https://www.dell.com/en-us/dt/storage/powerstore-storage-appliance.htm) |1.24.3|1.15.0_2023-01-10|16.0.816.19223 |Not validated|
| [PowerFlex](https://www.dell.com/en-us/dt/storage/powerflex.htm) |1.25.0 | 1.21.0_2023-07-11 | 16.0.5100.7242 | 14.5 (Ubuntu 20.04) |
| [PowerStore X](https://www.dell.com/en-us/dt/storage/powerstore-storage-appliance/powerstore-x-series.htm)|1.20.6|1.0.0_2021-07-30|15.0.2148.140 | 12.3 (Ubuntu 12.3-1) |

### Hitachi
|Solution and version |Kubernetes version |Azure Arc-enabled data services version |SQL engine version |PostgreSQL server version|
|-----|-----|-----|-----|-----|
|Red Hat OCP 4.12.30|1.25.11|1.25.0_2023-11-14|16.0.5100.7246|Not validated|
|Hitachi Virtual Storage Software Block software-defined storage (VSSB)|1.24.12 |1.20.0_2023-06-13 |16.0.5100.7242 |14.5 (Ubuntu 20.04)|
|Hitachi Virtual Storage Platform (VSP) |1.24.12 |1.19.0_2023-05-09 |16.0.937.6221 |14.5 (Ubuntu 20.04)|
|[Hitachi UCP with RedHat OpenShift](https://www.hitachivantara.com/en-us/solutions/modernize-digital-core/infrastructure-modernization/hybrid-cloud-infrastructure.html) |1.23.12 |1.16.0_2023-02-14 |16.0.937.6221 |14.5 (Ubuntu 20.04)|

### HPE

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version|
|-----|-----|-----|-----|-----|
|HPE Superdome Flex 280 | 1.25.12 | 1.22.0_2023-08-08 | 16.0.5100.7242 |Not validated|
|HPE Apollo 4200 Gen10 Plus | 1.22.6 | 1.11.0_2022-09-13 |16.0.312.4243|12.3 (Ubuntu 12.3-1)|

### Kublr

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version|
|-----|-----|-----|-----|-----|
|[Kublr 1.26.0](https://docs.kublr.com/releasenotes/1.26/release-1.26.0/)|1.26.4, 1.25.6, 1.24.13, 1.23.17, 1.22.17|1.21.0_2023-07-11|16.0.5100.7242|14.5 (Ubuntu 20.04)|
|Kublr 1.21.2 | 1.22.10 | 1.9.0_2022-07-12 | 16.0.312.4243 |12.3 (Ubuntu 12.3-1) |

### Lenovo

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version|
|-----|-----|-----|-----|-----|
|[Lenovo ThinkEdge SE455 V3](https://lenovopress.lenovo.com/lp1724-lenovo-thinkedge-se455-v3-server)|1.26.6|1.24.0_2023-10-10|16.0.5100.7246|Not validated|
|Lenovo ThinkAgile MX1020 |1.26.6|1.24.0_2023-10-10 |16.0.5100.7246|Not validated|
|Lenovo ThinkAgile MX3520 |1.22.6|1.10.0_2022-08-09 |16.0.312.4243| 12.3 (Ubuntu 12.3-1)|

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
| [OpenShift 4.13.4](https://docs.openshift.com/container-platform/4.13/release_notes/ocp-4-13-release-notes.html) | 1.26.5 | 1.21.0_2023-07-11 | 16.0.5100.7242 |  14.5 (Ubuntu 20.04) |
| OpenShift 4.10.16 | 1.23.5 | 1.11.0_2022-09-13 | 16.0.312.4243 |  12.3 (Ubuntu 12.3-1)|

### VMware

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version
|-----|-----|-----|-----|-----|
|TKGs 2.2|1.25.7|1.23.0_2023-09-12|16.0.5100.7246|14.5 (Ubuntu 20.04)|
|TKGm 2.3|1.26.5|1.23.0_2023-09-12|16.0.5100.7246|14.5 (Ubuntu 20.04)|
|TKGm 2.2|1.25.7|1.19.0_2023-05-09|16.0.937.6223|14.5 (Ubuntu 20.04)|
|TKGm 2.1.0|1.24.9|1.15.0_2023-01-10|16.0.816.19223|14.5 (Ubuntu 20.04)|



### Wind River

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL engine version | PostgreSQL server version
|-----|-----|-----|-----|-----|
| [Wind River Cloud Platform 22.12](https://www.windriver.com/studio/operator/cloud-platform) | 1.24.4 | 1.21.0_2023-07-11 | 16.0.5100.7242 | Not validated |
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
2. Deploy [SQL Managed Instance enabled by Azure Arc](create-sql-managed-instance.md)
3. Deploy [Azure Arc-enabled PostgreSQL server](create-postgresql-server.md)

More tests will be added in future releases of Azure Arc-enabled data services.

## Additional information

- [Validation program overview](../validation-program/overview.md)
- [Azure Arc-enabled Kubernetes validation](../kubernetes/validation-program.md)
- [Azure Arc validation program - GitHub project](https://github.com/Azure/azure-arc-validation/)

## Related content

- [Plan an Azure Arc-enabled data services deployment](plan-azure-arc-data-services.md)
- [Create a data controller - indirectly connected with the CLI](create-data-controller-indirect-cli.md)
- To create a directly connected data controller, start with [Prerequisites to deploy the data controller in direct connectivity mode](create-data-controller-direct-prerequisites.md).






