---
title: Troubleshoot provisioning issues
description: Troubleshoot provisioning issues.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: article
ms.date: 6/07/2024
ms.custom: engagement-fy23
ms.author: jacobjaygbay
---

# Troubleshoot provisioning issues

This article describes how to resolve common errors and provisioning issues in your Oracle Database@Azure environments.

The issues covered in this article do not cover general issues related to Oracle Database@Azure configuration, settings, and account setup. For more information on those topics, see [Oracle Database@Azure Overview](database-overview.md).

## Terminations and Microsoft Azure Locks

Oracle advises removal of all Microsoft Azure locks to Oracle Database@Azure resources before terminating the resource. For example, if you created a Microsoft Azure private endpoint, you should remove that resource first. If you have a policy to prevent the deletion of locked resources, the Oracle Database@Azure workflow to delete the resource will fail because Oracle Database@Azure cannot delete the lock.

## IP Address Requirement Differences

There are IP address requirement differences between Oracle Database@Azure and Oracle Cloud Infrastructure (OCI). In the Requirements for IP Address Space documentation, the following changes for Oracle Database@Azure must be considered.

* Oracle Database@Azure only supports Exadata X9M. All other shapes are unsupported.
* Oracle Database@Azure reserves 13 IP addresses for the client subnet versus 3 for OCI requirements.