---
title: Create stable review environments in Azure Static Web Apps
description: Expose stable URLs for specific branches or environment to evaluate changes in Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: how-to
ms.date: 03/14/2022
ms.custom: template-how-to
---

# Create stable review locations in Azure Static Web Apps

By default, when you deploy a site to Azure Static Web Apps [each pull request is associated with a temporary URL](review-publish-pull-requests.md). This location disappears once the PR is merged.

Alternatively, you can enable the staging environments feature to create stable URLs that map to specific branches. When you enable this feature, keep in mind the following items:

- URLs remain active for the life of the branch.
- Preview versions are generated either for all pull requests, or for specific branches.
  - Once you enable the staging environments feature, preview versions of your site are only generated for the listed branches.

The URLs for staging environments take the following form:

`<DEFAULT_HOST_NAME>-<BRANCH_NAME>.<LOCATION>.azurestaticapps.net`

For instance, a URL for the *dev* branch may resemble the following example:

`fresh-ocean-dev.centralus.azurestaticapps.net`

This article demonstrates how to enable stable review locations in both GitHub and Azure DevOps.

## Configuration

Update the list of branches in the `on` `>` `push` `>` `branches` section of the configuration.

Under the `jobs` section, locate the job named **Build and Deploy**. Under the `with` section, add the key `production_branch` and set it equal to your production branch name.

For example, the following code demonstrates how to assign the `production_branch`:

```yml
jobs: 
  build_and_deploy_job: 
    ...
    steps: 
      ...
      - name: Build And Deploy 
        id: builddeploy 
        uses: Azure/static-web-apps-deploy@v1 
        with: 
          ...
          production_branch: "main" 
```

## Example

The following example configuration demonstrates how to create a stable review location for a branch named *dev*.

::: zone pivot="github"

```yml
trigger: 
  - main
  - dev
 
pool: 
  vmImage: ubuntu-latest 
 
steps: 
  - checkout: self 
    submodules: true 
  - task: AzureStaticWebApp@0 
    inputs: 
      app_location: '/src' 
      api_location: 'api' 
      output_location: '/src' 
      azure_static_web_apps_api_token: $(deployment_token) 
      production_branch: 'main' 
```

::: zone-end

## Next steps

<!-- -->

- **Production environment**: Azure Static Web Apps builds and deploys changes to the production branch into the production environment. Your custom domain points to this environment and  indexed by search engines.

PR previews – Azure Static Web Apps builds and deploys changes included in a pull request against your production branch/branches defined in the PR triggers section. The PR preview is an ephemeral environment published to a URL which includes the PR number as a suffix. For example, if you make your first PR, the PR preview will be live at  defaulthostname-1.westeurope.azurestaticapps.net 

Branch previews – Azure Static Web Apps builds and deploys every change made to a branch that is not a production branch. The branch preview is an environment that lives for the entire lifetime of the branch it’s attached to, and it’s published to a URL which includes the branch name as a suffix. For example, if a branch is called staging, the branch preview will be live at defaulthostname-staging.westeurope.azurestaticapps.net . 
