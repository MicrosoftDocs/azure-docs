---
title: "Quickstart: Add assets"
description: "Quickstart: Add OPC UA assets that publish messages to the Azure IoT MQ broker in your Azure IoT Operations cluster."
author: dominicbetts
ms.author: dobett
ms.topic: quickstart
ms.custom:
  - ignite-2023
ms.date: 10/24/2023

#CustomerIntent: As an OT user, I want to create assets in Azure IoT Operations so that I can subscribe to asset data points, and then process the data before I send it to the cloud.
---

# Quickstart: Add OPC UA assets to your Azure IoT Operations cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you manually add OPC UA assets to your Azure IoT Operations Preview cluster. These assets publish messages to the Azure IoT MQ (preview) broker in your Azure IoT Operations cluster. Typically, an OT user completes these steps.

An _asset_ is a physical device or logical entity that represents a device, a machine, a system, or a process. For example, a physical asset could be a pump, a motor, a tank, or a production line. A logical asset that you define can have properties, stream telemetry, or generate events.

_OPC UA servers_ are software applications that communicate with assets. _OPC UA tags_ are data points that OPC UA servers expose. OPC UA tags can provide real-time or historical data about the status, performance, quality, or condition of assets.

## Prerequisites

Complete [Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](quickstart-deploy.md) before you begin this quickstart.

Install the [mqttui](https://github.com/EdJoPaTo/mqttui) tool on the Ubuntu machine where you're running Kubernetes:

```bash
wget https://github.com/EdJoPaTo/mqttui/releases/download/v0.19.0/mqttui-v0.19.0-x86_64-unknown-linux-gnu.deb
sudo dpkg -i mqttui-v0.19.0-x86_64-unknown-linux-gnu.deb
```

Install the [k9s](https://k9scli.io/) tool on the Ubuntu machine where you're running Kubernetes:

```bash
sudo snap install k9s
```

## What problem will we solve?

The data that OPC UA servers expose can have a complex structure and can be difficult to understand. Azure IoT Operations provides a way to model OPC UA assets as tags, events, and properties. This modeling makes it easier to understand the data and to use it in downstream processes such as the MQ broker and Azure IoT Data Processor (preview) pipelines.

## Sign into the Azure IoT Operations portal

To create asset endpoints, assets and subscribe to OPC UA tags and events, use the Azure IoT Operations (preview) portal. Navigate to the [Azure IoT Operations](https://aka.ms/iot-operations-portal) portal in your browser and sign with your Microsoft Entra ID credentials.

> [!IMPORTANT]
> You must use an Microsoft Entra account, you can't use a Microsoft account (MSA) to sign in. To learn more, see [Known Issues > Create Entra account](../troubleshoot/known-issues.md#azure-iot-operations-preview-portal).

## Select your cluster

When you sign in, select **Get started**. The portal displays the list of Kubernetes clusters that you have access to. Select the cluster that you deployed Azure IoT Operations to in the previous quickstart:

:::image type="content" source="media/quickstart-add-assets/cluster-list.png" alt-text="Screenshot of Azure IoT Operations cluster list.":::

> [!TIP]
> If you don't see any clusters, you might not be in the right Azure Active Directory tenant. You can change the tenant from the top right menu in the portal. If you still don't see any clusters, that means you are not added to any yet. Reach out to your IT administrator to give you access to the Azure resource group the Kubernetes cluster belongs to from Azure portal. You must be in the _contributor_ role.

## Add an asset endpoint

When you deployed Azure IoT Operations, you chose to include a built-in OPC PLC simulator. In this step, you add an asset endpoint that enables you to connect to the OPC PLC simulator.

To add an asset endpoint:

1. Select **Asset endpoints** and then **Create asset endpoint**:

    :::image type="content" source="media/quickstart-add-assets/asset-endpoints.png" alt-text="Screenshot that shows the asset endpoints page in the Azure IoT Operations portal.":::

1. Enter the following endpoint information:

    | Field | Value |
    | --- | --- |
    | Name | `opc-ua-connector-0` |
    | OPC UA Broker URL | `opc.tcp://opcplc-000000:50000` |
    | User authentication | `Anonymous` |
    | Transport authentication | `Do not use transport authentication certificate` |

1. To save the definition, select **Create**.

This configuration deploys a new module called `opc-ua-connector-0` to the cluster. After you define an asset, an OPC UA connector pod discovers it. The pod uses the asset endpoint that you specify in the asset definition to connect to an OPC UA server.

When the OPC PLC simulator is running, data flows from the simulator, to the connector, to the OPC UA broker, and finally to the MQ broker.

<!-- TODO: Verify if this is still required -->

To enable the asset endpoint to use an untrusted certificate:

> [!WARNING]
> Don't use untrusted certificates in production environments.

1. On the machine where your Kubernetes cluster is running, create a file called _doe.yaml_ with the following content:

    ```yaml
    apiVersion: deviceregistry.microsoft.com/v1beta1
    kind: AssetEndpointProfile
    metadata:
      name: opc-ua-connector-0
      namespace: azure-iot-operations
    spec:
      additionalConfiguration: |-
        {
          "applicationName": "opc-ua-connector-0",
          "defaults": {
            "publishingIntervalMilliseconds": 1000,
            "samplingIntervalMilliseconds": 500,
            "queueSize": 1,
          },
          "session": {
            "timeout": 60000
          },
          "subscription": {
            "maxItems": 1000,
          },
          "security": {
            "autoAcceptUntrustedServerCertificates": true
          }
        }
      targetAddress: opc.tcp://opcplc-000000.azure-iot-operations:50000
      transportAuthentication:
        ownCertificates: []
      userAuthentication:
        mode: Anonymous
      uuid: doe-opc-ua-connector-0
    ```

1. Run the following command to apply the configuration:

    ```bash
    kubectl apply -f doe.yaml
    ```

1. Restart the `aio-opc-supervisor` pod:

    ```bash
    kubectl delete pod aio-opc-supervisor-956fbb649-k9ppr -n azure-iot-operations
    ```

    The name of your pod might be different. To find the name of your pod, run the following command:

    ```bash
    kubectl get pods -n azure-iot-operations
    ```

## Manage your assets

After you select your cluster in Azure IoT Operations portal, you see the available list of assets on the **Assets** page. If there are no assets yet, this list is empty:

:::image type="content" source="media/quickstart-add-assets/create-asset-empty.png" alt-text="Screenshot of Azure IoT Operations empty asset list.":::

### Create an asset

To create an asset, select **Create asset**.

Enter the following asset information:

| Field | Value |
| --- | --- |
| Asset name | `thermostat` |
| Asset Endpoint | `opc-ua-connector-0` |
| Description | `A simulated thermostat asset` |

:::image type="content" source="media/quickstart-add-assets/create-asset-details.png" alt-text="Screenshot of Azure IoT Operations asset details page.":::

Scroll down on the **Asset details** page and add any additional information for the asset that you want to include such as:

- Manufacturer
- Manufacturer URI
- Model
- Product code
- Hardware version
- Software version
- Serial number
- Documentation URI

Select **Next** to go to the **Tags** page.

### Create OPC UA tags

Add two OPC UA tags on the **Tags** page. To add each tag, select **Add** and then select **Add tag**. Enter the tag details shown in the following table:

| Node ID            | Tag name    | Observability mode |
| ------------------ | ----------- | ------------------ |
| ns=3;s=FastUInt10  | temperature | none               |
| ns=3;s=FastUInt100 | Tag 10      | none               |

The **Observability mode** is one of: none, gauge, counter, histogram, or log.

You can override the default sampling interval and queue size for each tag.

:::image type="content" source="media/quickstart-add-assets/add-tag.png" alt-text="Screenshot of Azure IoT Operations add tag page.":::

Select **Next** to go to the **Events** page and then **Next** to go to the **Review** page.

### Review

Review your asset and tag details and make any adjustments you need before you select **Create**:

:::image type="content" source="media/quickstart-add-assets/review-asset.png" alt-text="Screenshot of Azure IoT Operations create asset review page.":::

## Verify data is flowing

To verify data is flowing from your assets by using the **mqttui** tool:

1. Run the following command to make the MQ broker accessible from your local machine:

    ```bash
    # Create Listener
    kubectl apply -f - <<EOF
    apiVersion: mq.iotoperations.azure.com/v1beta1
    kind: BrokerListener
    metadata:
      name: az-mqtt-non-tls-listener
      namespace: azure-iot-operations
    spec:
      brokerRef: broker
      authenticationEnabled: false
      authorizationEnabled: false
      port: 1883
    EOF
    ```

1. Run the following command to set up port forwarding for the MQ broker. This command blocks the terminal, for subsequent commands you need a new terminal:

    ```bash
    kubectl port-forward svc/aio-mq-dmqtt-frontend 1883:mqtt-1883 -n azure-iot-operations
    ```

1. In a separate terminal window, run the following command to connect to the MQ broker using the **mqttui** tool:

    ```bash
    mqttui -b mqtt://127.0.0.1:1883
    ```

1. Verify that the thermostat asset you added is publishing data. You can find the telemetry in the `azure-iot-operations/data` topic.

    :::image type="content" source="media/quickstart-add-assets/mqttui-output.png" alt-text="Screenshot of the mqttui topic display showing the temperature telemetry.":::

    If there's no data flowing, restart the `aio-opc-opc.tcp-1` pod. In the `k9s` tool, hover over the pod, and press _ctrl-k_ to kill a pod, the pod restarts automatically.

The sample tags you added in the previous quickstart generate messages from your asset that look like the following samples:

```json
{
    "Timestamp": "2023-08-10T00:54:58.6572007Z", 
    "MessageType": "ua-deltaframe",
    "payload": {
      "temperature": {
        "SourceTimestamp": "2023-08-10T00:54:58.2543129Z",
        "Value": 7109
      },
      "Tag 10": {
        "SourceTimestamp": "2023-08-10T00:54:58.2543482Z",
        "Value": 7109
      }
    },
    "DataSetWriterName": "oven",
    "SequenceNumber": 4660
}
```

## Discover OPC UA data sources by using Akri

In the previous section, you saw how to add assets manually. You can also use Azure IoT Akri to automatically discover OPC UA data sources and create Akri instance custom resources that represent the discovered devices. Currently, Akri can't detect and create assets that can be ingested into the Azure Device Registry.

When you deploy Azure IoT Operations, the deployment includes the Akri discovery handler pods. To verify these pods are running, run the following command:

```bash
kubectl get pods -n azure-iot-operations | grep akri
```

The output from the previous command looks like the following example:

```text
akri-opcua-asset-discovery-daemonset-h47zk     1/1     Running   3 (4h15m ago)    2d23h
aio-akri-otel-collector-5c775f745b-g97qv       1/1     Running   3 (4h15m ago)    2d23h
aio-akri-agent-daemonset-mp6v7                 1/1     Running   3 (4h15m ago)    2d23h
```

On the machine where your Kubernetes cluster is running, create a file called _opcua-configuration.yaml_ with the following content:

```yaml
apiVersion: akri.sh/v0
kind: Configuration
metadata:
  name: akri-opcua-asset
spec:
  discoveryHandler: 
    name: opcua-asset
    discoveryDetails: "opcuaDiscoveryMethod:\n  - asset:\n      endpointUrl: \"	opc.tcp://opcplc-000000:50000\"\n      useSecurity: false\n      autoAcceptUntrustedCertificates: true\n"
  brokerProperties: {}
  capacity: 1
```

Run the following command to apply the configuration:

```bash
kubectl apply -f opcua-configuration.yaml -n azure-iot-operations
```

To verify the configuration, run the following command to view the Akri instances that represent the OPC UA data sources discovered by Akri:

```bash
kubectl get akrii -n azure-iot-operations
```

The output from the previous command looks like the following example:

```text
NAMESPACE              NAME                      CONFIG             SHARED   NODES            AGE
azure-iot-operations   akri-opcua-asset-dbdef0   akri-opcua-asset   true     ["dom-aio-vm"]   35m
```

Now you can use these resources in the local cluster namespace.

## How did we solve the problem?

In this quickstart, you added an asset endpoint and then defined an asset and tags. The assets and tags model data from the OPC UA server to make the data easier to use in an MQTT broker and other downstream processes. You use the thermostat asset you defined in the next quickstart.

## Clean up resources

If you're not going to continue to use this deployment, delete the Kubernetes cluster that you deployed Azure IoT Operations to and remove the Azure resource group that contains the cluster.

## Next step

[Quickstart: Use Data Processor pipelines to process data from your OPC UA assets](quickstart-process-telemetry.md)
