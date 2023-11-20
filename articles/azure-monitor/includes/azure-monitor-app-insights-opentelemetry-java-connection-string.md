---
author: AaronMaxwell
ms.author: aaronmax
ms.service: azure-monitor
ms.topic: include
ms.date: 10/16/2023
---

Connection string is required. You can find your connection string in your Application Insights resource.

:::image type="content" source="media/java-ipa/connection-string.png" alt-text="Screenshot that shows an Application Insights connection string.":::


```json
{
  "connectionString": "..."
}
```

You can also set the connection string by using the environment variable `APPLICATIONINSIGHTS_CONNECTION_STRING`. It then takes precedence over the connection string specified in the JSON configuration.

Or you can set the connection string by using the Java system property `applicationinsights.connection.string`. It also takes precedence over the connection string specified in the JSON configuration.

You can also set the connection string by specifying a file to load the connection string from.

If you specify a relative path, it's resolved relative to the directory where `applicationinsights-agent-3.4.18.jar` is located.

```json
{
  "connectionString": "${file:connection-string-file.txt}"
}
```

The file should contain only the connection string and nothing else.

Not setting the connection string disables the Java agent.

If you have multiple applications deployed in the same JVM and want them to send telemetry to different connection strings, see [Connection string overrides (preview)](#connection-string-overrides-preview).
