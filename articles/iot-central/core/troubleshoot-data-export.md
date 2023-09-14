---
title: Troubleshoot data exports from Azure IoT Central
description: Troubleshoot data exports in IoT Central for issues such as managed identity permissions and virtual network configuration
services: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 06/12/2023
ms.topic: troubleshooting
ms.service: iot-central

---

# Troubleshoot issues with data exports from your Azure IoT Central application

This document helps you find out why the data your IoT Central application isn't reaching it's intended destination or isn't arriving in the correct format.

## Managed identity issues

You're using a managed identity to authorize the connection to an export destination. Data isn't arriving at the export destination.

Before you configure or enable the export destination, make sure that you complete the following steps:

- Enable the managed identity for the IoT Central application. To verify that the managed identity is enabled, go to the **Identity** page for your application in the Azure portal or use the following CLI command:

    ```azurecli
    az iot central app identity show --name {your app name} --resource-group {your resource group name}
    ```

- Configure the permissions for the managed identity. To view the assigned permissions, select **Azure role assignments** on the **Identity** page for your app in the Azure portal or use the `az role assignment list` CLI command. The required permissions are:

    | Destination | Permission |
    |-------------|------------|
    | Azure Blob storage | Storage Blob Data Contributor |
    | Azure Service Bus | Azure Service Bus Data Sender |
    | Azure Event Hubs | Azure Event Hubs Data Sender |
    | Azure Data Explorer | Admin |

    If the permissions were not set correctly before you created the destination in your IoT Central application, try removing the destination and then adding it again.

- Configure any virtual networks, private endpoints, and firewall policies.

To learn more, see [Export data](howto-export-data.md?tabs=managed-identity).

## Next steps

If you need more help, you can contact the Azure experts on the [Microsoft Q&A and Stack Overflow forums](https://azure.microsoft.com/support/community/). Alternatively, you can file an [Azure support ticket](https://portal.azure.com/#create/Microsoft.Support).

For more information, see [Azure IoT support and help options](../../iot/iot-support-help.md).
