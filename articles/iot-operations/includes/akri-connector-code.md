---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 01/06/2026
ms.author: dobett
---

The following steps assume you created a .NET project called **MyConnector**.

> [!IMPORTANT]
> The following example code is for illustrative purposes only and is not intended to be used in production. In a production connector, you should implement robust error handling and retry logic, and ensure that any credentials used to connect to the asset are stored and used securely. A production quality connector must implement the contract described in the [Akri operator and connector contract](https://github.com/Azure/iot-operations-sdks/blob/main/doc/akri_connector/Akri%20operator%20and%20connector%20contract.md) document in the SDKs repository.

To represent the thermostat status, create a file called **ThermostatStatus.cs** in the `MyConnector` folder in the workspace with the following content. This file models the JSON response from the REST endpoint:

```c#
using System.Text.Json.Serialization;

namespace MyConnector
{
    internal class ThermostatStatus
    {
        [JsonPropertyName("desiredTemperature")]
        public double? DesiredTemperature { get; set; }

        [JsonPropertyName("currentTemperature")]
        public double? CurrentTemperature { get; set; }
    }
}
```

Implement the `SampleDatasetAsync` method in the provided `DatasetSampler` class. The method takes a `Dataset` as a parameter. A `Dataset` contains the data points for the connector to process.

1. Open the file `MyConnector/DatasetSampler.cs` in your VS Code workspace.

1. To pass in the required data for processing the endpoint data, add a constructor to the `DatasetSampler` class. The class uses the `HttpClient` and `EndpointProfileCredentials` to connect to and authenticate with the asset endpoint. Add the JSON serializer options and the `DisposeAsync` method to clean up the `HttpClient` when the `DatasetSampler` is disposed:

    ```c#
    private readonly HttpClient _httpClient;
    private readonly string _assetName;
    private readonly EndpointCredentials? _credentials;

    private readonly static JsonSerializerOptions _jsonSerializerOptions = new()
    {
        AllowTrailingCommas = true,
    };

    public DatasetSampler(HttpClient httpClient, string assetName, EndpointCredentials? credentials)
    {
        _httpClient = httpClient;
        _assetName = assetName;
        _credentials = credentials;
    }

    public ValueTask DisposeAsync()
    {
        _httpClient.Dispose();
        return ValueTask.CompletedTask;
    }
    ```

1. Modify the `GetSamplingIntervalAsync` method to return a sampling interval of three seconds:

    ```c#
    public Task<TimeSpan> GetSamplingIntervalAsync(AssetDataset dataset, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(TimeSpan.FromSeconds(3));
    }
    ```

    > [!NOTE]
    > For simplicity, this example uses a fixed sampling interval. In a production connector, you can make the sampling interval configurable by using the connector metadata to define a sampling interval property that a user can set in the operations experience UI.

1. Replace the existing `SampleDatasetAsync` method with the following outline:

    ```c#
    public async Task<byte[]> SampleDatasetAsync(AssetDataset dataset, CancellationToken cancellationToken = default)
    {
        int retryCount = 0;
        while (true)
        {
            try
            {
                // TODO: Implement your dataset sampling logic here.
            }
            catch (Exception ex)
            {
                if (++retryCount >= 3)
                {
                    throw new InvalidOperationException($"Failed to sample dataset with name {dataset.Name} in asset with name {_assetName}. Error: {ex.Message}", ex);
                }
                await Task.Delay(1000, cancellationToken);
            }
        }
    }
    ```

1. In the `try` block in the `SampleDatasetAsync` method, add the following code to retrieve the temperature data from the `DataSet` and extract the data source paths. These paths are part of the URLs used to fetch the data from the REST endpoint. The `currentTemperature` and `desiredTemperature` data points were modeled previously in the `ThermostatStatus` class:

    ```c#
    if (_credentials != null && _credentials.Username != null && _credentials.Password != null)
    {
        // Note that this sample uses username + password for authenticating the connection to the asset. In general,
        // x509 authentication should be used instead (if available) as it is more secure.
        string httpServerUsername = _credentials.Username;
        string httpServerPassword = _credentials.Password;
        var byteArray = Encoding.ASCII.GetBytes($"{httpServerUsername}:{httpServerPassword}");
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
    }

    ThermostatStatus mergedStatus = new();

    foreach (var dataPoint in dataset.DataPoints)
    {
        string path = dataPoint.DataSource!;

        var response = await _httpClient.GetAsync(path, cancellationToken);

        if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
        {
            throw new Exception("Failed to authorize request to HTTP server. Check credentials configured in rest-server-device-definition.yaml.");
        }

        response.EnsureSuccessStatusCode();

        var bytes = await response.Content.ReadAsByteArrayAsync(cancellationToken);
        ThermostatStatus partial = JsonSerializer.Deserialize<ThermostatStatus>(bytes, _jsonSerializerOptions)!;

        if (partial.CurrentTemperature.HasValue)
        {
            mergedStatus.CurrentTemperature = partial.CurrentTemperature;
        }
        if (partial.DesiredTemperature.HasValue)
        {
            mergedStatus.DesiredTemperature = partial.DesiredTemperature;
        }
    }

    return JsonSerializer.SerializeToUtf8Bytes(mergedStatus, _jsonSerializerOptions);
    ```

    > [!TIP]
    > Optionally, the connector can register a schema in the schema registry to enable other Azure IoT Operations to understand the format of the messages.

1. Finally, import the necessary types:

    ```c#
    using Azure.Iot.Operations.Connector;
    using Azure.Iot.Operations.Connector.Files;
    using Azure.Iot.Operations.Services.AssetAndDeviceRegistry.Models;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Text.Json;
    ```

The final version of the code looks similar to [DatasetSampler](https://raw.githubusercontent.com/Azure/iot-operations-sdks/refs/heads/main/dotnet/samples/Connectors/PollingRestThermostatConnector/ThermostatStatusDatasetSampler.cs).

Implement the `CreateDatasetSampler` method in the `DatasetSamplerProvider` class. This class creates `DataSetSampler` objects to inject into the application as required.

1. Open the `MyConnector/DatasetSamplerProvider.cs` file in your VS Code workspace.

1. In the `CreateDatasetSampler` method, return a `DatasetSampler` along with the `endpointCredentials`, if the dataset name is `thermostat_status`:

    ```c#
    if (dataset.Name.Equals("thermostat_status"))
    {
        if (device.Endpoints != null
            && device.Endpoints.Inbound != null
            && device.Endpoints.Inbound.TryGetValue(inboundEndpointName, out var inboundEndpoint))
        {
            var httpClient = new HttpClient()
            {
                BaseAddress = new Uri(inboundEndpoint.Address),
            };

            return new DatasetSampler(httpClient, assetName, endpointCredentials);
        }
    }

    throw new InvalidOperationException($"Unrecognized dataset with name {dataset.Name} on asset with name {assetName}");
    ```

    > [!NOTE]
    > For simplicity, this example assumes that the dataset name is always `thermostat_status`. In a production connector, you can implement additional logic to handle multiple datasets.

The final version of the code looks similar to [DatasetSamplerProvider](https://raw.githubusercontent.com/Azure/iot-operations-sdks/refs/heads/main/dotnet/samples/Connectors/PollingRestThermostatConnector/RestThermostatDatasetSamplerProvider.cs).

Implement the MessageSchemaProvider class to register a message schema for the dataset. This step is optional but allows other Azure IoT Operations to understand the format of the messages from the connector:

1. Open the `MyConnector/MessageSchemaProvider.cs` file in your VS Code workspace.

1. Add a string  to the class that contains the JSON schema for the `thermostat_status` dataset:

    ```c#
    private static readonly string _datasetJsonSchema = """
    {
        "$schema": "https://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
        "desiredTemperature": {
                "type": "number"
            },
            "currentTemperature": {
                "type": "number"
            }
        }
    }
    """;
    ```

1. In the `GetMessageSchemaAsync` method, return the JSON schema for the `thermostat_status` dataset:

    ```c#
    public Task<ConnectorMessageSchema?> GetMessageSchemaAsync(Device device, Asset asset, string datasetName, AssetDataset dataset, CancellationToken cancellationToken = default)
    {
        if (datasetName.Equals("thermostat_status", StringComparison.OrdinalIgnoreCase))
        {
            ConnectorMessageSchema? schema = new ConnectorMessageSchema(_datasetJsonSchema, Azure.Iot.Operations.Services.SchemaRegistry.SchemaRegistry.Format.JsonSchemaDraft07, Azure.Iot.Operations.Services.SchemaRegistry.SchemaRegistry.SchemaType.MessageSchema, "1", null);
            return Task.FromResult((ConnectorMessageSchema?)schema);
        }

        return Task.FromResult((ConnectorMessageSchema?)null);
    }
    ```

The final version of the code looks similar to [MessageSchemaProvider](https://raw.githubusercontent.com/Azure/iot-operations-sdks/refs/heads/main/dotnet/samples/Connectors/PollingRestThermostatConnector/MessageSchemaProvider.cs).
