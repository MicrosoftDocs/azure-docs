---
 ms.topic: include
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.date: 04/28/2026
 ms.author: cherylmc
---

The following are some common issues that you might encounter when configuring policy groups and IP address pools for P2S connections, along with troubleshooting steps to help you resolve them.

* **Verify packets have the right attributes?** Wireshark or another packet capture can be run in NPS mode and decrypt packets using shared key. You can validate packets are being sent from your RADIUS server to the point-to-site VPN gateway with the right RADIUS VSA configured.

* **Are users getting wrong IP assigned?** Set up and check NPS Event logging for authentication whether or not users are matching policies.

* **Having issues with address pools?** Every address pool is specified on the gateway. Address pools are split into two address pools and assigned to each active-active instance in a point-to-site VPN gateway pair. These split addresses should show up in the effective route table. For example, if you specify **10.0.0.0/24**, you should see two "/25" routes in the effective route table. If this isn't the case, try changing the address pools defined on the gateway.

* **P2S client not able to receive routes?** Make sure all point-to-site VPN connection configurations are associated to the defaultRouteTable and propagate to the same set of route tables. This should be configured automatically if you're using portal, but if you're using REST, PowerShell or CLI, make sure all propagations and associations are set appropriately.

* **Not able to enable Multipool using Azure VPN client?** If you're using the Azure VPN client, make sure the Azure VPN client installed on user devices is the latest version. You need to download the client again to enable this feature.

* **All users getting assigned to Default group?** If you're using Microsoft Entra authentication, make sure the tenant URL input in the server configuration `(https://login.microsoftonline.com/<tenant ID>)` doesn't end in a `\`. If the URL is input to end with `\`, the gateway won't be able to properly process Microsoft Entra user groups, and all users are assigned to the default group. To remediate, modify the server configuration to remove the trailing `\` and modify the address pools configured on the gateway to apply the changes to the gateway. This is a known issue.

* **Trying to invite external users to use Multipool feature?** If you're using Microsoft Entra authentication and you plan to invite users who are external (users who aren't part of the Microsoft Entra domain configured on the VPN gateway) to connect to the VPN gateway, make sure that the user type of the external user is **Member** and not **Guest**. Also, make sure that the "Name" of the user is set to the user's email address. If the user type and name of the connecting user isn't set correctly, or you can't set an external member to be a "Member" of your Microsoft Entra domain, the connecting user is assigned to the default group and assigned an IP from the default IP address pool.