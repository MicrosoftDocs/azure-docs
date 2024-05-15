---
title: Enable Azure Key Vault for airflow
titleSuffix: Azure Data Factory
description: This article explains how to enable Azure Key Vault as the secret back end for a Workflow Orchestration Manager instance.
ms.service: data-factory
ms.topic: how-to
author: nabhishek
ms.author: abnarain
ms.date: 08/29/2023
---

# Enable Azure Key Vault for Workflow Orchestration Manager

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

> [!NOTE]
> Workflow Orchestration Manager is powered by Apache Airflow.

Apache Airflow offers various back ends for securely storing sensitive information such as variables and connections. One of these options is Azure Key Vault. This article walks you through the process of configuring Key Vault as the secret back end for Apache Airflow within a Workflow Orchestration Manager environment.

> [!NOTE]
> Workflow Orchestration Manager for Azure Data Factory relies on the open-source Apache Airflow application. For documentation and more tutorials for Airflow, see the Apache Airflow [Documentation](https://airflow.apache.org/docs/) or [Community](https://airflow.apache.org/community/) webpages.

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
- **Azure Storage account**: If you don't have a storage account, see [Create an Azure Storage account](/azure/storage/common/storage-account-create?tabs=azure-portal) for steps to create one. Ensure the storage account allows access only from selected networks.
- **Azure Key Vault**: You can follow [this tutorial to create a new Key Vault instance](/azure/key-vault/general/quick-create-portal) if you don't have one.
- **Service principal**: You can [create a new service principal](/azure/active-directory/develop/howto-create-service-principal-portal) or use an existing one and grant it permission to access your Key Vault instance. For example, you can grant the **key-vault-contributor role** to the service principal name (SPN) for your Key Vault instance so that the SPN can manage it. You also need to get the service principal's **Client ID** and **Client Secret** (API Key) to add them as environment variables, as described later in this article.

## Permissions

Assign your SPN the following roles in your Key Vault instance from the [built-in roles](/azure/role-based-access-control/built-in-roles):

- Key Vault Contributor
- Key Vault Secrets User

## Enable the Key Vault back end for a Workflow Orchestration Manager instance

To enable Key Vault as the secret back end for your Workflow Orchestration Manager instance:

1. Go to the [Workflow Orchestration Manager instance's integration runtime environment](how-does-workflow-orchestration-manager-work.md).
1. Install [apache-airflow-providers-microsoft-azure](https://airflow.apache.org/docs/apache-airflow-providers-microsoft-azure/stable/index.html) for the **Airflow requirements** during your initial Airflow environment setup.

   :::image type="content" source="media/enable-azure-key-vault/airflow-environment-setup.png" alt-text="Screenshot that shows the Airflow Environment Setup window highlighting the Airflow requirements." lightbox="media/enable-azure-key-vault/airflow-environment-setup.png":::

1. Add the following settings for the **Airflow configuration overrides** in integration runtime properties:

   - **AIRFLOW__SECRETS__BACKEND**: `airflow.providers.microsoft.azure.secrets.key_vault.AzureKeyVaultBackend`
   - **AIRFLOW__SECRETS__BACKEND_KWARGS**: `{"connections_prefix": "airflow-connections", "variables_prefix": "airflow-variables", "vault_url": **\<your keyvault uri\>**}`

   :::image type="content" source="media/enable-azure-key-vault/airflow-configuration-overrides.png" alt-text="Screenshot that shows the configuration of the Airflow configuration overrides setting in the Airflow environment setup." lightbox="media/enable-azure-key-vault/airflow-configuration-overrides.png":::

1. Add the following variables for the **Environment variables** configuration in the Airflow integration runtime properties:

   - **AZURE_CLIENT_ID** = \<Client ID of SPN\>
   - **AZURE_TENANT_ID** = \<Tenant Id\>
   - **AZURE_CLIENT_SECRET** = \<Client Secret of SPN\>

   :::image type="content" source="media/enable-azure-key-vault/environment-variables.png" alt-text="Screenshot that shows the Environment variables section of the Airflow integration runtime properties." lightbox="media/enable-azure-key-vault/environment-variables.png":::

1. Then you can use variables and connections and they're stored automatically in Key Vault. The names of the connections and variables need to follow `AIRFLOW__SECRETS__BACKEND_KWARGS`, as defined previously. For more information, see [Azure Key Vault as secret back end](https://airflow.apache.org/docs/apache-airflow-providers-microsoft-azure/stable/secrets-backends/azure-key-vault.html).

## Sample DAG using Key Vault as the back end

1. Create the new Python file `adf.py` with the following contents:

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

1. Store variables for connections in Key Vault. For more information, see [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md).

   :::image type="content" source="media/enable-azure-key-vault/secrets-configuration.png" alt-text="Screenshot that shows the configuration of secrets in Azure Key Vault." lightbox="media/enable-azure-key-vault/secrets-configuration.png":::

## Related content

- [Run an existing pipeline with Workflow Orchestration Manager](tutorial-run-existing-pipeline-with-airflow.md)
- [Workflow Orchestration Manager pricing](airflow-pricing.md)
- [Change the password for Workflow Orchestration Manager environment](password-change-airflow.md)
