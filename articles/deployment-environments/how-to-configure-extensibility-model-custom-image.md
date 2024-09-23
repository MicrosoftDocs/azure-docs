---
title: ADE extensibility model for custom container images
titleSuffix: Azure Deployment Environments
description: Learn how to use the ADE extensibility model to build and utilize custom container images within your environment definitions for deployment environments.
ms.service: azure-deployment-environments
ms.custom: devx-track-azurecli, devx-track-bicep
author: RoseHJM
ms.author: rosemalcolm
ms.date: 09/23/2024
ms.topic: how-to
zone_pivot_groups: ade-extensibility-iac-framework

#customer intent: As a platform engineer, I want to learn how to build and utilize custom images within my environment definitions for deployment environments.
---

# Configure container image to execute deployments

In this article, you learn how to build custom container images to deploy your [environment definitions](configure-environment-definition.md) in Azure Deployment Environments (ADE).

An environment definition comprises at least two files: a template file, like *azuredeploy.json* or *main.bicep*, and a manifest file named *environment.yaml*. ADE uses containers to deploy environment definitions. 

ADE supports an extensibility model that enables you to create custom images that you can use in your environment definitions. To use this extensibility model, create your own custom images and store them in a container registry like Azure Container Registry (ACR) or Docker Hub. You can then reference these images in your environment definitions to deploy your environments. 

ADE supports multiple Infrastructure-as-Code (IaC) frameworks, including ARM, Bicep, Terraform, and [Pulumi](https://pulumi.com). 

The ADE team provides a selection of images to get you started, including a core image, and an Azure Resource Manager (ARM)-Bicep image. You can access these sample images in the [Runner-Images](https://aka.ms/deployment-environments/runner-images) folder.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure Deployment Environments set up in your Azure subscription. 
  - To set up ADE, follow the [Quickstart: Configure Azure Deployment Environments](quickstart-create-and-configure-devcenter.md).

## Use container images with ADE

You can take one of the following approaches to use container images with ADE:
- **Use the standard container image:** For simple scenarios, use the standard ARM-Bicep container image provided by ADE.
- **Create a custom container image:** For more complex scenarios, create a custom container image that meets your specific requirements.
 
Regardless of which approach you choose, you must specify the container image in your environment definition to deploy your Azure resources.

## Use a standard container image

ADE supports ARM and Bicep without requiring any extra configuration. You can create an environment definition that deploys Azure resources for a deployment environment by adding the template files (like *azuredeploy.json* and *environment.yaml*) to your catalog. ADE then uses the standard ARM-Bicep container image to create the deployment environment.

In the *environment.yaml* file, the runner property specifies the location of the container image you want to use. To use the sample image published on the Microsoft Artifact Registry, use the respective identifiers runner.

The following example shows a runner that references the sample ARM-Bicep container image:
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

::: zone pivot="arm-bicep,terraform"

## Create a custom container image

Creating a custom container image allows you to customize your deployments to fit your requirements. You can create custom images based on the ADE standard container images.

After you complete the image customization, you must build the image and push it to your container registry. 

### Create and customize a container image

In this example, you learn how to build a Docker image to utilize ADE deployments and access the ADE CLI, basing your image off of one of the ADE authored images.

The ADE CLI is a tool that allows you to build custom images by using ADE base images. You can use the ADE CLI to customize your deployments and deletions to fit your workflow. The ADE CLI is preinstalled on the sample images. To learn more about the ADE CLI, see the [CLI Custom Runner Image reference](https://aka.ms/deployment-environments/ade-cli-reference).

<!-- [!INCLUDE [configure-extensibility-bicep-container-image](includes/configure-extensibility-bicep-container-image.md)] -->

::: zone-end

To create an image configured for ADE, follow these steps:
1. Create a custom image based on a standard image.
1. Install desired packages.
1. Configure operation shell scripts.
::zone-pivot="arm-bicep" 
1. Create operation shell scripts to deploy ARM or Bicep templates.::: zone-end ::: zone pivot="terraform"
1. Create operation shell scripts that use the Terraform CLI.::: zone-end

<!-- [!INCLUDE [configure-extensibility-terraform-container-image](includes/configure-extensibility-terraform-container-image.md)] -->



::: zone pivot="arm-bicep,terraform"

**1. Create a custom image based on a standard image**

Create a DockerFile that includes a FROM statement pointing to a sample image hosted on Microsoft Artifact Registry. 

Here's an example FROM statement, referencing the sample core image:

```docker
FROM mcr.microsoft.com/deployment-environments/runners/core:latest
```

This statement pulls the most recently published core image, and makes it a basis for your custom image.

::: zone-end

::: zone-pivot="arm-bicep"

**2. Install desired packages**

In this step, you inatall any packages you require in your image, including Bicep. You can install the Bicep package with the Azure CLI by using the RUN statement, as shown in the following example:

```azure cli
RUN az bicep install
```

The ADE sample images are based on the Azure CLI image, and have the ADE CLI and JQ packages preinstalled. You can learn more about the [Azure CLI](/cli/azure/), and the [JQ package](https://devdocs.io/jq/).

To install any more packages you need within your image, use the RUN statement.
::: zone-end

::: zone-pivot="terraform"

**2. Install desired packages**

In this step, you install any packages you require in your image, including Terraform. You can install the Terraform CLI to an executable location so that it can be used in your deployment and deletion scripts. 

Here's an example of that process, installing version 1.7.5 of the Terraform CLI:

```azure cli
RUN wget -O terraform.zip https://releases.hashicorp.com/terraform/1.7.5/terraform_1.7.5_linux_amd64.zip
RUN unzip terraform.zip && rm terraform.zip
RUN mv terraform /usr/bin/terraform
```

> [!Tip]
> You can get the download URL for your preferred version of the Terraform CLI from [Hashicorp releases](https://aka.ms/deployment-environments/terraform-cli-zip).

The ADE sample images are based on the Azure CLI image, and have the ADE CLI and JQ packages preinstalled. You can learn more about the [Azure CLI](/cli/azure/), and the [JQ package](https://devdocs.io/jq/).

To install any more packages you need within your image, use the RUN statement.
::zone-end

::: zone pivot="arm-bicep,terraform"

**3. Configure operation shell scripts**

Within the sample images, operations are determined and executed based on the operation name. Currently, the two operation names supported are *deploy* and *delete*.

To set up your custom image to utilize this structure, specify a folder at the level of your Dockerfile named *scripts*, and specify two files, *deploy.sh*, and *delete.sh*. The deploy shell script runs when your environment is created or redeployed, and the delete shell script runs when your environment is deleted. You can see examples of shell scripts in the repository under the [Runner-Images folder for the ARM-Bicep](https://github.com/Azure/deployment-environments/tree/main/Runner-Images/ARM-Bicep) image.

To ensure these shell scripts are executable, add the following lines to your Dockerfile:

```docker
COPY scripts/* /scripts/
RUN find /scripts/ -type f -iname "*.sh" -exec dos2unix '{}' '+'
RUN find /scripts/ -type f -iname "*.sh" -exec chmod +x {} \;
```
::: zone-end

::: zone-pivot="arm-bicep"

**4. Create operation shell scripts to deploy ARM or Bicep templates**

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

::: zone-end

::: zone-pivot="terraform"

**4. Create operation shell scripts that use the Terraform CLI**

There are three steps to deploy infrastructure via Terraform: 
1. `terraform init` - initializes the Terraform CLI to perform actions within the working directory
1. `terraform plan` - develops a plan based on the incoming Terraform infrastructure files and variables, and any existing state files, and develops steps needed to create or update infrastructure specified in the *.tf* files
1. `terraform apply` - applies the plan to create new or update existing infrastructure in Azure

During the core image's entrypoint, any existing state files are pulled into the container and the directory saved under the environment variable ```$ADE_STORAGE```. Additionally, any parameters set for the current environment stored under the variable ```$ADE_OPERATION_PARAMETERS```. In order to access the existing state file, and set your variables within a *.tfvars.json* file, run the following commands:
```bash
EnvironmentState="$ADE_STORAGE/environment.tfstate"
EnvironmentPlan="/environment.tfplan"
EnvironmentVars="/environment.tfvars.json"

echo "$ADE_OPERATION_PARAMETERS" > $EnvironmentVars
```

Additionally, to utilize ADE privileges to deploy infrastructure inside your subscription, your script needs to use the Managed Service Identity (MSI) when provisioning infrastructure by using the Terraform AzureRM provider. If your deployment needs special permissions to complete your deployment, such as particular roles, assign those permissions to the project environment type's identity that is being used for your environment deployment. ADE sets the relevant environment variables, such as the client, tenant, and subscription IDs within the core image's entrypoint, so run the following commands to ensure the provider uses the ADE MSI:
```bash
export ARM_USE_MSI=true
export ARM_CLIENT_ID=$ADE_CLIENT_ID
export ARM_TENANT_ID=$ADE_TENANT_ID
export ARM_SUBSCRIPTION_ID=$ADE_SUBSCRIPTION_ID
```

If you have other variables to reference within your template that aren't specified in your environment's parameters, set environment variables using the prefix *TF_VAR*. A list of provided ADE environment variables is provided [Azure Deployment Environment CLI variables reference](./reference-deployment-environment-variables.md). An example of those commands could be;
```bash
export TF_VAR_resource_group_name=$ADE_RESOURCE_GROUP_NAME
export TF_VAR_ade_env_name=$ADE_ENVIRONMENT_NAME
export TF_VAR_env_name=$ADE_ENVIRONMENT_NAME
export TF_VAR_ade_subscription=$ADE_SUBSCRIPTION_ID
export TF_VAR_ade_location=$ADE_ENVIRONMENT_LOCATION
export TF_VAR_ade_environment_type=$ADE_ENVIRONMENT_TYPE
```

Now, you can run the steps listed previously to initialize the Terraform CLI, generate a plan for provisioning infrastructure, and apply a plan during your deployment script:
```bash
terraform init
terraform plan -no-color -compact-warnings -refresh=true -lock=true -state=$EnvironmentState -out=$EnvironmentPlan -var-file="$EnvironmentVars"
terraform apply -no-color -compact-warnings -auto-approve -lock=true -state=$EnvironmentState $EnvironmentPlan
```

During your deletion script, you can add the `destroy` flag to your plan generation to delete the existing resources, as shown in the following example:
```bash
terraform init
terraform plan -no-color -compact-warnings -destroy -refresh=true -lock=true -state=$EnvironmentState -out=$EnvironmentPlan -var-file="$EnvironmentVars"
terraform apply -no-color -compact-warnings -auto-approve -lock=true -state=$EnvironmentState $EnvironmentPlan
```

Finally, to make the outputs of your deployment uploaded and accessible when accessing your environment via the Azure CLI, transform the output object from Terraform to the ADE-specified format through the JQ package. Set the value to the $ADE_OUTPUTS environment variable, as shown in the following example:
```bash
tfOutputs=$(terraform output -state=$EnvironmentState -json)
# Convert Terraform output format to ADE format.
tfOutputs=$(jq 'walk(if type == "object" then 
            if .type == "bool" then .type = "boolean" 
            elif .type == "list" then .type = "array" 
            elif .type == "map" then .type = "object" 
            elif .type == "set" then .type = "array" 
            elif (.type | type) == "array" then 
                if .type[0] == "tuple" then .type = "array" 
                elif .type[0] == "object" then .type = "object" 
                elif .type[0] == "set" then .type = "array" 
                else . 
                end 
            else . 
            end 
        else . 
        end)' <<< "$tfOutputs")

echo "{\"outputs\": $tfOutputs}" > $ADE_OUTPUTS
```

::: zone-end

::: zone pivot="pulumi"

Pulumi content goes here

<!-- [!INCLUDE [configure-extensibility-pulumi-container-image](includes/configure-extensibility-pulumi-container-image.md)] -->

::: zone-end

## Make the custom image accessible to ADE

You must build your custom container image and push it to a container registry to make it available for use in ADE.  

You can build your image using the Docker CLI, or by using a script provided by ADE.

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

In order to use custom images, you need to store them in a container registry. You can use a public container registry or a private container registry. Azure Container Registry (ACR) is highly recommended for that. Due to its tight integration with ADE, the image can be published without allowing public anonymous pull access. 

It's also possible to store the image in a different container registry such as Docker Hub, but in that case it needs to be publicly accessible.

> [!Caution]
> Storing your container image in a registry with anonymous (unauthenticated) pull access makes it publicly accessible. Don't do that if your image contains any sensitive information. Instead, store it in Azure Container Registry (ACR) with anonymous pull access disabled. 

To use a custom image stored in ACR, you need to ensure that ADE has appropriate permissions to access your image. When you create an ACR instance, it's secure by default and only allows authenticated users to gain access. 

To create  an instance of ACR, which can be done through the Azure CLI, the Azure portal, PowerShell commands, and more, follow one of the [quickstarts](/azure/container-registry/container-registry-get-started-azure-cli).

#### Use a public registry with anonymous pull

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

#### Use ACR with secured access

By default, access to pull or push content from an Azure Container Registry is only available to authenticated users. You can further secure access to ACR by limiting access from certain networks and assigning specific roles.

##### Limit network access

To secure network access to your ACR, you can limit access to your own networks, or disable public network access entirely. If you limit network access, you must enable the firewall exception *Allow trusted Microsoft services to access this container registry*.

To disable access from public networks:

1. [Create an ACR instance](/azure/container-registry/container-registry-get-started-azure-cli) or use an existing one.
1. In the Azure portal, go to the ACR that you want to configure.
1. On the left menu, under **Settings**, select **Networking**.
1. On the Networking page, on the **Public access** tab, under **Public network access**, select **Disabled**.

   :::image type="content" source="media/how-to-configure-extensibility-bicep-container-image/container-registry-network-settings.png" alt-text="Screenshot of the Azure portal, showing the ACR network settings, with Public access and Disabled highlighted."::: 

1. Under **Firewall exception**, check that **Allow trusted Microsoft services to access this container registry** is selected, and then select **Save**.

   :::image type="content" source="media/how-to-configure-extensibility-bicep-container-image/container-registry-network-disable-public.png" alt-text="Screenshot of the ACR network settings, with Allow trusted Microsoft services to access this container registry and Save highlighted.":::

##### Assign the AcrPull role

Creating environments by using container images uses the ADE infrastructure, including projects and environment types. Each project has one or more project environment types, which need read access to the container image that defines the environment to be deployed. To access the images within your ACR securely, assign the AcrPull role to each project environment type. 

To assign the AcrPull role to the Project Environment Type:

1. In the Azure portal, go to the ACR that you want to configure.
1. On the left menu, select **Access Control (IAM)**.
1. Select **Add** > **Add role assignment**.
1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

    | Setting | Value |
    | --- | --- |
    | **Role** | Select **AcrPull**. |
    | **Assign access to** | Select **User, group, or service principal**. |
    | **Members** | Enter the name of the project environment type that needs to access the image in the container. |

   The project environment type displays like the following example:

   :::image type="content" source="media/how-to-configure-extensibility-bicep-container-image/container-registry-access-control.png" alt-text="Screenshot of the Select members pane, showing a list of project environment types with part of the name highlighted.":::

In this configuration, ADE uses the Managed Identity for the PET, whether system assigned or user assigned.

> [!Tip]
> This role assignment has to be made for every project environment type. It can be automated through the Azure CLI.

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

## Related content

- [ADE CLI Custom Runner Image reference](https://aka.ms/deployment-environments/ade-cli-reference)
- [ADE CLI variables reference](reference-deployment-environment-variables.md)
