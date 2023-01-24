---
title: Changing a password for an Airflow environment
description: This article describes how to change a password for an Airflow environment.
author: nabhishek
ms.service: data-factory
ms.subservice: conceptual
ms.topic: conceptual
ms.date: 01/24/2023
ms.author: abnarain
---

# Changing a password for an Airflow environment

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes how to change the password for an Airflow environment using **Basic** authentication.

## Updating the password

We recommend using **Azure AD** authentication in Airflow environments. However, if you choose to use **Basic** authentication, you can still update the Airflow password by editing the Airflow environment and updating the username/password in the integration runtime settings, as shown here:

:::image type="content" source="media/password-change-airflow/password-change-airflow.png" alt-text="Screenshot showing how to change an Airflow password in the integration runtime settings.":::

## Next steps

- [Run an existing pipeline with Airflow](tutorial-run-existing-pipeline-with-airflow.md)
- [Refresh a Power BI dataset](tutorial-refresh-power-bi-dataset-with-airflow.md)
- [Airflow pricing](airflow-pricing.md)
