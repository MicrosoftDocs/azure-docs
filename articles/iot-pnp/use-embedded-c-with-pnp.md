# Using IoT Plug and Play with Constrained Devices

## Overview

If you are developing for **constrained devices**, then you can use IoT Plug and Play with the [Embedded C SDK](https://aka.ms/embeddedcsdk) or with [Azure RTOS](https://azure.microsoft.com/en-us/services/rtos/). This page serves as a landing page for samples showcasing Azure IoT Plug and Play for these constrained scenarios. 

## Using the Embedded C SDK

The Embedded C SDK offers a lightweight solution for connecting constrained devices to Azure IoT offerings, including IoT Plug and Play. Below are links to existing samples both for real device and for educational/debugging purposes. 

### Use a real device

For a complete end to end tutorial of using the Embedded C SDK with the Device Provisioning Service and IoT Plug and Play on a real device, see the following sample repository:

- [PIC-IoT Wx Development Board](https://github.com/Azure-Samples/Microchip-PIC-IoT-Wx)

### Introductory Embedded C SDK & IoT Plug and Play Samples

The Embedded C SDK repository contains [several samples](https://github.com/Azure/azure-sdk-for-c/tree/1.0.0-preview.4/sdk/samples/iot#iot-hub-plug-and-play-sample) showcasing how to use Azure IoT Plug and Play. 

*Note that these samples are shown running on Windows and Linux for educational and debugging purposes-- for production scenarios, these are intended for constrained devices only.*

- [Thermostat example with Embedded C SDK](https://github.com/Azure/azure-sdk-for-c/blob/master/sdk/samples/iot/paho_iot_hub_pnp_sample.c)

- [Temperature Controller example with the Embedded C SDK](https://github.com/Azure/azure-sdk-for-c/blob/1.0.0-preview.4/sdk/samples/iot/paho_iot_hub_pnp_component_sample.c)


## Using Azure RTOS

Azure RTOS includes a lightweight layer that adds native connectivity to Azure IoT Cloud services. This provides a simple mechanism to connect constrained devices to Azure IoT while also utilizing the advanced features of Azure RTOS.

## Toolchains
Samples are provided in a variety of IDE / toolchain combinations:
- IAR : IAR's [Embedded Workbench](https://www.iar.com/iar-embedded-workbench/) IDE
- GCC/CMake : Build on top of open source [CMake](https://cmake.org/) build system and the [Gnu Arm Embedded toolchain](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm).
- MCUExpresso : NXP's [MCUXpresso IDE](https://www.nxp.com/design/software/development-software/mcuxpresso-software-and-tools-/mcuxpresso-integrated-development-environment-ide:MCUXpresso-IDE)
- STM32Cube : STMicroeletronic's [STM32CubeIde](https://www.st.com/en/development-tools/stm32cubeide.html)
- MPLAB : Microchip's [MPLAB X IDE](https://www.microchip.com/mplab/mplab-x-ide)

## Samples
For complete tutorials on how to get started on different devices with Azure RTOS and IoT Plug and Play, see the following samples:

Manufacturer | Device | Samples |
| --- | --- | --- |
| Microchip | [ATSAME54-XPRO](https://www.microchip.com/developmenttools/productdetails/atsame54-xpro) | [GCC/CMake](https://github.com/azure-rtos/getting-started/tree/master/Microchip/ATSAME54-XPRO) • [IAR](https://aka.ms/azrtos-sample/e54-iar) • [MPLAB](https://aka.ms/azrtos-sample/e54-mplab)
| MXCHIP | [AZ3166](https://aka.ms/iot-devkit) | [GCC/CMake](https://github.com/azure-rtos/getting-started/tree/master/MXChip/AZ3166)
| NXP | [MIMXRT1060-EVK](https://www.nxp.com/design/development-boards/i-mx-evaluation-and-development-boards/mimxrt1060-evk-i-mx-rt1060-evaluation-kit:MIMXRT1060-EVK) | [GCC/CMake](https://github.com/azure-rtos/getting-started/tree/master/NXP/MIMXRT1060-EVK) • [IAR](https://aka.ms/azrtos-sample/rt1060-iar) • [MCUXpresso](https://aka.ms/azrtos-sample/rt1060-mcuxpresso)
| STMicroelectronics | [32F746GDISCOVERY](https://www.st.com/en/evaluation-tools/32f746gdiscovery.html) | [IAR](https://aka.ms/azrtos-sample/f746g-iar) • [STM32Cube](https://aka.ms/azrtos-sample/f746g-cubeide)
| STMicroelectronics | [B-L475E-IOT01](https://www.st.com/en/evaluation-tools/b-l475e-iot01a.html) | [GCC/CMake](https://github.com/azure-rtos/getting-started/tree/master/STMicroelectronics/STM32L4_L4%2B) • [IAR](https://aka.ms/azrtos-sample/l4s5-iar) • [STM32Cube](https://aka.ms/azrtos-sample/l4s5-cubeide)
| STMicroelectronics | [B-L4S5I-IOT01](https://www.st.com/en/evaluation-tools/b-l4s5i-iot01a.html) | [GCC/CMake](https://github.com/azure-rtos/getting-started/tree/master/STMicroelectronics/STM32L4_L4%2B) • [IAR](https://aka.ms/azrtos-sample/l4s5-iar) • [STM32Cube](https://aka.ms/azrtos-sample/l4s5-cubeide)
