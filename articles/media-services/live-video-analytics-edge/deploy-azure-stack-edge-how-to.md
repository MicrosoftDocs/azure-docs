---
title: Deploy Live Video Analytics on Azure Stack Edge
description: This article lists the steps that will help you deploy Live Video Analytics on your Azure Stack Edge.
ms.topic: how-to
ms.date: 09/09/2020

---
# Deploy Live Video Analytics on Azure Stack Edge

This article lists the steps that will help you deploy Live Video Analytics on your Azure Stack Edge. After the device has been setup and activated, it is then ready for Live Video Analytics deployment. 

For Live Video Analytics, we will deploy via IoT Hub, but the Azure Stack Edge resources expose a Kubernetes API, which allows the customer to deploy additional non-IoT Hub aware solutions that can interface with Live Video Analytics. 

> [!TIP]
> Using the Kubernetes(K8s) API for custom deployment is an advanced case. It is recommended that the customer create edge modules and deploy via IoT Hub to each Azure Stack Edge resource instead of using the Kubernetes API. In this article, we will show you the steps of deploying the Live Video Analytics module using IoT Hub.

## Prerequisites

* Azure subscription to which you have [owner privileges](../../role-based-access-control/built-in-roles.md#owner).
* An [Azure Stack Edge](../../databox-online/azure-stack-edge-gpu-deploy-prep.md) resource
   
* [An IoT Hub](../../iot-hub/iot-hub-create-through-portal.md)
* A [service principal](./create-custom-azure-resource-manager-role-how-to.md#create-service-principal) for the Live Video Analytics module.

   Use one of these regions where IoT Hub is available: East US 2, Central US, North Central US, Japan East, West US 2, West Central US, Canada East, UK South, France Central, France South, Switzerland North, Switzerland West, and Japan West.
* Storage account

    It is recommended that you use General-purpose v2 (GPv2) Storage accounts.  
    Learn more about a [general-purpose v2 storage account](../../storage/common/storage-account-upgrade.md?tabs=azure-portal).
* [Visual Studio Code](https://code.visualstudio.com/) on your development machine. Make sure you have the [Azure IoT Tools extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools).
* Make sure the network that your development machine is connected to permits Advanced Message Queueing Protocol over port 5671. This setup enables Azure IoT Tools to communicate with Azure IoT Hub.

## Configuring Azure Stack Edge for using Live Video Analytics

Azure Stack Edge is a Hardware-as-a-Service solution and an AI-enabled edge computing device with network data transfer capabilities. Read more about [Azure Stack Edge and detailed setup instructions](../../databox-online/azure-stack-edge-deploy-prep.md). To get started, follow the instructions in the links below:

* [Azure Stack Edge / Data Box Gateway Resource Creation](../../databox-online/azure-stack-edge-deploy-prep.md)
* [Install and Setup](../../databox-online/azure-stack-edge-deploy-install.md)
* [Connection and Activation](../../databox-online/azure-stack-edge-deploy-connect-setup-activate.md)

### Attach an IoT Hub to Azure Stack Edge

1. In the [Azure portal](https://ms.portal.azure.com), go to your Azure Stack Edge resource and click on Overview. In the right-pane, on the Compute tile, select Get started.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-azure-stack-edge-how-to/azure-stack-edge.png" alt-text="Azure Stack Edge":::
1. On the Configure Edge compute tile, select Configure compute.
1. On the Configure Edge compute blade, input the following:
    
    | Field|Value|
    |---|---|
    |IoT Hub|Choose from New or Existing.<br/>By default, a Standard tier (S1) is used to create an IoT resource. To use a free tier IoT resource, create one and then select the existing resource.<br/>In each case, the IoT Hub resource uses the same subscription and resource group that is used the Azure Stack Edge resource.|
    |Name|Enter a name for your IoT Hub resource.|

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-azure-stack-edge-how-to/azure-stack-edge-get-started.png" alt-text="Azure Stack Edge get started":::
1. Select **Create**. The IoT Hub resource creation takes a couple minutes. After the IoT Hub resource is created, the **Configure compute** tile updates to show the compute configuration. To confirm that the Edge compute role has been configured, select **View Compute** on the **Configure compute** tile.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-azure-stack-edge-how-to/edge-compute-config.png" alt-text="IoT Hub resource creation":::

    > [!NOTE]
    > If the Configure Compute dialog is closed before the IoT Hub is associated with the Azure Stack Edge resource, the IoT Hub gets created but is not shown in the compute configuration. Reload the page after a few minutes and see it appear.
    
    When the Edge compute role is set up on the Edge device, it creates two devices: an IoT device and an IoT Edge device. Both devices can be viewed in the IoT Hub resource. An IoT Edge Runtime is also running on the IoT Edge device. At this point, only the Linux platform is available for your IoT Edge device.
    
    Once all information is filled, you will see the Configure Edge compute card something like this:
    
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-azure-stack-edge-how-to/configure-edge-compute.png" alt-text="Configure Edge compute card ":::
 
### Enable Compute Prerequisites on the Azure Stack Edge Local UI

Before you continue, make sure that:

* You've activated your Azure Stack Edge resource.
* You have access to a Windows client system running PowerShell 5.0 or later to access the Azure Stack Edge resource.
* To deploy a Kubernetes cluster, you need to configure your Azure Stack Edge resource via its [local web UI](../../databox-online/azure-stack-edge-deploy-connect-setup-activate.md#connect-to-the-local-web-ui-setup). 
    
    * To enable the compute, in the local web UI of your device, go to the Compute page.
    
        * Select a network interface that you want to enable for compute. Select Enable. Enabling compute results in the creation of a virtual switch on your device on that network interface.
        * Leave the Kubernetes test node IPs and the Kubernetes external services IPs blank.
        * Select Apply - This operation should take about 2 minutes.
        
        > [!div class="mx-imgBorder"]
        > :::image type="content" source="./media/deploy-azure-stack-edge-how-to/azure-stack-edge-commercial.png" alt-text=" Compute Prerequisites on the Azure Stack Edge Local UI":::

        * If DNS is not configured for the Kubernetes API and Azure Stack Edge resource, you can update your Window's host file.
        
            * Open a text editor as Administrator
            * Open file 'to C:\Windows\System32\drivers\etc\hosts'
            * Add the Kubernetes API device name's IPv4 and hostname to the file. (This info can be found in the Azure Stack Edge Portal under the Devices section.)
            * Save and close

### Deploy Live Video Analytics Edge module using Azure portal

For this, we are only going to take specific steps from [deploy Live Video Analytics via IoT Hub](deploy-iot-edge-device.md).

1. Skip the user and group creation steps and go to [Deploy Live Video Analytics Edge](deploy-iot-edge-device.md#deploy-live-video-analytics-edge-module) module. Follow the steps mentioned there.
1. In Container Create Options you do not need to set Environment variables. So, skip this step.
1. Open the Container Create Options tab.

   * Copy and paste the following JSON into the box, to limit the size of the log files produced by the module.
    
      ```json
        "HostConfig": {
                    "LogConfig": {
                        "Type": "",
                        "Config": {
                        "max-size": "10m",
                        "max-file": "10"
                        }
                    },
                    "Binds": [
                        "/var/media/:/var/media/",
                        "/var/lib/azuremediaservices:/var/lib/azuremediaservices"
                    ]
                    }
      ```
    
      > [!NOTE]
      > If using gRPC protocol with shared memory transfer, use the Host IPC mode for shared memory access between Live Video Analytics and Inference solutions.
   
      ```json
          "HostConfig": {
                        "LogConfig": {
                            "Type": "",
                            "Config": {
                            "max-size": "10m",
                            "max-file": "10"`
                            }
                        },
                        "Binds": [
                            "/var/media/:/var/media/",
                            "/var/lib/azuremediaservices:/var/lib/azuremediaservices"
                        ],
                        "IpcMode": "host",
                        "ShmSize": 1536870912
                    }
      ```

      > [!NOTE]
      > The "Binds" section in the JSON has 2 entries. Feel free to update the edge device binds, but make sure that those directories exist.
    
    * "/var/lib/azuremediaservices:/var/lib/azuremediaservices": This is used to bind the persistent application configuration data from the container and store it on the edge device.
    * "/var/media:/var/media": This binds the media folders between the edge device and the container. This is used to store the video recordings when you run a media graph topology that supports storing of video clips on the edge device.
        
1. Continue the steps in the doc and fill in the Module Twin Settings.
1. Select **Next**: Routes to continue to the routes section. Specify routes.

    Keep the default routes and select Next: Review + create to continue to the review section.
1. [Review and verify your deployment](deploy-iot-edge-device.md#review-deployment)

#### (Optional) Setup Docker Volume Mounts

If you want to view the data in the working directories, follow these steps to setup Docker Volume Mounts before deploying. 

These steps cover creating a Gateway user and setting up file shares to view the contents of the Live Video Analytics working directory and Live Video Analytics media folder.

> [!NOTE]
> Bind Mounts are supported, but Volume Mounts allow the data to be viewable and if desired remotely copied. It is possible to use both Bind and Volume mounts, but they cannot point to the same container path.

1. Open Azure portal and go to the Azure Stack Edge resource.
1. Create a **Gateway User** that can access shares.
    
    1. In the left navigation pane, click on **Gateway->Users**.
    1. Click on **+ Add User** to the set the username and password. (Recommended: `lvauser`).
    1. Click on **Add**.
    
1. Create a **Local Share** for Live Video Analytics persistence.

    1. Click on **Gateway->Shares**.
    1. Click on **+ Add Shares**.
    1. Set a share name. (Recommended: `lva`).
    1. Keep the share type as SMB.
    1. Ensure **Use the share with Edge compute** is checked.
    1. Ensure **Configure as Edge local share** is checked.
    1. In User Details, give access to the share to the recently created user.
    1. Click on **Create**.
        
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-azure-stack-edge-how-to/local-share.png" alt-text="Local share":::
    
1. Create a Remote Share for file sync storage.

    1. First create a blob storage account in the same region.
    1. Click on **Gateway->Shares**.
    1. Click on **+ Add Shares**.
    1. Set a share name. (Recommended: media).
    1. Keep the share type as SMB.
    1. Ensure **Use the share with Edge compute** is checked.
    1. Ensure **Configure as Edge local share** is not checked.
    1. Select the recently created storage account.
    1. Set a container name.
    1. Set the storage type to Block Blob.
    1. In User Details, give access to the share to the recently created user.
    1. Click on **Create**.    
    
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-azure-stack-edge-how-to/remote-share.png" alt-text="Remote share":::
    
    > [!TIP]
    > Using your Windows client connected to your Azure Stack Edge, connect to the SMB shares following the steps [mentioned in this document](../../databox-online/azure-stack-edge-deploy-add-shares.md#connect-to-an-smb-share).
    
1. Update the Live Video Analytics Edge module's Container Create Options (see point 4 in [add modules document](deploy-iot-edge-device.md#add-modules)) to use Volume Mounts.

   ```json
    // Original (Bind Mounts)
    "createOptions": {
        "HostConfig": {
            "Binds": [
                "/var/lib/azuremediaservices:/var/lib/azuremediaservices",
                "/var/media:/var/media"
            ]
        }
    }
    // Updated (Volume Mounts)
    "createOptions": {
        "HostConfig": {
            "Mounts": [
            {
                "Target": "/var/lib/azuremediaservices",
                "Source": "lva",
                "Type": "volume"
            },
            {
                "Target": "/var/media",
                "Source": "media",
                "Type": "volume"
            }]
        }
    }
    ```

### Verify that the module is running

The final step is to ensure that the module is connected and running as expected. The run-time status of the module should be running for your IoT Edge device in the IoT Hub resource.

To verify that the module is running, do the following:

1. In the Azure portal, return to the Azure Stack Edge resource
1. Select the Modules tile. This takes you to the Modules blade. In the list of modules, identify the module you deployed. The runtime status of the module you added should be running.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-azure-stack-edge-how-to/iot-edge-custom-module.png" alt-text="Custom module":::

### Configure the Azure IoT Tools extension

Follow these instructions to connect to your IoT hub by using the Azure IoT Tools extension.

1. In Visual Studio Code, select View > Explorer. Or select Ctrl+Shift+E.
1. In the lower-left corner of the Explorer tab, select Azure IoT Hub.
1. Select the More Options icon to see the context menu. Then select Set IoT Hub Connection String.
1. When an input box appears, enter your IoT Hub connection string. 

   * To get the connection string, go to your IoT Hub in Azure portal and click on Shared access policies in the left navigation pane.
   * Click on iothubowner get the shared access keys.
   * Copy the Connection String – primary key and paste it in the input box on the VSCode.

   The connection string will look like:<br/>`HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=xxx`
    
   If the connection succeeds, the list of edge devices appears. You should see your Azure Stack Edge. You can now manage your IoT Edge devices and interact with Azure IoT Hub through the context menu. To view the modules deployed on the edge device, under the Azure Stack device, expand the Modules node.
    
## Troubleshooting

* Kubernetes API Access (kubectl).

    * Follow the documentation to configure your machine for [access to the Kubernetes cluster](https://review.docs.microsoft.com/azure/databox-online/azure-stack-edge-j-series-create-kubernetes-cluster?toc=%2Fazure%2Fdatabox-online%2Fazure-stack-edge-gpu%2Ftoc.json&bc=%2Fazure%2Fdatabox-online%2Fazure-stack-edge-gpu%2Fbreadcrumb%2Ftoc.json&branch=release-tzl#debug-kubernetes-issues).
    * All deployed IoT Edge modules use the `iotedge` namespace. Make sure to include that when using kubectl.
* Module Logs

    The `iotedge` tool is not accessible to obtain logs. You must use [kubectl logs](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs)  to view the logs or pipe to a file. Example: <br/>  `kubectl logs deployments/mediaedge -n iotedge --all-containers`
* Pod and Node Metrics

    Use [kubectl top](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#top)  to see pod and node metrics. (This functionality will be available in the next Azure Stack Edge release. >v2007)<br/>`kubectl top pods -n iotedge`
* Module Networking
For Module discovery on Azure Stack Edge it is required that the module have the host port binding in createOptions. The module will then be addressable over `moduleName:hostport`.
    
    ```json
    "createOptions": {
        "HostConfig": {
            "PortBindings": {
                "8554/tcp": [ { "HostPort": "8554" } ]
            }
        }
    }
    ```
    
* Volume Mounting

    A module will fail to start if the container is trying mount a volume to an existing and non-empty directory.
* Shared Memory

    Shared memory on Azure Stack Edge resources is supported across pods in any namespace by using Host IPC.
    Configuring shared memory on an edge module for deployment via IoT Hub.
    
    ```
    ...
    "createOptions": {
        "HostConfig": {
            "IpcMode": "host"
        }
    ...
        
    (Advanced) Configuring shared memory on a K8s Pod or Deployment manifest for deployment via K8s API.
    spec:
        ...
        template:
        spec:
            hostIPC: true
        ...
    ```
    
* (Advanced) Pod Co-location

    When using K8s to deploy custom inference solutions that communicate with Live Video Analytics via gRPC, you need to ensure the pods are deployed on the same nodes as Live Video Analytics modules.

    * Option 1 - Use Node Affinity and built in Node labels for co-location.

    Currently NodeSelector custom configuration does not appear to be an option as the users do not have access to set labels on the Nodes. However depending on the customer's topology and naming conventions they might be able to use [built-in node labels](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#built-in-node-labels). A nodeAffinity section referencing Azure Stack Edge resources with Live Video Analytics can be added to the inference pod manifest to achieve co-location.
    * Option 2 - Use Pod Affinity for co-location (recommended).
Kubernetes has support for [Pod Affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)  which can schedule pods on the same node. A podAffinity section referencing the Live Video Analytics module can be added to the inference pod manifest to achieve co-location.

    ```json   
    // Example Live Video Analytics module deployment match labels
    selector:
      matchLabels:
        net.azure-devices.edge.deviceid: dev-ase-1-edge
        net.azure-devices.edge.module: mediaedge
    
    // Example Inference deployment manifest pod affinity
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: net.azure-devices.edge.module
                operator: In
                values:
                - mediaedge
            topologyKey: "kubernetes.io/hostname"
    ```

## Next steps

You can use the module to analyze live video streams by invoking direct methods. [Invoke the direct methods](get-started-detect-motion-emit-events-quickstart.md#use-direct-method-calls) on the module.