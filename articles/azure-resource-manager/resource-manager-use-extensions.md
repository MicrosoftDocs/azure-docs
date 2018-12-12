---
title: Provide post-deployment configurations by using extensions | Microsoft Docs
description: Learn how to use extensions to provide post-deployment configurations.
services: azure-resource-manager
documentationcenter: na
author: mumian
editor: ''

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/12/2018
ms.author: jgao

---
# Provide post-deployment configurations by using extensions

With Resource Manager, you can create a template (in JSON format) that defines the infrastructure and configuration of your Azure solution. By using a template, you can repeatedly deploy your solution throughout its lifecycle and have confidence your resources are deployed in a consistent state.

## Template structure

The template consists of JSON and expressions that you can use to construct values for your deployment. To understand the different sections of a template and the properties that are available in those sections, see [Template structure](./resource-group-authoring-templates.md).

## Template reference

Before creating a template to deploy an Azure resource, you need to know the template schema of the resource. The schema information can be found from the [template reference](https://docs.microsoft.com/azure/templates/). To learn how to use the reference, see [Utilize template reference](./resource-manager-tutorial-create-encrypted-storage-accounts.md). You can also find the schema information using the [Azure Resource Explorer (Preview)](https://resources.azure.com/).

## Template samples

Most users choose creating a template by modifying an existing template.  [Azure Quickstart templates](https://azure.microsoft.com/resources/templates) has a good collection of samples. You can also generate a template by using the Azure portal.  For a tutorial, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](./resource-manager-quickstart-create-templates-use-the-portal.md).

## Create templates

The most popular template authoring tools are Visual Studio Code and Visual Studio. For more information, see:

- [Quickstart: Create Azure Resource Manager templates by using Visual Studio Code](./resource-manager-quickstart-create-templates-use-visual-studio-code.md)
- [Quickstart: Creating and deploying Azure resource groups through Visual Studio](./vs-azure-tools-resource-groups-deployment-projects-create-deploy.md)

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](./resource-manager-quickstart-create-templates-use-the-portal.md)
