---
title: Bicep language for deploying Azure resources
description: Describes the Bicep language for deploying infrastructure to Azure. It provides an improved authoring experience over using JSON to develop templates.
ms.topic: conceptual
ms.date: 07/30/2021
---

# What is Bicep?

Bicep is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. It provides concise syntax, reliable type safety, and support for code reuse. We believe Bicep offers the best authoring experience for your infrastructure-as-code solutions in Azure.

You can use Bicep instead of JSON to develop your Azure Resource Manager templates (ARM templates). The JSON syntax to create an ARM template can be verbose and require complicated expressions. Bicep syntax reduces that complexity and improves the development experience. Bicep is a transparent abstraction over ARM template JSON and doesn't lose any of the JSON template capabilities. During deployment, the Bicep CLI converts a Bicep file into ARM template JSON.

Bicep isn't intended as a general programming language to write applications. A Bicep file declares Azure resources and resource properties, without writing a sequence of programming commands to create resources.

Resource types, API versions, and properties that are valid in an ARM template are valid in a Bicep file.

To track the status of the Bicep work, see the [Bicep project repository](https://github.com/Azure/bicep).

To learn about Bicep, see the following video.

> [!VIDEO https://www.youtube.com/embed/sc1kJfcRQgY]

## Get started

To start with Bicep:

1. **Install the tools**. See [Set up Bicep development and deployment environments](./install.md). Or, you can use the [VS Code Devcontainer/Codespaces repo](https://github.com/Azure/vscode-remote-try-bicep) to get a pre-configured authoring environment.
2. **Complete the [quickstart](./quickstart-create-bicep-use-visual-studio-code.md) and the [Microsoft Learn Bicep modules](./learn-bicep.md)**.

To decompile an existing ARM template to Bicep, see [Decompile ARM templates to Bicep](./decompile.md). You can use [Bicep Playground](https://bicepdemo.z22.web.core.windows.net/) to view Bicep and equivalent JSON side by side.

Bicep examples can be found in the [Bicep GitHub repo](https://github.com/Azure/bicep/tree/main/docs/examples).

## Benefits of Bicep versus other tools

Bicep provides the following advantages over other options:

- **Support for all resource types and API versions**: Bicep immediately supports all preview and GA versions for Azure services. As soon as a resource provider introduces new resources types and API versions, you can use them in your Bicep file. You don't have to wait for tools to be updated before using the new services.
- **Simple syntax**: When compared to the equivalent JSON template, Bicep files are more concise and easier to read. Bicep requires no previous knowledge of programming languages. Bicep syntax is declarative and specifies which resources and resource properties you want to deploy.
- **Authoring experience**: When you use VS Code to create your Bicep files, you get a first-class authoring experience. The editor provides rich type-safety, intellisense, and syntax validation.
- **Modularity**: You can break your Bicep code into manageable parts by using [modules](./modules.md). The module deploys a set of related resources. Modules enable you to reuse code and simplify development. Add the module to a Bicep file anytime you need to deploy those resources.
- **Integration with Azure services**: Bicep is integrated with Azure services such as Azure Policy, template specs, and Blueprints.
- **No state or state files to manage**: All state is stored in Azure. Users can collaborate and have confidence their updates are handled as expected. Use the [what-if operation](./deploy-what-if.md) to preview changes before deploying your template.
- **No cost and open source**: Bicep is completely free. You don't have to pay for premium capabilities. It's also supported by Microsoft support.

## Bicep improvements

Bicep offers an easier and more concise syntax when compared to the equivalent JSON. You don't use bracketed expressions `[...]`. Instead, you directly call functions, and get values from parameters and variables. You give each deployed resource a symbolic name, which makes it easy to reference that resource in your template.

For example, the following JSON returns an output value from a resource property.

```json
"outputs": {
  "hostname": {
      "type": "string",
      "value": "[reference(resourceId('Microsoft.Network/publicIPAddresses', variables('publicIPAddressName'))).dnsSettings.fqdn]"
    },
}
```

The equivalent output expression in Bicep is easier to write. The following example returns the same property by using the symbolic name **publicIP** for a resource that is defined within the template:

```bicep
output hostname string = publicIP.properties.dnsSettings.fqdn
```

For a full comparison of the syntax, see [Comparing JSON and Bicep for templates](compare-template-syntax.md).

Bicep automatically manages dependencies between resources. You can avoid setting `dependsOn` when the symbolic name of a resource is used in another resource declaration.

The structure of the Bicep file is more flexible than the JSON template. You can declare parameters, variables, and outputs anywhere in the file. In JSON, you have to declare all parameters, variables, and outputs within the corresponding sections of the template.

## FAQ

**Why create a new language instead of using an existing one?**

You can think of Bicep as a revision to the existing ARM template language rather than a new language. The syntax has changed, but the core functionality and runtime remain the same.

Before developing Bicep, we considered using an existing programming language. We decided our target audience would find it easier to learn Bicep rather than getting started with another language.

**Why not focus your energy on Terraform or other third-party Infrastructure as Code offerings?**

Different users prefer different configuration languages and tools. We want to make sure all of these tools provide a great experience on Azure. Bicep is part of that effort.

If you're happy using Terraform, there's no reason to switch. Microsoft is committed to making sure Terraform on Azure is the best it can be.

For customers who have selected ARM templates, we believe Bicep improves the authoring experience. Bicep also helps with the transition for customers who haven't adopted infrastructure as code.

**Is this ready for production use?**

Yes. Starting with version 0.3, Bicep is supported by Microsoft support plans. Bicep has parity with what can be accomplished with ARM Templates. There are no breaking changes that are currently planned, but it's possible we'll need to create breaking changes in the future.

**Is Bicep only for Azure?**

Currently, we aren't planning for Bicep to extend beyond Azure. We want to fully support Azure and optimize the deployment experience.

Meeting that goal requires working with some APIs that are outside of Azure. We expect to provide extensibility points for those scenarios.

**What happens to my existing ARM templates?**

They continue to function exactly as they always have. You don't need to make any changes. We'll continue to support the underlying ARM template JSON language. Bicep files compile to JSON, and that JSON is sent to Azure for deployment.

When you're ready, you can [decompile the JSON files to Bicep](./decompile.md).

## Known limitations

- No support for single-line object and arrays. For example, `['a', 'b', 'c']` isn't supported. For more information, see [Arrays](data-types.md#arrays) and [Objects](data-types.md#objects).
- No support for breaking long lines into multiple lines. For example:

    ```bicep
    resource sa 'Microsoft.Storage/storageAccounts@2019-06-01' = if (newOrExisting == 'new') {
      ...
    }
    ```

    Can't be written as:

    ```bicep
    resource sa 'Microsoft.Storage/storageAccounts@2019-06-01' =
        if (newOrExisting == 'new') {
          ...
        }
    ```

- No support for the concept of apiProfile, which is used to map a single apiProfile to a set apiVersion for each resource type.
- No support for user-defined functions.

## Next steps

Get started with the [Quickstart](./quickstart-create-bicep-use-visual-studio-code.md).
