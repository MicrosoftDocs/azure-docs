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

|  |  |
|-|-|
| Fault Provider | N/A |
| Supported OS Types | N/A |
| Description | Adds a time delay before, between, or after other actions. Useful for waiting for the impact of a fault to appear in a service or for waiting for an activity outside of the experiment to complete (e.g. waiting for auto-healing to occur before injecting another fault). |
| Prerequisites | N/A |
| Urn | urn:provider:Azure-chaosStudio:Microsoft.Azure.Chaos.Delay.Timed |
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

|  |  |
|-|-|
| Capability Name | CPUPressure-1.0 |
| Target type | Microsoft-Agent |
| Supported OS Types | Windows, Linux |
| Description | Add CPU pressure up to the specified value on the VM where this fault is injected for the duration of the fault action. The artificial CPU pressure is removed at the end of the duration or if the experiment is canceled. |
| Prerequisites | **Linux:** Running the fault on a Linux VM requires the **stress-ng** utility to be installed. You can install it using the package manager for your Linux distro, </br> APT Command to install stress-ng: *sudo apt-get update && sudo apt-get -y install unzip && sudo apt-get -y install stress-ng* </br> YUM Command to install stress-ng: *sudo dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm && sudo yum -y install stress-ng*  |
| | **Windows:** None. |
| Urn | urn:csci:microsoft:agent:cpuPressure/1.0 |
| Parameters (key, value)  |
| pressureLevel | An integer between 1 and 99 that indicates how much CPU pressure (%) will be applied to the VM. |
| virtualMachineScaleSetInstances | (Optional) An array of instance IDs when applying this fault to a VMSS |

### Sample JSON
```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:agent:cpuPressure/1.0",
      "parameters": [
        {
          "key": "pressureLevel",
          "value": "95"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

### Notes
Known issues on Linux:
1. Stress effect may not be terminated correctly if AzureChaosAgent is unexpectedly killed.
2. Linux CPU fault is only tested on Ubuntu 16.04-LTS and Ubuntu 18.04-LTS.

## Physical memory pressure

|  |  |
|-|-|
| Capability Name | PhysicalMemoryPressure-1.0 |
| Target type | Microsoft-Agent |
| Supported OS Types | Windows, Linux |
| Description | Add physical memory pressure up to the specified value on the VM where this fault is injected for the duration of the fault action. The artificial physical memory pressure is removed at the end of the duration or if the experiment is canceled. |
| Prerequisites | **Linux:** Running the fault on a Linux VM requires the **stress-ng** utility to be installed. You can install it using the package manager for your Linux distro, </br> APT Command to install stress-ng: *sudo apt-get update && sudo apt-get -y install unzip && sudo apt-get -y install stress-ng* </br> YUM Command to install stress-ng: *sudo dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm && sudo yum -y install stress-ng*  |
| | **Windows:** None. |
| Urn | urn:csci:microsoft:agent:physicalMemoryPressure/1.0 |
| Parameters (key, value) |  |
| pressureLevel | An integer between 1 and 99 that indicates how much physical memory pressure (%) will be applied to the VM. |
| virtualMachineScaleSetInstances | (Optional) An array of instance IDs when applying this fault to a VMSS |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:agent:physicalMemoryPressure/1.0",
      "parameters": [
        {
          "key": "pressureLevel",
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

|  |  |
|-|-|
| Capability Name | VirtualMemoryPressure-1.0 |
| Target type | Microsoft-Agent |
| Supported OS Types | Windows |
| Description | Add virtual memory pressure up to the specified value on the VM where this fault is injected for the duration of the fault action. The artificial virtual memory pressure is removed at the end of the duration or if the experiment is canceled. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:agent:virtualMemoryPressure/1.0 |
| Parameters (key, value) |  |
| pressureLevel | An integer between 1 and 99 that indicates how much physical memory pressure (%) will be applied to the VM. |
| virtualMachineScaleSetInstances | (Optional) An array of instance IDs when applying this fault to a VMSS |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:agent:virtualMemoryPressure/1.0",
      "parameters": [
        {
          "key": "pressureLevel",
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

|  |  |
|-|-|
| Capability Name | DiskIOPressure-1.0 |
| Target type | Microsoft-Agent |
| Supported OS Types | Windows |
| Description | Uses the [diskspd utility](https://github.com/Microsoft/diskspd/wiki) to add disk pressure to the primary storage of the VM where it is injected for the duration of the fault action. This fault has 5 different modes of execution. The artificial disk pressure is removed at the end of the duration or if the experiment is canceled. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:agent:diskIOPressure/1.0 |
| Parameters (key, value) |  |
| pressureMode | The preset mode of disk pressure to add to the primary storage of the VM. Must be one of the PressureModes in the table below. |
| virtualMachineScaleSetInstances | (Optional) An array of instance IDs when applying this fault to a VMSS |

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
      "name": "urn:csci:microsoft:agent:diskIOPressure/1.0",
      "parameters": [
        {
          "key": "pressureMode",
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

|  |  |
|-|-|
| Capability Name | LinuxDiskIOPressure-1.0 |
| Target type | Microsoft-Agent |
| Supported OS Types | Linux |
| Description | Uses stress-ng to apply pressure to the disk. One or more worker processes are spawned that perform I/O processes with temporary files. For details on how pressure is applied please see https://wiki.ubuntu.com/Kernel/Reference/stress-ng . |
| Prerequisites | Running the fault on a Linux VM requires the **stress-ng** utility to be installed. You can install it using the package manager for your Linux distro, </br> APT Command to install stress-ng: *sudo apt-get update && sudo apt-get -y install unzip && sudo apt-get -y install stress-ng* </br> YUM Command to install stress-ng: *sudo dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm && sudo yum -y install stress-ng* |
| Urn | urn:csci:microsoft:agent:linuxDiskIOPressure/1.0 |
| Parameters (key, value) |  |
| workerCount | Number of worker processes to run. Setting this to 0 will generate as many worker processes as there are number of processors. |
| fileSizePerWorker | Size of the temporary file a worker will perform I/O operations against. Integer plus a unit in (b)ytes, (k)ilobytes, (m)egabytes, or (g)igabytes (e.g. 4m for 4 megabytes, 256g for 256 gigabytes) |
| blockSize | Block size to be used for disk I/O operations, capped at 4 megabytes. Integer plus a unit in (b)ytes, (k)ilobytes, or (m)egabytes (e.g. 512k for 512 kilobytes) |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:agent:linuxDiskIOPressure/1.0",
      "parameters": [
        {
          "key": "workerCount",
          "value": "0"
        },
        {
          "key": "fileSizePerWorker",
          "value": "512m"
        },
        {
          "key": "blockSize",
          "value": "256k"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Arbitrary Stress-ng stressor

|  |  |
|-|-|
| Capability Name | StressNg-1.0 |
| Target type | Microsoft-Agent |
| Supported OS Types | Linux |
| Description | Run any stress-ng command by passing arguments directly to stress-ng. Useful for when one of the pre-defined faults for stress-ng doesn't meet your needs. |
| Prerequisites | Running the fault on a Linux VM requires the **stress-ng** utility to be installed. You can install it using the package manager for your Linux distro, </br> APT Command to install stress-ng: *sudo apt-get update && sudo apt-get -y install unzip && sudo apt-get -y install stress-ng* </br> YUM Command to install stress-ng: *sudo dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm && sudo yum -y install stress-ng* |
| Urn | urn:csci:microsoft:agent:stressNg/1.0 |
| Parameters (key, value) |  |
| stressNgArguments | One or more arguments to pass to the stress-ng process. For details on possible stress-ng arguments see https://wiki.ubuntu.com/Kernel/Reference/stress-ng |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:agent:stressNg/1.0",
      "parameters": [
        {
          "key": "stressNgArguments",
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

|  |  |
|-|-|
| Capability Name | StopService-1.0 |
| Target type | Microsoft-Agent |
| Supported OS Types | Windows |
| Description | Uses the Windows Service Controller APIs to stop a Windows service for the duration of the fault, restarting it at the end of the duration or if the experiment is canceled. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:agent:stopService/1.0 |
| Parameters (key, value) |  |
| serviceName | The name of the Windows service you want to stop. You can run `sc.exe query` in command prompt to explore service names, Windows service friendly names are not supported. |
| virtualMachineScaleSetInstances | (Optional) An array of instance IDs when applying this fault to a VMSS |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:agent:stopService/1.0",
      "parameters": [
        {
          "key": "serviceName",
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

|  |  |
|-|-|
| Capability Name | TimeChange-1.0 |
| Target type | Microsoft-Agent |
| Supported OS Types | Windows |
| Description | Changes the system time for the VM where it is injected and resets it at the end of the duration or if the experiment is canceled. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:agent:timeChange/1.0 |
| Parameters (key, value) |  |
| dateTime | A DateTime string in [ISO8601 format](https://www.cryptosys.net/pki/manpki/pki_iso8601datetime.html). If YYYY-MM-DD values are missing, these are defaulted to the current day when the experiment runs. If Thh:mm:ss values are missing, the default value is 12:00:00 AM. If a 2-digit year is provided (YY) it is converted to a 4-digit year (YYYY) based on the current century. If \<Z\> is missing, it is defaulted to the offset of the local timezone. \<Z\> must always include a sign symbol (negative or positive). |
| virtualMachineScaleSetInstances | (Optional) An array of instance IDs when applying this fault to a VMSS |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:agent:timeChange/1.0",
      "parameters": [
        {
          "key": "dateTime",
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

|  |  |
|-|-|
| Capability Name | KillProcess-1.0 |
| Target type | Microsoft-Agent |
| Supported OS Types | Windows, Linux |
| Description | Kills all the running instances of a process that matches the process name sent in the fault parameters. Within the duration set for the fault action, a process is killed repetitively based on the value of the kill interval specified. This fault is a destructive fault where system admin would need to manually recover the process if self-healing is configured for it. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:agent:killProcess/1.0 |
| Parameters (key, value) |  |
| processName | Name of a process running on a VM (without the .exe) |
| killIntervalInMilliseconds | Amount of time the fault will wait in between successive kill attempts in milliseconds. |
| virtualMachineScaleSetInstances | (Optional) An array of instance IDs when applying this fault to a VMSS |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:agent:killProcess/1.0",
      "parameters": [
        {
          "key": "processName",
          "value": "myapp"
        },
        {
          "key": "killIntervalInMilliseconds",
          "value": "1000"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## DNS failure

|  |  |
|-|-|
| Capability Name | DnsFailure-1.0 |
| Target type | Microsoft-Agent |
| Supported OS Types | Windows |
| Description | Substitutes the response of a DNS lookup request with a specified error code. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:agent:dnsFailure/1.0 |
| Parameters (key, value) |  |
| hosts | Delimited JSON array of host names to fail DNS lookup request for. |
| dnsFailureReturnCode | DNS error code to be returned to the client for the lookup failure (FormErr, ServFail, NXDomain, NotImp, Refused, XDomain, YXRRSet, NXRRSet, NotAuth, NotZone). For additional details on DNS return codes please visit [here](https://www.iana.org/assignments/dns-parameters/dns-parameters.xml#dns-parameters-6) |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:agent:dnsFailure/1.0",
      "parameters": [
        {
          "key": "hosts",
          "value": "[ \"www.bing.com\", \"msdn.microsoft.com\" ]"
        },
        {
          "key": "dnsFailureReturnCode",
          "value": "ServFail"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

### Limitations

* The Windows Chaos Studio Agent must be 1.0.01685.227 (released on 08/12/21) or *newer*.
  * To update the Chaos Studio Agent simply re-run the [Install the Chaos Agent](https://pppdocs.azurewebsites.net/ChaosEngineering/Onboarding/create_experiment_agent_fault.html#install-the-chaos-agent) adding **--force-update** at the end of the **az vm extension set** command.
* The DNS Failure fault requires Windows 2019 RS5 or newer.
* DNS Cache will be ignored during the duration of the fault for the host names defined in the fault. *NOTE: Ignoring the DNS cache will be a optional feature in a future release*

## Network latency

|  |  |
|-|-|
| Capability Name | NetworkLatency-1.0 |
| Target type | Microsoft-Agent |
| Supported OS Types | Windows |
| Description | Increases network latency for a specified port range and network block. |
| Prerequisites | Agent must be run as administrator. If the agent is installed as a VM extension it is run as administrator by default. |
| Urn | urn:csci:microsoft:agent:networkLatency/1.0 |
| Parameters (key, value) |  |
| latencyInMilliseconds | Amount of latency to be applied in milliseconds. |
| destinationFilters | Delimited JSON array of packet filters defining which outbound packets to target for fault injection. Maximum of 3. |
| address | IP address indicating the start of the IP range. |
| subnetMask | Subnet mask for the IP address range. |
| portLow | (Optional) Port number of the start of the port range. |
| portHigh | (Optional) Port number of the end of the port range. |
| virtualMachineScaleSetInstances | (Optional) An array of instance IDs when applying this fault to a VMSS |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:agent:networkLatency/1.0",
      "parameters": [
        {
          "key": "destinationFilters",
          "value": "[ { \"address\": \"23.45.229.97\", \"subnetMask\": \"255.255.255.224\", \"portLow\": \"5000\", \"portHigh\": \"5200\" } ]"
        },
        {
          "key": "latencyInMilliseconds",
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

|  |  |
|-|-|
| Capability Name | NetworkDisconnect-1.0 |
| Target type | Microsoft-Agent |
| Supported OS Types | Windows |
| Description | Blocks outbound network traffic for specified port range and network block. |
| Prerequisites | Agent must be run as administrator. If the agent is installed as a VM extension it is run as administrator by default. |
| Urn | urn:csci:microsoft:agent:networkDisconnect/1.0 |
| Parameters (key, value) |  |
| destinationFilters | Delimited JSON array of packet filters defining which outbound packets to target for fault injection. Maximum of 3. |
| address | IP address indicating the start of the IP range. |
| subnetMask | Subnet mask for the IP address range. |
| portLow | (Optional) Port number of the start of the port range. |
| portHigh | (Optional) Port number of the end of the port range. |
| virtualMachineScaleSetInstances | (Optional) An array of instance IDs when applying this fault to a VMSS |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:agent:networkDisconnect/1.0",
      "parameters": [
        {
          "key": "destinationFilters",
          "value": "[ { \"address\": \"23.45.229.97\", \"subnetMask\": \"255.255.255.224\", \"portLow\": \"5000\", \"portHigh\": \"5200\" } ]"
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

|  |  |
|-|-|
| Capability Name | NetworkDisconnectViaFirewall-1.0 |
| Target type | Microsoft-Agent |
| Supported OS Types | Windows |
| Description | Applies a Windows firewall rule to block outbound traffic for specified port range range and network block. |
| Prerequisites | Agent must be run as administrator. If the agent is installed as a VM extension it is run as administrator by default. |
| Urn | urn:csci:microsoft:agent:networkDisconnectViaFirewall/1.0 |
| Parameters (key, value) |  |
| destinationFilters | Delimited JSON array of packet filters defining which outbound packets to target for fault injection. Maximum of 3. |
| address | IP address indicating the start of the IP range. |
| subnetMask | Subnet mask for the IP address range. |
| portLow | (Optional) Port number of the start of the port range. |
| portHigh | (Optional) Port number of the end of the port range. |
| virtualMachineScaleSetInstances | (Optional) An array of instance IDs when applying this fault to a VMSS |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:agent:networkDisconnectViaFirewall/1.0",
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

## ARM virtual machine shutdown
|  |  |
|-|-|
| Capability Name | Shutdown-1.0 |
| Target type | Microsoft-VirtualMachine |
| Supported OS Types | Windows, Linux |
| Description | Shuts down a VM for the duration of the fault and optionally restarts the VM at the end of the fault duration or if the experiment is canceled. Only Azure Resource Manager VMs are supported. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:virtualMachine:shutdown/1.0 |
| Parameters (key, value) |  |
| abruptShutdown | (Optional) Boolean indicating if the VM should be shutdown gracefully or abruptly (destructive). |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:virtualMachine:shutdown/1.0",
      "parameters": [
        {
          "key": "abruptShutdown",
          "value": "false"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## ARM virtual machine scale set instance shutdown

|  |  |
|-|-|
| Capability Name | Shutdown-1.0 |
| Target type | Microsoft-VirtualMachineScaleSet |
| Supported OS Types | Windows, Linux |
| Description | Shuts down or kill a VMSS VM for the duration of the fault and optionally restarts the VM at the end of the fault duration or if the experiment is canceled. VMSS VMs are supported as are Service Fabric VMs. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:virtualMachineScaleSet:shutdown/1.0 |
| Parameters (key, value) |  |
| abruptShutdown | (Optional) Boolean indicating if the VMSS instance should be shutdown gracefully or abruptly (destructive). |
| instances | An array of VMSS instance IDs to which the fault will be applied. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:virtualMachineScaleSet:shutdown/1.0",
      "parameters": [
        {
          "key": "abruptShutdown",
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

|  |  |
|-|-|
| Capability Name | Failover-1.0 |
| Target type | Microsoft-CosmosDB |
| Description | Causes a Cosmos DB account with a single write region to fail over to a specified read region in order to simulate a [write region outage](https://docs.microsoft.com/azure/cosmos-db/high-availability#multi-region-accounts-with-a-single-write-region-write-region-outage) |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:cosmosDB:failover/1.0 |
| Parameters (key, value) |  |
| readRegion | The read region that should be promoted to write region during the failover, e.g. "East US 2" |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:cosmosDB:failover/1.0",
      "parameters": [
        {
          "key": "readRegion",
          "value": "West US 2"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## AKS Chaos Mesh network faults

|  |  |
|-|-|
| Capability Name | NetworkChaos-1.0 |
| Target type | Microsoft-AzureKubernetesServiceChaosMesh |
| Description | Causes a network fault available through [Chaos Mesh](https://chaos-mesh.org/docs/1.2.3/chaos_experiments/networkchaos_experiment) to run against your AKS cluster. Useful for recreating AKS incidents resulting from network outages, delays, duplications, loss, and corruption. |
| Prerequisites | The AKS cluster must [have version 1.2.3 or earlier of Chaos Mesh deployed and have AKS-managed AAD disabled](./Onboarding/create_experiment_aks.md). |
| Urn | urn:csci:microsoft:azureKubernetesServiceChaosMesh:networkChaos/1.0 |
| Parameters (key, value) |  |
| jsonSpec | A JSON-formatted and escaped [Chaos Mesh spec](https://chaos-mesh.org/docs/user_guides/run_chaos_experiment#step-2-define-the-experiment-configuration-file) that uses the [NetworkChaos kind](https://chaos-mesh.org/docs/1.2.3/chaos_experiments/networkchaos_experiment). You can use a [YAML-to-JSON converter like this one](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minify it and use a [JSON string escape tool like this one](https://www.freeformatter.com/json-escape.html) to escape the JSON spec. Only include the YAML under the "jsonSpec" property (do not include metadata, kind, etc). |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:networkChaos/1.0",
      "parameters": [
        {
            "key": "jsonSpec",
            "value": "{\"action\":\"delay\",\"delay\":{\"latency\":\"30s\"},\"duration\":\"30s\",\"mode\":\"one\",\"scheduler\":{\"cron\":\"@every 60s\"},\"selector\":{\"labelSelectors\":{\"app\":\"web-show\"}}}"
        }
    ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## AKS Chaos Mesh pod faults

|  |  |
|-|-|
| Capability Name | PodChaos-1.0 |
| Target type | Microsoft-AzureKubernetesServiceChaosMesh |
| Description | Causes a pod fault available through [Chaos Mesh](https://chaos-mesh.org/docs/1.2.3/chaos_experiments/podchaos_experiment) to run against your AKS cluster. Useful for recreating AKS incidents that are a result of pod failures or container issues. |
| Prerequisites | The AKS cluster must [have version 1.2.3 or earlier of Chaos Mesh deployed and have AKS-managed AAD disabled](./Onboarding/create_experiment_aks.md). |
| Urn | urn:csci:microsoft:azureKubernetesServiceChaosMesh:podChaos/1.0 |
| Parameters (key, value) |  |
| jsonSpec | A JSON-formatted and escaped [Chaos Mesh spec](https://chaos-mesh.org/docs/user_guides/run_chaos_experiment#step-2-define-the-experiment-configuration-file) that uses the [PodChaos kind](https://chaos-mesh.org/docs/1.2.3/chaos_experiments/podchaos_experiment#pod-failure-configuration-file). You can use a [YAML-to-JSON converter like this one](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minify it, and use a [JSON string escape tool like this one](https://www.freeformatter.com/json-escape.html) to escape the JSON spec. Only include the YAML under the "jsonSpec" property (do not include metadata, kind, etc). |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:podChaos/1.0",
      "parameters": [
        {
            "key": "jsonSpec",
            "value": "{\"action\":\"pod-failure\",\"mode\":\"one\",\"value\":\"\",\"duration\":\"30s\",\"selector\":{\"labelSelectors\":{\"app.kubernetes.io\/component\":\"tikv\"}},\"scheduler\":{\"cron\":\"@every 2m\"}}"
        }
    ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## AKS Chaos Mesh stress faults

|  |  |
|-|-|
| Capability Name | StressChaos-1.0 |
| Target type | Microsoft-AzureKubernetesServiceChaosMesh |
| Description | Causes a stress fault available through [Chaos Mesh](https://chaos-mesh.org/docs/1.2.3/chaos_experiments/stresschaos_experiment) to run against your AKS cluster. Useful for recreating AKS incidents due to stresses over a collection of pods, e.g. due to high CPU or memory consumption. |
| Prerequisites | The AKS cluster must [have version 1.2.3 or earlier of Chaos Mesh deployed and have AKS-managed AAD disabled](./Onboarding/create_experiment_aks.md). |
| Urn | urn:csci:microsoft:azureKubernetesServiceChaosMesh:stressChaos/1.0 |
| Parameters (key, value) |  |
| jsonSpec | A JSON-formatted and escaped [Chaos Mesh spec](https://chaos-mesh.org/docs/user_guides/run_chaos_experiment#step-2-define-the-experiment-configuration-file) that uses the [StressChaos kind](https://chaos-mesh.org/docs/1.2.3/chaos_experiments/stresschaos_experiment#configuration). You can use a [YAML-to-JSON converter like this one](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minify it, and use a [JSON string escape tool like this one](https://www.freeformatter.com/json-escape.html) to escape the JSON spec. Only include the YAML under the "jsonSpec" property (do not include metadata, kind, etc). |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:stressChaos/1.0",
      "parameters": [
        {
            "key": "jsonSpec",
            "value": "{\"mode\":\"one\",\"selector\":{\"namespaces\":[\"tidb-cluster-demo\"]},\"stressors\":{\"cpu\":{\"workers\":1}},\"duration\":\"30s\",\"scheduler\":{\"cron\":\"@every 2m\"}}"
        }
    ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## AKS Chaos Mesh IO faults

|  |  |
|-|-|
| Capability Name | IOChaos-1.0 |
| Target type | Microsoft-AzureKubernetesServiceChaosMesh |
| Description | Causes an IO fault available through [Chaos Mesh](https://chaos-mesh.org/docs/1.2.3/chaos_experiments/iochaos_experiment) to run against your AKS cluster. Useful for recreating AKS incidents due to IO delays and read/write failures when using IO system calls such as `open`, `read`, and `write`. |
| Prerequisites | The AKS cluster must [have version 1.2.3 or earlier of Chaos Mesh deployed and have AKS-managed AAD disabled](./Onboarding/create_experiment_aks.md). |
| Urn | urn:csci:microsoft:azureKubernetesServiceChaosMesh:IOChaos/1.0 |
| Parameters (key, value) |  |
| jsonSpec | A JSON-formatted and escaped [Chaos Mesh spec](https://chaos-mesh.org/docs/user_guides/run_chaos_experiment#step-2-define-the-experiment-configuration-file) that uses the [IOChaos kind](https://chaos-mesh.org/docs/1.2.3/chaos_experiments/iochaos_experiment#configuration-file). You can use a [YAML-to-JSON converter like this one](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minify it, and use a [JSON string escape tool like this one](https://www.freeformatter.com/json-escape.html) to escape the JSON spec. Only include the YAML under the "jsonSpec" property (do not include metadata, kind, etc). |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:IOChaos/1.0",
      "parameters": [
        {
            "key": "jsonSpec",
            "value": "{\"action\":\"latency\",\"mode\":\"one\",\"selector\":{\"labelSelectors\":{\"app\":\"etcd\"}},\"volumePath\":\"\/var\/run\/etcd\",\"path\":\"\/var\/run\/etcd\/**\/*\",\"delay\":\"100ms\",\"percent\":50,\"duration\":\"400s\",\"scheduler\":{\"cron\":\"@every 10m\"}}"
        }
    ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## AKS Chaos Mesh time faults

|  |  |
|-|-|
| Capability Name | TimeChaos-1.0 |
| Target type | Microsoft-AzureKubernetesServiceChaosMesh |
| Description | Causes a change in the system clock on your AKS cluster using  [Chaos Mesh](https://chaos-mesh.org/docs/1.2.3/chaos_experiments/timechaos_experiment). Useful for recreating AKS incidents that result from distributed systems falling out of sync, missing/incorrect leap year/leap second logic, and more. |
| Prerequisites | The AKS cluster must [have version 1.2.3 or earlier of Chaos Mesh deployed and have AKS-managed AAD disabled](./Onboarding/create_experiment_aks.md). |
| Urn | urn:csci:microsoft:azureKubernetesServiceChaosMesh:timeChaos/1.0 |
| Parameters (key, value) |  |
| jsonSpec | A JSON-formatted and escaped [Chaos Mesh spec](https://chaos-mesh.org/docs/user_guides/run_chaos_experiment#step-2-define-the-experiment-configuration-file) that uses the [TimeChaos kind](https://chaos-mesh.org/docs/1.2.3/chaos_experiments/timechaos_experiment#configuration-file). You can use a [YAML-to-JSON converter like this one](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minify it, and use a [JSON string escape tool like this one](https://www.freeformatter.com/json-escape.html) to escape the JSON spec. Only include the YAML under the "jsonSpec" property (do not include metadata, kind, etc). |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:timeChaos/1.0",
      "parameters": [
        {
            "key": "jsonSpec",
            "value": "{\"mode\":\"one\",\"selector\":{\"labelSelectors\":{\"app.kubernetes.io\/component\":\"pd\"}},\"timeOffset\":\"-10m100ns\",\"clockIds\":[\"CLOCK_REALTIME\"],\"containerNames\":[\"pd\"],\"duration\":\"10s\",\"scheduler\":{\"cron\":\"@every 15s\"}}"
        }
    ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## AKS Chaos Mesh kernel faults

|  |  |
|-|-|
| Capability Name | KernelChaos-1.0 |
| Target type | Microsoft-AzureKubernetesServiceChaosMesh |
| Description | Causes a kernel fault available through [Chaos Mesh](https://chaos-mesh.org/docs/1.2.3/chaos_experiments/kernelchaos_experiment) to run against your AKS cluster. Useful for recreating AKS incidents due to Linux kernel-level errors such as a mount failing or memory not being allocated. |
| Prerequisites | The AKS cluster must [have version 1.2.3 or earlier of Chaos Mesh deployed and have AKS-managed AAD disabled](./Onboarding/create_experiment_aks.md). |
| Urn | urn:csci:microsoft:azureKubernetesServiceChaosMesh:kernelChaos/1.0 |
| Parameters (key, value) |  |
| jsonSpec | A JSON-formatted and escaped [Chaos Mesh spec](https://chaos-mesh.org/docs/user_guides/run_chaos_experiment#step-2-define-the-experiment-configuration-file) that uses the [KernelChaos kind](https://chaos-mesh.org/docs/1.2.3/chaos_experiments/kernelchaos_experiment#configuration-file). You can use a [YAML-to-JSON converter like this one](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minify it, and use a [JSON string escape tool like this one](https://www.freeformatter.com/json-escape.html) to escape the JSON spec. Only include the YAML under the "jsonSpec" property (do not include metadata, kind, etc). |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:kernelChaos/1.0",
      "parameters": [
        {
            "key": "jsonSpec",
            "value": "{\"mode\":\"one\",\"selector\":{\"namespaces\":[\"chaos-mount\"]},\"failKernRequest\":{\"callchain\":[{\"funcname\":\"__x64_sys_mount\"}],\"failtype\":0}}"
        }
    ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Network security group (set rules)

|  |  |
|-|-|
| Capability Name | SecurityRule-1.0 |
| Target type | Microsoft-NetworkSecurityGroup |
| Description | Enables manipulation or creation of a rule in an existing Azure Network Security Group or set of Azure Network Security Groups (assuming the rule definition is applicable cross security groups). Useful for simulating an outage of a downstream or cross-region dependency/non-dependency, simulating an event that is expected to trigger a logic to force a service failover, simulating an event that is expected to trigger an action from a monitoring or state management service, or as an alternative for blocking, or allowing, network traffic where Chaos Agent can not be deployed. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:networkSecurityGroup:securityRule/1.0 |
| Parameters (key, value) |  |
| name | A unique name for the security rule that will be created. The fault will fail if another rule already exists on the NSG with the same name. Must begin with a letter or number, end with a letter, number or underscore, and may contain only letters, numbers, underscores, periods, or hyphens. |
| protocol | Protocol for the security rule. Must be Any, TCP, UDP, or ICMP. |
| sourceAddresses | An array of CIDR formatted IP addresses. Can also be a service tag name for an inbound rule, e.g. "AppService". Asterisk '*' can also be used to match all source IPs. |
| destinationAddresses | An array of CIDR formatted IP addresses. Can also be a service tag name for an outbound rule, e.g. "AppService". Asterisk '*' can also be used to match all destination IPs. |
| action | Security group access type. Must be either Allow or Deny |
| destinationPortRanges | An array of single ports and/or port ranges, such as 80, 1024-65535, or an asterisk (*) to allow traffic on any port. |
| sourcePortRanges | An array single ports and/or port ranges, such as 80, 1024-65535, or an asterisk (*) to allow traffic on any port. |
| priority | A value between 100 and 4096 that's unique for all security rules within the network security group. The fault will fail if another rule already exists on the NSG with the same priority. |
| direction | Direction of the traffic impacted by the security rule. Must be either Inbound or Outbound. |

### Sample JSON

```json
{ 
  "name": "branchOne", 
  "actions": [ 
    { 
      "type": "continuous", 
      "name": "urn:csci:microsoft:networkSecurityGroup:securityRule/1.0", 
      "parameters": [ 
          { 
              "key": "name", 
              "value": "Block_SingleHost_to_Networks" 

          }, 
          { 
              "key": "protocol", 
              "value": "Any" 
          }, 
          { 
              "key": "sourceAddresses", 
              "value": ["10.1.1.128/32"]
          }, 
          { 
              "key": "destinationAddresses", 
              "value": ["10.20.0.0/16","10.30.0.0/16"]
          }, 
          { 
              "key": "access", 
              "value": "Deny" 
          }, 
          { 
              "key": "destinationPortRanges", 
              "value": ["80-8080"]
          }, 
          { 
              "key": "sourcePortRanges", 
              "value": ["*"]
          }, 
          { 
              "key": "priority", 
              "value": "100" 
          }, 
          { 
              "key": "direction", 
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
* When an NSG rule that is intended to deny traffic is applied existing connections will not be broken until they have been **idle** for 4 minutes. One way to work around this is by adding another branch in the same step that uses a fault that would cause existing connections to break when the NSG fault is applied. For example, killing the process, temporarily stopping the service, or restarting the VM would cause connections to reset.
* Rules are applied at the start of the action. Any external changes to the rule during the duration of the action will cause the experiment to fail.
* Creating or modifying Application Security Group rules is not supported.
* Priority values must be unique on each NSG targeted. Attempting to create a new rule that has the same priority value as another will cause the experiment to fail.

## Azure Cache for Redis reboot

|  |  |
|-|-|
| Capability Name | Reboot-1.0 |
| Target type | Microsoft-AzureClusteredCacheForRedis |
| Description | Causes a forced reboot operation to occur on the target to simulate an brief outage. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:azureClusteredCacheForRedis:reboot/1.0 |
| Fault type | Discrete |
| Parameters (key, value) |  |
| rebootType | The node types where the reboot action is to be performed which can be specified as PrimaryNode, SecondaryNode or AllNodes.  |
| shardId | The Id of the shard to be rebooted.  |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "discrete",
      "name": "urn:csci:microsoft:azureClusteredCacheForRedis:reboot/1.0",
      "parameters": [
        {
          "key": "RebootType",
          "value": "AllNodes"
        },
        {
          "key": "ShardId",
          "value": "0"
        }
      ],
      "selectorid": "myResources"
    }
  ]
}
```

### Limitations

* As this is fault causes a forced reboot to better simulate an outage event there is the potential for data loss to occur.
* This is the first **discrete** fault type - this means it is a one-time action and therefore has no duration.