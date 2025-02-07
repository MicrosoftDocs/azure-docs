---
title: Troubleshoot Oracle Autonomous Database@Azure
description: Learn how to troubleshoot problems in Oracle Autonomous Database@Azure.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---

# Troubleshoot Oracle Autonomous Database@Azure

In this article, learn how to resolve common problems and provisioning issues in your Oracle Autonomous Database@Azure environment.

This article doesn't describe general issues related to Oracle Database@Azure configuration, settings, and account setup. For more information about these topics, see [Overview of Oracle Database@Azure](https://docs.oracle.com/iaas/Content/multicloud/oaaoverview.htm).

## Terminations and Microsoft locks

Oracle recommends that you remove all Microsoft locks that are applied to Oracle Database@Azure resources before you terminate a resource. If you have a policy to prevent the deletion of locked resources, the Oracle Database@Azure process to delete the resource fails because Oracle Database@Azure can't delete locked resources. For example, if you created an Azure private endpoint, you should remove the lock before you delete the resource.

## IP address requirement differences between Oracle Database@Azure and OCI

Oracle Database@Azure has different IP address requirements than Oracle Cloud Infrastructure (OCI). As described in [Requirements for IP address space](https://docs.oracle.com/iaas/exadatacloud/doc/ecs-network-setup.html#ECSCM-GUID-D5C577A1-BC11-470F-8A91-77609BBEF1EA), the following differences in IP address requirements for Oracle Database@Azure must be considered:

- Oracle Database@Azure supports only Oracle Exadata X9M. All other shapes are unsupported.
- Oracle Database@Azure reserves 13 IP addresses for the client subnet versus 3 IP addresses for OCI requirements.

## Private DNS zone limitation

When you provision Oracle Exadata Database@Azure in a private DNS zone, you can select only zones that have four labels or less. For example, `a.b.c.d` is allowed, but `a.b.c.d.e` isn't allowed.
