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

## Deploy and test the Deception (HoneyTokens) solution

1. Deploy the **Microsoft Sentinel Deception** solution in the same resource group where you Microsoft Sentinel workspace is located.

    For more information, see [Discover and deploy Azure Sentinel solutions (Public preview)](sentinel-solutions-deploy.md).

1. Go to **Workbooks > My Workbooks** and open the **SOCHTManagement** workbook.

1. Select **Add to trusted**. HoneyTokens, including both decoy keys and secrets, are created in your connected key vaults.

1. In the workbook's **Key Vault** tab, view the key vaults with HoneyTokens deployed, listed in green. Key vaults that don't yet have HoneyTokens deployed are listed in red.

    - **To deploy HoneyTokens to a specific key vault manually**, select the key vault and follow the instructions at the bottom of the workbook.

    - **To deploy HoneyTokens to all key vaults in your subscription**, you may need to add your user to the Key Vault policy.

        Then, run the Azure Function to deploy HoneyTokens to all key vaults. When you're done, make sure to remove your user from the policy as needed.

        You may need to wait a few minutes as the data is populated. Refresh the page to show the additional Key Vaults that now have decoys deployed.

1. To test the solution functionality:

    1. Download the public key for one of your HoneyTokens. Go to Azure Key Vault and select one of your HoneyTokens and then select **Download public key**. This action creates a KeyGet log that should trigger a watchlist item in Azure Sentinel.

    1. Go back to Microsoft Sentinel. In the **Watchlists** page, select the **My watchlists** tab, select then **HoneyTokens** watchlist.

        In the HoneyTokens column, you should see the decoy key who's public key you downloaded listed.

    1. Go to the **Microsoft Sentinel Analytics** page. On the **Active rules** tab, filter for `<HoneyTokens>` to view all related analytics rules that will detect any suspicious HoneyToken access. For example, these will be called **`<HoneyTokens>` KeyVault HoneyTokens key accessed**.

        Then, go to the **Incidents** page, where you should see a new incident, named **`<HoneyTokens>` KeyVault HoneyTokens key accessed**.

    1. Select the incident to view its details, such as the key operation performed, the user who access the HoneyToken key, and the name of the compromised key vault.

    Any access or operation with the HoneyToken keys and secrets will generate incidents that you can investigate in Microsoft Sentinel. Since there's no reason to actually use HoneyToken keys and secrets, any similar activity in your workspace may be malicious and should be investigated.

1. View HoneyToken activity in the **HoneyTokensIncident** workbook. In the Microsoft Sentinel **Workbooks** page search for and open the **HoneyTokensIncident** workbook.

    This workbook displays all HoneyToken-related incidents, the related entities, compromised key vaults, key operations performed, and accessed HoneyTokens.

    Select specific incidents and operations to investigate all related activity further.

## Distribute the SOCHTManagement workbook

We recommend that your distribute the **SOCHTManagement** workbook to other subscriptions in your tenant, so that other admins can deploy HoneyTokens in their key vaults as well.

You may want to do this using a custom Microsoft Defender for Cloud recommendation. For example:

1. Deploy the following policies to your Azure subscription, providing the link to your SOCHTManagement workbook.

    To get the link, open the workbook, select **Share Report** and then copy the link. 

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
        "parameters": {
        "ManagementWorkbookLink": {
          "type": "string",
          "metadata": {
            "description": "The link to the honeytokens management workbook"
          }
        }
      },
      "resources": [
        {
          "type": "Microsoft.Authorization/policyDefinitions",
          "name": "KVReviewTag",
          "apiVersion": "2019-09-01",
          "properties": {
            "displayName": "KVReviewTag",
            "policyType": "Custom",
            "description": "Add a KVReview tag on all KVs in the scope",
            "metadata": {
              "category": "Deception"
            },
            "mode": "Indexed",
            "policyRule": {
              "if": {
                    "field": "type",
                    "equals": "Microsoft.KeyVault/vaults"
                  },
              "then": {
                "effect": "modify",
                "details": {
                  "roleDefinitionIds": [
                    "/providers/microsoft.authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
                  ],
                  "operations": [
                    {
                      "operation": "add",
                      "field": "tags[KVReview]",
                      "value": "ReviewNeeded"
                    }
                  ]
                }
              }
            }
          }
        },
        {
          "type": "Microsoft.Authorization/policyDefinitions",
          "name": "KeyVault HoneyTokens",
          "apiVersion": "2019-09-01",
          "properties": {
            "displayName": "KeyVault HoneyTokens",
            "policyType": "Custom",
            "mode": "All",
            "description": "Install honey-tokens in KeyVault resources",
            "metadata": {
              "securityCenter": {
                "RemediationDescription": "[concat('1.  <a href=\"',parameters('ManagementWorkbookLink'),'\">Click</a> to install honeytokens in Key Vaults<br>2.  Change the value of the KVReview tag on this KeyVault to Reviewed')]",
                "Severity": "Medium"
              },
              "category": "Deception"
            },
            "parameters": {},
            "policyRule": {
              "if": {
                "allOf": [
                  {
                    "field": "type",
                    "equals": "Microsoft.KeyVault/vaults"
                  },
                  {
                    "field": "tags[KVReview]",
                    "exists": "true"
                  },
                  {
                    "value": "tags[KVReview]",
                    "notEquals": "ReviewNeeded"
                  }
                ]
              },
              "then": {
                "effect": "audit"
              }
            }
          }
        },
        {
          "type": "Microsoft.Authorization/policySetDefinitions",
          "apiVersion": "2019-09-01",
          "name": "HoneyTokens",
          "dependsOn": [
            "[resourceId('Microsoft.Authorization/policyDefinitions', 'KeyVault HoneyTokens')]"
          ],
          "properties": {
            "displayName": "HoneyTokens",
            "description": "Deploy HoneyTokens into Azure resources",
            "policyType": "Custom",
            "metadata": {
              "category": "Deception"
            },
            "policyDefinitions": [
              {
                "policyDefinitionId": "[resourceId('Microsoft.Authorization/policyDefinitions', 'KeyVault HoneyTokens')]"
              }
            ]
          }
        }
      ]
    }
    ```

    In your Azure Policy **Definitions** page, you'll the following in your management group, under the **Deception** category:

    - A new initiative, named **HoneyTokens**
    - Two new policies, named **KeyVault HoneyTokens** and **KVReviewTag**.

1. Assign the **KVReviewTag** policy to the scope you need. This adds the **KVReview** tag and a value of **ReviewNeeded** to all key vaults in the selected scope.

    Make sure to select the **Remediation** checkbox to apply the tag to existing key vaults.

1. In Microsoft Defender for Cloud:

    1. Select **Regulatory compliance > Manage compliance policies**, and then select the scope your need.
    1. Select **Add custom initiative**. In the **HoneyTokens** initiative, select **Add**.

An audit recommendation, with a link to the **SOCHTManagement** workbook, is added to all key vaults in the selected scope.

For more information, see the [Microsoft Defender for Cloud documentation](/azure/security-center/security-center-recommendations).

## Next steps

For more information, see:

- [About Azure Sentinel solutions](sentinel-solutions.md)
- [Discover and deploy Azure Sentinel solutions](sentinel-solutions-deploy.md)
- [Azure Sentinel solutions catalog](sentinel-solutions-catalog.md)
- [Detect threats out-of-the-box](detect-threats-built-in.md)
- [Commonly used Azure Sentinel workbooks](top-workbooks.md)
