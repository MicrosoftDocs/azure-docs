---
title: Azure Operator Nexus: Run read-only commands
description: Get an overview of read-only commands for Azure Operator Nexus.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-nexus
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.date: 03/20/2024


---


# Run read-only commands

Troubleshooting network devices is a critical aspect of effective network management. Ensuring the health and optimal performance of your infrastructure requires timely diagnosis and resolution of issues. This article presents a comprehensive approach to troubleshooting Azure Operator Nexus devices using read-only (RO) commands.

## Understanding read-only Commands

RO commands serve as essential tools for network administrators. Unlike read-write (RW) commands that modify device configurations, RO commands allow administrators to gather diagnostic information without altering the device’s state. These commands provide valuable insights into the device’s status, configuration, and operational data.

## Read-only diagnostic API

The read-only diagnostic API enables users to execute `show` commands on network devices via an API call. This efficient method allows administrators to remotely run diagnostic queries across all network fabric devices. Key features of the Read-Only diagnostic API include: 

- **Efficiency** -  Execute `show` commands  without direct access to the device console.

- **Seamless Integration with AZCLI** -  Users can utilize the regular Azure Command-Line Interface (AZCLI) to pass the desired `show` command. The API then facilitates command execution on the target device, fetching the output.

- **JSON Output** -  Results from the executed commands are presented in JSON format, making it easy to parse and analyze.

- **Secure Storage** - The output data is stored in the customer-owned storage account, ensuring data security and compliance.

By using the Read-Only diagnostic API, network administrators can efficiently troubleshoot issues, verify configurations, and monitor device health across their Azure Operator Nexus devices.

## Prerequisites

- Provision the Nexus Network Fabric successfully.

- Provide the storage URL with WRITE access via a support ticket.

- The Storage URL must be located in a different region from the Network Fabric. For instance, if the Fabric is hosted in East US, the storage URL should be outside of East US.

For example, if the shared access token (SAS) URL of the container is *readonlydiagnosticsAPI.blob.core.windows.net/read-only-test-XXXXXXXXXX*, then the Network Fabric ARM ID would be */subscriptions/ XXXX-XXXX-XXXX-XXXX /resourceGroups ResourceGroupName /providers/Microsoft.ManagedNetworkFabric/networkFabrics/NFName*.

## Command restrictions

To ensure security and compliance, RO commands must follow specific rules, including:

- All commands must start with `show`.
- Only an absolute command can be provided as an input. Do no abbreviate to short forms or prompts. `show interfaces Ethernet 1/1 status`. 
- Commands such as `sh int stat` or `sh int et1/1 status` aren’t supported.  
- Commands must not be null, empty, or consist of a single word.
- Commands must not include the pipe character (|).
- Commands must not end with `tech-support`, `agent logs`, `ip route`, or `ip route vrf all`.

Consider the following rules when using a `show` command:

- Only one `show` command is permitted on a specific device at any time. However, you can run `show` commands on another CLI window or device at the same time.
- `show` commands are currently unrestricted, except for a few high CPU-intensive commands.

## Execute the read-only command

To run a read-only command, you must first contact Microsoft support. Once they've made the necessary updates, run the following Azure CLI command:

```azurecli
az networkfabric device run-ro --resource-name "<NFResourceName>" --resource-group "<NFResourceGroupName>" --ro-command ”show version”  

```

You can programmatically check the status of the operation using the following Azure CLI command. The status displays, indicating if the API failed or succeeded.

```azurecli
az rest -m get -u “<Azure-operationsstatus-endpoint url>”   
```
Navigate to the container to view the results of the RO command and to and download the generated output file. 
## Related content
