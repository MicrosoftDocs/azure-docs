---
title: Plant and monitor Azure Key Vault honeytokens with Azure Sentinel | Microsoft Docs
description: Plant Azure Key Vault honeytoken keys and secrets, and monitor them with Azure Sentinel.
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

# Plant and monitor Azure Key Vault honeytokens with Azure Sentinel

This article describes how to use the [Azure Sentinel Deception (Honey Tokens) ~~S~~olution](azure-sentinel) to plant decoy [Azure Key Vault](/azure/key-vault/) keys and secrets, called *honeytokens*.

Then, use the [analytics rules](detect-threats-built-in.md), [watchlists](watchlists.md), and [workbooks](monitor-your-data.md) provided by the **Azure Sentinel Deception (Honey Tokens)** solution to monitor access to the planted honeytokens.

## Prerequisites

In order to start using the **Azure Sentinel Deception (Honey Tokens)** solution, make sure that you have the required Azure Sentinel data connectors deployed and have an Azure Active Directory application configured as needed.

**To verify and complete the prerequisites**:

1. Make sure that you've deployed the [Azure Key Vault](data-connectors-reference.md#azure-key-vault) and the [Azure Activity](data-connectors-reference.md#azure-activity) data connectors in your workspace, and that they're connected.

    Verify that data routing succeeded and that the **KeyVault** and **AzureActivity** data is flowing into Azure Sentinel. For more information, see:

    - [Connect Azure Sentinel to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md?tabs=AP#diagnostic-settings-based-connections)
    - [Find your Azure Sentinel data connector](data-connectors-reference.md)

1. Install the **Azure Sentinel Deception (Honey Tokens)** solution. In the **Create Azure Sentinel Deception (Honey Tokens) Solution** page, follow the wizard instructions to create the solution in your workspace:

    1. On the **Basics** tab, select the same resource group where your Azure Sentinel workspace is located.

    1. On the **Prerequisites** tab, in the **Function app name** field, enter a meaningful name for the Azure Function App that will create honeytokens in your key vaults.

        The command displayed below is automatically updated with the name you define. For example, if you've named your Function App `honeytokens`, the command is updated to read:

        ```bash
        curl -sL https://aka.ms/sentinelhoneytokensappcreate | bash -s honeytokens
        ```

    1. Select **To open a cloud shell, click here**, and then run the command displayed.

        The script creates an Azure AD app, and outputs the client ID and secret. Copy these values to a secure location to use on the **Azure Functions** tab.

    1. On the **Workbooks**, **Analytics**, **Watchlists**, and **Playbooks** tabs, note the security content that will be created, and modify the names as needed.

    1. On the **Azure Functions** tab, define values for your Function App, using the client ID and secret value you saved after running the cloud shell script earlier.

        In the **Keys Keywords** and **Secrets Keywords** fields, enter comma-separated lists of values, which will be used to generate honeytoken names.

        In the **Additional HoneyToken Probability** field, enter a value between `0` and `1`, such as `0.6`. This value defines the probability of more than one honeytoken being added to the Key Vault.

    1. In the **Policy Definitions** tab, TBD.

    For more information, see [Discover and deploy built-in content and solutions](sentinel-solutions-deploy.md).


## Deploy your honeytokens

After you've installed the **Azure Sentinel Deception (Honey Tokens)** solution and run the Azure CloudShell script to configure your Azure AD application, you're ready to start deploying honeytokens in your key vaults.

**Use the SOCHTManagement workbook to deploy honeytokens**:

1. In Azure Sentinel, go to **Workbooks > My Workbooks** and open the **SOCHTManagement** workbook.

2. Select **Add to trusted**. HoneyTokens, including both decoy keys and secrets, are created in your connected key vaults.

3. In the workbook's **Key Vault** tab, view the key vaults with HoneyTokens deployed, listed in green. Key vaults that don't yet have HoneyTokens deployed are listed in red.

    - **To deploy HoneyTokens to a specific key vault manually**, select the key vault and follow the instructions at the bottom of the workbook.

    - **To deploy HoneyTokens to all key vaults in your subscription**, you may need to add first your user to the Key Vault policy.

        Then, select **deploy to all** to deploy honeytokens to all connected key vaults using an Azure Function App. When you're done, make sure to remove your user from the policy as needed.

        You may need to wait a few minutes as the data is populated. Refresh the page to show the additional Key Vaults that now have honeytokens deployed.

## Test the solution functionality

**To test that you get alerted for any access attempted to your honey tokens**:

1. Download the public key for one of your honeytokens.

    To do this, go to Azure Key Vault, select one of your honeytokens and then select **Download public key**. This action creates a KeyGet log that should trigger a watchlist item in Azure Sentinel.

1. Back in Azure Sentinel, on the **Watchlists** page, select the **My watchlists** tab, select then **HoneyTokens** watchlist.

    In the HoneyTokens column, you should see the honeytoken key name of public key you downloaded.

1. Go to the **Azure Sentinel Analytics** page. On the **Active rules** tab, filter for `HoneyTokens` to view all related analytics rules that will detect any suspicious honeytoken access. For example, these will be called **HoneyTokens: KeyVault HoneyTokens key accessed**.

1. Go to the **Incidents** page, where you should see a new incident, named **HoneyTokens: KeyVault HoneyTokens key accessed**.

    Select the incident to view its details, such as the key operation performed, the user who access the honeytoken key, and the name of the compromised key vault.

    > [!TIP]
    > Any access or operation with the honeytoken keys and secrets will generate incidents that you can investigate in Azure Sentinel. Since there's no reason to actually use honeytoken keys and secrets, any similar activity in your workspace may be malicious and should be investigated.
    >

1. View honeytoken activity in the **HoneyTokensIncident** workbook. In the Azure Sentinel **Workbooks** page search for and open the **HoneyTokensIncident** workbook.

    This workbook displays all honeytoken-related incidents, the related entities, compromised key vaults, key operations performed, and accessed HoneyTokens.

    Select specific incidents and operations to investigate all related activity further.

## Distribute the SOCHTManagement workbook

We recommend you distribute the **SOCHTManagement** workbook to Key Vault owners in your tenant, so that admins can deploy honeytokens in their key vaults as well.

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
