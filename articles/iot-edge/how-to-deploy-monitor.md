---
title: Deploy, monitor modules for Azure IoT Edge | Microsoft Docs 
description: Manage the modules that run on edge devices
services: iot-edge
keywords: 
author: kgremban
manager: timlt

ms.author: kgremban
ms.date: 10/05/2017
ms.topic: article
ms.service: iot-edge

---

# Deploy and monitor IoT Edge modules at scale

Azure IoT Edge enables you to move analytics to the edge and provides a cloud interface so that you can manage and monitor your IoT Edge devices without having to physically access each one. The capability to remotely manage devices is increasingly important as Internet of Things solutions are growing larger and more complex. Azure IoT Edge is designed to support your business goals, no matter how many devices you add.

You can manage individual devices and deploy modules to them one at a time. However, if you want to make changes to devices at a large scale, you can create an **IoT Edge deployment**. Deployments are dynamic processes that enable you to deploy multiple modules to multiple devices at once, track the status and health of the modules, and make changes when necessary. 

## Identify devices using tags

Before you can create a deployment, you have to be able to specify which devices you want to affect. Azure IoT Edge identifies devices using **tags** in the device twin. Each device can have multiple tags, and you can define them any way that makes sense for your solution. For example, if you manage a campus of smart buildings, you may add the following tags to a device:

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

1. Sign in to the [Azure portal][lnk-portal] and navigate to your IoT hub. 
1. Select **IoT Edge Explorer**.
1. Select **Create Edge Deployment**.

There are five steps to create a deployment. The following sections walk through each one. 

### Step 1: Label deployment

1. Give your deployment a unique ID. Avoid spaces and the following invalid characters: `& ^ [ ] { } \ | " < > /`.
1. Add labels to help track your deployments. Labels are **Name**, **Value** pairs that describe your deployment. For example, `HostPlatform, Linux` or `Version, 3.0.1`.
1. Select **Next** to move to step two. 

### Step 2: Add modules

There are two types of modules that you can add to a deployment. The first is a module based off of an Azure service, like Storage Account or Stream Analytics. The second is a module based off of your own code. You can add multiple modules of either type to a deployment. 

>[!NOTE]
>Azure Machine Learning and Azure Functions don't support the automated Azure servive deployment yet. Use the custom module deployment to manually add those services to your deployment. 

To add a module from an Azure service follow these steps:
1. Select **Add Azure service IoT Edge module**.
1. Use the drop-down menus to select the Azure service instances that you want to deploy.
1. Select **Save** to add your modules to the deployment. 

To add custom code as a module, or to manually add an Azure service module, follow these steps:
1. Select **Add custom IoT Edge module**.
1. Give your module a **Name**.
1. For the **Image** field, enter the Docker container image for this module. For example, `edgepreview.azurecr.io/azureiotedge/simulated-temperature-sensor:latest`.
1. Use the drop-down menus under **OS** and **Architecture** to identify the properties of the Docker container that represents this module. 
1. Specify any **Create options** that should be passed to the container. For more information, see [docker create][lnk-docker-create].
1. Use the drop-down menu to select a **Restart policy**. Choose from the following options: 
   * **Always** - The module will always restart if it shuts down for any reason.
   * **Never** - The module won't restart if it shuts down for any reason.
   * **On-failed** 
   * **On-unhealthy** 
1. Use the drop-down menu to select the startup **Status** for the module. Choose from the following options:
   * **Running** - This is the default option. The module will start running immediately after being deployed.
   * **Stopped** - After being deployed, the module will remain idle until called upon to start by you or another module.
1. Select **Edit module twin** if you want to add any tags or desired properties to the module. 
1. Select **Save** to add your module to the deployment. 

Once you have all the modules for a deployment configured, select **Next** to move to step three.

### Step 3: Specify routes (optional)

Routes define how modules communicate with each other within a deployment. Specify any routes for your deployment, then select **Next** to move to step four. 

### Step 4: Target devices

1. Enter a positive integer for the deployment **Priority**. When multiple deployments are targeted to an Edge device, the deployment with the highest deployment number will apply. If more than one deployment targeted to the same device have the same priority, the deployment with the latest timestamp (i.e. was the latest to be deployed) will win. 
1. Enter a **Target condition** to determine which devices will be targeted with this deployment. The condition is based on device twin tags and should match the expression format.  For example, `tags.environment=test`. 
1. Select **Next** to move on to the final step.

### Step 5: Review template

Review your deployment information, then select **Submit**.

## Monitor a deployment

1. Go to Azure Hub > IoT Edge 
1. Scroll to the IoT Edge Deployments section 
1. Inspect the deployment list.  Deployment status is shown under the Status and Completion / Total columns with the following info: 
   * Healthy - Displayed as a green bar in the Status column and the first number shown in the Completion / Total column. Shows the Edge devices that have reported back to the service that the modules have been deployed successfully 
   * Unhealthy - Displayed as a red bar in the Status column and the number in parentheses in the Completion / Total column. Shows the Edge devices have reported back to the service that one or modules have not been deployed successfully. To further investigate the error, you will need to connect remotely to that devices and view <XYZ log file> 
   * Unknown - Displayed as a grey bar in the Status column. Shows the shows the Edge devices that did not report status to the service after modules were deployed. To further investigate, you will need to view <ABC service info> and <XYZ log file> 
   * Actual - Displayed as the full bar (including all colors) in the Status column and the last number in the Completion / Total column. Shows the targeted Edge devices that match the Deployment targeting are not targeted by another deployment of higher priority 
1. Select the desired deployment.  
1. In the Configuration blade, select the following buttons 
   * Target shows the Edge devices that match the Deployment targeting condition 
   * Actual shows the targeted Edge devices that match the Deployment targeting are not targeted by another deployment of higher priority 
   * Healthy shows the Edge devices that have reported back to the service that the modules have been deployed successfully 
   * Unhealthy shows the Edge devices have reported back to the service that one or modules have not been deployed successfully. To further investigate the error, you will need to connect remotely to that devices and view <XYZ log file> 
   * Unknown shows the Edge devices that did not report status to the service after modules were deployed. To further investigate, you will need to view <ABC service info> and <XYZ log file> 

## Modify a deployment

When you modify a deployment, the changes immediately replicate to all targeted devices. If you update the target condition, then the deployment is applied to any new devices. Any devices that no longer meet the target condition take on their next highest priority deployment. 

1. Go to Azure Hub > IoT Edge 
1. Scroll to the IoT Edge Deployments section 
1. Select the desired deployment.  
1. Make updates to the following fields: 
   * Target Condition 
   * Labels 
   * Priority 
1. Select Save 
1. Observe the deployment status (see "Monitor a deployment") 

## Delete a deployment

When you delete a deployment, any devices take on their next highest priority deployment. If your devices don't meet the target condition of any other deployment, then the modules are not removed when the deployment is deleted. 

1. Go to Azure Hub > IoT Edge 
1. Scroll to the IoT Edge Deployments section 
1. Select the desired deployment.  
1. Select Delete 
1. A prompt will inform you that this action will delete this deployment and revert to the previous state for all devices.  This means that a deployment with a lower priority will apply.  If no other deployment is targeted, no modules will be removed. If customers wish to do this, they need to create a deployment with zero modules and deploy it to the same devices. Select **Yes** if you wish to continue. 

<!-- Links -->
[lnk-device-twin]: ../iot-hub/iot-hub-devguide-device-twins
[lnk-portal]: https://portal.azure.com
[lnk-docker-create]: https://docs.docker.com/engine/reference/commandline/create/
