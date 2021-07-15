---
title: Azure AD on-premises app provisioning to SCIM-enabled apps
description: This article describes how to on-premises app provisioning to SCIM-enabled apps.
services: active-directory
author: billmath
manager: mtillman
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: conceptual
ms.workload: identity
ms.date: 07/01/2021
ms.author: billmath
ms.reviewer: arvinh
---

# Azure AD on-premises application provisioning to SCIM-enabled apps

>[!IMPORTANT]
> The on-premises provisioning preview is currently in an invitation-only preview. You can request access to the capability [here](https://aka.ms/onpremprovisioningpublicpreviewaccess). We will open the preview to more customers and connectors over the next few months as we prepare for general availability.

The Azure AD provisioning service supports a [SCIM 2.0](https://techcommunity.microsoft.com/t5/identity-standards-blog/provisioning-with-scim-getting-started/ba-p/880010) client that can be used to automatically provision users into cloud or on-premises applications. This document outlines how you can use the Azure AD provisioning service to provision users into an on-premises application that is SCIM enabled. If you're looking to provision users into non-SCIM on-premises applications, such as a non-AD LDAP directory or SQL DB, see here (link to new doc that we will need to create). If you're looking to provisioning users into cloud apps such as DropBox, Atlassian, etc. review the app specific [tutorials](../../active-directory/saas-apps/tutorial-list.md). 

![architecture](./media/on-premises-scim-provisioning/scim-4.png)


## Pre-requisites
- An Azure AD tenant with Azure AD Premium P1 or Premium P2 (or EMS E3 or E5). 
    [!INCLUDE [active-directory-p1-license.md](../../../includes/active-directory-p1-license.md)]
- Administrator role for installing the agent.  This is a one time effort and should be an Azure account that is either a hybrid admin or global admin. 
- Administrator role for configuring the application in the cloud (Application admin, Cloud application admin, Global Administrator, Custom role with perms)

## Steps for on-premises app provisioning to SCIM-enabled apps
Use the steps below to provision to SCIM-enabled apps. 

 1. Add the "On-premises SCIM app" from the [gallery](../../active-directory/manage-apps/add-application-portal.md).
 2. Navigate to your app > Provisioning > Download the provisioning agent.
 3. Click on on-premises connectivity and download the provisioning agent.
 4. Copy the agent onto the virtual machine or server that your SCIM endpoint is hosted on.
 5. Open the provisioning agent installer, agree to the terms of service, and click install.
 6. Open the provisioning agent wizard and select on-premises provisioning when prompted for the extension that you would like to enable.
 7. Provide credentials for an Azure AD Administrator when prompted to authorize (Hybrid administrator or Global administrator required).
 8. Click confirm to confirm the installation was successful.
 9. Navigate back to your application > on-premises connectivity.
 10. Select the agent that you installed, from the dropdown list, and click assign agent.
 11. Wait 10 minutes or restart the Azure AD Connect Provisioning agent service on your server / VM.
 12. Provide URL for your SCIM endpoint in the tenant URL field (e.g. Https://localhost:8585/scim).
     ![assign agent](./media/on-premises-scim-provisioning/scim-2.png)
 13. Click test connection and save the credentials.
 14. Configure any [attribute mappings](customize-application-attributes.md) or [scoping](define-conditional-rules-for-provisioning-user-accounts.md) rules required for your application.  
 15. Add users to scope by [assigning users and groups](../../active-directory/manage-apps/add-application-portal-assign-users.md) to the application.
 16. Test provisioning a few users [on-demand](provision-on-demand.md).
 17. Add additional users into scope by assigning them to your application.
 18. Navigate to the provisioning blade and hit start provisioning.
 19. Monitor using the [provisioning logs](../../active-directory/reports-monitoring/concept-provisioning-logs.md).
 

## Things to be aware of
* Ensure your [SCIM](https://techcommunity.microsoft.com/t5/identity-standards-blog/provisioning-with-scim-getting-started/ba-p/880010) implementation meets the [Azure AD SCIM requirements](use-scim-to-provision-users-and-groups.md).
  * Azure AD offers open-source [reference code](https://github.com/AzureAD/SCIMReferenceCode/wiki) that developers can use to bootstrap their SCIM implementation (the code is as-is)
* Support the /schemaDiscovery endpoint to reduce configuration required in the Azure portal. 

## Next Steps

- [App provisioning](user-provisioning.md)
- [Azure AD ECMA Connector Host installation](on-premises-ecma-install.md)
- [Azure AD ECMA Connector Host configuration](on-premises-ecma-configure.md)
- [Generic SQL Connector](on-premises-sql-connector-configure.md)
- [Tutorial:  ECMA Connector Host Generic SQL Connector](tutorial-ecma-sql-connector.md)
