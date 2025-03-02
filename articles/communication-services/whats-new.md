---
title: What's new in Azure Communication Services
description: Learn about the latest additions to Azure Communication Services.
author: sroons
ms.author: serooney
ms.service: azure-communication-services
ms.topic: conceptual
ms.date: 01/01/2024
ms.custom: template-concept, references_regions
---

# What's new in Azure Communication Services

This article describes new features and updates related to Azure Communication Services.

[!INCLUDE [Survey Request](includes/survey-request.md)]

## January 2025

### SMS Opt-Out Management API

The Opt-Out Management API is now available in Public Preview for Azure Communication Services.

The Opt-Out Management API empowers developers to programmatically manage SMS opt-out preferences, enabling businesses to handle opt-out workflows seamlessly and ensure compliance with global messaging regulations.

Unlike static opt-out management processes, where handling preferences is often manual and disconnected, this API introduces automation and flexibility. With endpoints for adding, removing, and checking opt-out entries, developers can centralize management across multiple channels and create smarter workflows that align with customer preferences and regulatory requirements.

For example, a business can manage custom opt-out workflows where customers opt out via SMS and later update their preferences through a web portal. The Opt-Out Management API ensures these changes are synchronized in real time, providing businesses with complete control over compliance and transparency.

#### Importance of opt-out management

Effective opt-out management is a cornerstone of responsible and compliant SMS communication. The Opt-Out Management API provides the tools to:

- Ensure Compliance: By automating opt-out workflows, businesses can meet regulatory requirements, reducing the risk of violations.
- Improve Efficiency: Replace manual processes with automation to streamline operations, particularly for large-scale messaging campaigns.
- Enhance Customer Trust: Enable customers to manage their preferences across different platforms, ensuring a transparent and consistent experience.

#### Sample code

```javascript
string connectionString = "<Your_Connection_String>";
SmsClient smsClient = new SmsClient(connectionString);
smsClient.OptOuts.Add("<from-phone-number>", new List<string> { "<to-phone-number1>", "<to-phone-number2>" });
```

#### Get started with opt-Out management

For more information, see:

- [Short Message Service (SMS) Opt-Out Management API for Azure Communication Services](./concepts/sms/opt-out-api-concept.md).
- [Send OptOut API requests with API using hash message authentication code (HMAC)](./quickstarts/sms/opt-out-api-quickstart.md).

### Real-time text (RTT)

Real-time text (RTT) is a system for transmitting text over the internet. RTT enables the recipient to receive and display the text at the same rate as it is being produced without the user pressing send. This ability provides the effect of immediate and continuous communication.

:::image type="content" source="media/whats-new-images/rtt-demo.gif" alt-text="Animated image simulating real time text between people in a meeting and a person using a mobile device.":::

Unlike traditional chat messaging, in which the recipient sees the full message only after it is completed and sent, RTT provides an immediate and continuous stream of communication.

For example, in a video or voice call, a user typing "Hello, how are you?" sees each character appear on the recipient’s screen as they type: "H," then "He," then "Hel," and so on. This messaging of text creates a dynamic, conversational experience that mirrors spoken communication. 

We added new APIs to Azure Communication Services Calling SDKs so that developers can easily and seamlessly integrate RTT into voice and video calls. These APIs also work in tandem with other accessibility features such as closed captions.

#### Why RTT support is important

RTT is an accessibility feature, and Microsoft is committed to accessibility. This commitment is  relevant to Azure Communication Services. The ability to inclusively reach as many humans as possible is an essential value proposition of a developer platform that connects people to people; and people to AI.

Here’s how RTT makes a difference:

- Better Accessibility: RTT empowers individuals with speech or hearing impairments to actively participate in conversations. Its real-time functionality ensures their input is received as fluidly and immediately as spoken words, creating equitable and inclusive communication experiences.

- Enhancing Clarity: In environments where background noise or technical limitations affect audio quality, RTT serves as a reliable text-based alternative to convey important messages accurately.

As communication moves increasingly to internet-based platforms, features like RTT play a critical role in making digital interactions more inclusive and accessible.

RTT isn't only a valuable feature, it's also essential for meeting global accessibility standards. Under the [European Accessibility Act (Directive (EU) 2019/882)(https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882)], voice and video calling services in the European Union are required to support RTT by June 2025.

Azure Communication Services is committed to providing solutions that meet these evolving standards. We want to ensure that all users, regardless of ability, can engage in meaningful and accessible communication.

### Next steps

- [Real Time Text (RTT) overview](concepts/voice-video-calling/real-time-text.md)
- [Real Time Text (RTT) quickstart](quickstarts/voice-video-calling/get-started-with-real-time-text.md)

### Calling Native iOS SDK enabled picture-in-picture (PiP)

Multitasking is an essential part of how we work and communicate today. With this in mind, Azure Communication Services introduces picture-in-picture (PiP) mode for video calling applications. This powerful feature enhances user experience by enabling a video stream to continue in a floating, movable window while users navigate other applications on their devices.

:::image type="content" source="media/whats-new-images/picture-in-picture.png" alt-text="Animation of a mobile device using picture-in-picture mode." lightbox="media/whats-new-images/picture-in-picture.png":::

#### Why we need picture-in-picture (PiP) mode

PiP mode lets users keep their video calls visible and uninterrupted as they switch between apps or multitask. For example, healthcare professionals can input electronic health records (EHR) in Epic while maintaining video communication with patients. Similarly, users in industries like banking or customer service can seamlessly switch to other tasks without ending the call.

#### How it works

The Native Calling SDK and UI make it simple to implement PiP in your app. It provides built-in features to:

- Join calls: Start and manage calls effortlessly.
- Render video streams: Display local and remote video streams within the PiP window.
- Manage permissions: The SDK handles user consent and system requirements, ensuring smooth operation of PiP.

PiP keeps calls active in both the foreground and background. This ability ensures uninterrupted communication while users:

- Navigate to other apps.
- Switch between video streams.
- Return to the calling experience instantly via the floating PiP window.

#### Why PiP matters

A traditional full-screen video UI can limit multitasking, but PiP empowers users to stay productive without sacrificing connectivity. Key benefits include:

- Improved workflow in multitasking scenarios.
- Continued access to video calls while using other apps.
- An intuitive user interface with minimal interruption.

#### Technical considerations

PiP functions depend on the capabilities of the device, such as CPU performance, RAM, and battery state. Supported devices ensure the PiP window is visible, movable, and easy to use, regardless of the app in focus.

This feature further enhances the Azure Communication Services UI Library, enabling customers like Contoso to maintain active calls, even when navigating between custom activities like chat or task management.

For more information, see [Enable picture-in-picture (PIP) in an application](how-tos/ui-library-sdk/picture-in-picture.md).

### Explicit consent for Teams meetings recording and transcription

Explicit consent for Teams meetings recording and transcription is now generally available in the Web calling SDK, enhancing user privacy and security. This feature ensures that participants must explicitly consent to being recorded and transcribed, which is crucial in environments with stringent privacy regulations.

When a Teams meeting recording or transcription is initiated, participants' microphones and cameras are disabled until they provide consent using the new Azure Communication Services API. Once consent is given, participants can unmute and enable their cameras.

If a user joins a meeting already in progress, they follow the same procedure. However, this feature isn't supported in Android, iOS, or Windows calling SDK, nor in the Web and Mobile UI library. Explicit consent is only supported in Teams meetings and Teams group calls, with plans to expand within the broader Azure Communication Services ecosystem.

To implement explicit consent for recording and transcription in your Teams meetings, you can use the following sample code to check if consent is required and to grant consent:

```javascript
const isConsentRequired = callRecordingApi.isTeamsConsentRequired;
callRecordingApi.grantTeamsConsent();
```

For more information, see [Manage call recording on the client > Explicit consent](./how-tos/calling-sdk/record-calls.md#explicit-consent).

### Breakout rooms in the Web Calling SDK

Breakout rooms are now available in the Web Calling SDK, enhancing flexibility and collaboration in online meetings. This feature allows participants to join smaller, focused groups within a larger meeting, boosting productivity and engagement. Whether it's dividing students into small groups for focused discussions, ensuring private and confidential discussions with clients, or conducting virtual consultations with private patient discussions, breakout rooms offer versatile and useful applications.

Breakout rooms enable participants to join another call linked to the main meeting. Users can join and return to the main room as set by the organizers. Participants can view members, engage in chat, and see details of the breakout room. Breakout room managers can access specific room information and join them.

:::image type="content" source="media/whats-new-images/breakout-rooms-calling-sdk.png" alt-text="Screenshot of Microsoft Teams breakout rooms using the web Calling SDK." lightbox="media/whats-new-images/breakout-rooms-calling-sdk.png":::

One limitation is that Azure Communication Services doesn't support the creation or management of breakout rooms, and this feature isn't available in Android, iOS, and Windows calling SDK.

For more information, see [Breakout rooms](how-tos/calling-sdk/breakoutrooms.md).

### View Azure Communication Services survey data

Teams admins can now view Azure Communication Services survey data in Teams support tools.

When your Azure Communication Services SDKs submit a survey as part of any [Teams interop meeting scenario](how-tos/calling-sdk/teams-interoperability.md), the survey data is now available through the Teams meeting organizer's support tools. This capability is in addition to the Azure Communication Services admins access in the Azure Monitor logs.

This update enables Teams admins analyze subjective quality feedback from their Azure Communication Services meeting participants alongside their Teams participants. The specific Teams survey dimensions are referred to as ‘rating’ and can be located here.

The Azure Communication Services survey data is available in the following Teams support tools:

- Teams Call Quality Dashboard and Teams Call Analytics: [Monitor and improve call quality for Microsoft Teams](/microsoftteams/monitor-call-quality-qos)
- Teams Call Quality Connector for Power BI: [Use Power BI to analyze CQD data for Microsoft Teams - Microsoft Teams](/microsoftteams/cqd-power-bi-query-templates)
- Teams Graph API: [Microsoft Graph overview and userFeedback resource type – Microsoft Graph v1.0](/graph/overview)

For more information, see [Azure Communication Services End of Call Survey overview](./concepts/voice-video-calling/end-of-call-survey-concept.md#view-survey-data-as-a-teams-administrator).

### Identify web calling participants with custom data tags

Now developers can add up to three custom data attributes to call participants with the WebJS calling client and view them in Azure Monitor. You can use these customizable attributes to enhance your post-call analysis. Since you have control over the data creation, you can use it for A/B testing, labeling such as west coast, release version, and so on. You can use [Call Diagnostics](./concepts/voice-video-calling/call-diagnostics.md#how-can-i-use-diagnosticoptions-to-view-tagged-calls-in-call-diagnostics) to search for these attributes or create custom queries with [Log Analytics](./concepts/analytics/query-call-logs.md).

:::image type="content" source="media/whats-new-images/call-diagnostics-test.png" alt-text="Screen capture of Microsoft Azure Call Diagnostics showing the label call diagnostics test and new diagnostic options custom data tags." lightbox="media/whats-new-images/call-diagnostics-test.png":::

For more information, see [Tutorial on how to attach custom tags to your client telemetry](./tutorials/voice-video-calling/diagnostic-options-tag.md).

## December 2024

### Teams user interop calling

Our applications can now directly call individual Microsoft Teams users. Those Teams users can be using Microsoft Teams or an authenticated Azure Communication Services Calling SDK endpoint. This feature makes Teams interoperability more complete. You can build custom apps connecting people to:
- Individual Teams users
- Teams call queues and Auto Attendant
- Teams meetings

You can use these features in business-to-coustomer (B2C) contact center and meeting applications to keep external customers in highly tailored websites and app experiences. You can also use this feature to keep all employee and agent communication activity in a single hub: Teams.

For more information, see [Capabilities for Microsoft Teams users in Azure Communication Services calls](./concepts/interop/guest/calling-capabilities.md).

### SMS support for 10 digit long code

Ten digit long code (10DLC) for SMS is now in public preview. Support for 10DLC enables enterprises with a trusted and scalable messaging solution to connect with their customers efficiently and compliantly.

The 10DLC SMS dedicated messaging channel enables businesses to send messages using local phone numbers. 10DLC offers a unique, registered phone number for your business, enhancing trust and ensuring compliance with carrier regulations. Perfect for transactional alerts, promotional messages, and customer service, 10DLC ensures higher message deliverability while adhering to industry standards.

#### Benefits of Using 10DLC SMS

- **Improved Deliverability**

   A 10-digit number ensures higher message deliverability compared to traditional long codes, making it an effective way to ensure your messages reach your customers.

- **Local Presence**

   Using a local 10-digit number provides a more personal and trusted connection with your customers, increasing engagement and response rates.

- **Cost-effective**

   Using a 10-digit number offers a more affordable option compared to short codes, providing businesses with an efficient and cost-effective way to send high-volume messages.

- **Versatility**

   Perfect for various use cases, including transactional messages, customer support, promotions, and marketing campaigns.

For more information, see:
 - [SMS Concepts](./concepts/sms/concepts.md)
 - [Apply for 10DLC numbers](./quickstarts/sms/apply-for-ten-digit-long-code.md)
 - [SMS FAQ](./concepts/sms/sms-faq.md)

## November 2024

### Call Automation troubleshooting improvements

We improved notifications to help developers troubleshoot Call Automation. Now, you receive notifications if the CreateCall or Answer APIs fail asynchronously through the new `CreateCallFailed` and `AnswerFailed` events. Along with these events, we provide error codes for various leave and call end scenarios, helping you make informed decisions about what to do next.

We also revamped the error code documentation to offer better guidance for handling issues independently. In addition, you can now view Call Automation callback events in Azure metrics.

:::image type="content" source="media/whats-new-images/call-automation-view-callback-events.png" alt-text="Screen capture of Call Automation callback events in Azure metrics." lightbox="media/whats-new-images/call-automation-view-callback-events.png":::

For more information, see:

- [Troubleshooting guide for Call Automation SDK error codes](./resources/troubleshooting/voice-video-calling/troubleshooting-codes.md?pivots=automation).
- [How to view Azure Communication Services Callback events via Azure Metrics](./concepts/analytics/logs/call-automation-metrics.md).

## October 2024

### Enable advanced noise suppression on web desktop browsers

The WebJS Calling SDK now includes background audio noise suppression. This feature improves call quality by reducing background noise and ensuring that the speaker's voice remains clear and understandable.

This technology is useful in environments with high levels of ambient noise, such as open offices or public spaces, where extra sounds can interfere with communication. By filtering out ambient noise, noise suppression helps participants concentrate on the conversation without interruptions.

Our advanced noise suppression models can manage distracting noises, such as a dog barking and background conversations.

For more information, see [Add audio quality enhancements to your audio calling experience](./tutorials/audio-quality-enhancements/add-noise-supression.md).

### Extended caller information

Incoming call notifications now include the caller line ID (CLID) and calling party name (CNAM). This information can be used to identify the phone number of an incoming call.

```javascript
const incomingCallHandler = async (args: { incomingCall: IncomingCall }) => { const incomingCall = args.incomingCall; // Get information about caller console.log(callerInfo.displayName); console.log(callerInfo.identifier); };
```

For more information, see [CallerInfo interface](/javascript/api/azure-communication-services/@azure/communication-calling/callerinfo), [Manage calls > Receive an incoming call](./how-tos/calling-sdk/manage-calls.md#receive-an-incoming-call), and [Manage calls > Check call properties](./how-tos/calling-sdk/manage-calls.md#check-call-properties).

### Remote mute VoIP meeting participants

For customers to conduct disruption-free group meetings, virtual appointments, and business-to-consumer (B2C) engagements, they often require controls to manage noise from inattentive participants. A participant might be driving and speaking to their friends without realizing that their noise and conversation is being relayed to participants in the meeting. The ability to remotely mute a VoIP participant comes handy in such situations. It enables another participant to remotely mute one or more VoIP participants in the call. Participants who are muted can unmute themselves when they need to speak.

The ability to remotely mute a participant is now generally available for calls with the following specific functions:

- A VoIP user remotely mutes all other VoIP participants in an Azure Communications Services Rooms and group calls using the following API operation:

   ```javascript
   await call.muteAllRemoteParticipants();
   ```

- A VoIP user remotely mutes one or several VoIP participants in an Azure communications services Rooms and group calls using the following API operation:

   ```javascript
   await call.remoteParticipants[0].mute();
   ```

In Azure Communication Services Rooms calls, only VoIP users with Presenter role can mute other participants to avoid undesired remote mutes.

When a local call participant mutes another participant, it raises the `mutedByOthers` event. This event causes the client to notify the VoIP participant that they're muted.

For more information, see [Remote calls > Mute and unmute a call](./how-tos/calling-sdk/manage-calls.md#mute-other-participants).

### Improved Call Automation bot-to-user voice interactions

In addition to server programmability of Rooms and troubleshooting improvements, we also made an array of other improvements to Call Automation that enable more powerful bots and interactive voice response (IVR).

- **Hold/Unhold:** Provide developers with the ability to play music while putting participants on hold through supported file formats of WAV and MP3.

- **Play multiple audio files:** We enhanced our existing Play and Recognize APIs. Developers now have the ability to provide multiple audio files, text files, and Speech Synthesis Markup Language (SSML) inputs when requesting a Play or Recognize action.

- **Play barge-in:** Developers can provide barge-in capability to the Play action, enabling you to interrupt a current prompt, such as hold music, with a new message such as wait time announcement.

- **Play started event:** We enabled a `playStarted` event to let developers know that a play prompt started.

- **VoIP to PSTN transfer:** Developers can now transfer VoIP users to PSTN/SIP endpoints. For inbound PSTN calls, the call connection object now contains the PSTN number the user dialed.

For more information, see [Call Automation overview](./concepts/call-automation/call-automation.md).

### Enhance email communication with inline attachments

Email service now offers a public preview of inline image attachments.

Email communication is more than just text. It's about creating engaging and visually appealing messages that capture the recipient's attention. One way to engage email recipients is by using inline attachments, which enable you to embed images directly within the email body.

Inline attachments are images or other media files that you embed directly within the email content, rather than sending as separate attachments. Inline attachments let the recipient view the images as part of the email body, enhancing the overall visual appeal and engagement.

#### Using inline attachments

Some reasons to use inline attachments:

- **Improved Engagement:** Inline images can make your emails more visually appealing and engaging.

- **Better Branding:** Embedding your logo or other brand elements directly in the email can reinforce your brand identity.

- **Enhanced User Experience:** Inline images can help illustrate your message more effectively, making it easier for recipients to understand and act on your content.

#### Benefits of using CID for inline attachments

We use the HTML attribute content-ID (CID) to embed images directly into the email body. Using CID for inline attachments is considered the best approach for the following reasons:

- **Reliability:** CID embedding references the image data using a unique identifier, rather than embedding the data directly in the email body. CID embedding ensures that the images are reliably displayed across different email clients and platforms.

- **Efficiency:** CID enables you to attach the image to the email and reference it within the HTML content using the unique content-ID. This method is more efficient than base64 encoding, which can significantly increase the size of the email and affect deliverability.

- **Compatibility:** Most email clients support CID, ensuring that your inline images are displayed correctly for most recipients.

- **Security:** Using CID avoids the need to host images on external servers, which can pose security risks. Instead, the images are included as part of the email, reducing the risk of external content being blocked or flagged as suspicious.

For more information, see:
- [Using inline attachments](./concepts/email/email-attachment-inline.md)
- [Send email with attachments using Azure Communication Services](./quickstarts/email/send-email-advanced/send-email-with-attachments.md)
- [Send email with inline attachments using Azure Communication Services](./quickstarts/email/send-email-advanced/send-email-with-inline-attachments.md)

### Connect multiple custom domains per email resource

Developers can now connect multiple custom domains with the same Azure Communication Services resource. This feature enables Developers to manage their Azure Communication Services resources more effectively to support various business applications or customers using different custom domains. This feature is currently in public preview.

Some scenarios in which connecting multiple custom domains is useful:

- Messaging organizations that need to support multiple custom domains across several applications can use one Azure Communication Services resource to manage and support these applications, reducing resource management efforts.

- SaaS service providers can manage many customers with fewer Azure Communication Services resources.

:::image type="content" source="media/whats-new-images/email-resource-demo.png" alt-text="Screen capture of Communication Service Email Demo domains." lightbox="media/whats-new-images/email-resource-demo.png":::

> [!NOTE]
> We enable customers to link up to 100 custom domains to a single communication service resource. All Mail-From addresses configured under these custom domains are accessible for the communication service resource. You can only link verified custom domains.

For more information, see [Connect a verified email domain](./quickstarts/email/connect-email-communication-resource.md)

## September 2024

### Native UI Library customization and accessibility

We have a suite of new features for the open source Calling Native UI Library that provide enhanced customization options and improved accessibility for developers building communication experiences on Android and iOS. Developers can use these APIs to make video calling better fit their brand identity, provide improved user experiences, and ensure their services are accessible to a wider audience.

#### Empower brands

You can now use the Native UI Library to:
- Change interface colors to match brand themes.
- Customize call title and subtitle for personalized interactions.
- Configure the button bar by adding, removing, or modifying action buttons to suit specific business workflows.

#### Use cases

- **Healthcare Providers**

   A telemedicine platform can now align in-call interfaces with its brand colors, giving patients a familiar and trustworthy experience. Customizing the call title to display **Telemedicine Session** and adding subtitles like **Dr. Jane Doe** help ensure that patients know exactly whom they’re speaking with. Developers can further tailor the call interface by adding or removing buttons, such as a custom **End Consultation** button.

- **Custom Workflows for Customer Support**

   Enterprises providing customer support through calling can now use customized buttons to streamline the user experience. For example, instead of a generic button layout, they can configure buttons like **Hold**, **Transfer to Supervisor**, or **Open Ticket** to match their specific operational workflows. Custom workflows improve agent efficiency and enhance customer satisfaction.

:::image type="content" source="media/whats-new-images/native-ui-custom-workflows.png" alt-text="Side-by-side screen capture of mobile phone screens comparing unbranded to branded experiences.":::

#### Captions components

Accessibility is a key consideration for businesses aiming to reach diverse audiences. Closed captions for Azure Communication Services and Teams interop calls can improve the communication experience for users with hearing impairments. You can also use closed captions in situations where audio clarity may be compromised such as noisy environments.

:::image type="content" source="media/whats-new-images/native-ui-closed-captions.png" alt-text="Screen captures of four different mobile phone screens showing closed caption experiences." lightbox="media/whats-new-images/native-ui-closed-captions.png":::

For more information, see Native UI Library tutorials:
- [Theme the UI Library in an application (adjust colors)](./how-tos/ui-library-sdk/theming.md)
- [Customize buttons](./how-tos/ui-library-sdk/button-injection.md)
- [Customize the title and subtitle](./how-tos/ui-library-sdk/setup-title-subtitle.md)
- [Enable closed captions](./how-tos/ui-library-sdk/closed-captions.md)

### Call Recording reliability enhancements

We introduced new functions in bring your own storage (BYOS) for call recording. The enhancements provide customers with the option to download their recordings and receive notifications if recording uploads to their storage fail due to misconfiguration.

When the first attempt to upload to a customer’s blob storage fails, status and error codes are provided. These codes address common issues such as:

- Managed Identity not enabled
- Permissions not set up correctly
- Container does not exist
- Invalid container name or storage path

These error messages help reduce the loss of recordings by providing timely notifications for manual action (such as direct download) and guiding customers to resolve configuration issues for BYOS.

For more information, see [Bring your own Azure storage overview](./concepts/call-automation/call-recording/bring-your-own-storage.md).

## August 2024

### Enhance custom app experiences with Microsoft Teams

We’re announcing a set of enhancements for developers building custom app and website experiences that connect to users on Microsoft Teams. Azure Communication Services and these new capabilities are especially tailored for business-to-consumer (B2C) interactions where an external user (the consumer) talks to an employee that is using Teams (the business).

In-Teams enhancements:

- Breakout Rooms
- Together Mode
- Enhanced Audio

Joining Teams made easier:

- Short URL
- Join by Meeting ID

#### Together mode: Bring everyone into the same room 

We now support Microsoft Teams' Together Mode in public preview, enhancing the virtual meeting experience for participants joining through Azure Communication Services. This integration enables Azure Communication Services participants to render the Together Mode stream, creating a shared background that makes it feel like everyone is in the same room. It’s a great way to reduce meeting fatigue and help participants feel more engaged and attentive.

:::image type="content" source="media/whats-new-images/together-mode.png" alt-text="Screenshot of Azure Communication Services participants rendered in the Together Mode stream." lightbox="media/whats-new-images/together-mode.png":::

Together Mode is useful for making virtual gatherings more immersive and interactive. Whether you're hosting a team meeting, a virtual event, or a classroom session, this feature can make your meetings feel more connected. Plus, organizations can customize these virtual environments to reflect their brand or meeting context through the Teams Developer Portal. Just a heads-up, Teams users need a Teams Premium license to use custom Together Mode scenes. 

For more information, see [Together Mode](./how-tos/calling-sdk/together-mode.md).

#### Breakout rooms: Enhance virtual collaboration

Continuing our efforts to make virtual meetings a more dynamic and interactive experience, Microsoft Teams introduces breakout rooms integrated with Azure Communication Services for an optimized experience. Currently in public preview, this function enables you to divide your meetings into smaller, more focused groups, enhancing the dynamism and engagement of discussions.

:::image type="content" source="media/whats-new-images/breakout-rooms-integrated.png" alt-text="Screenshot of Microsoft Teams breakout rooms integrated with Azure Communication Services." lightbox="media/whats-new-images/breakout-rooms-integrated.png":::

Breakout rooms are perfect for diving into specific areas without the distractions of a larger meeting. Whether you're working on a team project, hosting a classroom session, or conducting group therapy, breakout rooms help facilitate in-depth conversations and active participation. This ability leads to more efficient and productive meetings.

Teams administrators can easily manage the availability of breakout rooms through meeting policies, ensuring they're used effectively. Currently in public preview, this integration offers a glimpse into the future of virtual collaboration, making online meetings more engaging and interactive. 

For more information, see [Tutorial - Integrate Microsoft Teams breakout rooms](./how-tos/calling-sdk/breakoutrooms.md).

#### Enhanced support for audio conferencing: Ensuring reliable connections 

Microsoft Teams revolutionized seamless communication during virtual appointments by enabling a single Teams meeting to have multiple audio-conferencing setups. This means that participants can join through the most optimal phone line, ensuring they stay connected even if they face internet issues.

Azure Communication Services now exposes this configuration, enabling developers to provide the most optimal phone line to their customers. This feature not only enhances the reliability of virtual appointments but also ensures that participants can always stay connected, making virtual meetings more efficient and stress-free. 

For more information, see [Teams Meeting Audio Conferencing](./how-tos/calling-sdk/audio-conferencing.md). 

#### Short URL support - web and native 

Sharing meeting links just got easier with the new short URL format for Microsoft Teams, now supported by Azure Communication Services. This update enables you to share meeting links more conveniently, making the process smoother for everyone involved. 

We updated our SDKs to accommodate this new format, so developers need to update their SDKs to take advantage of it. The shorter URLs not only simplify the sharing process but also enhance the overall user experience by making links easier to distribute and manage. 

For more information, see [Quickstart: Join your calling app to a Teams meeting](./quickstarts/voice-video-calling/get-started-teams-interop.md).

#### Join a Teams Meeting by ID – native 

Azure Communication Services now supports joining Microsoft Teams meetings using a meeting ID and passcode. This feature enables developers to build native applications for iOS, Android, and Windows that connect to Teams meetings with simple, manually entered credentials found in the event invite.

We enabled this straightforward method of joining meetings to makes it easier to stay connected and collaborate across various platforms. This update enhances security and convenience, ensuring seamless access to your Teams meetings. 

:::image type="content" source="media/whats-new-images/join-teams-meeting-native.png" alt-text="Screenshot of Microsoft Teams Join a Teams meeting sign on." lightbox="media/whats-new-images/join-teams-meeting-native.png":::

For more information, see [Manage calls for Teams users > Join a Teams meeting](./how-tos/cte-calling-sdk/manage-calls.md#join-a-teams-meeting).

### More features and enhancements

- Real-time transcription
- Real-time audio streaming
- Server programmability for Rooms
- Rich text support

#### Real-time transcription: Instant insights from your calls 

Azure Communication Services now offers real-time transcription in public preview, providing developers with immediate text output from call audio. This feature is incredibly useful for analyzing conversations and gaining insights that can inform business decisions or assist agents in real-time. 

With integration into Azure AI's Speech-to-Text service, real-time transcription supports over 140 languages, making it easy to incorporate speech recognition and transcription into your applications. This capability enables you to capture and transcribe audio seamlessly, providing a valuable resource for various use cases 

:::image type="content" source="media/whats-new-images/real-time-transcription.png" alt-text="Diagram showing how to provide real-time transcription in your app." lightbox="media/whats-new-images/real-time-transcription.png":::

By combining these transcriptions with large language models (LLMs), you can gain more insights such as suggested next steps, summaries, intent, and sentiment analysis.

For more information, see: 

- [Generate real-time transcripts](./concepts/call-automation/real-time-transcription.md)
- [Add real-time transcription into your applications](./how-tos/call-automation/real-time-transcription-tutorial.md)

#### Real-time audio streaming: Capture and analyze conversations  

Building on the power of real-time capabilities, developers now have access to real-time audio streams. Access to real-time audio streams enables developers to create server applications that capture and analyze audio for each participant on a call as it happens. 

:::image type="content" source="media/whats-new-images/real-time-audio-streaming.png" alt-text="Diagram showing how to integrate real-time audio streaming in your app." lightbox="media/whats-new-images/real-time-audio-streaming.png":::

By integrating audio streaming with call automation actions or custom AI models, you can unlock various use cases. These use cases include natural language processing (NLP) for conversation analysis, voice authentication using biometrics, and providing real-time insights and suggestions to agents during active interactions 

For more information, see: 

- [Audio streaming overview](./concepts/call-automation/audio-streaming-concept.md)
- [Audio streaming quickstart](./how-tos/call-automation/audio-streaming-quickstart.md)

#### Server programmability for Rooms: Enhance virtual appointments 

Real-time programming support for Rooms calls through Azure Communication Services is now in public preview, enabled through the Call Automation API. The first feature in preview enables PSTN dial out from Rooms. PSTN dial out enables independent software vendors (ISVs) to integrate multiple third-party professional services over PSTN into virtual appointments.

For example, interpreters, social services representatives, and other professionals can join telehealth appointments or virtual courtrooms over PSTN. With this new capability, developers can manage these scenarios efficiently, providing robust audio-conferencing features for virtual appointments. 

This is just the beginning. Over the coming year, we plan to enhance this integration further, adding AI features to support various virtual appointment scenarios, making the process even more streamlined and effective. 

For more information, see [Virtual Rooms overview > How to conduct calls in Virtual Rooms](./concepts/rooms/room-concept.md#how-to-conduct-calls-in-virtual-rooms).

#### Rich text support  

Azure Communication Services Chat now supports Rich Text Editor and inline image upload in both the Chat SDK and Web UI library. With this release, the chat experience is more dynamic and visually appealing. The following features are now available: 

- Different text styles, including bold, italic, and underline, to make messages stand out. 
- The ability to create bulleted and numbered lists for better organization. 
- Options to adjust text indent for improved readability. 
- The ability to add and update tables to better structure data.
 
The Web UI library also now supports the Rich Text Editor in both the ChatComposite and the CallWithChatComposite.

##### ChatComposite

:::image type="content" source="media/whats-new-images/rich-text-chat.png" alt-text="Screenshot of rich text with chat in ChatComposite." lightbox="media/whats-new-images/rich-text-chat.png":::

##### CallWithChatComposite

:::image type="content" source="media/whats-new-images/rich-text-call-with-chat.png" alt-text="Screenshot of rich text with chat in CallWithChatComposite." lightbox="media/whats-new-images/rich-text-call-with-chat.png":::

To get started: 

- [Rich Text Send Box](https://azure.github.io/communication-ui-library/?path=/story/components-sendbox-rich-text-send-box--rich-text-send-box).
- Rich Text Editor Support for [ChatComposite](https://azure.github.io/communication-ui-library/?path=/story/composites-chatcomposite-rich-text-editor-example--rich-text-editor-example).
- Or check our storybook on [aka.ms/acsstorybook](https://aka.ms/acsstorybook).

## July 2024

### Closed Captions - Native UI Library

Closed Captions are now generally available in the Native UI Library for Android and iOS. This feature applies to a range of scenarios in which closed captions are essential, enhancing the experience for users with hearing impairments and ensuring inclusivity.

:::image type="content" source="media/whats-new-images/closed-captions-native.png" alt-text="Screenshot of closed captions in the Native UI Library for Android and iOS." lightbox="media/whats-new-images/closed-captions-native.png":::

Closed Captions in the Native UI library streamline the integration between Azure Communication Services and Microsoft Teams, making it easier for users to connect and collaborate seamlessly. It simplifies the process and enhances the user experience.

For example, a multinational law firm with a diverse workforce can use closed captions during video conferences to ensure that all employees, regardless of language ability or hearing ability, can fully take part. For example, in meetings involving complex legal discussions, closed captions can help non-native speakers follow along more easily. Additionally, the firm can use this feature during interop scenarios with Microsoft Teams, ensuring seamless communication with clients and partners.

For more information, see:

- [Enable Closed captions using the UI Library](./how-tos/ui-library-sdk/closed-captions.md)
- [Azure Communication Services Closed Captions overview](./concepts/voice-video-calling/closed-captions.md)

### Rooms roles and capabilities - Native UI Library

The Native UI Library for Android and iOS now includes Rooms Integration in general availability, offering enhanced roles and capabilities for call participants. This integration offers customers greater flexibility and control over their calls, keeping the management on the customer side.

Consider a corporation hosting a virtual town hall meeting with employees worldwide. With Rooms Integration, the company can assign roles such as presenter, attendees and, consumer, ensuring a structured and organized meeting environment. This setup is crucial for keeping order in large meetings, allowing for efficient information dissemination and productive Q&A sessions, enhancing organizational communication and engagement.

To understand how to configure a standard Rooms architecture for validating role assignments and creation, see the following diagram.

:::image type="content" source="media/whats-new-images/rooms-roles.png" alt-text="Diagram showing how to configure a standard Rooms architecture for validating role assignments and creation." lightbox="media/whats-new-images/rooms-roles.png":::

The Rooms API enables developers to create rooms, manage users, and adjust the lifetime of rooms. The Rooms API is a back-end service separate from the UI Library.

For more information, see:

- [UI Library use cases > Rooms integration](./concepts/ui-library/ui-library-use-cases.md#rooms-integration)
- [Azure Communication Services Rooms overview](./concepts/rooms/room-concept.md)

### File sharing in Teams meetings

Now in general availability, share files during a Microsoft Teams meeting with Azure Communication Services Chat service. File sharing enables participants to share documents required for daily business needs such as product information, brochures, or follow-up care instructions.

:::image type="content" source="media/whats-new-images/file-sharing-teams.png" alt-text="Diagram of showing how to share files during a Microsoft Teams meeting with Azure Communication Services Chat service." lightbox="media/whats-new-images/file-sharing-teams.png":::

Use this function to enhance the experience in Teams meetings. File sharing makes it easier for users to collaborate over documents and ask clarifying questions as needed to finish business processes. Business processes can include opening an account, going over results, providing prescriptions or follow up care instructions, and many other scenarios.

For more information, see:

- [Enable file sharing during a Teams meeting](./tutorials/file-sharing-tutorial-interop-chat.md)
- [Call with Chat composite - UI library](https://azure.github.io/communication-ui-library/?path=/docs/composites-callwithchatcomposite--docs)

### Support for Teams Breakout rooms

The JavaScript Calling SDK now supports Microsoft Teams Breakout rooms in public preview. Azure Communication Services native participants and Microsoft 365 participants using the Calling SDK can participate in Teams meetings breakout rooms. Support for Teams Breakout rooms brings more flexibility and collaboration opportunities to your virtual meetings.

:::image type="content" source="media/whats-new-images/breakout-rooms.png" alt-text="Screenshot of Azure Communication Services native participants and Microsoft 365 participants using the Calling SDK to join Teams meetings breakout rooms." lightbox="media/whats-new-images/breakout-rooms.png":::

#### What are Breakout Rooms

Teams Breakout rooms enable meeting facilitators to create separate, smaller sessions within a larger Teams meeting. This feature is useful for various scenarios, such as:

- **Healthcare:** During a group virtual visit with healthcare providers, the meeting organizer can assign patients to breakout rooms to discuss specific areas before reconvening in the larger group session. Healthcare providers can visit each breakout room to check in with patients individually.

- **Legal:** In a virtual courtroom hearing, a defendant and their attorney can join a breakout room for a private side-bar conversation.

- **Conferences:** During a virtual industry conference, the meeting organizer can place attendees into separate discussion groups with focused subjects, before coming back to the larger meeting to share insights with the broader audience.

#### How does it work

Microsoft Teams users can create breakout rooms for scheduled meetings. Meeting organizers can assign Calling SDK participants to individual breakout rooms. Participants can seamlessly join and move between breakout rooms and the main meeting, just like any other Teams user.

#### Why is this important

The ability to include ACS users in Teams breakout rooms enhances the collaborative experience, making it more inclusive and versatile. Whether you're conducting a training session, hosting a workshop, or facilitating a brainstorming session, breakout rooms provide the structure needed to foster meaningful interactions and productive discussions.

#### Get started today
To start using this feature, ensure that you have the latest version of the Calling SDK. For more  information about implementing and using Teams Breakout rooms, see [Tutorial - Integrate Microsoft Teams breakout rooms](./how-tos/calling-sdk/breakoutrooms.md).

### End of call survey - native

The End of Call Survey enables developers to customize questions to collect feedback at the end of a call. This feature is in general availability. By gathering valuable insights directly from users, developers can make informed decisions to enhance their services effectively. This feature is now generally available for Android, iOS, and Windows platforms.

Imagine a healthcare provider using this feature to gather feedback after telemedicine consultations. By customizing questions to inquire about the clarity of communication, ease of access, and satisfaction with medical advice, the provider can quickly identify areas needing improvement. This immediate, specific feedback helps the provider enhance patient care quality, streamline operations, and increase patient satisfaction.

For more information, see:

[End of Call Survey](./concepts/voice-video-calling/end-of-call-survey-concept.md)
[Tutorial: End of Call Survey](./tutorials/end-of-call-survey-tutorial.md)

### Transfer to voicemail

Now in general availability, Microsoft Teams organizers can configure call participants to transferred directly into a Teams user’s voicemail, bypassing ringing the Teams user. This is useful when the transferor knows the transferee is unavailable to take the call.

For more information, see [Transfer calls](./how-tos/calling-sdk/transfer-calls.md#transfer-to-voicemail).

## May 2024

### Data retention with chat threads

Developers can now create chat threads with a retention policy of 30 to 90 days. This feature is in preview.

Setting a retention policy is optional. Developers can choose to create a chat thread with infinite retention (the default) or set a retention policy of 30 to 90 days. If you need to keep the thread for longer than 90 days, you can extend the time by using the Update Chat Thread Properties API. The policy is geared toward data management in organizations that need to move data into their archives for historical purposes or delete the data within a particular period.

The policy doesn't affect existing chat threads.

For more information, see:

- [Chat concepts](./concepts/chat/concepts.md#chat-data)
- [Create Chat Thread - REST API](/rest/api/communication/chat/chat/create-chat-thread#noneretentionpolicy)
- [Update Chat Thread Properties - REST API](/rest/api/communication/chat/chat-thread/update-chat-thread-properties#noneretentionpolicy)

### PowerPoint Live

Now in general availability, PowerPoint Live gives both the presenter and the audience an engaging experience. PowerPoint Live combines presenting in PowerPoint with the connection and collaboration of a Microsoft Teams meeting.

:::image type="content" source="media/whats-new-images/powerpoint-live.png" alt-text="Screenshot of PowerPoint Live presentation and collaboration in a Microsoft Teams meeting." lightbox="media/whats-new-images/powerpoint-live.png":::

Meeting participants can now view PowerPoint Live sessions initiated by a Teams client by using the Azure Communication Services Web UI Library. Participants can follow along with a presentation and view presenter annotations. Developers can use this function through composites such as `CallComposite` and `CallWithChatComposite`, and through components such as `VideoGallery`.

For more information, see [Introducing PowerPoint Live in Microsoft Teams (blog post)](https://techcommunity.microsoft.com/t5/microsoft-365-blog/introducing-powerpoint-live-in-microsoft-teams/ba-p/2140980) and [Present from PowerPoint Live in Microsoft Teams](https://support.microsoft.com/en-us/office/present-from-powerpoint-live-in-microsoft-teams-28b20e74-7165-499c-9bd4-0ad975d448ad).

### Live reactions

Now generally available, the updated UI library composites and components include reactions during live calls. The UI Library supports these reactions: &#128077; like, &#129505; love, &#128079; applause, &#128514; laugh, &#128558; surprise.

:::image type="content" source="media/whats-new-images/live-reactions.png" alt-text="Screenshot of live call reactions, including like, love, and applause." lightbox="media/whats-new-images/live-reactions.png":::

Call reactions are associated with the participant who sends it and are visible to all types of participants (in-tenant, guest, federated, anonymous). Call reactions are supported in all types of calls such as rooms, groups, and meetings (scheduled, private, channel) of all sizes (small, large, extra large).

Adding this feature encourages greater engagement within calls, because people can react in real time without needing to speak or interrupt. Developers can use this feature by adding:

- The ability to have live call reactions to `CallComposite` and `CallwithChatComposite` composites on the web.
- Call reactions at the component level.

For more information, see [Reactions](./how-tos/calling-sdk/reactions.md).

### Closed captions

Promote accessibility by displaying text of the audio in video calls. Already available for app-to-Teams calls, this general availability release adds support for closed captions in all app-to-app calls.

:::image type="content" source="media/whats-new-images/closed-caption-teams-interop.png" alt-text="Screenshot of closed captions for app-to-app calls and Teams interoperability." lightbox="media/whats-new-images/closed-caption-teams-interop.png":::

For more information, see [Closed captions overview](./concepts/voice-video-calling/closed-captions.md).

You can also learn more about [Azure Communication Services interoperability with Teams](./concepts/teams-interop.md).

### Copilot for Call Diagnostics
  
AI can help app developers across every step of the development lifecycle: designing, building, and operating. Developers can use [Microsoft Copilot in Azure (preview)](/azure/copilot/overview) within Call Diagnostics to understand and resolve many calling issues. For example, developers can ask Copilot these questions:

- How do I run network diagnostics in Azure Communication Services VoIP calls?
- How can I optimize my calls for poor network conditions?
- How do I fix common causes of poor media streams in Azure Communication Services calls?
- How can I fix the subcode 41048, which caused the video part of my call to fail?

:::image type="content" source="media/whats-new-images/copilot-call-diagnostics.png" alt-text="Screenshot of Call Diagnostics within Microsoft Copilot in Azure." lightbox="media/whats-new-images/copilot-call-diagnostics.png":::

Call Diagnostics can help developers understand call quality and reliability, so they can deliver a great calling experience to customers. Many issues can affect the quality of your calls, such as poor internet connectivity, software incompatibilities, and technical difficulties with devices.

Getting to the root cause of these issues can alleviate potentially frustrating situations for all call participants, whether they're patients checking in for a doctor's call or students taking a lesson with a teacher. Call Diagnostics enables developers to drill down into the data to identify root problems and find a solution. You can use the built-in visualizations in the Azure portal or connect underlying usage and quality data to your own systems.

For more information, see [Call Diagnostics](./concepts/voice-video-calling/call-diagnostics.md).

## April 2024

### Business-to-consumer extensibility with Microsoft Teams for calling

Developers can take advantage of calling interoperability for Microsoft Teams users in Azure Communication Services calling workflows. This feature is now in general availability.

Developers can use [Call Automation APIs](./concepts/call-automation/call-automation.md) to bring Teams users into business-to-consumer (B2C) calling workflows and interactions, which can help you deliver advanced customer service solutions. This interoperability is offered over VoIP to reduce telephony infrastructure overhead. Developers can add Teams users to Azure Communication Services calls by using the participants' Microsoft Entra object IDs (OIDs).

#### Use cases

- **Teams as an extension of an agent desktop**: Connect your contact center as a service (CCaaS) solution to Teams and enable your agents to handle customer calls on Teams. Having Teams as the single-pane-of-glass solution for both internal and B2C communication can increase agents' productivity and empower them to deliver first-class service to customers.

- **Expert consultation**: Businesses can use Teams to invite subject matter experts into their customer service workflows for expedient issue resolution and to improve the rate of first-call resolution.

:::image type="content" source="media/whats-new-images/b2c-extensibility.png" alt-text="Diagram that shows business-to-consumer extensibility with Microsoft Teams for calling." lightbox="media/whats-new-images/b2c-extensibility.png":::

Azure Communication Services B2C extensibility with Microsoft Teams helps customers reach sales and support teams and helps businesses deliver effective customer experiences.

For more information, see [Call Automation workflow interoperability with Microsoft Teams](./concepts/call-automation/call-automation-teams-interop.md).

### Image sharing in Microsoft Teams meetings

Microsoft Teams users can share images with Azure Communication Services users in the context of a Teams meeting. This feature is now generally available. Image sharing enhances collaboration in real time for meetings. Image overlay is also supported for users to look at it in detail.

Image sharing is helpful in many scenarios, such as a business that shares photos to showcase its work or doctors who share images with patients for aftercare instructions.

:::image type="content" source="media/whats-new-images/image-sharing-setup.png" alt-text="Screenshot that shows image-sharing setup and an example in a Microsoft Teams meeting." lightbox="media/whats-new-images/image-sharing-setup.png":::

Try out this feature by using either the UI Library or the Chat SDK. The SDK is available in C# (.NET), JavaScript, Python, and Java. For more information, see:

- [Enable an inline image by using the UI Library in Teams meetings](./tutorials/inline-image-tutorial-interop-chat.md)
- [GitHub sample: Adding image sharing](https://azure.github.io/communication-ui-library/iframe.html?viewMode=docs&id=composites-callwithchatcomposite--docs#inline-image-in-teams-interop-meeting-chat-thread)

### Deep noise suppression

Deep noise suppression is currently in preview. Noise suppression improves VoIP and video calls by eliminating background noise, so it's easier to talk and listen. For example, if you're taking an Azure Communication Services WebJS call in a coffee shop, turning on noise suppression can improve the calling experience by eliminating background sounds from the shop.

For more information, see [Add audio quality enhancements to your audio calling experience](./tutorials/audio-quality-enhancements/add-noise-supression.md).

### Calling SDKs for Android, iOS, and Windows

We updated the native Calling SDKs to improve the customer experience. This release includes:

- Custom background for video calls
- Proxy configuration
- Android TelecomManager integration
- Unidirectional communication in Data Channel
- Time-to-live lifespan for push notifications

#### Custom background for video calls

Custom background for video calls is generally available. This feature enables customers to remove distractions behind them. Customers can upload their own personalized images for use as a background.

:::image type="content" source="media/whats-new-images/custom-background-video-calls.jpeg" alt-text="Screenshot that shows custom background for video calls." lightbox="media/whats-new-images/custom-background-video-calls.jpeg":::

For example, business owners can use the Calling SDK to show custom backgrounds in place of the actual background. You can, for example, upload an image of a modern and spacious office and set it as the background for video calls. Anyone who joins the call sees the customized background, which looks realistic and natural. You can also use custom branding images as a background to show fresh images to your customers.

For more information, see [Quickstart: Add video effects to your video calls](./quickstarts/voice-video-calling/get-started-video-effects.md).

#### Proxy configuration

Proxy configuration is now generally available. Some environments, such as industries that are highly regulated or that deal with confidential information, require proxies to help secure and control network traffic. You can use the Calling SDK to configure the HTTP and media proxies for your Azure Communication Services calls. This way, you can ensure that your communications are compliant with network policies and regulations. You can use the native SDK methods to set the proxy configuration for your app.

For more information, see [Proxy your calling traffic](./tutorials/proxy-calling-support-tutorial.md?pivots=platform-android).

#### Android TelecomManager integration

Android TelecomManager manages audio and video calls on Android devices. Use Android TelecomManager to provide a consistent user experience across various Android apps and devices, such as showing incoming and outgoing calls in the system UI, routing audio to devices, and handling call interruptions.

Now you can integrate your app with Android TelecomManager to take advantage of its features for your custom calling scenarios. For more information, see [Integrate with TelecomManager](./how-tos/calling-sdk/telecommanager-integration.md).

#### Unidirectional communication in Data Channel

The Data Channel API is generally available. Data Channel includes unidirectional communication, which enables real-time messaging during audio and video calls. By using this API, you can integrate data exchange functions into the applications to help provide a seamless communication experience for users.

The Data Channel API enables users to instantly send and receive messages during an ongoing audio or video call, promoting smooth and efficient communication. In a group call, a participant can send messages to a single participant, a specific set of participants, or all participants within the call. This flexibility enhances communication and collaboration among users during group interactions.

For more information, see [Data Channel](./concepts/voice-video-calling/data-channel.md).

#### Time-to-live lifespan for push notifications

The time to live (TTL) for push notifications is now generally available. TTL is the duration for which a push notification token is valid. Using a longer-duration TTL can help your app reduce the number of new token requests from your users and improve the experience.

For example, suppose you created an app that enables patients to book virtual medical appointments. The app uses push notifications to display an incoming call UI when the app isn't in the foreground. Previously, the app had to request a new push notification token from the user every 24 hours, which could be annoying and disruptive. With the extended TTL feature, you can now configure the push notification token to last for up to six months, depending on your business needs. This way, the app can avoid frequent token requests and provide a smoother calling experience for your customers.

For more information, see [Enable push notifications for calls](./how-tos/calling-sdk/push-notifications.md#ttl-token).

### Calling SDK native UI Library updates

By using the Azure Communication Services Calling SDK native UI Library, you can now generate encrypted logs for troubleshooting and provide customers with an optional audio-only mode for joining calls.

#### Troubleshooting on the native UI Library for Android and iOS

Now in general availability, you can encrypt logs when troubleshooting on the Calling SDK native UI Library for Android and iOS. You can easily generate encrypted logs to share with Azure support. Ideally, calls just work, or developers self-remediate issues. But customers always have Azure support as a last line of defense. And we strive to make those engagements as easy and fast as possible.

For more information, see [Troubleshoot the UI Library](./how-tos/ui-library-sdk/troubleshooting.md).

#### Audio-only mode in the UI Library

The audio-only mode in the Calling SDK UI Library is now generally available. It enables participants to join calls by using only their audio, without sharing or receiving video. Participants can use this feature to conserve bandwidth and maximize privacy.

When audio-only mode is activated, it automatically disables the video function for both sending and receiving streams. It adjusts the UI to reflect this change by removing video-related controls.

For more information, see [Enable audio-only mode in the UI Library](./how-tos/ui-library-sdk/audio-only-mode.md).

## March 2024

### Calling to Microsoft Teams Call queues and Auto attendants

Calling to Teams Call queues and Auto attendants is now generally available in Azure Communication Services, along with click-to-call for Teams Phone. 

Organizations can enable customers to quickly reach their sales and support members on Microsoft Teams. When you add a [click-to-call widget](./tutorials/calling-widget/calling-widget-tutorial.md) onto a website, such as a **Sales** button that points to a sales department or a **Purchase** button that points to procurement, customers are just one click away from a direct connection to a Teams Call queue or Auto attendant.

Learn more about joining your calling app to a Teams [Call queue](./quickstarts/voice-video-calling/get-started-teams-call-queue.md) or [Auto attendant](./quickstarts/voice-video-calling/get-started-teams-auto-attendant.md), and about [building contact center applications](./tutorials/contact-center.md).

### Email updates

Updates to the Azure Communication Services email service include SMTP support, opt-out management, Azure PowerShell cmdlets, and Azure CLI extensions.

#### SMTP

SMTP support in Azure Communication Services email is now generally available. Developers can use it to easily send emails, improve security features, and have more control over outgoing communications.

The SMTP relay service acts as a link between email clients and mail servers to help deliver emails more effectively. It sets up a specialized relay infrastructure that not only handles higher throughput needs and successful email delivery, but also improves authentication to help protect communication. This service also offers businesses a centralized platform that lets them manage outgoing emails for all B2C communications and get insights into email traffic.

With this capability, customers can switch from on-premises SMTP solutions or link their line-of-business applications to a cloud-based solution platform with Azure Communication Services email. SMTP support enables:

- A reliable SMTP endpoint with TLS 1.2 encryption.
- Authentication with a Microsoft Entra application ID for sending emails via SMTP.
- High-volume sending support for B2C communications via SMTP and REST APIs.
- Compliance with data-handling and privacy requirements for customers.

:::image type="content" source="media/whats-new-images/email-smtp-flow.png" alt-text="Diagram that shows an email SMTP command flowchart." lightbox="media/whats-new-images/email-smtp-flow.png":::

For more information, see [Email SMTP support](./concepts/email/email-smtp-overview.md).

#### Opt-out management

Email opt-out management, now in preview, offers a centralized unsubscribe list and opt-out preferences saved to a data store. This feature helps developers meet guidelines of email providers who require one-click list-unsubscribe implementation in the emails sent from their platforms.

Opt-out management helps you identify and avoid delivery problems. You can maintain compliance by adding suppression list features to help improve reputation and enable customers to easily manage opt-outs.

:::image type="content" source="media/whats-new-images/email-suppression-list-flow.png" alt-text="Diagram that shows an email suppression list flowchart." lightbox="media/whats-new-images/email-suppression-list-flow.png":::

Get started with [Manage email opt-out capabilities](./concepts/email/email-optout-management.md).

#### Azure PowerShell cmdlets and Azure CLI extensions

To enhance the developer experience, Azure Communication Services is introducing more Azure PowerShell cmdlets and Azure CLI extensions for working with email.

##### Azure PowerShell cmdlets

With the addition of the new cmdlets, developers can use Azure PowerShell cmdlets for all CRUD (create, read, update, delete) operations for the email service, including:

- Create a communication service resource (existing)
- Create an email service resource (new)
- Create a resource for an Azure-managed or custom domain (new)
- Initiate or cancel custom domain verification (new)
- Add a sender username to a domain (new)
- Link a domain resource to a communication service resource (existing)

Learn more in the [Azure PowerShell reference](/powershell/module/az.communication/).

##### Azure CLI extensions

Developers can use Azure CLI extensions for their end-to-end flow for sending email, including:

- Create a communication service resource (existing)
- Create an email service resource (new)
- Create a resource for an Azure-managed or custom domain (new)
- Add a sender username to a domain (new)
- Link a domain resource to a communication service resource (existing)
- Send an email (existing)

Learn more in the [Azure CLI reference](/cli/azure/communication/email).

## February 2024

### Limited-access user tokens

Limited-access user tokens are now in general availability. Limited-access user tokens enable customers to exercise finer control over user capabilities such as starting a new call/chat or participating in an ongoing call/chat.

When a customer creates an Azure Communication Services user identity, the user is granted the capability to participate in chats or calls through access tokens. For example, a user must have a chat token to participate in chat threads or a VoIP token to participate in VoIP calls. A user can have multiple tokens simultaneously.

With the limited-access tokens, Azure Communication Services supports controlling full access versus limited access within chats and calls. Customers can control users' ability to initiate a new call or chat, as opposed to participating in existing calls or chats.

These tokens solve the cold-call or cold-chat issue. For example, without limited-access tokens, a user who has a VoIP token can initiate calls and participate in calls. So theoretically, a defendant could call a judge directly or a patient could call a doctor directly. This situation is undesirable for most businesses. Developers can now give a limited-access token to a patient who then can join a call but can't initiate a direct call to anyone.

For more information, see [Identity model](./concepts/identity-model.md).

### Try Phone Calling

Try Phone Calling, now in preview, is a tool in the Azure portal that helps customers confirm the setup of a telephony connection by making a phone call. It applies to both voice calling (PSTN) and direct routing. Try Phone Calling enables developers to quickly test Azure Communication Services calling capabilities, without an existing app or code on their end.

:::image type="content" source="concepts/media/try-phone-calling.png" alt-text="Screenshot of the Try Phone Calling tool in the Azure portal." lightbox="concepts/media/try-phone-calling.png":::

For more information, see [Try Phone Calling](./concepts/telephony/try-phone-calling.md).

### Native UI Library updates

Updates to the native UI Library including moving User Facing Diagnostics to general availability and releasing one-to-one calling and iOS CallKit integration.

#### User Facing Diagnostics

User Facing Diagnostics is now in general availability. This feature enhances the user experience by providing a set of events that can be triggered when some signal of the call is triggered. For example, an event can be triggered when a participant is talking but the microphone is muted, or if the device isn't connected to a network. You can subscribe to triggers such as weak network signals or muted microphones, so you're always aware of any factors that affect calls.

Bringing User Facing Diagnostics into the UI Library helps customers implement events for a more fluid experience. Customers can use User Facing Diagnostics to notify users in real time if they face connectivity and quality problems during the call, such as network problems. Users receive a pop-up notification about these problems during the call. This feature also sends telemetry to help you track any event and review the call status.

For more information, see [User Facing Diagnostics](./concepts/voice-video-calling/user-facing-diagnostics.md).

#### One-to-one calling

One-to-one calling for Android and iOS is now available in preview version 1.6.0. With this latest preview release, starting a call is as simple as a tap. Recipients are promptly alerted with a push notification to answer or decline the call.

If the iOS-native application requires direct calling between two entities, developers can use the one-to-one calling function to make it happen. An example scenario is a client who needs to call a financial advisor to make account changes.

For more information, see [Set up one-to-one calling and push notifications in the UI Library](./how-tos/ui-library-sdk/one-to-one-calling.md).

#### iOS CallKit integration

Azure Communication Services integrates CallKit, in preview, for a native iOS call experience. Now, calls made through the Native UI SDK have the same iOS calling features, such as notification, call history, and call on hold. These iOS features blend seamlessly with the existing native experience.

This update enables UI Library developers to avoid spending time on integration. CallKit provides an out-of-the-box experience, meaning that integrated apps use the same interfaces as regular cellular calls. For users, incoming VoIP calls display the familiar iOS call screen for a consistent and intuitive experience.

For more information, see [Integrate CallKit into the UI Library](./how-tos/ui-library-sdk/callkit.md).

### PSTN Direct Offers

Azure Communication Services continues to expand Direct Offers to new geographies. PSTN Direct Offers is in general availability for 42 countries and regions:

> Argentina, Australia, Austria, Belgium, Brazil, Canada, Chile, China, Colombia, Denmark, Finland, France, Germany, Hong Kong SAR, Indonesia, Ireland, Israel, Italy, Japan, Luxembourg, Malaysia, Mexico, Netherlands, New Zealand, Norway, Philippines, Poland, Portugal, Puerto Rico, Saudi Arabia, Singapore, Slovakia, South Africa, South Korea, Spain, Sweden, Switzerland, Taiwan, Thailand, UAE (United Arab Emirates), United Kingdom, United States

In addition to getting all current offers into general availability, we've introduced more than 400 new cross-country/region offers.

Check all the new countries/regions, phone number types, and capabilities at [Country/regional availability of telephone numbers and subscription eligibility](./concepts/numbers/sub-eligibility-number-capability.md).

## Related content

- For a complete list of new features and bug fixes, see the [releases page](https://github.com/Azure/Communication/releases) on GitHub.
- For more blog posts, see the [Azure Communication Services blog](https://techcommunity.microsoft.com/t5/azure-communication-services/bg-p/AzureCommunicationServicesBlog).
