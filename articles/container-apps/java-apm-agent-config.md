---
title: "Tutorial: Configure APM integration for Java applications in Azure Container Apps"
description: Learn to configure APM integration for Java applications in Azure Container Apps
services: container-apps
author: croffz
ms.service: azure-container-apps
ms.custom: devx-track-azurecli
ms.topic: tutorial
ms.date: 09/26/2024
ms.author: kuzhong
---

# Tutorial: Configure APM integration for Java applications in Azure Container Apps

APM (Application Performance Management) is useful when you need observability on your applications running online. You can configure APM integration for Java applications in Azure Container Apps easily by Java agent and init containers without modifying your app image. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prepare an image to set up Java agent and push to Azure Container Registry
> * Create a Container Apps environment and a Container App as the target Java app
> * Configure init containers and volume mounts to set up Application Insights integration

## Prerequisites

- Have an instance of [Application Insights](https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview)
- Have an instance of Azure Container Registry or other container image registries
- Install [Docker](https://www.docker.com/) to build image
- Install the latest version of the [Azure CLI](/cli/azure/install-azure-cli)

## Set up the environment

The following commands help you define variables and ensure your Container Apps extension is up to date.

1. Sign in to the Azure CLI.

    # [Bash](#tab/bash)

    ```azurecli
    az login
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az login
    ```

    ---

1. Ensure you have the latest version of Azure CLI extensions for Container Apps and Application Insights.

    # [Bash](#tab/bash)

    ```azurecli
    az extension add -n containerapp --upgrade
    az extension add -n application-insights --upgrade
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az extension add -n containerapp --upgrade
    az extension add -n application-insights --upgrade
    ```

    ---

1. Set up environment variables used in various commands to follow.

    # [Bash](#tab/bash)

    ```bash
    APP_INSIGHTS_RESOURCE_ID="/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/microsoft.insights/components/my-app-insights"
    CONTAINER_REGISTRY_NAME="myacr"
    RESOURCE_GROUP="my-resource-group"
    ENVIRONMENT_NAME="my-environment"
    CONTAINER_APP_NAME="my-container-app"
    LOCATION="eastus"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $APP_INSIGHTS_RESOURCE_ID="/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/microsoft.insights/components/my-app-insights"
    $CONTAINER_REGISTRY_NAME="myacr"
    $RESOURCE_GROUP="my-resource-group"
    $ENVIRONMENT_NAME="my-environment"
    $CONTAINER_APP_NAME="my-container-app"
    $LOCATION="eastus"
    ```

    ---

## Prepare an image to set up Java agent and push to Azure Container Registry

1. Retrieve the connection string of Application Insights.

    # [Bash](#tab/bash)

    ```azurecli
    CONNECTION_STRING=(az monitor app-insights component show \
      --ids $APP_INSIGHTS_RESOURCE_ID \
      --query connectionString)
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    $CONNECTION_STRING=(az monitor app-insights component show `
      --ids $APP_INSIGHTS_RESOURCE_ID `
      --query connectionString)
    ```

    ---

1. Build setup image for Application Insights Java agent.

    Save the Dockerfile and run `docker build` in the same directory.
    
    ```Dockerfile
    FROM mcr.microsoft.com/cbl-mariner/base/core:2.0
    
    ARG connectionString
    
    RUN tdnf update -y && tdnf install -y curl ca-certificates
    
    RUN curl -L https://github.com/microsoft/ApplicationInsights-Java/releases/download/3.5.4/applicationinsights-agent-3.5.4.jar > agent.jar
    
    RUN echo "{\"connectionString\": \"${connectionString}\"}" > applicationinsights.json
    
    ENTRYPOINT ["/bin/sh", "-c", "cp agent.jar /java-agent/agent.jar && cp applicationinsights.json /java-agent/applicationinsights.json"]
    ```
    
    # [Bash](#tab/bash)

    ```azurecli
    docker build . \
      -t "$CONTAINER_REGISTRY_NAME.azurecr.io/samples/java-agent-setup:1.0.0" \
      --build-arg connectionString=$CONNECTION_STRING
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    docker build . `
      -t "$CONTAINER_REGISTRY_NAME.azurecr.io/samples/java-agent-setup:1.0.0" `
      --build-arg connectionString=$CONNECTION_STRING
    ```

    ---

1. Push the image to Azure Container Registry or other container image registries.
    
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

    ---

## Create a Container Apps environment and a Container App as the target Java app

1. Create a Container Apps environment.

    # [Bash](#tab/bash)

    ```azurecli
    az containerapp env create \
      --name $ENVIRONMENT_NAME \
      --resource-group $RESOURCE_GROUP \
      --location "$LOCATION" \
      --query "properties.provisioningState"
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az containerapp env create `
      --name $ENVIRONMENT_NAME `
      --resource-group $RESOURCE_GROUP `
      --location "$LOCATION" `
      --query "properties.provisioningState"
    ```

    ---

    Once created, the command returns a "Succeeded" message.

1. Create a Container app for further configurations.

    # [Bash](#tab/bash)

    ```azurecli
    az containerapp create \
      --name $CONTAINER_APP_NAME \
      --environment $ENVIRONMENT_NAME \
      --resource-group $RESOURCE_GROUP \
      --query "properties.provisioningState"
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az containerapp create `
      --name $CONTAINER_APP_NAME `
      --environment $ENVIRONMENT_NAME `
      --resource-group $RESOURCE_GROUP `
      --query "properties.provisioningState"
    ```

    ---

    Once created, the command returns a "Succeeded" message.

## Configure init containers and volume mounts to set up Application Insights integration

1. Get current configurations of running Container App.

    # [Bash](#tab/bash)

    ```azurecli
    az containerapp show \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      -o yaml > app.yaml
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az containerapp show `
      --name $CONTAINER_APP_NAME `
      --resource-group $RESOURCE_GROUP `
      -o yaml > app.yaml
    ```

    ---

    YAML File `app.yaml` is created in current directory.

2. Edit the app YAML file.

    - Ephemeral storage volume for Java agent files
  
    ```yaml
    properties:
      template:
        volumes:
        - name: java-agent-volume
          storageType: EmptyDir
    ```

    - Init container with volume mount to set up Java agent
  
    ```yaml
    properties:
      template:
        initContainers:
        - image: $CONTAINER_REGISTRY_NAME.azurecr.io/samples/java-agent-setup:1.0.0
          name: java-agent-setup
          resources:
            cpu: 0.25
            ephemeralStorage: 1Gi
            memory: 0.5Gi
          volumeMounts:
          - mountPath: /java-agent
            volumeName: java-agent-volume
    ```

    Replace $CONTAINER_REGISTRY_NAME with your Azure Container Registry name or replace the image from other container image registries.

    - App container with volume mount and environment variable to inject Java agent
  
    ```yaml
    properties:
      template:
        containers:
        - name: test-java-app
          image: mcr.microsoft.com/azurespringapps/samples/hello-world:0.0.1
          resources:
            cpu: 0.5
            ephemeralStorage: 2Gi
            memory: 1Gi
          env:
          - name: JAVA_TOOL_OPTIONS
            value: -javaagent:/java-agent/agent.jar
          volumeMounts:
          - mountPath: /java-agent
            volumeName: java-agent-volume
    ```

3. Update the Container App with modified YAML file.

    # [Bash](#tab/bash)

    ```azurecli
    az containerapp update \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \ 
      --yaml app.yaml \
      --query "properties.provisioningState"
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az containerapp update `
      --name $CONTAINER_APP_NAME `
      --resource-group $RESOURCE_GROUP `
      --yaml app.yaml `
      --query "properties.provisioningState"
    ```

    ---

    Once updated, the command returns a "Succeeded" message. Then you can check out your Application Insights in Azure portal to see your Container App is connected.

## Other APM solutions

Other than [Azure Monitor Application Insights](https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview), there are other popular APM solutions in the community. If you want to integrate your Azure Container App with other APM providers, just replace the Java agent JAR and related config files.

- [AppDynamics](https://docs.appdynamics.com/appd/21.x/21.4/en/application-monitoring/install-app-server-agents/java-agent/install-the-java-agent)
- [Dynatrace](https://docs.dynatrace.com/docs/setup-and-configuration/technology-support/application-software/java)
- [Elastic](https://www.elastic.co/guide/en/apm/agent/java/index.html)
- [NewRelic](https://docs.newrelic.com/docs/apm/agents/java-agent/getting-started/introduction-new-relic-java/)
