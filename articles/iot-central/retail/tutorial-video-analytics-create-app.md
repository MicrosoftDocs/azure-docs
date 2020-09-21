---
title: 'Tutorial - Create a video analytics - object and motion detection application in Azure IoT Central'
description: This tutorial shows how to create a video analytics application in IoT Central. You create it, customize it, and connect it to other Azure services.
services: iot-central
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: tutorial
author: KishorIoT
ms.author: nandab
ms.date: 07/31/2020
---
# Tutorial: Create a video analytics - object and motion detection application in Azure IoT Central

As a solution builder, learn how to create a video analytics application with the IoT Central *video analytics - object and motion detection* application template, Azure IoT Edge devices, and Azure Media Services. The solution uses a retail store to show how to meet the common business need to monitor security cameras. The solution uses automatic object detection in a video feed to quickly identify and locate interesting events.

The sample application includes two simulated devices and one IoT Edge gateway. The following tutorials show two approaches to experiment with and understand the capabilities of the gateway:

* Create the IoT Edge gateway in an Azure VM and connect a simulated camera.
* Create the IoT Edge gateway on a real device such as an Intel NUC and connect a real camera.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Use the Azure IoT Central video analytics application template to create a retail store application
> * Customize the application settings
> * Create a device template for an IoT Edge gateway device
> * Add a gateway device to your IoT Central application

## Prerequisites

To complete this tutorial series, you need:

* An Azure subscription. If you don't have an Azure subscription, you can create one on the [Azure sign-up page](https://aka.ms/createazuresubscription).
* If you're using a real camera, you need connectivity between the IoT Edge device and the camera, and you need the **Real Time Streaming Protocol** channel.

## Initial setup

In these tutorials, you update and use several configuration files. Initial versions of these files are available in the [LVA-gateway](https://github.com/Azure/live-video-analytics/tree/master/ref-apps/lva-edge-iot-central-gateway) GitHub repository. The repository also includes a scratchpad text file for you to download and use to record configuration values from the services you deploy.

Create a folder called *lva-configuration* on your local machine to save copies of these files. Then right-click on each of the following links and choose **Save as** to save the file into the *lva-configuration* folder:

- [Scratchpad.txt](https://raw.githubusercontent.com/Azure/live-video-analytics/master/ref-apps/lva-edge-iot-central-gateway/setup/Scratchpad.txt)
- [deployment.amd64.json](https://raw.githubusercontent.com/Azure/live-video-analytics/master/ref-apps/lva-edge-iot-central-gateway/setup/deployment.amd64.json)
- [LvaEdgeGatewayDcm.json](https://raw.githubusercontent.com/Azure/live-video-analytics/master/ref-apps/lva-edge-iot-central-gateway/setup/LvaEdgeGatewayDcm.json)
- [state.json](https://raw.githubusercontent.com/Azure/live-video-analytics/master/ref-apps/lva-edge-iot-central-gateway/setup/state.json)

> [!NOTE]
> The GitHub repository also includes the source code for the **LvaEdgeGatewayModule** and **lvaYolov3** IoT Edge modules. For more information about working with the source code, see the [Build the LVA Gateway Modules](tutorial-video-analytics-build-module.md).

## Deploy and configure Azure Media Services

The solution uses an Azure Media Services account to store the object detection video clips made by the IoT Edge gateway device.

When you create the Media Services account:

- You need to provide an account name, an Azure subscription, a location, a resource group, and a storage account. Create a new storage account using the default settings while you're creating the Media Services account.

- Choose the **East US** region for the location.

- Create a new resource group called *lva-rg* in the **East US** region for the Media Services and storage accounts. When you finish the tutorials, it's easy to remove all the resources by deleting the *lva-rg* resource group.

Create the [Media Services account in the Azure portal](https://portal.azure.com/?r=1#create/Microsoft.MediaService).

> [!TIP]
> These tutorials use the **East US** region in all the examples. You can use your closest region if you prefer.

Make a note of your **Media Services** account name in the *scratchpad.txt* file.

When the deployment is complete, navigate to the **Properties** page for your **Media Services** account. Make a note of the **Resource ID** in the *scratchpad.txt* file, you use this value later when you configure the IoT Edge module.

Next, configure an Azure Active Directory service principal for your Media Services resource. Select **API access** and then **Service principal authentication**. Create a new Azure Active Directory app with the same name as your Media Services resource, and create a secret with a description *IoT Edge Access*.

:::image type="content" source="./media/tutorial-video-analytics-create-app/media-service-authentication.png" alt-text="Configure AAD app for AMS":::

When the secret is generated, scroll down to the **Copy your credentials to connect your service principal application** section. Then select **JSON**. You can copy all the credential information from here in one go. Make a note of this information in the *scratchpad.txt* file, you use it later when you configure the IoT Edge device.

> [!WARNING]
> This is your only chance to view and save the secret. If you lose it, you have to generate another secret.

## Create the Azure IoT Central application

In this section, you create a new Azure IoT Central application from a template. You use this application throughout the tutorial series to build a complete solution.

To create a new Azure IoT Central application:

1. Navigate to the [Azure IoT Central application manager](https://aka.ms/iotcentral) website.

1. Sign in with the credentials you use to access your Azure subscription.

1. To start creating a new Azure IoT Central application, select **New Application** on the **Build** page.

1. Select **Retail**. The retail page displays several retail application templates.

To create a new video analytics application:

1. Select the **Video analytics - object and motion detection** application template. This template includes device templates for the devices used in the tutorial. The template includes sample dashboards that operators can use to perform tasks such as monitoring and managing cameras.

1. Optionally, choose a friendly **Application name**. This application is based on a fictional retail store named Northwind Traders. The tutorial uses the **Application name** *Northwind Traders video analytics*.

    > [!NOTE]
    > If you use a friendly **Application name**, you must still use a unique value for the application **URL**.

1. If you have an Azure subscription, select your **Directory**, **Azure subscription**, and **United States** as the **Location**. If you don't have a subscription, you can enable **7-day free trial** and complete the required contact information. This tutorial uses three devices - two cameras and an IoT Edge device - so if you don't use the free trial you'll be billed for usage.

    For more information about directories, subscriptions, and locations, see the [create an application quickstart](../core/quick-deploy-iot-central.md).

1. Select **Create**.

    :::image type="content" source="./media/tutorial-video-analytics-create-app/new-application.png" alt-text="Azure IoT Central Create Application page":::

### Retrieve the configuration data

Later in this tutorial when you configure the IoT Edge gateway, you need some configuration data from the IoT Central application. The IoT Edge device needs this information to register with, and connect to, the application.

In the **Administration** section, select **Your application** and make a note of the **Application URL** and the **Application ID** in the *scratchpad.txt* file:

:::image type="content" source="./media/tutorial-video-analytics-create-app/administration.png" alt-text="Administration":::

Select **API Tokens** and generate a new token called **LVAEdgeToken** for the **Operator** role:

:::image type="content" source="./media/tutorial-video-analytics-create-app/token.png" alt-text="Generate Token":::

Make a note of the token in the *scratchpad.txt* file for later. After the dialog closes you can't view the token again.

In the **Administration** section, select **Device connection**, and then select **SAS-IoT-Devices**.

Make a note of the **Primary key** for devices in the *scratchpad.txt* file. You use this *primary group shared access signature token* later when you configure the IoT Edge device.

## Edit the deployment manifest

You deploy an IoT Edge module using a deployment manifest. In IoT Central you can import the manifest as a device template, and then let IoT Central manage the module deployment.

To prepare the deployment manifest:

1. Open the *deployment.amd64.json* file, which you saved in the *lva-configuration* folder, using a text editor.

1. Find the `LvaEdgeGatewayModule` settings and change the image name as shown in the following snippet:

    ```json
    "LvaEdgeGatewayModule": {
        "settings": {
            "image": "mcr.microsoft.com/lva-utilities/lva-edge-iotc-gateway:1.0-amd64",
    ```

1. Add the name of your Media Services account in the `env` node in the `LvaEdgeGatewayModule` section. You made a note of this account name in the *scratchpad.txt* file:

    ```json
    "env": {
        "lvaEdgeModuleId": {
            "value": "lvaEdge"
        },
        "amsAccountName": {
            "value": "<YOUR_AZURE_MEDIA_ACCOUNT_NAME>"
        }
    }
    ```

1. The template doesn't expose these properties in IoT Central, so you need to add the Media Services configuration values to the deployment manifest. Locate the `lvaEdge` module and replace the placeholders with the values you made a note of in the *scratchpad.txt* file when you created your Media Services account.

    The `azureMediaServicesArmId` is the **Resource ID** you made a note of in the *scratchpad.txt* file when you created the Media Services account.

    You made a note of the `aadTenantId`, `aadServicePrincipalAppId`, and `aadServicePrincipalSecret` in the *scratchpad.txt* file when you created the service principal for your Media Services account:

    ```json
    {
        "lvaEdge":{
        "properties.desired": {
            "applicationDataDirectory": "/var/lib/azuremediaservices",
            "azureMediaServicesArmId": "[Resource ID from scratchpad]",
            "aadTenantId": "[AADTenantID from scratchpad]",
            "aadServicePrincipalAppId": "[AadClientId from scratchpad]",
            "aadServicePrincipalSecret": "[AadSecret from scratchpad]",
            "aadEndpoint": "https://login.microsoftonline.com",
            "aadResourceId": "https://management.core.windows.net/",
            "armEndpoint": "https://management.azure.com/",
            "diagnosticsEventsOutputName": "AmsDiagnostics",
            "operationalMetricsOutputName": "AmsOperational",
            "logCategories": "Application,Event",
            "AllowUnsecuredEndpoints": "true",
            "TelemetryOptOut": false
            }
        }
    }
    ```

1. Save the changes.

Optionally, you can replace the Yolov3 module with the hardware-optimized [OpenVINO&trade; Model Server – Edge AI Extension Module](https://github.com/openvinotoolkit/model_server/tree/ams/extras/ams_wrapper) from Intel. You can download a sample deployment manifest [deployment.openvino.amd64.json](https://raw.githubusercontent.com/Azure/live-video-analytics/master/ref-apps/lva-edge-iot-central-gateway/setup/deployment.openvino.amd64.json). This manifest replaces the configuration settings for the `lvaYolov3` module with the following configuration:

```json
"OpenVINOModelServerEdgeAIExtensionModule": {
    "settings": {
        "image": "marketplace.azurecr.io/intel_corporation/open_vino",
        "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"4000/tcp\":[{\"HostPort\":\"4000\"}]}},\"Cmd\":[\"/ams_wrapper/start_ams.py\",\"--ams_port=4000\",\"--ovms_port=9000\"]}"
    },
    "type": "docker",
    "version": "1.0",
    "status": "running",
    "restartPolicy": "always"
}
```

## Create the Azure IoT Edge gateway device

The video analytics - object and motion detection application includes an **LVA Edge Object Detector** device template and an **LVA Edge Motion Detection** device template. In this section, you create a gateway device template using the deployment manifest, and add the gateway device to your IoT Central application.

### Create a device template for the LVA Edge Gateway

To import the deployment manifest and create the **LVA Edge Gateway** device template:

1. In your IoT Central application, navigate to **Device Templates**, and select **+ New**.

1. On the **Select template type** page, select the **Azure IoT Edge** tile. Then select **Next: Customize**.

1. On the **Upload an Azure IoT Edge deployment manifest** page, enter *LVA Edge Gateway* as the template name, and check **Gateway device with downstream devices**.

    Don't browse for the deployment manifest yet. If you do, the deployment wizard expects an interface for each module, but you only need to expose the interface for the **LvaEdgeGatewayModule**. You upload the manifest in a later step.

    :::image type="content" source="./media/tutorial-video-analytics-create-app/upload-deployment-manifest.png" alt-text="Don't upload deployment manifest":::

    Select **Next: Review**.

1. On the **Review** page, select **Create**.

### Import the device capability model

The device template must include a device capability model. On the **LVA Edge Gateway** page, select the **Import capability model** tile. Navigate to the *lva-configuration* folder you created previously and select the *LvaEdgeGatewayDcm.json* file.

The **LVA Edge Gateway** device template now includes the **LVA Edge Gateway Module** along with three interfaces: **Device information**, **LVA Edge Gateway Settings**, and **LVA Edge Gateway Interface**.

### Replace the manifest

On the **LVA Edge Gateway** page, select **+ Replace manifest**.

:::image type="content" source="./media/tutorial-video-analytics-create-app/replace-manifest.png" alt-text="Replace Manifest":::

Navigate to the *lva-configuration* folder and select the *deployment.amd64.json* manifest file you edited previously. Select **Upload**. When the validation is complete, select **Replace**.

### Add relationships

In the **LVA Edge Gateway** device template, under **Modules/LVA Edge Gateway Module**, select **Relationships**. Select **+ Add relationship** and add the following two relationships:

|Display Name               |Name          |Target |
|-------------------------- |------------- |------ |
|LVA Edge Motion Detector   |Use default   |LVA Edge Motion Detector Device |
|LVA Edge Object Detector   |Use default   |LVA Edge Object Detector Device |

Then select **Save**.

:::image type="content" source="media/tutorial-video-analytics-create-app/relationships.png" alt-text="Add relationships":::

### Add views

The **LVA Edge Gateway** device template doesn't include any view definitions.

To add a view to the device template:

1. In the **LVA Edge Gateway** device template, navigate to **Views** and select the **Visualizing the device** tile.

1. Enter *LVA Edge Gateway device* as the view name.

1. Add the following tiles to the view:

    * A tile with the **Device Info** properties: **Device model**, **Manufacturer**, **Operating system**, **Processor architecture**, **Software version**, **Total memory**, and **Total storage**.
    * A line chart tile with the **Free Memory** and the **System Heartbeat** telemetry values.
    * An event history tile with the following events: **Create Camera**, **Delete Camera**, **Module Restart**, **Module Started**, **Module Stopped**.
    * A 2x1 last known value tile showing the **IoT Central Client State** telemetry.
    * A 2x1 last known value tile showing the **Module State** telemetry.
    * A 1x1 last known value tile showing the **System Heartbeat** telemetry.
    * A 1x1 last known value tile showing the **Connected Cameras** telemetry.

    :::image type="content" source="media/tutorial-video-analytics-create-app/gateway-dashboard.png" alt-text="Dashboard":::

1. Select **Save**.

### Publish the device template

Before you can add a device to the application, you must publish the device template:

1. In the **LVA Edge Gateway** device template, select **Publish**.

1. On the **Publish this device template to the application** page, select **Publish**.

**LVA Edge Gateway** is now available as device type to use on the **Devices** page in the application.

## Add a gateway device

To add an **LVA Edge Gateway** device to the application:

1. Navigate to the **Devices** page and select the **LVA Edge Gateway** device template.

1. Select **+ New**.

1. In the **Create a new device** dialog, change the device name to *LVA Gateway 001*, and change the device ID to *lva-gateway-001*.

    > [!NOTE]
    > The device ID must be unique in the application.

1. Select **Create**.

The device status is **Registered**.

### Get the device credentials

You need the credentials that allow the device to connect to your IoT Central application. The get the device credentials:

1. On the **Devices** page, select the **lva-gateway-001** device you created.

1. Select **Connect**.

1. On the **Device connection** page, make a note in the *scratchpad.txt* file of the **ID Scope**, the **Device ID**, and the device **Primary Key**. You use these values later.

1. Make sure the connection method is set to **Shared access signature**.

1. Select **Close**.

## Next steps

You've now created an IoT Central application using the **Video analytics - object and motion detection** application template, created a device template for the gateway device, and added a gateway device to the application.

If you want to try out the video analytics - object and motion detection application using IoT Edge modules running a cloud VM with simulated video streams:

> [!div class="nextstepaction"]
> [Create an IoT Edge instance for video analytics (Linux VM)](./tutorial-video-analytics-iot-edge-vm.md)

If you want to try out the video analytics - object and motion detection application using IoT Edge modules running a real device with real **ONVIF** camera:

> [!div class="nextstepaction"]
> [Create an IoT Edge instance for video analytics (Intel NUC)](./tutorial-video-analytics-iot-edge-nuc.md)
