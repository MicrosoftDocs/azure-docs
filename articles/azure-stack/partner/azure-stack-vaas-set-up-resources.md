---
title: Tutorial - set up resources for Validation as a Service | Microsoft Docs
description: In this tutorial, learn how to set up resources for Validation as a Service.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/04/2019
ms.author: mabrigg
ms.reviewer: johnhas
ms.lastreviewed: 11/26/2018



ROBOTS: NOINDEX

# Customer intent: As a system engineer at a partner OEM, I need to create a solution to check for a new, unique set of hardware intended to run Azure Stack, so I can validate that my hardware runs Azure Stack.
---

# Tutorial: Set up resources for Validation as a Service

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

Validation as a Service (VaaS) is an Azure service that is used to validate and support Azure Stack solutions in the market. Follow this article before using the service to validate your solution.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Get ready to use VaaS by setting up your Azure Active Directory (AD).
> * Create a storage account.

## Configure an Azure AD tenant

An Azure AD tenant is used to register an organization and authenticate users with VaaS. The partner will use the role-based access control (RBAC) features of the tenant to manage who in the partner organization can use VaaS. For more information, see [What is Azure Active Directory?](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-whatis).

### Create a tenant

Create a tenant that your organization will use to access VaaS services. Use a descriptive name, for example, `ContosoVaaS@onmicrosoft.com`.

1. Create an Azure AD tenant in the [Azure portal](https://portal.azure.com), or use an existing tenant. <!-- For instructions on creating new Azure AD tenants, see [Get started with Azure AD](https://docs.microsoft.com/azure/active-directory/get-started-azure-ad). -->

2. Add members of your organization to the tenant. These users will be responsible for using the service to view or schedule tests. Once you finish registration, you will define users' access levels.

    Authorize the users in your tenant to run actions in VaaS by assigning one of the following roles:

    | Role Name | Description |
    |---------------------|------------------------------------------|
    | Owner | Has full access to all resources. |
    | Reader | Can view all resources but not create or manage. |
    | Test Contributor | Can create and manage test resources. |

    To assign roles in the **Azure Stack Validation Service** application:

   1. Sign in to the [Azure portal](https://portal.azure.com).
   2. Select **All Services** > **Azure Active Directory** under the **Identity** section.
   3. Select **Enterprise Applications** > **Azure Stack Validation Service** application.
   4. Select **Users and groups**. The **Azure Stack Validation Service - Users and group** blade lists the users with permission to use the application.
   5. Select **+ Add user** to add a user from your tenant and assign a role.

      If you would like to isolate VaaS resources and actions among different groups within an organization, you can create multiple Azure AD tenant directories.

### Register your tenant

This process authorizes your tenant with the **Azure Stack Validation Service** Azure AD application.

1. Send the following information about the tenant to Microsoft at [vaashelp@microsoft.com](mailto:vaashelp@microsoft.com).

    | Data | Description |
    |--------------------------------|---------------------------------------------------------------------------------------------|
    | Organization Name | The official organization name. |
    | Azure AD Tenant Directory Name | The Azure AD Tenant Directory name being registered. |
    | Azure AD Tenant Directory ID | The Azure AD Tenant Directory GUID associated with the directory. For information on how to find your Azure AD Tenant Directory ID, see [Get tenant ID](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-create-service-principal-portal#get-tenant-id). |

2. Wait for confirmation from the Azure Stack Validation team to check that your tenant can use the VaaS portal.

### Consent to the VaaS application

As the Azure AD administrator, give the VaaS Azure AD application the required permissions on behalf of your tenant:

1. Use the global admin credentials for the tenant to sign into the [VaaS portal](https://azurestackvalidation.com/). 

2. Select **My Account**.

3 Accept the terms to proceed when prompted to grant VaaS the listed Azure AD permissions.

## Create an Azure Storage account

During test execution, VaaS outputs diagnostic logs to an Azure Storage account. In addition to test logs, the storage account may also be used to the upload the OEM extension packages for the Package Validation workflow.

The Azure Storage account is hosted in the Azure public cloud, not on your Azure Stack environment.

1. In the Azure portal, select **All services** > **Storage** > **Storage accounts**. On the **Storage Accounts** blade, select **Add**.

2. Select the subscription in which to create the storage account.

3. Under **Resource group**, select **Create new**. Enter a name for your new resource group.

4. Review the [naming conventions](https://docs.microsoft.com/en-us/azure/architecture/best-practices/naming-conventions#storage) for Azure Storage accounts. Enter a name for your storage account.

5. Select the **US West** region for your storage account.

    In order to ensure that networking charges are not incurred for storing logs, the Azure Storage account can be configured to use only the **US West** region. Data replication and the hot storage tier feature are not necessary for this data. Enabling either feature will dramatically increase your costs.

6. Leave the settings to the default values except for **Account kind**:

    - The **Deployment model** field is set to **Resource Manager** by default.
    - The **Performance** field is set to **Standard** by default.
    - Select **Account kind** field as **Blob storage**.
    - The **Replication field** is set to **Locally-redundant storage (LRS)** by default.
    - The **Access tier** is set to **Hot** by default.

7. Select **Review + Create** to review your storage account settings and create the account.

## Next steps

If your environment does not allow in-bound connections, follow the tutorial on deploying the local agent to run a test on your hardware.

> [!div class="nextstepaction"]
> [Deploy the local agent](azure-stack-vaas-local-agent.md)
