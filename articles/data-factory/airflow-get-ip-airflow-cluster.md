---
title: Retrieve the IP address of a Workflow Orchestration Manager cluster
description: This article provides step-by-step instructions to retrieve the IP address of a Workflow Orchestration Manager's cluster.
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.service: data-factory
ms.topic: how-to
ms.date: 09/19/2023
---

# Retrieve the IP address of a Workflow Orchestration Manager cluster

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

> [!NOTE]
> This feature is in public preview. Workflow Orchestration Manager is powered by Apache Airflow.

This article demonstrates how to retrieve and add the IP address associated with your Workflow Orchestration Manager cluster to your storage firewall's allowlist. This enhances the security of data stores and resources by restricting access solely to the Workflow Orchestration Manager cluster within Azure Data Factory, preventing access from all other IP addresses via the public endpoint.

> [!NOTE]
> Importing DAGs is currently not supported by using blob storage with IP allow listing or by using private endpoints. We suggest using Git sync instead.

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

### Retrieve the bearer token for the Airflow API

- Similar to the authentication process used in the standard Azure REST API, acquiring an access token from Microsoft Entra ID is required before you make a call to the Airflow REST API. For more information on how to obtain the token from Microsoft Entra ID, see [Azure REST API reference](/rest/api/azure).
- Also, the service principal used to obtain the access token needs to have at least a Contributor role on the Azure Data Factory instance where the Airflow integration runtime is located.

For more information, see the following screenshots.

1. Use the Microsoft Entra ID API call to get an access token.

    :::image type="content" source="media/airflow-get-ip-airflow-cluster/get-access-token.png" alt-text="Screenshot that shows the API used to retrieve the access token to invoke Airflow APIs." lightbox="media/airflow-get-ip-airflow-cluster/get-access-token.png":::

1. Use the access token acquired as a bearer token from step 1 to invoke the Airflow API.

    :::image type="content" source="media/airflow-get-ip-airflow-cluster/get-dags.png" alt-text="Screenshot that shows a sample Airflow API request using a bearer token fetched in the initial step." lightbox="media/airflow-get-ip-airflow-cluster/get-dags.png":::

### Retrieve the Workflow Orchestration Manager cluster's IP address

1. Use the Workflow Orchestration Manager UI.

    :::image type="content" source="media/airflow-get-ip-airflow-cluster/get-cluster-ip-from-ui.png" alt-text="Screenshot that shows how to retrieve a cluster's IP by using the UI." lightbox="media/airflow-get-ip-airflow-cluster/get-cluster-ip-from-ui.png":::

1. Use the Rest API.
    For more information, see [Workflow Orchestration Manager IP address - Get](/rest/api/datafactory/integration-runtimes/get?tabs=HTTP#code-try-0).

    You should retrieve the Airflow cluster's IP address from the response, as shown in the screenshot.

    #### Sample response

    :::image type="content" source="media/airflow-get-ip-airflow-cluster/get-cluster-ip-from-api.png" alt-text="Screenshot that shows how to retrieve a cluster's IP by using an API." lightbox="media/airflow-get-ip-airflow-cluster/get-cluster-ip-from-api.png":::

### Add the Workflow Orchestration Manager cluster IP address to the storage account you want to secure

> [!NOTE]
> You can add the Workflow Orchestration Manager IP address to other storage services too, like Azure SQL Database and Azure Key Vault.

- To add a Workflow Orchestration Manager cluster IP address in Azure Key Vault, see [Azure SQL Database and Azure Synapse IP firewall rules](/azure/key-vault/general/network-security).
- To add a Workflow Orchestration Manager cluster IP address in Azure Blob Storage, see [Configure Azure Storage firewalls and virtual networks](/azure/storage/common/storage-network-security?tabs=azure-portal#grant-access-from-an-internet-ip-range).
- To add a Workflow Orchestration Manager cluster IP address in Azure SQL Database, see [Configure Azure Key Vault firewalls and virtual networks](/azure/azure-sql/database/firewall-configure).
- To add a Workflow Orchestration Manager cluster IP address in Azure PostgreSQL Database, see [Create and manage firewall rules for Azure Database for PostgreSQL - Single server using the Azure portal](/azure/postgresql/single-server/how-to-manage-firewall-using-portal).

## Related content

- [Run an existing pipeline with Workflow Orchestration Manager](tutorial-run-existing-pipeline-with-airflow.md)
- [Workflow Orchestration Manager pricing](airflow-pricing.md)
- [Change the password for Workflow Orchestration Manager environment](password-change-airflow.md)
