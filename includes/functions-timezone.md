---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/20/2020
ms.author: glenga
---

The default time zone used with the CRON expressions is Coordinated Universal Time (UTC). To have your CRON expression based on another time zone, create an app setting for your function app named `WEBSITE_TIME_ZONE`. 

The value of this setting depends on the operating system and plan on which your function app runs.

|Operating system |Plan |Value |
|-|-|-|
| **Windows** |All | Set the value to the name of the desired time zone as given by the second line from each pair given by the Windows command `tzutil.exe /L` |
| **Linux** |Premium<br/>Dedicated |Set the value to the name of the desired time zone as shown in the [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). |

> [!NOTE]
> `WEBSITE_TIME_ZONE` and `TZ` are not currently supported on the Linux Consumption plan.

For example, Eastern Time in the US (represented by `Eastern Standard Time` (Windows) or `America/New_York` (Linux)) currently uses UTC-05:00 during standard time and UTC-04:00 during daylight time. To have a timer trigger fire at 10:00 AM Eastern Time every day, create an app setting for your function app named `WEBSITE_TIME_ZONE`, set the value to `Eastern Standard Time` (Windows) or `America/New_York` (Linux), and then use the following NCRONTAB expression: 

```
"0 0 10 * * *"
```	

When you use `WEBSITE_TIME_ZONE` the time is adjusted for time changes in the specific timezone, including daylight saving time and changes in standard time.
