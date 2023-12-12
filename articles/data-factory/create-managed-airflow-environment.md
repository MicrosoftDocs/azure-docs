---
title: Create a Managed Airflow environment
description: Learn how to create a Managed Airflow environment
ms.service: data-factory
ms.topic: conceptual
author: nabhishek
ms.author: abnarain
ms.date: 10/20/2023
---

# Create a Managed Airflow environment
The following steps set up and configure your Managed Airflow environment.

## Prerequisites
**Azure subscription**: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
    Create or select an existing Data Factory in the region where the managed airflow preview is supported.

## Steps to create the environment
1. Create new Managed Airflow environment.
   Go to **Manage** hub -> **Airflow (Preview)** -> **+New** to create a new Airflow environment

   :::image type="content" source="media/how-does-managed-airflow-work/create-new-airflow.png" alt-text="Screenshot that shows how to create a new Managed Apache Airflow environment.":::

1. Provide the details (Airflow config)

   :::image type="content" source="media/how-does-managed-airflow-work/airflow-environment-details.png" alt-text="Screenshot that shows Managed Airflow environment details." lightbox="media/how-does-managed-airflow-work/airflow-environment-details.png":::

   > [!IMPORTANT]
   > When using **Basic** authentication, remember the username and password specified in this screen. It will be needed to login later in the Managed Airflow UI. The default option is **Azure AD** and it does not require creating username/ password for your Airflow environment, but instead uses the logged in user's credential to Azure Data Factory to login/ monitor DAGs.
1. **Enable git sync"** Allow your Airflow environment to automatically sync with a git repository instead of manually importing DAGs. Refer to [Sync a GitHub repository in Managed Airflow](airflow-sync-github-repository.md)
1. **Airflow configuration overrides** You can override any Airflow configurations that you set in `airflow.cfg`. For example, ``name: AIRFLOW__VAR__FOO``, ``value: BAR``. For more information, see [Airflow Configurations](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html)
1. **Environment variables** a simple key value store within Airflow to store and retrieve arbitrary content or settings.
1. **Requirements** can be used to preinstall python libraries. You can update these requirements later as well.
1. **Kubernetes secrets** Custom Kubernetes secret you wish to add in your Airflow environment. For Example: [Private registry credentials to pull images for KubernetesPodOperator](kubernetes-secret-pull-image-from-private-container-registry.md)
1. After filling out all the details according to the requirements. Click on ``Create`` Button.
