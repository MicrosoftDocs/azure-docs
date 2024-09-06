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

Use this article to stay updated on new features and other useful information related to Azure Communication Services.

[!INCLUDE [Survey Request](./includes/survey-request.md)]

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

Developers can use [Call Automation APIs](./concepts/call-automation/call-automation.md) to bring Teams users into business-to-consumer (B2C) calling workflows and interactions, which helps you deliver advanced customer service solutions. This interoperability is offered over VoIP to reduce telephony infrastructure overhead. Developers can add Teams users to Azure Communication Services calls by using the participants' Microsoft Entra object IDs (OIDs).

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
- [GitHub sample: Adding image sharing](https://azure.github.io/communication-ui-library/?path=/docs/composites-call-with-chat-jointeamsmeeting--join-teams-meeting#adding-image-sharing)

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

### Calling to Microsoft Teams call queues and auto attendants

Calling to Teams call queues and auto attendants is now generally available in Azure Communication Services, along with click-to-call for Teams Phone. 

Organizations can enable customers to quickly reach their sales and support members on Microsoft Teams. When you add a [click-to-call widget](./tutorials/calling-widget/calling-widget-tutorial.md) onto a website, such as a **Sales** button that points to a sales department or a **Purchase** button that points to procurement, customers are just one click away from a direct connection to a Teams call queue or auto attendant.

Learn more about joining your calling app to a Teams [call queue](./quickstarts/voice-video-calling/get-started-teams-call-queue.md) or [auto attendant](./quickstarts/voice-video-calling/get-started-teams-auto-attendant.md), and about [building contact center applications](./tutorials/contact-center.md).

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

Azure Communication Services continues to expand Direct Offers to new geographies. PSTN Direct Offers is in general availability for 42 countries:

> Argentina, Australia, Austria, Belgium, Brazil, Canada, Chile, China, Colombia, Denmark, Finland, France, Germany, Hong Kong, Indonesia, Ireland, Israel, Italy, Japan, Luxembourg, Malaysia, Mexico, Netherlands, New Zealand, Norway, Philippines, Poland, Portugal, Puerto Rico, Saudi Arabia, Singapore, Slovakia, South Africa, South Korea, Spain, Sweden, Switzerland, Taiwan, Thailand, UAE (United Arab Emirates), United Kingdom, United States

In addition to getting all current offers into general availability, we've introduced more than 400 new cross-country offers.

Check all the new countries, phone number types, and capabilities at [Country/regional availability of telephone numbers and subscription eligibility](./concepts/numbers/sub-eligibility-number-capability.md).

## January 2024

### Dial-out to a PSTN number

Virtual Rooms support VoIP audio and video calling. Now you can also dial out PSTN numbers and include the PSTN participants in an ongoing call.

Virtual Rooms empower developers to exercise control over PSTN dial-out capability in two ways. Developers can not only enable/disable PSTN dial-out capability for specific Virtual Rooms but also control which users in Virtual Rooms can initiate PSTN dial-out. Only users who have the Presenter role can initiate a PSTN dial-out, to help ensure secure and structured communication.

For more information, see [Quickstart: Create and manage a room resource](./quickstarts/rooms/get-started-rooms.md).

### Remote mute of call participants

Participants can now mute other participants in Virtual Rooms calls. Previously, participants in Virtual Rooms calls could only mute/unmute themselves. There are times when participants want to mute other people due to background noise or if someone's microphone is left unmuted.

Participants in the Presenter role can mute a participant, multiple participants, or all other participants. Users retain the ability to unmute themselves as needed. For privacy reasons, no one can unmute other participants.

For more information, see [Mute other participants](./how-tos/calling-sdk/manage-calls.md#mute-other-participants).

### Call recording in Virtual Rooms

Developers can now start, pause, and stop call recording in calls conducted in Virtual Rooms. Call recording is a service-side capability. Developers start, pause, and stop recording by using server-side API calls. This feature enables invited participants who might not make the original session to view the recording and stay up to date asynchronously.

For more information, see [Manage call recording on the client](./how-tos/calling-sdk/record-calls.md).

### Closed captions in Virtual Rooms

Closed captioning is the conversion of an audio track for a voice or video call into written words that appear in real time. Closed captions are a useful tool for participants who prefer to read the audio text in order to engage more actively in conversations and meetings. Closed captions also help in scenarios where participants might be in noisy environments or have audio equipment problems.

Closed captions are never saved and are visible only to the user who enabled them.

:::image type="content" source="media/whats-new-images/closed-captions-virtual-rooms.png" alt-text="Screenshot of closed captions used in a Virtual Rooms example." lightbox="media/whats-new-images/closed-captions-virtual-rooms.png":::

For more information, see [Closed captions overview](./concepts/voice-video-calling/closed-captions.md).

## December 2023

### Call Diagnostics

Azure Communication Services Call Diagnostics is available in preview. Call Diagnostics helps developers troubleshoot and improve their applications for voice and video calling.

:::image type="content" source="./media/whats-new-images/11-23/call-diagnostics.png" alt-text="Graphic that shows icons that represent the ways that Call Diagnostics helps developers.":::

Call Diagnostics is an Azure Monitor experience that offers specialized telemetry and diagnostic pages in the Azure portal. With Call Diagnostics, you can access and analyze data, visualizations, and insights for each call. Then you can identify and resolve issues that affect the user experience.

Call Diagnostics works with other Azure Communication Services features, such as noise suppression and pre-call troubleshooting, to deliver reliable video-calling experiences that are easy to develop and operate.

For more information, see [Call Diagnostics](./concepts/voice-video-calling/call-diagnostics.md).

### WebJS Calling updates

The following APIs for WebJS Calling features moved to general availability: Media Quality Statistics, Video Constraints, and Data Channel.

#### Media Quality Statistics

Developers can use the Media Quality Statistics API to better understand their video-calling quality and reliability experience in real time from within the Calling SDK. When developers understand from the client side what their customers are experiencing, they can delve deeper into understanding and mitigating any problems that arise for users.

For more information, see [Media quality statistics](./concepts/voice-video-calling/media-quality-sdk.md).

#### Video Constraints

Developers can use the Video Constraints API to better manage the overall quality of calls. For example, if a developer knows that a participant has a poor internet connection, the developer can limit video resolution size on the sender side to use less bandwidth. The result is an improved calling experience for the participant.

For more information about improving the calling experience by using the Video Constraints API, see [Quickstart: Set video constraints in your calling app](./quickstarts/voice-video-calling/get-started-video-constraints.md).

#### Data Channel

The Data Channel API enables real-time messaging during audio and video calls. This function enables developers to manage their own data pipeline and send their own unique messages to remote participants on a call. A data channel enhances communication capabilities by enabling local participants to connect directly to remote participants when the scenario requires it.

Get started with [Quickstart: Add Data Channel messaging to your calling app](./quickstarts/voice-video-calling/get-started-data-channel.md).

## Related content

- For a complete list of new features and bug fixes, see the [releases page](https://github.com/Azure/Communication/releases) on GitHub.
- For more blog posts, see the [Azure Communication Services blog](https://techcommunity.microsoft.com/t5/azure-communication-services/bg-p/AzureCommunicationServicesBlog).
