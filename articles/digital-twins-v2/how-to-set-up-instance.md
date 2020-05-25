---
# Mandatory fields.
title: Create an Azure Digital Twins instance
titleSuffix: Azure Digital Twins
description: See how to set up an instance of the Azure Digital Twins service.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/22/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Set up an Azure Digital Twins instance

This article will walk you through the basic steps to set up a new Azure Digital Twins instance. This includes creating the instance, and assigning [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) permissions to the instance for yourself.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](cloud-shell-try-it.md)]

### Add the IoT extension to Cloud Shell

Run the following command in your Cloud Shell instance to add the Microsoft Azure IoT Extension for Azure CLI.

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
az group create --location <region> --name <name-for-your-resource-group>
az dt create --dt-name <name-for-your-Azure-Digital-Twins-instance> -g <your-resource-group> -l <region>
```

> [!TIP]
> To output a list of Azure region names that can be passed into commands in the Azure CLI, run this command:
> ```azurecli
> az account list-locations -o table
> ```
> To see what regions support Azure Digital Twins, visit [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=digital-twins).

The result of these commands looks something like this, outputting information about the resources you've created:

:::image type="content" source="media/include-setup/create-instance.png" alt-text="Command window with successful creation of resource group and Azure Digital Twins instance":::

Note the Azure Digital Twins instance's *hostName*, *name*, and *resourceGroup* from the output. These are all key values that you may need as you continue working with your Azure Digital Twins instance, to set up authentication and related Azure resources.

> [!TIP]
> You can see these properties, along with all the properties of your instance, at any time by running `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

### Assign Azure Active Directory permissions

Azure Digital Twins uses [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) for role-based access control (RBAC). This means that before you can make data plane calls to your Azure Digital Twins instance, you must first assign yourself a role with these permissions.

You also need to make sure your client app can authenticate against Azure Digital Twins, which you'll do by setting up an Azure Active Directory (AAD) app registration.

#### Assign yourself a role

Create a role assignment for yourself, using your email associated with the AAD tenant on your Azure subscription. First, make sure you are classified as an owner in your Azure subscription. Then, you can use the following command to assigns your user to an owner role in Azure Digital Twins:

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

You now have an Azure Digital Twins instance ready to go.

## Next steps

See how to set up and authenticate a client app to work with your instance:
* [How-to: Authenticate a client application](how-to-authenticate-client.md)