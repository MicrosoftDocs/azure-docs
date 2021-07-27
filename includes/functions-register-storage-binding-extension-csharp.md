::: zone pivot="programming-language-csharp"  
## Register binding extensions

With the exception of HTTP and timer triggers, bindings are implemented as extension packages. Run the following [dotnet add package](/dotnet/core/tools/dotnet-add-package) command in the Terminal window to add the Storage extension package to your project.

# [.NET Core 3.1](#tab/dotnet3)
```bash
dotnet add package Microsoft.Azure.WebJobs.Extensions.Storage --version 3.0.4
```
# [.NET 5.0](#tab/dotnet5)
```bash
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues --version 5.0.0-beta.4
```
---
Now, you can add the storage output binding to your project.  
::: zone-end  
