---
title: Deploy to Azure Functions using the Jenkins Azure Function plugin
description: Learn how to deploy to Azure Functions using the Jenkins Azure Function plugin
ms.service: jenkins
keywords: jenkins, azure, devops, azure functions
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 02/22/2019
---

# Deploy to Azure Functions using the Jenkins Azure Function plugin

[Azure Functions](/azure/azure-functions/) is a serverless compute service that enables you to run code on-demand without having to explicitly provision or manage infrastructure. This tutorial shows how to deploy a Java function to Azure Function using the Azure Function plugin.

## Create an Azure Function

The Azure Function plugin does not provision the function app if it doesn't already exist. To create an Azure Function with the Java runtime stack, use either the [Azure portal][https://portal.azure.com] or [Azure CLI](/cli/azure/?view=azure-cli-latest).

The following steps show how to create a an Azure Function app using Azure CLI:

1. Create a resource group, inserting your resource group name for the &lt;resource-group> placeholder.

    ```cli
    az group create --name <resource-group> --location eastus
    ```

1. Create an Azure storage account, inserting your storage name and resource group name for the &lt;storage_name> and &lt;resource-group> placeholders, respectively.
 
    ```cli
    az storage account create --name <storage-name> --location eastus --resource-group <resource-group> --sku Standard_LRS    
    ```

1. Create the test Azure Function app, inserting your resource group name, app name, and storage name for the &lt;resource-group>, &lt;app-name>, &lt;storage-name> placeholders, respectively.

    ```cli
    az functionapp create --resource-group <resource-group> --consumption-plan-location eastus --name <app-name> --storage-account <storage-name>
    ```
    
1. Update to version 2.x runtime, inserting your function app name and resource group name for the &lt;function-app> and &lt;resource-group> placeholders, respectively.

    ```cli
    az functionapp config appsettings set --name <function-app> --resource-group <resource-group> --settings FUNCTIONS_EXTENSION_VERSION=~2
    ```

## Prepare Jenkins server

The following steps explain how to prepare the Jenkins server:

1. Deploy a [Jenkins server][https://aka.ms/jenkins-on-azure] on Azure. If you don't already have an instance of Jenkins server installed, the article, [Create a Jenkins server on Azure][jenkins/install-jenkins-solution-template] guides you through the process.

1. Sign in to the Jenkins instance with SSH.

1. On the Jenkins instance, install maven using the following command:

    ```terminal
    sudo apt install -y maven
    ```

1. On the Jenkins instance, install the [Azure Functions Core Tools][azure/azure-functions/functions-run-local] by issuing the following commands at a terminal prompt:

    ```terminal
    wget -q https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb
    sudo dpkg -i packages-microsoft-prod.deb
    sudo apt-get update
    sudo apt-get install azure-functions-core-tools
    ```

1. In the Jenkins dashboard, install the plugins. Click 'Manage Jenkins' -> 'Manage Plugins' -> 'Available', then search and install the following plugins if not already installed: Azure Function Plugin, EnvInject Plugin.

Jenkins needs an Azure service principal for autheticating and accessing Azure resources. Refer to the Crease service principal section in the Deploy to Azure App Service tutorial.

Then using the Azure service principal, add a "Microsoft Azure Service Principal" credential type in Jenkins. Refer to the Add Service principal section in the Deploy to Azure App Service tutorial. This is the [your crendential id of service principal] mentioned in Step 2 under "Create Job"

Create job
Add a new job in type "Pipeline".

Enable "Prepare an environment for the run", and add the following environment variables in "Properties Content":

AZURE_CRED_ID=[your credential id of service principal]
RES_GROUP=[your resource group of the function app]
FUNCTION_NAME=[the name of the function]
For [the name of the function], make sure you use the same name when you used to create the function app in Azure.

Choose "Pipeline script from SCM" in "Pipeline" -> "Definition".

Fill in the SCM repo url and script path. (Script Example)

Build and Deploy Java Function to Azure Function
Run jenkins job.

Open your favorite browser and input https://<function_name>.azurewebsites.net/api/HttpTrigger-Java?code=<key>&number=<input_number> to trigger the function. You will get the output like The number 365 is Odd..

Please refer to Azure Function HTTP triggers and bindings to get the authorization key.

Clean Up Resources
Delete the Azure resources you just created by running below command:

az group delete -y --no-wait -n <your-resource-group-name>