---
author: baanders
description: include file with Azure Digital Twins setup steps (1, instance creation and authentication)
ms.service: digital-twins
ms.topic: include
ms.date: 4/22/2020
ms.author: baanders
---

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Also before you start, complete the following setup:
* Install [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) version 16.5.1XXX or later on your development machine. If you have an older version installed already, you can open the *Visual Studio Installer* app on your machine and follow the prompts to update your installation.
* Run the following command in your Cloud Shell instance to add the Microsoft Azure IoT Extension for Azure CLI.
    ```azurecli-interactive
    az extension add --name azure-iot
    ```

> [!NOTE]
> This article uses the newest version of the Azure IoT extension, called `azure-iot`. The legacy version is called `azure-iot-cli-ext`.You should only have one version installed at a time. You can use the command `az extension list` to validate the currently installed extensions.
> Use `az extension remove --name azure-cli-iot-ext` to remove the legacy version of the extension.
> Use `az extension add --name azure-iot` to add the new version of the extension. 
> To see what extensions you have installed, use `az extension list`.

> [!TIP]
> You can run `az dt -h` to see the top-level Azure Digital Twins commands.

## Set up an Azure Digital Twins instance

Begin by logging in, setting the shell context to your subscription, and registering with the Azure Digital Twins namespace.

```azurecli
az account set --subscription <your-Azure-subscription-ID>
az provider register --namespace 'Microsoft.DigitalTwins'
```

Next, run the following commands to create a new Azure resource group for use in this tutorial, and then create a new instance of Azure Digital Twins in this resource group.

```azurecli
az group create --location "westcentralus" --name <name-for-your-resource-group>
az dt create --dt-name <name-for-your-Azure-Digital-Twins-instance> -g <your-resource-group> -l "westcentralus"
```

The result of these commands looks something like this, outputting information about the resources you've created:

:::image type="content" source="../articles/digital-twins-v2/media/include-setup/create-instance.png" alt-text="Command window with successful creation of resource group and Azure Digital Twins instance":::

Note the Azure Digital Twins instance's *hostName*, *name*, and *resourceGroup* from the output. These are all key values that you may need as you continue working with your Azure Digital Twins instance, to set up authentication and related Azure resources.

> [!TIP]
> You can see these properties, along with all the properties of your instance, at any time by running `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

### Assign Azure Active Directory permissions

Azure Digital Twins uses [Azure Active Directory (AAD)](../articles/active-directory/fundamentals/active-directory-whatis.md) for role-based access control (RBAC). This means that before you can make data plane calls to your Azure Digital Twins instance, you must first assign yourself a role with these permissions.

You also need to make sure your client app can authenticate against Azure Digital Twins, which you'll do by setting up an Azure Active Directory (AAD) app registration.

#### Assign yourself a role

Create a role assignment for yourself using your email associated with the AAD tenant on your Azure subscription. The following command assigns your user to an owner role:

```azurecli
az dt rbac assign-role --dt-name <your-Azure-Digital-Twins-instance> --assignee "<your-AAD-email>" --role owner
```

The result of this command is outputted information about the role assignment you've created.

> [!TIP]
> If you get a *400: BadRequest* error instead, run the following command to get the *ObjectID* for your user:
> ```azurecli
> az ad user show --id <your-AAD-email> --query objectId
> ```
> Then, repeat the role assignment command using your user's *Object ID* in place of your email.