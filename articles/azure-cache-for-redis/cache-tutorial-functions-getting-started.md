# Getting started with Functions

The following tutorial shows how to implement basic triggers with Azure Cache for Redis and Azure Functions. This tutorial uses VS Code to write and deploy the Azure Function in C#. 

## Requirements

- Azure subscription
- [Visual Studio Code](https://code.visualstudio.com/)

## Instructions

### 1. Set up an Azure Cache for Redis Instance

Create a new **Azure Cache for Redis** instance using the Azure portal or your preferred CLI tool. We’ll use a _Standard C1_ instance, which is a good starting point. Use the [quickstart guide](quickstart-create-redis.md) to get started.

![Image](Media/CreateCache.png)

The default settings should suffice. We’ll use a public endpoint for this demo, but you’ll likely want to use a private endpoint for anything in production. 
The cache can take a bit to create, so feel free to move to the next section while this completes. 

### 2. Set up Visual Studio Code

If you haven’t installed the functions extension for VS Code, do so by searching for _Azure Functions_ in the extensions menu and selecting **Install**. If you don’t have the C# extension installed, please install that as well. 

![Image](Media/InstallExtensions.png)
 
Next, go to the **Azure** tab, and sign-in to your existing Azure account, or create a new one:
 
Create a new local folder on your computer to hold the project that we’ll be building. I’ve named mine “AzureRedisFunctionDemo”.

In the Azure tab, create a new functions app by clicking on the lightning icon in the top right of the **Workspace** box in the lower left of the screen.

![Image](Media/CreateFunctionProject.png)

Select the new folder that you’ve created. This will start the creation of a new Azure Functions project. You’ll get several on-screen prompts. Select:

- **C#** as the language
- **.NET 6.0 LTS** as the .NET runtime
- **Skip for now** as the project template
Note: If you don’t have the .NET Core SDK installed, you’ll be prompted to do so.

The new project will be created:

![Image](Media/VSCodeWorkspace.png)

### 3. Install Necessary NuGet packages

You’ll need to install two NuGet packages:
1. [StackExchange.Redis](https://www.nuget.org/packages/StackExchange.Redis/), which is the primary .NET client for Redis. 
1. Microsoft.Azure.WebJobs.Extensions.Redis, which is the extension that allows Redis keyspace notifications to be used as triggers in Azure Functions. 

Install StackExchange.Redis by going to the **Terminal** tab in VS Code and entering the following command:

```
dotnet add package StackExchange.Redis
```

Next, we need to install the Microsoft.Azure.WebJobs.Extensions.Redis package. When this feature is released publically, this will be very simple. But we have to jump through some additional hoops right now. 

   1. Create a `NuGet.Config` file in the project folder (`AzureRedisFunctionDemo` in step 2 above):
      ```
      <?xml version="1.0" encoding="utf-8"?>
      <configuration>
        <packageSources>
          <add key="local-packages" value="./local-packages" />
        </packageSources>
      </configuration>
      ```
   1. Add the following line to the `<PropertyGroup>` section of the csproj.
      ```
      <RestoreSources>$(RestoreSources);./local-packages;https://api.nuget.org/v3/index.json</RestoreSources>
      ```
   1. Create a folder `local-packages` within the project folder, and download the latest NuGet package from [GitHub Releases](https://github.com/Azure/azure-functions-redis-extension/releases) to this `local-packages` folder.
   1. Install the package:
      ```
      dotnet add package Microsoft.Azure.WebJobs.Extensions.Redis --prerelease
      dotnet restore
      ``` 

### 4. Configure Cache

Go to your newly created Azure Cache for Redis instance. Two steps need to be taken here. 
First, we need to enable **keyspace notifications** on the cache to trigger on keys and commands. Go to your cache in the Azure portal and select the **Advanced settings** blade. Scroll down to the field labled _notify-keyspace-events_ and enter “KEA”. Then select Save at the top of the window. “KEA” is a configuration string that enables keyspace notifications for all keys and events. More information on keyspace configuration strings can be found [here](https://redis.io/docs/manual/keyspace-notifications/). 

![Image](Media/KeyspaceNotifications.png)

Second, go to the **Access keys** blade and write down/copy the Primary connection string field. We’ll use this to connect to the cache.  

![Image](Media/AccessKeys.png)

### 5. Set up the example code

Go back to VS Code, add a file to the project called “RedisFunctions.cs” Copy and paste the [RedisSamples.cs](https://github.com/Azure/azure-functions-redis-extension/blob/main/samples/RedisSamples.cs) code found in the _Samples_ folder of this repo.

This example shows multiple different triggers:
1.	_PubSubTrigger_, which is triggered when activity is published to the a pub/sub channel named `pubsubTest`
1.	_KeyspaceTrigger_, which is built on the Pub/Sub trigger. This looks for changes to the key `keyspaceTest`
1.	_KeyeventTrigger_, which is also built on the Pub/Sub trigger. This looks for any use of the`DEL` command. 
1.	_ListTrigger_, which looks for changes to the list `listTest`
1.	_ListMultipleTrigger_, which looks for changes to list `listTest1` and `listTest2`
1.	_StreamTrigger_, which looks for changes to the stream `streamTest`
1.	_StreamMultipleTrigger_, which looks for changes to streams `streamTest1` and `streamTest2`

To connect to your cache, take the connection string you copied from earlier and paste to replace the value of `localhost` at the top of the file. (This is “127.0.0.1:6379” by default).

![Image](Media/ConnectionString.png)
 
### 6. Build and run the code locally
Switch to the **Run and debug** tab in VS code and click on the green arrow to debug the code locally. If you don’t have Azure Functions core tools installed, you will be prompted to do so. In that case, you’ll need to restart VS Code after installing.
 
The code should build successfully, which you can track in the Terminal output. 
To test the trigger functionality out, try creating and deleting the _keyspaceTest_ key. You can use any way you prefer to connect to the cache, but the easiest way will likely be to use the built-in Console tool in the Azure Cache for Redis portal. Bring up the cache instance in the Azure portal, and click the Console button to open it up.
 
![Image](Media/Console.png)

Once it is open, try the following commands:
- SET keyspaceTest 1
- SET keyspaceTest 2
- DEL keyspaceTest
- PUBLISH pubsubTest testMessage
- LPUSH listTest test
- XADD streamTest * name Clippy

![Image](Media/Console2.png)

You should see the triggers activating in the terminal:

![Image](Media/TriggersWorking.png)
 
### 6. Deploy Code to an Azure Function
Create a new Azure function by going back to the Azure tab, expanding your subscription, and right clicking on **Function App**. Select **Create a Function App in Azure…(Advanced)**.

![Image](Media/CreateFunctionApp.png)
 
You will see several prompts on information to configure the new functions app:
- Enter a unique name
- Choose **.NET 6** as the runtime stack
- Choose either **Linux** or **Windows** (either works)
- Select an existing or new resource group to hold the Function App
- Choose the same region as your cache instance
- Select **Premium** as the hosting plan
- Create a new App Service plan
- Choose the **EP1** pricing tier.
- Choose an existing storage account or create a new one
- Create a new Application Insights resource (we’ll use this to confirm the trigger is working)

Wait a few minutes for the new Function App to be created. It will now show up in the drop down under **Function App** in your subscription. Right click on the new function app and select **Deploy to Function App…**

![Image](Media/DeployToFunction.png)
 
The app will build and start deploying. You can track progress in the **Output Window**
.
Once deployment is complete, open your Function App in the Azure Portal and select the **Log Stream** blade. Wait for log analytics to connect, and then use the Redis console to activate any of the triggers. You should see the triggers being logged here. 

![Image](Media/LogStream.png)
