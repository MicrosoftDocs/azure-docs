---
title: Retrieve the IP address of a Managed Airflow cluster
description: This article provides step-by-step instructions for how to retrieve the IP address of a Managed Airflow cluster in Azure Data Factory.
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.service: data-factory
ms.topic: how-to
ms.date: 09/19/2023
---

# Retrieve the IP address of a Managed Airflow cluster

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article explains how to enhance security of your data stores and resources by restricting access solely to your Managed Airflow cluster. In this article, you walk through the process of retrieving and adding the unique IP address associated with your Managed Airflow cluster to your storage firewall's allowlist. This process enables you to access data stores or resources through the list of permitted IP addresses on the firewall's allowlist. Access from all other IP addresses via the public endpoint is prevented.

> [!NOTE]
> Importing DAGs is currently not supported by using blob storage with IP allow listing or by using private endpoints. We suggest using Git sync instead.

## Prerequisites

**Azure subscription**: If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

### Retrieve the bearer token for the Airflow API

- Similar to the authentication process used in the standard Azure REST API, acquiring an access token from Microsoft Entra ID is required before you make a call to the Airflow REST API. For more information on how to obtain the token from Microsoft Entra ID, see [Azure REST API reference](/rest/api/azure).
- Also, the service principal used to obtain the access token needs to have at least a Contributor role on the Azure Data Factory instance where the Airflow integration runtime is located.

For more information, see the following screenshots.

1. Use the Microsoft Entra ID API call to get an access token.

    :::image type="content" source="media/airflow-get-ip-airflow-cluster/get-access-token.png" alt-text="Screenshot that shows the API used to retrieve the access token to invoke Airflow APIs." lightbox="media/airflow-get-ip-airflow-cluster/get-access-token.png":::

1. Use the access token acquired as a bearer token from step 1 to invoke the Airflow API.

    :::image type="content" source="media/airflow-get-ip-airflow-cluster/get-dags.png" alt-text="Screenshot that shows a sample Airflow API request using a bearer token fetched in the initial step." lightbox="media/airflow-get-ip-airflow-cluster/get-dags.png":::

### Retrieve the Managed Airflow cluster's IP address

1. Use the Managed Airflow UI.

    :::image type="content" source="media/airflow-get-ip-airflow-cluster/get-cluster-ip-from-ui.png" alt-text="Screenshot that shows how to retrieve a cluster's IP by using the UI." lightbox="media/airflow-get-ip-airflow-cluster/get-cluster-ip-from-ui.png":::

1. Use the Rest API.
    For more information, see [Managed Airflow IP address - Get](/rest/api/datafactory/integration-runtimes/get?tabs=HTTP#code-try-0).

    You should retrieve the Airflow cluster's IP address from the response, as shown in the screenshot.

    #### Sample response

    :::image type="content" source="media/airflow-get-ip-airflow-cluster/get-cluster-ip-from-api.png" alt-text="Screenshot that shows how to retrieve a cluster's IP by using an API." lightbox="media/airflow-get-ip-airflow-cluster/get-cluster-ip-from-api.png":::

### Add the Managed Airflow cluster IP address to the storage account you want to secure

> [!NOTE]
> You can add the Managed Airflow IP address to other storage services too, like Azure SQL Database and Azure Key Vault.

- To add a Managed Airflow cluster IP address in Azure Key Vault, see [Azure SQL Database and Azure Synapse IP firewall rules](/azure/key-vault/general/network-security).
- To add a Managed Airflow cluster IP address in Azure Blob Storage, see [Configure Azure Storage firewalls and virtual networks](/azure/storage/common/storage-network-security?tabs=azure-portal#grant-access-from-an-internet-ip-range).
- To add a Managed Airflow cluster IP address in Azure SQL Database, see [Configure Azure Key Vault firewalls and virtual networks](/azure/azure-sql/database/firewall-configure).
- To add a Managed Airflow cluster IP address in Azure PostgreSQL Database, see [Create and manage firewall rules for Azure Database for PostgreSQL - Single server using the Azure portal](/azure/postgresql/single-server/how-to-manage-firewall-using-portal).

## Related content

- [Run an existing pipeline with Managed Airflow](tutorial-run-existing-pipeline-with-airflow.md)
- [Managed Airflow pricing](airflow-pricing.md)
- [Change the password for Managed Airflow environments](password-change-airflow.md)
