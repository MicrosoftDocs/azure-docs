---
title: Use DevOps and CI/CD to Publish APIs
description: Introduction to API DevOps with Azure API Management
services: api-management
author: dlepow
ms.service: azure-api-management

ms.topic: concept-article
ms.date: 09/25/2025
ms.author: danlep
---

# Use DevOps and CI/CD to publish APIs

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

With the strategic value of APIs in the enterprise, adopting DevOps continuous integration (CI) and continuous deployment (CD) techniques has become an important aspect of API development. This article discusses the decisions you'll need to make to adopt DevOps principles for the management of APIs.

API DevOps consists of three parts:

:::image type="content" source="media/devops-api-development-templates/api-management-cicd-flow.png" alt-text="Diagram that illustrates API DevOps flow.":::

Each part of the API DevOps pipeline is discussed below.

## API definition

An API developer writes an API definition by providing a specification, settings (such as logging, diagnostics, and backend settings), and policies to be applied to the API. The API definition provides the information required to provision the API on an Azure API Management service. The specification might be based on a standards-based API specification (such as [WSDL](https://www.w3.org/TR/wsdl20/), [OpenAPI](https://www.openapis.org/), or [GraphQL](https://graphql.org/learn/schema/)), or it might be defined using the Azure Resource Manager (ARM) APIs (for example, an ARM template describing the API and operations). The API definition will change over time and should be considered "source code." Ensure that the API definition is stored under source code control and has appropriate review before adoption.

There are several tools to assist producing the API definition:

* The [Azure APIOps Toolkit](https://github.com/Azure/APIOps) provides a workflow built on top of a [git](https://git-scm.com/) source code control system (such as [GitHub](https://github.com/) or [Azure Repos](/azure/devops/repos/get-started/what-is-repos)). It uses an _extractor_ to produce an API definition that's then applied to a target API Management service by a _publisher_. APIOps supports REST and GraphQL APIs at this time.
* The [dotnet-apim](https://github.com/mirsaeedi/dotnet-apim) tool converts a well-formed YAML definition into an ARM template for later deployment. The tool is focused on REST APIs.
* [Terraform](https://developer.hashicorp.com/terraform) is an alternative to Azure Resource Manager to configure resources in Azure. You can create a Terraform configuration (together with policies) to implement the API in the same way that an ARM template is created.

You can also use IDE-based tools for editors such as [Visual Studio Code](https://code.visualstudio.com/) to produce the artifacts necessary to define the API. For instance, there are [more than 90 plugins for editing OpenAPI specification files](https://marketplace.visualstudio.com/search?term=OpenAPI&target=VSCode&category=All%20categories&sortBy=Relevance) on the Visual Studio Code Marketplace. You can also use code generators to create the artifacts. The [TypeSpec language](https://github.com/microsoft/typespec) lets you define cloud service APIs and shapes and is highly extensible, with primitives that can describe API shapes common among REST, OpenAPI, gRPC, and other protocols.

## API approval

Once the API definition is produced, the developer submits the API definition for review and approval. If using a git-based source code control system (such as [GitHub](https://github.com/) or [Azure Repos](/azure/devops/repos/get-started/what-is-repos)), the developer can submit via [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests). A pull request informs others of changes that have been proposed to the API definition. Once the approval gates are confirmed, an approver merges the pull request into the main repository to signify that the API definition can be deployed to production. The pull request process empowers the developer to remediate any issues found during the approval process.

Both GitHub and Azure Repos allow you to configure approval pipelines that run when a pull request is submitted. You can configure the approval pipelines to run tools such as:

* API specification linters such as [Spectral](https://stoplight.io/open-source/spectral) to ensure that the definition meets API standards required by the organization.
* Breaking change detection using tools such as [openapi-diff](https://github.com/Azure/openapi-diff).
* Security audit and assessment tools. [OWASP maintains a list of tools](https://owasp.org/www-community/api_security_tools) for security scanning.
* Automated API test frameworks.

> [!NOTE]
> Azure APIs must conform to a [strict set of guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md) that you can use as a starting point for your own API guidelines. There is a [Spectral configuration](https://github.com/Azure/azure-api-style-guide) for enforcing the guidelines.

Once the automated tools have run, the API definition is reviewed by the human eye. Tools won't catch all problems. A human reviewer ensures that the API definition meets the organizational criteria for APIs, including adherence to security, privacy, and consistency guidelines.

## API publication

The API definition is published to an API Management service through a release pipeline. The tools used to publish the API definition depend on the tool used to produce the API definition:

* If using the [Azure APIOps Toolkit](https://github.com/Azure/APIOps), the toolkit includes a publisher that writes the API definition to the target service.
* If using [dotnet-apim](https://github.com/mirsaeedi/dotnet-apim), the API definition is represented as an ARM template. Tasks are available for [Azure Pipelines](../azure-resource-manager/templates/deployment-tutorial-pipeline.md) and [GitHub Actions](https://github.com/marketplace/actions/deploy-azure-resource-manager-arm-template) to deploy an ARM template.
* If using [Terraform](https://developer.hashicorp.com/terraform), CLI tools deploy the API definition on your service. There are tasks available for [Azure Pipelines](https://marketplace.visualstudio.com/items?itemName=JasonBJohnson.azure-pipelines-tasks-terraform) and [GitHub Actions](https://developer.hashicorp.com/terraform/tutorials/automation/github-actions).

### Can I use other source code control and CI/CD systems?

Yes. The process described works with any source code control system (although APIOps does require that the source code control system is [git](https://git-scm.com/) based). Similarly, you can use any CI/CD platform as long as it can be triggered by a check-in and run command line tools that communicate with Azure.

## Best practices

There's no industry standard for setting up a DevOps pipeline for publishing APIs, and none of the tools mentioned will work in all situations. However, most situations are covered by using a combination of the following tools and services:

* [Azure Repos](/azure/devops/repos/get-started/what-is-repos) stores the API definitions in a [git](https://git-scm.com/) repository.
* [Azure Pipelines](../azure-resource-manager/templates/deployment-tutorial-pipeline.md) runs the automated API approval and API publication processes.
* [Azure APIOps Toolkit](https://github.com/Azure/azure-api-management-devops-resource-kit) provides tools and workflows for publishing APIs.

We've seen the greatest success in customer deployments by using the following practices:

* Set up either [GitHub](https://github.com/) or [Azure Repos](/azure/devops/repos/get-started/what-is-repos) for your source code control system. This choice determines your choice of pipeline runner as well. GitHub can use [Azure Pipelines](../azure-resource-manager/templates/deployment-tutorial-pipeline.md) or [GitHub Actions](https://github.com/marketplace/actions/deploy-azure-resource-manager-arm-template), whereas Azure Repos must use Azure Pipelines.
* Set up an Azure API Management service for each API developer so that they can develop API definitions along with the API service. Use the consumption or developer SKU when creating the service.
* Use [policy fragments](./policy-fragments.md) to reduce the new policy that developers need to write for each API.
* Use [named values](./api-management-howto-properties.md) and [backends](./backends.md) to ensure that policies are generic and can apply to any API Management instance.
* Use the [Azure APIOps Toolkit](https://github.com/Azure/APIOps) to extract a working API definition from the developer service.
* Set up an API approval process that runs on each pull request. The API approval process should include breaking change detection, linting, and automated API testing.
* Use the [Azure APIOps Toolkit](https://github.com/Azure/APIOps) publisher to publish the API to your production API Management service.

Review [Automated API deployments with APIOps](/azure/architecture/example-scenario/devops/automated-api-deployments-apiops) in the Azure Architecture Center for more details on how to configure and run a CI/CD deployment pipeline with APIOps.

## References

* [Azure DevOps Services](https://azure.microsoft.com/products/devops/) includes [Azure Repos](/azure/devops/repos/get-started/what-is-repos) and [Azure Pipelines](../azure-resource-manager/templates/deployment-tutorial-pipeline.md).
* [Azure APIOps Toolkit](https://github.com/Azure/APIOps) provides a workflow for API Management DevOps.
* [Spectral](https://stoplight.io/open-source/spectral) provides a linter for OpenAPI specifications.
* [openapi-diff](https://github.com/Azure/openapi-diff) provides a breaking change detector for OpenAPI v3 definitions.
