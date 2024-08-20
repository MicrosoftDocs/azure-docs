---
title: "Quickstart: Add assets"
description: "Quickstart: Add OPC UA assets that publish messages to the MQTT broker in your Azure IoT Operations cluster."
author: dominicbetts
ms.author: dobett
ms.topic: quickstart
ms.custom:
  - ignite-2023
ms.date: 07/23/2024

#CustomerIntent: As an OT user, I want to create assets in Azure IoT Operations so that I can subscribe to asset data points, and then process the data before I send it to the cloud.
---

# Quickstart: Add OPC UA assets to your Azure IoT Operations Preview cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you manually add OPC UA assets to your Azure IoT Operations Preview cluster. These assets publish messages to the MQTT broker in your Azure IoT Operations cluster. Typically, an OT user completes these steps.

An _asset_ is a physical device or logical entity that represents a device, a machine, a system, or a process. For example, a physical asset could be a pump, a motor, a tank, or a production line. A logical asset that you define can have properties, stream telemetry, or generate events.

_OPC UA servers_ are software applications that communicate with assets. _OPC UA tags_ are data points that OPC UA servers expose. OPC UA tags can provide real-time or historical data about the status, performance, quality, or condition of assets.

In this quickstart, you use the operations experience web UI to create your assets. You can also use the [Azure CLI to complete some of these tasks](/cli/azure/iot/ops/asset).

## Prerequisites

Complete [Quickstart: Run Azure IoT Operations Preview in GitHub Codespaces with K3s](quickstart-deploy.md) before you begin this quickstart.

To sign in to the operations experience, you need a work or school account in the tenant where you deployed Azure IoT Operations. If you're currently using a Microsoft account (MSA), you need to create a Microsoft Entra ID with at least contributor permissions for the resource group that contains your **Kubernetes - Azure Arc** instance. To learn more, see [Known Issues > Create Entra account](../troubleshoot/known-issues.md#known-issues-azure-iot-operations-preview).

## What problem will we solve?

The data that OPC UA servers expose can have a complex structure and can be difficult to understand. Azure IoT Operations provides a way to model OPC UA assets as tags, events, and properties. This modeling makes it easier to understand the data and to use it in downstream processes such as the MQTT broker and data processor pipelines.

## Sign into the operations experience

To create asset endpoints, assets and subscribe to OPC UA tags and events, use the operations experience.

Browse to the [operations experience](https://iotoperations.azure.com) in your browser and sign in with your Microsoft Entra ID credentials.

:::image type="content" source="media/quickstart-add-assets/site-list.png" alt-text="Screenshot that shows the unassigned instances node in the operations experience.":::

> [!IMPORTANT]
> You must use a work or school account to sign in to the operations experience. To learn more, see [Known Issues > Create Entra account](../troubleshoot/known-issues.md#known-issues-azure-iot-operations-preview).

## Select your site

A _site_ is a collection of Azure IoT Operations instances. Sites typically group instances by physical location and make it easier for OT users to locate and manage assets. Your IT administrator creates [sites and assigns Azure IoT Operations instances to them](../../azure-arc/site-manager/overview.md). Because you're working with a new deployment, there are no sites yet. You can find the cluster you created in the previous quickstart by selecting **Unassigned instances**. In the operations experience, an instance represents a cluster where you deployed Azure IoT Operations.

## Select your instance

Select the instance where you deployed Azure IoT Operations in the previous quickstart:

:::image type="content" source="media/quickstart-add-assets/cluster-list.png" alt-text="Screenshot of Azure IoT Operations instance list.":::

> [!TIP]
> If you don't see any instances, you might not be in the right Microsoft Entra ID tenant. You can change the tenant from the top right menu in the operations experience.

## Add an asset endpoint

When you deployed Azure IoT Operations in the previous article, you included a built-in OPC PLC simulator. In this step, you add an asset endpoint that enables you to connect to the OPC PLC simulator.

To add an asset endpoint:

1. Select **Asset endpoints** and then **Create asset endpoint**:

    :::image type="content" source="media/quickstart-add-assets/asset-endpoints.png" alt-text="Screenshot that shows the asset endpoints page in the operations experience.":::

1. Enter the following endpoint information:

    | Field | Value |
    | --- | --- |
    | Asset endpoint name | `opc-ua-connector-0` |
    | OPC UA server URL | `opc.tcp://opcplc-000000:50000` |
    | User authentication mode | `Anonymous` |

1. To save the definition, select **Create**.

    This configuration deploys a new asset endpoint called `opc-ua-connector-0` to the cluster. You can use `kubectl` to view the asset endpoints:

    ```console
    kubectl get assetendpointprofile -n azure-iot-operations
    ```

## Configure the simulator

These quickstarts use the **OPC PLC simulator** to generate sample data. To enable the quickstart scenario, you need to configure your asset endpoint to connect without mutual trust established. This configuration is not recommended for production or pre-production environments:

1. To configure the asset endpoint for the quickstart scenario, run the following command:

    ```console
    kubectl patch AssetEndpointProfile opc-ua-connector-0 -n azure-iot-operations --type=merge -p '{"spec":{"additionalConfiguration":"{\"applicationName\":\"opc-ua-connector-0\",\"security\":{\"autoAcceptUntrustedServerCertificates\":true}}"}}'
    ```

    > [!CAUTION]
    > Don't use this configuration in production or pre-production environments. Exposing your cluster to the internet without proper authentication might lead to unauthorized access and even DDOS attacks.

    To learn more, see [Deploy the OPC PLC simulator](../discover-manage-assets/howto-configure-opc-plc-simulator.md) section.

1. To enable the configuration changes to take effect immediately, first find the name of your `aio-opc-supervisor` pod by using the following command:

    ```console
    kubectl get pods -n azure-iot-operations
    ```

    The name of your pod looks like `aio-opc-supervisor-956fbb649-k9ppr`.

1. Restart the `aio-opc-supervisor` pod by using a command that looks like the following example. Use the `aio-opc-supervisor` pod name from the previous step:

    ```console
    kubectl delete pod aio-opc-supervisor-956fbb649-k9ppr -n azure-iot-operations
    ```

After you define an asset, a connector for OPC UA pod discovers it. The pod uses the asset endpoint that you specify in the asset definition to connect to an OPC UA server. You can use `kubectl` to view the discovery pod that was created when you added the asset endpoint. The pod name looks like `aio-opc-opc.tcp-1-8f96f76-kvdbt`:

```console
kubectl get pods -n azure-iot-operations
```

When the OPC PLC simulator is running, dataflows from the simulator, to the connector for OPC UA, and finally to the MQTT broker.

## Manage your assets

After you select your instance in operations experience, you see the available list of assets on the **Assets** page. If there are no assets yet, this list is empty:

:::image type="content" source="media/quickstart-add-assets/create-asset-empty.png" alt-text="Screenshot of Azure IoT Operations empty asset list.":::

### Create an asset

To create an asset, select **Create asset**. Then enter the following asset information:

| Field | Value |
| --- | --- |
| Asset Endpoint | `opc-ua-connector-0` |
| Asset name | `thermostat` |
| Description | `A simulated thermostat asset` |

Remove the existing **Custom properties** and add the following custom properties. Be careful to use the exact property names, as the Power BI template in a later quickstart queries for them:

| Property name | Property detail |
|---------------|-----------------|
| batch         | 102             |
| customer      | Contoso         |
| equipment     | Boiler          |
| isSpare       | true            |
| location      | Seattle         |

:::image type="content" source="media/quickstart-add-assets/create-asset-details.png" alt-text="Screenshot of Azure IoT Operations asset details page.":::

Select **Next** to go to the **Add tags** page.

### Create OPC UA tags

Add two OPC UA tags on the **Add tags** page. To add each tag, select **Add tag or CSV** and then select **Add tag**. Enter the tag details shown in the following table:

| Node ID            | Tag name    | Observability mode |
| ------------------ | ----------- | ------------------ |
| ns=3;s=FastUInt10  | temperature | none               |
| ns=3;s=FastUInt100 | Tag 10      | none               |

The **Observability mode** is one of the following values: `none`, `gauge`, `counter`, `histogram`, or `log`.

You can select **Manage default settings** to change the default sampling interval and queue size for each tag.

:::image type="content" source="media/quickstart-add-assets/add-tag.png" alt-text="Screenshot of Azure IoT Operations add tag page.":::

Select **Next** to go to the **Add events** page and then **Next** to go to the **Review** page.

### Review

Review your asset and tag details and make any adjustments you need before you select **Create**:

:::image type="content" source="media/quickstart-add-assets/review-asset.png" alt-text="Screenshot of Azure IoT Operations create asset review page.":::

## Verify data is flowing

[!INCLUDE [deploy-mqttui](../includes/deploy-mqttui.md)]

To verify that the thermostat asset you added is publishing data, view the telemetry in the `azure-iot-operations/data` topic:

```output
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:17.1858435Z","Value":4558},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:17.1858869Z","Value":4558}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:18.1838125Z","Value":4559},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:18.1838523Z","Value":4559}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:19.1834363Z","Value":4560},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:19.1834879Z","Value":4560}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:20.1861251Z","Value":4561},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:20.1861709Z","Value":4561}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:21.1856798Z","Value":4562},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:21.1857211Z","Value":4562}}
```

> [!TIP]
> Data from an asset with a name that starts with _boiler-_ is from an asset that was automatically discovered. This is not the same asset as the thermostat asset you created.

If there's no data flowing, restart the `aio-opc-opc.tcp-1` pod:

1. Find the name of your `aio-opc-opc.tcp-1` pod by using the following command:

    ```console
    kubectl get pods -n azure-iot-operations
    ```

    The name of your pod looks like `aio-opc-opc.tcp-1-849dd78866-vhmz6`.

1. Restart the `aio-opc-opc.tcp-1` pod by using a command that looks like the following example. Use the `aio-opc-opc.tcp-1` pod name from the previous step:

    ```console
    kubectl delete pod aio-opc-opc.tcp-1-849dd78866-vhmz6 -n azure-iot-operations
    ```

The sample tags you added in the previous quickstart generate messages from your asset that look like the following example:

```json
{
    "temperature": {
        "SourceTimestamp": "2024-08-02T13:52:15.1969959Z",
        "Value": 2696
    },
    "Tag 10": {
        "SourceTimestamp": "2024-08-02T13:52:15.1970198Z",
        "Value": 2696
    }
}
```

## Discover OPC UA data sources by using Akri services

In the previous section, you saw how to add assets manually. You can also use Akri services to automatically discover OPC UA data sources and create Akri instance custom resources that represent the discovered devices. Currently, Akri services can't detect and create assets that can be ingested into the Azure Device Registry Preview. Therefore, you can't currently manage assets discovered by Akri in the Azure portal.

When you deploy Azure IoT Operations, the deployment includes the Akri discovery handler pods. To verify these pods are running, run the following command:

```console
kubectl get pods -n azure-iot-operations | grep akri
```

The output from the previous command looks like the following example:

```output
aio-akri-otel-collector-5c775f745b-g97qv       1/1     Running   3 (4h15m ago)    2d23h
aio-akri-agent-daemonset-mp6v7                 1/1     Running   3 (4h15m ago)    2d23h
```

Use the following command to verify that the discovery pod is running:

```console
kubectl get pods -n azure-iot-operations | grep discovery
```

The output from the previous command looks like the following example:

```output
aio-opc-asset-discovery-wzlnj                   1/1     Running     0              19m
```

To configure the Akri services to discover OPC UA data sources, create an Akri configuration that references your OPC UA source. Run the following command to create the configuration:

```console
kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/akri-opcua-asset.yaml
```

The following snippet shows the YAML file that you applied:

:::code language="yaml" source="~/azure-iot-operations-samples/samples/quickstarts/akri-opcua-asset.yaml":::

> [!IMPORTANT]
> There's currently a known issue where the configuration for the asset endpoint contains an invalid setting. To work around this issue, you need to remove the `"securityMode":"none"` setting from the configuration for the `opc-ua-broker-opcplc-000000-50000` asset endpoint. To learn more, see [Connector for OPC UA](../troubleshoot/known-issues.md#akri-services).

To verify the configuration, run the following command to view the Akri instances that represent the OPC UA data sources discovered by Akri services. You might need to wait a few minutes for the configuration to be available:

```console
kubectl get akrii -n azure-iot-operations
```

The output from the previous command looks like the following example.

```output
NAME                      CONFIG             SHARED   NODES                          AGE
akri-opcua-asset-dbdef0   akri-opcua-asset   true     ["k3d-k3s-default-server-0"]   45s
```

Now you can use these resources in the local cluster namespace.

To confirm that the Akri services are connected to the connector for OPC UA, copy and paste the name of the Akri instance from the previous step into the following command:

```console
kubectl get akrii <AKRI_INSTANCE_NAME> -n azure-iot-operations -o json
```

The command output looks like the following example. This example excerpt from the output shows the Akri instance `brokerProperties` values and confirms that it's connected the connector for OPC UA.

```json
"spec": {

        "brokerProperties": {
            "ApplicationUri": "Boiler #2",
            "AssetEndpointProfile": "{\"spec\":{\"uuid\":\"opc-ua-broker-opcplc-000000-azure-iot-operation\"……
```

## How did we solve the problem?

In this quickstart, you added an asset endpoint and then defined an asset and tags. The assets and tags model data from the OPC UA server to make the data easier to use in an MQTT broker and other downstream processes. You use the thermostat asset you defined in the next quickstart.

## Clean up resources

If you won't use this deployment further, delete the Kubernetes cluster where you deployed Azure IoT Operations and remove the Azure resource group that contains the cluster.

## Next step

[Quickstart: Send asset telemetry to the cloud using the data lake connector for the MQTT broker](quickstart-upload-telemetry-to-cloud.md).
