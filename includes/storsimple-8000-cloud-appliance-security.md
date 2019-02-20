---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---

Keep the following security considerations in mind when you use the StorSimple Cloud Appliance:

* The cloud appliance is secured through your Microsoft Azure subscription. This means that if you are using the cloud appliance and your Azure subscription is compromised, the data stored on your cloud appliance is also susceptible.
* The public key of the certificate used to encrypt data stored in StorSimple is securely made available to the Azure portal, and the private key is retained with the StorSimple Cloud Appliance. On the StorSimple Cloud Appliance, both the public and private keys are stored in Azure.
* The cloud appliance is hosted in the Microsoft Azure datacenter.

