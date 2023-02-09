---
title: Preview environments in Azure Static Web Apps
description: Expose preview environments to evaluate changes in Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 03/29/2022
ms.custom: template-how-to
---

# Preview environments in Azure Static Web Apps

By default, when you deploy a site to Azure Static Web Apps [each pull request deploys a preview version of your site available through a temporary URL](review-publish-pull-requests.md). This version of the site allows you to review changes before merging pull requests. Once the pull request (PR) is closed, the temporary environment disappears.

Beyond PR-driven temporary environments, you can enable preview environments that feature stable locations. The URLs for preview environments take on the following form:

  ```text
  <DEFAULT_HOST_NAME>-<BRANCH_OR_ENVIRONMENT_NAME>.<LOCATION>.azurestaticapps.net
  ```

## Deployment types

The following deployment types are available in Azure Static Web Apps.

- **Production**: Changes to production branches are deployed into the production environment. Your custom domain points to this environment, and content served from this location is indexed by search engines.

- [**Pull requests**](review-publish-pull-requests.md): Pull requests against your production branch deploy to a temporary environment that disappears after the pull request is closed. The URL for this environment includes the PR number as a suffix. For example, if you make your first PR, the preview location looks something like `<DEFAULT_HOST_NAME>-1.<LOCATION>.azurestaticapps.net`.

- [**Branch**](branch-environments.md): You can optionally configure your site to deploy every change made to branches that aren't a production branch. This preview deployment is published at a stable URL that includes the branch name. For example, if the branch is named `dev`, then the environment is available at a location like `<DEFAULT_HOST_NAME>-dev.<LOCATION>.azurestaticapps.net`.

- [**Named environment**](named-environments.md): You can configure your pipeline to deploy all changes to a named environment. This preview deployment is published at a stable URL that includes the environment name. For example, if the deployment environment is named `release`, then the environment is available at a location like `<DEFAULT_HOST_NAME>-release.<LOCATION>.azurestaticapps.net`. 

> [!NOTE]
> Valid characters for environment names are `0-9`,`a-z`, and `A-Z`. The maximum character string limit allowed is 16. 

## Next Steps

> [!div class="nextstepaction"]
> [Review pull requests in pre-production environments](./review-publish-pull-requests.md)
