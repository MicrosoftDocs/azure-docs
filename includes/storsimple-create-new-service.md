<!--author=alkohli last changed:01/14/2016-->

---
title: "include file"
description: "include file"
services: storage
author: alkohli
ms.service: storage
ms.topic: "include"
ms.date: 08/20/2018
ms.author: alkohli
ms.custom: "include file"
---

#### To create a new service
1. Using your Microsoft account credentials, sign in to the Azure classic portal at this URL: [https://manage.windowsazure.com/](https://manage.windowsazure.com/).
2. In the Azure classic portal , click **New** > **Data Services** > **StorSimple Manager** > **Quick Create**.
3. In the form that is displayed, do the following:
   
   1. Supply a unique **Name** for your service. This is a friendly name that can be used to identify the service. The name can have between 2 and 50 characters that can be letters, numbers, and hyphens. The name must start and end with a letter or a number.
   2. Supply a **Location** for your service. In general, choose a Location closest to the geographical region where you want to deploy your device. You may also want to factor in the following: 
      
      * If you have existing workloads in Azure that you also intend to deploy with your StorSimple device, you should use that datacenter.
      * Your StorSimple Manager service and Azure storage can be in two separate locations. In such a case, you are required to create the StorSimple Manager and Azure storage account separately. To create an Azure storage account, go to the Azure Storage service in the Azure classic portal and follow the steps in [Create an Azure Storage account](../articles/storage/common/storage-quickstart-create-account.md). After you create this account, add it to the StorSimple Manager service by following the steps in [Configure a new storage account for the service](../articles/storsimple/storsimple-deployment-walkthrough.md#configure-a-new-storage-account-for-the-service).
   3. Choose a **Subscription** from the drop-down list. The subscription is linked to your billing account. This field is not present if you have only one subscription.
   4. Select **Create a new storage account** to automatically create a storage account with the service. This storage account will have a special name such as "storsimplebwv8c6dcnf." If you need your data in a different location, uncheck this box. 
   5. Click **Create StorSimple Manager** to create the service.
   
   ![Create StorSimple Manager](./media/storsimple-create-new-service/HCS_CreateAService-include.png)
   
   You will be directed to the **Service** landing page. The service creation will take a few minutes. After the service is successfully created, you will be notified appropriately and the status of the service will change to **Active**.
   
   ![Service creation](./media/storsimple-create-new-service/HCS_StorSimpleManagerServicePage-include.png)

![Video available](./media/storsimple-create-new-service/Video_icon.png) **Video available**

To watch a video that demonstrates how to create a new StorSimple Manager service, click [here](https://azure.microsoft.com/documentation/videos/create-a-storsimple-manager-service/).

