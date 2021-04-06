---
title: include file
description: include file
services: azure-resource-manager
documentationcenter: ''
author: mumian
manager: dougeby
editor: ''

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: include
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 01/15/2019
ms.author: jgao
ms.custom: include file 
---

## Quickstarts and tutorials

Use the following quickstarts and tutorials to learn how to develop resource manager templates:

- Quickstarts

    |Title|Description|
    |------|-----|
    |[Use the Azure portal](../articles/azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md)|Generate a template using the portal, and understand the process of editing and deploying the template.|
    |[Use Visual Studio Code](../articles/azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md)|Use Visual Studio Code to create and edit templates, and how to use the Azure Cloud shell to deploy templates.|
    |[Use Visual Studio](../articles/azure-resource-manager/templates/create-visual-studio-deployment-project.md)|Use Visual Studio to create, edit, and deploy templates.|

- Tutorials

    |Title|Description|
    |------|-----|
    |[Utilize template reference](../articles/azure-resource-manager/templates/template-tutorial-use-template-reference.md)|Utilize the template reference documentation to develop templates. In the tutorial, you find the storage account schema, and use the information to create an encrypted storage account.|
    |[Create multiple instances](../articles/azure-resource-manager/templates/template-tutorial-create-multiple-instances.md)|Create multiple instances of Azure resources. In the tutorial, you create multiple instances of storage account.|
    |[Set resource deployment order](../articles/azure-resource-manager/templates/template-tutorial-create-templates-with-dependent-resources.md)|Define resource dependencies. In the tutorial, you create a virtual network, a virtual machine, and the dependent Azure resources. You learn how the dependencies are defined.|
    |[Use conditions](../articles/azure-resource-manager/templates/template-tutorial-use-conditions.md)|Deploy resources based on some parameter values. In the tutorial, you define a template to create a new storage account or use an existing storage account based on the value of a parameter.|
    |[Integrate key vault](../articles/azure-resource-manager/templates/template-tutorial-use-key-vault.md)|Retrieve secrets/passwords from Azure Key Vault. In the tutorial, you create a virtual machine.  The virtual machine administrator password is retrieved from a Key Vault.|
    |[Create linked templates](../articles/azure-resource-manager/templates/deployment-tutorial-linked-template.md)|Modularize templates, and call other templates from a template. In the tutorial, you create a virtual network, a virtual machine, and the dependent resources.  The dependent storage account is defined in a linked template. |
    |[Deploy virtual machine extensions](../articles/azure-resource-manager/templates/template-tutorial-deploy-vm-extensions.md)|Perform post-deployment tasks by using extensions. In the tutorial, you deploy a customer script extension to install web server on the virtual machine. |
    |[Deploy SQL extensions](../articles/azure-resource-manager/templates/template-tutorial-deploy-sql-extensions-bacpac.md)|Perform post-deployment tasks by using extensions. In the tutorial, you deploy a customer script extension to install web server on the virtual machine. |
    |[Secure artifacts](../articles/azure-resource-manager/templates/secure-template-with-sas-token.md)|Secure the artifacts needed to complete the deployments. In the tutorial, you learn how to secure the artifact used in the Deploy SQL extensions tutorial. |
    |[Use safe deployment practices](../articles/azure-resource-manager/templates/deployment-manager-tutorial.md)|Use Azure Deployment manager. |
    |[Tutorial: Troubleshoot Resource Manager template deployments](../articles/azure-resource-manager/templates/template-tutorial-troubleshoot.md)|Troubleshoot template deployment issues.|

These tutorials can be used individually, or as a series to learn the major Resource Manager template development concepts.