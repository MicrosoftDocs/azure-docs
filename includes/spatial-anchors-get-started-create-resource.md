---
author: craigktreasure
ms.service: azure-spatial-anchors
ms.topic: include
ms.date: 12/13/2018
ms.author: crtreasu
---
## Create a Spatial Anchors resource

1. Navigate to the <a href="https://portal.azure.com" target="_blank">Azure portal</a>.

2. From the left menu in the Azure portal, select **Create a resource**.

3. Search for "Spatial Anchors" in the search bar.

   ![Search for Spatial Anchors](./media/spatial-anchors-get-started-create-resource/portal-search.png)

4. Select **Spatial Anchors** to open a dialog and select **Create**.

5. In the **Spatial Anchors Account** form:

   1. Specify a unique resource name.
   2. Select the subscription to attach the resource to.
   3. Create a resource group by selecting **Create new** and name the resource group **myResourceGroup** and select **OK**.
      [!INCLUDE [resource group intro text](resource-group.md)]
   4. Select a location (region) where the resource will be placed.
   5. Select **New** to begin creating the resource.

   ![Create a resource](./media/spatial-anchors-get-started-create-resource/create-resource-form.png)

6. After the resource creation has completed successfully, the resource properties can be viewed. Copy the
   resource's **Account ID** value into a text editor, as it will be required later.

   ![View resource properties](./media/spatial-anchors-get-started-create-resource/view-resource-properties.png)

7. Under **Settings**, select **Key**, and copy into a text editor the **Primary key** value. This value is the `Account Key` and will be used later.

   ![View account key](./media/spatial-anchors-get-started-create-resource/view-account-key.png)
