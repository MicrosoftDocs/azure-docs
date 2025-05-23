---
author: cherylmc
ms.author: cherylmc
ms.date: 04/23/2025
ms.service: azure-virtual-wan
ms.topic: include
---
1. Open the Network Policy Server console, and then double-click **Policies**.
1. In the console tree, right-click **Network Policies**, and click **New**. The New Network Policy wizard opens.
1. Use the New Network Policy wizard to create a policy. Advance through the policy pages, specifying the following settings:

   |Page | Setting | Value |
   |---|---|---|
   | Specify Network Policy Name and Connection Type | Policy name | Enter a name for the policy. |
   |  | Type of network access server | From the dropdown, select **Remote Access Server (VPN-Dial up)**. |
   |Specify Conditions | Conditions | Click **Add** and select **User Groups**. Then, click **Add**. You can also use other Network Policy conditions supported by your RADIUS server vendor.|
   | User Groups | Add Groups | Click **Add Groups** and select the Active Directory groups that will use this policy. Click **OK** and **OK**, then click **Next**. |
   | Specify Access Permission | Access Permission | Select **Access granted**, then **Next**. |
   | Configuration Authentication Methods | Authentication methods | Make any necessary changes. |
   | Configure Constraints | Constraints | Select any necessary settings. |
   | Configure Settings | RADIUS Attributes | Click to highlight **Vendor Specific**, then click **Add**. |
   | Add Vendor Specific Attribute | Attributes| Scroll to select **Vendor-Specific**, then click **Add**. |
   | Attribute Information| Attribute values| Select **Add**. |
   | Vendor-Specific Attribute Information | Specify network access server vendor/Specify conforms| Choose **Select from list** and select **Microsoft**.<br>Select **Yes. It conforms**. Then, click **Configure Attribute**. |
   | Configure VSA (RFC Compliant) | Vendor-assigned attribute number | 65 |
   |  | Attribute format | Hexadecimal |
   | |Attribute value | Set this value to the VSA value configured on your VPN server configuration, such as 6ad1bd08. The VSA value should begin with **6ad1bd**.|

1. Click **OK**, and **OK** again. Then, **Close** to return to the **Configure Settings** page.
1. Click **Next**, and then **Finish** to create your policy.