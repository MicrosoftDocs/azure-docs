---
title: include file
description: include file
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: mtillman
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: include
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/17/2018
ms.author: jmprieur
ms.custom: include file
---

## Set up your project

In this section you create a new project to demonstrate how to integrate a Windows Desktop .NET application (XAML) with *Sign-In with Microsoft* so that the application can query Web APIs that require a token.

The application that you create with this guide displays a button that's used to call a graph, an area to show the results on the screen, and a sign-out button.

> [!NOTE]
> Prefer to download this sample's Visual Studio project instead? [Download a project](https://github.com/Azure-Samples/active-directory-dotnet-desktop-msgraph-v2/archive/master.zip), and skip to the [Configuration step](#register-your-application) to configure the code sample before you execute it.
>

To create your application, do the following:

1. In Visual Studio, select **File** > **New** > **Project**.
2. Under **Templates**, select **Visual C#**.
3. Select **WPF App (.NET Framework)**, depending on the version of Visual Studio version you're using.

## Add MSAL to your project

1. In Visual Studio, select **Tools** > **NuGet Package Manager**> **Package Manager Console**.
2. In the Package Manager Console window, paste the following Azure PowerShell command:

    ```powershell
    Install-Package Microsoft.Identity.Client -Pre
    ```

    > [!NOTE] 
    > This command installs Microsoft Authentication Library. MSAL handles acquiring, caching, and refreshing user tokens that are used to access the APIs that are protected by Azure Active Directory v2.0
    >

## Add the code to initialize MSAL

In this step, you create a class to handle interaction with MSAL, such as handling of tokens.

1. Open the *App.xaml.cs* file, and then add the reference for MSAL to the class:

    ```csharp
    using Microsoft.Identity.Client;
    ```
<!-- Workaround for Docs conversion bug -->

2. Update the app class to the following:

    ```csharp
    public partial class App : Application
    {
        //Below is the clientId of your app registration. 
        //You have to replace the below with the Application Id for your app registration
        private static string ClientId = "your_client_id_here";

        public static PublicClientApplication PublicClientApp = new PublicClientApplication(ClientId);

    }
    ```

## Create the application UI

This section shows how an application can query a protected back-end server such as Microsoft Graph. 

A *MainWindow.xaml* file should automatically be created as a part of your project template. Open this file, and then replace your application's *\<Grid>* node with the following code:

```xml
<Grid>
    <StackPanel Background="Azure">
        <StackPanel Orientation="Horizontal" HorizontalAlignment="Right">
            <Button x:Name="CallGraphButton" Content="Call Microsoft Graph API" HorizontalAlignment="Right" Padding="5" Click="CallGraphButton_Click" Margin="5" FontFamily="Segoe Ui"/>
            <Button x:Name="SignOutButton" Content="Sign-Out" HorizontalAlignment="Right" Padding="5" Click="SignOutButton_Click" Margin="5" Visibility="Collapsed" FontFamily="Segoe Ui"/>
        </StackPanel>
        <Label Content="API Call Results" Margin="0,0,0,-5" FontFamily="Segoe Ui" />
        <TextBox x:Name="ResultText" TextWrapping="Wrap" MinHeight="120" Margin="5" FontFamily="Segoe Ui"/>
        <Label Content="Token Info" Margin="0,0,0,-5" FontFamily="Segoe Ui" />
        <TextBox x:Name="TokenInfoText" TextWrapping="Wrap" MinHeight="70" Margin="5" FontFamily="Segoe Ui"/>
    </StackPanel>
</Grid>
```
