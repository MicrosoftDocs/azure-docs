---
title: Custom disk configurations
description: Provide custom disk configurations for your system in the SAP on Azure Deployment Automation Framework. Add extra disks to a new system, or an existing system.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 06/09/2022
ms.topic: conceptual
ms.service: azure-center-sap-solutions
---

# Change the disk configuration for the SAP deployment automation

By default, the [SAP on Azure Deployment Automation Framework](deployment-framework.md) defines the disk configuration for the SAP systems. As needed, you can change the default configuration by providing a custom disk configuration json file.

> [!TIP]
> When possible, it's a best practice to increase the disk size instead of adding more disks.


### HANA databases

The table below shows the default disk configuration for HANA systems. 

| Size      | VM SKU              | OS disk       | Data disks       | Log disks        | Hana shared    | User SAP     | Backup          |
|-----------|---------------------|---------------|------------------|------------------|----------------|--------------|-----------------|
| Default   | Standard_D8s_v3     | E6 (64 GB)    | P20 (512 GB)     | P20 (512 GB)     | E20 (512 GB)   | E6 (64 GB)   | E20 (512 GB)    |  
| S4DEMO    | Standard_E32ds_v4   | P10 (128 GB)  | 4 P10 (128 GB)   | 3 P10 (128 GB)   |                | P20 (512 GB) | P20 (512 GB)    |
| M32ts     | Standard_M32ts      | P6 (64 GB)    | 4 P6 (64 GB)     | 3 P10 (128 GB)   | P20 (512 GB)   | P6 (64 GB)   | P20 (512 GB)    |
| M32ls     | Standard_M32ls      | P6 (64 GB)    | 4 P6 (64 GB)     | 3 P10 (128 GB)   | P20 (512 GB)   | P6 (64 GB)   | P20 (512 GB)    |
| M64ls     | Standard_M64ls      | P6 (64 GB)    | 4 P10 (128 GB)   | 3 P10 (128 GB)   | P20 (512 GB)   | P6 (64 GB)   | P30 (1024 GB)   |
| M64s      | Standard_M64s       | P10 (128 GB)  | 4 P15 (256 GB)   | 3 P15 (256 GB)   | P30 (1024 GB)  | P6 (64 GB)   | P30 (1024 GB)   |
| M64ms     | Standard_M64ms      | P6 (64 GB)    | 4 P20 (512 GB)   | 3 P15 (256 GB)   | P30 (1024 GB)  | P6 (64 GB)   | 2 P30 (1024 GB) |
| M128s     | Standard_M128s      | P10 (128 GB)  | 4 P20 (512 GB)   | 3 P15 (256 GB)   | P30 (1024 GB)  | P6 (64 GB)   | 2 P30 (1024 GB) |
| M128ms    | Standard_M128m      | P10 (128 GB)  | 4 P30 (1024 GB)  | 3 P15 (256 GB)   | P30 (1024 GB)  | P6 (64 GB)   | 4 P30 (1024 GB) |
| M208s_v2  | Standard_M208s_v2   | P10 (128 GB)  | 4 P30 (1024 GB)  | 3 P15 (256 GB)   | P30 (1024 GB)  | P6 (64 GB)   | 3 P40 (2048 GB) |
| M208ms_v2 | Standard_M208ms_v2  | P10 (128 GB)  | 4 P40 (2048 GB)  | 3 P15 (256 GB)   | P30 (1024 GB)  | P6 (64 GB)   | 3 P40 (2048 GB) |
| M416s_v2  | Standard_M416s_v2   | P10 (128 GB)  | 4 P40 (2048 GB)  | 3 P15 (256 GB)   | P30 (1024 GB)  | P6 (64 GB)   | 3 P40 (2048 GB) |
| M416ms_v2 | Standard_M416m_v2   | P10 (128 GB)  | 4 P50 (4096 GB)  | 3 P15 (256 GB)   | P30 (1024 GB)  | P6 (64 GB)   | 4 P50 (4096 GB) |
| E20ds_v4  | Standard_E20ds_v4   | P6 (64 GB)    | 3 P10 (128 GB)   | 1 Ultra (80 GB)  | P15 (256 GB)   | P6 (64 GB)   | 1 P15 (256 GB)  |
| E20ds_v5  | Standard_E20ds_v5   | P6 (64 GB)    | 3 P10 (128 GB)   | 1 Ultra (80 GB)  | P15 (256 GB)   | P6 (64 GB)   | 1 P15 (256 GB)  |
| E32ds_v4  | Standard_E32ds_v4   | P6 (64 GB)    | 3 P10 (128 GB)   | 1 Ultra (128 GB) | P15 (256 GB)   | P6 (64 GB)   | 1 P15 (256 GB)  |
| E32ds_v5  | Standard_E32ds_v5   | P6 (64 GB)    | 3 P10 (128 GB)   | 1 Ultra (128 GB) | P15 (256 GB)   | P6 (64 GB)   | 1 P15 (256 GB)  |
| E48ds_v4  | Standard_E48ds_v4   | P6 (64 GB)    | 3 P15 (256 GB)   | 1 Ultra (192 GB) | P20 (512 GB)   | P6 (64 GB)   | 1 P15 (256 GB)  |
| E48ds_v5  | Standard_E48ds_v4   | P6 (64 GB)    | 3 P15 (256 GB)   | 1 Ultra (192 GB) | P20 (512 GB)   | P6 (64 GB)   | 1 P15 (256 GB)  |
| E64ds_v3  | Standard_E64ds_v3   | P6 (64 GB)    | 3 P15 (256 GB)   | 1 Ultra (220 GB) | P20 (512 GB)   | P6 (64 GB)   | 1 P15 (256 GB)  |
| E64ds_v4  | Standard_E64ds_v4   | P6 (64 GB)    | 3 P15 (256 GB)   | 1 Ultra (256 GB) | P20 (512 GB)   | P6 (64 GB)   | 1 P15 (256 GB)  |
| E64ds_v5  | Standard_E64ds_v5   | P6 (64 GB)    | 3 P15 (256 GB)   | 1 Ultra (256 GB) | P20 (512 GB)   | P6 (64 GB)   | 1 P15 (256 GB)  |
| E96ds_v5  | Standard_E96ds_v4   | P6 (64 GB)    | 3 P15 (256 GB)   | 1 Ultra (256 GB) | P20 (512 GB)   | P6 (64 GB)   | 1 P15 (256 GB)  |

### AnyDB databases

The table below shows the default disk configuration for AnyDB systems. 

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


## Custom sizing file

The disk sizing for an SAP system can be defined using a custom sizing json file. The file is grouped in four sections: "db", "app", "scs", and "web" and each section contains a list of disk configuration names, for example for the database tier "M32ts", "M64s", etc. 

These sections contain the information for which is the default Virtual machine size and the list of disk to be deployed for each tier.

Create a file using the structure shown below and save the file in the same folder as the parameter file for the system, for instance 'XO1_sizes.json'.  Then, define the parameter `custom_disk_sizes_filename` in the parameter file. For example, `custom_disk_sizes_filename  = "XO1_db_sizes.json"`. 

> [!TIP]
> The path to the disk configuration needs to be relative to the folder containing the tfvars file.


The following sample code is an example configuration file. It defines three data disks (LUNs 0, 1, and 2), a log disk (LUN 9, using the Ultra SKU) and a backup disk (LUN 13, using the standard SSDN SKU). The application tier servers (Application, Central Services amd Web Dispatchers) will be deployed with jus a single 'sap' data disk.

```json
{
  "db" : {
    "Default": {
      "compute": {
        "vm_size"                 : "Standard_D4s_v3",
        "swap_size_gb"            : 2
      },
      "storage": [
        {
          "name"                  : "os",
          "count"                 : 1,
          "disk_type"             : "Premium_LRS",
          "size_gb"               : 128,
          "caching"               : "ReadWrite"
        },
        {
          "name"                  : "data",
          "count"                 : 3,
          "disk_type"             : "Premium_LRS",
          "size_gb"               : 256,
          "caching"               : "ReadWrite",
          "write_accelerator"     : false,
          "lun_start"             : 0
        },
        {
          "name"                  : "log",
          "count"                 : 1,
          "disk_type"             : "UltraSSD_LRS",
          "size_gb": 512,
          "disk-iops-read-write"  : 2048,
          "disk-mbps-read-write"  : 8,
          "caching"               : "None",
          "write_accelerator"     : false,
          "lun_start"             : 9
        },
        {
          "name"                  : "backup",
          "count"                 : 1,
          "disk_type"             : "StandardSSD_LRS",
          "size_gb"               : 256,
          "caching"               : "ReadWrite",
          "write_accelerator"     : false,
          "lun_start"             : 13
        }

      ]
    }
  },
  "app" : {
    "Default": {
      "compute": {
        "vm_size"                 : "Standard_D4s_v3"
      },
      "storage": [
        {
          "name"                  : "os",
          "count"                 : 1,
          "disk_type"             : "Premium_LRS",
          "size_gb"               : 128,
          "caching"               : "ReadWrite"
        },
        {
          "name"                  : "sap",
          "count"                 : 1,
          "disk_type"             : "Premium_LRS",
          "size_gb"               : 128,
          "caching"               : "ReadWrite",
          "write_accelerator"     : false,
          "lun_start"             : 0
        }

      ]
    }
  },
  "scs" : {
    "Default": {
      "compute": {
        "vm_size"                 : "Standard_D4s_v3"
      },
      "storage": [
        {
          "name"                  : "os",
          "count"                 : 1,
          "disk_type"             : "Premium_LRS",
          "size_gb"               : 128,
          "caching"               : "ReadWrite"
        },
        {
          "name"                  : "sap",
          "count"                 : 1,
          "disk_type"             : "Premium_LRS",
          "size_gb"               : 128,
          "caching"               : "ReadWrite",
          "write_accelerator"     : false,
          "lun_start"             : 0
        }

      ]
    }
  },
  "web" : {
    "Default": {
      "compute": {
        "vm_size"                 : "Standard_D4s_v3"
      },
      "storage": [
        {
          "name"                  : "os",
          "count"                 : 1,
          "disk_type"             : "Premium_LRS",
          "size_gb"               : 128,
          "caching"               : "ReadWrite"
        },
        {
          "name"                  : "sap",
          "count"                 : 1,
          "disk_type"             : "Premium_LRS",
          "size_gb"               : 128,
          "caching"               : "ReadWrite",
          "write_accelerator"     : false,
          "lun_start"             : 0
        }

      ]
    }
  }
}
```

## Add extra disks to existing system

If you need to add disks to an already deployed system, you can add a new block to your JSON structure. Include the attribute `append` in this block, and set the value to `true`. For example, in the following sample code, the last block contains the attribute `"append" : true,`. The last block adds a new disk to the database tier, which is already configured in the first `"data"` block in the code.

```json
{
  "db" : {
    "Default": {
      "compute": {
        "vm_size"                 : "Standard_D4s_v3",
        "swap_size_gb"            : 2
      },
      "storage": [
        {
          "name"                  : "os",
          "count"                 : 1,
          "disk_type"             : "Premium_LRS",
          "size_gb"               : 128,
          "caching"               : "ReadWrite"
        },
        {
          "name"                  : "data",
          "count"                 : 3,
          "disk_type"             : "Premium_LRS",
          "size_gb"               : 256,
          "caching"               : "ReadWrite",
          "write_accelerator"     : false,
          "start_lun"             : 0
        },
        {
          "name"                  : "log",
          "count"                 : 1,
          "disk_type"             : "UltraSSD_LRS",
          "size_gb": 512,
          "disk-iops-read-write"  : 2048,
          "disk-mbps-read-write"  : 8,
          "caching"               : "None",
          "write_accelerator"     : false,
          "start_lun"             : 9
        },
        {
          "name"                  : "backup",
          "count"                 : 1,
          "disk_type"             : "StandardSSD_LRS",
          "size_gb"               : 256,
          "caching"               : "ReadWrite",
          "write_accelerator"     : false,
          "start_lun"             : 13
        }
        ,
        {
          "name"                  : "data",
          "count"                 : 1,
          "disk_type"             : "Premium_LRS",
          "size_gb"               : 256,
          "caching"               : "ReadWrite",
          "write_accelerator"     : false,
          "append"                : true,
          "start_lun"             : 4
        }

      ]
    }
  }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Configure custom naming module](naming-module.md)

