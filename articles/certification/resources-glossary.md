---
title: Azure Certified Device program glossary
description: A list of common terms used in the Azure Certified Device program
author: nkuntjoro
ms.author: nikuntjo
ms.service: certification
ms.topic: conceptual 
ms.date: 03/03/2021
ms.custom: template-concept
---

# Azure Certified Device program glossary

This guide provides definitions of terms commonly used in the Azure Certified Device program and portal. Refer to this glossary for clarification to the certification process. For your convenience, this glossary is categorized based on major certification concepts that you may have questions about.

## Device class

When creating your certification project, you will be asked to specify a device class. Device class refers to the form factor or classification that best represents your device.

- **Gateway**

    A device that processes data sent over an IoT network.

- **Sensor**

    A device that detects and responds to changes to an environment and connects to gateways to process the changes.

- **Other**

    If you select Other, add a description of your device class in your own words. Over time, we may continue to add new values to this list, particularly as we continue to monitor feedback from our partners.

## Device type

You will also be asked to select one of two device types during the certification process.

- **Finished Product**

    A device that is solution-ready and ready for production deployment. Typically in a finished form factor with firmware and an operating system. These may be general-purpose devices that require additional customization or specialized devices that require no modifications for usage.
- **Solution-Ready Dev Kit**

    A development kit containing hardware and software ideal for easy prototyping, typically not in a finished form factor. Usually includes sample code and tutorials to enable quick prototyping.

## Component type

In the Device details section, you'll describe your device by listing components by component type. You can view more guidance on components [here](./how-to-using-the-components-feature.md).

- **Customer Ready Product**

    A component representation of the overall or primary device. This is different from a **Finished Product**, which is a classification of the device as being ready for customer use without further development. A Finished Product will contain a Customer Ready Product component.
- **Development Board**

    Either an integrated or detachable board with microprocessor for easy customization.
- **Peripheral**

    Either an integrated or detachable addition to the product (such as an accessory). These are typically devices that connect to the main device, but does not contribute to device primary functions. Instead, it provides additional functions. Memory, RAM, storage, hard disks, and CPUs are not considered peripheral devices (they instead should be listed under Additional Specs of the Customer Ready Product component).
- **System-On-Module**  

    A board-level circuit that integrates a system function in a single module.

## Component attachment method

Component attachment method is another component detail that informs the customer about how the component is integrated into the overall product.

- **Integrated**
 
    Refers to when a device component is a part of the main chassis of the product. This most commonly refers to a peripheral component type that cannot be removed from the device.  
    Example: An integrated temperature sensor inside a gateway chassis.

- **Discrete**

    Refers to when a component is **not** a part of main chassis of the product.  
    Example: An external temperature sensor that must be attached to the device.


## Next steps

This glossary will guide you through the process of certifying your project on the portal. You're now ready to begin your project!
- [Tutorial: Creating your project](./tutorial-01-creating-your-project.md)
