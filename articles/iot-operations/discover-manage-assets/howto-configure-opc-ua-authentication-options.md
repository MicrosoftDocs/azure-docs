---
title: Configure OPC UA user authentication options
description: How to configure connector for OPC UA user authentication options for it to use when it connects to an OPC UA server.
author: dominicbetts
ms.author: dobett
ms.subservice: azure-opcua-connector
ms.topic: how-to
ms.custom: ignite-2023
ms.date: 07/29/2025

# CustomerIntent: As a user in IT, operations, or development, I want to configure my OPC UA industrial edge environment with custom OPC UA user authentication options to keep it secure and work with my solution.
ms.service: azure-iot-operations
---

# Configure OPC UA user authentication options for the connector for OPC UA

In this article, you learn how to configure OPC UA user authentication options. These options provide more control over how the connector for OPC UA authenticates with OPC UA servers in your environment.

Currently, the connector for OPC UA supports user authentication with a username and password. You store and manage the username and password values in Azure Key Vault. Azure IoT Operations then synchronizes these values to your Kubernetes cluster where you can use them securely.

To learn more, see [OPC UA applications - user authentication](https://reference.opcfoundation.org/Core/Part2/v105/docs/5.2.3).

## Prerequisites

An Azure IoT Operations instance deployed with secure settings. If you deployed Azure IoT Operations with test settings, you need to first [enable secure settings](../deploy-iot-ops/howto-enable-secure-settings.md).

## Configure username and password authentication

To configure the secrets for the *username* and *password* values in the [operations experience](https://iotoperations.azure.com) web UI:

1. Navigate to your list of devices:

    :::image type="content" source="media/howto-configure-opc-ua-authentication-options/device-list.png" alt-text="Screenshot that shows the list of devices.":::

1. Select **Create new**.

1. One the **Device details** page,add a new **Microsoft.OpcUa** inbound endpoint.

1. Select **Username password** as the authentication mode:

    :::image type="content" source="media/howto-configure-opc-ua-authentication-options/authentication-mode.png" alt-text="Screenshot that shows the username and password authentication mode selected.":::

1. Enter a synced secret name and then select the username and password references from the linked Azure Key Vault:

    :::image type="content" source="media/howto-configure-opc-ua-authentication-options/select-from-key-vault.png" alt-text="Screenshot that shows the username and password references from Azure Key Vault.":::

    > [!TIP]
    > You have the option to create new secrets in Azure Key Vault if you haven't already added them.

1. Select **Apply**.

To learn more about how Azure IoT Operations uses Azure Key Vault to store secrets such as usernames and passwords, see [Manage secrets for your Azure IoT Operations deployment](../secure-iot-ops/howto-manage-secrets.md).
