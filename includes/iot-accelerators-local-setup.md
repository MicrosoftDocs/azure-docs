---
 title: include file
 description: include file
 services: iot-accelerators
 author: avneet723
 ms.service: iot-accelerators
 ms.topic: include
 ms.date: 01/17/2019
 ms.author: avneet723
 ms.custom: include file
---

## Download the source code

The Remote Monitoring source code repositories include the source code and the Docker configuration files you need to run the microservices Docker images.

To clone and create a local version of the repository, use your command-line environment to navigate to a suitable folder on your local machine. Then run one of the following sets of commands to clone either the .NET repository:

To download the latest version of the .NET microservice implementations, run:

```cmd/sh
git clone --recurse-submodules https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet.git

# To retrieve the latest submodules, run the following command:

cd azure-iot-pcs-remote-monitoring-dotnet
git submodule foreach git pull origin master
```

> [!NOTE]
> These commands download the source code for all the microservices in addition to the scripts you use to run the microservices locally. Although you don't need the source code to run the microservices in Docker, the source code is useful if you later plan to modify the solution accelerator and test your changes locally.

## Deploy the Azure services

Although this article shows you how to run the microservices locally, they depend on Azure services running in the cloud. Use the following script to deploy the Azure services. The following script examples assume you're using the .NET repository on a Windows machine. If you're working in another environment, adjust the paths, file extensions, and path separators appropriately.

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