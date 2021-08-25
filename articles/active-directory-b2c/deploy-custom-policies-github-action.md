---
title: Deploy custom policies with GitHub Actions
titleSuffix: Azure AD B2C
description: Learn how to deploy Azure AD B2C custom policies in a CI/CD pipeline by using GitHub Actions.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 08/25/2021
ms.author: mimart
ms.subservice: B2C
---

# Deploy custom policies with GitHub Actions

[GitHub Actions](https://docs.github.com/actions/quickstart) allows you to create custom continuous integration (CI) and continuous deployment (CD) workflows directly in your GitHub repository. This article describes how to automate the deployment process of the Azure Active Directory B2C (Azure AD B2C) [custom policies](user-flow-overview.md) using GitHub Actions.

To automate the custom policy deployment process, use the [GitHub Deploy Azure AD B2C custom policy action](https://github.com/marketplace/actions/deploy-azure-ad-b2c-custom-policy). This GitHub Action has developed by the [Azure AD B2C community](https://github.com/azure-ad-b2c/deploy-trustframework-policy). 

The Action deploys Azure AD B2C custom policies into your Azure AD B2C tenant using the [Microsoft Graph API](/graph/api/resources/trustframeworkpolicy?view=graph-rest-beta&preserve-view=true). If the policy does not yet exist in your tenant, it will be created. Otherwise, it will be replaced.

> [!IMPORTANT]
> Managing Azure AD B2C custom policies with Azure Pipelines currently uses **preview** operations available on the Microsoft Graph API `/beta` endpoint. Use of these APIs in production applications is not supported. For more information, see the [Microsoft Graph REST API beta endpoint reference](/graph/api/overview?toc=.%2fref%2ftoc.json&view=graph-rest-beta&preserve-view=true).

## Prerequisites

* Complete the steps in the [Get started with custom policies in Active Directory B2C](tutorial-create-user-flows.md).
* If you haven't created GitHub repo, [create one](https://docs.github.com/en/get-started/quickstart/create-a-repo).  

## Select a custom policies folder

Your GitHub repository can contain all of your Azure AD B2C policy files and other assets. In the root directory of your repository, create or choose an existing folder the contains your custom policies. 

For example, select a folder named `policies`. Add your Azure AD B2C custom policy files to the *policies* folder. Then **Commit** the changes.

Do not **Push** the changes. You will do it later, after you set up the deployment workflow.

## Register an MS Graph application

To allow the GitHub Action to interact with the [Microsoft Graph API](microsoft-graph-operations.md), create an application registration in your Azure AD B2C tenant. If you haven't already done so, [register a Microsoft Graph application](microsoft-graph-get-started.md).

For the GitHub Action to access data in MS Graph, grant the registered application the relevant [application permissions](/graph/permissions-reference). Granted the **Microsoft Graph** > **Policy** > **Policy.ReadWrite.TrustFramework** permission within the **API Permissions** of the app registration.

## Create GitHub encrypted secret

GitHub secrets are encrypted environment variables that you create in an organization, repository, or repository environment. In this step, you store your application secret  of the application you registered earlier at [Register an MS Graph application](#register-an-ms-graph-application) step.

The GitHub Deploy Azure AD B2C custom policy action uses the secret to acquire an access token that uses to interact with Microsoft Graph API. For more information, see [Creating encrypted secrets for a repository](https://docs.github.com/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository).

To create a GitHub secret, follow these steps:

1. On GitHub, navigate to the main page of the repository.
1. Under your repository name, select **Settings**.
1. In the left sidebar, select **Secrets**.
1. Select **New repository secret**.
1. For the **Name**, type **ClientSecret**.
1. For the **Value**, enter the application secreted you created earlier.
1. Select **Add secret**.

## Create GitHub workflow

The GitHub workflow is an automated procedure that you add to your repository. Workflows are made up of one or more jobs and can be scheduled or triggered by an event. In this step, you create a workflow the deploys your custom policy.

To create a workflow, follow these steps:

1. On GitHub, navigate to the main page of your repository.
1. Under your repository name, select **Actions**.
    
    :::image type="content" source="./media/deploy-custom-policies-github-action/github-actions-tab.png" alt-text="Screenshot presents the GitHub Actions tab.":::

1. If you didn't configure a workflow before, select **set up a workflow yourself**. Otherwise, select **New Workflow**.
    :::image type="content" source="./media/deploy-custom-policies-github-action/set-up-a-workflow.png" alt-text="Screenshot demonstrates how to create a new workflow.":::

1. GitHub offers you to create a workflow file named `main.yml` under the `.github/workflows` folder. This file contains information about the workflow. Including your Azure AD B2C environment, and the custom policies to deploy. In the GitHub web editor add the following Yaml code:

    ```yml
    on: push

    env:
      clientId: 00000000-0000-0000-0000-000000000000
      tenant: your-tenant.onmicrosoft.com
    
    jobs:
      build-and-deploy:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v2
    
        - name: 'Upload TrustFrameworkBase Policy'
          uses: azure-ad-b2c/deploy-trustframework-policy@v3
          with:
            folder: "./Policies"
            files: "TrustFrameworkBase.xml,TrustFrameworkExtensions.xml,SignUpOrSignin.xml"
            tenant: ${{ env.tenant }}
            clientId: ${{ env.clientId }}
            clientSecret: ${{ secrets.clientSecret }}
    ```

1.  Update the following properties of the Yaml file:

    | Section| Name | Value |
    | ---- | ----- |----- |
    | `env` | `clientId` | **Application (client) ID** of the application you registered at [Register an MS Graph application](#register-an-ms-graph-application) step. |
    |`env`| `tenant` | Your Azure AD B2C [tenant name](tenant-management.md#get-your-tenant-name) (for example, contoso.onmicrosoft.com). |
    | `with`| `folder`| A folder where the custom policies files are stored. For example, `./Policies`.|
    | `with`| `files` | Comma delimiter list of policy files to deploy. For example, `TrustFrameworkBase.xml,TrustFrameworkExtensions.xml,SignUpOrSignin.xml`.|
    
    > [!IMPORTANT]
    > When running the agents and uploading the policy files, ensure they're uploaded in the correct order:
    >
    > 1. *TrustFrameworkBase.xml*
    > 1. *TrustFrameworkExtensions.xml*
    > 1. *SignUpOrSignin.xml*
    > 1. *ProfileEdit.xml*
    > 1. *PasswordReset.xml*

1. Select **Start commit**.
1. Below the commit message fields, decide whether to add your commit to the current branch or to a new branch. Select **Commit new file**, or **Propose new file** to create a pull request.

## Test your workflow

To test the workflow you created, **Push** the changes of your custom policy. Once your job has started running, you can see a visualization graph of the run's progress and view each step's activity on GitHub.

1. On GitHub, navigate to the main page of your repository.
1. Under your repository name, select **Actions**.
1. In the left sidebar, select the workflow you created.
1. Under **Workflow runs**, select the name of the run you want to see.

     :::image type="content" source="./media/deploy-custom-policies-github-action/workflow-report.png" alt-text="Screenshot demonstrates how to select a workflow activity.":::

1. Under **Jobs** or in the visualization graph, select the job you want to see.
1. View the results of each step. The following screenshot demonstrates the **Upload custom policy** step log.
 
    :::image type="content" source="./media/deploy-custom-policies-github-action/job-activity.png" alt-text="demonstrates the upload custom policy step log.":::


## Optional, scheduled your workflow

The workflow you created is triggered by the [push](https://docs.github.com/actions/reference/events-that-trigger-workflows#push) event. You can choose any event the fits your style of work. For example, during a [pull request](https://docs.github.com/actions/reference/events-that-trigger-workflows#pull_request)

You can also schedule a workflow to run at specific UTC times using [POSIX cron syntax](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html#tag_20_25_07). The schedule event allows you to trigger a workflow at a scheduled time. For more information, see [Scheduled events](https://docs.github.com/actions/reference/events-that-trigger-workflows#scheduled-events).

The following example triggers the workflow every day at 5:30 and 17:30 UTC:

```yml
on:
  schedule:
    # * is a special character in YAML so you have to quote this string
    - cron:  '30 5,17 * * *'
```

To edit your workflow:

1. On GitHub, navigate to the main page of your repository.
1. Under your repository name, select **Actions**.
1. In the left sidebar, select the workflow you created.
1. Under **Workflow runs**, select the name of the run you want to see.
1. From the menu, select the three dotes **...**, then select **View the workflow file**.
    :::image type="content" source="./media/deploy-custom-policies-github-action/edit-workflow.png" alt-text="Screenshot demonstrates how to view the workflow file.":::
1. In the GitHub web editor, select **Edit**.
1. Change the `on: push`, to the example above.
1. **Commit** your changes.

## Next steps

- Learn how to configure [Events that trigger workflows](https://docs.github.com/actions/reference/events-that-trigger-workflows)


