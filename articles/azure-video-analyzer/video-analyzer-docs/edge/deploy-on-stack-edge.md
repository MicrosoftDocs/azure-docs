---
title: Deploy Video Analyzer on Azure Stack Edge
description: This article discusses how to deploy Azure Video Analyzer on Azure Stack Edge.
ms.topic: how-to
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---
# Deploy Azure Video Analyzer on Azure Stack Edge

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]

This article provides full instructions for deploying Azure Video Analyzer on your Azure Stack Edge device. After you've set up and activated the device, it's ready for Video Analyzer deployment. 

In the article, we'll deploy Video Analyzer by using Azure IoT Hub, but the Azure Stack Edge resources expose a Kubernetes API, with which you can deploy additional non-IoT Hub-aware solutions that can interface with Video Analyzer. 

> [!TIP]
> Using the Kubernetes API for custom deployment is an advanced case. We recommend that you create edge modules and deploy them via IoT Hub to each Azure Stack Edge resource instead of using the Kubernetes API. This article shows you how to deploy the Video Analyzer module by using IoT Hub.

## Prerequisites

* An Azure Video Analyzer account

    This [cloud service](../overview.md) is used to register the Video Analyzer edge module, and for playing back recorded video and video analytics.
* A managed identity

    This is the user-assigned [managed identity](../../../active-directory/managed-identities-azure-resources/overview.md) that you use to manage access to your storage account.
* An [Azure Stack Edge](../../../databox-online/azure-stack-edge-gpu-deploy-prep.md) resource
* An [IoT hub](../../../iot-hub/iot-hub-create-through-portal.md)
* A storage account

    We recommend that you use a [general-purpose v2 storage account](../../../storage/common/storage-account-upgrade.md?tabs=azure-portal).  
* [Visual Studio Code](https://code.visualstudio.com/), installed on your development machine
*  The [Azure IoT Tools extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools), installed in Visual Studio Code
* Make sure the network that your development machine is connected to permits Advanced Message Queueing Protocol over port 5671. This setup enables Azure IoT Tools to communicate with your Azure IoT hub.

## Configure Azure Stack Edge to use Video Analyzer

Azure Stack Edge is a hardware-as-a-service solution and an AI-enabled edge computing device with network data transfer capabilities. For more information, see [Azure Stack Edge and detailed setup instructions](../../../databox-online/azure-stack-edge-gpu-deploy-prep.md). 

To get started, do the following:

1. [Create an Azure Stack Edge or Azure Data Box Gateway resource](../../../databox-online/azure-stack-edge-gpu-deploy-prep.md?tabs=azure-portal#create-a-new-resource).  
1. [Install and set up Azure Stack Edge Pro with GPU](../../../databox-online/azure-stack-edge-gpu-deploy-install.md).  
1. Connect and activate the resource by doing the following:

    a. [Connect to the local web UI setup](../../../databox-online/azure-stack-edge-gpu-deploy-connect.md).  
    b. [Configure the network](../../../databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md).  
    c. [Configure the device](../../../databox-online/azure-stack-edge-gpu-deploy-set-up-device-update-time.md).  
    d. [Configure the certificates](../../../databox-online/azure-stack-edge-gpu-deploy-configure-certificates.md).  
    e. [Activate the device](../../../databox-online/azure-stack-edge-gpu-deploy-activate.md).  

1. [Attach an IoT hub to Azure Stack Edge](../../../databox-online/azure-stack-edge-gpu-deploy-configure-compute.md#configure-compute).

### Meet the compute prerequisites on the Azure Stack Edge local UI

Before you continue, make sure that you've completed the following:

* You've activated your Azure Stack Edge resource.
* You have access to a Windows client system that's running PowerShell 5.0 or later to access the Azure Stack Edge resource.
* To deploy Kubernetes clusters, you've configured your Azure Stack Edge resource on its [local web UI](../../../databox-online/azure-stack-edge-deploy-connect-setup-activate.md#connect-to-the-local-web-ui-setup). 

    1. Connect and configure the resource by doing the following:
        a. [Connect to the local web UI setup](../../../databox-online/azure-stack-edge-gpu-deploy-connect.md).  
        b. [Configure the network](../../../databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md).  
        c. [Configure the device](../../../databox-online/azure-stack-edge-gpu-deploy-set-up-device-update-time.md)  
        d. [Configure the certificates](../../../databox-online/azure-stack-edge-gpu-deploy-configure-certificates.md).  
        e. [Activate the device](../../../databox-online/azure-stack-edge-gpu-deploy-activate.md).

    1. To enable the compute, on the local web UI of your device, go to the **Compute** page.
    
        a. Select a network interface that you want to enable for compute, and then select **Enable**. Enabling compute creates a virtual switch on your device on that network interface.  
        b. Leave the Kubernetes test node IPs and the Kubernetes external services IPs blank.  
        c. Select **Apply**. The operation should take about two minutes.
        
        > [!div class="mx-imgBorder"]

        > :::image type="content" source="../../../databox-online/media/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy/compute-network-2.png" alt-text="Screenshot of compute prerequisites on the Azure Stack Edge local UI.":::

        If Azure DNS isn't configured for the Kubernetes API and Azure Stack Edge resource, you can update your Windows host file by doing the following:
        
        a. Open a text editor as Administrator.  
        b. Open the *hosts* file at *C:\Windows\System32\drivers\etc\\*.  
        c. Add the Kubernetes API device name's Internet Protocol version 4 (IPv4) and hostname to the file. You can find this information in the Azure Stack Edge portal, under **Devices**.  
        d. Save and close the file.

### Deploy Video Analyzer Edge modules by using the Azure portal

The Azure portal, you can create a deployment manifest and push the deployment to an IoT Edge device.  

#### Select your device and set modules

1. Sign in to the [Azure portal](https://portal.azure.com/), and then go to your IoT hub.
1. On the left pane, select **IoT Edge**.
1. In the list of devices, select the ID of the target device.
1. Select **Set Modules**.

#### Configure a deployment manifest

A deployment manifest is a JSON document that describes which modules to deploy, how data flows between the modules, and the desired properties of the module twins. The Azure portal has a wizard that walks you through creating a deployment manifest. Its three steps are organized into **Modules**, **Routes**, and **Review + Create** tabs.

#### Add modules

1. In the **IoT Edge Modules** section, in the **Add** dropdown list, select **IoT Edge Module** to display the **Add IoT Edge Module** page.
1. Select the **Module Settings** tab, provide a name for the module, and then specify the container image URI. Example values are shown in the following image:	 
    
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/add-module.png" alt-text="Screenshot of the Module Settings pane on the Add IoT Edge Module page.":::
    
    > [!TIP]
    > Don't select **Add** until you've specified values on the **Module Settings**, **Container Create Options**, and **Module Twin Settings** tabs, as described in this procedure.
    
    > [!IMPORTANT]
    > Azure IoT Edge values are case-sensitive when you make calls to modules. Make note of the exact string you're using as the module name.
1. Select the **Environment Variables** tab, and then enter the values, as shown in the following image:
   
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/environment-variables.png" alt-text="Screenshot of the 'Environment Variables' pane on the 'Add IoT Edge Module' page.":::
1. Select the **Container Create Options** tab.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/container-create-options.png" alt-text="Screenshot of the Container Create Options pane on the Add IoT Edge Module page.":::
 
    In the box on the **Container Create Options** pane, paste the following JSON code. This action limits the size of the log files that are produced by the module.
    
    ```    
    {
        "HostConfig": {
            "LogConfig": {
                "Type": "",
                "Config": {
                    "max-size": "10m",
                    "max-file": "10"
                }
            },
            "Binds": [
               "/var/lib/videoanalyzer/:/var/lib/videoanalyzer",
               "/var/media:/var/media"
            ],
            "IpcMode": "host",
            "ShmSize": 1536870912
        }
    }
    ````
   
   The "Binds" section in the JSON has two entries:
   * **"/var/lib/videoanalyzer:/var/lib/videoanalyzer"** is used to bind the persistent application configuration data from the container and store it on the edge device.
   * **"/var/media:/var/media"** binds the media folders between the edge device and the container. It's used to store the video recordings when you run a pipelineTopology that supports storing video clips on the edge device.
   
1. Select the **Module Twin Settings** tab.
 
   To run, Video Analyzer edge module requires a set of mandatory twin properties, as listed in [Module Twin configuration schema](module-twin-configuration-schema.md). 
1. In the box on the **Module Twin Settings** pane, paste the following JSON code:    
    ```
    {
        "applicationDataDirectory": "/var/lib/videoanalyzer",
        "ProvisioningToken": "{provisioning-token}",
        ...
    }
    ```
   
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/twin-settings.png" alt-text="Screenshot of the 'Module Twin Settings' pane on the 'Add IoT Edge Module' page.":::   

    To help with monitoring the module, you can add the following *recommended* properties to the JSON code. For more information, see [Monitoring and logging](monitor-log-edge.md).
    
    ```
    "diagnosticsEventsOutputName": "diagnostics",
    "OperationalEventsOutputName": "operational",
    "logLevel": "Information",
    "logCategories": "Application,Events",
    "allowUnsecuredEndpoints": true,
    "telemetryOptOut": false
    ```
1. Select **Add**.  

#### Add the Real-Time Streaming Protocol (RTSP) simulator edge module

1. In the **IoT Edge Modules** section, in the **Add** dropdown list, select **IoT Edge Module** to display the **Add IoT Edge Module** page.
1. Select the **Module Settings** tab, provide a name for the module, and then specify the container image URI. For example:   
    
    * **IoT Edge Module Name**: rtspsim  
    * **Image URI**: mcr.microsoft.com/ava-utilities/rtspsim-live555:1.2 

1. Select the **Container Create Options** tab and then, in the box, paste the following JSON code:
    
    ```
    {
        "HostConfig": {
            "Binds": [
               "/home/localedgeuser/samples/input/:/live/mediaServer/media/"
            ],
            "PortBindings": {
                    "554/tcp": [
                        {
                        "HostPort": "554"
                        }
                    ]
            }
        }
    }
    ```
1. Select **Add**.  
1. Select **Next: Routes** to continue to the routes section. 
1. To specify routes, under **Name**, enter **AVAToHub** and then, under **Value**, enter **FROM /messages/modules/avaedge/outputs/ INTO $upstream**.
1. Select **Next: Review + create** to continue to the review section.
1. Review your deployment information, and then select **Create** to deploy the module.

#### Generate the provisioning token

1. In the Azure portal, go to Video Analyzer.
1. On the left pane, select **Edge modules**.
1. Select the edge module, and then select **Generate token**.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/generate-provisioning-token.png" alt-text="Screenshot of the 'Add edge modules' pane for generating a token." lightbox="./media/deploy-on-stack-edge/generate-provisioning-token.png":::
1. Copy the provisioning token, as shown in the following image:

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/copy-provisioning-token.png" alt-text="Screenshot of the 'Copy provisioning token' page.":::



#### (Optional) Set up Docker volume mounts

If you want to view the data in the working directories, set up Docker volume mounts before you deploy it. 

This section covers how to create a gateway user and set up file shares to view the contents of the Video Analyzer working directory and Video Analyzer media folder.

> [!NOTE]
> Bind mounts are supported, but volume mounts allow the data to be viewable and, if you choose, remotely copied. It's possible to use both bind and volume mounts, but they can't point to the same container path.

1. In the Azure portal, go to the Azure Stack Edge resource.
1. Create a gateway user that can access shares by doing the following:
    
    a. On the left pane, select **Cloud storage gateway**.  
    b. On the left pane, select **Users**.  
    c. Select **Add User** to set the username (for example, we recommend *avauser*) and password.  
    d. Select **Add**.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/add-user.png" alt-text="Screenshot of the Azure Stack Edge resource 'Add user' page.":::
1. Create a *local share* for Video Analyzer persistence by doing the following:

    a. Select **Cloud storage gateway** > **Shares**.  
    b. Select **Add share**.  
    c. Set a share name (for example, we recommend *ava*).  
    d. Keep the share type as **SMB**.  
    e. Ensure that the **Use the share with Edge compute** checkbox is selected.  
    f. Ensure that the **Configure as Edge local share** checkbox is selected.  
    g. Under **User details**, give access to the share to the recently created user by selecting **Use existing**.  
    h. Select **Create**.
            
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/local-share.png" alt-text="Screenshot of the 'Add share' page for creating a local share.":::  
    
    > [!TIP]
    > With your Windows client connected to your Azure Stack Edge device, follow the instructions in the "Connect to an SMB share" section of [Transfer data with Azure Stack Edge Pro FPGA](../../../databox-online/azure-stack-edge-deploy-add-shares.md#connect-to-an-smb-share).    
1. Create a *remote share* for file sync storage by doing the following:

    a. Create an Azure Blob Storage account in the same region by selecting **Cloud storage gateway** > **Storage accounts**.  
    b. Select **Cloud storage gateway** > **Shares**.  
    c. Select **Add Shares**.  
    d. In the **Name** box, enter a share name (for example, we recommend *media*).  
    e. For **Type**, keep the share type as **SMB**.  
    f. Ensure that the **Use the share with Edge compute** checkbox is selected.  
    g. Ensure that the **Configure as Edge local share** checkbox is cleared.  
    h. In the **Storage account** dropdown list, select the recently created storage account.  
    i. In the **Storage service** dropdown list, select **Block Blob**.  
    j. In the **Select blob container** box, enter the container name.  
    k. Under **User Details**, select **Use existing** to give access to the share to the recently created user.  
    l. Select **Create**.    
        
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/remote-share.png" alt-text="Screenshot of the 'Add share' page for creating a remote share.":::

1. To use volume mounts, update the settings on the **Container Create Options** pane for the RTSP simulator module by doing the following:

    a. Select the **Set modules** button.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/set-modules.png" alt-text="Screenshot showing the 'Set modules' button on the edge device settings pane." lightbox="./media/deploy-on-stack-edge/set-modules.png":::  

    b. In the **Name** list, select the **rtspsim** module:

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/select-module.png" alt-text="Screenshot of the 'rtspsim' module under 'IoT Edge Modules' on the edge device settings pane.":::  
    
    c. On the **Update IoT Edge Module** pane, select the **Container Create Options** tab, and then add the mounts as shown in the following JSON code:
    
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/update-module.png" alt-text="Screenshot of the JSON mounts code on the 'Container Create Options' pane.":::

    ```json
        "createOptions": 
        {
            "HostConfig": 
            {
                "Mounts": 
                [
                    {
                        "Target": "/live/mediaServer/media",
                        "Source": "media",
                        "Type": "volume"
                    }
                ],
                "PortBindings": {
                    "554/tcp": [
                        {
                        "HostPort": "554"
                        }
                    ]
                }
            }
        }
    ```  
    d. Select **Update**.  
    e. To update the module, select **Review and create**, and then select **Create**.
    
### Verify that the module is running

Finally, ensure that your IoT Edge device module is connected and running as expected. To check the module's runtime status, do the following:

1. In the Azure portal, return to your Azure Stack Edge resource.
1. On the left pane, select **Modules**. 
1. On the **Modules** pane, in the **Name** list, select the module you deployed. In the **Runtime status** column, the module's status should be *running*.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/running-module.png" alt-text="Screenshot of the 'Module' pane, showing the selected module's runtime status as 'running'." lightbox="./media/deploy-on-stack-edge/running-module.png":::

### Configure the Azure IoT Tools extension

To connect to your IoT hub by using the Azure IoT Tools extension, do the following:

1. In Visual Studio Code, select **View** > **Explorer**.
1. On the **Explorer** pane, at the lower left, select **Azure IoT Hub**.
1. Select the **More Options** icon to show the context menu, and then select **Set IoT Hub Connection String**.

   An input box appears, into which you'll enter your IoT hub connection string. To get the connection string, do the following: 

   a. In the Azure portal, go to your IoT hub.  
   b. On the left pane, select **Shared access policies**.  
   c. Select **iothubowner get the shared access keys**.  
   d. Copy the connection string primary key, and then paste it in the input box.

   > [!NOTE]
   > The connection string is written in the following format:
   >
   > `HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=xxx`
    
   When the connection succeeds, a list of edge devices is displayed, including your Azure Stack Edge device. You can now manage your IoT Edge devices and interact with your Azure IoT hub through the context menu. 
   
   To view the modules that are deployed on the edge device, under the Azure Stack device, expand the **Modules** node.
    
## Troubleshooting

* **Kubernetes API access (kubectl)**

    * Configure your machine for access to the Kubernetes cluster by following the instructions in [Create and manage a Kubernetes cluster on Azure Stack Edge Pro GPU device](../../../databox-online/azure-stack-edge-gpu-create-kubernetes-cluster.md).
    * All deployed IoT Edge modules use the *iotedge* namespace. Be sure to include that name when you're using kubectl. 
* **Module logs**

    If the *iotedge* tool is inaccessible for obtaining logs, use [kubectl logs](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs) to view the logs or pipe to a file. For example: <br/>  `kubectl logs deployments/mediaedge -n iotedge --all-containers`  
* **Pod and node metrics**

    To view pod and node metrics, use [kubectl top](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#top). For example:
    <br/>`kubectl top pods -n iotedge` 
* **Module networking**   

    For module discovery on Azure Stack Edge, the module must have the host port binding in createOptions. The module will then be addressable over `moduleName:hostport`.
    
    ```json
    "createOptions": {
        "HostConfig": {
            "PortBindings": {
                "8554/tcp": [ { "HostPort": "8554" } ]
            }
        }
    }
    ```    
* **Volume mounting**

    A module will fail to start if the container is trying to mount a volume to an existing and non-empty directory.
* **Shared memory when gRPC is used**

    Shared memory on Azure Stack Edge resources is supported across pods in any namespace when you use Host IPC.
    
    Configure shared memory on an edge module for deployment via IoT Hub by using the following code:
    
    ```
    ...
    "createOptions": {
        "HostConfig": {
            "IpcMode": "host"
        }
    ...
        
    //(Advanced) Configuring shared memory on a Kubernetes pod or deployment manifest for deployment via the Kubernetes API spec:
        ...
        template:
        spec:
            hostIPC: true
        ...
    ```
* **(Advanced) Pod co-location**

    When you use Kubernetes to deploy custom inference solutions that communicate with Video Analyzer via gRPC, ensure that the pods are deployed on the same nodes as Video Analyzer modules.

    * **Option 1**: Use *node affinity* and built-in node labels for co-location.  

    Currently, NodeSelector custom configuration doesn't appear to be an option, because users don't have access to set labels on the nodes. However depending on the users' topology and naming conventions, they might be able to use [built-in node labels](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#built-in-node-labels). To achieve co-location, you can add to the inference pod manifest a nodeAffinity section that references Azure Stack Edge resources with Video Analyzer.    
    * **Option 2**: (Recommended) Use *pod affinity* for co-location.  

        Kubernetes supports [pod affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity), which can schedule pods on the same node. To achieve co-location, you can add to the inference pod manifest, a podAffinity section that references the Video Analyzer module.

        ```yaml
        // Example Video Analyzer module deployment match labels
        selector:
          matchLabels:
            net.azure-devices.edge.deviceid: dev-ase-1-edge
            net.azure-devices.edge.module: mediaedge
        
        // Example inference deployment manifest pod affinity
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
* **You get a 404 error code when you use the *rtspsim* module**  
    
    The container reads videos from exactly one folder within the container. If you map/bind an external folder into a folder that already exists within the container image, Docker hides the files present in the container image.
 
    For example, with no bindings, the container might have these files:  

    ```
    root@rtspsim# ls /live/mediaServer/media  
    /live/mediaServer/media/camera-300s.mkv  
    /live/mediaServer/media/win10.mkv  
    ```
     
    And your host might have these files:

    ```    
    C:\MyTestVideos> dir
    Test1.mkv
    Test2.mkv
    ```
     
    But when the following binding is added in the deployment manifest file, Docker overwrites the contents of /live/mediaServer/media to match what's on the host.

    `C:\MyTestVideos:/live/mediaServer/media`
    
    ```
    root@rtspsim# ls /live/mediaServer/media
    /live/mediaServer/media/Test1.mkv
    /live/mediaServer/media/Test2.mkv
    ```

## Next steps

Analyze video with Computer Vision and Spatial Analysis [using Azure Stack Edge](computer-vision-for-spatial-analysis.md)
