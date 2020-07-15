---
# Mandatory fields.
title: Set up an instance and authentication
titleSuffix: Azure Digital Twins
description: See how to set up an instance of the Azure Digital Twins service, including the proper authentication.
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

# Set up an Azure Digital Twins instance and authentication

This article will walk you through the steps to set up a new Azure Digital Twins instance, including creating the instance and setting up authentication. There are three parts to this:
1. **Creating the instance**
2. **Setting up your user's access permissions**: Your Azure user needs to have the *Azure Digital Twins Owner (Preview)* role on the instance in order to perform management activities. In this step, you will either assign yourself this role or get an administrator on your subscription to assign it to you.
3. **Setting up access permissions for client applications**: You may want to write a client application that you use to interact with your instance. In order for that client app to access your Azure Digital Twins, you need to set up an *app registration* in [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) that the client application will use to authenticate to the instance.

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
    * For the instance: a *location* where you'd like to deploy the instance
    * For the instance: a *resource group* name (you can use an existing resource group, or enter a new name of one to create)
    * For the instance: a *name* for your Azure Digital Twins instance
    * For the app registration: an *AAD application display name* to associate with the registration
    * For the app registration: an *AAD application reply URL* for the AAD application. You can use `http://localhost`.

The script will create an Azure Digital Twins instance, assign your Azure user the *Azure Digital Twins Owner (Preview)* role on the instance, and set up an AAD app registration for your client app to use.

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

You now have an Azure Digital Twins instance ready to go. Next, you'll give your Azure user permissions to manage it.

### Set up your user's access permissions

Azure Digital Twins uses [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) for role-based access control (RBAC). This means that before you can make data plane calls to your Azure Digital Twins instance, you must first be assigned a role with permissions to do so.

For Azure Digital Twins, this role is *Azure Digital Twins Owner (Preview)*. You can read more about roles and security in [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md).

This section will show you how to create a role assignment for your user in the Azure Digital Twins instance, through your email associated with the AAD tenant on your Azure subscription. Depending on your permissions on your Azure subscription, you will either set this up for yourself, or get a subscription administrator to set it up for you.

#### Requirements

To be able to do this, you need to be classified as an owner in your Azure subscription. You can check this by running the `az role assignment list --assignee <your-Azure-email>` command, and verifying in the output that the *roleDefinitionName* value is *Owner*. If you find that the value is *Contributor* or something other than *Owner*, please contact your subscription administrator with the power to grant permissions in your subscription. They can either elevate your role on the entire subscription so that you can run the following command, or an owner can run the following command on your behalf to set up your Azure Digital Twins permissions for you.

#### Assign the role

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

You now have an Azure Digital Twins instance ready to go, and permissions to manage it. Next, you'll set up permissions for a client app to access it.

### Set up access permissions for client applications

Once you set up an Azure Digital Twins instance, it is common to interact with that instance through a client application that you create. In order to do this, you'll need to make sure your client app can authenticate against Azure Digital Twins. This is done by setting up an [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) **app registration** for your client app to use.

This app registration is where you configure access permissions to the [Azure Digital Twins APIs](how-to-use-apis-sdks.md). Your client app authenticates against the app registration, and as a result is granted the configured access permissions to the APIs.

To create an app registration, you need to provide the resource IDs for the Azure Digital Twins APIs, and the baseline permissions to the API. In your working directory, open a new file and enter the following JSON snippet to configure these details: 

```json
[{
    "resourceAppId": "0b07f429-9f4b-4714-9392-cc5e8e80c8b0",
    "resourceAccess": [
     {
       "id": "4589bd03-58cb-4e6c-b17f-b580e39652f8",
       "type": "Scope"
     }
    ]
}]
``` 

Save this file as *manifest.json*.

> [!NOTE] 
> There are some places where a "friendly," human-readable string `https://digitaltwins.azure.net` can be used for the Azure Digital Twins resource app ID instead of the GUID `0b07f429-9f4b-4714-9392-cc5e8e80c8b0`. For instance, many examples throughout this documentation set use authentication with the MSAL library, and the friendly string can be used for that. However, during this step of creating the app registration, the GUID form of the ID is required as it is shown above. 

In your Cloud Shell window, click the "Upload/Download files" icon and choose "Upload".

:::image type="content" source="media/how-to-authenticate-client/upload-extension.png" alt-text="Cloud Shell window showing selection of the Upload option":::
Navigate to the *manifest.json* you just created and hit "Open."

Next, run the following command to create an app registration (replacing placeholders as needed):

```azurecli
az ad app create --display-name <name-for-your-app> --native-app --required-resource-accesses manifest.json --reply-url http://localhost
```

The output from this command looks something like this.

:::image type="content" source="media/how-to-authenticate-client/new-app-registration.png" alt-text="New AAD app registration":::

After creating the app registration, follow [this link](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) to navigate to the AAD app registration overview page in the Azure portal.

From this overview, select the app registration you just created from the list. This will open up its details in a page like this one:

:::image type="content" source="media/how-to-authenticate-client/get-authentication-ids.png" alt-text="Azure portal: authentication IDs":::

Take note of the *Application (client) ID* and *Directory (tenant) ID* shown on **your** page. You will use these values later to authenticate a client app against the Azure Digital Twins APIs.

> [!NOTE]
> Depending on your scenario, you may need to make additional changes to the app registration. Here are some common requirements you may need to meet:
> * Activate public client access
> * Set specific reply URLs for web and desktop access
> * Allow for implicit OAuth2 authentication flows
> * If your Azure subscription is created using a Microsoft account such as Live, Xbox, or Hotmail, you need to set the *signInAudience* on the app registration to support personal accounts.
> The easiest way to set up these settings is to use the [Azure portal](https://portal.azure.com/). For more information about this process, see [Register an application with the Microsoft identity platform](https://docs.microsoft.com/graph/auth-register-app-v2).

You now have an Azure Digital Twins instance ready to go, permissions to manage it, and permissions for a client app to access it.

## Next steps

See how to connect your client application to your instance by writing the client app's authentication code:
* [*How-to: Write app authentication code*](how-to-authenticate-client.md)
