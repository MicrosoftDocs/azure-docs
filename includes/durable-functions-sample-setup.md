## Set up the sample

All samples are combined into a single function app package. To get started with the samples, follow the setup steps that are relevant for your development environment.

### For Visual Studio Development (Windows Only)

1. Download the [VSDFSampleApp.zip](https://azure.github.io/azure-functions-durable-extension/files/VSDFSampleApp.zip) file and unzip the contents.
2. Open the project in Visual Studio 2017 version 15.3 or later.
2. Install and run [Azure Storage Emulator](https://docs.microsoft.com/en-us/azure/storage/storage-use-emulator) version 5.2 or later. Alternatively, you can update the *local.appsettings.json* file with real Azure Storage connection strings.

The sample can now be run locally via F5. It can also be published directly to Azure and run in the cloud.

### For Azure Portal Development

1. Create a new function app at [functions.azure.com](https://functions.azure.com/signin).
2. Follow the [installation instructions](~/articles/azure-functions/durable-functions-installation.md) to configure Durable Functions.
3. Download the [DFSampleApp.zip](https://azure.github.io/azure-functions-durable-extension/files/DFSampleApp.zip) file.
4. Unzip the sample file into `D:\home\site\wwwroot` in the function app, using Kudu or FTP.

The code snippets and binding references shown in this article are specific to the portal experience, but they have a direct mapping to the equivalent Visual Studio development experience.