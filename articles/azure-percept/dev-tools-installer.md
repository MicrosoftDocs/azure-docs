---
title: Azure Percept Dev Tools Pack Installer overview 
description: Learn more about using the Dev Tools Pack Installer to accelerate advanced development with Azure Percept
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 02/18/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Dev Tools Pack Installer Overview

The Dev Tools Pack Installer is a one-stop solution that installs and configures all of the tools required to develop an Intelligent Edge solution. If you have already installed any of the software packages listed below, the Dev Tools Pack Installer will reinstall those packages so that your tools are consistent with the Installer software versions.

## Mandatory Tools Installed

* [Visual Studio Code](https://code.visualstudio.com/)
* [Python 3.6 or later](https://www.python.org/)
* [Docker 19.03](https://www.docker.com/)
* [PIP3](https://pip.pypa.io/en/stable/user_guide/)
* [TensorFlow 1.13](https://www.tensorflow.org/)
* [Azure Machine Learning SDK 1.1](/python/api/overview/azure/ml/)

## Optional Tools Available for Installation

* [Nvidia DeepStream SDK 5](https://developer.nvidia.com/deepstream-sdk) (Toolkit for developing solutions for Nvidia Accelerators)
* [Intel OpenVino Toolkit 2020.2](https://docs.openvinotoolkit.org/) (Toolkit for developing solutions for Intel Accelerators)
* [Lobe.ai](https://lobe.ai/)  
* [Streamlit](https://www.streamlit.io/)
* [Pytorch 1.4.0 (Windows) or 1.2.0 (Linux)](https://pytorch.org/)
* [Miniconda3](https://docs.conda.io/en/latest/miniconda.html)
* [Chainer 5.2](https://chainer.org/)
* [Caffe](https://caffe.berkeleyvision.org/)
* [CUDA Toolkit 10.0.130](https://developer.nvidia.com/cuda-toolkit)
* [Microsoft Cognitive Toolkit 2.5.1](https://www.microsoft.com/research/product/cognitive-toolkit/?lang=fr_ca)

## Known Issues

- Optional Caffe install may fail if Docker is not running properly on system. If you would like to install Caffe, make sure Docker is installed and running before attempting Caffe installation through the Dev Tools Pack Installer. 

- Optional CUDA install fails on incompatible systems. Before attempting to install the [CUDA Toolkit 10.0.130](https://developer.nvidia.com/cuda-toolkit) through the Dev Tools Pack Installer, verify your system compatibility.

## Minimum Requirements

* Docker minimum Requirements:

    * Windows:
        * https://docs.docker.com/docker-for-windows/install/#system-requirements

        - Windows 10 64-bit: Pro, Enterprise, or Education (Build 16299 or later).

             For Windows 10 Home, see Install Docker Desktop on Windows Home.
           - Hyper-V and Containers Windows features must be enabled.
           - The following hardware prerequisites are required to successfully run Client Hyper-V on Windows 10:

              - 64-bit processor with [Second Level Address Translation (SLAT)](https://en.wikipedia.org/wiki/Second_Level_Address_Translation)
              - 4-GB system RAM
              - BIOS-level hardware virtualization support must be enabled in the BIOS settings. For more information, see Virtualization.

        > [!NOTE]
        > Docker supports Docker Desktop on Windows based on Microsoft’s support lifecycle for Windows 10 operating system. For more information, see the [Windows lifecycle fact sheet](https://support.microsoft.com/help/13853/windows-lifecycle-fact-sheet).

    * Mac:
        * https://docs.docker.com/docker-for-mac/install/#system-requirements
       
        Your Mac must meet the following requirements to successfully install Docker Desktop:
         
         - **Mac hardware must be a 2010 or a newer model with an Intel processor**, with Intel’s hardware support for memory management unit (MMU) virtualization, including Extended Page Tables (EPT) and Unrestricted Mode. You can check to see if your machine has this support by running the following command in a terminal: ```sysctl kern.hv_support```

        If your Mac supports the Hypervisor framework, the command prints ```kern.hv_support: 1```.

         - **macOS must be version 10.14 or newer**. That is, Mojave, Catalina, or Big Sur. We recommend upgrading to the latest version of macOS.

        If you experience any issues after upgrading your macOS to version 10.15, you must install the latest version of Docker Desktop to be compatible with this version of macOS.

        - At least 4 GB of RAM.
        - VirtualBox prior to version 4.3.30 must not be installed as it is not compatible with Docker Desktop.

        > [!NOTE]
        > Docker supports Docker Desktop on the most recent versions of macOS. That is, the current release of macOS and the previous two releases. As new major versions of macOS are made generally available, Docker stops supporting the oldest version and supports the newest version of macOS (in addition to the previous two releases). Docker Desktop currently supports macOS Mojave, macOS Catalina, and macOS Big Sur.
        > 
        - The installer is not supported on Apple M1.

## Instructions

1. Download the Dev Tools Pack Installer for [Windows](https://go.microsoft.com/fwlink/?linkid=2132187), [Linux](https://go.microsoft.com/fwlink/?linkid=2132186), and [Mac](https://go.microsoft.com/fwlink/?linkid=2132296).

1. Depending on your Platform, there will be some differences in launching the installer.

    1. For Windows:
    
        1. Click on the **Dev-Tools-Pack-Installer** to open the installation wizard.
        
    1. For Mac:
    
        1. After downloading, move the Dev-Tools-Pack-Installer.app file to the Applications folder.
        
        1. Click on **Dev-Tools-Pack-Installer.app** to open the installation wizard.
        
        1. If you get an “unidentified developer” security dialog:
        
            1. Go to System Preferences -> Security & Privacy -> General and click the “Open Anyway” button next to “Dev-Tools-Pack-Installer.app”
        
            1. Click the Electron icon on the Dock again
        
            1. Click the “Open” button in the security dialog
    
    1. For Linux:
    
        1. When prompted by the browser click “Save” to complete the installer download
        
        1. Add execution permissions to the **.appimage** file method 1 (Commandline):
            
            1. Open the Linux Terminal
            
            1. Type the following in the Terminal to go to the Downloads folder
            
                1. cd ~/Downloads/
                
            1. Type the following in the Terminal to make the AppImage executable
            
                1. chmod +x **Dev-Tools-Pack-Installer.AppImage**
                
            1. Type the following in the Terminal to run the installer
            
                1. ./Dev-Tools-Pack-Installer.AppImage
        
        1. Add execution permissions to the **.appimage** file method 2 (UI):
        
            1. Right click on the .appimage file and select properties
            
            1. Open Permissions tab
            
            1. Check 'Allow executing file as a program' box
            
            1. Close properties and open the .appimage file

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

   1. Windows:
   
      1. Expand system tray hidden icons:
      
         1. Expand system tray hidden icons if hidden:

            :::image type="content" source="./media/dev-tools-installer/system-tray.png" alt-text="System Tray.":::
         
         1. Verify the Docker Desktop icon shows 'Docker Desktop is Running':

            :::image type="content" source="./media/dev-tools-installer/docker-status-running.png" alt-text="Docker Status.":::
         
         1. If you do not see the above icon listed in the system tray, launch Docker Desktop from the start menu.
         
         1. If Docker prompts you to reboot, it's fine to close the installer and relaunch after a reboot has completed and Docker is in a running state. Any successfully installed third-party applications should be detected and will not be automatically reinstalled.

## Next steps

Check out the [Azure Percept advanced development repository](https://github.com/microsoft/azure-percept-advanced-development) to get started with advanced development for Azure Percept DK.
