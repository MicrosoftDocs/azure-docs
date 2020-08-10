---
author: v-demjoh
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 05/15/2020
ms.author: v-demjoh
---

## Prerequisites

The only prerequisite is an Azure Speech subscription. See the [guide](../get-started.md#new-resource) on creating a new subscription if you don't already have one.

## Download and install

#### [Windows Install](#tab/windowsinstall)

Follow these steps to install the Speech CLI on Windows:

1. Install either [.NET Framework 4.7](https://dotnet.microsoft.com/download/dotnet-framework/net471) or [.NET Core 3.0](https://dotnet.microsoft.com/download/dotnet-core/3.0)
2. Download the Speech CLI [zip archive](https://aka.ms/speech/spx-zips.zip), then extract it.
3. Go to the root directory `spx-zips` that you extracted from the download, and extract the subdirectory that you need (`spx-net471` for .NET Framework 4.7, or `spx-netcore-win-x64` for .NET Core 3.0 on an x64 CPU).

In the command prompt, change directory to this location, and then type `spx` to see help for the Speech CLI.

> [!NOTE]
> On Windows, the Speech CLI can only show fonts available to the command prompt on the local computer.
> [Windows Terminal](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701) supports all fonts produced interactively by the Speech CLI.
> If you output to a file, a text editor like Notepad or a web browser like Microsoft Edge can also show all fonts.

> [!NOTE]
> Powershell does not check the local directory when looking for a command. In Powershell, change directory to the location of `spx` and call the tool by entering `.\spx`.
> If you add this directory to your path, Powershell and the Windows command prompt will find `spx` from any directory without including the `.\` prefix.

#### [Linux Install](#tab/linuxinstall)

Follow these steps to install the Speech CLI on Linux on an x64 CPU:

1. Install [.NET Core 3.0](https://dotnet.microsoft.com/download/dotnet-core/3.0).
2. Download the Speech CLI [zip archive](https://aka.ms/speech/spx-zips.zip), then extract it.
3. Go to the root directory `spx-zips` that you extracted from the download, and extract `spx-netcore-30-linux-x64` to a new `~/spx` directory.
4. In a terminal, type these commands:
   1. `cd ~/spx`
   2. `sudo chmod +r+x spx`
   3. `PATH=~/spx:$PATH`

Type `spx` to see help for the Speech CLI.

***

## Create subscription config

To start using the Speech CLI, you first need to enter your Speech subscription key and region information. 
See the [region support](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#speech-sdk) page to find your region identifier. 
Once you have your subscription key and region identifier (ex. `eastus`, `westus`), run the following commands.

```shell
spx config @key --set YOUR-SUBSCRIPTION-KEY
spx config @region --set YOUR-REGION-ID
```

Your subscription authentication is now stored for future SPX requests. If you need to remove either of these stored values, run `spx config @region --clear` or `spx config @key --clear`.
