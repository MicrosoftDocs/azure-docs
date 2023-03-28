---
title: Configure Windows Endpoint Monitoring for OT active monitoring - Microsoft Defender for IoT
description: This article describes how to configure Windows Endpoint Monitoring with active monitoring with Microsoft Defender for IoT.
ms.date: 06/02/2022
ms.topic: how-to
---

# Configure Windows Endpoint monitoring

This article describes how to configure Windows Endpoint Monitoring (WEM) to have Microsoft Defender for IoT selectively and actively probe Windows systems. 

WEM can provide more focused and accurate information about your Windows devices, such as service pack levels.

## Supported protocols

Currently the only protocol supported for Windows Endpoint Monitoring with Defender for IoT is WMI, Microsoft's standard scripting language for managing Windows systems.

## Prerequisites

Before performing the procedures in this article, you must have:

- An OT network sensor [installed](ot-deploy/install-software-ot-sensor.md), [activated, and configured](ot-deploy/activate-deploy-sensor.md).

- Access to your OT network sensor as an **Admin** user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

- Completed the prerequisites outlined in [Configure active monitoring for OT networks](configure-active-monitoring.md), and confirmed that active monitoring is right for your network.

- Before you can configure a WEM scan from your OT sensor console, you'll also need to configure a firewall rule, and WMI domain scanning on your Windows machine.

## Configure the required firewall rule

Configure a firewall rule that opens outgoing traffic from the sensor to the scanned subnet by using UDP port 135 and all TCP ports above 1024.

## Configure WMI domain scanning

Before you can configure a WEM scan from your sensor, you need to configure WMI domain scanning on the Windows machine you'll be scanning.

This procedure describes how to configure WMI scanning using a Group Policy Object (GPO), updating your firewall settings, defining permissions for your WMI namespace, and defining a local group.

### Prerequisites for WMI domain scanning

- Make sure that the Windows Management Instrumentation service (**winmgmt**) is in the automatic start mode.
- Create a user named **wmiuser**. Make sure this user is a member of the Domain users on your Windows machine.

### Configure a Group Policy Object (GPO)

1. On your Windows machine, [create a new GPO](/windows/security/threat-protection/windows-firewall/create-a-group-policy-object) named **WMIAccess**.

1. Right-click your new **WMIAccess** GPO and select **Edit**.

1. In the **Group Policy Management Editor** window, select **Computer Configuration > Windows Settings > Security Settings > Local Policies > Security Options**.

1. Navigate to and double-click the **DCOM: Machine Access Restrictions in Security Descriptor Definition Language (SDDL) syntax** policy to open the properties window to the **Template Security Policy Setting** tab.

    Use the following steps to configure access for this policy:

    1. Select **Edit Security** and then in the **Access Permission** dialog, select **Add**.

    1. In the **Enter the object names to select** box, enter **wmiuser**. Select **Check Names** to verify the setting, and then select **OK**.

        The **wmiuser (wmiuser@DOMAIN.local)** is now listed in the **Access Permission** dialog.

    1. In the **Access Permission** dialog:

        1. In the **Group or user names** list, select **wmiuser**.
        1. In the **Permissions for ANONYMOUS LOGON** box, select **Allow** for both **Local Access** and **Remote Access**.

        Select **OK** to close the **Access Permissions** dialog.

1. Back in the **Group Policy Management Editor** window, make sure that you have **Computer Configuration > Windows Settings > Security Settings > Local Policies > Security Options** selected.

1. Navigate to and double-click the **DCOM: Machine Launch Restrictions in Security Descriptor Definition Language (SDDL) syntax** policy to open the properties window to the **Template Security Policy Setting** tab.

    Use the following steps to configure access for this policy:

    1. Select **Edit Security** and then in the **Access Permission** dialog, select **Add**.

    1. In the **Enter the object names to select** box, enter **wmiuser**. Select **Check Names** to verify the setting, and then select **OK**.

        The **wmiuser (wmiuser@DOMAIN.local)** is now listed in the **Access Permission** dialog.

    1. In the **Access Permission** dialog:

        1. In the **Group or user names** list, select **wmiuser**.
        1. In the **Permissions for Administrators** box, select **Allow** for the **Local Launch**, **Remote Launch**, **Local Activation**, and **Remote Activation** options.

        Select **OK** to close the **Access Permissions** dialog.

### Configure your firewall

1. Navigate back to your **WMIAccess** GPO you'd created [earlier](#configure-a-group-policy-object-gpo), and select **Edit**.

1. In the **Group Policy Management Editor** dialog, go to **Computer Configuration > Windows Settings > Security Settings** and expand the **Windows Defender Firewall with Advanced Security** node.

1. Under **Windows Defender Firewall with Advanced Security**, right-click **Inbound Rules** and select **New Rule...**

1. In the **New Inbound Rule Wizard**, select **Predefined** and then select **Windows Management Instrumentation** from the drop-down menu.

1. Select **Next** to continue. In the **Predefined Rules** pane, make sure that all rules in the **Rules** box are selected.

1. Select **Next** to continue, and then select **Allow the connection** > **Finish**.

### Configure permissions for your WMI namespace

This procedure describes how to define permissions for your WMI namespace, and can't be completed with a regular GPO.

If you'll be using a non-admin account to run your WEM scans, this procedure is critical and must be performed exactly as instructed to allow sign-in attempts using WMI.

1. On your Windows machine, open a **Run** dialog and enter **wmimgmt.msc**.

1. In the **wmimgmt - [Console Root\WMI Control (Local)]** dialog, right-click **WMI Control (Local)** and select **Properties**.

1. In the **WMI Control (Local) Properties** dialog, select the **Security** tab > **Root** > **Security**.

1. In the **Security for ROOT\SECURITY** dialog, make sure that the **wmiuser** account is listed in the **Group or user names** box:

    1. Select **Add**, and in the **Enter the object names to select** box, enter **wmiuser**.
    1. Select **Check Names** > **OK**.

1. In the **Group or user names** box, select the **wmiuser** account. In the **Permissions for Authenticated Users** box, select **Allow** for the following permissions:

    - **Execute Methods**
    - **Enable Account**
    - **Remote Enable**
    - **Read Security**

1. In the **Security for ROOT\SECURITY** dialog, select **Advanced**. Then, in the **Advanced Security Settings for Root** dialog, select the **wmiuser** account > **Edit**.

1. In the **Permissions Entry for Root** dialog, from the **Apply To** drop-down menu, select **This namespace and all subnamespaces**.

    > [!NOTE]
    > You must apply permissions recursively to the entire tree.
    >

1. Select **OK** until all dialog boxes you'd opened in this procedure are closed.

### Add your wmiuser account to the local Performance Log Users group

1. Sign in to your Windows machine with a user you know is part of the **Performance Log Users** group.

1. Open a **Run** dialog and enter **compmgmt.msc**.

1. In the **Computer Management** dialog, select **Computer Management (Local) > System Tools > Local Users and Groups > Groups** and double-click **Performance Log Users**.

1. Select **Add** and then, in the **Enter the object names to select**, enter **wmiuser** to add the **wmiuser** to the group. Select **Check Names** and then **OK** until all dialog boxes you'd opened in this procedure are closed.


## Configure a WEM scan on your sensor console

**To configure a WEM scan**:

1. On your OT sensor console, select **System settings** > **Network monitoring** > **Active discovery** > **Windows Endpoint Monitoring (WMI)**.

1. In the **Edit scan ranges configuration** section, enter the ranges you want to scan and add the username and password required to access those resources.

    - We recommend entering values with domain or local administrator privileges for the best scanning results.
    - Select **Import ranges** to import a .csv file with a set of ranges you want to scan. Make sure your .csv file includes the following data: **FROM**, **TO**, **USER**, **PASSWORD**, **DISABLE**, where **DISABLE** is defined as **TRUE**/**FALSE**.
    - To get a .csv list of all ranges currently configured for WEM scans, select **Export ranges**.

1. In the **Scan will run** area, define whether you want to run the scan in intervals, every few hours, or by a specific time. If you select **By specific time**, an additional **Add scan time** option appears, which you can use to configure several scans running at specific times.

    While you can configure your WEM scan to run as often as you like, only one WEM scan can run at a time.

1. Select **Save** and then do one of the following:

    - To run your scan manually now, select **Apply changes** > **Manually scan**.

    - To let your scan run later as configured, select **Apply changes**, and then close the pane as needed.

**To view scan results:**

1. When your scan is finished, go back to the **System settings** > **Network monitoring** > **Active discovery** > **Windows Endpoint Monitoring (WMI)** page on your sensor console.

1. Select **View Scan Results**. A .csv file with the scan results is downloaded to your computer.

## Next steps

For more information, see:

- [View your device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [View your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md)
- [Configure active monitoring for OT networks](configure-active-monitoring.md)
- [Configure DNS servers for reverse lookup resolution for OT monitoring »](configure-reverse-dns-lookup.md)
- [Import device information to a sensor »](how-to-import-device-information.md)
