---
title: Azure AD on-premises app provisioning to SCIM-enabled apps
description: This article describes how to use the Azure AD provisioning service to provision users into an on-premises app that's SCIM enabled.
services: active-directory
author: billmath
manager: mtillman
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: conceptual
ms.workload: identity
ms.date: 07/16/2021
ms.author: billmath
ms.reviewer: arvinh
---

# Azure AD on-premises application provisioning to SCIM-enabled apps

>[!IMPORTANT]
> The on-premises provisioning preview is currently in an invitation-only preview. To request access to the capability, use the [access request form](https://aka.ms/onpremprovisioningpublicpreviewaccess). We'll open the preview to more customers and connectors over the next few months as we prepare for general availability.

The Azure Active Directory (Azure AD) provisioning service supports a [SCIM 2.0](https://techcommunity.microsoft.com/t5/identity-standards-blog/provisioning-with-scim-getting-started/ba-p/880010) client that can be used to automatically provision users into cloud or on-premises applications. This article outlines how you can use the Azure AD provisioning service to provision users into an on-premises application that's SCIM enabled. If you want to provision users into non-SCIM on-premises applications that use SQL as a data store, see the [Azure AD ECMA Connector Host Generic SQL Connector tutorial](tutorial-ecma-sql-connector.md). If you want to provision users into cloud apps such as DropBox and Atlassian, review the app-specific [tutorials](../../active-directory/saas-apps/tutorial-list.md).

![Diagram that shows SCIM architecture.](./media/on-premises-scim-provisioning/scim-4.png)

## Prerequisites
- An Azure AD tenant with Azure AD Premium P1 or Premium P2 (or EMS E3 or E5). [!INCLUDE [active-directory-p1-license.md](../../../includes/active-directory-p1-license.md)]
- Administrator role for installing the agent. This task is a one-time effort and should be an Azure account that's either a hybrid administrator or a global administrator. 
- Administrator role for configuring the application in the cloud (application administrator, cloud application administrator, global administrator, or a custom role with permissions).

## On-premises app provisioning to SCIM-enabled apps
To provision users to SCIM-enabled apps:

 1. Add the **On-premises SCIM app** from the [gallery](../../active-directory/manage-apps/add-application-portal.md).
 1. Go to your app and select **Provisioning** > **Download the provisioning agent**.
 1. Select **On-Premises Connectivity**, and download the provisioning agent.
 1. Copy the agent onto the virtual machine or server that your SCIM endpoint is hosted on.
 1. Open the provisioning agent installer, agree to the terms of service, and select **Install**.
 1. Open the provisioning agent wizard, and select **On-premises provisioning** when prompted for the extension you want to enable.
 1. Provide credentials for an Azure AD administrator when you're prompted to authorize. Hybrid administrator or global administrator is required.
 1. Select **Confirm** to confirm the installation was successful.
 1. Go back to your application, and select **On-Premises Connectivity**.
 1. Select the agent that you installed from the dropdown list, and select **Assign Agent(s)**.
 1. Wait 10 minutes or restart the Azure AD Connect Provisioning agent service on your server or VM.
 1. Provide the URL for your SCIM endpoint in the **Tenant URL** box. An example is https://localhost:8585/scim.
 
     ![Screenshot that shows assigning an agent.](./media/on-premises-scim-provisioning/scim-2.png)
 1. Select **Test Connection**, and save the credentials.
 1. Configure any [attribute mappings](customize-application-attributes.md) or [scoping](define-conditional-rules-for-provisioning-user-accounts.md) rules required for your application.
 1. Add users to scope by [assigning users and groups](../../active-directory/manage-apps/add-application-portal-assign-users.md) to the application.
 1. Test provisioning a few users [on demand](provision-on-demand.md).
 1. Add more users into scope by assigning them to your application.
 1. Go to the **Provisioning** pane, and select **Start provisioning**.
 1. Monitor using the [provisioning logs](../../active-directory/reports-monitoring/concept-provisioning-logs.md).

## Additional requirements
* Ensure your [SCIM](https://techcommunity.microsoft.com/t5/identity-standards-blog/provisioning-with-scim-getting-started/ba-p/880010) implementation meets the [Azure AD SCIM requirements](use-scim-to-provision-users-and-groups.md).
  
  Azure AD offers open-source [reference code](https://github.com/AzureAD/SCIMReferenceCode/wiki) that developers can use to bootstrap their SCIM implementation. The code is as is.
* Support the /schemaDiscovery endpoint to reduce configuration required in the Azure portal. 

## Next steps

- [App provisioning](user-provisioning.md)
- [Azure AD ECMA Connector Host installation](on-premises-ecma-install.md)
- [Azure AD ECMA Connector Host configuration](on-premises-ecma-configure.md)
- [Generic SQL connector](on-premises-sql-connector-configure.md)
- [Tutorial: ECMA Connector Host generic SQL connector](tutorial-ecma-sql-connector.md)
