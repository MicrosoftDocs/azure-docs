---
title: "Tutorial: Prepare an application for authentication"
description: Prepare an ASP.NET Core application for authentication using Visual Studio.
author: davidmu1
ms.author: davidmu
manager: CelesteDG
ms.service: active-directory
ms.topic: tutorial
ms.date: 10/18/2022
---

# Tutorial: Prepare an application for authentication 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an ASP.NET Core project
> * Create a self-signed certificate
> * Configure the settings for the application

## Prerequisites

* Completion of the prerequisites and steps in [Tutorial: Register an application](web-app-tutorial-01-register-application.md).
* Although any integrated development environment (IDE) that supports .NET applications can be used, this tutorial uses Visual Studio 2022. A free version can be downloaded at [Downloads](https://visualstudio.microsoft.com/downloads).
* Some steps in this tutorial use the .NET CLI. For more information about this tool, see [dotnet command](/dotnet/core/tools/dotnet).

## Create an ASP.NET Core project

### [Visual Studio](#tab/visual-studio)

This tutorial uses the **ASP.NET Core Web App** template in Visual Studio 2022. Additions are made to show what needs to be added to an application for authentication with Azure Active Directory (Azure AD).

1. Open Visual Studio, and then select **Create a new project**.
1. Search for and choose the **ASP.NET Core Web App** template, and then select **Next**.
1. Enter a name for the project, such as **NewApp1**.
1. Accept the default location for the project or choose a different location, and then select **Next**.
1. Accept the default for the **Framework**, **Authentication type**, and **Configure for HTTPS**.

> [!NOTE]
> On this page of the application configuration, the **Authentication type** could be changed to `Microsoft identity platform`, which would add the authentication configuration to the application. This tutorial is meant to provide an understanding of the code and configuration for authentication, so the setting is kept at **None**.

6. Select **Create**.

### [Visual Studio Code](#tab/visual-studio-code)

1. Open up a new terminal by selecting **Terminal** in the top bar, then **New Terminal**.
1. Navigate to the directory where you wish to set up your project. You can use the **Explorer** bar or the **Terminal**
1. Create a new folder, and give it the same name that you gave the app when you registered it online, for example *NewWebApp1*.
1. Run the following command in the terminal:
```powershell
dotnet new webapp --framework net6.0
```

### [Visual Studio for Mac](#tab/visual-studio-for-mac)

Information with Visual Studio for Mac instructions in progress.

---

## Create and upload a self-signed certificate

The use of certificates is suggested for securing the application. When using certificates, make sure to manage and monitor them appropriately. This tutorial uses a simple self-signed certificate for development purposes, certificates issued by a certificate authority should be used for production.

### [.NET CLI](#tab/dotnetcli)

1. In Visual Studio, select **Tools > Command Line > Developer Command Prompt**.
1. Enter the following command to clear the HTTPS development certificates from the machine:

    ```dotnet dev-certs https --clean```

1. Enter the following command to create a new self-signed certificate:

    ```dotnet dev-certs https -ep ./certificate.crt --trust```

### [PowerShell](#tab/powershell)

1. In the PowerShell command window, run the following commands replacing the `{certificateName}` value with the name of the certificate.

    ```PowerShell
    $certname = "{certificateName}"    ## Replace {certificateName}
    $cert = New-SelfSignedCertificate -Subject "CN=$certname" -CertStoreLocation "Cert:\CurrentUser\My" -KeyExportPolicy Exportable -KeySpec Signature -KeyLength 2048 -KeyAlgorithm RSA -HashAlgorithm SHA256
    ```

2. Run the following command to export the certificate to be uploaded to the Azure portal. Replace `{projectLocation}` with the location of the application project:

    ```PowerShell
    Export-Certificate -Cert $cert -FilePath "C:\{projectLocation}\$certname.cer"
    ```
---

### Upload certificate to the portal

To make the certificate available to the application, it must be uploaded into the Azure AD tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **Certificates & secrets** and select the **Certificates (0)** tab.
1. Select **Upload certificate**.

    :::image type="content" source="./media/web-app-tutorial-02-prepare-application/upload-certificate.png" alt-text="Screenshot of uploading a certificate into an Azure Active Directory tenant.":::

1. Browse for and select the certificate that was previously created.
1. Enter a description for the certificate.
1. Select **Add**.
1. Double-click the thumbprint, select the verticle ellipsis, and then select **Copy** to record the thumbprint for the certificate to be used later.

    :::image type="content" source="./media/web-app-tutorial-02-prepare-application/copy-certificate-thumbprint.png" alt-text="Screenshot of copying the certificate thumbprint.":::

## Configure the application for authentication

The application that was created earlier needs to be configured for authentication with Azure AD.

1. Open the *appsettings.json* file in the project that was previously created.
1. Add the following configuration settings for Azure AD:
  
    ``` json
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
    ```

    * **Instance** - Is the endpoint of the cloud provider. For this tutorial, accept the default endpoint for Azure AD.
    * **TenantId** - Is the identifier of the tenant where the application is registered. Replace the text in quotes with the **Directory (tenant) ID** value that was recorded earlier from the overview page of the registered application.
    * **ClientId** - Is the identifier of the application, also referred to as the client. Replace the text in quotes with the **Application (client) ID** value that was recorded earlier from the overview page of the registered application.
    * **ClientCertificates** - A self-signed certificate is used for authentication in the application. Replace the text of the **CertificateThumbprint** with the thumbprint of the certificate that was previously recorded.
    * **CallbackPath** - Is an identifier to help the server redirect a response to the appropriate application. This value shouldn’t be changed.
1. Save the changes to the file.
1. Record the value of the **CallbackPath**. This will be used later to define the **Redirect URI**
1. Under **Properties**, open the *launchSettings.json* file.
1. Record the https URL listed in the value of **applicationURL**. This will be used alongside the **CallbackPath** when defining the **Redirect URI**.

## See also

The following articles are related to the concepts presented in this tutorial:

* For more information about the differences of authentication versus authorization, see [Authentication vs. authorization](authentication-vs-authorization.md)
* For more information about the Microsoft Authentication Library (MSAL), see [Overview of the Microsoft Authentication Library (MSAL)](msal-overview.md)

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Add sign-in to an application](web-app-tutorial-03-sign-in-users.md)