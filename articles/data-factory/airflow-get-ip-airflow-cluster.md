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

To restrict access to your data stores or resources solely to your Managed Airflow cluster and prevent access from all other IP addresses via the public endpoint. Retrieve the dedicated IP address specific to your Managed Airflow environment and add it to your storage firewall's allow list. This enables you to access data stores or resources secured by the firewall through the list of permitted IP addresses on the allow list of the firewall.

This article shows you how to retrieve the Managed Airflow cluster’s IP address and add it to the storage account you want to secure.

> [!NOTE]
> Importing DAGs is currently not supported using blob storage with IP allow listing or using private endpoints. We suggest using Git-sync instead.

## Step 1: Retrieve the bearer token for the Airflow API.
- Similar to the authentication process used in the standard Azure REST API, acquiring an access token from Azure AD is required before making a call to the Airflow REST API. A guide on how to obtain the token from Azure AD can be found at https://learn.microsoft.com/en-us/rest/api/azure.
- It should be noted that to obtain an access token for Data Factory, the resource to be used is **https://datafactory.azure.com**. 
- Additionally, the service principal used to obtain the access token needs to have atleast a **contributor role** on the Data Factory where the Airflow Integration Runtime is located.
 
For more information, see the below screenshots.
    1. Use Azure AD API call to get access token.

        :::image type="content" source="media/airflow-get-ip-airflow-cluster/get-access-token.png" alt-text="Screenshot showing the api used to retrieve the access token to invoke airflow apis." lightbox="media/airflow-get-ip-airflow-cluster/get-access-token.png":::

    2. Use the access token acquired as a bearer token from step 1 to invoke the Airflow API.
    
        :::image type="content" source="media/airflow-get-ip-airflow-cluster/get-dags.png" alt-text="Screenshot showing sample airflow api request using bearer token fetched in initial step." lightbox="media/airflow-get-ip-airflow-cluster/get-dags.png":::

## Step 2: Retrieve the Managed Airflow cluster IP address

Refer to the REST API documentation for [Integration Runtimes - Get](/rest/api/datafactory/integration-runtimes/get?tabs=HTTP#code-try-0).

## Step 3: Add the Managed Airflow cluster IP address to the storage account you want to secure

> [!NOTE]
> You can add the Managed Airflow IP address to other storage services as well like Azure SQL DB, Azure Key Vault, etc.

- To add managed Airflow Cluster IP address into Azure Key Vault, refer to [Azure SQL Database and Azure Synapse IP firewall rules](/azure/key-vault/general/network-security) 
- To add managed Airflow Cluster IP address into Azure Blob Storage, refer to [Configure Azure Storage firewalls and virtual networks](/azure/storage/common/storage-network-security?tabs=azure-portal#grant-access-from-an-internet-ip-range)
- To add managed Airflow Cluster IP address into Azure SQL Database, refer to [Configure Azure Key Vault firewalls and virtual networks](/azure/azure-sql/database/firewall-configure)
- To add managed Airflow Cluster IP address into Azure PostgreSQL Database, refer to [Create and manage firewall rules for Azure Database for PostgreSQL - Single Server using the Azure portal](/azure/postgresql/single-server/how-to-manage-firewall-using-portal)

## Next steps

- [Run an existing pipeline with Managed Airflow](tutorial-run-existing-pipeline-with-airflow.md)
- [Managed Airflow pricing](airflow-pricing.md)
- [How to change the password for Managed Airflow environments](password-change-airflow.md)