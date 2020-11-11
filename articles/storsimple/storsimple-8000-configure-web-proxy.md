---
title: Set up web proxy for StorSimple 8000 series device | Microsoft Docs
description: Learn how to use Windows PowerShell for StorSimple to configure web proxy settings for your StorSimple device.
services: storsimple
documentationcenter: ''
author: alkohli
manager: 
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/19/2017
ms.author: alkohli

---
# Configure web proxy for your StorSimple device

## Overview

This tutorial describes how to use Windows PowerShell for StorSimple to configure and view web proxy settings for your StorSimple device. The web proxy settings are used by the StorSimple device when communicating with the cloud. A web proxy server is used to add another layer of security, filter content, cache to ease bandwidth requirements or even help with analytics.

The guidance in this tutorial applies only to StorSimple 8000 series physical devices. Web proxy configuration is not supported on the StorSimple Cloud Appliance (8010 and 8020).

Web proxy is an _optional_ configuration for your StorSimple device. You can configure web proxy only via Windows PowerShell for StorSimple. The configuration is a two-step process as follows:

1. You first configure web proxy settings through the setup wizard or Windows PowerShell for StorSimple cmdlets.
2. You then enable the configured web proxy settings via Windows PowerShell for StorSimple cmdlets.

After the web proxy configuration is complete, you can view the configured web proxy settings in both the Microsoft Azure StorSimple Device Manager service and the Windows PowerShell for StorSimple.

After reading this tutorial, you will be able to:

* Configure web proxy by using setup wizard and cmdlets.
* Enable web proxy by using cmdlets.
* View web proxy settings in the Azure portal.
* Troubleshoot errors during web proxy configuration.


## Configure web proxy via Windows PowerShell for StorSimple

You use either of the following to configure web proxy settings:

* Setup wizard to guide you through the configuration steps.
* Cmdlets in Windows PowerShell for StorSimple.

Each of these methods is discussed in the following sections.

## Configure web proxy via the setup wizard

Use the setup wizard to guide you through the steps for web proxy configuration. Perform the following steps to configure web proxy on your device.

#### To configure web proxy via the setup wizard

1. In the serial console menu, choose option 1, **Log in with full access** and provide the **device administrator password**. Type the following command to start a setup wizard session:
   
    `Invoke-HcsSetupWizard`
2. If this is the first time that you have used the setup wizard for device registration, you need to configure all the required network settings until you reach the web proxy configuration. If your device is already registered, accept all the configured network settings until you reach the web proxy configuration. In the setup wizard, when prompted to configure web proxy settings, type **Yes**.
3. For the **Web Proxy URL**, specify the IP address or the fully qualified domain name (FQDN) of your web proxy server and the TCP port number that you would like your device to use when communicating with the cloud. Use the following format:
   
    `http://<IP address or FQDN of the web proxy server>:<TCP port number>`
   
    By default, TCP port number 8080 is specified.
4. Choose the authentication type as **NTLM**, **Basic**, or **None**. Basic is the least secure authentication for the proxy server configuration. NT LAN Manager (NTLM) is a highly secure and complex authentication protocol that uses a three-way messaging system (sometimes four if additional integrity is required) to authenticate a user. The default authentication is NTLM. For more information, see [Basic](https://hc.apache.org/httpclient-3.x/authentication.html) and [NTLM authentication](https://hc.apache.org/httpclient-3.x/authentication.html). 
   
   > [!IMPORTANT]
   > **In the StorSimple Device Manager service, the device monitoring charts do not work when Basic or NTLM authentication is enabled in the proxy server configuration for the device. For the monitoring charts to work, you need to ensure that authentication is set to NONE.**
  
5. If you enabled the authentication, supply a **Web Proxy Username** and a **Web Proxy Password**. You also need to confirm the password.
   
    ![Configure Web Proxy On StorSimple Device1](./media/storsimple-configure-web-proxy/IC751830.png)

If you are registering your device for the first time, continue with the registration. If your device was already registered, the wizard exits. The configured settings are saved.

Web proxy is now enabled. You can skip the [Enable web proxy](#enable-web-proxy) step and go directly to [View web proxy settings in the Azure portal](#view-web-proxy-settings-in-the-azure-portal).

## Configure web proxy via Windows PowerShell for StorSimple cmdlets

An alternate way to configure web proxy settings is via the Windows PowerShell for StorSimple cmdlets. Perform the following steps to configure web proxy.

#### To configure web proxy via cmdlets
1. In the serial console menu, choose option 1, **Log in with full access**. When prompted, provide the **device administrator password**. The default password is `Password1`.
2. At the command prompt, type:
   
    `Set-HcsWebProxy -Authentication NTLM -ConnectionURI "<http://<IP address or FQDN of web proxy server>:<TCP port number>" -Username "<Username for web proxy server>"`
   
    Provide and confirm the password when prompted.
   
    ![Configure Web Proxy On StorSimple Device3](./media/storsimple-configure-web-proxy/IC751831.png)

The web proxy is now configured and needs to be enabled.

## Enable web proxy

Web proxy is disabled by default. After you configure the web proxy settings on your StorSimple device, use the Windows PowerShell for StorSimple to enable the web proxy settings.

> [!NOTE]
> **This step is not required if you used the setup wizard to configure web proxy. Web proxy is automatically enabled by default after a setup wizard session.**


Perform the following steps in Windows PowerShell for StorSimple to enable web proxy on your device:

#### To enable web proxy
1. In the serial console menu, choose option 1, **Log in with full access**. When prompted, provide the **device administrator password**. The default password is `Password1`.
2. At the command prompt, type:
   
    `Enable-HcsWebProxy`
   
    You have now enabled the web proxy configuration on your StorSimple device.
   
    ![Configure Web Proxy On StorSimple Device4](./media/storsimple-configure-web-proxy/IC751832.png)

## View web proxy settings in the Azure portal

The web proxy settings are configured through the Windows PowerShell interface and cannot be changed from within the portal. You can, however, view these configured settings in the portal. Perform the following steps to view web proxy.

#### To view web proxy settings
1. Navigate to **StorSimple Device Manager service > Devices**. Select and click a device and then go to **Device settings > Network**.

    ![Click Network](./media/storsimple-8000-configure-web-proxy/view-web-proxy-1.png)

2. In the **Network settings** blade, click the **Web proxy** tile.

    ![Click web proxy](./media/storsimple-8000-configure-web-proxy/view-web-proxy-2.png)

3. In the **Web proxy** blade, review the configured web proxy settings on your StorSimple device.
   
    ![View web proxy settings](./media/storsimple-8000-configure-web-proxy/view-web-proxy-3.png)


## Errors during web proxy configuration

If the web proxy settings are configured incorrectly, error messages are displayed to the user in Windows PowerShell for StorSimple. The following table explains some of these error messages, their probable causes, and recommended actions.

| Serial no. | HRESULT error Code | Possible root cause | Recommended action |
|:--- |:--- |:--- |:--- |
| 1. |0x80070001 |Command is run from the passive controller and it is not able to communicate with the active controller. |Run the command on the active controller. To run the command from the passive controller, you must fix the connectivity from passive to active controller. You must engage Microsoft Support if this connectivity is broken. |
| 2. |0x800710dd - The operation identifier is not valid |Proxy settings are not supported on StorSimple Cloud Appliance. |Proxy settings are not supported on StorSimple Cloud Appliance. These can only be configured on a StorSimple physical device. |
| 3. |0x80070057 - Invalid parameter |One of the parameters provided for the proxy settings is not valid. |The URI is not provided in correct format. Use the following format: `http://<IP address or FQDN of the web proxy server>:<TCP port number>` |
| 4. |0x800706ba - RPC server not available |The root cause is one of the following:</br></br>Cluster is not up. </br></br>Datapath service is not running.</br></br>The command is run from passive controller and it is not able to communicate with the active controller. |Engage Microsoft Support to ensure that the cluster is up and datapath service is running.</br></br>Run the command from the active controller. If you want to run the command from the passive controller, you must ensure that the passive controller can communicate with the active controller. You must engage Microsoft Support if this connectivity is broken. |
| 5. |0x800706be - RPC call failed |Cluster is down. |Engage Microsoft Support to ensure that the cluster is up. |
| 6. |0x8007138f - Cluster resource not found |Platform service cluster resource is not found. This can happen when the installation was not proper. |You may need to perform a factory reset on your device. You may need to create a platform resource. Contact Microsoft Support for next steps. |
| 7. |0x8007138c - Cluster resource not online |Platform or datapath cluster resources are not online. |Contact Microsoft Support to help ensure that the datapath and platform service resource are online. |

> [!NOTE]
> * The above list of error messages is not exhaustive.
> * Errors related to web proxy settings will not be displayed in the Azure portal in your StorSimple Device Manager service. If there is an issue with web proxy after the configuration is completed, the device status will change to **Offline** in the classic portal.|

## Next Steps
* If you experience any issues while deploying your device or configuring web proxy settings, refer to [Troubleshoot your StorSimple device deployment](storsimple-troubleshoot-deployment.md).
* To learn how to use the StorSimple Device Manager service, go to [Use the StorSimple Device Manager service to administer your StorSimple device](storsimple-8000-manager-service-administration.md).

