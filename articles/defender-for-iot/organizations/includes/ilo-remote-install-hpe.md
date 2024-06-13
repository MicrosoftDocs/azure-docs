---
title: include
author: batamig
ms.date: 01/15/2023
ms.topic: include
---

<!-- docutune:disable -->

### Install iLO remotely from a virtual drive

This procedure describes how to install iLO software remotely from a virtual drive.

Before installing the iLO software, we recommend changing the iLO idle connection timeout setting to **infinite**, as the installation might take longer than the 30 minutes it is set to by default, depending on your network connection and if the sensor is in a remote location.

**To change the iLO idle connection timeout settings**:

1. Sign in to the iLO console, and go to **Overview** on the top menu.

1. On the left, select **Security**, and then select **Access settings** from the top menu.

1. Select the pencil icon next to **iLO** and then select **Show advanced settings**.

1. On the **Idle connection timeout** row, select the triangle icon to open the timeout options, and then select **Infinite**.

Continue the iLO installation with the following steps.

**To install sensor software with iLO**:

1. When signed into the iLO console, select the servers' screen on the bottom left.

1. Select **HTML5 Console**.

1. In the console, select the **Virtual media** CD icon on the right, and choose the CD/DVD option.

1. Select **Local ISO file**.

1. In the dialog box, choose the Defender for IoT sensor installation ISO file.

1. Go to the left menu icon, select **Power**, and then select **Reset**.

1. The appliance will restart, and run the sensor installation process.
