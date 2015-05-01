<properties 
   pageTitle="Create a new StorSimple Manager service"
   description="Describes how to create a new instance of the StorSimple Manager service."
   services="storsimple"
   documentationCenter="NA"
   authors="SharS"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="04/28/2015"
   ms.author="v-sharos" />


#### To create a new service

1. Use your Microsoft account credentials to log on to the Microsoft Azure Management Portal here: [Azure Management Portal](https://manage.windowsazure.com/).

2. In the Management Portal, click **New** > **Data Services** > **StorSimple Manager** > **Quick Create**.

3. In the form that is displayed, do the following:
  1. Supply a unique **Name** for your service. This is a friendly name that can be used to identify the service. The name can have between 2 and 50 characters that can be letters, numbers, and hyphens. The name must start and end with a letter or a number.
  2. Supply a **Location** for your service. Location refers to the geographical region where you want to deploy your device.
  3. Choose a **Subscription** from the drop-down list. The subscription is linked to your billing account. This field is not present if you have only one subscription.
  4. Select **Create a new storage account** to automatically create a storage account with the service. This storage account will have a special name such as "storsimplebwv8c6dcnf."
  5. Click **Create StorSimple Manager** to create the service.

       ![create a service](./media/storsimple-create-new-service/HCS_CreateAService-include.png)

     You will be directed to the **Service** landing page. The service creation will take a few minutes. After the service is successfully created, you will be notified appropriately and the status of the service will change to **Active**.
 
       ![service creation](./media/storsimple-create-new-service/HCS_StorSimpleManagerServicePage-include.png)
