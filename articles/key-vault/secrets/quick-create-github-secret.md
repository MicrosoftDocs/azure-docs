---
title: Quickstart -  Use Key Vault secrets in Github Actions workflows
description: 
author: juliakm
ms.custom: github-actions-azure
ms.author: jukullam
ms.date: 10/26/2020
ms.service: key-vault
ms.subservice: secrets
ms.topic: quickstart
---

# Use Key Vault secrets in Github Actions workflows

Use Key Vault secrets in your [GitHub Actions](https://help.github.com/en/articles/about-github-actions) and securely store passwords and other secrets in Azure Portal. Learn more about [Key Vault](../general/overview.md). 

With Key Vault and GitHub Actions, you have the benefits of a centralized secrets management tool and all the advantages of GitHub Actions. GitHub Actions is a suite of features in GitHub to automate your software development workflows. You can deploy workflows in the same place where you store code and collaborate on pull requests and issues. 

## Prerequisites 
- A GitHub account. If you don't have one, sign up for [free](https://github.com/join).  
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure App connected to a GitHub repository. This example uses [Deploy containers to Azure App Service](https://docs.microsoft.com/azure/developer/javascript/tutorial-vscode-docker-node-01). 

## Workflow file overview

A workflow is defined by a YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that make up the workflow.

The file has for authenticating with GitHub Actions three sections:

|Section  |Tasks  |
|---------|---------|
|**Authentication** | 1. Define a service principal. <br /> 2. Create a GitHub secret. |
|**Key Vault** | 1. Set up the environment. <br /> 2. Build the web app. |

## Authentication


Remember

Add role assignment for the rbac permission as a contributor role 


az keyvault set-policy -n nodekeyvaultdocs --secret-permissions get list --spn 2cc764f8-1141-4789-9d8f-09ccca4ecc81


- 
```yaml
name: Linux Container Node Workflow

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    # checkout the repo
    - uses: actions/checkout@v2
    - uses: Azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    - uses: Azure/get-keyvault-secrets@v1
      with: 
        keyvault: "nodekeyvaultdocs"
        secrets: 'containerPassword, containerUsername'
      id: myGetSecretAction
    - uses: azure/docker-login@v1
      with:
        login-server: msdocsregistry.azurecr.io
        username: ${{ steps.myGetSecretAction.outputs.containerUsername }}
        password: ${{ steps.myGetSecretAction.outputs.containerPassword }}
    - run: |
        docker build . -t msdocsregistry.azurecr.io/myexpressapp:${{ github.sha }}
        docker push msdocsregistry.azurecr.io/myexpressapp:${{ github.sha }}     
    - uses: azure/webapps-deploy@v2
      with:
        app-name: 'myexpressdocsapp'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        images: 'msdocsregistry.azurecr.io/myexpressapp:${{ github.sha }}'

```