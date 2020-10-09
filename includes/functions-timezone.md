The default time zone used with the CRON expressions is Coordinated Universal Time (UTC). To have your CRON expression based on another time zone, create an app setting for your function app named `WEBSITE_TIME_ZONE`. 

The value of this setting depends on the operating system and plan on which your function app runs.

|Operating system |Plan |Value |
|-|-|-|
| **Windows** |All | Set the value to the name of the desired time zone as shown in the [Microsoft Time Zone Index](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-vista/cc749073(v=ws.10)). |
| **Linux** |Premium<br/>Dedicated |Set the value to the name of the desired time zone as shown in the [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). |

> [!NOTE]
> `WEBSITE_TIME_ZONE` is not currently supported on the Linux Consumption plan.

For example, *Eastern Standard Time* (Windows) or *America/New_York* (Linux) is UTC-05:00. To have your timer trigger fire at 10:00 AM EST every day, use the following NCRONTAB expression that accounts for UTC time zone:

```
"0 0 15 * * *"
```	

Or create an app setting for your function app named `WEBSITE_TIME_ZONE`, set the value to `Eastern Standard Time` (Windows) or `America/New_York` (Linux), and then use the following NCRONTAB expression: 

```
"0 0 10 * * *"
```	

When you use `WEBSITE_TIME_ZONE`, the time is adjusted for time changes in the specific timezone, such as daylight savings time. 
