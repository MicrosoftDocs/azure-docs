---
title: Azure AD v2 Windows Desktop Getting Started - Setup | Microsoft Docs
description: How Windows Desktop .NET (XAML) applications can call an API that require access tokens by Azure Active Directory v2 endpoint
services: active-directory
documentationcenter: dev-center-name
author: andretms
manager: mbaldwin
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/09/2017
ms.author: andret
ms.custom: aaddev

---

## Set up your project

This section provides step-by-step instructions for how to create a new project to demonstrate how to integrate a Windows Desktop .NET application (XAML) with *Sign-In with Microsoft* so it can query Web APIs that requires a token.

The application created by this guide exposes a button to graph and show results on screen and a sign-out button.

> Prefer to download this sample's Visual Studio project instead? [Download a project](https://github.com/Azure-Samples/active-directory-dotnet-desktop-msgraph-v2/archive/master.zip) and skip to the [Configuration](#create-an-application-express "Configuration Step") step to configure the code sample before executing.


### Create your application
1. In Visual Studio: `File` > `New` > `Project`<br/>
2. Under *Templates*, select `Visual C#`
3. Select `WPF App` (or *WPF Application* depending on the version of your Visual Studio)

## Add the Microsoft Authentication Library (MSAL) to your project
1. In Visual Studio: `Tools` > `Nuget Package Manager` > `Package Manager Console`
2. Copy/paste the following in the Package Manager Console window:

```powershell
Install-Package Microsoft.Identity.Client -Pre
```

> The package above installs the Microsoft Authentication Library (MSAL). MSAL handles acquiring, caching and refreshing user toskens used to access APIs protected by Azure Active Directory v2.

## Add the code to initialize MSAL
This step will help you create a class to handle interaction with MSAL Library, such as handling of tokens.

1. Open the `App.xaml.cs` file and add the reference for MSAL library to the class:

```csharp
using Microsoft.Identity.Client;
```
<!-- Workaround for Docs conversion bug -->
<ol start="2">
<li>
Update the App class to the following:
</li>
</ol>

```csharp
public partial class App : Application
{
    //Below is the clientId of your app registration. 
    //You have to replace the below with the Application Id for your app registration
    private static string ClientId = "your_client_id_here";

    public static PublicClientApplication PublicClientApp = new PublicClientApplication(ClientId);

}
```

## Create your application’s UI
The section below shows how an application can query a protected backend server like Microsoft Graph. 
A MainWindow.xaml file should automatically be created as a part of your project template. Open this file this file and then follow the instructions below:

1.	Replace your application’s `<Grid>` with be the following:

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
