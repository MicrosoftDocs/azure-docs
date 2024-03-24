---
author: ggailey777
ms.service: azure-functions
ms.date: 03/24/2024
ms.author: glenga
ms.custom: devdivchpfy22
---

To add a GitHub Actions workflow to an existing function app:

1. Navigate to your function app in the [Azure portal](https://portal.azure.com) and select **Deployment Center**. 

1. Under Continuous Deployment (CI / CD), select **GitHub**. You see a default message, *Building with GitHub Actions*. 

1. Enter your GitHub organization, repository, and branch. 

1. Select **Preview file** to see the workflow file that gets added to your GitHub repository in `github/workflows/`.

1. Select **Save** to add the workflow file to your repository. 