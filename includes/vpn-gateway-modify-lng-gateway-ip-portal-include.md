### <a name="gwipnoconnection"></a> To modify the local network gateway Ip address - no gateway connection

If the VPN device that you want to connect to has changed its public IP address, you need to modify the local network gateway to reflect that change. Use the example to modify a local network gateway that does not have a gateway connection. When modifying this value, you can also modify the address prefixes at the same time.

1. On the Local Network Gateway resource, in the **Settings** section, click **Configuration**.
2. In the **IP address** box, modify the IP address.
3. Click **Save** to save the settings.

### <a name="gwipwithconnection"></a>To modify the local network gateway 'GatewayIpAddress' - existing gateway connection

If the VPN device that you want to connect to has changed its public IP address, you need to modify the local network gateway to reflect that change. If a gateway connection already exists, you first need to remove the connection. After the connection is removed, you can modify the gateway IP address and recreate a new connection. You can also modify the address prefixes at the same time. This results in some downtime for your VPN connection. When modifying the gateway IP address, you don't need to delete the VPN gateway. You only need to remove the connection.
 

#### 1. Remove the connection.

1. On the Local Network Gateway resource, in the **Settings** section, click **Connections**.
2. Click the **...** on the line for each connection, then click **Delete**.
3. Click **Save** to save your settings.

#### 2. Modify the IP address.

You can also modify the address prefixes at the same time.

1. In the **IP address** box, modify the IP address.
2. Click **Save** to save the settings.

#### 3. Recreate the connections.

1. On the Local Network Gateway resource, in the **Settings** section, click **Connections**.
2. Click the **+ Add** to open the **Add connection** blade.
3. Recreate your connection.
3. Click **OK** to create the connection.
4. Repeat for additional connections.