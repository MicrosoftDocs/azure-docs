---
title: Tutorial - Use revisions in API Management for safe nonbreaking API changes 
titleSuffix: Azure API Management
description: Follow the steps of this tutorial to learn how to make nonbreaking API changes using revisions in Azure API Management.
services: api-management
author: dlepow
ms.service: azure-api-management
ms.custom: mvc, devx-track-azurecli, devdivchpfy22
ms.topic: tutorial
ms.date: 11/27/2024
ms.author: danlep

---

# Tutorial: Use revisions to make nonbreaking API changes safely

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

When your API is ready to go and is used by developers, you eventually need to make changes to that API and at the same time not disrupt callers of your API. It's also useful to let developers know about the changes you made.

In Azure API Management, use *revisions* to make nonbreaking API changes so you can model and test changes safely. When ready, you can make a revision current and replace your current API.

For background, see [Versions](api-management-versions.md) and [Revisions](api-management-revisions.md).

[!INCLUDE [api-management-workspace-try-it](../../includes/api-management-workspace-try-it.md)]

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a new revision
> * Make nonbreaking changes to your revision
> * Make your revision current and add a change log entry
> * Browse the developer portal to see changes and change log
> * Access an API revision

:::image type="content" source="media/api-management-get-started-revise-api/azure-portal.png" alt-text="Screenshot of API revisions in the Azure portal." lightbox="media/api-management-get-started-revise-api/azure-portal.png":::

## Prerequisites

+ Learn the [Azure API Management terminology](api-management-terminology.md).
+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Also, complete the following tutorial: [Import and publish your first API](import-and-publish.md).

## Add a new revision

1. Sign in to the [Azure portal](https://portal.azure.com), and go to your API Management instance.
1. In the left menu, under **APIs**, select **APIs**.
2. Select **Swagger Petstore** from the API list (or another API to which you want to add revisions).
3. Select the **Revisions** tab.
4. Select **+ Add revision**.

   :::image type="content" source="media/api-management-get-started-revise-api/07-add-revisions-01-add-new-revision.png" alt-text="Screenshot of adding an API revision in the portal.":::

    > [!TIP]
    > You can also select **Add revision** in the context menu (**...**) of the API.

5. Provide a description for your new revision, to help remember what it is used for.
6. Select **Create**.
7. Your new revision is now created.

    > [!NOTE]
    > Your original API remains in **Revision 1**. This is the revision your users continue to call, until you choose to make a different revision current.

## Make nonbreaking changes to your revision

1. Select **Swagger Petstore** from the API list.
1. Select the **Design** tab near the top of the screen.
1. Notice that the **revision selector** (directly above the design tab) shows **Revision 2** as currently selected.

    > [!TIP]
    > Use the revision selector to switch between revisions that you wish to work on.
1. Select **+ Add Operation**.
1. Set your new operation to **POST**, and the  **Display name**, **Name**, and **URL** of the operation as **test**.
1. **Save** your new operation.

   :::image type="content" source="media/api-management-get-started-revise-api/07-add-revisions-02-make-changes.png" alt-text="Screenshot showing how to add an operation in a revision in the portal.":::
1. You've now made a change to **Revision 2**. Use the **revision selector** near the top of the page to switch back to **Revision 1**.
1. Notice that your new operation doesn't appear in **Revision 1**. 

## Make your revision current and add a change log entry

### [Portal](#tab/azure-portal)

1. Select the **Revisions** tab from the menu near the top of the page.
1. Open the context menu (**...**) for **Revision 2**.
1. Select **Make current**.
1. Select the **Post to Public Change log for this API** checkbox, if you want to post notes about this change. Provide a description for your change that the developers can see, for example: **Testing revisions. Added new "test" operation.**
1. **Revision 2** is now current.

    :::image type="content" source="media/api-management-get-started-revise-api/revisions-menu.png" alt-text="Screenshot of revision menu in Revisions window in the portal." lightbox="media/api-management-get-started-revise-api/revisions-menu.png":::

### [Azure CLI](#tab/azure-cli)

To begin using Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

Use this procedure to create and update a release.

1. Run the [az api list](/cli/azure/apim/api#az-apim-api-list) command to see your API IDs:

   ```azurecli
   az apim api list --resource-group apim-hello-word-resource-group \
       --service-name apim-hello-world --output table
   ```

   The API ID to use in the next command is the `Name` value. The API revision is in the `ApiRevision` column.

1. To create the release, with a release note, run the [az apim api release create](/cli/azure/apim/api/release#az-apim-api-release-create) command:

   ```azurecli
   az apim api release create --resource-group apim-hello-word-resource-group \
       --api-id swagger-petstore --api-revision 2 --service-name apim-hello-world \
       --notes 'Testing revisions. Added new "test" operation.'
   ```

   The revision that you release becomes the current revision.

1. To see your releases, use the [az apim api release list](/cli/azure/apim/api/release#az-apim-api-release-list) command:

   ```azurecli
   az apim api release list --resource-group apim-hello-word-resource-group \
       --api-id swagger-petstore --service-name apim-hello-world --output table
   ```

   The notes you specify appear in the change log. You can see them in the output of the previous command.

1. When you create a release, the `--notes` parameter is optional. You can add or change the notes later using the [az apim api release update](/cli/azure/apim/api/release#az-apim-api-release-update) command:

   ```azurecli
   az apim api release update --resource-group apim-hello-word-resource-group \
       --api-id swagger-petstore --release-id 00000000000000000000000000000000 \
       --service-name apim-hello-world --notes "Revised notes."
   ```

   Use the value in the `Name` column for the release ID.

You can remove any release by running the [az apim api release delete ](/cli/azure/apim/api/release#az-apim-api-release-delete) command:

```azurecli
az apim api release delete --resource-group apim-hello-word-resource-group \
    --api-id swagger-petstore --release-id 00000000000000000000000000000000 
    --service-name apim-hello-world
```

---

## Browse the developer portal to see changes and change log

If you've tried the [developer portal](api-management-howto-developer-portal-customize.md), you can review the API changes and change log there.

1. In the Azure portal, navigate to your API Management instance.
1. In the left menu, under **APIs**, select **APIs**.
1. Select **Developer portal** from the top menu.
1. In the developer portal, select **APIs**, and then select **Swagger Petstore**.
1. Notice your new **test** operation is now available.
1. Select **Changelog** near the API name.
1. Notice that your change log entry appears in the list.


## Access an API revision

Each revision to your API can be accessed using a specially formed URL. Add `;rev={revisionNumber}` at the end of your API URL path, but before the query string, to access a specific revision of that API. For example, you might use a URL similar to the following to access revision 2 of the Swagger Petstore API:

`https://apim-hello-world.azure-api.net/store/pet/1;rev=2/`

You can find the URL paths for your API's revisions on the **Revisions** tab in the Azure portal.

:::image type="content" source="media/api-management-get-started-revise-api/revision-url-path.png" alt-text="Screenshot of revision URLs in the portal.":::

> [!TIP]
> You can access the *current* revision of your API using the API path without the `;rev` string, in addition to the full URL that appends `;rev={revisionNumber}` to your API path.


## Summary

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Add a new revision
> * Make nonbreaking changes to your revision
> * Make your revision current and add a change log entry
> * Browse the developer portal to see changes and change log
> * Access an API revision

## Next steps

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Publish multiple versions of your API](api-management-get-started-publish-versions.md)
