---
title: Create an Airflow environment in Workflow Orchestration Manager
description: Learn how to create an Airflow environment in Workflow Orchestration Manager.
ms.service: data-factory
ms.topic: conceptual
author: nabhishek
ms.author: abnarain
ms.date: 10/20/2023
---

# Create an Airflow environment in Workflow Orchestration Manager

> [!NOTE]
> Workflow Orchestration Manager is powered by Apache Airflow.

This article describes how to set up and configure an Airflow environment in Workflow Orchestration Manager.

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- **Azure Data Factory**: Create or select an existing Data Factory instance in the region where the Workflow Orchestration Manager preview is supported.

## Create the environment

To create a new Workflow Orchestration Manager environment:

1. Go to the **Manage** hub and select **Airflow (Preview)** > **+ New** to open the **Airflow environment setup** page.

   :::image type="content" source="media/how-does-workflow-orchestration-manager-work/create-new-airflow.png" alt-text="Screenshot that shows how to create a new Workflow Orchestration Manager environment.":::

1. Enter information and select options for your Airflow configuration.

   :::image type="content" source="media/how-does-workflow-orchestration-manager-work/airflow-environment-details.png" alt-text="Screenshot that shows Airflow environment details." lightbox="media/how-does-workflow-orchestration-manager-work/airflow-environment-details.png":::

   > [!IMPORTANT]
   > When you use **Basic** authentication, remember the username and password specified on this page. You need them to sign in later in the Airflow UI. The default option is **Azure AD**. It doesn't require creating a username and password for your Airflow environment. Instead, it uses the signed-in user's credential for Azure Data Factory to sign in and monitor directed acyclic graphs (DAGs).

    More options on the **Airflow environment setup** page:

   - **Enable git sync**: You can allow your Airflow environment to automatically sync with a Git repository instead of manually importing DAGs. For more information, see [Sync a GitHub repository in Workflow Orchestration Manager](airflow-sync-github-repository.md).
   - **Airflow configuration overrides** You can override any Airflow configurations that you set in `airflow.cfg`. Examples are ``name: AIRFLOW__VAR__FOO`` and ``value: BAR``. For more information, see [Airflow configurations](airflow-configurations.md).
   - **Environment variables**: You can use this key value store within Airflow to store and retrieve arbitrary content or settings.
   - **Requirements**: You can use this option to preinstall Python libraries. You can update these requirements later.
   - **Kubernetes secrets**: You can create a custom Kubernetes secret for your Airflow environment. An example is [Private registry credentials to pull images for KubernetesPodOperator](kubernetes-secret-pull-image-from-private-container-registry.md).

1. After you fill out all the information according to the requirements, select **Create**.
