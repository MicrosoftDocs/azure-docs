---
title: Set plan technical configuration for an IoT Edge Module offer on Azure Marketplace
description: Set plan technical configuration for an IoT Edge Module offer on Azure Marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: aarathin
ms.author: aarathin
ms.date: 05/21/2021
---

# Set plan technical configuration for an IoT Edge Module offer

The IoT Edge Module offer type is a specific type of container that runs on an IoT Edge device. The plan **Technical configuration** tab lets you provide reference information for your container image repository inside the [Azure Container Registry](https://azure.microsoft.com/services/container-registry/), along with configuration settings that help customers use the module.

After you submit the offer, your IoT Edge container image is copied to Azure Marketplace in a specific public container registry. All requests from Azure users to use your module are served from the Azure Marketplace public container registry, not your private container registry.

You can target multiple platforms and provide several versions of your module container image using tags. To learn more about tags and versioning, see [Prepare your IoT Edge module technical assets](iot-edge-technical-asset.md).

## Image repository details

Select **Azure Container Registry** as the image source.

Provide the **Azure subscription ID** where resource usage is reported and services are billed for the Azure Container Registry that includes your container image. You can find this ID on the [Subscriptions page](https://ms.portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) in the Azure portal.

Provide the [**Azure resource group name**](../azure-resource-manager/management/manage-resource-groups-portal.md) that contains the Azure Container Registry with your container image. The resource group must be accessible in the subscription ID (above). You can find the name on the [Resource groups](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceGroups) page in the Azure portal.

Provide the [**Azure container registry name**](../container-registry/container-registry-intro.md) that has your container image. The container registry must be present in the Azure resource group you provided earlier. Provide only the registry name, not the full login server name. Omit **azurecr.io** from the name. You can find the registry name on the [Container Registries page](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.ContainerRegistry%2Fregistries) in the Azure portal.

Provide the [**Admin username for the Azure Container Registry**](../container-registry/container-registry-authentication.md#admin-account) associated with the Azure Container Registry that has your container image. The username and password (next step) are required to ensure your company has access to the registry. To get the admin username and password, set the **admin-enabled** property to **True** using the Azure Command-Line Interface (CLI). You can optionally set **Admin user** to **Enable** in the Azure portal.

:::image type="content" source="media/iot-edge/example-iot-update-container-registry.png" alt-text="Illustrates the Update container registry dialog box.":::

#### Call-out description

1. Admin user

<br>Provide the **Admin password for the Azure Container Registry** for the admin username associated with the Azure Container Registry and has your container image. The username and password are required to ensure your company has access to the registry. You can get the password from the Azure portal by going to **Container Registry** > **Access Keys** or with Azure CLI using the [show command.](/cli/azure/acr/credential#az-acr-credential-show)

:::image type="content" source="media/iot-edge/example-iot-access-keys.png" alt-text="Illustrates the access key screen in the Azure portal.":::

#### Call-out descriptions

1. Access keys
2. Username
3. Password

Provide the **Repository name within the Azure Container Registry** that has your image. You specify the name of the repository when you push the image to the registry. You can find the name of the repository by going to the [Container Registry](https://azure.microsoft.com/services/container-registry/) > **Repositories page**. For more information, see [View container registry repositories in the Azure portal](../container-registry/container-registry-repositories.md). After the name is set, it can't be changed. Use a unique name for each offer in your account.

> [!NOTE]
> We don't support Encrypted Azure Container Registry for Edge Module Certification. Azure Container Registry should be created without Encryption enabled.

## Image versions

Customers must be able to automatically get updates from the Azure Marketplace when you publish an update. If they don't want to update, they must be able to stay on a specific version of your image. You can do this by adding new image tags each time you make an update to the image.

Select **Add Image version** to include an **Image tag** that points to the latest version of your image on all supported platforms. It must also include a version tag (for example, starting with xx.xx.xx, where xx is a number). Customers should use [manifest tags](https://github.com/estesp/manifest-tool) to target multiple platforms. All tags referenced by a manifest tag must also be added so we can upload them. All manifest tags (except the latest tag) must start with either X.Y- or X.Y.Z- where X, Y, and Z are integers. For example, if a latest tag points to `1.0.1-linux-x64`, `1.0.1-linux-arm32`, and `1.0.1-windows-arm32`, these six tags need to be added to this field. For details about tags and versioning, see [Prepare IoT Edge module technical assets](iot-edge-technical-asset.md).

> [!TIP]
> Add a test tag to your image so you can identify the image during testing.

## Default deployment settings

Define the most common settings to deploy your IoT Edge module (optional). Optimize customer deployments by letting them launch your IoT Edge module out-of-the-box with these default settings.

**Default routes**. The IoT Edge Hub manages communication between modules, the IoT Hub, and devices. You can set default routes for data input and output between modules and the IoT Hub, which gives you the flexibility to send messages where they need to go without the need for additional services to process messages or writing additional code. Routes are constructed using name/value pairs. You can define up to five default route names, each up to 512 characters long.

Use the correct [route syntax](../iot-edge/module-composition.md#declare-routes) in your route value (usually defined as FROM/message/* INTO $upstream). This means that any messages sent by any modules go to your IoT Hub. To refer to your module, use its default module name, which will be your **Offer Name**, without spaces or special characters. To refer to other modules that are not yet known, use the <FROM_MODULE_NAME> convention to let your customers know that they need to update this info. For details about IoT Edge routes, see [Declare routes](../iot-edge/module-composition.md#declare-routes)).

For example, if module ContosoModule listens for inputs on ContosoInput and output data at ContosoOutput, it makes sense to define the following two default routes:

- Name #1: ToContosoModule
- Value #1: FROM /messages/modules/<FROM_MODULE_NAME>/outputs/* INTO BrokeredEndpoint("/modules/ContosoModule/inputs/ContosoInput")
- Name #2: FromContosoModuleToCloud
- Value #2: FROM /messages/modules/ContonsoModule/outputs/ContosoOutput INTO $upstream

**Default module twin desired properties**. A module twin is a JSON document in the IoT Hub that stores the state information for a module instance, including desired properties. Desired properties are used along with reported properties to synchronize module configuration or conditions. The solution backend can set desired properties and the module can read them. The module can also receive change notifications in the desired properties. Desired properties are created using up to five name/value pairs and each default value must be fewer than 512 characters. You can define up to five name/value twin desired properties. Values of twin desired properties must be valid JSON, non-escaped, without arrays with a maximum nested hierarchy of four levels. In a scenario where a parameter required for a default value doesn't make sense (for example, the IP address of a customer's server), you can add a parameter as the default value. To learn more about twin desired properties, see [Define or update desired properties](../iot-edge/module-composition.md#define-or-update-desired-properties)).

For example, if a module supports a dynamically configurable refresh rate using twin desired properties, it makes sense to define the following default twin desired property:

- Name #1: RefreshRate
- Value #1: 60

**Default environment variables**. Environment variables provide supplemental information to a module that's helping the configuration process. Environment variables are created using name/value pairs. Each default environment variable name and value must be fewer than 512 characters, and you can define up to five. When a parameter required for a default value doesn't make sense (for example, the IP address of a customer's server), you can add a parameter as the default value.

For example, if a module requires to accept terms of use before being started, you can define the following environment variable:

- Name #1: ACCEPT_EULA
- Value #1: Y

**Default container create options**. Container creation options direct the creation of the IoT Edge module Docker container. IoT Edge supports Docker engine API Create Container options. See all the options at [List containers.](https://docs.docker.com/engine/api/v1.30/#operation/ContainerList) The create options field must be valid JSON, non-escaped, and fewer than 512 characters.

For example, if a module requires port binding, define the following create options:

"HostConfig":{"PortBindings":{"5012/tcp":[{"HostPort":"5012"}]}

## Samples

Here's an example of Azure Marketplace plan details (any listed prices are for example purposes only and not intended to reflect actual costs):

:::image type="content" source="media/iot-edge/example-iot-azure-marketplace-plan.png" alt-text="Illustrates Azure Marketplace plan details.":::

#### Call-out descriptions

1. Offer name
2. Plan name
3. Plan description

<br>Here's an example of the Azure portal plan details (any listed prices are for example purposes only and not intended to reflect actual costs):

:::image type="content" source="media/iot-edge/example-iot-azure-marketplace-plan-details.png" alt-text="Illustrates the Azure portal plan details.":::

#### Call-out descriptions

1. Offer name
2. Plan name
3. Plan description

Select **Save draft**, then **← Plan overview** in the left-nav menu to return to the plan overview page.

## Next steps

- To **Co-sell with Microsoft** (optional), select it in the left-nav menu. For details, see [Co-sell partner engagement](./co-sell-overview.md).
- If you're not setting up co-sell or you've finished, it's time to [Review and publish your offer](review-publish-offer.md).