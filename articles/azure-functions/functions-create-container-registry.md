---
title: Create Azure Functions in a local Linux container
description: Get started with Azure Functions by creating a containerized function app on your local computer and publishing the image to a container registry.
ms.date: 06/23/2023
ms.topic: how-to
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: programming-languages-set-functions
---

# Create a function app in a local Linux container 

This article shows you how to use Azure Functions Core tools to create your first function in a Linux container on your local computer, verify the function locally, and then publish the containerized function to a container registry. From a container registry, you can easily deploy your containerized functions to Azure. 

For a complete example of deploying containerized functions to Azure, which include the steps in this article, see one of the following articles:

+ [Create your first containerized Azure Functions on Azure Container Apps](functions-deploy-container-apps.md)
+ [Create your first containerized Azure Functions](functions-deploy-container.md)
+ [Create your first containerized Azure Functions on Azure Arc (preview)](create-first-function-arc-custom-container.md)

You can also create a function app in the Azure portal by using an existing containerized function app from a container registry. For more information, see [Azure portal create using containers](functions-how-to-custom-container.md#azure-portal-create-using-containers). 

[!INCLUDE [functions-create-container-registry](../../includes/functions-create-container-registry.md)]

## Next steps

> [!div class="nextstepaction"]  
> [Working with containers and Azure Functions](./functions-how-to-custom-container.md)  
