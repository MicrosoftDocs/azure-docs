---
title: Identify and authorization
description: Identify and authorization for Azure Arc-enabled servers.
ms.topic: conceptual
ms.date: 06/06/2024
---

# Identify and authorization

This article describes the Entra ID managed identity for Azure Arc-enabled servers, which is used for authentication when communicating with Azure and details two built-in RBAC roles.

## Entra ID managed identity

Every Azure Arc-enabled server has a system-assigned Entra ID managed identity associated with it. This identity is used by the agent when it communicates with Azure to authenticate itself, and can also be used by extensions or other authorized apps on your system to access any resource that understands OAuth tokens. The managed identity will show up in the Entra ID portal with the same name as the Azure Arc-enabled server resource. For example, if your Azure Arc-enabled server is named “prodsvr01,” you’ll see an enterprise app in Entra ID with the same name.

Each Entra ID directory has a finite limit for the number of objects it can store. A managed identity counts as one object in the directory. If you are planning a large deployment of Azure Arc-enabled servers, check the available quota in your Entra ID directory first and submit a support request for more quota if necessary. You can see the available and used quota in the [List Organizations API](/graph/api/intune-onboarding-organization-list) response under the “directorySizeLimit” section.

The managed identity is fully managed by the agent. As long as the agent stays connected to Azure, it will take care of rotating the credential automatically. The certificate backing the managed identity is valid for 90 days and the agent will try to renew the certificate when the certificate has 45 or fewer days of validity left. If the agent is offline long enough that the certificate expires, the agent will become “expired” as well and be unable to connect to Azure. In this situation, automatic reconnection is not possible and you will need to disconnect and reconnect the agent to Azure using an onboarding credential.

The managed identity certificate is stored on the local disk of the system. It’s very important that you protect this file, because anyone in possession of this certificate can request a token from Entra ID. The agent stores the certificate in C:\ProgramData\AzureConnectedMachineAgent\Certs\ on Windows and /var/opt/azcmagent/certs on Linux. The agent automatically applies an access control list to this directory, restricting access to local administrators and the “himds” account. Do not modify access to the certificate files or modify the certificates on your own. If you think the credential for a system-assigned managed identity has been compromised, [disconnect](/azure/azure-arc/servers/azcmagent-disconnect) the agent from Azure and [connect](/azure/azure-arc/servers/azcmagent-connect) it again to generate a new identity and credential. Disconnecting the agent removes the resource in Azure, including its managed identity.

When an application on your system wants to get a token for the managed identity, it will issue a request to the REST identity endpoint at http://localhost:40342/identity There are slight differences in how Azure Arc handles this request compared to Azure VM. The first response from the API will include a path to a challenge token located on disk. The challenge token will be stored in *C:\ProgramData\AzureConnectedMachineAgent\tokens* on Windows or */var/opt/azcmagent/tokens* on Linux. The caller must prove they have access to this folder by reading the contents of the file and re-issuing the request with this information in the authorization header. The tokens directory is configured to allow administrators and any identity belonging to the “Hybrid agent extension applications” (Windows) or the “himds” (Linux) group to read the challenge tokens. If you are authorizing a custom application to use the system-assigned managed identity, you should add its user account to the appropriate group to grant it access.

## RBAC roles

There are two built-in roles in Azure that you can use to control access to an Azure Arc-enabled server:

- **Azure Connected Machine Onboarding**, intended for accounts used to connect new machines to Azure Arc. This role allows accounts to see and create new Arc servers but disallows extension management.

- **Azure Connected Machine Resource Administrator**, intended for accounts that will manage servers once they’re connected. This role allows accounts to read, create, and delete Arc servers, VM extensions, licenses, and private link scopes.

Generic RBAC roles in Azure also apply to Azure Arc-enabled servers, including Reader, Contributor and Owner.



