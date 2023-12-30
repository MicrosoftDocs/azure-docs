---
title: Add a Kubernetes secret to pull an image from a private container registry
titleSuffix: Azure Data Factory
description: This article explains how to add a Kubernetes secret to pull a custom image from a private container registry with Managed Airflow in Data Factory for Microsoft Fabric.
ms.service: data-factory
ms.topic: how-to
author: nabhishek
ms.author: abnarain
ms.date: 08/30/2023
---

# Add a Kubernetes secret to access a private container registry

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

> [!NOTE]
> Managed Airflow for Azure Data Factory relies on the open-source Apache Airflow application. You can find documentation and more tutorials for Airflow on the Apache Airflow [Documentation](https://airflow.apache.org/docs/) or [Community](https://airflow.apache.org/community/) webpages.

This article explains how to add a Kubernetes secret to pull a custom image from a private Azure Container Registry within the Azure Data Factory Managed Airflow environment.

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
- **Azure Storage account**: If you don't have a storage account, see [Create an Azure Storage account](/azure/storage/common/storage-account-create?tabs=azure-portal) for steps to create one. Ensure the storage account allows access only from selected networks.
- **Azure Container Registry**: Configure an [Azure Container Registry](/azure/container-registry/container-registry-get-started-portal?tabs=azure-cli) with the custom Docker image you want to use in the directed acyclic graph (DAG). For more information on push and pull container images, see [Push and pull container image - Azure Container Registry](/azure/container-registry/container-registry-get-started-docker-cli?tabs=azure-cli). 

### Create a new Managed Airflow environment

Open Azure Data Factory Studio and on the toolbar on the left, select the **Manage** tab. Then under **Workflow orchestration manager**, select **Apache Airflow**. Finally, select **+ New** to create a new Managed Airflow environment.

:::image type="content" source="media/kubernetes-secret-pull-image-from-private-container-registry/create-new-airflow-environment.png" alt-text="Screenshot that shows the steps to create a new Managed Airflow environment in Azure Data Factory Studio." lightbox="media/kubernetes-secret-pull-image-from-private-container-registry/create-new-airflow-environment.png":::

### Add a Kubernetes secret

On the **Airflow environment setup** window, scroll to the bottom and expand the **Advanced** section. Then under **Kubernetes secrets**, select **+ New**.

:::image type="content" source="media/kubernetes-secret-pull-image-from-private-container-registry/add-kubernetes-secret.png" alt-text="Screenshot that shows the Airflow environment setup window with the Advanced section expanded to show the Kubernetes secrets section." lightbox="media/kubernetes-secret-pull-image-from-private-container-registry/add-kubernetes-secret.png":::

### Configure authentication

Provide the required field **Secret name**. For **Secret type**, select **Private registry auth**. Then enter information in the other required fields. The **Registry server URL** should be the URL of your private container registry, for example, ```\registry_name\>.azurecr.io```.

:::image type="content" source="media/kubernetes-secret-pull-image-from-private-container-registry/create-airflow-secret.png" alt-text="Screenshot that shows the Create airflow secret window and its fields." lightbox="media/kubernetes-secret-pull-image-from-private-container-registry/create-airflow-secret.png" :::

After you enter information in the required fields, select **Apply** to add the secret.

## Related content

- [Run an existing pipeline with Managed Airflow](tutorial-run-existing-pipeline-with-airflow.md)
- [Managed Airflow pricing](airflow-pricing.md)
- [Change the password for Managed Airflow environments](password-change-airflow.md)
