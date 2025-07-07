---
title: Security for Device Update for Azure IoT Hub
description: Understand how Device Update for IoT Hub ensures devices are updated securely.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 08/19/2022
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Device Update security model

Device Update for IoT Hub offers a secure method to deploy updates for device firmware, images, and applications to your IoT devices. The workflow provides an end-to-end secure channel with a full chain-of-custody model that a device can use to prove an update is trusted, unmodified, and intentional.

Each step in the Device Update workflow is protected through various security features and processes to ensure that every step in the pipeline performs a secured handoff to the next. The Device Update agent reference code identifies and properly manages any illegitimate update requests. The reference agent also checks every download to ensure that the content is trusted, unmodified, and intentional.

## Summary

As updates are imported into a Device Update instance, the service uploads and checks the update binary files to ensure that a malicious user hasn't modified them. Once verified, the Device Update service generates an internal [update manifest](./update-manifest.md) with file hashes from the import manifest and other metadata. The Device Update service signs this update manifest.

Once imported into the service and stored in Azure, the Azure Storage service automatically encrypts the update binary files and associated customer metadata at rest. The Device Update service doesn't automatically provide additional encryption, but does allow developers to encrypt content themselves before the content reaches the Device Update service.

When an update is deployed to devices from the Device Update service, a signed message is sent over the protected IoT Hub channel to the device. The Device Update agent validates the signature to determine if it's authentic.

Any resulting binary download is secured through validation of the update manifest signature. The update manifest contains the binary file hashes, so once the manifest is trusted the Device Update agent trusts the hashes and matches them against the binaries. Once the update binary is downloaded and verified, it's handed off to the installer on the device.

## Implementation details

To ensure that the Device Update service scales down to simple, low-performance devices, the security model uses raw asymmetric keys and raw signatures. They use JSON-based formats such as JSON Web Tokens & JSON Web Keys.

### Securing update content via the update manifest

The update manifest is validated by using two signatures. The signatures are created using a structure consisting of *signing* keys and *root* keys.

The Device Update agent contains embedded public keys that are used for all Device Update-compatible devices. These public keys are the *root* keys. Microsoft controls the corresponding private keys.

Microsoft also generates a public/private key pair that isn't included in the Device Update agent or stored on the device. This key is the *signing* key.

When an update is imported into Device Update for IoT Hub, and the service generates the update manifest, the service signs the manifest using the signing key, and includes the signing key itself, which is signed by a root key. When the update manifest is sent to the device, the Device Update agent receives the following signature data:

1. The signature value itself.
2. The algorithm used for generating #1.
3. The public key information of the signing key used for generating #1.
4. The signature of the public signing key in #3.
5. The public key ID of the root key used for generating #3.
6. The algorithm used for generating #4.

The Device Update agent uses that information to validate that the signature of the public signing key is signed by the root key. The Device Update agent then validates that the update manifest signature is signed by the signing key. If all the signatures are correct, the Device Update agent trusts the update manifest. Since the update manifest includes the file hashes that correspond to the update files themselves, the update files can then also be trusted if the hashes match.

Having root and signing keys allows Microsoft to periodically roll the signing key, a security best practice.

### JSON Web Signature (JWS)

The `updateManifestSignature` is used to ensure that the information contained within the `updateManifest` isn't modified. The `updateManifestSignature` is produced using a JSON Web Signature with JSON Web Keys, allowing for source verification. The signature is a Base64Url Encoded string with three sections delineated by ".".  Refer to the [jws_util.h helper methods](https://github.com/Azure/iot-hub-device-update/tree/main/src/utils/jws_utils) for parsing and verifying JSON keys and tokens.

JSON Web Signature is a widely used [proposed IETF standard](https://tools.ietf.org/html/rfc7515) for signing content using JSON-based data structures. It's a way of ensuring integrity of data by verifying the signature of the data. Further information can be found in the JSON Web Signature (JWS) [RFC 7515](https://www.rfc-editor.org/info/rfc7515).

### JSON Web Token

[JSON Web Tokens](https://tools.ietf.org/html/rfc7519) are an open, industry standard method for representing claims securely between two parties.

### Root Keys

Every Device Update device must contain a set of root keys. These keys are the root of trust for all of Device Update's signatures. Any signature must be chained up through one of these root keys to be considered legitimate.

The set of root keys will change over time as it is proper to periodically rotate signing keys for security purposes. As a result, the Device Update agent software must be updated with the latest set of root keys at intervals specified by the Device Update team. **The next planned root key rotation will occur in August 2025**.

Starting with version 1.1.0 of the Device Update agent, the agent automatically checks for any changes to root keys each time a deployment of an update to that device occurs. Possible changes:

* A new root key is available.
* An existing root key is disabled (effectively "revoked"), meaning it is no longer valid for establishing trust.

If either or both are true, the Device Update agent automatically downloads from the DU service a new _root key package_. This package contains the complete set of all root keys, and a _disabled list_ containing information about which root keys and/or signing keys are no longer valid. The root key package is itself signed with each root key, so that trust for the package can be established both from the original root keys that are part of the DU agent itself, and any subsequently-downloaded root keys. Once the validation process is complete, any new root keys are considered to be trusted to validate trust with the signing key for a given update manifest, while any root keys or signing keys listed in the disabled list are no longer trusted for that purpose.

### Signatures

A signing (public) key signed by one of the root keys accompanies all signatures. The signature identifies which root key was used to sign the signing key.

A Device Update agent must validate signatures by first validating that the signing (public) key’s signature is proper, valid, and signed by one of the approved root keys. Once the signing key is successfully validated, the signature itself may be validated by using the now trusted signing public key.

Signing keys are rotated on a more rapid cadence than root keys, so expect messages signed by various different signing keys.

The Device Update service manages the revocation of signing keys if needed, so users shouldn't attempt to cache signing keys. Always use the signing key accompanying a signature.

### Securing the device

It's important to ensure that Device Update-related security assets are properly secured and protected on your device. Assets such as root keys need to be protected against modification. There are various ways to protect the root keys, such as using security devices (TPM, SGX, HSM, other security devices) or hard-coding them in the Device Update agent as is done today in the reference implementation. The latter requires digital signing of the Device Update agent code, and enablement of the system’s Code Integrity support to protect against malicious modification of the Agent code.

Other security measures may be warranted, such as ensuring that handoff from component to component is performed in a secure way. For example, registering a specific isolated account to run the various components, and limiting network-based communications (for example, REST API calls) to localhost only.

## Next steps

[Learn about how Device Update uses Azure role-based access control](.\device-update-control-access.md)
