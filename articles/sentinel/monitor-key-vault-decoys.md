---
title: Plant and monitor Azure Key Vault decoys with Microsoft Sentinel | Microsoft Docs
description: Plant Azure Key Vault decoy keys and secrets and monitor them with Microsoft Sentinel
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/03/2021
ms.author: bagol

---

# Plant and monitor Azure Key Vault decoys with Microsoft Sentinel

This article describes how to use the [Microsoft Sentinel Deception solution](sentinel-solutions-catalog.md#microsoft) to plant decoy [Azure Key Vault](/azure/key-vault/) keys and secrets, called *HoneyTokens*, and then use [analytics rules](detect-threats-built-in.md), [watchlists](watchlists.md), and [workbooks](monitor-your-data.md) to monitor access to those decoys.

## Prerequisites

In order to start using the Microsoft Sentinel Deception solution, make sure that you have required Microsoft Sentinel data connectors deployed and have an Azure Active Directory application configured as needed.

### Deploy required data connectors

Before deploying the Microsoft Sentinel Deception solution, make sure that you've deployed the [Azure Key Vault](data-connectors-reference.md#azure-key-vault) and the [Azure Activity](data-connectors-reference.md#azure-activity) data connectors in your workspace, and that they're connected.

Also make sure that data routing succeeded and that the **KeyVault** and **AzureActivity** data is flowing into Microsoft Sentinel.

For more information, see [Connect Azure Sentinel to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md?tabs=AP#diagnostic-settings-based-connections) and [Find your Azure Sentinel data connector](data-connectors-reference.md).

### Create and configure an Azure Active Directory application

This procedure describes how to use an Azure CLI script to create and configure an Azure Active Directory application for use with your Microsoft Sentinel Deception solution.

1. Open a cloud shell editor, and paste the following code, modifying the `appName` value to supply a unique name for your application.

    <!--need to replace resource IDs and PID-->

    ```azurecli
    #!/bin/bash

    # Modify for your environment.
    appName=<name-your-app>

    funcName=$appName
    funcUrl=https://$funcName.azurewebsites.net

    # uncomment the following if you receive a Graph API error
    #tenantId=<your-tenant-id>
    #az login --tenant $tenantId

    # register a new AAD app, and configure it
    appId=$(az ad app create --display-name $appName --available-to-other-tenants false --homepage $funcUrl --query appId | sed 's/.\(.*\)/\1/' | sed 's/\(.*\)./\1/')
    secret=$(az ad app credential reset --id $appId --append --query password | sed 's/.\(.*\)/\1/' | sed 's/\(.*\)./\1/')
    objId=$(az ad app show --id $appId --query objectId | sed 's/.\(.*\)/\1/' | sed 's/\(.*\)./\1/')
    az rest --method PATCH --uri "https://graph.microsoft.com/v1.0/applications/$objId" --headers 'Content-Type=application/json' --body "{\"web\":{\"redirectUris\":[\"$funcUrl/.auth/login/aad/callback\"]}}"
    az rest --method PATCH --uri "https://graph.microsoft.com/v1.0/applications/$objId" --headers 'Content-Type=application/json' --body '{"requiredResourceAccess":[{"resourceAppId": "cfa8b339-82a2-471a-a3c9-0fc0be7a4093","resourceAccess": [{"id": "f53da476-18e3-4152-8e01-aec403e6edc0","type": "Scope"}]},{"resourceAppId": "00000003-0000-0000-c000-000000000000","resourceAccess": [{"id":"7427e0e9-2fba-42fe-b0c0-848c9e6a8182","type": "Scope"},{"id": "e1fe6dd8-ba31-4d61-89e7-88639da4683d","type":"Scope"},{"id": "06da0dbc-49e2-44d2-8312-53f166ab848a","type":"Scope"},{"id":"37f7f235-527c-4136-accd-4a02d197296e","type": "Scope"},{"id": "64a6cdd6-aab1-4aaf-94b8-3cc8405e90d0","type":"Scope"},{"id": "14dad69e-099b-42c9-810b-d002981feec1","type": "Scope"}]}]}'

    echo "function app name: $funcName"
    echo "AAD App Id: $appId"
    echo "AAD App secret: $secret"
    ```


1. Save the pasted code with a name, such as **MyApp.sh**.

1. Grant `execute` permissions by running the following command, replacing the script name as needed:

    ```azurecli
    chmod +x ./myapp.sh
    ```

1. Run the saved script, and save the output to use when deploying the Microsoft Sentinel Deception solution.

    Replace the script name as needed.

    ```azurecli
    ./myapp.sh
    ```

1. In Azure Active Directory, find and select your new app under **App registrations > All applications**.

1. Select **API permissions** > **Grant Admin consent**

    Your app now has the following delegated permissions, required to create HoneyTokens in your Azure Key Vaults.

    - **Azure Key Vault**: user_impersonation

    - **Microsoft Graph**:

        - Directory.Read.All
        - email
        - offline_access
        - openid
        - profile
        - User.Read

Your Azure Active Directory application is now ready for the Microsoft Sentinel Deception solution.

## Deploy and test the Microsoft Sentinel Deception solution

1. Deploy the **Microsoft Sentinel Deception** solution in the same resource group where you Microsoft Sentinel workspace is located.

    For more information, see [Discover and deploy Azure Sentinel solutions (Public preview)](sentinel-solutions-deploy.md).

1. Go to **Workbooks > My Workbooks** and open the **SOCHTManagement** workbook.

1. Select **Add to trusted**. HoneyTokens, including both decoy keys and secrets, are created in your connected key vaults.

1. In the workbook's **Key Vault** tab, view the key vaults with HoneyTokens deployed, listed in green. Key vaults that don't yet have HoneyTokens deployed are listed in red.

    - **To deploy HoneyTokens to a specific key vault manually**, select the key vault and follow the instructions at the bottom of the workbook.

    - **To deploy HoneyTokens to all key vaults in your subscription**, you may need to add your user to the Key Vault policy.

        Then, run the Azure Function to deploy HoneyTokens to all key vaults. When you're done, make sure to remove your user from the policy as needed.

        You may need to wait a few minutes as the data is populated. Refresh the page to show the additional Key Vaults that now have decoys deployed.



1. Go to the **Microsoft Sentinel Watchlists** page. On the **My watchlists** tab, select then **HoneyTokens** watchlist.

    The HoneyTokens watchlist lists all HoneyTokens deployed in your key vaults, being watched and monitored by Microsoft Sentinel analytics rules.

1. Go to the **Microsoft Sentinel Analytics** page. On the **Active rules** tab, filter for `<HoneyTokens>` to view all related analytics rules that will detect any suspicious HoneyToken access.

1. 
    
Alternatively, you can check the HoneyTokens watchlist in your Sentinel environment to see the honeytkens listed

## Distribute the SOCHTManagement workbook to KeyVaults owners

The link to the Management workbook should be distributed to other subscriptions in the same tenant, to deploy honeytokens in their KeyVault resources.

One option to do this, is through a custom ASC recommendation. For this, please follow the following steps:

1. Deploy the following Azure policies for each subscription:
Deploy to Azure

(You'll have to provide the link to the HoneyTokens management workbook: open the management workbook, click the "Share Report" button and copy the link)

This creates 2 policies and one initiative in your management group under the 'Deception' category: deceptionPoliciesSnapshot

2. Assign the KVReviewTag policy to the wanted scope.
This will add a tag called 'KVReview' with a value 'ReviewNeeded' to all the KeyVaults in the selected scope.

Make sure to check the remediation checkbox, to apply to existing KeyVaults.

3. In Azure Security Center
Select 'Regulatory compliance' on the left menu
Click 'Manage Compliance Policies' at the top
Select the wanted scope
Click 'Add custom initiative' at the bottom
Click 'Add' on the 'HoneyTokens' initiative

After some time an audit recommendation with link to the management workbook should appear for all the KeyVaults in the scope

