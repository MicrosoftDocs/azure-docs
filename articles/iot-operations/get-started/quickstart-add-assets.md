---
title: "Quickstart: Add assets"
description: "Quickstart: Add OPC UA assets that publish messages to the Azure IoT MQ broker in your Azure IoT Operations cluster."
author: dominicbetts
ms.author: dobett
ms.topic: quickstart
ms.date: 10/10/2023

#CustomerIntent: As an OT user, I want to create assets in Azure IoT Operations so that I can subscribe to asset data points, and then process the data before I send it to the cloud.
---

# Quickstart: Add OPC UA assets to your Azure IoT Operations cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you manually add OPC UA assets to your Azure IoT Operations cluster. These assets publish messages to the Azure IoT MQ broker in your Azure IoT Operations cluster. Typically, an OT user completes these steps.

An _asset_ is a physical or logical entity that represents a device, a machine, a system, or a process. For example, an asset could be a pump, a motor, a tank, or a production line. Assets can have properties and values that describe their characteristics and behaviors.

_OPC UA servers_ are software applications that communicate with assets. _OPC UA tags_ are data points that OPC UA servers expose. OPC UA tags can provide real-time or historical data about the status, performance, quality, or condition of assets.

## Prerequisites

Complete [Quickstart: Deploy Azure IoT Operations – enabled by Azure Arc Preview to an Arc-enabled Kubernetes cluster](quickstart-deploy.md) before you begin this quickstart.

## What problem will we solve?

The data that OPC UA servers expose can have a complex structure and can be difficult to understand. Azure IoT Operations provides a way to model OPC UA assets as tags and properties. This modeling makes it easier to understand the data and to use it in downstream processes such as the Azure IoT MQ broker and Azure IoT Data Processor pipelines.

## Add an asset endpoint profile

When you deployed Azure IoT Operations, you chose to include a built-in OPC PLC simulator. In this step to add an asset endpoint profile that enables you to connect to the OPC PLC simulator. On the machine where you're running Kubernetes, save the following YAML in a file called `opc-ua-connector-manifest.yaml`:

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

Apply the manifest to your Kubernetes cluster using `kubectl apply -f opc-ua-connector-manifest.yaml` to create an _asset endpoint profile_ that uses the built-in simulator. An asset endpoint profile enables you to define assets and tags to represent OPC UA data points.

The manifest deploys a new module called `opc-ua-connector-0` to the `alice-springs-solution` namespace. After you define an asset, an OPC UA connector pod discovers it. The pod uses the endpoint profile that you specified in the asset definition to connect to an OPC UA server.

When the OPC PLC simulator is running, data flows from the simulator, to the connector, to the OPC UA broker, and finally to the Azure IoT MQ broker.

## Sign into the Digital Operations portal

To create assets and subscribe to OPC UA tags, use the Digital Operations portal. Navigate to the [Digital Operations](https://digitaloperations.azure.com) portal in your browser and sign with your Microsoft Entra ID credentials.

## Select your cluster

When you sign in, the portal displays the list of Kubernetes clusters that you have access to. Use the cluster that you deployed Azure IoT Operations to in the previous quickstart. Select the cluster that you want to use:

:::image type="content" source="media/cluster-list.png" alt-text="Screenshot of Digital Operations cluster list.":::

> [!TIP]
> If you don't see any clusters, you might not be in the right Azure Active Directory tenant. You can change the tenant from the top right menu in the portal. If you still don't see any clusters, that means you are not added to any yet. Reach out to your IT administrator to give you access to the Azure resource group the Kubernetes cluster belongs to from Azure portal. You must be in the _contributor_ role.

## Manage your assets

After you select your cluster, you see the available list of assets on the **Assets** page. If there are no assets yet, this list is empty:

:::image type="content" source="media/create-asset-empty.png" alt-text="Screenshot of Digital Operations empty asset list.":::

### Create an asset

To create an asset, select **Create asset**.

Enter the following asset information:

| Field | Value |
| --- | --- |
| Asset name | `thermostat` |
| Endpoint profile | `opc-ua-connector-0` |
| Asset description | `A simulated thermostat asset` |

The **Endpoint profile** must match the value in an _asset endpoint configuration_. In this example, you created an endpoint profile called `opc-ua-connector-0` in a previous step.

:::image type="content" source="media/create-asset-details.png" alt-text="Screenshot of Digital Operations asset details page.":::

Scroll down on the **Asset details** page and add any additional information for the asset that you want to include such as:

- Manufacturer
- Manufacturer URI
- Model
- Product code
- Hardware version
- Software version
- Serial number
- Documentation URI

:::image type="content" source="media/create-asset-additional-info.png" alt-text="Screenshot of the additional info section on the Digital Operations asset details page.":::

Select **Next** to go to the **Additional configurations** page.

### Additional configurations

The **Additional configurations** page shows you the default telemetry settings for the asset. You can override these settings for each asset. These settings apply to all the OPC UA tags that belong to the asset.

Asset configuration values include:

- **Sampling interval (milliseconds)**: The sampling interval indicates the fastest rate at which the OPC UA Server should sample its underlying source for data changes.
- **Publishing interval (milliseconds)**: The rate at which OPC UA Server should publish data.
- **Queue size**: The depth of the queue to hold the sampling data before it's published.

:::image type="content" source="media/create-asset-additional-config.png" alt-text="Screenshot of Digital Operations additional configurations page.":::

Select **Next** to go to the **Tags** page.

### Create OPC UA tags

Add two OPC UA tags on the **Tags** page. To add each tag, select **Add** and then select **Add tag**. Enter the tag details shown in the following table:

| Node ID            | Tag name    | Observability mode |
| ------------------ | ----------- | ------------------ |
| ns=3;s=FastUInt10  | temperature | none               |
| ns=3;s=FastUInt100 | Tag 10      | none               |

The **Observability mode** is one of: none, gauge, counter, histogram, or log.

You can override the sampling interval and queue size for each tag.

:::image type="content" source="media/add-tag.png" alt-text="Screenshot of Digital Operations add tag page.":::

Select **Next** to go to the **Review** page.

### Review

Review your asset and tag details and make any adjustments you need before you select **Create**:

:::image type="content" source="media/review-asset.png" alt-text="Screenshot of Digital Operations create asset review page.":::

## How did we solve the problem?

In this quickstart, you added an asset endpoint profile and then defined an asset and tags. The assets and tags model data from the OPC UA server to make the data easier to use in an MQTT broker and other downstream processes.

## Clean up resources

If you're not going to continue to use this deployment, delete the Kubernetes cluster that you deployed Azure IoT Operations to and remove the Azure resource group that contains the cluster.

## Next step

[Quickstart: Use Data Processor pipelines to process messages from your OPC UA assets](quickstart-process-telemetry.md)
