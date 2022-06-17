---
title: Tutorial - Explore an Azure IoT Central industrial scenario | Microsoft Docs
description: This tutorial shows you how to deploy an end-to-end industrial IoT solution. You install an IoT Edge gateway, an IoT Central application, and an Azure Data Explorer workspace.
author: dominicbetts
ms.author: dobett
ms.date: 06/22/2022
ms.topic: tutorial
ms.service: iot-central
services: iot-central

---

# Explore an industrial IoT scenario with IoT Central

The solution shows how to use Azure IoT Central to ingest industrial IoT data from edge resources and then export the data to Azure Data Explorer (ADX) for further analysis. The sample provisions a number of resources such as:

- An Azure virtual machine to host the Azure IoT Edge runtime.
- An IoT Central application to ingest OPCUA data, transform it, and export it to ADX.
- An ADX environment to store, manipulate, and explore the OPCUA data.

The following diagram shows the data flow in the scenario and highlights the key capabilities of IoT Central that are relevant to industrial solutions:

:::image type="content" source="media/tutorial-industrial-end-to-end/industrial-iot-architecture.png" alt-text="A diagram that shows the architecture of an industrial I O T scenario.":::

The sample uses a custom tool to deploy and configure all of the resources. The tool shows you what resources it deploys and provides links to further information.

## Prerequisites

- Azure subscription.
- Local machine to run the **IoT Central Solution Builder** tool. Pre-built binaries are available for Windows and MacOS.
- Local installation of Git. If you need to build the **IoT Central Solution Builder** tool instead of using one of the pre-built binaries.
- Text editor. If you want to edit the configuration file to customize your solution.

In this tutorial, you use the Azure CLI to create an app registration in Azure Active Directory:

[!INCLUDE [azure-cli-prepare-your-environment-no-header](../../../includes/azure-cli-prepare-your-environment-no-header.md)]

## Setup

To prepare the tool to deploy your solution:

- Create an Azure Active Directory app registration
- Install the **IoT Central Solution Builder** tool
- Configure the **IoT Central Solution Builder** tool

To create an Active Directory app registration in your Azure subscription:

- If you're running the Azure CLI on your local machine, sign in to your Azure tenant:

  ```azurecli
  az login
  ```

  > [!TIP]
  > If you're using the Azure Cloud Shell, you're signed in automatically.

  > [!TIP]
  > If you want to use a different subscription, use the [az account](/cli/azure/account?view=azure-cli-latest#az-account-set&preserve-view=true) command.

- Make a note of the `id` value from the previous command. This is your *subscription Id*. You use this value later in the tutorial.

- Make a note of the `tenantId` value from the previous command. This is your *tenant Id*. You use this value later in the tutorial.

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

- Make a note of the `appId` value from the output of the previous command. This is your *application (client) id*. You use this value later in the tutorial.

To install the **IoT Central Solution Builder** tool:

<!-- TODO: Provide install instructions -->

To configure the **IoT Central Solution Builder** tool:

- Start the **IoT Central Solution Builder** tool. <!-- TODO: What's the recommended way to launch the tool? -->
- Select **Action > Edit Azure config**:

  :::image type="content" source="media/tutorial-industrial-end-to-end/iot-central-solution-builder-azure-config.png" alt-text="Screenshot that shows the edit azure config menu option in the I O T solution builder tool.":::

- Enter the application id, subscription Id, and tenant Id that you made a note of previously. Select **OK**.

- Select **Action > Sign in**. Sign in with the same credentials you used to create the Active Directory app registration.

The **IoT Central Solution Builder** tool is now ready to use to deploy your industrial IoT solution.

## Deploy the solution

Use the **IoT Central Solution Builder** tool to deploy the Azure resources for the solution. The tool deploys and configures the resources to create a running solution.

To load the configuration file for the solution to deploy:

- In the tool, select **Open Configuration**.
- Select the `adxconfig-opcpub.json` file. <!-- TODO: Where is this file loaded from? -->
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
- Find the resource group the tool created. The name of the resource group is **iotc-rg-{suffix from tool}**. In the following screenshot, the suffix used by the tool was  **iotcsb29472**:

  :::image type="content" source="media/tutorial-industrial-end-to-end/azure-portal-resources.png" alt-text="Screenshot that shows the deployed resources in the Azure portal.":::

## Walk through solution

The following sections describe the resources you deployed and what they do:

### OPCUA simulator

### IoT Edge

### Device templates and devices

Include device model and deployment manifest that configures the IoT Edge runtime.

Include running modules list for gateway device.

### Data export configuration

### Azure Data Explorer

- Tables
- Functions
- Sample analysis queries

## Customize the scenario

## Tidy up

## Next steps
