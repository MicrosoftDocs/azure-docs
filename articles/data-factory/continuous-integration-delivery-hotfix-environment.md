---
title: Using a hotfix production environment 
description: Learn how to use a hotfix production environment with continuous integration and delivery in Azure Data Factory pipelines.
ms.service: data-factory
ms.subservice: ci-cd
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.topic: conceptual
ms.date: 09/24/2021 
ms.custom: devx-track-azurepowershell
---

# Using a hotfix production environment

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

If you deploy a factory to production and realize there's a bug that needs to be fixed right away, but you can't deploy the current collaboration branch, you might need to deploy a hotfix. This approach is as known as quick-fix engineering or QFE.

1.    In Azure DevOps, go to the release that was deployed to production. Find the last commit that was deployed.

2.    From the commit message, get the commit ID of the collaboration branch.

3.    Create a new hotfix branch from that commit.

4.    Go to the Azure Data Factory UX and switch to the hotfix branch.

5.    By using the Azure Data Factory UX, fix the bug. Test your changes.

6.    After the fix is verified, select **Export ARM Template** to get the hotfix Resource Manager template.

7.    Manually check this build into the adf_publish branch.

8.    If you've configured your release pipeline to automatically trigger based on adf_publish check-ins, a new release will start automatically. Otherwise, manually queue a release.

9.    Deploy the hotfix release to the test and production factories. This release contains the previous production payload plus the fix that you made in step 5.

10.   Add the changes from the hotfix to the development branch so that later releases won't include the same bug.

See the video below an in-depth video tutorial on how to hot-fix your environments. 

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4I7fi]

## Next Steps

- [Continuous integration and delivery overview](continuous-integration-delivery.md)
- [Automate continuous integration using Azure Pipelines releases](continuous-integration-delivery-automate-azure-pipelines.md)
- [Manually promote a Resource Manager template to each environment](continuous-integration-delivery-manual-promotion.md)
- [Use custom parameters with a Resource Manager template](continuous-integration-delivery-resource-manager-custom-parameters.md)
- [Linked Resource Manager templates](continuous-integration-delivery-linked-templates.md)
- [Sample pre- and post-deployment script](continuous-integration-delivery-sample-script.md)