---
title: Deployment best practices 
description: Learn about the key mechanisms of deploying to Azure App Service. Find language-specific recommendations and other caveats.
keywords: azure app service, web app, deploy, deployment, pipelines, build
ms.assetid: bb51e565-e462-4c60-929a-2ff90121f41d
ms.topic: best-practice
ms.date: 01/17/2025
ms.custom: UpdateFrequency3
author: cephalin
ms.author: cephalin
#customer intent: As a build developer, I want to understand the components of deploying to Azure App Service to design the best build solution for the technologies we use in our project.
---

# Deployment best practices

[!INCLUDE [regionalization-note](./includes/regionalization-note.md)]

Every development team has unique requirements that can make implementing an efficient deployment pipeline difficult on any cloud service. This article introduces the three main components of deploying to Azure App Service: *deployment sources*, *build pipelines*, and *deployment mechanisms*. This article also covers some best practices and tips for specific language stacks.

## Deployment components

This section describes the three main components for deploying to App Service.

### Deployment source

A *deployment source* is the location of your application code. For production apps, the deployment source is usually a repository hosted by version control software such as [GitHub, Bitbucket, or Azure Repos](deploy-continuous-deployment.md). For development and test scenarios, the deployment source might be [a project on your local machine](deploy-local-git.md).

### Build pipeline

After you decide on a deployment source, your next step is to choose a *build pipeline*. A build pipeline reads your source code from the deployment source and runs a series of steps to get the application in a runnable state.

Steps can include compiling code, minifying HTML and JavaScript, running tests, and packaging components. The specific commands run by the build pipeline depend on your language stack. You can run these operations on a build server, such as Azure Pipelines, or locally.

### Deployment mechanism

The *deployment mechanism* is the action used to put your built application into the */home/site/wwwroot* directory of your web app. The */wwwroot* directory is a mounted storage location shared by all instances of your web app. When the deployment mechanism puts your application in this directory, your instances receive a notification to sync the new files.

App Service supports the following deployment mechanisms:

- Kudu endpoints: [Kudu](https://github.com/projectkudu/kudu/wiki) is the open-source developer productivity tool that runs as a separate process in Windows App Service. It runs as a second container in Linux App Service. Kudu handles continuous deployments and provides HTTP endpoints for deployment, such as [zipdeploy/](deploy-zip.md).
- FTP and WebDeploy: Using your [site or user credentials](deploy-configure-credentials.md), you can upload files [via FTP](deploy-ftp.md) or WebDeploy. These mechanisms don't go through Kudu.  

Deployment tools such as Azure Pipelines, Jenkins, and editor plugins use one of these deployment mechanisms.

## Use deployment slots

Whenever possible, when you deploy a new production build, use [deployment slots](deploy-staging-slots.md). With a Standard App Service Plan tier or better, you can deploy your app to a staging environment, validate your changes, and do smoke tests. When you're ready, swap your staging and production slots. The swap operation warms up the necessary worker instances to match your production scale, which eliminates downtime.

### Continuously deploy code

If your project has branches designated for testing, QA, and staging, each of those branches should be continuously deployed to a staging slot. This approach is known as the [Gitflow design](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). This design allows your stakeholders to easily assess and test the deployed branch.

Continuous deployment should never be enabled for your production slot. Instead, your production branch (often main) should be deployed onto a nonproduction slot. When you're ready to release the base branch, swap it into the production slot. Swapping into production, instead of deploying to production, prevents downtime and allows you to roll back the changes by swapping again.

:::image type="content" source="media/app-service-deploy-best-practices/slot_flow_code_diagam.png" alt-text="Diagram that shows the flow between the Dev, Staging, and Main branches and the slots they're deployed to.":::

### Continuously deploy containers

For custom containers from Docker or other container registries, deploy the image into a staging slot and swap into production to prevent downtime. The automation is more complex than code deployment. You must push the image to a container registry and update the image tag on the webapp.

For each branch you want to deploy to a slot, set up automation to do these tasks on each commit to the branch.

1. **Build and tag the image**. As part of the build pipeline, tag the image with the git commit ID, timestamp, or other identifiable information. It's best not to use the default *latest* tag. Otherwise, it's difficult to trace back what code is currently deployed, which makes debugging more difficult.
1. **Push the tagged image**. After the image is built and tagged, the pipeline pushes the image to the container registry. In the next step, the deployment slot pulls the tagged image from the container registry.
1. **Update the deployment slot with the new image tag**. When this property is updated, the site automatically restarts and pulls the new container image.

:::image type="content" source="media/app-service-deploy-best-practices/slot_flow_container_diagram.png" alt-text="Diagram shows slot usage visual representing Web App, Container Registry, and repository branches.":::

This article contains examples for common automation frameworks.

### Use Azure DevOps

App Service has [built-in continuous delivery](deploy-continuous-deployment.md) for containers through the Deployment Center. Navigate to your app in the [Azure portal](https://portal.azure.com). Under **Deployment**, select **Deployment Center**. Follow the instructions to select your repository and branch. This approach configures a DevOps build-and-release pipeline to automatically build, tag, and deploy your container when new commits are pushed to your selected branch.

### Use GitHub Actions

You can also automate your container deployment [with GitHub Actions](https://github.com/Azure/webapps-deploy). The workflow file builds and tags the container with the commit ID, pushes it to a container registry, and updates the specified web app with the new image tag.

```yaml
on:
  push:
    branches:
    - <your-branch-name>

name: Linux_Container_Node_Workflow

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    # checkout the repo
    - name: 'Checkout GitHub Action'
      uses: actions/checkout@main

    - uses: azure/docker-login@v1
      with:
        login-server: contoso.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}

    - run: |
        docker build . -t contoso.azurecr.io/nodejssampleapp:${{ github.sha }}
        docker push contoso.azurecr.io/nodejssampleapp:${{ github.sha }} 

    - uses: azure/webapps-deploy@v2
      with:
        app-name: 'node-rnc'
        publish-profile: ${{ secrets.azureWebAppPublishProfile }}
        images: 'contoso.azurecr.io/nodejssampleapp:${{ github.sha }}'
```

### Use other automation providers

The steps listed earlier apply to other automation utilities such as CircleCI or Travis CI. However, you need to use the Azure CLI to update the deployment slots with new image tags in the final step. To use the Azure CLI in your automation script, generate a Service Principal using the following command.

```azurecli
az ad sp create-for-rbac --name "myServicePrincipal" --role contributor \
   --scopes /subscriptions/{subscription}/resourceGroups/{resource-group} \
   --sdk-auth
```

In your script, sign in using `az login --service-principal`, providing the principal information. You can then use `az webapp config container set` to set the container name, tag, registry URL, and registry password. For more information, see [How to sign in to the Azure CLI on Circle CI](https://circleci.com/orbs/registry/orb/circleci/azure-cli).

## Language-specific considerations

Keep in mind the following considerations for Java, Node, and .NET implementations.

### Java

Use the Kudu [zipdeploy](deploy-zip.md) API for deploying JAR applications. Use [wardeploy](deploy-zip.md#deploy-warjarear-packages) for WAR apps. If you're using Jenkins, you can use those APIs directly in your deployment phase. For more information, see [Deploy to Azure App Service with Jenkins](/azure/developer/jenkins/deploy-to-azure-app-service-using-azure-cli).

### Node

By default, Kudu runs the build steps for your Node application (`npm install`). If you're using a build service such as Azure DevOps, the Kudu build is unnecessary. To disable the Kudu build, create an app setting, `SCM_DO_BUILD_DURING_DEPLOYMENT`, with a value of `false`.

### .NET

By default, Kudu runs the build steps for your .NET application (`dotnet build`). If you're using a build service such as Azure DevOps, the Kudu build is unnecessary. To disable the Kudu build, create an app setting, `SCM_DO_BUILD_DURING_DEPLOYMENT`, with a value of `false`.

## Other deployment considerations

Other considerations include local cache and high CPU or memory.

### Local cache

Azure App Service content is stored on Azure Storage and is surfaced up in a durable manner as a content share. However, some apps just need a high-performance, read-only content store that they can run with high availability. These apps can benefit from using *local cache*. For more information, see [Azure App Service Local Cache overview](overview-local-cache.md).

> [!NOTE]
> Local cache isn't recommended for content management sites such as WordPress.

To prevent downtime, always use local cache with [deployment slots](deploy-staging-slots.md). For information on using these features together, see [Best practices](overview-local-cache.md#best-practices-for-using-app-service-local-cache).

### High CPU or memory

If your App Service Plan is using over 90% of available CPU or memory, the underlying virtual machine might have trouble processing your deployment. When this situation happens, temporarily scale up your instance count to perform the deployment. After the deployment finishes, you can return the instance count to its previous value.

For more information, visit [App Service Diagnostics](./overview-diagnostics.md) to find out actionable best practices specific to your resource.

1. Navigate to your Web App in the [Azure portal](https://portal.azure.com).
1. Select **Diagnose and solve problems** in the left navigation, which opens App Service Diagnostics.
1. Choose **Availability and Performance** or explore other options, such as **High CPU Analysis**.

   View the current state of your app in regards to these best practices.

You can also use this link to directly open App Service Diagnostics for your resource: `https://portal.azure.com/?websitesextension_ext=asd.featurePath%3Ddetectors%2FParentAvailabilityAndPerformance#@microsoft.onmicrosoft.com/resource/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{siteName}/troubleshoot`.

## Related content

- [Environment variables and app settings reference](reference-app-settings.md)
