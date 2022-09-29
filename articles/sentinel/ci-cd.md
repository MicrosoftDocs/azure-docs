---
title: Deploy custom content from your repository
description: This article describes how to create connections with a GitHub or Azure DevOps repository where you can manage your custom content and deploy it to Microsoft Sentinel.
author: austinmccollum
ms.topic: how-to
ms.date: 8/25/2022
ms.author: austinmc
#Customer intent: As a SOC collaborator or MSSP analyst, I want to know how to connect my source control repositories for continuous integration and continuous delivery (CI/CD). Specifically as an MSSP content manager, I want to know how to deploy one solution to many customer workspaces and still be able to tailor custom content for their environments.
---

# Deploy custom content from your repository (Public preview)

When creating custom content, you can manage it from your own Microsoft Sentinel workspaces, or an external source control repository. This article describes how to create and manage connections between Microsoft Sentinel and GitHub or Azure DevOps repositories. Managing your content in an external repository allows you to make updates to that content outside of Microsoft Sentinel, and have it automatically deployed to your workspaces. For more information, see [Update custom content with repository connections](ci-cd-custom-content.md).

> [!IMPORTANT]
>
> The Microsoft Sentinel **Repositories** feature is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites and scope

Microsoft Sentinel currently supports connections to GitHub and Azure DevOps repositories. Before connecting your Microsoft Sentinel workspace to your source control repository, make sure that you have:

- An **Owner** role in the resource group that contains your Microsoft Sentinel workspace *or* a combination of **User Access Administrator** and **Sentinel Contributor** roles to create the connection
- Contributor access to your GitHub or Azure DevOps repository
- Actions enabled for GitHub and Pipelines enabled for Azure DevOps
- Ensure custom content files you want to deploy to your workspaces are in relevant [Azure Resource Manager (ARM) templates](../azure-resource-manager/templates/index.yml).

For more information, see [Validate your content](ci-cd-custom-content.md#validate-your-content)

## Connect a repository

This procedure describes how to connect a GitHub or Azure DevOps repository to your Microsoft Sentinel workspace, where you can save and manage your custom content, instead of in Microsoft Sentinel.

Each connection can support multiple types of custom content, including analytics rules, automation rules, hunting queries, parsers, playbooks, and workbooks. For more information, see [About Microsoft Sentinel content and solutions](sentinel-solutions.md).

**To create your connection**:

1. Make sure that you're signed into your source control app with the credentials you want to use for your connection.  If you're currently signed in using different credentials, sign out first.

1. In Microsoft Sentinel, on the left under **Content management**, select **Repositories**.

1. Select **Add new**, and then, on the **Create a new connection** page, enter a meaningful name and description for your connection.

1. From the **Source Control** dropdown, select the type of repository you want to connect to, and then select **Authorize**.

1. Select one of the following tabs, depending on your connection type:

    # [GitHub](#tab/github)

    1. Enter your GitHub credentials when prompted.

        The first time you add a connection, you'll see a new browser window or tab, prompting you to authorize the connection to Microsoft Sentinel. If you're already logged into  your GitHub account on the same browser, your GitHub credentials will be auto-populated.

    1. A **Repository** area now shows on the **Create a new connection** page, where you can select an existing repository to connect to. Select your repository from the list, and then select **Add repository**.

        The first time you connect to a specific repository, you'll see a new browser window or tab, prompting you to install the **Azure-Sentinel** app on your repository. If you have multiple repositories, select the ones where you want to install the **Azure-Sentinel** app, and install it.

        You'll be directed to GitHub to continue the app installation.

    1. After the **Azure-Sentinel** app is installed in your repository, the **Branch** dropdown in the **Create a new connection** page is populated with your branches. Select the branch you want to connect to your Microsoft Sentinel workspace.

    1. From the **Content Types** dropdown, select the type of content you'll be deploying.

        - Both parsers and hunting queries use the **Saved Searches** API to deploy content to Microsoft Sentinel. If you select one of these content types, and also have content of the other type in your branch, both content types are deployed.

        - For all other content types, selecting a content type in the **Create a new connection** pane deploys only that content to Microsoft Sentinel. Content of other types is not deployed.

    1. Select **Create** to create your connection. For example:

        :::image type="content" source="media/ci-cd/create-new-connection-github.png" alt-text="Screenshot of a new GitHub repository connection.":::

    # [Azure DevOps](#tab/azure-devops)

    > [!NOTE]
    > Due to cross-tenant limitations, if you are creating a connection as a [guest user](../active-directory/external-identities/what-is-b2b.md) on the workspace, your Azure DevOps URL won't appear in the dropdown. Enter it manually instead.
    >

    You are automatically authorized to Azure DevOps using your current Azure credentials. To ensure valid connectivity, [verify that you've authorized to the same Azure DevOps account](https://aex.dev.azure.com/) that you're connecting to from Microsoft Sentinel or use an InPrivate browser window to create your connection.
    
    1.  In Microsoft Sentinel, from the dropdown lists that appear, select your **Organization**, **Project**, **Repository**, **Branch**, and **Content Types**.

        - Both parsers and hunting queries use the **Saved Searches** API to deploy content to Microsoft Sentinel. If you select one of these content types, and also have content of the other type in your branch, both content types are deployed.

        - For all other content types, selecting a content type in the **Create a new connection** pane deploys only that content to Microsoft Sentinel. Content of other types is not deployed.

    1. Select **Create** to create your connection. For example:

        :::image type="content" source="media/ci-cd/create-new-connection-devops.png" alt-text="Screenshot of a new GitHub repository connection.":::

    ---

    > [!NOTE]
    > You cannot create duplicate connections, with the same repository and branch, in a single Microsoft Sentinel workspace.
    >

After the connection is created, a new workflow or pipeline is generated in your repository, and the content stored in your repository is deployed to your Microsoft Sentinel workspace.

The deployment time may vary depending on the volume of content that you're deploying. 

### View the deployment status

- **In GitHub**: On the repository's **Actions** tab. Select the workflow **.yaml** file shown there to access detailed deployment logs and any specific error messages, if relevant.
- **In Azure DevOps**: On the repository's **Pipelines** tab.

After the deployment is complete:

- The content stored in your repository is displayed in your Microsoft Sentinel workspace, in the relevant Microsoft Sentinel page.

- The connection details on the **Repositories** page are updated with the link to the connection's deployment logs and the status and time of the last deployment. For example:

    :::image type="content" source="media/ci-cd/deployment-logs-status.png" alt-text="Screenshot of a GitHub repository connection's deployment logs.":::

### Customize the deployment workflow

The default workflow only deploys content that has been modified since the last deployment based on commits to the repository. But you may want to turn off smart deployments or perform other customizations. For example, you can configure different deployment triggers, or deploy content exclusively from a specific root folder.

Select one of the following tabs depending on your connection type:

# [GitHub](#tab/github)

**To customize your GitHub deployment workflow**:

1. In GitHub, go to your repository and find your workflow in the `.github/workflows` directory.

    The workflow file is the YML file starting with `sentinel-deploy-xxxxx.yml`. Open that file and the workflow name is shown in the first line and has the following default naming convention: `Deploy Content to <workspace-name> [<deployment-id>]`.

    For example: `name: Deploy Content to repositories-demo [xxxxx-dk5d-3s94-4829-9xvnc7391v83a]`

1. Select the pencil button at the top-right of the page to open the file for editing, and then modify the deployment as follows:

    - **To modify the deployment trigger**, update the `on` section in the code, which describes the event that triggers the workflow to run.

        By default, this configuration is set to `on: push`, which means that the workflow is triggered at any push to the connected branch, including both modifications to existing content and additions of new content to the repository. For example:

        ```yml
        on:
            push:
                branches: [ main ]
                paths:
                - `**`
                - `!.github/workflows/**` # this filter prevents other workflow changes from triggering this workflow
                - `.github/workflows/sentinel-deploy-<deployment-id>.yml`
        ```

        You may want to change these settings, for example, to schedule the workflow to run periodically, or to combine different workflow events together.

        For more information, see the [GitHub documentation](https://docs.github.com/en/actions/learn-github-actions/events-that-trigger-workflows#configuring-workflow-events) on configuring workflow events.

    - **To disable smart deployments**:
        The smart deployments behavior is separate from the deployment trigger discussed above. Navigate to the `jobs` section of your workflow. Switch the `smartDeployment` default value from `true` to `false`. This will turn off the smart deployments functionality and all future deployments for this connection will redeploy all the repository's relevant content files to the connected workspace(s) once this change is committed. 

    - **To modify the deployment path**:

        In the default configuration shown above for the `on` section, the wildcards (`**`) in the first line in the `paths` section indicate that the entire branch is in the path for the deployment triggers.

        This default configuration means that a deployment workflow is triggered anytime that content is pushed to any part of the branch.

        Later on in the file, the `jobs` section includes the following default configuration: `directory: '${{ github.workspace }}'`. This line indicates that the entire GitHub branch is in the path for the content deployment, without filtering for any folder paths.

        To deploy content from a specific folder path only, add it to both the `paths` and the `directory` configuration. For example, to deploy content only from a root folder named `SentinelContent`, update your code as follows:

        ```yml
        paths:
        - `SentinelContent/**`
        - `!.github/workflows/**` # this filter prevents other workflow changes from triggering this workflow
        - `.github/workflows/sentinel-deploy-<deployment-id>.yml`

        ...
            directory: '${{ github.workspace }}/SentinelContent'
        ```

For more information, see the [GitHub documentation](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#onpushpull_requestpaths) on GitHub Actions and editing GitHub workflows.

# [Azure DevOps](#tab/azure-devops)

**To customize your Azure DevOps deployment pipeline**:

1. In Azure DevOps, go to your repository and find your pipeline definition file in the `.sentinel` directory.

    The pipeline name is shown in the first line of the pipeline file, and has the following default naming convention: `Deploy Content to <workspace-name> [<deployment-id>]`.

    For example: `name: Deploy Content to repositories-demo [xxxxx-dk5d-3s94-4829-9xvnc7391v83a]`

1. Select the pencil button at the top-right of the page to open the file for editing, and then modify the deployment as follows:

    - **To modify the deployment trigger**, update the `trigger` section in the code, which describes the event that triggers the workflow to run.

        By default, this configuration is set to detect any push to the connected branch, including both modifications to existing content and additions of new content to the repository.

        Modify this trigger to any available Azure DevOps Triggers, such as to scheduling or pull request triggers. For more information, see the [Azure DevOps trigger documentation](/azure/devops/pipelines/yaml-schema).

    - **To disable smart deployments**:
        The smart deployments behavior is separate from the deployment trigger discussed above. Navigate to the `ScriptArguments` section of your pipeline. Switch the `smartDeployment` default value from `true` to `false`. This will turn off the smart deployments functionality and all future deployments for this connection will redeploy all the repository's relevant content files to the connected workspace(s) once this change is committed. 

    - **To modify the deployment path**:

        The default configuration for the `trigger` section has the following code, which indicates that the `main` branch is in the path for the deployment triggers:

        ```yml
        trigger:
            branches:
                include:
                - main
        ```

        This default configuration means that a deployment pipeline is triggered anytime that content is pushed to any part of the `main` branch.

        To deploy content from a specific folder path only, add the folder name to the `include` section, for the trigger, and the `steps` section, for the deployment path, below as needed.

        For example, to deploy content only from a root folder named `SentinelContent` in your `main` branch, add `include` and `workingDirectory` settings to your code as follows:

        ```yml
        paths:
            exclude:
            - .sentinel/*
            include:
            - .sentinel/sentinel-deploy-39d8ekc8-397-5963-49g8-5k63k5953829.yml
            - SentinelContent
        ....
        steps:
        - task: AzurePowerShell@5
          inputs:
            azureSubscription: `Sentinel_Deploy_ServiceConnection_0000000000000000`
            workingDirectory: `SentinelContent`
        ```

For more information, see the [Azure DevOps documentation](/azure/devops/pipelines/yaml-schema) on the Azure DevOps YAML schema.

---

> [!IMPORTANT]
> In both GitHub and Azure DevOps, make sure that you keep the trigger path and deployment path directories consistent.
>

## Edit content

After you've successfully created a connection to your source control repository, anytime content in that repository is modified or added, the modified content is deployed to all connected Microsoft Sentinel workspaces.

We recommend that you edit any content stored in a connected repository *only* in the repository, and not in Microsoft Sentinel. For example, to make changes to your analytics rules, do so directly in GitHub or Azure DevOps.

If you have edited the content in Microsoft Sentinel, make sure to export it to your source control repository to prevent your changes from being overwritten the next time the repository content is deployed to your workspace.

## Delete content

Deleting content from your repository doesn't delete it from your Microsoft Sentinel workspace. If you want to remove content that was deployed through repositories, make sure to delete it from both your repository and Sentinel. For example, set a filter for the content based on source name to make is easier to identify content from repositories.

:::image type="content" source="media/ci-cd/delete-repo-content.png" alt-text="Screenshot of analytics rules filtered by source name of repositories.":::

## Remove a repository connection

This procedure describes how to remove the connection to a source control repository from Microsoft Sentinel.

**To remove your connection**:

1. In Microsoft Sentinel, on the left under **Content management**, select **Repositories**.
1. In the grid, select the connection you want to remove, and then select **Delete**.
1. Select **Yes** to confirm the deletion.

After you've removed your connection, content that was previously deployed via the connection remains in your Microsoft Sentinel workspace. Content added to the repository after removing the connection is not deployed.

> [!TIP]
> If you encounter issues or an error message when deleting your connection, we recommend that you check your source control to confirm that the GitHub workflow or Azure DevOps pipeline associated with the connection was deleted.
>

### Removing the Microsoft Sentinel app from your GitHub repository

If you intend to delete the Microsoft Sentinel app from a GitHub repository, we recommend that you *first* remove all associated connections from the Microsoft Sentinel **Repositories** page.

Each Microsoft Sentinel App installation has a unique ID that's used when both adding and removing the connection. If the ID is missing or has been changed, you'll need to both remove the connection from the Microsoft Sentinel **Repositories** page and manually remove the workflow from your GitHub repository to prevent any future content deployments.

## Next steps

Use your custom content in Microsoft Sentinel in the same way that you'd use out-of-the-box content.

For more information, see:

- [Discover and deploy Microsoft Sentinel solutions (Public preview)](sentinel-solutions-deploy.md)
- [Microsoft Sentinel data connectors](connect-data-sources.md)
- [Advanced Security Information Model (ASIM) parsers (Public preview)](normalization-parsers-overview.md)
- [Visualize collected data](get-visibility.md)
- [Create custom analytics rules to detect threats](detect-threats-custom.md)
- [Hunt for threats with Microsoft Sentinel](hunting.md)
- [Use Microsoft Sentinel watchlists](watchlists.md)
- [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md)
