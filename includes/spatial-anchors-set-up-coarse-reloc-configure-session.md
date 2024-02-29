---
author: pamistel
ms.author: pamistel
ms.date: 11/20/2020
ms.service: azure-spatial-anchors
ms.topic: include
---

## Configure the cloud spatial anchor session

We'll take care of configuring the cloud spatial anchor session next. On the first line, we set the sensor provider on the session. From now on, any anchor we create during the session will be associated with a set of sensor readings. Next, we instantiate a near-device locate criteria and initialize it to match the application requirements. Finally, we instruct the session to use sensor data when locating anchors by creating a watcher from our near-device criteria.
