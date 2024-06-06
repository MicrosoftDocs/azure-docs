---
title: Provision and manage Oracle Database@Azure
description: Provision and Manage Oracle Database@Azure.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: article
ms.date: 6/07/2024
ms.custom: engagement-fy23
ms.author: jacobjaygbay
---

# Provision and manage Oracle Database@Azure

Oracle Database@Azure (OracleDB@Azure) provides you seamless integration of Oracle resources within your Microsoft Azure cloud environment.

You access the OracleDB@Azure service through the Microsoft Azure Portal. You create and manage Oracle Exadata Infrastructure and Oracle Exadata VM Cluster resources with direct access to the Oracle Cloud Infrastructure (OCI) portal for creation and management of Oracle Exadata Databases, including all Container Databases (CDBs) and Pluggable Databases (PDBs).

There are IP address requirement differences between Oracle Database@Azure and Oracle Cloud Infrastructure (OCI). In the [Requirements for IP Address Space](https://docs.oracle.com/iaas/exadatacloud/exacs/ecs-network-setup.html#GUID-D5C577A1-BC11-470F-8A91-77609BBEF1EA) documentation, the following changes for Oracle Database@Azure must be considered.

* Oracle Database@Azure only supports Exadata X9M. Other shapes are unsupported.
* Oracle Database@Azure reserves 13 IP addresses for the client subnet versus 3 for OCI requirements.

The following topics provide specifics of the creation and management tasks associated with each resource type.

Topics:

* [Provisioning Exadata Infrastructure](https://docs.oracle.com/en-us/iaas/odaaz/odaaz-provisioning-exadata-infrastructure.html#GUID-9CD7A523-0945-4B89-B688-C2EC3DA8F332)

* [Provisioning an Exadata VM Cluster](https://docs.oracle.com/en-us/iaas/odaaz/odaaz-provisioning-exadata-vm-cluster.html#GUID-3C953575-8D5E-470E-8C3A-5229A73E10CC)
* [Provisioning Oracle Autonomous Databases](https://docs.oracle.com/en-us/iaas/odaaz/odaaz-provisioning-autonomous-database.html#GUID-C5B35802-13A6-4531-93AD-5726868C9918)
* [Using Terraform](https://docs.oracle.com/en-us/iaas/odaaz/odaaz-using-terraform.html#GUID-10CF47A1-F8E5-4EEF-AE36-9855CA896125)
* [Managing Resources](https://docs.oracle.com/en-us/iaas/odaaz/odaaz-managing-resources.html#GUID-75B01ABA-B721-4E69-923E-F4513A510CE1)
* [Provisioning Troubleshooting](https://docs.oracle.com/en-us/iaas/odaaz/odaaz-provisioningtroubleshooting.html#GUID-DACCA740-025E-4466-8BB7-AC8C1D23E450)

For more information on specific database topics beyond their implementation and use within OracleDB@Azure, see the following topics:
* [Exadata Database Service on Dedicated Infrastructure](https://docs.oracle.com/en/engineered-systems/exadata-cloud-service/ecscm/index.html#Oracle%C2%AE-Cloud)
* [Manage Databases on Exadata Cloud Infrastructure](https://docs.oracle.com/en/engineered-systems/exadata-cloud-service/ecscm/manage-databases.html#GUID-51424A67-C26A-48AD-8CBA-B015F88F841A)
* [Using Oracle Autonomous Database Serverless](https://docs.oracle.com/en/cloud/paas/autonomous-database/serverless/adbsb/index.html)