---
title: Collecting custom JSON data sources with the Log Analytics agent for Linux in Azure Monitor
description: Custom JSON data sources can be collected into Azure Monitor using the Log Analytics Agent for Linux.  These custom data sources can be simple scripts returning JSON such as curl or one of FluentD's 300+ plugins. This article describes the configuration required for this data collection.
ms.topic: conceptual
ms.date: 06/01/2023
ms.reviewer: JeffWo

---

# Collecting custom JSON data sources with the Log Analytics agent for Linux in Azure Monitor
[!INCLUDE [log-analytics-agent-note](../../../includes/log-analytics-agent-note.md)]

Custom JSON data sources can be collected into [Azure Monitor](../data-platform.md) using the Log Analytics agent for Linux.  These custom data sources can be simple scripts returning JSON such as [curl](https://curl.haxx.se/) or one of [FluentD's 300+ plugins](https://www.fluentd.org/plugins/all). This article describes the configuration required for this data collection.


> [!NOTE]
> Log Analytics agent for Linux v1.1.0-217+ is required for Custom JSON Data. 
> This collection flow only works with MMA.  Consider moving to the AMA agent and using the additional collection features available there
> 

## Configuration

### Configure input plugin

To collect JSON data in Azure Monitor, add `oms.api.` to the start of a FluentD tag in an input plugin.

For example, following is a separate configuration file `exec-json.conf` in `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.d/`.  This uses the FluentD plugin `exec` to run a curl command every 30 seconds.  The output from this command is collected by the JSON output plugin.

```xml
<source>
  type exec
  command 'curl localhost/json.output'
  format json
  tag oms.api.httpresponse
  run_interval 30s
</source>

<match oms.api.httpresponse>
  type out_oms_api
  log_level info

  buffer_chunk_limit 5m
  buffer_type file
  buffer_path /var/opt/microsoft/omsagent/<workspace id>/state/out_oms_api_httpresponse*.buffer
  buffer_queue_limit 10
  flush_interval 20s
  retry_limit 10
  retry_wait 30s
</match>
```

The configuration file added under `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.d/` will require to have its ownership changed with the following command.

`sudo chown omsagent:omiusers /etc/opt/microsoft/omsagent/conf/omsagent.d/exec-json.conf`

### Configure output plugin 
Add the following output plugin configuration to the main configuration in `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.conf` or as a separate configuration file placed in `/etc/opt/microsoft/omsagent/<workspace id>/conf/omsagent.d/`

```xml
<match oms.api.**>
  type out_oms_api
  log_level info

  buffer_chunk_limit 5m
  buffer_type file
  buffer_path /var/opt/microsoft/omsagent/<workspace id>/state/out_oms_api*.buffer
  buffer_queue_limit 10
  flush_interval 20s
  retry_limit 10
  retry_wait 30s
</match>
```

### Restart Log Analytics agent for Linux
Restart the Log Analytics agent for Linux service with the following command.

```console
sudo /opt/microsoft/omsagent/bin/service_control restart 
```

## Output
The data will be collected in Azure Monitor with a record type of `<FLUENTD_TAG>_CL`.

For example, the custom tag `tag oms.api.tomcat` in Azure Monitor with a record type of `tomcat_CL`.  You could retrieve all records of this type with the following log query.

```console
Type=tomcat_CL
```

Nested JSON data sources are supported, but are indexed based off of parent field. For example, the following JSON data is returned from a log query as `tag_s : "[{ "a":"1", "b":"2" }]`.

```json
{
    "tag": [{
      "a":"1",
      "b":"2"
    }]
}
```


## Next steps
* Learn about [log queries](../logs/log-query-overview.md) to analyze the data collected from data sources and solutions.
