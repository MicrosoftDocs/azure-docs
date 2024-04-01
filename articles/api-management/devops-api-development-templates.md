---
title: Use DevOps and CI/CD to publish APIs
description: Introduction to API DevOps with Azure API Management
services: api-management
author: dlepow
ms.service: api-management

ms.topic: conceptual
ms.date: 08/15/2022
ms.author: danlep
---

# Use DevOps and CI/CD to publish APIs

With the strategic value of APIs in the enterprise, adopting DevOps continuous integration (CI) and deployment (CD) techniques has become an important aspect of API development.  This article discusses the decisions you'll need to make to adopt DevOps principles for the management of APIs.

API DevOps consists of three parts:

:::image type="content" source="media/devops-api-development-templates/api-management-cicd-flow.png" alt-text="Diagram that illustrates API DevOps flow.":::

Each part of the API DevOps pipeline is discussed below.

## API definition

An API developer writes an API definition by providing a specification, settings (such as logging, diagnostics, and backend settings), and policies to be applied to the API. The API definition provides the information required to provision the API on an Azure API Management service. The specification may be based on a standards-based API specification (such as [WSDL][1], [OpenAPI][2], or [GraphQL][3]), or it may be defined using the Azure Resource Manager (ARM) APIs (for example, an ARM template describing the API and operations). The API definition will change over time and should be considered "source code". Ensure that the API definition is stored under source code control and has appropriate review before adoption.  

There are several tools to assist producing the API definition:

* The [Azure APIOps Toolkit][5] provides a workflow built on top of a [git][21] source code control system (such as [GitHub][22] or [Azure Repos][23]).  It uses an _extractor_ to produce an API definition that is then applied to a target API Management service by a _publisher_.  APIOps supports REST and GraphQL APIs at this time.
* The [dotnet-apim][6] tool converts a well-formed YAML definition into an ARM template for later deployment.  The tool is focused on REST APIs.
* [Terraform][7] is an alternative to Azure Resource Manager to configure resources in Azure.  You can create a Terraform configuration (together with policies) to implement the API in the same way that an ARM template is created.

You can also use IDE-based tools for editors such as [Visual Studio Code][8] to produce the artifacts necessary to define the API.  For instance, there are [over 30 plugins for editing OpenAPI specification files][9] on the Visual Studio Code Marketplace.  You can also use code generators to create the artifacts.  The [CADL language][10] lets you easily create high-level building blocks and then compile them into a standard API definition format such as OpenAPI.

## API approval

Once the API definition has been produced, the developer will submit the API definition for review and approval.  If using a git-based source code control system (such as [GitHub][22] or [Azure Repos][23]), the submission can be done via [Pull Request][11].  A pull request informs others of changes that have been proposed to the API definition.  Once the approval gates have been confirmed, an approver will merge the pull request into the main repository to signify that the API definition can be deployed to production.  The pull request process empowers the developer to remediate any issues found during the approval process.

Both GitHub and Azure Repos allow approval pipelines to be configured that run when a pull request is submitted.  You can configure the approval pipelines to run tools such as:

* API specification linters such as [Spectral][12] to ensure that the definition meets API standards required by the organization.  
* Breaking change detection using tools such as [openapi-diff][13].
* Security audit and assessment tools.  [OWASP maintains a list of tools][14] for security scanning.
* Automated API test frameworks such as [Newman][15], a test runner for [Postman collections][16].

> [!NOTE]
> Azure APIs must conform to a [strict set of guidelines][26] that you can use as a starting point for your own API guidelines.  There is a [Spectral configuration][27] for enforcing the guidelines.

Once the automated tools have been run, the API definition is reviewed by the human eye.  Tools won't catch all problems.  A human reviewer ensures that the API definition meets the organizational criteria for APIs, including adherence to security, privacy, and consistency guidelines.

## API publication

The API definition will be published to an API Management service through a release pipeline.  The tools used to publish the API definition depend on the tool used to produce the API definition:

* If using the [Azure APIOps Toolkit][5], the toolkit includes a publisher that writes the API definition to the target service.
* If using [dotnet-apim][6], the API definition is represented as an ARM template.  Tasks are available for [Azure Pipelines][17] and [GitHub Actions][18] to deploy an ARM template.
* If using [Terraform][7], CLI tools will deploy the API definition on your service.  There are tasks available for [Azure Pipelines][19] and [GitHub Actions][20].

> **Can I use other source code control and CI/CD systems?**
>
> Yes. The process described works with any source code control system (although APIOps does require that the source code control system is [git][21] based).  Similarly, you can use any CI/CD platform as long as it can be triggered by a check-in and run command line tools that communicate with Azure.

## Best practices

There's no industry standard for setting up a DevOps pipeline for publishing APIs, and none of the tools mentioned will work in all situations.  However, we see that most situations are covered by using a combination of the following tools and services:

* [Azure Repos][23] stores the API definitions in a [git][21] repository.
* [Azure Pipelines][17] runs the automated API approval and API publication processes.
* [Azure APIOps Toolkit][5] provides tools and workflows for publishing APIs.

We've seen the greatest success in customer deployments, and recommend the following practices:

* Set up either [GitHub][22] or [Azure Repos][23] for your source code control system.  This choice will determine your choice of pipeline runner as well.  GitHub can use [Azure Pipelines][17] or [GitHub Actions][18], whereas Azure Repos must use Azure Pipelines.
* Set up an Azure API Management service for each API developer so that they can develop API definitions along with the API service.  Use the consumption or developer SKU when creating the service.
* Use [policy fragments][24] to reduce the new policy that developers need to write for each API.
* Use [named values][29] and [backends][30] to ensure that policies are generic and can apply to any API Management instance.
* Use the [Azure APIOps Toolkit][5] to extract a working API definition from the developer service.
* Set up an API approval process that runs on each pull request.  The API approval process should include breaking change detection, linting, and automated API testing. 
* Use the [Azure APIOps Toolkit][5] publisher to publish the API to your production API Management service.

Review [Automated API deployments with APIOps][28] in the Azure Architecture Center for more details on how to configure and run a CI/CD deployment pipeline with APIOps.

## References

* [Azure DevOps Services][25] includes [Azure Repos][23] and [Azure Pipelines][17].
* [Azure APIOps Toolkit][5] provides a workflow for API Management DevOps.
* [Spectral][12] provides a linter for OpenAPI specifications.
* [openapi-diff][13] provides a breaking change detector for OpenAPI v3 definitions.
* [Newman][15] provides an automated test runner for Postman collections.

<!-- Links -->
[1]: https://www.w3.org/TR/wsdl20/
[2]: https://www.openapis.org/
[3]: https://graphql.org/learn/schema/
[4]: https://github.com/Azure/azure-api-management-devops-resource-kit
[5]: https://github.com/Azure/APIOps
[6]: https://github.com/mirsaeedi/dotnet-apim
[7]: https://www.terraform.io/
[8]: https://code.visualstudio.com/
[9]: https://marketplace.visualstudio.com/search?term=OpenAPI&target=VSCode&category=All%20categories&sortBy=Relevance
[10]: https://github.com/microsoft/cadl
[11]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests
[12]: https://stoplight.io/open-source/spectral
[13]: https://github.com/Azure/openapi-diff
[14]: https://owasp.org/www-community/api_security_tools
[15]: https://github.com/postmanlabs/newman
[16]: https://learning.postman.com/docs/getting-started/creating-the-first-collection/
[17]: ../azure-resource-manager/templates/deployment-tutorial-pipeline.md
[18]: https://github.com/marketplace/actions/deploy-azure-resource-manager-arm-template
[19]: https://marketplace.visualstudio.com/items?itemName=charleszipp.azure-pipelines-tasks-terraform
[20]: https://learn.hashicorp.com/tutorials/terraform/github-actions
[21]: https://git-scm.com/
[22]: https://github.com/
[23]: /azure/devops/repos/get-started/what-is-repos
[24]: ./policy-fragments.md
[25]: https://azure.microsoft.com/services/devops/
[26]: https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md
[27]: https://github.com/Azure/azure-api-style-guide
[28]: /azure/architecture/example-scenario/devops/automated-api-deployments-apiops
[29]: ./api-management-howto-properties.md
[30]: ./backends.md