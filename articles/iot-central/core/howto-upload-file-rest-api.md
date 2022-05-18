---
title: Use the REST API to add upload storage account configuration in Azure IoT Central
description: How to use the IoT Central REST API to add upload storage account configuration in an application
author: v-krishnag
ms.author: v-krishnag
ms.date: 05/12/2022
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to upload a file

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to manage [device templates](concepts-device-templates.md) in your IoT Central application.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

[!INCLUDE [iot-central-postman-collection](../../../includes/iot-central-postman-collection.md)]

## Upload storage account configuration

IoT Central lets you upload media and other files from connected devices to cloud storage. You configure the file upload capability in your IoT Central application, and then implement file uploads in your device code.

## Prerequisites

* [Node.js](https://nodejs.org/en/download/)
* [Visual Studio Code](https://code.visualstudio.com/Download) with [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension installed, or a command line will work.
* [IoT Central Application](https://docs.microsoft.com/azure/iot-central/core/quick-deploy-iot-central)

## Clone the repository

If you haven't already cloned the repository, use the following command to clone it to a suitable location on your local machine and install the dependent packages:
```
git clone https://github.com/iot-for-all/iotc-file-upload-device
cd iotc-file-upload-device
npm i
```

## Upload storage account configuration REST API

The IoT Central REST API lets you:

* Add a file upload storage account configuration
* Update a file upload storage account configuration
* Get the file upload storage account configuration
* Delete the file upload storage configuration

## Add a file upload storage account configuration

Use the following request to create a file upload Blob Storage account configuration

```http
PUT https://{subdomain}.{baseDomain}/api/fileUploads?api-version=1.2-preview
```

The request body has the following fields:

* `account`: The storage account name where to upload the file to.
* `connectionString`: The connection string used to configure the storage account.
* `container`: The name of the container inside the storage account.
* `etag`: ETag to prevent conflict with multiple uploads
* `sasTtl`: ISO 8601 duration standard, The amount of time the device’s request to upload a file is valid before it expires.

```json
{
  "account": "contoso-account",
  "connectionString": "DefaultEndpointsProtocol=https;AccountName=MyAccountName;AccountKey=*****;BlobEndpoint=core.windows.net",
  "container": "container",
  "sasTtl": "PT1H"
}
```

The response to this request looks like the following example: 

```json
{
  "account": "contoso-account",
  "connectionString": "DefaultEndpointsProtocol=https;AccountName=MyAccountName;AccountKey=*****;BlobEndpoint=core.windows.net",
  "container": "container",
  "sasTtl": "PT1H",
  "state": "pending",
  "etag": "\"7502ac89-0000-0300-0000-627eaf100000\""

}

```

### Create the device template and import the model

Open your application in IoT Central UI

1. Navigate to the **Device Templates** tab in the left pane, select **+ New**:

1. Choose **IoT Device** as the template type.

1. On the **Customize** page of the wizard, enter a name such as *File Upload Device Sample* for the device template.

1. On the **Review** page, select **Create**.

1. Select **Import a model** and upload the *FileUploadDeviceDcm.json* manifest file from the repository you downloaded previously.

### Add views

1. Go to your device template you just created, and select **Views**.
1. Select **Visualizing the Device**.
1. Enter a name for your view in **View name**.
1. Select **Start with a device** under add tiles and Select the `System Heartbeat` telemetry and select **Add tile**. This telemetry is a heartbeat signal that shows that your device is alive and running. This signal will be charted on a graph.
1. Select the `Upload Image` telemetry and select **Add tile**. This telemetry is an event that will indicated when a file upload has occurred.
1. Select **Save**.

### Forms

1. Select the **Views** node, and then select the **Editing device and cloud data** tile to add a new view.
1. Change the form name to **Upload options**.
1. Select the `Filename Suffix` property and then select **Add section**.
1. Select **Save**.

Now select **Publish** to publish the device template.

### Add a device

To add a device to your Azure IoT Central application:

1. Choose **Devices** on the left pane.

1. Select the device template which you created earlier.

1. Select + **New** and select **Create**.

1. Select the device which you created and Select **Connect**

Copy the values for `ID scope`, `Device ID`, and `Primary key`. You'll use these values in the device sample code.

### Run the sample code

Create an ".env" file at the root of your project and add the values you copied above. The file should look like the sample below with your own values.

```
scopeId=<YOUR_SCOPE_ID>
deviceId=<YOUR_DEVICE_ID>
deviceKey=<YOUR_PRIMARY_KEY>
modelId=dtmi:IoTCentral:IotCentralFileUploadDevice;1
```

Open the git repository you downloaded in VS code. Press F5 to run/debug the sample. In your terminal window you should see that the device is registered and is connected to IoT Central:

```

Starting IoT Central device...
 > Machine: Windows_NT, 8 core, freemem=6674mb, totalmem=16157mb
Starting device registration...
DPS registration succeeded
Connecting the device...
IoT Central successfully connected device: 7z1xo26yd8
Sending telemetry: {
    "TELEMETRY_SYSTEM_HEARTBEAT": 1
}
Sending telemetry: {
    "TELEMETRY_SYSTEM_HEARTBEAT": 1
}
Sending telemetry: {
    "TELEMETRY_SYSTEM_HEARTBEAT": 1
}

```

The sample project comes with a sample file named *datafile.json*. This will be the file that is uploaded when you use the Upload File command in your IoT Central application. 

To test this open your application and select the device you created. Select the Command tab and you should see a button named "Run". When you select that button the IoT Central app will call a direct method on your device to upload the file. You can see this direct method in the sample code in the /device.ts file. The method is named *uploadFileCommand*.

The uploadFileCommand calls a method named uploadFile. This method gets the device setting for the filename suffix to use. By default the built-in file upload feature automatically creates a folder with the same name as your deviceId. This device setting is purely to demonstrate how to communicate property changes to your device from IoT Central. After getting the file name and some information about file to upload the code calls the built-in IoT Hub method deviceClient.uploadToBlob on the device client interface. This uses the IoT Hub file upload feature to stream the file to the associated Azure Blob storage.

## Get the file upload storage account configuration

Use the following request to retrieve details of a storage account configuration:

```http
GET https://{subdomain}.{baseDomain}/api/fileUploads?api-version=1.2-preview
```

The response to this request looks like the following example:

```json
{
  "account": "contoso-account",
  "connectionString": "DefaultEndpointsProtocol=https;AccountName=MyAccountName;AccountKey=*****;BlobEndpoint=core.windows.net",
  "container": "container",
  "state": "succeeded",
  "etag": "\"7502ac89-0000-0300-0000-627eaf100000\""

}
```


## Update the file upload storage account configuration

```http
PATCH https://{subdomain}.{baseDomain}/api/fileUploads?api-version=1.2-preview
```

```json
{
  "account": "contoso-account",
  "connectionString": "DefaultEndpointsProtocol=https;AccountName=MyAccountName;AccountKey=*****;BlobEndpoint=core.windows.net",
  "container": "container2",
  "sasTtl": "PT1H"
}
```

The response to this request looks like the following example:

```json

{
  "account": "contoso-account",
  "connectionString": "DefaultEndpointsProtocol=https;AccountName=MyAccountName;AccountKey=*****;EndpointSuffix=core.windows.net",
  "container": "container",
  "sasTtl": "PT1H",
    "state": "succeeded",
    "etag": "\"7502ac89-0000-0300-0000-627eaf100000\""
```

## Remove the file upload storage account configuration

Use the following request to delete a  storage account configuration:

```http
DELETE https://{subdomain}.{baseDomain}/api/fileUploads?api-version=1.2-preview
```


## Next steps

Now that you've learned how to manage device templates with the REST API, a suggested next step is to [How to create device templates from IoT Central GUI.](howto-set-up-template.md#create-a-device-template)
