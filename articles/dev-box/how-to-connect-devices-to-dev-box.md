---  
title: How to connect devices to a dev box for development
description: This article provides step-by-step instructions on how to connect physical devices to a dev box for Android application development.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: how-to
ms.date: 12/05/2024

#customer intent: As a developer, I want to set up dev box with physical Android devices so that I can efficiently develop Android applications.

---

# Connect physical devices to a dev box

This article provides a step-by-step guide on how to set up and use dev box with physical devices to develop Android applications. By following these instructions, you can ensure a smooth connection and configuration for your development environment.

## Connect Android devices to a dev box

**Prepare the computer you connect from:**
1. To open Device Manager, from the search box on the taskbar, run `devmgmt.msc`.
1. Check that your device displays like one of the following options:
    - Device name: Universal Serial Bus / Pixel 6
    - Android Device / Android Composite Android Debug Bridge (ADB) Interface
1. Uninstall nonstandard devices and drivers and restart your computer.

> [!CAUTION]
> Samsung devices will not connect if the ADB interface device exists on the computer you connect from. Uninstall the device.

**After your Android device and driver are verified:**
1. To open Local Group Policy Editor, from a cmd window, run `gpedit.msc`.
1. Navigate to **Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Connection Client\RemoteFX USB Redirection**.
1. Enable **RDP redirection of other supported RemoteFX USB devices from this computer** for **Administrators and Users**.
1. To apply the policy changes, from a cmd window, run `gpupdate /force`.
1. Restart your computer.

**From your dev box:**
1. To open Local Group Policy Editor, from a cmd window, run `gpedit.msc`.
1. Open **Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Device and Resource Redirection**.
1. Set **Do not allow supported Plug and Play device redirection** to **Disabled**.
1. Navigate to **Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Connection Client\RemoteFX USB Device Direction**.
1. Enable **Allow RDP redirection of other supported RemoteFX USB devices from this computer** for **Administrators and Users**.
1. To apply the policy changes, from a cmd window, run `gpupdate /force`.
1. Restart your computer.

**If the Android device is not accessible to ADB:**
1. To open Device Manager, from the search box on the taskbar, run `devmgmt.msc`.
1. Ensure the Google USB driver is installed and the device appears as **Android Device \ Android Composite ADB Interface** (https://developer.android.com/studio/run/win-usb). 
    - Devices from other manufacturers might not display in Device manager. 
    - If your device is from another manufacturer, check [Install a USB driver](https://developer.android.com/studio/run/oem-usb#InstallingDriver) for manufacturer specific drivers. The goal is to make the ADB interface device show up in Device Manager. 
    - The device name can vary from manufacturer to manufacturer, such as "Samsung Android Phone \ Samsung Android ADB Interface" or "Android Device \ Android Composite ADB Interface".  
1. Restart your computer. 

## Set up virtual switches for nested VMs

Dev box supports nested virtualization. You can create virtual machines (VMs)  inside a dev box and connect them to the default virtual switch *Default Switch*"*. If you want to create another virtual switch with internet access, set up a NAT network with an internal virtual switch. Use an IP address range that suits your required configuration.

> [!WARNING]
> Incorrect configuration of virtual switch will cause you to lose the connection to dev box immediately and this is NOT reversable. Please setup with extreme care.

### Prerequisites
- On your dev box, install the Hyper-V and Virtual Machine Platform.

### Create virtual switch with NAT network 
    
1. Create internal virtual switch:
    ```powershell
    New-VMSwitch -SwitchName "VM-Internal" -SwitchType Internal
    ```

1. Create an IP address for the NAT gateway
    ```powershell
    New-NetIPAddress -IPAddress 192.168.100.1 -PrefixLength 24 -InterfaceIndex 34
    ```

    To find the *InterfaceIndex*, run `Get-NetAdapter`. Use the *ifIndex* of the adapter linked to the VM-Internal switch. If you choose a different IP range, ensure the IP address ends with “.1”.

1. Create the NAT network
    ```powershell
    New-NetNat -Name VM-Internal-Nat -InternalIPInterfaceAddressPrefix 192.168.100.0/24
    ```

### Configure guest VMs

1. Create guest VMs in your dev box, using the *VM-Internal* virtual switch. At this stage, the guest VM doesn't have internet access because it doesn't have an IP address.

1. Assign IP addresses to the guest VM. 

   1. On the guest VM, set the IP address to an available address in the range, like 192.168.100.10, 192.168.100.11, etc. 
   1. Use the subnet mask 255.255.255.0, default gateway 192.168.100.1, and your desired DNS (for example, 8.8.8.8 for internet or your dev box's DNS). 
   1. Open Network Connections, right-click the network adapter, select **Properties** > **Internet Protocol Version 4 (TCP/IPv4)**.

     :::image type="content" source="media/how-to-connect-devices-to-dev-box/tcpip-config.png" alt-text="Screenshot that shows the TCP/IP version 4 configuration dialog.":::

After setting the IP address, the setup is complete. Verify that you have:

- Internet access from the guest VM.
- Access between guest VMs.
- Access to guest VMs from the dev box.

## Prevent local drive redirection

By default, drives from your local client computer are available from within the dev box. This feature is called *drive-redirection*.

:::image type="content" source="media/how-to-connect-devices-to-dev-box/automatic-drive-redirection.png" alt-text="Screenshot that shows redirected drives on the dev box.":::

If you want to stop automatic local drive redirection, go to your dev box:

1. To open Local Group Policy Editor, from a cmd window, run `gpedit.msc`.
1. Navigate to **Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Device and Resource Redirection**.
1. Set **Do not allow drive redirection** to **Enabled**.

Subsequent RDP sessions no longer have the local drive mapped.

## Connect USB devices to dev box

Connect the USB device like a YubiKey to your local computer. Start remote desktop to your dev box.


1. To open Local Group Policy Editor, from a cmd window, run `gpedit.msc`.
1. Navigate to **Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Device and Resource Redirection**.
1. Set **Do not allow supported Plug and Play device redirection** to **Disabled**.
1. To apply the policy changes, from a cmd window, run `gpupdate /force`.
1. Restart your computer.

## Related content

- [Microsoft Dev Box: Frequently asked questions](dev-box-faq.yml)