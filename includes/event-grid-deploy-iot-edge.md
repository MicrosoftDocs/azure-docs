---
 title: include file
 description: include file
 services: event-grid
 author: spelluru
 ms.service: event-grid
 ms.topic: include
 ms.date: 10/10/2019
 ms.author: spelluru
 ms.custom: include file
---

## Deploy Event Grid IoT Edge module

There are several ways to deploy modules to an IoT Edge device and all of them work for Azure Event Grid on IoT Edge. This article describes the steps to deploy Event Grid on IoT Edge from the Azure portal.

>[!NOTE]
> In this tutorial, you will deploy the Event Grid module without persistence. It means that any topics and subscriptions you create in this tutorial will be deleted when you redeploy the module. For more information on how to setup persistence, see the following articles: [Persist state in Linux](../articles/event-grid/edge/persist-state-linux.md) or [Persist state in Windows](../articles/event-grid/edge/persist-state-windows.md). For production workloads, we recommend that you install the Event Grid module with persistence.

>[!IMPORTANT]
> In this tutorial, Event Grid module will be deployed with client authentication turned-off, and allow HTTP subscribers. For production workloads, we recommend that you enable only HTTPS requests and subscribers with client authentication enabled. For more information on how to configure Event Grid module securely, see [Security and authentication](../articles/event-grid/edge/security-authentication.md).
 
### Select your IoT Edge device

1. Sign in to the [Azure portal](https://portal.azure.com)
1. Navigate to your IoT Hub.
1. Select **IoT Edge** from the menu in the **Automatic Device Management** section. 
1. Click on the ID of the target device from the list of devices
1. Select **Set Modules**. Keep the page open. You will continue with the steps in the next section.

### Configure a deployment manifest

A deployment manifest is a JSON document that describes which modules to deploy, how data flows between the modules, and desired properties of the module twins. The Azure portal has a wizard that walks you through creating a deployment manifest, instead of building the JSON document manually.  It has three steps: **Add modules**, **Specify routes**, and **Review deployment**.

### Add modules

1. In the **Deployment Modules** section, select **Add**
1. From the types of modules in the drop-down list, select **IoT Edge Module**
1. Provide the name, image, container create options of the container:

[!INCLUDE [event-grid-edge-module-version-update](event-grid-edge-module-version-update.md)]

   * **Name**: eventgridmodule
   * **Image URI**: `mcr.microsoft.com/azure-event-grid/iotedge:latest`
   * **Container Create Options**:

    ```json
        {
          "Env": [
            "inbound__clientAuth:clientCert__enabled=false",
            "outbound__webhook__httpsOnly=false"
          ],
          "HostConfig": {
            "PortBindings": {
              "4438/tcp": [
                {
                  "HostPort": "4438"
                }
              ]
            }
          }
        }
    ```

 1. Click **Save**
 1. Click **Next** to continue to the routes section

    > [!NOTE]
    > If you are using an Azure VM as an edge device, add an inbound port rule to allow inbound traffic on the port 4438. For instructions on adding the rule, see [How to open ports to a VM](../articles/virtual-machines/windows/nsg-quickstart-portal.md).


### Setup routes

 Keep the default routes, and select **Next** to continue to the review section

### Review deployment

1. The review section shows you the JSON deployment manifest that was created based on your selections in the previous two sections. Confirm that you see the two modules in the list: **$edgeAgent** and **$edgeHub**. These two modules make up the IoT Edge runtime and are required defaults in every deployment.
1. Review your deployment information, then select **Submit**.

### Verify your deployment

1. After you submit the deployment, you return to the IoT Edge page of your IoT hub.
1. Select the **IoT Edge device** that you targeted with the deployment to open its details.
1. In the device details, verify that the Event Grid module is listed as both **Specified in deployment** and **Reported by device**.

It may take a few moments for the module to be started on the device and then reported back to IoT Hub. Refresh the page to see an updated status.