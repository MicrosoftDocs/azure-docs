---
title: Integrating with GitHub Actions
description: This article gives an instruction on how to create a workflow using GitHub Actions to deploy a Stream Analytics job. 
services: stream-analytics
author: alexlzx
ms.author: zhenxilin
ms.service: stream-analytics
ms.custom: build-2023
ms.topic: how-to
ms.date: 05/09/2023
---

# Integrating with GitHub Actions

GitHub Actions is a feature on GitHub that helps you automate your software development workflows. If your source code is stored in GitHub repository, you can create a custom workflow in GitHub Actions to build, test, package, release, or deploy any code project. 

In this article, you learn to use [GitHub Actions](https://docs.github.com/actions) to create a CI/CD workflow and deploy a Stream Analytic job to Azure. So next time you make changes to your GitHub repository, it will automatically trigger the workflow and deploy your Stream Analytics project to Azure.  

## Prerequisites

Before you begin, you must meet the following prerequisites: 
* An Azure account with active subscription. 
* A GitHub account to configure GitHub repositories, create workflows, and configure GitHub secrets. 
* Run `az` command in PowerShell. Follow [this guide](/cli/azure/install-azure-cli-windows) to install or update the Azure Command-Line Interface (CLI) on your local machine.  

## Step 1: Push the Stream Analytics project to GitHub repository 

We're using the Azure Stream Analytics extension for Visual Studio Code (VS Code) to manage your Stream Analytics project. Follow [this guide](quick-create-visual-studio-code.md) if you haven’t installed.  
1. Go to the query editor in the Azure portal and select **Open in VS Code**. 

    :::image type="content" source="./media/cicd-github-actions/open-in-vscode.png" alt-text="Screenshot of the Azure portal using open in VS Code feature in the query file." lightbox= "./media/cicd-github-actions/open-in-vscode.png" :::

2. Once it’s done, you should see your Stream Analytics project in the VS Code workspace. 
    
    :::image type="content" source="./media/cicd-github-actions/vscode-workspace.png" alt-text="Screenshot of the VS Code workspace after export job." lightbox= "./media/cicd-github-actions/vscode-workspace.png" :::

3. Press **Ctrl+J** to open the Terminal in VS Code. Enter git command to push the project to your GitHub repository. 

    :::image type="content" source="./media/cicd-github-actions/vscode-terminal.png" alt-text="Screenshot of the VS Code terminal." lightbox= "./media/cicd-github-actions/vscode-terminal.png" :::

## Step 2: Set up secrets in GitHub 

You need to create at least 3 GitHub secrets for deploying a Stream Analytics job. One secret for your Azure credential and others for your input/output Azure resources.  

1. Go to your GitHub repo and select the **Settings** tab. Select on **Secrets and variables > Actions** from the left side menu and select **New repository secret** to create a new secret. 
    :::image type="content" source="./media/cicd-github-actions/github-setup-secrets.png" alt-text="Screenshot of the GitHub setting up a secret for the repository." lightbox= "./media/cicd-github-actions/github-setup-secrets.png" :::

1. Create a secret for **Azure credential**. Open PowerShell and run the following command. Then copy the output JSON to secret value.  
    1. Replace {subscription-id} and {resource-group} with your Azure resource. Make sure you installed the latest version of Azure CLI. 
    
        ```powershell
        az login 
        az ad sp create-for-rbac --name "myApp" --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} --sdk-auth 
        ```

        :::image type="content" source="./media/cicd-github-actions/powershell-run-az.png" alt-text="Screenshot of the PowerShell running az command." lightbox= "./media/cicd-github-actions/powershell-run-az.png" :::

    2. Enter a secret name such as `AZURE_CREDENTIALS` and copy the output JSON to secret value. Then select **Add secret**.
    
        :::image type="content" source="./media/cicd-github-actions/azure-credential.png" alt-text="Screenshot of the GitHub creating a secret for Azure credential." lightbox= "./media/cicd-github-actions/azure-credential.png" :::
    
    3. To learn more about using the Azure login action with a service principal secret, see [here](/azure/developer/github/connect-from-azure?tabs=azure-portal%2Cwindows#use-the-azure-login-action-with-a-service-principal-secret).

3. Create secrets for Input and Output resources. For more than one input/output resources, you need to create secrets for each Azure resource respectively. 
    1. For example to create a secret for an event hub, go to the Event Hubs in Azure portal and copy the **Primary key** from Shared access policy. 

        :::image type="content" source="./media/cicd-github-actions/event-hub-key.png" alt-text="Screenshot of the event hub opening the access key." lightbox= "./media/cicd-github-actions/event-hub-key.png" :::
        
    2. Copy the access key to the secret value. 
        
        :::image type="content" source="./media/cicd-github-actions/input-key.png" alt-text="Screenshot shows the event hub opening the access key." lightbox= "./media/cicd-github-actions/input-key.png" :::

Once you’ve done, you should have at least three secrets created for the GitHub repository.

:::image type="content" source="./media/cicd-github-actions/three-secrets.png" alt-text="Screenshot of the GitHub finishing setup three secrets." lightbox= "./media/cicd-github-actions/three-secrets.png" :::

## Step 3: Create a workflow using GitHub Actions 

1. Go to **Actions** tab, select **New workflow** > **set up a workflow yourself**.  

    :::image type="content" source="./media/cicd-github-actions/create-workflow.png" alt-text="Screenshot of the GitHub creating a workflow." lightbox= "./media/cicd-github-actions/create-workflow.png" :::

2. Copy the [this template](https://aka.ms/asacicdyaml) to the YAML file and edit the parameters.
    1. PROJECT_NAME: your Stream Analytics job's name.
    1. OUTPUT_PATH: leave it as it is. 
    1. TARGET_RESOURCE_GROUP: your Azure resource group. 
    1. LOCATION: Azure region for deployment. The available regions can be found [here](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=stream-analytics&regions=all).
    1. OVERRIDE_PARAMETERS: credentials for Azure resource. To correctly parse the credential, the parameter has to be set as a key-value pair in the following format: 
        
        ```yml
        #               Inputs_ehinput_DataSource_SharedAccessPolicyKey
        #               \____/ \_____/ \________/ \__________________/
        #                  |      |                        |
        #          input/output  name                credential name
        ```
        
        For example, for an Event Hubs input and a Blob Storage output, the key should be: 

        ```yml
        Inputs_ClickStream_DataSource_SharedAccessPolicyKey=${{ secrets.ASA_INPUT }} Outputs_BlobOutput_DataSource_AccountKey=${{ secrets.ASA_OUTPUT }}

        ```

        Here's a mapping from the Azure resource type to its credential name:
        
        |  Resource types                                          |    Credential name     |
        |----------------------------------------------------------|------------------------|
        | Azure Event Hubs, Azure IoT Hub, Azure Service Bus        | SharedAccessPolicyKey  |
        | Azure Blob Storage, Azure Cosmos DB, Azure Table Storage | AccountKey             |
        | Azure Function                                           | ApiKey                 |
        | Azure SQL Database, Azure Synapse Analytics              | Password               |

3. **Save** and **commit** the changes to the main branch. Then go to Actions and select run workflow. You can monitor the progress of the workflow.  

    :::image type="content" source="./media/cicd-github-actions/run-workflow.png" alt-text="Screenshot of the GitHub running the workflow." lightbox= "./media/cicd-github-actions/run-workflow.png" :::

4. Once it’s done, you can find the Stream Analytics job started running in the Azure portal. The workflow in GitHub Actions will automatically trigger next time you push changes to the main branch.  

    :::image type="content" source="./media/cicd-github-actions/azure-portal.png" alt-text="Screenshot of the Azure portal showing the Stream Analytics job is in running status." lightbox= "./media/cicd-github-actions/azure-portal.png" :::


Congratulations! You have successfully created a workflow in GitHub and deployed your Stream Analytics project to Azure. With this workflow, your Stream Analytics project is able to automatically build, test, publish, and deploy to Azure whenever changes are pushed to the main branch of your GitHub repository.  
