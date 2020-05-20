---
# Mandatory fields.
title: Use the Azure Digital Twins CLI
titleSuffix: Azure Digital Twins
description: See how to get started with and use the Azure Digital Twins CLI.
author: alinamstanciu
ms.author: alinast # Microsoft employees only
ms.date: 3/30/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Use the Azure Digital Twins CLI

In addition to managing your Azure Digital Twins instance in the Azure portal, Azure Digital Twins has a **command-line interface (CLI)** that you can use to perform most major actions with the service, including:
* Managing an Azure Digital Twins instance
* Managing models
* Managing digital twins
* Managing twin relationships
* Configuring endpoints
* Managing [routes](concepts-route-events.md)
* Configuring [security](concepts-security.md) via role-based access control (RBAC)

You can view the reference documentation for these commands as part of the [az iot command set](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot?view=azure-cli-latest).

## Deploy and validate

In addition to generally managing your instance, the CLI is also a useful tool for deployment and validation.
* The control plane commands can be used to make the deployment of a new instance repeatable or automated.
* The data plane commands can be used to quickly check values in your instance, and verify that operations completed as expected.

## Next steps

For an alternative to CLI commands, see how to manage an Azure Digital Twins instance using APIs and SDKs:
* [How-to: Use the Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md)
