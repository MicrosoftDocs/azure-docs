---
title: Add more disks to SAP deployment automation configuration
description: Configure more disks for your system in the SAP deployment automation framework. Add extra disks to a new system, or an existing system.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Add more disks to SAP deployment automation configuration

By default, the [SAP deployment automation framework](automation-deployment-framework.md) sets the number of disks in a configuration. As needed, you can [create more disks in a new system](#add-extra-disks-to-new-system). You can also [create more disks in an existing system](#add-extra-disks-to-existing-system) that you've already deployed.

> [!TIP]
> When possible, it's a best practice to increase the disk size instead of adding more disks.

### Add extra disks to new system

You can add multiple nodes to the structure to create more disks that meet your business requirements. 

The following sample code is an example configuration for the database tier. The three data disks are LUN 0, LUN 1, and LUN 2. A log disk, LUN 9, uses the Ultra SKU. A backup disk, LUN 13, uses the standard SSDN SKU.

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
          "size_gb"               : 127,
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
          "disk_type"             : "Premium_LRS",
          "size_gb"               : 256,
          "caching"               : "ReadWrite",
          "write_accelerator"     : false,
          "start_lun"             : 13
        }

      ]
    }
  }
}
```

### Add extra disks to existing system

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
          "size_gb"               : 127,
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
          "disk_type"             : "Premium_LRS",
          "size_gb"               : 256,
          "caching"               : "ReadWrite",
          "write_accelerator"     : false,
          "start_lun"             : 13
        }
        ,
        {
          "name"                  : "data",
          "count"                 : 3,
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
> [Configure custom naming module](automation-naming-module.md)

