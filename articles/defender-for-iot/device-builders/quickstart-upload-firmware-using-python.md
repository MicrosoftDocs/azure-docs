---
title: "Quickstart: Upload firmware images to Defender for IoT Firmware Analysis using Python"
description: "Learn how to upload firmware images for analysis using Python."
author: karengu0
ms.author: karenguo
ms.topic: quickstart
ms.date: 04/10/2024

---

# Quickstart: Upload firmware images to Defender for IoT Firmware Analysis using Python

This article explains how to use a Python script to upload firmware images to Defender for IoT Firmware Analysis.

[Defender for IoT Firmware Analysis](/azure/defender-for-iot/device-builders/overview-firmware-analysis) is a tool that analyzes firmware images and provides an understanding of security vulnerabilities in the firmware images.

## Prerequisites

This quickstart assumes a basic understanding of Defender for IoT Firmware Analysis. For more information, see [Firmware analysis for device builders](/azure/defender-for-iot/device-builders/overview-firmware-analysis). For a list of the file systems that are supported, see [Frequently asked Questions about Defender for IoT Firmware Analysis](../../../articles/defender-for-iot/device-builders/defender-iot-firmware-analysis-faq.md#what-types-of-firmware-images-does-defender-for-iot-firmware-analysis-support).

### Prepare your environment

* Python version 3.8+ is required to use this package. Run the command `python --version` to check your Python version.
* Make note of your Azure subscription ID, the name of your Resource Group where you'd like to upload your images, your workspace name, and the name of the firmware image that you'd like to upload.
* Ensure that your Azure account has the necessary permissions to upload firmware images to Defender for IoT Firmware Analysis for your Azure subscription. You must be an Owner, Contributor, Security Admin, or Firmware Analysis Admin at the Subscription or Resource Group level to upload firmware images. For more information, visit [Defender for IoT Firmware Analysis Roles, Scopes, and Capabilities](/azure/defender-for-iot/device-builders/defender-iot-firmware-analysis-rbac#defender-for-iot-firmware-analysis-roles-scopes-and-capabilities).
* Ensure that your firmware image is stored in the same directory as the Python script.
* Install the packages needed to run this script:
    ```python
    pip install azure-mgmt-iotfirmwaredefense
    pip install azure-identity
    ```
* Log in to your Azure account by running the command [`az login`](/cli/azure/reference-index?#az-login).

## Run the following Python script

Copy the following Python script into a `.py` file and save it to the same directory as your firmware image. Replace the `subscription_id` variable with your Azure subscription ID, `resource_group_name` with the name of your Resource Group where you'd like to upload your firmware image, and `firmware_file` with the name of your firmware image, which is saved in the same directory as the Python script.

```python
from azure.identity import AzureCliCredential
from azure.mgmt.iotfirmwaredefense import *
from azure.mgmt.iotfirmwaredefense.models import *
from azure.core.exceptions import *
from azure.storage.blob import BlobClient
import uuid
from time import sleep
from halo import Halo
from tabulate import tabulate

subscription_id = "subscription-id"
resource_group_name = "resource-group-name"
workspace_name = "default"
firmware_file = "firmware-image-name"

def main():
    firmware_id = str(uuid.uuid4())
    fw_client = init_connections(firmware_id)
    upload_firmware(fw_client, firmware_id)
    get_results(fw_client, firmware_id)

def init_connections(firmware_id):
    spinner = Halo(text=f"Creating client for firmware {firmware_id}")
    cli_credential = AzureCliCredential()
    client = IoTFirmwareDefenseMgmtClient(cli_credential, subscription_id, 'https://management.azure.com')
    spinner.succeed()
    return client

def upload_firmware(fw_client, firmware_id):
    spinner = Halo(text="Uploading firmware to Azure...", spinner="dots")
    spinner.start()
    token = fw_client.workspaces.generate_upload_url(resource_group_name, workspace_name, {"firmware_id": firmware_id})
    fw_client.firmwares.create(resource_group_name, workspace_name, firmware_id, {"properties": {"file_name": firmware_file, "vendor": "Contoso Ltd.", "model": "Wifi Router", "version": "1.0.1", "status": "Pending"}})
    bl_client = BlobClient.from_blob_url(token.url)
    with open(file=firmware_file, mode="rb") as data:
        bl_client.upload_blob(data=data)
    spinner.succeed()

def get_results(fw_client, firmware_id):
    fw = fw_client.firmwares.get(resource_group_name, workspace_name, firmware_id)

    spinner = Halo("Waiting for analysis to finish...", spinner="dots")
    spinner.start()
    while fw.properties.status != "Ready":
        sleep(5)
        fw = fw_client.firmwares.get(resource_group_name, workspace_name, firmware_id)
    spinner.succeed()

    print("-"*107)

    summary = fw_client.summaries.get(resource_group_name, workspace_name, firmware_id, summary_name=SummaryName.FIRMWARE)
    print_summary(summary.properties)
    print()

    components = fw_client.sbom_components.list_by_firmware(resource_group_name, workspace_name, firmware_id)
    if components is not None:
        print_components(components)
    else:
        print("No components found")

def print_summary(summary):
    table = [[summary.extracted_size, summary.file_size, summary.extracted_file_count, summary.component_count, summary.binary_count, summary.analysis_time_seconds, summary.root_file_systems]]
    header = ["Extracted Size", "File Size", "Extracted Files", "Components", "Binaries", "Analysis Time", "File Systems"]
    print(tabulate(table, header))

def print_components(components):
    table = []
    header = ["Component", "Version", "License", "Paths"]
    for com in components:
        table.append([com.properties.component_name, com.properties.version, com.properties.license, com.properties.file_paths])
    print(tabulate(table, header, maxcolwidths=[None, None, None, 57]))

if __name__ == "__main__":
    exit(main())
```

