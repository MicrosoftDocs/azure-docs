---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 10/23/2025
ms.author: dobett
---

1. Follow the steps in [Manage secrets for your Azure IoT Operations deployment](../secure-iot-ops/howto-manage-secrets.md) to add secrets for username and password in Azure Key Vault, and project them into Kubernetes cluster.

1. Use the [az iot ops ns device endpoint inbound add](/cli/azure/iot/ops/ns/device/endpoint/inbound/add) command with the `--user-ref` and `--pass-ref` parameters to add the references to the Azure Key Vault secrets you created.