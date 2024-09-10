---
title: Identity and authorization
description: Identity and authorization for Azure Arc-enabled servers.
ms.topic: conceptual
ms.date: 06/06/2024
---

# Identity and authorization

This article describes the Microsoft Entra ID managed identity for Azure Arc-enabled servers, which is used for authentication when communicating with Azure and details two built-in RBAC roles.

## Microsoft Entra ID managed identity

Every Azure Arc-enabled server has a system-assigned Microsoft Entra ID managed identity associated with it. This identity is used by the agent to authenticate itself with Azure. It can also be used by extensions or other authorized apps on your system to access resources that understand OAuth tokens. The managed identity appears in the Microsoft Entra ID portal with the same name as the Azure Arc-enabled server resource. For example, if your Azure Arc-enabled server is named *prodsvr01*, an enterprise app in Microsoft Entra ID with the same name appears.

Each Microsoft Entra ID directory has a finite limit for the number of objects it can store. A managed identity counts as one object in the directory. If you're planning a large deployment of Azure Arc-enabled servers, check the available quota in your Microsoft Entra ID directory first and submit a support request for more quota if necessary. You can see the available and used quota in the [List Organizations API](/graph/api/intune-onboarding-organization-list) response under the “directorySizeLimit” section.

The managed identity is fully managed by the agent. As long as the agent stays connected to Azure, it handles rotating the credential automatically. The certificate backing the managed identity is valid for 90 days. The agent attempts to renew the certificate when it has 45 or fewer days of validity remaining. If the agent is offline long enough to expire, the agent becomes “expired” as well and won't connect to Azure. In this situation, automatic reconnection isn't possible and requires you to disconnect and reconnect the agent to Azure using an onboarding credential.

The managed identity certificate is stored on the local disk of the system. It’s important that you protect this file, because anyone in possession of this certificate can request a token from Microsoft Entra ID. The agent stores the certificate in C:\ProgramData\AzureConnectedMachineAgent\Certs\ on Windows and /var/opt/azcmagent/certs on Linux. The agent automatically applies an access control list to this directory, restricting access to local administrators and the "himds" account. Don't modify access to the certificate files or modify the certificates on your own. If you think the credential for a system-assigned managed identity has been compromised, [disconnect](/azure/azure-arc/servers/azcmagent-disconnect) the agent from Azure and [connect](/azure/azure-arc/servers/azcmagent-connect) it again to generate a new identity and credential. Disconnecting the agent removes the resource in Azure, including its managed identity.

When an application on your system wants to get a token for the managed identity, it issues a request to the REST identity endpoint at *http://localhost:40342/identity*. There are slight differences in how Azure Arc handles this request compared to Azure VM. The first response from the API includes a path to a challenge token located on disk. The challenge token is stored in *C:\ProgramData\AzureConnectedMachineAgent\tokens* on Windows or */var/opt/azcmagent/tokens* on Linux. The caller must prove they have access to this folder by reading the contents of the file and reissuing the request with this information in the authorization header. The tokens directory is configured to allow administrators and any identity belonging to the "Hybrid agent extension applications" (Windows) or the "himds" (Linux) group to read the challenge tokens. If you're authorizing a custom application to use the system-assigned managed identity, you should add its user account to the appropriate group to grant it access.

To learn more about using a managed identity with Arc-enabled servers to authenticate and access Azure resources, see the following video.

> [!VIDEO https://www.youtube.com/embed/4hfwxwhWcP4]

## RBAC roles

There are two built-in roles in Azure that you can use to control access to an Azure Arc-enabled server:

- **Azure Connected Machine Onboarding**, intended for accounts used to connect new machines to Azure Arc. This role allows accounts to see and create new Arc servers but disallows extension management.

- **Azure Connected Machine Resource Administrator**, intended for accounts that will manage servers once they’re connected. This role allows accounts to read, create, and delete Arc servers, VM extensions, licenses, and private link scopes.

Generic RBAC roles in Azure also apply to Azure Arc-enabled servers, including Reader, Contributor, and Owner.

## Identity and access control

[Azure role-based access control](../../role-based-access-control/overview.md) is used to control which accounts can see and manage your Azure Arc-enabled server. From the [**Access Control (IAM)**](../../role-based-access-control/role-assignments-portal.yml) page in the Azure portal, you can verify who has access to your Azure Arc-enabled server.

:::image type="content" source="media/security-identity-authorization/access-control-page.png" alt-text="Screenshot of the Azure portal showing Azure Arc-enabled server access control.":::

Users and applications granted [contributor](../../role-based-access-control/built-in-roles.md#contributor) or administrator role access to the resource can make changes to the resource, including deploying or deleting [extensions](manage-vm-extensions.md) on the machine. Extensions can include arbitrary scripts that run in a privileged context, so consider any contributor on the Azure resource to be an indirect administrator of the server.

The **Azure Connected Machine Onboarding** role is available for at-scale onboarding, and is only able to read or create new Azure Arc-enabled servers in Azure. It cannot be used to delete servers already registered or manage extensions. As a best practice, we recommend only assigning this role to the Microsoft Entra service principal used to onboard machines at scale.

Users as a member of the **Azure Connected Machine Resource Administrator** role can read, modify, reonboard, and delete a machine. This role is designed to support management of Azure Arc-enabled servers, but not other resources in the resource group or subscription.

