---
author: t-leejiyoon
ms.service: azure-communication-services
ms.topic: include
ms.date: 07/28/2023
ms.author: t-leejiyoon
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

The audio filter feature allows different audio preprocessing features to be applied to outgoing audio. There are 2 types of audio filters: precall and midcall, with precall audio filters changing settings before call start and midcall changing settings while a call is in progress. You first need to import calling Features from the Calling SDK:

```csharp
using Azure.Communication;
using Azure.Communication.Calling.WindowsClient;
```

### Create UI buttons to change audio filter settings

This simple sample app contains a dropdown menu for selecting and audio filter setting.
The following steps exemplify how to add these buttons to the app.

1. In the `Solution Explorer` panel, double click on the file named `MainPage.xaml` for UWP, or `MainWindows.xaml` for WinUI 3.
2. In the central panel, look for the XAML code under the UI preview.
3. Modify the XAML code by the following excerpt:
```xml
<StackPanel Orientation="Horizontal">
    <CheckBox x:Name="EchoCancellation" Content="Echo Cancellation" Width="142" Margin="10,0,0,0" Click="EchoCancellation_Click"/>
</StackPanel>
```
Keep `MainPage.xaml.cs` or `MainWindows.xaml.cs` open. The next steps will add more code to it.

## Allow app interactions

The UI buttons previously added need to operate on top of a placed `Call`. It means that a `Call` data member should be added to the `MainPage` or `MainWindow` class.
Additionally, to allow the asynchronous operation creating `CallAgent` to succeed, a `CallAgent` data member should also be added to the same class.

Add the following data members to the `MainPage` or `MainWindow` class:
```csharp
CallAgent callAgent;
Call call;
```

## Create button handlers

Previously, two UI buttons were added to the XAML code. The following code adds the handlers to be executed when a user selects the button.
The following code should be added after the data members from the previous section.

```csharp
private async void EchoCancellation_Click(object sender, RoutedEventArgs e)
{
    // apply echo cancellation settings
}
```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Calling client library for UWP.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| `CallOptions` | The `CallOptions` are the main entry point to any configurations to be applied at the start of a call. Some of its inheriting classes include `StartCallOptions` and `JoinCallOptions` |
| `OutgoingAudioOptions` | The `OutgoingAudioOptions` are used to specify outgoing audio configurations. |
| `PrecallOutgoingAudioFilters` | The `PrecallOutgoingAudioFilters` are used to set features such as noise suppression and automatic gain control before a call starts. |
| `MidcallOutgoingAudioFilters` | The `MidcallOutgoingAudioFilters` are used to set features such as echo cancellation while a call is ongoing.|


## Midcall outgoing audio filter 
`MidcallOutgoingAudioFilters` can be applied after a call has started using the `ApplyOutgoingAudioFilters` method. To apply any midcall audio filters, create a `MidcallOutgoingAudioFilters` as shown in the following code:

```csharp
var echoCancellationCheckbox = sender as CheckBox;
var midcallOutgoingAudioFilter = new MidcallOutgoingAudioFilters();
midcallOutgoingAudioFilter.EnableAEC = echoCancellationCheckbox.IsChecked.Value;

call.ApplyOutgoingAudioFilters(midcallOutgoingAudioFilter);
```

### Ccho cancellation
This feature allows users to enable or disable echo cancellation on outgoing audio. By default, this feature is enabled.

## Precall outgoing audio filter 
`PrecallOutgoingAudioFilters` can be applied when a call starts. 

To apply any precall audio filters, begin by creating a `PrecallOutgoingAudioFilters` and passing it into as shown in the following code:
```csharp
var options = GetStartCallOptions();
var outgoingAudioOptions = options.OutgoingAudioOptions;
var precallOutgoingAudioFilter = new PrecallOutgoingAudioFilters()
{
    EnableAGC = true,   // setting automatic gain control
    NoiseSuppressionMode = NoiseSuppressionMode.High   // setting noise suppression
};

outgoingAudioOptions.AudioFilters = precallOutgoingAudioFilter;

var call = await this.callAgent.StartCallAsync(new[] { new UserCallIdentifier(acsCallee) }, options);
return call;
```
### Noise suppression
This feature allows users to change the noise suppression mode on outgoing audio. The currently available modes are `Off`, `Auto`, `Low`, and `High`. By default, this feature is set to `Auto` mode. 

### Automatic gain control
This feature allows users to enable or disable automatic gain control on outgoing audio. By default, this feature is enabled.

## Run the code

Make sure Visual Studio builds the app for `x64`, `x86` or `ARM64`, then hit `F5` to start running the app. After that, click on the `Call` button to place a call to the callee defined.

Keep in mind that the first time the app runs, the system prompts user for granting access to the microphone.
