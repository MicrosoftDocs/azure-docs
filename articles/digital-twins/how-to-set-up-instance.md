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

This article walks through the steps to **set up a new Azure Digital Twins instance**, including creating the instance and setting up authentication. After completing this article, you will have an Azure Digital Twins instance ready to start programming against.

>[!NOTE]
>These operations are intended to be completed by an administrator, with an *Owner* role on the Azure subscription. Some steps can be completed without this level (and are noted as such throughout the article), but administrator cooperation will be required for complete setup. View more information on this in the [*Prerequisites: Required permissions*](#prerequisites-permission-requirements) section below.

Full setup for a new Azure Digital Twins instance consists of three parts:
1. **Creating the instance**
2. **Setting up your user's access permissions (admin role required)**: Your Azure user needs to have the *Azure Digital Twins Owner (Preview)* role on the instance in order to perform management activities. In this step, you will either assign yourself this role or get an administrator on your subscription to assign it to you.
3. **Setting up access permissions for client applications (admin role *maybe* required)**: It is common to write a client application that you use to interact with your instance. In order for that client app to access your Azure Digital Twins, you need to set up an *app registration* in [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) that the client application will use to authenticate to the instance.

This article offers two possible ways to go through these steps. The first is to run an [**automated deployment script** sample](https://docs.microsoft.com/samples/azure-samples/digital-twins-samples/digital-twins-samples/) that streamlines the process. The second is to complete the steps yourself **manually**.

Whichever process you are using, both require an Azure subscription (which you can set up for free [here](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)), and utilize Azure Cloud Shell.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites: Permission requirements

To be able to complete all the steps in this article, you need to be classified as an owner in your Azure subscription. 

You can check your permission level by running this command in Cloud Shell:

```azurecli-interactive
az role assignment list --assignee <your-Azure-email>
```

If you are an owner, the `roleDefinitionName` value in the output is *Owner*:

:::image type="content" source="media/how-to-set-up-instance/owner-role.png" alt-text="Cloud Shell window showing output of the az role assignment list command":::

If you find that the value is *Contributor* or something other than *Owner*, you can contact your subscription administrator and proceed in one of the following ways:
* Request for the administrator to complete all steps in this article on your behalf
* Complete the steps possible for your role, then request for the administrator to complete the rest on your behalf. Look for the *Permission requirements* section within each step to understand which is which.
* Request for the administrator to elevate your role on the entire subscription so that you will have the permissions to proceed yourself. Whether this is appropriate depends on your organization and your role within it.

## Option 1: Automated setup with the deployment script

There's an Azure Digital Twins code sample that contains a scripted version of the setup. You can use the scripted deployment sample to set up an Azure Digital Twins instance and permissions in a streamlined way, or as a starting point for writing your own scripted interactions.

The sample script is written in PowerShell. It is part of the [Azure Digital Twins samples](https://docs.microsoft.com/samples/azure-samples/digital-twins-samples/digital-twins-samples/), which you can download to your machine to get the code.

### Permission requirements

Owner role required: **Yes**

For the script to complete all steps successfully, you need to be classified as an owner in your Azure subscription.

### Run the script

Download the [Azure Digital Twins samples](https://docs.microsoft.com/samples/azure-samples/digital-twins-samples/digital-twins-samples/) repository by navigating to that sample link and selecting the *Download ZIP* button underneath the title.

In the downloaded sample folder, the deployment script is located at _Azure_Digital_Twins_samples.zip > scripts > **deploy.ps1**_.

Here are the steps to run the deployment script in Cloud Shell.
1. Go to an [Azure Cloud Shell](https://shell.azure.com/) window in your browser. Sign in using this command:
    ```azurecli-interactive
    az login
    ```
    If the CLI can open your default browser, it will do so and load an Azure sign-in page. Otherwise, open a browser page at *https://aka.ms/devicelogin* and enter the authorization code displayed in your terminal.
 
2. After signing in, look to the Cloud Shell window icon bar. Select the "Upload/Download files" icon and choose "Upload".

    :::image type="content" source="media/how-to-authenticate-client/cloud-shell-upload.png" alt-text="Cloud Shell window showing selection of the Upload option":::

    Navigate to the _**deploy.ps1**_ file on your machine and hit "Open." This will upload the file to Cloud Shell so that you can run it in the Cloud Shell window.

3. Run the script by sending the `./deploy.ps1` command in the Cloud Shell window. As the script runs through the automated setup steps, you will be asked to pass in the following values:
    * For the instance: the *subscription ID* of your Azure subscription to use
    * For the instance: a *location* where you'd like to deploy the instance
    * For the instance: a *resource group* name (you can use an existing resource group, or enter a new name of one to create)
    * For the instance: a *name* for your Azure Digital Twins instance
    * For the app registration: an *AAD application display name* to associate with the registration
    * For the app registration: an *AAD application reply URL* for the AAD application. You can use `http://localhost`.

The script will create an Azure Digital Twins instance, assign your Azure user the *Azure Digital Twins Owner (Preview)* role on the instance, and set up an AAD app registration for your client app to use.

Here is an excerpt of the output log from the script:

:::image type="content" source="media/how-to-set-up-instance/deployment-script-output.png" alt-text="Cloud Shell window showing log of input and output through the run of the deploy script" lightbox="media/how-to-set-up-instance/deployment-script-output.png":::

If the script completes successfully, the final printout will say `Deployment completed successfully`. Otherwise, address the error message, and re-run the script. It will bypass the steps that you've already completed and start requesting input again at the point where you left off.

Upon script completion, you now have an Azure Digital Twins instance ready to go and permissions set up to manage it.

## Option 2: Manual setup

This section explains the process for setting up an Azure Digital Twins instance manually. The following steps are the same steps that the deployment script from [*Option 1: Automated setup with the deployment script*](#option-1-automated-setup-with-the-deployment-script) runs through behind the scenes.

[!INCLUDE [Cloud Shell for Azure Digital Twins](../../includes/digital-twins-cloud-shell.md)]

### Create the Azure Digital Twins instance

In this section, you will **create a new instance of Azure Digital Twins**. 

#### Permission requirements

Owner role required: **No**

You do not have to be an owner on the Azure subscription to run this step.

#### Run the creation command

Now you'll create an instance of Azure Digital Twins using the Cloud Shell command. You'll need to provide:
* A resource group to deploy it in. If you don't already have an existing resource group in mind, you can create one now with this command:
    ```azurecli
    az group create --location <region> --name <name-for-your-resource-group>
    ```
* A region for the deployment. To see what regions support Azure Digital Twins, visit [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=digital-twins).
* A name for your instance. The name of the new instance must be unique within the region (meaning that if another Azure Digital Twins instance in that region is already using the name you choose, you'll be asked to pick a different name).

Use these values in the following command to create the instance:

```azurecli
az dt create --dt-name <name-for-your-Azure-Digital-Twins-instance> -g <your-resource-group> -l <region>
```

The result of these commands looks something like this, outputting information about the resources you've created:

:::image type="content" source="media/how-to-set-up-instance/create-instance.png" alt-text="Command window with successful creation of resource group and Azure Digital Twins instance":::

Note the Azure Digital Twins instance's *hostName*, *name*, and *resourceGroup* from the output. These are all key values that you may need as you continue working with your Azure Digital Twins instance, to set up authentication and related Azure resources.

> [!TIP]
> You can see these properties, along with all the properties of your instance, at any time by running `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

You now have an Azure Digital Twins instance ready to go. Next, you'll give the appropriate Azure user permissions to manage it.

### Set up your user's access permissions

Azure Digital Twins uses [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) for role-based access control (RBAC). This means that before a user can make data plane calls to your Azure Digital Twins instance, that user must first be assigned a role with permissions to do so.

For Azure Digital Twins, this role is _**Azure Digital Twins Owner (Preview)**_. You can read more about roles and security in [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md).

This section will show you how to create a role assignment for a user in the Azure Digital Twins instance, through their email associated with the AAD tenant on your Azure subscription. Depending on your role and your permissions on your Azure subscription, you will either set this up for yourself, or set this up on behalf of someone else who will be managing the Azure Digital Twins instance.

#### Permission requirements

Owner role required: **Yes**

For this step, you need to be classified as an owner in your Azure subscription.

#### Assign the role

To assign a user "owner" permissions in an Azure Digital Twins instance, use the following command (must be run by an owner of the Azure subscription):

```azurecli
az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<AAD-email-of-user-to-assign>" --role "Azure Digital Twins Owner (Preview)"
```

The result of this command is outputted information about the role assignment that's been created.

> [!TIP]
> If you get a *400: BadRequest* error instead, run the following command to get the *ObjectID* for the user:
> ```azurecli
> az ad user show --id <AAD-email-of-user-to-assign> --query objectId
> ```
> Then, repeat the role assignment command using the user's *Object ID* in place of their email.

Afterwards, one way to check that the role assignment was successful is to view the role assignments for the Azure Digital Twins instance in the Azure portal. From your portal page of [Azure Digital Twins instances](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.DigitalTwins%2FdigitalTwinsInstances), select the name of the instance you want to check. Then, view all of its assigned roles under *Access control (IAM) > Role assignments*. The user should show up in the list with a role of *Azure Digital Twins Owner (Preview)*. 

:::image type="content" source="media/how-to-set-up-instance/verify-role-assignment.png" alt-text="View of the role assignments for an Azure Digital Twins instance in Azure portal":::

You now have an Azure Digital Twins instance ready to go, and have assigned permissions to manage it. Next, you'll set up permissions for a client app to access it.

### Set up access permissions for client applications

Once you set up an Azure Digital Twins instance, it is common to interact with that instance through a client application that you create. In order to do this, you'll need to make sure the client app will be able to authenticate against Azure Digital Twins. This is done by setting up an [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) **app registration** for your client app to use.

This app registration is where you configure access permissions to the [Azure Digital Twins APIs](how-to-use-apis-sdks.md). Later, the client app will authenticate against the app registration, and as a result be granted the configured access permissions to the APIs.

#### Permission requirements

Owner role required: **Maybe**

By default, you do not have to be an owner on the Azure subscription to run this step. 

However, an admin may globally turn on *Admin Content Required* in AAD for all app registrations within your subscription. If so, you will need to be an admin to complete this step.

It is also possible that your organization requires additional action from admins in order to successfully set up an app registration. Here are some potential activities that an admin may need to perform:
* Grant admin consent for the app registration
* Confirm the *Read.Write* API permission is added to the registration for "Azure Digital Twins"
* Grant *Owner* role in the app registration to any users who will be calling the API

These and other operations can be performed from the [AAD App registrations](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) page in the Azure portal.

#### Create the registration

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

:::image type="content" source="media/how-to-set-up-instance/cloud-shell-upload.png" alt-text="Cloud Shell window showing selection of the Upload option":::
Navigate to the *manifest.json* you just created and hit "Open."

Next, run the following command to create an app registration (replacing placeholders as needed):

```azurecli
az ad app create --display-name <name-for-your-app> --native-app --required-resource-accesses manifest.json --reply-url http://localhost
```

Here is an excerpt of the output from this command, showing information about the registration you've created:

:::image type="content" source="media/how-to-set-up-instance/new-app-registration.png" alt-text="Cloud Shell output of new AAD app registration":::

#### Verify success

After creating the app registration, follow [this link](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) to navigate to the AAD app registration overview page in the Azure portal. This page shows all the app registrations that have been created in your subscription.

You should see the the app registration you just created in the overview list. Select it to open up its details.

First, verify that the settings from your uploaded *manifest.json* were properly set on the registration. To do this, select *Manifest* from the menu bar to view the app registration's manifest code. Scroll to the bottom of the code window and look for the fields from your *manifest.json* under `requiredResourceAccess`:

:::image type="content" source="media/how-to-set-up-instance/verify-manifest.png" alt-text="Portal view of the manifest for the AAD app registration":::

Next, select *API permissions* from the menu bar to verify that this app registration contains Read/Write permissions for Azure Digital Twins. You should see an entry like this:

:::image type="content" source="media/how-to-set-up-instance/verify-api-permissions.png" alt-text="Portal view of the API permissions for the AAD app registration, showing 'Read/Write Access' for Azure Digital Twins":::

#### Collect key values

Next, select *Overview* from the menu bar to see the details of the app registration:

:::image type="content" source="media/how-to-set-up-instance/app-key-values.png" alt-text="Portal view of the key values for the  app registration":::

Take note of the *Application (client) ID* and *Directory (tenant) ID* shown on **your** page. These values will be needed later to [authenticate a client app against the Azure Digital Twins APIs](how-to-authenticate-client.md). If you are not the person who will be writing code for such applications, you'll need to share these values with the person who will be.

> [!NOTE]
> Depending on your organization's requirements, you may need to make additional changes to the app registration. Here are some common requirements you may need to meet:
> * Activate public client access
> * Set specific reply URLs for web and desktop access
> * Allow for implicit OAuth2 authentication flows
> * If your Azure subscription is created using a Microsoft account such as Live, Xbox, or Hotmail, you need to set the *signInAudience* on the app registration to support personal accounts.
> The easiest way to set up these settings is to use the [Azure portal](https://portal.azure.com/). For more information about this process, see [Register an application with the Microsoft identity platform](https://docs.microsoft.com/graph/auth-register-app-v2).

You now have an Azure Digital Twins instance ready to go, have assigned permissions to manage it, and have set up permissions for a client app to access it.

## Next steps

See how to connect your client application to your instance by writing the client app's authentication code:
* [*How-to: Write app authentication code*](how-to-authenticate-client.md)
