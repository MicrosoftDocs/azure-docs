---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/07/2022
ms.author: glenga
---

## Testing functions in C# in Visual Studio

The following example describes how to create a C# Function app in Visual Studio and run and tests with [xUnit](https://github.com/xunit/xunit).

![Testing Azure Functions with C# in Visual Studio](./media/functions-test-a-function/azure-functions-test-visual-studio-xunit.png)

### Setup

To set up your environment, create a Function and test app. The following steps help you create the apps and functions required to support the tests:

1. [Create a new Functions app](./functions-get-started.md) and name it **Functions**
2. [Create an HTTP function from the template](./functions-get-started.md) and name it **MyHttpTrigger**.
3. [Create a timer function from the template](./functions-create-scheduled-function.md) and name it **MyTimerTrigger**.
4. [Create an xUnit Test app](https://xunit.net/docs/getting-started/netcore/cmdline) in the solution and name it **Functions.Tests**.
5. Use NuGet to add a reference from the test app to [Microsoft.AspNetCore.Mvc](https://www.nuget.org/packages/Microsoft.AspNetCore.Mvc/)
6. [Reference the *Functions* app](/visualstudio/ide/managing-references-in-a-project) from *Functions.Tests* app.

### Create test classes

Now that the projects are created, you can create the classes used to run the automated tests.

Each function takes an instance of [ILogger](/dotnet/api/microsoft.extensions.logging.ilogger) to handle message logging. Some tests either don't log messages or have no concern for how logging is implemented. Other tests need to evaluate messages logged to determine whether a test is passing.

You'll create a new class named `ListLogger` which holds an internal list of messages to evaluate during a testing. To implement the required `ILogger` interface, the class needs a scope. The following class mocks a scope for the test cases to pass to the `ListLogger` class.

Create a new class in *Functions.Tests* project named **NullScope.cs** and enter the following code:

```csharp
using System;

namespace Functions.Tests
{
    public class NullScope : IDisposable
    {
        public static NullScope Instance { get; } = new NullScope();

        private NullScope() { }

        public void Dispose() { }
    }
}
```

Next, create a new class in *Functions.Tests* project named **ListLogger.cs** and enter the following code:

```csharp
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;

namespace Functions.Tests
{
    public class ListLogger : ILogger
    {
        public IList<string> Logs;

        public IDisposable BeginScope<TState>(TState state) => NullScope.Instance;

        public bool IsEnabled(LogLevel logLevel) => false;

        public ListLogger()
        {
            this.Logs = new List<string>();
        }

        public void Log<TState>(LogLevel logLevel,
                                EventId eventId,
                                TState state,
                                Exception exception,
                                Func<TState, Exception, string> formatter)
        {
            string message = formatter(state, exception);
            this.Logs.Add(message);
        }
    }
}
```

The `ListLogger` class implements the following members as contracted by the `ILogger` interface:

- **BeginScope**: Scopes add context to your logging. In this case, the test just points to the static instance on the `NullScope` class to allow the test to function.

- **IsEnabled**: A default value of `false` is provided.

- **Log**: This method uses the provided `formatter` function to format the message and then adds the resulting text to the `Logs` collection.

The `Logs` collection is an instance of `List<string>` and is initialized in the constructor.

Next, create a new file in *Functions.Tests* project named **LoggerTypes.cs** and enter the following code:

```csharp
namespace Functions.Tests
{
    public enum LoggerTypes
    {
        Null,
        List
    }
}
```

This enumeration specifies the type of logger used by the tests.

Now create a new class in *Functions.Tests* project named **TestFactory.cs** and enter the following code:

```csharp
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Primitives;
using System.Collections.Generic;

namespace Functions.Tests
{
    public class TestFactory
    {
        public static IEnumerable<object[]> Data()
        {
            return new List<object[]>
            {
                new object[] { "name", "Bill" },
                new object[] { "name", "Paul" },
                new object[] { "name", "Steve" }

            };
        }

        private static Dictionary<string, StringValues> CreateDictionary(string key, string value)
        {
            var qs = new Dictionary<string, StringValues>
            {
                { key, value }
            };
            return qs;
        }

        public static HttpRequest CreateHttpRequest(string queryStringKey, string queryStringValue)
        {
            var context = new DefaultHttpContext();
            var request = context.Request;
            request.Query = new QueryCollection(CreateDictionary(queryStringKey, queryStringValue));
            return request;
        }

        public static ILogger CreateLogger(LoggerTypes type = LoggerTypes.Null)
        {
            ILogger logger;

            if (type == LoggerTypes.List)
            {
                logger = new ListLogger();
            }
            else
            {
                logger = NullLoggerFactory.Instance.CreateLogger("Null Logger");
            }

            return logger;
        }
    }
}
```

The `TestFactory` class implements the following members:

- **Data**: This property returns an [IEnumerable](/dotnet/api/system.collections.ienumerable) collection of sample data. The key value pairs represent values that are passed into a query string.

- **CreateDictionary**: This method accepts a key/value pair as arguments and returns a new `Dictionary` used to create `QueryCollection` to represent query string values.

- **CreateHttpRequest**: This method creates an HTTP request initialized with the given query string parameters.

- **CreateLogger**: Based on the logger type, this method returns a logger class used for testing. The `ListLogger` keeps track of logged messages available for evaluation in tests.

Finally, create a new class in *Functions.Tests* project named **FunctionsTests.cs** and enter the following code:

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Xunit;

namespace Functions.Tests
{
    public class FunctionsTests
    {
        private readonly ILogger logger = TestFactory.CreateLogger();

        [Fact]
        public async void Http_trigger_should_return_known_string()
        {
            var request = TestFactory.CreateHttpRequest("name", "Bill");
            var response = (OkObjectResult)await MyHttpTrigger.Run(request, logger);
            Assert.Equal("Hello, Bill. This HTTP triggered function executed successfully.", response.Value);
        }

        [Theory]
        [MemberData(nameof(TestFactory.Data), MemberType = typeof(TestFactory))]
        public async void Http_trigger_should_return_known_string_from_member_data(string queryStringKey, string queryStringValue)
        {
            var request = TestFactory.CreateHttpRequest(queryStringKey, queryStringValue);
            var response = (OkObjectResult)await MyHttpTrigger.Run(request, logger);
            Assert.Equal($"Hello, {queryStringValue}. This HTTP triggered function executed successfully.", response.Value);
        }

        [Fact]
        public void Timer_should_log_message()
        {
            var logger = (ListLogger)TestFactory.CreateLogger(LoggerTypes.List);
            MyTimerTrigger.Run(null, logger);
            var msg = logger.Logs[0];
            Assert.Contains("C# Timer trigger function executed at", msg);
        }
    }
}
```

The members implemented in this class are:

- **Http_trigger_should_return_known_string**: This test creates a request with the query string values of `name=Bill` to an HTTP function and checks that the expected response is returned.

- **Http_trigger_should_return_string_from_member_data**: This test uses xUnit attributes to provide sample data to the HTTP function.

- **Timer_should_log_message**: This test creates an instance of `ListLogger` and passes it to a timer functions. Once the function is run, then the log is checked to ensure the expected message is present.

If you want to access application settings in your tests, you can [inject](./functions-dotnet-dependency-injection.md) an `IConfiguration` instance with mocked environment variable values into your function.

### Run tests

To run the tests, navigate to the **Test Explorer** and click **Run all**.

![Testing Azure Functions with C# in Visual Studio](./media/functions-test-a-function/azure-functions-test-visual-studio-xunit.png)

### Debug tests

To debug the tests, set a breakpoint on a test, navigate to the **Test Explorer** and click **Run > Debug Last Run**.
