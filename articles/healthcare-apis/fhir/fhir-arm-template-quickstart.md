---
title: Deploy Azure Healthcare APIs FHIR service using ARM template
description: Learn how to deploy the FHIR service by using an Azure Resource Manager template (ARM template)
author: ginalee-dotcom
ms.service: healthcare-apis
ms.author: zxue
ms.date: 07/22/2021
---

# Deploy a FHIR service within Azure Healthcare APIs - using ARM template

In this article, you will learn how to deploy the FHIR service within the Azure Healthcare APIs using the Azure Resource Manager template (ARM template). We provide you two options, using PowerShell or using CLI.

An [ARM template](../../azure-resource-manager/templates/overview.md) is a JSON file that defines the infrastructure and configuration for your project. The template uses declarative syntax. In declarative syntax, you describe your intended deployment without writing the sequence of programming commands to create the deployment.

## Prerequisites

# [Portal](#tab/PowerShell)

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
* If you want to run the code locally:
    * [Azure PowerShell](https://review.docs.microsoft.com/en-us/powershell/azure/install-az-ps).

# [CLI](#tab/CLI)

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
* If you want to run the code locally:
    * A Bash shell (such as Git Bash, which is included in [Git for Windows](https://gitforwindows.org)).
    * [Azure CLI](/cli/azure/install-azure-cli).

## Review the template

The template used in this article is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azure-api-for-fhir/).