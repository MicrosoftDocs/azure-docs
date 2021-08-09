---
author: v-demjoh
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 04/28/2021
ms.author: v-demjoh
---

## Download and install

#### [Windows Install](#tab/windowsinstall)

Follow these steps to install the Speech CLI on Windows:

1. On Windows, you need the [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) for your platform. Installing this for the first time may require a restart.
1. Install [.NET Core 3.1 SDK](/dotnet/core/install/windows).
2. Install the Speech CLI using NuGet by entering this command:

   ```console
   dotnet tool install --global Microsoft.CognitiveServices.Speech.CLI
   ```
Type `spx` to see help for the Speech CLI.

> [!NOTE]
> As an alternative to NuGet, you can download and extract the Speech CLI for Windows as a [zip file](https://aka.ms/speech/spx-windows).

### Font limitations

On Windows, the Speech CLI can only show fonts available to the command prompt on the local computer.
[Windows Terminal](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701) supports all fonts produced interactively by the Speech CLI.

If you output to a file, a text editor like Notepad or a web browser like Microsoft Edge can also show all fonts.

#### [Linux Install](#tab/linuxinstall)

The following Linux distributions are supported for x64 architectures using the Speech CLI:

* CentOS 7/8
* Debian 9/10 
* Red Hat Enterprise Linux (RHEL) 7/8
* Ubuntu 16.04 (until September), Ubuntu 18.04/20.04

> [!NOTE]
> Additional architectures are supported by the Speech SDK (not the Speech CLI). For more information, see [About the Speech SDK](../speech-sdk.md).

Follow these steps to install the Speech CLI on Linux on an x64 CPU:

1. Install [.NET Core 3.1 SDK](/dotnet/core/install/linux).
2. Install the Speech CLI using NuGet by entering this command:

    `dotnet tool install --global Microsoft.CognitiveServices.Speech.CLI`

3. On RHEL/CentOS Linux, [Configure OpenSSL for Linux](../how-to-configure-openssl-linux.md).
4. On Ubunutu 20.04 Linux, [install GStreamer](../how-to-use-codec-compressed-audio-input-streams.md).

Type `spx` to see help for the Speech CLI.

> [!NOTE]
> As an alternative to NuGet, 
> you can download the Linux binaries as a [zip file](https://aka.ms/speech/spx-linux).
> Extract `spx-netcore-30-linux-x64.zip` to a new `~/spx` directory, type `sudo chmod +r+x spx` on the binary,
> and add the `~/spx` path to your PATH system variable.


#### [Docker Install (Windows, Linux, macOS)](#tab/dockerinstall)

> [!WARNING]
> You cannot use your computer's microphone when you run Speech CLI within a Docker container. However, you can read from and save audio files in your local mounted directory. 

Follow these steps to install the Speech CLI in a Docker container:

1. <a href="https://www.docker.com/get-started" target="_blank">Install Docker Desktop</a> for your platform if it isn't already installed.
2. In a new command prompt or terminal, type this command:
   ```console   
   docker pull msftspeech/spx
   ```
3. Type this command. You should see help information for Speech CLI:
   ```console 
   docker run -it --rm msftspeech/spx help
   ```

### Mount a directory in the container

The Speech CLI tool saves configuration settings as files, and loads these files when performing any command (except help commands).
When using Speech CLI within a Docker container, you must mount a local directory from the container, so the tool can store or find the configuration settings,
and also so the tool can read or write any files required by the command, such as audio files of speech.

On Windows, type this command to create a local directory Speech CLI can use from within the container:

`mkdir c:\spx-data`

Or on Linux or macOS, type this command in a terminal to create a directory and see its absolute path:

```bash
mkdir ~/spx-data
cd ~/spx-data
pwd
```

You will use the absolute path when you call Speech CLI.

### Run Speech CLI in the container

This documentation shows the Speech CLI `spx` command used in non-Docker installations.
When calling the `spx` command in a Docker container,
you must mount a directory in the container to your filesystem where the Speech CLI can store and find configuration values and read and write files.

On Windows, your commands will start like this:

```console
docker run -it -v c:\spx-data:/data --rm msftspeech/spx
```

On Linux or macOS, your commands will look like the sample below. Replace `ABSOLUTE_PATH` with the absolute path for your mounted directory. This path was returned by the `pwd` command in the previous section. 

If you run this command before setting your key and region, you will get an error telling you to set your key and region:
```console   
sudo docker run -it -v ABSOLUTE_PATH:/data --rm msftspeech/spx
```

To use the `spx` command installed in a container, always enter the full command shown above, followed by the parameters of your request.
For example, on Windows, this command sets your key:

```console
docker run -it -v c:\spx-data:/data --rm msftspeech/spx config @key --set SUBSCRIPTION-KEY
```

For more extended interaction with the command line tool, you can start a container with an interactive bash shell by adding an entrypoint parameter.
On Windows, enter this command to start a container that exposes an interactive command line interface where you can enter multiple `spx` commands:
```console
docker run -it --entrypoint=/bin/bash -v c:\spx-data:/data --rm msftspeech/spx
```

<!-- Need to troubleshoot issues with docker pull image

### Optional: Create a command line shortcut

If you're running the the Speech CLI from a Docker container on Linux or macOS you can create a shortcut. 

Follow these instructions to create a shortcut:
1. Open `.bash_profile` with your favorite text editor. For example:
   ```shell
   nano ~/.bash_profile
   ```
2. Next, add this function to your `.bash_profile`. Make sure you update this function with the correct path to your mounted directory:
   ```shell   
   spx(){
       sudo docker run -it -v ABSOLUTE_PATH:/data --rm msftspeech/spx
   }
   ```
3. Source your profile:
   ```shell
   source ~/.bash_profile
   ```
4. Now instead of running `sudo docker run -it -v ABSOLUTE_PATH:/data --rm msftspeech/spx`, you can just type `spx` followed by arguments. For example: 
   ```shell
   // Get some help
   spx help recognize

   // Recognize speech from an audio file 
   spx recognize --file /mounted/directory/file.wav
   ```

> [!WARNING]
> If you change the mounted directory that Docker is referencing, you need to update the function in `.bash_profile`.
--->
***

## Create subscription config

To start using the Speech CLI, you need to enter your Speech subscription key and region identifier. 
Get these credentials by following steps in [Try the Speech service for free](../overview.md#try-the-speech-service-for-free).
Once you have your subscription key and region identifier (ex. `eastus`, `westus`), run the following commands.

```console
spx config @key --set SUBSCRIPTION-KEY
spx config @region --set REGION
```

Your subscription authentication is now stored for future SPX requests. If you need to remove either of these stored values, run `spx config @region --clear` or `spx config @key --clear`.
