---
title: Use the Required URL Check tool for Azure Virtual Desktop
description: The Required URL Check tool enables you to check your session host virtual machines can access the required URLs to ensure Azure Virtual Desktop works as intended.
author: dknappettmsft
ms.topic: how-to
ms.date: 06/20/2023
ms.author: daknappe
---

# Required URL Check tool

In order to deploy and make Azure Virtual Desktop available to your users, you must allow specific URLs that your session host virtual machines (VMs) can access them anytime. You can find the list of URLs in [Required URL list](safe-url-list.md).

The Required URL Check tool will validate these URLs and show whether your session host VMs can access them. If not, then the tool will list the inaccessible URLs so you can unblock them and then retest, if needed.

> [!NOTE]
> - You can only use the Required URL Check tool for deployments in the Azure public cloud, it does not check access for sovereign clouds.
> - The Required URL Check tool can't verify URLs that wildcard entries are unblocked, only specific entries within those wildcards, so make sure the wildcard entries are unblocked first.

## Prerequisites

You need the following things to use the Required URL Check tool:

- A session host VM.

- Your session host VM must have .NET 4.6.2 framework installed.

- RDAgent version 1.0.2944.400 or higher on your session host VM. The Required URL Check tool (`WVDAgentUrlTool.exe`) is included in the same installation folder, for example `C:\Program Files\Microsoft RDInfra\RDAgent_1.0.2944.1200`.

- The `WVDAgentUrlTool.exe` file must be in the same folder as the `WVDAgentUrlTool.config` file.

## Use the Required URL Check tool

To use the Required URL Check tool:

1. Open a command prompt as an administrator on one of your session host VMs.

1. Run the following command to change the directory to the same folder as the current build agent (RDAgent_1.0.2944.1200 in this example):

    ```cmd
    cd "C:\Program Files\Microsoft RDInfra\RDAgent_1.0.2944.1200"
    ```

1. Run the following command to run the Required URL Check tool:

    ```cmd
    WVDAgentUrlTool.exe
    ```
 
1. Once you run the file, you'll see a list of accessible and inaccessible URLs.

    For example, the following screenshot shows a scenario where you'd need to unblock two required non-wildcard URLs:

    > [!div class="mx-imgBorder"]
    > ![Screenshot of non-accessible URLs output.](media/noaccess.png)
    
    Here's what the output should look like once you've unblocked all required non-wildcard URLs:

    > [!div class="mx-imgBorder"]
    > ![Screenshot of accessible URLs output.](media/access.png)

1. You can repeat these steps on your other session host VMs, particularly if they are in a different Azure region or use a different virtual network.

## Next steps

For more information about network connectivity, see [Understanding Azure Virtual Desktop network connectivity](network-connectivity.md)
