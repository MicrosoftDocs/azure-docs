---
title: Define a new device type in Azure IoT Central | Microsoft Docs
description: This tutorial shows you, as a builder, how to create a new device type in your Azure IoT Central application. You define the telemetry, state, properties, and commands for your type.
author: dominicbetts
ms.author: dobett
ms.date: 08/06/2019
ms.topic: tutorial
ms.service: iot-central
services: iot-central
ms.custom: mvc
manager: philmea
---

# Tutorial: Define a new device type in your Azure IoT Central application (preview features)

[!INCLUDE [iot-central-pnp-original](../../includes/iot-central-pnp-original-note.md)]

This tutorial shows you, as a builder, how to use a device template to define a new type of Azure IoT Edge device in your Microsoft Azure IoT Central application. 

Azure IoT Edge is made up of three components:
* IoT Edge modules are containers that run Azure services, third-party services, or your own code. Modules are deployed to IoT Edge devices and execute locally on those devices.
* The IoT Edge runtime runs on each IoT Edge device and manages the modules deployed to each device.
* A cloud-based interface enables you to remotely monitor and manage IoT Edge devices. IoT Central will be the cloud interface.

A device template defines the capabilities of your device & IoT Edge modules. Capabilities include telemetry the module sends, module properties, and the commands a module responds to.

In this tutorial, you create an **Environment Sensor** device template. An environmental sensor device:

* Sends telemetry such as temperature.
* Responds to writeable properties when updated in the cloud such as telemetry send interval.
* Responds to commands such as resetting temperature.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a new device template.
> * Upload a deployment manifest.
> * Create capabilities including telemetry, properties and commands for each module
> * Define a visualization for the module telemetry.
> * Publish your device template.
> * Create a real device for your device template.
> * View your real device.

## Prerequisites

To complete this tutorial, you need an Azure IoT Central application. If you completed the [Create an Azure IoT Central application](quick-deploy-iot-central-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) quickstart, you can reuse the application you created in the quickstart. Otherwise, complete the following steps to create an empty Azure IoT Central application:

1. [Visual Studio Code](https://code.visualstudio.com/).
2. [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools#overview) for Visual Studio Code.
  
3. Navigate to the [Azure IoT Central application manager](https://aka.ms/iotcentral) website.

4. If you have an Azure subscription, sign in with the credentials you use to access it, otherwise sign it using a Microsoft account:

    ![Enter your organization account](./media/tutorial-define-device-type-pnp/sign-in.png)

5. To start creating a new Azure IoT Central application, select **New Application**.

To create a new Azure IoT Central application that uses preview features, including IoT Plug and Play:

1. Choose **Trial**. You don't need an Azure subscription to create a trial application.

    For more information about directories and subscriptions, see the [create an application quickstart](quick-deploy-iot-central-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).

1. Choose **Preview application**.

1. Optionally you can choose a friendly application name, such as **Contoso Air Conditioners**. Azure IoT Central generates a unique URL prefix for you. You can change this URL prefix to something more memorable.

1. If you're creating a trial application, you need to provide your contact details.

1. Select **Create**.

    ![Azure IoT Central Create Application page](./media/tutorial-define-device-type-pnp/iotcentralcreate.png)

    For more information, see the [create an application quickstart](quick-deploy-iot-central-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).

You also need a local copy of the **environment-sensor-deployment-manifest.json**. You can download it from [here](./example-files/environment-sensor-deployment-manifest.json). Right-click on the page and select **Save as**.

After you download the file, open it in a text editor, and replace the two instances of `<YOUR_COMPANY_NAME_HERE>` with your name. Use only the characters a-z, A-Z, 0-9, and underscore.

## Create a template

As a builder, you can create and edit Azure IoT Edge device templates in your application. After you publish a device template, you can connect real devices that implement the device template.

### Select Device Template Type 

To add a new device template to your application, go to the **Device Templates** page. To do so select the **Device Templates** tab on the left navigation menu.

![Central Application page](./media/tutorial-define-edge-as-leaf-device-type-pnp/edgedevicetemplate.png)

Click **+ New** to start creating a new device template.

![Device Templates - New](./media/tutorial-define-edge-as-leaf-device-type-pnp/edgedevicetemplatenew.png)

You will land on device template type selection page.

![Device Templates Selection](./media/tutorial-define-edge-as-leaf-device-type-pnp/selecttemplatetype.png)

Select **Azure IoT Edge** Tile and click **Next: Customize** button at the bottom

![Device Templates Selection - Azure IoT Edge](./media/tutorial-define-edge-as-leaf-device-type-pnp/selectiotedge.png)

### Customize Device Template

Azure IoT Edge lets you deploy and manage business logic on the edge in the form of modules. Azure IoT Edge modules are the smallest unit of computation managed by IoT Edge, and can contain Azure services (such as Azure Stream Analytics) or your own solution-specific code. To understand how modules are developed, deployed, and maintained read the documentation from here: [IoT Edge Modules](https://docs.microsoft.com/en-us/azure/iot-edge/iot-edge-modules).

At a high level, a deployment manifest is a list of module twins that are configured with their desired properties. A deployment manifest tells an IoT Edge device (or a group of devices) which modules to install and how to configure them. Deployment manifests include the desired properties for each module twin. IoT Edge devices report back the reported properties for each module.

Use Visual Studio Code to create a deployment manifest. Documentation on how to create a deployment manifest can be found here: [VSCode Documentation](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge)

Here's a basic deployment manifest with one module as an example to be used for this tutorial. Copy the below JSON and save it as .json file. 

   ```json
   {
     "modulesContent": {
       "$edgeAgent": {
         "properties.desired": {
           "schemaVersion": "1.0",
           "runtime": {
             "type": "docker",
             "settings": {
               "minDockerVersion": "v1.25",
               "loggingOptions": "",
               "registryCredentials": {}
             }
           },
           "systemModules": {
             "edgeAgent": {
               "type": "docker",
               "settings": {
                 "image": "mcr.microsoft.com/azureiotedge-agent:1.0",
                 "createOptions": "{}"
               }
             },
             "edgeHub": {
               "type": "docker",
               "status": "running",
               "restartPolicy": "always",
               "settings": {
                 "image": "mcr.microsoft.com/azureiotedge-hub:1.0",
                 "createOptions": "{}"
               }
             }
           },
           "modules": {
             "SimulatedTemperatureSensor": {
               "version": "1.0",
               "type": "docker",
               "status": "running",
               "restartPolicy": "always",
               "settings": {
                 "image": "mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0",
                 "createOptions": "{}"
               }
             }
           }
         }
       },
       "$edgeHub": {
         "properties.desired": {
           "schemaVersion": "1.0",
           "routes": {
               "route": "FROM /* INTO $upstream"
           },
           "storeAndForwardConfiguration": {
             "timeToLiveSecs": 7200
           }
         }
       },
       "SimulatedTemperatureSensor": {
         "properties.desired": {}
       }
     }
   }
   ```

##### Upload an Azure IoT Edge deployment manifest

Click  **Browse** button 

![Device Template - Azure IoT Edge](./media/tutorial-define-edge-as-leaf-device-type-pnp/edgedevicetemplateuploadmanifest.png)

You will be presented with a file selection dialog. Select the deployment manifest file and click **Open** button.

![Device Template - Azure IoT Edge](./media/tutorial-define-edge-as-leaf-device-type-pnp/deploymentmanifestupload.png)

Deployment Manifest file will be validated against a schema. After successful validation click on **Review** button.

![Device Template - Azure IoT Edge](./media/tutorial-define-edge-as-leaf-device-type-pnp/deploymentmanifestvalidate.png)

Review page is displayed with details of the deployment manifest. List of modules from the deployment manifest will be displayed on the review page. In this tutorial you will see SimulatedTemperatureSensor module listed. Click **Create** button.

![Device Template - Azure IoT Edge](./media/tutorial-define-edge-as-leaf-device-type-pnp/edgedevicetemplatereview.png)

Creating a new device template spinner will be displayed which the device template is being created in IoT Central.

![Device Template - Azure IoT Edge](./media/tutorial-define-edge-as-leaf-device-type-pnp/edgedevicetemplatecreatingtemplate.png)

Device template is created with module capability models. In this tutorial you will see SimulatedTemperatureSensor module capability model create. 

Change title of the device template to Environment Sensor Device Template.

![Device Template - Azure IoT Edge](./media/tutorial-define-edge-as-leaf-device-type-pnp/edgedevicetemplatelanding.png)

Edge Device Plug n Play modeling is done as follows
* Every edge device template will have a **Device Capability Model**
* For every custom module listed in the deployment manifest a **Module Capability Model** will be generated
* A **relationship** will be established between each Module Capability Model and a Device Capability Model
* Module capability model implements **module interfaces**
* Each module interface contains
  1. Telemetry
  2. Properties
  3. Commands

![Device Template - Azure IoT Edge](./media/tutorial-define-edge-as-leaf-device-type-pnp/edgemodelling.png)

##### Add Capabilities to Module Capability Model

Here is a sample output from SimulatedTemperatureSensor module
```json
{

	"machine": {

		"temperature": 75.0,
		"pressure": 40.2
	},
	"ambient": {
		"temperature": 23.0,
		"humidity": 30.0
	},
	"timeCreated": ""
}
```

Add capabilities to SimulatedTemperatureSensor module which will reflect the above JSON. 

* Click **Manage** an interface of SimulatedTemperatureSensor module capability model. Click **Add Capability**. 

    ![Device Template - Azure IoT Edge](./media/tutorial-define-edge-as-leaf-device-type-pnp/edgetemplateaddcapability.png)
  
* Add machine as an Object type since its a complex type
  
    ![Device Template - Azure IoT Edge](./media/tutorial-define-edge-as-leaf-device-type-pnp/edgetemplatemachineobject.png)

    Click **Define**. In the popup modal change object name to machine and create properties temperature, pressure and click **Apply**
  
    ![Device Template - Azure IoT Edge](./media/tutorial-define-edge-as-leaf-device-type-pnp/edgetemplatemachineattributes.png)
  
* Add ambient as an Object type since its a complex type

    Click **Define**. In the popup modal change object name to ambient and create properties temperature, humidity and click **Apply**
  
    ![Device Template - Azure IoT Edge](./media/tutorial-define-edge-as-leaf-device-type-pnp/edgetemplateambientattributes.png)

  
* Add timeCreated as a DateTime type and click **Save**
  
    ![Device Template - Azure IoT Edge](./media/tutorial-define-edge-as-leaf-device-type-pnp/edgetemplateallattributes.png)

### Add cloud properties

A device template can include cloud properties. Cloud properties only exist in the IoT Central application and are never sent to, or received from, a device.

1. Select **Cloud Properties** and then **+ Add Cloud Property**. Use the information in the following table to add a cloud property to your device template.

    | Display Name      | Semantic Type | Schema |
    | ----------------- | ------------- | ------ |
    | Last Service Date | None          | Date   |
    | Customer name     | None          | String |

2. Select **Save** to save your changes:

  
    ![Cloud Properties - Azure IoT Edge](./media/tutorial-define-edge-as-leaf-device-type-pnp/edgetemplatecloudproperties.png)

### Add customizations

Use customizations when you need to modify an interface or add IoT Central-specific features to a capability that doesn't require you to version your device capability model. You can customize fields when the capability model is in a draft or published state. You can only customize fields that don't break interface compatibility. For example, you can:

- Customize the display name and units of a capability.
- Add a default color to use when the value appears on a chart.
- Specify initial, minimum, and maximum values for a property.

You can't customize the capability name or capability type. Click **Save**
  
![Customizations - Azure IoT Edge](./media/tutorial-define-edge-as-leaf-device-type-pnp/edgetemplatecustomize.png)


## Create views

As a builder, you can customize the application to display relevant information about the environmental sensor device to an operator. Your customizations enable the operator to manage the environmental sensor devices connected to the application. You can create two types of views for an operator to use to interact with devices:

* Forms to view and edit device and cloud properties.
* Dashboards to visualize devices.

### Configure a view to visualize devices

A device dashboard lets an operator visualize a device using charts and metrics. As a builder, you can define what information displays on a device dashboard. You can define multiple dashboards for devices. To create a dashboard to visualize the environmental sensor telemetry, select **Views** and then **Visualizing the Device**:

1. All of the device properties, cloud properties, telemetry, and static options are listed under **Properties**. You can drag and drop any of these items out into the view. Drag the **Brightness Level** property to the view. You can configure the tile using the gear icon.

1. To add a chart that plots telemetry, select **Humidity** and **Temperature**, and then select **Combine**. To view this chart in a different format, such as a pie chart or bar chart, select the **Change Visualization** button at the top of the tile.

1. Select **Save** to save your view:

You can add more tiles that show other properties or telemetry values. You can also add static text, links, and images. To move or resize a tile on the dashboard, move the mouse pointer over the tile and drag the tile to a new location or resize it.

### Add a device form

A device form lets an operator edit writeable device properties and cloud properties. As a builder, you can define multiple forms and choose which device and cloud properties to show on each form. You can also display read-only device properties on a form.

To create a form to view and edit environmental sensor properties:

1. Navigate to **Views** in the **Environmental Sensor** template. Select the **Editing Device and Cloud data** tile to add a new view.

1. Enter the form name **Environmental Sensor properties**.

1. Drag the **Customer name** and **Last service date** cloud properties onto the existing section on the form.

1. Select the **Brightness Level** and **Device State**  device properties. Then select **Add Section**. Edit the title of the section to be **Sensor properties**. Select **Apply**.

1. Select the **Device model**, **Software version**, **Manufacturer**, and **Processor manufacturer** device properties. Then select **Add Section**. Edit the title of the section to be **Device properties**. Select **Apply**.

1. Select **Save** to save your view.

### Generate default views

Generating default views is a quick way to get started with visualizing your important device information. You can have up to three default views generated for your device template:

* The **Commands** view lets your operator dispatch commands to your device.
* The **Overview** view uses charts and metrics to display device telemetry.
* The **About** view displays device properties.

After you select **Generate default views**, they're automatically added under the **Views** section of your device template.

## Publish device template

Before you can create a simulated environmental sensor, or connect a real environmental sensor, you need to publish your device template.

To publish a device template:

1. Go to your device template from the **Device Templates** page.

1. Select **Publish**.

1. On the **Publish a Device Template** dialog, choose **Publish**:

    ![Published model](media/tutorial-define-device-type-pnp/publishedmodel.png)

After a device template is published, it's visible on the **Devices** page and to the operator. In a published device template, you can't edit a device capability model without creating a new version. However, you can make updates to cloud properties, customizations, and views, in a published device template without versioning. After making any changes, select **Publish**  to push those changes out to your operator.

## Next steps

In this tutorial, you learned how to:

* Create a new device template
* Import a device capability model.
* Create cloud properties.
* Create customizations.
* Define a visualization for the device telemetry.
* Publish your device template.

Now that you've created a device template in your Azure IoT Central application, here is the suggested next step:

> [!div class="nextstepaction"]
> [Add device](tutorial-add-device-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json)
