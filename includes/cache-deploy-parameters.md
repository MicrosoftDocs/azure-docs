---
author: wesmc7777
ms.service: redis-cache 
ms.topic: include
ms.date: 04/02/2019
ms.author: wesmc
---

### cacheSKUName

The pricing tier of the new Azure Cache for Redis.

```json
    "cacheSKUName": {
      "type": "string",
      "allowedValues": [
        "Basic",
        "Standard",
        "Premium"
      ],
      "defaultValue": "Basic",
      "metadata": {
        "description": "The pricing tier of the new Azure Cache for Redis."
      }
    },
```

The template defines the values that are permitted for this parameter (Basic, Standard, or Premium), and assigns a default value (Basic) if no value is specified. Basic provides a single node with multiple sizes available up to 53 GB. Standard provides two-node Primary/Replica with multiple sizes available up to 53 GB and 99.9% SLA.

### cacheSKUFamily

The family for the sku.

```json
    "cacheSKUFamily": {
      "type": "string",
      "allowedValue/s": [
        "C",
        "P"
      ],
      "defaultValue": "C",
      "metadata": {
        "description": "The family for the sku."
      }
    },
```

### cacheSKUCapacity

The size of the new Azure Cache for Redis instance.

For the Basic and Standard families:

```json
    "cacheSKUCapacity": {
      "type": "int",
      "allowedValues": [
        0,
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "defaultValue": 0,
      "metadata": {
        "description": "The size of the new Azure Cache for Redis instance. "
      }
    }
```

The Premium value cache capacity is defined the same, except the allowed values run from 1 to 5 instead of from 0 to 6.

The template defines the integer values that are permitted for this parameter (0 through 6 for the Basic and Standard families; 1 through 5 for the Premium family). If no value is specified, the template assigns a default value of 0 for Basic and Standard, 1 for Premium.

The values correspond to following cache sizes:

| Value | Basic and Standard<br>cache size | Premium<br>cache size |
| :---: | :------------------------------: | :-------------------: |
| 0     | 250 MB (default)                 | n/a                   |
| 1     | 1 GB                             | 6 GB (default)        |
| 2     | 2.5 GB                           | 13 GB                 |
| 3     | 6 GB                             | 26 GB                 |
| 4     | 13 GB                            | 53 GB                 |
| 5     | 26 GB                            | 120 GB                |
| 6     | 53 GB                            | n/a                   |
