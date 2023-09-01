---
title: Using a hotfix production environment 
description: Learn how to use a hotfix production environment with continuous integration and delivery in Azure Data Factory pipelines.
ms.service: data-factory
ms.subservice: ci-cd
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.topic: conceptual
ms.date: 01/11/2023
ms.custom:
---

# Using a hotfix production environment

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

If you deploy a factory to production and realize there's a bug that needs to be fixed right away, but you can't deploy the current collaboration branch, you might need to deploy a hotfix. This approach is as known as quick-fix engineering or QFE.

## Steps to deploy a hotfix

Use the following steps to deploy a hotfix in your production and test environments.

1.    In Azure DevOps, go to the release that was deployed to production. Find the last commit that was deployed.

1.    From the commit message, get the commit ID of the collaboration branch.

1.    Create a new hotfix branch from that commit.

1.    Go to the Azure Data Factory Studio and switch to the hotfix branch.

1.    By using the Azure Data Factory Studio, fix the bug. Test your changes.

1.    After the fix is verified, select **Export ARM Template** to get the hotfix Resource Manager template.

1.    Manually check this build into the adf_publish branch.

1.    If you've configured your release pipeline to automatically trigger based on adf_publish check-ins, a new release will start automatically. Otherwise, manually queue a release.

1.    Deploy the hotfix release to the test and production factories. This release contains the previous production payload plus the fix that you made in step 5.

1.   Add the changes from the hotfix to the development branch so that later releases won't include the same bug.

## Video tutorial
See the video below an in-depth video tutorial on how to hot-fix your environments. 

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4I7fi]

## Next steps

- [Automated publishing for continuous integration and delivery](continuous-integration-delivery-improvements.md)
- [Continuous integration and delivery overview](continuous-integration-delivery.md)
- [Automate continuous integration using Azure Pipelines releases](continuous-integration-delivery-automate-azure-pipelines.md)
- [Manually promote a Resource Manager template to each environment](continuous-integration-delivery-manual-promotion.md)
- [Use custom parameters with a Resource Manager template](continuous-integration-delivery-resource-manager-custom-parameters.md)
- [Linked Resource Manager templates](continuous-integration-delivery-linked-templates.md)
- [Sample pre- and post-deployment script](continuous-integration-delivery-sample-script.md)
