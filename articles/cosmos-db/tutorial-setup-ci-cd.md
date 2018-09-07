---
title: Set up CI/CD pipeline with the Azure Cosmos DB emulator build task
description: Tutorial on how to set up build and release workflow in Visual Studio Team Services (VSTS) using the Cosmos DB emulator build task
services: cosmos-db
keywords: Azure Cosmos DB Emulator
author: deborahc
manager: kfile

ms.service: cosmos-db
ms.devlang: na
ms.topic: tutorial
ms.date: 8/28/2018
ms.author: dech

---
# Set up a CI/CD pipeline with the Azure Cosmos DB emulator build task in Visual Studio Team Services

The Azure Cosmos DB emulator provides a local environment that emulates the Azure Cosmos DB service for development purposes. The emulator allows you to develop and test your application locally, without creating an Azure subscription or incurring any costs. 

The Azure Cosmos DB emulator build task for Visual Studio Team Services (VSTS) allows you to do the same in a CI environment. With the build task, you can run tests against the emulator as part of your build and release workflows. The task spins up a Docker container with the emulator already running and provides an endpoint that can be used by the rest of the build definition. You can create and start as many instances of the emulator as you need, each running in a separate container. 

This article demonstrates how to set up a CI pipeline in VSTS for an ASP.NET application that uses the Cosmos DB emulator build task to run tests. 

## Install the emulator build task

To use the build task, we first need to install it onto our VSTS organization. Find the extension **Azure Cosmos DB Emulator** in the [Marketplace](https://marketplace.visualstudio.com/items?itemName=azure-cosmosdb.emulator-public-preview) and click **Get it free.**

![Find and install the Azure Cosmos DB Emulator build task in the VSTS Marketplace](./media/tutorial-setup-ci-cd/addExtension_1.png)

Next, choose the organization in which to install the extension. 

> [!NOTE]
> To install an extension to a VSTS organization, you must be an account owner or project collection administrator. If you do not have permissions, but you are an account member, you can request extensions instead. [Learn more.](https://docs.microsoft.com/vsts/marketplace/faq-extensions?view=vsts#install-request-assign-and-access-extensions) 

![Choose a VSTS organization in which to install an extension](./media/tutorial-setup-ci-cd/addExtension_2.png)

## Create a build definition

Now that the extension is installed, we need to add it to a [build definition.](https://docs.microsoft.com/vsts/pipelines/get-started-designer?view=vsts&tabs=new-nav) You may modify an existing build definition, or create a new one. If you already have an existing build definition, you may skip ahead to [Add the Emulator build task to a build definition](#addEmulatorBuildTaskToBuildDefinition).

To create a new build definition, navigate to the **Build and Release** tab in VSTS. Select **+New.**

![Create a new build definition](./media/tutorial-setup-ci-cd/CreateNewBuildDef_1.png)
Select the desired team project, repository, and branch to enable builds. 

![Select the team project, repository, and branch for the build definition ](./media/tutorial-setup-ci-cd/CreateNewBuildDef_2.png)

Finally, select the desired template for the build definition. We'll select the **ASP.NET** template in this tutorial. 

![Select the desired build definition template ](./media/tutorial-setup-ci-cd/CreateNewBuildDef_3.png)

Now we have a build definition that we can set up to use the Azure Cosmos DB emulator build task that looks like the one below. 

![ASP.NET build definition template](./media/tutorial-setup-ci-cd/CreateNewBuildDef_4.png)

## <a name="addEmulatorBuildTaskToBuildDefinition"></a>Add the task to a build definition

To add the emulator build task, search for **cosmos** in the search box and select **Add.** The build task will start up a container with an instance of the Cosmos DB emulator already running, so the task needs to be placed before any other tasks that expect the emulator to be running.

![Add the Emulator build task to the build definition](./media/tutorial-setup-ci-cd/addExtension_3.png)
In this tutorial, we'll add the task to the beginning of Phase 1 to ensure the emulator is available before our tests execute.
The completed build definition now looks like this. 

![ASP.NET build definition template](./media/tutorial-setup-ci-cd/CreateNewBuildDef_5.png)

## Configure tests to use the emulator
Now, we'll configure our tests to use the emulator. The emulator build task exports an environment variable – ‘CosmosDbEmulator.Endpoint’ – that any tasks further in the build pipeline can issue requests against. 

In this tutorial, we'll use the [Visual Studio Test task](https://github.com/Microsoft/vsts-tasks/blob/master/Tasks/VsTestV2/README.md) to run unit tests configured via a **.runsettings** file. To learn more about unit test setup, visit the [documentation](https://docs.microsoft.com/visualstudio/test/configure-unit-tests-by-using-a-dot-runsettings-file?view=vs-2017).

Below is an example of a **.runsettings** file that defines parameters to be passed into an application's unit tests. Note the `authKey` variable used is the [well-known key](https://docs.microsoft.com/azure/cosmos-db/local-emulator#authenticating-requests) for the emulator. This `authKey` is the key expected by the emulator build task and should be defined in your **.runsettings** file.

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
}
```

Navigate to the Execution Options in the Visual Studio Test task. In the **Settings file** option,  specify that the tests are configured using the **.runsettings** file. In the **Override test run parameters** option, add in ` -endpoint $(CosmosDbEmulator.Endpoint)`. Doing so will configure the Test task to refer to the endpoint of the emulator build task, instead of the one defined in the **.runsettings** file.  

![Override endpoint variable with Emulator build task endpoint](./media/tutorial-setup-ci-cd/addExtension_5.png)

## Run the build
Now, save and queue the build. 

![Save and run the build](./media/tutorial-setup-ci-cd/runBuild_1.png)

Once the build has started, observe the Cosmos DB emulator task has begun pulling down the Docker image with the emulator installed. 

![Save and run the build](./media/tutorial-setup-ci-cd/runBuild_4.png)

After the build completes, observe that your tests pass, all running against the Cosmos DB emulator from the build task!

![Save and run the build](./media/tutorial-setup-ci-cd/buildComplete_1.png)

## Next steps

To learn more about using the emulator for local development and testing, see [Use the Azure Cosmos DB Emulator for local development and testing](https://docs.microsoft.com/azure/cosmos-db/local-emulator).

To export emulator SSL certificates, see [Export the Azure Cosmos DB Emulator certificates for use with Java, Python, and Node.js](https://docs.microsoft.com/azure/cosmos-db/local-emulator-export-ssl-certificates)
