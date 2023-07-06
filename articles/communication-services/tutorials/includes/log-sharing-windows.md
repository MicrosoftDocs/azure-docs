# Integrating a Log Sharing Feature in a C#/Windows Application

In this tutorial, we will guide you through the process of integrating a log sharing feature in your C#/Windows application using the CallingSDK.

## Prerequisites

- A working integration of CallingSDK in your application.
- Access to a `CallClient` object.

## Steps

### Step 1: Update your Layout

First, we need to add a button to your XAML layout file that users will use to initiate the log sharing process.

Here is a simple button with a tooltip named `exportLogsButton`. When clicked, it triggers the `ExportLogs_Click` function.

```xml
<AppBarToggleButton x:Name="exportLogsButton" Icon="Document" Click="ExportLogs_Click">
    <ToolTipService.ToolTip>
        <ToolTip Content="Export Logs"/>
    </ToolTipService.ToolTip>
</AppBarToggleButton>
```

### Step 2: Implement the Log Export Method

Now, let's define the `ExportLogs_Click` method. This method is triggered when the user clicks the "Export Logs" button. It creates a ZIP file containing the logs and prepares them for sharing.

```csharp
private async void ExportLogs_Click(object sender, RoutedEventArgs e) {
    // We will add Implementation in here
}
```

#### Collect Support Files

Next, it collects the support files to be zipped.

```csharp
List<string> files = callClient.debugInfo.SupportFiles.ToList();
if (files != null && files.Count > 0)
{
    // The rest of the code goes here
}
```

#### Set Up Save Picker

The next part sets up a save picker which prompts the user to choose a save location and filename for the ZIP file.

```csharp
var savePicker = new FileSavePicker
{
    SuggestedStartLocation = PickerLocationId.DocumentsLibrary
};

savePicker.FileTypeChoices.Add("ZIP Archive", new List<string> { ".zip" });
savePicker.SuggestedFileName = "acs_logs"; // Suggest a default filename

StorageFile zipFile = await savePicker.PickSaveFileAsync();
```

#### Create ZIP File

This section of the method creates the ZIP file.

```csharp
if (zipFile != null)
{
    using (var zipStream = await zipFile.OpenStreamForWriteAsync())
    {
        using (var archive = new ZipArchive(zipStream, ZipArchiveMode.Create))
        {
            foreach (var filePath in files)
            {
                StorageFile file = await StorageFile.GetFileFromPathAsync(filePath);
                var entry = archive.CreateEntry(file.Name);
                using (Stream entryStream = entry.Open())
                {
                    using (IRandomAccessStream fileStream = await file.OpenAsync(FileAccessMode.Read))
                    {
                        await fileStream.AsStreamForRead().CopyToAsync(entryStream);
                    }
                }
            }
        }
    }
}
```

#### Inform User of Successful ZIP Creation

The final part of the method informs the user that the files have been successfully zipped. It also offers to open the folder containing the zipped file.

```csharp
var dialog = new ContentDialog
{
    Title = "Log Files",
    Content = $"Files have been zipped to {zipFile.Name} in the selected location.",
    PrimaryButtonText = "Open Location",
    SecondaryButtonText = "Close",
    DefaultButton = ContentDialogButton.Primary
};

var result = await dialog.ShowAsync();

if (result == ContentDialogResult.Primary)
{


    StorageFolder parentFolder = await zipFile.GetParentAsync();
    await Windows.System.Launcher.LaunchFolderAsync(parentFolder);
}
```

That's it! You have now integrated a log sharing feature into your C#/Windows application. Users can now collect and share logs directly from the application.