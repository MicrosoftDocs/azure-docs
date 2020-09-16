---
title: Azure Stack Edge Mini R safety guide | Microsoft Docs
description: Describes safety conventions, guidelines, considerations, and explains how to safely install and operate your Azure Stack Edge Mini R device.
services: databox
author:   alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 09/15/2020
ms.author: alkohli
---

# Azure Stack Edge Mini R safety instructions

![Warning Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-warning.png)
![Read Safety Notice Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-read-all-instructions.png)
**READ SAFETY AND HEALTH INFORMATION**

Read all the safety information in this article before you use your Azure Stack Edge Mini R device, a composition of one battery pack, one AC/DC plugged power supply, one module power adapter, and one server module. Failure to follow instructions could result in fire, electric shock, injuries, or damage to your properties. Read all safety information below before using Azure Stack Edge Mini R.

## Safety icon conventions

The following signal words for hazard alerting signs are:

| Icon | Description |
|:--- |:--- |
| ![Hazard Symbol](./media/azure-stack-edge-mini-r-safety/icon-safety-warning.png)| **DANGER:** Indicates a hazardous situation that, if not avoided, will result in death or serious injury. <br> **WARNING:** Indicates a hazardous situation that, if not avoided, could result in death or serious injury. <br> **CAUTION:** Indicates a hazardous situation that, if not avoided, could result in minor or moderate injury.|
|

The following hazard icons are to be observed when setting up and running your Azure Stack Edge Mini R device:

| Icon | Description |
|:--- |:--- |
| ![Read All Instructions First](./media/azure-stack-edge-mini-r-safety/icon-safety-read-all-instructions.png) | Read All Instructions First |
| ![Hazard Symbol](./media/azure-stack-edge-mini-r-safety/icon-safety-warning.png) | Hazard Symbol |
| ![Electrical Shock Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-electric-shock.png) | Electric Shock Hazard |
| ![Indoor Use Only](./media/azure-stack-edge-mini-r-safety/icon-safety-indoor-use-only.png) | Indoor Use Only |
| ![No User Serviceable Parts Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-do-not-access.png) | No User Serviceable Parts. Do not access unless properly trained. |
|

## Handling precautions and site selection

The Azure Stack Edge Mini R device has the following handling precautions and site selection criteria:

![Warning Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-warning.png)
![Electrical Shock Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-electric-shock.png)
![No User Serviceable Parts Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-do-not-access.png) **CAUTION:**

* Inspect the *as-received* device for damages. If the device enclosure is damaged, [contact Microsoft Support](azure-stack-edge-j-series-contact-microsoft-support.md) to obtain a replacement. Do not attempt to operate the device.
* If you suspect the device is malfunctioning, [contact Microsoft Support](azure-stack-edge-j-series-contact-microsoft-support.md) to obtain a replacement. Do not attempt to service the device.
* The device contains no user-serviceable parts. Hazardous voltage, current, and energy levels are present inside. Do not open. Return the device to Microsoft for servicing.

![Warning Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-warning.png) **CAUTION:**

It is recommended to operate the system:

* Away from sources of heat including direct sunlight and radiators.
* Not exposed to moisture or rain.
* Located in a space that minimizes vibration and physical shock.  The System is designed for shock and vibration according to MIL-STD-810G.
* Isolated from strong electromagnetic fields produced by electrical devices.
* Do not allow any liquid or any foreign object to enter the System. Do not place beverages or any other liquid containers on or near the system.

![Warning Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-warning.png)
![No User Serviceable Parts Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-do-not-access.png) **CAUTION:**

* This equipment contains a lithium battery. Do not attempt servicing the battery pack. Batteries in this equipment are not user serviceable. Risk of Explosion if battery is replaced by an incorrect type.

![Warning Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-warning.png) **CAUTION:**

* The ON/OFF switch on the battery pack is for discharging the battery to the server module only. If the power adapter is plugged into the battery pack, power is passed to the server module even if the switch is in the OFF position.

![Warning Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-warning.png) **CAUTION:**

* Do not burn or short circuit the battery pack. It must be recycled or disposed of properly.

![Warning Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-warning.png) **CAUTION:**

* In lieu of using the provided AC/DC power supply, this system also has the option to use a field provided Type 2590 Battery. In this case, the end user shall verify that it meets all applicable safety, transportation, environmental, and any other national/local regulations.
* When operating the system with Type 2590 Battery, operate the battery within the conditions of use specified by the battery manufacturer.

## Electrical precautions

The Azure Stack Edge Mini R device has the following electrical precautions:

![Warning Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-warning.png) ![Electrical Shock Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-electric-shock.png) **WARNING:**

When used with the power supply adaptor:

* Provide a safe electrical earth connection to the power supply cord. The alternating current (AC) cord has a three-wire grounding plug (a plug that has a grounding pin). This plug fits only a grounded AC outlet. Do not defeat the purpose of the grounding pin.
* Given that the plug on the power supply cord is the main disconnect device, ensure that the socket outlets are located near the device and are easily accessible.
* Unplug the power cord(s) (by pulling the plug, not the cord) and disconnect all cables if any of the following conditions exist:

  * The power cord or plug becomes frayed or otherwise damaged.
  * The device is exposed to rain, excess moisture, or other liquids.
  * The device has been dropped and the device casing has been damaged.
  * You suspect the device needs service or repair.
* Permanently unplug the unit before you move it or if you think it has become damaged in any way.

Provide a suitable power source with electrical overload protection to meet the following power specifications:

* Voltage: 100 to 240 Volts AC.
* Current: 15 Amps, maximum per power cord. Power cord(s) are provided.
* Frequency: 50 to 60 Hz.

![Warning Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-warning.png)
![Electrical Shock Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-electric-shock.png) **WARNING:**

* Do not attempt to modify or use AC power cord(s) other than the ones provided with the equipment.

![Warning Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-warning.png)
![Electrical Shock Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-electric-shock.png)
![Indoor Use Only](./media/azure-stack-edge-mini-r-safety/icon-safety-indoor-use-only.png) **WARNING:**

* Power supply labeled with this symbol are rated for indoor use only.

## Regulatory information

The following contains regulatory information for Azure Stack Edge Mini R device, regulatory model number: Azure Stack Edge Mini R.

The Azure Stack Edge Mini R device is designed for use with NRTL Listed (UL, CSA, ETL, etc.), and IEC/EN 60950-1 or IEC/EN 62368-1 compliant (CE marked) Information Technology equipment.

The equipment is designed to operate in the following environments:

| Environment | Specifications |
|:---  |:--- |
| System (battery pack and server together) temperature specifications | <ul><li>Storage temperature: –20&deg;C–49&deg;C (–4&deg;F-120&deg;F)</li><li>Continuous operation with battery pack (provided with the unit): 0&deg;C–49&deg;C (32&deg;F–120&deg;F)</li><li>Continuous operation with power supply: 0&deg;C-49&deg;C (32&deg;F–120&deg;F)</li></ul> |
| Battery pack temperature specifications | <ul><li>Storage temperature: –20&deg;C–50&deg;C (–4&deg;F-122&deg;F)</li><li>Continuous operation (charge): 0&deg;C–45&deg;C (32&deg;F–113&deg;F)</li><li>Continuous operation (discharge): -20&deg;C-60&deg;C (-4&deg;F–140&deg;F)</li></ul> |
| Server module temperature specifications | <ul><li>Storage: –20&deg;C–50&deg;C (-4&deg;F-122&deg;F)</li><li>Continuous operation: 0&deg;C–49&deg;C (32&deg;F-120&deg;F)</li></ui>|
| AC/DC power supply temperature specifications | <ul><li>Storage: –20&deg;C–80&deg;C (-4&deg;F-176&deg;F)</li><li>Continuous operation: 0&deg;C–60&deg;C (32&deg;F-140&deg;F)</li></ui>|
| Relative humidity (RH) specifications | <ul><li>Storage: 5% to 95% relative humidity</li><li>Operating: 10% to 90% relative humidity</li></ul>|
| Maximum altitude specifications | <ul><li>Operating: 15,000 feet (4,572 meters)</li><li>Non-operating: 40,000 feet (12,192 meters)</li></ul>|

> ![Notice Icon](./media/azure-stack-edge-mini-r-safety/icon-safety-notice.png) **NOTICE:** &nbsp;Changes or modifications made to the equipment not expressly approved by Microsoft may void the user's authority to operate the equipment.

## Next steps

[Prepare to deploy Azure Stack Edge Mini R](azure-stack-edge-mini-r-deploy-prep.md)
