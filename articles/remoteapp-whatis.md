<properties title="What is RemoteApp?" pageTitle="What is RemoteApp?" description="Learn about RemoteApp." metaKeywords="" services="" solutions="" documentationCenter="" authors="elizapo"  />

#What is Azure RemoteApp?

RemoteApp enables you to make programs that are accessed remotely through Azure appear as if they are running on the end user's local computer. These programs are referred to as RemoteApp programs. Instead of being presented to the user in the desktop of the Remote Desktop Session Host (RD Session Host) server, the RemoteApp program is integrated with the client's desktop. The RemoteApp program runs in its own resizable window, can be dragged between multiple monitors, and has its own entry in the taskbar. If a user is running more than one RemoteApp program on the same RD Session Host server, the RemoteApp program will share the same Remote Desktop Services session.

RemoteApp can reduce complexity and reduce administrative overhead in many situations, including the following:


- Branch offices, where there may be limited local IT support and limited network bandwidth.
- Situations where users need to access programs remotely.
- Deployment of line-of-business (LOB) programs, especially custom LOB programs.
- Environments, such as "hot desk" or "hoteling" workspaces, where users do not have assigned computers.
- Deployment of multiple versions of a program, particularly if installing multiple versions locally would cause conflicts.

Unlike traditional Remote Desktop Services, Azure RemoteApp runs in the Azure management portal. Your users access the programs through the portal, while you do all management of the programs and users through the Admin portal.

There are two kinds of RemoteApp deployment:


- A cloud deployment is hosted in and stores all data for programs in the Azure cloud.
- A hybrid deployment is hosted in the Azure cloud but lets users access data stored on your local network.

Regardless of the type of deployment you choose, after you create the service, you publish the programs that you want to share with your users to the end-user feed. This is the list of available programs that your users access through the Azure portal. Be aware that the feed shows all programs from all services associated with your subscription.
