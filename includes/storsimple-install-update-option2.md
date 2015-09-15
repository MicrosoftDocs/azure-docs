<properties 
   pageTitle="Option 2: Use the Azure Management Portal to apply Update 1.2"
   description="Explains how to use the Management Portal to install StorSimple 8000 Series Update 1.2."
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
   ms.date="09/08/2015"
   ms.author="v-sharos" />

#### To install Update 1.2 from the Azure Management Portal

1. In the Management Portal, go to the **Devices** page and select your device.
 
2. Navigate to **Devices** > **Configure**. 

3. Under **Network Interfaces**, first verify that you have at least one network interface that is iSCSI-enabled. Then locate the network interface (other than DATA 0) that has a gateway assigned. 

4. Disable the network interface that has an assigned gateway and save the modified configuration. Note the network interface settings are retained and so when you re-enable this network interface later, the portal will revert to the original settings.

7. You can now [use the Management Portal to install Update 1.2](#use-the-management-portal-to-install-update-1). Follow the instructions starting from step 3 of this procedure. After you have installed all the updates, you can re-enable the network interface that you disabled. 




