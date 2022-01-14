---
title: Azure Stack Edge Pro 2 Safety guide | Microsoft Docs
description: Describes safety conventions, guidelines, considerations, and explains how to safely install and operate your Azure Stack Edge Pro 2 device.
services: databox
author:   sipastak

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 01/14/2022
ms.author: sipastak
---

# Azure Stack Edge Pro 2 safety instructions


:::image type="icon" source="media/azure-stack-edge-pro-2-safety/icon-safety-warning.png" border="false"::: :::image type="icon" source="media/azure-stack-edge-pro-2-safety/icon-safety-read-all-instructions.png" border="false":::

To reduce the risk of bodily injury, electrical shock, fire, and equipment damage, read the safety instructions found at the below QR Code and observe all warnings and precautions in this guide before unpacking, installing, or maintaining this server.

[!INCLUDE [azure-stack-edge-gateway-safety-icon-conventions](../../includes/azure-stack-edge-gateway-safety-icon-conventions.md)]


## Compliance Guide

Regulatory model numbers: DB040 and DB040-W

This equipment is designed for use with NRTL Listed (UL, CSA, ETL, etc.), and IEC/EN 60950-1 or IEC/EN 62368-1 compliant (CE marked) Information Technology equipment.

This equipment is designed to operate in the following environment:

* Temperature Specifications: 
    * Storage: –40°C–70°C (–40°F–149°F)  
    * Operating: 10°C–45°C (50°F–113°F) 
* Relative Humidity Specifications 
    * Storage: 5% to 95%  
    * Operating: 5% to 85% relative humidity  
* Maximum Altitude Specifications 
    * Operating: 3,050 meters (10,000 feet)  
    * Storage: 9,150 meters (30,000 feet) 

For electrical supply ratings, refer to the equipment rating label provided with the unit.

:::image type="icon" source="media/azure-stack-edge-pro-2-safety/icon-safety-notice.png" border="false":::NOTICE: Changes or modifications made to the equipment not expressly approved by Microsoft may void the user’s authority to operate the equipment.

### USA and CANADA:
Supplier’s Declaration of Conformity

Models: DB040, DB040-W

:::image type="icon" source="media/azure-stack-edge-pro-2-safety/icon-safety-notice.png" border="false":::NOTICE: This equipment has been tested and found to comply with the limits for a Class A digital device, pursuant to part 15 of the FCC Rules. These limits are designed to provide reasonable protection against harmful interference when the equipment is operated in a commercial environment. This equipment generates, uses, and can radiate radio frequency energy and, if not installed and used in accordance with the instruction manual, may cause harmful interference to radio communications. Operation of this equipment in a residential area is likely to cause harmful interference in which case the user will be required to correct the interference at his own expense.

This device complies with part 15 of the FCC Rules and Industry Canada license-exempt RSS standard(s). Operation is subject to the following two conditions: (1) this device may not cause harmful interference, and (2) this device must accept any interference received, including interference that may cause undesired operation of the device. 

Cet appareil numérique de la classe A est conforme à la norme NMB-003 du Canada.   

Le présent appareil est conforme aux CNR d'Industrie Canada applicables aux appareils radio exempts de licence. L'exploitation est autorisée aux deux conditions suivantes: (1) l'appareil ne doit pas produire de brouillage, et (2) l'utilisateur de l'appareil doit accepter tout brouillage radioélectrique subi, même si le brouillage est susceptible d'en compromettre le fonctionnement.

CAN ICES-3(A)/NMB-3(A)

Microsoft Corporation, One Microsoft Way, Redmond, WA 98052, USA.

United States: (800) 426-9400

Canada: (800) 933-4750


For model: DB040-W only

Operation in the band 5150–5250 MHz is only for indoor use to reduce the potential for harmful interference to co-channel mobile satellite systems. Users are advised that high-power radars are allocated as primary users (priority users) of the bands 5250–5350 MHz and 5650–5850 MHz and these radars could cause interference and/or damage to LE-LAN devices.

 La bande 5150–5250 MHz est réservée uniquement pour une utilisation à l’intérieur afin de réduire les risques de brouillage préjudiciable aux systèmes de satellites mobiles utilisant les mêmes canaux. Les utilisateurs êtes avisés que les utilisateurs de radars de haute puissance sont désignés utilisateurs principaux (c.-à-d., qu'ils ont la priorité) pour les bandes 5 250-5 350 MHz et 5 650-5 850 MHz et que ces radars pourraient causer du brouillage et/ou des dommages aux dispositifs LAN-EL.

Exposure to Radio Frequency (RF) Energy

This equipment should be installed and operated with a minimum distance of 20cm (8 inches) between the radiator and your body. This transmitter must not be co-located or operating in conjunction with any other antenna or transmitter.

This equipment complies with FCC/ISED radiation exposure limits set forth for an uncontrolled environment. Additional information about radiofrequency safety can be found on the FCC website at https://www.fcc.gov/general/radiofrequency-safety-0 and the Industry Canada website at http://www.ic.gc.ca/eic/site/smt-gst.nsf/eng/sf01904.htm

### EUROPEAN UNION:

:::image type="icon" source="media/azure-stack-edge-pro-2-safety/icon-safety-warning.png" border="false":::**WARNING:** 
* This is a class A product. In a domestic environment, this product may cause radio interference in which case the user may be required to take adequate measures.
:::image type="content" source="media/azure-stack-edge-pro-2-safety/icon-ce-marking.png" alt-text="CE marking":::

For Model: DB040-W only

Hereby, declares that this device is in compliance with EU Directive 2014/53/EU and UK Radio Equipment Regulations 2017 (S.I. 2017/1206). The full text of the EU and UK declaration of conformity are available on the product webpage: https://aka.ms/CONTACT-ASE-SUPPORT <!--confirm with Tim about URL-->

This device may operate in all member states of the EU. Observe national and local regulations where the device is used. This device is restricted to indoor use only when operating in the 5150 - 5350 MHz frequency range in the following countries:  

:::image type="content" source="media/azure-stack-edge-pro-2-safety/icon-eu-countries-indoor-use.png" alt-text="List of EU countries":::

In accordance with Article 10.8(a) and 10.8(b) of the Radio Equipment Directive (RED), the following table provides information on the frequency bands used and the maximum RF transmit power of the product for sale in the EU: 


|Frequency band (MHz) |Frequency band (MHz)  |
|---------|---------|
|2400 - 2483.5     |         |
|R5150 - 5350   |         |
|5470 - 5725   |         |
|5725 - 5875    |         |

:::image type="icon" source="media/azure-stack-edge-pro-2-safety/icon-safety-notice.png" border="false":::Notice: This device is a receiver category 1 device under EN 300 440 

[!INCLUDE [azure-stack-edge-gateway-disposal-waste-batteries](../../includes/azure-stack-edge-gateway-disposal-waste-batteries.md)]

### **Japan**
:::image type="content" source="media/azure-stack-edge-pro-2-safety/icon-japan.png" alt-text="Japan":::



### **SOUTH KOREA**
:::image type="content" source="media/azure-stack-edge-pro-2-safety/icon-south-korea.png" alt-text="Additional instructions for South Korea":::

### **TAIWAN** 
:::image type="content" source="media/azure-stack-edge-pro-2-safety/icon-taiwan.png" alt-text="Additional instructions for Taiwan 1":::

:::image type="content" source="media/azure-stack-edge-pro-2-safety/icon-taiwan-table-1.png" alt-text="Additional instructions for Taiwan 2":::

:::image type="content" source="media/azure-stack-edge-pro-2-safety/icon-taiwan-table-2.png" alt-text="Additional instructions for Taiwan 3":::

:::image type="content" source="media/azure-stack-edge-pro-2-safety/icon-commodity-inspection-mark.png" alt-text="Commodity Inspection Mark":::

## Next steps

* [Prepare to deploy Azure Stack Edge Pro 2 device](azure-stack-edge-placeholder.md)