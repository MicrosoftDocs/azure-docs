---
title: Tutorial for using Azure App Configuration Key Vault references in a Python app | Microsoft Docs
description: In this tutorial, you learn how to use Azure App Configuration's Key Vault references from a Python app
services: azure-app-configuration
author: mrm9084
ms.service: azure-app-configuration
ms.devlang: python
ms.topic: tutorial
ms.date: 03/16/2026
ms.author: mametcal
ms.custom: devx-track-python, devx-track-azurecli
#Customer intent: I want to update my Python application to reference values stored in Key Vault through App Configuration.
---

# Tutorial: Use Key Vault references in a Python app

In this tutorial, you learn how to implement Key Vault references in a Python application using App Configuration. It builds on the web app introduced in the quickstart. Before you continue, complete [Create a Python app with App Configuration](./quickstart-python-provider.md) first.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an App Configuration key that references a value stored in Key Vault.
> * Access the value of this key from a Python application.

## Prerequisites

* Azure subscription - [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)
* Python 3.8 or later - for information on setting up Python on Windows, see the [Python on Windows documentation](/windows/python/)
* Finish the [Create a Python app with App Configuration](./quickstart-python-provider.md) quickstart.

## Create a key vault

1. Sign in to the [Azure portal](https://portal.azure.com), and then select **Create a resource**.

1. In the search box, enter **Key Vault**. In the result list, select **Key Vault**.

1. On the **Key Vault** page, select **Create**.

1. On the **Create a key vault** page, enter the following information:
   - For **Subscription**: Select a subscription.
   - For **Resource group**: Enter the name of an existing resource group or select **Create new** and enter a resource group name.
   - For **Key vault name**: Enter a unique name.
   - For **Region**: Select a location.

1. For the other options, use the default values.

1. Select **Review + create**.

1. After the system validates and displays your inputs, select **Create**.

At this point, your Azure account is the only one authorized to access this new vault.

## Add a secret to Key Vault

Add a secret to the vault to test Key Vault retrieval. The secret is called **Message**, and its value is "Hello from Key Vault."

1. On the Key Vault resource menu, select **Objects** > **Secrets**.

1. Select **Generate/Import**.

1. In the **Create a secret** dialog, enter the following values:
   - For **Upload options**: Enter **Manual**.
   - For **Name**: Enter **Message**.
   - For **Secret value**: Enter **Hello from Key Vault**.

1. For the other options, use the default values.

1. Select **Create**.

## Add a Key Vault reference to App Configuration

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and then select your App Configuration store.

1. Select **Configuration Explorer**.

1. Select **+ Create** > **Key vault reference**, and then specify the following values:
    * **Key**: Enter **TestApp:Settings:KeyVaultMessage**.
    * **Label**: Leave this value blank.
    * **Subscription**, **Resource group**, and **Key vault**: Enter the values corresponding to the key vault you created in the previous section.
    * **Secret**: Select the secret named **Message** that you created in the previous section.

## Grant your app access to Key Vault

Your application uses `DefaultAzureCredential` to authenticate to both App Configuration and Key Vault. This credential automatically works with managed identities in Azure, and with your developer credentials locally.

1. Grant your identity access to Key Vault. Assign the **Key Vault Secrets User** role to your user account or managed identity:

    ```azurecli
    az role assignment create --role "Key Vault Secrets User" --scope /subscriptions/<subscriptionId>/resourceGroups/<group-name>/providers/Microsoft.KeyVault/vaults/<your-unique-keyvault-name> --assignee <your-azure-ad-user-or-managed-identity>
    ```

1. Grant your identity access to App Configuration. Assign the **App Configuration Data Reader** role:

    ```azurecli
    az role assignment create --role "App Configuration Data Reader" --scope /subscriptions/<subscriptionId>/resourceGroups/<group-name>/providers/Microsoft.AppConfiguration/configurationStores/<your-app-configuration-store> --assignee <your-azure-ad-user-or-managed-identity>
    ```

## Update your code to use a Key Vault reference

1. Install the required packages by running the following command:

    ```console
    pip install azure-appconfiguration-provider azure-identity
    ```

1. Create an environment variable called **AZURE_APPCONFIG_ENDPOINT**. Set its value to the endpoint of your App Configuration store. You can find the endpoint on the **Overview** blade in the Azure portal.

    ### [Windows command prompt](#tab/cmd)

    ```cmd
    setx AZURE_APPCONFIG_ENDPOINT "endpoint-of-your-app-configuration-store"
    ```

    Restart the command prompt to allow the change to take effect.

    ### [PowerShell](#tab/powershell)

    ```powershell
    $Env:AZURE_APPCONFIG_ENDPOINT = "endpoint-of-your-app-configuration-store"
    ```

    ### [macOS or Linux](#tab/bash)

    ```bash
    export AZURE_APPCONFIG_ENDPOINT='endpoint-of-your-app-configuration-store'
    ```

    ---

1. Update your Python application file to load Key Vault references. Create or update a file called *app.py*:

    ```python
    from azure.appconfiguration.provider import load
    from azure.identity import DefaultAzureCredential
    import os

    endpoint = os.environ.get("AZURE_APPCONFIG_ENDPOINT")
    credential = DefaultAzureCredential()

    # Connect to Azure App Configuration and resolve Key Vault references.
    config = load(
        endpoint=endpoint,
        credential=credential,
        keyvault_credential=credential,
    )

    # Access configuration values, including resolved Key Vault references.
    print(config["TestApp:Settings:KeyVaultMessage"])
    ```

    The `keyvault_credential` parameter tells the provider to use the given credential when resolving Key Vault references. The same `DefaultAzureCredential` instance is used for both App Configuration and Key Vault authentication.

    > [!NOTE]
    > If your Key Vault references point to multiple key vaults that require different credentials, you can use the `keyvault_client_configs` parameter instead to provide per-vault credentials. For more information, see the [Python provider reference](./reference-python-provider.md).

1. Run the application:

    ```console
    python app.py
    ```

    You see the message that you entered in App Configuration. You also see the message that you entered in Key Vault, resolved through the Key Vault reference.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this tutorial, you created an App Configuration key that references a value stored in Key Vault. To learn more about the Python provider for Azure App Configuration, see the [Python provider reference documentation](./reference-python-provider.md).

> [!div class="nextstepaction"]
> [Python provider reference](./reference-python-provider.md)
