---
title: Develop your first module - Azure IoT Edge | Microsoft Docs
description: This tutorial walks through the process of setting up your development machine and cloud resources to develop IoT Edge modules
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 03/26/2019
ms.topic: tutorial
ms.service: iot-edge
services: iot-edge
ms.custom: mvc
---

# Tutorial: Develop an IoT Edge module

In the quickstart articles, you created an IoT Edge device and deployed a pre-built module from the Azure Marketplace. This tutorial walks through what it takes to develop and deploy your own code to an IoT Edge device. This tutorial is a useful prerequisite for all the other tutorials, which will go into more detail about specific programming languages or Azure services. 

This tutorial uses the example of deploying a **C module to a Linux device**. This example was chosen because it has the fewest prerequisites, so that you can learn about the development tools without worrying about whether you have the right libraries installed. Once you understand the development concepts, then you can choose your preferred language or Azure service to dive into the details. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up your development machine.
> * Use the IoT Edge tools for Visual Studio Code to create a new project.
> * Build your project as a container and store it in an Azure container registry.
> * Deploy your code to an IoT Edge device. 


[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

A development machine:

* You can use your own computer or a virtual machine, depending on your development preferences.
* Most operating systems that can run a container engine can be used for IoT Edge development. This tutorial uses a Windows computer, but points out known differences on MacOS or Linux. 

An Azure IoT Edge device:

* We recommend that you don't run IoT Edge on your development machine, but instead use a separate device. This distinction between development machine and IoT Edge device more accurately mirrors a true deployment scenario, and helps to keep the different concepts straight.
* If you don't have a second device available, use the quickstart article to create an IoT Edge device in Azure with a [Linux virtual machine](quickstart-linux.md). This tutorial uses a Linux IoT Edge device, but points out differences for Windows devices. 

Cloud resources:

* Along with your working IoT Edge device, you should also have a free or standard-tier [IoT hub](../iot-hub/iot-hub-create-through-portal.md) in Azure. 

## Key concepts

This tutorial walks through the development of an IoT Edge module. An *IoT Edge module*, or sometimes just *module* for short, is a container that contains executable code. You can deploy one or more modules to an IoT Edge device. Modules perform specific tasks like ingesting data from sensors, performing data analytics or data cleaning operations, or sending messages to an IoT hub. For more information, see [Understand Azure IoT Edge modules](iot-edge-modules.md).

When developing IoT Edge modules, it's important to understand the difference between the development machine and the target IoT Edge device where the module will eventually be deployed. The container that you build to hold your module code must match the operating system (OS) of the target device. For example, the most common scenario is someone developing a module on a Windows computer intending to target a Linux IoT Edge device. In that case, the container operating system would be Linux. This tutorial demonstrates that scenario and tries to explicitly call out when a step applies to the *development machine OS* or the *container OS*.

## Install container engine

IoT Edge modules are packaged as containers, so you need a container engine on your development machine to build and manage the containers. We recommend using Docker Desktop for development because of its many features and popularity as a container engine. With Docker Desktop on a Windows device, you can switch between Linux containers and Windows containers so that you can easily develop modules for different types of IoT Edge devices. 

Use the Docker documentation to install on your development machine: 

* [Install Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/install/)

  * When you install Docker Desktop for Windows, you're asked whether you want to use Linux or Windows containers. This decision can be changed at any time using an easy switch. For this tutorial, we assume Linux containers. For more information, see [Switch between Windows and Linux containers](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers).

* [Install Docker Desktop for Mac](https://docs.docker.com/docker-for-mac/install/)

* Read [About Docker CE](https://docs.docker.com/install/) for installation information on several Linux platforms

## Install VS Code and tools

If you're familiar with container development, you can use your preferred editors and tools to develop IoT Edge modules. If not, we recommend using the IoT extensions for Visual Studio Code or Visual Studio 2017 that were built specifically to assist with IoT Edge development. These extensions provide project templates, automate the creation of the deployment manifest, and allow you to monitor and manage IoT Edge devices. 

Visual Studio 2017 currently supports the following development options:
* Languages: C and C#
* Device architecture: AMD64

Visual Studio Code currently supports the following development options:
* Languages: C, C#, Java, Node.js, and Python
* Device architecture: AMD64, ARM32v7
* Cloud services: Azure Functions (C#), Azure Machine Learning, Azure Stream Analytics, Azure Marketplace

This tutorial uses Visual Studio Code for development, because it covers more scenarios. If you prefer to use Visual Studio 2017, you can learn more about it in [Use Visual Studio 2017 to develop and debug modules](how-to-visual-studio-develop-csharp-module.md).

1. Install [Visual Studio Code](https://code.visualstudio.com/) on your development machine. 

2. Once the installation is finished, select **View** > **Extensions**. 

3. Search for **Azure IoT Tools**, which is actually a collection of extensions that help you interact with IoT Hub and IoT devices, as well as developing IoT Edge modules. 

4. Select **Install**. Each included extension installs individually. 

5. When the extensions are done installing, open the command palette by selecting **View** > **Command Palette**. 

6. In the command palette, search for and select **Azure: Sign in**. Follow the prompts to sign in to your Azure account. 

7. In the command palette again, search for and select **Azure IoT Hub: Select IoT Hub**. Follow the prompts to select your Azure subscription and IoT hub. 

7. Open the explorer section of Visual Studio Code by either selecting the icon on the left, or by selecting **View** > **Explorer**. 

8. At the bottom of the explorer section, expand the collapsed **Azure IoT Hub Devices** menu. You should see the devices and IoT Edge devices associated with the IoT hub that you selected through the command palette. 

## Create a container registry

In this tutorial, you use the Azure IoT Tools for Visual Studio Code to build a module and create a **container image** from the files. Then you push this image to a **registry** that stores and manages your images. Finally, you deploy your image from your registry to run on your IoT Edge device.

You can use any Docker-compatible registry to hold your container images. Two popular Docker registry services are [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/) and [Docker Hub](https://docs.docker.com/docker-hub/repos/#viewing-repository-tags). This tutorial uses Azure Container Registry.

If you don't already have a container registry, follow these steps to create a new one in Azure:

1. In the [Azure portal](https://portal.azure.com), select **Create a resource** > **Containers** > **Container Registry**.

2. Provide the following values to create your container registry:

   | Field | Value |
   | ----- | ----- |
   | Registry name | Provide a unique name. |
   | Subscription | Select a subscription from the drop-down list. |
   | Resource group | We recommend that you use the same resource group for all of the test resources that you create during the IoT Edge quickstarts and tutorials. For example, **IoTEdgeResources**. |
   | Location | Choose a location close to you. |
   | Admin user | Set to **Enable**. |
   | SKU | Select **Basic**. |

5. Select **Create**.

6. After your container registry is created, browse to it, and then select **Access keys**.

7. Copy the values for **Login server**, **Username**, and **Password** and save them somewhere convenient. You use these values throughout this tutorial to provide access to the container registry.

   ![Copy login server, username, and password for container registry](./media/tutorial-develop-setup/registry-access-key.png)

## Create a new module template

The Azure IoT Tools extension provides project templates for all supported IoT Edge module languages in Visual Studio Code. These templates have all the files and code that you need to deploy a working module to test IoT Edge, or give you a starting point to customize the template with your own business logic. 

For this tutorial, we use the C module template because it has no additional prerequisites to install. However, IoT Edge modules written in C don't support Windows containers. You can quickly create a Linux device following the quickstart for IoT Edge on [Linux virtual machines](quickstart-linux.md). If you are only interested in developing for Windows containers, you can follow this tutorial up until the deployment step. Then, continue onto one of the other tutorials for more examples. 

1. In the Visual Studio Code command palette, search for and select **Azure IoT Edge: New IoT Edge Solution**. Follow the prompts and use the following values to create your solution: 

   | Field | Value |
   | ----- | ----- |
   | Select folder | Choose the location on your development machine for VS Code to create the solution files. |
   | Provide a solution name | Enter a descriptive name for your solution or accept the default **EdgeSolution**. |
   | Select module template | Choose **C Module**. |
   | Provide a module name | Accept the default **SampleModule**. |
   | Provide Docker image repository for the module | An image repository includes the name of your container registry and the name of your container image. Your container image is prepopulated from the name you provided in the last step. Replace **localhost:5000** with the login server value from your Azure container registry. You can retrieve the login server from the Overview page of your container registry in the Azure portal. <br><br> The final image repository looks like \<registry name\>.azurecr.io/samplemodule. |
 
   ![Provide Docker image repository](./media/tutorial-develop-setup/image-repository.png)

2. Once your new solution loads in the Visual Studio Code window, take a moment to familiarize yourself with the files it created: 

   * The **.vscode** folder contains a file called **launch.json**, which is used for debugging modules.
   * The **modules** folder contains a folder for each module in your solution. Right now, that should only be **SampleModule**, or whatever name you gave to the module. The SampleModule folder contains the main program code, the module metadata, and several Docker files. 
   * The **.env** file holds the credentials to your container registry. These credentials are shared with your IoT Edge device so that it has acceess to pull the container images. 
   * The **deployment.debug.template.json** file and **deployment.template.json** file are templates that help you create a deployment manifest. A *deployment manifest* is a file that defines exactly which modules you want deployed on a device, how they should be configured, and how they can communicate with each other and the cloud. The template files use pointers for some values. When you transform the template into a true deployment manifest, the pointers are replaced with values taken from other solution files. Locate the two common placeholders in your deployment template: 

     * In the registry credentials section, the address is auto-filled from the information you provided when you created the solution. However, the username and password reference the variables stored in the .env file. This is for security, as the .env file is git ignored, but the deployment template is not. 
     * In the SampleModule section, the container image isn't filled in even though you provided the image repository when you created the solution. This placeholder points to the **module.json** file inside the SampleModule folder. If you go to that file, you'll see that the image field does contain the repository, but also a tag value which is made up of the version and the platform of the container. You can iterate the version manually as part of your development cycle, and you select the container platform using a switcher that we'll introduce later in this section. 

