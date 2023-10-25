---
title: Integrate Azure IoT Central with CI/CD
description: Describes how to integrate IoT Central into a pipeline created with Azure Pipelines to enable continuous integration and continuous delivery.
author: troyhopwood
ms.author: troyhop
ms.date: 06/12/2023
ms.topic: how-to
ms.service: iot-central
ms.custom: devx-track-azurecli
---

# Integrate IoT Central with Azure Pipelines for continuous integration and continuous delivery

Continuous integration and continuous delivery (CI/CD) refers to the process of developing and delivering software in short, frequent cycles using automation pipelines. This article shows you how to automate the build, test, and deployment of an IoT Central application configuration. This automation enables development teams to deliver reliable releases more frequently.

Continuous integration starts with a commit of your code to a branch in a source code repository. Each commit is merged with commits from other developers to ensure that no conflicts are introduced. Changes are further validated by creating a build and running automated tests against that build. This process ultimately results in an artifact, or deployment bundle, to deploy to a target environment. In this case, the target is an Azure IoT Central application.

Just as IoT Central is a part of your larger IoT solution, IoT Central is a part of your CI/CD pipeline. Your CI/CD pipeline should deploy your entire IoT solution and all configurations to each environment from development through to production:

:::image type="content" source="media/howto-integrate-with-devops/pipeline.png" alt-text="Diagram that shows the stages of a typical CI/CD pipeline." border="false":::

IoT Central is an *application platform as a service* that has different deployment requirements from *platform as a service* components. For IoT Central, you deploy configurations and device templates. These configurations and device templates are managed and integrated into your release pipeline by using APIs.

While it's possible to automate IoT Central app creation, you should create an app in each environment before you develop your CI/CD pipeline.

By using the Azure IoT Central REST API, you can integrate IoT Central app configurations into your release pipeline.

This guide walks you through the creation of a new pipeline that updates an IoT Central application based on configuration files managed in GitHub. This guide has specific instructions for integrating with [Azure Pipelines](/azure/devops/pipelines/?view=azure-devops&preserve-view=true), but could be adapted to include IoT Central in any release pipeline built using tools such as Tekton, Jenkins, GitLab, or GitHub Actions.

In this guide, you create a pipeline that only applies an IoT Central configuration to a single instance of an IoT Central application. You should integrate the steps into a larger pipeline that deploys your entire solution and promotes it from *development* to *QA* to *preproduction* to *production*, performing all necessary testing along the way.

The scripts currently don't transfer the following settings between IoT Central instances: dashboards, views, custom settings in device templates, pricing plan, UX customizations, application image, rules, scheduled jobs, saved jobs, and enrollment groups.

The scripts currently don't remove settings from the target IoT Central application that aren't present in the configuration file.

## Prerequisites

You need the following prerequisites to complete the steps in this guide:

- Two IoT Central applications - one for your development environment and one for your production environment. To learn more, see [Create an IoT Central application](howto-create-iot-central-application.md).
- Two Azure Key Vaults - one for your development environment and one for your production environment. It's best practice to have a dedicated Key Vault for each environment. To learn more, see [Create an Azure Key Vault with the Azure portal](../../key-vault/general/quick-create-portal.md).
- A GitHub account [GitHub](https://github.com/).
- An Azure DevOps organization. To learn more, see [Create an Azure DevOps organization](/azure/devops/organizations/accounts/create-organization).
- PowerShell 7 for Windows, Mac or Linux. [Get PowerShell](/powershell/scripting/install/installing-powershell).
- Azure Az PowerShell module installed in your PowerShell 7 environment. To learn more, see [Install the Azure Az PowerShell module](/powershell/azure/install-azure-powershell).
- Visual Studio Code or other tool to edit PowerShell and JSON files.[Get Visual Studio Code](https://code.visualstudio.com/Download).
- Git client. Download the latest version from [Git - Downloads (git-scm.com)](https://git-scm.com/downloads).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Download the sample code

To get started, fork the IoT Central CI/CD GitHub repository and then clone your fork to your local machine:

1. To fork the GitHub repository, open the [IoT Central CI/CD GitHub repository](https://github.com/Azure/iot-central-CICD-sample) and select **Fork**.

1. Clone your fork of the repository to your local machine by opening a console or bash window and running the following command.

    ```cmd/sh
    git clone https://github.com/{your GitHub username}/iot-central-CICD-sample
    ```

## Create a service principal

While Azure Pipelines can integrate directly with a key vault, a pipeline needs a service principal for some dynamic key vault interactions such as fetching secrets for data export destinations.

To create a service principal scoped to your subscription:

1. Run the following command to create a new service principal:

    ```azurecli
    az ad sp create-for-rbac -n DevOpsAccess --scopes /subscriptions/{your Azure subscription Id} --role Contributor
    ```

1. Make a note of the **password**, **appId**, and **tenant** as you need these values later.

1. Add the service principal password as a secret called `SP-Password` to your production key vault:

    ```azurecli
    az keyvault secret set --name SP-Password --vault-name {your production key vault name} --value {your service principal password}
    ```

1. Give the service principal permission to read secrets from the key vault:

    ```azurecli
    az keyvault set-policy --name {your production key vault name} --secret-permissions get list --spn {the appId of the service principal}
    ```

## Generate IoT Central API tokens

In this guide, your pipeline uses API tokens to interact with your IoT Central applications. It's also possible to use a service principal.

> [!NOTE]
> IoT Central API tokens expire after one year.

Complete the following steps for both your development and production IoT Central apps.

1. In your IoT Central app, select **Permissions** and then **API tokens**.
1. Select **New**.
1. Give the token a name, specify the top-level organization in your app, and set the role to **App Administrator**.
1. Make a note of the API token from your development IoT Central application. You use it later when you run the *IoTC-Config.ps1* script.
1. Save the generated token from the production IoT Central application as a secret called `API-Token` to the production key vault:

    ```azurecli
    az keyvault secret set --name API-Token --vault-name {your production key vault name} --value '{your production app API token}'
    ```

## Generate a configuration file

These steps produce a JSON configuration file for your development environment based on an existing IoT Central application. You also download all the existing device templates from the application.

1. Run the following PowerShell 7 script in the local copy of the IoT Central CI/CD repository:

    ```powershell
    cd .\iot-central-CICD-sample\PowerShell\
    .\IoTC-Config.ps1
    ```

1. Follow the instructions to sign in to your Azure account.
1. After you sign in, the script displays the IoTC Config options menu. The script can generate a config file from an existing IoT Central application and apply a configuration to another IoT Central application.
1. Select option **1** to generate a configuration file.
1. Enter the necessary parameters and press **Enter**:
    - The API token you generated for your development IoT Central application.
    - The subdomain of your development IoT Central application.
    - Enter *..\Config\Dev* as the folder to store the config file and device templates.
    - The name of your development key vault.

1. The script creates a folder called *IoTC Configuration* in the *Config\Dev* folder in your local copy of the repository. This folder contains a configuration file and a folder called *Device Models* for all the device templates in your application.

## Modify the configuration file

Now that you have a configuration file that represents the settings for your development IoT Central application instance, make any necessary changes before you apply this configuration to your production IoT Central application instance.

1. Create a copy of the *Dev* folder created previously and call it *Production*.
1. Open IoTC-Config.json in the *Production* folder using a text editor.
1. The file has multiple sections. However, if your application doesn't use a particular setting, that section is omitted from the file:

    ```json
    {
      "APITokens": {
        "value": [
          {
            "id": "dev-admin",
            "roles": [
              {
                "role": "ca310b8d-2f4a-44e0-a36e-957c202cd8d4"
              }
            ],
            "expiry": "2023-05-31T10:47:08.53Z"
          }
        ]
      },
      "data exports": {
        "value": [
          {
            "id": "5ad278d6-e22b-4749-803d-db1a8a2b8529",
            "displayName": "All telemetry to blob storage",
            "enabled": false,
            "source": "telemetry",
            "destinations": [
              {
                "id": "393adfc9-0ed8-45f4-aa29-25b5c96ecf63"
              }
            ],
            "status": "notStarted"
          }
        ]
      },
      "device groups": {
        "value": [
          {
            "id": "66f41d29-832d-4a12-9e9d-18932bee3141",
            "displayName": "MXCHIP Getting Started Guide - All devices"
          },
          {
            "id": "494dc749-0963-4ec1-89ff-e1de2228e750",
            "displayName": "RS40 Occupancy Sensor - All devices"
          },
          {
            "id": "dd87877d-9465-410b-947e-64167a7a1c39",
            "displayName": "Cascade 500 - All devices"
          },
          {
            "id": "91ceac5b-f98d-4df0-9ed6-5465854e7d9e",
            "displayName": "Simulated devices"
          }
        ]
      },
      "organizations": {
        "value": []
      },
      "roles": {
        "value": [
          {
            "id": "344138e9-8de4-4497-8c54-5237e96d6aaf",
            "displayName": "Builder"
          },
          {
            "id": "ca310b8d-2f4a-44e0-a36e-957c202cd8d4",
            "displayName": "Administrator"
          },
          {
            "id": "ae2c9854-393b-4f97-8c42-479d70ce626e",
            "displayName": "Operator"
          }
        ]
      },
      "destinations": {
        "value": [
          {
            "id": "393adfc9-0ed8-45f4-aa29-25b5c96ecf63",
            "displayName": "Blob destination",
            "type": "blobstorage@v1",
            "authorization": {
              "type": "connectionString",
              "connectionString": "DefaultEndpointsProtocol=https;AccountName=yourexportaccount;AccountKey=*****;EndpointSuffix=core.windows.net",
              "containerName": "dataexport"
            },
            "status": "waiting"
          }
        ]
      },
      "file uploads": {
        "connectionString": "FileUpload",
        "container": "fileupload",
        "sasTtl": "PT1H"
      },
      "jobs": {
        "value": []
      }
    }
    ```

1. If your application uses file uploads, the script creates a secret in your development key vault with the value shown in the `connectionString` property. Create a secret with the same name in your production key vault that contains the connection string for your production storage account. For example:

    ```azurecli
    az keyvault secret set --name FileUpload --vault-name {your production key vault name} --value '{your production storage account connection string}'
    ```

1. If your application uses data exports, add secrets for the destinations to the production key vault. The config file doesn't contain any actual secrets for your destination, the secrets are stored in your key vault.
1. Update the secrets in the config file with the name of the secret in your key vault.

    | Destination type | Property to change |
    | --- | --- |
    | Service Bus queue | connectionString |
    | Service Bus topic | connectionString |
    | Azure Data Explorer | clientSecret |
    | Azure Blob Storage | connectionString |
    | Event Hubs | connectionString |
    | Webhook No Auth | N/A |

    For example:

    ```json
    "destinations": {
      "value": [
        {
          "id": "393adfc9-0ed8-45f4-aa29-25b5c96ecf63",
          "displayName": "Blob destination",
          "type": "blobstorage@v1",
          "authorization": {
            "type": "connectionString",
            "connectionString": "Storage-CS",
            "containerName": "dataexport"
          },
          "status": "waiting"
        }
      ]
    }
    ```

1. To upload the *Configuration* folder to your GitHub repository, run the following commands from the *IoTC-CICD-howto* folder.

   ```cmd/sh
    git add Config
    git commit -m "Adding config directories and files"
    git push
   ```

## Create a pipeline

1. Open your Azure DevOps organization in a web browser by going to `https://dev.azure.com/{your DevOps organization}`
1. Select **New project** to create a new project.
1. Give your project a name and optional description and then select **Create**.
1. On the **Welcome to the project** page, select **Pipelines** and then **Create Pipeline**.
1. Select **GitHub** as the location of your code.
1. Select **Authorize AzurePipelines** to authorize Azure Pipelines to access your GitHub account.
1. On the **Select a repository** page, select your fork of the IoT Central CI/CD GitHub repository.
1. When prompted to log into GitHub and provide permission for Azure Pipelines to access the repository, select **Approve & install**.
1. On the **Configure your pipeline** page, select **Starter pipeline** to get started. The *azure-pipelines.yml* is displayed for you to edit.

## Create a variable group

An easy way to integrate key vault secrets into a pipeline is through variable groups. Use a variable group to ensure the right secrets are available to your deployment script. To create a variable group:

1. Select **Library** in the **Pipelines** section of the menu on the left.
1. Select **+ Variable group**.
1. Enter `keyvault` as the name for your variable group.
1. Enable the toggle to link secrets from an Azure key vault.
1. Select your Azure subscription and authorize it. Then select your production key vault name.

1. Select **Add** to start adding variables to the group.

1. Add the following secrets:
    - The IoT Central API Key for your production app. You called this secret `API-Token` when you created it.
    - The password for the service principal you created previously. You called this secret `SP-Password` when you created it.
1. Select **OK**.
1. Select **Save** to save the variable group.

## Configure your pipeline

Now configure the pipeline to push configuration changes to your IoT Central application:

1. Select **Pipelines** in the **Pipelines** section of the menu on the left.
1. Replace the contents of your pipeline YAML with the following YAML. The configuration assumes your production key vault contains:
    - The API token for your production IoT Central app in a secret called `API-Token`.
    - Your service principal password in a secret called `SP-Password`.
  
    Replace the values for `-AppName` and `-KeyVault` with the appropriate values for your production instances.

    You made a note of the `-AppId` and `-TenantId` when you created your service principal.

    ```yml
    trigger:
    - master
    variables:
    - group: keyvault
    - name: buildConfiguration
      value: 'Release'
    steps:
    - task: PowerShell@2
      displayName: 'IoT Central'
      inputs:
        filePath: 'PowerShell/IoTC-Task.ps1'
        arguments: '-ApiToken "$(API-Token)" -ConfigPath "Config/Production/IoTC Configuration" -AppName "{your production IoT Central app name}" -ServicePrincipalPassword (ConvertTo-SecureString "$(SP-Password)" -AsPlainText -Force) -AppId "{your service principal app id}" -KeyVault "{your production key vault name}" -TenantId "{your tenant id}"'
        pwsh: true
        failOnStderr:  true
    ```

1. Select **Save and run**.
1. The YAML file is saved to your GitHub repository, so you need to provide a commit message and then select **Save and run** again.

Your pipeline is queued. It may take a few minutes before it runs.

The first time you run your pipeline, you're prompted to give permissions for the pipeline to access your subscription and to access your key vault. Select **Permit** and then **Permit** again for each resource.

When your pipeline job completes successfully, sign in to your production IoT Central application and verify the configuration was applied as expected.

## Promote changes from development to production

Now that you have a working pipeline you can manage your IoT Central instances directly by using configuration changes. You can upload new device templates into the *Device Models* folder and make changes directly to the configuration file. This approach lets you treat your IoT Central application's configuration the same as any other code.

## Next steps

Now that you know how to integrate IoT Central configurations into your CI/CD pipelines, a suggested next step is to learn how to [Manage and monitor IoT Central from the Azure portal](howto-manage-iot-central-from-portal.md).
