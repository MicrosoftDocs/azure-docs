---
author: ggailey777
ms.service: azure-functions
ms.date: 07/29/2026
ms.author: glenga
ms.custom: devdivchpfy22
---

To add a GitHub Actions workflow to an existing function app:

1. Go to your function app in the [Azure portal](https://portal.azure.com) and select **Deployment** > **Deployment Center**. 

1. Select **Continuous Deployment (CI/CD)**. For **Source**, select **GitHub**. If you don't see the default message *Building with GitHub Actions*, select **Change provider**, choose **GitHub Actions**, and select **OK**.

1. If you didn't already authorize GitHub access, select **Authorize**. Provide your GitHub credentials and select **Sign in**. To authorize a different GitHub account, select **Change Account** and sign in with another account. 

1. Select your GitHub **Organization**, **Repository**, and **Branch**. To deploy by using GitHub Actions, you must have write access to this repository. 

1. For **Workflow option**, select **Add a workflow**. This option creates a new workflow file in `/.github/workflows/`. To use an existing workflow, select **Use available workflow** and choose your workflow file.

1. In **Authentication settings**, choose **User-assigned identity** to use OpenID Connect (OIDC), which is recommended because it doesn't require you to store secrets in GitHub. Select your subscription and the **(New)** suggested identity name. A new user-assigned managed identity is created and granted access to the **Website Contributor** role. If you use an existing identity, you must first grant it access to **Website Contributor** role.  

    >[!IMPORTANT]  
    >When you select **Basic authentication**, your publish profile, which contains shared secrets, is stored in GitHub Secrets. You must also [enable SCM basic authentication](/azure/azure-functions/functions-continuous-deployment#enable-basic-authentication-for-deployments), which makes your app less secure.  

1. Select **Preview file** to see the workflow file that gets added to your GitHub repository in `.github/workflows/`.

1. Select **Save** to add the workflow file to your repository. Select the **Logs** tab to view the status of current and previous deployments.