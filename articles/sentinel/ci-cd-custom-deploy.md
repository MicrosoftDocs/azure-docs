---
title: Customize repository deployments
titleSuffix: Microsoft Sentinel
description: This article describes how to customize repository deployments for the repositories feature in Microsoft Sentinel.
author: austinmccollum
ms.topic: how-to
ms.date: 12/31/2024
ms.author: austinmc
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security

#Customer intent: As a SOC collaborator or MSSP analyst, I want to customize repository deployment workflows and pipelines so that I can control deployment triggers, paths, and parameter mappings for efficient and tailored content deployment to cloud workspaces.

---

# Customize repository deployments (Public Preview)

There are two primary ways to customize the deployment of your repository content to Microsoft Sentinel workspaces. Each method uses different files and syntax, so consider these examples to get you started.

| Customization method | Deployment options covered |
|---|---|
| GitHub workflow<br>DevOps pipeline | Customize your connection's deployment trigger<br>Customize your deployment path<br>Smart deployments enablement|
| Configuration files | Control the prioritized order of your content deployments<br>Choose to *exclude* specific content files from deployments<br>Scale deployments across different workspaces by mapping parameter files to specific content files|

> [!IMPORTANT]
>
> The Microsoft Sentinel **Repositories** feature is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for more legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


## Prerequisites

In order to customize a repositories deployment, a repository connection must exist. For more information on creating the connection, see [Deploy custom content from your repository](ci-cd.md#prerequisites).
After the connection is made, the following prerequisites apply:

- Collaborator access to your GitHub repository or Project Administrator access to your Azure DevOps repository
- Actions enabled for GitHub and Pipelines enabled for Azure DevOps
- Ensure custom content files you want to deploy to your workspaces are in a supported format. For supported formats, see [Plan your repository content](ci-cd-custom-content.md#plan-your-repository-content).

For more information on deployable content types, see [Validate your content](ci-cd-custom-content.md#validate-your-content).

## Customize the workflow or pipeline

The default workflow only deploys content modified since the last deployment, based on commits to the repository. Customize to configure different deployment triggers, or to deploy content exclusively from a specific root folder.

Select one of the following tabs depending on your connection type:

# [GitHub](#tab/github)

**To customize your GitHub deployment workflow**:

1. In GitHub, go to your repository and find your workflow in the *.github/workflows* directory.

    The workflow file is the YML file starting with *sentinel-deploy-xxxxx.yml*. Open that file and the workflow name is shown in the first line and has the following default naming convention: `Deploy Content to <workspace-name> [<deployment-id>]`.

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

        Change these settings, for example, to schedule the workflow to run periodically, or to combine different workflow events together.

        For more information, see the [GitHub documentation](https://docs.github.com/en/actions/learn-github-actions/events-that-trigger-workflows#configuring-workflow-events) on configuring workflow events.

    - **To disable smart deployments**:
        The smart deployments behavior is separate from the deployment trigger discussed. Navigate to the `jobs` section of your workflow. Switch the `smartDeployment` default value from `true` to `false`. Once this change is committed, the smart deployment functionality is turned off, and all future deployments for this connection redeploy all the repository's relevant content files to the connected workspaces. 

    - **To modify the deployment path**:

        In the default configuration shown for the `on` section, the wildcards (`**`) in the first line in the `paths` section indicate that the entire branch is in the path for the deployment triggers.

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

1. In Azure DevOps, go to your repository and find your pipeline definition file in the *.sentinel* directory.

    The pipeline name is shown in the first line of the pipeline file, and has the following default naming convention: `Deploy Content to <workspace-name> [<deployment-id>]`.

    For example: `name: Deploy Content to repositories-demo [xxxxx-dk5d-3s94-4829-9xvnc7391v83a]`

1. Select the pencil button at the top-right of the page to open the file for editing, and then modify the deployment as follows:

    - **To modify the deployment trigger**, update the `trigger` section in the code, which describes the event that triggers the workflow to run.

        By default, this configuration is set to detect any push to the connected branch, including both modifications to existing content and additions of new content to the repository.

        Modify this trigger to any available Azure DevOps Triggers, such as a scheduling trigger or a pull request triggers. For more information, see the [Azure DevOps trigger documentation](/azure/devops/pipelines/yaml-schema).

    - **To disable smart deployments**:
        The smart deployments behavior is separate from the deployment trigger discussed. Navigate to the `ScriptArguments` section of your pipeline. Switch the `smartDeployment` default value from `true` to `false`. Once this change is committed, smart deployment functionality is turned off, and all future deployments for this connection redeploy all the repository's relevant content files to the connected workspaces. 

    - **To modify the deployment path**:

        The default configuration for the `trigger` section has the following code, which indicates that the `main` branch is in the path for the deployment triggers:

        ```yml
        trigger:
            branches:
                include:
                - main
        ```

        This default configuration means that a deployment pipeline is triggered anytime that content is pushed to any part of the `main` branch.

        To deploy content from a specific folder path only, add the folder name to the `include` section for the trigger and the deployment path to the `steps` section.

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

## Scale your deployments with parameter files

Rather than passing parameters as inline values in your content files, consider [using a Bicep parameter file](../azure-resource-manager/bicep/parameter-files.md) or a [JSON file that contains the parameter values](../azure-resource-manager/templates/parameter-files.md). Then map those parameter files to their associated Microsoft Sentinel content files to better scale your deployments across different workspaces. 

There are several ways to map parameter files to the content files. Keep in mind, Bicep parameter files only support Bicep file templates, but JSON parameter files support both. The repositories deployment pipeline considers parameter files in the following order: 
 
:::image type="content" source="media/ci-cd-custom-deploy/deploy-parameter-file-precedence-with-bicep.svg" alt-text="A diagram showing the precedence of parameter file mappings.":::

1. Is there a mapping in the *sentinel-deployment.config*?</br>For more information, see [Customize your connection configuration](ci-cd-custom-deploy.md#customize-your-connection-configuration).

1. Is there a workspace-mapped parameter file? Yes, the content files are in the same directory with a workspace-mapped parameter file matching one of these patterns:
   </br>*.\<WorkspaceID>.bicepparam*
   </br>*.parameters-\<WorkspaceID>.json*

1. Is there a default parameter file? Yes, the content files are in the same directory with a parameter file matching one of these patterns:
   </br>*.bicepparam*
   </br>*.parameters.json*
     
Avoid clashes with multiple workspace deployments by mapping your parameter files through the configuration file or specifying the workspace ID in the file name.

> [!IMPORTANT]
> Once a parameter file match is determined based on the mapping precedence, the pipeline ignores any remaining mappings.
> 

Modifying the mapped parameter file listed in the *sentinel-deployment.config* triggers the deployment of its paired content file. Adding or modifying a workspace-mapped parameter file or a default parameter file also triggers a deployment of the paired content files along with the newly modified parameters, unless a higher precedence parameter mapping is in place. Other content files aren't deployed as long as the smart deployments feature is still enabled in the workflow/pipeline definition file.

## Customize your connection configuration

The deployment script for repositories supports the usage of a deployment configuration file for each repository branch as of July 2022. The configuration JSON file helps you map parameter files to relevant content files, prioritize specific content in deployments, and exclude specific content from deployments.


1. Create the file *sentinel-deployment.config* at the root of your repository. Adding, deleting, or modifying this configuration file triggers a full deployment of all the content in the repository according to the updated configuration.

     :::image type="content" source="media/ci-cd-custom-deploy/deployment-config.png" alt-text="Screenshot of a repository root directory. The RepositoriesSampleContent is shown with the location of the sentinel-deployment.config file." lightbox="media/ci-cd-custom-deploy/deployment-config.png":::

1. Include your structured content in three optional sections, `"prioritizedcontentfiles":`, `"excludecontentfiles":`, and `"parameterfilemappings":`. If no sections are included or the .config file is omitted, the deployment process still runs. Invalid or unrecognized sections are ignored.

Here's an example of the entire contents of a valid *sentinel-deployment.config* file. This sample can also be found at the [Microsoft Sentinel CICD repositories sample](https://github.com/SentinelCICD/RepositoriesSampleContent). 

```json
{
  "prioritizedcontentfiles": [
    "parsers/Sample/ASimAuthenticationAWSCloudTrail.json",
    "workbooks/sample/TrendMicroDeepSecurityAttackActivity_ARM.json",
    "Playbooks/PaloAlto-PAN-OS/PaloAltoCustomConnector/azuredeploy.bicep"
  ], 
  "excludecontentfiles": [
     "Detections/Sample/PaloAlto-PortScanning.json",
     "parameters"
  ],
  "parameterfilemappings": {
    "879001c8-2181-4374-be7d-72e5dc69bd2b": {
      "Playbooks/PaloAlto-PAN-OS/Playbooks/PaloAlto-PAN-OS-BlockIP/azuredeploy.bicep": "parameters/samples/auzredeploy.bicepparam"
    },
    "9af71571-7181-4cef-992e-ef3f61506b4e": {
      "Playbooks/Enrich-SentinelIncident-GreyNoiseCommunity-IP/azuredeploy.json": "path/to/any-parameter-file.json"
    }
  },
  "DummySection": "This shouldn't impact deployment"
}
```

> [!NOTE]
> Don't use the backslash "\\" character in any of the content paths. Use the forward slash "/" instead.
> 

- **To prioritize content files**:
 
    As the amount of content in your repository grows, deployment times may increase. Add time sensitive content to this section to prioritize its deployment when a trigger occurs. 
    
    Add full path names to the `"prioritizedcontentfiles":` section. Wildcard matching isn't supported at this time.

- **To exclude content files**, modify the `"excludecontentfiles":` section with full path names of individual .json content files.

- **To map parameters**:

    The deployment script accepts three methods of mapping parameters as described in [Scale your deployments with parameter files](ci-cd-custom-deploy.md#scale-your-deployments-with-parameter-files). Mapping parameters through the *sentinel-deployment.config* takes the highest precedence and guarantees that a given parameter file is mapped to its associated content files. Modify the `"parameterfilemappings":` section with your target connection's workspace ID and full path names of individual .json files.


## Related content

A sample repository is available demonstrating the deployment config file and all three parameter mapping methods. For more information, see [Microsoft Sentinel CICD repositories sample](https://github.com/SentinelCICD/RepositoriesSampleContent).

- [Understand the structure and syntax of Bicep files](../azure-resource-manager/bicep/file.md)
- [Parameters in Bicep](../azure-resource-manager/bicep/parameters.md)
- [Create Resource Manager parameter file](../azure-resource-manager/templates/parameter-files.md)
- [Parameters in ARM templates](../azure-resource-manager/templates/parameters.md)

