### [Visual Studio 2022](#tab/visual-studio)

1. In **Solution Explorer**, right-click the **Dependencies** node of your project. Select **Manage NuGet Packages**.

1. In the resulting window, search for *Azure.Identity*. Select the appropriate result, and select **Install**.

    :::image type="content" source="../articles/storage/common/media/visual-studio-identity-package.png" alt-text="A screenshot showing how to add the identity package.":::    

### [.NET CLI](#tab/net-cli)

```dotnetcli
dotnet add package Azure.Identity
```

---