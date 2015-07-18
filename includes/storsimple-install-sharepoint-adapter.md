<properties 
   pageTitle="Install StorSimple Adapter for SharePoint | Microsoft Azure"
   description="Describes how to install the StorSimple Adapter for SharePoint in a SharePoint server farm."
   services="storsimple"
   documentationCenter="NA"
   authors="SharS"
   manager="carolz"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="07/17/2015"
   ms.author="v-sharos" />

#### To install the StorSimple Adapter for SharePoint

1. Copy the installer to the web front end (WFE) server that is also configured to run the SharePoint Central Administration web application. 

2. Use an account with administrator privileges to log on to the WFE server.

3. Double-click the installer. The StorSimple Adapter for SharePoint Setup Wizard starts. Click **Next** to begin the installation.

    ![StorSimple adapter setup start page](./media/storsimple-install-sharepoint-adapter/HCS_SSASP_Setup1-include.png)

4. In the StorSimple Adapter for SharePoint setup configuration page, select an installation location, type the IP address for the DATA 0 network interface on your StorSimple device, and then click **Next**. 

    ![StorSimple adapter setup configuration page](./media/storsimple-install-sharepoint-adapter/HCS_SSASP_Setup2-include.png) 

5. In the setup confirmation page, click **Install**.

    ![StorSimple adapter setup confirmation page](./media/storsimple-install-sharepoint-adapter/HCS_SSASP_Confirm_Setup-include.png) 

6. Click **Finish** to close the Setup Wizard.

    ![StorSimple adapter setup finished page](./media/storsimple-install-sharepoint-adapter/HCS_SSASP_Setup_finish-include.png) 

7. Open the SharePoint Central Administration page. You should see a StorSimple Configuration group that contains the StorSimple Adapter for SharePoint links.

8. Go to the next step: [Configure RBS](#configure-rbs).
