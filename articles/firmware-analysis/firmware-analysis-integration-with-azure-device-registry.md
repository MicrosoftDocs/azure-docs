---
title: Firmware analysis integration with Azure Device Registry
description: Learn about how firmware analysis results are mapped to deployed devices and assets in Azure Device Registry.
author: karengu0
ms.author: karenguo
ms.topic: conceptual
ms.date: 04/10/2026
ms.service: azure
---

# Using Firmware analysis along with Azure Device Registry

Azure Device Registry maintains an inventory of two types of resources: Assets and Devices. Firmware images will be mapped to both types of Azure Device Registry resources.

- Assets are managed by Azure IoT Operations  
  - An example of an asset managed by Azure IoT Operations could be an oven in a bakery.
- Devices are managed by Azure IoT Hub (preview) and Azure IoT Operations  
  - Examples of devices managed by Azure IoT Hub could be cameras or wind turbines.

Firmware analysis and Azure Device Registry operate as complementary Azure services. Firmware analysis evaluates the security of firmware images, while Azure Device Registry tracks deployed devices and assets and their associated metadata. To learn more about Azure Device Registry, visit [Integration with Azure Device Registry (preview)](./../iot-hub/iot-hub-device-registry-overview.md).

The Firmware analysis and Azure Device Registry integration associates firmware analysis results with Azure Device Registry managed devices and assets based on shared metadata values. This association enables users to have a comprehensive understanding of the security posture of the firmware across your Azure Device Registry-managed devices fleet. With this integration, you can now know which devices are impacted by critical vulnerabilities in your firmware images and take the necessary actions to remediate risk across your Azure Device Registry device fleet.


## Metadata-based association

Firmware analysis associates firmware images with Azure Device Registry devices and assets by matching firmware metadata defined during firmware upload with Azure Device Registry resource metadata. This association occurs at the subscription level. Firmware analysis matches Azure Device Registry devices and assets in the same subscription as the Firmware analysis workspace.

When a firmware image is uploaded to Firmware analysis, the following metadata is specified:

- Vendor  
- Model  
- Firmware version  

Azure Device Registry maintains corresponding metadata for devices and assets. This integration establishes associations between firmware analysis results and Azure Device Registry resources by matching these metadata fields across both services.

The following metadata values are used to associate firmware images with Azure Device Registry resources:

| Firmware analysis metadata | Corresponding Azure Device Registry resource metadata |
|----------------------------|-------------------------------------|
| Vendor                     | Manufacturer                        |
| Model                      | Model                               |
| Version                    | Operating system version (Devices) or Software revision (Assets)  |

When metadata values match between a firmware image and an Azure Device Registry device or asset, the Azure Device Registry resource is associated with that firmware image for the purpose of reporting firmware analysis results for that Azure Device Registry resource.


## Ensure metadata in Firmware analysis and Azure Device Registry match each other

Because the firmware images are mapped to the Azure Device Registry resources and vice versa using metadata from both, be sure to keep your metadata fields up-to-date so that the list of Azure Device Registry resources associated with each firmware image is comprehensive.

To update your metadata fields in Firmware analysis, navigate to your firmware image in Firmware analysis, and edit the metadata fields.

:::image type="content" source="media/device-registry-integration/update-metadata.png" alt-text="Screenshot of the update metadata icon." lightbox="media/device-registry-integration/update-metadata.png":::

To update your metadata fields in Azure Device Registry for your Azure Device Registry Devices, run the following command:

```azurecli
az rest --method patch \
  --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DeviceRegistry/namespaces/{namespaceName}/devices/{deviceName}?api-version={apiVersion}" \
  --headers "Content-Type=application/json" \
  --body "{
    \"properties\": {
      \"operatingSystemVersion\": \"{operatingSystemVersion}\",
      \"enabled\": {true|false}
    }
  }"
```

To confirm that your metadata fields were updated as expected, run the following command:

```azurecli
az rest --method get \
  --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DeviceRegistry/namespaces/{namespaceName}/devices/{deviceName}?api-version={apiVersion}"
```

To update your metadata fields in Azure Device Registry for your Azure Device Registry Assets, visit the Digital Operations Experience. For more information, see [Manage resources in the operations experience UI - Azure IoT Operations](./../iot-operations/discover-manage-assets/howto-use-operations-experience.md).


## Where to find Azure Device Registry resource information in Firmware analysis

Firmware analysis surfaces Azure Device Registry device and asset information associated with a firmware image in the following areas:

- Firmware image list view in a Workspace  
  Includes a Devices & assets column that shows the number of Azure Device Registry-managed resources associated with that firmware image  

- Firmware Overview right-hand pop-up in firmware list  
  Displays two fields: “Devices” and “Assets” count associated with the firmware image  

  :::image type="content" source="media/device-registry-integration/devices-assets-firmware-list-popup.png" alt-text="Screenshot of the Devices and Assets list in the firmware list popup." lightbox="media/device-registry-integration/devices-assets-firmware-list-popup.png":::

  - Hover over the number to see a scrollable list of Azure Device Registry Devices or Assets, each linking to that Azure Device Registry resource’s Resource Overview page in the Azure Device Registry portal

- Analysis results Azure Device Registry section  
  - Azure Device Registry fields “Devices” and “Assets” that displays Azure Device Registry-associated devices and assets alongside firmware analysis findings  
  
    :::image type="content" source="media/device-registry-integration/devices-assets-firmware-details.png" alt-text="Screenshot of the Devices and Assets fields in firmware analysis findings." lightbox="media/device-registry-integration/devices-assets-firmware-details.png":::

  - Like the experience in the Overview panel pop-up, hover over the number to see a scrollable list of Azure Device Registry resources, each linking to that resource’s Resource Overview page in the Azure Device Registry portal  
  
    :::image type="content" source="media/device-registry-integration/hover-list.png" alt-text="Screenshot of the scrollable list upon hovering over Azure Device Registry resources." lightbox="media/device-registry-integration/hover-list.png":::

From Firmware analysis, you can select an Azure Device Registry resource to be taken to the Azure Device Registry resource overview page in the Azure Device Registry portal.

---

## Access requirements

Access to Azure Device Registry associated device and asset information is governed by Azure role based access control (RBAC).

Firmware analysis roles do not automatically grant access to Azure Device Registry resources. Users of Firmware analysis with the Firmware Analysis Admin role do not have proper permissions to view the list of Azure Device Registry devices. Users must also have appropriate Azure Device Registry permissions to view:

- Azure Device Registry device lists  
- Azure Device Registry asset metadata  
- Azure Device Registry resource details in the Azure Device Registry portal  

Azure Device Registry-associated information might not be visible if the user does not have the required Azure Device Registry permissions, even when metadata values match. Ensure you have both of the following roles:

- Azure Device Registry Contributor, which allows you to read Azure Device Registry namespaces  
- Azure IoT Operations Administrator, which allows you to read Azure Device Registry Assets and Devices in the Azure Device Registry namespaces  

Additionally, the Reader role at the subscription level allows you to read both namespaces and Azure Device Registry Assets and Devices.

| Role                               | Permission to read namespaces? | Permission to read Azure Device Registry Assets? | Permission to read Azure Device Registry Devices? |
|------------------------------------|--------------------------------|--------------------------------|---------------------------------|
| Azure Device Registry Contributor  | Yes                            | No                             | Yes                             |
| Azure IoT Operations Administrator | No                             | Yes                            | Yes                             |
| Reader                             | Yes                            | Yes                            | Yes                             |

Ensure you have the Firmware Analysis Admin role in addition to the appropriate Azure Device Registry roles to see Azure Device Registry-associated information.

## Why am I not seeing any Azure Device Registry Devices or Assets?

If Azure Device Registry device or asset counts are not visible for a firmware image, it may be due to one of the following:

- Insufficient permissions – Your Azure role may not have permission to read Azure Device Registry devices and/or assets. In this case, counts may appear blank (–) or partially populated.  

- Missing firmware metadata – Azure Device Registry correlation requires Vendor, Model, and Version fields. If these are not populated accurately in both Firmware analysis and Azure Device Registry, device and asset usage cannot be determined.  

- Temporary query failure – Azure Device Registry results are retrieved using Azure Resource Graph (ARG). Counts may appear empty if a query error occurs. Refreshing the page might resolve this.  


## Current limitations

The initial preview version of this integration:

- Displays Azure Device Registry device and asset count  
- Displays results by using Azure Resource Graph. Changes to metadata for Azure Device Registry Devices and Assets might take a few minutes to appear in Firmware analysis  
- Provides navigation to individual Azure Device Registry resources instead of a pre-filtered Azure Device Registry device list view
