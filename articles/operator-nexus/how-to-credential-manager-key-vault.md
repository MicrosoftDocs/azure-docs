---
title: Set up customer provided Key Vault for Managed Credential rotation
description: Step by step guide on setting up a key vault for managing and rotating credentials used within Azure Operator Nexus Cluster resource.
author: eak13
ms.author: ekarandjeff
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/5/2025
ms.custom: template-how-to, devx-track-azurecli
---

# Set up Key Vault for Managed Credential Rotation in Operator Nexus

> [!NOTE]
> If no key vault is configured for the Cluster resource, credential rotation will fail.

Azure Operator Nexus utilizes secrets and certificates to manage component security across the platform. The Operator Nexus platform handles the rotation of these secrets and certificates. By default, Operator Nexus stores the credentials in a managed Key Vault. To keep the rotated credentials in their own Key Vault, the user must configure their own Key Vault to receive rotated credentials. This configuration requires the user to configure the Key Vault for the Azure Operator Nexus instance. Once created, the user needs to add a role assignment on the Customer Key Vault to allow the Operator Nexus Platform to write updated credentials, and additionally link the Customer Key Vault to the Nexus Cluster Resource.

## Prerequisites

- Install the latest version of the
  [appropriate CLI extensions](./howto-install-cli-extensions.md)
- Get the _Subscription ID_ for the customer's subscription

> [!NOTE]
> A single Key Vault can be used for any number of clusters.

## Configure Key Vault Using Managed Identity for the Cluster

See [Azure Operator Nexus Cluster support for managed identities and user provided resources](./howto-cluster-managed-identity-user-provided-resources.md)
