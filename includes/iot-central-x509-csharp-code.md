---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 12/17/2021
---

To modify the sample code to use the X.509 certificates:

1. In the **IoTHubDeviceSamples** Visual Studio solution, open the *Parameter.cs* file in the **TemperatureController** project.

1. Add the following two parameter definitions to the class:

    ```csharp
    [Option(
        'x',
        "CertificatePath",
        HelpText = "(Required if DeviceSecurityType is \"dps\"). \nThe device PFX file to use during device provisioning." +
        "\nDefaults to environment variable \"IOTHUB_DEVICE_X509_CERT\".")]
    public string CertificatePath { get; set; } = Environment.GetEnvironmentVariable("IOTHUB_DEVICE_X509_CERT");

    [Option(
        'p',
        "CertificatePassword",
        HelpText = "(Required if DeviceSecurityType is \"dps\"). \nThe password of the PFX certificate file." +
        "\nDefaults to environment variable \"IOTHUB_DEVICE_X509_PASSWORD\".")]
    public string CertificatePassword { get; set; } = Environment.GetEnvironmentVariable("IOTHUB_DEVICE_X509_PASSWORD");
    ```

    Save the changes.

1. In the **IoTHubDeviceSamples** Visual Studio solution, open the *Program.cs* file in the **TemperatureController** project.

1. Add the following `using` statements:

    ```csharp
    using System.Security.Cryptography.X509Certificates;
    using System.IO;
    ```

1. Add the following method to the class:

    ```csharp
    private static X509Certificate2 LoadProvisioningCertificate(Parameters parameters)
    {
        var certificateCollection = new X509Certificate2Collection();
        certificateCollection.Import(
            parameters.CertificatePath,
            parameters.CertificatePassword,
            X509KeyStorageFlags.UserKeySet);

        X509Certificate2 certificate = null;

        foreach (X509Certificate2 element in certificateCollection)
        {
            Console.WriteLine($"Found certificate: {element?.Thumbprint} {element?.Subject}; PrivateKey: {element?.HasPrivateKey}");
            if (certificate == null && element.HasPrivateKey)
            {
                certificate = element;
            }
            else
            {
                element.Dispose();
            }
        }

        if (certificate == null)
        {
            throw new FileNotFoundException($"{parameters.CertificatePath} did not contain any certificate with a private key.");
        }

        Console.WriteLine($"Using certificate {certificate.Thumbprint} {certificate.Subject}");

        return certificate;
    }
    ```

1. In the `SetupDeviceClientAsync` method, replace the block of code for `case "dps"` with the following code:

    ```csharp
    case "dps":
        s_logger.LogDebug($"Initializing via DPS");
        Console.WriteLine($"Loading the certificate...");
        X509Certificate2 certificate = LoadProvisioningCertificate(parameters);
        DeviceRegistrationResult dpsRegistrationResult = await ProvisionDeviceAsync(parameters, certificate, cancellationToken);
        var authMethod = new DeviceAuthenticationWithX509Certificate(dpsRegistrationResult.DeviceId, certificate);
        deviceClient = InitializeDeviceClient(dpsRegistrationResult.AssignedHub, authMethod);
        break;
    ```

1. Replace the `ProvisionDeviceAsync` method with the following code:

    ```csharp
    private static async Task<DeviceRegistrationResult> ProvisionDeviceAsync(Parameters parameters, X509Certificate2 certificate, CancellationToken cancellationToken)
    {
        SecurityProvider security = new SecurityProviderX509Certificate(certificate);
        ProvisioningTransportHandler mqttTransportHandler = new ProvisioningTransportHandlerMqtt();
        ProvisioningDeviceClient pdc = ProvisioningDeviceClient.Create(parameters.DpsEndpoint, parameters.DpsIdScope, security, mqttTransportHandler);

        var pnpPayload = new ProvisioningRegistrationAdditionalData
        {
            JsonData = PnpConvention.CreateDpsPayload(ModelId),
        };
        return await pdc.RegisterAsync(pnpPayload, cancellationToken);
    }
    ```

    Save the changes.
