---
title: 'Quickstart: Add video to your UWP application'
description: In this quickstart, you learn how to add video to your UWP app.
author: mikben
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/11/2020
ms.topic: quickstart
ms.service: azure-project-spool
---

-  Customer intent statements: 
   - I want to know how to add video to my UWP app

- Resources: 
  - [Spool Contributor Quickstart](https://review.docs.microsoft.com/en-us/azure/project-spool/contribute?branch=pr-en-us-104477)

- Gold Standard Docs:
  - TODO

- Discussion:
  - TODO

- TODOs:
  - Find related gold standard docs
  - Draft initial content

~

*Note: This was pulled from `External/quickstarts/quickstart-included-samples-cs.md`.*

~ 


# Quickstart for Windows Apps

This document will walk you through the steps required for building a Windows App with Spool services for realtime communications.

## Prerequisites

### Microsoft Visual Studio 2019

- Download your favorite flavor of Visual Studio 2019 from: https://visualstudio.com.
- In the **Visual Studio Installer** app, please verify if Visual Studio 2019 has the `Universal Windows Platform development` workload installed. Check also if the `Windows SDK 10 (10.0.17134.0)` or more recent is installed.

### Spool Resource Key

A valid spool resource key [see quickstart for ARM resources](quickstart-getspoolresource-armclient.md)

### Extra hardware

The resulting app will establish realtime audio and video communication between two computers. Using a VM for running the app is not recommended and will require extra configuration not covered by this document. It is recommended to deploy the app in two different computers. These computers should have a camera and a microphone each for properly run the app.

### Remote Tools for Visual Studio 2019

It is not necessary to have Visual Studio installed in both computers. `Remote Tools for Visual Studio 2019` is optional, but speeds up development when running your app remotely is required. Installing the Remote Tools in the second computer will cut significantly deployment times. 

Feel free to download and install the Remote Tools for Visual Studio 2019 from https://visualstudio.microsoft.com/downloads/#remote-tools-for-visual-studio-2019.

Alternatively, you can create app packages for deploying the app in the second computer for testing during development. It is a laborious operation during development time, but it will work if installing the Remote Tools is not an option.

## Create a new Windows application

### Configuring your app project

1. Launch Visual Studio a select `Create a new project`. Select `Blank App (Universal Windows)` and give it a name.
After clicking on the `Create` button you'll be asked to select the minimal and target Windows 10 SDK versions.
Check if the minimal version is at least 17763 and click `Ok`.

_Note: If you do not see the 'Blank App (Universal Windows)' option, verify if your computer have all prerequisites described at the top of this document._

2. At this time, the Spool packages are not publicly available on Nuget. Add the MyGet feed:

    - In Visual Studio go to `Tools` -> `Nuget Package Manager` -> `Nuget Package Settings`
    - Select `Package Sources` and add a new `Available Package Source`
    - Type **Spool NuGet Feed** in the `Name` field and **https://www.myget.org/F/spool-sdk/auth/d2d18e05-8424-467c-9b5b-9194847fcf64/api/v3/index.json** in the `Source` field.

3. Open the Solution Explorer panel (`View` -> `Solution Explorer`). Right-click on `References` on your project and select `Manage NuGet Packages...`. Under the `Package Source`
near the top right, change the source from "nuget.org" to `All`, so you can add the Spool nuget source to your project.

_Make sure the **`Include prereleases`** box next to the search filter is selected_

4. Click on the `Browse` tab. Search for and add (by selecting the package and clicking on the `Install` button) the following NuGets:

    - `Microsoft.Azure.Spool.Client` (Version 0.1.1154.2-alpha-d13c0ceb)
    - `Microsoft.Azure.Spool.Server` (Version 0.1.1154.2-alpha-d13c0ceb)
    - `WebRtc` (Version 1.71.0.9). The WebRtc package is available publicly on nuget.org from Optical Tone. Ensure not to use the default version of 1.75.0.2-Alpha.

Click on the `I Accept` button if you agree with the license terms of the packages.

5. Request access for media and network capabilities. Add the following capabilities to the `Package.appxmanifest` under the `Capabilities` tab:
    - Webcam
    - Microphone
    - Internet (Client and Server)
    - Private Networks (Client and Server)

### Adding UI elements

Add some basic UI elements to help accessing app's functionality. In `MainPage.xaml` add the following code, to the root `<Grid>` element:

```xml
<Grid>
    <Grid x:Name="LoginGrid" HorizontalAlignment="Center" VerticalAlignment="Center">
        <StackPanel Orientation="Vertical">
            <TextBlock Text="Please enter a session name:" />
            <TextBox x:Name="SessionNameTextBox"></TextBox>
            <Button Name="JoinButton" Content="Join" HorizontalAlignment="Right"  Click="JoinButton_Click"  />
        </StackPanel>
    </Grid>
    <Grid x:Name="VideoGrid" Visibility="Collapsed">
        <MediaElement x:Name="PeerVideo" RealTimePlayback="True" />
        <MediaElement x:Name="SelfVideo" Width="200" RealTimePlayback="True" HorizontalAlignment="Right" VerticalAlignment="Bottom" Margin="32"/>
    </Grid>
</Grid>
```

## Connect to Spool service to get Session tokens

> It's generally poor security practice to store secrets on the client, see Appendix A for info on how to connect to the Spool service from an app's web service.

The following steps are to be used within the `MainPage.xaml.cs` file.

1. The following namespaces containing classes that will be consumed by this app. Please add them to the top of your file:

```csharp
using Azure.Core;
using Microsoft.Azure.Spool.Client;
using Microsoft.Azure.Spool.Server;
using Microsoft.Azure.Spool.Service.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Org.WebRtc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Windows.Media.Capture;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
```

2. Add some plain old data structures used throughout the code for keeping state. Keep in mind that the following classes are not inner classes of the MainPage class.

```csharp
#region Helpers
public class ServiceToken
{
    public string Token { get; set; }
    public DateTime Expiration { get; set; }
}

public class TransportInfo
{
    public string Transport { get; set; }
    public int Port { get; set; }
}

public class RelayData
{
    public string Realm { get; set; }
    public string Relay { get; set; }
    public string Fqdn { get; set; }
    public List<TransportInfo> transports { get; set; }
}

public class Token
{
    public string Realm { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
}

public class RelayCredentials
{
    public List<Token> Tokens { get; set; }
    public int Expires { get; set; }
    public DateTime ExpireDate { get; set; }
    public DateTime Created { get; set; }
    public bool IsExpired { get; set; }
}

public class RelayToken
{
    public RelayData RelayData { get; set; }
    public RelayCredentials RelayCredentials { get; set; }
}

public class GatewayToken
{
    public ServiceToken ServiceToken { get; set; }
    public RelayToken RelayToken { get; set; }
}

internal class IceCandidate
{
    public string Candidate { get; set; }
    public string SdpMid { get; set; }
    public ushort SdpMLineIndex { get; set; }
}

internal class SdpOffer
{
    public EndpointModel From { get; set; }
    public string Sdp { get; set; }
}
#endregion
```

3. Add the connection string variable with the connection string from Azure as data member of the MainPage class. You've retrieved this piece of information in the `Spool Resource Key` step at the `Prerequisites` session at the top of this document.

```csharp
private const string ConnectionString = "<YOUR_CONNECTION_STRING_HERE>";
```

4. Add the data members used by the app for keeping signaling, session and WebRTC states.

```csharp
private Uri _serviceUri, _sessionUri;
private WebRtcFactory _factory;
private List<RTCIceServer> IceServers = new List<RTCIceServer>();
private TaskCompletionSource<bool> _handshakeDoneHandler;
private TaskCompletionSource<bool> _answerWaitHandler;
private string _answerSdpCache;
private string _endpointId;
private SessionClient _currentSession;
private RTCPeerConnection _peerConnection;
private IMediaStreamTrack _peerVideoTrack;
private IMediaStreamTrack _peerAudioTrack;
private IMediaStreamTrack _selfVideoTrack;
private IMediaStreamTrack _selfAudioTrack;
```

5. Add the event handler for the **Join** button added to the markup.

```csharp
private async void JoinButton_Click(object sender, RoutedEventArgs e)
{
    JoinButton.IsEnabled = false;

    // get token from server
    var token = await GetTokenFromServerAsync(SessionNameTextBox.Text);

    // join the session
    await JoinWithTokenAsync(_sessionUri, token);

    // get TURN credentials
    await UpdateIceCandidatesAsync(token);

    // init WebRTC library
    InitWebRtc();

    //Setup ICE handlers
    SetupICEHandlers();

    // if another participant is joined start a video call (Create Offer)
    var remoteParticipant = (await _currentSession.GetEndpointsAsync()).Value.FirstOrDefault(a => a.Id != _endpointId.ToString());
    if (remoteParticipant != null)
    {
        await CreateAndSendOffer(remoteParticipant);
    }

    var appView = Windows.UI.ViewManagement.ApplicationView.GetForCurrentView();
    appView.Title = "Joined Session: " + SessionNameTextBox.Text;

    LoginGrid.Visibility = Visibility.Collapsed;
    VideoGrid.Visibility = Visibility.Visible;
}
```

6. Add the method for creating or joining a session.

```csharp
#region Join Session
private async Task<AccessToken> GetTokenFromServerAsync(string sessionId)
{
    var serviceClient = new SessionServiceClient(ConnectionString);

    var sessionClient = serviceClient.GetSessionClient(sessionId);
    bool sessionExists;

    try
    {
        var response = await sessionClient.GetAsync();
        sessionExists = true;
    }
    catch (Exception)
    {
        sessionExists = false;
    }

    if (!sessionExists)
    {
        sessionClient = (await serviceClient.CreateSessionAsync(new SessionCreateOptions() { Id = sessionId })).Value;
    }

    _serviceUri = serviceClient.Uri;
    _sessionUri = sessionClient.Uri;
    _endpointId = Guid.NewGuid().ToString();

    var endpoint = await sessionClient.CreateEndpointAsync(new EndpointCreateOptions() { Id = _endpointId });

    Azure.Response<Azure.Core.AccessToken> token = await serviceClient.GenerateTokenAsync(new TokenCreateRequest() { SessionId = sessionId, EndpointId = _endpointId });

    return token.Value;
}

public async Task JoinWithTokenAsync(Uri serviceUri, AccessToken token)
{
    _currentSession = new SessionClient(serviceUri, token);

    // Register a callback
    _currentSession.GetSignalConnectionClient().On("msg", (string a) =>
    {
        Debug.WriteLine($"Someone says {a}");
    });

    await _currentSession.GetSignalConnectionClient().StartAsync();

    await UpdateIceCandidatesAsync(token);

}
#endregion
```

7. Add the code binding WebRTC with Spool Services.

```csharp
#region Setup WebRTC

private void InitWebRtc()
{
    //Init WebRT
    IEventQueue queue = EventQueueMaker.Bind(Windows.ApplicationModel.Core.CoreApplication.MainView.CoreWindow.Dispatcher);
    var configuration = new WebRtcLibConfiguration();
    configuration.Queue = queue;
    configuration.AudioCaptureFrameProcessingQueue = EventQueue.GetOrCreateThreadQueueByName("AudioCaptureProcessingQueue");
    configuration.AudioRenderFrameProcessingQueue = EventQueue.GetOrCreateThreadQueueByName("AudioRenderProcessingQueue");
    configuration.VideoFrameProcessingQueue = EventQueue.GetOrCreateThreadQueueByName("VideoFrameProcessingQueue");

    WebRtcLib.Setup(configuration);
}

private async Task UpdateIceCandidatesAsync(AccessToken accessToken)
{
    var builder = new UriBuilder(_serviceUri);
    builder.Path += "rtcgateway/token/composite";

    var client = new HttpClient();
    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken.Token);
    var responseMessage = await client.PostAsync(builder.Uri.ToString(), null);


    var turnTokenString = await responseMessage.Content.ReadAsStringAsync();

    DefaultContractResolver contractResolver = new DefaultContractResolver
    {
        NamingStrategy = new CamelCaseNamingStrategy
        {
            OverrideSpecifiedNames = true
        }
    };
    var gatewayToken = JsonConvert.DeserializeObject<GatewayToken>(turnTokenString, new JsonSerializerSettings
    {
        ContractResolver = contractResolver,
        Formatting = Formatting.Indented
    });

    string endpoint = gatewayToken.RelayToken.RelayData.Relay;
    IceServers.Clear();

    //add STUN
    IceServers.Add(new RTCIceServer()
    {
        Urls = new[] { "stun:" + endpoint + ":3478" }
    });

    //add TURN
    IceServers.Add(new RTCIceServer()
    {
        Urls = new[] { "turn:" + endpoint + ":3478" },
        Username = gatewayToken.RelayToken.RelayCredentials.Tokens[0].Username,
        Credential = gatewayToken.RelayToken.RelayCredentials.Tokens[0].Password,
        CredentialType = RTCIceCredentialType.Password
    });
}

private void CreatePeerConnection()
{
    var factoryConfig = new WebRtcFactoryConfiguration
    {
        AudioCapturingEnabled = true,
        AudioRenderingEnabled = true
    };
    _factory = new WebRtcFactory(factoryConfig);

    _peerConnection = new RTCPeerConnection(new RTCConfiguration()
    {
        Factory = _factory,
        BundlePolicy = RTCBundlePolicy.Balanced,
        IceTransportPolicy = RTCIceTransportPolicy.All,
        IceServers = IceServers
    });

    _peerConnection.OnIceCandidate += async (e) =>
    {
        if (_answerWaitHandler != null)
        {
            await _answerWaitHandler.Task;
        }
        await SendAsync("candidate", e.Candidate.Candidate);
    };

    _peerConnection.OnTrack += OnPeerConnectionTrackReceived;
}

private async Task ExchangeMediaAsync()
{
    // Get Video capture device.
    Debug.WriteLine("Getting video capture.");
    IReadOnlyList<IConstraint> mandatoryConstraints = new List<IConstraint>();
    IReadOnlyList<IConstraint> optionalConstraints = new List<IConstraint>();
    IMediaConstraints mediaConstraints = new MediaConstraints(mandatoryConstraints, optionalConstraints);

    bool requestApproved = await RequestAccessForMediaCaptureAsync();
    if (requestApproved)
    {
        Debug.WriteLine("Getting video capture.");
        IReadOnlyList<IVideoDeviceInfo> videoDevices = VideoCapturer.GetDevices().AsTask().Result;

        if (videoDevices.Any() && videoDevices.Count > 0)
        {
            var videoCapturer = VideoCapturer.Create(new VideoCapturerCreationParameters()
            {
                Name = videoDevices[0].Info.Name,
                Id = videoDevices[0].Info.Id,
                Factory = _factory
            });

            var videoTrackSource = VideoTrackSource.Create(new VideoOptions
            {
                Factory = _factory,
                Capturer = videoCapturer,
                Constraints = mediaConstraints
            });
            _selfVideoTrack = MediaStreamTrack.CreateVideoTrack("SELF_VIDEO", videoTrackSource);
            _peerConnection.AddTrack(_selfVideoTrack);

            if (_selfVideoTrack != null)
            {
                _selfVideoTrack.Element = MediaElementMaker.Bind(SelfVideo);
            }
        }
        // Get Audio
        Debug.WriteLine("Get Audio Capture Device");
        var audioTrackSource = AudioTrackSource.Create(new AudioOptions
        {
            Factory = _factory
        });
        _selfAudioTrack = MediaStreamTrack.CreateAudioTrack("SELF_AUDIO", audioTrackSource);

        _peerConnection.AddTrack(_selfAudioTrack);
    }
}

public async Task<bool> RequestAccessForMediaCaptureAsync()
{
    MediaCapture mediaAccessRequester = new MediaCapture();

    MediaCaptureInitializationSettings mediaSettings = new MediaCaptureInitializationSettings
    {
        AudioDeviceId = "",
        VideoDeviceId = "",
        StreamingCaptureMode = StreamingCaptureMode.AudioAndVideo,
        PhotoCaptureSource = PhotoCaptureSource.VideoPreview
    };

    bool accessRequestAccepted = true;
    try
    {
        await mediaAccessRequester.InitializeAsync(mediaSettings);
    }
    catch (Exception exp)
    {
        Debug.WriteLine($"Failed to obtain access permission: {exp.Message}");
        accessRequestAccepted = false;
    }

    return accessRequestAccepted;
}
#endregion
```

8. Add the code for creating the WebRTC offer to send out to the peer.

```csharp
#region Send Offer

private async Task CreateAndSendOffer(EndpointModel recipient)
{
    await Task.Run(async () =>
    {
        _handshakeDoneHandler = new TaskCompletionSource<bool>();
        //create PeerConnection
        CreatePeerConnection();
        await ExchangeMediaAsync();
        await SendOfferAsync(recipient);
        _handshakeDoneHandler.SetResult(true);
    });
}

private async Task SendOfferAsync(EndpointModel recipient)
{
    var offerOptions = new RTCOfferOptions
    {
        OfferToReceiveAudio = true,
        OfferToReceiveVideo = true
    };
    var offer = await _peerConnection.CreateOffer(offerOptions);

    Debug.WriteLine($"offer created. {offer.Sdp}");

    await _peerConnection.SetLocalDescription(offer).AsTask();

    var self = (await _currentSession.GetEndpointsAsync()).Value.FirstOrDefault(a => a.Self);
    var sdpOffer = new SdpOffer() { From = self, Sdp = _peerConnection.LocalDescription.Sdp };
    string offerJson = JsonConvert.SerializeObject(sdpOffer);

    await SendAsync("offer", offerJson, null);

    _answerWaitHandler = new TaskCompletionSource<bool>();
    await _answerWaitHandler.Task;

    RTCSessionDescriptionInit sdpInit = new RTCSessionDescriptionInit
    {
        Sdp = (string)_answerSdpCache,
        Type = RTCSdpType.Answer
    };

    var rtcOffer = new RTCSessionDescription(sdpInit);

    Debug.WriteLine("Setting remote descripton...");
    await _peerConnection.SetRemoteDescription(rtcOffer);

    Debug.WriteLine("Done!");
}

private async Task SendAsync(string type, string message, EndpointModel endpoint = null, bool excludeSelf = true)
{
    if (endpoint == null)
    {
        await _currentSession.GetSignalConnectionClient().BroadcastAsync(type, new object[] { message }, excludeSelf);
    }
    else
    {
        await _currentSession.GetEndpointClient(endpoint.Id).GetSignalClient().InvokeAsync(type, new object[] { message });
    }
}

#endregion
```

9. Add the message handles 

```csharp
#region Event Handlers

private void SetupICEHandlers()
{
    _currentSession.GetSignalConnectionClient().On<string>("offer", OnOfferReceivedAsync);
    _currentSession.GetSignalConnectionClient().On<string>("candidate", OnCandidateReceivedAsync);
    _currentSession.GetSignalConnectionClient().On<string>("answer", OnAnswerReceivedAsync);
}

private void OnPeerConnectionTrackReceived(IRTCTrackEvent e)
{
    Debug.WriteLine("OnTrack!");
    if (e.Track.Kind == "video")
    {
        Debug.WriteLine("Got Video");

        _peerVideoTrack = e.Track;

        if (_peerVideoTrack != null)
        {
            _peerVideoTrack.Element = MediaElementMaker.Bind(PeerVideo);
        }
    }
    else if (e.Track.Kind == "audio")
    {
        Debug.WriteLine("Got Audio");
        _peerAudioTrack = e.Track;
    }
}

private async void OnCandidateReceivedAsync(string candidate)
{
    if (_handshakeDoneHandler != null)
    {
        await _handshakeDoneHandler.Task;
    }

    RTCIceCandidateInit candidateInit = new RTCIceCandidateInit
    {
        Candidate = (string)candidate,
        SdpMid = "0",
        SdpMLineIndex = (ushort)0
    };

    var iceCandidate = new RTCIceCandidate(candidateInit);

    if (_peerConnection != null && _peerConnection.RemoteDescription != null)
        await _peerConnection.AddIceCandidate(iceCandidate);
}
private async void OnOfferReceivedAsync(string offer)
{
    await Task.Run(async () =>
    {
        //create PeerConnection
        CreatePeerConnection();

        var sdpOffer = JsonConvert.DeserializeObject<SdpOffer>(offer);
        RTCSessionDescriptionInit sdpInit = new RTCSessionDescriptionInit
        {
            Sdp = (string)sdpOffer.Sdp,
            Type = RTCSdpType.Offer
        };

        var rtcOffer = new RTCSessionDescription(sdpInit);

        await ExchangeMediaAsync();

        await _peerConnection.SetRemoteDescription(rtcOffer);

        RTCAnswerOptions answerOptions = new RTCAnswerOptions();
        var answer = await _peerConnection.CreateAnswer(answerOptions);
        await _peerConnection.SetLocalDescription(answer);

        await SendAsync("answer", answer.Sdp, endpoint: sdpOffer.From);
    });
}

private void OnAnswerReceivedAsync(string answer)
{
    Debug.WriteLine($"Answer received. {answer}");
    _answerSdpCache = answer;
    _answerWaitHandler?.SetResult(true);
}
#endregion
```

## Start a video chat

1. Launch the app by hitting F5
2. In the `conversation name` text box, enter a conversation name like `12345`
3. On another machine, launch the app and use the same conversation ID.

## Appendix A: Deploy an Azure function to generate access tokens

### Deploy an Azure function to generate access tokens

1. Open up Visual Studio and select file -> new project
2. In the 'New Project' windows search for Azure Function (C#). Give your Function App a name and click OK.
3. On the next screen, select "Http trigger", set the version to "Azure Functions v2(.Net Core)", and set the authorization level to "Anonymous". Click OK.
4. Replace the code in `Function1.cs` with the code below. Be sure the `ResourceName` is correct (in this quickstart, the resource name is "MySpoolService)." Assign the ApiKey variable to the primaryKey you copied.

    ```csharp
    namespace SpoolPPFunction
    {
        public static class Function1
        {

            private const string ConnectionString = "<<YOUR_CONNECTION_STRING>>";

            [FunctionName("RequestToken")]
            public static async Task<IActionResult> RequestToken(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "session/{id}")] HttpRequest req,
            [Table("sessions", Connection = "AzureWebJobsStorage")] CloudTable convTable,
            ILogger log, string id)
            {
                log.LogInformation("Creating a new token");

                string userName = req.Query["name"].ToString();
                log.LogInformation("Got userName=" + userName);


                var serviceClient = new SessionServiceClient(ConnectionString);

                SessionClient sessionClient;

                var findOperation = TableOperation.Retrieve<SessionTableEntity>("DEFAULT", id);
                var findResult = await convTable.ExecuteAsync(findOperation);
                if (findResult.Result == null)
                {
                    sessionClient = (await serviceClient.CreateSessionAsync(new SessionCreateOptions() { Id = id })).Value;

                    var c = new SessionTableEntity()
                    {
                        PartitionKey = "DEFAULT",
                        RowKey = id,
                        ServerSessionId = sessionClient.SessionId
                    };

                    TableOperation insertOrMergeOperation = TableOperation.InsertOrMerge(c);

                    // Execute the operation.
                    TableResult r = await convTable.ExecuteAsync(insertOrMergeOperation);
                }
                else
                {
                    var existingRow = (SessionTableEntity)findResult.Result;
                    var sessionId = existingRow.ServerSessionId;
                    sessionClient = serviceClient.GetSessionClient(sessionId);



                }
                var idString = Guid.NewGuid().ToString();

                if (string.IsNullOrEmpty(userName))
                    userName = "UserName" + idString;
                var endpoint = await sessionClient.CreateEndpointAsync(new EndpointCreateOptions() { Id = userName });

                Azure.Response<Azure.Core.AccessToken> token = await serviceClient.GenerateTokenAsync(new TokenCreateRequest() { SessionId = sessionClient.SessionId, EndpointId = userName });

                var result = new ObjectResult(token.Value)
                {
                    StatusCode = (int)HttpStatusCode.Accepted
                };

                return result;
            }
        }

        public class SessionTableEntity : TableEntity
        {
            public string ServerSessionId { get; set; }
        }

    }
    ```
## FAQ:
Q: I tried to build and run the sample, but get MissingMetadataException.

A: Disable `Compile with .NET Native Toolchain` option (Right click on UWP Project => Properties => Build). This option is enabled by default for "Release" configuration. [This is due to the problem that .NET Native Toolchain does not contain enough metadata for API reflection by default and has to be configured case by case.](https://docs.microsoft.com/en-us/dotnet/framework/net-native/apis-that-rely-on-reflection)

---

Q: I tried to run the UWP project but nothing happens!

A: Makes sure the UWP project is the start up project and use either x86 or x64 (preferably the latter) solution platform (anything other than `Any CPU`). 