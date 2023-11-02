---
title: "Tutorial: Deploy Bitbucket repositories on Azure Static Web Apps"
description: Use Bitbucket with Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: quickstart
ms.date: 03/31/2021
ms.author: cshoe
---

# Tutorial: Deploy Bitbucket repositories on Azure Static Web Apps

Azure Static Web Apps has flexible deployment options that allow to work with various providers. In this tutorial, you deploy a web application hosted in Bitbucket to Azure Static Web Apps using a Linux virtual machine.

> [!NOTE]
> The Static Web Apps pipeline task currently only works on Linux machines.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Import a repository to Bitbucket
> * Create a static web app
> * Configure the Bitbucket repo to deploy to Azure Static Web Apps

## Prerequisites

- [Bitbucket](https://bitbucket.org) account
  - Ensure you have enabled [two-step verification](https://bitbucket.org/account/settings/two-step-verification/manage)
- [Azure](https://portal.azure.com) account
  - If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free).

## Create a repository

This article uses a GitHub repository as the source to import code into a Bitbucket repository.

1. Sign in to [Bitbucket](https://bitbucket.org).
1. Go to [https://bitbucket.org/repo/import](https://bitbucket.org/repo/import) to begin the import process.
1. Under the *Old repository* label, in the *URL* box, enter the repository URL for your choice of framework.

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

1. Next to the *Project* label, select **Create new project**.
1. Enter **MyStaticWebApp**.
2. Select **Import repository** and wait a moment while the website creates your repository.

### Set main branch

From time to time the template repository have more than one branch. Use the following steps to ensure Bitbucket maps the *main* tag to the main branch in the repository.

1. Select **Repository settings**.
1. Expand the **Advanced** section.
1. Under the *Main branch* label, ensure **main** is selected in the drop down.
1. If you made a change, select **Save changes**.
2. Select **Back**.

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
    | Resource Group | Select the **Create new** link and enter **static-web-apps-bitbucket**. |
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

## Create the pipeline task in Bitbucket

1. Go to the repository in Bitbucket.
1. Select the **Source** menu item.
1. Ensure the **main** branch is selected in the branch drop down.
1. Select **Pipelines**.
1. Select text link **Create your first pipeline**.
2. On the *Starter pipeline* card, select **Select**.
3. Enter the following YAML into the configuration file.

    # [No Framework](#tab/vanilla-javascript)

    ```yml
    pipelines:
      branches:
       main:
        - step: 
            name: Deploy to test
            deployment: test
            script:
              - pipe: microsoft/azure-static-web-apps-deploy:main
                variables:
                    APP_LOCATION: '$BITBUCKET_CLONE_DIR/src'
                    OUTPUT_LOCATION: '$BITBUCKET_CLONE_DIR/src'
                    API_TOKEN: $deployment_token
    ```

    # [Angular](#tab/angular)

    ```yml
    pipelines:
      branches:
       main:
        - step: 
            name: Deploy to test
            deployment: test
            script:
              - pipe: microsoft/azure-static-web-apps-deploy:main
                variables:
                    APP_LOCATION: '$BITBUCKET_CLONE_DIR'
                    OUTPUT_LOCATION: '$BITBUCKET_CLONE_DIR/dist/angular-basic'
                    API_TOKEN: $deployment_token
    ```

    # [Blazor](#tab/blazor)

    ```yml
    pipelines:
      branches:
       main:
        - step: 
            name: Deploy to test
            deployment: test
            script:
              - pipe: microsoft/azure-static-web-apps-deploy:main
                variables:
                    APP_LOCATION: '$BITBUCKET_CLONE_DIR/Client'
                    OUTPUT_LOCATION: 'wwwroot'
                    API_TOKEN: $deployment_token
    ```

    # [React](#tab/react)

    ```yml
    pipelines:
      branches:
       main:
        - step: 
            name: Deploy to test
            deployment: test
            script:
              - pipe: microsoft/azure-static-web-apps-deploy:main
                variables:
                    APP_LOCATION: '$BITBUCKET_CLONE_DIR'
                    OUTPUT_LOCATION: '$BITBUCKET_CLONE_DIR/build'
                    API_TOKEN: $deployment_token
    ```

    # [Vue](#tab/vue)

    ```yml
    pipelines:
      branches:
       main:
        - step: 
            name: Deploy to test
            deployment: test
            script:
              - pipe: microsoft/azure-static-web-apps-deploy:main
                variables:
                    APP_LOCATION: '$BITBUCKET_CLONE_DIR'
                    OUTPUT_LOCATION: '$BITBUCKET_CLONE_DIR/dist'
                    API_TOKEN: $deployment_token
    ```

    ---

    > [!NOTE]
    > In this example the value for `pipe` is set to `microsoft/azure-static-web-apps-deploy:main`. Replace `main` with your desired branch name if you want your pipeline to work with a different branch.

    The following configuration properties are used in the configuration file for your static web app.

    The `$BITBUCKET_CLONE_DIR` variable maps to the repository's root folder location during the build process.

    | Property | Description | Example | Required |
    |--|--|--|--|
    | `app_location` | Location of your application code. | Enter `/` if your application source code is at the root of the repository, or `/app` if your application code is in a directory named `app`. | Yes |
    | `api_location` | Location of your Azure Functions code. | Enter `/api` if your api code is in a folder named `api`. If no Azure Functions app is detected in the folder, the build doesn't fail, the workflow assumes you don't want an API. | No |
    | `output_location` | Location of the build output directory relative to the `app_location`. | If your application source code is located at `/app`, and the build script outputs files to the `/app/build` folder, then set `build` as the `output_location` value. | No |

Next, define value for the `API_TOKEN` variable.

1. Select **Add variables**.
1. In the *Name* box, enter **deployment_token**, which matches the name in the workflow.
1. In the *Value* box, paste in the deployment token value you set aside in a previous step.
1. Check the **Secured** checkbox.
2. Select **Add**.
3. Select **Commit file** and return to your pipelines tab.

Wait a moment on the *Pipelines* window and you'll see your deployment status appear. Once the deployment is finished running, you can view the website in your browser.

## View the website

There are two aspects to deploying a static app. The first step creates the underlying Azure resources that make up your app. The second is a Bitbucket workflow that builds and publishes your application.

Before you can go to your new static site, the deployment build must first finish running.

The Static Web Apps overview window displays a series of links that help you interact with your web app.

1. Return to your static web app in the Azure portal.
1. Go to the **Overview** window.
2. Select the link under the *URL* label. Your website loads in a new tab.

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance and all the associated services by removing the resource group.

1. Select the **static-web-apps-bitbucket** resource group from the *Overview* section.
2. Select **Delete resource group** at the top of the resource group *Overview*.
3. Enter the resource group name **static-web-apps-bitbucket** in the *Are you sure you want to delete "static-web-apps-bitbucket"?* confirmation dialog.
4. Select **Delete**.

The process to delete the resource group may take a few minutes to complete.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
