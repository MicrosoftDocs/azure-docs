---
title: "Tutorial: Prepare an application for authentication"
description: Prepare an ASP.NET Core application for authentication using Visual Studio.
author: davidmu1
ms.author: davidmu
manager: CelesteDG
ms.service: active-directory
ms.topic: tutorial
ms.date: 10/18/2022
#Customer intent: As an application developer, I want to use an IDE to set up an ASP.NET Core project, set up and upload a self signed certificate to the Azure portal and configure the application for authentication.
---

# Tutorial: Prepare an application for authentication

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an ASP.NET Core project
> * Create a self-signed certificate
> * Configure the settings for the application

## Prerequisites

* Completion of the prerequisites and steps in [Tutorial: Register an application](web-app-tutorial-01-register-application.md).
* Although any integrated development environment (IDE) that supports .NET applications can be used, the following IDEs are used for this tutorial. They can be downloaded from the [Downloads](https://visualstudio.microsoft.com/downloads) page.
    - Visual Studio 2022
    - Visual Studio Code
    - Visual Studio 2022 for Mac
* Some steps in this tutorial use the .NET CLI. For more information about this tool, see [dotnet command](/dotnet/core/tools/dotnet).

## Create an ASP.NET Core project

### [Visual Studio](#tab/visual-studio)

This tutorial uses the **ASP.NET Core Web App** template in Visual Studio 2022. Additions are made to show what needs to be added to an application for authentication with Azure Active Directory (Azure AD).

1. Open Visual Studio, and then select **Create a new project**.
1. Search for and choose the **ASP.NET Core Web App** template, and then select **Next**.
1. Enter a name for the project, such as *NewApp1*.
1. Choose a location for the project or accept the default option, and then select **Next**.
1. Accept the default for the **Framework**, **Authentication type**, and **Configure for HTTPS**.

> [!NOTE]
> On this page of the application configuration, the **Authentication type** could be changed to `Microsoft identity platform`, which would add the authentication configuration to the application. This tutorial is meant to provide an understanding of the code and configuration for authentication, so the setting is kept at **None**.

6. Select **Create**.

### [Visual Studio Code](#tab/visual-studio-code)

1. Open Visual Studio Code, and select the **Open Folder...** option. Navigate to and select the location you wish to create your project.
1. Open up a new terminal by selecting **Terminal** in the top bar, then **New Terminal**.
1. Create a new folder using either the terminal or the **New Folder...** icon at the top of the left panel. Provide a similar name to the one registered on the Azure portal, for example, *MyWebApp*.
1. Using the terminal, run the following commands to change into the folder directory and create the project;
1. Run the following command in the terminal:

```powershell
cd MyWebApp
dotnet new webapp --framework net6.0
```

### [Visual Studio for Mac](#tab/visual-studio-for-mac)

<!-- Checks needed here -->
1. Open Visual Studio, and then select **New**.
1. Under **Web and Console** in the left navigation bar, select **App**.
1. Under **ASP.NET Core**, select **APP** and ensure **C#** is selected in the drop down menu, then select **Continue**.
1. Accept the default for the **Target Framework and Advanced**, then select **Continue**.
1. Enter a name for your **Project name**, this will be reflected in **Solution Name**. Choose something similar to the application you registered on the Microsoft identity platform, such as *MyNewApp*.
1. Accept the default location for the project or choose a different location, and then select **Create**.

---

## Create and upload a self-signed certificate

The use of certificates is suggested for securing the application. When using certificates, make sure to manage and monitor them appropriately. This tutorial uses a simple self-signed certificate for development purposes, certificates issued by a certificate authority should be used for production.

### [.NET CLI](#tab/dotnetcli)

1. In Visual Studio, select **Tools > Command Line > Developer Command Prompt**.
1. Enter the following command to clear the HTTPS development certificates from the machine:

    ```powershell
    dotnet dev-certs https --clean
    ```

1. Enter the following command to create a new self-signed certificate:

    ```powershell
    dotnet dev-certs https -ep ./certificate.crt --trust
    ```

### [PowerShell](#tab/powershell)

1. In the PowerShell command window, run the following commands replacing the `{certificateName}` value with the name of the certificate.

    ```powershell
    $certname = "{certificateName}"    ## Replace {certificateName}
    $cert = New-SelfSignedCertificate -Subject "CN=$certname" -CertStoreLocation "Cert:\CurrentUser\My" -KeyExportPolicy Exportable -KeySpec Signature -KeyLength 2048 -KeyAlgorithm RSA -HashAlgorithm SHA256
    ```

2. Run the following command to export the certificate to be uploaded to the Azure portal. Replace `{projectLocation}` with the location of the application project:

    ```powershell
    Export-Certificate -Cert $cert -FilePath "C:\{projectLocation}\$certname.cer"
    ```
---

### Upload certificate to the portal

To make the certificate available to the application, it must be uploaded into the Azure AD tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **Certificates & secrets** and select the **Certificates (0)** tab.
1. Select **Upload certificate**.

:::image type="content" source="./media/web-app-tutorial-02-prepare-application/upload-certificate-inline.png" alt-text="Screenshot of uploading a certificate into an Azure Active Directory tenant." lightbox="./media/web-app-tutorial-02-prepare-application/upload-certificate-expanded.png":::

1. Browse for and select the certificate that was previously created.
1. Enter a description for the certificate.
1. Select **Add**.
1. Double-click the thumbprint, select the vertical ellipsis, and then select **Copy** to record the thumbprint for the certificate to be used later.

    :::image type="content" source="./media/web-app-tutorial-02-prepare-application/copy-certificate-thumbprint.png" alt-text="Screenshot showing copying the certificate thumbprint.":::

## Configure the application for authentication

The application needs to be configured for authentication with Azure AD.

1. Open the *appsettings.json* file and add the following configuration settings for Azure AD:
  
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
    }
    ```

    * `Instance` - The endpoint of the cloud provider. Check with the different available endpoints in [National clouds](authentication-national-cloud.md#azure-ad-authentication-endpoints).
    * `TenantId` - The identifier of the tenant where the application is registered. Replace the text in quotes with the **Directory (tenant) ID** value that was recorded earlier from the overview page of the registered application.
    * `ClientId` - The identifier of the application, also referred to as the client. Replace the text in quotes with the **Application (client) ID** value that was recorded earlier from the overview page of the registered application.
    * `ClientCertificates` - A self-signed certificate is used for authentication in the application. Replace the text of the `CertificateThumbprint` with the thumbprint of the certificate that was previously recorded.
    * `CallbackPath` - Is an identifier to help the server redirect a response to the appropriate application. This value shouldn’t be changed.
1. Save the changes to the file.
1. Record the value of the `CallbackPath`. This will be used later to define the **Redirect URI** on the Azure portal.
1. Under **Properties**, open the *launchSettings.json* file.
1. Record the https URL listed in the value of `applicationURL`. This will also be used when defining the **Redirect URI**.

<!-- See also -->

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Add sign-in to an application](web-app-tutorial-03-sign-in-users.md)