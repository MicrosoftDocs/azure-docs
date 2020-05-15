---
title: Copy or clone a data factory in Azure Data Factory 
description: Learn how to copy or clone a data factory in Azure Data Factory
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
author: djpmsft
ms.author: daperlov
manager: jroth
ms.reviewer: maghan
ms.topic: conceptual
ms.date: 01/09/2019
---

# Copy or clone a data factory in Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article describes how to copy or clone a data factory in Azure Data Factory.

## Use cases for cloning a data factory

Here are some of the circumstances in which you may find it useful to copy or clone a data factory:

-   **Renaming resources**. Azure doesn't support renaming resources. If you want to rename a data factory, you can clone the data factory with a different name, and then delete the existing one.

-   **Debugging changes** when the debug features aren't sufficient. Sometimes to test your changes, you may want to test your changes in a different factory before applying them to your main one. In most scenarios, you can use Debug. Changes in triggers, however, such as how your changes behave when a trigger is invoked automatically, or over a time window, may not be testable easily without checking in. In these cases, cloning the factory and applying your changes there makes a lot of sense. Since Azure Data Factory charges primarily by the number of runs, the second factory does not lead to any additional charges.

## How to clone a data factory

1. The Data Factory UI in the Azure portal lets you export the entire payload of your data factory into a Resource Manager template, along with a parameter file that lets you change any values you want to change when you clone your factory.

1. As a prerequisite, you need to create your target data factory from the Azure portal.

1. If you have a SelfHosted IntegrationRuntime in your source factory, you need to precreate it with the same name in the target factory. If you want to share the SelfHosted IRs between different factories, you can use the pattern published [here](source-control.md#best-practices-for-git-integration).

1. If you are in GIT mode, every time you publish from the portal, the factory's Resource Manager template is saved into GIT in the adf_publish branch of the repository.

1. For other scenarios, the Resource Manager template can be downloaded by clicking on the **Export Resource Manager template** button in the portal.

1. After you download the Resource Manager template, you can deploy it via standard Resource Manager template deployment methods.

1. For security reasons, the generated Resource Manager template does not contain any secret information, such as passwords for linked services. As a result, you have to provide these passwords as deployment parameters. If providing parameters is not desirable, you have to obtain the connection strings and passwords of the linked services from Azure Key Vault.

## Next steps

Review the guidance for creating a data factory in the Azure portal in [Create a data factory by using the Azure Data Factory UI](quickstart-create-data-factory-portal.md).
