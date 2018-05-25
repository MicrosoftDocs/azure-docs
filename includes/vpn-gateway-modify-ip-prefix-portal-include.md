---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 03/21/2018
 ms.author: cherylmc
 ms.custom: include file
---
### <a name="noconnection"></a>To modify local network gateway IP address prefixes - no gateway connection

#### To add additional address prefixes:

1. On the Local Network Gateway resource, in the **Settings** section, click **Configuration**.
2. Add the IP address space in the *Add additional address range* box.
3. Click **Save** to save your settings.

#### To remove address prefixes:

1. On the Local Network Gateway resource, in the **Settings** section, click **Configuration**.
2. Click the **'...'** on the line containing the prefix you want to remove.
3. Click **Remove**.
4. Click **Save** to save your settings.

### <a name="withconnection"></a>To modify local network gateway IP address prefixes - existing gateway connection

If you have a gateway connection and want to add or remove the IP address prefixes contained in your local network gateway, you need to do the following steps, in order. This results in some downtime for your VPN connection. When modifying IP address prefixes, you don't need to delete the VPN gateway. You only need to remove the connection.

#### 1. Remove the connection.

1. On the Local Network Gateway resource, in the **Settings** section, click **Connections**.
2. Click the **...** on the line for each connection, then click **Delete**.
3. Click **Save** to save your settings.

#### 2. Modify the address prefixes.

To add additional address prefixes:

1. On the Local Network Gateway resource, in the **Settings** section, click **Configuration**.
2. Add the IP address space.
3. Click **Save** to save your settings.

To remove address prefixes:

1. On the Local Network Gateway resource, in the **Settings** section, click **Configuration**.
2. Click the **...** on the line containing the prefix you want to remove.
3. Click **Remove**.
4. Click **Save** to save your settings.

#### 3. Recreate the connection.

1. Navigate to the Virtual Network Gateway for your VNet. (Not the Local Network Gateway.)
2. On the Virtual Network Gateway, in the **Settings** section, click **Connections**.
3. Click the **+ Add** to open the **Add connection** blade.
4. Recreate your connection.
5. Click **OK** to create the connection.