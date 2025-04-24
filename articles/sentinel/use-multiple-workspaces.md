---
title: Set up multiple workspaces and tenants in Microsoft Sentinel
description: If you've defined that your environment needs multiple workspaces, you now set up your multiple workspace architecture in Microsoft Sentinel.
author: cwatson-cat
ms.topic: how-to
ms.date: 03/17/2025
ms.author: cwatson
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal

#Customer intent: As a security architect, I want to use Microsoft Sentinel across multiple workspaces so that I can efficiently monitor and analyze security data across my entire organization.

---

# Set up multiple workspaces and tenants in Microsoft Sentinel

When you planned your deployment, you determined whether a multiple workspace architecture is relevant for your environment. If your environment requires multiple workspaces, you can now set them up as part of your deployment. For more information, see [Prepare for multiple workspaces and tenants in Microsoft Sentinel](prepare-multiple-workspaces.md).

In this article, you learn how to set up Microsoft Sentinel to extend across multiple workspaces and tenants. This article is part of the [Deployment guide for Microsoft Sentinel](deploy-overview.md).

## Options for using multiple workspaces

After you set up your environment to extend across workspaces, you can: 

- **Manage and monitor your cross-workspace architecture**: Query and analyze your data across workspaces and tenants. 
  - If your organization onboards Microsoft Sentinel to the Microsoft Defender portal, see [Multiple Microsoft Sentinel workspaces in the Defender portal](workspaces-defender-portal.md) and [Microsoft Defender multitenant management](/defender-xdr/mto-overview).
  - To work in the Azure portal, see [Extend Microsoft Sentinel across workspaces and tenants](extend-sentinel-across-workspaces-tenants.md).

- **Manage multiple workspaces**: 
  Centrally manage multiple workspaces within one or more tenants. 
  - For the Defender portal, see [Multiple Microsoft Sentinel workspaces in the Defender portal](workspaces-defender-portal.md) and [Microsoft Defender multitenant management](/defender-xdr/mto-overview).
  - To work in the Azure portal, see [Centrally manage multiple Microsoft Sentinel workspaces with workspace manager](workspace-manager.md)  within one or more Azure tenants.

For each tenant, the Defender portal allows you to connect to one primary workspace and multiple secondary workspaces for Microsoft Sentinel (preview). For more information, see [Microsoft Defender multitenant management](/defender-xdr/mto-overview).

## Next steps

In this article, you learned how to set up Microsoft Sentinel to extend across multiple workspaces and tenants.

> [!div class="nextstepaction"]
>>[Enable User and Entity Behavior Analytics (UEBA)](enable-entity-behavior-analytics.md)
