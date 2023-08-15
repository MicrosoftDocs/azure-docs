---
title: Changing a password for a Managed Airflow environment
description: This article describes how to change a password for a Managed Airflow environment.
author: nabhishek
ms.service: data-factory
ms.subservice: security
ms.topic: conceptual
ms.date: 01/24/2023
ms.author: abnarain
---

# Changing a password for a Managed Airflow environment

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article describes how to change the password for a Managed Airflow environment in Azure Data Factory using **Basic** authentication.

## Updating the password

We recommend using **Azure AD** authentication in Managed Airflow environments. However, if you choose to use **Basic** authentication, you can still update the Airflow password by editing the Airflow environment configuration and updating the username/password in the integration runtime settings, as shown here:

:::image type="content" source="media/password-change-airflow/password-change-airflow.png" alt-text="Screenshot showing how to change an Airflow password in the integration runtime settings.":::

## Next steps

- [Run an existing pipeline with Managed Airflow](tutorial-run-existing-pipeline-with-airflow.md)
- [Managed Airflow pricing](airflow-pricing.md)
