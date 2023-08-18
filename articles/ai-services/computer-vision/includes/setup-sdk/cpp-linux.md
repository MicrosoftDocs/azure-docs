---
author: PatrickFarley
ms.service: cognitive-services
ms.topic: include
ms.date: 08/01/2023
ms.author: pafarley
---

Installing the Vision SDK package will require your device to support the APT/Debian package manager.

### Ubuntu 18.04, Ubuntu 20.04, Ubuntu 22.04, Debian 10 (Buster)

1. **By installing the Azure AI Vision SDK package you acknowledge the [Azure AI Vision SDK license agreement](https://aka.ms/azai/vision/license)**.

1. The debian package is hosted on a Microsoft feed. To install the package, you first need to add the Microsoft feed to your device's package manager. To do that, run the following commands:

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

1. Now install the Vision SDK Debian package required to build the sample:

    ```sh
    sudo apt update
    sudo apt install azure-ai-vision-dev-image-analysis
    ```

1. Notice that the above package _azure-ai-vision-dev-image-analysis_ depends on additional Vision SDK packages, which will be installed automatically. Run `apt list azure-ai-vision*` to see the list of installed Vision SDK packages:
   * _azure-ai-vision-dev-common_
   * _azure-ai-vision-dev-image-analysis_
   * _azure-ai-vision-runtime-common_
   * _azure-ai-vision-runtime-common-media_
   * _azure-ai-vision-runtime-image-analysis_

### Other Linux platforms

1. **By installing the Azure AI Vision SDK package you acknowledge the [Azure AI Vision SDK license agreement](https://aka.ms/azai/vision/license)**.

1. Directly download the following 5 packages to your device:
    ```sh
    wget https://packages.microsoft.com/repos/microsoft-ubuntu-bionic-prod/pool/main/a/azure-ai-vision-dev-common/azure-ai-vision-dev-common-0.13.0~beta.1-Linux.deb
    wget https://packages.microsoft.com/repos/microsoft-ubuntu-bionic-prod/pool/main/a/azure-ai-vision-dev-image-analysis/azure-ai-vision-dev-image-analysis-0.13.0~beta.1-Linux.deb
    wget https://packages.microsoft.com/repos/microsoft-ubuntu-bionic-prod/pool/main/a/azure-ai-vision-runtime-common/azure-ai-vision-runtime-common-0.13.0~beta.1-Linux.deb
    wget https://packages.microsoft.com/repos/microsoft-ubuntu-bionic-prod/pool/main/a/azure-ai-vision-runtime-common-media/azure-ai-vision-runtime-common-media-0.13.0~beta.1-Linux.deb
    wget https://packages.microsoft.com/repos/microsoft-ubuntu-bionic-prod/pool/main/a/azure-ai-vision-runtime-image-analysis/azure-ai-vision-runtime-image-analysis-0.13.0~beta.1-Linux.deb
    ```
1. Install the 5 packages:
    ```sh
    sudo apt update
    sudo apt install ./azure-ai-vision-dev-common-0.13.0~beta.1-Linux.deb ./azure-ai-vision-dev-image-analysis-0.13.0~beta.1-Linux.deb ./azure-ai-vision-runtime-common-0.13.0~beta.1-Linux.deb ./azure-ai-vision-runtime-common-media-0.13.0~beta.1-Linux.deb ./azure-ai-vision-runtime-image-analysis-0.13.0~beta.1-Linux.deb
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

## Compile the sample

* Download the content of this repository to your development PC. You can do that by either downloading and extracting this [ZIP file](https://github.com/Azure-Samples/azure-ai-vision-sdk/archive/master.zip), or cloning this repository using a Git client: `git clone https://github.com/Azure-Samples/azure-ai-vision-sdk.git`

* Navigate to the `linux` folder of this sample, where this `README.md` file is located

* Create a `build` folder under the `linux` folder, where the executable will be built, and navigate to that folder:

    ```sh
    mkdir build 
    cd build
    ```

* A Makefile is provided for direct compilation using the `make` command. Alternatively, a `CMakeLists.txt` is also provided if you prefer to compile the sample using the `cmake` command:

  * To compile using make, run
    * `make -f ../makefile`
  * To compile using CMake:
    * Install `cmake` (run `sudo apt install cmake`). 
    * Create a makefile by running: `cmake ..` 
    * Then compile by running: `make`

You should see the resulting executable `image-analysis-samples.exe` in the current folder.

## Get usage help

To get usage help run the executable with the `-h` or `--help` flag:

```sh
./image-analysis-samples.exe -h
```

You will see the following output:

```
 Azure AI Vision SDK - Image Analysis Samples

 To run the samples:

   image-analysis-samples.exe [--key|-k <your-key>] [--endpoint|-e <your-endpoint>]

 Where:
   <your-key> - A computer vision key you get from your Azure portal.
     It should be a 32-character HEX number.
   <your-endpoint> - A computer vision endpoint you get from your Azure portal.
     It should have the form: https://<your-computer-vision-resource-name>.cognitiveservices.azure.com

 As an alternative to specifying the above command line arguments, you can specify
 these environment variables: VISION_KEY and VISION_ENDPOINT

 To get this usage help, run:

   image-analysis-samples.exe --help|-h
```

## Run the sample

* Open a terminal windows where the executable `image-analysis-samples.exe` is located.

* Copy the image file `sample.jpg` to the current folder, such that it resides in the same folder as the executable `image-analysis-samples.exe`:
    ```
    cp ../../sample.jpg .
    ```
    
* Run the sample in one of two ways:
  * By specifying the vision key & endpoint as run-time arguments:
  ```
  ./image-analysis-samples.exe -k <your-key> -e <your-endpoint>
  ```
  * By first defining the appropriate environment variables, then running the executable without arguments:
  ```
  export VISION_KEY=<your-key>
  export VISION_ENDPOINT=<your-endpoint>

  ./image-analysis-samples.exe
  ```

* You should see a menu of samples to run. Enter the number corresponding to the sample you want to run, and press `Enter`. If this is your first time, start with sample 1, as it does analysis of all the visual features. The sample will run and display the results in the console window. The menu will be displayed again, so you can run another sample. Select `0` to exit the program.

## Troubleshooting

An error message will be displayed if the sample fails to run. Here are some common errors and how to fix them:

* `error while loading shared libraries: libAzure-AI-Vision-Extension-Image.so: cannot open shared object file: No such file or directory`
  * To fix this, run `export LD_LIBRARY_PATH=/usr/lib/azure-ai-vision/:$LD_LIBRARY_PATH` and re-run `./image-analysis-samples.exe`

* `Failed with error: HTTPAPI_OPEN_REQUEST_FAILED`.
  * Your endpoint may be incorrect. Make sure you correctly copied the endpoint from your Azure portal. It should be in the form `https://<your-computer-vision-resource-name>.cognitiveservices.azure.com`

* `Exception with an error code: 0x73 (AZAC_ERR_FAILED_TO_OPEN_INPUT_FILE_FOR_READING) `
  * The image file cannot be found. Make sure you copy the image file to the folder where the executable is located, and re-run.

* `InvalidRequest: The feature 'Caption' is not supported in this region`
  * Your endpoint is from an Azure region that does not support the `Caption` and `DenseCaptions` features. You can either change the endpoint to a supported region, or remove the `Caption` and `DenseCaptions` features from the list of features to analyze.

* `Unknown error in sending http request`
  * If you are running on Ubuntu 22.04 LTS, see comment above about the need to install **libssl1.1**.

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