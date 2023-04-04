---
title: How to register an Azure Storage Mover agent #Required; page title is displayed in search results. Include the brand.
description: Learn about agent VM registration to run your migration jobs. #Required; article description that is displayed in search results. 
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 03/14/2023
---

<!-- 
!########################################################
STATUS: IN REVIEW

CONTENT: final

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed

!########################################################
-->

# How to register an Azure Storage Mover agent

The Azure Storage Mover service utilizes agents that carry out the migration jobs you configure in the service. The agent is a virtual machine / appliance that you run on a virtualization host, close to the source storage.

In this article, you'll learn how to successfully register a previously deployed Storage Mover agent VM. Registration creates a trust relationship with your cloud service and enables the agent to receive migration jobs.

## Prerequisites

There are two prerequisites before you can register an Azure Storage Mover agent:

1. You need to have an Azure Storage Mover resource deployed. <br />Follow the steps in the *[Create a storage mover resource](storage-mover-create.md)* article to deploy this resource in an Azure subscription and region of your choice.

1. You need to deploy the Azure Storage Mover agent VM. <br /> Follow the steps in the [Azure Storage Mover agent VM deployment](agent-deploy.md) article to run the agent VM and to get it connected to the internet.

## Registration overview

:::image type="content" source="media/agent-register/agent-registration-title.png" alt-text="Image showing three components. The storage mover agent, deployed on-premises and close to the source data to be migrated. The storage mover cloud resource, deployed in an Azure resource group. And finally, a line connecting the two." lightbox="media/agent-register/agent-registration-title-large.png":::

Registration creates trust between the agent and the cloud resource. It allows you to remotely manage the agent and to give it migration jobs to execute.

Registration is always initiated from the agent. For security purposes, trust can only be created by the agent reaching out to the Storage Mover service. The registration procedure utilizes your Azure credentials and permissions on the storage mover resource you've previously deployed. If you don't have a storage mover cloud resource or an agent VM deployed yet, refer to the [prerequisites section](#prerequisites).

## Step 1: Connect to the agent VM

The agent VM is an appliance. It offers an administrative shell that limits which operations you can perform on this machine. When you connect to this VM, for instance directly from your Hyper-V host, you'd see that shell loaded and can interact with it directly.

However, the agent VM is a Linux based appliance and copy/paste often doesn't work within the default Hyper-V window. Use an SSH connection instead. Advantages of an SSH connection are:
- You can connect to the agent VM's shell from any management machine and don't need to be logged into the Hyper-V host.
- Copy / paste is fully supported.

[!INCLUDE [agent-shell-connect](includes/agent-shell-connect.md)]

## Step 2: Test network connectivity

Your agent needs to be connected to the internet. <!-- The article **<!!!!! ARTICLE AND LINK NEEDED !!!!!>** showcases connectivity requirements and options. -->

When logged into the administrative shell, you can test the agents connectivity state:

```StorageMoverAgent-AdministrativeShell
1) System configuration
2) Network configuration
3) Service and job status
4) Register
5) Open restricted shell
6) Collect support bundle
7) Restart agent
8) Exit

xdmsh> 2
```
Select menu item 2) *Network configuration*.

```StorageMoverAgent-AdministrativeShell
1) Show network configuration
2) Update network configuration
3) Test network connectivity
4) Quit

Choice: 3
```
Select menu item 3) *Test network connectivity*.

<!-- The **<!!!!! ARTICLE AND LINK NEEDED !!!!!>** article can help troubleshoot in case you've encountered any issues. -->

> [!IMPORTANT]
> Only proceed to the registration step when your network connectivity test returns no issues.

## Step 3: Register the agent

In this step, you'll register your agent with the storage mover resource you've deployed in an Azure subscription.
[Connect to the administrative shell](#step-1-connect-to-the-agent-vm) of your agent, then select menu item *4) Register*:

```StorageMoverAgent-AdministrativeShell
1) System configuration
2) Network configuration
3) Service and job status
4) Register
5) Open restricted shell
6) Collect support bundle
7) Restart agent
8) Exit

xdmsh> 4
```
You'll be prompted for:
- Subscription ID
- Resource group name
- Storage mover resource name
- Agent name: This name will be shown for the agent in the Azure portal. Select a name that clearly identifies this agent VM for you. Refer to the [resource naming convention](../azure-resource-manager/management/resource-name-rules.md#microsoftstoragesync) to choose a supported name.

Once you've supplied these values, the agent will attempt registration, and requires you to sign into Azure with the credentials that have permissions to the supplied subscription and storage mover resource.

> [!IMPORTANT]
> The Azure credentials you use for registration must have owner permissions to the specified resource group and storage mover resource.

 For authentication, the agent utilizes the [device authentication flow](../active-directory/develop/msal-authentication-flows.md#device-code) with Azure Active Directory.

The agent will display the device auth URL: [https://microsoft.com/devicelogin](https://microsoft.com/devicelogin) and a unique sign-in code. Navigate to the displayed URL on an internet connected machine, enter the code, and sign into Azure with your credentials.

The agent will display detailed progress. Once the registration is complete, you'll be able to see the agent in the Azure portal. It will be under *Registered agents* in the storage mover resource you've registered the agent with.

## Authentication and Authorization

To accomplish seamless authentication with Azure and authorization to various Azure resources, the agent is registered with two Azure services:

1. Azure Storage Mover (Microsoft.StorageMover)
1. Azure ARC (Microsoft.HybridCompute)

### Azure Storage Mover service

Registration to the Azure Storage mover service is visible and manageable through the storage mover resource you've deployed in your Azure subscription. A registered agent is an Azure Resource Manager (ARM) resource. You can only create this resource through the registration process. You can query details about the resource from any Azure Resource Manager client. Clients include the Azure portal, Az PowerShell module PowerShell and Az PowerShell module CLI.

You can reference this Azure Resource Manager (ARM) resource when you want to assign migration jobs to the specific agent VM it symbolizes.

### Azure ARC service

The agent is also registered with the [Azure ARC service](../azure-arc/overview.md). ARC is used to assign and maintain an [Azure AD managed identity](../active-directory/managed-identities-azure-resources/overview.md) for this registered agent.

Azure Storage Mover uses a system-assigned managed identity. A managed identity is a service principal of a special type that can only be used with Azure resources. When the managed identity is deleted, the corresponding service principal is also automatically removed.

The process of deletion is automatically initiated when you unregister the agent. However, there are other ways to remove this identity. Doing so will incapacitate the registered agent and require the agent to be unregistered. Only the registration process can get an agent to obtain and maintain its Azure identity properly.

> [!NOTE]
> During public preview, there is a side effect of the registration with the Azure ARC service. A separate resource of the type *Server-Azure Arc* is also deployed in the same resource group as your storage mover resource. You won't be able to manage the agent through this resource.

 It may appear that you're able to manage aspects of the storage mover agent through the *Server-Azure Arc* resource, but in most cases you can't. It's best to exclusively manage the agent through the *Registered agents* pane in your storage move resource or through the local administrative shell.

> [!WARNING]
> Do not delete the Azure ARC server resource that is created for a registered agent in the same resource group as the storage mover resource. The only safe time to delete this resource is when you previously unregistered the agent this resource corresponds to.

### Authorization

The registered agent needs to be authorized to access several services and resources in your subscription. The managed identity is its way to prove its identity. The Azure service or resource can then decide if the agent is authorized to access it.

The agent is automatically authorized to converse with the Storage Mover service. You won't be able to see or influence this authorization short of destroying the managed identity, for instance by unregistering the agent.

#### Just-in-time authorization

Perhaps the most important resource the agent needs to be authorized for access is the Azure Storage that is the target for a migration job. Authorization takes place through [Role-based access control](../role-based-access-control/overview.md). For an Azure blob container as a target, the registered agent's managed identity is assigned to the built-in role "Storage Blob Data Contributor" of the target container (not the whole storage account).

This assignment is made in the admin's sign-in context in the Azure portal. Therefore, the admin must be a member of the role-based access control (RBAC) control plane role "Owner" for the target container. This assignment is made just-in-time when you start a migration job. It is at this point that you've selected an agent to execute a migration job. As part of this start action, the agent is given permissions to the data plane of the target container. The agent won't be authorized to perform any management plane actions, such as deleting the target container or configuring any features on it.

> [!WARNING]
> Access is granted to a specific agent just-in-time for running a migration job. However, the agent's authorization to access the target is not automatically removed. You must either manually remove the agent's managed identity from a specific target or unregister the agent to destroy the service principal. This action removes all target storage authorization as well as the ability of the agent to communicate with the Storage Mover and Azure ARC services.

## Next steps

Create a project to collate the different source shares that need to be migrated together.
> [!div class="nextstepaction"]
> [Create and manage a project](project-manage.md)
