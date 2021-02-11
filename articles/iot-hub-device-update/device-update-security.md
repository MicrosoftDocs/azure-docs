---
title: Security for Device Update for IoT Hub | Microsoft Docs
description: Understand how Device Update for IoT Hub ensures devices are updated securely.
author: lichris
ms.author: lichris
ms.date: 2/11/2021
ms.topic: conceptual
ms.service: iot-hub
---

# Device Update Security Model

The Azure Device Update service offers a secure method to deploy updates such as device firmware, images and applications to your IoT devices. The workflow provides an end-to-end secure channel providing a full chain-of-custody model which a device can use to prove that an update is trusted, not modified and intentional.

Each step in the ADU workflow is protected through a variety of security features and processes ensuring that every step in the pipeline performs a secured handoff to the next. The ADU client identifies and properly manages any illegitimate update requests as well as checks every download to ensure that the content is trusted, has not been modified and is intentional.

## For Solution Operators

As Solution operators import updates into their ADU instance, the service uploads and checks the update binary files to ensure that it has not been modified or swapped out by a malicious user. Once verified the content is signed by the ADU service.

When the solution operator requests to update a device, a signed message is sent over the protected IoT Hub channel to the device. The request’s signature is validated by the device’s ADU agent as authentic. 

Any resulting binary download is properly validated through its signature as well as compared against expected file hashes. Once the update binary has been downloaded and verified it is then installed through secured installation processes.

## For Device Builders

To ensure that the ADU service scales down to simple, low performance devices the security model uses raw asymmetric keys and raw signatures. They leverage JSON based formats such as JSON Web Tokens & JSON Web Keys.

### Root Keys

Every ADU device contains a set of root keys. These keys are the root of trust for all of ADU’s signatures. Any signature must be chained up through one of these root keys otherwise it is considered illegitimate.

The set of root keys will change over time as it is proper to periodically rotate signing keys for security purposes. This means that ADU agent software will need to update itself with the latest set of root keys. The current set of valid root keys will always be available at TBD.

### Signatures

All signatures will be accommodated by a signing (public) key signed by one of the root keys. The signature will identify which root key was used to sign the signing key. 

An ADU agent must validate signatures by first validating that the signing (public) key’s signature is proper, valid and signed by one of the approved root keys. Once successfully validated then the signature itself may be validated by using the now trusted signing public key.

Signing keys are rotated on a much quicker cadence than root keys so expect messages signed by various different signing keys. 

Revocation of a signing key is managed by the ADU service therefore do not cache signing keys. Always use the signing key accompanying a signature.

### Receiving Updates

When an ADU agent receives an update request it contains a signed Update Manifest (UM) document. The agent must validate that the signature of the UM is proper and intact. This is done by validating that the UM signature’s signing key has been signed by a proper root key. Once done then validate the UM signature against the signing key.

Once the UM signature has been validated then the ADU agent may trust it as a “source of truth”. All further security trust stems from this source. 

The UM contains URLs and filehashes of content to download and install. Once the agent has downloaded an update binary then it must validate the update against the filehash found in the UM. This provides a transitive trust model for download validation. It not only assures that the content is intact (not modified) but it also confirms that what was downloaded was indeed what was intended to be downloaded. 

### Securing the Device

It is important to ensure that ADU related security assets are properly secured and protected on your device. Assets such as root keys need to be protected for modification. There are various ways to do this such as leveraging security devices (TPM, SGX, HSM, other security devices) or even hard coding them in the ADU agent. The latter requires that the ADU agent code is digitally signed and the system’s Code Integrity support enabled to protect from malicious modification of the agent code.

Additional security measures are warranted such as ensuring that handoff from component to component is performed in a secure way. For example registering a specific isolated accounts used to run the various components. And limiting network based communications (eg. REST API calls) to localhost only.
