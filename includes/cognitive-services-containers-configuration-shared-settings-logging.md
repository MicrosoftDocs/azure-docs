---
author: IEvangelist
ms.author: dapine
ms.date: 06/25/2019
ms.service: cognitive-services
ms.topic: include
---

The `Logging` settings manage ASP.NET Core logging support for your container. You can use the same configuration settings and values for your container that you use for an ASP.NET Core application. 

The following logging providers are supported by the container:

|Provider|Purpose|
|--|--|
|[Console](/aspnet/core/fundamentals/logging/#console-provider)|The ASP.NET Core `Console` logging provider. All of the ASP.NET Core configuration settings and default values for this logging provider are supported.|
|[Debug](/aspnet/core/fundamentals/logging/#debug-provider)|The ASP.NET Core `Debug` logging provider. All of the ASP.NET Core configuration settings and default values for this logging provider are supported.|
|[Disk](#disk-logging)|The JSON logging provider. This logging provider writes log data to the output mount.|

This container command stores logging information in the JSON format to the output mount:

```bash
docker run --rm -it -p 5000:5000 \
--memory 2g --cpus 1 \
--mount type=bind,src=/home/azureuser/output,target=/output \
<registry-location>/<image-name> \
Eula=accept \
Billing=<endpoint> \
ApiKey=<api-key> \
Logging:Disk:Format=json \
Mounts:Output=/output
```

This container command shows debugging information, prefixed with `dbug`, while the container is running:

```bash
docker run --rm -it -p 5000:5000 \
--memory 2g --cpus 1 \
<registry-location>/<image-name> \
Eula=accept \
Billing=<endpoint> \
ApiKey=<api-key> \
Logging:Console:LogLevel:Default=Debug
```

### Disk logging

The `Disk` logging provider supports the following configuration settings:

| Name | Data type | Description |
|------|-----------|-------------|
| `Format` | String | The output format for log files.<br/> **Note:** This value must be set to `json` to enable the logging provider. If this value is specified without also specifying an output mount while instantiating a container, an error occurs. |
| `MaxFileSize` | Integer | The maximum size, in megabytes (MB), of a log file. When the size of the current log file meets or exceeds this value, a new log file is started by the logging provider. If -1 is specified, the size of the log file is limited only by the maximum file size, if any, for the output mount. The default value is 1. |

For more information about configuring ASP.NET Core logging support, see [Settings file configuration](/aspnet/core/fundamentals/logging/).