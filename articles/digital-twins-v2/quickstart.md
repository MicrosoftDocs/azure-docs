---
# Mandatory fields.
title: Create and configure Azure Digital Twins
titleSuffix: Azure Digital Twins
description: Walk through an introductory Azure Digital Twins setup.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/13/2020
ms.topic: quickstart
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Getting started with the Azure Digital Twins sample app

In this section, you will set up to use Azure Digital Twins, create an instance and configure your application, and perform some sample actions on the solution.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

> [!NOTE]
> The PowerShell version of Azure Cloud Shell is recommended for its parsing of quotations. The other bash version will work for most commands, but may fail on commands with *single-quote* and/or *double-quote* characters.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Before you start, download this entire repository to your machine. We recommend downloading as a ZIP file.

Before you start, install [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) version 16.5.1XXX or later on your development machine. If you have an older version installed already, open the *Visual Studio Installer* app on your machine and follow the prompts to update your installation.

Next, run the following command in your Cloud Shell instance to add the Microsoft Azure IoT Extension for Azure CLI.

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

## Create an Azure Digital Twins instance

Begin by logging in and setting the shell context to your subscription.

```Azure CLI
az login
az account set --subscription <your-subscription-ID>
```

Run the following commands to register with the Azure Digital Twins namespace, create a new resource group to use in this tutorial, and create your Azure Digital Twins instance.

```Azure CLI
az provider register --namespace 'Microsoft.DigitalTwins'

az group create --location "westcentralus" --name <name-for-your-resource-group>
az dt create --dt-name <name-for-your-Azure-Digital-Twins-instance> -g <your-resource-group>
```

The result of these commands looks something like this, outputting information about the resources you've created:
![Command window with successful creation of resource group and Azure Digital Twins instance](media/quickstart/create-instance.png)

Save the Azure Digital Twins instance's *hostName*, *name*, and *resourceGroup*  from the output. You will use them later.

> [!TIP]
> You can see the properties of your instance at any time by running `az dt show --dt-name <your-Azure-Digital-Twins-instance>`.

## Assign Azure Active Directory permissions

Azure Digital Twins uses [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) for role-based access control (RBAC). This means that before you can make data plane calls to your Azure Digital Twins instance, you must first assign yourself a role with these permissions.

You also need to make sure your client app can authenticate against Azure Digital Twins, which you'll do by setting up an Azure Active Directory (AAD) app registration.

### Assign yourself a role

Create a role assignment for yourself using your email associated with the AAD tenant on your Azure subscription. The following command assigns your user to an owner role:

```Azure CLI
az dt rbac assign-role --dt-name <your-Azure-Digital-Twins-instance> --assignee "<your-AAD-email>" --role owner
```

The result of this command is outputted information about the role assignment you've created.

> [!TIP]
> If you get a *400: BadRequest* error instead, navigate to your user in the [AAD Users page](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/AllUsers) for your tenant. Repeat the command using your user's *Object ID* instead of your email.
> ![Azure portal: object ID for AAD user](media/quickstart/aad-user.png)

### Register your application

To configure an app registration, complete the "Create an app registration" section of [How to authenticate](how-to-authenticate.md). After doing this, your command window should look something like this:

![New AAD app registration](media/quickstart/new-app-registration.png)        

After creating the app registration, follow [this link](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) to navigate to the AAD app registration overview page in the Azure portal.

From this overview, select the app registration you just created from the list. This will open up its details in a page like this one:

![Azure portal: authentication IDs](media/quickstart/get-authentication-ids.png)

Take note of the *Application (client) ID* and *Directory (tenant) ID* shown on **your** page. You will use these values later.

## Configure the sample project

To get started with this app on your local machine, navigate to the sample project folder you downloaded from this repository.

Open _DigitalTwinsMetadata > DigitalTwinsSample > **Program.cs**_, and change `AdtInstanceUrl` to your Azure Digital Twins instance hostName, `ClientId` to your *Application ID*, and `TenantId` to your *Directory ID*.

```csharp
private const string ClientId = "<your-application-ID>";
private const string TenantId = "<your-directory-ID>";
//...
const string AdtInstanceUrl = "https://<your-Azure-Digital-Twins-instance-hostName>"
```

## Run and query the sample project

Start (![Visual Studio start button](media/tutorial-connect/start-button.jpg)) the *DigitalTwinsSample* project in Visual Studio. In the console that opens, run the following command to create a sample Azure Digital Twins solution:

```cmd/sh
buildingScenario
```

A main feature of Azure Digital Twins is the ability to query your twin graph easily and efficiently. The following examples are some sample query commands you can run. They begin with the `queryTwins` command, followed by an Azure Digital Twins Query Store language query.

* Query twins based on their *Temperature* property
    `queryTwins SELECT * FROM DigitalTwins T WHERE T.Temperature = 200 `

* Query twins based on the model
    `queryTwins SELECT * FROM DIGITALTWINS T WHERE IS_OF_MODEL(T, 'urn:example:Floor:1')`

* Query twins based on relationships
    `queryTwins SELECT room FROM DIGITALTWINS floor JOIN room RELATED floor.contains where floor.$dtId = 'floor1'`

You can also combine the above queries like you would in SQL, using combination operators such as `AND`, `OR`, `NOT`.