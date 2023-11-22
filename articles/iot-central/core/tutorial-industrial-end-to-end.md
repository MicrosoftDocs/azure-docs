---
title: Tutorial - Explore an Azure IoT Central industrial scenario
description: This tutorial shows you how to deploy an end-to-end industrial IoT solution by using IoT Edge, IoT Central, and Azure Data Explorer.
author: dominicbetts
ms.author: dobett
ms.date: 07/10/2023
ms.topic: tutorial
ms.service: iot-central
ms.custom: devx-track-azurecli
services: iot-central
#Customer intent: As a solution builder, I want to deploy a complete industrial IoT solution that uses IoT Central so that I understand how IoT Central enables industrial IoT scenarios.
---

# Explore an industrial IoT scenario with IoT Central

The solution shows how to use Azure IoT Central to ingest industrial IoT data from edge resources and then export the data to Azure Data Explorer for further analysis. The sample deploys and configures resources such as:

- An Azure virtual machine to host the Azure IoT Edge runtime.
- An IoT Central application to ingest OPC-UA data, transform it, and then export it to Azure Data Explorer.
- An Azure Data Explorer environment to store, manipulate, and explore the OPC-UA data.

The following diagram shows the data flow in the scenario and highlights the key capabilities of IoT Central relevant to industrial solutions:

:::image type="content" source="media/tutorial-industrial-end-to-end/industrial-iot-architecture.png" alt-text="A diagram that shows the architecture of an industrial IoT scenario.":::

The sample uses a custom tool to deploy and configure all of the resources. The tool shows you what resources it deploys and provides links to further information.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy an end-to-end industrial IoT solution
> * Use the **IoT Central Solution Builder** tool to deploy a solution
> * Create a customized deployment

## Prerequisites

- Azure subscription that you access using a [work or school account](https://techcommunity.microsoft.com/t5/itops-talk-blog/what-s-the-difference-between-a-personal-microsoft-account-and-a/ba-p/2241897). Currently, you can't use a Microsoft account to deploy the solution with the **IoT Central Solution Builder** tool.
- Local machine to run the **IoT Central Solution Builder** tool. Prebuilt binaries are available for Windows and macOS.
- If you need to build the **IoT Central Solution Builder** tool instead of using one of the prebuilt binaries, you need a local Git installation.
- Text editor. If you want to edit the configuration file to customize your solution.

In this tutorial, you use the Azure CLI to create an app registration in Microsoft Entra ID:

[!INCLUDE [azure-cli-prepare-your-environment-no-header](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Setup

Complete the following tasks to prepare the tool to deploy your solution:

- Create a Microsoft Entra app registration
- Install the **IoT Central Solution Builder** tool
- Configure the **IoT Central Solution Builder** tool

To create an Active Directory app registration in your Azure subscription:

- If you're running the Azure CLI on your local machine, sign in to your Azure tenant:

  ```azurecli
  az login
  ```

  > [!TIP]
  > If you're using the Azure Cloud Shell, you're signed in automatically. If you want to use a different subscription, use the [az account](/cli/azure/account?view=azure-cli-latest#az-account-set&preserve-view=true) command.

- Make a note of the `id` value from the previous command. This value is your *subscription ID*. You use this value later in the tutorial.

- Make a note of the `tenantId` value from the previous command. This value is your *tenant ID*. You use this value later in the tutorial.

- To create an Active Directory app registration, run the following command:

  ```azurecli
  az ad app create \
  --display-name "IoT Central Solution Builder" \
  --enable-access-token-issuance false \
  --enable-id-token-issuance false \
  --is-fallback-public-client false \
  --public-client-redirect-uris "msald38cef1a-9200-449d-9ce5-3198067beaa5://auth" \
  --required-resource-accesses "[{\"resourceAccess\":[{\"id\":\"00d678f0-da44-4b12-a6d6-c98bcfd1c5fe\",\"type\":\"Scope\"}],\"resourceAppId\":\"2746ea77-4702-4b45-80ca-3c97e680e8b7\"},{\"resourceAccess\":[{\"id\":\"73792908-5709-46da-9a68-098589599db6\",\"type\":\"Scope\"}],\"resourceAppId\":\"9edfcdd9-0bc5-4bd4-b287-c3afc716aac7\"},{\"resourceAccess\":[{\"id\":\"41094075-9dad-400e-a0bd-54e686782033\",\"type\":\"Scope\"}],\"resourceAppId\":\"797f4846-ba00-4fd7-ba43-dac1f8f63013\"},{\"resourceAccess\":[{\"id\":\"e1fe6dd8-ba31-4d61-89e7-88639da4683d\",\"type\":\"Scope\"}],\"resourceAppId\":\"00000003-0000-0000-c000-000000000000\"}]" \
  --sign-in-audience "AzureADandPersonalMicrosoftAccount"
  ```

  > [!NOTE]
  > The display name must be unique in your subscription.

- Make a note of the `appId` value from the output of the previous command. This value is your *application (client) ID*. You use this value later in the tutorial.

To install the **IoT Central Solution Builder** tool:

- If you're using Windows, download and run the latest setup file from the [releases](https://github.com/Azure-Samples/iotc-solution-builder/releases) page.
- For other platforms, clone the [iotc-solution-builder](https://github.com/Azure-Samples/iotc-solution-builder) GitHub repository and follow the instructions in the readme file to [build the tool](https://github.com/Azure-Samples/iotc-solution-builder#build-the-tool).

To configure the **IoT Central Solution Builder** tool:

- Run the **IoT Central Solution Builder** tool.
- Select **Action > Edit Azure config**:

  :::image type="content" source="media/tutorial-industrial-end-to-end/iot-central-solution-builder-azure-config.png" alt-text="Screenshot that shows the edit Azure config menu option in the IoT solution builder tool.":::

- Enter the application ID, subscription ID, and tenant ID that you made a note of previously. Select **OK**.

- Select **Action > Sign in**. Sign in with the same credentials you used to create the Active Directory app registration.

The **IoT Central Solution Builder** tool is now ready to use to deploy your industrial IoT solution.

## Deploy the solution

Use the **IoT Central Solution Builder** tool to deploy the Azure resources for the solution. The tool deploys and configures the resources to create a running solution.

Download the [adxconfig-opcpub.json](https://raw.githubusercontent.com/Azure-Samples/iotc-solution-builder/main/iotedgeDeploy/configs/adxconfig-opcpub.json) configuration file. This configuration file deploys the required resources.

To load the configuration file for the solution to deploy:

- In the tool, select **Open Configuration**.
- Select the `adxconfig-opcpub.json` file you download.
- The tool displays the deployment steps:

  :::image type="content" source="media/tutorial-industrial-end-to-end/iot-central-solution-builder-steps.png" alt-text="Screenshot that shows the deployment steps defined in the configuration file loaded into the tool.":::

  > [!TIP]
  > Select any step to view relevant documentation.

Each step uses either an ARM template or REST API call to deploy or configure resources. Open the `adxconfig-opcpub.json` to see the details of each step.

To deploy the solution:

- Select **Start Provisioning**.
- Optionally, change the suffix and Azure location to use. The suffix is appended to the name of all the resources the tool creates to help you identify them in the Azure portal.
- Select **Configure**.
- The tool shows its progress as it deploys the solution.

  > [!TIP]
  > The tool takes about 15 minutes to deploy and configure all the resources.

- Navigate to the Azure portal and sign in with the same credentials you used to sign in to the tool.
- Find the resource group the tool created. The name of the resource group is **iotc-rg-{suffix from tool}**. In the following screenshot, the suffix used by the tool is  **iotcsb29472**:

  :::image type="content" source="media/tutorial-industrial-end-to-end/azure-portal-resources.png" alt-text="Screenshot that shows the deployed resources in the Azure portal.":::

To customize the deployed solution, you can edit the `adxconfig-opcpub.json` configuration file and then run the tool.

## Walk through the solution

The configuration file run by the tool defines the Azure resources to deploy and any required configuration. The tool runs the steps in the configuration file in sequence. Some steps are dependent on previous steps.

The following sections describe the resources you deployed and what they do. The order here follows the device data as it flows from the IoT Edge device to IoT Central, and then on to Azure Data Explorer:

:::image type="content" source="media/tutorial-industrial-end-to-end/data-flow.svg" alt-text="Diagram that shows the flow of data through the solution." border="false":::

### IoT Edge

The tool deploys the IoT Edge 1.2 runtime to an Azure virtual machine. The installation script that the tool runs edits the IoT Edge *config.toml* file to add the following values from IoT Central:

- **Id scope** for the IoT Central app.
- **Device Id** for the gateway device registered in the IoT Central app.
- **Symmetric key** for the gateway device registered in the IoT Central app.

The IoT Edge deployment manifest defines four custom modules:

- [azuremetricscollector](../../iot-edge/how-to-collect-and-transport-metrics.md?view=iotedge-2020-11&tabs=iotcentral&preserve-view=true) - sends metrics from the IoT Edge device to the IoT Central application.
- [opcplc](https://github.com/Azure-Samples/iot-edge-opc-plc) - generates simulated OPC-UA data.
- [opcpublisher](https://github.com/Azure/Industrial-IoT/tree/main/docs/opc-publisher) - forwards OPC-UA data from an OPC-UA server to the **miabgateway**.
- [miabgateway](https://github.com/iot-for-all/iotc-miab-gateway) - gateway to send OPC-UA data to your IoT Central app and handle commands sent from your IoT Central app.

You can see the deployment manifest in the tool configuration file. The tool assigns the deployment manifest to the IoT Edge device it registers in your IoT Central application.

To learn more about how to use the REST API to deploy and configure the IoT Edge runtime, see [Run Azure IoT Edge on Ubuntu Virtual Machines](../../iot-edge/how-to-install-iot-edge-ubuntuvm.md).

### Simulated OPC-UA telemetry

The [opcplc](https://github.com/Azure-Samples/iot-edge-opc-plc) module on the IoT Edge device generates simulated OPC-UA data for the solution. This module implements an OPC-UA server with multiple nodes that generate random data and anomalies. The module also lets you configure user defined nodes.

The [opcpublisher](https://github.com/Azure/Industrial-IoT/tree/main/docs/opc-publisher) module on the IoT Edge device forwards OPC-UA data from an OPC-UA server to the **miabgateway** module.

### IoT Central application

The IoT Central application in the solution:

- Provides a cloud-hosted endpoint to receive OPC-UA data from the IoT Edge device.
- Lets you manage and control the connected devices and gateways.
- Transforms the OPC-UA data it receives and exports it to Azure Data Explorer.

The configuration file uses a control plane [REST API to create and manage IoT Central applications](howto-manage-iot-central-with-rest-api.md).

### Device templates and devices

The solution uses a single device template called **Manufacturing In A Box Gateway** in your IoT Central application. The device template models the IoT Edge gateway and includes the **Manufacturing In A Box Gateway** and **Azure Metrics Collector** modules.

The **Manufacturing In A Box Gateway** module includes the following interfaces:

- **Manufacturing In A Box Gateway Device Interface**. This interface defines read-only properties and events such as **Processor architecture**, **Operating system**, **Software version**, and **Module Started** that the device reports to IoT Central. The interface also defines a **Restart Gateway Module** command and a writable **Debug Telemetry** property.
- **Manufacturing In A Box Gateway Module Interface**. This interface lets you manage the downstream OPC-UA servers connected to the gateway. The interface includes commands such as the **Provision OPC Device** command that the tool calls during the configuration process.

There are two devices registered in your IoT Central application:

- **opc-anomaly-device**. This device isn't assigned to a device template. The device represents the OPC-UA server implemented in the **opcplc** IoT Edge module. This OPC-UA server generates simulated OPC-UA data. Because the device isn't associated with a device template, IoT Central marks the telemetry as **Unmodeled**.
- **industrial-connect-gw**. This device is assigned to the **Manufacturing In A Box Gateway** device template. Use this device to monitor the health of the gateway and manage the downstream OPC-UA servers. The configuration file run by the tool calls the **Provision OPC Device** command to provision the downstream OPC-UA server.

The configuration file uses the following data plane REST APIs to add the device templates and devices to the IoT Central application, register the devices, and retrieve the device provisioning authentication keys:

- [How to use the IoT Central REST API to manage device templates](howto-manage-device-templates-with-rest-api.md).
- [How to use the IoT Central REST API to control devices](howto-control-devices-with-rest-api.md).

You can also use the IoT Central UI or CLI to manage the devices and gateways in your solution. For example, to check the **opc-anomaly-device** is sending data, navigate to the **Raw data** view for the device in the IoT Central application. If the device is sending telemetry, you see telemetry messages in the **Raw data** view. If there are no telemetry messages, restart the Azure virtual machine in the Azure portal.

> [!TIP]
> You can find the Azure virtual machine with IoT Edge runtime in the resource group created by the configuration tool.

### Data export configuration

The solution uses the IoT Central data export capability to export OPC-UA data. IoT Central data export continuously sends filtered telemetry received from the OPC-UA server to an Azure Data Explorer environment. The filter ensures that only data from the OPC-UA is exported. The data export uses a [transformation](howto-transform-data-internally.md) to map the raw telemetry into a tabular structure suitable for Azure Data Explorer to ingest. The following snippet shows the transformation query:

```jq
{
  applicationId: .applicationId,
  deviceId: .device.id,
  deviceName: .device.name,
  templateName: .device.templateName,
  enqueuedTime: .enqueuedTime,
  telemetry: .telemetry | map({ key: .name, value: .value }) | from_entries,
 }
```

The configuration file uses the data plane REST API to create the data export configuration in IoT Central. To learn more, see [How to use the IoT Central REST API to manage data exports](howto-manage-data-export-with-rest-api.md).

### Azure Data Explorer

The solution uses Azure Data Explore to store and analyze the OPC-UA telemetry. The solution uses two tables and a function to process the data as it arrives:

- The **rawOpcData** table receives the data from the IoT Central data export. The solution configures this table for streaming ingestion.
- The **opcDeviceData** table stores the transformed data.
- The **extractOpcTagData** function processes the data as it arrives in the **rawOpcData** table and adds transformed records to the **opcDeviceData** table.

You can query the transformed data in the **opcDeviceData** table. For example:

```kusto
opcDeviceData
| where enqueuedTime > ago(1d)
| where tag=="DipData"
| summarize avgValue = avg(value) by deviceId, bin(sourceTimestamp, 15m)
| render timechart
```

The configuration file uses a control plane REST API to deploy the Azure Data Explorer cluster and data plane REST APIS to create and configure the database.

## Customize the solution

The **IoT Central Solution Builder** tool uses a JSON configuration file to define the sequence of steps to run. To customize the solution, edit the configuration file. You can't modify an existing solution with the tool, you can only deploy a new solution.

The example configuration file adds all the resources to the same resource group in your solution. To remove a deployed solution, delete the resource group.

Each step in the configuration file defines one of the following actions:

- Use an Azure Resource Manager template to deploy an Azure resource. For example, the sample configuration file uses a Resource Manager template to deploy the Azure virtual machine that hosts the IoT Edge runtime.
- Make a REST API call to deploy or configure a resource. For example, the sample configuration file uses REST APIs to create and configure the IoT Central application.

## Tidy up

To avoid unnecessary charges, delete the resource group created by the tool when you've finished exploring the solution.

## Next steps

In this tutorial, you learned how to deploy an end-to-end industrial IoT scenario that uses IoT Central. To learn more about industrial IoT solutions with IoT Central, see:

> [!div class="nextstepaction"]
> [Industrial IoT patterns with Azure IoT Central](./concepts-iiot-architecture.md)
