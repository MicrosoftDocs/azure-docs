<properties
   pageTitle="Install regular hotfixes"
   description="Explains how to use Windows PowerShell for StorSimple to install regular hotfixes."
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
   ms.date="04/29/2015"
   ms.author="v-sharos" />

#### To install regular hotfixes via Windows PowerShell for StorSimple

1. Connect to the device serial console. For more information, see [Connect to the serial console](#connect-to-the-serial-console).

2. In the serial console menu, select option 1, **Log in with full access**. Type the password. The default password is **Password1**.

3. At the command prompt, type:

     `Start-HcsHotfix`

     > [AZURE.IMPORTANT]
     >
     > - This command applies only to regular hotfixes. You run this command on only one controller, but both controllers will be updated.
     > - You may notice a controller failover during the update process; however, the failover will not affect system availability or operation.

4. When prompted, supply the path to the network shared folder that contains the hotfix files.

5. You will be prompted for confirmation. Type **Y** to proceed with the hotfix installation.
