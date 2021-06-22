---
title: Azure Percept Dev Tools Pack Installer overview 
description: Learn more about using the Dev Tools Pack Installer to accelerate advanced development with Azure Percept
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 03/25/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Dev Tools Pack Installer overview

The Dev Tools Pack Installer is a one-stop solution that installs and configures all the tools required to develop an advanced intelligent edge solution.

## Mandatory tools

* [Visual Studio Code](https://code.visualstudio.com/)
* [Python 3.6 or later](https://www.python.org/)
* [Docker 20.10](https://www.docker.com/)
* [PIP3 21.1](https://pip.pypa.io/en/stable/user_guide/)
* [TensorFlow 2.0](https://www.tensorflow.org/)
* [Azure Machine Learning SDK 1.2](/python/api/overview/azure/ml/)

## Optional tools

* [NVIDIA DeepStream SDK 5](https://developer.nvidia.com/deepstream-sdk) (toolkit for developing solutions for NVIDIA Accelerators)
* [Intel OpenVINO Toolkit 2021.3](https://docs.openvinotoolkit.org/) (toolkit for developing solutions for Intel Accelerators)
* [Lobe.ai 0.9](https://lobe.ai/)  
* [Streamlit 0.8](https://www.streamlit.io/)
* [Pytorch 1.4.0 (Windows) or 1.2.0 (Linux)](https://pytorch.org/)
* [Miniconda 4.5](https://docs.conda.io/en/latest/miniconda.html)
* [Chainer 7.7](https://chainer.org/)
* [Caffe 1.0](https://caffe.berkeleyvision.org/)
* [CUDA Toolkit 11.2](https://developer.nvidia.com/cuda-toolkit)
* [Microsoft Cognitive Toolkit 2.5.1](https://www.microsoft.com/research/product/cognitive-toolkit/?lang=fr_ca)

## Known issues

- Optional Caffe, NVIDIA DeepStream SDK, and Intel OpenVINO Toolkit installations might fail if Docker isn't running properly. To install these optional tools, ensure that Docker is installed and running before you attempt the installations through the Dev Tools Pack Installer.

- Optional CUDA Toolkit installed on the Mac version is 10.0.130. CUDA Toolkit 11 no longer supports development or running applications on macOSity.

## Docker minimum requirements

### Windows

- Windows 10 64-bit: Pro, Enterprise, or Education (build 16299 or later).

- Hyper-V and Containers Windows features must be enabled. The following hardware prerequisites are required to successfully run Hyper-V on Windows 10:

    - 64-bit processor with [Second Level Address Translation (SLAT)](https://en.wikipedia.org/wiki/Second_Level_Address_Translation)
    - 4 GB system RAM
    - BIOS-level hardware virtualization support must be enabled in the BIOS settings. For more information, see Virtualization.

> [!NOTE]
> Docker supports Docker Desktop on Windows based on Microsoft’s support lifecycle for Windows 10 operating system. For more information, see the [Windows lifecycle fact sheet](https://support.microsoft.com/help/13853/windows-lifecycle-fact-sheet).

Learn more about [installing Docker Desktop on Windows](https://docs.docker.com/docker-for-windows/install/#install-docker-desktop-on-windows).

### Mac

- Mac must be a 2010 or a newer model with the following attributes:
    - Intel processor
    - Intel’s hardware support for memory management unit (MMU) virtualization, including Extended Page Tables (EPT) and Unrestricted Mode. You can check to see if your machine has this support by running the following command in a terminal: ```sysctl kern.hv_support```. If your Mac supports the Hypervisor framework, the command prints ```kern.hv_support: 1```.

- macOS version 10.14 or newer (Mojave, Catalina, or Big Sur). We recommend upgrading to the latest version of macOS. If you experience any issues after upgrading your macOS to version 10.15, you must install the latest version of Docker Desktop to be compatible with this version of macOS.

- At least 4 GB of RAM.

- Do NOT install VirtualBox prior to version 4.3.30--it is not compatible with Docker Desktop.

- The installer is not supported on Apple M1.

Learn more about [installing Docker Desktop on Mac](https://docs.docker.com/docker-for-mac/install/#system-requirements).

## Launch the installer

Download the Dev Tools Pack Installer for [Windows](https://go.microsoft.com/fwlink/?linkid=2132187), [Linux](https://go.microsoft.com/fwlink/?linkid=2132186), or [Mac](https://go.microsoft.com/fwlink/?linkid=2132296). Launch the installer according to your platform, as described below.

### Windows

1. Click on **Dev-Tools-Pack-Installer** to open the installation wizard.

### Mac

1. After downloading, move the **Dev-Tools-Pack-Installer.app** file to the **Applications** folder.

1. Click on **Dev-Tools-Pack-Installer.app** to open the installation wizard.

1. If you receive an “unidentified developer” security dialog:

    1. Go to **System Preferences** -> **Security & Privacy** -> **General** and click **Open Anyway** next to **Dev-Tools-Pack-Installer.app**.
    1. Click the electron icon.
    1. Click **Open** in the security dialog.

### Linux

1. When prompted by the browser, click **Save** to complete the installer download.

1. Add execution permissions to the **.appimage** file:

    1. Open a Linux terminal.

    1. Enter the following in the terminal to go to the **Downloads** folder:

        ```bash
        cd ~/Downloads/
        ```

    1. Make the AppImage executable:

        ```bash
        chmod +x Dev-Tools-Pack-Installer.AppImage
        ```

    1. Run the installer:

        ```bash
        ./Dev-Tools-Pack-Installer.AppImage
        ```

1. Add execution permissions to the **.appimage** file:

    1. Right click on the .appimage file and select **Properties**.
    1. Open the **Permissions** tab.
    1. Check the box next to **Allow executing file as a program**.
    1. Close **Properties** and open the **.appimage** file.

## Run the installer

1. On the **Install Dev Tools Pack Installer** page, click **View license** to view the license agreements of each software package included in the installer. If you accept the terms in the license agreements, check the box and click **Next**.

    :::image type="content" source="./media/dev-tools-installer/dev-tools-license-agreements.png" alt-text="License agreement screen in the installer.":::

1. Click on **Privacy Statement** to review the Microsoft Privacy Statement. If you agree to the privacy statement terms and would like to send diagnostic data to Microsoft, select **Yes** and click **Next**. Otherwise, select **No** and click **Next**.

    :::image type="content" source="./media/dev-tools-installer/dev-tools-privacy-statement.png" alt-text="Privacy statement agreement screen in the installer.":::

1. On the **Configure Components** page, select the optional tools you would like to install (the mandatory tools will install by default).

    1. If you are working with the Azure Percept Audio SoM, which is part of the Azure Percept DK, make sure to install the Intel OpenVino Toolkit and Miniconda3.

    1. Click **Install** to proceed with the installation.

    :::image type="content" source="./media/dev-tools-installer/dev-tools-configure-components.png" alt-text="Installer screen showing available software packages.":::

1. After successful installation of all selected components, the wizard proceeds to the **Completing the Setup Wizard** page. Click **Finish** to exit the installer.

    :::image type="content" source="./media/dev-tools-installer/dev-tools-finish.png" alt-text="Installer completion screen.":::

## Docker status check

If the installer notifies you to verify Docker Desktop is in a good running state, see the following steps:

### Windows

1. Expand system tray hidden icons.

    :::image type="content" source="./media/dev-tools-installer/system-tray.png" alt-text="System Tray.":::

1. Verify the Docker Desktop icon shows **Docker Desktop is Running**.

    :::image type="content" source="./media/dev-tools-installer/docker-status-running.png" alt-text="Docker Status.":::

1. If you do not see the above icon listed in the system tray, launch Docker Desktop from the start menu.

1. If Docker prompts you to reboot, it's fine to close the installer and relaunch after a reboot has completed and Docker is in a running state. Any successfully installed third-party applications should be detected and will not be automatically reinstalled.

## Next steps

Check out the [Azure Percept advanced development repository](https://github.com/microsoft/azure-percept-advanced-development) to get started with advanced development for Azure Percept DK.
