---
title: Overview of provisioning
description: Learn the overview of provisioning.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: article
ms.date: 6/07/2024
ms.custom: engagement-fy23
ms.author: jacobjaygbay
---

# Overview of provisioning 

Oracle Database@Azure (OracleDB@Azure) provides you seamless integration of Oracle resources within your Microsoft Azure cloud environment.

You access the OracleDB@Azure service through the Microsoft Azure portal. You create and manage Oracle Exadata Infrastructure and Oracle Exadata VM Cluster resources with direct access to the Oracle Cloud Infrastructure (OCI) portal for creation and management of Oracle Exadata Databases, including all Container Databases (CDBs) and Pluggable Databases (PDBs).

There are IP address requirement differences between Oracle Database@Azure and Oracle Cloud Infrastructure (OCI). In the [Requirements for IP Address Space](https://docs.oracle.com/iaas/exadatacloud/exacs/ecs-network-setup.html#GUID-D5C577A1-BC11-470F-8A91-77609BBEF1EA) documentation, the following changes for Oracle Database@Azure must be considered.

* Oracle Database@Azure only supports Exadata X9M. Other shapes are unsupported.
* Oracle Database@Azure reserves 13 IP addresses for the client subnet versus 3 for OCI requirements.

The following topics provide detailed information about creating and managing tasks associated with each resource type.

* [Provision Exadata infrastructure](provision-oracle-exadata-infrastructure.md)
* [Provision an Exadata VM Cluster](provision-oracle-exadata-vm-cluster.md)
* [Provision Oracle autonomous databases](provision-autonomous-oracle-databases.md)
* [Use HashiCorp Terraform to provision Oracle Database@Azure](provision-use-terraform-oracle-database.md)
* [Manage resources for Oracle Database@Azure](provision-manage-oracle-resources.md)
* [Troubleshoot provisioning issues](provision-troubleshoot-oracle-database.md)

For more information on specific database topics beyond their implementation and use within OracleDB@Azure, see the following topics:

* [Exadata Database Service on Dedicated Infrastructure](https://docs.oracle.com/en/engineered-systems/exadata-cloud-service/ecscm/index.html#Oracle%C2%AE-Cloud)
* [Manage Databases on Exadata Cloud Infrastructure](https://docs.oracle.com/en/engineered-systems/exadata-cloud-service/ecscm/manage-databases.html#GUID-51424A67-C26A-48AD-8CBA-B015F88F841A)
* [Using Oracle Autonomous Database Serverless](https://docs.oracle.com/en/cloud/paas/autonomous-database/serverless/adbsb/index.html)