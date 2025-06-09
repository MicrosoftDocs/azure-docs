---
ms.service: azure-deployment-environments
ms.topic: include
author: RoseHJM
ms.author: rosemalcolm
ms.date: 01/10/2025
ms.custom:
  - build-2025
---

You build custom images by using the ADE standard images as a base with ADE CLI, which is preinstalled on the standard images. To learn more about the ADE CLI, see the [CLI Custom Runner Image reference](https://aka.ms/deployment-environments/ade-cli-reference).

In this example, you learn how to build a Docker image to utilize ADE deployments and access the ADE CLI, basing your image off of one of the ADE authored images.

To create an image configured for ADE, follow these steps:
1. Create a custom image based on a standard image.
1. Install desired packages.
1. Configure operation shell scripts.
1. Create operation shell scripts to deploy ARM or Bicep files.


**1. Create a custom image based on a standard image**

Create a DockerFile that includes a FROM statement pointing to a standard image hosted on Microsoft Artifact Registry. 

Here's an example FROM statement, referencing the standard core image:

```docker
FROM mcr.microsoft.com/deployment-environments/runners/core:latest
```

This statement pulls the most recently published core image, and makes it a basis for your custom image.

**2. Install required packages**

In this step, you install any packages you require in your image, including Bicep. You can install the Bicep package with the Azure CLI by using the RUN statement, as shown in the following example:

```azure cli
RUN az bicep install
```

The ADE standard images are based on the Azure CLI image, and have the ADE CLI and JQ packages preinstalled. You can learn more about the [Azure CLI](/cli/azure/), and the [JQ package](https://devdocs.io/jq/).

To install any more packages you need within your image, use the RUN statement.

**3. Configure operation shell scripts**

Within the standard images, operations are determined and executed based on the operation name. Currently, the two operation names supported are *deploy* and *delete*.

To set up your custom image to utilize this structure, specify a folder at the level of your Dockerfile named *scripts*, and specify two files, *deploy.sh*, and *delete.sh*. The deploy shell script runs when your environment is created or redeployed, and the delete shell script runs when your environment is deleted. You can see examples of shell scripts in the repository under the [Runner-Images folder for the ARM-Bicep](https://github.com/Azure/deployment-environments/tree/main/Runner-Images/ARM-Bicep) image.

To ensure these shell scripts are executable, add the following lines to your Dockerfile:

```docker
COPY scripts/* /scripts/
RUN find /scripts/ -type f -iname "*.sh" -exec dos2unix '{}' '+'
RUN find /scripts/ -type f -iname "*.sh" -exec chmod +x {} \;
```

**4. Create operation shell scripts to deploy ARM or Bicep files**

To ensure you can successfully deploy ARM or Bicep infrastructure through ADE, you must:
1. Convert ADE parameters to ARM-acceptable parameters
1. Resolve linked templates if they're used in the deployment
1. Use privileged managed identity to perform the deployment

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

To begin deployment of the ARM or Bicep files, run the `az deployment group create` command. When running this command inside the container, choose a deployment name that doesn't override any past deployments, and use the `--no-prompt true` and `--only-show-errors` flags to ensure the deployment doesn't fail on any warnings or stall on waiting for user input, as shown in the following example:

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

You can check the provisioning state and details by running the below commands. ADE uses some special functions to read and provide more context based on the provisioning details, which you can find in the [Runner-Images](https://github.com/Azure/deployment-environments/tree/main/Runner-Images) folder. A simple implementation could be as follows:
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
