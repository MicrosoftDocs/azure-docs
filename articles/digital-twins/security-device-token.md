---
title: Understanding Azure Digital Twins device connectivity and authentication | Microsoft Docs
description: Using Azure Digital Twins to connect and authenticate devices
author: lyrana
manager: alinast
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 10/02/2018
ms.author: lyrana
---

# Device connectivity and authentication

Physical devices can be manufactured with the information needed to connect to the Azure Digital Twins service on (first) power up.

Physical devices should have a SAS Token installed. The SAS Token is an authorization token, which allows a physical device to access its device twin in the Digital Twins spatial graph. This device twin contains configuration information, including its IoT Hub connection string.

It is possible to create and install the SAS Token before a Device is created in the spatial graph and associated with a Space object.

## SAS tokens

The SAS token is composed of:

* 'SharedAccessSignature' prefix

* Ampersand-connected string that consists of:
  * Device hardware ID (MAC address or other hardware ID, ideally one that is fixed in the hardware).
  * Expiration time of the token.
  * Symmetric key version (used to sign these values).
  * SHA256 hash signature of these three items using the previously created key from the service's Key Store.

Here is an example SAS Token:

```plaintext
SharedAccessSignature id=010203040506&sig=dD80ihBh5jfNpymO5Hg1IdiJIEvHcJpCMiCMnN/RnbI%3d&se=2017-09-15T01:06:22Z&kv=1
```

## Obtain a SAS token

To obtain a valid SAS Token, follow these steps:

1. Create a Key Store
1. Create a Key
1. Generate a SAS Token using the known Hardware ID of the device
1. Provision the SAS Token and Topology API URL to the device

## Next steps

Read more about Azure Digital Twins security:

> [!div class="nextstepaction"]
> [Creating a role assignment] (./security-create-manage-role-assignments.md)
