---
title: Using Azure Verified Modules (AVM) for the Service Catalog
description: Using Azure Verified Modules (AVM) for the Service Catalog
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: tutorial
ms.date: 01/31/2025
---

# Tutorial: Using Azure Verified Modules (AVM) for the Service Catalog

Azure Verified Modules (AVM) is a common codebase which is intended to standardize Infrastructure-as-Code templates for Azure resource creation.

In this tutorial, you will learn how to:

- ✅ Use AVM on new and existing Service Catalog templates
- ✅ Update an existing template to use a newer version of an AVM module
- ✅ Deploy the updated template to create Azure resources from the Portal

> [!IMPORTANT] Service Catalog templates can only be hosted by the AVE Service Catalog team currently so coordination with the AVE Service Catalog team is advised.

## Before you begin

AVM modules are currently written for Bicep and Terraform. Specifically for bicep, each AVM module is stored in the [Public Bicep Registry repository](https://github.com/Azure/bicep-registry-modules)

- To help author new and existing Service Catalog templates, use the [Bicep Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) to explore modules published in the Bicep Public Registry.
- If you're updating an existing Service Catalog template and if you haven't created a workload yet, please return to [Tutorial 3 - Create workloads in an enclave](./3-create-workloads-in-an-enclave.md).

## Leverage AVM for new and existing Service Catalog templates

Service Catalog deployment publishing in AVE leverages the [Custom Template Deployment experience using the Azure portal](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md). To leverage AVM on new or existing templates, refer to the steps below for more details.

> [!NOTE] For most Service Catalog templates, you'll mostly use resource templates which are prefixed by `'br/public:avm/res'`. There are other types of modules that are supported. For more information, refer to the [AVM Bicep Modules documentation](https://azure.github.io/Azure-Verified-Modules/indexes/bicep/).

1. When creating a new module, use the [VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) to explore the modules published in the Bicep Public Registry:

   ```bicep
   module myTestModule 'br/public:'
   ```

2. Expanding on this you can see the AVM modules that are published.

   ```bicep
   module myTestModule 'br/public:avm/res/'
   ```

3. Selecting the module expands on the current available versions.

   ```bicep
   module myTestModule 'br/public:avm/res/managed-identity/user-assigned-identity'
   ```

## Updating a template to use a newer version of an AVM

According to the [AVM guidance on transitioning to a new version](https://azure.github.io/Azure-Verified-Modules/faq/#whats-the-guidance-on-transitioning-to-new-module-versions), the [Public Bicep registry repository](https://github.com/Azure/bicep-registry-modules) uses tags to identify the version of each module. As a result, follow the steps below to update to a newer version of an AVM module.

1. Change the version of the AVM module declaration in the bicep file. *i.e. user-assigned-identity from **0.2.0** to **0.3.0**.
2. Check the module documentation for any version incompatibility issues.
3. If changes look good, proceed to testing it.

## Deploying resources to Azure via template deployment

If you want to test a new or existing template, one way to deploy resources is through the [Custom Template Deployment Experience](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).

Before running a Custom Template Deployment in the Portal, you will first need to compile your template, assuming it is written in bicep, into ARM. This can be done by running the following cmdlet.

```bash
az bicep build --file "<in-file>" --outfile "<out-file>"
```

> [!TIP] If you made an update to an existing Service Catalog template and want to deploy resources through the Service Catalog, please coordinate with someone on the AVE Service Catalog team so that the artifacts are available.

## Additional notes on testing in a regulated environment

> [!NOTE] Before testing in a regulated environment, make sure to run one of the steps outlined in [Deploying resources to Azure via template deployment](#deploying-resources-to-azure-via-template-deployment) as it will help avoid any dependencies on bicep, which might not be available in all environments.

If your bicep template references an AVM template by using `br/public:avm/res`, compiling will result in a ARM template with symbolic name resource deployments.

> [!IMPORTANT] Please refer to the [Public Bicep Registry repository](https://github.com/Azure/bicep-registry-modules) to identify the API versions of resources deployed by the AVM modules and confirm that these versions are supported in your target environment.

### Known issues

#### Support for symbolic name resources requires a minimum API version of '2020-09-01', but version '2020-06-01' was supplied.

This error has been encountered when attempting to deploy an AVM template into some environments using the **Custom Template Deployment** in the Portal.

- **Cause**: While the cause has not been identified yet, it might have something to do with the version of the custom template deployment that is being used in other environments. Other environments may have a version older than Azure public, where AVM templates deploy just fine.
- **Resolution**: You can still deploy the template from the command line using Az CLI or Azure PowerShell

  Azure PowerShell

  ```pwsh
  New-AzResourceGroupDeployment -ResourceGroupName "<rg-name>" -TemplateFile "<file-path>"
  ```

  Az CLI

  ```bash
  az deployment group create --resource-group "<rg-name>" --template-file "<file-path>"
  ```

## Limitations

- Given the way the Public Registry is implemented currently, it is not possible to publish child resources separate from its parent reosurces. As such, you cannot reference e.g. a `avm/res/key-vault/vault/key` module directly from the registry. Instead you can only deploy it through its parent `avm/res/key-vault/vault`. For more context, refer to the [AVM FAQs](https://azure.github.io/Azure-Verified-Modules/faq/#can-i-call-a-bicep-child-module-directly-eg-can-i-update-or-add-a-secret-in-an-existing-key-vault-or-a-route-in-an-existing-route-table).

## Learn more

- See [Azure Verified Modules](https://azure.github.io/Azure-Verified-Modules/) to learn more on Azure Verified Modules.
