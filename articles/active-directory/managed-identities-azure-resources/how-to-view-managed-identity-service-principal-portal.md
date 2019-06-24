---
title: How to view the service principal of a managed identity in the Azure portal
description: Step-by-step instructions for viewing the service principal of a managed identity in the Azure portal.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.service: active-directory
ms.subservice: msi
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/29/2018
ms.author: markvi
ms.collection: M365-identity-device-management
---

# View the service principal of a managed identity in the Azure portal

Managed identities for Azure resources provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, you learn how to view the service principal of a managed identity using the Azure portal.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md).
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/).
- Enable [system assigned identity on a virtual machine](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm#system-assigned-managed-identity) or [application](/azure/app-service/overview-managed-identity#adding-a-system-assigned-identity).

## View the service principal

This procedure demonstrates how to view the service principal of a VM with system assigned identity enabled (the same steps apply for an application).

1. Click **Azure Active Directory** and then click **Enterprise applications**.
2. Under **Application Type**, choose **All Applications**.
3. In the search filter box, type the name of the VM or application that has managed identity enabled or choose it from the list presented.

   ![View managed identity service principal in portal](./media/how-to-view-managed-identity-service-principal-portal/view-managed-identity-service-principal-portal.png)

## Next steps

[Managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/overview)

