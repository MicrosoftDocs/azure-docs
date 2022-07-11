---
 title: include file
 description: include file
 services: iot-central
 author: dominicbetts
 ms.service: iot-central
 ms.topic: include
 ms.date: 11/03/2020
 ms.author: dobett
 ms.custom: include file
---

When you run the sample device application later in this tutorial, you need the following configuration values:

* ID scope: In your IoT Central application, navigate to **Permissions > Device connection groups**. Make a note of the **ID scope** value.
* Group primary key: In your IoT Central application, navigate to **Permissions > Device connection groups > SAS-IoT-Devices**. Make a note of the shared access signature **Primary key** value.

Use the Azure Cloud Shell to generate a device key from the group primary key you retrieved:

```azurecli-interactive
az extension add --name azure-iot
az iot central device compute-device-key --device-id sample-device-01 --pk <the group primary key value>
```

Make a note of the generated device key, you use it later in this tutorial.

> [!NOTE]
> To run this sample, you don't need to register the device in advance in your IoT Central application. The sample uses the IoT Central capability to [automatically register devices](../articles/iot-central/core/concepts-device-authentication.md#automatically-register-devices) when they connect for the first time.
