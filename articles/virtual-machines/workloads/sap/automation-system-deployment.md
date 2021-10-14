---
title: About SAP system deployment for the automation framework
description: Overview of the SAP system deployment process within the SAP deployment automation framework on Azure.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# SAP system deployment for the automation framework

The creation of the [SAP system](automation-deployment-framework.md#sap-concepts) is part of the [deployment automation framework](automation-deployment-framework.md) process. The SAP system creates your virtual machines (VMs), and supporting components for your [SAP application](automation-deployment-framework.md#sap-concepts). 

The SAP system deploys:

- The [application tier](#application-tier), which deploys the VMs and their disks.
- The [SAP central services tier](#central-services-tier), which deploys a customer-defined number of VMs and an Azure Standard Load Balancer.
- The [web dispatcher tier](#web-dispatcher-tier)
- The [database tier](#database-tier), which deploys database VMs and their disks and a Standard Azure Load Balancer. You can run [HANA databases](#hana-databases) or [AnyDB databases](#anydb-databases) in this tier.

## Application tier

The application tier deploys a customer-defined number of VMs. These VMs are size **Standard_D4s_v3** with a 30-GB operating system (OS) disk and a 512-GB data disk.

To set the application server count, define the parameter `application_server_count` for this tier in your parameter file. For example, `"application_server_count": 3`. 

To set the application tier size, create a custom JSON file with your settings. For an example, [see the following JSON code sample and replace values as necessary for your configuration](#custom-application-json-settings). Then, define the parameter `app_disk_sizes_filename` in the parameter file for the application tier with the path of your custom JSON file. For example, `app_disk_sizes_filename : "/path/to/JSON/file"`. 

### Custom application JSON settings

Example of custom JSON file for application tier:

```json
{
  "app": {
    "Default": {
      "compute": {
        "vm_size": "Standard_D4s_v3",
        "accelerated_networking": false
      },
      "storage": [
        {
          "count": 1,
          "name": "os",
          "disk_type": "Premium_LRS",
          "size_gb": 30,
          "caching": "ReadWrite",
          "write_accelerator": false
        },
        {
          "count": 1,
          "name": "data",
          "disk_type": "Premium_LRS",
          "size_gb": 512,
          "caching": "None",
          "write_accelerator": false
        }
      ]
    }
  },
```

## Central services tier

The SAP central services (SCS) tier deploys a customer-defined number of VMs. These VMs are size **Standard_D4s_v3** with a 30-GB OS disk and a 512-GB data disk. This tier also deploys an [Azure Standard Load Balancer](../../../load-balancer/load-balancer-overview.md).

To set the SCS server count, define the parameter `scs_server_count` for this tier in your parameter file. For example, `"scs_server_count": 2`.

To set the SCS tier size, create a custom JSON file with your settings. For an example, [see the following JSON code sample and replace values as necessary for your configuration](#custom-scs-json-settings). Then, define the parameter `app_disk_sizes_filename` in the parameter file for the tier with the path of your custom JSON file. For example, `app_disk_sizes_filename : "/path/to/JSON/file"`.

### Custom SCS JSON settings

Example of custom JSON file for SCS tier:

```json
{
  "scs": {
    "Default": {
      "compute": {
        "vm_size": "Standard_D4s_v3",
        "accelerated_networking": false
      },
      "storage": [
        {
          "count": 1,
          "name": "os",
          "disk_type": "Premium_LRS",
          "size_gb": 30,
          "caching": "ReadWrite",
          "write_accelerator": false
        },
        {
          "count": 1,
          "name": "data",
          "disk_type": "Premium_LRS",
          "size_gb": 512,
          "caching": "None",
          "write_accelerator": false
        }
      ]
    }
  },
```

## Web dispatcher tier

The web dispatcher tier deploys a customer-defined number of VMs. These VMs are size **Standard_D4s_v3** with a 30-GB OS disk and a 512-GB data disk. This tier also deploys an [Azure Standard Load Balancer](../../../load-balancer/load-balancer-overview.md).

To set the web server count, define the parameter `web_server_count` for this tier in your parameter file. For example, `"web_server_count": 2`.

To set the web dispatcher tier size, create a custom JSON file with your settings. For an example, [see the following JSON code sample and replace values as necessary for your configuration](#custom-web-dispatcher-json-settings). Then, define the parameter `app_disk_sizes_filename` in the parameter file for the application tier with the path of your custom JSON file. For example, `app_disk_sizes_filename : "/path/to/JSON/file"`.

### Custom web dispatcher JSON settings

Example of custom JSON file for web dispatcher tier:

```json
{
  "web": {
    "Default": {
      "compute": {
        "vm_size": "Standard_D4s_v3",
        "accelerated_networking": false
      },
      "storage": [
        {
          "count": 1,
          "name": "os",
          "disk_type": "Premium_LRS",
          "size_gb": 30,
          "caching": "ReadWrite",
          "write_accelerator": false
        },
        {
          "count": 1,
          "name": "data",
          "disk_type": "Premium_LRS",
          "size_gb": 512,
          "caching": "None",
          "write_accelerator": false
        }
      ]
    }
  },
```

## Database tier

The database tier deploys the VMs and their disks, and also an [Azure Standard Load Balancer](../../../load-balancer/load-balancer-overview.md). You can use either [HANA databases](#hana-databases) or [AnyDB databases](#anydb-databases) as your database VMs.

You can set the size of database VMs with the parameter `size` for this tier. For example, `"size": "XL"` for HANA databases or `"size": "1 TB"` for AnyDB databases. Refer to the **Size** parameter in the tables of [HANA database VM options](#hana-databases) and [AnyDB database VM options](#anydb-databases) for possible values.

By default, the automation framework deploys the correct disk configuration for HANA database deployments. For HANA database deployments, the framework calculates default disk configuration based on VM size. However, for AnyDB database deployments, the framework calculates default disk configuration based on database size. You can set a disk size as needed by creating a custom JSON file in your deployment. For an example, [see the following JSON code sample and replace values as necessary for your configuration](#custom-database-json-settings). Then, define the parameter `db_disk_sizes_filename` in the parameter file for the database tier. For example, `db_disk_sizes_filename : "path/to/JSON/file"`.

You can also [add extra disks to a new system](automation-configure-extra-disks.md#add-extra-disks-to-new-system), or [add extra disks to an existing system](automation-configure-extra-disks.md#add-extra-disks-to-existing-system).

### Custom database JSON settings

The following code sample is an example of a custom JSON file for the database tier.

In the first node, the name `os` is mandatory and defines the size of the operating disk. 

The automation framework refers to the top-level value as the key. In the sample code, this top-level value is `"Default"`. The parameter files then must have a corresponding value in their database sections. For example, `"size" : "Default"`.

The `"name"` attribute becomes part of the Azure resource name. 

The `"start_lun"` attribute defines the first logical unit number (LUN) for disks in the node.

```json
{
  "type": {
    "Default": {
      "compute": {
        "vm_size"       : "Standard_D4s_v3",
        "swap_size_gb"  : 2
      },
      "storage": [
        {
          "name"        : "os",
          "count"       : 1,
          "disk_type"   : "Premium_LRS",
          "size_gb"     : 127,
          "caching"     : "ReadWrite"
        },
        {
          "name"        : "[NAME_OF_DISK]",
          "count"       : 1,
          "disk_type"   : "Premium_LRS",
          "size_gb"     : 128,
          "caching"     : "ReadWrite",
          "start_lun"   : 0 
        }

      ]
    }
  }
}
```

### HANA databases


| Size      | VM SKU              | OS disk       | Data disks       | Log disks        | Hana shared    | User SAP   | Backup          |
|-----------|---------------------|---------------|------------------|------------------|----------------|------------|-----------------|
| Default   | Standard_D8s_v3     | E6 (64 GB)    | P20 (512 GB)     | P20 (512 GB)     | E20 (512 GB)   | E6 (64 GB) | E20 (512 GB)    |  
| S         | Standard_M32ls      | E6 (64 GB)    | 3 P20 (512 GB)   | 2 P20 (512 GB)   | E20 (512 GB)   | E6 (64 GB) | E20 (512 GB)    |  
| M         | Standard_M64ls      | E6 (64 GB)    | 3 P20 (512 GB)   | 2 P20 (512 GB)   | E20 (512 GB)   | E6 (64 GB) | E20 (512 GB)    |  
| L         | Standard_M64s       | E6 (64 GB)    | 4 P20 (1024 GB)  | 2 P30 (1024 GB)  | E30 (1024 GB)  | E6 (64 GB) | 2 E30 (1024 GB) |  
| XL        | Standard_M64s       | E10 (128 GB)  | 4 P20 (1024 GB)  | 2 P30 (1024 GB)  | E30 (1024 GB)  | E6 (64 GB) | 2 E30 (1024 GB) |
| XXL       | Standard_M128ms     | E10 (128 GB)  | 5 P20 (1024 GB)  | 2 P30 (1024 GB)  | E30 (1024 GB)  | E6 (64 GB) | 4 E30 (1024 GB) |
| M32ts     | Standard_M32ts      | P6 (64 GB)    | 4 P6 (64 GB)     | 3 P10 (128 GB)   | P20 (512 GB)   | P6 (64 GB) | P20 (512 GB)    |
| M32ls     | Standard_M32ls      | P6 (64 GB)    | 4 P6 (64 GB)     | 3 P10 (128 GB)   | P20 (512 GB)   | P6 (64 GB) | P20 (512 GB)    |
| M64ls     | Standard_M64ls      | P6 (64 GB)    | 4 P10 (128 GB)   | 3 P10 (128 GB)   | P20 (512 GB)   | P6 (64 GB) | P30 (1024 GB)   |
| M64s      | Standard_M64s       | P10 (128 GB)  | 4 P15 (256 GB)   | 3 P15 (256 GB)   | P30 (1024 GB)  | P6 (64 GB) | P30 (1024 GB)   |
| M64ms     | Standard_M64ms      | P6 (64 GB)    | 4 P20 (512 GB)   | 3 P15 (256 GB)   | P30 (1024 GB)  | P6 (64 GB) | 2 P30 (1024 GB) |
| M128s     | Standard_M128s      | P10 (128 GB)  | 4 P20 (512 GB)   | 3 P15 (256 GB)   | P30 (1024 GB)  | P6 (64 GB) | 2 P30 (1024 GB) |
| M128ms    | Standard_M128m      | P10 (128 GB)  | 4 P30 (1024 GB)  | 3 P15 (256 GB)   | P30 (1024 GB)  | P6 (64 GB) | 4 P30 (1024 GB) |
| M208s_v2  | Standard_M208s_v2   | P10 (128 GB)  | 4 P30 (1024 GB)  | 3 P15 (256 GB)   | P30 (1024 GB)  | P6 (64 GB) | 3 P40 (2048 GB) |
| M208ms_v2 | Standard_M208ms_v2  | P10 (128 GB)  | 4 P40 (2048 GB)  | 3 P15 (256 GB)   | P30 (1024 GB)  | P6 (64 GB) | 3 P40 (2048 GB) |
| M416s_v2  | Standard_M416s_v2   | P10 (128 GB)  | 4 P40 (2048 GB)  | 3 P15 (256 GB)   | P30 (1024 GB)  | P6 (64 GB) | 3 P40 (2048 GB) |
| M416ms_v2 | Standard_M416m_v2   | P10 (128 GB)  | 4 P50 (4096 GB)  | 3 P15 (256 GB)   | P30 (1024 GB)  | P6 (64 GB) | 4 P50 (4096 GB) |

### AnyDB databases

| Size    | VM SKU           | OS disk     | Data disks       | Log disks       |
|---------|------------------|-------------|------------------|-----------------|
| Default | Standard_E4s_v3  | P6 (64 GB)  | P15 (256 GB)     | P10 (128 GB)    |
| 200 GB  | Standard_E4s_v3  | P6 (64 GB)  | P15 (256 GB)     | P10 (128 GB)    |
| 500 GB  | Standard_E8s_v3  | P6 (64 GB)  | P20 (512 GB)     | P15 (256 GB)    |
| 1   TB  | Standard_E16s_v3 | P10(128 GB) | 2 P20 (512 GB)   | 2 P15 (256 GB)  |
| 2   TB  | Standard_E32s_v3 | P10(128 GB) | 2 P30 (1024 GB)  | 2 P20 (512 GB)  |
| 5   TB  | Standard_M64ls   | P10(128 GB) | 5 P30 (1024 GB)  | 2 P20 (512 GB)  |
| 10  TB  | Standard_M64s    | P10(128 GB) | 5 P40 (2048 GB)  | 2 P20 (512 GB)  |
| 15  TB  | Standard_M64s    | P10(128 GB) | 4 P50 (4096 GB)  | 2 P20 (512 GB)  |
| 20  TB  | Standard_M64s    | P10(128 GB) | 5 P50 (4096 GB)  | 2 P20 (512 GB)  |
| 30  TB  | Standard_M128s   | P10(128 GB) | 8 P50 (4096 GB)  | 2 P40 (2048 GB) |
| 40  TB  | Standard_M128s   | P10(128 GB) | 10 P50 (4096 GB) | 2 P40 (2048 GB) |
| 50  TB  | Standard_M128s   | P10(128 GB) | 13 P50 (4096 GB) | 2 P40 (2048 GB) |


## Next steps

> [!div class="nextstepaction"]
> [About workload zone deployment with automation framework](automation-workload-zone-deployment.md)
