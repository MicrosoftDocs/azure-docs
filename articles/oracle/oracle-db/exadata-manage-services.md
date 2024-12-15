---
title: Exadata services
description: Learn about how to manage Exadata services.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---

# Exadata services

Oracle Database@Azure (OracleDB@Azure) provides you with seamless integration of Oracle resources within your Microsoft Azure cloud environment.

You access the OracleDB@Azure service through the Microsoft Azure portal. You create and manage Oracle Exadata Infrastructure and Oracle Exadata VM Cluster resources with direct access to the Oracle Cloud Infrastructure (OCI) portal for creation and management of Oracle Exadata Databases, including all Container Databases (CDBs) and Pluggable Databases (PDBs).

There are IP address requirement differences between Oracle Database@Azure and Oracle Cloud Infrastructure (OCI). In the [Requirements for IP Address Space](https://docs.oracle.com/iaas/exadatacloud/exacs/ecs-network-setup.html#GUID-D5C577A1-BC11-470F-8A91-77609BBEF1EA) documentation, the following changes for Oracle Database@Azure must be considered.
* Oracle Database@Azure only supports Exadata X9M. Other shapes are unsupported.
* Oracle Database@Azure reserves 13 IP addresses for the client subnet versus 3 for OCI requirements.

The following articles provide specifics of the creation and management tasks associated with each resource type.

Articles:
* [What's New in Exadata Services](exadata-manage-services.md)
* [Provision Exadata Infrastructure](exadata-provision-infrastructure.md)
* [Provision an Exadata VM Cluster](exadata-provision-vm-cluster.md)
* [Manage Exadata Resources](exadata-manage-resources.md)
* [Operate processes for Exadata resources](exadata-operations-processes-services.md)
* [OCI Multicloud Landing Zone for Azure](exadata-multicloud-landing-zone-azure-services.md)
* [Terraform/OpenTofu Examples for Exadata Services](exadata-examples-services.md)
* [Troubleshooting and Known Issues for Exadata Services](exadata-troubleshoot-services.md)

For more information on specific Oracle Exadata Infrastructure or Oracle Exadata VM Cluster articles beyond their implementation and use within OracleDB@Azure, see the following articles:

* [Exadata Database Service on Dedicated Infrastructure](https://docs.oracle.com/en/engineered-systems/exadata-cloud-service/ecscm/index.html#Oracle%C2%AE-Cloud)
* [Manage Databases on Exadata Cloud Infrastructure](https://docs.oracle.com/en/engineered-systems/exadata-cloud-service/ecscm/manage-databases.html#GUID-51424A67-C26A-48AD-8CBA-B015F88F841A)
* [Oracle Exadata Database Service on Dedicated Infrastructure Overview](https://docs.oracle.com/en/engineered-systems/exadata-cloud-service/ecscm/exadata-cloud-infrastructure-overview.html)