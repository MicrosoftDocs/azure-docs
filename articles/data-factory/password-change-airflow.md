---
title: Changing a password for a Workflow Orchestration Manager environment
description: This article describes how to change a password for a Workflow Orchestration Manager environment.
author: nabhishek
ms.service: data-factory
ms.subservice: security
ms.topic: conceptual
ms.date: 10/20/2023
ms.author: abnarain
---

# Changing a password for a Workflow Orchestration Manager environment

> [!NOTE]
> Workflow Orchestration Manager is powered by Apache Airflow.

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article describes how to change the password for a Workflow Orchestration Manager environment in Azure Data Factory using **Basic** authentication.

## Updating the password

We recommend using **Microsoft Entra ID** authentication in Workflow Orchestration Manager environments. However, if you choose to use **Basic** authentication, you can still update the Airflow password by editing the Airflow environment configuration and updating the username/password in the integration runtime settings, as shown here:

:::image type="content" source="media/password-change-airflow/password-change-airflow.png" alt-text="Screenshot showing how to change an Airflow password in the integration runtime settings.":::

## Related content

- [Run an existing pipeline with Workflow Orchestration Manager](tutorial-run-existing-pipeline-with-airflow.md)
- [Workflow Orchestration Manager pricing](airflow-pricing.md)
