---
title: Build and deploy Akri connectors
description: Learn how to build and deploy Akri connectors for Azure IoT Operations. This example shows how to build a REST connector.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 01/09/2026
ai-usage: ai-assisted
---

# Build and deploy Akri connectors

This article shows you how to build and deploy Akri connectors for Azure IoT Operations. The example in this article shows how to build a REST connector that polls a REST endpoint for thermostat data such as current and desired temperature values.

The article uses the `aiopollingtelemetryconnector` .NET project template to scaffold the connector project in Visual Studio Code.

For more information about developing Akri connectors by using the VS Code extension, see [Build Akri connectors in VS Code](howto-build-akri-connectors-vscode.md).

## Prerequisites

Development environment:

- Docker
- [Visual Studio Code](https://code.visualstudio.com/)
- [.NET 9 SDK](https://dotnet.microsoft.com/download)

To deploy the connector to your Azure IoT Operations instance:

- [Azure CLI](/cli/azure/install-azure-cli)
- [ORAS CLI](https://oras.land/docs/installation/)
- A container registry endpoint configured on your Azure IoT Operations instance. For more information, see [Configure container registry endpoints](howto-configure-registry-endpoint.md). For simplicity, this article assumes you're using an [Azure Container Registry](/azure/container-registry/container-registry-get-started-portal) configured for [anonymous pull access](/azure/container-registry/anonymous-pull-access).

## Scenario overview

Create a custom connector that connects to a RESTful service exposing thermostat data. The connector retrieves the current and desired temperature data points and publishes them as messages to the MQTT broker. You then use a data flow to read the messages from the MQTT broker and publish them to an Azure Event Hubs namespace.

To implement this scenario, complete the following tasks:

1. Build a connector by using a project template from the Azure IoT Operations .NET SDK. The connector reads from a RESTful service that exposes thermostat data points and publishes the data to the MQTT broker.
1. Publish the connector image to the container registry associated with your Azure IoT Operations instance.
1. Create the connector metadata configuration file and publish it to the container registry.
1. Create a connector template instance from your connector in your Azure IoT Operations instance by using the Azure portal.
1. Deploy a sample REST server that exposes thermostat data for the connector to consume.
1. Create a device and asset in the operations experience web UI. The device includes an endpoint definition that uses your connector template instance.
1. Test the scenario by creating a data flow that reads messages from the MQTT broker and writes them to an event hub.

## Create project

To install the .NET project templates for Azure IoT Operations, run the following command:

```bash
dotnet new install Azure.Iot.Operations.Templates
```

To create a project to build an Akri connected called `MyConnector`, run the following commands from a terminal:

```bash
dotnet new aiopollingtelemetryconnector -o MyConnector
cd MyConnector

# Verify the project builds
dotnet build
```

## Implement the connector

[!INCLUDE [akri-connector-code](../includes/akri-connector-code.md)]


## Publish the connector image

After you finish the code, build and publish the connector to a container registry. To build and publish the container image to your Azure Container Registry instance, run the following commands from the project folder:

> [!IMPORTANT]
> This container registry instance must be the one configured as the container registry endpoint in your Azure IoT Operations instance.

```bash
# Sign in to your Azure subscription and ACR instance
az login
az acr login --name <YOUR CONTAINER REGISTRY NAME>

# Build and publish the connector image
dotnet publish /t:PublishContainer \
    -p:ContainerRegistry=<YOUR CONTAINER REGISTRY NAME>.azurecr.io \
    -p:ContainerRepository=my-connector \
    -p:ContainerImageTag=latest
```

## Author connector metadata configuration

The connector metadata configuration file describes the connector and its capabilities. The information in this file controls the properties exposed when a user creates a connector template instance and the UI exposed in the operations experience. Create a file called `connector-metadata.json` with the following content:

```json
{
  "$schema": "https://raw.githubusercontent.com/SchemaStore/schemastore/refs/heads/master/src/schemas/json/aio-connector-metadata-9.0-preview.json",
  "name": "MyRestConnector",
  "description": "Connector for polling a REST server for information - with property",
  "version": "1.0.0",
  "imageConfigurationSettings": {
    "imageName": "my-connector",
    "tag": "latest"
  },
  "supportedArchitectures": [
    "linux/amd64"
  ],
  "inboundEndpoints": [
    {
      "endpointType": "Contoso.Http",
      "version": "2.0",
      "fields": {
        "address": {
          "input": "required",
          "exampleValue": "https://www.contoso.com/someAddress",
          "regex": [
            "/^(https?:\/\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\/\\w \\.-]*)*\/?$/"
          ],
          "description": "The HTTP address to connect to"
        }
      },
      "datasets": {
        "limits": {
          "minimum": 0
        },
        "fields": {
          "dataSource": {
            "input": "required",
            "exampleValue": "some/http/path"
          },
          "typeRef": {
            "input": "unsupported"
          }
        },
        "datasetConfigurationSchema": {
          "$schema": "http://json-schema.org/draft-07/schema#",
          "$id": "https://contoso.com/datasetConfig.schema.json",
          "title": "Dataset Config Schema",
          "description": "The JSON schema for both the default dataset configuration field and all individual dataset-specific configuration fields",
          "type": "object",
          "properties": {
            "SamplingInterval": {
              "description": "How frequently to sample each dataset by default (in milliseconds)",
              "type": "integer"
            }
          }
        },
        "dataPoints": {
          "limits": {
            "minimum": 0
          },
          "fields": {
            "dataSource": {
              "input": "optional",
              "exampleValue": "some/http/path"
            },
            "typeRef": {
              "input": "optional"
            }
          },
          "dataPointConfigurationSchema": {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "$id": "https://contoso.com/datapointConfig.schema.json",
            "title": "Dataset Config Schema",
            "description": "The JSON schema for both the default dataset configuration field and all individual dataset-specific configuration fields",
            "type": "object",
            "properties": {
              "HttpRequestMethod": {
                "description": "Http method to use for the request",
                "type": "string",
                "enum": [
                  "GET",
                  "POST"
                ]
              }
            }
          }
        }
      }
    }
  ]
}
```

In the previous file, some of the key settings are:

- `name` and `description`: The name and description of the connector displayed in the Azure portal.
- `imageConfigurationSettings`: The name and tag of the connector code container image you published to the container registry.
- `endpointType`: The type of inbound endpoint supported by the connector. In this example, the connector supports the `Contoso.Http` endpoint type.
- `datasetConfigurationSchema` and `dataPointConfigurationSchema`: The JSON schema definitions for the dataset and data point configuration options exposed in the operations experience UI. The connector code reads these configuration options - `SamplingInterval` and `HttpRequestMethod` - to control its behavior.

> [!TIP]
> Review the schema for connector metadata files at [Connector metadata schema](https://raw.githubusercontent.com/SchemaStore/schemastore/refs/heads/master/src/schemas/json/aio-connector-metadata-9.0-preview.json) to learn more about the available settings.

To publish this file to your container registry, run the following command from the folder where the file is located:

```bash
oras push --config /dev/null:application/vnd.microsoft.akri-connector.v1+json <YOUR CONTAINER REGISTRY NAME>.azurecr.io/connector-metadata:latest connector-metadata.json:application/json
```

In the previous command, the `--config` parameter specifies the `application/vnd.microsoft.akri-connector.v1+json` media type. The media type indicates that this file is an Akri connector metadata file. Without this parameter, the Azure IoT Operations instance can't recognize the file as connector metadata.

## Create a connector template instance

A connector template instance defines a reusable configuration of a connector type. An operator uses a connector template instance when they create an inbound endpoint on a device in the operations experience. To create a connector template instance from your connector, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to your Azure IoT Operations instance.

1. In your Azure IoT Operations instance, go to **Components** > **Connector templates** and select **+ Create a connector template**. Your new connector type appears in the list of available connectors.

    :::image type="content" source="media/howto-develop-akri-connectors/available-connectors.png" alt-text="Screenshot of available connectors in Azure IoT Operations in the Azure portal." lightbox="media/howto-develop-akri-connectors/available-connectors.png":::

1. Select your connector type - `MyRestConnector` in this example - and then select **Metadata >** to move to the next page.

1. On the **Metadata** page, enter a name for your connector template instance such as `my-rest-connector` and select **Device inbound endpoint type >** to move to the next page.

    > [!TIP]
    > Later, if you want to see the pod in Kubernetes cluster that contains a connector instance, this name is the prefix of the pod name. For example, `my-rest-connector-80625de9-ss-`.

1. On the **Device inbound endpoint type** page, notice the endpoint type - `Contoso.Http` in this example - from the *connector-metadata.json* file. Select **Diagnostics configurations >** to move to the next page.

1. Select **Runtime configuration >** to move to the next page. Then select **Review >** to move to the final page.

1. On the **Review** page, review the settings and select **Create** to create the connector template instance. The new connector template instance appears in the list of connector templates.

    :::image type="content" source="media/howto-develop-akri-connectors/connector-template.png" alt-text="Screenshot of connector template instance in Azure IoT Operations in the Azure portal." lightbox="media/howto-develop-akri-connectors/connector-template.png":::

The connector template instance is now available for operators to use when they create devices in the operations experience UI.

## Test the connector

This section describes how to test the connector by completing the following tasks:

- Deploy a sample REST server that exposes thermostat data.
- Create a device and asset in the operations experience that connects to REST server to fetch thermostat data.
- Create a data flow that reads messages from the MQTT broker and writes them to an Event Hubs namespace.

### Deploy the sample REST server

The [sample rest server](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/akri-vscode-extension/sample-rest-server/README.md) in the **Explore IoT Operations** GitHub repository simulates a RESTful service. The server is packaged as a Docker image that exposes thermostat data on port 3000 for the connector to use. Deploy the sample REST server to a Docker container in a location that's accessible to your Azure IoT Operations instance. The following steps assume you deploy the REST server to a machine on the same network as your Kubernetes cluster.

> [!TIP]
> You can also deploy the sample REST server to an Azure Container instance if your Azure IoT Operations instance has internet access.

### Create device and asset in operations experience

To create a device and asset in the operations experience web UI that use your custom connector to retrieve thermostat data from the sample REST server, follow these steps:

1. Sign in to the [operations experience](https://iotoperations.azure.com) and go to your Azure IoT Operations instance.

1. Go to the **Devices** page and select **+ Create new > Device**. On the **Basics** page, enter a name for the device such as `contoso-thermostat-device` and select **+ New** on the tile that represents your custom connector. The information on the tile comes from the connector metadata file you created earlier:

    :::image type="content" source="media/howto-develop-akri-connectors/add-endpoint.png" alt-text="Screenshot of the basics page in the device creation experience." lightbox="media/howto-develop-akri-connectors/add-endpoint.png":::

1. On the **Inbound endpoint** page, enter the following information. You need the IP address of the sample REST server:

    - For **Endpoint name**, enter a name such as `contoso-thermostat-endpoint`.
    - For **Server URL**, enter the address of the sample REST server such as `http://<REST SERVER IP ADDRESS>:3000`.
    - For **Authentication**, select **Anonymous**.

    Select **Save**. Your endpoint configuration shows in the list of added endpoints for the device. Select **Next** to move to the next page.

1. On the **Additional Info** page, add any custom properties you want to associate with the device. Select **Next** to move to the next page.

1. On the **Summary** page, review the device configuration and select **Create** to create the device. Your new device configuration appears in the list of devices for your Azure IoT Operations instance.

1. In the operations experience, go to the **Assets** page and select **+ Create new > Asset**.

1. On the **Asset details** page, enter the following information:

    - For **Inbound endpoint**, select the endpoint you created earlier - `contoso-thermostat-endpoint` in this example.
    - For **Asset name**, enter a name such as `contoso-thermostat-asset`.
    - For **Description**, enter a description such as `Asset that represents a thermostat device at Contoso`.
    - Add any custom properties you want to associate with the asset.

    Select **Next** to move to the next page.

1. On the **Datasets** page, select **Create dataset**. On the **Add dataset** page, enter the following information:

    - For **Dataset name**, the custom connector code expects a dataset named `thermostat_status` in this example.
    - Leave **Data source** blank.
    - For **Destination topic**, enter `machine/thermostat1/status`. The data flow you deploy later subscribes to this MQTT topic.  
    - For **Retain**, select `Never`.
    - For **Quality of Service**, select `Qos1`.
    - Leave **TTL** blank.
    - For **SamplingInterval**, enter `4000`. You defined this setting the connector metadata file for the connector code to read.

    Select **Create and next** to create the dataset and move to the next page:

    :::image type="content" source="media/howto-develop-akri-connectors/create-dataset.png" alt-text="Screenshot that shows how to create a dataset in the operations experience. The page includes the custom property defined in the connector metadata file." lightbox="media/howto-develop-akri-connectors/create-dataset.png":::

1. On the **List of data points** page, select **+ Add data point** twice to add two data points. For each data point, enter the following information:

    For the first data point:
      - For **Data source**,  enter `/api/thermostat/current`.
      - For **Data point name**, enter `currentTemperature`.
      - For **HttpRequestMethod**, select `GET`. You defined this setting the connector metadata file for the connector code to read.

    For the second data point:
      - For **Data source**,  enter `/api/thermostat/desired`.
      - For **Data point name**, enter `desiredTemperature`.
      - For **HttpRequestMethod**, select `GET`. You defined this setting the connector metadata file for the connector code to read.

    :::image type="content" source="media/howto-develop-akri-connectors/create-data-point.png" alt-text="Screenshot that shows how to create a data point in the operations experience. The page includes the custom property defined in the connector metadata file." lightbox="media/howto-develop-akri-connectors/create-data-point.png":::

    Select **Save** to save the data points and then select **Next** to move to the next page.

1. On the **Review** page, review the asset configuration and select **Create** to create the asset. Your new asset configuration appears in the list of assets for your Azure IoT Operations instance.

After the asset configuration deploys to your Azure IoT Operations instance, the Akri services in your Kubernetes cluster discover the asset and use the connector template instance to create an instance of your connector in the cluster. The connector starts polling the sample REST server for thermostat data and publishes the data as messages to the MQTT broker.

### Create an Event Hubs namespace and data flow

To verify that the connector works correctly, create a data flow that reads messages from the MQTT broker and writes them to an Event Hubs namespace. Then, use the Event Hubs data explorer to view the messages. To create the data flow and deploy an Event Hubs namespace, follow these steps:

1. To download the bicep file that deploys an Event Hubs namespace with an event hub and that adds a data flow to your Azure IoT Operations instance, run the following command from a terminal:

    ```bash
    wget https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/custom-connector-bicep/connector-verify.bicep -O connector-verify.bicep
    ```

1. To use the bicep file to deploy your Event Hubs namespace and data flow, run the following commands:

    ```bash
    RESOURCE_GROUP='<your Azure resource group name>'
    CLUSTER_NAME='<your Kubernetes cluster name>'
    SUBSCRIPTION='<your Azure subscription ID>'
    ADR_ASSET_NAME=contoso-thermostat-asset

    AIO_EXTENSION_NAME=$(az k8s-extension list -g $RESOURCE_GROUP --cluster-name $CLUSTER_NAME --cluster-type connectedClusters --query "[?extensionType == 'microsoft.iotoperations'].id" -o tsv | awk -F'/' '{print $NF}')
    AIO_INSTANCE_NAME=$(az iot ops list -g $RESOURCE_GROUP --query "[0].name" -o tsv)
    CUSTOM_LOCATION_NAME=$(az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv | awk -F'/' '{print $NF}')

    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file connector-verify.bicep --parameters clusterName=$CLUSTER_NAME customLocationName=$CUSTOM_LOCATION_NAME aioExtensionName=$AIO_EXTENSION_NAME aioInstanceName=$AIO_INSTANCE_NAME aioAssetName=$ADR_ASSET_NAME --query "properties.outputs"

1. To review the data flow configuration, go to your Azure IoT Operations instance in the [operations experience](https://iotoperations.azure.com).

1. Go to **Data flows** and select **thermostat-data-flow**. This data flow connects to your **contoso-thermostat-asset** by subscribing to the `machine/thermostat1/status` topic in the MQTT broker. The data flow passes the messages through to the **thermostat-eh-endpoint** data flow output endpoint. This output endpoint connects to your event hub.

To view the messages flowing to your event hub, follow these steps:

1. In the Azure portal, go to the Event Hubs namespace that the Bicep file deployed. Then go to the **thermostateh** event hub in the namespace.

1. Select **Access control** and select **Add > Add role assignment**. Add yourself to the **Azure Event Hubs Data Receiver** role.

1. Go to **Data Explorer**, select **Newest position**, and then **View events**. Select one of the events to view the data in the message:

    :::image type="content" source="media/howto-develop-akri-connectors/event-hub-message.png" alt-text="Screenshot that shows an example message in the event hub that your data flow sends messages to." lightbox="media/howto-develop-akri-connectors/event-hub-message.png":::

## Next steps

In this article, you used the `aiopollingtelemetryconnector` .NET project template to create a connector that polls a REST service to retrieve thermostat data. The `aioeventdriventelemetryconnector` project template lets you build event-driven connectors. For more information, see the [Event Driven TCP Thermostat Connector](https://github.com/Azure/iot-operations-sdks/blob/main/dotnet/samples/Connectors/EventDrivenTcpThermostatConnector/README.md) in the Azure IoT Operations .NET SDK.