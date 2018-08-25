---
title: Deploy, monitor modules for Azure IoT Edge | Microsoft Docs 
description: Manage the modules that run on edge devices
keywords: 
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 07/25/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Deploy and monitor IoT Edge modules at scale using the Azure portal

[!INCLUDE [iot-edge-how-to-deploy-monitor-selector](../../includes/iot-edge-how-to-deploy-monitor-selector.md)]

Azure IoT Edge enables you to move analytics to the edge and provides a cloud interface so that you can manage and monitor your IoT Edge devices without having to physically access each one. The capability to remotely manage devices is increasingly important as Internet of Things solutions are growing larger and more complex. Azure IoT Edge is designed to support your business goals, no matter how many devices you add.

You can manage individual devices and deploy modules to them one at a time. However, if you want to make changes to devices at a large scale, you can create an **IoT Edge automatic deployment**, which is part of Automatic Device Management in IoT Hub. Deployments are dynamic processes that enable you to deploy multiple modules to multiple devices at once, track the status and health of the modules, and make changes when necessary. 

## Identify devices using tags

Before you can create a deployment, you have to be able to specify which devices you want to affect. Azure IoT Edge identifies devices using **tags** in the device twin. Each device can have multiple tags, and you can define them any way that makes sense for your solution. For example, if you manage a campus of smart buildings, you might add the following tags to a device:

```json
"tags":{
    "location":{
        "building": "20",
        "floor": "2"
    },
    "roomtype": "conference",
    "environment": "prod"
}
```

For more information about device twins and tags, see [Understand and use device twins in IoT Hub][lnk-device-twin].

## Create a deployment

1. In the [Azure portal][lnk-portal], go to your IoT hub. 
1. Select **IoT Edge**.
1. Select **Add IoT Edge Deployment**.

There are five steps to create a deployment. The following sections walk through each one. 

### Step 1: Name and Label

1. Give your deployment a unique name that is up to 128 lowercase letters. Avoid spaces and the following invalid characters: `& ^ [ ] { } \ | " < > /`.
1. Add labels to help track your deployments. Labels are **Name**, **Value** pairs that describe your deployment. For example, `HostPlatform, Linux` or `Version, 3.0.1`.
1. Select **Next** to move to step two. 

### Step 2: Add Modules (optional)

There are two types of modules that you can add to a deployment. The first is a module based off of an Azure service, like Storage Account or Stream Analytics. The second is a module based off of your own code. You can add multiple modules of either type to a deployment. 

If you create a deployment with no modules, it removes any current modules from the devices. 

>[!NOTE]
>Azure Machine Learning and Azure Functions don't support the automated Azure service deployment yet. Use the custom module deployment to manually add those services to your deployment. 

To add a module from Azure Stream Analytics, follow these steps:
1. In the **Deployment Modules** section of the page, click **Add**.
1. Select **Azure Stream Analytics module**.
1. Choose your **Subscription** from the drop-down menu.
1. Choose your **Edge job** from the drop-down menu.
1. Select **Save** to add your module to the deployment. 

To add custom code as a module, or to manually add an Azure service module, follow these steps:
1. In the **Registry Settings** section of the page, provide the names and credentials for any private container registries that contain the module images for this deployment. The Edge Agent will report error 500 if it can't find the contrainer registry credential for a docker image.
1. In the **Deployment Modules** section of the page, click **Add**.
1. Select **IoT Edge Module**.
1. Give your module a **Name**.
1. For the **Image URI** field, enter the container image for your module. 
1. Specify any **Container Create Options** that should be passed to the container. For more information, see [docker create][lnk-docker-create].
1. Use the drop-down menu to select a **Restart policy**. Choose from the following options: 
   * **Always** - The module always restarts if it shuts down for any reason.
   * **Never** - The module never restarts if it shuts down for any reason.
   * **On-failed** - The module restarts if it crashes, but not if it shuts down cleanly. 
   * **On-unhealthy** - The module restarts if it crashes or returns an unhealthy status. It's up to each module to implement the health status function. 
1. Use the drop-down menu to select the **Desired Status** for the module. Choose from the following options:
   * **Running** - This is the default option. The module will start running immediately after being deployed.
   * **Stopped** - After being deployed, the module will remain idle until called upon to start by you or another module.
1. Select **Enable** if you want to add any tags or desired properties to the module twin. 
1. Enter **Environment variables** for this module. Environment variables provide supplement information to a module facilitating the configuration process.
1. Select **Save** to add your module to the deployment. 

Once you have all the modules for a deployment configured, select **Next** to move to step three.

### Step 3: Specify Routes (optional)

Routes define how modules communicate with each other within a deployment. By default the wizard gives you a route called **route** and defined as **FROM /* INTO $upstream**, which means that any messages output by any modules are sent to your IoT hub.  

Add or update the routes with information from [Declare routes](module-composition.md#declare-routes), then select **Next** to continue to the review section.


### Step 4: Target Devices

Use the tags property from your devices to target the specific devices that should receive this deployment. 

Since multiple deployments may target the same device, you should give each deployment a priority number. If there's ever a conflict, the deployment with the highest priority (higher values indicate higher priority) wins. If two deployments have the same priority number, the one that was created most recently wins. 

1. Enter a positive integer for the deployment **Priority**. In the event that two or more deployments are targeted at the same device, the deployment with the highest numerical value for Priority will apply.
1. Enter a **Target condition** to determine which devices will be targeted with this deployment. The condition is based on device twin tags or device twin reported properties and should match the expression format. For example, `tags.environment='test'` or `properties.reported.devicemodel='4000x'`. 
1. Select **Next** to move on to the final step.

### Step 5: Review Template

Review your deployment information, then select **Submit**.

## Monitor a deployment

To view the details of a deployment and monitor the devices running it, use the following steps:

1. Sign in to the [Azure portal][lnk-portal] and navigate to your IoT hub. 
1. Select **IoT Edge**.
1. Select **IoT Edge deployments**. 

   ![View IoT Edge deployments][1]

1. Inspect the deployment list. For each deployment, you can view the following details:
   * **ID** - the name of the deployment.
   * **Target condition** - the tag used to define targeted devices.
   * **Priority** - the priority number assigned to the deployment.
   * **System metrics** - **Targeted** specifies the number of device twins in IoT Hub that match the targeting condition, and **Applied** specifies the number of devices that have had the deployment content applied to their module twins in IoT Hub. 
   * **Device metrics** - the number of Edge devices in the deployment reporting success or errors from the IoT Edge client runtime.
   * **Creation time** - the timestamp from when the deployment was created. This timestamp is used to break ties when two deployments have the same priority. 
2. Select the deployment that you want to monitor.  
3. Inspect the deployment details. You can use tabs to review the details of the deployment.

## Modify a deployment

When you modify a deployment, the changes immediately replicate to all targeted devices. 

If you update the target condition, the following updates occur:
* If a device didn't meet the old target condition, but meets the new target condition and this deployment is the highest priority for that device, then this deployment is applied to the device. 
* If a device currently running this deployment no longer meets the target condition, it uninstalls this deployment and takes on the next highest priority deployment. 
* If a device currently running this deployment no longer meets the target condition and doesn't meet the target condition of any other deployments, then no change occurs on the device. The device continues running its current modules in their current state, but is not managed as part of this deployment anymore. Once it meets the target condition of any other deployment, it uninstalls this deployment and takes on the new one. 

To modify a deployment, use the following steps: 

1. Sign in to the [Azure portal][lnk-portal] and navigate to your IoT hub. 
1. Select **IoT Edge**.
1. Select **IoT Edge deployments**. 

   ![View IoT Edge deployments][1]

1. Select the deployment that you want to modify. 
1. Make updates to the following fields: 
   * Target condition 
   * Labels 
   * Priority 
1. Select **Save**.
1. Follow the steps in [Monitor a deployment][anchor-monitor] to watch the changes roll out. 

## Delete a deployment

When you delete a deployment, any devices take on their next highest priority deployment. If your devices don't meet the target condition of any other deployment, then the modules are not removed when the deployment is deleted. 

1. Sign in to the [Azure portal][lnk-portal] and navigate to your IoT hub. 
1. Select **IoT Edge**.
1. Select **IoT Edge deployments**. 

   ![View IoT Edge deployments][1]

1. Use the checkbox to select the deployment that you want to delete. 
1. Select **Delete**.
1. A prompt will inform you that this action will delete this deployment and revert to the previous state for all devices.  This means that a deployment with a lower priority will apply.  If no other deployment is targeted, no modules will be removed. If you want to remove all modules from your device, create a deployment with zero modules and deploy it to the same devices. Select **Yes** to continue. 

## Next steps

Learn more about [Deploying modules to Edge devices][lnk-deployments].

<!-- Images -->
[1]: ./media/how-to-deploy-monitor/iot-edge-deployments.png

<!-- Links -->
[lnk-device-twin]: ../iot-hub/iot-hub-devguide-device-twins.md
[lnk-portal]: https://portal.azure.com
[lnk-docker-create]: https://docs.docker.com/engine/reference/commandline/create/
[lnk-deployments]: module-deployment-monitoring.md

<!-- Anchor links -->
[anchor-monitor]: #monitor-a-deployment
