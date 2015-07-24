<properties
   pageTitle="Install regular updates via Windows PowerShell for StorSimple"
   description="Explains how to use the StorSimple update feature and Windows PowerShell for StorSimple to install  regular updates."
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
   ms.date="04/27/2015"
   ms.author="v-sharos" />

#### To install regular updates via Windows PowerShell for StorSimple

1. Open the device serial console and select option 1, **Log in with full access**. Type the password. The default password is *Password1*. 

2. At the command prompt, type:

     `Get-HcsUpdateAvailability`
    
    You will be notified if updates are available and whether the updates are disruptive or non-disruptive.

3. At the command prompt, type:

     `Start-HcsUpdate`

    The update process with start.

> [AZURE.IMPORTANT]
>
> - This command applies only to regular updates. You run this command on only one controller, but both controllers will be updated. 
> - You may notice a controller failover during the update process; however, the failover will not affect system availability or operation.
