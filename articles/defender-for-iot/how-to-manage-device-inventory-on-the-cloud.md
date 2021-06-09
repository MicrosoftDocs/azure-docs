---
title: Manage the device inventory on the cloud
description: Learn how to manage your device inventory on the cloud.
ms.date: 06/09/2021
ms.topic: how-to
---

# Manage the device inventory on the cloud

The device inventory can be used to view a comprehensive perspective of all network information. The import export, and filtering tools can be used to manage this information. 

ADD SECTION ON USE CASES

INSERT SCREENSHOT

The following table describes the table columns in the device inventory.

| Parameter | Description |
|--|--|
| **Site** | The site that contains this device. |
| **IP Address** | The IP address of the device. |
| **Device Name** | The name of the device as the sensor discovered it, or as entered by the user. |
| **Last Activity** | The last activity that the device performed. |
| **Device Type**| The type of device, such as communication, and industrial. |
| **Device subtype**| The subtype of the device, such as speaker and smart tv.
| **Vendor** | The name of the device's vendor, as defined in the MAC address. |
| **Device model**| The devices' model number. |
| **MAC Address** | The MAC address of the device. |
| **VLAN** | The VLAN of the device. |
| **OS platform** | The OS of the device, if detected. |
| **Importance** | The level of importance the device is set to.|
| **Sensor** | The name of the sensor. ????? |
| **Zone** | The zone that contains this device. |
| **First seen** | The date and time the device was first seen. Presented in format MM/DD/YYYY HH:MM:SS AM/PM. |
| **Programming functionality** | ??????? |
| **Last update time** | The date and time the device was last updated. Presented in format MM/DD/YYYY HH:MM:SS AM/PM.|
| **Data source** | The source of the data, such as OtSensor, and Mde. |
| **Firmware vendor** | The vendor that supplied the firmware. |
| **Purdue level** | The level the device sits within the Purdue model. |
| **Device category** | The category of the device. |
| **OS architecture** | The architecture of the operating system. |
| **OS distribution** | The distribution of the operating system, such as Android, Linux, and Haiku.|
| **OS version** | The version of the operating system, such as Windows 10 and Ubuntu 20.04.1.|

**To view the device inventory**:

1. Open the [Azure portal](https://ms.portal.azure.com).

1. Navigate to **Defender for IoT** > **Device inventory**.

    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/device-inventory.png" alt-text="Select device inventory from the left side menu under Defender for IoT.":::

In the device inventory table you can add or remove columns. You can also change the column order by dragging and dropping a field.

**To customize the device inventory table**:

1. Select the :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/edit-columns-icon.png" border="false"::: icon.

1. In the Edit columns tab, select the drop down menu to change the value of a column.

    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/device-drop-down-menu.png" alt-text="Select the drop down menu to change the value of a given column.":::

1. Add a column by selecting the :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/add-column-icon.png" border="false"::: icon.

1. Reorder the columns by dragging a column parameter to a new location.

1. Delete a column by selecting the :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/trashcan-icon.png" border="false"::: icon.
    
    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/delete-a-column.png" alt-text="Select the trash can icon to delete a column.":::

1. Select **Save** to save any changes made.

If you want to reset the device inventory to the default settings, in the Edit columns tab, select the :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/reset-icon.png" border="false"::: icon.