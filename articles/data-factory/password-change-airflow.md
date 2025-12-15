---
title: Changing a password for a Workflow Orchestration Manager environment
description: This article describes how to change a password for a Workflow Orchestration Manager environment.
author: nabhishek
ms.subservice: security
ms.topic: conceptual
ms.date: 10/20/2023
ms.author: abnarain
ms.custom: sfi-image-nochange
---

# Changing a password for a Workflow Orchestration Manager environment

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article describes how to change the password for a Workflow Orchestration Manager environment in Azure Data Factory using **Basic** authentication.

> [!IMPORTANT]
> Workflow Orchestration Manager (powered by Apache Airflow) will be permanently retired in Azure Data Factory on December 31, 2025. The feature is now available in Microsoft Fabric. [Learn more](https://learn.microsoft.com/fabric/data-factory/apache-airflow-jobs-concepts)
>
> We recommend that you migrate all Workflow Orchestration Manager (Apache Airflow in Azure Data Factory) workloads to Data Workflows (Apache Airflow in Microsoft Fabric) to benefit from expanded capabilities before December 31, 2025.
>
> For more information or for support during your migration to Apache Airflow in Microsoft Fabric, contact Microsoft Support.

## Updating the password

We recommend using **Microsoft Entra ID** authentication in Workflow Orchestration Manager environments. However, if you choose to use **Basic** authentication, you can still update the Airflow password by editing the Airflow environment configuration and updating the username/password in the integration runtime settings, as shown here:

:::image type="content" source="media/password-change-airflow/password-change-airflow.png" alt-text="Screenshot showing how to change an Airflow password in the integration runtime settings.":::

## Related content

- [Run an existing pipeline with Workflow Orchestration Manager](tutorial-run-existing-pipeline-with-airflow.md)
- [Workflow Orchestration Manager pricing](airflow-pricing.md)
