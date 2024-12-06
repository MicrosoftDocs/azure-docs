---
title: ADE extensibility model for custom container images
titleSuffix: Azure Deployment Environments
description: Learn how to use the ADE extensibility model to build and utilize custom container images within your environment definitions for deployment environments.
ms.service: azure-deployment-environments
ms.custom: devx-track-azurecli, devx-track-bicep
author: RoseHJM
ms.author: rosemalcolm
ms.date: 09/28/2024
ms.topic: how-to
zone_pivot_groups: ade-extensibility-iac-framework

#customer intent: As a platform engineer, I want to learn how to build and utilize custom images within my environment definitions for deployment environments.
---

# Configure container image to execute deployments

::: zone pivot="arm-bicep"
In this article, you learn how to build custom Bicep container images to deploy your environment definitions in Azure Deployment Environments (ADE).
::: zone-end

::: zone pivot="terraform"
In this article, you learn how to build custom Terraform container images to deploy your environment definitions in Azure Deployment Environments (ADE). You learn how to configure a custom image to provision infrastructure using the Terraform Infrastructure-as-Code (IaC) framework.
::: zone-end

::: zone pivot="pulumi"
In this article, you learn how to utilize [Pulumi](https://pulumi.com) for deployments in Azure Deployment Environments (ADE). You learn how to use a sample image provided by Pulumi or how to configure a custom image to provision infrastructure using the Pulumi Infrastructure-as-Code (IaC) framework.
::: zone-end

ADE supports an extensibility model that enables you to create custom images that you can use in your environment definitions. To use this extensibility model, create your own custom images and store them in a container registry like Azure Container Registry (ACR) or Docker Hub. You can then reference these images in your environment definitions to deploy your environments. 

::: zone pivot="arm-bicep"
An [environment definition](configure-environment-definition.md) comprises at least two files: a template file, like *azuredeploy.json* or *main.bicep*, and a manifest file named *environment.yaml*. ADE uses containers to deploy environment definitions. 

The ADE team provides a selection of images to get you started, including a core image, and an Azure Resource Manager (ARM)-Bicep image. You can access these sample images in the [Runner-Images](https://aka.ms/deployment-environments/runner-images) folder.
::: zone-end

::: zone pivot="terraform"
An [environment definition](configure-environment-definition.md) comprises at least two files: a template file, like *main.tf*, and a manifest file named *environment.yaml*. You use a container to deploy environment definition that uses Terraform.
::: zone-end

::: zone pivot="pulumi"
An [environment definition](configure-environment-definition.md) comprises at least two files: a Pulumi project file, *Pulumi.yaml*, and a manifest file named *environment.yaml*. It might also contain a user program written in your preferred programming language: C#, TypeScript, Python, etc. ADE uses containers to deploy environment definitions.
::: zone-end

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure Deployment Environments set up in your Azure subscription. 
  - To set up ADE, follow the [Quickstart: Configure Azure Deployment Environments](quickstart-create-and-configure-devcenter.md).

## Use container images with ADE

You can take one of the following approaches to use container images with ADE:
- **Use a sample container image** For simple scenarios, use the sample ARM-Bicep container image provided by ADE.
- **Create a custom container image** For more complex scenarios, create a custom container image that meets your specific requirements.
 
The main steps you'll follow when using a container image are:
1. Choose the image type you want to use: a sample image or a custom image.
    - If you use a custom image, you begin with a sample image and then customize it to fit your requirements.
1. Build the image.
1. Upload the image to a private registry or a public registry.
1. Configure access to the registry.
    - For a public registry, configure anonymous pull.
    - For a private registry, give the DevCenter ACR permissions.
1. Add your image location to the `runner` parameter in your environment definition
1. Deploy environments that use your custom image.


The first step in the process is to choose the type of image you want to use. Select the corresponding tab to see the process.

### [Use a sample container image](#tab/sample/)

::: zone pivot="arm-bicep"
### Use a sample container image

ADE supports ARM and Bicep without requiring any extra configuration. You can create an environment definition that deploys Azure resources for a deployment environment by adding the template files (like *azuredeploy.json* and *environment.yaml*) to your catalog. ADE then uses the sample ARM-Bicep container image to create the deployment environment.

In the *environment.yaml* file, the `runner` property specifies the location of the container image you want to use. To use the sample image published on the Microsoft Artifact Registry, use the respective identifiers `runner`.

The following example shows a `runner` that references the sample ARM-Bicep container image:
```yaml
    name: WebApp
    version: 1.0.0
    summary: Azure Web App Environment
    description: Deploys a web app in Azure without a datastore
    runner: Bicep
    templatePath: azuredeploy.json
```
You can see the sample Bicep container image in the ADE sample repository under the [Runner-Images folder for the ARM-Bicep](https://github.com/Azure/deployment-environments/tree/main/Runner-Images/ARM-Bicep) image.

For more information about how to create environment definitions that use the ADE container images to deploy your Azure resources, see [Add and configure an environment definition](configure-environment-definition.md).
::: zone-end

::: zone pivot="terraform"
Use a custom image to configure a Terraform image.
::: zone-end

::: zone pivot="pulumi"
### Use a sample container image provided by Pulumi

The Pulumi team provides a prebuilt image to get you started, which you can see in the [Runner-Image](https://github.com/pulumi/azure-deployment-environments/tree/main/Runner-Image) folder. This image is publicly available at Pulumi's Docker Hub as [`pulumi/azure-deployment-environments`](https://hub.docker.com/repository/docker/pulumi/azure-deployment-environments), so you can use it directly from your ADE environment definitions.

Here's a sample *environment.yaml* file that utilizes the prebuilt image:

```yaml
name: SampleDefinition
version: 1.0.0
summary: First Pulumi-Enabled Environment
description: Deploys a Storage Account with Pulumi
runner: pulumi/azure-deployment-environments:0.1.0
templatePath: Pulumi.yaml
```

You can find a few sample environment definitions in the [Environments folder](https://github.com/pulumi/azure-deployment-environments/tree/main/Environments).
::: zone-end

### [Create a custom image](#tab/custom/)

### Create a custom image

Creating a custom container image allows you to customize your deployments to fit your requirements. You can create custom images based on the ADE sample images.

After you complete the image customization, you must build the image and push it to your container registry.

::: zone pivot="arm-bicep"
 You can build and push the image manually, or use a script provided by Microsoft to automate the process.
::: zone-end

::: zone pivot="terraform"
Alternatively, you can fork the repo [Leveraging ADE's Extensibility Model With Terraform](https://github.com/Azure/ade-extensibility-model-terraform) to build and push the Terraform image to a provided ACR.
::: zone-end

You build custom images by using the ADE sample images as a base with ADE CLI, which is preinstalled on the sample images. To learn more about the ADE CLI, see the [CLI Custom Runner Image reference](https://aka.ms/deployment-environments/ade-cli-reference).

In this example, you learn how to build a Docker image to utilize ADE deployments and access the ADE CLI, basing your image off of one of the ADE authored images.

::: zone pivot="arm-bicep"
To create an image configured for ADE, follow these steps:
1. Create a custom image based on a sample image.
1. Install desired packages.
1. Configure operation shell scripts.
1. Create operation shell scripts to deploy ARM or Bicep templates.
::: zone-end

::: zone pivot="terraform"
To create an image configured for ADE, follow these steps:
1. Create a custom image based on a sample image.
1. Install desired packages.
1. Configure operation shell scripts.
1. Create operation shell scripts that use the Terraform CLI. 
::: zone-end

::: zone pivot="pulumi"
To create an image configured for ADE, follow these steps:
1. Create a custom image based on a sample image.
1. Install desired packages.
1. Configure operation shell scripts.
1. Create operation shell scripts that use the Pulumi CLI.
::: zone-end

**1. Create a custom image based on a sample image**

Create a DockerFile that includes a FROM statement pointing to a sample image hosted on Microsoft Artifact Registry. 

Here's an example FROM statement, referencing the sample core image:

```docker
FROM mcr.microsoft.com/deployment-environments/runners/core:latest
```

This statement pulls the most recently published core image, and makes it a basis for your custom image.

**2. Install required packages**
::: zone pivot="arm-bicep"
In this step, you install any packages you require in your image, including Bicep. You can install the Bicep package with the Azure CLI by using the RUN statement, as shown in the following example:

```azure cli
RUN az bicep install
```
::: zone-end

::: zone pivot="terraform"
In this step, you install any packages you require in your image, including Terraform. You can install the Terraform CLI to an executable location so that it can be used in your deployment and deletion scripts. 

Here's an example of that process, installing version 1.7.5 of the Terraform CLI:

```azure cli
RUN wget -O terraform.zip https://releases.hashicorp.com/terraform/1.7.5/terraform_1.7.5_linux_amd64.zip
RUN unzip terraform.zip && rm terraform.zip
RUN mv terraform /usr/bin/terraform
```

> [!Tip]
> You can get the download URL for your preferred version of the Terraform CLI from [Hashicorp releases](https://aka.ms/deployment-environments/terraform-cli-zip).
::: zone-end

::: zone pivot="pulumi"
You can install the Pulumi CLI to an executable location so that it can be used in your deployment and deletion scripts. 

Here's an example of that process, installing the latest version of the Pulumi CLI:

```docker
RUN apk add curl
RUN curl -fsSL https://get.pulumi.com | sh
ENV PATH="${PATH}:/root/.pulumi/bin"
```

Depending on which programming language you intend to use for Pulumi programs, you might need to install one or more corresponding runtimes. The Python runtime is already available in the base image.

Here's an example of installing Node.js and TypeScript:

```docker
# install node.js, npm, and typescript
RUN apk add nodejs npm
RUN npm install typescript -g
```
::: zone-end

The ADE sample images are based on the Azure CLI image, and have the ADE CLI and JQ packages preinstalled. You can learn more about the [Azure CLI](/cli/azure/), and the [JQ package](https://devdocs.io/jq/).

To install any more packages you need within your image, use the RUN statement.

**3. Configure operation shell scripts**

Within the sample images, operations are determined and executed based on the operation name. Currently, the two operation names supported are *deploy* and *delete*.

To set up your custom image to utilize this structure, specify a folder at the level of your Dockerfile named *scripts*, and specify two files, *deploy.sh*, and *delete.sh*. The deploy shell script runs when your environment is created or redeployed, and the delete shell script runs when your environment is deleted. You can see examples of shell scripts in the repository under the [Runner-Images folder for the ARM-Bicep](https://github.com/Azure/deployment-environments/tree/main/Runner-Images/ARM-Bicep) image.

To ensure these shell scripts are executable, add the following lines to your Dockerfile:

```docker
COPY scripts/* /scripts/
RUN find /scripts/ -type f -iname "*.sh" -exec dos2unix '{}' '+'
RUN find /scripts/ -type f -iname "*.sh" -exec chmod +x {} \;
```

::: zone pivot="arm-bicep"

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

::: zone pivot="terraform"

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
There are four steps to deploy infrastructure via Pulumi: 

1. `pulumi login` - connect to the state storage, either in local file system or in [Pulumi Cloud](https://www.pulumi.com/product/pulumi-cloud/)
1. `pulumi stack select` - create or select the stack to use for the particular environment
1. `pulumi config set` - pass deployment parameters as Pulumi configuration values
1. `pulumi up` - run the deployment to create new or update existing infrastructure in Azure

During the core image's entrypoint, any existing local state files are pulled into the container and the directory saved under the environment variable ```$ADE_STORAGE```. In order to access the existing state file, run the following commands:

```bash
mkdir -p $ADE_STORAGE
export PULUMI_CONFIG_PASSPHRASE=
pulumi login file://$ADE_STORAGE
```

To sign in to Pulumi Cloud instead, set your Pulumi access token as an environment variable, and run the following commands:

```bash
export PULUMI_ACCESS_TOKEN=YOUR_PULUMI_ACCESS_TOKEN
pulumi login
```

Any parameters set for the current environment are stored under the variable ```$ADE_OPERATION_PARAMETERS```. Additionally, the selected Azure region and resource group name are passed in ```ADE_ENVIRONMENT_LOCATION``` and ```ADE_RESOURCE_GROUP_NAME``` respectively. In order to set your Pulumi stack config, run the following commands:

```bash
# Create or select the stack for the current environment
pulumi stack select $ADE_ENVIRONMENT_NAME --create

# Store configuration values in durable storage
export PULUMI_CONFIG_FILE=$ADE_STORAGE/Pulumi.$ADE_ENVIRONMENT_NAME.yaml

# Set the Pulumi stack config
pulumi config set azure-native:location $ADE_ENVIRONMENT_LOCATION --config-file $PULUMI_CONFIG_FILE
pulumi config set resource-group-name $ADE_RESOURCE_GROUP_NAME --config-file $PULUMI_CONFIG_FILE
echo "$ADE_OPERATION_PARAMETERS" | jq -r 'to_entries|.[]|[.key, .value] | @tsv' |
  while IFS=$'\t' read -r key value; do
    pulumi config set $key $value --config-file $PULUMI_CONFIG_FILE
  done
```

Additionally, to utilize ADE privileges to deploy infrastructure inside your subscription, your script needs to use ADE Managed Service Identity (MSI) when provisioning infrastructure by using the Pulumi Azure Native or Azure Classic provider. If your deployment needs special permissions to complete your deployment, such as particular roles, assign those permissions to the project environment type's identity that is being used for your environment deployment. ADE sets the relevant environment variables, such as the client, tenant, and subscription IDs within the core image's entrypoint, so run the following commands to ensure the provider uses ADE MSI:

```bash
export ARM_USE_MSI=true
export ARM_CLIENT_ID=$ADE_CLIENT_ID
export ARM_TENANT_ID=$ADE_TENANT_ID
export ARM_SUBSCRIPTION_ID=$ADE_SUBSCRIPTION_ID
```

Now, you can run the `pulumi up` command to execute the deployment:
```bash
pulumi up --refresh --yes --config-file $PULUMI_CONFIG_FILE
```

During your deletion script, you can instead run the `destroy` command, as shown in the following example:
```bash
pulumi destroy --refresh --yes --config-file $PULUMI_CONFIG_FILE
```

Finally, to make the outputs of your deployment uploaded and accessible when accessing your environment via the Azure CLI, transform the output object from Pulumi to the ADE-specified format through the JQ package. Set the value to the $ADE_OUTPUTS environment variable, as shown in the following example:
```bash
stackout=$(pulumi stack output --json | jq -r 'to_entries|.[]|{(.key): {type: "string", value: (.value)}}')
echo "{\"outputs\": ${stackout:-{\}}}" > $ADE_OUTPUTS
```
::: zone-end

---


## Build an image

You can build your image using the Docker CLI. Ensure the [Docker Engine is installed](https://docs.docker.com/desktop/) on your computer. Then, navigate to the directory of your Dockerfile, and run the following command:

```docker
docker build . -t {YOUR_REGISTRY}.azurecr.io/{YOUR_REPOSITORY}:{YOUR_TAG}
```

For example, if you want to save your image under a repository within your registry named `customImage`, and upload with the tag version of `1.0.0`, you would run:

```docker
docker build . -t {YOUR_REGISTRY}.azurecr.io/customImage:1.0.0
```

## Make the custom image available to ADE

In order to use custom images, you need to store them in a container registry. You can use a public container registry or a private container registry. Azure Container Registry (ACR) is highly recommended, due to its tight integration with ADE, the image can be published without allowing public anonymous pull access. You must build your custom container image and push it to a container registry to make it available for use in ADE. 

It's also possible to store the image in a different container registry such as Docker Hub, but in that case it needs to be publicly accessible.

> [!Caution]
> Storing your container image in a registry with anonymous (unauthenticated) pull access makes it publicly accessible. Don't do that if your image contains any sensitive information. Instead, store it in Azure Container Registry (ACR) with anonymous pull access disabled. 

To use a custom image stored in ACR, you need to ensure that ADE has appropriate permissions to access your image. When you create an ACR instance, it's secure by default and only allows authenticated users to gain access. 

::: zone pivot="pulumi"
You can use Pulumi to create an Azure Container Registry and publish your image to it. Refer to the [Provisioning/custom-image](https://github.com/pulumi/azure-deployment-environments/tree/main/Provisioning/custom-image) example for a self-contained Pulumi project that creates all the required resources in your Azure account.
::: zone-end

Select the appropriate tab to learn more about each approach.

### [Private registry](#tab/private-registry/)

### Use a private registry with secured access

By default, access to pull or push content from an Azure Container Registry is only available to authenticated users. You can further secure access to ACR by limiting access from certain networks and assigning specific roles.

To create  an instance of ACR, which can be done through the Azure CLI, the Azure portal, PowerShell commands, and more, follow one of the [quickstarts](/azure/container-registry/container-registry-get-started-azure-cli).

#### Limit network access

To secure network access to your ACR, you can limit access to your own networks, or disable public network access entirely. If you limit network access, you must enable the firewall exception *Allow trusted Microsoft services to access this container registry*.

To disable access from public networks:

1. [Create an ACR instance](/azure/container-registry/container-registry-get-started-azure-cli) or use an existing one.
1. In the Azure portal, go to the ACR that you want to configure.
1. On the left menu, under **Settings**, select **Networking**.
1. On the Networking page, on the **Public access** tab, under **Public network access**, select **Disabled**.

   :::image type="content" source="media/how-to-configure-extensibility-bicep-container-image/container-registry-network-settings.png" alt-text="Screenshot of the Azure portal, showing the ACR network settings, with Public access and Disabled highlighted."::: 

1. Under **Firewall exception**, check that **Allow trusted Microsoft services to access this container registry** is selected, and then select **Save**.

   :::image type="content" source="media/how-to-configure-extensibility-bicep-container-image/container-registry-network-disable-public.png" alt-text="Screenshot of the ACR network settings, with Allow trusted Microsoft services to access this container registry and Save highlighted.":::

#### Assign the AcrPull role

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
### [Public registry](#tab/public-registry/)

### Use a public registry with anonymous pull

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
---

::: zone pivot="arm-bicep,terraform"
### Build a container image with a script

Rather than building your custom image and pushing it to a container registry yourself, you can use a script to build and push it to a specified container registry. 

[!INCLUDE [custom-image-script](includes/custom-image-script.md)]
::: zone-end

## Connect the image to your environment definition

When authoring environment definitions to use your custom image in their deployment, edit the `runner` property on the manifest file (environment.yaml or manifest.yaml).

```yaml
runner: "{YOUR_REGISTRY}.azurecr.io/{YOUR_REPOSITORY}:{YOUR_TAG}"
```

To learn more about how to create environment definitions that use the ADE container images to deploy your Azure resources, see [Add and configure an environment definition](configure-environment-definition.md).

## Related content

- [ADE CLI Custom Runner Image reference](https://aka.ms/deployment-environments/ade-cli-reference)
- [ADE CLI variables reference](reference-deployment-environment-variables.md)
::: zone pivot="pulumi"
- [Pulumi's azure-deployment-environments repository](https://github.com/pulumi/azure-deployment-environments)
::: zone-end