---
title: Azure Operator Nexus credential rotation
description: Instructions on Credential Rotation Lifecycle Management requests.
ms.service: azure-operator-nexus
ms.custom: template-how-to
ms.topic: how-to
ms.date: 01/29/2024
author: sbatchu0108
ms.author: sbatchu
---

# Credential rotation management for on-premises devices

This document provides an overview of the credential rotation support request that needs to be raised for requesting credential rotation on the nexus instance.

## Prerequisites

- Target cluster and fabric must be in running and healthy state.

## Create support request

Raise credential rotation request by [contacting support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). Below details are required in order to perform the credential rotation on the required target instance:
  - Type of credential that needs to be rotated. Specify if the request is for fabric device or BMC or Storage or Console User or for all four types.
  - Provide Tenant ID.
  - Provide Subscription ID.
  - Provide Resource Group Name in which the target cluster or fabric resides based on type of credential that needs to be rotated.
  - Provide Target Cluster or Fabric Name based on type of credential that needs to be rotated.
  - Provide Target Cluster or Fabric ARM ID based on type of credential that needs to be rotated.
  - Provide Customer Key Vault ID to which rotated credentials of target cluster instance needs to be updated.

For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).
