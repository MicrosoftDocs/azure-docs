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

Azure Deployment Environments (ADE) supports an extensibility model that enables you to Configure your environment definition with your preferred IaC template framework. You can store custom images in a container registry like Azure Container Registry (ACR) or Docker Hub and then reference them in your environment definitions to deploy environments.

::: zone pivot="arm-bicep"
In this article, you learn how to build custom Bicep container images to deploy your environment definitions in ADE. You learn how to use a standard image provided by Microsoft or how to configure a custom image provision infrastructure using the Bicep Infrastructure-as-Code (IaC) framework.
::: zone-end

::: zone pivot="terraform"
In this article, you learn how to build custom Terraform container images to create deployment environments with Azure Deployment Environments (ADE). You learn how to configure a custom image to provision infrastructure using the Terraform Infrastructure-as-Code (IaC) framework.
::: zone-end

::: zone pivot="pulumi"
In this article, you learn how to utilize [Pulumi](https://pulumi.com) for deployments in ADE. You learn how to use a standard image provided by Pulumi or how to configure a custom image to provision infrastructure using the Pulumi Infrastructure-as-Code (IaC) framework.
::: zone-end

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure Deployment Environments set up in your Azure subscription. 
  - To set up ADE, follow the [Quickstart: Configure Azure Deployment Environments](quickstart-create-and-configure-devcenter.md).


<!-- ====== ARM-Bicep ========================================================================================================= -->

::: zone pivot="arm-bicep"
## Use container images with ADE

You can take one of the following approaches to use container images with ADE:
- **Use a standard container image** For simple scenarios, use the standard ARM-Bicep container image provided by ADE.
- **Create a custom container image** For more complex scenarios, create a custom container image that meets your specific requirements.

## Use a standard container image

ADE supports ARM and Bicep without requiring any extra configuration. You can create an environment definition that deploys Azure resources for a deployment environment by adding the template files (like *azuredeploy.json* and *environment.yaml*) to your catalog. ADE then uses the standard ARM-Bicep container image to create the deployment environment.

In the *environment.yaml* file, the `runner` property specifies the location of the container image you want to use. To use the standard image published on the Microsoft Artifact Registry, use the respective identifiers `runner`.

The following example shows a `runner` that references the standard ARM-Bicep container image:
```yaml
    name: WebApp
    version: 1.0.0
    summary: Azure Web App Environment
    description: Deploys a web app in Azure without a datastore
    runner: Bicep
    templatePath: azuredeploy.json
```
You can see the standard Bicep container image in the ADE standard repository under the [Runner-Images folder for the ARM-Bicep](https://github.com/Azure/deployment-environments/tree/main/Runner-Images/ARM-Bicep) image.

For more information about how to create environment definitions that use the ADE container images to deploy your Azure resources, see [Add and configure an environment definition](configure-environment-definition.md).

## Create a custom container image

### [Create a custom image by using a script](#tab/custom-script/)
### Create a custom container image by using a script

Creating a custom container image allows you to customize your deployments to fit your requirements. You can create custom images based on the ADE standard images.

After you complete the image customization, you can build the image and push it to your container registry by using a script provided by Microsoft to automate the process.

[!INCLUDE [custom-image-create](includes/custom-image-create.md)]

### Build a container image with a script

Rather than building your custom image and pushing it to a container registry yourself, you can use a script to build and push it to a specified container registry. 

[!INCLUDE [custom-image-script](includes/custom-image-script.md)]


### [Create a custom image manually](#tab/custom-manual/)
### Create a custom container image manually

Creating a custom container image allows you to customize your deployments to fit your requirements. You can create custom images based on the ADE standard images.

After you complete the image customization, you can build the image and push it to your container registry manually.

[!INCLUDE [custom-image-create](includes/custom-image-create.md)]

### Build the custom image

You can build your image using the Docker CLI. Ensure the [Docker Engine is installed](https://docs.docker.com/desktop/) on your computer. Then, navigate to the directory of your Dockerfile, and run the following command:

```docker
docker build . -t {YOUR_REGISTRY}.azurecr.io/{YOUR_REPOSITORY}:{YOUR_TAG}
```

For example, if you want to save your image under a repository within your registry named `customImage`, and upload with the tag version of `1.0.0`, you would run:

```docker
docker build . -t {YOUR_REGISTRY}.azurecr.io/customImage:1.0.0
```
---

::: zone-end


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