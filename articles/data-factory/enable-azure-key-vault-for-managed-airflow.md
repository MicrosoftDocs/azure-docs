---
title: Enable Azure Key Vault for airflow
titleSuffix: Azure Data Factory
description: This article explains how to enable Azure Key Vault as the secret backend for a Managed Airflow instance.
ms.service: data-factory
ms.topic: how-to
author: nabhishek
ms.author: abnarain
ms.date: 08/29/2023
---

# Enable Azure Key Vault for Managed Airflow

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

> [!NOTE]
> Managed Airflow for Azure Data Factory relies on the open source Apache Airflow application. Documentation and more tutorials for Airflow can be found on the Apache Airflow [Documentation](https://airflow.apache.org/docs/) or [Community](https://airflow.apache.org/community/) pages.

Apache Airflow offers various backends for securely storing sensitive information such as variables and connections. One of these options is Azure Key Vault. This guide is designed to walk you through the process of configuring Azure Key Vault as the secret backend for Apache Airflow within Managed Airflow Environment.

## Prerequisites 

- **Azure subscription** - If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
- **Azure storage account** - If you don't have a storage account, see [Create an Azure storage account](/azure/storage/common/storage-account-create?tabs=azure-portal) for steps to create one. Ensure the storage account allows access only from selected networks.
- **Azure Key Vault** - You can follow [this tutorial to create a new Azure Key Vault](/azure/key-vault/general/quick-create-portal) if you don’t have one.
- **Service Principal** - You can [create a new service principal](/azure/active-directory/develop/howto-create-service-principal-portal) or use an existing one and grant it permission to access Azure Key Vault (example - grant the **key-vault-contributor role** to the SPN for the key vault, so the SPN can manage it). Additionally, you'll need to get the service principal **Client ID** and **Client Secret** (API Key) to add them as environment variables, as described later in this article.

## Permissions

Assign your SPN the following roles in your key vault from the [Built-in roles](/azure/role-based-access-control/built-in-roles).

- Key Vault Contributor
- Key Vault Secrets User

## Enable the Azure Key Vault backend for a Managed Airflow instance

Follow these steps to enable the Azure Key Vault as the secret backend for your Managed Airflow instance.

1. Navigate to the [Managed Airflow instance's integrated runtime (IR) environment](how-does-managed-airflow-work.md).
1. Install the [**apache-airflow-providers-microsoft-azure**](https://airflow.apache.org/docs/apache-airflow-providers-microsoft-azure/stable/index.html) for the **Airflow requirements** during your initial Airflow environment setup.

   :::image type="content" source="media/enable-azure-key-vault-for-managed-airflow/airflow-environment-setup.png" alt-text="Screenshot showing the Airflow Environment Setup window highlighting the Airflow requirements."  lightbox="media/enable-azure-key-vault-for-managed-airflow/airflow-environment-setup.png":::

1. Add the following settings for the **Airflow configuration overrides** in integrated runtime properties:

   - **AIRFLOW__SECRETS__BACKEND**: "airflow.providers.microsoft.azure.secrets.key_vault.AzureKeyVaultBackend"
   - **AIRFLOW__SECRETS__BACKEND_KWARGS**: "{"connections_prefix": "airflow-connections", "variables_prefix": "airflow-variables", "vault_url": **\<your keyvault uri\>**}”

   :::image type="content" source="media/enable-azure-key-vault-for-managed-airflow/airflow-configuration-overrides.png" alt-text="Screenshot showing the configuration of the Airflow configuration overrides setting in the Airflow environment setup."  lightbox="media/enable-azure-key-vault-for-managed-airflow/airflow-configuration-overrides.png":::

1. Add the following for the **Environment variables** configuration in the Airflow integrated runtime properties:

   - **AZURE_CLIENT_ID** = \<Client ID of SPN\>
   - **AZURE_TENANT_ID** = \<Tenant Id\>
   - **AZURE_CLIENT_SECRET** = \<Client Secret of SPN\>

   :::image type="content" source="media/enable-azure-key-vault-for-managed-airflow/environment-variables.png" alt-text="Screenshot showing the Environment variables section of the Airflow integrated runtime properties."  lightbox="media/enable-azure-key-vault-for-managed-airflow/environment-variables.png":::

1. Then you can use variables and connections and they will automatically be stored in Azure Key Vault. The name of connections and variables need to follow AIRFLOW__SECRETS__BACKEND_KWARGS as defined previously. For more information, refer to [Azure-key-vault as secret backend](https://airflow.apache.org/docs/apache-airflow-providers-microsoft-azure/stable/secrets-backends/azure-key-vault.html).

## Sample DAG using Azure Key Vault as the backend

1. Create a new Python file **adf.py** with the following contents:

   ```python
   from datetime import datetime, timedelta
   from airflow.operators.python_operator import PythonOperator
   from textwrap import dedent
   from airflow.models import Variable
   from airflow import DAG
   import logging

   def retrieve_variable_from_akv():
       variable_value = Variable.get("sample-variable")
       logger = logging.getLogger(__name__)
       logger.info(variable_value)

   with DAG(
      "tutorial",
      default_args={
          "depends_on_past": False,
          "email": ["airflow@example.com"],
          "email_on_failure": False,
          "email_on_retry": False,
          "retries": 1,
          "retry_delay": timedelta(minutes=5),
       },
      description="This DAG shows how to use Azure Key Vault to retrieve variables in Apache Airflow DAG",
      schedule_interval=timedelta(days=1),
      start_date=datetime(2021, 1, 1),
      catchup=False,
      tags=["example"],
   ) as dag:

       get_variable_task = PythonOperator(
           task_id="get_variable",
           python_callable=retrieve_variable_from_akv,
       )
   
   get_variable_task
   ```

1. Store variables for connections in Azure Key Vault. Refer to [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md)

   :::image type="content" source="media/enable-azure-key-vault-for-managed-airflow/secrets-configuration.png" alt-text="Screenshot showing the configuration of secrets in Azure Key Vault."  lightbox="media/enable-azure-key-vault-for-managed-airflow/secrets-configuration.png":::

## Next steps

- [Run an existing pipeline with Managed Airflow](tutorial-run-existing-pipeline-with-airflow.md)
- [Managed Airflow pricing](airflow-pricing.md)
- [How to change the password for Managed Airflow environments](password-change-airflow.md)
