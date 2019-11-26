---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---
<!--v-sharos 10/13/2105 virtual device security-->

Keep the following security considerations in mind when you use the StorSimple virtual device:

* The virtual device is secured through your Microsoft Azure subscription. This means that if you are using the virtual device and your Azure subscription is compromised, the data stored on your virtual device is also susceptible.
* The public key of the certificate used to encrypt data stored in Azure StorSimple is securely made available to the Azure classic portal, and the private key is retained with the StorSimple device. On the StorSimple virtual device, both the public and private keys are stored in Azure.
* The virtual device is hosted in the Microsoft Azure datacenter.

