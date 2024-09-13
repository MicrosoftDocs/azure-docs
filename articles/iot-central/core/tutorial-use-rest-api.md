---
title: Tutorial - Use the REST API to manage an application
description: In this tutorial you use the REST API to create and manage an IoT Central application, add a device, and configure data export.
author: dominicbetts
ms.author: dobett
ms.date: 08/20/2024
ms.topic: tutorial
ms.service: iot-central
ms.custom: devx-track-azurecli
services: iot-central
# Customer intent: As a solution developer, I want to learn how to use the REST API to manage and interact with and IoT Central application.
---

# Tutorial: Use the REST API to manage an Azure IoT Central application

This tutorial shows you how to use the Azure IoT Central REST API to create and interact with an IoT Central application. This tutorial uses the REST API to complete many of the steps you completed by using the Web UI in the [quickstarts](quick-deploy-iot-central.md). These steps include using an app on your smartphone as an IoT device that connects to IoT Central.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Authorize the REST API.
> - Create an IoT Central application.
> - Add a device to your application.
> - Query and control the device.
> - Set up data export.
> - Delete an application.

## Prerequisites

To complete the steps in this tutorial, you need:

- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- An Android or iOS smartphone on which you're able to install a free app from one of the official app stores.

### Azure CLI

You use the Azure CLI to make the REST API calls and to generate the bearer tokens that some of the REST APIs use for authorization.

[!INCLUDE [azure-cli-prepare-your-environment-no-header](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Authorize the REST API

Before you can use the REST API, you must configure the authorization. The REST API calls in this tutorial use one of two authorization types:

- A bearer token that authorizes access to `https://apps.azureiotcentral.com`. You use this bearer token to create the API tokens in the IoT Central application.
- Administrator and operator API tokens that authorize access to capabilities in your IoT Central application. You use these tokens for most the API calls in this tutorial. These tokens only authorize access to one specific IoT Central application.

Run the following Azure CLI commands to generate a bearer token that authorizes access to `https://apps.azureiotcentral.com`:

```azurecli
az account get-access-token --resource https://apps.azureiotcentral.com
```

> [!TIP]
> If you started a new instance of your shell, run `az login` again.

Make a note of the `accessToken` value, you use it later in the tutorial.

> [!NOTE]
> Bearer tokens expire after an hour. If they expire, run the same commands to generate new bearer tokens.

## Create a resource group

Use the Azure cli to create a resource group that contains the IoT Central application you create in this tutorial:

```azurecli
az group create --name iot-central-rest-tutorial --location eastus
```

## Create an IoT Central application

Use the following command to generate an IoT Central application with a random name to use in this tutorial:

```azurecli
appName=app-rest-$(date +%s)

az iot central app create --name $appName --resource-group iot-central-rest-tutorial --subdomain $appName
```

Make a note of the application name, you use it later in this tutorial.

## Create the API tokens

Use the following data plane requests to create the application API tokens in your IoT Central application. Some of the requests in this tutorial require an API token with administrator permissions, but the majority can use operator permissions:

To create an operator token called `operator-token` by using the Azure CLI, run the following command. The role GUID is the ID of the operator role in all IoT Central applications:

```azurecli
appName=<the app name generated previously>
bearerTokenApp=<the bearer token generated previously>

az rest --method put --uri https://$appName.azureiotcentral.com/api/apiTokens/operator-token?api-version=2022-07-31 --headers Authorization="Bearer $bearerTokenApp" "Content-Type=application/json" --body '{"roles": [{"role": "ae2c9854-393b-4f97-8c42-479d70ce626e"}]}'
```

Make a note of the operator token the command returns, you use it later in the tutorial. The token looks like `SharedAccessSignature sr=2...`.

To create an admin token called `admin-token` by using the Azure CLI, run the following command. The role GUID is the ID of the admin role in all IoT Central applications:

```azurecli
$appName=<the app name generated previously>
$bearerTokenApp=<the bearer token generated previously>

az rest --method put --uri https://$appName.azureiotcentral.com/api/apiTokens/admin-token?api-version=2022-07-31 --headers Authorization="Bearer $bearerTokenApp" "Content-Type=application/json" --body '{"roles": [{"role": "ca310b8d-2f4a-44e0-a36e-957c202cd8d4"}]}'
```

Make a note of the admin token the command returns, you use it later in the tutorial. The token looks like `SharedAccessSignature sr=2...`.

If you want to see these tokens in your IoT central application, open the application and navigate to **Security > Permissions > API tokens**.

## Register a device

You must register a device with IoT Central before it can connect. Use the following requests to register your device in your application and retrieve the device credentials. The first request creates a device with **phone-001** as the device ID:

```azurecli
appName=<the app name generated previously>
operatorToken=<the operator token generated previously>

az rest --method put --uri https://$appName.azureiotcentral.com/api/devices/phone-001?api-version=2022-07-31 --headers Authorization="$operatorToken" "Content-Type=application/json" --body '{"displayName": "My phone app","simulated": false,"enabled": true}'

az rest --method get --uri https://$appName.azureiotcentral.com/api/devices/phone-001/credentials?api-version=2022-07-31 --headers Authorization="$operatorToken" "Content-Type=application/json"
```

Make a note of the `idScope` and `primaryKey` values the command returns, you use them later in the tutorial.

## Provision and connect a device

To avoid the need to enter the device credentials manually on your smartphone, you can use a QR code generated by IoT central. The QR code encodes the device ID, ID scope, primary key. To display the QR code:

1. Open your IoT central application by using the application URL you made a note of previously.
1. In your IoT Central application, navigate to **Devices > My phone app > Connect > QR code**. Keep this page open until the device is connected.

:::image type="content" source="media/tutorial-use-rest-api/qr-code.png" alt-text="Screenshot that shows the QR code you use to connect the device.":::

To simplify the setup, this article uses the **IoT Plug and Play** smartphone app as an IoT device. The app sends telemetry collected from the smartphone's sensors, responds to commands invoked from IoT Central, and reports property values to IoT Central.

[!INCLUDE [iot-phoneapp-install](../../../includes/iot-phoneapp-install.md)]

To connect the **IoT Plug and Play** app to your Iot Central application:

1. Open the **IoT PnP** app on your smartphone.

1. On the welcome page, select **Scan QR code**. Point the smartphone's camera at the QR code. Then wait for a few seconds while the connection is established.

1. On the telemetry page in the app, you can see the data the app is sending to IoT Central. On the logs page, you can see the device connecting and several initialization messages.

To verify the device is now provisioned, you can use the REST API:

```azurecli
appName=<the app name generated previously>
operatorToken=<the operator token generated previously>

az rest --method get --uri https://$appName.azureiotcentral.com/api/devices/phone-001?api-version=2022-07-31 --headers Authorization="$operatorToken" "Content-Type=application/json"
```

Make a note of the `template` value the command returns, you use it later in the tutorial.

You can use the REST API to manage device templates in the application. For example, to view the device templates in the application:

```azurecli
appName=<the app name generated previously>
operatorToken=<the operator token generated previously>

az rest --method get --uri https://$appName.azureiotcentral.com/api/deviceTemplates?api-version=2022-07-31 --headers Authorization="$operatorToken" "Content-Type=application/json"
```

## Query and control the device

You can use the REST API to query telemetry from your devices. The following request returns the accelerometer data from all devices that share a specific device template ID:

```azurecli
appName=<the app name generated previously>
operatorToken=<the operator token generated previously>
deviceTemplateId=<the device template Id you made a note of previously>
q1='{"query": "SELECT $id as ID, $ts as timestamp, sensors.accelerometer FROM '
q2=' WHERE WITHIN_WINDOW(P1D) AND sensors.accelerometer <> NULL"}'
query="$q1 $deviceTemplateId $q2"
echo $query

az rest --method post --uri https://$appName.azureiotcentral.com/api/query?api-version=2022-10-31-preview --headers Authorization="$operatorToken" "Content-Type=application/json" --body "$query"
```

You can use the REST API to read and set device properties. The following request returns all the property values from the **Device Info** component that the device implements:

```azurecli
appName=<the app name generated previously>
operatorToken=<the operator token generated previously>

az rest --method get --uri https://$appName.azureiotcentral.com/api/devices/phone-001/components/device_info/properties?api-version=2022-07-31 --headers Authorization="$operatorToken" "Content-Type=application/json"
```

You can use the REST API to call device commands. The following request calls a command that switches on your smartphone light on twice for three seconds. For the command to run, your smartphone screen must be on with the **IoT Plug and Play** app visible:

```azurecli
appName=<the app name generated previously>
operatorToken=<the operator token generated previously>

az rest --method post --uri https://$appName.azureiotcentral.com/api/devices/phone-001/commands/lightOn?api-version=2022-07-31 --headers Authorization="$operatorToken" "Content-Type=application/json" --body '{"duration": 3, "delay": 1, "pulses": 2}'
```

## Clean up resources

If you've finished with the IoT Central application you used in this tutorial, you can delete it:

```azurecli
appName=<the app name generated previously>

az iot central app delete --name $appName --resource-group iot-central-rest-tutorial
```
