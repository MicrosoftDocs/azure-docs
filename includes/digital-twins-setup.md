---
author: baanders
description: include file with Azure Digital Twins setup steps
ms.service: digital-twins
ms.topic: include
ms.date: 4/16/2020
ms.author: baanders
---

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Also before you start, complete the following setup:
* Download this entire repository to your machine. We recommend downloading as a ZIP file.
* Install [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) version 16.5.1XXX or later on your development machine. If you have an older version installed already, open the *Visual Studio Installer* app on your machine and follow the prompts to update your installation.
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

```Azure CLI
az login
az account set --subscription <your-subscription-ID>
az provider register --namespace 'Microsoft.DigitalTwins'
```

Next, run the following commands to create a new Azure resource group for use in this tutorial, and then create a new instance of Azure Digital Twins in this resource group.

```Azure CLI

az group create --location "westcentralus" --name <name-for-your-resource-group>
az dt create --dt-name <name-for-your-Azure-Digital-Twins-instance> -g <your-resource-group>
```

The result of these commands looks something like this, outputting information about the resources you've created:
![Command window with successful creation of resource group and Azure Digital Twins instance](../articles/digital-twins-v2/media/include-setup/create-instance.png)

Save the Azure Digital Twins instance's *hostName*, *name*, and *resourceGroup*  from the output. You will use them later.

> [!TIP]
> You can see the properties of your instance at any time by running `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

### Assign Azure Active Directory permissions

Azure Digital Twins uses [Azure Active Directory (AAD)](../articles/active-directory/fundamentals/active-directory-whatis.md) for role-based access control (RBAC). This means that before you can make data plane calls to your Azure Digital Twins instance, you must first assign yourself a role with these permissions.

You also need to make sure your client app can authenticate against Azure Digital Twins, which you'll do by setting up an Azure Active Directory (AAD) app registration.

#### Assign yourself a role

Create a role assignment for yourself using your email associated with the AAD tenant on your Azure subscription. The following command assigns your user to an owner role:

```Azure CLI
az dt rbac assign-role --dt-name <your-Azure-Digital-Twins-instance> --assignee "<your-AAD-email>" --role owner
```

The result of this command is outputted information about the role assignment you've created.

> [!TIP]
> If you get a *400: BadRequest* error instead, navigate to your user in the [AAD Users page](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/AllUsers) for your tenant. Repeat the command using your user's *Object ID* instead of your email.
> ![Azure portal: object ID for AAD user](../articles/digital-twins-v2/media/include-setup/aad-user.png)

#### Register your application

To configure an app registration, complete the "Create an app registration" section of [How to authenticate](../articles/digital-twins-v2/how-to-authenticate.md). After doing this, your command window should look something like this:

![New AAD app registration](../articles/digital-twins-v2/media/include-setup/new-app-registration.png)        

After creating the app registration, follow [this link](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) to navigate to the AAD app registration overview page in the Azure portal.

From this overview, select the app registration you just created from the list. This will open up its details in a page like this one:

![Azure portal: authentication IDs](../articles/digital-twins-v2/media/include-setup/get-authentication-ids.png)

Take note of the *Application (client) ID* and *Directory (tenant) ID* shown on **your** page. You will use these values later.

## Configure the sample project

To get started with the sample project, navigate on your local machine to the project folder you downloaded from this repository.

Open _DigitalTwinsMetadata/DigitalTwinsSample/**Program.cs**_, and change `AdtInstanceUrl` to your Azure Digital Twins instance hostName, `ClientId` to your *Application ID*, and `TenantId` to your *Directory ID*.

```csharp
private const string ClientId = "<your-application-ID>";
private const string TenantId = "<your-directory-ID>";
//...
const string AdtInstanceUrl = "https://<your-Azure-Digital-Twins-instance-hostName>"
```

Save the file.