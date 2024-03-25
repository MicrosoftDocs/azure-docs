---
title: Azure Operator Nexus credential rotation
description: Describes the credential rotation lifecycle including automated rotation & requests for a manual rotation.
ms.service: azure-operator-nexus
ms.custom: template-how-to
ms.topic: how-to
ms.date: 03/19/2024
author: eak13
ms.author: ekarandjeff
---

# Credential rotation management for Operator Nexus on-premises devices

This article describes the Operator Nexus credential rotation lifecycle including automated rotation & requests for manual rotation.

## Prerequisites

- Target cluster and fabric must be in running and healthy state.
- Platform credential updates are written to a user provided key vault, if provided. Users provide key vault information on the Cluster resource during Cluster create or update.
  - For more information on adding key vault information to the Cluster, see [Create and provision a Cluster](howto-configure-cluster.md).
  - The Cluster update command allows users to add or change key vault information.
  - For information on configuring the key vault to receive credential rotation updates, see [Setting up Key Vault for Managed Credential Rotation](how-to-credential-manager-key-vault.md).

> [!IMPORTANT]
> A key vault must be provided on the Cluster, otherwise credentials will not be retrievable. Microsoft Support does not have access to the credentials.

## Rotating credentials

The Operator Nexus Platform offers a managed credential rotation process that automatically rotates the following credentials:

- Baseboard Management Controller (BMC)
- Pure Storage Array Administrator
- Console User for emergency access

When a new Cluster is created, the credentials are automatically rotated during deployment. The managed credential process then automatically rotates these credentials every 60 days. The updated credentials are written to the key vault associated with the Cluster resource. The last rotation timestamps are currently not visible to users, but is a planned enhancement to the Operator Nexus Platform.

> [!NOTE]
> The introduction of this capability enables auto-rotation for existing instances. If the BMC, Storage Administrator or Console User credentials have not been rotated within the last 60 days, they will be rotated at the time of upgrade.

Operator Nexus also provides a service for preemptive rotation of the above Platform credentials. This service is available to customers upon request through a support ticket. Credential rotation for Operator Nexus Fabric devices also requires a support ticket. Instructions for generating a support request are described in the next section.

## Create a support request

Users raise credential rotation requests by [contacting support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). These details are required in order to perform the credential rotation on the requested target instance:

- Type of credential that needs to be rotated. Specify if the request is for a fabric device, BMC, Storage Admin, Console User or for all four types.
- Provide Tenant ID.
- Provide Subscription ID.
- Provide Resource Group Name in which the target cluster or fabric resides based on type of credential that needs to be rotated.
- Provide Target Cluster or Fabric Name based on type of credential that needs to be rotated.
- Provide Target Cluster or Fabric Azure Resource Manager (ARM) ID based on type of credential that needs to be rotated.
- Provide the Customer Key Vault ID where rotated credentials are written. Only applies to Operator Nexus Fabric devices. BMC, Pure Admin & Console User credential rotations use the key vault provided on the Cluster.

For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).
