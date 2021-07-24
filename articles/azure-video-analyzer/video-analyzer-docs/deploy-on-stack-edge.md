---
title: Deploy Azure Video Analyzer on Azure Stack Edge
description: This article lists the steps that will help you deploy Azure Video Analyzer on your Azure Stack Edge.
ms.topic: how-to
ms.date: 06/01/2021

---
# Deploy Azure Video Analyzer on Azure Stack Edge

This article lists the steps that will help you deploy Video Analyzer on your Azure Stack Edge. After the device has been set up and activated, it is then ready for Video Analyzer deployment. 

For Video Analyzer, we will deploy via IoT Hub, but the Azure Stack Edge resources expose a Kubernetes API, which allows the customer to deploy additional non-IoT Hub aware solutions that can interface with Video Analyzer. 

> [!TIP]
> Using the Kubernetes(K8s) API for custom deployment is an advanced case. It is recommended that the customer create edge modules and deploy via IoT Hub to each Azure Stack Edge resource instead of using the Kubernetes API. In this article, we will show you the steps of deploying the Video Analyzer module using IoT Hub.

## Prerequisites

* Video Analyzer account

    This [cloud service](./overview.md) is used to register the Video Analyzer edge module, and for playing back recorded video and video analytics
* Managed identity

    This is the user assigned [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) used to manage access to the above storage account.
* An [Azure Stack Edge](../../databox-online/azure-stack-edge-gpu-deploy-prep.md) resource
* [An IoT Hub](../../iot-hub/iot-hub-create-through-portal.md)
* Storage account

    It is recommended that you use General-purpose v2 (GPv2) Storage accounts.  
    Learn more about a [general-purpose v2 storage account](../../storage/common/storage-account-upgrade.md?tabs=azure-portal).
* [Visual Studio Code](https://code.visualstudio.com/) on your development machine. Make sure you have the [Azure IoT Tools extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools).
* Make sure the network that your development machine is connected to permits Advanced Message Queueing Protocol over port 5671. This setup enables Azure IoT Tools to communicate with Azure IoT Hub.

## Configuring Azure Stack Edge for using Video Analyzer

Azure Stack Edge is a Hardware-as-a-Service solution and an AI-enabled edge computing device with network data transfer capabilities. Read more about [Azure Stack Edge and detailed setup instructions](../../databox-online/azure-stack-edge-gpu-deploy-prep.md). To get started, follow the instructions in the links below:

* [Azure Stack Edge / Data Box Gateway Resource Creation](../../databox-online/azure-stack-edge-gpu-deploy-prep.md?tabs=azure-portal#create-a-new-resource)
* [Install and Setup](../../databox-online/azure-stack-edge-gpu-deploy-install.md)
* Connection and Activation

    1. [Connect](../../databox-online/azure-stack-edge-gpu-deploy-connect.md)
    2. [Configure network](../../databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md)
    3. [Configure device](../../databox-online/azure-stack-edge-gpu-deploy-set-up-device-update-time.md)
    4. [Configure certificates](../../databox-online/azure-stack-edge-gpu-deploy-configure-certificates.md)
    5. [Activate](../../databox-online/azure-stack-edge-gpu-deploy-activate.md)
* [Attach an IoT Hub to Azure Stack Edge](../../databox-online/azure-stack-edge-gpu-deploy-configure-compute.md#configure-compute)
### Enable Compute Prerequisites on the Azure Stack Edge Local UI

Before you continue, make sure that:

* You've activated your Azure Stack Edge resource.
* You have access to a Windows client system running PowerShell 5.0 or later to access the Azure Stack Edge resource.
* To deploy a Kubernetes cluster, you need to configure your Azure Stack Edge resource via its [local web UI](../../databox-online/azure-stack-edge-deploy-connect-setup-activate.md#connect-to-the-local-web-ui-setup). 

    * Connect and configure:
    
        1. [Connect](../../databox-online/azure-stack-edge-gpu-deploy-connect.md)
        2. [Configure network](../../databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md)
        3. [Configure device](../../databox-online/azure-stack-edge-gpu-deploy-set-up-device-update-time.md)
        4. [Configure certificates](../../databox-online/azure-stack-edge-gpu-deploy-configure-certificates.md)
        5. [Activate](../../databox-online/azure-stack-edge-gpu-deploy-activate.md)
    * To enable the compute, in the local web UI of your device, go to the Compute page.
    
        * Select a network interface that you want to enable for compute. Select Enable. Enabling compute results in the creation of a virtual switch on your device on that network interface.
        * Leave the Kubernetes test node IPs and the Kubernetes external services IPs blank.
        * Select Apply - This operation should take about 2 minutes.
        
        > [!div class="mx-imgBorder"]
        > :::image type="content" source="../../databox-online/media/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy/compute-network-2.png" alt-text=" Compute Prerequisites on the Azure Stack Edge Local UI":::

        * If DNS is not configured for the Kubernetes API and Azure Stack Edge resource, you can update your Window's host file.
        
            * Open a text editor as Administrator
            * Open file 'to C:\Windows\System32\drivers\etc\hosts'
            * Add the Kubernetes API device name's IPv4 and hostname to the file. (This info can be found in the Azure Stack Edge Portal under the Devices section.)
            * Save and close

### Deploy Video Analyzer Edge modules using Azure portal

The Azure portal guides you through creating a deployment manifest and pushing the deployment to an IoT Edge device.  
#### Select your device and set modules

1. Sign in to the [Azure portal](https://ms.portal.azure.com/) and navigate to your IoT hub.
1. Select **IoT Edge** from the menu.
1. Click on the ID of the target device from the list of devices.
1. Select **Set Modules**.

#### Configure a deployment manifest

A deployment manifest is a JSON document that describes which modules to deploy, how data flows between the modules, and desired properties of the module twins. The Azure portal has a wizard that walks you through creating a deployment manifest. It has three steps organized into tabs: **Modules**, **Routes**, and **Review + Create**.

#### Add modules

1. In the **IoT Edge Modules** section of the page, click the **Add** dropdown and select **IoT Edge Module** to display the **Add IoT Edge Module** page.
1. On the **Module Settings** tab, provide a name for the module and then specify the container image URI:   
    Examples:
    
    * **IoT Edge Module Name**: avaedge
    * **Image URI**: mcr.microsoft.com/media/video-analyzer:1	 
    
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/add-module.png" alt-text="Screenshot shows the Module Settings tab":::
    
    > [!TIP]
    > Don't select **Add** until you've specified values on the **Module Settings**, **Container Create Options**, and **Module Twin Settings** tabs as described in this procedure.
    
    > [!WARNING]
    > Azure IoT Edge is case-sensitive when you make calls to modules. Make note of the exact string you use as the module name.

1. Open the **Environment Variables** tab.
   
   Add the following values in the input boxes that you see

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/environment-variables.png" alt-text="Environment Variables":::

1. Open the **Container Create Options** tab.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/container-create-options.png" alt-text="Container create options":::
 
    Copy and paste the following JSON into the box, to limit the size of the log files produced by the module.
    
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
   
   The "Binds" section in the JSON has 2 entries:
   1. "/var/lib/videoanalyzer:/var/lib/videoanalyzer": This is used to bind the persistent application configuration data from the container and store it on the edge device.
   1. "/var/media:/var/media": This binds the media folders between the edge device and the container. This is used to store the video recordings when you run a pipelineTopology that supports storing of video clips on the edge device.
   
1. On the **Module Twin Settings** tab, copy the following JSON and paste it into the box.
 
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/twin-settings.png" alt-text="Twin settings":::

    Azure Video Analyzer requires a set of mandatory twin properties in order to run, as listed in [Module Twin configuration schema](module-twin-configuration-schema.md).  

    The JSON that you need to enter into Module Twin Settings edit box will look like this:    
    ```
    {
        "applicationDataDirectory": "/var/lib/videoanalyzer",
        "ProvisioningToken": "{provisioning-token}",
    }
    ```
    Below are some additional **recommended** properties that can be added to the JSON and will help in monitoring the module. For more information, see [monitoring and logging](monitor-log-edge.md):
    
    ```
    "diagnosticsEventsOutputName": "diagnostics",
    "OperationalEventsOutputName": "operational",
    "logLevel": "Information",
    "logCategories": "Application,Events",
    "allowUnsecuredEndpoints": true,
    "telemetryOptOut": false
    ```
1. Select **Next: Routes** to continue to the routes section. Specify routes.

    Under NAME, enter **AVAToHub**, and under VALUE, enter **FROM /messages/modules/avaedge/outputs/ INTO $upstream**
1. Select Next: **Review + create** to continue to the review section.
1. Review your deployment information, then select **Create** to deploy the module.

    > [!TIP]
    > Follow these steps to generate the provisioning token:
1. Open Azure portal and go to the Video Analyzer
1. In the left navigation pane, click on **Edge modules**.
1. Select the edge module and click on the **Generate token** button:

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/generate-provisioning-token.png" alt-text="Generate token" lightbox="./media/deploy-on-stack-edge/generate-provisioning-token.png":::
1. Copy the provisioning token:

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/copy-provisioning-token.png" alt-text="Copy token":::

#### (Optional) Setup Docker Volume Mounts

If you want to view the data in the working directories, follow these steps to setup Docker Volume Mounts before deploying. 

These steps cover creating a Gateway user and setting up file shares to view the contents of the Video Analyzer working directory and Video Analyzer media folder.

> [!NOTE]
> Bind Mounts are supported, but Volume Mounts allow the data to be viewable and if desired remotely copied. It is possible to use both Bind and Volume mounts, but they cannot point to the same container path.

1. Open Azure portal and go to the Azure Stack Edge resource.
1. Create a **Gateway User** that can access shares.
    
    1. In the left navigation pane, click on **Cloud storage gateway**.
    1. Click on **Users** in the left navigation pane.
    1. Click ion **+ Add User** to the set the username and password. (Recommended: `avauser`).
    1. Click on **Add**.

        > [!div class="mx-imgBorder"]
        > :::image type="content" source="./media/deploy-on-stack-edge/add-user.png" alt-text="Add user":::
1. Create a **Local Share** for Video Analyzer persistence.

    1. Click on **Cloud storage gateway->Shares**.
    1. Click on **+ Add Shares**.
    1. Set a share name. (Recommended: `ava`).
    1. Keep the share type as SMB.
    1. Ensure **Use the share with Edge compute** is checked.
    1. Ensure **Configure as Edge local share** is checked.
    1. In User Details, give access to the share to the recently created user.
    1. Click on **Create**.
            
        > [!div class="mx-imgBorder"]
        > :::image type="content" source="./media/deploy-on-stack-edge/local-share.png" alt-text="Local share":::  
    
        > [!TIP]
        > Using your Windows client connected to your Azure Stack Edge, connect to the SMB shares following the steps [mentioned in this document](../../databox-online/azure-stack-edge-deploy-add-shares.md#connect-to-an-smb-share).    
1. Create a Remote Share for file sync storage.

    1. First create a blob storage account in the same region by clicking on **Cloud storage gateway->Storage accounts**.
    1. Click on **Cloud storage gateway->Shares**.
    1. Click on **+ Add Shares**.
    1. Set a share name. (Recommended: media).
    1. Keep the share type as SMB.
    1. Ensure **Use the share with Edge compute** is checked.
    1. Ensure **Configure as Edge local share** is not checked.
    1. Select the recently created storage account.
    1. Set the storage type to Block Blob.
    1. Set a container name.
    1. In User Details, give access to the share to the recently created user.
    1. Click on **Create**.    
        
        > [!div class="mx-imgBorder"]
        > :::image type="content" source="./media/deploy-on-stack-edge/remote-share.png" alt-text="Remote share":::
1. Update the RTSP Simulator module's Container Create Options to use Volume Mounts:
    1. Click on the **Set modules** button:

        > [!div class="mx-imgBorder"]
        > :::image type="content" source="./media/deploy-on-stack-edge/set-modules.png" alt-text="Set modules" lightbox="./media/deploy-on-stack-edge/set-modules.png":::
    1. Click on the **rtspsim** module:

        > [!div class="mx-imgBorder"]
        > :::image type="content" source="./media/deploy-on-stack-edge/select-module.png" alt-text="Select module":::
    1. Select the **Container Create Options** tab and add the Mounts as shown below:
    
        > [!div class="mx-imgBorder"]
        > :::image type="content" source="./media/deploy-on-stack-edge/update-module.png" alt-text="Update module":::

        ```json
            "createOptions": 
            {
                "HostConfig": 
                {
                    "Mounts": 
                    [
                        {
                            "Target": "/var/media",
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
    1. Click on the **Update** button
    1. Click on the **Review and create** button and finally on the **Create** button to update the module.
    
### Verify that the module is running

The final step is to ensure that the module is connected and running as expected. The run-time status of the module should be running for your IoT Edge device in the IoT Hub resource.

To verify that the module is running, do the following:

1. In the Azure portal, return to the Azure Stack Edge resource
1. Select the Modules tile. This takes you to the Modules blade. In the list of modules, identify the module you deployed. The runtime status of the module you added should be running.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/deploy-on-stack-edge/running-module.png" alt-text="Custom module" lightbox="./media/deploy-on-stack-edge/running-module.png":::

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

* **Kubernetes API Access (kubectl)**

    * Follow the documentation to configure your machine for [access to the Kubernetes cluster](../../databox-online/azure-stack-edge-gpu-create-kubernetes-cluster.md).
    * All deployed IoT Edge modules use the `iotedge` namespace. Make sure to include that when using kubectl.  
* **Module Logs**

    The `iotedge` tool is not accessible to obtain logs. You must use [kubectl logs](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs)  to view the logs or pipe to a file. Example: <br/>  `kubectl logs deployments/mediaedge -n iotedge --all-containers`  
* **Pod and Node Metrics**

    Use [kubectl top](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#top)  to see pod and node metrics.
    <br/>`kubectl top pods -n iotedge` 
* **Module Networking**   

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
    
* **Volume Mounting**

    A module will fail to start if the container is trying to mount a volume to an existing and non-empty directory.
* **Shared Memory when using gRPC**

    Shared memory on Azure Stack Edge resources is supported across pods in any namespace by using Host IPC.
    Configuring shared memory on an edge module for deployment via IoT Hub.
    
    ```
    ...
    "createOptions": {
        "HostConfig": {
            "IpcMode": "host"
        }
    ...
        
    //(Advanced) Configuring shared memory on a K8s Pod or Deployment manifest for deployment via K8s API
    spec:
        ...
        template:
        spec:
            hostIPC: true
        ...
    ```
* **(Advanced) Pod Co-location**

    When using K8s to deploy custom inference solutions that communicate with Video Analyzer via gRPC, you need to ensure the pods are deployed on the same nodes as Video Analyzer modules.

    * **Option 1** - Use Node Affinity and built in Node labels for co-location.

    Currently NodeSelector custom configuration does not appear to be an option as the users do not have access to set labels on the Nodes. However depending on the customer's topology and naming conventions they might be able to use [built-in node labels](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#built-in-node-labels). A nodeAffinity section referencing Azure Stack Edge resources with Video Analyzer can be added to the inference pod manifest to achieve co-location.
    * **Option 2** - Use Pod Affinity for co-location (recommended).

        Kubernetes has support for [Pod Affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity) which can schedule pods on the same node. A podAffinity section referencing the Video Analyzer module can be added to the inference pod manifest to achieve co-location.

         ```json   
        // Example Video Analyzer module deployment match labels
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
* **404 error code when using `rtspsim` module**  
    
    The container will read videos from exactly one folder within the container. If you map/bind an external folder into the one, which already exists within the container image, docker will hide the files present in the container image.  
 
    For example, with no bindings the container may have these files:  
    ```
    root@rtspsim# ls /live/mediaServer/media  
    /live/mediaServer/media/camera-300s.mkv  
    /live/mediaServer/media/win10.mkv  
    ```
     
    And your host may have these files:
    ```    
    C:\MyTestVideos> dir
    Test1.mkv
    Test2.mkv
    ```
     
    But when the following binding is added in the deployment manifest file, docker will overwrite the contents of /live/mediaServer/media to match what is on the host.
    `C:\MyTestVideos:/live/mediaServer/media`
    
    ```
    root@rtspsim# ls /live/mediaServer/media
    /live/mediaServer/media/Test1.mkv
    /live/mediaServer/media/Test2.mkv
    ```

## Next steps

[Detect motion and emit events](detect-motion-emit-events-quickstart.md)
