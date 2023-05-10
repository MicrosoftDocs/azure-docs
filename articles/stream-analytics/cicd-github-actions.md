---
title: Integrating with GitHub Actions
description: This article gives an instruction on how to create a workflow using GitHub Actions to deploy a Stream Analytics job. 
services: stream-analytics
author: alexlzx
ms.author: zhenxilin
ms.service: stream-analytics
ms.topic: how-to
ms.date: 05/09/2023
---

# Integrating with GitHub Actions

GitHub Actions is a feature on GitHub that helps you automate your software development workflows. If your source code is stored in GitHub repository, you can create a custom workflow in GitHub Actions to build, test, package, release, or deploy any code project. 

In this article, you will learn to use [GitHub Actions](https://docs.github.com/actions) to create a CI/CD workflow and deploy a Stream Analytic job to Azure. So next time you make changes to your GitHub repository, it will automatically trigger the workflow and deploy your Stream Analytics project to Azure.  

## Prerequisites

Follow the steps to create a CI/CD pipeline for your Stream Analytics project: 
* [Quickstart: Create a Stream Analytics job using VSCode](./quick-create-visual-studio-code.md) 
* [Export an existing job](visual-studio-code-explore-jobs.md#export-a-job-to-a-local-project)



Before you begin, you must meet the following prerequisites: 
* An Azure account with active subscription. 
* A GitHub account to configure GitHub repositories, create workflows, and configure GitHub secrets. 
* Run `az` command in PowerShell. Follow [this guide](https://learn.microsoft.com/cli/azure/install-azure-cli-windows) to install or update the Azure Command-Line Interface (CLI) on your local machine.  


## Create a workflow in GitHub Action

There are three main steps required to create a workflow in GitHub Action. Follow the steps to push your source code to GitHub repo, set up GitHub secrets and create a workflow:  

### Step 1: Push Stream Analytics project to GitHub 

We’ll be using the Azure Stream Analytics extension for Visual Studio Code (VSCode) to manage your Stream Analytics project. Follow [this guide](https://learn.microsoft.com/azure/stream-analytics/quick-create-visual-studio-code) if you haven’t installed.  
1. Go to the query editor in the Azure portal and select “Open in VS Code”. 
2. Once it’s done, you should see your Stream Analytics project in the VSCode workspace. 
3. Open the Terminal in VSCode, push the project to your GitHub repository. 


### Step 2: Set up secrets in GitHub 

You need to create GitHub secrets for deploying to Azure. If your Stream Analytics job has an Event Hub input and an Blobstorage output, you need to set up three secrets for Azure credentials, Event Hub, and Blobstorage respectively.  

1. Go to your GitHub repo and select the **Settings** tab.  
2. Click on **Secrets and variables > Actions** from the leftside menu and select **New repository secret** to create a new secret. 
3. Create a secret for **Azure credential**. Open the PowerShell in your local machine and run the following command. Then copy the output JSON to secret value.  
    1. PowerShell command: replace {subscription-id} and {resource-group} with your Azure resource. Make sure you installed the latest version of Azure CLI. 
    
        ```powershell
        az login 
        az ad sp create-for-rbac --name "myApp" --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} --sdk-auth 
        ```

    1. Secret name: AZURE_CREDENTIALS 
    1. Secret value: copy the output JSON to here.  
    
    To learn more about using the Azure login action with a service principal secret, see Connect GitHub and Azure | Microsoft Learn. 
1. Create a secret for Input. If you have more than one input for your Stream Analytic job, you need to create a secret for each input respectively. 
    1. Secret name: ASA_INPUT.
    1. Secret value: copy the resource policy key here. You can find it in the Azure portal.  
1. Create a secret for Output. If you have more than one output for your Stream Analytic job, you need to create a secret for each output respectively. 
    1. Secret name: ASA_OUTPUT 
    1. Secret value: copy the resource policy key here. 

Once you’ve done, you should see three secrets created for your GitHub repository.


### Step 3: Create a YAML file in GitHub Actions 



## Next steps

* [Automate builds, tests and deployments of an Azure Stream Analytics job using CI/CD tools](cicd-tools.md)
* [Set up a CI/CD pipeline for Stream Analytics job using Azure Pipelines](set-up-cicd-pipeline.md)
