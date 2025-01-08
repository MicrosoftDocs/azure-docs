---
title: Manage a Neon resource through the Azure portal (Preview)
description: This article describes management functions for Neon on the Azure portal.
author: ProfessorKendrick
ms.topic: how-to
ms.custom:

ms.date: 12/04/2024
---

# Manage your Neon integration through the portal (Preview)

This article describes how to access the Neon Console and how to delete the Neon Serverless Postgres (Preview) resource using the Azure portal.

## Single sign-on

Single sign-on (SSO) is already enabled when you create your Neon resource. To access Neon through SSO, follow these steps:

1. Navigate to the **Overview** for your instance of the Neon resource. 

1. Select the portal SSO URL.

   :::image type="content" source="media/manage/overview.png" alt-text="Screenshot from the Azure portal showing the Neon SSO URL.":::

> [!NOTE] 
> The first time you access this URL, depending on your Azure tenant settings, you might be asked to verify your email address on the Neon portal. Once the email address is verified, you can access the Neon portal.

## Delete a Neon resource

Once the Neon resource is deleted, all billing stops for that resource through Azure Marketplace. If you're done using your resource and would like to delete it, follow these steps:

1. From the **Resource** menu, select the Neon resource you would like to delete.

1. On the working pane of the **Overview** menu, select **Delete**.

1. Confirm deletion.

1. Select a reason for deleting the resource.

1. Select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Neon Serverless Postgres developer resources and tools](tools.md)
