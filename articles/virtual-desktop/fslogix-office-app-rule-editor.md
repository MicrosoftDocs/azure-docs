---
title: Windows Virtual Desktop FSLogix Office app rule editor - Azure
description: How to use the app rule editor to change FSLogix and Office apps in Windows Virtual Desktop.
author: Heidilohr
ms.topic: conceptual
ms.date: 02/11/2021
ms.author: helohr
manager: lizross
---
# FSLogix and Office app rule editor

This article explains the flow need to take a virtual machine (VM) with Office installed. Offload the Office folder to a network location and use the VM as template for all other machines in the host pool.

![A picture containing drawing Description automatically generated](media/b9ee38825253fc0c08981cc23542e458.png)

## Requirements

This covers the prerequisites for the manual process. Later we can automate.

- a VM running Windows
- a copy of Office
- a copy of FSLogix installed on your deployment
- a network share to which all the VMs in the host pool have read-only access

## Install Office

1. RDP in the VM.

2. Install Office. Installation can be either manually or via an automated process. More information [here](https://docs.microsoft.com/en-us/azure/virtual-desktop/install-office-on-wvd-master-image).

![A close up of a device Description automatically generated](media/285978eaf61d22af88ab113f88d25438.png)

3. During the installation apply proper licensing.

>[!NOTE]
>Windows Virtual Desktop requires Share Computer Activation (SCA).*

4. Once installation is completed close office.

## Install FSLogix

1. Open a browser and navigate to <http://aka.ms/fslogix_download>**.** This will trigger download of the FSLogix agent.

2. Once the download is complete open the FSLogix zip file and from the x64\\Releases install:

FSLogixAppsSetup.exe

3. Check **I agree to the license and terms and conditions**

4. Select **Install**.

![A screenshot of a cell phone Description automatically generated](media/e1c54089089adcb5f52876ba6c6746ac.png)

FSLogixAppsRuleEditorSetup.exe

5. Check **I agree to the license and terms and conditions**

6. Select **Install**

![A screenshot of a cell phone Description automatically generated](media/142cfbf625d569a7c717e4272eed9c98.png)

## Prepare

Open **CMD** as administrator run to end Edge

for /f "tokens=1 delims=" %%\# in ('qprocess\^\|find /i /c /n "MicrosoftEdg"')
do (

>   set count=%%\# )

taskkill /F /IM MicrosoftEdge.exe /T

*Note: blank space spaces matter*

Run

sc queryex type=service state=all \| find /i "ClickToRunSvc"

If service is found use restart the VM before trying next steps.

Navigate to

c:\\Program Files\\FSLogix\\Apps

### Create target VHD 

>   frx moveto-vhd -filename \<path to network share\>\\office.vhdx -src
>   "C:\\Program Files\\Microsoft Office" -size-mbs 5000

>   *Note: the outcome of this operation is the creation of a VHD with the
>   content of the C:\\Program Files\\Microsoft Office.*

### Create rules file

Start the rule editor (C:\\Program Files\\FSLogix\\Apps\\RuleEditor.exe).

Create a new **Rule Set File** by clicking File \> New create and saving the rule set to local folder (e.g. C:\\Users\\ssa.GT090617\\Documents\\FSLogix Rule Sets)

![](media/55fbdbd900195c65942b3ac359aadd52.png)

Select **Blank Rule Set** and press **OK**.

Click the **+** button. This will open the **Add Rule** dialog

![A screenshot of a cell phone Description automatically generated](media/8f4af1a16b4ca06514968ee40bbdbda4.png)

![](media/5e82fad0c9ddd79b76e1cdaaebb6de37.png)

This will change the options in the **Add Rule** dialog.

From the drop down select **App Container (VHD) Rule**.

![](media/b16a8f7db974a70c4a0f109420cbf7c5.png)

For folder type **C:\\Program Files\\Microsoft Office**

For Disk file select **\<path\>\\office.vhd** from the **Create target VHD** section

Click **OK**.

![](media/998989f1bc4512d1b6786868e2cb93fe.png)

The .frx and .fxa are always saved in a working folder (e.g. **C:\\Users\\\<username\>\\Documents\\FSLogix Rule Sets**). Both files need to be moved to the Rules folder C:\\Program Files\\FSLogix\\Apps\\Rules become effective. This is by design.

>[!NOTE]
> There's currently a known issue in the public preview version of this feature that causes it to stop working after you reset your machine.