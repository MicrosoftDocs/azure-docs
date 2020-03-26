---
title: Install language packs on Windows 10 VMs in Windows Virtual Desktop - Azure
description: How to install language packs for Windows 10 Multi-session VMs in Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 03/26/2020
ms.author: helohr
manager: lizross
---
# Install language packs on Windows 10 Multi-session VMs

The following documentation highlights the general steps to prepare an image
that supports multiple language packs on Virtual Machines (VMs) running Windows
10 multi-session and how to change the display language as a standard user.

For more information on how to deploy a VM in Azure, please visit [this
documentation](https://docs.microsoft.com/azure/virtual-machines/windows/create-portal-availability-zone).

Language Pack Installation
--------------------------

-   Make sure you are signed in as an Administrator

-   Ensure you have installed all the latest Windows updates as well as latest
    Windows Store updates.

-   Then navigate to the Settings -\> Time & Language and click the Region tab
    on the left menu

-   Select your preferred country or region from the dropdown menu under Country
    or region.

    -   For the sake of this example, we are selecting France

![](media/a4420d1da60b751573e20da3d4306bbe.png)

-   Then click on the Language tab on the left menu. Click "Add a language" and
    choose the language that you would like installed from the list. Then click
    "Next"

-   When you are prompted with the Install language features window, be sure to
    check off the first option "Install language pack and set as my Windows
    display language". Then click "Install"

    -   Note: you may also add multiple languages by clicking "Add a language"
        and selecting a language from the list again. Repeat this process
        necessary

    -   Note: only one language can be set as your Windows display language at a
        time

    -   For this example, we will install the French and Dutch languages and set
        French as our display language

![](media/17f8f692abb8a97575243572065a890b.png)

![](media/1281d418798528ff7b5f1e5b5aaff7b0.png)

![](media/0377fd907747017608b4f822d5ed0e20.png)

-   After waiting several minutes for the installation of your language packs,
    you should see them in the list of languages underneath "Add a language"

![](media/e1e98f818b103a0961ab529b73558866.png)

![](media/7e4fc0fe551faf296a5ab9c45ccdab1d.png)

-   You may be prompted with a window requesting you to sign out of your
    session. When you sign back in, you will see the language change on your
    desktop

-   Once you sign back in, navigate to Control Panel -\> Clock and Region -\>
    Region

-   When the Region window is displayed, click on the Administration tab and
    click "Copy Settings"

-   Ensure that you check off both "Welcome screen and system accounts" and "New
    user accounts". Then click "OK"

-   You will be prompted with a window telling you to restart, so click "Restart
    now"

![](media/6c20941b9a73579a37a2fbbfbb730a73.png)

![](media/652a8ff39875e3aa1845c64259207572.png)

-   When you resume your session, navigate back to Control Panel -\> Clock and
    Region -\> Region as you did above

-   When presented with the Region window once again, select the Administration
    tab

-   This time, click "Change system locale..."

-   Select your preferred language from the dropdown under "Current system
    locale:" Then click "OK"

-   You will be prompted with a window telling you to restart, so click "Restart
    now"

![](media/9ed02275a56cbd8e8554c15a5395b5b7.png)

![](media/30b3c16c8d54cf5245bff6a8af5fdd55.png)

-   Log into your session once again

-   Ensure that you have completed all the Windows updates and that you have
    installed all the Windows Store updates

-   When checking for Windows Updates, you should see a screen displaying a
    green check mark indicating that Windows is up to date. If you don't, please
    install the updates, restart your machine if necessary, and launch your
    session before continuing to the next steps

![](media/f217a4b6c6ba5cbb851594906b2cbaa8.png)

Sysprep
-------

-   Now it is time to sysprep the machine. Search for PowerShell in the Start
    Menu. Right click on Windows PowerShell and select "Run as Administrator"

-   Your PowerShell window should be displayed.

-   Navigate to the appropriate directory by inputting cd
    \\Windows\\System32\\Sysprep into PowerShell

-   Then run the command .\\sysprep.exe to execute the sysprep

![](media/87f895d6b911a2c19edc25c91199b8af.png)

-   You will be prompted with the System Preparation Tool window

-   Be sure to check the box next to "Generalize" and select "Shut down" from
    the Shutdown Options dropdown

![](media/4bf550f4d5bbc27941454ead589dda56.png)

-   You may encounter a sysprep error such as the one below:

![](media/bb893522cc0d51833a2373949b6a3ff3.png)

-   To solve this error, open the File Explorer and navigate to Windows C: -\>
    Windows -\> System32 Sysprep -\> Panther and open the "setuperr" file

-   The error will indicate that the specific language package needs to be
    uninstalled. Copy the language package name to your clipboard

![](media/478e39c07755e30a7ad48a4371bf05ef.png)

![](media/7854af0c510c7a65557b76783a67e2b6.png)

-   Open a new PowerShell window and run the command "Remove-AppxPackage
    **InsertPackageNameHere"** to remove the language package

-   After it uninstalls, rerun the same command, as shown below, to ensure it
    has been removed.

    -   Note: you will know it has been removed successfully if you receive an
        error when trying to remove it a second time

![](media/2f7899399e83bc5e2b24be927cce67f5.png)

-   Now it's time to rerun the sysprep

-   Reopen a PowerShell and navigate to the appropriate directory by inputting
    cd \\Windows\\System32\\Sysprep

-   Then run the command .\\sysprep.exe to execute the sysprep

-   You will be prompted with the System Preparation Tool window again

-   Be sure to check the box next to "Generalize" and select "Shut down" from
    the Shutdown Options dropdown

![](media/4bf550f4d5bbc27941454ead589dda56.png)

-   **Success**! This time, you should be able to successfully execute a sysprep

-   Allow your system to process this for a few minutes. As the VM shuts down,
    your remote session will be disconnected

![](media/cd0af89f9fbcd7575f2e5ec19a6c17cc.png)

Capture the image
-----------------

-   Navigate to your Azure portal and select the Virtual Machine you have just
    run a sysprep on

-   Capture the image of this machine by clicking "Capture" on the horizontal
    menu

![](media/b5e8a8d3c761a1fbe57b9a2abe4279d1.png)

You will be taken to a panel that prompts you to create an image

-   Enter a name for your image and assign it to the resource group of your
    choosing

-   Then click "Create"

![](media/f7c76a0278da109f224bc8544029cd76.png)

-   Once you wait for it to be validated, you will see a message, like the
    snippet below, in your notification center, indicating that you have
    successfully created the image

![](media/5b81105c0987de8b3e727958cdc37b87.png)

-   Once you have reached this stage, you can now deploy a new VM in Azure with
    the image that you just created

-   Ensure that when you are completing the process to [deploy a VM in
    Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/create-portal-availability-zone),
    you select the image that was just created from this sysprep

Change a language as a standard user

Note: this example illustrates a non-admin user changing the language from
English to French

-   Assuming you are currently logged into your session as a non-admin user,
    navigate to the Language Settings panel by searching for "Language" in the
    Start Menu

-   Then choose the language you want to change the Windows display language to,
    from the dropdown

-   You should see a message informing you the language you chose "Will be
    display language after next sign in"

![](media/2432a1e23920fdc4c8d0bc12e33b0331.png)

![](media/97280a9b1be0a2a1a8b3300e13230c0e.png)

-   Once you log out and log into your session again, the welcome screen and
    your desktop should be presented in the language you chose

![](media/398538c33df81c8fdbdfa97eec20e889.jpg)

-   **Success**! You have changed the language as a non-admin
