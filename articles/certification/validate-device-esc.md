---
title: Validate device is Edge Secured-core enabled
description: Instructions to validate device is Edge Secured-core enabled 
author: sufenfong
ms.author: sufon
ms.topic: conceptual 
ms.date: 08/06/2024 
ms.custom: Edge Secured-core certified devices
ms.service: azure-certified-device
---
# Validate your Edge Secured-core certified devices
To check if your device is Edge Secured-core enabled: 
1.	Go to Windows Icon > Security Settings > Device Security. The "Secured-core PC" status is available on the top of the screen. If the status is missing, reach out to the device builder for assistance.
![Image showing Device Security Status.](./media/images/edge-secured-core-enabled.png)

2.	Go to "Core isolation" to ensure that "Memory integrity" is on.
![Image showing Core isolation Status.](./media/images/core-isolation.png)

3.	Go to "Security processor" to ensure that the Trusted Platform Module "Specification version" is 2.0.
![Image showing security processor Status.](./media/images/security-processor.png)

4.	Go to "Data encryption" to ensure that "Device encryption" is on.
![Image showing device encryption Status.](./media/images/device-encryption.png)
