---
title: Chaos Studio fault and action library
description: Understand the available actions you can use with Chaos Studio including any prerequisites and parameters.
services: chaos-studio
author: johnkemnetz
ms.topic: article
ms.date: 08/26/2021
ms.author: johnkem
ms.service: chaos-studio
---

# Chaos Studio fault and action library

The following faults are available for use today. Visit the [Fault Providers](./chaos-studio-fault-providers.md) page to understand which resource types are supported.

## Time delay

| Property | Value  |
|-|-|
| Fault Provider | N/A |
| Supported OS Types | N/A |
| Description | Adds a time delay before, between, or after other actions. Useful for waiting for the impact of a fault to appear in a service or for waiting for an activity outside of the experiment to complete (for example waiting for autohealing to occur before injecting another fault). |
| Prerequisites | N/A |
| Name | urn:provider:Azure-chaosStudio:Microsoft.Azure.Chaos.Delay.Timed |
| duration | The duration of the delay in ISO 8601 format (Example: PT10M) |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [ 
    {
      "type": "delay",
      "name": "urn:provider:Azure-chaosStudio:Microsoft.Azure.Chaos.Delay.Timed",
      "duration": "PT10M"
    }
  ] 
}
```

## CPU pressure

| Property | Value  |
|-|-|
| Fault Provider (agent-based) | ChaosAgent |
| Supported OS Types | Windows, Linux |
| Description | Add CPU pressure up to the specified value on the VM where this fault is injected for the duration of the fault action. The artificial CPU pressure is removed at the end of the duration or if the experiment is canceled. |
| Prerequisites | **Linux:** Running the fault on a Linux VM requires the **stress-ng** utility to be installed. You can install it using the package manager for your Linux distro, </br> APT Command to install stress-ng: *sudo apt-get update && sudo apt-get -y install unzip && sudo apt-get -y install stress-ng* </br> YUM Command to install stress-ng: *sudo dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm && sudo yum -y install stress-ng*  |
| | **Windows:** None. |
| Name | urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.CPUPressureAllProcessors |
| Parameters (key, value)  |
| PressureLevel | An integer between 1 and 99 that indicates how much CPU pressure (%) will be applied to the VM. |

### Sample JSON
```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.CPUPressureAllProcessors",
      "parameters": [
        {
          "key": "PressureLevel",
          "value": "95"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

> [!NOTE]
> There are two known issues on Linux:
> 1. Stress effect may not be terminated correctly if AzureChaosAgent is unexpectedly killed.
> 2. Linux CPU fault is only tested on Ubuntu 16.04-LTS and Ubuntu 18.04-LTS.

## Physical memory pressure

| Property | Value  |
|-|-|
| Fault Provider (agent-based) | ChaosAgent |
| Supported OS Types | Windows, Linux |
| Description | Add physical memory pressure up to the specified value on the VM where this fault is injected for the duration of the fault action. The artificial physical memory pressure is removed at the end of the duration or if the experiment is canceled. |
| Prerequisites | **Linux:** Running the fault on a Linux VM requires the **stress-ng** utility to be installed. You can install it using the package manager for your Linux distro, </br> APT Command to install stress-ng: *sudo apt-get update && sudo apt-get -y install unzip && sudo apt-get -y install stress-ng* </br> YUM Command to install stress-ng: *sudo dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm && sudo yum -y install stress-ng*  |
| | **Windows:** None. |
| Name | urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.PhysicalMemoryPressure |
| Parameters (key, value) |  |
| PressureLevel | An integer between 1 and 99 that indicates how much physical memory pressure (%) will be applied to the VM. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.PhysicalMemoryPressure",
      "parameters": [
        {
          "key": "PressureLevel",
          "value": "95"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Virtual memory pressure

| Property | Value  |
|-|-|
| Fault Provider (agent-based) | ChaosAgent |
| Supported OS Types | Windows |
| Description | Add virtual memory pressure up to the specified value on the VM where this fault is injected for the duration of the fault action. The artificial virtual memory pressure is removed at the end of the duration or if the experiment is canceled. |
| Prerequisites | None. |
| Name | urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.VirtualMemoryPressure |
| Parameters (key, value) |  |
| PressureLevel | An integer between 1 and 99 that indicates how much physical memory pressure (%) will be applied to the VM. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.VirtualMemoryPressure",
      "parameters": [
        {
          "key": "PressureLevel",
          "value": "95"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Disk I/O pressure (Windows)

| Property | Value  |
|-|-|
| Fault Provider (agent-based) | ChaosAgent |
| Supported OS Types | Windows |
| Description | Uses the [diskspd utility](https://github.com/Microsoft/diskspd/wiki) to add disk pressure to the primary storage of the VM where it is injected for the duration of the fault action. This fault has five different modes of execution. The artificial disk pressure is removed at the end of the duration or if the experiment is canceled. |
| Prerequisites | None. |
| Name | urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.DiskSpdFault |
| Parameters (key, value) |  |
| PressureMode | The preset mode of disk pressure to add to the primary storage of the VM. Must be one of the PressureModes in the table below. |

### Pressure modes

| PressureMode | Description |
| -- | -- |
| PremiumStorageP10IOPS | numberOfThreads = 1<br/>randomBlockSizeInKB = 64<br/>randomSeed = 10<br/>numberOfIOperThread = 25<br/>sizeOfBlocksInKB = 8<br/>sizeOfWriteBufferInKB = 64<br/>fileSizeInGB = 2<br/>percentOfWriteActions = 50 |
| PremiumStorageP10Throttling |<br/>numberOfThreads = 2<br/>randomBlockSizeInKB = 64<br/>randomSeed = 10<br/>numberOfIOperThread = 25<br/>sizeOfBlocksInKB = 64<br/>sizeOfWriteBufferInKB = 64<br/>fileSizeInGB = 1<br/>percentOfWriteActions = 50 |
| PremiumStorageP50IOPS | numberOfThreads = 32<br/>randomBlockSizeInKB = 64<br/>randomSeed = 10<br/>numberOfIOperThread = 32<br/>sizeOfBlocksInKB = 8<br/>sizeOfWriteBufferInKB = 64<br/>fileSizeInGB = 1<br/>percentOfWriteActions = 50 |
| PremiumStorageP50Throttling | numberOfThreads = 2<br/>randomBlockSizeInKB = 1024<br/>randomSeed = 10<br/>numberOfIOperThread = 2<br/>sizeOfBlocksInKB = 1024<br/>sizeOfWriteBufferInKB = 1024<br/>fileSizeInGB = 20<br/>percentOfWriteActions = 50|
| Default | numberOfThreads = 2<br/>randomBlockSizeInKB = 64<br/>randomSeed = 10<br/>numberOfIOperThread = 2<br/>sizeOfBlocksInKB = 64<br/>sizeOfWriteBufferInKB = 64<br/>fileSizeInGB = 1<br/>percentOfWriteActions = 50 |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.DiskSpdFault",
      "parameters": [
        {
          "key": "PressureMode",
          "value": "PremiumStorageP10IOPS"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Disk I/O pressure (Linux)

| Property | Value  |
|-|-|
| Fault Provider (agent-based) | ChaosAgent |
| Supported OS Types | Linux |
| Description | Uses stress-ng to apply pressure to the disk. One or more worker processes are spawned that perform I/O processes with temporary files. For details on how pressure is applied see https://wiki.ubuntu.com/Kernel/Reference/stress-ng. |
| Prerequisites | Running the fault on a Linux VM requires the **stress-ng** utility to be installed. You can install it using the package manager for your Linux distro, </br> APT Command to install stress-ng: *sudo apt-get update && sudo apt-get -y install unzip && sudo apt-get -y install stress-ng* </br> YUM Command to install stress-ng: *sudo dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm && sudo yum -y install stress-ng* |
| Name | urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.DiskPressure |
| Parameters (key, value) |  |
| WorkerCount | Number of worker processes to run. Setting to 0 will generate as many worker processes as there are number of processors. |
| FileSizePerWorker | Size of the temporary file a worker will perform I/O operations against. Integer plus a unit in bytes (b), kilobytes (k), megabytes (m), or gigabytes(g) (for example 4m for 4 megabytes, 256g for 256 gigabytes) |
| BlockSize | Block size to be used for disk I/O operations, capped at 4 megabytes. Integer plus a unit in bytes (b), kilobytes (k), or megabytes (m) (for example 512k for 512 kilobytes). |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.DiskPressure",
      "parameters": [
        {
          "key": "WorkerCount",
          "value": "0"
        },
        {
          "key": "FileSizePerWorker",
          "value": "512m"
        },
        {
          "key": "BlockSize",
          "value": "256k"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Arbitrary stress-ng stress

| Property | Value  |
|-|-|
| Fault Provider (agent-based) | ChaosAgent |
| Supported OS Types | Linux |
| Description | Run any stress-ng command by passing arguments directly to stress-ng. Useful for when one of the pre-defined faults for stress-ng doesn't meet your needs. |
| Prerequisites | Running the fault on a Linux VM requires the **stress-ng** utility to be installed. You can install it using the package manager for your Linux distro, </br> APT Command to install stress-ng: *sudo apt-get update && sudo apt-get -y install unzip && sudo apt-get -y install stress-ng* </br> YUM Command to install stress-ng: *sudo dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm && sudo yum -y install stress-ng* |
| Name | urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.StressNg |
| Parameters (key, value) |  |
| StressNgArguments | One or more arguments to pass to the stress-ng process. For details on possible stress-ng arguments see https://wiki.ubuntu.com/Kernel/Reference/stress-ng. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.StressNg",
      "parameters": [
        {
          "key": "StressNgArguments",
          "value": "--random 64"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Stop Windows service

| Property | Value  |
|-|-|
| Fault Provider (agent-based) | ChaosAgent |
| Supported OS Types | Windows |
| Description | Uses the Windows Service Controller APIs to stop a Windows service for the duration of the fault, restarting it at the end of the duration or if the experiment is canceled. |
| Prerequisites | None. |
| Name | urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.StopWindowsService |
| Parameters (key, value) |  |
| ServiceName | The name of the Windows service you want to stop. You can run `sc.exe query` in command prompt to explore service names, Windows service friendly names are not supported. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.StopWindowsServiceFault",
      "parameters": [
        {
          "key": "ServiceName",
          "value": "nvagent"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Time change

| Property | Value  |
|-|-|
| Fault Provider (agent-based) | ChaosAgent |
| Supported OS Types | Windows |
| Description | Changes the system time for the VM where it is injected and resets it at the end of the duration or if the experiment is canceled. |
| Prerequisites | None. |
| Name | urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.TimeChange |
| Parameters (key, value) |  |
| DateTime | A DateTime String in [ISO8601 format](https://www.cryptosys.net/pki/manpki/pki_iso8601datetime.html). The datetime is defaulted to the current day when the experiment runs if YYYY-MM-DD values are missing. If Thh:mm:ss values are missing, the default value is 12:00:00 AM. If a 2-digit year is provided (YY), it is converted to a 4-digit year (YYYY) based on the current century. If \<Z\> is missing, it is defaulted to the offset of the local timezone. \<Z\> must always include a sign symbol (negative or positive). |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.TimeChange",
      "parameters": [
        {
          "key": "DateTime",
          "value": "2038-01-01T03:14:07"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Kill process

| Property | Value  |
|-|-|
| Fault Provider (agent-based) | ChaosAgent |
| Supported OS Types | Windows, Linux |
| Description | Kills all the running instances of a process that matches the process name sent in the fault parameters. Within the duration set for the fault action, a process is killed repetitively based on the value of the kill interval specified. This fault is a destructive fault where system admin would need to manually recover the process if self-healing is configured for it. |
| Prerequisites | None. |
| Name | urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.KillProcessFault |
| Parameters (key, value) |  |
| ProcessName | Name of a process running on a VM (without the .exe) |
| KillIntervalInMillis | Integer representing the number of milliseconds the fault will wait in between successive kill attempts. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.KillProcessFault",
      "parameters": [
        {
          "key": "ProcessName",
          "value": "myapp"
        },
        {
          "key": "KillIntervalInMillis",
          "value": "100"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## DNS failure

| Property | Value  |
|-|-|
| Fault Provider (agent-based) | ChaosAgent |
| Supported OS Types | Windows |
| Description | Substitutes the response of a DNS lookup request with a specified error code. |
| Prerequisites | None. |
| Name | urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.DNS.Failure |
| Parameters (key, value) |  |
| NamesJson | Delimited JSON array of host names to fail DNS lookup request for. |
| ReturnCode | DNS error code to be returned to the client for the lookup failure (FormErr, ServFail, NXDomain, NotImp, Refused, XDomain, YXRRSet, NXRRSet, NotAuth, NotZone). For more details on DNS return codes, visit [here](https://www.iana.org/assignments/dns-parameters/dns-parameters.xml#dns-parameters-6) |

### Sample DNS failure JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.Dns.Failure",
      "parameters": [
        {
          "key": "NamesJson",
          "value": "[ \"www.bing.com\", \"msdn.microsoft.com\" ]"
        },
        {
          "key": "ReturnCode",
          "value": "ServFail"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

### DNS failure limitations

* The Windows Chaos Studio Agent must be 1.0.01685.227 (released on 08/12/21) or *newer*.
  * To update the Chaos Studio Agent, rerun the [Install the Chaos Agent](https://pppdocs.azurewebsites.net/ChaosEngineering/Onboarding/create_experiment_agent_fault.html#install-the-chaos-agent) adding **--force-update** at the end of the **az vm extension set** command.
* The DNS Failure fault requires Windows 2019 RS5 or newer.
* DNS Cache will be ignored during the duration of the fault for the host names defined in the fault.

## Network latency

| Property | Value  |
|-|-|
| Fault Provider (agent-based) | ChaosAgent |
| Supported OS Types | Windows |
| Description | Increases network latency for a specified port range and network block. |
| Prerequisites | Agent must be run as administrator. If the agent is installed as a VM extension, it is run as administrator by default. |
| Name | urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.Network.Latency |
| Parameters (key, value) |  |
| LatencyMilliseconds | Amount of latency to be applied in milliseconds. |
| DestinationFiltersJson | Delimited JSON array of packet filters defining which outbound packets to target for fault injection. Maximum of 3. |
| Address | IP address indicating the start of the IP range. |
| SubnetMask | Subnet mask for the IP address range. |
| (Optional) PortLow | Port number of the start of the port range. |
| (Optional) PortHigh | Port number of the end of the port range. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.Network.Latency",
      "parameters": [
        {
          "key": "DestinationFiltersJson",
          "value": "[ { \"Address\": \"23.45.229.97\", \"SubnetMask\": \"255.255.255.224\", \"PortLow\": \"5000\", \"PortHigh\": \"5200\" } ]"
        },
        {
          "key": "LatencyMilliseconds",
          "value": "100",
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Network disconnect

| Property | Value  |
|-|-|
| Fault Provider (agent-based) | ChaosAgent |
| Supported OS Types | Windows |
| Description | Blocks outbound network traffic for specified port range and network block. |
| Prerequisites | Agent must be run as administrator. If the agent is installed as a VM extension, it is run as administrator by default. |
| Name | urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.Disconnect |
| Parameters (key, value) |  |
| DestinationFiltersJson | Delimited JSON array of packet filters defining which outbound packets to target for fault injection. Maximum of 3. |
| Address | IP address indicating the start of the IP range. |
| SubnetMask | Subnet mask for the IP address range. |
| (Optional) PortLow | Port number of the start of the port range. |
| (Optional) PortHigh | Port number of the end of the port range. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.Network.Disconnect",
      "parameters": [
        {
          "key": "DestinationFiltersJson",
          "value": "[ { \"Address\": \"23.45.229.97\", \"SubnetMask\": \"255.255.255.224\", \"PortLow\": \"5000\", \"PortHigh\": \"5200\" } ]"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

> [!WARNING]
> The network disconnect fault only affects new connections. Existing **active** connections continue to persist. You can restart the service or process to force connections to break.

## Network disconnect with firewall rule

| Property | Value  |
|-|-|
| Fault Provider (agent-based) | ChaosAgent |
| Supported OS Types | Windows |
| Description | Applies a Windows firewall rule to block outbound traffic for specified port range and network block. |
| Prerequisites | Agent must be run as administrator. If the agent is installed as a VM extension, it is run as administrator by default. |
| Name | urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.Network.DisconnectViaFirewall |
| Parameters (key, value) |  |
| DestinationFiltersJson | Delimited JSON array of packet filters defining which outbound packets to target for fault injection. Maximum of 3. |
| Address | IP address indicating the start of the IP range. |
| SubnetMask | Subnet mask for the IP address range. |
| (Optional) PortLow | Port number of the start of the port range. |
| (Optional) PortHigh | Port number of the end of the port range. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:provider:agent-v2:Microsoft.Azure.Chaos.Fault.Network.DisconnectViaFirewall",
      "parameters": [
        {
          "key": "DestinationFiltersJson",
          "value": "[ { \"Address\": \"23.45.229.97\", \"SubnetMask\": \"255.255.255.224\", \"PortLow\": \"5000\", \"PortHigh\": \"5200\" } ]"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## VM shutdown (Azure Resource Manager)
| Property | Value  |
|-|-|
| Fault Provider (service-direct) | AzureVmChaos |
| Supported OS Types | Windows, Linux |
| Description | Shuts down a VM for the duration of the fault and optionally restarts the VM at the end of the fault duration or if the experiment is canceled. Only Azure Resource Manager VMs are supported. |
| Prerequisites | None. |
| Name | urn:provider:Azure-virtualMachine:Microsoft.Azure.Chaos.Fault.AzureVmShutdown |
| Parameters (key, value) |  |
| skipShutdown | Boolean indicating if the VM should be shut down gracefully or abruptly (destructive). |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:provider:Azure-virtualMachine:Microsoft.Azure.Chaos.Fault.AzureVmShutdown",
      "parameters": [
        {
          "key": "skipShutdown",
          "value": "false"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Virtual machine scale set instance shutdown (Azure Resource Manager)

| Property | Value  |
|-|-|
| Fault Provider (service-direct) | AzureVmssVmChaos |
| Supported OS Types | Windows, Linux |
| Description | Shuts down or kill a virtual machine scale set instance for the duration of the fault and optionally restarts the VM at the end of the fault duration or if the experiment is canceled. Virtual machine scale set instances are supported as are Service Fabric VMs. |
| Prerequisites | None. |
| Name | urn:provider:Azure-virtualMachineScaleSetVM:Microsoft.Azure.Chaos.Fault.AzureVmssVmShutdown |
| Parameters (key, value) |  |
| skipShutdown | Boolean indicating if the virtual machine scale set instance should be shut down gracefully or abruptly (destructive). |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:provider:Azure-virtualMachineScaleSetVM:Microsoft.Azure.Chaos.Fault.AzureVmssVmShutdown",
      "parameters": [
        {
          "key": "skipShutdown",
          "value": "true"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Cosmos DB failover

| Property | Value  |
|-|-|
| Fault Provider (service-direct) | AzureCosmosDbChaos |
| Description | Causes a Cosmos DB account with a single write region to fail over to a specified read region in order to simulate a [write region outage](../cosmos-db/high-availability.md#multi-region-accounts-with-a-single-write-region-write-region-outage) |
| Prerequisites | None. |
| Name | urn:provider:Azure-cosmosDb:Microsoft.Azure.Chaos.Fault.AzureCosmosDbFailover |
| Parameters (key, value) |  |
| ReadRegion | The read region that should be promoted to write region during the failover, for example "East US 2" |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:provider:Azure-cosmosDb:Microsoft.Azure.Chaos.Fault.AzureCosmosDbFailover",
      "parameters": [
        {
          "key": "ReadRegion",
          "value": "West US 2"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Network Security Group (set rules)

| Property | Value  |
|-|-|
| Fault Provider (service-direct) | AzureNetworkSecurityGroupChaos |
| Description | Enables manipulation or creation of a rule in an existing Azure Network Security Group or set of Azure Network Security Groups (assuming the rule definition is applicable cross security groups). Useful for simulating an outage of a downstream or cross-region dependency/non-dependency, simulating an event that is expected to trigger a logic to force a service failover, simulating an event that is expected to trigger an action from a monitoring or state management service, or as an alternative for blocking, or allowing, network traffic where Chaos Agent cannot be deployed. |
| Prerequisites | None. |
| Name | urn:provider:Azure-networkSecurityGroup:Microsoft.Azure.Chaos.Fault.AzureNetworkSecurityGroupSetRule |
| Parameters (key, value) |  |
| Name | A unique name for the security rule that will be created. The fault will fail if another rule already exists on the NSG with the same name. Must begin with a letter or number, end with a letter, number or underscore, and may contain only letters, numbers, underscores, periods, or hyphens. |
| Protocol | Protocol for the security rule. Must be Any, TCP, UDP, or ICMP. |
| SourceAddressPrefix *or* SourceAddressPrefixes | A single CIDR formatted IP address or a comma-delimited CIDR formatted list of IP addresses. Can also be a service tag name for an inbound rule, for example "AppService". |
| DestinationAddressPrefix *or* DestinationAddressPrefixes | A single CIDR formatted IP address or a comma-delimited list of CIDR formatted IP addresses. Can also be a service tag name for an outbound rule, for example "AppService". |
| Access | Security group access type. Must be either Allow or Deny |
| DestinationPortRange | The destination port(s) or range of ports impacted by the security rule. Can be a single port, such as 80, a range of ports, such as 1024-65535, a comma-separated list of single ports and/or port ranges, such as 80, 1024-65535, or an asterisk (*) to allow traffic on any port. |
| SourcePortRange | The source port(s) or range of ports impacted by the security rule. Can be a single port, such as 80, a range of ports, such as 1024-65535, a comma-separated list of single ports and/or port ranges, such as 80, 1024-65535, or an asterisk (*) to allow traffic on any port. |
| Priority | A value between 100 and 4096 that's unique for all security rules within the network security group. The fault will fail if another rule already exists on the NSG with the same priority. |
| Direction | Direction of the traffic impacted by the security rule. Must be either Inbound or Outbound. |

### Sample JSON

```json
{ 
  "name": "branchOne", 
  "actions": [ 
    { 
      "type": "continuous", 
      "name": "urn:provider:Azure-networkSecurityGroup:Microsoft.Azure.Chaos.Fault.AzureNetworkSecurityGroupSetRule", 
      "parameters": [ 
          { 
              "key": "Name", 
              "value": "Block_SingleHost_to_Networks" 

          }, 
          { 
              "key": "Protocol", 
              "value": "Any" 
          }, 
          { 
              "key": "SourceAddressPrefix", 
              "value": "10.1.1.128/32" 
          }, 
          { 
              "key": "DestinationAddressPrefixes", 
              "value": "10.20.0.0/16,10.30.0.0/16" 
          }, 
          { 
              "key": "Access", 
              "value": "Deny" 
          }, 
          { 
              "key": "DestinationPortRange", 
              "value": "80-8080" 
          }, 
          { 
              "key": "SourcePortRange", 
              "value": "*" 
          }, 
          { 
              "key": "Priority", 
              "value": "100" 
          }, 
          { 
              "key": "Direction", 
              "value": "Outbound" 
          } 
      ], 
      "duration": "PT10M", 
      "selectorid": "myResources" 
    } 
  ] 
} 
```

### Limitations

* The fault can only be applied to an existing Network Security Group.
* When an NSG rule that is intended to deny traffic is applied existing connections will not be broken until they have been **idle** for 4 minutes. You can resolve this by adding another branch in the same step that uses a fault that would cause existing connections to break when the NSG fault is applied. For example, killing the process, temporarily stopping the service, or restarting the VM would cause connections to reset.
* Rules are applied at the start of the action. Any external changes to the rule during the duration of the action will cause the experiment to fail.
* Creating or modifying Application Security Group rules is not supported.
* Priority values must be unique on each NSG targeted. Attempting to create a new rule that has the same priority value as another will cause the experiment to fail.
