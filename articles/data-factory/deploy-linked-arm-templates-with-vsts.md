---
title: Deploy linked ARM templates with VSTS
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to deploy linked ARM templates with Visual Studio Team Services (VSTS). 
author: jonburchel
ms.service: data-factory
ms.subservice: 
ms.custom: synapse
ms.topic: how-to
ms.date: 07/17/2023
ms.author: jburchel
---
# Deploy linked ARM templates with VSTS

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes how to deploy linked Azure Resource Manager (ARM) templates with Visual Studio Team Services (VSTS).

## Overview

When dealing with deploying many components in Azure, a single ARM template might be challenging to manage and maintain.  ARM linked templates allow you to make your deployment more modular and makes the templates easier to manage.  When dealing with large deployments, it's highly recommended to consider breaking down your deployment into a main template and multiple linked templates representing different components of your deployment.

Deploying ARM templates can be performed using several different methods such as using PowerShell, Azure CLI, and Azure portal.  A recommended approach however is to adopt one of DevOps practices, namely continuous deployment.  VSTS is an application lifecycle management tool hosted in the cloud and offered as a service.  One of the capabilities VSTS offers is release management.

This article describes how you can deploy linked ARM templates using the release management feature of VSTS. In order for the linked templates to be deployed properly, they need to be stored in a location that can be reached by the Azure Resource Manager, such as Azure Storage; so we show how Azure Storage can be used to stage the ARM template files.  We will also show some recommended practices around keeping secrets protected using Azure Key Vault.

The scenario we  walk through here's to deploy VNet with a Network Security Group (NSG) structured as linked templates.  We use VSTS to show how continuous deployment can be set up to enable teams to continuously update Azure with new changes each time there's a modification to the template.

## Create an Azure Storage account

1. Sign in to the Azure portal and create an Azure Storage account following the steps documented [here](../storage/common/storage-account-create.md?tabs=azure-portal).
1. Once deployment is complete, navigate to the storage account and select **Shared access signature**.  Select Service, Container, and Object for the **Allowed resource types**.  Then select **Generate SAS and connection string**. Copy the SAS token and keep it available since we use it later.

   :::image type="content" source="media\deploy-linked-arm-templates-with-vsts\storage-account-generate-sas-token.png" alt-text="Shows an Azure Storage Account in the Azure portal with Shared access signature selected." lightbox="media\deploy-linked-arm-templates-with-vsts\storage-account-generate-sas-token.png":::

1. Select the storage account Containers page and create a new Container.
1. Select the new Container properties. 
   
   :::image type="content" source="media\deploy-linked-arm-templates-with-vsts\container-properties.png" alt-text="Shows an Azure Storage Account in the Azure portal with Containers selected.  There's a container with its Container properties menu selected.":::

1. Copy the URL field and keep it handy.  We need it later along with the SAS token from the earlier step.

## Protect secrets with Azure Key Vault

1. In the Azure portal, create an Azure Key Vault resource.
1. Select the Azure Key Vault you created in the earlier step and then select Secrets.
1. Select Generate/Import to add the SAS Token.
1. For the Name property, enter `StorageSASToken` and then provide the Azure Storage shared access signature key you copied in a previous step for the Value.
1. Select Create.

## Link Azure Key Vault to VSTS

1. Sign in to your Azure DevOps organization and navigate to your project.
1. Go to **Library** under **Pipelines** in the navigation pane.

   :::image type="content" source="media\deploy-linked-arm-templates-with-vsts\vsts-libraries.png" alt-text="Shows the navigation pane in VSTS with Pipelines selected and the Library option highlighted.":::

1. Under **Variable group**, create a new group and for **Variable group name** enter `AzureKeyVaultSecrets`.
1. Toggle **Link secrets from an Azure key vault as variables**.
1. Select your Azure subscription and then the Azure Key Vault you created earlier, and then select Authorize.
1. Once authorization is successful, you can add variables by clicking **Add** and are presented with the option to add references to the secrets in the Azure Key Vault. Add a reference to the `StorageSASToken` created in the earlier step, and save it.

## Setup continuous deployment using VSTS

1. Follow steps listed in the article [Automate continuous integration using Azure Pipelines releases](continuous-integration-delivery-automate-azure-pipelines.md#set-up-an-azure-pipelines-release).
1. A few changes are required from the above steps in order to use a linked ARM template deployment: 
   - Under the release, link the variable group created earlier:
   
     :::image type="content" source="media\deploy-linked-arm-templates-with-vsts\link-variable-group.png" alt-text="Shows the pipeline Variables tab highlighting the Link variable group button.":::

   - Linked ARM template:
      - For Template, point to ArmTemplate_master.json instead of ArmTemplateForFactory.json
      - For Template Parameters, point to 'ArmTemplateParameters_master.json' instead of 'ArmTemplateParametersForFactory.json'
   - Under override Template parameters update two more parameters
      - **containerUri** - Paste the URL of container created in the earlier step.
      - **containerSasToken** - If the secret's name is 'StorageSASToken', enter '$(StorageSASToken)' for this value.

1. Save the release pipeline and trigger a release.

## Next steps
- [Automate continuous integration using Azure Pipelines releases](continuous-integration-delivery-automate-azure-pipelines.md)
