---
title: Create Azure Device Update for Azure IoT Hub resources
description: Create an Azure Device Update for Iot Hub account and instance by using the Azure portal or Azure CLI.
author: eshashah-msft
ms.author: eshashah
ms.date: 11/18/2024
ms.topic: how-to
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Create Device Update for IoT Hub resources

To get started with Azure Device Update for IoT Hub, you create a Device Update account and instance, and then set access control roles. This article describes how to create and configure Device Update resources by using the Azure portal or Azure CLI.

A Device Update account is a resource in your Azure subscription. A Device Update instance is a logical container within the account that's associated with a specific IoT hub. A Device Update instance contains updates and deployments associated with its IoT hub. You can create multiple Device Update instances within an account. For more information, see [Device Update resources](device-update-resources.md).

## Prerequisites

# [Azure portal](#tab/portal)

- **Owner** or **User Access Administrator** role permissions in an Azure subscription
- A Standard (S1) or above instance of Azure IoT Hub
- An Azure Storage account to store diagnostics logs for your Device Update instance

# [Azure CLI](#tab/cli)

- **Owner** or **User Access Administrator** role permissions in an Azure subscription
- A Standard (S1) or above instance of Azure IoT Hub
- The Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md). Select the following button to open Cloud Shell.

  :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

  Or, if you prefer to run Azure CLI commands locally:
  
  1. [Install Azure CLI](/cli/azure/install-azure-cli). Run [az version](/cli/azure/reference-index#az-version) to find the installed version and dependent libraries, and [az upgrade](/cli/azure/reference-index#az-upgrade) to install the latest version.
  1. Sign in to Azure by running [az login](/cli/azure/reference-index#az-login).
  1. Install the `azure-iot` extension when prompted on first use. To make sure you're using the latest version of the extension, run `az extension update --name azure-iot`.

---

## Create a Device Update account and instance

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), search for and select **Device Update for IoT Hubs**.
1. Select **Create**, or **Create Device Update for IoT Hub** if this is your first Device Update account.

   :::image type="content" source="media/create-device-update-account/device-update-marketplace.png" alt-text="Screenshot of Device Update for IoT Hub resource.":::

1. On the **Basics** tab of the **Create Device Update** screen, provide the following information:

   - **Subscription**: Select the name of the Azure subscription for your Device Update account.
   - **Resource group**: Select an existing resource group or create a new one.
   - **Name**: Provide a name for your Device Update account.
   - **Location**: Select the Azure region for your account. For more information, see [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).
   - **SKU**: Select **Standard**.
   - Under **Grant Access to Account**, select the checkbox for **Assign Device Update Administrator role** to assign yourself the Device Update administrator role. For more information, see [Configure access control roles](configure-access-control-device-update.md).
   - **Instance Name**: Provide a name for your Device Update instance.
   - **IoT Hub Name**: Select the IoT Hub you want to link to your Device Update instance.

1. Select **Next: Diagnostics**

   :::image type="content" source="media/create-device-update-account/account-details.png" alt-text="Screenshot of account details for a new Device Update account.":::

1. On the **Diagnostics** tab, slide the toggle to **Microsoft diagnostics logging Enabled** to enable diagnostic logging for your Device Update instance. Enabling Microsoft diagnostics allows Microsoft to collect, store, and analyze diagnostic log files from your devices if they encounter an update failure.

1. To enable remote diagnostics log collection, select **Select Azure Storage account** and then select an Azure Blob storage account to link to your Device Update instance. The Storage account details update automatically.

1. Select **Next: Networking**.

   :::image type="content" source="media/create-device-update-account/account-diagnostics.png" alt-text="Screenshot of diagnostic details.":::

1. On the **Networking** tab, you choose the endpoints that devices can use to connect to your Device Update instance. For this example, select **Public access**.

1. Select **Review**.

   :::image type="content" source="media/create-device-update-account/account-networking.png" alt-text="Screenshot of networking details.":::

1. On the **Review** tab, review the details, and when validation passes, select **Create**.

   :::image type="content" source="media/create-device-update-account/account-review.png" alt-text="Screenshot of account review.":::

1. The screen changes to show that your deployment is in progress. When the deployment completes, select **Go to resource**.

# [Azure CLI](#tab/cli)

1. Run [az iot du account create](/cli/azure/iot/du/account#az-iot-du-account-create) to create a new Device Update account.

   ```azurecli
   az iot du account create --resource-group <resource_group> --account <account_name> --location <region>
   ```

   In the command, replace the following placeholders with your own information:

   - `<resource_group>`: An existing resource group in your subscription.
   - `<account_name>`: A name for your Device Update account.
   - `<region>`: The Azure region for your account. For more information, see [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/). If you don't provide a region, setup uses the resource group location.

     > [!NOTE]
     > Your Device Update account doesn't need to be in the same region as your IoT hub, but for better performance they should be geographically close.

1. Run [az iot du instance create](/cli/azure/iot/du/instance#az-iot-du-instance-create) to create a Device Update instance.

   ```azurecli
   az iot du instance create --account <account_name> --instance <instance_name> --iothub-ids <iothub_id>
   ```

An *instance* of Device Update is associated with a single IoT hub. Select the IoT hub that will be used with Device Update. When you link an IoT hub to a Device Update instance, a new shared access policy is automatically created give Device Update permissions to work with IoT Hub (registry write and service connect). This policy ensures that access is only limited to Device Update.

   In the command, replace the following placeholders with your own information:

   - `<account_name>`: The name of the Device Update account for this instance.
   - `<instance_name>`: A name for this instance.
   - `<iothub_id>`: The resource ID for the IoT hub to link to this instance. You can get your IoT hub resource ID by running [az iot hub show](/cli/azure/iot/hub#az-iot-hub-show) and querying for the ID value: `az iot hub show -n <iothub_name> --query id`.

> [!TIP]
> You can also configure diagnostics logging as part of the instance creation process. You must have an Azure Blob Storage account to store the diagnostic logs. For more information, see [Remotely collect diagnostic logs from devices](device-update-log-collection.md).

---

## Configure access

If you have the required **Owner** or **User Access Administrator** permissions for your Azure subscription, Device Update setup automatically assigns **IoT Hub Data Contributor** role access to your Device Update service principal. This access allows Device Update to run deployment, device management, and diagnostic operations.

After you create your Device Update resources, you can configure access control to provide a combination of roles to users and applications for the right level of access. For more information, see [Configure access control roles for Device Update resources](configure-access-control-device-update.md).

## Related content

- [Device Update accounts and instances](device-update-resources.md)
- [Device Update access control roles](device-update-control-access.md)

