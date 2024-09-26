---
title: Troubleshoot autonomous database services for Oracle Database@Azure
description: Learn about how to troubleshoot for autonomous database services.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---

# Troubleshoot autonomous database services for Oracle Database@Azure

In this article, you learn to resolve common errors and provisioning issues in your Oracle Database@Azure environments.

The issues covered in this guide don't cover general issues related to Oracle Database@Azure configuration, settings, and account setup. For more information on those articles, see [Oracle Database@Azure Overview](https://docs.oracle.com/iaas/Content/multicloud/oaaoverview.htm).

## Terminations and Microsoft Azure locks

Oracle advises removal of all Microsoft Azure locks to Oracle Database@Azure resources before terminating the resource. For example, if you created a Microsoft Azure private endpoint, you should remove that resource first. If you have a policy to prevent the deletion of locked resources, the Oracle Database@Azure workflow to delete the resource fails because Oracle Database@Azure can't delete the lock.

## IP Address requirement differences

There are IP address requirement differences between Oracle Database@Azure and Oracle Cloud Infrastructure (OCI). In the [Requirements for IP Address Space](https://docs.oracle.com/iaas/exadatacloud/exacs/ecs-network-setup.html#GUID-D5C577A1-BC11-470F-8A91-77609BBEF1EA) documentation, the following changes for Oracle Database@Azure must be considered.
* Oracle Database@Azure only supports Exadata X9M. All other shapes are unsupported.
* Oracle Database@Azure reserves 13 IP addresses for the client subnet versus 3 for OCI requirements.

## Private DNS zone limitation

When provisioning Exadata Services, in a private DNS zone you can only select zones with four labels or less. For example, a.b.c.d is allowed, while a.b.c.d.e isn't allowed.

