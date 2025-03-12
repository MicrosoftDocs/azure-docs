---
title: Configure OPC UA user authentication options
description: How to configure connector for OPC UA user authentication options for it to use when it connects to an OPC UA server.
author: dominicbetts
ms.author: dobett
ms.subservice: azure-opcua-connector
ms.topic: how-to
ms.custom: ignite-2023
ms.date: 10/22/2024

# CustomerIntent: As a user in IT, operations, or development, I want to configure my OPC UA industrial edge environment with custom OPC UA user authentication options to keep it secure and work with my solution.
ms.service: azure-iot-operations
---

# Configure OPC UA user authentication options for the connector for OPC UA

In this article, you learn how to configure OPC UA user authentication options. These options provide more control over how the connector for OPC UA authenticates with OPC UA servers in your environment.

Currently, the connector for OPC UA supports user authentication with a username and password. You store and manage the username and password values in Azure Key Vault. Azure IoT Operations then synchronizes these values to your Kubernetes cluster where you can use them securely.

To learn more, see [OPC UA applications - user authentication](https://reference.opcfoundation.org/Core/Part2/v105/docs/5.2.3).

## Prerequisites

A deployed instance of Azure IoT Operations with [Manage Synced Secrets](../deploy-iot-ops/howto-manage-secrets.md#manage-synced-secrets) enabled.

## Features supported

| Feature  | Supported |
| -------- |:---------:|
| OPC UA user authentication with username and password.     |   ✅     |
| OPC UA user authentication with an X.509 user certificate. |   ❌     |

## Configure username and password authentication

To configure the secrets for the *username* and *password* values in the [operations experience](https://iotoperations.azure.com) web UI:

1. Navigate to your list of asset endpoints:

    :::image type="content" source="media/howto-configure-opcua-authentication-options/asset-endpoint-list.png" alt-text="Screenshot that shows the list of asset endpoints.":::

1. Select **Create asset endpoint**.

1. Select **Username password** as the authentication mode:

    :::image type="content" source="media/howto-configure-opcua-authentication-options/authentication-mode.png" alt-text="Screenshot that shows the username and password authentication mode selected.":::

1. Enter a synced secret name and then select the username and password references from the linked Azure Key Vault:

    :::image type="content" source="media/howto-configure-opcua-authentication-options/select-from-key-vault.png" alt-text="Screenshot that shows the username and password references from Azure Key Vault.":::

    > [!TIP]
    > You have the option to create new secrets in Azure Key Vault if you haven't already added them.

1. Select **Apply**.
