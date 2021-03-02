This tutorial requires the following Azure resources:

* IoT Hub
* Storage account
* Azure Media Services account
* Linux VM in Azure, with [IoT Edge runtime](../../../../../iot-edge/how-to-install-iot-edge.md) installed

For this quickstart, we recommend that you use the [Live Video Analytics resources setup script](https://github.com/Azure/live-video-analytics/tree/master/edge/setup) to deploy the required resources in your Azure subscription. To do so, follow these steps:

1. Open [Azure Cloud Shell](https://ms.portal.azure.com/#cloudshell/).
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="../../../media/quickstarts/cloud-shell.png" alt-text="Cloud Shell":::
1. If you're using Cloud Shell for the first time, you'll be prompted to select a subscription to create a storage account and a Microsoft Azure Files share. Select **Create storage** to create a storage account for your Cloud Shell session information. This storage account is separate from the account the script will create to use with your Azure Media Services account.
1. In the drop-down menu on the left side of the Cloud Shell window, select **Bash** as your environment.

    ![Environment selector](../../../media/quickstarts/env-selector.png)
1. Run the following command.

    ```
    bash -c "$(curl -sL https://aka.ms/lva-edge/setup-resources-for-samples)"
    ```
    
    Upon successful completion of the script, you should see all of the required resources in your subscription. A total of 12 resources will be setup by the script:
    1. **Streaming Endpoint** - This will help in the playing the recorded AMS asset.
    1. **Virtual machine** - This is a virtual machine that will act as your edge device.
    1. **Disk** - This is a storage disk that is attached to the virtual machine to store media and artifacts.
    1. **Network security group** - This is used to filter network traffic to and from Azure resources in an Azure virtual network.
    1. **Network interface** - This enables an Azure Virtual Machine to communicate with internet, Azure, and other resources.
    1. **Bastion connection** - This lets you connect to your virtual machine using your browser and the Azure portal.
    1. **Public IP address** - This enables Azure resources to communicate to Internet and public-facing Azure services
    1. **Virtual network** - This enables many types of Azure resources, such as your virtual machine, to securely communicate with each other, the internet, and on-premises networks. Learn more about [Virtual networks](../../../../../virtual-network/virtual-networks-overview.md)
    1. **IoT Hub** - This acts as a central message hub for bi-directional communication between your IoT application, IoT Edge modules and the devices it manages.
    1. **Media service account** - This helps with managing and streaming media content in Azure.
    1. **Storage account** - You must have one Primary storage account and you can have any number of Secondary storage accounts associated with your Media Services account. For more information, see [Azure Storage accounts with Azure Media Services accounts](../../../../latest/storage-account-concept.md).
    1. **Container registry** - This helps in storing and managing your private Docker container images and related artifacts.

1. After the script finishes, select the curly brackets to expose the folder structure. You'll see a few files in the *~/clouddrive/lva-sample* directory. Of interest in this quickstart are:

     * ***~/clouddrive/lva-sample/edge-deployment/.env*** - This file contains properties that Visual Studio Code uses to deploy modules to an edge device.
     * ***~/clouddrive/lva-sample/appsetting.json*** - Visual Studio Code uses this file to run the sample code.
     
    You'll need these files when you set up your development environment in Visual Studio Code in the next section. You might want to copy them into a local file for now.
    
    ![App settings](../../../media/quickstarts/clouddrive.png)

> [!TIP]
> If you run into issues with Azure resources that get created, please view our **[troubleshooting guide](../../../troubleshoot-how-to.md#common-error-resolutions)** to resolve some commonly encountered issues.