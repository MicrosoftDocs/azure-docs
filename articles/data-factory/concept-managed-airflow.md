---
title: What is Managed Airflow?
titleSuffix: Azure Data Factory
description: Learn about when to use Managed Airflow, basic concepts and supported regions.
ms.service: data-factory
ms.topic: conceptual
author: nabhishek
ms.author: abnarain
ms.date: 01/20/2023
ms.custom: references_regions
---

# What is Azure Data Factory Managed Airflow?

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

> [!NOTE]
> This feature is in public preview. For questions or feature suggestions, please send an email to mailto:ManagedAirflow@microsoft.com with the details.

> [!NOTE]
> Managed Airflow for Azure Data Factory relies on the open source Apache Airflow application. Documentation and more tutorials for Airflow can be found on the Apache Airflow [Documentation](https://airflow.apache.org/docs/) or [Community](https://airflow.apache.org/community/) pages.

Azure Data Factory offers serverless pipelines for data process orchestration, data movement with 100+ managed connectors, and visual transformations with the mapping data flow.

Managed Airflow in Azure Data Factory is a managed orchestration service for [Apache Airflow](https://airflow.apache.org/) that simplifies the creation and management of Airflow environments on which you can operate end-to-end data pipelines at scale. Apache Airflow is an open-source tool used to programmatically author, schedule, and monitor sequences of processes and tasks referred to as "workflows." With Managed Airflow in Azure Data Factory, you can use Airflow and Python to create data workflows without managing the underlying infrastructure for scalability, availability, and security.  

:::image type="content" source="media/concept-managed-airflow/data-integration.png" alt-text="Screenshot shows data integration.":::

## When to use Managed Airflow?

Azure Data Factory offers [Pipelines](concepts-pipelines-activities.md) to visually orchestrate data processes (UI-based authoring). While Managed Airflow, offers Airflow based python DAGs (python code-centric authoring) for defining the data orchestration process. If you have the Airflow background, or are currently using Apache Airflow, you may prefer to use the Managed Airflow instead of the pipelines. On the contrary, if you wouldn't like to write/ manage python-based DAGs for data process orchestration, you may prefer to use pipelines.  

With Managed Airflow, Azure Data Factory now offers multi-orchestration capabilities spanning across visual, code-centric, OSS orchestration requirements.

## Features

- **Automatic Airflow setup** – Quickly set up Apache Airflow by choosing an [Apache Airflow version](concept-managed-airflow.md#supported-apache-airflow-versions) when you create a Managed Airflow environment. ADF Managed Airflow sets up Apache Airflow for you using the same Apache Airflow user interface and open-source code you can download on the Internet.
- **Automatic scaling** – Automatically scale Apache Airflow Workers by setting the minimum and maximum number of Workers that run in your environment. ADF Managed Airflow monitors the Workers in your environment. It uses its autoscaling component to add Workers to meet demand until it reaches the maximum number of Workers you defined.
- **Built-in authentication** – Enable Azure Active Directory (Azure AD) role-based authentication and authorization for your Airflow Web server by defining Azure AD RBAC's access control policies.  
- **Built-in security** – Metadata is also automatically encrypted by Azure-managed keys, so your environment is secure by default. Additionally, it supports double encryption with a Customer-Managed Key (CMK).  
- **Streamlined upgrades and patches** – Azure Data Factory Managed Airflow provide new versions of Apache Airflow periodically. The ADF Managed Airflow team will auto-update and patch the minor versions. 
- **Workflow monitoring** – View Airflow logs and Airflow metrics in Azure Monitor to identify Airflow task delays or workflow errors without needing additional third-party tools. Managed Airflow automatically sends environment metrics, and if enabled, Airflow logs to Azure Monitor. 
- **Azure integration** – Azure Data Factory Managed Airflow supports open-source integrations with Azure Data Factory pipelines, Azure Batch, Azure Cosmos DB, Azure Key Vault, ACI, ADLS Gen2, Azure Kusto, as well as hundreds of built-in and community-created operators and sensors.

## Architecture
   :::image type="content" source="media/concept-managed-airflow/architecture.png" lightbox="media/concept-managed-airflow/architecture.png" alt-text="Screenshot shows architecture in Managed Airflow.":::

## Region availability (public preview)

* EastUs
* SouthCentralUs
* WestUs
* UKSouth  
* NorthEurope  
* WestEurope  
* SouthEastAsia
* EastUS2 (coming soon)
* WestUS2 (coming soon)
* GermanyWestCentral (coming soon)
* AustraliaEast (coming soon)

> [!NOTE]
> By GA, all ADF regions will be supported. The Airflow environment region is defaulted to the Data Factory region and is not configurable, so ensure you use a Data Factory in the above supported region to be able to access the Managed Airflow preview.  

## Supported Apache Airflow versions

* 1.10.14
* 2.2.2
* 2.4.3

## Integrations

Apache Airflow integrates with Microsoft Azure services through microsoft.azure [provider](https://airflow.apache.org/docs/apache-airflow-providers-microsoft-azure/stable/index.html).  

You can install any provider package by editing the airflow environment from the Azure Data Factory UI. It takes around a couple of minutes to install the package.

   :::image type="content" source="media/concept-managed-airflow/airflow-integration.png" lightbox="media/concept-managed-airflow/airflow-integration.png" alt-text="Screenshot shows airflow integration.":::

## Limitations

* Managed Airflow in other regions will be available by GA (Tentative GA is Q2 2023 ).
* Data Sources connecting through airflow should be publicly accessible. 
* Blob Storage behind VNet are not supported during the public preview (Tentative GA is Q2 2023
* DAGs that are inside a Blob Storage in VNet/behind Firewall is currently not supported.
* Azure Key Vault is not supported in LinkedServices to import dags.(Tentative GA is Q2 2023)
* Airflow supports officially Blob Storage and ADLS with some limitations.

## Next steps

- [Run an existing pipeline with Managed Airflow](tutorial-run-existing-pipeline-with-airflow.md)
- [Refresh a Power BI dataset with Managed Airflow](tutorial-refresh-power-bi-dataset-with-airflow.md)
- [Managed Airflow pricing](airflow-pricing.md)
- [How to change the password for Managed Airflow environments](password-change-airflow.md)
