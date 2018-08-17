---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Deploy Custom Vision to an Azure IoT Edge device | Microsoft Docs 
description: Learn how to make a computer vision model run as a container using Custom Vision and IoT Edge.
services: iot-edge
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 08/15/2018
ms.topic: tutorial
ms.service: iot-edge
ms.custom: mvc
#Customer intent: As an IoT developer, I want to perform image recognition directly on my IoT Edge device so that I can have faster results and lower costs for data transfers.
---

# Tutorial: Perform image classification at the edge with Custom Vision Service

Azure IoT Edge can make your IoT solution more efficient by moving workloads out of the cloud and to the edge. This capability lends itself well to services that process a lot of data, like computer vision models. The [Custom Vision Service](../cognitive-services/custom-vision-service/home.md) lets you build custom image classifiers and deploy them to devices as containers. 

Together, these two services enable you to find insights from images or video streams without having to transfer all of the data. Custom Vision provides a classifier that compares an image against a trained model to generate insights. For example, you could use Custom Vision on an IoT Edge device to determine whether a highway is experience high or low traffic, or to determine whether there are available parking spots in a row. These insights can be passed along to another service or another piece of code running on the device to take action. 


In this tutorial, you learn how to: 

> [!div class="checklist"]
> * Create a container registry
> * Build an image classifier with Custom Vision
> * 

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

An Azure IoT Edge device:

* You can use your development machine or a virtual machine as an Edge device by following the steps in the quickstart for [Linux](quickstart-linux.md).
* The Custom Vision module is only available as a Linux container for x64 architectures. 

Cloud resources:

* A standard-tier [IoT Hub](../iot-hub/iot-hub-create-through-portal.md) in Azure. 

Development resources:

* [Visual Studio Code](https://code.visualstudio.com/). 
* [C# for Visual Studio Code (powered by OmniSharp)](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp) extension for Visual Studio Code. 
* [Azure IoT Edge](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) extension for Visual Studio Code. 
* [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) extension for Visual Studio Code. 
* [.NET Core 2.1 SDK](https://www.microsoft.com/net/download). 
* [Docker CE](https://docs.docker.com/install/). 

## Create a container registry
In this tutorial, you use the Azure IoT Edge extension for VS Code to build a module and create a **container image** from the files. Then you push this image to a **registry** that stores and manages your images. Finally, you deploy your image from your registry to run on your IoT Edge device.  

You can use any Docker-compatible registry for this tutorial. Two popular Docker registry services available in the cloud are [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/) and [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags). This tutorial uses Azure Container Registry. 

1. In the [Azure portal](https://portal.azure.com), select **Create a resource** > **Containers** > **Container Registry**.

    ![create container registry](./media/tutorial-deploy-function/create-container-registry.png)

2. Give your registry a name, and choose a subscription.
3. For the resource group, it is recommended that you use the same resource group name that contains your IoT Hub. By keeping all the resources together in the same group, you can manage them together. For example, deleting the resource group used for testing deletes all test resources contained in the group. 
4. Set the SKU to **Basic**, and toggle **Admin user** to **Enable**. 
5. Click **Create**.
6. Once your container registry is created, navigate to it and select **Access keys**. 
7. Copy the values for **Login server**, **Username**, and **Password**. You'll use these values later in the tutorial. 

## Build an image classifier with Custom Vision

To build an image classifier, you need to create a Custom Vision project and provide training images. For more information about the steps that you take in this section, see [How to build a classifier with Custom Vision](../cognitive-services/custom-vision-service/getting-started-build-a-classifier.md).

Once your image is built, you can export it as an IoT Edge

### Create a new project

1. In your web browser, navigate to the [Custom Vision web page](https://customvision.ai/).

2. Select **Sign in** and sign in with the same account that you use to access Azure resources. 

3. Select **New project**.

4. Create your project with the following values:

   | Field | Value |
   | ----- | ----- |
   | Name | Provide a name for your project, like **EdgeTreeClassifier**. |
   | Decription | Optional project description. |
   | Resource Group | Accept the default **Limited trial**. |
   | Project Types | **Classification** |
   | Classification Types | **Multiclass** | 
   | Domains | **General (compact)** |

5. Select **Create project**.

### Upload images and train your classifier

Creating an image classifier requires a set of training images, as well as test images. 

1. Clone or download sample images from the [Cognitive-CustomVision-Windows](https://github.com/Microsoft/Cognitive-CustomVision-Windows) repo. 

   ```
   git clone https://github.com/Microsoft/Cognitive-CustomVision-Windows.git
   ```

2. Return to your Custom Vision project and select **Add images**. 

3. Browse to the git repo that you cloned locally, and navigate to the first image folder, **Cognitive-CustomVision-Windows / Samples / Images / Hemlock**. Select all ten images in the folder and select **Open**. 

4. Add the tag **hemlock** to this group of images and press **enter** to apply the tag. 

5. Select **Upload 10 files**. 

   ![Upload hemlock-tagged files](./media/tutorial-deploy-custom-vision/upload-hemlock.png)

6. When the images are uploaded successfully, select **Done**.

7. Select **Add images** again.

8. Browse to the second image folder, **Cognitive-CustomVision-Windows / Samples / Images / Japanese Cherry**. Select all ten images in the folder and select **Open**. 

9. Add the tag **japanese cherry** and press **enter** to apply the tag. 

10. Select **Upload 10 files**. When the images are uploaded successfully, select **Done**. 

11. When both sets of images are tagged and uploaded, select **Train** to train the classifier. 

### Export your classifier

1. After training your classifier, select **Export** on the Performance page of the classifier. 

   ![Export image classifier](./media/tutorial-deploy-custom-vision/export.png)

2. Select **DockerFile** for the platform. 

3. Select **Linux** for the container type. 

4. Select **Export**. 

   ![Export as DockerFile with Linux containers](./media/tutorial-deploy-custom-vision/export-2.png)

5. When the export is complete, select **Download** and save the .zip package locally on your computer. Extract all files from the package. 


## Create an IoT Edge solution

Now you have a container version of your image classifier on your development machine. You need to publish your container to the container registry that you created at the beginning of this tutorial so that your IoT Edge device can pull the image classifier down. 

### Create a new solution

1. In Visual Studio Code, select **View** > **Integrated Terminal** to open the VS Code integrated terminal.

2. In the integrated terminal, enter the following command to install (or update) **cookiecutter**, which you use to create the IoT Edge solution template in VS Code:

    ```cmd/sh
    pip install --upgrade --user cookiecutter
    ```
   >[!Note]
   >Ensure the directory where cookiecutter will be installed is in your environment’s `Path` in order to make it possible to invoke it from a command prompt.

3. Select **View** > **Command Palette** to open the VS Code command palette. 

4. In the command palette, enter and run the command **Azure: Sign in** and follow the instructions to sign in your Azure account. If you're already signed in, you can skip this step.

5. In the command palette, enter and run the command **Azure IoT Edge: New IoT Edge solution**. In the command palette, provide the following information to create your solution: 

   1. Select the folder where you want to create the solution. 
   2. Provide a name for your solution, like **CustomVisionSolution**.
   3. Choose **Python Module** as the module template. 
   4. Name your module **Classifier**. 
   5. Specify the Azure container registry that you created in the previous section as the image repository for your first module. Replace **localhost:5000** with the login server value that you copied. The final string looks like \<registry name\>.azurecr.io/classifier.
 
   ![Provide Docker image repository](./media/tutorial-deploy-custom-vision/repository.png)

The VS Code window loads your IoT Edge solution workspace.

### Add your image classifier

The Python module template in Visual Studio code contains some sample code that you can run to test IoT Edge. You won't use that default code in this scenario, but will replace it with the image classifier container that you created. 

1. In your file explorer, copy all the contents from your extracted classifier package. It should be two folders, **app** and **azureml**, and two files, **Dockerfile** and **README**. 

2. Navigate to your IoT Edge solution and open the classifier module folder. If you used the suggested names in the previous section, the folder structure looks like **CustomVisionSolution / modules / Classifier**. 

3. Paste the files into the **Classifier** folder. 

4. Return to the Visual Studio Code. Your solution workspace should now show the image classifier files in the module folder. 

   ![Solution workspace with image classifier files](./media/tutorial-deploy-custom-vision/workspace.png)

5. Open the **module.json** file in the Classifier folder. 

6. Update the **platforms** parameter to point to the new Dockerfile that you added, and remove the ARM32 architecture option which isn't supported by Custom Vision. 

   ```json
   "platforms": {
       "amd64": "./Dockerfile"
   }
   ```

## Create a simulated camera module

In a real Custom Vision deployment, you would have a camera providing live images or video streams. For this scenario, you simulate the camera by building a module that sends a test image to the image classifier. 

In this section, you add a new module to the same CustomVisionSolution and provide code to create the simulated camera. 

1. In the same Visual Studio Code window, use the command palette to run **Azure IoT Edge: Add IoT Edge Module**. In the command palette, provide the following information for your new module: 

   | Prompt | Value | 
   | ------ | ----- |
   | Select deployment template file | Select the deployment.template.json file in the CustomVisionSolution workspace. |
   | Select module template | Select **Python Module** |
   | Provide a module name | Call your module **SimulatedCamera** |
   | Provide Docker image repository for the module | Replace **localhost:5000** with the login server value that you copied from your Azure Container Registry. The final string looks like **\<registryname\>.azurecr.io/simulatedcamera**. |

   The VS COde window loads your new module in the solution workspace, and updates the deployment.template.json file. Now you should see two module folders: Classifier and SimulatedCamera. 

2. 
















## Build your IoT Edge solution

In the previous sections, you created a solution with one module, and then added another to the deployment manifest template. Now, you need to build the solution, create container images for the modules, and push the images to your container registry. 

1. In the deployment.template.json file, give the IoT Edge runtime your registry credentials so that it can access your module images. Find the **moduleContent.$edgeAgent.properties.desired.runtime.settings** section. 
2. Insert the following JSON code after the **loggingOptions**:

   ```JSON
   "registryCredentials": {
       "myRegistry": {
           "username": "",
           "password": "",
           "address": ""
       }
   }
   ```

3. Insert your registry credentials into the **username**, **password**, and **address** fields. Use the values that you copied when you created your Azure Container Registry at the beginning of the tutorial.
4. Save the **deployment.template.json** file.
5. Sign in your container registry in Visual Studio Code so that you can push your images to your registry. Use the same credentials that you just added to the deployment manifest. Enter the following command in the integrated terminal: 

    ```csh/sh
    docker login -u <ACR username> <ACR login server>
    ```
    You will be prompted for the password. Paste your password into the prompt and press **Enter**.

    ```csh/sh
    Password: <paste in the ACR password and press enter>
    Login Succeeded
    ```

6. In the VS Code explorer, right-click the **deployment.template.json** file and select **Build IoT Edge solution**. 

## Deploy the solution to a device

You can set modules on a device through the IoT Hub, but you can also access your IoT Hub and devices through Visual Studio Code. In this section, you set up access to your IoT Hub then use VS Code to deploy your solution to your IoT Edge device. 

1. In the VS Code command palette, select **Azure IoT Hub: Select IoT Hub**.
2. Follow the prompts to sign in to your Azure account. 
3. In the command palette, select your Azure subscription then select your IoT Hub. 
4. In the VS Code explorer, expand the **Azure IoT Hub Devices** section. 
5. Right-click on the device that you want to target with your deployment and select **Create deployment for IoT Edge device**. 
6. In the file explorer, navigate to the **config** folder inside your solution and choose **deployment.json**. Click **Select Edge deployment manifest**. 

If the deployment is successful, and confirmation message is printed in the VS Code output. You can also check to see that all the modules are up and running on your device. 

On your IoT Edge device, run the following command to see the status of the modules. It may take a few minutes.

   ```bash
   sudo iotedge list
   ```








## Clean up resources

If you plan to continue to the next recommended article, you can keep the resources and configurations that you created and reuse them. You can also keep using the same IoT Edge device as a test device. 

Otherwise, you can delete the local configurations and the Azure resources that you created in this article to avoid charges. 

[!INCLUDE [iot-edge-clean-up-cloud-resources](../../includes/iot-edge-clean-up-cloud-resources.md)]

[!INCLUDE [iot-edge-clean-up-local-resources](../../includes/iot-edge-clean-up-local-resources.md)]



## Next steps

In this tutorial, you created an Azure Functions module that contains code to filter raw data generated by your IoT Edge device. When you're ready to build your own modules, you can learn more about how to [Develop Azure Functions with Azure IoT Edge for Visual Studio Code](how-to-develop-csharp-function.md). 

Continue on to the next tutorials to learn about other ways that Azure IoT Edge can help you turn data into business insights at the edge.

> [!div class="nextstepaction"]
> [Find averages using a floating window in Azure Stream Analytics](tutorial-deploy-stream-analytics.md)
