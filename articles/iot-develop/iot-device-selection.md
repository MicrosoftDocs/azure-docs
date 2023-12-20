---
title: Azure IOT prototyping device selection list
description: This document provides guidance on choosing a hardware device for prototyping IoT Azure solutions.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.topic: conceptual
ms.date: 09/29/2023
---
# IoT device selection list

This IoT device selection list aims to give partners a starting point with IoT hardware to build prototypes and proof-of-concepts quickly and easily.[^1]

All boards listed support users of all experience levels.

>[!NOTE]
>This table is not intended to be an exhaustive list or for bringing solutions to production. [^2] [^3]

**Security advisory:** Except for the Azure Sphere, it's recommended to keep these devices behind a router and/or firewall.

[^1]: *If you're new to hardware programming, for MCU dev work we recommend using VS Code Arduino Extension or VS Code Platform IO Extension. For SBC dev work, you program the device like you would a laptop, that is, on the device itself. The Raspberry Pi supports VS Code development.*

[^2]: *Devices in the availability of support resources, common boards used for prototyping and PoCs, and boards that support beginner-friendly IDEs like Arduino IDE and VS Code extensions; for example, Arduino Extension and Platform IO extension. For simplicity, we aimed to keep the total device list <6. Other teams and individuals may have chosen to feature different boards based on their interpretation of the criteria.*

[^3]: *For bringing devices to production, you likely want to test a PoC with a specific chipset, ST's STM32 or Microchip's Pic-IoT breakout board series, design a custom board that can be manufactured for lower cost than the MCUs and SBCs listed here, or even explore FPGA-based dev kits. You may also want to use a development environment for professional electrical engineering like STM32CubeMX or ARM mBed browser-based programmer.*

## Contents

| Section | Description |
|--------------|-----------|
| [Start here](#start-here) | A guide to using this selection list. Includes suggested selection criteria.|
| [Selection diagram](#application-selection-visual) | A visual that summarizes common selection criteria with possible hardware choices. |
| [Terminology and ML requirements](#terminology-and-ml-requirements) | Terminology and acronym definitions and device requirements for edge machine learning (ML). |
| [MCU device list](#mcu-device-list) | A list of recommended MCUs, for example, ESP32, with tech specs and alternatives. |
| [SBC device list](#sbc-device-list) | A list of recommended SBCs, for example, Raspberry Pi, with tech specs and alternatives. |

## Start here

### How to use this document

Use this document to better understand IoT terminology, device selection considerations, and to choose an IoT device for prototyping or building a proof-of-concept. We recommend the following procedure:

1. Read through the 'what to consider when choosing a board' section to identify needs and constraints.

2. Use the Application Selection Visual to identify possible options for your IoT scenario.

3. Using the MCU or SBC Device Lists, check device specifications and compare against your needs/constraints.

### What to consider when choosing a board

To choose a device for your IoT prototype, see the following criteria:

- **Microcontroller unit (MCU) or single board computer (SBC)**
  - An MCU is preferred for single tasks, like gathering and uploading sensor data or machine learning at the edge. MCUs also tend to be lower cost.
  - An SBC is preferred when you need multiple different tasks, like gathering sensor data and controlling another device. It may also be preferred in the early stages when there are many options for possible solutions - an SBC enables you to try lots of different approaches.

- **Processing power**

  - **Memory**: Consider how much memory storage (in bytes), file storage, and memory to run programs your project needs.

  - **Clock speed**: Consider how quickly your programs need to run or how quickly you need the device to communicate with the IoT server.

  - **End-of-life**: Consider if you need a device with the most up-to-date features and documentation or if you can use a discontinued device as a prototype.

- **Power consumption**

  - **Power**: Consider how much voltage and current the board consumes. Determine if wall power is readily available or if you need a battery for your application.

  - **Connection**: Consider the physical connection to the power source. If you need battery power, check if there's a battery connection port available on the board. If there's no battery connector, seek another comparable board, or consider other ways to add battery power to your device.

- **Inputs and outputs**
  - **Ports and pins**: Consider how many and of what types of ports and I/O pins your project may require.
        * Other considerations include if your device will be communicating with other sensors or devices. If so, identify how many ports those signals require.

  - **Protocols**: If you're working with other sensors or devices, consider what hardware communication protocols are required.
        * For example, you may need CAN, UART, SPI, I2C, or other communication protocols.
  - **Power**: Consider if your device will be powering other components like sensors. If your device is powering other components, identify the voltage, and current output of the device's available power pins and determine what voltage/current your other components need.

  - **Types**: Determine if you need to communicate with analog components. If you are in need of analog components, identify how many analog I/O pins your project needs.

  - **Peripherals**: Consider if you prefer a device with onboard sensors or other features like a screen, microphone, etc.

- **Development**

  - **Programming language**: Consider if your project requires higher-level languages beyond C/C++. If so, identify the common programming languages for the application you need (for example, Machine Learning is often done in Python). Think about what SDKs, APIs, and/or libraries are helpful or necessary for your project. Identify what programming language(s) these are supported in.

  - **IDE**: Consider the development environments that the device supports and if this meets the needs, skill set, and/or preferences of your developers.

  - **Community**: Consider how much assistance you want/need in building a solution. For example, consider if you prefer to start with sample code, if you want troubleshooting advice or assistance, or if you would benefit from an active community that generates new samples and updates documentation.
  
  - **Documentation**: Take a look at the device documentation. Identify if it's complete and easy to follow. Consider if you need schematics, samples, datasheets, or other types of documentation. If so, do some searching to see if those items are available for your project. Consider the software SDKs/APIs/libraries that are written for the board and if these items would make your prototyping process easier. Identify if this documentation is maintained and who the maintainers are.

- **Security**

  - **Networking**: Consider if your device is connected to an external  network or if it can be kept behind a router and/or firewall. If your prototype needs to be connected to an externally facing network, we  recommend using the Azure Sphere as it is the only reliably secure device.

  - **Peripherals**: Consider if any of the peripherals your device connects to have wireless protocols (for example, WiFi, BLE).

  - **Physical location**: Consider if your device or any of the peripherals it's connected to will be accessible to the public. If so, we recommend making the device physically inaccessible. For example, in a closed, locked box.

## Application selection visual

>[!NOTE]
>This list is for educational purposes only, it is not intended to endorse any products.
>
:::image type="content" source="media/iot-device-selection/iot-device-selection-visual.png" alt-text="Table that shows common selection criteria with possible hardware choices.":::

## Terminology and ML requirements

This section provides definitions for embedded terminology and acronyms and hardware specifications for visual, auditory, and sensor machine learning applications.

### Terminology

Terminology and acronyms are listed in alphabetical order.

| Term | Definition |
| ---- | --------- |
| ADC | Analog to digital converter; converts analog signals from connected components like sensors to digital signals that are readable by the device |
| Analog pins | Used for connecting analog components that have continuous signals like photoresistors (light sensors) and microphones |
| Clock speed | How quickly the CPU can retrieve and interpret instructions |
| Digital pins | Used for connecting digital components that have binary signals like LEDs and switches |
| Flash (or ROM) | Memory available for storing programs |
| IDE | Integrated development environment; a program for writing software code |
| IMU | Inertial measurement unit |
| IO (or I/O) pins | Input/Output pins used for communicating with other devices like sensors and other controllers |
| MCU | Microcontroller Unit; a small computer on a single chip that includes a CPU, RAM, and IO |
| MPU | Microprocessor unit; a computer processor that incorporates the functions of a computer's central processing unit (CPU) on a single integrated circuit (IC), or at most a few integrated circuits. |
| ML | Machine learning; special computer programs that do complex pattern recognition |
| PWM | Pulse width modulation; a way to modify digital signals to achieve analog-like effects like changing brightness, volume, and speed |
| RAM | Random access memory; how much memory is available to run programs |
| SBC | Single board computer |
| TF | TensorFlow; a machine learning software package designed for edge devices |
| TF Lite | TensorFlow Lite; a smaller version of TF for small edge devices |

### Machine learning hardware requirements

#### Vision ML

- Speed: 200 MHz
- Flash: 300 kB
- RAM: 100 kB

#### Speech ML

- Speed: 60 MHz [^4]
- Flash: 50 kB
- RAM: 8 kB

#### Sensor ML (for example, motion, distance)

- Speed: 20 MHz
- Flash: 20 kB
- RAM: 2 kB

[^4]: *Speed requirement is largely due to the need for processors to be able to sample a minimum of 6 kHz for microphones to be able to process human vocal frequencies.*

## MCU device list

Following is a comparison table of MCUs in alphabetical order. The list isn't not intended to be exhaustive.

>[!NOTE]
>This list is for educational purposes only, it is not intended to endorse any products. Prices shown represent the average across multiple distributors and are for illustrative purposes only.

| Board Name | Price Range (USD) | What is it used for? | Software| Speed | Processor | Memory | Onboard Sensors and Other Features | IO Pins | Video | Radio | Battery Connector? | Operating Voltage | Getting Stated Guides | **Alternatives** |
| ---- | ---- | ---- | ----| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| [Azure Sphere MT3620 Dev Kit](https://aka.ms/IotDeviceList/Sphere) | ~$40 - $100 | Highly secure applications | C/C++, VS Code, VS | 500 MHz & 200 MHz | MT3620 (tri-core--1 x Cortex A7, 2 x Cortex M4) | 4-MB RAM + 2 x 64-KB RAM | Certifications: CE/FCC/MIC/RoHS | 4 x Digital IO, 1 x I2S, 4 x ADC, 1 x RTC | - | Dual-band 802.11 b/g/n with antenna diversity | - | 5 V | 1. [Azure Sphere Samples Gallery](https://github.com/Azure/azure-sphere-gallery#azure-sphere-gallery), 2. [Azure Sphere Weather Station](https://www.hackster.io/gatoninja236/azure-sphere-weather-station-d5a2bc)| N/A |
| [Adafruit HUZZAH32 – ESP32 Feather Board](https://aka.ms/IotDeviceList/AdafruitFeather) | ~$20 - $25 | Monitoring; Beginner IoT; Home automation | Arduino IDE, VS Code | 240 MHz | 32-Bit ESP32 (dual-core Tensilica LX6) | 4 MB SPI Flash, 520 KB SRAM | Hall sensor, 10x capacitive touch IO pins, 50+ add-on boards | 3 x UARTs, 3 x SPI, 2 x I2C, 12 x ADC inputs, 2 x I2S Audio, 2 x DAC | - | 802.11b/g/n HT40 Wi-Fi transceiver, baseband, stack and LWIP, Bluetooth and BLE | √ | 3.3 V | 1. [Scientific freezer monitor](https://www.hackster.io/adi-azulay/azure-edge-impulse-scientific-freezer-monitor-5448ee), 2. [Azure IoT SDK Arduino samples](https://github.com/Azure/azure-sdk-for-c-arduino) | [Arduino Uno WiFi Rev 2 (~$50 - $60)](https://aka.ms/IotDeviceList/ArduinoUnoWifi) |
| [Arduino Nano 33 BLE Sense](https://aka.ms/IotDeviceList/ArduinoNanoBLE) | ~$30 - $35 | Monitoring; ML; Game controller; Beginner IoT | Arduino IDE, VS Code | 64 MHz | 32-bit Nordic nRF52840 (Cortex M4F) | 1 MB Flash, 256 KB SRAM | 9-axis inertial sensor, Humidity and temp sensor, Barometric sensor, Microphone, Gesture, proximity, light color and light intensity sensor | 14 x Digital IO, 1 x UART, 1 x SPI, 1 x I2C, 8 x ADC input | - | Bluetooth and BLE | - | 3.3 V – 21 V | 1. [Connect Nano BLE to Azure IoT Hub](https://create.arduino.cc/projecthub/Arduino_Genuino/securely-connecting-an-arduino-nb-1500-to-azure-iot-hub-af6470), 2. [Monitor beehive with Azure Functions](https://www.hackster.io/clementchamayou/how-to-monitor-a-beehive-with-arduino-nano-33ble-bluetooth-eabc0d) | [Seeed XIAO BLE sense (~$15 - $20)](https://aka.ms/IotDeviceList/SeeedXiao) |
| [Arduino Nano RP2040 Connect](https://aka.ms/IotDeviceList/ArduinoRP2040Nano) | ~$20 - $25  | Remote control; Monitoring | Arduino IDE, VS Code, C/C++, MicroPython | 133 MHz | 32-bit RP2040 (dual-core Cortex M0+) | 16 MB Flash, 264-kB RAM | Microphone, Six-axis IMU with AI capabilities | 22 x Digital IO, 20 x PWM, 8 x ADC | - | WiFi, Bluetooth | - | 3.3 V | - |[Adafruit Feather RP2040 (NOTE: also need a FeatherWing for WiFi)](https://aka.ms/IotDeviceList/AdafruitRP2040) |
| [ESP32-S2 Saola-1](https://aka.ms/IotDeviceList/ESPSaola) | ~$10 - $15 | Home automation; Beginner IoT; ML; Monitoring; Mesh networking | Arduino IDE, Circuit Python, ESP IDF | 240 MHz | 32-bit ESP32-S2 (single-core Xtensa LX7) | 128 kB Flash, 320 kB SRAM, 16 kB SRAM (RTC) | 14 x capacitive touch IO pins, Temp sensor | 43 x Digital pins, 8 x PWM, 20 x ADC, 2 x DAC | Serial LCD, Parallel PCD | Wi-Fi 802.11 b/g/n (802.11n up to 150 Mbps) | - | 3.3 V | 1. [Secure face detection with Azure ML](https://www.hackster.io/achindra/microsoft-azure-machine-learning-and-face-detection-in-iot-2de40a), 2. [Azure Cost Monitor](https://www.hackster.io/jenfoxbot/azure-cost-monitor-31811a) | [ESP32-DevKitC (~$10 - $15)](https://aka.ms/IotDeviceList/ESPDevKit) |
| [Wio Terminal (Seeed Studio)](https://aka.ms/IotDeviceList/WioTerminal) | ~$40 - $50 | Monitoring; Home Automation; ML | Arduino IDE, VS Code, MicroPython, ArduPy | 120 MHz | 32-bit ATSAMD51 (single-core Cortex-M4F) | 4 MB SPI Flash, 192-kB RAM | On-board screen, Microphone, IMU, buzzer, microSD slot, light sensor, IR emitter, Raspberry Pi GPIO mount (as child device) | 26 x Digital Pins, 5 x PWM, 9 x ADC | 2.4" 320x420 Color LCD | dual-band 2.4Ghz/5Ghz (Realtek RTL8720DN) | - | 3.3 V | [Monitor plants with Azure IoT](https://github.com/microsoft/IoT-For-Beginners/tree/main/2-farm/lessons/4-migrate-your-plant-to-the-cloud) | [Adafruit FunHouse (~$30 - $40)](https://aka.ms/IotDeviceList/AdafruitFunhouse) |

## SBC device list

Following is a comparison table of SBCs in alphabetical order. This list isn't intended to be exhaustive.

>[!NOTE]
>This list is for educational purposes only, it is not intended to endorse any products. Prices shown represent the average across multiple distributors and are for illustrative purposes only.

| Board Name | Price Range (USD) | What is it used for? | Software| Speed | Processor | Memory | Onboard Sensors and Other Features | IO Pins | Video | Radio | Battery Connector? | Operating Voltage | Getting Started Guides | **Alternatives** |
| ---- | ---- | ---- | ----| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ----|
| [Raspberry Pi 4, Model B](https://aka.ms/IotDeviceList/RpiModelB) | ~$30 - $80 | Home automation; Robotics; Autonomous vehicles; Control systems; Field science | Raspberry Pi OS, Raspbian, Ubuntu 20.04/21.04, RISC OS, Windows 10 IoT, more | 1.5 GHz CPU, 500 MHz GPU | 64-bit Broadcom BCM2711 (quad-core Cortex-A72), VideoCore VI GPU | 2GB/4GB/8GB LPDDR4 RAM, SD Card (not included) | 2 x USB 3 ports, 1 x MIPI DSI display port, 1 x MIPI CSI camera port, 4-pole stereo audio and composite video port, Power over Ethernet (requires HAT) | 26 x Digital, 4 x PWM | 2 micro-HDMI composite, MPI DSI | WiFi, Bluetooth | √ | 5 V | 1. [Send data to IoT Hub](https://www.hackster.io/jenfoxbot/how-to-send-see-data-from-a-raspberry-pi-to-azure-iot-hub-908924), 2. [Monitor plants with Azure IoT](https://github.com/microsoft/IoT-For-Beginners/tree/main/2-farm/lessons/4-migrate-your-plant-to-the-cloud)| [BeagleBone Black Wireless (~$50 - $60)](https://www.beagleboard.org/boards/beaglebone-black-wireless) |
| [NVIDIA Jetson 2 GB Nano Dev Kit](https://aka.ms/IotDeviceList/NVIDIAJetson) | ~$50 - $100 | AI/ML; Autonomous vehicles | Ubuntu-based JetPack | 1.43 GHz CPU, 921 MHz GPU | 64-bit Nvidia CPU (quad-core Cortex-A57), 128-CUDA-core Maxwell GPU coprocessor | 2GB/4GB LPDDR4 RAM | 472 GFLOPS for AI Perf, 1 x MIPI CSI-2 connector | 28 x Digital, 2 x PWM | HDMI, DP (4 GB only) | Gigabit Ethernet, 802.11ac WiFi | √ | 5 V | [Deepstream integration with Azure IoT Central](https://www.hackster.io/pjdecarlo/nvidia-deepstream-integration-with-azure-iot-central-d9f834) | [BeagleBone AI (~$110 - $120)](https://aka.ms/IotDeviceList/BeagleBoneAI) |
| [Raspberry Pi Zero W2](https://aka.ms/IotDeviceList/RpiZeroW) | ~$15 - $20 | Home automation; ML; Vehicle modifications; Field Science | Raspberry Pi OS, Raspbian, Ubuntu 20.04/21.04, RISC OS, Windows 10 IoT, more | 1 GHz CPU, 400 MHz GPU | 64-bit Broadcom BCM2837 (quad-core Cortez-A53), VideoCore IV GPU | 512 MB LPDDR2 RAM, SD Card (not included) | 1 x CSI-2 Camera connector | 26 x Digital, 4 x PWM | Mini-HDMI | WiFi, Bluetooth | - | 5 V | [Send and visualize data to Azure IoT Hub](https://www.hackster.io/jenfoxbot/how-to-send-see-data-from-a-raspberry-pi-to-azure-iot-hub-908924) | [Onion Omega2+ (~$10 - $15)](https://onion.io/Omega2/) |
| [DFRobot LattePanda](https://aka.ms/IotDeviceList/DFRobotLattePanda) | ~$100 - $160 | Home automation; Hyperscale cloud connectivity; AI/ML | Windows 10, Ubuntu 16.04, OpenSuSE 15 | 1.92 GHz | 64-bit Intel Z8350 (quad-core x86-64), Atmega32u4 coprocessor | 2 GB DDR3L RAM, 32 GB eMMC/4GB DDR3L RAM, 64-GB eMMC | - | 6 x Digital (20 x via Atmega32u4), 6 x PWM, 12 x ADC | HDMI, MIPI DSI | WiFi, Bluetooth | √ | 5 V | 1. [Getting started with Microsoft Azure](https://www.hackster.io/45361/dfrobot-lattepanda-with-microsoft-azure-getting-started-0ae8fb), 2. [Home Monitoring System with Azure](https://www.hackster.io/JiongShi/home-monitoring-system-based-on-lattepanda-zigbee-and-azure-ce4e03)| [Seeed Odyssey X86J4125800 (~$210 - $230)](https://aka.ms/IotDeviceList/SeeedOdyssey) |

## Questions? Requests?

Please submit an issue!

## See Also

Other helpful resources include:

- [Overview of Azure IoT device types](./concepts-iot-device-types.md)
- [Overview of Azure IoT Device SDKs](./about-iot-sdks.md)
- [Quickstart: Send telemetry from an IoT Plug and Play device to Azure IoT Hub](./quickstart-send-telemetry-iot-hub.md?pivots=programming-language-ansi-c)
- [AzureRTOS ThreadX Documentation](/azure/rtos/threadx/)
