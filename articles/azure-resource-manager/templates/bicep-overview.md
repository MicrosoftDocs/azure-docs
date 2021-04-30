---
title: Bicep language for Azure Resource Manager templates
description: Describes the Bicep language for deploying infrastructure to Azure through Azure Resource Manager templates.
ms.topic: conceptual
ms.date: 03/23/2021
---

# What is Bicep (Preview)?

Bicep is a language for declaratively deploying Azure resources. You can use Bicep instead of JSON for developing your Azure Resource Manager templates (ARM templates). Bicep simplifies the authoring experience by providing concise syntax, better support for code reuse, and improved type safety. Bicep is a domain-specific language (DSL), which means it's designed for a particular scenario or domain. It isn't intended as a general programming language for writing applications.

The JSON syntax for creating template can be verbose and require complicated expression. Bicep improves that experience without losing any of the capabilities of a JSON template. It's a transparent abstraction over the JSON for ARM templates. Each Bicep file compiles to a standard ARM template. Resource types, API versions, and properties that are valid in an ARM template are valid in a Bicep file. There are a few [known limitations](#known-limitations) in the current release.

Bicep is currently in preview. To track the status of the work, see the [Bicep project repository](https://github.com/Azure/bicep).

To learn about Bicep, see the following video.

> [!VIDEO https://www.youtube.com/embed/sc1kJfcRQgY]

## Get started

To start with Bicep, [install the tools](bicep-install.md).

After installing the tools, try the [Bicep tutorial](./bicep-tutorial-create-first-bicep.md). The tutorial series walks you through the structure and capabilities of Bicep. You deploy Bicep files, and convert an ARM template into the equivalent Bicep file.

To view equivalent JSON and Bicep files side by side, see the [Bicep Playground](https://aka.ms/bicepdemo).

If you have an existing ARM template that you would like to convert to Bicep, see [Converting ARM templates between JSON and Bicep](bicep-decompile.md).

## Benefits of Bicep versus other tools

Bicep provides the following advantages over other options:

* **Support for all resource types and API versions**: Bicep immediately supports all preview and GA versions for Azure services. As soon as a resource provider introduces new resources types and API versions, you can use them in your Bicep file. You don't have to wait for tools to be updated before using the new services.
* **Authoring experience**: When you use VS Code to create your Bicep files, you get a first-class authoring experience. The editor provides rich type-safety, intellisense, and syntax validation.
* **Modularity**: You can break your Bicep code into manageable parts by using [modules](bicep-modules.md). The module deploys a set of related resources. Modules enable you to reuse code and simplify development. Add the module to a Bicep file anytime you need to deploy those resources.
* **Integration with Azure services**: Bicep is integrated with Azure services such as Azure Policy, template specs, and Blueprints.
* **No state or state files to manage**: All state is stored in Azure. Users can collaborate and have confidence their updates are handled as expected. Use the [what-if operation](template-deploy-what-if.md) to preview changes before deploying your template.
* **No cost and open source**: Bicep is completely free. You don't have to pay for premium capabilities. It's also supported by Microsoft support.

## Bicep improvements

Bicep offers an easier and more concise syntax when compared to the equivalent JSON. You don't use `[...]` expressions. Instead, you directly call functions, and get values from parameters and variables. You give each deployed resource a symbolic name, which makes it easy to reference that resource in your template.

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

## Known limitations

The following limits currently exist:

* Can't set mode or batch size on copy loops.
* Can't combine loops and conditions.
* Single-line object and arrays, like `['a', 'b', 'c']`, aren't supported.

## FAQ

**Why create a new language instead of using an existing one?**

You can think of Bicep as a revision to the existing ARM template language rather than a new language. The syntax has changed, but the core functionality and runtime remain the same.

Before developing Bicep, we considered using an existing programming language. We decided our target audience would find it easier to learn Bicep rather than getting started with another language.

**Why not focus your energy on Terraform or other third-party Infrastructure as Code offerings?**

Different users prefer different configuration languages and tools. We want to make sure all of these tools provide a great experience on Azure. Bicep is part of that effort.

If you're happy using Terraform, there's no reason to switch. Microsoft is committed to making sure Terraform on Azure is the best it can be.

For customers who have selected ARM templates, we believe Bicep improves the authoring experience. Bicep also helps with the transition for customers who haven't adopted infrastructure as code.

**Is Bicep only for Azure?**

Bicep is a DSL focused on deploying complete solutions to Azure. Meeting that goal requires working with some APIs that are outside of Azure. We expect to provide extensibility points for those scenarios.

**What happens to my existing ARM templates?**

They continue to function exactly as they always have. You don't need to make any changes. We'll continue to support the underlying ARM template JSON language. Bicep files compile to JSON, and that JSON is sent to Azure for deployment.

When you're ready, you can [convert the JSON files to Bicep](bicep-decompile.md).

## Next steps

Get started with the [Bicep tutorial](./bicep-tutorial-create-first-bicep.md).
