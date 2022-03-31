---
title: Deploy Bitbucket repositories on Azure Static Web Apps
description: Use Bitbucket with Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: quickstart
ms.date: 03/30/2021
ms.author: cshoe
---

# Deploy Bitbucket repositories on Azure Static Web Apps

Azure Static Web Apps has flexible deployment options that allow to work with various providers. In this article, you deploy a web application hosted in Bitbucket to Azure Static Web Apps using a Linux virtual machine.

> [!NOTE]
> The Static Web Apps pipeline task currently only works on Linux machines.

## Prerequisites

- [Bitbucket](https://bitbucket.org) account
  - Ensure you have enabled [two-step verification](https://bitbucket.org/account/settings/two-step-verification/manage)
- [Azure](https://portal.azure.com) account
  - If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free).

## Create a repository

This article uses a GitHub repository as the source to import code into a Bitbucket repository.

1. Sign in to Bitbucket.
1. Navigate to [https://bitbucket.org/repo/import](https://bitbucket.org/repo/import) to begin the import process.
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

1. Select the **Import repository** button.

## Create a static web app

Now that the repository is created, you can create a static web app from the Azure portal.

1. Navigate to the [Azure portal](https://portal.azure.com).
1. Select **Create a Resource**.
1. Search for **Static Web Apps**.
1. Select **Static Web Apps**.
1. Select **Create**.
1. In the _Basics_ section, begin by configuring your new app and linking it to a GitHub repository.

    | Setting | Value |
    |--|--|
    | Azure subscription | Select your Azure subscription. |
    | Resource Group | Select the **Create new** link and enter **static-web-apps-bitbucket**. |
    | Name | Enter **my-first-static-web-app**. |
    | Plan type | Select **Free**. |
    | Region for Azure Functions API and staging environments | Select the region closet to you. |
    | Source | Select **Other**. |

1. Select **Review + create**.
1. Select **Create**.
1. Select the **Go to resource** button.
1. Select the **Manage deployment token** button.
1. Copy the deployment token value and set it aside in an editor for later use.
1. Select the **Close** button on the *Manage deployment token* window.

## Create the pipeline task in Bitbucket

### Add deployment token

1. Navigate to the repository in Bitbucket.
1. Select **Pipelines**.
1. Select **Create your first pipeline**.
1. Select **Starter pipeline**.
1. Enter the following YAML into the configuration file.

    # [No Framework](#tab/vanilla-javascript)

    ```yml
    pipelines:
      branches:
       main:
        - step: 
            name: Deploy to test
            deployment: test
            script:
              - pipe: microsoft/azure-static-web-apps-deploy:dev
                variables:
                    APP_LOCATION: '$BITBUCKET_CLONE_DIR/src'
                    API_LOCATION: '$BITBUCKET_CLONE_DIR/api'
                    OUTPUT_LOCATION: '$BITBUCKET_CLONE_DIR'
                    API_TOKEN: $deployment_token​
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
              - pipe: microsoft/azure-static-web-apps-deploy:dev
                variables:
                    APP_LOCATION: '$BITBUCKET_CLONE_DIR/src'
                    API_LOCATION: '$BITBUCKET_CLONE_DIR/api'
                    OUTPUT_LOCATION: '$BITBUCKET_CLONE_DIR/dist/angular-basic'
                    API_TOKEN: $deployment_token​
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
              - pipe: microsoft/azure-static-web-apps-deploy:dev
                variables:
                    APP_LOCATION: '$BITBUCKET_CLONE_DIR/Client'
                    API_LOCATION: '$BITBUCKET_CLONE_DIR/api'
                    OUTPUT_LOCATION: '$BITBUCKET_CLONE_DIR/wwwroot'
                    API_TOKEN: $deployment_token​
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
              - pipe: microsoft/azure-static-web-apps-deploy:dev
                variables:
                    APP_LOCATION: '$BITBUCKET_CLONE_DIR'
                    API_LOCATION: '$BITBUCKET_CLONE_DIR/api'
                    OUTPUT_LOCATION: '$BITBUCKET_CLONE_DIR/build'
                    API_TOKEN: $deployment_token​
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
              - pipe: microsoft/azure-static-web-apps-deploy:dev
                variables:
                    APP_LOCATION: '$BITBUCKET_CLONE_DIR'
                    API_LOCATION: '$BITBUCKET_CLONE_DIR/api'
                    OUTPUT_LOCATION: '$BITBUCKET_CLONE_DIR/dist'
                    API_TOKEN: $deployment_token​
    ```

    ---

1. Select **Commit**

### Configuration properties

The following configuration properties are used in the *.gitlab-cli.yml* file to configure your static web app.

The `$CI_PROJECT_DIR` variable maps to the repository's root folder location during the build process.

| Property | Description | Example | Required |
|--|--|--|--|
| app_location | Location of your application code. Enter `/` if your application source code is at the root of the repository, or `/app` if your application code is in a directory named `app`. | Yes |
| api_location | Location of your Azure Functions code. | Enter `/api` if your api code is in a folder named `api`. If no Azure Functions app is detected in the folder, the build doesn't fail, the workflow assumes you don't want an API. | No |
| output_location | Location of the build output directory relative to the app_location. | If your application source code is located at `/app`, and the build script outputs files to the `/app/build` folder, then set build as the output_location value. | No |

## View the website

There are two aspects to deploying a static app. The first step creates the underlying Azure resources that make up your app. The second is a Bitbucket workflow that builds and publishes your application.

Before you can navigate to your new static site, the deployment build must first finish running.

The Static Web Apps overview window displays a series of links that help you interact with your web app.

1. Return to your static web app in the Azure portal.
1. Navigate to the **Overview** window.
1. Select the link under the *URL* label. Your website will load in a new tab.

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance and all the associated services by removing the resource group.

1. Select the **static-web-apps-gitlab** resource group from the *Overview* section.
1. Select the **Delete resource group** button at the top of the resource group *Overview*.
1. Enter the resource group name **static-web-apps-gitlab** in the *Are you sure you want to delete "static-web-apps-gitlab"?* confirmation dialog.
1. Select **Delete**.

The process to delete the resource group may take a few minutes to complete.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)