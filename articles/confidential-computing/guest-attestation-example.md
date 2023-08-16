---
title: Use sample application for guest attestation in confidential VMs
description: Learn how to use a sample Linux or Windows application for use with the guest attestation feature APIs.
author: prasadmsft
ms.author: reprasa
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.topic: how-to
ms.date: 04/11/2023
ms.custom: template-concept, ignite-2022, devx-track-linux
---
 
# Use sample application for guest attestation

The [*guest attestation*](guest-attestation-confidential-vms.md) feature helps you to confirm that a confidential VM runs on a hardware-based trusted execution environment (TEE) with security features enabled for isolation and integrity.

Sample applications for use with the guest attestation APIs are [available on GitHub](https://github.com/Azure/confidential-computing-cvm-guest-attestation).

Depending on your [type of scenario](guest-attestation-confidential-vms.md#scenarios), you can reuse the sample code in your client program or workload code. 

## Prerequisites

- An Azure subscription.
- An Azure [confidential VM](quick-create-confidential-vm-portal-amd.md) or a [VM with trusted launch enabled](../virtual-machines/trusted-launch-portal.md). You can use a Ubuntu Linux VM or Windows VM.

## Use sample application

To use a sample application in C++ for use with the guest attestation APIs, follow the instructions for your operating system (OS).

#### [Ubuntu](#tab/linux)

1. Sign in to your VM.

1. Clone the [sample Linux application](https://github.com/Azure/confidential-computing-cvm-guest-attestation/tree/main/cvm-platform-checker-exe/Linux).

1. Install the `build-essential` package. This package installs everything required for compiling the sample application.

    ```bash
    sudo apt-get install build-essential 
    ```

1. Install the `libcurl4-openssl-dev` and `libjsoncpp-dev` packages.

    ```bash
    sudo apt-get install libcurl4-openssl-dev 
    ```

    ```bash
    sudo apt-get install libjsoncpp-dev 
    ```

1. Download the attestation package from <https://packages.microsoft.com/repos/azurecore/pool/main/a/azguestattestation1/>.

1. Install the attestation package. Make sure to replace `<version>` with the version that you downloaded.

    ```bash
    sudo dpkg -i azguestattestation1_<latest-version>_amd64.deb
    ```

#### [Windows](#tab/windows)

1. Install Visual Studio with the [**Desktop development with C++** workload](/cpp/build/vscpp-step-0-installation).
1. Clone the [sample Windows application](https://github.com/Azure/confidential-computing-cvm-guest-attestation/tree/main/cvm-platform-checker-exe/Windows).
1. Build your project. From the **Build** menu, select **Build Solution**.
1. After the build succeeds, go to the `Release` build folder.
1. Run the application by running the `AttestationClientApp.exe`.

---

## Next steps

- [Learn how to use Microsoft Defender for Cloud integration with confidential VMs with guest attestation installed](guest-attestation-defender-for-cloud.md) 
- [Learn more about the guest attestation feature](guest-attestation-confidential-vms.md)
- [Learn about Azure confidential VMs](confidential-vm-overview.md)
