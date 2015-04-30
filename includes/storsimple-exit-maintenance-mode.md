<properties
   pageTitle="Exit maintenance mode"
   description="Explains how to exit StorSimple Maintenance mode, which returns your device to Normal mode."
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

#### To exit Maintenance mode

1. At the command prompt type:

     `Exit-HcsMaintenanceMode`

2. A warning message and a confirmation message will appear. Type **Y** to exit Maintenance mode.

    Both controllers will restart. When the restart is complete, another message will appear indicating that the device is in Normal mode.