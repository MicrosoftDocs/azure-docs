---
title: Azure Percept Vision datasheet
description: Check out the Azure Percept Vision datasheet for detailed device specifications
author: elqu20
ms.author: v-elqu
ms.service: azure-percept
ms.topic: reference
ms.date: 02/16/2021
---

# Azure Percept Vision datasheet

Specifications listed below are for the Azure Percept Vision device, included in the [Azure Percept DK](./azure-percept-dk-datasheet.md).

|Product Specification           |Value     |
|--------------------------------|---------------------|
|Target Industries               |Manufacturing <br> Smart Buildings <br> Auto <br> Retail |
|Hero Scenarios                  |Shopper analytics <br> On-shelf availability <br> Shrink reduction <br> Workplace monitoring|
|Dimensions                      |42mm x 42mm x 40mm (Azure Percept Vision SoM assembly with housing) <br> 42mm x 42mm x 6mm (Vision SoM chip)|
|Management Control Plane        |Azure Device Update (ADU)          |
|Supported Software and Services |[Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/) <br> [Azure IoT Edge](https://azure.microsoft.com/services/iot-edge/) <br> [Azure Machine Learning](https://azure.microsoft.com/services/machine-learning/) <br> [ONNX Runtime](https://www.onnxruntime.ai/) <br> [OpenVINO](https://docs.openvinotoolkit.org/latest/index.html) <br> Azure Device Update |
|AI Acceleration                 |Intel Movidius Myriad X (MA2085) Vision Processing Unit (VPU) with Intel Camera ISP integrated, 0.7 TOPS |
|Sensors and Visual Indicators   |Sony IMX219 Camera sensor with 6P Lens<br>Resolution: 8MP at 30FPS, Distance: 50cm - infinity<br>FoV: 120 degrees diagonal, Color: Wide Dynamic Range, Fixed Focus Rolling Shutter|
|Camera Support                  |RGB <br> 2 cameras can be run simultaneously |
|Security Crypto-Controller      |ST-Micro STM32L462CE      |
|Versioning / ID Component       |64kb EEPROM |
|Memory                          |LPDDR4 2GB     |
|Power                           |3.5 W     |
|Ports                           |1x USB 3.0 Type C <br> 2x MIPI 4 Lane (up to 1.5 Gbps per lane)     |
|Control Interfaces              |2x I2C <br> 2x SPI <br> 6x PWM (GPIOs: 2x clock, 2x frame sync, 2x unused) <br> 2x spare GPIO |
|Certification                   |FCC <br> IC <br> RoHS <br> REACH <br> UL   |
|Operating Temperature           |0 to 27 degrees C (Azure Percept Vision SoM assembly with housing) <br> -10 to 70 degrees C (Vision SoM chip) |
|Touch Temperature               |<= 48 degrees C |
|Relative Humidity               |8% to 90%    |
