---
title: Using linked Resource Manager templates
description: Learn how to use linked Resource Manager templates with continuous integration and delivery in Azure Data Factory pipelines.
ms.service: data-factory
ms.subservice: ci-cd
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.topic: conceptual
ms.date: 10/20/2023
ms.custom:
---

# Linked Resource Manager templates with CI/CD

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

If you've set up continuous integration and delivery (CI/CD) for your data factories, you might exceed the Azure Resource Manager template limits as your factory grows bigger. For example, one limit is the maximum number of resources in a Resource Manager template. To accommodate large factories while generating the full Resource Manager template for a factory, Data Factory now generates linked Resource Manager templates. With this feature, the entire factory payload is broken down into several files so that you aren't constrained by the limits.

## Finding the linked templates

If you've configured Git, the linked templates are generated and saved alongside the full Resource Manager templates in the adf_publish branch in a new folder called linkedTemplates:

:::image type="content" source="media/continuous-integration-delivery/linked-resource-manager-templates.png" alt-text="Linked Resource Manager templates folder":::

The linked Resource Manager templates usually consist of a base template and a set of child templates that are linked to the base. The parent template is called ArmTemplate_master.json, and child templates are named with the pattern ArmTemplate_0.json, ArmTemplate_1.json, and so on. 

## Using linked templates
To use linked templates instead of the full Resource Manager template, update your CI/CD task to point to ArmTemplate_master.json instead of ArmTemplateForFactory.json (the full Resource Manager template). Resource Manager also requires that you upload the linked templates into a storage account so Azure can access them during deployment. For more info, see [Deploying linked Resource Manager templates with VSTS](/archive/blogs/najib/deploying-linked-arm-templates-with-vsts).

Since this is a Linked Template, the ARM deployment task requires the storage account URL and SAS token. The SAS token is needed even if the Service Principle has access to the blog since Linked Templates deploy inside Azure without context of the user. To achieve this, the Linked Template produced by the CI/CD steps require the following parameters `containerURI` and `containerSasToken`. It's recommended that you pass the SAS token in as a secret either as a secure variable or from a service like Azure Key Vault.

Remember to add the Data Factory scripts in your CI/CD pipeline before and after the deployment task.

If you don't have Git configured, you can access the linked templates via **Export ARM Template** in the **ARM Template** list.

When deploying your resources, you specify that the deployment is either an incremental update or a complete update. The difference between these two modes is how Resource Manager handles existing resources in the resource group that aren't in the template. Review [Deployment Modes](../azure-resource-manager/templates/deployment-modes.md).

## Next steps

- [Continuous integration and delivery overview](continuous-integration-delivery.md)
- [Automate continuous integration using Azure Pipelines releases](continuous-integration-delivery-automate-azure-pipelines.md)
- [Manually promote a Resource Manager template to each environment](continuous-integration-delivery-manual-promotion.md)
- [Use custom parameters with a Resource Manager template](continuous-integration-delivery-resource-manager-custom-parameters.md)
- [Using a hotfix production environment](continuous-integration-delivery-hotfix-environment.md)
- [Sample pre- and post-deployment script](continuous-integration-delivery-sample-script.md)
