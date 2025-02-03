---
title: Use service principals to automate workflows in firmware analysis
description: Learn about how to use service principals to automate workflows for firmware analysis.
author: karengu0
ms.author: karenguo
ms.topic: conceptual
ms.date: 11/04/2024
ms.service: azure
---

# How to Use Service Principals to Automate Workflows in firmware analysis

Many users of the firmware analysis service may need to automate their workflow. The command `az login` creates an interactive login experience with two-factor authentication that makes it difficult for users to fully automate their workflow. A [service principal](/entra/identity-platform/app-objects-and-service-principals) is a secure identity with proper permissions that authenticates to Azure in the command line without requiring two-factor authentication or an interactive log-in. This article explains how to create a service principal and use it to interact with the firmware analysis service. For more information on creating service principals, visit [Create Azure service principals using the Azure CLI](/cli/azure/azure-cli-sp-tutorial-1#create-a-service-principal). To authenticate securely, we recommend creating a service principal and authenticating using certificates. To learn more, visit [Create a service principal containing a certificate using Azure CLI](/cli/azure/azure-cli-sp-tutorial-3).

1. Log in to your Azure account using the Azure portal.

2. Navigate to your subscription and assign yourself `User Access Administrator` or `Role Based Access Control Administrator` permissions, or higher, in your subscription. This gives you permission to create a service principal.

3.	Navigate to your command line

    1. Log in, specifying your tenant ID during login

        ```azurecli
        az login --tenant <TENANT_ID>
        ```

    3. Switch to your subscription where you have proper permissions to create a service principal
        
        ```azurecli
        az account set --subscription <SUBSCRIPTION_ID>
        ```

    5. Create service principal, assigning it the proper permissions at the proper scope. We recommend assigning your service principal the Firmware Analysis Admin role at the Subscription level.

        ```azurecli
        az ad sp create-for-rbac --name <SERVICE_PRINCIPAL_NAME> --role "Firmware Analysis Admin" --scopes /subscriptions/<SUBSCRIPTION_ID>
        ```

4.	Note down your service principal’s client ID (“`appId`”), tenant ID (“`tenant`”), and secret (“`password`”) in a safe place. You’ll need this for the next step.

5.	Log in to your service principal

    ```azurecli
    az login --service-principal --username <CLIENT_ID> --password <SECRET> --tenant <TENANT_ID>
    ```

6.	Once logged in, refer to the following Quickstarts for scripts to interact with the firmware analysis service via Azure PowerShell, Azure CLI, or Python:
    - [Upload firmware using Azure CLI](quickstart-upload-firmware-using-azure-command-line-interface.md)
    - [Upload firmware using Azure PowerShell](quickstart-upload-firmware-using-powershell.md)
    - [Upload firmware using Python](quickstart-upload-firmware-using-python.md)
 

#test
test
test
