<properties
   pageTitle="Enter maintenance mode"
   description="Explains how to put the StorSimple device into maintenance mode."
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
   ms.date="04/21/2015"
   ms.author="v-sharos" />

#### To enter Maintenance mode

1. In the serial console menu, choose option 1, **Log in with full access**.

2. Type the password. The default password is **Password1**.

3. At the command prompt, type

     `Enter-HcsMaintenanceMode`

4. You will see a warning message telling you that Maintenance mode will disrupt all I/O requests and sever the connection to the Management Portal, and you will be prompted for confirmation. Type **Y** to enter Maintenance mode.

    Both controllers will restart. When the restart is complete, another message will appear indicating that the device is in Maintenance mode.
