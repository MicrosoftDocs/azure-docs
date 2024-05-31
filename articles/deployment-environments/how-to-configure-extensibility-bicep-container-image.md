---
title: ADE extensibility model for custom ARM and Bicep images
titleSuffix: Azure Deployment Environments
description: Learn how to use the ADE extensibility model to build and utilize custom ARM and Bicep images within your environment definitions for deployment environments.
ms.service: deployment-environments
author: RoseHJM
ms.author: rosemalcolm
ms.date: 05/28/2024
ms.topic: how-to

#customer intent: As a developer, I want to learn how to build and utilize custom images within my environment definitions for deployment environments.
---

# Configure container image to execute deployments with ARM and Bicep

In this article, you learn how to build custom Azure Resource Manager (ARM) and Bicep container images to deploy your environment definitions in Azure Deployment Environments (ADE).

An environment definition comprises at least two files: a template file, like *azuredeploy.json* or *main.bicep*, and a manifest file named *environment.yaml*. ADE uses containers to deploy environment definitions, and natively supports the ARM and Bicep IaC frameworks. 

The ADE extensibility model enables you to create custom container images to use with your environment definitions. By using the extensibility model, you can create your own custom container images, and store them in a container registry like DockerHub. You can then reference these images in your environment definitions to deploy your environments.

The ADE team provides a selection of images to get you started, including a core image, and an Azure Resource Manager (ARM)/Bicep image. You can access these sample images in the [Runner-Images](https://aka.ms/deployment-environments/runner-images) folder.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure Deployment Environments set up in your Azure subscription. 
  - To set up ADE, follow the [Quickstart: Configure Azure Deployment Environments](quickstart-create-and-configure-devcenter.md).

## Use container images with ADE

You can take one of the following approaches to use container images with ADE:
- **Use the standard container image:** For simple scenarios, use the standard Bicep container image provided by ADE.
- **Create a custom container image:** For more complex scenarios, create a custom container image that meets your specific requirements.
 
Regardless of which approach you choose, you must specify the container image in your environment definition to deploy your Azure resources.

## Use the standard Bicep container image

ADE supports Bicep natively, so you can configure an environment definition that deploys Azure resources for a deployment environment by adding the template files (azuredeploy.json and environment.yaml) to your catalog. ADE then uses the standard Bicep container image to create the deployment environment.

In the environment.yaml file, the runner property specifies the location of the container image you want to use. To use the sample image published on the Microsoft Artifact Registry, use the respective identifiers runner, as listed in the following table.

The following example shows a runner that references the sample Bicep container image:
```yaml
    name: WebApp
    version: 1.0.0
    summary: Azure Web App Environment
    description: Deploys a web app in Azure without a datastore
    runner: Bicep
    templatePath: azuredeploy.json
```
You can see the standard Bicep container image in the ADE sample repository under the [Runner-Images folder for the ARM-Bicep](https://github.com/Azure/deployment-environments/tree/main/Runner-Images/ARM-Bicep) image.

For more information about how to create environment definitions that use the ADE container images to deploy your Azure resources, see [Add and configure an environment definition](configure-environment-definition.md).

## Create a custom Bicep container image

Creating a custom container image allows you to customize your deployments to fit your requirements. You can create custom images based on the ADE standard container images.

After you complete the image customization, you must build the image and push it to your container registry. 

### Create and customize a container image with Docker

In this example, you learn how to build a Docker image to utilize ADE deployments and access the ADE CLI, basing your image off of one of the ADE authored images.

The ADE CLI is a tool that allows you to build custom images by using ADE base images. You can use the ADE CLI to customize your deployments and deletions to fit your workflow. The ADE CLI is preinstalled on the sample images. To learn more about the ADE CLI, see the [CLI Custom Runner Image reference](https://aka.ms/deployment-environments/ade-cli-reference).

To create an image configured for ADE, follow these steps:
1. Base your image on an ADE-authored sample image or the image of your choice by using the FROM statement.
1. Install any necessary packages for your image by using the RUN statement.
1. Create a *scripts* folder at the same level as your Dockerfile, store your *deploy.sh* and *delete.sh* files within it, and ensure those scripts are discoverable and executable inside your created container. This step is necessary for your deployment to work using the ADE core image.

### Select a sample container image by using the FROM statement

Include a FROM statement within a created DockerFile for your new image pointing to a sample image hosted on Microsoft Artifact Registry.

Here's an example FROM statement, referencing the sample core image:

```docker
FROM mcr.microsoft.com/deployment-environments/runners/core:latest
```

This statement pulls the most recently published core image, and makes it a basis for your custom image.

### Install Bicep in a Dockerfile

You can install the Bicep package with the Azure CLI by using the RUN statement, as shown in the following example:

```azure cli
RUN az bicep install
```

The ADE sample images are based on the Azure CLI image, and have the ADE CLI and JQ packages preinstalled. You can learn more about the [Azure CLI](/cli/azure/), and the [JQ package](https://devdocs.io/jq/).

To install any more packages you need within your image, use the RUN statement.

### Execute operation shell scripts

Within the sample images, operations are determined and executed based on the operation name. Currently, the two operation names supported are *deploy* and *delete*.

To set up your custom image to utilize this structure, specify a folder at the level of your Dockerfile named *scripts*, and specify two files, *deploy.sh*, and *delete.sh*. The deploy shell script runs when your environment is created or redeployed, and the delete shell script runs when your environment is deleted. You can see examples of shell scripts in the repository under the [Runner-Images folder for the ARM-Bicep](https://github.com/Azure/deployment-environments/tree/main/Runner-Images/ARM-Bicep) image.

To ensure these shell scripts are executable, add the following lines to your Dockerfile:

```docker
COPY scripts/* /scripts/
RUN find /scripts/ -type f -iname "*.sh" -exec dos2unix '{}' '+'
RUN find /scripts/ -type f -iname "*.sh" -exec chmod +x {} \;
```

### Author operation shell scripts to deploy ARM or Bicep templates
To ensure you can successfully deploy ARM or Bicep infrastructure through ADE, you must:
- Convert ADE parameters to ARM-acceptable parameters
- Resolve linked templates if they're used in the deployment
- Use privileged managed identity to perform the deployment

During the core image's entrypoint, any parameters set for the current environment are stored under the variable `$ADE_OPERATION_PARAMETERS`. In order to convert them to ARM-acceptable parameters, you can run the following command using JQ:
```bash
# format the parameters as arm parameters
deploymentParameters=$(echo "$ADE_OPERATION_PARAMETERS" | jq --compact-output '{ "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#", "contentVersion": "1.0.0.0", "parameters": (to_entries | if length == 0 then {} else (map( { (.key): { "value": .value } } ) | add) end) }' )
```

Next, to resolve any linked templates used within an ARM JSON-based template, you can decompile the main template file, which resolves all the local infrastructure files used into many Bicep modules. Then, rebuild those modules back into a single ARM template with the linked templates embedded into the main ARM template as nested templates. This step is only necessary during the deployment operation. The main template file can be specified using the `$ADE_TEMPLATE_FILE` set during the core image's entrypoint, and you should reset this variable with the recompiled template file. See the following example:
```bash
if [[ $ADE_TEMPLATE_FILE == *.json ]]; then

    hasRelativePath=$( cat $ADE_TEMPLATE_FILE | jq '[.. | objects | select(has("templateLink") and (.templateLink | has("relativePath")))] | any' )

    if [ "$hasRelativePath" = "true" ]; then
        echo "Resolving linked ARM templates"

        bicepTemplate="${ADE_TEMPLATE_FILE/.json/.bicep}"
        generatedTemplate="${ADE_TEMPLATE_FILE/.json/.generated.json}"

        az bicep decompile --file "$ADE_TEMPLATE_FILE"
        az bicep build --file "$bicepTemplate" --outfile "$generatedTemplate"

        # Correctly reassign ADE_TEMPLATE_FILE without the $ prefix during assignment
        ADE_TEMPLATE_FILE="$generatedTemplate"
    fi
fi
```
To provide the permissions a deployment requires to execute the deployment and deletion of resources within the subscription, use the privileged managed identity associated with the ADE project environment type. If your deployment needs special permissions to complete, such as particular roles, assign those roles to the project environment type's identity. Sometimes, the managed identity isn't immediately available when entering the container; you can retry until the sign-in is successful. 
```bash
echo "Signing into Azure using MSI"
while true; do
    # managed identity isn't available immediately
    # we need to do retry after a short nap
    az login --identity --allow-no-subscriptions --only-show-errors --output none && {
        echo "Successfully signed into Azure"
        break
    } || sleep 5
done
```

To begin deployment of the ARM or Bicep templates, run the `az deployment group create` command. When running this command inside the container, choose a deployment name that doesn't override any past deployments, and use the `--no-prompt true` and `--only-show-errors` flags to ensure the deployment doesn't fail on any warnings or stall on waiting for user input, as shown in the following example:

```bash
deploymentName=$(date +"%Y-%m-%d-%H%M%S")
az deployment group create --subscription $ADE_SUBSCRIPTION_ID \
    --resource-group "$ADE_RESOURCE_GROUP_NAME" \
    --name "$deploymentName" \
    --no-prompt true --no-wait \
    --template-file "$ADE_TEMPLATE_FILE" \
    --parameters "$deploymentParameters" \
    --only-show-errors
```

To delete an environment, perform a Complete-mode deployment and provide an empty ARM template, which removes all resources within the specified ADE resource group, as shown in the following example:
```bash
deploymentName=$(date +"%Y-%m-%d-%H%M%S")
az deployment group create --resource-group "$ADE_RESOURCE_GROUP_NAME" \
    --name "$deploymentName" \
    --no-prompt true --no-wait --mode Complete \
    --only-show-errors \
    --template-file "$DIR/empty.json"
```

You can check the provisioning state and details by running the below commands. ADE uses some special functions to read and provide more context based on the provisioning details, which you can find in the [Runner-Images](https://github.com/Azure/deployment-environments/tree/custom-runner-private-preview/Runner-Images) folder. A simple implementation could be as follows:
```bash
if [ $? -eq 0 ]; then # deployment successfully created
    while true; do

        sleep 1

        ProvisioningState=$(az deployment group show --resource-group "$ADE_RESOURCE_GROUP_NAME" --name "$deploymentName" --query "properties.provisioningState" -o tsv)
        ProvisioningDetails=$(az deployment operation group list --resource-group "$ADE_RESOURCE_GROUP_NAME" --name "$deploymentName")

        echo "$ProvisioningDetails"

        if [[ "CANCELED|FAILED|SUCCEEDED" == *"${ProvisioningState^^}"* ]]; then

            echo -e "\nDeployment $deploymentName: $ProvisioningState"

            if [[ "CANCELED|FAILED" == *"${ProvisioningState^^}"* ]]; then
                exit 11
            else
                break
            fi
        fi
    done
fi
```

Finally, to view the outputs of your deployment and pass them to ADE to make them accessible via the Azure CLI, you can run the following commands:
```bash
deploymentOutput=$(az deployment group show -g "$ADE_RESOURCE_GROUP_NAME" -n "$deploymentName" --query properties.outputs)
if [ -z "$deploymentOutput" ]; then
    deploymentOutput="{}"
fi
echo "{\"outputs\": $deploymentOutput}" > $ADE_OUTPUTS
```

## Make the custom image accessible to ADE

You must build your Docker image and push it to your container registry to make it available for use in ADE. You can build your image using the Docker CLI, or by using a script provided by ADE.

Select the appropriate tab to learn more about each approach.

### [Build the image with Docker CLI](#tab/build-the-image-with-docker-cli/)

Before you build the image to be pushed to your registry, ensure the [Docker Engine is installed](https://docs.docker.com/desktop/) on your computer. Then, navigate to the directory of your Dockerfile, and run the following command:

```docker
docker build . -t {YOUR_REGISTRY}.azurecr.io/{YOUR_REPOSITORY}:{YOUR_TAG}
```

For example, if you want to save your image under a repository within your registry named `customImage`, and upload with the tag version of `1.0.0`, you would run:

```docker
docker build . -t {YOUR_REGISTRY}.azurecr.io/customImage:1.0.0
```

### Push the Docker image to a registry

In order to use custom images, you need to set up a publicly accessible image registry with anonymous image pull enabled. This way, Azure Deployment Environments can access your custom image to execute in our container.

Azure Container Registry is an Azure offering that stores container images and similar artifacts.

To create a registry, which can be done through the Azure CLI, the Azure portal, PowerShell commands, and more, follow one of the [quickstarts](/azure/container-registry/container-registry-get-started-azure-cli).

To set up your registry to have anonymous image pull enabled, run the following commands in the Azure CLI:

```azurecli
az login
az acr login -n {YOUR_REGISTRY}
az acr update -n {YOUR_REGISTRY} --public-network-enabled true
az acr update -n {YOUR_REGISTRY} --anonymous-pull-enabled true
```

When you're ready to push your image to your registry, run the following command:

```docker
docker push {YOUR_REGISTRY}.azurecr.io/{YOUR_IMAGE_LOCATION}:{YOUR_TAG}
```

## [Build a container image with a script](#tab/build-a-container-image-with-a-script/)

[!INCLUDE [custom-image-script](includes/custom-image-script.md)]

---

## Connect the image to your environment definition

When authoring environment definitions to use your custom image in their deployment, edit the `runner` property on the manifest file (environment.yaml or manifest.yaml).

```yaml
runner: "{YOUR_REGISTRY}.azurecr.io/{YOUR_REPOSITORY}:{YOUR_TAG}"
```

To learn more about how to create environment definitions that use the ADE container images to deploy your Azure resources, see [Add and configure an environment definition](configure-environment-definition.md).

## Access operation logs and error details

[!INCLUDE [custom-image-logs-errors](includes/custom-image-logs-errors.md)]

## Related content

- [ADE CLI Custom Runner Image reference](https://aka.ms/deployment-environments/ade-cli-reference)
- [ADE CLI variables reference](reference-deployment-environment-variables.md)