---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/09/2020
ms.author: glenga
---

## Run the function locally

Start the function by starting the local Azure Functions runtime host in the *LocalFunctionProj* folder:

::: zone pivot="programming-language-csharp,programming-language-powershell,programming-language-javascript,programming-language-python"
```
func start
```
::: zone-end

::: zone pivot="programming-language-typescript"
```
npm install
npm start
```
::: zone-end

The following output should appear. (If HttpExample doesn't appear as shown below, you likely started the host from within the *HttpExample* folder. In that case, use **Ctrl**+**C** to stop the host, navigate to the parent *LocalFunctionProj* folder, and run the previous command again.)

```output
Now listening on: http://0.0.0.0:7071
Application started. Press Ctrl+C to shut down.

Http Functions:

        HttpExample: [GET,POST] http://localhost:7071/api/HttpExample
```

Copy the URL of your `HttpExample` function from this output to a browser and append the query string `?name=<your-name>`, making the full URL like `http://localhost:7071/api/HttpExample?name=Functions`. The browser should display a message like `Hello Functions`:

![Result of the function run locally in the browser](./media/functions-create-first-azure-function-azure-cli/function-test-local-browser.png)

The terminal in which you ran `func start` also shows log output as you make requests.

When you're ready, **Ctrl**+**C** to stop the functions host.