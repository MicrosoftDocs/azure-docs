---
title: Security overview
description: Security information about Azure Arc enabled servers (preview).
ms.topic: reference
ms.date: 08/25/2020
---

# Azure Arc for servers (preview) security overview

This article describes the security configuration and considerations you should evaluate before deploying Azure Arc enabled servers in your enterprise.

## Permissions and access control 

### Who can manage the resource in Azure?

Each Azure Arc enabled server has a managed identity as part of a resource group inside an Azure subscription that represent the server running on-premises or other cloud environment. Access to this resource is controlled by standard [Azure role-based access control](../../role-based-access-control/overview.md). From the [**Access Control (IAM)**](../../role-based-access-control/role-assignments-portal#access-control-iam.md) page in the Azure portal, you can verify who has access to your Azure Arc enabled server.

:::image type="content" source="./media/security-considerations/azure-arc-resource-access-control-page.png" alt-text="Azure Arc enabled server access control" border="false":::

Users and applications granted [contributor](../../role-based-access-control/built-in-roles.md#contributor) or administrator role access to the resource can make changes to the resource, including deploying or deleting [extensions](manage-extensions.md) on the machine. Extensions can include arbitrary scripts that run in a privileged context, so consider any contributor on the Azure resource to be an indirect administrator of the non-Azure server. 

The **Azure Connected Machine Onboarding** role is available for at-scale onboarding, and is only able to read or create new Arc enabled servers in Azure. It cannot be used to delete servers already registered or manage extensions. We recommend only assigning the Azure Active Directory service principal used to onboard machines at scale only this role to maintain least privileged access. 

## Who can manage the Azure Connected Machine agent?

To manage the Azure Connected Machine agent (azcmagent), you need to be a member of the local administrators group (Windows) or run as root (Linux). 

## Who can use the Azure Active Directory system assigned identity on an Arc enabled server?

While the Hybrid Instance Metadata Service can be accessed by any application running on the machine, only authorized applications can request an Azure Active Directory token for the system assigned identity. On the first attempt to access the token URI, the service will generate a randomly generated cryptographic blob in a location on the file system that only trusted callers can read. The caller must then read the file (proving it has appropriate permission) and retry the request with the file contents in the authorization header to successfully retrieve an AAD token. 

On Windows, the caller must belong to the “Administrators” or “Hybrid Agent Extension Applications” group to read the blob. 

On Linux, the caller must belong to the “himds” group. 

## What can the Azure Connected Machine Agent do on the local machine?

The Azure Connected Machine agent is composed of 3 services which run on your machine. The “himds” service is responsible for all core functionality of Arc, including sending heartbeats up to Azure and exposing a local instance metadata service for other apps to learn about the machine’s Azure resource ID and retrieve AAD tokens to authenticate to other Azure services. This service runs as an unprivileged virtual service account on Windows and as the “himds” user on Linux. 

The guest configuration service is responsible for evaluating Azure Policy on the machine and the extension service is responsible for installing, updating, and deleting extensions (agents, scripts, or other software) on the machine. These services run as Local System on Windows and root on Linux. 

## What can the Azure Active Directory system assigned identity manage?

By default, the Azure Active Directory system assigned identity used by Arc can only be used to update the status of the Arc server in Azure (e.g. “last seen” through heartbeats). You can optionally assign additional roles to the identity if an application on your server uses the system assigned identity to access other Azure services. 

## Can I use disk encryption?

The Azure Connected Machine agent uses public key authentication to communicate with the Azure service. After you onboard a server to Azure Arc, a private key is saved to the disk and used whenever the agent communicates with Azure. If stolen, the private key can be used on another server to communicate with the service and act as if it were the original server. This includes getting access to the system assigned identity and any resources that identity has access to. The private key file is protected to only allow the **himds** account access to read it. But to prevent offline attacks, we strongly recommend the use of full disk encryption (BitLocker, dm-crypt, etc.) on the operating system volume of your server.