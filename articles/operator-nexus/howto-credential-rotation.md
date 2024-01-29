---
title: "Azure Operator Nexus: Credential Rotation"
description: Instructions on Credential Rotation Lifecycle Management requests.
ms.service: azure-operator-nexus
ms.custom: template-how-to
ms.topic: how-to
ms.date: 01/29/2024
author: sbatchu0108
ms.author: sbatchu
---

# Credential Rotation Lifecycle Management for Operator Nexus Instance

This document provides an overview of the credential rotation support request that needs to be raised for requesting credential rotation on the nexus instance.

## Prerequisites

1. Target cluster must be in running and healthy state.

### Create Support Request

Raise credential rotation request by [contacting support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). Below details are required in order to perform the credential rotation on the required target cluster:
  1. Type of credential that needs to be rotated. Specify if the request is for BMC or Storage or Console User or for all three types.
  1. Provide Tenant ID.
  1. Provide Subscription ID.
  1. Provide Resource Group Name in which the target cluster resides.
  1. Provide Target Cluster Name.
  1. Provide Target Cluster ARM ID
  1. Provide Customer Key Vault ID to which rotated credentials needs to be updated. 

For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).