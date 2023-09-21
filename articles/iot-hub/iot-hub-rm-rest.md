---
title: Create an Azure IoT hub using the resource provider REST API
description: Learn how to use the resource provider C# REST API to create and manage an IoT hub programmatically.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: how-to
ms.date: 08/08/2017
ms.custom: devx-track-csharp, devx-track-dotnet
---

# Create an IoT hub using the resource provider REST API (.NET)

You can use the [IoT Hub Resource](/rest/api/iothub/iothubresource) REST API to create and manage Azure IoT hubs programmatically. This article shows you how to use the IoT Hub Resource to create an IoT hub using **Postman**. Alternatively, you can use **cURL**. If any of these REST commands fail, find help with the [IoT Hub API common error codes](/rest/api/iothub/common-error-codes). 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

* [Azure PowerShell module](/powershell/azure/install-azure-powershell) or [Azure Cloud Shell](../cloud-shell/overview.md)

* [Postman](/rest/api/azure/#how-to-call-azure-rest-apis-with-postman) or [cURL](https://curl.se/)

## Get an Azure access token

1. In the Azure PowerShell cmdlet or Azure Cloud Shell, sign in and then retrieve a token with the following command. If you're using Cloud Shell you are already signed in, so skip this step. 

   ```azurecli-interactive
   az account get-access-token --resource https://management.azure.com
   ```
   You should see a response in the console similar to this JSON (except the access token is long):

   ```json
   {
       "accessToken": "eyJ ... pZA",
       "expiresOn": "2022-09-16 20:57:52.000000",
       "subscription": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
       "tenant": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
       "tokenType": "Bearer"
   }
   ```

1. In a new **Postman** request, from the **Auth** tab, select the **Type** dropdown list and choose **Bearer Token**.

   :::image type="content" source="media/iot-hub-rm-rest/select-bearer-token.png" alt-text="Screenshot that shows how to select the Bearer Token type of authorization in **Postman**.":::

1. Paste the access token into the field labeled **Token**.

Keep in mind the access token expires after 5-60 minutes, so you may need to generate another one.

## Create an IoT hub

1. Select the REST command dropdown list and choose the PUT command. Copy the URL below, replacing the values in the `{}` with your own values. The `{resourceName}` value is the name you'd like for your new IoT hub. Paste the URL into the field next to the PUT command. 

   ```rest
   PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Devices/IotHubs/{resourceName}?api-version=2021-04-12
   ```

   :::image type="content" source="media/iot-hub-rm-rest/paste-put-command.png" alt-text="Screenshot that shows how to add a PUT command in Postman.":::

   See the [PUT command in the IoT Hub Resource](/rest/api/iothub/iot-hub-resource/create-or-update?tabs=HTTP).

1. From the **Body** tab, select **raw** and **JSON** from the dropdown lists. 

   :::image type="content" source="media/iot-hub-rm-rest/add-body-for-put.png" alt-text="Screenshot that shows how to add JSON to the body of your request in Postman.":::

1. Copy the following JSON, replacing values in `<>` with your own. Paste the JSON into the box in **Postman** on the **Body** tab. Make sure your IoT hub name matches the one in your PUT URL. Change the location to your location (the location assigned to your resource group).

    ```json
    {
        "name": "<my-iot-hub>",
        "location": "<region>",
        "tags": {},
        "properties": {},
        "sku": {
            "name": "S1",
            "tier": "Standard",
            "capacity": 1
        }
    }
    ```

   See the [PUT command in the IoT Hub Resource](/rest/api/iothub/iot-hub-resource/create-or-update?tabs=HTTP).

1. Select **Send** to send your request and create a new IoT hub. A successful request will return a **201 Created** response with a JSON printout of your IoT hub specifications. You can save your request if you're using **Postman**.

## View an IoT hub

To see all the specifications of your new IoT hub, use a GET request. You can use the same URL that you used with the PUT request, but must erase the **Body** of that request (if not already blank) because a GET request can't have a body. Here's the GET request template:

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Devices/IotHubs/{resourceName}?api-version=2018-04-01
```

See the [GET command in the IoT Hub Resource](/rest/api/iothub/iot-hub-resource/get?tabs=HTTP).

## Update an IoT hub

Updating is as simple as using the same PUT request from when we created the IoT hub and editing the JSON body to contain parameters of your choosing. Edit the body of the request by adding a **tags** property, then run the PUT request.

```json
{
    "name": "<my-iot-hub>",
    "location": "westus2",
    "tags": {
        "Animal": "Cat"
    },
    "properties": {},
    "sku": {
        "name": "S1",
        "tier": "Standard",
        "capacity": 1
    }
}
```

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Devices/IotHubs/{resourceName}?api-version=2018-04-01
```

The response will show the new tag added in the console. Remember, you may need to refresh your access token if too much time has passed since the last time you generated one.

See the [PUT command in the IoT Hub Resource](/rest/api/iothub/iot-hub-resource/create-or-update?tabs=HTTP).

Alternatively, use the [PATCH command in the IoT Hub Resource](/rest/api/iothub/iot-hub-resource/update?tabs=HTTP) to update tags.

## Delete an IoT hub

If you're only testing, you might want to clean up your resources and delete your new IoT hub, by sending a DELETE request. be sure to replace the values in `{}` with your own values. The `{resourceName}` value is the name of your IoT hub.

```rest
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Devices/IotHubs/{resourceName}?api-version=2018-04-01
```

See the [DELETE command in the IoT Hub Resource](/rest/api/iothub/iot-hub-resource/delete?tabs=HTTP).

## Next steps

Since you've deployed an IoT hub using the resource provider REST API, you may want to explore further:

* Read about the capabilities of the [IoT Hub resource provider REST API](/rest/api/iothub/iothubresource).

* Read [Azure Resource Manager overview](../azure-resource-manager/management/overview.md) to learn more about the capabilities of Azure Resource Manager.

To learn more about developing for IoT Hub, see the following articles:

* [Azure IoT SDKs](iot-hub-devguide-sdks.md)

To further explore the capabilities of IoT Hub, see:

* [Deploying AI to edge devices with Azure IoT Edge](../iot-edge/quickstart-linux.md)
