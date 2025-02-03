---
title: "Configure the APM Java agent with Init Containers"
titleSuffix: Azure Container Apps
description: Learn how to configure the Application Performance Management (APM) Java agent with init containers in Azure Container Apps.
customer intent: As a developer, I want to configure the APM Java agent with init containers in Azure Container Apps so that I can monitor and manage application performance.
services: container-apps
ms.service: azure-container-apps
ms.custom: devx-track-azurecli
ms.topic: tutorial
ms.date: 02/03/2025
ms.author: kuzhong
author: KarlErickson
---

# Tutorial: Configure the Application Performance Management (APM) Java agent with init containers in Azure Container Apps

In this tutorial, you configure the Application Performance Management (APM) Java agent with init containers in Azure Container Apps. APM helps power observability for your container apps. You can package the APM plugin in the same image or Dockerfile with your app, but it binds together the management concerns, like release and Common Vulnerabilities and Exposures (CVE) mitigation. Rather than binding the concerns together, you can use the Java agent and init containers in Azure Container Apps to inject APM solutions without modifying your app image.

In this tutorial, you:

> [!div class="checklist"]
> * Prepare an image to set up the Java agent and push it to an Azure Container Registry.
> * Create a Container Apps environment and a container app as the target Java app.
> * Configure init containers and volume mounts to set up Application Insights integration.

## Prerequisites

- An Azure subscription. [Create one for free.](https://azure.microsoft.com/free/).
- An instance of [Application Insights](/azure/azure-monitor/app/app-insights-overview).
- An instance of Azure Container Registry or another container image registry.
- [Docker](https://www.docker.com/), to build an image.
- The latest version of the [Azure CLI](/cli/azure/install-azure-cli).

## Set up the environment

Use the following steps to define environment variables and ensure your Container Apps extension is up to date:

1. Define environment variables by using the following commands:

    # [Bash](#tab/bash)

    ```bash
    export SUBSCRIPTION_ID="<SUBSCRIPTION_ID>" # Replace with your own Azure subscription ID
    export APP_INSIGHTS_RESOURCE_ID="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/my-resource-group/providers/microsoft.insights/components/my-app-insights"
    export CONTAINER_REGISTRY_NAME="myacr"
    export RESOURCE_GROUP="my-resource-group"
    export ENVIRONMENT_NAME="my-environment"
    export CONTAINER_APP_NAME="my-container-app"
    export LOCATION="eastus"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $SUBSCRIPTION_ID="<SUBSCRIPTION_ID>" # Replace with your own Azure subscription ID
    $APP_INSIGHTS_RESOURCE_ID="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/my-resource-group/providers/microsoft.insights/components/my-app-insights"
    $CONTAINER_REGISTRY_NAME="myacr"
    $RESOURCE_GROUP="my-resource-group"
    $ENVIRONMENT_NAME="my-environment"
    $CONTAINER_APP_NAME="my-container-app"
    $LOCATION="eastus"
    ```

1. Sign in to the Azure CLI by using the following commands:

    # [Bash](#tab/bash)

    ```azurecli
    az login
    az account set --subscription $SUBSCRIPTION_ID
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az login
    az account set --subscription $SUBSCRIPTION_ID
    ```

1. Use the following commands to ensure that you have the latest version of the Azure CLI extensions for Container Apps and Application Insights:

    # [Bash](#tab/bash)

    ```azurecli
    az extension add --name containerapp --upgrade
    az extension add --name application-insights --upgrade
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az extension add --name containerapp --upgrade
    az extension add --name application-insights --upgrade
    ```

1. Retrieve the connection string for your Application Insights instance by using the following commands:

    # [Bash](#tab/bash)

    ```azurecli
    CONNECTION_STRING=$(az monitor app-insights component show \
        --ids $APP_INSIGHTS_RESOURCE_ID \
        --query connectionString)
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $CONNECTION_STRING=(az monitor app-insights component show `
        --ids $APP_INSIGHTS_RESOURCE_ID `
        --query connectionString)
    ```

## Prepare the container image

To build a setup image for the Application Insights Java agent, use the following steps in the same directory:

1. Create a Dockerfile with the following contents:
    
    ```dockerfile
    FROM mcr.microsoft.com/cbl-mariner/base/core:2.0
    
    ARG version="3.5.4"
    
    RUN tdnf update -y && tdnf install -y curl ca-certificates
    
    RUN curl -L "https://github.com/microsoft/ApplicationInsights-Java/releases/download/${version}/applicationinsights-agent-${version}.jar" > agent.jar
    
    ADD setup.sh /setup.sh
    
    ENTRYPOINT ["/bin/sh", "setup.sh"]
    ```

1. Create a **setup.sh** file with the following contents:

    ```bash
    #!/bin/sh

    if [[ -z "$CONNECTION_STRING" ]]; then
      echo "Environment variable CONNECTION_STRING is not found. Exiting..."
      exit 1
    else
      echo "{\"connectionString\": \"$CONNECTION_STRING\"}" > /java-agent/applicationinsights.json
      cp agent.jar /java-agent/agent.jar
    fi
    ```

1. Create an image by using the following command:

    # [Bash](#tab/bash)

    ```bash
    docker build . --tag "$CONTAINER_REGISTRY_NAME.azurecr.io/samples/java-agent-setup:1.0.0"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    docker build . --tag "$CONTAINER_REGISTRY_NAME.azurecr.io/samples/java-agent-setup:1.0.0"
    ```

1. Push the image to Azure Container Registry or another container image registry by using the following commands:
    
    # [Bash](#tab/bash)

    ```azurecli
    az acr login --name $CONTAINER_REGISTRY_NAME
    docker push "$CONTAINER_REGISTRY_NAME.azurecr.io/samples/java-agent-setup:1.0.0"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az acr login --name $CONTAINER_REGISTRY_NAME
    docker push "$CONTAINER_REGISTRY_NAME.azurecr.io/samples/java-agent-setup:1.0.0"
    ```

> [!TIP]
> You can find code relevant to this step in the [azure-container-apps-java-samples](https://github.com/Azure-Samples/azure-container-apps-java-samples) GitHub repo.

## Create a Container Apps environment and a container app as the target Java app

To create a Container Apps environment and a container app as the target Java app, use the following steps:

1. Create a Container Apps environment by using the following command:

    # [Bash](#tab/bash)

    ```azurecli
    az containerapp env create \
        --name $ENVIRONMENT_NAME \
        --resource-group $RESOURCE_GROUP \
        --location "$LOCATION" \
        --query "properties.provisioningState"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az containerapp env create `
        --name $ENVIRONMENT_NAME `
        --resource-group $RESOURCE_GROUP `
        --location "$LOCATION" `
        --query "properties.provisioningState"
    ```

    ---

    After you successfully create the Container Apps environment, the command line returns a `Succeeded` message.

1. Create a container app for further configuration by using the following command:

    # [Bash](#tab/bash)

    ```azurecli
    az containerapp create \
        --name $CONTAINER_APP_NAME \
        --environment $ENVIRONMENT_NAME \
        --resource-group $RESOURCE_GROUP \
        --query "properties.provisioningState"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az containerapp create `
        --name $CONTAINER_APP_NAME `
        --environment $ENVIRONMENT_NAME `
        --resource-group $RESOURCE_GROUP `
        --query "properties.provisioningState"
    ```

    ---

    After you create the container app, the command line returns a `Succeeded` message.

## Configure init container, secrets, environment variables, and volumes to set up Application Insights integration

Use the following steps to configure your init container with secrets, environment variables, and volumes. This configuration allows you to use the stored information with your Application Insights instance.

1. Write the current configuration of the running container app to an **app.yaml** file in the current directory, by using the following command:

    # [Bash](#tab/bash)

    ```azurecli
    az containerapp show \
        --resource-group $RESOURCE_GROUP \
        --name $CONTAINER_APP_NAME \
        --output yaml \
    > app.yaml
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az containerapp show `
        --resource-group $RESOURCE_GROUP `
        --name $CONTAINER_APP_NAME `
        --output yaml `
    > app.yaml
    ```

1. Use the following steps to edit your **app.yaml** file. The edits add secrets, ephemeral storage, and an init container to the file, and update the app container.

    1. Add a secret for the Application Insights connection string by using the following example. Replace `$CONNECTION_STRING` with your Application Insights connection string.

       ```yaml
       properties:
         configuration:
            secrets:
            - name: app-insights-connection-string
              value: $CONNECTION_STRING
        ```

    1. Add an ephemeral storage volume for Java agent files by using the following example:

       ```yaml
       properties:
         template:
           volumes:
           - name: java-agent-volume
             storageType: EmptyDir
        ```

    1. Add an init container with volume mounts and environment variables by using the following example. Replace `<CONTAINER_REGISTRY_NAME>` with your Azure Container Registry name.

       ```yaml
       properties:
         template:
           initContainers:
           - image: <CONTAINER_REGISTRY_NAME>.azurecr.io/samples/java-agent-setup:1.0.0
             name: java-agent-setup
             resources:
               cpu: 0.25
               memory: 0.5Gi
             env:
             - name: CONNECTION_STRING
               secretRef: app-insights-connection-string
             volumeMounts:
             - mountPath: /java-agent
               volumeName: java-agent-volume
       ```

    1. Update the app container with volume mounts and environment variables by using the following example:
  
       ```yaml
       properties:
         template:
           containers:
           - name: test-java-app
             image: mcr.microsoft.com/azurespringapps/samples/hello-world:0.0.1
             resources:
               cpu: 0.5
               memory: 1Gi
             env:
             - name: JAVA_TOOL_OPTIONS
               value: -javaagent:/java-agent/agent.jar
             volumeMounts:
             - mountPath: /java-agent
                volumeName: java-agent-volume
        ```

1. Update the container app with the modified **app.yaml** file by using the following command:

    # [Bash](#tab/bash)

    ```azurecli
    az containerapp update \
        --resource-group $RESOURCE_GROUP \ 
        --name $CONTAINER_APP_NAME \
        --yaml app.yaml \
        --query "properties.provisioningState"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az containerapp update `
        --resource-group $RESOURCE_GROUP `
        --name $CONTAINER_APP_NAME `
        --yaml app.yaml `
        --query "properties.provisioningState"
    ```

    ---

    After you update the container app, the command returns a `Succeeded` message. Now you can verify that your container app is connected, by viewing your Application Insights instance in the Azure portal.

## Clean up resources

The resources you created in this tutorial contribute to your Azure bill. If you don't need them long term, use the following command to remove the resource group and its resources:

# [Bash](#tab/bash)

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```powershell
az group delete --resource-group $RESOURCE_GROUP
```

---

## Related content

Other than [Azure Application Insights](/azure/azure-monitor/app/java-standalone-config), there are other popular APM solutions in the community. If you want to integrate your Azure Container App with other APM providers, just replace the Java agent JAR and related config files.

- [AppDynamics](https://docs.appdynamics.com/appd/21.x/21.4/en/application-monitoring/install-app-server-agents/java-agent/install-the-java-agent)
- [Dynatrace](https://docs.dynatrace.com/docs/setup-and-configuration/technology-support/application-software/java)
- [Elastic](https://www.elastic.co/guide/en/apm/agent/java/index.html)
- [New Relic](https://docs.newrelic.com/docs/apm/agents/java-agent/getting-started/introduction-new-relic-java/)
