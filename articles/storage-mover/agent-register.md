---
title: How to register an Azure Storage Mover agent #Required; page title is displayed in search results. Include the brand.
description: Learn about agent VM registration to run your migration jobs. #Required; article description that is displayed in search results. 
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 08/16/2022
---

<!--

This template provides the basic structure of a HOW-TO article. A HOW-TO article is used to help the customer complete a specific task.

1. H1 (Docs Required)
   Start your H1 with a verb. Pick an H1 that clearly conveys the task the user will complete (example below).

-->

# How to register an Azure Storage Mover agent

<!-- 

2. Introductory paragraph (Docs Required)
   Lead with a light intro that describes what the article covers. Answer the fundamental “why would I want to know this?” question. Keep it short (example provided below).

-->
The Azure Storage Mover service utilizes agents that carry out the migration jobs you configure in the service. The agent is a virtual machine / appliance that you run on a virtualization host, close to the source storage.

In this article you'll learn how to successfully register a previously deployed Storage Mover agent VM. Registration creates a trust relationship with your cloud service and enables the agent to receive migration jobs.

<!-- 
In this article you'll learn how to successfully deploy an agent VM and how you can register it with the cloud service. Registration creates a trust relationship with your cloud service and enables the agent to receive migration jobs.
-->

<!-- 
3. Prerequisites (Optional)
   If you need prerequisites, make them your first H2 in a how-to guide. Use clear and unambiguous language and use a list format. Remove this section if prerequisites are not needed.
-->

## Prerequisites

There are two prerequisites before you can register an Azure Storage Mover agent:
1. You need to have an Azure Storage Mover resource deployed. </br>Follow the steps in the <!!!!! ARTICLE AND LINK NEEDED !!!!!> article to deploy this resource in an Azure subscription and region of your choice.
1. You need to deploy the Azure Storage Mover agent VM. </br> Follow the steps in the [Azure Storage Mover agent VM deployment](agent-deploy.md) article to run the agent VM and to get it connected to the internet.



<!-- Before you can follow the steps in this article, download the agent VM image from Microsoft Download Center. [https://aka.ms/StorageMover/agent](https://aka.ms/StorageMover/agent)

The downloaded agent is a VM disk image, packaged in a zip file. Unzip the VM disk image and store it in a place on your HyperV host that your -->

<!-- 
4. H2s (Docs Required)

Prescriptively direct the customer through the procedure end-to-end. Don't link to other content (until 'next steps'), but include whatever the customer needs to complete the scenario in the article. -->

## Registration overview

:::image type="content" source="media/agent-register/agent-registration-title.png" alt-text="Image showing three components. The storage mover agent, deployed on-premises and close to the source data to be migrated. The storage mover cloud resource, deployed in an Azure resource group. And finally, a line connecting the two." lightbox="media/agent-register/agent-registration-title-large.png":::

Registration creates trust between the agent and the cloud resource. It allows you to remotely manage the agent and to give it migration jobs to execute.

Registration is always initiated from the agent. For security purposes, trust can only be created by the agent reaching out to the Storage Mover service. The registration procedure utilizes your Azure credentials and permissions on the storage mover resource you've previously deployed. If you don't have a storage mover cloud resource or an agent VM deployed yet, refer to the [prerequisites section](#prerequisites).

## Step 1: Connect to the agent VM

The agent VM is an appliance, that means it offers an administrative shell that limits which operations you can perform on this machine. When you connect to this VM, for instance directly from your HyperV host, you'd see that shell loaded and can interact with it directly.

However, the agent VM is a Linux based appliance and copy/paste doesn't work very well within the default HyperV window. Use an SSH connection instead. Advantages of an SSH connection are:
- You can connect to the agent VM's shell from any management machine and don't need to be logged into the HyperV host.
- Copy / paste is fully supported.

From a machine on the same subnet, run an ssh command:

```powershell
ssh <AgentIpAddress> -l admin
```

> [!IMPORTANT]
> A freshly deployed Storage Mover agent has a default password: </br>**Local user:** admin </br>**Default password:** admin

A freshly deployed Storage Mover agent has a default password. You are prompted and strongly advised to change it immediately after you first connect to it. Note down the new password, there is no process to recover it. Losing your password locks you out from the administrative shell. Cloud management does not require this local admin password. If the agent was previously registered, you can still use it for migration jobs. Agents are somewhat disposable. They hold little value beyond the current migration job they are executing. You can always deploy a new agent and use that instead to run the next migration job. 

> [!NOTE]
> Losing the local account password during public preview precludes you from accessing your detailed copy logs.

## Step 2: Test network connectivity

Your agent needs to be connected to the internet. The article **<!!!!! ARTICLE AND LINK NEEDED !!!!!>** showcases connectivity requirements and options.

When logged into the administrative shell, you can test the agents connectivity state:

```powershell
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

```powershell
1) Show network configuration
2) Update network configuration
3) Test network connectivity
4) Quit

Choice: 3
```
Select menu item 3) *Test network connectivity*.

The **<!!!!! ARTICLE AND LINK NEEDED !!!!!>** article can help troubleshoot in case you've encountered any issues.

> [!IMPORTANT]
> Only proceed to the registration step when your network connectivity test returns no issues.

## Step 3: Register the agent

In this step, you'll register your agent with the storage mover resource you've deployed in an Azure subscription.
[Connect to the administrative shell](#step-1-connect-to-the-agent-vm) of your agent, then select menu item *4) Register*:

```powershell
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
You will be prompted for:
- Subscription ID
- Resource group name
- Storage mover resource name
- Agent name: This name will be shown for the agent in the Azure portal. Select a name that clearly identifies this agent VM for you. Refer to the [resource naming convention](../azure-resource-manager/management/resource-name-rules.md#microsoftstoragesync) to choose a supported name.

Once you've supplied these values, the agent will attempt registration and requires you to sign into Azure with the credentials that have permissions to the supplied subscription and storage mover resource. 

> [!IMPORTANT]
> The Azure credentials you use for registration must have owner permissions to the specified resource group and storage mover resource.

 For authentication, the agent utilizes the [device authentication flow](../active-directory/develop/msal-authentication-flows.md#device-code) with Azure Active Directory.

The agent will display the device auth URL: [https://microsoft.com/devicelogin](https://microsoft.com/devicelogin) and a unique logon code. Navigate to the displayed URL on an internet connected machine, enter the code, and sign into Azure with your credentials.

The agent will display detailed progress and once the registration is complete, you will be able to see the agent in the Azure portal under *Registered agents* in the storage mover resource you've registered the agent with.

## Authentication and Authorization

To accomplish seamless authentication with Azure and authorization to various Azure resources, the agent is actually registered with two Azure services:
1. Azure Storage Mover (Microsoft.StorageMover)
1. Azure ARC (Microsoft.HybridCompute)

### Azure Storage Mover service

Registration to the Azure Storage mover service is visible and manageable through the storage mover resource you've deployed in your Azure subscription. A registered agent is an Azure Resource Manager (ARM) resource. You can only create this resource through the registration process but you can query details about the resource from any ARM client, such as the Azure portal, Az PowerShell and Az CLI. 

You can reference this ARM resource when you want to assign migration jobs to the specific agent VM it symbolizes.

### Azure ARC service

The agent is also registered with the Azure ARC service. ARC is used to assign and maintain an [AAD managed identity](../active-directory/managed-identities-azure-resources/overview.md) for this registered agent. 

Azure Storage Mover uses a System-assigned managed identity. A managed identity is a service principal of a special type that can only be used with Azure resources. When the managed identity is deleted, the corresponding service principal is automatically removed.

The process of deletion is automatically initiated when you unregister the agent. However, there are additional ways to remove this identity. Doing so will incapacitate the registered agent and require the agent to be unregistered. Only the registration process can get an agent to obtain and maintain its Azure identity properly.

> [!NOTE]
> During public preview, there is a side effect of the registration with the Azure ARC service. A separate resource of the type *Server-Azure Arc* is also deployed in the same resource group as your storage mover resource.
> 
> While it appears that you may be able to manage aspects of the storage mover agent, in most cases you cannot. It is best to ignore this Arc server resource and focus on exclusively managing the agent through the *Registered agents* blade in your storage move resource or through the local administrative shell.

> [!WARNING]
> Do not delete the Azure ARC server resource that is created for a registered agent in the same resource group as the storage mover resource. The only safe time to delete this resource is when you previously unregistered the agent this resource corresponds to.
 
### Authorization

The registered agent needs to be authorized to several services and resources in your subscription. The managed identity is its way to prove its identity. The Azure service or resource can then decide if the agent is authorized to access it.

The agent is automatically authorized to converse with the Storage Mover service. You won't be able to see or influence this authorization short of destroying the managed identity, for instance by un-registering the agent.

#### Just-in-Time authorization

Perhaps the most important resource the agent needs to be authorized for access is the Azure Storage that is the target for a migration job. [Role-based access control](../role-based-access-control/overview.md) is used for that. For an Azure blob container as a target, the registered agent's managed identity is assigned to the built-in role "Storage Blob Data Contributor" of the target container (not the whole storage account).

This assignment is made in the admin's logon context in the Azure portal. That means you must be a member of the control plane role "Owner" for the target container. This assignment is made just-in-time when you start a migration job. That is the definitive moment where you have selected an agent to execute a migration job. As part of this start action, the agent is given permissions to the target container. 

> [!WARNING]
> Access is granted to a specific agent just-in-time for running a migration job. However, the agent's authorization to access the target is not automatically removed. You must either manually remove the agent's managed identity from a specific target or unregister the agent to destroy the service principal. This action removes all target storage authorization as well as the ability of the agent to communicate with the Storage Mover and Azure ARC services.

## Next steps

> [!div class="nextstepaction"]
> [Create a project and job definition to utilize your agent](projects-manage.md)
