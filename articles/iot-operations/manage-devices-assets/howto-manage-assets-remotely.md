---
title: Manage asset configurations remotely
description: Use the Azure IoT Operations portal to manage your asset configurations remotely and enable data to flow from your assets to an MQTT broker.
author: dominicbetts
ms.author: dobett
ms.topic: how-to 
ms.date: 10/20/2023

#CustomerIntent: As an OT user, I want configure my IoT Operations environment to so that data can flow from my OPC UA servers through to the MQTT broker.
---

# Manage asset configurations remotely

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

An _asset_ is a physical or logical entity that represents a device, a machine, a system, or a process. For example, an asset could be a pump, a motor, a tank, or a production line. Assets can have properties and values that describe their characteristics and behaviors.

_OPC UA servers_ are software applications that communicate with assets. OPC UA servers expose _OPC UA tags_ that represent data points. OPC UA tags provide real-time or historical data about the status, performance, quality, or condition of assets.

An _asset endpoint_ is a custom resource that connects OPC UA servers to OPC UA connector modules. This connection enables an OPC UA connector to access an asset's data points. Without an asset endpoint, data can't flow from an OPC UA server to the Azure IoT OPC UA Broker instance and Azure IoT MQ instance. After you configure the custom resources in your cluster, a connection is established to the downstream OPC UA server and the server forwards telemetry to the OPC UA Broker instance.

The [quick setup](#asset-endpoint-quick-setup) section gets you started by using the built-in OPC-PLC simulator. The remaining sections describe how to configure more complex scenarios, such as custom authentication.

This article describes how to use the Azure IoT Operations Preview portal to manually add assets and define tags. These assets and tags map inbound data from OPC UA servers to friendly names that you can use in the Azure MQ broker and Data Processor pipelines.

## Prerequisites

To configure an assets endpoint, you need a running instance of Azure IoT Operations Preview.

## Sign in to the Azure IoT Operations portal

Navigate to the [Azure IoT Operations portal](https://digitaloperations.azure.com) in your browser and sign in by using your Microsoft Entra ID credentials.

## Select your cluster

When you sign in, the portal displays a list of the Azure Arc-enabled Kubernetes clusters running Azure IoT Operations that you have access to. Select the cluster that you want to use.

> [!TIP]
> If you don't see any clusters, you might not be in the right Azure Active Directory tenant. You can change the tenant from the top right menu in the portal. If you still don't see any clusters, that means you are not added to any yet. Reach out to your IT administrator to give you access to the Azure resource group the Kubernetes cluster belongs to from Azure portal. You must be in the _contributor_ role.

:::image type="content" source="media/howto-manage-assets-remotely/cluster-list.png" alt-text="Screenshot that shows the list of clusters in the Azure IoT Operations portal.":::

## Asset endpoint quick setup
<!-- Update this as soon as the UX is confirmed - it will all be done through the portal -->

By default, an Azure IoT Operations deployment includes a built-in OPC PLC simulator. Apply the following manifest to your kubernetes cluster using `kubectl apply -f <your-file-name>.yaml` to create an asset endpoint that uses the built-in OPC PLC simulator:

```yaml
apiVersion: e4i.microsoft.com/v1
kind: Application
metadata:
  name: alice-springs-solution
  namespace: alice-springs
spec:
  name: alice-springs-solution
  description: This is a sample application running OPC UA Connector for testing.
  payloadCompression: none
---
apiVersion: e4i.microsoft.com/v1
kind: Module
metadata:
  name: opc-ua-connector-0
  namespace: alice-springs-solution
spec:
  type: opc-ua-connector
  name: opc-ua-connector-0
  description: Connect to opc.tcp://opcplc-000000.alice-springs:50000 and forward data to the configured broker
  settings: |-
    {
      "OpcUaConnectionOptions":
      {
        "DiscoveryUrl": "opc.tcp://opcplc-000000.alice-springs:50000",
        "UseSecurity": true,
        "LoadComplexTypes": true,
        "AuthenticationMode": "Anonymous",
        "SessionTimeout": 600000,
        "DefaultPublishingInterval": 1000,
        "DefaultSamplingInterval": 500,
        "DefaultQueueSize": 15,
        "MaxItemsPerSubscription": 1000,
        "AutoAcceptUntrustedCertificates": true
      },
      "OpcUaConfigurationOptions": {
        "ApplicationName": "az-e4i-opcua-connector-0",
        "ModuleName": "opc-ua-connector-0",
      }
    }
```

This manifest deploys a new module called `opc-ua-connector-0` to the `alice-springs-solution` namespace. To start using the newly created asset endpoint, create an asset through the [Azure IoT Operations](https://digitaloperations.azure.com) portal, specify `opc-ua-connector-0` in the **Endpoint profile** field:

:::image type="content" source="media/howto-manage-assets-remotely/asset-endpoint-profile.png" alt-text="Screenshot that shows how to use the asset endpoint in the Azure IoT Operations portal.":::

By default, assets are created in the `alice-springs-solution` namespace where you created the asset endpoint.

When you specify the asset tags in the Azure IoT Operations experience portal, you can now use any of the simulated node IDs such as `nsu=http://microsoftcom/Opc/OpcPlc/;s=FastUInt1`:

:::image type="content" source="media/howto-manage-assets-remotely/tag-definition.png" alt-text="Screenshot that shows how to use a node ID when you define a tag in the Azure IoT Operations portal.":::

An OPC UA connector pod discovers the asset after you create it. The pod uses the asset endpoint that you specified in the asset definition to connect to an OPC UA server. If the OPC PLC simulator is running, data flows from the simulator, to the connector, to the OPC UA broker, and finally to the MQTT broker.

## Asset endpoint custom setup
<!-- Update this as soon as the UX is confirmed - it will all be done through the portal -->

The remaining sections in this article include instructions for more complex asset endpoint scenarios, such as custom authentication.

### Configure an asset endpoint using a username and password

The YAML file shown in the previous section uses the `Anonymous` authentication mode. This mode doesn't require a username or password. If you want to use the `UsernamePassword` authentication mode, you must configure the asset endpoint accordingly.

### Create a Kubernetes secret for the OPC UA server connection

The following script shows how to create a secret for the username and password and add it to the Kubernetes store:

```sh
# NAMESPACE is the namespace containing the MQ broker.
export NAMESPACE="alice-springs-solution"

# Set the desired username and password here.
export USERNAME="username"
export PASSWORD="password"

echo "Storing k8s username and password generic secret..."
kubectl create secret generic opc-ua-connector-secrets --from-literal=username=$USERNAME --from-literal=password=$PASSWORD --namespace $NAMESPACE
```

The following example YAML file shows the configuration for an asset endpoint that uses the `UsernamePassword` authentication mode. The configuration references the secret you created previously:

```yaml
apiVersion: e4i.microsoft.com/v1
kind: Application
metadata:
  name: alice-springs-solution
  namespace: alice-springs
spec:
  name: alice-springs-solution
  description: This is a sample application running OPC UA Connector for testing.
  payloadCompression: none
---
apiVersion: e4i.microsoft.com/v1
kind: Module
metadata:
  name: opc-ua-connector-1
  namespace: alice-springs-solution
spec:
  type: opc-ua-connector
  name: opc-ua-connector-1
  description: Connect to opc.tcp://opcplc-000000.alice-springs:50000 and forward data to the configured broker
  settings: |-
    {
      "OpcUaConnectionOptions":
      {
        "DiscoveryUrl": "opc.tcp://opcplc-000000.alice-springs:50000",
        "UseSecurity": true,
        "LoadComplexTypes": true,
        "AuthenticationMode": "UsernamePassword",
        "UserNameFile": "@@sec_k8s_opc-ua-connector-secrets/username",
        "PasswordFile": "@@sec_k8s_opc-ua-connector-secrets/password",
        "SessionTimeout": 600000,
        "DefaultPublishingInterval": 1000,
        "DefaultSamplingInterval": 500,
        "DefaultQueueSize": 15,
        "MaxItemsPerSubscription": 1000,
        "AutoAcceptUntrustedCertificates": true
      },
      "OpcUaConfigurationOptions": {
        "ApplicationName": "az-e4i-opcua-connector-0",
        "ModuleName": "opc-ua-connector-1",
      }
    }
```

## Add an asset and tags

To add an asset in the Azure IoT Operations portal:

1. Select the **Assets** tab. If you haven't created any assets yet, you see the following screen:

    :::image type="content" source="media/howto-manage-assets-remotely/create-asset-empty.png" alt-text="Screenshot that shows an empty Assets tab in the Azure IoT Operations portal.":::

1. Enter the following asset information:

    - Asset name
    - Endpoint profile
    - Asset description.

    The **Endpoint profile** must match the value in the [asset endpoint](#asset-endpoint-quick-setup).

    :::image type="content" source="media/howto-manage-assets-remotely/create-asset-details.png" alt-text="Screenshot that shows how to add asset details in the Azure IoT Operations portal.":::

1. Add any optional information that you want to include such as:

    - Manufacturer
    - Manufacturer URI
    - Model
    - Product code
    - Hardware version
    - Software version
    - Serial number
    - Documentation URI

    :::image type="content" source="media/howto-manage-assets-remotely/create-asset-additional-info.png" alt-text="Screenshot that shows how to add additional asset information in the Azure IoT Operations portal.":::

1. Select **Next** to go to the **Additional configurations** page.

    This page shows the default telemetry settings for the asset. You can override these settings for each tag that you add. These settings apply to all the OPC UA tags that belong to the asset.

    Default telemetry settings include:

    - **Sampling interval (milliseconds)**: The sampling interval indicates the fastest rate at which the OPC UA Server should sample its underlying source for data changes.
    - **Publishing interval (milliseconds)**: The rate at which OPC UA Server should publish data.
    - **Queue size**: The depth of the queue to hold the sampling data before it's published.

    :::image type="content" source="media/howto-manage-assets-remotely/create-asset-additional-config.png" alt-text="Screenshot that shows how to define default telemetry settings for asset tags in the Azure IoT Operations portal.":::

1. Select **Next** to go to the **Tags** page.

### Add individual tags to an asset

Now you can define the tags associated with the asset. To add OPC UA tags:

- Select **Add** and then select **Add tag**. Enter your tag details:

    - Node ID. This value is the node ID from the OPC UA server.
    - Tag name (Optional). This value is the friendly name that you want to use for the tag. If you don't specify a tag name, the node ID is used as the tag name.
    - Observability mode (Optional) with following choices:
      - None
      - Gauge
      - Counter
      - Histogram
      - Log
    - Sampling Interval (milliseconds). You can override the asset default value for this tag.
    - Queue size. You can override the asset default value for this tag.

    :::image type="content" source="media/howto-manage-assets-remotely/add-tag.png" alt-text="Screenshot that shows adding tags in the Azure IoT Operations portal.":::

    The following table shows some example tag values that you can use to with the built-in OPC PLC simulator:

    | Node ID | Tag name | Observability mode |
    | ------- | -------- | ------------------ |
    | ns=3;s=FastUInt10 | temperature | none |
    | ns=3;s=FastUInt100 | Tag 10 | none |

### Add tags in bulk to an asset

You can import up to 1000 OPC UA tags at a time from a Microsoft Excel file:

1. Create a Microsoft Excel file that looks like the following example:

    | NodeID              | TagName  | Sampling Interval Milliseconds | QueueSize | ObservabilityMode |
    |---------------------|----------|--------------------------------|-----------|-------------------|
    | ns=3;s=FastUInt1000 | Tag 1000 | 1000                           | 5         | none              |
    | ns=3;s=FastUInt1001 | Tag 1001 | 1000                           | 5         | none              |
    | ns=3;s=FastUInt1002 | Tag 1002 | 5000                           | 10        | none              |

1. Select **Add** and then select **Import Microsoft Excel**. Select the Excel file you created and select **Open**. The tags defined in the Excel file are imported:

    :::image type="content" source="media/howto-manage-assets-remotely/import-complete.png" alt-text="A screenshot that shows the completed import from the Excel file in the Azure IoT Operations portal.":::

    If you import an= Microsoft Excel file that contains tags that are duplicates of existing tags, the Azure IoT Operations portal displays the following message:

    :::image type="content" source="media/howto-manage-assets-remotely/import-duplicates.png" alt-text="A screenshot that shows the error message when you import duplicate tag definitions in the Azure IoT Operations portal.":::

    You can either replace the duplicate tags and add new tags from the import file, or you can cancel the import.

1. To export all the tags from an asset to a Microsoft Excel file, select **Export** and choose a location for the file:

    :::image type="content" source="media/howto-manage-assets-remotely/export-tags.png" alt-text="A screenshot that shows how to export tag definitions from an asset in the Azure IoT Operations portal.":::

### Review your changes

Select **Next** to go to the **Review** page. Review your asset and OPC UA tag details and make any adjustments you need:

:::image type="content" source="media/howto-manage-assets-remotely/review-asset-tags.png" alt-text="A screenshot that shows how to review your asset and tags in the Azure IoT Operations portal.":::

## Update an asset

Select the asset you created previously. Use the **Properties**, **Default telemetry settings**, and **Tags** tabs to make any changes:

:::image type="content" source="media/howto-manage-assets-remotely/asset-update-property-save.png" alt-text="A screenshot that shows how to update an existing asset in the Azure IoT Operations portal.":::

On the **Tags** tab, you can update existing tags or remove them or add new ones.

To update a tag, select an existing tag and update the tag information. Then select **Update**:

:::image type="content" source="media/howto-manage-assets-remotely/asset-update-tag.png" alt-text="A screenshot that shows how to update an existing tag in the Azure IoT Operations portal.":::

To remove tags, select one or more tags and then select **Remove**:

:::image type="content" source="media/howto-manage-assets-remotely/asset-remove-tags.png" alt-text="A screenshot that shows how to delete a tag in the Azure IoT Operations portal.":::

When you're finished making changes, select **Save** to save your changes.

## Delete an asset

To delete an asset, select the asset you want to delete. On the **Asset**  details page, select **Delete**. Confirm your changes to delete the asset:

:::image type="content" source="media/howto-manage-assets-remotely/asset-delete.png" alt-text="A screenshot that shows how to delete an asset from the Azure IoT Operations portal.":::

## Notifications

Whenever you make a change to asset, you see a notification in the Azure IoT Operations portal that reports the status of the operation:

:::image type="content" source="media/howto-manage-assets-remotely/portal-notifications.png" alt-text="A screenshot that shows the notifications in the Azure IoT Operations portal.":::

## Related content

- [Azure OPC UA Broker overview](concept-opcua-broker-overview.md)
- [Azure IoT Akri overview](concept-akri-overview.md)
