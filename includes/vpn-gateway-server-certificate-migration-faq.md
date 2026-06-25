---
author: cherylmc
ms.author: cherylmc
ms.date: 06/04/2026
ms.service: azure-vpn-gateway
ms.topic: include
---

### General information

#### Do I need to migrate the gateway root certificate, or does it happen automatically?

Microsoft migrates the gateway root certificate on the backend. However, you must generate an updated VPN client profile and distribute it to your users before the migration deadline to maintain connectivity after the migration.

#### Do I need to update my VPN client profile even if I'm not using certificate authentication for my P2S VPN?

Yes. The gateway certificate is used for authentication regardless of the authentication method configured for your P2S VPN.

#### Why do I need to update my VPN client profile?

The updated profile contains the root certificate information needed to establish trust with the gateway after the migration. Without it, your P2S VPN connection fails after the gateway migrates to the new certificate. The VPN client profile update process is the same one you use for any gateway configuration change that affects P2S VPN, such as adding an authentication method or changing tunnel types. In this case, the change is to the gateway's root certificate, which is a critical component of authentication for all P2S VPN connections.

#### Does the certificate migration change my VPN gateway configuration?

No. Your tunnel type, authentication method, address pool, and routing configuration remain unchanged. Only the client profile needs to be updated.

#### Will end users experience a connectivity disruption?

If end users don't have the new profile installed, they won't be able to connect after the gateway certificate is migrated.

#### Why does my VPN gateway have both the old and new root certificates?

During gateway certificate migration, Azure VPN Gateway temporarily supports both the old and new root certificates. This transition period gives administrators time to download and redistribute updated P2S VPN client profiles to users and devices. After the migration deadline end of January'2027, only the new certificate is valid.

### Prerequisites and permissions

#### How do I know if I need to take action?

You receive a notification from Microsoft that identifies your gateway as affected. If you receive this notification, follow the steps in [How to update point-to-site VPN clients](../articles/vpn-gateway/point-to-site-user-vpn-profile-update.md).

#### Who can download the updated VPN client profile?

Anyone with the Azure RBAC permissions to access the virtual network gateway or Virtual WAN resource and download VPN client configurations can generate and download the updated profile.

### Generate and install the updated profile

#### How do I generate a new VPN client profile?

For step-by-step guidance, see [How to update point-to-site VPN clients](../articles/vpn-gateway/point-to-site-user-vpn-profile-update.md).

#### What does the downloaded ZIP file contain?

The ZIP file contains updated client profile files for all supported VPN client types. Extract it to a local directory to access the configuration files.

#### Do I need to generate a separate profile for each VPN client type?

No. A single download produces profiles for all supported client types. However, you must generate a new profile for each affected gateway.

#### How do I install the updated profile?

For installation steps, see [How to update point-to-site VPN clients](../articles/vpn-gateway/point-to-site-user-vpn-profile-update.md).

#### What if a connection profile for this gateway already exists on my client device?

The new profile doesn't automatically overwrite the existing profile. Follow the installation steps in [Distribute and install the updated profile](../articles/vpn-gateway/point-to-site-user-vpn-profile-update.md#distribute-and-install-the-updated-profile) to add the new configuration to the client.

### Distribution and rollout

#### Who is responsible for distributing the updated profile?

The VPN administrator or IT team responsible for the gateway distributes the updated profile to all end users who connect through P2S VPN.

#### Do all users need to update, or just some?

All end users who connect through the affected gateway by using P2S VPN must install the updated profile.

#### I have a large number of users. How should I handle the rollout?

For organizations with many P2S VPN users, we recommend that you:

- Generate the new profile as early as possible.
- Use your existing endpoint management tools to push the updated profile to managed devices.
- Communicate the change to users in advance with clear instructions.
- Test the new profile with a small group before broad rollout.
- Monitor your gateway for old-profile connection attempts after the migration.

#### My users manage their own VPN client configuration. What should I do?

For decentralized organizations where end users self-manage their VPN profiles:

- Send a direct communication to all P2S VPN users that explains the required action.
- Provide the new profile file or clear instructions for how to download it.
- Set a deadline well before the migration.

### Connectivity and troubleshooting

#### How do I verify that the updated profile works?

After you install the updated profile, establish a P2S VPN connection and verify end-to-end connectivity with your Azure resources.

#### My connection is failing after I install the updated profile. What should I do?

Try the following steps:

1. Confirm that you downloaded the profile after receiving notice that the updated profile is available.
1. Verify that you used the correct profile file and imported all root certificates required for your client type.
1. Troubleshoot by using the [Azure VPN Gateway troubleshooting documentation](/troubleshoot/azure/vpn-gateway/welcome-vpn-gateway).
1. If issues persist, create an [Azure support request](https://azure.microsoft.com/support/).

#### My VPN connection broke before I received the update notification. What happened?

In some cases, your VPN client software or operating system might distrust the previous root certificate before the updated profile is available for your gateway type.

To restore connectivity, install the previous root certificate on your client device. Then, refer to the [troubleshooting documentation](/troubleshoot/azure/vpn-gateway/welcome-vpn-gateway) and watch for a notification from Microsoft with updated profile instructions. If you need assistance, contact [Microsoft Support](https://azure.microsoft.com/support/).

### Billing

#### Is there any cost associated with this change?

No. There are no pricing changes associated with generating or installing a new VPN client profile.
