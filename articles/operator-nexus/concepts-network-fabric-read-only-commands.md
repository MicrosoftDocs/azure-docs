---
title: Network Fabric read-only commands
description: Learn about troubleshooting network devices using read-only commands.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-nexus
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.date: 04/10/2024

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---

# Network Fabric read-only commands for troubleshooting

Troubleshooting network devices is a critical aspect of effective network management. Ensuring the health and optimal performance of your infrastructure requires timely diagnosis and resolution of issues. In this guide, we present a comprehensive approach to troubleshooting Azure Operator Nexus devices using read-only (RO) commands. 

## Understanding read-only commands 

RO commands serve as essential tools for network administrators. Unlike read-write (RW) commands that modify device configurations, RO commands allow administrators to gather diagnostic information without altering the device's state. These commands provide valuable insights into the device's status, configuration, and operational data. 

## Read-only diagnostic API 

The read-only diagnostic API enables users to execute `show` commands on network devices via an API call. This efficient method allows administrators to remotely run diagnostic queries across all network fabric devices. Key features of the read-only diagnostic API include: 

- **Efficiency** - Execute `show` commands without direct access to the device console. 

- **Seamless Integration with AZCLI**: Users can utilize the regular Azure Command-Line Interface (AZCLI) to pass the desired "show command." The API then facilitates command execution on the target device, fetching the output. 

- **JSON Output**: Results from the executed commands are presented in JSON format, making it easy to parse and analyze. 

- **Secure Storage**: The output data is stored in the customer-owned storage account, ensuring data security and compliance. 

By using the read-only diagnostic API, network administrators can efficiently troubleshoot issues, verify configurations, and monitor device health across their Azure Operator Nexus devices. 

## Prerequisites

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
- Cable validation supports both 4 rack and 8 rack BOMs.

## Troubleshoot using read-only commands

1. Open a Microsoft support ticket. The support engineer makes the necessary updates.
1. Execute the following Azure CLI commands:

    ```azurecli
    az networkfabric device run-ro --resource-name "<NFResourceName>" --resource-group "<NFResourceGroupName>" --ro-command "show version"
    ```
    
     Expected output: 
    
    ```azurecli
    az networkfabric device run-ro --resource-group Fab3LabNF-6-0-A --resource-name nffab3-6-0-A-AggrRack-CE1 --ro-command "show version" --no-wait --debug

    cli.knack.cli: Command arguments: ['networkfabric', 'device', 'run-ro', '--resource-group', 'ResourceGroupName', '--resource-name', 'ResourceName', '--ro-command', 'show version', '--no-wait', '--debug']
    cli.knack.cli: __init__ debug log:
    Enable color in terminal.
    Enable VT mode.
    cli.knack.cli: Event: Cli.PreExecute []
    cli.knack.cli: Event: CommandParser.OnGlobalArgumentsCreate [<function CLILogging.on_global_arguments at 0x0198A418>, <function OutputProducer.on_global_arguments at 0x01A8D658>, <function CLIQuery.on_global_arguments at 0x01BA82B0>]
    cli.knack.cli: Event: CommandInvoker.OnPreCommandTableCreate []
    cli.azure.cli.core: Modules found from index for 'networkfabric': ['azext_managednetworkfabric']
    cli.azure.cli.core: Loading command modules:
    cli.azure.cli.core: Name                  Load Time    Groups  Commands
    cli.azure.cli.core: Total (0)                 0.000         0         0
    cli.azure.cli.core: These extensions are not installed and will be skipped: ['azext_ai_examples', 'azext_next']
    cli.azure.cli.core: Loading extensions:
    cli.azure.cli.core: Name                  Load Time    Groups  Commands  Directory
    cli.azure.cli.core: managednetworkfabric      0.604        22        26  \XXXXX\XXXXX\.azure\cliextensions\managednetworkfabric
    cli.azure.cli.core: Total (1)                 0.604        22        26
    ```
3. Check the status of the operation programmatically using the following Azure CLI command:

    ```azurecli
    az rest -m get -u "<Azure-operationsstatus-endpoint url>"
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
