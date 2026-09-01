---
title: How to manage API Management configuration with APIOps CLI
description: Learn how to use APIOps CLI to extract, review, preview, and publish Azure API Management configuration.
services: api-management
ms.service: azure-api-management
ms.topic: how-to
ms.date: 08/31/2026
---

# How to manage API Management configuration with APIOps CLI

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

APIOps CLI is a configuration-as-code tool for Azure API Management. In this article, you use it to extract API Management configuration into local artifacts, review the artifacts in Git, preview changes, and publish approved artifacts to an API Management instance. The CLI can also scaffold GitHub Actions or Azure Pipelines files for an APIOps workflow.

<!-- The steps provide a minimal workflow that you can validate with a nonproduction API Management instance. For architecture and design guidance, see [Automated API deployments with APIOps](/azure/architecture/example-scenario/devops/automated-api-deployments-apiops). -->

Use this workflow to:

- Review API definitions, policies, and other API Management configuration through pull requests.
- Keep an auditable history of approved configuration changes.
- Promote reviewed artifacts between API Management environments.
- Start with configuration extracted from an existing instance or author CLI-compatible artifacts in code.

APIOps CLI supplements the API DevOps approaches described in [Use DevOps and CI/CD to publish APIs](devops-api-development-templates.md). Evaluate the CLI and your intended artifact workflow in a nonproduction environment before you use it for production deployments.

## Prerequisites

- [Node.js](https://nodejs.org/) version 22 or later.
- [Azure CLI](/cli/azure/install-azure-cli), for the local authentication steps in this article.
- An Azure subscription and an existing nonproduction API Management instance.
- A Git repository for your API Management artifacts.
- An identity with access to the API Management instance. The APIOps CLI getting-started guidance lists the **API Management Service Contributor** and **Reader** roles at the API Management resource scope for its extract and publish workflow.

For production automation, use separate, least-privilege identities when possible. An extraction identity needs read access to the source instance. A publishing identity needs only the permissions required to update the target instance.

## Install APIOps CLI

Install the `@azure-tools/apiops-cli` npm package:

```bash
npm install -g @azure-tools/apiops-cli
```

Verify the installed version:

```bash
apiops --version
```

Record and pin the version that you approve for your CI/CD pipelines. Review the [APIOps CLI changelog](https://github.com/Azure/apiops-cli/blob/main/CHANGELOG.md) before you upgrade.

## Authenticate to Azure

For local use, sign in with Azure CLI and select the subscription that contains your nonproduction API Management instance:

```azurecli
az login
az account set --subscription <subscription-id>
```

APIOps CLI uses `DefaultAzureCredential`. In addition to Azure CLI credentials, it supports environment credentials, workload identity, managed identity, Azure PowerShell, and Azure Developer CLI credentials.

For CI/CD, prefer workload identity federation or managed identity instead of a client secret. Never put credentials, access tokens, subscription keys, or secret named values in source control. For supported authentication options, see the [APIOps CLI authentication guide](https://github.com/Azure/apiops-cli/blob/main/docs/guides/authentication.md).

## Prepare an artifact repository

Run APIOps CLI commands from the root of the Git repository that contains your API Management artifacts.

To scaffold pipelines and configuration templates for GitHub Actions, run:

```bash
apiops init --ci github-actions --environments dev,prod --non-interactive
```

For Azure Pipelines, use:

```bash
apiops init --ci azure-devops --environments dev,prod --non-interactive
```

The command creates pipeline definitions, an extraction filter template, environment override templates, identity setup guidance, and an `apim-artifacts` directory. Review every generated file before you commit or enable a pipeline. Don't use `--force` in a repository with existing files unless you review the files that the command overwrites.

If you already have a repository and pipeline design, you can instead create or select an artifact directory and use the extract and publish commands directly.

## Create the initial artifacts

Choose one of the following approaches to establish the artifacts that your repository owns.

### Extract existing configuration

To create a baseline from an existing API Management instance, extract its configuration:

```bash
apiops extract \
  --subscription-id <source-subscription-id> \
  --resource-group <source-resource-group> \
  --service-name <source-apim-name> \
  --output ./apim-artifacts
```

The command creates JSON information files, XML policy files, and API specification files in a hierarchy under `apim-artifacts`. For a large instance, configure an [extraction filter](https://github.com/Azure/apiops-cli/blob/main/docs/guides/filtering-resources.md) so that the repository manages only the intended resources.

### Start with code-first artifacts

For a code-first workflow, add an OpenAPI specification and the required API Management information and policy files by using the [APIOps CLI artifact format](https://github.com/Azure/apiops-cli/blob/main/docs/reference/artifact-format.md). Don't assume that an existing application repository layout or an OpenAPI file by itself is ready for `apiops publish`.

If you're new to the artifact format, extract a small reference API from a nonproduction instance first. Use the resulting files as templates, and review the [code-first workflow guidance](https://github.com/Azure/apiops-cli/blob/main/docs/guides/code-first-workflow.md).

## Review the artifacts

Before you publish:

1. Inspect the generated or authored files and confirm that the repository contains only the resources that you intend to manage.
1. Review API specifications, policies, backends, named values, products, and their dependencies.
1. Remove environment-specific values that shouldn't move to another environment. Use reviewed [environment override files](https://github.com/Azure/apiops-cli/blob/main/docs/guides/environment-overrides.md) or Azure Key Vault references where appropriate.
1. Search for credentials and secret values. Extraction redacts supported secret fields and recognized policy patterns, but it might not detect every embedded secret. Don't commit secrets or unresolved `*** REDACTED ***` values.
1. Commit the artifacts to a branch and use a pull request for validation and approval.

## Preview a publish

Run a dry run against the nonproduction target instance. A dry run reports planned creates, updates, and deletions without applying them:

```bash
apiops publish \
  --subscription-id <target-subscription-id> \
  --resource-group <target-resource-group> \
  --service-name <target-apim-name> \
  --source ./apim-artifacts \
  --dry-run
```

Review the output and resolve unexpected changes or missing dependencies. A successful dry run doesn't replace testing of API behavior, policies, permissions, or backend connectivity.

> [!CAUTION]
> Don't add `--delete-unmatched` to your first workflow. That option deletes resources in the target instance that aren't represented in the source artifacts.

## Publish the reviewed artifacts

After the pull request is approved and the dry run succeeds, publish the same reviewed artifacts to the nonproduction target:

```bash
apiops publish \
  --subscription-id <target-subscription-id> \
  --resource-group <target-resource-group> \
  --service-name <target-apim-name> \
  --source ./apim-artifacts
```

Validate the APIs and policies in the target instance after publishing. When you automate this workflow, configure the pipeline to publish an approved commit and protect deployment environments with your organization's required checks and approvals.

## Next steps

- Review the [APIOps CLI getting-started guide](https://github.com/Azure/apiops-cli/blob/main/docs/getting-started.md).
- Learn about [APIOps CLI commands and CI/CD integration](https://github.com/Azure/apiops-cli/blob/main/docs/README.md).
- Learn how to [Use DevOps and CI/CD to publish APIs](devops-api-development-templates.md).
