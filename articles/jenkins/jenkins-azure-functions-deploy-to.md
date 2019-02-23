---
title: Deploy to Azure Functions using the Jenkins Azure Function plugin
description: Learn how to deploy to Azure Functions using the Jenkins Azure Function plugin
ms.service: jenkins
keywords: jenkins, azure, devops, java, azure functions
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 02/23/2019
---

# Deploy to Azure Functions using the Jenkins Azure Function plugin

[Azure Functions](/azure/azure-functions/) is a serverless compute service that enables you to run code on-demand without having to explicitly provision or manage infrastructure. This tutorial shows how to deploy a Java function to Azure Function using the Azure Function plugin.

## Create an Azure Function

The Azure Function plugin does not provision the function app if it doesn't already exist. To create an Azure Function with the Java runtime stack, use either the [Azure portal][https://portal.azure.com] or [Azure CLI](/cli/azure/?view=azure-cli-latest).

The following steps show how to create a an Azure Function app using Azure CLI:

1. Create a resource group, inserting your resource group name for the &lt;resource-group-name> placeholder.

    ```cli
    az group create --name <resource-group-name> --location eastus
    ```

1. Create an Azure storage account, inserting your storage name and resource group name for the &lt;storage_name> and &lt;resource-group-name> placeholders, respectively.
 
    ```cli
    az storage account create --name <storage-name> --location eastus --resource-group <resource-group-name> --sku Standard_LRS    
    ```

1. Create the test Azure Function app, inserting your resource group name, app name, and storage name for the &lt;resource-group>, &lt;app-name>, &lt;storage-name> placeholders, respectively.

    ```cli
    az functionapp create --resource-group <resource-group-name> --consumption-plan-location eastus --name <app-name> --storage-account <storage-name>
    ```
    
1. Update to version 2.x runtime, inserting your function app name and resource group name for the &lt;function-app> and &lt;resource-group> placeholders, respectively.

    ```cli
    az functionapp config appsettings set --name <function-app> --resource-group <resource-group-name> --settings FUNCTIONS_EXTENSION_VERSION=~2
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

1. In the Jenkins dashboard, install the following plugins:

    - Azure Function Plugin
    - EnvInject Plugin

1. Jenkins needs an Azure service principal to authenticate and access Azure resources. Refer to the [Deploy to Azure App Service][./tutorial-jenkins-deploy-web-app-azure-app-service#create-service-principal.md] for step-by-step instructions.

1. Using the Azure service principal, add a "Microsoft Azure Service Principal" credential type in Jenkins. Refer to the [Deploy to Azure App Service][./tutorial-jenkins-deploy-web-app-azure-app-service#add-service-principal-to-jenkins.md] tutorial.

## Create a Jenkins Pipeline

In this section, you create the [Jenkins Pipeline][<https://jenkins.io/doc/book/pipeline/>].

1. In the Jenkins dashboard, create a Pipeline.

1. Enable **Prepare an environment for the run**.

1. Add the following environment variables in **Properties Content**, replacing the placeholders with the appropriate values for your environment:

    ```
    AZURE_CRED_ID=<service-principal-credential-id>
    RES_GROUP=<resource-group-name>
    FUNCTION_NAME=<app-name>
    ```
    
1. In the **Pipeline->Definition** section, select **Pipeline script from SCM**.

1. Enter the SCM repo URL and script path using the provided [script example][<https://github.com/VSChina/odd-or-even-function/blob/master/doc/resources/jenkins/JenkinsFile>].

## Build and deploy the Java Function to Azure Functions

It is now time to run the Jenkins job.

1. First, obtain the authorization key via the instructions in the [Azure Function HTTP triggers and bindings][/azure/azure-functions/functions-bindings-http-webhook#authorization-keys] article.

1. In your browser, enter the following URL, replacing the placeholders with the appropriate values: 

    ```
    https://<app-name>.azurewebsites.net/api/HttpTrigger-Java?code=<authorization-key>&number=<input-number>
    ```
1. You should see output similar to the following (depending on your `input-number`:

    ```
    The number 365 is Odd.
    ```
## Clean Up Resources

Delete the Azure resources created in this tutorial by running the following command:

    ```
    az group delete -y --no-wait -n <resource-group-name>
    ```