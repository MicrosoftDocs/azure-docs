---
author: ggailey777
ms.service: azure-functions
ms.date: 03/24/2024
ms.author: glenga
ms.custom: devdivchpfy22
---

To add a GitHub Actions workflow to an existing function app:

1. Navigate to your function app in the [Azure portal](https://portal.azure.com) and select **Deployment Center**. 

1. For **Source** select **GitHub**. If you don't see the default message *Building with GitHub Actions*, select **Change provider** choose **GitHub Actions** and select **OK**.

1. If you haven't already authorized GitHub access, select **Authorize**. Provide your GitHub credentials and select **Sign in**. To authorize a different GitHub account, select **Change Account** and sign in with another account. 

1. Select your GitHub **Organization**, **Repository**, and **Branch**. To deploy with GitHub Actions, you must have write access to this repository. 

1. In **Authentication settings**, choose whether to have GitHub Actions authenticate with a **User-assigned identity** or using **Basic authentication** credentials. For basic authentication, the current credentials are used.  

1. Select **Preview file** to see the workflow file that gets added to your GitHub repository in `github/workflows/`.

1. Select **Save** to add the workflow file to your repository. 