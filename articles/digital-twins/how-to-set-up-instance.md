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

This article will walk you through the steps to set up a new Azure Digital Twins instance. There are two parts to setting up an instance:
1. Creating the instance
2. Assigning yourself [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) permissions to manage the instance

This article describes two possible ways to go through these steps. The first is to run an [**automated deployment script** sample](https://docs.microsoft.com/samples/azure-samples/digital-twins-samples/digital-twins-samples/) that streamlines the process. The second is to complete the steps yourself **manually**.

Whichever process you are using, both require an Azure subscription (which you can set up for free [here](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)), and utilize Azure Cloud Shell.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Option 1: Automated setup with the deployment script

There's an Azure Digital Twins code sample that contains a scripted version of the setup. You can use the scripted deployment sample to set up an Azure Digital Twins instance and permissions in a streamlined way, or as a starting point for writing your own scripted interactions.

The sample script is written in PowerShell. It is part of the [Azure Digital Twins samples](https://docs.microsoft.com/samples/azure-samples/digital-twins-samples/digital-twins-samples/), which you can download by navigating to that sample link and selecting the *Download ZIP* button underneath the title.

In the downloaded sample folder, the deployment script is located at _Azure_Digital_Twins_samples.zip > scripts > **deploy.ps1**_.

### Run the script

Here are the steps to run the deployment script in Cloud Shell.
1. Open a new [Azure Cloud Shell](https://shell.azure.com/) window in your browser. Sign in using this command:
    ```azurecli-interactive
    az login
    ```
    If the CLI can open your default browser, it will do so and load an Azure sign-in page. Otherwise, open a browser page at *https://aka.ms/devicelogin* and enter the authorization code displayed in your terminal.
 
2. After signing in, look to the Cloud Shell window icon bar. Select the "Upload/Download files" icon and choose "Upload".

    :::image type="content" source="media/how-to-set-up-instance/cloud-shell-upload.png" alt-text="Cloud Shell window showing selection of the Upload option":::

    Navigate to the _**deploy.ps1**_ file on your machine and hit "Open." This will upload the file to Cloud Shell so that you can run it in the Cloud Shell window.

3. Run the script by sending the `./deploy.ps1` command in the Cloud Shell window. As the script runs through the automated setup steps, you will be asked to pass in the following values:
    * For the instance: the *subscription ID* of your Azure subscription to use
    * For the instance: a *resource group* name (you can use an existing resource group, or enter a new name of one to create)
    * For the instance: a *name* for your Azure Digital Twins instance
    * For the app registration: an *AAD application display name* to associate with the registration
    * For the app registration: an *AAD application reply URL* for the AAD application. You can use `http://localhost`.

Upon script completion, you now have an Azure Digital Twins instance ready to go and permissions set up to manage it.

## Option 2: Manual setup

This section explains the process for setting up an Azure Digital Twins instance manually. The following steps are the same steps that the  deployment script from [*Option 1: Automated setup with the deployment script*](#option-1-automated-setup-with-the-deployment-script) relies on behind the scenes.

[!INCLUDE [Cloud Shell for Azure Digital Twins](../../includes/digital-twins-cloud-shell.md)]

### Create the Azure Digital Twins instance

First, you will create a new Azure resource group for use in this how-to. Then, you can **create a new instance of Azure Digital Twins** inside that resource group. 

You'll also need to provide a name for your instance and choose a region for the deployment. To see what regions support Azure Digital Twins, visit [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=digital-twins).

>[!NOTE]
> The name of the new instance must be unique within the region (meaning that if another Azure Digital Twins instance in that region is already using the name you choose, you'll have to pick a different name).

Create the resource group and the instance with the following commands:

```azurecli
az group create --location <region> --name <name-for-your-resource-group>
az dt create --dt-name <name-for-your-Azure-Digital-Twins-instance> -g <your-resource-group> -l <region>
```

The result of these commands looks something like this, outputting information about the resources you've created:

:::image type="content" source="media/how-to-set-up-instance/create-instance.png" alt-text="Command window with successful creation of resource group and Azure Digital Twins instance":::

Note the Azure Digital Twins instance's *hostName*, *name*, and *resourceGroup* from the output. These are all key values that you may need as you continue working with your Azure Digital Twins instance, to set up authentication and related Azure resources.

> [!TIP]
> You can see these properties, along with all the properties of your instance, at any time by running `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

### Assign Azure Active Directory permissions

Azure Digital Twins uses [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) for role-based access control (RBAC). This means that before you can make data plane calls to your Azure Digital Twins instance, you must first assign yourself a role with these permissions.

In order to use Azure Digital Twins with a client application, you'll also need to make sure your client app can authenticate against Azure Digital Twins. This is done by setting up an Azure Active Directory (AAD) app registration, which you can read about in [*How-to: Authenticate a client application*](how-to-authenticate-client.md).

#### Assign yourself a role

Create a role assignment for yourself in the Azure Digital Twins instance, using your email associated with the AAD tenant on your Azure subscription. 

To be able to do this, you need to be classified as an owner in your Azure subscription. You can check this by running the `az role assignment list --assignee <your-Azure-email>` command, and verifying in the output that the *roleDefinitionName* value is *Owner*. If you find that the value is *Contributor* or something other than *Owner*, please contact your subscription administrator with the power to grant permissions in your subscription. They can either elevate your role on the entire subscription so that you can run the following command, or an owner can run the following command on your behalf to set up your Azure Digital Twins permissions for you.

To assign your user "owner" permissions in your Azure Digital Twins instance, use the following command (must be run by an owner of the Azure subscription):

```azurecli
az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<your-AAD-email>" --role "Azure Digital Twins Owner (Preview)"
```

The result of this command is outputted information about the role assignment that's been created.

> [!TIP]
> If you get a *400: BadRequest* error instead, run the following command to get the *ObjectID* for your user:
> ```azurecli
> az ad user show --id <your-AAD-email> --query objectId
> ```
> Then, repeat the role assignment command using your user's *Object ID* in place of your email.

You now have an Azure Digital Twins instance ready to go, and permissions to manage it.

## Next steps

See how to set up and authenticate a client app to work with your instance:
* [How-to: Authenticate a client application](how-to-authenticate-client.md)
