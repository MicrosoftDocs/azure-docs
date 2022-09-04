---
title: Migrate devices from Azure IoT Central to Azure IoT Hub | Microsoft Docs
description: Describes how to use the migration tool to migrate devices that currently connect to an Azure IoT Central application to an Azure IoT hub.
author: dominicbetts
ms.author: dobett
ms.date: 07/26/2022
ms.topic: how-to
ms.service: iot-central
---
# Migrate devices to Azure IoT Hub

If you decide to migrate from an IoT Central-based solution to an IoT Hub-based solution, you need to change the configuration of all the devices currently connected to your application. The **IoTC Migrator** tool automates this device migration process.

The migrator tool:

- Creates device registrations in your IoT hub for the devices that currently connect to your IoT Central application.
- Uses a command to send the *ID scope* of the Device Provisioning Service (DPS) instance associated with your IoT hub to your devices.

The tool requires your connected devices to implement a **DeviceMove** command that's defined in the device template in your IoT Central application. The command payload is the ID scope of the target DPS instance. When a device receives this command, it should:

- Stop sending telemetry and disconnect from the IoT Central application.
- Provision itself with DPS by using the new ID scope in the command payload.
- Use the provisioning result to connect to the destination IoT hub and start sending telemetry again.

## Prerequisites

You need the following prerequisites to complete the device migration steps:

- The source IoT Central application where your devices currently connect.
- The destination IoT hub where you want to move the devices to. This [IoT hub must be linked to a DPS instance](../../iot-dps/concepts-service.md#linked-iot-hubs).
- The devices that you want to migrate must implement the **DeviceMove** command. The command payload contains the *ID scope* of the destination DPS instance.
- [node.js and npm](https://nodejs.org/download/) installed on the local machine where you run the migrator tool.

## Setup

Complete the following setup tasks to prepare for the migration:

### Azure Active Directory application

The migrator tool requires an Azure Active Directory application registration to enable it to authenticate with your Azure subscription:

1. Navigate to [Azure portal > Azure Active Directory > App registrations](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps).

1. Select **New Registration**.

1. Enter a name such as "IoTC Migrator app".

1. Select **Accounts in this organizational directory only (iot-partners only - Single tenant)**.

1. Select **Single page application (SPA)**.

1. Enter `http://localhost:3000` as the redirect URI.

1. Select **Register**.

1. Make a note of the **Application (client) ID** and **Directory (tenant) ID** values. You use these values later to configure the migrator app:

    :::image type="content" source="media/howto-migrate-to-iot-hub/azure-active-directry-app.png" alt-text="Screenshot that shows the Azure Active Directory application in the Azure portal.":::

### Add the device keys to DPS

Add the shared access signature keys or X.509 certificates from your IoT Central application to your DPS allocation group.

If your devices use shared access signatures to authenticate to your IoT Central application:

- In your IoT Central application, navigate to **Permissions > Device connection groups**.
- Select the enrollment group your devices use.
- Make a note of the primary and secondary keys.
- In the Azure portal, navigate to your DPS instance.
- Select **Manage enrollments**.
- Create a new enrollment and set the attestation type to **Symmetric Key**, unselect **Auto-generate keys**, and then add the primary and secondary keys you made a note of.
- Select **Save**.

If your devices use X.509 certificates to authenticate to your IoT Central application:

- In the Azure portal, navigate to your DPS instance.
- Select **Certificates** and then select **Add**.
- Upload and verify the root or intermediate X.509 certificates you use in your IoT Central application.
- Select **Manage enrollments**.
- Create a new enrollment and set the attestation type to **Certificate**, then select the primary and secondary certificates you uploaded.
- Select **Save**.

### Download and configure the migrator tool

Download or clone a copy of the migrator tool to your local machine:

```cmd/bash
git clone https://github.com/Azure/iotc-migrator.git
```

Open the *config.ts* file in a text editor. Update the `AADClientID` and `AADDIrectoryID` with the values from the Azure Active Directory application registration you created previously. Update the `applicationHost` to match the URL of your IoT Central application. Then save the changes:

```typescript
{
    AADLoginServer: 'https://login.microsoftonline.com',
    AADClientID: '<your-AAD-Application-(client)-ID>',
    AADDirectoryID: '<your-AAD-Directory-(tenant)-ID>',
    AADRedirectURI: 'http://localhost:3000',
    applicationHost: '<your-iot-central-app>.azureiotcentral.com'
}
```

> [!TIP]
> Make sure the `AADRedirectURI` matches the redirect URI you used in your Azure Active Directory application registration.

In your command-line environment, navigate to the root of the `iotc-migrator` repository. Then run the following commands to install the required node.js packages and then run the tool:

```cmd/bash
npm install
npm start
```

After the migrator app starts, navigate to `http://localhost:3000` to view the tool.

## Migrate devices

Use the tool to migrate your devices in batches. Enter the migration details on the **New migration** page:

1. Enter a name for the migration.
1. Select a device group from your IoT Central application.
1. Select a device template that includes the **DeviceMove** command definition.
1. Select **Move to your own Azure IoT Hub**.
1. Select the DPS instance linked to your target IoT hub.
1. Select **Migrate**.

:::image type="content" source="media/howto-migrate-to-iot-hub/migrator-tool.png" alt-text="Screenshot of migration tool.":::

The tool now registers all the connected devices that matched the target device filter in the destination IoT hub. The tool then creates a job in your IoT Central application to call the **DeviceMove** method on all those devices. The command payload contains the ID scope of the destination DPS instance.

## Verify migration

The **Migration status** page in the tool shows you when the migration is complete:

:::image type="content" source="media/howto-migrate-to-iot-hub/migration-complete.png" alt-text="Screenshot showing completed migration status in tool.":::

Select a job on this page to view the [job status](howto-manage-devices-in-bulk.md#view-job-status) in your IoT Central application. Use this page to view the status of the individual devices in the job:

:::image type="content" source="media/howto-migrate-to-iot-hub/job-status.png" alt-text="Screenshot showing completed migration status for IoT Central job.":::

Devices that migrated successfully:

- Show as **Disconnected** on the devices page in your IoT Central application.
- Show as registered and provisioned in your IoT hub:

    :::image type="content" source="media/howto-migrate-to-iot-hub/destination-devices.png" alt-text="Screenshot of IoT Hub in the Azure portal that shows the provisioned devices.":::

- Are now sending telemetry to your IoT hub

    :::image type="content" source="media/howto-migrate-to-iot-hub/destination-metrics.png" alt-text="Screenshot of IoT Hub in the Azure portal that shows telemetry metrics for the migrated devices.":::

## Next steps

Now that know how to migrate devices from an IoT Central application to an IoT hub, a suggested next step is to learn how to [Monitor Azure IoT Hub](../../iot-hub/monitor-iot-hub.md).
