---
title: CI/CD for Azure API Management using ARM templates
description: Introduction to API DevOps with Azure API Management, using Azure Resource Manager templates to manage API deployments in a CI/CD pipeline
services: api-management
author: miaojiang
ms.service: api-management

ms.topic: conceptual
ms.date: 10/09/2020
ms.author: apimpm
---

# CI/CD for API Management using Azure Resource Manager templates

This article shows you how to use API DevOps with Azure API Management, through Azure Resource Manager templates. With the strategic value of APIs, a continuous integration and continuous deployment (CI/CD) pipeline has become an important aspect of API development. It allows organizations to automate deployment of API changes without error-prone manual steps, detect issues earlier, and ultimately deliver value to users faster. 

For details, tools, and code samples to implement the DevOps approach described in this article, see the open-source [Azure API Management DevOps Resource Kit](https://github.com/Azure/azure-api-management-devops-resource-kit) in GitHub. Because customers bring a wide range of engineering cultures and existing automation solutions, the approach isn't a one-size-fits-all solution.

## The problem

Organizations today normally have multiple deployment environments (such as development, testing, and production) and use separate API Management instances for each environment. Some instances are shared by multiple development teams, who are responsible for different APIs with different release cadences.

As a result, customers face the following challenges:

* How to automate deployment of APIs into API Management
* How to migrate configurations from one environment to another
* How to avoid interference between different development teams that share the same API Management instance

## Manage configurations in Resource Manager templates

The following image illustrates the proposed approach. 

:::image type="content" source="media/devops-api-development-templates/apim-devops.png" alt-text="Diagram that illustrates DevOps with API Management.":::

In this example, there are two deployment environments: *Development* and *Production*. Each has its own API Management instance. 

* API developers have access to the Development instance and can use it for developing and testing their APIs. 
* A designated team called the *API publishers* manages the Production instance.

The key in this proposed approach is to keep all API Management configurations in [Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md). The organization should keep these templates in a source control system such as Git. As illustrated in the image, a Publisher repository contains all configurations of the Production API Management instance in a collection of templates:

|Template  |Description  |
|---------|---------|
|Service template     | Service-level configurations of the API Management instance, such as pricing tier and custom domains.         |
|Shared templates     |  Shared resources throughout an API Management instance, such as groups, products, and loggers.    |
|API templates     |  Configurations of APIs and their subresources: operations, policies, diagnostic settings.        |
|Master (main) template     |   Ties everything together by [linking](../azure-resource-manager/resource-group-linked-templates.md) to all templates and deploying them in order. To deploy all configurations to an API Management instance, deploy the main template. You can also deploy each template individually.       |

API developers will fork the Publisher repository to a Developer repository and work on the changes for their APIs. In most cases, they focus on the API templates for their APIs and don't need to change the shared or service templates.

## Migrate configurations to templates
API developers face challenges when working with Resource Manager templates:

* API developers often work with the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification) and might not be familiar with Resource Manager schemas. Authoring templates manually might be error-prone. 

   A tool called [Creator](https://github.com/Azure/azure-api-management-devops-resource-kit/blob/master/src/APIM_ARMTemplate/README.md#Creator) in the resource kit can help automate the creation of API templates based on an Open API Specification file. Additionally, developers can supply API Management policies for an API in XML format. 

* For customers who are already using API Management, another challenge is to extract existing configurations into Resource Manager templates. For those customers, a tool called [Extractor](https://github.com/Azure/azure-api-management-devops-resource-kit/blob/master/src/APIM_ARMTemplate/README.md#extractor) in the resource kit can help generate templates by extracting configurations from their API Management instances.  

## Workflow

* After API developers have finished developing and testing an API, and have generated the API templates, they can submit a pull request to merge the changes to the publisher repository. 

* API publishers can validate the pull request and make sure the changes are safe and compliant. For example, they can check if only HTTPS is allowed to communicate with the API. Most validations can be automated as a step in the CI/CD pipeline.

* Once the changes are approved and merged successfully, API publishers can choose to deploy them to the Production instance either on schedule or on demand. The deployment of the templates can be automated using [GitHub Actions](https://github.com/Azure/apimanagement-devops-samples), [Azure Pipelines](/azure/devops/pipelines), [Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md), [Azure CLI](../azure-resource-manager/templates/deploy-cli.md), or other tools.


With this approach, an organization can automate the deployment of API changes into API Management instances, and it's easy to promote changes from one environment to another. Because different API development teams will be working on different sets of API templates and files, it prevents interference between different teams.

## Video

> [!VIDEO https://www.youtube.com/embed/4Sp2Qvmg6j8]

## Next steps

- See the open-source [Azure API Management DevOps Resource Kit](https://github.com/Azure/azure-api-management-devops-resource-kit) for additional information, tools, and sample templates.