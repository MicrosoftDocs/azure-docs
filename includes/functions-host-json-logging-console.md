---
title: include file
description: include file
services: functions
author: kaiwalter    
---

Controls the console logging when not in debugging mode.

```json
{
    "logging": {
    ...
        "console": {
          "isEnabled": "false"
        },
    ...
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|isEnabled|false|Enables or disables console logging.| 
