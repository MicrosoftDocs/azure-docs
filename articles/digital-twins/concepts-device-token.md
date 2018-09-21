---
title: Understanding Azure Digital Twins device connectivity and authentication | Microsoft Docs
description: Using Azure Digital Twins to connect and authenticate devices
author: lyranahughes
manager: alinast
ms.service: azure-digital-twins
services: azure-digital-twins
ms.topic: conceptual
ms.date: 09/20/2018
ms.author: lhughes
---

# Understand Azure Digital Twins Device Connectivity and Authentication

Physical devices can be manufactured with the information needed to connect to the service on (first) power up.

A SAS Token installed on a physical device allows it to auto-discover its associated Digital Device Twin object from the Topology API and obtain configuration data, including which IoT Hub to communicate with. Only a Hardware ID, such as a MAC address is needed to perform these steps.

It is possible to create and install the SAS Token before a Device is created in the Topology and associated with a Space object.

The SAS Token is an authorization token which allows a device to access its Device in the Topology and obtain configuration information, including its IoT Hub connection string.

Note: The generation of the SAS Token can take place before a Device is created in the Topology and associated with a Space object, to simplify provisioning.

## SAS Tokens

The SAS token is composed of:

* 'SharedAccessSignature' prefix:

* Ampersand-connected string that consists of:
  * Device hardware ID (MAC address or other hardware ID, ideally one that is fixed in the hardware).
  * Expiration time of the token.
  * Symmetric key version (used to sign these values).
  * SHA256 hash signature of these three items using the previously created key from the service's Key Store.

Here is an example SAS Token:

```plaintext
SharedAccessSignature id=010203040506&sig=dD80ihBh5jfNpymO5Hg1IdiJIEvHcJpCMiCMnN/RnbI%3d&se=2017-09-15T01:06:22Z&kv=1
```

## Obtain a SAS Token

Getting a valid SAS Token involves the following steps:

1. Create a Key Store
1. Create a Key
1. Generate a SAS Token using the known Hardware ID of the device
1. Provision the SAS Token and Topology API URL to the device
