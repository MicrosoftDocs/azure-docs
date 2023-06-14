---
title: "Tutorial: Deploy GitLab repositories on Azure Static Web Apps"
description: Use GitLab with Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: quickstart
ms.date: 03/30/2021
ms.author: cshoe
---

# Tutorial: Deploy GitLab repositories on Azure Static Web Apps

Azure Static Web Apps has flexible deployment options that allow to work with various providers. In this article, you deploy a web application hosted in GitLab to Azure Static Web Apps.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Import a repository to GitLab
> * Create a static web app
> * Configure the GitLab repo to deploy to Azure Static Web Apps

## Prerequisites

- [GitLab](https://gitlab.com) account
- [Azure](https://portal.azure.com) account
  - If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free).

## Create a repository

This article uses a GitHub repository as the source to import code into a GitLab repository.

1. Sign in to your GitLab account and go to [https://gitlab.com/projects/new#import_project](https://gitlab.com/projects/new#import_project)
2. Select **Repo by URL**.
3. In the *Git repository URL* box, enter the repository URL for your choice of framework.

    # [No Framework](#tab/vanilla-javascript)
    
    [https://github.com/staticwebdev/vanilla-basic.git](https://github.com/staticwebdev/vanilla-basic.git)
    
    # [Angular](#tab/angular)
    
    [https://github.com/staticwebdev/angular-basic.git](https://github.com/staticwebdev/angular-basic.git)
    
    # [Blazor](#tab/blazor)
    
    [https://github.com/staticwebdev/blazor-basic.git](https://github.com/staticwebdev/blazor-basic.git)
    
    # [React](#tab/react)
    
    [https://github.com/staticwebdev/react-basic.git](https://github.com/staticwebdev/react-basic.git)
    
    # [Vue](#tab/vue)
    
    [https://github.com/staticwebdev/vue-basic.git](https://github.com/staticwebdev/vue-basic.git)
    
    ---

4. In the *Project slug* box, enter **my-first-static-web-app**.
5. Select **Create project** and wait a moment while your repository is set up.

## Create a static web app

Now that the repository is created, you can create a static web app from the Azure portal.

1. Go to the [Azure portal](https://portal.azure.com).
1. Select **Create a Resource**.
1. Search for **Static Web Apps**.
1. Select **Static Web Apps**.
1. Select **Create**.
1. In the _Basics_ section, begin by configuring your new app.

    | Setting | Value |
    |--|--|
    | Azure subscription | Select your Azure subscription. |
    | Resource Group | Select the **Create new** link and enter **static-web-apps-gitlab**. |
    | Name | Enter **my-first-static-web-app**. |
    | Plan type | Select **Free**. |
    | Region for Azure Functions API and staging environments | Select the region closest to you. |
    | Source | Select **Other**. |

1. Select **Review + create**.
1. Select **Create**.
2. Select **Go to resource**.
3. Select **Manage deployment token**.
4. Copy the deployment token value and set it aside in an editor for later use.
5. Select **Close** on the *Manage deployment token* window.

## Create the pipeline task in GitLab

Next you add a workflow task responsible for building and deploying your site as you make changes.

### Add deployment token

1. Go to the repository in GitLab.
1. Select **Settings**.
1. Select **CI/CD**.
2. Next to the *Variables* section, select **Expand**.
3. Select **Add variable**.
4. In the *Key* box, enter **DEPLOYMENT_TOKEN**.
5. In the *Value* box, paste in the deployment token value you set aside in a previous step.
6. Select **Add variable**.

### Add file

1. Select the **Repository** menu option.
1. Select **Files**.
1. Ensure the *main* branch is selected in the branch drop down at the top.
1. Press the **plus sign** drop down and select **New file**.
1. Create a new file named `.gitlab-ci.yml` at the root of the repository. (Make sure the file extension is `.yml`.)
1. Enter the following YAML into the file.

    # [No Framework](#tab/vanilla-javascript)

    ```yml
    variables:
      API_TOKEN: $DEPLOYMENT_TOKEN
      APP_PATH: '$CI_PROJECT_DIR/src'
    
    deploy:
      stage: deploy
      image: registry.gitlab.com/static-web-apps/azure-static-web-apps-deploy
      script:
        - echo "App deployed successfully."
    ```

    # [Angular](#tab/angular)

    ```yml
    variables:
      API_TOKEN: $DEPLOYMENT_TOKEN
      APP_PATH: '$CI_PROJECT_DIR/src'
      OUTPUT_PATH: '$CI_PROJECT_DIR/dist/angular-basic'
    
    deploy:
      stage: deploy
      image: registry.gitlab.com/static-web-apps/azure-static-web-apps-deploy
      script:
        - echo "App deployed successfully."
    ```

    # [Blazor](#tab/blazor)

    ```yml
    variables:
      API_TOKEN: $DEPLOYMENT_TOKEN
      APP_PATH: '$CI_PROJECT_DIR/Client'
      OUTPUT_PATH: 'wwwroot'
    
    deploy:
      stage: deploy
      image: registry.gitlab.com/static-web-apps/azure-static-web-apps-deploy
      script:
        - echo "App deployed successfully."
    ```

    # [React](#tab/react)

    ```yml
    variables:
      API_TOKEN: $DEPLOYMENT_TOKEN
      APP_PATH: '$CI_PROJECT_DIR'
      OUTPUT_PATH: '$CI_PROJECT_DIR/build'
    
    deploy:
      stage: deploy
      image: registry.gitlab.com/static-web-apps/azure-static-web-apps-deploy
      script:
        - echo "App deployed successfully."
    ```

    # [Vue](#tab/vue)

    ```yml
    variables:
      API_TOKEN: $DEPLOYMENT_TOKEN
      APP_PATH: '$CI_PROJECT_DIR'
      OUTPUT_PATH: '$CI_PROJECT_DIR/dist'
    
    deploy:
      stage: deploy
      image: registry.gitlab.com/static-web-apps/azure-static-web-apps-deploy
      script:
        - echo "App deployed successfully."
    ```

    ---

    The following configuration properties are used in the *.gitlab-ci.yml* file to configure your static web app.

    The `$CI_PROJECT_DIR` variable maps to the repository's root folder location during the build process.

    | Property | Description | Example | Required |
    |--|--|--|--|
    | `APP_PATH` | Location of your application code. | Enter `$CI_PROJECT_DIR/` if your application source code is at the root of the repository, or `$CI_PROJECT_DIR/app` if your application code is in a folder named `app`. | Yes |
    | `API_PATH` | Location of your Azure Functions code. | Enter `$CI_PROJECT_DIR/api` if your app code is in a folder named `api`. | No |
    | `OUTPUT_PATH` | Location of the build output folder relative to the `APP_PATH`. | If your application source code is located at `$CI_PROJECT_DIR/app`, and the build script outputs files to the `$CI_PROJECT_DIR/app/build` folder, then set `$CI_PROJECT_DIR/app/build` as the `OUTPUT_PATH` value. | No |
    | `API_TOKEN` | API token for deployment. | `API_TOKEN: $DEPLOYMENT_TOKEN` | Yes |

2. Select **Commit changes**.
3. Select the **CI/CD** then **Pipelines** menu items to view the progress of your deployment.

Once the deployment is complete, you can view your website.

## View the website

There are two aspects to deploying a static app. The first step creates the underlying Azure resources that make up your app. The second is a GitLab workflow that builds and publishes your application.

Before you can go to your new static site, the deployment build must first finish running.

The Static Web Apps overview window displays a series of links that help you interact with your web app.

1. Return to your static web app in the Azure portal.
1. Go to the **Overview** window.
2. Select the link under the *URL* label. Your website loads in a new tab.

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance and all the associated services by removing the resource group.

1. Select the **static-web-apps-gitlab** resource group from the *Overview* section.
2. Select **Delete resource group** at the top of the resource group *Overview*.
3. Enter the resource group name **static-web-apps-gitlab** in the *Are you sure you want to delete "static-web-apps-gitlab"?* confirmation dialog.
4. Select **Delete**.

The process to delete the resource group may take a few minutes to complete.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
