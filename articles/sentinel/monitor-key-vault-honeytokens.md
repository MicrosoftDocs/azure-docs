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

# Deploy and monitor Azure Key Vault honeytokens with Azure Sentinel (Public preview)

> [!IMPORTANT]
> The Azure Sentinel Deception (Honey Tokens) solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

This article describes how to use the **Azure Sentinel Deception (Honey Tokens) Solution** to plant decoy [Azure Key Vault](/azure/key-vault/) keys and secrets, called *honeytokens*, into existing workloads.

Use the [analytics rules](detect-threats-built-in.md), [watchlists](watchlists.md), and [workbooks](monitor-your-data.md) provided by the solution to monitor access to the deployed honeytokens.

When using honeytokens in your system, detection principles remains the same. Because there is no legitimate reason to access a honeytoken, any activity will indicate the presence of a user who is not familiar with the environment, and could potentially be an attacker.

## Prerequisites

In order to start using the **Azure Sentinel Deception (Honey Tokens)** solution, make sure that you have:

- **Required roles**: You must be a tenant admin to install the **Azure Sentinel Deception (Honey Tokens)** solution. Once the solution is installed, you can share the workbook with key vault owners so that they can deploy their own honeytokens.

- **Required data connectors**: Make sure that you've deployed the [Azure Key Vault](data-connectors-reference.md#azure-key-vault) and the [Azure Activity](data-connectors-reference.md#azure-activity) data connectors in your workspace, and that they're connected.

    Verify that data routing succeeded and that the **KeyVault** and **AzureActivity** data is flowing into Azure Sentinel. For more information, see:

    - [Connect Azure Sentinel to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md?tabs=AP#diagnostic-settings-based-connections)
    - [Find your Azure Sentinel data connector](data-connectors-reference.md)

## Install the solution

Install the **Azure Sentinel Deception (Honey Tokens)** solution as you would other solutions. For more information, see [Centrally discover and deploy built-in content and solutions](sentinel-solutions-deploy.md).

The following steps describe specific actions required for the **Azure Sentinel Deception (Honey Tokens)** solution.

1. On the **Basics** tab, select the same resource group where your Azure Sentinel workspace is located.

1. On the **Prerequisites** tab, in the **Function app name** field, enter a meaningful name for the Azure function app that will create honeytokens in your key vaults.

    The function app name must be unique, between 2-22 characters in length, and alphanumeric characters only.

    The command displayed below is automatically updated with the name you define. For example, if you've named your function app `honeytokens`, the command is updated to read:

    ```bash
    curl -sL https://aka.ms/sentinelhoneytokensappcreate | bash -s honeytokens
    ```

1. Select **To open a cloud shell, click here** to open a Cloud Shell tab, and then run the command displayed.

    The script you run creates an Azure AD (AAD) function app, which will deploy your honeytokens. The script output includes the AAD app ID and secret.

1. Back in Azure Sentinel, at the bottom of **Prerequisites** tab, enter the AAD app ID and secret into the relevant fields.

1. Select **Click here** to grant admin consent to your new function app. A new browser tab opens in Azure AD application settings. Select **Grant admin consent for `<your function app name>`** to continue. For more information, see TBD.

1. Back in Azure Sentinel again, on the **Workbooks**, **Analytics**, **Watchlists**, and **Playbooks** tabs, note the security content that will be created, and modify the names as needed.

1. On the **Azure Functions** tab, define the following values:

    **Key vault configuration**: The following fields define values for the key vault where you'll store your AAD app's ID and secret. These fields do not *not* define the the key vault where you'll be deploying honeytokens.

    |Field  |Description  |
    |---------|---------|
    |**Service plan**     |   Select whether you want to use a **Premium** or **Consumption** plan for your function app. For more information, see TBD.      |
    |**Should a new KeyVault be created**     |    Select **new** to create a new key vault for your application client ID and secret, or **existing** to use an already existing key vault for these values.   |
    |**KeyVault name**     | Enter the name of the key vault you want to use to store your client ID and secret. This name must be globally unique.      |
    |**KeyVault resource group**     | Enter the name of the resource group where you want to store the key vault for the client ID and secret.      |
    |**KeyVault secret name**     |   Enter the name of the secret used to store the  client secret.      |

    **Honeytoken configuration**: The following fields define the keys and secrets used in your honeytokens. Use naming conventions that will blend in with your organization's naming requirements so that attackers will not be able to tell the difference.

    |Field  |Description  |
    |---------|---------|
    |**Keys keywords**     |  Enter comma-separated lists of values you want to use as your decoy honeytoken names.  For example, `key,prod,dev`.  Values must be alphanumeric only.   |
    |**Secrets**     |   Enter comma-separated lists of values you want to use as your decoy honeytoken secrets.  For example, `secret,secretProd,secretDev`. Values must be alphanumeric only.    |
    |**Additional HoneyToken Probability**     |  Enter a value between `0` and `1`, such as `0.6`. This value defines the probability of more than one honeytoken being added to the Key Vault.       |
    |     |         |

<!--policy definitions to be removed from solution installation - need to do this only after the solution is installed-->

1. Select **Next: Review + create** to finish installing your solution.

## Deploy your honeytokens

After you've installed the **Azure Sentinel Deception (Honey Tokens)** solution, you're ready to start deploying honeytokens in your key vaults using the steps in the **SOCHTManagement** workbook.

We recommend that you share the **SOCHTManagement** workbook with key vault owners in your organization so that they can create their own honeytokens in their key vaults.

**Deploy honeytokens in your key vaults**:

1. In Azure Sentinel, go to **Workbooks > My Workbooks** and open the **SOCHTManagement** workbook.

1. Select **View saved workbook** > **Add to trusted**. Infrastructure is deployed in your key vaults to allow for the honeytoken deployment.

1. In the workbook's **Key Vault** tab, view the key vaults ready to deploy honeytokens and any key vaults with honeytokens already deployed.

    In the **Is Monitored by SOC** column, a green checkmark :::image type="icon" source="media/honeytokens/checkmark.png" border="false"::: indicates that the key vault already has honeytokens. A red x-mark :::image type="icon" source="media/honeytokens/xmark.png" border="false"::: indicates that the key vault does not yet have honeytokens.

    Use the instructions in the workbook below, in the **Take an action** section to deploy honeytokens to all key vaults at scale, or deploy them manually, one at a time.

    # [Deploy at scale](#tab/deploy-at-scale)

    **To deploy honeytokens at scale**:

    1. Select the **Enable user** link to create an ARM template that deploys a key vault access policy, granting the user ID specified with rights to create the honeytokens.

    1. Select the **Click to deploy** link to add honeytokens to all key vaults that you have access to.

    1. When you're done, make sure to select the **Disable your user** link to remove the access policy that you'd just created.

    # [Deploy a single honeytoken](#tab/deploy-a-single-honeytoken)

    **To deploy a single honey token manually**:

    1. In the table at the top of the page, select the key vault where you want to deploy your honeytoken. The **Deploy on a specific key-vault:** appears at the bottom of the page.

    1. Scroll down, and in the **Honeytoken type** dropdown, select whether you want to create a key or a secret. In the **New honeytoken name** field, enter a meaningful name for your honeytoken.

    1. In the **Operation** table, expand the **Deploy a honeytoken** section, and select each task name to perform the required steps.

    1. When your honey is added successfully, when you select  **Click to add monitoring in the SOC (secret: myhoneytoken)**, you'll see the following confirmation message: `Honey-token was successfully added to monitored list`

    1. Make sure to select the **Disable back your user in the key-vault's policy if needed** link to remove the access policy created grant rights to create the honeytokens.

    # [Remove a honeytoken](#tab/remove-a-honeytoken)

    **To remove a specific honeytoken**:

    1. In the table at the top of the page, select the key vault where you want to remove a honeytoken. The **Deploy on a specific key-vault:** appears at the bottom of the page.

    1. In the **Operation** table, expand the **Remote a honeytoken** section, and select each task name to perform the required steps.

---

You may need to wait a few minutes as the data is populated. Refresh the page to show any new key vaults that now have honeytokens deployed.

If you need help, you can contact one of your SOC admins using the contact information shown at the bottom of the page.


## Test the solution functionality

**To test that you get alerted for any access attempted to your honey tokens**:

1. Download the public key for one of your honeytokens.

    To download the key, go to Azure Key Vault, select one of your honeytokens, and then select **Download public key**. This action creates a KeyGet log that should trigger a watchlist item in Azure Sentinel.

1. Back in Azure Sentinel, on the **Watchlists** page, select the **My watchlists** tab, and then select the **HoneyTokens** watchlist.

    In the HoneyTokens column, you should see the honeytoken key name of public key you downloaded.

1. Go to the **Azure Sentinel Analytics** page. On the **Active rules** tab, filter for `HoneyTokens` to view all related analytics rules that will detect any suspicious honeytoken access. For example, these rules will be called **HoneyTokens: KeyVault HoneyTokens key accessed**.

1. Go to the **Incidents** page, where you should see a new incident, named **HoneyTokens: KeyVault HoneyTokens key accessed**.

    Select the incident to view its details, such as the key operation performed, the user who accessed the honeytoken key, and the name of the compromised key vault.

    > [!TIP]
    > Any access or operation with the honeytoken keys and secrets will generate incidents that you can investigate in Azure Sentinel. Since there's no reason to actually use honeytoken keys and secrets, any similar activity in your workspace may be malicious and should be investigated.
    >

1. View honeytoken activity in the **HoneyTokensIncident** workbook. In the Azure Sentinel **Workbooks** page, search for and open the **HoneyTokensIncident** workbook.

    This workbook displays all honeytoken-related incidents, the related entities, compromised key vaults, key operations performed, and accessed HoneyTokens.

    Select specific incidents and operations to investigate all related activity further.

## Distribute the SOCHTManagement workbook

We recommend that you deploy honeytokens in as many key vaults as possible to ensure optimal detection abilities in your organization.

However, many SOC teams don't have access to key vaults. To help cover this gap, distribute the **SOCHTManagement** workbook to all key vault owners in your tenant, so that your SOC teams can deploy their own honeytokens.

1. Obtain the link to your **SOCHTManagement** workbook. In Azure Sentinel, navigate to the **Workbooks** > **My workbooks** > **SOCHTManagement** workbook, and select **Copy link** in the toolbar.

1. Share the workbook link with your SOC teams.

1. Have your SOC teams deploy the relevant policies to their Azure subscriptions:

    [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2faka.ms%2fsentinelhoneytokenspolicy)

1. In the **Project details** area, select your management group value and region, and then paste the shared link to your **SOCHTManagement** workbook. Select **Review + create** to create the Azure policy.

    In the Azure Policy **Definitions** page, you'll now see the following in your management group, under the **Deception** category:

    - A new initiative, named **HoneyTokens**
    - Two new policies, named **KeyVault HoneyTokens** and **KVReviewTag**.

1. Assign the **KVReviewTag** policy to the scope you need. This assignment adds the **KVReview** tag and a value of **ReviewNeeded** to all key vaults in the selected scope.

    Make sure to select the **Remediation** checkbox to apply the tag to existing key vaults.

### View audit recommendations in Microsoft Defender for Cloud

Microsoft Defender for Cloud customers can also add an audit recommendation for relevant key vaults.

In Microsoft Defender for Cloud:

1. Select **Regulatory compliance > Manage compliance policies**, and then select the scope your need.

1. Select **Add custom initiative**. In the **HoneyTokens** initiative, select **Add**.

An audit recommendation, with a link to the **SOCHTManagement** workbook, is added to all key vaults in the selected scope.

For more information, see the [Microsoft Defender for Cloud documentation](/azure/security-center/security-center-recommendations).



<!--this needs to be clarified w hani - can we do it either in policy or in defender? when would we want to use one or the other?-->


## Next steps

For more information, see:

- [About Azure Sentinel solutions](sentinel-solutions.md)
- [Discover and deploy Azure Sentinel solutions](sentinel-solutions-deploy.md)
- [Azure Sentinel solutions catalog](sentinel-solutions-catalog.md)
- [Detect threats out-of-the-box](detect-threats-built-in.md)
- [Commonly used Azure Sentinel workbooks](top-workbooks.md)
