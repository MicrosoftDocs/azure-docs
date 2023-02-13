---
title: "Tutorial: Prepare a web application for authentication"
description: Prepare an ASP.NET Core application for authentication using Visual Studio.
author: cilwerner
ms.author: cwerner
manager: CelesteDG
ms.service: active-directory
ms.topic: tutorial
ms.date: 02/09/2023
#Customer intent: As an application developer, I want to use an IDE to set up an ASP.NET Core project, set up and upload a self signed certificate to the Azure portal and configure the application for authentication.

# Review Stage 3: PM Review - (ADO-54212)
---

# Tutorial: Prepare an application for authentication

This tutorial demonstrates how to create an ASP.NET Core project in a supported integrated development environment (IDE). You'll create and upload a self-signed certificate and configure the application for authentication.

In this tutorial:

> [!div class="checklist"]
> * Create an ASP.NET Core project
> * Create a self-signed certificate
> * Configure the settings for the application
> * Define platform settings and URLs

## Prerequisites

* Completion of the prerequisites and steps in [Tutorial: Register an application with the Microsoft identity platform](web-app-tutorial-01-register-application.md).
* Although any IDE that supports .NET applications can be used, the following IDEs are used for this tutorial. They can be downloaded from the [Downloads](https://visualstudio.microsoft.com/downloads) page.
    - Visual Studio 2022
    - Visual Studio Code
    - Visual Studio 2022 for Mac
* Some steps in this tutorial use the .NET CLI. For more information about this tool, see [dotnet command](/dotnet/core/tools/dotnet).
* A minimum requirement of [.NET Core 6.0 SDK](https://dotnet.microsoft.com/download/dotnet).

## Create an ASP.NET Core project

After registering an application on the Azure portal, a .NET web application needs to be created using an IDE. Use the tabs to create an ASP.NET Core project with your IDE.

### [Visual Studio](#tab/visual-studio)

1. Open Visual Studio, and then select **Create a new project**.
1. Search for and choose the **ASP.NET Core Web App** template, and then select **Next**.
1. Enter a name for the project, such as *NewWebAppLocal*.
1. Choose a location for the project or accept the default option, and then select **Next**.
1. Accept the default for the **Framework**, **Authentication type**, and **Configure for HTTPS**. **Authentication type** can be set to none as this tutorial will cover this process.
1. Select **Create**.

### [Visual Studio Code](#tab/visual-studio-code)

1. In Visual Studio Code, select **File > Open Folder...**. Navigate to and select the location in which to create your project.
1. Create a new folder using the **New Folder...** icon in the **Explorer** pane. Provide a name similar to the one registered previously, for example, *NewWebAppLocal*.
1. Open a new terminal by selecting **Terminal > New Terminal**.
1. Run the following commands in the terminal to change into the directory and create the project:

```powershell
cd NewWebAppLocal
dotnet new webapp
```

### [Visual Studio for Mac](#tab/visual-studio-for-mac)

1. Open Visual Studio, and then select **New**.
1. Under **Web and Console** in the left navigation bar, select **App**.
1. Under **ASP.NET Core**, select **Web Application** and ensure **C#** is selected in the drop down menu, then select **Continue**.
1. Ensure the **Target Framework** is set to **.NET 6.0** at a minimum.
1. Enter a name for **Project name**, this is reflected in **Solution Name**. Provide a similar name to the one registered on the Azure portal, such as *NewWebAppLocal*.
1. Accept the default location for the project or choose a different location, and then select **Create**.

---

## Create and upload a self-signed certificate

The use of certificates is suggested for securing the application. For the purpose of this tutorial, a self-signed certificate will be created in the project directory. Certificates issued by a certificate authority should be used for production.

### [Visual Studio](#tab/visual-studio)

1. Select **Tools > Command Line > Developer Command Prompt**.

1. Enter the following command to create a new self-signed certificate:

    ```powershell
    dotnet dev-certs https -ep ./certificate.crt --trust
    ```

### [Visual Studio Code](#tab/visual-studio-code)

1. In the **Terminal**, enter the following command to create a new self-signed certificate:

    ```powershell
    dotnet dev-certs https -ep ./certificate.crt --trust
    ```

### [Visual Studio for Mac](#tab/visual-studio-for-mac)

1. Locate the **Terminal** option in your project. 

1. Enter the following command to create a new self-signed certificate:

    ```powershell
    dotnet dev-certs https -ep ./certificate.crt --trust
    ```
---

### Upload certificate to the portal

To make the certificate available to the application, it must be uploaded into the tenant.

1. Starting from the **Overview** page of the app created earlier, under **Manage**, select **Certificates & secrets** and select the **Certificates (0)** tab.
1. Select **Upload certificate**.

    :::image type="content" source="./media/web-app-tutorial-02-prepare-application/upload-certificate-inline.png" alt-text="Screenshot of uploading a certificate into an Azure Active Directory tenant." lightbox="./media/web-app-tutorial-02-prepare-application/upload-certificate-expanded.png":::

1. Select the folder icon, then browse for and select the certificate that was previously created.
1. Enter a description for the certificate and select **Add**.
1. Record the **Thumbprint** value, which will be used in the next step.

    :::image type="content" source="./media/web-app-tutorial-02-prepare-application/copy-certificate-thumbprint.png" alt-text="Screenshot showing copying the certificate thumbprint.":::

## Configure the application for authentication and API reference

The values recorded earlier will be used in *appsettings.json* to configure the application for authentication. As the application will also call into a web API, it must also contain a reference to it.

1. Open *appsettings.json* and replace the file contents with the following snippet:
  
    ``` json
    {
      "AzureAd": {
        "Instance": "https://login.microsoftonline.com/",
        "TenantId": "Enter the tenant ID here",
        "ClientId": "Enter the client ID here",
        "ClientCertificates": [
          {
            "SourceType": "StoreWithThumbprint",
            "CertificateStorePath": "CurrentUser/My",
            "CertificateThumbprint": "Enter the certificate thumbprint here"
          }    
        ],
        "CallbackPath": "/signin-oidc"
      },
      "DownstreamApi": {
        "BaseUrl": "https://graph.microsoft.com/v1.0/me",
        "Scopes": "user.read"
          },
      "Logging": {
        "LogLevel": {
          "Default": "Information",
          "Microsoft.AspNetCore": "Warning"
        }
      },
      "AllowedHosts": "*"
    }
    ```

    * `Instance` - The authentication endpoint. Check with the different available endpoints in [National clouds](authentication-national-cloud.md#azure-ad-authentication-endpoints).
    * `TenantId` - The identifier of the tenant where the application is registered. Replace the text in quotes with the **Directory (tenant) ID** value that was recorded earlier from the overview page of the registered application.
    * `ClientId` - The identifier of the application, also referred to as the client. Replace the text in quotes with the **Application (client) ID** value that was recorded earlier from the overview page of the registered application.
    * `ClientCertificates` - A self-signed certificate is used for authentication in the application. Replace the text of the `CertificateThumbprint` with the thumbprint of the certificate that was previously recorded.
    * `CallbackPath` - Is an identifier to help the server redirect a response to the appropriate application. 
    * `DownstreamApi` - Is an identifier that defines an endpoint for accessing Microsoft Graph. The application URI is combined with the specified scope. To define the configuration for an application owned by the organization, the value of the `Scopes` attribute is slightly different.
1. Save changes to the file.
1. In the **Properties** folder, open the *launchSettings.json* file.
1. Find and record the `https` value within *launchSettings.json*, for example `https://localhost:{port}`. This URL will be used when defining the **Redirect URI**.


## Define the platform and URLs

1. In the Azure portal, under **Manage**, select **App registrations**, and then select the application that was previously created.
1. In the left menu, under **Manage**, select **Authentication**.
1. In **Platform configurations**, select **Add a platform**, and then select **Web**.

    :::image type="content" source="./media/web-app-tutorial-02-prepare-application/select-platform-inline.png" alt-text="Screenshot on how to select the platform for the application." lightbox="./media/web-app-tutorial-02-prepare-application/select-platform-expanded.png":::

1. Under **Redirect URIs**, enter the `applicationURL` and the `CallbackPath`, `/signin-oidc`, in the form of `https://localhost:{port}/signin-oidc`.
1. Under **Front-channel logout URL**, enter the following URL for signing out, `https://localhost:{port}/signout-oidc`.
1. Select **Configure**.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Add sign-in to an application](web-app-tutorial-03-sign-in-users.md)