---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 12/01/2025
ms.author: dobett
---

1. Follow the steps in [Manage secrets for your Azure IoT Operations deployment](../secure-iot-ops/howto-manage-secrets.md) to add secrets for username and password in Azure Key Vault, and project them into Kubernetes cluster.

1. Modify the `authentication` block of your Bicep configuration for the connector to reference the synchronized secrets for username and password, as shown in the example below:

    ```bicep
    authentication: {
        method: 'UsernamePassword'
            usernamePasswordCredentials: {
                passwordSecretName: '<reference to synced password secret>'
                usernameSecretName: '<reference to synced username secret>'
            }
    }
    ```
