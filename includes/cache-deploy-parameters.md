
### redisCacheName

The name of the Azure Redis Cache

    "redisCacheName": {
      "type": "string"
    }

### redisCacheSKU

The pricing tier of the new Azure Redis Cache.

    "redisCacheSKU": {
      "type": "string",
      "allowedValues": [ "Basic", "Standard" ],
      "defaultValue": "Basic"
    }

### redisCacheFamily

    "redisCacheFamily": {
      "type": "string",
      "allowedValues": [ "C" ],
      "defaultValue": "C"
    }

### redisCacheCapacity

The size of the new Azure Redis Cache instance. 0 = 250 MB, 1 = 1 GB, 2 = 2.5 GB, 3 = 6 GB, 4 = 13 GB, 5 = 26 GB, 6 = 53 GB

    "redisCacheCapacity": {
      "type": "int",
      "allowedValues": [ 0, 1, 2, 3, 4, 5, 6 ],
      "defaultValue": 0
    }

### redisCacheVersion

The Redis server version of the new cache.

    "redisCacheVersion": {
      "type": "string",
      "allowedValues": [ "2.8" ],
      "defaultValue": "2.8"
    }
