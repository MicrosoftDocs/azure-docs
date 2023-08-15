---
title: Azure Chaos Studio Preview fault and action library
description: Understand the available actions you can use with Azure Chaos Studio Preview, including any prerequisites and parameters.
services: chaos-studio
author: prasha-microsoft 
ms.topic: article
ms.date: 06/16/2022
ms.author: prashabora
ms.service: chaos-studio
ms.custom: ignite-fall-2021, ignite-2022, devx-track-arm-template
---

# Azure Chaos Studio Preview fault and action library

The faults listed in this article are currently available for use. To understand which resource types are supported, see [Supported resource types and role assignments for Azure Chaos Studio Preview](./chaos-studio-fault-providers.md).

## Time delay

| Property | Value |
|-|-|
| Fault provider | N/A |
| Supported OS types | N/A |
| Description | Adds a time delay before, between, or after other experiment actions. This is not a fault and is used to synchronize actions within an experiment. Use this action to wait for the impact of a fault to appear in a service, or wait for an activity outside of the experiment to complete. For example, waiting for autohealing to occur before injecting another fault.|
| Prerequisites | N/A |
| Urn | urn:csci:microsoft:chaosStudio:timedDelay/1.0 |
| Duration | The duration of the delay in ISO 8601 format (for example, PT10M). |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [ 
    {
      "type": "delay",
      "name": "urn:csci:microsoft:chaosStudio:timedDelay/1.0",
      "duration": "PT10M"
    }
  ] 
}
```

## CPU pressure

| Property | Value |
|-|-|
| Capability name | CPUPressure-1.0 |
| Target type | Microsoft-Agent |
| Supported OS types | Windows, Linux. |
| Description | Adds CPU pressure, up to the specified value, on the VM where this fault is injected during the fault action. The artificial CPU pressure is removed at the end of the duration or if the experiment is canceled. On Windows, the **% Processor Utility** performance counter is used at fault start to determine current CPU percentage, which is subtracted from the `pressureLevel` defined in the fault so that **% Processor Utility** hits approximately the `pressureLevel` defined in the fault parameters. |
| Prerequisites | **Linux**: Running the fault on a Linux VM requires the **stress-ng** utility to be installed. To install it, use the package manager for your Linux distro:<ul><li>APT command to install stress-ng: `sudo apt-get update && sudo apt-get -y install unzip && sudo apt-get -y install stress-ng`</li><li>YUM command to install stress-ng: `sudo dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm && sudo yum -y install stress-ng`  |
| | **Windows**: None. |
| Urn | urn:csci:microsoft:agent:cpuPressure/1.0 |
| Parameters (key, value)  |
| pressureLevel | An integer between 1 and 99 that indicates how much CPU pressure (%) is applied to the VM. |
| virtualMachineScaleSetInstances | An array of instance IDs when you apply this fault to a virtual machine scale set. Required for virtual machine scale sets. |

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
        },
        {
          "key": "virtualMachineScaleSetInstances",
          "value": "[0,1,2]"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

### Limitations
Known issues on Linux:
* Stress effect might not be terminated correctly if `AzureChaosAgent` is unexpectedly killed.
* Linux CPU fault is only tested on Ubuntu 16.04-LTS and Ubuntu 18.04-LTS.

## Physical memory pressure

| Property | Value |
|-|-|
| Capability name | PhysicalMemoryPressure-1.0 |
| Target type | Microsoft-Agent |
| Supported OS types | Windows, Linux. |
| Description | Adds physical memory pressure, up to the specified value, on the VM where this fault is injected during the fault action. The artificial physical memory pressure is removed at the end of the duration or if the experiment is canceled. |
| Prerequisites | **Linux**: Running the fault on a Linux VM requires the **stress-ng** utility to be installed. To install it, use the package manager for your Linux distro:<ul><li>APT command to install stress-ng: `sudo apt-get update && sudo apt-get -y install unzip && sudo apt-get -y install stress-ng`</li><li>YUM command to install stress-ng: `sudo dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm && sudo yum -y install stress-ng`  |
| | **Windows**: None. |
| Urn | urn:csci:microsoft:agent:physicalMemoryPressure/1.0 |
| Parameters (key, value) |  |
| pressureLevel | An integer between 1 and 99 that indicates how much physical memory pressure (%) is applied to the VM. |
| virtualMachineScaleSetInstances | An array of instance IDs when you apply this fault to a virtual machine scale set. Required for virtual machine scale sets. |

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
        },
        {
          "key": "virtualMachineScaleSetInstances",
          "value": "[0,1,2]"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

### Limitations
Currently, the Windows agent doesn't reduce memory pressure when other applications increase their memory usage. If the overall memory usage exceeds 100%, the Windows agent might crash.

## Virtual memory pressure

| Property | Value |
|-|-|
| Capability name | VirtualMemoryPressure-1.0 |
| Target type | Microsoft-Agent |
| Supported OS types | Windows |
| Description | Adds virtual memory pressure, up to the specified value, on the VM where this fault is injected during the fault action. The artificial virtual memory pressure is removed at the end of the duration or if the experiment is canceled. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:agent:virtualMemoryPressure/1.0 |
| Parameters (key, value) |  |
| pressureLevel | An integer between 1 and 99 that indicates how much physical memory pressure (%) is applied to the VM. |
| virtualMachineScaleSetInstances | An array of instance IDs when this fault is applied to a virtual machine scale set. Required for virtual machine scale sets. |

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
        },
        {
          "key": "virtualMachineScaleSetInstances",
          "value": "[0,1,2]"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Disk I/O pressure (Windows)

| Property | Value |
|-|-|
| Capability name | DiskIOPressure-1.0 |
| Target type | Microsoft-Agent |
| Supported OS types | Windows |
| Description | Uses the [diskspd utility](https://github.com/Microsoft/diskspd/wiki) to add disk pressure to the primary storage of the VM where it's injected during the fault action. This fault has five different modes of execution. The artificial disk pressure is removed at the end of the duration or if the experiment is canceled. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:agent:diskIOPressure/1.0 |
| Parameters (key, value) |  |
| pressureMode | The preset mode of disk pressure to add to the primary storage of the VM. Must be one of the `PressureModes` in the following table. |
| virtualMachineScaleSetInstances | An array of instance IDs when this fault is applied to a virtual machine scale set. Required for virtual machine scale sets. |

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
        },
        {
          "key": "virtualMachineScaleSetInstances",
          "value": "[0,1,2]"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Disk I/O pressure (Linux)

| Property | Value |
|-|-|
| Capability name | LinuxDiskIOPressure-1.0 |
| Target type | Microsoft-Agent |
| Supported OS types | Linux |
| Description | Uses stress-ng to apply pressure to the disk. One or more worker processes are spawned that perform I/O processes with temporary files. For information on how pressure is applied, see the [stress-ng](https://wiki.ubuntu.com/Kernel/Reference/stress-ng) article. |
| Prerequisites | Running the fault on a Linux VM requires the **stress-ng** utility to be installed. To install it, use the package manager for your Linux distro:<ul><li>APT command to install stress-ng: `sudo apt-get update && sudo apt-get -y install unzip && sudo apt-get -y install stress-ng`</li><li>YUM command to install stress-ng: `sudo dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm && sudo yum -y install stress-ng` |
| Urn | urn:csci:microsoft:agent:linuxDiskIOPressure/1.0 |
| Parameters (key, value) |  |
| workerCount | Number of worker processes to run. Setting `workerCount` to 0 generated as many worker processes as there are number of processors. |
| fileSizePerWorker | Size of the temporary file that a worker performs I/O operations against. Integer plus a unit in bytes (b), kilobytes (k), megabytes (m), or gigabytes (g) (for example, 4 m for 4 megabytes and 256 g for 256 gigabytes). |
| blockSize | Block size to be used for disk I/O operations, capped at 4 megabytes. Integer plus a unit in bytes, kilobytes, or megabytes (for example, 512 k for 512 kilobytes). |
| virtualMachineScaleSetInstances | An array of instance IDs when this fault is applied to a virtual machine scale set. Required for virtual machine scale sets. |

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
        },
        {
          "key": "virtualMachineScaleSetInstances",
          "value": "[0,1,2]"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Arbitrary stress-ng stress

| Property | Value |
|-|-|
| Capability name | StressNg-1.0 |
| Target type | Microsoft-Agent |
| Supported OS types | Linux |
| Description | Runs any stress-ng command by passing arguments directly to stress-ng. Useful when one of the predefined faults for stress-ng doesn't meet your needs. |
| Prerequisites | Running the fault on a Linux VM requires the **stress-ng** utility to be installed. To install it, use the package manager for your Linux distro:<ul><li>APT command to install stress-ng: `sudo apt-get update && sudo apt-get -y install unzip && sudo apt-get -y install stress-ng`</li><li>YUM command to install stress-ng: `sudo dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm && sudo yum -y install stress-ng` |
| Urn | urn:csci:microsoft:agent:stressNg/1.0 |
| Parameters (key, value) |  |
| stressNgArguments | One or more arguments to pass to the stress-ng process. For information on possible stress-ng arguments, see the [stress-ng](https://wiki.ubuntu.com/Kernel/Reference/stress-ng) article. |

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
        },
        {
          "key": "virtualMachineScaleSetInstances",
          "value": "[0,1,2]"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Stop service

| Property | Value |
|-|-|
| Capability name | StopService-1.0 |
| Target type | Microsoft-Agent |
| Supported OS types | Windows, Linux. |
| Description | Stops a Windows service or a Linux systemd service during the fault. Restarts it at the end of the duration or if the experiment is canceled. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:agent:stopService/1.0 |
| Parameters (key, value) |  |
| serviceName | Name of the Windows service or Linux systemd service you want to stop. |
| virtualMachineScaleSetInstances | An array of instance IDs when this fault is applied to a virtual machine scale set. Required for virtual machine scale sets. |

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
        },
        {
          "key": "virtualMachineScaleSetInstances",
          "value": "[0,1,2]"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

### Limitations
* **Windows**: Display names for services aren't supported. Use `sc.exe query` in the command prompt to explore service names.
* **Linux**: Other service types besides systemd, like sysvinit, aren't supported.

## Time change

| Property | Value |
|-|-|
| Capability name | TimeChange-1.0 |
| Target type | Microsoft-Agent |
| Supported OS types | Windows |
| Description | Changes the system time of the VM where it's injected and resets the time at the end of the experiment or if the experiment is canceled. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:agent:timeChange/1.0 |
| Parameters (key, value) |  |
| dateTime | A DateTime string in [ISO8601 format](https://www.cryptosys.net/pki/manpki/pki_iso8601datetime.html). If YYYY-MM-DD values are missing, they're defaulted to the current day when the experiment runs. If Thh:mm:ss values are missing, the default value is 12:00:00 AM. If a 2-digit year is provided (YY), it's converted to a 4-digit year (YYYY) based on the current century. If \<Z\> is missing, it's defaulted to the offset of the local timezone. \<Z\> must always include a sign symbol (negative or positive). |
| virtualMachineScaleSetInstances | An array of instance IDs when this fault is applied to a virtual machine scale set. Required for virtual machine scale sets. |

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
        },
        {
          "key": "virtualMachineScaleSetInstances",
          "value": "[0,1,2]"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Kill process

| Property | Value |
|-|-|
| Capability name | KillProcess-1.0 |
| Target type | Microsoft-Agent |
| Supported OS types | Windows, Linux. |
| Description | Kills all the running instances of a process that matches the process name sent in the fault parameters. Within the duration set for the fault action, a process is killed repetitively based on the value of the kill interval specified. This fault is a destructive fault where system admin would need to manually recover the process if self-healing is configured for it. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:agent:killProcess/1.0 |
| Parameters (key, value) |  |
| processName | Name of a process to continuously kill (without the .exe). The process does not need to be running when the fault begins executing. |
| killIntervalInMilliseconds | Amount of time the fault waits in between successive kill attempts in milliseconds. |
| virtualMachineScaleSetInstances | An array of instance IDs when this fault is applied to a virtual machine scale set. Required for virtual machine scale sets. |

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
        },
        {
          "key": "virtualMachineScaleSetInstances",
          "value": "[0,1,2]"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## DNS failure

| Property | Value |
|-|-|
| Capability name | DnsFailure-1.0 |
| Target type | Microsoft-Agent |
| Supported OS types | Windows |
| Description | Substitutes DNS lookup request responses with a specified error code. DNS lookup requests that are substituted must:<ul><li>Originate from the VM.</li><li>Match the defined fault parameters.</li></ul>DNS lookups that aren't made by the Windows DNS client won't be affected by this fault. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:agent:dnsFailure/1.0 |
| Parameters (key, value) |  |
| hosts | Delimited JSON array of host names to fail DNS lookup request for.<br><br>This property accepts wildcards (`*`), but only for the first subdomain in an address and only applies to the subdomain for which they're specified. For example:<ul><li>\*.microsoft.com is supported.</li><li>subdomain.\*.microsoft isn't supported.</li><li>\*.microsoft.com won't account for multiple subdomains in an address, such as subdomain1.subdomain2.microsoft.com.</li></ul>   |
| dnsFailureReturnCode | DNS error code to be returned to the client for the lookup failure (FormErr, ServFail, NXDomain, NotImp, Refused, XDomain, YXRRSet, NXRRSet, NotAuth, NotZone). For more information on DNS return codes, see the [IANA website](https://www.iana.org/assignments/dns-parameters/dns-parameters.xml#dns-parameters-6). |
| virtualMachineScaleSetInstances | An array of instance IDs when this fault is applied to a virtual machine scale set. Required for virtual machine scale sets. |

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
        },
        {
          "key": "virtualMachineScaleSetInstances",
          "value": "[0,1,2]"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

### Limitations

* The DNS Failure fault requires Windows 2019 RS5 or newer.
* DNS Cache is ignored during the duration of the fault for the host names defined in the fault.

## Network latency

| Property | Value |
|-|-|
| Capability name | NetworkLatency-1.0 |
| Target type | Microsoft-Agent |
| Supported OS types | Windows, Linux. |
| Description | Increases network latency for a specified port range and network block. |
| Prerequisites | Agent (for Windows) must run as administrator. If the agent is installed as a VM extension, it runs as administrator by default. |
| Urn | urn:csci:microsoft:agent:networkLatency/1.0 |
| Parameters (key, value) |  |
| latencyInMilliseconds | Amount of latency to be applied in milliseconds. |
| destinationFilters | Delimited JSON array of packet filters defining which outbound packets to target for fault injection. Maximum of 16. |
| address | IP address that indicates the start of the IP range. |
| subnetMask | Subnet mask for the IP address range. |
| portLow | (Optional) Port number of the start of the port range. |
| portHigh | (Optional) Port number of the end of the port range. |
| virtualMachineScaleSetInstances | An array of instance IDs when this fault is applied to a virtual machine scale set. Required for virtual machine scale sets. |

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
        },
        {
          "key": "virtualMachineScaleSetInstances",
          "value": "[0,1,2]"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

### Limitations

* The agent-based network faults currently only support IPv4 addresses.


## Network disconnect

| Property | Value |
|-|-|
| Capability name | NetworkDisconnect-1.0 |
| Target type | Microsoft-Agent |
| Supported OS types | Windows, Linux. |
| Description | Blocks outbound network traffic for specified port range and network block. |
| Prerequisites | Agent (for Windows) must run as administrator. If the agent is installed as a VM extension, it runs as administrator by default. |
| Urn | urn:csci:microsoft:agent:networkDisconnect/1.0 |
| Parameters (key, value) |  |
| destinationFilters | Delimited JSON array of packet filters defining which outbound packets to target for fault injection. Maximum of 16. |
| address | IP address that indicates the start of the IP range. |
| subnetMask | Subnet mask for the IP address range. |
| portLow | (Optional) Port number of the start of the port range. |
| portHigh | (Optional) Port number of the end of the port range. |
| virtualMachineScaleSetInstances | An array of instance IDs when this fault is applied to a virtual machine scale set. Required for virtual machine scale sets. |

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
        },
        {
          "key": "virtualMachineScaleSetInstances",
          "value": "[0,1,2]"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

### Limitations

* The agent-based network faults currently only support IPv4 addresses.
* The network disconnect fault only affects new connections. Existing active connections continue to persist. You can restart the service or process to force connections to break.
* On Windows, the network disconnect fault currently only works with TCP or UDP packets.

## Network disconnect with firewall rule

| Property | Value |
|-|-|
| Capability name | NetworkDisconnectViaFirewall-1.0 |
| Target type | Microsoft-Agent |
| Supported OS types | Windows |
| Description | Applies a Windows firewall rule to block outbound traffic for specified port range and network block. |
| Prerequisites | Agent must run as administrator. If the agent is installed as a VM extension, it runs as administrator by default. |
| Urn | urn:csci:microsoft:agent:networkDisconnectViaFirewall/1.0 |
| Parameters (key, value) |  |
| destinationFilters | Delimited JSON array of packet filters that define which outbound packets to target for fault injection. Maximum of three. |
| address | IP address that indicates the start of the IP range. |
| subnetMask | Subnet mask for the IP address range. |
| portLow | (Optional) Port number of the start of the port range. |
| portHigh | (Optional) Port number of the end of the port range. |
| virtualMachineScaleSetInstances | An array of instance IDs when this fault is applied to a virtual machine scale set. Required for virtual machine scale sets. |

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
          "key": "destinationFilters",
          "value": "[ { \"Address\": \"23.45.229.97\", \"SubnetMask\": \"255.255.255.224\", \"PortLow\": \"5000\", \"PortHigh\": \"5200\" } ]"
        },
        {
          "key": "virtualMachineScaleSetInstances",
          "value": "[0,1,2]"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

### Limitations

* The agent-based network faults currently only support IPv4 addresses.

## Network packet loss

| Property | Value |
|-|-|
| Capability name | NetworkPacketLoss-1.0 |
| Target type | Microsoft-Agent |
| Supported OS types | Windows, Linux |
| Description | Introduces packet loss for outbound traffic at a specified rate, between 0.0 (no packets lost) and 1.0 (all packets lost). This can help simulate scenarios like network congestion or network hardware issues. |
| Prerequisites | Agent must run as administrator. If the agent is installed as a VM extension, it runs as administrator by default. |
| Urn | urn:csci:microsoft:agent:networkPacketLoss/1.0 |
| Parameters (key, value) |  |
| packetLossRate | The rate at which packets matching the destination filters will be lost, ranging from 0.0 to 1.0. |
| virtualMachineScaleSetInstances | An array of instance IDs when this fault is applied to a virtual machine scale set. Required for virtual machine scale sets. |
| destinationFilters | Delimited JSON array of packet filters (parameters below) that define which outbound packets to target for fault injection. Maximum of three.|
| address | IP address that indicates the start of the IP range. |
| subnetMask | Subnet mask for the IP address range. |
| portLow | (Optional) Port number of the start of the port range. |
| portHigh | (Optional) Port number of the end of the port range. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:agent:networkPacketLoss/1.0",
      "parameters": [
            {
                "key": "destinationFilters",
                "value": "[{\"address\":\"23.45.229.97\",\"subnetMask\":\"255.255.255.224\",\"portLow\":5000,\"portHigh\":5200}]"
            },
            {
                "key": "packetLossRate",
                "value": "0.5"
            },
            {
                "key": "virtualMachineScaleSetInstances",
                "value": "[0,1,2]"
            }
        ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

### Limitations

* The agent-based network faults currently only support IPv4 addresses.

## Azure Resource Manager virtual machine shutdown
| Property | Value |
|-|-|
| Capability name | Shutdown-1.0 |
| Target type | Microsoft-VirtualMachine |
| Supported OS types | Windows, Linux. |
| Description | Shuts down a VM for the duration of the fault. Restarts it at the end of the experiment or if the experiment is canceled. Only Azure Resource Manager VMs are supported. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:virtualMachine:shutdown/1.0 |
| Parameters (key, value) |  |
| abruptShutdown | (Optional) Boolean that indicates if the VM should be shut down gracefully or abruptly (destructive). |

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

## Azure Resource Manager virtual machine scale set instance shutdown

This fault has two available versions that you can use, Version 1.0 and Version 2.0. The main difference is that Version 2.0 allows you to filter by availability zones, only shutting down instances within a specified zone or zones.

### Version 1.0

| Property | Value |
|-|-|
| Capability name | Version 1.0 |
| Target type | Microsoft-VirtualMachineScaleSet |
| Supported OS types | Windows, Linux. |
| Description | Shuts down or kills a virtual machine scale set instance during the fault and restarts the VM at the end of the fault duration or if the experiment is canceled. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:virtualMachineScaleSet:shutdown/1.0 |
| Parameters (key, value) |  |
| abruptShutdown | (Optional) Boolean that indicates if the virtual machine scale set instance should be shut down gracefully or abruptly (destructive). |
| instances | A string that's a delimited array of virtual machine scale set instance IDs to which the fault is applied. |

#### Version 1.0 sample JSON

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
        },
        {
          "key": "instances",
          "value": "[\"1\",\"3\"]"
        }
      ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

### Version 2.0

| Property | Value |
|-|-|
| Capability name | Shutdown-2.0 |
| Target type | Microsoft-VirtualMachineScaleSet |
| Supported OS types | Windows, Linux. |
| Description | Shuts down or kills a virtual machine scale set instance during the fault. Restarts the VM at the end of the fault duration or if the experiment is canceled. Supports [dynamic targeting](chaos-studio-tutorial-dynamic-target-cli.md). |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:virtualMachineScaleSet:shutdown/2.0 |
| [filter](/azure/templates/microsoft.chaos/experiments?pivots=deployment-language-arm-template#filter-objects-1) | (Optional) Available starting with Version 2.0. Used to filter the list of targets in a selector. Currently supports filtering on a list of zones. The filter is only applied to virtual machine scale set resources within a zone:<ul><li>If no filter is specified, this fault shuts down all instances in the virtual machine scale set.</li><li>The experiment targets all virtual machine scale set instances in the specified zones.</li><li>If a filter results in no targets, the experiment fails.</li></ul> |
| Parameters (key, value) |  |
| abruptShutdown | (Optional) Boolean that indicates if the virtual machine scale set instance should be shut down gracefully or abruptly (destructive). |

#### Version 2.0 sample JSON snippets

The following snippets show how to configure both [dynamic filtering](chaos-studio-tutorial-dynamic-target-cli.md) and the shutdown 2.0 fault.

Configure a filter for dynamic targeting:

```json
{
  "type": "List",
  "id": "myResources",
  "targets": [
    {
      "id": "<targetResourceId>",
      "type": "ChaosTarget"
    }
  ],
  "filter": {
    "type": "Simple",
    "parameters": {
      "zones": [
        "1"
      ]
    }
  }
}
```

Configure the shutdown fault:

```json
{
  "name": "branchOne",
  "actions": [
    {
      "name": "urn:csci:microsoft:virtualMachineScaleSet:shutdown/2.0",
      "type": "continuous",
      "selectorId": "myResources",
      "duration": "PT10M",
      "parameters": [
        {
          "key": "abruptShutdown",
          "value": "false"
        }
      ]
    }
  ]
}
```

### Limitations
Currently, only virtual machine scale sets configured with the **Uniform** orchestration mode are supported. If your virtual machine scale set uses **Flexible** orchestration, you can use the Azure Resource Manager virtual machine shutdown fault to shut down selected instances.

## Azure Cosmos DB failover

| Property | Value |
|-|-|
| Capability name | Failover-1.0 |
| Target type | Microsoft-CosmosDB |
| Description | Causes an Azure Cosmos DB account with a single write region to fail over to a specified read region to simulate a [write region outage](../cosmos-db/high-availability.md). |
| Prerequisites | None. |
| Urn | `urn:csci:microsoft:cosmosDB:failover/1.0` |
| Parameters (key, value) |  |
| readRegion | The read region that should be promoted to write region during the failover, for example, `East US 2`. |

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

| Property | Value |
|-|-|
| Capability name | NetworkChaos-2.1 |
| Target type | Microsoft-AzureKubernetesServiceChaosMesh |
| Supported node pool OS types | Linux |
| Description | Causes a network fault available through [Chaos Mesh](https://chaos-mesh.org/docs/simulate-network-chaos-on-kubernetes/) to run against your Azure Kubernetes Service (AKS) cluster. Useful for re-creating AKS incidents that result from network outages, delays, duplications, loss, and corruption. |
| Prerequisites | The AKS cluster must [have Chaos Mesh deployed](chaos-studio-tutorial-aks-portal.md). |
| Urn | urn:csci:microsoft:azureKubernetesServiceChaosMesh:networkChaos/2.1 |
| Parameters (key, value) |  |
| jsonSpec | A JSON-formatted and, if created via Azure Resource Manager template, REST API, or the Azure CLI, JSON-escaped Chaos Mesh spec that uses the [NetworkChaos kind](https://chaos-mesh.org/docs/simulate-network-chaos-on-kubernetes/#create-experiments-using-the-yaml-files). You can use a YAML-to-JSON converter like [Convert YAML To JSON](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minify it. Then use a JSON string escape tool like [JSON Escape / Unescape](https://www.freeformatter.com/json-escape.html) to escape the JSON spec. Only include the YAML under the `jsonSpec` property. Don't include information like metadata and kind. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:networkChaos/2.1",
      "parameters": [
        {
            "key": "jsonSpec",
            "value": "{\"action\":\"delay\",\"mode\":\"one\",\"selector\":{\"namespaces\":[\"default\"],\"labelSelectors\":{\"app\":\"web-show\"}},\"delay\":{\"latency\":\"10ms\",\"correlation\":\"100\",\"jitter\":\"0ms\"}}"
        }
    ],
      "selectorid": "myResources"
    }
  ]
}
```

## AKS Chaos Mesh pod faults

| Property | Value |
|-|-|
| Capability name | PodChaos-2.1 |
| Target type | Microsoft-AzureKubernetesServiceChaosMesh |
| Supported node pool OS types | Linux |
| Description | Causes a pod fault available through [Chaos Mesh](https://chaos-mesh.org/docs/simulate-pod-chaos-on-kubernetes/) to run against your AKS cluster. Useful for re-creating AKS incidents that are a result of pod failures or container issues. |
| Prerequisites | The AKS cluster must [have Chaos Mesh deployed](chaos-studio-tutorial-aks-portal.md). |
| Urn | urn:csci:microsoft:azureKubernetesServiceChaosMesh:podChaos/2.1 |
| Parameters (key, value) |  |
| jsonSpec | A JSON-formatted and, if created via Azure Resource Manager template, REST API, or the Azure CLI, JSON-escaped Chaos Mesh spec that uses the [PodChaos kind](https://chaos-mesh.org/docs/simulate-pod-chaos-on-kubernetes/#create-experiments-using-yaml-configuration-files). You can use a YAML-to-JSON converter like [Convert YAML To JSON](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minify it. Then use a JSON string escape tool like [JSON Escape / Unescape](https://www.freeformatter.com/json-escape.html) to escape the JSON spec. Only include the YAML under the `jsonSpec` property. Don't include information like metadata and kind. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:podChaos/2.1",
      "parameters": [
        {
            "key": "jsonSpec",
            "value": "{\"action\":\"pod-failure\",\"mode\":\"one\",\"selector\":{\"labelSelectors\":{\"app.kubernetes.io\/component\":\"tikv\"}}}"
        }
    ],
      "selectorid": "myResources"
    }
  ]
}
```

## AKS Chaos Mesh stress faults

| Property | Value |
|-|-|
| Capability name | StressChaos-2.1 |
| Target type | Microsoft-AzureKubernetesServiceChaosMesh |
| Supported node pool OS types | Linux |
| Description | Causes a stress fault available through [Chaos Mesh](https://chaos-mesh.org/docs/simulate-heavy-stress-on-kubernetes/) to run against your AKS cluster. Useful for re-creating AKS incidents because of stresses over a collection of pods, for example, due to high CPU or memory consumption. |
| Prerequisites | The AKS cluster must [have Chaos Mesh deployed](chaos-studio-tutorial-aks-portal.md). |
| Urn | urn:csci:microsoft:azureKubernetesServiceChaosMesh:stressChaos/2.1 |
| Parameters (key, value) |  |
| jsonSpec | A JSON-formatted and, if created via Azure Resource Manager template, REST API, or the Azure CLI, JSON-escaped Chaos Mesh spec that uses the [StressChaos kind](https://chaos-mesh.org/docs/simulate-heavy-stress-on-kubernetes/#create-experiments-using-the-yaml-file). You can use a YAML-to-JSON converter like [Convert YAML To JSON](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minify it. Then use a JSON string escape tool like [JSON Escape / Unescape](https://www.freeformatter.com/json-escape.html) to escape the JSON spec. Only include the YAML under the `jsonSpec` property. Don't include information like metadata and kind. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:stressChaos/2.1",
      "parameters": [
        {
            "key": "jsonSpec",
            "value": "{\"mode\":\"one\",\"selector\":{\"labelSelectors\":{\"app\":\"app1\"}},\"stressors\":{\"memory\":{\"workers\":4,\"size\":\"256MB\"}}}"
        }
    ],
      "selectorid": "myResources"
    }
  ]
}
```

## AKS Chaos Mesh IO faults

| Property | Value |
|-|-|
| Capability name | IOChaos-2.1 |
| Target type | Microsoft-AzureKubernetesServiceChaosMesh |
| Supported node pool OS types | Linux |
| Description | Causes an IO fault available through [Chaos Mesh](https://chaos-mesh.org/docs/simulate-io-chaos-on-kubernetes/) to run against your AKS cluster. Useful for re-creating AKS incidents because of IO delays and read/write failures when you use IO system calls such as `open`, `read`, and `write`. |
| Prerequisites | The AKS cluster must [have Chaos Mesh deployed](chaos-studio-tutorial-aks-portal.md). |
| Urn | urn:csci:microsoft:azureKubernetesServiceChaosMesh:IOChaos/2.1 |
| Parameters (key, value) |  |
| jsonSpec | A JSON-formatted and, if created via Azure Resource Manager template, REST API, or the Azure CLI, JSON-escaped Chaos Mesh spec that uses the [IOChaos kind](https://chaos-mesh.org/docs/simulate-io-chaos-on-kubernetes/#create-experiments-using-the-yaml-files). You can use a YAML-to-JSON converter like [Convert YAML To JSON](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minify it. Then use a JSON string escape tool like [JSON Escape / Unescape](https://www.freeformatter.com/json-escape.html) to escape the JSON spec. Only include the YAML under the `jsonSpec` property. Don't include information like metadata and kind. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:IOChaos/2.1",
      "parameters": [
        {
            "key": "jsonSpec",
            "value": "{\"action\":\"latency\",\"mode\":\"one\",\"selector\":{\"labelSelectors\":{\"app\":\"etcd\"}},\"volumePath\":\"\/var\/run\/etcd\",\"path\":\"\/var\/run\/etcd\/**\/*\",\"delay\":\"100ms\",\"percent\":50}"
        }
    ],
      "selectorid": "myResources"
    }
  ]
}
```

## AKS Chaos Mesh time faults

| Property | Value |
|-|-|
| Capability name | TimeChaos-2.1 |
| Target type | Microsoft-AzureKubernetesServiceChaosMesh |
| Supported node pool OS types | Linux |
| Description | Causes a change in the system clock on your AKS cluster by using  [Chaos Mesh](https://chaos-mesh.org/docs/simulate-time-chaos-on-kubernetes/). Useful for re-creating AKS incidents that result from distributed systems falling out of sync, missing/incorrect leap year/leap second logic, and more. |
| Prerequisites | The AKS cluster must [have Chaos Mesh deployed](chaos-studio-tutorial-aks-portal.md). |
| Urn | urn:csci:microsoft:azureKubernetesServiceChaosMesh:timeChaos/2.1 |
| Parameters (key, value) |  |
| jsonSpec | A JSON-formatted and, if created via Azure Resource Manager template, REST API, or the Azure CLI, JSON-escaped Chaos Mesh spec that uses the [TimeChaos kind](https://chaos-mesh.org/docs/simulate-time-chaos-on-kubernetes/#create-experiments-using-the-yaml-file). You can use a YAML-to-JSON converter like [Convert YAML To JSON](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minify it. Then use a JSON string escape tool like [JSON Escape / Unescape](https://www.freeformatter.com/json-escape.html) to escape the JSON spec. Only include the YAML under the `jsonSpec` property. Don't include information like metadata and kind. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:timeChaos/2.1",
      "parameters": [
        {
            "key": "jsonSpec",
            "value": "{\"mode\":\"one\",\"selector\":{\"labelSelectors\":{\"app\":\"app1\"}},\"timeOffset\":\"-10m100ns\"}"
        }
    ],
      "selectorid": "myResources"
    }
  ]
}
```

## AKS Chaos Mesh kernel faults

| Property | Value |
|-|-|
| Capability name | KernelChaos-2.1 |
| Target type | Microsoft-AzureKubernetesServiceChaosMesh |
| Supported node pool OS types | Linux |
| Description | Causes a kernel fault available through [Chaos Mesh](https://chaos-mesh.org/docs/simulate-kernel-chaos-on-kubernetes/) to run against your AKS cluster. Useful for re-creating AKS incidents because of Linux kernel-level errors, such as a mount failing or memory not being allocated. |
| Prerequisites | The AKS cluster must [have Chaos Mesh deployed](chaos-studio-tutorial-aks-portal.md). |
| Urn | urn:csci:microsoft:azureKubernetesServiceChaosMesh:kernelChaos/2.1 |
| Parameters (key, value) |  |
| jsonSpec | A JSON-formatted and, if created via Azure Resource Manager template, REST API, or the Azure CLI, JSON-escaped Chaos Mesh spec that uses the [KernelChaos kind](https://chaos-mesh.org/docs/simulate-kernel-chaos-on-kubernetes/#configuration-file).You can use a YAML-to-JSON converter like [Convert YAML To JSON](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minify it. Then use a JSON string escape tool like [JSON Escape / Unescape](https://www.freeformatter.com/json-escape.html) to escape the JSON spec. Only include the YAML under the `jsonSpec` property. Don't include information like metadata and kind. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:kernelChaos/2.1",
      "parameters": [
        {
            "key": "jsonSpec",
            "value": "{\"mode\":\"one\",\"selector\":{\"namespaces\":[\"chaos-mount\"]},\"failKernRequest\":{\"callchain\":[{\"funcname\":\"__x64_sys_mount\"}],\"failtype\":0}}"
        }
    ],
      "selectorid": "myResources"
    }
  ]
}
```

## AKS Chaos Mesh HTTP faults

| Property | Value |
|-|-|
| Capability name | HTTPChaos-2.1 |
| Target type | Microsoft-AzureKubernetesServiceChaosMesh |
| Supported node pool OS types | Linux |
| Description | Causes an HTTP fault available through [Chaos Mesh](https://chaos-mesh.org/docs/simulate-http-chaos-on-kubernetes/) to run against your AKS cluster. Useful for re-creating incidents because of HTTP request and response processing failures, such as delayed or incorrect responses. |
| Prerequisites | The AKS cluster must [have Chaos Mesh deployed](chaos-studio-tutorial-aks-portal.md). |
| Urn | urn:csci:microsoft:azureKubernetesServiceChaosMesh:httpChaos/2.1 |
| Parameters (key, value) |  |
| jsonSpec | A JSON-formatted and, if created via Azure Resource Manager template, REST API, or the Azure CLI, JSON-escaped Chaos Mesh spec that uses the [HTTPChaos kind](https://chaos-mesh.org/docs/simulate-http-chaos-on-kubernetes/#create-experiments). You can use a YAML-to-JSON converter like [Convert YAML To JSON](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minify it. Then use a JSON string escape tool like [JSON Escape / Unescape](https://www.freeformatter.com/json-escape.html) to escape the JSON spec. Only include the YAML under the `jsonSpec` property. Don't include information like metadata and kind. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:httpChaos/2.1",
      "parameters": [
        {
            "key": "jsonSpec",
            "value": "{\"mode\":\"all\",\"selector\":{\"labelSelectors\":{\"app\":\"nginx\"}},\"target\":\"Request\",\"port\":80,\"method\":\"GET\",\"path\":\"\/api\",\"abort\":true,\"scheduler\":{\"cron\":\"@every 10m\"}}"
        }
    ],
      "selectorid": "myResources"
    }
  ]
}
```

## AKS Chaos Mesh DNS faults

| Property | Value |
|-|-|
| Capability name | DNSChaos-2.1 |
| Target type | Microsoft-AzureKubernetesServiceChaosMesh |
| Supported node pool OS types | Linux |
| Description | Causes a DNS fault available through [Chaos Mesh](https://chaos-mesh.org/docs/simulate-dns-chaos-on-kubernetes/) to run against your AKS cluster. Useful for re-creating incidents because of DNS failures. |
| Prerequisites | The AKS cluster must [have Chaos Mesh deployed](chaos-studio-tutorial-aks-portal.md) and the [DNS service must be installed](https://chaos-mesh.org/docs/simulate-dns-chaos-on-kubernetes/#deploy-chaos-dns-service). |
| Urn | urn:csci:microsoft:azureKubernetesServiceChaosMesh:dnsChaos/2.1 |
| Parameters (key, value) |  |
| jsonSpec | A JSON-formatted and, if created via an Azure Resource Manager template, REST API, or the Azure CLI, JSON-escaped Chaos Mesh spec that uses the [DNSChaos kind](https://chaos-mesh.org/docs/simulate-dns-chaos-on-kubernetes/#create-experiments-using-the-yaml-file). You can use a YAML-to-JSON converter like [Convert YAML To JSON](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minify it. Then use a JSON string escape tool like [JSON Escape / Unescape](https://www.freeformatter.com/json-escape.html) to escape the JSON spec. Only include the YAML under the `jsonSpec` property. Don't include information like metadata and kind. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:dnsChaos/2.1",
      "parameters": [
        {
            "key": "jsonSpec",
            "value": "{\"action\":\"random\",\"mode\":\"all\",\"patterns\":[\"google.com\",\"chaos-mesh.*\",\"github.?om\"],\"selector\":{\"namespaces\":[\"busybox\"]}}"
        }
    ],
      "selectorid": "myResources"
    }
  ]
}
```

## Network security group (set rules)

| Property | Value |
|-|-|
| Capability name | SecurityRule-1.0 |
| Target type | Microsoft-NetworkSecurityGroup |
| Description | Enables manipulation or rule creation in an existing Azure network security group (NSG) or set of Azure NSGs, assuming the rule definition is applicable across security groups. Useful for: <ul><li>Simulating an outage of a downstream or cross-region dependency/nondependency.<li>Simulating an event that's expected to trigger a logic to force a service failover.<li>Simulating an event that's expected to trigger an action from a monitoring or state management service.<li>Using as an alternative for blocking or allowing network traffic where Chaos Agent can't be deployed. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:networkSecurityGroup:securityRule/1.0 |
| Parameters (key, value) |  |
| name | A unique name for the security rule that's created. The fault fails if another rule already exists on the NSG with the same name. Must begin with a letter or number. Must end with a letter, number, or underscore. May contain only letters, numbers, underscores, periods, or hyphens. |
| protocol | Protocol for the security rule. Must be Any, TCP, UDP, or ICMP. |
| sourceAddresses | A string that represents a JSON-delimited array of CIDR-formatted IP addresses. Can also be a [service tag name](../virtual-network/service-tags-overview.md) for an inbound rule, for example, `AppService`. An asterisk `*` can also be used to match all source IPs. |
| destinationAddresses | A string that represents a JSON-delimited array of CIDR-formatted IP addresses. Can also be a [service tag name](../virtual-network/service-tags-overview.md) for an outbound rule, for example, `AppService`. An asterisk `*` can also be used to match all destination IPs. |
| action | Security group access type. Must be either Allow or Deny. |
| destinationPortRanges | A string that represents a JSON-delimited array of single ports and/or port ranges, such as 80 or 1024-65535. |
| sourcePortRanges | A string that represents a JSON-delimited array of single ports and/or port ranges, such as 80 or 1024-65535. |
| priority | A value between 100 and 4096 that's unique for all security rules within the NSG. The fault fails if another rule already exists on the NSG with the same priority. |
| direction | Direction of the traffic affected by the security rule. Must be either Inbound or Outbound. |

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
              "value": "[\"10.1.1.128/32\"]"
          }, 
          { 
              "key": "destinationAddresses", 
              "value": "[\"10.20.0.0/16\",\"10.30.0.0/16\"]"
          }, 
          { 
              "key": "access", 
              "value": "Deny" 
          }, 
          { 
              "key": "destinationPortRanges", 
              "value": "[\"80-8080\"]"
          }, 
          { 
              "key": "sourcePortRanges", 
              "value": "[\"*\"]"
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

* The fault can only be applied to an existing NSG.
* When an NSG rule that's intended to deny traffic is applied, existing connections won't be broken until they've been **idle** for 4 minutes. One workaround is to add another branch in the same step that uses a fault that would cause existing connections to break when the NSG fault is applied. For example, killing the process, temporarily stopping the service, or restarting the VM would cause connections to reset.
* Rules are applied at the start of the action. Any external changes to the rule during the duration of the action cause the experiment to fail.
* Creating or modifying Application Security Group rules isn't supported.
* Priority values must be unique on each NSG targeted. Attempting to create a new rule that has the same priority value as another causes the experiment to fail.

## Azure Cache for Redis reboot

| Property | Value |
|-|-|
| Capability name | Reboot-1.0 |
| Target type | Microsoft-AzureClusteredCacheForRedis |
| Description | Causes a forced reboot operation to occur on the target to simulate a brief outage. |
| Prerequisites | N/A |
| Urn | urn:csci:microsoft:azureClusteredCacheForRedis:reboot/1.0 |
| Fault type | Discrete. |
| Parameters (key, value) |  |
| rebootType | The node types where the reboot action is to be performed, which can be specified as PrimaryNode, SecondaryNode, or AllNodes.  |
| shardId | The ID of the shard to be rebooted. Only relevant for Premium tier caches. |

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

* The reboot fault causes a forced reboot to better simulate an outage event, which means there's the potential for data loss to occur.
* The reboot fault is a **discrete** fault type. Unlike continuous faults, it's a one-time action and has no duration.

## Cloud Services (classic) shutdown

| Property | Value |
|-|-|
| Capability name | Shutdown-1.0 |
| Target type | Microsoft-DomainName |
| Description | Stops a deployment during the fault. Restarts the deployment at the end of the fault duration or if the experiment is canceled. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:domainName:shutdown/1.0 |
| Fault type | Continuous. |
| Parameters | None.  |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:domainName:shutdown/1.0",
      "parameters": [],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Disable autoscale

| Property | Value |
| --- | --- |
| Capability name | DisaleAutoscale |
| Target type | Microsoft-AutoscaleSettings |
| Description | Disables the [autoscale service](/azure/azure-monitor/autoscale/autoscale-overview). When autoscale is disabled, resources such as virtual machine scale sets, web apps, service bus, and [more](/azure/azure-monitor/autoscale/autoscale-overview#supported-services-for-autoscale) aren't automatically added or removed based on the load of the application.
| Prerequisites | The autoScalesetting resource that's enabled on the resource must be onboarded to Chaos Studio.
| Urn | urn:csci:microsoft:autoscalesettings:disableAutoscale/1.0 |
| Fault type | Continuous. |
| Parameters (key, value) |   |
| enableOnComplete | Boolean. Configures whether autoscaling is reenabled after the action is done. Default is `true`. |

```json
{
  "name": "BranchOne", 
  "actions": [ 
    { 
    "type": "continuous", 
    "name": "urn:csci:microsoft:autoscaleSetting:disableAutoscale/1.0", 
    "parameters": [ 
     { 
      "key": "enableOnComplete", 
      "value": "true" 
      }                 
  ],                                 
   "duration": "PT2M", 
   "selectorId": "Selector1",           
  } 
 ] 
} 
```

## Key Vault Deny Access

| Property | Value |
|-|-|
| Capability name | DenyAccess-1.0 |
| Target type | Microsoft-KeyVault |
| Description | Blocks all network access to a key vault by temporarily modifying the key vault network rules. This action prevents an application dependent on the key vault from accessing secrets, keys, and/or certificates. If the key vault allows access to all networks, this setting is changed to only allow access from selected networks. No virtual networks are in the allowed list at the start of the fault. All networks are allowed access at the end of the fault duration. If the key vault is set to only allow access from selected networks, any virtual networks in the allowed list are removed at the start of the fault. They're restored at the end of the fault duration. |
| Prerequisites | The target key vault can't have any firewall rules and must not be set to allow Azure services to bypass the firewall. If the target key vault is set to only allow access from selected networks, there must be at least one virtual network rule. The key vault can't be in recover mode. |
| Urn | urn:csci:microsoft:keyVault:denyAccess/1.0 |
| Fault type | Continuous. |
| Parameters (key, value) | None. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:keyvault:denyAccess/1.0",
      "parameters": [],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Key Vault Disable Certificate

| Property  | Value |
| ---- | --- |
| Capability name | DisableCertificate-1.0 |
| Target type | Microsoft-KeyVault |
| Description | By using certificate properties, the fault disables the certificate for a specific duration (provided by the user). It enables the certificate after this fault duration. |
| Prerequisites | For OneCert certificates, the domain must be registered with OneCert before you attempt to run the fault. |
| Urn | urn:csci:microsoft:keyvault:disableCertificate/1.0 |
| Fault type | Continuous. |
| Parameters (key, value) | |
| certificateName | Name of Azure Key Vault certificate on which the fault is executed. |
| version | Certificate version that should be updated. If not specified, the latest version is updated. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:keyvault:disableCertificate/1.0",
      "parameters": [
        {
            "key": "certificateName",
            "value": "<name of AKV certificate>"
        },
        {
            "key": "version",
            "value": "<certificate version>"
        }

],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Key Vault Increment Certificate Version
	
| Property  | Value |
| ---- | --- |
| Capability name | IncrementCertificateVersion-1.0 |
| Target type | Microsoft-KeyVault |
| Description | Generates a new certificate version and thumbprint by using the Key Vault Certificate client library. Current working certificate is upgraded to this version. |
| Prerequisites | For OneCert certificates, the domain must be registered with OneCert before you attempt to run the fault. |
| Urn | urn:csci:microsoft:keyvault:incrementCertificateVersion/1.0 |
| Fault type | Discrete. |
| Parameters (key, value) | |
| certificateName | Name of Azure Key Vault certificate on which the fault is executed. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "discrete",
      "name": "urn:csci:microsoft:keyvault:incrementCertificateVersion/1.0",
      "parameters": [
        {
            "key": "certificateName",
            "value": "<name of AKV certificate>"
        }
    ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## Key Vault Update Certificate Policy

| Property  | Value |        
| ---- | --- |  
| Capability name | UpdateCertificatePolicy-1.0        |
| Target type | Microsoft-KeyVault        |
| Description | Certificate policies (for example, certificate validity period, certificate type, key size, or key type) are updated based on user input and reverted after the fault duration.        |
| Prerequisites |  For OneCert certificates, the domain must be registered with OneCert before you attempt to run the fault.       |
| Urn | urn:csci:microsoft:keyvault:updateCertificatePolicy/1.0        |
| Fault type | Continuous.        |
| Parameters (key, value) |     |    
| certificateName | Name of Azure Key Vault certificate on which the fault is executed. |
| version | Certificate version that should be updated. If not specified, the latest version is updated. |
| enabled | Boolean. Value that indicates if the new certificate version is enabled.  |
| validityInMonths | Validity period of the certificate in months.  |
| certificateTransparency | Indicates whether the certificate should be published to the certificate transparency list when created.  |
| certificateType | Certificate type. |
| contentType | Content type of the certificate. For example, it's Pkcs12 when the certificate contains raw PFX bytes or Pem when it contains ASCII PEM-encoded bytes. Pkcs12 is the default value assumed. |
| keySize | Size of the RSA key: 2048, 3072, or 4096. |
| exportable | Boolean. Value that indicates if the certificate key is exportable from the vault or secure certificate store. |
| reuseKey | Boolean. Value that indicates if the certificate key should be reused when the certificate is rotated.|
| keyType | Type of backing key generated when new certificates are issued, such as RSA or EC. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:keyvault:updateCertificatePolicy/1.0",
      "parameters": [
        {
            "key": "certificateName",
            "value": "<name of AKV certificate>"
        },
        {
            "key": "version",
            "value": "<certificate version>"
        },
        {
            "key": "enabled",
            "value": "True"
        },
        {
            "key": "validityInMonths",
            "value": "12"
        },
        {
            "key": "certificateTransparency",
            "value": "True"
        },
        {
            "key": "certificateType",
            "value": "<certificate type>"
        },
        {
            "key": "contentType",
            "value": "Pem"
        },
        {
            "key": "keySize",
            "value": "4096"
        },
                {
            "key": "exportable",
            "value": "True"
        },
        {
            "key": "reuseKey",
            "value": "False"
        },
        {
            "key": "keyType",
            "value": "RSA"
        }

     ],
      "duration": "PT10M",
      "selectorid": "myResources"
    }
  ]
}
```

## App Service Stop
	
| Property  | Value |
| ---- | --- |
| Capability name | Stop-1.0 |
| Target type | Microsoft-AppService |
| Description | Stops the targeted App Service applications, then restarts them at the end of the fault duration. This applies to resources of the "Microsoft.Web/sites" type, including App Service, API Apps, Mobile Apps, and Azure Functions. |
| Prerequisites | None. |
| Urn | urn:csci:microsoft:appService:stop/1.0 |
| Fault type | Continuous. |
| Parameters (key, value) | None. |

### Sample JSON

```json
{
  "name": "branchOne",
  "actions": [
    {
      "type": "continuous",
      "name": "urn:csci:microsoft:appService:stop/1.0",
      "duration": "PT10M",
      "parameters":[],
      "selectorid": "myResources"
    }
  ]
}
```