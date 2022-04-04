---
title: Connect a classic Video Analyzer for Media account to ARM
description: This topic explains how to connect an existing classic paid Azure Video Analyzer for Media account to an ARM-based account
ms.topic: how-to
ms.author: itnorman
ms.date: 10/19/2021
ms.custom: ignite-fall-2021
---

# Connect an existing classic paid Video Analyzer for Media account to ARM-based account  

This article details how to connect an existing classic paid Azure Video Analyzer for Media account to an Azure Resource Manager (ARM) based account.
Today, Azure Video Analyzer for Media (formerly Video Indexer), is a GA(general availability) product that is not an ARM resource on Azure.
In this article, we will go through options on connecting your **existing** Video Analyzer for Media account to [ARM][docs-arm-overview].

## Prerequisites

* Unlimited paid Video Analyzer for Media account (classic account).

  * To perform the connect to the ARM (Azure Resource Manager) action, you should have owner's permissions on the Video Analyzer for Media account.
* Azure Subscription.
* User assigned managed identity (can be created along the flow).

## Transition state

Connecting a classic account to be ARM-based triggers a 30 days of a transition state. In the transition state, an existing account can be accessed by generating an access token using both:

* Access token [generated through API Management](https://aka.ms/avam-dev-portal)(classic way) 
* Access token [generated through ARM](/rest/api/videoindexer/generate/access-token) 

The transition state moves all account management functionality to be managed by ARM and will be handled by [Azure RBAC][docs-rbac-overview]. 

The [invite users](invite-users.md) feature in the Video Analyzer for Media portal gets disabled. The invited users on this account lose their access to the Video Analyzer for Media account Media in the portal.  
However, this can be resolved by assigning the right role-assignment to these users through Azure RBAC, see [How to assign RBAC][docs-rbac-assignment]. 

Only the account owner, who performed the connect action, is automatically assigned as the owner on the connected account. When [Azure policies][docs-governance-policy] are enforced, they override the settings on the account.

If users are not added through Azure RBAC to the account after 30 days, they will lose access through API as well as Video Analyzer for Media portal.  
After the transition state ends, users will only be able to generate a valid access token through through ARM, making Azure RBAC the exclusive way to manage role-based access control on the account.

> [!NOTE]
> If there are invited users you wish to remove access from, do it before connecting the account to ARM. 

Before the end of the 30 days of transition state, you can remove access from users through the Azure Video Analyzer for Media portal on the account settings page.

## Get started

### Browse to [Video Analyzer for Media portal](https://aka.ms/vi-portal-link)

1. Sign in using your Azure AD account.
1. On the top right bar press *User account* to open the side pane account list.
1. Select the Video Analyzer for Media classic account you wish to connect to ARM (classic accounts will be tagged with a *classic tag*).
1. Click **Settings**.

    ![account-settings](media/connect-classic-account-to-arm/user-account-settings.png)
1. Click **Connect to an ARM-based account**.

    ![connect-button-portal](media/connect-classic-account-to-arm/connect-button.png)
1. Sign to Azure portal.
1. The Video Analyzer for Media create blade will open.
1. In the **Create Video Analyzer for Media account** section enter required values.

    * If you followed the steps the fields should be auto-populated, make sure to validate the eligible values.

    ![connect-to-arm](media/connect-classic-account-to-arm/connect-blade-new.png)

    | Name | Description |
    | ---|---|
    |**Subscription**| The subscription currently contains the classic account and other related resources such as the Media Services.|
    |**Resource Group**|Select an existing resource or create a new one. The resource group must be the same location as the classic account being connected|
    |**Video Analyzer for Media account** (radio button)| Select the *"Connecting an existing classic account"*.|
    |**Existing account ID**| Enter the ID of existing Video Analyzer for Media classic account.|
    |**Resource name**|Enter the name of the new Video Analyzer for Media account. Default value would be the same name the account had as classic.|
    |**Location**|The geographic region can't be changed in the connect process, the connected account must stay in the same region. |
    |**Media Services account name**|The original Media Services account name that was associated with classic account.|
    |**User-assigned managed identity**|Select a user-assigned managed identity, or create a new one. Video Analyzer for Media account will use it to access the Media services. The user-assignment managed identity will be assigned the roles of Contributor for the Media Service account.|
1. Click **Review + create** at the bottom of the form.

## After connecting to ARM is complete 

After successfully connecting your account to ARM, it is recommended to make sure your account management APIs are replaced with [Video Analyzer for Media REST API](/rest/api/videoindexer/accounts?branch=videoindex).
As mentioned in the beginning of this article, during the 30 days of the transition state, “[Get-access-token](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Account-Access-Token)” will be supported side by side the ARM-based “[Generate-Access token](/rest/api/videoindexer/generate/access-token)”.
Make sure to change to the new "Generate-Access token" by updating all your solutions that use the API.
 
APIs to be changed:

- Get Access token for each scope: Account, Project & Video.
- Get account – the account’s details.
- Get accounts – List of all account in a region.
- Create paid account – would create a classic account.
 
For a full description of [Video Analyzer for Media REST API](/rest/api/videoindexer/accounts?branch=videoindex) calls and documentation, follow the link.

For code sample generating an access token through ARM see [C# code sample](https://github.com/Azure-Samples/media-services-video-indexer/blob/master/ApiUsage/ArmBased/Program.cs).

### Next steps

Learn how to [Upload a video using C#](https://github.com/Azure-Samples/media-services-video-indexer/tree/master/ApiUsage/ArmBased).
  
<!-- links -->
[docs-arm-overview]: ../../azure-resource-manager/management/overview.md
[docs-rbac-overview]: ../../role-based-access-control/overview.md
[docs-rbac-assignment]: ../../role-based-access-control/role-assignments-portal.md
[docs-governance-policy]: ../../governance/policy/overview.md
