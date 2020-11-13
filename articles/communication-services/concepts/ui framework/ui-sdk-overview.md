# Azure Communication Services UI Framework

Azure Communication Services UI Framework looks to simplify the integration of
modern communication experiences for developers. Developers can choose from
different production-ready UI Framework options depending on the customization
and bundle size requirements; leverage a turn-key **Composite** quickly or use
specific UI **Components** to build a custom communications experience. UI
Framework support scenarios across calling and chat on Web, Android and iOS. UI
Framework does not have any additional cost to developers, you only pay for the
usage of the underlying SDKs. The Framework is built using Fluent UI assets, the
same design assets used for Teams experiences.

## **What are Components and Composites?**

**ACS UI Framework** componentizes the communication experience powered by Azure
Communication Services into discrete building blocks. At the most basic level,
**Components** wrap around existing Azure Communication SDKs and extend core SDK
functionality to perform basic actions from initializing our client SDKs to
rendering video or enabling user controls for muting, video on/off, etc.
**Components** are available across chat, calling and SMS clients.
**Components** are built with Fluent UI assets built by Microsoft that offer a
uniform and easy to use UI.

:::image type="content" source="../media/ui framework/preandcustomcomposite.png" alt-text="Comparison between pre-built and custom composites":::

One layer above, **Composites** combine **Components** to create communication
experiences. These higher-level components abstract the process of putting
**Components** together from developers so they can concentrate on their own
business logic and flow. For example, if I want to bring a chat experience into
my app, I can import the chat composite into my app and build the logic of when
it will show up. I don’t need to think about how the chat client works or get
puts together, just where in my applications flow, I want the chat client to
show up.

:::image type="content" source="../media/ui framework/componentoverview.png" alt-text="Overview of component for UI Framework":::

For custom experience, developers can create custom **Composite** Components
using their desired **Components.** This allows developers to only take the
pieces of the experience that they need and leave behind what they don’t, thus
optimizing their application size.

:::image type="content" source="../media/ui framework/compositeoverview.png" alt-text="Overview of composite for UI Framework":::

## Supported use cases

UI Framework looks to deliver solutions that can help developers build
experiences to fulfill the following scenarios:

Calling:

1.  Join Teams Meeting Call

2.  Join Teams Live Event

3.  Join Azure Communication Services call with Group Id

4.  Start a VoIP call to a Teams user

5.  Start a VoIP call to another Azure Communication Services user

6.  Start a PSTN call to a phone number using Azure Communication Services
    procured phone number

Chat:

1.  Join a Teams Meeting Chat

2.  Join Azure Communication Services chat with Thread Id

## Supported identities:

UI Framework supports both ACS identity and M365/Teams identity. An ACS identity
is always required to initialize the UI Framework for billing purposes.
M365/Teams identity is optional use the Teams identity information during the
communication experience.

## Customizability

UI Framework is built with customization in mind in terms of themes, sizing,
layouts and data models:

-   Themes: Change color schemes on Components and Composites to match your
    branding style.

-   Sizing: Resize Components and Composites to match your desired
    specification.

-   Layouts: Use Components to create custom layouts that match your specific
    experience.

-   Data Models: Provide your own application specific data models that match
    your identities to Azure Communication Services identities to customize
    display names and avatar images for communication experiences.

## Recommended Architecture

:::image type="content" source="../media/ui framework/frameworkarchitecture.png" alt-text="UI Framework recommended architecture with client server architecture ":::

The UI Framework Composites and Components need to be initialized using an Azure
Communication Services access token and context for the call or chat it will
join. Access tokens should be procured from Azure Communication Services using a
Contoso service with a connections string. We don't recommend to procure the
access token using a client side application. Similarly, call/chat context for
what group call or thread the UI Framework Composite should join should be
procured by Contoso through a service. Below is a complete breakdown in terms of
actions performed by Contoso and actions performed by the UI Framework composite
in terms of setup and call/chat lifecycle.

| Contoso Responsibilities                                 | UI Framework Composite Responsibilities                         |
|----------------------------------------------------------|-----------------------------------------------------------------|
| Retrieve/Pass access token from Azure                    | Pass through given access token to initialize components        |
| Provide refresh function                                 | Refresh access token using developer provided function          |
| Retrieve/Pass join information for call or chat          | Pass through call and chat information to initialize components |
| Retrieve/Pass user information for any custom data model | Pass through custom data model to components to render          |
