---
title: Safety for your StorSimple device | Microsoft Docs
description: Describes safety conventions, guidelines, and considerations, and explains how to safely install and operate your StorSimple device.
services: storsimple
documentationcenter: ''
author: alkohli
manager: timlt
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/04/2017
ms.author: alkohli

---
# Safely install and operate your StorSimple device
![Warning Icon](./media/storsimple-safety/IC740879.png)
![Read Safety Notice Icon](./media/storsimple-safety/IC740885.png) **READ SAFETY AND HEALTH INFORMATION**

Read all the safety and health information in this article that applies to your Microsoft Azure StorSimple device. Keep all the printed guides shipped with your StorSimple device for future reference. Failure to follow instructions and properly set up, use, and care for this product can increase the risk of serious injury or death, or damage to the device or devices. A [downloadable version of this guide](https://www.microsoft.com/download/details.aspx?id=44233) is also available.

## Safety icon conventions
Here are the icons that you will find when you review the safety precautions to be observed when setting up and running your Microsoft Azure StorSimple device.

| Icon | Description |
|:--- |:--- |
| ![Danger Icon](./media/storsimple-safety/IC740879.png) **DANGER!** |Indicates a hazardous situation that, if not avoided, will result in death or serious injury. This signal word is to be limited to the most extreme situations. |
| ![Warning Icon](./media/storsimple-safety/IC740879.png) **WARNING!** |Indicates a hazardous situation that, if not avoided, could result in death or serious injury. |
| ![Warning Icon](./media/storsimple-safety/IC740879.png) **CAUTION!** |Indicates a hazardous situation that, if not avoided, could result in minor or moderate injury. |
| ![Notice Icon](./media/storsimple-safety/IC740881.png) **NOTICE:** |Indicates information considered important, but not hazard-related. |
| ![Electrical Shock Icon](./media/storsimple-safety/IC740882.png) **Electrical Shock Hazard** |High voltage |
| ![Heavy Weight Icon](./media/storsimple-safety/IC740883.png) **Heavy Weight** | |
| ![No User Serviceable Parts Icon](./media/storsimple-safety/IC740879.png) **No User Serviceable Parts** |Do not access unless properly trained. |
| ![Read Safety Notice Icon](./media/storsimple-safety/IC740885.png)**Read All Instructions First** | |
| ![Tip Hazard Icon](./media/storsimple-safety/IC740886.png) **Tip Hazard** | |

## Handling precautions
![Warning Icon](./media/storsimple-safety/IC740879.png) ![Heavy Weight Icon](./media/storsimple-safety/IC740883.png) **WARNING!** 

To reduce the risk of injury:

* A fully configured enclosure can weigh up to 32 kg (70 lbs); do not try to lift it by yourself.
* Before moving the enclosure, always ensure that two people are available to handle the weight. Be aware that one person attempting to lift this weight can sustain injuries.
* Do not lift the enclosure by the handles on the Power and Cooling Modules (PCMs) located at the rear of the unit. These are not designed to take the weight.

## Connection precautions
![Warning Icon](./media/storsimple-safety/IC740879.png) ![Electrical Shock Icon](./media/storsimple-safety/IC740882.png) **WARNING!**

To reduce the likelihood of injury, electrical shock, or death:

* When powered by multiple AC sources, disconnect all supply power for complete isolation.
* Permanently unplug the unit before you move it or if you think it has become damaged in any way.
* Provide a safe electrical earth connection to the power supply cords. Verify that the grounding of the enclosure meets the national and local requirements before applying power.
* Ensure that the power connection is always disconnected prior to the removal of a PCM from the enclosure.
* Given that the plug on the power supply cord is the main disconnect device, ensure that the socket outlets are located near the equipment and are easily accessible.

![Warning Icon](./media/storsimple-safety/IC740879.png) ![Electrical Shock Icon](./media/storsimple-safety/IC740882.png) **WARNING!**

To reduce the likelihood of overheating or fire from the electrical connections:

* Provide a suitable power source with electrical overload protection to meet the requirements detailed in the technical specification.
* Do not use bifurcated power cords (“Y” leads).
* To comply with applicable safety, emission, and thermal requirements, no covers should be removed and all bays must be populated with plug-in modules or drive blanks.
* Ensure that the equipment is used in a manner specified by the manufacturer. If this equipment is used in a manner not specified by the manufacturer, the protection provided by the equipment may be impaired.

![Notice Icon](./media/storsimple-safety/IC740881.png) **NOTICE:**

For the proper operation of your equipment and to prevent product damage:

* The RJ45 ports at the back of the device are for an Ethernet connection only. These must not be connected to a telecommunications network.
* Be sure to install the device in a rack that can accommodate a front-to-back cooling design.
* All plug-in modules and blank plates are part of the system enclosure. These must only be removed when a replacement can be immediately added. The system must not be run without all modules or blanks in place.

## Rack system precautions
The following safety requirements must be considered when you mount the device in a rack cabinet.

![Warning Icon](./media/storsimple-safety/IC740879.png) ![Tip Hazard Icon](./media/storsimple-safety/IC740886.png) **WARNING!**

To reduce the likelihood of injury from a tip over:

* The rack design should support the total weight of the installed enclosures and should incorporate stabilizing features suitable to prevent the rack from tipping or being pushed over during installation or normal use.
* When loading a rack, fill the rack from the bottom up and empty from the top down.
* Do not slide more than one enclosure out of the rack at a time to avoid the danger of the rack toppling over.

![Warning Icon](./media/storsimple-safety/IC740879.png) ![Electrical Shock Icon](./media/storsimple-safety/IC740882.png) **WARNING!**

To reduce the likelihood of injury, electrical shock, or death:

* The rack should have a safe electrical distribution system. It must provide over-current protection for the enclosure and must not be overloaded by the total number of enclosures installed. The electrical power consumption rating shown on the nameplate should be observed.
* The electrical distribution system must provide a reliable ground for each enclosure in the rack.
* The design of the electrical distribution system must take into consideration the total ground leakage current from all power supplies in all enclosures. Note that each power supply in each enclosure has a ground leakage current of 1.0 mA maximum at 60 Hz, 264 volts. The rack may require labeling with “HIGH LEAKAGE CURRENT. Ground (earth) connection is essential before connecting a supply.”
* The rack, when configured with the enclosures, must meet the safety requirements of UL 60950-1 and IEC 60950-1/EN 60950-1.

![Notice Icon](./media/storsimple-safety/IC740881.png) **NOTICE:**

For the proper cooling of your rack system:

* Ensure that the rack design takes into consideration the maximum enclosure operating ambient temperature of 35 degrees Celsius (95 degrees Fahrenheit).
* The system is operated with low-pressure, rear-exhaust installation (back pressure created by rack doors and obstacles not to exceed 5 Pascal [0.5 mm water gauge]).

## Power Cooling Module (PCM) precautions
The device is designed to operate with two PCMs. Each of the PCMs has a power supply and a dual-axis fan. During a critical condition, the system allows for a failure of one power supply while continuing normal operations. Two PCMs (and hence power supplies) must always be installed. A single PCM does not provide redundant power. Therefore, the failure of even one PCM can result in downtime or possible data loss.

![Warning Icon](./media/storsimple-safety/IC740879.png) ![Electrical Shock Icon](./media/storsimple-safety/IC740882.png) **WARNING!**

To reduce the likelihood of injury, electrical shock, or death:

* Do not remove the covers from the PCM. There is a danger of electric shock inside. To return the PCM and obtain a replacement, [contact Microsoft Support](storsimple-contact-microsoft-support.md).

![Notice Icon](./media/storsimple-safety/IC740881.png) **NOTICE:**

For the proper operation of your equipment and to prevent product damage:

* You must replace the failed PCM within 24 hours. After a PCM is removed for replacement, the replacement must be completed within 10 minutes after removal.
* Do not remove a PCM unless a replacement can be installed immediately. The enclosure must not be operated without all modules in place.

## Electrostatic discharge (ESD) precautions
![Notice Icon](./media/storsimple-safety/IC740881.png) **NOTICE:**

Observe the following ESD-related precautions.

* Ensure that you have installed and checked a suitable antistatic wrist or ankle strap.
* Observe all conventional ESD precautions when handling modules and components.
* Avoid contact with backplane components and module connectors.
* ESD damage is not covered by warranty.

## Battery disposal precautions
The power supply uses a special battery to protect the contents of memory during temporary, short-term power outages. The battery is seated in the PCM. Keep the following information in mind about the battery.

![Warning Icon](./media/storsimple-safety/IC740879.png) **WARNING!**

To reduce the risk of shorts, fire, explosion, injury, or death:

* Dispose of used batteries in accordance with national/regional regulations.
* Do not disassemble, crush, or heat above 60 degrees Celsius (140 degrees Fahrenheit) or incinerate. Replace the PCM battery with a supplied battery only. Use of another battery may present a risk of fire or explosion.
* Use protective end caps on the batteries if these are removed from the power supply.

![Notice Icon](./media/storsimple-safety/IC740881.png) **NOTICE:**

When shipping or otherwise transporting the batteries by air, follow the IATA Lithium Battery Guidance document available at [https://www.iata.org/whatwedo/cargo/dgr/Pages/lithium-batteries.aspx](https://www.iata.org/whatwedo/cargo/dgr/Pages/lithium-batteries.aspx)

After you have reviewed these safety notices, the next steps are to unpack, rack and cable your device.

## Next steps
* For an 8100 device, go to [Install your StorSimple 8100 device](storsimple-8100-hardware-installation.md).
* For an 8600 device, go to [Install your StorSimple 8600 device](storsimple-8600-hardware-installation.md).

