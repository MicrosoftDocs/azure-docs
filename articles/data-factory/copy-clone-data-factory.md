---
title: Copy or clone a data factory in Azure Data Factory 
description: Learn how to copy or clone a data factory in Azure Data Factory
ms.service: data-factory
ms.subservice: data-movement
author: kromerm
ms.author: makromer
ms.reviewer: jburchel
ms.topic: conceptual
ms.date: 02/08/2023
---

# Copy or clone a data factory in Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article describes how to copy or clone a data factory in Azure Data Factory.

## Use cases for cloning a data factory

Here are some of the circumstances in which you may find it useful to copy or clone a data factory:

- **Move Data Factory** to a new region. If you want to move your Data Factory to a different region, the best way is to create a copy in the targeted region, and delete the existing one.

- **Renaming Data Factory**. Azure doesn't support renaming resources. If you want to rename a data factory, you can clone the data factory with a different name, and delete the existing one.

- **Debugging changes** when the debug features aren't sufficient. In most scenarios, you can use [Debug](iterative-development-debugging.md). In others, testing out changes in a cloned sandbox environment makes more sense. For instance, how your parameterized ETL pipelines would behave when a trigger fires upon file arrival versus over Tumbling time window, may not be easily testable through Debug alone. In these cases, you may want to clone a sandbox environment for experimenting. Since Azure Data Factory charges primarily by the number of runs, a second factory doesn't lead to any additional charges.

## How to clone a data factory

1. As a prerequisite, first you need to create your target data factory from the Azure portal.

1. If you are in GIT mode:
    1. Every time you publish from the portal, the factory's Resource Manager template is saved into GIT in the adf\_publish branch
    1. Connect the new factory to the _same_ repository and build from adf\_publish branch. Resources, such as pipelines, datasets, and triggers, will carry through

1. If you are in Live mode:
    1. Data Factory UI lets you export the entire payload of your data factory into a Resource Manager template file and a parameter file. They can be accessed from the **ARM template \ Export Resource Manager template** button in the portal.
    1. You may make appropriate changes to the parameter file and swap in new values for the new factory
    1. Next, you can deploy it via standard Resource Manager template deployment methods.

1. If you have a SelfHosted IntegrationRuntime in your source factory, you need to precreate it with the same name in the target factory. If you want to share the SelfHosted Integration Runtime between different factories, you can use the pattern published [here](create-shared-self-hosted-integration-runtime-powershell.md) on sharing SelfHosted IR.

1. For security reasons, the generated Resource Manager template won't contain any secret information, for example passwords for linked services. Hence, you need to provide the credentials as deployment parameters. If manually inputting credential isn't desirable for your settings, please consider retrieving the connection strings and passwords from Azure Key Vault instead. [See more](store-credentials-in-key-vault.md)

## Next steps

Review the guidance for creating a data factory in the Azure portal in [Create a data factory by using the Azure Data Factory UI](quickstart-create-data-factory-portal.md).
