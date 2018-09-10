---
title: Troubleshoot Azure Stack validation as a service | Microsoft Docs
description: Troubleshoot validation as a service for Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/24/2018
ms.author: mabrigg
ms.reviewer: johnhas

---

# Troubleshoot validation as a service

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

The following are common problems unrelated to software releases and their solutions.

## The portal shows local agent in debug mode

This is likely because the agent is unable to send heartbeats to the service because of an unstable network connection. A heartbeat is sent every five minutes. If the service does not receive a heartbeat for 15 minutes, then the service considers the agent inactive and tests will no longer be scheduled on it. Check the error message in the *Agenthost.log* file located in the directory where the agent was started.

> [!Note] 
> Any tests already running on the agent will continue to run, but if the heartbeat is not restored before the test ends, then the agent will fail to update the test status or upload logs. The test will always show up as **running** and will need to be canceled.

## Agent process on machine was shut down while executing test. What to expect?

If the agent process is shut down ungracefully for example, machine restarted, process killed (CTRL+C on the agent window is considered graceful shutdown) then the test that was running on it will continue to show as **running**. If the agent is restarted, then the agent will update the status of the test to **canceled**. If the agent is not restarted, then the test appears as **running** and you must manually cancel the test

> [!Note] 
> Tests within a workflow are scheduled to run sequentially. **Pending** tests will not get executed until tests in the **running** state in the same workflow complete.

## Handle slow network connectivity

You can download the PIR image to a share in your local datacenter. And then you can verify the image.

<!-- This is from the appendix to the Deploy local agent topic. -->

### Download PIR image to local share in case of slow network traffic

1. Download AzCopy from: [vaasexternaldependencies(AzCopy)](https://vaasexternaldependencies.blob.core.windows.net/prereqcomponents/AzCopy.zip)

2. Extract AzCopy.zip and change to the directory containing AzCopy.exe

3. Open Windows PowerShell from an elevated prompt. Run the following commands:

```PowerShell  
    .\azcopy.exe /Source:'https://azurestacktemplate.blob.core.windows.net/azurestacktemplate-public-container' /Dest:'<LocalFileShare>' /Pattern:'Server2016DatacenterFullBYOL.vhd' /NC:12 /V:azcopylog.log /Y
    .\azcopy.exe /Source:'https://azurestacktemplate.blob.core.windows.net/azurestacktemplate-public-container' /Dest:'<LocalFileShare>' /Pattern:'Server2016DatacenterCoreBYOL.vhd' /NC:12 /V:azcopylog.log /Y
    .\azcopy.exe /Source:'https://azurestacktemplate.blob.core.windows.net/azurestacktemplate-public-container' /Dest:'<LocalFileShare>' /Pattern:'WindowsServer2012R2DatacenterBYOL.vhd' /NC:12 /V:azcopylog.log /Y
    .\azcopy.exe /Source:'https://azurestacktemplate.blob.core.windows.net/azurestacktemplate-public-container' /Dest:'<LocalFileShare>' /Pattern:'Ubuntu1404LTS.vhd' /NC:12 /V:azcopylog.log /Y
    .\azcopy.exe /Source:'https://azurestacktemplate.blob.core.windows.net/azurestacktemplate-public-container' /Dest:'<LocalFileShare>' /Pattern:'Ubuntu1604-20170619.1.vhd' /NC:12 /V:azcopylog.log /Y
```

> [!Note]  
> LocalFileShare is the share path or local path.

### Verifying PIR Image file hash value

You can use **Get-HashFile** cmdlet to get the hash value for the downloaded public image repository image files to check the integrity of the images.

| File Name | SHA256 |
|---------------------------------------|------------------------------------------------------------------|
| Server2016DatacenterFullBYOL.vhd | 6ED58DCA666D530811A1EA563BA509BF9C29182B902D18FCA03C7E0868F733E9 |
| WindowsServer2012R2DatacenterBYOL.vhd | 9792CBF742870B1730B9B16EA814C683A8415EFD7601DDB6D5A76D0964767028 |
| Server2016DatacenterCoreBYOL.vhd | 5E80E1A6721A48A10655E6154C1B90E320DF5558487D6A0D7BFC7DCD32C4D9A5 |
| Ubuntu1404LTS.vhd | B24CDD12352AAEBC612A4558AB9E80F031A2190E46DCB459AF736072742E20E0 |
| Ubuntu1604-20170619.1.vhd | C481B88B60A01CBD5119A3F56632A2203EE5795678D3F3B9B764FFCA885E26CB |

## Next steps

- To learn more about [Azure Stack validation as a service](https://docs.microsoft.com/azure/azure-stack/partner).
