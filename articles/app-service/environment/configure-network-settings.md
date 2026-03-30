---
title: Configure App Service Environment Networking Settings
description: Configure networking settings for an Azure App Service environment, including FTP access, private endpoint creation, and remote debugging. Use the Azure CLI, Azure Resource Manager templates, or the Azure portal.
author: seligj95
keywords: ASE, ASEv3, ftp, remote debug
ms.topic: how-to
ms.custom: devx-track-arm-template, devx-track-azurecli
ms.date: 03/13/2026
ms.author: jordanselig
ms.service: azure-app-service
#customer intent: As an App Service developer, I want to configure networking settings for my App Service environments, so I can control FTP access, private endpoint creation, and remote debugging.
---

# Configure networking settings for App Service Environments

App Service Environment v3 provides a fully isolated and dedicated environment for securely running App Service apps. This article describes how to configure the networking settings for an App Service Environment, including FTP access, private endpoint creation, and remote debugging. Procedures are provided to configure the settings by using the Azure CLI or an Azure Resource Manager template (ARM template), and by updating the resource directly in the Azure portal.

## Prerequisites

- An App Service Environment v3. To create a new environment, follow the steps in [Quickstart: Create an App Service Environment](creation.md).

## Review networking settings

The App Service Environment networking settings are located in a single ARM template subresource:

`Microsoft.Web/hostingEnvironments/{aseName}/configurations/networking`

The `networking` subresource configures three properties for the App Service Environment:

- `allowNewPrivateEndpointConnections`
- `ftpEnabled`
- `remoteDebugEnabled`

All of the properties are of type `bool` and are set to false (disabled) by default.

## Use ARM template for repeatable deployment

When you configure networking settings for an App Service Environment by using an ARM template, you create a configuration that's available for repeatable deployment of the same environment or other App Service Environments.

The following snippet shows an abbreviated ARM template with configurations for the networking settings:

```json
"resources": [
{
    "apiVersion": "2023-03-01",
    "type": "Microsoft.Web/hostingEnvironments",
    "name": "[parameter('aseName')]",
    "location": ...,
    "properties": {
        "internalLoadBalancingMode": ...,
        etc...
    },    
    "resources": [
        {
            "type": "configurations",
            "apiVersion": "2021-03-01",
            "name": "networking",
            "dependsOn": [
                "[resourceId('Microsoft.Web/hostingEnvironments', parameters('aseName'))]"
            ],
            "properties": {
                "remoteDebugEnabled": true,
                "ftpEnabled": true,
                "allowNewPrivateEndpointConnections": true
            }
        }
    ]
}
```

## Configure properties with the Azure CLI

If you plan to use the Azure CLI to configure the networking settings, keep in mind that the `az appservice ase update` command doesn't issue a PATCH against the individual properties. Instead, the command performs a PUT-style update against the entire `networking` subresource object. If you use the `az appservice ase update` command to configure a single property, the other networking properties revert to the default setting (false, disabled).

To ensure all `networking` properties are configured as expected, specify settings for all the networking properties in a single command.

## Allow new private endpoint connections

If your app is hosted on both an Internal Load Balancer (ILB) App Service Environment and an External App Service Environment, you can allow creation of private endpoints with the `allow-new-private-endpoint-connection` setting. The ability to create new private endpoint connections is disabled by default.

If a private endpoint is created while the `allow-new-private-endpoint-connection` setting is enabled, and you then disable the setting, the existing private endpoint continues to work. When you disable the `allow-new-private-endpoint-connection` setting, you only prevent the creation of new private endpoints.

# [Azure portal](#tab/azure-portal)

You can enable new private endpoint connections for the App Service Environment in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), go to your **App Service Environment** resource.

1. In the left menu, select **Settings** > **Configuration**.

1. Locate the **Networking settings** group, and select the **Allow new private endpoints** checkbox.

   :::image type="content" source="./media/configure-network-settings/configure-allow-private-endpoint.png" alt-text="Screenshot that shows how to allow new private endpoint connections for an App Service Environment in the Azure portal.":::

1. Select **Apply** for your changes to take effect.

# [Azure CLI](#tab/azure-cli)

Run the following Azure CLI commands to enable new private endpoint connections for an App Service Environment:

1. Set the `<placeholder>` command parameters to the values for your App Service Environment:

   ```azurecli
   ASE_NAME="<App-Service-Environment>"
   RESOURCE_GROUP_NAME="<Resource-Group>"
   ```

1. Enable FTP access for the App Service Environment by using the `--allow-incoming-ftp-connections` parameter:

   ```azurecli
   az appservice ase update --name $ASE_NAME -g $RESOURCE_GROUP_NAME --allow-new-private-endpoint-connection true
   ```

1. List IP addresses for the App Service Environment that allow creation of new private endpoint connections:

   ```azurecli
   az appservice ase list-addresses --name $ASE_NAME -g $RESOURCE_GROUP_NAME --query allowNewPrivateEndpointConnections
   ```

---

## Allow incoming FTP connections

Use the `ftpEnabled` setting to allow or deny FTP connections for an App Service Environment. FTP access is disabled by default.

You still need to configure FTP access for each individual app. If you enable FTP at the App Service Environment level, you might want to [enforce FTPS](../deploy-ftp.md?tabs=cli#enforce-ftps) at the individual app level. 

# [Azure portal](#tab/azure-portal)

You can configure FTP access for the App Service Environment in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), go to your **App Service Environment** resource.

1. In the left menu, select **Settings** > **Configuration**.

1. Locate the **Networking settings** group, and select the **Allow incoming FTP connections** checkbox.

   :::image type="content" source="./media/configure-network-settings/configure-allow-incoming-ftp-connections.png" alt-text="Screenshot that shows how to enable FTP access for an App Service Environment in the Azure portal.":::

1. Select **Apply** for your changes to take effect.

# [Azure CLI](#tab/azure-cli)

Run the following Azure CLI commands to enable FTP access for an App Service Environment:

1. Set the `<placeholder>` command parameters to the values for your App Service Environment:

   ```azurecli
   ASE_NAME="<App-Service-Environment>"
   RESOURCE_GROUP_NAME="<Resource-Group>"
   ```

1. Enable FTP access for the App Service Environment by using the `--allow-incoming-ftp-connections` parameter:

   ```azurecli
   az appservice ase update --name $ASE_NAME -g $RESOURCE_GROUP_NAME --allow-incoming-ftp-connections true
   ```

1. List IP addresses for the App Service Environment that allow incoming FTP connections:

   ```azurecli
   az appservice ase list-addresses --name $ASE_NAME -g $RESOURCE_GROUP_NAME --query ftpEnabled
   ```

---

### Configure DNS and unblock ports

When you enable FTP access for an App Service Environment, prepare your configuration to receive FTP connections:

- If you're using an ILB App Service Environment, verify your [DNS configuration for FTP access](./networking.md#dns-configuration-for-ftp-access).

- Unblock the [necessary ports](./networking.md#ports-and-network-restrictions) and address any restrictions.

## Enable remote debugging

Use the `remoteDebugEnabled` setting to allow or deny incoming FTP connections for an App Service Environment. Remote debugging is disabled by default. 

You can enable network-level access for all apps associated with the App Service Environment. However, you still need to [configure remote debugging](../configure-common.md?tabs=cli#configure-general-settings) for each individual app.

# [Azure portal](#tab/azure-portal)

You can configure remote debugging for the App Service Environment in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), go to your **App Service Environment** resource.

1. In the left menu, select **Settings** > **Configuration**.

1. Locate the **Networking settings** group, and select the **Allow remote debugging** checkbox.

   :::image type="content" source="./media/configure-network-settings/configure-allow-remote-debugging.png" alt-text="Screenshot that shows how to enable remote debugging for an App Service Environment in the Azure portal.":::

1. Select **Apply** for your changes to take effect.

# [Azure CLI](#tab/azure-cli)

Run the following Azure CLI commands to enable remote debugging access for an App Service Environment:

1. Set the `<placeholder>` command parameters to the values for your App Service Environment:

   ```azurecli
   ASE_NAME="<App-Service-Environment>"
   RESOURCE_GROUP_NAME="<Resource-Group>"
   ```

1. Enable remote debugging for the App Service Environment by using the `--allow-remote-debugging` parameter:

   ```azurecli
   az appservice ase update --name $ASE_NAME -g $RESOURCE_GROUP_NAME --allow-remote-debugging true
   ```

1. List IP addresses for the App Service Environment that allow remote debugging:

   ```azurecli
   az appservice ase list-addresses --name $ASE_NAME -g $RESOURCE_GROUP_NAME --query remoteDebugEnabled
   ```

---

## Related content

- [Deploy your app to Azure App Service by using FTP or FTPS](../deploy-ftp.md)
- ['az appservice ase update' command reference](/cli/azure/appservice/ase)
