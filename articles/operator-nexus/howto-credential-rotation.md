---
title: Azure Operator Nexus credential rotation
description: Describes the credential rotation lifecycle including automated rotation & requests for a manual rotation.
ms.service: azure-operator-nexus
ms.custom: template-how-to
ms.topic: how-to
ms.date: 10/9/2024
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
- Console User SSH keys for emergency access
- Local path storage

When a new Cluster is created, the credentials are automatically rotated during deployment. The managed credential process then automatically rotates these credentials periodically based on the credential type. The updated credentials are written to the key vault associated with the Cluster resource. With the 2024-07-01-GA API, the credential rotation status is available on the Bare Metal Machine or Storage Appliance resources in the `secretRotationStatus` data construct for each of the rotated credentials.

> [!NOTE]
> The introduction of this capability enables auto-rotation for existing instances. If any of the supported credentials have not been rotated within the expected rotation time period, they will be rotated during the management upgrade.

Operator Nexus also provides a service for preemptive rotation of the above Platform credentials. This service is available to customers upon request through a support ticket. Credential rotation for Operator Nexus Fabric devices also requires a support ticket. Instructions for generating a support request are described in the next section.

## Create a support request

Users raise credential rotation requests by [contacting support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). These details are required in order to perform the credential rotation on the requested target instance:

- Type of credential that needs to be rotated.
- Provide Tenant ID.
- Provide Subscription ID.
- Provide Resource Group Name in which the target cluster or fabric resides based on type of credential that needs to be rotated.
- Provide Target Cluster or Fabric Name based on type of credential that needs to be rotated.
- Provide Target Cluster or Fabric Azure Resource Manager (ARM) ID based on type of credential that needs to be rotated.
- Provide the Customer Key Vault ID where rotated credentials are written.

For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).
