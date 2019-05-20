---
title: Deploy the remote monitoring solution locally (via IntelliJ IDE) - Azure | Microsoft Docs 
description: This how-to guide shows you how to deploy the remote monitoring solution accelerator to your local machine using IntelliJ for testing and development.
author: v-krghan
manager: dominicbetts
ms.author: v-krghan
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 01/24/2019
ms.topic: conceptual
---

# Deploy the Remote Monitoring solution accelerator locally - IntelliJ

[!INCLUDE [iot-accelerators-selector-local](../../includes/iot-accelerators-selector-local.md)]

This article shows you how to deploy the Remote Monitoring solution accelerator to your local machine for testing and development. You learn how to run the microservices in IntelliJ. A local microservices deployment uses the following cloud services: IoT Hub, Cosmos DB, Azure Streaming Analytics, and Azure Time Series Insights services in the cloud.

If you want to run the Remote Monitoring solution accelerator in Docker on your local machine, see [Deploy the Remote Monitoring solution accelerator locally - Docker](iot-accelerators-remote-monitoring-deploy-local-docker.md).

## Prerequisites

To deploy the Azure services used by the Remote Monitoring solution accelerator, you need an active Azure subscription.

If you don’t have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).

### Machine setup

To complete the local deployment, you need the following tools installed on your local development machine:

* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com)
* [Java 8](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/)
* [IntelliJ Plugin Scala](https://plugins.jetbrains.com/plugin/1347-scala)
* [IntelliJ Plugin SBT](https://plugins.jetbrains.com/plugin/5007-sbt)
* [IntelliJ Plugin SBT Executor](https://plugins.jetbrains.com/plugin/7247-sbt-executor)
* [Nginx](https://nginx.org/en/download.html)
* [Node.js v8](https://nodejs.org/) - this software is a prerequisite for the PCS CLI that the scripts use to create Azure resources. Don't use Node.js v10.

> [!NOTE]
> IntelliJ IDE is available for Windows and Mac.

## Download the source code

The Remote Monitoring source code repositories include the source code and the Docker configuration files you need to run the microservices Docker images.

To clone and create a local version of the repository, use your command-line environment to navigate to a suitable folder on your local machine. Then run one of the following sets of commands to clone the java repository:

To download the latest version of the java microservice implementations, run:


```cmd/sh
git clone --recurse-submodules https://github.com/Azure/azure-iot-pcs-remote-monitoring-java.git

# To retrieve the latest submodules, run the following command:

cd azure-iot-pcs-remote-monitoring-java
git submodule foreach git pull origin master
```

> [!NOTE]
> These commands download the source code for all the microservices in addition to the scripts you use to run the microservices locally. Although you don't need the source code to run the microservices in Docker, the source code is useful if you later plan to modify the solution accelerator and test your changes locally.

## Deploy the Azure services

Although this article shows you how to run the microservices locally, they depend on Azure services running in the cloud. Use the following script to deploy the Azure services. The following script examples assume you're using the java repository on a Windows machine. If you're working in another environment, adjust the paths, file extensions, and path separators appropriately.

### Create new Azure resources

If you've not yet created the required Azure resources, follow these steps:

1. In your command-line environment, navigate to the **\services\scripts\local\launch** folder in your cloned copy of the repository.

1. Run the following commands to install the **pcs** CLI tool and sign in to your Azure account:

    ```cmd
    npm install -g iot-solutions
    pcs login
    ```

1. Run the **start.cmd** script. The script prompts you for the following information:
   * A solution name.
   * The Azure subscription to use.
   * The location of the Azure datacenter to use.

     The script creates resource group in Azure with your solution name. This resource group contains the Azure resources the solution accelerator uses. You can delete this resource group once you no longer need the corresponding resources.

     The script also adds a set of environment variables with a prefix **PCS** to your local machine. These environment variables provide the details for Remote Monitoring to be able to read from an Azure Key Vault resource. This Key Vault resource is where Remote Monitoring will read its configuration values from.

     > [!TIP]
     > When the script completes, it also saves the environment variables to a file called **\<your home folder\>\\.pcs\\\<solution name\>.env**. You can use them for future solution accelerator deployments. Note that any environment variables set on your local machine override values in the **services\\scripts\\local\\.env** file when you run **docker-compose**.

1. Exit from your command-line environment.

### Use existing Azure resources

If you've already created the required Azure resources, create the corresponding environment variables on your local machine.
Set the environment variables for the following:
* **PCS_KEYVAULT_NAME** - Name of the Azure Key Vault resource
* **PCS_AAD_APPID** - The AAD application ID
* **PCS_AAD_APPSECRET** - The AAD application secret

Configuration values will be read from this Azure Key Vault resource. These environment variables may be saved in the **\<your home folder\>\\.pcs\\\<solution name\>.env** file from the deployment. Note that environment variables set on your local machine override values in the **services\\scripts\\local\\.env** file when you run **docker-compose**.

Some of the configuration needed by the microservice is stored in an instance of **Key Vault** that was created on initial deployment. The corresponding variables in keyvault should be modified as needed.

## Run the microservices

In this section, you run the Remote Monitoring microservices. You run the web UI natively, the Device Simulation, Auth and ASA Manager service in Docker, and the microservices in IntelliJ.

### Run the device simulation service

Open a new command prompt window to be sure that you have access to the environment variables set by the **start.cmd** script in the previous section.

Run the following command to launch the Docker container for the device simulation service. The service simulates devices for the remote monitoring solution.

```cmd
<path_to_cloned_repository>\services\device-simulation\scripts\docker\run.cmd
```

### Run the Auth service

Open a new command prompt window and run the following command to launch the Docker container for the Auth service. The service allows to manage the users authorized to access Azure IoT Solutions.

```cmd
<path_to_cloned_repository>\services\auth\scripts\docker\run.cmd
```

### Run the ASA Manager service

Open a new command prompt window and run the following command to launch the Docker container for the ASA Manager service. The service allows the management of Azure Stream Analytics (ASA) jobs, including setting the configuration and starting, stopping, and monitoring their statuses.

```cmd
<path_to_cloned_repository>\services\asa-manager\scripts\docker\run.cmd
```

### Deploy all other microservices on local machine

The following steps show you how to run the Remote Monitoring microservices in IntelliJ:

#### Import Project

1. Launch IntelliJ IDE
1. Select **Import Project** and choose **azure-iot-pcs-remote-monitoring-java\services\build.sbt**

#### Create Run Configurations

1. Select **Run > Edit Configurations**
1. Select **Add New Configuration > sbt task** 
1. Enter **Name** and enter **Tasks** as run 
1. Select the **Working Directory** based on the service you want to run
1. Click **Apply > Ok** to save your choices.
1. Create run configurations for the following services:
    * WebService (services\config)
    * WebService (services\device-telemetry)
    * WebService (services\iothub-manager)
    * WebService (services\storage-adapter)

As an example, the following image shows adding configuration for a service:

[![Add-Configuration](./media/deploy-locally-intellij/run-configurations.png)](./media/deploy-locally-intellij/run-configurations.png#lightbox)


#### Create Compound Configuration

1. To run all the Services, together select **Add new Configuration > Compound**
1. Enter the **Name** and **add sbt tasks**
1. Click **Apply > Ok** to save your choices.

As an example, the following image shows adding all sbt tasks to single configuration:

[![Add-All-Services](./media/deploy-locally-intellij/all-services.png)](./media/deploy-locally-intellij/all-services.png#lightbox)

Click **Run** to build and run the web services on the local machine.

Each web service opens a command prompt and web browser window. At the command prompt, you see output from the running service, and the browser window lets you monitor the status. Don't close the command prompts or web pages, this action stops the web service.


To access the status of the services, you can navigate to the following URLs:
* IoT-Hub Manager [http://localhost:9002/v1/status](http://localhost:9002/v1/status)
* Device Telemetry  [http://localhost:9004/v1/status](http://localhost:9004/v1/status)
* config [http://localhost:9005/v1/status](http://localhost:9005/v1/status)
* storage-adapter [http://localhost:9022/v1/status](http://localhost:9022/v1/status)


### Start the Stream Analytics job

Follow these steps to start the Stream Analytics job:

1. Navigate to the [Azure portal](https://portal.azure.com).
1. Navigate to the **Resource group** created for your solution. The name of the resource group is the name you chose for your solution when you ran the **start.cmd** script.
1. Click the **Stream Analytics job** in the list of resources.
1. On the Stream Analytics job **overview** page, click the **Start** button. Then click **Start** to start the job now.

### Run the web UI

In this step, you start the web UI. Open a new command prompt window to be sure that you have access to the environment variables set by the **start.cmd** script. Navigate to the **webui** folder in your local copy of the repository and run the following commands:

```cmd
npm install
npm start
```

When the start is complete, your browser displays the page **http:\//localhost:3000/dashboard**. The errors on this page are expected. To view the application without errors, complete the following step.

### Configure and run NGINX

Set up a reverse proxy server to link the web application and microservices running on your local machine:

* Copy the **nginx.conf** file from the **webui\scripts\localhost** folder in your local copy of the repository to the **nginx\conf** install directory.
* Run **nginx**.

For more information about running **nginx**, see [nginx for Windows](https://nginx.org/en/docs/windows.html).

### Connect to the dashboard

To access the Remote Monitoring solution dashboard, navigate to http:\//localhost:9000 in your browser.

## Clean up

To avoid unnecessary charges, when you've finished your testing remove the cloud services from your Azure subscription. To remove the services, navigate to the [Azure portal](https://ms.portal.azure.com) and delete the resource group that the **start.cmd** script created.

You can also delete the local copy of the Remote Monitoring repository created when you cloned the source code from GitHub.

## Next steps

Now that you've deployed the Remote Monitoring solution, the next step is to [explore the capabilities of the solution dashboard](quickstart-remote-monitoring-deploy.md).
