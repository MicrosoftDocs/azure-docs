---
title: 'Quickstart: Link an Azure Machine Learning workspace'  
description: Link your Synapse workspace to an Azure Machine Learning workspace

services: synapse-analytics
ms.service: synapse-analytics 
ms.subservice: machine-learning
ms.topic: quickstart
ms.reviewer: jrasnick, garye

ms.date: 09/25/2020
author: nelgson
ms.author: negust
---
# Quickstart: Create a new Azure Machine Learning linked service in Synapse

In this quickstart, you'll link an Synapse Analytics workspace to an Azure Machine Learning workspace. Linking these workspaces allows you to leverage Azure Machine Learning from various experiences in Synapse.

For example, this linking to an Azure Machine Learning workspace enables these experiences:

- Run your Azure Machine Learning pipelines as a step in your Synapse pipelines. To learn more, see [Execute Azure Machine Learning pipelines](/azure/data-factory/transform-data-machine-learning-service).

- Enrich your data with predictions by bringing a machine learning model from the Azure Machine Learning model registry and score the model in Synapse SQL pools. For more details, see [Tutorial: Machine learning model scoring wizard for Synapse SQL pools](tutorial-sql-pool-model-scoring-wizard.md).

## Prerequisites

- Azure subscription - [Create one for free](https://azure.microsoft.com/free/).
- [Synapse Analytics workspace](../get-started-create-workspace.md) with an ADLS Gen2 storage account configured as the default storage. You need to be the **Storage Blob Data Contributor** of the ADLS Gen2 filesystem that you work with.
- [Azure Machine Learning Workspace](/azure/machine-learning/how-to-manage-workspace).
- You need permissions (or request from someone who has permissions) to create a service principal and secret which you can use to create the linked service. Note that this service principal needs to be assigned the contributor role in the Azure Machine Learning Workspace.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/)

## Create a service principal

This step will create a new Service Principal. If you want to use an existing Service Principal, you can skip this step.
1. Open Azure portal. 

1. Go to **Azure Active Directory** -> **App registrations**.

1. Click **New registration**. Then, follow instructions on the UI to register a new application.

1. After the application is registered. Generate a secret for the application. Go to **Your application** -> **Certificate & Secret**. Click **Add client secret** to generate a secret. Keep the secret safe and it will be used later.

   ![Generate secret](media/quickstart-integrate-azure-machine-learning/quickstart-integrate-azure-machine-learning-createsp-00a.png)

1. Create a service principal for the application. Go to **Your application** -> **Overview** and then click **Create service principal**. In some cases, this service principal is automatically created.

   ![Create service principal](media/quickstart-integrate-azure-machine-learning/quickstart-integrate-azure-machine-learning-createsp-00b.png)

1. Add the service principal as "contributor" of the Azure Machine Learning workspace. Note that this will require being an owner of the resource group that the Azure Machine Learning workspace belongs to.

   ![Assign contributor role](media/quickstart-integrate-azure-machine-learning/quickstart-integrate-azure-machine-learning-createsp-00c.png)

## Create a linked service

1. In the Synapse workspace where you want to create the new Azure Machine Learning linked service, go to **Management** -> **Linked service**, create a new linked service with type "Azure Machine Learning".

   ![Create linked service](media/quickstart-integrate-azure-machine-learning/quickstart-integrate-azure-machine-learning-create-linked-service-00a.png)

2. Fill out the form:

   - Service principal ID: This is the **application (client) ID** of the Application.
  
     > [!NOTE]
     > This is NOT the name of the application. You can find this ID in the overview page of the application. It should be a long string looking similar to this "81707eac-ab38-406u-8f6c-10ce76a568d5".

   - Service principal key: The secret you generated in the previous section.

3. Click **Test Connection** to verify if the configuration is correct. If the connection test passes, click **Save**.

   If the connection test failed, make sure that the service principal ID and secret are correct and try again.

## Next steps

- [Tutorial: Machine learning model scoring wizard - SQL pool](tutorial-sql-pool-model-scoring-wizard.md)
- [Machine Learning capabilities in Azure Synapse Analytics (workspaces preview)](what-is-machine-learning.md)
