---
title: Configure App Service Environment v3 network settings
description: Configure network settings that apply to the entire Azure App Service environment. Learn how to do it with Azure Resource Manager templates.
author: madsd
keywords: ASE, ASEv3, ftp, remote debug

ms.topic: tutorial
ms.custom: devx-track-arm-template, devx-track-azurecli
ms.date: 03/29/2022
ms.author: madsd
---

# Network configuration settings

Because App Service Environments are isolated to the individual customer, there are certain configuration settings that can be applied exclusively to App Service Environments. This article documents the various specific network customizations that are available for App Service Environment v3.

> [!NOTE]
> This article is about App Service Environment v3, which is used with isolated v2 App Service plans.

If you don't have an App Service Environment, see [How to Create an App Service Environment v3](./creation.md).

App Service Environment network customizations are stored in a subresource of the *hostingEnvironments* Azure Resource Manager entity called networking.

The following abbreviated Resource Manager template snippet shows the **networking** resource:

```json
"resources": [
{
    "apiVersion": "2021-03-01",
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

The **networking** resource can be included in a Resource Manager template to update the App Service Environment.

## Configure using Azure Resource Explorer
Alternatively, you can update the App Service Environment by using [Azure Resource Explorer](https://resources.azure.com).  

1. In Resource Explorer, go to the node for the App Service Environment (**subscriptions** > **{your Subscription}** > **resourceGroups** > **{your Resource Group}** > **providers** > **Microsoft.Web** > **hostingEnvironments** > **App Service Environment name** > **configurations** > **networking**).
2. Select **Read/Write** in the upper toolbar to allow interactive editing in Resource Explorer.  
3. Select the blue **Edit** button to make the Resource Manager template editable.
4. Modify one or more of the settings ftpEnabled, remoteDebugEnabled, allowNewPrivateEndpointConnections, that you want to change.  
5. Select the green **PUT** button that's located at the top of the right pane to commit the change to the App Service Environment.
6. You may need to select the green **GET** button again to see the changed values.

The change takes effect within a minute.

## Allow new private endpoint connections

For apps hosted on both ILB and External App Service Environment, you can allow creation of private endpoints. The setting is default disabled. If private endpoint has been created while the setting was enabled, they won't be deleted and will continue to work. The setting only prevents new private endpoints from being created.

The following Azure CLI command will enable allowNewPrivateEndpointConnections:

```azurecli
ASE_NAME="[myAseName]"
RESOURCE_GROUP_NAME="[myResourceGroup]"
az appservice ase update --name $ASE_NAME -g $RESOURCE_GROUP_NAME --allow-new-private-endpoint-connection true

az appservice ase list-addresses -n --name $ASE_NAME -g $RESOURCE_GROUP_NAME --query allowNewPrivateEndpointConnections
```

The setting is also available for configuration through Azure portal at the App Service Environment configuration:

:::image type="content" source="./media/configure-network-settings/configure-allow-private-endpoint.png" alt-text="Screenshot from Azure portal of how to configure your App Service Environment to allow creating new private endpoints for apps.":::

## FTP access

This ftpEnabled setting allows you to allow or deny FTP connections are the App Service Environment level. Individual apps will still need to configure FTP access. If you enable FTP at the App Service Environment level, you may want to [enforce FTPS](../deploy-ftp.md?tabs=cli#enforce-ftps) at the individual app level. The setting is default disabled.

If you want to enable FTP access, you can run the following Azure CLI command:

```azurecli
ASE_NAME="[myAseName]"
RESOURCE_GROUP_NAME="[myResourceGroup]"
az appservice ase update --name $ASE_NAME -g $RESOURCE_GROUP_NAME --allow-incoming-ftp-connections true

az appservice ase list-addresses -n --name $ASE_NAME -g $RESOURCE_GROUP_NAME --query ftpEnabled
```
The setting is also available for configuration through Azure portal at the App Service Environment configuration:

:::image type="content" source="./media/configure-network-settings/configure-allow-incoming-ftp-connections.png" alt-text="Screenshot from Azure portal of how to configure your App Service Environment to allow incoming ftp connections.":::

In addition to enabling access, you need to ensure that you have [configured DNS if you are using ILB App Service Environment](./networking.md#dns-configuration-for-ftp-access) and that the [necessary ports](./networking.md#ports-and-network-restrictions) are unblocked.

## Remote debugging access

Remote debugging is default disabled at the App Service Environment level. You can enable network level access for all apps using this configuration. You'll still have to [configure remote debugging](../configure-common.md?tabs=cli#configure-general-settings) at the individual app level.

Run the following Azure CLI command to enable remote debugging access:

```azurecli
ASE_NAME="[myAseName]"
RESOURCE_GROUP_NAME="[myResourceGroup]"
az appservice ase update --name $ASE_NAME -g $RESOURCE_GROUP_NAME --allow-remote-debugging true

az appservice ase list-addresses -n --name $ASE_NAME -g $RESOURCE_GROUP_NAME --query remoteDebugEnabled
```

The setting is also available for configuration through Azure portal at the App Service Environment configuration:

:::image type="content" source="./media/configure-network-settings/configure-allow-remote-debugging.png" alt-text="Screenshot from Azure portal of how to configure your App Service Environment to allow remote debugging.":::

## Next steps

> [!div class="nextstepaction"]
> [Create an App Service Environment from a template](./how-to-create-from-template.md)

> [!div class="nextstepaction"]
> [Deploy your app to Azure App Service using FTP](../deploy-ftp.md)
