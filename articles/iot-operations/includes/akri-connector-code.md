---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 01/06/2026
ms.author: dobett
---

The following steps assume you created a .NET project called **MyConnector**.

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

To add a data point configuration setting, create a file called **DataPointConfiguration.cs** in the `MyConnector` folder in the workspace with the following content. This file models a configuration setting for a data point that the user specifies in the operations experience UI:

```c#
using System.Text.Json.Serialization;

namespace MyConnector
{
    public class DataPointConfiguration
    {
        [JsonPropertyName("HttpRequestMethod")]
        public string? HttpRequestMethod { get; set; }
    }
} 
```

Implement the `SampleDatasetAsync` method in the provided `DatasetSampler` class. The method takes a `Dataset` as a parameter. A `Dataset` contains the data points for the connector to process.

1. Open the file `MyConnector/DatasetSampler.cs` in your VS Code workspace.

1. To pass in the required data for processing the endpoint data, add a constructor to the `DatasetSampler` class . The class uses the `HttpClient` and `EndpointProfileCredentials` to connect to and authenticate with the asset endpoint:

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

1. In the `try` block in the `SampleDatasetAsync` method, add the following code to retrieve each `DataPoint` from the `DataSet` and extract the data source paths. These paths are part of the URLs used to fetch the data from the REST endpoint. The `currentTemperature` and `desiredTemperature` data points were modeled previously in the `ThermostatStatus` class. The HTTP request method is extracted from the data point configuration modeled in the `DataPointConfiguration` class:

    ```c#
    AssetDatasetDataPointSchemaElement httpServerDesiredTemperatureDataPoint = dataset.DataPoints!.Where(x => x.Name!.Equals("desiredTemperature"))!.First();
    HttpMethod httpServerDesiredTemperatureHttpMethod = HttpMethod.Parse(JsonSerializer.Deserialize<DataPointConfiguration>(httpServerDesiredTemperatureDataPoint.DataPointConfiguration!, _jsonSerializerOptions)!.HttpRequestMethod);
    string httpServerDesiredTemperatureRequestPath = httpServerDesiredTemperatureDataPoint.DataSource!;

    AssetDatasetDataPointSchemaElement httpServerCurrentTemperatureDataPoint = dataset.DataPoints!.Where(x => x.Name!.Equals("currentTemperature"))!.First();
    HttpMethod httpServerCurrentTemperatureHttpMethod = HttpMethod.Parse(JsonSerializer.Deserialize<DataPointConfiguration>(httpServerCurrentTemperatureDataPoint.DataPointConfiguration!, _jsonSerializerOptions)!.HttpRequestMethod);
    string httpServerCurrentTemperatureRequestPath = httpServerCurrentTemperatureDataPoint.DataSource!;
    ```

    > [!NOTE]
    > For simplicity, this example only shows you how to retrieve the HTTP method to use from the data point configuration. The sample doesn't use this value when it makes the HTTP request.

1. In the same method, set up the authentication by using the provided credentials if authenticated endpoints are in use:

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
    ```

    This code extracts the credentials and adds them to the authorization header. The `DatasetSampler` implements basic authentication with username and password credentials.

1. Then add code to make an HTTP request to the endpoint, deserialize the response, and extract both the `CurrentTemperature` and `DesiredTemperature` properties and place them in a `ThermostatStatus` object:

    ```c#
    var currentTemperatureHttpResponse = await _httpClient.GetAsync(httpServerCurrentTemperatureRequestPath);
    var desiredTemperatureHttpResponse = await _httpClient.GetAsync(httpServerDesiredTemperatureRequestPath);

    if (currentTemperatureHttpResponse.StatusCode == System.Net.HttpStatusCode.Unauthorized
        || desiredTemperatureHttpResponse.StatusCode == System.Net.HttpStatusCode.Unauthorized)
    {
        throw new Exception("Failed to authorize request to HTTP server. Check credentials configured in rest-server-device-definition.yaml.");
    }

    currentTemperatureHttpResponse.EnsureSuccessStatusCode();
    desiredTemperatureHttpResponse.EnsureSuccessStatusCode();

    ThermostatStatus thermostatStatus = new()
    {
        CurrentTemperature = (JsonSerializer.Deserialize<ThermostatStatus>(await currentTemperatureHttpResponse.Content.ReadAsStreamAsync(), _jsonSerializerOptions)!).CurrentTemperature,
        DesiredTemperature = (JsonSerializer.Deserialize<ThermostatStatus>(await desiredTemperatureHttpResponse.Content.ReadAsStreamAsync(), _jsonSerializerOptions)!).DesiredTemperature
    };
    ```

1. Next, serialize the status to JSON and return the response to the endpoint. In this example, the HTTP response payload already matches the expected message schema, so no translation is necessary:

    ```c#
    // The HTTP response payload matches the expected message schema, so return it as-is
    return Encoding.UTF8.GetBytes(JsonSerializer.Serialize(thermostatStatus));
    ```

    > [!TIP]
    > Optionally, the connector can register a schema in the schema registry to enable other Azure IoT Operations to understand the format of the messages.

1. Finally, import the necessary types:

    ```c#
    using Azure.Iot.Operations.Connector.Files;
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