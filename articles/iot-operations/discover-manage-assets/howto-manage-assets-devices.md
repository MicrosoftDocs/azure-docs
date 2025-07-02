---
title: Manage asset and device configurations
description: Use the operations experience web UI or the Azure CLI to manage your asset and device configurations.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 06/25/2025

#CustomerIntent: As an OT user, I want to understand the capabilities of the operations experience and Azure CLI that are common to all assets and devices.
---

# Manage asset configurations

A _site_ is a collection of Azure IoT Operations instances. Sites typically group instances by physical location and make it easier for OT users to locate and manage assets. Your IT administrator creates sites and assigns Azure IoT Operations instances to them. To learn more, see [What is Azure Arc site manager (preview)?](/azure/azure-arc/site-manager/overview).

In the operations experience web UI, an _instance_ represents an Azure IoT Operations cluster.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

An _inbound endpoint_ is a logical endpoint that you create to represent a physical device or asset. Inbound endpoints have a type, such as OPC UA or ONVIF, that determines the type of of physical device or asset to connect to. The available types of inbound endpoints depend on the connector templates the IT admin configured in the Azure portal. Each type of inbound endpoint has it's own set of properties that you can configure. For example, an OPC UA inbound endpoint has properties such as the OPC UA server URL, security mode, and security policy.

In the operations experience web UI, an _instance_ represents an Azure IoT Operations cluster.

This article describes how to use the operations experience web UI and the Azure CLI to:

- View sites and instances.
- Import and export devices and assets.
- View devices and assets.
- Use notifications and activity logs

## Prerequisites

To use the operations experience, you need a running instance of Azure IoT Operations.

To sign in to the operations experience web UI, you need a Microsoft Entra ID account with at least contributor permissions for the resource group that contains your **Kubernetes - Azure Arc** instance. You can't sign in with a Microsoft account (MSA). To create a suitable Microsoft Entra ID account in your Azure tenant:

1. Sign in to the [Azure portal](https://portal.azure.com/) with the same tenant and user name that you used to deploy Azure IoT Operations.
1. In the Azure portal, go to the **Microsoft Entra ID** section, select **Users > +New user > Create new user**. Create a new user and make a note of the password, you need it to sign in later.
1. In the Azure portal, go to the resource group that contains your **Kubernetes - Azure Arc** instance. On the **Access control (IAM)** page, select **+Add > Add role assignment**.
1. On the **Add role assignment page**, select **Privileged administrator roles**. Then select **Contributor** and then select **Next**.
1. On the **Members** page, add your new user to the role.
1. Select **Review and assign** to complete setting up the new user.

You can now use the new user account to sign in to the [operations experience](https://iotoperations.azure.com) web UI.

## Sign in

# [Operations experience](#tab/portal)

To sign in to the operations experience, go to the [operations experience](https://iotoperations.azure.com) in your browser and sign in by using your Microsoft Entra ID credentials.

## Select your site

After you sign in, the operations experience displays a list of sites. Each site is a collection of Azure IoT Operations instances where you can configure and manage your assets. A site typically represents a physical location where you have physical assets deployed. Sites make it easier for you to locate and manage assets. Your [IT administrator is responsible for grouping instances in to sites](/azure/azure-arc/site-manager/overview). Any Azure IoT Operations instances that aren't assigned to a site appear in the **Unassigned instances** node. Select the site that you want to use:

:::image type="content" source="media/howto-manage-assets-devices/site-list.png" alt-text="Screenshot that shows a list of sites in the operations experience." lightbox="media/howto-manage-assets-devices/site-list.png":::

> [!TIP]
> You can use the filter box to search for sites.

If you don't see any sites, you might not be in the right Azure Active Directory tenant. You can change the tenant from the top right menu in the operations experience. If you still don't see any sites that means you aren't added to any yet. Reach out to your IT administrator to request access.

## Select your instance

After you select a site, the operations experience displays a list of the Azure IoT Operations instances that are part of the site. Select the instance that you want to use:

:::image type="content" source="media/howto-manage-assets-devices/cluster-list.png" alt-text="Screenshot that shows the list of instances in the operations experience." lightbox="media/howto-manage-assets-devices/cluster-list.png":::

> [!TIP]
> You can use the filter box to search for instances.

# [Azure CLI](#tab/cli)

Before you use the `az iot ops asset` commands, sign in to the subscription that contains your Azure IoT Operations deployment:

```azurecli
az login
```

---

After you select your instance, the operations experience displays the **Overview** page for the instance. The **Overview** page shows the status of the instance and the resources, such as assets, that are associated with it:

:::image type="content" source="media/howto-manage-assets-devices/instance-overview.png" alt-text="Screenshot that shows the overview page for an instance in the operations experience." lightbox="media/howto-manage-assets-devices/instance-overview.png":::

## Import and export devices

Use the **Import** and **Export** buttons to import or export a device in the operations experience:

:::image type="content" source="media/howto-manage-assets-devices/export-import-devices.png" alt-text="Screenshot showing the options to import and export a device." lightbox="media/howto-manage-assets-devices/export-import-devices.png":::

The JSON file that you export contains the device definition. You can use this file to import the device into another instance of Azure IoT Operations or modify it to create a new device in the current instance:

```yml
{
  "name": "<your device name>",
  "type": "microsoft.deviceregistry/assetendpointprofiles",
  "location": "<your location>",
  "extendedLocation": {
    "type": "CustomLocation",
    "name": "/subscriptions/<your subscription id>/resourceGroups/<your resource group>/providers/Microsoft.ExtendedLocation/customLocations/<your custom location>"
  },
  "properties": {
    "targetAddress": "<your target address>",
    "endpointProfileType": "Microsoft.OpcUa",
    "additionalConfiguration": "{\"runAssetDiscovery\":true}",
    "authentication": {
      "method": "Anonymous"
    }
  },
  "apiVersion": "2024-11-01"
}
```

> [!TIP]
> Export an existing device to discover the `extendedLocation Name` value.

> [!TIP]
> You can also use the `az iot ops device show` and `az iot ops device create` commands to view and create devices.

## Import and export assets

Use the **Import** and **Export** buttons to import or export an asset in the operations experience:

:::image type="content" source="media/howto-manage-assets-devices/export-import-assets.png" alt-text="Screenshot showing the options to import and export an asset." lightbox="media/howto-manage-assets-devices/export-import-assets.png":::

The JSON file that you export contains the asset definition. You can use this file to import the asset into another instance of Azure IoT Operations or modify it to create a new asset in the current instance. The following JSON example shows an example import file to use to create a thermostat asset:

```yml
{
  "name": "thermostat",
  "type": "microsoft.deviceregistry/assets",
  "location": "<your location>",
  "extendedLocation": {
    "type": "CustomLocation",
    "name": "/subscriptions/<your subscription id>/resourceGroups/<your resource group>/providers/Microsoft.ExtendedLocation/customLocations/<your custom location>"
  },
  "properties": {
    "enabled": true,
    "displayName": "thermostat",
    "description": "A simulated thermostat asset",
    "assetEndpointProfileRef": "opc-ua-connector-1",
    "version": 1,
    "attributes": {
      "batch": "102",
      "customer": "Contoso",
      "equipment": "Boiler",
      "isSpare": "true",
      "location": "Seattle"
    },
    "defaultDatasetsConfiguration": "{\"publishingInterval\":1000,\"samplingInterval\":1000,\"queueSize\":1}",
    "defaultEventsConfiguration": "{\"publishingInterval\":1000,\"queueSize\":1}",
    "defaultTopic": {
      "path": "azure-iot-operations/data/thermostat",
      "retain": "Never"
    },
    "datasets": [
      {
        "name": "default",
        "dataPoints": [
          {
            "name": "temperature",
            "dataSource": "ns=3;s=SpikeData",
            "observabilityMode": "None",
            "dataPointConfiguration": "{}"
          }
        ]
      }
    ]
  },
  "apiVersion": "2024-11-01"
}
```

> [!TIP]
> Export an existing device to discover the `extendedLocation Name` value.

> [!TIP]
> You can also use the `az iot ops asset show` and `az iot ops asset create` commands to view and create devices.

## Notifications

Whenever you make a change to asset in the operations experience, you see a notification that reports the status of the operation:

:::image type="content" source="media/howto-manage-assets-devices/portal-notifications.png" alt-text="A screenshot that shows the notifications in the operations experience." lightbox="media/howto-manage-assets-devices/portal-notifications.png":::

## View activity logs

In the operations experience, you can view activity logs for each instance or each resource in an instance.

To view activity logs at the instance level, select the **Activity logs** tab. You can use the **Timespan** and **Resource type** filters to customize the view.

:::image type="content" source="./media/howto-manage-assets-devices/view-instance-activity-logs.png" alt-text="A screenshot that shows the activity logs for an instance in the operations experience." lightbox="./media/howto-manage-assets-devices/view-instance-activity-logs.png":::

To view activity logs as the resource level, select the resource that you want to inspect. This resource can be an asset, device, or data pipeline. In the resource overview, select **View activity logs**. You can use the **Timespan** filter to customize the view.

## Related content

- [Connector for OPC UA overview](overview-opc-ua-connector.md)
- [az iot ops asset](/cli/azure/iot/ops/asset)
- [az iot ops device](/cli/azure/iot/ops/asset/endpoint)
