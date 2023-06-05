---
title: Microsoft Azure FXT Edge Filer specifications | Microsoft Docs
description: Learn about the physical and environmental specifications for Microsoft Azure FXT Edge Filer hardware.
author: femila
ms.service: fxt-edge-filer
ms.topic: conceptual
ms.date: 06/20/2019
ms.author: femila
---

# Azure FXT Edge Filer specifications

This article explains the hardware specifications for Azure FXT Edge Filer hardware nodes. In practice, three or more nodes are configured together to provide the clustered cache system.

## Hardware specifications

| Component | FXT 6600 | FXT 6400 |
|----------|-----------|-----------|
| CPU cores |  16 | 16 |
| DRAM  | 1536 GB | 768 GB |
| Network ports | 6 x 25/10 Gb + 2 x 1 Gb | 6 x 25/10 Gb + 2 x 1 Gb |
| NVMe SSD capacity | 25.6 TB | 12.8 TB |

## Drive specifications

The system has ten drive bays, accessible from the front. Each populated drive is labeled on the right with capacity information.

Drive numbers are printed on the space between drives. In the Azure FXT Edge Filer, drive 0 is the top left drive, and drive 1 is directly underneath it.

![photo of one hard drive bay in the FXT chassis, showing drive numbers and capacity labels](media/fxt-drives-photo.png)

| Drive numbers    |  Use   |  Specifications |
|------------------|--------|-----------------|
| 0, 1             | OS     | 480 GB SATA SSD |
| 2, 3, 4, 5, 6, 7, 8, 9 | Data   | FXT 6600: 3.2 TB NVMe SSD <br> FXT 6400: 1.6 TB NVMe SSD |

## Dimensions and weight

The Azure FXT Edge Filer is designed to fit in a standard 19" equipment rack and is one rack unit high (1U).

<!-- 10x2.5 inches version -->

| Filer dimensions            | Value                    |
|-----------------------------|--------------------------|
| Height                      | 42.8 mm (1.68 inches)    |
| Width (including rack ears) | 482.0 mm (18.97 inches)  |
| Width - main enclosure      | 434.0 mm  (17.08 inches) |
| Depth - rack ears to back of main enclosure                   | 733.82 mm (29.61 inches) |
| Depth - rack ears to furthest rear protrusion                 | 772.67 mm (30.42 inches) |
| Depth - rack ears to furthest front protrusion, without bezel | 22.0 mm (0.87 inch)  |
| Depth - rack ears to furthest front protrusion, with bezel    | 35.84 mm (1.41 inches) |

| Weight | Value |
|-----------------|----------------------|
| Node weight (without packaging, without accessories) | 40 lbs (18.1 kg) |
| Net weight (without packaging, including accessories) | 51 lbs (23.1 kg)|
| Gross weight (as shipped, includes all packaging) |  64 lbs (29.0 kg) |

### Shipping dimensions

| Package dimension | Millimeters | Inches |
|-------------------|-------------|--------|
| Height            | 311.2       | 12.25" |
| Width             | 642.8       | 25.31" |
| Length            | 1,051.1     | 41.38" |

## Power and thermal specifications

This section gives power ratings and measurements for the Azure FXT Edge Filer.

### Nameplate ratings

| Nameplate ratings for FXT 6000 series models |
|----------------|
| 100 - 240V~    |
| 10A - 5A (X2)  |
| 50/60Hz         |

<!-- matches the Dell regulatory label exactly -->

### Power and thermal measurements

Azure FXT Edge Filer nodes use variable speed fans, so power depends on temperature and load. Maximum fan speeds can be reached at certain combinations of high load and elevated ambient temperatures.

These charts give power consumption and thermal output measurements for commonly used voltage-frequency combinations.

| FXT 6600 power at room temperature <br />(22° C, 71.6° F) | 100 V, 60 Hz | 120 V, 60 Hz | 208 V, 60 Hz | 230 V, 50 Hz | 240 V, 50 Hz |
|---------|---|---|---|---|---|
| Voltage (V) | 100 | 120 | 208 | 230 | 240 |
| Frequency (Hz) | 60 | 60 | 60 | 50 | 50 |
| Current (A) | 5.02 | 4.16 |2.40 | 2.20 | 2.16 |
| Apparent Power (VA) | 502 | 499 | 499 | 506 | 518|
| Power Factor | 0.99 | 0.99 |0.98 | 0.98 | 0.98 |
| Real Power (W) | 497 |494 | 489 | 496 | 508 |
| Thermal Dissipation (BTU/Hr) |1696 | 1686 | 1669 | 1692 | 1733 |

| FXT 6600 power at maximum fan speeds | 100 V, 60 Hz | 120 V, 60 Hz | 208 V, 60 Hz | 230 V, 50 Hz | 240 V, 50 Hz |
|---------|---|---|---|---|---|
| Voltage (V) | 100 |120 | 208 | 230 | 240|
| Frequency (Hz) | 60 | 60 | 60 | 50 | 50 |
| Current (A) | 5.98 | 5.01 | 2.81 | 2.55 | 2.48 |
| Apparent Power (VA) | 598 | 601 | 584 | 587 | 595 |
| Power Factor | 0.99 | 0.99 | 0.98 | 0.98 | 0.98 |
| Real Power (W) | 592 | 595 | 573 | 575 | 583 |
| Thermal Dissipation (BTU/Hr) | 2020 |2031 | 1954 | 1961 | 1990 |

| FXT 6400 power at room temperature <br />(22° C, 71.6° F) | 100 V, 60 Hz | 120 V, 60 Hz | 208 V, 60 Hz | 230 V, 50 Hz | 240 V, 50 Hz |
|---------|---|---|---|---|---|
| Voltage (V) | 100 | 120 | 208 | 230 | 240 |
| Frequency (Hz) |60 | 60 | 60 | 50 | 50 |
| Current (A) | 4.63 | 3.86 | 2.24 | 2.04 | 1.94 |
| Apparent Power (VA) | 463 | 463 | 466 | 469 | 466 |
| Power Factor | 0.99 | 0.99 | 0.98 | 0.98 | 0.98 |
| Real Power (W) | 458 | 459 | 457 | 460 | 456 |
| Thermal Dissipation (BTU/Hr) | 1564 | 1565 | 1558 | 1569 | 1557 |

| FXT 6400 power at maximum fan speeds | 100 V, 60 Hz | 120 V, 60 Hz | 208 V, 60 Hz | 230 V, 50 Hz | 240 V, 50 Hz |
|---------|---|---|---|---|---|
| Voltage (V) | 100 | 120 | 208 | 230 | 240 |
| Frequency (Hz) | 60 | 60 | 60 | 50 | 50 |
| Current (A) | 5.15 | 4.28 | 2.48 | 2.28 | 2.13 |
| Apparent Power (VA) | 515 | 514 | 516 | 524 | 511 |
| Power Factor | 0.99 | 0.99 | 0.98 | 0.98 | 0.98 |
| Real Power (W) | 510 | 508 | 506 | 514 | 501 |
| Thermal Dissipation (BTU/Hr) | 1740 | 1735 | 1725 | 1753 | 1709 |

## Environmental requirements

This section gives specifications for the hardware's ambient environment.

### Temperature and humidity

| Environmental attribute   | Operating range                   | Non-operating range         |
|---------------------------|-----------------------------------|-----------------------------|
| Ambient temperature range | 10°C to 35°C (50 - 86°F)          | -40°C to 65°C (-40 - 149°F) |
| Ambient relative humidity | 10% - 80% non-condensing          | 5% - 95% non-condensing     |
| Maximum dew point         | 29°C (84°F)                       | 33°C (91°F)                 |
| Altitude                  | up to 3048 meters (10,000 feet), subject to temperature de-rating noted below | up to 12,000 meters (39,370 feet) |

> [!NOTE]
> **Altitude temperature de-rating:** Maximum temperature is reduced by 1°C/300 m (1°F/547 ft) above 950 m (3,117 ft).

### Airflow, shock, and vibration

| Attribute         | Specification |
|-------------------|---------------|
| Airflow                    | System airflow is front to rear. System must be operated with a low-pressure rear exhaust installation. |
| Shock, operational         | 6 G for 11 milliseconds (tested in 6 orientations) |
| Shock, non-operational     | 71 G for 2 milliseconds (tested in 6 orientations) |
| Vibration, operational     | 0.26 G<sub>RMS</sub> 5 Hz to 350 Hz random         |
| Vibration, non-operational | 1.88 G<sub>RMS</sub> 10 Hz to 500 Hz for 15 minutes (all six sides tested)  |

## Safety regulation compliance

Azure FXT Edge Filer complies with the listed regulations.

| Category       | Regulatory specification |
|----------------|--------------------------|
| General safety | EN 60950-1:2006 +A1:2010 +A2:2013 +A11:2009 +A12:2011/IEC 60950-1:2005 ed2 +A1:2009 +A2:2013 <br>EN 62311:2008 |
| EMC            | FCC A, ICES-003  <br>EN 55032:2012/CISPR 32:2012  <br>EN 55032:2015/CISPR 32:2015  <br>EN 55024:2010 +A1:2015/CISPR 24:2010 +A1:2015  <br>EN 61000-3-2:2014/IEC 61000-3-2:2014 (Class D)   <br>EN 61000-3-3:2013/IEC 61000-3-3:2013 |
| Energy         | Commission Regulation (EU) No. 617/2013  |
| RoHS           |    EN 50581:2012   |
