---
title: Manual promotion of Resource Manager templates 
description: Learn how to manually promote a Resource Manager template to multiple environments with continuous integration and delivery in Azure Data Factory.
ms.service: data-factory
ms.subservice: ci-cd
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.topic: conceptual
ms.date: 08/10/2023 
ms.custom:
---

# Manually promote a Resource Manager template to each environment

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

Use the steps below to promote a Resource Manager template to each environment for continuous integration and delivery in Azure Data Factory.

## Steps to manually promote a template

1. Go to **Manage** hub in your data factory, and select **ARM template** in the "Source control" section. Under **ARM template** section, select **Export ARM template** to export the Resource Manager template for your data factory in the development environment.

   :::image type="content" source="media/continuous-integration-delivery/continuous-integration-image-1.png" alt-text="Export a Resource Manager template":::

1. In your test and production data factories, select **Import ARM Template**. This action takes you to the Azure portal, where you can import the exported template. Select **Build your own template in the editor** to open the Resource Manager template editor.

   :::image type="content" source="media/continuous-integration-delivery/custom-deployment-build-your-own-template.png" alt-text="Build your own template"::: 

1. Select **Load file**, and then select the generated Resource Manager template. This is the **ARMTemplateForFactory.json** file located in the .zip file exported in step 1.

   :::image type="content" source="media/continuous-integration-delivery/custom-deployment-edit-template.png" alt-text="Edit template":::

1. In the settings section, enter the configuration values, like linked service credentials, required for the deployment. When you're done, select **Review + create** to deploy the Resource Manager template.

   :::image type="content" source="media/continuous-integration-delivery/continuous-integration-image5.png" alt-text="Settings section":::

## Next steps

- [Continuous integration and delivery overview](continuous-integration-delivery.md)
- [Automate continuous integration using Azure Pipelines releases](continuous-integration-delivery-automate-azure-pipelines.md)
- [Use custom parameters with a Resource Manager template](continuous-integration-delivery-resource-manager-custom-parameters.md)
- [Linked Resource Manager templates](continuous-integration-delivery-linked-templates.md)
- [Using a hotfix production environment](continuous-integration-delivery-hotfix-environment.md)
- [Sample pre- and post-deployment script](continuous-integration-delivery-sample-script.md)
