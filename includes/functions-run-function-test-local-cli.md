---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/18/2020
ms.author: glenga
---

## Run the function locally

1. Run your function by starting the local Azure Functions runtime host from the *LocalFunctionProj* folder:

    ```
    func start
    ```

    Toward the end of the output, the following lines should appear: 
    
    <pre>
    ...
    
    Now listening on: http://0.0.0.0:7071
    Application started. Press Ctrl+C to shut down.
    
    Http Functions:
    
            HttpExample: [GET,POST] http://localhost:7071/api/HttpExample
    ...
    
    </pre>
    
    >[!NOTE]  
    > If HttpExample doesn't appear as shown above, you likely started the host from outside the root folder of the project. In that case, use **Ctrl**+**C** to stop the host, navigate to the project's root folder, and run the previous command again.

1. Copy the URL of your `HttpExample` function from this output to a browser and append the query string `?name=<YOUR_NAME>`, making the full URL like `http://localhost:7071/api/HttpExample?name=Functions`. The browser should display a response message that echoes back your query string value. The terminal in which you started your project also shows log output as you make requests.

1. When you're done, use **Ctrl**+**C** and choose `y` to stop the functions host.
