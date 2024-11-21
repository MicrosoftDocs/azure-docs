---
title: "Tutorial: Configure Application Performance Management (APM) Java agent with init-container in Azure Container Apps"
description: Learn to configure Application Performance Management (APM) Java agent with init-container in Azure Container Apps
services: container-apps
author: croffz
ms.service: azure-container-apps
ms.custom: devx-track-azurecli
ms.topic: tutorial
ms.date: 11/4/2024
ms.author: kuzhong
author: KarlErickson
---

# Tutorial: Configure Application Performance Management (APM) Java agent with init-container in Azure Container Apps

This article shows you how to configure Application Performance Management (APM) Java agent with init containers in Azure Container Apps, which injects APM solutions without modifying your app image. While you can package the APM plugin in the same image or Dockerfile with your app, doing that binds together management efforts like release and Common Vulnerabilities and Exposures (CVE) mitigation.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prepare an image to set up Java agent and push to Azure Container Registry.
> * Create a Container Apps environment and a container app as the target Java app.
> * Configure init containers and volume mounts to set up Application Insights integration.

## Prerequisites

- An instance of [Application Insights](/azure/azure-monitor/app/app-insights-overview).
- An instance of Azure Container Registry or another container image registry.
- [Docker](https://www.docker.com/), to build an image.
- The latest version of the [Azure CLI](/cli/azure/install-azure-cli).

## Set up the environment

The following steps define environment variables and ensure your Container Apps extension is up to date:

1. To define environment variables, use the following commands:

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

1. To sign in to Azure CLI, use the following commands:

    # [Bash](#tab/bash)

    ```bash
    az login
    az account set --subscription $SUBSCRIPTION_ID
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az login
    az account set --subscription $SUBSCRIPTION_ID
    ```

1. To ensure you have the latest version of Azure CLI extensions for Container Apps and Application Insights, use the following commands:

    # [Bash](#tab/bash)

    ```bash
    az extension add --name containerapp --upgrade
    az extension add --name application-insights --upgrade
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az extension add --name containerapp --upgrade
    az extension add --name application-insights --upgrade
    ```

1. To retrieve the connection string of Application Insights, use the following commands:

    # [Bash](#tab/bash)

    ```bash
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

To build a setup image for Application Insights Java agent, perform the following steps in the same directory:

1. Save the following Dockerfile:
    
    ```Dockerfile
    FROM mcr.microsoft.com/cbl-mariner/base/core:2.0
    
    ARG version="3.5.4"
    
    RUN tdnf update -y && tdnf install -y curl ca-certificates
    
    RUN curl -L "https://github.com/microsoft/ApplicationInsights-Java/releases/download/${version}/applicationinsights-agent-${version}.jar" > agent.jar
    
    ADD setup.sh /setup.sh
    
    ENTRYPOINT ["/bin/sh", "setup.sh"]
    ```

1. Save the following setup script:

    ```setup.sh
    #!/bin/sh

    if [[ -z "$CONNECTION_STRING" ]]; then
      echo "Environment variable CONNECTION_STRING is not found. Exiting..."
      exit 1
    else
      echo "{\"connectionString\": \"$CONNECTION_STRING\"}" > /java-agent/applicationinsights.json
      cp agent.jar /java-agent/agent.jar
    fi
    ```

1. Run the following command to create the image:

    # [Bash](#tab/bash)

    ```bash
    docker build . -t "$CONTAINER_REGISTRY_NAME.azurecr.io/samples/java-agent-setup:1.0.0"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    docker build . -t "$CONTAINER_REGISTRY_NAME.azurecr.io/samples/java-agent-setup:1.0.0"
    ```

1. Push the image to Azure Container Registry or another container image registry by using the following commands:
    
    # [Bash](#tab/bash)

    ```bash
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

## Create a Container Apps environment and a Container App as the target Java app

To create a Container Apps environment and a container app as the target Java app, perform the following steps:

1. Create a Container Apps environment by using the following command:

    # [Bash](#tab/bash)

    ```bash
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

    After successfully creating the Container Apps environment, the command line returns a `Succeeded` message.

1. Create a Container app for further configurations by using the following command:

    # [Bash](#tab/bash)

    ```bash
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

    After successfully creating the Container App, the command line returns a `Succeeded` message.

## Configure init container, secrets, environment variables, and volumes to set up Application Insights integration

To configure your init container with secrets, environment variables, and volumes so it can be used with Insights, perform the following steps:

1. Write the current configurations of the running Container App to **app.yml** in the current directory, by using the following command:

    # [Bash](#tab/bash)

    ```bash
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

1. Edit the configurations in **app.yml** by using the following instructions:

    1. Add a secret for Application Insights connection string using the following code snippet:

       ```yaml
       properties:
         configuration:
            secrets:
            - name: app-insights-connection-string
              value: $CONNECTION_STRING
        ```

       Replace $CONNECTION_STRING with your Azure Application Insights connection string.

    1. Add ephemeral storage volume for Java agent files using the following code snippet:
  
       ```yaml
       properties:
         template:
           volumes:
           - name: java-agent-volume
             storageType: EmptyDir
        ```

    1. Add an init container with volume mounts and environment variables, using the following code snippet:
  
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

       Replace `<CONTAINER_REGISTRY_NAME>` with your Azure Container Registry name.

    1. Update the app container with volume mounts and environment variables, using the following code snippets:
  
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

    1. Update the container app with the modified YAML file, using the following command:
    
       # [Bash](#tab/bash)
   
       ```bash
       az containerapp update \
         --name $CONTAINER_APP_NAME \
         --resource-group $RESOURCE_GROUP \ 
         --yaml app.yaml \
         --query "properties.provisioningState"
       ```
   
       # [PowerShell](#tab/powershell)
   
       ```powershell
       az containerapp update `
         --name $CONTAINER_APP_NAME `
         --resource-group $RESOURCE_GROUP `
         --yaml app.yaml `
         --query "properties.provisioningState"
       ```
   
       After updating the container app, the command returns a `Succeeded` message. Then you can view your Application Insights in the Azure portal to verify that your container app is connected.
 
## Clean up resources

The resource group you created in this tutorial contributes to your Azure bill. If you aren't going to need it in the long term, use the following command to remove it:

# [Bash](#tab/bash)

```bash
az group delete --resource-group $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)
```powershell
az group delete --resource-group $RESOURCE_GROUP
```

## Other APM solutions

Other than [Azure Application Insights](/azure/azure-monitor/app/java-standalone-config), there are other popular APM solutions in the community. If you want to integrate your Azure Container App with other APM providers, just replace the Java agent JAR and related config files.

- [AppDynamics](https://docs.appdynamics.com/appd/21.x/21.4/en/application-monitoring/install-app-server-agents/java-agent/install-the-java-agent)
- [Dynatrace](https://docs.dynatrace.com/docs/setup-and-configuration/technology-support/application-software/java)
- [Elastic](https://www.elastic.co/guide/en/apm/agent/java/index.html)
- [New Relic](https://docs.newrelic.com/docs/apm/agents/java-agent/getting-started/introduction-new-relic-java/)
