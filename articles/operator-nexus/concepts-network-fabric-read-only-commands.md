---
title: Network Fabric read-only commands
description: Learn about troubleshooting network devices using read-only commands.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-nexus
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.date: 04/15/2024

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
ms.custom:
  - build-2025
---

# Network Fabric read-only commands for troubleshooting

Troubleshooting network devices is a critical aspect of effective network management. Ensuring the health and optimal performance of your infrastructure requires timely diagnosis and resolution of issues. In this guide, we present a comprehensive approach to troubleshooting Azure Operator Nexus devices using read-only (RO) commands. 

## Understanding read-only commands 

RO commands serve as essential tools for network administrators. Unlike read-write (RW) commands that modify device configurations, RO commands allow administrators to gather diagnostic information without altering the device's state. These commands provide valuable insights into the device's status, configuration, and operational data. The RO command also supports using a customer-provided storage account for storing output files using api version 2024-06-15-preview.

## Read-only diagnostic API 

The read-only diagnostic API enables users to execute `show` commands on network devices via an API call. This efficient method allows administrators to remotely run diagnostic queries across all network fabric devices. Key features of the read-only diagnostic API include: 

- **Efficiency** - Execute `show` commands without direct access to the device console. 

- **Seamless Integration with AZCLI**: Users can utilize the regular Azure Command-Line Interface (AZCLI) to pass the desired "show command." The API then facilitates command execution on the target device, fetching the output. 

- **JSON Output**: Results from the executed commands are presented in JSON format, making it easy to parse and analyze. 

- **Secure Storage**: The output data is stored in the customer-owned storage account, ensuring data security and compliance. 

By using the read-only diagnostic API, network administrators can efficiently troubleshoot issues, verify configurations, and monitor device health across their Azure Operator Nexus devices. 

## Prerequisites

To use Network Fabric read-only commands, complete the following steps:

- Provision the Nexus Network Fabric successfully.

- Generate the storage URL.

    Refer to [Create a container](../storage/blobs/blob-containers-portal.md#create-a-container) to create a container.  

    > [!NOTE]
    > Enter the name of the container using only lowercase letters.

    Refer to [Generate a shared access signature](../storage/blobs/blob-containers-portal.md#generate-a-shared-access-signature) to create the SAS URL of the container. Provide Write permission for SAS.

    > [!NOTE]
    > SAS URLs are short lived. By default, it is set to expire in eight hours. If the SAS URL expires, then the fabric must be re-patched. 

- Provide the storage URL with WRITE access via a support ticket. 

    > [!NOTE]
    > The Storage URL must be located in a different region from the Network Fabric. For instance, if the Fabric is hosted in East US, the storage URL should be outside of East US. 

## Bring your own storage account 

Users can bring your own storage for storing output files of runRO command by following the steps outlined in the [Bring Your Own Storage for Network Fabric](howto-configure-bring-your-own-storage-network-fabric.md) guide.

>[!Note]
> Starting with the 2024-06-15-preview API update, bringing your own storage account is the preferred method. Users should create or associate the fabric instances with your storage account referring to [configure Bring-Your-Own (BYO) Storage for Network Fabric](/azure/operator-nexus/howto-configure-network-fabric) article.

### Running read-only (RO) Commands

Azure Operator Nexus supports execution of read-only show commands on fabric devices via the Azure CLI. This feature allows administrators to retrieve diagnostic data for monitoring and troubleshooting while ensuring the underlying device configurations remain unchanged.

#### Example: Executing a Read-Only Command via Azure CLI

You can use the az networkfabric device run-ro command to issue supported show commands. Below is a sample command demonstrating how to query a device for its version details:

 **Scenario 1:** Response under 4000 characters (Correct JSON formatting)

```Azure CLI
az networkfabric device run-ro \
  --resource-group "resource-group-name" \
  --resource-name "device-name" \
  --ro-command "show version"

```

Replace `resource-group-name` and `device-name` with your specific values.

Expected Output

```json
{
  "configurationState": "Succeeded",
  "deviceConfigurationPreview": {
    "architecture": "x86_64",
    "bootupTimestamp": 1742470725.3758163,
    "configMacAddress": "00:00:00:00:00:00",
    "hardwareRevision": "12.05",
    "hwMacAddress": "c4:ca:xx:xx:xx:35",
    "imageFormatVersion": "3.0",
    "imageOptimization": "Default",
    "internalBuildId": "2b2210fa-xxxx-xxxx-xxxx-f120aa00xxxx",
    "internalVersion": "4.xx.1F-39879738.xxxxx",
    "isIntlVersion": false,
    "memFree": 3760128,
    "memTotal": 8099732,
    "mfgName": "vendor",
    "modelName": "xxx-xxxxx-xx-x",
    "serialNumber": "JPA2303P3FH",
    "systemMacAddress": "c4:ca:xx:xx:xx:35",
    "uptime": 3648004.37,
    "version": "4.xx.1F"
  },
  "outputUrl": "https://<blob-url>/show_version.json"
}
```
> [Note]
> This output is well-formatted JSON because the total content is within the 4000-character boundary.

Scenario 2: Response exceeds 4000 characters (Incorrect formatting)

Truncated output
```json
{
  "configurationState": "Succeeded",
  "deviceConfigurationPreview": "{\n  \"lldpNeighbors\": {\n    \"Ethernet1/1\": {\n      \"lldpNeighborInfo\": [\n        {\n          \"chassisId\": \"c4ca.2b62.19b5\",\n          \"chassisIdType\": \"macAddress\",\n          \"lastChangeTime\": 1742470988.8675177,\n          ...
        }\n      ]\n    },\n    ...
  }",
  "outputUrl": "https://<blob-url>/lldp_neighbors_detail.json"
}
```

>[Note]
>  The field deviceConfigurationPreview is not a JSON object, but rather a string containing escaped JSON. This happens because the actual output is larger than 4000 characters. In such cases, the formatting is lost in the CLI output.


> [!Note] 
> The output structure may vary depending on the specific show command issued.<br>
> Ensure the storage account URL (provided during setup) is accessible for the platform to write the output securely.<br>

 ## Command restrictions

To ensure security and compliance, RO commands must adhere to the following specific rules:

- Only absolute commands should be provided as input. Short forms and prompts aren't supported. For example:
    - Enter `show interfaces Ethernet 1/1 status`
    - Don't enter `sh int stat` or `sh int e1/1 status`
- Commands must not be null, empty, or consist only of a single word.
- Commands must not include the pipe (|) character.
- Show commands are unrestricted, except for the high CPU intensive commands specifically referred to in this list of restrictions.
- Commands must not end with `tech-support`, `agent logs`, `ip route`, or `ip route vrf all`. 
- Only one `show` command at a time can be used on a specific device.
-  You can run the `show` command on another CLI window in parallel.
- You can run a `show` command on different devices at the same time.

## Troubleshoot using read-only commands

To troubleshoot using read-only commands, follow these steps:

1. Open a Microsoft support ticket. The support engineer makes the necessary updates.
1. Execute the following Azure CLI command:

    ```azurecli
    az networkfabric device run-ro --resource-name "<NFResourceName>" --resource-group "<NFResourceGroupName>" --ro-command "show version"
    ```
    
     Expected output: 
    
   `{ }`

1. Enter the following command: 

    ```azurecli
    az networkfabric device run-ro --resource-group Fab3LabNF-6-0-A --resource-name nffab3-6-0-A-AggrRack-CE1 --ro-command "show version" --no-wait --debug
    ```

    The following (truncated) output appears. Copy the URL through **private preview**. This portion of the URL is used in the following step to check the status of the operation.

    ```azurecli
    https://management.azure.com/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS2EUAP/operationStatuses/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e*A9E6DB3DF5C58D67BD395F7A608C056BC8219C392CC1CE0AD22E4C36D70CEE5C?api-version=2022-01-15-privatepreview***&t=638485032018035520&c=MIIHHjCCBgagAwIBAgITfwKWMg6goKCq4WwU2AAEApYyDjANBgkqhkiG9w0BAQsFADBEMRMwEQYKCZImiZPyLGQBGRYDR0JMMRMwEQYKCZImiZPyLGQBGRYDQU1FMRgwFgYDVQQDEw9BTUUgSW5mcmEgQ0EgMDIwHhcNMjQwMTMwMTAzMDI3WhcNMjUwMTI0MTAzMDI3WjBAMT4wPAYDVQQDEzVhc3luY29wZXJhdGlvbnNpZ25pbmdjZXJ0aWZpY2F0ZS5tYW5hZ2VtZW50LmF6dXJlLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALMk1pBZQQoNY8tos8XBaEjHjcdWubRHrQk5CqKcX3tpFfukMI0_PVZK-Kr7xkZFQTYp_ItaM2RPRDXx-0W9-mmrUBKvdcQ0rdjcSXDek7GvWS29F5sDHojD1v3e9k2jJa4cVSWwdIguvXmdUa57t1EHxqtDzTL4WmjXitzY8QOIHLMRLyXUNg3Gqfxch40cmQeBoN4rVMlP31LizDfdwRyT1qghK7vgvworA3D9rE00aM0n7TcBH9I0mu-96JE0gSX1FWXctlEcmdwQmXj_U0sZCu11_Yr6Oa34bmUQHGc3hDvO226L1Au-QsLuRWFLbKJ-0wmSV5b3CbU1kweD5LUCAwEAAaOCBAswggQHMCcGCSsGAQQBgjcVCgQaMBgwCgYIKwYBBQUHAwEwCgYIKwYBBQUHAwIwPQYJKwYBBAGCNxUHBDAwLgYmKwYBBAGCNxUIhpDjDYTVtHiE8Ys-
    ```

3. Check the status of the operation programmatically using the following Azure CLI command:

    ```azurecli
    az rest -m get -u "<Azure-AsyncOperation-endpoint url>"
    ```

    The operation status indicates if the API succeeded or failed, and appears similar to the following output: 
    
    ```azurecli
    https://management.azure.com/subscriptions/xxxxxxxxxxx/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS/operationStatuses/xxxxxxxxxxx?api-version=20XX-0X-xx-xx
    ```    

4. View and download the generated output file. Sample output is shown here.

    ```azurecli
     {
     "architecture": "x86_64",
      "bootupTimestamp": 1701940797.5429916,
      "configMacAddress": "00:00:00:00:00:00",
      "hardwareRevision": "12.05",
      "hwMacAddress": "c4:ca:2b:62:6d:d3",
      "imageFormatVersion": "3.0",
      "imageOptimization": "Default",
      "internalBuildId": "d009619b-XXXX-XXXX-XXXX-fcccff30ae3b",
      "internalVersion": "4.30.3M-33434233.4303M",
      "isIntlVersion": false,
      "memFree": 3744220,
      "memTotal": 8107980,
      "mfgName": "Arista",
      "modelName": "DCS-7280DR3-24-F",
      "serialNumber": "JPAXXXX1LZ",
      "systemMacAddress": "c4:ca:2b:62:6d:d3",
      "uptime": 8475685.5,
      "version": "4.30.3M"
     }
    ```
