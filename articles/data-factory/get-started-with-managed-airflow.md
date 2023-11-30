---
title: Get Started with Managed Airflow
titleSuffix: Azure Data Factory
description: This document is the master document that contains all the links required to start working with Managed Airflow.
ms.service: data-factory
ms.topic: conceptual
author: nabhishek
ms.author: abnarain
ms.date: 10/20/2023
---
# How does Azure Managed Airflow work? 

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

> [!NOTE]
> Managed Airflow for Azure Data Factory relies on the open source Apache Airflow application. Documentation and more tutorials for Airflow can be found on the Apache Airflow [Documentation](https://airflow.apache.org/docs/) or [Community](https://airflow.apache.org/community/) pages.

Managed Airflow in Azure Data Factory uses Python-based Directed Acyclic Graphs (DAGs) to run your orchestration workflows. 
To use this feature, you need to provide your DAGs and plugins in Azure Blob Storage or via GitHub repository. You can launch the Airflow UI from ADF using a command line interface (CLI) or a software development kit (SDK) to manage your DAGs.

## Create a Managed Airflow environment
Refer to: [Create a Managed Airflow environment](create-managed-airflow-environment.md)

## Import DAGs
Managed Airflow provides two distinct methods for loading DAGs from python source files into Airflow's environment. These methods are:

- **Enable Git Sync:** This service allows you to synchronize your GitHub repository with Managed Airflow, enabling you to import DAGs directly from your GitHub repository. Refer to: [Sync a GitHub repository in Managed Airflow](airflow-sync-github-repository.md)

- **Azure Blob Storage:**  You can upload your DAGs, plugins etc. to a designated folder within a blob storage account that is linked with Azure Data Factory. Then, you import the file path of the folder in Managed Airflow. Refer to: [Import DAGs using Azure Blob Storage](airflow-import-dags-blob-storage.md)

## Remove DAGs from the Airflow environment

Refer to: [Delete DAGs in Managed Airflow](delete-dags-in-managed-airflow.md)

## Monitor DAG runs

To monitor the Airflow DAGs, sign in into Airflow UI with the earlier created username and password.

1. Select on the Airflow environment created.

   :::image type="content" source="media/how-does-managed-airflow-work/airflow-environment-monitor-dag.png" alt-text="Screenshot that shows the Airflow environment created.":::

1. Sign in using the username-password provided during the Airflow Integration Runtime creation. ([You can reset the username or password by editing the Airflow Integration runtime]() if needed)

   :::image type="content" source="media/how-does-managed-airflow-work/login-in-dags.png" alt-text="Screenshot that shows sign in using the username-password provided during the Airflow Integration Runtime creation.":::


## Troubleshooting import DAG issues

* Problem: DAG import is taking over 5 minutes 
Mitigation: Reduce the size of the imported DAGs with a single import. One way to achieve this is by creating multiple DAG folders with lesser DAGs across multiple containers.  

* Problem: Imported DAGs don't show up when you sign in into the Airflow UI.  
Mitigation: Sign in into the Airflow UI and see if there are any DAG parsing errors. This could happen if the DAG files contain any incompatible code. You'll find the exact line numbers and the files, which have the issue through the Airflow UI.

   :::image type="content" source="media/how-does-managed-airflow-work/import-dag-issues.png" alt-text="Screenshot shows import dag issues.":::

## Next steps

- [Run an existing pipeline with Managed Airflow](tutorial-run-existing-pipeline-with-airflow.md)
- [Managed Airflow pricing](airflow-pricing.md)
- [How to change the password for Managed Airflow environments](password-change-airflow.md)
