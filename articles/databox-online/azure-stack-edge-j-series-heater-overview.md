---
title: Heater for your Azure Stack Edge Rugged series device | Microsoft Docs
description: Describes the configuration, operation of the heater used for Azure Stack Edge Rugged series devices.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: overview
ms.date: 02/25/2020
ms.author: alkohli
---

# Extreme environmental unit for your Azure Stack Edge Rugged series devices

Your Azure Stack Edge J-series devices can be shipped with an optional extreme environmental unit. This unit is essentially an heater that ensures the Azure Stack Edge device stays within the optimal operational temperatures. 

This article describes how to order the heater, its configuration, its operation, and how to use the indicator LEDs to monitor the status of the heater.

## Order a heater

When you order your Azure Stack Edge device, you have the option of choosing a heater for your device. The heater keeps the device with in the optimal operating temperature range even if the device is located in harsh environmental conditions. 

The following models of the device are available with a heater:

|Model    |Description  |
|---------|-------------|
|Azure Stack Edge Rugged J-5100ah     |Single node rugged device with heater       |
|Azure Stack Edge Rugged J-5100ahu    |Single node rugged device with heater and UPS         |
|Azure Stack Edge Rugged J-5400ah     |Four node rugged device with heater         |
|Azure Stack Edge Rugged J-5400ahu    |Four node rugged device with heater and UPS     |

For more information on how to choose the device configuration, see [Order your Azure Stack Edge device](azure-stack-edge-j-series-deploy-prep.md#create-a-new-resource).


## Heater configuration

The heater that ships with a single node or a four node device is identical. In this article, the heater is described in the context of a four node device with a heater and UPS. 

The four node device with a heater and UPS ships as two units, a 5U rugged case and a 4U rugged case. The 5U rugged case has four 1U device servers and a 1U heater. The heater is at the very bottom of all the device servers. 

![Heater for Azure Stack Edge 4-node device](media/azure-stack-edge-j-series-heater-overview/heater-device-servers-layout-1.png)

The front of the heater serves as the user interface. The front panel also has a pair of vent actuators that allow you to manually control the position of the vents that are used to draw in the outside air into the case.

The back of the heater has power inlets and outlets for the server power (four in this case), UPS, and the heater. There is also a breaker that allows you to shut down the heater.

Both the back and the front of the heater also have covers for the intake and the exhaust. 


## Heater operation

When the devices are at a higher temperature than the surroundings, the vents are fully opened so that the outside air can cool the servers. The air flow will bypass the heater.

When the devices are at a lower temperature than its surroundings, the vents are fully closed and the inside air is heated and recirculated.

The vents in the heater need to be manually opened or closed. The desired position of the vents is displayed in the front panel fo the heater.

![Heater for Azure Stack Edge 4-node device](media/azure-stack-edge-j-series-heater-overview/plenum-vents-open-closed.png)

## Heater status

Your 1U heater includes light-emitting diodes (LEDs) and alarms that you can use to monitor the overall status of heater. The monitoring indicators are found on the front panel of the heater enclosure. The monitoring indicators can be either LEDs or audible alarms.

- **Monitoring indicator LEDs** - There are three LED states used to indicate the status of a module: green, flashing green to red-amber, or red-amber.

    - Green LEDs represent a healthy operating status.
    - Flashing green to flashing red-amber LEDs usually represent the presence of non-critical conditions that might require user intervention.
    - Red-amber LEDs indicate that there is a critical fault present and must be addressed immediately.

- **Audible alarm** - You can mute the audible alarm by pressing the mute button on the ops panel. Automatic muting will occur after two minutes if the mute switch is not manually operated. When the alarm is muted, it will continue to sound with short intermittent beeps to indicate that a problem still exists. The alarm will be silent when all the problems are cleared.

The monitoring indicators are located on the front panel of the heater that also serves as the user interface.

![The Azure Stack Edge 1-node device](media/azure-stack-edge-j-series-heater-overview/heater-front-plane-ui-1.png)

Here is a tabulated summary of all the monitoring indicators on your heater:

| Monitoring indicator    | State             | Description      |
|---------------|------------------|------------------------------|
| INPUT PWR     |  Off             | AC is disconnected from the heater power inlet in the rear of the chassis or the breaker is OFF.     |
|               | Solid green      | AC is connected to the heater power inlet in the rear of the chassis and the breaker is ON.     |
| HEATER        | Off              | Heater elements are powered OFF.  |
|               | Solid red        | Heater elements are powered ON. |
| SERVER PWR    | Off              | Server power relays are OFF/OPEN. Inlets on the back are disconnected from the outlets on the top.  |
|               | Solid green      | Server power relays are ON/CLOSED. Inlets on the back are connected to the paired outlets on the top.  |
| TEMP          | Flash 4 Hz amber | Temperature sensor fault. This is likely the server inlet (also known as plenum) temperature sensor is not plugged in.  |
|               | Flash 2 Hz green | Server inlet temperature dropped below the lower threshold of the standard operating temperature range.|
|               | Solid green      | Server inlet temperature is within the standard operating temperature.  |
|               | Flash 1 Hz red   | Server inlet temperature rose above the upper threshold of the standard operating temperature range. |
| VENT POSITION | Solid green      | The vent is in the desired target position. There will be no audible alarm in this state.    |
|               | Flash 1 Hz green | This is the target position and the vent should be moved to this position from its current position. The audible alarm will toggle On/Off every 2 seconds.  |
|               | Solid red        | This is the actual position of the vent and the actuator should be moved to the target position that is indicated by flashing green LED. The audible alarm will toggle On/Off every 2 seconds. |
| HEATER  AUTO  | AUTO             | The heater controller powers the heater elements ON & OFF as needed.   |
|               | OFF              | The heater element is never powered even in a cold ambient condition. Temperature is controlled by manually moving the vent to an appropriate position. There is no LED indication that the heater module is in this condition. |
| SERVER PWR    | AUTO             | The heater controller determines when to power on the servers (for example, hold off the power until warmed up).|
|               | ON               | The servers are powered regardless of the temperature conditions.|



## Next steps

- Review the [Azure Stack Edge system requirements](azure-stack-edge-j-series-system-requirements.md).
- Understand the [Azure Stack Edge limits](azure-stack-edge-j-series-limits.md).
- Deploy [Azure Azure Stack Edge](azure-stack-edge-j-series-deploy-prep.md) in Azure portal.

