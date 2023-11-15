---
title: About Azure IoT Operations CLI
# titleSuffix: Azure IoT Operations
description: Learn about the Azure IoT Operations CLI.
author: PatAltimore
ms.author: patricka
ms.topic: reference
ms.custom:
  - ignite-2023
ms.date: 11/02/2023

#CustomerIntent: As an IT admin or operator, I want to learn about the Azure IoT Operations CLI so that I can manage my IoT deployments.
---

# Azure IoT Operations CLI

The Azure IoT Operations command-line interface (CLI) is a set of commands used to create and manage Azure IoT resources.

Use the `az iot ops --help` for up to date help on the available commands, or see [az iot ops](/cli/azure/iot/ops).

## Add the extension

The Azure IoT Operations extension requires Azure CLI version 2.42.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary.

Add the extension to your Azure CLI instance:

```bash
az extension add --name az-iot-ops
```

## az iot ops init

This command is used for the deployment orchestration of Azure IoT Operations.

> [!IMPORTANT]
> *aziot ops init* requires an active login to Azure. Run `az login` and follow the prompts for standard interactive login. Verify the correct subscription is set by running `az account set --subscription '<sub Id>'`

You can choose what aspects run:

- `--kv-id` **enables** `KeyVault CSI driver` workflows.
- `--no-tls` **disables** TLS workflows.
- `--no-deploy` **disables** Azure IoT Operations service deployment workflows.
- `--no-block` returns immediately after starting the Azure IoT Operations deployment workflow.

### Examples

This example has the minimum input parameters for a complete deployment.

```bash
az iot ops init --cluster <cluster name> -g <resource group> --kv-id <Key Vault resource ID>
```

You can combine other commands. In this example, you create a KeyVault and pass the ID to `init`.

```bash
az iot ops init --cluster <cluster name> -g <resource group> --kv-id $(az keyvault create -n mykeyvault -g myrg -o tsv --query id)
```

You can use an existing app ID and a flag to include a simulated PLC server as part of the deployment. Including the app ID prevents `init` from creating an app registration.

```bash
az iot ops init --cluster <cluster name> -g <resource group> --kv-id <Key Vault resource ID> --sp-app-id <app registration GUID> --simulate-plc
```

To skip deployment and focus only on the Azure Key Vault Container Storage Interface driver and TLS config workflows, use `--no-deploy`. This can be useful when you want to deploy from a different tool such as the Azure portal.

```bash
az iot ops init --cluster <cluster name> -g <resource group> --kv-id <Key Vault resource ID> --sp-app-id <app registration GUID> --no-deploy
```

To only deploy Azure IoT Operations on a cluster that has already been created, omit `--kv-id` and include `--no-tls`.

```bash
az iot ops init --cluster <cluster name> -g <resource group> --no-tls
```

Use `--no-block` to avoid waiting for the deployment to finish before continuing.

```bash
az iot ops init --cluster <cluster name> -g <resource group> --kv-id <Key Vault resource ID> --sp-app-id <app registration GUID> --no-block
```
