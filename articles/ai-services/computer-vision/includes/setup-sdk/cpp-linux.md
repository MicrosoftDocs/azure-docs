---
author: PatrickFarley
ms.service: azure-ai-vision
ms.topic: include
ms.date: 08/01/2023
ms.author: pafarley
---

Installing the Image Analysis SDK package requires your device to support the APT/Debian package manager.

### Ubuntu 18.04, Ubuntu 20.04, Ubuntu 22.04, Debian 10 (Buster)

1. The Debian package is hosted on a Microsoft feed. To install the package, you first need to add the Microsoft feed to your device's package manager. To do that, run the following commands:

   * For Ubuntu 18.04 (Bionic Beaver)
   ```sh
   sudo apt install wget dpkg
   wget "https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb"
   sudo dpkg -i packages-microsoft-prod.deb 
   ```

   * For Ubuntu 20.04 (Focal Fossa)
   ```sh
   sudo apt install wget dpkg
   wget "https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb"
   sudo dpkg -i packages-microsoft-prod.deb 
   ```

   * For Ubuntu 22.04 (Jammy Jellyfish)
   ```sh
   sudo apt install wget dpkg
   wget "https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb"
   sudo dpkg -i packages-microsoft-prod.deb 
   ```

   * For Debian 10 (Buster)
   ```sh
   sudo apt install wget dpkg
   wget "https://packages.microsoft.com/config/debian/10/packages-microsoft-prod.deb"
   sudo dpkg -i packages-microsoft-prod.deb 
   ```

1. Now install the Image Analysis SDK Debian package required to build the sample:

    ```sh
    sudo apt update
    sudo apt install azure-ai-vision-dev-image-analysis
    ```

1. Notice that the above package _azure-ai-vision-dev-image-analysis_ depends on other Image Analysis SDK packages, which will be installed automatically. Run `apt list azure-ai-vision*` to see the list of installed Vision SDK packages:
   * _azure-ai-vision-dev-common_
   * _azure-ai-vision-dev-image-analysis_
   * _azure-ai-vision-runtime-common_
   * _azure-ai-vision-runtime-image-analysis_

### Other Linux platforms

1. Directly download the following five packages to your device:
    ```sh
    wget https://packages.microsoft.com/repos/microsoft-ubuntu-bionic-prod/pool/main/a/azure-ai-vision-dev-common/azure-ai-vision-dev-common-0.13.0~beta.1-Linux.deb
    wget https://packages.microsoft.com/repos/microsoft-ubuntu-bionic-prod/pool/main/a/azure-ai-vision-dev-image-analysis/azure-ai-vision-dev-image-analysis-0.13.0~beta.1-Linux.deb
    wget https://packages.microsoft.com/repos/microsoft-ubuntu-bionic-prod/pool/main/a/azure-ai-vision-runtime-common/azure-ai-vision-runtime-common-0.13.0~beta.1-Linux.deb
    wget https://packages.microsoft.com/repos/microsoft-ubuntu-bionic-prod/pool/main/a/azure-ai-vision-runtime-image-analysis/azure-ai-vision-runtime-image-analysis-0.13.0~beta.1-Linux.deb
    ```
1. Install the five packages:
    ```sh
    sudo apt update
    sudo apt install ./azure-ai-vision-dev-common-0.13.0~beta.1-Linux.deb ./azure-ai-vision-dev-image-analysis-0.13.0~beta.1-Linux.deb ./azure-ai-vision-runtime-common-0.13.0~beta.1-Linux.deb ./azure-ai-vision-runtime-image-analysis-0.13.0~beta.1-Linux.deb
    ```

### Verify installation

Verify installation succeeded by listing these folders:

   ```
   ls -la /usr/lib/azure-ai-vision
   ls -la /usr/include/azure-ai-vision
   ls -la /usr/share/doc/azure-ai-vision-*
   ```

You should see shared object files named `libAzure-AI-Vision-*.so` and a few others in the first folder.

You should see header files named `vsion_api_cxx_*.hpp` and others in the second folder.

You should see package documents in the /usr/share/doc/azure-ai-vision-* folders (LICENSE.md, REDIST.txt, ThirdPartyNotices.txt).

## Cleanup

The Vision SDK Debian packages can be removed by running this single command:

```
 sudo apt-get purge azure-ai-vision-*
```

## Required libraries for run-time distribution

The folder `/usr/lib/azure-ai-vision` contains several shared object libraries (`.so` files), needed to support different sets of Vision SDK APIs. For Image Analysis, only the following subset is needed when you distribute a run-time package of your application:

```
libAzure-AI-Vision-Native.so
libAzure-AI-Vision-Extension-Image.so
```