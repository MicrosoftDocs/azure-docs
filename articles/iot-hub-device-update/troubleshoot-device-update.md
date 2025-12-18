---
title: Troubleshoot common Device Update for Azure IoT Hub issues | Microsoft Docs
description: This document provides a list of tips and tricks to help remedy many possible issues you may be having with Device Update for IoT Hub.
author: cwatson-cat
ms.author: cwatson
ms.date: 9/13/2022
ms.topic: troubleshooting
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Device Update for IoT Hub Troubleshooting Guide

This document lists some common questions and issues reported by Device Update users. If you encounter an issue that does not appear in this troubleshooting guide, refer to the [Contacting Microsoft Support](#contact) section to document your situation.

## <a name="import"></a>Importing updates

### Q: I imported an update successfully, but it's not showing as available for me to deploy to devices that it should be compatible with

Double-check that your import manifest .json file doesn’t have any accidental errors, especially in the [Compatibility object](/azure/iot-hub-device-update/import-schema) values. The compatibility properties in the import manifest must match exactly with the properties reported by your devices, which ensures that the right updates are always only sent to the right devices. For example, there could be a typographical error in the import manifest that causes a compatibility property to have a missing, transposed or extra character compared to what a device reports. If so, the Device Update for IoT Hub service can't match the update to that device. If you already imported an update, you can quickly check for issues with compatibility properties by clicking the "Details" link for that update and then clicking “Additional details” in the right-hand flyout menu. From there, you can view the import manifest JSON content for that update and identify any potential errors.

### Q: I'm having trouble connecting my Device Update instance to my IoT Hub instance

Ensure your IoT Hub message routes are configured correctly, as per the [Device Update resources](./device-update-resources.md) documentation.

### Q: I'm encountering a role-related error (error message in Azure portal or a 403 API error)

You may not have access permissions configured correctly. Ensure access permissions are configured correctly as per the [Device Update access control](./device-update-control-access.md) documentation.

### Q: I'm encountering a 500-type error when importing content to the Device Update service

An error code in the 500 range may indicate an issue with the Device Update service. Wait 5 minutes, then try again. If the same error persists, follow the instructions in the [Contacting Microsoft Support](#contact) section to file a support request with Microsoft.

### Q: I want to keep the same compatibility properties (target my update to the same device type), but change the Provider or Name in the import manifest. But I get an error "Failed: error importing update due to exceeded limit" when I do so

The same exact set of compatibility properties cannot be used with more than one Update Provider and Name combination. This policy allows the Device Update service to determine with certainty which updates should be available to deploy to a given device. If you need to update multiple components or partitions on a single device, the [proxy updates](./device-update-proxy-updates.md) feature provides that capability.

### Q: I'm encountering an error message when importing content and would like to understand more about it

Refer to the [Device Update Error Codes](./device-update-error-codes.md#device-update-content-service) documentation for more detailed information on import-related error messages.

## <a name="device-failure"></a>Device failures

### Q: How can I ensure my device is connected to Device Update for IoT Hub?

You can verify that your device is connected to Device Update by checking if it shows up under the "Ungrouped" devices section in the compliance view of Azure portal.

### Q: One or more of my devices is failing to update

There are many possible root causes for a device update failure. Validate that the device is: 1) connected to your IoT Hub instance, 2) connected to your Device Update instance, and 3) the Delivery Optimization (DO) service is running. If all three are true for your device, follow the instructions in the [Contacting Microsoft Support](#contact) section to file a support request with Microsoft.

### Q: My Device Update agent is failing to start up

One of the most common reasons for a failure in Device Update agent start-up is a malformed configuration file (du-config.json). Refer to the [configuration file documentation](./device-update-configuration-file.md) and ensure your agent is configured correctly. All values in the configuration file must use double-quotes.

## <a name="deploy"></a> Deploying an update

### Q: I deployed an update to my device, but the compliance status says it isn't on the latest update. What should I do?

The device compliance status can take up to 5 minutes to refresh.

### Q: My device's deployment status shows incompatible, what should I do?

The manufacturer and model properties of a targeted device might have changed after connecting the device to IoT Hub, causing the device to now be considered incompatible with the update content of the current deployment.

Check the [ADU Core Interface](./device-update-plug-and-play.md) to see what manufacturer and model your device is reporting to the Device Update service. Make sure it matches the manufacturer and model you specified in the [import manifest](./import-concepts.md) of the update content that you're deploying. You can change these properties for a given device using the [Device Update configuration file](./device-update-configuration-file.md).

### Q: I see my deployment is in "Active" stage but none of my devices are "In progress" with the update. What should I do?

Ensure that your deployment start date is not set in the future. When you create a new deployment, the deployment start date is defaulted to the next day as a safeguard unless you explicitly change it. You can either wait for the deployment start date to arrive, or cancel the ongoing deployment and create a new deployment with the desired start date.

### Q: I'm trying to group my devices, but I don't see the tag in the drop-down when creating a group

Ensure that the message routes in your IoT Hub are correctly configured as per the [Device Update resources](./device-update-resources.md) documentation. You will have to tag your device again after configuring the route.

Another root cause could be that you applied the tag before connecting your device to Device Update for IoT Hub. Ensure that your device is already connected to Device Update. You can verify that your device is connected to Device Update for IoT Hub by checking if it shows up under “Ungrouped” devices in the compliance view. Temporarily add a tag of a different value, and then add your intended tag again once the device is connected.

If you are using Device Provisioning Service (DPS), then ensure that you tag your devices after they are provisioned and not during the Device creation process. If you already tagged your device during the Device creation step, then you will have to temporarily tag your device with a different value after it is provisioned, and then add your intended tag again.

### Q: My deployment completed successfully, but some devices failed to update

This condition can be caused by a client-side error on the failed devices. See the Device Failures section of this troubleshooting guide.

### Q: I encountered an error in the UX when trying to initiate a deployment

This condition can be caused by a service/UX bug, or by an API permissions issue. Follow the instructions in the [Contacting Microsoft Support](#contact) section to file a support request with Microsoft.

### Q: I started a deployment but it isn’t reaching an end state

This condition can be caused by a service performance issue, a service bug, or a client bug. Retry your deployment after 10 minutes. If you encounter the same issue, please pull your device logs and refer to the Device Failures section of this troubleshooting guide. If the same issue persists, follow the instructions in the [Contacting Microsoft Support](#contact) section to file a support request with Microsoft.

### Q: I migrated from a device-level agent to adding the agent as a Module identity on the device. Now my update shows as 'in-progress' even though it's applied to the device

This condition can happen if an older agent that was communicating over the Device Twin was not removed. When you provision the Device Update agent as a Module (see [how to](device-update-agent-provisioning.md)), all communications between the device and the Device Update service happen over the Module Twin. Remember to tag the Module Twin of the device when creating [groups](device-update-groups.md) and all [communications](device-update-plug-and-play.md) must happen over the module twin.

## <a name="download"></a> Downloading updates onto devices

### Q: How do I resume a download when a device reconnects after a period of disconnection?

The download will self-resume when connectivity is restored within a 24-hour period. After 24 hours, the user will need to reinitiate the download.

## <a name="mcc"></a> Using Microsoft Connected Cache (MCC)

### Q: I am encountering an issue when attempting to deploy the MCC module on my IoT Edge device

Refer to the [IoT Edge documentation](../iot-edge/index.yml) for deploying Edge modules to IoT Edge devices. You can check if the MCC module is running successfully on your IoT Edge device by navigating to http://localhost:5100/Summary.

### Q: One of my IoT devices is attempting to download an update through MCC, but is failing

There are several issues that could be causing an IoT device to fail in connecting to MCC. In order to diagnose the issue, collect the DO client and Nginx logs from the failing device (see the [Contacting Microsoft Support](#contact) section for instructions on gathering client logs).

Your device may be failing to pull content from the Internet to pass to its MCC module because the URL it’s using isn’t allowed. Confirm this by checking your IoT Edge environment variables in the Azure portal.

## <a name="instance"></a> Troubleshooting a missing instance in the Azure portal

### Q: I don’t see an instance of Device Update for IoT Hub when I select the "gear" icon

There are a few possible causes for this issue. See below for troubleshooting steps.

A Device Update instance needs to be associated with an Azure IoT hub in the same resource group and subscription. If you move either your Device Update instance or your hub to a different resource group or subscription, you may not see your instance in the Azure portal. If so, do one of the following steps in order to continue using Device Update for IoT Hub:

- Return the moved items to their original configuration.

- If you only moved your IoT hub from one resource group to another, modify your Device Update instance with the IoT hub’s new resourceId.
- If you moved items from one subscription to another, make sure the Device Update account and IoT hub are in the same subscription, and then modify your Device Update instance with the IoT hub’s new resourceId.

At least Read-level permissions are needed for both your IoT hub and your Device Update for IoT Hub account in order to access Device Update functionality via the IoT hub experience in the Azure portal.

- To manage permissions for your IoT Hub:
  - Select your hub from the Azure portal
  - Select “Access control (IAM) from the left-hand navigation bar.
  - Select “Add role assignment”.
  - Select a role with at least Read access and select Next.
  - Next to “Members”, select “+Select members”.
  - Add your account in the right-hand flyout, and select the “Select” button.
  - Select “Review + assign”.
- To manage permissions for your Device Update for IoT Hub account, ask the owner of the account to take these steps:
  - Select your Device Update account from the Azure portal.
  - Select “Access control (IAM) from the left-hand navigation bar.
  - Select “Add role assignment”.
  - Select the Reader role (or one with equivalent permissions).
  - Next to “Members”, select “+Select members”.
  - Add your account in the right-hand flyout, and select the “Select” button.
  - Select “Review + assign”.

Learn more about [role-based access control](device-update-control-access.md) for the Device Update service.

## <a name="contact"></a> Contacting Microsoft Support

If you run into issues that can't be resolved using the content on this page, you can file a support request with Microsoft Support through the Azure portal interface. Depending on which category you indicate your issue belongs to, you may be asked to gather and share more data to help Microsoft Support investigate your issue.

See the remaining text in this section for instructions on how to gather each data type.

You can use [getDevice](/dotnet/api/azure.iot.deviceupdate.devicemanagementclient.getdevice?view=azure-dotnet-preview&preserve-view=true) to check for additional information in the payload response of the API.

Also include the following information if possible, as it can be useful for narrowing down the root cause of your issue:

- What type of device you are attempting to update (IoT Edge Gateway, other)
- What Device Update client type you are using (Image-based, Package-based, Simulator)
- What OS your device is running
- Details regarding your device's architecture
- Whether you have successfully used Device Update to update a device before

### Collecting client logs

- On the Raspberry Pi Device there are two sets of logs found here:

```markdown
/adu/logs
```

```markdown
/var/cache/do-client-lite/log
```

- For the packaged client, the logs are found here:

```markdown
/var/log/adu
```

```markdown
/var/cache/do-client-lite/log
```

- For the Simulator, the logs are found here:

```markdown
/tmp/aduc-logs
```

### Error codes

You may be asked to provide error codes when reporting an issue related to importing an update, a device failure, or deploying an update.

Error codes can be obtained by looking at the [ADUCoreInterface](./device-update-plug-and-play.md) interface. Refer to the [Device Update error codes](./device-update-error-codes.md) documentation for information on how to parse error codes for self-diagnosis and troubleshooting.

### Trace ID

You may be asked to provide a trace ID when reporting an issue related to importing or deploying an update.

The trace ID for a given user-action can be found within the API response, or in the Import History section of the Azure portal user interface.

Currently, trace IDs for deployment actions are only accessible through the API response.

### Deployment ID

You may be asked to provide a deployment ID when reporting an issue related to deploying an update.

The deployment ID is created by the user when calling the API to initiate a deployment.

Currently, deployment IDs for deployments initiated from the Azure portal user interface are automatically generated and not surfaced to the user.

### IoT Hub instance name

You may be asked to provide your IoT Hub instance's name when reporting an issue related to device failures or deploying an update.

The IoT Hub name is chosen by the user when first provisioned.

### Device Update account name

You may be asked to provide your Device Update account's name when reporting an issue related to importing an update, device failures, or deploying an update.

The Device Update account name is chosen by the user when first signing up for the service. More information can be found in the [Device Update resources](./device-update-resources.md) documentation.

### Device Update instance name

You may be asked to provide your Device Update instance's name when reporting an issue related to importing an update, device failures, or deploying an update.

The Device Update instance name is chosen by the user when first provisioned. More information can be found in the [Device Update resources](./device-update-resources.md) documentation.

### Device ID

You may be asked to provide a device ID when reporting an issue related to device failures or deploying an update.

The device ID is defined by the customer when the device is first provisioned. It can also be retrieved from the device's Device Twin.

### Update ID

You may be asked to provide an update ID when reporting an issue related to deploying an update.

The update ID is defined by the customer when initiating a deployment.

### Nginx logs

You may be asked to provide Nginx logs when reporting an issue related to Microsoft Connected Cache.

### ADU-conf.txt

You may be asked to provide the Device Update configuration file ("adu-conf.txt") when reporting an issue related to deploying an update.

The configuration file is optional and created by the user following the instructions in the [Device Update configuration](./device-update-configuration-file.md) documentation.

### Import manifest

You may be asked to provide your import manifest file when reporting an issue related to importing or deploying an update.

The import manifest is a file created by the customer when importing update content to the Device Update service.

## Next steps

[Learn more about Device Update error codes](.\device-update-error-codes.md)
