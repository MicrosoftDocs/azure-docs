---
title: Create and access an environment
titleSuffix: Azure Deployment Environments
description: Learn how to create and access an environment in an Azure Deployment Environments Preview project.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.custom: ignite-2022
ms.topic: quickstart
ms.date: 10/26/2022
---

# Quickstart: Create and access an environment

This quickstart shows you how to create and access an [environment](concept-environments-key-concepts.md#environments) in an existing Azure Deployment Environments Preview project.

Only a user who has the [Deployment Environments User](how-to-configure-deployment-environments-user.md) role, the [DevCenter Project Admin](how-to-configure-project-admin.md) role, or a [built-in role](../role-based-access-control/built-in-roles.md) that has appropriate permissions can create an environment.

In this quickstart, you learn how to:

> [!div class="checklist"]
>
> - Create an environment
> - Access an environment

> [!IMPORTANT]
> Azure Deployment Environments currently is in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- [Create and configure a dev center](quickstart-create-and-configure-devcenter.md).
- [Create and configure a project](quickstart-create-and-configure-projects.md).

## Create an environment

1. Sign in to the [developer portal](https://devportal.microsoft.com).
1. From the **New** menu at the top right, select **New environment**.
   :::image type="content" source="media/quickstart-create-access-environments/new-environment.png" alt-text="Screenshot showing the new menu with new environment highlighted.":::
1. In the Add an environment pane, select the following information:

   |Field  |Value  |
   |---------|---------|
   |Name     | Enter a descriptive name for your environment. |
   |Project  | Select the project you want to create the environment in. If you have access to more than one project, you'll see a list of the available projects. |
   |Type     | Select the environment type you want to create. If you have access to more than one environment type, you'll see a list of the available types. |
   |Catalog item | Select the catalog item you want to use to create the environment. You'll see a list of the catalog items available from the catalogs associated with your dev center. |

1. Select **Create**.

You'll see your environment in the developer portal when it's created.

## Access an environment in Azure portal
To verify that your environment has been created as expected, you can view it in the Azure portal.

1. Sign in to the [developer portal](https://devportal.microsoft.com).
1. On the environment that you want to verify, select the **environment resources** link.
   :::image type="content" source="media/quickstart-create-access-environments/environment-resources.png" alt-text="Screenshot showing an environment card, with the environment resources link highlighted."::: 
1. You'll see the resource in your environment listed.
   :::image type="content" source="media/quickstart-create-access-environments/azure-portal-view-of-environment.png" alt-text="Screenshot showing Azure portal list of environment resources.":::
### Troubleshoot permission error

You must have the [Deployment Environments User](how-to-configure-deployment-environments-user.md) role, the [DevCenter Project Admin](how-to-configure-project-admin.md) role, or a [built-in role](../role-based-access-control/built-in-roles.md) that has appropriate permissions can create an environment.

If you don't have the correct permissions, creation of the environment will fail, and you may receive an error message like this:

```
(EnvironmentNotFound) The environment resource was not found.
Code: EnvironmentNotFound
Message: The environment resource was not found.
```

To resolve the issue, assign the correct permissions: [Give project access to the development team](quickstart-create-and-configure-projects.md#give-project-access-to-the-development-team).

## Access an environment

To access an environment:

1. List existing environments that are available in a specific project:

   ```azurecli
    az devcenter dev environment list --dev-center <devcenter-name> --project-name <project-name>
   ```  

1. View the access endpoints to various resources as defined in the ARM template outputs.
1. Access the specific resources by using the endpoints.

## Next steps

- Learn how to [add and configure a catalog](how-to-configure-catalog.md).
- Learn how to [add and configure a catalog item](configure-catalog-item.md).
