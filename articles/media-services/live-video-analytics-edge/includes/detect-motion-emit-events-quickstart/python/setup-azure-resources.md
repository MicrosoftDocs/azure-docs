This tutorial requires the following Azure resources:

* IoT Hub
* Storage account
* Azure Media Services account
* Linux VM in Azure, with [IoT Edge runtime](../../../../../iot-edge/how-to-install-iot-edge-linux.md) installed

For this quickstart, we recommend that you use the [Live Video Analytics resources setup script](https://github.com/Azure/live-video-analytics/tree/master/edge/setup) to deploy the required resources in your Azure subscription. To do so, follow these steps:

1. Open [Azure Cloud Shell](https://shell.azure.com).
1. If you're using Cloud Shell for the first time, you'll be prompted to select a subscription to create a storage account and a Microsoft Azure Files share. Select **Create storage** to create a storage account for your Cloud Shell session information. This storage account is separate from the account the script will create to use with your Azure Media Services account.
1. In the drop-down menu on the left side of the Cloud Shell window, select **Bash** as your environment.

    ![Environment selector](../../../media/quickstarts/env-selector.png)
1. Run the following command.

    ```
    bash -c "$(curl -sL https://aka.ms/lva-edge/setup-resources-for-samples)"
    ```
    
    If the script finishes successfully, you should see all of the required resources in your subscription.
1. After the script finishes, select the curly brackets to expose the folder structure. You'll see a few files in the *~/clouddrive/lva-sample* directory. Of interest in this quickstart are:

     * ***~/clouddrive/lva-sample/edge-deployment/.env*** - This file contains properties that Visual Studio Code uses to deploy modules to an edge device.
     * ***~/clouddrive/lva-sample/appsetting.json*** - Visual Studio Code uses this file to run the sample code.
     
    You'll need these files when you set up your development environment in Visual Studio Code in the next section. You might want to copy them into a local file for now.
    
    ![App settings](../../../media/quickstarts/clouddrive.png)
    