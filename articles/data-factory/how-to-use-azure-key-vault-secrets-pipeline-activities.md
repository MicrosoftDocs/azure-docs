---
title: Use Azure Key Vault secrets in pipeline activities 
description: Learn how to fetch stored credentials from Azure Key Vault and use them during data factory pipeline runs. 
author: nabhishek
ms.author: abnarain
ms.service: data-factory
ms.subservice: security
ms.topic: conceptual
ms.date: 07/20/2023
---

# Use Azure Key Vault secrets in pipeline activities

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

You can store credentials or secret values in an Azure Key Vault and use them during pipeline execution to pass to your activities.

## Prerequisites

This feature relies on the data factory managed identity.  Learn how it works from [Managed identity for Data Factory](./data-factory-service-identity.md) and make sure your data factory has one associated.

## Steps

1. Open the properties of your data factory and copy the Managed Identity Application ID value.

    :::image type="content" source="media/how-to-use-azure-key-vault-secrets-pipeline-activities/managedidentity.png" alt-text="Managed Identity Value":::

2. Open the key vault access policies and add the managed identity permissions to Get and List secrets.

    :::image type="content" source="media/how-to-use-azure-key-vault-secrets-pipeline-activities/akvaccesspolicies.png" alt-text="Screenshot that shows the &quot;Access policies&quot; page with the &quot;Add Access Policy&quot; action highlighted.":::

    :::image type="content" source="media/how-to-use-azure-key-vault-secrets-pipeline-activities/akvaccesspolicies-2.png" alt-text="Key Vault access policies":::

    Click **Add**, then click **Save**.

3. Navigate to your Key Vault secret and copy the Secret Identifier.

    :::image type="content" source="media/how-to-use-azure-key-vault-secrets-pipeline-activities/secretidentifier.png" alt-text="Secret Identifier":::

    Make a note of your secret URI that you want to get during your data factory pipeline run.
    
    > [!CAUTION]
    > The secret URI is structured like this: `{vaultBaseUrl}/secrets/{secret-name}/{secret-version}`. The _secret-version_ is optional; the latest version is returned when not specified. It is often desirable to specify a secret URI in a pipeline without a specific version so that the pipeline always uses the latest version of the secret.

4. In your Data Factory pipeline, add a new Web activity and configure it as follows.  

    |Property  |Value  |
    |---------|---------|
    |Secure Output     |True         |
    |URL     |[Your secret URI value]?api-version=7.0         |
    |Method     |GET         |
    |Authentication     |System Assigned Managed Identity         |
    |Resource        |https://vault.azure.net       |

    :::image type="content" source="media/how-to-use-azure-key-vault-secrets-pipeline-activities/webactivity.png" alt-text="Web activity":::

    > [!IMPORTANT]
    > You must add **?api-version=7.0** to the end of your secret URI.  

    > [!CAUTION]
    > Set the Secure Output option to true to prevent the secret value from being logged in plain text.  Any further activities that consume this value should have their Secure Input option set to true.

5. To use the value in another activity, use the following code expression **@activity('Web1').output.value**.

    :::image type="content" source="media/how-to-use-azure-key-vault-secrets-pipeline-activities/usewebactivity.png" alt-text="Code expression":::

## Next steps

To learn how to use Azure Key Vault to store credentials for data stores and computes, see [Store credentials in Azure Key Vault](./store-credentials-in-key-vault.md)
