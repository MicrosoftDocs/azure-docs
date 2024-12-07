---  
title: 
description: 
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: how-to
ms.date: 12/05/2024

#customer intent: As a developer, I want to set up dev box with physical Android devices so that I can efficiently develop Android applications.

---
   
# Connect physical devices to a dev box
   
This article provides a step-by-step guide on how to set up and use dev box with physical devices. By following these instructions, you can ensure a smooth connection and configuration for your development environment.  

## Use dev box with physical Android devices to develop Android applications

**Prepare the machine you connect from:**
    1. Open Device Manager, in the run window, run *devmgmt.msc*.
    2. Check that your device shows like one of the following options:
        a. Device name: Universal Serial Bus / Pixel 6
        b. Android Device / Android Composite ADB Interface
    3. Uninstall non-standard devices and drivers and restart.
    4. Samsung devices will not connect if the ADB interface device exists on the machine you connect from. Uninstall the device. 

**After your Andriod device and driver are verified:**
    1. Open Local Group Policy Editor, run *gpedit.msc*.
    2. Navigate to **Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Connection Client\RemoteFX USB Redirection**.
    3. Enable **RDP redirection of other supported RemoteFX USB devices from this computer** for **Administrators and Users**.
    4. Apply the policy changes. From a cmd window `gpupdate /force`.
    5. Restart your computer.

**From your dev box**
    1. Open Local Group Policy Editor, run *gpedit.msc*.
    2. Open **Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Device and Resource Redirection**.
    3. Set **Do not allow supported Plug and Play device redirection**"** to **Disabled**.
    4. Navigate to **Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Connection Client\RemoteFX USB Device Direction**.
    5. Enable "Allow RDP redirection of other supported RemoteFX USB devices from this computer", set to "Administrators and Users"
    6. From a cmd window gpupdate /force
    7. Restart your computer.

If the Android device is still not accessible to adb:
    1. Open Device Manager, run *devmgmt.msc*.
    2. Ensure the Google USB driver is installed and the device appears as "Android Device \ Android Composite ADB Interface" (https://developer.android.com/studio/run/win-usb). If your device is from another manufacture, check [this link](https://developer.android.com/studio/run/oem-usb#InstallingDriver) for manufacture specific drivers. The goal is to make the ADB interface device show up in Device Manager. Please note the device name can vary slightly from manufacture to manufacture, such as "Samsung Android Phone \ Samsung Android ADB Interface" or "Android Device \ Android Composite ADB Interface".
    3. Restart your computer.
    (consider make the above change in your DevBox image)



## Set up virtual switches for nested VMs

Dev box supports nested virtualization. You can create VMs inside a dev box and connect them to the default virtual switch "Default Switch". If for whatever reason you want to create another virtual switch with internet access, please follow these steps to set up a NAT network with an internal virtual switch.

> [!CAUTION]
> Incorrect configuration of virtual switch will cause you to lose the connection to Dev Box immediately and this is NOT reversable. Please setup with extreme care.




## Stop automatic local drive redirection




## Connect USB devices to dev box





## Related content
