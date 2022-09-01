---
author: alexwolfmsft
ms.author: alexwolf
ms.topic: include
ms.date: 02/03/2022
---

1. In the Visual Studio Code  terminal, run the .NET CLI command below. This command generates a deployable `publish` folder for the app in the `bin/release/publish` directory.

    ```dotnetcli
    dotnet publish -c Release
    ```

1. Right-click on the generated `publish` folder in the Visual Studio Code explorer and select **Deploy to Web App**.

1. A new workflow will open in the command palette at the top of the screen.  Select the subscription you would like to publish your app to.

1. Select the App Service web app you created earlier.

If Visual Studio Code prompts you to confirm, click **deploy**. The deployment process may take a few moments. When the process completes, a notification should appear in the bottom right corner prompting you to browse to the deployed app.