---
title: Set up CI/CD pipeline with Azure Cosmos DB Emulator build task
description: Tutorial on how to set up build and release workflow in Azure DevOps using the Cosmos DB emulator build task
ms.service: cosmos-db
ms.topic: how-to
ms.date: 01/28/2020
ms.author: esarroyo
author: StefArroyo 
ms.reviewer: sngun
ms.custom: devx-track-csharp
---
# Set up a CI/CD pipeline with the Azure Cosmos DB Emulator build task in Azure DevOps
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

> [!NOTE]
> Due to the full removal of Windows 2016 hosted runners on April 1st, 2022, this method of using the Cosmos DB emulator with build task in Azure DevOps is no longer supported. We are actively working on an alternative solutions. Meanwhile, you can follow the below instructions to leverage the Azure Cosmos DB emulator which comes pre-installed when using the "windows-2019" agent type.

The Azure Cosmos DB Emulator provides a local environment that emulates the Azure Cosmos DB service for development purposes. The emulator allows you to develop and test your application locally, without creating an Azure subscription or incurring any costs.

## PowerShell Task for Emulator
A typical PowerShell based task that will start the Cosmos DB emulator can be scripted as follows:

```Powershell

# Write your PowerShell commands here.

Write-Host "Hello World"
dir "C:\Program Files\Azure Cosmos DB Emulator\"

Import-Module "$env:ProgramFiles\Azure Cosmos DB Emulator\PSModules\Microsoft.Azure.CosmosDB.Emulator"

<<<<<<< HEAD
$startEmulatorCmd = "Start-CosmosDbEmulator -NoFirewall -NoUI"
Write-Host $startEmulatorCmd
Invoke-Expression -Command $startEmulatorCmd

$command = "curl `"https://localhost:8081/_explorer/index.html`""
Write-Host $command
$resultCommand = Invoke-Expression $command
Write-Host $resultCommand

# Pipe an emulator info object to the output stream

$Emulator = Get-Item "$env:ProgramFiles\Azure Cosmos DB Emulator\Microsoft.Azure.Cosmos.Emulator.exe"
$IPAddress = Get-NetIPAddress -AddressFamily IPV4 -AddressState Preferred -PrefixOrigin Manual | Select-Object IPAddress

New-Object PSObject @{
Emulator = $Emulator.BaseName
Version = $Emulator.VersionInfo.ProductVersion
Endpoint = @($(hostname), $IPAddress.IPAddress) | ForEach-Object { "https://${_}:8081/" }
MongoDBEndpoint = @($(hostname), $IPAddress.IPAddress) | ForEach-Object { "mongodb://${_}:10255/" }
CassandraEndpoint = @($(hostname), $IPAddress.IPAddress) | ForEach-Object { "tcp://${_}:10350/" }
GremlinEndpoint = @($(hostname), $IPAddress.IPAddress) | ForEach-Object { "http://${_}:8901/" }
TableEndpoint = @($(hostname), $IPAddress.IPAddress) | ForEach-Object { "https://${_}:8902/" }
IPAddress = $IPAddress.IPAddress
=======
In this tutorial, you'll add the task to the beginning to ensure the emulator is available before our tests execute.

### Add the task using YAML

This step is optional and it's only required if you are setting up the CI/CD pipeline by using a YAML task. In such cases, you can define the YAML task as shown in the following code:

```yml
- task: azure-cosmosdb.emulator-public-preview.run-cosmosdbemulatorcontainer.CosmosDbEmulator@2
  displayName: 'Run Azure Cosmos DB Emulator'

- script: yarn test
  displayName: 'Run API tests (Cosmos DB)'
  env:
    HOST: $(CosmosDbEmulator.Endpoint)
    # Hardcoded key for emulator, not a secret
    AUTH_KEY: C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
    # The emulator uses a self-signed cert, disable TLS auth errors
    NODE_TLS_REJECT_UNAUTHORIZED: '0'
```

## Configure tests to use the emulator

Now, we'll configure our tests to use the emulator. The emulator build task exports an environment variable – ‘CosmosDbEmulator.Endpoint’ – that any tasks further in the build pipeline can issue requests against. 

In this tutorial, we'll use the [Visual Studio Test task](https://github.com/Microsoft/azure-pipelines-tasks/blob/master/Tasks/VsTestV2/README.md) to run unit tests configured via a **.runsettings** file. To learn more about unit test setup, visit the [documentation](/visualstudio/test/configure-unit-tests-by-using-a-dot-runsettings-file?preserve-view=true&view=vs-2017). The complete Todo application code sample that you use in this document is available on [GitHub](https://github.com/Azure-Samples/cosmos-dotnet-core-todo-app)

Below is an example of a **.runsettings** file that defines parameters to be passed into an application's unit tests. Note the `authKey` variable used is the [well-known key](./local-emulator.md#authenticate-requests) for the emulator. This `authKey` is the key expected by the emulator build task and should be defined in your **.runsettings** file.

```csharp
<RunSettings>
    <TestRunParameters>
    <Parameter name="endpoint" value="https://localhost:8081" />
    <Parameter name="authKey" value="C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==" />
    <Parameter name="database" value="ToDoListTest" />
    <Parameter name="collection" value="ItemsTest" />
  </TestRunParameters>
</RunSettings>
```

If you are setting up a CI/CD pipeline for an application that uses the Azure Cosmos DB's API for MongoDB, the connection string by default includes the port number 10255. However, this port is not currently open, as an alternate, you should use port 10250 to establish the connection. The Azure Cosmos DB's API for MongoDB connection string remains the same except the supported port number is 10250 instead of 10255.

These parameters `TestRunParameters` are referenced via a `TestContext` property in the application's test project. Here is an example of a test that runs against Cosmos DB.

```csharp
namespace todo.Tests
{
    [TestClass]
    public class TodoUnitTests
    {
        public TestContext TestContext { get; set; }

        [TestInitialize()]
        public void Initialize()
        {
            string endpoint = TestContext.Properties["endpoint"].ToString();
            string authKey = TestContext.Properties["authKey"].ToString();
            Console.WriteLine("Using endpoint: ", endpoint);
            DocumentDBRepository<Item>.Initialize(endpoint, authKey);
        }
        [TestMethod]
        public async Task TestCreateItemsAsync()
        {
            var item = new Item
            {
                Id = "1",
                Name = "testName",
                Description = "testDescription",
                Completed = false,
                Category = "testCategory"
            };

            // Create the item
            await DocumentDBRepository<Item>.CreateItemAsync(item);
            // Query for the item
            var returnedItem = await DocumentDBRepository<Item>.GetItemAsync(item.Id, item.Category);
            // Verify the item returned is correct.
            Assert.AreEqual(item.Id, returnedItem.Id);
            Assert.AreEqual(item.Category, returnedItem.Category);
        }

        [TestCleanup()]
        public void Cleanup()
        {
            DocumentDBRepository<Item>.Teardown();
        }
    }
>>>>>>> 659964f25fa5f609b17107bc7c2e677d7888f02b
}
```

:::image type="content" source="./media/tutorial-setup-ci-cd/powershellscript2.png" alt-text="Add the Emulator build task to the build definition":::

:::image type="content" source="./media/tutorial-setup-ci-cd/powershellscript1.png" alt-text="Add the Emulator build task to the build definition":::

For agents that do not come with the Azure Cosmos DB emulator preinstalled, you can instead download the latest emulator's MSI package from https://aka.ms/cosmosdb-emulator using 'curl' or 'wget', then leverage 'msiexec' to 'quiet' install it - see https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/msiexec". After the install, you can run a similar PowerShell script as the one above to start the emulator.

## Next steps

To learn more about using the emulator for local development and testing, see [Use the Azure Cosmos DB Emulator for local development and testing](./local-emulator.md).

To export emulator TLS/SSL certificates, see [Export the Azure Cosmos DB Emulator certificates for use with Java, Python, and Node.js](./local-emulator-export-ssl-certificates.md)