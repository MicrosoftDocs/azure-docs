<properties 
   pageTitle="StorSimple technical specifications | Microsoft Azure"
   description="Describes the technical specifications and regulatory standards compliance information for the StorSimple hardware components."
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
   ms.date="04/19/2016"
   ms.author="alkohli" />

# Technical specifications and compliance for the StorSimple device

## Overview

The hardware components of your Microsoft Azure StorSimple device adhere to the technical specifications and regulatory standards outlined in this article. The technical specifications describe the Power and Cooling Modules (PCMs), disk drives, storage capacity, and enclosures. The compliance information covers such things as international standards, safety and emissions, and cabling.


## Power and Cooling Module specifications  

The StorSimple device has two 100-240V dual fan, SBB-compliant Power Cooling Modules (PCMs). This provides a redundant power configuration. If a PCM fails, the device continues to operate normally on the other PCM until the failed module is replaced.  

The EBOD enclosure uses a 580 W PCM, and primary enclosure uses a 764 W PCM. The following tables list the technical specifications associated with the PCMs.

| Specification           | 580 W PCM (EBOD)                                    | 764 W PCM (Primary)                                |
|------------------------ | --------------------------------------------------- | -------------------------------------------------- |
| Maximum output power    | 580 W                                               | 764                                                |
| Frequency               | 50/60 Hz                                            | 50/60 Hz                                           |
| Voltage range selection | Auto ranging: 90 – 264 V AC, 47/63 Hz               | Auto ranging: 90- 264 V AC, 47/63 Hz               |
| Maximum inrush current  | 20 A                                                | 20 A                                               |
| Power factor correction | >95% nominal input voltage                          | >95% nominal input voltage                         |
| Harmonics               | Meets EN61000-3-2                                   | Meets EN61000-3-2                                  |
| Output                  | 5V Standby voltage @ 2.0 A                          | 5V Standby voltage @ 2.7 A                         |
|                         | +5V @ 42 A                                          | +5V @ 40 A                                         |
|                         | +12V @ 38 A                                         | +12V @ 38 A                                        |
| Hot pluggable           |  Yes                                                | Yes                                                |
| Switches and LEDs       | AC ON/OFF switch and four status indicator LEDs     | AC ON/OFF switch and six status indicator LEDs     |
| Enclosure cooling       | Axial cooling fans with variable fan speed control  | Axial cooling fans with variable fan speed control |

 
## Power consumption statistics  

The following table lists the typical power consumption data (actual values may vary from the published) for the various models of StorSimple device. 
 
 Conditions | 240 V AC | 240 V AC | 240 V AC | 110 V AC | 110 V AC | 110 V AC 
 ---------- | -------- | -------- | -------- | -------- | -------- | -------- 
 Fans slow, drives idle | 1.45 A  |0.31 kW | 1057.76 BTU/hr | 3.19 A | 0.34 kW | 1160.13 BTU/hr 
 Fans slow, drives accessing | 1.54 A | 0.33 kW | 1126.01 BTU/hr | 3.27 A | 0.36 kW | 1228.37 BTU/hr 
 Fans fast, drives idle, two PSUs powered | 2.14 A | 0.49 kW  | 1671.95 BTU/hr | 4.99 A | 0.54 kW | 1842.56 BTU/hr 
 Fans fast, drives idle, one PSU powered one idle | 2.05 A | 0.48 kW | 1637.83 BTU/hr | 4.58 A | 0.50 kW | 1706.07 BTU/hr 
 Fans fast, drives accessing, two PSUs powered | 2.26 A | 0.51 kW | 1740.19 BTU/hr | 4.95 A | 0.54 kW | 1842.56 BTU/hr 
 Fans fast, drives accessing, one PSU powered one idle | 2.14 A |0.49 kW | 1671.95 BTU/hr | 4.81 A  | 0.53 kW | 1808.44 BTU/hr 

## Disk drive specifications  

Your StorSimple device supports up to 12 3.5-inch form factor Serial Attached SCSI (SAS) disk drives. The actual drives can be a mix of solid-state drives (SSDs) or hard disk drives (HDDs), depending on the product configuration. The 12 disk drive slots are located in a 3 by 4 configuration in front of the enclosure. The EBOD enclosure allows for additional storage for another 12 disk drives. These are always HDDs.  

## Storage specifications
The StorSimple devices have a mix of hard disk drives and solid state drives for both the 8100 and 8600. The total usable capacity for the 8100 and 8600 are roughly 15 TB and 38 TB respectively. The following table documents the details of SSD, HDD, and cloud capacity in the context of the StorSimple solution capacity.

| Device model / Capacity                         | 8100                                                    | 8600                                                    |
|------------------------------------------------|---------------------------------------------------------|---------------------------------------------------------|
| Number of hard disk drives (HDDs)              |   8                                                     |  19                                                     |
| Number of solid state drives (SSDs)            |   4                                                     |  5                                                      |
| Single HDD capacity                            |   4 TB                                                  |  4 TB                                                   |
| Single SSD capacity                            |   400 GB                                                |  800 GB                                                 |
| Spare capacity                                 |   4 TB                                                  | 4 TB                                                    |
| Usable HDD capacity                            | 14 TB                                                   | 36 TB                                                   |
| Usable SSD capacity                            | 800 GB                                                  | 2 TB                                                    |
| Total usable capacity*                         | ~ 15 TB                                                 | ~ 38 TB                                                 |
| Maximum solution capacity (including cloud)    | 200 TB                                                  | 500 TB                                                  |


<sup>* </sup>- *The total usable capacity includes the capacity available for data, metadata, and buffers.*

## Enclosure dimensions and weight specifications  

The following tables list the various enclosure specifications for dimensions and weight.  

### Enclosure dimensions
The following table lists the dimensions of the enclosure in millimeters and inches.

|Enclosure |Millimeters |Inches |
|----------|------------|-------| 
| Height |87.9 | 3.46 |
| Width across mounting flange | 483 | 19.02 |
| Width across body of enclosure | 443 | 17.44 |
| Depth from front mounting flange to extremity of enclosure body | 577 | 22.72 |
| Depth from operations panel to furthest extremity of enclosure | 630.5 | 24.82 |
| Depth from mounting flange to furthest extremity of enclosure |	603 | 23.74 |

### Enclosure weight  

Depending on the configuration, a fully loaded primary enclosure can weigh from 21 to 33 kgs and requires two persons to handle it. 
 
| Enclosure | Weight |
|-----------|--------| 
| Maximum weight (depends on the configuration) |30 kg – 33 kg |
| Empty (no drives fitted) |21 – 23 kg |

## Enclosure environment specifications  

This section lists the specifications related to the enclosure environment. The temperature, humidity, altitude, shock, vibration, orientation, safety, and Electromagnetic Compatibility (EMC)are included in this category.  

### Temperature and humidity

| Enclosure        | Ambient temperature range  | Ambient relative humidity | Maximum wet bulb   |
|------------------|----------------------------|---------------------------|--------------------|
| Operational      | 5°C - 35°C(41°F - 95°F)    | 20% - 80% non-condensing- | 28°C (82°F)        |
| Non-operational  | -40°C - 70°C(40°F - 158°F) | 5% - 100% non-condensing  | 29°C (84°F)        |

### Airflow, altitude, shock, vibration, orientation, safety, and EMC
 
| Enclosure          | Operational specifications                                                |
|--------------------|---------------------------------------------------------------------------| 
| Airflow            | System airflow is front to rear. System must be operated with a low-pressure, rear-exhaust installation. Back pressure created by rack doors and obstacles should not exceed 5 pascals (0.5 mm water gauge). |
| Altitude, operational  | -30 meters to 3045 meters (-100 feet to 10,000 feet) with maximum operating temperature de-rated by 5°C above 7000 feet. |
| Altitude, non-operational  | -305 meters to 12,192 meters (-1,000 feet to 40,000 feet) |
| Shock, operational  | 5g 10 ms ½ sine |
| Shock, non-operational  | 30g 10 ms ½ sine |
| Vibration, operational  | 0.21g RMS 5-500 Hz random |
| Vibration, non-operational  | 1.04g RMS 2-200 Hz random |
| Vibration, relocation  | 3g 2-200 Hz sine |
| Orientation and mounting  | 19" rack mount (2 EIA units) |
| Rack rails  | To fit minimum 700 mm (31.50 inches) depth racks compliant with IEC 297 |
| Safety and approvals  |	CE and UL EN 61000-3, IEC 61000-3, UL 61000-3 |
| EMC  | EN55022 (CISPR - A), FCC A |

## International standards compliance
Your Microsoft Azure StorSimple device complies with the following international standards:  

- CE - EN 60950 - 1  
- CB report to IEC 60950 - 1  
- UL and cUL to UL 60950 - 1  

## Safety compliance  

Your Microsoft Azure StorSimple device meets the following safety ratings:  

- System product type approval: UL, cUL, CE  
- Safety compliance: UL 60950, IEC 60950, EN 60950  

## EMC compliance 

Your Microsoft Azure StorSimple device meets the following EMC ratings.  

### Emissions

The device is EMC compliant for conducted and radiated emissions levels.  

- Conducted emissions limit levels: CFR 47 Part 15B Class A EN55022 Class A CISPR Class A  
- Radiated emissions limit levels: CFR 47 Part 15B Class A EN55022 Class A CISPR Class A   

### Harmonics and flicker  

The device complies with EN61000-3-2/3.  

### Immunity limit levels  
The device complies with EN55024.  

## AC power cord compliance
  
The plug and the complete power cord assembly must meet the standards appropriate for the country in which the device is being used, and they must have safety approvals that are acceptable in that country. The following tables list standards for the USA and Europe.  

### AC power cords - USA (must be NRTL listed)

| Component       | Specification                                                     |
| --------------- | ----------------------------------------------------------------- | 
| Cord type       | SV or SVT, 18 AWG minimum, 3 conductor, 2.0 meters maximum length |
| Plug            | NEMA 5-15P grounding-type attachment plug rated 120 V, 10 A; or IEC 320 C14, 250 V, 10 A |
| Socket          | IEC 320 C-13, 250 V, 10 A                                         |

### AC power cords - Europe

| Component       | Specification                                                     |
| --------------- | ----------------------------------------------------------------- | 
| Cord type       | Harmonized, H05-VVF-3G1.0                                         |
| Socket          | IEC 320 C-13, 250 V, 10 A                                         |

## Supported network cables  

For the 10 GbE network interfaces, DATA 2 and DATA 3, refer to the [list of supported network cables and modules](storsimple-supported-hardware-for-10-gbe-network-interfaces.md).

## Next steps

You are now ready to deploy a StorSimple device in your datacenter. For more information, see [Deploying your on-premises device](storsimple-deployment-walkthrough-u2.md).  
