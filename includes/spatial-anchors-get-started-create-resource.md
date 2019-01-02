---
author: craigktreasure
ms.service: spatial-anchors
ms.topic: include
ms.date: 12/13/2018
ms.author: crtreasu
---
## Create a Spatial Anchors Account

Navigate to the <a href="https://portal.azure.com" target="_blank">Azure portal</a>.

From the left menu in the Azure portal, select **Create a resource**.

Search for "Spatial Anchors" in the search bar.

Select **Spatial Anchors (preview)** to open a dialog and select **Create**.

In the **Spatial Anchors Account** form:

1. Specify a unique resource name.
2. Select the subscription to attach the resource to.
3. Create a resource group by selecting **Create new** and name the resource group **myResourceGroup** and select **OK**.
   [!INCLUDE [resource group intro text](resource-group.md)]
4. Select a location (region) where the resource will be placed.
5. Select **New** to begin creating the resource.

![](./media/spatial-anchors-get-started-create-resource/create-resource-form.png)

After the resource creation has completed successfully, the resource properties can be viewed. Make note of the
resource's **Endpoint** value as it will be required later.

![](./media/spatial-anchors-get-started-create-resource/view-resource-properties.png)

Under **Settings**, select **Key** and make a note of the **Key** value. This value is the `Account Key` and will be used later.
