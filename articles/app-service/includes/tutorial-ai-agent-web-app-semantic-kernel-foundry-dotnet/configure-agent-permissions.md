---
title: Configure permissions for Foundry project resource
description: Steps to assign the required Azure role for your App Service app to access the Foundry project resource.
ms.author: cephalin
ms.topic: include
ms.date: 08/27/2026
ms.service: azure-app-service
---

1. In the Foundry portal, select **Manage** in the top menu.

1. In **Project details**, select **Open in Azure portal**.

    From the Azure portal, you can assign role-based access for the project.

1. Add the following role for both the App Service app's managed identity and the user you use with `az login`:

    | Target resource                | Required role                       | Needed for              |
    |--------------------------------|-------------------------------------|-------------------------|
    | Foundry Project       | Foundry User                       | Reading and calling the Foundry agent. |

    For instructions, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).
