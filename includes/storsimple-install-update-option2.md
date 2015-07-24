<properties 
   pageTitle="Option 2: Use the Azure Management Portal to apply Update 1"
   description="Explains how to use the Management Portal to install StorSimple 8000 Series Update 1."
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
   ms.date="05/14/2015"
   ms.author="v-sharos" />

#### To install Update 1 from the Azure Management Portal

1. In the Management Portal, go to the **Devices** page and select your device.
 
2. Navigate to **Devices** > **Configure**. 

3. Under **Network Interfaces**, locate the network interface that has a gateway assigned. This will be a network interface other than DATA 0. 

4. Clear the gateway setting. Note that because gateway settings are required on a cloud-enabled network interface, you will need to disable the cloud access for this interface to clear the setting.

5. Repeat step 4 for any other network interface that has a gateway assigned (excluding DATA 0).

6. Save the modified configuration.

7. You can now [use the Management Portal to install Update 1](#use-the-management-portal-to-install-update-1). 


