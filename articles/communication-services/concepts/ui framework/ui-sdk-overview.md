# Azure Communication Services UI Framework

Azure Communication Services UI Framework simplifies building modern user experiences. You can choose from
different production-ready UI Framework options depending on your customization, performance, and feature needs:

- **Open-Source Composites** - These are open-source UI components built on the core Azure Communication SDKs. These turn-key solutions are ideal for very quickly adding video calling or chat to an application. 
- **Closed-Source Meeting Composites** - These are closed-source components focused on meeting concepts. There are similarly turn-key and ideal for quickly adding experiences to your app. They include certain features unique to the meeting system, but are not as customizable.
- **Base Components** - These are open-source building blocks  build a custom communications experience. 

These UI SDKs all use Microsoft's Fluent design language and assets. The Meeting system is intentionally designed to match Microsoft Team's default meeting experience. 



## **Differentiating Components and Composites**

**Base Components** wrap the core Azure Communication SDKs and solve for basic actions such as initializing the core SDKs, rendering video and providing  user controls for muting, video on/off, etc. **Base Components** are built with Fluent UI assets built by Microsoft that offer a
uniform and easy to use UI.

:::image type="content" source="../media/ui framework/preandcustomcomposite.png" alt-text="Comparison between pre-built and custom composites":::

One layer above, **Composite Components** combine **Component Components** to create communication
experiences. These higher-level components abstract the process of putting
**Base Components** together from developers so they can concentrate on their own
business logic and flow. For example, if I want to bring a chat experience into
my app, I can import the chat composite component into my app and build the logic of when
it will show up. I don’t need to think about how the chat client works or get
puts together, just where in my applications flow, I want the chat client to
show up.

:::image type="content" source="../media/ui framework/componentoverview.png" alt-text="Overview of component for UI Framework":::

For custom experience, developers can create custom **Composite Components** Components
using their desired **Base Components.** This allows developers to only take the
pieces of the experience that they need and leave behind what they don’t, thus
optimizing their application size.

:::image type="content" source="../media/ui framework/compositeoverview.png" alt-text="Overview of composite for UI Framework":::

## What UI Framework is best for my project?
Understanding these requirements will help you pick the right SDK:

1. **How much customization do you require?** Azure Communication core SDKs do not have a UX and are designed so you can build whatever UX you want. Base components, and composites provide UI assets at the the cost of reduced customization.
1. **Do you require Meeting features?** The Meeting system has several unique capabilities not currently available in the core Azure SDKs, such as blurred backgrounds. 
3. **What platforms are you targeting?** Differant platforms have differant capabilities.

Details about feature availability in the varied [UI SDKs is available here](ui-sdk-features.md), but key trade-offs are summarized below.

|SDK|Implementation Complexity|	Customization Ability|	Calling|	Chat|	SMS|	Meetings
|--|--|-|-|-|-|-|
|Open-Source Composites	|Medium|	High|	✔	|✔|	✔|❌	
|Closed Source Meeting SDK|	Low	|Low|❌|❌|❌|✔
|Base Components|	High|	High|	✔	|✔	|✔|❌	
|Core SDKs|	High|	High|	✔|	✔	|✔|❌	

## Cost
Usage of Azure UI Frameworks does not have any additional Azure cost or metering, you only pay for the
usage of the underlying SDKs. 

## Supported use cases

UI Framework looks to deliver solutions that can help developers build
experiences to fulfill the following scenarios:

Calling:

1.  Join Teams Meeting Call
2.  Join Azure Communication Services call with Group Id
3.  Start a VoIP call to a Teams user
4.  Start a VoIP call to another Azure Communication Services user
5.  Start a PSTN call to a phone number using Azure Communication Services
    procured phone number

Chat:

1.  Join a Teams Meeting Chat
2.  Join Azure Communication Services chat with Thread Id

## Supported identities:
An ACS identity is required to initialize the UI Framework and authenticate to the service. 

## Customizability

UI Framework is built with customization in mind in terms of themes, sizing,
layouts and data models:

-   Themes: Change color schemes on Base and Composite Components to match your
    branding style.

-   Sizing: Resize Base and Composite Components to match your desired
    specification.

-   Layouts: Use Base Components to create custom layouts that match your specific
    experience.

-   Data Models: Provide your own application specific data models that match
    your identities to Azure Communication Services identities to customize
    display names and avatar images for communication experiences.

## Recommended Architecture 

:::image type="content" source="../media/ui framework/frameworkarchitecture.png" alt-text="UI Framework recommended architecture with client server architecture ":::

The UI Framework Composite and Base Components need to be initialized using an Azure
Communication Services access token and context for the call or chat it will
join. Access tokens should be procured from Azure Communication Services using a
Contoso service with a connections string. We don't recommend to procure the
access token using a client side application. Similarly, call/chat context for
what group call or thread the UI Framework Composite component should join should be
procured by Contoso through a service. Below is a complete breakdown in terms of
actions performed by Contoso and actions performed by the UI Framework Composite component
in terms of setup and call/chat lifecycle.

| Contoso Responsibilities                                 | UI Framework Composite Responsibilities                         |
|----------------------------------------------------------|-----------------------------------------------------------------|
| Provide access token from Azure                    | Pass through given access token to initialize components        |
| Provide refresh function                                 | Refresh access token using developer provided function          |
| Retrieve/Pass join information for call or chat          | Pass through call and chat information to initialize components |
| Retrieve/Pass user information for any custom data model | Pass through custom data model to components to render          |
