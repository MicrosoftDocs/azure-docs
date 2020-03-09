---
title: Security practices for manufacturers - Azure IoT Hub Device Provisioning Service
description: 115-145 characters including spaces. This abstract displays in the search result.
author: timlt
ms.author: timlt # Microsoft employees only
ms.date: 3/02/2020
ms.topic: conceptual
ms.service: iot-dps

# Optional fields. Don't forget to remove # if you need a field.
ms.custom: iot-p0-scenario, iot-devices-deviceOEM
# ms.reviewer: MSFT-alias-of-reviewer
---
# Security practices for Azure IoT device manufacturers
As more manufacturers are releasing Azure IoT devices, the Azure IoT Hub Device Provisioning Service (DPS) team has provided guidance on security practices for the device manufacturing process. This article overviews several common security considerations and practices for device manufacturers:

- Integrating a Trusted Platform Module (TPM) into the manufacturing process
- Installing certificates on IoT devices
- Selecting device authentication options

## Integrating a TPM into the manufacturing process
This article is only relevant for devices using TPM 2.0 with HMAC key support and their endorsement keys and not for devices using X.509 certificates for authentication. Check out this blog post to learn more about secure hardware with the Device Provisioning Service using X.509 certificates. TPM is an industry-wide, ISO standard from the Trusted Computing Group, and you can read more about TPM at the complete TPM 2.0 spec or the ISO/IEC 11889 spec.

At some point in the manufacturing process, you have to extract the endorsement key (EK) from the device and take ownership of the TPM so there's an owner key available to the device. The EK extraction and ownership claim can occur at different times in the manufacturing process, which is great because it provides a lot of flexibility for customers! However, a lot of folks are taking this opportunity to increase the security of their IoT devices by using an HSM (yay!), and so the TPM lifecycle is new to them (especially since a lot of the manufacturing process might still be in the design phase at this point). This post provides general guidance around when to extract the EK and when to claim ownership of the TPM so the owner key is produced.

A couple of notes on software TPMs:

    I'm assuming you're using a discrete, firmware, or integrated TPM, and I've included notes on using a software, or non-discrete, TPM where applicable. If you're using a software TPM, there may be additional steps that I don't call out. That's because software TPMs can have different implementations and I can't cover them all, but you should be able to figure out how it works for your particular software TPM based on the timeline below.
    Software emulated TPMs are well-suited for prototyping or testing, but they do not provide the same level of security as discrete, firmware, or integrated TPMs do. Please don't use software TPMs in production. Learn more about the types of TPMs.

The following is a general timeline of how the TPM goes through the production process and ends up in a device; each manufacturing process is a little different and this post only talks about the most common patterns. If you're new to manufacturing devices using a TPM, the below serves as guidance about when to do certain things with the keys. If you have been manufacturing devices using TPMs for a while, feel free to disregard if your current process is working well for you.
Step 1: TPM is manufactured

    If you are purchasing TPMs from a TPM manufacturer for use in your devices, see if they will extract the EK_pubs for you and provide you the list of EK_pubs in addition to the physical shipment. You may also give the TPM manufacturer write access to your enrollment list via the provisioning service's shared access policies and let them add the TPMs to your enrollment list for you, but this might be a little early in the production process and requires a certain amount of trust in the TPM manufacturer. Do so at your own risk.
    If you are manufacturing TPMs to sell to device manufacturers, consider providing your customers with a list of EK_pubs with their physical TPMs to save them a step.
    If you are manufacturing TPMs to use with your own devices, identify where in the manufacturing process is the most convenient to extract the EK_pub. This could occur at any of the later steps presented, and I trust you to understand your manufacturing process and when this could happen.

Step 2: TPM is installed into a device

At this point in the production process, you should know which Device Provisioning Service the device should talk to, and you can add devices to the enrollment list for automated provisioning. Learn more about automatic device provisioning with the Device Provisioning Service in documentation.

    If you haven't already, this may be a time to extract the EK_pub.
    Depending on the installation process, you can take ownership of the TPM at this time.

Step 3: Device has firmware and software installed

This is when the Device Provisioning Service client is installed with the ID scope and global URL for provisioning.

    This is the last chance to extract the EK_pub. If a third party is installing the software on your device, you probably want to have already extracted the EK_pub.
    This is when you want to take ownership of the TPM, because you're running things on the device anyway.
    Software TPM note: this may be when the software TPM is installed as well. You should extract the EK_pub at the time the software TPM is installed.

Step 4: Device is boxed-up and sent to the warehouse, awaiting final installation

The device might sit in a warehouse for 6-12 months before it is deployed in the field.
Step 5: Device is installed into the location

Once the device arrives at its final location, it goes through automated provisioning with the Device Provisioning Service.


Of course, every manufacturing process has its own unique characteristics and the above timeline may not exactly match your process. Use your best judgment, and contact Microsoft Support if you're having trouble.

Learn more about the TPM attestation in the Device Provisioning Service in this blog post.

This is an image:

## Installing certificates on IoT devices
This table has headings.

## Selecting device authentication options
This is a numbered list:



## Next steps
For information about machine learning, see [IoT Hub Device reprovisioning concepts](concepts-device-reprovision.md).
