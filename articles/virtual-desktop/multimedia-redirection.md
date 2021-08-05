---
title: Multimedia redirection on Azure Virtual Desktop - Azure
description: How to manage Azure Virtual Desktop app groups with the Azure portal.
author: Heidilohr
ms.topic: how-to
ms.date: 08/10/2021
ms.author: helohr
manager: femila
---
# Multimedia Redirection (MMR) on Azure Virtual Desktop (preview)

>[!IMPORTANT]
>Azure Virtual Desktop doesn't currently support multimedia redirection on Azure Virtual Desktop for Microsoft 365 Government (GCC), GCC-High environments, and Microsoft 365 DoD.
>
>Multimedia redirection on Azure Virtual Desktop is only available for the Windows Desktop client on Windows 10 machines. Multimedia redirection requires the Windows Desktop client, version 1.2.2222 or later.

Multimedia redirection (MMR) gives you smooth video playback while watching videos in your Azure Virtual Desktop browser. MMR remotes the media element from the browser to the local machine for faster processing and rendering. Both Microsoft Edge and Google Chrome support the MMR feature. However, the public preview version of MMR for Azure Virtual Desktop has restricted playback on YouTube, so you'll need to [enable an extension]() to test YouTube within your deployment.

## Requirements

Before you can use Multimedia Redirection on Azure Virtual Desktop, you'll need
to do these things:

1. [Install the Windows Desktop client](./user-documentation/connect-windows-7-10.md#install-the-windows-desktop-client) () on a Windows 10 or Windows 10 IoT Enterprise device that meets the [hardware requirements for Teams on a Windows PC](/microsoftteams/hardware-requirements-for-the-teams-app#hardware-requirements-for-teams-on-a-windows-pc/). Installing version 1.2.2222 or later of the client will also install the MMR plugin (MsMmrDVCPlugin.dll) on the client device. To learn more about updates and new versions, see [What's new in the Windows Desktop client](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-whatsnew).

2. [Configure the client machine for the insider group](create-host-pools-azure-marketplace).

3. Install [the Multimedia Redirector service]() and any required browser extensions on the virtual machine (VM).

4. Configure the client machine to let your users access the Insiders program. To configure the client for the Insider group, set the following registry information:

   - **Key**: HKLM\\Software\\Microsoft\\MSRDC\\Policies
   - **Type**: REG_SZ
   - **Name**: ReleaseRing
   - **Data**: insider

   To learn more about the Insiders program, see [Windows Desktop client for admins](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-admin#configure-user-groups).

5. Use [the MSI installer (MsMmrHostMri)]() to install the MMR extensions on your Azure VM for your internet browser. MMR for Azure Virtual Desktop currently only supports Microsoft Edge and Google Chrome.

## Managing group policies for the MMR browser extension

Using the MMR MSI will install the browser extensions. However, as this service is still in public preview, user experience may vary. For more information about known issues, see [Known issues](#known-issues-and-limitations).

In some cases, you can change the group policy to manage the browser extensions and improve user experience. For example:

- You can install the extension without user interaction.
- You can restrict which websites use MMR.
- You can pin the MMR extension icon in Google Chrome by default (the extension is already pinned by default in Microsoft Edge).

### Configure Microsoft Edge group policies for MMR

To configure the group policies, you'll need to edit the Microsoft Ege Administrative Template. You should see the extension configuration options under **Administrative Templates Microsoft Edge Extensions** > **Configure extension management settings**.

The following code is an example of a Microsoft Edge group policythat fores installation of the MMR extension and only lets MMR load on YouTube:

```cmd
{ "joeclbldhdmoijbaagobkhlpfjglcihd": { "installation_mode": "force_installed", "runtime_allowed_hosts": [ "*://*.youtube.com" ], "runtime_blocked_hosts": [ "*://*" ], "update_url": "https://edge.microsoft.com/extensionwebstorebase/v1/crx" } }
```

To learn more about group policy configuration, see [Microsoft Edge group policy](/DeployEdge/configure-microsoft-edge).

### Configure Google Chrome group policies for MMR

To configure the Google Chrome group policies, you'll need to edit the Google Chrome Administrative Template. You should see the extension configuration options under **Administrative Templates** > **Google** > **Google Chrome Extensions** > **Extension management settings**.

The following example is much like the code example in [Configure Microsoft Edge group policies for MMR](#configure-microsoft-edge-group-policies-for-mmr). This policy will force the MMR extension to install with the icon pinned in the top-right menu, and will only allow MMR to load on YouTube.

```cmd
{ "lfmemoeeciijgkjkgbgikoonlkabmlno": { "installation_mode": "force_installed", "runtime_allowed_hosts": [ "*://*.youtube.com" ], "runtime_blocked_hosts": [ "*://*" ], "toolbar_pin": "force_pinned", "update_url": "https://clients2.google.com/service/update2/crx" } }
```

Additional information on configuring [Google Chrome group policy](https://support.google.com/chrome/a/answer/187202#zippy=%2Cwindows).

## Run the MMR extension manually on a browser

MMR uses remote apps and the session desktop for Microsoft Edge and Google Chrome browsers. Once you've fulfilled [the requirements](#requirements), open your supported browser. If you didn't install the browsers or MMR extension with a group policy, users will need to manually run the extension. This section will tell you how to manually run the extension in one of the currently supported browsers.

### Microsoft Edge

To run the extension on Microsoft Edge manually, look for the yellow exclamation mark on the overflow menu. You should see a prompt to enable the Azure Virtual Desktop Multimedia Redirection extension. Select **Enable extension**.

![](media/4216b8bafb4cfea75905368809f8a566.png)

### Google Chrome

To run the extension on Google Chrome manually, look for the notification message that says the new extension was installed. Select the notification to allow your users to enable the extension. Users should also pin the extension so that they can see from the icon if MMR is connected.

![](media/e85a8361045bcad90f0898294b556748.png)

Once the extensions have been enabled head over to YouTube and enjoy some smooth video playback.

## Multimedia Redirection extension icon

To quickly tell if MMR is being used we’ve added states to the MMR icon. The MMR states are shown below:

| Icon State  | Definition  |
|-----------------|-----------------|
| [./media/image3.png](./media/image3.png) | By default, this is the icon appearance when first loaded. |
| [./media/image4.png](./media/image4.png) | If the Host VM fails to connect the client device there is an issue with the setup. We denote this state with a red X over the icon. |
| [./media/image5.png](./media/image5.png) | If the host VM successfully connects to the client device MMR playback is enabled.    |

![](media/76b945f80c70a70b5bd3eb6f141d8871.png)

Clicking on the MMR icon will reveal a popout with versioning information for
the 3 components and a checkbox to enable MMR on all site.

## Send feedback during public preview

If by chance you run into an issue we’d love to hear from you. Please file a feedback hub bug on **both the client and VM host**.

1. Open up the Feedback hub on both the client and server.

2. Select **Report a problem**.

3. Use the same title on each bug report. The only difference in title should be [Client] or [Host] at the start of Title depending on which feedback hub you are filing the issue from.

    ![Graphical user interface, text, application, email Description automatically generated](media/0027d0bd2f478fdfbeb5274b6921f9a5.png)

    ![Graphical user interface, text, application, email Description automatically generated](media/1611e80268d9502ced92104641346b47.png)

4. Describe the issue you are experiencing in the Explain in more detail section. In addition, please provide the URL of the video that is not working as well.

5. Select **Next**.

6. Select **Problem**, then **Remote Desktop apps**.

    ![Graphical user interface, text, application, email Description automatically generated](media/a40cee2235418bbf205bf45465115031.png)

7. Select **Next**

8. Check to see if there's a similar issue in the list to the one you plan to submit.
   

   - If you see a similar issue below that looks like yours, select the item, then select **Link to bug**.

    ![Graphical user interface, text, application, email Description automatically generated](media/894218127002fa7c4862a0241a9cd0c3.png)

    - If you don't see a similar issue, select **New feedback** > **Make new bug**.

    ![Graphical user interface, table Description automatically generated](media/1318537aef2bf2dcaf162b511b8145c2.png)

- Select **Next**.

- In the **Add more details** window, make sure to answer all questions in as much detail as possible. Make sure to select **Include data about Remote Desktop (Default)**.

    ![Graphical user interface Description automatically generated](media/48da9fd8bc5c188fc0a87c2edb0978f8.png)

    If you'd like to add a video recording of the issue, select **Start recording** and do the process that led to the issue happening. When you're done, return to the browser, then test the video to make sure it recorded properly.

    Once you're done, agree to send the attached files and diagnostics to Microsoft, then select **Submit**.

    ![Graphical user interface, text, application, email Description automatically generated](media/5bb373dc66fbe3cd9ad17b5a0d1c8193.png)

## Known issues and limitations

- Multimedia Redirection only works via the Windows Desktop Client for Azure Virtual Desktop. MMR does not work via the Web Client.

- MMR does not work on protected content, so videos from Pluralsight and Netflix will not work.

- MMR is disable on all sites except YouTube during the public preview. We enabled a way, via the extension, to allow MMR on to work on all sites, so that companies can test MMR on their internal websites.

- In internal testing, on rare occasion the extensions fail to install via the MSI installer. If this occurs, please install the MMR extensions from the Microsoft Edge Store or Google Chrome store. Direct links to the extensions are provided below.

    - Link to [MMR browser extension](https://microsoftedge.microsoft.com/addons/detail/wvd-multimedia-redirectio/joeclbldhdmoijbaagobkhlpfjglcihd) for Microsoft Edge.

    - Link to [MMR browser extension](https://chrome.google.com/webstore/detail/wvd-multimedia-redirectio/lfmemoeeciijgkjkgbgikoonlkabmlno) for Google Chrome.

- Installing the MMR extensions via the MSI on host machines will prompt users to accept the extension on first run or prompt the user with an warning or error. If users deny this prompt, it can cause the extensions not to load. IT admins can conversely install the extensions via group policy.

- When the video window is resized, the video adjust slower than the window resize. This can also been seen when minimizing and maximizing the window
