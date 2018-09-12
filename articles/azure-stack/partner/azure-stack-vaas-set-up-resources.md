---
title: Set up your Azure Stack Validation as a Service resources | Microsoft Docs
description: Learn how to set up resources for Validation as a Service.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 07/24/2018
ms.author: mabrigg
ms.reviewer: johnhas

---

# Set up your Validation as a Service resources

[!INCLUDE[Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

Validation as a Service (VaaS) is an Azure service that is made available to Microsoft Azure Stack partners who have a co-engineering agreement with Microsoft to design, develop, validate, sell, deploy, and support Azure Stack solutions in the market.

Learn how to get ready to use VaaS by setting up the Azure Active Directory instance and creating a storage account.

## Configure an Azure Active Directory tenant

An Azure Active Directory tenant is required for authenticating and registering with VaaS. The role-based access control (RBAC) features of the tenant will be used by the partner to manage who in the partner organization can use VaaS.

> [!NOTE]
> It is important that you register your "organizational" Azure AD tenant directory (rather than the AAD tenant directory used for Azure Stack) and establish a policy for managing the user accounts in it. For more information, see [Manage your Azure AD directory](https://docs.microsoft.com/azure/active-directory/active-directory-administer).

### Create a tenant

It is recommended to create a tenant specifically for use with VaaS with a descriptive name, for example, `ContosoVaaS@onmicrosoft.com`.

1. Create an Azure Active Directory tenant in the [Azure portal](https://portal.azure.com), or use an existing tenant. For instructions on creating new Azure Active Directory tenants, see [Get started with Azure AD](https://docs.microsoft.com/azure/active-directory/get-started-azure-ad).

2. Add members of your organization to the tenant. These users will be responsible for using the service to view or schedule tests. Once registration is complete, users' level of access will be defined by role assignments in [Assign user roles](#assign-user-roles).

> [!TIP]
> If you would like to isolate VaaS resources and operations among different groups within the organization, you can create multiple Azure AD tenant directories.

### Register your tenant

This process authorizes your tenant with the **Azure Stack Validation Service** Azure Active Directory application.

1. Send the following information about the tenant to Microsoft at [vaashelp@microsoft.com](mailto:vaashelp@microsoft.com).

    | Data | Description |
    |--------------------------------|---------------------------------------------------------------------------------------------|
    | Organization Name | The official organization name |
    | Azure AD Tenant Directory Name | The Azure AD Tenant Directory name being registered |
    | Azure AD Tenant Directory ID | The Azure AD Tenant Directory GUID associated with the directory. For information on how to find your Azure AD Tenant Directory ID, see [Get tenant ID](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-create-service-principal-portal#get-tenant-id). |

2. Wait for confirmation from the Azure Stack Validation team to verify that your tenant can use the VaaS portal.

### Consent to the VaaS application

As the AAD administrator, give the VaaS AAD application the required permissions on behalf of your tenant:

1. Use the global admin credentials for the tenant to sign into the [VaaS portal](https://azurestackvalidation.com/). Click on **My Account**.

    ![Sign to the VaaS portal](media/vaas_portalsignin.png)

2. The site will prompt you to grant VaaS the listed AAD permissions. Accept the terms to proceed.

For more information on the consent framework, see [Overview of the consent framework](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad#overview-of-the-consent-framework).

### Assign user roles

Authorize the users in your tenant to perform actions in VaaS by assigning one of the following roles:

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

## Create an Azure Storage account

During test execution, VaaS outputs diagnostic logs to an Azure Storage account. In addition to test logs, the storage account may also be used to the upload the OEM extension packages for the Package Validation workflow.

> [!NOTE]
> This Azure Storage account is hosted in the Azure public cloud, not on your Azure Stack environment.

1. To create a storage account, follow the instructions at [Create a storage account](https://docs.microsoft.com/en-us/azure/storage/storage-create-storage-account#create-a-storage-account).
2. When selecting the type of storage account, select the **Blob storage** account type.
    > [!TIP]
    > In order to ensure that networking charges are not incurred for storing logs, it is recommended that the Azure Storage account be configured to use only the **US West** region. Data replication and the hot storage tier feature are not necessary for this data. Enabling either feature will dramatically increase partner costs.

For details on using the storage account for VaaS, see the following articles:

- [Generate the diagnostics connection string](azure-stack-vaas-parameters.md#generate-the-diagnostics-connection-string)
- [Managing packages for validation](azure-stack-vaas-validate-oem-package.md#managing-packages-for-validation)

## Next steps

- Use the VaaS local agent to prepare for test execution. For instructions, see [Deploy the local agent](azure-stack-vaas-local-agent.md).
- Learn about [Validation as a Service key concepts](azure-stack-vaas-key-concepts.md).