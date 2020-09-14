---
title: "How to - Use permissions in Azure Spring Cloud"
description: Describes roles and permissions in Azure Spring Cloud.
author: MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: how-to
ms.date: 09/04/2020
ms.custom: devx-track-java
---

# How to use permissions in Azure Spring Cloud
You can create custom roles to delegate permissions to Azure Spring Cloud resources. Custom roles augment [built-in roles that Azure provides](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles) with various stock permissions.

There are three methods of define a custom permission:
* [Clone a role](https://docs.microsoft.com/azure/role-based-access-control/custom-roles-portal#clone-a-role)
* [Start from scratch](https://docs.microsoft.com/azure/role-based-access-control/custom-roles-portal#start-from-scratch)
* [Start from JSON](https://docs.microsoft.com/azure/role-based-access-control/custom-roles-portal#start-from-json)


These examples will assume you want to create a role with specific permissions for Azure Spring Cloud.

## Navigate subscription and resource group Access control (IAM)

Follow these steps to start defining a role.

1. In the Azure portal, open the subscription and resource group where you want the custom role to be assignable.
1. Open **Access control (IAM)**.
1. Click **+ Add**.
1. Click **Add custom role**.

   ![Open Access control (IAM)](media/spring-cloud-permissions/add-custom-role.png)

## Define role to deploy, test, and restart apps
This procedure defines a role with permissions to deploy, test, and restart Azure Spring Cloud apps.

1. In the **Create custom role** dialog add role name and description.
1. Click **Next**.

   ![Create custom role](media/spring-cloud-permissions/create-custom-role.png)

1. Click **Add permissions**.

   ![Add permissions start](media/spring-cloud-permissions/add-permissions.png)

1. In the search box, search for *Microsoft.app*.
1. Select *Microsoft Azure Spring Cloud*.

   ![Select Azure Spring Cloud](media/spring-cloud-permissions/spring-cloud-permissions.png)

1. Select the permissions:

    Under **Microsoft.AppPlatform/Spring**, select:

    *Read : Get Azure Spring Cloud service instance*

    *Other : List Azure Spring Cloud service instance test keys*

    Under **Microsoft.AppPlatform/Spring/apps/deployments**, select: 

    Other : *Start Microsoft Azure Spring Cloud application deployment*

    *Other : Stop Microsoft Azure Spring Cloud application deployment*

   [ ![App platform permissions](media/spring-cloud-permissions/app-platform-permissions.png) ](media/spring-cloud-permissions/app-platform-permissions.png#lightbox)

1. Click **Add**.

## Define DevOps role

1. Repeat the previous procedures to step #6 to create a role.

   ![Create DevOps role](media/spring-cloud-permissions/create-dev-opps-role.png)
1. Open the **Permissions** options.
1. Select: *Microsoft.AppPlatform/Spring*
 
    *Write : Create or Update Azure Spring Cloud service instance*

    *Other : Get Microsoft Azure Spring Cloud application resource upload URL*

   [ ![Create DevOps permissions](media/spring-cloud-permissions/create-dev-opps-role-2.png) ](media/spring-cloud-permissions/create-dev-opps-role-2.png#lightbox)
1. Click **Add**.
1. Click **Review and create**.
   ![Assignable scopes](media/spring-cloud-permissions/dev-opps-role-assignable-scopes.png)


## See also
[Create or update Azure custom roles using the Azure portal](https://docs.microsoft.com/azure/role-based-access-control/custom-roles-portal)