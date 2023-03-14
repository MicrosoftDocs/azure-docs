---
title: Azure AD on-premises app provisioning to SCIM-enabled apps
description: This article describes how to use the Azure AD provisioning service to provision users into an on-premises app that's SCIM enabled.
author: billmath
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: conceptual
ms.workload: identity
ms.date: 08/25/2022
ms.author: billmath
ms.reviewer: arvinh
---

# Azure AD on-premises application provisioning to SCIM-enabled apps

The Azure Active Directory (Azure AD) provisioning service supports a [SCIM 2.0](https://techcommunity.microsoft.com/t5/identity-standards-blog/provisioning-with-scim-getting-started/ba-p/880010) client that can be used to automatically provision users into cloud or on-premises applications. This article outlines how you can use the Azure AD provisioning service to provision users into an on-premises application that's SCIM enabled. If you want to provision users into non-SCIM on-premises applications that use SQL as a data store, see the [Azure AD ECMA Connector Host Generic SQL Connector tutorial](tutorial-ecma-sql-connector.md). If you want to provision users into cloud apps such as DropBox and Atlassian, review the app-specific [tutorials](../../active-directory/saas-apps/tutorial-list.md).

![Diagram that shows SCIM architecture.](./media/on-premises-scim-provisioning/scim-4.png)

## Prerequisites
- An Azure AD tenant with Azure AD Premium P1 or Premium P2 (or EMS E3 or E5). [!INCLUDE [active-directory-p1-license.md](../../../includes/active-directory-p1-license.md)]
- Administrator role for installing the agent. This task is a one-time effort and should be an Azure account that's either a hybrid administrator or a global administrator. 
- Administrator role for configuring the application in the cloud (application administrator, cloud application administrator, global administrator, or a custom role with permissions).
- A computer with at least 3 GB of RAM, to host a provisioning agent. The computer should have Windows Server 2016 or a later version of Windows Server, with connectivity to the target application, and with outbound connectivity to login.microsoftonline.com, other Microsoft Online Services and Azure domains. An example is a Windows Server 2016 virtual machine hosted in Azure IaaS or behind a proxy.

## Deploying Azure AD provisioning agent
The Azure AD Provisioning agent can be deployed on the same server hosting a SCIM enabled application, or a seperate server, providing it has line of sight to the application's SCIM endpoint. A single agent also supports provision to multiple applications hosted locally on the same server or seperate hosts, again as long as each SCIM endpoint is reachable by the agent.  

 1. [Download](https://aka.ms/OnPremProvisioningAgent) the provisioning agent and copy it onto the virtual machine or server that your SCIM application endpoint is hosted on.
 2. Run the provisioning agent installer, agree to the terms of service, and select **Install**.
 3. Once installed, locate  and launch the **AAD Connect Provisioning Agent wizard**, and when prompted for an extensions select **On-premises provisioning**
 4. For the agent to register itself with your tenant, provide credentials for an Azure AD admin with Hybrid administrator or global administrator permissions.
 5. Select **Confirm** to confirm the installation was successful.
 
## Provisioning to SCIM-enabled application
Once the agent is installed, no further configuration is necesary on-prem, and all provisioning configurations are then managed from the portal. Repeat the below steps for every on-premises application being provisioned via SCIM.
 
 1. In the Azure portal navigate to the Enterprise applications and add the **On-premises SCIM app** from the [gallery](../../active-directory/manage-apps/add-application-portal.md).
 2. From the left hand menu navigate to the **Provisioning** option and select **Get started**.
 3. Select **Automatic** from the dropdown list and expand the **On-Premises Connectivity** option.
 4.  Select the agent that you installed from the dropdown list and select **Assign Agent(s)**.
 5.  Now either wait 10 minutes or restart the **Microsoft Azure AD Connect Provisioning Agent** before proceeding to the next step & testing the connection.
 6.  In the **Tenant URL** field, provide the SCIM endpoint URL for your application. The URL is typically unique to each target application and must be resolveable by DNS. An example for a scenario where the agent is installed on the same host as the application is https://localhost:8585/scim ![Screenshot that shows assigning an agent.](./media/on-premises-scim-provisioning/scim-2.png)
 7.  Select **Test Connection**, and save the credentials. The application SCIM endpoint must be actively listening for inbound provisioning requests, otherwise the test will fail. Use the steps [here](on-premises-ecma-troubleshoot.md#troubleshoot-test-connection-issues) if you run into connectivity issues. 
 8.  Configure any [attribute mappings](customize-application-attributes.md) or [scoping](define-conditional-rules-for-provisioning-user-accounts.md) rules required for your application.
 9.  Add users to scope by [assigning users and groups](../../active-directory/manage-apps/add-application-portal-assign-users.md) to the application.
 10.  Test provisioning a few users [on demand](provision-on-demand.md).
 11.  Add more users into scope by assigning them to your application.
 12.  Go to the **Provisioning** pane, and select **Start provisioning**.
 13.  Monitor using the [provisioning logs](../../active-directory/reports-monitoring/concept-provisioning-logs.md).

The following video provides an overview of on-premises provisoning.
> [!VIDEO https://www.youtube.com/embed/QdfdpaFolys]

## Additional requirements
* Ensure your [SCIM](https://techcommunity.microsoft.com/t5/identity-standards-blog/provisioning-with-scim-getting-started/ba-p/880010) implementation meets the [Azure AD SCIM requirements](use-scim-to-provision-users-and-groups.md).
  
  Azure AD offers open-source [reference code](https://github.com/AzureAD/SCIMReferenceCode/wiki) that developers can use to bootstrap their SCIM implementation. The code is as is.
* Support the /schemas endpoint to reduce configuration required in the Azure portal. 

## Next steps

- [App provisioning](user-provisioning.md)
- [Generic SQL connector](on-premises-sql-connector-configure.md)
- [Tutorial: ECMA Connector Host generic SQL connector](tutorial-ecma-sql-connector.md)
