---
title: Azure CycleCloud Data Transfer Options | Microsoft Docs
description: Scheduled or recurring data transfers with Azure CycleCloud.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---
# Transfer Data with Azure CycleCloud

Azure CycleCloud supports both on-demand and scheduled data transfers between endpoints.
Both of these modes are managed via the **Transfer Manager** page, which is accessed
from the **Data** dropdown menu.

![Data Transfer menu option](~/images/data_transfer.png)

## On-Demand Transfers

To begin an on-demand transfer, select the appropriate endpoint on the left side of the page.
On the right, select a cloud provider endpoint. Use the file browsers for each endpoint to locate
the data to transfer and the desired destination. Click the right arrow
to upload to cloud storage, or the left arrow to download to your endpoint. Please note that
the transfer request is submitted for execution, to be run as soon as a worker is available
to perform the transfer. The number of workers can be configured by editing the **Queue** records
and changing the worker attribute to the desired number. The default setting is 1, which is
recommended for most purposes.

> [!NOTE]
> If the source is a directory, Data Manager will recursively transfer all files and subdirectories.

## Scheduled or Recurring Transfers

Scheduled transfers are done the same way as on-demand transfers, but use the clock arrows instead. This will
allow you to transfer files:

* Immediate: transfer right away
* Scheduled: transfer once, at a set time
* Recurring: transfer on a regular schedule

If you wish to encrypt your data, you can import or create a new encryption key in the **Advanced** section of the Scheduler.

Once your scheduled or recurring transfer has been created, click **Go** to schedule it. To view, edit, or delete your scheduled transfer(s), click the **Scheduled Transfers** tab at the bottom of the page.

## Monitor Transfer Details

When an immediate transfer is initiated or a scheduled or recurring transfer begins,
transfer details are displayed in the bottom pane of the Transfer Manager page.
You may need to click the refresh button for an accurate transfer progress reading.

![CycleCloud Data Transfer Pane](~/images/transfer_pane.png)

Double-clicking on a transfer displays further transfer details.

![CycleCloud Data Transfer Details](~/images/transfer_details_window.png)

Clicking on the Scheduled Transfers tab displays a queue of future transfers that have already been scheduled.

![CycleCloud Scheduled Data Transfer Pane](~/images/scheduled_transfer_pane.png)

Double-clicking a queued transfer displays further details about the scheduled transfer.

![CycleCloud Data Transfer Request Details](~/images/transfer_request_details.png)

## Transfer Listeners
Azure CycleCloud's Data Management tool supports writing plugins that are executed based on transfer events such as individual file transfer completion or failure or entire transfer completion or failure. Listener plugins must set the Implements attribute to be `DataTransferStateListener` and can subscribe to the states that they are interested in receiving events for. For example, if individual file upload events are of interest, the plugin must subscribe to the events from the "Transferring" state. Other attributes pertaining to the plugin can be set on the DataTransferStateListener attribute as a nested record. Currently supported attributes are:

| Attribute               | Description                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| States (Required)       | The list of states that the listener will listen to. These can be Transferring, Completed, or Failed.              |
| FunctionName (Optional) | The name of the plugin function to invoke upon receiving the listener event. It defaults to `handleTransferEvent`. |

The plugin function is provided with a record containing the details of the transfer event, such as FileName transferred, number of bytes transferred, number of files transferred, etc:

``` plugin
Implements = DataTransferStateListener
DataTransferStateListener := [States={"Transferring","Completed"}; FunctionName="handleTransferEvent"]
```

An example plugin that implements the handleTransferEvent method:

``` plugin
from application import logger

def handleTransferEvent(record):
  logger.info("Triggerring transfer event handler for %s" % record.getAsString("FileName"))
```

An example of the record that is sent to plugin method as an argument:

``` plugin
[ Bytes=1024.0; FileCount=1.0; FileName="dir1/file1001.txt"; State="Transferring" ]
```

## Advanced Settings

In order to tune Azure CycleCloud transfers, a number of settings can be adjusted. Open the settings page from the user drop-down menu on the top right of the screen.

![CycleCloud Data Transfer Settings menu](~/images/settings_dropdown.png)

On the settings page, double clicking on an entry will display the Configuration screen:

![CycleCloud Data Transfer Settings Configuration Screen](~/images/dataman_settings.png)

**Transfer Threads**
This setting modifies the number of threads used to transfer data. Recommended value of this setting depends on your network bandwidth and the number of CPU cores available on the DataMan host. To prevent http connection errors during uploads, we recommend that this value not be set greater than 32. Default: 16.

**Transfer Part Size**
This is the size of a single chunk of a multi-part transfer. Default: 16,777,216.

**Proxy Server Configuration**
To enable using a proxy server for network operations, check the Use Proxy checkbox and put the details of the proxy server in the following fields. Default: Unchecked.
