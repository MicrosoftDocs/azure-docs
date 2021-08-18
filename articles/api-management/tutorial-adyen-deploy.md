---
title: 'Tutorial: Deploy API Management monetization with Adyen' 
description: Deploy a sample Adyen project to Azure API Management. 
author: v-hhunter
ms.author: v-hhunter
ms.date: 08/20/2021
ms.topic: tutorial
ms.service: api-management
---

# Tutorial: Deploy API Management monetization with Adyen

In this tutorial, you'll deploy the demo Adyen account and learn how to:

> [!div class="checklist"]
> * Set up an Adyen account, the required PowerShell and `az cli` tools, an Azure subscription, and a service principal on Azure. 
> * Deploy the Azure resources using either Azure portal or PowerShell.
> * Make your deployment visible to consumers by publishing the Azure developer portal.

## Pre-requisites

For this sample project, you'll need to:

> [!div class="checklist"]
> * Create an Adyen test account. 
> * Install and set up the required PowerShell and Azure CLI tools.
> * Set up an Azure subscription.
> * Set up a service principal in Azure.

### [Create an Adyen test account](https://www.adyen.com/signup)

1. Set up a merchant **Ecommerce** account.
1. On the **Account** tab at the top of the Adyen test homepage, select the **Web Service** username.
1. Add the origin you will be using to the list of allowed origins.
1. Retrieve the API key and client key.

### Install and set up the required tools

- Version 7.1 or later of [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.1).
- Version 2.21.0 or later of [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).

### Set up an Azure subscription with admin access

For this sample project, you will need admin access in order to deploy all the included artifacts to Azure. If you do not have an Azure subscription, set up a [free trial](https://azure.microsoft.com/).

### Set up a service principal on Azure

For the solution to work, the Web App component needs a privileged credential on your Azure subscription with the scope to execute `read` operations on API Management (get products, subscriptions, etc.). 

Before deploying the resources, set up the service principal in the Azure Active Directory (AAD) tenant used by the Web App to update the status of API Management subscriptions. 

The simplest method is using the Azure command-line interface (CLI).

1. [Sign in with Azure CLI](../cli/azure/authenticate-azure-cli.md#sign-in-interactively):

    ```azurecli-interactive
    az login
    ```
2. [Create an Azure service principal with the Azure CLI](../cli/azure/create-an-azure-service-principal-azure-cli.md#password-based-authentication):

    ```azurecli-interactive
    az ad sp create-for-rbac --name ServicePrincipalName
    ```

3. Take note of the `appId` (client ID) and `password` (client secret), as you will need to pass these values as deployment parameters.

4. Retrieve the object ID of your new service principal for deployment:

    ```azurecli-interactive
    az ad sp show --id "http://<name-for-your-service-principal>"
    ```

The correct role assignments for the service principal will be assigned as part of the deployment.

## Deploy the Azure monetization resources

You can deploy the monetization resource via either Azure portal or PowerShell script. 

>[!NOTE]
> For both options, when filling in parameters, leave the `stripe*` parameters blank.

### Azure portal

Click the button below to deploy the example to Azure and fill in the required parameters in the Azure portal.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%microsoft%2Fazure-api-management-monetization%2Fmain%2Ftemplates%2main.json)

### PowerShell script

You can deploy by running the `deploy.ps1` PowerShell script at the root of the repo.

1. Provide a parameters file for the `main.json` ARM template. 
    * Find a template for the parameters file provider in `output/main.parameters.template.json`. 
    * Rename this JSON file to `output/main.parameters.json` and update the values as necessary.

2. Execute the `deploy.ps1` script:

    ```powershell
    deploy.ps1 `
    -TenantId "<azure-ad-tenant-id>" `
    -SubscriptionId "<azure-subscription-id>" `
    -ResourceGroupName "apimmonetization" `
    -ResourceGroupLocation "uksouth" `
    -ArtifactStorageAccountName "<name-of-artifact-storage-account>"
    ```

## Publishing the API Management developer portal

This example project uses the hosted [API Management developer portal](api-management-howto-developer-portal-customize.md). 

You are required to complete a manual step to publish and make the resources visible to customers. See the [Publish the portal](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-developer-portal-customize#publish) for instructions.

## Next Steps
* Learn more about [deploying API Management monetization with Adyen](adyen-details.md).
* Learn about the [Stripe deployment](stripe-details.md) option.