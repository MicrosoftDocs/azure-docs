---
title: Launch your first Java application in Azure Container Apps with Github Repository
description: Learn how to deploy a java project in Azure Container Apps with Github Repository.
services: container-apps
author: hangwan
ms.service: azure-container-apps
ms.custom: devx-track-extended-java
ms.topic: quickstart
ms.date: 12/18/2024
ms.author: hangwan
---

# Quickstart: Launch your first Java application in Azure Container Apps with Github Repository

This article shows you how to deploy the Spring PetClinic sample application to run on Azure Container Apps with Github Repository. You can deploy your Java application with many different options like local filesystem, code reposity, Maven, IDEs, a web application archive (WAR) file / Java Archive (JAR) file or even directly from the source code.

By the end of this tutorial you deploy a web application, which you can manage through the Azure portal.

The following image is a screenshot of how your application looks once deployed to Azure.

:::image type="content" source="media/java-deploy-war-file/azure-container-apps-petclinic-warfile.png" alt-text="Screenshot of petclinic app.":::

## Prerequisites

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).<br><br>You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml?tabs=current) for details. |
| GitHub Account | Get one for [free](https://github.com/join). |
| git | [Install git](https://git-scm.com/downloads) |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|
| Container Apps CLI extension | Use version `0.3.47` or higher. Use the `az extension add --name containerapp --upgrade --allow-preview` command to install the latest version. |

## Prepare the project

In a browser window, go to the GitHub reposity for [Java samples for Azure Container Apps](https://github.com/Azure-Samples/azure-container-apps-java-samples.git), and fork the reposity.

Select the `Fork` button at the top of the repo to fork the repo to your account. Then copy the repo URL to use it in the next step.

## Deploy the project

You can define the environment variables that are used throughout this article.

```bash
export RESOURCE_GROUP="petclinic-containerapps"
export LOCATION="canadacentral"
export ENVIRONMENT="env-petclinic-containerapps"
export CONTAINER_APP_NAME="petclinic"
```

If you haven't sign in to Azure from CLI, check the [Setup](quickstart-code-to-cloud.md?tabs=bash%2Cjava#setup) section of [Build and deploy from local source code to Azure Container Apps](quickstart-code-to-cloud.md) for more details.

Build and deploy your first Spring Boot app with the `containerapp up` command.

This command will:

 - Create the resource group.
 - Create an Azure Container Registry.
 - Build the container image and push it to the registry.
 - Create the Container Apps environment with a Log Analytics workspace.
 - Create and deploy the container app using the built container image.

 ```azurecli
az containerapp up \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $ENVIRONMENT \
  --context-path ./spring-petclinic \
  --repo <YOUR_GITHUB_REPOSITORY_NAME>
```

When you push new code to the repository, the GitHub Action will:

- Build the container image and push it to the Azure Container Registry
- Deploy the container image to the created container app

## Verify app status

Once the deployment is done, you can go to the overview page of your container app and click on the **Application Url**, you should be able to see the project running on the cloud.

:::image type="content" source="media/java-deploy-war-file/validation.png" alt-text="Screenshot of validation.":::

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When you no longer need the resources, you can clean up unnecessary resources to avoid Azure charges.

```azurecli
az group delete --name $RESOURCE_GROUP
```

## Next steps

> [!div class="nextstepaction"]
> [Launch your first Java microservice application with managed Java components](java-microservice-get-started.md)
> [Launch your first Java AI application](first-java-ai-application.md)
> [Java build environment variables](java-build-environment-variables.md)

