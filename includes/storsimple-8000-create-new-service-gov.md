---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---

#### To create a new service
1. Use your Microsoft account credentials to sign in to the [Microsoft Azure Government Portal](https://portal.azure.us/).
2. In the Government Portal, click **+** and then in the marketplace, click **See all**. Search for _StorSimple Physical_. Select and click **StorSimple Physical Device Series** and then click **Create**. Alternatively, in the Government portal, click **+** and then under **Storage**, click **StorSimple Physical Device Series**.
3. In the **StorSimple Device Manager** blade, do the following steps:
   
   1. Supply a unique **Resource name** for your service. This name is a friendly name that can be used to identify the service. The name can have between 2 and 50 characters that can be letters, numbers, and hyphens. The name must start and end with a letter or a number.
   2. Choose a **Subscription** from the drop-down list. The subscription is linked to your billing account. This field is not present if you have only one subscription.
   3. For **Resource group**, **Use existing** or **Create new** group. For more information, see [Azure resource groups](../articles/azure-resource-manager/management/manage-resource-groups-portal.md).
   4. Supply a **Location** for your service. Location refers to the geographical region where you want to deploy your device. Select **USGov Iowa** or **USGov Virginia**.
   5. Select **Create a new storage account** to automatically create a storage account with the service. Specify a name for this storage account. If you need your data in a different location, uncheck this box.
   6. Check **Pin to dashboard** if you want a quick link to this service on your dashboard.
   7. Click **Create** to create the StorSimple Device Manager. The service creation takes a few minutes. After the service is successfully created, you will see a notification and the new service blade opens up.