---
title: Create a Function
description: Try Azure Functions for free with Visual Studio Code
author: KarlErickson
ms.author: karler
ms.date: 05/17/2019
ms.topic: quickstart
ms.service: azure-functions
---
# Add a Function to your App

Next, create a Function that handles HTTP requests.

From the **AZURE FUNCTIONS** explorer, click the **Create Function** icon.

![Create Function](./media/tutorial-javascript-vscode/create-function.png)

Select the directory you currently have open - it's the default option so press ENTER. When prompted, choose HTTP trigger, use the default name of `HttpTriggerJS`, and choose **Anonymous** authentication.

![Choose Template](./media/tutorial-javascript-vscode/create-function-choose-template.png)

![Choose Authentication](./media/tutorial-javascript-vscode/create-function-anonymous-auth.png)

Upon completion, a new directory is created within your Function app named `HttpTriggerJS` that includes `index.js`and `functions.json` files. The `index.js` file contains the source code that responds to the HTTP request and `functions.json` contains the [binding configuration](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings) for the HTTP trigger.

![Completed Project](./media/tutorial-javascript-vscode/functions-vscode-intro.png)

Next, run your app locally to verify everything is working.

---

> [!div class="nextstepaction"]
> [I've created the Function](./tutorial-javascript-vscode-run-app.md)

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azurefunctions&step=create-function)
