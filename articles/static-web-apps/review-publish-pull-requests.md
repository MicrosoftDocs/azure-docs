---
title: Review pull requests in pre-production environments
description: Learn how to use pre-production environments to review pull requests changes in Azure Static Web Apps.
services: static-web-apps
author: sinedied
ms.service: static-web-apps
ms.custom: engagement-fy23
ms.topic:  conceptual
ms.date: 10/27/2022
ms.author: yolasors
---

# Review pull requests in pre-production environments

This article shows you how to use pre-production environments to review changes to applications that are deployed with [Azure Static Web Apps](overview.md). A pre-production environment is a fully functional staged version of your application that includes changes not available in production.

Azure Static Web Apps generates a GitHub Actions workflow in the repo. When a pull request is created against a branch that the workflow watches, the pre-production environment gets built. The pre-production environment stages the app, so you can review the changes before you push them to production.

You can do the following tasks within pre-production environments:

- Review visual changes between production and staging, like updates to content and layout
- Demonstrate the changes to your team
- Compare different versions of your application
- Validate changes using acceptance tests
- Perform sanity checks before you deploy to production

> [!NOTE]
> Pull requests and pre-production environments are only supported in GitHub Actions deployments.

## Prerequisites

- An existing GitHub repo configured with Azure Static Web Apps. See [Building your first static app](getting-started.md) if you don't have one.

## Make a change

Make a change in your repo directly on GitHub, as shown in the following steps.

1. Go to your project's repo on GitHub, and then select **Branch**.

    :::image type="content" source="./media/review-publish-pull-requests/create-branch.png" alt-text="Create new branch using GitHub interface":::

1. Enter a branch name and select **Create branch**.

1. Go to your _app_ folder and change some text content, like a title or paragraph. Select **Edit** to make the change in the file.

    :::image type="content" source="./media/review-publish-pull-requests/edit-file.png" alt-text="Edit file button in GitHub interface":::

1. Select **Commit changes** when you're done.

    :::image type="content" source="./media/review-publish-pull-requests/commit-changes.png" alt-text="Screenshot showing the Commit changes button in the GitHub interface.":::

## Create a pull request

Create a pull request to publish your update.

1. Open the **Pull request** tab of your project on GitHub.

    :::image type="content" source="./media/review-publish-pull-requests/tab.png" alt-text="Screenshot showing the pull request tab in a GitHub repo.":::

1. Select **Compare & pull request**.

1. Optionally, enter details about your changes, and then select **Create pull request**.

    :::image type="content" source="./media/review-publish-pull-requests/open.png" alt-text="Screenshot showing the pull request creation in GitHub.":::

Assign reviewers and add comments to discuss your changes, if needed.

Multiple pre-production environments can co-exist at the same time when you use Azure Static Web Apps. Each time you create a pull request against the watched branch, a staged version with your changes deploys to a distinct pre-production environment.

You can make multiple changes and push new commits to your branch. The pull request automatically updates to reflect all changes.

## Review changes

The [GitHub Actions](https://github.com/features/actions) deployment workflow runs and deploys your pull request changes to a pre-production environment.

Once the workflow completes building and deploying your app, the GitHub bot adds a comment to your pull request, which contains the URL of the pre-production environment. 

1. Select the pre-production URL to see your staged changes.

   :::image type="content" source="./media/review-publish-pull-requests/bot-comment.png" alt-text="Screenshot of pull request comment with the pre-production URL.":::

   The URL is composed like this: `https://<SUBDOMAIN-PULL_REQUEST_ID>.<AZURE_REGION>.azurestaticapps.net`. For a given pull request, the URL remains the same, even if you push new updates. The same pre-production environment also gets reused for the life of the pull request.

To automate the review process with end-to-end testing, the [GitHub Action for deploying Azure Static Web Apps](https://github.com/Azure/static-web-apps-deploy) has the `static_web_app_url` output variable.
You can reference this URL in the rest of your workflow to run your tests against the pre-production environment.

## Publish changes

Merge the pull request to publish to production.

1. Select **Merge pull request**.

   :::image type="content" source="./media/review-publish-pull-requests/merge.png" alt-text="Screenshot showing the Merge pull request button in GitHub interface.":::

   Your changes get copied to the tracked branch (the "production" branch). Then, the deployment workflow starts on the tracked branch and the changes go live after    your application rebuilds.

1. Open your production URL to load the live version of the website and verify.

## Limitations

- Anyone can access the staged versions of your application via their URL, even if your GitHub repo is private.

    > [!WARNING]
    > Be careful with sensitive content, since anyone can access pre-production environments.

- The number of pre-production environments available for each app deployed with Static Web Apps depends your [hosting plan](plans.md). For example, with the [Free tier](https://azure.microsoft.com/pricing/details/devops/azure-devops-services/) you can have three pre-production environments along with the production environment.
- Pre-production environments aren't geo-distributed.
- Only GitHub Actions deployments support pre-production environments.

## Next steps

> [!div class="nextstepaction"]
> [Create branch preview environments](branch-environments.md)
