---
title: Create Azure Device Update for IoT Hub resources
description: Create an Azure Device Update for Iot Hub account and instance by using the Azure portal or Azure CLI.
author: eshashah-msft
ms.author: eshashah
ms.date: 12/06/2024
ms.topic: how-to
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Create Azure Device Update for IoT Hub resources

To get started with Azure Device Update for IoT Hub, you create a Device Update account and instance, and then [assign access control roles and permissions](configure-access-control-device-update.md) necessary to use those resources. This article describes how to create and configure the Device Update resources by using the Azure portal or Azure CLI.

A Device Update *account* is a resource in your Azure subscription. A Device Update *instance* is a logical container within the account that's associated with a specific IoT hub. You can create multiple Device Update instances within an account.

A Device Update instance contains updates and deployments associated with its IoT hub. For more information, see [Device Update resources](device-update-resources.md).

## Prerequisites

# [Azure portal](#tab/portal)

- A Standard (S1) or higher instance of [Azure IoT Hub](/azure/iot-hub/create-hub?tabs=portal).
- If you opt to store diagnostic logs, an Azure Storage account to store diagnostics logs for your Device Update instance.

# [Azure CLI](#tab/cli)

- A Standard (S1) or higher instance of [Azure IoT Hub](/azure/iot-hub/create-hub?tabs=portal).
- The Bash environment in [Azure Cloud Shell](/azure/cloud-shell/quickstart) for running Azure CLI commands. Select **Launch Cloud Shell** to open Cloud Shell now, or select the Cloud Shell icon in the top toolbar of the Azure portal.

  :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

  If you prefer, you can run the Azure CLI commands locally:
  
  1. [Install Azure CLI](/cli/azure/install-azure-cli). Run [az version](/cli/azure/reference-index#az-version) to see the installed Azure CLI version and dependent libraries, and run [az upgrade](/cli/azure/reference-index#az-upgrade) to install the latest version.
  1. Sign in to Azure by running [az login](/cli/azure/reference-index#az-login).
  1. Install the `azure-iot` extension when prompted on first use. To make sure you're using the latest version of the extension, run `az extension update --name azure-iot`.

---

## Create a Device Update account and instance

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), search for and select **Device Update for IoT Hubs**.
1. On the **Device Update for IoT Hubs** screen, select **Create** or **Create Device Update for IoT Hub**.

   :::image type="content" source="media/create-device-update-account/device-update-marketplace.png" alt-text="Screenshot of Device Update for IoT Hub resource.":::

1. On the **Basics** tab of the **Create Device Update** screen, provide the following information:

   - **Subscription**: Select the name of the Azure subscription for your Device Update account.
   - **Resource group**: Select an existing resource group or create a new one.
   - **Name**: Provide a name for your Device Update account.
   - **Location**: Select the Azure region for your account. For more information, see [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).
   - **SKU**: Select **Standard**.
   - **Grant Access to Account**
     - If you have **Owner** or **User Access Administrator** permissions in your Azure subscription, you can select the **Assign Device Update Administrator role** checkbox to assign yourself the **Device Update Administrator** role for this account.
     - If you don't have these permissions, contact your administrator after resource creation to get the necessary permissions to work with these resources. For more information, see [Configure access control roles for Device Update resources](configure-access-control-device-update.md).
   - **Instance Name**: Provide a name for your Device Update instance.
   - **IoT Hub Name**: Select the IoT Hub you want to link to your Device Update instance.
   - **Grant Access to IoT Hub**: Device Update setup automatically assigns IoT Hub Data Contributor role to the Device Update service principal.

   :::image type="content" source="media/create-device-update-account/account-details.png" alt-text="Screenshot of account details for a new Device Update account.":::

1. Optionally, select **Next: Diagnostics** or the **Diagnostics** tab to configure diagnostics logging as part of the instance creation process. Enabling Microsoft diagnostics allows Microsoft to collect, store, and analyze diagnostic log files from your devices if they encounter an update failure.

   If you don't want to enable diagnostics logging now, select the **Networking** tab.

1. To configure diagnostics logging, on the **Diagnostics** tab, slide the toggle to **Microsoft diagnostics logging Enabled**.

1. Select **Select Azure Storage Account** and then select an Azure Blob storage account to link to your Device Update instance for remote diagnostic log collection. The Storage account details update automatically.

   :::image type="content" source="media/create-device-update-account/account-diagnostics.png" alt-text="Screenshot of diagnostic details.":::

1. Select the **Networking** tab or **Next: Networking**.

1. On the **Networking** tab, you can choose the endpoints that devices use to connect to your Device Update instance. For this example, select **Public access**. Public access is acceptable for development and testing purposes, but for production scenarios, you should choose **Private access** and [configure private endpoint connections](configure-private-endpoints.md).

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
     > Your Device Update account doesn't need to be in the same region as your IoT hub, but for better performance it should be geographically close.

1. If prompted, respond `y` to install the `azure-iot` Azure CLI extension.

1. A Device Update instance is associated with a single IoT hub. Run [az iot du instance create](/cli/azure/iot/du/instance#az-iot-du-instance-create) to create a Device Update instance and specify the IoT hub to use with the instance.

   ```azurecli
   az iot du instance create --account <account_name> --instance <instance_name> --iothub-ids <iothub_id>
   ```


   In the command, replace the following placeholders with your own information:

   - `<account_name>`: The name of the Device Update account for this instance.
   - `<instance_name>`: A name for this instance.
   - `<iothub_id>`: The fully qualified resource ID for the IoT hub to link to this instance, such as `"/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.Devices/IotHubs/<iothub_name>"`.

     To get your IoT hub resource ID, run [az iot hub show](/cli/azure/iot/hub#az-iot-hub-show) and query for the ID value.

     ```azurecli
     az iot hub show -n <iothub_name> --query id
     ```

You can also configure diagnostics logging as part of the instance creation process. You must have an Azure Blob Storage account to store the diagnostic logs. For more information, see [Remotely collect diagnostic logs from devices](device-update-log-collection.md?tabs=cli).

---

## Next steps

Device Update setup automatically assigns **IoT Hub Data Contributor** role to the Device Update service principal. This role allows only this Device Update instance to connect and write to the linked IoT hub to run update deployment, device management, and diagnostic operations.

If you have **Owner** or **User Access Administrator** permissions in your Azure subscription, you can configure access control by providing users and applications the necessary level of access to the Device Update resources you created. If you don't have **Owner** or **User Access Administrator** permissions, ask your Device Update administrator to grant you the access and permissions you need to perform Device Update update, management, and diagnostic operations. For more information, see [Configure access control roles for Device Update resources](configure-access-control-device-update.md).

## Related content

- [Device Update accounts and instances](device-update-resources.md)
- [Device Update access control roles](device-update-control-access.md)

