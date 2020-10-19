---
title: Tutorial - Use revisions in API Management to make non-breaking API changes safely 
titleSuffix: Azure API Management
description: Follow the steps of this tutorial to learn how to make non-breaking changes using revisions in API Management.
services: api-management
documentationcenter: ''
author: vladvino
ms.service: api-management
ms.custom: mvc
ms.topic: tutorial
ms.date: 10/19/2020
ms.author: apimpm

---

# Tutorial Use revisions to make non-breaking API changes safely
When your API is ready to go and starts to be used by developers, you eventually need to make changes to that API and at the same time not disrupt callers of your API. It's also useful to let developers know about the changes you made. In Azure API Management, use *revisions* to make non-breaking API changes so you can model and test changes safely. When ready, you can make a revision current and replace your current API. 

For background, see [Versions & revisions](https://azure.microsoft.com/blog/versions-revisions/) and [API Versioning with Azure API Management](https://azure.microsoft.com/blog/api-versioning-with-azure-api-management/).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a new revision
> * Make non-breaking changes to your revision
> * Make your revision current and add a change log entry
> * Browse the developer portal to see changes and change log

:::image type="content" source="media/api-management-getstarted-revise-api/azure-portal.png" alt-text="API revisions in the Azure portal":::

## Prerequisites

+ Learn the [Azure API Management terminology](api-management-terminology.md).
+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Also, complete the following tutorial: [Import and publish your first API](import-and-publish.md).

## Add a new revision

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.
1. Select **APIs**.
2. Select **Demo Conference API** from the API list (or other API to which you want to add revisions).
3. Select the **Revisions** tab.
4. Select **+ Add Revision**,
   :::image type="content" source="media/api-management-getstarted-revise-api/07-add-revisions-01-add-new-revision.png" alt-text="Add API revision":::

    > [!TIP]
    > You can also select **Add Revision** in the context menu (**...**) of the API.

5. Provide a description for your new revision, to help remember what it will be used for.
6. Select **Create**,
7. Your new revision is now created.

    > [!NOTE]
    > Your original API remains in **Revision 1**. This is the revision your users continue to call, until you choose to make a different revision current.

## Make non-breaking changes to your revision

1. Select **Demo Conference API** from the API list.
1. Select the **Design** tab near the top of the screen.
1. Notice that the **revision selector** (directly above the design tab) shows **Revision 2** as currently selected.

    > [!TIP]
    > Use the revision selector to switch between revisions that you wish to work on.
1. Select **+ Add Operation**.
1. Set your new operation to be **POST**, and the Name, Display Name and URL of the operation as **test**.
1. **Save** your new operation.
   :::image type="content" source="media/api-management-getstarted-revise-api/07-add-revisions-02-make-changes.png" alt-text="Modify revision":::
1. You've now made a change to **Revision 2**. Use the **Revision Selector** near the top of the page to switch back to **Revision 1**.
1. Notice that your new operation does not appear in **Revision 1**. 

## Make your revision current and add a change log entry

1. Select the **Revisions** tab from the menu near the top of the page.
1. Open the context menu (**...**) for **Revision 2**.
1. Select **Make Current**.
1. Select **Post to Public Change log for this API**, if you want to post notes about this change. Provide a description for your change that developers see, for example: **Testing revisions. Added new "test" operation.**
1. **Revision 2** is now current.

:::image type="content" source="media/api-management-getstarted-revise-api/revisions-menu.png" alt-text="Revision menu in Revisions window":::


## Browse the developer portal to see changes and change log

If you've tried the [developer portal](api-management-howto-developer-portal-customize.md), you can review the API changes and change log there.

1. In the Azure portal, select **APIs**.
1. Select **Developer portal** from the top menu.
1. In the developer portal, select **APIs**, and then select **Demo Conference API**.
1. Notice your new **test** operation is now available.
1. Click on **Changelog** near the API name.
1. Notice that your change log entry appears in this list.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Add a new revision
> * Make non-breaking changes to your revision
> * Make your revision current and add a change log entry
> * Browse the developer portal to see changes and change log

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Publish multiple versions of your API](api-management-get-started-publish-versions.md)
