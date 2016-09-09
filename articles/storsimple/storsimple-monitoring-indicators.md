<properties 
    pageTitle="StorSimple monitoring indicators | Microsoft Azure" 
    description="Describes the light-emitting diodes (LEDs) and audible alarms used to monitor the status of the StorSimple device."
    services="storsimple"
    documentationCenter="NA"
    authors="alkohli"
    manager="carmonm"
    editor="" />
 <tags 
    ms.service="storsimple"
    ms.devlang="NA"
    ms.topic="article"
    ms.tgt_pltfrm="NA"
    ms.workload="TBD"
    ms.date="05/24/2016"
    ms.author="alkohli" />

# Use StorSimple monitoring indicators to manage your device   

## Overview

Your StorSimple device includes light-emitting diodes (LEDs) and alarms that you can use to monitor the modules and overall status of the StorSimple device. The monitoring indicators can be found on the hardware components of the device's primary enclosure and the EBOD enclosure. The monitoring indicators can be either LEDs or audible alarms.

There are three LED states used to indicate the status of a module: green, flashing green to red-amber, or red-amber.  

- Green LEDs represent a healthy operating status.  
- Flashing green to red-amber LEDs represent the presence of non-critical conditions that might require user intervention.  
- Red-amber LEDs indicate that there is a critical fault present within the module.  

The remainder of this article describes the various monitoring indicator LEDs, their locations on the StorSimple device, the device status based on the LED states, and any associated audible alarms.

## Front panel indicator LEDs

The front panel, also known as the *operations panel* or *ops panel*, displays the aggregate status of all the modules in the system. The front panel is identical on the StorSimple primary and the EBOD enclosure, and is illustrated below.  

   ![Device front panel][1]
 
The front panel contains the following indicators:  

1. Mute button
2. Power indicator LED (green/red-amber)
3. Module fault indicator LED (ON red-amber/OFF)
4. Logical fault indicator LED (ON red-amber/OFF
5. Unit ID display  

The major difference between the front panel LEDs for the device and those for the EBOD enclosure is the **System Unit Identification Number** shown on the LED display. The default unit ID displayed on the device is **00**, whereas the default unit ID displayed on the EBOD enclosure is **01**. This allows you to quickly differentiate between the device and the EBOD enclosure when the device is turned on. If your device is turned off, use the information provided in [Turn on a new device](storsimple-turn-device-on-or-off.md#turn-on-a-new-device) to differentiate the device from the EBOD enclosure.  

## Front panel LED status  

Use the following table to identify the status indicated by the LEDs on the front panel for the device or the EBOD enclosure.  

|System power | Module fault | Logical fault | Alarm | Status|
|-------------|---------------|-----------------|-------|-------|
|Red-amber | OFF	 | OFF | N/A | AC power lost, operating on backup power, or AC power ON and the controller modules were removed.|
|Green | ON | ON | N/A | Ops panel power on (5s) test state|
|Green | OFF | OFF | N/A | Power on, all functions good|
|Green | ON |N/A | PCM fault LEDs, fan fault LEDs | Any PCM fault, fan fault, over or under temperature|
| Green | ON | N/A | I/O module LEDs  | Any controller module fault|
| Green | ON | N/A | N/A | Enclosure logic fault|
| Green | Flash | N/A | Module status LED on controller module. PCM fault LEDs, fan fault LEDs | Unknown controller module type installed, I2C bus failure, controller module vital product data (VPD) configuration error |

## Power cooling module (PCM) indicator LEDs   

Power cooling module (PCM) indicator LEDs can be found on the back of the primary enclosure or EBOD enclosure on each PCM module. This topic discusses how to use the following LEDs to monitor the status of your StorSimple device.  

- PCM LEDs for the primary enclosure
- PCM LEDs for the EBOD enclosure

## PCM LEDs for the primary enclosure  

The StorSimple device has a 764W PCM module with an additional battery. The following illustration shows the LED panel for the device.  

   ![PCM LEDs on the primary enclosure][2]

LED legend:

1. AC power failure
2. Fan failure
3. Battery fault
4. PCM OK
5. DC failure
6. Battery good  

The status of the PCM is indicated on the LED panel. The device PCM LED panel has six LEDs. Four of these LEDs display the status of the power supply and the fan. The remaining two LEDs indicate the status of the backup battery module in the PCM.You can use the following tables to determine the status of the PCM.  

### PCM indicator LEDs for power supply and fan
| Status | PCM OK (green) | AC fail (amber) | Fan fail (amber) | DC fail (amber) |
|--------|----------------|-----------------------|------------------|----------------------|
| No AC power (to enclosure) | OFF | OFF | OFF | OFF|
| No AC power (this PCM only) | OFF | ON | OFF | ON |
| AC present PCM ON - OK	 | ON | OFF | OFF | OFF |
| PCM fail (fan fail) | OFF | OFF | ON | N/A |
| PCM fault (over amp, over voltage, over current) | OFF | ON | ON | ON |
| PCM (fan out of tolerance) | ON | OFF | OFF | ON |
| Standby mode | Flashing | OFF | OFF | OFF |
| PCM firmware download | OFF | Flashing | Flashing | Flashing |

### PCM indicator LEDs for the backup battery  

| Status | Battery good (green) | Battery fault (amber) |
|--------|----------------------|-----------------------|
| Battery not present | OFF | OFF |
| Battery present and charged | ON | OFF |
| Battery charging or maintenance discharge | Flashing | OFF |
| Battery “soft” fault (recoverable) | OFF | Flashing |
| Battery “hard” fault (non-recoverable) | OFF | ON |
| Battery disarmed | Flashing | OFF |

## PCM LEDs for the EBOD enclosure  

The EBOD enclosure has a 580W PCM and no additional battery. The PCM panel for the EBOD enclosure has indicator LEDs only for the power supplies and the fan. The following illustration shows these LEDs.

   ![PCM LEDs on the EBOD enclosure][3] 
 
You can use the following table to determine the status of the PCM.  

| Status | PCM OK (green) | AC fail (amber) | Fan fail (amber) | DC fail (amber) |
|--------|---------------|------------------------|------------------|----------------------|
| No AC power (to enclosure) | OFF | OFF | OFF | OFF |
| No AC power (this PCM only) | OFF | ON | OFF | ON |
| AC present PCM ON – OK | ON | OFF | OFF | OFF |
| PCM fail (fan fail) | OFF | OFF | ON | X |
| PCM fault (over amp, over voltage, over current | OFF | ON | ON | ON |
| PCM (fan out of tolerance) | ON | OFF | OFF | ON |
| Standby model | Flashing | OFF | OFF | OFF |
| PCM firmware download | OFF | Flashing | Flashing | Flashing |

## Controller module indicator LEDs  

The StorSimple device contains LEDs for the primary controller and the EBOD controller modules.   

### Monitoring LEDs for the primary controller
The following illustration helps you identify the LEDs on the primary controller. (All of the components are listed to aid in orientation.)  

   ![Monitoring LEDs - primary controller][4]
 
Use the following table to determine whether the controller module is operating correctly.  

### Controller indicator LEDs  

| LED | Description                                                                            
|---- | ----------- |
| ID LED (blue) | Indicates that the module is being identified. If the blue LED is blinking on a running controller, then the controller is the active controller and the other one is the standby controller. For more information, see [Identify the active controller on your device](storsimple-controller-replacement.md#identify-the-active-controller-on-your-device). |
| Fault LED (amber) | Indicates a fault in the controller.        
| OK LED (green) | Steady green indicates that the controller is OK. Flashing green indicates a controller VPD configuration error. |
| SAS activity LEDs (green) | Steady green indicates a connection with no current activity. Flashing green indicates the connection has ongoing activity. |
| Ethernet status LEDs | Right side indicates link/network activity: (steady green) link active, (flashing green) network activity. Left side indicates network speed: (yellow) 1000 Mb/s, (green) 100 Mb/s, and (OFF) 10 Mb/s. Depending on the component model, this light might blink even if the network interface is not enabled. |
| POST LEDs | Indicates the boot progress when the controller is turned on. If the StorSimple device fails to boot, this LED will help Microsoft Support identify the point in the boot process at which the failure occurred. |

>[AZURE.IMPORTANT] 
If the fault LED is lit, there is a problem with the controller module that might be resolved by restarting the controller. Please contact Microsoft Support if restarting the controller does not resolve this issue.  


### Monitoring LEDs for the EBOD (EBOD enclosure)  

Each of the 6 Gb/s SAS EBOD controllers has LEDs that indicate its status as shown in the following illustration.  

  ![Monitoring LEDs - EBOD enclosure][5]

Use the following table to determine whether the EBOD controller module is operating normally.  

### EBOD controller module indicator LEDs  

|Status | I/O module OK (green) | I/O module fault (amber) | Host port activity (green) |
|-------|----------------------|-------------------------------|----------------------------|
| Controller module OK | ON | OFF | - |
| Controller module fault | OFF | ON | - |
| No external host port connection | - | - | OFF |
| External host port connection – no activity | - | - | ON |
| External host port connection - activity | - | - | Flashing |
| Controller module metadata error | Flashing | - | - |

## Disk drive indicator LEDs for the primary enclosure and EBOD enclosure

The StorSimple device has disk drives located in both the primary enclosure and the EBOD enclosure. Each disk drive contains monitoring indicator LEDs, as described in this section. 

For the disk drives, the drive status is indicated by a green LED and a red-amber LED mounted on the front of each drive carrier module. The following illustration shows these LEDs.

  ![Disk drive LEDs][6]
 
Use the following table to determine the state of each disk drive, which in turn affects the overall front panel LED status.  

### Disk drive indicator LEDs for the EBOD enclosure  

| Status | Activity OK LED (green) | Fault LED (red-amber) | Associated ops panel LED |
|-------|--------------------------|----------------------|-------------------------|
| No drive installed | OFF | OFF | None |
| Drive installed and operational | Flashing on/off with activity | X | None |
| SCSI Enclosure Services (SES) device identity set | ON | Flashing 1 second on/1 second off | None |
| SES device fault bit set | ON | ON | Logical fault (red) |
| Power control circuit failure | OFF | ON | Module fault (red) |

## Audible alarms  

A StorSimple device contains audible alarms associated with both the primary enclosure and the EBOD enclosure. An audible alarm is located on the front panel (also known as the ops panel) of both enclosures. The audible alarm indicates when a fault condition is present. The following conditions will activate the alarm:  

- Fan fault or failure
- Voltage out of range
- Over or under temperature condition
- Thermal overrun
- System fault
- Logical fault
- Power supply fault
- Removal of a power cooling module (PCM)  

The following table describes the various alarm states.  

### Alarm states  

| Alarm state | Action | Action with mute button pressed |
|------------|---------|---------------------------------|
| S0 | Normal mode: silent | Beep twice |
| S1 | Fault mode: 1 second on/1 second off | Transition to S2 or S3 (see notes) |
| S2 | Remind mode: intermittent beep | None |
| S3 | Muted mode: silent | None |
| S4 | Critical fault mode: continuous alarm | Not available: mute not active |

> [AZURE.NOTE] 

>  - In alarm state S1, if you do not press mute within 2 minutes, the state automatically transitions to S2 or S3.  
>  - Alarm states S1 to S4 return to S0 after the fault condition is cleared.  
>  - Critical fault state S4 can be entered from any other state.  

You can mute the audible alarm by pressing the mute button on the ops panel. Automatic muting will occur after two minutes if the mute switch is not manually operated. When the alarm is muted, it will continue to sound with short intermittent beeps to indicate that a problem still exists. The alarm will be silent when all the problems are cleared.  

The following table describes the various alarm conditions.  

### Alarm conditions  

| Status | Severity | Alarm | Ops panel LED |
|--------|---------|--------|----------------|
| PCM alert – loss of DC power from a single PCM | Fault – no loss of redundancy | S1 | Module fault|
|PCM alert – loss of DC power from a single PCM | Fault – loss of redundancy | S1 | Module fault |
| PCM fan fail | Fault – loss of redundancy | S1 | Module fault |
| SBB module detected PCM fault | Fault | S1 | Module fault |
| PCM removed | Configuration error | None | Module fault |
| Enclosure configuration error | Fault – critical | S1 | Module fault |
| Low warning temperature alert | Warning | S1 | Module fault |
| High warning temperature alert | Warning | S1 | Module fault |
| Over temperature alarm | Fault – critical | S1 | Module fault |
| I2C bus failure | Fault – loss of redundancy | S1 | Module fault |
| Ops panel communication error (I2C) | Fault – critical	 | S1 | Module fault |
| Controller error | Fault – critical | S1 | Module fault |
| SBB interface module fault | Fault – critical | S1 | Module fault |
| SBB interface module fault – No functioning modules remaining | Fault – critical | S4 | Module fault |
| SBB interface module removed | Warning | None | Module fault |
| Drive power control fault | Warning – no loss of drive power | S1 | Module fault |
| Drive power control fault | Fault – critical; loss of drive power | S1 | Module fault |
| Drive removed | Warning | None | Module fault |
| Insufficient power available | Warning | none | Module fault |

## Next steps

Learn more about [StorSimple hardware components and status](storsimple-monitor-hardware-status.md).

[1]: ./media/storsimple-monitoring-indicators/storsimple-monitoring-indicators-IMAGE01.png
[2]: ./media/storsimple-monitoring-indicators/storsimple-monitoring-indicators-IMAGE02.png
[3]: ./media/storsimple-monitoring-indicators/storsimple-monitoring-indicators-IMAGE03.png
[4]: ./media/storsimple-monitoring-indicators/storsimple-monitoring-indicators-IMAGE04.png
[5]: ./media/storsimple-monitoring-indicators/storsimple-monitoring-indicators-IMAGE05.png
[6]: ./media/storsimple-monitoring-indicators/storsimple-monitoring-indicators-IMAGE06.png

 
